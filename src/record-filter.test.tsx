import { decodeStoredText } from './data/storage-codec';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { DEMO_KEY, readDraft } from './data/demo-repository';

const first = 'demo-topic-function', second = 'demo-topic-graph';
const nativeLocks = Object.getOwnPropertyDescriptor(navigator, 'locks');
beforeEach(() => {
  localStorage.clear(); sessionStorage.clear(); history.replaceState(null, '', '/?space=demo#/record');
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
async function open(path = '/record') {
  history.replaceState(null, '', `/?space=demo#${path}`);
  const view = render(<App />); await screen.findByRole('searchbox', { name: '주제 찾기' }); return view;
}
async function navigate(path: string) {
  await act(async () => { history.replaceState(null, '', `/?space=demo#${path}`); window.dispatchEvent(new HashChangeEvent('hashchange')); });
}

describe('record topic filter context', () => {
  it('restores the filter on return and remount while preserving the same selected draft and session', async () => {
    const user = userEvent.setup(), view = await open();
    const persisted = localStorage.getItem(DEMO_KEY), input = screen.getByRole('searchbox', { name: '주제 찾기' });
    fireEvent.compositionStart(input); fireEvent.change(input, { target: { value: '함수' } });
    expect(screen.getByRole('checkbox', { name: /그래프에서 변화 읽기/ })).toBeInTheDocument();
    fireEvent.compositionEnd(input, { data: '함수' });
    expect(screen.queryByRole('checkbox', { name: /그래프에서 변화 읽기/ })).toBeNull();
    await user.click(screen.getByRole('checkbox', { name: /함수는 어떤 관계일까/ }));
    fireEvent.change(screen.getByRole('textbox', { name: '메모' }), { target: { value: '  일부만 본 뒤\n이어서 기록할 원문\n' } });
    const draft = readDraft(localStorage, 'multiple');
    await navigate('/'); await navigate('/record');
    expect(screen.getByRole('searchbox', { name: '주제 찾기' })).toHaveValue('함수');
    expect(screen.getByRole('checkbox', { name: /함수는 어떤 관계일까/ })).toBeChecked();
    expect(screen.getByRole('textbox', { name: '메모' })).toHaveValue(draft!.bodies[first]);
    view.unmount(); await Promise.resolve(); await open();
    expect(screen.getByRole('searchbox', { name: '주제 찾기' })).toHaveValue('함수');
    expect(readDraft(localStorage, 'multiple')).toEqual(draft);
    expect(localStorage.getItem(DEMO_KEY)).toBe(persisted);
  });

  it('keeps filters separate for multiple and explicit targets and preserves deliberate clearing', async () => {
    await open();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '움직임' } });
    await navigate(`/record/${first}`);
    expect(screen.getByRole('searchbox')).toHaveValue('');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '함수' } });
    await navigate(`/record/${second}`);
    expect(screen.getByRole('searchbox')).toHaveValue('');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '그래프' } });
    await navigate(`/record/${first}`); expect(screen.getByRole('searchbox')).toHaveValue('함수');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
    await navigate('/record'); expect(screen.getByRole('searchbox')).toHaveValue('움직임');
    await navigate(`/record/${second}`); expect(screen.getByRole('searchbox')).toHaveValue('그래프');
    await navigate(`/record/${first}`); expect(screen.getByRole('searchbox')).toHaveValue('');
  });

  it('keeps selection, text and saving usable when filter hint reads and writes fail', async () => {
    const read = Storage.prototype.getItem, write = Storage.prototype.setItem;
    const prefix = 'study-space:demo:context:record-filter:';
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key: string) {
      if (this === sessionStorage && key.startsWith(prefix)) throw new DOMException('denied', 'SecurityError');
      return read.call(this, key);
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key: string, value: string) {
      if (this === sessionStorage && key.startsWith(prefix)) throw new DOMException('denied', 'SecurityError');
      write.call(this, key, value);
    });
    const user = userEvent.setup(); await open();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '함수' } });
    await user.click(screen.getByRole('checkbox', { name: /함수는 어떤 관계일까/ }));
    fireEvent.change(screen.getByRole('textbox', { name: '메모' }), { target: { value: '검색 힌트 실패에도 남길 원문' } });
    await user.click(screen.getByRole('button', { name: '1개 주제 기록 저장' }));
    const data = JSON.parse(decodeStoredText(localStorage.getItem(DEMO_KEY)!)).data;
    expect(data.records).toHaveLength(1);
    expect(data.records[0]).toMatchObject({ targetId: first, body: '검색 힌트 실패에도 남길 원문' });
  });
});
