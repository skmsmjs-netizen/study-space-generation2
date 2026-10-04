// Native editable criteria projection. DATA and STAGE are supplied by the caller.
const page=await figma.getNodeByIdAsync(DATA.pageId);
await figma.setCurrentPageAsync(page);
const createdNodeIds=[],mutatedNodeIds=[],boards=[],entityNodes=[],profileNodes=[];
const variables=await figma.variables.getLocalVariablesAsync();
const variableMap=new Map(variables.map(v=>[v.name,v]));
const styleList=await figma.getLocalTextStylesAsync();
const styles=new Map(styleList.filter(s=>s.name.startsWith('Observatory/')).map(s=>[s.name.split('/')[1],s]));
const materials=await figma.variables.getVariableCollectionByIdAsync('VariableCollectionId:7:79');
const fontNames=[...new Map([...styles.values()].map(s=>[JSON.stringify(s.fontName),s.fontName])).values()];
await Promise.all(fontNames.map(f=>figma.loadFontAsync(f)));
const proseFont={family:'Noto Sans KR',style:'Regular',variationSettings:{wght:500}};
await figma.loadFontAsync(proseFont);

function bindPaint(node,property,name){
  const variable=variableMap.get(name);
  if(!variable)throw new Error('Missing reused variable '+name);
  node[property]=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',variable)];
}
function space(node,property,value){
  node[property]=value;
  const variable=variableMap.get('space/'+value);
  if(variable)node.setBoundVariable(property,variable);
}
function mode(node,paper=true){node.setExplicitVariableModeForCollection(materials,paper?'7:2':'7:1');}
function frame(parent,name,width,direction='VERTICAL',padding=16,gap=16){
  const n=figma.createAutoLayout(direction);createdNodeIds.push(n.id);parent.appendChild(n);
  n.name=name;n.resize(width,100);n.layoutSizingHorizontal='FIXED';n.layoutSizingVertical='HUG';
  n.clipsContent=false;mode(n);bindPaint(n,'fills','material/surface');
  for(const p of ['paddingTop','paddingRight','paddingBottom','paddingLeft'])space(n,p,padding);
  space(n,'itemSpacing',gap);return n;
}
async function text(parent,name,value,width,style='Body',prose=false){
  const n=figma.createText();createdNodeIds.push(n.id);parent.appendChild(n);n.name=name;
  const s=styles.get(style)||styles.get('Body');n.fontName=s.fontName;
  await n.setTextStyleIdAsync(s.id);n.characters=value;n.textAutoResize='HEIGHT';n.resize(width,Math.max(24,n.height));
  n.layoutSizingHorizontal='FIXED';n.layoutSizingVertical='HUG';
  n.textAlignHorizontal=prose?'JUSTIFIED':'LEFT';
  if(prose&&style==='Body'){n.fontName=proseFont;n.lineHeight={unit:'PERCENT',value:width<=640?185:200};n.letterSpacing={unit:'PERCENT',value:width<=640?-2.5:-5};}
  bindPaint(n,'fills','material/text');return n;
}
function outline(n){bindPaint(n,'strokes','material/borderInteractive');n.strokeWeight=1;}
function board(name,width,x,y){
  let n=page.children.find(c=>c.name===name);
  if(n){
    if(n.children.some(c=>c.name==='정본 연결')){boards.push({id:n.id,name:n.name,reused:true});return null;}
    if(n.children.length)throw new Error('Partial existing owned board: '+n.id);
    mutatedNodeIds.push(n.id);
  }else n=frame(page,name,width,'VERTICAL',24,24);
  n.x=x;n.y=y;mode(n);outline(n);boards.push({id:n.id,name:n.name,reused:false});return n;
}
async function done(n,width){await text(n,'정본 연결','정본: docs/layout-standard.md · layout-standard-contract.json · 기준 채택과 실제 과업 검증은 구별',width,'Caption');}
async function box(parent,label,width,body){
  const n=frame(parent,label,width,'VERTICAL',16,8);outline(n);
  await text(n,'역할 · '+label,label,width-32,'Label');
  if(body)await text(n,'내용 · '+label,body,width-32,'Body',true);
  return n;
}

