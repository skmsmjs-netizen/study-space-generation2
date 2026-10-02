import { DomainError } from '../domain/model';

export interface WithdrawalResult { withdrawn: boolean; requestId: string }
export interface WithdrawalObject { bucket: string; name: string }
export interface WithdrawalBackend {
  begin(userId: string, requestId: string): Promise<{ requestId: string }>;
  batch(userId: string): Promise<WithdrawalObject[]>;
  remove(bucket: string, names: string[]): Promise<void>;
  finish(userId: string): Promise<void>;
}
export const validWithdrawalId = (id: unknown): id is string => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

/** Each call removes one bounded batch. The database keeps progress across sessions. */
export async function withdrawAccountFiles(backend: WithdrawalBackend, userId: string, requestId: string): Promise<WithdrawalResult> {
  const started = await backend.begin(userId, requestId);
  // A second device first learns the original receipt secret before it can finalize.
  if (started.requestId !== requestId) return { withdrawn: false, requestId: started.requestId };
  const objects = await backend.batch(userId);
  const buckets = new Map<string, string[]>();
  for (const object of objects) {
    if (!object || typeof object.bucket !== 'string' || typeof object.name !== 'string') throw new DomainError('SERVER_ERROR', '첨부 파일 목록을 확인하지 못했습니다. 탈퇴 처리를 다시 시도해 주세요.');
    const names = buckets.get(object.bucket) ?? [];
    names.push(object.name); buckets.set(object.bucket, names);
  }
  for (const [bucket, names] of buckets) await backend.remove(bucket, names);
  if ((await backend.batch(userId)).length) return { withdrawn: false, requestId };
  // Final SQL checks storage again and commits the receipt with Auth deletion.
  await backend.finish(userId);
  return { withdrawn: true, requestId };
}
