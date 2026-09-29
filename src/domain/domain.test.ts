import { describe, expect, it } from 'vitest';
import { applyCommand, validateDateEvidence, validateState } from './commands';
import { createDemoState } from './fixtures';
import { DomainError, emptyState, type AppState, type Command, type CommandContext } from './model';
import { TRACE_ITEMS } from './trace';

const at = '2026-09-29T01:02:03.000Z';
const ctx = (id: string): CommandContext => ({ opId: id, at, userId: 'demo-learner', namespace: 'demo' });
const topic = 'demo-topic-function';
function record(state = createDemoState(), extra = {}): AppState {
  return applyCommand(state, { ...ctx('record-one'), type: 'saveRecords', sessionId: 'real-session-text-id', entries: [{ targetId: topic, done: false, body: '  원문\n\n마지막  ', ...extra }], dateEvidence: { kind: 'unknown' } });
}
const errorCode = (fn: () => unknown) => { try { fn(); return null; } catch (error) { return error instanceof DomainError ? error.code : String(error); } };

describe('preserved learning contracts', () => {
  it('copies all 15 current stable activity identities, including optional C2/C4', () => {
    expect(TRACE_ITEMS.map(i => i.id)).toEqual(['Td1','Td2','Rd1','Rd2','Ad1','Ad2','Cd1','Cself1','Cd3','Cd4','Cd5','Ed1','Ed2','Ed3','Ed4']);
    expect(TRACE_ITEMS.filter(i => i.mode === 'optional').map(i => i.id)).toEqual(['Cself1', 'Cd4']);
  });
  it('creates only invented demo data and no invented study events', () => {
    const state = createDemoState(); validateState(state);
    expect(state.namespace).toBe('demo'); expect(state.sessions).toHaveLength(0); expect(state.records).toHaveLength(0);
  });
  it('retains whitespace and does not infer studied from a body', () => {
    const state = record(); const row = state.records[0];
    expect(row.body).toBe('  원문\n\n마지막  '); expect(row.done).toBe(false); expect(row.dateEvidence).toEqual({ kind: 'unknown' });
  });
  it('accepts a studied record without any body or activity requirements', () => {
    const state = applyCommand(createDemoState(), { ...ctx('empty-body'), type:'saveRecords', sessionId:'s', entries:[{ targetId:topic, done:true }], dateEvidence:{ kind:'exact', date:'2026-09-27' } });
    expect(state.records[0].body).toBe(''); expect(state.records[0].trace).toEqual({});
  });
  it('preserves one original session across two semesters without changing earlier subjects', () => {
    let state = createDemoState(); const subjects = structuredClone(state.subjects);
    state = applyCommand(state, { ...ctx('past-topic'), type:'addNode', id:'past-topic', subjectId:'demo-subject-past', parentId:null, role:'topic', name:'같은 이름' });
    state = applyCommand(state, { ...ctx('two-scopes'), type:'saveRecords', sessionId:'original-not-uuid', entries:[{targetId:topic,done:true},{targetId:'past-topic',done:true}], dateEvidence:{kind:'range',from:'2026-09-20',to:'2026-09-29'} });
    expect(state.sessions).toHaveLength(1); expect(state.sessions[0].id).toBe('original-not-uuid'); expect(state.records).toHaveLength(2); expect(state.subjects).toEqual(subjects);
  });
  it('adding a semester does not move an existing subject', () => {
    const state = createDemoState(); const next = applyCommand(state, {...ctx('new-term'),type:'addSemester',id:'new-term',name:'다음 학기'});
    expect(next.subjects).toEqual(state.subjects); expect(state.semesters).toHaveLength(2);
  });
  it('preserves unassigned and independent scopes', () => {
    let state = createDemoState();
    state = applyCommand(state,{...ctx('unassigned'),type:'addSubject',id:'unassigned',name:'미지정',scope:{kind:'unassigned'}});
    expect(state.subjects.find(s=>s.id==='unassigned')?.scope).toEqual({kind:'unassigned'});
    expect(state.subjects.find(s=>s.id==='demo-subject-independent')?.scope).toEqual({kind:'independent'});
  });
  it('rejects wrong subject ownership and rolls back the whole save', () => {
    const state=createDemoState(), before=structuredClone(state);
    expect(errorCode(()=>applyCommand(state,{...ctx('bad-target'),type:'saveRecords',sessionId:'s',entries:[{targetId:topic,subjectId:'demo-subject-science',done:true}],dateEvidence:{kind:'unknown'}}))).toBe('SUBJECT_MISMATCH');
    expect(state).toEqual(before);
  });
  it('checks trace independently of done without requiring earlier stages', () => {
    const state=record(undefined,{trace:{Ed4:{status:'checked'},Cself1:{status:'checked'}}});
    expect(state.records[0].done).toBe(false); expect(state.records[0].trace.Cself1.examReview).toBeUndefined(); expect(state.sessions).toHaveLength(1);
  });
  it('retains unknown and minimum repeat quantities', () => {
    const state=record(undefined,{trace:{Td1:{status:'deferred',repeats:[{id:'repeat-one',kind:'unknown',count:null},{id:'repeat-two',kind:'minimum',count:3}]}}});
    expect(state.records[0].trace.Td1.repeats?.map(r=>r.count)).toEqual([null,3]);
  });
  it('preserves prior body when only the studied flag is bulk-applied', () => {
    const state=record(); const row=state.records[0];
    const next=applyCommand(state,{...ctx('bulk'),type:'saveRecords',sessionId:row.sessionId,entries:[{targetId:topic,done:true,expectedVersion:row.version}],dateEvidence:row.dateEvidence});
    expect(next.records[0].body).toBe(row.body); expect(next.sessions).toHaveLength(1); expect(next.records).toHaveLength(1);
  });
});

