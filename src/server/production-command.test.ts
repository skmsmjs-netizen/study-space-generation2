// @vitest-environment node
import { beforeEach, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { emptyState, type Command } from '../domain/model';
import { applyCommand } from '../domain/commands';
import { importConceptCatalog, openConceptBatch, saveConceptEdition } from '../data/concept-production';
import { emptyConceptEdition } from '../domain/concept-production';
import { packServerState, unpackServerState } from './state-codec';

const owner='a0000000-0000-4000-8000-000000000001';
let handler:(request:Request)=>Promise<Response>,approved:boolean,server:{sequence:number;state:any}|null;
beforeEach(async()=>{
  approved=true;server=null;
  const code=await readFile(new URL('../../supabase/functions/study-command/index.ts',import.meta.url),'utf8');
  runInNewContext(code,{Response,Request,Headers,TextEncoder,TextDecoder,URL,Uint8Array,ArrayBuffer,AbortSignal,crypto,console,performance,setTimeout,clearTimeout,structuredClone,btoa,atob,
    Deno:{env:{get:(key:string)=>key==='SUPABASE_URL'?'https://fixture.invalid':'fixture-key'},serve:(value:typeof handler)=>{handler=value;}},
    fetch:async(input:string,options:RequestInit)=>{
      if(input.endsWith('/auth/v1/user'))return (options.headers as Record<string,string>).Authorization==='Bearer fixture-token'?Response.json({id:owner}):Response.json({}, {status:401});
      const body=JSON.parse(options.body as string);
      if(input.endsWith('/rpc/study_account_access'))return Response.json({status:approved?'approved':'suspended',administrator:false});
      if(input.endsWith('/rpc/study_read_workspace'))return Response.json(server);
      if(input.endsWith('/rpc/study_read_workspace_conditional'))return Response.json(server&&server.sequence===body.p_known_sequence?{unchanged:true,sequence:server.sequence,userId:owner,namespace:body.p_namespace}:server);
      if(input.endsWith('/rpc/study_commit')){server={sequence:body.p_base+1,state:body.p_state};return Response.json({sequence:server.sequence,data:server.state});}
      throw Error('Unexpected production dependency: '+input);
    },
  });
});
function request(body:unknown,token='fixture-token'){return handler(new Request('https://fixture.invalid/functions/v1/study-command',{method:'POST',headers:{authorization:'Bearer '+token},body:JSON.stringify(body)}));}
async function commands(){
  const item={id:'fixture-concept',name:'검증 개념',def:'  조건\r\n예외  ',ex:'합성 예시',insight:'조건 보존',type:'기타',cat:1};const raw=JSON.stringify({items:[item],extra:{preserve:true}});
  let local=emptyState(owner,'test');const ops:Command[]=[];
  const repo={getSnapshot:()=>local,execute:(command:Command)=>{ops.push(command);local=applyCommand(local,command);return local;}};
  await importConceptCatalog(repo,raw,'synthetic.json');const catalog=local.conceptCatalogs![0];const {batch}=openConceptBatch(repo,catalog);
  saveConceptEdition(repo,{...emptyConceptEdition(catalog.id,item),jobId:batch.id},0);
  return{ops,local,raw};
}
it('initializes all three absent concept collections and preserves exact source, IDs and revisions through reload',async()=>{
  const fixture=await commands();
  for(const [index,command] of fixture.ops.entries()){
    const response=await request({action:'execute',namespace:'test',baseSequence:index,command});expect(await response.clone().json()).not.toHaveProperty('code');expect(response.status).toBe(200);
  }
  const data=unpackServerState(server!.state);expect(data.conceptCatalogs?.[0].raw).toBe(fixture.raw);expect(data.conceptBatches).toEqual(fixture.local.conceptBatches);expect(data.conceptEditions).toEqual(fixture.local.conceptEditions);expect(data.revisions).toEqual(fixture.local.revisions);
  const loaded=await(await request({action:'load',namespace:'test'})).json();expect(loaded.data).toEqual(data);
});
it('keeps operation retries idempotent and preserves version and owner rejection on the composed deployment',async()=>{
  const {ops}=await commands();const command=ops[0];const body={action:'execute',namespace:'test',baseSequence:0,command};
  expect((await request(body)).status).toBe(200);expect((await request(body)).status).toBe(200);expect(server!.sequence).toBe(1);
  expect((await request({...body,command:{...command,opId:'foreign',userId:'other'}})).status).toBe(403);
  expect((await request({...body,command:{...command,opId:'stale'}})).status).toBe(409);expect(server!.sequence).toBe(1);
});
it('retains v34 conditional-load markers and authorization checks after the scoped patches',async()=>{
  server={sequence:4,state:packServerState(emptyState(owner,'test'),[])};
  const body={action:'load',namespace:'test',knownSequence:4};
  expect(await(await request(body)).json()).toMatchObject({unchanged:true,sequence:4});
  approved=false;expect((await request(body)).status).toBe(403);
  expect((await request(body,'expired')).status).toBe(401);
});
