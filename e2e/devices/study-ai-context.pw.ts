import { test, expect } from '@playwright/test';
import { STUDY_GPT_PROMPT_VERSION } from '../../src/server/study-gpt-prompt';

// Dedicated owner-shaped synthetic fixture; never authenticate a real account or call GPT.
test.skip(!process.env.STUDY_AI_FIXTURE_URL, '격리 GPT 합성 화면 주소가 필요합니다.');
test('선택 기록·후속 편집·수식 결과는 터치와 재접속 후에도 보존된다', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const external: string[] = [];
  page.on('request', (request) => {
    if (
      /^https?:/.test(request.url()) &&
      !request.url().startsWith(process.env.STUDY_AI_FIXTURE_URL!)
    )
      external.push(request.url());
  });
  await page.goto(process.env.STUDY_AI_FIXTURE_URL! + '#/materials/new');
  const original = '  원래 필기의 조건·예외\n둘째 줄은 유지한다.  ';
  await page.getByRole('textbox', { name: '자료 제목', exact: true }).fill('기기 환경 검증 자료');
  await page.getByRole('textbox', { name: '강의 내용·필기', exact: true }).fill(original);
  await page.getByText('기존 기록 가져오기', { exact: true }).tap();
  await expect(page.getByText('66개 중 30개 표시 · 0개 선택', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '다음 기록 더 보기', exact: true }).tap();
  await expect(page.getByText('66개 중 60개 표시 · 0개 선택', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: '가져올 기록 찾기', exact: true }).fill('검증 메모 64:');
  await page.getByRole('checkbox', { name: /메모 · 검증 메모 64:/ }).check();
  await page.getByRole('button', { name: '선택한 기록 가져오기', exact: true }).tap();
  const notes = page.getByRole('textbox', {
    name: '강의 내용·필기',
    exact: true,
  });
  const imported = await notes.inputValue();
  expect(imported.startsWith(original + '\n\n')).toBe(true);
  expect(imported).toContain('"id":"m64"');
  expect(imported).toContain('저항이 일정한 조건을 확인한다.');
  await expect(page.getByLabel('합성 GPT 호출')).toHaveText('0');
  await page.getByRole('button', { name: '마지막 가져오기 되돌리기', exact: true }).tap();
  await expect(notes).toHaveValue(original);
  await page.getByRole('checkbox', { name: /메모 · 검증 메모 64:/ }).check();
  await page.getByRole('button', { name: '선택한 기록 가져오기', exact: true }).tap();
  await expect(notes).toHaveValue(imported);
  const edited = imported + '\n사용자가 이후 추가한 조건';
  await notes.fill(edited);
  await page.getByRole('button', { name: '마지막 가져오기 되돌리기', exact: true }).tap();
  await expect(page.getByText(/가져온 뒤 필기를 수정했습니다/)).toBeVisible();
  await expect(notes).toHaveValue(edited);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.getByRole('combobox', { name: 'GPT 작업', exact: true }).selectOption('formula');
  await page.getByRole('button', { name: '수식 보완 만들기', exact: true }).tap();
  await expect(page.locator('math')).toHaveCount(1);
  await page.getByRole('button', { name: '자료 저장', exact: true }).tap();
  await expect(page.getByLabel('합성 GPT 호출')).toHaveText('1');
  await expect(page.getByLabel('저장된 프롬프트 버전')).toHaveText(STUDY_GPT_PROMPT_VERSION);
  await page.reload();
  await expect(page.getByRole('textbox', { name: '자료 제목', exact: true })).toHaveValue(
    '기기 환경 검증 자료',
  );
  await expect(notes).toHaveValue(edited);
  await expect(page.locator('math')).toHaveCount(1);
  await expect(page.getByLabel('합성 GPT 호출')).toHaveText('1');
  await expect(page.getByLabel('저장된 프롬프트 버전')).toHaveText(STUDY_GPT_PROMPT_VERSION);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
