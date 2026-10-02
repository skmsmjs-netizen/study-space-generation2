import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.skip(!process.env.STUDY_AI_FIXTURE_URL, '격리된 합성 자료 화면이 필요합니다.');
test('클로바 전사문 파일과 필기는 생성·저장·재접속 후 보존되고 녹음 조작은 없다', async ({
  page,
}) => {
  const errors: string[] = [],
    external: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (/^https?:/.test(r.url()) && !r.url().startsWith(process.env.STUDY_AI_FIXTURE_URL!))
      external.push(r.url());
  });
  await page.goto(process.env.STUDY_AI_FIXTURE_URL! + '#/materials/new');
  const original =
    '참석자 1 00:12\n전압은 전류와 저항의 곱이다. 저항이 일정한 조건.\n참석자 2 00:35\n예외와 질문도 그대로 남긴다.  ';
  const long = (original + '\n').repeat(2000);
  await expect(page.getByRole('button', { name: '녹음 시작', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: '녹음 파일 가져오기', exact: true })).toHaveCount(
    0,
  );
  await page.getByRole('textbox', { name: '자료 제목', exact: true }).fill('클로바 전사 검증');
  await page
    .getByRole('textbox', { name: '강의 내용·필기', exact: true })
    .fill('사용자의 추가 필기 · 예외 보존');
  await page.getByLabel('클로바노트 전사문 파일', { exact: true }).setInputFiles({
    name: '클로바 전사문.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from(long),
  });
  await expect(
    page.getByText('원문을 가져왔습니다. 사용할 구간을 확인해 주세요.', { exact: true }),
  ).toBeVisible();
  const sourceDocument = page.locator('.material-source-document');
  await sourceDocument.locator('> summary').tap();
  await expect(page.getByText(/전체 원문을 보관했습니다. 긴 자료는 일부 구간부터/)).toBeVisible();
  await expect(page.getByLabel('합성 GPT 호출')).toHaveText('0');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: '원본 내려받기', exact: true }).tap();
  const download = await downloadEvent;
  expect(await readFile((await download.path())!, 'utf8')).toBe(long);
  await page.getByRole('combobox', { name: 'GPT 작업', exact: true }).selectOption('formula');
  await page.getByRole('button', { name: '수식 보완 만들기', exact: true }).tap();
  await expect(page.locator('math')).toHaveCount(1);
  await page.getByRole('button', { name: '자료 저장', exact: true }).tap();
  await expect(page.getByLabel('합성 GPT 호출')).toHaveText('1');
  await page.reload();
  await expect(page.getByRole('textbox', { name: '자료 제목', exact: true })).toHaveValue(
    '클로바 전사 검증',
  );
  await expect(page.getByRole('textbox', { name: '강의 내용·필기', exact: true })).toHaveValue(
    '사용자의 추가 필기 · 예외 보존',
  );
  await sourceDocument.locator('> summary').tap();
  const recoveredDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: '원본 내려받기', exact: true }).tap();
  expect(await readFile((await (await recoveredDownload).path())!, 'utf8')).toBe(long);
  await expect(page.locator('math')).toHaveCount(1);
  await expect(page.getByLabel('합성 GPT 호출')).toHaveText('1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
