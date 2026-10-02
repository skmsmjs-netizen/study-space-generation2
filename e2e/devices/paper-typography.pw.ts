import { expect, test } from '@playwright/test';

test('Korean and English native paper type preserves mid-text edits, saved memos and small previews', async ({ page }, info) => {
  await page.goto('?space=demo#/memos');
  const examples = [
    '  조건과 예외를 함께 적습니다.\n' + '이해한 관계를 내 말로 기록하고 다시 읽습니다. '.repeat(24) + '\n끝 공백  ',
    '  Keep the conditions and exceptions together.\n' + 'Write the relationship in your own words and return to the question. '.repeat(24) + '\nTrailing spaces  ',
  ];
  for (let index = 0; index < examples.length; index++) {
    await page.getByRole('button', { name: '메모 추가', exact: true }).click();
    if (!await page.getByRole('textbox', { name: '짧은 글', exact: true }).isVisible())
      await page.getByText('글·연결·입력 설정', { exact: true }).click();
    const editor = page.getByRole('textbox', { name: '짧은 글', exact: true });
    await editor.fill(examples[index]);
    await editor.evaluate((element: HTMLTextAreaElement) => element.setSelectionRange(2, 2));
    await editor.pressSequentially('[검증 예시] ');
    const expected = examples[index].slice(0, 2) + '[검증 예시] ' + examples[index].slice(2);
    await expect(editor).toHaveValue(expected);
    await page.evaluate(() => document.fonts.ready);
    const style = await editor.evaluate(element => {
      const css = getComputedStyle(element);
      return { family: css.fontFamily, weight: css.fontWeight, size: css.fontSize,
        align: css.textAlign, last: css.textAlignLast, transform: css.transform,
        line: css.lineHeight, tracking: css.letterSpacing,
        loaded: document.fonts.check('700 16px "ManSeekSong Paper"', '한글 English') };
    });
    expect(style).toMatchObject({ weight: '700', size: '16px', line: '29.6px', tracking: '-0.4px', align: 'justify', last: 'start', transform: 'none', loaded: true });
    expect(style.family).toContain('ManSeekSong Paper');
    await page.getByRole('button', { name: '닫기', exact: true }).click();
    const preview = page.locator('.memo-preview-text').filter({ hasText: '[검증 예시]' }).filter({ hasText: index === 0 ? '조건과 예외' : 'Keep the conditions' });
    await expect(preview).toHaveText(expected);
    expect(await preview.evaluate(element => getComputedStyle(element).fontSize)).toBe('14px');
    await page.reload();
    await page.getByRole('button', { name: /메모 \d+ 열기/ }).filter({ hasText: index === 0 ? '조건과 예외' : 'Keep the conditions' }).click();
    if (!await page.getByRole('textbox', { name: '짧은 글', exact: true }).isVisible())
      await page.getByText('글·연결·입력 설정', { exact: true }).click();
    await expect(page.getByRole('textbox', { name: '짧은 글', exact: true })).toHaveValue(expected);
    await page.getByRole('button', { name: '닫기', exact: true }).click();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  await page.screenshot({ path: info.outputPath('paper-memo-previews.png'), fullPage: true });
});

test('concept prose follows its available column in both languages while math and personal fonts keep their roles', async ({ page }) => {
  await page.goto('?space=demo#/concepts');
  await page.getByRole('button', { name: '설명 만들기', exact: true }).click();
  if (await page.getByRole('button', { name: '다른 원문 가져오기', exact: true }).isVisible())
    await page.getByRole('button', { name: '다른 원문 가져오기', exact: true }).click();
  await page.getByLabel('개념 원문 가져오기', { exact: true }).setInputFiles('e2e/fixtures/paper-typography-concepts.json');
  await page.getByRole('button', { name: '조판 확인용 개념 예시 정의형 · 내용 검토', exact: true }).click();
  const paragraph = page.locator('.concept-body > p').first();
  await page.evaluate(() => document.fonts.ready);
  const before = await paragraph.evaluate(element => ({ width: element.getBoundingClientRect().width, size: getComputedStyle(element).fontSize }));
  expect(before.size).toBe(before.width <= 640 ? '16px' : '18px');
  // A narrow column inside a wide viewport exercises the actual-container
  // fallback, including the cascade that viewport-only tests would miss.
  await page.addStyleTag({ content: '.concept-reader { --concept-reading-measure: 22rem; max-inline-size: 22rem; }' });
  const compact = await paragraph.evaluate(element => {
    const css = getComputedStyle(element);
    return { size: css.fontSize, line: css.lineHeight, tracking: css.letterSpacing, weight: css.fontWeight };
  });
  expect(compact).toEqual({ size: '16px', line: '29.6px', tracking: '-0.4px', weight: '700' });
  const math = page.locator('.concept-body .katex').first();
  expect(await math.evaluate(element => getComputedStyle(element).fontFamily)).not.toContain('ManSeekSong Paper');
  await page.getByRole('button', { name: '목록으로 돌아가기', exact: true }).click();
  await page.getByRole('button', { name: 'Typesetting sample 정의형 · 내용 검토', exact: true }).click();
  await expect(page.locator('.concept-body > p').first()).toContainText('To understand a relationship');
  await expect(page.locator('.concept-body [data-source-token="a"]')).toHaveCount(0);
  expect(await page.locator('.concept-body > p').first().evaluate(element => getComputedStyle(element).fontSize)).toBe('16px');
  await page.addStyleTag({ content: '.concept-reader { --font-reading: Georgia, serif; --paper-body-size: 1.1875rem; --paper-body-weight: 400; }' });
  const personal = await page.locator('.concept-body > p').first().evaluate(element => {
    const css = getComputedStyle(element);
    return { family: css.fontFamily, size: css.fontSize, weight: css.fontWeight, transform: css.transform };
  });
  expect(personal).toEqual({ family: 'Georgia, serif', size: '19px', weight: '400', transform: 'none' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
});
