import {beforeEach,expect,it} from 'vitest';
import {DemoRepository} from './demo-repository';
import {readLearningPlan,saveLearningPlan} from './learning-plan';
import {readRecommendations,saveRecommendations,emptyRecommendations} from './recommendations';
import {applyCommand} from '../domain/commands';
import {packServerState,unpackServerState} from '../server/state-codec';
beforeEach(()=>localStorage.clear());
it('copies legacy demo content only on an explicit edit and keeps the original key untouched',()=>{
 const repo=new DemoRepository(localStorage),data=repo.getSnapshot(),w=emptyRecommendations(data);w.draft.label='  原文\r\n예외';const legacy=saveRecommendations(data,w,null);const read=readLearningPlan(data);expect(read.workspace).toEqual(w);const next=saveLearningPlan(repo,{...w,revision:1},read.raw);expect(next.learningPlans?.[0].workspace.draft.label).toBe(w.draft.label);expect(readRecommendations(data).raw).toBe(legacy);expect(new DemoRepository(localStorage).getSnapshot().learningPlans).toEqual(next.learningPlans);expect(next.revisions.at(-1)?.collection).toBe('learningPlans');
});
it('rejects stale and foreign-owned plans and preserves exact server UTF-16 roundtrips',()=>{
 const repo=new DemoRepository(localStorage),data=repo.getSnapshot(),w=emptyRecommendations(data);w.draft.label='\u0000\ud800\r\n条件';const next=saveLearningPlan(repo,w,null),row=next.learningPlans![0];expect(()=>saveLearningPlan(repo,{...w,revision:1},null)).toThrow();expect(()=>applyCommand(next,{type:'saveLearningPlan',id:row.id,expectedVersion:0,workspace:w,opId:'stale',at:new Date().toISOString(),userId:data.userId})).toThrow();expect(()=>applyCommand(next,{type:'saveLearningPlan',id:row.id,expectedVersion:row.version,workspace:{...w,userId:'other'},opId:'foreign',at:new Date().toISOString(),userId:data.userId})).toThrow();const op=Object.keys(next.appliedOps).at(-1)!;expect(unpackServerState(packServerState(next,op))).toEqual(next);
});
