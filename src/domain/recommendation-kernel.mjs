/** 학기 일정과 수행 근거에 따른 학습 추천의 구현 이론.
 * Webapp recommendation rules. No DOM, database, HTTP, timers or dependencies.
 * Policy constants are engineering proposals, not calibrated learning effects.
 */
export const DAY = 86400000;
export const POLICY = Object.freeze({ version: 'rules-2-webapp', criticalFraction: .1,
  emphasisFraction: .2, refreshFraction: .1, freezeFraction: .1,
  maxCards: 3, shrinkage: 8, minPairs: 8, maxPairs: 20,
  maxMissingFraction: .2, maxAdaptiveLift: .2 });
const time = x => { if(typeof x !== 'string'||!/(?:Z|[+-]\d\d:\d\d)$/.test(x))throw Error('INVALID_TIMESTAMP');const n = Date.parse(x); if (!Number.isFinite(n)) throw Error('INVALID_TIMESTAMP'); return n; };
const dueTime = x => x == null ? Infinity : time(x);
const urgencyAt = (now,due,T) => due == null ? 0 : urgency(now,due,T);
const unit = x => Number.isFinite(x) && x >= 0 && x <= 1;
const sortText = (a,b) => a < b ? -1 : a > b ? 1 : 0;
const stableJSON = value => JSON.stringify((function ordered(x){
  if(Array.isArray(x))return x.map(ordered);
  if(x&&typeof x==='object')return Object.fromEntries(Object.keys(x).sort(sortText).map(k=>[k,ordered(x[k])]));
  return x;
})(value));
const newer = (a,b) => Boolean(a) && (!b || time(a.occurredAt)>time(b.occurredAt) ||
  (time(a.occurredAt)===time(b.occurredAt) && a.sequence>b.sequence));

export function validateModel(m) {
  const ids = xs => {const s=new Set(); for(const x of xs){if(!x.id||s.has(x.id)) throw Error('DUPLICATE_ID');s.add(x.id);}return s;};
  if(m.term != null && time(m.term.end)<=time(m.term.start)) throw Error('INVALID_TERM');
  const targets=ids(m.targets), requirements=ids(m.requirements), assessments=ids(m.assessments);
  ids(m.tasks); ids(m.views ?? []);
  for(const t of m.targets){for(const p of t.prerequisites??[]) if(!targets.has(p)) throw Error('MISSING_PREREQUISITE');}
  for(const r of m.requirements){if(!targets.has(r.targetId)||!['same','new'].includes(r.novelty)||
    !r.facet||!r.rubricVersion||!Number.isFinite(r.minDelayDays)||r.minDelayDays<0||(r.refreshDays!=null&&(!Number.isFinite(r.refreshDays)||r.refreshDays<=0))) throw Error('INVALID_REQUIREMENT');}
  for(const a of m.assessments){if((a.weight!=null&&!unit(a.weight))||!Array.isArray(a.requirementIds)) throw Error('INVALID_ASSESSMENT');
    if(a.opensAt!=null)time(a.opensAt);if(a.dueAt!=null)time(a.dueAt);if(a.opensAt!=null&&a.dueAt!=null&&time(a.opensAt)>time(a.dueAt))throw Error('INVALID_WINDOW');
    if(a.requirementIds.some(r=>!requirements.has(r)))throw Error('MISSING_REQUIREMENT');}
  for(const t of m.tasks){if(t.opensAt!=null)time(t.opensAt);if(t.dueAt!=null)time(t.dueAt);if(t.opensAt!=null&&t.dueAt!=null&&time(t.opensAt)>time(t.dueAt))throw Error('INVALID_WINDOW');
    if(!assessments.has(t.assessmentId))throw Error('MISSING_ASSESSMENT');}
  // Fail closed on cycles, including disconnected cycles.
  const map=new Map(m.targets.map(t=>[t.id,t])), active=new Set(), done=new Set();
  const visit=id=>{if(active.has(id))throw Error('PREREQUISITE_CYCLE');if(done.has(id))return;
    active.add(id);for(const p of map.get(id).prerequisites??[])visit(p);active.delete(id);done.add(id);};
  for(const id of targets) visit(id);
  return true;
}

