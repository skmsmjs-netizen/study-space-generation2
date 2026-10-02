import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.skip(!process.env.STUDY_AI_FIXTURE_URL, '격리된 자료 화면이 필요합니다.');
test('복습 묶음은 한 번 생성하고 퀴즈 응답·원문·내보내기를 저장 후 다시 연다', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (req) => {
    if (/^https?:/.test(req.url()) && !req.url().startsWith(process.env.STUDY_AI_FIXTURE_URL!))
      external.push(req.url());
  });
  await page.goto(process.env.STUDY_AI_FIXTURE_URL! + '#/materials/new');
  const source =
    'V=IR. 저항이 일정할 때만 비례한다.\n온도에 따라 저항이 달라질 수 있다.\n' +
    '조건과 예외를 보존한다. '.repeat(200);
  await page.getByRole('textbox', { name: '자료 제목', exact: true }).fill('합성 복습 묶음');
  await page.getByRole('textbox', { name: '강의 내용·필기', exact: true }).fill(source);
  await expect(page.getByRole('combobox', { name: 'GPT 작업', exact: true })).toHaveValue(
    'study-pack',
  );
  await expect(page.getByRole('combobox', { name: '카드·퀴즈 개수', exact: true })).toHaveValue(
    '5',
  );
  await page.getByRole('button', { name: '복습 자료 한 번에 만들기', exact: true }).tap();
  await expect(page.getByRole('button', { name: '퀴즈 1', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '개념도', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '플래시카드 2', exact: true }).tap();
  await expect(page.getByText('합성 첫 숨긴 답', { exact: true })).not.toBeVisible();
  await page.getByRole('button', { name: '답 보기', exact: true }).tap();
  await expect(page.getByText('합성 첫 숨긴 답', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '퀴즈 1', exact: true }).tap();
  await page.getByRole('button', { name: '새 퀴즈 시작', exact: true }).tap();
  await expect(page.getByText('제출 뒤에만 표시할 합성 해설', { exact: true })).not.toBeVisible();
  await page.getByRole('radio', { name: '합성 둘째 보기', exact: true }).check();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '원문 TXT', exact: true }).tap();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  expect(await readFile(path!, 'utf8')).toBe(source);
  await expect(page.getByText(/이 시도에서 자료·보조 결과를 열었습니다/)).toBeVisible();
  await page.getByRole('button', { name: '자료 저장', exact: true }).tap();
  await expect(page.getByLabel('합성 GPT 호출')).toHaveText('1');
  await page.reload();
  const sourceDetails = page.locator('details.material-source-region');
  if ((await sourceDetails.getAttribute('open')) === null)
    await sourceDetails.locator(':scope > summary').tap();
  await expect(page.getByRole('textbox', { name: '강의 내용·필기', exact: true })).toHaveValue(
    source,
  );
  await expect(page.getByRole('radio', { name: '합성 둘째 보기', exact: true })).toBeChecked();
  await page.getByRole('button', { name: '답 제출 · 해설 확인', exact: true }).tap();
  await expect(page.getByText('제출 뒤에만 표시할 합성 해설', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '다른 답·미응답 문항 다시 풀기', exact: true }).tap();
  await expect(page.getByRole('radio', { name: '합성 둘째 보기', exact: true })).not.toBeChecked();
  await page.getByRole('button', { name: '개념도', exact: true }).tap();
  await expect(page.getByText('저항이 일정할 때 비례', { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel('합성 GPT 호출')).toHaveText('1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  expect(external).toEqual([]);
});
