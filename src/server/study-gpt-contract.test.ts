// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { MATERIAL_CONTRACT_VERSION, planMaterialRanges } from '../domain/study-gpt-contract';
import { validateMaterialResult, type MaterialContent } from '../domain/study-material';
import { activeStudyAIRequest } from '../domain/study-ai-request';
import { generateGPTMaterial } from './gpt-material';
import { generateGPTTopicMemory } from './gpt-topic-memory';
import { buildMaterialGPTInstructions } from './study-gpt-prompt';

const input = { text: '실제 자료에는 전압의 정의만 있다.', audio: null, audioName: '', cardCount: 5 };
const runtimeFor = (value: unknown) => ({ streamResponse: vi.fn(async () => ({ text: JSON.stringify(value) })) });
it('rejects focus-only and attempt-only evidence but accepts a diagnostic without invented references', async () => {
  const runtime = runtimeFor({ summary: [{ text: '자료 밖의 답', sourceIds: ['request-focus'] }], cards: [] });
  await expect(generateGPTMaterial({ ...input, request: { task: 'tutor', focus: '자료에 없는 저자의 생일' } }, { runtime, model: 'synthetic' })).rejects.toMatchObject({ code: 'INVALID_MATERIAL' });
  runtime.streamResponse.mockResolvedValue({ text: JSON.stringify({ summary: [], cards: [], diagnostics: [{ kind: 'insufficient-evidence', message: '받은 자료에 생일이 없습니다.' }] }) });
  const result = await generateGPTMaterial({ ...input, request: { task: 'tutor', focus: '자료에 없는 저자의 생일' } }, { runtime, model: 'synthetic' });
  expect(result.diagnostics?.[0].sourceIds).toBeUndefined();
  expect(result.contractVersion).toBe(MATERIAL_CONTRACT_VERSION);
  const legacy = { ...result, contractVersion: undefined, request: { task: 'source-qa' as const, focus: '과거 질문' }, summary: [{ text: '과거 결과 그대로', sourceIds: ['request-focus'] }] };
  expect(() => validateMaterialResult(legacy)).not.toThrow();
  expect(legacy.request.task).toBe('source-qa');
  expect(activeStudyAIRequest(legacy.request).task).toBe('tutor');
});
it('rejects answer cards on explanation tasks and keeps supplementation distinct from grounded questions', async () => {
  const runtime = runtimeFor({ summary: [], cards: [{ question: '질문', answer: '조기 정답', sourceIds: ['t1'] }] });
  await expect(generateGPTMaterial({ ...input, request: { task: 'formula' } }, { runtime, model: 'synthetic' })).rejects.toMatchObject({ code: 'AI_ERROR' });
  runtime.streamResponse.mockResolvedValue({ text: JSON.stringify({ summary: [{ text: '보충 설명: 일반 관계', sourceIds: ['t1'], evidenceType: 'general-supplement' }], cards: [] }) });
  expect((await generateGPTMaterial({ ...input, request: { task: 'explain' } }, { runtime, model: 'synthetic' })).summary[0].evidenceType).toBe('general-supplement');
  await expect(generateGPTMaterial({ ...input, request: { task: 'questions' } }, { runtime, model: 'synthetic' })).rejects.toMatchObject({ code: 'INVALID_MATERIAL' });
});
it('covers long originals with stable overlapping segments without calling a provider or mutating originals', () => {
  const content: MaterialContent = { title: '긴 자료', subjectId: 's', topicId: null, sourceText: '보충 필기', audio: null, results: [], documents: [{ id: 'doc', kind: 'text', name: '긴 자료.txt', file: null, warnings: [], blocks: Array.from({ length: 4 }, (_, i) => ({ id: `block${i}`, label: `${i + 1}구간`, start: null, end: null, included: true, text: `조건 ${i}\n` + '자료 '.repeat(30000) })) }] };
  const original = structuredClone(content);
  const plan = planMaterialRanges(content, { task: 'organize', focus: '원문 순서 보존' });
  expect(plan.batches.length).toBeGreaterThan(1);
  const unique = new Map(plan.batches.flat().map(s => [s.id, s]));
  expect(unique.size).toBe(plan.totalSegments);
  expect([...unique.values()].reduce((n, s) => n + s.text.length, 0)).toBe(content.sourceText.length + content.documents![0].blocks.reduce((n, b) => n + b.text.length, 0));
  expect(plan.batches.every(b => b.reduce((n, s) => n + s.text.length, 0) + 8 <= 150000)).toBe(true);
  expect(plan.batches[0].some(s => plan.batches[1].some(t => t.id === s.id))).toBe(true);
  expect(content).toEqual(original);
  content.documents![0].blocks[0].text += '사용자 수정';
  expect(planMaterialRanges(content, { task: 'organize' }).sourceIdentity).not.toBe(plan.sourceIdentity);
});
it('validates a forged range before inference and preserves math after JSON round trip', async () => {
  const runtime = runtimeFor({ summary: [{ text: String.raw`\(V=IR\)`, sourceIds: ['t1'] }], cards: [] });
  const beforeInference = vi.fn(async () => {});
  await expect(generateGPTMaterial({ ...input, range: { index: 0, count: 2, sourceIdentity: 'snapshot', totalSegments: 2, sourceIds: ['invented'] } }, { runtime, model: 'synthetic', beforeInference })).rejects.toMatchObject({ code: 'INVALID_MATERIAL' });
  expect(beforeInference).not.toHaveBeenCalled(); expect(runtime.streamResponse).not.toHaveBeenCalled();
  const result = await generateGPTMaterial({ ...input, request: { task: 'formula' } }, { runtime, model: 'synthetic' });
  expect(JSON.parse(JSON.stringify(result)).summary[0].text).toBe(String.raw`\(V=IR\)`);
  const hint = buildMaterialGPTInstructions('hint', 5, { task: 'hint', focus: '보조 장치 빼고' });
  expect(hint).toContain('명시 해제'); expect(hint).toContain('L6는'); expect(hint).toContain('cards:[]');
});
it('returns an empty topic diagnostic with its topic snapshot and no invented source IDs', async () => {
  const topics = { subject: { id: 's', name: '불명확한 과목', version: 1 }, topics: [{ id: 't', path: [{ id: 't', name: '동명 주제', version: 1 }] }], count: 1, guidance: '' };
  const result = await generateGPTTopicMemory(topics, { runtime: runtimeFor({ cards: [] }), model: 'synthetic' });
  expect(result.evidenceType).toBe('topic-general'); expect(result.input).toEqual(topics); expect(result.cards).toEqual([]); expect(result.diagnostics?.[0].kind).toBe('insufficient-evidence');
});
