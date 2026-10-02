import {test,expect,type Locator} from '@playwright/test';
async function orangePixels(page:any,plot:Locator){
 const box=await plot.boundingBox();
 const png=await plot.screenshot();
 const scene=await plot.evaluate((e:any)=>e.layout.scene);
 return page.evaluate(async({base64,cssWidth,cssHeight,scene}:any)=>{
  const img=new Image();img.src='data:image/png;base64,'+base64;await img.decode();
  const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
  const ctx=c.getContext('2d')!;ctx.drawImage(img,0,0);const a=ctx.getImageData(0,0,c.width,c.height).data;
  let min=c.width,max=0,center=0;
  const scale=c.width/cssWidth,cx=(cssWidth-12)/2*scale,cy=cssHeight/2*scale;
  for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
   const i=(y*c.width+x)*4;if(Math.abs(a[i]-194)<25&&Math.abs(a[i+1]-65)<25&&Math.abs(a[i+2]-12)<25){min=Math.min(min,x);max=Math.max(max,x);if(Math.abs(x-cx)<7*scale&&Math.abs(y-cy)<7*scale)center++;}
  }
  const camera=scene.camera, center3=['x','y','z'].map(k=>camera.center?.[k]??0);
  const unit=(v:number[])=>{const n=Math.hypot(...v);return v.map(x=>x/n)};
  const cross=(a:number[],b:number[])=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const dot=(a:number[],b:number[])=>a.reduce((n,v,i)=>n+v*b[i],0);
  const direction=unit(['x','y','z'].map((k,i)=>camera.eye[k]-center3[i]));
  const right=unit(cross(['x','y','z'].map(k=>camera.up[k]),direction)),up=cross(direction,right);
  let projected=0,hits=0;
  for(let j=0;j<1000;j++){
   const t=8*Math.PI*j/999,p=[2*Math.cos(t),2*Math.sin(t),.5*t];
   const q=p.map((v,i)=>{const k=['x','y','z'][i],r=scene[k+'axis'].range;return (v-(r[0]+r[1])/2)*scene.aspectratio[k]/(r[1]-r[0])-center3[i]});
   const px=cx+dot(q,right)*cssHeight/2*scale,py=cy-dot(q,up)*cssHeight/2*scale;
   if(px<12*scale||px>c.width-20*scale||py<12*scale||py>c.height-12*scale)continue;
   projected++;let hit=false;
   for(let y=Math.round(py-3*scale);y<=py+3*scale&&!hit;y++)for(let x=Math.round(px-3*scale);x<=px+3*scale;x++){
    const i=(y*c.width+x)*4;if(Math.abs(a[i]-194)<35&&Math.abs(a[i+1]-65)<35&&Math.abs(a[i+2]-12)<35){hit=true;break;}
   }
   if(hit)hits++;
  }
  return {span:(max-min)/scale,center,projected,coverage:projected?hits/projected:0};
 },{base64:png.toString('base64'),cssWidth:box!.width,cssHeight:box!.height,scene});
}
const state=(plot:Locator)=>plot.evaluate((e:any)=>({camera:e.layout.scene.camera,point:e.data.find((d:any)=>d.name==='현재 점'),axes:['x','y','z'].map(k=>({range:e.layout.scene[k+'axis'].range,aspect:e.layout.scene.aspectratio[k]})),vectors:e.layout.scene.annotations.filter((a:any)=>['T','N','B'].includes(a.text))}));
const offset=(c:any)=>['x','y','z'].map(k=>c.eye[k]-(c.center?.[k]??0));
async function centered(plot:Locator){
 await expect.poll(async()=>{const s=await state(plot);return Math.max(...['x','y','z'].map((k,i)=>Math.abs((s.point[k][0]-(s.axes[i].range[0]+s.axes[i].range[1])/2)*s.axes[i].aspect/(s.axes[i].range[1]-s.axes[i].range[0])-s.camera.center[k])));}).toBeLessThan(1e-8);
}
test('point close-up follows the cursor, retains manual angle/zoom, restores and reloads the prior view',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('?space=demo#/math');await page.getByLabel('탐색할 내용',{exact:true}).selectOption('templates');
 const dialog=page.getByRole('dialog');await page.getByLabel('전체 화면의 내용',{exact:true}).selectOption('builtin-curve');
 const plot=dialog.locator('.math-plot'),ready=()=>expect(dialog.getByRole('button',{name:'＋ 확대',exact:true})).toBeEnabled({timeout:45000});
 await ready();await expect(plot).toHaveAttribute('data-world-grid','unbounded',{timeout:45000});
 const t=dialog.getByRole('textbox',{name:'t 위치 값',exact:true}),originalT=await t.inputValue();
 await dialog.getByLabel('바라보는 방향',{exact:true}).selectOption('front');
 const beforePixels=await orangePixels(page,plot);
 for(let i=0;i<3;i++)await dialog.getByRole('button',{name:'＋ 확대',exact:true}).tap();
 await expect.poll(async()=>{const s=await state(plot);return s.axes[0].aspect/(s.axes[0].range[1]-s.axes[0].range[0]);}).toBeGreaterThan(0);
 await expect.poll(async()=>(await orangePixels(page,plot)).span/beforePixels.span).toBeGreaterThan(1.25);
 expect((await orangePixels(page,plot)).span/beforePixels.span).toBeLessThan(1.42);
 await dialog.getByRole('button',{name:'오른쪽으로 회전',exact:true}).tap();
 const overview=(await state(plot)).camera;
 await dialog.getByRole('button',{name:'점 가까이 보기',exact:true}).tap();
 await expect(dialog.getByRole('button',{name:'이전 시야로',exact:true})).toHaveAttribute('aria-pressed','true');
 await centered(plot);await expect.poll(async()=>(await orangePixels(page,plot)).center).toBeGreaterThan(5);expect(Math.hypot(...offset((await state(plot)).camera))).toBeCloseTo(500,6);
 await expect(t).toHaveValue(originalT);
 await expect.poll(async()=>{const s=await state(plot);return s.vectors.length===3 && s.vectors.every((a:any)=>a.visible&&Math.hypot(a.ax,a.ay)>30&&Math.hypot(a.ax,a.ay)<81)}).toBe(true);
 // Check real drawn SVG glyphs and point-origin arrows within the canvas, not just camera values.
 await expect.poll(()=>plot.locator('.annotation-scene').count()).toBeGreaterThanOrEqual(3);
 await expect.poll(async()=>(await orangePixels(page,plot)).coverage).toBeGreaterThan(.9);
 await plot.scrollIntoViewIfNeeded();await page.screenshot({path:info.outputPath('point-close.png')});
 await dialog.getByRole('button',{name:'＋ 확대',exact:true}).tap();
 await dialog.getByRole('button',{name:'오른쪽으로 회전',exact:true}).tap();
 await centered(plot);const close=(await state(plot)).camera,priorOffset=offset(close);
 await t.fill('20');await t.press('Tab');await expect(t).toHaveValue('20.00');await centered(plot);
 await expect.poll(async()=>(await orangePixels(page,plot)).center).toBeGreaterThan(5);
 const followed=(await state(plot)).camera;
 for(let i=0;i<3;i++)expect(offset(followed)[i]).toBeCloseTo(priorOffset[i],8);
 expect(followed.center).not.toEqual(close.center);
 await page.reload();await ready();await expect(dialog.getByRole('button',{name:'이전 시야로',exact:true})).toBeVisible();await centered(plot);
 expect(JSON.parse(JSON.stringify((await state(plot)).camera,(_k,v)=>typeof v==='number'?Number(v.toFixed(7)):v))).toEqual(JSON.parse(JSON.stringify(followed,(_k,v)=>typeof v==='number'?Number(v.toFixed(7)):v)));await expect(t).toHaveValue('20.00');
 await dialog.getByRole('button',{name:'이전 시야로',exact:true}).tap();
 await expect.poll(async()=>JSON.stringify((await state(plot)).camera,(_k,v)=>typeof v==='number'?Number(v.toFixed(7)):v)).toBe(JSON.stringify(overview,(_k,v)=>typeof v==='number'?Number(v.toFixed(7)):v));
 await t.fill('8');await t.press('Tab');await expect(t).toHaveValue('8.00');expect(JSON.stringify((await state(plot)).camera,(_k,v)=>typeof v==='number'?Number(v.toFixed(7)):v)).toBe(JSON.stringify(overview,(_k,v)=>typeof v==='number'?Number(v.toFixed(7)):v));
 await dialog.getByRole('button',{name:'점 가까이 보기',exact:true}).tap();await centered(plot);
 await dialog.getByRole('button',{name:'보기 초기화',exact:true}).tap();await expect(dialog.getByRole('button',{name:'점 가까이 보기',exact:true})).toHaveAttribute('aria-pressed','false');
 expect((await state(plot)).camera.center??{x:0,y:0,z:0}).toEqual({x:0,y:0,z:0});
 expect(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);expect(errors).toEqual([]);
});
test('legacy formula explorer retains the same focused view after reload',async({page},info)=>{
 test.skip(info.project.name!=='iPad-Pro-13-half-window');
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('?space=demo#/math');await page.getByLabel('그래프 도구',{exact:true}).selectOption('plotly');
 const plot=page.locator('.math-plot:visible');await expect(page.getByRole('button',{name:'점 가까이 보기',exact:true})).toBeEnabled({timeout:45000});
 const overview=(await state(plot)).camera;
 await page.getByRole('button',{name:'점 가까이 보기',exact:true}).tap();await centered(plot);
 const t=page.getByRole('textbox',{name:'t 값',exact:true});await t.fill('8');await t.press('Tab');await expect(t).toHaveValue('8.00');await centered(plot);
 const view=(await state(plot)).camera;
 await page.reload();await expect(page.getByRole('button',{name:'이전 시야로',exact:true})).toBeEnabled({timeout:45000});await centered(plot);
 const quantize=(v:any)=>JSON.stringify(v,(_k,x)=>typeof x==='number'?Number(x.toFixed(7)):x);
 expect(quantize((await state(plot)).camera)).toBe(quantize(view));await expect(t).toHaveValue('8.00');
 await page.getByRole('button',{name:'이전 시야로',exact:true}).tap();await expect.poll(async()=>quantize((await state(plot)).camera)).toBe(quantize(overview));
 expect(errors).toEqual([]);
});
test('surface zoom magnifies geometry without changing sampled formula or the view direction',async({page},info)=>{
 test.skip(info.project.name!=='iPad-Pro-13-half-window');
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('?space=demo#/math');await page.getByLabel('탐색할 내용',{exact:true}).selectOption('templates');
 const dialog=page.getByRole('dialog'),plot=dialog.locator('.math-plot');await expect(dialog.getByRole('button',{name:'＋ 확대',exact:true})).toBeEnabled({timeout:45000});
 const details=()=>plot.evaluate((e:any)=>({ratio:e.layout.scene.aspectratio.x/(e.layout.scene.xaxis.range[1]-e.layout.scene.xaxis.range[0]),camera:e.layout.scene.camera,z:e.data.find((d:any)=>d.type==='surface').z}));
 const before=await details();
 for(let i=0;i<3;i++)await dialog.getByRole('button',{name:'＋ 확대',exact:true}).tap();
 await expect.poll(async()=>(await details()).ratio/before.ratio).toBeCloseTo(1.1**3,6);
 const after=await details();expect(after.z).toEqual(before.z);expect(Math.hypot(...offset(after.camera))).toBeCloseTo(500,6);
 await page.reload();await expect(dialog.getByRole('button',{name:'＋ 확대',exact:true})).toBeEnabled({timeout:45000});
 await expect.poll(async()=>(await details()).ratio).toBeCloseTo(after.ratio,8);expect(errors).toEqual([]);
});
