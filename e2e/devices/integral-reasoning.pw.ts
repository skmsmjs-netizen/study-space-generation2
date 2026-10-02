import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('integral reasoning follows every branch, preserves navigation and fits the device', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('?space=demo&math=series#/math');
  await expect(page.getByRole('heading', { name: '급수의 수렴을 어떻게 판단할까?' })).toBeVisible();
  const untouched = await page.evaluate(() => {
    const raw = localStorage.getItem('study-space:demo:v1');
    return raw;
  });
  const step = (title: string) => page.getByRole('button', { name: new RegExp(title) });
  await step('어떤 판정법이 맞을까').tap();
  await page.getByLabel('판정법 후보 비교').selectOption('ratio');
  await expect(page.locator('.reasoning-outcome')).toContainText('판정 불가');
  await expect(step('이상적분은 수렴하는가')).toBeDisabled();
  await page.getByRole('button', { name: '적분판정법 후보로 돌아가기' }).tap();
  await step('항을 함수로 옮긴다').tap();
  await page.getByRole('button', { name: '정수 사이가 다른 함수를 비교' }).tap();
  await step('연속인가').tap();
  await expect(page.locator('.reasoning-outcome')).toContainText('발산을 뜻하지');
  await expect(step('이상적분은 수렴하는가')).toBeDisabled();
  await page.getByRole('button', { name: '원래 연속함수로 다시 확인' }).tap();
  await step('연속인가').tap();
  await page.getByRole('button', { name: '이 조건을 아직 확인하지 못했다면?' }).tap();
  await expect(page.locator('.reasoning-outcome')).toContainText('판정을 보류');
  await expect(step('감소하는가')).toBeDisabled();
  await page.getByRole('button', { name: '근거를 확인하고 이어 보기' }).tap();
  await step('이상적분은 수렴하는가').tap();
  await expect(page.getByRole('img', { name: /감소 곡선/ })).toBeVisible();
  const bound = page.getByRole('slider', { name: '비교 구간의 끝' });
  await bound.focus();
  await bound.press('ArrowRight');
  await expect(bound).toHaveValue('8');
  await expect(page.locator('.katex-error')).toHaveCount(0);
  expect(await page.locator('.integral-reasoning math').count()).toBeGreaterThan(3);
  await page.screenshot({ path: info.outputPath('integral-area.png'), fullPage: true });
  await page
    .getByRole('combobox', { name: '살펴볼 급수', exact: true })
    .selectOption('alternating');
  await step('양항급수인가').tap();
  await expect(step('이상적분은 수렴하는가')).toBeDisabled();
  await page.getByRole('button', { name: '절댓값 급수로 확인' }).tap();
  await step('원래 질문으로 돌아간다').tap();
  await expect(page.locator('.reasoning-outcome')).toContainText('절대수렴');
  await page.getByRole('combobox', { name: '살펴볼 급수', exact: true }).selectOption('eventual');
  await step('감소하는가').tap();
  await expect(step('이상적분은 수렴하는가')).toBeDisabled();
  await page.getByRole('button', { name: '세 번째 항부터 다시 확인' }).tap();
  await step('원래 질문으로 돌아간다').tap();
  await expect(page.locator('.reasoning-outcome')).toContainText('원래 급수도 발산');
  await page.getByRole('combobox', { name: '살펴볼 급수', exact: true }).selectOption('nonzero');
  await step('항이 0으로 가는가').tap();
  await expect(step('어떤 판정법이 맞을까')).toHaveCount(0);
  await expect(page.locator('.reasoning-outcome')).toContainText('원래 급수는 발산');
  await page.getByRole('combobox', { name: '살펴볼 급수', exact: true }).selectOption('geometric');
  await step('어떤 판정법이 맞을까').tap();
  await page.getByLabel('판정법 후보 비교').selectOption('geometric');
  await expect(page.locator('.reasoning-outcome')).toContainText('수렴과 합');
  await page.getByRole('combobox', { name: '살펴볼 급수', exact: true }).selectOption('log');
  await step('원래 질문으로 돌아간다').tap();
  await expect(page.locator('.reasoning-outcome')).toContainText('원래 급수는 발산');
  await page.getByRole('combobox', { name: '살펴볼 급수', exact: true }).selectOption('log-square');
  await expect(bound).toHaveValue('8');
  await page.reload();
  await expect(bound).toHaveValue('8');
  await page.getByLabel('탐색할 내용').selectOption('graph');
  const notes = page.getByLabel('관찰·메모 (선택)');
  await notes.fill('급수 화면 전환 전 원문 · 조건과 예외');
  await page.getByLabel('탐색할 내용').selectOption('series');
  await expect(bound).toHaveValue('8');
  await page.getByLabel('탐색할 내용').selectOption('graph');
  await expect(notes).toHaveValue('급수 화면 전환 전 원문 · 조건과 예외');
  await page.getByLabel('탐색할 내용').selectOption('series');
  await page
    .getByRole('combobox', { name: '살펴볼 급수', exact: true })
    .selectOption('alternating');
  await expect(page.locator('.reasoning-outcome')).toContainText('절대수렴');
  const metrics = await page.evaluate(() => ({
    width: innerWidth,
    page: document.documentElement.scrollWidth,
    active: document.querySelector('[aria-current="step"]')?.textContent,
  }));
  expect(metrics.page).toBeLessThanOrEqual(metrics.width + 1);
  await info.attach('layout', { body: JSON.stringify(metrics), contentType: 'application/json' });
  const audit = await new AxeBuilder({ page }).include('.integral-reasoning').analyze();
  expect(audit.violations).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(untouched);
  expect(errors).toEqual([]);
});
