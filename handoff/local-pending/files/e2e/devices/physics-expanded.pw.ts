import {test,expect} from '@playwright/test';
const reading=(page:any)=>page.locator('.physics-reading-modal');
const saved=async(page:any)=>page.evaluate(()=>{const k=Object.keys(localStorage).find(k=>k.endsWith(':physics-observations:reading:v1'));return k?JSON.parse(localStorage.getItem(k)!):null;});
test('절의 관계 선택·원문 쪽·메모와 조건은 재접속과 원문 실패에서 유지된다',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/?space=demo&math=physics&physicsSection=27.7&physicsSource=local#/math');const d=reading(page);
 await expect(d.getByRole('heading',{name:'대상과 조건의 비교',exact:true})).toBeVisible();await expect(d.locator('.katex-error')).toHaveCount(0);await expect(d.locator('pre')).not.toBeEmpty();
 await d.getByRole('button',{name:'자기장 순환',exact:true}).click();await expect(d.getByRole('button',{name:'자기장 순환',exact:true})).toHaveAttribute('aria-pressed','true');
 await d.getByLabel('이 절의 조건·관계 메모',{exact:true}).fill('총장과 두 순환식을 구별한다.\n아직 적용 조건은 미확인이다.');await d.getByLabel('이 절에서 적용할 조건 확인',{exact:true}).selectOption('unknown');
 await d.getByRole('button',{name:'이 절의 뒤쪽',exact:true}).click();const p=(await saved(page)).readings['27.7'].page;
 await page.reload();await expect(reading(page).getByLabel('이 절 원문 PDF 페이지',{exact:true})).toHaveValue(String(p));await expect(reading(page).getByLabel('이 절의 조건·관계 메모',{exact:true})).toContainText('총장');await expect(reading(page).getByRole('button',{name:'자기장 순환',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.route('**/__physics/page/**',r=>r.fulfill({status:503,body:'source unavailable'}));await reading(page).getByRole('button',{name:'이 절의 뒤쪽',exact:true}).click();await expect(reading(page)).toContainText('불러오지 못했다');await expect(reading(page).getByLabel('이 절의 조건·관계 메모',{exact:true})).toContainText('총장');await page.unroute('**/__physics/page/**');await reading(page).getByRole('button',{name:'원문 다시 불러오기',exact:true}).click();await expect(reading(page).locator('pre')).not.toBeEmpty();
 expect(await reading(page).evaluate(el=>el.scrollWidth>el.clientWidth+2)).toBe(false);await page.screenshot({path:`work/physics-observations-20261003/${info.project.name}-reading.png`});expect(errors).toEqual([]);
});
test('읽기 관찰에서 계산을 열고 닫으면 원문 위치·선택·메모로 복귀한다',async({page})=>{
 await page.goto('/?space=demo&math=physics&physicsSection=23.3&physicsSource=local#/math');const r=reading(page);await expect(r.locator('pre')).not.toBeEmpty();await r.getByLabel('이 절의 조건·관계 메모',{exact:true}).fill('전원 연결 여부를 비교한다.');const open=r.getByRole('button',{name:'계산 관찰 열기 · 유전체 삽입 · 전하 고정',exact:true});await open.click();const d=page.locator('.physics-modal').filter({has:page.getByLabel('유전상수 정확한 입력',{exact:true})});await expect(d.locator('.physics-plot .main-svg').first()).toBeVisible();await d.getByLabel('유전상수 정확한 입력',{exact:true}).fill('4');await d.getByLabel('유전상수 정확한 입력',{exact:true}).press('Enter');await d.getByRole('button',{name:'읽던 원문 관찰로 돌아가기',exact:true}).click();await expect(open).toBeFocused();await expect(r.getByLabel('이 절의 조건·관계 메모',{exact:true})).toHaveValue('전원 연결 여부를 비교한다.');
});
test('167절 모두에서 원문 읽기와167개 구조 해설을 누락 없이 연다',async({page},info)=>{
 test.skip(info.project.name!=='iPad-Pro-13-landscape','절 전수 열람은 대표 넓은 화면에서 확인한다.');test.setTimeout(180000);
 await page.goto('/?space=demo&math=physics&physicsSource=local#/math');await page.getByRole('heading',{name:'물리 교재 관찰',exact:true}).waitFor();let count=0,concepts=0;
 for(let ch=1;ch<=28;ch++){
  await page.getByLabel('교재의 장').selectOption(String(ch));const buttons=page.getByRole('button',{name:'이 절의 관찰과 원문 읽기',exact:true});const size=await buttons.count();
  for(let i=0;i<size;i++){await buttons.nth(i).click();const d=reading(page);await expect(d.locator('pre')).not.toBeEmpty();await expect(d.locator('.katex-error')).toHaveCount(0);if(await d.getByRole('heading',{name:/^(대상과 조건의 비교|과정과 근거)$/}).count())concepts++;await d.getByRole('button',{name:'읽던 절로 돌아가기',exact:true}).click();count++;}
 }
 expect(count).toBe(167);expect(concepts).toBe(167);
});
