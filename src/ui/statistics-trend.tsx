import { shiftDay, statisticBounds, type Metric } from '../domain/statistics';

// The containing metric button supplies the text alternative and evidence action.
export function StatisticsTrend({ metric, from, to }: { metric: Metric; from: string; to: string }) {
  const days = Math.round((Date.parse(to) - Date.parse(from)) / 86400000) + 1;
  const step = Math.max(1, Math.ceil(days / 14));
  const exact = { ...metric, items: metric.items.filter(item => item.date.kind === 'exact') };
  const values = Array.from({ length: Math.ceil(days / step) }, (_, i) => statisticBounds(
    exact, shiftDay(from, i * step), shiftDay(from, Math.min(days - 1, (i + 1) * step - 1)),
  ).lower);
  const maximum = Math.max(1, ...values), width = 280 / values.length;
  return <svg className="statistics-trend" viewBox="0 0 280 56" aria-hidden="true" focusable="false">
    <line className="grid" x1="0" y1="54" x2="280" y2="54" />
    {values.map((value, i) => <rect key={i} className="current-bar" x={i * width + width * .15}
      y={54 - value / maximum * 48} width={width * .7} height={value / maximum * 48} />)}
  </svg>;
}
