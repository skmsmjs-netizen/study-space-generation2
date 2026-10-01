// @vitest-environment node
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createServer, type Server, type IncomingMessage, type ServerResponse } from 'node:http';
import { AI_OWNER_USER_ID } from '../src/domain/ai-access';
const runtime = vi.hoisted(() => ({
  session: { status: 'connected', sharing: true, profileId: 'synthetic-profile' },
  getSession: vi.fn(),
  listModels: vi.fn(),
  streamResponse: vi.fn(),
  signIn: vi.fn(),
  cancelSignIn: vi.fn(),
  disconnect: vi.fn(),
}));
vi.mock('./vendor/siwc-local/index', () => ({ createChatGPT: vi.fn(() => runtime) }));
vi.mock('./gpt-model-preference', () => ({
  readGPTModel: vi.fn(async () => undefined),
  saveGPTModel: vi.fn(async () => undefined),
}));
vi.mock('./material-transcription', () => ({
  transcriptionAvailable: vi.fn(async () => true),
  transcribeMaterial: vi.fn(),
}));
import { localStudyAIPlugin, authenticateAIOwner } from './study-ai-dev';
import { createChatGPT } from './vendor/siwc-local/index';
let server: Server,
  address = '',
  middleware: (req: IncomingMessage, res: ServerResponse) => void;
let approved = true,
  userId = AI_OWNER_USER_ID;
