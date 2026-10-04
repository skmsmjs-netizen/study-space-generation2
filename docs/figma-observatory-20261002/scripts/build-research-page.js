// Async BODY for Figma use_figma. The caller prefixes const INPUT = {...}.
// No file/network reads; only the designated page is changed. No app implementation is implied.
if (!INPUT || !INPUT.pageId) throw new Error('INPUT.pageId is required');
const page = await figma.getNodeByIdAsync(INPUT.pageId);
if (!page || page.type !== 'PAGE') throw new Error('Target must be an existing PAGE');
const available = await figma.listAvailableFontsAsync();
const regular = INPUT.font || {family:'Noto Sans KR',style:'Regular'};
const strong = INPUT.boldFont || regular;
for (const f of [regular,strong]) {
  if (!available.some(x => x.fontName.family === f.family && x.fontName.style === f.style)) throw new Error('Unavailable font: '+f.family+' '+f.style);
}
await Promise.all([figma.loadFontAsync(regular),figma.loadFontAsync(strong)]);
const createdNodeIds = [], mutatedNodeIds = [page.id], warnings = [];
const p = INPUT.palette?.light || INPUT.palette || {};
const fallback = {canvas:'#F1ECE1',surface:'#FFFAF0',subtle:'#EEE3C9',text:'#302D32',muted:'#625B56',borderDecorative:'#B8AC91',borderInteractive:'#827564',focus:'#2B6E9F',primary:'#1E1B4B',onPrimary:'#FFFFFF'};
const variables = {};
for (const key of Object.keys(fallback)) {
  const spec = INPUT.colorVariableIds?.[key] || INPUT.variables?.['material/'+key];
  const id = typeof spec === 'string' ? spec : spec?.id;
  if (id) { const v = await figma.variables.getVariableByIdAsync(id); if(v && v.resolvedType === 'COLOR') variables[key] = v; }
}
function rgb(value) {
  if (value && typeof value === 'object' && typeof value.r === 'number') return {r:value.r,g:value.g,b:value.b};
  const hex = String(value).replace('#','');
  if (!/^[\da-f]{6}$/i.test(hex)) throw new Error('Expected six-digit hex color: '+value);
  return {r:parseInt(hex.slice(0,2),16)/255,g:parseInt(hex.slice(2,4),16)/255,b:parseInt(hex.slice(4,6),16)/255};
}
function paint(key) {
  const raw = {type:'SOLID',color:rgb(p[key] || fallback[key] || key)};
  return variables[key] ? figma.variables.setBoundVariableForPaint(raw,'color',variables[key]) : raw;
}
function track(n) { createdNodeIds.push(n.id); return n; }
function box(parent,name,width,options={}) {
  const n = track(figma.createAutoLayout(options.horizontal ? 'HORIZONTAL' : 'VERTICAL'));
  n.name=name; n.resize(width,1); n.itemSpacing=options.gap ?? 16;
  n.paddingTop=n.paddingBottom=options.padding ?? 24;
  n.paddingLeft=n.paddingRight=options.padding ?? 24;
  n.fills=options.clear ? [] : [paint(options.fill || 'surface')];
  n.strokes=options.border===false ? [] : [paint('borderDecorative')];
  n.strokeWeight=1; n.cornerRadius=0; n.clipsContent=false;
  parent.appendChild(n);
  n.layoutSizingHorizontal='FIXED'; n.layoutSizingVertical='HUG';
  if (INPUT.materialCollectionId && INPUT.materialModeId) n.setExplicitVariableModeForCollection(INPUT.materialCollectionId,INPUT.materialModeId);
  return n;
}
function text(parent,value,width,size=16,bold=false,color='text') {
  const n=track(figma.createText()); n.name=String(value).slice(0,90) || '텍스트';
  n.fontName=bold ? strong : regular; n.fontSize=size;
  n.lineHeight={unit:'PIXELS',value:Math.ceil(size*1.55)};
  n.fills=[paint(color)]; n.characters=String(value ?? '');
  n.textAutoResize='HEIGHT'; n.resize(width,Math.max(1,n.height));
  parent.appendChild(n); n.layoutSizingHorizontal='FIXED'; n.layoutSizingVertical='HUG';
  return n;
}
function field(parent,label,value,width) {
  const f=box(parent,label,width,{padding:0,gap:4,clear:true,border:false});
  text(f,label,width,12,true,'muted'); text(f,value || '—',width,16); return f;
}
function link(parent,label,width,target,type='URL') {
  const n=text(parent,label,width,14,false,'text');
  if (n.characters.length) n.setRangeHyperlink(0,n.characters.length,{type,value:target});
  return n;
}
function action(parent,label,width,primary=false) {
  const n=box(parent,'행동 · '+label,width,{padding:12,gap:0,fill:primary?'primary':'subtle'});
  text(n,label,width-24,15,true,primary?'onPrimary':'text'); return n;
}
function bounds(n) { return {id:n.id,name:n.name,x:n.x,y:n.y,width:n.width,height:n.height}; }
const existingRight = page.children.reduce((max,n)=>Math.max(max,n.x+n.width),0);
const originX = INPUT.originX ?? (page.children.length ? existingRight+160 : 80);
const originY = INPUT.originY ?? 80;

