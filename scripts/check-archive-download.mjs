/** Opt-in real-browser regression. Uses a fresh, disposable context; never a user profile.
 * PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/check-archive-download.mjs \
 *   http://127.0.0.1:4187/ /absolute/path/to/private-results
 * Reuses an installed Playwright and Chrome. Does not install tools or join an existing browser.
 */
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const target = new URL(process.argv[2] ?? 'http://127.0.0.1:4187/');
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(target.hostname), 'Only isolated loopback apps may receive test fixtures');
assert.equal(target.protocol, 'http:');
const output = path.resolve(process.argv[3] ?? 'artifacts/archive-download');
await mkdir(output, { recursive: true });
const modulePath = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(modulePath ? pathToFileURL(path.resolve(modulePath)).href : 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const prefix = `study-space:demo:draft:qa-export-${randomUUID()}:`;
const fixtures = [
  { kind: 'empty', raw: '' },
  { kind: 'long', raw: '긴 원문과 예외를 보존합니다.\r\n\t'.repeat(12000) },
  { kind: 'special', raw: '  {broken\r\n한글 시험\t"<img src=x onerror=alert(1)>"\u0000\ud800 high / low \udfff  ' },
];
const report = { verified_at: new Date().toISOString(), browser: await browser.version(),
  mode: 'fresh headless Chrome; actual product button, download event, file receipt and reopen',
  results: [], passed: false };
try {
  await page.goto(target.href);
  await page.getByRole('heading', { level: 1 }).first().waitFor();
  // This is fixture setup in the separate regression browser, not product UI evidence.
  const before = await page.evaluate(({ prefix, fixtures }) => {
    const archivedAt = new Date().toISOString();
    for (const fixture of fixtures) {
      const sourceKey = `${prefix}${fixture.kind}`, archiveKey = `${sourceKey}:recovery:fixture`;
      localStorage.setItem(sourceKey, `현재 초안은 별도로 유지: ${fixture.kind}`);
      localStorage.setItem(archiveKey, fixture.raw);
      localStorage.setItem(`study-space:draft-archive-metadata:v1:${archiveKey}`, JSON.stringify({
        version: 1, sourceKey, archiveKey, archivedAt, reason: `내보내기 회귀: ${fixture.kind}`,
      }));
    }
    return Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)]));
  }, { prefix, fixtures });
  target.hash = '/draft-archives';
  await page.goto(target.href);
  await page.getByRole('heading', { name: '초안 보관본', exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: '원문 내보내기', exact: true }).count(), fixtures.length);

  // Browser-side synthetic failure: distinguish failure to start from successful receipt.
  await page.evaluate(() => {
    const original = URL.createObjectURL;
    URL.createObjectURL = () => { URL.createObjectURL = original; throw new Error('QA: fail once'); };
  });
  await page.getByRole('button', { name: '원문 내보내기', exact: true }).first().click();
  assert.match(await page.getByRole('alert').innerText(), /파일 다운로드를 시작하지 못했습니다/);
  assert.equal(await page.getByRole('status').count(), 0);
  report.startFailureShown = true;

  for (let index = 0; index < fixtures.length; index++) {
    const fixture = fixtures[index];
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: '원문 내보내기', exact: true }).nth(index).click();
    const download = await pending;
    assert.equal(await download.failure(), null);
    const filename = download.suggestedFilename();
    assert.match(filename, /^study-draft-archive-[\w-]+\.json$/);
    await download.saveAs(path.join(output, filename));
    const bytes = await readFile(path.join(output, filename));
    const reopened = JSON.parse(bytes.toString('utf8'));
    const sourceKey = `${prefix}${fixture.kind}`, archiveKey = `${sourceKey}:recovery:fixture`;
    assert.deepEqual(reopened, { format: 'study-space-draft-archive', version: 1, sourceKey, archiveKey,
      metadata: JSON.parse(before[`study-space:draft-archive-metadata:v1:${archiveKey}`]), raw: fixture.raw });
    assert.match(await page.getByRole('status').innerText(), /다운로드를 요청했습니다/);
    assert.equal(await page.getByRole('alert').count(), 0);
    report.results.push({ kind: fixture.kind, filename, bytes: bytes.length, utf16Length: fixture.raw.length,
      sha256: createHash('sha256').update(bytes).digest('hex'), exactRaw: true, exactMetadataAndIds: true,
      receivedFrom: new URL(download.url()).protocol });
  }
  const after = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])));
  // Route hints may change. All pre-existing source/draft/archive/record values must remain exact.
  const protectedKeys = Object.keys(before).filter(key => key === 'study-space:demo:v1' || key.includes(prefix));
  for (const key of protectedKeys) assert.equal(after[key], before[key], key);
  assert.equal(Object.keys(after).filter(key => key.includes(prefix)).length, protectedKeys.filter(key => key.includes(prefix)).length);
  report.protectedValuesUnchanged = protectedKeys.length;
  report.syntheticFailureRetry = 'download received after retry; source/current draft/records unchanged';
  await page.screenshot({ path: path.join(output, 'archive-download.png'), fullPage: true });
  report.passed = true;
} catch (error) {
  report.error = String(error);
  throw error;
} finally {
  await writeFile(path.join(output, 'result.json'), `${JSON.stringify(report, null, 2)}\n`);
  await context.close();
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
