// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
import { DomainError } from '../domain/model';
import { generateGPTTopicMemory, handleTopicMemoryAI } from './gpt-topic-memory';
import type { TopicMemoryInput } from '../domain/topic-memory';
const input: TopicMemoryInput = {
  subject: { id: 's', name: '회로이론', version: 1 },
  topics: [
    {
      id: 't',
      path: [
        { id: 'u', name: '교류 회로', version: 1 },
        { id: 't', name: '커패시터', version: 1 },
      ],
    },
  ],
  count: 5,
  guidance: '',
};
const card = {
  topicId: 't',
  question: '커패시터 임피던스는?',
  answer: 'Z=1/(jωC). 이상적인 커패시터, ω>0.',
};
it('passes the cancellation deadline through to inference and refuses a late response', async () => {
  const controller = new AbortController();
  let signal!: AbortSignal;
  const runtime = {
    streamResponse: vi.fn(async (options: { signal: AbortSignal }) => {
      signal = options.signal;
      controller.abort(new DOMException('deadline', 'TimeoutError'));
      return { text: JSON.stringify({ cards: [card] }) };
    }),
  };
  await expect(
    generateGPTTopicMemory(input, { runtime, model: 'listed', signal: controller.signal }),
  ).rejects.toThrow();
  expect(signal.aborted).toBe(true);
  expect(runtime.streamResponse).toHaveBeenCalledTimes(1);
});
it('generates from titles alone and does not allow the model to overwrite the source context or trusted metadata', async () => {
  const runtime = {
    streamResponse: vi.fn(async (_v: { input: string; instructions: string }) => ({
      text: JSON.stringify({ id: 'forged', input: { changed: true }, cards: [card] }),
    })),
  };
  const result = await generateGPTTopicMemory(input, { runtime, model: 'account-model' });
  expect(result.input).toEqual(input);
  expect(result.id).not.toBe('forged');
  expect(runtime.streamResponse.mock.calls[0][0].instructions).toContain('본문 원자료가 없어도');
  expect(result.cards[0].topicId).toBe('t');
  const revoke = vi.fn(async () => {
    throw Error('revoked');
  });
  await expect(
    generateGPTTopicMemory(input, { runtime, model: 'm', beforeInference: revoke }),
  ).rejects.toThrow('revoked');
  expect(runtime.streamResponse).toHaveBeenCalledTimes(1);
});
it('rejects unknown topics, empty/malformed/incomplete output and excess cards without retries', async () => {
  const runtime = { streamResponse: vi.fn(async () => ({ text: '{}' })) };
  for (const value of [
    'not-json',
    '{}',
    '{"cards":[]}',
    JSON.stringify({ cards: [{ ...card, topicId: 'unknown' }] }),
    JSON.stringify({ cards: [card, card] }),
  ]) {
    runtime.streamResponse.mockResolvedValue({ text: value });
    await expect(
      generateGPTTopicMemory({ ...input, count: 1 }, { runtime, model: 'm' }),
    ).rejects.toThrow();
  }
  expect(runtime.streamResponse).toHaveBeenCalledTimes(5);
});
it('refuses nonowner, forged space, revoked approval and limits before provider calls', async () => {
  const result = await generateGPTTopicMemory(input, {
    model: 'm',
    runtime: { streamResponse: async () => ({ text: JSON.stringify({ cards: [card] }) }) },
  });
  const api = {
    authorize: vi.fn(async () => ({ userId: AI_OWNER_USER_ID, namespace: 'personal' })),
    reserve: vi.fn(async () => undefined),
    generate: vi.fn(async () => result),
  };
  const request = (patch = {}) =>
    new Request('http://local', {
      method: 'POST',
      body: JSON.stringify({ userId: AI_OWNER_USER_ID, namespace: 'personal', input, ...patch }),
    });
  api.authorize.mockResolvedValueOnce({ userId: 'approved-admin', namespace: 'personal' });
  expect((await handleTopicMemoryAI(request(), api)).status).toBe(403);
  expect((await handleTopicMemoryAI(request({ namespace: 'demo' }), api)).status).toBe(403);
  expect(
    (await handleTopicMemoryAI(request({ input: { ...input, count: 100 } }), api)).status,
  ).toBe(400);
  expect(api.reserve).not.toHaveBeenCalled();
  expect(api.generate).not.toHaveBeenCalled();
  api.authorize.mockRejectedValueOnce(new DomainError('ACCESS_DENIED', 'suspended'));
  expect((await handleTopicMemoryAI(request(), api)).status).toBe(403);
  api.reserve.mockRejectedValueOnce(new DomainError('RATE_LIMIT', 'limit'));
  expect((await handleTopicMemoryAI(request(), api)).status).toBe(429);
  expect(api.generate).not.toHaveBeenCalled();
  expect((await handleTopicMemoryAI(request(), api)).status).toBe(200);
  expect(api.generate).toHaveBeenCalledTimes(1);
});
