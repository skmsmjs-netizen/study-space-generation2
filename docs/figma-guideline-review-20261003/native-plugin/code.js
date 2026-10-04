async function apply(args){const PAGE_ID=args.pageId,ROOT_IDS=args.rootIds||[];
// Reuses the existing measured atom / inter-word justification procedure.
// Unlike the previous rebuild, original text, formula, paragraph and row IDs
// are retained. Only prose outlines and layout parents are added.
const page=await figma.getNodeByIdAsync(PAGE_ID);await figma.setCurrentPageAsync(page);figma.skipInvisibleInstanceChildren=false;
const roots=ROOT_IDS.length?await Promise.all(ROOT_IDS.map(id=>figma.getNodeByIdAsync(id))):page.children.filter(n=>n.type==='FRAME'&&(/OS판본 · |대표|전집/.test(n.name)));
const fonts=new Map();for(const root of roots)for(const t of root.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);
await Promise.all([...fonts.values(),{family:'NanumMyeongjo',style:'Bold'}].map(f=>loadFont(f)));
const createdNodeIds=[],changed=new Set(),failures=[],results=[];const made=n=>{createdNodeIds.push(n.id);return n;};
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(16);}
function sourceStamp(root){return hash(root.findAllWithCriteria({types:['TEXT']}).map(n=>n.id+'='+n.characters).sort().join('\n'));}
function mathStamp(root){return hash(JSON.stringify(root.findAll(n=>n.type==='VECTOR'||n.type==='LINE'||n.type==='ELLIPSE'||n.type==='RECTANGLE').filter(n=>!n.name.startsWith('장평 95%')).map(n=>[n.id,n.width,n.height,n.rotation,'vectorPaths'in n?n.vectorPaths:undefined]).sort((a,b)=>a[0].localeCompare(b[0]))));}
function frame(parent,name,w,h,dir='VERTICAL'){const f=made(createAutoLayout(dir));parent.appendChild(f);f.name=name;f.fills=[];f.clipsContent=false;f.itemSpacing=f.paddingTop=f.paddingBottom=f.paddingLeft=f.paddingRight=0;f.resize(w,h);f.layoutSizingHorizontal='FIXED';f.layoutSizingVertical='FIXED';return f;}
function setType(t){const spans=t.getStyledTextSegments(['fontName']);for(const s of spans)t.setRangeFontName(s.start,s.end,{family:'NanumMyeongjo',style:s.fontName.style==='ExtraBold'||s.fontName.variationSettings?.wght>=800?'ExtraBold':'Bold'});t.lineHeight={unit:'PERCENT',value:200};t.letterSpacing={unit:'PERCENT',value:-5};t.textTruncation='DISABLED';changed.add(t.id);}
function outline(t,parent,width,height){const w=frame(parent,'Paper95 / '+t.id,width,height);w.appendChild(t);t.visible=false;changed.add(t.id);const c=t.clone();w.appendChild(c);c.visible=true;const v=made(figma.flatten([c],w));v.name='장평 95% 조판 / '+t.id;const raw=v.width;v.resize(raw*.95,v.height);v.layoutPositioning='ABSOLUTE';v.x=v.y=0;if(Math.abs(v.width/raw-.95)>.0001)throw Error('Glyph width mismatch');return w;}
function atoms(paragraph){return paragraph.children.filter(n=>n.name==='읽기 줄'&&n.visible).flatMap(row=>row.children.filter(n=>n.name!=='조판 추가 여백'));}
function fragmentWords(n,parent,width){
 n.visible=false;changed.add(n.id);const out=[];
 for(const m of n.characters.matchAll(/\s+|\S+/gu)){
  const c=n.clone();parent.appendChild(c);c.visible=true;
  const end=m.index+m[0].length;if(end<c.characters.length)c.deleteCharacters(end,c.characters.length);if(m.index)c.deleteCharacters(0,m.index);
  c.textAutoResize='WIDTH_AND_HEIGHT';c.textAlignHorizontal='LEFT';const space=/^\s+$/u.test(m[0]),hardBreak=/[\r\n]/.test(m[0]);
  if(space){const w=hardBreak?.01:Math.max(3,c.width*.95),h=36*Math.max(1,(m[0].match(/\n/g)||[]).length);const f=frame(parent,'원문 공백 / '+n.id+':'+m.index,w,h);c.remove();out.push({node:f,text:m[0],space:true,hardBreak,width:w,height:h});continue;}
  if(c.width*.95>width){c.textAutoResize='HEIGHT';c.resize(width/.95,c.height);c.textAlignHorizontal='JUSTIFIED';}
  const f=frame(parent,'Paper95 / '+n.id+':'+m.index,Math.min(width,c.width*.95),c.height);f.appendChild(c);const v=made(figma.flatten([c],f));v.name='장평 95% 조판 / '+n.id+':'+m.index;v.resize(v.width*.95,v.height);v.layoutPositioning='ABSOLUTE';v.x=v.y=0;
  if(v.width>width+.1)throw Error('Long text still overflows '+n.id);
  out.push({node:f,text:m[0],space:false,width:f.width,height:f.height});
 }
 return out;
}
function sourceOf(a){return a.map(n=>n.type==='TEXT'?n.characters:n.name==='원문 띄어쓰기'?' ':n.name).join('');}
function rowsFor(a,width){const units=[];for(const x of a){if(x.space)units.push([x]);else{const last=units[units.length-1];if(last&&!last[0].space)last.push(x);else units.push([x]);}}let row=[],used=0;const rows=[];function finish(){if(row.length)rows.push(row);row=[];used=0;}for(const unit of units){if(unit[0].hardBreak){row.push(...unit);finish();continue;}const w=unit.reduce((s,x)=>s+x.width,0);if(unit[0].space){row.push(...unit);used+=w;continue;}if(w<=width+.05){if(used+w>width+.05&&row.some(x=>!x.space))finish();row.push(...unit);used+=w;}else for(const x of unit){if(x.width>width+.05)throw Error('Unbreakable atom exceeds width');if(used+x.width>width+.05&&row.some(x=>!x.space))finish();row.push(x);used+=x.width;}}finish();return rows;}
for(const root of roots){
 const before=sourceStamp(root),mathBefore=mathStamp(root),count={native:0,rich:0,words:0};
 try{
 const paras=root.findAll(n=>n.name==='본문 문단'&&n.visible&&n.parent.name==='본문');
 for(const para of paras){
  if(para.type==='INSTANCE')continue;
  if(para.type!=='FRAME'||para.children.some(n=>n.name==='읽기 줄 · 700/95%'))continue;
  const originalAtoms=atoms(para);if(!originalAtoms.length)continue;const source=sourceOf(originalAtoms),oldRows=para.children.filter(n=>n.name==='읽기 줄'&&n.visible),width=para.width;
  const measured=[];
  for(const n of originalAtoms){
   if(n.name==='원문 띄어쓰기'){measured.push({node:n,text:' ',space:true,width:n.width*.95,height:36});continue;}
   if(n.type!=='TEXT'){measured.push({node:n,text:n.name,space:false,width:n.width,height:n.height});continue;}
   setType(n);n.visible=false;changed.add(n.id);
   for(const m of n.characters.matchAll(/\s+|\S+/gu)){
    const c=n.clone();para.appendChild(c);c.visible=true;c.layoutPositioning='ABSOLUTE';
    const end=m.index+m[0].length;if(end<c.characters.length)c.deleteCharacters(end,c.characters.length);if(m.index)c.deleteCharacters(0,m.index);
    c.textAutoResize='WIDTH_AND_HEIGHT';c.textAlignHorizontal='LEFT';
    const space=/^\s+$/u.test(m[0]),hardBreak=/[\r\n]/.test(m[0]);
    if(space){const w=hardBreak?.01:Math.max(3,c.width*.95);c.remove();measured.push({node:null,text:m[0],space:true,hardBreak,width:w,height:36});continue;}
    if(c.width*.95>width){c.textAutoResize='HEIGHT';c.resize(width/.95,c.height);c.textAlignHorizontal='JUSTIFIED';}
    if(c.width*.95>width+.1)throw Error('Long word cannot fit '+n.id);
    measured.push({node:c,text:m[0],space:false,prose:true,width:c.width*.95,height:c.height});count.words++;
   }
  }
  const rows=rowsFor(measured,width);
  for(let i=0;i<rows.length;i++){
   const a=rows[i],height=Math.max(36,...a.map(x=>x.height)),r=frame(para,'읽기 줄 · 700/95%',width,height,'HORIZONTAL');
   const first=a.findIndex(x=>!x.space),last=a.findLastIndex(x=>!x.space),spaces=a.filter((x,j)=>x.space&&j>first&&j<last&&!x.hardBreak);
   const natural=a.reduce((s,x,j)=>s+(x.space&&(j<first||j>last)?.01:x.width),0);
   if(natural>width+.1)throw Error('Line overflow');
   const extra=i===rows.length-1||!spaces.length?0:Math.max(0,(width-natural)/spaces.length);
   const temp=figma.createFrame();r.appendChild(temp);temp.fills=[];temp.clipsContent=false;temp.resize(width/.95,height);temp.layoutPositioning='ABSOLUTE';temp.x=temp.y=0;
   let x=0;const prose=[];
   for(let j=0;j<a.length;j++){
    const item=a[j];
    if(item.space){x+=(j<first||j>last)?.01:item.width+extra;continue;}
    (item.prose?temp:r).appendChild(item.node);if(!item.prose)item.node.layoutPositioning='ABSOLUTE';item.node.x=item.prose?x/.95:x;item.node.y=(height-item.height)/2;
    if(item.prose)prose.push(item.node);else changed.add(item.node.id);
    x+=item.width;
   }
   if(prose.length){const v=made(figma.flatten(prose,temp));const vx=v.x,vy=v.y;v.name='장평 95% 조판 / '+para.id+':'+i+' / 기준선 보존';r.appendChild(v);v.resize(v.width*.95,v.height);v.layoutPositioning='ABSOLUTE';v.x=vx*.95;v.y=vy;}
   temp.remove();
  }
  for(const r of oldRows){r.visible=false;changed.add(r.id);}para.primaryAxisSizingMode='AUTO';para.clipsContent=false;para.itemSpacing=0;changed.add(para.id);
  if(measured.map(x=>x.text).join('')!==source)throw Error('Rich source order changed');count.rich++;
 }
 // Grow the existing generated paper; diagrams retain local geometry.
 const papers=root.children.filter(n=>n.type==='FRAME');for(const p of papers){if(p.layoutMode!=='NONE'){p.primaryAxisSizingMode='AUTO';p.clipsContent=false;changed.add(p.id);}}
 const maximum=Math.max(...papers.map(n=>n.height),0);for(const p of papers){if(p.layoutMode!=='NONE'){p.resize(p.width,maximum);p.primaryAxisSizingMode='FIXED';changed.add(p.id);}}
 const after=sourceStamp(root),mathAfter=mathStamp(root);if(before!==after)throw Error('Source IDs or characters changed');if(mathBefore!==mathAfter)throw Error('Original math geometry changed');
 results.push({id:root.id,name:root.name,...count,sourcePreserved:true,mathPreserved:true,height:root.height});
 }catch(e){failures.push({id:root.id,error:String(e.message||e)});throw e;}
}
// Reconcile page-level spacing once after all bounded batches have completed.
return {pageId:page.id,rootCount:results.length,nativeParagraphCount:results.reduce((s,r)=>s+r.native,0),richParagraphCount:results.reduce((s,r)=>s+r.rich,0),wordCount:results.reduce((s,r)=>s+r.words,0),allSourcesPreserved:results.every(r=>r.sourcePreserved),allMathPreserved:results.every(r=>r.mathPreserved),failures,createdCount:createdNodeIds.length,mutatedCount:changed.size,createdNodeIds,mutatedNodeIds:[...changed]};


}
async function repair(args){const PAGE_ID=args.pageId,ROOT_IDS=args.rootIds||[];
// Reuses the existing measured atom / inter-word justification procedure.
// Unlike the previous rebuild, original text, formula, paragraph and row IDs
// are retained. Only prose outlines and layout parents are added.
const page=await figma.getNodeByIdAsync(PAGE_ID);await figma.setCurrentPageAsync(page);figma.skipInvisibleInstanceChildren=false;
const roots=ROOT_IDS.length?await Promise.all(ROOT_IDS.map(id=>figma.getNodeByIdAsync(id))):page.children.filter(n=>n.type==='FRAME'&&(/OS판본 · |대표|전집/.test(n.name)));
const fonts=new Map();for(const root of roots)for(const t of root.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);
await Promise.all([...fonts.values(),{family:'NanumMyeongjo',style:'Bold'}].map(f=>loadFont(f)));
const createdNodeIds=[],changed=new Set(),failures=[],results=[];const made=n=>{createdNodeIds.push(n.id);return n;};
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(16);}
function sourceStamp(root){return hash(root.findAllWithCriteria({types:['TEXT']}).map(n=>n.id+'='+n.characters).sort().join('\n'));}
function mathStamp(root){return hash(JSON.stringify(root.findAll(n=>n.type==='VECTOR'||n.type==='LINE'||n.type==='ELLIPSE'||n.type==='RECTANGLE').filter(n=>!n.name.startsWith('장평 95%')).map(n=>[n.id,n.width,n.height,n.rotation,'vectorPaths'in n?n.vectorPaths:undefined]).sort((a,b)=>a[0].localeCompare(b[0]))));}
function frame(parent,name,w,h,dir='VERTICAL'){const f=made(createAutoLayout(dir));parent.appendChild(f);f.name=name;f.fills=[];f.clipsContent=false;f.itemSpacing=f.paddingTop=f.paddingBottom=f.paddingLeft=f.paddingRight=0;f.resize(w,h);f.layoutSizingHorizontal='FIXED';f.layoutSizingVertical='FIXED';return f;}
function setType(t){const spans=t.getStyledTextSegments(['fontName']);for(const s of spans)t.setRangeFontName(s.start,s.end,{family:'NanumMyeongjo',style:s.fontName.style==='ExtraBold'||s.fontName.variationSettings?.wght>=800?'ExtraBold':'Bold'});t.lineHeight={unit:'PERCENT',value:200};t.letterSpacing={unit:'PERCENT',value:-5};t.textTruncation='DISABLED';changed.add(t.id);}
function outline(t,parent,width,height){const w=frame(parent,'Paper95 / '+t.id,width,height);w.appendChild(t);t.visible=false;changed.add(t.id);const c=t.clone();w.appendChild(c);c.visible=true;const v=made(figma.flatten([c],w));v.name='장평 95% 조판 / '+t.id;const raw=v.width;v.resize(raw*.95,v.height);v.layoutPositioning='ABSOLUTE';v.x=v.y=0;if(Math.abs(v.width/raw-.95)>.0001)throw Error('Glyph width mismatch');return w;}
function atoms(paragraph){return paragraph.children.filter(n=>n.name==='읽기 줄'&&n.visible).flatMap(row=>row.children.filter(n=>n.name!=='조판 추가 여백'));}
function fragmentWords(n,parent,width){
 n.visible=false;changed.add(n.id);const out=[];
 for(const m of n.characters.matchAll(/\s+|\S+/gu)){
  const c=n.clone();parent.appendChild(c);c.visible=true;
  const end=m.index+m[0].length;if(end<c.characters.length)c.deleteCharacters(end,c.characters.length);if(m.index)c.deleteCharacters(0,m.index);
  c.textAutoResize='WIDTH_AND_HEIGHT';c.textAlignHorizontal='LEFT';const space=/^\s+$/u.test(m[0]),hardBreak=/[\r\n]/.test(m[0]);
  if(space){const w=hardBreak?.01:Math.max(3,c.width*.95),h=36*Math.max(1,(m[0].match(/\n/g)||[]).length);const f=frame(parent,'원문 공백 / '+n.id+':'+m.index,w,h);c.remove();out.push({node:f,text:m[0],space:true,hardBreak,width:w,height:h});continue;}
  if(c.width*.95>width){c.textAutoResize='HEIGHT';c.resize(width/.95,c.height);c.textAlignHorizontal='JUSTIFIED';}
  const f=frame(parent,'Paper95 / '+n.id+':'+m.index,Math.min(width,c.width*.95),c.height);f.appendChild(c);const v=made(figma.flatten([c],f));v.name='장평 95% 조판 / '+n.id+':'+m.index;v.resize(v.width*.95,v.height);v.layoutPositioning='ABSOLUTE';v.x=v.y=0;
  if(v.width>width+.1)throw Error('Long text still overflows '+n.id);
  out.push({node:f,text:m[0],space:false,width:f.width,height:f.height});
 }
 return out;
}
function sourceOf(a){return a.map(n=>n.type==='TEXT'?n.characters:n.name==='원문 띄어쓰기'?' ':n.name).join('');}
function rowsFor(a,width){const units=[];for(const x of a){if(x.space)units.push([x]);else{const last=units[units.length-1];if(last&&!last[0].space)last.push(x);else units.push([x]);}}let row=[],used=0;const rows=[];function finish(){if(row.length)rows.push(row);row=[];used=0;}for(const unit of units){if(unit[0].hardBreak){row.push(...unit);finish();continue;}const w=unit.reduce((s,x)=>s+x.width,0);if(unit[0].space){row.push(...unit);used+=w;continue;}if(w<=width+.05){if(used+w>width+.05&&row.some(x=>!x.space))finish();row.push(...unit);used+=w;}else for(const x of unit){if(x.width>width+.05)throw Error('Unbreakable atom exceeds width');if(used+x.width>width+.05&&row.some(x=>!x.space))finish();row.push(x);used+=x.width;}}finish();return rows;}
for(const root of roots){
 const before=sourceStamp(root),mathBefore=mathStamp(root),count={native:0,rich:0,words:0};
 try{
 const paras=root.findAll(n=>n.name==='본문 문단'&&n.visible&&n.parent.name==='본문');
 for(const para of paras){
  if(para.type==='INSTANCE')continue;
  if(para.type!=='FRAME')continue;
  const activeRows=para.children.filter(n=>n.name==='읽기 줄 · 700/95%'&&n.visible);
  if(!activeRows.length)continue;
  const glyphs=activeRows.flatMap(r=>r.findAll(n=>n.type==='VECTOR'&&n.name.startsWith('장평 95%')));
  if(glyphs.length&&glyphs.every(n=>Number(n.id.split(':')[0])>=129))continue;
  const gaps=para.findAll(n=>n.type==='FRAME'&&n.name==='원문 띄어쓰기');// Zero explicit gap frames can still contain whitespace in original text.
  const prose=para.findAllWithCriteria({types:['TEXT']}).filter(n=>n.getStyledTextSegments(['fontName']).some(s=>s.fontName.family==='NanumMyeongjo')&&!(()=>{let p=n.parent;while(p&&p!==para){if(/^\$/.test(p.name))return true;p=p.parent;}return false;})());
  const math=activeRows.flatMap(r=>r.children.filter(n=>n.type==='FRAME'&&/^\$/.test(n.name)));
  const items=[...prose,...gaps,...math],prefix=para.id.split(':')[0],key=n=>Number(n.id.split(':')[1]);
  const sortedCore=[...prose,...math].sort((a,b)=>key(a)-key(b)).map(n=>n.id);
  const observed=[];for(const row of activeRows)for(const n of row.children){let id=n.type==='FRAME'&&/^\$/.test(n.name)?n.id:n.name.startsWith('Paper95 / ')?n.name.slice(10).match(/^\d+:\d+/)?.[0]:null;if(id&&observed[observed.length-1]!==id)observed.push(id);}
  const orderByDisplay=JSON.stringify(sortedCore)===JSON.stringify(observed);
  const orderByOriginal=prose.every((n,i)=>!i||key(n)>key(prose[i-1]))&&math.every((n,i)=>!i||key(n)>key(math[i-1]));
  const rowAtoms=[];for(const row of activeRows)for(const n of row.children){if(n.name.startsWith('Paper95 / ')){const sourceId=n.name.slice(10).match(/^\d+:\d+/)?.[0];const original=n.children?.find(x=>x.type==='TEXT'&&x.id===sourceId);if(original)rowAtoms.push(original);}else if(n.type==='TEXT'||n.type==='FRAME'&&/^\$/.test(n.name))rowAtoms.push(n);}
  const rowProof=!gaps.length&&rowAtoms.length===items.length&&items.every(n=>rowAtoms.includes(n));
  if(!rowProof&&(items.some(n=>n.id.split(':')[0]!==prefix)||!(orderByOriginal||orderByDisplay))){failures.push({id:para.id,reason:'preserved source; generated creation order not verified'});continue;}
  const originalAtoms=rowProof?rowAtoms:items.sort((a,b)=>key(a)-key(b));if(!originalAtoms.length)continue;
  const source=sourceOf(originalAtoms),oldRows=activeRows,width=para.width;
  const measured=[];
  for(const n of originalAtoms){
   if(n.name==='원문 띄어쓰기'){measured.push({node:n,text:' ',space:true,width:n.width*.95,height:36});continue;}
   if(n.type!=='TEXT'){measured.push({node:n,text:n.name,space:false,width:n.width,height:n.height});continue;}
   setType(n);n.visible=false;changed.add(n.id);
   for(const m of n.characters.matchAll(/\s+|\S+/gu)){
    const c=n.clone();para.appendChild(c);c.visible=true;c.layoutPositioning='ABSOLUTE';
    const end=m.index+m[0].length;if(end<c.characters.length)c.deleteCharacters(end,c.characters.length);if(m.index)c.deleteCharacters(0,m.index);
    c.textAutoResize='WIDTH_AND_HEIGHT';c.textAlignHorizontal='LEFT';
    const space=/^\s+$/u.test(m[0]),hardBreak=/[\r\n]/.test(m[0]);
    if(space){const w=hardBreak?.01:Math.max(3,c.width*.95);c.remove();measured.push({node:null,text:m[0],space:true,hardBreak,width:w,height:36});continue;}
    if(c.width*.95>width){c.textAutoResize='HEIGHT';c.resize(width/.95,c.height);c.textAlignHorizontal='JUSTIFIED';}
    if(c.width*.95>width+.1)throw Error('Long word cannot fit '+n.id);
    measured.push({node:c,text:m[0],space:false,prose:true,width:c.width*.95,height:c.height});count.words++;
   }
  }
  const rows=rowsFor(measured,width);
  for(let i=0;i<rows.length;i++){
   const a=rows[i],height=Math.max(36,...a.map(x=>x.height)),r=frame(para,'읽기 줄 · 700/95%',width,height,'HORIZONTAL');
   const first=a.findIndex(x=>!x.space),last=a.findLastIndex(x=>!x.space),spaces=a.filter((x,j)=>x.space&&j>first&&j<last&&!x.hardBreak);
   const natural=a.reduce((s,x,j)=>s+(x.space&&(j<first||j>last)?.01:x.width),0);
   if(natural>width+.1)throw Error('Line overflow');
   const extra=i===rows.length-1||!spaces.length?0:Math.max(0,(width-natural)/spaces.length);
   const temp=figma.createFrame();r.appendChild(temp);temp.fills=[];temp.clipsContent=false;temp.resize(width/.95,height);temp.layoutPositioning='ABSOLUTE';temp.x=temp.y=0;
   let x=0;const prose=[];
   for(let j=0;j<a.length;j++){
    const item=a[j];
    if(item.space){x+=(j<first||j>last)?.01:item.width+extra;continue;}
    (item.prose?temp:r).appendChild(item.node);if(!item.prose)item.node.layoutPositioning='ABSOLUTE';item.node.x=item.prose?x/.95:x;item.node.y=(height-item.height)/2;
    if(item.prose)prose.push(item.node);else changed.add(item.node.id);
    x+=item.width;
   }
   if(prose.length){const v=made(figma.flatten(prose,temp));const vx=v.x,vy=v.y;v.name='장평 95% 조판 / '+para.id+':'+i+' / 기준선 보존';r.appendChild(v);v.resize(v.width*.95,v.height);v.layoutPositioning='ABSOLUTE';v.x=vx*.95;v.y=vy;}
   temp.remove();
  }
  for(const r of oldRows){r.visible=false;changed.add(r.id);}para.primaryAxisSizingMode='AUTO';para.clipsContent=false;para.itemSpacing=0;changed.add(para.id);
  if(measured.map(x=>x.text).join('')!==source)throw Error('Rich source order changed');count.rich++;
 }
 // Grow the existing generated paper; diagrams retain local geometry.
 const papers=root.children.filter(n=>n.type==='FRAME');for(const p of papers){if(p.layoutMode!=='NONE'){p.primaryAxisSizingMode='AUTO';p.clipsContent=false;changed.add(p.id);}}
 const maximum=Math.max(...papers.map(n=>n.height),0);for(const p of papers){if(p.layoutMode!=='NONE'){p.resize(p.width,maximum);p.primaryAxisSizingMode='FIXED';changed.add(p.id);}}
 const after=sourceStamp(root),mathAfter=mathStamp(root);if(before!==after)throw Error('Source IDs or characters changed');if(mathBefore!==mathAfter)throw Error('Original math geometry changed');
 results.push({id:root.id,name:root.name,...count,sourcePreserved:true,mathPreserved:true,height:root.height});
 }catch(e){failures.push({id:root.id,error:String(e.message||e)});throw e;}
}
// Reconcile page-level spacing once after all bounded batches have completed.
return {pageId:page.id,rootCount:results.length,nativeParagraphCount:results.reduce((s,r)=>s+r.native,0),richParagraphCount:results.reduce((s,r)=>s+r.rich,0),wordCount:results.reduce((s,r)=>s+r.words,0),allSourcesPreserved:results.every(r=>r.sourcePreserved),allMathPreserved:results.every(r=>r.mathPreserved),failures,createdCount:createdNodeIds.length,mutatedCount:changed.size,createdNodeIds,mutatedNodeIds:[...changed]};

}
async function mainbody(args){
 const page=await current(args),changed=new Set(),parents=new Map();const wrappers=page.findAll(n=>n.type==='FRAME'&&n.name.startsWith('Paper95 / '));
 const direct=wrappers.filter(w=>{let p=w;while(p&&p.type!=='PAGE'){if(p.type==='INSTANCE')return false;p=p.parent;}return true;});
 await fontsOf(direct);await loadFont({family:'ManSeekSong Paper',style:'Bold'});
 let count=0;const sources=[];
 for(const w of direct){const t=w.children.find(n=>n.type==='TEXT');if(!t)continue;const before=t.characters;
  for(const s of t.getStyledTextSegments(['fontName'])){const style=/Extra|800/.test(s.fontName.style)?'ExtraBold':'Bold';await loadFont({family:'ManSeekSong Paper',style});t.setRangeFontName(s.start,s.end,{family:'ManSeekSong Paper',style});}
  for(const v of w.children.filter(n=>n.type==='VECTOR'&&n.name.startsWith('장평 95%'))){v.visible=false;changed.add(v.id);}
  if(w.parent?.layoutMode&&w.parent.layoutMode!=='NONE'&&w.layoutPositioning!=='ABSOLUTE')w.layoutSizingHorizontal='FILL';t.visible=true;t.textAutoResize='HEIGHT';t.textAlignHorizontal='JUSTIFIED';t.layoutPositioning='AUTO';t.resize(w.width,t.height);t.layoutSizingHorizontal='FILL';t.layoutSizingVertical='HUG';w.layoutSizingVertical='HUG';w.clipsContent=false;changed.add(t.id);changed.add(w.id);
  if(t.characters!==before)throw Error('Source changed '+t.id);sources.push({id:t.id,font:'ManSeekSong Paper',width:t.width,size:t.fontSize,sourcePreserved:true});count++;
  let p=w.parent;while(p&&p.type!=='PAGE'){if(p.type==='FRAME'||p.type==='COMPONENT')parents.set(p.id,p);p=p.parent;}
 }
 // This also sets the reusable styles used by future prose.
 const styles=await figma.getLocalTextStylesAsync();const styleIds=[];for(const s of styles.filter(s=>/^Observatory\/Paper\/(body|compact|memo|preview)$/.test(s.name))){await loadFont(s.fontName);s.fontName={family:'ManSeekSong Paper',style:'Bold'};styleIds.push(s.id);}
 const depth=n=>{let i=0;while(n&&n.type!=='PAGE'){i++;n=n.parent;}return i;};
 for(const n of [...parents.values()].sort((a,b)=>depth(b)-depth(a))){if(n.layoutMode==='NONE')continue;const viewport=/^(R|O|U)\d+@|@ipad|@iphone/.test(n.name)||n.overflowDirection!=='NONE';const flow=n.children.filter(c=>c.visible&&c.layoutPositioning!=='ABSOLUTE');if(!flow.length)continue;const need=n.layoutMode==='VERTICAL'?flow.reduce((s,c)=>s+c.height,0)+n.itemSpacing*(flow.length-1)+n.paddingTop+n.paddingBottom:Math.max(...flow.map(c=>c.y+c.height))+n.paddingBottom;
 if(!viewport&&need>n.height+.1){const pm=n.primaryAxisSizingMode,cm=n.counterAxisSizingMode;n.resize(n.width,need);n.primaryAxisSizingMode=pm;n.counterAxisSizingMode=cm;changed.add(n.id);}}
 return {task:'mainbody',pageId:page.id,convertedCount:count,sourcePreserved:true,styleIds,sources,createdNodeIds:[],mutatedNodeIds:[...changed]};
}
async function guide(args){
 const page=await current(args),styles=await figma.getLocalTextStylesAsync(),names=new Map(styles.map(s=>[s.id,s.name]));const texts=page.findAllWithCriteria({types:['TEXT']});const candidates=texts.filter(t=>{const style=names.get(t.textStyleId)||'';return /본문|문단|설명/.test(t.name)||/Body|Paragraph|Paper\/|Concept paper/.test(style);}).filter(t=>!(()=>{let p=t.parent;while(p&&p.type!=='PAGE'){if(/^\$/.test(p.name))return true;p=p.parent;}return false;})()&&!/Math|Code|Mono/.test(t.fontName?.family||''));
 const fonts=new Map();for(const t of candidates)for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);await Promise.all([...fonts.values()].map(f=>loadFont(f)));await loadFont({family:'ManSeekSong Paper',style:'Bold'});const changed=new Set();
 for(const t of candidates){const before=t.characters;for(const s of t.getStyledTextSegments(['fontName'])){const style=/Extra|800/.test(s.fontName.style)?'ExtraBold':'Bold';await loadFont({family:'ManSeekSong Paper',style});t.setRangeFontName(s.start,s.end,{family:'ManSeekSong Paper',style});}t.textAlignHorizontal='JUSTIFIED';t.lineHeight={unit:'PERCENT',value:t.width<640?185:200};t.letterSpacing={unit:'PERCENT',value:t.width<640?-2.5:-5};t.fontSize=t.width<640?16:18;t.textAutoResize='HEIGHT';if(t.characters!==before)throw Error('Source changed');changed.add(t.id);}
 return {task:'guide',pageId:page.id,convertedCount:changed.size,createdNodeIds:[],mutatedNodeIds:[...changed]};
}

