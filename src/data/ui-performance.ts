export const UI_MEASURE_PHASES = [
  'input-paint',
  'search-results',
  'history-render',
  'route-render',
] as const;
export type UiMeasurePhase = (typeof UI_MEASURE_PHASES)[number];
export interface UiMeasureSample {
  phase: UiMeasurePhase;
  durationMs: number;
  success: boolean;
}
const LIMIT = 120;
let samples: readonly UiMeasureSample[] = [];
const listeners = new Set<() => void>();
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

/** Session-only fixed fields. No text, account, target ID, URL, DOM element or storage. */
export function recordUiMeasure(phase: UiMeasurePhase, durationMs: number, success = true) {
  if (!UI_MEASURE_PHASES.includes(phase) || !Number.isFinite(durationMs) || durationMs < 0) return;
  samples = [...samples.slice(-(LIMIT - 1)), { phase, durationMs, success: Boolean(success) }];
  for (const listener of listeners) listener();
}
export function beginUiMeasure(phase: UiMeasurePhase) {
  const started = now();
  let finished = false;
  return (success = true) => {
    if (finished) return;
    finished = true;
    recordUiMeasure(phase, Math.max(0, now() - started), success);
  };
}
/** One frame reaches the new render; a second frame records a paint opportunity, not INP. */
export function finishUiMeasureAfterPaint(finish: (success?: boolean) => void) {
  let first = 0,
    second = 0,
    active = true;
  if (typeof requestAnimationFrame !== 'function') {
    const timer = setTimeout(() => {
      if (active) finish();
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }
  first = requestAnimationFrame(() => {
    second = requestAnimationFrame(() => {
      if (active) finish();
    });
  });
  return () => {
    active = false;
    cancelAnimationFrame(first);
    cancelAnimationFrame(second);
  };
}
export function readUiPerformance() {
  return samples;
}
export function subscribeUiPerformance(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function clearUiPerformance() {
  samples = [];
  for (const listener of listeners) listener();
}
