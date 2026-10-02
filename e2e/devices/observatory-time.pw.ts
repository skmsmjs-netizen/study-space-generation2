import { expect, test } from '@playwright/test';

test('the real home follows KST across boundaries and keeps preferences and records', async ({
  page,
}, info) => {
  await page.clock.install({ time: new Date('2026-10-01T10:59:50Z') });
  await page.goto('?space=demo#/');
  const cover = page.getByRole('region', { name: '공부 사이의 풍경' });
  await expect(cover).toHaveAttribute('data-time-phase', 'sunset');
  await expect(cover.locator('[data-time-sky]')).toHaveCount(1);
  const stage = await cover.getAttribute('data-evolution-stage');
  const original = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  await cover.getByRole('button', { name: '풍경 멈추기', exact: true }).click();
  await cover.getByLabel('풍경 고르기', { exact: true }).click();
  await cover.getByRole('checkbox', { name: '혜성', exact: true }).uncheck();
  await page.clock.fastForward(60000);
  await expect(cover).toHaveAttribute('data-time-phase', 'night');
  await expect(cover).toHaveAttribute('data-motion', 'paused');
  await expect(cover).toHaveAttribute('data-evolution-stage', stage!);
  await expect(cover.locator('.pixel-time-cirrus')).toHaveCSS('animation-play-state', 'paused');
  await page.clock.setSystemTime(new Date('2026-10-01T14:59:50Z'));
  await page.clock.fastForward(60000);
  await expect(cover).toHaveAttribute('data-time-phase', 'late-night');
  await page.reload();
  await expect(cover).toHaveAttribute('data-time-phase', 'late-night');
  await expect(cover).toHaveAttribute('data-motion', 'paused');
  await cover.getByLabel('풍경 고르기', { exact: true }).click();
  await expect(cover.getByRole('checkbox', { name: '혜성', exact: true })).not.toBeChecked();
  await page.clock.setSystemTime(new Date('2026-10-02T03:00:00Z'));
  await page.clock.fastForward(60000);
  await expect(cover).toHaveAttribute('data-time-phase', 'day');
  await expect(cover).toHaveAttribute('data-evolution-stage', stage!);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(cover.locator('.pixel-time-cirrus')).toHaveCSS('animation-name', 'none');
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(original);
  await page.screenshot({ path: info.outputPath('daytime-real-home.png'), fullPage: true });
});
