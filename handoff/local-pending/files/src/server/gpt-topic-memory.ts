import { DomainError } from '../domain/model.ts';
import { requireOwnerAI } from '../domain/ai-access.ts';
import {
  validateTopicMemoryInput,
  validateTopicMemoryResult,
  type TopicMemoryInput,
  type TopicMemoryResult,
  TOPIC_MEMORY_WAIT_MS,
  TOPIC_MEMORY_TIMEOUT_MESSAGE,
} from '../domain/topic-memory.ts';
import type { GPTMaterialRuntime } from './gpt-material.ts';
import { aiResponse } from './study-ai.ts';
import { buildTopicMemoryGPTInstructions, STUDY_GPT_PROMPT_VERSION } from './study-gpt-prompt.ts';

export async function generateGPTTopicMemory(
  input: TopicMemoryInput,
  options: {
    runtime: GPTMaterialRuntime;
    model: string;
    beforeInference?: () => Promise<void>;
    signal?: AbortSignal;
  },
): Promise<TopicMemoryResult> {
  validateTopicMemoryInput(input);
  const signal = options.signal
    ? AbortSignal.any([options.signal, AbortSignal.timeout(TOPIC_MEMORY_WAIT_MS)])
    : AbortSignal.timeout(TOPIC_MEMORY_WAIT_MS);
  signal.throwIfAborted();
  await options.beforeInference?.();
  signal.throwIfAborted();
  const response = await options.runtime
    .streamResponse({
      model: options.model,
      outputFormat: 'topic-memory',
      input: JSON.stringify(input),
      signal,
      instructions: buildTopicMemoryGPTInstructions(input.count),
    })
    .catch((error) => {
      if (signal.aborted && signal.reason?.name === 'TimeoutError')
        throw new DomainError('AI_TIMEOUT', TOPIC_MEMORY_TIMEOUT_MESSAGE);
      throw error;
    });
  signal.throwIfAborted();
  let parsed: unknown;
  try {
    parsed = JSON.parse(response.text);
  } catch {
    throw new DomainError(
      'AI_ERROR',
      '생성 결과의 형식을 확인하지 못했습니다. 다시 만들기는 직접 선택해 주세요.',
    );
  }
  const cards = (parsed as { cards?: unknown })?.cards;
  if (!Array.isArray(cards))
    throw new DomainError('AI_ERROR', 'GPT가 질문 목록을 반환하지 않았습니다.');
  const result = {
    evidenceType: 'topic-general' as const,
    ...((parsed as TopicMemoryResult)?.diagnostics !== undefined ? { diagnostics: (parsed as TopicMemoryResult).diagnostics } : !cards.length ? { diagnostics: [{ kind: 'insufficient-evidence' as const, message: '이 범위에서 적절한 문항을 만들지 못했습니다. 주제 이름이나 출제 초점을 확인해 주세요.' }] } : {}),
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    model: options.model,
    input: structuredClone(input),
    promptVersion: STUDY_GPT_PROMPT_VERSION,
    cards: cards.map((c) => ({
      id: crypto.randomUUID(),
      topicId: c?.topicId,
      question: c?.question,
      answer: c?.answer,
    })),
  };
  validateTopicMemoryResult(result);
  return result;
}
export interface TopicMemoryBackend {
  authorize(request: Request): Promise<{ userId: string; namespace?: string }>;
  reserve(userId: string): Promise<void>;
  generate(input: TopicMemoryInput): Promise<TopicMemoryResult>;
}
export async function handleTopicMemoryAI(
  request: Request,
  backend: TopicMemoryBackend,
): Promise<Response> {
  if (request.method !== 'POST') return aiResponse({ message: '지원하지 않는 요청입니다.' }, 405);
  try {
    const identity = await backend.authorize(request);
    requireOwnerAI(identity);
    // Bound bytes before parsing. A revoked/nonowner caller never reaches the body or provider.
    const reader = request.body?.getReader();
    if (!reader) throw new DomainError('INVALID_REQUEST', '출제할 주제를 선택해 주세요.');
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 150_000) {
        await reader.cancel();
        throw new DomainError('TOO_LARGE', '주제를 나누어 출제해 주세요.');
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const body = JSON.parse(new TextDecoder().decode(bytes));
    if (
      body.userId !== identity.userId ||
      body.namespace !== 'personal' ||
      identity.namespace !== 'personal'
    )
      throw new DomainError('OWNERSHIP', '개인 공간의 주제만 출제할 수 있습니다.');
    validateTopicMemoryInput(body.input);
    await backend.reserve(identity.userId);
    const result = await backend.generate(body.input);
    validateTopicMemoryResult(result);
    if (JSON.stringify(result.input) !== JSON.stringify(body.input))
      throw new DomainError('AI_ERROR', '출제 범위가 요청과 달라 결과를 적용하지 않았습니다.');
    return aiResponse({ result });
  } catch (error) {
    const known = error instanceof DomainError;
    const code = known ? error.code : 'AI_ERROR';
    return aiResponse(
      {
        code,
        message: known
          ? error.message
          : '생성을 마치지 못했습니다. 기존 항목과 초안은 유지했습니다.',
      },
      code === 'AUTH_REQUIRED'
        ? 401
        : ['AI_OWNER_REQUIRED', 'ACCESS_DENIED', 'OWNERSHIP'].includes(code)
          ? 403
          : code === 'RATE_LIMIT'
            ? 429
            : 400,
    );
  }
}
