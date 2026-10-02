import type { AppState } from '../domain/model';
import {
  DEFAULT_READING,
  EXAMPLE_IDS,
  STEP_IDS,
  type ReadingPosition,
  type SeriesExampleId,
} from '../domain/integral-reasoning';
import { storagePrefix } from './repository';
import { readRescuedDraft, storeDraftSafely } from './draft-safety';
import { decodeStoredText, encodeStoredText } from './storage-codec';

export type ReasoningView = {
  version: 1;
  active: 'graph' | 'series' | 'concepts' | 'templates' | 'linear' | 'vector-calculus';
  example: SeriesExampleId;
  readings: Partial<Record<SeriesExampleId, ReadingPosition>>;
};
export const defaultReasoningView = (): ReasoningView => ({
  version: 1,
  active: 'graph',
  example: 'log-square',
  readings: {},
});
export function reasoningViewKey(data: Pick<AppState, 'namespace' | 'userId'>) {
  return `${storagePrefix(data)}:integral-reasoning:view:v1`;
}
export function isReasoningView(value: unknown): value is ReasoningView {
  if (!value || typeof value !== 'object') return false;
  const v = value as ReasoningView;
  if (
    v.version !== 1 ||
    !['graph', 'series', 'concepts', 'templates', 'linear', 'vector-calculus'].includes(v.active) ||
    !EXAMPLE_IDS.includes(v.example) ||
    !v.readings ||
    typeof v.readings !== 'object' ||
    Array.isArray(v.readings)
  )
    return false;
  return Object.entries(v.readings).every(
    ([id, reading]) =>
      EXAMPLE_IDS.includes(id as SeriesExampleId) &&
      reading &&
      STEP_IDS.includes(reading.step) &&
      ['integral', 'ratio', 'alternating', 'geometric'].includes(reading.method) &&
      typeof reading.absolute === 'boolean' &&
      typeof reading.tail === 'boolean' &&
      typeof reading.brief === 'boolean' &&
      (reading.pending === null || STEP_IDS.includes(reading.pending)) &&
      (reading.badExtension === undefined || typeof reading.badExtension === 'boolean') &&
      (reading.areaCount === undefined ||
        (Number.isInteger(reading.areaCount) && reading.areaCount >= 3 && reading.areaCount <= 12)),
  );
}
export function readReasoningView(key: string) {
  const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  if (raw === null) return defaultReasoningView();
  const value: unknown = JSON.parse(decodeStoredText(raw));
  if (!isReasoningView(value))
    throw Error('읽던 위치를 불러오지 못했습니다. 기존 저장값은 유지했습니다.');
  return value;
}
export function writeReasoningView(key: string, value: ReasoningView) {
  if (!isReasoningView(value)) throw Error('읽던 위치의 형식을 확인해 주세요.');
  storeDraftSafely(key, encodeStoredText(JSON.stringify(value)));
}
export function readingFor(view: ReasoningView): ReadingPosition {
  return view.readings[view.example] ?? { ...DEFAULT_READING };
}
