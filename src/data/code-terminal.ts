import type { CodeExampleContent, CodeRun } from '../domain/model';
import { MAX_CODE_OUTPUT, MAX_CODE_TEXT } from '../domain/code-example';
import type { CodeExecution } from './code-runner';

export interface CodeTerminalExecution extends CodeExecution {
  snapshot(): CodeRun;
  write(text: string): void;
  resize(cols: number, rows: number): void;
}
export function canUseCodeTerminal(language: string) {
  return (
    ['c', 'cpp', 'csharp', 'python', 'javascript'].includes(language) &&
    ['localhost', '127.0.0.1'].includes(location.hostname)
  );
}
export function executeCodeTerminal(
  content: Pick<CodeExampleContent, 'language' | 'code'>,
  onOutput: (text: string) => void,
  onPhase: (phase: 'loading' | 'running') => void,
): CodeTerminalExecution {
  let output = '',
    stdin = '',
    settled = false,
    running = false,
    cancelled = false;
  let resolve!: (result: CodeRun) => void;
  const result = new Promise<CodeRun>((done) => {
    resolve = done;
  });
  const ws = new WebSocket(
    `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/__code-terminal`,
  );
  let timer: ReturnType<typeof setTimeout>;
  const finish = (outcome: CodeRun['outcome'], error = '') => {
    if (settled) return;
    settled = true;
    running = false;
    clearTimeout(timer);
    ws.close();
    resolve({
      ...content,
      stdin,
      output,
      mode: 'terminal',
      at: new Date().toISOString(),
      outcome,
      error,
    });
  };
  const send = (message: object) => {
    if (!settled && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
  };
  const timeout = (ms: number) => {
    clearTimeout(timer);
    timer = setTimeout(
      () =>
        finish(
          cancelled ? 'stopped' : 'error',
          cancelled
            ? '실행을 중지했습니다.'
            : '터미널 연결이 지연되어 실행을 중지했습니다. 다시 실행해 주세요.',
        ),
      ms,
    );
  };
  onPhase('loading');
  timeout(40_000);
  ws.onopen = () => send({ type: 'start', ...content });
  ws.onmessage = (event) => {
    if (settled) return;
    try {
      const message = JSON.parse(event.data);
      if (message.type === 'phase') {
        if (message.phase === 'running') {
          running = true;
          timeout(125_000);
          onPhase('running');
        }
      } else if (message.type === 'data' && typeof message.text === 'string') {
        const chunk = message.text.slice(0, MAX_CODE_OUTPUT - output.length);
        output += chunk;
        onOutput(chunk);
      } else if (message.type === 'result') {
        const run = message.result;
        if (
          !run ||
          !['success', 'error', 'stopped'].includes(run.outcome) ||
          typeof run.error !== 'string' ||
          typeof run.output !== 'string' ||
          typeof run.stdin !== 'string' ||
          run.output.length > MAX_CODE_OUTPUT ||
          run.stdin.length > MAX_CODE_TEXT
        )
          throw Error();
        // Compilation can end before a PTY is created. Keep compiler diagnostics too.
        output = run.output;
        stdin = run.stdin;
        finish(cancelled ? 'stopped' : run.outcome, run.error.slice(0, MAX_CODE_OUTPUT));
      } else if (message.type === 'failure')
        finish(
          'error',
          String(message.message || '실행하지 못했습니다.').slice(0, MAX_CODE_OUTPUT),
        );
    } catch {
      finish('error', '터미널 응답을 확인하지 못했습니다. 입력과 출력은 보관했습니다.');
    }
  };
  ws.onerror = () =>
    finish(
      cancelled ? 'stopped' : 'error',
      '터미널 서버에 연결하지 못했습니다. 코드와 설명은 유지했습니다.',
    );
  ws.onclose = () =>
    finish(
      cancelled ? 'stopped' : 'error',
      cancelled ? '실행을 중지했습니다.' : '터미널 연결이 끊겼습니다. 입력과 출력은 보관했습니다.',
    );
  return {
    result,
    snapshot: () => ({
      ...content,
      mode: 'terminal',
      stdin,
      output,
      at: new Date().toISOString(),
      outcome: 'stopped',
      error: '실행이 끝나기 전의 중간 기록입니다. 완료 여부는 확인하지 못했습니다.',
    }),
    write(text) {
      if (!running || cancelled || settled) return;
      if (stdin.length + text.length > MAX_CODE_TEXT) {
        finish('stopped', '입력 한도를 넘어 실행을 중지했습니다.');
        return;
      }
      stdin += text;
      send({ type: 'input', text });
      if (text.includes('\u0003')) cancelled = true;
    },
    resize(cols, rows) {
      if (running) send({ type: 'resize', cols, rows });
    },
    cancel() {
      if (settled) return;
      cancelled = true;
      send({ type: 'cancel' });
      timeout(4_000);
      if (ws.readyState === WebSocket.CONNECTING) finish('stopped', '실행을 중지했습니다.');
    },
  };
}
