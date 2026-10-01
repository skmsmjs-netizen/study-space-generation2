// @vitest-environment node
import { beforeAll, beforeEach, afterAll, expect, it, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { handleCommand, type CommandBackend } from './command-handler';
import { DomainError, emptyState, type Command } from '../domain/model';
import { applyCommand } from '../domain/commands';
import { packServerState, unpackServerState } from './state-codec';
import type { AccountAccess, AccountPage, AccessStatus } from './account-access';
const owner='80000000-0000-4000-8000-000000000001', member='80000000-0000-4000-8000-000000000002', unconfirmed='80000000-0000-4000-8000-000000000003';
let db: PGlite;
async function rpc<T>(sql: string, args: unknown[]): Promise<T> {
  try { return (await db.query<{result:T}>(sql,args)).rows[0].result; }
  catch (error) { const code = ['ACCESS_DENIED','ADMIN_REQUIRED','ADMIN_PROTECTED','ACCESS_CONFLICT','EMAIL_UNCONFIRMED','NAME_REQUIRED','LAST_ADMIN','AUTH_REQUIRED'].find(c=>String(error).includes(c)); if(code) throw new DomainError(code,code); throw error; }
}
const backend:CommandBackend={
  authenticate:async token=>[owner,member,unconfirmed].includes(token)?token:'',
  access:id=>rpc<AccountAccess>('select study_account_access($1) result',[id]),
  listAccounts:(actor,cursor)=>rpc<AccountPage>('select study_list_accounts($1,$2) result',[actor,cursor]),
  setAccountAccess:async(actor,target,status,version)=>{await rpc('select study_set_account_access($1,$2,$3,$4) result',[actor,target,status,version]);},
  setAccountName:(id,name)=>rpc<AccountAccess>('select study_set_account_name($1,$2) result',[id,name]),
  withdrawAccount:async id=>{await rpc('select study_withdraw_account($1) result',[id]);},
  read:async(id,namespace)=>{const row=await rpc<any>('select study_read_workspace($1,$2) result',[id,namespace]);return row?{sequence:Number(row.sequence),data:unpackServerState(row.state)}:null;},
  commit:async(id,namespace,base,command,next)=>{const row=await rpc<any>('select study_commit($1,$2,$3,$4,$5,$6) result',[id,namespace,base,command.opId,next.appliedOps[command.opId],packServerState(next,command.opId)]);return{sequence:row.sequence,data:unpackServerState(row.data)};},
};
const request=(body:unknown,token=member)=>handleCommand(new Request('http://test',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:JSON.stringify(body)}),backend);
const command=():Command=>({type:'addSubject',id:'kept-subject',name:'  원문\r\n',scope:{kind:'independent'},userId:member,namespace:'test',opId:'kept-op',at:'2026-10-01T00:00:00Z'});
beforeAll(async()=>{
  db=new PGlite();
  await db.exec(`create schema auth;create table auth.users(id uuid primary key,email text,created_at timestamptz default now(),email_confirmed_at timestamptz,raw_user_meta_data jsonb default '{"display_name":"시험 사람"}');create role anon;create role authenticated;create role service_role bypassrls;grant usage on schema public,auth to anon,authenticated,service_role;create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;insert into auth.users(id,email,email_confirmed_at) values('${owner}','owner@example.invalid',now()),('${member}','member@example.invalid',now()),('${unconfirmed}','unconfirmed@example.invalid',null);`);
  for(const file of ['202609300001_study_storage.sql','202610010002_learning_plans.sql','202610010003_canvas_layouts.sql','202610010004_account_approval.sql','20261001030750_account_names_withdrawal.sql']) await db.exec(await readFile(new URL(`../../supabase/migrations/${file}`,import.meta.url),'utf8'));
  // Explicit trusted bootstrap, never first-signup/metadata based.
  await db.exec(`insert into study_administrators(user_id) values('${owner}');`);
});
beforeEach(async()=>{await db.exec(`reset role;truncate study_operations,study_workspaces,study_access_history;update study_account_permissions set status='pending',version=0;update study_account_permissions set status='approved' where user_id='${owner}';`);});
afterAll(async()=>{await db.close();});
it('backfills pending accounts and keeps newly signed up metadata out of administrator roles',async()=>{
  expect(await backend.access(member)).toEqual({status:'pending',administrator:false,displayName:'시험 사람'});
  await db.exec("insert into auth.users(id,email) values('80000000-0000-4000-8000-000000000004','new@example.invalid')");
  expect(await backend.access('80000000-0000-4000-8000-000000000004')).toEqual({status:'pending',administrator:false,displayName:'시험 사람'});
  await db.exec("delete from study_account_permissions where user_id='80000000-0000-4000-8000-000000000004';delete from auth.users where id='80000000-0000-4000-8000-000000000004';");
});
it('lets pending users check only their own status and blocks direct load/execute',async()=>{
  expect(await(await request({action:'access',userId:owner,administrator:true})).json()).toEqual({status:'pending',administrator:false,displayName:'시험 사람'});
  const read=vi.spyOn(backend,'read');
  expect((await request({action:'load',namespace:'test'})).status).toBe(403);
  expect((await request({action:'execute',namespace:'test',baseSequence:0,command:command()})).status).toBe(403);
  expect(read).not.toHaveBeenCalled();read.mockRestore();
  expect((await db.query('select * from study_workspaces')).rows).toEqual([]);
});
it('requires approval for all admin requests even when actor/role is forged',async()=>{
  expect((await request({action:'admin-list',actor:owner})).status).toBe(403);
  expect((await request({action:'admin-set',actor:owner,target:member,status:'approved',version:0})).status).toBe(403);
  await backend.setAccountAccess!(owner,member,'approved',0);
  expect((await request({action:'admin-list',administrator:true})).status).toBe(403);
  expect((await request({action:'access'},'expired')).status).toBe(401);
});
it('admin approval opens storage; revocation blocks load/commit/retry without deleting originals',async()=>{
  expect((await request({action:'admin-set',target:member,status:'approved',version:0},owner)).status).toBe(200);
  const op=command(),body={action:'execute',namespace:'test',baseSequence:0,command:op};
  expect((await request(body)).status).toBe(200);
  const preserved=(await db.query('select state from study_workspaces')).rows[0];
  await backend.setAccountAccess!(owner,member,'suspended',1);
  expect((await request({action:'load',namespace:'test'})).status).toBe(403);
  expect((await request(body)).status).toBe(403);
  const next=applyCommand(emptyState(member,'test'),op);
  await expect(backend.commit(member,'test',0,op,next)).rejects.toThrow('ACCESS_DENIED');
  await expect(backend.read(member,'test')).rejects.toThrow('ACCESS_DENIED');
  expect((await db.query('select state from study_workspaces')).rows[0]).toEqual(preserved);
  expect((await db.query('select * from study_operations')).rows).toHaveLength(1);
  await backend.setAccountAccess!(owner,member,'approved',2);
  expect((await backend.read(member,'test'))!.data.subjects[0]).toEqual(next.subjects[0]);
  expect((await db.query('select * from study_access_history')).rows).toHaveLength(3);
});
it('cannot approve an unconfirmed email, modify admin access, or silently apply stale decisions',async()=>{
  await expect(backend.setAccountAccess!(owner,unconfirmed,'approved',0)).rejects.toThrow('EMAIL_UNCONFIRMED');
  await expect(backend.setAccountAccess!(owner,owner,'suspended',0)).rejects.toThrow('ADMIN_PROTECTED');
  await backend.setAccountAccess!(owner,member,'rejected',0);
  await expect(backend.setAccountAccess!(owner,member,'approved',0)).rejects.toThrow('ACCESS_CONFLICT');
  expect((await backend.access(member)).status).toBe('rejected');
});
it('only approved owners read via RLS; authenticated/anon users cannot set permissions or invoke management RPCs',async()=>{
  await backend.setAccountAccess!(owner,member,'approved',0);
  await request({action:'execute',namespace:'test',baseSequence:0,command:command()});
  await db.exec(`set role authenticated;set request.jwt.claim.sub='${member}';`);
  expect((await db.query('select * from study_workspaces')).rows).toHaveLength(1);
  await expect(db.exec("update study_account_permissions set status='approved'")).rejects.toThrow('permission denied');
  await expect(db.query('select study_list_accounts($1,null)',[owner])).rejects.toThrow('permission denied');
  await expect(db.query('select study_set_account_access($1,$2,$3,$4)',[owner,member,'approved',1])).rejects.toThrow('permission denied');
  await db.exec('reset role');await backend.setAccountAccess!(owner,member,'suspended',1);
  await db.exec(`set role authenticated;set request.jwt.claim.sub='${member}';`);
  expect((await db.query('select * from study_workspaces')).rows).toEqual([]);
  expect((await db.query('select * from study_operations')).rows).toEqual([]);
  await db.exec('set role service_role');
  await expect(db.query('select * from study_workspaces')).rejects.toThrow('permission denied');
  await expect(db.query('select study_commit_internal($1,$2,$3,$4,$5,$6)',[member,'test',1,'x','x',{}])).rejects.toThrow('permission denied');
  await db.exec('set role anon');await expect(db.query('select study_account_access($1)',[owner])).rejects.toThrow('permission denied');
});
it('lists account email/confirmation/status only to the administrator with bounded pagination',async()=>{
  const page=await backend.listAccounts!(owner,null);
  expect(page.accounts.find(a=>a.userId===member)).toMatchObject({email:'member@example.invalid',emailConfirmed:true,status:'pending',version:0});
  expect(page.accounts).toHaveLength(3);
  expect(page.nextCursor).toBeNull();
  await expect(backend.listAccounts!(member,null)).rejects.toThrow('ACCESS_DENIED');
});
it('bootstraps only an explicitly named confirmed owner and is safe to rerun',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'study-admin-test-'));
  try {
    const path=join(dir,'private.sql');
    execFileSync(process.execPath,['scripts/prepare-administrator.mjs','owner@example.invalid',path]);
    await db.exec(`delete from study_administrators where user_id='${owner}';update study_account_permissions set status='pending' where user_id='${owner}';`);
    const sql=await readFile(path,'utf8');await db.exec(sql);await db.exec(sql);
    expect(await backend.access(owner)).toEqual({status:'approved',administrator:true,displayName:'시험 사람'});
    expect(await backend.access(member)).toEqual({status:'pending',administrator:false,displayName:'시험 사람'});
    expect((await db.query('select * from study_access_history')).rows).toHaveLength(1);
    execFileSync(process.execPath,['scripts/prepare-administrator.mjs','unconfirmed@example.invalid',path]);
    await expect(db.exec(await readFile(path,'utf8'))).rejects.toThrow('Exactly one email-confirmed owner account');
    await db.exec('rollback');
    expect((await backend.access(unconfirmed)).administrator).toBe(false);
  } finally { await rm(dir,{recursive:true,force:true}); }
});

