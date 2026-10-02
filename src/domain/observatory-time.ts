/** A decorative KST clock, independent of study evidence, weather and astronomical ephemerides. */
export const OBSERVATORY_TIMES = [
  { id: 'morning', label: '아침', start: 360, previewHour: 8, night: 0.06 },
  { id: 'day', label: '낮', start: 600, previewHour: 13, night: 0.015 },
  { id: 'sunset', label: '노을', start: 1020, previewHour: 18, night: 0.32 },
  { id: 'night', label: '밤', start: 1200, previewHour: 21, night: 0.86 },
  { id: 'late-night', label: '늦은 밤', start: 1380, previewHour: 1, night: 1 },
  { id: 'dawn', label: '새벽', start: 180, previewHour: 5, night: 0.6 },
] as const;
export type ObservatoryTime = (typeof OBSERVATORY_TIMES)[number]['id'];
export type ObservatorySky = {
  phase: ObservatoryTime;
  minute: number;
  /** At most two adjacent scenes crossfade for forty minutes around each boundary. */
  weights: readonly number[];
  nightLight: number;
  sun: { x: number; y: number };
};
const cycle = (value: number) => ((value % 1440) + 1440) % 1440;
const ease = (value: number) => value * value * (3 - 2 * value);
export function observatorySkyAt(instant: number): ObservatorySky {
  const minute = cycle(Math.floor((Number.isFinite(instant) ? instant : 0) / 60000) + 540);
  const elapsed = OBSERVATORY_TIMES.map((time) => cycle(minute - time.start));
  const current = elapsed.indexOf(Math.min(...elapsed));
  const weights: number[] = OBSERVATORY_TIMES.map(() => 0);
  const next = (current + 1) % 6;
  const previous = (current + 5) % 6;
  const duration = cycle(OBSERVATORY_TIMES[next].start - OBSERVATORY_TIMES[current].start);
  if (elapsed[current] < 20) {
    weights[current] = ease((elapsed[current] + 20) / 40);
    weights[previous] = 1 - weights[current];
  } else if (duration - elapsed[current] <= 20) {
    weights[next] = ease((elapsed[current] - duration + 20) / 40);
    weights[current] = 1 - weights[next];
  } else weights[current] = 1;
  // A visual arc, not a solar altitude. Its position stays continuous through scene changes.
  const arc = Math.max(0, Math.min(1, (minute - 360) / 840));
  return {
    phase: OBSERVATORY_TIMES[current].id,
    minute,
    weights,
    nightLight: weights.reduce(
      (sum, weight, index) => sum + weight * OBSERVATORY_TIMES[index].night,
      0,
    ),
    sun: { x: Math.round(318 + arc * 358), y: Math.round(160 - Math.sin(arc * Math.PI) * 117) },
  };
}
/** Fixed synthetic instants for scene comparisons only. */
export function observatoryPreviewTime(phase: ObservatoryTime): number {
  const time = OBSERVATORY_TIMES.find((item) => item.id === phase)!;
  return Date.UTC(2026, 9, 1, time.previewHour - 9);
}
