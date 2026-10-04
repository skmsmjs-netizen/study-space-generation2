import { test, expect } from '@playwright/test';
import fs from 'node:fs';
const VECTOR_MODULES = JSON.parse(
  fs.readFileSync(
    new URL('../../src/domain/vector-calculus-content.json', import.meta.url),
    'utf8',
  ),
) as Array<{ id: string; title: string; question: string }>;
const key = 'study-space:demo:vector-calculus:view:v1';
async function open(page: any, id: string) {
  await page.goto('/?space=demo#/materials/vector-calculus', {waitUntil:'domcontentloaded'});
  const m = VECTOR_MODULES.find((m) => m.id === id)!;
  await page.getByRole('button', { name: `${m.title} ${m.question}`, exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByText('다른 식과 조건의 관계 관찰 열기', { exact: true }).click();
  return dialog.locator('[data-vector-general]');
}
const modules = [
  'A3',
  'A4',
  'A5',
  'B1',
  'B2',
  'B3',
  'C1',
  'C3',
  'C4',
  'D1',
  'D2',
  'D3',
  'D4',
  'D5',
];
for (const group of [
  modules.slice(0, 4),
  modules.slice(4, 8),
  modules.slice(8, 11),
  modules.slice(11),
])
  test(
    'added relation frames ' + group.join(',') + ' render, formulae and narrow layout',
    async ({ page }, info) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      for (const id of group) {
        const region = await open(page, id);
        await expect(
          region.getByRole('heading', { name: '다른 식과 조건으로 관찰하기', exact: true }),
        ).toBeVisible();
        await expect(region.getByRole('button', { name: '＋ 확대', exact: true })).toBeEnabled({
          timeout: 30000,
        });
        await expect(region.locator('.math-plot')).toBeVisible();
        expect(await region.locator('.katex-error').count(), id).toBe(0);
        expect(await region.evaluate((el) => el.scrollWidth > el.clientWidth + 2), id).toBe(false);
        await expect(region.getByRole('region', { name: '추가 관계 현재값' })).not.toHaveText('');
        if (id === 'D1') {
          await region.getByLabel('추가 관찰 관계', { exact: true }).selectOption('line');
          await expect(region.getByRole('button', { name: '＋ 확대', exact: true })).toBeEnabled({
            timeout: 30000,
          });
          await expect(region).toContainText('벡터 선적분 · 근사');
        }
        if (id === 'A3' || id === 'C4' || id === 'D5') {
          await region.locator('.math-plot').scrollIntoViewIfNeeded();
          await page.screenshot({
            path: `work/vector-calculus-20261003/completion/${info.project.name}-${id}.png`,
          });
        }
        await page
          .getByRole('dialog')
          .getByRole('button', { name: /자료 곁의 관찰 닫기/ })
          .click();
      }
      expect(errors).toEqual([]);
    },
  );
test('committed expressions, invalid drafts, notes, manual view, reload, reset and caller return', async ({
  page,
}) => {
  const region = await open(page, 'C4'),
    dialog = page.getByRole('dialog');
  const ledger = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  await dialog.getByLabel('이 관찰의 개인 메모').fill('원문·조건을 유지한다.\n일반 밀도 관찰');
  const f = region.getByLabel('밀도 δ(x,y,z)', { exact: true });
  await f.fill('1+x*y');
  await region.getByRole('button', { name: '식 적용', exact: true }).click();
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).entries.C4.general.states.density.expressions.f, key)).toBe('1+x*y');
  await region.getByRole('button', { name: '＋ 확대', exact: true }).click();
  await f.fill('1e-');
  await region.getByRole('button', { name: '식 적용', exact: true }).click();
  await expect(f).toHaveAttribute('aria-invalid', 'true');
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).entries.C4.general.states.density.drafts.f, key)).toBe('1e-');
  const state = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key);
  expect(state.entries.C4.general.states.density.expressions.f).toBe('1+x*y');
  expect(state.entries.C4.general.states.density.drafts.f).toBe('1e-');
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.getByRole('dialog')).toBeVisible();
  await page
    .getByRole('dialog')
    .getByText('다른 식과 조건의 관계 관찰 열기', { exact: true })
    .click();
  const again = page.locator('[data-vector-general]');
  await expect(again.getByLabel('밀도 δ(x,y,z)', { exact: true })).toHaveValue('1e-');
  await expect(page.getByRole('dialog').getByLabel('이 관찰의 개인 메모')).toHaveValue(
    state.entries.C4.notes,
  );
  expect(
    (await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key)).entries.C4.general
      .states.density.view,
  ).toEqual(state.entries.C4.general.states.density.view);
  await again.getByRole('button', { name: '이 추가 관찰의 식·값 처음으로', exact: true }).click();
  const reset = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key);
  expect(reset.entries.C4.notes).toEqual(state.entries.C4.notes);
  expect(reset.entries.C4.values).toEqual(state.entries.C4.values);
  expect(reset.entries.C4.general.states.density.view).toEqual(
    state.entries.C4.general.states.density.view,
  );
  await again.getByRole('button', { name: '이 관계의 질문으로 돌아가기', exact: true }).click();
  await expect(again.locator('[data-general-question]')).toBeFocused();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /자료 곁의 관찰 닫기/ })
    .click();
  await expect(
    page.getByRole('button', {
      name: '질량중심·확률·기댓값 밀도를 반영한 전체량과 평균은 무엇일까?',
      exact: true,
    }),
  ).toBeFocused();
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(ledger);
});
test('different conditions and source return preserve additional relation inputs', async ({
  page,
}) => {
  const r = await open(page, 'D4');
  await r.getByLabel('설명용 사례', { exact: true }).selectOption('different');
  await expect(r.getByRole('status')).toContainText('불일치');
  await r.getByRole('button', { name: '이 관계의 원문 읽기', exact: true }).click();
  await expect(page.getByRole('dialog').last()).toContainText('원문');
  await page.getByRole('dialog').last().getByRole('button', { name: /닫기/ }).first().click();
  await expect(r.getByLabel('설명용 사례', { exact: true })).toHaveValue('different');
});

test('generated coordinate formulae render and added drafts recover after failed device storage', async ({
  page,
}) => {
  await page.addInitScript((key) => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw new DOMException('synthetic quota', 'QuotaExceededError');
      return set.call(this, k, v);
    };
  }, key);
  const r = await open(page, 'D5');
  await expect(r.getByRole('button', { name: '＋ 확대', exact: true })).toBeEnabled({
    timeout: 30000,
  });
  await r.getByText('계산에 적용된 식·도함수 확인', { exact: true }).click();
  expect(await r.locator('.katex-error').count()).toBe(0);
  const input = r.getByLabel('스칼라장 f(x,y,z)', { exact: true });
  await input.fill('1e-');
  await r.getByRole('button', { name: '식 적용', exact: true }).click();
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  const shelf = page.getByRole('region', { name: '벡터 미적분 자료와 관찰', exact: true });
  await expect(shelf).toContainText('복구 사본 보관됨 · 이 기기');
  await page.reload({waitUntil:'domcontentloaded'});
  await page
    .getByRole('dialog')
    .getByText('다른 식과 조건의 관계 관찰 열기', { exact: true })
    .click();
  const recovered = page.locator('[data-vector-general]');
  await expect(recovered.getByLabel('스칼라장 f(x,y,z)', { exact: true })).toHaveValue('1e-');
  await expect(recovered.getByLabel('스칼라장 f(x,y,z)', { exact: true })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  expect(await recovered.evaluate((el) => el.scrollWidth > el.clientWidth + 2)).toBe(false);
});
