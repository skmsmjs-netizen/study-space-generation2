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
import { readAudio } from './material-files';
import { documentSegments, selectedMaterialDocuments } from '../domain/material-source';
import { REMOTE_AI_APPROVAL_MESSAGE } from '../domain/ai-connection';
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
export async function generateStudyMaterial(
  owner: Pick<AppState, 'userId' | 'namespace'>,
  content: MaterialContent,
  cardCount: number,
  signal?: AbortSignal,
): Promise<MaterialResult> {
  requireOwnerAI(owner);
  const request = activeStudyAIRequest(content.aiRequest);
  const cachedAudio = content.audio ? [...content.results].reverse().find(r => r.source?.audio?.sha256 === content.audio?.sha256)?.segments.filter(s => s.start !== null && !s.label) ?? [] : [];
  validateStudyAIRequest(request);
  const plan = planMaterialRanges(content, request);
  const divided = plan.batches.length > 1;
  if (divided && content.audio && !cachedAudio.length) throw Error('긴 자료와 음성은 먼저 받아쓰기 내용을 확인한 뒤 필기로 추가해 범위별로 생성해 주세요. 원본은 유지했습니다.');
  const index = content.generationProgress?.sourceIdentity === plan.sourceIdentity ? content.generationProgress.index : 0;
  if (divided && !plan.batches[index]) throw Error('현재 원문에서 사용할 처리 범위를 다시 선택해 주세요.');
  const segments = divided ? plan.batches[index] : [...documentSegments(content.documents), ...structuredClone(cachedAudio)];
  const extra = ['problem','attempt','reference','focus'].reduce((n, key) => n + (request[key as 'problem'|'attempt'|'reference'|'focus']?.length ?? 0), 0);
  if ((divided ? 0 : content.sourceText.length) + segments.reduce((n, b) => n + b.text.length, 0) + extra > 150_000) throw Error('선택한 원문과 추가 질문의 범위를 나누어 주세요. 원본은 유지했습니다.');
  const connection = await localAIStatus(owner);
  if (!connection.local) throw Error(connection.connectionError || 'ChatGPT 연결을 확인하지 못했습니다. 원본은 보관했습니다.');
  if (!connection.configured)
    throw Error('GPT 연결에서 ChatGPT로 로그인해 주세요. 원본은 보관했습니다.');
  if (!connection.creditsConfirmed)
    throw Error('GPT 연결에서 추가 크레딧 사용 허용이 꺼져 있음을 확인해 주세요.');
  if (!connection.model) throw Error('GPT 연결에서 사용할 모델을 불러와 주세요.');
  if (content.audio && !cachedAudio.length && !connection.transcription)
    throw Error('이 Mac의 받아쓰기 도구를 연결해 주세요. 원본 음성은 보관했습니다.');
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
  if (content.audio && !cachedAudio.length) {
    const blob = await readAudio(owner, content.audio);
    if (!blob) throw Error('이 기기에 원본 음성이 없습니다. 같은 파일을 다시 가져와 주세요.');
    form.set('audio', blob, content.audio.name);
  }
  const headers = await ownerAuthHeaders(owner);
  const url = '/api/study-ai';
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
  return { ...body.result, source: { text: content.sourceText, audio: content.audio, ...(content.documents ? { documents: selectedMaterialDocuments(content.documents) } : {}) } };
}
export async function fetchYouTubeSubtitles(owner: Pick<AppState, 'userId' | 'namespace'>, url: string, signal: AbortSignal): Promise<{ title: string; text: string }> {
  if (!import.meta.env.DEV) throw Error('영상 자막을 자동으로 가져올 연결이 없습니다. SRT·VTT 파일이나 영상의 자막을 붙여 넣어 보관할 수 있습니다.');
  const response = await fetch('/api/study-ai/youtube', { method: 'POST', headers: { ...await ownerAuthHeaders(owner), 'Content-Type': 'application/json' }, body: JSON.stringify({ url }), signal });
  const body = await response.json();
  if (!response.ok) throw Error(body.message || '영상 자막을 가져오지 못했습니다.');
  if (typeof body.title !== 'string' || typeof body.text !== 'string' || body.text.length > 1_000_000) throw Error('영상 자막의 형식을 확인하지 못했습니다.');
  return body;
}
