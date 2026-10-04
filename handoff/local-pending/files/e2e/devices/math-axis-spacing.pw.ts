import { test, expect } from '@playwright/test';

test('math numbers span visible axes through fullscreen, zoom and return', async ({page},info) => {
  await page.goto('?space=demo#/math');
  const zoom=page.getByRole('button',{name:'＋ 확대',exact:true});
  await expect(zoom).toBeEnabled({timeout:45000});
  await page.getByRole('button',{name:'그래프 전체화면',exact:true}).tap();
  const coverage=()=>page.locator('.math-flat-scaffold').evaluate(svg=>[...svg.querySelectorAll('[data-axis-labels]')].map(group=>{
    const name=group.getAttribute('data-axis-labels'), axis=svg.querySelector(`[data-axis="${name}"]`)!;
    const a=[Number(axis.getAttribute('x1')),Number(axis.getAttribute('y1'))];
    const b=[Number(axis.getAttribute('x2')),Number(axis.getAttribute('y2'))];
    const dx=b[0]-a[0],dy=b[1]-a[1],size=Math.hypot(dx,dy);
    const labels=[...group.querySelectorAll<SVGForeignObjectElement>('foreignObject')].filter(n=>n.getAttribute('visibility')!=='hidden');
    const along=labels.map(n=>((Number(n.getAttribute('x'))+Number(n.getAttribute('width'))/2-a[0])*dx+(Number(n.getAttribute('y'))+Number(n.getAttribute('height'))/2-a[1])*dy)/(size*size));
    return {size,spread:along.length>1?Math.max(...along)-Math.min(...along):0,opacity:Number(group.getAttribute('opacity')),step:Number(group.getAttribute('data-tick-step')),values:labels.map(n=>n.dataset.tex)};
  }));
  await expect.poll(async()=>{
    const rows=await coverage();return rows.some(row=>row.size>=180&&row.opacity>.98&&row.spread>.45);
  }).toBe(true);
  const before=await coverage();
  for(const row of before)expect(row.values.every(v=>/^-?\d+$/.test(v??''))).toBe(true);
  for(let i=0;i<6;i++)await zoom.tap();
  await expect.poll(async()=> (await coverage()).some((row,i)=>row.step<before[i].step)).toBe(true);
  await page.getByRole('button',{name:'전체화면 닫기',exact:true}).tap();
  await expect(page.getByRole('button',{name:'그래프 전체화면',exact:true})).toBeFocused();
  await page.getByLabel('그래프 도구',{exact:true}).selectOption('plotly');
  await expect(zoom).toBeEnabled({timeout:45000});
  await page.getByRole('button',{name:'그래프 전체화면',exact:true}).tap();
  const values=()=>page.locator('.math-plot').evaluate(node=>{
    const plot=node as HTMLElement & {data:Array<{name?:string;mode?:string;opacity?:number;text?:string[];x:number[];y:number[];z:number[]}>};
    return plot.data.filter(t=>t.name?.endsWith('축 눈금값')).map((t,i)=>({opacity:t.opacity,values:t.text??[],at:[t.x,t.y,t.z][i]}));
  });
  await expect.poll(async()=> (await values()).every(t=>(t.opacity??0)>.98&&t.values.length>1)).toBe(true);
  for(const row of await values()){
    expect(row.values.every(v=>/^-?\d+$/.test(v))).toBe(true);
    expect(row.at.some(v=>v<0)).toBe(true);expect(row.at.some(v=>v>0)).toBe(true);
  }
  if(info.project.name==='iPad-Pro-13-landscape')await page.screenshot({path:'work/math-fullscreen-20261003/axis-spacing.png'});
});
