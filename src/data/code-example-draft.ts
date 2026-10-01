import type { AppState, CodeExampleContent } from '../domain/model';
import { validateCodeContent } from '../domain/code-example';
import { storagePrefix } from './repository';
import {
  readRescuedDraft,
  rescueWithoutOverwrite,
  storeDraftSafely,
  clearStoredDraft,
} from './draft-safety';

export interface CodeExampleDraft {
  id: string;
  baseVersion: number;
  content: CodeExampleContent;
}
export const codeDraftKey = (data: AppState, id: string) =>
  `${storagePrefix(data)}:code-example-draft:${encodeURIComponent(id)}:v1`;
export function readCodeDraft(key: string, id: string): CodeExampleDraft | null {
  const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  if (!raw) return null;
  const draft = JSON.parse(raw) as CodeExampleDraft;
  if (
    !draft ||
    draft.id !== id ||
    !Number.isSafeInteger(draft.baseVersion) ||
    draft.baseVersion < 0
  )
    throw Error('코드 예제의 초안을 읽지 못했습니다. 원문을 보존했습니다.');
  validateCodeContent(draft.content);
  return draft;
}
export function writeCodeDraft(key: string, draft: CodeExampleDraft) {
  validateCodeContent(draft.content);
  storeDraftSafely(key, JSON.stringify(draft));
}
export function retainCodeDraft(key: string, draft: CodeExampleDraft) {
  rescueWithoutOverwrite(key, JSON.stringify(draft));
}
export const clearCodeDraft = clearStoredDraft;
