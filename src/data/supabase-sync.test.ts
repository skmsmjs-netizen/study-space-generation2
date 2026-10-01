// @vitest-environment node
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { AuthApiError, AuthRetryableFetchError, createClient, FunctionsFetchError, FunctionsHttpError, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { onlineTransport } from './supabase-client';
import { DomainError, emptyState, type Command } from '../domain/model';
import { clearRequestPerformance, readRequestPerformance } from './request-performance';
import { accountAccessClient } from './account-access';
import { PersonalRepository } from './personal-repository';
import { applyCommand } from '../domain/commands';
import { invokeAuthenticatedFunction } from './authenticated-function';
const user = '10000000-0000-4000-8000-000000000001';
const known = () => ({ sequence: 4, data: emptyState(user, 'personal') });
function fixture(result: unknown) {
  const invoke = vi.fn(async (_name: string, _options: Record<string, unknown>) => ({ data: result, error: null }));
  const client = {
    auth: { getSession: async () => ({ data: { session: { user: { id: user }, access_token: 'fixture-token' } }, error: null }) },
    functions: { invoke },
  } as unknown as SupabaseClient;
  return { transport: onlineTransport(client), invoke };
}
beforeEach(clearRequestPerformance);
afterEach(() => vi.unstubAllEnvs());
it('routes only multi-operation batches to the known production database region', async () => {
  const f = fixture(known());
  const op = (id:string):Command => ({type:'addSubject',id,name:id,scope:{kind:'independent'},userId:user,namespace:'personal',at:'2026-10-01T00:00:00Z',opId:id});
  await f.transport.load();
  expect(f.invoke.mock.calls[0][1]).not.toHaveProperty('region');
  await f.transport.executeBatch!([op('one'),op('two')],4);
  expect(f.invoke.mock.calls[1][1]).toHaveProperty('region','ap-south-1');
  await f.transport.executeBatch!([op('single')],4);
  expect(f.invoke.mock.calls[2][1]).not.toHaveProperty('region');
  vi.stubEnv('VITE_SUPABASE_URL','https://another.supabase.co');
  await f.transport.executeBatch!([op('three'),op('four')],4);
  expect(f.invoke.mock.calls[3][1]).not.toHaveProperty('region');
});
it('reuses only the authenticated owner base for a matching conditional response', async () => {
  const cached = known(),
    f = fixture({
      unchanged: true,
      sequence: 4,
      userId: user,
      namespace: 'personal',
      supportedCommands: ['saveMemo'],
      syncCapabilities: { batchCommands: true },
    });
  const result = await f.transport.load(cached);
  expect(result.data).toBe(cached.data);
  expect(result.supportedCommands).toEqual(['saveMemo']);
  expect(f.invoke.mock.calls[0]).toEqual([
    'study-command',
    expect.objectContaining({ body: { action: 'load', namespace: 'personal', knownSequence: 4 } }),
  ]);
  expect(readRequestPerformance()).toEqual([
    expect.objectContaining({ phase: 'sync-load', success: true }),
  ]);
});
it('remains compatible with an old server returning the full snapshot', async () => {
  const full = known(),
    f = fixture(full);
  expect(await f.transport.load(known())).toBe(full);
  await f.transport.load();
  expect(f.invoke.mock.calls[1]).toEqual([
    'study-command',
    expect.objectContaining({ body: { action: 'load', namespace: 'personal' } }),
  ]);
});
it.each([
  { sequence: 3, userId: user, namespace: 'personal' },
  { sequence: 4, userId: 'other', namespace: 'personal' },
  { sequence: 4, userId: user, namespace: 'test' },
])('refuses a mismatched unchanged receipt: %j', async (patch) => {
  const f = fixture({ unchanged: true, supportedCommands: [], ...patch });
  await expect(f.transport.load(known())).rejects.toThrow();
  expect(readRequestPerformance()[0].success).toBe(false);
});
it('refuses a foreign cache before transmitting and refuses unchanged without a cache', async () => {
  const f = fixture({
    unchanged: true,
    sequence: 4,
    userId: user,
    namespace: 'personal',
    supportedCommands: [],
  });
  await expect(
    f.transport.load({ ...known(), data: emptyState('other', 'personal') }),
  ).rejects.toThrow();
  expect(f.invoke).not.toHaveBeenCalled();
  await expect(f.transport.load()).rejects.toThrow();
});

const operation = (id = 'subject'): Command => ({ type: 'saveMemo', id, body: '  원문\n보존  ', ownerId: null, strokes: [], expectedVersion: 0, userId: user, namespace: 'personal', at: '2026-10-01T00:00:00Z', opId: `op-${id}` });
const httpError = (status: number, body: unknown = {}) => new FunctionsHttpError(new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }));
function sessionFixture() {
  let session = { user: { id: user }, access_token: 'old-token' } as Session;
  const getSession = vi.fn(async () => ({ data: { session }, error: null }));
  const refreshSession = vi.fn(async () => {
    session = { ...session, access_token: 'renewed-token' };
    return { data: { session, user: session.user }, error: null as Error | null };
  });
  const invoke = vi.fn(async (_name: string, _options: Record<string, unknown>): Promise<{ data: unknown; error: unknown }> => ({ data: known(), error: null }));
  const client = { auth: { getSession, refreshSession }, functions: { invoke } } as unknown as SupabaseClient;
  return { client, invoke, getSession, refreshSession, transport: onlineTransport(client), account: accountAccessClient(client), changeOwner: () => { session = { ...session, user: { ...session.user, id: 'another-user' } }; } };
}

