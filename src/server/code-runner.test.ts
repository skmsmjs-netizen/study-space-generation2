// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { DomainError } from '../domain/model';
import { handleCodeRequest, compileOnline, type CodeRunnerBackend } from './code-runner';
function fixture() {
  const backend: CodeRunnerBackend = {
    authenticate: vi.fn(async () => 'owner'),
    access: vi.fn(async () => ({ status: 'approved' as const, administrator: false })),
    reserve: vi.fn(async () => {}),
    release: vi.fn(async () => {}),
    compile: vi.fn(async () => ({ outcome: 'success' as const, output: '7\n', error: '' })),
  };
  const source = {
    language: 'c',
    code: '// 원문\r\nint main(){}',
    stdin: '3\n4',
    title: '비공개 제목',
    notes: '비공개 설명',
    userId: 'foreign',
    compiler: 'malicious',
    url: 'http://internal',
  };
  const request = (body = source, token = 'valid') =>
    new Request('https://test/runner', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(body),
    });
  return { backend, source, request };
}
it('authenticates and authorizes before reserving or transmitting source', async () => {
  const { backend, request } = fixture();
  expect((await handleCodeRequest(request(undefined, ''), backend)).status).toBe(401);
  backend.authenticate = vi.fn(async () => '');
  expect((await handleCodeRequest(request(), backend)).status).toBe(401);
  backend.authenticate = vi.fn(async () => 'owner');
  backend.access = vi.fn(async () => ({ status: 'pending' as const, administrator: false }));
  expect((await handleCodeRequest(request(), backend)).status).toBe(403);
  expect(backend.reserve).not.toHaveBeenCalled();
  expect(backend.compile).not.toHaveBeenCalled();
});
it('transmits only source, input and selected language and releases the same authenticated job', async () => {
  const { backend, source, request } = fixture();
  const response = await handleCodeRequest(request(), backend);
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({
    language: source.language,
    code: source.code,
    stdin: source.stdin,
    output: '7\n',
  });
  expect(backend.compile).toHaveBeenCalledWith(
    { language: source.language, code: source.code, stdin: source.stdin },
    expect.any(AbortSignal),
  );
  expect(backend.reserve).toHaveBeenCalledWith('owner', expect.any(String));
  expect(backend.release).toHaveBeenCalledWith(...vi.mocked(backend.reserve).mock.calls[0]);
});
it('rejects invalid language and oversized or empty code before quota use', async () => {
  const { backend, source, request } = fixture();
  for (const body of [
    { ...source, language: 'javascript' },
    { ...source, code: ' '.repeat(200001) },
    { ...source, code: '' },
  ])
    expect((await handleCodeRequest(request(body), backend)).status).toBe(400);
  expect(backend.compile).not.toHaveBeenCalled();
  expect(backend.reserve).not.toHaveBeenCalled();
});
it('refuses exhausted quota and releases after a provider failure', async () => {
  const { backend, request } = fixture();
  backend.reserve = vi.fn(async () => {
    throw new DomainError('CODE_RATE_LIMIT', 'limit');
  });
  expect((await handleCodeRequest(request(), backend)).status).toBe(429);
  expect(backend.compile).not.toHaveBeenCalled();
  expect(backend.release).not.toHaveBeenCalled();
  backend.reserve = vi.fn(async () => {});
  backend.compile = vi.fn(async () => {
    throw new Error('provider internal address');
  });
  const response = await handleCodeRequest(request(), backend);
  expect(response.status).toBe(503);
  expect(await response.text()).not.toContain('provider internal');
  expect(backend.release).toHaveBeenCalledOnce();
});
it('uses fixed compiler/options with saving disabled and separates errors from output', async () => {
  const transport = vi.fn<typeof fetch>(
    async () =>
      new Response(
        JSON.stringify({
          status: '1',
          signal: '',
          compiler_error: 'compile error',
          program_error: 'runtime error',
          program_output: 'output',
        }),
      ),
  );
  expect(
    await compileOnline(
      { language: 'cpp', code: ' raw ', stdin: ' input ' },
      new AbortController().signal,
      transport,
    ),
  ).toEqual({ outcome: 'error', output: 'output', error: 'compile error\nruntime error' });
  expect(transport.mock.calls[0][0]).toBe('https://wandbox.org/api/compile.json');
  expect(JSON.parse(transport.mock.calls[0][1]?.body as string)).toEqual({
    compiler: 'gcc-13.2.0',
    code: ' raw ',
    stdin: ' input ',
    options: 'warning',
    'compiler-option-raw': '-std=c++20',
    save: false,
  });
});

it('uses C# compatible options and returns compiler stdout diagnostics on failure', async () => {
  const transport = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ status: '1', signal: '', compiler_output: 'error CS2007', compiler_error: '', program_error: '', program_output: '' })));
  const result = await compileOnline({language: 'csharp', code: 'bad code', stdin: ''}, new AbortController().signal, transport);
  expect(result).toEqual({outcome: 'error', output: '', error: 'error CS2007'});
  expect(JSON.parse(transport.mock.calls[0][1]?.body as string).options).toBe('');
});
