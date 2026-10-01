import { readFileSync } from 'node:fs';
import { expect, test, devices, type BrowserContext, type Page } from '@playwright/test';
const fixture = process.env.CODE_MOBILE_ACCOUNT_FILE;
test.skip(!fixture, 'Opt-in approved synthetic account; never use an actual user account.');
const cases = [
  {
    language: 'c',
    title: '서버 재열기 · C 합계',
    code: '#include <stdio.h>\n// 합성 코드 원문\nint main(void){int a,b;scanf("%d%d",&a,&b);printf("합계: %d\\n",a+b);return 0;}',
    stdin: '3\n4',
    output: '합계: 7',
  },
  {
    language: 'cpp',
    title: '서버 재열기 · C++ 반복',
    code: '#include <iostream>\nint main(){int n;std::cin>>n;for(int i=1;i<=n;++i)std::cout<<i<<" ";}',
    stdin: '4',
    output: '1 2 3 4',
  },
  {
    language: 'csharp',
    title: '서버 재열기 · C# 한글',
    code: 'using System;class Program{static void Main(){Console.WriteLine("안녕하세요, "+Console.ReadLine());}}',
    stdin: '연습자',
    output: '안녕하세요, 연습자',
  },
];
async function login(page: Page) {
  const account = JSON.parse(readFileSync(fixture!, 'utf8'));
  if (!account.email.startsWith('code-mobile-') || !account.email.endsWith('@example.invalid'))
    throw Error('Only this task synthetic account is allowed.');
  await page.goto('./?space=personal#/code');
  await expect(page.getByLabel('이메일', { exact: true })).toBeVisible();
  await page.getByLabel('이메일', { exact: true }).fill(account.email);
  await page.getByLabel('비밀번호', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: '로그인', exact: true }).click();
  await expect(page.getByRole('button', { name: '예제 추가', exact: true })).toBeVisible();
}
async function synced(page: Page) {
  await expect(
    page.locator('.code-save-bar').getByText('서버에 저장됨', { exact: true }),
  ).toBeVisible({ timeout: 40_000 });
}
test('iPhone stores three examples on the actual server; a fresh iPad login receives exact code, notes, inputs and results', async ({
  browser,
  baseURL,
}, info) => {
  test.setTimeout(180_000);
  let context: BrowserContext = await browser.newContext({ ...devices['iPhone 13'], baseURL });
  let page = await context.newPage();
  const urls = [];
  try {
    await login(page);
    console.log('Synthetic iPhone login ready.');
    for (const item of cases) {
      console.log('Editing synthetic ' + item.language + ' example.');
      const existing = page.getByRole('link', { name: item.title, exact: true });
      if (await existing.count()) await existing.click();
      else await page.getByRole('button', { name: '예제 추가', exact: true }).click();
      await page.getByLabel('언어', { exact: true }).selectOption(item.language);
      await page.getByLabel('예제 제목', { exact: true }).fill(item.title);
      await expect(page.locator('.code-touch-editor .cm-content')).toBeVisible();
      await page.locator('.code-touch-editor .cm-content').fill(item.code);
      await page.getByLabel('실행 방식', { exact: true }).selectOption('batch');
      await page.getByLabel('실행에 사용할 입력값', { exact: true }).fill(item.stdin);
      await page
        .getByLabel('내용·설명', { exact: true })
        .fill('  공백 보존\n' + item.title + '의 설명\n  마지막 공백  ');
      await page.getByRole('button', { name: '실행', exact: true }).click();
      // Prior output remains visible while running; wait for this execution to finish.
      await expect(page.getByRole('button', { name: '실행', exact: true })).toBeEnabled({
        timeout: 45_000,
      });
      await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText(
        item.output,
      );
      await page.getByRole('button', { name: '지금 저장', exact: true }).click();
      await synced(page);
      console.log('Server acknowledged ' + item.language + ' output.');
      urls.push(page.url());
      await page.getByRole('link', { name: '← 예제 목록', exact: true }).click();
    }
    await page.screenshot({ path: info.outputPath('iphone-server-examples.png'), fullPage: true });
    await context.close();
    context = await browser.newContext({ ...devices['iPad (gen 7)'], baseURL });
    page = await context.newPage();
    await login(page);
    console.log('Fresh synthetic iPad login ready.');
    for (const item of cases) {
      await page.getByRole('link', { name: item.title, exact: true }).click();
      await expect(page.getByLabel('예제 제목', { exact: true })).toHaveValue(item.title);
      await expect(page.locator('.code-touch-editor .cm-content')).toBeVisible();
      expect(await page.locator('.code-touch-editor .cm-content').innerText()).toBe(item.code);
      await expect(page.getByLabel('실행에 사용할 입력값', { exact: true })).toHaveValue(
        item.stdin,
      );
      await expect(page.getByLabel('내용·설명', { exact: true })).toHaveValue(
        '  공백 보존\n' + item.title + '의 설명\n  마지막 공백  ',
      );
      await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText(
        item.output,
      );
      await page.reload();
      await expect(page.getByLabel('예제 제목', { exact: true })).toHaveValue(item.title);
      await page.getByRole('link', { name: '← 예제 목록', exact: true }).click();
    }
    await page.screenshot({ path: info.outputPath('ipad-server-reopened.png'), fullPage: true });
  } finally {
    await context.close();
  }
});

// A genuine save failure must keep the local edit through reload and retry the same outbox.
test('failed server save survives reload, and Save now delivers it to a fresh iPad', async ({
  browser,
  baseURL,
}) => {
  test.setTimeout(100_000);
  let context = await browser.newContext({ ...devices['iPhone 13'], baseURL });
  let page = await context.newPage();
  const notes = '  서버 재시도 시험\n한글 원문과 공백 보존  ';
  const block = async (route: import('@playwright/test').Route) => {
    if (route.request().method() === 'POST' && route.request().postDataJSON()?.action === 'execute')
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: '합성 저장 실패' }),
      });
    else await route.continue();
  };
  try {
    await login(page);
    await page.getByRole('link', { name: cases[0].title, exact: true }).click();
    await page.route('**/functions/v1/study-command', block);
    await page.getByLabel('내용·설명', { exact: true }).fill(notes);
    await page.getByRole('button', { name: '지금 저장', exact: true }).click();
    await expect(page.locator('.code-save-bar')).toContainText('서버 저장 다시 필요');
    await page.reload();
    await expect(page.getByLabel('내용·설명', { exact: true })).toHaveValue(notes);
    await page.unroute('**/functions/v1/study-command', block);
    await page.getByRole('button', { name: '지금 저장', exact: true }).click();
    await synced(page);
    await context.close();
    context = await browser.newContext({ ...devices['iPad (gen 7)'], baseURL });
    page = await context.newPage();
    await login(page);
    await page.getByRole('link', { name: cases[0].title, exact: true }).click();
    await expect(page.getByLabel('내용·설명', { exact: true })).toHaveValue(notes);
    expect(await page.locator('.code-touch-editor .cm-content').innerText()).toBe(cases[0].code);
    await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText(
      cases[0].output,
    );
  } finally {
    await context.close();
  }
});
