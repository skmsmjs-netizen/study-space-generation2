
const createdNodeIds=[],mutatedNodeIds=[];
const styles=await figma.getLocalTextStylesAsync();
const titleStyle=styles.find(s=>s.name==='Observatory/Title'),headingStyle=styles.find(s=>s.name==='Observatory/Heading'),bodyStyle=styles.find(s=>s.name==='Observatory/Body'),captionStyle=styles.find(s=>s.name==='Observatory/Caption');
for(const s of [titleStyle,headingStyle,bodyStyle,captionStyle])await figma.loadFontAsync(s.fontName);
const variables=await figma.variables.getLocalVariablesAsync();
const variable=n=>variables.find(v=>v.name===n);
const fill=(n)=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',variable(n));
function track(n){createdNodeIds.push(n.id);return n;}
function layout(parent,name,width){const n=track(figma.createAutoLayout('VERTICAL'));n.name=name;n.resize(width,100);n.primaryAxisSizingMode='AUTO';n.counterAxisSizingMode='FIXED';n.itemSpacing=16;n.paddingTop=32;n.paddingBottom=32;n.paddingLeft=32;n.paddingRight=32;n.fills=[fill('primitive/paper/surface')];parent.appendChild(n);return n;}
async function txt(parent,name,value,style=bodyStyle){const t=track(figma.createText());t.name=name;t.fontName=style.fontName;await t.setTextStyleIdAsync(style.id);t.characters=value;t.textAutoResize='HEIGHT';t.resize(parent.width-parent.paddingLeft-parent.paddingRight,30);t.fills=[fill('primitive/paper/text')];parent.appendChild(t);t.layoutSizingHorizontal='FILL';t.textAutoResize='NONE';t.resize(parent.width-parent.paddingLeft-parent.paddingRight,30);t.textAutoResize='HEIGHT';t.characters=value;return t;}
async function board(page,id,title,items,x,y,width=1152){let existing=page.findOne(n=>n.name==='교육 / '+id+' / '+title);if(existing)return existing;const b=layout(page,'교육 / '+id+' / '+title,width);b.x=x;b.y=y;await txt(b,'제목 / '+title,title,titleStyle);for(const [i,it]of items.entries()){const t=await txt(b,'해설 / '+id+' / '+(i+1),it.text,it.heading?headingStyle:bodyStyle);if(it.url)t.hyperlink={type:'URL',value:it.url};}return b;}

const PAGE_ID=__PAGE_ID__, NT=__NODE_TYPES__,CP=__PROPERTY_MAP__,ST=__STATES__,FALLBACK=__FALLBACK__,CM=__CODE_MAP__;

