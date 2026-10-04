// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { createPaidStudyAIHandler, type PaidAIBackend } from './paid-study-ai';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
import { DomainError } from '../domain/model';
function setup() {
  const backend:PaidAIBackend={authorize:vi.fn(async()=>({userId:AI_OWNER_USER_ID,namespace:'personal'})),
    status:vi.fn(async()=>({configured:false,enabled:false,limitMicro:10_000_000,usedMicro:0,pendingMicro:0,month:'2026-10-01'})),
    configure:vi.fn(async()=>{}),budget:vi.fn(()=>({reserve:vi.fn(),settle:vi.fn()}))};
  return {backend,handler:createPaidStudyAIHandler(backend)};
}
const req=(path:string,body?:unknown)=>new Request(`https://example.invalid/functions/v1/study-openai-api${path}`,body===undefined?{}:{method:'POST',body:JSON.stringify(body)});
it('returns safe unconfigured API status without decrypting a key or calling inference',async()=>{
  const s=setup();const r=await s.handler(req('/status'));expect(r.status).toBe(200);
  expect(await r.json()).toMatchObject({provider:'openai-api',configured:false,local:false,model:'gpt-6-luna',billing:{limitMicro:10_000_000}});expect(s.backend.budget).not.toHaveBeenCalled();
});
it('requires approved owner identity before reading settings or study content',async()=>{
  const s=setup();vi.mocked(s.backend.authorize).mockResolvedValue({userId:'another-user',namespace:'personal'});
  const r=await s.handler(req('/settings',{key:'sk-synthetic-key-do-not-use'}));expect(r.status).toBe(403);expect(s.backend.configure).not.toHaveBeenCalled();expect(s.backend.status).not.toHaveBeenCalled();
  vi.mocked(s.backend.authorize).mockRejectedValueOnce(new DomainError('AUTH_REQUIRED','다시 로그인'));expect((await s.handler(req('/status'))).status).toBe(401);
});
it('requires explicit separate-cost confirmation and bounded settings, and never echoes a submitted key',async()=>{
  const s=setup(),settings={key:'sk-synthetic-key-do-not-use',limitMicro:10_000_000,enabled:true,confirmPaid:true};
  for(const body of [{...settings,confirmPaid:false},{...settings,limitMicro:11_000_000},{...settings,key:'invalid'}]) expect((await s.handler(req('/settings',body))).status).toBe(400);
  expect(s.backend.configure).not.toHaveBeenCalled();const r=await s.handler(req('/settings',settings));expect(await r.json()).toEqual({saved:true});expect(s.backend.configure).toHaveBeenCalledTimes(1);
});
it('refuses generation before private input parsing when there is no enabled API key',async()=>{
  const s=setup();const r=await s.handler(new Request('https://example.invalid/functions/v1/study-openai-api',{method:'POST',body:'not a form'}));
  expect(r.status).toBe(400);expect(await r.json()).toMatchObject({code:'AI_API_KEY_REQUIRED'});expect(s.backend.budget).not.toHaveBeenCalled();
});
