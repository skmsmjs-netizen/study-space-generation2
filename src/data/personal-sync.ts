import type { PersonalRepository } from './personal-repository';

/** Visible spaces check every five seconds; hidden/offline spaces make no polling requests. */
export function startPersonalSync(repository: PersonalRepository) {
  let stopped = false, running = false, timer: ReturnType<typeof setTimeout> | undefined;
  let lastStarted = -Infinity, failures = 0;
  const active = () => document.visibilityState !== 'hidden' && navigator.onLine !== false;
  function schedule() {
    clearTimeout(timer);
    if (!stopped && active() && repository.getStatus().phase !== 'conflict') {
      timer = setTimeout(() => { void check(); }, Math.min(60_000, 5_000 * 2 ** failures));
    }
  }
  async function check() {
    if (stopped || running || !active() || repository.getStatus().phase === 'conflict') return;
    // A focus/visibility/reconnect burst is a single request.
    if (Date.now() - lastStarted < 750) { schedule(); return; }
    running = true; lastStarted = Date.now();
    try {
      await repository.refresh();
      failures = repository.getStatus().phase === 'error' ? Math.min(failures + 1, 4) : 0;
    } catch { failures = Math.min(failures + 1, 4); }
    finally { running = false; schedule(); }
  }
  const resume = () => { clearTimeout(timer); if (active()) void check(); };
  const pause = () => { clearTimeout(timer); };
  document.addEventListener('visibilitychange', resume);
  window.addEventListener('focus', resume);
  window.addEventListener('online', resume);
  window.addEventListener('offline', pause);
  // Startup already performs its load/flush; avoid a second initial round trip.
  schedule();
  return () => {
    stopped = true; clearTimeout(timer);
    document.removeEventListener('visibilitychange', resume);
    window.removeEventListener('focus', resume);
    window.removeEventListener('online', resume);
    window.removeEventListener('offline', pause);
  };
}
