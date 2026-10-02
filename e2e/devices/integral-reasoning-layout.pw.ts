import { test, expect } from '@playwright/test';
test('reasoning layout keeps the full flow together and explanations readable', async ({
  page,
}, info) => {
  await page.goto('?space=demo&math=series#/math');
  await expect(page.getByRole('heading', { name: '급수의 수렴을 어떻게 판단할까?' })).toBeVisible();
  await page.getByRole('button', { name: /이상적분은 수렴하는가/ }).tap();
  await expect(page.getByRole('img', { name: /감소 곡선/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  const layout = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll('.reasoning-node > button')].map((e) =>
      e.getBoundingClientRect(),
    );
    const detail = document.querySelector('.reasoning-detail')!.getBoundingClientRect();
    return {
      wide: innerWidth > 832,
      gaps: nodes.slice(1).map((n, i) => n.top - nodes[i].bottom),
      detailWidth: detail.width,
    };
  });
  if (layout.wide) expect(Math.max(...layout.gaps)).toBeLessThan(180);
  expect(layout.detailWidth).toBeGreaterThan(230);
  await page.screenshot({ path: info.outputPath('final-layout.png'), fullPage: true });
  await page.getByRole('button', { name: /어떤 판정법이 맞을까/ }).tap();
  await expect(page.getByRole('combobox', { name: '판정법 후보 비교', exact: true })).toBeVisible();
});
