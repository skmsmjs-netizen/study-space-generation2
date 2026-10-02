// Liang–Barsky clipping: detect curves crossing a window even when samples lie outside it.
function segmentVisible(x0,y0,x1,y1,x,y) {
  let lo=0,hi=1;const dx=x1-x0,dy=y1-y0;
  const p=[-dx,dx,-dy,dy],q=[x0-x[0],x[1]-x0,y0-y[0],y[1]-y0];
  for(let i=0;i<4;i++) {
    if(p[i]===0){if(q[i]<0)return false;continue;}
    const t=q[i]/p[i];if(p[i]<0)lo=Math.max(lo,t);else hi=Math.min(hi,t);
    if(lo>hi)return false;
  }
  return true;
}
export function hasVisibleTrace(data,x,y) {
  return data.some(trace=> {
    const inside=(a,b)=>a>=x[0]&&a<=x[1]&&b>=y[0]&&b<=y[1];
    for(let i=0;i<trace.x.length;i++) {
      if(inside(trace.x[i],trace.y[i]))return true;
      if(i>0 && trace.mode?.includes('lines') && segmentVisible(trace.x[i-1],trace.y[i-1],trace.x[i],trace.y[i],x,y))return true;
    }
    // A viewport may lie completely within a filled rectangle/polygon.
    if(trace.fill==='toself') {
      const cx=(x[0]+x[1])/2,cy=(y[0]+y[1])/2;let inFill=false;
      for(let i=0,j=trace.x.length-1;i<trace.x.length;j=i++) {
        const ax=trace.x[i],ay=trace.y[i],bx=trace.x[j],by=trace.y[j];
        if((ay>cy)!==(by>cy) && cx<(bx-ax)*(cy-ay)/(by-ay)+ax)inFill=!inFill;
      }
      if(inFill)return true;
    }
    return false;
  });
}
export function decimalTicks([lo,hi]) {
  const target=Math.max(0.01,(hi-lo)/5),power=10**Math.floor(Math.log10(target));
  const step=[1,2,5,10].map(n=>n*power).find(n=>n>=target) || power*10;
  const first=Math.ceil((lo-1e-10)/step)*step, ticks=[];
  for(let i=0;i<8;i++){const value=first+i*step;if(value>hi+1e-10)break;ticks.push(Number(value.toFixed(2)));}
  return [...new Set(ticks)];
}
