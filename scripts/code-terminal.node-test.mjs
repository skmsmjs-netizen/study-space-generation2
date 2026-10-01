import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { WebSocket } from 'ws';
import { attachCodeTerminal } from './code-terminal.mjs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

test(
  'real PTY input, cancellation, EOF, isolation and cleanup',
  { skip: process.platform !== 'darwin', timeout: 180000 },
  async (t) => {
    let busy = false;
    const server = createServer();
    attachCodeTerminal(server, {
      // Exercise cancellation and limits with a short, but usable, input window.
      executionTimeoutMs: 5000,
      acquire: () => {
        if (busy) return false;
        busy = true;
        return true;
      },
      release: () => {
        busy = false;
      },
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const address = origin.replace('http', 'ws') + '/__code-terminal';
    const run = (language, code, react) =>
      new Promise((resolve, reject) => {
        const ws = new WebSocket(address, { origin });
        const timer = setTimeout(() => {
          ws.terminate();
          reject(Error('Terminal test timed out'));
        // The runner permits 30 seconds for compilation before PTY execution.
        // Let that bounded result arrive instead of aborting a valid cold compile.
        }, 45000);
        let output = '',
          step = 0;
        const send = (message) => ws.send(JSON.stringify(message));
        ws.on('open', () => send({ type: 'start', language, code }));
        ws.on('error', reject);
        ws.on('message', (raw) => {
          const message = JSON.parse(raw.toString());
          if (message.type === 'data') {
            output += message.text;
            step = react?.(output, send, step, ws) ?? step;
          }
          if (message.type === 'failure') {
            clearTimeout(timer);
            resolve({ outcome: 'error', error: message.message });
          }
          if (message.type === 'result') {
            clearTimeout(timer);
            resolve(message.result);
            ws.close();
          }
        });
        ws.on('close', () => {
          clearTimeout(timer);
          if (step === -1) resolve(null);
        });
      });
    try {
      const examples = {
        c: '#include <stdio.h>\nint main(){int a,b;printf("FIRST: ");scanf("%d",&a);printf("SECOND: ");scanf("%d",&b);printf("SUM=%d\\n",a+b);}',
        cpp: '#include <iostream>\nint main(){int a,b;std::cout<<"FIRST: ";std::cin>>a;std::cout<<"SECOND: ";std::cin>>b;std::cout<<"SUM="<<a+b<<std::endl;}',
        csharp:
          'using System;class Program{static void Main(){Console.Write("FIRST: ");int a=int.Parse(Console.ReadLine());Console.Write("SECOND: ");int b=int.Parse(Console.ReadLine());Console.WriteLine("SUM="+(a+b));}}',
      };
      for (const [language, code] of Object.entries(examples))
        await t.test(
          `${language}: two successive inputs after prompts without newlines`,
          async () => {
            const result = await run(language, code, (text, send, step) => {
              if (!step && text.includes('FIRST: ')) {
                send({ type: 'input', text: '3\r' });
                return 1;
              }
              if (step === 1 && text.includes('SECOND: ')) {
                send({ type: 'input', text: '4\r' });
                return 2;
              }
              return step;
            });
            assert.equal(result.outcome, 'success', result.error);
            assert.match(result.output, /SUM=7/);
            assert.equal(result.stdin, '3\r4\r');
            assert.equal(result.mode, 'terminal');
          },
        );
      await t.test('UTF-8, terminal backspace and EOF reach the live process', async () => {
        const result = await run(
          'c',
          '#include <stdio.h>\nint main(){char s[100];printf("LINE: ");fgets(s,100,stdin);printf("VALUE=%s",s);printf("END: ");printf("EOF=%d\\n",getchar()==EOF);}',
          (text, send, step) => {
            if (!step && text.includes('LINE: ')) {
              send({ type: 'input', text: '한글X\x7f\r' });
              return 1;
            }
            if (step === 1 && text.includes('END: ')) {
              send({ type: 'input', text: '\x04' });
              return 2;
            }
            return step;
          },
        );
        assert.equal(result.outcome, 'success', result.error);
        assert.match(result.output, /VALUE=한글\r\n/);
        assert.match(result.output, /EOF=1/);
      });
      await t.test('cancels an input wait and frees its slot for the next run', async () => {
        const result = await run(
          'c',
          '#include <stdio.h>\nint main(){printf("WAIT: ");getchar();}',
          (text, send, step) => {
            if (!step && text.includes('WAIT: ')) {
              send({ type: 'cancel' });
              return 1;
            }
            return step;
          },
        );
        assert.equal(result.outcome, 'stopped');
        assert.equal(busy, false);
        const next = await run('c', 'int main(){return 0;}');
        assert.equal(next.outcome, 'success');
      });
      await t.test('disconnect kills the process and releases the slot after cleanup', async () => {
        await run(
          'c',
          '#include <stdio.h>\nint main(){printf("WAIT: ");getchar();}',
          (text, _, step, ws) => {
            if (!step && text.includes('WAIT: ')) {
              ws.close();
              return -1;
            }
            return step;
          },
        );
        const until = Date.now() + 4000;
        while (busy && Date.now() < until) await new Promise((resolve) => setTimeout(resolve, 20));
        assert.equal(busy, false);
      });
      await t.test('compile error returns diagnostics and a new run still works', async () => {
        const bad = await run('c', 'int main(){return !!!;}');
        assert.equal(bad.outcome, 'error');
        assert.match(bad.error, /error:/);
        assert.equal((await run('c', 'int main(){return 0;}')).outcome, 'success');
      });
      await t.test('rejects another origin before accepting source code', async () => {
        const status = await new Promise((resolve, reject) => {
          const ws = new WebSocket(address, {
            origin: 'https://example.org',
          });
          ws.on('unexpected-response', (_, res) => {
            resolve(res.statusCode);
            res.destroy();
          });
          ws.on('open', () => {
            ws.close();
            reject(Error('Origin was accepted'));
          });
        });
        assert.equal(status, 403);
      });
      await t.test('time and output limits stop execution and release the slot', async () => {
        const timed = await run('c', '#include <stdio.h>\nint main(){printf("WAIT: ");getchar();}');
        assert.equal(timed.outcome, 'stopped');
        assert.match(timed.error, /넘어 실행을 중지/);
        const flood = await run(
          'c',
          '#include <stdio.h>\nint main(){for(;;)puts("0123456789012345678901234567890123456789");}',
        );
        assert.equal(flood.outcome, 'stopped');
        assert.equal(flood.output.length, 100000);
        assert.match(flood.error, /출력 한도/);
        assert.equal(busy, false);
      });
      await t.test(
        'runtime cannot read another directory, fork, or connect to network',
        async () => {
          const fixture = await mkdtemp(path.join(tmpdir(), 'study-terminal-denied-'));
          const file = path.join(fixture, 'private.txt');
          try {
            await writeFile(file, 'synthetic private data');
            const code = `#include <stdio.h>\n#include <unistd.h>\n#include <sys/socket.h>\n#include <arpa/inet.h>\nint main(){FILE*f=fopen(${JSON.stringify(file)},"r");printf("PRIVATE=%d\\n",f==NULL);printf("FORK=%d\\n",fork()==-1);int s=socket(AF_INET,SOCK_STREAM,0);struct sockaddr_in a={.sin_family=AF_INET,.sin_port=htons(${server.address().port})};inet_pton(AF_INET,"127.0.0.1",&a.sin_addr);printf("NETWORK=%d\\n",connect(s,(struct sockaddr*)&a,sizeof(a))==-1);}`;
            const result = await run('c', code);
            assert.equal(result.outcome, 'success', result.error);
            assert.match(result.output, /PRIVATE=1/);
            assert.match(result.output, /FORK=1/);
            assert.match(result.output, /NETWORK=1/);
          } finally {
            await rm(fixture, { recursive: true, force: true });
          }
        },
      );
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  },
);
