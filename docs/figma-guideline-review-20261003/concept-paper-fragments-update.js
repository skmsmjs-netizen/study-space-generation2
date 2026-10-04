// Reuses the existing measured atom / inter-word justification procedure.
// Unlike the previous rebuild, original text, formula, paragraph and row IDs
// are retained. Only prose outlines and layout parents are added.
const page=await figma.getNodeByIdAsync(PAGE_ID);await figma.setCurrentPageAsync(page);figma.skipInvisibleInstanceChildren=false;
const roots=ROOT_IDS.length?await Promise.all(ROOT_IDS.map(id=>figma.getNodeByIdAsync(id))):page.children.filter(n=>n.type==='FRAME'&&(/OS판본 · |대표|전집/.test(n.name)));
const fonts=new Map();for(const root of roots)for(const t of root.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);
await Promise.all([...fonts.values(),{family:'NanumMyeongjo',style:'Bold'},{family:'NanumMyeongjo',style:'ExtraBold'}].map(f=>figma.loadFontAsync(f)));
const createdNodeIds=[],changed=new Set(),failures=[],results=[];const made=n=>{createdNodeIds.push(n.id);return n;};
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(16);}
function sourceStamp(root){return hash(root.findAllWithCriteria({types:['TEXT']}).map(n=>n.id+'='+n.characters).sort().join('\n'));}
function mathStamp(root){return hash(JSON.stringify(root.findAll(n=>n.type==='VECTOR'||n.type==='LINE'||n.type==='ELLIPSE'||n.type==='RECTANGLE').filter(n=>!n.name.startsWith('장평 95%')).map(n=>[n.id,n.width,n.height,n.rotation,'vectorPaths'in n?n.vectorPaths:undefined]).sort((a,b)=>a[0].localeCompare(b[0]))));}
function frame(parent,name,w,h,dir='VERTICAL'){const f=made(figma.createAutoLayout(dir));parent.appendChild(f);f.name=name;f.fills=[];f.clipsContent=false;f.itemSpacing=f.paddingTop=f.paddingBottom=f.paddingLeft=f.paddingRight=0;f.resize(w,h);f.layoutSizingHorizontal='FIXED';f.layoutSizingVertical='FIXED';return f;}
function setType(t){const spans=t.getStyledTextSegments(['fontName']);for(const s of spans)t.setRangeFontName(s.start,s.end,{family:'NanumMyeongjo',style:s.fontName.style==='ExtraBold'||s.fontName.variationSettings?.wght>=800?'ExtraBold':'Bold'});t.lineHeight={unit:'PERCENT',value:200};t.letterSpacing={unit:'PERCENT',value:-5};t.textTruncation='DISABLED';changed.add(t.id);}
function outline(t,parent,width,height){const w=frame(parent,'Paper95 / '+t.id,width,height);w.appendChild(t);t.visible=false;changed.add(t.id);const c=t.clone();w.appendChild(c);c.visible=true;const v=made(figma.flatten([c],w));v.name='장평 95% 조판 / '+t.id;const raw=v.width;v.resize(raw*.95,v.height);v.layoutPositioning='ABSOLUTE';v.x=v.y=0;if(Math.abs(v.width/raw-.95)>.0001)throw Error('Glyph width mismatch');return w;}
function atoms(paragraph){return paragraph.children.filter(n=>n.name==='읽기 줄'&&n.visible).flatMap(row=>row.children.filter(n=>n.name!=='조판 추가 여백'&&n.name!=='원문 띄어쓰기'));}
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
function sourceOf(a){return a.map(n=>n.type==='TEXT'?n.characters:n.name).join('');}
function rowsFor(a,width){const units=[];for(const x of a){if(x.space)units.push([x]);else{const last=units[units.length-1];if(last&&!last[0].space)last.push(x);else units.push([x]);}}let row=[],used=0;const rows=[];function finish(){if(row.length)rows.push(row);row=[];used=0;}for(const unit of units){if(unit[0].hardBreak){row.push(...unit);finish();continue;}const w=unit.reduce((s,x)=>s+x.width,0);if(unit[0].space){row.push(...unit);used+=w;continue;}if(w<=width+.05){if(used+w>width+.05&&row.some(x=>!x.space))finish();row.push(...unit);used+=w;}else for(const x of unit){if(x.width>width+.05)throw Error('Unbreakable atom exceeds width');if(used+x.width>width+.05&&row.some(x=>!x.space))finish();row.push(x);used+=x.width;}}finish();return rows;}
for(const root of roots){
 const before=sourceStamp(root),mathBefore=mathStamp(root),count={native:0,rich:0,words:0};
 try{
 const paras=root.findAll(n=>n.name==='본문 문단'&&n.visible&&n.parent.name==='본문');
 for(const para of paras){
  if(para.type==='INSTANCE'){
   const t=para.findAllWithCriteria({types:['TEXT']});if(t.length!==1)throw Error('Native paragraph shape changed '+para.id);const text=t[0],source=text.characters,parent=para.parent,index=parent.children.indexOf(para),width=para.width;
   if(text.getStyledTextSegments(['fontName']).some(s=>!/Noto Sans KR|NanumMyeongjo/.test(s.fontName.family))){failures.push({id:para.id,reason:'preserved custom typeface'});continue;}
   setType(text);text.textAlignHorizontal='JUSTIFIED';text.textAutoResize='HEIGHT';text.resize(width/.95,text.height);para.resize(width/.95,text.height);para.primaryAxisSizingMode='AUTO';
   const wrapper=frame(parent,'본문 문단 · 700/95% / '+para.id,width,para.height);parent.insertChild(index,wrapper);changed.add(parent.id);
   const clone=para.clone();wrapper.appendChild(clone);clone.visible=true;const v=made(figma.flatten([clone],wrapper));v.name='장평 95% 조판 / '+para.id;const raw=v.width;v.resize(raw*.95,v.height);v.layoutPositioning='ABSOLUTE';v.x=v.y=0;para.visible=false;changed.add(para.id);
   const retained=para.findAllWithCriteria({types:['TEXT']})[0];if(retained.characters!==source)throw Error('Source mismatch');count.native++;continue;
  }
  if(para.type!=='FRAME'||para.children.some(n=>n.name==='읽기 줄 · 700/95%'))continue;
  const originalAtoms=atoms(para);if(!originalAtoms.length)continue;const source=sourceOf(originalAtoms),oldRows=para.children.filter(n=>n.name==='읽기 줄'&&n.visible),width=para.width;
  const measured=[];
  for(const n of originalAtoms){if(n.type==='TEXT'){
   setType(n);n.textAutoResize='WIDTH_AND_HEIGHT';n.textAlignHorizontal='LEFT';const space=/^\s+$/u.test(n.characters);
   if(space){let w=n.width*.95;if(w<.02)w=3;n.textAutoResize='NONE';n.resize(w,36);measured.push({node:n,text:n.characters,space:true,width:w,height:36});}
   else if(/\s/.test(n.characters)||n.width*.95>width){const pieces=fragmentWords(n,para,width);measured.push(...pieces);count.words+=pieces.filter(x=>!x.space).length;}
   else{const wrap=outline(n,para,n.width*.95,n.height);measured.push({node:wrap,text:n.characters,space:false,width:wrap.width,height:wrap.height});count.words++;}
  }else measured.push({node:n,text:n.name,space:false,width:n.width,height:n.height});}
  const rows=rowsFor(measured,width);
  for(let i=0;i<rows.length;i++){const a=rows[i],height=Math.max(36,...a.map(x=>x.height)),r=frame(para,'읽기 줄 · 700/95%',width,height,'HORIZONTAL');r.counterAxisAlignItems='CENTER';const first=a.findIndex(x=>!x.space),last=a.findLastIndex(x=>!x.space),spaces=[];let used=0;for(let j=0;j<a.length;j++){const x=a[j];r.appendChild(x.node);changed.add(x.node.id);if(x.space&&(j<first||j>last)){x.node.resize(.01,height);used+=.01;}else used+=x.width;if(x.space&&j>first&&j<last)spaces.push(x.node);}if(used>width+.1)throw Error('Line overflow');const extra=i===rows.length-1||!spaces.length?0:Math.max(0,(width-used)/spaces.length);for(const n of spaces)if(extra>.001){const gap=frame(r,'조판 추가 여백 · 700/95%',extra,height);r.insertChild(r.children.indexOf(n)+1,gap);}}
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

