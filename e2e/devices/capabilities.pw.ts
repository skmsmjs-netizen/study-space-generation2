import { test, expect } from '@playwright/test';

test('transcript entry preserves exact manual notes after reentry without requesting a microphone', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: {
      getUserMedia: async () => { throw new DOMException('Microphone is unavailable', 'NotAllowedError'); },
    } });
  });
  await page.goto('?space=demo#/materials/new');
  const notes = page.getByLabel('강의 내용·필기', { exact: true });
  const original = '  화자 1 · 00:12 조건과 예외\n추가로 남긴 필기도 유지  ';
  await notes.fill(original);
  await page.reload();
  await expect(notes).toHaveValue(original);
  await expect(page.getByRole('link', { name: '클로바노트 열기', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '녹음 시작', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: '녹음 파일 가져오기', exact: true })).toHaveCount(0);
  await expect(page.getByRole('alert')).toHaveCount(0);
});
