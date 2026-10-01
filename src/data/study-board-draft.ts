import type { AppState, Command } from '../domain/model';
import { validateBoard, type BoardContent, type BoardCard } from '../domain/study-board';
import { storagePrefix } from './repository';
import { clearStoredDraft, readRescuedDraft, storeDraftSafely } from './draft-safety';
export interface BoardDraft {
  baseVersion: number;
  content: BoardContent;
  editor: BoardCard | null;
  operation?: Command;
}
export function boardDraftKey(data: AppState) {
  const tabKey = 'study-space:board-tab:v1';
  let tab = sessionStorage.getItem(tabKey);
  if (!tab) {
    tab = crypto.randomUUID();
    sessionStorage.setItem(tabKey, tab);
  }
  return `${storagePrefix(data)}:board-draft:${tab}:v1`;
}
export function readBoardDraft(data: AppState): BoardDraft | null {
  const key = boardDraftKey(data),
    raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  if (!raw) return null;
  const value = JSON.parse(raw) as BoardDraft;
  if (!Number.isSafeInteger(value.baseVersion) || value.baseVersion < 0)
    throw Error('보드 초안의 수정 순서를 읽지 못했습니다. 원문은 유지했습니다.');
  validateBoard(value.content);
  if (
    value.editor &&
    (typeof value.editor.title !== 'string' ||
      typeof value.editor.body !== 'string' ||
      typeof value.editor.id !== 'string' ||
      !value.content.columns.some((c) => c.id === value.editor?.columnId) ||
      typeof value.editor.archived !== 'boolean' ||
      (value.editor.topicId !== null && typeof value.editor.topicId !== 'string'))
  )
    throw Error('카드 초안을 읽지 못했습니다. 원문은 유지했습니다.');
  if (
    value.operation &&
    (value.operation.type !== 'saveStudyBoard' ||
      value.operation.userId !== data.userId ||
      value.operation.namespace !== data.namespace ||
      value.operation.expectedVersion !== value.baseVersion ||
      JSON.stringify(value.operation.content) !== JSON.stringify(value.content))
  )
    throw Error('보드 저장 요청을 확인하지 못했습니다. 원문은 유지했습니다.');
  return value;
}
export function writeBoardDraft(data: AppState, value: BoardDraft) {
  validateBoard(value.content);
  storeDraftSafely(boardDraftKey(data), JSON.stringify(value));
}
export function clearBoardDraft(data: AppState) {
  clearStoredDraft(boardDraftKey(data));
}
