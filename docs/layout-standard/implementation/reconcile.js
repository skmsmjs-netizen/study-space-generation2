// INPUT supplies an inspected page and exact target IDs. Existing content/links are retained.
const page=await figma.getNodeByIdAsync(INPUT.pageId);await figma.setCurrentPageAsync(page);
const roots=await Promise.all(INPUT.targets.map(t=>figma.getNodeByIdAsync(t.id)));
const fonts=new Map();
for(const root of roots)for(const t of root.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);
await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));
const createdNodeIds=[],changed=new Set(),results=[];
const vars=new Map((await figma.variables.getLocalVariablesAsync()).map(v=>[v.name,v]));
const material=await figma.variables.getVariableCollectionByIdAsync('VariableCollectionId:7:79');
function mark(n){changed.add(n.id);return n;}
function paint(n,prop,role){n[prop]=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',vars.get('material/'+role))];mark(n);}
function space(n,prop,x){n[prop]=x;if(vars.has('space/'+x))n.setBoundVariable(prop,vars.get('space/'+x));mark(n);}
function frame(parent,name,w,dir='VERTICAL',pad=0,gap=24){const n=figma.createAutoLayout(dir);createdNodeIds.push(n.id);parent.appendChild(n);n.name=name;n.resize(w,80);n.layoutSizingHorizontal='FIXED';n.layoutSizingVertical='HUG';n.clipsContent=false;n.fills=[];for(const p of ['paddingTop','paddingRight','paddingBottom','paddingLeft'])space(n,p,pad);space(n,'itemSpacing',gap);return n;}
function fingerprint(root){
 const ns=[root,...root.findAll()];return {text:ns.filter(n=>n.type==='TEXT').map(n=>[n.id,n.characters]).sort((a,b)=>a[0].localeCompare(b[0])),links:ns.filter(n=>n.reactions?.length).map(n=>[n.id,JSON.stringify(n.reactions)]).sort((a,b)=>a[0].localeCompare(b[0])),instances:ns.filter(n=>n.type==='INSTANCE').map(n=>[n.id,n.mainComponent?.id]).sort((a,b)=>a[0].localeCompare(b[0]))};
}
function fit(n,w){
 if(!n.visible)return;
 if(n.type==='INSTANCE'){
  if(n.mainComponent?.id==='10:68'){n.resize(w,w/2.4);mark(n);return;}
  if(n.width>w+.1){n.resize(w,n.height);mark(n);}return;
 }
 if(n.type==='TEXT'){if(n.textAutoResize==='HEIGHT'||n.width>w+.1){n.textAutoResize='HEIGHT';n.resize(w,n.height);mark(n);}return;}
 if(n.type!=='FRAME'||n.layoutMode==='NONE')return;
 const intrinsic=/SVG|Canvas|キャンバス|그리기 영역|좌표 그림|그래프 도해/.test(n.name);
 if(intrinsic)return;
 n.resize(w,n.height);n.layoutSizingHorizontal='FIXED';n.layoutSizingVertical='HUG';mark(n);
 const iw=Math.max(44,w-n.paddingLeft-n.paddingRight);
 if(n.layoutMode==='VERTICAL')for(const c of n.children)if(c.layoutPositioning!=='ABSOLUTE')fit(c,Math.min(iw,c.width||iw));
 else{n.layoutWrap='WRAP';space(n,'counterAxisSpacing',8);for(const c of n.children)if(c.layoutPositioning!=='ABSOLUTE')fit(c,Math.min(iw,c.width||iw));}
}
function cover(root){
 let n=root.findOne(n=>n.type==='INSTANCE'&&n.mainComponent?.id==='10:68');let window;
 if(n&&n.parent.type==='FRAME'&&/창틀/.test(n.parent.name)){window=n.parent;root.insertChild(0,window);mark(window);mark(root);}
 else if(!n){window=frame(root,'OS 레이아웃 / 공통 커버 / L034+L048',root.width,'VERTICAL',root.width<=640?4:8,0);root.insertChild(0,window);const asset=INPUT.sceneId;return {window,newScene:true,asset};}
 else return {window:null,newScene:false,existing:n};
 return {window,newScene:false,existing:n};
}
for(let i=0;i<roots.length;i++){
 const root=roots[i],target=INPUT.targets[i];if(!root||root.type!=='FRAME')throw Error('Missing inspected frame '+target.id);
 const before=fingerprint(root),viewport={width:root.width,height:root.height,overflow:root.overflowDirection},previousChildren=before.instances.map(x=>x[0]);
 const body=root.children.find(n=>n.name==='작업면과 도구');
 if(target.scope==='screen'&&body){
  const cov=cover(root);if(cov.window){
   const window=cov.window;window.resize(root.width,100);window.layoutMode='VERTICAL';window.layoutSizingVertical='HUG';window.layoutSizingHorizontal='FIXED';window.clipsContent=false;window.setExplicitVariableModeForCollection(material,'7:1');paint(window,'fills','canvas');
   for(const p of ['paddingTop','paddingRight','paddingBottom','paddingLeft'])space(window,p,root.width<=640?4:8);space(window,'itemSpacing',0);
   let scene=cov.existing;if(cov.newScene){const main=await figma.getNodeByIdAsync(cov.asset);scene=main.createInstance();window.appendChild(scene);createdNodeIds.push(scene.id);scene.name='공통 장면 · 원본 전체';}
   const iw=root.width-window.paddingLeft-window.paddingRight;scene.resize(iw,iw/2.4);mark(scene);mark(window);
  }
 }
 if(body&&!body.children.some(n=>n.name.startsWith('OS 레이아웃 / 대표 /'))){
  const blocks=body.children.filter(n=>n.type==='FRAME'&&/^[ROU]\d\d-B\d\d\s*\//.test(n.name));
  const insertAt=blocks.length?body.children.indexOf(blocks[0]):body.children.length;
  const iw=body.width-body.paddingLeft-body.paddingRight;const main=frame(body,'OS 레이아웃 / 대표 / '+target.pattern,iw,'VERTICAL',0,24);body.insertChild(insertAt,main);mark(body);
  const wide=iw>=792;
  const split=['L045','L082','L187','L188','L189','L190','L194','L196','L197'].includes(target.pattern)&&wide&&blocks.length>=2;
  const grid=['L037','L048','L049','L195'].includes(target.pattern)&&iw>=744&&blocks.length>=2;
  if(split){
   const row=frame(main,'OS 레이아웃 / 대응 패널',iw,'HORIZONTAL',0,24);
   const left=frame(row,'대상·조건·원자료',Math.floor((iw-24)*.36),'VERTICAL',0,16);
   const right=frame(row,'선택 상세·관찰·기록',iw-left.width-24,'VERTICAL',0,16);
   blocks.forEach((b,j)=>{const panel=j===0?left:right;panel.appendChild(b);fit(b,panel.width);mark(b);});
  }else if(grid){
   const columns=target.pattern==='L049'&&iw>=1120?3:2;const width=(iw-24*(columns-1))/columns;
   for(let start=0;start<blocks.length;start+=columns){const row=frame(main,'OS 레이아웃 / '+(target.pattern==='L049'?'보드 열':'카드 행')+' / '+start,iw,'HORIZONTAL',0,24);for(const b of blocks.slice(start,start+columns)){row.appendChild(b);fit(b,width);mark(b);}}
  }else{
   main.counterAxisAlignItems='CENTER';for(const b of blocks){main.appendChild(b);fit(b,Math.min(iw,['L025','L053','L043','L081','L193','L198'].includes(target.pattern)?768:iw));mark(b);}
  }
  if(!blocks.length){main.remove();const n=createdNodeIds.indexOf(main.id);if(n>=0)createdNodeIds.splice(n,1);changed.delete(main.id);}
 }
 // A fixed prototype viewport intentionally scrolls; the layout itself grows below it.
 if(body){body.clipsContent=false;body.layoutSizingVertical='HUG';mark(body);}
 if(root.layoutMode!=='NONE'&&root.overflowDirection==='VERTICAL'){root.clipsContent=true;mark(root);}
 const after=fingerprint(root);const oldInstances=after.instances.filter(x=>previousChildren.includes(x[0]));
 const preserved=JSON.stringify(before.text)===JSON.stringify(after.text)&&JSON.stringify(before.links)===JSON.stringify(after.links)&&JSON.stringify(before.instances)===JSON.stringify(oldInstances);
 if(!preserved)throw Error('Content or link preservation failure '+root.id);
 const scenes=root.findAllWithCriteria({types:['INSTANCE']}).filter(n=>n.mainComponent?.id==='10:68');
 results.push({id:root.id,name:root.name,pattern:target.pattern,scope:target.scope,viewport,preserved,scroll:root.overflowDirection,sceneRatios:scenes.map(n=>n.width/n.height),structure:body?.children.find(n=>n.name.startsWith('OS 레이아웃 / 대표 /'))?.id||null,bodyHeight:body?.height});
}
return {pageId:page.id,createdNodeIds,mutatedNodeIds:[...changed],results};
