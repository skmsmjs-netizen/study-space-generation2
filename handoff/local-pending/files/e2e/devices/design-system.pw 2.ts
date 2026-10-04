import { writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { screenRoutes } from './screen-inventory';

for (const theme of ['light', 'dark'] as const) {
  for (const route of screenRoutes) {
    test(`screen ${route} · ${theme} foundations, readable inputs and reflow at larger text`, async ({
      page,
    }, info) => {
      test.setTimeout(60_000);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      const findings: unknown[] = [];
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      {
        await page.goto(`?space=demo#${route}`);
        await expect(page.locator('main h1').first()).toBeVisible();
        await expect(page.locator('main [data-ui-loading]')).toHaveCount(0, { timeout: 30_000 });
        await page.evaluate(async () => {
          await Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 5_000)),
          ]);
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          );
        });
        await expect(page.getByText('이 화면을 열지 못했습니다', { exact: true })).toHaveCount(0);
        const initial = await page.evaluate(() => ({
          fontsReady: [
            ...document.querySelectorAll<HTMLElement>(
              'main h1, main input, main textarea, main select',
            ),
          ]
            .filter((el) => el.getClientRects().length)
            .every((el) => {
              const style = getComputedStyle(el);
              return document.fonts.check(
                `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
                '가나다',
              );
            }),
          width: innerWidth,
          contentWidth: document.documentElement.scrollWidth,
          titleSize: getComputedStyle(document.querySelector('main h1')!).fontSize,
          background: getComputedStyle(document.body).backgroundColor,
          foreground: getComputedStyle(document.body).color,
          inputs: [
            ...document.querySelectorAll<HTMLElement>('main input, main textarea, main select'),
          ]
            .filter((el) => el.getClientRects().length && !el.closest('.monaco-editor, .cm-editor'))
            .filter(
              (el) =>
                !['checkbox', 'radio', 'range', 'file', 'hidden'].includes(
                  el.getAttribute('type') || '',
                ),
            )
            .map((el) => ({
              label: el.getAttribute('aria-label') || el.id,
              size: parseFloat(getComputedStyle(el).fontSize),
            })),
        }));
        expect.soft(initial.fontsReady, `${route}: visible text fonts ready`).toBe(true);
        expect
          .soft(initial.contentWidth, `${route}: default width`)
          .toBeLessThanOrEqual(initial.width + 1);
        expect
          .soft(
            initial.inputs.filter((input) => input.size < 16),
            `${route}: input text`,
          )
          .toEqual([]);
        const accessibility = await new AxeBuilder({ page })
          .include('main')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect.soft(accessibility.violations, `${route}: ${theme} accessibility`).toEqual([]);
        expect
          .soft(
            accessibility.incomplete.filter((item) => item.id !== 'color-contrast'),
            `${route}: unresolved ARIA or other rules`,
          )
          .toEqual([]);
        const contrastEvidence = [];
        for (const issue of accessibility.incomplete.filter(
          (item) => item.id === 'color-contrast',
        )) {
          for (const node of issue.nodes) {
            if (node.target.length !== 1 || typeof node.target[0] !== 'string') continue;
            const paint = await page
              .locator(node.target[0])
              .first()
              .evaluate((el) => {
                const style = getComputedStyle(el),
                  rect = el.getBoundingClientRect();
                const layers = [];
                for (let parent: Element | null = el; parent; parent = parent.parentElement) {
                  const computed = getComputedStyle(parent);
                  layers.push({
                    tag: parent.tagName,
                    class: parent.getAttribute('class'),
                    background: computed.backgroundColor,
                    image: computed.backgroundImage,
                    opacity: computed.opacity,
                  });
                }
                const svgBackground = el
                  .closest('.react-flow__edge-textwrapper')
                  ?.querySelector('rect');
                return {
                  text: el.textContent,
                  foreground:
                    el instanceof SVGElement && el.tagName.toLowerCase() === 'text'
                      ? style.fill
                      : style.color,
                  fontSize: style.fontSize,
                  fontWeight: style.fontWeight,
                  layers,
                  svgBackground: svgBackground ? getComputedStyle(svgBackground).fill : undefined,
                  bounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
                  paintStack: document
                    .elementsFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
                    .slice(0, 8)
                    .map((element) => ({
                      tag: element.tagName,
                      class: element.getAttribute('class'),
                      ownOrAncestor: element === el || element.contains(el) || el.contains(element),
                    })),
                };
              });
            contrastEvidence.push({
              target: node.target,
              checks: [...node.any, ...node.all, ...node.none],
              paint,
            });
          }
        }
        const largerText = await page.addStyleTag({ content: 'html { font-size: 125%; }' });
        const enlarged = await page.evaluate(() => ({
          width: innerWidth,
          contentWidth: document.documentElement.scrollWidth,
          oversizedControls: [
            ...document.querySelectorAll<HTMLElement>(
              'main button, main input, main textarea, main select',
            ),
          ]
            .filter(
              (el) =>
                el.getClientRects().length &&
                !el.closest('.monaco-editor, .cm-editor, .react-flow__viewport'),
            )
            .filter((el) => el.getBoundingClientRect().width > innerWidth + 1)
            .map((el) => el.getAttribute('aria-label') || el.textContent),
        }));
        expect
          .soft(enlarged.contentWidth, `${route}: enlarged width`)
          .toBeLessThanOrEqual(enlarged.width + 1);
        expect.soft(enlarged.oversizedControls, `${route}: enlarged controls`).toEqual([]);
        findings.push({
          route,
          theme,
          initial,
          enlarged,
          violations: accessibility.violations,
          incomplete: accessibility.incomplete,
          contrastEvidence,
        });
        await page.screenshot({
          path: info.outputPath(`${theme}-${route.replace(/[^a-z0-9]/gi, '_') || 'home'}.png`),
          fullPage: true,
        });
        // Hash navigation retains the document; restore only this test's text-size override.
        await largerText.evaluate((el) => el.parentNode?.removeChild(el));
      }
      const inventoryPath = info.outputPath('design-finding.json');
      await writeFile(inventoryPath, JSON.stringify(findings, null, 2));
      await info.attach('complete-design-screen-inventory', {
        path: inventoryPath,
        contentType: 'application/json',
      });
      expect(errors).toEqual([]);
    });
  }
}

test('code toolbar reuses common controls without losing the exact draft or focus', async ({
  page,
}) => {
  await page.goto('?space=demo#/code');
  await page.getByRole('button', { name: '예제 추가', exact: true }).tap();
  await page.getByLabel('언어', { exact: true }).selectOption('javascript');
  const code = page.getByRole('textbox', { name: '소스 코드', exact: true });
  const original = '  // 한국어 원문과 끝 공백\nconsole.log(7);  ';
  await code.fill(original);
  for (const name of ['들여쓰기', '내어쓰기', '주석', 'main 함수', '되돌리기', '다시 적용']) {
    const button = page.getByRole('button', { name, exact: true });
    await expect(button).toHaveClass(/ui-button/);
    const bounds = await button.boundingBox();
    expect(bounds!.height).toBeGreaterThanOrEqual(48);
  }
  await expect(page.getByRole('button', { name: 'main 함수', exact: true })).toBeDisabled();
  await page.getByRole('checkbox', { name: 'Tab으로 편집기 나가기', exact: true }).check();
  await code.focus();
  await code.press('Tab');
  await expect(code).not.toBeFocused();
  await page.reload();
  await expect
    .poll(() =>
      code.evaluate((el) =>
        el instanceof HTMLTextAreaElement ? el.value : (el as HTMLElement).innerText,
      ),
    )
    .toBe(original);
});

// DOM-only long content isolates native scrolling; the saved example journal stays exact.
test('Canvas content scrolls with keys without moving cards or changing saved originals', async ({
  page,
}) => {
  await page.goto('?space=demo#/canvas');
  const region = page.locator('.canvas-card-body').first();
  await expect(region).toBeVisible();
  await expect(region).toHaveAttribute('tabindex', '0');
  const original = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  await region.evaluate((el) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = '격리된 긴 내용의 키보드 스크롤 확인. '.repeat(400);
    paragraph.dataset.qualityFixture = 'synthetic';
    el.append(paragraph);
  });
  await expect
    .poll(() => region.evaluate((el) => el.scrollHeight - el.clientHeight))
    .toBeGreaterThan(0);
  await region.focus();
  const positions = await page
    .locator('.react-flow__node')
    .evaluateAll((nodes) =>
      nodes.map((node) => [node.getAttribute('data-id'), (node as HTMLElement).style.transform]),
    );
  await region.press('ArrowDown');
  await expect.poll(() => region.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  await region.press('End');
  await expect
    .poll(() => region.evaluate((el) => Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop)))
    .toBeLessThanOrEqual(1);
  await region.press('Home');
  await expect.poll(() => region.evaluate((el) => el.scrollTop)).toBe(0);
  await region.press('PageDown');
  await expect.poll(() => region.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  expect(
    await page
      .locator('.react-flow__node')
      .evaluateAll((nodes) =>
        nodes.map((node) => [node.getAttribute('data-id'), (node as HTMLElement).style.transform]),
      ),
  ).toEqual(positions);
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(original);
});