async function prune(args){const page=await current(args),before=sourceStamp(page),mathBefore=mathStamp(page),removed=[],candidates=[];for(const v of page.findAll(n=>n.type==='VECTOR'&&n.name.startsWith('장평 95%'))){let n=v,hidden=false;while(n&&n.type!=='PAGE'){if(!n.visible)hidden=true;n=n.parent;}if(hidden&&!(()=>{let p=v.parent;while(p&&p.type!=='PAGE'){if(p.type==='INSTANCE')return true;p=p.parent;}return false;})())candidates.push(v);}for(const v of candidates){removed.push(v.id);v.remove();}if(before!==sourceStamp(page)||mathBefore!==mathStamp(page))throw Error('Original preservation failed');return {task:'prune',pageId:page.id,removedDerivedVectorCount:removed.length,removedNodeIds:removed,sourcePreserved:true,mathPreserved:true,createdNodeIds:[],mutatedNodeIds:[]};}
async function audit(args){const page=await current(args),texts=page.findAllWithCriteria({types:['TEXT']}),native=texts.filter(t=>t.visible&&t.getStyledTextSegments(['fontName']).some(s=>s.fontName.family==='ManSeekSong Paper')),outline=page.findAll(n=>n.type==='VECTOR'&&n.name.startsWith('장평 95%'));return {task:'audit',pageId:page.id,name:page.name,rootCount:page.children.length,nodeCount:page.findAll().length,native95Count:native.length,derivedOutlineCount:outline.length,sourceHash:sourceStamp(page),mathHash:mathStamp(page),roots:page.children.map(n=>({id:n.id,name:n.name,type:n.type,width:n.width,height:n.height})),createdNodeIds:[],mutatedNodeIds:[]};}

