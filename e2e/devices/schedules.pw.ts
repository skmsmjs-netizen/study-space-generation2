import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
const name =
  '검증용 과제 · 긴 한국어 일정 이름으로 좁은 화면에서 내용을 끝까지 읽고 준비와 제출 상태를 확인하기';
const note = '  합성 일정의 이유와 예외\n원문 보존 확인  ';
const draftNote = '  수정하다 멈춘 메모\n조건과 예외도 남기기  ';
const summary = '#learning-schedules > summary';
const metrics = async (page: Page) =>
  page.evaluate(() => ({
    width: innerWidth,
    height: innerHeight,
    screen: { width: screen.width, height: screen.height },
    dpr: devicePixelRatio,
    pageWidth: document.documentElement.scrollWidth,
    touch: matchMedia('(pointer:coarse)').matches,
    panelOpen: document.querySelector<HTMLDetailsElement>('#learning-schedules')?.open,
    focus: document.activeElement?.tagName,
    summaryTop:
      document.querySelector('#learning-schedules > summary')?.getBoundingClientRect().top ?? -100,
    links: [
      ...document.querySelectorAll<HTMLElement>(
        '.is-home .section-heading > a,.is-home .actions > a,.is-home .recent-study-list footer > a,.next-study .schedule-navigation',
      ),
    ]
      .filter((e) => e.getClientRects().length)
      .map((e) => ({
        text: e.textContent,
        width: e.getBoundingClientRect().width,
        height: e.getBoundingClientRect().height,
      })),
  }));
test('touch navigation, both schedule paths, rotation, draft and original preservation', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('?space=demo');
  await expect(page.getByRole('heading', { name: '오늘', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '공부함', exact: true }).first().tap();
  await expect(page.getByRole('region', { name: '최근 남긴 공부 기록' })).toBeVisible();
  await page.locator(summary).tap();
  await page.getByRole('button', { name: '시험·과제·강의 일정 추가', exact: true }).tap();
  await page.getByRole('textbox', { name: '일정 이름', exact: true }).fill(name);
  await page
    .getByRole('combobox', { name: '일정 과목', exact: true })
    .selectOption('demo-subject-math');
  await page.getByRole('combobox', { name: '일정 종류', exact: true }).selectOption('assignment');
  await page.getByLabel('일정 기한 · 선택', { exact: true }).fill('2026-10-08');
  await page.getByRole('textbox', { name: '일정 메모 · 선택', exact: true }).fill(note);
  await page.getByRole('button', { name: '일정 저장', exact: true }).tap();
  await expect(page.getByRole('dialog', { name: '시험·과제·강의 일정' })).toBeHidden();
  await page.locator(summary).tap();
  await page.getByRole('button', { name: '일정에서 확인하기', exact: true }).first().tap();
  await expect(page.locator('#learning-schedules')).toHaveAttribute('open', '');
  await expect(page.locator(summary)).toBeFocused();
  const first = await metrics(page);
  expect(first.pageWidth).toBeLessThanOrEqual(first.width);
  expect(first.links.every((e) => e.height >= 48 && e.width >= 44)).toBeTruthy();
  expect(first.summaryTop).toBeGreaterThanOrEqual(-1);
  await page.screenshot({ path: info.outputPath('schedule.png') });
  await page.locator(summary).tap();
  await page.getByText('기한이 있는 일정 1개', { exact: true }).tap();
  await page.getByRole('button', { name: '일정과 준비 상태 보기', exact: true }).tap();
  await expect(page.locator(summary)).toBeFocused();
  await expect(
    page.getByRole('button', { name: '시험·과제·강의 일정 추가', exact: true }),
  ).toBeVisible();
  await page.locator(summary).press('Alt+Tab');
  // New controls can precede Add; preserve native Safari navigation rather than a fixed index.
  expect(
    await page.evaluate(
      () =>
        Boolean(document.activeElement?.closest('#learning-schedules')) &&
        document.activeElement !== document.querySelector('#learning-schedules > summary'),
    ),
  ).toBe(true);
  await page.getByRole('button', { name: '일정 수정', exact: true }).tap();
  await expect(page.getByRole('textbox', { name: '일정 메모 · 선택', exact: true })).toHaveValue(
    note,
  );
  await page.getByRole('textbox', { name: '일정 메모 · 선택', exact: true }).fill(draftNote);
  const initialViewport = info.project.use.viewport!;
  const alternate = info.project.name.includes('iPhone')
    ? initialViewport.width < 500
      ? { width: 874, height: 309 }
      : { width: 402, height: 681 }
    : info.project.name.includes('half')
      ? { width: 688, height: 1200 }
      : { width: initialViewport.height, height: initialViewport.width };
  await page.setViewportSize(alternate);
  await expect(page.getByRole('textbox', { name: '일정 메모 · 선택', exact: true })).toHaveValue(
    draftNote,
  );
  const rotated = await page.evaluate(() => ({
    width: innerWidth,
    pageWidth: document.documentElement.scrollWidth,
  }));
  expect(rotated.pageWidth).toBeLessThanOrEqual(rotated.width);
  await page.setViewportSize(initialViewport);
  await expect(page.getByRole('textbox', { name: '일정 메모 · 선택', exact: true })).toHaveValue(
    draftNote,
  );
  await page.getByRole('button', { name: '시험·과제·강의 일정 닫기', exact: true }).tap();
  await page.reload();
  await page.getByRole('button', { name: '일정에서 확인하기', exact: true }).first().tap();
  await page.getByRole('button', { name: '일정 수정', exact: true }).tap();
  await expect(page.getByRole('textbox', { name: '일정 메모 · 선택', exact: true })).toHaveValue(
    draftNote,
  );
  // Return to the original note only in this isolated synthetic test context.
  await page.getByRole('textbox', { name: '일정 메모 · 선택', exact: true }).fill(note);
  await page.getByRole('button', { name: '일정 저장', exact: true }).tap();
  await page.reload();
  await page.getByRole('button', { name: '일정에서 확인하기', exact: true }).first().tap();
  await page.getByRole('button', { name: '일정 수정', exact: true }).tap();
  await expect(page.getByRole('textbox', { name: '일정 메모 · 선택', exact: true })).toHaveValue(
    note,
  );
  await expect(page.getByRole('textbox', { name: '일정 이름', exact: true })).toHaveValue(name);
  await page.getByRole('button', { name: '시험·과제·강의 일정 닫기', exact: true }).tap();
  const after = await metrics(page);
  expect(after.pageWidth).toBeLessThanOrEqual(after.width);
  await page.getByRole('link', { name: '기록 열기', exact: true }).tap();
  await expect(
    page.getByRole('heading', {
      name: '함수는 어떤 관계일까?',
      exact: true,
      level: 1,
    }),
  ).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: '오늘', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
  await page.screenshot({ path: info.outputPath('home.png') });
});
