import { afterEach, expect, it, vi } from 'vitest';
import { executeCodeTerminal } from './code-terminal';
import { currentCodeRun, validateCodeContent } from '../domain/code-example';
import type { CodeExampleContent } from '../domain/model';

class Socket {
  static OPEN = 1;
  static CONNECTING = 0;
  static latest: Socket;
  readyState = 0;
  sent: any[] = [];
  onopen?: () => void;
  onmessage?: (event: { data: string }) => void;
  onclose?: () => void;
  onerror?: () => void;
  constructor(public url: string) {
    Socket.latest = this;
  }
  send(text: string) {
    this.sent.push(JSON.parse(text));
  }
  close() {
    this.readyState = 3;
  }
  open() {
    this.readyState = 1;
    this.onopen?.();
  }
  message(message: object) {
    this.onmessage?.({ data: JSON.stringify(message) });
  }
}
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
const source = { language: 'c' as const, code: '// 당시 원문\nint main(){}' };
function start() {
  vi.stubGlobal('WebSocket', Socket);
  const output = vi.fn(),
    phase = vi.fn();
  const run = executeCodeTerminal(source, output, phase);
  const socket = Socket.latest;
  socket.open();
  return { run, socket, output, phase };
}
it('sends live input only after run phase, keeps exact source/output/input on disconnect', async () => {
  const { run, socket, output, phase } = start();
  expect(socket.sent).toEqual([{ type: 'start', ...source }]);
  run.write('not yet');
  expect(socket.sent).toHaveLength(1);
  socket.message({ type: 'phase', phase: 'running' });
  socket.message({ type: 'data', text: '값: ' });
  run.write('한글\r');
  expect(output).toHaveBeenCalledWith('값: ');
  expect(phase).toHaveBeenLastCalledWith('running');
  expect(socket.sent.at(-1)).toEqual({ type: 'input', text: '한글\r' });
  expect(run.snapshot()).toMatchObject({
    ...source,
    mode: 'terminal',
    stdin: '한글\r',
    output: '값: ',
    outcome: 'stopped',
  });
  socket.onclose?.();
  const result = await run.result;
  expect(result).toMatchObject({
    ...source,
    stdin: '한글\r',
    output: '값: ',
    outcome: 'error',
  });
  expect(result.error).toContain('끊겼습니다');
});
it('retains compilation failures, ignores stale output after completion, terminal results use actual keys', async () => {
  const { run, socket, output } = start();
  socket.message({
    type: 'result',
    result: {
      outcome: 'error',
      error: 'main.c:1: error',
      output: '',
      stdin: '',
    },
  });
  const result = await run.result;
  socket.message({ type: 'data', text: 'stale' });
  expect(output).not.toHaveBeenCalled();
  const content: CodeExampleContent = {
    ...source,
    title: '',
    notes: '',
    stdin: '미리 적어 둔 값',
    inputMode: 'terminal',
    lastRun: result,
  };
  expect(() => validateCodeContent(content)).not.toThrow();
  expect(currentCodeRun(content)).toBe(true);
  expect(currentCodeRun({ ...content, code: 'new source' })).toBe(false);
});
it('waits for cancellation acknowledgement but bounds an unresponsive connection', async () => {
  vi.useFakeTimers();
  const { run, socket } = start();
  socket.message({ type: 'phase', phase: 'running' });
  run.cancel();
  expect(socket.sent.at(-1)).toEqual({ type: 'cancel' });
  await vi.advanceTimersByTimeAsync(4000);
  expect((await run.result).outcome).toBe('stopped');
  expect(socket.readyState).toBe(3);
});
it('remote authentication is sent once in the first frame, excluded from source snapshots and URLs', async () => {
  vi.stubGlobal('WebSocket', Socket);
  const run = executeCodeTerminal(source, vi.fn(), vi.fn(), { url: 'wss://terminal.example/terminal', authenticate: async () => 'private-token' });
  await Promise.resolve();
  const socket = Socket.latest;
  expect(socket.url).toBe('wss://terminal.example/terminal');
  socket.open();
  expect(socket.sent[0]).toEqual({ type: 'start', ...source, token: 'private-token' });
  expect(JSON.stringify(run.snapshot())).not.toContain('private-token');
  run.cancel(); socket.onclose?.();
  expect((await run.result).outcome).toBe('stopped');
});
it('cancel during session refresh never opens a late authenticated socket', async () => {
  vi.stubGlobal('WebSocket', Socket);
  let authenticated!: (token: string) => void;
  const previous = Socket.latest;
  const run = executeCodeTerminal(source, vi.fn(), vi.fn(), { url: 'wss://terminal.example/terminal', authenticate: () => new Promise(resolve => { authenticated = resolve; }) });
  run.cancel(); authenticated('private-token'); await Promise.resolve();
  expect(Socket.latest).toBe(previous);
  expect((await run.result).outcome).toBe('stopped');
});
