import type { AppState } from '../domain/model';
import type { StatisticItem } from '../domain/statistics';
import { validPeriod } from '../domain/statistics';
import type { ChartFigure } from '../domain/statistics-charts';

export interface StatisticsSelection {
  label: string;
  owner: string;
  period?: { from: string; to: string };
  subjectId?: string;
  sourceKeys?: string[];
}
export const statisticSourceKeys = (item: StatisticItem) => {
  const keys = [
    ...item.recordIds.map((id) => `record:${id}`),
    ...item.eventIds.map((id) => `event:${id}`),
  ];
  return keys.length ? keys : [`item:${item.id}`];
};
export const uniqueStatisticSources = (items: StatisticItem[]) => [
  ...new Set(items.flatMap(statisticSourceKeys)),
];
export function statisticsSelectionMatcher(selection: StatisticsSelection | null, data: AppState) {
  if (!selection || selection.owner !== `${data.namespace}:${data.userId}`) return null;
  const keys = selection.sourceKeys ? new Set(selection.sourceKeys) : null;
  const owners = new Map(data.nodes.filter((n) => !n.deletedAt).map((n) => [n.id, n.subjectId]));
  for (const subject of data.subjects) if (!subject.deletedAt) owners.set(subject.id, subject.id);
  return (item: StatisticItem) => {
    if (selection.subjectId && owners.get(item.targetId) !== selection.subjectId) return false;
    if (selection.period) {
      const { from, to } = selection.period;
      // A range or unknown date is never silently promoted to an exact selected date.
      if (
        !validPeriod(from, to) ||
        item.date.kind !== 'exact' ||
        item.date.date < from ||
        item.date.date > to
      )
        return false;
    }
    return !keys || statisticSourceKeys(item).some((key) => keys.has(key));
  };
}
export type StatisticsMatcher = ReturnType<typeof statisticsSelectionMatcher>;
export function selectedChartRows(figure: ChartFigure, match: StatisticsMatcher) {
  return match ? figure.rows.map((row) => row.items.some(match)) : null;
}
