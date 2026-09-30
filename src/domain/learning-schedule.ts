import type { AppState } from './model';
export type ScheduleKind = 'exam' | 'quiz' | 'assignment' | 'lecture';
export type WorkState = 'unknown' | 'not-done' | 'done';
export interface LearningSchedule { id:string; subjectId:string; name:string; kind:ScheduleKind; goalIds:string[]; targetIds:string[]; dueDate:string; opensDate:string; weight:number|null; status:'active'|'ended'; states:Record<string,WorkState>; dueMeaning:'exam'|'submission'|'attendance'|'personal'|'unknown'; note:string }
export const workLabels: Record<string,string> = { prepare:'과제 준비', submit:'과제 제출', watch:'강의 재생', learn:'강의 학습', attendance:'출석 확인' };
export const scheduleLabels: Record<ScheduleKind,string> = { exam:'시험', quiz:'퀴즈', assignment:'과제', lecture:'온라인 강의' };
export function scheduleSteps(kind:ScheduleKind) { return kind==='assignment'?['prepare','submit']:kind==='lecture'?['watch','learn','attendance']:[]; }
export interface TargetCondition { targetId:string; prerequisiteIds:string[]; materialAvailable:boolean|null }
export interface ComparisonPlan { id:string; targetId:string; action:string; goalId:string; registeredAt:string; before:number; after:number|null; outcomeDueAt:string; independent:boolean; rubricMatched:boolean; attributionBundle:boolean; performed:boolean; note:string }
export interface RecommendationSnapshot { id:string; createdAt:string; dataVersion:string; policyVersion:string; workspaceRevision:number; result:unknown }
const day = (s:string) => s==='' || /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0,10)===s;
export function validateScheduleExtensions(w:{goals:{id:string;targetId:string}[]; schedules?:LearningSchedule[]; conditions?:TargetCondition[]; comparisons?:ComparisonPlan[]; snapshots?:RecommendationSnapshot[]},data:AppState) {
  const node=new Map(data.nodes.map(n=>[n.id,n])), ids=new Set<string>();
  for(const s of w.schedules??[]) {
    if(!s||typeof s.id!=='string'||!s.id||ids.has(s.id)||!data.subjects.some(p=>p.id===s.subjectId)||typeof s.name!=='string'||!s.name.trim()||!['exam','quiz','assignment','lecture'].includes(s.kind)||!['active','ended'].includes(s.status)||!['exam','submission','attendance','personal','unknown'].includes(s.dueMeaning)||typeof s.note!=='string'||!day(s.dueDate)||!day(s.opensDate)||s.opensDate&&s.dueDate&&s.opensDate>s.dueDate||s.weight!==null&&(!Number.isFinite(s.weight)||s.weight<0||s.weight>1)||!Array.isArray(s.goalIds)||!Array.isArray(s.targetIds)||!s.states||typeof s.states!=='object'||Object.values(s.states).some(v=>!['unknown','not-done','done'].includes(v))) throw Error('일정의 날짜·범위·상태를 확인해 주세요.');
    ids.add(s.id);
    if(s.targetIds.some(id=>node.get(id)?.subjectId!==s.subjectId)||s.goalIds.some(id=>!w.goals.some(g=>g.id===id&&node.get(g.targetId)?.subjectId===s.subjectId))) throw Error('일정과 주제의 과목이 다릅니다.');
  }
  const conditions=new Map<string,TargetCondition>();
  for(const c of w.conditions??[]) { if(!c||!node.has(c.targetId)||conditions.has(c.targetId)||!Array.isArray(c.prerequisiteIds)||new Set(c.prerequisiteIds).size!==c.prerequisiteIds.length||![null,true,false].includes(c.materialAvailable)||c.prerequisiteIds.some(id=>!node.has(id)||node.get(id)?.subjectId!==node.get(c.targetId)?.subjectId)) throw Error('선행 관계와 자료 여부를 확인해 주세요.'); conditions.set(c.targetId,c); }
  const seen=new Set<string>(),active=new Set<string>();
  function visit(id:string){if(active.has(id))throw Error('선행 관계가 서로 순환합니다. 관계를 다시 확인해 주세요.');if(seen.has(id))return;active.add(id);for(const p of conditions.get(id)?.prerequisiteIds??[])visit(p);active.delete(id);seen.add(id);}
  for(const id of conditions.keys())visit(id);
  const pairIds=new Set<string>();
  for(const p of w.comparisons??[]) {if(!p||!p.id||pairIds.has(p.id)||!node.has(p.targetId)||typeof p.action!=='string'||!p.action.trim()||!w.goals.some(g=>g.id===p.goalId&&g.targetId===p.targetId)||!Number.isFinite(Date.parse(p.registeredAt))||!Number.isFinite(Date.parse(p.outcomeDueAt))||Date.parse(p.registeredAt)>=Date.parse(p.outcomeDueAt)||!Number.isFinite(p.before)||p.before<0||p.before>1||p.after!==null&&(!Number.isFinite(p.after)||p.after<0||p.after>1)||p.after!==null&&!p.performed||![p.independent,p.rubricMatched,p.attributionBundle,p.performed].every(v=>typeof v==='boolean')||typeof p.note!=='string')throw Error('비교 기록의 기준·점수·시점을 확인해 주세요.');pairIds.add(p.id);}
  if(w.snapshots!==undefined&&(!Array.isArray(w.snapshots)||w.snapshots.some(s=>!s||typeof s.id!=='string'||!Number.isFinite(Date.parse(s.createdAt))||typeof s.dataVersion!=='string'||typeof s.policyVersion!=='string'||!Number.isSafeInteger(s.workspaceRevision))))throw Error('추천 이력을 확인해 주세요.');
}
