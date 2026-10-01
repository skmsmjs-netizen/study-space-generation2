import { spawn as spawnProcess } from 'node:child_process';
import { spawn as spawnPty } from 'node-pty';
import { mkdtemp, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const ISOLATE = '/usr/local/bin/isolate';
const MAX_OUTPUT = 100_000;
const environment = { PATH: '/usr/bin:/bin', LANG: 'C.UTF-8', HOME: '/tmp', TERM: 'xterm-256color' };
const slots = new Set();
const runProcess = (command, args, { signal, onOutput = () => {} } = {}) => new Promise((resolve, reject) => {
  let text = '', size = 0;
  const child = spawnProcess(command, args, { env: environment, stdio: ['ignore', 'pipe', 'pipe'] });
  const abort = () => child.kill('SIGTERM');
  signal?.addEventListener('abort', abort, { once: true });
  if (signal?.aborted) abort();
  for (const stream of [child.stdout, child.stderr]) {
    stream.setEncoding('utf8');
    stream.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_OUTPUT) { abort(); return; }
      text += chunk;
      onOutput(chunk);
    });
  }
  child.once('error', reject);
  child.once('close', code => {
    signal?.removeEventListener('abort', abort);
    resolve({ code, text, overflow: size > MAX_OUTPUT });
  });
});
async function csharpCompiler(directory) {
  // Invoke the SDK's Roslyn compiler directly: no NuGet, migration locks or network restore.
  const latest8 = names => names.filter(name => /^8\.0\.\d+$/.test(name)).sort((a, b) => b.localeCompare(a, 'en', { numeric: true }))[0];
  const sdk = latest8(await readdir('/usr/share/dotnet/sdk'));
  const pack = latest8(await readdir('/usr/share/dotnet/packs/Microsoft.NETCore.App.Ref'));
  if (!sdk || !pack) throw Error('.NET 8 컴파일 도구를 먼저 설치해 주세요.');
  const references = `/usr/share/dotnet/packs/Microsoft.NETCore.App.Ref/${pack}/ref/net8.0`;
  const files = (await readdir(references)).filter(name => /^[A-Za-z0-9_.-]+\.dll$/.test(name));
  await writeFile(path.join(directory, 'compiler.rsp'), ['-noconfig', '-nostdlib+', '-nologo', '-target:exe', '-langversion:12', '-out:Main.dll', ...files.map(name => `-reference:${references}/${name}`), 'Main.cs'].join('\n'), { mode: 0o644 });
  await writeFile(path.join(directory, 'Main.runtimeconfig.json'), JSON.stringify({ runtimeOptions: { tfm: 'net8.0', framework: { name: 'Microsoft.NETCore.App', version: '8.0.0' } } }), { mode: 0o644 });
  return ['/usr/bin/dotnet', `/usr/share/dotnet/sdk/${sdk}/Roslyn/bincore/csc.dll`, '@compiler.rsp'];
}

