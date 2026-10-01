import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm, realpath, readdir } from 'node:fs/promises';
import { tmpdir, homedir } from 'node:os';
import path from 'node:path';
import { attachCodeTerminal } from './code-terminal.mjs';

const maxText = 200_000,
  maxOutput = 100_000;
const sdk =
  process.env.STUDY_CODE_DOTNET ||
  path.join(homedir(), '.local/share/study-code-runner/dotnet/dotnet');
const sdkRoot = path.dirname(sdk);
// Local Mac development only. Never expose this adapter as a public service.
// Compilation and execution both use a deny-by-default filesystem/network sandbox.
export function profile(directory, compile) {
  const roots = [
    '/System',
    '/usr',
    '/bin',
    '/sbin',
    '/Library/Developer',
    '/Library/Apple',
    '/private/etc',
    '/private/var/select',
    sdkRoot,
    directory,
  ];
  return `(version 1) (deny default) (import "system.sb")
    (deny network*)
    (allow process-exec) ${compile ? '(allow process-fork)' : '(deny process-fork)'}
    (allow sysctl-read)
    (allow process-info* (target self))
    (allow file-read-metadata)
    (allow file-read* file-write* file-test-existence (literal "/private/tmp") (regex #"^/private/tmp/\\.dotnet[^/]*(/|$)"))
    (allow file-read* file-test-existence ${roots.map((root) => `(subpath ${JSON.stringify(root)})`).join(' ')})
    (allow file-map-executable ${roots.map((root) => `(subpath ${JSON.stringify(root)})`).join(' ')})
    (allow file-read* file-write* (subpath ${JSON.stringify(directory)}) (literal "/dev/null") (literal "/dev/urandom") (literal "/dev/random"))
    (allow mach-lookup (global-name "com.apple.system.logger"))`;
}
export function processEnvironment(directory) {
  return {
    PATH: '/usr/bin:/bin',
    HOME: directory,
    TMPDIR: directory,
    DOTNET_ROOT: sdkRoot,
    DOTNET_CLI_HOME: directory,
    DOTNET_SKIP_FIRST_TIME_EXPERIENCE: '1',
    DOTNET_CLI_TELEMETRY_OPTOUT: '1',
    DOTNET_NOLOGO: '1',
    DOTNET_EnableDiagnostics: '0',
    DOTNET_CLI_WORKLOAD_UPDATE_NOTIFY_DISABLE: '1',
    LANG: 'en_US.UTF-8',
  };
}
function limitedProcess(command, args, input, directory, signal, milliseconds, compile) {
  return new Promise((resolve) => {
    let output = '',
      error = '',
      stopped = false,
      ended = false;
    const env = processEnvironment(directory);
    const child = spawn(
      '/usr/bin/sandbox-exec',
      [
        '-p',
        profile(directory, compile),
        '/bin/sh',
        '-c',
        'ulimit -t 10; ulimit -f 20000; ulimit -n 1024; exec "$@"',
        'study-code-runner',
        command,
        ...args,
      ],
      { cwd: directory, env, detached: true, stdio: ['pipe', 'pipe', 'pipe'] },
    );
    const kill = () => {
      stopped = true;
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch {
        /* Process may have already exited. */
      }
    };
    const timer = setTimeout(kill, milliseconds);
    signal?.addEventListener('abort', kill, { once: true });
    if (signal?.aborted) kill();
    const finish = (code, exitSignal) => {
      if (ended) return;
      ended = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', kill);
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch {
        /* Group is already gone. */
      }
      resolve({
        outcome: stopped ? 'stopped' : code === 0 ? 'success' : 'error',
        output,
        error: stopped
          ? '실행 시간 또는 출력 한도를 넘어 중지했습니다.'
          : error ||
            (code !== 0 ? `프로그램이 ${exitSignal || `종료 코드 ${code}`}로 종료되었습니다.` : ''),
      });
    };
    const capture = (text, stream) => {
      const chunk = text.toString('utf8');
      if (stream === 'output') output = (output + chunk).slice(0, maxOutput);
      else error = (error + chunk).slice(0, maxOutput);
      if (output.length + error.length >= maxOutput) kill();
    };
    child.stdout.on('data', (text) => capture(text, 'output'));
    child.stderr.on('data', (text) => capture(text, 'error'));
    child.on('error', (e) => {
      error = e.message;
      finish(1);
    });
    child.on('close', finish);
    child.stdin.on('error', () => {});
    child.stdin.end(input);
  });
}
export async function compileProgram(input, { signal, execute } = {}) {
  if (process.platform !== 'darwin')
    throw Error(
      '현재 개발용 컴파일 실행은 macOS에서 지원합니다. 운영 환경에는 별도 격리 실행 서버가 필요합니다.',
    );
  if (
    !input ||
    !['c', 'cpp', 'csharp'].includes(input.language) ||
    typeof input.code !== 'string' ||
    typeof input.stdin !== 'string' ||
    input.code.length > maxText ||
    input.stdin.length > maxText
  )
    throw Error('언어·코드·입력값을 확인해 주세요.');
  const directory = await realpath(await mkdtemp(path.join(tmpdir(), 'study-code-')));
  try {
    let command, args, executeCommand, executeArgs;
    if (input.language === 'csharp') {
      await writeFile(path.join(directory, 'Program.cs'), input.code);
      const latest = (values) =>
        values.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).at(-1);
      const sdkVersion = latest(await readdir(path.join(sdkRoot, 'sdk')));
      const pack = path.join(sdkRoot, 'packs/Microsoft.NETCore.App.Ref');
      const refs = path.join(pack, latest(await readdir(pack)), 'ref/net10.0');
      const references = (await readdir(refs))
        .filter((file) => file.endsWith('.dll'))
        .map((file) => `-reference:${path.join(refs, file)}`);
      await writeFile(
        path.join(directory, 'program.runtimeconfig.json'),
        JSON.stringify({
          runtimeOptions: {
            tfm: 'net10.0',
            framework: { name: 'Microsoft.NETCore.App', version: '10.0.0' },
          },
        }),
      );
      command = sdk;
      args = [
        path.join(sdkRoot, 'sdk', sdkVersion, 'Roslyn/bincore/csc.dll'),
        '-nologo',
        '-target:exe',
        '-out:program.dll',
        ...references,
        'Program.cs',
      ];
      executeCommand = sdk;
      executeArgs = ['program.dll'];
    } else {
      const file = input.language === 'c' ? 'main.c' : 'main.cpp';
      await writeFile(path.join(directory, file), input.code);
      command =
        input.language === 'c'
          ? '/Library/Developer/CommandLineTools/usr/bin/clang'
          : '/Library/Developer/CommandLineTools/usr/bin/clang++';
      args = [
        input.language === 'c' ? '-std=c17' : '-std=c++20',
        '-Wall',
        '-Wextra',
        '-isysroot',
        '/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk',
        file,
        '-o',
        'program',
      ];
      executeCommand = path.join(directory, 'program');
      executeArgs = [];
    }
    const compiled = await limitedProcess(command, args, '', directory, signal, 30_000, true);
    if (compiled.outcome !== 'success')
      return { ...compiled, ...input, at: new Date().toISOString() };
    const result = execute
      ? await execute({
          command: executeCommand,
          args: executeArgs,
          directory,
          signal,
        })
      : await limitedProcess(
          executeCommand,
          executeArgs,
          input.stdin,
          directory,
          signal,
          10_000,
          false,
        );
    return {
      ...result,
      error: [compiled.error, result.error].filter(Boolean).join('\n').slice(0, maxOutput),
      ...input,
      at: new Date().toISOString(),
    };
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
export function localCodeRunnerPlugin() {
  let busy = false;
  const middleware = async (req, res, next) => {
    if (req.url !== '/__code-runner') return next();
    const host = req.headers.host || '';
    const local = /^(127\.0\.0\.1|localhost):\d+$/.test(host);
    const origin = req.headers.origin;
    if (
      !local ||
      (origin && origin !== `http://${host}`) ||
      (req.headers['sec-fetch-site'] && req.headers['sec-fetch-site'] !== 'same-origin')
    ) {
      res.writeHead(403).end();
      return;
    }
    if (req.method !== 'POST' || !req.headers['content-type']?.startsWith('application/json')) {
      res.writeHead(405).end();
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    if (busy) {
      res.writeHead(429).end(
        JSON.stringify({
          message: '다른 코드를 실행 중입니다. 잠시 후 다시 실행해 주세요.',
        }),
      );
      return;
    }
    busy = true;
    const controller = new AbortController();
    res.on('close', () => controller.abort());
    try {
      let raw = '';
      for await (const chunk of req) {
        raw += chunk.toString();
        if (raw.length > 1_500_000) throw Error('한 번에 실행할 코드가 너무 깁니다.');
      }
      const result = await compileProgram(JSON.parse(raw), {
        signal: controller.signal,
      });
      res.end(JSON.stringify(result));
    } catch (error) {
      if (!res.destroyed) {
        res.writeHead(400).end(JSON.stringify({ message: error.message }));
      }
    } finally {
      busy = false;
    }
  };
  return {
    name: 'study-local-code-runner',
    configureServer(server) {
      server.middlewares.use(middleware);
      attachCodeTerminal(server.httpServer, {
        acquire: () => {
          if (busy) return false;
          busy = true;
          return true;
        },
        release: () => {
          busy = false;
        },
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
      attachCodeTerminal(server.httpServer, {
        acquire: () => {
          if (busy) return false;
          busy = true;
          return true;
        },
        release: () => {
          busy = false;
        },
      });
    },
  };
}
