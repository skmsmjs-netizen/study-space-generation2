import { useState } from 'react';
import { beforeEach, expect, it, vi, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoInkPad } from './memo-ink-pad';
import type { MemoStroke } from '../domain/model';
import { readInkPreferences, writeInkPreferences } from '../data/ink-workspace';
let result: MemoStroke[] = [];
const original: MemoStroke = {
  id: 'old-line',
  ink: 'ink',
  width: 3,
  points: [
    { x: 100, y: 100, pressure: 0.3 },
    { x: 400, y: 100, pressure: 0.8 },
  ],
};
function Harness({ start = [] as MemoStroke[] }) {
  const [strokes, setStrokes] = useState(start);
  return (
    <MemoInkPad
      strokes={strokes}
      onChange={(next) => {
        result = next;
        setStrokes(next);
      }}
      onDrawing={() => {}}
      documentKey="person-a:answer-1"
      preferencesKey="person-a:prefs"
    />
  );
}
function surface() {
  const s = screen.getByRole('img', { name: '설명 필기 영역' });
  Object.defineProperty(s, 'setPointerCapture', { value: vi.fn(), configurable: true });
  vi.spyOn(s, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 900,
    height: 600,
    right: 900,
    bottom: 600,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  return s;
}
function draw(svg: HTMLElement, id = 1) {
  fireEvent.pointerDown(svg, {
    pointerId: id,
    pointerType: 'pen',
    button: 0,
    clientX: 50,
    clientY: 50,
    pressure: 0.3,
  });
  fireEvent.pointerMove(svg, {
    pointerId: id,
    pointerType: 'pen',
    clientX: 180,
    clientY: 160,
    pressure: 0.8,
  });
  fireEvent.pointerUp(svg, { pointerId: id, pointerType: 'pen' });
}
beforeEach(() => {
  localStorage.clear();
  result = [];
});
afterEach(() => vi.restoreAllMocks());
it('adds a page, writes without changing existing coordinates, restores page/settings/undo after reopening', () => {
  const view = render(<Harness start={[original]} />);
  fireEvent.change(screen.getByRole('combobox', { name: '펜 색' }), { target: { value: 'green' } });
  fireEvent.click(screen.getByRole('button', { name: '쪽 추가' }));
  draw(surface());
  const saved = result;
  expect(saved[0]).toEqual(original);
  expect(saved[1]).toMatchObject({ page: 1, ink: 'green' });
  view.unmount();
  render(<Harness start={saved} />);
  expect(screen.getByRole('combobox', { name: '필기 쪽' })).toHaveValue('1');
  expect(screen.getByRole('combobox', { name: '펜 색' })).toHaveValue('green');
  fireEvent.click(screen.getByRole('button', { name: '그림 되돌리기' }));
  expect(result).toEqual([original]);
  fireEvent.click(screen.getByRole('button', { name: '다시 그리기' }));
  expect(result).toEqual(saved);
});
it('erases only a segment, preserves it on undo, and finishes a cancelled pen gesture', () => {
  render(<Harness start={[original]} />);
  const svg = surface();
  fireEvent.click(screen.getByRole('button', { name: '지우개' }));
  fireEvent.pointerDown(svg, {
    pointerId: 1,
    pointerType: 'pen',
    button: 0,
    clientX: 250,
    clientY: 100,
  });
  fireEvent.pointerUp(svg, { pointerId: 1, pointerType: 'pen' });
  expect(result).toHaveLength(2);
  fireEvent.click(screen.getByRole('button', { name: '그림 되돌리기' }));
  expect(result).toEqual([original]);
  fireEvent.click(screen.getByRole('button', { name: '펜' }));
  fireEvent.pointerDown(svg, {
    pointerId: 2,
    pointerType: 'pen',
    button: 0,
    clientX: 50,
    clientY: 50,
  });
  fireEvent.pointerCancel(svg, { pointerId: 2, pointerType: 'pen' });
  expect(result).toHaveLength(2);
});
it('keeps hand touches from moving the page during drawing and preserves input if settings persistence fails', () => {
  render(<Harness />);
  const svg = surface();
  fireEvent.pointerDown(svg, {
    pointerId: 1,
    pointerType: 'pen',
    button: 0,
    clientX: 50,
    clientY: 50,
  });
  fireEvent.pointerDown(svg, {
    pointerId: 2,
    pointerType: 'touch',
    button: 0,
    clientX: 20,
    clientY: 20,
  });
  fireEvent.pointerMove(svg, { pointerId: 2, pointerType: 'touch', clientX: 70, clientY: 70 });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw Error('quota');
  });
  fireEvent.pointerUp(svg, { pointerId: 1, pointerType: 'pen' });
  fireEvent(window, new Event('pagehide'));
  expect(result).toHaveLength(1);
  expect(screen.getByRole('alert')).toHaveTextContent('설정과 되돌리기');
});

it('renders the current page of accumulated ink and keeps all other pages unchanged while editing', () => {
  const accumulated: MemoStroke[] = Array.from({ length: 2000 }, (_, index) => ({
    ...original,
    id: `line-${index}`,
    page: Math.floor(index / 100),
  }));
  render(<Harness start={accumulated} />);
  const svg = surface();
  expect(svg.querySelectorAll('path[d]:not([d=""])')).toHaveLength(100);
  fireEvent.change(screen.getByRole('combobox', { name: '필기 쪽' }), { target: { value: '19' } });
  draw(svg);
  expect(result.slice(0, 2000)).toEqual(accumulated);
  expect(result.at(-1)?.page).toBe(19);
  expect(svg.querySelectorAll('path[d]:not([d=""])')).toHaveLength(101);
  fireEvent.click(screen.getByRole('button', { name: '그림 되돌리기' }));
  expect(result).toEqual(accumulated);
});

it('does not replace another open pad’s newer settings when only this drawing is saved', () => {
  const view = render(<Harness />);
  writeInkPreferences('person-a:prefs', { ink: 'green', width: 5, pressure: true, finger: false });
  draw(surface());
  view.unmount();
  expect(readInkPreferences('person-a:prefs')).toEqual({
    ink: 'green',
    width: 5,
    pressure: true,
    finger: false,
  });
});

it('selects a stroke with a tap and moves it with buttons without dragging or changing other pages', () => {
  const other = { ...original, id: 'other-page', page: 1 };
  render(<Harness start={[original, other]} />);
  const svg = surface();
  fireEvent.click(screen.getByRole('button', { name: '선택' }));
  fireEvent.pointerDown(svg, {
    pointerId: 1,
    pointerType: 'pen',
    button: 0,
    clientX: 200,
    clientY: 100,
  });
  fireEvent.pointerUp(svg, { pointerId: 1, pointerType: 'pen' });
  fireEvent.click(screen.getByRole('button', { name: '오른쪽' }));
  expect(result[0].points[0].x).toBe(110);
  expect(result[1]).toEqual(other);
  fireEvent.click(screen.getByRole('button', { name: '그림 되돌리기' }));
  expect(result).toEqual([original, other]);
});
