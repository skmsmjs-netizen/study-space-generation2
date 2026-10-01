import { DomainError, type CodeRun } from '../domain/model';
import { MAX_CODE_OUTPUT, MAX_CODE_TEXT } from '../domain/code-example';
import { requireApproved, type AccountAccess } from './account-access';

export interface CompiledSource {
  language: 'c' | 'cpp' | 'csharp';
  code: string;
  stdin: string;
}
export const ONLINE_COMPILERS = {
  c: 'gcc-13.2.0-c',
  cpp: 'gcc-13.2.0',
  // Mono's provider locale loses Korean stdin/stdout; use the verified UTF-8 .NET runtime.
  csharp: 'dotnetcore-6.0.425',
} as const;
export interface CodeRunnerBackend {
  authenticate(token: string): Promise<string>;
  access(userId: string): Promise<AccountAccess>;
  reserve(userId: string, job: string): Promise<void>;
  release(userId: string, job: string): Promise<void>;
  compile(
    source: CompiledSource,
    signal: AbortSignal,
  ): Promise<Pick<CodeRun, 'outcome' | 'output' | 'error'>>;
}
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: cors });
async function boundedText(response: Response, limit: number) {
  const reader = response.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit)
        throw new DomainError(
          'TOO_LARGE',
          '실행 결과가 너무 깁니다. 출력량을 줄여 다시 실행해 주세요.',
        );
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  const all = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    all.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(all);
}
export async function compileOnline(
  source: CompiledSource,
  signal: AbortSignal,
  transport: typeof fetch = fetch,
) {
  const response = await transport('https://wandbox.org/api/compile.json', {
    method: 'POST',
    signal,
    redirect: 'error',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'study-space-code-practice/1.0' },
    body: JSON.stringify({
      compiler: ONLINE_COMPILERS[source.language],
      code: source.code,
      stdin: source.stdin,
      options: source.language === 'csharp' ? '' : 'warning',
      ...(source.language === 'c'
        ? { 'compiler-option-raw': '-std=c17' }
        : source.language === 'cpp'
          ? { 'compiler-option-raw': '-std=c++20' }
          : {
              codes: [
                {
                  file: 'NuGet.Config',
                  code: '<?xml version="1.0" encoding="utf-8"?><configuration><packageSources><clear /></packageSources></configuration>',
                },
              ],
            }),
      save: false,
    }),
  });
  if (!response.ok)
    throw new DomainError(
      'COMPILER_UNAVAILABLE',
      response.status === 429
        ? '컴파일 서비스가 혼잡합니다. 잠시 후 다시 실행해 주세요.'
        : '컴파일 서비스에 연결하지 못했습니다. 코드와 설명은 유지했습니다.',
    );
  const body = JSON.parse(await boundedText(response, 1_000_000));
  if (
    !body ||
    typeof body.status !== 'string' ||
    typeof body.program_output !== 'string' ||
    typeof body.compiler_error !== 'string' ||
    typeof body.program_error !== 'string'
  )
    throw new DomainError(
      'COMPILER_RESPONSE',
      '실행 결과를 확인하지 못했습니다. 코드는 유지했습니다.',
    );
  const output = body.program_output.slice(0, MAX_CODE_OUTPUT);
  const error = [
    body.compiler_error ||
      (body.status !== '0' && typeof body.compiler_output === 'string' ? body.compiler_output : ''),
    body.program_error,
    typeof body.signal === 'string' ? body.signal : '',
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, MAX_CODE_OUTPUT);
  return {
    outcome: body.status === '0' && !body.signal ? ('success' as const) : ('error' as const),
    output,
    error,
  };
}
export async function handleCodeRequest(request: Request, backend: CodeRunnerBackend) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST')
    return json({ code: 'METHOD', message: '지원하지 않는 요청입니다.' }, 405);
  let reserved: { userId: string; job: string } | undefined;
  try {
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer '))
      throw new DomainError('AUTH_REQUIRED', '코드를 실행하려면 내 공부 공간에 로그인해 주세요.');
    const userId = await backend.authenticate(authorization.slice(7));
    if (!userId) throw new DomainError('AUTH_REQUIRED', '내 공부 공간에 다시 로그인해 주세요.');
    requireApproved(await backend.access(userId));
    const body = JSON.parse(await boundedText(new Response(request.body), 1_500_000));
    if (
      !body ||
      !Object.hasOwn(ONLINE_COMPILERS, body.language) ||
      typeof body.code !== 'string' ||
      typeof body.stdin !== 'string' ||
      body.code.length > MAX_CODE_TEXT ||
      body.stdin.length > MAX_CODE_TEXT ||
      !body.code.trim()
    )
      throw new DomainError('INVALID_CODE', '언어·코드·입력값을 확인해 주세요.');
    const source: CompiledSource = { language: body.language, code: body.code, stdin: body.stdin };
    const job = crypto.randomUUID();
    await backend.reserve(userId, job);
    reserved = { userId, job };
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(35_000)]);
    const result = await backend.compile(source, signal);
    return json({
      ...source,
      ...result,
      at: new Date().toISOString(),
      compiler: ONLINE_COMPILERS[source.language],
    });
  } catch (e) {
    const code =
      e instanceof DomainError
        ? e.code
        : e instanceof Error && ['TimeoutError', 'AbortError'].includes(e.name)
          ? 'CODE_TIMEOUT'
          : 'COMPILER_UNAVAILABLE';
    const status =
      code === 'AUTH_REQUIRED'
        ? 401
        : code === 'ACCESS_DENIED'
          ? 403
          : ['CODE_RATE_LIMIT', 'CODE_BUSY'].includes(code)
            ? 429
            : ['INVALID_CODE', 'TOO_LARGE'].includes(code) || e instanceof SyntaxError
              ? 400
              : 503;
    return json(
      {
        code,
        message:
          e instanceof DomainError
            ? e.message
            : code === 'CODE_TIMEOUT'
              ? '실행 응답 시간이 초과되었습니다. 입력은 유지했습니다.'
              : '컴파일 서비스에 연결하지 못했습니다. 입력은 유지했습니다.',
      },
      status,
    );
  } finally {
    if (reserved)
      await backend.release(reserved.userId, reserved.job).catch(() => {
        /* Expiring lease preserves the limit after a failed release. */
      });
  }
}
