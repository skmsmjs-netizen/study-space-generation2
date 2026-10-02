import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { clearUiPerformance, readUiPerformance } from '../data/ui-performance';
import { useRoutePerformance } from './use-route-performance';

let frames: Map<number, FrameRequestCallback>, id: number;
beforeEach(() => {
  clearUiPerformance();
  frames = new Map();
  id = 0;
  window.history.replaceState({}, '', '#/');
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    frames.set(++id, cb);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (key: number) => frames.delete(key));
});
afterEach(() => vi.unstubAllGlobals());
const paint = () =>
  act(() => {
    for (let round = 0; round < 2; round++) {
      const callbacks = [...frames.values()];
      frames.clear();
      for (const cb of callbacks) cb(round);
    }
  });
function transition(to: string, before = true) {
  act(() => {
    if (before) window.dispatchEvent(new Event('study-space:before-navigate'));
    window.history.replaceState({}, '', `#${to}`);
    window.dispatchEvent(new Event('hashchange'));
  });
}
it('records only committed routes, and abandons superseded or unmounted transitions', () => {
  const view = renderHook(({ route }) => useRoutePerformance(route), {
    initialProps: { route: '/' },
  });
  paint();
  expect(readUiPerformance()).toHaveLength(0);
  transition('/search');
  view.rerender({ route: '/search' });
  expect(readUiPerformance()).toHaveLength(0);
  paint();
  expect(readUiPerformance().map((row) => row.phase)).toEqual(['route-render']);
  transition('/materials');
  view.rerender({ route: '/materials' });
  transition('/record');
  view.rerender({ route: '/record' });
  paint();
  expect(readUiPerformance()).toHaveLength(2);
  transition('/search', false);
  view.rerender({ route: '/search' });
  view.unmount();
  paint();
  expect(readUiPerformance()).toHaveLength(2);
});
