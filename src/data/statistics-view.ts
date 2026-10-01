import type { AppState } from '../domain/model';
import { chartFamilies, type ChartFamily, type ChartKind } from '../domain/statistics-charts';
import type { MetricId } from '../domain/statistics';
export interface StatisticsView {
  version: 1;
  family: ChartFamily;
  kind: ChartKind;
  overview: boolean;
  metricId: MetricId;
  secondMetricId: MetricId;
}
export const defaultStatisticsView: StatisticsView = {
  version: 1,
  family: 'trend',
  kind: 'line',
  overview: true,
  metricId: 'sessions',
  secondMetricId: 'writing',
};
const metricIds = [
  'sessions',
  'coverage',
  'activities',
  'repeats',
  'writing',
  'attempts',
  'successes',
  'corrections',
];
export const statisticsViewKey = (data: Pick<AppState, 'userId' | 'namespace'>) =>
  `study-space:${data.namespace}:statistics-view:${data.userId}:v1`;
export function readStatisticsView(data: Pick<AppState, 'userId' | 'namespace'>): {
  view: StatisticsView;
  error: string;
} {
  try {
    const raw = localStorage.getItem(statisticsViewKey(data));
    if (!raw) return { view: { ...defaultStatisticsView }, error: '' };
    const view = JSON.parse(raw) as StatisticsView;
    if (
      view.version !== 1 ||
      !chartFamilies.some(
        (f) => f.id === view.family && (f.kinds as readonly string[]).includes(view.kind),
      ) ||
      typeof view.overview !== 'boolean' ||
      !metricIds.includes(view.metricId) ||
      !metricIds.includes(view.secondMetricId)
    )
      throw Error('invalid');
    return { view, error: '' };
  } catch {
    return {
      view: { ...defaultStatisticsView },
      error: '이전 그래프 선택을 읽지 못했습니다. 원래 선택값을 보존하고 기본 보기로 열었습니다.',
    };
  }
}
export function saveStatisticsView(
  data: Pick<AppState, 'userId' | 'namespace'>,
  view: StatisticsView,
) {
  const key = statisticsViewKey(data),
    previous = localStorage.getItem(key);
  // An explicit selection can replace invalid preferences, after keeping the original raw value.
  if (previous && readStatisticsView(data).error)
    localStorage.setItem(`${key}:unreadable:${crypto.randomUUID()}`, previous);
  localStorage.setItem(key, JSON.stringify(view));
}
