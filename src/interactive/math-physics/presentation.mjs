// Display policy only; calculation and stored values retain their original precision.
export function formatNumber(value) { return Number(value.toFixed(2)).toString(); }
export function positiveMeasure(value) {return value>0 && value<0.005?String.raw`<0.01`:String.raw`\approx ${formatNumber(value)}`;}
export function inline(node, text) {
  node.replaceChildren();
  const pieces=String(text).split(/(\$[^$]+\$)/g);
  for(const piece of pieces) {
    if(piece.startsWith('$') && piece.endsWith('$')) {
      const span=document.createElement('span');span.className='inline-math';
      window.katex.render(piece.slice(1,-1),span,{displayMode:false,throwOnError:true,trust:false,output:'htmlAndMathml'});node.append(span);
    } else node.append(document.createTextNode(piece));
  }
}
export const units = {'m':String.raw`\mathrm{m}`,'m/s':String.raw`\mathrm{m/s}`,'m/s²':String.raw`\mathrm{m/s^2}`,'s':String.raw`\mathrm{s}`,'kg':String.raw`\mathrm{kg}`,'N/m':String.raw`\mathrm{N/m}`,'J':String.raw`\mathrm{J}`,'1':'1'};
export function dimensionTex(value) {return value.replace(/\^(-?\d+)/g,'^{$1}');}
// Split display equations only at top-level separators, preserving matrices/cases/groups.
export function equationLines(tex) {
  const lines=[];let start=0,braces=0,environment=0;
  for(let i=0;i<tex.length;i++) {
    if(tex[i]==='\\') {
      const env=tex.slice(i).match(/^\\(begin|end)\{[^}]+\}/);
      if(env){environment+=env[1]==='begin'?1:-1;i+=env[0].length-1;continue;}
      const space=tex.slice(i).match(/^\\q(?:quad|uad)\b/);
      if(space && braces===0 && environment===0) {lines.push(tex.slice(start,i).trim().replace(/,$/,''));i+=space[0].length-1;start=i+1;continue;}
    }
    if(tex[i]==='{')braces++;
    if(tex[i]==='}')braces--;
  }
  lines.push(tex.slice(start).trim().replace(/,$/,''));return lines.filter(Boolean);
}
