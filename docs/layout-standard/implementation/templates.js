// Reuses validated local assets. INPUT supplies a checkpointed page and registered patterns.
const page=await figma.getNodeByIdAsync(INPUT.pageId);await figma.setCurrentPageAsync(page);
const createdNodeIds=[],mutatedNodeIds=[],sets=[],examples=[];
const vars=new Map((await figma.variables.getLocalVariablesAsync()).map(v=>[v.name,v]));
const styles=new Map((await figma.getLocalTextStylesAsync()).filter(s=>s.name.startsWith('Observatory/')).map(s=>[s.name,s]));
const fonts=new Map([...styles.values()].map(s=>[JSON.stringify(s.fontName),s.fontName]));
await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));
const mat=await figma.variables.getVariableCollectionByIdAsync('VariableCollectionId:7:79');
const originals={};for(const [name,id] of Object.entries(INPUT.assets))originals[name]=await figma.getNodeByIdAsync(id);
function track(n,deep=false){createdNodeIds.push(n.id);if(deep&&n.findAll)createdNodeIds.push(...n.findAll().map(c=>c.id));return n;}
function paint(n,p,key){n[p]=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',vars.get('material/'+key))];}
function space(n,p,v){n[p]=v;if(vars.has('space/'+v))n.setBoundVariable(p,vars.get('space/'+v));}
function configure(n,w,dir='VERTICAL',pad=16,gap=16){n.layoutMode=dir;n.resize(w,80);n.layoutSizingHorizontal='FIXED';n.layoutSizingVertical='HUG';n.clipsContent=false;n.setExplicitVariableModeForCollection(mat,'7:2');paint(n,'fills','surface');for(const p of ['paddingTop','paddingRight','paddingBottom','paddingLeft'])space(n,p,pad);space(n,'itemSpacing',gap);return n;}
function frame(parent,name,w,dir='VERTICAL',pad=16,gap=16){const n=track(figma.createAutoLayout(dir));parent.appendChild(n);n.name=name;return configure(n,w,dir,pad,gap);}
async function txt(parent,name,value,w,role='Label',prose=false){const n=track(figma.createText());parent.appendChild(n);n.name=name;const s=styles.get('Observatory/'+role)||styles.get('Observatory/Body');n.fontName=s.fontName;await n.setTextStyleIdAsync(s.id);n.characters=value;n.textAutoResize='HEIGHT';n.resize(w,24);n.layoutSizingHorizontal='FILL';n.layoutSizingVertical='HUG';n.textAlignHorizontal=prose?'JUSTIFIED':'LEFT';paint(n,'fills','text');return n;}
function instance(parent,main,name,w){const n=track(main.createInstance(),true);parent.appendChild(n);n.name=name;n.resize(w,n.height);if(n.layoutMode==='VERTICAL')n.primaryAxisSizingMode='AUTO';return n;}
function button(parent,label,w=144,primary=false){const n=instance(parent,originals[primary?'primaryButton':'quietButton'],'행동 / '+label,w);const owner=n.mainComponent.parent;const key=Object.keys(owner.componentPropertyDefinitions).find(k=>k.startsWith('Label#'));if(key)n.setProperties({[key]:label});return n;}
let region=page.children.find(n=>n.type==='COMPONENT'&&n.name==='Observatory/v2/Layout/Region');
if(INPUT.stage==='foundation'&&!region){
 region=track(figma.createComponent());page.appendChild(region);region.name='Observatory/v2/Layout/Region';configure(region,336);region.x=200;region.y=120;
 paint(region,'strokes','borderInteractive');region.strokeWeight=1;
 const title=await txt(region,'제목','내 기록',304,'Heading');const body=await txt(region,'본문','조건과 생각을 필요한 만큼 남긴다. 원문과 수정 이력을 함께 보관한다.',304,styles.has('Observatory/Paper/compact')?'Paper/compact':'Body',true);
 const titleKey=region.addComponentProperty('Title','TEXT',title.characters);title.componentPropertyReferences={characters:titleKey};
 const bodyKey=region.addComponentProperty('Body','TEXT',body.characters);body.componentPropertyReferences={characters:bodyKey};
 region.description='등록 패턴의 닫힌 과업 모듈. Title/Body는 내용, 바깥 템플릿은 배치 역할을 소유한다. 본문 높이 성장·개인 서체/원문/조건/예외 보존. docs/layout-standard.md';
}
function regionInstance(parent,title,body,w){if(!region)throw Error('Missing region foundation');const n=instance(parent,region,title,w);const defs=region.componentPropertyDefinitions;const t=Object.keys(defs).find(k=>k.startsWith('Title#')),b=Object.keys(defs).find(k=>k.startsWith('Body#'));n.setProperties({[t]:title,[b]:body});return n;}
const spec={
 L025:['현재 대상','내 기록','다음에 확인할 점'],L037:['자료 모음','읽던 자료','이어 볼 자료'],L040:['전체 맥락','핵심 내용','조건과 참고'],L043:['대상 목록','남긴 기록'],L045:['대상 목록','선택한 상세'],L048:['하늘과 관측 도구','현재 상태'],L049:['계획','진행','보관'],L053:['대상 선택','기록할 내용','날짜와 저장'],L055:['검색어와 범위','일치하는 대상'],L062:['내 배치와 연결','선택한 원문'],L064:['공부 책상','자료 책장','탐구 작업대','기록·계획 벽','공통 도구'],L070:['선택한 대상','속성과 관련 내용'],L081:['목차와 찾기','원문과 출처'],L082:['조건과 코드','실행 결과','기록과 로그'],L160:['실행'],L170:['확인할 범위','입력과 설명'],L187:['주 작업면','곁 작업면'],L188:['대상과 조건','편집과 관찰','결과와 로그'],L189:['계층과 찾기','선택한 상세'],L190:['원자료 전체','내 필기와 주석'],L191:['기존 과업','관련 곁 도구'],L192:['지금 할 일 찾기','일치하는 명령'],L193:['질문과 조건','내 답','공개할 설명과 수정'],L194:['조건과 조절','같은 조건의 그림과 값','관찰 근거'],L195:['비교할 범위','자료의 여러 표현','값과 원기록'],L196:['전체 관계 지도','선택한 원문과 연결'],L197:['기간과 달력','같은 날짜의 과업'],L198:['현재 상태와 권한','바꿀 범위','실제 결과와 복구']};
if(INPUT.stage==='patterns'){
 let row=INPUT.offset||0;
 for(const pattern of INPUT.patterns){
  const name='Observatory/v2/Layout/'+pattern.id;const existing=page.children.find(n=>n.name===name&&n.type==='COMPONENT_SET');if(existing){sets.push({pattern:pattern.id,setId:existing.id,reused:true});continue;}
  const variants=[];for(const width of ['wide','narrow']){
   const w=width==='wide'?1008:402,n=track(figma.createComponent());page.appendChild(n);n.name='Width='+width;configure(n,w,'VERTICAL',width==='wide'?24:16,24);
   const iw=w-n.paddingLeft-n.paddingRight,labels=spec[pattern.id]||['主면','보조면'];
   const heading=await txt(n,'과업 제목',labels[0],iw,'Heading');const key=n.addComponentProperty('Title','TEXT',heading.characters);heading.componentPropertyReferences={characters:key};
   if(pattern.id==='L064'){
    const nav=frame(n,'현재 자리와 공통 도구',iw,'HORIZONTAL',0,8);nav.layoutWrap='WRAP';space(nav,'counterAxisSpacing',8);for(const label of labels)button(nav,label,width==='wide'?176:176);
   }else if(pattern.id==='L160')button(n,'실행',Math.min(iw,176),true);
   else{
    if(pattern.id==='L048'){const out=frame(n,'창틀 · 원본 바깥',iw,'VERTICAL',width==='wide'?8:4,0);out.setExplicitVariableModeForCollection(mat,'7:1');paint(out,'fills','canvas');const scene=instance(out,originals.scene,'원본 전체',iw-out.paddingLeft-out.paddingRight);scene.resize(scene.width,scene.width/2.4);}
    const split=['L045','L082','L187','L188','L189','L190','L191','L194','L196','L197'].includes(pattern.id)&&width==='wide';
    const grid=['L037','L049','L195'].includes(pattern.id)&&width==='wide';
    const body=frame(n,'등록 과업 구조 / '+pattern.id,iw,split||grid?'HORIZONTAL':'VERTICAL',0,24);
    const cols=grid&&pattern.id==='L049'?3:2;const panelW=split||grid?(iw-24*(cols-1))/cols:iw;
    if(split){const left=frame(body,labels[0],panelW,'VERTICAL',0,16),right=frame(body,'선택한 작업면',panelW,'VERTICAL',0,16);labels.forEach((label,j)=>regionInstance(j===0?left:right,label,j===0?'대상을 선택하고 조건을 확인한다.':'원문과 현재 선택을 보존하며 필요한 내용을 펼쳐 본다.',panelW));}
    else{if(grid){body.layoutWrap='WRAP';space(body,'counterAxisSpacing',24);}for(const label of labels)regionInstance(body,label,'원문·조건·예외를 보관하고 같은 대상에서 이어서 수정한다.',panelW);}
    if(['L053','L082','L190','L193','L194','L198'].includes(pattern.id)){const entry=instance(n,originals.input,'입력 / 실제 내용',Math.min(iw,336));const actions=frame(n,'실행과 취소',iw,'HORIZONTAL',0,8);actions.layoutWrap='WRAP';space(actions,'counterAxisSpacing',8);button(actions,'적용',144,true);button(actions,'돌아가기',144);}
   }
   n.description=pattern.id+' · '+pattern.title+' / '+width+'. 등록된 배치, 원문/상태 보존, 실제 내용 증가와 컨테이너 폭에 따른 전환. 내부 부품을 교체하되 의미 순서를 유지한다. docs/layout-standard.md';variants.push(n);
  }
  const set=track(figma.combineAsVariants(variants,page));set.name=name;set.description=pattern.id+' / '+pattern.title+' · Width=wide/narrow. 사용 전 현재 과업·내용·전환·복귀를 지정한다.';
  const maxH=Math.max(...variants.map(n=>n.height));set.resize(1482,maxH+48);variants.forEach((n,j)=>{n.x=j===0?24:1056;n.y=24;mutatedNodeIds.push(n.id);});set.x=200+(row%2)*1546;set.y=800+Math.floor(row/2)*1100;row++;
  sets.push({pattern:pattern.id,setId:set.id,wideId:variants[0].id,narrowId:variants[1].id});
 }
}
if(INPUT.stage==='future'){
 let index=0;for(const f of INPUT.future){
  const name='FE例 / '+f.id+' / '+f.primaryPattern;if(page.children.some(n=>n.name===name))continue;
  const main=await figma.getNodeByIdAsync(INPUT.patternMap[f.primaryPattern].narrowId);const n=frame(page,name,450,'VERTICAL',24,16);n.x=3500+(index%3)*514;n.y=120+Math.floor(index/3)*1700;index++;
  await txt(n,'요소 역할',f.id+' · '+f.role,402,'Heading');instance(n,main,'등록 패턴 인스턴스',402);await txt(n,'증가·보존',f.growthAndPreservation,402,'Caption');if(f.status.startsWith('conditional'))await txt(n,'조건','기존 제외 결정·실제 연결·권한 조건을 유지한다.',402,'Caption');examples.push({id:f.id,nodeId:n.id,pattern:f.primaryPattern});
 }
}
if(INPUT.stage==='states'){
 const table=[['처음',INPUT.assets.empty],['결과 없음',INPUT.assets.noResults],['처리 중',INPUT.assets.loading],['실패와 재시도',INPUT.assets.error],['읽기 전용',INPUT.assets.readOnly],['복귀',INPUT.assets.taskReturn]];
 for(let i=0;i<table.length;i++){const [name,id]=table[i];const n=frame(page,'상태와 복귀 / '+name,450);n.x=5500+(i%2)*514;n.y=120+Math.floor(i/2)*600;await txt(n,'상태 역할',name,418,'Heading');const main=await figma.getNodeByIdAsync(id);instance(n,main,name,Math.min(418,main.width));examples.push({state:name,nodeId:n.id});}
}
return {pageId:page.id,createdNodeIds:[...new Set(createdNodeIds)],mutatedNodeIds,regionId:region?.id,sets,examples};
