import {
  FunctionsFetchError,
  FunctionsRelayError,
  isAuthError,
  isAuthRetryableFetchError,
  type FunctionInvokeOptions,
  type Session,
  type SupabaseClient,
} from '@supabase/supabase-js';
import { DomainError } from '../domain/model';
import { isStorageQuotaError } from './storage-errors';

const authMessage = '로그인이 만료되었습니다. 이 기기의 글은 남아 있습니다. 다시 로그인해 주세요.';
const refreshes = new WeakMap<SupabaseClient, Promise<Session>>();

async function authFailure(error: unknown): Promise<unknown> {
  if (error instanceof DomainError || isStorageQuotaError(error)) return error;
  if (isAuthRetryableFetchError(error)) {
    return error.status && error.status >= 500
      ? new DomainError('SERVER_UNAVAILABLE', '로그인 서버가 잠시 응답하지 않습니다. 이 기기의 글은 남아 있습니다. 잠시 후 다시 시도해 주세요.')
      : new DomainError('NETWORK_ERROR', '로그인 서버에 연결하지 못했습니다. 이 기기의 글은 남아 있습니다. 인터넷 연결을 확인해 주세요.');
  }
  if (isAuthError(error)) return new DomainError('AUTH_REQUIRED', authMessage);
  if (error instanceof TypeError || (error instanceof Error && ['AbortError', 'TimeoutError'].includes(error.name))) return requestError(error);
  return error;
}

async function currentSession(client: SupabaseClient, owner?: string): Promise<Session> {
  let result: Awaited<ReturnType<SupabaseClient['auth']['getSession']>>;
  try { result = await client.auth.getSession(); }
  catch (error) { throw await authFailure(error); }
  if (result.error) throw await authFailure(result.error);
  if (!result.data.session) throw new DomainError('AUTH_REQUIRED', authMessage);
  if (owner && result.data.session.user.id !== owner) throw new DomainError('OWNERSHIP', '로그인한 계정이 바뀌었습니다. 이전 계정의 글은 그대로 남아 있습니다.');
  return result.data.session;
}

async function refreshSession(client: SupabaseClient): Promise<Session> {
  let pending = refreshes.get(client);
  if (!pending) {
    pending = (async () => {
      try {
        const { data, error } = await client.auth.refreshSession();
        if (error) throw error;
        if (!data.session) throw new DomainError('AUTH_REQUIRED', authMessage);
        return data.session;
      } catch (error) { throw await authFailure(error); }
    })();
    refreshes.set(client, pending);
  }
  try { return await pending; }
  finally { if (refreshes.get(client) === pending) refreshes.delete(client); }
}

function errorResponse(error: unknown, response?: Response): Response | undefined {
  if (response instanceof Response) return response;
  if (error && typeof error === 'object' && 'context' in error && error.context instanceof Response) return error.context;
  return undefined;
}

async function requestError(error: unknown, response?: Response): Promise<unknown> {
  const cause = error instanceof FunctionsFetchError ? error.context : error;
  if (cause instanceof DomainError || isStorageQuotaError(cause)) return cause;
  const status = response?.status;
  if (status === 401) return new DomainError('AUTH_REQUIRED', authMessage);
  const result: { code?: string; message?: string } = {};
  try {
    const body: unknown = await response?.clone().json();
    if (body && typeof body === 'object') {
      if ('code' in body && typeof body.code === 'string') result.code = body.code;
      if ('message' in body && typeof body.message === 'string') result.message = body.message;
    }
  } catch { /* A gateway HTML response must not replace the local original. */ }
  if (status === 403) return new DomainError(result.code ?? 'ACCESS_DENIED', result.message ?? '이 계정에는 접근 권한이 없습니다. 이 기기의 글은 남아 있습니다.');
  if (status === 408 || status === 504 || (cause && typeof cause === 'object' && 'name' in cause && (cause.name === 'AbortError' || cause.name === 'TimeoutError'))) {
    return new DomainError('REQUEST_TIMEOUT', '서버 응답을 기다리는 시간이 길어졌습니다. 이 기기의 글은 남아 있으며, 다시 연결되면 서버 저장 여부부터 확인합니다.');
  }
  if (error instanceof FunctionsFetchError || (!response && error instanceof TypeError)) return new DomainError('NETWORK_ERROR', '서버에 연결하지 못했습니다. 이 기기의 글은 남아 있습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.');
  if ((status && status >= 500) || error instanceof FunctionsRelayError) return new DomainError(result.code ?? 'SERVER_UNAVAILABLE', result.message ?? '서버가 잠시 응답하지 않습니다. 이 기기의 글은 남아 있습니다. 잠시 후 다시 시도해 주세요.');
  return new DomainError(result.code ?? 'SERVER_ERROR', result.message ?? '서버 요청을 완료하지 못했습니다. 이 기기의 글은 남아 있습니다. 다시 시도해 주세요.');
}

/** Retry only a confirmed authentication rejection; ambiguous writes need receipt reconciliation. */
export async function invokeAuthenticatedFunction<T>(client: SupabaseClient, name: string, options: FunctionInvokeOptions, policy: { expectedOwner?: string; allowSignedOutAfterSuccess?: boolean } = {}): Promise<T> {
  const original = await currentSession(client, policy.expectedOwner);
  const owner = original.user.id;
  let session = original;
  for (let attempt = 0; attempt < 2; attempt++) {
    let result: { data: T | null; error: unknown; response?: Response };
    // Bind the mutation to the checked account even if the SDK observes a
    // different login while preparing its fetch. HTTP header names ignore case.
    const headers = Object.fromEntries(Object.entries(options.headers ?? {}).filter(([key]) => key.toLowerCase() !== 'authorization'));
    headers.Authorization = `Bearer ${session.access_token}`;
    try { result = await client.functions.invoke<T>(name, { ...options, headers }); }
    catch (error) { throw await requestError(error, errorResponse(error)); }
    if (!result.error) {
      // An old account's response cannot enter a newly signed-in account's UI.
      try { await currentSession(client, owner); }
      catch (error) {
        // A confirmed account withdrawal can legitimately invalidate its own session.
        if (!policy.allowSignedOutAfterSuccess || !(error instanceof DomainError) || error.code !== 'AUTH_REQUIRED') throw error;
      }
      return result.data as T;
    }
    const response = errorResponse(result.error, result.response);
    if (response?.status !== 401 || attempt > 0) throw await requestError(result.error, response);
    const latest = await currentSession(client, owner);
    // Another concurrent request or the SDK may already have refreshed this token.
    if (!original.access_token || latest.access_token === original.access_token) {
      const refreshed = await refreshSession(client);
      if (refreshed.user.id !== owner) throw new DomainError('OWNERSHIP', '로그인한 계정이 바뀌었습니다. 이전 계정의 글은 그대로 남아 있습니다.');
    }
    session = await currentSession(client, owner);
    // Pin this checked token for the retry; retain the exact body/opIds and region.
  }
  throw new DomainError('AUTH_REQUIRED', authMessage);
}
