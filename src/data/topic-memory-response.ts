import {
  validateTopicMemoryInput,
  validateTopicMemoryResult,
  type TopicMemoryInput,
  type TopicMemoryResult,
} from '../domain/topic-memory';

/** Only a complete, valid response for this request may become a review draft. */
export async function receiveTopicMemoryResponse(
  response: Response,
  input: TopicMemoryInput,
): Promise<TopicMemoryResult> {
  validateTopicMemoryInput(input);
  const reader = response.body?.getReader();
  if (!reader) throw Error('생성 응답을 받지 못했습니다. 선택한 목차와 입력은 유지했습니다.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      // 30 cards at the domain's maximum text lengths plus input/metadata fit below 2 MB.
      if (size > 2_000_000) {
        await reader.cancel();
        throw Error('생성 응답이 너무 큽니다. 항목 수를 줄여 주세요. 기존 입력은 유지했습니다.');
      }
      chunks.push(value);
    }
  } catch (error) {
    if (size > 2_000_000) throw error;
    throw Error(
      '응답 수신이 끊겼습니다. 선택한 목차와 입력은 유지했습니다. 다시 생성은 직접 선택해 주세요.',
    );
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    throw Error(
      '생성 응답을 읽지 못했습니다. 선택한 목차와 입력은 유지했습니다. 다시 생성은 직접 선택해 주세요.',
    );
  }
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'message' in body ? body.message : null;
    throw Error(
      typeof message === 'string' && message.trim() && message.length <= 2000
        ? message
        : '암기항목 생성을 마치지 못했습니다. 기존 입력은 유지했습니다.',
    );
  }
  const result = body && typeof body === 'object' && 'result' in body ? body.result : null;
  try {
    validateTopicMemoryResult(result);
  } catch {
    throw Error('받은 질문과 답안의 형식을 확인하지 못했습니다. 기존 입력은 유지했습니다.');
  }
  if (JSON.stringify(result.input) !== JSON.stringify(input))
    throw Error('받은 결과의 출제 범위가 달라 적용하지 않았습니다. 선택한 목차는 유지했습니다.');
  return result;
}
