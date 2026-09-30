// @vitest-environment node
import {expect,it} from 'vitest';
import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
import {handleCommand,type CommandBackend} from './command-handler';
import {packServerState,unpackServerState} from './state-codec';
import {emptyRecommendations} from '../domain/recommendation-workspace';
import {emptyState,type Command} from '../domain/model';
it('roundtrips learning plans through authenticated commands and PostgreSQL, refusing foreign writes and stale retries',async()=>{
 const db=new PGlite(),a='10000000-0000-4000-8000-000000000001',b='10000000-0000-4000-8000-000000000002';
 try {
  await db.exec(`create schema auth;create table auth.users(id uuid primary key);create role anon;create role authenticated;create role service_role bypassrls;create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;insert into auth.users values('${a}'),('${b}');`);
  for(const path of ['202609300001_study_storage.sql','202610010002_learning_plans.sql'])await db.exec(await readFile(new URL('../../supabase/migrations/'+path,import.meta.url),'utf8'));
  const backend:CommandBackend={authenticate:async token=>token==='a'?a:b,read:async(userId,namespace)=>{const r=await db.query<any>('select sequence,state from study_workspaces where user_id=$1 and namespace=$2',[userId,namespace]);return r.rows.length?{sequence:Number(r.rows[0].sequence),data:unpackServerState(r.rows[0].state)}:null;},commit:async(userId,namespace,base,command,next)=>{const r=await db.query<any>('select study_commit($1,$2,$3,$4,$5,$6) result',[userId,namespace,base,command.opId,next.appliedOps[command.opId],packServerState(next,command.opId)]);return{sequence:r.rows[0].result.sequence,data:unpackServerState(r.rows[0].result.data)};}};
  const request=(body:unknown,token='a')=>handleCommand(new Request('http://test/functions/v1/study-command',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:JSON.stringify(body)}),backend);
  const data=emptyState(a,'test'),w=emptyRecommendations(data);w.draft.label='  原文\r\n예외\u0000\ud800';
  const command:Command={type:'saveLearningPlan',id:'plan',workspace:w,expectedVersion:0,userId:a,namespace:'test',at:'2026-10-01T00:00:00Z',opId:'plan-save'};
  const body={action:'execute',namespace:'test',baseSequence:0,command};
  const first=await request(body);expect(first.status).toBe(200);const saved=await first.json();expect(saved.supportedCommands).toContain('saveLearningPlan');expect(saved.data.learningPlans[0].workspace.draft.label).toBe(w.draft.label);
  expect((await request(body)).status).toBe(200);expect((await backend.read(a,'test'))?.sequence).toBe(1);
  expect((await request({...body,command:{...command,opId:'stale'}})).status).toBe(409);
  expect((await request({...body,baseSequence:1,command:{...command,opId:'foreign',userId:b}})).status).toBe(403);
  const other=await(await request({action:'load',namespace:'test'},'b')).json();expect(other.data.learningPlans).toBeUndefined();expect(other.sequence).toBe(0);
  const projected=packServerState(saved.data,command.opId);(projected as unknown as {learningPlans:{userId:string}[]}).learningPlans[0].userId=b;
  await expect(db.query('select study_commit($1,$2,$3,$4,$5,$6)',[a,'test',1,'forged','x',{...projected,appliedOps:{forged:'x'}}])).rejects.toThrow('OWNERSHIP');
 } finally {await db.close();}
});
