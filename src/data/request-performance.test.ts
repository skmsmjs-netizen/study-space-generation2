// @vitest-environment node
import { beforeEach, expect, it } from 'vitest';
import {
  clearRequestPerformance,
  measureRequest,
  readRequestPerformance,
  recordRequestPerformance,
} from './request-performance';
beforeEach(clearRequestPerformance);
it('keeps at most 120 anonymous session samples without accumulating browser measures', () => {
  for (let i = 0; i < 150; i++) recordRequestPerformance('sync-load', performance.now(), true);
  const samples = readRequestPerformance();
  expect(samples).toHaveLength(120);
  expect(Object.keys(samples[0]).sort()).toEqual(['durationMs', 'phase', 'success']);
  expect(performance.getEntriesByName('study:sync-load')).toHaveLength(1);
  samples[0].success = false;
  expect(readRequestPerformance()[0].success).toBe(true);
});
it('records failures and propagates the original error instead of hiding it', async () => {
  const error = Error('failed original');
  await expect(
    measureRequest('sync-batch', async () => {
      throw error;
    }),
  ).rejects.toBe(error);
  expect(readRequestPerformance()[0]).toMatchObject({ phase: 'sync-batch', success: false });
});