describe('write integrity and recovery',()=>{
  it('deduplicates a retry and rejects same operation identity with a new payload',()=>{
    const state=createDemoState(); const command:Command={...ctx('repeat-op'),type:'addSemester',id:'new',name:'새 학기'};
    const next=applyCommand(state,command); expect(applyCommand(next,command)).toBe(next);
    expect(errorCode(()=>applyCommand(next,{...command,name:'다른 이름'}))).toBe('OPERATION_REUSED');
  });
  it('rejects other users, other namespaces, and contaminated snapshots',()=>{
    const state=createDemoState(); const command:Command={...ctx('owner'),type:'addSemester',id:'new',name:'새 학기'};
    expect(errorCode(()=>applyCommand(state,{...command,userId:'someone-else'}))).toBe('OWNERSHIP');
    expect(errorCode(()=>applyCommand(state,{...command,namespace:'personal'}))).toBe('OWNERSHIP');
    const bad=structuredClone(state);bad.nodes[0].namespace='personal';
    expect(errorCode(()=>validateState(bad))).toBe('OWNERSHIP');
  });
  it('rejects wrong-parent moves and cycles without changing any original entity',()=>{
    const state=createDemoState(), before=structuredClone(state);
    expect(errorCode(()=>applyCommand(state,{...ctx('cycle'),type:'moveNode',id:'demo-unit-functions',parentId:topic,expectedVersion:1}))).toBe('CYCLE');
    expect(errorCode(()=>applyCommand(state,{...ctx('cross-subject'),type:'moveNode',id:topic,parentId:'demo-unit-force',expectedVersion:1}))).toBe('SUBJECT_MISMATCH');
    expect(state).toEqual(before);
  });
  it('keeps all records and revisions after deleting and restoring a parent',()=>{
    let state=record(); const rows=structuredClone(state.records), histories=structuredClone(state.revisions);
    state=applyCommand(state,{...ctx('trash'),type:'trashNode',id:'demo-unit-functions',expectedVersion:1});
    expect(state.records).toEqual(rows); expect(state.revisions.slice(0,histories.length)).toEqual(histories);
    expect(state.nodes.find(n=>n.id===topic)?.deletedAt).toBe(at);
    state=applyCommand(state,{...ctx('restore'),type:'restoreNode',id:'demo-unit-functions',expectedVersion:2});
    expect(state.nodes.find(n=>n.id===topic)?.deletedAt).toBeNull(); expect(state.records).toEqual(rows);
  });
  it('does not resurrect a child independently deleted before its parent',()=>{
    let state=createDemoState();
    state=applyCommand(state,{...ctx('child-trash'),type:'trashNode',id:topic,expectedVersion:1});
    state=applyCommand(state,{...ctx('parent-trash'),type:'trashNode',id:'demo-unit-functions',expectedVersion:1});
    state=applyCommand(state,{...ctx('parent-restore'),type:'restoreNode',id:'demo-unit-functions',expectedVersion:2});
    expect(state.nodes.find(n=>n.id===topic)?.deletedAt).toBe(at); expect(state.nodes.find(n=>n.id==='demo-topic-graph')?.deletedAt).toBeNull();
  });
  it('preserves both supplied and current content on version conflict',()=>{
    const state=record();const row=state.records[0];
    try { applyCommand(state,{...ctx('stale'),type:'updateRecord',id:row.id,expectedVersion:0,patch:{body:'오프라인에서 쓴 글'}}); throw Error('must reject'); }
    catch(e) { expect(e).toBeInstanceOf(DomainError); expect((e as DomainError).code).toBe('VERSION_CONFLICT'); expect((e as DomainError).details).toMatchObject({current:{body:row.body},attempted:{body:'오프라인에서 쓴 글'}}); }
    expect(state.records[0]).toEqual(row);
  });
  it('requires explicit expectedVersion for updates through bulk save',()=>{
    const state=record();
    expect(errorCode(()=>applyCommand(state,{...ctx('unsafe-update'),type:'saveRecords',sessionId:state.sessions[0].id,entries:[{targetId:topic,done:true}],dateEvidence:{kind:'unknown'}}))).toBe('VERSION_CONFLICT');
  });
  it('undo creates a revision and never rewinds a later change',()=>{
    let state=record();const id=state.records[0].id;
    state=applyCommand(state,{...ctx('edit'),type:'updateRecord',id,expectedVersion:1,patch:{body:'수정'}});
    const edit=state.revisions.at(-1)!;
    const restored=applyCommand(state,{...ctx('undo'),type:'undoRevision',revisionId:edit.id,expectedVersion:2});
    expect(restored.records[0].body).toBe('  원문\n\n마지막  ');expect(restored.records[0].version).toBe(3);expect(restored.revisions.at(-1)?.reversesRevisionId).toBe(edit.id);
    const changed=applyCommand(state,{...ctx('later'),type:'updateRecord',id,expectedVersion:2,patch:{body:'나중 수정'}});
    expect(errorCode(()=>applyCommand(changed,{...ctx('old-undo'),type:'undoRevision',revisionId:edit.id,expectedVersion:3}))).toBe('UNDO_CONFLICT');
  });
  it('refuses invalid or inverted dates instead of converting them to today',()=>{
    expect(errorCode(()=>validateDateEvidence({kind:'exact',date:'2026-02-30'}))).toBe('INVALID_DATE');
    expect(errorCode(()=>validateDateEvidence({kind:'range',from:'2026-09-29',to:'2026-09-01'}))).toBe('INVALID_DATE');
  });
  it('preserves private draft text when a 100KB narrative conflicts',()=>{
    const body='문장\n'.repeat(30000); let state=createDemoState();
    state=applyCommand(state,{...ctx('long'),type:'updateNarrative',id:'long-note',kind:'free-note',ownerId:null,body,expectedVersion:0});
    const before=structuredClone(state);
    expect(errorCode(()=>applyCommand(state,{...ctx('long-stale'),type:'updateNarrative',id:'long-note',kind:'free-note',ownerId:null,body:'다른 글',expectedVersion:0}))).toBe('VERSION_CONFLICT');
    expect(state).toEqual(before);expect(state.narratives.find(n=>n.id==='long-note')?.body).toBe(body);
  });
});

