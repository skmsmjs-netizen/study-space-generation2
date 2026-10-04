import { test, expect } from '@playwright/test';
import fs from 'node:fs';
const content = JSON.parse(
  fs.readFileSync(
    new URL('../../src/domain/vector-calculus-content.json', import.meta.url),
    'utf8',
  ),
) as Array<{ id: string; title: string; question: string }>;
import AxeBuilder from '@axe-core/playwright';
import { EXTENSION_NAMES } from '../../src/domain/vector-calculus-extensions';
const key = 'study-space:demo:vector-calculus:view:v1';
const reasoning = 'study-space:demo:integral-reasoning:view:v1';
const initial = {
  version: 1,
  active: 'vector-calculus',
  example: 'log-square',
  readings: {},
};
test('view gestures preserve values, ordinary scroll and cancellation', async ({ page }) => {
  await page.addInitScript(
    ({ reasoning, initial }) => localStorage.setItem(reasoning, JSON.stringify(initial)),
    { reasoning, initial },
  );
  await page.goto('/?space=demo#/math');
  const plot = page.locator('.vector-plot');
  await expect(plot).toBeVisible();
  await page.getByRole('button', { name: '보기 초기화', exact: true }).click();
  await plot.scrollIntoViewIfNeeded();
  const before = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key);
  const box = await plot.boundingBox();
  if (!box) throw new Error('No plot bounds');
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.55, { steps: 5 });
  await page.mouse.up();
  await expect
    .poll(() =>
      page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).entries.A2.view.x, key),
    )
    .not.toBe(0);
  const dragged = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key);
  const unchanged = await plot.evaluate((node) =>
    node.dispatchEvent(
      new WheelEvent('wheel', { deltaY: 30, ctrlKey: false, bubbles: true, cancelable: true }),
    ),
  );
  expect(unchanged).toBe(true);
  await plot.evaluate((node) => {
    const b = node.getBoundingClientRect(),
      y = b.y + b.height * 0.5;
    const send = (type: string, id: number, x: number) =>
      node.dispatchEvent(
        new PointerEvent(type, {
          pointerType: 'touch',
          pointerId: id,
          clientX: x,
          clientY: y,
          button: 0,
          bubbles: true,
          cancelable: true,
        }),
      );
    send('pointerdown', 11, b.x + b.width * 0.4);
    send('pointerdown', 12, b.x + b.width * 0.6);
    send('pointermove', 12, b.x + b.width * 0.7);
  });
  await expect
    .poll(() =>
      page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).entries.A2.view.zoom, key),
    )
    .toBeGreaterThan(dragged.entries.A2.view.zoom);
  await plot.evaluate((node) =>
    node.dispatchEvent(
      new PointerEvent('pointercancel', { pointerType: 'touch', pointerId: 11, bubbles: true }),
    ),
  );
  const after = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key);
  expect(after.entries.A2.values).toEqual(before.entries.A2.values);
  expect(after.entries.A2.notes).toEqual(before.entries.A2.notes);
  await page.reload();
  expect(
    await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).entries.A2.view, key),
  ).toEqual(after.entries.A2.view);
});
test('17 observations, LaTeX, exact and pending values, memo, reload, source and caller return', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(
    ({ reasoning, initial }) => localStorage.setItem(reasoning, JSON.stringify(initial)),
    { reasoning, initial },
  );
  await page.goto('/?space=demo#/math');
  const workspace = page.getByRole('region', {
    name: '벡터 미적분 자료와 관찰',
    exact: true,
  });
  await expect(workspace.getByRole('heading', { name: '내적', exact: true })).toBeVisible();
  const ledger = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  await workspace.getByText('전체 개념 목록 · 현재 내적', { exact: true }).click();
  for (const module of content) {
    await workspace
      .getByRole('button', {
        name: `${module.title} ${module.question}`,
        exact: true,
      })
      .click();
    await expect(workspace.getByRole('heading', { name: module.title, exact: true })).toBeVisible();
    expect(await workspace.locator('.katex-error').count()).toBe(0);
    expect(await workspace.evaluate((el) => el.scrollWidth > el.clientWidth + 2), module.id).toBe(
      false,
    );
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
  const memo = '  벡터·조건을 그대로 기록한다.\n정사영의 기준 w는 비영이어야 한다.  ';
  await workspace.getByLabel('이 관찰의 개인 메모').fill(memo);
  await workspace.getByRole('button', { name: '그래프 확대', exact: true }).click();
  await theta.fill('1e-');
  await theta.press('Enter');
  await expect(theta).toHaveAttribute('aria-invalid', 'true');
  await page.reload();
  await expect(theta).toHaveValue('1e-');
  await expect(workspace.locator('dd').first()).toHaveText('0');
  await expect(workspace.getByLabel('이 관찰의 개인 메모')).toHaveValue(memo);
  await workspace.getByRole('button', { name: '크게 보기', exact: true }).click();
  const full = page.getByRole('dialog', {
    name: '내적 · 전체 관찰',
    exact: true,
  });
  await expect(full.getByRole('region', { name: /교재 원식/ })).toBeVisible();
  await full.getByRole('button', { name: '현재 질문으로 돌아가기', exact: true }).click();
  await expect(full.locator('[data-vector-question]')).toBeFocused();
  await full.getByRole('button', { name: '내적 · 전체 관찰 닫기', exact: true }).click();
  await expect(workspace.getByRole('button', { name: '크게 보기', exact: true })).toBeFocused();
  await workspace.getByRole('button', { name: '원문 위치 확인', exact: true }).click();
  const source = page.getByRole('dialog', {
    name: '원문 위치와 파일 연결',
    exact: true,
  });
  await expect(source).toContainText('책에 인쇄된 쪽 15–19');
  await expect(source).toContainText('PDF 물리 페이지 1');
  await source.getByRole('button', { name: '원문 위치와 파일 연결 닫기', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(ledger);
  await page.goto('/?space=demo#/materials/vector-calculus');
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
  await expect(small.getByRole('button', { name: '크게 보기', exact: true })).toBeFocused();
  await small.getByRole('button', { name: '탐구 작업대에서 열기', exact: true }).click();
  await expect(page).toHaveURL(/#\/math$/);
  await page.getByRole('button', { name: '읽던 자료 관찰로 돌아가기', exact: true }).click();
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
  expect(axe.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')).toEqual(
    [],
  );
  expect(errors).toEqual([]);
});
test('save failure, exact value, retry and damaged source protection', async ({ page }) => {
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
  await page.goto('/?space=demo#/math');
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
  await workspace.getByRole('button', { name: '관찰 저장 다시 시도', exact: true }).click();
  await expect(workspace).toContainText('관찰 보기 저장됨 · 이 기기');
  await page.evaluate((key) => localStorage.setItem(key, '{broken original  정확한 원문  '), key);
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

test('all 17 extensions render with source formulas, bounded plots and preserved separate drafts', async ({
  page,
}, info) => {
  const failures: string[] = [];
  page.on('pageerror', (e) => failures.push(e.message));
  await page.goto('/?space=demo#/materials/vector-calculus');
  for (const m of content) {
    await page.getByRole('button', { name: `${m.title} ${m.question}`, exact: true }).click();
    const dialog = page.getByRole('dialog', { name: `${m.title} · 자료 곁의 관찰`, exact: true });
    await dialog.getByRole('button', { name: EXTENSION_NAMES[m.id], exact: true }).click();
    await expect(
      dialog.getByRole('region', {
        name: '교재 밖 관찰 예시의 식 · 가로로 이동해 전체 보기',
        exact: true,
      }),
    ).toBeVisible();
    const visual = dialog.locator('[data-observation-region="visual"]');
    if (m.id !== 'C2') {
      await expect(visual).toBeVisible();
      const plot = visual.locator('.math-plot,.vector-plot');
      await expect(plot).toBeVisible();
      expect((await plot.boundingBox())!.height).toBeLessThan(1000);
      if (m.id === 'C4') {
        await expect(visual.locator('.heatmaplayer image').first()).toBeAttached();
        await expect(visual).toContainText('질량/면적');
        await expect(dialog).toContainText('현재 (a,b)의 밀도 δ');
        await expect(visual.getByText('공간 시점의 정확한 조절', { exact: true })).toHaveCount(0);
      } else if (await visual.locator('.math-plot').count())
        await expect(visual.locator('.js-plotly-plot canvas').first()).toBeAttached();
    }
    expect(await dialog.locator('.katex-error').count(), m.id).toBe(0);
    expect(await dialog.evaluate((el) => el.scrollWidth > el.clientWidth + 2), m.id).toBe(false);
    await dialog
      .getByLabel('이 관찰의 개인 메모')
      .fill(` ${m.id} 확장·원문 연결\n조건을 보존한다. `);
    if (m.id === 'A5') {
      await dialog.getByRole('combobox', { name: '공간곡선 선택', exact: true }).selectOption('1');
      await expect(dialog.getByRole('list', { name: '공간 도해 표식' })).toContainText(
        '베지에 제어 다각형',
      );
      await dialog
        .locator('[data-observation-region="visual"]')
        .screenshot({ path: `work/vector-calculus-20261003/${info.project.name}-space-curve.png` });
    }
    await dialog
      .getByRole('button', { name: `${m.title} · 자료 곁의 관찰 닫기`, exact: true })
      .click();
  }
  await page.reload();
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key);
  for (const m of content) {
    expect(saved.selected[m.id]).toBe(`${m.id}:extension:1`);
    expect(saved.entries[`${m.id}:extension:1`].notes).toBe(
      ` ${m.id} 확장·원문 연결\n조건을 보존한다. `,
    );
  }
  expect(failures).toEqual([]);
});

test('source PDF pages, item links, file identity and source reading position survive reopen', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/?space=demo#/materials/vector-calculus');
  await page
    .getByRole('button', { name: '내적 한 방향으로 얼마나 향하고 있을까?', exact: true })
    .click();
  const small = page.getByRole('dialog', { name: '내적 · 자료 곁의 관찰', exact: true });
  await small.getByRole('button', { name: '원문 위치 확인', exact: true }).click();
  const source = page.getByRole('dialog', { name: '원문 위치와 파일 연결', exact: true });
  await source.getByText('현재 개념의 절 본문 전체 읽기', { exact: true }).click();
  await expect(source.getByRole('button', { name: /^1\.3 .* · 책 15$/ })).toHaveCount(1);
  await expect(source.locator('canvas[aria-label="원본 책 쪽 15"]')).toBeVisible();
  await expect.poll(() => source.locator('canvas').evaluate((el) => el.width)).toBeGreaterThan(0);
  await expect(source).not.toContainText('이 실행 환경의 원본 경로를 열지 못했다');
  const input = source.getByLabel('원본 PDF 연결 · 이 기기에 보관', { exact: true });
  await input.setInputFiles(
    '/Users/manseeksong/Library/Mobile Documents/com~apple~CloudDocs/산출물/vector calculus.pdf',
  );
  await expect(source.getByText('원문을 읽는 중이다.', { exact: true })).toBeHidden();
  await source.getByLabel('읽을 책 인쇄 쪽', { exact: true }).fill('81');
  const original = source.locator('canvas[aria-label="원본 책 쪽 81"]');
  await expect(original).toBeVisible();
  await expect.poll(() => original.evaluate((el) => el.width)).toBeGreaterThan(0);
  await expect(source.getByText('원문을 읽는 중이다.', { exact: true })).toBeHidden();
  await original.screenshot({
    path: `work/vector-calculus-20261003/${info.project.name}-original-page.png`,
  });
  await source.getByRole('button', { name: '원문 확대', exact: true }).click();
  await expect(source.getByText('원문을 읽는 중이다.', { exact: true })).toBeHidden();
  const pdfKey = 'study-space:demo:vector-calculus:source:A2:v1';
  await expect
    .poll(() => page.evaluate((k) => JSON.parse(localStorage.getItem(k)!).zoom, pdfKey))
    .toBe(1.25);
  await source.getByText('현재 개념의 연습문제 원문 · 새 풀이 없이 읽기', { exact: true }).click();
  await source.getByText('문제별 원문 26개', { exact: true }).click();
  await source.getByRole('button', { name: '절 1.3 · 문제 26 · 책 19', exact: true }).click();
  await expect(source.locator('#source-exercise\\:1\\.3\\:26')).toContainText('26.');
  await input.setInputFiles({
    name: 'wrong.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-different-source'),
  });
  await expect(source).toContainText('다른 파일이다');
  expect(await source.locator('canvas').count()).toBe(1);
  await source.getByRole('button', { name: '원문 위치와 파일 연결 닫기', exact: true }).click();
  await page.reload();
  await expect(small).toBeVisible();
  await small.getByRole('button', { name: '원문 위치 확인', exact: true }).click();
  await expect(source.getByLabel('읽을 책 인쇄 쪽', { exact: true })).toHaveValue('19');
  await expect(source.getByText('원문을 읽는 중이다.', { exact: true })).toBeHidden();
  await expect(source.locator('canvas')).toHaveCSS('width', '502.5px');
  expect(errors).toEqual([]);
});

test('durable recovery restores pending input after reload; full reading position and values survive', async ({
  page,
}) => {
  await page.addInitScript(
    ({ key, reasoning, initial }) => {
      localStorage.setItem(reasoning, JSON.stringify(initial));
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key && !(window as any).__vectorStorageAllowed)
          throw new DOMException('quota', 'QuotaExceededError');
        return set.call(this, k, v);
      };
    },
    { key, reasoning, initial },
  );
  await page.goto('/?space=demo#/math');
  const workspace = page.getByRole('region', { name: '벡터 미적분 자료와 관찰', exact: true });
  const theta = workspace.getByLabel('θ · 각도 (°)', { exact: true });
  await theta.fill('91.234567');
  await theta.press('Enter');
  await theta.fill('1e-');
  await theta.press('Enter');
  await workspace.getByLabel('이 관찰의 개인 메모').fill('  실패 후 복구\n원문 입력 유지  ');
  await expect(workspace).toContainText('복구 사본 보관됨 · 이 기기');
  await page.reload();
  await expect(theta).toHaveValue('1e-');
  await expect(theta).toHaveAttribute('aria-invalid', 'true');
  await expect(workspace.getByLabel('이 관찰의 개인 메모')).toHaveValue(
    '  실패 후 복구\n원문 입력 유지  ',
  );
  // Restored storage can make a queued reading save succeed and remove the retry button.
  // Focus while storage is still unavailable; then activate or observe the successful auto save.
  await workspace.getByRole('button', { name: '관찰 저장 다시 시도', exact: true }).focus();
  await page.evaluate(() => {
    (window as any).__vectorStorageAllowed = true;
  });
  await page.keyboard.press('Enter');
  await expect
    .poll(() =>
      page.evaluate((k) => JSON.parse(localStorage.getItem(k)!).entries.A2.drafts.theta, key),
    )
    .toBe('1e-');
  await workspace.getByRole('button', { name: '크게 보기', exact: true }).click();
  const full = page.getByRole('dialog', { name: '내적 · 전체 관찰', exact: true });
  await full.getByRole('heading', { name: '계산·조건·한계', exact: true }).scrollIntoViewIfNeeded();
  await expect
    .poll(() => page.evaluate((k) => JSON.parse(localStorage.getItem(k)!).reading.scroll, key))
    .toBeGreaterThan(100);
  const before = await full.evaluate((el) => el.scrollTop);
  await page.reload();
  await expect(full).toBeVisible();
  await expect.poll(() => full.evaluate((el) => el.scrollTop)).toBeGreaterThan(before - 20);
  await full.getByRole('button', { name: '내적 · 전체 관찰 닫기', exact: true }).click();
  await expect(workspace.getByLabel('θ · 각도 (°)', { exact: true })).toHaveValue('1e-');
});

