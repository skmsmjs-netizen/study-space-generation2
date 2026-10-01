import { beforeEach, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { DemoRepository } from '../data/demo-repository';
import { readLearningPlan, saveLearningPlan } from '../data/learning-plan';
import { emptyRecommendations } from '../domain/recommendation-workspace';
import { MaterialCardLibrary } from './material-card-library';
import { PerformanceFromSource } from './performance-from-source';
import { PerformanceEvidence } from './performance-evidence';
import { readSourceResultDraft, writeSourceResultDraft } from '../data/source-performance-draft';
const at='2026-10-01T01:00:00.000Z',topicId='demo-topic-function';
beforeEach(()=>{localStorage.clear();sessionStorage.clear();});
it('restores unsubmitted source-result selections after unmount/reconnect and saves once',()=>{
 const repo=new DemoRepository(localStorage),initial=repo.getSnapshot(),context={userId:initial.userId,namespace:initial.namespace,at};
 repo.execute({...context,opId:'memo',type:'saveMemo',id:'exam-practice:ui',expectedVersion:0,ownerId:topicId,body:'풀이 原文',strokes:[]});
 const w=emptyRecommendations(initial);w.goals=[{id:'goal',targetId:topicId,label:'조건',novelty:'same',createdAt:at,ended:false,dueDate:''}];saveLearningPlan(repo,w,null);
 const props={data:repo.getSnapshot(),repository:repo,onSaved:()=>undefined,kind:'exam-memo' as const,id:'exam-practice:ui'};
 let view=render(<PerformanceFromSource {...props} />);fireEvent.click(screen.getByRole('button',{name:'이 답안으로 수행 결과 남기기'}));fireEvent.change(screen.getByLabelText('수행 결과'),{target:{value:'pass'}});fireEvent.change(screen.getByLabelText('도움 여부'),{target:{value:'notes'}});view.unmount();
 view=render(<PerformanceFromSource {...props} />);fireEvent.click(screen.getByRole('button',{name:'이 답안으로 수행 결과 남기기'}));expect(screen.getByLabelText('수행 결과')).toHaveValue('pass');expect(screen.getByLabelText('도움 여부')).toHaveValue('notes');expect(screen.getByLabelText('문항의 새로움')).toHaveValue('unknown');fireEvent.click(screen.getByRole('button',{name:/^결과\ 남기기$/}));expect(readLearningPlan(repo.getSnapshot()).workspace.events).toHaveLength(1);
});
it('shows twenty of eight hundred cards, searches beyond the first page and expands only the selected source',()=>{
 const repo=new DemoRepository(localStorage),data=structuredClone(repo.getSnapshot());
 data.studyMaterials=Array.from({length:8},(_,m)=>({id:`mat${m}`,version:1,userId:data.userId,namespace:data.namespace,createdAt:at,updatedAt:at,deletedAt:null,title:`자료${m}`,subjectId:'demo-subject-math',topicId,sourceText:'원문',audio:null,results:[{id:'result',at,model:'fixture',segments:[{id:'s',text:'출처 문장',start:null,end:null}],summary:[],cards:Array.from({length:100},(_,n)=>({id:`c${n}`,question:`질문${m}-${n}`,answer:`정답${m}-${n}`,sourceIds:['s'],excluded:false}))}]}));
 render(<MaterialCardLibrary data={data} repository={repo} onSaved={()=>undefined} />);
 expect(screen.getAllByRole('article')).toHaveLength(20);expect(screen.queryByText('정답0-0')).toBeNull();fireEvent.click(screen.getByRole('button',{name:'다음 자료 카드'}));expect(screen.getByRole('button',{name:/^질문0\-20$/})).toBeInTheDocument();fireEvent.change(screen.getByLabelText('자료 카드 찾기'),{target:{value:'질문7-99'}});expect(screen.getAllByRole('article')).toHaveLength(1);fireEvent.click(screen.getByRole('button',{name:/^질문7\-99$/}));expect(screen.getByText('정답7-99')).toBeInTheDocument();expect(screen.getByRole('button',{name:'암기 항목으로 등록'})).toBeDisabled();
});
it('shows a single latest verdict with the original revision on demand, without mounting closed evidence',()=>{
 const events=Array.from({length:80},(_,i)=>({id:`event${i}`,revision:1,sequence:i,occurredAt:at,knownAt:at,targetId:topicId,facet:'goal',rubricVersion:'self-check-1',kind:'assessment' as const,result:'fail' as const,assistance:'unknown' as const,novelty:'unknown' as const,answer:'답안 原文',authority:'local' as const}));
 events.push({...events[79],revision:2,result:'pass' as 'fail'});
 render(<PerformanceEvidence events={events} goalId="goal" at="2026-10-01T02:00:00Z" />);
 expect(screen.queryByText(/결과 버전/)).toBeNull();const details=screen.getByText('근거 보기').closest('details')!;details.open=true;fireEvent(details,new Event('toggle'));
 expect(screen.getAllByText(/결과 버전/)).toHaveLength(20);expect(screen.getAllByText(/기준을 충족함/)).toHaveLength(1);fireEvent.click(screen.getByRole('button',{name:'이전 판정 보기'}));expect(screen.getAllByText(/결과 버전/)).toHaveLength(21);
});
it('keeps corrupt and concurrently changed source-result drafts intact',()=>{
 localStorage.setItem('draft','原文');expect(()=>readSourceResultDraft('draft')).toThrow(/보존/);expect(localStorage.getItem('draft')).toBe('原文');expect(()=>writeSourceResultDraft('draft',{version:1,goalId:'goal',response:{result:'unknown',assistance:'unknown',novelty:'unknown',answer:''}},null)).toThrow(/보존/);expect(localStorage.getItem('draft')).toBe('原文');
});
