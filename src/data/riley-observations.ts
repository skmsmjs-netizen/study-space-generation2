import type { GraphRanges } from '../interactive/math-physics/gestures.mjs';
import type { AppState } from '../domain/model';
import { storagePrefix } from './repository';
import { readRescuedDraft, storeDraftSafely } from './draft-safety';
import { decodeStoredText, encodeStoredText } from './storage-codec';

export type RileyPosition = {
  values: Record<string, number>;
  inputs: Record<string, string>;
  step: number;
  zoom: number;
  note: string;
  noteHistory: { text: string; at: string }[];
  sourcePage?: number;
  verifiedSource?: { page: number; zoom: number; scroll?: { x: number; y: number } };
  sourceZoom?: number;
  pendingFields?: string[];
  viewport?: GraphRanges;
  planStep?: number;
  conditionCheck?: '충족' | '위반' | '확인 전';
};
export type RileyView = {
  version: 1;
  selected: string;
  query: string;
  chapter: number;
  filter: string;
  positions: Record<string, RileyPosition>;
  listReturn?: { id: string; y: number };
  atlas?: number;
  discovery?: { query: string; kind: 'subsections' | 'equationMentions'; page: number };
};
export const emptyRileyView = (): RileyView => ({
  version: 1,
  selected: '',
  query: '',
  chapter: 0,
  filter: '',
  positions: {},
});
export const rileyViewKey = (data: Pick<AppState, 'namespace' | 'userId'>) =>
  `${storagePrefix(data)}:riley-observations:view:v1`;
export function validateRileyView(v: unknown): asserts v is RileyView {
  if (!v || typeof v !== 'object') throw Error('교재 보기의 저장 형식을 확인해 주세요.');
  const s = v as RileyView;
  if (
    s.version !== 1 ||
    typeof s.selected !== 'string' ||
    typeof s.query !== 'string' ||
    !Number.isInteger(s.chapter) ||
    s.chapter < 0 ||
    s.chapter > 31 ||
    typeof s.filter !== 'string' ||
    !s.positions ||
    typeof s.positions !== 'object' ||
    Array.isArray(s.positions)
  )
    throw Error('교재 보기의 저장 형식을 확인해 주세요.');
  if (
    s.listReturn &&
    (!/^riley-3e-section-\d+\.\d+$/.test(s.listReturn.id) ||
      !Number.isFinite(s.listReturn.y) ||
      s.listReturn.y < 0)
  )
    throw Error('저장된 목록 위치의 형식을 확인해 주세요.');
  if (s.atlas !== undefined && (!Number.isInteger(s.atlas) || s.atlas < 0 || s.atlas > 3))
    throw Error('연결 지도의 보관 형식을 확인해 주세요.');
  if (
    s.discovery &&
    (typeof s.discovery.query !== 'string' ||
      !['subsections', 'equationMentions'].includes(s.discovery.kind) ||
      !Number.isInteger(s.discovery.page) ||
      s.discovery.page < 0)
  )
    throw Error('확인 대기 목록의 보관 형식을 확인해 주세요.');
  for (const [id, p] of Object.entries(s.positions)) {
    if (
      !id.startsWith('riley-3e-section-') ||
      !p ||
      typeof p !== 'object' ||
      typeof p.note !== 'string' ||
      !Number.isInteger(p.step) ||
      p.step < 0 ||
      p.step > 2 ||
      !Number.isFinite(p.zoom) ||
      p.zoom < 1 ||
      p.zoom > 8 ||
      !p.values ||
      !p.inputs ||
      !Array.isArray(p.noteHistory)
    )
      throw Error('저장된 관찰값의 형식을 확인해 주세요.');
    if (
      typeof p.values !== 'object' ||
      Array.isArray(p.values) ||
      typeof p.inputs !== 'object' ||
      Array.isArray(p.inputs) ||
      Object.values(p.values).some((x) => !Number.isFinite(x)) ||
      Object.values(p.inputs).some((x) => typeof x !== 'string') ||
      p.noteHistory.some((x) => !x || typeof x.text !== 'string' || typeof x.at !== 'string')
    )
      throw Error('저장된 관찰값의 형식을 확인해 주세요.');
    if (
      (p.planStep !== undefined &&
        (!Number.isInteger(p.planStep) || p.planStep < 0 || p.planStep > 2)) ||
      (p.conditionCheck !== undefined && !['충족', '위반', '확인 전'].includes(p.conditionCheck))
    )
      throw Error('관계·조건 확인의 저장 형식을 확인해 주세요.');
    if (
      (p.verifiedSource !== undefined &&
        (!p.verifiedSource ||
          !Number.isInteger(p.verifiedSource.page) ||
          p.verifiedSource.page < 1 ||
          p.verifiedSource.page > 1363 ||
          !Number.isFinite(p.verifiedSource.zoom) ||
          p.verifiedSource.zoom < 0.5 ||
          p.verifiedSource.zoom > 3 ||
          (p.verifiedSource.scroll !== undefined &&
            (!p.verifiedSource.scroll ||
              !Number.isFinite(p.verifiedSource.scroll.x) ||
              !Number.isFinite(p.verifiedSource.scroll.y) ||
              p.verifiedSource.scroll.x < 0 ||
              p.verifiedSource.scroll.y < 0)))) ||
      (p.sourcePage !== undefined &&
        (!Number.isInteger(p.sourcePage) || p.sourcePage < 1 || p.sourcePage > 1363)) ||
      (p.sourceZoom !== undefined &&
        (!Number.isFinite(p.sourceZoom) || p.sourceZoom < 1 || p.sourceZoom > 8))
    )
      throw Error('원문 보기 위치의 형식을 확인해 주세요.');
    if (
      p.viewport &&
      !['x', 'y'].every((k) => {
        const r = p.viewport![k as 'x' | 'y'];
        return (
          Array.isArray(r) && r.length === 2 && r.every((n) => Number.isFinite(n)) && r[1] > r[0]
        );
      })
    )
      throw Error('관찰 시야의 저장 형식을 확인해 주세요.');
    if (
      p.pendingFields !== undefined &&
      (!Array.isArray(p.pendingFields) || p.pendingFields.some((x) => typeof x !== 'string'))
    )
      throw Error('미확정 입력의 형식을 확인해 주세요.');
  }
}
export function readRileyView(key: string): RileyView {
  const raw = readRescuedDraft(key, { scope: 'device' }) ?? localStorage.getItem(key);
  if (raw === null) return emptyRileyView();
  const v: unknown = JSON.parse(decodeStoredText(raw));
  validateRileyView(v);
  return v;
}
export function saveRileyView(key: string, view: RileyView) {
  validateRileyView(view);
  // Check the persistent original too: never replace a damaged record with defaults.
  const original = localStorage.getItem(key);
  if (original !== null) validateRileyView(JSON.parse(decodeStoredText(original)));
  storeDraftSafely(key, encodeStoredText(JSON.stringify(view)));
}
