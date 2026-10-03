import { expect, test } from '@playwright/test';
import { applyCommand } from '../../src/domain/commands';
import { createDemoState } from '../../src/domain/fixtures';
import { encodeStoredText } from '../../src/data/storage-codec';

test('material card grid keeps bounded pages, original source and selected answer after reload', async ({ page }, info) => {
  const original = '  원자료 · 조건·예외\n마지막 공백  ';
  let data = createDemoState();
  data = applyCommand(data, {
    type: 'saveStudyMaterial', opId: 'layout-material', id: 'layout-material', expectedVersion: 0,
    at: '2026-10-03T00:00:00Z', userId: data.userId,
    content: { title: '격리된 누적 카드 자료', subjectId: 'demo-subject-math', topicId: null, sourceText: original, audio: null,
      results: [{ id: 'layout-result', at: '2026-10-03T00:00:00Z', model: 'synthetic-fixture', summary: [],
        segments: [{ id: 'source', start: null, end: null, text: original }],
        cards: Array.from({ length: 45 }, (_, n) => ({ id: `card-${n}`, question: `질문 ${n} · 긴 한국어 조건과 예외`, answer: `원문 답 ${n}\n${original}`, sourceIds: ['source'], excluded: false })) }] }
  });
  const raw = encodeStoredText(JSON.stringify({ sequence: 1, data }));
  await page.addInitScript((raw) => { if (!localStorage.getItem('study-space:demo:v1')) localStorage.setItem('study-space:demo:v1', raw); }, raw);
  await page.goto('?space=demo#/material-cards');
  const grid = page.locator('.material-card-grid');
  await expect(grid.locator('article')).toHaveCount(20);
  await page.getByRole('button', { name: '다음 자료 카드', exact: true }).click();
  await page.getByRole('button', { name: '질문 21 · 긴 한국어 조건과 예외', exact: true }).click();
  const selected = grid.locator('article').filter({ hasText: '원문 답 21' });
  await selected.getByText('원문 확인', { exact: true }).click();
  await expect(selected.locator('details .prose')).toHaveText(original);
  await page.reload();
  await expect(grid.locator('article')).toHaveCount(20);
  await expect(grid).toContainText('원문 답 21');
  const geometry = await grid.locator('article').evaluateAll(nodes => nodes.slice(0,2).map(node => ({ left: node.getBoundingClientRect().left, top: node.getBoundingClientRect().top })));
  if (info.project.use.viewport!.width >= 1300) expect(geometry[1].left).toBeGreaterThan(geometry[0].left);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(raw);
  await page.screenshot({ path: info.outputPath('material-card-grid.png'), fullPage: true });
});
