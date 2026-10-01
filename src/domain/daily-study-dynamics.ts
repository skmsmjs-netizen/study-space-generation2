import type { StudyRecord } from './model';

export type StudySignal = [number, number, number];
export interface DailyStudyDynamics {
  recent: StudySignal;
  background: StudySignal;
  change: StudySignal;
}
const DAY = 86400000;
/** Same calendar as the app statistics. This is the input day, not a guessed study date. */
export function studyInputDay(stamp: string | number): number | null {
  const ms = typeof stamp === 'number' ? stamp : Date.parse(stamp);
  return Number.isFinite(ms) ? Math.floor((ms + 9 * 3600000) / DAY) : null;
}

/** Exact sparse-day EWMA propagation. tau is a display memory in days, not a human parameter. */
export function advanceStudySignal(state: number, input: number, gap: number, tau: number): number {
  if (
    !Number.isFinite(state) ||
    !Number.isFinite(input) ||
    !Number.isFinite(gap) ||
    !Number.isFinite(tau) ||
    state < 0 ||
    state > 1 ||
    input < 0 ||
    input > 1 ||
    !Number.isInteger(gap) ||
    gap < 1 ||
    tau <= 0
  )
    throw new RangeError('Invalid display signal');
  return Math.exp(-gap / tau) * state - Math.expm1(-1 / tau) * input;
}
const saturate = (count: number) => -Math.expm1(-count / 3);

/** The caller supplies canonical, active, owner-scoped records. No sleep, text grades, or ability state. */
export function buildDailyStudyDynamics(
  records: readonly StudyRecord[],
  referenceDay: number,
): DailyStudyDynamics {
  if (!Number.isInteger(referenceDay)) throw new RangeError('Invalid input calendar');
  const byDay = new Map<number, Map<string, Set<string>>>();
  for (const record of records) {
    const day = studyInputDay(record.createdAt);
    if (day === null || day > referenceDay) continue;
    const targets = byDay.get(day) ?? new Map<string, Set<string>>();
    const target = `${record.subjectId}:${record.targetId}`;
    const events = targets.get(target) ?? new Set<string>();
    events.add(record.sessionId);
    targets.set(target, events);
    byDay.set(day, targets);
  }
  let recent: StudySignal = [0, 0, 0],
    background: StudySignal = [0, 0, 0];
  let previous: number | null = null;
  const seen = new Set<string>();
  for (const [day, targets] of [...byDay].sort((a, b) => a[0] - b[0])) {
    let events = 0,
      returns = 0;
    for (const [target, visits] of targets) {
      events += visits.size;
      returns += seen.has(target) ? visits.size : Math.max(0, visits.size - 1);
      seen.add(target);
    }
    const input: StudySignal = [saturate(events), saturate(targets.size), saturate(returns)];
    const gap = previous === null ? 1 : day - previous;
    recent = recent.map((value, index) =>
      advanceStudySignal(value, input[index], gap, 3),
    ) as StudySignal;
    background = background.map((value, index) =>
      advanceStudySignal(value, input[index], gap, 14),
    ) as StudySignal;
    previous = day;
  }
  const age = previous === null ? 0 : referenceDay - previous;
  recent = recent.map((value) => value * Math.exp(-age / 3)) as StudySignal;
  background = background.map((value) => value * Math.exp(-age / 14)) as StudySignal;
  return {
    recent,
    background,
    change: recent.map((value, index) => value - background[index]) as StudySignal,
  };
}
