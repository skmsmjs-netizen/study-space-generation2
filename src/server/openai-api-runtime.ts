import { DomainError } from '../domain/model';
import type { GPTMaterialRuntime } from './gpt-material';

export const API_MODEL = 'gpt-6-luna';
export const API_MAX_OUTPUT_TOKENS = 8000;
/** USD millionths. Conservative long-context/cache-write ceiling, not an invoice. */
export const budgetCost = (inputTokens: number, outputTokens: number) =>
  Math.ceil(inputTokens * 0.25 + outputTokens * 0.75);
export interface APIBudget {
  reserve(id: string, amount: number): Promise<{ key: string }>;
  settle(id: string, amount: number): Promise<void>;
}
export function createOpenAIAPIRuntime(budget: APIBudget, requestFetch: typeof fetch = fetch): GPTMaterialRuntime {
  return { async streamResponse(options) {
    if (options.model !== API_MODEL) throw new DomainError('AI_MODEL', '사용할 API 모델을 확인해 주세요.');
    options.signal.throwIfAborted();
    const inputBound = new TextEncoder().encode(options.input + options.instructions).length + 4096;
    const ceiling = budgetCost(inputBound, API_MAX_OUTPUT_TOKENS);
    const id = crypto.randomUUID();
    const { key } = await budget.reserve(id, ceiling);
    let amount: number | null = null;
    let dispatched = false;
    try {
      options.signal.throwIfAborted();
      dispatched = true;
      const response = await requestFetch('https://api.openai.com/v1/responses', {
        method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        redirect: 'error', signal: options.signal,
        body: JSON.stringify({ model: API_MODEL, instructions: options.instructions,
          input: [{ role: 'user', content: options.input }], store: false, stream: false,
          service_tier: 'default', reasoning: { effort: 'low' }, max_output_tokens: API_MAX_OUTPUT_TOKENS }),
      });
      if (!response.ok) {
        // No raw supplier error: it may contain request text or credentials.
        if ([400, 401, 403, 404, 429].includes(response.status)) amount = 0;
        await response.body?.cancel();
        throw new DomainError('AI_API_ERROR', response.status === 401 || response.status === 403
          ? 'API 키와 호출 권한을 확인해 주세요. 원본은 보관했습니다.'
          : response.status === 429 ? 'API 잔액·월 상한·요청 한도를 확인해 주세요. 자동으로 다시 호출하지 않았습니다.'
          : 'API 생성을 마치지 못했습니다. 원본과 기존 결과를 보관했습니다. 다시 생성은 직접 선택해 주세요.');
      }
      const reader = response.body?.getReader();
      if (!reader) throw new DomainError('AI_API_ERROR', 'API 결과를 받지 못했습니다. 원본은 보관했습니다.');
      const chunks: Uint8Array[] = []; let size = 0;
      while (true) {
        const part = await reader.read(); if (part.done) break;
        size += part.value.length;
        if (size > 2_000_000) { await reader.cancel(); throw new DomainError('AI_API_ERROR', 'API 결과가 너무 큽니다. 원본은 보관했습니다.'); }
        chunks.push(part.value);
      }
      const bytes = new Uint8Array(size); let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      const result = JSON.parse(new TextDecoder().decode(bytes));
      const input = result.usage?.input_tokens, output = result.usage?.output_tokens;
      if (Number.isSafeInteger(input) && input >= 0 && Number.isSafeInteger(output) && output >= 0 && output <= API_MAX_OUTPUT_TOKENS)
        amount = Math.min(ceiling, budgetCost(input, output));
      if (result.status !== 'completed') throw new DomainError('AI_API_INCOMPLETE', '결과를 끝까지 생성하지 못했습니다. 자료 범위나 문항 수를 줄여 다시 선택해 주세요. 원본은 보관했습니다.');
      const text = (Array.isArray(result.output) ? result.output : []).flatMap((row: {type?: string; content?: {type?: string; text?: string}[]}) =>
        row.type === 'message' && Array.isArray(row.content) ? row.content.filter(c => c.type === 'output_text' && typeof c.text === 'string').map(c => c.text!) : []).join('');
      if (!text.trim()) throw new DomainError('AI_API_ERROR', 'API가 사용할 결과를 반환하지 않았습니다. 원본은 보관했습니다.');
      return { text };
    } finally {
      // Lost/aborted responses retain their entire reservation; never silently
      // release potentially billed work or retry it. Settlement failure is safe.
      if (amount !== null || !dispatched) await budget.settle(id, amount ?? 0).catch(() => undefined);
    }
  } };
}
