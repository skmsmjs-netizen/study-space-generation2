import { expect, test } from '@playwright/test';

test('rapid source input batches draft writes and preserves Korean text on immediate reload', async ({ page }, info) => {
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    const probe = { writes: 0, timings: [] as number[] };
    Object.assign(window, { codeInputProbe: probe });
    Storage.prototype.setItem = function (key, value) {
      if (key.includes(':code-example-draft:')) probe.writes++;
      return original.call(this, key, value);
    };
    document.addEventListener('keydown', event => {
      if (!(event.target instanceof Element) || !event.target.closest('.code-editor-shell')) return;
      const start = performance.now();
      requestAnimationFrame(() => probe.timings.push(performance.now() - start));
    }, true);
  });
  await page.goto(process.env.CODE_INPUT_PUBLIC_URL || './?space=demo#/code');
  await page.getByRole('button', { name: '예제 추가', exact: true }).click();
  await page.getByLabel('예제 제목', { exact: true }).fill('입력 지연 회귀');
  const touch = page.locator('.cm-content[aria-label="소스 코드"]');
  const source = await touch.count() ? touch : page.getByLabel('소스 코드', { exact: true });
  await source.waitFor();
  const modifier = await page.evaluate(() => /Macintosh|Mac OS X|iPhone|iPad|iPod/.test(navigator.userAgent) ? 'Meta' : 'Control');
  const replace = async (value: string) => {
    await source.press(`${modifier}+a`);
    if (value) await page.keyboard.insertText(value);
    else await source.press('Backspace');
  };
  const large = Array.from({ length: 600 }, (_, i) => `// 원문 ${i}`).join('\n');
  await replace(large);
  await page.getByRole('button', { name: '지금 저장', exact: true }).click();
  await expect(page.locator('.code-save-bar')).toContainText('이 기기에 저장됨');
  await source.press(`${modifier}+End`);
  const before = await page.evaluate(() => (window as unknown as { codeInputProbe: { writes: number } }).codeInputProbe.writes);
  const text = 'abcdefghijklmnopqrstuvwx'.repeat(5);
  const start = Date.now();
  await source.pressSequentially(text);
  const elapsedMs = Date.now() - start;
  const probe = await page.evaluate(() => (window as unknown as { codeInputProbe: { writes: number; timings: number[] } }).codeInputProbe);
  const writes = probe.writes - before;
  await info.attach('input-measurement', { body: JSON.stringify({ characters: text.length, lines: 600, elapsedMs, draftWrites: writes, maxKeyToFrameMs: Math.max(...probe.timings), meanKeyToFrameMs: probe.timings.reduce((a,b)=>a+b,0)/probe.timings.length }), contentType: 'application/json' });
  if (!process.env.CODE_INPUT_BASELINE) expect(writes).toBeLessThan(text.length / 10);
  // Reload while the trailing save is pending: pagehide/beforeunload must commit the newest text.
  await replace('// 한글 주석·공백 보존\nint main(void) { return 7; }');
  await page.reload();
  await expect(page.getByLabel('예제 제목', { exact: true })).toHaveValue('입력 지연 회귀');
  await expect(page.locator('.code-editor-shell')).toContainText('한글 주석·공백 보존');
  await expect(page.locator('.code-editor-shell')).toContainText('return');
  await expect(page.locator('.code-syntax-status')).toContainText('문법 오류를 찾지 못했습니다.');
  // Invalid -> valid -> empty keeps diagnostics useful without replacing the active editor.
  await replace('int main(');
  await expect(page.locator('.code-syntax-status')).toContainText('문법 오류 1개');
  await replace('');
  await expect(page.locator('.code-syntax-status')).toContainText('입력하면 자동으로 문법을 검사합니다.');
  await expect(page.getByRole('button', { name: '지금 저장', exact: true })).toBeEnabled();
});
