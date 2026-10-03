import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test';
import { applyCommand } from '../../src/domain/commands';
import { createDemoState } from '../../src/domain/fixtures';
import type { AppState, Command } from '../../src/domain/model';
import { decodeStoredText, encodeStoredText } from '../../src/data/storage-codec';

const storageKey = 'study-space:demo:v1';
const original = `  격리된 화면 검사의 원문\n${'조건·예외·미확인 내용을 보존합니다. '.repeat(12)}\n끝 공백  `;
const contract = JSON.parse(readFileSync('docs/observatory-feature-identities.json', 'utf8'));
const sourceInventory = JSON.parse(
  readFileSync('docs/figma-observatory-20261002/screen-inventory.json', 'utf8'),
);

function fixture() {
  let data = createDemoState();
  const at = '2026-10-02T03:00:00.000Z';
  const shared = { at, userId: data.userId };
  const card = {
    topicId: 'demo-topic-function',
    question: '어떤 조건을 확인했나요?',
    answer: original,
    strokes: [],
  };
  const commands: Command[] = [
    {
      ...shared,
      opId: 'ui-record',
      type: 'saveRecords',
      sessionId: 'ui-session',
      dateEvidence: { kind: 'unknown' },
      entries: [{ targetId: 'demo-topic-function', done: false, body: original }],
    },
    {
      ...shared,
      opId: 'ui-note',
      type: 'updateNarrative',
      id: 'ui-note',
      kind: 'free-note',
      ownerId: null,
      body: original,
      expectedVersion: 0,
    },
    {
      ...shared,
      opId: 'ui-memo',
      type: 'saveMemo',
      id: 'ui-memo',
      ownerId: null,
      body: original,
      strokes: [],
      expectedVersion: 0,
    },
    {
      ...shared,
      opId: 'ui-material',
      type: 'saveStudyMaterial',
      id: 'ui-material',
      expectedVersion: 0,
      content: {
        title: '원자료의 조건과 예외 · 합성 자료',
        subjectId: 'demo-subject-math',
        topicId: 'demo-topic-function',
        sourceText: original,
        audio: null,
        results: [],
      },
    },
    {
      ...shared,
      opId: 'ui-code',
      type: 'saveCodeExample',
      id: 'ui-code',
      expectedVersion: 0,
      content: {
        title: '긴 한국어 제목의 합성 예제',
        language: 'javascript',
        code: '// 원문과 줄바꿈 보존\nconsole.log(7);',
        stdin: '',
        notes: original,
      },
    },
    {
      ...shared,
      opId: 'ui-card',
      type: 'saveMemoryCard',
      id: 'ui-card',
      expectedVersion: 0,
      content: card,
    },
    {
      ...shared,
      opId: 'ui-result',
      type: 'saveMemoryTest',
      id: 'ui-result',
      content: {
        startedAt: at,
        endedAt: at,
        questions: [
          {
            ...card,
            cardId: 'ui-card',
            cardVersion: 1,
            topicName: '함수는 어떤 관계일까?',
            response: original,
            responseStrokes: [],
            verdict: 'uncertain',
          },
        ],
      },
    },
  ];
  for (const command of commands) data = applyCommand(data, command);
  return encodeStoredText(JSON.stringify({ sequence: commands.length, data }));
}

const dynamicRoutes: Record<string, string> = {
  R19: '/subject/demo-subject-math',
  R20: '/node/demo-topic-function',
  R21: '/record/demo-topic-function',
  R22: '/memos/ui-memo',
  R23: '/materials/ui-material',
  R25: '/code/ui-code',
  R26: '/practice/demo-topic-function',
  R27: '/memory-test/demo-topic-function',
  R28: '/memory-test/result/ui-result',
  R32: '/free/ui-note',
  R41: '/missing-ui-item',
};
type Surface = { id: string; name: string; path: string };
const groups: Record<string, string[]> = {
  desk: [
    'R01',
    'R05',
    'R06',
    'R10',
    'R11',
    'R14',
    'R20',
    'R21',
    'R22',
    'R26',
    'R27',
    'R28',
    'R29',
    'R30',
    'R31',
    'R32',
  ],
  library: ['R04', 'R07', 'R12', 'R13', 'R19', 'R23'],
  workbench: ['R08', 'R09', 'R25'],
  wall: ['R02', 'R03', 'R15', 'R16', 'R17', 'R36'],
  ceiling: ['R18', 'R24', 'R33', 'R34', 'R35', 'R37', 'R38', 'R39', 'R40', 'R41'],
};
const axeRepresentatives = new Set([
  'R01',
  'R05',
  'R06',
  'R10',
  'R11',
  'R14',
  'R31',
  'R04',
  'R07',
  'R12',
  'R13',
  'R08',
  'R09',
  'R02',
  'R03',
  'R15',
  'R16',
  'R17',
  'R18',
  'R33',
  'R37',
  'R40',
]);

