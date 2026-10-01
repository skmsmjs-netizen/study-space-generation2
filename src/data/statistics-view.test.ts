import { afterEach, expect, it, vi } from 'vitest';
import {
  defaultStatisticsView,
  readStatisticsView,
  saveStatisticsView,
  statisticsViewKey,
} from './statistics-view';
const data = { namespace: 'demo' as const, userId: 'learner' };
afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});
it('restores explicit selections and keeps other users separate', () => {
  saveStatisticsView(data, {
    ...defaultStatisticsView,
    family: 'composition',
    kind: 'treemap',
    metricId: 'writing',
    overview: false,
  });
  expect(readStatisticsView(data).view.kind).toBe('treemap');
  expect(readStatisticsView({ ...data, userId: 'other' }).view.kind).toBe('line');
});
it('does not overwrite damaged preferences on read and keeps them before explicit replacement', () => {
  const key = statisticsViewKey(data),
    raw = '{ damaged\n';
  localStorage.setItem(key, raw);
  expect(readStatisticsView(data).error).toBeTruthy();
  expect(localStorage.getItem(key)).toBe(raw);
  saveStatisticsView(data, defaultStatisticsView);
  const archive = Object.keys(localStorage).find((k) => k.startsWith(key + ':unreadable:'))!;
  expect(localStorage.getItem(archive)).toBe(raw);
});
it('does not pretend storage failure is success', () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw Error('quota');
  });
  expect(() => saveStatisticsView(data, defaultStatisticsView)).toThrow('quota');
});
