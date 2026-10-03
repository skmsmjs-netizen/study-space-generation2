import type { AppState } from '../domain/model';
import { physicsCatalog, observationById, initialValues } from '../domain/physics-observations';
import { physicsSectionRange, physicsConceptReading } from '../domain/physics-reading';
import { storagePrefix } from './repository';
import { readRescuedDraft, storeDraftSafely, clearRescuedDraft } from './draft-safety';
export type PhysicsView = { values: Record<string,number>; inputs:Record<string,string>; memo:string; condition:'zero'|'nonzero'|'unknown'; ranges?:{x:[number,number];y:[number,number]}; secondaryRanges?:{x:[number,number];y:[number,number]} };
export type PhysicsReadingView = { page:number; memo:string; focus:string; condition:'confirmed'|'violated'|'unknown'; sourceMode?:'text'|'image' };
export const physicsReadingView=(id:string):PhysicsReadingView=>({page:physicsSectionRange(id)!.startPdf,memo:'',focus:'',condition:'unknown'});
export type PhysicsBookView = { version:1; chapter:number; section:string; views:Record<string,PhysicsView>; readings?:Record<string,PhysicsReadingView> };
export const physicsViewKey = (owner:Pick<AppState,'namespace'|'userId'>)=>`${storagePrefix(owner)}:physics-observations:reading:v1`;
export const freshPhysicsBook = ():PhysicsBookView=>({version:1,chapter:3,section:'3.5',views:{}});
export function physicsView(id:string):PhysicsView {
  const item=observationById(id);if(!item)throw Error('관찰 항목을 찾을 수 없다.');
  return {values:initialValues(item),inputs:{},memo:'',condition:'zero'};
}
export function validatePhysicsBook(value:unknown):PhysicsBookView {
  if(!value||typeof value!=='object')throw Error('물리 관찰 보기의 형식을 읽지 못했다.');
  const b=value as PhysicsBookView;
  if(b.version!==1||!Number.isInteger(b.chapter)||b.chapter<1||b.chapter>28||typeof b.section!=='string'||!physicsCatalog.chapters.some(ch=>ch.sections.some(s=>s.id===b.section))||!b.views||typeof b.views!=='object'||Array.isArray(b.views))throw Error('물리 관찰 보기의 형식을 읽지 못했다.');
  for(const [id,v] of Object.entries(b.views)) {
    const item=observationById(id);
    if(!item||!v||!v.values||!v.inputs||typeof v.memo!=='string'||v.memo.length>100000||!['zero','nonzero','unknown'].includes(v.condition))throw Error('물리 관찰 값을 읽지 못했다.');
    if(Object.keys(v.values).length!==item.controls.length||Object.keys(v.inputs).some(k=>!item.controls.some(c=>c.key===k))||Object.values(v.inputs).some(x=>typeof x!=='string'||x.length>500))throw Error('물리 관찰 입력 형식을 읽지 못했다.');
    for(const c of item.controls)if(!Number.isFinite(v.values[c.key])||v.values[c.key]<c.min||v.values[c.key]>c.max||(c.choices&&!c.choices.some(o=>o.value===v.values[c.key])))throw Error('물리 관찰 값의 범위를 확인해야 한다.');
    for(const ranges of [v.ranges,v.secondaryRanges])if(ranges&&!['x','y'].every(k=>{const r=ranges[k as 'x'|'y'];return Array.isArray(r)&&r.length===2&&r.every(n=>Number.isFinite(n)&&Math.abs(n)<1e12)&&r[1]-r[0]>1e-12;}))throw Error('물리 관찰 시야를 읽지 못했다.');
  }
  if(b.readings){
    if(typeof b.readings!=='object'||Array.isArray(b.readings))throw Error('절 읽기 상태의 형식을 읽지 못했다.');
    for(const [id,v] of Object.entries(b.readings)){
      const range=physicsSectionRange(id),concept=physicsConceptReading(id);
      if(!range||!v||!Number.isInteger(v.page)||v.page<range.startPdf||v.page>range.endPdf||typeof v.memo!=='string'||v.memo.length>100000||typeof v.focus!=='string'||(v.focus!==''&&!concept?.steps.some(s=>s.id===v.focus))||!['confirmed','violated','unknown'].includes(v.condition)||(v.sourceMode!==undefined&&!['text','image'].includes(v.sourceMode)))throw Error('절 읽기 위치·메모·조건을 확인해야 한다.');
    }
  }
  return b;
}
export function readPhysicsBook(key:string) {
  const original=localStorage.getItem(key);
  const raw=readRescuedDraft(key,{scope:'device'})??original;
  return {book:raw===null||raw===''?freshPhysicsBook():validatePhysicsBook(JSON.parse(raw)),original};
}
export function writePhysicsBook(key:string,book:PhysicsBookView,expected:string|null) {
  validatePhysicsBook(book);
  const current=localStorage.getItem(key);
  if(current!==null)validatePhysicsBook(JSON.parse(current));
  if(current!==expected)throw Error('다른 창에서 보관한 값이 바뀌었다. 현재 입력은 유지했다. 파일로 보관한 뒤 저장된 보기를 다시 불러올 수 있다.');
  const raw=JSON.stringify(book);storeDraftSafely(key,raw);return raw;
}

/** Explicit recovery preserves the current window before adopting the canonical device copy. */
export function reloadStoredPhysicsBook(key:string,current:PhysicsBookView) {
  const original=localStorage.getItem(key);
  const book=original===null?freshPhysicsBook():validatePhysicsBook(JSON.parse(original));
  const archiveKey=`${key}:recovery:${crypto.randomUUID()}`;
  storeDraftSafely(archiveKey,JSON.stringify(validatePhysicsBook(current)));
  clearRescuedDraft(key);
  return {book,original,archiveKey};
}
