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

export interface ConnectionDraft { source: string; target: string; label: string }
const connectionKey = (data: AppState) => {
  const key = 'study-space:canvas-connection-tab:v1';
  let session = sessionStorage.getItem(key);
  if (!session) { session = crypto.randomUUID(); sessionStorage.setItem(key, session); }
  return `${storagePrefix(data)}:canvas-connection-draft:${session}:v1`;
};
function validateConnection(value: unknown): asserts value is ConnectionDraft {
  const row = value as ConnectionDraft | null;
  if (!row || typeof row.source !== 'string' || typeof row.target !== 'string' || typeof row.label !== 'string' || row.label.length > 300) throw Error('연결 설명 초안을 읽지 못했습니다. 원문은 유지했습니다.');
}
export function readConnectionDraft(data: AppState): ConnectionDraft {
  const raw = readRescuedDraft(connectionKey(data)) ?? localStorage.getItem(connectionKey(data));
  if (!raw) return { source: '', target: '', label: '' };
  const value: unknown = JSON.parse(raw); validateConnection(value); return value;
}
export function writeConnectionDraft(data: AppState, draft: ConnectionDraft) { validateConnection(draft); storeDraftSafely(connectionKey(data), JSON.stringify(draft)); }
export function clearConnectionDraft(data: AppState) { clearStoredDraft(connectionKey(data)); }
