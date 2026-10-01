import { scheduleDeadline, scheduleLabels, scheduleSteps, scheduleWorkSteps, type LearningSchedule, type ScheduleOriginal } from './learning-schedule';

export const koreanDay = (at = new Date().toISOString()) => new Date(Date.parse(at) + 9 * 3600000).toISOString().slice(0, 10);
export const addDays = (day: string, days: number) => new Date(Date.parse(`${day}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
export function schedulePending(s: LearningSchedule) {
  return !s.deletedAt && s.status === 'active' && (scheduleWorkSteps(s).length === 0 || scheduleWorkSteps(s).some(step => s.states[step] !== 'done'));
}
export function deadlinePending(s: LearningSchedule) {
  return schedulePending(s) && !(s.kind === 'assignment' && s.states.submit === 'done') && !(['lecture', 'class'].includes(s.kind) && s.dueMeaning === 'attendance' && s.states.attendance === 'done');
}
export function remainingTime(s: LearningSchedule, at: string) {
  const due = scheduleDeadline(s);
  if (!due) return '기한 미정';
  const ms = Date.parse(due) - Date.parse(at);
  const days = Math.abs(Math.round((Date.parse(`${s.dueDate}T00:00:00Z`) - Date.parse(`${koreanDay(at)}T00:00:00Z`)) / 86400000));
  if (ms < 0) return days ? `${days}일 지남` : '기한 지남';
  if (!s.dueTime) return days ? `${days}일 남음 · 시각 미정` : '오늘 · 시각 미정';
  if (ms < 3600000) return `${Math.ceil(ms / 60000)}분 남음`;
  return days ? `${days}일 남음 · ${s.dueTime}` : `${Math.ceil(ms / 3600000)}시간 남음 · ${s.dueTime}`;
}
export function changeSchedule(s: LearningSchedule, patch: Partial<LearningSchedule>, at: string, reason: string): LearningSchedule {
  const { history: _history, ...previous } = structuredClone(s);
  const next = { ...s, ...patch, id: s.id };
  const { history: _nextHistory, ...content } = next;
  if (JSON.stringify(previous) === JSON.stringify(content)) return s;
  return { ...next, history: [...(s.history ?? []), { at, reason, previous }] };
}
export function restoreSchedule(s: LearningSchedule, previous: ScheduleOriginal, at: string) {
  const { history: _history, ...current } = structuredClone(s);
  return { ...structuredClone(previous), history: [...(s.history ?? []), { at, reason: '이전 기록으로 되돌림', previous: current }] };
}
export function orderSchedules(schedules: LearningSchedule[]) {
  return [...schedules].sort((a, b) => (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31') || (a.dueTime || '23:59').localeCompare(b.dueTime || '23:59') || a.name.localeCompare(b.name, 'ko') || a.id.localeCompare(b.id));
}
export function scheduleDigest(schedules: LearningSchedule[], at: string) {
  const day = koreanDay(at), until = addDays(day, 7);
  const due = orderSchedules(schedules.filter(s => deadlinePending(s) && s.dueDate >= day && s.dueDate <= until && Date.parse(scheduleDeadline(s)!) >= Date.parse(at)));
  const unknown = schedules.filter(s => schedulePending(s) && !s.dueDate && s.reviewDate && s.reviewDate <= day);
  return { day, due, unknown, count: due.length + unknown.length };
}
export function monthDays(month: string) {
  const first = `${month}-01`, start = addDays(first, -new Date(`${first}T00:00:00Z`).getUTCDay());
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}
/** Each occurrence has independent evidence. Expanding never carries an old completion forward. */
export function weeklySchedules(initial: LearningSchedule, end: string, makeId: () => string) {
  const anchor = initial.opensDate || initial.dueDate;
  if (!anchor || !end || end < anchor || Date.parse(`${end}T00:00:00Z`) - Date.parse(`${anchor}T00:00:00Z`) > 366 * 86400000) throw Error('반복 시작일과 마지막 날을 1년 이내로 골라 주세요.');
  const seriesId = initial.seriesId || initial.id, results: LearningSchedule[] = [];
  for (let offset = 0; addDays(anchor, offset) <= end; offset += 7) results.push({ ...initial, id: offset ? makeId() : initial.id, seriesId, week: (initial.week || 1) + offset / 7,
    opensDate: initial.opensDate ? addDays(initial.opensDate, offset) : '', dueDate: initial.dueDate ? addDays(initial.dueDate, offset) : '', reviewDate: initial.reviewDate ? addDays(initial.reviewDate, offset) : '',
    states: offset ? {} : initial.states, history: offset ? [] : initial.history });
  return results;
}

const calendarText = (s:string) => Array.from(s,c=>{const n=c.codePointAt(0)!;return n<=8||n===11||n===12||n>=14&&n<=31||n===127||n>=0xd800&&n<=0xdfff?'\\u'+n.toString(16).padStart(4,'0'):c;}).join('');
const escapeText = (s: string) => calendarText(s).replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
const utc = (at: string) => new Date(at).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const date = (day: string) => day.replace(/-/g, '');
function fold(line: string) {
  const lines: string[] = []; let part = '', bytes = 0;
  for (const character of line) { const length = new TextEncoder().encode(character).length; if (bytes + length > 75) { lines.push(part); part = ' '; bytes = 1; } part += character; bytes += length; }
  lines.push(part); return lines.join('\r\n');
}
/** RFC 5545. A downloaded file is a snapshot, not a live calendar subscription. */
export function calendarFile(schedules: LearningSchedule[], at: string, owner: string, includeDigest = true) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Study Space//Schedules//KO', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:공부 일정'];
  const active = schedules.filter(s => !s.deletedAt && s.status === 'active');
  const event = (id: string, start: string[], title: string, description: string, alarm = false, sequence = 0) => {
    lines.push('BEGIN:VEVENT', `UID:${encodeURIComponent(owner)}-${encodeURIComponent(id)}@study-space`, `DTSTAMP:${utc(at)}`, `SEQUENCE:${sequence}`, ...start, `SUMMARY:${escapeText(title)}`, `DESCRIPTION:${escapeText(description)}`);
    if (alarm) lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:PT0S', `DESCRIPTION:${escapeText(title)}`, 'END:VALARM');
    lines.push('END:VEVENT');
  };
  for (const s of active) if (s.dueDate) event(s.id, s.dueTime ? [`DTSTART:${utc(scheduleDeadline(s)!)}`, `DTEND:${utc(new Date(Date.parse(scheduleDeadline(s)!) + 60000).toISOString())}`] : [`DTSTART;VALUE=DATE:${date(s.dueDate)}`, `DTEND;VALUE=DATE:${date(addDays(s.dueDate, 1))}`], `${scheduleLabels[s.kind]} · ${s.name}${s.week ? ` · ${s.week}주차` : ''}`, [s.taskText, s.note, s.sourceUrl, s.dueTime ? '' : '기한 시각은 미정입니다.'].filter(Boolean).join('\n'), false, s.history?.length ?? 0);
  if (includeDigest) {
    const days = new Set<string>();
    for (const s of active) { if (s.dueDate && deadlinePending(s)) for (let i = 0; i <= 7; i++) days.add(addDays(s.dueDate, -i)); else if (!s.dueDate && s.reviewDate) days.add(s.reviewDate); }
    for (const day of [...days].sort()) {
      const start = new Date(`${day}T09:00:00+09:00`).toISOString(); if (Date.parse(start) < Date.parse(at)) continue;
      const digest = scheduleDigest(active, start); if (!digest.count) continue;
      event(`digest-${day}`, [`DTSTART:${utc(start)}`, `DTEND:${utc(new Date(Date.parse(start) + 60000).toISOString())}`], `일주일 안의 공부 일정 ${digest.count}개`, [...digest.due.map(s => `${s.name} · ${remainingTime(s, start)}`), ...digest.unknown.map(s => `${s.name} · 공지에서 기한 확인`)].join('\n'), true);
    }
  }
  lines.push('END:VCALENDAR'); return lines.map(fold).join('\r\n') + '\r\n';
}
