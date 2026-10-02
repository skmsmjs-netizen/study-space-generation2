import { test, expect, type Page } from '@playwright/test';
import { decodeStoredText } from '../../src/data/storage-codec';

async function storedData(page: Page) {
  const raw = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  if (!raw) throw Error('격리된 예시 공간의 저장 자료가 없습니다.');
  return JSON.parse(decodeStoredText(raw)).data;
}

test('shared date, subject and original selection reaches several charts and keyboard values without changing records', async ({
  page,
}, info) => {
  await page.clock.setFixedTime(new Date('2026-10-02T01:00:00Z'));
  await page.goto('?space=demo#/record');
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  const original = '  공유 선택 검증용 합성 원문\n조건·예외를 그대로 보존합니다.  ';
  await page.getByRole('textbox', { name: '메모', exact: true }).first().fill(original);
  await page.getByRole('button', { name: '1개 주제 기록 저장', exact: true }).click();
  await expect.poll(async () => (await storedData(page)).records.length).toBe(1);
  const before = (await storedData(page)).records;
  await page.goto('?space=demo#/statistics');
  await page.getByRole('checkbox', { name: '여러 그래프 한눈에 보기' }).check();
  const shared = page.getByRole('region', { name: '그래프와 원기록 함께 선택' });
  await shared.getByLabel('함께 선택할 시작일', { exact: true }).fill('2026-10-02');
  await shared.getByLabel('함께 선택할 종료일', { exact: true }).fill('2026-10-02');
  await shared.getByRole('button', { name: '날짜를 함께 선택', exact: true }).click();
  await expect(shared.getByRole('status')).toContainText(
    '선택된 근거 1개 / 현재 범위 전체 근거 1개',
  );
  expect(
    await page.locator('.statistics-gallery [data-shared-selection="active"]').count(),
  ).toBeGreaterThanOrEqual(4);
  const firstValues = page.locator('.statistics-gallery-card').first().locator('summary').first();
  await firstValues.focus();
  await page.keyboard.press('Enter');
  const table = page.locator('.statistics-gallery-card').first().getByRole('table');
  await expect(table.locator('tr[data-shared-selected="true"]')).toHaveCount(1);
  await expect(table.getByText(/함께 선택됨/)).toBeVisible();
  await shared.getByRole('button', { name: '선택한 원기록 보기', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '통계의 원기록', exact: true });
  await expect(dialog.getByText(original, { exact: true }).first()).toBeVisible();
  await dialog.getByRole('button', { name: '이 원기록 함께 선택', exact: true }).first().click();
  await dialog.getByRole('button', { name: '통계의 원기록 닫기', exact: true }).click();
  await expect(shared.getByRole('status')).toContainText('선택된 근거 1개');
  await shared.getByLabel('함께 선택할 과목', { exact: true }).selectOption('demo-subject-math');
  await shared.getByRole('button', { name: '과목을 함께 선택', exact: true }).click();
  await expect(shared.getByRole('status')).toContainText('선택된 근거 1개');
  await shared.getByLabel('함께 선택할 시작일', { exact: true }).fill('2026-10-03');
  await shared.getByLabel('함께 선택할 종료일', { exact: true }).fill('2026-10-03');
  await shared.getByRole('button', { name: '날짜를 함께 선택', exact: true }).click();
  await expect(shared.getByRole('status')).toContainText(
    '선택된 근거 0개 / 현재 범위 전체 근거 1개',
  );
  await shared.getByRole('button', { name: '공유 선택 해제', exact: true }).click();
  await expect(shared.getByRole('status')).toContainText('공유 선택 없음');
  await expect(page.locator('[data-shared-selection="active"]')).toHaveCount(0);
  expect((await storedData(page)).records).toEqual(before);
  await page.reload();
  await expect(shared.getByRole('status')).toContainText('공유 선택 없음');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await shared.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('statistics-shared-selection.png') });
});

test('math pins A, changes real B, compares one common scale and restores A without changing the saved scene', async ({
  page,
}, info) => {
  await page.goto('?space=demo#/math');
  await page.getByLabel('그래프 도구', { exact: true }).selectOption('plotly');
  const note = '  A/B 비교용 합성 메모\n원문·조건·예외  ';
  await page.getByLabel('관찰·메모 (선택)', { exact: true }).fill(note);
  await page.getByRole('button', { name: '수식과 메모 저장', exact: true }).click();
  await expect(page.getByText('이 기기에 저장했습니다.', { exact: true })).toBeVisible();
  const before = (await storedData(page)).memos;
  const comparison = page.getByRole('region', { name: '수식 조건 A와 B 비교', exact: true });
  await comparison.getByRole('button', { name: '현재 조건을 A로 고정', exact: true }).click();
  await expect(comparison.getByRole('row', { name: '매개값 a 2 2', exact: true })).toBeVisible();
  const aPath = await comparison.locator('.math-comparison-a').getAttribute('d');
  // Lock shared axes before B changes: unchanged A must keep its exact on-screen path.
  await comparison.getByRole('button', { name: '비교 그래프 확대', exact: true }).click();
  const pinnedPath = await comparison.locator('.math-comparison-a').getAttribute('d');
  expect(pinnedPath).not.toBe(aPath);
  const aInput = page.getByRole('textbox', { name: 'a 값', exact: true });
  await aInput.fill('3');
  await aInput.press('Enter');
  await expect(comparison.getByRole('row', { name: '매개값 a 2 3', exact: true })).toBeVisible();
  expect(await comparison.locator('.math-comparison-a').getAttribute('d')).toBe(pinnedPath);
  expect(await comparison.locator('.math-comparison-b').getAttribute('d')).not.toBe(pinnedPath);
  await expect(comparison.getByText(/가로·세로 1의 길이가 같습니다/)).toBeVisible();
  await comparison.getByLabel('A와 B를 함께 볼 평면', { exact: true }).selectOption('xz');
  await expect(comparison.getByRole('img')).toHaveAttribute('aria-label', /가로 x · 세로 z/);
  await comparison.getByRole('button', { name: '두 조건 전체 맞춤', exact: true }).click();
  expect((await storedData(page)).memos).toEqual(before);
  await page.reload();
  await expect(comparison.getByRole('row', { name: '매개값 a 2 3', exact: true })).toBeVisible();
  await expect(page.getByLabel('관찰·메모 (선택)', { exact: true })).toHaveValue(note);
  expect((await storedData(page)).memos).toEqual(before);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await comparison.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('math-comparison.png') });
  await comparison.getByRole('button', { name: '비교 종료', exact: true }).click();
  await expect(comparison.getByRole('table')).toHaveCount(0);
  expect((await storedData(page)).memos).toEqual(before);
});
