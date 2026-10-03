import {test,expect} from '@playwright/test';
import {decodeStoredText} from '../../src/data/storage-codec';

import fs from 'node:fs';
import path from 'node:path';
const catalog=JSON.parse(fs.readFileSync(path.resolve('src/domain/linear-algebra-catalog.json'),'utf8')) as {concepts:{id:string;kind:string}[]};
test('선형대수 확장 · 모든 새 계산틀·수식·긴 보조 입력·배치',async({page},info)=>{
  await page.goto('/?space=demo#/math');await page.getByRole('combobox',{name:'탐색할 내용',exact:true}).selectOption('linear');
  const concept=page.getByRole('combobox',{name:'살펴볼 개념',exact:true}),scope=page.getByRole('region',{name:'선형대수 교재와 관찰',exact:true});
  for(const kind of [...new Set(catalog.concepts.map(c=>c.kind))].filter(k=>k!=='static')){
    const c=catalog.concepts.find(x=>x.kind===kind)!;expect(c,kind).toBeTruthy();await concept.selectOption(c.id);
    await expect(scope.locator('[data-observation-region="visual"] .katex').first()).toBeVisible();await expect(scope.locator('.katex-error')).toHaveCount(0);await expect(scope.getByRole('alert')).toHaveCount(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),kind).toBe(true);
  }
  await concept.selectOption('1:CB');const aux=scope.getByRole('textbox',{name:'기저 C와 고정 벡터 x · ---로 분리',exact:true});await aux.fill('1 0\n0 1\n---\n4\n3');await scope.getByRole('button',{name:'보조 입력 적용',exact:true}).click();
  await aux.fill('미확정 입력');await scope.getByRole('button',{name:'보조 입력 적용',exact:true}).click();await expect(scope.getByRole('alert')).toBeVisible();await expect(aux).toHaveValue('미확정 입력');
  await page.reload();await expect(aux).toHaveValue('미확정 입력');await expect(scope.locator('[data-observation-region="visual"] .katex').first()).toBeVisible();
  await concept.selectOption('4:TRI');await scope.getByRole('combobox',{name:'분해 방식',exact:true}).selectOption('schur');await expect(scope.getByRole('alert')).toHaveCount(0);await page.reload();await expect(scope.getByRole('combobox',{name:'분해 방식',exact:true})).toHaveValue('schur');
  const matrix=scope.getByRole('textbox',{name:'행렬 A · 행마다 줄바꿈',exact:true});await matrix.fill('0 -1\n1 0');await scope.getByRole('button',{name:'행렬 적용',exact:true}).click();await expect(scope.getByRole('alert').filter({hasText:'실수 고유값 조건'})).toBeVisible();
  await expect(matrix).toHaveValue('0 -1\n1 0');await scope.getByRole('combobox',{name:'분해 방식',exact:true}).selectOption('hessenberg');await scope.getByRole('button',{name:'행렬 적용',exact:true}).click();await expect(scope.getByRole('alert')).toHaveCount(0);
  await page.screenshot({path:path.resolve('work/linear-algebra-observations-20261003',`${info.project.name}-extended-hessenberg.png`)});
});
test('선형대수 영상 · 원파일 기기 보존·회색 표본·저계수·재접속',async({page})=>{
  await page.goto('/?space=demo#/math');await page.getByRole('combobox',{name:'탐색할 내용',exact:true}).selectOption('linear');await page.getByRole('combobox',{name:'살펴볼 개념',exact:true}).selectOption('6:COMP');
  const scope=page.getByRole('region',{name:'선형대수 교재와 관찰',exact:true});
  await scope.getByLabel('영상 연결 · 원파일은 이 기기에 보관',{exact:true}).setInputFiles({name:'합성8x4.png',mimeType:'image/png',buffer:fs.readFileSync(path.resolve('e2e/fixtures/linear-algebra/synthetic-image.png'))});
  await expect(scope.getByRole('img',{name:'연결한 원영상 · 원래 색과 종횡비',exact:true})).toBeVisible();await expect(scope.locator('.linear-image-pixels').first()).toHaveAttribute('width','8');await expect(scope.locator('.linear-image-pixels').first()).toHaveAttribute('height','4');
  await expect(scope.getByRole('alert')).toHaveCount(0);const n=scope.getByRole('textbox',{name:'유지한 방향 수 k · 정확한 값',exact:true});await n.fill('2');await n.press('Enter');await page.reload();await expect(n).toHaveValue('2');await expect(scope.getByRole('img',{name:'연결한 원영상 · 원래 색과 종횡비',exact:true})).toBeVisible();await expect(scope.locator('.linear-image-pixels').last()).toHaveAttribute('width','8');
  await scope.getByLabel('영상 연결 · 원파일은 이 기기에 보관',{exact:true}).setInputFiles({name:'bad.png',mimeType:'image/png',buffer:Buffer.from('broken image')});await expect(scope.getByRole('alert')).toBeVisible();await expect(scope.getByRole('img',{name:'연결한 원영상 · 원래 색과 종횡비',exact:true})).toBeVisible();await expect(n).toHaveValue('2');
});

