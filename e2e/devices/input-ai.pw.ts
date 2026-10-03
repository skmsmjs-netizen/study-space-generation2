import { test, expect } from '@playwright/test';
test.skip(!process.env.STUDY_AI_FIXTURE_URL, '격리 GPT 합성 주소가 필요합니다.');
const url = () => process.env.STUDY_AI_FIXTURE_URL! + 'input-ai.html';
test('입력 도움의 검토→재연습·별도 저장·실패 복귀·재접속은 원문과 숨긴 답을 보존한다', async ({
  page,
}) => {
  const external: string[] = [];
  page.on('request', (r) => {
    if (/^https?:/.test(r.url()) && !r.url().startsWith(process.env.STUDY_AI_FIXTURE_URL!))
      external.push(r.url());
  });
  await page.goto(url());
  const original = '  I=VR\n조건·예외 😀 é';
  await page.getByRole('textbox', { name: '작성 중인 원문', exact: true }).fill(original);
  await page.getByRole('button', { name: '입력으로 GPT 도움', exact: true }).tap();
  const dialog = page.getByRole('dialog', { name: '입력으로 GPT 도움', exact: true });
  await expect(dialog.getByRole('button', { name: '선택한 GPT 도움 실행' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('synthetic-generation-calls'))).toBeNull();
  await dialog.getByRole('combobox', { name: 'GPT 도움 작업' }).selectOption('feedback');
  await dialog
    .getByRole('textbox', { name: '실제 문제와 조건', exact: true })
    .fill('V=10 V, R=5 Ω일 때 전류를 구한다.');
  await dialog.getByRole('button', { name: '현재 입력을 풀이로 가져오기' }).tap();
  await dialog
    .getByRole('textbox', { name: '확인할 해설·판단 기준' })
    .fill('이상 저항의 옴의 법칙 I=V/R. 단위는 A.');
  await dialog.getByRole('button', { name: '선택한 GPT 도움 실행' }).tap();
  await expect(dialog.getByRole('region', { name: 'GPT 도움 결과' })).toBeVisible();
  await dialog.getByRole('button', { name: '다른 맥락의 재연습 준비' }).tap();
  await expect(dialog.getByRole('combobox', { name: 'GPT 도움 작업' })).toHaveValue('practice');
  await expect(dialog.getByRole('textbox', { name: '현재 풀이·막힌 단계' })).toHaveValue(original);
  expect(await page.evaluate(() => localStorage.getItem('synthetic-generation-calls'))).toBe('1');
  await dialog.getByRole('button', { name: '선택한 GPT 도움 실행' }).tap();
  await expect(dialog.getByRole('combobox', { name: '보관한 도움 결과' })).toHaveValue('1');
  const details = dialog.getByText('답·해설 확인', { exact: true }).first();
  await expect(details).toBeVisible();
  await expect(dialog.getByText('합성 첫 숨긴 답', { exact: true })).not.toBeVisible();
  await details.tap();
  await expect(dialog.getByText('합성 첫 숨긴 답', { exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: '작성하던 자리로 돌아가기' }).tap();
  await expect(page.getByRole('textbox', { name: '작성 중인 원문', exact: true })).toHaveValue(
    original,
  );
  await page.getByRole('checkbox', { name: '합성 저장 실패' }).check();
  await page.getByRole('button', { name: '입력으로 GPT 도움', exact: true }).tap();
  await dialog.getByRole('button', { name: '입력·결과를 자료에 저장' }).tap();
  await expect(dialog.getByText('합성 저장 실패', { exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: '작성하던 자리로 돌아가기' }).tap();
  await page.getByRole('checkbox', { name: '합성 저장 실패' }).uncheck();
  await page.getByRole('button', { name: '입력으로 GPT 도움', exact: true }).tap();
  await dialog.getByRole('button', { name: '입력·결과를 자료에 저장' }).tap();
  await expect(dialog.getByText(/자료에 보관했습니다/)).toBeVisible();
  await dialog.getByRole('button', { name: '작성하던 자리로 돌아가기' }).tap();
  await expect(page.getByLabel('보관한 자료 수')).toHaveText('1');
  await expect(page.getByLabel('보관한 결과 수')).toHaveText('2');
  await page.reload();
  await page.getByRole('button', { name: '입력으로 GPT 도움', exact: true }).tap();
  await expect(dialog.getByRole('combobox', { name: 'GPT 도움 작업' })).toHaveValue('practice');
  await expect(dialog.getByRole('combobox', { name: '보관한 도움 결과' })).toHaveValue('1');
  expect(await page.evaluate(() => localStorage.getItem('synthetic-generation-calls'))).toBe('2');
  expect(external).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
});
