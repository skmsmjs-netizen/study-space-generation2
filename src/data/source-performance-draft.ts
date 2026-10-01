import type { AppState } from '../domain/model';
import type { PerformanceSource } from '../domain/learning-evidence';
import type { ResponseDraft } from '../domain/recommendation-workspace';
import { clearStoredDraft, readRescuedDraft, rescueWithoutOverwrite, storeDraftSafely } from './draft-safety';
export interface SourceResultDraft { version: 1; goalId: string; response: ResponseDraft }
export function sourceResultDraftKey(data: AppState, source: PerformanceSource) {
  const sessionKey='study-space:source-result-tab:v1';
  let tab=sessionStorage.getItem(sessionKey);
  if (!tab) {tab=crypto.randomUUID();sessionStorage.setItem(sessionKey,tab);}
  return 'study-space:'+[data.namespace,data.userId,'source-result',tab,source.kind,source.id,source.version,source.itemId ?? ''].map(x=>encodeURIComponent(String(x))).join(':')+':v1';
}
function validate(value: unknown): asserts value is SourceResultDraft {
  const d=value as SourceResultDraft;
  if (!d || d.version !== 1 || typeof d.goalId !== 'string' || !d.response || !['pass','fail','unknown','disputed'].includes(d.response.result) || !['none','notes','unknown'].includes(d.response.assistance) || !['same','new','unknown'].includes(d.response.novelty) || d.response.answer !== '') throw Error('결과 초안을 읽지 못했습니다. 원문은 보존했습니다.');
}
export function readSourceResultDraft(key: string) {
  const raw=readRescuedDraft(key) ?? localStorage.getItem(key);
  if (!raw) return {raw,draft:null};
  try { const draft:unknown=JSON.parse(raw);validate(draft);return {raw,draft}; } catch {throw Error('결과 초안을 읽지 못했습니다. 원문은 보존했습니다.');}
}
export function writeSourceResultDraft(key:string,draft:SourceResultDraft,previous:string|null) {
  validate(draft);const raw=JSON.stringify(draft);
  if ((readRescuedDraft(key) ?? localStorage.getItem(key)) !== previous) {rescueWithoutOverwrite(key,raw);throw Error('다른 곳에서 결과 초안이 바뀌었습니다. 현재 선택도 보존했습니다.');}
  storeDraftSafely(key,raw);return raw;
}
export function clearSourceResultDraft(key:string,previous:string|null) {
  if ((readRescuedDraft(key) ?? localStorage.getItem(key)) === previous) clearStoredDraft(key);
}
