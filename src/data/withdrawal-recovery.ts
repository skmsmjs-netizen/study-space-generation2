import { validWithdrawalId } from '../server/account-withdrawal';
import type { PublicServerConfig } from './supabase-client';

const prefix = 'study-space:withdrawal:v1:';
export interface WithdrawalReceipt { userId: string; requestId: string }
export function pendingWithdrawals(storage: Storage = localStorage): WithdrawalReceipt[] {
  const receipts: WithdrawalReceipt[] = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index); if (!key?.startsWith(prefix)) continue;
    try { const value = JSON.parse(storage.getItem(key)!); if (typeof value.userId === 'string' && key === prefix + value.userId && validWithdrawalId(value.requestId)) receipts.push(value); } catch { /* Preserve an unreadable receipt. */ }
  }
  return receipts;
}
export function saveWithdrawalReceipt(receipt: WithdrawalReceipt, storage: Storage = localStorage) {
  const key = prefix + receipt.userId; const raw = JSON.stringify(receipt);
  storage.setItem(key, raw);
  if (storage.getItem(key) !== raw) throw Error('탈퇴 진행 상태를 이 기기에 보관하지 못했습니다. 기기의 저장 공간을 확인한 뒤 다시 시도해 주세요.');
}
export function forgetWithdrawalReceipt(userId: string, storage: Storage = localStorage) { storage.removeItem(prefix + userId); }
export async function withdrawalCompleted(config: PublicServerConfig, requestId: string): Promise<boolean> {
  // A completed deletion has no live session; use only the public API key.
  const response = await fetch(`${config.url}/functions/v1/study-command/withdrawal-status`, {
    method: 'POST', headers: { apikey: config.publishableKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId }), signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw Error('탈퇴 완료 여부를 확인하지 못했습니다. 연결 후 다시 시도해 주세요.');
  return (await response.json()).withdrawn === true;
}