async function commonfit(args){const page=await current(args),forms=page.children.filter(n=>n.type==='FRAME'&&n.name.startsWith('천장 기능 / '));await fontsOf(forms);const changed=new Set();for(const root of forms){const original=sourceStamp(root);for(const t of root.findAllWithCriteria({types:['TEXT']})){if(!t.visible)continue;const p=t.parent;if(!p.layoutMode||p.layoutMode==='NONE')continue;const width=Math.max(48,p.width-p.paddingLeft-p.paddingRight);t.textAutoResize='HEIGHT';if(p.layoutMode==='VERTICAL'||t.width>width){t.resize(width,t.height);t.layoutSizingHorizontal='FILL';changed.add(t.id);}if(t.getStyledTextSegments(['fontName']).every(s=>s.fontName.family==='ManSeekSong Paper')){t.fontSize=16;t.lineHeight={unit:'PERCENT',value:185};t.letterSpacing={unit:'PERCENT',value:-2.5};t.textAlignHorizontal='JUSTIFIED';changed.add(t.id);}}for(const n of root.findAll(n=>n.type==='LINE'||n.type==='RECTANGLE'&&n.height<=4)){if(n.parent.layoutMode==='VERTICAL'){n.resize(Math.max(1,n.parent.width-n.parent.paddingLeft-n.parent.paddingRight),Math.max(.01,n.height));changed.add(n.id);}}for(const f of root.findAll(n=>(n.type==='FRAME'||n.type==='INSTANCE')&&n.layoutMode!=='NONE').reverse()){if(f.layoutMode==='VERTICAL')f.primaryAxisSizingMode='AUTO';else{f.layoutWrap='WRAP';f.counterAxisSizingMode='AUTO';}if(f.type==='INSTANCE'&&f.name.startsWith('행동 / '))f.minHeight=48;f.clipsContent=false;changed.add(f.id);}const flow=root.children.filter(n=>n.visible&&n.layoutPositioning!=='ABSOLUTE');const height=flow.reduce((s,n)=>s+n.height,0)+Math.max(0,flow.length-1)*root.itemSpacing+root.paddingTop+root.paddingBottom;root.resize(336,Math.min(600,height));root.primaryAxisSizingMode='FIXED';root.overflowDirection='VERTICAL';root.clipsContent=true;changed.add(root.id);if(original!==sourceStamp(root))throw Error('Original text changed '+root.id);}return {task:'commonfit',pageId:page.id,formCount:forms.length,forms:forms.map(n=>({id:n.id,width:n.width,height:n.height})),sourcePreserved:true,createdNodeIds:[],mutatedNodeIds:[...changed]};}