const entries=INPUT.entries, domains=INPUT.domains, artifacts=INPUT.artifacts || INPUT.figma_artifacts || [];
const batchPrefix=INPUT.batchPrefix || null;
const manifest=INPUT.manifest || {sourceCount:121,domainCount:20};
if(!Array.isArray(entries)||new Set(entries.map(e=>e.source_id)).size!==entries.length)throw new Error('Unique source entries required');
if(batchPrefix){if(!['D','F','Q','S'].includes(batchPrefix)||entries.some(e=>!e.source_id.startsWith(batchPrefix)))throw new Error('Invalid semantic batch');if(entries.length!==manifest.sourceCounts?.[batchPrefix])throw new Error('Incomplete source group');}
else if(entries.length!==121)throw new Error('Expected 121 sources or an explicit complete source-group batch');
if(!Array.isArray(domains)||domains.length!==20||new Set(domains.map(d=>d.id)).size!==20)throw new Error('Expected 20 domains');
if(manifest.sourceCount!==121||manifest.domainCount!==20)throw new Error('Manifest scope must remain 121/20');
const runName=INPUT.rootName || '연구 전수 대응 · 121출처 / 20영역';
const existingOverview=page.children.find(n=>n.name===runName);
if(INPUT.mode==='append'&&!existingOverview)throw new Error('Initialize the research overview first');
if(INPUT.mode!=='append'&&existingOverview)throw new Error('Research overview exists; use explicit append mode');
const groups=[['D','디자인 · UX'],['F','프론트엔드 · 표현 기술'],['Q','품질 · 저장 · 보안'],['S','사이트 · 설계 도구 · 스킬']];
const colName=prefix=>'출처군 '+prefix+' · '+groups.find(g=>g[0]===prefix)[1];
const selectedGroups=groups.filter(g=>!batchPrefix || g[0]===batchPrefix);
for(const [prefix] of selectedGroups)if(page.children.some(n=>n.name===colName(prefix)))throw new Error('Source group already exists: '+prefix);
for(const e of entries)for(const id of e.domain_ids || [])if(!domains.some(d=>d.id===id))throw new Error('Unknown domain '+id);
await figma.setCurrentPageAsync(page);
let overview=existingOverview;
const statusCounts=manifest.statusCounts || entries.reduce((a,e)=>(a[e.source_status]=(a[e.source_status]||0)+1,a),{});
if(!overview){
 overview=box(page,runName,1200,{padding:40,gap:20});overview.x=originX;overview.y=originY;
 text(overview,'ManSeekSong OS  /  천문대 설계 근거',1120,14,true,'muted');
 text(overview,'121개의 근거를\n20개의 설계 영역에 연결한다',1120,36,true);
 text(overview,'공식 기준·관행·도구·선행 사례를 구별하고, 각 항목의 선택 조건과 설계 적용 위치를 함께 남긴다. 조건부 항목은 도입 조건을 충족할 때 판단한다.',1120,18);
 text(overview,'전체 범위  121 출처 · 20 영역 · '+Object.entries(statusCounts).map(([k,v])=>k+' '+v).join(' / '),1120,16,true);
 const coverage=text(overview,'연결한 출처를 확인하고 있습니다.',1120,16,true);coverage.name='source-coverage';
 text(overview,'이 페이지는 설계 대응과 검증 주석이다. 라이브러리 설치, 서버 권한 적용, 저장·복원 시험, 실제 기기 확인을 완료했다는 뜻이 아니다. 기준값은 현재 기본값이며 기술·사용 결과에 따라 이유와 범위를 남겨 조정한다.',1120,16,false,'muted');
}
const baseX=overview.x,domainNodes={},artifactNodes={},sourceNodes={},sourceDetails={},sourceDomainLinks=[],domainFrames=[];
for(const d of domains){
 const a=artifacts.find(x=>x.id===d.artifact_id || x.domain_id===d.id);
 let card=page.children.find(n=>n.name==='영역 '+d.id+' · '+d.title);
 if(!card){
  if(INPUT.mode==='append')throw new Error('Missing existing domain '+d.id);
  card=box(page,'영역 '+d.id+' · '+d.title,580,{padding:24,gap:12});
  text(card,d.id+'  '+d.title,532,22,true);text(card,a?.title || '설계 산출물',532,17,true);
  field(card,'설계로 표현할 것',a?.deliverable || '관련 과업과 검증 주석 연결',532);
  field(card,'유지할 경계',a?.guardrail || '개별 출처의 조건과 한계를 유지한다.',532);
  text(card,'대응 페이지  '+(a?.figma_page_keys || []).join(' · '),532,13,false,'muted');
 }
 domainNodes[d.id]=card.id;if(a)artifactNodes[a.id]=card.id;domainFrames.push(card);
}
for(const [prefix,label] of selectedGroups){
 const gi=groups.findIndex(g=>g[0]===prefix),list=entries.filter(e=>e.source_id.startsWith(prefix));
 const col=box(page,colName(prefix),820,{padding:0,gap:24,clear:true,border:false});col.x=baseX+gi*868;
 const cap=box(col,'출처 분류',820,{padding:24,gap:8,fill:'primary',border:false});text(cap,label,772,28,true,'onPrimary');text(cap,list.length+'개 · 공식 링크와 개별 채택 조건',772,15,false,'onPrimary');
 for(const e of list){
  const card=box(col,e.source_id+' · '+e.name,820,{padding:28,gap:14});const w=764;
  text(card,e.source_id+'  /  '+e.source_status+'  /  '+e.source_category,w,12,true,'muted');text(card,e.name,w,24,true);
  field(card,'천문대 설계 적용',e.design_application,w);field(card,'근거가 말하는 범위',e.source_evidence,w);
  field(card,'선정 조건',e.selection,w);field(card,'보존할 한계',e.preserved_limits,w);
  const url=link(card,e.source_url,w,e.source_url);
  text(card,'출처 확인 '+e.source_checked+' · 대응 '+(e.figma_page_keys || []).join(' / ')+' · '+(e.representation || []).join(' / '),w,12,false,'muted');
  const refs=[];
  for(const did of e.domain_ids || []){const d=domains.find(x=>x.id===did);const n=link(card,'설계 영역 열기: '+did+' '+d.title,w,domainNodes[did],'NODE');refs.push(n.id);sourceDomainLinks.push({sourceId:e.source_id,domainId:did,linkNodeId:n.id,targetNodeId:domainNodes[did]});}
  if(e.state_contract_ids?.length)text(card,'연결 상태  '+e.state_contract_ids.join(' · '),w,12,false,'muted');
  sourceNodes[e.source_id]=card.id;sourceDetails[e.source_id]={nodeId:card.id,officialLinkNodeId:url.id,domainLinkNodeIds:refs,status:e.source_status};
 }
}
for(const d of domains){const card=domainFrames.find(n=>n.id===domainNodes[d.id]);for(const id of d.source_ids){if(sourceNodes[id])link(card,'출처 '+id+' · '+entries.find(e=>e.source_id===id).name,532,sourceNodes[id],'NODE');}mutatedNodeIds.push(card.id);}
const columns=groups.map(g=>page.children.find(n=>n.name===colName(g[0]))).filter(Boolean),allSourceNodes={};
for(const col of columns)for(const n of col.children){const match=n.name.match(/^([DFQS]\d{2}) · /);if(match)allSourceNodes[match[1]]=n.id;}
const coverage=overview.children.find(n=>n.name==='source-coverage');
if(coverage){coverage.characters='실제 노드 연결  '+Object.keys(allSourceNodes).length+' / 121 출처 · '+Object.keys(domainNodes).length+' / 20 영역';mutatedNodeIds.push(coverage.id,overview.id);}
let rowY=overview.y+overview.height+48;
for(let i=0;i<domainFrames.length;i+=2){const row=domainFrames.slice(i,i+2);for(let j=0;j<row.length;j++){row[j].x=baseX+j*620;row[j].y=rowY;}rowY+=Math.max(...row.map(n=>n.height))+28;}
for(const col of columns){col.y=rowY+64;mutatedNodeIds.push(col.id);}
if(Object.keys(allSourceNodes).length===121 && manifest.sourceIds && manifest.sourceIds.some(id=>!allSourceNodes[id]))throw new Error('Final source identity mismatch');
return {status:'created',pageId:page.id,rootId:overview.id,batchPrefix,sourceCount:Object.keys(sourceNodes).length,overallSourceCount:Object.keys(allSourceNodes).length,domainCount:Object.keys(domainNodes).length,statusCounts,sourceNodes,allSourceNodes,sourceDetails,domainNodes,artifactNodes,sourceDomainLinks,createdNodeIds,mutatedNodeIds:[...new Set(mutatedNodeIds)],affectedIds:[...new Set([...createdNodeIds,...mutatedNodeIds])],topLevelBounds:[overview,...domainFrames,...columns].map(bounds),warnings,runtimeVerification:'설계 산출물 생성; 앱 구현·실제 시험 완료를 주장하지 않음'};
