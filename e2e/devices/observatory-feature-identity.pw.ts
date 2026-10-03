import { expect, test, type Locator, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { decodeStoredText } from '../../src/data/storage-codec';

const storageKey = 'study-space:demo:v1';
const original = `  정체성 변경 뒤에도 보존하는 조건과 예외\n${'긴 한국어 설명과 아직 확인하지 못한 조건. '.repeat(35)}\n끝 공백  `;

async function storedData(page: Page) {
  const raw = await page.evaluate((key) => localStorage.getItem(key), storageKey);
  if (!raw) throw new Error('격리된 합성 공부 공간이 없습니다.');
  return JSON.parse(decodeStoredText(raw)).data;
}

async function expectWithinWidth(page: Page, scope?: Locator) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
  if (scope) {
    const outliers = await scope
      .locator('input:not([type="hidden"]), select, textarea, button')
      .evaluateAll((elements) =>
        elements
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return (
              rect.width > 0 && rect.height > 0 && (rect.left < -1 || rect.right > innerWidth + 1)
            );
          })
          .map(
            (element) =>
              element.getAttribute('aria-label') ||
              element.textContent?.trim().slice(0, 80) ||
              element.tagName,
          ),
      );
    expect(outliers).toEqual([]);
  }
}

async function expectBefore(first: Locator, second: Locator) {
  const firstHandle = await first.elementHandle();
  const secondHandle = await second.elementHandle();
  if (!firstHandle || !secondHandle) throw new Error('작업면 순서를 확인할 요소가 없습니다.');
  expect(
    await firstHandle.evaluate(
      (node, after) =>
        Boolean(node.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING),
      secondHandle,
    ),
  ).toBe(true);
  const a = await first.boundingBox();
  const b = await second.boundingBox();
  if (!a || !b) throw new Error('작업면이 렌더되지 않았습니다.');
  expect(a.y + a.height).toBeLessThanOrEqual(b.y + 1);
}

test('ten task compositions keep their identities, Korean tasks and readable narrow surfaces', async ({
  page,
}, info) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('?space=demo#/subjects');
  await expect(page.getByRole('button', { name: '과목 추가', exact: true })).toBeVisible();
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), storageKey))
    .not.toBeNull();
  const before = await storedData(page);
  const routes = [
    ['/subjects', 'catalogue'],
    ['/record', 'journal'],
    ['/free/new', 'document'],
    ['/practice', 'practice'],
    ['/math', 'instrument'],
    ['/statistics', 'analysis'],
    ['/canvas', 'spatial'],
    ['/board', 'board'],
    ['/schedules', 'timeline'],
    ['/backup', 'control'],
  ];
  for (const [route, composition] of routes) {
    await test.step(`${composition}: ${route}`, async () => {
      await page.goto(`?space=demo#${route}`);
      const main = page.locator('main#main');
      await expect(main).toHaveAttribute('data-feature-identity', /\S+/);
      await expect(main).toHaveAttribute('data-feature-composition', composition);
      await expect(main).toHaveAttribute('data-feature-entity', /^R\d+$/);
      await expect(main.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(main.locator('.feature-purpose')).toBeVisible();
      await expectWithinWidth(page);
      if (['document', 'practice', 'control'].includes(composition)) {
        const normalWidth = await main.evaluate((element) => element.getBoundingClientRect().width);
        const tools = page.locator('.sidebar-bottom:visible, .compact-menu:visible').first();
        const width = tools.getByRole('combobox', { name: '본문 읽기 폭', exact: true });
        if (!(await width.isVisible())) await tools.locator('summary').click();
        await width.selectOption('wide');
        await expect(page.locator('.app-shell')).toHaveAttribute('data-reading-width', 'wide');
        await expect(main).toHaveCSS('max-inline-size', 'none');
        const wideWidth = await main.evaluate((element) => element.getBoundingClientRect().width);
        expect(wideWidth).toBeGreaterThanOrEqual(normalWidth - 1);
        if ((page.viewportSize()?.width ?? 0) >= 1300)
          expect(wideWidth).toBeGreaterThan(normalWidth + 20);
        await page.reload();
        await expect(page.locator('.app-shell')).toHaveAttribute('data-reading-width', 'wide');
        await expect(main).toHaveCSS('max-inline-size', 'none');
        if (!(await width.isVisible())) await tools.locator('summary').click();
        await width.selectOption('normal');
        await expect(page.locator('.app-shell')).toHaveAttribute('data-reading-width', 'normal');
        await tools.locator('summary').click();
      }
      if (['catalogue', 'analysis', 'board'].includes(composition)) {
        await main.screenshot({ path: info.outputPath(`identity-${composition}.png`) });
      }
    });
  }
  const after = await storedData(page);
  expect(after).toEqual(before);
  expect(errors).toEqual([]);
});

