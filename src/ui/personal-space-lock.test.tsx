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
vi.mock('../data/account-access', () => ({accountAccessClient: () => ({read: fake.access})}));
vi.mock('../data/study-ai', () => ({
  localAIStatus: async () => ({configured:false,model:'synthetic',local:true}),
  connectLocalAI: vi.fn(), updateGPTConnection: vi.fn(),
  CHATGPT_USAGE_URL:'https://chatgpt.com/settings/usage',
}));
vi.mock('../data/indexed-personal-journal', async importOriginal => {
  const actual = await importOriginal<typeof import('../data/indexed-personal-journal')>();
  const { PersonalRepository } = await import('../data/personal-repository');
  return { ...actual, openPersonalRepository: async (storage: Storage, transport: any, server: any, _factory: unknown, cached: boolean, key: string) => new PersonalRepository(storage, transport, server, cached, key) };
});
function deferred<T>() { let resolve!: (value: T | PromiseLike<T>) => void; const promise = new Promise<T>(done => { resolve = done; }); return { promise, resolve }; }
const nativeLocks = Object.getOwnPropertyDescriptor(navigator, 'locks');
let request: ReturnType<typeof vi.fn>;
const held = new Set<string>();
beforeEach(() => {
  fake.id = '70000000-0000-4000-8000-000000000001';
  localStorage.clear(); sessionStorage.clear(); vi.clearAllMocks(); held.clear();
  fake.access.mockResolvedValue({status:'approved',administrator:false});
  fake.load.mockResolvedValue({ sequence: 0, data: emptyState(fake.id, 'personal') });
  request = vi.fn(async (name: string, _options: unknown, callback: (lock: Lock | null) => Promise<void>) => {
    if (name.endsWith(':sessions')) return callback({ name, mode: 'shared' } as Lock);
    if (held.has(name)) return callback(null);
    held.add(name);
    try { await callback({ name, mode: 'exclusive' } as Lock); }
    finally { held.delete(name); }
  });
  Object.defineProperty(navigator, 'locks', { configurable: true, value: { request } });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); if (nativeLocks) Object.defineProperty(navigator, 'locks', nativeLocks); else Reflect.deleteProperty(navigator, 'locks'); });
const open = () => render(<PersonalSpace renderWorkspace={repo => <p>개인 자료 열림 {repo.getSnapshot().userId}</p>} />);
it('opens immediately even when the legacy whole-space writer is held', async () => {
  held.add(`study-space:personal:${fake.id}:writer`);
  localStorage.setItem('study-space:personal:foreign:draft', '원문\r\n 이유와 예외');
  open(); await screen.findByText(`개인 자료 열림 ${fake.id}`);
  expect(held.has(`study-space:personal:${fake.id}:writer`)).toBe(true);
  expect(localStorage.getItem('study-space:personal:foreign:draft')).toBe('원문\r\n 이유와 예외');
  expect(screen.queryByText(/다른 창에서 내 공부 공간/)).not.toBeInTheDocument();
});
it('opens two simultaneous spaces with separate durable journals', async () => {
  const first = open(); await screen.findByText(`개인 자료 열림 ${fake.id}`);
  const second = open(); await waitFor(() => expect(screen.getAllByText(`개인 자료 열림 ${fake.id}`)).toHaveLength(2));
  expect(held.size).toBe(2);
  expect(Array.from(held).every(key => key.startsWith('study-space:journal:'))).toBe(true);
  first.unmount(); second.unmount(); await waitFor(() => expect(held.size).toBe(0));
});
it('releases only its own journal after initial load failure and retries', async () => {
  fake.load.mockRejectedValueOnce(Error('연결 실패')); open();
  await screen.findByText('연결 실패'); await waitFor(() => expect(held.size).toBe(0));
  fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
  await screen.findByText(`개인 자료 열림 ${fake.id}`);
});
it('opens without Web Locks by creating an isolated journal', async () => {
  Reflect.deleteProperty(navigator, 'locks'); open();
  await screen.findByText(`개인 자료 열림 ${fake.id}`);
});
it('releases an opening journal on unmount while a server response is pending', async () => {
  const response = deferred<{ sequence: number; data: ReturnType<typeof emptyState> }>(); fake.load.mockReturnValueOnce(response.promise);
  const view = open(); await waitFor(() => expect(fake.load).toHaveBeenCalledTimes(1)); view.unmount();
  try { await waitFor(() => expect(held.size).toBe(0)); }
  finally { response.resolve({ sequence: 0, data: emptyState(fake.id, 'personal') }); }
  expect(localStorage.length).toBe(0);
});
it('does not reopen on token refresh or hiding the page', async () => {
  const visible = vi.spyOn(document, 'visibilityState', 'get'); open(); await screen.findByText(`개인 자료 열림 ${fake.id}`);
  const count = request.mock.calls.length;
  await act(async () => { fake.callback?.('TOKEN_REFRESHED', { user: { id: fake.id } }); visible.mockReturnValue('hidden'); document.dispatchEvent(new Event('visibilitychange')); });
  expect(request).toHaveBeenCalledTimes(count); expect(held.size).toBe(1);
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

it('renders a validated cache while the first server load is still pending', async () => {
 const data = emptyState(fake.id, 'personal');
 new PersonalRepository(localStorage, {load: fake.load, execute: async () => {throw Error('unused')}}, {sequence:0,data});
 const response = deferred<{sequence:number;data:typeof data}>(); fake.load.mockReturnValueOnce(response.promise);
 const view = open();
 try { await screen.findByText(`개인 자료 열림 ${fake.id}`); await waitFor(()=>expect(fake.load).toHaveBeenCalledTimes(1)); }
 finally { response.resolve({sequence:0,data}); view.unmount(); }
});