if(STAGE==='foundations'){
  const cover=board('LAYOUT-00 · 천문대 레이아웃 기준',1008,200,120);
  if(cover){
    mode(cover,false);bindPaint(cover,'fills','material/canvas');
    await text(cover,'기준 제목','ManSeekSong OS\n천문대 레이아웃 기준',960,'Title');
    await text(cover,'기준 선언','웹앱의 화면과 과업 구역은 최종 레이아웃 파일에 등록된 패턴에서 선택한다. 대표 패턴·내부 패턴·전환·복귀를 함께 지정한다.',960,'Body',true);
    const window=frame(cover,'창틀 · 원본 바깥 공간',960,'VERTICAL',8,0);mode(window,false);outline(window);
    const original=await figma.getNodeByIdAsync('10:68');
    if(!original||original.type!=='COMPONENT'||Math.abs(original.width/ original.height-2.4)>0.001)throw new Error('Original whole scene component unavailable or aspect changed');
    const instance=original.createInstance();createdNodeIds.push(instance.id);window.appendChild(instance);
    instance.name='원본 전체 · 960×400 비율 보존';instance.resize(944,944/2.4);
    await text(cover,'창문 보존','원본 전체를 비례 배치하고 바깥에 틀 공간을 더한다. crop·aperture 축소·장식 겹침 금지. 장면은 전체 범위 목업을 재사용하고 실제 앱은 기존 렌더러를 유지한다.',960,'Caption');
    const paper=frame(cover,'종이 · 과업 기준',960,'VERTICAL',24,16);outline(paper);
    await text(paper,'공간 기준','북 · 공부 책상    서 · 자료 책장    동 · 탐구 작업대\n남 · 기록·계획 벽    위 · 천장 조명 / 공통 도구',912,'Heading');
    await text(paper,'읽기 기준','어두운 실내와 정지한 종이 작업면을 구별한다. 본문은 양쪽 정렬, 마지막 줄은 시작 정렬. 닫힌 모듈·뜻 있는 선/화살표·실제 순서를 과업에 연결한다. 원문·초안·개인 서체/배치를 보존한다.',912,'Body',true);
    await text(paper,'전체 범위','등록 항목199개(도입0 + 본186 + 추가12) · 과업 프로필10개 · 기능 역할25개 · 현재 엔터티111개 · 미래 요소24분류',912,'Label');
    await text(paper,'기술 적응','값은 현재 기본값이다. 고급 기술과 실제 사용 결과에 따라 담당 원본·소비 경로·Figma를 함께 보정한다. 기존 숫자는 기술 표현의 상한이 아니다.',912,'Body',true);
    await done(cover,960);
  }
  const selection=board('LAYOUT-01 · 등록 패턴 선택과 변경',1008,1272,120);
  if(selection){
    await text(selection,'선택 제목','패턴을 선택하는 기준',960,'Title');
    for(const [title,body] of [
      ['01 과업','읽기·입력·찾기·비교·조절/실행·관계 탐색·계획·변경/복구 중 실제 과업을 정의한다.'],
      ['02 대표 구조','등록 L패턴 하나를 대표 화면으로 선택하고 내부 목록·상세·보조면을 등록 패턴으로 조합한다.'],
      ['03 종류 구별','8pt·Fixed·Hug·Frame·Figma 가이드는 크기/도구 축이다. 대표 화면 패턴을 대신하지 않는다.'],
      ['04 전환과 복귀','좁은 구조·의미 순서·입력/초안·선택·시점·닫기/재접속 후 복귀를 정한다.'],
      ['05 미래 요소','새 요소는 역할·패턴·크기/증가·전환·실패·보존·소스·확인 근거를 함께 등록한다.'],
      ['06 변경과 확인','기존 변형/조합을 먼저 재사용한다. 새 패턴은 사전에 등록한 뒤 사용하고 관련 과업만 확인한다.']
    ])await box(selection,title,960,body);
    await text(selection,'구현 경계','이 페이지는 편집 가능한 설계 기준이다. 실제 계산·입력·저장·원격 권한·배포는 별도 구현과 근거로 판정한다.',960,'Body',true);
    await done(selection,960);
  }
  const metrics=board('LAYOUT-02 · 값·성장·전환·복귀',1008,2344,120);
  if(metrics){
    await text(metrics,'값 제목','현재 값과 적용 조건',960,'Title');
    for(const [title,body] of [
      ['읽기','일반 글자 기초1rem/1.65/400 · 종이 본문500/행간2/자간−0.05em, 읽기 면40rem 이하1.85/−0.025em · max48rem · justify/마지막줄start · 개인 서체/폭·명시 줄바꿈 보존'],
      ['간격','페이지/종이24px, 좁은16px · 구역24px/필드16px/관련8px · 기존 space token 참조(root16)'],
      ['조작','높이 최소48px/아이콘 목표44px · 긴 문구/확대 시 높이 성장 · 초점2px+간격3px'],
      ['창문','창틀8px/좁은4px · 위젯 전체 비율 · 외부 공간 확보 · 장식으로 초점/조작 가림 금지'],
      ['전환','가용 컨테이너와 내용 최소 폭 기준 · 기존40rem 한 읽기 열 · 2D영역은 의미를 유지한 탐색/상세 제공'],
      ['누적·실패','긴 글·많은 항목·빈 상태·오류·가상 키보드·중단/재접속에서 원문/선택/수동 상태 보존'],
      ['복귀','진입한 방향/대상/초안/초점/시점 · 모달/비모달 구별 · 사라진 대상은 관련 목록'],
      ['값 원본','observatory-experience-baseline.json · 이 페이지는 Figma 투영. 값/이유/범위/확인 결과를 원본/소비 경로와 함께 수정']
    ])await box(metrics,title,960,body);
    await done(metrics,960);
  }
}

