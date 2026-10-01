import { afterEach, expect, it, vi } from 'vitest';
import { createDemoState } from '../domain/fixtures';
import { readWeeksDraft, writeWeeksDraft, type WeeksDraft } from './semester-weeks-draft';
import { clearRescuedDraft } from './draft-safety';
const data = createDemoState(), draft: WeeksDraft = { subjectId: 's', start: '', end: '', firstWeek: 1, name: '  조건\n예외  ', rows: [], generatedStart: '', batch: null };
afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); clearRescuedDraft(`study-space:${data.namespace}:${encodeURIComponent(data.userId)}:semester-weeks:s:v1`); });
it('isolates owners and preserves exact draft through reopening', () => {
  writeWeeksDraft(data, 's', draft, null); expect(readWeeksDraft(data, 's').draft).toEqual(draft);
  expect(readWeeksDraft({ ...data, userId: 'other' }, 's').draft).toBeNull();
});
it('keeps volatile rescue on quota failure and refuses overwriting a concurrent draft', () => {
  const raw = writeWeeksDraft(data, 's', draft, null);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('quota'); });
  const next = { ...draft, name: '중단 전 글' }; expect(() => writeWeeksDraft(data, 's', next, raw)).toThrow();
  expect(readWeeksDraft(data, 's').draft).toEqual(next); vi.restoreAllMocks();
  expect(() => writeWeeksDraft(data, 's', draft, null)).toThrow(/다른 창/);
  expect(localStorage.getItem(`study-space:${data.namespace}:${encodeURIComponent(data.userId)}:semester-weeks:s:v1`)).toBe(raw);
});