async function instancepass(args){const page=await current(args),wrappers=page.findAll(n=>n.type==='FRAME'&&n.name.startsWith('Paper95 / ')),changed=new Set(),before=sourceStamp(page),mathBefore=mathStamp(page),targets=wrappers.filter(w=>w.children.some(t=>t.type==='TEXT'&&(t.getStyledTextSegments(['fontName']).some(s=>s.fontName.family!=='ManSeekSong Paper')||!t.visible||t.textAlignHorizontal!=='JUSTIFIED'||t.lineHeight?.unit!=='PERCENT'||Math.abs((t.lineHeight?.value||0)-(t.fontSize===18?200:185))>.001||Math.abs((t.letterSpacing?.value||0)-(t.fontSize===18?-5:-2.5))>.001)));await fontsOf(targets);await loadFont({family:'ManSeekSong Paper',style:'Bold'});for(const w of targets){const t=w.children.find(n=>n.type==='TEXT');for(const span of t.getStyledTextSegments(['fontName'])){if(!/^(Noto Sans KR|NanumMyeongjo|ManSeekSong Paper)$/.test(span.fontName.family))throw Error('Custom family preserved '+t.id);const style=/Extra|800/.test(span.fontName.style)||span.fontName.variationSettings?.wght>=800?'ExtraBold':'Bold';await loadFont({family:'ManSeekSong Paper',style});t.setRangeFontName(span.start,span.end,{family:'ManSeekSong Paper',style});}t.visible=true;t.textAlignHorizontal='JUSTIFIED';t.lineHeight={unit:'PERCENT',value:t.fontSize===18?200:185};t.letterSpacing={unit:'PERCENT',value:t.fontSize===18?-5:-2.5};t.textAutoResize='HEIGHT';t.resize(w.width,t.height);t.layoutSizingHorizontal='FILL';t.layoutSizingVertical='HUG';changed.add(t.id);}if(before!==sourceStamp(page)||mathBefore!==mathStamp(page))throw Error('Original preservation failed');return {task:'instancepass',pageId:page.id,convertedCount:targets.length,sourcePreserved:true,mathPreserved:true,createdNodeIds:[],mutatedNodeIds:[...changed]};}

