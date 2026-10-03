import {useEffect,useRef,useState} from 'react';
import type {AppState} from '../domain/model';
import type {MaterialFile} from '../domain/material-source';
import type {Matrix} from '../domain/linear-algebra';
import {keepDocumentFile,readDocumentFile} from '../data/document-files';
import {Button,ErrorState,LoadingState} from './index';
function Pixels({matrix,label}:{matrix:Matrix;label:string}){
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{const canvas=ref.current;if(!canvas)return;canvas.width=matrix[0].length;canvas.height=matrix.length;const ctx=canvas.getContext('2d');if(!ctx)return;const pixels=ctx.createImageData(canvas.width,canvas.height);matrix.flat().forEach((value,i)=>{const gray=Math.max(0,Math.min(255,Math.round(value)));pixels.data.set([gray,gray,gray,255],i*4);});ctx.putImageData(pixels,0,0);},[matrix]);
  return <figure><canvas className="linear-image-pixels" ref={ref} role="img" aria-label={label}/><figcaption className="prose">{label} · {matrix[0].length}×{matrix.length}</figcaption></figure>;
}
export function LinearImageObservation({owner,file,matrix,approx,onApply,detached=false}:{owner:AppState;file?:MaterialFile;matrix:Matrix;approx:Matrix;onApply:(text:string,file:MaterialFile)=>void;detached?:boolean}){
  const [error,setError]=useState(''),[busy,setBusy]=useState(false),[url,setUrl]=useState('');
  const epoch=useRef(0);
  useEffect(()=>{const version=++epoch.current;let objectUrl='';setUrl('');if(file)void readDocumentFile(owner,file).then(blob=>{if(!blob)throw Error('이 기기에 원영상이 없다. 같은 파일을 다시 연결할 수 있다.');if(version!==epoch.current)return;objectUrl=URL.createObjectURL(blob);setUrl(objectUrl);}).catch(e=>{if(version===epoch.current)setError(e instanceof Error?e.message:'원영상 열기 실패');});return()=>{epoch.current++;if(objectUrl)URL.revokeObjectURL(objectUrl);};},[file?.key,owner.namespace,owner.userId]);
  const load=async(input:File)=>{
    const version=++epoch.current;setBusy(true);setError('');let objectUrl='';
    try{
      if(!['image/png','image/jpeg','image/webp'].includes(input.type))throw Error('PNG·JPEG·WebP 영상을 선택한다. 이전 자료는 유지된다.');
      if(input.size>50*1024*1024)throw Error('영상 파일은50MB 이하로 선택한다.');
      objectUrl=URL.createObjectURL(input);const image=new Image();image.src=objectUrl;await image.decode();
      if(version!==epoch.current)return;
      const ratio=Math.min(1,32/Math.max(image.naturalWidth,image.naturalHeight));const width=Math.max(1,Math.round(image.naturalWidth*ratio)),height=Math.max(1,Math.round(image.naturalHeight*ratio)),canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
      const context=canvas.getContext('2d');if(!context)throw Error('영상 표본을 그리지 못했다.');context.fillStyle='white';context.fillRect(0,0,width,height);context.drawImage(image,0,0,width,height);
      const rgba=context.getImageData(0,0,width,height).data,gray=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>{const i=(y*width+x)*4;return .2126*rgba[i]+.7152*rgba[i+1]+.0722*rgba[i+2];}));
      const saved=await keepDocumentFile(owner,input);
      if(version!==epoch.current)return;
      onApply(gray.map(r=>r.join(' ')).join('\n'),saved);
    }catch(e){if(version===epoch.current)setError(e instanceof Error?e.message:'영상 읽기·보관 실패 · 이전 상태를 유지했다.');}
    finally{if(objectUrl)URL.revokeObjectURL(objectUrl);if(version===epoch.current)setBusy(false);}
  };
  return <section aria-label="영상의 표본과 저계수 복원">
    <label>영상 연결 · 원파일은 이 기기에 보관<input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e=>{const selected=e.target.files?.[0];if(selected)void load(selected);e.target.value='';}}/></label>
    {busy&&<LoadingState message="원영상 보관과 표본 행렬을 준비하는 중이다."/>}{error&&<ErrorState message={error}/>}
    {url&&<figure><img className="linear-original-image" src={url} alt="연결한 원영상 · 원래 색과 종횡비"/><figcaption className="prose">원영상 · {file?.name}</figcaption></figure>}
    {file&&detached&&<p className="prose">행렬을 직접 바꾸거나 개념을 초기화하여 현재 행렬은 이 원영상의 표본과 별개이다. 원파일은 보존했으며 다시 연결하면 새 표본으로 돌아온다.</p>}
    <div className="linear-image-comparison"><Pixels matrix={matrix} label="회색값 표본 행렬"/><Pixels matrix={approx} label="저계수로 재구성한 표본"/></div>
    <p className="prose">원영상의 종횡비를 유지한 최대32×32 표본에 회색값 변환과 SVD를 적용한다. 현재 표시는0=검정·255=흰색이며, 교재의 반대 밝기 관례와 구별한다. 표본 축소·회색값 변환의 손실과 SVD 손실을 구별한다. 아래 오차는 현재 행렬에 대한 것이며 원영상 전체의 오차가 아니다. 계산값은 자르지 않고, 화면 밝기만0~255로 제한한다.</p>
    {url&&<Button onClick={()=>{const a=document.createElement('a');a.href=url;a.download=file?.name??'original';a.click();}}>보관한 원영상 받기</Button>}
  </section>;
}
