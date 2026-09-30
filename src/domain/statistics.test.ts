import {describe,it,expect} from 'vitest';
import {createDemoState} from './fixtures';
import {applyCommand} from './commands';
import {emptyRecommendations,makeResultEvent,emptyResponse} from './recommendation-workspace';
import {statistics,statisticBounds,datePlacement,koreanDay} from './statistics';
const at='2026-10-01T01:00:00Z',targetId='demo-topic-function';
const context={userId:'demo-learner',namespace:'demo' as const,at};
describe('source-backed statistics and uncertainty',()=>{
 it('counts one session across subjects, text-only coverage and independent evidence separately',()=>{
  let data=createDemoState(); data=applyCommand(data,{...context,type:'saveRecords',opId:'a',sessionId:'s',dateEvidence:{kind:'exact',date:'2026-09-30'},entries:[{targetId,done:true,trace:{Td1:{status:'checked'}}},{targetId:'demo-topic-force',done:true}]});
  data=applyCommand(data,{...context,type:'saveRecords',opId:'b',sessionId:'text',dateEvidence:{kind:'exact',date:'2026-09-30'},entries:[{targetId:'demo-topic-graph',done:false,body:'原文\n  조건'}]});
  const workspace=emptyRecommendations(data);const before=JSON.stringify(data);const metrics=statistics(data,workspace,{from:'2026-09-01',to:'2026-10-01'},at);const bound=(id:string)=>statisticBounds(metrics.find(m=>m.id===id)!,'2026-09-01','2026-10-01');
  expect(bound('sessions').lower).toBe(1);expect(bound('coverage').lower).toBe(3);expect(bound('writing').lower).toBe(1);expect(bound('attempts').lower).toBe(0);expect(metrics.find(m=>m.id==='coverage')!.denominator).toBe(3);expect(JSON.stringify(data)).toBe(before);
 });
 it('keeps unknown dates out of the timeline and uncertain repetitions as bounds',()=>{
  let data=createDemoState();data=applyCommand(data,{...context,type:'saveRecords',opId:'a',sessionId:'s',dateEvidence:{kind:'range',from:'2026-09-20',to:'2026-10-02'},entries:[{targetId,done:true,trace:{Rd1:{status:'checked',repeats:[{id:'p',kind:'minimum',count:3,dateEvidence:{kind:'exact',date:'2026-09-30'}},{id:'u',kind:'unknown',count:null}]}}}]});
  const metrics=statistics(data,emptyRecommendations(data),{from:'2026-09-29',to:'2026-09-30'},at);
  expect(statisticBounds(metrics[0],'2026-09-29','2026-09-30')).toMatchObject({lower:0,upper:1});expect(statisticBounds(metrics[3],'2026-09-29','2026-09-30')).toMatchObject({lower:3,upper:null,undated:1});
  expect(datePlacement({kind:'unknown'},'2026-09-01','2026-10-01')).toBe('undated');expect(koreanDay('2026-09-30T16:00:00Z')).toBe('2026-10-01');
 });
 it('filters descendants, tombstones, scope and same-name topics by stable IDs',()=>{
  const data=createDemoState(),w=emptyRecommendations(data);data.nodes.find(n=>n.id==='demo-topic-force')!.name=data.nodes.find(n=>n.id===targetId)!.name;
  const metrics=statistics(data,w,{from:'2026-09-01',to:'2026-10-01',subjectIds:['demo-subject-math'],nodeId:'demo-outline-functions'},at);expect(metrics[1].denominator).toBe(2);
  data.nodes.find(n=>n.id===targetId)!.deletedAt=at;expect(statistics(data,w,{from:'2026-09-01',to:'2026-10-01',subjectIds:['demo-subject-math']},at)[1].denominator).toBe(1);
 });
 it('uses canonical event revisions, excluding assisted pass and unknown results',()=>{
  const data=createDemoState(),w=emptyRecommendations(data);const g={id:'goal',targetId,label:'조건',dueDate:'',novelty:'new' as const,createdAt:at,ended:false};w.goals=[g];const e=makeResultEvent(g,{...emptyResponse(),result:'pass',assistance:'none',novelty:'new'},w,at,'pass');w.events=[e,{...e,revision:2,result:'fail'},{...e,id:'help',assistance:'notes'},{...e,id:'unknown',result:'unknown'}];const metrics=statistics(data,w,{from:'2026-09-01',to:'2026-10-02'},at);expect(metrics[5].items).toHaveLength(1);expect(metrics[6].items).toHaveLength(0);
 });
});
