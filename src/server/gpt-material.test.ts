// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { generateGPTMaterial } from './gpt-material';
import { streamResponse } from '../../scripts/vendor/siwc-local/responses';
it('freezes explicit task inputs as evidence, rejects incomplete feedback and hides hint answer cards', async () => {
  const runtime = {
    streamResponse: vi.fn(async () => ({
      text: JSON.stringify({
        summary: [{ text: '다음 한 단계', sourceIds: ['t1', 'request-attempt'] }],
        cards: [],
      }),
    })),
  };
  const request = {
    task: 'hint' as const,
    problem: '합성 문제의 조건',
    attempt: '여기까지 시도했다.',
  };
  const result = await generateGPTMaterial(
    { text: '합성 원문', audio: null, audioName: '', cardCount: 5, request },
    { runtime, model: 'test' },
  );
  request.attempt = '나중에 수정';
  expect(result.request?.attempt).toBe('여기까지 시도했다.');
  expect(result.segments.find((row) => row.id === 'request-attempt')?.text).toBe(
    '여기까지 시도했다.',
  );
  const calls = runtime.streamResponse.mock.calls.length;
  await expect(
    generateGPTMaterial(
      {
        text: '원문',
        audio: null,
        audioName: '',
        cardCount: 5,
        request: { task: 'feedback', problem: '문제', attempt: '풀이' },
      },
      { runtime, model: 'test' },
    ),
  ).rejects.toMatchObject({ code: 'INVALID_AI_REQUEST' });
  expect(runtime.streamResponse).toHaveBeenCalledTimes(calls);
  runtime.streamResponse.mockResolvedValue({
    text: JSON.stringify({
      summary: [{ text: '힌트', sourceIds: ['request-attempt'] }],
      cards: [
        { question: '문제', answer: '먼저 노출하면 안 되는 답', sourceIds: ['request-attempt'] },
      ],
    }),
  });
  await expect(
    generateGPTMaterial(
      { text: '원문', audio: null, audioName: '', cardCount: 5, request },
      { runtime, model: 'test' },
    ),
  ).rejects.toMatchObject({ code: 'INVALID_MATERIAL' });
});
const input = { text: ' 원문\r\n\u0000\ud800 ', audio: null, audioName: '', cardCount: 5 };
const output = {
  summary: [{ text: '근거 요약', sourceIds: ['t1'] }],
  cards: [{ question: '조건은?', answer: '원문에 따름', sourceIds: ['t1'] }],
};
it('uses GPT only for grounded output and preserves exact source UTF16 including GPT attempts to rewrite it', async () => {
  const runtime = {
    streamResponse: vi.fn(async (_options: { input: string }) => ({
      text: JSON.stringify({ ...output, segments: [{ id: 't1', text: '수정된 원문' }] }),
    })),
  };
  const result = await generateGPTMaterial(input, { runtime, model: 'account-model' });
  expect(result.segments.map((row) => row.text).join('')).toBe(input.text);
  expect(result.model).toBe('account-model');
  expect(result.cards[0].originalAnswer).toBe('원문에 따름');
  expect(JSON.parse(runtime.streamResponse.mock.calls[0][0].input).sourceSegments[0].text).toBe(
    input.text,
  );
});
it('transcribes locally and sends only local transcript/text to GPT; rechecks approval before inference', async () => {
  const audio = new Blob(['synthetic-private-audio'], { type: 'audio/wav' });
  const transcribe = vi.fn(async () => [
    { id: 'a1', text: '합성 음성 받아쓰기', start: 1, end: 3 },
  ]);
  const runtime = {
    streamResponse: vi.fn(async (_options: unknown) => ({
      text: JSON.stringify({ summary: [{ text: '요약', sourceIds: ['a1'] }], cards: [] }),
    })),
  };
  const result = await generateGPTMaterial(
    { ...input, audio, text: '' },
    { runtime, model: 'test', transcribe },
  );
  expect(transcribe).toHaveBeenCalledWith(audio);
  expect(JSON.stringify(runtime.streamResponse.mock.calls)).not.toContain(
    'synthetic-private-audio',
  );
  expect(result.segments[0]).toEqual({ id: 'a1', text: '합성 음성 받아쓰기', start: 1, end: 3, role: 'material' });
  runtime.streamResponse.mockClear();
  await expect(
    generateGPTMaterial(
      { ...input, audio },
      {
        runtime,
        model: 'test',
        transcribe,
        beforeInference: async () => {
          throw Error('approval revoked');
        },
      },
    ),
  ).rejects.toThrow('approval revoked');
  expect(runtime.streamResponse).not.toHaveBeenCalled();
});
it('rejects invented source IDs, malformed JSON, excess cards and unsupported raw-audio execution', async () => {
  const runtime = {
    streamResponse: vi.fn(async () => ({
      text: JSON.stringify({ ...output, cards: [{ ...output.cards[0], sourceIds: ['invented'] }] }),
    })),
  };
  await expect(generateGPTMaterial(input, { runtime, model: 'test' })).rejects.toMatchObject({
    code: 'INVALID_MATERIAL',
  });
  runtime.streamResponse.mockResolvedValue({ text: '```json\n{}\n```' });
  await expect(generateGPTMaterial(input, { runtime, model: 'test' })).rejects.toMatchObject({
    code: 'AI_ERROR',
  });
  runtime.streamResponse.mockResolvedValue({
    text: JSON.stringify({ ...output, cards: [output.cards[0], output.cards[0]] }),
  });
  await expect(
    generateGPTMaterial({ ...input, cardCount: 1 }, { runtime, model: 'test' }),
  ).rejects.toMatchObject({ code: 'AI_ERROR' });
  await expect(
    generateGPTMaterial({ ...input, audio: new Blob(['audio']) }, { runtime, model: 'test' }),
  ).rejects.toMatchObject({ code: 'TRANSCRIPTION_REQUIRED' });
});
it('official runtime requires a terminal completed stream and never retries a limit error after text starts', async () => {
  const event = (value: unknown) => `data: ${JSON.stringify(value)}\n\n`;
  const fake = vi.fn(
    async (_url: string, _init: RequestInit) =>
      new Response(
        event({ type: 'response.output_text.delta', delta: 'partial' }) +
          event({
            type: 'response.failed',
            response: {
              error: { code: 'subscription_sharing_usage_limit_exceeded', message: 'limit' },
            },
          }),
        { headers: { 'content-type': 'text/event-stream' } },
      ),
  );
  vi.stubGlobal('fetch', fake);
  try {
    await expect(
      streamResponse(
        'synthetic-oauth-token',
        { model: 'test', input: input.text },
        AbortSignal.timeout(1000),
      ),
    ).rejects.toMatchObject({ code: 'subscription_sharing_usage_limit_exceeded' });
    expect(fake).toHaveBeenCalledTimes(1);
    const body = JSON.parse(String(fake.mock.calls[0][1].body));
    expect(body).toMatchObject({
      store: false,
      stream: true,
      input: [{ role: 'user', content: input.text }],
    });
    expect(fake.mock.calls[0][0]).toBe('https://api.openai.com/v1/responses');
    fake.mockResolvedValue(
      new Response(event({ type: 'response.output_text.delta', delta: 'partial' }), {
        headers: { 'content-type': 'text/event-stream' },
      }),
    );
    await expect(
      streamResponse('synthetic', { model: 'test', input: 'x' }, AbortSignal.timeout(1000)),
    ).rejects.toMatchObject({ code: 'stream_interrupted' });
    fake.mockResolvedValue(
      new Response(
        event({ type: 'response.output_text.delta', delta: '{}' }) +
          event({ type: 'response.completed' }),
        { headers: { 'content-type': 'text/event-stream' } },
      ),
    );
    expect(
      await streamResponse('synthetic', { model: 'test', input: 'x' }, AbortSignal.timeout(1000)),
    ).toEqual({ text: '{}' });
  } finally {
    vi.unstubAllGlobals();
  }
});
it('stops before GPT when generation is cancelled while transcribing', async () => {
  const controller = new AbortController();
  const runtime = { streamResponse: vi.fn(async () => ({ text: '{}' })) };
  const transcribe = vi.fn(async () => {
    controller.abort();
    return [{ id: 'a1', text: '중단 전 받아쓰기', start: 0, end: 1 }];
  });
  await expect(
    generateGPTMaterial(
      { ...input, audio: new Blob(['synthetic']) },
      { runtime, model: 'test', signal: controller.signal, transcribe },
    ),
  ).rejects.toMatchObject({ name: 'AbortError' });
  expect(runtime.streamResponse).not.toHaveBeenCalled();
});
