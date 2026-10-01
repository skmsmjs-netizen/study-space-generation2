import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const key = 'study-space:demo:demo-learner:experience:v1';
const archiveKey = `${key}:recovery:repair-fixture`;
const next = '  다시 펼치면 적용 조건부터\n' + '긴 한국어 원문 '.repeat(120);
const damaged = '  {unfinished original\n\ud800';
async function seed(page: Page) {
  await page.goto('?space=demo#/node/demo-topic-function');
  await page.getByRole('button', { name: '다음에 펼칠 곳 남기기', exact: true }).click();
  await page.getByLabel('다음에 할 일', { exact: true }).fill(next);
  await page.getByRole('button', { name: '다음 행동 남기기', exact: true }).click();
  await page.evaluate(({ key, archiveKey, damaged }) => {
    const saved = JSON.parse(localStorage.getItem(key)!);
    saved.readingWidth = 'wide';
    saved.support = [{ id: 'repair-original-memo', body: '  복구할 문제 메모\n', updatedAt: '2026-10-01T00:00:00Z' }];
    localStorage.setItem(archiveKey, JSON.stringify(saved));
    localStorage.setItem(`study-space:draft-archive-metadata:v1:${archiveKey}`, JSON.stringify({
      version: 1, archiveKey, sourceKey: key, archivedAt: '2026-10-01T00:00:00Z', reason: '격리된 복구 확인용 사본',
    }));
    localStorage.setItem(key, damaged);
  }, { key, archiveKey, damaged });
  await page.goto('?space=demo#/my-progress');
  await page.locator('main').getByRole('button', { name: '설정 원문·보관본 확인', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '이어가기 설정 복구', exact: true })).toBeVisible();
}

test('exact original download and explicit restore retain width, next action and memo after reload', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await seed(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '설정 원문 내려받기', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('manseeksong-experience-recovery.json');
  const exported = JSON.parse(await readFile((await download.path())!, 'utf8'));
  expect(exported.savedRaw).toBe(damaged);
  expect(exported.archives[0].raw).toContain('복구할 문제 메모');
  await page.getByLabel('복구할 설정 보관본', { exact: true }).selectOption(archiveKey);
  await expect(page.getByLabel('보관본 원문', { exact: true })).toHaveValue(/복구할 문제 메모/);
  await page.getByRole('button', { name: '이 보관본으로 설정 복구', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '이어가기 설정 복구', exact: true })).toBeHidden();
  await page.reload();
  await expect(page.locator('.app-shell')).toHaveAttribute('data-reading-width', 'wide');
  await page.goto('?space=demo#/');
  expect(await page.locator('.brand-next').textContent()).toBe(next);
  await page.goto('?space=demo#/help');
  await expect(page.getByRole('heading', { name: '이 기기에 보관한 메모', exact: true })).toBeVisible();
  expect(await page.locator('.brand-service pre').first().textContent()).toBe('  복구할 문제 메모\n');
  // Restoring saved metadata does not replace the independently editable memo draft.
  await expect(page.getByLabel('문제 메모', { exact: true })).toHaveValue('');
  expect(await page.evaluate(({ key, damaged }) => Object.keys(localStorage).some(name =>
    name.startsWith(`${key}:recovery:`) && localStorage.getItem(name) === damaged), { key, damaged })).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});

test('failed original preservation blocks restart; verified restart and later archive restore retain the original', async ({ page }) => {
  await seed(page);
  await page.getByText('보관본으로 복구할 수 없을 때', { exact: true }).click();
  await page.evaluate(key => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name.startsWith(`${key}:recovery:`)) throw new DOMException('quota', 'QuotaExceededError');
      return original.call(this, name, value);
    };
  }, key);
  await page.getByRole('button', { name: '원문 보관 후 설정 새로 시작', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '이어가기 설정 복구', exact: true })).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('원문 사본을 보관하지 못했습니다');
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(damaged);
  await page.reload();
  await page.locator('main').getByRole('button', { name: '설정 원문·보관본 확인', exact: true }).click();
  await page.getByText('보관본으로 복구할 수 없을 때', { exact: true }).click();
  await page.getByRole('button', { name: '원문 보관 후 설정 새로 시작', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '이어가기 설정 복구', exact: true })).toBeHidden();
  await page.reload();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).next, key)).toBeNull();
  // Preserved copies remain reachable even once the primary setting is readable.
  await page.goto('?space=demo#/help');
  const sidebar = page.locator('aside');
  const controls = await sidebar.isVisible() ? sidebar.locator('details.workspace-tools') : page.locator('details.compact-menu');
  await controls.locator('summary').first().click();
  await controls.getByRole('button', { name: '설정 원문·보관본 확인', exact: true }).click();
  await page.getByLabel('복구할 설정 보관본', { exact: true }).selectOption(archiveKey);
  await page.getByRole('button', { name: '이 보관본으로 설정 복구', exact: true }).click();
  await page.goto('?space=demo#/');
  expect(await page.locator('.brand-next').textContent()).toBe(next);
});
