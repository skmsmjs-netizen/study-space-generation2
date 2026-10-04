const page=await figma.getNodeByIdAsync(PAGE_ID);await figma.setCurrentPageAsync(page);
figma.skipInvisibleInstanceChildren=false;
const ns=page.findAll();
function own(n){while(n&&n.type!=='PAGE'){if(n.type==='INSTANCE'||n.id.startsWith('I'))return false;n=n.parent;}return true;}
function visible(n){while(n&&n.type!=='PAGE'){if(n.visible===false)return false;n=n.parent;}return true;}
const wraps=ns.filter(n=>n.type==='FRAME'&&n.name.startsWith('Paper95 / ')&&own(n));
const bad=[],counts={body18:0,compact16:0,preview14:0,other:0,visibleOutlines:0,editableComponentReferences:0};
for(const w of wraps){const t=w.children.find(n=>n.type==='TEXT');const v=w.children.find(n=>n.type==='VECTOR'&&n.name.startsWith('장평 95%'));if(!t){bad.push({id:w.id,reason:'missing original'});continue;}
 const seg=t.getStyledTextSegments(['fontName']);if(seg.some(s=>s.fontName.family!=='NanumMyeongjo'||!['Bold','ExtraBold'].includes(s.fontName.style))||t.textAlignHorizontal!=='JUSTIFIED')bad.push({id:t.id,reason:'font or alignment'});
 counts[t.fontSize===18?'body18':t.fontSize===16?'compact16':t.fontSize===14?'preview14':'other']++;
 if(v?.visible){counts.visibleOutlines++;if(v.x<-.5||v.y<-.5||v.x+v.width>w.width+1||v.y+v.height>w.height+1)bad.push({id:w.id,reason:'outline exceeds paper box',x:v.x,y:v.y,w:v.width,h:v.height,boxW:w.width,boxH:w.height});}
 else if(t.visible&&v)counts.editableComponentReferences++;
}
const buttons=ns.filter(n=>n.type==='FRAME'&&n.name==='행동 / 공통 도구 · 천장'&&n.id.startsWith('I'));
const ceilingProblems=[];let destinationIds=new Set();for(const b of buttons){const a=b.reactions.flatMap(r=>r.actions||[]).find(a=>a.type==='NODE'&&a.navigation==='OVERLAY');const d=a?.destinationId?await figma.getNodeByIdAsync(a.destinationId):null;if(!d||d.parent?.id!==page.id||a.resetScrollPosition!==false)ceilingProblems.push(b.id);else destinationIds.add(d.id);}
const hubs=[];for(const id of destinationIds){const h=await figma.getNodeByIdAsync(id);hubs.push({id,closeActions:h.findAll(n=>n.reactions?.some(r=>r.actions?.some(a=>a.type==='CLOSE'))).length,tools:h.children.filter(n=>n.name.startsWith('공통 도구 / ')).length});}
const layouts=[];for(const t of TARGETS){const n=await figma.getNodeByIdAsync(t.id);const wrappers=n&&'findAll'in n?n.findAll(x=>x.type==='FRAME'&&x.name.startsWith('OS 레이아웃 / 대표 / '+t.pattern)):[];layouts.push({id:t.id,pattern:t.pattern,exists:!!n,registered:wrappers.length>0,nativeLayout:n?.layoutMode});}
const guidance=ns.filter(n=>n.type==='TEXT'&&own(n)&&visible(n)&&/(본문|명조|장평|적용|기준)/.test(n.characters)&&/(500|장평\s*100|앱.{0,8}대기)/.test(n.characters)).map(n=>({id:n.id,text:n.characters.slice(0,600),parent:n.parent.name}));
const outer=ns.filter(n=>n.type==='FRAME'&&n.name==='원본 장면 바깥의 창틀').map(n=>({id:n.id,clipsContent:n.clipsContent}));
return {pageId:page.id,pageName:page.name,wrapperCount:wraps.length,counts,paperProblems:bad,ceilingCount:buttons.length,ceilingProblems,hubs,layouts,staleGuidanceCandidates:guidance,outerFrames:outer,remainingTemporaryNodes:ns.filter(n=>/임시 조판 계측/.test(n.name)).map(n=>n.id)};
