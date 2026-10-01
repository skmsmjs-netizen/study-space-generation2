import { expect, it, vi } from 'vitest';
import { generateGPTPhotoOutline, handlePhotoOutlineAI } from './gpt-photo-outline';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
import {
  createOpenAIAPIRuntime,
  API_MODEL,
  budgetCost,
  API_MAX_OUTPUT_TOKENS,
  type APIBudget,
} from './openai-api-runtime';
import { photoBytes, validatePhotoInput, type PhotoInput } from '../domain/photo-outline';
const png =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aDZkAAAAASUVORK5CYII=';
async function input(): Promise<PhotoInput[]> {
  const p = { id: 'p1', sha256: 'a'.repeat(64), dataUrl: 'data:image/png;base64,' + png };
  p.sha256 = [
    ...new Uint8Array(await crypto.subtle.digest('SHA-256', new Uint8Array(photoBytes(p)).buffer)),
  ]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
  return [p];
}
const output = {
  title: '사진 목차',
  rows: [
    {
      id: 'a',
      parentId: null,
      name: '전류',
      content: '',
      page: '',
      photoIds: ['p1'],
      uncertain: false,
    },
  ],
  warnings: [],
};
it('sends the actual image once with a strict outline schema and reserves image cost before dispatch', async () => {
  const budget = {
    reserve: vi.fn<APIBudget['reserve']>(async () => ({ key: 'synthetic-key' })),
    settle: vi.fn(async () => {}),
  };
  const provider = vi.fn<typeof fetch>(async () =>
    Response.json({
      status: 'completed',
      usage: { input_tokens: 250, output_tokens: 100 },
      output: [
        { type: 'message', content: [{ type: 'output_text', text: JSON.stringify(output) }] },
      ],
    }),
  );
  const photos = await input(),
    r = await generateGPTPhotoOutline(photos, {
      runtime: createOpenAIAPIRuntime(budget, provider as typeof fetch),
      model: API_MODEL,
      signal: new AbortController().signal,
    });
  expect(r.rows[0].name).toBe('전류');
  expect(r.sources[0]).toEqual({ id: 'p1', sha256: photos[0].sha256 });
  const body = JSON.parse(String(provider.mock.calls[0][1]?.body));
  expect(body.input[0].content[1]).toEqual({
    type: 'input_image',
    image_url: photos[0].dataUrl,
    detail: 'high',
  });
  expect(body.text.format).toMatchObject({ name: 'photo_outline', strict: true });
  expect(provider).toHaveBeenCalledTimes(1);
  expect(budget.reserve.mock.calls[0][1]).toBeGreaterThan(budgetCost(16384, API_MAX_OUTPUT_TOKENS));
});
it('rejects URLs, mismatched bytes, foreign references and nonowner requests before generation', async () => {
  const photos = await input(),
    runtime = { streamResponse: vi.fn(async () => ({ text: JSON.stringify(output) })) };
  expect(() =>
    validatePhotoInput([{ ...photos[0], dataUrl: 'https://private.invalid/photo' }]),
  ).toThrow();
  await expect(
    generateGPTPhotoOutline([{ ...photos[0], sha256: 'a'.repeat(64) }], {
      runtime,
      model: 'synthetic',
      signal: new AbortController().signal,
    }),
  ).rejects.toThrow();
  expect(runtime.streamResponse).not.toHaveBeenCalled();
  const generate = vi.fn();
  const r = await handlePhotoOutlineAI(
    new Request('https://synthetic/photo', { method: 'POST', body: JSON.stringify({ photos }) }),
    { authorize: async () => ({ userId: 'other', namespace: 'personal' }), generate },
  );
  expect(r.status).toBe(403);
  expect(generate).not.toHaveBeenCalled();
  runtime.streamResponse.mockResolvedValueOnce({
    text: JSON.stringify({ ...output, rows: [{ ...output.rows[0], photoIds: ['other-photo'] }] }),
  });
  await expect(
    generateGPTPhotoOutline(photos, {
      runtime,
      model: 'synthetic',
      signal: new AbortController().signal,
    }),
  ).rejects.toThrow();
  const own = await handlePhotoOutlineAI(
    new Request('https://synthetic/photo', {
      method: 'POST',
      body: JSON.stringify({ userId: 'other', namespace: 'personal', photos }),
    }),
    { authorize: async () => ({ userId: AI_OWNER_USER_ID, namespace: 'personal' }), generate },
  );
  expect(own.status).toBe(403);
});