test('journal and document task surfaces retain long Korean drafts, original whitespace and distinct study meaning', async ({
  page,
}, info) => {
  await page.goto('?space=demo#/record');
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  const memo = page.getByRole('textbox', { name: '메모', exact: true });
  await memo.fill(original);
  await page.getByRole('checkbox', { name: '공부함', exact: true }).uncheck();
  await expectWithinWidth(page, page.locator('main#main'));
  await page.reload();
  await expect(memo).toHaveValue(original);
  await expect(page.getByRole('checkbox', { name: '공부함', exact: true })).not.toBeChecked();
  await page.getByRole('button', { name: '1개 주제 기록 저장', exact: true }).click();
  await expect.poll(async () => (await storedData(page)).records.length).toBe(1);
  const record = (await storedData(page)).records[0];
  expect(record.body).toBe(original);
  expect(record.done).toBe(false);
  await page.goto('?space=demo#/free/new');
  const editor = page.getByRole('textbox', { name: '자유 기록', exact: true });
  if (!(await editor.isVisible())) await page.locator('.narrative-editor > summary').click();
  const freeText = `  자유 기록의 생각과 미확인 조건\n${original}\n  `;
  await editor.fill(freeText);
  await expectWithinWidth(page, page.locator('.narrative-editor'));
  await page.reload();
  await expect(editor).toHaveValue(freeText);
  await page.getByRole('button', { name: '내용 저장', exact: true }).click();
  await expect(page).toHaveURL(/#\/free\/(?!new)[^/]+$/);
  await page.reload();
  await expect(editor).toHaveValue(freeText);
  const regions = await page.locator('.free-note-workspace').evaluate((node) => {
    const list = node.querySelector('.free-note-list')!, editor = node.querySelector('.free-note-editor')!;
    return { listBeforeEditor: Boolean(list.compareDocumentPosition(editor) & Node.DOCUMENT_POSITION_FOLLOWING),
      list: list.getBoundingClientRect().left, editor: editor.getBoundingClientRect().left };
  });
  expect(regions.listBeforeEditor).toBe(true);
  if (info.project.use.viewport!.width >= 1300) expect(regions.editor).toBeGreaterThan(regions.list);
  const saved = await storedData(page);
  expect(saved.records).toEqual([record]);
  expect(
    saved.narratives.find((row: { kind: string; body: string }) => row.kind === 'free-note')?.body,
  ).toBe(freeText);
  await expectWithinWidth(page);
  await page
    .locator('.narrative-editor')
    .screenshot({ path: info.outputPath('identity-document-original.png') });
});

test('analysis establishes scope before charts and keeps multiple shapes, value lists and original evidence in reach', async ({
  page,
}, info) => {
  test.setTimeout(150000);
  const { raw } = JSON.parse(
    readFileSync(new URL('./fixtures/statistics-charts.json', import.meta.url), 'utf8'),
  ) as { raw: string };
  await page.clock.install({ time: new Date('2026-10-01T01:00:00Z') });
  await page.addInitScript(
    ({ key, value }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, value);
    },
    { key: storageKey, value: raw },
  );
  await page.goto('?space=demo#/statistics');
  const scope = page.getByRole('region', { name: '통계 범위와 비교', exact: true });
  await expect(scope).toBeVisible();
  await scope.getByLabel('통계 시작일', { exact: true }).fill('2026-09-01');
  await scope.getByLabel('통계 종료일', { exact: true }).fill('2026-09-30');
  await scope.getByLabel('통계 과목', { exact: true }).selectOption('demo-subject-math');
  await scope.getByLabel('통계 단원·주제', { exact: true }).selectOption('demo-topic-graph');
  await scope.getByRole('checkbox', { name: '같은 길이의 이전 기간과 비교', exact: true }).check();
  await page.getByRole('checkbox', { name: '여러 그래프 한눈에 보기' }).check();
  const gallery = page.getByRole('region', { name: '통계 그래프 한눈에 보기', exact: true });
  const chart = page.getByRole('region', { name: '기간별 통계 그래프', exact: true });
  const shared = page.getByRole('region', { name: '그래프와 원기록 함께 선택', exact: true });
  await expectBefore(scope, gallery);
  await expectBefore(gallery, chart);
  await expectBefore(chart, shared);
  await expectWithinWidth(page, scope);
  const cards = gallery.locator('.statistics-gallery-card');
  expect(await cards.count()).toBeGreaterThanOrEqual(6);
  for (const card of (await cards.all()).slice(0, 2)) {
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator('[data-plot-ready="true"]')).toHaveCount(1);
  }
  await chart.getByLabel('그래프로 볼 통계', { exact: true }).selectOption('writing');
  await chart.getByRole('button', { name: '목록', exact: true }).click();
  await expect(chart.getByRole('table')).toBeVisible();
  await chart.getByRole('button', { name: '기록 보기', exact: true }).first().click();
  const dialog = page.getByRole('dialog', { name: '통계의 원기록', exact: true });
  await expect(
    dialog.getByText('  합성 그래프 확인 28\n조건·예외와 원문  ', { exact: true }),
  ).toBeVisible();
  await expectWithinWidth(page, dialog);
  await dialog.getByRole('button', { name: '통계의 원기록 닫기', exact: true }).click();
  await page.reload();
  await expect(scope.getByLabel('통계 시작일', { exact: true })).toHaveValue('2026-09-01');
  await expect(scope.getByLabel('통계 종료일', { exact: true })).toHaveValue('2026-09-30');
  await expect(scope.getByLabel('통계 과목', { exact: true })).toHaveValue('demo-subject-math');
  await expect(scope.getByLabel('통계 단원·주제', { exact: true })).toHaveValue('demo-topic-graph');
  await expect(
    scope.getByRole('checkbox', { name: '같은 길이의 이전 기간과 비교', exact: true }),
  ).toBeChecked();
  expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBe(raw);
  await scope.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('identity-statistics-scope.png') });
  await expectWithinWidth(page);
});

