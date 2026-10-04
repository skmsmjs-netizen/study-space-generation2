// One existing page per use_figma call. Never regenerates screens or controls.
// INPUT = {pageId, frameIds:[actualViewportIds], registry:{Input,Textarea,Checkbox},
// foundations:{collections,modes}, dryRun?:false, stopOnFailure?:true,
// controlStates?:{[nativeControlId]:{state:'default'|'empty'|'focus'|'disabled'|'invalid'|'readOnly',value:'checked'|'unchecked'|'mixed'}}}
// registry entries are copied from evidence/components-review.json.registryMap.
// Existing viewport/block/control/text IDs, text, dimensions, reactions and layout remain.
// Source visual paints/text are made transparent (not removed from auto-layout).
// A real linked instance overlays only the visual control; checkbox labels stay native.
const page=await figma.getNodeByIdAsync(INPUT.pageId);
if(page?.type!=='PAGE')throw Error('Supply one existing screen page.');
await figma.setCurrentPageAsync(page);
const registry=INPUT.registry||INPUT.componentsReview?.registryMap;
for(const kind of ['Input','Textarea','Checkbox'])if(!registry?.[kind]?.variants?.length)throw Error('Missing actual component registry: '+kind);
const F=INPUT.foundations;if(!F?.collections?.material||!F?.modes?.some(m=>m.name.toLowerCase()==='paper'))throw Error('Supply actual material collection and Paper mode.');
const paperMode=F.modes.find(m=>m.name.toLowerCase()==='paper').modeId;
const MARK='공통 부품 표시 / ';
const observedNodeIds=[],createdNodeIds=[],removedNodeIds=[],mutatedNodeIds=new Set(),replacements=[],skipped=[],failed=[],preservation=[],reused=[];
const instances={},fontCache=new Set(),componentCache=new Map();
function allNative(root){const out=[];function visit(n){out.push(n);if(n.type!=='INSTANCE'&&'children'in n)for(const c of n.children)visit(c);}visit(root);return out;}
function actualVisible(n,root){let p=n;while(p&&p!==root.parent){if(p.visible===false)return false;p=p.parent;}return true;}
function clone(value){return JSON.parse(JSON.stringify(value));}
function geometry(n){return {id:n.id,x:n.x,y:n.y,width:n.width,height:n.height};}
function sameGeometry(n,s){return ['x','y','width','height'].every(k=>Math.abs(n[k]-s[k])<.02);}
function snapshot(nodes){return nodes.map(n=>({...geometry(n),type:n.type,characters:n.type==='TEXT'?n.characters:undefined,reactions:'reactions'in n?JSON.stringify(n.reactions):undefined}));}
function changes(nodes,before){const map=new Map(nodes.map(n=>[n.id,n]));return before.filter(s=>{const n=map.get(s.id);return !n||!sameGeometry(n,s)||(s.characters!==undefined&&n.characters!==s.characters)||(s.reactions!==undefined&&JSON.stringify(n.reactions)!==s.reactions);}).map(s=>s.id);}
async function loadFont(name){const key=JSON.stringify(name);if(!fontCache.has(key)){await figma.loadFontAsync(name);fontCache.add(key);}}
async function loadNodeFonts(n){for(const t of n.type==='TEXT'?[n]:('findAllWithCriteria'in n?n.findAllWithCriteria({types:['TEXT']}):[]))for(const s of t.getStyledTextSegments(['fontName']))await loadFont(s.fontName);}
function recordTree(n){createdNodeIds.push(n.id);if('findAll'in n)createdNodeIds.push(...n.findAll(()=>true).map(c=>c.id));return n;}
function absolute(n,x,y,w,h){if(n.layoutPositioning!=='ABSOLUTE')n.layoutPositioning='ABSOLUTE';n.resize(w,h);n.x=x;n.y=y;}
function unbind(n,key){if(n.boundVariables?.[key])n.setBoundVariable(key,null);}
function flattenFrame(n,w,h){for(const k of ['paddingTop','paddingBottom','paddingLeft','paddingRight','itemSpacing']){unbind(n,k);if(k in n)n[k]=0;}n.resize(w,h);n.primaryAxisSizingMode='FIXED';n.counterAxisSizingMode='FIXED';n.primaryAxisAlignItems='MIN';n.counterAxisAlignItems='MIN';n.clipsContent=false;}
function explicitPaper(n){n.setExplicitVariableModeForCollection(F.collections.material,paperMode);}
function transparentPaints(paints){if(!Array.isArray(paints))throw Error('Mixed paints need a targeted patch.');return paints.map(p=>({...p,opacity:0}));}
function sourceLabel(node){const declared=node.name.replace(/^입력\s*\/\s*/, '');const siblings=node.parent?.children||[];const index=siblings.findIndex(n=>n.id===node.id);const previous=siblings[index-1];return previous?.type==='TEXT'?previous.characters:declared;}
function classify(node){
 if(node.type!=='FRAME')return null;
 if(node.name.startsWith('입력 / ')){
  const originals=node.children.filter(n=>!(n.type==='INSTANCE'&&n.name.startsWith(MARK)));
  if(originals.some(n=>n.type==='TEXT'&&n.characters.trim()==='선택 ▾'))return {skip:'Select: 선택 ▾ 표시와 원래 값·화살표를 보존; Input으로 변환하지 않음'};
  const texts=originals.filter(n=>n.type==='TEXT'),spacers=originals.filter(n=>n.type==='RECTANGLE'&&Math.abs(n.width-1)<.02&&Math.abs(n.height-64)<.02&&Array.isArray(n.fills)&&n.fills.length===0);
  if(texts.length!==1||originals.some(n=>n!==texts[0]&&!spacers.includes(n))||spacers.length>1)return {skip:'Input/Textarea의 실제 생성 구조를 확정할 수 없음'};
  if(node.layoutMode!=='VERTICAL')return {skip:'입력 레이아웃이 기존 builder 구조와 다름'};
  const text=texts[0];if(typeof text.fontName!=='object'||!text.fontName.family)return {skip:'혼합 서체 입력은 원문별 별도 확인 필요'};
  const overrides=INPUT.controlStates?.[node.id]||{};const kind=spacers.length?'Textarea':'Input';
  return {kind,node,valueText:text,label:sourceLabel(node),text:text.characters,state:overrides.state||(text.characters==='내용을 입력해 주세요'?'empty':'default'),nativeVisuals:[text],width:node.width,height:node.height};
 }
 if(node.name.startsWith('선택 / ')){
  const originals=node.children.filter(n=>!(n.type==='INSTANCE'&&n.name.startsWith(MARK)));const boxes=originals.filter(n=>n.type==='RECTANGLE'&&Math.abs(n.width-20)<.02&&Math.abs(n.height-20)<.02);const texts=originals.filter(n=>n.type==='TEXT'),marks=originals.filter(n=>n.type==='VECTOR'&&n.layoutPositioning==='ABSOLUTE');
  if(node.layoutMode!=='HORIZONTAL'||boxes.length!==1||texts.length!==1||marks.length>1||originals.some(n=>!boxes.includes(n)&&!texts.includes(n)&&!marks.includes(n)))return {skip:'Checkbox 원본 marker/label 구조를 확정할 수 없음'};
  const checked=boxes[0].name==='선택됨';if(checked!==(marks.length===1))return {skip:'Checkbox 선택 이름과 실제 체크 표시가 불일치'};
  const overrides=INPUT.controlStates?.[node.id]||{};return {kind:'Checkbox',node,box:boxes[0],label:texts[0].characters,text:null,state:overrides.state||'default',value:overrides.value||(checked?'checked':'unchecked'),nativeVisuals:[boxes[0],...marks],width:boxes[0].width,height:boxes[0].height};
 }
 return null;
}
async function masterFor(spec){const info=registry[spec.kind];const variant=info.variants.find(v=>v.properties.State===spec.state&&(spec.kind!=='Checkbox'||v.properties.Value===spec.value));if(!variant)throw Error('No actual '+spec.kind+' variant for '+spec.state+'/'+(spec.value||''));let c=componentCache.get(variant.id);if(!c){c=await figma.getNodeByIdAsync(variant.id);if(c?.type!=='COMPONENT')throw Error('Registry variant is no longer a component: '+variant.id);await loadNodeFonts(c);componentCache.set(variant.id,c);}return {component:c,info,variant};}
function setProperty(instance,info,name,value){const id=info.propertyIds?.[name];if(!id)throw Error('Missing component property '+info.name+'.'+name);instance.setProperties({[id]:value});}
async function copyValue(target,source){
 target.characters=source.characters;
 if(typeof source.textStyleId==='string'&&source.textStyleId)await target.setTextStyleIdAsync(source.textStyleId);
 for(const key of ['fontName','fontSize','lineHeight','letterSpacing','paragraphSpacing','paragraphIndent','textAlignHorizontal','textAlignVertical','textCase','textDecoration'])if(key in source&&key in target&&typeof source[key]!=='symbol')target[key]=source[key];
 target.textAutoResize=source.textAutoResize;target.resize(source.width,source.height);
}
const roots=[];
for(const id of INPUT.frameIds||[]){const n=await figma.getNodeByIdAsync(id);if(n?.type!=='FRAME'||n.parent?.id!==page.id)throw Error('Viewport must be an actual frame on the requested page: '+id);roots.push(n);}
if(!roots.length)throw Error('Supply actual viewport frameIds; whole-page implicit scanning is disabled.');
const rootSnapshots=roots.map(root=>({root,before:snapshot(allNative(root))}));
const candidates=[];
for(const root of roots)for(const node of allNative(root)){if(!actualVisible(node,root))continue;const spec=classify(node);if(!spec)continue;if(spec.skip){skipped.push({nodeId:node.id,frameId:root.id,name:node.name,reason:spec.skip});continue;}spec.frameId=root.id;
 const existing=node.children.find(n=>n.type==='INSTANCE'&&n.name===MARK+node.id);
 if(existing){observedNodeIds.push(existing.id,...existing.findAll(()=>true).map(n=>n.id));reused.push({nodeId:node.id,instanceId:existing.id,mainComponentId:(await existing.getMainComponentAsync())?.id,kind:spec.kind,frameId:root.id});instances[node.id]=existing.id;continue;}
 candidates.push(spec);
}
if(INPUT.dryRun)return {dryRun:true,pageId:page.id,candidates:candidates.map(s=>({nodeId:s.node.id,frameId:s.frameId,kind:s.kind,label:s.label,value:s.text,state:s.state,selection:s.value,width:s.width,height:s.height})),skipped,reused,counts:{viewports:roots.length,candidates:candidates.length}};
for(const spec of candidates){
 const original=spec.node;let instance;const before={fills:clone(original.fills),strokes:clone(original.strokes),visuals:spec.nativeVisuals.map(n=>({node:n,opacity:n.opacity})),geometry:snapshot(allNative(original))};
 const atCreated=createdNodeIds.length;
 try{
  const {component,info,variant}=await masterFor(spec);await loadNodeFonts(original);instance=recordTree(component.createInstance());instance.name=MARK+original.id;
  // Attach before ABSOLUTE; keep all original children participating in layout.
  original.appendChild(instance);mutatedNodeIds.add(original.id);instance.layoutPositioning='ABSOLUTE';explicitPaper(instance);
  setProperty(instance,info,'Label',spec.label);
  if(spec.kind!=='Checkbox')flattenFrame(instance,spec.width,spec.height);instance.fills=[];instance.strokes=[];instance.effects=[];
  const parts=instance.children;
  if(spec.kind==='Checkbox'){
   const marker=parts.find(n=>n.type==='RECTANGLE'&&n.name==='Selection mark');const label=parts.find(n=>n.type==='TEXT'&&n.name==='Label');const indicator=parts.find(n=>n.name===(spec.value==='mixed'?'Mixed indicator':'Checked indicator'));
   if(!marker||!label||(spec.value!=='unchecked'&&!indicator))throw Error('Checkbox component structure changed.');
   label.visible=false;instance.x=spec.box.x-marker.x;instance.y=spec.box.y-marker.y;
  }else{
   const control=parts.find(n=>n.type==='FRAME'&&n.name==='Control');const value=control?.children.find(n=>n.type==='TEXT'&&n.name==='Value');if(!control||!value)throw Error('Field component Control/Value structure changed.');
   setProperty(instance,info,spec.state==='empty'?'Placeholder':'Value',spec.text);
   for(const n of parts)if(n!==control)n.visible=false;
   
   control.clipsContent=false;explicitPaper(control);
   await copyValue(value,spec.valueText);
   instance.x=0;instance.y=0;
   // Transparent paints retain the 1px stroke's layout contribution (x/y = 13px).
   original.fills=transparentPaints(original.fills);original.strokes=transparentPaints(original.strokes);
   if(value.characters!==spec.text||!sameGeometry(value,{...geometry(spec.valueText),id:value.id}))throw Error('Value bounds changed: '+JSON.stringify({actual:geometry(value),expected:geometry(spec.valueText),control:geometry(control),instance:geometry(instance)}));
  }
  // Preserve existing node IDs, hit targets and auto-layout dimensions; show no duplicate.
  for(const {node}of before.visuals){node.opacity=0;mutatedNodeIds.add(node.id);}
  const drift=changes(allNative(original),before.geometry);if(drift.length)throw Error('Original content/geometry/reaction changed: '+drift.join(','));
  instances[original.id]=instance.id;mutatedNodeIds.add(original.id);for(const {node}of before.visuals)mutatedNodeIds.add(node.id);
  replacements.push({nodeId:original.id,instanceId:instance.id,mainComponentId:variant.id,kind:spec.kind,state:spec.state,selection:spec.value||null,frameId:spec.frameId,label:spec.label,value:spec.text,width:spec.width,height:spec.height,explicitMaterialMode:paperMode,nativeVisualIds:spec.nativeVisuals.map(n=>n.id),originalOpacity:before.visuals.map(x=>({id:x.node.id,opacity:x.opacity})),originalPaints:spec.kind==='Checkbox'?null:{fills:before.fills,strokes:before.strokes}});
 }catch(error){
  // No native node is deleted. Roll back this one control before reporting failure.
  if(instance&&!instance.removed){const tree=[instance.id,...instance.findAll(()=>true).map(n=>n.id)];instance.remove();removedNodeIds.push(...tree);}
  original.fills=before.fills;original.strokes=before.strokes;mutatedNodeIds.add(original.id);for(const {node,opacity}of before.visuals){node.opacity=opacity;mutatedNodeIds.add(node.id);}
  const rollbackDrift=changes(allNative(original),before.geometry);
  failed.push({nodeId:original.id,frameId:spec.frameId,kind:spec.kind,error:String(error),rolledBack:rollbackDrift.length===0,rollbackDrift,createdThenRemovedNodeIds:createdNodeIds.slice(atCreated)});
  if(INPUT.stopOnFailure!==false)break;
 }
}
for(const {root,before}of rootSnapshots){const drift=changes(allNative(root),before);preservation.push({frameId:root.id,preservedOriginalNodeCount:before.length,changedOriginalNodeIds:drift});}
const compactColumns=['nodeId','instanceId','mainComponentId','kind','state','selection','frameId'];const compactReplacements={encoding:'columnar-v1',columns:compactColumns,rows:replacements.map(r=>compactColumns.map(k=>r[k]))};
return {pageId:page.id,observedNodeIds,createdNodeIds:[...new Set(createdNodeIds)],removedNodeIds:[...new Set(removedNodeIds)],mutatedNodeIds:[...mutatedNodeIds],instances,replacements:compactReplacements,reused,skipped,failed,preservation,counts:{viewports:roots.length,viewportIdsChanged:0,blockIdsChanged:0,converted:replacements.length,Input:replacements.filter(x=>x.kind==='Input').length,Textarea:replacements.filter(x=>x.kind==='Textarea').length,Checkbox:replacements.filter(x=>x.kind==='Checkbox').length,reused:reused.length,skipped:skipped.length,failed:failed.length,unprocessedAfterFailure:candidates.length-replacements.length-failed.length},notes:['Only actual Input/Textarea/Checkbox builder shapes are converted. Select and uncertain structures remain visible and are reported.','Original node IDs, label/value text, width/height, coordinates and reactions are retained. Invisible source visuals retain layout participation.','Each new instance is explicitly Paper mode. Existing master components are never edited or detached.','Instance Label/Hint duplication is hidden; checkbox labels remain the original visible native text.','Paper field padding is represented by component Control; original 13px Value offsets and original multiline height override library defaults.','A failed individual conversion removes its new instance and restores source paint/opacity. Returned IDs include removed transient nodes.']};
