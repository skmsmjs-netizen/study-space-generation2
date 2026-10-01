import { requireOwnerAI } from '../domain/ai-access';
import { DomainError } from '../domain/model';
import { aiResponse } from './study-ai';
import { REMOTE_AI_APPROVAL_MESSAGE } from '../domain/ai-connection';

/** Do not expose identity, tokens, model catalog or paid provider while eligibility is unresolved. */
export async function remoteAIStatus(request: Request, authorize: (request: Request) => Promise<{ userId: string; namespace: string }>) {
  try {
    requireOwnerAI(await authorize(request));
    return aiResponse({ configured: false, local: false, provider: 'chatgpt', model: '', models: [], session: { status: 'disconnected', sharing: false }, creditsConfirmed: false, transcription: false, connecting: false, connectionError: REMOTE_AI_APPROVAL_MESSAGE });
  } catch (error) {
    const known = error instanceof DomainError;
    const code = known ? error.code : 'AI_STATUS_ERROR';
    return aiResponse({ code, message: known ? error.message : 'ChatGPT 연결 상태를 확인하지 못했습니다. 원본은 유지했습니다.' }, code === 'AUTH_REQUIRED' ? 401 : ['AI_OWNER_REQUIRED', 'ACCESS_DENIED'].includes(code) ? 403 : 503);
  }
}
