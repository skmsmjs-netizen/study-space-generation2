import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const observatoryBaseline = JSON.parse(
  readFileSync(new URL('../../docs/observatory-experience-baseline.json', import.meta.url), 'utf8'),
) as { materials: { interior: { surface: string } } };

test('math/physics entry, pan, pinch, concept switching and account-scoped reopening preserve existing records', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    if (!localStorage.getItem('study-space:demo:integral-reasoning:view:v1'))
      localStorage.setItem(
        'study-space:demo:integral-reasoning:view:v1',
        JSON.stringify({ version: 1, active: 'concepts', example: 'log-square', readings: {} }),
      );
    if (!localStorage.getItem('study-space:demo:math-explorer:draft:v1'))
      localStorage.setItem(
        'study-space:demo:math-explorer:draft:v1',
        JSON.stringify({
          mode: 'function',
          title: '기존 수식',
          expressions: ['a*sin(b*x)', '0', '0'],
          min: '-4',
          max: '4',
          position: 0.5,
          a: 1.23456,
          b: 2,
          vectors: false,
          notes: '  기존 메모\n조건·예외  ',
          renderer: 'plotly',
          sliderRangeVersion: 2,
        }),
      );
  });
  await page.goto('?space=demo#/math');
  await page.getByLabel('탐색할 내용', { exact: true }).selectOption('concepts');
  const frame = page.frameLocator('iframe[title="개념 탐구실 인터랙티브"]');
  await expect(frame.locator('#plot')).toBeVisible();
  await expect(frame.locator('#plot')).toHaveAttribute('aria-busy', 'false', { timeout: 30_000 });
  await expect(frame.locator('#explanation')).toHaveCSS('font-weight', '700');
  expect(await frame.locator('#explanation').evaluate(el => getComputedStyle(el).fontFamily)).toContain('ManSeekSong Paper');
  const childFont = page.frames().find(f => f.url().includes('/tools/concept-interactives/'))!;
  expect(await childFont.evaluate(async () => (await document.fonts.load('700 16px "ManSeekSong Paper"', '한글 English')).length)).toBe(1);
  await frame.getByLabel('근사 차수 N', { exact: true }).fill('6');
  await frame.getByLabel('근사 차수 N', { exact: true }).press('Tab');
  await expect(frame.locator('#save-status')).toHaveText('보기 위치 저장됨 · 이 기기');
  const baseline = await page.evaluate(() => ({
    ledger: localStorage.getItem('study-space:demo:v1'),
    standalone: localStorage.getItem('manseeksong:math-template-kit:v1'),
    oldDraft: localStorage.getItem('study-space:demo:math-explorer:draft:v1'),
  }));
  const read = () =>
    page.evaluate(() =>
      JSON.parse(localStorage.getItem('study-space:demo:concept-interactives:view:v1')!),
    );
  await frame.getByRole('button', { name: '그래프 확대', exact: true }).tap();
  await expect
    .poll(async () => (await read()).views.taylor.plotRanges.main.x[1])
    .toBeCloseTo(2.4, 7);
  const rangeBefore = (await read()).views.taylor.plotRanges.main;
  await frame.locator('#plot').focus();
  await page.keyboard.press('ArrowRight');
  await expect
    .poll(async () => (await read()).views.taylor.plotRanges.main.x[0])
    .toBeGreaterThan(rangeBefore.x[0]);
  const moved = (await read()).views.taylor.plotRanges.main;
  expect(moved.x[1] - moved.x[0]).toBeCloseTo(rangeBefore.x[1] - rangeBefore.x[0], 7);
  const child = page.frames().find((f) => f.url().includes('/tools/concept-interactives/'))!;
  await child.evaluate(() => {
    const node = document.getElementById('plot')!,
      box = node.getBoundingClientRect();
    const cx = box.left + box.width / 2,
      cy = box.top + box.height / 2;
    for (const [type, distance] of [
      ['touchstart', 80],
      ['touchmove', 160],
      ['touchend', 0],
    ] as const) {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'touches', {
        value: distance
          ? [
              { clientX: cx - distance / 2, clientY: cy },
              { clientX: cx + distance / 2, clientY: cy },
            ]
          : [],
      });
      node.dispatchEvent(event);
    }
  });
  await expect
    .poll(async () => {
      const r = (await read()).views.taylor.plotRanges.main.x;
      return r[1] - r[0];
    })
    .toBeCloseTo((moved.x[1] - moved.x[0]) / 2, 7);
  const beforeDrag = (await read()).views.taylor.plotRanges.main;
  await frame.locator('#plot').scrollIntoViewIfNeeded();
  const dragBox = await frame.locator('#plot .nsewdrag').boundingBox();
  if (!dragBox) throw Error('실제 그래프 이동 영역을 찾지 못했습니다.');
  const dragX = dragBox.x + dragBox.width / 2,
    dragY = dragBox.y + dragBox.height / 2;
  await page.mouse.move(dragX, dragY);
  await page.mouse.down();
  await page.mouse.move(dragX + 50, dragY, { steps: 5 });
  await page.mouse.up();
  await expect
    .poll(async () => Math.abs((await read()).views.taylor.plotRanges.main.x[0] - beforeDrag.x[0]))
    .toBeGreaterThan(0.01);
  const dragged = (await read()).views.taylor.plotRanges.main;
  expect(dragged.x[1] - dragged.x[0]).toBeCloseTo(beforeDrag.x[1] - beforeDrag.x[0], 7);
  await frame.getByLabel('보기 방식', { exact: true }).selectOption('derive');
  await frame.getByRole('button', { name: '다음 단계', exact: true }).click();
  await expect.poll(async () => (await read()).views.taylor.step).toBe(1);
  await expect(frame.locator('#reading-position')).toHaveText('현재 2 / 4 단계');
  await frame.getByRole('link', { name: '조건과 근거로 이동 ↓', exact: true }).click();
  await expect(frame.locator('#reasoning-title')).toBeFocused();
  await frame.getByRole('button', { name: '2. 계수는 어디에서 오는가?', exact: true }).click();
  await expect(frame.locator('#steps [aria-current="step"]')).toBeFocused();
  await frame.getByRole('link', { name: '그래프로 돌아가기 ↑', exact: true }).click();
  await expect(frame.locator('#visual-title')).toBeFocused();
  const preservedStep = await frame.locator('#step-title').innerText();
  const preserved = (await read()).views.taylor.plotRanges.main;
  await frame.getByLabel('살펴볼 개념', { exact: true }).selectOption('energy');
  await expect(frame.locator('#main-formula .formula-line')).toHaveCount(3);
  await frame.getByLabel('질량 m (kg)', { exact: true }).fill('1.9');
  await frame.getByLabel('질량 m (kg)', { exact: true }).press('Tab');
  await frame.getByLabel('살펴볼 개념', { exact: true }).selectOption('motion');
  await frame.getByLabel('살펴볼 물리량', { exact: true }).selectOption('velocity');
  await frame.getByLabel('살펴볼 개념', { exact: true }).selectOption('taylor');
  await expect(frame.getByLabel('근사 차수 N', { exact: true })).toHaveValue('6');
  await expect.poll(async () => (await read()).views.taylor.plotRanges.main).toEqual(preserved);
  await expect(frame.getByLabel('보기 방식', { exact: true })).toHaveValue('derive');
  await expect(frame.locator('#step-title')).toHaveText(preservedStep);
  await page.getByLabel('탐색할 내용', { exact: true }).selectOption('series');
  await expect(page.locator('.integral-reasoning')).toBeVisible();
  await page.getByLabel('탐색할 내용', { exact: true }).selectOption('concepts');
  await expect(frame.getByLabel('근사 차수 N', { exact: true })).toHaveValue('6');
  await page.locator('a[href="#/subjects"]:visible').first().tap();
  await page.locator('a[href="#/math"]:visible').first().tap();
  await expect(frame.getByLabel('근사 차수 N', { exact: true })).toHaveValue('6');
  await page.reload();
  await expect(page.getByLabel('탐색할 내용', { exact: true })).toHaveValue('concepts');
  await expect(frame.getByLabel('근사 차수 N', { exact: true })).toHaveValue('6');
  await expect.poll(async () => (await read()).views.taylor.plotRanges.main).toEqual(preserved);
  await expect(frame.getByLabel('보기 방식', { exact: true })).toHaveValue('derive');
  await expect(frame.locator('#step-title')).toHaveText(preservedStep);
  await frame.getByLabel('살펴볼 개념', { exact: true }).selectOption('energy');
  await expect(frame.getByLabel('질량 m (kg)', { exact: true })).toHaveValue('1.9');
  await frame.getByRole('button', { name: '전체 보기', exact: true }).tap();
  await expect.poll(async () => (await read()).views.energy.plotRanges.main.x).toEqual([-1.2, 1.2]);
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'dark';
  });
  await expect
    .poll(() =>
      child.isDetached()
        ? page
            .frames()
            .find((f) => f.url().includes('/tools/concept-interactives/'))!
            .evaluate(() => document.documentElement.style.colorScheme)
        : child.evaluate(() => document.documentElement.style.colorScheme),
    )
    .toBe('dark');
  const liveChild = page.frames().find((f) => f.url().includes('/tools/concept-interactives/'))!;
  await expect(frame.locator('html')).toHaveAttribute('data-theme', 'dark');
  const shellStyle = await liveChild.locator('.observatory-instrument').evaluate((node) => ({
    surface: getComputedStyle(node).getPropertyValue('--math-observatory-surface').trim(),
    buttonRadius: getComputedStyle(document.getElementById('graph-reset')!).borderRadius,
  }));
  expect(shellStyle).toEqual({
    surface: observatoryBaseline.materials.interior.surface.toLowerCase(),
    buttonRadius: '0px',
  });
  const parentColor = await page.evaluate(() =>
    getComputedStyle(document.body).getPropertyValue('--color-text').trim(),
  );
  expect(
    await liveChild.evaluate(() =>
      getComputedStyle(document.body).getPropertyValue('--color-text').trim(),
    ),
  ).toBe(parentColor);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  expect(
    await liveChild.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
  ).toBe(true);
  const audit = await new AxeBuilder({ page })
    .include('.concept-interactives')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(audit.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
    [],
  );
  expect(
    await page.evaluate(() => ({
      ledger: localStorage.getItem('study-space:demo:v1'),
      standalone: localStorage.getItem('manseeksong:math-template-kit:v1'),
      oldDraft: localStorage.getItem('study-space:demo:math-explorer:draft:v1'),
    })),
  ).toEqual(baseline);
  expect(errors).toEqual([]);
  await page.screenshot({ path: info.outputPath('math-physics-connected.png'), fullPage: true });
});

