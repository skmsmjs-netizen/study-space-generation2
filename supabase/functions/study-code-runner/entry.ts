import { handleCodeRequest, compileOnline } from '../../../src/server/code-runner';
import { DomainError } from '../../../src/domain/model';
declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (request: Request) => Promise<Response>): void;
};
const url = Deno.env.get('SUPABASE_URL')!;
const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
async function rpc(name: string, body: object) {
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: service,
      Authorization: `Bearer ${service}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (response.status === 204) return null;
  const result = await response.json();
  if (!response.ok) {
    const code =
      ['CODE_RATE_LIMIT', 'CODE_BUSY', 'ACCESS_DENIED'].find((code) =>
        result.message?.includes(code),
      ) ?? 'COMPILER_UNAVAILABLE';
    throw new DomainError(
      code,
      code === 'CODE_RATE_LIMIT'
        ? '실행 횟수 제한에 도달했습니다. 잠시 뒤 또는 다음 날 다시 실행해 주세요.'
        : code === 'CODE_BUSY'
          ? '앞선 실행이 끝난 뒤 다시 실행해 주세요.'
          : code === 'ACCESS_DENIED'
            ? '관리자 승인이 필요하거나 이용이 중지되어 있습니다.'
            : '실행 연결을 확인하지 못했습니다. 입력은 유지했습니다.',
    );
  }
  return result;
}
Deno.serve((request) =>
  handleCodeRequest(request, {
    async authenticate(token) {
      const response = await fetch(`${url}/auth/v1/user`, {
        headers: { apikey: anon, Authorization: `Bearer ${token}` },
      });
      return response.ok ? (await response.json()).id : '';
    },
    access: (userId) => rpc('study_account_access', { p_user: userId }),
    reserve: async (userId, job) => {
      await rpc('study_reserve_code_run', { p_user: userId, p_job: job });
    },
    release: async (userId, job) => {
      await rpc('study_finish_code_run', { p_user: userId, p_job: job });
    },
    compile: compileOnline,
  }),
);
