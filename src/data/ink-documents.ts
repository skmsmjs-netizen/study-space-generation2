import type { MemoStroke, MemoDocument, AppState } from '../domain/model';
import { inkShape } from '../domain/ink-appearance';
import { strokePage, inkPageCount } from '../domain/ink-editing';
import { keepDocumentFile, readDocumentFile } from './document-files';
import { uploadMaterialFile } from './material-cloud';
export const printInk = {ink:'#232323',blue:'#2670c9',green:'#2f805b'};
export function paperFit(width:number,height:number) {
  const scale=Math.min(900/width,600/height);
  return {scale,x:(900-width*scale)/2,y:(600-height*scale)/2,width:width*scale,height:height*scale};
}
export async function openInkPDF(owner:Pick<AppState,'userId'|'namespace'>,document:MemoDocument) {
 const blob=await readDocumentFile(owner,document.file);
 if(!blob) throw Error('이 기기의 PDF 원본을 찾지 못했습니다. 원본 PDF를 다시 선택해 주세요. 필기는 그대로 있습니다.');
 const pdfjs=await import('pdfjs-dist');
 pdfjs.GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).href;
 const loading=pdfjs.getDocument({data:await blob.arrayBuffer()});
 try {const pdf=await loading.promise;if(pdf.numPages!==document.pages){await loading.destroy();throw Error('PDF 쪽 수가 원본과 다릅니다. 기존 필기를 보존했습니다.');} return { getPage: pdf.getPage.bind(pdf), destroy: () => loading.destroy() };}
 catch(e){await loading.destroy();throw e;}
}
export async function attachInkPDF(owner:Pick<AppState,'userId'|'namespace'>,file:File,startPage:number):Promise<MemoDocument> {
 if(!/\.pdf$/i.test(file.name)) throw Error('PDF 파일을 선택해 주세요.');
 const reference=await keepDocumentFile(owner,file);
 const pdfjs=await import('pdfjs-dist');
 pdfjs.GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).href;
 const loading=pdfjs.getDocument({data:await file.arrayBuffer()});
 let pages:number;
 try {const pdf=await loading.promise;pages=pdf.numPages;} finally {await loading.destroy();}
 return {file:reference,pages,startPage};
}
export async function syncInkPDF(owner:Pick<AppState,'userId'|'namespace'>,document:MemoDocument) {
 if(owner.namespace!=='personal'||document.file.cloudPath) return document;
 const blob=await readDocumentFile(owner,document.file);if(!blob)throw Error('이 기기의 PDF 원본을 찾지 못했습니다.');
 return {...document,file:await uploadMaterialFile(owner,'document',document.file,blob)};
}
export function inkRaster(strokes:MemoStroke[],page:number):Promise<HTMLCanvasElement> {
 const paths=strokes.filter(s=>strokePage(s)===page).map(s=>`<path d="${inkShape(s)}" ${s.pressureSensitive?`fill="${printInk[s.ink]}"`:`fill="none" stroke="${printInk[s.ink]}" stroke-width="${s.width}" stroke-linecap="round" stroke-linejoin="round"`}/>`).join('');
 const url=URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200" viewBox="0 0 900 600"><rect width="900" height="600" fill="white"/>${paths}</svg>`],{type:'image/svg+xml'}));
 return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{const canvas=document.createElement('canvas');canvas.width=1800;canvas.height=1200;canvas.getContext('2d')!.drawImage(image,0,0);URL.revokeObjectURL(url);resolve(canvas);};image.onerror=()=>{URL.revokeObjectURL(url);reject(Error('필기를 글자 인식용 이미지로 만들지 못했습니다.'));};image.src=url;});
}
/** A separate visual copy: original PDF bytes and editable ink remain in the notebook. */
export async function exportInkPDF(owner:Pick<AppState,'userId'|'namespace'>,strokes:MemoStroke[],document?:MemoDocument,blankPages=1):Promise<Uint8Array> {
 const {PDFDocument,rgb}=await import('pdf-lib');
 const out=await PDFDocument.create();
 let source:Awaited<ReturnType<typeof PDFDocument.load>>|undefined;
 if(document){const blob=await readDocumentFile(owner,document.file);if(!blob)throw Error('원본 PDF를 찾지 못했습니다. 필기는 보존했습니다.');source=await PDFDocument.load(await blob.arrayBuffer());}
 const count=Math.max(blankPages,inkPageCount(strokes),document?document.startPage+document.pages:0);
 for(let index=0;index<count;index++) {
  const page=out.addPage([900,600]);
  if(source && document && index>=document.startPage && index<document.startPage+document.pages) {
   const embedded=await out.embedPage(source.getPage(index-document.startPage));
   const fit=paperFit(embedded.width,embedded.height);
   page.drawPage(embedded,{x:fit.x,y:fit.y,width:fit.width,height:fit.height});
  }
  for(const stroke of strokes.filter(s=>strokePage(s)===index)) {
   const color=printInk[stroke.ink];const c=rgb(parseInt(color.slice(1,3),16)/255,parseInt(color.slice(3,5),16)/255,parseInt(color.slice(5),16)/255);
   page.drawSvgPath(inkShape(stroke),{x:0,y:600,...(stroke.pressureSensitive?{color:c}:{borderColor:c,borderWidth:stroke.width,borderLineCap:1})});
  }
 }
 return out.save();
}
export function downloadInkFile(blob:Blob,name:string) {
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