const p=await figma.getNodeByIdAsync(PAGE_ID);await figma.setCurrentPageAsync(p);
const marker='[교육 어휘 v1]';
const all=p.findAll().filter(n=>!n.name.startsWith('교육 / page-')&&!n.name.startsWith('해설 / page-')&&!n.name.startsWith('제목 / 페이지'));
function fingerprint(nodes){let hash=2166136261;for(const n of nodes){const entry=[n.id,n.type,n.name,n.parent?.id,n.x,n.y,n.width,n.height,n.visible,n.type==='TEXT'?n.characters:null,'reactions'in n?n.reactions:null,'boundVariables'in n?n.boundVariables:null,(n.type==='COMPONENT_SET'||(n.type==='COMPONENT'&&n.parent.type!=='COMPONENT_SET'))?n.componentPropertyDefinitions:null];const s=JSON.stringify(entry);for(let i=0;i<s.length;i++){hash^=s.charCodeAt(i);hash=Math.imul(hash,16777619);}}return (hash>>>0).toString(16);}
const before=fingerprint(all),originalIds=new Set(all.map(n=>n.id));const typeCounts={};for(const n of all)typeCounts[n.type]=(typeCounts[n.type]||0)+1;
const owners=all.filter(n=>n.type==='COMPONENT_SET'||(n.type==='COMPONENT'&&n.parent.type!=='COMPONENT_SET'));
let propertyCount=0;const unresolved=[];const mappedProperties=[];
function translate(key){const k=key.split('#')[0].replace(/\s+\d+$/,'').toLowerCase();return CP[k]||(/^(item|crumb|place)\s?\d*$/.test(k)?{label:'레이블',termId:CP.label.termId}:FALLBACK);}
for(const o of owners){const props=o.componentPropertyDefinitions;const lines=[];for(const [key,d] of Object.entries(props)){propertyCount++;const tr=translate(key);if(tr.status)unresolved.push({ownerId:o.id,key,type:d.type});const values=d.variantOptions?.map(v=>ST[v]?v+'('+ST[v].label+')':v).join(', ');lines.push(key+' → '+tr.label+' · '+tr.termId+' · '+d.type+(values?' · '+values:''));mappedProperties.push([o.id,key,tr.termId]);}
const source=CM[o.id];const original=o.description.split('\n'+marker)[0];const addition=marker+'\n부르는 이름: '+(source?.label||('메인 원본 / '+o.name.split('/').pop().trim()))+' · '+(source?.termId||NT[o.type].termId)+'\n실제 식별자: '+o.name+'\n분류: '+NT[o.type].label+' / '+NT[o.type].termId+'\n실제 속성:\n'+(lines.join('\n')||'편집용 컴포넌트 속성 없음. 내부 레이어의 타입·표현 속성을 확인합니다.')+'\n공통 표현 속성: width/height=크기, fills=채우기, strokes/strokeWeight=선/선 굵기, cornerRadius=모서리 반경, padding=안쪽 여백, itemSpacing=갭, fontSize=글자 크기.\n'+(source?'코드: '+source.source+':'+source.line+' · 이전 고정판과 현재 파일 일치='+source.matches+'\n':'이 객체의 개별 실행 코드 대응은 기존 설명/상위 맥락에서 확인합니다.\n')+'원본·인스턴스·변형·속성·상태·값을 구별합니다. 교육: https://www.figma.com/design/YHmD1PpWWfR9JGTEs77JsX?node-id=170-181';
o.description=original+'\n'+addition;mutatedNodeIds.push(o.id);}
const roots=p.children.filter(n=>originalIds.has(n.id));
const targets=new Map();
function add(n){if('annotations'in n&&!n.removed)targets.set(n.id,n);}
for(const n of roots){add(n);if('children'in n)for(const c of n.children){add(c);if(c.type==='SECTION'&&'children'in c)for(const g of c.children)add(g);}}
for(const n of owners)add(n);
for(const n of all)if('componentPropertyReferences'in n&&Object.keys(n.componentPropertyReferences||{}).length)add(n);
const targetFonts=new Map();for(const n of targets.values())if(n.type==='TEXT')for(const s of n.getStyledTextSegments(['fontName']))targetFonts.set(JSON.stringify(s.fontName),s.fontName);for(const f of targetFonts.values())await figma.loadFontAsync(f);
for(const n of targets.values()){const tr=NT[n.type];const refs='componentPropertyReferences'in n?Object.entries(n.componentPropertyReferences||{}).map(([field,key])=>field+' → '+key+' ('+translate(key).label+')').join('; '):'';const label=marker+' '+(tr?.label||n.type)+' / '+(tr?.termId||'공식 타입')+'\n'+p.name+' → '+(n.parent?.name||'')+' → '+n.name+'\n'+(refs?refs+'\n':'')+'포함 구조·구성 역할·속성을 구별합니다.한국어 속성명: 교육 E06 / 어휘: 사전 분야 01–27.';
n.annotations=[...n.annotations.filter(a=>!(a.label||a.labelMarkdown||'').startsWith(marker)),{label}];mutatedNodeIds.push(n.id);}
const pageItems=[{text:'담당 페이지 · '+p.name,heading:true},{text:'실제 구조 · '+all.length.toLocaleString()+'개 노드 · '+Object.entries(typeCounts).map(([k,v])=>(NT[k]?.label||k)+' '+v).join(' · ')},{text:'읽기 · 레이어 패널에서 현재 프레임을 펼치고 상위/하위·원본/인스턴스를 확인합니다. 구조 해설은 객체 주석, 부품의 속성 번역은 메인 원본 설명에서 찾습니다.'},{text:'표현 · 글자/도형/선/여백/색/배치는 속성, hover/focus/disabled 등은 상태입니다. 프레임 타입과 독립 과업/Atomic Design 구성 역할을 같다고 보지 않습니다.'},{text:'전체 교육 목차 · 구조·명명·속성·상태·곡률·개발 책임·412개 사전',url:'https://www.figma.com/design/YHmD1PpWWfR9JGTEs77JsX?node-id=170-181'}];
const right=roots.reduce((m,n)=>Math.max(m,n.x+n.width),0)+160;
const note=await board(p,'page-'+PAGE_ID.replace(':','-'),'페이지 해설 · '+p.name,pageItems,right,0,1104);
const after=fingerprint(all);if(before!==after)throw new Error('Original names/content/geometry/parent/prototype/props changed: '+before+' != '+after);
return {pageId:p.id,pageName:p.name,originalCount:all.length,types:typeCounts,annotationCount:targets.size,owners:owners.length,propertyCount,unresolvedProperties:unresolved,mappedProperties,noteId:note.id,originalFingerprintBefore:before,originalFingerprintAfter:after,originalPreserved:before===after,createdNodeIds,mutatedNodeIds:[...new Set(mutatedNodeIds)]};
