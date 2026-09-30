import type { AppState, Command } from '../domain/model';
import { validateMemoContent } from '../domain/memo';
import { freshRecall, type RecallDraft, type RecallSession } from '../domain/topic-recall';
import { readRescuedDraft, storeDraftSafely } from './draft-safety';

export type RecallRepository = { getSnapshot(): AppState; execute(command: Command): AppState };
export function recallKey(data: Pick<AppState, 'namespace' | 'userId'>) {
  return `study-space:${data.namespace}:draft:topic-recall:${encodeURIComponent(data.userId)}`;
}
function validate(value: unknown): asserts value is RecallSession {
  const row = value as RecallSession | null;
  if (!row || row.version !== 1 || typeof row.subjectId !== 'string' || typeof row.unitId !== 'string'
    || !(row.currentId === null || typeof row.currentId === 'string') || !Number.isSafeInteger(row.round) || row.round < 1
    || !Array.isArray(row.seen) || !row.seen.every(id => typeof id === 'string') || new Set(row.seen).size !== row.seen.length
    || !row.drafts || typeof row.drafts !== 'object' || Array.isArray(row.drafts)
    || !Object.values(row.drafts).every(draft => draft && typeof draft.memoId === 'string' && draft.memoId.trim() && typeof draft.body === 'string')) {
    throw new Error('주제 카드 초안을 읽지 못했습니다. 원문을 덮어쓰지 않았습니다.');
  }
  for (const draft of Object.values(row.drafts)) validateMemoContent({ body: draft.body, ownerId: null, strokes: draft.strokes ?? [] });
}
export function readRecall(data: Pick<AppState, 'namespace' | 'userId'>): RecallSession {
  const key = recallKey(data), raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  if (raw === null) return freshRecall();
  const value: unknown = JSON.parse(raw); validate(value); return value;
}
export function writeRecall(data: Pick<AppState, 'namespace' | 'userId'>, session: RecallSession) {
  validate(session); storeDraftSafely(recallKey(data), JSON.stringify(session));
}
/** Reuse the draft's identity after a saved memo / draft-cleanup partial failure. */
export function saveRecallMemo(repository: RecallRepository, topicId: string, draft: RecallDraft): AppState {
  const data = repository.getSnapshot();
  validateMemoContent({ body: draft.body, ownerId: topicId, strokes: draft.strokes ?? [] });
  if (!draft.body.trim() && !draft.strokes?.length) throw new Error('기억나는 설명을 적은 뒤 저장해 주세요.');
  const existing = data.memos?.find(memo => memo.id === draft.memoId);
  if (existing) {
    if (existing.ownerId === topicId && existing.body === draft.body && JSON.stringify(existing.strokes) === JSON.stringify(draft.strokes ?? []) && !existing.deletedAt) return data;
    throw new Error('이 답변 메모가 다른 곳에서 바뀌었습니다. 입력한 글은 초안에 남아 있습니다. 별도 메모로 저장해 주세요.');
  }
  return repository.execute({ type: 'saveMemo', id: draft.memoId, ownerId: topicId, body: draft.body, strokes: draft.strokes ?? [], expectedVersion: 0,
    opId: crypto.randomUUID(), at: new Date().toISOString(), userId: data.userId, namespace: data.namespace });
}