test('failed view saves can retry and damaged original views are never overwritten', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'study-space:demo:integral-reasoning:view:v1',
      JSON.stringify({ version: 1, active: 'concepts', example: 'log-square', readings: {} }),
    );
  });
  await page.goto('?space=demo#/math');
  const frame = page.frameLocator('iframe[title="개념 탐구실 인터랙티브"]');
  await expect(frame.locator('#plot')).toHaveAttribute('aria-busy', 'false', { timeout: 30_000 });
  const key = 'study-space:demo:concept-interactives:view:v1';
  await page.evaluate((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException('isolated quota failure', 'QuotaExceededError');
      return original.call(this, name, value);
    };
    document.addEventListener(
      'restore-test-storage',
      () => {
        Storage.prototype.setItem = original;
      },
      { once: true },
    );
  }, key);
  await frame.getByLabel('근사 차수 N', { exact: true }).fill('8');
  await frame.getByLabel('근사 차수 N', { exact: true }).press('Tab');
  await expect(frame.locator('#storage-error')).toContainText('이 기기에 저장하지 못했습니다');
  await expect(frame.getByLabel('근사 차수 N', { exact: true })).toHaveValue('8');
  await page.evaluate(() => document.dispatchEvent(new Event('restore-test-storage')));
  await frame.getByRole('button', { name: '저장 다시 확인', exact: true }).click();
  await expect(frame.locator('#storage-error')).toBeHidden();
  await expect
    .poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).views.taylor.n, key))
    .toBe(8);
  await page.reload();
  await expect(frame.getByLabel('근사 차수 N', { exact: true })).toHaveValue('8');
  await page.evaluate((key) => localStorage.setItem(key, '{damaged original view'), key);
  await page.reload();
  await expect(frame.locator('#storage-error')).toContainText('기존 저장값은 보존');
  await frame.getByLabel('근사 차수 N', { exact: true }).fill('7');
  await frame.getByRole('button', { name: '저장 다시 확인', exact: true }).click();
  await expect(frame.locator('#storage-error')).toContainText('자동으로 덮어쓰지 않습니다');
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe(
    '{damaged original view',
  );
  const download = page.waitForEvent('download');
  await frame.getByRole('button', { name: '현재 보기 내보내기', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('math-template-view.json');
});
