import { test, expect } from '@playwright/test';

test('chemistry values, invalid drafts, reopen, route return and reload remain connected', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('?space=demo#/concepts');
  const launch = page.getByRole('button', { name: '일반화학 · 교재와 관찰 열기', exact: true });
  await launch.click();
  await page.getByLabel('일반화학 개념 찾기').fill('이상기체식');
  await page.locator('.chem-list').getByRole('button', { name: '이상기체식', exact: true }).click();
  await page.getByRole('button', { name: '이 질문의 작은 관찰', exact: true }).click();
  const temperature = page.getByLabel('절대온도 T (K)', { exact: true });
  const pressure = page.getByLabel('압력 P (atm)', { exact: true });
  await temperature.fill('600'); await temperature.press('Tab');
  await expect(page.locator('output')).toContainText('49.234');
  await pressure.fill('0'); await pressure.press('Tab');
  await expect(page.locator('output')).toContainText('49.234');
  await expect(page.getByText('입력 범위·단위·정수 조건을 확인해야 한다. 확정값은 유지한다.', { exact: true })).toBeVisible();
  const dialog = page.getByRole('dialog', { name: '일반화학 · 교재와 관찰', exact: true });
  await dialog.getByRole('button', { name: /닫기$/ }).click();
  await expect(launch).toBeFocused();
  await launch.click();
  await page.getByRole('button', { name: '이 질문의 작은 관찰', exact: true }).click();
  await expect(pressure).toHaveValue('0');
  await page.getByRole('button', { name: '전체 관찰 작업면으로', exact: true }).click();
  await expect(page).toHaveURL(/#\/math$/);
  await expect(temperature).toHaveValue('600');
  await expect(pressure).toHaveValue('0');
  await page.getByRole('button', { name: '자료 곁의 작은 관찰로', exact: true }).click();
  await expect(page).toHaveURL(/#\/concepts$/);
  await page.reload();
  await launch.click();
  await page.getByRole('button', { name: '이 질문의 작은 관찰', exact: true }).click();
  await expect(pressure).toHaveValue('0');
  await expect(page.locator('output')).toContainText('49.234');
  await page.getByRole('button', { name: '원문 위치 열기', exact: true }).click();
  const source = page.getByRole('dialog', { name: '일반화학 원문 위치', exact: true });
  await source.getByLabel('원본 PDF 직접 선택').setInputFiles({
    name: 'wrong.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.0\nwrong source'),
  });
  await expect(source.getByRole('alert')).toContainText('SHA-256');
  await source.getByRole('button', { name: /닫기$/ }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await expect(page.locator('.chemistry-observatory .katex-error')).toHaveCount(0);
  expect(errors).toEqual([]);
});
