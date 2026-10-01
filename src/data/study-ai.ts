import { requireOwnerAI } from '../domain/ai-access';
import type { AppState } from '../domain/model';
import { createStudyClient, readServerConfig } from './supabase-client';
import { REMOTE_AI_APPROVAL_MESSAGE } from '../domain/ai-connection';
import { receiveTopicMemoryResponse } from './topic-memory-response';
import { validateTopicMemoryInput, type TopicMemoryInput, type TopicMemoryResult, TOPIC_MEMORY_WAIT_MS, TOPIC_MEMORY_TIMEOUT_MESSAGE } from '../domain/topic-memory';
export async function generateTopicMemory(
  owner: Pick<AppState, 'userId' | 'namespace'>,
  input: TopicMemoryInput,
): Promise<TopicMemoryResult> {
  requireOwnerAI(owner);
  validateTopicMemoryInput(input);
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      controller.abort(new DOMException('Memory generation deadline', 'TimeoutError'));
      reject(Error(TOPIC_MEMORY_TIMEOUT_MESSAGE));
    }, TOPIC_MEMORY_WAIT_MS);
  });
  try {
    return await Promise.race([requestTopicMemory(owner, input, controller.signal), timeout]);
  } finally {
    clearTimeout(timer!);
  }
}
async function requestTopicMemory(
  owner: Pick<AppState, 'userId' | 'namespace'>,
  input: TopicMemoryInput,
  signal: AbortSignal,
): Promise<TopicMemoryResult> {
  const connection = await localAIStatus(owner, signal);
  signal.throwIfAborted();
  if (!connection.local) throw Error(connection.connectionError || '이 Mac에서 연 공부 공간에서 GPT를 연결해 주세요.');
  if (!connection.configured)
    throw Error('GPT 연결에서 ChatGPT를 연결해 주세요. 선택한 목차는 유지했습니다.');
  if (!connection.creditsConfirmed)
    throw Error('GPT 연결에서 추가 크레딧 사용 허용이 꺼져 있음을 확인해 주세요.');
  if (!connection.model) throw Error('GPT 연결에서 사용할 모델을 불러와 주세요.');
  const headers = { ...(await ownerAuthHeaders(owner)), 'Content-Type': 'application/json' };
  signal.throwIfAborted();
  const response = await fetch('/api/study-ai/topic-memory', {
    method: 'POST',
    headers,
    body: JSON.stringify({ userId: owner.userId, namespace: owner.namespace, input }),
    signal,
  }).catch(() => {
    throw Error('생성 응답을 받지 못했습니다. 연결과 사용량을 확인해 주세요. 선택한 목차와 입력은 유지했습니다. 다시 생성은 직접 선택해 주세요.');
  });
  return receiveTopicMemoryResponse(response, input);
}

async function ownerAuthHeaders(
  owner: Pick<AppState, 'userId' | 'namespace'>,
): Promise<Record<string, string>> {
  requireOwnerAI(owner);
  const config = readServerConfig();
  if (!config) throw Error('개인 공간의 서버 연결을 확인해 주세요.');
  const client = createStudyClient(config);
  try {
    const { data, error } = await client.auth.getSession();
    if (error || !data.session || data.session.user.id !== owner.userId)
      throw Error('개인 공간에 다시 로그인해 주세요. 원본은 기기에 남아 있습니다.');
    return { Authorization: `Bearer ${data.session.access_token}` };
  } finally {
    client.auth.stopAutoRefresh();
  }
}
export interface GPTConnectionStatus {
  configured: boolean;
  local: boolean;
  provider: 'chatgpt';
  model: string;
  models: { slug: string; displayName: string }[];
  session: { status: string; sharing: boolean; identity?: { name?: string; email?: string } };
  creditsConfirmed: boolean;
  transcription: boolean;
  connecting: boolean;
  connectionError: string;
}
export const CHATGPT_USAGE_URL = 'https://chatgpt.com/settings/usage';
export async function localAIStatus(
  owner: Pick<AppState, 'userId' | 'namespace'>,
  signal?: AbortSignal,
): Promise<GPTConnectionStatus> {
  requireOwnerAI(owner);
  if (!import.meta.env.DEV) {
    const config = readServerConfig();
    if (!config) throw Error('개인 공간의 서버 연결을 확인해 주세요.');
    const response = await fetch(`${config.url}/functions/v1/study-ai/status`, {
      signal,
      headers: { apikey: config.publishableKey, ...(await ownerAuthHeaders(owner)) },
    });
    if (!response.ok) throw Error('ChatGPT 연결 상태를 확인하지 못했습니다. 원본은 보관했습니다.');
    const body = await response.json();
    if (body.configured !== false || body.local !== false || body.provider !== 'chatgpt')
      throw Error('ChatGPT 연결 상태의 형식을 확인하지 못했습니다. 원본은 보관했습니다.');
    return { ...body, connectionError: REMOTE_AI_APPROVAL_MESSAGE } as GPTConnectionStatus;
  }
  signal?.throwIfAborted();
  const response = await fetch('/api/study-ai/status', { headers: await ownerAuthHeaders(owner), signal });
  if (!response.ok) throw Error('AI 연결 상태를 확인하지 못했습니다.');
  return response.json();
}
export async function connectLocalAI(owner: Pick<AppState, 'userId' | 'namespace'>) {
  requireOwnerAI(owner);
  if (!import.meta.env.DEV) throw Error('원격 ChatGPT 연결의 서비스 접근 승인이 필요합니다. 원본은 보관했습니다.');
  const response = await fetch('/api/study-ai/connect', {
    method: 'POST',
    headers: { ...(await ownerAuthHeaders(owner)), 'Content-Type': 'application/json' },
    body: '{}',
  });
  const body = await response.json();
  if (!response.ok) throw Error(body.message || 'ChatGPT 연결을 시작하지 못했습니다.');
  return body as { authorizationURL: string };
}
export async function updateGPTConnection(
  owner: Pick<AppState, 'userId' | 'namespace'>,
  action: 'models' | 'settings' | 'disconnect' | 'cancel-connect',
  settings?: { model: string; creditsDisabled: boolean },
): Promise<GPTConnectionStatus> {
  requireOwnerAI(owner);
  if (!import.meta.env.DEV) throw Error('원격 ChatGPT 연결의 서비스 접근 승인이 필요합니다. 원본은 보관했습니다.');
  const response = await fetch(`/api/study-ai/${action}`, {
    method: 'POST',
    headers: { ...(await ownerAuthHeaders(owner)), 'Content-Type': 'application/json' },
    body: JSON.stringify(settings ?? {}),
  });
  const body = await response.json();
  if (!response.ok) throw Error(body.message || 'GPT 연결을 확인하지 못했습니다.');
  return action === 'cancel-connect' ? localAIStatus(owner) : body;
}