/** Each logical event has one authoritative revision visible at knowledgeAt.
 * Same revision with different bytes is a synchronization conflict, never LWW.
 */
export function canonicalEvents(events, knowledgeAt, now) {
  const k=time(knowledgeAt), n=time(now), revisions=new Map(), heads=new Map();
  for(const e of events){
    if(!e.id||!Number.isInteger(e.revision)||e.revision<1||!Number.isInteger(e.sequence))throw Error('INVALID_EVENT');
    if(e.occurredAt!=null)time(e.occurredAt);else if(e.kind!=='activity')throw Error('OCCURRENCE_REQUIRED');time(e.knownAt);
    if(time(e.knownAt)>k)continue;
    const key=`${e.id}@${e.revision}`, signature=stableJSON(e);
    if(revisions.has(key)&&revisions.get(key)!==signature)throw Error('REVISION_CONFLICT');
    revisions.set(key,signature);
    const previous=heads.get(e.id);
    if(!previous||e.revision>previous.revision)heads.set(e.id,e);
  }
  return [...heads.values()].filter(e=>!e.deleted&&(e.occurredAt==null||time(e.occurredAt)<=n)).sort((a,b)=>dueTime(a.occurredAt)-dueTime(b.occurredAt)||a.sequence-b.sequence||sortText(a.id,b.id));
}

/** State is specific to target, facet, rubric, novelty and delay requirement. */
export function reduceRequirement(r, events, now) {
  const relevant=events.filter(e=>e.targetId===r.targetId&&e.facet===r.facet&&e.rubricVersion===r.rubricVersion);
  let success=null, failure=null, correction=null, contested=null, seen=false;
  const corrections=[];
  for(const e of relevant){
    seen=true;
    if(e.kind==='correction'){correction=e;corrections.push(e);continue;}
    if(e.kind!=='assessment'||e.assistance!=='none')continue;
    if(e.result==='disputed'){contested=e;continue;}
    if(e.result==='unknown')continue;
    if(!['pass','fail'].includes(e.result)||!['same','new','unknown'].includes(e.novelty))throw Error('INVALID_RESULT');
    // A reproduction failure also warrants attention; a reproduction pass
    // cannot discharge a transfer requirement.
    if(e.result==='fail'){failure=e;continue;}
    const delayValid=Number.isFinite(e.delayDays)&&e.delayDays>=r.minDelayDays&&e.delayVerified===true;
    if(e.novelty!=='unknown'&&(r.novelty==='same'||e.novelty==='new')&&(r.minDelayDays===0||delayValid))success=e;
  }
  const lastDecisive=newer(success,failure)?success:failure;
  if(contested&&newer(contested,lastDecisive))return {status:'disputed',evidenceIds:[contested.id],current:false};
  const linkedCorrection=failure&&corrections.filter(c=>c.errorEventId===failure.id&&newer(c,failure)).at(-1);
  if(linkedCorrection)correction=linkedCorrection;
  if(failure&&newer(failure,success))return {status:linkedCorrection?'corrected_pending':'error_open',
    evidenceIds:[failure.id,...(linkedCorrection?[correction.id]:[])],current:false};
  if(success){const ageDays=(time(now)-time(success.occurredAt))/DAY;
    return {status:'confirmed',current:ageDays<r.refreshDays,ageDays,evidenceIds:[success.id]};}
  return {status:correction?'corrected_pending':seen?'activity_only':'unobserved',evidenceIds:correction?[correction.id]:[],current:false};
}

export function urgency(now,dueAt,horizonDays) {
  const d=(time(dueAt)-time(now))/DAY;
  if(d<0)return 0;
  return 1/(1+d/Math.max(1,POLICY.emphasisFraction*horizonDays));
}

/** Identified bounds for the mean of N performed, due trials, each in [lo,hi].
 * Missing trials MUST remain represented as null, not be filtered beforehand.
 * This is not a confidence interval for future performance.
 */
