import type { AppState } from '../domain/model';
import { storagePrefix } from './repository';
import { readRescuedDraft, storeDraftSafely } from './draft-safety';
import { decodeStoredText, encodeStoredText } from './storage-codec';
import { validateState } from '../interactive/math-physics/model.mjs';

export function conceptInteractiveViewKey(data: Pick<AppState, 'namespace' | 'userId'>) {
  return `${storagePrefix(data)}:concept-interactives:view:v1`;
}
export function readConceptInteractiveView(key: string): string | null {
  // View preferences resume across this owner's windows; unfinished text uses separate keys.
  const stored = readRescuedDraft(key, { scope: 'device' }) ?? localStorage.getItem(key);
  if (stored === null) return null;
  const raw = decodeStoredText(stored);
  validateState(JSON.parse(raw));
  return raw;
}
export function writeConceptInteractiveView(key: string, raw: string): void {
  if (typeof raw !== 'string' || raw.length > 100_000)
    throw Error('보기의 저장 형식을 확인해 주세요.');
  validateState(JSON.parse(raw));
  // Failed reads or damaged stored views never grant authority to replace them.
  // An unsaved rescue may be valid even if another window damaged the stored original.
  const original = localStorage.getItem(key);
  if (original !== null) validateState(JSON.parse(decodeStoredText(original)));
  readConceptInteractiveView(key);
  storeDraftSafely(key, encodeStoredText(raw));
}