test('failed primary and backup writes retain raw input and expose export without false receipt', async ({
  page,
}) => {
  await page.addInitScript(
    ({ reasoning, initial }) => localStorage.setItem(reasoning, JSON.stringify(initial)),
    { reasoning, initial },
  );
  await page.goto('/?space=demo#/math');
  const workspace = page.getByRole('region', { name: '벡터 미적분 자료와 관찰', exact: true });
  await expect(workspace.getByLabel('v의 크기', { exact: true })).toBeVisible();
  await page.evaluate(async (key) => {
    const request = indexedDB.open('study-space-material-files', 1);
    await new Promise<void>((resolve, reject) => {
      request.onsuccess = () => {
        request.result.close();
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw new DOMException('quota', 'QuotaExceededError');
      return set.call(this, k, v);
    };
    Object.defineProperty(IDBFactory.prototype, 'open', {
      configurable: true,
      value() {
        throw new DOMException('blocked database', 'InvalidStateError');
      },
    });
  }, key);
  await workspace.getByLabel('v의 크기', { exact: true }).fill('2.345678901');
  await workspace.getByLabel('v의 크기', { exact: true }).press('Enter');
  await expect(workspace).toContainText('원래 저장과 기기 복구 사본 보관을 모두 마치지 못했다');
  await expect(workspace.getByLabel('v의 크기', { exact: true })).toHaveValue('2.345678901');
  await expect(
    workspace.getByRole('button', { name: '현재 관찰 파일로 보관', exact: true }),
  ).toBeVisible();
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBeNull();
});

test('conflicting durable backup is protected through later canonical edits', async ({ page }) => {
  await page.addInitScript(
    ({ reasoning, initial }) => localStorage.setItem(reasoning, JSON.stringify(initial)),
    { reasoning, initial },
  );
  await page.goto('/?space=demo#/math');
  const workspace = page.getByRole('region', { name: '벡터 미적분 자료와 관찰', exact: true });
  await workspace.getByLabel('이 관찰의 개인 메모').fill('현재 저장 원문');
  await page.evaluate(async (key) => {
    const workspace = { version: 1, active: 'A2', query: '', entries: {} };
    const request = indexedDB.open('study-space-material-files', 1);
    await new Promise<void>((resolve, reject) => {
      request.onsuccess = () => {
        const db = request.result,
          tx = db.transaction('drafts', 'readwrite');
        tx.objectStore('drafts').put(
          { version: 1, baseRaw: null, workspace },
          `${key}:recovery:v1`,
        );
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => reject(tx.error);
      };
      request.onerror = () => reject(request.error);
    });
  }, key);
  await page.reload();
  await expect(workspace).toContainText('다른 창의 변경을 보호');
  await workspace.getByLabel('이 관찰의 개인 메모').fill('현재 저장에 명시적으로 덧쓴 메모');
  await expect(workspace).toContainText('관찰 보기 저장됨 · 이 기기');
  const preserved = await page.evaluate(async (key) => {
    const request = indexedDB.open('study-space-material-files', 1);
    return new Promise<any>((resolve, reject) => {
      request.onsuccess = () => {
        const db = request.result,
          tx = db.transaction('drafts', 'readonly'),
          read = tx.objectStore('drafts').get(`${key}:recovery:v1`);
        read.onsuccess = () => {
          resolve(read.result);
          db.close();
        };
        read.onerror = () => reject(read.error);
      };
      request.onerror = () => reject(request.error);
    });
  }, key);
  expect(preserved.baseRaw).toBeNull();
  expect(preserved.workspace.entries).toEqual({});
});
