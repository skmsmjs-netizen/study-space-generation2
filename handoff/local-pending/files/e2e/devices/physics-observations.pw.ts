import {test,expect} from '@playwright/test';
const base='/?space=demo&math=physics&physicsSource=local#/math';
const modal=(page:any)=>page.locator('.physics-modal');
const ownStorage=async(page:any)=>page.evaluate(()=>{const key=Object.keys(localStorage).find(k=>k.endsWith(':physics-observations:reading:v1'));return key?JSON.parse(localStorage.getItem(key)!):null;});
test('물리 교재: 읽기·관찰·정확한 입력·원문 복귀·기기 보관',async({page},info)=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await expect(page.getByRole('heading',{name:'물리 교재 관찰',exact:true})).toBeVisible();
  await expect(page.getByLabel('교재의 장').locator('option')).toHaveCount(28);
  const opening=page.getByRole('button',{name:'등가속도 운동 열기',exact:true});await opening.click();
  const dialog=modal(page);await expect(dialog.locator('.physics-plot .main-svg').first()).toBeVisible();await expect(dialog.locator('.physics-plot')).toHaveCount(2);
  const acc=dialog.getByLabel('가속도 정확한 입력',{exact:true});await acc.fill('4');await acc.press('Enter');await expect(dialog.locator('[data-observation-region="readout"]')).toContainText('v=6');
  await dialog.getByLabel('이 기기의 관찰 메모',{exact:true}).fill('조건과 부호를 확인한다.\n한글 메모와 정확값을 보존한다.');
  await dialog.getByRole('button',{name:'전체 관찰로 펼치기',exact:true}).click();await expect(acc).toHaveValue('4');
  await dialog.getByRole('button',{name:'그래프 확대',exact:true}).first().click();await expect.poll(async()=>Boolean((await ownStorage(page))?.views['c3-motion']?.ranges)).toBe(true);
  const ranges=(await ownStorage(page)).views['c3-motion'].ranges;
  await acc.fill('2 +');await acc.press('Enter');await expect(acc).toHaveAttribute('aria-invalid','true');
  expect((await ownStorage(page)).views['c3-motion'].values.a).toBe(4);expect((await ownStorage(page)).views['c3-motion'].ranges).toEqual(ranges);
  await dialog.getByRole('button',{name:'연결된 원문 열기',exact:true}).click();const source=page.locator('.physics-source-modal');await expect(source).toContainText('이전에 추출한 원문');await expect(source.locator('pre')).not.toBeEmpty();
  await source.getByRole('button',{name:'읽던 관찰로 돌아가기',exact:true}).click();await expect(acc).toHaveValue('2 +');
  const overflow=await dialog.evaluate(el=>el.scrollWidth>el.clientWidth+2);expect(overflow).toBe(false);
  await page.screenshot({path:`work/physics-observations-20261003/${info.project.name}.png`,fullPage:false});
  await dialog.getByRole('button',{name:'읽던 절로 돌아가기',exact:true}).click();await expect(dialog).toHaveCount(0);await expect(opening).toBeFocused();
  await page.reload();await page.getByRole('button',{name:'등가속도 운동 열기',exact:true}).click();await expect(modal(page).getByLabel('가속도 정확한 입력',{exact:true})).toHaveValue('2 +');await expect(modal(page).getByLabel('이 기기의 관찰 메모',{exact:true})).toContainText('한글 메모');
  expect((await ownStorage(page)).views['c3-motion'].values.a).toBe(4);expect(errors).toEqual([]);
});
test('조건 판단·기계/전기 감쇠·저장 실패와 재시도',async({page},info)=>{
  await page.goto(base);await page.getByRole('heading',{name:'물리 교재 관찰',exact:true}).waitFor();
  await page.getByLabel('교재의 장').selectOption('6');await page.getByRole('button',{name:'용수철 에너지와 조건 열기',exact:true}).click();let d=modal(page);
  await d.getByLabel('비보존력이 한 순일',{exact:true}).selectOption('unknown');await expect(d.locator('[data-observation-region="readout"]')).toContainText('속력 계산 보류');await d.getByRole('button',{name:'읽던 절로 돌아가기',exact:true}).click();
  await page.getByLabel('교재의 장').selectOption('14');await page.getByRole('button',{name:'감쇠 운동의 세 조건 열기',exact:true}).click();d=modal(page);const b=d.getByLabel('감쇠 계수 정확한 입력',{exact:true});await b.fill('4');await b.press('Enter');await expect(d.locator('[data-observation-region="readout"]')).toContainText('임계 감쇠');await b.fill('5');await b.press('Enter');await expect(d.locator('[data-observation-region="readout"]')).toContainText('과감쇠');
  const saved=await ownStorage(page);await page.evaluate(()=>{const original=Storage.prototype.setItem;(window as any).__physicsRestoreStorage=()=>{Storage.prototype.setItem=original;};Storage.prototype.setItem=function(key:string,value:string){if(key.includes(':physics-observations:'))throw new DOMException('Synthetic quota failure','QuotaExceededError');return original.call(this,key,value);};});
  await d.getByLabel('이 기기의 관찰 메모',{exact:true}).fill('저장 실패에서도 현재 입력을 유지한다.');await expect(page.getByRole('alert').first()).toBeVisible();expect((await ownStorage(page)).views['c14-damped-motion'].memo).toBe(saved.views['c14-damped-motion'].memo);
  await page.evaluate(()=>(window as any).__physicsRestoreStorage());await d.getByRole('button',{name:'보관 다시 시도',exact:true}).click();expect((await ownStorage(page)).views['c14-damped-motion'].memo).toContain('현재 입력');
  await d.getByRole('button',{name:'읽던 절로 돌아가기',exact:true}).click();await page.getByLabel('교재의 장').selectOption('28');await page.getByRole('button',{name:'RLC 자유 감쇠 열기',exact:true}).click();d=modal(page);await expect(d.locator('.physics-plot .main-svg').first()).toBeVisible();await expect(d.locator('[data-observation-region="readout"]')).toContainText('부족 감쇠');await page.screenshot({path:`work/physics-observations-20261003/${info.project.name}-damping.png`});
});
test('자료 곁의 관찰 → 탐구 작업대 전체 관찰 → 실제 읽던 절로 복귀',async({page})=>{
  await page.goto('/?space=demo&physicsSource=local#/materials/physics-principles');await page.getByRole('heading',{name:'물리 교재 관찰',exact:true}).waitFor();await page.getByRole('button',{name:'등가속도 운동 열기',exact:true}).click();const d=modal(page);await d.getByLabel('가속도 정확한 입력',{exact:true}).fill('3');await d.getByLabel('가속도 정확한 입력',{exact:true}).press('Enter');await d.getByRole('button',{name:'탐구 작업대에서 전체 관찰 열기',exact:true}).click();await expect(page).toHaveURL(/#\/math$/);await expect(modal(page).getByLabel('가속도 정확한 입력',{exact:true})).toHaveValue('3');await modal(page).getByRole('button',{name:'읽던 절로 돌아가기',exact:true}).click();await expect(page).toHaveURL(/#\/materials\/physics-principles$/);await expect(page.locator('#physics-section-3\\.5 button').first()).toBeFocused();
});
test('28장과 121개 관찰의 실제 수식·현재 결과·그래프 렌더',async({page},info)=>{
  test.skip(info.project.name!=='iPad-Pro-13-landscape','동일 계산/렌더러 전수 확인은 대표 넓은 화면에서 수행한다.');test.setTimeout(180000);
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);await page.getByRole('heading',{name:'물리 교재 관찰',exact:true}).waitFor();let count=0;
  for(let ch=1;ch<=28;ch++){await page.getByLabel('교재의 장').selectOption(String(ch));await expect(page.locator('.physics-reading .katex-error')).toHaveCount(0);const buttons=page.locator('.physics-observation-list button');const names=await buttons.allTextContents();for(const name of names){await page.getByRole('button',{name,exact:true}).click();await expect(modal(page).locator('.physics-plot .main-svg').first()).toBeVisible();await expect(modal(page).locator('.katex-error')).toHaveCount(0);await expect(modal(page).locator('[data-observation-region="readout"] .katex')).not.toHaveCount(0);await modal(page).getByRole('button',{name:'읽던 절로 돌아가기',exact:true}).click();count++;}}
  expect(count).toBe(121);expect(errors).toEqual([]);
});