describe('C2 written review contract',()=>{
  it('requires a nonblank answer for confirmation, while ordinary C2 remains optional',()=>{
    let state=record(undefined,{trace:{Cself1:{status:'checked'}}}); const id=state.records[0].id;
    expect(errorCode(()=>applyCommand(state,{...ctx('empty-confirm'),type:'confirmWrittenReview',recordId:id,expectedVersion:1}))).toBe('EMPTY_WRITTEN_REVIEW');
    state=applyCommand(state,{...ctx('blank'),type:'editWrittenReview',recordId:id,expectedVersion:1,answer:'  \n'});
    expect(errorCode(()=>applyCommand(state,{...ctx('blank-confirm'),type:'confirmWrittenReview',recordId:id,expectedVersion:2}))).toBe('EMPTY_WRITTEN_REVIEW');
  });
  it('editing invalidates only the checkpoint and keeps C2, body and previous revisions',()=>{
    let state=record(); const id=state.records[0].id;
    state=applyCommand(state,{...ctx('answer'),type:'editWrittenReview',recordId:id,expectedVersion:1,answer:'내 문장'});
    state=applyCommand(state,{...ctx('confirm'),type:'confirmWrittenReview',recordId:id,expectedVersion:2});
    state=applyCommand(state,{...ctx('edit-answer'),type:'editWrittenReview',recordId:id,expectedVersion:3,answer:'수정한 내 문장'});
    expect(state.records[0].trace.Cself1).toMatchObject({status:'checked',examReview:{answer:'수정한 내 문장',checked:false}});
    expect(state.records[0].done).toBe(false); expect(state.records[0].body).toBe('  원문\n\n마지막  ');
    expect(state.revisions.some(r=>r.collection==='records'&&'trace' in r.after&&r.after.trace.Cself1?.examReview?.answer==='내 문장')).toBe(true);
  });
  it('unchecking C2 retains the written answer and clears checkpoint',()=>{
    let state=record();const id=state.records[0].id;
    state=applyCommand(state,{...ctx('answer'),type:'editWrittenReview',recordId:id,expectedVersion:1,answer:'내 글'});
    state=applyCommand(state,{...ctx('confirm'),type:'confirmWrittenReview',recordId:id,expectedVersion:2});
    state=applyCommand(state,{...ctx('uncheck'),type:'updateRecord',id,expectedVersion:3,patch:{trace:{Cself1:{status:'unchecked'}}}});
    expect(state.records[0].trace.Cself1.examReview).toMatchObject({answer:'내 글',checked:false});
  });
  it('does not copy a checkpoint into the next study and blocks generic patch confirmation',()=>{
    const state=record();const id=state.records[0].id;
    expect(errorCode(()=>applyCommand(state,{...ctx('bypass'),type:'updateRecord',id,expectedVersion:1,patch:{trace:{Cself1:{status:'checked',examReview:{answer:'우회',checked:true,updatedAt:at}}}}}))).toBe('REVIEW_COMMAND_REQUIRED');
    const next=applyCommand(state,{...ctx('new-study'),type:'saveRecords',sessionId:'second-session',entries:[{targetId:topic,done:true}],dateEvidence:{kind:'unknown'}});
    expect(next.records[1].trace).toEqual({});
  });
});