async function sourcefill(args){const page=await current(args);if(page.id!=='3:70')throw Error('Expected concept common page');const component=await figma.getNodeByIdAsync('4:29'),before=sourceStamp(component);await fontsOf([component]);const t=await figma.getNodeByIdAsync('4:30');t.textAutoResize='HEIGHT';t.layoutSizingHorizontal='FILL';t.layoutSizingVertical='HUG';component.primaryAxisSizingMode='AUTO';component.clipsContent=false;if(before!==sourceStamp(component))throw Error('Source changed');return {task:'sourcefill',pageId:page.id,sourcePreserved:true,createdNodeIds:[],mutatedNodeIds:[t.id,component.id]};}

const loadedFonts=new Map();
async function loadFont(f){const key=JSON.stringify(f);if(loadedFonts.has(key))return loadedFonts.get(key);let error;for(let retry=0;retry<3;retry++){try{const result=await figma.loadFontAsync(f);loadedFonts.set(key,Promise.resolve(result));return result;}catch(e){error=e;}}throw error;}
function createAutoLayout(dir){const f=figma.createFrame();f.layoutMode=dir;return f;}
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(16);}
function sourceStamp(root){return hash(root.findAllWithCriteria({types:['TEXT']}).map(n=>n.id+'='+n.characters).sort().join('\n'));}
function mathStamp(root){return hash(JSON.stringify(root.findAll(n=>n.type==='VECTOR'||n.type==='LINE'||n.type==='ELLIPSE'||n.type==='RECTANGLE').filter(n=>!n.name.startsWith('장평 95%')).map(n=>[n.id,n.width,n.height,n.rotation,'vectorPaths'in n?n.vectorPaths:undefined]).sort((a,b)=>a[0].localeCompare(b[0]))));}
async function current(args){const p=await figma.getNodeByIdAsync(args.pageId);if(figma.currentPage.id!==p.id)await figma.setCurrentPageAsync(p);figma.skipInvisibleInstanceChildren=false;return p;}
async function fontsOf(nodes){const fonts=new Map();for(const n of nodes)for(const t of n.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);await Promise.all([...fonts.values()].map(f=>loadFont(f)));}
async function read(args){
 const page=await current(args),roots=args.rootIds?.length?await Promise.all(args.rootIds.map(id=>figma.getNodeByIdAsync(id))):page.children;
 return {task:'read',pageId:page.id,pages:figma.root.children.map(p=>({id:p.id,name:p.name})),fonts:(await figma.listAvailableFontsAsync()).filter(f=>/Nanum|Paper|ManSeek/i.test(f.fontName.family)),roots:roots.map(n=>({id:n.id,name:n.name,type:n.type,width:n.width,height:n.height,sourceHash:n.findAll?sourceStamp(n):null,mathHash:n.findAll?mathStamp(n):null,paragraphs:n.findAll?n.findAll(x=>/본문 문단/.test(x.name)).map(p=>({id:p.id,name:p.name,type:p.type,visible:p.visible,width:p.width,height:p.height,atoms:args.detail&&p.type==='FRAME'?p.findAll(x=>x.type==='TEXT'||x.name==='원문 띄어쓰기'||(x.type==='FRAME'&&/^\$/.test(x.name))).map(x=>({id:x.id,type:x.type,name:x.name,text:x.type==='TEXT'?x.characters:undefined,parent:x.parent.id,visible:x.visible,width:x.width,height:x.height})):undefined})):[]})),createdNodeIds:[],mutatedNodeIds:[]};
}
async function native(args){
 const page=await current(args),roots=args.rootIds?.length?await Promise.all(args.rootIds.map(id=>figma.getNodeByIdAsync(id))):page.children.filter(n=>n.type==='FRAME');await fontsOf(roots);await figma.loadFontAsync({family:'ManSeekSong Paper',style:'Bold'});
 const changed=new Set(),results=[];
 for(const root of roots){const before=sourceStamp(root),mathBefore=mathStamp(root);let count=0;
  for(const para of root.findAll(n=>n.type==='INSTANCE'&&n.name==='본문 문단'&&n.parent.name==='본문')){
   const ts=para.findAllWithCriteria({types:['TEXT']});if(ts.length!==1)throw Error('Native shape changed '+para.id);const t=ts[0];
   const wrapper=para.parent.children.find(n=>n.name==='본문 문단 · 700/95% / '+para.id);const width=wrapper?wrapper.width:para.width;
   if(wrapper){wrapper.visible=false;changed.add(wrapper.id);}
   for(const s of t.getStyledTextSegments(['fontName'])){await loadFont({family:'ManSeekSong Paper',style:/Extra|800/.test(s.fontName.style)?'ExtraBold':'Bold'});t.setRangeFontName(s.start,s.end,{family:'ManSeekSong Paper',style:/Extra|800/.test(s.fontName.style)?'ExtraBold':'Bold'});}
   t.textAlignHorizontal='JUSTIFIED';t.lineHeight={unit:'PERCENT',value:200};t.letterSpacing={unit:'PERCENT',value:-5};t.textAutoResize='HEIGHT';t.resize(width,t.height);para.visible=true;para.resize(width,t.height);para.primaryAxisSizingMode='AUTO';para.clipsContent=false;changed.add(t.id);changed.add(para.id);count++;
  }
  if(before!==sourceStamp(root)||mathBefore!==mathStamp(root))throw Error('Source/math preservation failed '+root.id);
  results.push({id:root.id,nativeCount:count,sourcePreserved:true,mathPreserved:true});
 }
 return {task:'native',pageId:page.id,rootCount:results.length,nativeCount:results.reduce((s,r)=>s+r.nativeCount,0),results,createdNodeIds:[],mutatedNodeIds:[...changed]};
}
async function fit(args){
 const page=await current(args),roots=page.children.filter(n=>n.type==='FRAME'&&n.name.startsWith('OS판본 · '));await fontsOf(roots);const changed=new Set();
 for(const root of roots){const frames=root.findAll(n=>n.type==='FRAME'&&n.layoutMode==='VERTICAL'&&n.visible).reverse();
  for(const f of frames){if(f.name==='읽기 줄 · 700/95%'||f.name.startsWith('본문 문단 · 700/95%'))continue;f.primaryAxisSizingMode='AUTO';f.clipsContent=false;changed.add(f.id);}
  for(const f of root.children.filter(n=>n.type==='FRAME'&&n.layoutMode!=='NONE')){f.primaryAxisSizingMode='AUTO';f.clipsContent=false;changed.add(f.id);}
  const height=Math.max(...root.children.filter(n=>n.visible).map(n=>n.y+n.height))+root.paddingBottom;
  root.resize(root.width,height);root.clipsContent=false;changed.add(root.id);
 }
 // Generated publication frames only; preserve manual/non-publication layouts.
 const sorted=roots.slice().sort((a,b)=>a.y-b.y);let y=sorted.length?sorted[0].y:0;for(const r of sorted){r.y=y;y+=r.height+96;changed.add(r.id);}
 return {task:'fit',pageId:page.id,rootCount:roots.length,createdNodeIds:[],mutatedNodeIds:[...changed]};
}
async function complete(args){const a=await repair(args),b=await native(args),c=await fit(args);return {task:'complete',pageId:args.pageId,rootCount:a.rootCount,richRepaired:a.richParagraphCount,nativeCount:b.nativeCount,allSourcesPreserved:a.allSourcesPreserved&&b.results.every(r=>r.sourcePreserved),allMathPreserved:a.allMathPreserved&&b.results.every(r=>r.mathPreserved),failures:a.failures,fitRoots:c.rootCount,createdNodeIds:a.createdNodeIds,mutatedNodeIds:[...new Set([...a.mutatedNodeIds,...b.mutatedNodeIds,...c.mutatedNodeIds])]};}
figma.showUI(__html__,{width:560,height:480});
let busy=false;
figma.ui.onmessage=async(msg)=>{if(msg.type!=='run'||busy)return;busy=true;try{const args=JSON.parse(msg.input||'{}');if(figma.fileKey&&!['FRPuAwx3q2Jka1VZOjuMil','YHmD1PpWWfR9JGTEs77JsX'].includes(figma.fileKey))throw Error('지정 OS 디자인 파일에서만 실행할 수 있습니다.');const fn={read,apply,repair,native,fit,complete,mainbody,guide,prune,audit,commonfit,instancepass,sourcefill}[args.task];if(!fn)throw Error('Unknown task');const result=await fn(args);figma.ui.postMessage({type:'result',result});}catch(e){figma.ui.postMessage({type:'error',error:String(e.stack||e.message||e)});}finally{busy=false;}};
