import { access } from './material-file-db';
import { validVectorWorkspace, type VectorWorkspace } from './vector-calculus-view';

interface Recovery {
  version: 1;
  baseRaw: string | null;
  workspace: VectorWorkspace;
}
const recoveryKey = (key: string) => `${key}:recovery:v1`;
const queues = new Map<string, Promise<unknown>>();
function ordered<T>(key: string, run: () => Promise<T>): Promise<T> {
  const flight = (queues.get(key) ?? Promise.resolve()).catch(() => {}).then(run);
  queues.set(key, flight);
  void flight
    .finally(() => {
      if (queues.get(key) === flight) queues.delete(key);
    })
    .catch(() => {});
  return flight;
}
/** Reuse the device's existing IndexedDB draft store. Completion is the durability receipt. */
export function retainVectorRecovery(
  key: string,
  baseRaw: string | null,
  workspace: VectorWorkspace,
) {
  return ordered(key, async () => {
    if (!validVectorWorkspace(workspace))
      throw Error('복구 사본 형식을 확인할 수 없다. 현재 입력을 유지했다.');
    await access('drafts', 'readwrite', (s) =>
      s.put({ version: 1, baseRaw, workspace } satisfies Recovery, recoveryKey(key)),
    );
  });
}
export function clearVectorRecovery(key: string) {
  return ordered(key, () => access('drafts', 'readwrite', (s) => s.delete(recoveryKey(key))));
}
export async function readVectorRecovery(key: string): Promise<VectorWorkspace | null> {
  const value = await access<Recovery | undefined>('drafts', 'readonly', (s) =>
    s.get(recoveryKey(key)),
  );
  if (!value) return null;
  if (
    value.version !== 1 ||
    !(value.baseRaw === null || typeof value.baseRaw === 'string') ||
    !validVectorWorkspace(value.workspace)
  )
    throw Error('복구 사본을 읽지 못했다. 사본을 덮어쓰지 않았다.');
  if (localStorage.getItem(key) !== value.baseRaw)
    throw Error(
      '복구 사본과 현재 저장 원문이 함께 남아 있다. 다른 창의 변경을 보호하므로 자동으로 덮어쓰지 않았다.',
    );
  return value.workspace;
}
export async function vectorRecoveryRaw(key: string) {
  return access<Recovery | undefined>('drafts', 'readonly', (s) => s.get(recoveryKey(key)));
}

interface ReadingRecovery<T> {
  version: 1;
  baseRaw: string | null;
  reading: T;
}
export function retainVectorReadingRecovery<T>(key: string, baseRaw: string | null, reading: T) {
  return ordered(key, () =>
    access('drafts', 'readwrite', (s) => s.put({ version: 1, baseRaw, reading }, recoveryKey(key))),
  );
}
export async function readVectorReadingRecovery<T>(
  key: string,
  valid: (v: T) => boolean,
): Promise<T | null> {
  const v = await access<ReadingRecovery<T> | undefined>('drafts', 'readonly', (s) =>
    s.get(recoveryKey(key)),
  );
  if (!v) return null;
  if (
    v.version !== 1 ||
    !(v.baseRaw === null || typeof v.baseRaw === 'string') ||
    !valid(v.reading)
  )
    throw Error('원문 읽기 복구 사본을 확인하지 못했다. 사본을 보존했다.');
  if (localStorage.getItem(key) !== v.baseRaw)
    throw Error(
      '원문 위치의 저장 값과 복구 사본이 다르다. 다른 변경을 보호하며 자동으로 덮어쓰지 않았다.',
    );
  return v.reading;
}
