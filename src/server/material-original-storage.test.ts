// @vitest-environment node
import {it,expect} from 'vitest';
import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
it('enforces private originals, fresh approval/session, namespaces, immutable documents, audio cleanup and the shared storage ceiling',async()=>{
 const db=new PGlite();const a='10000000-0000-4000-8000-000000000001',b='10000000-0000-4000-8000-000000000002',session='20000000-0000-4000-8000-000000000001',sha='a'.repeat(64);
 try{
 await db.exec(`create role anon;create role authenticated;create schema auth;create schema storage;create table auth.sessions(id uuid,user_id uuid);create table public.study_account_permissions(user_id uuid,status text);create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;create function auth.jwt() returns jsonb language sql as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint);create table storage.objects(id text primary key,bucket_id text,name text,metadata jsonb);alter table storage.objects enable row level security;grant usage on schema public,auth,storage to authenticated,anon;grant select,insert,update,delete on storage.objects to authenticated;grant select on storage.objects to anon;insert into public.study_account_permissions values('${a}','approved'),('${b}','approved');insert into auth.sessions values('${session}','${a}');`);
 await db.exec(await readFile(new URL('../../supabase/migrations/20261001070035_material_originals.sql',import.meta.url),'utf8'));
 expect((await db.query('select public,file_size_limit from storage.buckets')).rows).toEqual([{public:false,file_size_limit:52428800}]);
 const login=async(user=a)=>db.exec(`set role authenticated;set request.jwt.claim.sub='${user}';set request.jwt.claims='{"session_id":"${session}"}';`);
 const insert=(id:string,path:string)=>db.query("insert into storage.objects values($1,'study-material-originals',$2,'{\"size\":10}')",[id,path]);
 await login();await insert('one',`${a}/personal/document/${sha}`);await insert('audio',`${a}/personal/audio/${sha}`);
 expect((await db.query('select * from storage.objects')).rows).toHaveLength(2);
 await expect(insert('foreign',`${b}/personal/document/${sha}`)).rejects.toThrow('row-level security');
 await expect(insert('bad',`${a}/personal/document/../x`)).rejects.toThrow('row-level security');
 expect((await db.query("update storage.objects set name='changed' returning id")).rows).toHaveLength(0);
 expect((await db.query("delete from storage.objects where id='one' returning id")).rows).toHaveLength(0);
 expect((await db.query("delete from storage.objects where id='audio' returning id")).rows).toHaveLength(1);
 await db.exec('set role anon');expect((await db.query('select * from storage.objects')).rows).toHaveLength(0);
 await login(b);expect((await db.query('select * from storage.objects')).rows).toHaveLength(0);
 await login();await db.exec("set request.jwt.claims='{}'");expect((await db.query('select * from storage.objects')).rows).toHaveLength(0);
 await db.exec(`reset role;update public.study_account_permissions set status='pending' where user_id='${a}';`);await login();expect((await db.query('select * from storage.objects')).rows).toHaveLength(0);
 await expect(insert('revoked',`${a}/test/document/${sha}`)).rejects.toThrow('row-level security');
 await db.exec(`reset role;update public.study_account_permissions set status='approved';insert into storage.objects values('ceiling','study-material-originals','reserved','{"size":480000000}');`);await login();
 await expect(insert('quota',`${a}/test/document/${sha}`)).rejects.toThrow('row-level security');
 expect((await db.query('select * from storage.objects')).rows).toHaveLength(1);
 }finally{await db.close();}
},60000);
