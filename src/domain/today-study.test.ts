import { expect, it } from 'vitest';
import { createDemoState } from './fixtures';
import { emptyRecommendations } from './recommendation-workspace';
import { todayStudy } from './today-study';
import { applyCommand } from './commands';
const at='2026-10-01T01:00:00.000Z';
it('uses existing due-review rules and separates deadline steps, unknown work, closed scope and future openings',()=>{
  let data=createDemoState();data=applyCommand(data,{userId:data.userId,namespace:data.namespace,at,opId:'due',type:'setRecallDue',id:'recall:demo-topic-function',topicId:'demo-topic-function',expectedVersion:0,due:at});
  const w=emptyRecommendations(data), make=(id:string,dueDate:string)=>({id,name:id,subjectId:'demo-subject-math',kind:'assignment' as const,targetIds:[],goalIds:[],dueDate,opensDate:'',weight:null,status:'active' as const,states:{prepare:'unknown' as const,submit:'unknown' as const},dueMeaning:'submission' as const,note:''});
  w.schedules=[make('later','2026-10-05'),make('today','2026-10-01'),{...make('future','2026-10-10'),opensDate:'2026-10-07'},{...make('done','2026-09-30'),states:{prepare:'done',submit:'done'}},{...make('undated',''),states:{prepare:'unknown',submit:'unknown'}}];
  const result=todayStudy(data,w,['demo-subject-math'],at);expect(result.due.map(n=>n.id)).toEqual(['demo-topic-function']);expect(result.schedules.map(s=>s.id)).toEqual(['today','later']);expect(w.schedules[1].states.submit).toBe('unknown');expect(todayStudy(data,w,['demo-subject-science'],at).due).toEqual([]);
});
