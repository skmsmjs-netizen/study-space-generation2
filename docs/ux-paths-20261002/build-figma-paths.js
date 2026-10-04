/* Native Figma async body; root alone executes. INPUT {pageId?,pageName,runKey,group,items,
 columnWidth?,columns?,offsetX?,offsetY?,checksum?,variableIds?:{paper,ink,border,accent}}.
 Items {id,title,body:string|string[],source?,kind?,url?,displayMode?,references?}.
 Figma is a summary/reference surface. Whole handler traces stay in source-actions.json/Markdown.
 Writes only the dedicated page. Existing pages are preserved. All structural containers use auto-layout. */
const pageName='20 전체 UX 경우·경로';
if(INPUT.pageName&&INPUT.pageName!==pageName)throw Error('Dedicated UX page only');
const displayMode='summary-reference-v1';
if(INPUT.displayMode&&INPUT.displayMode!==displayMode)throw Error('Figma UX publishing requires summary/reference mode; full expressions stay in local source documents');
const brief=(value,limit=260)=>{const s=String(value||'').replace(/\s+/g,' ').trim();return s.length<=limit?s:s.slice(0,limit-1)+'…';};
function displayBody(item){
 const original=Array.isArray(item.body)?item.body.join('\n\n'):String(item.body||'');
 if(item.displayMode&&item.displayMode!==displayMode)throw Error('Wrong UX projection mode: '+item.id);
 if(item.displayMode===displayMode){if(original.length>1600)throw Error('Compact card exceeds display budget: '+item.id);return original;}
 // Backward compatibility: previous batches are reduced before creating any text nodes.
 if(original.length<=1500&&!original.includes('핸들러의 조건별 갈림길'))return original;
 const lines=Array.isArray(item.body)?item.body:original.split(/\n\n/);
 const accepted=lines.filter(line=>/^(진입:|복귀:|공통 상태:|표면:|표시:|차단:|이벤트:|링크:|결과 핸들러:|반복:|전체 결과)/.test(line));
 const refs=item.id.startsWith('X-')?'source-actions.json과 actions/*.md의 동일 조작 ID':'paths/'+item.id+'.md와 source-actions.json';
 return (accepted.length?accepted.map(line=>brief(line,180)).slice(0,7):[brief(original,1100)]).concat(['전체 조건·결과 원문: '+refs]).join('\n\n');
}
const preparedItems=(INPUT.items||[]).map(item=>({item,body:displayBody(item)}));
const beforePageIds=new Set(figma.root.children.map(p=>p.id));
const page=INPUT.pageId?await figma.getNodeByIdAsync(INPUT.pageId):figma.root.children.find(p=>p.name===pageName)||figma.createPage();
if(!page||page.type!=='PAGE'||(INPUT.pageId&&page.name!==pageName))throw Error('Wrong dedicated page');
page.name=pageName;await figma.setCurrentPageAsync(page);
const font={family:'Noto Sans KR',style:'Regular'};await figma.loadFontAsync(font);
const created=new Set(beforePageIds.has(page.id)?[]:[page.id]),mutated=new Set([page.id]),removedIds=[],mapping={},bounds={},referenceIndex={};
const rgb=h=>({r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255});
const colors={paper:'#f2ead8',ink:'#25292b',border:'#c3b89f',accent:'#385763',muted:'#535a5f'};
const variables={};for(const[name,id]of Object.entries(INPUT.variableIds||{})){const v=await figma.variables.getVariableByIdAsync(id);if(v)variables[name]=v;}
function paint(name){let p={type:'SOLID',color:rgb(colors[name])};if(variables[name])p=figma.variables.setBoundVariableForPaint(p,'color',variables[name]);return p;}
const width=INPUT.columnWidth||1120,count=INPUT.columns||4,gap=32,group=INPUT.group||'surfaces',runKey=INPUT.runKey||'source-paths-20261002';
function auto(name,parent,w,direction='VERTICAL',card=false){const n=figma.createAutoLayout(direction);created.add(n.id);n.name=name;n.resize(w,60);n.primaryAxisSizingMode=direction==='HORIZONTAL'?'FIXED':'AUTO';n.counterAxisSizingMode=direction==='HORIZONTAL'?'AUTO':'FIXED';n.itemSpacing=card?12:gap;n.paddingTop=n.paddingBottom=n.paddingLeft=n.paddingRight=card?24:0;n.fills=card?[paint('paper')]:[];n.strokes=card?[paint('border')]:[];n.strokeWeight=1;n.cornerRadius=card?4:0;n.clipsContent=false;parent.appendChild(n);return n;}
function txt(name,value,parent,size=16,color='ink'){const n=figma.createText();created.add(n.id);n.name=name;n.fontName=font;n.fontSize=size;n.lineHeight={unit:'PERCENT',value:155};n.fills=[paint(color)];n.characters=String(value||'');n.resize(width-48,Math.max(24,size*1.55));parent.appendChild(n);n.layoutSizingHorizontal='FILL';n.textAutoResize='HEIGHT';if(n.width<=0)throw Error('Invalid text width');return n;}
const groupName='[UXPATH '+runKey+'/'+group+']';let groupNode=page.children.find(n=>n.name===groupName);
if(groupNode&&groupNode.type!=='FRAME')throw Error('Managed group is not a frame');
if(!groupNode){groupNode=auto(groupName,page,count*width+(count-1)*gap,'HORIZONTAL');groupNode.x=100+(INPUT.offsetX||0);groupNode.y=100+(INPUT.offsetY||0);}
mutated.add(groupNode.id);
const columns=[];for(let i=0;i<count;i++){const name='Column '+(i+1);let col=groupNode.children.find(n=>n.name===name);if(col&&col.type!=='FRAME')throw Error('Managed column is not a frame');if(!col)col=auto(name,groupNode,width);columns.push(col);}
function deleteTree(n){removedIds.push(n.id);if('children'in n)n.children.forEach(deleteTree);}
for(const {item,body} of preparedItems){
 referenceIndex[item.id]={...(item.references||{}),actionIds:item.references?.actionIds||[...new Set((Array.isArray(item.body)?item.body.join('\n'):String(item.body||'')).match(/\bX-[a-z0-9]+\b/g)||[])]};
 const prefix='['+item.id+'] ';let card=columns.flatMap(c=>c.children).find(n=>n.name.startsWith(prefix));
 if(card){if(card.type!=='FRAME')throw Error('Managed card is not a frame');for(const child of [...card.children]){deleteTree(child);child.remove();}mutated.add(card.id);}
 else{const col=columns.reduce((a,b)=>a.height<=b.height?a:b);card=auto(prefix+item.title,col,width,'VERTICAL',true);}
 mutated.add(card.parent.id);card.name=prefix+item.title;
 txt('범위·근거',item.id+' · '+(item.kind||'소스 UX 경로'),card,14,'accent');txt('제목',item.title,card,24);
 if(item.source)txt('실제 소스',item.source,card,14,'muted');
 txt('조건·행동·결과 1',body,card,16);
 if(item.url){const link=txt('실제 디자인 화면 열기','해당 디자인 화면 열기 ↗',card,16,'accent');link.setRangeHyperlink(0,link.characters.length,{type:'URL',value:item.url});}
 mapping[item.id]=card.id;bounds[item.id]={width:card.width,height:card.height};
}
return {pageId:page.id,pageName:page.name,groupId:groupNode.id,group,displayMode,createdNodeIds:[...created],mutatedNodeIds:[...mutated],removedNodeIds:removedIds,mapping,bounds,referenceIndex,sourceChecksum:INPUT.checksum||null,runtimeTested:false};
