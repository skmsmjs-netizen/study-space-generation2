// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest';
import { generateTopicMemory, localAIStatus } from './study-ai';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
vi.mock('./supabase-client', () => ({
  readServerConfig: () => ({ url: 'https://isolated', publishableKey: 'synthetic-public' }),
  createStudyClient: () => ({ auth: { getSession: async () => ({ data: { session: { user: { id: 'd33cf234-2998-43bd-b420-3ac056db4bea' }, access_token: 'synthetic-token' } } }), dispose() {} } }),
}));
const owner = { userId: AI_OWNER_USER_ID, namespace: 'personal' as const };
const input = { subject: { id: 's', name: '회로이론', version: 1 }, topics: [{ id: 't', path: [{ id: 't', name: '커패시터', version: 1 }] }], count: 3, guidance: '' };
const status = { configured: true, local: false, provider: 'openai-api', model: 'gpt-6-luna', models: [{ slug: 'gpt-6-luna', displayName: 'GPT-6 Luna' }], billing: { configured: true, enabled: true, limitMicro: 3_000_000, usedMicro: 0, pendingMicro: 0, month: '2026-10' }, session: { status: 'connected', sharing: false }, creditsConfirmed: false, transcription: false, connecting: false, connectionError: '' };
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.useRealTimers(); });
it('sends production topic generation to Supabase, receives the reply and keeps the selected source', async () => {
  vi.stubEnv('DEV', false);
  const fetcher = vi.fn(async (url: string) => url.endsWith('/status') ? Response.json(status) : Response.json({ result: { id: 'r', model: 'gpt-6-luna', at: '2026-10-01T00:00:00Z', input, cards: [{ id: 'c', topicId: 't', question: '관계는?', answer: 'Q=CV' }] } }));
  vi.stubGlobal('fetch', fetcher);
  expect((await generateTopicMemory(owner, input)).input).toEqual(input);
  expect(fetcher.mock.calls.map(c => c[0])).toEqual(['https://isolated/functions/v1/study-openai-api/status', 'https://isolated/functions/v1/study-openai-api/topic-memory']);
  const init = (fetcher.mock.calls[1] as unknown as [string, RequestInit])[1];
  expect(init.headers).toMatchObject({ apikey: 'synthetic-public', Authorization: 'Bearer synthetic-token' });
});
it('retains the actual connection message and never sends source data when the server is disconnected', async () => {
  vi.stubEnv('DEV', false);
  const fetcher = vi.fn(async () => Response.json({ ...status, configured: false, billing: { ...status.billing, configured: false, enabled: false }, session: { status: 'disconnected', sharing: false }, creditsConfirmed: false, connectionError: 'API 키를 등록해 주세요.' }));
  vi.stubGlobal('fetch', fetcher);
  await expect(generateTopicMemory(owner, input)).rejects.toThrow('API 키를 등록');
  expect(fetcher).toHaveBeenCalledTimes(1);
});
it('rejects fabricated connected status and strips unexpected fields from valid status', async () => {
  vi.stubEnv('DEV', false);
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ ...status, billing: { ...status.billing, enabled: false } })));
  await expect(localAIStatus(owner)).rejects.toThrow('형식');
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ ...status, accessToken: 'unexpected', temporaryCreditsAllowed: true })));
  const result = await localAIStatus(owner);
  expect(result).not.toHaveProperty('accessToken');
  expect(result.temporaryCreditsAllowed).toBeUndefined();
});

