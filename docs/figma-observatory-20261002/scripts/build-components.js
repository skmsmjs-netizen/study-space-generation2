// Async use_figma body; root executes remote writes sequentially.
// INPUT = {pageId:'7:70', foundations:<ledger>, registry:<unique subset>,
// finalizeReview?:true, allRegistry?:<48 minimal entries>,
// assets:{worldAssetId?,worldMockup?:{imageHash,width:960,height:400,fileKey?},worldSvg?,
// brandAssetId?,brandSvg?,sceneMockups?:{[name]:{imageHash,width,height,fileKey?}},sceneSvgs?:{[name]:svg}}}.
// worldSvg/sceneSvgs are source evidence only, never native scene imports. PNGs must first
// be uploaded with upload_assets; only an imageHash already in this file may be reused here.
// Empty registry + finalizeReview builds only the final full review. Keep serialized INPUT+body below 50k.
// Component-grid and token-binding helpers adapted from figma-generate-library/scripts/
// createComponentWithVariants.js and bindVariablesToComponent.js. No page switch in helpers.
const created = new Set(), mutated = new Set(), variableIds = [], registryMap = {}, warnings = [];
const foundations = INPUT.foundations;
const registry = INPUT.registry || INPUT.componentRegistry;
const validRegistry={"Button":{"id":"UI01","category":"common-ui"},"IconButton":{"id":"UI02","category":"common-ui"},"Input":{"id":"UI03","category":"common-ui"},"Textarea":{"id":"UI04","category":"common-ui"},"Select":{"id":"UI05","category":"common-ui"},"Checkbox":{"id":"UI06","category":"common-ui"},"Radio":{"id":"UI07","category":"common-ui"},"Tabs":{"id":"UI08","category":"common-ui"},"SegmentedControl":{"id":"UI09","category":"common-ui"},"Card":{"id":"UI10","category":"common-ui"},"ListItem":{"id":"UI11","category":"common-ui"},"Modal":{"id":"UI12","category":"common-ui"},"Sheet":{"id":"UI13","category":"common-ui"},"Toast":{"id":"UI14","category":"common-ui"},"Breadcrumb":{"id":"UI15","category":"common-ui"},"Search":{"id":"UI16","category":"common-ui"},"EmptyState":{"id":"UI17","category":"common-ui"},"LoadingState":{"id":"UI18","category":"common-ui"},"ErrorState":{"id":"UI19","category":"common-ui"},"ScreenBoundary":{"id":"UI20","category":"common-ui"},"NavigationBar":{"id":"UI21","category":"common-ui"},"ContextMenu":{"id":"UI22","category":"common-ui"},"StudyLandscapes":{"id":"SC01","category":"observatory-scene"},"ObservatoryWorld":{"id":"SC02","category":"observatory-scene"},"ObservatoryRoom":{"id":"SC03","category":"observatory-scene"},"ObservatoryDesk":{"id":"SC04","category":"observatory-scene"},"ObservatoryAdvanced":{"id":"SC05","category":"observatory-scene"},"ObservatorySkyDetails":{"id":"SC06","category":"observatory-scene"},"ObservatoryStationDetails":{"id":"SC07","category":"observatory-scene"},"ObservatoryTimeSky":{"id":"SC08","category":"observatory-scene"},"ObservatoryTimeGround":{"id":"SC09","category":"observatory-scene"},"ObservatoryClouds":{"id":"SC10","category":"observatory-scene"},"ObservatoryGroundDetails":{"id":"SC11","category":"observatory-scene"},"ObservatoryDomeTiles":{"id":"SC12","category":"observatory-scene"},"ObservatoryShockwave":{"id":"SC13","category":"observatory-scene"},"ObservatoryStudySky":{"id":"SC14","category":"observatory-scene"},"ObservatoryStudyStation":{"id":"SC15","category":"observatory-scene"},"ObservatoryRadiance":{"id":"SC16","category":"observatory-scene"},"ObservatoryRadianceGround":{"id":"SC17","category":"observatory-scene"},"ObservatoryEvents":{"id":"SC18","category":"observatory-scene"},"ObservatoryEventVariationSymbol":{"id":"SC19","category":"observatory-scene"},"ObservatoryEventVariation":{"id":"SC20","category":"observatory-scene"},"BusyDots":{"id":"MO01","category":"motion"},"SavedMark":{"id":"MO02","category":"motion"},"SelectionBackground":{"id":"MO03","category":"motion"},"NoticeEntrance":{"id":"MO04","category":"motion"},"FadeContent":{"id":"MO05","category":"motion"},"BrandWordmark":{"id":"BR01","category":"brand"}};
function validateRegistry(items,allowMinimal=false){if(!Array.isArray(items)||items.length>48)throw new Error('Registry must be a unique subset of 48 source components.');const names=new Set(),ids=new Set();for(const item of items){const expected=validRegistry[item?.name];if(!expected||item.id!==expected.id||!item.figmaName||(!allowMinimal&&item.category!==expected.category)||names.has(item.name)||ids.has(item.id))throw new Error('Invalid or duplicate registry entry: '+String(item?.name));names.add(item.name);ids.add(item.id);}return items;}
if(!foundations)throw new Error('Provide verified foundations.');validateRegistry(registry);
const reviewRegistry=INPUT.finalizeReview?validateRegistry(INPUT.allRegistry||registry,true):[];
if(INPUT.finalizeReview&&reviewRegistry.length!==48)throw new Error('Final review requires all 48 unique entries.');
const page = await figma.getNodeByIdAsync(INPUT.pageId || foundations.pages?.components || '7:70');
if (!page || page.type !== 'PAGE') throw new Error('Component page not found.');
await figma.setCurrentPageAsync(page);
await figma.loadFontAsync({family:'Noto Sans KR'});
await figma.loadFontAsync({family:'JetBrains Mono',style:'Regular'});
const font = foundations.fonts.font, boldFont = foundations.fonts.boldFont;
const styles = foundations.textStyles, assets = INPUT.assets || {};
const wholeWorldScenes=['StudyLandscapes','ObservatoryWorld','ObservatoryRoom'];
for(const item of registry)if(wholeWorldScenes.includes(item.name)&&(assets.sceneMockups?.[item.name]||assets.sceneSvgs?.[item.name]))throw new Error(item.name+' WHOLE_WORLD_PATH_REQUIRED: SC01–SC03 keep native pause/settings and external frame/sill through the shared whole-world path. Provide assets.worldAssetId or assets.worldMockup instead of a per-scene image/SVG.');
const preflightWorldAsset=assets.worldAssetId?await figma.getNodeByIdAsync(assets.worldAssetId):page.findOne(n=>n.type==='COMPONENT'&&n.name==='Observatory/v2/__Asset/OriginalObservatory');
if(assets.worldAssetId&&(!preflightWorldAsset||preflightWorldAsset.type!=='COMPONENT'))throw new Error('worldAssetId must identify an existing component.');
async function validateSceneMockup(mockup,label){
 if(!mockup||typeof mockup.imageHash!=='string'||!mockup.imageHash.trim())throw new Error(label+' IMAGE_UPLOAD_REQUIRED: upload the complete scene PNG with upload_assets and provide its imageHash; legacy SVG-only input cannot create native scene layers.');
 if(!Number.isFinite(mockup.width)||!Number.isFinite(mockup.height)||mockup.width<=0||mockup.height<=0)throw new Error(label+' MOCKUP_BOUNDS_REQUIRED');
 if(mockup.fileKey&&figma.fileKey&&mockup.fileKey!==figma.fileKey)throw new Error(label+' IMAGE_FILE_MISMATCH');
 const image=figma.getImageByHash(mockup.imageHash);if(!image)throw new Error(label+' IMAGE_HASH_NOT_FOUND: finish upload_assets in the current file first.');
 const pixels=await image.getSizeAsync();if(!(pixels.width>0&&pixels.height>0)||Math.abs(pixels.width/pixels.height/(mockup.width/mockup.height)-1)>0.001)throw new Error(label+' IMAGE_BOUNDS_MISMATCH: keep the whole source aspect ratio.');
}
function owningPage(node){let current=node;while(current&&current.type!=='PAGE')current=current.parent;return current;}
async function validateWorldAsset(asset){
 if(!asset||asset.type!=='COMPONENT'||asset.name!=='Observatory/v2/__Asset/OriginalObservatory'||owningPage(asset)?.id!==page.id||(assets.worldAssetId&&asset.id!==assets.worldAssetId))throw new Error('WORLD_ASSET_ID_MISMATCH: reuse the original named whole-world component on the verified component page.');
 if(assets.worldMockup&&(assets.worldMockup.width!==960||assets.worldMockup.height!==400))throw new Error('WHOLE_SCENE_REQUIRED: supplied whole-world image metadata keeps logical 960x400 bounds.');
 if(Math.abs(asset.width-960)>0.01||Math.abs(asset.height-400)>0.01)throw new Error('WHOLE_SCENE_REQUIRED: the original master keeps complete logical 960x400 bounds.');
 // Current project budget is zero/one descendant: a direct IMAGE fill or one IMAGE rectangle.
 // A legacy vector/contract master must be replaced separately, retaining its original ID.
 if(asset.children.length>1)throw new Error('RASTER_MIGRATION_REQUIRED: this original master still contains native scene layers. Preserve its ID and prepare one image before creating more instances.');
 let art=asset;
 if(asset.children.length===1){art=asset.children[0];if(art.type!=='RECTANGLE'||Math.abs(art.width-960)>0.01||Math.abs(art.height-400)>0.01||art.x!==0||art.y!==0)throw new Error('RASTER_MIGRATION_REQUIRED: only an uncropped 960x400 IMAGE rectangle may be copied as the whole world.');}
 if(!Array.isArray(art.fills)||art.fills.length!==1||art.fills[0].type!=='IMAGE'||!['FIT','FILL'].includes(art.fills[0].scaleMode))throw new Error('RASTER_MIGRATION_REQUIRED: a COMPONENT type or source-contract diagram alone is not a safe image master.');
 await validateSceneMockup({imageHash:art.fills[0].imageHash,width:960,height:400,fileKey:assets.worldMockup?.fileKey},'Existing original world '+asset.id);
 if(assets.worldMockup?.imageHash&&art.fills[0].imageHash!==assets.worldMockup.imageHash)throw new Error('WORLD_IMAGE_HASH_MISMATCH: keep the current original master and read back its prepared image before reuse.');
}
// Fail an incomplete scene batch before tokens, icons or components are created.
if(preflightWorldAsset&&(assets.worldAssetId||registry.some(item=>wholeWorldScenes.includes(item.name))||(INPUT.finalizeReview&&reviewRegistry.some(item=>wholeWorldScenes.includes(item.name)))))await validateWorldAsset(preflightWorldAsset);
for(const item of registry){
 if(item.category!=='observatory-scene'||page.findOne(n=>(n.type==='COMPONENT'||n.type==='COMPONENT_SET')&&n.name==='Observatory/v2/'+item.figmaName))continue;
 const mockup=assets.sceneMockups?.[item.name];
 if(mockup||assets.sceneSvgs?.[item.name])await validateSceneMockup(mockup,item.name);
 else if(wholeWorldScenes.includes(item.name)){
  if(preflightWorldAsset)await validateWorldAsset(preflightWorldAsset);
  else if(assets.worldSvg||assets.worldMockup){await validateSceneMockup(assets.worldMockup,'OriginalObservatory');if(assets.worldMockup.width!==960||assets.worldMockup.height!==400)throw new Error('WHOLE_SCENE_REQUIRED: the original world mockup keeps logical 960x400 bounds.');}
 }
}
const collections = {};
for (const [name,id] of Object.entries(foundations.collections)) collections[name] = await figma.variables.getVariableCollectionByIdAsync(id);
if (!collections.material || !collections.primitives) throw new Error('Foundation collections missing.');
const paperMode = foundations.modes.find(m=>m.name==='Paper').modeId;
const interiorMode = foundations.modes.find(m=>m.name==='Interior').modeId;
const variables = {};
const entries = Object.entries(foundations.variables);
const resolved = await Promise.all(entries.map(([,v])=>figma.variables.getVariableByIdAsync(v.id)));
entries.forEach(([name],i)=>{if(!resolved[i])throw new Error('Missing foundation variable '+name);variables[name]=resolved[i];});
const rgb = value => {const h=value.replace('#','');return {r:parseInt(h.slice(0,2),16)/255,g:parseInt(h.slice(2,4),16)/255,b:parseInt(h.slice(4,6),16)/255};};
const track = node => {created.add(node.id);return node;};
// Lossless ledger: group numeric ID suffixes into ranges; every created ID is recoverable.
function encodeNodeIds(values){const ids=[...new Set(values)],byPrefix=new Map(),literal=[];for(const id of ids){const m=/^(.*:)(0|[1-9]\d*)$/.exec(id);if(!m||!Number.isSafeInteger(Number(m[2]))){literal.push(id);continue;}const list=byPrefix.get(m[1])||[];list.push(Number(m[2]));byPrefix.set(m[1],list);}const groups=[];for(const [prefix,values]of byPrefix){const n=[...new Set(values)].sort((a,b)=>a-b),runs=[];for(let i=0;i<n.length;){let end=i;while(end+1<n.length&&n[end+1]===n[end]+1)end++;runs.push(end===i?n[i]:[n[i],n[end]]);i=end+1;}groups.push([prefix,runs]);}return {encoding:'figma-id-ranges-v1',count:ids.length,groups,literal};}
function exportedRegistry(){return Object.fromEntries(Object.entries(registryMap).map(([name,e])=>[name,{id:e.id,name:e.name,source:e.source,ownerId:e.ownerId,defaultComponentId:e.defaultComponentId,variantIds:e.variantIds,variants:e.variants,propertyIds:e.propertyIds,representation:e.representation}]));}

