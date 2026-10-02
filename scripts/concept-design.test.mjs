import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildPlans, sha256, validatePlan } from './concept-design.mjs';
const raw = await readFile(new URL('../docs/concept-interaction-templates.json',import.meta.url),'utf8');
const registry=JSON.parse(raw), registryHash=sha256(raw);
const originals=[{id:'synthetic-a',name:'합성 용어',def:'합성 정의',ex:'합성 예시',insight:'합성 범위',type:'용어',cat:1},{id:'synthetic-b',name:'두 번째 합성',def:'',ex:'',insight:'',type:'',cat:1}];
const catalogRaw=JSON.stringify({items:originals});
const state={conceptCatalogs:[{id:'catalog',raw:catalogRaw,sha256:sha256(catalogRaw)}],conceptEditions:[{sourceId:'synthetic-a',catalogId:'catalog',version:1,displayType:'정의형',secondaryTypes:[],reason:'단순 정의 검토 초안'}],conceptBatches:[{id:'batch',catalogId:'catalog',status:'open',sourceIds:['synthetic-a','synthetic-b']}]};
function designed() {
 const p=structuredClone(buildPlans(state,registry,registryHash).items[0]);
 return {...p,stage:'design-draft',question:'어떤 뜻인가요?',selectionReason:'단순 정의와 예시의 관계를 살핀다.',slots:{meaning:'용어의 뜻',example:'해당 사례',boundary:'적용 경계'},representations:[{id:'a',kind:'language',role:'single',purpose:'뜻과 예시의 대응',referents:['대상']}],mappings:[],interaction:{kind:'static',effect:'뜻과 예시를 함께 읽는다.',restore:'읽는 위치 복원',resetScope:'위치만 초기화'},ruleApplications:registry.common.requiredRules.map(id=>({id,status:'planned',reason:'구현과 확인 계획'}))};
}
test('목록은 모든 원문 ID를 한 번씩 포함하고 미분류를 확정하지 않는다',()=>{
 const q=buildPlans(state,registry,registryHash);
 assert.deepEqual(q.items.map(p=>p.sourceId),originals.map(i=>i.id));
 assert.equal(q.summary.unclassified,1);assert.equal(q.items[1].primaryType,null);
 assert.deepEqual(q.items[0].currentBatchIds,['batch']);assert.equal(q.summary.published,0);
});
test('재실행은 편집한 질문·역할·선택을 보존한다',()=>{
 const q=buildPlans(state,registry,registryHash);q.items[0]=designed();
 const next=buildPlans(state,registry,registryHash,q);
 assert.deepEqual(next.items[0],q.items[0]);assert.equal(next.summary.designDrafts,1);
});
test('틀과 원문이 바뀌면 이전 설계를 자동 재사용하지 않는다',()=>{
 const q=buildPlans(state,registry,registryHash);
 assert.throws(()=>buildPlans(state,registry,'different',q),/변경/);
 const modified=structuredClone(state);modified.conceptCatalogs[0].raw+=' ';
 assert.throws(()=>buildPlans(modified,registry,registryHash,q),/해시/);
});
test('설명 버전 변경은 설계 내용 보존과 대조 필요 표시로 이어진다',()=>{
 const q=buildPlans(state,registry,registryHash);q.items[0]=designed();
 const modified=structuredClone(state);modified.conceptEditions[0].version=2;
 const next=buildPlans(modified,registry,registryHash,q);
 assert.equal(next.items[0].needsReconcile,true);assert.equal(next.items[0].question,q.items[0].question);
});
test('관계 없는 표현을 나란히 추가하는 것만으로 대응 검사를 통과하지 않는다',()=>{
 const p=designed();p.representations.push({...p.representations[0],id:'b'});
 assert.throws(()=>validatePlan(p,registry,originals[0],state.conceptCatalogs[0].sha256),/연결되지/);
 p.mappings=[{from:'a',to:'b',referent:'없는 대상',meaning:'가짜 대응'}];
 assert.throws(()=>validatePlan(p,registry,originals[0],state.conceptCatalogs[0].sha256),/대응 대상/);
});
test('조절값은 모형·단위·대체 조작·경계를 요구한다',()=>{
 const p=designed();p.primaryType='원리형';p.slots={conditions:'조건',relationship:'관계',reason:'이유',consequence:'결론',boundary:'범위'};p.interaction.kind='parameter';
 assert.throws(()=>validatePlan(p,registry,originals[0],state.conceptCatalogs[0].sha256),/모형/);
 p.interaction.model={formula:'y = x + 1',assumptions:'유한 실수',boundaryBehavior:'범위 안에서만 표시',evidence:['정의된 식'],checks:[{input:'x=0',expected:'y=1'}]};
 p.interaction.controls=[{label:'입력',unit:'무차원',min:0,max:3,step:1,initial:1,alternative:'숫자 입력'}];
 validatePlan(p,registry,originals[0],state.conceptCatalogs[0].sha256);
 p.interaction.controls[0].initial=Infinity;
 assert.throws(()=>validatePlan(p,registry,originals[0],state.conceptCatalogs[0].sha256),/조절값/);
});
test('형식 확인은 의미 검토·실제 화면·등록 완료로 승격하지 않는다',()=>{
 const p=designed();p.review.meaning=true;
 assert.throws(()=>validatePlan(p,registry,originals[0],state.conceptCatalogs[0].sha256),/완료/);
});
test('원문 항목 해시가 다르면 같은 ID라도 설계 재사용을 거부한다',()=>{
 const p=designed();
 assert.throws(()=>validatePlan(p,registry,{...originals[0],def:'변경된 원문'},state.conceptCatalogs[0].sha256),/원문 연결/);
});
test('선택 화면은 의미 있는 두 선택과 유효한 초기 상태를 요구한다',()=>{
 const p=designed();p.interaction.kind='select';
 assert.throws(()=>validatePlan(p,registry,originals[0],state.conceptCatalogs[0].sha256),/초기 상태/);
 p.interaction.choices=[{id:'one',label:'첫 선택',purpose:'한 경우를 확인한다.'},{id:'two',label:'다른 선택',purpose:'다른 경우를 같은 사례로 확인한다.'}];
 p.interaction.initialId='one';p.interaction.keyboardAlternative='native 버튼';
 validatePlan(p,registry,originals[0],state.conceptCatalogs[0].sha256);
 p.interaction.initialId='missing';
 assert.throws(()=>validatePlan(p,registry,originals[0],state.conceptCatalogs[0].sha256),/초기 상태/);
});
