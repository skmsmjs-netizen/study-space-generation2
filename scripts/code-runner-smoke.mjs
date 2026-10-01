import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createServer } from 'node:net';
import { compileProgram } from './code-runner.mjs';
const checks = [];
for (const language of ['c', 'cpp', 'csharp']) {
  const code =
    language === 'c'
      ? '#include <stdio.h>\nint main(void){int a,b;scanf("%d %d",&a,&b);printf("%d\\n",a+b);return 0;}'
      : language === 'cpp'
        ? '#include <iostream>\nint main(){int a,b;std::cin>>a>>b;std::cout<<a+b<<std::endl;}'
        : 'using System;class Program{static void Main(){int a=int.Parse(Console.ReadLine());int b=int.Parse(Console.ReadLine());Console.WriteLine(a+b);}}';
  const result = await compileProgram({ language, code, stdin: '3\n4\n' });
  assert.equal(result.outcome, 'success', result.error);
  assert.equal(result.output, '7\n');
  checks.push(`${language}:input-output`);
  const invalid = await compileProgram({ language, code: 'broken syntax }', stdin: '' });
  assert.equal(invalid.outcome, 'error');
  assert.ok(invalid.error);
  checks.push(`${language}:compile-error`);
}
const outside = await mkdtemp(path.join(tmpdir(), 'study-code-isolation-'));
try {
  const file = path.join(outside, 'synthetic-private.txt');
  await writeFile(file, 'TEST-ONLY-SENTINEL');
  const denied = await compileProgram({
    language: 'c',
    code: `#include <stdio.h>\nint main(void){FILE *f=fopen(${JSON.stringify(file)},"r");puts(f?"READ":"DENIED");return 0;}`,
    stdin: '',
  });
  assert.equal(denied.output, 'DENIED\n');
  checks.push('c:outside-file-denied');
  const deniedInclude = await compileProgram({
    language: 'c',
    code: `#include ${JSON.stringify(file)}\nint main(void){return 0;}`,
    stdin: '',
  });
  assert.equal(deniedInclude.outcome, 'error');
  assert.ok(/not permitted|denied/i.test(deniedInclude.error));
  checks.push('c:compile-include-denied');
} finally {
  await rm(outside, { recursive: true, force: true });
}
const processDenied = await compileProgram({
  language: 'c',
  code: '#include <unistd.h>\n#include <stdio.h>\nint main(void){puts(fork()<0?"DENIED":"FORKED");return 0;}',
  stdin: '',
});
assert.equal(processDenied.output, 'DENIED\n');
checks.push('c:runtime-fork-denied');
const syntheticServer = createServer((socket) => socket.end());
await new Promise((resolve) => syntheticServer.listen(0, '127.0.0.1', resolve));
try {
  const port = syntheticServer.address().port;
  const networkDenied = await compileProgram({
    language: 'c',
    code: `#include <sys/socket.h>\n#include <netinet/in.h>\n#include <stdio.h>\n#include <errno.h>\nint main(void){int fd=socket(AF_INET,SOCK_STREAM,0);struct sockaddr_in a={0};a.sin_family=AF_INET;a.sin_addr.s_addr=htonl(0x7f000001);a.sin_port=htons(${port});int r=connect(fd,(struct sockaddr*)&a,sizeof(a));puts(r<0&&(errno==EPERM||errno==EACCES)?"DENIED":"CONNECTED");return 0;}`,
    stdin: '',
  });
  assert.equal(networkDenied.output, 'DENIED\n');
  checks.push('c:network-connect-denied');
} finally {
  await new Promise((resolve) => syntheticServer.close(resolve));
}
const controller = new AbortController();
const pending = compileProgram(
  { language: 'c', code: 'int main(void){while(1){}}', stdin: '' },
  { signal: controller.signal },
);
setTimeout(() => controller.abort(), 1000);
assert.equal((await pending).outcome, 'stopped');
checks.push('c:cancel-infinite-loop');
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), checks }, null, 2));
