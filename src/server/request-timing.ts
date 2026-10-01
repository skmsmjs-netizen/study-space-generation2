/** Request-local, anonymous durations only; never retain source or identity. */
export function requestTiming() {
  const started = performance.now();
  const durations = new Map<string, number>();
  function record(name: string, start: number) {
    durations.set(name, (durations.get(name) ?? 0) + performance.now() - start);
  }
  return {
    async measure<T>(name: string, task: () => Promise<T>): Promise<T> {
      const start = performance.now();
      try {
        return await task();
      } finally {
        record(name, start);
      }
    },
    sync<T>(name: string, task: () => T): T {
      const start = performance.now();
      try {
        return task();
      } finally {
        record(name, start);
      }
    },
    header() {
      return [...durations, ['total', performance.now() - started] as const]
        .map(([name, duration]) => `${name};dur=${duration.toFixed(2)}`)
        .join(', ');
    },
  };
}