async function seed(page: Page) {
  const raw = fixture();
  await page.addInitScript(
    ({ key, raw }) => {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, raw);
    },
    { key: storageKey, raw },
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  return raw;
}

async function metrics(page: Page) {
  return page.evaluate(() => {
    const visible = (node: Element) => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden';
    };
    const controls = [
      ...document.querySelectorAll<HTMLElement>(
        'main button, main input, main select, main textarea, [role="dialog"] button, [role="dialog"] input',
      ),
    ]
      .filter(visible)
      .filter((node) => !node.closest('.monaco-editor, .cm-editor, .react-flow__viewport'));
    const inputs = controls.filter(
      (node) =>
        node.matches('input,select,textarea') &&
        !['checkbox', 'radio', 'range', 'file', 'hidden'].includes(node.getAttribute('type') ?? ''),
    );
    return {
      hash: location.hash,
      width: innerWidth,
      pageWidth: document.documentElement.scrollWidth,
      title: document.querySelector('main h1')?.textContent,
      headings: [...document.querySelectorAll('main h1,main h2,main h3')]
        .filter(visible)
        .map((node) => ({
          level: node.tagName,
          text: node.textContent,
          font: getComputedStyle(node).fontFamily,
          size: getComputedStyle(node).fontSize,
          lineHeight: getComputedStyle(node).lineHeight,
        })),
      bodyFont: getComputedStyle(document.body).fontFamily,
      readingFont: getComputedStyle(document.documentElement).getPropertyValue('--font-reading'),
      smallInputs: inputs
        .filter((node) => parseFloat(getComputedStyle(node).fontSize) < 16)
        .map((node) => ({
          label: node.getAttribute('aria-label') || node.id,
          size: getComputedStyle(node).fontSize,
        })),
      oversizedControls: controls
        .filter((node) => node.getBoundingClientRect().width > innerWidth + 1)
        .map((node) => node.getAttribute('aria-label') || node.textContent?.trim().slice(0, 100)),
      smallText: [
        ...document.querySelectorAll<HTMLElement>('main p,main label,main button,main summary'),
      ]
        .filter(visible)
        .filter((node) => parseFloat(getComputedStyle(node).fontSize) < 12)
        .map((node) => ({
          text: node.textContent?.slice(0, 100),
          size: getComputedStyle(node).fontSize,
        })),
    };
  });
}

function expectOriginalData(actual: AppState, before: AppState, label: string) {
  const { inkWorkspaces, revisions, appliedOps, ...originals } = actual;
  const {
    inkWorkspaces: oldInk,
    revisions: oldRevisions,
    appliedOps: oldOps,
    ...oldOriginals
  } = before;
  expect.soft(originals, `${label} original records and content`).toEqual(oldOriginals);
  expect
    .soft(revisions.slice(0, oldRevisions.length), `${label} existing revision history`)
    .toEqual(oldRevisions);
  for (const row of oldInk ?? [])
    expect
      .soft(
        inkWorkspaces?.find((item) => item.id === row.id),
        `${label} existing ink`,
      )
      .toEqual(row);
  for (const [id, payload] of Object.entries(oldOps))
    expect.soft(appliedOps[id], `${label} existing operation`).toBe(payload);
  // Opening a new ink sheet persists its empty document viewport, not study evidence.
  for (const revision of revisions.slice(oldRevisions.length)) {
    expect.soft(revision.collection, `${label} additional view history`).toBe('inkWorkspaces');
    expect.soft(revision.before, `${label} new empty view only`).toBeNull();
    const view = (revision.after as NonNullable<AppState['inkWorkspaces']>[number]).content;
    expect.soft(view).toEqual({
      kind: 'document',
      value: {
        fingerprint: '0:0:2166136261',
        page: 0,
        pages: 1,
        redo: [],
        undo: [],
        zoom: 1,
      },
    });
  }
}

async function capture(page: Page, info: TestInfo, name: string) {
  const heading = page.locator('main h1').first();
  if (await heading.isVisible()) await heading.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath(`${name}.png`), animations: 'disabled' });
}

