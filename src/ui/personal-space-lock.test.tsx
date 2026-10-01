import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { PersonalSpace, ServerStatus } from './personal-space';
import { PersonalRepository } from '../data/personal-repository';
import { emptyState, type Command } from '../domain/model';
import type { SupabaseClient } from '@supabase/supabase-js';

const fake = vi.hoisted(() => ({
  id: '70000000-0000-4000-8000-000000000001', load: vi.fn(), access: vi.fn(), session: vi.fn(), initialSession: true,
  callback: null as null | ((event: string, session: { user: { id: string } }) => void),
}));
vi.mock('../data/supabase-client', () => ({
  readServerConfig: () => ({ url: 'https://example.supabase.co', publishableKey: 'sb_publishable_test' }),
  createStudyClient: () => ({ auth: {
    onAuthStateChange: (callback: typeof fake.callback) => { fake.callback = callback; if (fake.initialSession) callback?.('INITIAL_SESSION', { user: { id: fake.id } }); return { data: { subscription: { unsubscribe() {} } } }; },
    getSession: () => fake.session(),
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
  fake.initialSession = true; fake.session.mockResolvedValue({ data: { session: { user: { id: fake.id } } }, error: null });
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


it('does not reload or hide a conflict while its archive is pending or fails', async () => {
  const server = { sequence: 0, data: emptyState(fake.id, 'personal') };
  const original = new PersonalRepository(localStorage, {load: async()=>server, execute: async()=>{throw Error('offline');}}, server);
  const command = { type:'addSubject', id:'original-subject', name:'기기 원문', scope:{kind:'independent'}, opId:'archive-ui', at:'2026-10-01T00:00:00.000Z', userId:fake.id, namespace:'personal' } as Command;
  original.execute(command); await original.flush();
  const remote = { sequence:1, data:emptyState(fake.id,'personal') };
  const repo = new PersonalRepository(localStorage, {load:async()=>remote,execute:async()=>remote}, remote);
  let reject!: (error: Error)=>void;
  const archive = vi.spyOn(repo,'openServerWithArchive').mockImplementation(()=>new Promise<void>((_,fail)=>{reject=fail;}));
  const reload = vi.fn(); vi.stubGlobal('location',{reload});
  try {
    render(<ServerStatus repository={repo} client={{auth:{signOut:vi.fn()}} as unknown as SupabaseClient}/>);
    fireEvent.click(screen.getByRole('button',{name: /다른 기기의 변경/}));
    fireEvent.click(screen.getByRole('button',{name:'이 기기의 글을 보관하고 서버 자료 열기'}));
    expect(archive).toHaveBeenCalledOnce(); expect(reload).not.toHaveBeenCalled();
    expect(screen.getByRole('button',{name:'이 기기의 글을 보관하고 서버 자료 열기'})).toBeDisabled();
    await act(async()=>{reject(Error('IDB commit aborted'));});
    expect(screen.getByRole('heading',{name:'두 자료를 확인해 주세요'})).toBeInTheDocument();
    expect(screen.getByText(/보관을 마치지 못해 서버 자료로 전환하지 않았습니다/)).toBeInTheDocument();
    expect(reload).not.toHaveBeenCalled();
    archive.mockResolvedValueOnce(undefined);
    fireEvent.click(screen.getByRole('button',{name:'이 기기의 글을 보관하고 서버 자료 열기'}));
    await waitFor(()=>expect(reload).toHaveBeenCalledOnce());
  } finally { vi.unstubAllGlobals(); }
});

it('offers preserved originals on the opening error screen and waits for the recovery download', async () => {
  const original = '{ 손상된 원문\r\n 조건과 예외  ';
  const key = `study-space:personal:${fake.id}:online:v1:window:damaged`;
  localStorage.setItem(key, original);
  localStorage.setItem('study-space:personal:another-owner:online:v1', '다른 계정');
  fake.load.mockRejectedValueOnce(Error('연결 실패'));
  let downloaded!: Blob;
  const create = vi.fn((blob:Blob)=>{downloaded=blob;return 'blob:recovery-test';});
  vi.stubGlobal('URL', class extends URL { static createObjectURL=create; static revokeObjectURL=vi.fn(); });
  const click = vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
  try {
    open(); await screen.findByText('연결 실패');
    fireEvent.click(screen.getByRole('button',{name:'이 기기의 기록·보관본 내려받기'}));
    await waitFor(()=>expect(click).toHaveBeenCalledOnce());
    const raw = await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsText(downloaded);});
    expect(JSON.parse(raw).windowRecovery).toContainEqual(expect.objectContaining({key,raw:original}));
    expect(raw).not.toContain('another-owner');
  } finally { vi.unstubAllGlobals(); }
});


it.each([false, true])('leaves loading and preserves the auth failure notice when getSession rejects (initial event: %s)', async initialSession => {
  fake.initialSession = initialSession;
  fake.session.mockRejectedValueOnce(Error('기기의 로그인 저장소를 열지 못했습니다. 원문은 남아 있습니다.'));
  open();
  await screen.findByText('기기의 로그인 저장소를 열지 못했습니다. 원문은 남아 있습니다.');
  expect(screen.getByLabelText('이메일')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^로그인$/ })).toBeEnabled();
  expect(screen.queryByText('내 기록을 불러오는 중…')).not.toBeInTheDocument();
});
