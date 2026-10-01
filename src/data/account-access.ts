import type { SupabaseClient } from '@supabase/supabase-js';
import { DomainError } from '../domain/model';
import type { AccountAccess, AccountPage, AccessStatus } from '../server/account-access';
export interface AccountAccessClient {
  read(): Promise<AccountAccess>;
  list(cursor?: string | null): Promise<AccountPage>;
  set(target: string, status: AccessStatus, version: number): Promise<void>;
}
export function accountAccessClient(client: SupabaseClient): AccountAccessClient {
  async function request<T>(body: object): Promise<T> {
    const { data, error } = await client.functions.invoke('study-command', { timeout: 20000, body });
    if (error) {
      let result: {code?: string; message?: string} = {};
      try { if (error.context instanceof Response) result = await error.context.json(); } catch { /* No permission is inferred from a failed request. */ }
      throw new DomainError(result.code ?? 'SERVER_ERROR', result.message ?? '계정 이용 상태를 확인하지 못했습니다. 잠시 후 다시 확인해 주세요.');
    }
    return data as T;
  }
  return {
    read: () => request<AccountAccess>({ action: 'access' }),
    list: (cursor = null) => request<AccountPage>({ action: 'admin-list', cursor }),
    set: async (target, status, version) => { await request({ action: 'admin-set', target, status, version }); },
  };
}
