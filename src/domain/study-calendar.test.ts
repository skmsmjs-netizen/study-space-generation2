import { expect, it } from 'vitest';
import { calendarMonth, calendarWeek, createSemesterWeeks, reverseWeekBatch, semesterWeekRows, shiftMonth, weekSchedules } from './study-calendar';
import { changeSchedule } from './schedule-management';

it('uses Korean calendar weeks and actual months across leap years and year boundaries', () => {
  expect(calendarWeek('2026-10-04T23:30:00Z')).toEqual({ from: '2026-10-05', to: '2026-10-11', day: '2026-10-05' });
  expect(calendarMonth('2028-02')).toEqual({ from: '2028-02-01', to: '2028-02-29' });
  expect(calendarMonth('2026-02').to).toBe('2026-02-28');
  expect(shiftMonth('2026-01', -1)).toBe('2025-12');
  expect(() => calendarMonth('2026-13')).toThrow();
});
it('uses the entered semester, preserves excluded and edited weeks, and deduplicates deleted weeks', () => {
  const rows = semesterWeekRows('2026-09-03', '2026-12-10', 1, '회로');
  expect(rows).toHaveLength(15);
  rows[1].excluded = true; rows[2].name = '실험'; rows[2].note = '  예외\n원문  ';
  let id = 0; const added = createSemesterWeeks(rows, [], 'subject', '2026-09-03', () => `${id++}`);
  expect(added).toHaveLength(14); expect(added[1].name).toBe('실험'); expect(added[1].note).toBe('  예외\n원문  ');
  expect(added.every(s => !s.dueDate && !Object.keys(s.states).length)).toBe(true);
  const moved = added.map(s => ({ ...s, deletedAt: '2026-10-01T00:00:00Z' }));
  expect(createSemesterWeeks(rows, moved, 'subject', '2026-09-03', () => 'unexpected')).toEqual([]);
  expect(() => semesterWeekRows('2026-02-30', '2026-03-01', 1, '회로')).toThrow();
});
it('undoes only untouched created schedules, retains later evidence, and restores with history', () => {
  let id = 0; const added = createSemesterWeeks(semesterWeekRows('2026-10-01', '2026-10-15', 1, '회로'), [], 's', '2026-10-01', () => `${id++}`);
  const edited = changeSchedule(added[1], { states: { learn: 'done' }, note: '학습 원문' }, '2026-10-01T01:00:00Z', '수행 기록');
  const result = reverseWeekBatch([added[0], edited, added[2]], added, '2026-10-01T02:00:00Z');
  expect(result.changed).toBe(2); expect(result.preserved).toBe(1); expect(result.schedules[1]).toEqual(edited);
  const restored = reverseWeekBatch(result.schedules, result.originals, '2026-10-01T03:00:00Z', true);
  expect(restored.changed).toBe(2); expect(restored.schedules.every(s => !s.deletedAt)).toBe(true);
  expect(restored.schedules[0].history).toHaveLength(2);
});
it('separates overdue and undated schedules from this week without inferring failure', () => {
  let id = 0; const rows = createSemesterWeeks(semesterWeekRows('2026-09-28', '2026-10-12', 1, '회로'), [], 's', '2026-09-28', () => `${id++}`);
  rows[0].dueDate = '2026-09-30'; const unknown = { ...rows[1], id: 'unknown', opensDate: '' };
  const result = weekSchedules([...rows, unknown], '2026-10-01T01:00:00Z');
  expect(result.overdue.map(s => s.id)).toEqual(['0']); expect(result.upcoming).toEqual([]);
  expect(result.unknown).toEqual([unknown]); expect(rows[0].states).toEqual({});
});
