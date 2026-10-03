import { expect, test } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const evidence = process.env.MOBILE_USABILITY_EVIDENCE_DIR || 'work/mobile-usability-20261003/fix';

test('mobile paper preserves original prose and reveals footer focus and the current menu', async ({ page }, info) => {
  mkdirSync(evidence, { recursive: true });
  await page.goto('?space=demo#/concepts');
  await page.getByRole('textbox', { name: '개념 찾기', exact: true }).fill('증명과 증거');
  await page.getByRole('button', { name: '증명과 증거', exact: true }).click();
  await page.evaluate(() => document.fonts.ready);
  const initial = info.project.use.viewport!;
  const sizes = [initial];
  if (info.project.name === 'iPhone-17-Pro-portrait') sizes.push({ width: 320, height: 681 });
  const observations = [];
  for (const size of sizes) {
    await page.setViewportSize(size);
    await page.getByRole('button', { name: '사례를 확인하면', exact: true }).click();
    const paragraph = page.locator('.concept-stage.is-current .concept-body p').nth(1);
    await expect(paragraph).toHaveText('하지만 확인하지 않은 큰 짝수에도 맞는지는 이 두 계산만으로 끝나지 않아요. 증거는 주장 판단에 도움이 되는 관찰이나 자료예요. 어떤 주장에 어떤 도움이 되는지는 따로 살펴봐야 해요.');
    const measure = async () => page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>('.bottom-nav')!;
      const active = nav.querySelector<HTMLElement>('[aria-current="page"]')!;
      const box = (e: Element) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; };
      const p = document.querySelector<HTMLElement>('.concept-stage.is-current .concept-body p:nth-child(2)')!;
      const css = getComputedStyle(p);
      const widths: number[] = [];
      const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const n = walker.currentNode;
        for (let i = 0; i < n.textContent!.length; i++) if (n.textContent![i] === ' ') {
          const range = document.createRange(); range.setStart(n, i); range.setEnd(n, i + 1);
          const rect = range.getBoundingClientRect(); if (rect.width > 0) widths.push(rect.width);
        }
      }
      const ar = active.getBoundingClientRect();
      return { viewport: { width: innerWidth, height: innerHeight }, pageWidth: document.documentElement.scrollWidth,
        body: { fontSize: css.fontSize, lineHeight: css.lineHeight, weight: css.fontWeight, font: css.fontFamily, align: css.textAlign, last: css.textAlignLast, wrap: css.textWrap, maxSpaceWidth: Math.max(...widths), ...box(p) },
        nav: { ...box(nav), active: active.textContent, activeBox: box(active), scrollLeft: nav.scrollLeft, activeFullyVisible: !nav.getClientRects().length || ar.left >= 0 && ar.right <= innerWidth } };
    });
    await expect.poll(async () => (await measure()).nav.activeFullyVisible).toBe(true);
    const normal = await measure();
    expect(normal.pageWidth).toBeLessThanOrEqual(size.width + 1);
    expect(normal.body).toMatchObject({ weight: '700', align: 'justify', last: 'start' });
    expect(normal.body.font).toContain('ManSeekSong Paper');
    // For this mixed-width Korean paragraph, a word gap stays below one glyph
    // (3/4 em, allowing integer rounding). This project bound is not WCAG.
    expect(normal.body.maxSpaceWidth).toBeLessThanOrEqual(parseFloat(normal.body.fontSize) * .75);
    await page.getByRole('button', { name: '현재 관찰로 이동', exact: true }).click();
    await page.screenshot({ path: path.join(evidence, `${info.project.name}-${size.width}-after-reading.png`) });
    const footer = page.getByRole('button', { name: '처음부터 보기', exact: true });
    const control = async () => footer.evaluate(el => {
      const r = el.getBoundingClientRect(); const nav = document.querySelector('.bottom-nav')!.getBoundingClientRect();
      const limit = nav.height ? nav.top : innerHeight;
      const at = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return { top: r.top, bottom: r.bottom, limit, entireButtonVisible: r.top >= 0 && r.bottom <= limit, centerNotCovered: el === at || el.contains(at) };
    });
    await footer.scrollIntoViewIfNeeded();
    await expect.poll(async () => (await control()).entireButtonVisible).toBe(true);
    const automaticScroll = await control();
    expect(automaticScroll.centerNotCovered).toBe(true);
    // Deliberately position the footer inside the overlay before a new focus.
    // No user data/selection is changed; focus must reveal the whole control.
    if (normal.nav.height) {
      await page.getByRole('heading', { name: '짝수 두 개를 더하니 짝수가 되었어요.', exact: true }).focus();
      await footer.evaluate(el => { const r = el.getBoundingClientRect(); window.scrollBy({ top: r.bottom - innerHeight + 1, behavior: 'instant' }); });
    }
    await footer.focus();
    await expect.poll(async () => (await control()).entireButtonVisible).toBe(true);
    const focus = await control(); expect(focus.centerNotCovered).toBe(true);
    await page.screenshot({ path: path.join(evidence, `${info.project.name}-${size.width}-after-footer-focus.png`) });
    await page.getByRole('button', { name: '이유를 보이면', exact: true }).click();
    await page.reload();
    await expect(page.getByRole('button', { name: '이유를 보이면', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: '목록으로 돌아가기', exact: true }).click();
    await expect(page.getByRole('textbox', { name: '개념 찾기', exact: true })).toHaveValue('증명과 증거');
    await page.getByRole('button', { name: '증명과 증거', exact: true }).click();
    observations.push({ normal, automaticScroll, focus, sceneReload: true, searchReturn: true });
  }
  writeFileSync(path.join(evidence, `${info.project.name}-after.json`), JSON.stringify(observations, null, 2));
});

test('navigation resize keeps page position and personal prose overrides', async ({ page }, info) => {
  await page.goto('?space=demo#/concepts');
  await page.getByRole('textbox', { name: '개념 찾기', exact: true }).fill('증명과 증거');
  await page.getByRole('button', { name: '증명과 증거', exact: true }).click();
  // Synthetic personal CSS overrides exercise the existing public override contract.
  await page.addStyleTag({ content: ':root { --paper-body-size: 20px; --paper-body-line: 1.7; --font-reading: serif; }' });
  const p = page.locator('.concept-stage.is-current .concept-body p').nth(1);
  await expect(p).toHaveCSS('font-size', '20px');
  await expect(p).toHaveCSS('line-height', '34px');
  await expect(p).toHaveCSS('font-family', 'serif');
  await page.getByRole('button', { name: '현재 관찰로 이동', exact: true }).click();
  const before = await page.evaluate(() => scrollY);
  // Resize notifications with unchanged geometry must not jump to the menu.
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  expect(await page.evaluate(() => scrollY)).toBe(before);
  const viewport = info.project.use.viewport!;
  await page.setViewportSize({ width: Math.min(viewport.width, 517), height: viewport.height });
  await expect(p).toHaveCSS('font-size', '20px');
  await expect(p).toHaveCSS('font-family', 'serif');
  await expect.poll(() => page.locator('.bottom-nav').evaluate(nav => {
    const a = nav.querySelector('[aria-current="page"]')!.getBoundingClientRect();
    return !nav.getClientRects().length || a.left >= 0 && a.right <= innerWidth;
  })).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth + 1));
});
