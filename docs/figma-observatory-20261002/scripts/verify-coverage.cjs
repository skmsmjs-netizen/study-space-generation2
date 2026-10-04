#!/usr/bin/env node
'use strict';
// Read-only, deterministic source/evidence reconciliation. Never writes evidence or calls Figma.
// node scripts/verify-coverage.cjs [--summary] [--strict]
// Default JSON may be redirected by the calling task to a separate report file.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const FILE_KEY = 'YHmD1PpWWfR9JGTEs77JsX';
const errors = [], pending = [], warnings = [], inputs = {};
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
const own = (o, k) => Object.prototype.hasOwnProperty.call(o || {}, k);
const unique = xs => [...new Set(xs)];
const nodeId = x => typeof x === 'string' && /^(?:\d+:\d+|I\d+:\d+(?:;\d+:\d+)*)$/.test(x);
const url = id => `https://www.figma.com/design/${FILE_KEY}${id ? '?node-id=' + encodeURIComponent(id.replace(/:/g, '-')) : ''}`;
function read(rel, required = false) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) { if (required) errors.push('필수 파일 없음: ' + rel); return null; }
  try { const bytes = fs.readFileSync(p); inputs[rel] = {bytes: bytes.length, sha256: sha(bytes)}; return JSON.parse(bytes); }
  catch (error) { errors.push('JSON 읽기 실패: ' + rel + ': ' + error.message); return null; }
}
function checksum(ids, expected, label) {
  const duplicates = unique(ids.filter((id, i) => ids.indexOf(id) !== i));
  if (duplicates.length) errors.push(label + ' 중복 ID: ' + duplicates.join(', '));
  if (expected !== undefined && ids.length !== expected) errors.push(label + ' 예상 ' + expected + ', 실제 ' + ids.length);
  return {expectedCount: expected ?? ids.length, actualCount: ids.length, uniqueCount: unique(ids).length, orderedIds: ids, orderedIdsSha256: sha(JSON.stringify(ids)), duplicates};
}
function diff(expected, actual) {
  const set = new Set(actual); return {planned: expected.length, mapped: expected.filter(id => set.has(id)).length, missing: expected.filter(id => !set.has(id)), unexpected: unique(actual.filter(id => !expected.includes(id)))};
}
function refs(value) {
  if (nodeId(value)) return [value];
  if (Array.isArray(value)) return unique(value.flatMap(refs));
  if (!value || typeof value !== 'object') return [];
  return unique(['id','nodeId','ownerId','defaultComponentId','nodeIds','figmaNodeIds','frameId','panelId'].flatMap(k => own(value,k) ? refs(value[k]) : []));
}
const inventory = read('screen-inventory.json', true) || {};
const design = read('design-foundations.json', true) || {};
const research = read('research-mapping.json', true) || {};
const states = read('state-contracts.json', true) || {};
const work = read('figma-state.json', true) || {};
const manifest = read('prepared-screens/manifest.json');
const normalized = read('prepared-screens/normalized-screens.json');
if (work.fileKey && work.fileKey !== FILE_KEY) errors.push('Figma 파일 키 변경: 고정 대상과 다름');
const entities = [...(inventory.routes || []), ...(inventory.overlays || []), ...(inventory.surfaces || [])];
const entityIds = entities.map(e => e.id), blockIds = entities.flatMap(e => (e.blocks || []).map(b => b.id));
const componentIds = (design.componentRegistry || []).map(e => e.id), sourceIds = (research.entries || []).map(e => e.source_id);
const domainIds = (research.domains || []).map(e => e.id), stateIds = (states.states || []).map(e => e.id);
const transitionIds = (states.transitions || []).map((t, i) => 'T' + String(i+1).padStart(2,'0'));
const checksums = {
  algorithm:'SHA-256 over UTF-8 JSON.stringify(orderedIds); no sorting of input ID order',
  inventory: checksum(entityIds,111,'화면 엔터티'),
  routes: checksum((inventory.routes || []).map(e=>e.id),41,'경로'),
  overlays: checksum((inventory.overlays || []).map(e=>e.id),29,'모달'),
  surfaces: checksum((inventory.surfaces || []).map(e=>e.id),41,'보조면'),
  declaredBlocks: checksum(blockIds,undefined,'내용 블록'),
  components: checksum(componentIds,48,'공통 부품'),
  research: checksum(sourceIds,121,'연구 출처'),
  domains: checksum(domainIds,20,'연구 영역'),
  states: checksum(stateIds,42,'상태 계약'),
  transitions: checksum(transitionIds,32,'상태 전이'),
  modules: checksum((inventory.moduleCoverage || []).map(m=>m.id),104,'생산 TSX 모듈'),
};
const evidence = {};
const evidenceDir = path.join(root,'evidence');
for (const name of (fs.existsSync(evidenceDir) ? fs.readdirSync(evidenceDir) : []).sort()) {
  if (!name.endsWith('.json') || name.endsWith('.envelope.json')) continue;
  const d = read('evidence/'+name); if(d)evidence[name]=d;
}
const knownNodes = new Set();
function collectKnown(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const [key,value] of Object.entries(obj)) {
    if (['createdNodeIds','mutatedNodeIds','allNodeIds','affectedIds'].includes(key) && Array.isArray(value)) { for(const id of value)if(nodeId(id))knownNodes.add(id); }
    else if (key==='components' && Array.isArray(value)) for(const c of value){if(nodeId(c.id))knownNodes.add(c.id);for(const v of c.variants || [])if(nodeId(v.id))knownNodes.add(v.id);}
    if (value && typeof value==='object') collectKnown(value);
  }
}
for(const d of Object.values(evidence))collectKnown(d);
const foundation = evidence['foundations.json'];
const pageNodes = foundation?.pages || {};
for(const id of Object.values(pageNodes))if(nodeId(id))knownNodes.add(id);
const components={}, sources={}, domains={}, stateNodes={}, previews={}, screenNodes={}, blocks={}, controlRecords=[], screenLinked=[];
const provenance={components:{},sources:{},domains:{},states:{},screens:{},blocks:{}};
function merge(map,key,value,file,type) {
  if (!value) return;
  if (own(map,key) && JSON.stringify(map[key])!==JSON.stringify(value)) warnings.push(`${type} ${key}: 후속 근거 ${file} 사용`);
  map[key]=type==='components' ? {...(map[key] || {}),...value} : value; if(provenance[type])provenance[type][key]=file;
}
for(const [file,d] of Object.entries(evidence)) {
  if(/^components-(?:\d+|review|recovery|recover|final)(?:[.-].*)?\.json$/.test(file) && !/attempt|envelope/.test(file)) {
    for(const c of Object.values(d.registryMap || {})) if(c.id) merge(components,c.id,c,file,'components');
  }
  if(/^research-[dfqs]\.json$/.test(file)) {
    for(const [id,n] of Object.entries(d.sourceNodes || {}))merge(sources,id,n,file,'sources');
    for(const [id,n] of Object.entries(d.domainNodes || {}))merge(domains,id,n,file,'domains');
  }
  if(file==='states.json') {
    for(const [id,n] of Object.entries(d.stateNodes || {}))merge(stateNodes,id,n,file,'states');
    Object.assign(previews,d.previewNodes || {});
  }
  if((/^screens-.+\.json$/.test(file) && d.screens) || file==='material-memo.json') {
    for(const [key,n] of Object.entries(d.screens || {}))merge(screenNodes,key,n,file,'screens');
    function leaves(value){if(nodeId(value))return[value];if(Array.isArray(value))return value.flatMap(leaves);if(value&&typeof value==='object')return Object.values(value).flatMap(leaves);return[];}
    function ingest(value,key=''){
      if(/^[ROU]\d{2}-B\d{2}(?:@.*)?$/.test(key)){const id=key.split('@')[0];blocks[id]=unique([...(blocks[id] || []),...leaves(value)]);provenance.blocks[id]=file;return;}
      if(Array.isArray(value)){for(const b of value)ingest(b,b?.blockId || b?.sourceBlockId || b?.key || '');}
      else if(value&&typeof value==='object')for(const [k,v]of Object.entries(value))ingest(v,k);
    }
    ingest(d.blockMap || {});
    for(const c of d.controlMap || [])controlRecords.push({...c,evidenceFile:file});
    for(const l of d.linked || [])screenLinked.push(l);
  }
}
function validateNodeMap(map,label) { for(const [id,n] of Object.entries(map)){if(!nodeId(n))errors.push(`${label} ${id}: 잘못된 노드 ID`);} }
validateNodeMap(sources,'출처');validateNodeMap(domains,'영역');validateNodeMap(stateNodes,'상태');
for(const c of Object.values(components)) {
  if(!c.ownerType && nodeId(c.ownerId) && nodeId(c.defaultComponentId) && c.variants?.length && c.variantIds?.includes(c.defaultComponentId)) {
    c.ownerType=c.ownerId===c.defaultComponentId?'COMPONENT':'COMPONENT_SET';
    c.ownerTypeEvidence='inferred-from-native-variant-readback';
  } else if(c.ownerType) c.ownerTypeEvidence='explicit-owner-type';
}
const componentCoverage=diff(componentIds,Object.keys(components));
componentCoverage.native=componentIds.filter(id=>components[id] && ['COMPONENT','COMPONENT_SET'].includes(components[id].ownerType) && nodeId(components[id].ownerId) && nodeId(components[id].defaultComponentId)).length;
componentCoverage.invalidNative=componentIds.filter(id=>components[id] && (!['COMPONENT','COMPONENT_SET'].includes(components[id].ownerType)||!nodeId(components[id].ownerId)||!nodeId(components[id].defaultComponentId)));
for(const id of componentCoverage.invalidNative)errors.push('부품의 네이티브 노드 근거 오류: '+id);
componentCoverage.ownerIdsWithIndependentNodeLedger=componentIds.filter(id=>components[id]&&knownNodes.has(components[id].ownerId)).length;
componentCoverage.rows=(design.componentRegistry || []).map(c=>({id:c.id,name:c.name,nodeId:components[c.id]?.ownerId || null,defaultComponentId:components[c.id]?.defaultComponentId || null,ownerType:components[c.id]?.ownerType || null,ownerTypeEvidence:components[c.id]?.ownerTypeEvidence || null,variantCount:components[c.id]?.variantIds?.length || 0,evidence:provenance.components[c.id] || null,url:components[c.id]?url(components[c.id].ownerId):null}));
const sourceCoverage=diff(sourceIds,Object.keys(sources)), domainCoverage=diff(domainIds,Object.keys(domains));
domainCoverage.rows=(research.domains || []).map(d=>({id:d.id,title:d.title,nodeId:domains[d.id] || null,url:domains[d.id]?url(domains[d.id]):null,evidence:provenance.domains[d.id] || null}));
sourceCoverage.statusCounts=(research.entries || []).reduce((o,e)=>(o[e.source_status]=(o[e.source_status]||0)+1,o),{});
if(sourceCoverage.statusCounts['조건부']!==43)errors.push('조건부 출처 43개 보존 확인 실패');
sourceCoverage.rows=(research.entries || []).map(e=>({id:e.source_id,name:e.name,status:e.source_status,nodeId:sources[e.source_id] || null,url:sources[e.source_id]?url(sources[e.source_id]):null,evidence:provenance.sources[e.source_id] || null}));
const expectedSourceDomain=(research.entries || []).flatMap(e=>(e.domain_ids || []).map(d=>e.source_id+'→'+d));
const actualSourceDomain=Object.entries(evidence).filter(([f])=>/^research-[dfqs]\.json$/.test(f)).flatMap(([file,d])=>(d.sourceDomainLinks || []).filter(l=>l.targetNodeId===domains[l.domainId] && nodeId(l.linkNodeId)).map(l=>l.sourceId+'→'+l.domainId));
sourceCoverage.domainLinks=diff(expectedSourceDomain,unique(actualSourceDomain));
const stateCoverage=diff(stateIds,Object.keys(stateNodes));
stateCoverage.previewMapped=stateIds.filter(id=>nodeId(previews[id])).length;
stateCoverage.nodesPresentInRecoveredLedger=stateIds.filter(id=>knownNodes.has(stateNodes[id])).length;
stateCoverage.rows=(states.states || []).map(s=>({id:s.id,title:s.title,nodeId:stateNodes[s.id] || null,previewNodeId:previews[s.id] || null,url:stateNodes[s.id]?url(stateNodes[s.id]):null}));
const transitionRecords=evidence['states.json']?.transitionNodes || [];
const transitionCoverage=diff(transitionIds,transitionRecords.map(t=>t.id));
transitionCoverage.connected=transitionRecords.filter(t=>t.prototypeConnected===true).length;
transitionCoverage.failures=evidence['states.json']?.prototypeFailures || [];
transitionCoverage.rows=transitionRecords.map(t=>({...t,url:nodeId(t.triggerNodeId)?url(t.triggerNodeId):null,destinationUrl:nodeId(t.destinationNodeId)?url(t.destinationNodeId):null}));
transitionCoverage.invalid=[];
for(let i=0;i<(states.transitions || []).length;i++){
 const expected=states.transitions[i],id=transitionIds[i],actual=transitionRecords.find(t=>t.id===id);
 if(actual&&(actual.from!==expected.from||actual.to!==expected.to||actual.destinationNodeId!==stateNodes[expected.to]))transitionCoverage.invalid.push(id);
}
if(transitionCoverage.invalid.length)errors.push('전이 출발·도착 불일치: '+transitionCoverage.invalid.join(', '));
const entityFrames={};
for(const [key,value] of Object.entries(screenNodes)){const id=value.routeId || value.inventoryId || key.split('@')[0];if(!nodeId(value.id || value.nodeId)){errors.push('화면 프레임 ID 오류: '+key);continue;}(entityFrames[id] ||= []).push({key,nodeId:value.id || value.nodeId,profile:value.profile || key.split('@')[1] || null,url:url(value.id || value.nodeId),evidence:provenance.screens[key]});}
const linkedSurfaces=manifest?.coverageLinks || normalized?.coverageLinks || [];
function resolveEntity(id,seen=new Set()) {
 if(seen.has(id))return [];seen.add(id);
 if(blocks[id]?.length)return blocks[id];
 if(entityFrames[id]?.length)return entityFrames[id].map(x=>x.nodeId);
 const linked=linkedSurfaces.find(x=>x.inventoryId===id);if(!linked)return [];
 const resolved=(linked.links || []).map(l=>{
  if(l.target)return resolveEntity(l.target,new Set(seen));
  if(l.pageId===pageNodes.components && componentCoverage.native===48)return [l.pageId];
  return [];
 });
 return resolved.length && resolved.every(x=>x.length) ? unique(resolved.flat()) : [];
}
const representedEntities=entityIds.filter(id=>resolveEntity(id).length);
const screenCoverage=diff(entityIds,representedEntities);
screenCoverage.directEntities=Object.keys(entityFrames).length;
screenCoverage.reusedEntities=representedEntities.filter(id=>!entityFrames[id]).length;
screenCoverage.frames=Object.keys(screenNodes).length;
screenCoverage.supplementalStateReferences=Object.entries(evidence['material-memo.json']?.expandedStateNodes || {}).map(([profile,n])=>({...n,profile,url:nodeId(n.id)?url(n.id):null,evidence:'material-memo.json'}));
for(const n of screenCoverage.supplementalStateReferences)if(n.countsAsViewport!==false || !nodeId(n.id))errors.push('별도 펼침 상태의 화면 집계 경계 오류: '+n.id);
screenCoverage.expectedAuthoredFrames=manifest?.counts?.expectedFrames ?? null;
screenCoverage.sourceStatePlanFrames=(inventory.statePlan || []).reduce((n,s)=>n+(s.plannedFrames || []).length,0);
screenCoverage.frameScopeNote='소스 statePlan의 기본/좁은 상태 계획과 제작 manifest의 다섯 기기 프로필 프레임 수는 서로 다른 범위다.';
const expectedFrames=[];
if(normalized?.screens && manifest?.profiles)for(const s of normalized.screens)for(const p of s.primary?manifest.profiles:[manifest.profiles[0]])expectedFrames.push(s.id+'@'+p.key);
screenCoverage.frameCoverage=expectedFrames.length?diff(expectedFrames,Object.keys(screenNodes)):null;
screenCoverage.rows=entities.map(e=>({id:e.id,title:e.name,kind:e.kind,source:e.source || e.sources || null,representation:entityFrames[e.id]?'direct':resolveEntity(e.id).length?'explicit-reuse':'not-yet-evidenced',frames:entityFrames[e.id] || [],reusedNodeIds:entityFrames[e.id]?[]:resolveEntity(e.id),links:entityFrames[e.id] ? entityFrames[e.id].map(x=>x.url) : resolveEntity(e.id).map(url)}));
const directExpectedBlocks=(normalized?.screens || []).flatMap(s=>(s.blocks || []).map(b=>b.id));
screenCoverage.blocks={declaredInventoryBlocks:blockIds.length,expectedDirectBlocks:directExpectedBlocks.length || null,actualDirectBlockIds:Object.keys(blocks).length,coverage:directExpectedBlocks.length?diff(directExpectedBlocks,Object.keys(blocks)):null,scope:'명시적 재사용 표면의 연결과 직접 만든 블록의 실제 노드 매핑을 구별한다.'};
screenCoverage.controls={recorded:controlRecords.length,linkedTransitions:screenLinked.length,scope:'controlMap은 증거에 기록된 조작만 센다. 클릭·키보드·실제 저장 시험의 완료 근거가 아니다.'};
screenCoverage.semanticBatches={planned:manifest?.batches?.length || null,observed:Object.keys(evidence).filter(f=>/^screens-.+\.json$/.test(f)&&evidence[f].screens).length};
const flowCoverage={planned:(inventory.flows || []).length,verifiedByThisScript:0,scope:'14개 사용 과업은 개별 상태 전이 32개와 다르다. 이 읽기 전용 검사만으로 실제 과업 시연을 통과 처리하지 않는다.'};
const allChecks=[['화면',screenCoverage],['부품',componentCoverage],['출처',sourceCoverage],['영역',domainCoverage],['상태',stateCoverage],['전이',transitionCoverage]];
for(const [label,c]of allChecks){if(c.missing.length)pending.push(label+' 미대응 '+c.missing.length+'개');if(c.unexpected.length)errors.push(label+' 범위 밖 ID: '+c.unexpected.join(', '));}
if(sourceCoverage.domainLinks.missing.length)pending.push('출처→영역 링크 미대응 '+sourceCoverage.domainLinks.missing.length+'개');
if(transitionCoverage.connected!==32)pending.push('상태 프로토타입 연결 '+transitionCoverage.connected+'/32');
if(!manifest)pending.push('prepared-screens/manifest.json 미생성');
if(screenCoverage.frameCoverage?.missing.length)pending.push('기기별 화면 프레임 미대응 '+screenCoverage.frameCoverage.missing.length+'개');
if(screenCoverage.blocks.coverage?.missing.length)pending.push('직접 내용 블록 노드 미대응 '+screenCoverage.blocks.coverage.missing.length+'개');
const unmappedModules=(inventory.moduleCoverage || []).filter(m=>m.reachableFromMain && !m.inventoryRefs?.length).map(m=>m.path);
if(unmappedModules.length)errors.push('호출 가능한 모듈 미대응: '+unmappedModules.join(', '));
const snapshots={recordedModuleCount:(inventory.moduleCoverage || []).length,reachable:(inventory.moduleCoverage || []).filter(m=>m.reachableFromMain).length,unreachable:(inventory.moduleCoverage || []).filter(m=>!m.reachableFromMain).map(m=>m.path),reachableUnmapped:unmappedModules,sourceLabelCount:(inventory.moduleCoverage || []).reduce((n,m)=>n+(m.literalUiLabels || []).length,0),liveSourceHashesCompared:false};
const report={schemaVersion:1,scope:'stored source inventory and actual Figma evidence reconciliation',fileKey:FILE_KEY,fileUrl:url(),status:errors.length?'integrity-error':pending.length?'partial-evidence':'all-registered-mappings-evidenced',integrityPassed:errors.length===0,allRegisteredMappingsEvidenced:errors.length===0&&pending.length===0,checksums,coverage:{screens:screenCoverage,components:componentCoverage,research:sourceCoverage,domains:domainCoverage,states:stateCoverage,transitions:transitionCoverage,flows:flowCoverage},snapshots,evidence:{files:Object.keys(evidence),knownNodeCount:knownNodes.size,basis:'저장된 실제 Figma 도구 반환값. 이 명령은 Figma에 접속하거나 노드·화면을 새로 읽지 않는다.',activeAccess:work.access || null,historicalAccessFile:'evidence/access.json은 초기 Starter/View 차단 기록이며 현재 접근 상태로 재사용하지 않는다.'},inputs,errors,pending,warnings:unique(warnings),runtimeBoundary:{appCodeChangedByThisCheck:false,liveFigmaRead:false,runtimeTestsRun:false,physicalDeviceVerified:false,serverAuthorizationVerified:false,saveRestoreSyncVerified:false,learningEffectVerified:false,statement:'계획·원격 생성 근거·설계 프로토타입·실제 웹앱 구현 및 시험은 별도 단계다.'}};
if(process.argv.includes('--summary')){
 console.log('Figma 대응 검사: '+report.status+'\n'+report.fileUrl);
 for(const [label,c]of allChecks)console.log(label+': '+c.mapped+'/'+c.planned);
 console.log('실제 화면 프레임: '+screenCoverage.frames+'/'+(screenCoverage.expectedAuthoredFrames ?? '제작 계획 대기'));
 console.log('별도 펼침 상태 참조: '+screenCoverage.supplementalStateReferences.length+'개 (화면 프레임 수에 미포함)');
 console.log('네이티브 부품: '+componentCoverage.native+'/48; 상태 전이: '+transitionCoverage.connected+'/32');
 for(const e of errors)console.log('오류: '+e);for(const p of pending)console.log('남음: '+p);
 console.log(report.runtimeBoundary.statement);
}else console.log(JSON.stringify(report,null,2));
if(errors.length)process.exitCode=1;else if(process.argv.includes('--strict')&&pending.length)process.exitCode=2;
