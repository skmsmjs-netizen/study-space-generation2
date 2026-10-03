import { test, expect } from '@playwright/test';

test('agenda selects one task and restores date, exact note and caller after editing and reload', async ({
  page,
}, info) => {
  await page.goto('?space=demo#/schedules');
  await expect(
    page.getByRole('heading', { name: '일정·과제·온라인 강의', exact: true }),
  ).toBeVisible();
  for (const name of ['첫 번째 과제', '두 번째 과제 · 긴 이름과 조건을 그대로 읽는 일정']) {
    await page.getByRole('button', { name: '과제 추가', exact: true }).tap();
    await page.getByLabel('일정 이름', { exact: true }).fill(name);
    await page.getByLabel('일정 기한 · 선택', { exact: true }).fill('2026-10-08');
    await page
      .getByLabel('일정 메모 · 선택', { exact: true })
      .fill('  원문·조건·예외\n줄바꿈 그대로  ');
    await page.getByRole('button', { name: '일정 저장', exact: true }).tap();
  }
  await expect(page.locator('.schedule-agenda-row')).toHaveCount(2);
  await expect(page.getByRole('button', { name: '일정 수정', exact: true })).toHaveCount(1);
  await page.getByRole('button', { name: '달력', exact: true }).tap();
  await page.getByLabel('달력 월', { exact: true }).fill('2026-10');
  await page.getByRole('button', { name: '2026-10-08 · 일정 2개', exact: true }).tap();
  await page.getByRole('button', { name: '일정 보기 · 첫 번째 과제', exact: true }).tap();
  await page.getByLabel('첫 번째 과제 · 과제 준비', { exact: true }).selectOption('done');
  await expect(page.getByLabel('첫 번째 과제 · 과제 제출', { exact: true })).toHaveValue('unknown');
  await page.reload();
  await expect(
    page.getByRole('button', { name: '2026-10-08 · 일정 2개', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByLabel('첫 번째 과제 · 과제 준비', { exact: true })).toHaveValue('done');
  await page.getByRole('button', { name: '일정 수정', exact: true }).tap();
  await expect(page.getByLabel('일정 메모 · 선택', { exact: true })).toHaveValue(
    '  원문·조건·예외\n줄바꿈 그대로  ',
  );
  await page
    .getByLabel('일정 메모 · 선택', { exact: true })
    .fill('  수정 원문\n조건·예외·끝 공백  ');
  await page.getByRole('button', { name: '일정 저장', exact: true }).tap();
  await expect(
    page.getByRole('button', { name: '2026-10-08 · 일정 2개', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: '일정 목록으로 돌아가기', exact: true }).tap();
  await expect(
    page.getByRole('button', { name: '일정 보기 · 첫 번째 과제', exact: true }),
  ).toBeFocused();
  await page
    .getByRole('button', {
      name: '일정 보기 · 두 번째 과제 · 긴 이름과 조건을 그대로 읽는 일정',
      exact: true,
    })
    .tap();
  await expect(
    page.getByLabel('두 번째 과제 · 긴 이름과 조건을 그대로 읽는 일정 · 과제 준비', {
      exact: true,
    }),
  ).toHaveValue('unknown');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.screenshot({ path: info.outputPath('agenda-selected.png'), fullPage: true });
});

test('a narrow task region inside a wide window reveals the selected detail and restores an accumulated list', async ({ page }) => {
  const { createDemoState } = await import('../../src/domain/fixtures');
  const { emptyRecommendations, recommendationKey } = await import('../../src/data/recommendations');
  const data = createDemoState(), workspace = emptyRecommendations(data);
  workspace.schedules = Array.from({ length: 32 }, (_, i) => ({ id: `contained-${i}`, subjectId: data.subjects[0].id, name: `누적 일정 ${i}`, kind: 'lecture' as const, goalIds: [], targetIds: [], dueDate: '2026-10-08', opensDate: '', weight: null, status: 'active' as const, states: {}, dueMeaning: 'attendance' as const, note: `  원문 ${i}\n조건과 예외  ` }));
  const raw = JSON.stringify(workspace), key = recommendationKey(data);
  await page.addInitScript(({ key, raw }) => { if (!localStorage.getItem(key)) localStorage.setItem(key, raw); }, { key, raw });
  await page.goto('?space=demo#/schedules');
  await page.addStyleTag({ content: '#main { max-inline-size: 44rem !important; margin-inline:auto !important; }' });
  await expect(page.locator('.schedule-agenda-row')).toHaveCount(20);
  await page.getByRole('button', { name: '일정 보기 · 누적 일정 0', exact: true }).click();
  const detail = page.getByRole('region', { name: '선택 일정 상세', exact: true });
  await expect(detail).toBeFocused();
  await expect(detail).toBeInViewport();
  await page.getByRole('button', { name: '일정 목록으로 돌아가기', exact: true }).click();
  await expect(page.getByRole('button', { name: '일정 보기 · 누적 일정 0', exact: true })).toBeFocused();
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(raw);
});
