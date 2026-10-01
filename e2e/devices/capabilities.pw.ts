import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

test('microphone refusal and unavailable hardware preserve the manual notes path', async ({
  page,
}) => {
  test.skip(
    !/href:\s*["']\/materials["']/.test(readFileSync('src/App.tsx', 'utf8')),
    '이 버전에는 자료 화면이 없습니다.',
  );
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: async () => {
          throw new DOMException(
            'Synthetic device failure',
            sessionStorage.getItem('mic-error') || 'NotAllowedError',
          );
        },
      },
    });
  });
  await page.goto('?space=demo#/materials/new');
  const original = '  녹음 실패 전에 남긴 조건·예외\n두 번째 줄도 유지  ';
  const notes = page.getByLabel('강의 내용·필기', { exact: true });
  await notes.fill(original);
  await page.getByRole('button', { name: '녹음 시작', exact: true }).tap();
  await expect(page.getByRole('alert')).toContainText('마이크 사용이 허용되지 않았습니다');
  await expect(notes).toHaveValue(original);
  await expect(page.getByRole('button', { name: '녹음 파일 가져오기', exact: true })).toBeEnabled();
  await page.evaluate(() => sessionStorage.setItem('mic-error', 'NotReadableError'));
  await page.reload();
  await expect(notes).toHaveValue(original);
  await page.getByRole('button', { name: '녹음 시작', exact: true }).tap();
  await expect(page.getByRole('alert')).toContainText('다른 앱의 사용 여부');
  await expect(notes).toHaveValue(original);
  await expect(page.getByRole('button', { name: '녹음 파일 가져오기', exact: true })).toBeEnabled();
});
