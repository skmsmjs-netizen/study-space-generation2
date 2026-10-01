import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { decodeStoredText } from '../../src/data/storage-codec';

const original = '  백업 왕복 원문\n조건·예외와 끝 공백  ';
test('full backup restores exact records, an unfinished draft, settings and attachment bytes in a fresh browser', async ({ page, browser }, info) => {
  await page.goto('?space=demo#/record');
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  await page.getByRole('textbox', { name: '메모', exact: true }).fill(original);
  await page.getByRole('button', { name: '1개 주제 기록 저장', exact: true }).click();
  await expect(page.getByRole('heading', { name: '최근 남긴 기록', exact: true })).toBeVisible();
  const exactLedger = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  const attachment = await page.evaluate(async () => {
    localStorage.setItem('study-space:demo:draft:quality', JSON.stringify({ body: '  미완 원문\ud800  ' }));
    localStorage.setItem('study-space:demo:quality-setting', '큰 글자 · 개인 설정');
    const blob = new Blob(['합성 첨부 원본\n끝 공백  '], { type: 'audio/wav' });
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', await blob.arrayBuffer()))].map(byte => byte.toString(16).padStart(2, '0')).join('');
    const key = `study-space:demo:material:audio%3A${hash}`;
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('study-space-material-files', 1);
      request.onupgradeneeded = () => { for (const name of ['files', 'drafts', 'recordings']) request.result.createObjectStore(name); };
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    const stored = { format: 'study-space-binary-v1', bytes: await blob.arrayBuffer(), type: blob.type };
    await new Promise<void>((resolve, reject) => { const tx = db.transaction('files', 'readwrite'); tx.objectStore('files').put(stored, key); tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); }); db.close();
    return { key, text: await blob.text(), hash };
  });
  await page.goto('?space=demo#/backup');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '전체 백업 내려받기', exact: true }).click();
  const download = await downloadPromise, file = info.outputPath('full-backup.zip');
  await download.saveAs(file);
  await expect(page.getByRole('status').filter({ hasText: '백업 파일을 준비했습니다' })).toBeVisible();
  const context = await browser.newContext({ viewport: info.project.use.viewport, isMobile: info.project.use.isMobile, hasTouch: info.project.use.hasTouch, locale: 'ko-KR' });
  try {
    const target = await context.newPage();
    target.on('dialog', dialog => dialog.accept());
    await target.goto(new URL('?space=demo#/backup', info.project.use.baseURL as string).href);
    await expect(target.getByRole('button', { name: '전체 백업 내려받기', exact: true })).toBeVisible();
    await target.evaluate(() => { localStorage.setItem('study-space:demo:extra-original', '복원 전 별도 원문'); });
    await target.getByLabel('전체 백업 파일', { exact: true }).setInputFiles(file);
    await expect(target.getByText(/공부 기록 1개/)).toBeVisible();
    await target.getByRole('checkbox', { name: '현재 이 기기 자료를 보관한 뒤 백업 내용으로 복원합니다', exact: true }).check();
    await target.getByRole('button', { name: '이 기기에 복원', exact: true }).click();
    await target.getByRole('button', { name: '다시 열어 복원하기', exact: true }).click();
    await expect(target.getByRole('button', { name: '전체 백업 내려받기', exact: true })).toBeVisible();
    expect(await target.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(exactLedger);
    expect(await target.evaluate(() => localStorage.getItem('study-space:demo:draft:quality'))).toBe(JSON.stringify({ body: '  미완 원문\ud800  ' }));
    expect(await target.evaluate(() => localStorage.getItem('study-space:demo:quality-setting'))).toBe('큰 글자 · 개인 설정');
    expect(await target.evaluate(() => localStorage.getItem('study-space:demo:extra-original'))).toBe('복원 전 별도 원문');
    const bytes = await target.evaluate(async key => {
      const db = await new Promise<IDBDatabase>(resolve => { const request = indexedDB.open('study-space-material-files', 1); request.onsuccess = () => resolve(request.result); });
      const stored = await new Promise<Blob | { bytes: ArrayBuffer; type: string }>(resolve => { const tx = db.transaction('files'), request = tx.objectStore('files').get(key); request.onsuccess = () => resolve(request.result); }); db.close();
      const blob = stored instanceof Blob ? stored : new Blob([stored.bytes], { type: stored.type });
      return { text: await blob.text(), hash: [...new Uint8Array(await crypto.subtle.digest('SHA-256', await blob.arrayBuffer()))].map(byte => byte.toString(16).padStart(2, '0')).join('') };
    }, attachment.key);
    expect(bytes).toEqual({ text: attachment.text, hash: attachment.hash });
    const saved = JSON.parse(decodeStoredText((await target.evaluate(() => localStorage.getItem('study-space:demo:v1')))!)).data;
    expect(saved.records).toHaveLength(1); expect(saved.records[0].body).toBe(original);
    await expect(target.getByRole('heading', { name: '복원 전 보관본', exact: true })).toBeVisible();
    await target.goto(new URL('?space=demo#/search', info.project.use.baseURL as string).href);
    await target.getByRole('searchbox', { name: '과목·목차·기록 검색', exact: true }).fill('백업 왕복 원문');
    await expect(target.getByText('찾은 항목 1개')).toBeVisible();
    await target.screenshot({ path: info.outputPath('restored-search.png'), fullPage: true });
  } finally { await context.close(); }
});

