import type { AppState } from '../domain/model';
import type { Judgment } from '../domain/chemistry/model';
import { storagePrefix } from './repository';
import { decodeStoredText, encodeStoredText } from './storage-codec';
import { storeDraftSafely, readRescuedDraft } from './draft-safety';
export type ChemistryView = { version:1; selected:string; query:string; chapter:string; filter:string; memoLinks?:Record<string,string[]>; listTop?:number; views:Record<string,{values:Record<string,number>; drafts:Record<string,string>; condition:Judgment['state']; step:number; molecule:string; zoom:number}> };
export const emptyChemistryView = ():ChemistryView => ({version:1,selected:'',query:'',chapter:'',filter:'',views:{}});
export function chemistryViewKey(data:Pick<AppState,'namespace'|'userId'>) {return `${storagePrefix(data)}:concept-interactives:chemistry:ebbing9-452b2438:v1`;}
export function validateChemistryView(v:unknown): asserts v is ChemistryView {
 if(!v||typeof v!=='object')throw Error('관찰 상태 형식을 확인해야 한다.');
 const s=v as ChemistryView;
 if(s.version!==1||[s.selected,s.query,s.chapter,s.filter].some(x=>typeof x!=='string')||!s.views||typeof s.views!=='object'||Array.isArray(s.views))throw Error('관찰 상태 버전·위치를 확인해야 한다.');
 if(s.listTop!==undefined&&(!Number.isFinite(s.listTop)||s.listTop<0))throw Error('목록 위치를 확인해야 한다.');
 if(s.memoLinks!==undefined&&(!s.memoLinks||typeof s.memoLinks!=='object'||Array.isArray(s.memoLinks)||Object.values(s.memoLinks).some(ids=>!Array.isArray(ids)||ids.some(id=>typeof id!=='string'))))throw Error('개념과 메모의 연결 형식을 확인해야 한다.');
 for(const x of Object.values(s.views)) {
  if(!x||!['fulfilled','violated','unknown'].includes(x.condition)||!Number.isInteger(x.step)||x.step<0||!Number.isFinite(x.zoom)||x.zoom<0.5||x.zoom>4||typeof x.molecule!=='string'||!x.values||!x.drafts||Object.values(x.values).some(a=>!Number.isFinite(a))||Object.values(x.drafts).some(a=>typeof a!=='string'))throw Error('관찰의 값·초안·단계가 손상되어 원본을 덮어쓰지 않는다.');
 }
}
export function readChemistryView(key:string): ChemistryView {
 const raw=readRescuedDraft(key,{scope:'device'})??localStorage.getItem(key);
 if(raw===null)return emptyChemistryView();
 const v:unknown=JSON.parse(decodeStoredText(raw));validateChemistryView(v);return v;
}
/** Uses the shared rescue/codec path, never a study completion or server write. */
export function writeChemistryView(key:string,view:ChemistryView,expected:string|null) {
 validateChemistryView(view);
 const original=localStorage.getItem(key);
 if(original!==expected)throw Error('다른 창의 관찰 상태가 바뀌었다. 현재 상태를 파일로 보관한 뒤 다시 불러와야 한다.');
 if(original!==null)validateChemistryView(JSON.parse(decodeStoredText(original)));
 storeDraftSafely(key,encodeStoredText(JSON.stringify(view)));
 return localStorage.getItem(key);
}
