// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
import { TOPIC_MEMORY_WAIT_MS, type TopicMemoryInput } from '../domain/topic-memory';
import { generateTopicMemory } from './study-ai';
vi.mock('./supabase-client', () => ({
  readServerConfig: () => ({ url: 'http://isolated', publicKey: 'synthetic' }),
  createStudyClient: () => ({
    auth: {
      async getSession() {
        return {
          data: {
            session: {
              user: { id: 'd33cf234-2998-43bd-b420-3ac056db4bea' },
              access_token: 'synthetic',
            },
          },
        };
      },
      stopAutoRefresh() {},
    },
  }),
}));
const owner = { userId: AI_OWNER_USER_ID, namespace: 'personal' as const };
const input: TopicMemoryInput = {
  subject: { id: 's', name: '회로이론', version: 1 },
  topics: [{ id: 't', path: [{ id: 't', name: '커패시터', version: 1 }] }],
  count: 3,
  guidance: '',
};
const status = { local: true, configured: true, creditsConfirmed: true, model: 'listed' };
const response = () =>
  Response.json({
    result: {
      id: 'r',
      model: 'listed',
      at: '2026-10-01T00:00:00Z',
      input,
      cards: [
        {
          id: 'c',
          topicId: 't',
          question: '전하와 전압의 관계는?',
          answer: 'Q=CV. 정전용량이 일정한 이상적 소자.',
        },
      ],
    },
  });
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
it('includes status lookup in the ten-second deadline and never starts inference after a late status response', async () => {
  vi.useFakeTimers();
  let finish!: (r: Response) => void;
  const fetcher = vi.fn(
    () =>
      new Promise<Response>((resolve) => {
        finish = resolve;
      }),
  );
  vi.stubGlobal('fetch', fetcher);
  const pending = generateTopicMemory(owner, input);
  const rejected = expect(pending).rejects.toThrow('10초');
  await vi.advanceTimersByTimeAsync(TOPIC_MEMORY_WAIT_MS);
  await rejected;
  finish(Response.json(status));
  await vi.advanceTimersByTimeAsync(1);
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(vi.getTimerCount()).toBe(0);
});
it('aborts an inference that ignores its signal, rejects late results and does not retry', async () => {
  vi.useFakeTimers();
  let finish!: (r: Response) => void;
  let signal!: AbortSignal;
  const fetcher = vi.fn(async (url: string, init: RequestInit) => {
    if (url.endsWith('/status')) return Response.json(status);
    if (!init.signal) throw Error('inference signal is missing');
    signal = init.signal;
    return new Promise<Response>((resolve) => {
      finish = resolve;
    });
  });
  vi.stubGlobal('fetch', fetcher);
  const pending = generateTopicMemory(owner, input);
  const rejected = expect(pending).rejects.toThrow('10초');
  await vi.advanceTimersByTimeAsync(TOPIC_MEMORY_WAIT_MS);
  await rejected;
  expect(signal.aborted).toBe(true);
  finish(response());
  await vi.advanceTimersByTimeAsync(1);
  expect(fetcher).toHaveBeenCalledTimes(2);
  expect(vi.getTimerCount()).toBe(0);
});
it('clears the deadline after a successful receive', async () => {
  vi.useFakeTimers();
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => (url.endsWith('/status') ? Response.json(status) : response())),
  );
  expect((await generateTopicMemory(owner, input)).cards).toHaveLength(1);
  expect(vi.getTimerCount()).toBe(0);
});
