import LZString from 'lz-string';
import { validateState } from '../domain/commands';
import { DomainError, type AppState, type EntityCollection } from '../domain/model';
/** PostgreSQL JSONB cannot store NUL or lone surrogates. Preserve exact UTF-16. */
export function packServerState(state: AppState, operationId: string) {
  validateState(state);
  const raw = JSON.stringify(state), encoded = LZString.compressToBase64(raw);
  if (LZString.decompressFromBase64(encoded) !== raw) throw new DomainError('ENCODING', '원문 보존을 확인하지 못했습니다. 저장하지 않았습니다.');
  const collections: (EntityCollection | 'revisions')[] = ['semesters','subjects','nodes','sessions','records','narratives','criteria','criteriaAssignments','memos','learningPlans','revisions'];
  return { userId: state.userId, namespace: state.namespace, schemaVersion: state.schemaVersion,
    encoding: 'lz-base64-utf16-v1', encoded,
    appliedOps: { [operationId]: state.appliedOps[operationId] },
    ...Object.fromEntries(collections.map(name => [name, (state[name] ?? []).map(row => ({ userId: row.userId, namespace: row.namespace }))])) };
}
export function unpackServerState(value: unknown): AppState {
  const stored = value as Record<string, unknown>;
  if (stored.encoding === undefined) { validateState(value as AppState); return value as AppState; }
  if (stored.encoding !== 'lz-base64-utf16-v1' || typeof stored.encoded !== 'string') throw new DomainError('ENCODING', '서버 원문 형식을 읽지 못했습니다.');
  const raw = LZString.decompressFromBase64(stored.encoded);
  if (!raw) throw new DomainError('ENCODING', '서버 원문을 읽지 못했습니다.');
  const state = JSON.parse(raw) as AppState; validateState(state);
  if (state.userId !== stored.userId || state.namespace !== stored.namespace) throw new DomainError('OWNERSHIP', '서버 원문의 소유권을 확인하지 못했습니다.');
  return state;
}
