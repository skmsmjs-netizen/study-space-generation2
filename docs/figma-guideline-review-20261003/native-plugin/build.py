from pathlib import Path
import shutil
root=Path(__file__).resolve().parent; review=root.parent
pres=(review/'concept-paper-preservation-update.js').read_text(); gap=(review/'concept-gap-repair.js').read_text()
# Real Figma Plugin API adapter for the tool's convenience constructor.
forname={}
for name,code in [('apply',pres),('repair',gap)]:
 start=code.index("  if(para.type==='INSTANCE'){");end=code.index("  if(para.type!=='FRAME'",start)
 code=code[:start]+"  if(para.type==='INSTANCE')continue;\n"+code[end:]
 code=code.replace("figma.createAutoLayout(dir)","createAutoLayout(dir)").replace("figma.loadFontAsync(f)","loadFont(f)").replace("{family:'NanumMyeongjo',style:'Bold'},{family:'NanumMyeongjo',style:'ExtraBold'}","{family:'NanumMyeongjo',style:'Bold'}")
 # Fixed lines from the known latest updater already retain actual ink origin.
 forname[name]='async function '+name+'(args){const PAGE_ID=args.pageId,ROOT_IDS=args.rootIds||[];\n'+code+'\n}'
base=r'''
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
figma.ui.onmessage=async(msg)=>{if(msg.type!=='run'||busy)return;busy=true;try{const args=JSON.parse(msg.input||'{}');if(figma.fileKey&&!['FRPuAwx3q2Jka1VZOjuMil','YHmD1PpWWfR9JGTEs77JsX'].includes(figma.fileKey))throw Error('지정 OS 디자인 파일에서만 실행할 수 있습니다.');const fn={read,apply,repair,native,fit,complete}[args.task];if(!fn)throw Error('Unknown task');const result=await fn(args);figma.ui.postMessage({type:'result',result});}catch(e){figma.ui.postMessage({type:'error',error:String(e.stack||e.message||e)});}finally{busy=false;}};
'''
base=base.replace('{read,apply,repair,native,fit,complete}[args.task]','{read,apply,repair,native,fit,complete,mainbody,guide,prune,audit,commonfit,instancepass,sourcefill}[args.task]');base=(root/'mainbody.js').read_text()+base
(root/'code.js').write_text('\n'.join(forname.values())+'\n'+base)
dest=Path('/private/tmp/desktop-development-plugincodex-concept-paper-20261002-plugin')
for name in ['manifest.json','code.js','ui.html']:shutil.copy2(root/name,dest/name)
