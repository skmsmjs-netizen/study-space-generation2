import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createDemoState } from '../../src/domain/fixtures';
import { applyCommand } from '../../src/domain/commands';
import { makeLargeFixture } from '../fixtures/ux-large-state';
import { encodeStoredText, decodeStoredText } from '../../src/data/storage-codec';
const app = readFileSync('src/App.tsx', 'utf8');
const start = app.indexOf('const navItems =');
const routes = [...new Set([
  ...[...app.slice(start, app.indexOf('];', start)).matchAll(/href:\s*["']([^"']+)["']/g)].map(m => m[1]),
  '/backup', '/draft-archives', '/trash', '/free', '/help', '/about', '/my-progress',
  '/subject/demo-subject-math', '/node/demo-topic-function', '/record/demo-topic-function',
])];
const selectedRoutes = process.env.UX_TEST_ROUTES?.split(',');
const checkedRoutes = selectedRoutes ? routes.filter(route => selectedRoutes.includes(route)) : routes;
if (!checkedRoutes.length) throw Error('확인할 화면 경로가 없습니다.');

test('every public screen has usable names, contrast and reflow in light, dark and 200% text', async ({ page }, info) => {
  test.setTimeout(600000);
  const findings: unknown[] = [], errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  try {
    for (const mode of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: mode, reducedMotion: 'reduce' });
      for (const route of checkedRoutes) {
        await page.goto(`?space=demo#${route}`);
        await expect(page.locator('.app-shell')).toBeVisible({ timeout: 30000 });
        await expect(page.locator('main h1').first()).toBeVisible();
        await expect(page.getByRole('heading', {name:'이 화면을 열지 못했습니다',exact:true})).toHaveCount(0);
        await expect(page.locator('main [data-ui-loading]')).toHaveCount(0, { timeout: 30000 });
        const normal = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
        const zoomStyle = await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
        await expect.configure({ soft: true }).poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth), { timeout: 5000, message: `${mode} ${route}: 200% page reflow` }).toBeLessThanOrEqual(1);
        const width = await page.evaluate(() => ({ actual: document.documentElement.scrollWidth, available: innerWidth, heading: document.querySelector('main h1')?.textContent, offenders: document.documentElement.scrollWidth > innerWidth + 1 ? [...document.querySelectorAll('main *, header *, .topbar *')].map(el => ({el, rect: el.getBoundingClientRect()})).filter(({rect}) => rect.right > innerWidth + 1 && rect.width > 0).slice(0,40).map(({el,rect}) => ({tag:el.tagName,classes:String(el.className),text:el.textContent?.slice(0,80),width:rect.width,right:rect.right})) : [] }));
        findings.push({ mode, route, width, violations: normal.violations.map(v => ({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))})), incomplete:normal.incomplete.map(v=>v.id) });
        await zoomStyle.evaluate(el => el.remove());
        expect.soft(normal.violations, `${mode} ${route}: accessibility`).toEqual([]);
      }
    }
    expect(errors).toEqual([]);
  } finally {
    await info.attach('all-screen-ux', { body: JSON.stringify({routes:checkedRoutes,findings,errors},null,2),contentType:'application/json' });
  }
});

test('modal keyboard loop, composing Escape, drag cancellation and long draft survive reopening', async ({ page }, info) => {
  await page.goto('?space=demo#/record');
  const open = page.getByRole('button',{name:'학기 추가',exact:true});
  await open.tap();
  const dialog = page.getByRole('dialog',{name:'학기 추가',exact:true});
  const text = `  조건과 예외\n${'긴 원문 '.repeat(200)}  `;
  const name = dialog.getByRole('textbox',{name:'이름',exact:true});
  await name.fill(text.replace(/\n/g, ' '));
  const original = await name.inputValue();
  await dialog.getByRole('button',{name:'학기 추가 닫기',exact:true}).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button',{name:'추가하기',exact:true})).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button',{name:'학기 추가 닫기',exact:true})).toBeFocused();
  await name.dispatchEvent('keydown',{key:'Escape',isComposing:true});
  await expect(dialog).toBeVisible();
  const box=await dialog.boundingBox(); const y=Math.min(box!.y+40,info.project.use.viewport!.height-8);
  await page.mouse.move(box!.x+40,y);await page.mouse.down();await page.mouse.move(2,y,{steps:4});await page.mouse.up();
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');await expect(dialog).toBeHidden();await expect(open).toBeFocused();
  await open.tap();await expect(name).toHaveValue(original);
  await dialog.getByRole('button',{name:'학기 추가 닫기',exact:true}).tap();
});