function trackTree(node) {track(node);if('children' in node)for(const child of node.children)trackTree(child);return node;}
const px = (node,field,key) => {if(!variables[key])throw new Error('Unknown metric '+key);node.setBoundVariable(field,variables[key]);};
const paint = key => {if(!variables[key])throw new Error('Unknown paint '+key);return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',variables[key]);};
const fill = (node,role) => {node.fills=role?[paint(role.includes('/')?role:'material/'+role)]:[];};
const stroke = (node,role='borderInteractive',width='border/width') => {node.strokes=[paint(role.includes('/')?role:'material/'+role)];px(node,'strokeWeight',width);};
const safeX=Math.max(0,...page.children.map(n=>n.x+n.width))+160;
let mainY=100;
const namespace='Observatory/v2/';
// Existing functional semantics, not a new decorative error color.
async function ensureFunctionalTokens(){
 const locals=await figma.variables.getLocalVariablesAsync();
 const make=(name,c,values,scopes,syntax)=>{let v=locals.find(v=>v.name===name&&v.variableCollectionId===c.id);if(!v){v=figma.variables.createVariable(name,c,'COLOR');locals.push(v);variableIds.push(v.id);}v.scopes=scopes;v.setVariableCodeSyntax('WEB',`var(${syntax})`);for(const [mode,value] of Object.entries(values))v.setValueForMode(mode,value);const criteriaSuffix=(v.description||'').match(/\n+\[OS 조건부 기준\][\s\S]*$/)?.[0]||'';v.description='Existing src/ui/tokens.css functional role, reused for v2 components; no new learning meaning.'+criteriaSuffix;variables[name]=v;return v;};
 const value=collections.primitives.modes[0].modeId;
 const light=make('primitive/functional/errorText-paper',collections.primitives,{[value]:rgb('#b91c1c')},[],'--primitive-common-error-700');
 const dark=make('primitive/functional/errorText-interior',collections.primitives,{[value]:rgb('#fee2e2')},[],'--primitive-common-error-100');
 const solid=make('primitive/functional/errorSolid',collections.primitives,{[value]:rgb('#dc2626')},[],'--primitive-common-error-600');
 make('functional/errorText',collections.material,{[paperMode]:{type:'VARIABLE_ALIAS',id:light.id},[interiorMode]:{type:'VARIABLE_ALIAS',id:dark.id}},['TEXT_FILL','STROKE_COLOR'],'--color-danger');
 make('functional/errorSolid',collections.material,{[paperMode]:{type:'VARIABLE_ALIAS',id:solid.id},[interiorMode]:{type:'VARIABLE_ALIAS',id:dark.id}},['STROKE_COLOR'],'--color-field-invalid');
}
function layout(node,direction='VERTICAL',width=336,padding=16,gap=8){
 node.layoutMode=direction;node.resize(width,48);node.primaryAxisSizingMode=direction==='HORIZONTAL'?'FIXED':'AUTO';node.counterAxisSizingMode=direction==='HORIZONTAL'?'AUTO':'FIXED';node.counterAxisAlignItems='MIN';node.primaryAxisAlignItems='MIN';node.clipsContent=false;
 for(const f of ['paddingTop','paddingBottom','paddingLeft','paddingRight'])px(node,f,'space/'+padding);
 px(node,'itemSpacing','space/'+gap);px(node,'cornerRadius','radius/control');return node;
}
function frame(parent,name,direction='VERTICAL',width=336,padding=0,gap=8,role=null){const n=track(figma.createAutoLayout(direction));n.name=name;layout(n,direction,width,padding,gap);fill(n,role);parent.appendChild(n);return n;}
async function text(parent,content,width,style='Body',role='text',name='Text'){
 const n=track(figma.createText());n.name=name;n.fontName=font;n.characters=content;await n.setTextStyleIdAsync(styles[style]);n.textAutoResize='HEIGHT';n.resize(Math.max(width,20),n.height);fill(n,role);parent.appendChild(n);return n;
}
function rect(parent,name,w,h,role='subtle'){const n=track(figma.createRectangle());n.name=name;n.resize(w,h);fill(n,role);parent.appendChild(n);return n;}
function instance(parent,component,name){const n=trackTree(component.createInstance());n.name=name||component.name;parent.appendChild(n);return n;}
function mode(node,value='Paper'){node.setExplicitVariableModeForCollection(collections.material,value==='Interior'?interiorMode:paperMode);}
function component(name,width=336,padding=16,gap=8){const n=track(figma.createComponent());n.name=name;layout(n,'VERTICAL',width,padding,gap);fill(n,'surface');mode(n);page.appendChild(n);return n;}
function focusRing(node){stroke(node,'focus','focus/width');node.strokeAlign='OUTSIDE';}
function property(owner,name,type,value,nodes,field='characters'){const id=owner.addComponentProperty(name,type,value);for(const n of nodes)n.componentPropertyReferences={...(n.componentPropertyReferences||{}),[field]:id};return id;}
const icons={};
function vector(parent,name,data,role='text'){const v=trackTree(figma.createNodeFromSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="${data}" fill="none" stroke="#000" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`));v.name=name;for(const n of v.findAllWithCriteria({types:['VECTOR']})){if(n.fills.length)n.fills=[paint('material/'+role)];if(n.strokes.length)n.strokes=[paint('material/'+role)];}parent.appendChild(v);return v;}
async function buildIcons(){
 for(const [name,path] of Object.entries({arrow:'M3 10 L17 10 M11 4 L17 10 L11 16',search:'M8 2 A6 6 0 1 1 7.99 2 M12 12 L18 18',check:'M3 10 L8 15 L17 4',close:'M4 4 L16 16 M16 4 L4 16',more:'M3 10 L4 10 M9 10 L10 10 M15 10 L16 10'})){
  const existing=page.findOne(n=>n.type==='COMPONENT'&&n.name===namespace+'__Icon/'+name);
  if(existing){icons[name]=existing;continue;}
  const c=component(namespace+'__Icon/'+name,20,0,0);c.clearExplicitVariableModeForCollection(collections.material);c.resize(20,20);c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';fill(c,null);vector(c,name,path);c.description='20px source-compatible utility icon geometry; instance-swap helper, not a separate product feature.';c.x=safeX+1660;c.y=mainY;mainY+=44;icons[name]=c;
 }
}
async function buttonContent(c,state,kind='secondary',iconOnly=false){
 c.layoutMode='HORIZONTAL';c.counterAxisAlignItems='CENTER';c.primaryAxisAlignItems='CENTER';c.resize(iconOnly?44:208,48);c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';px(c,'minHeight',iconOnly?'control/icon-target':'control/height');
 for(const f of ['paddingTop','paddingBottom'])px(c,f,'space/8');for(const f of ['paddingLeft','paddingRight'])px(c,f,'space/'+(iconOnly?8:16));
 const primary=kind==='primary',danger=kind==='danger',disabled=state==='disabled';
 fill(c,primary?(state==='hover'?'primaryHover':state==='pressed'?'primaryPressed':'primary'):state==='hover'||state==='pressed'?'subtle':kind==='quiet'?null:'surface');
 if(!primary&&kind!=='quiet')stroke(c,danger?'functional/errorText':'borderInteractive');else c.strokes=[];
 if(state==='focus')focusRing(c);
 const role=disabled?'muted':primary?'onPrimary':danger?'functional/errorText':'text';
 let label=null,icon=null;
 if(iconOnly){icon=instance(c,icons.more,'Icon');for(const n of icon.findAllWithCriteria({types:['VECTOR']}))n.strokes=[paint(role.includes('/')?role:'material/'+role)];}
 else {if(state==='busy'){const dots=frame(c,'Progress','HORIZONTAL',20,0,4);for(let i=0;i<3;i++)rect(dots,'Dot '+(i+1),3,3,role);}label=await text(c,kind==='danger'?'삭제':state==='busy'?'저장 중':'기록 저장',state==='busy'?138:176,'Label',role,'Label');label.textAlignHorizontal='CENTER';}
 if(state==='pressed'){for(const child of c.children)if(child.type==='TEXT')child.relativeTransform=[[1,0,child.x],[0,1,child.y+1]];}
 return {[state==='busy'?'BusyLabel':kind==='danger'?'DangerLabel':'Label']:label?[label]:[],Icon:icon?[icon]:[]};
}
async function fieldContent(c,name,state){
 const label=await text(c,name==='Search'?'자료 찾기':name==='Textarea'?'메모':'공부할 주제',304,'Label','text','Label');
 const box=frame(c,'Control',name==='Textarea'?'VERTICAL':'HORIZONTAL',304,12,8,state==='readOnly'?'subtle':'surface');box.counterAxisAlignItems='CENTER';stroke(box,state==='invalid'?'functional/errorSolid':'borderInteractive');px(box,'minHeight','control/height');
 if(state==='focus')focusRing(box);
 if(name==='Search')instance(box,icons.search,'Search icon');
 const value=await text(box,state==='empty'?'내용을 입력해 주세요':name==='Textarea'?'조건이 바뀌면 결과가 달라지는 이유를 적어 둡니다.\n내가 생각한 예외와 다음에 확인할 점도 남깁니다.':name==='Search'?'수식':'미분의 의미',name==='Search'?248:name==='Select'?248:280,'Body',state==='disabled'?'muted':state==='empty'?'muted':'text','Value');
 if(name==='Textarea')box.minHeight=144;
 if(name==='Select'){const icon=instance(box,icons.arrow,'Open options');icon.rotation=90;}
 const hint=await text(c,state==='invalid'?'입력한 내용은 유지됩니다. 필요한 값을 확인해 주세요.':state==='readOnly'?'읽기 전용 · 내용을 선택해서 복사할 수 있습니다.':'필요한 만큼 적고, 나중에 이어서 수정할 수 있습니다.',304,'Caption',state==='invalid'?'functional/errorText':'muted','Hint');
 return {Label:[label],[state==='empty'?'Placeholder':'Value']:[value],[state==='invalid'?'Error':state==='readOnly'?'ReadOnlyNotice':'Hint']:[hint]};
}
async function choiceContent(c,name,value,state){
 c.layoutMode='HORIZONTAL';c.counterAxisAlignItems='CENTER';c.resize(304,48);c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';
 const marker=name==='Radio'?track(figma.createEllipse()):track(figma.createRectangle());marker.name='Selection mark';marker.resize(20,20);fill(marker,value==='unchecked'?'surface':'primary');stroke(marker,'borderInteractive');c.appendChild(marker);if(state==='focus')focusRing(marker);
 if(value==='checked'&&name==='Checkbox'){const mark=instance(c,icons.check,'Checked indicator');mark.layoutPositioning='ABSOLUTE';mark.x=16;mark.y=14;for(const n of mark.findAllWithCriteria({types:['VECTOR']}))n.strokes=[paint('material/onPrimary')];}
 if(value==='mixed'){const bar=rect(c,'Mixed indicator',10,2,'onPrimary');bar.layoutPositioning='ABSOLUTE';bar.x=21;bar.y=23;}
 if(value==='checked'&&name==='Radio'){const dot=track(figma.createEllipse());dot.resize(8,8);fill(dot,'onPrimary');c.appendChild(dot);dot.layoutPositioning='ABSOLUTE';dot.x=22;dot.y=20;}
 const label=await text(c,name==='Radio'?'현재 과목':'이 공부를 시도했어요',244,'Body',state==='disabled'?'muted':'text','Label');return {Label:[label]};
}
async function smallButton(parent,label,kind='secondary',width=140){const n=frame(parent,label,'HORIZONTAL',width,12,8,kind==='primary'?'primary':'surface');n.counterAxisAlignItems='CENTER';n.primaryAxisAlignItems='CENTER';px(n,'minHeight','control/height');if(kind!=='primary')stroke(n);const t=await text(n,label,width-24,'Label',kind==='primary'?'onPrimary':'text','Label');t.textAlignHorizontal='CENTER';return n;}
async function genericContent(c,name,state){
 const refs={};const add=async(key,content,style='Body',role='text',width=304)=>{const n=await text(c,content,width,style,role,key);(refs[key]??=[]).push(n);return n;};
 if(name==='Tabs'||name==='SegmentedControl'){
  c.layoutMode='HORIZONTAL';c.resize(336,56);c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';for(const f of ['paddingTop','paddingBottom','paddingLeft','paddingRight'])px(c,f,'space/4');px(c,'itemSpacing','space/4');
  for(const [i,label] of ['오늘','기록','전체'].entries()){const item=frame(c,'Item '+i,'VERTICAL',106,8,4,i===(state==='second'?1:0)?'selected':null);px(item,'minHeight','control/height');const t=await text(item,label,90,'Label','text','Item label');t.textAlignHorizontal='CENTER';(refs['Item '+(i+1)]??=[]).push(t);if(i===(state==='second'?1:0)&&name==='Tabs')rect(item,'Current underline',90,2,'primary');}return refs;
 }
 if(name==='Card'){await add('Title','이어서 생각할 질문','Heading');await add('Body','입력한 글·예외·수정 이력을 한곳에서 읽습니다.');const line=rect(c,'Group boundary',304,1,'borderDecorative');await add('Detail','지금 남긴 생각은 다음 공부의 출발점이 됩니다.','Caption','muted');return refs;}
 if(name==='ListItem'){c.layoutMode='HORIZONTAL';const mark=rect(c,'Leading indicator',4,48,'primary');const content=frame(c,'Item content','VERTICAL',264,0,4);const title=await text(content,'미분의 의미',264,'Label','text','Title');const detail=await text(content,'어제 남긴 메모에서 이어서 보기',264,'Caption','muted','Detail');refs.Title=[title];refs.Detail=[detail];return refs;}
 if(name==='Modal'||name==='Sheet'){
  px(c,'cornerRadius','radius/dialog');stroke(c,'borderInteractive');await add('Title',name==='Modal'?'기록을 닫기 전에':'자료를 곁에 펼치기','Heading');await add('Body',name==='Modal'?'지금 작성한 내용은 유지됩니다. 저장 상태를 확인한 뒤 돌아갈 수 있습니다.':'선택한 자료를 보면서 하던 공부를 이어갑니다.');
  if(name==='Sheet'){const paper=frame(c,'Reading region','VERTICAL',304,16,8,'subtle');await text(paper,'강의 자료\n조건 · 정의 · 예외',272,'Body');}
  const actions=frame(c,'Actions','HORIZONTAL',304,0,8);await smallButton(actions,'돌아가기');await smallButton(actions,'저장','primary');return refs;
 }
 if(name==='Toast'){c.layoutMode='HORIZONTAL';c.counterAxisAlignItems='CENTER';stroke(c,'borderDecorative');const t=await text(c,'이 기기에 저장했어요.',220,'Body','text','Message');refs.Message=[t];const action=await text(c,state==='undo'?'되돌리기':'닫기',60,'Label','text','Action');refs[state==='undo'?'UndoLabel':'CloseLabel']=[action];return refs;}
 if(name==='Breadcrumb'){c.layoutMode='HORIZONTAL';for(const [i,label] of ['자료 책장','미적분','미분의 의미'].entries()){const t=await text(c,label,i===2?104:64,'Caption',i===2?'text':'muted','Crumb '+i);refs['Crumb '+i]=[t];if(i<2)await text(c,'›',12,'Caption','muted');}return refs;}
 if(name==='NavigationBar'){c.layoutMode=state==='vertical'?'VERTICAL':'HORIZONTAL';if(state!=='vertical')c.resize(352,64);for(const [i,label] of ['공부 책상','자료 책장','탐구 작업대','기록·계획 벽'].entries()){const item=frame(c,'Place '+i,'VERTICAL',state==='vertical'?304:72,4,4,i===0?'selected':null);const t=await text(item,label,state==='vertical'?296:64,'Label','text','Place label');refs['Place '+i]=[t];if(i===0)rect(item,'Current indicator',state==='vertical'?296:64,2,'primary');}return refs;}
 if(name==='ContextMenu'){stroke(c,'borderInteractive');for(const [i,label] of ['이름 바꾸기','사본 만들기','삭제'].entries()){const item=frame(c,label,'HORIZONTAL',304,8,8,i===0?'selected':null);px(item,'minHeight','control/height');const t=await text(item,label,288,'Label',i===2?'functional/errorText':'text','Command');refs['Command '+i]=[t];}return refs;}
 if(name==='EmptyState'){const icon=instance(c,icons.search,'Find next subject');await add(state==='filtered'?'NoResultsTitle':'Title',state==='filtered'?'찾는 자료가 없습니다.':'공부할 주제를 골라 주세요.','Heading');await add(state==='filtered'?'NoResultsMessage':'Message',state==='filtered'?'검색어를 바꾸거나 선택한 조건을 지워 보세요.':'자료를 선택하면 이 자리에서 기록을 이어갈 수 있습니다.','Body','muted');await smallButton(c,state==='filtered'?'검색 조건 지우기':'자료 찾기','primary',180);return refs;}
 if(name==='LoadingState'){const dots=frame(c,'Progress','HORIZONTAL',48,0,8);for(let i=0;i<3;i++)rect(dots,'Dot '+i,6,6,'primary');await add('Message','불러오고 있습니다.');return refs;}
 if(name==='ErrorState'||name==='ScreenBoundary'){stroke(c,'functional/errorSolid');await add('Title',name==='ScreenBoundary'?'화면을 다시 열어 주세요.':'저장하지 못했어요.','Heading');await add('Message',name==='ScreenBoundary'?'이 화면을 표시하는 중 문제가 생겼습니다.':'입력한 내용은 유지됩니다. 연결을 확인하고 다시 시도해 주세요.','Body','functional/errorText');await smallButton(c,'다시 시도','secondary',144);return refs;}
 throw new Error('Unimplemented common component '+name);
}
function variantsFor(name){
 if(name==='Button')return ['primary','secondary','quiet','danger'].flatMap(Kind=>['default','hover','pressed','focus','disabled','busy'].map(State=>({Kind,State})));
 if(name==='IconButton')return ['default','hover','pressed','focus','disabled','busy'].map(State=>({State}));
 if(['Input','Textarea'].includes(name))return ['empty','default','focus','disabled','invalid','readOnly'].map(State=>({State}));
 if(name==='Select')return ['default','focus','disabled','invalid'].map(State=>({State}));
 if(name==='Search')return ['empty','default','focus','invalid'].map(State=>({State}));
 if(name==='Checkbox')return ['unchecked','checked','mixed'].flatMap(Value=>['default','focus','disabled'].map(State=>({Value,State})));
 if(name==='Radio')return ['unchecked','checked'].flatMap(Value=>['default','focus','disabled'].map(State=>({Value,State})));
 if(['Tabs','SegmentedControl'].includes(name))return ['first','second'].map(Selection=>({Selection}));
 if(name==='NavigationBar')return ['horizontal','vertical'].map(Orientation=>({Orientation}));
 if(name==='EmptyState')return ['initial','filtered'].map(Scenario=>({Scenario}));
 if(name==='Toast')return ['close','undo'].map(Action=>({Action}));
 return [{State:'default'}];
}
function propertiesFromRefs(owner,refSets){const keys=new Set(refSets.flatMap(r=>Object.keys(r)));const result={};for(const key of keys){const nodes=refSets.flatMap(r=>r[key]||[]);if(!nodes.length)continue;if(key==='Icon'){result.Icon=property(owner,'Icon','INSTANCE_SWAP',icons.more.id,nodes,'mainComponent');}else result[key]=property(owner,key,'TEXT',nodes[0].characters,nodes);}return result;}
function placeOwner(owner,variants){
 if(owner.type==='COMPONENT_SET'){const cols=variants.length>6?4:Math.min(3,variants.length),maxW=Math.max(...variants.map(c=>c.width)),maxH=Math.max(...variants.map(c=>c.height));variants.forEach((c,i)=>{c.x=24+(i%cols)*(maxW+24);c.y=24+Math.floor(i/cols)*(maxH+24);});owner.resize(48+cols*maxW+(cols-1)*24,48+Math.ceil(variants.length/cols)*maxH+(Math.ceil(variants.length/cols)-1)*24);owner.fills=[];owner.clipsContent=false;}
 owner.x=safeX+1600;owner.y=mainY;mainY+=owner.height+64;
}
function propertyIdsFrom(owner){return Object.fromEntries(Object.entries(owner.componentPropertyDefinitions).filter(([,value])=>value.type!=='VARIANT').map(([key])=>[key.split('#')[0],key]));}
function infoFor(owner,item,variants,propertyIds,representation='native interactive-design specimen'){
 propertyIds={...propertyIdsFrom(owner),...propertyIds};
 return {id:item.id,name:item.name,source:item.source,role:item.role,ownerId:owner.id,ownerType:owner.type,defaultComponentId:variants[0].id,variantIds:variants.map(c=>c.id),variants:variants.map(c=>({id:c.id,name:c.name,properties:c.variantProperties||{},width:c.width,height:c.height})),propertyIds,representation};
}
async function buildCommon(item){
 const configs=variantsFor(item.name),variants=[],refs=[];
 for(const config of configs){const c=component(Object.entries(config).map(([k,v])=>k+'='+v).join(', '));let r;const state=config.State||config.Selection||config.Orientation||config.Scenario||config.Action||'default';
  if(item.name==='Button'||item.name==='IconButton')r=await buttonContent(c,state,config.Kind||'quiet',item.name==='IconButton');
  else if(['Input','Textarea','Select','Search'].includes(item.name))r=await fieldContent(c,item.name,state);
  else if(['Checkbox','Radio'].includes(item.name))r=await choiceContent(c,item.name,config.Value,state);
  else r=await genericContent(c,item.name,state);
  variants.push(c);refs.push(r);
 }
 const owner=variants.length>1?track(figma.combineAsVariants(variants,page)):variants[0];owner.name=namespace+item.figmaName;owner.description=`${item.role}\nSource: ${item.source}\n${item.behavior||item.conditions||''}\nTarget: observatory v2 materials. Native Figma design states do not implement storage, ARIA, keyboard or server behavior.`;
 const props=propertiesFromRefs(owner,refs);placeOwner(owner,variants);return infoFor(owner,item,variants,props);
}
async function svg(parent,source,name,width){const n=trackTree(figma.createNodeFromSvg(source));n.name=name;if(!(n.width>0))throw new Error('SVG has zero width: '+name);n.rescale(width/n.width);parent.appendChild(n);return n;}
let worldAsset=preflightWorldAsset;
if(assets.worldAssetId&&(!worldAsset||worldAsset.type!=='COMPONENT'))throw new Error('worldAssetId must identify an existing component.');
async function originalWorld(parent,width){
 if(!worldAsset){
  worldAsset=page.findOne(n=>n.type==='COMPONENT'&&n.name===namespace+'__Asset/OriginalObservatory');
  if(!worldAsset){await validateSceneMockup(assets.worldMockup,'OriginalObservatory');worldAsset=component(namespace+'__Asset/OriginalObservatory',960,0,0);await sceneImage(worldAsset,assets.worldMockup,'Original whole scene / image mockup',960);worldAsset.description='Original complete 0 -100 960 400 scene as one image mockup. Source SVG and actual webapp rendering/behavior remain unchanged; no crop or inferred learning result. Shared asset imported once.';worldAsset.x=safeX+1660;worldAsset.y=mainY;mainY+=worldAsset.height+64;}
 }
 await validateWorldAsset(worldAsset);
 const use=instance(parent,worldAsset,'Original whole widget');use.rescale(width/use.width);return use;
}
const sceneContracts={
 StudyLandscapes:['기록·사용자 설정','전체 풍경 + 제어','정지 / 표시 / 설정 저장'],ObservatoryWorld:['world · sky · events','원본 SVG 합성','viewBox 전체 · 비율 2.4'],ObservatoryRoom:['원본 위젯 전체','바깥 창틀 · 창턱','8 / 4px · 가림 0px'],ObservatoryDesk:['정적인 원본 벡터','책 · 종이 · 조명','조작 영역과 겹치지 않음'],ObservatoryAdvanced:['world · night · camera','SVG / WebGL · LOD','장면 밖 정지 · 해제'],ObservatorySkyDetails:['evolution','원본 하늘 세부','렌더러 값 유지'],ObservatoryStationDetails:['evolution','원본 건물 세부','밖의 천문대 = 나'],ObservatoryTimeSky:['KST 시각','아침 → 낮 → 노을 → 밤','장식 시간 · 실제 천문 아님'],ObservatoryTimeGround:['sky','같은 시간의 지면','종이·본문 테마 유지'],ObservatoryClouds:['evolution','원본 픽셀 구름','기존 주기·밀도'],ObservatoryGroundDetails:['원본 고정 도형','지면 세부','독립 학습 의미 없음'],ObservatoryDomeTiles:['원본 건물','돔 타일 레이어','도형 재설계 없음'],ObservatoryShockwave:['echo','기존 반응 파동','새 점수·보상 아님'],ObservatoryStudySky:['관측된 활동','기존 하늘 반응','숙달·능력 추정 아님'],ObservatoryStudyStation:['관측된 활동','기존 건물 반응','미기록을 실패로 취급하지 않음'],ObservatoryRadiance:['world','기존 하늘 광원','작업면 글자 glow 없음'],ObservatoryRadianceGround:['world','기존 지면 반응광','장식 반응만 변경'],ObservatoryEvents:['events · sky','실제 선택된 장식 현상','sky / ground'],ObservatoryEventVariationSymbol:['event · children','SVG symbol 원형','한번 정의 · 재사용'],ObservatoryEventVariation:['event · index · symbolId','SVG use 인스턴스','기존 variant / phase']
};
async function sceneImage(parent,mockup,name,width){
 await validateSceneMockup(mockup,name);
 const art=track(figma.createRectangle());art.name=name;art.resize(width,width*mockup.height/mockup.width);art.fills=[{type:'IMAGE',scaleMode:'FIT',imageHash:mockup.imageHash}];art.strokes=[];parent.appendChild(art);return art;
}
async function buildScene(item){
 if(wholeWorldScenes.includes(item.name)&&(assets.sceneMockups?.[item.name]||assets.sceneSvgs?.[item.name]))throw new Error(item.name+' WHOLE_WORLD_PATH_REQUIRED: use the shared original world so native controls and external frame/sill are retained.');
 const c=component(namespace+item.figmaName,480,16,12);mode(c,'Interior');const provided=assets.sceneMockups?.[item.name];let representation,props={};
 if(provided){await sceneImage(c,provided,'Source image mockup / '+item.name,448);representation='One image mockup of the complete source scene; the actual webapp renderer and interactions remain in the source implementation.';}
 else if(wholeWorldScenes.includes(item.name)&&(assets.worldMockup||worldAsset)){
  if(item.name==='StudyLandscapes'){const controls=frame(c,'Existing widget controls','HORIZONTAL',448,0,8);await smallButton(controls,'풍경 멈추기', 'secondary',144);await smallButton(controls,'풍경 설정','secondary',144);}
  if(item.name==='ObservatoryRoom'){const outer=frame(c,'External frame — no crop','VERTICAL',448,8,0,'subtle');await originalWorld(outer,432);rect(c,'External sill',448,8,'subtle');}
  else await originalWorld(c,448);
  representation='Existing complete world component reused, with its original ID and instances preserved. Static design reference; actual webapp controls/rendering remain in the implementation.';
 }else{
  const contract=sceneContracts[item.name];const head=await text(c,contract[1],448,'Heading','text','Role');
  const pipeline=frame(c,'Source contract','HORIZONTAL',448,0,8);const input=frame(pipeline,'Input','VERTICAL',200,12,8,'subtle');await text(input,'입력',176,'Caption','muted');await text(input,contract[0],176,'Body');instance(pipeline,icons.arrow,'Data relationship');const output=frame(pipeline,'Output','VERTICAL',208,12,8,'subtle');await text(output,'표현 조건',184,'Caption','muted');await text(output,contract[2],184,'Body');
  // A contract representation, not invented replacement artwork. Structure differs by renderer role.
  if(item.name.includes('Time')){const row=frame(c,'Time samples','HORIZONTAL',448,0,4);for(const label of ['아침','낮','노을','밤']){const phase=frame(row,label,'VERTICAL',109,8,4,'surface');await text(phase,label,93,'Caption');}}
  if(item.name==='ObservatoryAdvanced'){const row=frame(c,'Rendering alternatives','HORIZONTAL',448,0,8);for(const label of ['SVG 기본','GPU 가능','축소·복구']){const cell=frame(row,label,'VERTICAL',144,8,4,'surface');await text(cell,label,128,'Caption');}}
  if(item.name==='ObservatoryEventVariationSymbol'||item.name==='ObservatoryEventVariation'){const row=frame(c,'Reuse structure','HORIZONTAL',448,0,8);for(const label of item.name.endsWith('Symbol')?['symbol 원형','공유 정의']:['use 1','use 2','use n']){const cell=frame(row,label,'VERTICAL',136,8,4,'surface');await text(cell,label,120,'Code');}}
  props.Role=property(c,'Role','TEXT',head.characters,[head]);representation='Native source-contract diagram only; source image mockup not supplied. Actual webapp functionality remains in its implementation.';warnings.push({name:item.name,limitation:'Prepared source image absent; lightweight source-contract diagram supplied. No native SVG fallback.'});
 }
 const foot=await text(c,item.role,448,'Caption','muted','Purpose');props.Purpose=property(c,'Purpose','TEXT',foot.characters,[foot]);c.description=`${item.role}\nSource: ${item.source}\n${item.props||''}\n${item.states||''}\n${representation}\nEntire widget, manual pause, preferences and original learning semantics preserved.`;placeOwner(c,[c]);return infoFor(c,item,[c],props,representation);
}
async function buildMotion(item){
 const variants=[],refs=[];
 for(const State of ['rest','active','reduced']){const c=component('State='+State,280,16,12);const area=frame(c,'Motion visual','HORIZONTAL',248,12,8,'subtle');area.counterAxisAlignItems='CENTER';area.minHeight=64;
  if(item.name==='BusyDots'){for(let i=0;i<3;i++){const dot=rect(area,'Dot '+i,6,6,'primary');dot.opacity=State==='active'?(i===1?1:.45):1;}}
  if(item.name==='SavedMark'){const mark=instance(area,icons.check,'Acknowledged save');mark.opacity=State==='rest'?0:1;await text(area,'저장했어요.',188,'Body');}
  if(item.name==='SelectionBackground'){for(const [i,label] of ['오늘','전체'].entries()){const segment=frame(area,label,'VERTICAL',108,8,4,i===(State==='active'?1:0)?'selected':null);await text(segment,label,92,'Label');}}
  if(item.name==='NoticeEntrance'||item.name==='FadeContent'){const n=await text(area,item.name==='NoticeEntrance'?'입력한 내용은 유지됩니다.':'이어서 공부할 내용',224,'Body');n.opacity=State==='rest'?.9:1;}
  const label=await text(c,item.currentMotion,248,'Caption','muted','Motion contract');refs.push({Contract:[label]});variants.push(c);
 }
 const set=track(figma.combineAsVariants(variants,page));set.name=namespace+item.figmaName;set.description=`${item.role}\nSource: ${item.source}\n${item.currentMotion}\n${item.conditions}\nState samples only. No automatic loop or save-success claim without acknowledgment.`;const properties=propertiesFromRefs(set,refs);placeOwner(set,variants);return infoFor(set,item,variants,properties,'Native before/after/reduced state specimen; runtime timeline retained in description.');
}
async function buildBrand(item){const c=component(namespace+item.figmaName,420,16,8);let representation;if(assets.brandAssetId){const original=await figma.getNodeByIdAsync(assets.brandAssetId);if(!original||original.type!=='COMPONENT')throw new Error('brandAssetId must identify an existing component.');const use=instance(c,original,'Original outlined wordmark');use.rescale(388/use.width);representation='Existing original outlined SVG component reused; geometry preserved.';}else if(assets.brandSvg){const art=await svg(c,assets.brandSvg,'Original outlined wordmark',388);representation='Original outlined SVG, geometry preserved.';for(const n of art.findAll(n=>'fills' in n&&n.type!=='TEXT'))if(Array.isArray(n.fills)&&n.fills.length)n.fills=[paint('material/text')];}else{await text(c,'ManSeekSong OS',388,'Title','text','Asset reference');await text(c,'원본 outlined SVG 연결 대상',388,'Caption','muted');representation='Asset reference only; original brandSvg not supplied.';warnings.push({name:item.name,limitation:'Provide assets.brandSvg to use the exact existing wordmark.'});}c.description=`${item.role}\nSource: ${item.source}\nAsset: ${item.assetSource}\n${item.conditions}\n${representation}`;placeOwner(c,[c]);return infoFor(c,item,[c],{},representation);}
async function reviewCard(parent,entry){const card=frame(parent,entry.name,'VERTICAL',512,16,12,'surface');mode(card);await text(card,entry.id+' · '+entry.name,480,'Heading');const main=await figma.getNodeByIdAsync(entry.defaultComponentId);const use=instance(card,main,'Reusable instance');if(use.width>480)throw new Error('Review specimen exceeds native-width allocation: '+entry.name);await text(card,entry.role,480,'Caption','muted');if(entry.representation.includes('contract diagram'))await text(card,'하위 도형: 원본 소스 계약 표본',480,'Caption','muted');return card;}
let review=null;
try{
 await ensureFunctionalTokens();await buildIcons();
 for(const item of registry){
  const existing=page.findOne(n=>(n.type==='COMPONENT'||n.type==='COMPONENT_SET')&&n.name===namespace+item.figmaName);
  if(existing){const variants=existing.type==='COMPONENT_SET'?[...existing.children]:[existing];registryMap[item.name]=infoFor(existing,item,variants,{},'Existing source-mapped component reused; consult original property definitions.');continue;}
  registryMap[item.name]=item.category==='common-ui'?await buildCommon(item):item.category==='observatory-scene'?await buildScene(item):item.category==='motion'?await buildMotion(item):await buildBrand(item);
 }
 if(INPUT.finalizeReview){
  for(const item of reviewRegistry){if(registryMap[item.name])continue;const owner=page.findOne(n=>(n.type==='COMPONENT'||n.type==='COMPONENT_SET')&&n.name===namespace+item.figmaName);if(!owner)throw new Error('Missing component for final review: '+item.name);const variants=owner.type==='COMPONENT_SET'?[...owner.children]:[owner];const representation=owner.description.includes('source-contract diagram')?'Native source-contract diagram only.':'Existing native source-mapped component';registryMap[item.name]=infoFor(owner,{...item,role:item.role||item.name},variants,{},representation);}
  review=page.findOne(n=>n.type==='FRAME'&&n.name==='Components / v2 / Review');
  if(!review){review=frame(page,'Components / v2 / Review','VERTICAL',1648,32,24,'canvas');mode(review,'Interior');review.x=safeX;review.y=100;await text(review,'천문대 OS · 공통 부품',1584,'Title');await text(review,'48개 코드 대응 · 원본 위젯 전체 · 종이 작업면 · 상태와 복귀',1584,'Body','muted');for(let i=0;i<reviewRegistry.length;i+=3){const row=frame(review,'Row '+(i/3+1),'HORIZONTAL',1584,0,24);for(const item of reviewRegistry.slice(i,i+3))await reviewCard(row,registryMap[item.name]);}}
 }
 const common=Object.values(registryMap).filter(x=>x.id.startsWith('UI'));
 const usable=Object.fromEntries(Object.entries({button:'Button',input:'Input',textarea:'Textarea',panel:'Card',modal:'Modal',sheet:'Sheet',world:'ObservatoryWorld',room:'ObservatoryRoom',wordmark:'BrandWordmark'}).filter(([,name])=>registryMap[name]).map(([key,name])=>[key,registryMap[name].defaultComponentId]));
 return {status:'created',createdNodeIds:encodeNodeIds(created),mutatedNodeIds:encodeNodeIds(mutated),createdVariableIds:variableIds,registryMap:exportedRegistry(),usable,icons:Object.fromEntries(Object.entries(icons).map(([k,n])=>[k,n.id])),sharedWorldAssetId:worldAsset?.id||null,review:review?{id:review.id,width:review.width,height:review.height}:null,counts:{registry:Object.keys(registryMap).length,common:common.length,variants:Object.values(registryMap).reduce((s,e)=>s+e.variantIds.length,0)},warnings,finalizedReview:!!INPUT.finalizeReview,scope:'Native component/state and source-contract representation; root validates rendered review and records downstream prototype behavior.'};
}catch(error){return {status:'partial-error',error:String(error),createdNodeIds:encodeNodeIds(created),mutatedNodeIds:encodeNodeIds(mutated),createdVariableIds:variableIds,registryMap:exportedRegistry(),reviewId:review?.id||null,warnings,recovery:'Read the returned nodes before retry. Existing exact component names are reused; partial unnamed variants require inspection, never blind deletion.'};}
