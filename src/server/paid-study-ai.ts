import { generateGPTPhotoOutline, handlePhotoOutlineAI } from './gpt-photo-outline';
import { requireOwnerAI } from '../domain/ai-access';
import { DomainError } from '../domain/model';
import { aiResponse, handleStudyAI } from './study-ai';
import { generateGPTMaterial } from './gpt-material';
import { generateGPTTopicMemory, handleTopicMemoryAI } from './gpt-topic-memory';
import { API_MODEL, createOpenAIAPIRuntime, type APIBudget } from './openai-api-runtime';

export interface PaidAPIStatus { configured: boolean; enabled: boolean; limitMicro: number; usedMicro: number; pendingMicro: number; month: string; }
export interface PaidAIBackend {
  authorize(req: Request): Promise<{ userId: string; namespace: string }>;
  status(req: Request): Promise<PaidAPIStatus>;
  configure(req: Request, settings: { key?: string; limitMicro: number; enabled: boolean; disconnect?: boolean }): Promise<void>;
  budget(req: Request): APIBudget;
}
export function createPaidStudyAIHandler(backend: PaidAIBackend) {
  return async (req: Request): Promise<Response> => {
    if (req.method === 'OPTIONS') return new Response(null, {status: 204, headers: aiResponse(null).headers});
    const path = new URL(req.url).pathname.replace(/^\/functions\/v1/, '');
    if (!['/study-openai-api','/study-openai-api/status','/study-openai-api/settings','/study-openai-api/topic-memory','/study-openai-api/photo-outline'].includes(path)) return aiResponse({message:'지원하지 않는 요청입니다.'},404);
    try {
      requireOwnerAI(await backend.authorize(req));
      if (path.endsWith('/settings')) {
        if (req.method !== 'POST') return aiResponse({message:'지원하지 않는 요청입니다.'},405);
        const reader = req.body?.getReader(); if (!reader) throw new DomainError('INVALID_API_SETTINGS','API 설정을 확인해 주세요.');
        let input = ''; const decoder = new TextDecoder(); let size = 0;
        while(true) { const p = await reader.read(); if(p.done) break; size += p.value.length;
          if(size > 8000) {await reader.cancel(); throw new DomainError('INVALID_API_SETTINGS','API 설정을 확인해 주세요.');} input += decoder.decode(p.value,{stream:true}); }
        input += decoder.decode(); const body = JSON.parse(input);
        if (body.confirmPaid !== true || typeof body.enabled !== 'boolean' || !Number.isSafeInteger(body.limitMicro) || body.limitMicro < 100_000 || body.limitMicro > 10_000_000
          || (body.key !== undefined && (typeof body.key !== 'string' || !/^sk-[A-Za-z0-9_-]{16,1000}$/.test(body.key)))
          || (body.disconnect !== undefined && typeof body.disconnect !== 'boolean')) throw new DomainError('INVALID_API_SETTINGS','별도 API 비용과 월 상한을 확인해 주세요.');
        await backend.configure(req,{key:body.key,enabled:body.enabled,limitMicro:body.limitMicro,disconnect:body.disconnect});
        return aiResponse({saved:true});
      }
      const status = await backend.status(req);
      if (path.endsWith('/status')) {
        if (req.method !== 'GET') return aiResponse({message:'지원하지 않는 요청입니다.'},405);
        return aiResponse({configured:status.configured && status.enabled,local:false,provider:'openai-api',model:API_MODEL,
          models:[{slug:API_MODEL,displayName:'GPT-6 Luna'}],session:{status:status.configured?'connected':'disconnected',sharing:false},
          creditsConfirmed:false,transcription:false,connecting:false,billing:status,
          connectionError:!status.configured?'GPT 연결에서 OpenAI API 키를 등록해 주세요.':!status.enabled?'API 사용을 멈췄습니다. GPT 연결에서 다시 켤 수 있습니다.':''});
      }
      if (!status.configured || !status.enabled) throw new DomainError('AI_API_KEY_REQUIRED','GPT 연결에서 API 키를 등록하고 사용을 켜 주세요. 원본은 보관했습니다.');
      const runtime = createOpenAIAPIRuntime(backend.budget(req));
      const authorize = async (request:Request) => {const owner=await backend.authorize(request);requireOwnerAI(owner);return owner;};
      const beforeInference = async()=>{await authorize(req);};
      const reserve = async()=>{}; // Atomic cost reservation occurs immediately before the real API call.
      if(path.endsWith('/photo-outline')) return handlePhotoOutlineAI(req,{authorize,generate:photos=>generateGPTPhotoOutline(photos,{runtime,model:API_MODEL,beforeInference,signal:req.signal})});
      if(path.endsWith('/topic-memory')) return handleTopicMemoryAI(req,{authorize,reserve,
        generate:input=>generateGPTTopicMemory(input,{runtime,model:API_MODEL,beforeInference,signal:req.signal})});
      return handleStudyAI(req,{authorize,reserve,generate:input=>{
        if(input.audio) throw new DomainError('INVALID_REQUEST','먼저 무료 받아쓰기를 실행하고 전사문을 자료에 추가해 주세요. 원본 음성은 보관했습니다.');
        return generateGPTMaterial(input,{runtime,model:API_MODEL,beforeInference,signal:req.signal});
      }});
    } catch(error) {
      const known=error instanceof DomainError; const code=known?error.code:'AI_API_ERROR';
      return aiResponse({code,message:known?error.message:'API 연결을 확인하지 못했습니다. 원본과 설정을 보관했습니다.'},code==='AUTH_REQUIRED'?401:['ACCESS_DENIED','AI_OWNER_REQUIRED'].includes(code)?403:400);
    }
  };
}
