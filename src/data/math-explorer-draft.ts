import type { AppState } from '../domain/model';
import { isMathScene, type MathScene } from '../domain/math-explorer';
import { storagePrefix } from './repository';
import { readRescuedDraft, storeDraftSafely } from './draft-safety';
import { decodeStoredText, encodeStoredText } from './storage-codec';
export function mathDraftKey(data: Pick<AppState, 'namespace' | 'userId'>) {
  return `${storagePrefix(data)}:math-explorer:draft:v1`;
}
export function readMathDraft(key: string): MathScene | null {
  const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  if (!raw) return null;
  const value: unknown = JSON.parse(decodeStoredText(raw));
  if (!isMathScene(value)) throw Error('수식 초안을 읽지 못했습니다. 저장된 원문은 유지했습니다.');
  return value;
}
export function writeMathDraft(key: string, value: MathScene) {
  if (!isMathScene(value)) throw Error('초안의 값을 확인해 주세요.');
  storeDraftSafely(key, encodeStoredText(JSON.stringify(value)));
}