it('stores a caller name separately from editable auth metadata and rejects bad names',async()=>{
  expect((await request({action:'profile-set',name:'  이름 둘  ',userId:owner,administrator:true})).status).toBe(200);
  expect((await backend.access(member)).displayName).toBe('이름 둘');expect((await backend.access(owner)).displayName).toBe('시험 사람');
  expect((await request({action:'profile-set',name:'  '})).status).toBe(400);expect((await request({action:'profile-set',name:'a'.repeat(81)})).status).toBe(400);
  expect((await backend.access(member)).administrator).toBe(false);
});
it('withdraws only the caller atomically, removes records, permissions, profile and history, and protects the last administrator',async()=>{
  const id='80000000-0000-4000-8000-000000000005';await db.query('insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())',[id,'withdraw@example.invalid']);
  await backend.setAccountAccess!(owner,id,'approved',0);
  const op={...command(),userId:id};const next=applyCommand(emptyState(id,'test'),op);await backend.commit(id,'test',0,op,next);
  await backend.setAccountAccess!(owner,id,'suspended',1);
  const self:CommandBackend={...backend,authenticate:async()=>id};
  const call=(body:unknown)=>handleCommand(new Request('http://test',{method:'POST',headers:{Authorization:'Bearer test'},body:JSON.stringify(body)}),self);
  expect((await call({action:'withdraw',confirmation:'탈퇴',target:owner})).status).toBe(400);expect((await call({action:'withdraw',confirmation:'no'})).status).toBe(400);
  expect((await call({action:'withdraw',confirmation:'탈퇴'})).status).toBe(200);
  for(const table of ['study_workspaces','study_operations','study_account_profiles','study_account_permissions'])expect((await db.query(`select * from ${table} where user_id=$1`,[id])).rows).toEqual([]);
  expect((await db.query('select * from auth.users where id=$1',[id])).rows).toEqual([]);expect((await db.query('select * from study_access_history where target_id=$1',[id])).rows).toEqual([]);
  expect((await request({action:'withdraw',confirmation:'탈퇴'},owner)).status).toBe(403);expect((await backend.access(owner)).administrator).toBe(true);
  await db.exec('set role authenticated');await expect(db.query('select study_withdraw_account($1)',[owner])).rejects.toThrow('permission denied');await db.exec('reset role');
});
