import {expect,it} from 'vitest';
import {validateMaterialContent,validateMaterialTransition,type MaterialContent} from './study-material';
const q={id:'q',question:'조건?',options:['일정','무관'],correctIndex:0,explanation:'저항 일정',sourceIds:['s']};
const base:MaterialContent={title:'합성',subjectId:'subject',topicId:null,sourceText:'원문',audio:null,results:[{id:'r',at:'2026-10-01T00:00:00Z',model:'test',segments:[{id:'s',text:'저항이 일정할 때',start:null,end:null}],summary:[],cards:[],quiz:[q]}],quizAttempts:[{id:'a',resultId:'r',at:'2026-10-01T00:00:00Z',submittedAt:'2026-10-01T00:01:00Z',questions:[q],answers:{q:1}}]};
it('preserves submitted attempts across object key order changes and rejects rewritten answers, invented questions and removed attempts',()=>{
 validateMaterialContent(base);const reordered=structuredClone(base);reordered.quizAttempts![0].questions[0]=Object.fromEntries(Object.entries(q).reverse()) as typeof q;expect(()=>validateMaterialTransition(base,reordered)).not.toThrow();
 for(const change of [(v:MaterialContent)=>{v.quizAttempts![0].answers.q=0},(v:MaterialContent)=>{v.quizAttempts![0].questions[0].explanation='위조'},(v:MaterialContent)=>{v.quizAttempts=[]}]){const v=structuredClone(base);change(v);expect(()=>validateMaterialTransition(base,v)).toThrow();}
});
it('rejects wrong-owner cloud metadata before saving and malformed dialogue/answer dictionaries',()=>{
 const v=structuredClone(base);v.audio={key:'k',name:'a',type:'audio/wav',size:1,sha256:'a'.repeat(64),cloudPath:`other/personal/audio/${'a'.repeat(64)}`};expect(()=>validateMaterialTransition(undefined,v,{userId:'owner',namespace:'personal'})).toThrow('다른 계정');
 expect(()=>validateMaterialContent({...base,aiRequest:{task:'summary',history:'malformed'}})).toThrow();expect(()=>validateMaterialContent({...base,quizAttempts:[{...base.quizAttempts![0],answers:null}]})).toThrow();
});