test('선형대수 원문 인덱스 · 정의 검색·정확 위치·조건과 모형 변경',async({page})=>{
  await page.goto('/?space=demo#/math');await page.getByRole('combobox',{name:'탐색할 내용',exact:true}).selectOption('linear');
  await page.getByText('원문 항목별 연결 펼치기',{exact:true}).click();await page.getByRole('textbox',{name:'원문 항목 찾기',exact:true}).fill('극분해');
  await expect(page.getByText('극분해',{exact:true})).toBeVisible();await page.getByRole('button',{name:'특이값 분해 관찰로',exact:true}).click();
  await expect(page.getByRole('combobox',{name:'살펴볼 개념',exact:true})).toHaveValue('6:SVD');
  await page.getByRole('combobox',{name:'살펴볼 개념',exact:true}).selectOption('3:MODEL');await page.getByRole('combobox',{name:'관찰 방식',exact:true}).selectOption('logarithmic');
  await expect(page.getByRole('textbox',{name:'다항식 차수 · 정확한 값',exact:true})).toHaveCount(0);await expect(page.getByRole('alert')).toHaveCount(0);
  const matrix=page.getByRole('textbox',{name:'자료 표본 · 각 행에 x y',exact:true});await matrix.fill('0 1\n1 2');await page.getByRole('button',{name:'행렬 적용',exact:true}).click();await expect(page.getByRole('alert').filter({hasText:'양수'})).toBeVisible();await page.reload();await expect(matrix).toHaveValue('0 1\n1 2');
  await page.getByRole('combobox',{name:'살펴볼 개념',exact:true}).selectOption('3:FUNC');await page.getByRole('combobox',{name:'관찰 방식',exact:true}).selectOption('best');await expect(page.getByRole('textbox',{name:'최선근사 다항식 차수 · 정확한 값',exact:true})).toBeVisible();await expect(page.getByRole('alert')).toHaveCount(0);
});

test('이전 버전의 관찰 · 같은 ID의 입력·메모·시야를 확장 관찰과 분리 보존',async({page})=>{
 const old={params:{t:2.5,n:4},inputs:{t:'1/'},matrix:'1 1 3\n2 -1 0',matrixDraft:'1 1 3\n2 -1 0',step:0,memo:'이전 관찰 메모',view:{ranges:{x:[-2,2],y:[-3,3]}}};
 await page.addInitScript(old=>{if(!localStorage.getItem('linear-compat-fixture')){localStorage.setItem('linear-compat-fixture','1');localStorage.setItem('study-space:demo:linear-algebra:view:v1',JSON.stringify({version:1,selected:'0:T',readings:{'0:T':old},query:''}));}},old);
 await page.goto('/?space=demo#/math');await page.getByRole('combobox',{name:'탐색할 내용',exact:true}).selectOption('linear');
 const choice=page.getByRole('combobox',{name:'이 개념의 관찰',exact:true});await expect(choice).toHaveValue('previous');
 const t=page.getByRole('textbox',{name:'배율 t · 정확한 값',exact:true});await expect(t).toHaveValue('1/');
 await choice.selectOption('current');await expect(page.getByRole('alert')).toHaveCount(0);
 const matrix=page.getByRole('textbox',{name:'행렬 A · 행마다 줄바꿈',exact:true});await expect(matrix).toHaveValue('1 0 0\n0 1 0\n0 0 1');
 await matrix.fill('2 0 0\n0 1 0\n0 0 1');await page.getByRole('button',{name:'행렬 적용',exact:true}).click();await page.getByRole('textbox',{name:'관찰 메모',exact:true}).fill('확장 관찰 메모');
 // Reload must not reset the fixture: write it only on its first visit.
 await page.reload();await expect(choice).toHaveValue('current');await expect(matrix).toHaveValue('2 0 0\n0 1 0\n0 0 1');
 await expect(page.getByRole('textbox',{name:'관찰 메모',exact:true})).toHaveValue('확장 관찰 메모');
 await choice.selectOption('previous');await expect(t).toHaveValue('1/');await expect(page.getByRole('textbox',{name:'관찰 메모',exact:true})).toHaveValue('이전 관찰 메모');
 const saved=JSON.parse(decodeStoredText(await page.evaluate(()=>localStorage.getItem('study-space:demo:linear-algebra:view:v1')!)));expect(saved.readings['0:T']).toEqual(old);expect(saved.variants['0:T'].memo).toBe('확장 관찰 메모');
});
