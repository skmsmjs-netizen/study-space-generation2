import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { Modal } from './index';
import { playRouteEntrance, routeMotionKind } from './interaction-motion';

afterEach(() => { vi.useRealTimers(); delete document.documentElement.dataset.motion; });

it('releases interaction immediately on close and cancels a stale removal on reopen', () => {
  vi.useFakeTimers();
  function Example() {
    const [open, setOpen] = useState(false);
    return <><button type="button" onClick={() => setOpen(true)}>열기</button><Modal open={open} title="메모" onClose={() => setOpen(false)}><textarea aria-label="원문" defaultValue={'  조건\n예외  '} /></Modal></>;
  }
  render(<Example />);
  const trigger = screen.getByRole('button', { name: '열기' });
  trigger.focus(); fireEvent.click(trigger);
  const editor = screen.getByRole('textbox');
  fireEvent.change(editor, { target: { value: '  수정\n예외  ' } });
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).toBeNull();
  const retiring = document.querySelector('.ui-overlay')!;
  expect(retiring).toHaveAttribute('inert');
  expect(retiring).toHaveAttribute('aria-hidden', 'true');
  expect(trigger).toHaveFocus();
  expect(document.body.style.overflow).not.toBe('hidden');
  fireEvent.click(trigger);
  act(() => vi.advanceTimersByTime(200));
  expect(screen.getByRole('textbox')).toBe(editor);
  expect(editor).toHaveValue('  수정\n예외  ');
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

it('removes closing decoration immediately when reduced motion changes', async () => {
  vi.useFakeTimers();
  const view = render(<Modal open title="원문" onClose={() => {}}>내용</Modal>);
  view.rerender(<Modal open={false} title="원문" onClose={() => {}}>내용</Modal>);
  expect(document.querySelector('.ui-overlay')).not.toBeNull();
  await act(async () => { document.documentElement.dataset.motion = 'reduce'; });
  expect(document.querySelector('.ui-overlay')).toBeNull();
});

it('does not invent hierarchy between unrelated destinations', () => {
  expect(routeMotionKind('/materials', '/materials/source-1')).toBe('forward');
  expect(routeMotionKind('/materials/source-1', '/materials')).toBe('back');
  expect(routeMotionKind('/subjects', '/subject/math')).toBe('forward');
  expect(routeMotionKind('/statistics', '/record')).toBe('fade');
  expect(routeMotionKind('/', '/record')).toBe('fade');
});

it('cancels only its own entrance on interaction and respects reduced motion', async () => {
  const main = document.createElement('main'); main.innerHTML = '<h1>자료</h1><textarea>원문</textarea>';
  document.body.append(main);
  const cancel = vi.fn();
  let complete: () => void = () => {};
  const finished = new Promise<void>(resolve => { complete = resolve; });
  const animate = vi.fn(() => ({ cancel, finished }));
  main.animate = animate as unknown as HTMLElement['animate'];
  const stop = playRouteEntrance(main, '/record', '/statistics');
  expect(animate).toHaveBeenCalledOnce();
  fireEvent.pointerDown(main.querySelector('textarea')!);
  expect(cancel).toHaveBeenCalledOnce();
  stop(); expect(cancel).toHaveBeenCalledOnce();
  document.documentElement.dataset.motion = 'reduce';
  playRouteEntrance(main, '/statistics', '/record');
  expect(animate).toHaveBeenCalledOnce();
  complete(); await finished;
  main.remove();
});

it('keeps the exiting view stable when the caller clears its selected dialog', () => {
  vi.useFakeTimers();
  const view = render(<Modal open title="학기 추가" onClose={() => {}}><p>작성한 원문</p></Modal>);
  view.rerender(<Modal open={false} title="목차 추가" onClose={() => {}}><p>다른 과업</p></Modal>);
  expect(document.querySelector('.ui-modal-title')).toHaveTextContent('학기 추가');
  expect(document.querySelector('.ui-modal')).toHaveTextContent('작성한 원문');
  act(() => vi.advanceTimersByTime(120));
  expect(document.querySelector('.ui-overlay')).toBeNull();
});