async function waitForDocumentScroll(page: Page) {
  // Key-driven smooth scrolling continues after the first changed scrollY.
  // Inspect geometry only after the browser has stopped moving the viewport.
  await page.evaluate(() => new Promise<void>((resolve) => {
    let previous = scrollY, still = 0;
    const frame = () => {
      const current = scrollY;
      still = current === previous ? still + 1 : 0;
      previous = current;
      if (still >= 4) resolve();
      else requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }));
}

async function reachDocumentTarget(page: Page, target: Locator) {
  // A real key event cancels pending route restoration. WebKit cannot use its
  // element-scroll command to reveal skipped content-visibility descendants.
  await page.keyboard.press('PageDown');
  await waitForDocumentScroll(page);
  const pageSteps = await page.evaluate(
    () => Math.ceil(document.documentElement.scrollHeight / (innerHeight / 2)) + 2,
  );
  for (let step = 0; step < pageSteps; step++) {
    const position = await target.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return { visible: rect.bottom > 0 && rect.top < innerHeight, top: rect.top, scroll: scrollY };
    });
    if (position.visible) break;
    await page.keyboard.press(position.top > 0 ? 'PageDown' : 'PageUp');
    await page.waitForFunction((previous) => scrollY !== previous, position.scroll);
    await waitForDocumentScroll(page);
  }
  await expect(target).toBeInViewport();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}

for (const [place, ids] of Object.entries(groups)) {
  test(`OS UI inventory ${place}: visible routes, typography, controls and original records`, async ({
    page,
  }, info) => {
    test.setTimeout(240_000);
    const raw = await seed(page);
    const findings: unknown[] = [];
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    try {
      for (const id of ids) {
        const surface = (sourceInventory.routes as Surface[]).find((item) => item.id === id);
        if (!surface) throw Error(`The source inventory is missing ${id}.`);
        const route = dynamicRoutes[id] ?? surface.path;
        await test.step(`${id} ${surface.name}`, async () => {
          // The legacy account URL is a document-entry contract, unlike workspace hash navigation.
          await page.goto(`?space=demo${id === 'R40' ? '&ui-entry=account' : ''}#${route}`);
          await expect(page.locator('main h1').first()).toBeVisible();
          await expect(page.locator('main [data-ui-loading]')).toHaveCount(0, { timeout: 30_000 });
          await expect(page.getByText('이 화면을 열지 못했습니다', { exact: true })).toHaveCount(0);
          await page.evaluate(() => document.fonts.ready);
          if (id === 'R01') {
            await reachDocumentTarget(page, page.locator('.memo-paper-preview').first());
            await page
              .getByRole('link', { name: '통계와 그래프 보기', exact: true })
              .scrollIntoViewIfNeeded();
          }
          const normal = await metrics(page);
          const axe = axeRepresentatives.has(id)
            ? await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
                .analyze()
            : undefined;
          await capture(page, info, `${id}-${place}`);
          const largeText = await page.addStyleTag({
            content: 'html { font-size: 125% !important; }',
          });
          const enlarged = await metrics(page);
          await largeText.evaluate((node) => node.parentNode?.removeChild(node));
          findings.push({
            id,
            route,
            name: surface.name,
            normal,
            enlarged,
            violations: axe?.violations,
            incomplete: axe?.incomplete,
          });
          expect
            .soft(normal.pageWidth, `${id} normal reflow`)
            .toBeLessThanOrEqual(normal.width + 1);
          expect
            .soft(enlarged.pageWidth, `${id} enlarged reflow`)
            .toBeLessThanOrEqual(enlarged.width + 1);
          expect.soft(normal.oversizedControls, `${id} control width`).toEqual([]);
          expect.soft(normal.smallInputs, `${id} legible touch input`).toEqual([]);
          if (axe)
            expect
              .soft(axe.violations, `${id} accessible names, contrast and structure`)
              .toEqual([]);
          // Visiting, inspecting and changing text size do not create study evidence.
          const stored = await page.evaluate((key) => localStorage.getItem(key), storageKey);
          if (!stored) throw Error('The isolated study ledger was lost.');
          expectOriginalData(
            JSON.parse(decodeStoredText(stored)).data,
            JSON.parse(decodeStoredText(raw)).data,
            id,
          );
        });
      }
      expect(errors).toEqual([]);
    } finally {
      await info.attach(`os-ui-${place}`, {
        body: JSON.stringify({ place, ids, findings, errors }, null, 2),
        contentType: 'application/json',
      });
    }
  });
}

