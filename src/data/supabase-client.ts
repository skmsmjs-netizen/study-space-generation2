import { PUBLIC_SERVER_URL, PUBLIC_SERVER_KEY } from './public-server-config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { DomainError, type Command, type Namespace } from '../domain/model';
import type { OnlineTransport } from './personal-repository';
import type { ServerSnapshot } from '../server/command-handler';
export interface PublicServerConfig { url: string; publishableKey: string }
export function readServerConfig(): PublicServerConfig | null {
  const url = import.meta.env.VITE_SUPABASE_URL || PUBLIC_SERVER_URL;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || PUBLIC_SERVER_KEY;
  return url && publishableKey ? { url, publishableKey } : null;
}
export function createStudyClient(config: PublicServerConfig) {
  if (!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(config.url) || !config.publishableKey.startsWith('sb_publishable_')) throw Error('공개 서버 설정을 확인해 주세요.');
  return createClient(config.url, config.publishableKey, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'study-space:auth:v1' } });
}
export function onlineTransport(client: SupabaseClient, namespace: Namespace = 'personal'): OnlineTransport {
  async function request(action: 'load' | 'execute', command?: Command, baseSequence?: number): Promise<ServerSnapshot> {
    const { data: session, error: authError } = await client.auth.getSession();
    if (authError || !session.session) throw new DomainError('AUTH_REQUIRED', '로그인이 만료되었습니다. 글은 이 기기에 남아 있습니다. 다시 로그인해 주세요.');
    const { data, error } = await client.functions.invoke('study-command', { timeout: 20000, body: { action, namespace, ...(command ? { command, baseSequence } : {}) } });
    if (error) {
      let result: { code?: string; message?: string } = {};
      try { if (error.context instanceof Response) result = await error.context.json(); } catch { /* Keep original drafts on malformed error responses. */ }
      throw new DomainError(result.code ?? 'SERVER_ERROR', result.message ?? '서버에 저장하지 못했습니다. 이 기기의 글을 보존했습니다.');
    }
    const result = data as ServerSnapshot;
    return result;
  }
  return { load: () => request('load'), execute: (command, sequence) => request('execute', command, sequence) };
}
