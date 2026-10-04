#!/usr/bin/env node
'use strict';
// Creates only assets/index-input-bound.json when the root task executes it.
// Reads the original index input and stored remote evidence. No Figma call and no evidence mutation.
// Usage: node scripts/prepare-index-bindings.cjs [--check] [--strict]
// --check: stdout summary only. --strict: do not write if any required binding is missing.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const inputName = 'assets/index-input.json';
const outputName = 'assets/index-input-bound.json';
const fileKey = 'YHmD1PpWWfR9JGTEs77JsX';
const hashes = {}, warnings = [], errors = [];
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const isNodeId = id => typeof id === 'string' && /^(?:\d+:\d+|I\d+:\d+(?:;\d+:\d+)*)$/.test(id);
const unique = values => [...new Set(values)];
function read(name, required = false) {
  const absolute = path.resolve(root, name);
  if (!absolute.startsWith(root + path.sep)) throw Error('Read outside task folder');
  if (!fs.existsSync(absolute)) { if (required) errors.push('Missing required input: ' + name); return null; }
  try { const bytes = fs.readFileSync(absolute); hashes[name] = sha(bytes); return JSON.parse(bytes); }
  catch (error) { errors.push('Cannot read JSON ' + name + ': ' + error.message); return null; }
}
const input = read(inputName, true);
const manifest = read('prepared-screens/manifest.json');
const normalized = read('prepared-screens/normalized-screens.json');
const foundations = read('evidence/foundations.json');
const review = read('evidence/components-review.json');
const contracts = read('state-contracts.json', true);
const states = read('evidence/states.json');
const recoveredStates = read('evidence/states-nodes.json');
const finalResearch = read('evidence/research-s.json');
if (!input || input.fileKey !== fileKey) errors.push('Index input must target the authorized Figma file');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
const expectedGroups = {routes:41,modals:29,surfaces:41,components:48,sources:121,states:42,transitions:32};
if ((input.groups || []).length !== 7) errors.push('Exactly seven index groups are required');
for (const [key,expected] of Object.entries(expectedGroups)) {
  const g = input.groups.find(g => g.key === key);
  if (!g || g.expected !== expected || g.items?.length !== expected || new Set(g.items.map(x=>x.id)).size !== expected) errors.push('Index count/identity mismatch: ' + key);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
const groupIds = Object.fromEntries(input.groups.map(g=>[g.key,g.items.map(x=>x.id)]));
const coverageNodes = Object.fromEntries(input.groups.map(g=>[g.key,Object.fromEntries(g.items.map(x=>[x.id,null]))]));
const details = Object.fromEntries(input.groups.map(g=>[g.key,{}]));
const screenFrames = {}, blockNodes = {}, nodeEvidence = {};
const evidenceDir = path.join(root,'evidence');
const evidenceNames = fs.existsSync(evidenceDir) ? fs.readdirSync(evidenceDir).sort() : [];
const expectedBatchNames = manifest?.batches?.map(b=>'screens-'+b.id+'.json') || [];
const candidates = unique([...expectedBatchNames,...evidenceNames.filter(name=>/^screens-.+\.json$/.test(name)&&!name.endsWith('.envelope.json'))]).sort();
const actualScreenEvidence = [];
function leaves(value) {
  if (isNodeId(value)) return [value];
  if (Array.isArray(value)) return value.flatMap(leaves);
  if (value && typeof value==='object') return Object.values(value).flatMap(leaves);
  return [];
}
function ingestBlocks(value,file,key='') {
  if (/^[ROU]\d{2}-B\d{2}(?:@.*)?$/.test(key)) {
    const id=key.split('@')[0], ids=unique(leaves(value));
    if(ids.length) {
      blockNodes[id]=unique([...(blockNodes[id] || []),...ids]);
      for(const n of ids)(nodeEvidence[n] ||= []).push(file);
    }
    return;
  }
  if(Array.isArray(value))for(const b of value)ingestBlocks(b,file,b?.blockId || b?.sourceBlockId || b?.key || '');
  else if(value && typeof value==='object')for(const [k,v]of Object.entries(value))ingestBlocks(v,file,k);
}
const profileOrder = new Map((manifest?.profiles || [{key:'ipad-landscape'}]).map((p,i)=>[p.key,i]));
for(const name of candidates) {
  const rel='evidence/'+name, data=read(rel); if(!data?.screens)continue;
  actualScreenEvidence.push(rel);
  for(const [key,frame]of Object.entries(data.screens)) {
    const sourceId=frame.routeId || frame.inventoryId || key.split('@')[0];
    const nodeId=frame.id || frame.nodeId;
    if(!isNodeId(nodeId)){warnings.push('Ignored invalid screen node '+key+' in '+name);continue;}
    (screenFrames[sourceId] ||= []).push({nodeId,profile:frame.profile || key.split('@')[1] || '',key,evidence:rel});
    (nodeEvidence[nodeId] ||= []).push(rel);
  }
  ingestBlocks(data.blockMap || {},rel);
}
for(const frames of Object.values(screenFrames))frames.sort((a,b)=>(profileOrder.get(a.profile) ?? 99)-(profileOrder.get(b.profile) ?? 99)||a.key.localeCompare(b.key));
const registry = {};
// Review is authoritative. Batch/recovery maps only fill entries absent from the review.
for(const name of evidenceNames.filter(n=>/^components-(?:\d+|recovery)\.json$/.test(n))) {
  const data=read('evidence/'+name);
  for(const c of Object.values(data?.registryMap || {}))if(c.id && !registry[c.id])registry[c.id]={...c,evidence:'evidence/'+name};
}
for(const c of Object.values(review?.registryMap || {}))if(c.id)registry[c.id]={...(registry[c.id] || {}),...c,evidence:'evidence/components-review.json'};
const mappedComponentIds = groupIds.components.filter(id=>isNodeId(registry[id]?.ownerId));
const reuse = manifest?.coverageLinks || normalized?.coverageLinks || [];
const componentPage = foundations?.pages?.components;
const actualPages = new Set(Object.values(foundations?.pages || {}).filter(isNodeId));
function resolveEntity(id,chain=[]) {
  if(chain.includes(id))return{ids:[],kind:'unresolved',missing:['cycle: '+[...chain,id].join(' → ')]};
  if(blockNodes[id]?.length)return{ids:blockNodes[id],kind:'block',missing:[]};
  if(screenFrames[id]?.length)return{ids:unique(screenFrames[id].map(f=>f.nodeId)),kind:'screen',missing:[]};
  const descriptor=reuse.find(item=>item.inventoryId===id);
  if(!descriptor)return{ids:[],kind:'unresolved',missing:[id]};
  const results=(descriptor.links || []).map(link=>{
    if(link.target)return resolveEntity(link.target,[...chain,id]);
    if(link.pageId===componentPage && actualPages.has(link.pageId))return mappedComponentIds.length===48?{ids:[link.pageId],kind:'complete-component-registry-page',missing:[]}:{ids:[],kind:'unresolved',missing:['components: '+mappedComponentIds.length+'/48']};
    return{ids:[],kind:'unresolved',missing:[link.pageId?'page scope not established: '+link.pageId:'missing explicit target']};
  });
  // A multi-target reuse contract is represented only when every required target resolves.
  const complete=results.length>0 && results.every(result=>result.ids.length>0);
  return{ids:complete?unique(results.flatMap(r=>r.ids)):[],kind:'explicit-reuse',missing:results.flatMap(r=>r.missing),targets:(descriptor.links || []).map(l=>l.target || l.pageId)};
}
for(const group of ['routes','modals','surfaces'])for(const id of groupIds[group]) {
  const result=resolveEntity(id);
  coverageNodes[group][id]=result.ids.length?result.ids:null;
  details[group][id]={representation:result.kind,requiredTargets:result.targets || [],missingDependencies:result.missing,evidence:unique(result.ids.flatMap(n=>nodeEvidence[n] || (actualPages.has(n)?['evidence/foundations.json','evidence/components-review.json']:[])))};
}
for(const id of groupIds.components) {
  const c=registry[id];coverageNodes.components[id]=isNodeId(c?.ownerId)?c.ownerId:null;
  details.components[id]={evidence:c?.evidence || null,defaultComponentId:isNodeId(c?.defaultComponentId)?c.defaultComponentId:null,variantCount:c?.variantIds?.length || 0};
}
const sourceMap={},sourceEvidence={};
for(const prefix of ['d','f','q','s']) {
  const name='evidence/research-'+prefix+'.json',data=prefix==='s'?finalResearch:read(name);
  for(const [id,n]of Object.entries(data?.sourceNodes || {}))if(isNodeId(n)){sourceMap[id]=n;sourceEvidence[id]=name;}
}
for(const [id,n]of Object.entries(finalResearch?.allSourceNodes || {}))if(isNodeId(n)){sourceMap[id]=n;sourceEvidence[id]='evidence/research-s.json';}
for(const id of groupIds.sources){coverageNodes.sources[id]=sourceMap[id] || null;details.sources[id]={evidence:sourceEvidence[id] || null};}
const stateLedger=recoveredStates?.allNodeIds ? new Set(recoveredStates.allNodeIds) : null;
if(!stateLedger)warnings.push('states-nodes.json ledger absent; state IDs remain evidence references until build-index performs live existence checks');
for(const id of groupIds.states) {
  const n=states?.stateNodes?.[id], inLedger=stateLedger?stateLedger.has(n):null;
  coverageNodes.states[id]=isNodeId(n)&&inLedger!==false?n:null;
  details.states[id]={evidence:n?'evidence/states.json':null,recoveredLedgerConfirmed:inLedger,missingReason:isNodeId(n)&&inLedger===false?'ID absent from recovered state ledger':null};
}
for(const item of input.groups.find(g=>g.key==='transitions').items) {
  const sourceIndex=item.sourceIndex ?? Number(item.id.slice(1))-1;
  const expected=contracts.transitions?.[sourceIndex],actual=states?.transitionNodes?.find(t=>t.id===item.id);
  const consistent=!!expected && !!actual && expected.from===actual.from && expected.to===actual.to && actual.destinationNodeId===states.stateNodes?.[expected.to];
  const n=actual?.triggerNodeId,inLedger=stateLedger?stateLedger.has(n):null;
  coverageNodes.transitions[item.id]=consistent && isNodeId(n) && inLedger!==false?n:null;
  details.transitions[item.id]={evidence:actual?'evidence/states.json':null,from:expected?.from || null,to:expected?.to || null,prototypeConnected:actual?.prototypeConnected===true,recoveredLedgerConfirmed:inLedger,contractMatches:consistent,missingReason:!actual?'transition evidence absent':!consistent?'source/destination contract mismatch':!isNodeId(n)?'trigger node ID absent':inLedger===false?'trigger ID absent from recovered state ledger':null};
}
const counts={};
for(const g of input.groups) {
  const missing=g.items.filter(item=>!coverageNodes[g.key][item.id]).map(item=>item.id);
  counts[g.key]={expected:g.expected,bound:g.expected-missing.length,missing,orderedIdsSha256:sha(JSON.stringify(g.items.map(item=>item.id))),orderedIdsHashEncoding:'SHA-256 / UTF-8 JSON.stringify(ordered ID array)',sourceDeclaredIdsSha256:g.idsSha256};
}
if(errors.length){console.error(JSON.stringify({status:'integrity-error',writes:false,errors},null,2));process.exit(1);}
const missingCount=Object.values(counts).reduce((n,c)=>n+c.missing.length,0);
const bound={...input,coverageNodes,bindingEvidence:{schemaVersion:1,status:missingCount?'partial-actual-node-bindings':'all-requested-node-bindings-prepared',sourceInput:inputName,sourceInputSha256:hashes[inputName],output:outputName,counts,details,sourceFileSha256:hashes,screenEvidenceFiles:actualScreenEvidence,expectedScreenBatches:expectedBatchNames.length || null,observedScreenBatches:actualScreenEvidence.length,warnings:unique(warnings),remoteReadPerformed:false,evidencePolicy:'Stored actual Figma maps only. build-index.js re-reads every supplied node before counting existence. A binding does not prove runtime, design quality, or server behavior.'}};
const summary={status:bound.bindingEvidence.status,input:inputName,output:outputName,writes:!process.argv.includes('--check') && !(process.argv.includes('--strict')&&missingCount),counts,missingCount,screenBatches:bound.bindingEvidence.observedScreenBatches,expectedScreenBatches:bound.bindingEvidence.expectedScreenBatches,prototypeConnected:(states?.transitionNodes || []).filter(t=>t.prototypeConnected).length,warnings:unique(warnings)};
if(!process.argv.includes('--check') && !(process.argv.includes('--strict')&&missingCount)) {
  fs.writeFileSync(path.join(root,outputName),JSON.stringify(bound,null,2)+'\n');
}
console.log(JSON.stringify(summary,null,2));
if(process.argv.includes('--strict')&&missingCount)process.exitCode=2;
