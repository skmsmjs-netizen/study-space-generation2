const fit=await(async()=>{
const page=await figma.getNodeByIdAsync(PAGE_ID);await figma.setCurrentPageAsync(page);
const changed=new Set(),made=[],samples=[],fonts=new Map(),parents=new Map();
function own(n){let p=n;while(p&&p.type!=='PAGE'){if(p.type==='INSTANCE'||p.id.startsWith('I'))return false;p=p.parent;}return true;}
function visible(n){let p=n;while(p&&p.type!=='PAGE'){if(p.visible===false)return false;p=p.parent;}return true;}
const wraps=page.findAll(n=>n.type==='FRAME'&&n.name.startsWith('Paper95 / ')&&own(n));
const pairs=[];for(const w of wraps){const v=w.children.find(n=>n.type==='VECTOR'&&n.name.startsWith('장평 95%')&&n.visible);const t=w.children.find(n=>n.type==='TEXT');if(v&&t&&visible(w)){pairs.push({w,v,t});for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);}let p=w;while(p&&p.type!=='PAGE'){if(own(p))parents.set(p.id,p);p=p.parent;}}
for(const n of page.findAll(n=>n.type==='COMPONENT'&&n.children.some(c=>c.name==='행동 / 공통 도구 · 천장')))parents.set(n.id,n);
await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));
let metrics=0;
if(pairs.length){const temp=figma.createFrame();page.appendChild(temp);temp.name='임시 조판 계측';temp.fills=[];temp.clipsContent=false;temp.x=Math.max(0,...page.children.filter(n=>n!==temp).map(n=>n.x+n.width))+512;temp.y=0;temp.resize(8192,8192);made.push(temp.id);
 for(const {v,t}of pairs){const clone=t.clone();temp.appendChild(clone);clone.visible=true;clone.x=clone.y=0;made.push(clone.id);const box=clone.absoluteRenderBounds,origin=temp.absoluteBoundingBox;if(box&&origin){v.x=(box.x-origin.x)*.95;v.y=box.y-origin.y;changed.add(v.id);metrics++;}clone.remove();}
 temp.remove();}
function depth(n){let k=0,p=n;while(p&&p.type!=='PAGE'){k++;p=p.parent;}return k;}
for(const n of [...parents.values()].sort((a,b)=>depth(b)-depth(a))){if((n.type!=='FRAME'&&n.type!=='COMPONENT')||n.layoutMode==='NONE')continue;const flow=n.children.filter(c=>c.visible&&c.layoutPositioning!=='ABSOLUTE');if(!flow.length)continue;
 const isViewport=/^(R|O|U)\d+@|@ipad|@iphone/.test(n.name)||n.overflowDirection!=='NONE';
 const needed=n.layoutMode==='VERTICAL'?flow.reduce((s,c)=>s+c.height,0)+n.itemSpacing*(flow.length-1)+n.paddingTop+n.paddingBottom:Math.max(...flow.map(c=>c.y+c.height))+n.paddingBottom;
 const canGrow=n.layoutMode==='VERTICAL'?n.primaryAxisSizingMode==='AUTO'||!isViewport:n.counterAxisSizingMode==='AUTO';
 if(canGrow&&!isViewport&&needed>n.height+.1){const pm=n.primaryAxisSizingMode,cm=n.counterAxisSizingMode;const old=n.height;n.resize(n.width,needed);n.primaryAxisSizingMode=pm;n.counterAxisSizingMode=cm;changed.add(n.id);if(samples.length<8)samples.push({id:n.id,name:n.name,oldHeight:old,height:needed});}
}
return {pageId:page.id,originAdjustedCount:metrics,grownCount:changed.size-metrics,removedTemporaryNodeIds:made,mutatedNodeIds:[...changed],samples};

})();
const ceiling=await(async()=>{
const page=figma.currentPage;
const all=page.findAll(),buttons=all.filter(n=>n.type==='FRAME'&&n.name==='행동 / 공통 도구 · 천장'&&n.id.startsWith('I'));
if(!buttons.length)return {pageId:page.id,count:0,createdNodeIds:[],mutatedNodeIds:[]};
const source=await figma.getNodeByIdAsync('366:1052'),fonts=new Map();for(const t of source.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);
await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));
let hub=page.children.find(n=>n.name==='천장 공통 도구 · 현재 자리로 복귀');
const created=[],mutated=[];if(!hub){hub=source.clone();page.appendChild(hub);hub.name='천장 공통 도구 · 현재 자리로 복귀';hub.x=Math.max(0,...page.children.filter(n=>n!==hub).map(n=>n.x+n.width))+96;hub.y=48;created.push(hub.id,...hub.findAll().map(n=>n.id));}
for(const b of buttons){await b.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:hub.id,navigation:'OVERLAY',transition:null,resetScrollPosition:false}]}]);mutated.push(b.id);}
if(page.id==='7:75'){const map={'찾기':'29:4495','전체 백업·복구':'29:4858','초안 보관본':'29:4926','내 기록의 저장 상태':'29:5374','설정':'29:5410','도움말·문제 메모':'29:4964'};for(const b of hub.children.filter(n=>n.name.startsWith('공통 도구 / '))){const id=map[b.name.split(' / ')[1]];if(id){await b.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:id,navigation:'NAVIGATE',transition:null,resetScrollPosition:false}]}]);mutated.push(b.id);}}}
return {pageId:page.id,hubId:hub.id,count:buttons.length,createdNodeIds:created,mutatedNodeIds:mutated};

})();
return {pageId:PAGE_ID,originAdjustedCount:fit.originAdjustedCount,grownCount:fit.grownCount,ceilingCount:ceiling.count,hubId:ceiling.hubId,samples:fit.samples,createdNodeIds:ceiling.createdNodeIds,mutatedNodeIds:[...new Set([...fit.mutatedNodeIds,...ceiling.mutatedNodeIds])],removedTemporaryNodeIds:fit.removedTemporaryNodeIds};