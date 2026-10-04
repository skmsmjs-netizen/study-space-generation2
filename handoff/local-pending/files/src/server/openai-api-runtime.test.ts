// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { API_MODEL, API_MAX_OUTPUT_TOKENS, budgetCost, createOpenAIAPIRuntime } from './openai-api-runtime';
const key='sk-synthetic-key-never-use-for-inference';
function setup() {
  const budget={reserve:vi.fn(async()=>({key})),settle:vi.fn(async()=>{})};
  const response={status:'completed',usage:{input_tokens:100,output_tokens:50},output:[{type:'message',content:[{type:'output_text',text:'{"summary":[],"cards":[]}'}]}]};
  const provider=vi.fn<typeof fetch>(async()=>Response.json(response));
  const runtime=createOpenAIAPIRuntime(budget,provider);
  const options={model:API_MODEL,input:'합성 원문',instructions:'합성 지시',signal:new AbortController().signal};
  return {budget,provider,runtime,response,options};
}
it('reserves before one fixed-model API call; bounds output, disables storage and retries, then settles conservative usage',async()=>{
  const s=setup(); await expect(s.runtime.streamResponse(s.options)).resolves.toEqual({text:'{"summary":[],"cards":[]}'});
  expect(s.budget.reserve.mock.invocationCallOrder[0]).toBeLessThan(s.provider.mock.invocationCallOrder[0]);
  const [url,opts]=s.provider.mock.calls[0];expect(url).toBe('https://api.openai.com/v1/responses');
  expect(opts?.redirect).toBe('error');expect(opts?.headers).toEqual({Authorization:`Bearer ${key}`,'Content-Type':'application/json'});
  expect(JSON.parse(String(opts?.body))).toMatchObject({model:API_MODEL,store:false,stream:false,service_tier:'default',reasoning:{effort:'low'},text:{format:{type:'json_schema',name:'study_result',strict:true,schema:{type:'object',required:expect.arrayContaining(['summary','cards','diagnostics']),additionalProperties:false}}},max_output_tokens:API_MAX_OUTPUT_TOKENS});
  expect(s.budget.settle).toHaveBeenCalledWith(expect.any(String),budgetCost(100,50));expect(s.provider).toHaveBeenCalledTimes(1);
});
it('refuses a budget rejection and wrong model without sending private input or a provider request',async()=>{
  const s=setup();s.budget.reserve.mockRejectedValueOnce(Error('budget reached'));
  await expect(s.runtime.streamResponse(s.options)).rejects.toThrow('budget reached');
  await expect(s.runtime.streamResponse({...s.options,model:'expensive'})).rejects.toThrow('API 모델');expect(s.provider).not.toHaveBeenCalled();
});
it('releases cancellation before dispatch; keeps the reservation for an interrupted billed request',async()=>{
  const s=setup(),controller=new AbortController();
  s.budget.reserve.mockImplementationOnce(async()=>{controller.abort();return {key};});
  await expect(s.runtime.streamResponse({...s.options,signal:controller.signal})).rejects.toThrow();
  expect(s.provider).not.toHaveBeenCalled();expect(s.budget.settle).toHaveBeenCalledWith(expect.any(String),0);
  s.budget.settle.mockClear();s.provider.mockRejectedValueOnce(new DOMException('lost connection','AbortError'));
  await expect(s.runtime.streamResponse(s.options)).rejects.toThrow('lost connection');expect(s.budget.settle).not.toHaveBeenCalled();expect(s.provider).toHaveBeenCalledTimes(1);
});
it('records incomplete or unusable billed output without retrying or returning a generated result',async()=>{
  const s=setup();s.provider.mockResolvedValueOnce(Response.json({...s.response,status:'incomplete'}));
  await expect(s.runtime.streamResponse(s.options)).rejects.toThrow('끝까지');expect(s.budget.settle).toHaveBeenCalledWith(expect.any(String),budgetCost(100,50));
  s.provider.mockResolvedValueOnce(Response.json({...s.response,output:[]}));await expect(s.runtime.streamResponse(s.options)).rejects.toThrow('결과');expect(s.provider).toHaveBeenCalledTimes(2);
});
it('does not leak supplier error text or credentials and does not automatically retry',async()=>{
  const s=setup();s.provider.mockResolvedValueOnce(Response.json({error:{message:`SECRET ${key} ${s.options.input}`}}, {status:401}));
  await expect(s.runtime.streamResponse(s.options)).rejects.toThrow('API 키와 호출 권한');expect(s.budget.settle).toHaveBeenCalledWith(expect.any(String),0);expect(s.provider).toHaveBeenCalledTimes(1);
});
it('retains unknown usage reservations and settlement failures rather than releasing possible charges',async()=>{
  const s=setup();s.provider.mockResolvedValueOnce(Response.json({...s.response,usage:null}));await s.runtime.streamResponse(s.options);expect(s.budget.settle).not.toHaveBeenCalled();
  s.budget.settle.mockRejectedValueOnce(Error('server unavailable'));await expect(s.runtime.streamResponse(s.options)).resolves.toBeDefined();expect(s.provider).toHaveBeenCalledTimes(2);
});

