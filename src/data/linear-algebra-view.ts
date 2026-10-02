import type { AppState } from '../domain/model';
import { storagePrefix } from './repository';
import { readRescuedDraft, storeDraftSafely, rescueWithoutOverwrite } from './draft-safety';
import { decodeStoredText, encodeStoredText } from './storage-codec';
import { isTemplateView, type TemplateView } from '../domain/math-view';
export interface LinearReading {
  params: Record<string, number>;
  inputs: Record<string, string>;
  matrix: string;
  matrixDraft: string;
  auxiliary?: string;
  auxiliaryDraft?: string;
  mode?: string;
  step: number;
  memo: string;
  view?: TemplateView;
  views?: Record<string, TemplateView>;
}
export interface LinearWorkspace {
  version: 1;
  selected: string;
  readings: Record<string, LinearReading>;
  query: string;
  returnToReader?: boolean;
}
export const linearViewKey = (data: Pick<AppState, 'namespace' | 'userId'>) =>
  `${storagePrefix(data)}:linear-algebra:view:v1`;
export const newLinearReading = (): LinearReading => ({
  params: { t: 2, n: 4 },
  inputs: {},
  matrix: '1 1 3\n2 -1 0',
  matrixDraft: '1 1 3\n2 -1 0',
  step: 0,
  memo: '',
});
export const newLinearWorkspace = (): LinearWorkspace => ({
  version: 1,
  selected: '0:D',
  readings: {},
  query: '',
});
export function isLinearWorkspace(value: unknown): value is LinearWorkspace {
  if (!value || typeof value !== 'object') return false;
  const v = value as LinearWorkspace;
  return (
    v.version === 1 &&
    typeof v.selected === 'string' &&
    v.selected.length < 100 &&
    (v.returnToReader === undefined || typeof v.returnToReader === 'boolean') &&
    typeof v.query === 'string' &&
    v.query.length < 10000 &&
    !!v.readings &&
    typeof v.readings === 'object' &&
    !Array.isArray(v.readings) &&
    Object.keys(v.readings).length <= 500 &&
    Object.values(v.readings).every(
      (r) =>
        r &&
        typeof r.matrix === 'string' &&
        r.matrix.length < 10000 &&
        typeof r.matrixDraft === 'string' &&
        r.matrixDraft.length < 10000 &&
        (r.auxiliary === undefined || (typeof r.auxiliary === 'string' && r.auxiliary.length < 10000)) &&
        (r.auxiliaryDraft === undefined || (typeof r.auxiliaryDraft === 'string' && r.auxiliaryDraft.length < 10000)) &&
        (r.mode === undefined || (typeof r.mode === 'string' && r.mode.length < 100)) &&
        typeof r.memo === 'string' &&
        r.memo.length < 100000 &&
        Number.isInteger(r.step) &&
        r.step >= 0 &&
        r.step < 10000 &&
        r.params &&
        typeof r.params === 'object' &&
        !Array.isArray(r.params) &&
        Object.entries(r.params).every(
          ([k, x]) => ['t', 'n'].includes(k) && Number.isFinite(x) && Math.abs(x) <= 1e6,
        ) &&
        r.inputs &&
        typeof r.inputs === 'object' &&
        !Array.isArray(r.inputs) &&
        Object.values(r.inputs).every((x) => typeof x === 'string' && x.length < 10000) &&
        (!r.view || isTemplateView(r.view)) &&
        (r.views === undefined ||
          (!!r.views &&
            typeof r.views === 'object' &&
            !Array.isArray(r.views) &&
            Object.entries(r.views).every(([k, v]) => k === 'continuous' && isTemplateView(v)))),
    )
  );
}
export function readLinearWorkspace(key: string): LinearWorkspace {
  const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  if (raw === null || raw === '') return newLinearWorkspace();
  const v: unknown = JSON.parse(decodeStoredText(raw));
  if (!isLinearWorkspace(v))
    throw Error('저장한 관찰을 읽지 못했다. 원문을 보존했으며 덮어쓰지 않는다.');
  return v;
}
export function writeLinearWorkspace(key: string, value: LinearWorkspace) {
  if (!isLinearWorkspace(value)) throw Error('관찰 보관 형식을 확인해야 한다.');
  const encoded = encodeStoredText(JSON.stringify(value));
  rescueWithoutOverwrite(key, encoded);
  const stored = localStorage.getItem(key);
  try {
    if (
      stored !== null &&
      stored !== '' &&
      !isLinearWorkspace(JSON.parse(decodeStoredText(stored)))
    )
      throw Error();
  } catch {
    throw Error('기존 관찰이 손상되어 덮어쓰지 않았다. 현재 입력은 이 창에 유지된다.');
  }
  storeDraftSafely(key, encoded);
  if (localStorage.getItem(key) !== encoded) {
    rescueWithoutOverwrite(key, encoded);
    throw Error('관찰 보관을 다시 읽어 확인하지 못했다. 현재 초안을 유지했으며 재시도할 수 있다.');
  }
}
