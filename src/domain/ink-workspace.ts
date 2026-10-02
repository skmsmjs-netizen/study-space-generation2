import { DomainError, type Entity, type MemoInk, type MemoStroke } from './model';
import { type InkChange } from './ink-editing';
import { validateMemoContent } from './memo';
export interface InkPreferences { ink: MemoInk; width: number; finger: boolean; pressure: boolean }
export interface InkWorkspace { page: number; pages: number; zoom: number; undo: InkChange[]; redo: InkChange[]; fingerprint: string }
export type InkWorkspaceContent = { kind: 'preferences'; value: InkPreferences } | { kind: 'document'; value: InkWorkspace };
export interface SyncedInkWorkspace extends Entity { key: string; content: InkWorkspaceContent }
export function validateInkWorkspace(content: InkWorkspaceContent): void {
 const bad=():never=>{throw new DomainError('INVALID_INK_WORKSPACE','필기 설정과 수정 이력을 확인하지 못했습니다. 원문은 보존했습니다.');};
 if(!content || !content.value) { bad(); }
 if(content.kind==='preferences') {
  const p=content.value;
  if(!['ink','blue','green'].includes(p.ink)||![2,3,5,8].includes(p.width)||typeof p.finger!=='boolean'||typeof p.pressure!=='boolean') bad();
 } else if(content.kind==='document') {
  const w=content.value;
  if(!Number.isSafeInteger(w.page)||w.page<0||!Number.isSafeInteger(w.pages)||w.pages<1||w.page>=w.pages||![1,1.5,2].includes(w.zoom)||typeof w.fingerprint!=='string'||!Array.isArray(w.undo)||!Array.isArray(w.redo)||w.undo.length>50||w.redo.length>50) { bad(); }
  for(const c of [...w.undo,...w.redo]) {
   if(!c || !Array.isArray(c.before)||!Array.isArray(c.after)) { bad(); }
   for(const entries of [c.before,c.after]) {
    const ids=new Set<string>(), indexes=new Set<number>();
    for(const row of entries) {
     if(!row||!Number.isSafeInteger(row.index)||row.index<0||indexes.has(row.index)||ids.has(row.stroke?.id)) { bad(); }
     validateMemoContent({body:'',ownerId:null,strokes:[row.stroke] as MemoStroke[]}); ids.add(row.stroke.id); indexes.add(row.index);
    }
   }
  }
 } else bad();
}
