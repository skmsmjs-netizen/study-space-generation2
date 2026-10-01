import { MAX_CODE_OUTPUT } from '../domain/code-example';
import type { CodeExampleContent, CodeRun } from '../domain/model';

// The opaque-origin iframe prevents practiced code from accessing app storage,
// authentication or DOM. Its CSP allows only the pinned Python runtime CDN.
export const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/';
export const CODE_RUN_TIMEOUT = 10_000;
export const CODE_LOAD_TIMEOUT = 60_000;
const workerSource = `
const send = self.postMessage.bind(self);
let output = '', emitted = 0, lastEmit = 0;
function write(text) {
  const room = ${MAX_CODE_OUTPUT} - output.length;
  output += String(text).slice(0, room);
  if (Date.now() - lastEmit > 50 || output.length - emitted > 4096) {
    send({type:'output', text:output.slice(emitted)}); emitted = output.length; lastEmit = Date.now();
  }
  if (String(text).length > room) throw Error('출력이 너무 길어 실행을 멈췄습니다.');
}
self.onmessage = async ({data}) => {
  try {
    const lines = data.stdin === '' ? [] : data.stdin.replace(/\\r\\n/g, '\\n').split('\\n');
    let line = 0;
    const read = () => line < lines.length ? lines[line++] : null;
    if (data.language === 'python') {
      const {loadPyodide} = await import('${PYODIDE_URL}pyodide.mjs');
      const py = await loadPyodide({indexURL:'${PYODIDE_URL}'});
      py.setStdout({batched: text => write(text + '\\n')});
      py.setStderr({batched: text => write(text + '\\n')});
      py.setStdin({stdin:read});
      send({type:'started'});
      await py.runPythonAsync(data.code);
    } else {
      send({type:'started'});
      const format = value => {
        if (typeof value === 'string') return value;
        try { return JSON.stringify(value) ?? String(value); } catch { return String(value); }
      };
      const log = (...values) => write(values.map(format).join(' ') + '\\n');
      const console = {log, info:log, warn:log, error:log, debug:log, clear:()=>{}};
      const prompt = text => { if (text) write(String(text)); return read(); };
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      await new AsyncFunction('console','readline','prompt',data.code)(console,read,prompt);
    }
    send({type:'done', output, error:''});
  } catch(error) {
    send({type:'done', output, error:String(error?.stack || error).slice(0, ${MAX_CODE_OUTPUT})});
  }
};`;

