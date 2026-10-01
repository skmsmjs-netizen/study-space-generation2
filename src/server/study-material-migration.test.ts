// @vitest-environment node
import { afterAll, beforeAll, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { emptyState } from '../domain/model';
import { applyCommand } from '../domain/commands';
import { packServerState, unpackServerState } from './state-codec';
const owner = '20000000-0000-4000-8000-000000000001';
const foreign = '20000000-0000-4000-8000-000000000002';
let db: PGlite;
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create schema auth; create table auth.users(id uuid primary key); create role anon; create role authenticated; create role service_role bypassrls; create function auth.uid() returns uuid language sql as $$select null::uuid$$; insert into auth.users values('${owner}'),('${foreign}'); create function study_account_access(uuid) returns jsonb language sql as $$select jsonb_build_object('status',case when $1='${owner}'::uuid then 'approved' else 'suspended' end)$$;`);
  await db.exec(await readFile(new URL('../../supabase/migrations/202609300001_study_storage.sql', import.meta.url), 'utf8'));
  await db.exec(await readFile(new URL('../../supabase/migrations/20261001100000_study_materials.sql', import.meta.url), 'utf8'));
});
afterAll(async () => { await db.close(); });
it('atomically reserves at most 20 daily AI requests and blocks unapproved or public-role reservation', async () => {
  await db.exec('set role service_role');
  for (let i = 0; i < 20; i++) expect((await db.query<{reserved:boolean}>('select study_reserve_ai_use($1) reserved', [owner])).rows[0].reserved).toBe(true);
  expect((await db.query<{reserved:boolean}>('select study_reserve_ai_use($1) reserved', [owner])).rows[0].reserved).toBe(false);
  await expect(db.query('select study_reserve_ai_use($1)', [foreign])).rejects.toThrow('ACCESS_DENIED');
  await db.exec('reset role; set role authenticated'); await expect(db.query('select study_reserve_ai_use($1)', [owner])).rejects.toThrow('permission denied'); await db.exec('reset role');
});
it('commits original UTF16 once and rejects foreign material ownership metadata before any write', async () => {
  const ctx = { userId: owner, namespace: 'test' as const, at: '2026-10-01T00:00:00Z' };
  const subject = applyCommand(emptyState(owner,'test'), { type:'addSubject',id:'subject',name:'합성 과목',scope:{kind:'independent'},opId:'subject',...ctx });
  const next = applyCommand(subject, { type:'saveStudyMaterial',id:'lecture',expectedVersion:0,content:{title:' 원문 ',subjectId:'subject',topicId:null,sourceText:'\u0000\ud800\r\n조건 ',audio:null,results:[]},opId:'lecture',...ctx });
  const snapshot = packServerState(next,'lecture');
  const commit = (state:unknown) => db.query<{result:{data:unknown,sequence:number}}>('select study_commit_internal($1,$2,$3,$4,$5,$6) result',[owner,'test',0,'lecture',next.appliedOps.lecture,state]);
  await expect(commit({...snapshot,studyMaterials:[{userId:foreign,namespace:'test'}]})).rejects.toThrow('OWNERSHIP');
  for (const collection of ['memoryCards','memoryTests','studyBoards','codeExamples','recallCards']) await expect(commit({...snapshot,[collection]:[{userId:foreign,namespace:'test'}]})).rejects.toThrow('OWNERSHIP');
  expect((await db.query('select * from study_workspaces')).rows).toHaveLength(0);
  const first=(await commit(snapshot)).rows[0].result;
  expect(unpackServerState(first.data).studyMaterials![0].sourceText).toBe('\u0000\ud800\r\n조건 ');
  expect((await commit(snapshot)).rows[0].result.sequence).toBe(1);
});
