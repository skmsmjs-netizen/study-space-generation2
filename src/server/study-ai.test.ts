// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
import { DomainError } from '../domain/model';
import { handleStudyAI, type AIBackend } from './study-ai';
import { generateGeminiMaterial } from './gemini-material';
import type { MaterialResult } from '../domain/study-material';

const result: MaterialResult = { id: 'result', at: '2026-10-01T00:00:00Z', model: 'test-model', segments: [{ id: 's1', start: null, end: null, text: ' 원문\r\n' }], summary: [{ text: '요약', sourceIds: ['s1'] }], cards: [{ id: 'c1', question: '조건은?', answer: '원문', sourceIds: ['s1'], excluded: false }] };
const request = (owner = AI_OWNER_USER_ID, extra: Record<string, string> = {}) => { const form = new FormData(); for (const [key, value] of Object.entries({ userId: owner, namespace: 'personal', textJSON: JSON.stringify(' 원문\r\n\u0000\ud800 '), cardCount: '5', ...extra })) form.set(key, value); return new Request('https://study.test/ai', { method: 'POST', body: form, headers: { Authorization: 'Bearer synthetic' } }); };
const backend = (): AIBackend => ({ authorize: vi.fn(async () => ({ userId: AI_OWNER_USER_ID, namespace: 'personal' })), reserve: vi.fn(async () => undefined), generate: vi.fn(async () => result) });

it('refuses forged identity or blocked access before provider calls or usage reservations', async () => {
  const api = backend(); expect((await handleStudyAI(request('foreign'), api)).status).toBe(403); expect(api.generate).not.toHaveBeenCalled(); expect(api.reserve).not.toHaveBeenCalled();
  api.authorize = vi.fn(async () => { throw new DomainError('ACCESS_DENIED', '중지'); });
  expect((await handleStudyAI(request(), api)).status).toBe(403); expect(api.generate).not.toHaveBeenCalled();
});
it('enforces card limits and durable quota and preserves exact UTF16 text at the server boundary', async () => {
  const api = backend(); expect((await handleStudyAI(request(AI_OWNER_USER_ID, { cardCount: '200' }), api)).status).toBe(400);
  expect(api.generate).not.toHaveBeenCalled();
  expect((await handleStudyAI(request(), api)).status).toBe(200);
  expect(api.generate).toHaveBeenCalledWith(expect.objectContaining({ text: ' 원문\r\n\u0000\ud800 ' }));
  api.reserve = vi.fn(async () => { throw new DomainError('RATE_LIMIT', '한도'); });
  expect((await handleStudyAI(request(), api)).status).toBe(429);
});
it('rejects fabricated evidence and never turns malformed AI output into success', async () => {
  const api = backend(); api.generate = vi.fn(async () => ({ ...result, cards: [{ ...result.cards[0], sourceIds: ['not-in-source'] }] }));
  expect((await handleStudyAI(request(), api)).status).toBe(400);
});
it('keeps model keys in headers and source verbatim, using only returned source IDs for generated cards', async () => {
  const fake = vi.fn(async (_url: string, _init: RequestInit) => new Response(JSON.stringify({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ segments: [{ id: 's1', text: 'AI changed this', start: null, end: null }], summary: result.summary, cards: result.cards }) }] } }] }), { status: 200 }));
  const output = await generateGeminiMaterial({ text: ' 원문\r\n', audio: null, audioName: '', cardCount: 5 }, { apiKey: 'synthetic-key', model: 'test-model', fetcher: fake as typeof fetch });
  expect(output.segments.map(row => row.text).join('')).toBe(' 原文\r\n'.replace('原文', '원문'));
  expect(fake.mock.calls[0][0]).not.toContain('synthetic-key');
  const init = fake.mock.calls[0][1] as RequestInit;
  expect(init.headers).toMatchObject({ 'x-goog-api-key': 'synthetic-key' });
  const body = JSON.parse(String(init.body)); expect(body.contents[0].parts[0].text).toContain('originalSegments');
});
it('uploads original audio through provider URLs, cleans it after an invalid result, and blocks non-provider upload targets', async () => {
  const fake = vi.fn(async (url: string) => {
    if (url.includes('/upload/v1beta/files')) return new Response('', { status: 200, headers: { 'x-goog-upload-url': 'https://generativelanguage.googleapis.com/upload/session' } });
    if (url.includes('/upload/session')) return new Response(JSON.stringify({ file: { name: 'files/audio1', uri: 'https://generativelanguage.googleapis.com/v1beta/files/audio1', state: 'ACTIVE' } }));
    if (url.includes(':generateContent')) return new Response(JSON.stringify({ candidates: [{ finishReason: 'MAX_TOKENS', content: { parts: [] } }] }));
    return new Response('', { status: 200 });
  });
  const audio = new Blob(['synthetic-audio'], { type: 'audio/wav' });
  await expect(generateGeminiMaterial({ text: '', audio, audioName: 'synthetic.wav', cardCount: 5 }, { apiKey: 'synthetic', fetcher: fake as typeof fetch })).rejects.toThrow('끝까지');
  expect(fake).toHaveBeenLastCalledWith('https://generativelanguage.googleapis.com/v1beta/files/audio1', expect.objectContaining({ method: 'DELETE' }));
  const foreign = vi.fn(async () => new Response('', { headers: { 'x-goog-upload-url': 'https://foreign.test/upload' } }));
  await expect(generateGeminiMaterial({ text: '', audio, audioName: '', cardCount: 5 }, { apiKey: 'synthetic', fetcher: foreign as typeof fetch })).rejects.toThrow('연결');
  expect(foreign).toHaveBeenCalledTimes(1);
});

for (const identity of [
  { userId: 'another-approved-admin', namespace: 'personal' },
  { userId: 'demo-learner', namespace: 'demo' },
  { userId: AI_OWNER_USER_ID, namespace: 'demo' },
  { userId: AI_OWNER_USER_ID },
]) it(`blocks non-owner/invalid space ${JSON.stringify(identity)} before body parsing, quota or provider calls`, async () => {
  const api = backend(); api.authorize = vi.fn(async () => identity);
  const response = await handleStudyAI(new Request('https://study.test/ai', { method: 'POST', body: 'malformed; forged owner/email/admin do not grant access' }), api);
  expect(response.status).toBe(403);
  expect(await response.json()).toMatchObject({ code: 'AI_OWNER_REQUIRED' });
  expect(api.reserve).not.toHaveBeenCalled(); expect(api.generate).not.toHaveBeenCalled();
});