async function skeleton(parent,p,width,narrow){
  const n=frame(parent,(narrow?'좁은 ':'넓은 ')+p.id,width,'VERTICAL',16,16);outline(n);
  await text(n,'전환형',narrow?'402px 예시 · 내용/컨테이너 기준 전환':'넓은 작업면 예시 · 고정 최적 폭 아님',width-32,'Caption');
  await box(n,'공통 커버 / 장소 · 상단',width-32,'위젯 전체 비율·바깥 틀·현재 자리');
  const body=frame(n,'과업 · '+p.composition,width-32,'VERTICAL',0,16);
  const inner=width-32;
  await text(body,'의미 순서',p.sequence,inner,'Label');
  const pairs={
    catalogue:['대상 목록/계층','선택한 상세/출처'],
    document:['원자료/PDF 전체','내 필기/발췌/주석'],
    instrument:['조건/입력/편집','관찰/실행/현재값'],
    spatial:['관계 지도/개인 배치','선택한 원문/관계 상세'],
    analysis:['질문에 맞는 그래프','같은 범위의 값/원기록'],
    timeline:['기간/달력/시간표','같은 날짜의 일정 목록'],
  };
  if(pairs[p.composition]){
    const row=frame(body,'연결된 작업면',inner,narrow?'VERTICAL':'HORIZONTAL',0,16);
    const labels=pairs[p.composition];
    for(const label of labels)await box(row,label,narrow?inner:(inner-16)/2,'전체 내용·선택을 보존하고 상세/복귀를 연결한다.');
  }else if(p.composition==='board'){
    const row=frame(body,'이름 붙은 보드 열',inner,narrow?'VERTICAL':'HORIZONTAL',0,16);
    for(const label of ['계획','진행','보관'])await box(row,label,narrow?inner:(inner-32)/3,'작업 카드 · 긴 글/이동/개인 순서');
  }else{
    const labels=p.composition==='practice'?['범위/질문','내 답 · 원문/조건','명시적으로 공개하는 설명/수정']:
      p.composition==='control'?['현재 상태/권한','변경·실행 범위/입력','실제 결과/실패·복구']:['현재 대상/기간','연속된 기록·답·생각','선택 입력/이력·이어가기'];
    for(const label of labels)await box(body,label,inner,'내용은 높이 성장 · 원문/초안·의미 순서 유지');
  }
  await text(body,'등록 연결',p.primaryPattern+' + '+p.secondaryCandidates.join(' · '),inner,'Caption');
  await text(body,'복귀 계약',narrow?'주면→보조면→같은 대상/초안/선택/위치로 복귀':'가용 폭과 내용으로 전환. 사용자의 수동 폭/시점·자료를 덮어쓰지 않는다.',inner,'Body',true);
  return n;
}

if(STAGE==='profiles'){
  for(let i=0;i<DATA.profiles.length;i++){
    const p=DATA.profiles[i],x=200+(i%2)*1576,y=1520+Math.floor(i/2)*1640;
    const n=board('LAYOUT-'+p.id+' · '+p.composition,1512,x,y);
    if(!n)continue;
    await text(n,'프로필 제목',p.id+' · '+p.composition+' / '+p.primaryPattern,1464,'Title');
    await text(n,'프로필 역할',DATA.roles.filter(r=>r.composition===p.composition).map(r=>r.label).join(' · '),1464,'Body');
    const pair=frame(n,'넓은/좁은 전환 비교',1464,'HORIZONTAL',0,24);
    const wide=await skeleton(pair,p,1008,false),narrow=await skeleton(pair,p,402,true);
    profileNodes.push({profileId:p.id,boardId:n.id,wideId:wide.id,narrowId:narrow.id});
    await done(n,1464);
  }
}

