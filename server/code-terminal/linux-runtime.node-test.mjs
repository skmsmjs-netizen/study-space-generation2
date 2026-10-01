import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, unlink } from 'node:fs/promises';
import { startLinuxExecution } from './linux-runtime.mjs';

async function execution(language, code, interact = () => {}) {
  const controller = new AbortController();
  let output = '', terminal, ready = false;
  const deadline = setTimeout(() => controller.abort(), 55000);
  const result = await startLinuxExecution({ language, code }, {
    signal: controller.signal,
    onOutput(chunk) { output += chunk; if (ready) interact({ output, terminal, stop: () => controller.abort() }); },
    onPhase(phase) { if (phase === 'running') { ready = true; interact({ output, terminal, stop: () => controller.abort() }); } },
    onReady(handle) { terminal = handle; },
  }).finally(() => clearTimeout(deadline));
  return { ...result, output };
}
test('C prompts are visible before each repeated scanf input, without source injection', { timeout: 60000 }, async () => {
  let first = false, second = false;
  const result = await execution('c', '#include <stdio.h>\nint main(){int a,b;printf("first: ");if(scanf("%d",&a)!=1)return 1;printf("second: ");if(scanf("%d",&b)!=1)return 2;printf("sum=%d\\n",a+b);return 0;}', ({ output, terminal }) => {
    if (output.includes('first: ') && !first) { first = true; terminal.write('3\r'); }
    if (output.includes('second: ') && !second) { second = true; terminal.write('4\r'); }
  });
  assert.equal(result.outcome, 'success', JSON.stringify(result)); assert.match(result.output, /sum=7/);
  assert.equal(first && second, true);
});
test('C++20 repeated input and UTF-8 Korean output', { timeout: 60000 }, async () => {
  let sent = false;
  const result = await execution('cpp', '#include <iostream>\n#include <ranges>\nint main(){int n; std::cout<<"개수: ";std::cin>>n;for(auto i:std::views::iota(1,n+1))std::cout<<i<<" ";}', ({ output, terminal }) => {
    if (output.includes('개수: ') && !sent) { sent = true; terminal.write('4\r'); }
  });
  assert.equal(result.outcome, 'success', JSON.stringify(result)); assert.match(result.output, /1 2 3 4/);
});
test('Csharp Console.ReadLine round-trips Korean and a second input', { timeout: 60000 }, async () => {
  let name = false, age = false;
  const result = await execution('csharp', 'using System; class Program { static void Main(){Console.Write("이름: ");var n=Console.ReadLine();Console.Write("나이: ");var a=Console.ReadLine();Console.WriteLine($"안녕하세요, {n} · {a}");}}', ({ output, terminal }) => {
    if (output.includes('이름: ') && !name) { name = true; terminal.write('연습자\r'); }
    if (output.includes('나이: ') && !age) { age = true; terminal.write('20\r'); }
  });
  assert.equal(result.outcome, 'success', JSON.stringify(result)); assert.match(result.output, /안녕하세요, 연습자 · 20/);
});
test('compile errors remain visible, then a new clean execution succeeds', { timeout: 60000 }, async () => {
  const failed = await execution('c', 'int main(){broken syntax;}');
  assert.equal(failed.outcome, 'error'); assert.match(failed.output, /error:/);
  const next = await execution('c', '#include <stdio.h>\nint main(){puts("clean");}');
  assert.equal(next.outcome, 'success', JSON.stringify(next)); assert.match(next.output, /clean/);
});
test('EOF reaches scanf and stop kills even a SIGTERM-ignoring child', { timeout: 60000 }, async () => {
  let eof = false;
  const result = await execution('c', '#include <stdio.h>\nint main(){int x;printf("input: ");printf("result=%d\\n",scanf("%d",&x));}', ({ output, terminal }) => {
    if (output.includes('input: ') && !eof) { eof = true; terminal.write('\u0004'); }
  });
  assert.equal(result.outcome, 'success', JSON.stringify(result)); assert.match(result.output, /result=-1/);
  let stopped = false;
  const stoppedRun = await execution('c', '#include <stdio.h>\n#include <signal.h>\n#include <unistd.h>\nint main(){signal(SIGTERM,SIG_IGN);puts("running");fflush(stdout);while(1)sleep(1);}', ({ output, stop }) => {
    if (output.includes('running') && !stopped) { stopped = true; stop(); }
  });
  assert.equal(stoppedRun.outcome, 'stopped');
  const next = await execution('c', 'int main(){return 0;}'); assert.equal(next.outcome, 'success', JSON.stringify(next));
});
test('sandbox denies a host sentinel and outbound sockets; threads and memory are bounded', { timeout: 60000 }, async () => {
  const sentinel = '/tmp/study-terminal-private-sentinel';
  await writeFile(sentinel, 'PRIVATE_SENTINEL');
  try {
    const result = await execution('c', '#include <stdio.h>\n#include <unistd.h>\n#include <sys/socket.h>\n#include <arpa/inet.h>\n#include <sys/wait.h>\nint main(){FILE*f=fopen("/tmp/study-terminal-private-sentinel","r");printf("file=%d\\n",f!=0);int s=socket(AF_INET,SOCK_STREAM,0);struct sockaddr_in a={.sin_family=AF_INET,.sin_port=htons(443)};inet_pton(AF_INET,"1.1.1.1",&a.sin_addr);printf("network=%d\\n",connect(s,(void*)&a,sizeof(a))==0);int n=0;while(n<256){int p=fork();if(p<0)break;if(p==0){sleep(1);return 0;}n++;}while(wait(0)>0){}printf("processes=%d\\n",n);}', () => {});
    assert.equal(result.outcome, 'success', JSON.stringify(result)); assert.match(result.output, /file=0/); assert.match(result.output, /network=0/);
    const processes = Number(/processes=(\d+)/.exec(result.output)?.[1]); assert.ok(processes > 0 && processes < 128, JSON.stringify(result));
  } finally { await unlink(sentinel); }
});
test('aggregate memory exhaustion is stopped and leaves the next sandbox clean', { timeout: 60000 }, async () => {
  const result = await execution('c', '#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\nint main(){while(1){void*p=malloc(32*1024*1024);if(!p)return 4;memset(p,1,32*1024*1024);} }');
  assert.equal(result.outcome, 'error', JSON.stringify(result));
  const next = await execution('c', 'int main(){return 0;}'); assert.equal(next.outcome, 'success', JSON.stringify(next));
});
test('real WebSocket gateway accepts two live scanf inputs and returns the original source', { timeout: 60000 }, async t => {
  const { once } = await import('node:events');
  const { WebSocket } = await import('ws');
  const { createTerminalGateway } = await import('./gateway.mjs');
  const calls = [];
  const origin = 'https://study.example';
  const server = createTerminalGateway({ origins: [origin], access: async (_, body) => { calls.push(body.action); return { job: '00000000-0000-4000-8000-000000000000' }; } });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const ws = new WebSocket(`ws://127.0.0.1:${server.address().port}/terminal`, { origin });
  t.after(async () => { ws.terminate(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); });
  await once(ws, 'open');
  const code = '#include <stdio.h>\nint main(){int a,b;printf("first: ");scanf("%d",&a);printf("second: ");scanf("%d",&b);printf("sum=%d\\n",a+b);return 0;}';
  let output = '', first = false, second = false;
  const result = new Promise((resolve, reject) => {
    ws.on('message', raw => {
      const message = JSON.parse(raw.toString());
      if (message.type === 'failure') reject(Error(message.message));
      if (message.type === 'result') resolve(message.result);
      if (message.type === 'data') {
        output += message.text;
        if (output.includes('first: ') && !first) { first = true; ws.send(JSON.stringify({ type: 'input', text: '3\r' })); }
        if (output.includes('second: ') && !second) { second = true; ws.send(JSON.stringify({ type: 'input', text: '4\r' })); }
      }
    });
  });
  ws.send(JSON.stringify({ type: 'start', language: 'c', code, token: 'synthetic-auth-token' }));
  const run = await result; assert.equal(run.code, code); assert.equal(run.stdin, '3\r4\r'); assert.equal(run.outcome, 'success', JSON.stringify(run)); assert.match(run.output, /sum=7/);
  await once(ws, 'close'); assert.deepEqual(calls, ['reserve', 'release']);
});
