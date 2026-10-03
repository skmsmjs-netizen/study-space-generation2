import {test,expect} from '@playwright/test';
import {fileURLToPath} from 'node:url';
import {readFileSync,writeFileSync} from 'node:fs';
const axe=readFileSync(new URL('./node_modules/axe-core/axe.min.js',import.meta.url),'utf8');
const url='/study-space-generation2/?space=demo';
const note='컬러 배포 확인용 합성 기록입니다. 이유와 예외를 보존합니다.\n줄바꿈과 한국어 원문도 그대로 남습니다.';
async function overflow(page){return page.evaluate(()=>{
 const describe=e=>{const b=e.getBoundingClientRect(),s=getComputedStyle(e);return{tag:e.tagName,className:e.getAttribute('class'),left:b.left,right:b.right,width:b.width,clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,minWidth:s.minWidth,grid:s.gridTemplateColumns,overflow:s.overflow,contain:s.contain,transform:s.transform,position:s.position,clip:s.clipPath};};
 const width=innerWidth,scrollWidth=document.documentElement.scrollWidth;
 if(scrollWidth<=width+1)return{width,scrollWidth};
 const all=Array.from(document.querySelectorAll('body *'));
 return{width,scrollWidth,root:describe(document.documentElement),body:describe(document.body),graphBusy:document.querySelector('.study-graph [role="status"]')?.textContent,overflows:all.filter(e=>{const b=e.getBoundingClientRect();return(b.right>width+1&&b.width>0)||(e.clientWidth>0&&e.scrollWidth>e.clientWidth+1);}).map(e=>({ ...describe(e),ancestors:Array.from((function*(x){for(let p=x.parentElement;p;p=p.parentElement)yield p;})(e)).map(describe)}))};
 });}
