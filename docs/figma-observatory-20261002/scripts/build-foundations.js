// Async use_figma body. INPUT comes from the current canonical baseline and ledger.
// Collection pattern adapted from figma-generate-library/scripts/createVariableCollection.js.
const affected = [];
const pageIds = {};
// IDs from the verified ledger survive user page renames/reordering. Preflight the
// whole plan before creating pages; an invalid explicit ID never falls back to a name.
const pagePlan = [];
for (const item of INPUT.pages) {
  const requestedIds = [item.id, item.pageId, INPUT.pageIds?.[item.key], INPUT.ledger?.pages?.[item.key], INPUT.foundations?.pages?.[item.key]].filter(value => value != null);
  if (requestedIds.some(value => typeof value !== 'string' || !value) || new Set(requestedIds).size > 1) throw new Error('PAGE_ID_CONFLICT: ' + item.key);
  const id = requestedIds[0];
  let p = id ? await figma.getNodeByIdAsync(id) : null;
  if (id && (!p || p.type !== 'PAGE' || p.parent?.id !== figma.root.id)) throw new Error('PAGE_ID_MISMATCH: ' + item.key + ' / ' + id);
  if (!id) {
    const matches = figma.root.children.filter(node => node.type === 'PAGE' && node.name === item.name);
    if (matches.length > 1) throw new Error('PAGE_NAME_AMBIGUOUS: provide the verified page ID for ' + item.key);
    p = matches[0] || null;
  }
  if (!p && item.allowCreate !== true) throw new Error('PAGE_CREATE_REQUIRES_EXPLICIT: provide a verified ID or allowCreate:true for ' + item.key);
  pagePlan.push({item, page:p});
}
for (const entry of pagePlan) {
  let p = entry.page;
  if (!p) { p = figma.createPage(); p.name = entry.item.name; affected.push(p.id); }
  pageIds[entry.item.key] = p.id;
}
const page = await figma.getNodeByIdAsync(pageIds.foundations);
await figma.setCurrentPageAsync(page);
await figma.loadFontAsync({family:'Noto Sans KR'});
await figma.loadFontAsync({family:'JetBrains Mono',style:'Regular'});
const axes = await figma.getFontFamilyVariationAxes('Noto Sans KR');
const font = {family:'Noto Sans KR',style:'Regular'};
const boldFont = {family:'Noto Sans KR',style:'Regular',variationSettings:{wght:600}};
if (!axes || !axes.some(a => (typeof a === 'string' ? a : a.tag) === 'wght')) {
  throw new Error('Noto Sans KR variable weight axis must be checked before creating typography.');
}
const hex = s => {let v=s.slice(1);return {r:parseInt(v.slice(0,2),16)/255,g:parseInt(v.slice(2,4),16)/255,b:parseInt(v.slice(4,6),16)/255,a:v.length===8?parseInt(v.slice(6,8),16)/255:1};};
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const local = await figma.variables.getLocalVariablesAsync();
const collection = (name,modes) => {let c=collections.find(c=>c.name===name);if(!c){c=figma.variables.createVariableCollection(name);c.renameMode(c.modes[0].modeId,modes[0]);for(const m of modes.slice(1))c.addMode(m);collections.push(c);}return c;};
const primitives = collection('Observatory / Primitives',['Value']);
const material = collection('Observatory / Material',['Interior','Paper']);
const metric = collection('Observatory / Metrics',['Value']);
const variables = {};
function variable(name,c,type,values,scopes,syntax) {
  let v=local.find(v=>v.name===name&&v.variableCollectionId===c.id);
  if(!v){v=figma.variables.createVariable(name,c,type);local.push(v);}
  v.scopes=scopes; v.setVariableCodeSyntax('WEB',`var(${syntax})`);
  for(const [modeName,value] of Object.entries(values)) v.setValueForMode(c.modes.find(m=>m.name===modeName).modeId,value);
  const criteriaSuffix=(v.description||'').match(/\n+\[OS 조건부 기준\][\s\S]*$/)?.[0]||'';
  v.description='천문대 v2 설계 기준. docs/figma-observatory-20261002/design-tokens.css 대응. 생산 소비 여부는 별도 확인.'+criteriaSuffix;
  variables[name]=v;return v;
}
const roleScope = role => /text|muted|onPrimary|selectedText/i.test(role)?['TEXT_FILL']:/border/i.test(role)?['STROKE_COLOR']:/focus/.test(role)?['STROKE_COLOR']:['FRAME_FILL','SHAPE_FILL'];
for(const [mat,colors] of Object.entries(INPUT.materials)) for(const [role,value] of Object.entries(colors)) variable(`primitive/${mat}/${role}`,primitives,'COLOR',{Value:hex(value)},[],`--obs-${mat}-${role}`);
for(const role of Object.keys(INPUT.materials.interior)) variable(`material/${role}`,material,'COLOR',Object.fromEntries(['Interior','Paper'].map(mode=>[mode,{type:'VARIABLE_ALIAS',id:variables[`primitive/${mode.toLowerCase()}/${role}`].id}])),roleScope(role),`--obs-material-${role}`);
for(const n of INPUT.metrics.space.pxAt16) variable(`space/${n}`,metric,'FLOAT',{Value:n},['GAP'],`--obs-space-${n}`);
for(const [name,value,scopes] of [['control/height',48,['WIDTH_HEIGHT']],['control/icon-target',44,['WIDTH_HEIGHT']],['border/width',1,['STROKE_FLOAT']],['focus/width',2,['STROKE_FLOAT']],['radius/control',0,['CORNER_RADIUS']],['radius/dialog',2,['CORNER_RADIUS']],['motion/feedback',120,[]],['motion/navigation',180,[]],['motion/reduced',0,[]]]) variable(name,metric,'FLOAT',{Value:value},scopes,`--obs-${name.replaceAll('/','-')}`);
const existingStyles=await figma.getLocalTextStylesAsync();const textStyles={};
for(const [name,size,weight,line] of [['Body',16,400,165],['Label',15,600,150],['Caption',14,400,160],['Heading',20,600,140],['Title',28,600,135],['TitleCompact',24,600,135],['Code',14,400,170]]){
 let s=existingStyles.find(s=>s.name===`Observatory/${name}`);if(!s)s=figma.createTextStyle();s.name=`Observatory/${name}`;s.fontName=name==='Code'?{family:'JetBrains Mono',style:'Regular'}:weight===600?boldFont:font;s.fontSize=size;s.lineHeight={unit:'PERCENT',value:line};textStyles[name]=s.id;
}
const paint = (color,role) => {const c=hex(color);let p={type:'SOLID',color:{r:c.r,g:c.g,b:c.b},opacity:c.a};return role?figma.variables.setBoundVariableForPaint(p,'color',variables[role]):p;};
function text(parent,content,width,style='Body',color='#34312B') {const n=figma.createText();n.fontName=font;n.characters=content;n.textStyleId=textStyles[style];n.fills=[paint(color)];n.textAutoResize='HEIGHT';n.resize(width,n.height);parent.appendChild(n);affected.push(n.id);return n;}
function frame(name,width,fill,padding=24){const f=figma.createAutoLayout('VERTICAL');f.name=name;f.resize(width,100);f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='FIXED';f.paddingTop=f.paddingBottom=f.paddingLeft=f.paddingRight=padding;f.itemSpacing=16;f.fills=[paint(fill)];f.clipsContent=false;affected.push(f.id);return f;}
const old=page.children.find(n=>n.name==='Foundations / v2');
let board=old;
if(!old){
 board=frame('Foundations / v2',1424,'#1F1E1B',32);board.x=100;board.y=100;page.appendChild(board);
 text(board,'천문대 OS · 기초와 재료',1360,'Title','#E8E3D7');
 text(board,'어두운 실내에서, 창밖의 나를 바라보며, 종이를 펼쳐 공부합니다.',1360,'Body','#B7B0A2');
 for(const [mat,colors] of Object.entries(INPUT.materials)){
  const sheet=frame(`Material / ${mat}`,1360,colors.surface);board.appendChild(sheet);
  text(sheet,mat==='interior'?'실내 · 방의 깊이와 금빛 조작':'종이 · 읽고 쓰는 불투명한 작업면',1312,'Heading',colors.text);
  for(let i=0;i<Object.entries(colors).length;i+=4){const row=figma.createAutoLayout('HORIZONTAL');row.fills=[];row.itemSpacing=16;affected.push(row.id);sheet.appendChild(row);
   for(const [role,value] of Object.entries(colors).slice(i,i+4)){const c=frame(role,316,colors.surface,12);row.appendChild(c);const r=figma.createRectangle();r.resize(292,56);r.fills=[paint(value,`primitive/${mat}/${role}`)];c.appendChild(r);affected.push(r.id);text(c,role,292,'Label',colors.text);text(c,value,292,'Caption',colors.muted);}
  }
 }
 const specimen=frame('Typography / source-matched',1360,'#E4DCCD');board.appendChild(specimen);
 for(const [role,sample] of [['Title','이어서 공부하기'],['Heading','오늘 펼칠 주제'],['Body','긴 한국어·수식·코드는 선명하게 읽고, 생각과 예외는 그대로 남깁니다.'],['Label','기록 저장'],['Caption','입력한 내용은 유지됩니다. 저장 상태를 확인해 주세요.'],['Code','const keepDraft = true;']])text(specimen,sample,1312,role);
 const rules=frame('Geometry / interaction',1360,'#E4DCCD');board.appendChild(rules);
 text(rules,'공통 치수와 상호작용',1312,'Heading');
 text(rules,'본문 16px · 조작 48px · 아이콘 터치 44px · 경계 1px · 초점 2px / 간격 3px\n여백 0 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px\n버튼·입력·탭·패널 반경 0px · 창 2px · 종이 회전/질감/글자 흐림 0\n위젯 원본 전체 + 바깥 창틀 8px / 좁은 면 4px · 가림 0px\n피드백 120ms · 자리 전환 180ms · 움직임 감소 0ms · 소리 기본 꺼짐',1312);
 text(rules,'현재 기준값은 고급 기술과 실제 사용 결과에 따라 근거를 남겨 조정합니다. 개인 설정·초안·원문·개인 배치와 학습 의미를 보존합니다.',1312,'Caption');
}
return {createdNodeIds:affected,pages:pageIds,collections:{primitives:primitives.id,material:material.id,metrics:metric.id},modes:material.modes,variables:Object.fromEntries(Object.entries(variables).map(([k,v])=>[k,{id:v.id,type:v.resolvedType,scopes:v.scopes}])),textStyles,fonts:{font,boldFont,axes},board:{id:board.id,width:board.width,height:board.height},fontReadback:board.findAllWithCriteria({types:['TEXT']}).slice(0,5).map(n=>({id:n.id,font:n.fontName,weight:n.fontWeight}))};
