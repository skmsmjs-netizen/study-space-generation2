import { expect, test } from '@playwright/test';
for (const language of ['c', 'cpp', 'csharp']) test(`${language}: native mobile input twice, save and reload retain original notes and terminal result`, async ({ page }) => {
  let started: { code: string; token: string };
  const inputs: string[] = [];
  await page.routeWebSocket('wss://terminal.fixture.invalid/terminal', socket => {
    socket.onMessage(raw => {
      const message = JSON.parse(String(raw));
      if (message.type === 'start') {
        started = message;
        socket.send(JSON.stringify({ type: 'phase', phase: 'running' }));
        socket.send(JSON.stringify({ type: 'data', text: '이름: ' }));
      } else if (message.type === 'input') {
        inputs.push(message.text);
        socket.send(JSON.stringify({ type: 'data', text: message.text }));
        if (inputs.length === 1) socket.send(JSON.stringify({ type: 'data', text: '\r\n나이: ' }));
        else socket.send(JSON.stringify({ type: 'result', result: { outcome: 'success', error: '', output: `이름: ${inputs[0]}\r\n나이: ${inputs[1]}\r\n안녕하세요, 연습자 · 20`, stdin: inputs.join('') } }));
      }
    });
  });
  await page.goto('/');
  await page.getByLabel('언어', { exact: true }).selectOption(language);
  const code = language === 'c' ? '#include <stdio.h>\nint main(){char name[100];int age;scanf("%99s %d",name,&age);return 0;}' : language === 'cpp' ? '#include <iostream>\nint main(){std::string name;int age;std::cin>>name>>age;}' : 'using System;class Program{static void Main(){var name=Console.ReadLine();var age=Console.ReadLine();}}';
  await page.getByLabel('소스 코드', { exact: true }).fill(code);
  const notes = '  조건과 예외\n실제 공부 기록이 아닌 화면 검사  ';
  await page.getByLabel('내용·설명', { exact: true }).fill(notes);
  await page.getByRole('button', { name: '실행', exact: true }).click();
  const input = page.getByLabel('터미널에 보낼 입력', { exact: true });
  await expect(input).toBeEnabled();
  await input.fill('연습자');
  await input.dispatchEvent('compositionstart');
  await input.press('Enter');
  expect(inputs).toEqual([]);
  await input.dispatchEvent('compositionend');
  await input.fill('연습자');
  await page.getByRole('button', { name: '입력 보내기', exact: true }).click();
  await expect(input).toHaveValue('');
  await input.fill('20'); await input.press('Enter');
  await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText('안녕하세요, 연습자 · 20');
  expect(inputs).toEqual(['연습자\r', '20\r']);
  expect(started!.code).toBe(code);
  expect(started!.token).toBe('synthetic-test-token');
  await page.getByRole('button', { name: '지금 저장', exact: true }).click();
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('synthetic-test-token');
  await page.reload();
  await expect(page.getByLabel('내용·설명', { exact: true })).toHaveValue(notes);
  await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText('안녕하세요, 연습자 · 20');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});
test('remote connection loss keeps input and output and allows another run', async ({ page }) => {
  await page.routeWebSocket('wss://terminal.fixture.invalid/terminal', socket => {
    socket.onMessage(raw => {
      const message = JSON.parse(String(raw));
      if (message.type === 'start') { socket.send(JSON.stringify({ type: 'phase', phase: 'running' })); socket.send(JSON.stringify({ type: 'data', text: '중간 출력: ' })); }
      if (message.type === 'input') socket.close();
    });
  });
  await page.goto('/'); await page.getByRole('button', { name: '실행', exact: true }).click();
  const input = page.getByLabel('터미널에 보낼 입력', { exact: true });
  await expect(input).toBeEnabled(); await input.fill('복구할 입력');
  await page.getByRole('button', { name: '입력 보내기', exact: true }).click();
  await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText('중간 출력: ');
  await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText('끊겼습니다');
  await expect(page.getByRole('button', { name: '실행', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: '지금 저장', exact: true }).click(); await page.reload();
  await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText('복구할 입력');
});