export function meanBounds(values,lo=0,hi=1) {
  if(!values.length)return {lower:lo,upper:hi,mean:null,total:0,observed:0};
  const observed=values.filter(v=>v!==null);
  if(observed.some(v=>!Number.isFinite(v)||v<lo||v>hi))throw Error('OUT_OF_RANGE');
  const s=observed.reduce((a,b)=>a+b,0), missing=values.length-observed.length;
  return {lower:(s+missing*lo)/values.length,upper:(s+missing*hi)/values.length,
    mean:observed.length?s/observed.length:null,total:values.length,observed:observed.length};
}

/** Pairs must be pre-registered and independently scored, not auto-selected
 * from whichever post-test looks best. One attribution bundle per pair.
 */
export function activitySupport(pairs,stratumKey,action,now) {
  const seen=new Map();
  const trials=pairs.filter(p=>{
    if(p.stratumKey!==stratumKey||p.action!==action||!p.performed||time(p.outcomeDueAt)>time(now))return false;
    if(seen.has(p.id)){if(seen.get(p.id)!==stableJSON(p))throw Error('PAIR_CONFLICT');return false;}
    seen.set(p.id,stableJSON(p));return true;
  }).sort((a,b)=>time(b.outcomeDueAt)-time(a.outcomeDueAt)||sortText(a.id,b.id)).slice(0,POLICY.maxPairs);
  const values=trials.map(p=>{
    if(!unit(p.before)||p.independent!==true||p.rubricMatched!==true||p.attributionBundle!==true)throw Error('INVALID_PAIR');
    if(p.after===null||p.after===undefined)return null;
    if(!unit(p.after))throw Error('INVALID_PAIR');
    return p.after-p.before;
  });
  const outer=meanBounds(values,-1,1);
  const missingTrials=trials.filter((p,i)=>values[i]===null);
  const observedSum=values.filter(v=>v!==null).reduce((a,b)=>a+b,0);
  // Known baselines sharpen missing gain bounds: [-before, 1-before].
  const bounds=trials.length?{...outer,
    lower:(observedSum-missingTrials.reduce((s,p)=>s+p.before,0))/trials.length,
    upper:(observedSum+missingTrials.reduce((s,p)=>s+1-p.before,0))/trials.length}:outer;
  const missing=trials.length-bounds.observed;
  const eligible=trials.length>=POLICY.minPairs&&bounds.observed>=POLICY.minPairs&&missing/trials.length<=POLICY.maxMissingFraction;
  // Observational comparison support only. No causal effect label.
  const shrunk=bounds.lower*trials.length/(POLICY.shrinkage+trials.length);
  const lift=eligible?Math.min(POLICY.maxAdaptiveLift,Math.max(0,shrunk)):0;
  return {...bounds,eligible,lift,stratumKey,action,pairIds:trials.map(p=>p.id)};
}

export function robustWinner(items, incumbentId=null) {
  if(!items.length)return null;
  const sorted=[...items].sort((a,b)=>b.lower-a.lower||sortText(a.id,b.id));
  const best=sorted.find(a=>items.every(b=>a.id===b.id||a.lower>b.upper));
  if(best)return {id:best.id,reason:'robust_dominance'};
  if(items.some(x=>x.id===incumbentId))return {id:incumbentId,reason:'overlap_keep_incumbent'};
  return {id:sorted[0].id,reason:'overlap_default_tiebreak'};
}