it('refreshes only a confirmed 401 and repeats the identical owner, namespace and command IDs once', async () => {
  const f = sessionFixture(), commands = [operation('first'), operation('second')];
  f.invoke.mockResolvedValueOnce({ data: null, error: httpError(401) });
  await expect(f.transport.executeBatch!(commands, 4)).resolves.toEqual(known());
  expect(f.refreshSession).toHaveBeenCalledTimes(1);
  expect(f.invoke).toHaveBeenCalledTimes(2);
  expect(f.invoke.mock.calls[1][1].body).toBe(f.invoke.mock.calls[0][1].body);
  expect(f.invoke.mock.calls[1][1]).toMatchObject({ region: 'ap-south-1', body: { action: 'execute-batch', namespace: 'personal', commands, baseSequence: 4 } });
  expect(f.invoke.mock.calls[0][1].headers).toEqual({ Authorization: 'Bearer old-token' });
  expect(f.invoke.mock.calls[1][1].headers).toEqual({ Authorization: 'Bearer renewed-token' });
});

it('retains caller headers while binding both attempts to their checked session token', async () => {
  const f = sessionFixture(), headers = { 'x-trace': 'retained', authorization: 'Bearer unrelated-token' };
  f.invoke.mockResolvedValueOnce({ data: null, error: httpError(401) });
  await invokeAuthenticatedFunction(f.client, 'study-command', { headers, body: { action: 'access' } });
  expect(f.invoke.mock.calls[0][1].headers).toEqual({ 'x-trace': 'retained', Authorization: 'Bearer old-token' });
  expect(f.invoke.mock.calls[1][1].headers).toEqual({ 'x-trace': 'retained', Authorization: 'Bearer renewed-token' });
  expect(headers).toEqual({ 'x-trace': 'retained', authorization: 'Bearer unrelated-token' });
});

it('keeps withdrawal on the checked account when the SDK sees an account switch before fetch', async () => {
  const requests: { authorization: string | null; body: unknown }[] = [];
  const client = createClient('https://synthetic.supabase.co', 'sb_publishable_synthetic', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async (_input, init) => {
      requests.push({ authorization: new Headers(init?.headers).get('authorization'), body: JSON.parse(String(init?.body)) });
      return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
    } },
  });
  const original = { user: { id: user }, access_token: 'checked-owner-token' } as Session;
  const replacement = { user: { id: 'another-user' }, access_token: 'other-account-token' } as Session;
  vi.spyOn(client.auth, 'getSession')
    .mockResolvedValueOnce({ data: { session: original }, error: null })
    .mockResolvedValue({ data: { session: replacement }, error: null });
  try {
    await expect(accountAccessClient(client).withdraw!()).rejects.toMatchObject({ code: 'OWNERSHIP' });
    expect(requests).toEqual([{ authorization: 'Bearer checked-owner-token', body: { action: 'withdraw', confirmation: '탈퇴' } }]);
  } finally { await client.auth.dispose(); }
});

