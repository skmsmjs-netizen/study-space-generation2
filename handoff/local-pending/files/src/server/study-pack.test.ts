// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { generateGPTMaterial } from './gpt-material';
import { createOpenAIAPIRuntime, API_MODEL } from './openai-api-runtime';
import { emptyState } from '../domain/model';
import { applyCommand } from '../domain/commands';
import { materialReviewMarkdown, materialTranscriptText } from '../data/material-export';

const text = '  V=IR. 저항이 일정한 옴성 소자에 적용한다.\r\n온도에 따라 저항이 변하면 비례하지 않는다.  ';
const output = () => ({summary:[{text:'저항이 일정할 때 V=IR.',sourceIds:['t1'],evidenceType:'material-grounded'}],cards:[{question:'옴의 법칙의 식과 조건은?',answer:'V=IR, 저항이 일정한 옴성 소자.',sourceIds:['t1']}],quiz:[{question:'저항이 일정할 때 전압 두 배의 전류는?',options:['두 배','같음'],correctIndex:0,explanation:'V=IR에서 R 일정.',sourceIds:['t1']}],map:{nodes:[{id:'n1',label:'전압',sourceIds:['t1']},{id:'n2',label:'전류',sourceIds:['t1']}],edges:[{id:'e1',from:'n1',to:'n2',label:'저항 일정일 때 비례',sourceIds:['t1']}]},diagnostics:[]});
async function generate(value: unknown = output()) {
  const budget = {reserve:vi.fn(async()=>({key:'sk-synthetic-unused'})),settle:vi.fn(async()=>{})};
  const provider = vi.fn<typeof fetch>(async()=>Response.json({status:'completed',usage:{input_tokens:100,output_tokens:200},output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(value)}]}]}));
  const runtime=createOpenAIAPIRuntime(budget,provider);
  return {provider,budget,result:generateGPTMaterial({text,audio:null,audioName:'',cardCount:2,request:{task:'study-pack'}},{runtime,model:API_MODEL})};
}
it('creates all four outputs with one provider call and round-trips source, IDs, answers and map without adding study evidence',async()=>{
  const {result,provider,budget}=await generate();const r=await result;
  expect(provider).toHaveBeenCalledTimes(1);expect(budget.reserve).toHaveBeenCalledTimes(1);
  const body=JSON.parse(String(provider.mock.calls[0][1]?.body));expect(body.text.format).toMatchObject({strict:true,schema:{required:expect.arrayContaining(['summary','cards','quiz','map','diagnostics'])}});
  expect(r.summary).toHaveLength(1);expect(r.cards).toHaveLength(1);expect(r.quiz).toHaveLength(1);expect(r.map?.edges).toHaveLength(1);expect(r.segments[0].text).toBe(text);
  const state=emptyState('synthetic','test');const ctx={userId:state.userId,namespace:state.namespace,at:new Date().toISOString()};
  const subject=applyCommand(state,{...ctx,type:'addSubject',id:'s',name:'합성 회로',scope:{kind:'independent'},opId:'s-op'});
  const content={title:'합성',subjectId:'s',topicId:null,sourceText:text,audio:null,aiRequest:{task:'study-pack' as const},results:[r]};
  const next=applyCommand(subject,{...ctx,type:'saveStudyMaterial',id:'m',content,expectedVersion:0,opId:'m-op'});
  expect(JSON.parse(JSON.stringify(next)).studyMaterials[0].results[0]).toEqual(r);expect(next.records).toEqual(subject.records);expect(next.sessions).toEqual(subject.sessions);
  expect(materialTranscriptText(content)).toBe(text);const exported=materialReviewMarkdown(content,r);expect(exported).toContain(text);expect(exported).toContain(r.id);expect(exported).toContain('저항 일정일 때 비례');expect(exported).toContain('기준 답: 1) 두 배');expect(content.results[0]).toEqual(r);
});
it('refuses an incomplete pack and forged source references without a second paid call',async()=>{
  for(const patch of [{quiz:[]},{map:null},{quiz:[{...output().quiz[0],sourceIds:['made-up']}]}]) {
    const probe=await generate({...output(),...patch});await expect(probe.result).rejects.toThrow();expect(probe.provider).toHaveBeenCalledTimes(1);
  }
});
it('keeps partial grounded results and explicit missing-map evidence instead of inventing a map',async()=>{
  const probe=await generate({...output(),map:null,diagnostics:[{kind:'partial',message:'관계의 근거가 부족하여 개념도는 만들지 않았습니다.',questions:[],sourceIds:['t1']}]});
  const r=await probe.result;expect(r.status).toBe('partial');expect(r.cards).toHaveLength(1);expect(r.map).toBeUndefined();expect(r.segments[0].text).toBe(text);expect(probe.provider).toHaveBeenCalledTimes(1);
});