if(STAGE==='registry'){
  let row=0;
  for(const scope of ['screen','overlay','surface']){
    const all=DATA.entities.filter(e=>e.scope===scope);
    for(let start=0;start<all.length;start+=15){
      const group=all.slice(start,start+15),n=board('LAYOUT-현재 · '+scope+' · '+start,1008,3500+(row%2)*1072,120+Math.floor(row/2)*1340);row++;
      if(!n)continue;
      await text(n,'현재 대응 제목','현재 '+scope+' · '+group[0].entityId+'–'+group.at(-1).entityId,960,'Title');
      for(const e of group){
        const item=await text(n,e.entityId+' · '+e.name,e.entityId+'  '+e.name+'\n'+e.profileId+' / '+e.primaryPattern+(e.wrapperPattern?' · 외곽 '+e.wrapperPattern:''),960,'Body');
        entityNodes.push({entityId:e.entityId,nodeId:item.id,boardId:n.id});
      }
      await text(n,'현재 근거 경계','정식 선택 목표 · 기존 기능/소스 참조 · 실제111전체의 동작 검증 완료를 뜻하지 않음',960,'Caption');
      await done(n,960);
    }
  }
  for(let start=0;start<DATA.future.length;start+=8){
    const group=DATA.future.slice(start,start+8),n=board('LAYOUT-미래 · '+start,1008,3500+(row%2)*1072,120+Math.floor(row/2)*1340);row++;
    if(!n)continue;
    await text(n,'미래 대응 제목','앞으로 들어올 요소 · '+group[0].id+'–'+group.at(-1).id,960,'Title');
    for(const e of group)await box(n,e.id+' · '+e.role+' / '+e.primaryPattern,960,e.growthAndPreservation+'\n'+(e.status.startsWith('conditional')?'조건부: 실제 연결/권한·기존 제외 결정을 유지':'사용할 때 역할·크기/증가·전환·보존/실패를 함께 지정'));
    await done(n,960);
  }
}

if(STAGE==='catalog'){
  const groups=new Map();
  for(const e of DATA.entries){if(!groups.has(e.kind))groups.set(e.kind,[]);groups.get(e.kind).push(e);}
  let i=0;
  for(const [kind,group] of groups){
    const n=board('LAYOUT-색인 · '+kind,1008,5700+(i%3)*1072,120+Math.floor(i/3)*1280);i++;
    if(!n)continue;
    await text(n,'종류 제목',kind,960,'Heading');
    await text(n,'종류 경계','화면 패턴과 그리드·도구·속성·조언의 종류를 구별한다. 원본 번호/설명/보정은 통합 파일에서 확인한다.',960,'Caption');
    for(const e of group)await text(n,e.id+' · '+e.title,e.id+'  '+e.title+(e.primaryScreenCandidate?'  [대표 화면 후보]':''),960,'Body');
    await done(n,960);
  }
  function arrange(prefix,columns,startX,startY,width,gap){
    const items=page.children.filter(n=>n.type==='FRAME'&&n.name.startsWith(prefix));
    let y=startY;
    for(let start=0;start<items.length;start+=columns){
      const group=items.slice(start,start+columns);
      group.forEach((n,j)=>{n.x=startX+j*(width+gap);n.y=y;mutatedNodeIds.push(n.id);});
      y+=Math.max(...group.map(n=>n.height))+gap;
    }
  }
  const foundations=page.children.filter(n=>n.name.startsWith('LAYOUT-0'));
  const bottom=Math.max(...foundations.map(n=>n.y+n.height));
  arrange('LAYOUT-P',2,200,bottom+96,1512,64);
  const registry=page.children.filter(n=>n.type==='FRAME'&&(n.name.startsWith('LAYOUT-현재')||n.name.startsWith('LAYOUT-미래')));
  let registryY=120;
  for(let start=0;start<registry.length;start+=2){const group=registry.slice(start,start+2);group.forEach((n,j)=>{n.x=3500+j*1072;n.y=registryY;mutatedNodeIds.push(n.id);});registryY+=Math.max(...group.map(n=>n.height))+64;}
  arrange('LAYOUT-색인',3,5700,120,1008,64);
}

return {pageId:page.id,stage:STAGE,createdNodeIds,mutatedNodeIds,boards,entityNodes,profileNodes,
        editable:true,variableReuse:true,styleReuse:true,originalScenePreserved:true};
