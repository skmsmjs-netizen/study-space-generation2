import { expect, it } from 'vitest';
import { applyCommand } from './commands';
import { createDemoState } from './fixtures';
function freeze(value: unknown) {
 if (value && typeof value === 'object' && !Object.isFrozen(value)) {
  Object.freeze(value); for(const child of Object.values(value)) freeze(child);
 }
}
it('edits and undoes a deeply frozen snapshot without changing historical rows or input payloads',()=>{
 const original=createDemoState();
 const first=applyCommand(original,{type:'saveRecords',sessionId:'immutable-session',entries:[{targetId:'demo-topic-function',body:'  과거 원문\n  ',done:false}],dateEvidence:{kind:'unknown'},userId:original.userId,opId:'immutable-add',at:'2026-10-01T00:00:00Z'});
 const raw=JSON.stringify(first);freeze(first);
 const record=first.records.at(-1)!;
 const command={type:'updateRecord' as const,id:record.id,expectedVersion:record.version,patch:{body:'새 문장',trace:{Td1:{status:'checked' as const,note:'선택 이유'}}},userId:first.userId,opId:'immutable-edit',at:'2026-10-01T00:01:00Z'};
 freeze(command);const next=applyCommand(first,command);freeze(next);
 expect(JSON.stringify(first)).toBe(raw);expect(next.records.at(-1)!.body).toBe('새 문장');
 const undone=applyCommand(next,{type:'undoRevision',revisionId:next.revisions.at(-1)!.id,expectedVersion:next.records.at(-1)!.version,userId:first.userId,opId:'immutable-undo',at:'2026-10-01T00:02:00Z'});
 expect(undone.records.at(-1)!.body).toBe('  과거 원문\n  ');expect(next.records.at(-1)!.body).toBe('새 문장');expect(JSON.stringify(first)).toBe(raw);
});
