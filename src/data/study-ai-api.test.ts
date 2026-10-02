import { afterEach,expect,it,vi } from 'vitest';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
import { generateStudyMaterial, configureOpenAIAPI, localAIStatus } from './study-ai';
vi.mock('./supabase-client',()=>({readServerConfig:()=>({url:'https://synthetic.supabase.co',publishableKey:'sb_publishable_synthetic'}),createStudyClient:()=>({auth:{getSession:async()=>({data:{session:{user:{id:AI_OWNER_USER_ID},access_token:'synthetic-app-jwt'}}}),dispose:()=>{}}})}));
const owner={userId:AI_OWNER_USER_ID,namespace:'personal' as const};
const status={configured:true,local:false,provider:'openai-api',model:'gpt-6-luna',models:[{slug:'gpt-6-luna',displayName:'GPT-6 Luna'}],connectionError:'',billing:{configured:true,enabled:true,limitMicro:3_000_000,usedMicro:0,pendingMicro:0,month:'2026-10-01'}};
afterEach(()=>vi.unstubAllGlobals());
it('routes material generation through the authenticated API server without requiring ChatGPT credits or transmitting an API key',async()=>{
  const result={id:'generated',at:'2026-10-01T00:00:00Z',model:'gpt-6-luna',segments:[{id:'t1',start:null,end:null,text:'합성 원문'}],summary:[{text:'합성 요약',sourceIds:['t1']}],cards:[]};
  const fetcher=vi.fn(async(url:RequestInfo|URL)=>String(url).endsWith('/status')?Response.json(status):Response.json({result}));vi.stubGlobal('fetch',fetcher);
  const r=await generateStudyMaterial(owner,{title:'합성 자료',subjectId:'synthetic-subject',topicId:null,sourceText:'합성 원문',audio:null,results:[]},5);
  expect(r.summary[0].text).toBe('합성 요약');expect(r.source?.text).toBe('합성 원문');
  expect(fetcher.mock.calls.map(c=>String(c[0]))).toEqual(['https://synthetic.supabase.co/functions/v1/study-openai-api/status','https://synthetic.supabase.co/functions/v1/study-openai-api']);
  expect(JSON.stringify(fetcher.mock.calls)).not.toContain('api.openai.com');
});
it('registers a key only with authenticated API settings and never stores it in local study storage',async()=>{
  const fetcher=vi.fn(async()=>Response.json({saved:true}));vi.stubGlobal('fetch',fetcher);localStorage.clear();
  await configureOpenAIAPI(owner,{key:'sk-synthetic-key-do-not-use',limitMicro:1_000_000,enabled:true,confirmPaid:true});
  expect(fetcher).toHaveBeenCalledWith('https://synthetic.supabase.co/functions/v1/study-openai-api/settings',expect.objectContaining({headers:expect.objectContaining({Authorization:'Bearer synthetic-app-jwt'})}));
  expect(JSON.stringify(localStorage)).not.toContain('sk-synthetic-key');
});
it('refuses malformed or inconsistent budget status instead of treating it as a usable connection',async()=>{
  vi.stubGlobal('fetch',vi.fn(async()=>Response.json({...status,billing:{...status.billing,enabled:false}})));
  await expect(localAIStatus(owner)).rejects.toThrow('API 설정의 형식');
});
