import { expect, it } from 'vitest';
import { layoutFlowBoxes, alignFlowBoxes, validFlowConnection } from './flow-layout';
import { FlowHistory } from './flow-history';
it('lays out measured large, cyclic, disconnected and long cards without deleting IDs or overlaps', () => {
  const boxes = Array.from({ length: 150 }, (_, index) => ({
    id: `node:${index}`,
    position: { x: -index, y: 99 },
    width: 240 + (index % 4) * 80,
    height: 80 + (index % 3) * 120,
  }));
  const original = structuredClone(boxes);
  const links = boxes.slice(1).map((box, i) => ({ source: boxes[i].id, target: box.id }));
  links.push({ source: 'node:4', target: 'node:1' }, { source: 'missing', target: 'node:9' });
  for (const direction of ['LR', 'TB'] as const) {
    const result = layoutFlowBoxes(boxes, links, direction);
    expect(Object.keys(result)).toEqual(boxes.map((box) => box.id));
    for (const box of boxes) {
      expect(Number.isFinite(result[box.id].x)).toBe(true);
      expect(Number.isFinite(result[box.id].y)).toBe(true);
    }
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = result[boxes[i].id],
          b = result[boxes[j].id];
        expect(
          a.x + boxes[i].width <= b.x ||
            b.x + boxes[j].width <= a.x ||
            a.y + boxes[i].height <= b.y ||
            b.y + boxes[j].height <= a.y,
        ).toBe(true);
      }
  }
  expect(boxes).toEqual(original);
  expect(layoutFlowBoxes([], [])).toEqual({});
});
it('aligns only supplied cards and preserves the other axis', () => {
  const boxes = [
    { id: 'a', position: { x: 20, y: 90 } },
    { id: 'b', position: { x: -50, y: 7 } },
  ];
  expect(alignFlowBoxes(boxes, 'x')).toEqual({ a: { x: -50, y: 90 }, b: { x: -50, y: 7 } });
  expect(alignFlowBoxes([], 'y')).toEqual({});
  expect(boxes[0].position.x).toBe(20);
});
it('rejects self, missing and duplicate connections, but accepts semantic cycles and stable-ID reconnects', () => {
  const ids = new Set(['a', 'b', 'c']),
    links = [{ id: 'original', source: 'a', target: 'b' }];
  expect(validFlowConnection('a', 'a', ids, links)).toBe(false);
  expect(validFlowConnection('missing', 'b', ids, links)).toBe(false);
  expect(validFlowConnection('a', 'b', ids, links)).toBe(false);
  expect(validFlowConnection('b', 'a', ids, links)).toBe(true);
  expect(validFlowConnection('a', 'b', ids, links, 'original')).toBe(true);
});
it('supports multiple undo/redo steps, excludes camera changes and cuts only the abandoned future', () => {
  const history = new FlowHistory(2),
    a = { positions: { 'node:a': { x: 0, y: 0 } }, links: [], viewport: { x: 1, y: 2, zoom: 1 } };
  const b = { ...a, positions: { 'node:a': { x: 9, y: 0 } } },
    c = { ...b, positions: { 'node:a': { x: 19, y: 0 } } };
  history.record(a, { ...a, viewport: { x: 88, y: 99, zoom: 2 } });
  expect(history.canUndo).toBe(false);
  history.record(a, b);
  history.record(b, c);
  expect(history.undo(c)?.positions).toEqual(b.positions);
  const returned = history.undo({ ...b, viewport: { x: 88, y: 99, zoom: 2 } })!;
  expect(returned.positions).toEqual(a.positions);
  expect(returned.viewport!.x).toBe(88);
  expect(history.redo(returned)?.positions).toEqual(b.positions);
  history.record(b, a);
  expect(history.canRedo).toBe(false);
  a.positions['node:a'].x = 999;
  expect(history.undo(a)?.positions).toEqual(b.positions);
});
