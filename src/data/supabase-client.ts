import { PUBLIC_SERVER_URL, PUBLIC_SERVER_KEY } from './public-server-config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { DomainError, type Command, type Namespace } from '../domain/model';
import type { OnlineTransport } from './personal-repository';
import type { ServerSnapshot } from '../server/command-handler';
import { loginStorageOptions, readLoginPersistence, saveLoginPersistence } from './auth-session';
import { measureRequest } from './request-performance';
export interface PublicServerConfig { url: string; publishableKey: string }
export function readServerConfig(): PublicServerConfig | null {
  const url = import.meta.env.VITE_SUPABASE_URL || PUBLIC_SERVER_URL;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || PUBLIC_SERVER_KEY;
  return url && publishableKey ? { url, publishableKey } : null;
}
const loginClients = new WeakMap<SupabaseClient, { config: PublicServerConfig; remember: boolean }>();
export function createStudyClient(config: PublicServerConfig, remember = readLoginPersistence()) {
  if (!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(config.url) || !config.publishableKey.startsWith('sb_publishable_')) throw Error('공개 서버 설정을 확인해 주세요.');
  const client = createClient(config.url, config.publishableKey, { auth: { persistSession: true, autoRefreshToken: true, ...loginStorageOptions(remember) } });
  loginClients.set(client, { config, remember });
  return client;
}
export async function signInStudyClient(client: SupabaseClient, credentials: { email: string; password: string }, remember: boolean) {
  const current = loginClients.get(client);
  if (!current) throw Error('로그인 연결을 다시 확인해 주세요.');
  let next: SupabaseClient;
  try { next = current.remember === remember ? client : createStudyClient(current.config, remember); }
  catch { throw new DomainError('AUTH_STORAGE', '로그인 정보를 이 기기에 보관하지 못했습니다. 브라우저의 저장 허용 설정을 확인한 뒤 다시 로그인해 주세요.'); }
  const previousRemember = readLoginPersistence();
  try {
    // Check the chosen storage before transmitting credentials. Never fall back
    // to persistent storage when the user chose a temporary login.
    try {
      const options = loginStorageOptions(remember);
      const storage = options.storage ?? localStorage;
      const probe = `${options.storageKey}:check`;
      storage.setItem(probe, '1'); storage.removeItem(probe);
      saveLoginPersistence(remember);
    } catch { throw new DomainError('AUTH_STORAGE', '로그인 정보를 이 기기에 보관하지 못했습니다. 브라우저의 저장 허용 설정을 확인한 뒤 다시 로그인해 주세요.'); }
    const { error } = await next.auth.signInWithPassword(credentials);
    if (error) throw error;
    if (next !== client) client.auth.dispose();
    return next;
  } catch (error) {
    try { saveLoginPersistence(previousRemember); } catch { /* Keep the original error. */ }
    if (next !== client) next.auth.dispose();
    throw error;
  }
}
export function onlineTransport(client: SupabaseClient, namespace: Namespace = 'personal'): OnlineTransport {
  async function request(action: 'load' | 'execute' | 'execute-batch', command?: Command, baseSequence?: number, known?: ServerSnapshot, commands?: Command[]): Promise<ServerSnapshot> {
    const { data: session, error: authError } = await client.auth.getSession();
    if (authError || !session.session) throw new DomainError('AUTH_REQUIRED', '로그인이 만료되었습니다. 글은 이 기기에 남아 있습니다. 다시 로그인해 주세요.');
    if (known && (known.data.userId !== session.session.user.id || known.data.namespace !== namespace)) throw new DomainError('OWNERSHIP', '이 공간의 자료가 아닙니다.');
    const { data, error } = await client.functions.invoke('study-command', { timeout: 20000, body: { action, namespace, ...(command ? { command, baseSequence } : {}), ...(commands ? { commands, baseSequence } : {}), ...(known ? { knownSequence: known.sequence } : {}) } });
    if (error) {
      let result: { code?: string; message?: string } = {};
      try { if (error.context instanceof Response) result = await error.context.json(); } catch { /* Keep original drafts on malformed error responses. */ }
      throw new DomainError(result.code ?? 'SERVER_ERROR', result.message ?? '서버에 저장하지 못했습니다. 이 기기의 글을 보존했습니다.');
    }
    if (data?.unchanged === true) {
      if (action !== 'load' || !known || data.sequence !== known.sequence || data.userId !== known.data.userId || data.namespace !== namespace || !Array.isArray(data.supportedCommands) || data.supportedCommands.some((value: unknown) => typeof value !== 'string')) throw new DomainError('INVALID_ACK', '서버의 최신 기록을 확인하지 못했습니다. 이 기기의 글은 남아 있습니다.');
      return { ...known, supportedCommands: data.supportedCommands, syncCapabilities: data.syncCapabilities };
    }
    return data as ServerSnapshot;
  }
  async function notificationRequest<T>(body:Record<string,unknown>):Promise<T>{
    const {data:session,error:authError}=await client.auth.getSession();
    if(authError||!session.session)throw new DomainError('AUTH_REQUIRED','내 공부 공간에 다시 로그인해 주세요.');
    const {data,error}=await client.functions.invoke('study-notifications',{timeout:20000,body});
    if(error){let message='알림 서버에 연결하지 못했습니다. 다시 시도해 주세요.';try{if(error.context instanceof Response){const result=await error.context.json();if(typeof result.message==='string')message=result.message;}}catch{/* Preserve the subscription state. */}throw Error(message);}
    return data as T;
  }
  return {
    scheduleNotifications:namespace==='personal'?{
      config:()=>notificationRequest<{publicKey:string}>({action:'config'}),
      subscribe:subscription=>notificationRequest<void>({action:'subscribe',subscription}),
      unsubscribe:endpoint=>notificationRequest<void>({action:'unsubscribe',endpoint}),
      status:endpoint=>notificationRequest<{enabled:boolean}>({action:'status',endpoint}),
    }:undefined,
    load: known => measureRequest('sync-load', () => request('load', undefined, undefined, known)),
    execute: (command, sequence) => measureRequest('sync-execute', () => request('execute', command, sequence)),
    executeBatch: (commands, sequence) => measureRequest('sync-batch', () => request('execute-batch', undefined, sequence, undefined, commands)),
    runCode: async (content, signal) => {
      const { data: session, error: authError } = await client.auth.getSession();
      if (authError || !session.session) throw new DomainError('AUTH_REQUIRED', '코드를 실행하려면 내 공부 공간에 다시 로그인해 주세요.');
      const { data, error } = await client.functions.invoke('study-code-runner', { body: content, signal, timeout: 40000 });
      if (error) {
        let result: { code?: string; message?: string } = {};
        try { if (error.context instanceof Response) result = await error.context.json(); } catch { /* Preserve the original source on an unavailable response. */ }
        throw new DomainError(result.code ?? 'COMPILER_UNAVAILABLE', result.message ?? '컴파일 서버에 연결하지 못했습니다. 코드와 설명은 유지했습니다.');
      }
      return data;
    },
  };
}
