import type { MemoStroke } from '../domain/model';
import { inkFingerprint, type InkChange } from '../domain/ink-editing';
import { validateMemoContent } from '../domain/memo';
import {
  archiveDamagedDraft,
  clearStoredDraft,
  readRescuedDraft,
  storeDraftSafely,
} from './draft-safety';
import { decodeStoredText, encodeStoredText } from './storage-codec';
import type { InkPreferences, InkWorkspace } from '../domain/ink-workspace';
export type { InkPreferences, InkWorkspace } from '../domain/ink-workspace';
export const defaultInkPreferences: InkPreferences = {
  ink: 'ink',
  width: 3,
  finger: false,
  pressure: false,
};
export const defaultInkWorkspace = (strokes: MemoStroke[]): InkWorkspace => ({
  page: 0,
  pages: 1,
  zoom: 1,
  undo: [],
  redo: [],
  fingerprint: inkFingerprint(strokes),
});
function read(key?: string): unknown {
  if (!key) return null;
  const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  return raw ? JSON.parse(decodeStoredText(raw)) : null;
}
export function readInkPreferences(key?: string): InkPreferences {
  const p = read(key) as InkPreferences | null;
  if (!p) return { ...defaultInkPreferences };
  if (
    !['ink', 'blue', 'green'].includes(p.ink) ||
    ![2, 3, 5, 8].includes(p.width) ||
    typeof p.finger !== 'boolean' ||
    typeof p.pressure !== 'boolean'
  )
    throw Error('필기 설정을 읽지 못했습니다. 원래 설정은 보존했습니다.');
  return p;
}
export function readInkWorkspace(key: string | undefined, strokes: MemoStroke[]): InkWorkspace {
  const w = read(key) as InkWorkspace | null;
  if (!w) return defaultInkWorkspace(strokes);
  if (
    !Number.isSafeInteger(w.page) ||
    w.page < 0 ||
    !Number.isSafeInteger(w.pages) ||
    w.pages < 1 ||
    w.page >= w.pages ||
    ![1, 1.5, 2].includes(w.zoom) ||
    !Array.isArray(w.undo) ||
    !Array.isArray(w.redo) ||
    typeof w.fingerprint !== 'string'
  )
    throw Error('필기 보기와 되돌리기 내용을 읽지 못했습니다. 원문은 보존했습니다.');
  for (const c of [...w.undo, ...w.redo])
    for (const entries of [c.before, c.after]) {
      if (!Array.isArray(entries)) throw Error('필기 수정 이력을 확인하지 못했습니다.');
      for (const row of entries) {
        if (!Number.isSafeInteger(row.index) || row.index < 0)
          throw Error('필기 수정 순서를 확인하지 못했습니다.');
        validateMemoContent({ body: '', ownerId: null, strokes: [row.stroke] });
      }
    }
  // A newer drawing (e.g. from another device) must never receive an old undo stack.
  if (w.fingerprint !== inkFingerprint(strokes)) {
    if (key && [...w.undo, ...w.redo].length)
      archiveDamagedDraft(key, '현재 필기와 다른 수정 이력 원문 보관');
    return { ...w, undo: [], redo: [], fingerprint: inkFingerprint(strokes) };
  }
  return w;
}
export function writeInkWorkspace(key: string | undefined, value: InkWorkspace) {
  if (key) storeDraftSafely(key, encodeStoredText(JSON.stringify(value)));
}
export function writeInkPreferences(key: string | undefined, value: InkPreferences) {
  if (key) storeDraftSafely(key, JSON.stringify(value));
}
export function resetInkStorage(key: string | undefined) {
  if (key) {
    archiveDamagedDraft(key, '필기 설정·수정 이력 원문 보관');
    clearStoredDraft(key);
  }
}
