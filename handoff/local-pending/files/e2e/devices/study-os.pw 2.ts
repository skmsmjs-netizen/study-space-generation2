import { test, expect } from '@playwright/test';

test('semester weeks, home details, monthly return and brand copy remain usable', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.clock.install({ time: new Date('2026-10-01T01:00:00Z') });
  await page.goto('?space=demo#/subject/demo-subject-math');
  await page.getByRole('button', { name: '주차 한 번에 만들기', exact: true }).tap();
  const dialog = page.getByRole('dialog', { name: '강의 주차 만들기' });
  await dialog.getByLabel('첫 강의 날짜', { exact: true }).fill('2026-10-01');
  await dialog.getByLabel('마지막 주차 기준일', { exact: true }).fill('2026-10-22');
  await dialog.getByLabel('주차 이름의 앞부분').fill('실제 흐름 확인');
  await dialog.getByRole('button', { name: '주차 미리보기', exact: true }).tap();
  await dialog
    .locator('summary')
    .filter({ hasText: /^2주차/ })
    .tap();
  await dialog.getByLabel('2주차 휴강·제외', { exact: true }).check();
  await dialog
    .locator('summary')
    .filter({ hasText: /^1주차/ })
    .tap();
  await dialog.getByLabel('1주차 메모 · 선택', { exact: true }).fill('  한글 원문\n조건과 예외  ');
  await dialog.getByRole('button', { name: '닫고 초안 보관', exact: true }).tap();
  await page.reload();
  await page.getByRole('button', { name: '주차 한 번에 만들기', exact: true }).tap();
  await dialog
    .locator('summary')
    .filter({ hasText: /^1주차/ })
    .tap();
  await expect(dialog.getByLabel('1주차 메모 · 선택', { exact: true })).toHaveValue(
    '  한글 원문\n조건과 예외  ',
  );
  await dialog.getByRole('button', { name: '3개 주차 등록', exact: true }).tap();
  await expect(dialog.getByRole('button', { name: '0개 주차 등록', exact: true })).toBeDisabled();
  await dialog.getByRole('button', { name: '이번 주차 생성 되돌리기', exact: true }).tap();
  await expect(dialog.getByRole('status')).toContainText('3개 주차를 휴지통으로 이동');
  await dialog.getByRole('button', { name: '닫고 초안 보관', exact: true }).tap();
  await page.reload();
  await page.getByRole('button', { name: '주차 한 번에 만들기', exact: true }).tap();
  await dialog.getByRole('button', { name: '되돌린 주차 복원', exact: true }).tap();
  await expect(dialog.getByRole('status')).toContainText('3개 주차를 복원');
  await dialog.getByRole('button', { name: '닫고 초안 보관', exact: true }).tap();
  await page.goto('?space=demo#/');
  await expect(
    page.getByRole('link', { name: /ManSeekSong OS.*공부가 이어지는 자리\./ }).first(),
  ).toBeVisible();
  const wordmark = page.getByRole('img', { name: 'ManSeekSong OS', exact: true }).first();
  await expect(wordmark).toBeVisible();
  const markBox = await wordmark.boundingBox();
  expect(markBox).not.toBeNull();
  expect(markBox!.x).toBeGreaterThanOrEqual(-1);
  expect(markBox!.x + markBox!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
  await page.screenshot({ path: info.outputPath('home-wordmark.png') });
  const home = page.getByRole('region', { name: '이번 주 일정', exact: true });
  await home.getByRole('button', { name: '일정 확인 · 실제 흐름 확인 · 1주차', exact: true }).tap();
  const detail = page.getByRole('dialog', { name: '시험·과제·강의 일정' });
  await expect(detail.getByLabel('일정 메모 · 선택')).toHaveValue('  한글 원문\n조건과 예외  ');
  await detail.getByLabel('일정 이름', { exact: true }).fill('수정하고 홈 복귀');
  await detail.getByRole('button', { name: '일정 저장', exact: true }).tap();
  await expect(detail).toHaveCount(0);
  await expect(home.getByRole('heading', { name: '수정하고 홈 복귀', exact: true })).toBeVisible();
  expect(await page.evaluate(() => location.hash)).toBe('#/');
  await page.getByRole('link', { name: '월간 기록 보기', exact: true }).tap();
  await page.getByLabel('요약할 월', { exact: true }).fill('2026-09');
  await page.getByRole('button', { name: '2026-09 공부 회차 원기록 보기', exact: true }).tap();
  await expect(page.getByRole('dialog', { name: '통계의 원기록' })).toBeVisible();
  await page.getByRole('button', { name: '통계의 원기록 닫기', exact: true }).tap();
  await page.reload();
  await expect(page.getByLabel('요약할 월', { exact: true })).toHaveValue('2026-09');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.screenshot({ path: info.outputPath('month-summary.png') });
  expect(errors).toEqual([]);
});
