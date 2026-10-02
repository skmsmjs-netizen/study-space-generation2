import { studyInputDay } from './daily-study-dynamics';
import type { StudyRecord } from './model';

export interface ObservatoryResponse {
  /** Distinct known input events, with the same identity as the permanent evolution engine. */
  inputCount: number;
  /** Three-day exponentially weighted input rate, capped at 12 inputs per calendar day. */
  recentInputRate: number;
  /** Bounded scene intensity from the recent input rate, not a study-time or ability estimate. */
  density: number;
  /** Permanent small details that appear from the very first known input. */
  earlyGlimmer: number;
  activity: number;
}

const MEMORY_DAYS = 3;
const DAILY_CAP = 12;
const INPUT_ALPHA = -Math.expm1(-1 / MEMORY_DAYS);

/**
 * Caller supplies current, active, owner/scope-filtered records. The clock describes input days,
 * never an inferred study date or duration. Counts and timestamps are observed; decay, saturation
 * and the daily cap are art-direction choices, not a validated learning or lifestyle model.
 */
export function buildObservatoryResponse(
  records: readonly StudyRecord[],
  referenceDay: number,
): ObservatoryResponse {
  if (!Number.isSafeInteger(referenceDay)) throw new RangeError('Invalid input calendar');
  const inputDays = new Map<string, number>();
  for (const record of records) {
    const day = studyInputDay(record.createdAt);
    if (day === null || day > referenceDay) continue;
    const key = JSON.stringify([record.sessionId, record.subjectId, record.targetId]);
    const previous = inputDays.get(key);
    // A transported copy on another day cannot make an existing input look newly recorded.
    if (previous === undefined || day < previous) inputDays.set(key, day);
  }
  const byDay = new Map<number, number>();
  for (const day of inputDays.values()) byDay.set(day, (byDay.get(day) ?? 0) + 1);
  let recentInputRate = 0;
  // Stable ordering makes replay independent of transport order, including floating-point sums.
  for (const [day, count] of [...byDay].sort((a, b) => a[0] - b[0]))
    recentInputRate +=
      INPUT_ALPHA * Math.min(DAILY_CAP, count) * Math.exp(-(referenceDay - day) / MEMORY_DAYS);
  recentInputRate = Math.max(0, Math.min(DAILY_CAP, recentInputRate));
  const inputCount = inputDays.size;
  const density = -Math.expm1(-recentInputRate / 2);
  const earlyGlimmer = -Math.expm1(-inputCount / 3);
  return {
    inputCount,
    recentInputRate,
    density,
    earlyGlimmer,
    activity: 0.25 * earlyGlimmer + 0.75 * density,
  };
}
