// @vitest-environment node
import { expect, it } from 'vitest';
import { receiveTopicMemoryResponse } from './topic-memory-response';
import type { TopicMemoryInput } from '../domain/topic-memory';

const input: TopicMemoryInput = {
  subject: { id: 's', name: '회로이론', version: 1 },
  topics: [{ id: 't', path: [{ id: 't', name: '커패시터', version: 1 }] }],
  count: 3,
  guidance: '공식과 적용 조건',
};
const result = {
  id: 'response-1',
  at: '2026-10-01T00:00:00Z',
  model: 'account-model',
  input,
  cards: [
    {
      id: 'card-1',
      topicId: 't',
      question: '임피던스는?',
      answer: '  Z = 1/(jωC)\nω > 0인 이상적인 소자  ',
    },
  ],
};
it('receives a complete streamed HTTP body with UTF-8 split inside Korean characters and preserves text and provenance', async () => {
  const bytes = new TextEncoder().encode(JSON.stringify({ result }));
  const response = new Response(
    new ReadableStream({
      start(controller) {
        for (let i = 0; i < bytes.length; i++) controller.enqueue(bytes.slice(i, i + 1));
        controller.close();
      },
    }),
  );
  const received = await receiveTopicMemoryResponse(response, input);
  expect(received).toEqual(result);
  expect(received.cards[0].answer).toBe(result.cards[0].answer);
});
it.each(['', '<html>upstream failure</html>', '{"result":', 'null', '{"result":{}}'])(
  'rejects unreadable or missing responses (%s) without accepting a draft',
  async (body) => {
    await expect(receiveTopicMemoryResponse(new Response(body), input)).rejects.toThrow(
      '유지했습니다',
    );
  },
);
it('rejects valid-looking results for another request, unknown topics and duplicate IDs', async () => {
  for (const value of [
    { ...result, input: { ...input, guidance: '다른 요청' } },
    { ...result, cards: [{ ...result.cards[0], topicId: 'other' }] },
    { ...result, cards: [result.cards[0], result.cards[0]] },
  ])
    await expect(
      receiveTopicMemoryResponse(Response.json({ result: value }), input),
    ).rejects.toThrow();
});
it('reports an interrupted receive without presenting partial JSON as a completed result', async () => {
  const response = new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('{"result":'));
        controller.error(Error('connection lost'));
      },
    }),
  );
  await expect(receiveTopicMemoryResponse(response, input)).rejects.toThrow('수신이 끊겼습니다');
});
it('stops an oversized response and preserves the explicit provider limit message', async () => {
  await expect(
    receiveTopicMemoryResponse(new Response('x'.repeat(2_000_001)), input),
  ).rejects.toThrow('항목 수를 줄여');
  await expect(
    receiveTopicMemoryResponse(
      Response.json({ message: '포함 사용량 한도에 도달했습니다.' }, { status: 429 }),
      input,
    ),
  ).rejects.toThrow('포함 사용량 한도');
});
