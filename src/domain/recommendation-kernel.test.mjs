import { it } from 'vitest';
import assert from 'node:assert/strict';
import {canonicalEvents,reduceRequirement,meanBounds,urgency,recommend,guidance,
 activitySupport,robustWinner,validateModel,snapshot,DAY} from './recommendation-kernel.mjs';
const check=(name,fn)=>it(name,fn);
const now='2026-10-20T00:00:00Z';
const r={id:'r1',targetId:'t1',facet:'application',rubricVersion:'rv1',novelty:'new',minDelayDays:0,refreshDays:7};
const ev=(id,kind,result='unknown',extra={})=>({id,revision:1,sequence:1,knownAt:'2026-10-10T01:00:00Z',occurredAt:'2026-10-10T00:00:00Z',
 targetId:'t1',facet:'application',rubricVersion:'rv1',kind,result,assistance:'none',novelty:'new',...extra});
const m={schemaVersion:1,term:{start:'2026-09-01T00:00:00Z',end:'2026-12-22T00:00:00Z',timezone:'Asia/Seoul'},
 targets:[{id:'t1',name:'정사영',prerequisites:[],materialAvailable:true}],requirements:[r],views:[{id:'v1',targetIds:['t1']}],
 assessments:[{id:'mid',weight:.4,status:'active',opensAt:'2026-09-01T00:00:00Z',dueAt:'2026-10-26T00:00:00Z',requirementIds:['r1']}],
 tasks:[{id:'hw1',assessmentId:'mid',kind:'submit',status:'active',opensAt:'2026-10-01T00:00:00Z',dueAt:'2026-10-21T00:00:00Z'}]};
