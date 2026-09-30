import type { AppState } from '../domain/model';
import { validateCanvasLayout, type CanvasContent } from '../domain/canvas';
import { storagePrefix } from './repository';
import { archiveDamagedDraft, clearStoredDraft, readRescuedDraft, storeDraftSafely } from './draft-safety';
export interface CanvasDraft { baseVersion: number; content: CanvasContent }
export const canvasDraftKey = (data: AppState) => `${storagePrefix(data)}:canvas-draft:main`;
export function readCanvasDraft(data: AppState): CanvasDraft | null {
  const key = canvasDraftKey(data), raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  if (!raw) return null;
  const draft = JSON.parse(raw) as CanvasDraft;
  if (!Number.isSafeInteger(draft.baseVersion) || draft.baseVersion < 0) throw Error('Canvas 배치 초안을 읽지 못했습니다. 원문을 덮어쓰지 않았습니다.');
  validateCanvasLayout(draft.content); return draft;
}
export function writeCanvasDraft(data: AppState, draft: CanvasDraft) { validateCanvasLayout(draft.content); storeDraftSafely(canvasDraftKey(data), JSON.stringify(draft)); }
export function clearCanvasDraft(data: AppState) { clearStoredDraft(canvasDraftKey(data)); }
export function preserveCanvasDraft(data: AppState) { return archiveDamagedDraft(canvasDraftKey(data), 'Canvas 배치 초안과 저장된 배치의 원문 보관'); }
