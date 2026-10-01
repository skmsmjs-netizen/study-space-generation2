// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest';

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
