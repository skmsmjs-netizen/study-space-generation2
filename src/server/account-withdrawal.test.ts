// @vitest-environment node
import { beforeAll, beforeEach, afterAll, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { withdrawAccountFiles, type WithdrawalBackend } from './account-withdrawal';
import { handleWithdrawalStatus } from './withdrawal-status';

const owner='a0000000-0000-4000-8000-000000000001', member='a0000000-0000-4000-8000-000000000002', other='a0000000-0000-4000-8000-000000000003';
const receipt='b0000000-0000-4000-8000-000000000001';
let db:PGlite;
const rpc = async <T,>(name:string,args:unknown[]):Promise<T> => (await db.query<{value:T}>(`select ${name}(${args.map((_,i)=>'$'+(i+1)).join(',')}) value`,args)).rows[0].value;
let failedRemoval=false;
const backend:WithdrawalBackend={
  begin:(id,key)=>rpc('study_begin_withdrawal',[id,key]), batch:id=>rpc('study_withdraw_storage_batch',[id]),
  finish:async id=>{await rpc('study_withdraw_account',[id]);},
  remove:async(bucket,names)=>{if(failedRemoval)throw Error('Storage unavailable');for(const name of names)await db.query('delete from storage.objects where bucket_id=$1 and name=$2',[bucket,name]);},
};
beforeAll(async()=>{
  db=new PGlite();
  await db.exec(`create schema auth;create schema storage;
    create table auth.users(id uuid primary key,email text,created_at timestamptz default now(),email_confirmed_at timestamptz,raw_user_meta_data jsonb default '{"display_name":"격리 시험"}');
    create table auth.sessions(id uuid primary key,user_id uuid references auth.users(id) on delete cascade);
    create table storage.objects(bucket_id text,name text,owner uuid,owner_id text,metadata jsonb,primary key(bucket_id,name));
    create role anon;create role authenticated;create role service_role bypassrls;
    grant usage on schema public,auth,storage to anon,authenticated,service_role;
    create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    create function auth.jwt() returns jsonb language sql as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;`);
  for(const file of ['202609300001_study_storage.sql','202610010004_account_approval.sql','20261001030750_account_names_withdrawal.sql','20261002201347_resumable_account_withdrawal.sql']) await db.exec(await readFile(new URL(`../../supabase/migrations/${file}`,import.meta.url),'utf8'));
});
beforeEach(async()=>{
  failedRemoval=false;await db.exec('reset role;truncate storage.objects,study_withdrawal_receipts;delete from auth.users;');
  for(const [id,email] of [[owner,'owner'],[member,'member'],[other,'other']])await db.query("insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())",[id,email+'@example.invalid']);
  await db.query("update study_account_permissions set status='approved'");
  await db.query('insert into study_administrators(user_id) values($1)',[owner]);
});
afterAll(async()=>{await db.close();});
async function file(id=member,name='document-original',bucket='study-material-originals',actualOwner:string|null=id){await db.query('insert into storage.objects(bucket_id,name,owner,owner_id) values($1,$2,$3,$4)',[bucket,`${id}/personal/document/${name}`,actualOwner,actualOwner]);}
async function exists(id=member){return (await db.query('select id from auth.users where id=$1',[id])).rows.length>0;}

it('protects the last administrator before changing access or touching their attachments',async()=>{
  await file(owner);await expect(withdrawAccountFiles(backend,owner,receipt)).rejects.toThrow('LAST_ADMIN');
  expect(await exists(owner)).toBe(true);expect((await db.query('select * from study_account_withdrawals')).rows).toHaveLength(0);
  expect((await rpc<any>('study_account_access',[owner])).status).toBe('approved');expect((await db.query('select * from storage.objects')).rows).toHaveLength(1);
});
it('preserves files/account on deletion failure, blocks writes, and resumes across a new caller',async()=>{
  await file();failedRemoval=true;await expect(withdrawAccountFiles(backend,member,receipt)).rejects.toThrow('Storage unavailable');
  expect(await exists()).toBe(true);expect((await rpc<any>('study_account_access',[member])).withdrawalPending).toBe(true);
  await expect(rpc('study_require_access',[member])).rejects.toThrow('ACCESS_DENIED');
  failedRemoval=false;const newReceipt='b0000000-0000-4000-8000-000000000002';
  expect(await withdrawAccountFiles(backend,member,newReceipt)).toEqual({withdrawn:false,requestId:receipt});expect(await exists()).toBe(true);
  expect(await withdrawAccountFiles(backend,member,receipt)).toEqual({withdrawn:true,requestId:receipt});expect(await exists()).toBe(false);
  expect(await rpc('study_withdrawal_status',[receipt])).toEqual({withdrawn:true});
});
it('removes successive bounded batches, legacy ownerless originals and all owned buckets, preserving foreign ownership',async()=>{
  for(let i=0;i<53;i++)await file(member,String(i));
  await file(member,'ownerless','study-material-originals',null);await file(member,'foreign-owner','study-material-originals',other);await file(member,'other-bucket','other-bucket');await file(other,'foreign');
  expect(await withdrawAccountFiles(backend,member,receipt)).toEqual({withdrawn:false,requestId:receipt});expect(await exists()).toBe(true);
  expect(await withdrawAccountFiles(backend,member,receipt)).toEqual({withdrawn:true,requestId:receipt});expect(await exists()).toBe(false);
  expect((await db.query('select * from storage.objects')).rows).toHaveLength(2);expect(await exists(other)).toBe(true);
});
it('refuses final deletion until every file is gone and commits no completion receipt on failure',async()=>{
  await file();await rpc('study_begin_withdrawal',[member,receipt]);await expect(rpc('study_withdraw_account',[member])).rejects.toThrow('WITHDRAWAL_PENDING');
  expect(await exists()).toBe(true);expect(await rpc('study_withdrawal_status',[receipt])).toEqual({withdrawn:false});
});
it('keeps writes and Storage denied even after an intervening reapproval',async()=>{
  await rpc('study_begin_withdrawal',[member,receipt]);await db.query("update study_account_permissions set status='approved' where user_id=$1",[member]);
  await expect(rpc('study_require_access',[member])).rejects.toThrow('ACCESS_DENIED');
  expect((await rpc<any>('study_account_access',[member])).status).toBe('suspended');
  await db.query("select set_config('request.jwt.claim.sub',$1,false)",[member]);
  expect(await rpc('study_current_account_approved',[])).toBe(false);
  expect(await rpc('study_material_original_access',[member+'/personal/document/'+'a'.repeat(64),true])).toBe(false);
});
it('does not let simultaneous administrator withdrawals leave no active administrator',async()=>{
  await db.query('insert into study_administrators(user_id) values($1)',[member]);
  await rpc('study_begin_withdrawal',[member,receipt]);await expect(rpc('study_begin_withdrawal',[owner,'b0000000-0000-4000-8000-000000000002'])).rejects.toThrow('LAST_ADMIN');
});
it('keeps service helpers and receipt tables inaccessible to browser roles',async()=>{
  for(const role of ['anon','authenticated']){
    await db.exec(`set role ${role}`);
    await expect(rpc('study_begin_withdrawal',[member,receipt])).rejects.toThrow('permission denied');
    await expect(rpc('study_withdraw_storage_batch',[member])).rejects.toThrow('permission denied');
    await expect(rpc('study_withdrawal_status',[receipt])).rejects.toThrow('permission denied');
    await expect(db.query('select * from study_withdrawal_receipts')).rejects.toThrow('permission denied');
    await db.exec('reset role');
  }
});
it('recovers the final response without a session using only a random receipt and returns no identity',async()=>{
  await withdrawAccountFiles(backend,member,receipt);
  const status=(key:string)=>rpc<{withdrawn:boolean}>('study_withdrawal_status',[key]);
  const query=(key:string)=>handleWithdrawalStatus(new Request('https://test.invalid/withdrawal-status',{method:'POST',body:JSON.stringify({requestId:key})}),status);
  expect(await(await query(receipt)).json()).toEqual({withdrawn:true});
  expect(await(await query('b0000000-0000-4000-8000-000000000002')).json()).toEqual({withdrawn:false});
  expect((await query('wrong')).status).toBe(400);
});