test('quality fixes retain accessible control names, chart actions and unscaled Canvas alternatives', async ({ page }, info) => {
  const findings: unknown[] = [];
  for (const route of ['/', '/statistics', '/record', '/search', '/backup', '/graph', '/canvas', '/math']) {
    await page.goto(`?space=demo#${route}`);
    await expect(page.locator('main h1').first()).toBeVisible();
    await expect(page.locator('main [data-ui-loading]')).toHaveCount(0, { timeout: 30000 });
    if (route === '/math') {
      await page.getByLabel('그래프 도구', { exact: true }).selectOption('geogebra');
      await expect(page.getByRole('button', { name: '＋ 확대', exact: true })).toBeEnabled({ timeout: 45000 });
      for (const selector of ['input[max="360"]', 'input[min="-90"]']) {
        const helper = page.locator(`.math-geogebra-host ${selector}`);
        await helper.focus();
        await expect(helper).toHaveAccessibleName(selector.includes('360') ? '시점 회전' : '시점 기울기');
        const bounds = await helper.boundingBox();
        expect(bounds!.width).toBeGreaterThanOrEqual(24);
        expect(bounds!.height).toBeGreaterThanOrEqual(24);
        await helper.press('Home');
        const before = await helper.inputValue();
        await helper.press('ArrowRight');
        expect(await helper.inputValue()).not.toBe(before);
        if (selector.includes('-90')) await page.locator('.math-geogebra-host').screenshot({ path: info.outputPath('focused-camera-control.png') });
        await helper.evaluate(element => (element as HTMLInputElement).blur());
      }
    }
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    findings.push({ route, violations: result.violations, incomplete: result.incomplete.map(item => item.id) });
    expect.soft(result.violations.filter(item => ['select-name', 'nested-interactive', 'color-contrast', 'scrollable-region-focusable', 'target-size'].includes(item.id)), route).toEqual([]);
    expect.soft(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), route).toBeLessThanOrEqual(1);
  }
  await info.attach('quality-accessibility', { body: JSON.stringify(findings, null, 2), contentType: 'application/json' });
  await page.goto('?space=demo#/canvas');
  await page.getByRole('combobox', { name: '조작할 카드', exact: true }).selectOption({ label: '주제 · 함수는 어떤 관계일까?' });
  const edit = page.getByRole('button', { name: '선택한 카드 편집', exact: true });
  const size = await edit.boundingBox(); expect(size!.width).toBeGreaterThanOrEqual(24); expect(size!.height).toBeGreaterThanOrEqual(24);
  await page.getByRole('link', { name: '선택한 카드 열기 ↗', exact: true }).click();
  await expect(page.getByRole('heading', { name: '함수는 어떤 관계일까?', level: 1, exact: true })).toBeVisible();
});
