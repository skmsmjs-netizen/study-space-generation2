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
    model: string;
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
  const segments: SourceSegment[] = structuredClone(input.sourceSegments ?? []);
  if (input.audio) {
    if (!options.transcribe)
      throw new DomainError(
        'TRANSCRIPTION_REQUIRED',
        '원본 음성을 이 Mac에서 받아쓸 연결이 필요합니다.',
      );
    segments.push(...(await options.transcribe(input.audio)));
  }
  let buffered = '';
  for (const chunk of input.text.match(/[\s\S]{1,2000}/g) ?? []) {
    buffered += chunk;
    if (buffered.trim()) {
      segments.push({ id: `t${segments.length + 1}`, start: null, end: null, text: buffered });
      buffered = '';
    }
  }
  if (buffered && segments.length) segments[segments.length - 1].text += buffered;
  for (const key of ['problem', 'attempt', 'reference', 'focus'] as const) {
    const text = input.request?.[key];
    if (text?.trim()) segments.push({ id: `request-${key}`, start: null, end: null, text });
  }
  if (!segments.length || segments.reduce((sum, row) => sum + row.text.length, 0) > 150_000)
    throw new DomainError(
      'SOURCE_SIZE',
      '받아쓴 내용과 필기의 범위를 나누어 정리해 주세요. 원본은 보존했습니다.',
    );
  validateMaterialResult({
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
    input: JSON.stringify({ sourceSegments: segments, ...(input.request?.history ? { history: input.request.history } : {}) }),
    instructions: buildMaterialGPTInstructions(input.request?.task ?? 'summary', input.cardCount),
    signal: options.signal
      ? AbortSignal.any([options.signal, AbortSignal.timeout(180_000)])
      : AbortSignal.timeout(180_000),
  });
  let parsed: { summary?: unknown; cards?: unknown; quiz?: unknown; map?: unknown };
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
    ...(input.request?.task === 'quiz' ? { quiz: Array.isArray(parsed.quiz) ? parsed.quiz.map((q: Record<string, unknown>) => ({ ...q, id: crypto.randomUUID() })) : parsed.quiz } : {}),
    ...(input.request?.task === 'mindmap' ? { map: parsed.map } : {}),
  };
  validateMaterialResult(result);
  if (input.request?.task === 'quiz' && (!result.quiz?.length || result.quiz.length > input.cardCount)) throw new DomainError('AI_ERROR', '요청한 퀴즈의 문항과 근거를 확인하지 못했습니다.');
  if (input.request?.task === 'mindmap' && !result.map) throw new DomainError('AI_ERROR', '개념도의 관계를 확인하지 못했습니다.');
  if (['tutor', 'quiz', 'mindmap'].includes(input.request?.task ?? '') && result.cards.length) throw new DomainError('AI_ERROR', '이 작업의 출력 형식을 확인하지 못했습니다.');
  if (result.cards.length > input.cardCount)
    throw new DomainError('AI_ERROR', '요청한 카드 수를 넘는 GPT 결과는 적용하지 않았습니다.');
  if (input.request?.task === 'hint' && result.cards.length)
    throw new DomainError('AI_ERROR', '힌트 요청에서 답 카드를 생성한 결과는 적용하지 않았습니다.');
  return result;
}
