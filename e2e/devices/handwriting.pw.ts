import { test, expect, type Page } from '@playwright/test';

async function showPaper(page: Page) {
  const viewport = page.locator('.ink-pad-paper');
  await viewport.scrollIntoViewIfNeeded();
  // Keep native pointer gestures inside the clipped paper in short landscape windows.
  await viewport.evaluate(element => { element.scrollTop = 0; element.scrollLeft = 0; });
}

async function line(page: Page) {
  const paper = page.getByRole('img', { name: '메모 스케치 영역', exact: true });
  await showPaper(page);
  const box = (await paper.boundingBox())!;
  // Real browser mouse events, with coordinates chosen from the current rendered paper.
  const x = box.x + box.width * 0.2,
    y = box.y + box.height * 0.15;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + box.width * 0.25, y + 8, { steps: 8 });
  await page.mouse.up();
  return { x: x + box.width * 0.125, y: y + 4 };
}

test('ink pages, partial erasing, settings and undo survive saving and reopening', async ({
  page,
}) => {
  await page.goto('?space=demo#/memos');
  await page.getByRole('button', { name: '메모 추가', exact: true }).tap();
  const paths = page.locator('.ink-pad-paper path[d]:not([d=""])');
  const center = await line(page);
  await expect(paths).toHaveCount(1);
  const first = await paths.first().getAttribute('d');
  await page.getByRole('button', { name: '지우개', exact: true }).tap();
  const paper = page.getByRole('img', { name: '메모 스케치 영역', exact: true });
  await showPaper(page);
  const box = (await paper.boundingBox())!;
  // The toolbar can reflow when the eraser selector appears.
  await page.mouse.click(box.x + box.width * 0.325, box.y + box.height * 0.15 + 4);
  await expect(paths).toHaveCount(2);
  await page.getByRole('button', { name: '그림 되돌리기', exact: true }).tap();
  await expect(paths).toHaveCount(1);
  await expect(paths.first()).toHaveAttribute('d', first!);
  await page.getByRole('button', {name:'선택',exact:true}).tap();
  await page.getByLabel('선택 모양',{exact:true}).selectOption('lasso');
  await showPaper(page); const lassoBox=(await paper.boundingBox())!;
  const around=[[.1,.12],[.6,.12],[.6,.24],[.1,.24],[.1,.12]];
  await page.mouse.move(lassoBox.x+lassoBox.width*around[0][0],lassoBox.y+lassoBox.height*around[0][1]);await page.mouse.down();
  for(const [x,y] of around.slice(1)) await page.mouse.move(lassoBox.x+lassoBox.width*x,lassoBox.y+lassoBox.height*y,{steps:5});
  await page.mouse.up();await expect(page.getByRole('button',{name:'선택 지우기',exact:true})).toBeEnabled();
  await page.getByRole('button',{name:'선택 지우기',exact:true}).tap();await expect(paths).toHaveCount(0);
  await page.getByRole('button',{name:'그림 되돌리기',exact:true}).tap();await expect(paths.first()).toHaveAttribute('d',first!);
  await page.getByRole('button', { name: '펜', exact: true }).tap();
  await page.getByLabel('펜 색', { exact: true }).selectOption('green');
  await page.getByRole('button', { name: '쪽 추가', exact: true }).tap();
  await line(page);
  const second = await paths.first().getAttribute('d');
  await page.getByRole('button', { name: '닫기', exact: true }).tap();
  await page.reload();
  await page.getByRole('button', { name: /메모 1 열기/ }).tap();
  await expect(page.getByLabel('필기 쪽', { exact: true })).toHaveValue('1');
  await expect(page.getByLabel('펜 색', { exact: true })).toHaveValue('green');
  await expect(paths.first()).toHaveAttribute('d', second!);
  await page.getByRole('button', { name: '그림 되돌리기', exact: true }).tap();
  await expect(paths).toHaveCount(0);
  await page.getByRole('button', { name: '다시 그리기', exact: true }).tap();
  await expect(paths.first()).toHaveAttribute('d', second!);
  await page.getByRole('button', { name: '이전 필기 쪽', exact: true }).tap();
  await expect(paths.first()).toHaveAttribute('d', first!);
  await page.getByRole('button', { name: '종이 확대', exact: true }).tap();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.getByRole('button', { name: '보기 초기화', exact: true }).tap();
  await page.getByRole('button', { name: '닫기', exact: true }).tap();
  // A DOM coordinate result is evidence of rendering, not physical Pencil behavior.
  expect(center.x).toBeGreaterThan(0);
});

