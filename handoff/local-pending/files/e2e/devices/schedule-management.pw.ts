import { test, expect } from '@playwright/test';

test('calendar, uncertain deadlines, weekly evidence and recovery survive touch editing and reload', async ({
  page,
}, info) => {
  const original = '  과제 원문·조건·예외\n수정 이유까지 보존  ';
  await page.goto('?space=demo#/schedules');
  await expect(
    page.getByRole('heading', { name: '일정·과제·온라인 강의', exact: true, level: 1 }),
  ).toBeVisible();
  await page.getByRole('button', { name: '과제 추가', exact: true }).tap();
  await page.getByLabel('일정 이름', { exact: true }).fill('검증 과제');
  await page.getByLabel('일정 기한 · 선택', { exact: true }).fill('2026-10-08');
  await page.getByLabel('기한 시각 · 선택', { exact: true }).fill('23:00');
  await page.getByLabel('일정 메모 · 선택', { exact: true }).fill(original);
  await page.getByRole('button', { name: '일정 저장', exact: true }).tap();
  await page.getByLabel('검증 과제 · 과제 준비', { exact: true }).selectOption('done');
  await expect(page.getByLabel('검증 과제 · 과제 제출', { exact: true })).toHaveValue('unknown');
  await page.getByRole('button', { name: '달력', exact: true }).tap();
  await page.getByLabel('달력 월', { exact: true }).fill('2026-10');
  await expect(page.locator('.schedule-day')).toHaveCount(42);
  await page.getByRole('button', { name: '2026-10-08 · 일정 1개', exact: true }).tap();
  await page.getByRole('button', { name: '휴지통으로 이동', exact: true }).tap();
  await page.getByLabel('일정 보관 상태', { exact: true }).selectOption('trash');
  await page.getByRole('button', { name: '일정 복원', exact: true }).tap();
  await page.getByLabel('일정 보관 상태', { exact: true }).selectOption('active');
  await page.reload();
  await expect(page.getByLabel('검증 과제 · 과제 준비', { exact: true })).toHaveValue('done');
  await expect(page.getByLabel('검증 과제 · 과제 제출', { exact: true })).toHaveValue('unknown');
  await page.getByRole('button', { name: '일정 수정', exact: true }).tap();
  await expect(page.getByLabel('일정 메모 · 선택', { exact: true })).toHaveValue(original);
  await expect(page.getByLabel('기한 시각 · 선택', { exact: true })).toHaveValue('23:00');
  await page.getByRole('button', { name: '닫고 초안 보관', exact: true }).tap();
  await page.getByRole('button', { name: '온라인 강의 추가', exact: true }).tap();
  await page.getByLabel('일정 이름', { exact: true }).fill('검증 미정 강의');
  await page.getByLabel('공지 확인일 · 선택', { exact: true }).fill('2026-10-02');
  await page.getByLabel('필기·메모 상태도 따로 확인', { exact: true }).check();
  await page.getByRole('button', { name: '일정 저장', exact: true }).tap();
  await page.getByLabel('검증 미정 강의 · 강의 재생', { exact: true }).selectOption('done');
  await expect(page.getByLabel('검증 미정 강의 · 출석 확인', { exact: true })).toHaveValue(
    'unknown',
  );
  await expect(page.getByLabel('검증 미정 강의 · 필기·메모', { exact: true })).toHaveValue(
    'unknown',
  );
  await page.getByLabel('일정 종류 보기', { exact: true }).selectOption('unknown');
  await page.reload();
  await expect(page.getByLabel('일정 종류 보기', { exact: true })).toHaveValue('unknown');
  await expect(page.getByRole('heading', { name: '검증 미정 강의', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '주차별 강의 추가', exact: true }).tap();
  await page.getByLabel('일정 이름', { exact: true }).fill('검증 주차 강의');
  await page.getByLabel('시작 가능일 · 선택', { exact: true }).fill('2026-10-01');
  await page.getByLabel('일정 기한 · 선택', { exact: true }).fill('2026-10-02');
  await page.getByText('매주 반복해서 등록', { exact: true }).tap();
  await page.getByLabel('매주 반복 마지막 날 · 선택', { exact: true }).fill('2026-10-15');
  await page.getByRole('button', { name: '닫고 초안 보관', exact: true }).tap();
  await page.reload();
  await page.getByRole('button', { name: '주차별 강의 추가', exact: true }).tap();
  await page.getByText('매주 반복해서 등록', { exact: true }).tap();
  await expect(page.getByLabel('매주 반복 마지막 날 · 선택', { exact: true })).toHaveValue(
    '2026-10-15',
  );
  await page.getByRole('button', { name: '일정 저장', exact: true }).tap();
  await page.getByLabel('일정 종류 보기', { exact: true }).selectOption('all');
  await expect(page.getByRole('heading', { name: '검증 주차 강의', exact: true })).toHaveCount(3);
  await page.getByLabel('검증 주차 강의 · 1주차 · 출석 확인', { exact: true }).selectOption('done');
  await expect(page.getByLabel('검증 주차 강의 · 2주차 · 출석 확인', { exact: true })).toHaveValue(
    'unknown',
  );
  await expect(page.getByLabel('검증 주차 강의 · 3주차 · 출석 확인', { exact: true })).toHaveValue(
    'unknown',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.screenshot({ path: info.outputPath('schedule-management.png'), fullPage: true });
});
