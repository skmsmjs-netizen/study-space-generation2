// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest';
import { emptyState } from '../domain/model';

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });
const actor = '80000000-0000-4000-8000-000000000001';
const target = '80000000-0000-4000-8000-000000000002';
async function setup(rpcResponse: Response) {
  let handler!: (request: Request) => Promise<Response>;
  vi.stubGlobal('Deno', { env: { get: (name: string) => name === 'SUPABASE_URL' ? 'https://test.invalid' : 'fixture-key' }, serve: (value: typeof handler) => { handler = value; } });
  const fetcher = vi.fn(async (input: string, options?: RequestInit) => {
    if (input.endsWith('/auth/v1/user')) return Response.json({ id: actor });
    if (input.endsWith('/rpc/study_account_access')) return Response.json({ status: 'approved', administrator: true });
    if (input.endsWith('/rpc/study_set_account_access')) {
      expect(JSON.parse(options!.body as string)).toEqual({ p_actor: actor, p_target: target, p_status: 'approved', p_version: 0 });
      return rpcResponse;
    }
    throw Error('Unexpected backend request');
  });
  vi.stubGlobal('fetch', fetcher);
  await import('../../supabase/functions/study-command/entry');
  return handler(new Request('https://test.invalid/functions/v1/study-command', { method: 'POST', headers: { authorization: 'Bearer fixture-session' }, body: JSON.stringify({ action: 'admin-set', target, status: 'approved', version: 0 }) }));
}
it('reports a committed approval as saved when the live void RPC returns an empty HTTP 204', async () => {
  const response = await setup(new Response(null, { status: 204 }));
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ saved: true });
});
it('preserves a database version conflict instead of reporting successful approval', async () => {
  const response = await setup(Response.json({ message: 'ACCESS_CONFLICT' }, { status: 400 }));
  expect(response.status).toBe(409);
  expect(await response.json()).toMatchObject({ code: 'ACCESS_CONFLICT' });
});

async function setupConditional(conditionalResponse: Response, legacyResponse = Response.json({ sequence: 7, state: emptyState(actor, 'test') }), approved = true) {
  let handler!: (request: Request) => Promise<Response>;
  vi.stubGlobal('Deno', { env: { get: (name: string) => name === 'SUPABASE_URL' ? 'https://test.invalid' : 'fixture-key' }, serve: (value: typeof handler) => { handler = value; } });
  const fetcher = vi.fn(async (input: string, options?: RequestInit) => {
    if (input.endsWith('/auth/v1/user')) return Response.json({ id: actor });
    if (input.endsWith('/rpc/study_account_access')) return Response.json({ status: approved ? 'approved' : 'suspended', administrator: false });
    if (input.endsWith('/rpc/study_read_workspace_conditional')) {
      expect(JSON.parse(options!.body as string)).toMatchObject({ p_user: actor, p_namespace: 'test' });
      return conditionalResponse.clone();
    }
    if (input.endsWith('/rpc/study_read_workspace')) return legacyResponse.clone();
    throw Error('Unexpected backend request');
  });
  vi.stubGlobal('fetch', fetcher);
  const codec = await import('./state-codec');
  const unpack = vi.spyOn(codec, 'unpackServerState');
  await import('../../supabase/functions/study-command/entry');
  const request = (knownSequence = 7) => handler(new Request('https://test.invalid/functions/v1/study-command', {
    method: 'POST', headers: { authorization: 'Bearer fixture-session' }, body: JSON.stringify({ action: 'load', namespace: 'test', knownSequence }),
  }));
  const legacyCalls = () => fetcher.mock.calls.filter(([url]) => url.endsWith('/rpc/study_read_workspace'));
  return { request, unpack, fetcher, legacyCalls };
}

