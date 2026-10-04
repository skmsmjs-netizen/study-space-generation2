import { requireOwnerAI } from '../domain/ai-access';
import { REMOTE_AI_APPROVAL_MESSAGE } from '../domain/ai-connection';
import { DomainError } from '../domain/model';
import { aiResponse, handleStudyAI } from './study-ai';
import { generateGPTMaterial, type GPTMaterialRuntime } from './gpt-material';
import { generateGPTTopicMemory, handleTopicMemoryAI } from './gpt-topic-memory';

/** Server-only connection supplied by an approved SIWC credential manager.
 * The manager must renew credentials durably and check current grants/credit
 * settings on every request. Browser input can never establish this connection.
 */
export interface RemoteGPTConnection {
  model: string;
  models: { slug: string; displayName: string }[];
  creditsConfirmed: boolean;
  runtime: GPTMaterialRuntime;
  beforeInference(): Promise<void>;
  reserve(userId: string): Promise<void>;
}
export interface RemoteStudyAIOptions {
  authorize(request: Request): Promise<{ userId: string; namespace: string }>;
  /** null until remote hosting eligibility AND subscription authorization exist. */
  connection(): Promise<RemoteGPTConnection | null>;
}

/** One authenticated Supabase route for status, topic questions and source work. */
export function createRemoteStudyAIHandler(options: RemoteStudyAIOptions) {
  return async (request: Request): Promise<Response> => {
    const path = new URL(request.url).pathname;
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: aiResponse(null).headers });
    if (!['/study-ai', '/study-ai/status', '/study-ai/topic-memory'].some(p => path === p || path === `/functions/v1${p}`))
      return aiResponse({ message: '지원하지 않는 요청입니다.' }, 404);
    let connection: RemoteGPTConnection | null = null;
    async function authorize(req: Request) {
      const identity = await options.authorize(req);
      requireOwnerAI(identity);
      connection = await options.connection();
      if (!connection) throw new DomainError('GPT_REMOTE_APPROVAL_REQUIRED', REMOTE_AI_APPROVAL_MESSAGE);
      return identity;
    }
    if (path.endsWith('/status')) {
      if (request.method !== 'GET') return aiResponse({ message: '지원하지 않는 요청입니다.' }, 405);
      try {
        requireOwnerAI(await options.authorize(request));
        const c = await options.connection();
        // Explicit public fields only: no credentials/runtime/identity are serialized.
        return aiResponse({ configured: !!c, local: false, provider: 'chatgpt',
          model: c?.model ?? '', models: c?.models ?? [],
          session: { status: c ? 'connected' : 'disconnected', sharing: !!c },
          creditsConfirmed: c?.creditsConfirmed ?? false, transcription: false,
          connecting: false, connectionError: c ? '' : REMOTE_AI_APPROVAL_MESSAGE });
      } catch (error) {
        const code = error instanceof DomainError ? error.code : 'AI_STATUS_ERROR';
        return aiResponse({ code, message: error instanceof DomainError ? error.message : 'ChatGPT 연결 상태를 확인하지 못했습니다. 원본은 유지했습니다.' },
          code === 'AUTH_REQUIRED' ? 401 : ['AI_OWNER_REQUIRED', 'ACCESS_DENIED'].includes(code) ? 403 : 503);
      }
    }
    async function reserve(userId: string) {
      if (!connection?.creditsConfirmed) throw new DomainError('AI_QUOTA', '추가 크레딧 사용 허용이 꺼져 있음을 확인해 주세요. 입력은 유지했습니다.');
      if (!connection.model || !connection.models.some(m => m.slug === connection!.model))
        throw new DomainError('AI_MODEL', '사용할 ChatGPT 모델을 확인해 주세요. 입력은 유지했습니다.');
      await connection.reserve(userId);
    }
    if (path.endsWith('/topic-memory')) return handleTopicMemoryAI(request, {
      authorize, reserve,
      generate: input => generateGPTTopicMemory(input, { runtime: connection!.runtime,
        model: connection!.model, beforeInference: () => connection!.beforeInference(), signal: request.signal }),
    });
    return handleStudyAI(request, { authorize, reserve, async generate(input) {
      if (input.audio) throw new DomainError('INVALID_REQUEST', '받아쓰기 내용을 필기에 추가해 주세요. 원본 음성은 보관했습니다.');
      return generateGPTMaterial(input, { runtime: connection!.runtime, model: connection!.model,
        beforeInference: () => connection!.beforeInference(), signal: request.signal });
    } });
  };
}
