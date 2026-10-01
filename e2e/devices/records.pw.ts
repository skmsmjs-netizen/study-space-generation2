import { expect, test } from '@playwright/test';
import { decodeStoredText } from '../../src/data/storage-codec';

const first = '함수는 어떤 관계일까?';
const second = '그래프에서 변화 읽기';
const original = `  함수의 조건과 예외\n${'긴 한국어 설명을 그대로 보존한다. '.repeat(65)}\n끝 공백  `;
const noteOnly = '  체크 없이 글만 남기기\n결과는 아직 미확인  ';

test('study scope, empty search, navigation and reload retain both records and original meaning', async ({
  page,
}, info) => {
  await page.goto('?space=demo#/record');
  await page.getByRole('checkbox', { name: first, exact: true }).check();
  await page.getByRole('checkbox', { name: second, exact: true }).check();
  await page.getByRole('textbox', { name: '메모', exact: true }).nth(0).fill(original);
  await page.getByRole('textbox', { name: '메모', exact: true }).nth(1).fill(noteOnly);
  await page.getByRole('checkbox', { name: '공부함', exact: true }).nth(1).uncheck();
  await page.getByRole('combobox', { name: '공부 범위', exact: true }).selectOption('independent');
  await expect(page.getByRole('checkbox', { name: first, exact: true })).toHaveCount(0);
  await expect(page.getByText('이 공부 범위에는 기록할 주제가 없습니다')).toBeVisible();
  await expect(page.getByRole('textbox', { name: '메모', exact: true }).nth(0)).toHaveValue(
    original,
  );
  await page.getByRole('combobox', { name: '공부 범위', exact: true }).selectOption('all');
  await page.getByRole('searchbox', { name: '주제 찾기', exact: true }).fill('없는 주제');
  await expect(page.getByText('검색어에 맞는 주제가 없습니다')).toBeVisible();
  await expect(page.getByRole('textbox', { name: '메모', exact: true }).nth(1)).toHaveValue(
    noteOnly,
  );
  // Narrow screens expose the bottom navigation; role queries use displayed links.
  await page.getByRole('link', { name: '오늘', exact: true }).first().first().click();
  await page.getByRole('link', { name: '기록', exact: true }).first().first().click();
  await expect(page.getByRole('searchbox')).toHaveValue('없는 주제');
  await page.reload();
  await expect(page.getByRole('textbox', { name: '메모', exact: true }).nth(0)).toHaveValue(
    original,
  );
  await expect(page.getByRole('checkbox', { name: '공부함', exact: true }).nth(0)).toBeChecked();
  await expect(
    page.getByRole('checkbox', { name: '공부함', exact: true }).nth(1),
  ).not.toBeChecked();
  await page.getByRole('button', { name: '2개 주제 기록 저장', exact: true }).click();
  await expect(page.getByRole('heading', { name: '최근 남긴 기록', exact: true })).toBeVisible();
  const saved = JSON.parse(
    decodeStoredText((await page.evaluate(() => localStorage.getItem('study-space:demo:v1')))!),
  ).data;
  expect(saved.records).toHaveLength(2);
  expect(saved.records.map((row: { body: string }) => row.body)).toEqual([original, noteOnly]);
  expect(saved.records.map((row: { done: boolean }) => row.done)).toEqual([true, false]);
  expect(new Set(saved.records.map((row: { sessionId: string }) => row.sessionId)).size).toBe(1);
  await page.reload();
  await expect(page.getByText(/체크 없이 글만 남기기/).first()).toBeVisible();
  await page.screenshot({
    path: info.outputPath('saved-records.png'),
    fullPage: true,
  });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
});

test('storage failure keeps a durable draft and retries the same study once', async ({ page }) => {
  await page.addInitScript(() => {
    const nativeSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (
        this === localStorage &&
        key === 'study-space:demo:v1' &&
        document.documentElement.dataset.recordStorageFailure === 'yes'
      )
        throw new DOMException('Synthetic storage quota failure', 'QuotaExceededError');
      nativeSet.call(this, key, value);
    };
  });
  await page.goto('?space=demo#/record');
  await page.getByRole('checkbox', { name: first, exact: true }).check();
  await page.getByRole('textbox', { name: '메모', exact: true }).fill(original);
  const before = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  const draft = await page.evaluate(() => localStorage.getItem('study-space:demo:draft:multiple'));
  await page.evaluate(() => {
    document.documentElement.dataset.recordStorageFailure = 'yes';
  });
  await page.getByRole('button', { name: '1개 주제 기록 저장', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('저장 공간이 부족');
  await expect(page.getByRole('textbox', { name: '메모', exact: true })).toHaveValue(original);
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(before);
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:draft:multiple'))).toBe(
    draft,
  );
  await page.reload();
  await expect(page.getByRole('textbox', { name: '메모', exact: true })).toHaveValue(original);
  await page.getByRole('button', { name: '1개 주제 기록 저장', exact: true }).click();
  await expect(page.getByRole('heading', { name: '최근 남긴 기록', exact: true })).toBeVisible();
  const saved = JSON.parse(
    decodeStoredText((await page.evaluate(() => localStorage.getItem('study-space:demo:v1')))!),
  ).data;
  expect(saved.records).toHaveLength(1);
  expect(saved.records[0]).toMatchObject({
    sessionId: JSON.parse(draft!).sessionId,
    body: original,
  });
  expect(
    await page.evaluate(() => localStorage.getItem('study-space:demo:draft:multiple')),
  ).toBeNull();
});
