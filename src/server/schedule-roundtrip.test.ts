// @vitest-environment node
import {expect,it} from 'vitest';
import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
import {handleCommand,type CommandBackend} from './command-handler';
import {packServerState,unpackServerState} from './state-codec';
import {emptyState,type Command} from '../domain/model';
import {emptyRecommendations} from '../domain/recommendation-workspace';
import {changeSchedule} from '../domain/schedule-management';
it('saves expanded schedules and their exact history through authenticated PostgreSQL and preserves a stale input on conflict',async()=>{
 const db=new PGlite(),owner='10000000-0000-4000-8000-000000000001',at='2026-10-01T00:00:00Z';
 try{
 await db.exec(`create schema auth;create table auth.users(id uuid primary key);create role anon;create role authenticated;create role service_role bypassrls;create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;insert into auth.users values('${owner}');`);
 for(const file of ['202609300001_study_storage.sql','202610010002_learning_plans.sql'])await db.exec(await readFile(new URL('../../supabase/migrations/'+file,import.meta.url),'utf8'));
 const backend:CommandBackend={authenticate:async token=>{if(token==='synthetic')return owner;throw Error();},access:async()=>({status:'approved',administrator:false}),read:async(user,namespace)=>{const r=await db.query<{sequence:number;state:unknown}>('select sequence,state from study_workspaces where user_id=$1 and namespace=$2',[user,namespace]);return r.rows.length?{sequence:Number(r.rows[0].sequence),data:unpackServerState(r.rows[0].state)}:null;},commit:async(user,namespace,base,command,next)=>{const r=await db.query<{result:{sequence:number;data:unknown}}>('select study_commit($1,$2,$3,$4,$5,$6) result',[user,namespace,base,command.opId,next.appliedOps[command.opId],packServerState(next,command.opId)]);return{sequence:r.rows[0].result.sequence,data:unpackServerState(r.rows[0].result.data)};}};
 const req=(body:unknown)=>handleCommand(new Request('http://test',{method:'POST',headers:{Authorization:'Bearer synthetic'},body:JSON.stringify(body)}),backend);
 const context={userId:owner,namespace:'test' as const,at};
 const add:Command={...context,type:'addSubject',id:'subject',name:'합성 과목',scope:{kind:'independent'},opId:'subject'};expect((await req({action:'execute',namespace:'test',baseSequence:0,command:add})).status).toBe(200);
 const current=(await backend.read(owner,'test'))!.data,w=emptyRecommendations(current);
 const schedule={id:'s',subjectId:'subject',name:'주차별 강의',kind:'class' as const,goalIds:[],targetIds:[],opensDate:'2026-10-01',opensTime:'08:30',dueDate:'2026-10-08',dueTime:'22:00',reviewDate:'2026-10-02',weight:null,status:'active' as const,states:{learn:'done' as const,attendance:'unknown' as const},dueMeaning:'attendance' as const,note:'  \u0000\ud800\r\n조건과 예외  ',taskText:'원문 과업',sourceUrl:'https://example.com',notesRequired:true,week:1};
 w.schedules=[changeSchedule(schedule,{dueDate:'2026-10-09'},at,'기한 변경')];
 const command:Command={...context,type:'saveLearningPlan',id:'plan',workspace:w,expectedVersion:0,opId:'schedule'};
 const body={action:'execute',namespace:'test',baseSequence:1,command};expect((await req(body)).status).toBe(200);expect((await req(body)).status).toBe(200);
 const reopened=await(await req({action:'load',namespace:'test'})).json();expect(reopened.data.learningPlans[0].workspace.schedules).toEqual(w.schedules);expect(reopened.data.records).toEqual([]);expect(reopened.data.revisions.at(-1).collection).toBe('learningPlans');
 expect((await req({...body,command:{...command,opId:'stale'}})).status).toBe(409);expect((await backend.read(owner,'test'))?.sequence).toBe(2);
 const unsafe=structuredClone(w);unsafe.schedules![0].history![0].previous.sourceUrl='javascript:alert(1)';expect((await req({...body,baseSequence:2,command:{...command,workspace:unsafe,expectedVersion:1,opId:'unsafe'}})).status).toBe(400);
 }finally{await db.close();}
},60000);
