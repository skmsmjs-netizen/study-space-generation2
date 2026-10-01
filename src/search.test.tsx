import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { DEMO_KEY } from './data/demo-repository';

const nativeLocks = Object.getOwnPropertyDescriptor(navigator, 'locks');
beforeEach(() => {
  localStorage.clear(); sessionStorage.clear();
  history.replaceState(null, '', '/?space=demo#/search');
  Object.defineProperty(navigator, 'locks', { configurable: true, value: {
    request: vi.fn(async (_name: string, _options: LockOptions, callback: (lock: Lock) => unknown) =>
      callback({ name: 'study-space:demo:writer', mode: 'exclusive' } as Lock)),
  } });
});
afterEach(async () => {
  cleanup(); await Promise.resolve(); vi.restoreAllMocks();
  if (nativeLocks) Object.defineProperty(navigator, 'locks', nativeLocks);
  else Reflect.deleteProperty(navigator, 'locks');
});
async function openSearch() {
  render(<App />);
  return screen.findByRole('searchbox', { name: '과목·목차·기록 검색' });
}

describe('search result states', () => {
  it('distinguishes an empty query from no matching results without changing saved data', async () => {
    const search = await openSearch(), before = localStorage.getItem(DEMO_KEY);
    expect(screen.getByRole('heading', { name: '어떤 내용을 찾으시나요?' })).toBeInTheDocument();
    fireEvent.change(search, { target: { value: 'qa-no-match-20260930' } });
    expect(screen.getByRole('heading', { name: '일치하는 내용을 찾지 못했습니다' })).toBeInTheDocument();
    expect(search).toHaveValue('qa-no-match-20260930');
    expect(screen.queryByRole('heading', { name: '어떤 내용을 찾으시나요?' })).toBeNull();
    fireEvent.change(search, { target: { value: '함수' } });
    expect(screen.getByRole('link', { name: '함수는 어떤 관계일까?' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '일치하는 내용을 찾지 못했습니다' })).toBeNull();
    fireEvent.change(search, { target: { value: '' } });
    expect(screen.getByRole('heading', { name: '어떤 내용을 찾으시나요?' })).toBeInTheDocument();
    expect(localStorage.getItem(DEMO_KEY)).toBe(before);
  });

  it('keeps query and scope on return and publishes no-result feedback only after composition', async () => {
    const search = await openSearch(), user = userEvent.setup();
    fireEvent.compositionStart(search);
    fireEvent.change(search, { target: { value: '없는말시험' } });
    expect(screen.queryByRole('heading', { name: '일치하는 내용을 찾지 못했습니다' })).toBeNull();
    fireEvent.compositionEnd(search, { data: '없는말시험' });
    expect(screen.getByRole('heading', { name: '일치하는 내용을 찾지 못했습니다' })).toBeInTheDocument();
    fireEvent.change(search, { target: { value: '함수' } });
    await user.selectOptions(screen.getByRole('combobox', { name: '공부 범위' }), 'independent');
    expect(screen.getByRole('heading', { name: '일치하는 내용을 찾지 못했습니다' })).toBeInTheDocument();
    await act(async () => { history.replaceState(null, '', '/?space=demo#/'); window.dispatchEvent(new HashChangeEvent('hashchange')); });
    await act(async () => { history.replaceState(null, '', '/?space=demo#/search'); window.dispatchEvent(new HashChangeEvent('hashchange')); });
    expect(screen.getByRole('searchbox')).toHaveValue('함수');
    expect(screen.getByRole('combobox', { name: '공부 범위' })).toHaveValue('independent');
    expect(screen.getByRole('heading', { name: '일치하는 내용을 찾지 못했습니다' })).toBeInTheDocument();
    await user.selectOptions(screen.getByRole('combobox', { name: '공부 범위' }), 'all');
    expect(screen.getByRole('link', { name: '함수는 어떤 관계일까?' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '일치하는 내용을 찾지 못했습니다' })).toBeNull();
  });
});
