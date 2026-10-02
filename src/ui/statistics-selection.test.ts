import { expect, it } from 'vitest';
import { createDemoState } from '../domain/fixtures';
import type { StatisticItem } from '../domain/statistics';
import {
  selectedChartRows,
  statisticSourceKeys,
  statisticsSelectionMatcher,
  uniqueStatisticSources,
} from './statistics-selection';
import type { ChartFigure } from '../domain/statistics-charts';
const data = createDemoState(),
  owner = `${data.namespace}:${data.userId}`;
const exact: StatisticItem = {
  id: 'writing:r1',
  targetId: 'demo-topic-function',
  date: { kind: 'exact', date: '2026-10-02' },
  value: 1,
  maximum: 1,
  label: '원문',
  recordIds: ['r1'],
  eventIds: [],
};
const unknown: StatisticItem = {
  ...exact,
  id: 'writing:r2',
  date: { kind: 'unknown' },
  recordIds: ['r2'],
};
it('selects exact dates without treating unknown or bounded dates as exact; keeps empty selection distinct from none', () => {
  const match = statisticsSelectionMatcher(
    { owner, label: '날짜', period: { from: '2026-10-01', to: '2026-10-02' } },
    data,
  )!;
  expect(
    [
      exact,
      unknown,
      { ...exact, date: { kind: 'range' as const, from: '2026-10-01', to: '2026-10-02' } },
    ].map(match),
  ).toEqual([true, false, false]);
  expect(statisticsSelectionMatcher(null, data)).toBeNull();
  expect(statisticsSelectionMatcher({ owner, label: '없음', sourceKeys: [] }, data)!(exact)).toBe(
    false,
  );
  expect(
    statisticsSelectionMatcher({ owner: 'other', label: '분리', sourceKeys: ['record:r1'] }, data),
  ).toBeNull();
});
it('joins the same original across metric IDs and unknown dates without changing values or denominators', () => {
  const match = statisticsSelectionMatcher(
    { owner, label: '원문', sourceKeys: statisticSourceKeys(unknown) },
    data,
  )!;
  expect(match({ ...unknown, id: 'session:r2', value: 9 })).toBe(true);
  expect(match(exact)).toBe(false);
  expect(uniqueStatisticSources([unknown, { ...unknown, id: 'session:r2' }])).toEqual([
    'record:r2',
  ]);
  const figure = {
    rows: [
      { label: '값', values: [12, 40], items: [exact] },
      { label: '미정', values: [8, 40], items: [unknown] },
    ],
  } as ChartFigure;
  const before = structuredClone(figure);
  expect(selectedChartRows(figure, match)).toEqual([false, true]);
  expect(figure).toEqual(before);
});
it('shares subject selection through current target ownership and preserves unknown dates', () => {
  const match = statisticsSelectionMatcher(
    { owner, label: '과목', subjectId: 'demo-subject-math' },
    data,
  )!;
  expect(match(unknown)).toBe(true);
  expect(match({ ...unknown, targetId: 'missing-topic' })).toBe(false);
});
