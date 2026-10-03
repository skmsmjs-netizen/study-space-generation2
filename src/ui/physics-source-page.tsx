import {physicsPageLabel} from '../domain/physics-reading';
import {useEffect,useState} from 'react';
import {Button,ErrorState,LoadingState} from './index';
/** Original pixels are local-only; a failed rendering never changes reading state or memo. */
export function PhysicsSourcePage({page}:{page:number}){
 const [status,setStatus]=useState<'loading'|'ready'|'unavailable'>('loading'),[error,setError]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{const c=new AbortController();setStatus('loading');setError(false);fetch(`${import.meta.env.BASE_URL}__physics/status`,{signal:c.signal}).then(async r=>{if(!r.ok)throw Error();const x=await r.json();if(!c.signal.aborted)setStatus(x.pdfAvailable===true?'ready':'unavailable');}).catch(()=>{if(!c.signal.aborted)setStatus('unavailable');});return()=>c.abort();},[page,retry]);
 if(status==='loading')return <LoadingState message="원본 페이지를 확인하는 중이다."/>;
 if(status==='unavailable'||error)return <><ErrorState message={status==='unavailable'?'원본 PDF를 아직 읽을 수 없다. 본문 추출본·쪽 위치·메모는 유지한다.':'원본 페이지를 그리지 못했다. 쪽 위치와 메모는 유지했다.'}/><Button onClick={()=>setRetry(n=>n+1)}>원본 페이지 다시 불러오기</Button></>;
 return <><p className="muted">{physicsPageLabel(page)}의 원본 그림과 수식 조판이다. 원본 열람은 해설의 수학적 정확성 검증이나 공부 완료 기록과 구별한다.</p><div className="physics-original-scroll" tabIndex={0} role="region" aria-label="원본 페이지 · 가로로 이동하여 확대된 페이지 읽기"><img key={`${page}-${retry}`} className="physics-original-page" src={`${import.meta.env.BASE_URL}__physics/image/${page}?retry=${retry}`} alt={`교재 원본 PDF ${page}쪽. 본문 읽기는 추출본에서도 확인할 수 있다.`} onError={()=>setError(true)}/></div><a href={`${import.meta.env.BASE_URL}__physics/source.pdf#page=${page}`} target="_blank" rel="noreferrer">원본 PDF에서 확대해 읽기</a></>;
}
