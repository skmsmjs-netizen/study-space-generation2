// Async use_figma body. One page only. INPUT is produced from current screens-*.json evidence.
// Does not invent targets, create nodes, edit text, move frames, or simulate application saves.
const page=await figma.getNodeByIdAsync(INPUT.pageId);
if(!page||page.type!=='PAGE')throw Error('Navigation page missing: '+INPUT.pageId);
await figma.setCurrentPageAsync(page);
const changed=new Set(),links=[],skips=[],unresolved=[...(INPUT.preUnresolved||[])],observed=new Set();
const screens=Object.values(INPUT.screenMap),byFrame=new Map(screens.map(s=>[s.id,s])),byKey=new Map(screens.map(s=>[s.routeId+'@'+s.profile,s])),ambiguous=new Set(INPUT.ambiguousScreenKeys||[]);
const nodeCache=new Map();async function nodeById(id){if(!nodeCache.has(id))nodeCache.set(id,await figma.getNodeByIdAsync(id));const n=nodeCache.get(id);if(n)observed.add(n.id);return n;}
function top(n){let current=n;while(current?.parent&&current.parent.type!=='PAGE')current=current.parent;return current?.parent?.type==='PAGE'?current:null;}
function compactIds(values){const ids=[...new Set(values)],by=new Map(),literal=[];for(const id of ids){const m=/^(.*:)(0|[1-9]\d*)$/.exec(id);if(!m||!Number.isSafeInteger(Number(m[2]))){literal.push(id);continue;}const a=by.get(m[1])||[];a.push(Number(m[2]));by.set(m[1],a);}const groups=[];for(const[p,a]of by){a.sort((x,y)=>x-y);const r=[];for(let i=0;i<a.length;){let j=i;while(j+1<a.length&&a[j+1]===a[j]+1)j++;r.push(i===j?a[i]:[a[i],a[j]]);i=j+1;}groups.push([p,r]);}return{encoding:'figma-id-ranges-v1',count:ids.length,groups,literal};}
function actions(r){return Array.isArray(r.actions)?r.actions:[];}
function sameAction(a,b){if(a.type!==b.type)return false;if(a.type==='URL')return a.url===b.url;if(a.type==='NODE')return a.destinationId===b.destinationId&&a.navigation===b.navigation;return false;}
const seenControls=new Set();
for(const c of INPUT.controls){const base={nodeId:c.nodeId,target:c.target};if(seenControls.has(c.nodeId)){unresolved.push({...base,reason:'duplicate-control-input'});continue;}seenControls.add(c.nodeId);
if(c.targetReason||!c.targetRouteId){unresolved.push({...base,reason:c.targetReason||'missing-explicit-target'});continue;}
let node;try{node=await nodeById(c.nodeId);}catch(error){unresolved.push({...base,reason:'source-read-failed',error:String(error.message||error)});continue;}
if(!node||node.removed){unresolved.push({...base,reason:'source-node-missing'});continue;}
const root=top(node);if(!root||root.type!=='FRAME'||root.parent.id!==page.id){unresolved.push({...base,reason:'source-not-in-this-page-top-level-frame'});continue;}const source=byFrame.get(root.id);if(!source||source.pageId!==page.id){unresolved.push({...base,reason:'source-frame-not-in-evidence',frameId:root.id});continue;}
const context={...base,fromFrameId:root.id,fromRouteId:source.routeId,fromProfile:source.profile};
if(typeof node.setReactionsAsync!=='function'||!('reactions'in node)){unresolved.push({...context,reason:'control-does-not-support-reactions'});continue;}
const existing=Array.isArray(node.reactions)?node.reactions:[],clicks=existing.filter(r=>r.trigger?.type==='ON_CLICK');
if(source.routeId===c.targetRouteId){
 const ownedIds=new Set(c.managedExistingDestinationIds||[]);
 const removable=clicks.filter(r=>actions(r).length===1&&actions(r)[0].type==='NODE'&&actions(r)[0].navigation==='NAVIGATE'&&ownedIds.has(actions(r)[0].destinationId)&&byFrame.get(actions(r)[0].destinationId)?.routeId===source.routeId&&actions(r)[0].destinationId!==root.id);
 let removed=0;
 if(removable.length){try{await node.setReactionsAsync(existing.filter(r=>!removable.includes(r)));changed.add(node.id);const after=Array.isArray(node.reactions)?node.reactions:[];const retained=after.filter(r=>r.trigger?.type==='ON_CLICK'&&actions(r).some(a=>a.type==='NODE'&&removable.some(old=>actions(old)[0].destinationId===a.destinationId)));if(retained.length){unresolved.push({...context,reason:'self-cleanup-readback-mismatch',changed:true});continue;}removed=removable.length;}catch(error){unresolved.push({...context,reason:'self-cleanup-write-failed',error:String(error.message||error)});continue;}}
 skips.push({...context,reason:'self-control',removedManagedClickReactions:removed,preservedClickReactions:clicks.length-removed,existingDestinations:clicks.filter(r=>!removable.includes(r)).flatMap(r=>actions(r).filter(a=>a.type==='NODE').map(a=>a.destinationId))});continue;}
const preferred=c.targetRouteId+'@'+source.profile,fallback=c.targetRouteId+'@'+INPUT.fallbackProfile;
if(ambiguous.has(preferred)||(!byKey.has(preferred)&&ambiguous.has(fallback))){unresolved.push({...context,reason:'ambiguous-destination-evidence',screenKey:ambiguous.has(preferred)?preferred:fallback});continue;}
const destination=byKey.get(preferred)||byKey.get(fallback);if(!destination){unresolved.push({...context,reason:'destination-profile-and-wide-missing',targetRouteId:c.targetRouteId});continue;}
let target;try{target=await nodeById(destination.id);}catch(error){unresolved.push({...context,reason:'destination-read-failed',error:String(error.message||error)});continue;}
if(!target||target.removed||target.type!=='FRAME'||target.parent?.type!=='PAGE'){unresolved.push({...context,reason:'destination-not-a-top-level-frame',destinationId:destination.id});continue;}
if(target.parent.id!==destination.pageId){unresolved.push({...context,reason:'destination-page-mismatch',destinationId:destination.id});continue;}
if(target.id===root.id){skips.push({...context,reason:'self-frame'});continue;}
const native=target.parent.id===page.id;
const action=native?{type:'NODE',destinationId:target.id,navigation:'NAVIGATE',transition:null}:{type:'URL',url:INPUT.fileUrl+'?node-id='+target.id.replace(/:/g,'-'),openInNewTab:false};
const record={...context,toFrameId:target.id,toRouteId:destination.routeId,toProfile:destination.profile,toPageId:destination.pageId,kind:native?'NAVIGATE':'URL',profileMatch:source.profile===destination.profile};
const matching=clicks.length===1&&actions(clicks[0]).length===1&&sameAction(actions(clicks[0])[0],action);
if(matching){links.push({...record,changed:false,status:'already-linked'});continue;}
// Preserve independent interactions. Only replace exact builder-recorded click navigation.
const managed=new Set(c.managedExistingDestinationIds||[]);
const owned=clicks.every(r=>actions(r).length===1&&actions(r)[0].type==='NODE'&&actions(r)[0].navigation==='NAVIGATE'&&managed.has(actions(r)[0].destinationId));
if(clicks.length&&!owned){unresolved.push({...record,reason:'existing-click-conflict-preserved',clickCount:clicks.length});continue;}
const next=[...existing.filter(r=>r.trigger?.type!=='ON_CLICK'),{trigger:{type:'ON_CLICK'},actions:[action]}];
try{await node.setReactionsAsync(next);changed.add(node.id);const readback=Array.isArray(node.reactions)?node.reactions:[];const actual=readback.filter(r=>r.trigger?.type==='ON_CLICK');if(actual.length!==1||actions(actual[0]).length!==1||!sameAction(actions(actual[0])[0],action)){unresolved.push({...record,reason:'reaction-readback-mismatch',changed:true});continue;}links.push({...record,changed:true,status:'linked-and-read-back'});}catch(error){unresolved.push({...record,reason:'reaction-write-failed',error:String(error.message||error)});}
}
const edges=[...new Set(links.map(x=>x.fromRouteId+'>'+x.toRouteId))].map(value=>{const[from,to]=value.split('>');return{from,to};});
return{pageId:page.id,pageKey:INPUT.pageKey,createdNodeIds:[],changedNodeIds:compactIds(changed),mutatedNodeIds:compactIds(changed),observedNodeIds:compactIds(observed),links:{encoding:'columnar-v1',columns:['nodeId','fromFrameId','toFrameId','kind','profileMatch','status'],rows:links.map(x=>[x.nodeId,x.fromFrameId,x.toFrameId,x.kind,x.profileMatch,x.status])},skips:{encoding:'columnar-v1',columns:['nodeId','fromFrameId','reason','removedManagedClickReactions','preservedClickReactions','existingDestinations'],rows:skips.map(x=>[x.nodeId,x.fromFrameId,x.reason,x.removedManagedClickReactions||0,x.preservedClickReactions||0,x.existingDestinations||[]])},unresolved,edges,counts:{controls:INPUT.controls.length+(INPUT.preUnresolved||[]).length,linked:links.length,native:links.filter(x=>x.kind==='NAVIGATE').length,url:links.filter(x=>x.kind==='URL').length,changed:changed.size,skipped:skips.length,unresolved:unresolved.length},limits:['Self controls are not linked. Only builder-recorded navigation to a different profile of the same screen is removed; independent reactions are preserved.','Links with no matching profile use only the declared wide profile.','URL actions open the actual Figma node; they are not native cross-page prototype navigation.','Prototype linkage does not verify saves, runtime permissions, preserved caller context or the 14 complete application flows.']};
