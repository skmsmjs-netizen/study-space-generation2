import { handleTerminalAccess } from '../../../src/server/code-terminal-access';
import { DomainError } from '../../../src/domain/model';
declare const Deno: { env: { get(key: string): string | undefined }; serve(handler: (request: Request) => Promise<Response>): void };
const url = Deno.env.get('SUPABASE_URL')!, anon = Deno.env.get('SUPABASE_ANON_KEY')!, service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
async function rpc(name: string, body: object) {
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, { method: 'POST', headers: {
    apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json',
  }, body: JSON.stringify(body), signal: AbortSignal.timeout(8000) });
  if (response.status === 204) return null;
  const result = await response.json();
  if (!response.ok) {
    const code = ['CODE_BUSY', 'CODE_RATE_LIMIT', 'ACCESS_DENIED'].find(c => result.message?.includes(c)) ?? 'SERVER_ERROR';
    throw new DomainError(code, code === 'CODE_BUSY' ? '앞선 실행이 끝난 뒤 다시 실행해 주세요.' : code === 'CODE_RATE_LIMIT' ? '실행 횟수 제한에 도달했습니다. 잠시 후 다시 실행해 주세요.' : '이용 승인을 확인하지 못했습니다.');
  }
  return result;
}
Deno.serve(request => handleTerminalAccess(request, {
  async authenticate(token) {
    const response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anon, Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(8000) });
    return response.ok ? (await response.json()).id : '';
  },
  access: user => rpc('study_account_access', { p_user: user }),
  reserve: async (user, job) => { await rpc('study_reserve_code_terminal', { p_user: user, p_job: job }); },
  release: async (user, job) => { await rpc('study_finish_code_run', { p_user: user, p_job: job }); },
}));
