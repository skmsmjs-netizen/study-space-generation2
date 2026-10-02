import { expect, test } from '@playwright/test';
test('API budget ring keeps reservations, exact values and narrow layout readable', async ({
  page,
}) => {
  await page.goto(new URL('api-budget.html', process.env.STUDY_AI_FIXTURE_URL!).href);
  const ring = page.getByRole('img');
  await expect(ring).toHaveAccessibleName(/남은 월 예산 US\$7.0, 상한의 70.0%/);
  await expect(page.locator('.api-budget-pending').first()).toHaveAttribute(
    'stroke-dasharray',
    '10 90',
  );
  await expect(page.locator('.api-budget-values')).toContainText('US$1.0');
  await page.getByRole('button', { name: '예약 정산' }).click();
  await expect(ring).toHaveAccessibleName(/남은 월 예산 US\$7.0, 상한의 70.0%/);
  await page.getByRole('button', { name: '낮은 상한' }).click();
  await expect(ring).toHaveAccessibleName(/남은 월 예산 US\$0.0/);
  await expect(page.getByRole('status')).toContainText('US$2.0');
  await page.getByRole('button', { name: '사용 전' }).click();
  await expect(ring).toHaveAccessibleName(/100.0%/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.reload();
  await expect(ring).toHaveAccessibleName(/남은 월 예산 US\$7.0, 상한의 70.0%/);
});
