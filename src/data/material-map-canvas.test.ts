import {expect,it} from 'vitest';
import {emptyState} from '../domain/model';import {applyCommand} from '../domain/commands';
import {addMaterialMapToCanvas} from './material-map-canvas';import type {StudyRepository} from './repository';
import type {MaterialContent,MaterialResult} from '../domain/study-material';
it('copies grounded concepts into existing Canvas without moving old cards or overwriting user edits on retry',async()=>{
 const ctx={userId:'owner',namespace:'test' as const,at:'2026-10-01T00:00:00Z'};let state=applyCommand(emptyState(ctx.userId,ctx.namespace),{...ctx,type:'addSubject',id:'subject',name:'합성',scope:{kind:'independent'},opId:'subject'});
 state=applyCommand(state,{...ctx,type:'saveCanvasLayout',id:'canvas:main',positions:{'subject:subject':{x:510,y:-70}},links:[],viewport:{x:-5,y:20,zoom:.7},expectedVersion:0,opId:'layout'});
 const repo={getSnapshot:()=>state,execute:(command:Parameters<typeof applyCommand>[1])=>state=applyCommand(state,command),flush:async()=>{},getStatus:()=>({phase:'saved',pending:0,message:''})} as unknown as StudyRepository;
 const result:MaterialResult={id:'result',model:'synthetic',at:ctx.at,segments:[{id:'s',text:'조건과 원문',label:'합성.pdf · 2쪽',start:null,end:null}],summary:[],cards:[],map:{nodes:[{id:'n1',label:'전압',sourceIds:['s']},{id:'n2',label:'볼트',sourceIds:['s']}],edges:[{id:'e',from:'n1',to:'n2',label:'단위',sourceIds:['s']}],positions:{n1:{x:50,y:60}}}};
 const material:MaterialContent={title:'합성 자료',subjectId:'subject',topicId:null,sourceText:'원문',audio:null,results:[result]};
 await addMaterialMapToCanvas(repo,material,result);expect(state.memos).toHaveLength(2);expect(state.memos![0].body).toContain('합성.pdf · 2쪽\n조건과 원문');expect(state.canvasLayouts![0].positions['subject:subject']).toEqual({x:510,y:-70});expect(state.canvasLayouts![0].viewport).toEqual({x:-5,y:20,zoom:.7});
 const memo=state.memos![0];state=applyCommand(state,{...ctx,type:'saveMemo',id:memo.id,ownerId:memo.ownerId,body:'사용자 수정\n예외 유지',strokes:[],expectedVersion:memo.version,opId:'edit'});const before=structuredClone(state.canvasLayouts![0].positions);
 await addMaterialMapToCanvas(repo,material,result);expect(state.memos).toHaveLength(2);expect(state.memos![0].body).toBe('사용자 수정\n예외 유지');expect(state.canvasLayouts![0].links).toHaveLength(1);expect(state.canvasLayouts![0].positions).toEqual(before);expect(state.records).toHaveLength(0);
});
