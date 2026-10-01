// @vitest-environment node
import { beforeAll, beforeEach, afterAll, expect, it, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { handleCommand, type CommandBackend } from './command-handler';
import { packServerState, unpackServerState } from './state-codec';
import { emptyState, type Command } from '../domain/model';
import { applyCommand } from '../domain/commands';
const user='10000000-0000-4000-8000-000000000001', other='10000000-0000-4000-8000-000000000002';
let db:PGlite;
const op=(id:string)=>({type:'addSubject',id,name:'  원문\r\n'+id,scope:{kind:'independent'},userId:user,namespace:'test',at:'2026-10-01T10:00:00Z',opId:id} as Command);
const commitBatch=vi.fn(async (id,namespace,base,commands:Command[],next)=>{
  const operations=commands.map(command=>({id:command.opId,payload:next.appliedOps[command.opId]}));
  const result=await db.query<{result:{sequence:number;data:unknown}}>('select study_commit_batch($1,$2,$3,$4,$5) result',[id,namespace,base,operations,packServerState(next,commands.map(command=>command.opId))]);
  return {sequence:result.rows[0].result.sequence,data:unpackServerState(result.rows[0].result.data)};
});
const backend:CommandBackend={authenticate:async()=>user,access:async()=>({status:'approved',administrator:false}),read:async()=>{
  const result=await db.query<{sequence:number;state:unknown}>('select sequence,state from study_workspaces where user_id=$1 and namespace=$2',[user,'test']);
  return result.rows.length?{sequence:Number(result.rows[0].sequence),data:unpackServerState(result.rows[0].state)}:null;
},commit:vi.fn(async()=>{throw Error('single commit unexpectedly called');}),commitBatch};
const request=(commands:Command[],baseSequence=0)=>handleCommand(new Request('http://test',{method:'POST',headers:{authorization:'Bearer synthetic'},body:JSON.stringify({action:'execute-batch',namespace:'test',baseSequence,commands})}),backend);
beforeAll(async()=>{
  db=new PGlite();
  await db.exec(`create schema auth;create table auth.users(id uuid primary key);create role anon;create role authenticated;create role service_role bypassrls;grant usage on schema public,auth to authenticated,service_role,anon;create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;insert into auth.users values('${user}'),('${other}');`);
  for(const name of ['202609300001_study_storage.sql','202610010004_account_approval.sql','20261001180000_integration_ink_and_catalog_ownership.sql','20261001105023_atomic_command_batch.sql'])await db.exec(await readFile(new URL('../../supabase/migrations/'+name,import.meta.url),'utf8'));
});
beforeEach(async()=>{await db.exec(`reset role;truncate study_operations,study_workspaces;update study_account_permissions set status='approved';`);vi.clearAllMocks();});
afterAll(async()=>db.close());
it('commits sixteen operations in one transaction with sixteen receipts and exact UTF16 histories',async()=>{
  const commands=Array.from({length:15},(_,i)=>op('subject-'+i));
  const raw='  원문\u0000\ud800\r\n\t\\u0000';
  commands.push({...op('text'),type:'updateNarrative',id:'text',kind:'subject-overview',ownerId:'subject-0',body:raw,expectedVersion:0} as Command);
  const response=await request(commands);expect(response.status).toBe(200);
  const saved=await backend.read(user,'test');expect(saved?.sequence).toBe(16);expect(saved?.data.narratives[0].body).toBe(raw);expect(saved?.data.revisions).toHaveLength(16);
  expect(commitBatch).toHaveBeenCalledTimes(1);expect(backend.commit).not.toHaveBeenCalled();
  expect((await db.query<{sequence:number}>('select sequence from study_operations order by sequence')).rows.map(row=>row.sequence)).toEqual(Array.from({length:16},(_,i)=>i+1));
  expect((await request(commands)).status).toBe(200);expect(commitBatch).toHaveBeenCalledTimes(1);
});
it('does not commit a valid prefix when a later domain command is invalid',async()=>{
  const invalid={...op('bad'),name:''} as Command;
  expect((await request([op('one'),invalid])).status).toBe(400);
  expect(commitBatch).not.toHaveBeenCalled();expect((await db.query('select * from study_workspaces')).rows).toEqual([]);
});
it('rolls back every receipt and the workspace when a final receipt is malformed',async()=>{
  const commands=[op('one'),op('two')],next=commands.reduce(applyCommand,emptyState(user,'test'));
  await expect(db.query('select study_commit_batch($1,$2,$3,$4,$5)',[user,'test',0,[{id:'one',payload:next.appliedOps.one},{id:'two',payload:'changed'}],packServerState(next,['one','two'])])).rejects.toThrow('INVALID_OPERATION');
  expect((await db.query('select * from study_operations')).rows).toEqual([]);expect((await db.query('select * from study_workspaces')).rows).toEqual([]);
});
it('keeps newer data on a lost-acknowledgement RPC retry',async()=>{
  const commands=[op('one'),op('two')],next=commands.reduce(applyCommand,emptyState(user,'test'));
  await commitBatch(user,'test',0,commands,next);
  await request([op('newer')],2);
  const response=await commitBatch(user,'test',0,commands,next);
  expect(response.sequence).toBe(3);expect(response.data.subjects.map(row=>row.id)).toEqual(['one','two','newer']);
  expect((await db.query('select * from study_operations')).rows).toHaveLength(3);
});
it('rejects a stale batch, foreign owner and reused receipt with changed payload',async()=>{
  await request([op('one')]);
  expect((await request([op('different')])).status).toBe(409);
  expect((await request([{...op('foreign'),userId:other}])).status).toBe(403);
  const reused=await request([{...op('one'),name:'changed'} as Command]);expect(reused.status).toBe(400);expect((await reused.json()).code).toBe('OPERATION_REUSED');
  expect((await backend.read(user,'test'))?.data.subjects).toHaveLength(1);
});
it('checks database approval and all packed entity owners and blocks direct browser RPC calls',async()=>{
  const command=op('one'),next=applyCommand(emptyState(user,'test'),command),packed=packServerState(next,'one');
  const args=[user,'test',0,[{id:'one',payload:next.appliedOps.one}],packed];
  await db.exec(`update study_account_permissions set status='suspended' where user_id='${user}';`);
  await expect(db.query('select study_commit_batch($1,$2,$3,$4,$5)',args)).rejects.toThrow('ACCESS_DENIED');
  await db.exec(`update study_account_permissions set status='approved';`);
  await expect(db.query('select study_commit_batch($1,$2,$3,$4,$5)',[...args.slice(0,4),{...packed,subjects:[{userId:other,namespace:'test'}]}])).rejects.toThrow('OWNERSHIP');
  for(const role of ['anon','authenticated']){await db.exec('set role '+role);await expect(db.query('select study_commit_batch($1,$2,$3,$4,$5)',args)).rejects.toThrow('permission denied');await db.exec('reset role');}
});
