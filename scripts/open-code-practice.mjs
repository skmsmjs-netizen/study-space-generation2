import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const installedRuntime = fileURLToPath(
  new URL('../work/mac-code-practice/20261001-python-js/', import.meta.url),
);
const repository = fileURLToPath(new URL('../', import.meta.url));
const runtime = existsSync(`${installedRuntime}/dist/index.html`) ? installedRuntime : repository;
const origin = 'http://127.0.0.1:5188';
const url = `${origin}/#/code`;
async function ready() {
  try {
    const response = await fetch(`${origin}/__code-runner/status`, {
      signal: AbortSignal.timeout(1000),
    });
    const status = await response.json();
    return (
      response.ok &&
      status.localCodeRunner === 1 &&
      ['c', 'cpp', 'csharp', 'python', 'javascript'].every((language) =>
        status.languages?.includes(language),
      )
    );
  } catch {
    return false;
  }
}
function open() {
  console.log(`코딩 연습: ${url}`);
  if (process.env.STUDY_CODE_NO_OPEN !== '1') {
    const browser = spawn('/usr/bin/open', [url], { stdio: 'ignore' });
    browser.on('error', (error) =>
      console.error(`브라우저에서 위 주소를 열어 주세요. ${error.message}`),
    );
  }
}
if (process.platform !== 'darwin') {
  console.error('실행 중 입력하는 코딩 화면은 Mac에서 열어 주세요.');
  process.exitCode = 1;
} else if (await ready()) {
  open();
} else if (!existsSync(`${runtime}/dist/index.html`)) {
  console.error(`코딩 실행 파일을 찾지 못했습니다: ${runtime}/dist/index.html`);
  process.exitCode = 1;
} else {
  const child = spawn(
    process.execPath,
    ['scripts/preview-app.mjs', '--outDir', 'dist', '--port', '5188', '--strictPort'],
    {
      cwd: runtime,
      stdio: 'inherit',
      env: process.env,
    },
  );
  let ended = false;
  child.once('error', (error) => {
    ended = true;
    console.error(error.message);
    process.exitCode = 1;
  });
  child.once('exit', (code) => {
    ended = true;
    process.exitCode = code ?? 1;
  });
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
  const deadline = Date.now() + 20000;
  while (!ended && !(await ready()) && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ended && (await ready())) {
    open();
    console.log('코딩을 사용하는 동안 이 터미널 창을 열어 두세요. 끝내려면 Ctrl+C를 누르세요.');
  } else {
    console.error(
      '코딩 화면을 열지 못했습니다. 위 실행 오류를 확인해 주세요. 같은 주소를 사용하는 다른 서버는 종료하지 않았습니다.',
    );
    child.kill('SIGTERM');
    process.exitCode = 1;
  }
}
