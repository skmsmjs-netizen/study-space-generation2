import { readFileSync, existsSync } from 'node:fs';
import { test, expect } from '@playwright/test';
// All primary screens of the current version are discovered, including future additions.
const source = readFileSync('src/App.tsx', 'utf8');
const start = source.indexOf('const navItems =');
const primaryRoutes = [
  ...source.slice(start, source.indexOf('];', start)).matchAll(/href:\s*["']([^"']+)["']/g),
].map((match) => match[1]);
const routes = [
  ...primaryRoutes,
  '/draft-archives',
  '/trash',
  '/free',
  '/about',
  '/help',
  '/my-progress',
  '/subscription',
  '/subject/demo-subject-math',
  '/node/demo-topic-function',
  '/record/demo-topic-function',
];
test('all current screens render, reflow and keep navigation usable', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const inventory: unknown[] = [];
  await page.goto('?space=demo');
  const navRoutes = await page
    .locator('nav a[href^="#"]')
    .evaluateAll((links) => links.map((a) => a.getAttribute('href')!.slice(1)));
  expect(navRoutes.filter((route) => !routes.includes(route))).toEqual([]);
  for (const route of routes) {
    await page.goto(`?space=demo#${route}`);
    await expect(page.locator('main h1').first()).toBeVisible();
    await expect(page.getByText('화면을 열지 못했습니다.', { exact: true })).toHaveCount(0);
    await expect(page.locator('main [data-ui-loading]')).toHaveCount(0, {
      timeout: 30000,
    });
    const metrics = await page.evaluate(() => ({
      route: location.hash,
      width: innerWidth,
      height: innerHeight,
      pageWidth: document.documentElement.scrollWidth,
      title: document.querySelector('main h1')?.textContent,
      controls: [
        ...document.querySelectorAll<HTMLElement>(
          'main button, main input, main select, main textarea',
        ),
      ]
        .filter((el) => el.getClientRects().length && !el.closest('.monaco-editor'))
        .filter((el) => {
          const box = el.getBoundingClientRect();
          return box.width > innerWidth + 1;
        })
        .map((el) => el.getAttribute('aria-label') || el.textContent),
    }));
    inventory.push(metrics);
    expect.soft(metrics.pageWidth, route).toBeLessThanOrEqual(metrics.width + 1);
    expect.soft(metrics.controls, route).toEqual([]);
    if (['/materials', '/code', '/math', '/canvas', '/graph', '/board'].includes(route))
      await page.screenshot({ path: info.outputPath(`${route.slice(1)}.png`) });
  }
  await info.attach('screen-inventory', {
    body: JSON.stringify(inventory, null, 2),
    contentType: 'application/json',
  });
  expect(errors).toEqual([]);
});

test('graph filters remain usable with larger text without horizontal overflow', async ({ page }) => {
  await page.goto('?space=demo#/graph');
  const connections = page.getByLabel('표시할 연결', { exact: true });
  await expect(connections).toBeVisible();
  await page.addStyleTag({ content: 'html { font-size: 125%; }' });
  await connections.selectOption('personal');
  await expect(connections).toHaveValue('personal');
  await connections.selectOption('all');
  await expect(connections).toHaveValue('all');
  await expect(page.getByLabel('그래프 과목', { exact: true })).toBeVisible();
  console.log('GRAPH_REFLOW', JSON.stringify(await page.evaluate(() => ({
    viewport: innerWidth, pageWidth: document.documentElement.scrollWidth,
    overflowing: [...document.querySelectorAll<HTMLElement>('body *')]
      .filter(el => !el.closest('.react-flow') && (el.scrollWidth > el.clientWidth + 1 || el.getBoundingClientRect().right > innerWidth + 1))
      .map(el => { const box = el.getBoundingClientRect(), css = getComputedStyle(el); return {
        tag: el.tagName, className: el.className, text: el.textContent?.slice(0, 60),
        left: box.left, right: box.right, width: box.width, client: el.clientWidth, scroll: el.scrollWidth,
        display: css.display, grid: css.gridTemplateColumns, minWidth: css.minWidth, overflow: css.overflow,
      }; }).slice(0, 35),
  }))));
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => innerWidth + 1),
  );
});

test('touch code input, exact draft restore and rotation retain original source', async ({
  page,
}, info) => {
  await page.goto('?space=demo#/code');
  await page.getByRole('button', { name: '예제 추가', exact: true }).tap();
  const code = page.getByRole('textbox', { name: '소스 코드', exact: true });
  await expect(code).toHaveClass('cm-content');
  await page.getByLabel('언어', { exact: true }).selectOption('javascript');
  const source = '// 조건과 예외 · 한글 원문\nconst 합 = 3 + 4;\nconsole.log(합);';
  await code.fill(source);
  await page.getByLabel('예제 제목', { exact: true }).fill('터치 입력·복귀 검증');
  const initial = info.project.use.viewport!;
  await page.setViewportSize({ width: initial.height, height: initial.width });
  await expect
    .poll(() =>
      code.evaluate((el) =>
        el instanceof HTMLTextAreaElement ? el.value : (el as HTMLElement).innerText,
      ),
    )
    .toBe(source);
  await page.setViewportSize(initial);
  await page.reload();
  await expect
    .poll(() =>
      code.evaluate((el) =>
        el instanceof HTMLTextAreaElement ? el.value : (el as HTMLElement).innerText,
      ),
    )
    .toBe(source);
  await expect(page.getByLabel('예제 제목', { exact: true })).toHaveValue('터치 입력·복귀 검증');
  await page.getByRole('button', { name: '실행', exact: true }).tap();
  await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText('7');
  await expect
    .poll(() =>
      code.evaluate((el) =>
        el instanceof HTMLTextAreaElement ? el.value : (el as HTMLElement).innerText,
      ),
    )
    .toBe(source);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
});

test('unsupported notifications explain the device path without requesting permission', async ({
  page,
}) => {
  test.skip(
    !existsSync('src/ui/schedule-notifications.tsx'),
    '이 버전에는 일정 알림 화면이 없습니다.',
  );
  await page.addInitScript(() => {
    Object.defineProperty(window, 'PushManager', {
      value: undefined,
      configurable: true,
    });
    delete (window as unknown as Record<string, unknown>).PushManager;
  });
  await page.goto('?space=demo#/schedules');
  await page.getByText(/오늘 확인할 일정 · 알림/).tap();
  await expect(page.getByRole('button', { name: '일정 알림 켜기', exact: true })).toBeDisabled();
  await expect(page.getByText(/Safari의 공유 메뉴에서 홈 화면에 추가/)).toBeVisible();
});

test('missing microphone API retains a usable file import and notes path', async ({ page }) => {
  test.skip(!primaryRoutes.includes('/materials'), '이 버전에는 강의 자료 화면이 없습니다.');
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: undefined,
      configurable: true,
    });
  });
  await page.goto('?space=demo#/materials');
  await page.getByRole('button', { name: '자료 추가', exact: true }).tap();
  await expect(page.getByRole('button', { name: '녹음 시작', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: '녹음 파일 가져오기', exact: true })).toBeEnabled();
  await expect(page.getByText(/기기의 녹음 앱에서 녹음한 뒤/)).toBeVisible();
});
