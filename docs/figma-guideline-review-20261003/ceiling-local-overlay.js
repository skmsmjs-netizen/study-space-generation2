
const page=await figma.getNodeByIdAsync(PAGE_ID);await figma.setCurrentPageAsync(page);
const all=page.findAll(),buttons=all.filter(n=>n.type==='FRAME'&&n.name==='행동 / 공통 도구 · 천장'&&n.id.startsWith('I'));
if(!buttons.length)return {pageId:page.id,count:0,createdNodeIds:[],mutatedNodeIds:[]};
const source=await figma.getNodeByIdAsync('366:1052'),fonts=new Map();for(const t of source.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);
await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));
let hub=page.children.find(n=>n.name==='천장 공통 도구 · 현재 자리로 복귀');
const created=[],mutated=[];if(!hub){hub=source.clone();page.appendChild(hub);hub.name='천장 공통 도구 · 현재 자리로 복귀';hub.x=Math.max(0,...page.children.filter(n=>n!==hub).map(n=>n.x+n.width))+96;hub.y=48;created.push(hub.id,...hub.findAll().map(n=>n.id));}
for(const b of buttons){await b.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:hub.id,navigation:'OVERLAY',transition:null,resetScrollPosition:false}]}]);mutated.push(b.id);}
if(page.id==='7:75'){const map={'찾기':'29:4495','전체 백업·복구':'29:4858','초안 보관본':'29:4926','내 기록의 저장 상태':'29:5374','설정':'29:5410','도움말·문제 메모':'29:4964'};for(const b of hub.children.filter(n=>n.name.startsWith('공통 도구 / '))){const id=map[b.name.split(' / ')[1]];if(id){await b.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:id,navigation:'NAVIGATE',transition:null,resetScrollPosition:false}]}]);mutated.push(b.id);}}}
return {pageId:page.id,hubId:hub.id,count:buttons.length,createdNodeIds:created,mutatedNodeIds:mutated};

