import type { AppState } from '../domain/model';
import type { LearningSchedule } from '../domain/learning-schedule';
const key=(data:AppState,id:string)=>`study-space:${data.namespace}:${encodeURIComponent(data.userId)}:schedule-draft:${encodeURIComponent(id)}:v1`;
export function readScheduleDraft(data:AppState,id:string,storage:Pick<Storage,'getItem'>=localStorage){
 const raw=storage.getItem(key(data,id));if(raw===null)return {raw,draft:null,base:null as LearningSchedule|null,repeatEnd:''};
 try {const d=JSON.parse(raw);if(d.userId!==data.userId||d.namespace!==data.namespace||d.version!==1||!d.draft||typeof d.draft.id!=='string'||typeof d.draft.name!=='string'||typeof d.draft.note!=='string'||!Array.isArray(d.draft.targetIds))throw Error();return {raw,draft:d.draft as LearningSchedule,base:(d.base??null) as LearningSchedule|null,repeatEnd:typeof d.repeatEnd==='string'?d.repeatEnd:''};}catch{throw Error('일정 초안을 읽지 못했습니다. 원문은 보존했습니다.');}
}
export function writeScheduleDraft(data:AppState,id:string,draft:LearningSchedule,previous:string|null,storage:Pick<Storage,'getItem'|'setItem'>=localStorage,context:{base:LearningSchedule|null;repeatEnd:string}={base:null,repeatEnd:''}){
 const k=key(data,id);if(storage.getItem(k)!==previous)throw Error('다른 창에서 일정 초안이 바뀌었습니다. 작성 내용은 화면에 남아 있습니다.');const raw=JSON.stringify({version:1,userId:data.userId,namespace:data.namespace,draft,...context});storage.setItem(k,raw);return raw;
}
export function clearScheduleDraft(data:AppState,id:string,raw:string|null,storage:Pick<Storage,'getItem'|'removeItem'>=localStorage){const k=key(data,id);if(storage.getItem(k)===raw)storage.removeItem(k);}
