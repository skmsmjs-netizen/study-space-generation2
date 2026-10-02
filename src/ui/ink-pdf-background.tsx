import {useEffectEvent, useEffect,useState} from 'react';
import type {AppState,MemoDocument} from '../domain/model';
import {openInkPDF,paperFit} from '../data/ink-documents';
export function InkPDFBackground({owner,document:reference,page,onError}:{owner:Pick<AppState,'userId'|'namespace'>;document:MemoDocument;page:number;onError:(message:string)=>void}) {
 const [image,setImage]=useState<{href:string;x:number;y:number;width:number;height:number}|null>(null);
 const userId=owner.userId, namespace=owner.namespace, file=reference.file, pages=reference.pages, startPage=reference.startPage;
 const openSource=useEffectEvent(()=>openInkPDF({userId,namespace},reference));
 const reportError=useEffectEvent((message:string)=>onError(message));
 const [pdf,setPDF]=useState<Awaited<ReturnType<typeof openInkPDF>>|null>(null);
 // biome-ignore lint/correctness/useExhaustiveDependencies: File and owner identity control loading; latest document fields and error callbacks do not reopen the PDF while drawing.
 useEffect(()=>{let closed=false;let opened:typeof pdf=null;setPDF(null);setImage(null);
  void openSource().then(value=>{opened=value;if(closed)void value.destroy();else setPDF(value);}).catch(e=>{if(!closed)reportError(e instanceof Error?e.message:'PDF를 열지 못했습니다.');});
  return()=>{closed=true;if(opened)void opened.destroy();};
 },[userId,namespace,file.key,file.cloudPath,pages]);
 useEffect(()=>{setImage(null);if(!pdf||page<startPage||page>=startPage+pages)return;
  let closed=false;let task:ReturnType<Awaited<ReturnType<typeof pdf.getPage>>['render']>|undefined;
  let canvas:HTMLCanvasElement|undefined;
  void (async()=>{const p=await pdf.getPage(page-startPage+1);if(closed)return;
    const original=p.getViewport({scale:1}),fit=paperFit(original.width,original.height);
    const viewport=p.getViewport({scale:fit.scale*2});canvas=window.document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
    task=p.render({canvas,viewport});await task.promise;
    if(!closed)setImage({href:canvas.toDataURL('image/png'),x:fit.x,y:fit.y,width:fit.width,height:fit.height});p.cleanup();
  })().catch(e=>{if(!closed)reportError(e instanceof Error?e.message:'PDF 쪽을 표시하지 못했습니다.');}).finally(()=>{if(canvas)canvas.width=canvas.height=0;});
  return()=>{closed=true;task?.cancel();};
 },[pdf,page,startPage,pages]);
 return image?<image {...image} pointerEvents="none"/>:null;
}
