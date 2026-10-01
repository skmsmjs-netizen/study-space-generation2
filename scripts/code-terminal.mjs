import { WebSocketServer, WebSocket } from 'ws';
import { spawn } from 'node-pty';
import { chmodSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { compileProgram, profile, processEnvironment } from './code-runner.mjs';

// This adapter deliberately accepts only loopback, same-origin browser connections.
// node-pty is a terminal, not a security boundary: keep the existing OS sandbox.
const MAX_INPUT = 200_000,
  MAX_OUTPUT = 100_000;
function ensurePtyHelperExecutable() {
  // npm reinstall can replace this helper while the preview server remains running.
  if (process.platform === 'darwin') {
    const require = createRequire(import.meta.url);
    const helper = path.join(
      path.dirname(require.resolve('node-pty/package.json')),
      'prebuilds',
      `darwin-${process.arch}`,
      'spawn-helper',
    );
    if (existsSync(helper)) chmodSync(helper, 0o755);
  }
}
export function attachCodeTerminal(server, { acquire, release, executionTimeoutMs = 120_000 }) {
  if (!server) return;
  ensurePtyHelperExecutable();
  const sockets = new WebSocketServer({
    noServer: true,
    maxPayload: 1_500_000,
  });
  const upgrade = (req, socket, head) => {
    if (req.url !== '/__code-terminal') return;
    const host = req.headers.host || '';
    if (
      !/^(localhost|127\.0\.0\.1):\d+$/.test(host) ||
      req.headers.origin !== `http://${host}` ||
      !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress)
    ) {
      socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');
      return;
    }
    sockets.handleUpgrade(req, socket, head, (ws) => sockets.emit('connection', ws));
  };
  server.on('upgrade', upgrade);
  server.once('close', () => {
    server.off('upgrade', upgrade);
    for (const ws of sockets.clients) ws.terminate();
    sockets.close();
  });
  sockets.on('connection', (ws) => {
    let started = false,
      running = false,
      terminal,
      stdin = '',
      output = '',
      reason = '';
    const controller = new AbortController();
    const send = (message) => {
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
    };
    const stop = (message) => {
      reason ||= message;
      controller.abort();
    };
    const initialTimer = setTimeout(() => {
      stop('실행 연결 시간이 지났습니다.');
      ws.close();
    }, 5_000);
    let commands = 0,
      windowAt = Date.now();
    ws.on('close', () => {
      clearTimeout(initialTimer);
      stop('터미널 연결이 끊겨 실행을 중지했습니다.');
    });
    ws.on('error', () => stop('터미널 연결 오류로 실행을 중지했습니다.'));
    ws.on('message', async (raw, binary) => {
      try {
        if (binary) throw Error('텍스트 입력만 사용할 수 있습니다.');
        if (Date.now() - windowAt >= 1000) {
          commands = 0;
          windowAt = Date.now();
        }
        if (++commands > 200) throw Error('입력이 너무 빠릅니다. 다시 실행해 주세요.');
        const message = JSON.parse(raw.toString());
        if (message.type === 'cancel') {
          stop('실행을 중지했습니다.');
          return;
        }
        if (message.type === 'input') {
          if (!running || typeof message.text !== 'string') return;
          if (stdin.length + message.text.length > MAX_INPUT)
            throw Error('입력 한도를 넘어 실행을 중지했습니다.');
          stdin += message.text;
          // Ctrl+C must kill the process, including programs that catch SIGINT.
          if (message.text.includes('\u0003')) {
            stop('실행을 중지했습니다.');
            return;
          }
          terminal.write(message.text);
          return;
        }
        if (message.type === 'resize') {
          if (running && Number.isInteger(message.cols) && Number.isInteger(message.rows))
            terminal.resize(
              Math.min(240, Math.max(20, message.cols)),
              Math.min(80, Math.max(5, message.rows)),
            );
          return;
        }
        if (message.type !== 'start' || started) throw Error('실행 요청을 확인해 주세요.');
        started = true;
        clearTimeout(initialTimer);
        if (!acquire()) throw Error('다른 코드를 실행 중입니다. 잠시 후 다시 실행해 주세요.');
        const source = {
          language: message.language,
          code: message.code,
          stdin: '',
        };
        send({ type: 'phase', phase: 'loading' });
        let result;
        try {
          result = await compileProgram(source, {
            signal: controller.signal,
            execute: ({ command, args, directory, signal }) =>
              new Promise((resolve, reject) => {
                try {
                  ensurePtyHelperExecutable();
                  const sandboxArgs = [
                    '-p',
                    profile(directory, false),
                    '/bin/sh',
                    '-c',
                    'ulimit -t 10; ulimit -f 20000; ulimit -n 1024; exec "$@"',
                    'study-code-terminal',
                    command,
                    ...args,
                  ];
                  // .NET Console.ReadLine performs its own terminal echo and line editing.
                  // Configure the PTY with a trusted utility before entering the sandbox.
                  terminal =
                    source.language === 'csharp'
                      ? spawn(
                          '/bin/sh',
                          [
                            '-c',
                            'stty -echo -echoctl; exec "$@"',
                            'study-code-terminal',
                            '/usr/bin/sandbox-exec',
                            ...sandboxArgs,
                          ],
                          {
                            cwd: directory,
                            env: {
                              ...processEnvironment(directory),
                              TERM: 'xterm-256color',
                            },
                            cols: 80,
                            rows: 20,
                          },
                        )
                      : spawn('/usr/bin/sandbox-exec', sandboxArgs, {
                          cwd: directory,
                          env: {
                            ...processEnvironment(directory),
                            TERM: 'xterm-256color',
                          },
                          cols: 80,
                          rows: 20,
                        });
                } catch (error) {
                  reject(error);
                  return;
                }
                const kill = () => {
                  try {
                    terminal.kill('SIGKILL');
                  } catch {
                    /* already exited */
                  }
                };
                signal.addEventListener('abort', kill, { once: true });
                const timer = setTimeout(
                  () => stop('2분을 넘어 실행을 중지했습니다. 다시 실행해 주세요.'),
                  executionTimeoutMs,
                );
                terminal.onData((text) => {
                  const chunk = text.slice(0, Math.max(0, MAX_OUTPUT - output.length));
                  output += chunk;
                  if (chunk) send({ type: 'data', text: chunk });
                  if (output.length >= MAX_OUTPUT) stop('출력 한도를 넘어 실행을 중지했습니다.');
                  if (ws.bufferedAmount > 500_000)
                    stop('출력 전송이 지연되어 실행을 중지했습니다.');
                });
                terminal.onExit(({ exitCode, signal: exitSignal }) => {
                  running = false;
                  clearTimeout(timer);
                  signal.removeEventListener('abort', kill);
                  resolve({
                    outcome: signal.aborted ? 'stopped' : exitCode === 0 ? 'success' : 'error',
                    output,
                    error:
                      reason ||
                      (exitCode === 0
                        ? ''
                        : `프로그램이 ${exitSignal ? `신호 ${exitSignal}` : `종료 코드 ${exitCode}`}로 종료되었습니다.`),
                  });
                });
                running = true;
                if (signal.aborted) kill();
                else send({ type: 'phase', phase: 'running' });
              }),
          });
          send({
            type: 'result',
            result: {
              ...result,
              stdin,
              mode: 'terminal',
              ...(reason ? { outcome: 'stopped', error: reason } : {}),
            },
          });
        } finally {
          release();
        }
        if (ws.readyState === WebSocket.OPEN) ws.close(1000);
      } catch (error) {
        stop(error.message || '실행하지 못했습니다.');
        send({
          type: 'failure',
          message: error.message || '실행하지 못했습니다.',
        });
        ws.close();
        // The compile/execute promise owns its lease until cleanup has completed.
      }
    });
  });
}
