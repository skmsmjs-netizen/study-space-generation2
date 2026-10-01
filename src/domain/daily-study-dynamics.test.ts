import { expect, it } from 'vitest';
import type { StudyRecord } from './model';
import { advanceStudySignal, buildDailyStudyDynamics, studyInputDay } from './daily-study-dynamics';
const entry = (id: string, day: number, targetId = 'a'): StudyRecord => ({
  id,
  sessionId: id,
  targetId,
  subjectId: 's',
  userId: 'u',
  namespace: 'test',
  createdAt: `2026-09-${String(day).padStart(2, '0')}T03:00:00Z`,
  updatedAt: '2026-10-01T00:00:00Z',
  version: 1,
  deletedAt: null,
  done: true,
  body: '',
  trace: {},
  dateEvidence: { kind: 'unknown' },
});
const at = (day: number) => studyInputDay(`2026-09-${String(day).padStart(2, '0')}T03:00:00Z`) ?? 0;
it('matches daily EWMA exactly across a sparse gap', () => {
  const first = advanceStudySignal(0, 0.7, 1, 3);
  let dense = first;
  for (let day = 1; day < 8; day++) dense = advanceStudySignal(dense, 0, 1, 3);
  dense = advanceStudySignal(dense, 0.4, 1, 3);
  expect(advanceStudySignal(first, 0.4, 8, 3)).toBeCloseTo(dense, 14);
  for (const tau of [3, 14])
    for (const gap of [1, 100, 100000])
      for (const state of [0, 0.5, 1]) {
        const value = advanceStudySignal(state, 1, gap, tau);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
});
it('rejects invalid domains instead of making NaN animation parameters', () => {
  for (const args of [
    [NaN, 1, 1, 3],
    [0, 2, 1, 3],
    [0, 1, 0, 3],
    [0, 1, 1, 0],
    [0, 1, 1.5, 3],
  ]) {
    expect(() => advanceStudySignal(args[0], args[1], args[2], args[3])).toThrow(RangeError);
  }
});
it('uses the known input timestamp without guessing the date of study', () => {
  const record = entry('one', 1);
  const unknown = buildDailyStudyDynamics([record], at(1));
  expect(unknown.recent[0]).toBeGreaterThan(0);
  expect(
    buildDailyStudyDynamics(
      [{ ...record, dateEvidence: { kind: 'exact', date: '2026-08-01' } }],
      at(1),
    ),
  ).toEqual(unknown);
  expect(buildDailyStudyDynamics([{ ...record, createdAt: 'unknown' }], at(1)).recent).toEqual([
    0, 0, 0,
  ]);
  expect(studyInputDay('2026-09-01T16:00:00Z')).toEqual(at(2));
});
it('replays deterministically and counts the same event/target once regardless of writing length', () => {
  const records = [entry('one', 1), entry('two', 2), entry('three', 3, 'b')];
  const signal = buildDailyStudyDynamics(records, at(3));
  expect(buildDailyStudyDynamics(records.slice().reverse(), at(3))).toEqual(signal);
  expect(
    buildDailyStudyDynamics(
      [...records, { ...records[0], id: 'copy', body: '글'.repeat(5000) }],
      at(3),
    ),
  ).toEqual(signal);
  expect(signal.recent[2]).toBeGreaterThan(0);
});
it('reflects a corrected input and preserves a neutral baseline after an empty interval', () => {
  const first = entry('one', 1),
    second = entry('two', 2, 'b');
  const old = buildDailyStudyDynamics([first, second], at(2));
  const corrected = buildDailyStudyDynamics([first], at(2));
  expect(corrected.recent[0]).toBeLessThan(old.recent[0]);
  expect(buildDailyStudyDynamics([first], at(30)).recent[0]).toBeGreaterThanOrEqual(0);
  expect(buildDailyStudyDynamics([], at(2)).recent).toEqual([0, 0, 0]);
  expect(buildDailyStudyDynamics([second], at(1)).recent).toEqual([0, 0, 0]);
});
it('keeps recent and long memory distinct for equal totals with different daily timing', () => {
  const early = buildDailyStudyDynamics([entry('one', 1), entry('two', 2)], at(10));
  const recent = buildDailyStudyDynamics([entry('one', 9), entry('two', 10)], at(10));
  expect(recent.recent[0]).toBeGreaterThan(early.recent[0]);
  expect(recent.change[0]).not.toEqual(early.change[0]);
});
