import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { HomeTools } from './home-tools';

const visibility = Object.getOwnPropertyDescriptor(document, 'visibilityState');
afterEach(() => {
  cleanup();
  if (visibility) Object.defineProperty(document, 'visibilityState', visibility);
  else Reflect.deleteProperty(document, 'visibilityState');
  vi.useRealTimers();
});

it('refreshes from the wall clock after a hidden interval and keeps the action focus', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-01T14:59:30Z'));
  const onNavigate = vi.fn();
  const view = render(<HomeTools onNavigate={onNavigate} />);
  const time = view.container.querySelector('time');
  const action = screen.getByRole('button', { name: '자유롭게 쓰기' });
  action.focus();
  expect(time).toHaveTextContent('23:59');
  act(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(180_000);
  });
  expect(time).toHaveTextContent('23:59');
  act(() => {
    vi.setSystemTime(new Date('2026-10-02T00:14:30Z'));
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  expect(time).toHaveTextContent('09:14');
  expect(screen.getByText('2026년 10월 2일 금요일')).toBeInTheDocument();
  expect(action).toHaveFocus();
  expect(onNavigate).not.toHaveBeenCalled();
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});
