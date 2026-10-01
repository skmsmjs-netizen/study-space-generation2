import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { PersonalSpace } from './personal-space';
import { PersonalRepository } from '../data/personal-repository';
import { emptyState } from '../domain/model';
const fake = vi.hoisted(() => ({
  id: '70000000-0000-4000-8000-000000000001', load: vi.fn(), access: vi.fn(),
  callback: null as null | ((event: string, session: { user: { id: string } }) => void),
}));
vi.mock('../data/supabase-client', () => ({
  readServerConfig: () => ({ url: 'https://example.supabase.co', publishableKey: 'sb_publishable_test' }),
  createStudyClient: () => ({ auth: {
    onAuthStateChange: (callback: typeof fake.callback) => { fake.callback = callback; callback?.('INITIAL_SESSION', { user: { id: fake.id } }); return { data: { subscription: { unsubscribe() {} } } }; },
    getSession: async () => ({ data: { session: { user: { id: fake.id } } }, error: null }),
  } }),
  onlineTransport: () => ({ load: fake.load }),
}));
function deferred<T>() { let resolve!: (value: T | PromiseLike<T>) => void; const promise = new Promise<T>(done => { resolve = done; }); return { promise, resolve }; }
vi.mock('../data/account-access', () => ({accountAccessClient: () => ({read: fake.access})}));
const nativeLocks = Object.getOwnPropertyDescriptor(navigator, 'locks');
let owned = false, releaseBarrier: Promise<void>;
let request: ReturnType<typeof vi.fn>;
beforeEach(() => {
  localStorage.clear(); vi.clearAllMocks(); owned = false; releaseBarrier = Promise.resolve();
  fake.access.mockResolvedValue({status:'approved',administrator:false});
  fake.load.mockResolvedValue({ sequence: 0, data: emptyState(fake.id, 'personal') });
  // Models Web Locks releasing only after the callback's result settles.
  request = vi.fn(async (name: string, _options: unknown, callback: (lock: Lock | null) => Promise<void>) => {
    if (owned) return callback(null);
    owned = true;
    try { await callback({ name, mode: 'exclusive' } as Lock); }
    finally { await releaseBarrier; owned = false; }
  });
  Object.defineProperty(navigator, 'locks', { configurable: true, value: { request } });
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); if (nativeLocks) Object.defineProperty(navigator, 'locks', nativeLocks); else Reflect.deleteProperty(navigator, 'locks'); });
const open = () => render(<PersonalSpace renderWorkspace={repo => <p>개인 자료 열림 {repo.getSnapshot().userId}</p>} />);
it('releases the writer after a failed initial load instead of holding it behind an error screen', async () => {
  fake.load.mockRejectedValueOnce(Error('연결 실패')); open();
  await screen.findByText('연결 실패'); await waitFor(() => expect(owned).toBe(false));
});
it('waits for its previous writer to finish releasing before retrying', async () => {
  const release = deferred<void>(); releaseBarrier = release.promise;
  fake.load.mockRejectedValueOnce(Error('연결 실패')); open(); await screen.findByText('연결 실패');
  fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
  await act(async () => { await Promise.resolve(); });
  const requestsBeforeRelease = request.mock.calls.length;
  await act(async () => { release.resolve(); });
  expect(await screen.findByText(`개인 자료 열림 ${fake.id}`)).toBeInTheDocument();
  expect(requestsBeforeRelease).toBe(1); expect(request).toHaveBeenCalledTimes(2);
});
it('does not claim a writer for a hidden signup tab until it becomes visible', async () => {
  const visible = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden'); open();
  await act(async () => { await Promise.resolve(); }); expect(request).not.toHaveBeenCalled(); expect(fake.load).not.toHaveBeenCalled();
  await act(async () => { visible.mockReturnValue('visible'); document.dispatchEvent(new Event('visibilitychange')); });
  expect(await screen.findByText(`개인 자료 열림 ${fake.id}`)).toBeInTheDocument(); expect(request).toHaveBeenCalledTimes(1);
});
it('keeps a real foreign writer and the local originals untouched', async () => {
  owned = true; localStorage.setItem('study-space:personal:foreign:draft', '원문\r\n 이유와 예외'); const before = JSON.stringify(localStorage);
  open(); await screen.findByText('다른 창에서 내 공부 공간을 사용 중입니다. 그 창의 입력을 마친 뒤 다시 열어 주세요.');
  expect(fake.load).not.toHaveBeenCalled(); expect(JSON.stringify(localStorage)).toBe(before); expect(owned).toBe(true);
});
it('releases an opening writer on unmount even while its server response is pending', async () => {
  const response = deferred<{ sequence: number; data: ReturnType<typeof emptyState> }>(); fake.load.mockReturnValueOnce(response.promise);
  const view = open(); await waitFor(() => expect(fake.load).toHaveBeenCalledTimes(1)); view.unmount();
  try { await waitFor(() => expect(owned).toBe(false)); }
  finally { response.resolve({ sequence: 0, data: emptyState(fake.id, 'personal') }); }
  expect(localStorage.length).toBe(0);
});
it('does not reopen or release an active writer on token refresh or hiding the page', async () => {
  const visible = vi.spyOn(document, 'visibilityState', 'get'); open(); await screen.findByText(`개인 자료 열림 ${fake.id}`);
  await act(async () => { fake.callback?.('TOKEN_REFRESHED', { user: { id: fake.id } }); visible.mockReturnValue('hidden'); document.dispatchEvent(new Event('visibilitychange')); });
  expect(request).toHaveBeenCalledTimes(1); expect(owned).toBe(true);
});

it('renders a validated cache while the first server load is still pending', async () => {
 const data = emptyState(fake.id, 'personal');
 new PersonalRepository(localStorage, {load: fake.load, execute: async () => {throw Error('unused')}}, {sequence:0,data});
 const response = deferred<{sequence:number;data:typeof data}>(); fake.load.mockReturnValueOnce(response.promise);
 const view = open();
 try { await screen.findByText(`개인 자료 열림 ${fake.id}`); await waitFor(()=>expect(fake.load).toHaveBeenCalledTimes(1)); }
 finally { response.resolve({sequence:0,data}); view.unmount(); }
});

it('shows pending approval without loading records or claiming a writer, then opens after approval', async () => {
  fake.access.mockResolvedValueOnce({status:'pending',administrator:false});
  localStorage.setItem('study-space:personal:preserved:draft','원문과 예외');
  open(); await screen.findByRole('heading',{name:'가입 승인 대기'});
  expect(fake.load).not.toHaveBeenCalled(); expect(request).not.toHaveBeenCalled();
  expect(localStorage.getItem('study-space:personal:preserved:draft')).toBe('원문과 예외');
  fireEvent.click(screen.getByRole('button',{name:'승인 상태 다시 확인'}));
  await screen.findByText(`개인 자료 열림 ${fake.id}`);
});
it.each(['rejected','suspended'])('prevents %s users from loading their workspace', async status => {
  fake.access.mockResolvedValue({status,administrator:false}); open();
  await screen.findByRole('button',{name:'승인 상태 다시 확인'});
  expect(fake.load).not.toHaveBeenCalled(); expect(request).not.toHaveBeenCalled();
});
it('fails closed when the permission service cannot be reached', async () => {
  fake.access.mockRejectedValue(Error('승인 확인 연결 실패')); open();
  await screen.findByText('승인 확인 연결 실패');
  expect(fake.load).not.toHaveBeenCalled(); expect(request).not.toHaveBeenCalled();
});
