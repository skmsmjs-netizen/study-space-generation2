import {useEffect,useRef,useState} from 'react';
import type {MemoStroke} from '../domain/model';
import {inkRaster} from '../data/ink-documents';
import {recognizeInkImage} from '../data/local-ocr';
import {Button,Textarea} from './index';
import {readRescuedDraft,storeDraftSafely,clearStoredDraft} from '../data/draft-safety';
import {strokePage} from '../domain/ink-editing';
export function InkOCR({strokes,page,disabled,onApply,documentKey}:{strokes:MemoStroke[];page:number;disabled:boolean;onApply:(text:string)=>void;documentKey?:string}) {
 const key=documentKey ? documentKey+':ocr-candidate:v1' : undefined;
 const [candidate,setCandidate]=useState<string|null>(()=>{try {return key ? readRescuedDraft(key) ?? localStorage.getItem(key) : null;}catch{return null;}}),[status,setStatus]=useState(''),[busy,setBusy]=useState(false);
 const operation=useRef<AbortController|null>(null);
 useEffect(()=>()=>operation.current?.abort(),[]);
 useEffect(()=>{if(key && candidate!==null)try{storeDraftSafely(key,candidate);}catch{setStatus('인식 결과를 이 기기에 저장하지 못했습니다. 현재 창에서 복사해 주세요.');}},[candidate,key]);
 const dismiss=()=>{if(key)try{clearStoredDraft(key);}catch{setStatus('인식 결과의 초안을 정리하지 못했습니다.');return;}setCandidate(null);};
 const recognize=async()=>{const controller=new AbortController();operation.current=controller;setBusy(true);setStatus('이 쪽의 필기에서 글자를 읽고 있습니다.');let canvas:HTMLCanvasElement|undefined;
  try{canvas=await inkRaster(strokes,page);controller.signal.throwIfAborted();const text=await recognizeInkImage(canvas,controller.signal,setStatus);if(!controller.signal.aborted){setCandidate(text);setStatus(text.trim()?'인식한 글을 확인·수정한 뒤 넣어 주세요.':'읽은 글자가 없습니다. 원본 필기는 그대로 있습니다.');}}
  catch(e){if(!controller.signal.aborted)setStatus(e instanceof Error?e.message:'글자를 읽지 못했습니다. 원본 필기는 그대로 있습니다.');}
  finally{if(canvas)canvas.width=canvas.height=0;if(operation.current===controller){operation.current=null;setBusy(false);}}
 };
 return <details className="ink-ocr"><summary>필기를 글로 옮기기</summary><p className="muted">현재 쪽의 필기만 읽습니다. 손글씨·수식은 잘못 읽을 수 있으므로 결과를 확인해 주세요. 원본 필기는 유지됩니다.</p>
 <Button disabled={disabled||busy||!strokes.some(s=>strokePage(s)===page)} onClick={()=>void recognize()}>이 쪽 글자 읽기</Button>
 {busy&&<Button onClick={()=>{operation.current?.abort();setBusy(false);setStatus('글자 읽기를 중단했습니다. 원본 필기는 그대로 있습니다.');}}>글자 읽기 중단</Button>}
 {status&&<p role="status">{status}</p>}
 {candidate!==null&&<><Textarea label="인식한 글 확인·수정" value={candidate} rows={4} onChange={e=>setCandidate(e.target.value)}/><Button disabled={disabled||busy||!candidate.trim()} onClick={()=>{onApply(candidate);dismiss();setStatus('확인한 글을 넣었습니다. 원본 필기는 유지했습니다.');}}>확인한 글 넣기</Button><Button onClick={dismiss}>인식 결과 닫기</Button></>}
 </details>;
}
