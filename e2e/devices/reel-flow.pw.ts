import { expect, test } from '@playwright/test';
import { decodeStoredText } from '../../src/data/storage-codec';

test('material creation, source search, scope recovery and list return retain exact original without adding study results', async ({
  page,
}, info) => {
  const original = `  회로 검증어와 예외\n${'전압의 조건을 확인하고 원문을 보존한다. '.repeat(50)}\n끝 공백  `;
  await page.goto('?space=demo#/materials');
  await page.getByRole('button', { name: '자료 추가', exact: true }).click();
  await page.getByRole('textbox', { name: '자료 제목', exact: true }).fill('흐름 확인 필기');
  await page.getByRole('textbox', { name: '강의 내용·필기', exact: true }).fill(original);
  await page.getByRole('button', { name: '자료 저장', exact: true }).click();
  await expect(page).not.toHaveURL(/\/materials\/new$/);
  const materialURL = page.url();
  await page.getByRole('link', { name: '← 강의 자료', exact: true }).click();
  await page.getByRole('textbox', { name: '강의 자료 찾기', exact: true }).fill('흐름');
  await page.getByRole('link', { name: '흐름 확인 필기', exact: true }).click();
  await expect(page.getByRole('textbox', { name: '강의 내용·필기', exact: true })).toHaveValue(
    original,
  );
  await page.getByRole('link', { name: '← 강의 자료', exact: true }).click();
  await expect(page.getByRole('textbox', { name: '강의 자료 찾기', exact: true })).toHaveValue(
    '흐름',
  );
  await page.getByRole('textbox', { name: '강의 자료 찾기', exact: true }).fill('없는자료검증');
  await page.getByRole('button', { name: '강의 자료 검색어 지우기', exact: true }).click();
  await expect(page.getByRole('link', { name: '흐름 확인 필기', exact: true })).toBeVisible();
  // Navigate through the UI on every width, including the compact menu.
  await page.goto('?space=demo#/search');
  const input = page.getByRole('searchbox', { name: '과목·목차·기록 검색', exact: true });
  await input.fill('회로 검증어');
  await expect(page.getByRole('link', { name: '흐름 확인 필기', exact: true })).toBeVisible();
  await page.getByRole('combobox', { name: '공부 범위', exact: true }).selectOption('independent');
  await expect(
    page.getByRole('heading', { name: '일치하는 내용을 찾지 못했습니다', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: '모든 공부에서 찾기', exact: true }).click();
  await page.getByRole('link', { name: '흐름 확인 필기', exact: true }).click();
  await expect(page).toHaveURL(materialURL);
  await expect(page.getByRole('textbox', { name: '강의 내용·필기', exact: true })).toHaveValue(
    original,
  );
  await page.goBack();
  await expect(input).toHaveValue('회로 검증어');
  await page.getByRole('button', { name: '검색어 지우기', exact: true }).click();
  await input.fill('회로 검증어');
  await expect(page.getByRole('link', { name: '흐름 확인 필기', exact: true })).toBeVisible();
  await page.reload();
  await expect(input).toHaveValue('회로 검증어');
  await expect(page.getByRole('link', { name: '흐름 확인 필기', exact: true })).toBeVisible();
  const saved = JSON.parse(
    decodeStoredText((await page.evaluate(() => localStorage.getItem('study-space:demo:v1')))!),
  ).data;
  expect(saved.studyMaterials).toHaveLength(1);
  expect(saved.studyMaterials[0].sourceText).toBe(original);
  expect(saved.records).toHaveLength(0);
  expect(saved.sessions).toHaveLength(0);
  expect(saved.memoryTests ?? []).toHaveLength(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
  await page.screenshot({ path: info.outputPath('source-search-return.png'), fullPage: true });
});

test('unavailable screen chunk offers retry and other screens retain original records', async ({
  page,
}) => {
  await page.route('**/assets/study-materials-*.js', (route) => route.abort('failed'));
  await page.goto('?space=demo#/materials');
  await expect(
    page.getByRole('heading', { name: '이 화면을 열지 못했습니다', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: '다시 시도', exact: true })).toBeVisible();
  const before = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  await page.goto('?space=demo#/search');
  await page.getByRole('searchbox').fill('함수');
  await expect(
    page.getByRole('link', { name: '함수는 어떤 관계일까?', exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(before);
  await page.unroute('**/assets/study-materials-*.js');
  await page.goto('?space=demo#/materials');
  // WebKit can retain a failed module request for this tab. The actual retry
  // control starts a fresh page while keeping every durable record and draft.
  if (await page.getByRole('button', { name: '다시 시도', exact: true }).isVisible())
    await page.getByRole('button', { name: '다시 시도', exact: true }).click();
  await expect(page.getByRole('button', { name: '자료 추가', exact: true })).toBeVisible();
});
