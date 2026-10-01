import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

test('a blocked automatic download retains a real link and can save the same archive twice', async ({ page }, testInfo) => {
  // Block only programmatic anchor.click; pointer activation of the visible link is native.
  await page.addInitScript(() => {
    HTMLAnchorElement.prototype.click = function () {};
  });
  await page.goto('?space=demo#/backup');
  await page.getByRole('button', { name: '전체 백업 내려받기', exact: true }).click();
  const retry = page.getByRole('link', { name: '백업 파일 다시 저장', exact: true });
  await expect(retry).toBeVisible();
  await expect(page.getByRole('status')).toContainText('준비했습니다');
  await expect(page.getByRole('status')).not.toContainText('내려받았습니다');
  // The old one-second URL cleanup must not invalidate a later user retry.
  await page.waitForTimeout(1500);
  const firstPromise = page.waitForEvent('download');
  await retry.click();
  const first = await firstPromise;
  const firstPath = testInfo.outputPath('manual-retry-1.zip');
  await first.saveAs(firstPath);
  const secondPromise = page.waitForEvent('download');
  await retry.click();
  const second = await secondPromise;
  const secondPath = testInfo.outputPath('manual-retry-2.zip');
  await second.saveAs(secondPath);
  expect(await readFile(secondPath)).toEqual(await readFile(firstPath));
  await expect(retry).toBeVisible();
});

test('whole backup downloads and restores records, attachments, unfinished text and pre-restore copies on a clean device', async ({ page, browser }, testInfo) => {
  await page.goto('?space=demo#/record');
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  const body = '  백업 왕복 원문\n조건·예외를 남김  ';
  await page.getByRole('textbox', { name: '메모', exact: true }).fill(body);
  await page.getByRole('button', { name: /기록 저장/ }).click();
  // Explicit synthetic-only storage setup; personal accounts, tokens and server data are absent.
  await page.goto('?space=demo#/backup');
  await expect(page.getByRole('button', {name:'전체 백업 내려받기'})).toBeVisible();
  const original = await page.evaluate(async () => {
    const bytes = new TextEncoder().encode('합성 첨부 원본\n공백  '), sha256 = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(x => x.toString(16).padStart(2, '0')).join('');
    const key = `study-space:demo:material:audio%3A${sha256}`;
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const r = indexedDB.open('study-space-material-files', 1); r.onupgradeneeded = () => { for (const name of ['files','drafts','recordings']) r.result.createObjectStore(name); }; r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
    await new Promise<void>((resolve, reject) => { const tx = db.transaction(['files','drafts','recordings'], 'readwrite');
      tx.objectStore('files').put({format:'study-space-binary-v1',bytes:bytes.buffer,type:'audio/wav'}, key);
      tx.objectStore('drafts').put({content:{title:'미완 자료',subjectId:'demo-subject-math',topicId:null,sourceText:'  미완 필기\n',audio:{key,name:'합성.wav',type:'audio/wav',size:bytes.length,sha256},results:[]},baseVersion:0,updatedAt:'2026-10-01T04:00:00Z'}, 'study-space:demo:material:backup-test');
      tx.objectStore('recordings').put({format:'study-space-binary-v1',bytes:new TextEncoder().encode('미완 녹음').buffer,type:'audio/webm'},'study-space:demo:material:recording-test:00000000');
      tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); }); db.close();
    localStorage.setItem('study-space:demo:backup-test-draft','  미완 원문\n\ud800');
    return {key, sha256, raw:localStorage.getItem('study-space:demo:v1')};
  });
  await page.goto('?space=demo#/backup');
  const downloaded = page.waitForEvent('download'); await page.getByRole('button',{name:'전체 백업 내려받기'}).click();
  const file = await downloaded, path = testInfo.outputPath('whole-backup.zip'); await file.saveAs(path);
  const bytes = await readFile(path);
  const clean = await browser.newContext({ viewport: testInfo.project.use.viewport, deviceScaleFactor: testInfo.project.use.deviceScaleFactor, isMobile: testInfo.project.use.isMobile, hasTouch: testInfo.project.use.hasTouch, locale: 'ko-KR', timezoneId: 'Asia/Seoul' });
  try {
    const fresh = await clean.newPage(); fresh.on('dialog', dialog => dialog.accept());
    await fresh.goto(new URL('?space=demo#/backup', page.url()).href);
    await fresh.getByLabel('전체 백업 파일').setInputFiles({name:'whole-backup.zip',mimeType:'application/zip',buffer:bytes});
    await expect(fresh.getByText(/공부 기록 1개/)).toBeVisible();
    await fresh.getByRole('checkbox',{name:'현재 이 기기 자료를 보관한 뒤 백업 내용으로 복원합니다'}).check();
    await fresh.getByRole('button',{name:'이 기기에 복원',exact:true}).click();
    await fresh.getByRole('button',{name:'다시 열어 복원하기'}).click();
    await expect(fresh.getByRole('button',{name:'전체 백업 내려받기'})).toBeVisible();
    await expect(fresh.getByRole('heading',{name:'복원 전 보관본'})).toBeVisible();
    const restored = await fresh.evaluate(async ({key}) => {
      const db = await new Promise<IDBDatabase>(resolve => { const r=indexedDB.open('study-space-material-files',1);r.onsuccess=()=>resolve(r.result); });
      const values = await new Promise<[Blob, {content: {sourceText: string}}, Blob]>(resolve => { const tx=db.transaction(['files','drafts','recordings'],'readonly');const a=tx.objectStore('files').get(key),b=tx.objectStore('drafts').get('study-space:demo:material:backup-test'),c=tx.objectStore('recordings').get('study-space:demo:material:recording-test:00000000');tx.oncomplete=()=>resolve([a.result,b.result,c.result]); }); db.close();
      const blob = (value: unknown) => value instanceof Blob ? value : new Blob([(value as {bytes:ArrayBuffer}).bytes],{type:(value as {type:string}).type});
      return {raw:localStorage.getItem('study-space:demo:v1'),draft:localStorage.getItem('study-space:demo:backup-test-draft'),audio:await blob(values[0]).text(),source:values[1].content.sourceText,recording:await blob(values[2]).text()};
    }, original);
    expect(restored.raw).toBe(original.raw); expect(restored.draft).toBe('  미완 원문\n\ud800'); expect(restored.audio).toBe('합성 첨부 원본\n공백  '); expect(restored.source).toBe('  미완 필기\n'); expect(restored.recording).toBe('미완 녹음');
    await fresh.getByLabel('전체 백업 파일').setInputFiles({name:'broken.zip',mimeType:'application/zip',buffer:Buffer.from('손상된 파일')});
    await expect(fresh.getByRole('alert')).toContainText('읽지 못했습니다');
    expect(await fresh.evaluate(()=>localStorage.getItem('study-space:demo:v1'))).toBe(original.raw);
    await expect(fresh.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).resolves.toBeLessThanOrEqual(1);
    await fresh.screenshot({path:testInfo.outputPath('backup-restored.png'),fullPage:true});
  } finally { await clean.close(); }
});

