// Bundled with the exact same domain rules used by the web app.
import { packServerState, unpackServerState } from '../../../src/server/state-codec';
import { handleCommand } from '../../../src/server/command-handler';
import { DomainError, type AppState, type Command, type Namespace } from '../../../src/domain/model';
import type { AccountAccess, AccountPage, AccessStatus } from '../../../src/server/account-access';
import { withdrawAccountFiles } from '../../../src/server/account-withdrawal';
import { handleWithdrawalStatus } from '../../../src/server/withdrawal-status';
declare const Deno: { env: { get(key: string): string | undefined }; serve(handler: (request: Request) => Promise<Response>): void };
const url = Deno.env.get('SUPABASE_URL')!;
const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
async function admin(path: string, options: RequestInit = {}) {
  const response = await fetch(`${url}/rest/v1/${path}`, { ...options, headers: { apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json', ...options.headers } });
  // PostgREST returns 204 for a successful void RPC. The permission change
  // has already committed; an empty response must not become a save failure.
  const result = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const code = ['ACCESS_DENIED','ADMIN_REQUIRED','ADMIN_PROTECTED','ACCESS_CONFLICT','VERSION_CONFLICT','EMAIL_UNCONFIRMED','NAME_REQUIRED','LAST_ADMIN','AUTH_REQUIRED'].find(code => result.message?.includes(code)) ?? 'SERVER_ERROR';
    const message = code === 'LAST_ADMIN' ? '현재 유일한 관리자입니다. 다른 관리자에게 권한을 넘긴 뒤 탈퇴할 수 있습니다.' : code === 'NAME_REQUIRED' ? '이름을 1~80자로 입력해 주세요.' : code === 'ACCESS_DENIED' ? '관리자 승인이 필요하거나 이용이 중지되어 있습니다. 작성 내용은 이 기기에 남아 있습니다.' : code === 'ACCESS_CONFLICT' ? '계정 상태가 변경되었습니다. 목록을 다시 불러와 주세요.' : code === 'EMAIL_UNCONFIRMED' ? '이메일 확인이 끝난 계정만 승인할 수 있습니다.' : '서버에서 변경을 승인하지 않았습니다. 원문을 보존했습니다.';
    throw new DomainError(code, message);
  }
  return result;
}
Deno.serve(request => new URL(request.url).pathname.endsWith('/withdrawal-status')
  ? handleWithdrawalStatus(request, requestId => admin('rpc/study_withdrawal_status', { method: 'POST', body: JSON.stringify({ p_request: requestId }) }))
  : handleCommand(request, {
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
  async setAccountName(userId: string, name: string): Promise<AccountAccess> {
    return admin('rpc/study_set_account_name', { method: 'POST', body: JSON.stringify({ p_user: userId, p_name: name }) });
  },
  async withdrawAccount(userId: string, requestId = crypto.randomUUID()) {
    return withdrawAccountFiles({
      begin: (id, receipt) => admin('rpc/study_begin_withdrawal', { method: 'POST', body: JSON.stringify({ p_user: id, p_request: receipt }) }),
      batch: id => admin('rpc/study_withdraw_storage_batch', { method: 'POST', body: JSON.stringify({ p_user: id }) }),
      finish: async id => { await admin('rpc/study_withdraw_account', { method: 'POST', body: JSON.stringify({ p_user: id }) }); },
      async remove(bucket, names) {
        const response = await fetch(`${url}/storage/v1/object/${encodeURIComponent(bucket)}`, {
          method: 'DELETE', headers: { apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ prefixes: names }), signal: AbortSignal.timeout(12000),
        });
        if (!response.ok) throw new DomainError('SERVER_ERROR', '첨부 파일 정리를 마치지 못했습니다. 계정과 이 기기의 기록은 아직 삭제하지 않았습니다. 탈퇴 처리를 다시 시도해 주세요.');
      },
    }, userId, requestId);
  },
  async read(userId: string, namespace: Namespace) {
    const row = await admin('rpc/study_read_workspace', { method: 'POST', body: JSON.stringify({ p_user: userId, p_namespace: namespace }) });
    return row ? { sequence: row.sequence, data: unpackServerState(row.state) } : null;
  },
  async commit(userId: string, namespace: Namespace, base: number, command: Command, next: AppState) {
    const saved = await admin('rpc/study_commit', { method: 'POST', body: JSON.stringify({ p_user: userId, p_namespace: namespace, p_base: base, p_operation: command.opId, p_payload: next.appliedOps[command.opId], p_state: packServerState(next, command.opId) }) });
    return { sequence: saved.sequence, data: unpackServerState(saved.data) };
  },
  async commitBatch(userId: string, namespace: Namespace, base: number, commands: Command[], next: AppState) {
    const operations = commands.map(command => ({ id: command.opId, payload: next.appliedOps[command.opId] }));
    const saved = await admin('rpc/study_commit_batch', { method: 'POST', body: JSON.stringify({ p_user: userId, p_namespace: namespace, p_base: base, p_operations: operations, p_state: packServerState(next, commands.map(command => command.opId)) }) });
    return { sequence: saved.sequence, data: unpackServerState(saved.data) };
  },
}));