it('does not decode or validate a packed state for a verified unchanged RPC response', async () => {
  const fixture = await setupConditional(Response.json({ unchanged: true, sequence: 7, userId: actor, namespace: 'test', state: { encoding: 'invalid-poison' } }));
  const response = await fixture.request();
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ unchanged: true, sequence: 7, userId: actor, namespace: 'test' });
  expect(fixture.fetcher.mock.calls.find(([url]) => url.endsWith('/rpc/study_read_workspace_conditional'))?.[1]?.body).toBe(JSON.stringify({ p_user: actor, p_namespace: 'test', p_known_sequence: 7 }));
  expect(fixture.unpack).not.toHaveBeenCalled();
  expect(fixture.legacyCalls()).toHaveLength(0);
  expect(response.headers.get('Server-Timing')).not.toMatch(/(?:^|,\s*)validate;/);
});

it('decodes and returns the full changed workspace from the conditional RPC', async () => {
  const state = emptyState(actor, 'test');
  const { packServerState } = await import('./state-codec');
  const fixture = await setupConditional(Response.json({ sequence: 8, state: packServerState(state, []) }));
  const response = await fixture.request();
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ sequence: 8, data: state });
  expect(fixture.unpack).toHaveBeenCalledTimes(1);
  expect(fixture.legacyCalls()).toHaveLength(0);
});

it('handles a nonexistent workspace without a second RPC', async () => {
  const fixture = await setupConditional(Response.json(null));
  expect(await (await fixture.request()).json()).toMatchObject({ sequence: 0, data: emptyState(actor, 'test') });
  expect(await (await fixture.request(0)).json()).toMatchObject({ unchanged: true, sequence: 0 });
  expect(fixture.unpack).not.toHaveBeenCalled();
  expect(fixture.legacyCalls()).toHaveLength(0);
});

it.each([
  { code: 'PGRST202', message: 'Could not find the function public.study_read_workspace_conditional(p_known_sequence, p_namespace, p_user) in the schema cache' },
  { code: 'PGRST202', message: 'Could not find the public.study_read_workspace_conditional() function in the schema cache' },
  { code: '42883', message: 'function public.study_read_workspace_conditional(uuid, text, bigint) does not exist' },
])('falls back only when the exact conditional RPC is unavailable: $code $message', async error => {
  const fixture = await setupConditional(Response.json(error, { status: 404 }));
  const response = await fixture.request();
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ unchanged: true, sequence: 7 });
  expect(fixture.legacyCalls()).toHaveLength(1);
  expect(fixture.unpack).toHaveBeenCalledTimes(1);
});

it.each([
  { code: '42501', message: 'permission denied for function study_read_workspace_conditional', status: 403, expected: 403 },
  { code: 'P0001', message: 'ACCESS_DENIED', status: 400, expected: 403 },
  { code: 'PGRST003', message: 'Timed out acquiring connection', status: 504, expected: 503 },
  { code: '42883', message: 'function public.some_internal_helper(uuid) does not exist', status: 404, expected: 503 },
  { code: 'PGRST202', message: 'Could not find the function public.study_read_workspace_conditional_other() in the schema cache', status: 404, expected: 503 },
])('preserves backend failures instead of falling back: $code $message', async ({ status, expected, ...error }) => {
  const fixture = await setupConditional(Response.json(error, { status }));
  const response = await fixture.request();
  expect(response.status).toBe(expected);
  expect(await response.json()).not.toHaveProperty('data');
  expect(fixture.legacyCalls()).toHaveLength(0);
  expect(fixture.unpack).not.toHaveBeenCalled();
});

it('checks unchanged response ownership without trying a less restrictive read', async () => {
  const fixture = await setupConditional(Response.json({ unchanged: true, sequence: 7, userId: target, namespace: 'test' }));
  const response = await fixture.request();
  expect(response.status).toBe(403);
  expect(await response.json()).toMatchObject({ code: 'OWNERSHIP' });
  expect(fixture.legacyCalls()).toHaveLength(0);
  expect(fixture.unpack).not.toHaveBeenCalled();
});

it('stops a suspended account before conditional or legacy workspace reads', async () => {
  const fixture = await setupConditional(Response.json({ unchanged: true, sequence: 7, userId: actor, namespace: 'test' }), undefined, false);
  expect((await fixture.request()).status).toBe(403);
  expect(fixture.fetcher.mock.calls.some(([url]) => url.includes('study_read_workspace'))).toBe(false);
});
