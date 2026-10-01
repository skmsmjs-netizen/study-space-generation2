import { DomainError } from '../domain/model';
import { requireApproved } from './account-access';
import type { CodeRunnerBackend } from './code-runner';

type Backend = Pick<CodeRunnerBackend, 'authenticate' | 'access' | 'reserve' | 'release'>;
const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
/** The gateway supplies no user ID; every lease is derived from fresh authentication. */
export async function handleTerminalAccess(request: Request, backend: Backend): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return json({ message: '지원하지 않는 요청입니다.' }, 405);
  try {
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) throw new DomainError('AUTH_REQUIRED', '다시 로그인해 주세요.');
    const user = await backend.authenticate(authorization.slice(7));
    if (!user) throw new DomainError('AUTH_REQUIRED', '다시 로그인해 주세요.');
    const reader = request.body?.getReader();
    if (!reader) throw new DomainError('INVALID_REQUEST', '요청을 확인해 주세요.');
    let text = '';
    try {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        text += new TextDecoder().decode(part.value);
        if (text.length > 2048) throw new DomainError('INVALID_REQUEST', '요청이 너무 깁니다.');
      }
    } finally { await reader.cancel().catch(() => {}); }
    const body = JSON.parse(text);
    if (body.action === 'release' && /^[a-f0-9-]{36}$/.test(body.job ?? '')) {
      // Revoking admission must not prevent cleanup of this authenticated owner's lease.
      await backend.release(user, body.job);
      return json({ released: true });
    }
    requireApproved(await backend.access(user));
    if (body.action === 'check') return json({ allowed: true });
    if (body.action !== 'reserve') throw new DomainError('INVALID_REQUEST', '요청을 확인해 주세요.');
    const job = crypto.randomUUID();
    await backend.reserve(user, job);
    return json({ job });
  } catch (error) {
    const code = error instanceof DomainError ? error.code : 'SERVER_ERROR';
    return json({ code, message: error instanceof DomainError ? error.message : '실행 연결을 확인하지 못했습니다.' },
      code === 'AUTH_REQUIRED' ? 401 : code === 'ACCESS_DENIED' ? 403 : ['CODE_BUSY', 'CODE_RATE_LIMIT'].includes(code) ? 429 : code === 'INVALID_REQUEST' || error instanceof SyntaxError ? 400 : 503);
  }
}