describe('recovery dependency and checkpoint reversal',()=>{
 it('unconfirms a written checkpoint while preserving the C2 attempt and exact answer',()=>{
  let state=record();const id=state.records[0].id;
  state=applyCommand(state,{...ctx('answer-unconfirm'),type:'editWrittenReview',recordId:id,expectedVersion:1,answer:'  설명\n'});
  state=applyCommand(state,{...ctx('confirm-unconfirm'),type:'confirmWrittenReview',recordId:id,expectedVersion:2});
  state=applyCommand(state,{...ctx('unconfirm'),type:'unconfirmWrittenReview',recordId:id,expectedVersion:3});
  expect(state.records[0].trace.Cself1).toMatchObject({status:'checked',examReview:{answer:'  설명\n',checked:false}});
 });
 it('does not undo creation beneath entities added later',()=>{
  let state=createDemoState();
  state=applyCommand(state,{...ctx('new-parent'),type:'addNode',id:'new-parent',subjectId:'demo-subject-math',parentId:null,role:'unit',name:'새 단원'});
  const creation=state.revisions.at(-1)!;
  state=applyCommand(state,{...ctx('new-child'),type:'addNode',id:'new-child',subjectId:'demo-subject-math',parentId:'new-parent',role:'topic',name:'나중 주제'});
  expect(errorCode(()=>applyCommand(state,{...ctx('undo-parent'),type:'undoRevision',revisionId:creation.id,expectedVersion:1}))).toBe('UNDO_DEPENDENCY');
  expect(state.nodes.find(n=>n.id==='new-child')?.deletedAt).toBeNull();
 });
 it('can undo a newly saved study operation including session and record atomically',()=>{
  const state=record(),revision=state.revisions.at(-1)!;
  const next=applyCommand(state,{...ctx('undo-created-record'),type:'undoRevision',revisionId:revision.id,expectedVersion:1});
  expect(next.records[0].deletedAt).toBe(at);expect(next.sessions[0].deletedAt).toBe(at);expect(next.records[0].body).toBe(state.records[0].body);
 });
});
