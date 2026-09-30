import { readScheduleDraft, writeScheduleDraft, clearScheduleDraft } from '../data/learning-editor-draft';
import { useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import { dateDeadline, recommendationInput, nextStudy, validateRecommendations, type RecommendationWorkspace } from '../domain/recommendation-workspace';
import { scheduleLabels, scheduleSteps, workLabels, type LearningSchedule, type ScheduleKind, type TargetCondition, type ComparisonPlan } from '../domain/learning-schedule';
import { activitySupport } from '../domain/recommendation-kernel.mjs';
import { Button, Card, Checkbox, Input, Modal, Select, Textarea } from './index';
import './learning-schedule.css';
const blankSchedule = ():LearningSchedule => ({id:crypto.randomUUID(),subjectId:'',name:'',kind:'exam',goalIds:[],targetIds:[],dueDate:'',opensDate:'',weight:null,status:'active',states:{},dueMeaning:'exam',note:''});
export function LearningScheduleEditor({data,workspace,subjectIds,onChange,disabled=false}: {data:AppState;workspace:RecommendationWorkspace;subjectIds:string[];onChange:(w:RecommendationWorkspace)=>boolean;disabled?:boolean}) {
  const [open,setOpen]=useState(false),[draft,setDraft]=useState<LearningSchedule>(()=>blankSchedule()),[error,setError]=useState('');
  const draftKey=useRef('new'),draftRaw=useRef<string|null>(null);
  const loadDraft=(initial:LearningSchedule,key:string)=>{draftKey.current=key;try{const saved=readScheduleDraft(data,key);draftRaw.current=saved.raw;setDraft(saved.draft??initial);setError('');setOpen(true);}catch(e){setError(e instanceof Error?e.message:'일정 초안 확인이 필요합니다.');}};
  const [condition,setCondition]=useState<TargetCondition>({targetId:'',prerequisiteIds:[],materialAvailable:null});
  const [pair,setPair]=useState({targetId:'',goalId:'',action:'',before:'',date:'',note:''});
  const [scoreInputs,setScoreInputs]=useState<Record<string,string>>({});
  const subjects=data.subjects.filter(s=>!s.deletedAt&&subjectIds.includes(s.id));
  const nodes=data.nodes.filter(n=>!n.deletedAt&&n.role==='topic'&&subjectIds.includes(n.subjectId));
  const patch=(p:Partial<LearningSchedule>)=>{const next={...draft,...p};setDraft(next);try{draftRaw.current=writeScheduleDraft(data,draftKey.current,next,draftRaw.current);}catch(e){setError(e instanceof Error?e.message:'일정 초안은 화면에 유지했습니다.');}};
  const change=(w:RecommendationWorkspace)=>{if(disabled)return false;try{validateRecommendations(w,data);if(onChange(w)){setError('');return true;}}catch(e){setError(e instanceof Error?e.message:'내용을 저장하지 못했습니다.');}return false;};
  const save=()=>{const schedules=[...(workspace.schedules??[])]; const index=schedules.findIndex(s=>s.id===draft.id);if(index<0)schedules.push(draft);else schedules[index]=draft;if(change({...workspace,schedules})){clearScheduleDraft(data,draftKey.current,draftRaw.current);draftRaw.current=null;setOpen(false);}};
  const update=(s:LearningSchedule,p:Partial<LearningSchedule>)=>change({...workspace,schedules:(workspace.schedules??[]).map(v=>v.id===s.id?{...v,...p}:v)});
  const registerPair=()=>{
    const before=Number(pair.before),date=dateDeadline(pair.date),goal=workspace.goals.find(g=>g.id===pair.goalId);
    if(!pair.before.trim()||!goal||!pair.action.trim()||!date||Date.parse(date)<=Date.now()||before<0||before>1){setError('확인 기준·방법·이전 점수와 앞으로 확인할 날짜를 남겨 주세요. 점수는 0부터 1 사이입니다.');return;}
    const entry:ComparisonPlan={id:crypto.randomUUID(),targetId:goal.targetId,goalId:goal.id,action:pair.action,registeredAt:new Date().toISOString(),before,after:null,outcomeDueAt:date,independent:false,rubricMatched:false,attributionBundle:false,performed:false,note:pair.note};
    if(change({...workspace,comparisons:[...(workspace.comparisons??[]),entry]}))setPair({...pair,before:'',note:''});
  };
  const finishPair=(p:ComparisonPlan)=>{const text=scoreInputs[p.id]??'',after=text.trim()?Number(text):null;if(Date.now()<Date.parse(p.outcomeDueAt)){setError('사전에 정한 확인 날짜가 지난 뒤 결과를 남겨 주세요.');return;}if(after!==null&&(!Number.isFinite(after)||after<0||after>1)){setError('점수는 0부터 1 사이입니다.');return;}change({...workspace,comparisons:(workspace.comparisons??[]).map(x=>x.id===p.id?{...x,after,performed:true}:x)});};
  const pairUpdate=(p:ComparisonPlan,field:'independent'|'rubricMatched'|'attributionBundle',value:boolean)=>change({...workspace,comparisons:(workspace.comparisons??[]).map(x=>x.id===p.id?{...x,[field]:value}:x)});
  const archiveSnapshot=()=>{const now=new Date().toISOString(),input=recommendationInput(data,workspace,subjectIds);const result=nextStudy(data,workspace,now,subjectIds);const dataVersion=JSON.stringify({entityVersions:data.records.map(r=>[r.id,r.version]),model:input.model,events:input.events,controls:workspace.controls});change({...workspace,snapshots:[...(workspace.snapshots??[]),{id:crypto.randomUUID(),createdAt:now,dataVersion,policyVersion:result.policyVersion,workspaceRevision:workspace.revision,result}]});};
  return <fieldset disabled={disabled} style={{border:0,padding:0,minWidth:0}}><details className="learning-schedules" id="learning-schedules"><summary>일정·선행 관계·추천 근거</summary>
    <p className="muted">필요한 내용만 남겨 주세요. 시험·과제·출석은 공부함 체크와 별도로 관리합니다.</p>
    {error&&<p role="alert">{error}</p>}
    <Button onClick={()=>{loadDraft(blankSchedule(),'new');}}>시험·과제·강의 일정 추가</Button>
    <div className="learning-schedule-list">{(workspace.schedules??[]).filter(s=>subjectIds.includes(s.subjectId)).map(s=><Card key={s.id}><p className="muted">{scheduleLabels[s.kind]} · {data.subjects.find(x=>x.id===s.subjectId)?.name}</p><h3>{s.name}</h3><p>{s.dueDate||'기한 미정'} · {({exam:'시험일',submission:'제출 기한',attendance:'출석 기한',personal:'개인 목표',unknown:'기한 의미 미정'})[s.dueMeaning]}{s.weight!==null?` · 비중 ${Math.round(s.weight*100)}%`:''}</p>{s.note&&<p className="next-study-answer">{s.note}</p>}
      {scheduleSteps(s.kind).map(step=><Select key={step} label={`${s.name} · ${workLabels[step]}`} value={s.states[step]??'unknown'} onChange={e=>update(s,{states:{...s.states,[step]:e.target.value as 'unknown'|'done'|'not-done'}})}><option value="unknown">미확인</option><option value="not-done">아직 하지 않음</option><option value="done">직접 확인한 완료</option></Select>)}
      {s.targetIds.length>0&&<p className="muted">범위: {s.targetIds.map(id=>data.nodes.find(n=>n.id===id)?.name??id).join(', ')}</p>}
      {['exam','quiz'].includes(s.kind)&&s.targetIds.some(id=>!workspace.goals.some(g=>g.targetId===id))&&<p className="muted">범위 중 수행 확인 기준이 없는 주제가 있습니다. ‘확인할 내용 추가’에서 기준을 남기면 추천에 연결됩니다.</p>}
      <div className="actions"><Button variant="quiet" onClick={()=>{loadDraft(structuredClone(s),s.id);}}>일정 수정</Button><Button variant="quiet" onClick={()=>update(s,{status:s.status==='active'?'ended':'active'})}>{s.status==='active'?'일정 보관':'일정 다시 열기'}</Button></div>{s.status==='ended'&&<p className="muted">보관한 일정입니다. 완료를 뜻하지 않으며 원문과 상태는 남아 있습니다.</p>}
    </Card>)}</div>
    <details><summary>먼저 공부할 관계와 자료 여부</summary><p className="muted">목차의 상하위 구조를 선행 관계로 자동 해석하지 않습니다.</p>
      <Select label="관계를 남길 주제" value={condition.targetId} onChange={e=>setCondition(workspace.conditions?.find(c=>c.targetId===e.target.value)??{targetId:e.target.value,prerequisiteIds:[],materialAvailable:null})}><option value="">주제 선택</option>{nodes.map(n=><option key={n.id} value={n.id}>{n.name}</option>)}</Select>
      <div className="learning-schedule-choices">{nodes.filter(n=>n.id!==condition.targetId&&n.subjectId===nodes.find(n=>n.id===condition.targetId)?.subjectId).map(n=><Checkbox key={n.id} label={`먼저 확인할 주제: ${n.name}`} checked={condition.prerequisiteIds.includes(n.id)} onChange={e=>setCondition(c=>({...c,prerequisiteIds:e.target.checked?[...c.prerequisiteIds,n.id]:c.prerequisiteIds.filter(id=>id!==n.id)}))}/>)}</div>
      <Select label="공부 자료 이용 가능 여부" value={condition.materialAvailable===null?'unknown':condition.materialAvailable?'yes':'no'} onChange={e=>setCondition(c=>({...c,materialAvailable:e.target.value==='unknown'?null:e.target.value==='yes'}))}><option value="unknown">미확인</option><option value="yes">자료를 이용할 수 있어요</option><option value="no">지금 자료를 이용할 수 없어요</option></Select>
      <Button disabled={!condition.targetId} onClick={()=>change({...workspace,conditions:[...(workspace.conditions??[]).filter(c=>c.targetId!==condition.targetId),condition]})}>선행 관계 저장</Button>
    </details>
    <details><summary>방법별 비교와 개인화 · 선택</summary><p className="muted">비교할 방법과 확인 날짜를 먼저 정합니다. 같은 기준의 독립 채점과 한 비교에 대응하는 활동이 확인된 자료만 계산에 사용합니다. 관찰된 비교이며 학습 효과를 증명하지는 않습니다.</p>
      <Select label="비교할 확인 기준" value={pair.goalId} onChange={e=>setPair(p=>({...p,goalId:e.target.value}))}><option value="">확인 기준 선택</option>{workspace.goals.filter(g=>nodes.some(n=>n.id===g.targetId)).map(g=><option key={g.id} value={g.id}>{g.label}</option>)}</Select>
      <Input label="비교할 공부 방법" value={pair.action} onChange={e=>setPair(p=>({...p,action:e.target.value}))}/><Input label="이전 점수 · 0–1" type="number" min="0" max="1" step="0.01" value={pair.before} onChange={e=>setPair(p=>({...p,before:e.target.value}))}/><Input label="결과 확인 날짜" type="date" value={pair.date} onChange={e=>setPair(p=>({...p,date:e.target.value}))}/><Textarea label="비교 기준과 조건 · 선택" value={pair.note} onChange={e=>setPair(p=>({...p,note:e.target.value}))}/><Button onClick={registerPair}>비교 계획 먼저 저장</Button>
      {(workspace.comparisons??[]).filter(p=>nodes.some(n=>n.id===p.targetId)).map(p=>{
        const usable=(workspace.comparisons??[]).filter(x=>x.goalId===p.goalId&&x.independent&&x.rubricMatched&&x.attributionBundle).map(x=>({...x,stratumKey:x.goalId}));
        const support=activitySupport(usable,p.goalId,p.action,new Date().toISOString());
        return <div key={p.id} className="learning-comparison"><strong>{p.action} · {workspace.goals.find(g=>g.id===p.goalId)?.label}</strong><p>{p.note}</p><p className="muted">{new Date(p.outcomeDueAt).toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul'})} 확인 · 이전 {p.before} → 이후 {p.after??'결과 미정'}</p>
          <Checkbox label="독립 채점 결과를 확인했어요" checked={p.independent} onChange={e=>pairUpdate(p,'independent',e.target.checked)}/><Checkbox label="같은 확인 기준으로 채점했어요" checked={p.rubricMatched} onChange={e=>pairUpdate(p,'rubricMatched',e.target.checked)}/><Checkbox label="이 비교에 대응하는 활동·조건을 확인했어요" checked={p.attributionBundle} onChange={e=>pairUpdate(p,'attributionBundle',e.target.checked)}/>
          {!p.performed&&<><Input label={`${p.action} · 이후 점수 · 선택`} type="number" min="0" max="1" step="0.01" value={scoreInputs[p.id]??''} onChange={e=>setScoreInputs(x=>({...x,[p.id]:e.target.value}))}/><Button onClick={()=>finishPair(p)}>활동 후 확인 결과 저장</Button></>}
          <p className="muted">비교 {support.total}건 · 관측 {support.observed}건 · 가능한 변화 {support.lower.toFixed(2)}–{support.upper.toFixed(2)} · {support.eligible?'개인화 계산 조건 충족':'표본·결측 조건이 부족해 기본 추천 유지'}</p>
        </div>;})}
    </details>
    <details><summary>추천 당시 근거 보관</summary><Button onClick={archiveSnapshot}>현재 추천과 계산 근거 보관</Button>{(workspace.snapshots??[]).map(s=><details key={s.id}><summary>{new Date(s.createdAt).toLocaleString('ko-KR')} · {s.policyVersion}</summary><p>입력 버전과 결과를 함께 보존했습니다. 지금의 추천과 다를 수 있습니다.</p><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(s.result,null,2)}</pre></details>)}</details>
    <Modal open={open} title="시험·과제·강의 일정" onClose={()=>setOpen(false)}><div className="learning-schedule-form">
      <Input label="일정 이름" value={draft.name} onChange={e=>patch({name:e.target.value})}/><Select label="일정 과목" value={draft.subjectId} onChange={e=>patch({subjectId:e.target.value,targetIds:[],goalIds:[]})}><option value="">과목 선택</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Select>
      <Select label="일정 종류" value={draft.kind} onChange={e=>{const kind=e.target.value as ScheduleKind;patch({kind,dueMeaning:kind==='assignment'?'submission':kind==='lecture'?'attendance':'exam'});}}>{Object.entries(scheduleLabels).map(([id,label])=><option key={id} value={id}>{label}</option>)}</Select>
      <div className="learning-schedule-columns"><Input label="시작 가능일 · 선택" type="date" value={draft.opensDate} onChange={e=>patch({opensDate:e.target.value})}/><Input label="일정 기한 · 선택" type="date" value={draft.dueDate} onChange={e=>patch({dueDate:e.target.value})}/><Input label="성적 비중 · % · 선택" type="number" min="0" max="100" value={draft.weight===null?'':draft.weight*100} onChange={e=>patch({weight:e.target.value===''?null:Number(e.target.value)/100})}/></div>
      <Select label="기한의 의미" value={draft.dueMeaning} onChange={e=>patch({dueMeaning:e.target.value as LearningSchedule['dueMeaning']})}><option value="exam">시험일</option><option value="submission">제출 기한</option><option value="attendance">출석 기한</option><option value="personal">개인 목표</option><option value="unknown">미정</option></Select>
      <fieldset><legend>실제 일정의 주제 범위 · 선택</legend><div className="learning-schedule-choices">{nodes.filter(n=>n.subjectId===draft.subjectId).map(n=><Checkbox key={n.id} label={n.name} checked={draft.targetIds.includes(n.id)} onChange={e=>patch({targetIds:e.target.checked?[...draft.targetIds,n.id]:draft.targetIds.filter(id=>id!==n.id)})}/>)}</div></fieldset>
      <Textarea label="일정 메모 · 선택" value={draft.note} onChange={e=>patch({note:e.target.value})}/>{error&&<p role="alert">{error}</p>}<Button variant="primary" onClick={save}>일정 저장</Button>
    </div></Modal>
  </details></fieldset>;
}
