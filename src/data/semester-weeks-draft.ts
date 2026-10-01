import type { AppState } from '../domain/model';
import type { WeekRow } from '../domain/study-calendar';
import type { LearningSchedule } from '../domain/learning-schedule';
import { readRescuedDraft, rescueWithoutOverwrite, storeDraftSafely } from './draft-safety';

export interface WeeksDraft {
  subjectId: string; start: string; end: string; firstWeek: number; name: string;
  rows: WeekRow[]; generatedStart: string;
  batch: { originals: LearningSchedule[]; reversed: boolean } | null;
}
const key = (data: AppState, scope: string) => `study-space:${data.namespace}:${encodeURIComponent(data.userId)}:semester-weeks:${encodeURIComponent(scope)}:v1`;
export function readWeeksDraft(data: AppState, scope: string): { raw: string | null; draft: WeeksDraft | null } {
  const raw = localStorage.getItem(key(data, scope)), rescued = readRescuedDraft(key(data, scope));
  const value = rescued ?? raw;
  if (!value) return { raw, draft: null };
  try {
    const d = JSON.parse(value);
    if (d.userId !== data.userId || d.namespace !== data.namespace || d.version !== 1 || !d.draft ||
      !['subjectId', 'start', 'end', 'name', 'generatedStart'].every(k => typeof d.draft[k] === 'string') ||
      !Number.isSafeInteger(d.draft.firstWeek) || !Array.isArray(d.draft.rows) || d.draft.rows.length > 54 ||
      d.draft.rows.some((r: WeekRow) => !r || !Number.isSafeInteger(r.week) || typeof r.excluded !== 'boolean' || !['name', 'opensDate', 'dueDate', 'note'].every(k => typeof (r as unknown as Record<string, unknown>)[k] === 'string')) ||
      d.draft.batch !== null && (!d.draft.batch || !Array.isArray(d.draft.batch.originals) || typeof d.draft.batch.reversed !== 'boolean' || d.draft.batch.originals.some((s: LearningSchedule) => !s || typeof s.id !== 'string' || s.subjectId !== d.draft.subjectId))) throw Error();
    return { raw, draft: d.draft };
  } catch { throw Error('주차 초안을 읽지 못했습니다. 저장된 원문은 유지했습니다. 다시 읽기를 눌러 주세요.'); }
}
export function writeWeeksDraft(data: AppState, scope: string, draft: WeeksDraft, previousRaw: string | null) {
  const k = key(data, scope), raw = JSON.stringify({ version: 1, userId: data.userId, namespace: data.namespace, draft });
  if (localStorage.getItem(k) !== previousRaw) { rescueWithoutOverwrite(k, raw); throw Error('다른 창에서 주차 초안이 바뀌었습니다. 이 창의 입력도 보관했습니다. 다시 읽어 확인해 주세요.'); }
  storeDraftSafely(k, raw); return raw;
}