test('scope name, interactive chart evidence and graph attribution retain their accessible roles and contrast', async ({page}) => {
  await page.goto('?space=demo#/record'); await expect(page.getByRole('combobox',{name:'공부 범위'})).toBeVisible();
  expect((await new AxeBuilder({page}).include('.topbar').withRules(['select-name']).analyze()).violations).toEqual([]);
  await page.goto('?space=demo#/statistics');
  const graph = page.getByRole('region', {name:'기간별 통계 그래프',exact:true});
  await graph.getByLabel('보고 싶은 것', {exact:true}).selectOption('trend');
  await graph.getByLabel('그래프 종류', {exact:true}).selectOption('column');
  await expect(graph.locator('.statistics-chart')).toBeVisible();
  await expect(graph.getByRole('group',{name:/정확한 날짜가 있는 기록/})).toBeVisible();
  expect((await new AxeBuilder({page}).include('.statistics-chart').withRules(['nested-interactive']).analyze()).violations).toEqual([]);
  const evidence=page.getByRole('button',{name:/근거 보기$/}).first(); await evidence.focus(); await evidence.press('Enter'); await expect(page.getByRole('dialog')).toBeVisible();
  await page.goto('?space=demo#/graph'); await expect(page.locator('.react-flow__attribution')).toBeVisible();
  expect((await new AxeBuilder({page}).include('.react-flow__attribution').withRules(['color-contrast']).analyze()).violations).toEqual([]);
});
