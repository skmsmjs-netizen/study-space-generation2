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

const states=INPUT.states, transitions=INPUT.transitions;
if(!Array.isArray(states) || states.length!==42 || new Set(states.map(s=>s.id)).size!==42)throw new Error('Expected exactly 42 unique state contracts');
if(!Array.isArray(transitions) || transitions.length!==32)throw new Error('Expected exactly 32 transition contracts');
for(const t of transitions)if(!states.some(s=>s.id===t.from)||!states.some(s=>s.id===t.to))throw new Error('Unresolved state transition '+t.from+' → '+t.to);
const runName=INPUT.rootName || '실패와 복귀 · 42상태 / 32전이';
if(page.children.some(n=>n.name===runName))throw new Error('Existing state board detected; inspect before retrying to avoid duplicates');
await figma.setCurrentPageAsync(page);
const overview=box(page,runName,1200,{padding:40,gap:20});overview.x=originX;overview.y=originY;
text(overview,'ManSeekSong OS  /  조작 · 보존 · 복귀',1120,14,true,'muted');
text(overview,'상태가 달라져도\n글과 돌아갈 자리는 남는다',1120,36,true);
text(overview,'42개 상태는 현재 저장·권한·복구 계약을 대표 UI로 표현한다. 32개 연결은 조건이 충족될 때의 설계 시연이며 실제 저장·서버 호출을 실행하지 않는다.',1120,18);
text(overview,'각 카드: 대표 화면 → 허용 행동 → 보존 조건 → 근거 → 조건부 전이. 화면 속 예시는 상태 설계용이며 사용자 원문이 아니다. 별도 기술 주석을 일반 사용 화면의 상시 안내로 옮기지 않는다.',1120,15,false,'muted');
const stateFrames={}, stateNodes={}, previewNodes={}, actionNodes={}, transitionNodes=[], prototypeFailures=[];
const groups=[['save','저장과 충돌'],['auth','로그인과 이용 권한'],['edit','편집과 초안'],['backup','보관본과 복원'],['ai','민석 전용 AI'],['content','자료와 표현 복귀']];
const groupHeaders=[];
function smallPanel(parent,title,body,width){const n=box(parent,title,width,{padding:16,gap:8,fill:'subtle'});text(n,title,width-32,15,true);text(n,body,width-32,15);return n;}
function inputLine(parent,label,value,width){const n=box(parent,label,width,{padding:14,gap:4,fill:'surface'});text(n,label,width-28,12,true,'muted');text(n,value,width-28,16);return n;}
function draft(parent,width,extra=''){inputLine(parent,'공부 기록','보존할 글의 예시입니다.\n이유와 조건을 자유롭게 이어 적습니다.'+(extra?'\n'+extra:''),width);}
function preview(parent,s,width){
 const n=box(parent,'대표 UI · '+s.id,width,{padding:20,gap:16,fill:'canvas'}),w=width-40;
 text(n,s.group==='ai'?'오른쪽 탐구 작업대':s.group==='backup'||s.group==='auth'?'계정 · 설정 · 복구':'내 공부 공간',w,12,true,'muted');
 text(n,s.representative_copy,w,20,true);
 if(s.group==='save'){
  if(s.id==='SAVE-CONFLICT'){const row=box(n,'양본 비교',w,{padding:0,gap:12,horizontal:true,clear:true,border:false});smallPanel(row,'이 기기의 글','기기에서 편집한 원문\n선택 전까지 보존',(w-12)/2);smallPanel(row,'서버의 글','서버에서 확인한 원문\n선택 전까지 보존',(w-12)/2);}
  else if(s.id==='SAVE-ARCHIVING')smallPanel(n,'전환 전에 보관','이 기기의 글  →  보관\n서버 자료  →  보관\n양쪽 보관 확인 후 전환',w);
  else {draft(n,w);const labels={'SAVE-CHECKING':'기기 표시  →  서버 확인 중','SAVE-LOCAL-WRITING':'작성 내용  →  기기 보관 중','SAVE-PENDING':'기기 보관됨  →  전송 대기','SAVE-SAVING':'기기 보관됨  →  서버 저장 중','SAVE-SAVED':'기기 보관됨  →  서버 반영 확인','SAVE-ERROR':'기기 원문 있음  /  서버 저장 실패','SAVE-LOCAL-ERROR':'작성 내용 있음  /  기기 보관 실패'};smallPanel(n,'저장 상태',labels[s.id],w);}
 }else if(s.group==='auth'){
  if(s.id==='AUTH-SIGNED-OUT'){inputLine(n,'이메일','이메일을 입력해 주세요',w);inputLine(n,'비밀번호','비밀번호를 입력해 주세요',w);}
  else if(s.id==='AUTH-EXPIRED'){smallPanel(n,'다시 로그인','편집하던 글 보관 상태를 확인합니다.\n로그인 후 같은 공부 위치로 돌아갑니다.',w);}
  else {const values={'AUTH-CHECKING':'계정 세션 확인 중\n이용 권한 확인 중','AUTH-PENDING':'가입 요청됨\n공부 공간 이용 승인 대기','AUTH-APPROVED':'공부 기록 이용 허용\nAI 권한은 소유자 확인에 따름','AUTH-REJECTED':'공부 공간 접근 허용되지 않음\n다른 계정 자료를 표시하지 않음','AUTH-SUSPENDED':'공부 공간 접근 중지\n자료를 임의 삭제하지 않음'};smallPanel(n,'현재 계정',values[s.id],w);}
 }else if(s.group==='edit'){
  draft(n,w,s.id==='EDIT-DIRTY'?'작성 위치를 유지합니다.':'');
  if(s.id==='EDIT-OTHER-WINDOW')smallPanel(n,'다른 창 확인','이 창에서 자동 덮어쓰지 않습니다.\n원문을 보관할 경로를 제공합니다.',w);
  if(s.id==='EDIT-RESTORED-DRAFT')smallPanel(n,'보관된 초안','다른 세션의 글을 읽고 직접 선택합니다.\n현재 편집 내용에 자동 적용하지 않습니다.',w);
 }else if(s.group==='backup'){
  const values={'BACKUP-COLLECTING':'원문 · 기록 · 설정 확인 중\n포함할 원본을 모읍니다.','BACKUP-PREPARED':'백업 파일 준비됨\n다운로드 완료 여부와 구별합니다.','BACKUP-INVALID':'파일 구조 또는 소유자 확인 실패\n현재 기기 자료 유지','BACKUP-PREVIEW':'현재 계정 · 대상 공간\n포함한 원문 / 기록 / 설정 범위 확인','BACKUP-WAITING-RESTART':'복원 요청 보관됨\n앱을 다시 열어 적용','BACKUP-RECOVERING':'복원 전 보관본 확인\n중단 지점과 원자료 확인','BACKUP-RESTORED':'기기 복원 자료 확인\n서버 반영 여부는 별도 확인','BACKUP-ROLLED-BACK':'복원을 마치지 못함\n기존 공간을 여는 경로 유지','BACKUP-MISSING-ORIGINAL':'필요한 원본이 이 기기에 없음\n원본을 받은 후 다시 시도','BACKUP-OWNER-CHANGED':'현재 계정과 백업의 계정 확인\n다른 소유자의 자료를 합치지 않음'};
  smallPanel(n,s.id==='BACKUP-PREVIEW'?'복원할 내용 확인':'보관본 상태',values[s.id],w);
  if(s.id==='BACKUP-PREVIEW')inputLine(n,'명시적 확인','범위와 원문을 확인한 뒤 복원합니다.',w);
 }else if(s.group==='ai'){
  if(s.id==='AI-FORBIDDEN'){smallPanel(n,'일반 공부는 계속 사용할 수 있습니다','공부 기록 · 복습 · 수동 자료 저장\nAI 연결·키·사용량은 표시하지 않습니다.',w);}
  else {
   text(n,'민석 전용 · 서버 소유자 확인 필요',w,12,true,'muted');
   const values={'AI-OWNER-READY':'선택한 원문 확인\n연결과 예산을 확인한 뒤 요청','AI-GENERATING':'선택한 원문 보존\n생성 요청 처리 중','AI-PREVIEW':'원문과 생성 초안 비교\n수정한 뒤 선택 결과만 저장','AI-FAILED':'원문과 기존 결과 유지\n실패 원인 확인','AI-LIMIT':'설정한 호출·사용량 상한\n새 요청 시작 제한','AI-UNCERTAIN':'이전 요청의 응답과 비용 확인 중\n새 요청을 중복 생성하지 않음'};
   smallPanel(n,s.id==='AI-PREVIEW'?'생성 초안 · 확인 필요':'자료와 요청',values[s.id],w);
   if(s.id==='AI-PREVIEW'){const row=box(n,'원문과 초안',w,{padding:0,gap:12,horizontal:true,clear:true,border:false});smallPanel(row,'원문','사용자가 선택한 자료',(w-12)/2);smallPanel(row,'생성 초안','검토와 수정이 필요한 결과',(w-12)/2);}
  }
 }else{
  if(s.id==='CONTENT-NO-RESULT'){inputLine(n,'자료 찾기','입력한 검색어 · 선택한 조건',w);smallPanel(n,'결과 0개','검색 조건을 바꾸거나 기존 위치로 돌아갑니다.',w);}
  else if(s.id==='CONTENT-EMPTY')smallPanel(n,'아직 기록이 없습니다','현재 과업의 첫 기록을 남길 수 있습니다.\n없음을 실패나 0점으로 환산하지 않습니다.',w);
  else if(s.id==='CONTENT-ERROR')smallPanel(n,'불러올 수 없습니다','기존 선택과 위치를 유지하고 다시 시도합니다.',w);
  else if(s.id==='CONTENT-UNAVAILABLE')smallPanel(n,'사용 가능한 경로','현재 환경에서 가능한 읽기와 편집을 제공합니다.',w);
  else if(s.id==='RENDER-FALLBACK')smallPanel(n,'차분한 기본 표현','정면 공부 책상 · 왼쪽 자료 책장\n오른쪽 탐구 작업대 · 뒤쪽 기록·계획 벽\n작업면과 자료 접근을 유지합니다.',w);
  else smallPanel(n,'정지한 천문대','하늘과 빛은 정지한 상태로 유지합니다.\n입력·읽기·저장은 그대로 사용할 수 있습니다.',w);
 }
 return n;
}
for(const s of states){
 const card=box(page,'상태 '+s.id+' · '+s.title,800,{padding:28,gap:18});const w=744;
 text(card,s.id+'  /  '+s.title,w,24,true);
 text(card,'설계용 대표 화면 · 아래 내용은 사용자 원문이 아닌 예시',w,12,false,'muted');
 const mock=preview(card,s,w);previewNodes[s.id]=mock.id;
 text(card,'허용 행동',w,13,true,'muted');actionNodes[s.id]=[];
 for(let i=0;i<s.actions.length;i++){const a=action(card,s.actions[i],w,i===0 && !/기다리기|유지/.test(s.actions[i]));actionNodes[s.id].push(a.id);}
 field(card,'보존 조건',s.invariant,w);
 text(card,'현재 계약  '+s.runtime_reference+'\n근거  '+s.basis.join(' · '),w,12,false,'muted');
 text(card,'출처 '+s.source_ids.join(' · ')+'  |  설계 페이지 '+s.figma_page_keys.join(' / '),w,12,false,'muted');
 stateFrames[s.id]=card;stateNodes[s.id]=card.id;
}
const flows=box(page,'전이 목록 · 32개의 조건과 실제 상태 링크',1200,{padding:32,gap:24});
text(flows,'조건을 만족할 때 다음 상태로 이동한다',1136,30,true);
text(flows,'시연 링크는 Figma 화면 이동만 수행한다. 서버 확인·저장·권한 검사·복원 완료를 대신하지 않는다.',1136,16,false,'muted');
let prototypeCount=0;
for(let i=0;i<transitions.length;i++){
 const t=transitions[i],id='T'+String(i+1).padStart(2,'0');
 const card=box(flows,id+' '+t.from+' → '+t.to,1136,{padding:24,gap:12});
 text(card,id+'  '+t.event,1088,20,true);
 link(card,'출발: '+t.from+' · '+states.find(s=>s.id===t.from).title,1088,stateNodes[t.from],'NODE');
 field(card,'전이 조건',t.guard,1088);
 const dest=link(card,'도착: '+t.to+' · '+states.find(s=>s.id===t.to).title,1088,stateNodes[t.to],'NODE');
 const trigger=action(stateFrames[t.from],'설계 시연 '+id+' · '+t.event+' → '+t.to,744,false);
 text(stateFrames[t.from],'시연 조건: '+t.guard,744,12,false,'muted');
 let connected=false;
 try{await trigger.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:stateNodes[t.to],navigation:'NAVIGATE',transition:null,resetScrollPosition:true}]}]);connected=true;prototypeCount++;}
 catch(error){prototypeFailures.push({id,from:t.from,to:t.to,error:String(error)});link(stateFrames[t.from],'대상 상태 직접 열기',744,stateNodes[t.to],'NODE');}
 transitionNodes.push({id,from:t.from,to:t.to,flowNodeId:card.id,triggerNodeId:trigger.id,destinationLinkNodeId:dest.id,destinationNodeId:stateNodes[t.to],prototypeConnected:connected});
}
const startY=overview.y+overview.height+64;
for(let gi=0;gi<groups.length;gi++){
 const [key,label]=groups[gi];const h=box(page,'분류 · '+label,800,{padding:24,gap:8,fill:'primary',border:false});h.x=originX+gi*860;h.y=startY;
 text(h,label,752,26,true,'onPrimary');text(h,states.filter(s=>s.group===key).length+'개 상태',752,15,false,'onPrimary');groupHeaders.push(h);
 let y=h.y+h.height+24;
 for(const s of states.filter(s=>s.group===key)){const f=stateFrames[s.id];f.x=h.x;f.y=y;y+=f.height+32;}
}
flows.x=originX+groups.length*860;flows.y=startY;
return {status:'created',pageId:page.id,rootId:overview.id,stateCount:Object.keys(stateNodes).length,transitionCount:transitionNodes.length,prototypeCount,prototypeFailures,stateNodes,previewNodes,actionNodes,transitionNodes,createdNodeIds,mutatedNodeIds,affectedIds:[...new Set([...createdNodeIds,...mutatedNodeIds])],topLevelBounds:[overview,...groupHeaders,...Object.values(stateFrames),flows].map(bounds),warnings,runtimeVerification:'Figma 상태 시연; 앱 저장·서버 권한·복원·AI 호출 시험을 실행하지 않음'};
