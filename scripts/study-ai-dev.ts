import { requireOwnerAI } from '../src/domain/ai-access.ts';
import type { Plugin } from 'vite';
import { handleStudyAI, aiResponse } from '../src/server/study-ai.ts';
import { generateGPTMaterial } from '../src/server/gpt-material.ts';
import { generateGPTTopicMemory, handleTopicMemoryAI } from '../src/server/gpt-topic-memory.ts';
import { DomainError } from '../src/domain/model.ts';
import { PUBLIC_SERVER_URL, PUBLIC_SERVER_KEY } from '../src/data/public-server-config.ts';
import { createChatGPT, type ChatGPTModel } from './vendor/siwc-local/index.ts';
import { keychainEncryption } from './chatgpt-encryption.ts';
import { readGPTModel, saveGPTModel } from './gpt-model-preference.ts';
import { TOPIC_MEMORY_WAIT_MS } from '../src/domain/topic-memory.ts';
import { youtubeSubtitles } from './material-youtube.ts';

export async function authenticateAIOwner(token: string | undefined, signal?: AbortSignal) {
  if (!token?.startsWith('Bearer '))
    throw new DomainError('AUTH_REQUIRED', '개인 공간에 다시 로그인해 주세요.');
  const auth = await fetch(`${PUBLIC_SERVER_URL}/auth/v1/user`, {
    signal,
    headers: { apikey: PUBLIC_SERVER_KEY, Authorization: token },
  });
  if (!auth.ok) throw new DomainError('AUTH_REQUIRED', '로그인이 만료되었습니다.');
  const identity = { userId: (await auth.json()).id, namespace: 'personal' as const };
  requireOwnerAI(identity);
  const access = await fetch(`${PUBLIC_SERVER_URL}/functions/v1/study-command`, {
    signal,
    method: 'POST',
    headers: {
      apikey: PUBLIC_SERVER_KEY,
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'access' }),
  });
  if (!access.ok || (await access.json()).status !== 'approved')
    throw new DomainError('ACCESS_DENIED', '승인된 개인 공간에서 GPT를 이용할 수 있습니다.');
  return identity;
}
export function gptFailure(error: unknown): DomainError {
  if (error instanceof DomainError) return error;
  const code =
    error && typeof error === 'object' && 'code' in error ? String(error.code) : 'AI_ERROR';
  const message = code.includes('usage_limit')
    ? 'ChatGPT 포함 사용량 한도에 도달했습니다. 사용량 설정에서 확인하고 한도가 돌아온 뒤 다시 요청해 주세요.'
    : code.includes('unavailable')
      ? 'ChatGPT 사용 가능 여부를 확인하지 못했습니다. 자동으로 재시도하지 않았습니다.'
      : ['sign_in_required', 'sharing_not_enabled', 'reauth_required'].includes(code)
        ? 'ChatGPT를 연결하고 구독 사용 권한을 허용해 주세요.'
        : code === 'credential_encryption_unavailable'
          ? 'Mac 키체인에 접근할 수 없습니다. 키체인 연결을 확인해 주세요.'
          : code.includes('storage')
            ? '보관한 ChatGPT 연결을 읽지 못했습니다. 연결 정보를 덮어쓰지 않았습니다.'
            : code.includes('eligible') || code.includes('authorized') || code.includes('admission')
              ? '이 ChatGPT 계정의 앱 연결 권한을 확인해 주세요. 별도 유료 경로는 사용하지 않습니다.'
              : 'ChatGPT 처리를 마치지 못했습니다. 원본은 보존했습니다. 연결과 사용량을 확인한 뒤 다시 요청해 주세요.';
  return new DomainError(code, message);
}

