import { createPaidStudyAIHandler } from '../../../src/server/paid-study-ai';
import { DomainError } from '../../../src/domain/model';
import { requireOwnerAI } from '../../../src/domain/ai-access';
import { requireApproved } from '../../../src/server/account-access';
declare const Deno: {env:{get(key:string):string|undefined};serve(handler:(req:Request)=>Promise<Response>):void};
const url=Deno.env.get('SUPABASE_URL')!,publicKey=Deno.env.get('SUPABASE_ANON_KEY')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
type Identity={userId:string;namespace:string;sessionId:string};
async function authorize(req:Request):Promise<Identity>{
  const authorization=req.headers.get('authorization');
  if(!authorization?.startsWith('Bearer ')) throw new DomainError('AUTH_REQUIRED','개인 공간에 다시 로그인해 주세요.');
  const r=await fetch(`${url}/auth/v1/user`,{headers:{apikey:publicKey,Authorization:authorization}});
  if(!r.ok)throw new DomainError('AUTH_REQUIRED','로그인이 만료되었습니다.');
  const userId=(await r.json()).id;const identity={userId,namespace:'personal'};requireOwnerAI(identity);
  let sessionId:string;try{sessionId=JSON.parse(atob(authorization.slice(7).split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).session_id;}catch{throw new DomainError('AUTH_REQUIRED','로그인을 다시 확인해 주세요.');}
  if(typeof sessionId!=='string'||!/^[0-9a-f-]{36}$/i.test(sessionId))throw new DomainError('AUTH_REQUIRED','로그인을 다시 확인해 주세요.');
  const a=await rawRPC('study_account_access',{p_user:userId});requireApproved(a);return {...identity,sessionId};
}
async function rawRPC(name:string,body:unknown){
  const r=await fetch(`${url}/rest/v1/rpc/${name}`,{method:'POST',headers:{apikey:service,Authorization:`Bearer ${service}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!r.ok){const error=await r.json().catch(()=>({message:''}));const m=String(error.message??'');
    throw new DomainError(m.includes('API_ACCESS_DENIED')?'ACCESS_DENIED':m.includes('API_BUDGET_EXCEEDED')?'AI_BUDGET_EXCEEDED':m.includes('API_BUSY')?'AI_BUSY':m.includes('API_KEY_REQUIRED')?'AI_API_KEY_REQUIRED':'AI_API_SETTINGS',
      m.includes('API_BUDGET_EXCEEDED')?'이번 달 API 사용 상한에 도달했습니다. 원본과 기존 결과는 보관했습니다.':m.includes('API_BUSY')?'앞선 생성이 처리 중이거나 사용량 확인을 기다리고 있습니다. 잠시 뒤 직접 다시 선택해 주세요.':m.includes('API_KEY_REQUIRED')?'GPT 연결에서 API 키를 등록해 주세요.':m.includes('API_ACCESS_DENIED')?'현재 계정의 AI 사용 권한을 확인해 주세요.':'API 보관 설정을 확인하지 못했습니다. 입력은 보관했습니다.');
  }return r.status===204?null:r.json();
}
async function args(req:Request){const i=await authorize(req);return{p_user:i.userId,p_session:i.sessionId};}
Deno.serve(createPaidStudyAIHandler({authorize,
  async status(req){return rawRPC('study_ai_api_status',await args(req));},
  async configure(req,s){await rawRPC('study_ai_api_configure',{...await args(req),p_key:s.key??null,p_limit:s.limitMicro,p_enabled:s.enabled,p_disconnect:s.disconnect??false});},
  budget(req){return{
    async reserve(id,amount){return rawRPC('study_ai_api_reserve',{...await args(req),p_id:id,p_amount:amount});},
    async settle(id,amount){await rawRPC('study_ai_api_settle',{...await args(req),p_id:id,p_amount:amount});}
  };}
}));