export function recommend(model, eventRevisions, now, knowledgeAt=now, controls={}) {
  validateModel(model);
  const events=canonicalEvents(eventRevisions,knowledgeAt,now);
  const T=model.term?(time(model.term.end)-time(model.term.start))/DAY:112;
  const targets=new Map(model.targets.map(t=>[t.id,t]));
  const effectiveRequirements=model.requirements.map(r=>({...r,refreshDays:r.refreshDays??(model.term?Math.max(1,POLICY.refreshFraction*T):Infinity)}));
  const states=Object.fromEntries(effectiveRequirements.map(r=>[r.id,reduceRequirement(r,events,now)]));
  const evaluations=model.assessments.filter(a=>a.status==='active'&&(a.dueAt==null||time(a.dueAt)>=time(now)));
  const completed=new Set(events.filter(e=>e.kind==='task_completed').map(e=>e.taskId));
  const requirementsByTarget=new Map(model.targets.map(t=>[t.id,effectiveRequirements.filter(r=>r.targetId===t.id)]));
  const targetReady=id=>{const rs=requirementsByTarget.get(id);return rs.length>0&&rs.every(r=>states[r.id].status==='confirmed'&&states[r.id].current);};
  const collected=new Map(), expanded=new Map(), warnings=[];
  const add=c=>{const old=collected.get(c.id);if(!old){collected.set(c.id,c);return;}
    old.tier=Math.min(old.tier,c.tier);old.score=Math.max(old.score,c.score);
    old.relatedIds=[...new Set([...old.relatedIds,...c.relatedIds])].sort(sortText);
    old.reasons=[...new Set([...old.reasons,...c.reasons])].sort(sortText);};
  for(const task of model.tasks){
    if(task.status!=='active'||completed.has(task.id)||(task.opensAt!=null&&time(task.opensAt)>time(now))||(task.dueAt!=null&&time(task.dueAt)<time(now)))continue;
    const a=evaluations.find(a=>a.id===task.assessmentId);if(!a)continue;
    const days=task.dueAt==null?Infinity:(time(task.dueAt)-time(now))/DAY;
    const critical=task.required!==false&&days<=Math.max(1,POLICY.criticalFraction*T);
    add({id:`task:${task.id}`,targetId:null,action:task.kind,tier:critical?0:5,
      score:(task.weight??0)*urgencyAt(now,task.dueAt,T),dueAt:task.dueAt,
      relatedIds:[a.id],reasons:[critical?'opportunity_closing':'open_task'],evidenceIds:[]});
  }
  function generate(r,inherited=null,path=[]) {
    const target=targets.get(r.targetId),state=states[r.id];
    if(target.availableAt&&time(target.availableAt)>time(now)){warnings.push({code:'NOT_YET_AVAILABLE',targetId:target.id});return;}
    if(target.materialAvailable===false){warnings.push({code:'MATERIAL_REQUIRED',targetId:target.id});return;}
    if(state.status==='confirmed'&&state.current)return;
    const related=evaluations.filter(a=>a.requirementIds.includes(r.id));
    if(!related.length&&!inherited)return;
    const raw=related.reduce((s,a)=>s+(a.weight??0)*urgencyAt(now,a.dueAt,T),0);
    let score=Math.max(raw,inherited?.score??0);
    let dueAt=[...related.map(a=>a.dueAt),...(inherited?[inherited.dueAt]:[])].sort((a,b)=>dueTime(a)-dueTime(b))[0];
    let relatedIds=[...new Set([...related.map(a=>a.id),...(inherited?.relatedIds??[])])].sort(sortText);
    const previous=expanded.get(r.id);
    if(previous){
      score=Math.max(score,previous.score);
      if(dueTime(previous.dueAt)<dueTime(dueAt))dueAt=previous.dueAt;
      relatedIds=[...new Set([...relatedIds,...previous.relatedIds])].sort(sortText);
      if(score===previous.score&&dueAt===previous.dueAt&&JSON.stringify(relatedIds)===JSON.stringify(previous.relatedIds))return;
    }
    // Score unique evaluation relevance, not duplicate paths or whole task categories.
    score=relatedIds.reduce((s,id)=>{const a=evaluations.find(x=>x.id===id);return s+(a?.weight??0)*urgencyAt(now,a?.dueAt,T);},0);
    expanded.set(r.id,{score,dueAt,relatedIds});
    const unmet=(target.prerequisites??[]).filter(p=>!targetReady(p));
    if(unmet.length){for(const p of unmet){
      const reqs=requirementsByTarget.get(p);
      if(!reqs.length){warnings.push({code:'PREREQUISITE_CRITERION_REQUIRED',targetId:p});continue;}
      for(const pr of reqs)generate(pr,{score,dueAt,relatedIds},[...path,r.targetId]);
    }return;}
    const action=state.status==='disputed'?'resolve_evidence':state.status==='error_open'?'diagnose_correct':
      state.status==='corrected_pending'?'independent_recheck':state.status==='confirmed'?'refresh_check':'independent_check';
    const tier=state.status==='disputed'?1:state.status==='error_open'?2:state.status==='corrected_pending'?3:4;
    add({id:`requirement:${r.id}:${action}`,requirementId:r.id,targetId:r.targetId,action,tier,score,dueAt,
      relatedIds,reasons:[state.status,...(path.length?['prerequisite_blocker']:[])],evidenceIds:state.evidenceIds});
  }
  for(const r of effectiveRequirements)generate(r);
  for(const a of evaluations){if(a.dueAt==null)warnings.push({code:'DEADLINE_UNKNOWN',assessmentId:a.id});}
  const candidates=[...collected.values()].sort((a,b)=>a.tier-b.tier||b.score-a.score||dueTime(a.dueAt)-dueTime(b.dueAt)||sortText(a.id,b.id));
  const grouped=new Map();
  for(const c of candidates){
    const key=c.targetId?`target:${c.targetId}`:c.id;
    if(!grouped.has(key))grouped.set(key,{...c,groupId:key,requirements:[],alternatives:[]});
    const g=grouped.get(key);
    if(c.requirementId)g.requirements.push(c.requirementId);
    g.alternatives.push({id:c.id,action:c.action,requirementId:c.requirementId??null});
    g.relatedIds=[...new Set([...g.relatedIds,...c.relatedIds])].sort(sortText);
    if(c.targetId)g.score=g.relatedIds.reduce((s,id)=>{const a=evaluations.find(x=>x.id===id);return s+(a?.weight??0)*urgencyAt(now,a?.dueAt,T);},0);
  }
  const cards=[...grouped.values()].filter(c=>guidance(c,now,T,controls[c.groupId]??controls[c.id]??{}).visible).sort((a,b)=>a.tier-b.tier||b.score-a.score||dueTime(a.dueAt)-dueTime(b.dueAt)||sortText(a.id,b.id)).slice(0,POLICY.maxCards);
  const elapsed=model.term?(time(now)-time(model.term.start))/DAY:null;
  const phase=elapsed==null?'unspecified':elapsed<0?'before_term':elapsed>=T?'after_term':'in_term';
  return {schemaVersion:1,policyVersion:POLICY.version,now,knowledgeAt,termDays:model.term?T:null,
    phase,termConfigured:!!model.term,calendarWeek:phase==='in_term'?1+Math.floor(elapsed/7):null,progress:elapsed==null?null:Math.min(1,Math.max(0,elapsed/T)),
    states,candidates,cards,warnings};
}

/** Guidance state is separate from evidence. No record does not mean ignored. */
export function guidance(candidate, now, termDays, controls={}) {
  const closed=controls.completed===true||controls.assessmentEnded===true||!candidate;
  if(closed)return {level:0,visible:false,reason:'closed'};
  if(controls.snoozeUntil&&time(controls.snoozeUntil)>time(now))return {level:0,visible:false,reason:'snoozed'};
  const days=candidate.dueAt==null?Infinity:(time(candidate.dueAt)-time(now))/DAY;
  if(days<0)return {level:0,visible:false,reason:'expired'};
  const level=days<=Math.max(1,POLICY.criticalFraction*termDays)?2:
    days<=Math.max(1,POLICY.emphasisFraction*termDays)?1:0;
  return {level,visible:true,reason:level===2?'near_deadline':level===1?'approaching':'ordinary'};
}

export function snapshot(result, modelVersion, inputHash) {
  if(!modelVersion||!inputHash)throw Error('SNAPSHOT_PROVENANCE_REQUIRED');
  return JSON.parse(JSON.stringify({...result,modelVersion,inputHash}));
}
