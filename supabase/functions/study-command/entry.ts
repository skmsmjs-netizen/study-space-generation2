// Bundled with the exact same domain rules used by the web app.
import { packServerState, unpackServerState } from '../../../src/server/state-codec';
import { handleCommand } from '../../../src/server/command-handler';
import { DomainError, type AppState, type Command, type Namespace } from '../../../src/domain/model';
import type { AccountAccess, AccountPage, AccessStatus } from '../../../src/server/account-access';
declare const Deno: { env: { get(key: string): string | undefined }; serve(handler: (request: Request) => Promise<Response>): void };
const url = Deno.env.get('SUPABASE_URL')!;
const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
async function admin(path: string, options: RequestInit = {}) {
  const response = await fetch(`${url}/rest/v1/${path}`, { ...options, headers: { apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json', ...options.headers } });
  const result = await response.json();
  if (!response.ok) {
    const code = ['ACCESS_DENIED','ADMIN_REQUIRED','ADMIN_PROTECTED','ACCESS_CONFLICT','VERSION_CONFLICT','EMAIL_UNCONFIRMED'].find(code => result.message?.includes(code)) ?? 'SERVER_ERROR';
    const message = code === 'ACCESS_DENIED' ? '관리자 승인이 필요하거나 이용이 중지되어 있습니다. 작성 내용은 이 기기에 남아 있습니다.' : code === 'ACCESS_CONFLICT' ? '계정 상태가 변경되었습니다. 목록을 다시 불러와 주세요.' : code === 'EMAIL_UNCONFIRMED' ? '이메일 확인이 끝난 계정만 승인할 수 있습니다.' : '서버에서 변경을 승인하지 않았습니다. 원문을 보존했습니다.';
    throw new DomainError(code, message);
  }
  return result;
}
Deno.serve(request => handleCommand(request, {
  async authenticate(token: string) {
    const response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anon, Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new DomainError('AUTH_REQUIRED', '로그인이 만료되었습니다. 작성 내용을 보존하고 다시 로그인해 주세요.');
    return (await response.json()).id;
  },
  async access(userId: string): Promise<AccountAccess> {
    return admin('rpc/study_account_access', { method: 'POST', body: JSON.stringify({ p_user: userId }) });
  },
  async listAccounts(actor: string, cursor: string | null): Promise<AccountPage> {
    return admin('rpc/study_list_accounts', { method: 'POST', body: JSON.stringify({ p_actor: actor, p_cursor: cursor }) });
  },
  async setAccountAccess(actor: string, target: string, status: AccessStatus, version: number) {
    await admin('rpc/study_set_account_access', { method: 'POST', body: JSON.stringify({ p_actor: actor, p_target: target, p_status: status, p_version: version }) });
  },
  async read(userId: string, namespace: Namespace) {
    const row = await admin('rpc/study_read_workspace', { method: 'POST', body: JSON.stringify({ p_user: userId, p_namespace: namespace }) });
    return row ? { sequence: row.sequence, data: unpackServerState(row.state) } : null;
  },
  async commit(userId: string, namespace: Namespace, base: number, command: Command, next: AppState) {
    const saved = await admin('rpc/study_commit', { method: 'POST', body: JSON.stringify({ p_user: userId, p_namespace: namespace, p_base: base, p_operation: command.opId, p_payload: next.appliedOps[command.opId], p_state: packServerState(next, command.opId) }) });
    return { sequence: saved.sequence, data: unpackServerState(saved.data) };
  },
}));
