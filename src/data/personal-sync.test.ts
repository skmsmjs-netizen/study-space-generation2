import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { startPersonalSync } from './personal-sync';
import type { PersonalRepository } from './personal-repository';
let visible = true, online = true;
beforeEach(() => { vi.useFakeTimers(); vi.spyOn(document, 'visibilityState', 'get').mockImplementation(() => visible ? 'visible' : 'hidden'); vi.spyOn(navigator, 'onLine', 'get').mockImplementation(() => online); visible = online = true; });
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });
function fixture() { const refresh = vi.fn(async () => {}); let phase = 'saved'; const repo = { refresh, getStatus: () => ({phase}) } as unknown as PersonalRepository; return {refresh, repo, phase: (value: string) => { phase = value; }}; }
it('polls while visible, stops in background/offline, and immediately checks on return/reconnect', async () => {
 const f=fixture(),stop=startPersonalSync(f.repo);
 await vi.advanceTimersByTimeAsync(5000); expect(f.refresh).toHaveBeenCalledTimes(1);
 visible=false; document.dispatchEvent(new Event('visibilitychange')); await vi.advanceTimersByTimeAsync(20000); expect(f.refresh).toHaveBeenCalledTimes(1);
 visible=true; document.dispatchEvent(new Event('visibilitychange')); await vi.advanceTimersByTimeAsync(0); expect(f.refresh).toHaveBeenCalledTimes(2);
 online=false; window.dispatchEvent(new Event('offline')); await vi.advanceTimersByTimeAsync(20000); expect(f.refresh).toHaveBeenCalledTimes(2);
 online=true; window.dispatchEvent(new Event('online')); await vi.advanceTimersByTimeAsync(0); expect(f.refresh).toHaveBeenCalledTimes(3);
 stop(); await vi.advanceTimersByTimeAsync(20000); window.dispatchEvent(new Event('focus')); expect(f.refresh).toHaveBeenCalledTimes(3);
});
it('coalesces focus/visibility bursts and never overlaps a slow response', async () => {
 const f=fixture(); let finish!:()=>void; f.refresh.mockImplementationOnce(() => new Promise<void>(resolve => {finish=resolve})); const stop=startPersonalSync(f.repo);
 window.dispatchEvent(new Event('focus')); document.dispatchEvent(new Event('visibilitychange')); window.dispatchEvent(new Event('online'));
 await vi.advanceTimersByTimeAsync(20000); expect(f.refresh).toHaveBeenCalledTimes(1);
 finish(); await vi.advanceTimersByTimeAsync(5000); expect(f.refresh).toHaveBeenCalledTimes(2); stop();
});
it('backs off errors and does not poll while conflict requires a user choice', async () => {
 const f=fixture(),stop=startPersonalSync(f.repo); f.phase('error'); await vi.advanceTimersByTimeAsync(5000); expect(f.refresh).toHaveBeenCalledTimes(1);
 await vi.advanceTimersByTimeAsync(5000); expect(f.refresh).toHaveBeenCalledTimes(1);
 await vi.advanceTimersByTimeAsync(5000); expect(f.refresh).toHaveBeenCalledTimes(2);
 f.phase('conflict'); await vi.advanceTimersByTimeAsync(60000); window.dispatchEvent(new Event('focus')); expect(f.refresh).toHaveBeenCalledTimes(2); stop();
});
