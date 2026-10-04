// Scoped adaptation of figma-generate-library/scripts/createDocumentationPage.js.
// Uses existing foundations page, paper aliases and Korean documentation fonts.
const page = await figma.getNodeByIdAsync('7:69');
await figma.setCurrentPageAsync(page);
const boardName = 'Paper Typography / 700 · 95% · 한글·영문';
if (page.children.some(n => n.name === boardName)) throw new Error('Read existing board before resuming.');
const fonts = [{family:'NanumMyeongjo',style:'Bold'},{family:'Noto Sans KR',style:'Regular'},{family:'Noto Sans KR',style:'Bold'},{family:'Inter',style:'Semi Bold'}];
await Promise.all(fonts.map(f=>figma.loadFontAsync(f)));
const ids=[], variableIds=[], styleIds=[], specimens=[];
const vars = await figma.variables.getLocalVariablesAsync();
const metrics = await figma.variables.getVariableCollectionByIdAsync('VariableCollectionId:7:80');
const mode='7:3';
function token(name,type,value,scopes,css){
  let v=vars.find(v=>v.variableCollectionId===metrics.id&&v.name===name);
  if(!v){v=figma.variables.createVariable(name,metrics,type);vars.push(v);}
  v.setValueForMode(mode,value);v.scopes=scopes;v.setVariableCodeSyntax('WEB','var('+css+')');
  v.description='2026-10-02 승인한 Figma 본문 기준. 앱 적용은 사용자 요청으로 대기.';
  variableIds.push(v.id);return v;
}
const weight=token('paper/type/weight','FLOAT',700,['FONT_WEIGHT'],'--observatory-paper-body-weight');
const family=token('paper/type/family','STRING','NanumMyeongjo',['FONT_FAMILY'],'--font-reading');
token('paper/type/glyph-scale-x','FLOAT',0.95,[],'--paper-body-glyph-scale-x');
token('paper/type/text-align','STRING','justify',[],'--paper-body-text-align');
token('paper/type/last-line','STRING','start',[],'--paper-body-last-line');
const styles=await figma.getLocalTextStylesAsync();
const roles=[['body','개념·지식 설명 / 펼친 paper',18,200,-5,600],['compact','좁은 본문 / paper',16,185,-2.5,352],['preview','미리보기 / 접힌 메모',14,185,-2.5,352],['memo','직접 쓰는 메모 / 자유 글',16,185,-2.5,352]];
const roleStyles={};
for(const [key,label,size,line,tracking] of roles){
 const sizeVar=token('paper/type/'+key+'/size','FLOAT',size,['FONT_SIZE'],key==='preview'?'--type-caption-size':key==='body'?'--type-subheading-size':'--input-font-size');
 const lineVar=token('paper/type/'+key+'/line-px','FLOAT',size*line/100,['LINE_HEIGHT'],'--paper-'+key+'-line-px');
 const trackingVar=token('paper/type/'+key+'/tracking-px','FLOAT',size*tracking/100,['LETTER_SPACING'],'--paper-'+key+'-tracking-px');
 const name='Observatory/Paper/'+key;
 let s=styles.find(s=>s.name===name);if(!s){s=figma.createTextStyle();styles.push(s);}
 s.name=name;s.fontName=fonts[0];s.fontSize=size;s.lineHeight={unit:'PIXELS',value:size*line/100};s.letterSpacing={unit:'PIXELS',value:size*tracking/100};
 s.description=label+' · KO/EN 공통 나눔명조700 · 장평95%는 조판 참조/보존 원본으로 표현 · justify/start는 텍스트 노드 속성';
 s.setBoundVariable('fontFamily',family);s.setBoundVariable('fontWeight',weight);s.setBoundVariable('fontSize',sizeVar);s.setBoundVariable('lineHeight',lineVar);s.setBoundVariable('letterSpacing',trackingVar);
 lineVar.setVariableCodeSyntax('WEB','calc(var('+(key==='preview'?'--type-caption-size':key==='body'?'--type-subheading-size':'--input-font-size')+') * var('+(key==='body'?'--observatory-paper-body-line':'--observatory-paper-body-compact-line')+'))');
 trackingVar.setVariableCodeSyntax('WEB','var('+(key==='body'?'--observatory-paper-body-tracking':'--observatory-paper-body-compact-tracking')+')');
 styleIds.push(s.id);roleStyles[key]=s;
}
let heading=styles.find(s=>s.name==='Observatory/Paper/EnglishHeading');
if(!heading)heading=figma.createTextStyle();
heading.name='Observatory/Paper/EnglishHeading';heading.fontName=fonts[3];heading.fontSize=20;heading.lineHeight={unit:'PERCENT',value:140};heading.letterSpacing={unit:'PIXELS',value:0};
heading.description='Inter600은 영문 제목 역할. 영문 본문은 NanumMyeongjo Bold700.';styleIds.push(heading.id);
const color=await figma.variables.getVariableByIdAsync('VariableID:7:112');
const muted=await figma.variables.getVariableByIdAsync('VariableID:7:113');
const canvas=await figma.variables.getVariableByIdAsync('VariableID:7:109');
const border=await figma.variables.getVariableByIdAsync('VariableID:7:114');
function paint(v){return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',v);}
function gap(n,field,value){const v=vars.find(v=>v.name==='space/'+value&&v.variableCollectionId===metrics.id);n[field]=value;if(v)n.setBoundVariable(field,v);}
function stack(parent,name,width,padding=0,direction='VERTICAL'){
 const n=figma.createAutoLayout(direction);ids.push(n.id);n.name=name;n.fills=[];n.primaryAxisSizingMode='AUTO';n.counterAxisSizingMode='FIXED';n.resize(width,1);parent.appendChild(n);n.layoutSizingHorizontal='FIXED';n.layoutSizingVertical='HUG';
 gap(n,'itemSpacing',16);for(const field of ['paddingTop','paddingRight','paddingBottom','paddingLeft'])gap(n,field,padding);n.clipsContent=false;return n;
}
async function text(parent,name,copy,width,size=14,bold=false){
 const t=figma.createText();ids.push(t.id);t.name=name;t.fontName=bold?fonts[2]:fonts[1];t.fontSize=size;t.lineHeight={unit:'PERCENT',value:160};t.characters=copy;t.textAutoResize='HEIGHT';t.resize(width,1);parent.appendChild(t);t.layoutSizingHorizontal='FIXED';t.layoutSizingVertical='HUG';t.fills=[paint(color)];return t;
}
const root=stack(page,boardName,1440,48);root.x=Math.max(...page.children.filter(n=>n.id!==root.id).map(n=>n.x+n.width),0)+160;root.y=0;
root.setExplicitVariableModeForCollection('VariableCollectionId:7:79','7:2');root.fills=[paint(canvas)];root.strokes=[paint(border)];gap(root,'itemSpacing',32);
await text(root,'기준 / 제목','종이 본문 · 한글과 영문',1344,32,true);
await text(root,'기준 / 확정값','Nanum Myeongjo Bold 700 · 장평 95% · 양쪽 정렬 · 마지막 줄 시작 정렬',1344,18,true);
await text(root,'기준 / 적용 범위','개념·지식의 설명부, paper 본문, 직접 쓰는 메모·자유 글에 적용한다. 제목·버튼·탐색·표·축·수식·코드는 각 역할을 유지한다. 영어 제목은 Inter 600, 영어 본문은 나눔명조 700이다.',1344);
await text(root,'기준 / 표시와 편집','장평 95%의 눈에 보이는 조판은 실제 서체의 윤곽을 가로로만 축소했다. 각 예시 안에 편집 가능한 700 텍스트 원본을 보존한다. Figma Text Style 자체에는 장평 속성이 없으며, 앱 입력의 커서·선택·한글 조합 검증은 구현 재개 때 확인한다.',1344);
const ko='함수는 입력과 출력 사이의 대응이다. 같은 입력에는 하나의 출력이 정해져야 한다. 이 조건을 바꾸면 어떤 관계가 함수가 될 수 없는지 분명해진다.\n\n설명을 기록할 때는 조건과 이유, 아직 확실하지 않은 부분을 함께 남긴다. 한 번의 체크만으로 이해가 끝났다고 판단하지 않는다.';
const en='A function is a relation between an input and an output. Each input must determine one output. Changing this condition makes it clear why some relations cannot be functions.\n\nA useful explanation keeps the conditions, the reasons, and the uncertain parts together. A check mark alone does not show complete understanding.';
const memoKo='오늘은 입력과 출력의 대응을 살펴봤다. 같은 입력에 출력이 둘인 경우를 다시 확인하고 싶다. 조건을 바꿨을 때도 내 설명이 성립하는지 다음에 써 본다.';
const memoEn='Today I examined the relation between inputs and outputs. I want to revisit the case of one input with two outputs, and check whether my explanation still holds when a condition changes.';
for(const [key,label,size,line,tracking,width] of roles){
 const row=stack(root,'구역 / '+label,1344,0,'HORIZONTAL');gap(row,'itemSpacing',32);
 for(const [lang,copy] of [['ko',key==='memo'?memoKo:ko],['en',key==='memo'?memoEn:en]]){
  const panel=stack(row,'예시 / '+key+' / '+lang,656,16);panel.strokes=[paint(border)];
  const roleTitle=await text(panel,'역할 / '+key+' / '+lang,(lang==='ko'?'한글':'English')+' · '+label,624,18,true);
  if(lang==='en'){await roleTitle.setTextStyleIdAsync(heading.id);roleTitle.characters={body:'English · Concept / knowledge / paper',compact:'English · Compact paper',preview:'English · Preview / folded memo',memo:'English · Writing a memo'}[key];}
  await text(panel,'값 / '+key+' / '+lang,size+'px · 700 · '+line+'% 행간 · '+tracking+'% 자간 · 95% 장평',624,13);
  const surface=stack(panel,'조판 / '+key+' / '+lang,width,0);
  const source=figma.createText();ids.push(source.id);source.name='편집 원본 / '+key+' / '+lang+' / 700';source.fontName=fonts[0];source.characters=copy;
  await source.setTextStyleIdAsync(roleStyles[key].id);source.textAutoResize='HEIGHT';source.resize(width,1);surface.appendChild(source);source.layoutSizingHorizontal='FIXED';source.layoutSizingVertical='HUG';source.textAutoResize='HEIGHT';source.textAlignHorizontal='JUSTIFIED';source.fills=[paint(color)];
  const clone=source.clone();surface.appendChild(clone);const vector=figma.flatten([clone],surface);ids.push(vector.id);vector.name='장평 95% 조판 / '+key+' / '+lang;const unscaledWidth=vector.width;const unscaledHeight=vector.height;vector.resize(unscaledWidth*0.95,unscaledHeight);source.visible=false;
  specimens.push({key,language:lang,panelId:panel.id,sourceId:source.id,outlineId:vector.id,textStyleId:roleStyles[key].id,font:source.fontName,size:source.fontSize,line:source.lineHeight,tracking:source.letterSpacing,align:source.textAlignHorizontal,widthBefore:unscaledWidth,widthAfter:vector.width,scaleX:vector.width/unscaledWidth,textPreserved:source.characters===copy});
 }
}
await text(root,'기준 / 보존과 구현 상태','개인 서체·크기·읽기 폭, 원문·줄바꿈·강조, ID·초안·이력·배치는 보존한다. 미리보기는 14px, 입력은 최소 16px. 긴 내용은 펼침·스크롤로 이어 읽는다. 이번 작업은 Figma 기준과 지침만 반영하며 앱 기준값·생성기·CSS·저장·서버·배포는 대기 상태다.',1344);
return {pageId:page.id,rootId:root.id,createdNodeIds:ids,variableIds,styleIds,specimens,bounds:{x:root.x,y:root.y,width:root.width,height:root.height},existingPageChildrenPreserved:page.children.filter(n=>n.id!==root.id).map(n=>({id:n.id,name:n.name}))};
