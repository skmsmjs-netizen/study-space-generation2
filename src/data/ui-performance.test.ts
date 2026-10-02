import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import {
  beginUiMeasure,
  clearUiPerformance,
  finishUiMeasureAfterPaint,
  readUiPerformance,
  recordUiMeasure,
  subscribeUiPerformance,
} from './ui-performance';

beforeEach(clearUiPerformance);
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it('bounds session samples, admits only fixed phases, and never retains caller context', () => {
  const changed = vi.fn(),
    stop = subscribeUiPerformance(changed);
  for (let i = 0; i < 125; i++) recordUiMeasure('input-paint', i);
  expect(readUiPerformance()).toHaveLength(120);
  expect(readUiPerformance()[0]).toEqual({ phase: 'input-paint', durationMs: 5, success: true });
  // Runtime validation protects exports even if a caller has an invalid JS value.
  recordUiMeasure('private text' as 'input-paint', 2);
  recordUiMeasure('search-results', NaN);
  recordUiMeasure('search-results', -1);
  expect(readUiPerformance()).toHaveLength(120);
  expect(Object.keys(readUiPerformance()[0])).toEqual(['phase', 'durationMs', 'success']);
  clearUiPerformance();
  expect(readUiPerformance()).toEqual([]);
  expect(changed).toHaveBeenCalledTimes(126);
  stop();
  recordUiMeasure('history-render', 1);
  expect(changed).toHaveBeenCalledTimes(126);
});
it('finishes once and drops a canceled render before its paint opportunity', () => {
  vi.spyOn(performance, 'now').mockReturnValueOnce(10).mockReturnValueOnce(35);
  const finish = beginUiMeasure('search-results');
  finish();
  finish(false);
  expect(readUiPerformance()).toEqual([{ phase: 'search-results', durationMs: 25, success: true }]);
  const frames = new Map<number, FrameRequestCallback>();
  let id = 0;
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    frames.set(++id, cb);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (key: number) => frames.delete(key));
  const done = vi.fn();
  const cancel = finishUiMeasureAfterPaint(done);
  const first = frames.get(1);
  if (!first) throw new Error('Expected the first animation frame');
  frames.delete(1);
  first(0);
  cancel();
  for (const cb of frames.values()) cb(1);
  expect(done).not.toHaveBeenCalled();
});
