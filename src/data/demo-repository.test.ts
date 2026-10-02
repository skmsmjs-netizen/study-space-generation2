import { describe,it,expect } from 'vitest';
import { DemoRepository, DEMO_KEY, localDay } from './demo-repository';
function storage() { const map = new Map<string,string>(); return { getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);} }; }
describe('demo adapter integrity',()=>{
 it('does not publish a failed persistence write',()=>{ const s=storage(),repo=new DemoRepository(s),before=repo.getSnapshot(); s.setItem=()=>{throw new Error('quota');}; expect(()=>repo.execute({type:'addSemester',id:'new',name:'다음 학기',opId:'op1',at:new Date().toISOString(),userId:before.userId})).toThrow('quota'); expect(repo.getSnapshot()).toBe(before); });
 it('rejects stale snapshots from a second tab',()=>{const s=storage(),a=new DemoRepository(s),b=new DemoRepository(s),ctx={at:new Date().toISOString(),userId:a.getSnapshot().userId};a.execute({...ctx,type:'addSemester',opId:'a',id:'a',name:'가'});expect(()=>b.execute({...ctx,type:'addSemester',opId:'b',id:'b',name:'나'})).toThrow('다른 창');});
 it('does not replace corrupt saved data with examples',()=>{const s=storage();s.setItem(DEMO_KEY,'broken');expect(()=>new DemoRepository(s)).toThrow();expect(s.getItem(DEMO_KEY)).toBe('broken');});
 it('retains the local calendar date',()=>{expect(localDay(new Date(2026,8,29,0,15))).toBe('2026-09-29');});
});

import { readDraft, saveDraft, type FormDraft } from './demo-repository';
describe('draft shape and unfinished input preservation',()=>{
 const draft: FormDraft={key:'multiple',sessionId:'draft-session',selectedIds:['topic-one'],bodies:{'topic-one':'  아직 쓰는 글\n'},done:{'topic-one':false},trace:{'topic-one':{Cself1:{status:'checked'}}},dateEvidence:{kind:'exact',date:''}};
 it('round-trips whitespace and an unfinished date without turning draft into a record',()=>{
  const s=storage();saveDraft(s,draft);expect(readDraft(s,draft.key)).toEqual(draft);
 });
 it.each([
  {bodies:null}, {bodies:{topic:42}}, {done:{topic:'yes'}}, {trace:{topic:{Cself1:{status:'mastered'}}}},
  {dateEvidence:{kind:'range',from:'2026-09-01'}}, {selectedIds:['topic-one','topic-one']}, {sessionId:''},
  {trace:{topic:{Cself1:{status:'checked',examReview:{answer:'text',checked:'yes',updatedAt:'now'}}}}},
 ])('rejects malformed input without resetting or rewriting its saved bytes: %j',patch=>{
  const s=storage(),raw=JSON.stringify({...draft,...patch}),key=`study-space:demo:draft:${draft.key}`;
  s.setItem(key,raw);expect(()=>readDraft(s,draft.key)).toThrow('초안');expect(s.getItem(key)).toBe(raw);
 });
 it('does not overwrite a previous draft when a malformed object is submitted',()=>{
  const s=storage();saveDraft(s,draft);const before=s.getItem(`study-space:demo:draft:${draft.key}`);
  expect(()=>saveDraft(s,{...draft,bodies:null} as unknown as FormDraft)).toThrow();
  expect(s.getItem(`study-space:demo:draft:${draft.key}`)).toBe(before);
 });
});

describe('one durable local commit for concept-sized command sequences', () => {
  it('retains every revision while writing storage once and rejects a later invalid owner atomically', () => {
    const s = storage(), repo = new DemoRepository(s), before = repo.getSnapshot();
    const originalSet = s.setItem; let writes = 0;
    s.setItem = (key,value) => { writes++; originalSet(key,value); };
    const commands = ['a','b'].map(id => ({type:'addSemester' as const,id,name:id,opId:`bulk-${id}`,at:'2026-10-01T00:00:00Z',userId:before.userId}));
    repo.executeMany(commands);
    expect(writes).toBe(1);
    expect(repo.getSnapshot().revisions.length).toBe(before.revisions.length+2);
    const saved = s.getItem(DEMO_KEY), current = repo.getSnapshot();
    expect(() => repo.executeMany([{...commands[0],id:'c',opId:'bulk-c'},{...commands[1],id:'d',opId:'bulk-d',userId:'other'}])).toThrow();
    expect(repo.getSnapshot()).toBe(current); expect(s.getItem(DEMO_KEY)).toBe(saved);
    s.setItem = () => {throw Error('quota');};
    expect(() => repo.executeMany([{...commands[0],id:'e',opId:'bulk-e'}])).toThrow('quota');
    expect(repo.getSnapshot()).toBe(current);
  });
});
