import { act, fireEvent, render, screen, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { HISTORY_KEY, HISTORY_STATE, NavigationHistoryProvider } from './navigation-history';

beforeEach(() => { sessionStorage.clear(); history.replaceState({ unrelated: 'keep' }, '', '/#/'); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const back = () => screen.getByRole('button', { name: '뒤로가기' });
const forward = () => screen.getByRole('button', { name: '앞으로가기' });
function visit(hash: string, state: unknown = { unrelated: 'keep' }) {
  act(() => {
    history.replaceState(state, '', hash);
    window.dispatchEvent(new PopStateEvent('popstate', { state }));
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
}

it('keeps icons visible at the entry boundary and preserves other history fields', () => {
  render(<NavigationHistoryProvider><main>진입 화면</main></NavigationHistoryProvider>);
  expect(back()).toBeDisabled(); expect(forward()).toBeDisabled();
  expect(history.state.unrelated).toBe('keep');
  expect(JSON.parse(sessionStorage.getItem(HISTORY_KEY)!)).toHaveProperty('end', 0);
});

it('follows native traversal once per event pair, reloads forward availability and discards a new branch', () => {
  const view = render(<NavigationHistoryProvider><main /></NavigationHistoryProvider>);
  const first = history.state;
  visit('#/subjects'); const second = history.state;
  visit('#/memos');
  expect(back()).toBeEnabled(); expect(forward()).toBeDisabled();
  visit('#/subjects', second);
  expect(forward()).toBeEnabled();
  view.unmount();
  render(<NavigationHistoryProvider><main /></NavigationHistoryProvider>);
  expect(forward()).toBeEnabled();
  visit('#/', first);
  expect(back()).toBeDisabled(); expect(forward()).toBeEnabled();
  visit('#/graph');
  expect(history.state[HISTORY_STATE].index).toBe(1);
  expect(forward()).toBeDisabled();
});

it('flushes before traversal and coalesces rapid clicks without editing or overwriting content', () => {
  render(<NavigationHistoryProvider><main /></NavigationHistoryProvider>);
  visit('#/record');
  const events: string[] = [];
  const capture = () => events.push('capture');
  window.addEventListener('study-space:before-navigate', capture);
  const go = vi.spyOn(history, 'go').mockImplementation(() => { events.push('go'); });
  fireEvent.click(back()); fireEvent.click(back());
  expect(events).toEqual(['capture', 'go']); expect(go).toHaveBeenCalledWith(-1);
  expect(go).toHaveBeenCalledTimes(1);
  window.removeEventListener('study-space:before-navigate', capture);
});

it('keeps in-memory traversal usable when storage is blocked', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  render(<NavigationHistoryProvider><main /></NavigationHistoryProvider>);
  const first = history.state;
  visit('#/memos'); expect(back()).toBeEnabled();
  visit('#/', first); expect(forward()).toBeEnabled();
});

it('keeps authentication callback URLs out of navigation metadata', () => {
  history.replaceState({ unrelated: 'keep' }, '', '/?code=synthetic-callback-secret#/');
  render(<NavigationHistoryProvider><main /></NavigationHistoryProvider>);
  expect(JSON.stringify(history.state)).not.toContain('synthetic-callback-secret');
  expect(Object.keys(history.state[HISTORY_STATE]).sort()).toEqual(['id', 'index']);
  expect(history.state.unrelated).toBe('keep');
});
