import { createServer } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';
import { startLinuxExecution, checkLinuxRuntime } from './linux-runtime.mjs';
import { pathToFileURL } from 'node:url';

const MAX_INPUT = 200_000, MAX_OUTPUT = 100_000;
/** Dependency injection is for integration tests. Production always uses isolate and Supabase. */
export function createTerminalGateway({ origins, access, execute = startLinuxExecution, ready = true, maxConnections = 16, maxRuns = 2 }) {
  let active = 0;
  const server = createServer((request, response) => {
    const healthy = request.url === '/health' && ready;
    response.writeHead(healthy ? 200 : 503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    response.end(JSON.stringify({ ready: healthy }));
  });
  const sockets = new WebSocketServer({ noServer: true, maxPayload: 1_500_000, perMessageDeflate: false });
  server.on('upgrade', (request, socket, head) => {
    if (!ready || request.url !== '/terminal' || !origins.includes(request.headers.origin) || sockets.clients.size >= maxConnections) {
      socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n'); return;
    }
    sockets.handleUpgrade(request, socket, head, ws => sockets.emit('connection', ws));
  });
  sockets.on('connection', ws => {
    let started = false, running = false, output = '', stdin = '', source, lease, token, terminal, reason = '', inputEnded = false;
    let frames = 0, windowAt = Date.now(), checking = false;
    const controller = new AbortController();
    let timer = setTimeout(() => { controller.abort(); ws.close(); }, 10_000), admissionTimer;
    const send = message => { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message)); };
    const stop = message => { reason ||= message; controller.abort(); };
    const outputChunk = chunk => {
      const text = chunk.slice(0, MAX_OUTPUT - output.length);
      output += text;
      if (text) send({ type: 'data', text });
      if (chunk.length > text.length) stop('출력 한도를 넘어 실행을 중지했습니다.');
      if (ws.bufferedAmount > 500_000) stop('출력 전송이 지연되어 실행을 중지했습니다.');
    };
    ws.on('error', () => stop('터미널 연결 오류로 실행을 중지했습니다.'));
    ws.on('close', () => { clearTimeout(timer); stop('터미널 연결이 끊겨 실행을 중지했습니다.'); });
    ws.on('message', async (raw, binary) => {
      try {
        if (binary) throw Error('텍스트 입력만 사용할 수 있습니다.');
        if (Date.now() - windowAt > 1000) { windowAt = Date.now(); frames = 0; }
        if (++frames > 200) throw Error('입력이 너무 빠릅니다.');
        const message = JSON.parse(raw.toString());
        if (message.type === 'cancel') { stop('실행을 중지했습니다.'); return; }
        if (message.type === 'input') {
          if (!running || controller.signal.aborted || inputEnded || typeof message.text !== 'string') return;
          if (stdin.length + message.text.length > MAX_INPUT) throw Error('입력 한도를 넘었습니다.');
          stdin += message.text;
          if (message.text.includes('\u0003')) { stop('실행을 중지했습니다.'); return; }
          if (message.text.includes('\u0004')) inputEnded = true;
          terminal.write(message.text); return;
        }
        if (message.type === 'resize') {
          if (running && Number.isInteger(message.cols) && Number.isInteger(message.rows)) terminal.resize(Math.max(20, Math.min(240, message.cols)), Math.max(5, Math.min(80, message.rows)));
          return;
        }
        if (message.type !== 'start' || started) throw Error('실행 요청을 확인해 주세요.');
        started = true;
        if (!['c', 'cpp', 'csharp'].includes(message.language) || typeof message.code !== 'string' || !message.code.trim() || message.code.length > MAX_INPUT || typeof message.token !== 'string' || message.token.length > 8192) throw Error('언어·코드·로그인을 확인해 주세요.');
        source = { language: message.language, code: message.code };
        token = message.token;
        if (active >= maxRuns) throw Error('다른 실행이 끝난 뒤 다시 실행해 주세요.');
        active++;
        try {
          lease = await access(token, { action: 'reserve' });
          if (controller.signal.aborted) return;
          clearTimeout(timer);
          timer = setTimeout(() => stop('실행 시간을 초과했습니다.'), 160_000);
          admissionTimer = setInterval(async () => {
            if (checking || controller.signal.aborted) return;
            checking = true;
            try { await access(token, { action: 'check' }); }
            catch { stop('로그인 또는 이용 승인이 변경되어 실행을 중지했습니다.'); }
            finally { checking = false; }
          }, 5000);
          const result = await execute(source, { signal: controller.signal, maxSlots: maxRuns, onOutput: outputChunk, onPhase: phase => { running = phase === 'running'; send({ type: 'phase', phase }); }, onReady: handle => { terminal = handle; } });
          send({ type: 'result', result: { ...source, stdin, output, mode: 'terminal', at: new Date().toISOString(), ...result, ...(reason ? { outcome: 'stopped', error: reason } : {}) } });
        } catch (error) {
          stop('실행을 중지했습니다.');
          send({ type: 'failure', message: error instanceof Error ? error.message : '실행하지 못했습니다.' });
        } finally {
          running = false;
          clearInterval(admissionTimer);
          if (lease?.job) await access(token, { action: 'release', job: lease.job }).catch(() => {});
          active--;
          token = undefined;
          clearTimeout(timer);
          ws.close();
        }
      } catch (error) {
        stop('실행을 중지했습니다.');
        send({ type: 'failure', message: error instanceof Error ? error.message : '실행하지 못했습니다.' });
        ws.close();
      }
    });
  });
  server.once('close', () => { for (const ws of sockets.clients) ws.close(); sockets.close(); });
  return server;
}
export function createAccessClient({ url, publishableKey, transport = fetch }) {
  if (!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url) || !publishableKey.startsWith('sb_publishable_')) throw Error('Supabase 공개 연결 설정을 확인해 주세요.');
  return async (token, body) => {
    const response = await transport(`${url}/functions/v1/study-code-terminal`, { method: 'POST', headers: { apikey: publishableKey, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(8000), redirect: 'error' });
    const result = await response.json();
    if (!response.ok) throw Error(result.message ?? '로그인 또는 실행 권한을 확인하지 못했습니다.');
    if (body.action === 'reserve' && !/^[a-f0-9-]{36}$/.test(result.job ?? '')) throw Error('실행 권한 응답을 확인하지 못했습니다.');
    return result;
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const origins = (process.env.TERMINAL_ORIGINS ?? '').split(',').filter(Boolean);
  if (!origins.length || origins.some(origin => !/^https:\/\/[^/]+$/.test(origin))) throw Error('허용된 앱 주소가 필요합니다.');
  const ready = await checkLinuxRuntime();
  if (!ready) throw Error('Linux 격리 환경을 먼저 설치해 주세요.');
  const server = createTerminalGateway({ origins, access: createAccessClient({ url: process.env.SUPABASE_URL ?? '', publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY ?? '' }) });
  server.listen(8090, '127.0.0.1', () => process.stdout.write('Study terminal ready on loopback:8090\n'));
  for (const name of ['SIGINT', 'SIGTERM']) process.on(name, () => { server.close(); server.closeAllConnections(); setTimeout(() => process.exit(0), 5000).unref(); });
}
