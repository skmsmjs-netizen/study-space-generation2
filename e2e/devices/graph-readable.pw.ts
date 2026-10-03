import { test, expect, type Page } from '@playwright/test';
import fixture from './graph-readable.fixture.json' with { type: 'json' };
import { encodeStoredText } from '../../src/data/storage-codec';

const title = '조건·예외와 원문을 보존하는 긴 한글 주제 이름';
async function seed(page: Page, count: number) {
  const data = structuredClone(fixture.data);
  const example = data.nodes.find((n) => n.id === 'demo-topic-function');
  if (!example) throw Error('합성 예시 주제가 없습니다.');
  for (let i = 0; i < count; i++)
    data.nodes.push({ ...example, id: `readable-${i}`, order: i + 10, name: `${i}. ${title}` });
  const at = '2026-10-03T00:00:00.000Z';
  data.canvasLayouts = [
    {
      id: 'canvas:main',
      namespace: data.namespace,
      userId: data.userId,
      createdAt: at,
      updatedAt: at,
      version: 1,
      deletedAt: null,
      positions: { 'node:demo-topic-function': { x: 321, y: -123 } },
      links: [],
      viewport: { x: 31, y: -12, zoom: 0.63 },
    },
  ];
  const value = encodeStoredText(JSON.stringify({ sequence: 0, data }));
  await page.addInitScript((stored) => {
    if (!localStorage.getItem('study-space:demo:v1'))
      localStorage.setItem('study-space:demo:v1', stored);
  }, value);
  return value;
}
const zoom = (page: Page) =>
  page.locator('.graph-stage .react-flow__viewport').evaluate((el) => {
    const matrix = new DOMMatrix(getComputedStyle(el).transform);
    return matrix.a;
  });

