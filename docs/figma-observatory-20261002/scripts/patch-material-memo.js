// Local draft for use_figma; parent executes after supplying current actual IDs.
// INPUT = {pageId, frames:[{id,profile,routeId:'R23'}], blockMap, foundations,
// materials, reusable:{buttonPrimary,buttonQuiet}, linkTargets:{R06:frameId,O24:frameId}}
// The existing 155 viewport count is unchanged. Expanded states are separate references.
// A reference navigation is a Figma inspection aid; the app uses inline native details.
const F=INPUT.foundations, M=INPUT.materials;
if(!F?.fonts?.font || !M?.paper || !Array.isArray(INPUT.frames) || !INPUT.frames.length)throw Error('Supply foundations, materials and actual R23 frames.');
const page=await figma.getNodeByIdAsync(INPUT.pageId);
if(page?.type!=='PAGE')throw Error('Expected the existing R23 page.');
await figma.setCurrentPageAsync(page);
const createdNodeIds=[],mutatedNodeIds=[],controlMap=[],expandedStateNodes={},stateReferenceAnnotations={},preservation=[];
const blockMap=JSON.parse(JSON.stringify(INPUT.blockMap||{}));
blockMap.R23=blockMap.R23||{};blockMap.R23['R23-B02']=blockMap.R23['R23-B02']||{};
const loadedFonts=new Set();
async function font(name){const k=JSON.stringify(name);if(!loadedFonts.has(k)){await figma.loadFontAsync(name);loadedFonts.add(k);}}
await font(F.fonts.font);await font(F.fonts.boldFont||F.fonts.font);
async function nodeFonts(n){const texts=n.type==='TEXT'?[n]:('findAllWithCriteria'in n?n.findAllWithCriteria({types:['TEXT']}):[]);for(const t of texts)for(const s of t.getStyledTextSegments(['fontName']))await font(s.fontName);}
const variables={};for(const [key,v]of Object.entries(F.variables||{}))if(key.startsWith('material/'))variables[key]=await figma.variables.getVariableByIdAsync(v.id);
const components={};for(const key of ['buttonPrimary','buttonQuiet']){const id=INPUT.reusable?.[key];if(id){const n=await figma.getNodeByIdAsync(id);if(n?.type==='COMPONENT'){await nodeFonts(n);components[key]=n;}}}
const targets=[];
// Validate every target before creating anything; never silently substitute another screen.
for(const spec of INPUT.frames){const n=await figma.getNodeByIdAsync(spec.id||spec.frameId);if(n?.type!=='FRAME'||n.parent?.id!==page.id||!(spec.routeId==='R23'||/^R23@/.test(n.name)))throw Error('Target must be a current R23 viewport: '+JSON.stringify(spec));
 const wrap=n.children.find(c=>c.type==='FRAME'&&c.name==='작업면과 도구');if(!wrap||wrap.layoutMode!=='VERTICAL'||wrap.primaryAxisAlignItems!=='MIN'||n.primaryAxisAlignItems!=='MIN'||n.primaryAxisSizingMode!=='FIXED')throw Error('R23 structure changed; inspect before patching '+n.id);
 await nodeFonts(n);targets.push({spec,root:n,wrap,profile:spec.profile||n.name.split('@')[1]||'ipad-landscape'});}
