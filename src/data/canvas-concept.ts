import type { AppState, QuickMemo } from '../domain/model';
import { CONCEPT_MEMO_PREFIX, conceptText } from '../domain/canvas-concept';
import { storagePrefix, type StudyRepository } from './repository';
import {
  archiveDamagedDraft,
  clearStoredDraft,
  readRescuedDraft,
  rescueWithoutOverwrite,
  storeDraftSafely,
} from './draft-safety';

export interface ConceptDraft {
  id: string;
  ownerId: string | null;
  baseVersion: number;
  name: string;
  description: string;
}
export function newConceptDraft(ownerId: string | null = null): ConceptDraft {
  return {
    id: CONCEPT_MEMO_PREFIX + crypto.randomUUID(),
    ownerId,
    baseVersion: 0,
    name: '',
    description: '',
  };
}
export function editConceptDraft(memo: QuickMemo): ConceptDraft {
  return {
    id: memo.id,
    ownerId: memo.ownerId,
    baseVersion: memo.version,
    ...conceptText(memo.body),
  };
}
export function conceptDraftKey(data: AppState, memoId?: string) {
  const sessionKey = 'study-space:canvas-concept-tab:v1';
  let tab = sessionStorage.getItem(sessionKey);
  if (!tab) {
    tab = crypto.randomUUID();
    sessionStorage.setItem(sessionKey, tab);
  }
  return `${storagePrefix(data)}:canvas-concept-draft:${tab}:${memoId ?? 'new'}:v1`;
}
function validate(value: unknown): asserts value is ConceptDraft {
  const d = value as ConceptDraft | null;
  if (
    !d ||
    typeof d.id !== 'string' ||
    !d.id.startsWith(CONCEPT_MEMO_PREFIX) ||
    !(d.ownerId === null || typeof d.ownerId === 'string') ||
    !Number.isSafeInteger(d.baseVersion) ||
    d.baseVersion < 0 ||
    typeof d.name !== 'string' ||
    typeof d.description !== 'string'
  )
    throw Error('개념 카드 초안을 읽지 못했습니다. 원문은 보존했습니다.');
}
export function readConceptDraft(key: string) {
  const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  if (!raw) return { raw, draft: null };
  const draft: unknown = JSON.parse(raw);
  validate(draft);
  return { raw, draft };
}
export function writeConceptDraft(key: string, draft: ConceptDraft, previous: string | null) {
  validate(draft);
  const raw = JSON.stringify(draft);
  if ((readRescuedDraft(key) ?? localStorage.getItem(key)) !== previous) {
    rescueWithoutOverwrite(key, raw);
    throw Error('다른 곳에서 초안이 바뀌었습니다. 현재 입력도 보존했습니다.');
  }
  storeDraftSafely(key, raw);
  return raw;
}
export function clearConceptDraft(key: string, previous: string | null) {
  if ((readRescuedDraft(key) ?? localStorage.getItem(key)) !== previous)
    throw Error('초안이 바뀌어 현재 내용을 그대로 남겼습니다.');
  clearStoredDraft(key);
}
export function preserveConceptDraft(key: string) {
  archiveDamagedDraft(key, '개념 카드 원문 보관');
}
export function saveConceptMemo(repository: StudyRepository, draft: ConceptDraft) {
  validate(draft);
  if (!draft.name.trim() || /[\r\n]/.test(draft.name))
    throw Error('개념 이름을 한 줄로 적어 주세요.');
  const data = repository.getSnapshot(),
    existing = data.memos?.find((m) => m.id === draft.id);
  const body = `${draft.name}${draft.description ? `\n${draft.description}` : ''}`;
  if (
    existing &&
    !existing.deletedAt &&
    existing.body === body &&
    existing.ownerId === draft.ownerId &&
    existing.version >= draft.baseVersion
  )
    return data;
  return repository.execute({
    type: 'saveMemo',
    id: draft.id,
    ownerId: draft.ownerId,
    body,
    strokes: existing?.strokes ?? [],
    expectedVersion: draft.baseVersion,
    opId: crypto.randomUUID(),
    at: new Date().toISOString(),
    userId: data.userId,
    namespace: data.namespace,
  });
}
