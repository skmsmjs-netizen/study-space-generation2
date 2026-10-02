import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const asset = existsSync('src/data/concept-reading-pack.published.json')
  ? 'src/data/concept-reading-pack.published.json' : 'src/data/concept-reading-pack.json';
const book = existsSync(asset) ? JSON.parse(readFileSync(asset, 'utf8')) : null;
test.skip(!book, 'The reading distribution is unavailable in this checkout.');

test('the full local book opens directly and seven reading types retain scenes, typography and return context', async ({ page }, info) => {
  const failures: string[] = [];
  page.on('pageerror', error => failures.push(error.message));
  await page.goto('?space=demo#/concepts');
  await expect(page.getByText('1,168개 · 검토를 마친 설명', { exact: true })).toBeVisible();
  const originals = JSON.parse(book.catalog.raw).items;
  const types = ['정의형', '구별형', '원리형', '구조형', '절차형', '과정형', '관점형'];
  const results = [];
  for (const type of types) {
    const edition = book.editions.find((e: any) => e.displayType === type && e.screen.scenes.length > 1)
      ?? book.editions.find((e: any) => e.displayType === type);
    const name = originals.find((i: any) => i.id === edition.sourceId).name;
    await page.getByRole('textbox', { name: '개념 찾기', exact: true }).fill(name);
    await page.getByRole('button', { name, exact: true }).click();
    const reader = page.locator('.concept-reader');
    await expect(reader).toHaveAttribute('data-reading-type', type);
    await page.evaluate(() => document.fonts.ready);
    const before = await reader.boundingBox();
    for (let index = 0; index < edition.screen.scenes.length; index++) {
      if (index && edition.screen.navigation === 'choose')
        await reader.getByRole('group', { name: '사례 선택' }).getByRole('button').nth(index).click();
      else if (index) await reader.getByRole('button', { name: '다음', exact: true }).click();
      const stage = reader.locator('.concept-stage.is-current');
      const title = edition.screen.scenes[index].title;
      const heading = stage.getByRole('heading', { level: 3 });
      await expect(heading).toBeVisible();
      // Exclude KaTeX's screen-reader branch when comparing the visual prose.
      const visibleTitle = await heading.evaluate(element => {
        const copy = element.cloneNode(true) as HTMLElement;
        copy.querySelectorAll('.katex-mathml').forEach(math => math.remove());
        return copy.textContent ?? '';
      });
      // Compare prose and TeX separately: KaTeX replaces dollar delimiters with rendered math.
      for (const part of title.split(/(\$[^$]+\$)/g).filter(Boolean)) {
        if (part.startsWith('$') && part.endsWith('$'))
          await expect(heading.locator('annotation').filter({ hasText: part.slice(1, -1) })).toHaveCount(1);
        else expect(visibleTitle).toContain(part);
      }
      const after = await reader.boundingBox();
      expect(Math.abs(after!.height - before!.height)).toBeLessThanOrEqual(1);
      await expect(reader.locator('.katex-error')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    }
    const style = await reader.locator('.concept-body p').first().evaluate(element => {
      const css = getComputedStyle(element);
      return { family: css.fontFamily, weight: css.fontWeight, align: css.textAlign, last: css.textAlignLast,
        loaded: document.fonts.check('700 16px "ManSeekSong Paper"', '한글 English') };
    });
    expect(style).toMatchObject({ weight: '700', align: 'justify', last: 'start', loaded: true });
    expect(style.family).toContain('ManSeekSong Paper');
    results.push({type, sourceId: edition.sourceId, scenes: edition.screen.scenes.length, height: before!.height, style});
    await page.getByRole('button', { name: '목록으로 돌아가기', exact: true }).click();
    await expect(page.getByRole('textbox', { name: '개념 찾기', exact: true })).toHaveValue(name);
  }
  await page.getByRole('textbox', { name: '개념 찾기', exact: true }).fill('심슨');
  await page.getByRole('button', { name: '심슨의 역설', exact: true }).click();
  await page.getByRole('button', { name: '난이도별 비교', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: '난이도별 비교', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: '쉬운 문제도 어려운 문제도 민주 정답률이 더 높아요.', exact: true })).toBeVisible();
  expect(failures).toEqual([]);
  await info.attach('reading-types.json', { body: JSON.stringify(results, null, 2), contentType: 'application/json' });
  await page.screenshot({ path: info.outputPath('concept-reading.png'), fullPage: true });
});
