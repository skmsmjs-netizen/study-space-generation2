const page=await figma.getNodeByIdAsync(PAGE_ID);await figma.setCurrentPageAsync(page);
const nodes=page.findAll();const texts=nodes.filter(n=>n.type==='TEXT');
const styles=new Map((await figma.getLocalTextStylesAsync()).map(s=>[s.id,s.name]));
const count={};const fontCounts={};const styleCounts={};const roles={};
function ancestry(n){let a=[];while(n&&n.type!=='PAGE'){a.push(n.name);n=n.parent;}return a;}
function role(n){const a=ancestry(n),path=a.join('/'),s=styles.get(n.textStyleId)||'';
 if(/code|latex|formula|equation|수식 벡터|수식 원문|코드/i.test(n.name+' '+s)||/Mono|Math/.test(n.fontName?.family||''))return 'formula-code';
 if(/Title|Heading|Label/.test(s)||/^(Title|Label|Heading|제목|표제|축|눈금|단위|번호)$/.test(n.name))return 'heading-label';
 if(/교육|설계 근거|기준|출처|연구/.test(a[a.length-1]||''))return 'documentation';
 if(/Paper\//.test(s)||/^(Body|Paragraph|본문|문단|설명|Original|원문|Definition|정의|Note|메모)$/.test(n.name)||/^(본문|문단|설명|원문)[ /·]/.test(n.name))return 'paper';
 if(/Body/.test(s)&&n.characters.length>=18&&!/머리말|탐색|이동|Controls|Toolbar|조작/.test(path))return 'paper';
 return 'other';}
function hash(x){let h=2166136261;for(let i=0;i<x.length;i++){h^=x.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16);}
for(const n of nodes)count[n.type]=(count[n.type]||0)+1;
for(const n of texts){const f=JSON.stringify(n.fontName);fontCounts[f]=(fontCounts[f]||0)+1;const s=styles.get(n.textStyleId)||'(none/mixed)';styleCounts[s]=(styleCounts[s]||0)+1;const r=role(n);roles[r]=(roles[r]||0)+1;}
const paper=texts.filter(n=>role(n)==='paper');
const mismatch=paper.filter(n=>n.fontName?.family!=='NanumMyeongjo'||n.fontName?.style!=='Bold'||n.textAlignHorizontal!=='JUSTIFIED');
const roots=page.children.map(n=>({id:n.id,name:n.name,type:n.type,w:n.width,h:n.height,layout:n.layoutMode,clip:n.clipsContent,children:'children'in n?n.children.length:0}));
const suspect=nodes.filter(n=>['FRAME','COMPONENT'].includes(n.type)&&/窓|Window|Sky|Landscape|Scene|창가|장면|풍경|관측창/.test(n.name)&&n.clipsContent).map(n=>({id:n.id,name:n.name,w:n.width,h:n.height,overflow:n.overflowDirection}));
return {fileKey:figma.fileKey,pageId:page.id,pageName:page.name,total:nodes.length,count,fontCounts,styleCounts,roles,paperCount:paper.length,mismatchCount:mismatch.length,mismatchIds:mismatch.map(n=>n.id).slice(0,120),mismatchIdsTruncated:mismatch.length>120,samples:paper.slice(0,8).map(n=>({id:n.id,name:n.name,text:n.characters.slice(0,80),parent:n.parent.name,size:n.fontSize,align:n.textAlignHorizontal,font:n.fontName,resize:n.textAutoResize})),roots:roots.slice(0,15),rootCount:roots.length,clipSuspects:suspect.slice(0,25),clipSuspectCount:suspect.length,textHash:hash(texts.map(n=>n.id+'='+n.characters).sort().join('\n')),reactionHash:hash(JSON.stringify(nodes.filter(n=>n.reactions?.length).map(n=>[n.id,n.reactions]).sort((a,b)=>a[0].localeCompare(b[0]))))};