/** Personal local runtime only. No API-key fallback and no remote-origin bridge. */
export function localStudyAIPlugin(options: { temporaryCredits?: { expiresAt: number; maxCalls: number } } = {}): Plugin {
  const temporary = options.temporaryCredits;
  let temporaryCreditsRemaining = temporary && Number.isInteger(temporary.maxCalls) && temporary.maxCalls > 0 && temporary.maxCalls <= 3 && temporary.expiresAt > Date.now() && temporary.expiresAt <= Date.now() + 3600_000 ? temporary.maxCalls : 0;
  let temporaryCreditsProfile = '';
  let busy = false,
    connecting = false,
    connectionError = '',
    model = '';
  let models: ChatGPTModel[] = [];
  let catalogProfile = '',
    catalogFlight: Promise<void> | undefined;
  let creditConfirmation: { profileId: string; at: number } | undefined;
  let callbackApproval: (() => Promise<void>) | undefined;
  let browserURL: ((url: string) => void) | undefined;
  const use = new Map<string, number[]>();
  const chatgpt = createChatGPT({
    appName: 'Study Space',
    appId: 'study-space-chatgpt',
    redirectPort: 0,
    sendHostId: true,
    credentialEncryption: keychainEncryption(),
    async beforeCredentialChange() {
      if (!callbackApproval)
        throw new DomainError('AUTH_REQUIRED', '이 앱에서 다시 연결해 주세요.');
      await callbackApproval();
    },
    openBrowser(url) {
      if (!browserURL) throw Error('No active owner connection');
      browserURL(url);
    },
  });
  async function status() {
    const session = await chatgpt.getSession();
    if (
      session.status === 'connected' &&
      session.sharing &&
      session.profileId &&
      catalogProfile !== session.profileId &&
      !connecting
    ) {
      if (!catalogFlight)
        catalogFlight = (async () => {
          const available = await chatgpt.listModels();
          const preferred = await readGPTModel(session.profileId!);
          models = available;
          model = available.some((row) => row.slug === preferred)
            ? preferred!
            : (available[0]?.slug ?? '');
          catalogProfile = session.profileId!;
        })().finally(() => {
          catalogFlight = undefined;
        });
      await catalogFlight;
    }
    const creditsConfirmed = Boolean(
      creditConfirmation &&
      creditConfirmation.profileId === session.profileId &&
      Date.now() - creditConfirmation.at < 3600_000,
    );
    if (temporaryCreditsRemaining && !temporaryCreditsProfile && session.profileId) temporaryCreditsProfile = session.profileId;
    const temporaryCreditsAllowed = Boolean(temporary && temporaryCreditsRemaining > 0 && Date.now() < temporary.expiresAt && temporaryCreditsProfile === session.profileId);
    return {
      configured: session.status === 'connected' && session.sharing,
      local: true,
      provider: 'chatgpt',
      model,
      models,
      session,
      connecting,
      connectionError,
      creditsConfirmed,
      temporaryCreditsAllowed,
      temporaryCreditsRemaining: temporaryCreditsAllowed ? temporaryCreditsRemaining : 0,
      temporaryCreditsExpiresAt: temporaryCreditsAllowed ? temporary!.expiresAt : undefined,
      transcription: false,
    };
  }
  async function requirePlan() {
    const state = await status();
    if (!state.configured || connecting)
      throw new DomainError(
        'GPT_CONNECTION_REQUIRED',
        'GPT 연결에서 ChatGPT로 로그인하고 구독 사용 권한을 허용해 주세요.',
      );
    if (!state.creditsConfirmed && !state.temporaryCreditsAllowed)
      throw new DomainError(
        'CREDITS_CONFIRMATION_REQUIRED',
        'ChatGPT 사용량 설정에서 추가 크레딧 사용 허용이 꺼져 있는지 확인한 뒤 GPT 연결에 표시해 주세요.',
      );
    if (!model || !models.some((row) => row.slug === model))
      throw new DomainError('AI_MODEL', 'GPT 연결에서 사용할 모델을 불러와 선택해 주세요.');
    return state;
  }
  return {
    name: 'study-ai-local',
    apply: 'serve',
    configureServer(server) {
      if (server.config?.isProduction || server.config?.mode === 'production') temporaryCreditsRemaining = 0;
      server.httpServer?.once('close', () => chatgpt.cancelSignIn());
      server.middlewares.use('/api/study-ai', async (request, response) => {
        const generation = new AbortController();
        const topicRequest = request.url === '/topic-memory';
        const deadline = topicRequest ? setTimeout(() => generation.abort(new DOMException('Memory generation deadline', 'TimeoutError')), TOPIC_MEMORY_WAIT_MS) : undefined;
        response.once('finish', () => clearTimeout(deadline));
        response.once('close', () => {
          clearTimeout(deadline);
          if (!response.writableEnded) generation.abort();
        });
        const send = async (result: Response) => {
          if (response.destroyed) return;
          response.statusCode = result.status;
          result.headers.forEach((value, key) => {
            if (!key.toLowerCase().startsWith('access-control-')) response.setHeader(key, value);
          });
          response.end(await result.text());
        };
        try {
          const host = request.headers.host ?? '',
            origin = request.headers.origin;
          const local =
            /^127\.0\.0\.1:\d+$/.test(host) &&
            ['127.0.0.1', '::ffff:127.0.0.1'].includes(request.socket.remoteAddress ?? '');
          if (!local || (origin !== `http://${host}` && !(request.method === 'GET' && !origin)))
            throw new DomainError('ACCESS_DENIED', '이 Mac의 앱 화면에서 GPT를 연결해 주세요.');
          const token = request.headers.authorization;
          const identity = await authenticateAIOwner(token, topicRequest ? generation.signal : undefined);
          if (request.method === 'GET' && request.url === '/status') {
            await send(aiResponse(await status()));
            return;
          }
          if (request.method !== 'POST') {
            await send(aiResponse({ message: '지원하지 않는 요청입니다.' }, 405));
            return;
          }
          if (request.url === '/youtube') {
            let raw = '';
            for await (const chunk of request) { raw += chunk; if (raw.length > 3000) throw new DomainError('INVALID_REQUEST', '영상 주소를 확인해 주세요.'); }
            const body = JSON.parse(raw);
            if (typeof body.url !== 'string') throw new DomainError('INVALID_REQUEST', '영상 주소를 넣어 주세요.');
            if (busy) throw new DomainError('RATE_LIMIT', '진행 중인 처리를 먼저 마쳐 주세요.');
            busy = true;
            try { await send(aiResponse(await youtubeSubtitles(body.url, generation.signal))); }
            finally { busy = false; }
            return;
          }
          if (request.url === '/connect') {
            if (busy || connecting)
              throw new DomainError('RATE_LIMIT', '진행 중인 연결이나 정리를 먼저 마쳐 주세요.');
            connecting = true;
            connectionError = '';
            creditConfirmation = undefined;
            models = [];
            catalogProfile = '';
            model = '';
            callbackApproval = async () => {
              await authenticateAIOwner(token);
            };
            let resolveURL!: (value: string) => void, rejectURL!: (error: unknown) => void;
            const url = new Promise<string>((resolve, reject) => {
              resolveURL = resolve;
              rejectURL = reject;
            });
            browserURL = resolveURL;
            void chatgpt
              .signIn({ reconsent: true })
              .catch((error) => {
                connectionError = gptFailure(error).message;
                rejectURL(error);
              })
              .finally(() => {
                connecting = false;
                browserURL = undefined;
                callbackApproval = undefined;
              });
            await send(aiResponse({ authorizationURL: await url }));
            return;
          }
          if (request.url === '/cancel-connect') {
            chatgpt.cancelSignIn();
            await send(aiResponse({ cancelled: true }));
            return;
          }
          if (request.url === '/disconnect') {
            if (busy) throw new DomainError('RATE_LIMIT', '진행 중인 정리를 먼저 마쳐 주세요.');
            temporaryCreditsRemaining = 0;
            creditConfirmation = undefined;
            models = [];
            catalogProfile = '';
            model = '';
            await chatgpt.disconnect();
            await send(aiResponse(await status()));
            return;
          }
          if (request.url === '/models') {
            if (connecting || busy)
              throw new DomainError('RATE_LIMIT', '진행 중인 연결이나 정리를 먼저 마쳐 주세요.');
            models = await chatgpt.listModels();
            model = models.some((row) => row.slug === model) ? model : (models[0]?.slug ?? '');
            await send(aiResponse(await status()));
            return;
          }
          if (request.url === '/settings') {
            let raw = '';
            for await (const chunk of request) {
              raw += chunk;
              if (raw.length > 2000)
                throw new DomainError('INVALID_REQUEST', '설정을 확인해 주세요.');
            }
            const body = JSON.parse(raw),
              session = await chatgpt.getSession();
            if (busy || connecting || !session.sharing || !session.profileId)
              throw new DomainError('GPT_CONNECTION_REQUIRED', 'ChatGPT 연결을 먼저 마쳐 주세요.');
            if (typeof body.model !== 'string' || !models.some((row) => row.slug === body.model))
              throw new DomainError('AI_MODEL', '이 연결에서 조회한 GPT 모델을 선택해 주세요.');
            await saveGPTModel(session.profileId, body.model);
            model = body.model;
            creditConfirmation =
              body.creditsDisabled === true
                ? { profileId: session.profileId, at: Date.now() }
                : undefined;
            await send(aiResponse(await status()));
            return;
          }
          const topicMemory = request.url === '/topic-memory';
          if (!topicMemory && request.url !== '' && request.url !== '/') {
            await send(aiResponse({ message: '요청 주소를 확인해 주세요.' }, 404));
            return;
          }
          // Confirm plan/credit constraints before receiving any source bytes.
          await requirePlan();
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of request) {
            size += chunk.length;
            if (size > (topicMemory ? 150_000 : 55_000_000))
              throw new DomainError(
                'TOO_LARGE',
                topicMemory ? '주제를 나누어 출제해 주세요.' : '음성은 50MB 이하로 넣어 주세요.',
              );
            chunks.push(Buffer.from(chunk));
          }
          const headers = new Headers();
          for (const [key, value] of Object.entries(request.headers))
            if (typeof value === 'string') headers.set(key, value);
          const webRequest = new Request(`http://${host}/api/study-ai`, {
            method: 'POST',
            headers,
            body: new Uint8Array(Buffer.concat(chunks)),
          });
          if (topicMemory) {
            await send(
              await handleTopicMemoryAI(webRequest, {
                async authorize() {
                  return identity;
                },
                async reserve(userId) {
                  await requirePlan();
                  const now = Date.now(),
                    recent = (use.get(userId) ?? []).filter((at) => now - at < 3600_000);
                  if (busy || recent.length >= 20)
                    throw new DomainError(
                      'RATE_LIMIT',
                      'GPT 처리 중 또는 이 앱의 사용 한도에 도달했습니다. 잠시 후 직접 다시 요청해 주세요.',
                    );
                  busy = true;
                  use.set(userId, [...recent, now]);
                },
                async generate(input) {
                  try {
                    return await generateGPTTopicMemory(input, {
                      runtime: chatgpt,
                      // Keep the shared explicit model preference unchanged. Memory drafts prefer the
                      // account-listed lightweight Luna model; never invent a model or retry another.
                      model: models.find((row) => /(?:^|[-_])luna(?:$|[-_])/i.test(row.slug))?.slug || model,
                      signal: generation.signal,
                      async beforeInference() {
                        generation.signal.throwIfAborted();
                        await authenticateAIOwner(token, generation.signal);
                        const state = await requirePlan();
                        if (!state.creditsConfirmed) temporaryCreditsRemaining -= 1;
                        generation.signal.throwIfAborted();
                      },
                    });
                  } catch (error) {
                    throw gptFailure(error);
                  } finally {
                    busy = false;
                  }
                },
              }),
            );
            return;
          }
          await send(
            await handleStudyAI(webRequest, {
              async authorize() {
                return identity;
              },
              async reserve(userId) {
                await requirePlan();
                const now = Date.now(),
                  recent = (use.get(userId) ?? []).filter((at) => now - at < 3600_000);
                if (busy || recent.length >= 20)
                  throw new DomainError(
                    'RATE_LIMIT',
                    'GPT 처리 중 또는 이 앱의 사용 한도에 도달했습니다. 잠시 후 직접 다시 요청해 주세요.',
                  );
                busy = true;
                use.set(userId, [...recent, now]);
              },
              async generate(input) {
                try {
                  return await generateGPTMaterial(input, {
                    runtime: chatgpt,
                    model,
                    signal: generation.signal,
                    async beforeInference() {
                      await authenticateAIOwner(token);
                      const state = await requirePlan();
                      if (!state.creditsConfirmed) temporaryCreditsRemaining -= 1;
                    },
                  });
                } catch (error) {
                  throw gptFailure(error);
                } finally {
                  busy = false;
                }
              },
            }),
          );
        } catch (error) {
          const failure = gptFailure(error);
          await send(
            aiResponse(
              { code: failure.code, message: failure.message },
              ['AI_OWNER_REQUIRED', 'ACCESS_DENIED'].includes(failure.code)
                ? 403
                : failure.code === 'AUTH_REQUIRED'
                  ? 401
                  : failure.code === 'RATE_LIMIT' || failure.code.includes('usage_limit')
                    ? 429
                    : 400,
            ),
          );
        }
      });
    },
  };
}
