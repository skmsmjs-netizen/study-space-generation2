import type { AppState } from '../domain/model';
import { VECTOR_MODULES, VECTOR_SPECS, validParameter } from '../domain/vector-calculus';
import { storagePrefix } from './repository';
import { readRescuedDraft, storeDraftSafely } from './draft-safety';
import { decodeStoredText, encodeStoredText } from './storage-codec';
import { isTemplateView, type TemplateView } from '../domain/math-view';
import { validGeneral, type GeneralWorkspace } from '../domain/vector-calculus-general';
// Actual callers exist only in this running app session. Reload has a real catalogue fallback.
export interface VectorCaller {
  route: string;
  id: string;
  scroll: number;
  small: boolean;
}
const vectorCallers = new Map<string, VectorCaller>();
const returningCallers = new Map<string, VectorCaller>();
export function rememberVectorCaller(key: string, caller: VectorCaller) {
  vectorCallers.set(key, caller);
}
export function vectorCaller(key: string) {
  return vectorCallers.get(key);
}
export function returnVectorCaller(key: string) {
  const caller = vectorCallers.get(key);
  if (caller) returningCallers.set(key, caller);
  return caller;
}
export function consumeVectorReturn(key: string) {
  const caller = returningCallers.get(key);
  returningCallers.delete(key);
  return caller;
}
export interface VectorEntry {
  values: Record<string, number>;
  drafts: Record<string, string>;
  errors: Record<string, string>;
  view: { zoom: number; x: number; y: number };
  notes: string;
  step: number;
  sceneView?: TemplateView;
  general?: GeneralWorkspace;
}
export interface VectorWorkspace {
  version: 1;
  active: string;
  query: string;
  entries: Record<string, VectorEntry>;
  selected?: Record<string, string>;
  reading?: { route: string; small: boolean; full: boolean; scroll: number };
}
export const freshVectorEntry = (id: string): VectorEntry => ({
  values: Object.fromEntries(VECTOR_SPECS[id].parameters.map((p) => [p.key, p.initial])),
  drafts: {},
  errors: {},
  view: { zoom: 1, x: 0, y: 0 },
  notes: '',
  step: 0,
});
export const freshVectorWorkspace = (): VectorWorkspace => ({
  version: 1,
  active: 'A2',
  query: '',
  entries: {},
});
export const vectorViewKey = (data: Pick<AppState, 'namespace' | 'userId'>) =>
  `${storagePrefix(data)}:vector-calculus:view:v1`;
export function validVectorWorkspace(value: unknown): value is VectorWorkspace {
  if (!value || typeof value !== 'object') return false;
  const v = value as VectorWorkspace;
  if (
    v.version !== 1 ||
    !VECTOR_MODULES.some((m) => m.id === v.active) ||
    typeof v.query !== 'string' ||
    v.query.length > 1000 ||
    !v.entries ||
    typeof v.entries !== 'object' ||
    Array.isArray(v.entries)
  )
    return false;
  if (
    v.selected !== undefined &&
    (!v.selected ||
      typeof v.selected !== 'object' ||
      Array.isArray(v.selected) ||
      !Object.entries(v.selected).every(
        ([module, id]) =>
          VECTOR_MODULES.some((m) => m.id === module) &&
          (id === module || id === `${module}:extension:1`),
      ))
  )
    return false;
  if (
    v.reading !== undefined &&
    (!v.reading ||
      typeof v.reading.route !== 'string' ||
      !['/math', '/materials/vector-calculus'].includes(v.reading.route) ||
      typeof v.reading.small !== 'boolean' ||
      typeof v.reading.full !== 'boolean' ||
      !Number.isFinite(v.reading.scroll) ||
      v.reading.scroll < 0 ||
      v.reading.scroll > 1e8)
  )
    return false;
  return Object.entries(v.entries).every(([id, e]) => {
    const spec = VECTOR_SPECS[id];
    return (
      !!spec &&
      !!e &&
      !!e.values &&
      Object.keys(e.values).length === spec.parameters.length &&
      spec.parameters.every((p) => validParameter(p, e.values[p.key])) &&
      !!e.drafts &&
      !!e.errors &&
      [e.drafts, e.errors].every(
        (map) =>
          typeof map === 'object' &&
          !Array.isArray(map) &&
          Object.entries(map).every(
            ([key, text]) =>
              spec.parameters.some((p) => p.key === key) &&
              typeof text === 'string' &&
              text.length <= 1000,
          ),
      ) &&
      typeof e.notes === 'string' &&
      e.notes.length <= 100000 &&
      Number.isInteger(e.step) &&
      e.step >= 0 &&
      e.step <= 8 &&
      !!e.view &&
      (e.sceneView === undefined || isTemplateView(e.sceneView)) &&
      (e.general === undefined || validGeneral(e.general)) &&
      Object.values(e.view).every(Number.isFinite) &&
      e.view.zoom >= 0.25 &&
      e.view.zoom <= 8 &&
      Math.abs(e.view.x) <= 100 &&
      Math.abs(e.view.y) <= 100
    );
  });
}
export function readVectorWorkspace(key: string) {
  const raw = readRescuedDraft(key, { scope: 'device' }) ?? localStorage.getItem(key);
  if (raw === null) return freshVectorWorkspace();
  const value: unknown = JSON.parse(decodeStoredText(raw));
  if (!validVectorWorkspace(value))
    throw Error(
      '관찰 보기를 읽지 못했다. 기존 저장 원문을 유지했다. 다시 읽거나 원문을 파일로 보관할 수 있다.',
    );
  return value;
}
export function writeVectorWorkspace(key: string, value: VectorWorkspace) {
  if (!validVectorWorkspace(value)) throw Error('관찰 저장 형식을 확인해 주세요.');
  storeDraftSafely(key, encodeStoredText(JSON.stringify(value)));
}
export class VectorStorageConflict extends Error {
  constructor() {
    super(
      '관찰 저장 원문이 다른 변경으로 바뀌었다. 자동 보관을 멈추고 현재 입력과 기존 원문을 보존했다. 파일로 보관하거나 저장 원문을 다시 읽을 수 있다.',
    );
  }
}
/** Detect a changed source immediately before a write; this is not a cross-tab lock. */
export function writeGuardedVectorWorkspace(
  key: string,
  value: VectorWorkspace,
  expectedRaw: string | null,
) {
  if (localStorage.getItem(key) !== expectedRaw) throw new VectorStorageConflict();
  writeVectorWorkspace(key, value);
  return localStorage.getItem(key);
}
export const vectorCoverage = VECTOR_MODULES.flatMap((module) => [
  {
    id: module.id,
    title: module.title,
    sections: module.sections,
    pages: module.pages,
    pdf: module.pdf,
    kind: '부분 대응',
    reason:
      '설명용 모형의 관계 탐색은 구현; 일반 대상·증명 전체와 부록의 별도 요구는 정적 설명 또는 추가 구현으로 구별.',
    question: VECTOR_SPECS[module.id].question,
  },
  ...module.details.map((detail, i) => ({
    id: `${module.id}:detail:${i + 1}`,
    title: detail.label,
    sections: module.sections,
    pages: module.pages,
    pdf: module.pdf,
    kind: '정적 설명 적합',
    reason:
      '법칙·조건·논증을 원식과 문장으로 보존한다. 모형 관찰이 이 항목 전체의 증명이나 일반 구현을 대신하지 않는다.',
    question: module.question,
  })),
]);
