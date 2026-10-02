// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest';
import { generateStudyMaterial } from './study-ai';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
vi.mock('./supabase-client', () => ({
  readServerConfig: () => ({ url: 'https://isolated', publishableKey: 'synthetic-public' }),
  createStudyClient: () => ({ auth: { getSession: async () => ({ data: { session: { user: { id: 'd33cf234-2998-43bd-b420-3ac056db4bea' }, access_token: 'synthetic-token' } } }), dispose() {} } }),
}));
const owner = { userId: AI_OWNER_USER_ID, namespace: 'personal' as const };
const status = { configured: true, local: false, provider: 'openai-api', model: 'gpt-6-luna', models: [{ slug: 'gpt-6-luna', displayName: '검증 모델' }], billing: { configured: true, enabled: true, limitMicro: 3_000_000, usedMicro: 0, pendingMicro: 0, month: '2026-10' }, connectionError: '' };
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
it('sends only pasted transcript and selected document text, ignoring legacy audio and cached transcription', async () => {
  vi.stubEnv('DEV', true);
  const original = '참석자 1 00:12\n  저항이 일정한 조건. 예외는 보존한다.  ';
  const returned = { id: 'r', model: 'listed', at: '2026-10-01T00:00:00Z', segments: [{ id: 's', text: original, start: null, end: null }], summary: [], cards: [] };
  const fetcher = vi.fn(async (url: string, _init?: RequestInit) => url.endsWith('/status') ? Response.json(status) : Response.json({ result: returned }));
  vi.stubGlobal('fetch', fetcher);
  const audio = { key: 'missing-legacy-audio', name: '이전.wav', type: 'audio/wav', size: 100, sha256: 'a'.repeat(64) };
  const documents = [{ id: 'clova', name: '클로바노트.txt', kind: 'text' as const, file: null, warnings: [], blocks: [
    { id: 'selected', label: '원문', text: '참석자 2: 선택한 원문', start: null, end: null, included: true },
    { id: 'omitted', label: '제외', text: '선택하지 않은 개인정보', start: null, end: null, included: false },
  ] }];
  const result = await generateStudyMaterial(owner, { title: '전사문', subjectId: 's', topicId: null, sourceText: original, audio, documents, results: [{ ...returned, source: { text: '', audio }, segments: [{ id: 'old', text: '이전 기계 전사', start: 0, end: 2 }] }] }, 5);
  const form = fetcher.mock.calls[1][1]!.body as FormData;
  expect(form.has('audio')).toBe(false);
  expect(JSON.parse(String(form.get('textJSON')))).toBe(original);
  expect(JSON.parse(String(form.get('segmentsJSON')))).toEqual([expect.objectContaining({ text: '참석자 2: 선택한 원문' })]);
  expect(result.source?.audio).toBeNull();
  expect(result.source?.documents?.[0].blocks.map(b => b.id)).toEqual(['selected']);
});