import {PDFDocument,StandardFonts,rgb} from 'pdf-lib';
import {readFile} from 'node:fs/promises';
let pdfFixture:Buffer;
test.beforeAll(async()=>{const pdf=await PDFDocument.create(),font=await pdf.embedFont(StandardFonts.Helvetica);for(const [w,h] of [[400,600],[800,400]]){const page=pdf.addPage([w,h]);page.drawText('ORIGINAL PDF',{x:30,y:h-60,font,size:24});page.drawRectangle({x:50,y:100,width:100,height:150,color:rgb(.2,.5,.8)});}pdfFixture=Buffer.from(await pdf.save());});
test('PDF originals and page-specific editable annotations survive reopening and export',async({page})=>{
 await page.goto('?space=demo#/memos');await page.getByRole('button',{name:'메모 추가',exact:true}).tap();
 await page.getByLabel('필기할 PDF 파일').setInputFiles({name:'two-pages.pdf',mimeType:'application/pdf',buffer:pdfFixture});
 await expect(page.locator('.ink-pad-paper image')).toHaveAttribute('href',/^data:image\/png/, {timeout:30000});
 await expect(page.getByLabel('필기 쪽',{exact:true})).toContainText('2쪽');await line(page);
 const originalDownload=page.waitForEvent('download');await page.getByRole('button',{name:'원본 PDF 보관',exact:true}).tap();const original=await originalDownload;expect(await readFile((await original.path())!)).toEqual(pdfFixture);
 await page.getByRole('button',{name:'다음 필기 쪽',exact:true}).tap();await expect(page.locator('.ink-pad-paper image')).toHaveAttribute('href',/^data:image\/png/);await line(page);
 const annotationDownload=page.waitForEvent('download');await page.getByRole('button',{name:'주석 PDF로 보관',exact:true}).tap();const exported=await annotationDownload;const annotated=await PDFDocument.load(await readFile((await exported.path())!));expect(annotated.getPageCount()).toBe(2);expect(annotated.getPage(0).getSize()).toEqual({width:900,height:600});
 await page.getByRole('button',{name:'닫기',exact:true}).tap();await page.reload();await page.getByRole('button',{name:/메모 1 열기/}).tap();await expect(page.locator('.ink-pad-paper image')).toHaveAttribute('href',/^data:image\/png/);await expect(page.locator('.ink-pad-paper path[d]:not([d=""])')).toHaveCount(1);
 await page.getByRole('button',{name:'그림 되돌리기',exact:true}).tap();await expect(page.locator('.ink-pad-paper path[d]:not([d=""])')).toHaveCount(0);await expect(page.locator('.ink-pad-paper image')).toHaveAttribute('href',/^data:image\/png/);
});
test('local OCR runs, keeps editable candidates across reload and preserves original ink',async({page})=>{
 test.setTimeout(180000);
 await page.goto('?space=demo#/memos');await page.getByRole('button',{name:'메모 추가',exact:true}).tap();await line(page);
 const original=await page.locator('.ink-pad-paper path[d]:not([d=""])').first().getAttribute('d');
 await page.getByText('필기를 글로 옮기기',{exact:true}).tap();await page.getByRole('button',{name:'이 쪽 글자 읽기',exact:true}).tap();
 const candidate=page.getByLabel('인식한 글 확인·수정',{exact:true});await expect(candidate).toBeVisible({timeout:150000});
 await candidate.fill('확인한 한국어 글 · 조건 x > 0');await page.getByRole('button',{name:'닫기',exact:true}).tap();await page.reload();await page.getByRole('button',{name:/메모 1 열기/}).tap();
 await page.getByText('필기를 글로 옮기기',{exact:true}).tap();await expect(candidate).toHaveValue('확인한 한국어 글 · 조건 x > 0');await page.getByRole('button',{name:'확인한 글 넣기',exact:true}).tap();
 await page.getByText('글·연결·입력 설정',{exact:true}).tap();await expect(page.getByLabel('짧은 글',{exact:true})).toHaveValue('확인한 한국어 글 · 조건 x > 0');await expect(page.locator('.ink-pad-paper path[d]:not([d=""])').first()).toHaveAttribute('d',original!);
 await page.getByRole('button',{name:'닫기',exact:true}).tap();await page.reload();await page.getByRole('button',{name:/메모 1 열기/}).tap();await expect(page.getByLabel('짧은 글',{exact:true})).toHaveValue('확인한 한국어 글 · 조건 x > 0');
});
