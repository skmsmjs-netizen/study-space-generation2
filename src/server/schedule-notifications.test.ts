// @vitest-environment node
import { expect,it,vi } from 'vitest';
import { handleScheduleNotifications,validatePushSubscription, type NotificationBackend, type NotificationJob } from './schedule-notifications';
import { createDemoState } from '../domain/fixtures';
import { emptyRecommendations } from '../domain/recommendation-workspace';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
const owner='10000000-0000-4000-8000-000000000001',other='10000000-0000-4000-8000-000000000002';
const subscription={endpoint:'https://fcm.googleapis.com/fcm/send/synthetic',keys:{auth:Buffer.alloc(16).toString('base64url'),p256dh:Buffer.alloc(65).toString('base64url')}};
const secret='synthetic-cron-secret-that-is-long-enough',at='2026-10-01T00:00:00Z';
const request=(body:unknown,token='owner')=>new Request('http://test',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:JSON.stringify(body)});
function setup(){const data=createDemoState();data.userId=owner;data.namespace='personal';for(const s of data.subjects){s.userId=owner;s.namespace='personal';}const w=emptyRecommendations(data);w.schedules=[{id:'s',subjectId:'demo-subject-math',name:'분리한 과제',kind:'assignment',goalIds:[],targetIds:[],dueDate:'2026-10-08',opensDate:'',weight:null,status:'active',states:{prepare:'done',submit:'unknown'},dueMeaning:'submission',note:'개인 메모는 알림 payload에 싣지 않는다'}];data.learningPlans=[{id:'plan',version:1,userId:owner,namespace:'personal',createdAt:at,updatedAt:at,deletedAt:null,workspace:w}];const job:NotificationJob={id:'job',userId:owner,day:'2026-10-01',claim:'claim',subscription};const backend:NotificationBackend={authenticate:async t=>{if(t==='owner')return owner;throw Error();},approved:async()=>true,save:vi.fn(),remove:vi.fn(),status:async()=>true,claim:async()=>[job],read:async()=>data,finish:vi.fn(),send:vi.fn()};return{data,job,backend};}
it('derives ownership from Auth and rejects unsupported endpoints, invalid keys and cron attempts by ordinary accounts',async()=>{
 const{backend}=setup(),config={publicKey:'key',cronSecret:secret,now:()=>at};
 expect((await handleScheduleNotifications(request({action:'subscribe',subscription,userId:other}),backend,config)).status).toBe(200);expect(backend.save).toHaveBeenCalledWith(owner,{...subscription,expirationTime:null});
 expect((await handleScheduleNotifications(request({action:'subscribe',subscription:{...subscription,endpoint:'https://127.0.0.1/private'}}),backend,config)).status).toBe(400);
 expect(()=>validatePushSubscription({...subscription,keys:{auth:'bad',p256dh:'bad'}})).toThrow();
 expect((await handleScheduleNotifications(request({action:'dispatch'}),backend,config)).status).toBe(403);expect(backend.send).not.toHaveBeenCalled();
 backend.approved=async()=>false;expect((await handleScheduleNotifications(request({action:'config'}),backend,config)).status).toBe(403);
 expect((await handleScheduleNotifications(request({action:'status',endpoint:subscription.endpoint},'bad'),backend,config)).status).toBe(401);
});
it('sends one digest from the stored personal workspace and handles expiration, failures and revoked access without leaking notes',async()=>{
 const{backend,job}=setup(),config={publicKey:'key',cronSecret:secret,now:()=>at};
 const result=await handleScheduleNotifications(request({action:'dispatch'},secret),backend,config);expect(await result.json()).toEqual({sent:1,failed:0});expect(backend.send).toHaveBeenCalledWith(subscription,{title:'일주일 안의 공부 일정 1개',body:'분리한 과제 · 7일 남음 · 시각 미정'});expect(backend.finish).toHaveBeenCalledWith(job,'sent');
 backend.send=vi.fn().mockRejectedValue({statusCode:410});await handleScheduleNotifications(request({action:'dispatch'},secret),backend,config);expect(backend.finish).toHaveBeenLastCalledWith(job,'expired');
 backend.send=vi.fn().mockRejectedValue(Error('network'));await handleScheduleNotifications(request({action:'dispatch'},secret),backend,config);expect(backend.finish).toHaveBeenLastCalledWith(job,'retry');
 backend.approved=async()=>false;backend.send=vi.fn();await handleScheduleNotifications(request({action:'dispatch'},secret),backend,config);expect(backend.send).not.toHaveBeenCalled();
});
it('enforces DB ownership, denies client roles, prevents repeat claims and leaves workspaces untouched',async()=>{
 const db=new PGlite();try{
 await db.exec(`create schema auth;create table auth.users(id uuid primary key);create role anon;create role authenticated;create role service_role bypassrls;create table public.study_account_permissions(user_id uuid primary key,status text);create function public.study_account_access(p_user uuid) returns jsonb language sql as $$select jsonb_build_object('status',(select status from public.study_account_permissions where user_id=p_user))$$;insert into auth.users values('${owner}'),('${other}');insert into public.study_account_permissions values('${owner}','approved'),('${other}','approved');`);
 await db.exec(await readFile(new URL('../../supabase/migrations/20261001064004_schedule_notifications.sql',import.meta.url),'utf8'));
 await db.query('select study_save_push($1,$2)',[owner,subscription]);await expect(db.query('select study_save_push($1,$2)',[other,subscription])).rejects.toThrow('PUSH_OWNER');
 const rows=await db.query<{claim:NotificationJob[]}>('select study_claim_push($1) as claim',[at]);expect(rows.rows[0].claim).toHaveLength(1);const job=rows.rows[0].claim[0];expect((await db.query<{claim:unknown[]}>('select study_claim_push($1) as claim',[at])).rows[0].claim).toHaveLength(0);
 await db.query('select study_finish_push($1,$2,$3,$4)',[job.id,job.day,job.claim,'sent']);expect((await db.query<{claim:unknown[]}>('select study_claim_push($1) as claim',['2026-10-01T00:20:00Z'])).rows[0].claim).toHaveLength(0);
 await db.query('select study_remove_push($1,$2)',[other,subscription.endpoint]);expect((await db.query<{enabled:boolean}>('select study_push_status($1,$2) as enabled',[owner,subscription.endpoint])).rows[0].enabled).toBe(true);
 await db.exec('set role authenticated');await expect(db.query('select * from study_push_subscriptions')).rejects.toThrow('permission denied');await expect(db.query('select study_claim_push($1)',[at])).rejects.toThrow('permission denied');
 }finally{await db.close();}
},60000);
