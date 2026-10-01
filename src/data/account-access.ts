import type { SupabaseClient } from '@supabase/supabase-js';
import type { AccountAccess, AccountPage, AccessStatus } from '../server/account-access';
import { invokeAuthenticatedFunction } from './authenticated-function';
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
    withdraw: async () => { await request({ action: 'withdraw', confirmation: '탈퇴' }, true); },
    read: () => request<AccountAccess>({ action: 'access' }),
    list: (cursor = null) => request<AccountPage>({ action: 'admin-list', cursor }),
    set: async (target, status, version) => { await request({ action: 'admin-set', target, status, version }); },
  };
}
