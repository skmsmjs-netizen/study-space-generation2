import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const story = (id: string, theme = 'light') =>
  `/iframe.html?id=${encodeURIComponent(id)}&viewMode=story&globals=theme:${theme}`;
const prefix = 'study-common-ui';

test('한국어 예시 입력과 제출을 실제 브라우저에서 확인한다', async ({ page }) => {
  await page.goto(story(`${prefix}--local-input-flow`));
  const input = page.getByRole('textbox', { name: '예시 주제', exact: true });
  await expect(input).toBeVisible();
  await expect(page.getByRole('button', { name: '예시 반영' })).toBeDisabled();
  await input.fill('벡터의 방향 · 조건과 예외');
  await input.press('Enter');
  await expect(page.getByRole('status')).toHaveText('화면에 반영됨: 벡터의 방향 · 조건과 예외');
});

test('대화상자에서 Escape를 누르면 닫히고 원래 버튼으로 초점이 돌아온다', async ({ page }) => {
  await page.goto(story(`${prefix}--dialog`));
  const trigger = page.getByRole('button', { name: '대화상자 열기', exact: true });
  await trigger.press('Enter');
  await expect(page.getByRole('dialog', { name: '선택 메모', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: '예시 메모' }).fill('실제 자료에 저장하지 않는 예시');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('방향키로 탭과 연결된 패널을 이동한다', async ({ page }) => {
  await page.goto(story(`${prefix}--navigation`));
  await page.getByRole('tab', { name: '기록', exact: true }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: '메모', exact: true })).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: '메모', exact: true })).toBeVisible();
});

for (const theme of ['light', 'dark']) {
  test(`입력 부품의 ${theme} 테마를 axe로 확인한다`, async ({ page }) => {
    await page.goto(story(`${prefix}--field-states`, theme));
    await expect(page.getByRole('textbox', { name: '주제 이름', exact: true })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const result = await new AxeBuilder({ page })
      .include('main')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}

test('320px에서 긴 한국어 버튼이 가로로 넘치지 않는다', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto(story(`${prefix}--long-label`));
  await expect(
    page.getByRole('button', {
      name: '선택한 주제의 원래 기록으로 돌아가 이유와 예외를 함께 확인하기',
    }),
  ).toBeVisible();
  const width = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(width.content).toBeLessThanOrEqual(width.viewport);
});

// Each registered story owns a fresh Playwright context. This limits retained
// editor/worker state and gives every failure a specific story and theme.
const builtIndex = JSON.parse(readFileSync('storybook-static/index.json', 'utf8')) as {
  entries: Record<string, { id: string; type: string }>;
};
const registeredStories = Object.values(builtIndex.entries).filter(
  (entry) => entry.type === 'story',
);
for (const theme of ['light', 'dark']) {
  for (const entry of registeredStories) {
    test(`등록 부품 ${entry.id} · ${theme} · 좁은 화면`, async ({ page }, info) => {
      test.setTimeout(60_000);
      const liveIndex = (await (await page.request.get('/index.json')).json()) as typeof builtIndex;
      expect(
        Object.values(liveIndex.entries)
          .filter((item) => item.type === 'story')
          .map((item) => item.id)
          .sort(),
      ).toEqual(registeredStories.map((item) => item.id).sort());
      await page.setViewportSize({ width: 320, height: 780 });
      await page.goto(story(entry.id, theme));
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      if (entry.id.startsWith('study-source-editor'))
        await expect(page.locator('.monaco-editor')).toBeVisible();
      const result = await new AxeBuilder({ page })
        .include('main')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(result.violations, entry.id).toEqual([]);
      const width = await page.evaluate(() => ({
        content: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
      }));
      expect(width.content).toBeLessThanOrEqual(width.viewport + 1);
      await info.attach('complete-component-inventory', {
        body: JSON.stringify([
          {
            id: entry.id,
            theme,
            width,
            violations: result.violations,
            incomplete: result.incomplete.map((item) => item.id),
          },
        ]),
        contentType: 'application/json',
      });
    });
  }
}
