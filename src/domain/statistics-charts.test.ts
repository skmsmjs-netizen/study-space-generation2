import { expect, it } from 'vitest';
import { createDemoState } from './fixtures';
import { applyCommand } from './commands';
import { emptyRecommendations } from './recommendation-workspace';
import { statistics } from './statistics';
import { chartFamilies, chartFigure, type ChartContext } from './statistics-charts';
const at = '2026-10-01T01:00:00Z';
function fixture(): ChartContext {
  let data = createDemoState();
  for (let i = 0; i < 4; i++)
    data = applyCommand(data, {
      type: 'saveRecords',
      userId: data.userId,
      opId: `r${i}`,
      at,
      sessionId: `s${i}`,
      dateEvidence: {
        kind: 'exact',
        date: `2026-09-${i === 0 ? '10' : i === 1 ? '20' : i === 2 ? '21' : '30'}`,
      },
      entries: [
        { targetId: 'demo-topic-function', done: true, body: `  원문 ${i}\n조건` },
        { targetId: 'demo-topic-force', done: true, body: `과학 ${i}` },
      ],
    });
  const metrics = statistics(
    data,
    emptyRecommendations(data),
    { from: '2026-09-20', to: '2026-09-30' },
    at,
  );
  return {
    data,
    metrics,
    metricId: 'writing',
    secondMetricId: 'sessions',
    from: '2026-09-20',
    to: '2026-09-30',
    compare: false,
    subjectIds: data.subjects.map((s) => s.id),
    subjectId: '',
  };
}
it('connects all 19 kinds to actual numeric traces without altering source records', () => {
  const context = fixture(),
    before = JSON.stringify(context.data);
  expect(chartFamilies.flatMap((f) => [...f.kinds])).toHaveLength(19);
  for (const kind of chartFamilies.flatMap((f) => [...f.kinds])) {
    const figure = chartFigure(context, kind);
    expect(figure.reason, kind).toBeUndefined();
    expect(figure.traces.length, kind).toBeGreaterThan(0);
    expect(figure.rows.length, kind).toBeGreaterThan(0);
  }
  expect(JSON.stringify(context.data)).toBe(before);
});
it('does not treat a multi-subject session as disjoint composition or additive waterfall', () => {
  const c = fixture();
  c.metricId = 'sessions';
  for (const kind of ['donut', 'pie', 'treemap', 'sankey', 'stacked-area', 'waterfall'] as const)
    expect(chartFigure(c, kind).reason).toBeTruthy();
  expect(
    chartFigure(c, 'horizontal')
      .rows.slice(0, 2)
      .map((r) => r.values[0]),
  ).toEqual([3, 3]);
  expect(chartFigure(c, 'line').rows.reduce((sum, r) => sum + Number(r.values[0]), 0)).toBe(3);
});
it('keeps sankey allocation and waterfall totals equal to the same deduplicated observed records', () => {
  const c = fixture(),
    s = chartFigure(c, 'sankey').traces[0] as {
      link: { source: number[]; target: number[]; value: number[] };
    };
  expect(
    s.link.source.reduce((sum, source, i) => sum + (source === 0 ? s.link.value[i] : 0), 0),
  ).toBe(6);
  for (let subject = 1; subject <= 2; subject++) {
    const incoming = s.link.target.reduce(
      (sum, target, i) => sum + (target === subject ? s.link.value[i] : 0),
      0,
    );
    const outgoing = s.link.source.reduce(
      (sum, source, i) => sum + (source === subject ? s.link.value[i] : 0),
      0,
    );
    expect(incoming).toBe(outgoing);
  }
  const waterfall = chartFigure(c, 'waterfall');
  expect(waterfall.rows[0].values[0]).toBe(2);
  expect(waterfall.rows.at(-1)!.values[0]).toBe(6);
  expect(waterfall.rows.slice(1, -1).reduce((sum, row) => sum + Number(row.values[0]), 2)).toBe(6);
});
it('keeps ranges and unconfirmed counts outside percentages, and guards empty samples and incompatible axes', () => {
  const c = fixture(),
    m = c.metrics.find((m) => m.id === 'writing')!;
  m.items.push({
    ...m.items[0],
    id: 'uncertain',
    date: { kind: 'unknown' },
    value: 999,
    maximum: null,
  });
  expect(chartFigure(c, 'donut').rows.reduce((sum, row) => sum + Number(row.values[0]), 0)).toBe(6);
  c.secondMetricId = 'writing';
  expect(chartFigure(c, 'scatter').reason).toMatch(/서로 다른/);
  c.from = '2026-10-02';
  c.to = '2026-10-03';
  expect(chartFigure(c, 'donut').reason).toBeTruthy();
  c.to = 'bad';
  expect(chartFigure(c, 'line').reason).toMatch(/기간/);
});
it('bounds rendering for years of data and preserves all source IDs in grouped categories', () => {
  const c = fixture();
  c.from = '2020-01-01';
  c.to = '2026-10-01';
  expect(chartFigure(c, 'line').rows.length).toBeLessThanOrEqual(14);
  expect(chartFigure(c, 'histogram').rows.length).toBeLessThanOrEqual(366);
  c.limit = 2;
  const rows = chartFigure(c, 'horizontal').rows;
  expect(rows).toHaveLength(2);
  expect(rows[1].label).toMatch(/나머지/);
  expect(
    rows
      .flatMap((r) => r.items)
      .filter((i) => i.date.kind === 'exact' && i.date.date === '2026-09-30')
      .map((i) => i.recordIds[0]),
  ).toHaveLength(2);
});

