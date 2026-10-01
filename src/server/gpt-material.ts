import { MATERIAL_CONTRACT_VERSION, allowsMaterialCards, type MaterialDiagnostic } from '../domain/study-gpt-contract.ts';
import { DomainError } from '../domain/model.ts';
import { activeStudyAIRequest, validateStudyAIRequest } from '../domain/study-ai-request.ts';
import {
  validateMaterialResult,
  type MaterialResult,
  type SourceSegment,
} from '../domain/study-material.ts';
import type { AIInput } from './study-ai.ts';
import { buildMaterialGPTInstructions, STUDY_GPT_PROMPT_VERSION } from './study-gpt-prompt.ts';

export interface GPTMaterialRuntime {
  streamResponse(options: {
    outputFormat?: 'material' | 'quiz' | 'mindmap' | 'topic-memory' | 'study-pack' | 'photo-outline';
    model: string;
    images?: string[];
    input: string;
    instructions: string;
    signal: AbortSignal;
  }): Promise<{ text: string }>;
}
/** Source segments are created locally; GPT cannot replace originals or timestamps. */
export async function generateGPTMaterial(
  input: AIInput,
  options: {
    runtime: GPTMaterialRuntime;
    model: string;
    transcribe?: (audio: Blob) => Promise<SourceSegment[]>;
    beforeInference?: () => Promise<void>;
    signal?: AbortSignal;
  },
): Promise<MaterialResult> {
  if (input.request) {
    input = { ...input, request: activeStudyAIRequest(input.request) };
    validateStudyAIRequest(input.request);
  }
  options.signal?.throwIfAborted();
  const segments: SourceSegment[] = structuredClone(input.sourceSegments ?? []).map(segment => ({ ...segment, role: 'material' as const }));
  if (input.audio) {
    if (!options.transcribe)
      throw new DomainError(
        'TRANSCRIPTION_REQUIRED',
        '원본 음성을 이 Mac에서 받아쓸 연결이 필요합니다.',
      );
    segments.push(...(await options.transcribe(input.audio)).map(segment => ({ ...segment, role: 'material' as const })));
  }
  let buffered = '';
  for (const chunk of input.text.match(/[\s\S]{1,2000}/g) ?? []) {
    buffered += chunk;
    if (buffered.trim()) {
      segments.push({ role: 'material', id: `t${segments.length + 1}`, start: null, end: null, text: buffered });
      buffered = '';
    }
  }
  if (buffered && segments.length) segments[segments.length - 1].text += buffered;
  for (const key of ['problem', 'attempt', 'reference', 'focus'] as const) {
    const text = input.request?.[key];
    if (text?.trim()) segments.push({ role: key, id: `request-${key}`, start: null, end: null, text });
  }
  if (!segments.length || segments.reduce((sum, row) => sum + row.text.length, 0) > 150_000)
    throw new DomainError(
      'SOURCE_SIZE',
      '받아쓴 내용과 필기의 범위를 나누어 정리해 주세요. 원본은 보존했습니다.',
    );
  validateMaterialResult({
    ...(input.range ? { range: input.range } : {}),
    id: 'source-validation',
    at: new Date().toISOString(),
    model: options.model,
    segments,
    summary: [],
    cards: [],
  });
  options.signal?.throwIfAborted();
  await options.beforeInference?.();
  options.signal?.throwIfAborted();
  const response = await options.runtime.streamResponse({
    model: options.model,
    outputFormat: input.request?.task === 'study-pack' ? 'study-pack' : input.request?.task === 'quiz' ? 'quiz' : input.request?.task === 'mindmap' ? 'mindmap' : 'material',
    input: JSON.stringify({ sourceSegments: segments, ...(input.range ? { range: input.range } : {}), ...(input.request?.history ? { history: input.request.history } : {}) }),
    instructions: buildMaterialGPTInstructions(input.request?.task ?? 'summary', input.cardCount, input.request),
    signal: options.signal
      ? AbortSignal.any([options.signal, AbortSignal.timeout(180_000)])
      : AbortSignal.timeout(180_000),
  });
  let parsed: { summary?: unknown; cards?: unknown; quiz?: unknown; map?: unknown; diagnostics?: MaterialDiagnostic[] };
  try {
    parsed = JSON.parse(response.text);
  } catch {
    throw new DomainError(
      'AI_ERROR',
      'GPT 결과의 형식을 확인하지 못했습니다. 원본을 보존했습니다. 다시 만들기는 직접 선택해 주세요.',
    );
  }
  if (!Array.isArray(parsed.cards))
    throw new DomainError('AI_ERROR', 'GPT의 카드 형식을 확인하지 못했습니다.');
  const result = {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    model: options.model,
    contractVersion: MATERIAL_CONTRACT_VERSION,
    status: parsed.diagnostics?.length ? ((Array.isArray(parsed.summary) && parsed.summary.length || parsed.cards.length || Array.isArray(parsed.quiz) && parsed.quiz.length || parsed.map) ? 'partial' as const : parsed.diagnostics[0].kind) : 'complete' as const,
    ...(input.range ? { range: structuredClone(input.range) } : {}),
    ...(parsed.diagnostics !== undefined ? { diagnostics: parsed.diagnostics } : {}),
    ...(input.request ? { request: structuredClone(input.request) } : {}),
    promptVersion: STUDY_GPT_PROMPT_VERSION,
    segments,
    summary: parsed.summary,
    cards: parsed.cards.map((card: Record<string, unknown>) => ({
      ...card,
      id: crypto.randomUUID(),
      excluded: false,
      originalQuestion: card.question,
      originalAnswer: card.answer,
    })),
    ...(['quiz','study-pack'].includes(input.request?.task ?? '') ? { quiz: Array.isArray(parsed.quiz) ? parsed.quiz.map((q: Record<string, unknown>) => ({ ...q, id: crypto.randomUUID() })) : parsed.quiz } : {}),
    ...(['mindmap','study-pack'].includes(input.request?.task ?? '') && parsed.map !== null ? { map: parsed.map } : {}),
  };
  validateMaterialResult(result);
  if (['quiz','study-pack'].includes(input.request?.task ?? '') && (!result.diagnostics?.length && !result.quiz?.length || (result.quiz?.length ?? 0) > input.cardCount)) throw new DomainError('AI_ERROR', '요청한 퀴즈의 문항과 근거를 확인하지 못했습니다.');
  if (['mindmap','study-pack'].includes(input.request?.task ?? '') && !result.map && !result.diagnostics?.length) throw new DomainError('AI_ERROR', '개념도의 관계를 확인하지 못했습니다.');
  if (['tutor', 'quiz', 'mindmap'].includes(input.request?.task ?? '') && result.cards.length) throw new DomainError('AI_ERROR', '이 작업의 출력 형식을 확인하지 못했습니다.');
  if (['quiz','mindmap','tutor','study-pack'].includes(input.request?.task ?? '')) {
    const refs = [...result.summary.flatMap(s => s.sourceIds), ...(result.quiz?.flatMap(q => q.sourceIds) ?? []), ...(result.map?.nodes.flatMap(n => n.sourceIds) ?? []), ...(result.map?.edges.flatMap(e => e.sourceIds) ?? [])];
    if (refs.some(id => id.startsWith('request-'))) throw new DomainError('AI_ERROR', '질문을 자료의 근거로 인용한 결과는 적용하지 않았습니다. 원문 근거를 확인해 주세요.');
  }
  if (result.cards.length > input.cardCount)
    throw new DomainError('AI_ERROR', '요청한 카드 수를 넘는 GPT 결과는 적용하지 않았습니다.');
  if (!allowsMaterialCards(input.request?.task ?? 'summary') && result.cards.length)
    throw new DomainError('AI_ERROR', '이 작업에서 요청하지 않은 답 카드는 적용하지 않았습니다.');
  return result;
}