test('OS UI settings and common dialogs retain font, brightness, direction, draft and records', async ({
  page,
}, info) => {
  const raw = await seed(page);
  await page.goto('?space=demo#/record');
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  const memo = page.getByRole('textbox', { name: '메모', exact: true });
  await memo.fill(original);
  const before = await metrics(page);
  const tools = page.locator('.sidebar-bottom:visible, .compact-menu:visible').first();
  await tools.locator('summary').first().click();
  await tools.getByRole('combobox', { name: '화면 밝기', exact: true }).selectOption('dark');
  await tools.getByRole('combobox', { name: '본문 읽기 폭', exact: true }).selectOption('wide');
  await tools.locator('summary').first().click();
  await page.getByRole('link', { name: '위쪽 천장 조명', exact: true }).click();
  await expect(page.locator('[data-place-scene]')).toHaveAttribute('data-place-scene', 'ceiling');
  await page.getByRole('link', { name: '원래 자리로', exact: true }).click();
  await expect(page).toHaveURL(/#\/record$/);
  await page.reload();
  await expect(memo).toHaveValue(original);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.app-shell')).toHaveAttribute('data-reading-width', 'wide');
  await expect(page.locator('.app-shell')).toHaveAttribute('data-observatory-place', 'front');
  const after = await metrics(page);
  expect(after.bodyFont).toBe(before.bodyFont);
  expect(after.readingFont).toBe(before.readingFont);
  expect(after.pageWidth).toBeLessThanOrEqual(after.width + 1);

  const open = page.getByRole('button', { name: '학기 추가', exact: true });
  if (!(await open.isVisible())) await tools.locator('summary').first().click();
  await open.click();
  const dialog = page.getByRole('dialog', { name: '학기 추가', exact: true });
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole('textbox', { name: '이름', exact: true })
    .fill('저장하지 않는 긴 한국어 학기 이름 · 조건과 예외');
  const accessibility = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect.soft(accessibility.violations).toEqual([]);
  await page.screenshot({ path: info.outputPath('dark-dialog.png'), animations: 'disabled' });
  await dialog.getByRole('button', { name: '학기 추가 닫기', exact: true }).click();
  await expect(open).toBeFocused();
  await expect(memo).toHaveValue(original);
  const stored = await page.evaluate((key) => localStorage.getItem(key), storageKey);
  if (!stored) throw Error('The isolated study ledger was lost.');
  expect(JSON.parse(decodeStoredText(stored)).data).toEqual(JSON.parse(decodeStoredText(raw)).data);
  await info.attach('os-ui-preservation', {
    body: JSON.stringify(
      {
        before,
        after,
        violations: accessibility.violations,
        routeEntities: sourceInventory.routes.length,
        overlayEntities: sourceInventory.overlays.length,
        auxiliaryEntities: sourceInventory.surfaces.length,
        identityRoles: contract.identities.length,
        boundary:
          'All route surfaces are inventoried; common modal/settings behavior is sampled. Source inventory and existing specialized suites retain other state coverage.',
      },
      null,
      2,
    ),
    contentType: 'application/json',
  });
});

test('OS UI long tabs keep the entire keyboard selection and focus visible', async ({
  page,
}, info) => {
  const raw = await seed(page);
  await page.goto('?space=demo#/subjects');
  const tools = page.locator('.sidebar-bottom:visible, .compact-menu:visible').first();
  await tools.locator('summary').first().click();
  const open = tools.getByRole('button', { name: '움직임 위젯', exact: true });
  await open.click();
  const dialog = page.getByRole('dialog', { name: '움직임 위젯', exact: true });
  const tabs = dialog.getByRole('tablist', { name: '위젯 선택', exact: true });
  const first = tabs.getByRole('tab').first();
  await first.focus();
  for (const key of ['End', 'Home', 'ArrowRight', 'ArrowRight']) {
    await page.keyboard.press(key);
    const selected = tabs.locator('[aria-selected="true"]');
    await expect(selected).toBeFocused();
    await expect
      .poll(() =>
        selected.evaluate((node) => {
          const parent = node.closest('[role="tablist"]');
          if (!parent) return false;
          const rect = node.getBoundingClientRect(),
            clip = parent.getBoundingClientRect();
          return (
            rect.left >= clip.left - 1 &&
            rect.right <= clip.right + 1 &&
            rect.top >= -1 &&
            rect.bottom <= innerHeight + 1
          );
        }),
      )
      .toBe(true);
  }
  await expect(tabs.getByRole('tab', { name: '인터랙티브 카드', exact: true })).toBeFocused();
  await page.screenshot({ path: info.outputPath('keyboard-long-tab.png'), animations: 'disabled' });
  await dialog.getByRole('button', { name: '움직임 위젯 닫기', exact: true }).click();
  await expect(open).toBeFocused();
  expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBe(raw);
});

test('OS UI home memo and statistics remain independently clickable after actual scrolling', async ({
  page,
}, info) => {
  const raw = await seed(page);
  await page.goto('?space=demo#/');
  await expect(page.locator('main h1').first()).toBeVisible();
  await expect(page.locator('main [data-ui-loading]')).toHaveCount(0);
  const memo = page.locator('.memo-paper-preview').first();
  await reachDocumentTarget(page, memo);
  await info.attach('memo-scroll-geometry', {
    body: JSON.stringify(
      await memo.evaluate((node) => {
        const ancestors = [];
        for (let parent: Element | null = node; parent; parent = parent.parentElement) {
          const rect = parent.getBoundingClientRect(),
            css = getComputedStyle(parent);
          ancestors.push({
            tag: parent.tagName,
            className: parent.getAttribute('class'),
            top: rect.top,
            bottom: rect.bottom,
            height: rect.height,
            scrollTop: parent.scrollTop,
            contentVisibility: css.contentVisibility,
            containIntrinsicSize: css.containIntrinsicSize,
            overflow: css.overflow,
          });
        }
        return { scrollY, height: innerHeight, ancestors };
      }),
      null,
      2,
    ),
    contentType: 'application/json',
  });
  await expect(memo).toBeInViewport();
  const statistics = page.getByRole('link', { name: '통계와 그래프 보기', exact: true });
  await statistics.scrollIntoViewIfNeeded();
  await expect(statistics).toBeInViewport();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  const geometry = await statistics.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const hits = [0.2, 0.5, 0.8].map((fraction) => {
      const hit = document.elementFromPoint(
        rect.left + rect.width * fraction,
        rect.top + rect.height / 2,
      );
      return hit === node || Boolean(hit && node.contains(hit));
    });
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height, hits };
  });
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  await info.attach('home-scrolled-targets', {
    body: JSON.stringify(
      { geometry, violations: accessibility.violations, incomplete: accessibility.incomplete },
      null,
      2,
    ),
    contentType: 'application/json',
  });
  await page.screenshot({
    path: info.outputPath('home-statistics-after-memo-render.png'),
    animations: 'disabled',
  });
  expect.soft(geometry.hits).toEqual([true, true, true]);
  expect.soft(accessibility.violations).toEqual([]);
  await statistics.click();
  await expect(page).toHaveURL(/#\/statistics$/);
  await page.goBack();
  await memo.click();
  await expect(page.getByRole('dialog', { name: '작은 메모', exact: true })).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: '닫기', exact: true }).click();
  const stored = await page.evaluate((key) => localStorage.getItem(key), storageKey);
  if (!stored) throw Error('The isolated study ledger was lost.');
  expectOriginalData(
    JSON.parse(decodeStoredText(stored)).data,
    JSON.parse(decodeStoredText(raw)).data,
    'home targets',
  );
});

