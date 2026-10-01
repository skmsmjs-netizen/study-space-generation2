import { describe, expect, it } from 'vitest';
import { applyCommand, validateState } from './commands';
import { createDemoState } from './fixtures';
import { applyInkChange, eraseInk, inkChange, selectInk, transformInk } from './ink-editing';
import type { MemoStroke } from './model';
const line: MemoStroke = {
  id: 'original',
  ink: 'blue',
  width: 2,
  points: [
    { x: 100, y: 200, pressure: 0.2 },
    { x: 500, y: 200, pressure: 0.8 },
  ],
};
describe('editable ink preserves original points and page ownership', () => {
  it('clips a sparse stroke in the middle, preserves interpolated pressure, and undo restores exact originals/order', () => {
    const original = [line, { ...line, id: 'other-page', page: 1 }],
      copy = structuredClone(original);
    const erased = eraseInk(
      original,
      { x: 300, y: 200, pressure: 0.5 },
      19,
      0,
      false,
      () => 'split',
    );
    expect(erased).toHaveLength(3);
    expect(erased[0].points.at(-1)?.x).toBe(280);
    expect(erased[1].points[0].x).toBe(320);
    expect(erased[0].points.at(-1)?.pressure).toBeCloseTo(0.47);
    expect(erased[2]).toBe(original[1]);
    expect(original).toEqual(copy);
    const change = inkChange(original, erased)!;
    expect(applyInkChange(erased, change, true)).toEqual(original);
    expect(applyInkChange(original, change, false)).toEqual(erased);
  });
  it('whole-stroke erasing affects only the current page; a missed eraser leaves objects untouched', () => {
    const original = [line, { ...line, id: 'page-2', page: 1 }];
    expect(eraseInk(original, { x: 300, y: 200, pressure: 0.5 }, 10, 0, true)).toEqual([
      original[1],
    ]);
    expect(eraseInk(original, { x: 0, y: 0, pressure: 0.5 }, 10, 0, false)).toBe(original);
  });
  it('selects only enclosed current-page strokes and clamps moving/scaling to the paper', () => {
    const original = [line, { ...line, id: 'page-2', page: 1 }];
    expect(selectInk(original, { x: 50, y: 150, width: 500, height: 100 }, 0)).toEqual([
      'original',
    ]);
    const moved = transformInk(original, ['original'], 1000, -1000);
    expect(moved[0].points[1].x).toBe(900);
    expect(moved[0].points[0].y).toBe(0);
    expect(moved[1]).toBe(original[1]);
    expect(applyInkChange(moved, inkChange(original, moved)!, true)).toEqual(original);
    const scaled = transformInk(original, ['original'], 0, 0, 1.1);
    expect(scaled[0].points[0].pressure).toBe(0.2);
    expect(scaled[0].id).toBe(line.id);
    expect(original[0]).toBe(line);
  });
  it('round-trips paged and pressure-sensitive strokes through existing save commands without manufacturing study events', () => {
    const before = createDemoState(),
      strokes = [line, { ...line, id: 'page-2', page: 1, pressureSensitive: true }];
    const command = {
      type: 'saveMemo' as const,
      id: 'ink-memo',
      ownerId: null,
      body: '  풀이\n ',
      strokes,
      expectedVersion: 0,
      opId: 'ink-save',
      at: '2026-10-01T12:00:00Z',
      namespace: before.namespace,
      userId: before.userId,
    };
    const next = applyCommand(before, command);
    validateState(next);
    expect(next.memos![0].strokes).toEqual(strokes);
    expect(next.records).toEqual(before.records);
    expect(next.sessions).toEqual(before.sessions);
    expect(() => applyCommand(before, { ...command, strokes: [{ ...line, page: -1 }] })).toThrow();
  });
});

it('lasso includes boundary ink and rejects sparse lines crossing a concave notch', async () => {
 const {selectInkLasso}=await import('./ink-editing');
 const points=(pairs:number[][])=>pairs.map(([x,y])=>({x,y,pressure:.5}));
 const polygon=points([[0,0],[100,0],[100,100],[60,100],[60,40],[40,40],[40,100],[0,100]]);
 const make=(id:string,pairs:number[][],page=0)=>({id,ink:'ink' as const,width:3,page,points:points(pairs)});
 const lines=[make('inside',[[10,10],[30,20]]),make('boundary',[[0,0],[100,0]]),make('notch',[[20,80],[80,80]]),make('other-page',[[10,10],[30,20]],1)];
 expect(selectInkLasso(lines,polygon,0)).toEqual(['inside','boundary']);
 expect(selectInkLasso(lines,polygon.slice(0,2),0)).toEqual([]);
});