it('stops after a renewed session is rejected again and keeps the local command pending', async () => {
  const f = sessionFixture(), values = new Map<string, string>();
  f.invoke.mockImplementation(async () => ({ data: null, error: httpError(401) }));
  const repo = new PersonalRepository({ getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); } }, f.transport, known());
  repo.execute(operation());
  await repo.flush();
  expect(f.invoke).toHaveBeenCalledTimes(2);
  expect(f.refreshSession).toHaveBeenCalledTimes(1);
  expect(repo.getStatus()).toMatchObject({ phase: 'error', pending: 1, message: expect.stringContaining('다시 로그인') });
  expect(repo.getSnapshot().memos![0].body).toBe('  원문\n보존  ');
  expect(JSON.parse(repo.exportPreserved()).pending[0].opId).toBe('op-subject');
});

it('reports AUTH_REQUIRED without repeating a write when token refresh fails', async () => {
  const f = sessionFixture();
  f.invoke.mockResolvedValueOnce({ data: null, error: httpError(401) });
  f.refreshSession.mockRejectedValueOnce(new AuthApiError('Refresh token invalid', 400, 'refresh_token_not_found'));
  await expect(f.transport.execute(operation(), 4)).rejects.toMatchObject({ code: 'AUTH_REQUIRED', message: expect.stringContaining('글은 남아') });
  expect(f.invoke).toHaveBeenCalledTimes(1);
});

it.each(['before-refresh', 'during-refresh', 'during-response'])('rejects owner changes %s without replaying an old account command', async where => {
  const f = sessionFixture();
  f.invoke.mockImplementationOnce(async () => {
    if (where !== 'during-refresh') f.changeOwner();
    return where === 'during-response' ? { data: known(), error: null } : { data: null, error: httpError(401) };
  });
  if (where === 'during-refresh') {
    f.refreshSession.mockImplementationOnce(async () => {
      f.changeOwner();
      const { data } = await f.getSession();
      return { data: { ...data, user: data.session.user }, error: null };
    });
  }
  await expect(f.transport.execute(operation(), 4)).rejects.toMatchObject({ code: 'OWNERSHIP' });
  expect(f.invoke).toHaveBeenCalledTimes(1);
});

it('coalesces simultaneous account and sync 401 recovery into one refresh', async () => {
  const f = sessionFixture();
  let finish!: () => void;
  f.refreshSession.mockImplementationOnce(() => new Promise(resolve => { finish = async () => { const { data } = await f.getSession(); resolve({ data: { ...data, user: data.session.user }, error: null }); }; }));
  f.invoke.mockResolvedValueOnce({ data: null, error: httpError(401) }).mockResolvedValueOnce({ data: null, error: httpError(401) });
  const requests = Promise.all([f.transport.load(known()), f.account.read()]);
  await vi.waitFor(() => expect(f.refreshSession).toHaveBeenCalledTimes(1));
  finish();
  await requests;
  expect(f.refreshSession).toHaveBeenCalledTimes(1);
  expect(f.invoke).toHaveBeenCalledTimes(4);
  expect(f.invoke.mock.calls.filter(([, options]) => (options.body as { action: string }).action === 'access')).toHaveLength(2);
});

it('uses an already renewed same-owner session for a late 401 without refreshing it twice', async () => {
  const f = sessionFixture();
  f.invoke.mockImplementationOnce(async () => {
    await f.refreshSession(); // The SDK or another request completed the refresh first.
    return { data: null, error: httpError(401) };
  });
  await f.transport.load(known());
  expect(f.refreshSession).toHaveBeenCalledTimes(1);
  expect(f.invoke).toHaveBeenCalledTimes(2);
});

it('rejects a foreign owner or namespace in a batch before sending any command', async () => {
  const f = sessionFixture();
  await expect(f.transport.executeBatch!([operation('one'), { ...operation('two'), userId: 'another-user' }], 4)).rejects.toMatchObject({ code: 'OWNERSHIP' });
  await expect(f.transport.executeBatch!([{ ...operation(), namespace: 'test' }], 4)).rejects.toMatchObject({ code: 'OWNERSHIP' });
  await expect(f.transport.execute({ ...operation(), userId: 'another-user' }, 4)).rejects.toMatchObject({ code: 'OWNERSHIP' });
  expect(f.invoke).not.toHaveBeenCalled();
});

