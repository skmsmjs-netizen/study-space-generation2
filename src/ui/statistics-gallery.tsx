import { useMemo, useState } from 'react';
import {
  chartFigure,
  chartNames,
  type ChartContext,
  type ChartKind,
  type ChartRow,
} from '../domain/statistics-charts';
import { Button, Card } from './index';
import { StatisticsPlot } from './statistics-plot';
import {
  selectedChartRows,
  uniqueStatisticSources,
  type StatisticsMatcher,
} from './statistics-selection';
export function ChartValues({
  figure,
  onOpen,
  expanded = false,
  sharedMatch = null,
  onSelect,
}: {
  figure: ReturnType<typeof chartFigure>;
  onOpen: (row: ChartRow) => void;
  expanded?: boolean;
  sharedMatch?: StatisticsMatcher;
  onSelect?: (row: ChartRow) => void;
}) {
  const [all, setAll] = useState(false);
  const [opened, setOpened] = useState(expanded);
  if (!figure.rows.length) return null;
  return (
    <details
      className="statistics-values"
      open={expanded || undefined}
      onToggle={(event) => setOpened(event.currentTarget.open)}
    >
      <summary>그래프의 값과 원기록 · {figure.rows.length}개</summary>
      {(opened || expanded) && (
        <div className="statistics-scroll">
          <table className="statistics-table">
            <caption>{figure.title}</caption>
            <thead>
              <tr>
                {figure.columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
                <th>원기록</th>
              </tr>
            </thead>
            <tbody>
              {figure.rows.slice(0, all ? undefined : 20).map((row) => (
                <tr
                  key={row.label}
                  data-shared-selected={sharedMatch ? row.items.some(sharedMatch) : undefined}
                >
                  <th scope="row">
                    {row.label}
                    {sharedMatch && row.items.some(sharedMatch) && (
                      <span className="statistics-selection-mark"> · 함께 선택됨</span>
                    )}
                  </th>
                  {row.values.map((value, j) => (
                    <td key={figure.columns[j + 1]}>{value}</td>
                  ))}
                  <td>
                    <Button variant="quiet" onClick={() => onOpen(row)}>
                      기록 보기
                    </Button>
                    {onSelect && (
                      <Button
                        variant="quiet"
                        aria-pressed={Boolean(sharedMatch && row.items.some(sharedMatch))}
                        onClick={() => onSelect(row)}
                      >
                        함께 선택
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {(opened || expanded) && figure.rows.length > 20 && (
        <Button variant="quiet" onClick={() => setAll((value) => !value)}>
          {all ? '앞 20개만 보기' : `${figure.rows.length}개 값 모두 보기`}
        </Button>
      )}
    </details>
  );
}
const overview = [
  { kind: 'line', title: '언제 기록이 쌓였나요?', detail: '시간에 따른 변화', metric: 'sessions' },
  {
    kind: 'horizontal',
    title: '어느 과목을 기록했나요?',
    detail: '같은 단위의 과목 비교',
    metric: 'writing',
  },
  {
    kind: 'donut',
    title: '기록은 어떻게 나뉘나요?',
    detail: '확정된 글 기록의 과목 구성',
    metric: 'writing',
  },
  {
    kind: 'heatmap',
    title: '어느 때, 어느 과목인가요?',
    detail: '과목과 기간을 함께 보기',
    metric: 'writing',
  },
  {
    kind: 'histogram',
    title: '날짜별 기록 수는 어떤가요?',
    detail: '많고 적은 구간의 분포',
    metric: 'writing',
  },
  {
    kind: 'sankey',
    title: '기록은 어디에 연결됐나요?',
    detail: '전체 → 과목 → 주제의 배분',
    metric: 'writing',
  },
] as const;
export function StatisticsGallery({
  context,
  onChoose,
  onOpen,
  sharedMatch = null,
  onSelect,
}: {
  context: ChartContext;
  onChoose: (kind: ChartKind, metric: ChartContext['metricId']) => void;
  onOpen: (row: ChartRow) => void;
  sharedMatch?: StatisticsMatcher;
  onSelect?: (row: ChartRow) => void;
}) {
  const figures = useMemo(
    () => overview.map((o) => chartFigure({ ...context, metricId: o.metric }, o.kind)),
    [context],
  );
  return (
    <section aria-label="통계 그래프 한눈에 보기">
      <div className="section-heading">
        <h2>기록을 여러 방향에서 보기</h2>
      </div>
      <p className="muted">
        {context.from}–{context.to} · 현재 선택한 공부 범위
      </p>
      <p className="muted">
        추세·비교·구성·관계·분포·배분을 각 목적에 맞는 그래프로 보여줍니다. 원문은 아래 값 목록에서
        열 수 있습니다.
      </p>
      <div className="statistics-gallery">
        {overview.map((item, i) => (
          <Card
            key={item.kind}
            className="statistics-gallery-card"
            role="region"
            aria-label={item.title}
          >
            <div className="section-heading">
              <h3>{item.title}</h3>
              <span className="muted">{chartNames[item.kind]}</span>
            </div>
            <p className="muted">{item.detail}</p>
            {context.metrics.length && context.data && (
              <StatisticsPlot
                figure={figures[i]}
                small
                onOpen={onOpen}
                selectedRows={selectedChartRows(figures[i], sharedMatch)}
              />
            )}
            <Button variant="quiet" onClick={() => onChoose(item.kind, item.metric)}>
              이 그래프 자세히 보기
            </Button>
            {sharedMatch && (
              <p className="statistics-selection-count">
                선택된 근거{' '}
                {
                  uniqueStatisticSources(
                    figures[i].rows.flatMap((row) => row.items.filter(sharedMatch)),
                  ).length
                }
                개 / 이 그래프 전체 근거{' '}
                {uniqueStatisticSources(figures[i].rows.flatMap((row) => row.items)).length}개 ·
                집계값과 분모 유지
              </p>
            )}
            <ChartValues
              figure={figures[i]}
              onOpen={onOpen}
              sharedMatch={sharedMatch}
              onSelect={onSelect}
            />
          </Card>
        ))}
      </div>
    </section>
  );
}
