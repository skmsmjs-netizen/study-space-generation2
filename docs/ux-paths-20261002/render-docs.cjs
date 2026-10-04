/* Documentation projection only. Every complete expression stays in source-actions.json. */
const fs=require('fs'),path=require('path');
const {POLICY,createContext,compactItem}=require('../figma-memory-20261002/compact-ux.cjs');
if(process.argv.includes('--full-figma'))throw Error('Full UX code is preserved locally. Figma publishing uses summary/reference cards only.');
const OUT=__dirname,ROOT=path.resolve(OUT,'../..'),read=n=>JSON.parse(fs.readFileSync(path.join(OUT,n),'utf8'));
const m=read('manifest.json'),s=read('source-actions.json'),all=[...m.paths,...m.extensionPaths];
const actions=new Map(s.actions.map(a=>[a.id,a])),handlers=new Map(s.handlers.map(a=>[a.id,a])),branches=new Map(s.branches.map(a=>[a.id,a])),renders=new Map(s.renderSites.map(a=>[a.id,a]));
const stem=p=>p.replace(/^src\//,'').replace(/\//g,'__').replace(/\.[^.]+$/,'');
const guard=g=>g.map(x=>`${x.truth}: ${x.expression}`).join(' ∧ ')||'별도 조건식 없음';
const esc=x=>String(x??'').replace(/\|/g,'\\|').replace(/\n/g,'<br>');
const one=x=>String(x??'').replace(/\s+/g,' ').trim();
const actionLink=(a,prefix='../')=>`[${a.id}](${prefix}actions/${stem(a.path)}.md#${a.id.toLowerCase()})`;
const sourceLink=(p,line,prefix='../../../')=>`[${p}:${line}](${prefix}${p}#L${line})`;
for(const d of ['paths','actions','handlers','figma-inputs'])fs.mkdirSync(path.join(OUT,d),{recursive:true});
for(const dir of ['paths','actions','handlers'])for(const name of fs.readdirSync(path.join(OUT,dir)))if(name.endsWith('.md'))fs.unlinkSync(path.join(OUT,dir,name));
const actionOwners=new Map();for(const p of all)for(const b of p.actionBindings){if(!actionOwners.has(b.actionId))actionOwners.set(b.actionId,[]);actionOwners.get(b.actionId).push(p.id);}
const relevantHandlers=new Set([...s.actions.flatMap(a=>a.handlerTrace),...all.flatMap(p=>p.entry.sourceContexts.map(c=>c.handlerId)),...s.effects.map(e=>e.handlerId)].filter(Boolean));
for(const file of [...new Set(s.handlers.filter(h=>relevantHandlers.has(h.id)).map(h=>h.path))]){
 let md=`# ${file} — 실제 핸들러·조건 분기\n\n`+'정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.\n\n';
 for(const h of s.handlers.filter(h=>h.path===file&&relevantHandlers.has(h.id))){md+=`## ${h.id}\n\n**${h.name}** · ${sourceLink(h.path,h.line)}${h.async?' · async':''}\n\n`;
  if(h.branches.length){md+='분기 조건과 가능한 갈림길:\n\n';for(const bid of h.branches){const b=branches.get(bid);md+=`- ${b.id} · ${b.kind} · ${b.condition===null?'구조 분기':one(b.condition)} → ${b.alternatives.join(' / ')}; 바깥 조건: ${guard(b.parentGuards)} (${b.line}행).\n`;}}
  if(h.calls.length){md+='\n실제 호출과 호출이 놓인 조건:\n\n| 근거 | 조건 | 호출·의미 경계 |\n| --- | --- | --- |\n';for(const c of h.calls){const args=c.arguments.map(a=>one(a));const shown=args.join(', ');md+=`| ${c.line}행 | ${esc(guard(c.guards||[]))} | ${esc(c.callee)}(${esc(shown.length>700?shown.slice(0,700)+' … [전체 인수는 JSON·소스]':shown)})<br>${c.category}${c.targetHandlerId?' → ['+c.targetHandlerId+']('+stem(handlers.get(c.targetHandlerId).path)+'.md#'+c.targetHandlerId.toLowerCase()+')':''}${c.callbackHandlerIds?.length?'<br>전달 콜백: '+c.callbackHandlerIds.join(', '):''} |\n`;}}
  if(h.returns.length)md+='\n반환/조기 중단: '+h.returns.map(r=>`${r.line}행 ${one(r.expression||'void').slice(0,700)} [${guard(r.guards||[])}]`).join('; ')+'\n';
  if(h.throws.length)md+='\nthrow: '+h.throws.map(r=>`${r.line}행 ${one(r.expression)}`).join('; ')+'\n';
  if(!h.calls.length&&!h.branches.length)md+='직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.\n';
  md+='\n';
 }
 fs.writeFileSync(path.join(OUT,'handlers',stem(file)+'.md'),md);
}
for(const file of [...new Set(s.actions.map(a=>a.path))]){
 let md=`# ${file} — 조작별 UX 경로\n\n`+'같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.\n\n';
 for(const a of s.actions.filter(a=>a.path===file)){
 md+=`## ${a.id}\n\n**${a.label}** · ${a.tag} · ${a.kind}\n\n- 실제 소스: ${sourceLink(a.path,a.line)}\n- 연결 표면: ${(actionOwners.get(a.id)||[]).map(id=>`[${id}](../paths/${id}.md)`).join(', ')||'미분류'}\n- 직접 표시 조건: ${guard(a.guards)}\n- 실행 차단 disabled: ${a.props.disabled?.source||'명시 없음'}\n- readOnly: ${a.props.readOnly?.source||'명시 없음'}; required: ${a.props.required?.source||'명시 없음'}; form: ${a.formOwner||'없음'}\n- 소스 의미 후보: ${a.facets.join(' · ')} (이 분류는 안내용이며 원문 이벤트를 우선한다.)\n\n`;
 if(a.props.href||a.props.to)md+=`링크 목적지: \`${a.props.href?.source||a.props.to?.source}\`. 동적 ID는 현재 항목 값을 사용한다.\n\n`;
 for(const t of a.transitions){md+=`**${t.event}** → ${t.handlerIds.length?t.handlerIds.map(id=>{const h=handlers.get(id);return`[${h.name} · ${id}](../handlers/${stem(h.path)}.md#${id.toLowerCase()})`;}).join(' → '):t.reason||'네이티브/호출자 동작'}\n\n`;const ev=a.events.find(e=>e.name===t.event);if(ev)md+='```tsx\n'+ev.expression+'\n```\n\n';md+=`- 정상 경계: ${t.normal||t.reason||'네이티브/부모 전달'}\n- 예외 경계: ${t.exception||'이벤트 자체가 명시되지 않은 네이티브/선언적 조작'}\n- 마지막 처리: ${t.finally||'명시된 finally 없음'}\n- 분기 ID: ${t.branchIds.join(', ')||'없음'}\n\n`;}
 if(a.repetition.length)md+='반복: '+a.repetition.map(r=>`${r.kind}(${one(r.collection||r.expression)}) · ${r.line}행`).join('; ')+'. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.\n\n';
 if(a.spreadProps?.length)md+='전달 props 경계: '+a.spreadProps.join(', ')+'. 전달 내용은 호출 지점이 담당한다.\n\n';
 }
 fs.writeFileSync(path.join(OUT,'actions',stem(file)+'.md'),md);
}
for(const p of all){let md=`# ${p.id} · ${p.name}\n\n`+`범위: ${p.kind}${p.path?' · `'+p.path+'`':''}${p.mode?' · dialog='+p.mode:''}. 정적 경로 문서이며 실행 검증 완료가 아니다.\n\n`;
 md+=`- 원본: ${p.source.map(x=>`[${x.path}${x.export?'#'+x.export:''}](../../../${x.path})`).join(', ')||p.sourceFiles.map(x=>`[${x}](../../../${x})`).join(', ')}\n- 진입: ${(p.parents.length?p.parents:p.path?[p.path]:['담당 소스 호출자']).join(' / ')}\n- 복귀: ${p.originalReturn||'원래 호출자·현재 소스가 지정한 경로. 고정 목적지를 임의 만들지 않는다.'}\n- 상태 계약: ${p.commonContractIds.join(', ')||'확장/표면에 별도 지정 없음'}\n- 소스 상태군: ${p.originalStates.join(' · ')||'별도 이름 없음'}\n\n`;
 if(p.entry.modalOwnerCorrections?.length)md+='원본 소유자 보완: '+p.entry.modalOwnerCorrections.map(x=>`${x.path}#${x.export}:${x.line} — ${x.reason}`).join('; ')+'\n\n';
 if(p.cases?.length)md+='구체적 경우와 경로:\n\n'+p.cases.map((c,i)=>`${i+1}. ${c}`).join('\n')+'\n\n';
 if(p.actionBindings.length){md+='| 조작·이벤트 | 나타나는 조건과 차단 | 전체 결과 경로 |\n| --- | --- | --- |\n';for(const b of p.actionBindings){const a=actions.get(b.actionId);const outer=[...new Map(b.via.flatMap(v=>v.flatMap(rid=>(renders.get(rid)?.guards||[]))).map(g=>[JSON.stringify(g),g])).values()];md+=`| ${esc(a.label)}<br>${a.events.map(e=>e.name).join('/ ')||a.transitions[0].event}<br>${a.path}:${a.line} | ${esc(guard([...outer,...a.guards]))}${a.props.disabled?'<br>차단: '+esc(a.props.disabled.source):''}${a.props.readOnly?'<br>읽기만: '+esc(a.props.readOnly.source):''} | ${actionLink(a)}<br>${b.relationships.join(', ')} |\n`;}}
 else md+='이 범위가 새 버튼을 직접 만들지는 않는다. 표현 전용/엔진 계약은 진입하는 상위 UI·수동 경우의 경로와 연결한다. 조작이 없는 것과 구현 누락을 같은 상태로 세지 않는다.\n';
 if(p.emptyErrorAndLoading.length)md+='\n빈 값·오류·로딩의 실제 표시:\n\n'+p.emptyErrorAndLoading.map(v=>`- ${v.id} ${v.tag}: ${one(v.content)} / ${guard(v.guards)}`).join('\n')+'\n';
 md+=`\n중단·복귀 대조: lifecycle effect ${p.lifecycleEffects.length}개, 상태 변수 ${p.stateVariables.length}개. 아래 effect는 mount/의존성 변경/cleanup 경로이며, 브라우저를 닫은 뒤의 영구 보존을 자동 보장하지 않는다.\n\n`;
 for(const id of p.lifecycleEffects){const e=s.effects.find(e=>e.id===id),h=handlers.get(e.handlerId);md+=`- ${id}: ${e.hook} deps ${e.dependencies||'미지정'} → ${h?`[${h.name}](../handlers/${stem(h.path)}.md#${h.id.toLowerCase()})`:'동적 콜백'} · ${e.path}:${e.line}\n`;}
 if(p.repetitionRules.length)md+='\n반복 규칙:\n\n'+p.repetitionRules.map(r=>`- ${r.kind}(${one(r.collection||r.expression)}) · ${r.line}행. 자료 증가·삭제·재선택은 같은 조건별 경로의 매개변수이다.`).join('\n')+'\n';
 if(p.excludedBindings.length)md+=`\n현재 경로/모달의 리터럴 조건과 맞지 않아 제외한 바인딩 ${p.excludedBindings.length}개는 manifest.excludedBindings에 이유와 대상 ID를 남겼다. 이 제외는 런타임 입력 조합이 전부 불가능함을 증명한 것이 아니다.\n`;
 fs.writeFileSync(path.join(OUT,'paths',p.id+'.md'),md);
}
let md='# 전체 UI의 조건별 UX 경로\n\n';
md+=`원래 **41 경로 + 29 모달 + 41 보조면 = 111개**, 확장 A01–A10 **10개**를 별도로 등록했다. 현재 스냅샷의 고유 정적 조작은 **${s.actions.length}개**, 표면·확장에 연결한 조작은 **${m.coverage.source.classifiedActions}개**, 미분류는 **${m.unclassified.length}개**이다. 이 숫자는 실행 시험 수가 아니다.\n\n`;
md+='## 체크섬부터 확인\n\n| 대상 | 개수·상태 | SHA-256 |\n| --- | --- | --- |\n'+`| 원래 표면 ID | 111 · 누락 ${m.coverage.surfaces.missing.length} | ${m.checksums.surfaceIds} |\n| 도달·확장 계약 소스 파일 | ${m.files.length} · TSX ${m.coverage.source.reachableTsx} | ${m.checksums.sourceFiles} |\n| 고유 조작 ID | ${s.actions.length} | ${m.checksums.actionIds} |\n\n`;
md+='조건별 경로는 **진입 → 표시 조건 → disabled/readOnly/IME/권한 등의 실행 조건 → 이벤트 → 정상 반환·중단·오류·finally → 복귀/다시 시도**로 읽는다. 원문은 조작별 문서와 구조화 JSON에 남겨 조건을 생략한 성공 경로로 축약하지 않는다. 자료 항목 수·입력 문장·선택 조합·네트워크 시점은 무한히 늘 수 있으므로 반복 규칙으로 모델링하며 전수 실행을 주장하지 않는다.\n\n';
md+='## 111개 표면과 10개 확장\n\n| ID | 표면·경로 | 연결 조작 | 상태·effect |\n| --- | --- | --- | --- |\n';for(const p of all)md+=`| ${p.id} | [${p.name}](paths/${p.id}.md)${p.path?' · `'+p.path+'`':''} | ${p.actionBindings.length} | ${p.commonContractIds.length} 계약 / ${p.lifecycleEffects.length} effect |\n`;
md+='\n## 14개 과업\n\n';for(const f of m.flows)md+=`- **${f.id} ${f.name}**: ${f.steps.join(' → ')}. 보존: ${f.preservation}\n`;
md+='\n42개 공통 상태·32개 전이는 [공통상태.md](공통상태.md)와 manifest에 원문 그대로 재사용했다. 표면마다 동일한 저장/오류 상태가 발생한다고 임의 가정하지 않는다.\n\n## 미분류와 경계\n\n';md+=m.unclassified.length?m.unclassified.map(u=>`- ${u.id} ${u.path}:${u.line} ${u.label}: ${u.reason}`).join('\n'):'고유 조작의 표면/확장 소유 매핑 미분류는 0이다. props/외부 라이브러리/브라우저/서버의 동작 경계는 계속 존재하며 미분류 0이 그 경계의 실행 검증을 뜻하지 않는다.';
md+='\n\n구문 분석 오류 '+m.parseErrors.length+'개, 캡처 중 변경 '+m.coverage.sourceChangesDuringCapture.length+'개. 현재 파일과의 차이는 `node docs/ux-paths-20261002/verify.cjs`의 sourceDrift로 별도 확인한다. 문서 생성 이후의 소스 수정·해시 변화는 원래 111개 등록 누락과 다른 문제다.\n';
fs.writeFileSync(path.join(OUT,'전체경로.md'),md);
fs.writeFileSync(path.join(OUT,'공통상태.md'),'# 공통 상태 42개·전이 32개\n\n기존 state-contracts.json의 실제 문장을 보존한다. Figma 바인딩 ID가 있어도 제품에서 전이 전체를 실행했다는 뜻은 아니다.\n\n'+m.commonStateContracts.map(x=>'## '+x.id+' · '+(x.name||x.label||x.title||'상태')+'\n\n```json\n'+JSON.stringify(x,null,2)+'\n```\n').join('\n')+'\n'+m.commonTransitions.map(x=>'## '+x.id+'\n\n```json\n'+JSON.stringify(x,null,2)+'\n```\n').join('\n'));
fs.writeFileSync(path.join(OUT,'action-ownership.json'),JSON.stringify([...actionOwners].map(([actionId,surfaceIds])=>({actionId,surfaceIds})),null,2));
// Figma is a summary/reference projection. Full UX conditions remain in the local documents/JSON.
const summaryItems=[{id:'CHECKSUM',title:'전체 UI 경우·경로 체크섬',kind:'원장 범위',body:[`111 원래 표면(41 경로·29 모달·41 보조면) + 확장 10개`,`고유 조작 ${s.actions.length} / 소유 연결 ${m.coverage.source.classifiedActions} / 미분류 ${m.unclassified.length}`,`14 과업 · 42 공통 상태 · 32 전이`,`표면 ID SHA-256 ${m.checksums.surfaceIds}`,`소스 SHA-256 ${m.checksums.sourceFiles}`,`조작 SHA-256 ${m.checksums.actionIds}`,`조건 → 이벤트 → 정상·중단·예외·finally → 복귀/재시도. 무한 입력은 반복 규칙이다. 원본 조작·저장 성공의 실행 검증 수가 아니다.`]},{id:'READING',title:'원장 읽는 법',kind:'경로·상태의 역할',body:['표면 카드는 실제 UI가 언제 조작을 제공하는지 설명한다. 고유 조작 원장은 각 action ID를 한 번 기록하여 중복 복제를 줄인다.','조작의 조건, 이벤트 원문, 핸들러 분기와 결과는 연결한 로컬 문서와 구조화 JSON에 있다. 조건을 생략한 일반 성공 흐름으로 대신하지 않는다.','A01–A10은 새 구현의 확장이다. 기존 111 표면의 등록 수와 분리한다. 화면 저장/컴포넌트 바인딩은 실제 사용자 조작/서버/기기 재접속 증거를 대신하지 않는다.']}];
const surfaceItems=all.map(p=>({id:p.id,title:p.name,kind:p.kind,source:p.source.map(x=>x.path+(x.export?'#'+x.export:'')).join('\n')||p.sourceFiles.join('\n'),body:[`진입: ${[p.path,...p.parents].filter(Boolean).join(' / ')||'실제 소스 호출자'}`,`복귀: ${p.originalReturn||'원래 호출자/소스 지정 경로'}`,...(p.cases||[]),`공통 상태: ${p.commonContractIds.join(', ')||'개별 소스 조건'}; 빈 값/오류/로딩 UI ${p.stateViews.length}; effect ${p.lifecycleEffects.length}`,`연결한 조작 ${p.actionBindings.length}개:`,...p.actionBindings.map(b=>{const a=actions.get(b.actionId);return `${a.id} · ${one(a.label)} → ${a.events.map(e=>e.name).join('/')||a.transitions[0].event} [${a.facets.join(', ')}]`; }),`전체 표시 조건·차단·각 정상/예외 결과: paths/${p.id}.md와 고유 조작 ID 문서를 따라간다.`]}));
const actionItems=s.actions.map(a=>({id:a.id,title:one(a.label),kind:a.kind,source:a.path+':'+a.line,body:[`표면: ${(actionOwners.get(a.id)||[]).join(', ')}`,`표시: ${guard(a.guards)}`,`차단: ${a.props.disabled?.source||'명시 없음'}; readOnly: ${a.props.readOnly?.source||'명시 없음'}`,`이벤트: ${a.events.map(e=>e.name+' → '+one(e.expression)).join('\n')||a.transitions[0].event}`,`링크: ${a.props.href?.source||a.props.to?.source||'없음'}`,`결과 핸들러: ${a.handlerTrace.map(id=>handlers.get(id)?.name).join(' → ')||'네이티브/전달 경계'}`,`반복: ${a.repetition.map(r=>r.kind+'('+one(r.collection||r.expression)+')').join('; ')||'직접 반복 없음'}`,`전체 결과·분기 원문: actions/${stem(a.path)}.md#${a.id.toLowerCase()} 및 source-actions.json. 저장/권한 성공을 추정하지 않는다.`]}));
const context=createContext(s,m),figmaOverview=summaryItems.map(item=>compactItem(item,context)),figmaSurfaces=surfaceItems.map(item=>compactItem(item,context)),figmaActions=actionItems.map(item=>compactItem(item,context));
const common={pageName:'20 전체 UX 경우·경로',runKey:'source-paths-20261002',displayMode:POLICY,checksum:m.checksums.sourceFiles,columnWidth:1120,columns:4,variableIds:{paper:'VariableID:7:96',ink:'VariableID:7:98',border:'VariableID:7:100',accent:'VariableID:7:105'}};
const builderChars=fs.readFileSync(path.join(OUT,'build-figma-paths.js'),'utf8').length;
const inputCharLimit=Math.min(42500,50000-builderChars-64);
if(inputCharLimit<1000)throw Error('Figma builder exceeds the safe code budget');
const inputSize=(group,items,offsetX)=>JSON.stringify({...common,group,offsetX,items}).length;
// Keep the previous Figma input set intact if any single card cannot fit a direct call.
for(const [group,items,offsetX] of [['overview',figmaOverview,0],['surfaces',figmaSurfaces,4800],['actions',figmaActions,9600]])for(const item of items)if(inputSize(group,[item],offsetX)>inputCharLimit)throw Error('Figma card needs explicit chunking before publishing: '+item.id);
for(const name of fs.readdirSync(path.join(OUT,'figma-inputs')))if(/^(overview|surfaces|actions)-\d+\.json$/.test(name))fs.unlinkSync(path.join(OUT,'figma-inputs',name));
function writeBatches(group,items,size,offsetX){const names=[];let batch=[],sequence=0;const save=()=>{if(!batch.length)return;const name=`${group}-${String(sequence++).padStart(3,'0')}.json`,input={...common,group,offsetX,items:batch};fs.writeFileSync(path.join(OUT,'figma-inputs',name),JSON.stringify(input));names.push(name);batch=[];};for(const item of items){const candidate=[...batch,item];if(batch.length&&(candidate.length>size||inputSize(group,candidate,offsetX)>inputCharLimit))save();batch.push(item);}save();return names;}
const inputs={schemaVersion:2,displayMode:POLICY,pageName:common.pageName,sourceChecksum:m.checksums.sourceFiles,fullSource:'source-actions.json',fullPathDocument:'전체경로.md',groups:{overview:writeBatches('overview',figmaOverview,10,0),surfaces:writeBatches('surfaces',figmaSurfaces,32,4800),actions:writeBatches('actions',figmaActions,80,9600)},counts:{surfaces:figmaSurfaces.length,actions:figmaActions.length},remoteExecuted:false};
fs.writeFileSync(path.join(OUT,'figma-inputs','index.json'),JSON.stringify(inputs,null,2));
