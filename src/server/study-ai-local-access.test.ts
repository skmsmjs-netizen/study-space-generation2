// @vitest-environment node
import { createServer, type Server } from 'node:http';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('../../scripts/vendor/siwc-local/index', () => ({
  createChatGPT: () => ({
    getSession: async () => ({ status: 'disconnected', sharing: false }),
  }),
}));
vi.mock('../../scripts/material-transcription', () => ({
  transcriptionAvailable: async () => true,
}));
import { localStudyAIPlugin } from '../../scripts/study-ai-dev';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
let server: Server, base: string, provider: ReturnType<typeof vi.fn>;
const nativeFetch = globalThis.fetch;
beforeEach(async () => {
  provider = vi.fn(async (_url: string, init: RequestInit) => {
    const token = (init.headers as Record<string,string>).Authorization;
    if (String(_url).endsWith('/auth/v1/user')) return new Response(JSON.stringify({ id: ['Bearer synthetic-owner','Bearer synthetic-owner-suspended'].includes(token) ? AI_OWNER_USER_ID : 'another-approved-administrator' }));
    return new Response(JSON.stringify({ status: token === 'Bearer synthetic-owner-suspended' ? 'suspended' : 'approved', administrator: true }));
  });
  vi.stubGlobal('fetch', provider);
  let handler: any;
  (localStudyAIPlugin().configureServer as Function)({ middlewares: { use: (_path: string, fn: Function) => { handler = fn; } } });
  server = createServer((req,res) => { void handler(req,res); });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${(server.address() as {port:number}).port}`;
});
afterEach(async () => { await new Promise<void>(resolve => server.close(() => resolve())); vi.unstubAllGlobals(); });
async function call(path: string, token?: string, method = 'GET', body?: string) {
  return nativeFetch(base + path, { method, headers: { Origin: base, ...(token ? { Authorization: `Bearer ${token}` } : {}), 'x-study-local-space':'demo', 'Content-Type':'application/json' }, body });
}
it('refuses no-login demo headers and approved administrators on status, setup, and generation', async () => {
  for (const [path, method] of [['/status','GET'],['/setup','POST'],['/','POST']]) {
    expect((await call(path,undefined,method)).status).toBe(401);
    const response = await call(path,'synthetic-member',method,method==='POST'?JSON.stringify({ userId:AI_OWNER_USER_ID, administrator:true, apiKey:'synthetic-key-that-is-long-enough' }):undefined);
    expect(response.status).toBe(403); expect(await response.json()).toMatchObject({code:'AI_OWNER_REQUIRED'});
  }
  expect(provider.mock.calls.every(([url]) => url.endsWith('/auth/v1/user'))).toBe(true);
});
it('rejects the retired key setup and returns disconnected GPT status without calling a provider', async () => {
  const configured = await call('/setup','synthetic-owner','POST', JSON.stringify({apiKey:'synthetic-key-that-is-long-enough',model:'test-model'}));
  expect(configured.status).toBe(404);
  const status = await call('/status','synthetic-owner');
  expect(await status.json()).toMatchObject({configured:false,provider:'chatgpt',model:''});
  expect(provider.mock.calls.every(([url]) => url.includes('/auth/v1/user')||url.endsWith('/functions/v1/study-command'))).toBe(true);
});

it('blocks an owner whose current app access is suspended before setup', async () => {
  const response = await call('/setup','synthetic-owner-suspended','POST', JSON.stringify({apiKey:'synthetic-key-that-is-long-enough'}));
  expect(response.status).toBe(403); expect(await response.json()).toMatchObject({code:'ACCESS_DENIED'});
});