const hex=s=>({r:parseInt(s.slice(1,3),16)/255,g:parseInt(s.slice(3,5),16)/255,b:parseInt(s.slice(5,7),16)/255});
function paint(role){const p={type:'SOLID',color:hex(M.paper[role])};const v=variables['material/'+role];return v?figma.variables.setBoundVariableForPaint(p,'color',v):p;}
function track(n,deep=false){createdNodeIds.push(n.id);if(deep&&'findAll'in n)createdNodeIds.push(...n.findAll(()=>true).map(v=>v.id));return n;}
function box(name,width,pad=16,dir='VERTICAL'){const n=track(figma.createAutoLayout(dir));n.name=name;n.resize(Math.max(160,width),56);n.primaryAxisSizingMode=dir==='VERTICAL'?'AUTO':'FIXED';n.counterAxisSizingMode=dir==='VERTICAL'?'FIXED':'AUTO';n.paddingLeft=n.paddingRight=n.paddingTop=n.paddingBottom=pad;n.itemSpacing=12;n.fills=[paint('surface')];n.clipsContent=false;const mode=F.modes?.find(m=>m.name.toLowerCase()==='paper');if(mode&&F.collections?.material)n.setExplicitVariableModeForCollection(F.collections.material,mode.modeId);return n;}
function text(parent,value,width,role='Body',muted=false){const n=track(figma.createText());n.fontName=F.fonts.font;n.characters=value;if(F.textStyles?.[role])n.textStyleId=F.textStyles[role];n.fills=[paint(muted?'muted':'text')];n.textAutoResize='HEIGHT';n.resize(Math.max(36,width),n.height);parent.appendChild(n);return n;}
function button(parent,label,width,primary=false){let n;const c=components[primary?'buttonPrimary':'buttonQuiet'];if(c){n=track(c.createInstance(),true);n.name='행동 / '+label;parent.appendChild(n);const ts=n.findAllWithCriteria({types:['TEXT']});const t=ts.find(x=>/Label|label|내용|텍스트/.test(x.name))||ts[0];if(t){t.fontName=F.fonts.boldFont||F.fonts.font;t.characters=label;t.textAutoResize='HEIGHT';t.resize(Math.max(56,width-32),t.height);}n.resize(width,48);}else{n=box('행동 / '+label,width,12,'HORIZONTAL');parent.appendChild(n);text(n,label,width-24,'Label');n.resize(width,48);n.primaryAxisSizingMode='FIXED';n.counterAxisSizingMode='FIXED';}return n;}
async function link(node,target,profile,fromState){const entry={nodeId:node.id,target,routeId:'R23',blockId:'R23-B02',profile,fromState,returnContext:'R23-B02-expanded'};const raw=INPUT.linkTargets?.[target];const id=typeof raw==='string'?raw:raw?.[profile]||raw?.id;controlMap.push(entry);if(!id)return;const dest=await figma.getNodeByIdAsync(id);if(dest?.type!=='FRAME')throw Error('Supplied linked target is not a frame: '+target);await node.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:id,navigation:'NAVIGATE',transition:null,resetScrollPosition:false}]}]);entry.destinationId=id;}
let nextY=page.children.reduce((max,n)=>Math.max(max,n.y+n.height),100)+120;
for(const {root,wrap,profile}of targets){
 const oldChildren=wrap.children.map(n=>({id:n.id,x:n.x,y:n.y,width:n.width,height:n.height}));const oldRoot={x:root.x,y:root.y,width:root.width,height:root.height};
 const width=wrap.width-wrap.paddingLeft-wrap.paddingRight;
 let collapsed=wrap.children.find(n=>n.name==='R23-B02 / 자료 곁에 메모');
 if(!collapsed){collapsed=box('R23-B02 / 자료 곁에 메모',width,8);collapsed.strokes=[paint('borderDecorative')];const summary=button(collapsed,'▸ 자료 곁에 메모',width-16);summary.name='R23-B02 / 기본 닫힘 summary';
  // Append only: all pre-existing source content and controls retain their coordinates.
  wrap.appendChild(collapsed);mutatedNodeIds.push(wrap.id);}
 blockMap.R23['R23-B02'][profile]=collapsed.id;
 const expandedName='R23-B02@'+profile+' / 펼침 상태 참조';
 let expanded=page.children.find(n=>n.name===expandedName);
 if(!expanded){expanded=box(expandedName,width,width<480?16:24);page.appendChild(expanded);expanded.x=root.x;expanded.y=nextY;expanded.strokes=[paint('borderDecorative')];const iw=width-expanded.paddingLeft*2;
  text(expanded,'▾ 자료 곁에 메모',iw,'Label');text(expanded,'작은 메모',iw,'TitleCompact');text(expanded,'떠오른 생각을 잠시 보관하세요. 짧은 글이나 그림으로 남길 수 있습니다.',iw,'Body',true);
  const actionRow=box('작은 메모 행동',iw,0,width<480?'VERTICAL':'HORIZONTAL');actionRow.fills=[];expanded.appendChild(actionRow);const bw=width<480?iw:Math.min(180,(iw-12)/2);const all=button(actionRow,'모두 보기',bw);await link(all,'R06',profile,'expanded');const add=button(actionRow,'메모 추가',bw,true);await link(add,'O24',profile,'expanded');
  const memo=box('메모 1 / 합성 예시',iw,16);memo.strokes=[paint('borderDecorative')];expanded.appendChild(memo);text(memo,'비교 조건을 다음에 다시 확인하기.',iw-32);text(memo,'미적분 · 급수',iw-32,'Caption',true);const open=button(memo,'메모 열기',Math.min(180,iw-32));await link(open,'O24',profile,'expanded');
  nextY=expanded.y+expanded.height+24;
 }
 expandedStateNodes[profile]={id:expanded.id,routeId:'R23',blockId:'R23-B02',state:'expanded',countsAsViewport:false,countsAsSupplementalStateReference:true,defaultStateNodeId:collapsed.id};
 const noteName='설계 근거 / R23-B02@'+profile;let note=page.children.find(n=>n.name===noteName);
 if(!note){note=box(noteName,width,16);page.appendChild(note);note.x=expanded.x;note.y=expanded.y+expanded.height+24;text(note,'합성 설계 예시 · R23-B02 펼침 상태 참조',width-32,'Label');text(note,'앱은 native details로 같은 자료 안에서 펼칩니다. 기본 닫힘은 기존 R23 viewport 안에 있고 이 프레임은 별도 상태 참조입니다. compact QuickMemos: 최대 3개, 검색 없음, topicId 우선·없으면 subjectId. 모두 보기 → R06, 추가·열기 → O24; 편집기를 닫으면 원자료의 펼친 영역으로 복귀합니다. 원자료·메모 원문·필기·이력·초안은 보존합니다. 기존 viewport와 노드는 이동하지 않았습니다.',width-32,'Caption');}
 stateReferenceAnnotations[profile]=note.id;nextY=Math.max(nextY,note.y+note.height+120);
 const summary=collapsed.children.find(n=>n.name==='R23-B02 / 기본 닫힘 summary')||collapsed;controlMap.push({nodeId:summary.id,target:'R23-B02-expanded',destinationId:expanded.id,routeId:'R23',blockId:'R23-B02',profile,referenceOnly:true,appBehavior:'native details inline toggle'});
 const shifted=oldChildren.filter(s=>{const n=wrap.children.find(c=>c.id===s.id);return !n||Math.abs(n.x-s.x)>.01||Math.abs(n.y-s.y)>.01||Math.abs(n.width-s.width)>.01||Math.abs(n.height-s.height)>.01;}).map(s=>s.id);
 const viewportChanged=['x','y','width','height'].filter(k=>Math.abs(root[k]-oldRoot[k])>.01);
 preservation.push({frameId:root.id,profile,preservedExistingChildren:oldChildren.length,shiftedExistingNodeIds:shifted,viewportChangedProperties:viewportChanged,addedBlockId:collapsed.id});
 if(shifted.length||viewportChanged.length)throw Error('Unexpected existing layout shift; inspect affected R23 before retrying: '+root.id);
}
return {createdNodeIds:[...new Set(createdNodeIds)],mutatedNodeIds:[...new Set(mutatedNodeIds)],pageId:page.id,blockMap,expandedStateNodes,stateReferenceAnnotations,controlMap,preservation,counts:{addedViewportFrames:0,existingViewportCountUnchanged:true,supplementalStateReferences:Object.keys(expandedStateNodes).length},notes:['Source mapping correction, not a new application feature.','Expanded reference is separate from the 155 existing viewport frames.','Default summary is appended without moving earlier R23 content; source order remains documented in R23-B02.','No existing prototype reactions or text were edited.','Reference-only summary links are returned, not installed as fake inline disclosure interactions.']};