it.each([
  [new FunctionsFetchError(new TypeError('Failed to fetch')), 'NETWORK_ERROR'],
  [new FunctionsFetchError(new DOMException('Aborted', 'AbortError')), 'REQUEST_TIMEOUT'],
  [httpError(504), 'REQUEST_TIMEOUT'],
  [httpError(503), 'SERVER_UNAVAILABLE'],
  [httpError(403, { code: 'ACCESS_DENIED', message: '가입 승인을 확인해 주세요.' }), 'ACCESS_DENIED'],
])('classifies failures without blindly resending mutations: %s', async (error, code) => {
  const f = sessionFixture();
  f.invoke.mockResolvedValueOnce({ data: null, error });
  await expect(f.account.set('target-user', 'approved', 2)).rejects.toMatchObject({ code });
  expect(f.invoke).toHaveBeenCalledTimes(1);
  expect(f.refreshSession).not.toHaveBeenCalled();
});

it.each(['network', 'timeout'])('reconciles a lost %s acknowledgement before any next write', async reason => {
  const f = sessionFixture(), values = new Map<string, string>();
  let server = known();
  f.invoke.mockImplementation(async (_name, options) => {
    const body = options.body as { action: string; command: Command };
    if (body.action === 'load') return { data: server, error: null };
    server = { sequence: server.sequence + 1, data: applyCommand(server.data, body.command) };
    return { data: null, error: new FunctionsFetchError(reason === 'timeout' ? new DOMException('Aborted', 'AbortError') : new TypeError('Failed to fetch')) };
  });
  const repo = new PersonalRepository({ getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); } }, f.transport, server);
  repo.execute(operation());
  await repo.flush();
  expect(repo.getStatus()).toMatchObject({ phase: 'error', pending: 1 });
  expect(f.invoke).toHaveBeenCalledTimes(1);
  await repo.refresh();
  expect(repo.getStatus()).toMatchObject({ phase: 'saved', pending: 0 });
  expect(f.invoke.mock.calls.map(([, options]) => (options.body as { action: string }).action)).toEqual(['execute', 'load']);
  expect(server.sequence).toBe(5);
  expect(repo.getSnapshot().revisions).toHaveLength(1);
  expect(repo.getSnapshot().memos![0].body).toBe('  원문\n보존  ');
  expect(f.refreshSession).not.toHaveBeenCalled();
});

it.each([new DomainError('AUTH_STORAGE', '로그인 저장 공간 부족'), new DOMException('quota', 'QuotaExceededError')])('preserves login storage errors rather than calling them an expired session', async error => {
  const f = sessionFixture();
  f.getSession.mockRejectedValueOnce(error);
  await expect(f.account.read()).rejects.toBe(error);
  expect(f.invoke).not.toHaveBeenCalled();
  f.invoke.mockResolvedValueOnce({ data: null, error: httpError(401) });
  f.refreshSession.mockRejectedValueOnce(error);
  await expect(f.transport.load()).rejects.toBe(error);
  expect(f.invoke).toHaveBeenCalledTimes(1);
  f.invoke.mockResolvedValueOnce({ data: null, error: new FunctionsFetchError(error) });
  await expect(f.transport.execute(operation(), 4)).rejects.toBe(error);
  expect(f.invoke).toHaveBeenCalledTimes(2);
});

it('keeps transient authentication network errors distinct from a rejected session', async () => {
  const f = sessionFixture();
  f.getSession.mockRejectedValueOnce(new AuthRetryableFetchError('Failed to fetch', 0));
  await expect(f.account.read()).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
  expect(f.invoke).not.toHaveBeenCalled();
});

it('accepts a confirmed withdrawal whose session disappeared, but rejects a different account response', async () => {
  const f = sessionFixture();
  f.invoke.mockImplementationOnce(async () => {
    f.getSession.mockRejectedValueOnce(new AuthApiError('Session was deleted', 401, 'session_not_found'));
    return { data: {}, error: null };
  });
  await expect(f.account.withdraw!()).resolves.toBeUndefined();
  f.invoke.mockImplementationOnce(async () => { f.changeOwner(); return { data: {}, error: null }; });
  await expect(f.account.withdraw!()).rejects.toMatchObject({ code: 'OWNERSHIP' });
  expect(f.invoke).toHaveBeenCalledTimes(2);
});