export interface CodeExecution {
  result: Promise<CodeRun>;
  cancel(): void;
}
export type CodeRemoteRunner = (
  content: Pick<CodeExampleContent, 'code' | 'stdin' | 'language'>,
  signal: AbortSignal,
) => Promise<unknown>;
export function executeCode(
  content: Pick<CodeExampleContent, 'code' | 'stdin' | 'language'>,
  onPhase?: (phase: 'loading' | 'running') => void,
  remote?: CodeRemoteRunner,
): CodeExecution {
  if (['c', 'cpp', 'csharp'].includes(content.language))
    return executeCompiledCode(content, onPhase, remote);
  const frame = document.createElement('iframe');
  frame.hidden = true;
  frame.title = '코드 실행 공간';
  frame.setAttribute('sandbox', 'allow-scripts');
  frame.referrerPolicy = 'no-referrer';
  const token = crypto.randomUUID();
  let output = '',
    settled = false;
  let resolve!: (run: CodeRun) => void;
  const result = new Promise<CodeRun>((done) => {
    resolve = done;
  });
  let timer: ReturnType<typeof setTimeout>;
  const finish = (outcome: CodeRun['outcome'], error = '') => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    window.removeEventListener('message', receive);
    // The frame explicitly terminates its worker before being removed.
    frame.contentWindow?.postMessage({ type: 'stop', token }, '*');
    frame.remove();
    resolve({ ...content, at: new Date().toISOString(), output, error, outcome });
  };
  const receive = (event: MessageEvent) => {
    if (event.source !== frame.contentWindow || event.data?.token !== token) return;
    const message = event.data;
    if (message.type === 'ready')
      frame.contentWindow?.postMessage({ type: 'run', token, content }, '*');
    if (message.type === 'started') {
      clearTimeout(timer);
      onPhase?.('running');
      timer = setTimeout(
        () => finish('stopped', '10초를 넘어 실행을 멈췄습니다. 반복 조건을 확인해 주세요.'),
        CODE_RUN_TIMEOUT,
      );
    }
    if (message.type === 'output' && typeof message.text === 'string')
      output = (output + message.text).slice(0, MAX_CODE_OUTPUT);
    if (message.type === 'done') {
      if (typeof message.output === 'string') output = message.output.slice(0, MAX_CODE_OUTPUT);
      finish(
        message.error ? 'error' : 'success',
        typeof message.error === 'string' ? message.error.slice(0, MAX_CODE_OUTPUT) : '',
      );
    }
  };
  const script = `
    const token = ${JSON.stringify(token)};
    const relay = message => parent.postMessage({...message, token}, '*');
    let worker, url;
    const stop = () => { worker?.terminate(); if(url) URL.revokeObjectURL(url); };
    addEventListener('pagehide', stop);
    addEventListener('message', event => {
      if(event.source !== parent || event.data?.token !== token) return;
      if(event.data.type === 'stop') { stop(); return; }
      if(event.data.type !== 'run' || worker) return;
      try {
        url = URL.createObjectURL(new Blob([${JSON.stringify(workerSource)}], {type:'text/javascript'}));
        // A classic bootstrap can be created from an opaque sandbox origin;
        // Python's ESM runtime is loaded with dynamic import inside that worker.
        worker = new Worker(url);
        worker.onmessage = event => relay(event.data);
        worker.onerror = event => { relay({type:'done',error:event.message || '실행 환경을 열지 못했습니다.'}); stop(); };
        worker.postMessage(event.data.content);
      } catch(error) { relay({type:'done',error:String(error)}); }
    });
    relay({type:'ready'});`;
  const csp =
    "default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob: https://cdn.jsdelivr.net; worker-src blob:; connect-src https://cdn.jsdelivr.net;";
  // Only trusted runtime text is in srcdoc. User code crosses as a message.
  frame.srcdoc = `<meta http-equiv="Content-Security-Policy" content="${csp}"><script>${script.replace(/<\/script/gi, '<\\/script')}</script>`;
  window.addEventListener('message', receive);
  onPhase?.('loading');
  timer = setTimeout(
    () =>
      finish(
        'error',
        '실행 환경을 불러오지 못했습니다. 인터넷 연결을 확인하고 다시 실행해 주세요.',
      ),
    CODE_LOAD_TIMEOUT,
  );
  document.body.append(frame);
  return { result, cancel: () => finish('stopped', '실행을 중지했습니다.') };
}
function executeCompiledCode(
  content: Pick<CodeExampleContent, 'code' | 'stdin' | 'language'>,
  onPhase?: (phase: 'loading' | 'running') => void,
  remote?: CodeRemoteRunner,
): CodeExecution {
  const controller = new AbortController();
  let cancelled = false;
  onPhase?.('loading');
  const result = (async (): Promise<CodeRun> => {
    try {
      let body: any;
      if (remote) {
        body = await remote(content, controller.signal);
      } else {
        if (!['localhost', '127.0.0.1'].includes(location.hostname))
          throw Error(
            'C·C++·C# 코드를 실행하려면 내 공부 공간에 로그인해 주세요. 예시 공간의 입력은 유지했습니다.',
          );
        const response = await fetch('/__code-runner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(content),
          signal: controller.signal,
        });
        if (!response.headers.get('Content-Type')?.includes('application/json'))
          throw Error('컴파일 실행 서버가 연결되지 않았습니다. 개발 서버에서 다시 열어 주세요.');
        body = await response.json();
        if (!response.ok) throw Error(body.message || '컴파일하지 못했습니다.');
      }
      if (cancelled) throw new DOMException('Cancelled', 'AbortError');
      if (
        !body ||
        !['success', 'error', 'stopped'].includes(body.outcome) ||
        typeof body.output !== 'string' ||
        typeof body.error !== 'string'
      )
        throw Error('실행 결과를 확인하지 못했습니다.');
      return {
        ...content,
        at: new Date().toISOString(),
        outcome: body.outcome,
        output: body.output.slice(0, MAX_CODE_OUTPUT),
        error: body.error.slice(0, MAX_CODE_OUTPUT),
      };
    } catch (e) {
      return {
        ...content,
        at: new Date().toISOString(),
        outcome: cancelled ? 'stopped' : 'error',
        output: '',
        error: cancelled
          ? remote
            ? '응답 기다리기를 중지했습니다. 서버 실행은 제한 시간 안에 종료됩니다.'
            : '실행을 중지했습니다.'
          : e instanceof Error
            ? e.message
            : '실행하지 못했습니다.',
      };
    }
  })();
  return {
    result,
    cancel: () => {
      cancelled = true;
      controller.abort();
    },
  };
}
