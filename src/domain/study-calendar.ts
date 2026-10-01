import type { LearningSchedule } from './learning-schedule';
import { addDays, changeSchedule, deadlinePending, koreanDay, schedulePending } from './schedule-management';
import { validPeriod } from './statistics';

export function calendarWeek(at: string) {
  const day = koreanDay(at), weekday = new Date(`${day}T00:00:00Z`).getUTCDay();
  const from = addDays(day, -((weekday + 6) % 7));
  return { from, to: addDays(from, 6), day };
}
export function calendarMonth(month: string) {
  const from = `${month}-01`;
  if (!/^\d{4}-\d{2}$/.test(month) || !validPeriod(from, from)) throw Error('월을 확인해 주세요.');
  const next = new Date(`${from}T00:00:00Z`); next.setUTCMonth(next.getUTCMonth() + 1);
  return { from, to: addDays(next.toISOString().slice(0, 10), -1) };
}
export function shiftMonth(month: string, offset: number) {
  const { from } = calendarMonth(month), date = new Date(`${from}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + offset); return date.toISOString().slice(0, 7);
}
export function weekSchedules(schedules: LearningSchedule[], at: string) {
  const range = calendarWeek(at);
  return { ...range,
    upcoming: schedules.filter(s => schedulePending(s) &&
      !(deadlinePending(s) && s.dueDate && s.dueDate < range.day) &&
      (deadlinePending(s) && s.dueDate >= range.day && s.dueDate <= range.to || s.opensDate >= range.from && s.opensDate <= range.to))
      .sort((a, b) => (a.dueDate || a.opensDate).localeCompare(b.dueDate || b.opensDate) || a.name.localeCompare(b.name, 'ko')),
    overdue: schedules.filter(s => deadlinePending(s) && s.dueDate && s.dueDate < range.day),
    unknown: schedules.filter(s => schedulePending(s) && !s.dueDate && !s.opensDate),
  };
}
export interface WeekRow { week: number; name: string; opensDate: string; dueDate: string; note: string; excluded: boolean }
export function semesterWeekRows(start: string, end: string, firstWeek: number, name: string): WeekRow[] {
  if (!validPeriod(start, end) || Date.parse(end) - Date.parse(start) > 366 * 86400000 || !Number.isSafeInteger(firstWeek) || firstWeek < 1 || !name.trim())
    throw Error('첫 강의 날짜와 마지막 주차 기준일을 1년 이내로 입력하고, 시작 주차와 이름을 확인해 주세요.');
  const rows: WeekRow[] = [];
  for (let offset = 0; addDays(start, offset) <= end; offset += 7) rows.push({ week: firstWeek + offset / 7, name: `${name} · ${firstWeek + offset / 7}주차`, opensDate: addDays(start, offset), dueDate: '', note: '', excluded: false });
  return rows;
}
export function weekSeries(subjectId: string, start: string) { return `semester-weeks:${subjectId}:${start}`; }
export function weekDuplicate(schedules: LearningSchedule[], subjectId: string, seriesId: string, row: WeekRow) {
  // Tombstones are retained: a second registration must not resurrect a deleted week.
  return schedules.find(s => s.subjectId === subjectId && s.week === row.week &&
    (s.seriesId === seriesId || s.kind === 'class' && s.opensDate === row.opensDate));
}
export function createSemesterWeeks(rows: WeekRow[], schedules: LearningSchedule[], subjectId: string, start: string, makeId: () => string) {
  const seriesId = weekSeries(subjectId, start), added: LearningSchedule[] = [];
  for (const row of rows) {
    if (row.excluded || weekDuplicate([...schedules, ...added], subjectId, seriesId, row)) continue;
    if (!row.name.trim() || !validPeriod(row.opensDate, row.opensDate) || row.dueDate && !validPeriod(row.opensDate, row.dueDate)) throw Error(`${row.week}주차 이름과 날짜를 확인해 주세요.`);
    added.push({ id: makeId(), subjectId, name: row.name, kind: 'class', goalIds: [], targetIds: [], opensDate: row.opensDate, dueDate: row.dueDate, weight: null, status: 'active', states: {}, dueMeaning: row.dueDate ? 'attendance' : 'unknown', note: row.note, week: row.week, seriesId, history: [] });
  }
  return added;
}
export function reverseWeekBatch(schedules: LearningSchedule[], originals: LearningSchedule[], at: string, restore = false) {
  let changed = 0, preserved = 0;
  const expected = new Map(originals.map(s => [s.id, s]));
  const changedOriginals: LearningSchedule[] = [];
  const next = schedules.map(s => {
    const original = expected.get(s.id); if (!original) return s;
    // JSON objects can reorder keys during a PostgreSQL round trip. Array order
    // and every stored value still matter when protecting later user edits.
    const content = (value: LearningSchedule) => JSON.stringify(value, (_key, v) => v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b))) : v);
    if (content(s) !== content(original)) { preserved++; return s; }
    changed++; const updated = changeSchedule(s, { deletedAt: restore ? null : at }, at, restore ? '주차 생성 되돌림 복원' : '주차 생성 되돌림');
    changedOriginals.push(updated); return updated;
  });
  return { schedules: next, changed, preserved, originals: changedOriginals };
}