test('spatial tools keep explicit Canvas links, saved positions and view through graph and ceiling return', async ({
  page,
}, info) => {
  await page.goto('?space=demo#/canvas');
  await expect(page.locator('.canvas-stage .react-flow__node').first()).toBeVisible();
  await page.getByRole('button', { name: '개념 연결', exact: true }).click();
  await page.getByLabel('시작 개념', { exact: true }).selectOption('node:demo-topic-function');
  await page.getByLabel('이어지는 개념', { exact: true }).selectOption('node:demo-topic-graph');
  await page.getByLabel('관계 설명', { exact: true }).fill('  내가 고른 관계 · 이유와 예외  ');
  await page.getByRole('button', { name: '연결하기', exact: true }).click();
  await page.getByLabel('조작할 카드', { exact: true }).selectOption('node:demo-topic-function');
  await page.getByLabel('선택한 카드 너비', { exact: true }).fill('420');
  await expect.poll(async () => (await storedData(page)).canvasLayouts.length).toBe(1);
  const saved = (await storedData(page)).canvasLayouts;
  expect(saved[0].links[0].label).toBe('  내가 고른 관계 · 이유와 예외  ');
  await page.goto('?space=demo#/graph');
  await expect(page.locator('main#main')).toHaveAttribute('data-feature-composition', 'spatial');
  await expect(page.locator('.graph-stage')).toHaveAttribute('aria-busy', 'false');
  await page.getByRole('link', { name: '어디서나 찾기', exact: true }).click();
  await expect(page.getByRole('link', { name: '원래 자리로', exact: true })).toBeVisible();
  await page.getByRole('link', { name: '원래 자리로', exact: true }).click();
  await expect(page).toHaveURL(/#\/graph$/);
  await page.goto('?space=demo#/canvas');
  await page.reload();
  await page.getByLabel('조작할 카드', { exact: true }).selectOption('node:demo-topic-function');
  await expect(page.getByLabel('선택한 카드 너비', { exact: true })).toHaveValue('420');
  expect((await storedData(page)).canvasLayouts).toEqual(saved);
  await expectWithinWidth(page);
  await page
    .locator('.canvas-stage')
    .screenshot({ path: info.outputPath('identity-canvas-preserved.png') });
});

test('ink and board keep narrow action groups usable, drawing and long card text across reopening', async ({
  page,
}, info) => {
  test.setTimeout(150000);
  await page.goto('?space=demo#/memos');
  await page.getByRole('button', { name: '메모 추가', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('[data-feature-entity="U29"]')).toHaveAttribute(
    'data-feature-identity',
    'ink',
  );
  const paper = page.getByRole('img', { name: '메모 스케치 영역', exact: true });
  await page.locator('.ink-pad-paper').scrollIntoViewIfNeeded();
  await page.locator('.ink-pad-paper').evaluate((element) => {
    element.scrollTop = 0;
    element.scrollLeft = 0;
  });
  const box = await paper.boundingBox();
  if (!box) throw new Error('필기 종이가 표시되지 않았습니다.');
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.15);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.15 + 8, { steps: 8 });
  await page.mouse.up();
  const paths = page.locator('.ink-pad-paper path[d]:not([d=""])');
  await expect(paths).toHaveCount(1);
  const path = await paths.first().getAttribute('d');
  if (!path) throw new Error('합성 필기 선이 저장되지 않았습니다.');
  await dialog.getByRole('button', { name: '그림 되돌리기', exact: true }).click();
  await expect(paths).toHaveCount(0);
  await dialog.getByRole('button', { name: '다시 그리기', exact: true }).click();
  await expect(paths.first()).toHaveAttribute('d', path);
  await expectWithinWidth(page, dialog);
  await dialog.screenshot({ path: info.outputPath('identity-ink-tools.png') });
  await dialog.getByRole('button', { name: '닫기', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: /메모 1 열기/ }).click();
  await expect(paths.first()).toHaveAttribute('d', path);
  await dialog.getByRole('button', { name: '닫기', exact: true }).click();
  const memos = (await storedData(page)).memos;
  await page.goto('?space=demo#/board');
  await page
    .getByRole('button', { name: /에 카드 추가$/ })
    .first()
    .click();
  const title = '긴 한국어 조건과 예외를 남기는 공부 계획 카드';
  await page.getByLabel('할 일', { exact: true }).fill(title);
  await page.getByLabel('메모 (선택)', { exact: true }).fill(original);
  await expectWithinWidth(page, page.getByRole('dialog'));
  await page.getByRole('button', { name: '카드 저장', exact: true }).click();
  const card = page.getByRole('article', { name: `카드 ${title}`, exact: true });
  await card.getByText('카드 이동·보관', { exact: true }).click();
  await card.getByLabel(`${title} 옮길 열`, { exact: true }).selectOption('in-progress');
  await page.reload();
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: '글 전체 보기', exact: true }).click();
  await expect(page.getByLabel('메모 (선택)', { exact: true })).toHaveValue(original);
  const stored = await storedData(page);
  expect(stored.memos).toEqual(memos);
  expect(stored.studyBoards[0].cards[0]).toMatchObject({
    title,
    body: original,
    columnId: 'in-progress',
  });
  expect(stored.records).toHaveLength(0);
  await expectWithinWidth(page, page.getByRole('dialog'));
  await page.getByRole('dialog').screenshot({ path: info.outputPath('identity-board-card.png') });
});
