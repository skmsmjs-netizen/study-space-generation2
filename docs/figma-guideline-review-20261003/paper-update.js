// Adapted from paper-typography-standard/build-figma.js. Only prose glyphs
// receive outline references. Editable source IDs, characters and spans stay.
const page=await figma.getNodeByIdAsync(PAGE_ID);await figma.setCurrentPageAsync(page);
const ns=page.findAll(),texts=ns.filter(n=>n.type==='TEXT');
const styles=await figma.getLocalTextStylesAsync(),styleNames=new Map(styles.map(s=>[s.id,s.name]));
const fonts=new Map();for(const n of texts)for(const s of n.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);
await Promise.all([...fonts.values(),{family:'NanumMyeongjo',style:'Bold'},{family:'NanumMyeongjo',style:'ExtraBold'}].map(f=>figma.loadFontAsync(f)));
const createdNodeIds=[],mutated=new Set(),results=[],skipped=[];
function chain(n){const a=[];while(n&&n.type!=='PAGE'){a.push(n.name);n=n.parent;}return a;}
function visible(n){while(n&&n.type!=='PAGE'){if(n.visible===false)return false;n=n.parent;}return true;}
function candidate(n){const a=chain(n),path=a.join('/'),s=styleNames.get(n.textStyleId)||'';
 if(!visible(n)||/Paper95 \/|장평 95% 조판|편집 원본/.test(path))return false;
 if(/code|latex|formula|equation|수식 원문|코드/i.test(n.name+' '+s)||/Mono|Math/.test(n.fontName?.family||''))return false;
 if(/Title|Heading|Label|Caption/.test(s)||/^(Title|Label|Heading|제목|표제|축|눈금|단위|번호)$/.test(n.name))return false;
 if(/어절|원문 공백/.test(n.name))return false;
 return /Paper\//.test(s)||/^(Body|Paragraph|본문|문단|설명|Original|원문|Definition|정의|Note|메모)$/.test(n.name)||/^(본문|문단|설명|원문)[ /·]/.test(n.name)||(/Body/.test(s)&&n.characters.length>=18&&!/머리말|탐색|이동|Controls|Toolbar|조작|기구/.test(path))||(/Gowun Batang/.test(n.fontName?.family||'')&&n.characters.length>=25);
}
function sizeRole(n){const path=chain(n).join('/');if(/미리보기|작은 메모|최근 남긴 기록|접힌/.test(path))return 'preview';if(/Textarea|TextArea|자유 글|메모 입력|Narrative/.test(path)||n.name==='Value')return 'memo';return n.width<640?'compact':'body';}
const candidates=texts.filter(candidate).filter(n=>{let p=n.parent;while(p&&p.type!=='PAGE'){if(p.type==='INSTANCE')return false;p=p.parent;}return true;});
for(const n of candidates){
 if(n.removed)continue;
 let parent=n.parent;if(parent.type==='INSTANCE'){skipped.push({id:n.id,reason:'instance-governed source; update owning component'});continue;}
 const spans=n.getStyledTextSegments(['fontName','fontSize','fills','textDecoration','textCase']);
 if(spans.some(s=>!/Noto Sans KR|Gowun Batang|NanumMyeongjo/.test(s.fontName.family))){skipped.push({id:n.id,reason:'preserved custom/mixed typeface'});continue;}
 const chars=n.characters,index=parent.children.indexOf(n),w=n.width,position={x:n.x,y:n.y},oldSizing=n.layoutSizingHorizontal;
 const role=sizeRole(n),s=styles.find(s=>s.name==='Observatory/Paper/'+role),size=role==='body'?18:role==='preview'?14:16;
 if(s)await n.setTextStyleIdAsync(s.id);else{n.fontName={family:'NanumMyeongjo',style:'Bold'};n.fontSize=size;n.lineHeight={unit:'PERCENT',value:role==='body'?200:185};n.letterSpacing={unit:'PERCENT',value:role==='body'?-5:-2.5};}
 for(const span of spans){if(span.fontName.style==='ExtraBold'||span.fontName.variationSettings?.wght>=800)n.setRangeFontName(span.start,span.end,{family:'NanumMyeongjo',style:'ExtraBold'});}
 n.textAutoResize='HEIGHT';n.textAlignHorizontal='JUSTIFIED';n.textTruncation='DISABLED';n.resize(w/0.95,n.height);mutated.add(n.id);
 const h=n.height,wrap=figma.createAutoLayout('VERTICAL');createdNodeIds.push(wrap.id);wrap.name='Paper95 / '+n.id;wrap.fills=[];wrap.clipsContent=false;wrap.paddingTop=wrap.paddingBottom=wrap.paddingLeft=wrap.paddingRight=wrap.itemSpacing=0;wrap.resize(w,h);parent.insertChild(index,wrap);wrap.layoutSizingHorizontal='FIXED';wrap.layoutSizingVertical='FIXED';
 if(parent.type==='FRAME'||parent.type==='COMPONENT'){if(parent.layoutMode==='NONE'){wrap.x=position.x;wrap.y=position.y;}else if(oldSizing==='FILL')wrap.layoutSizingHorizontal='FILL';}
 wrap.appendChild(n);n.visible=false;mutated.add(parent.id);
 const clone=n.clone();wrap.appendChild(clone);clone.visible=true;const vector=figma.flatten([clone],wrap);createdNodeIds.push(vector.id);vector.name='장평 95% 조판 / '+n.id;const rawWidth=vector.width,rawHeight=vector.height;vector.resize(rawWidth*0.95,rawHeight);
 vector.layoutPositioning='ABSOLUTE';vector.x=0;vector.y=0;
 if(n.characters!==chars)throw Error('Source changed '+n.id);
 results.push({sourceId:n.id,wrapperId:wrap.id,outlineId:vector.id,role,font:n.fontName,size:n.fontSize,alignment:n.textAlignHorizontal,scale:vector.width/rawWidth,sourcePreserved:true,width:w,height:h});
}
const clips=[];for(const n of page.findAllWithCriteria({types:['FRAME']})){if(n.name==='원본 장면 바깥의 창틀'&&n.clipsContent){n.clipsContent=false;mutated.add(n.id);clips.push(n.id);}}
return {pageId:page.id,createdNodeIds,mutatedNodeIds:[...mutated],updatedCount:results.length,results:results.slice(0,8),allSourcesPreserved:results.every(r=>r.sourcePreserved),allGlyphScalesPass:results.every(r=>Math.abs(r.scale-.95)<.0001),skipped,clipFixedIds:clips};
