export type RequestPhase =
  'sync-load' | 'sync-execute' | 'sync-batch' | 'local-command' | 'local-journal';
export interface RequestSample {
  phase: RequestPhase;
  durationMs: number;
  success: boolean;
}
const samples: RequestSample[] = [];
const LIMIT = 120;
/** Bounded, session-only measurements. No body, account, URL, token or IDs. */
export function recordRequestPerformance(phase: RequestPhase, started: number, success: boolean) {
  const durationMs = Math.max(0, performance.now() - started);
  samples.push({ phase, durationMs, success });
  if (samples.length > LIMIT) samples.splice(0, samples.length - LIMIT);
  try {
    const name = `study:${phase}`;
    performance.clearMeasures(name);
    performance.measure(name, { start: started, duration: durationMs });
  } catch {
    /* Diagnostics cannot interrupt saving on older browsers. */
  }
}
export async function measureRequest<T>(phase: RequestPhase, task: () => Promise<T>): Promise<T> {
  const started = performance.now();
  let success = false;
  try {
    const result = await task();
    success = true;
    return result;
  } finally {
    recordRequestPerformance(phase, started, success);
  }
}
export function readRequestPerformance(): RequestSample[] {
  return samples.map((row) => ({ ...row }));
}
export function clearRequestPerformance() {
  samples.length = 0;
}
