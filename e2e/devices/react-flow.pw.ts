import { test, expect } from '@playwright/test';

test('Canvas tools, group moves, measured layout, reconnect, undo, export and reload preserve identity and original text', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('?space=demo#/canvas');
  const stage = page.locator('.canvas-stage');
  await expect(stage.locator('.react-flow__node').first()).toBeVisible();
  await page.getByRole('button', { name: '개념 연결', exact: true }).click();
  await page.getByLabel('시작 개념', { exact: true }).selectOption('node:demo-topic-function');
  await page.getByLabel('이어지는 개념', { exact: true }).selectOption('node:demo-topic-graph');
  await page.getByLabel('관계 설명', { exact: true }).fill('  조건 · 원문 < & >  ');
  await page.getByRole('button', { name: '연결하기', exact: true }).click();
  const relation = page.locator('.canvas-link-editor');
  await expect(relation).toBeVisible();
  const file = async () => {
    if (!(await page.getByRole('button', { name: '배치 JSON 내려받기', exact: true }).isVisible()))
      await page.getByRole('button', { name: '배치 내보내기·가져오기', exact: true }).click();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: '배치 JSON 내려받기', exact: true }).click(),
    ]);
    const stream = await download.createReadStream();
    if (!stream) throw Error('내려받은 배치 파일을 읽지 못했습니다.');
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    return JSON.parse(Buffer.concat(chunks).toString());
  };
  const original = await file(),
    id = original.content.links[0].id;
  expect(original.content.links[0].label).toBe('  조건 · 원문 < & >  ');
  await page
    .getByLabel('연결 도착 카드 변경', { exact: true })
    .selectOption('node:demo-topic-force');
  await page.getByRole('button', { name: '배치 되돌리기', exact: true }).click();
  expect((await file()).content.links[0]).toEqual(original.content.links[0]);
  await page.getByRole('button', { name: '배치 다시 실행', exact: true }).click();
  const reconnected = await file();
  expect(reconnected.content.links[0].id).toBe(id);
  expect(reconnected.content.links[0].target).toBe('node:demo-topic-force');
  await relation.getByLabel('연결선의 관계 설명', { exact: true }).fill('새 설명 · 이유와 예외');
  await relation.getByRole('button', { name: '관계 설명 저장', exact: true }).click();
  await page.getByRole('button', { name: '배치 되돌리기', exact: true }).click();
  expect((await file()).content.links[0].label).toBe(original.content.links[0].label);
  await page.getByRole('button', { name: '배치 다시 실행', exact: true }).click();
  await page.getByRole('button', { name: '모든 카드 선택', exact: true }).click();
  await page.getByRole('button', { name: '왼쪽 맞춤', exact: true }).click();
  expect(
    new Set(
      Object.values((await file()).content.positions).map((p: unknown) => (p as { x: number }).x),
    ).size,
  ).toBe(1);
  await page.getByRole('button', { name: '선택 해제', exact: true }).click();
  await page.getByRole('button', { name: '목차 배치', exact: true }).click();
  await page.getByLabel('조작할 카드', { exact: true }).selectOption('node:demo-topic-function');
  await page.getByLabel('선택한 카드 너비', { exact: true }).fill('420');
  await stage.scrollIntoViewIfNeeded();
  await stage.getByRole('button', { name: /^Canvas 보기 도구/ }).click();
  await stage.getByLabel('전체 위치 지도', { exact: true }).selectOption('show');
  await stage.getByLabel('연결선 모양', { exact: true }).selectOption('bezier');
  await stage.getByLabel('격자에 맞춰 옮기기', { exact: true }).check();
  await expect(stage.locator('.react-flow__minimap')).toBeVisible();
  await stage.getByRole('button', { name: '선택한 항목 보기', exact: true }).click();
  await stage.getByRole('button', { name: /^Canvas 보기 도구/ }).click();
  const saved = await file();
  await page.getByLabel('가져올 배치 JSON', { exact: true }).setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ ...saved, userId: 'other' })),
  });
  await expect(page.locator('.flow-transfer [role="alert"]')).toContainText('이 공부 공간');
  await page.getByLabel('가져올 배치 JSON', { exact: true }).setInputFiles({
    name: 'original.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(original)),
  });
  await page.getByRole('button', { name: '확인한 배치 적용', exact: true }).click();
  expect((await file()).content.links[0]).toEqual(original.content.links[0]);
  await page.getByRole('button', { name: '배치 되돌리기', exact: true }).click();
  expect((await file()).content.links).toEqual(saved.content.links);
  await stage.scrollIntoViewIfNeeded();
  await stage.getByRole('button', { name: /^Canvas 보기 도구/ }).click();
  await stage.getByLabel('확대 비율 (%)', { exact: true }).fill('63');
  await stage.getByRole('button', { name: '확대 비율 적용', exact: true }).click();
  await expect(stage.getByRole('button', { name: /^Canvas 보기 도구/ })).toContainText('63%');
  expect((await file()).content.viewport.zoom).toBeCloseTo(0.63, 3);
  await page.reload();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage.getByRole('button', { name: /^Canvas 보기 도구/ })).toContainText('63%');
  await expect(stage.locator('.react-flow__minimap')).toBeVisible();
  await page.getByLabel('조작할 카드', { exact: true }).selectOption('node:demo-topic-function');
  await expect(page.getByLabel('선택한 카드 너비', { exact: true })).toHaveValue('420');
  expect((await file()).content.links).toEqual(saved.content.links);
  await page.screenshot({ path: info.outputPath('react-flow-canvas.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  expect(errors).toEqual([]);
});

test('graph settings, curve endpoints and Korean controls remain usable after reopen', async ({
  page,
}) => {
  await page.goto('?space=demo#/graph');
  const stage = page.locator('.graph-stage');
  await expect(stage).toHaveAttribute('aria-busy', 'false');
  await stage.scrollIntoViewIfNeeded();
  await stage.getByRole('button', { name: /보기 도구/ }).click();
  await stage.getByLabel('연결선 모양', { exact: true }).selectOption('bezier');
  await stage.getByLabel('전체 위치 지도', { exact: true }).selectOption('show');
  await expect(stage.locator('.react-flow__minimap')).toBeVisible();
  await page.getByLabel('관계 배치', { exact: true }).selectOption('force');
  await expect(stage).toHaveAttribute('aria-busy', 'false');
  await page.reload();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute('aria-busy', 'false');
  await expect(page.getByLabel('관계 배치', { exact: true })).toHaveValue('force');
  await stage.getByRole('button', { name: /보기 도구/ }).click();
  await expect(stage.getByLabel('연결선 모양', { exact: true })).toHaveValue('bezier');
  await expect(stage.locator('.react-flow__minimap')).toBeVisible();
});
