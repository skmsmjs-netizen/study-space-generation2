import { afterEach, expect, it, vi } from 'vitest';
import {
  defaultStatisticsView,
  availableStatisticsRange,
  readStatisticsView,
  saveStatisticsView,
  statisticsViewKey,
} from './statistics-view';
import { createDemoState } from '../domain/fixtures';
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
it('reads old v1 preferences and round-trips a valid scope without changing the key', () => {
  saveStatisticsView(data, defaultStatisticsView);
  expect(readStatisticsView(data).view.range).toBeUndefined();
  const range = {
    from: '2026-09-01',
    to: '2026-09-30',
    subjectId: 'subject',
    nodeId: 'topic',
    compare: true,
  };
  saveStatisticsView(data, { ...defaultStatisticsView, range });
  expect(readStatisticsView(data).view.range).toEqual(range);
  const raw = JSON.stringify({ ...defaultStatisticsView, range: { ...range, from: '2026-09-31' } });
  localStorage.setItem(statisticsViewKey(data), raw);
  expect(readStatisticsView(data).error).toBeTruthy();
  expect(localStorage.getItem(statisticsViewKey(data))).toBe(raw);
});
it('falls back from deleted or out-of-scope references without modifying the saved selection', () => {
  const state = createDemoState();
  const selected = { subjectId: 'demo-subject-math', nodeId: 'demo-topic-graph' };
  expect(availableStatisticsRange(state, ['demo-subject-math'], selected)).toEqual({
    ...selected,
    unavailable: false,
  });
  expect(availableStatisticsRange(state, [], selected)).toEqual({
    subjectId: '',
    nodeId: '',
    unavailable: true,
  });
  expect(
    availableStatisticsRange(
      {
        ...state,
        nodes: state.nodes.map((node) => ({ ...node, deletedAt: '2026-10-02T00:00:00Z' })),
      },
      ['demo-subject-math'],
      selected,
    ),
  ).toEqual({ subjectId: selected.subjectId, nodeId: '', unavailable: true });
  expect(selected.nodeId).toBe('demo-topic-graph');
});
