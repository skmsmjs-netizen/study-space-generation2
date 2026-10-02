import type { SupabaseClient } from '@supabase/supabase-js';
import type { AccountAccess, AccountPage, AccessStatus } from '../server/account-access';
import { invokeAuthenticatedFunction } from './authenticated-function';
import { DomainError } from '../domain/model';
import { readServerConfig } from './supabase-client';
import { pendingWithdrawals, saveWithdrawalReceipt, withdrawalCompleted } from './withdrawal-recovery';
import { validWithdrawalId, type WithdrawalResult } from '../server/account-withdrawal';
export interface AccountAccessClient {
  saveName?(name: string): Promise<AccountAccess>;
  withdraw?(): Promise<void>;
  read(): Promise<AccountAccess>;
  list(cursor?: string | null): Promise<AccountPage>;
  set(target: string, status: AccessStatus, version: number): Promise<void>;
}
export function accountAccessClient(client: SupabaseClient): AccountAccessClient {
  async function request<T>(body: object, allowSignedOutAfterSuccess = false): Promise<T> {
    return invokeAuthenticatedFunction<T>(client, 'study-command', { timeout: 20000, body }, { allowSignedOutAfterSuccess });
  }
  return {
    saveName: name => request<AccountAccess>({ action: 'profile-set', name }),
    withdraw: async () => {
      const session = await client.auth.getSession();
      const userId = session.data.session?.user.id;
      if (session.error || !userId) throw new DomainError('AUTH_REQUIRED', '탈퇴 처리를 이어가려면 다시 로그인해 주세요.');
      let receipt = pendingWithdrawals().find(value => value.userId === userId) ?? { userId, requestId: crypto.randomUUID() };
      // Persist before sending the irreversible request, including response loss.
      saveWithdrawalReceipt(receipt);
      for (let batch = 0; batch < 20; batch++) {
        try {
          const result = await invokeAuthenticatedFunction<WithdrawalResult>(client, 'study-command', { timeout: 20000, body: { action: 'withdraw', confirmation: '탈퇴', requestId: receipt.requestId } }, { expectedOwner: userId, allowSignedOutAfterSuccess: true });
          if (!result || typeof result.withdrawn !== 'boolean') throw Error('탈퇴 결과를 확인하지 못했습니다.');
          if (result.requestId !== undefined) {
            if (!validWithdrawalId(result.requestId)) throw Error('탈퇴 결과를 확인하지 못했습니다.');
            receipt = { userId, requestId: result.requestId }; saveWithdrawalReceipt(receipt);
          }
          if (result.withdrawn) return;
        } catch (error) {
          const config = readServerConfig();
          if (config && await withdrawalCompleted(config, receipt.requestId).catch(() => false)) return;
          throw error;
        }
      }
      throw Error('첨부 파일 정리를 진행했습니다. 남은 파일은 탈퇴 처리를 다시 시도하면 이어서 정리합니다.');
    },
    read: () => request<AccountAccess>({ action: 'access' }),
    list: (cursor = null) => request<AccountPage>({ action: 'admin-list', cursor }),
    set: async (target, status, version) => { await request({ action: 'admin-set', target, status, version }); },
  };
}
