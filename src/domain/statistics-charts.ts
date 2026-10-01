import type { AppState } from './model';
import {
  shiftDay,
  statisticBounds,
  validPeriod,
  type Metric,
  type MetricId,
  type StatisticItem,
} from './statistics';

export const chartFamilies = [
  { id: 'trend', label: '추세', kinds: ['line', 'area', 'column', 'mixed', 'stacked-area'] },
  { id: 'comparison', label: '비교', kinds: ['horizontal', 'paired', 'radar'] },
  { id: 'distribution', label: '분포', kinds: ['histogram', 'box'] },
  { id: 'relationship', label: '관계', kinds: ['scatter', 'bubble', 'heatmap'] },
  { id: 'composition', label: '구성', kinds: ['donut', 'pie', 'stacked-bar', 'treemap'] },
  { id: 'flow', label: '흐름·증감', kinds: ['sankey', 'waterfall'] },
] as const;
export type ChartFamily = (typeof chartFamilies)[number]['id'];
export type ChartKind = (typeof chartFamilies)[number]['kinds'][number];
export const chartNames: Record<ChartKind, string> = {
  line: '선',
  area: '영역',
  column: '세로막대',
  mixed: '막대·선 혼합',
  'stacked-area': '누적 영역',
  horizontal: '가로막대',
  paired: '이전 기간과 나란히',
  radar: '방사형',
  histogram: '히스토그램',
  box: '상자',
  scatter: '산점도',
  bubble: '버블',
  heatmap: '히트맵',
  donut: '도넛',
  pie: '원',
  'stacked-bar': '누적 막대',
  treemap: '트리맵',
  sankey: '생키',
  waterfall: '폭포',
};
export interface ChartRow {
  unit?: string;
  label: string;
  values: (string | number)[];
  items: StatisticItem[];
}
export interface ChartFigure {
  kind: ChartKind;
  title: string;
  description: string;
  traces: Record<string, unknown>[];
  layout: Record<string, unknown>;
  columns: string[];
  rows: ChartRow[];
  reason?: string;
}
export interface ChartContext {
  data: AppState;
  metrics: Metric[];
  metricId: MetricId;
  secondMetricId: MetricId;
  from: string;
  to: string;
  compare: boolean;
  subjectIds: string[];
  subjectId: string;
  limit?: number;
}
export function chartFigure(c: ChartContext, kind: ChartKind): ChartFigure {
  const metric = c.metrics.find((m) => m.id === c.metricId)!;
  const second = c.metrics.find((m) => m.id === c.secondMetricId)!;
  const figure: ChartFigure = {
    kind,
    title: chartNames[kind],
    description: '',
    traces: [],
    layout: {},
    columns: [],
    rows: [],
  };
  if (!validPeriod(c.from, c.to)) {
    figure.reason = '기간의 시작일과 종료일을 확인해 주세요.';
    return figure;
  }
  const days = Math.round((Date.parse(c.to) - Date.parse(c.from)) / 86400000) + 1;
  const previousFrom = shiftDay(c.from, -days),
    previousTo = shiftDay(c.from, -1);
  const exact = (m: Metric, items = m.items) => ({
    ...m,
    items: items.filter((i) => i.date.kind === 'exact'),
  });
  const current = exact(metric),
    pairedMetric = exact(second);
  const bounds = (m: Metric, from = c.from, to = c.to) => statisticBounds(m, from, to);
  const additive = metric.id !== 'sessions';
  const parts = exact(
    metric,
    metric.items.filter((i) => i.maximum === i.value),
  );
  const activeNodes = c.data.nodes.filter(
    (n) => !n.deletedAt && n.userId === c.data.userId && n.namespace === c.data.namespace,
  );
  const activeSubjects = c.data.subjects.filter(
    (s) => !s.deletedAt && s.userId === c.data.userId && s.namespace === c.data.namespace,
  );
  const ownerByTarget = new Map(activeNodes.map((n) => [n.id, n.subjectId]));
  for (const s of activeSubjects) ownerByTarget.set(s.id, s.id);
  const subjects = activeSubjects.filter(
    (s) => c.subjectIds.includes(s.id) && (!c.subjectId || s.id === c.subjectId),
  );
  const names = new Map([
    ...activeNodes.map((n) => [n.id, n.name] as const),
    ...activeSubjects.map((s) => [s.id, s.name] as const),
  ]);
  const name = (id: string) => names.get(id) ?? id;
  const subjectLabel = (id: string) => {
    const label = name(id);
    return subjects.filter((s) => s.name === label).length > 1
      ? `${label} · ${subjects.findIndex((s) => s.id === id) + 1}`
      : label;
  };
  const groups = subjects.map((s) => ({
    id: s.id,
    label: subjectLabel(s.id),
    items: current.items.filter((i) => ownerByTarget.get(i.targetId) === s.id),
    partItems: parts.items.filter((i) => ownerByTarget.get(i.targetId) === s.id),
  }));
  const total = bounds(current),
    previous = bounds(current, previousFrom, previousTo);
  const limit = c.limit ?? 12;
  const grouped = (useParts = false) => {
    const all = groups
      .map((g) => ({ ...g, items: useParts ? g.partItems : g.items }))
      .map((g) => ({
        ...g,
        value: bounds({ ...metric, items: g.items }).lower,
        previous: bounds({ ...metric, items: g.items }, previousFrom, previousTo).lower,
      }))
      .sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
    if (all.length <= limit) return all;
    const rest = all.slice(limit - 1),
      items = rest.flatMap((g) => g.items);
    return [
      ...all.slice(0, limit - 1),
      {
        id: 'other',
        label: `나머지 ${rest.length}개 과목`,
        items,
        partItems: [],
        value: bounds({ ...metric, items }).lower,
        previous: bounds({ ...metric, items }, previousFrom, previousTo).lower,
      },
    ];
  };
  const temporal = (m: Metric, max = 14) => {
    const step = Math.max(1, Math.ceil(days / max));
    return Array.from({ length: Math.ceil(days / step) }, (_, i) => {
      const lo = shiftDay(c.from, i * step),
        hi = shiftDay(c.from, Math.min(days - 1, (i + 1) * step - 1));
      return {
        lo,
        hi,
        label: lo === hi ? lo : `${lo}–${hi}`,
        current: bounds(m, lo, hi),
        previous: bounds(
          m,
          shiftDay(previousFrom, i * step),
          shiftDay(previousFrom, Math.min(days - 1, (i + 1) * step - 1)),
        ),
      };
    });
  };
  const bins = temporal(current),
    x = bins.map((b) => b.lo),
    y = bins.map((b) => b.current.lower),
    prev = bins.map((b) => b.previous.lower);
  const timelineRows = () =>
    bins.map((b) => ({
      label: b.label,
      values: [b.current.lower, ...(c.compare ? [b.previous.lower] : [])],
      items: [...b.current.evidence, ...(c.compare ? b.previous.evidence : [])],
    }));
  const axes = {
    xaxis: { title: { text: '기록일' } },
    yaxis: { title: { text: `${metric.label} (${metric.unit})` }, rangemode: 'tozero' },
  };
  const trace = (type: string, extra: Record<string, unknown>) => ({ type, ...extra });
  const emptyParts = () => {
    if (!additive) {
      figure.reason =
        '한 공부 회차에 여러 과목이 함께 들어갈 수 있어 과목별 회차를 비율로 합치지 않습니다. 남긴 글·주제·공부 활동 등 서로 겹치지 않는 지표를 선택해 주세요.';
      return true;
    }
    if (!bounds(parts).lower) {
      figure.reason =
        '선택한 기간에 날짜와 값이 모두 확정된 자료가 없습니다. 0을 채워 비율이나 흐름을 만들지 않습니다.';
      return true;
    }
    return false;
  };
  if (['line', 'area', 'column', 'mixed', 'stacked-area'].includes(kind)) {
    figure.title = `${metric.label}의 변화`;
    figure.description = `날짜가 정확한 기록을 ${bins[0].lo === bins[0].hi ? '하루씩' : `${Math.ceil(days / 14)}일씩`} 묶었습니다. 주제 수는 구간마다 고유 주제를 세므로 구간의 합이 기간 전체 주제 수와 다를 수 있습니다. 미기록 구간은 수행 실패나 0점이 아닙니다.`;
    figure.layout = axes;
    figure.columns = [
      '기간',
      `${metric.label} (${metric.unit})`,
      ...(c.compare ? ['이전 기간'] : []),
    ];
    figure.rows = timelineRows();
    if (kind === 'stacked-area') {
      if (!additive) {
        figure.reason =
          '여러 과목에 걸친 회차는 누적해서 더할 수 없습니다. 다른 지표를 선택해 주세요.';
        return figure;
      }
      figure.traces = grouped().map((g) =>
        trace('scatter', {
          name: g.label,
          x,
          y: bins.map((b) => bounds({ ...metric, items: g.items }, b.lo, b.hi).lower),
          mode: 'lines',
          stackgroup: 'subjects',
        }),
      );
    } else {
      figure.traces = [
        trace(kind === 'column' || kind === 'mixed' ? 'bar' : 'scatter', {
          name: '현재 기간',
          x,
          y,
          ...(kind === 'column' || kind === 'mixed'
            ? {}
            : { mode: 'lines+markers', ...(kind === 'area' ? { fill: 'tozeroy' } : {}) }),
        }),
      ];
      if (c.compare || kind === 'mixed')
        figure.traces.push(
          trace(kind === 'column' ? 'bar' : 'scatter', {
            name: '이전 기간 · 같은 위치의 구간',
            x,
            y: prev,
            ...(kind === 'column' ? {} : { mode: 'lines+markers', line: { dash: 'dot' } }),
          }),
        );
      if (kind === 'mixed' && !c.compare) {
        figure.columns.push('이전 기간');
        figure.rows = bins.map((b) => ({
          label: b.label,
          values: [b.current.lower, b.previous.lower],
          items: [...b.current.evidence, ...b.previous.evidence],
        }));
      }
    }
  } else if (['horizontal', 'paired', 'radar'].includes(kind)) {
    const gs = grouped();
    figure.title = `과목별 ${metric.label}`;
    figure.description = `같은 단위의 과목별 기록을 비교합니다. ${metric.id === 'sessions' ? '같은 회차가 여러 과목에 포함되므로 과목별 값을 더해 전체 회차로 읽지 않습니다.' : ''} 과목이 많으면 상위 ${limit - 1}개와 나머지 묶음으로 보여줍니다.`;
    figure.columns = [
      '과목',
      `현재 (${metric.unit})`,
      ...(kind === 'paired' || c.compare ? ['이전 기간'] : []),
    ];
    figure.rows = gs.map((g) => ({
      label: g.label,
      values: [g.value, ...(kind === 'paired' || c.compare ? [g.previous] : [])],
      items: [
        ...bounds({ ...metric, items: g.items }).evidence,
        ...bounds({ ...metric, items: g.items }, previousFrom, previousTo).evidence,
      ],
    }));
    if (kind === 'radar') {
      if (gs.length < 3) {
        figure.reason =
          '방사형 비교에는 같은 단위로 비교할 항목이 세 개 이상 필요합니다. 가로막대로 비교할 수 있습니다.';
        return figure;
      }
      figure.traces = [
        trace('scatterpolar', {
          theta: [...gs.map((g) => g.label), gs[0].label],
          r: [...gs.map((g) => g.value), gs[0].value],
          mode: 'lines+markers',
          name: '현재 기간',
        }),
      ];
      if (c.compare)
        figure.traces.push(
          trace('scatterpolar', {
            theta: [...gs.map((g) => g.label), gs[0].label],
            r: [...gs.map((g) => g.previous), gs[0].previous],
            mode: 'lines+markers',
            name: '이전 기간',
            line: { dash: 'dot' },
          }),
        );
      figure.layout = { polar: { radialaxis: { rangemode: 'tozero' } } };
      figure.description += ' 기록 수의 모양이며 능력·숙달 점수가 아닙니다.';
    } else {
      figure.traces = [
        trace('bar', {
          orientation: 'h',
          x: gs.map((g) => g.value),
          y: gs.map((g) => g.label),
          name: '현재 기간',
        }),
      ];
      if (kind === 'paired' || c.compare)
        figure.traces.push(
          trace('bar', {
            orientation: 'h',
            x: gs.map((g) => g.previous),
            y: gs.map((g) => g.label),
            name: '이전 기간',
          }),
        );
      figure.layout = {
        barmode: 'group',
        xaxis: { title: { text: metric.unit }, rangemode: 'tozero' },
        yaxis: { autorange: 'reversed', automargin: true },
      };
    }
  } else if (kind === 'histogram' || kind === 'box') {
    const observations = temporal(current, 366),
      sample = observations.map((b) => b.current.lower),
      step = Math.ceil(days / 366);
    figure.title = `${step === 1 ? '하루' : '구간'}별 기록 수의 분포`;
    figure.description = `${observations.length}개 ${step === 1 ? '날짜' : `${step}일 구간`}의 기록 수입니다. 0은 이 자료에서 기록을 찾지 못했다는 뜻입니다. 상자 표시에는 원래 관측점도 함께 표시합니다.`;
    figure.columns = ['관측 기간', `${metric.label} (${metric.unit})`];
    figure.rows = observations.map((b) => ({
      label: b.label,
      values: [b.current.lower],
      items: b.current.evidence,
    }));
    figure.traces = [
      trace(
        kind,
        kind === 'histogram'
          ? {
              x: sample,
              name: '기록 수',
              nbinsx: Math.min(20, Math.max(1, Math.ceil(Math.sqrt(sample.length)))),
            }
          : { y: sample, name: '기록 수', boxpoints: 'all', jitter: 0.25, pointpos: 0 },
      ),
    ];
    figure.layout =
      kind === 'histogram'
        ? {
            xaxis: { title: { text: `구간별 기록 수 (${metric.unit})` } },
            yaxis: { title: { text: '구간 수' }, rangemode: 'tozero' },
          }
        : { yaxis: { title: { text: metric.unit }, rangemode: 'tozero' } };
  } else if (['scatter', 'bubble', 'heatmap'].includes(kind)) {
    figure.title = kind === 'heatmap' ? '과목과 기간별 기록' : `${metric.label}와 ${second.label}`;
    if (kind === 'heatmap') {
      const gs = grouped();
      figure.description =
        '과목×기간의 실제 기록 수를 명도와 숫자로 표시합니다. 상관계수나 인과관계를 계산한 그림이 아닙니다.';
      const z = gs.map((g) =>
        bins.map((b) => bounds({ ...metric, items: g.items }, b.lo, b.hi).lower),
      );
      figure.traces = [
        trace('heatmap', {
          x,
          y: gs.map((g) => g.label),
          z,
          text: z,
          texttemplate: '%{z}',
          hoverongaps: false,
        }),
      ];
      figure.columns = ['과목 · 기간', `${metric.label} (${metric.unit})`];
      figure.rows = gs.flatMap((g, j) =>
        bins.map((b, i) => ({
          label: `${g.label} · ${b.label}`,
          values: [z[j][i]],
          items: bounds({ ...metric, items: g.items }, b.lo, b.hi).evidence,
        })),
      );
    } else {
      if (metric.id === second.id) {
        figure.reason = '관계를 보려면 서로 다른 두 지표를 선택해 주세요.';
        return figure;
      }
      const other = temporal(pairedMetric),
        coverage = temporal(exact(c.metrics.find((m) => m.id === 'coverage')!));
      figure.description =
        '같은 기간 구간에서 함께 집계한 두 지표입니다. 점은 기록의 동시 관측이며 공부 효과나 인과관계를 뜻하지 않습니다.' +
        (kind === 'bubble'
          ? ' 원의 면적은 해당 구간에서 기록이 닿은 주제 수입니다. 0주제의 점은 작은 표시로 구별합니다.'
          : '');
      figure.traces = [
        trace('scatter', {
          x: y,
          y: other.map((b) => b.current.lower),
          mode: 'markers',
          text: bins.map((b) => b.label),
          name: '기간 구간',
          ...(kind === 'bubble'
            ? {
                marker: {
                  size: coverage.map((b) => b.current.lower),
                  sizemode: 'area',
                  sizemin: 4,
                  sizeref: Math.max(1, ...coverage.map((b) => b.current.lower)) / 900,
                },
                customdata: coverage.map((b) => b.current.lower),
                hovertemplate: '%{text}<br>x=%{x}, y=%{y}<br>주제 %{customdata}<extra></extra>',
              }
            : {}),
        }),
      ];
      figure.layout = {
        xaxis: { title: { text: `${metric.label} (${metric.unit})` }, rangemode: 'tozero' },
        yaxis: { title: { text: `${second.label} (${second.unit})` }, rangemode: 'tozero' },
      };
      figure.columns = [
        '기간',
        `${metric.label} (${metric.unit})`,
        `${second.label} (${second.unit})`,
        ...(kind === 'bubble' ? ['기록이 닿은 주제'] : []),
      ];
      figure.rows = bins.map((b, i) => ({
        label: b.label,
        values: [
          b.current.lower,
          other[i].current.lower,
          ...(kind === 'bubble' ? [coverage[i].current.lower] : []),
        ],
        items: [...b.current.evidence, ...other[i].current.evidence],
      }));
    }
  } else if (['donut', 'pie', 'stacked-bar', 'treemap', 'sankey'].includes(kind)) {
    if (emptyParts()) return figure;
    const gs = grouped(true).filter((g) => g.value > 0);
    figure.title = `${metric.label}의 과목별 구성`;
    figure.description =
      '날짜와 값이 확정되고 서로 겹치지 않는 기록만 같은 분모로 나눕니다. 미확정 횟수·날짜 범위·날짜 미정은 비율에 넣지 않습니다.';
    const sum = gs.reduce((v, g) => v + g.value, 0);
    figure.columns = ['과목', `${metric.label} (${metric.unit})`, '확정 기록 중 비율'];
    figure.rows = gs.map((g) => ({
      label: g.label,
      values: [g.value, `${((g.value / sum) * 100).toFixed(1)}%`],
      items: bounds({ ...metric, items: g.items }).evidence,
    }));
    if (kind === 'donut' || kind === 'pie')
      figure.traces = [
        trace('pie', {
          labels: gs.map((g) => g.label),
          values: gs.map((g) => g.value),
          hole: kind === 'donut' ? 0.58 : 0,
          textinfo: 'percent',
          hoverinfo: 'label+value+percent',
          sort: false,
        }),
      ];
    if (kind === 'stacked-bar') {
      figure.traces = gs.map((g) =>
        trace('bar', { x: [g.value], y: ['확정 기록 전체'], orientation: 'h', name: g.label }),
      );
      figure.layout = {
        barmode: 'stack',
        xaxis: { title: { text: metric.unit }, rangemode: 'tozero' },
      };
    }
    if (kind === 'treemap')
      figure.traces = [
        trace('treemap', {
          ids: ['root', ...gs.map((g) => g.id)],
          labels: ['확정 기록 전체', ...gs.map((g) => g.label)],
          parents: ['', ...gs.map(() => 'root')],
          values: [sum, ...gs.map((g) => g.value)],
          branchvalues: 'total',
          textinfo: 'label+value+percent parent',
        }),
      ];
    if (kind === 'sankey') {
      // Allocation is observed ownership, not a fabricated temporal transition.
      const targets = new Map<string, StatisticItem[]>();
      for (const i of parts.items) {
        if (i.date.kind !== 'exact' || i.date.date < c.from || i.date.date > c.to) continue;
        const a = targets.get(i.targetId) ?? [];
        a.push(i);
        targets.set(i.targetId, a);
      }
      const sorted = [...targets]
        .map(([id, items]) => ({ id, items, value: bounds({ ...metric, items }).lower }))
        .filter((t) => t.value > 0)
        .sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
      const top = sorted.slice(0, 24),
        rest = sorted.slice(24);
      const sgs = grouped(true).filter((g) => g.value > 0);
      const bucket = (target: string) => {
        const subject = ownerByTarget.get(target) ?? '';
        return sgs.some((g) => g.id === subject) ? subject : 'other';
      };
      const subjectNodes = sgs.map((g) => g.id);
      const labels = [
        '확정 기록 전체',
        ...sgs.map((g) => g.label),
        ...top.map((t) => name(t.id)),
        ...(rest.length ? ['나머지 주제'] : []),
      ];
      const sources: number[] = [],
        destinations: number[] = [],
        values: number[] = [];
      for (const g of sgs) {
        const v = bounds({ ...metric, items: g.items }).lower;
        if (v) {
          sources.push(0);
          destinations.push(1 + subjectNodes.indexOf(g.id));
          values.push(v);
        }
      }
      for (const [i, t] of top.entries()) {
        const s = subjectNodes.indexOf(bucket(t.id));
        if (s >= 0) {
          sources.push(1 + s);
          destinations.push(1 + sgs.length + i);
          values.push(t.value);
        }
      }
      if (rest.length)
        for (const g of sgs) {
          const items = rest.filter((t) => bucket(t.id) === g.id).flatMap((t) => t.items),
            value = bounds({ ...metric, items }).lower;
          if (value) {
            sources.push(1 + subjectNodes.indexOf(g.id));
            destinations.push(labels.length - 1);
            values.push(value);
          }
        }
      figure.traces = [
        trace('sankey', {
          arrangement: 'snap',
          node: { label: labels, pad: 14, thickness: 14 },
          link: { source: sources, target: destinations, value: values },
        }),
      ];
      figure.title = '전체 기록 → 과목 → 주제';
      figure.description +=
        ' 선의 굵기는 기록 배분량이며 공부 순서나 사람·능력의 이동을 뜻하지 않습니다. 주제가 많으면 상위24개와 나머지를 묶습니다.';
    }
  } else if (kind === 'waterfall') {
    if (
      current.items.some(
        (item) =>
          item.maximum === null &&
          item.date.kind === 'exact' &&
          item.date.date >= previousFrom &&
          item.date.date <= c.to,
      )
    ) {
      figure.reason =
        '횟수가 미확정인 반복이 있어 두 기간의 증감을 확정할 수 없습니다. 다른 지표를 선택하거나 선 그래프에서 최소 횟수를 확인해 주세요.';
      return figure;
    }
    if (!additive) {
      figure.reason =
        '여러 과목에 걸친 회차를 과목별 증감으로 더할 수 없습니다. 남긴 글 등 겹치지 않는 지표를 선택해 주세요.';
      return figure;
    }
    const gs = grouped(),
      labels = ['이전 기간', ...gs.map((g) => g.label), '현재 기간'],
      deltas = gs.map((g) => g.value - g.previous);
    figure.title = `${metric.label}의 이전 기간 대비 증감`;
    figure.description =
      '현재 자료에서 두 기간을 비교한 기록 수의 차이입니다. 기록 삭제·추가의 시간 순서나 학습 효과를 나타내지 않습니다.';
    figure.traces = [
      trace('waterfall', {
        x: labels,
        y: [previous.lower, ...deltas, 0],
        measure: ['absolute', ...gs.map(() => 'relative'), 'total'],
        name: '기록 수 증감',
        connector: { line: { dash: 'dot' } },
      }),
    ];
    figure.layout = { yaxis: { title: { text: metric.unit }, rangemode: 'tozero' } };
    figure.columns = ['구분', `값 (${metric.unit})`];
    figure.rows = [
      { label: '이전 기간', values: [previous.lower], items: previous.evidence },
      ...gs.map((g, i) => ({
        label: `${g.label} 증감`,
        values: [deltas[i]],
        items: [
          ...bounds({ ...metric, items: g.items }).evidence,
          ...bounds({ ...metric, items: g.items }, previousFrom, previousTo).evidence,
        ],
      })),
      { label: '현재 기간', values: [total.lower], items: total.evidence },
    ];
  }
  figure.layout.uirevision = `${kind}|${metric.id}|${second.id}|${c.from}|${c.to}|${c.subjectIds.join(',')}|${c.subjectId}`;
  figure.rows = figure.rows.map((row) => ({
    ...row,
    unit: kind === 'scatter' || kind === 'bubble' ? '' : metric.unit,
  }));
  return figure;
}
