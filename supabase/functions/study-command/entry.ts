// Bundled with the exact same domain rules used by the web app.
import { packServerState, unpackServerState } from '../../../src/server/state-codec';
import { handleCommand } from '../../../src/server/command-handler';
import { DomainError, type AppState, type Command, type Namespace } from '../../../src/domain/model';
declare const Deno: { env: { get(key: string): string | undefined }; serve(handler: (request: Request) => Promise<Response>): void };
const url = Deno.env.get('SUPABASE_URL')!;
const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
async function admin(path: string, options: RequestInit = {}) {
  const response = await fetch(`${url}/rest/v1/${path}`, { ...options, headers: { apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json', ...options.headers } });
  const result = await response.json();
  if (!response.ok) throw new DomainError(result.message?.includes('VERSION_CONFLICT') ? 'VERSION_CONFLICT' : 'SERVER_ERROR', '서버에서 저장을 승인하지 않았습니다. 원문을 보존했습니다.');
  return result;
}
Deno.serve(request => handleCommand(request, {
  async authenticate(token: string) {
    const response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anon, Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new DomainError('AUTH_REQUIRED', '로그인이 만료되었습니다. 작성 내용을 보존하고 다시 로그인해 주세요.');
    return (await response.json()).id;
  },
  async read(userId: string, namespace: Namespace) {
    const rows = await admin(`study_workspaces?user_id=eq.${encodeURIComponent(userId)}&namespace=eq.${namespace}&select=sequence,state`);
    return rows.length ? { sequence: rows[0].sequence, data: unpackServerState(rows[0].state) } : null;
  },
  async commit(userId: string, namespace: Namespace, base: number, command: Command, next: AppState) {
    const saved = await admin('rpc/study_commit', { method: 'POST', body: JSON.stringify({ p_user: userId, p_namespace: namespace, p_base: base, p_operation: command.opId, p_payload: next.appliedOps[command.opId], p_state: packServerState(next, command.opId) }) });
    return { sequence: saved.sequence, data: unpackServerState(saved.data) };
  },
}));