for (const count of [0, 120, 300])
  test(`graph ${count + 11} items: readable initial view, overview, selection, neighbourhood and original return preserve data`, async ({
    page,
  }, info) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const original = await seed(page, count);
    const started = Date.now();
    await page.goto('?space=demo#/graph');
    const stage = page.locator('.graph-stage');
    // Reveal the off-screen graph before waiting for its measured layout/camera.
    // Linux WebKit under the full CI workload exceeded the default 5s readiness wait.
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveAttribute('aria-busy', 'false', { timeout: 30_000 });
    await info.attach('graph-initial-ready', {
      body: JSON.stringify({ items: count + 11, elapsedMs: Date.now() - started }),
      contentType: 'application/json',
    });
    await expect(stage.locator('.react-flow__node')).toHaveCount(count + 11);
    await page.screenshot({ path: info.outputPath('graph-readable.png'), fullPage: true });
    // User chose a readable initial area; the explicit overview fits all nodes.
    await expect.poll(() => zoom(page)).toBeGreaterThanOrEqual(0.6);
    const spread = await stage.locator('.graph-point').evaluateAll((points) => {
      const boxes = points.map((node) => node.getBoundingClientRect());
      return {
        x: Math.max(...boxes.map((b) => b.x)) - Math.min(...boxes.map((b) => b.x)),
        y: Math.max(...boxes.map((b) => b.y)) - Math.min(...boxes.map((b) => b.y)),
      };
    });
    expect(spread.x).toBeGreaterThan(50);
    expect(spread.y).toBeGreaterThan(50);
    expect(spread.x / spread.y).toBeGreaterThan(0.65);
    expect(spread.x / spread.y).toBeLessThan(1.5);
    // Exercise an actual point hit, excluding the overlay controls and fixed navigation.
    const point = await stage.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const overlays = [...element.querySelectorAll('.react-flow__panel')].map((el) =>
        el.getBoundingClientRect(),
      );
      const nav = document.querySelector('.bottom-nav')?.getBoundingClientRect();
      const bottom = nav && nav.height > 0 ? nav.top : innerHeight;
      for (const node of element.querySelectorAll<HTMLElement>('.react-flow__node')) {
        const element = node.querySelector('.graph-point');
        if (!element) continue;
        const box = element.getBoundingClientRect();
        const x = box.x + box.width / 2,
          y = box.y + box.height / 2;
        if (
          x > bounds.left + 24 &&
          x < bounds.right - 24 &&
          y > Math.max(bounds.top + 24, 24) &&
          y < Math.min(bounds.bottom - 24, bottom - 24) &&
          !overlays.some(
            (b) => x > b.left - 22 && x < b.right + 22 && y > b.top - 22 && y < b.bottom + 22,
          )
        )
          return { name: node.getAttribute('aria-label') ?? '', x, y };
      }
      return null;
    });
    expect(point).not.toBeNull();
    if (!point) throw Error('다른 도구가 가리지 않는 점이 없습니다.');
    await page.mouse.click(point.x, point.y);
    await expect(page.locator('.graph-detail h2')).toHaveText(point.name);
    await page
      .locator('.study-graph > .graph-actions')
      .getByRole('button', { name: '전체 보기', exact: true })
      .click();
    await expect(stage).toHaveAttribute('aria-busy', 'false');
    await stage.scrollIntoViewIfNeeded();
    const inside = await stage.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return [...element.querySelectorAll('.graph-point')].every((node) => {
        const box = node.getBoundingClientRect();
        return (
          box.left >= bounds.left - 1 &&
          box.right <= bounds.right + 1 &&
          box.top >= bounds.top - 1 &&
          box.bottom <= bounds.bottom + 1
        );
      });
    });
    expect(inside).toBe(true);
    await page.getByRole('button', { name: '읽기 크기로 보기', exact: true }).click();
    await expect.poll(() => zoom(page)).toBeGreaterThanOrEqual(0.6);
    await page.getByText('항목 목록에서 선택하기', { exact: true }).click();
    const name = count ? `${count - 1}. ${title}` : '함수는 어떤 관계일까?';
    await page
      .locator('.graph-list')
      .getByRole('button', { name: `주제 · ${name}`, exact: true })
      .click();
    await expect(page.locator('.graph-detail h2')).toHaveText(name);
    await stage.scrollIntoViewIfNeeded();
    const selected = stage.locator('.graph-dot.is-selected .graph-point');
    await expect(selected).toBeVisible();
    const [selectedBox, stageBox] = await Promise.all([
      selected.boundingBox(),
      stage.boundingBox(),
    ]);
    if (!selectedBox || !stageBox) throw Error('선택한 점과 화면 좌표가 없습니다.');
    expect(
      Math.abs(selectedBox.x + selectedBox.width / 2 - stageBox.x - stageBox.width / 2),
    ).toBeLessThan(2);
    await page.getByRole('button', { name: '이 항목 주변 보기', exact: true }).click();
    await expect(stage).toHaveAttribute('aria-busy', 'false');
    await expect(stage.locator('.react-flow__node')).toHaveCount(2);
    // Same-tab selection, neighbourhood, camera and layout survive leaving the graph.
    await stage.scrollIntoViewIfNeeded();
    await stage.getByRole('button', { name: /^그래프 보기 도구/ }).click();
    await stage.getByLabel('확대 비율 (%)', { exact: true }).fill('83');
    await stage.getByRole('button', { name: '확대 비율 적용', exact: true }).click();
    await stage.getByRole('button', { name: /^그래프 보기 도구/ }).click();
    await expect.poll(() => zoom(page)).toBeCloseTo(0.83, 3);
    const camera = await stage.locator('.react-flow__viewport').getAttribute('style');
    const positions = await stage
      .locator('.react-flow__node')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('style')));
    await page.locator('.graph-detail').getByRole('link', { name: '원문 열기 ↗' }).click();
    await expect(page).toHaveURL(
      count ? new RegExp(`#/node/readable-${count - 1}$`) : /#\/node\/demo-topic-function$/,
    );
    await expect(page.getByRole('heading', { name, exact: true }).first()).toBeVisible();
    await page.goBack();
    await expect(stage).toHaveAttribute('aria-busy', 'false');
    await expect(page.locator('.graph-detail h2')).toHaveText(name);
    await expect(stage.locator('.react-flow__node')).toHaveCount(2);
    await expect.poll(() => zoom(page)).toBeCloseTo(0.83, 3);
    expect(await stage.locator('.react-flow__viewport').getAttribute('style')).toBe(camera);
    expect(
      await stage
        .locator('.react-flow__node')
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('style'))),
    ).toEqual(positions);
    await page.reload();
    await expect(stage).toHaveAttribute('aria-busy', 'false');
    await expect(page.locator('.graph-detail h2')).toHaveText(name);
    await expect.poll(() => zoom(page)).toBeCloseTo(0.83, 3);
    await page.getByRole('button', { name: '전체 관계로 돌아가기', exact: true }).click();
    await expect(stage).toHaveAttribute('aria-busy', 'false');
    await expect(stage.locator('.react-flow__node')).toHaveCount(count + 11);
    if (count) {
      await stage.scrollIntoViewIfNeeded();
      const map = await stage.locator('.react-flow__minimap').boundingBox();
      const frame = await stage.boundingBox();
      if (!map || !frame) throw Error('전체 지도와 화면 좌표가 없습니다.');
      expect(map.width).toBeLessThan(frame.width * 0.3);
      expect(map.height).toBeLessThan(frame.height * 0.25);
    }
    // Explicit hierarchy is still available and remains the user's choice after reload.
    await page.getByLabel('관계 배치', { exact: true }).selectOption('hierarchy');
    await expect(stage).toHaveAttribute('aria-busy', 'false');
    await expect.poll(() => zoom(page)).toBeGreaterThanOrEqual(0.6);
    await page.reload();
    await expect(stage).toHaveAttribute('aria-busy', 'false');
    await expect(page.getByLabel('관계 배치', { exact: true })).toHaveValue('hierarchy');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(original);
    expect(errors).toEqual([]);
  });
