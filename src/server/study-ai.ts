import type { MaterialRange } from '../domain/study-gpt-contract.ts';
import { requireOwnerAI } from '../domain/ai-access.ts';
import { validateStudyAIRequest, type StudyAIRequest } from '../domain/study-ai-request.ts';
import { DomainError } from '../domain/model.ts';
import {
  MAX_SOURCE_TEXT,
  validateMaterialResult,
  type MaterialResult,
  type SourceSegment,
} from '../domain/study-material.ts';

export interface AIInput {
  text: string;
  audio: Blob | null;
  audioName: string;
  cardCount: number;
  request?: StudyAIRequest;
  sourceSegments?: SourceSegment[];
  range?: MaterialRange;
}
export interface AIBackend {
  authorize(request: Request): Promise<{ userId: string; namespace?: string }>;
  reserve(userId: string): Promise<void>;
  generate(input: AIInput): Promise<MaterialResult>;
}
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Cache-Control': 'no-store',
};
export function aiResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
async function boundedBody(request: Request) {
  const limit = MAX_SOURCE_TEXT * 12 + 200_000;
  if (Number(request.headers.get('content-length')) > limit)
    throw new DomainError('TOO_LARGE', '선택한 전사문과 질문의 범위를 나누어 주세요.');
  const reader = request.body?.getReader();
  if (!reader) throw new DomainError('INVALID_REQUEST', '분석할 자료를 넣어 주세요.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) {
      await reader.cancel();
      throw new DomainError('TOO_LARGE', '선택한 전사문과 질문의 범위를 나누어 주세요.');
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return new Request(request.url, {
    method: 'POST',
    headers: request.headers,
    body: bytes,
  }).formData();
}
/** Identity and approval are checked before parsing or sending source bytes to AI. */
export async function handleStudyAI(request: Request, backend: AIBackend): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST')
    return aiResponse({ code: 'METHOD', message: '지원하지 않는 요청입니다.' }, 405);
  try {
    const identity = await backend.authorize(request);
    requireOwnerAI(identity);
    const form = await boundedBody(request),
      namespace = String(form.get('namespace') ?? '');
    if (
      form.get('userId') !== identity.userId ||
      (identity.namespace !== undefined && namespace !== identity.namespace) ||
      !['personal', 'test', 'demo'].includes(namespace)
    )
      throw new DomainError('OWNERSHIP', '이 공간의 자료만 분석할 수 있습니다.');
    if (form.has('audio')) throw new DomainError('AUDIO_NOT_SUPPORTED', '클로바노트 전사문을 붙여 넣거나 전사문 파일을 가져와 주세요.');
    const text = form.has('textJSON')
        ? JSON.parse(String(form.get('textJSON')))
        : (form.get('text') ?? ''),
      audio = null,
      cardCount = Number(form.get('cardCount') ?? 10);
    if (
      typeof text !== 'string' ||
      text.length > MAX_SOURCE_TEXT ||
      !Number.isInteger(cardCount) ||
      cardCount < 1 ||
      cardCount > 30
    )
      throw new DomainError('INVALID_REQUEST', '강의 내용과 카드 개수를 확인해 주세요.');
    if (!audio && !text.trim() && !form.has('segmentsJSON'))
      throw new DomainError('INVALID_REQUEST', '전사문이나 강의 내용을 넣어 주세요.');
    const aiRequest = form.has('requestJSON')
      ? JSON.parse(String(form.get('requestJSON')))
      : undefined;
    if (aiRequest !== undefined) validateStudyAIRequest(aiRequest);
    const sourceSegments = form.has('segmentsJSON') ? JSON.parse(String(form.get('segmentsJSON'))) : undefined;
    if (sourceSegments !== undefined) {
      if (!Array.isArray(sourceSegments)) throw new DomainError('INVALID_REQUEST', '자료의 원문 구간을 확인해 주세요.');
      if (sourceSegments.length) validateMaterialResult({ id: 'input', at: new Date().toISOString(), model: 'source', segments: sourceSegments, summary: [], cards: [] });
      if (text.length + sourceSegments.reduce((n: number, b: SourceSegment) => n + b.text.length, 0) > MAX_SOURCE_TEXT) throw new DomainError('SOURCE_SIZE', '필기와 선택한 자료가 15만 자를 넘습니다. 사용할 구간을 나누어 주세요.');
    }
    if (!audio && !text.trim() && !sourceSegments?.length) throw new DomainError('INVALID_REQUEST', '분석할 원문 구간을 선택해 주세요.');
    const extra = ['problem','attempt','reference','focus'].reduce((n, key) => n + (aiRequest?.[key]?.length ?? 0), 0);
    if (text.length + (sourceSegments?.reduce((n: number,b: SourceSegment) => n + b.text.length,0) ?? 0) + extra > MAX_SOURCE_TEXT) throw new DomainError('SOURCE_SIZE', '선택 원문과 추가 질문의 범위를 나누어 주세요.');
    const range = form.has('rangeJSON') ? JSON.parse(String(form.get('rangeJSON'))) : undefined;
    if (range !== undefined) {
      if (audio || text || !sourceSegments?.length) throw new DomainError('INVALID_REQUEST', '분할 범위에는 선택한 원문 구간만 사용할 수 있습니다.');
      validateMaterialResult({ id: 'range-input', at: new Date().toISOString(), model: 'source', segments: sourceSegments, summary: [], cards: [], range });
    }
    await backend.reserve(identity.userId);
    const result = await backend.generate({
      text,
      audio: audio as Blob | null,
      audioName: '',
      cardCount,
      ...(aiRequest ? { request: aiRequest } : {}),
      ...(sourceSegments ? { sourceSegments } : {}),
      ...(range ? { range } : {}),
    });
    validateMaterialResult(result);
    return aiResponse({ result });
  } catch (error) {
    const known = error instanceof DomainError;
    const code = known ? error.code : 'AI_ERROR';
    return aiResponse(
      {
        code,
        message: known
          ? error.message
          : 'AI 처리 중 연결이 끊겼습니다. 원본은 남아 있습니다. 다시 시도해 주세요.',
      },
      code === 'AUTH_REQUIRED'
        ? 401
        : ['OWNERSHIP', 'ACCESS_DENIED', 'AI_OWNER_REQUIRED'].includes(code)
          ? 403
          : code === 'RATE_LIMIT'
            ? 429
            : known && !['AI_ERROR', 'AI_KEY_REQUIRED', 'AI_QUOTA', 'AI_MODEL'].includes(code)
              ? 400
              : 503,
    );
  }
}
