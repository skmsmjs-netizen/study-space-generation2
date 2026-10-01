import { expect, it } from 'vitest';
import {
  graphLayoutParameters,
  graphVisibleLabels,
  graphLabelWidth,
  layoutStudyGraph,
} from './graph-layout';
const cards = (count: number, long = false) =>
  Array.from({ length: count }, (_, i) => ({
    id: `n${i}`,
    name: long ? `긴 한글 이름의 조건과 예외를 함께 적어 둔 주제 ${i}` : `주제 ${i}`,
  }));
const chain = (count: number) =>
  Array.from({ length: count - 1 }, (_, i) => ({ source: `n${i}`, target: `n${i + 1}` }));
it('adapts to readable name space, graph structure and a narrow viewport without changing input', () => {
  const short = cards(30),
    long = cards(30, true),
    links = chain(30),
    before = structuredClone({ long, links });
  const normal = graphLayoutParameters(short, links),
    named = graphLayoutParameters(long, links);
  expect(named.linkDistance).toBeGreaterThan(normal.linkDistance);
  expect(Math.abs(named.repulsion)).toBeGreaterThan(Math.abs(normal.repulsion));
  const narrow = graphLayoutParameters(long, links, { frame: { width: 300, height: 350 } });
  expect(narrow.linkDistance).toBeGreaterThan(named.linkDistance);
  const hub = graphLayoutParameters(
    long,
    links.map((e, i) => ({ ...e, source: 'n0', target: `n${i + 1}` })),
  );
  expect(hub.sizes.n0).toBeGreaterThan(hub.sizes.n1);
  layoutStudyGraph(long, links);
  expect({ long, links }).toEqual(before);
});
it('ignores duplicate, self and dangling edges when choosing forces', () => {
  const c = cards(3),
    links = chain(3);
  expect(
    graphLayoutParameters(c, [
      ...links,
      ...links,
      { source: 'n0', target: 'n0' },
      { source: 'n0', target: 'gone' },
      { source: 'n1', target: 'n0' },
    ]),
  ).toEqual(graphLayoutParameters(c, links));
});
it.each([1, 30, 100, 300])(
  'settles %i long named nodes with finite, separated positions',
  (count) => {
    const c = cards(count, true),
      links = chain(count),
      result = layoutStudyGraph(c, links);
    expect(Object.keys(result.positions)).toHaveLength(count);
    expect(
      Object.values(result.positions).every((p) => Number.isFinite(p.x) && Number.isFinite(p.y)),
    ).toBe(true);
    for (let a = 0; a < count; a++)
      for (let b = a + 1; b < count; b++) {
        const p = result.positions[c[a].id],
          q = result.positions[c[b].id];
        expect(Math.hypot(p.x - q.x, p.y - q.y)).toBeGreaterThan(40);
      }
  },
);
it('keeps manually positioned points while new connected data arrive and is repeatable', () => {
  const c = cards(30),
    links = chain(30),
    pinned = { n0: { x: 555, y: -444 } };
  const previous = layoutStudyGraph(c.slice(0, 10), chain(10)).positions;
  const result = layoutStudyGraph(c, links, { previous, pinned });
  expect(result.positions.n0).toEqual(pinned.n0);
  expect(layoutStudyGraph(c, links, { previous, pinned })).toEqual(result);
});
it('declutters labels in screen space and always keeps the selected name', () => {
  const c = cards(100, true),
    { positions, parameters } = layoutStudyGraph(c, chain(100));
  const visible = graphVisibleLabels(c, positions, parameters.degree, 0.15, 'n90');
  expect(visible.has('n90')).toBe(true);
  expect(visible.size).toBeLessThan(c.length);
  const rectangles = c
    .filter((c) => visible.has(c.id))
    .map((c) => ({
      x: (positions[c.id].x + 22) * 0.15 - graphLabelWidth(c.name) / 2,
      y: (positions[c.id].y + 22) * 0.15 + Math.max(parameters.sizes[c.id] * 0.15, 4) / 2 + 8,
      w: graphLabelWidth(c.name),
      h: 24,
    }));
  for (const [i, r] of rectangles.entries()) {
    for (const q of rectangles.slice(i + 1)) {
      expect(r.x < q.x + q.w && r.x + r.w > q.x && r.y < q.y + q.h && r.y + r.h > q.y).toBe(false);
    }
  }
  expect(graphVisibleLabels(c, positions, parameters.degree, 1, null).size).toBeGreaterThan(
    visible.size,
  );
});