test('10,000 records retain exact long input, search and saved text through reload', async ({ page },info) => {
  test.setTimeout(180000);
  const state=makeLargeFixture();state.namespace='demo';state.userId='demo-user';
  for(const value of Object.values(state))if(Array.isArray(value))for(const row of value)if(row && typeof row==='object' && 'userId' in row){row.userId='demo-user';row.namespace='demo';}
  const payload=encodeStoredText(JSON.stringify({sequence:0,data:state}));
  await page.addInitScript(({payload})=>{if(!localStorage.getItem('ux-complete:seeded')){localStorage.setItem('study-space:demo:v1',payload);localStorage.setItem('ux-complete:seeded','1');}},{payload});
  const errors: string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error') errors.push(e.text());});
  const began=Date.now();
  await page.goto('?space=demo#/search');
  const loaded=Date.now();
  const search=page.getByRole('searchbox',{name:'과목·목차·기록 검색',exact:true});
  await search.fill('가짜 기록 9999');
  await expect(page.getByText('찾은 항목 1개',{exact:true})).toBeVisible({timeout:30000});
  const searched=Date.now();
  await page.goto('?space=demo#/record/topic-subject-0-0-0');
  const memo=page.getByRole('textbox',{name:'메모',exact:true});
  const original='  누적 자료에서도 남기는 원문\n'+'조건과 예외 · '.repeat(1000)+'  ';
  const editReady=Date.now();
  await memo.fill(original);
  const entered=Date.now();
  await page.getByRole('button',{name:'1개 주제 기록 저장',exact:true}).click();
  await expect(page.getByRole('heading',{name:'최근 남긴 기록',exact:true})).toBeVisible();
  const saved=Date.now();
  await page.reload();
  await expect(page.locator('main h1').first()).toBeVisible({timeout:30000});
  await expect(page.getByText(original,{exact:true})).toBeVisible({timeout:30000});
  const reloaded=Date.now();
  expect(errors).toEqual([]);
  const stored=await page.evaluate(()=>localStorage.getItem('study-space:demo:v1'));
  const persisted=JSON.parse(decodeStoredText(stored!));
  expect(persisted.data.records).toHaveLength(10001);
  for(const row of state.records){
    const saved=persisted.data.records.find((v:{id:string})=>v.id===row.id);
    expect(saved).toEqual(row);
  }
  await info.attach('accumulated-ux',{body:JSON.stringify({records:10000,revisions:10000,nodes:880,characters:original.length,encodedBytes:payload.length,initialNavigationMs:loaded-began,searchEndToEndMs:searched-loaded,recordNavigationMs:editReady-searched,inputFillMs:entered-editReady,saveEndToEndMs:saved-entered,reloadEndToEndMs:reloaded-saved,preservationAssertionMs:Date.now()-reloaded,description:'Synthetic lab timings include navigation and driver overhead; not real-user INP or75th percentile'},null,2),contentType:'application/json'});
});


test('zoomed-out Canvas keeps normal-sized selection and open actions without rewriting saved geometry', async ({ page }) => {
  const state=createDemoState();
  const seeded=applyCommand(state,{type:'saveCanvasLayout',id:'canvas:main',expectedVersion:0,positions:{'subject:demo-subject-math':{x:13.25,y:27.5}},links:[],viewport:{x:5,y:9,zoom:.25},userId:state.userId,namespace:state.namespace,opId:'ux-geometry-seed',at:'2026-10-01T00:00:00Z'});
  const payload=encodeStoredText(JSON.stringify({sequence:1,data:seeded}));
  await page.addInitScript(({payload})=>{if(!localStorage.getItem('ux-geometry:seeded')){localStorage.setItem('study-space:demo:v1',payload);localStorage.setItem('ux-geometry:seeded','1');}},{payload});
  await page.goto('?space=demo#/canvas');
  await expect(page.getByRole('region' ,{name:'목차와 설명 Canvas'})).toBeVisible();
  const selection=page.getByRole('combobox',{name:'조작할 카드',exact:true});
  await selection.selectOption({label:'과목 · 수학의 기초'});
  const open=page.getByRole('link',{name:'선택한 카드 열기 ↗',exact:true});
  const box=await open.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);
  await open.click();await expect(page.locator('main h1')).toHaveText('수학의 기초');
  await page.goBack();await expect(selection).toBeVisible();
  await selection.selectOption({label:'과목 · 수학의 기초'});
  await page.getByRole('group', { name: '카드 선택과 조작', exact: true }).getByRole('button', { name: '선택한 카드 편집', exact: true }).click();
  await expect(page.locator('.canvas-card.is-editing')).toBeVisible();
  const stored=await page.evaluate(()=>localStorage.getItem('study-space:demo:v1'));
  const layout=JSON.parse(decodeStoredText(stored!)).data.canvasLayouts[0];
  expect(layout.positions['subject:demo-subject-math']).toEqual({x:13.25,y:27.5});
  expect(layout.links).toEqual([]);
});

test('personal login and registration expose named fields and accessible labels', async ({page},info)=>{
  await page.goto('?space=personal');
  await expect(page.getByRole('heading',{name:'내 공부 공간',exact:true})).toBeVisible();
  const findings=[];
  for(const mode of ['light','dark'] as const){
    await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});
    await page.evaluate(async()=>{await new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r())));await Promise.all(document.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});
    const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    findings.push({mode,violations:scan.violations});expect.soft(scan.violations).toEqual([]);
  }
  await page.getByRole('button',{name:'처음 사용하기',exact:true}).click();
  await expect(page.getByRole('textbox',{name:'이름',exact:true})).toBeVisible();
  await expect(page.getByRole('textbox',{name:'비밀번호 (6자 이상)',exact:true})).toBeVisible();
  for(const mode of ['light','dark'] as const){
    await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});
    await page.evaluate(async()=>{await new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r())));await Promise.all(document.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});
    const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    findings.push({mode,violations:scan.violations});expect.soft(scan.violations).toEqual([]);
  }
  await info.attach('personal-entry-accessibility' ,{body:JSON.stringify(findings),contentType:'application/json'});
});
