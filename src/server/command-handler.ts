import { applyCommand, validateState } from '../domain/commands';
import { DomainError, emptyState, type AppState, type Command, type Namespace } from '../domain/model';
export interface ServerSnapshot { sequence: number; data: AppState; supportedCommands?: string[] }
export interface CommandBackend {
  authenticate(token: string): Promise<string>;
  read(userId: string, namespace: Namespace): Promise<ServerSnapshot | null>;
  commit(userId: string, namespace: Namespace, base: number, command: Command, next: AppState): Promise<ServerSnapshot>;
}
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Cache-Control': 'no-store' };
function json(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } }); }
/** Commands, never client snapshots, cross this trust boundary. */
export async function handleCommand(request: Request, backend: CommandBackend): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST') return json({ code: 'METHOD', message: '지원하지 않는 요청입니다.' }, 405);
  try {
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) throw new DomainError('AUTH_REQUIRED', '개인 공간에 다시 로그인해 주세요.');
    const userId = await backend.authenticate(authorization.slice(7));
    if (!userId) throw new DomainError('AUTH_REQUIRED', '개인 공간에 다시 로그인해 주세요.');
    const text = await request.text();
    if (text.length > 4_000_000) throw new DomainError('TOO_LARGE', '한 번에 저장할 내용이 너무 큽니다. 원문은 이 기기에 남아 있습니다.');
    const body = JSON.parse(text);
    const namespace: Namespace = body.namespace;
    if (!['personal', 'test'].includes(namespace)) throw new DomainError('WRONG_NAMESPACE', '시연 자료는 개인 서버에 올리지 않습니다.');
    const current = await backend.read(userId, namespace) ?? { sequence: 0, data: emptyState(userId, namespace) };
    validateState(current.data);
    if (current.data.userId !== userId || current.data.namespace !== namespace) throw new DomainError('OWNERSHIP', '이 공간에 접근할 수 없습니다.');
    if (body.action === 'load') return json({ ...current, supportedCommands: ['saveLearningPlan', 'saveCanvasLayout'] });
    if (body.action !== 'execute' || !body.command) throw new DomainError('INVALID_REQUEST', '저장 요청을 확인해 주세요.');
    const command = body.command as Command;
    if (typeof command.opId !== 'string' || !command.opId.trim() || command.opId.length > 256 || /[\u0000-\u001f\u007f]/.test(command.opId)) throw new DomainError('INVALID_ID', '저장 요청의 식별자를 확인해 주세요.');
    if (command.userId !== userId || command.namespace !== namespace) throw new DomainError('OWNERSHIP', '다른 사용자의 자료를 변경할 수 없습니다.');
    if (!Number.isSafeInteger(body.baseSequence) || body.baseSequence < 0) throw new DomainError('INVALID_VERSION', '저장 순서를 확인해 주세요.');
    // Idempotent retries survive a lost response even if another command followed it.
    if (current.data.appliedOps[command.opId]) { applyCommand(current.data, command); return json({ ...current, supportedCommands: ['saveLearningPlan', 'saveCanvasLayout'] }); }
    if (body.baseSequence !== current.sequence) return json({ code: 'VERSION_CONFLICT', message: '다른 기기의 변경과 작성 내용을 모두 보존했습니다.', server: current }, 409);
    const next = applyCommand(current.data, command);
    return json({ ...await backend.commit(userId, namespace, current.sequence, command, next), supportedCommands: ['saveLearningPlan', 'saveCanvasLayout'] });
  } catch (error) {
    const code = error instanceof DomainError ? error.code : 'SERVER_ERROR';
    const status = code === 'AUTH_REQUIRED' ? 401 : code === 'OWNERSHIP' ? 403 : /CONFLICT/.test(code) ? 409 : error instanceof DomainError || error instanceof SyntaxError ? 400 : 503;
    return json({ code, message: error instanceof DomainError ? error.message : '서버에 저장하지 못했습니다. 작성 내용은 이 기기에 남아 있습니다.' }, status);
  }
}