check('unknown is not failure',()=>assert.equal(reduceRequirement(r,[ev('a','assessment')],now).status,'activity_only'));
check('assisted pass is not independent confirmation',()=>assert.notEqual(reduceRequirement(r,[ev('a','assessment','pass',{assistance:'notes'})],now).status,'confirmed'));
check('same-item pass does not prove transfer',()=>assert.notEqual(reduceRequirement(r,[ev('a','assessment','pass',{novelty:'same'})],now).status,'confirmed'));
check('old confirmation is stale, not failure',()=>{const s=reduceRequirement(r,[ev('a','assessment','pass')],now);assert.equal(s.status,'confirmed');assert.equal(s.current,false);});
check('verified delay required',()=>{const delayed={...r,minDelayDays:3};assert.notEqual(reduceRequirement(delayed,[ev('a','assessment','pass',{delayDays:5,delayVerified:false})],now).status,'confirmed');});
check('correction does not erase failure',()=>assert.equal(reduceRequirement(r,[ev('a','assessment','fail'),ev('b','correction','unknown',{sequence:2,errorEventId:'a'})],now).status,'corrected_pending'));
check('later independent confirmation closes error',()=>assert.equal(reduceRequirement(r,[ev('a','assessment','fail'),ev('b','assessment','pass',{sequence:2})],now).status,'confirmed'));
check('disputed evidence has separate state',()=>assert.equal(reduceRequirement(r,[ev('a','assessment','disputed')],now).status,'disputed'));
check('duplicate delivery is idempotent',()=>assert.equal(canonicalEvents([ev('a','activity'),ev('a','activity')],now,now).length,1));
check('revision conflicts rejected',()=>assert.throws(()=>canonicalEvents([ev('a','activity'),ev('a','assessment','fail')],now,now),/REVISION_CONFLICT/));
check('late knowledge cannot rewrite past snapshot',()=>assert.equal(canonicalEvents([ev('a','assessment','pass',{knownAt:'2026-10-22T00:00:00Z'})],now,now).length,0));
check('latest visible revision replaces earlier one',()=>assert.equal(canonicalEvents([ev('a','assessment','fail'),ev('a','assessment','pass',{revision:2})],now,now)[0].result,'pass'));
check('tombstone removes current evidence',()=>assert.equal(canonicalEvents([ev('a','activity'),ev('a','activity','unknown',{revision:2,deleted:true})],now,now).length,0));
check('missing binary outcomes have sharp bounds',()=>assert.deepEqual(meanBounds([1,1,1,1,null,null,null,null,null,null]),{lower:.4,upper:1,mean:1,total:10,observed:4}));
check('missing gains have bounded uncertainty',()=>{const x=meanBounds([.3,null],-1,1);assert.equal(x.lower,-.35);assert.equal(x.upper,.65);});
check('urgency increases toward deadline',()=>assert.ok(urgency(now,'2026-10-21T00:00:00Z',112)>urgency(now,'2026-11-21T00:00:00Z',112)));
check('relative dates scale with horizon',()=>assert.ok(Math.abs(urgency(now,new Date(Date.parse(now)+20*DAY).toISOString(),100)-urgency(now,new Date(Date.parse(now)+40*DAY).toISOString(),200))<1e-12));
check('critical opportunity precedes higher-scoring study',()=>assert.equal(recommend(m,[],now).cards[0].id,'task:hw1'));
check('completed task terminates recommendation',()=>assert.ok(!recommend(m,[ev('done','task_completed','unknown',{taskId:'hw1'})],now).cards.some(c=>c.id==='task:hw1')));
check('UI duplication preserves every recommendation',()=>{const mm=structuredClone(m);mm.views=Array.from({length:10},(_,i)=>({id:`v${i}`,targetIds:['t1']}));assert.deepEqual(recommend(mm,[],now).candidates,recommend(m,[],now).candidates);});
check('closed evaluation ends its suggestions',()=>{const mm=structuredClone(m);mm.assessments[0].status='ended';assert.equal(recommend(mm,[],now).cards.length,0);});
check('DAG blocker inherits evaluation relevance',()=>{const mm=structuredClone(m);mm.targets.push({id:'p1',prerequisites:[],materialAvailable:true});mm.requirements.push({...r,id:'rp',targetId:'p1'});mm.targets[0].prerequisites=['p1'];const out=recommend(mm,[],now);assert.ok(out.candidates.some(c=>c.targetId==='p1'&&c.relatedIds.includes('mid')));assert.ok(!out.candidates.some(c=>c.targetId==='t1'));});
check('cycles are rejected',()=>{const mm=structuredClone(m);mm.targets[0].prerequisites=['t1'];assert.throws(()=>validateModel(mm),/PREREQUISITE_CYCLE/);});
check('materials gap is explicit',()=>{const mm=structuredClone(m);mm.targets[0].materialAvailable=false;assert.ok(recommend(mm,[],now).warnings.some(x=>x.code==='MATERIAL_REQUIRED'));});
check('snooze suspends guidance without changing state',()=>assert.equal(guidance(recommend(m,[],now).cards[0],now,112,{snoozeUntil:'2026-10-21T00:00:00Z'}).visible,false));
check('completed guidance is closed',()=>assert.equal(guidance(recommend(m,[],now).cards[0],now,112,{completed:true}).reason,'closed'));
check('overlapping intervals do not force a switch',()=>assert.equal(robustWinner([{id:'a',lower:.4,upper:.8},{id:'b',lower:.5,upper:.9}],'a').id,'a'));
check('strict interval dominance selects winner',()=>assert.equal(robustWinner([{id:'a',lower:.4,upper:.6},{id:'b',lower:.7,upper:.8}],'a').id,'b'));
check('small samples cannot adapt',()=>assert.equal(activitySupport([], 's','explain',now).lift,0));
check('deduplicated comparable pairs permit bounded observational lift',()=>{const ps=Array.from({length:10},(_,i)=>({id:`p${i}`,stratumKey:'s',action:'explain',performed:true,outcomeDueAt:'2026-10-15T00:00:00Z',before:.3,after:.7,independent:true,rubricMatched:true,attributionBundle:true}));const a=activitySupport([...ps,ps[0]],'s','explain',now);assert.equal(a.total,10);assert.ok(a.eligible&&a.lift<=.2);});
check('immutable snapshot has provenance',()=>{const o=recommend(m,[],now);const s=snapshot(o,'model1','examplehash');o.cards.length=0;assert.ok(s.cards.length>0&&s.inputHash==='examplehash');});
check('unlinked correction cannot close a specific error',()=>assert.equal(reduceRequirement(r,[ev('a','assessment','fail'),ev('b','correction','unknown',{sequence:2,errorEventId:'another'})],now).status,'error_open'));
check('event input order does not change the decision',()=>{const es=[ev('a','assessment','fail'),ev('b','assessment','pass',{sequence:2})];assert.deepEqual(recommend(m,es,now),recommend(m,[...es].reverse(),now));});
check('several requirements of one target share one card',()=>{const mm=structuredClone(m);mm.requirements.push({...r,id:'r2',facet:'definition'});mm.assessments[0].requirementIds.push('r2');const out=recommend(mm,[],now);assert.equal(out.cards.filter(c=>c.targetId==='t1').length,1);assert.equal(out.cards.find(c=>c.targetId==='t1').requirements.length,2);});
check('conflicting copies of the same outcome pair are rejected',()=>{const p={id:'p',stratumKey:'s',action:'x',performed:true,outcomeDueAt:'2026-10-15T00:00:00Z',before:.3,after:.7,independent:true,rubricMatched:true,attributionBundle:true};assert.throws(()=>activitySupport([p,{...p,after:.8}],'s','x',now),/PAIR_CONFLICT/);});
check('known baselines sharpen missing improvement bounds',()=>{const p={stratumKey:'s',action:'x',performed:true,outcomeDueAt:'2026-10-15T00:00:00Z',independent:true,rubricMatched:true,attributionBundle:true};const s=activitySupport([{...p,id:'p1',before:.3,after:.6},{...p,id:'p2',before:.8,after:null}],'s','x',now);assert.ok(Math.abs(s.lower+.25)<1e-12&&Math.abs(s.upper-.25)<1e-12);});
check('JSON property order does not create a false synchronization conflict',()=>{const e=ev('a','activity');const reordered=Object.fromEntries(Object.entries(e).reverse());assert.equal(canonicalEvents([e,reordered],now,now).length,1);});
check('automatic refresh window changes with term length',()=>{const mm=structuredClone(m);delete mm.requirements[0].refreshDays;const es=[ev('a','assessment','pass')];assert.equal(recommend(mm,es,now).states.r1.current,true);mm.term.end='2026-10-31T00:00:00Z';assert.equal(recommend(mm,es,now).states.r1.current,false);});
check('calendar week and relative progress are explicit',()=>{const o=recommend(m,[],now);assert.equal(o.calendarWeek,8);assert.equal(o.phase,'in_term');assert.ok(o.progress>0&&o.progress<1);assert.equal(recommend(m,[],m.term.end).calendarWeek,null);});
