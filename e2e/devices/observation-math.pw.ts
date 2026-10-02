import { test, expect } from '@playwright/test';
import { defaultTemplate, type MathTemplate } from '../../src/domain/math-templates';

const draftKey = 'study-space:demo:math-templates:draft:v1';
const curve: MathTemplate = {
  ...defaultTemplate('function'),
  id: 'observation-function',
  title: '함수의 값과 시야 · 보존 확인',
  question: '관찰 위치를 바꾸면 함수값과 접선이 어떻게 달라질까요?',
  expressions: ['x^2'],
  ranges: { x: [-4, 4] },
  cursor: { x: 0.25 },
  parameters: [],
  notes: '  원문 메모\n조건과 예외는 그대로 유지  ',
  tex: ['f(x)=x^2'],
  conditions: ['실수 x, 관찰 범위와 함수의 정의역을 구별합니다.'],
  sections: [
    {
      id: 'slope',
      title: '현재 점과 접선',
      body: '현재 점은 (x, x²)이고 그 점에서의 접선 기울기는 2x입니다.',
      tex: "f'(x)=2x",
    },
  ],
  source: {
    title: '격리된 수학 관찰 검증 자료',
    reference: '함수와 접선',
    pages: '합성 자료 · 실제 교재 페이지 아님',
  },
};
const statement: MathTemplate = {
  ...defaultTemplate('formula'),
  id: 'observation-statement',
  title: '제곱의 비음수성',
  question: '실수의 제곱은 왜 음수가 될 수 없을까요?',
  tex: ['x\\in\\mathbb{R}\\implies x^2\\ge0'],
  conditions: ['대상은 실수입니다. 복소수 전체의 크기 순서를 뜻하지 않습니다.'],
  sections: [
    {
      id: 'cases',
      title: '부호로 나누어 보기',
      body: '양수와 양수, 음수와 음수의 곱은 양수이고, 0의 제곱은 0입니다.',
    },
  ],
  notes: '원래 정의와 설명 보존',
};

test('observation math keeps the question, conditions and reasoning in full view and preserves exact input across view changes', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(
    ({ key, entries }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify({ version: 1, active: entries[0].id, entries }));
    },
    { key: draftKey, entries: [curve, statement] },
  );
  await page.goto('?space=demo#/math');
  await page.getByLabel('탐색할 내용', { exact: true }).selectOption('templates');
  const dialog = page.getByRole('dialog');
  const zoom = dialog.getByRole('button', { name: '＋ 확대', exact: true });
  await expect(zoom).toBeEnabled({ timeout: 45000 });
  const question = dialog.locator('[data-observation-region="question"]');
  await expect(question).toContainText(curve.question!);
  await expect(question).toContainText(curve.conditions![0]);
  await expect(question.locator('.katex').first()).toBeVisible();
  await expect(dialog.locator('[data-observation-region="reasoning"]')).toContainText(
    curve.sections![0].body,
  );
  await expect(dialog.locator('[data-observation-region="reference"]')).toContainText(
    curve.source!.pages!,
  );
  const visual = dialog.locator('[data-observation-region="visual"]');
  const controls = dialog.locator('[data-observation-region="controls"]');
  const visualBox = (await visual.boundingBox())!,
    controlsBox = (await controls.boundingBox())!;
  if (page.viewportSize()!.width >= 1200)
    expect(controlsBox.x).toBeGreaterThan(visualBox.x + visualBox.width - 1);
  if (page.viewportSize()!.width <= 600)
    expect(controlsBox.y).toBeGreaterThanOrEqual(visualBox.y + visualBox.height - 1);
  const beforeLedger = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  const readEntry = () =>
    page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).entries[0], draftKey);
  const position = dialog.getByRole('textbox', { name: 'x 위치 값', exact: true });
  await position.fill('sqrt(2)');
  await position.press('Enter');
  await expect.poll(async () => (await readEntry()).cursor.x).toBeCloseTo(Math.SQRT2, 13);
  await zoom.tap();
  await dialog.getByRole('button', { name: '보기 초기화', exact: true }).tap();
  expect((await readEntry()).cursor.x).toBeCloseTo(Math.SQRT2, 13);
  expect((await readEntry()).notes).toBe(curve.notes);
  expect((await readEntry()).expressions).toEqual(curve.expressions);
  await position.fill('sqrt(');
  await position.press('Tab');
  await dialog.getByRole('button', { name: /전체 화면 닫기$/ }).click();
  const normal = page.locator('.math-templates');
  await expect(normal.getByRole('textbox', { name: 'x 위치 값', exact: true })).toHaveValue(
    'sqrt(',
  );
  await expect(normal.locator('[data-observation-region="question"]')).toContainText(
    curve.question!,
  );
  await normal.getByRole('button', { name: '전체 화면으로 살펴보기', exact: true }).click();
  await expect(position).toHaveValue('sqrt(');
  await position.fill('sqrt(2)');
  await position.press('Enter');
  await page.reload();
  await expect(zoom).toBeEnabled({ timeout: 45000 });
  expect((await readEntry()).cursor.x).toBeCloseTo(Math.SQRT2, 13);
  await expect(question).toContainText(curve.question!);
  await expect(dialog.locator('[data-observation-region="reference"]')).toContainText(
    curve.source!.title,
  );
  await question.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('math-observation-frame.png') });
  expect(await dialog.evaluate((e) => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
  await dialog.getByLabel('전체 화면의 내용', { exact: true }).selectOption(statement.id);
  await expect(dialog).toHaveCount(0);
  await expect(normal.locator('[data-observation-region="question"]')).toContainText(
    statement.question!,
  );
  await expect(normal.locator('[data-observation-region="reasoning"]')).toContainText(
    statement.sections![0].body,
  );
  await expect(normal.getByRole('button', { name: '＋ 확대', exact: true })).toHaveCount(0);
  await normal.getByLabel('넣어 둔 내용', { exact: true }).selectOption(curve.id);
  await expect(zoom).toBeEnabled({ timeout: 45000 });
  expect((await readEntry()).notes).toBe(curve.notes);
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(beforeLedger);
  expect(errors).toEqual([]);
});
