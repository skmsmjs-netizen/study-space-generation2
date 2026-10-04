#!/usr/bin/env node
/* Read-only documentation-integrity check. Does not build/test/run the product or write evidence. */
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const OUT=__dirname,ROOT=path.resolve(OUT,'../..'),read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(path.join(OUT,p))),sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const m=json('manifest.json'),s=json('source-actions.json'),ownership=json('action-ownership.json'),f=json('figma-inputs/index.json');
const i=JSON.parse(read(path.join(ROOT,'docs/figma-observatory-20261002/screen-inventory.json')));
const errors=[],warnings=[],check=(ok,issue)=>{if(!ok)errors.push(issue);};
const original=[...i.routes,...i.overlays,...i.surfaces],all=[...m.paths,...m.extensionPaths],actions=new Map(s.actions.map(x=>[x.id,x])),handlers=new Map(s.handlers.map(x=>[x.id,x])),branches=new Map(s.branches.map(x=>[x.id,x]));
check(i.routes.length===41&&i.overlays.length===29&&i.surfaces.length===41,'Original surface checksum counts differ from 41/29/41');
check(m.paths.length===111&&new Set(m.paths.map(x=>x.id)).size===111,'111 original surface IDs must be unique');
check(original.every(x=>m.paths.some(p=>p.id===x.id)),'Original surface ID omitted');
check(m.extensionPaths.length===10&&m.extensionPaths.every(p=>/^A\d\d$/.test(p.id)),'10 extensions missing');
check(m.flows.length===14&&m.commonStateContracts.length===42&&m.commonTransitions.length===32,'Original flows/states/transitions cardinality changed');
check(new Set(s.actions.map(a=>a.id)).size===s.actions.length,'Duplicate action IDs');
check(new Set(s.handlers.map(a=>a.id)).size===s.handlers.length,'Duplicate handler IDs');
check(sha(original.map(x=>x.id).join('\n'))===m.checksums.surfaceIds,'Surface ID digest mismatch');
check(sha(m.files.map(x=>x.path+':'+x.sha256).join('\n'))===m.checksums.sourceFiles,'Source manifest digest mismatch');
check(sha(s.actions.map(x=>x.id).join('\n'))===m.checksums.actionIds,'Action ID digest mismatch');
check(s.sourceFilesChecksum===m.checksums.sourceFiles,'Two artifacts have different source snapshots');
const mapped=new Set();let pathCount=0;
for(const p of all){check(fs.existsSync(path.join(OUT,'paths',p.id+'.md')),'Missing human-readable path '+p.id);check(p.runtimeVerified===false,'Static path elevated to runtime proof '+p.id);for(const b of p.actionBindings){check(actions.has(b.actionId),'Unknown action binding '+b.actionId);mapped.add(b.actionId);}for(const e of p.paths){pathCount++;const a=actions.get(e.viaAction);check(!!a&&a.transitions[e.transitionIndex]?.event===e.event,'Invalid event transition '+e.id);const match=e.conditionAndOutcomeRef.match(/#\/actions\/(\d+)\/transitions\/(\d+)$/);check(!!match&&s.actions[Number(match[1])]?.id===e.viaAction,'Invalid JSON reference '+e.id);}for(const c of p.entry.sourceContexts)check(handlers.has(c.handlerId),'Unknown source context '+c.handlerId);}
for(const a of s.actions){for(const t of a.transitions){for(const id of t.handlerIds)check(handlers.has(id),'Unknown handler '+id);for(const id of t.branchIds)check(branches.has(id),'Unknown branch '+id);}if(a.formOwner)check(actions.has(a.formOwner),'Unknown form owner '+a.formOwner);}
const pending=new Set(m.unclassified.map(x=>x.id));check([...actions.keys()].every(id=>mapped.has(id)||pending.has(id)),'An action is neither classified nor explicitly unclassified');check([...pending].every(id=>!mapped.has(id)),'A classified action also appears unclassified');check(mapped.size===m.coverage.source.classifiedActions,'Mapped action count mismatch');check(pathCount===m.coverage.paths,'Path transition count mismatch');check(s.parseErrors.length===0,'AST parser errors remain');check(ownership.length===mapped.size,'Ownership mapping count mismatch');
const sourceDrift=m.files.flatMap(x=>{const p=path.join(ROOT,x.path);return!fs.existsSync(p)?[{path:x.path,status:'missing'}]:sha(read(p))!==x.sha256?[{path:x.path,status:'changed'}]:[];});
const originDrift=Object.entries(m.origins).flatMap(([kind,x])=>{const p=path.resolve(OUT,x.path);return sha(read(p))!==x.sha256?[{kind,path:x.path,status:'changed'}]:[];});
const inputItems=[];for(const files of Object.values(f.groups))for(const file of files){const input=json('figma-inputs/'+file);check(input.pageName==='20 전체 UX 경우·경로','Wrong writable page in '+file);check(input.checksum===m.checksums.sourceFiles,'Figma input has stale source '+file);inputItems.push(...input.items);}
const surfaceCards=inputItems.filter(x=>/^[ROUA]\d\d$/.test(x.id)),actionCards=inputItems.filter(x=>x.id.startsWith('X-'));
check(surfaceCards.length===121&&new Set(surfaceCards.map(x=>x.id)).size===121,'Native surface card input incomplete');check(actionCards.length===s.actions.length&&new Set(actionCards.map(x=>x.id)).size===s.actions.length,'Native action card input incomplete');
if(sourceDrift.length)warnings.push('Source changed after capture; regenerate before final source or Figma claims.');if(originDrift.length)warnings.push('Original inventory/contracts changed after capture.');if(m.unclassified.length)warnings.push('Actions remain unclassified.');
const builder=read(path.join(OUT,'build-figma-paths.js'));check(!/setPluginData|getPluginData/.test(builder),'Figma builder must not use pluginData');
try{new (Object.getPrototypeOf(async function(){}).constructor)('INPUT',builder);}catch(e){errors.push('Figma async body syntax: '+e.message);}
const remoteEvidencePath='work/frontend-opportunities-20261002/figma-validation-summary.json';
let remoteExecutionVerified=false,remoteVerifiedAt=null;
if(fs.existsSync(path.join(ROOT,remoteEvidencePath))){
 try{
  const remote=JSON.parse(read(path.join(ROOT,remoteEvidencePath))),checked=new Map(remote.checked.map(x=>[x[0],x]));
  const fnv=value=>{let h=0x811c9dc5;for(let n=0;n<value.length;n++)h=Math.imul(h^value.charCodeAt(n),0x01000193)>>>0;return h.toString(16).padStart(8,'0');};
  const bodiesMatch=inputItems.every(item=>{const body=Array.isArray(item.body)?item.body.join('\n\n'):String(item.body||''),row=checked.get(item.id);return row&&row[2]===body.length&&row[3]===fnv(body);});
  const evidenceMatches=remote.evidence.every(item=>fs.existsSync(path.join(ROOT,item.path))&&sha(fs.readFileSync(path.join(ROOT,item.path)))===item.sha256);
  remoteExecutionVerified=remote.status==='passed'&&remote.remoteExecuted===true&&!remote.issues.length&&remote.sourceChecksum===m.checksums.sourceFiles&&checked.size===inputItems.length+4&&remote.checkedCardCount===checked.size&&bodiesMatch&&evidenceMatches&&!sourceDrift.length&&!originDrift.length;
  remoteVerifiedAt=remote.verifiedAt;
  if(!remoteExecutionVerified)warnings.push('Saved Figma evidence does not fully match the current captured source, inputs, or evidence files.');
 }catch(error){warnings.push('Could not validate saved Figma evidence: '+error.message);}
}
const compactCardsPath=path.join(ROOT,'docs/figma-memory-20261002/compact-ux-cards.json');
const legacySavedEvidenceVerified=remoteExecutionVerified;
let compactProjection=null;
if(fs.existsSync(compactCardsPath)){
 try{
  const compact=JSON.parse(read(compactCardsPath));
  compactProjection={policy:compact.policy,sourceChecksum:compact.sourceChecksum,cards:compact.cards.length,inputSha256:sha(fs.readFileSync(compactCardsPath)),remoteExecutionVerified:false,verificationScope:'Prepared compact projection requires its own remote readback evidence. Historical full-body evidence is retained separately.'};
  check(compact.sourceChecksum===m.checksums.sourceFiles,'Compact projection has a different captured source snapshot');
  remoteExecutionVerified=false;
  warnings.push('Historical full-body Figma evidence does not verify the new compact display projection. Use its separate readback evidence.');
 }catch(error){errors.push('Could not inspect compact Figma projection: '+error.message);}
}
const report={kind:'documentation-integrity-not-product-test',capturedAt:m.capturedAt,checkedAt:new Date().toISOString(),originalSurfaces:111,extensions:10,actions:s.actions.length,mappedActions:mapped.size,unclassified:m.unclassified.length,pathTransitions:pathCount,parseErrors:s.parseErrors.length,errors,warnings,sourceDrift,originDrift,figmaInput:{surfaceCards:surfaceCards.length,actionCards:actionCards.length,batches:Object.values(f.groups).reduce((n,a)=>n+a.length,0),remoteExecutionVerified,remoteVerifiedAt,remoteEvidencePath:remoteExecutionVerified?remoteEvidencePath:null,legacySavedEvidence:{verifiedAgainstHistoricalInputs:legacySavedEvidenceVerified,projection:'full-ux-body',verifiedAt:remoteVerifiedAt,path:remoteEvidencePath},compactProjection},checksums:m.checksums,runtimeTested:false};
process.stdout.write(JSON.stringify(report,null,2)+'\n');if(errors.length)process.exitCode=1;