it('retains thousands of original IDs while limiting long category names and sankey nodes', () => {
  const c = fixture();
  const subject = c.data.subjects[0],
    node = c.data.nodes.find((n) => n.id === 'demo-topic-function')!;
  c.data.subjects = Array.from({ length: 60 }, (_, i) => ({
    ...subject,
    id: `large-subject-${i}`,
    name: `긴 한국어 과목 이름 ${i} · 조건과 예외 `.repeat(8),
  }));
  c.data.nodes = Array.from({ length: 60 }, (_, i) => ({
    ...node,
    id: `large-target-${i}`,
    subjectId: `large-subject-${i}`,
    name: `긴 주제 ${i}`,
  }));
  c.subjectIds = c.data.subjects.map((s) => s.id);
  const writing = c.metrics.find((m) => m.id === 'writing')!,
    original = writing.items[0];
  writing.items = Array.from({ length: 3000 }, (_, i) => ({
    ...original,
    id: `large-item-${i}`,
    targetId: `large-target-${i % 60}`,
    recordIds: [`large-record-${i}`],
    value: 1,
    maximum: 1,
    date: { kind: 'exact' as const, date: '2026-09-21' },
  }));
  const before = JSON.stringify(c.data),
    figure = chartFigure(c, 'sankey');
  expect(figure.rows).toHaveLength(12);
  expect(new Set(figure.rows.flatMap((r) => r.items.flatMap((item) => item.recordIds))).size).toBe(
    3000,
  );
  const trace = figure.traces[0] as {
    node: { label: string[] };
    link: { source: number[]; target: number[]; value: number[] };
  };
  expect(trace.node.label.length).toBeLessThanOrEqual(38);
  expect(
    trace.link.source.reduce((sum, s, i) => sum + (s === 0 ? trace.link.value[i] : 0), 0),
  ).toBe(3000);
  for (let parent = 1; parent <= 12; parent++)
    expect(
      trace.link.target.reduce((sum, t, i) => sum + (t === parent ? trace.link.value[i] : 0), 0),
    ).toBe(
      trace.link.source.reduce((sum, s, i) => sum + (s === parent ? trace.link.value[i] : 0), 0),
    );
  expect(JSON.stringify(c.data)).toBe(before);
  writing.items[0].maximum = null;
  expect(chartFigure(c, 'waterfall').reason).toMatch(/미확정/);
});

it('uses the current account and namespace for category and target labels', () => {
  const c = fixture(),
    foreign = { ...c.data.subjects[0], userId: 'other-account', name: '다른 계정의 비공개 과목' };
  c.data.subjects.unshift(foreign);
  c.data.nodes.unshift({
    ...c.data.nodes.find((n) => n.id === 'demo-topic-function')!,
    userId: 'other-account',
    name: '다른 계정의 비공개 주제',
  });
  for (const kind of ['horizontal', 'treemap', 'sankey'] as const)
    expect(JSON.stringify(chartFigure(c, kind))).not.toContain('다른 계정의 비공개');
});
