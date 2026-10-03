import {useEffect,useRef,useState} from 'react';
import {getDocument,GlobalWorkerOptions,type PDFDocumentProxy} from 'pdfjs-dist';
import worker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {keepPhysicsSource,readPhysicsSource,type PhysicsSourceOwner} from '../data/physics-source-file';
import {Button,ErrorState,Input,LoadingState} from './index';
import {storagePrefix} from '../data/repository';
import {readRescuedDraft,storeDraftSafely} from '../data/draft-safety';
import {physicsPageLabel} from '../domain/physics-reading';
GlobalWorkerOptions.workerSrc=worker;
export function PhysicsDeviceSource({owner,page,mode='image'}:{owner:PhysicsSourceOwner;page:number;mode?:'text'|'image'}){
 const viewKey=`${storagePrefix(owner)}:physics-source-view:v1`;
 const [initial]=useState(()=>{try{const raw=readRescuedDraft(viewKey,{scope:'device'})??localStorage.getItem(viewKey);const v=raw?JSON.parse(raw):{zoom:1,scrolls:{}};if(!Number.isFinite(v.zoom)||v.zoom<.5||v.zoom>3||!v.scrolls||typeof v.scrolls!=='object')throw Error();return {value:v as {zoom:number;scrolls:Record<string,[number,number]>},blocked:false};}catch{return {value:{zoom:1,scrolls:{} as Record<string,[number,number]>},blocked:true};}});
 const view=useRef(initial.value),scroll=useRef<HTMLDivElement>(null);
 function remember(){if(initial.blocked){setError('원문 시야 저장값을 읽지 못해 기존 값을 덮어쓰지 않았다. 현재 시야는 이 창에서 유지한다.');return;}try{storeDraftSafely(viewKey,JSON.stringify(view.current));}catch{setError('원문 시야를 기기에 보관하지 못했다. 현재 시야는 유지한다. 저장 공간을 확인하고 다시 보관해 주세요.');}}
 function changeZoom(next:number){view.current.zoom=next;setZoom(next);remember();}
 const [pdf,setPdf]=useState<PDFDocumentProxy|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(initial.blocked?'원문 시야 저장값을 읽지 못했다. 기존 저장 원문은 보존한다.':''),[zoom,setZoom]=useState(initial.value.zoom),[retry,setRetry]=useState(0);
 const [text,setText]=useState('');
 const canvas=useRef<HTMLCanvasElement>(null),version=useRef(0),documentRef=useRef<PDFDocumentProxy|null>(null);
 async function open(blob:Blob,request:number){
  const task=getDocument({data:new Uint8Array(await blob.arrayBuffer())});
  const next=await task.promise;
  if(request!==version.current){void next.loadingTask.destroy();return;}
  if(next.numPages!==1069){void next.loadingTask.destroy();throw Error('교재의 전체 페이지 수가 다르다. 기존 원문을 유지했다.');}
  const previous=documentRef.current;documentRef.current=next;setPdf(next);if(previous)void previous.loadingTask.destroy();
 }
 useEffect(()=>{const request=++version.current;setBusy(true);readPhysicsSource(owner).then(async blob=>{if(blob)await open(blob,request);}).catch(e=>{if(request===version.current)setError(e instanceof Error?e.message:'원본을 이 기기에서 불러오지 못했다.');}).finally(()=>{if(request===version.current)setBusy(false);});return()=>{version.current++;if(documentRef.current)void documentRef.current.loadingTask.destroy();documentRef.current=null;};},[owner.namespace,owner.userId,retry]);
 useEffect(()=>{let cancelled=false;setText('');if(pdf)pdf.getPage(page).then(p=>p.getTextContent()).then(content=>{if(!cancelled)setText(content.items.map(item=>'str' in item?item.str+('hasEOL' in item&&item.hasEOL?'\n':' '):'').join(''));}).catch(()=>{if(!cancelled)setError('연결한 원문의 글을 추출하지 못했다. 원본 그림·수식 보기에서 같은 쪽을 읽을 수 있다.');});return()=>{cancelled=true;};},[pdf,page]);
 useEffect(()=>{let cancelled=false;let render:ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']>|undefined;
  if(!pdf||!canvas.current)return;
  pdf.getPage(page).then(p=>{if(cancelled||!canvas.current)return;const v=p.getViewport({scale:zoom});const target=canvas.current;target.width=v.width;target.height=v.height;const ctx=target.getContext('2d');if(!ctx)throw Error('이 브라우저에서 원문을 그릴 수 없다.');render=p.render({canvas:target,canvasContext:ctx,viewport:v});return render.promise.then(()=>{if(cancelled)return;const position=view.current.scrolls[String(page)];if(scroll.current&&Array.isArray(position)&&position.every(Number.isFinite)){scroll.current.scrollLeft=position[0];scroll.current.scrollTop=position[1];}});}).catch(e=>{if(!cancelled)setError(e instanceof Error?e.message:'원문 페이지를 그리지 못했다.');});return()=>{cancelled=true;render?.cancel();};
 },[pdf,page,zoom,mode]);
 return <section className="physics-device-source"><p className="muted">원본 PDF를 이 기기에 연결하면 같은 쪽의 그림·수식·조판을 읽을 수 있다. 서버로 전송하지 않으며, 연결한 기기와 현재 공간에서만 보관한다.</p><Input type="file" accept="application/pdf,.pdf" label="물리 원본 PDF 연결 · 이 기기에 보관" disabled={busy} onChange={async e=>{const file=e.target.files?.[0];e.target.value='';if(!file)return;const request=++version.current;setBusy(true);setError('');try{const blob=await keepPhysicsSource(owner,file);await open(blob,request);}catch(e){if(request===version.current)setError(e instanceof Error?e.message:'원본을 기기에 보관하지 못했다. 기존 값은 유지했다.');}finally{if(request===version.current)setBusy(false);}}}/>{pdf&&<Button onClick={remember}>원문 시야 다시 보관</Button>}{busy&&<LoadingState message="원본 판본을 확인하고 이 기기에 연결하는 중이다."/>}{error&&<><ErrorState message={error}/><Button onClick={()=>{setError('');setRetry(n=>n+1);}}>기기에 보관한 원본 다시 열기</Button></>}{pdf&&<><p>{physicsPageLabel(page)}</p>{mode==='image'&&<div className="physics-observation-tools"><Button onClick={()=>changeZoom(Math.max(.5,zoom/1.25))}>원본 축소</Button><Button onClick={()=>changeZoom(Math.min(3,zoom*1.25))}>원본 확대</Button><Button onClick={()=>changeZoom(1)}>원본 보기 초기화</Button></div>}{mode==='text'?<><p className="muted">이 기기에 연결한 PDF에서 추출한 글이다. 복잡한 수식·그림·읽기 순서는 원본 조판과 대조해야 한다.</p><pre className="physics-source-text physics-prose">{text||'이 쪽의 글을 추출하는 중이다. 그림과 빈 쪽은 원본에서 확인한다.'}</pre></>:<div ref={scroll} onScroll={e=>{view.current.scrolls[String(page)]=[e.currentTarget.scrollLeft,e.currentTarget.scrollTop];remember();}} className="physics-original-scroll" tabIndex={0} role="region" aria-label="물리 원문 PDF · 가로 세로로 이동"><canvas ref={canvas} aria-label={`PDF ${page} 원래 조판`}/></div>}</>}{!pdf&&!busy&&<p>내려받은 Principles of Physics For Scientist and Engineer.pdf를 연결해 주세요. 읽던 쪽·관찰값·메모는 유지한다.</p>}</section>;
}
