import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { WebSocket } from 'ws';
import { createTerminalGateway, createAccessClient } from './gateway.mjs';

const origin = 'https://study.example';
async function fixture(t, { access, execute, ...options } = {}) {
  const calls = [];
  const server = createTerminalGateway({ origins: [origin], access: access ?? (async (token, body) => { calls.push({ token, body }); return { job: '00000000-0000-4000-8000-000000000000' }; }), execute, ...options });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const ws = new WebSocket(`ws://127.0.0.1:${server.address().port}/terminal`, { origin });
  t.after(async () => { ws.terminate(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); });
  await once(ws, 'open');
  const messages = [], listeners = [];
  ws.on('message', raw => { const message = JSON.parse(raw.toString()); messages.push(message); for (const listener of listeners) listener(); });
  const until = predicate => new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(Error('gateway event timeout')), 3000);
    const check = () => { if (predicate(messages)) { clearTimeout(timeout); resolve(messages); } };
    listeners.push(check); check();
  });
  return { ws, calls, messages, until, send: message => ws.send(JSON.stringify(message)) };
}
const start = { type: 'start', language: 'c', code: 'int main(){}', token: 'test-access-token' };
test('repeated live input, original source, cleanup, no token in results', async t => {
  const inputs = [];
  let done;
  const f = await fixture(t, { execute: async (source, handlers) => {
    assert.deepEqual(source, { language: 'c', code: start.code });
    handlers.onReady({ write: text => { inputs.push(text); handlers.onOutput(text); if (inputs.length === 2) done({ outcome: 'success', error: '' }); }, resize() {} });
    handlers.onPhase('running'); handlers.onOutput('첫 값: ');
    return new Promise(resolve => { done = resolve; });
  } });
  f.send(start); await f.until(messages => messages.some(m => m.phase === 'running'));
  f.send({ type: 'input', text: '3\r' }); f.send({ type: 'input', text: '4\r' });
  await f.until(messages => messages.some(m => m.type === 'result'));
  assert.deepEqual(inputs, ['3\r', '4\r']);
  const result = f.messages.find(m => m.type === 'result').result;
  assert.equal(result.stdin, '3\r4\r'); assert.equal(result.code, start.code);
  assert.equal(JSON.stringify(result).includes(start.token), false);
  await once(f.ws, 'close');
  assert.deepEqual(f.calls.map(c => c.body.action), ['reserve', 'release']);
});
test('authentication failure never enters the execution engine', async t => {
  let entered = false;
  const f = await fixture(t, { access: async () => { throw Error('다시 로그인해 주세요.'); }, execute: async () => { entered = true; } });
  f.send(start); await f.until(messages => messages.some(m => m.type === 'failure'));
  assert.equal(entered, false);
});
test('closing the socket aborts a running program and releases the lease', async t => {
  let stopped = false;
  const f = await fixture(t, { execute: async (_, handlers) => {
    handlers.onReady({ write() {}, resize() {} }); handlers.onPhase('running');
    return new Promise(resolve => handlers.signal.addEventListener('abort', () => { stopped = true; resolve({ outcome: 'stopped', error: '' }); }, { once: true }));
  } });
  f.send(start); await f.until(messages => messages.some(m => m.phase === 'running'));
  f.ws.close(); await once(f.ws, 'close');
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.equal(stopped, true); assert.equal(f.calls.at(-1).body.action, 'release');
});
test('cross-origin upgrade and token in URL are rejected', async t => {
  const server = createTerminalGateway({ origins: [origin], access: async () => ({}) });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  for (const [suffix, requestOrigin] of [['/terminal', 'https://attacker.example'], ['/terminal?token=private', origin]]) {
    const ws = new WebSocket(`ws://127.0.0.1:${server.address().port}${suffix}`, { origin: requestOrigin });
    const [error] = await once(ws, 'error'); assert.match(error.message, /403/);
  }
});
test('output flooding is bounded and interrupts the runtime', async t => {
  const f = await fixture(t, { execute: async (_, handlers) => {
    handlers.onReady({ write() {}, resize() {} }); handlers.onPhase('running');
    handlers.onOutput('x'.repeat(110000));
    assert.equal(handlers.signal.aborted, true);
    return { outcome: 'success', error: '' };
  } });
  f.send(start); await f.until(messages => messages.some(m => m.type === 'result'));
  const result = f.messages.find(m => m.type === 'result').result;
  assert.equal(result.output.length, 100000); assert.equal(result.outcome, 'stopped');
});
test('access client calls only pinned Supabase URL with bearer outside the body', async () => {
  let sent;
  const access = createAccessClient({ url: 'https://project.supabase.co', publishableKey: 'sb_publishable_test', transport: async (url, init) => { sent = { url, init }; return Response.json({ job: '00000000-0000-4000-8000-000000000000' }); } });
  await access('private-test-token', { action: 'reserve' });
  assert.equal(sent.init.headers.Authorization, 'Bearer private-test-token');
  assert.equal(sent.init.body.includes('private-test-token'), false);
  assert.throws(() => createAccessClient({ url: 'https://attacker.example', publishableKey: 'sb_publishable_test' }));
});
