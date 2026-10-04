const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'../..'),out=path.join(base,'work/figma-memory-20261002');
const compact=JSON.parse(fs.readFileSync(path.join(__dirname,'compact-ux-cards.json'),'utf8'));
const mapping=JSON.parse(fs.readFileSync(path.join(out,'ux-card-map-before.json'),'utf8'));
const before=new Map();
for(const name of fs.readdirSync(path.join(base,'docs/ux-paths-20261002/figma-inputs')).filter(n=>n.endsWith('.json'))){
 const input=JSON.parse(fs.readFileSync(path.join(base,'docs/ux-paths-20261002/figma-inputs',name),'utf8'));
 for(const item of input.items||[])before.set(item.id,item);
}
function fnv(value){let h=2166136261;for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619);}return(h>>>0).toString(16).padStart(8,'0');}
const items=compact.cards.filter(c=>c.group!=='overview').map(c=>{
 const old=before.get(c.id);if(!old||!mapping[c.id])throw Error('Missing preserved item '+c.id);
 const full=Array.isArray(old.body)?old.body.join('\n\n'):String(old.body||'');
 return {id:c.id,nodeId:mapping[c.id],title:c.title,beforeHash:fnv(full),body:Array.isArray(c.body)?c.body.join('\n\n'):String(c.body||'')};
});
const builder=fs.readFileSync(path.join(__dirname,'apply-compact-ux.js'),'utf8');
fs.mkdirSync(path.join(out,'calls'),{recursive:true});
const files=[];
for(let start=0;start<items.length;start+=40){
 const name=String(files.length).padStart(3,'0')+'.js';
 const code='const INPUT='+JSON.stringify({items:items.slice(start,start+40)})+';\n'+builder;
 if(code.length>49000)throw Error('Code budget exceeded '+name);
 fs.writeFileSync(path.join(out,'calls',name),code);files.push(name);
}
fs.writeFileSync(path.join(out,'live-ux-input.json'),JSON.stringify({policy:compact.policy,sourceChecksum:compact.sourceChecksum,items},null,2));
fs.writeFileSync(path.join(out,'calls.json'),JSON.stringify(files,null,2));
console.log(JSON.stringify({batches:files.length,cards:items.length,maxCodeChars:Math.max(...files.map(n=>fs.readFileSync(path.join(out,'calls',n),'utf8').length))}));