const realFetch = globalThis.fetch;
beforeEach(async () => {
  approved = true;
  userId = AI_OWNER_USER_ID;
  runtime.getSession.mockImplementation(async () => runtime.session);
  runtime.listModels.mockResolvedValue([{ slug: 'test-model', displayName: '테스트 모델' }]);
  runtime.streamResponse.mockResolvedValue({
    text: JSON.stringify({ summary: [{ text: '합성 요약', sourceIds: ['t1'] }], cards: [] }),
  });
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      if (String(url).includes('/auth/v1/user'))
        return new Response(JSON.stringify({ id: userId }));
      if (String(url).includes('/functions/v1/study-command'))
        return new Response(JSON.stringify({ status: approved ? 'approved' : 'suspended' }));
      return realFetch(url, init);
    }),
  );
  server = createServer((req, res) => {
    req.url = req.url!.replace('/api/study-ai', '');
    middleware(req, res);
  });
  const plugin = localStudyAIPlugin();
  (plugin.configureServer as Function)({
    httpServer: server,
    middlewares: {
      use: (_path: string, fn: typeof middleware) => {
        middleware = fn;
      },
    },
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  address = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
});
afterEach(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});
function request(path: string, body?: unknown, auth = true, origin = address) {
  return realFetch(`${address}/api/study-ai${path}`, {
    method: 'POST',
    headers: {
      Origin: origin,
      ...(auth ? { Authorization: 'Bearer synthetic-app-session' } : {}),
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    },
    body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
  });
}
function source() {
  const form = new FormData();
  form.set('userId', AI_OWNER_USER_ID);
  form.set('namespace', 'personal');
  form.set('textJSON', JSON.stringify('합성 강의 원문'));
  form.set('cardCount', '5');
  return form;
}
it('uses the same owner and credit gates for title-only questions, with no paid fallback or repeat calls', async () => {
  const input = {
    subject: { id: 's', name: '회로이론', version: 1 },
    topics: [{ id: 't', path: [{ id: 't', name: '커패시터', version: 1 }] }],
    count: 5,
    guidance: '',
  };
  const body = { userId: AI_OWNER_USER_ID, namespace: 'personal', input };
  expect((await request('/topic-memory', body)).status).toBe(400);
  expect(runtime.streamResponse).not.toHaveBeenCalled();
  await request('/models');
  await request('/settings', { model: 'test-model', creditsDisabled: true });
  runtime.streamResponse.mockResolvedValue({
    text: JSON.stringify({
      cards: [{ topicId: 't', question: '임피던스는?', answer: 'Z=1/(jωC)' }],
    }),
  });
  const response = await request('/topic-memory', body);
  expect(response.status).toBe(200);
  expect((await response.json()).result.input).toEqual(input);
  expect(runtime.streamResponse).toHaveBeenCalledTimes(1);
  runtime.streamResponse.mockClear();
  userId = 'approved-admin';
  expect((await request('/topic-memory', body)).status).toBe(403);
  expect(runtime.streamResponse).not.toHaveBeenCalled();
});
it('rejects unauthorized origin, nonowner and suspended app accounts before runtime operations', async () => {
  expect((await request('/models', {}, true, 'https://remote.test')).status).toBe(403);
  expect((await request('/models', {}, false)).status).toBe(401);
  userId = 'other-approved-admin';
  expect((await request('/models')).status).toBe(403);
  userId = AI_OWNER_USER_ID;
  approved = false;
  expect((await request('/models')).status).toBe(403);
  expect(runtime.listModels).not.toHaveBeenCalled();
  expect(runtime.streamResponse).not.toHaveBeenCalled();
});
it('blocks inference before credit confirmation, rejects unlisted models and clears confirmation on disconnect', async () => {
  expect((await request('', source())).status).toBe(400);
  expect(runtime.streamResponse).not.toHaveBeenCalled();
  expect((await request('/models')).status).toBe(200);
  expect((await request('/settings', { model: 'invented', creditsDisabled: true })).status).toBe(
    400,
  );
  expect((await request('/settings', { model: 'test-model', creditsDisabled: true })).status).toBe(
    200,
  );
  expect((await request('', source())).status).toBe(200);
  expect(runtime.streamResponse).toHaveBeenCalledTimes(1);
  await request('/disconnect');
  runtime.streamResponse.mockClear();
  expect((await request('', source())).status).toBe(400);
  expect(runtime.streamResponse).not.toHaveBeenCalled();
});
it('rechecks initiating app approval for OAuth callbacks and rejects generation after approval changes', async () => {
  await request('/models');
  await request('/settings', { model: 'test-model', creditsDisabled: true });
  const config = vi.mocked(createChatGPT).mock.calls.at(-1)![0];
  await expect(config.beforeCredentialChange!()).rejects.toMatchObject({ code: 'AUTH_REQUIRED' });
  approved = false;
  await expect(authenticateAIOwner('Bearer synthetic')).rejects.toMatchObject({
    code: 'ACCESS_DENIED',
  });
  expect((await request('', source())).status).toBe(403);
  expect(runtime.streamResponse).not.toHaveBeenCalled();
});
it('uses an account-listed Luna model for brief memory items without overwriting the shared model choice', async () => {
  runtime.listModels.mockResolvedValue([
    { slug: 'gpt-6-astra', displayName: 'Astra' },
    { slug: 'gpt-6-luna', displayName: 'Luna' },
  ]);
  await request('/models');
  await request('/settings', { model: 'gpt-6-astra', creditsDisabled: true });
  const input = {
    subject: { id: 's', name: '회로이론', version: 1 },
    topics: [{ id: 't', path: [{ id: 't', name: '커패시터', version: 1 }] }],
    count: 3,
    guidance: '',
  };
  runtime.streamResponse.mockResolvedValue({
    text: JSON.stringify({
      cards: [
        { topicId: 't', question: '관계식은?', answer: 'Q=CV. 정전용량이 일정한 이상적인 소자.' },
      ],
    }),
  });
  const generated = await request('/topic-memory', {
    userId: AI_OWNER_USER_ID,
    namespace: 'personal',
    input,
  });
  expect(generated.status).toBe(200);
  expect((await generated.json()).result.model).toBe('gpt-6-luna');
  expect(runtime.streamResponse.mock.calls[0][0].model).toBe('gpt-6-luna');
  const status = await realFetch(`${address}/api/study-ai/status`, {
    headers: { Origin: address, Authorization: 'Bearer synthetic-app-session' },
  });
  expect((await status.json()).model).toBe('gpt-6-astra');
  expect(runtime.streamResponse).toHaveBeenCalledTimes(1);
});