async function theme(page,value){
 let summary=page.locator('.workspace-tools > summary');
 if(!await summary.isVisible())summary=page.locator('.compact-menu > summary');
 const details=summary.locator('..');
 if(await details.getAttribute('open')===null)await summary.click();
 await details.getByRole('combobox',{name:'화면 밝기',exact:true}).selectOption(value);
 await expect.poll(()=>page.evaluate(()=>document.documentElement.dataset.theme||'auto')).toBe(value);
 await summary.click();
}
async function contrast(page,selector){
 // Wait for the audited route fade; unrelated animation players can stay paused.
 await page.locator(selector).evaluate(async root=>{
  const routes=[root,...root.querySelectorAll('main')];
  const finite=routes.flatMap(el=>el.getAnimations()).filter(a=>a.playState==='running'&&a.playbackRate>0&&Number.isFinite(a.effect?.getComputedTiming().endTime));
  await Promise.all(finite.map(a=>a.finished.catch(()=>{})));
 });
 await page.addScriptTag({content:axe});
 const a=await page.evaluate(async scope=>{const x=await axe.run(scope,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return{violations:x.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),passedNodes:x.passes.flatMap(v=>v.nodes).length,incomplete:x.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))};},selector);
 expect(a.violations).toEqual([]);return a;
}
test('released app themes, routes and saved Korean text',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const result=[];
 await page.goto(url+'#/record/demo-topic-function');await expect(page.getByRole('heading',{name:'공부 기록',exact:true})).toBeVisible();
 for(const [setting,scheme,dark] of [['light','light',false],['dark','light',true],['auto','dark',true],['auto','light',false]]){
  await page.goto(url+'#/record/demo-topic-function');await expect(page.getByRole('heading',{name:'공부 기록',exact:true})).toBeVisible();
  await page.emulateMedia({colorScheme:scheme});await theme(page,setting);
  const metrics=await page.evaluate(()=>({background:getComputedStyle(document.body).backgroundColor,text:getComputedStyle(document.body).color}));
  expect(metrics.background).toBe(dark?'rgb(32, 32, 32)':'rgb(250, 250, 250)');
  await page.reload();await expect(page.getByRole('heading',{name:'공부 기록',exact:true})).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>document.documentElement.dataset.theme||'auto')).toBe(setting);
  for(const route of ['#/record/demo-topic-function','#/','#/memos','#/graph','#/board','#/statistics']){
   await page.goto(url+route);await expect(page.locator('main').first()).toBeVisible();await expect(page.locator('main').first()).not.toHaveText('');
   if(route==='#/statistics'){
    // The statistics page remembers its chart kind; choose the keyboard bars explicitly.
    await page.getByRole('region',{name:'기간별 통계 그래프',exact:true}).getByRole('combobox',{name:'그래프 종류',exact:true}).selectOption('column');
    const bar=page.getByRole('group',{name:/정확한 날짜가 있는 기록의 변화/}).getByRole('button').first();
    await bar.focus();await bar.press('Enter');
    await expect(page.getByRole('dialog',{name:'통계의 원기록',exact:true})).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog',{name:'통계의 원기록',exact:true})).not.toBeVisible();
    await expect(bar).toBeFocused();
   }
   await expect(page.locator('main [data-ui-loading]')).toHaveCount(0,{timeout:30000});
   if(route==='#/graph'){
    await expect(page.locator('.graph-stage')).toHaveAttribute('aria-busy','false');
    // Audit the completed layout, after its queued viewport fit has painted.
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   }
   const width=await overflow(page);if(width.overflows)writeFileSync(new URL('./'+info.project.name+'-overflow-app.json',import.meta.url),JSON.stringify({route,...width},null,2));expect(width.scrollWidth,route).toBeLessThanOrEqual(width.width+1);
   result.push({setting,scheme,route,...width,...await contrast(page,'#root')});
   if(route.startsWith('#/record')&&setting!=='auto')await page.screenshot({path:fileURLToPath(new URL('./'+info.project.name+'-'+setting+'.png',import.meta.url)),fullPage:true});
  }
 }
 await page.goto(url+'#/record/demo-topic-function');await theme(page,'light');
 await page.getByRole('textbox',{name:'메모',exact:true}).fill(note);
 const original=page.viewportSize();await page.setViewportSize({width:original.width>640?517:756,height:original.height});
 await expect(page.getByRole('textbox',{name:'메모',exact:true})).toHaveValue(note);
 await page.setViewportSize(original);await page.getByRole('button',{name:'1개 주제 기록 저장',exact:true}).click();
 await expect(page.locator('main')).toContainText('컬러 배포 확인용 합성 기록입니다.');await page.reload();
 await expect(page.locator('main')).toContainText(note);
 expect(errors).toEqual([]);
 writeFileSync(new URL('./'+info.project.name+'-app.json',import.meta.url),JSON.stringify({project:info.project.name,result,errors,syntheticNoteSavedAndReopened:true},null,2));
});
test('shared input, focus, error, selection and buttons in both themes',async({page},info)=>{
 const result=[];await page.goto('/color-check.html');
 await expect(page.getByRole('heading',{name:'중립색과 브랜드 · 실제 공통 UI',exact:true})).toBeVisible();
 for(const setting of ['light','dark']){
  await page.getByRole('combobox',{name:'검토 화면 밝기'}).selectOption(setting);
  await expect.poll(()=>page.evaluate(()=>document.documentElement.dataset.theme)).toBe(setting);
  await page.getByRole('textbox',{name:'긴 한국어 입력',exact:true}).fill(note);
  await page.getByRole('checkbox',{name:'공부를 시도함 · 완전 이해나 정답을 뜻하지 않음',exact:true}).check();
  await page.getByRole('tab',{name:'자유 글·이유·예외',exact:true}).click();
  await expect(page.getByRole('tab',{name:'자유 글·이유·예외',exact:true})).toHaveAttribute('aria-selected','true');
  await page.getByRole('textbox',{name:'긴 한국어 입력',exact:true}).focus();
  const width=await overflow(page);expect(width.scrollWidth).toBeLessThanOrEqual(width.width+1);
  const fields=await page.locator('#color-fixture').evaluate(e=>Array.from(e.querySelectorAll('input,textarea')).map(x=>({font:getComputedStyle(x).fontSize,border:getComputedStyle(x).borderTopColor,invalid:x.getAttribute('aria-invalid'),placeholder:getComputedStyle(x,'::placeholder').color,background:getComputedStyle(x).backgroundColor})));
  for(const f of fields)if(!f.invalid||f.font)expect(parseFloat(f.font)).toBeGreaterThanOrEqual(16);
  result.push({setting,...width,fields,...await contrast(page,'#color-fixture')});
  await page.screenshot({path:fileURLToPath(new URL('./'+info.project.name+'-fields-'+setting+'.png',import.meta.url)),fullPage:true});
 }
 writeFileSync(new URL('./'+info.project.name+'-fields.json',import.meta.url),JSON.stringify(result,null,2));
});
