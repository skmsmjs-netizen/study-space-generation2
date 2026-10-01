import { planMaterialRanges } from '../domain/study-gpt-contract';
import { requireOwnerAI } from '../domain/ai-access';
import { activeStudyAIRequest, validateStudyAIRequest } from '../domain/study-ai-request';
import type { AppState } from '../domain/model';
import {
  validateMaterialResult,
  type MaterialContent,
  type MaterialResult,
} from '../domain/study-material';
import { createStudyClient, readServerConfig } from './supabase-client';
import { documentSegments, selectedMaterialDocuments } from '../domain/material-source';
import { receiveTopicMemoryResponse } from './topic-memory-response';
import {
  validateTopicMemoryInput,
  type TopicMemoryInput,
  type TopicMemoryResult,
  TOPIC_MEMORY_WAIT_MS,
  TOPIC_MEMORY_TIMEOUT_MESSAGE,
} from '../domain/topic-memory';

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
  if (!connection.configured)
    throw Error(connection.connectionError || 'GPT 연결에서 API 키를 등록해 주세요. 선택한 목차는 유지했습니다.');
  if (connection.provider === 'chatgpt' && !connection.creditsConfirmed && !connection.temporaryCreditsAllowed)
    throw Error('GPT 연결에서 추가 크레딧 사용 허용이 꺼져 있음을 확인해 주세요.');
  if (!connection.model) throw Error('GPT 연결에서 사용할 모델을 불러와 주세요.');
  const target = await studyAIRequestTarget(owner, connection, '/topic-memory');
  const headers = { ...target.headers, 'Content-Type': 'application/json' };
  signal.throwIfAborted();
  const response = await fetch(target.url, {
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
  provider: 'chatgpt' | 'openai-api';
  billing?: { configured: boolean; enabled: boolean; limitMicro: number; usedMicro: number; pendingMicro: number; month: string };
  model: string;
  models: { slug: string; displayName: string }[];
  session: { status: string; sharing: boolean; identity?: { name?: string; email?: string } };
  creditsConfirmed: boolean;
  temporaryCreditsAllowed?: boolean;
  temporaryCreditsRemaining?: number;
  temporaryCreditsExpiresAt?: number;
  transcription: boolean;
  connecting: boolean;
  connectionError: string;
}
export const CHATGPT_USAGE_URL = 'https://chatgpt.com/settings/usage';
async function studyAIRequestTarget(owner: Pick<AppState, 'userId' | 'namespace'>, connection: GPTConnectionStatus, path: string) {
  const headers = await ownerAuthHeaders(owner);
  if (connection.local) return { url: `/api/study-ai${path}`, headers };
  const config = readServerConfig();
  if (!config) throw Error('개인 공간의 서버 연결을 확인해 주세요.');
  return { url: `${config.url}/functions/v1/${connection.provider === 'openai-api' ? 'study-openai-api' : 'study-ai'}${path}`, headers: { ...headers, apikey: config.publishableKey } };
}
export async function localAIStatus(
  owner: Pick<AppState, 'userId' | 'namespace'>,
  signal?: AbortSignal,
): Promise<GPTConnectionStatus> {
  requireOwnerAI(owner);
  const config = readServerConfig();
  if (!config) throw Error('개인 공간의 서버 연결을 확인해 주세요.');
  const response = await fetch(`${config.url}/functions/v1/study-openai-api/status`, {
    signal, headers: { apikey: config.publishableKey, ...(await ownerAuthHeaders(owner)) },
  });
  if (!response.ok) throw Error('API 설정을 확인하지 못했습니다. 원본은 보관했습니다.');
  const body = await response.json();
  const bill = body.billing;
  if (typeof body.configured !== 'boolean' || body.local !== false || body.provider !== 'openai-api'
    || body.model !== 'gpt-6-luna' || !Array.isArray(body.models)
    || body.models.some((m: { slug?: unknown; displayName?: unknown }) => !m || typeof m.slug !== 'string' || typeof m.displayName !== 'string')
    || !bill || typeof bill.configured !== 'boolean' || typeof bill.enabled !== 'boolean'
    || !['limitMicro','usedMicro','pendingMicro'].every(key => Number.isSafeInteger(bill[key]) && bill[key] >= 0)
    || bill.limitMicro < 100_000 || bill.limitMicro > 10_000_000 || typeof bill.month !== 'string'
    || body.configured !== (bill.configured && bill.enabled)
    || typeof body.connectionError !== 'string') throw Error('API 설정의 형식을 확인하지 못했습니다. 원본은 보관했습니다.');
  return { configured: body.configured, local: false, provider: 'openai-api', model: body.model,
    models: body.models.map((m: { slug: string; displayName: string }) => ({ slug: m.slug, displayName: m.displayName })),
    session: { status: bill.configured ? 'connected' : 'disconnected', sharing: false },
    creditsConfirmed: false, transcription: false, connecting: false, connectionError: body.connectionError,
    billing: { configured: bill.configured, enabled: bill.enabled, limitMicro: bill.limitMicro,
      usedMicro: bill.usedMicro, pendingMicro: bill.pendingMicro, month: bill.month } };
}
export async function configureOpenAIAPI(owner: Pick<AppState, 'userId' | 'namespace'>,
  settings: { key?: string; limitMicro: number; enabled: boolean; confirmPaid: true; disconnect?: boolean }): Promise<void> {
  requireOwnerAI(owner);
  const config = readServerConfig();
  if (!config) throw Error('개인 공간의 서버 연결을 확인해 주세요.');
  const response = await fetch(`${config.url}/functions/v1/study-openai-api/settings`, {
    method: 'POST', headers: { apikey: config.publishableKey, ...(await ownerAuthHeaders(owner)), 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  const body = await response.json();
  if (!response.ok || body.saved !== true) throw Error(body.message || 'API 설정을 저장하지 못했습니다. 입력한 키는 다시 입력해 주세요.');
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
export async function generateStudyMaterial(
  owner: Pick<AppState, 'userId' | 'namespace'>,
  content: MaterialContent,
  cardCount: number,
  signal?: AbortSignal,
): Promise<MaterialResult> {
  requireOwnerAI(owner);
  const request = activeStudyAIRequest(content.aiRequest);
  validateStudyAIRequest(request);
  const plan = planMaterialRanges({ ...content, audio: null }, request);
  const divided = plan.batches.length > 1;
  const index = content.generationProgress?.sourceIdentity === plan.sourceIdentity ? content.generationProgress.index : 0;
  if (divided && !plan.batches[index]) throw Error('현재 원문에서 사용할 처리 범위를 다시 선택해 주세요.');
  const segments = divided ? plan.batches[index] : documentSegments(content.documents);
  const extra = ['problem','attempt','reference','focus'].reduce((n, key) => n + (request[key as 'problem'|'attempt'|'reference'|'focus']?.length ?? 0), 0);
  if ((divided ? 0 : content.sourceText.length) + segments.reduce((n, b) => n + b.text.length, 0) + extra > 150_000) throw Error('선택한 원문과 추가 질문의 범위를 나누어 주세요. 원본은 유지했습니다.');
  const connection = await localAIStatus(owner);
  if (!connection.configured)
    throw Error(connection.connectionError || 'GPT 연결에서 API 키를 등록해 주세요. 원본은 보관했습니다.');
  if (connection.provider === 'chatgpt' && !connection.creditsConfirmed && !connection.temporaryCreditsAllowed)
    throw Error('GPT 연결에서 추가 크레딧 사용 허용이 꺼져 있음을 확인해 주세요.');
  if (!connection.model) throw Error('GPT 연결에서 사용할 모델을 불러와 주세요.');
  const form = new FormData();
  form.set('userId', owner.userId);
  form.set('namespace', owner.namespace);
  form.set('textJSON', JSON.stringify(divided ? '' : content.sourceText));
  if (divided) {
    const ids = segments.map(s => s.id);
    const overlapIds = ids.filter(id => plan.batches.some((batch, at) => at !== index && batch.some(s => s.id === id)));
    form.set('rangeJSON', JSON.stringify({ index, count: plan.batches.length, sourceIdentity: plan.sourceIdentity, totalSegments: plan.totalSegments, sourceIds: ids, overlapIds }));
  }
  form.set('cardCount', String(cardCount));
  if (content.aiRequest) form.set('requestJSON', JSON.stringify(request));
  if (segments.length) form.set('segmentsJSON', JSON.stringify(segments));
  const { headers, url } = await studyAIRequestTarget(owner, connection, '');
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: form,
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(33 * 60_000)])
      : AbortSignal.timeout(33 * 60_000),
  });
  let body: { message?: string; result?: unknown };
  try {
    body = await response.json();
  } catch {
    throw Error('AI 응답을 읽지 못했습니다. 원본은 남아 있습니다. 다시 시도해 주세요.');
  }
  if (!response.ok)
    throw Error(body.message || 'AI가 자료를 처리하지 못했습니다. 원본은 보존했습니다.');
  validateMaterialResult(body.result);
  return { ...body.result, source: { text: content.sourceText, audio: null, ...(content.documents ? { documents: selectedMaterialDocuments(content.documents) } : {}) } };
}
export async function fetchYouTubeSubtitles(owner: Pick<AppState, 'userId' | 'namespace'>, url: string, signal: AbortSignal): Promise<{ title: string; text: string }> {
  if (!import.meta.env.DEV) throw Error('영상 자막을 자동으로 가져올 연결이 없습니다. SRT·VTT 파일이나 영상의 자막을 붙여 넣어 보관할 수 있습니다.');
  const response = await fetch('/api/study-ai/youtube', { method: 'POST', headers: { ...await ownerAuthHeaders(owner), 'Content-Type': 'application/json' }, body: JSON.stringify({ url }), signal });
  const body = await response.json();
  if (!response.ok) throw Error(body.message || '영상 자막을 가져오지 못했습니다.');
  if (typeof body.title !== 'string' || typeof body.text !== 'string' || body.text.length > 1_000_000) throw Error('영상 자막의 형식을 확인하지 못했습니다.');
  return body;
}
