import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { decodeStoredText } from '../../src/data/storage-codec';

test('memory answers typeset math, retain raw text after reload and fit the available width', async ({
  page,
}, testInfo) => {
  const reference =
    '  옴의 법칙에서 전압과 전류의 관계입니다.\n\n' +
    String.raw`\[I=\frac{V}{R}\]` +
    '\n\n' +
    String.raw`\(V\)는 전압, \(R\)은 저항입니다.` +
    '\n온도와 저항이 일정할 때 성립합니다.\n\n' +
    String.raw`\[x=` +
    Array.from({ length: 25 }, (_, i) => `a_{${i}}`).join('+') +
    String.raw`\]` +
    '\n';
  const response = '  내 답안 원문\n줄바꿈과 공백을 유지합니다.\n';
  await page.goto('/?space=demo#/memory-test');
  await page.getByRole('button', { name: '암기 항목 등록', exact: true }).click();
  await page.getByLabel('항목을 연결할 주제', { exact: true }).selectOption('demo-topic-function');
  await page
    .getByLabel('질문·개념', { exact: true })
    .fill(String.raw`저항 \(R\)이 일정할 때 전압과 전류의 관계는 무엇인가요?`);
  await page.getByLabel('기준 답안·조건', { exact: true }).fill(reference);
  await page.getByRole('button', { name: '항목 저장', exact: true }).click();
  await page.getByRole('button', { name: '쪽지시험 시작', exact: true }).click();
  await expect(page.getByRole('region', { name: '1번 기준 답안', exact: true })).toHaveCount(0);
  await page.getByLabel('내 답안', { exact: true }).fill(response);
  await page.getByRole('button', { name: '시험 마치고 답안 비교', exact: true }).click();
  const review = page.locator('.memory-review-result');
  await expect(review.locator('math')).toHaveCount(5);
  await expect(review.locator('.katex-error')).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  expect(overflow).toBe(false);
  const formula = review.getByRole('region', { name: '수식 · 가로로 이동해 전체 보기' }).last();
  await formula.focus();
  await expect(formula).toBeFocused();
  const before = await formula.evaluate((e) => e.scrollLeft);
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => formula.evaluate((e) => e.scrollLeft)).toBeGreaterThan(before);
  const panels = await review
    .locator('.memory-comparison > section')
    .evaluateAll((rows) =>
      rows.map((e) => ({
        x: e.getBoundingClientRect().x,
        y: e.getBoundingClientRect().y,
        width: e.getBoundingClientRect().width,
      })),
    );
  if (testInfo.project.name.includes('iPad-Pro-13') && !testInfo.project.name.includes('half'))
    expect(Math.abs(panels[0].y - panels[1].y)).toBeLessThan(2);
  else if (testInfo.project.name.includes('portrait') || testInfo.project.name.includes('half'))
    expect(panels[1].y).toBeGreaterThan(panels[0].y);
  const audit = await new AxeBuilder({ page })
    .include('.memory-tests')
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.getByRole('button', { name: '시험 결과 저장', exact: true }).click();
  await page.reload();
  const saved = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  const data = JSON.parse(decodeStoredText(saved!)).data;
  expect(data.memoryTests[0].questions[0]).toMatchObject({
    answer: reference,
    response,
    verdict: null,
  });
  await expect(page.locator('.memory-review-result math')).toHaveCount(5);
  await page.screenshot({ path: testInfo.outputPath('memory-comparison.png'), fullPage: true });
});
