// Scale around the point the learner is inspecting; one common limit for all inputs.
export function gestureRanges(base, factor, start, current=start, minimum=0.05) {
  if(!Number.isFinite(factor) || factor<=0)return null;
  factor=Math.max(factor,...['x','y'].map(k=>minimum/(base[k][1]-base[k][0])));
  return Object.fromEntries(['x','y'].map(k=> {
    const span=base[k][1]-base[k][0],anchor=base[k][0]+start[k]*span,newSpan=span*factor;
    return [k,[anchor-current[k]*newSpan,anchor+(1-current[k])*newSpan]];
  }));
}

// Plotly handles mouse panning. Handle touch gestures here to keep page zoom separate.
export function bindGestures(node, readView, applyView) {
  let touch=null,safari=null,queued=null,frame=null,busy=false;
  const view=()=>queued || readView();
  const stop=e=>{if(e.cancelable)e.preventDefault();e.stopImmediatePropagation();};
  const point=(x,y)=> {
    const box=node.getBoundingClientRect(),layout=node._fullLayout;
    return {x:(x-box.left-layout.xaxis._offset)/layout.xaxis._length,
      y:1-(y-box.top-layout.yaxis._offset)/layout.yaxis._length};
  };
  const measure=touches=> {
    const a=touches[0],b=touches[1] || a;
    return {count:touches.length,center:point((a.clientX+b.clientX)/2,(a.clientY+b.clientY)/2),
      distance:Math.max(1,Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY))};
  };
  async function flush() {
    frame=null;if(busy)return;
    busy=true;
    try {while(queued){const next=queued;queued=null;await applyView(next);}}
    finally {busy=false;}
  }
  function schedule(next) {
    if(!next || !Object.values(next).every(r=>r.every(n=>Number.isFinite(n)&&Math.abs(n)<1e8)))return;
    queued=next;if(frame===null && !busy)frame=requestAnimationFrame(flush);
  }
  function start(e) {
    const base=view();if(!base || !e.touches.length)return;
    stop(e);touch={base,...measure(e.touches)};
  }
  node.addEventListener('touchstart',start,{capture:true,passive:false});
  node.addEventListener('touchmove',e=> {
    if(!touch)return;stop(e);
    const now=measure(e.touches);
    if(now.count!==touch.count){touch={base:view(),...now};return;}
    schedule(gestureRanges(touch.base,now.count>=2?touch.distance/now.distance:1,touch.center,now.center,now.count>=2?0.05:0));
  },{capture:true,passive:false});
  node.addEventListener('touchend',e=> {
    if(!touch)return;stop(e);
    touch=e.touches.length?{base:view(),...measure(e.touches)}:null;
  },{capture:true,passive:false});
  node.addEventListener('touchcancel',e=>{if(touch){stop(e);touch=null;}},{capture:true,passive:false});
  node.addEventListener('wheel',e=> {
    if(!e.ctrlKey)return;const base=view();if(!base)return;
    stop(e);if(touch || safari)return;
    const pixels=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?node.clientHeight:1);
    schedule(gestureRanges(base,Math.exp(Math.max(-0.5,Math.min(0.5,pixels*0.01))),point(e.clientX,e.clientY)));
  },{capture:true,passive:false});
  // Safari trackpads use GestureEvent; touchscreen TouchEvents remain the owner.
  node.addEventListener('gesturestart',e=> {
    const base=view();if(!base)return;stop(e);
    if(!touch)safari={base,center:point(e.clientX,e.clientY)};
  },{capture:true,passive:false});
  node.addEventListener('gesturechange',e=> {
    if(!safari)return;stop(e);
    schedule(gestureRanges(safari.base,1/e.scale,safari.center));
  },{capture:true,passive:false});
  node.addEventListener('gestureend',e=>{if(safari){stop(e);safari=null;}},{capture:true,passive:false});
  return ()=> {touch=null;safari=null;queued=null;if(frame!==null)cancelAnimationFrame(frame);frame=null;};
}