test('OS UI current south and ceiling places stay exposed through repeated width changes without page jumps', async ({
  page,
}, info) => {
  const raw = await seed(page);
  await page.setViewportSize({ width: 1024, height: 420 });
  await page.goto('?space=demo#/statistics');
  await expect(page.locator('main h1').first()).toBeVisible();
  await expect(page.locator('main [data-ui-loading]')).toHaveCount(0);
  const navigation = page.getByRole('navigation', { name: '천문대 자리', exact: true });
  const samples: unknown[] = [];
  for (const place of ['back', 'ceiling']) {
    if (place === 'ceiling')
      await navigation.getByRole('link', { name: '위쪽 천장 조명', exact: true }).click();
    // Cancel pending route restoration without starting WebKit's native key
    // scroll animation, whose remaining frames would alter the resize sample.
    await page.keyboard.press('Shift');
    const current = navigation.locator('[aria-current="location"]');
    await expect(current).toContainText(place === 'back' ? '기록·계획 벽' : '천장 조명');
    await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
    for (const width of [1024, 390, 1024, 390]) {
      await page.setViewportSize({ width, height: 420 });
      await expect
        .poll(() =>
          current.evaluate((node) => {
            const rect = node.getBoundingClientRect(),
              parent = node.parentElement?.getBoundingClientRect();
            return Boolean(
              parent && rect.left >= parent.left - 1 && rect.right <= parent.right + 1,
            );
          }),
        )
        .toBe(true);
      const sample = await page.evaluate(() => ({
        width: innerWidth,
        scroll: scrollY,
        overflow: document.documentElement.scrollWidth - innerWidth,
      }));
      samples.push({ place, ...sample });
      expect(sample.scroll).toBe(0);
      expect(sample.overflow).toBeLessThanOrEqual(1);
    }
  }
  expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBe(raw);
  await info.attach('current-place-resize', {
    body: JSON.stringify(samples, null, 2),
    contentType: 'application/json',
  });
});
