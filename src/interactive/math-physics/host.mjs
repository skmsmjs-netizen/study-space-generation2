const channel='manseeksong:concept-interactives:v1';
export async function createViewStorage() {
  // Production uses the app's account-scoped data adapter, never the standalone key.
  if(window.parent===window || new URLSearchParams(location.hash.slice(1)).get('host')!=='manseeksong-os')
    throw Error('개념 탐구실은 앱의 수식 탐색에서 열어 주세요.');
  const waiting=new Map();let sequence=0;
  window.addEventListener('message',event=> {
    if(event.source!==window.parent || event.origin!==location.origin || event.data?.channel!==channel)return;
    const message=event.data;
    if(message.action==='appearance') {
      for(const [name,value] of Object.entries(message.tokens ?? {}))
        if(/^--[a-z0-9-]+$/.test(name) && typeof value==='string')document.body.style.setProperty(name,value);
      if(typeof message.font==='string')document.body.style.fontFamily=message.font;
      document.documentElement.style.colorScheme=message.scheme==='dark'?'dark':'light';
      document.documentElement.dataset.theme=message.scheme==='dark'?'dark':'light';
      window.dispatchEvent(new Event('host-appearance'));
      return;
    }
    const callback=waiting.get(message.id);if(!callback)return;
    waiting.delete(message.id);clearTimeout(callback.timer);
    if(message.error)callback.reject(Error(message.error));else callback.resolve(message.value);
  });
  const request=(action,value)=>new Promise((resolve,reject)=> {
    const id=++sequence,timer=setTimeout(()=>{waiting.delete(id);reject(Error('앱의 보기 저장 연결을 확인하지 못했습니다. 현재 화면은 유지했습니다.'));},5000);
    waiting.set(id,{resolve,reject,timer});
    window.parent.postMessage({channel,action,id,value},location.origin);
  });
  let frame=null,lastHeight=0;
  const size=()=> {
    if(frame!==null)return;
    frame=requestAnimationFrame(()=> {
      frame=null;const height=Math.ceil(document.body.getBoundingClientRect().height);
      if(height>0 && height!==lastHeight){lastHeight=height;window.parent.postMessage({channel,action:'size',height},location.origin);}
    });
  };
  new ResizeObserver(size).observe(document.body);
  document.body.classList.add('embedded');
  return {read:()=>request('read'),write:raw=>request('write',raw)};
}
