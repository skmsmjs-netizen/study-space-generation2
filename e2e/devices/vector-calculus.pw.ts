import { test, expect } from '@playwright/test';
import fs from 'node:fs';
const content = JSON.parse(
  fs.readFileSync(
    new URL('../../src/domain/vector-calculus-content.json', import.meta.url),
    'utf8',
  ),
) as Array<{ id: string; title: string; question: string }>;
import AxeBuilder from '@axe-core/playwright';
const key = 'study-space:demo:vector-calculus:view:v1';
const reasoning = 'study-space:demo:integral-reasoning:view:v1';
const initial = {
  version: 1,
  active: 'vector-calculus',
  example: 'log-square',
  readings: {},
};
test('view gestures preserve values, ordinary scroll and cancellation', async ({page}) => {
  await page.addInitScript(({reasoning,initial}) => localStorage.setItem(reasoning,JSON.stringify(initial)),{reasoning,initial});
  await page.goto('?space=demo#/math');
  const plot = page.locator('.vector-plot');
  await expect(plot).toBeVisible();
  await page.getByRole('button',{name:'보기 초기화',exact:true}).click();
  await plot.scrollIntoViewIfNeeded();
  const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!),key);
  const box = await plot.boundingBox();
  if(!box) throw new Error('No plot bounds');
  await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);
  await page.mouse.down();
  await page.mouse.move(box.x+box.width*.6,box.y+box.height*.55,{steps:5});
  await page.mouse.up();
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)!).entries.A2.view.x,key)).not.toBe(0);
  const dragged = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!),key);
  const unchanged = await plot.evaluate(node => node.dispatchEvent(new WheelEvent('wheel',{deltaY:30,ctrlKey:false,bubbles:true,cancelable:true})));
  expect(unchanged).toBe(true);
  await plot.evaluate(node => {
    const b=node.getBoundingClientRect(),y=b.y+b.height*.5;
    const send=(type:string,id:number,x:number)=>node.dispatchEvent(new PointerEvent(type,{pointerType:'touch',pointerId:id,clientX:x,clientY:y,button:0,bubbles:true,cancelable:true}));
    send('pointerdown',11,b.x+b.width*.4);send('pointerdown',12,b.x+b.width*.6);
    send('pointermove',12,b.x+b.width*.7);
  });
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)!).entries.A2.view.zoom,key)).toBeGreaterThan(dragged.entries.A2.view.zoom);
  await plot.evaluate(node => node.dispatchEvent(new PointerEvent('pointercancel',{pointerType:'touch',pointerId:11,bubbles:true})));
  const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!),key);
  expect(after.entries.A2.values).toEqual(before.entries.A2.values);
  expect(after.entries.A2.notes).toEqual(before.entries.A2.notes);
  await page.reload();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).entries.A2.view,key)).toEqual(after.entries.A2.view);
});
test('17 observations, LaTeX, exact and pending values, memo, reload, source and caller return', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(
    ({ reasoning, initial }) =>
      localStorage.setItem(reasoning, JSON.stringify(initial)),
    { reasoning, initial },
  );
  await page.goto('?space=demo#/math');
  const workspace = page.getByRole('region', {
    name: '벡터 미적분 자료와 관찰',
    exact: true,
  });
  await expect(
    workspace.getByRole('heading', { name: '내적', exact: true }),
  ).toBeVisible();
  const ledger = await page.evaluate(() =>
    localStorage.getItem('study-space:demo:v1'),
  );
  await workspace.getByText('전체 개념 목록 · 현재 내적',{exact:true}).click();
  for (const module of content) {
    await workspace
      .getByRole('button', {
        name: `${module.title} ${module.question}`,
        exact: true,
      })
      .click();
    await expect(
      workspace.getByRole('heading', { name: module.title, exact: true }),
    ).toBeVisible();
    expect(await workspace.locator('.katex-error').count()).toBe(0);
    expect(
      await workspace.evaluate((el) => el.scrollWidth > el.clientWidth + 2),
      module.id,
    ).toBe(false);
  }
  await workspace
    .getByRole('button', {
      name: '내적 한 방향으로 얼마나 향하고 있을까?',
      exact: true,
    })
    .click();
  const theta = workspace.getByLabel('θ · 각도 (°)', { exact: true });
  await theta.fill('90');
  await theta.press('Enter');
  await expect(workspace.locator('dd').first()).toHaveText('0');
  const memo =
    '  벡터·조건을 그대로 기록한다.\n정사영의 기준 w는 비영이어야 한다.  ';
  await workspace.getByLabel('이 관찰의 개인 메모').fill(memo);
  await workspace
    .getByRole('button', { name: '그래프 확대', exact: true })
    .click();
  await theta.fill('1e-');
  await theta.press('Enter');
  await expect(theta).toHaveAttribute('aria-invalid', 'true');
  await page.reload();
  await expect(theta).toHaveValue('1e-');
  await expect(workspace.locator('dd').first()).toHaveText('0');
  await expect(workspace.getByLabel('이 관찰의 개인 메모')).toHaveValue(memo);
  await workspace
    .getByRole('button', { name: '크게 보기', exact: true })
    .click();
  const full = page.getByRole('dialog', {
    name: '내적 · 전체 관찰',
    exact: true,
  });
  await expect(full.getByRole('region', { name: /교재 원식/ })).toBeVisible();
  await full
    .getByRole('button', { name: '현재 질문으로 돌아가기', exact: true })
    .click();
  await expect(full.locator('[data-vector-question]')).toBeFocused();
  await full
    .getByRole('button', { name: '내적 · 전체 관찰 닫기', exact: true })
    .click();
  await expect(
    workspace.getByRole('button', { name: '크게 보기', exact: true }),
  ).toBeFocused();
  await workspace
    .getByRole('button', { name: '원문 위치 확인', exact: true })
    .click();
  const source = page.getByRole('dialog', {
    name: '원문 위치와 파일 연결',
    exact: true,
  });
  await expect(source).toContainText('책에 인쇄된 쪽 15–19');
  await expect(source).toContainText('PDF 물리 페이지 1');
  await source
    .getByRole('button', { name: '원문 위치와 파일 연결 닫기', exact: true })
    .click();
  expect(
    await page.evaluate(() => localStorage.getItem('study-space:demo:v1')),
  ).toBe(ledger);
  await page.goto('?space=demo#/materials/vector-calculus');
  await workspace
    .getByRole('button', {
      name: '그린 정리 평면의 경계 순환은 내부와 어떻게 이어질까?',
      exact: true,
    })
    .click();
  const small = page.getByRole('dialog', {
    name: '그린 정리 · 자료 곁의 관찰',
    exact: true,
  });
  const singular = small.getByLabel('원점 특이점 모형 (0:매끈, 1:특이)', {
    exact: true,
  });
  await singular.fill('1');
  await singular.press('Enter');
  await expect(small).toContainText('조건을 위반');
  await small.getByRole('button', { name: '크게 보기', exact: true }).click();
  await page
    .getByRole('dialog', { name: '그린 정리 · 전체 관찰', exact: true })
    .getByRole('button', { name: '그린 정리 · 전체 관찰 닫기', exact: true })
    .click();
  await expect(
    small.getByRole('button', { name: '크게 보기', exact: true }),
  ).toBeFocused();
  await small
    .getByRole('button', { name: '탐구 작업대에서 열기', exact: true })
    .click();
  await expect(page).toHaveURL(/#\/math$/);
  await page
    .getByRole('button', { name: '읽던 자료 관찰로 돌아가기', exact: true })
    .click();
  await expect(small).toBeVisible();
  await expect(
    small.getByRole('button', { name: '탐구 작업대에서 열기', exact: true }),
  ).toBeFocused();
  await page.screenshot({
    path: `work/vector-calculus-20261003/${info.project.name}.png`,
  });
  const axe = await new AxeBuilder({ page })
    .include('.ui-modal.vector-full')
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(
    axe.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    ),
  ).toEqual([]);
  expect(errors).toEqual([]);
});
test('save failure, exact value, retry and damaged source protection', async ({
  page,
}) => {
  await page.addInitScript(
    ({ reasoning, initial, key }) => {
      localStorage.setItem(reasoning, JSON.stringify(initial));
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key && !(window as any).__vectorStorageAllowed)
          throw new DOMException('test quota', 'QuotaExceededError');
        return set.call(this, k, v);
      };
    },
    { reasoning, initial, key },
  );
  await page.goto('?space=demo#/math');
  const workspace = page.getByRole('region', {
    name: '벡터 미적분 자료와 관찰',
    exact: true,
  });
  const input = workspace.getByLabel('v의 크기', { exact: true });
  await input.fill('2.123456789');
  await input.press('Enter');
  await expect(
    workspace.getByRole('button', { name: '관찰 저장 다시 시도', exact: true }),
  ).toBeVisible();
  await expect(input).toHaveValue('2.123456789');
  await page.evaluate(() => ((window as any).__vectorStorageAllowed = true));
  await workspace
    .getByRole('button', { name: '관찰 저장 다시 시도', exact: true })
    .click();
  await expect(workspace).toContainText('관찰 보기 저장됨 · 이 기기');
  await page.evaluate(
    (key) => localStorage.setItem(key, '{broken original  정확한 원문  '),
    key,
  );
  await page.reload();
  await expect(
    workspace.getByRole('button', { name: '저장 원문 다시 읽기', exact: true }),
  ).toBeVisible();
  await input.fill('2.8');
  await input.press('Enter');
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe(
    '{broken original  정확한 원문  ',
  );
});
