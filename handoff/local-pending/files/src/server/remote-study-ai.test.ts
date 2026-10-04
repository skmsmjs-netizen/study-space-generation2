// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
import { DomainError } from '../domain/model';
import { createRemoteStudyAIHandler, type RemoteGPTConnection } from './remote-study-ai';
const input = { subject: { id: 's', name: '회로이론', version: 1 }, topics: [{ id: 't', path: [{ id: 't', name: '커패시터', version: 1 }] }], count: 3, guidance: '' };
const identity = { userId: AI_OWNER_USER_ID, namespace: 'personal' };
function fixture() {
  const runtime = { streamResponse: vi.fn(async () => ({ text: JSON.stringify({ cards: [{ topicId: 't', question: '전하와 전압의 관계는?', answer: 'Q=CV. 일정한 정전용량을 가진 이상적 소자.' }] }) })) };
  const connection: RemoteGPTConnection = { model: 'listed', models: [{ slug: 'listed', displayName: 'Listed' }], creditsConfirmed: true, runtime, beforeInference: vi.fn(async () => {}), reserve: vi.fn(async () => {}) };
  const options = { authorize: vi.fn(async () => identity), connection: vi.fn(async (): Promise<RemoteGPTConnection | null> => connection) };
  return { connection, options, handler: createRemoteStudyAIHandler(options), runtime };
}
function request(patch = {}, path = '/topic-memory') { return new Request(`https://isolated/functions/v1/study-ai${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...identity, input, ...patch }) }); }
it('routes Supabase topic generation through the existing complete-answer prompt exactly once', async () => {
  const { handler, runtime, connection } = fixture();
  const r = await handler(request());
  expect(r.status).toBe(200);
  const { result } = await r.json();
  expect(result.input).toEqual(input);
  expect(result.evidenceType).toBe('topic-general');
  expect(result.cards[0].answer).toContain('Q=CV');
  expect(connection.reserve).toHaveBeenCalledWith(AI_OWNER_USER_ID);
  expect(connection.beforeInference).toHaveBeenCalledTimes(1);
  expect(runtime.streamResponse).toHaveBeenCalledTimes(1);
  expect(runtime.streamResponse.mock.calls[0]?.length).toBe(1);
});
it('keeps unapproved hosting and nonowners ahead of reading source bodies and provider access', async () => {
  const { handler, options, runtime } = fixture();
  options.connection.mockResolvedValue(null);
  const r = request();
  expect((await handler(r)).status).toBe(400);
  expect(r.bodyUsed).toBe(false);
  expect(runtime.streamResponse).not.toHaveBeenCalled();
  options.authorize.mockResolvedValueOnce({ userId: 'other', namespace: 'personal' });
  options.connection.mockClear();
  expect((await handler(request())).status).toBe(403);
  expect(options.connection).not.toHaveBeenCalled();
});
it('rejects forged spaces, unconfirmed credits, unsupported models and revoked grants without retry', async () => {
  const { handler, connection, runtime } = fixture();
  expect((await handler(request({ namespace: 'demo' }))).status).toBe(403);
  connection.creditsConfirmed = false;
  expect((await handler(request())).status).toBe(400);
  connection.creditsConfirmed = true;
  connection.model = 'unlisted';
  expect((await handler(request())).status).toBe(400);
  connection.model = 'listed';
  vi.mocked(connection.beforeInference).mockRejectedValue(new DomainError('ACCESS_DENIED', 'revoked'));
  expect((await handler(request())).status).toBe(403);
  expect(runtime.streamResponse).not.toHaveBeenCalled();
});
it('returns only public status and handles browser preflight without authentication or inference', async () => {
  const { handler, options } = fixture();
  const r = await handler(new Request('https://isolated/functions/v1/study-ai/status'));
  const body = await r.json();
  expect(body).toMatchObject({ configured: true, local: false, transcription: false, provider: 'chatgpt' });
  expect(body.runtime).toBeUndefined();
  expect(body.reserve).toBeUndefined();
  options.authorize.mockClear();
  const preflight = await handler(new Request('https://isolated/functions/v1/study-ai/topic-memory', { method: 'OPTIONS' }));
  expect(preflight.status).toBe(204);
  expect(await preflight.text()).toBe('');
  expect(preflight.headers.get('Access-Control-Allow-Headers')).toContain('apikey');
  expect(options.authorize).not.toHaveBeenCalled();
  expect((await handler(new Request('https://isolated/functions/v1/study-ai/unknown'))).status).toBe(404);
});
it('rejects incomplete or out-of-range model replies without applying them or retrying', async () => {
  const { handler, runtime } = fixture();
  runtime.streamResponse.mockResolvedValue({ text: JSON.stringify({ cards: [{ topicId: 'foreign', question: 'Q', answer: 'A' }] }) });
  expect((await handler(request())).status).toBe(400);
  expect(runtime.streamResponse).toHaveBeenCalledTimes(1);
});
