import type { AppState, QuickMemo } from '../domain/model';
import { validateMemoContent } from '../domain/memo';
import { readRescuedDraft, storeDraftSafely } from './draft-safety';
import { decodeStoredText, encodeStoredText } from './storage-codec';

export interface MemoDraft { id: string; baseVersion: number; ownerId: string | null; body: string; strokes: QuickMemo['strokes']; document?: QuickMemo['document'] }
export function memoDraftKey(data: Pick<AppState, 'namespace' | 'userId'>, id: string) {
  return `study-space:${data.namespace}:draft:quick-memo:${encodeURIComponent(data.userId)}:${encodeURIComponent(id)}`;
}
export function readMemoDraft(key: string, id: string): MemoDraft | null {
  const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  if (!raw) return null;
  const draft: MemoDraft = JSON.parse(decodeStoredText(raw));
  validateMemoContent(draft);
  if (draft.id !== id || !Number.isSafeInteger(draft.baseVersion) || draft.baseVersion < 1) throw new Error('메모 초안의 연결을 확인하지 못했습니다. 저장된 원문은 그대로 두었습니다.');
  return draft;
}
export function writeMemoDraft(key: string, draft: MemoDraft) {
  validateMemoContent(draft);
  storeDraftSafely(key, encodeStoredText(JSON.stringify(draft)));
}
export function sameMemo(a: Pick<QuickMemo, 'body' | 'strokes' | 'ownerId' | 'document'>, b: Pick<QuickMemo, 'body' | 'strokes' | 'ownerId' | 'document'>) {
  return a.body === b.body && a.ownerId === b.ownerId && JSON.stringify(a.strokes) === JSON.stringify(b.strokes) && JSON.stringify(a.document) === JSON.stringify(b.document);
}