/** Only this adapter runs user programs. The standard isolate tool owns Linux isolation. */
export async function startLinuxExecution(source, { signal, onOutput, onPhase, onReady, maxSlots = 2 }) {
  if (process.platform !== 'linux') throw Error('상시 실행 서버에는 Linux가 필요합니다.');
  const id = Array.from({ length: maxSlots }, (_, i) => i).find(i => !slots.has(i));
  if (id === undefined) throw Error('다른 실행이 끝난 뒤 다시 실행해 주세요.');
  slots.add(id);
  const base = ['--cg', `--box-id=${id}`];
  let scratch, initialized = false;
  try {
    if (signal.aborted) return { outcome: 'stopped', error: '실행을 중지했습니다.' };
    scratch = await mkdtemp(path.join(tmpdir(), 'study-terminal-'));
    const initializedBox = await runProcess(ISOLATE, [...base, '--init'], { signal });
    if (initializedBox.code !== 0) throw Error('실행 격리 환경을 확인하지 못했습니다.');
    initialized = true;
    const directory = path.join(initializedBox.text.trim(), 'box');
    const filename = source.language === 'c' ? 'main.c' : source.language === 'cpp' ? 'main.cpp' : 'Main.cs';
    await writeFile(path.join(directory, filename), source.code, { mode: 0o644 });
    const flags = (stage) => [...base, '--silent', '--chdir=/box', '--processes=128', '--open-files=1024', '--fsize=20000', '--cg-mem=1048576', '--time=10', '--extra-time=0', `--wall-time=${stage === 'compile' ? 35 : 120}`, `--meta=${scratch}/${stage}.meta`, '--env=PATH=/usr/bin:/bin', '--env=HOME=/tmp', '--env=LANG=C.UTF-8', '--env=TERM=xterm-256color', '--env=DOTNET_CLI_TELEMETRY_OPTOUT=1', '--env=DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1', '--env=DOTNET_NOLOGO=1', '--env=DOTNET_GCHeapHardLimit=0x18000000'];
    const compiler = source.language === 'c' ? ['/usr/bin/gcc', '-std=c17', '-Wall', '-Wextra', filename, '-o', 'main'] : source.language === 'cpp' ? ['/usr/bin/g++', '-std=c++20', '-Wall', '-Wextra', filename, '-o', 'main'] : await csharpCompiler(directory);
    onPhase('loading');
    const compilation = await runProcess(ISOLATE, [...flags('compile'), '--run', '--', ...compiler], { signal, onOutput });
    if (signal.aborted) return { outcome: 'stopped', error: '실행을 중지했습니다.' };
    if (compilation.code !== 0 || compilation.overflow) {
      const details = await readFile(`${scratch}/compile.meta`, 'utf8').catch(() => '');
      return { outcome: 'error', error: compilation.overflow ? '컴파일 출력 한도를 넘었습니다.' : `컴파일하지 못했습니다. 위 오류 내용을 확인해 주세요.\n${details}` };
    }
    const executable = source.language === 'csharp' ? ['/usr/bin/dotnet', '/box/Main.dll'] : ['/box/main'];
    const args = [...flags('run'), '--tty-hack', '--run', '--', ...executable];
    const exit = await new Promise((resolve, reject) => {
      // Console.ReadLine edits and echoes its own PTY input; configure it before isolation.
      const terminal = source.language === 'csharp'
        ? spawnPty('/bin/sh', ['-c', 'stty -echo -echoctl; exec "$@"', 'study-terminal', ISOLATE, ...args], { name: 'xterm-256color', cols: 80, rows: 24, env: environment })
        : spawnPty(ISOLATE, args, { name: 'xterm-256color', cols: 80, rows: 24, env: environment });
      const abort = () => { try { terminal.kill('SIGTERM'); } catch {} };
      signal.addEventListener('abort', abort, { once: true });
      terminal.onData(onOutput);
      terminal.onExit(({ exitCode }) => { signal.removeEventListener('abort', abort); resolve(exitCode); });
      try {
        onReady({ write: text => terminal.write(text), resize: (cols, rows) => terminal.resize(cols, rows) });
        onPhase('running');
        if (signal.aborted) abort();
      } catch (error) { abort(); reject(error); }
    });
    if (signal.aborted) return { outcome: 'stopped', error: '실행을 중지했습니다.' };
    const metadata = await readFile(`${scratch}/run.meta`, 'utf8');
    const entries = Object.fromEntries(metadata.trim().split('\n').map(line => { const at = line.indexOf(':'); return [line.slice(0, at), line.slice(at + 1)]; }));
    if (exit !== 0 || entries.status || entries.exitcode !== '0') return { outcome: 'error', error: entries.status === 'TO' ? '실행 시간을 초과했습니다.' : entries['cg-oom-killed'] ? '실행 메모리 한도를 넘었습니다.' : `실행이 종료되었습니다. ${entries.message ?? ''}` };
    return { outcome: 'success', error: '' };
  } finally {
    // Never put a box back into service before cleanup finishes; otherwise two users could share it.
    let cleaned = !initialized;
    if (initialized) {
      const result = await runProcess(ISOLATE, [...base, '--cleanup']);
      cleaned = result.code === 0;
    }
    if (scratch) await rm(scratch, { recursive: true, force: true });
    if (cleaned) slots.delete(id);
  }
}
export async function checkLinuxRuntime() {
  if (process.platform !== 'linux') return false;
  const check = await runProcess(ISOLATE, ['--check-config']);
  return check.code === 0;
}
