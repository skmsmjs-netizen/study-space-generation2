import { requireOwnerAI } from '../../../src/domain/ai-access';
import { createRemoteStudyAIHandler } from '../../../src/server/remote-study-ai';
import { DomainError } from '../../../src/domain/model';
import { requireApproved } from '../../../src/server/account-access';
declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (request: Request) => Promise<Response>): void;
};
const url = Deno.env.get('SUPABASE_URL')!;
const publicKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
async function authorize(req: Request) {
  const token = req.headers.get('authorization');
  if (!token?.startsWith('Bearer '))
    throw new DomainError('AUTH_REQUIRED', '개인 공간에 다시 로그인해 주세요.');
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: publicKey, Authorization: token },
  });
  if (!response.ok) throw new DomainError('AUTH_REQUIRED', '로그인이 만료되었습니다.');
  const userId = (await response.json()).id;
  const identity = { userId, namespace: 'personal' };
  requireOwnerAI(identity);
  const access = await fetch(`${url}/rest/v1/rpc/study_account_access`, {
    method: 'POST',
    headers: { apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_user: userId }),
  });
  if (!access.ok) throw new DomainError('ACCESS_DENIED', '앱 이용 승인을 확인하지 못했습니다.');
  requireApproved(await access.json());
  return identity;
}
/** No source-body read, quota reservation or paid provider before remote SIWC approval. */
Deno.serve(createRemoteStudyAIHandler({
  authorize,
  // The managed Supabase hosting grant and server credential manager are not
  // provisioned. Keep source bodies unread and do not import Mac credentials.
  async connection() { return null; },
}));
