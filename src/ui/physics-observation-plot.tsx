import { useEffect, useMemo, useRef, useState } from 'react';
import Plotly, { type Data, type PlotlyHTMLElement } from 'plotly.js-dist-min';
import { samplePhysics, selectedAbscissa, evaluatePhysics, type PhysicsObservation } from '../domain/physics-observations';
import type { PhysicsView } from '../data/physics-observation-view';
import { Button, ErrorState } from './index';
import { MathFormula } from './math-formula';
import { useMathPlotTouch, mathPlotConfig, mathPlotPan, type MathPan } from './math-plot-touch';
import { physicsAxisLabel as axisLabel } from './physics-axis-label';

export function PhysicsObservationPlot({item,view,onRanges}:{item:PhysicsObservation;view:PhysicsView;onRanges:(ranges:PhysicsView['ranges'])=>void}) {
  const host=useRef<HTMLDivElement>(null), zoom=useRef<((factor:number)=>void)|null>(null), pan=useRef<MathPan|null>(null);
  const callback=useRef(onRanges);callback.current=onRanges;
  const ranges=useRef(view.ranges);ranges.current=view.ranges;
  const generation=useRef(0),[error,setError]=useState(''),[theme,setTheme]=useState(0),[ready,setReady]=useState(false);
  const points=useMemo(()=>samplePhysics(item,view.values),[item,view.values]);
  useMathPlotTouch(host,zoom,pan);
  useEffect(()=>{const observer=new MutationObserver(()=>setTheme(n=>n+1));observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','class','style']});observer.observe(document.body,{attributes:true,attributeFilter:['class','style']});return ()=>observer.disconnect();},[]);
  useEffect(()=>{
    const node=host.current as PlotlyHTMLElement|null;if(!node)return;
    const token=++generation.current;
    const css=getComputedStyle(node),color=(s:string)=>css.getPropertyValue(s).trim();
    const traces:Data[]=[{type:'scatter',mode:'lines',name:item.name,x:points.map(p=>p.x),y:points.map(p=>p.y),connectgaps:false,line:{color:color('--color-math-curve'),width:2},hovertemplate:'%{x:.4g}, %{y:.4g}<extra></extra>'}];
    const x=selectedAbscissa(item,view.values),y=evaluatePhysics(item,view.values,x);
    if(y!==null&&item.engine!=='projectile')traces.push({type:'scatter',mode:'markers',name:'현재 조건',x:[x],y:[y],marker:{size:9,color:color('--color-math-point')},hovertemplate:'현재: %{x:.4g}, %{y:.4g}<extra></extra>'});
    const saved=ranges.current;
    const result=Plotly.react(node,traces,{paper_bgcolor:color('--color-surface'),plot_bgcolor:color('--color-surface'),font:{color:color('--color-text'),size:14},margin:{l:65,r:15,t:20,b:45},showlegend:false,dragmode:'pan',uirevision:item.id,xaxis:{title:{text:axisLabel(item.x)},...(saved?{range:saved.x,autorange:false}:{}),gridcolor:color('--color-border'),zerolinecolor:color('--color-border')},yaxis:{title:{text:axisLabel(item.y)},...(saved?{range:saved.y,autorange:false}:{}),...(item.engine==='projectile'?{scaleanchor:'x',scaleratio:1}:{}),gridcolor:color('--color-border'),zerolinecolor:color('--color-border')}},mathPlotConfig);
    let remove:(()=>void)|undefined;
    void result.then(()=>{
      if(token!==generation.current)return;
      setReady(true);setError('');
      const report=(event:unknown)=>{if(event&&typeof event==='object'&&(('xaxis.autorange' in event&&event['xaxis.autorange']===true)||('yaxis.autorange' in event&&event['yaxis.autorange']===true))){callback.current(undefined);return;}const layout=(node as unknown as {_fullLayout:unknown})._fullLayout as {xaxis:{range:[number,number]};yaxis:{range:[number,number]}};const next={x:[...layout.xaxis.range] as [number,number],y:[...layout.yaxis.range] as [number,number]};if(next.x.every(Number.isFinite)&&next.y.every(Number.isFinite))callback.current(next);};
      node.on('plotly_relayout',report);remove=()=>node.removeAllListeners('plotly_relayout');
      zoom.current=(factor)=>{const l=(node as unknown as {_fullLayout:unknown})._fullLayout as {xaxis:{range:[number,number]};yaxis:{range:[number,number]}};const adjust=(r:[number,number])=>{const mid=(r[0]+r[1])/2,half=(r[1]-r[0])*factor/2;return [mid-half,mid+half] as [number,number];};void Plotly.relayout(node,{'xaxis.range':adjust(l.xaxis.range),'yaxis.range':adjust(l.yaxis.range)});};
      pan.current=mathPlotPan(node,()=>{const l=(node as unknown as {_fullLayout:unknown})._fullLayout as {xaxis:{range:[number,number]};yaxis:{range:[number,number]}};return [l.xaxis.range,l.yaxis.range];},next=>{void Plotly.relayout(node,{'xaxis.range':next[0] as [number,number],'yaxis.range':next[1] as [number,number]});});
    }).catch(()=>{if(token===generation.current)setError('그래프를 그리지 못했다. 값과 메모는 유지했다.');});
    const observer=new ResizeObserver(()=>{void Plotly.Plots.resize(node);});observer.observe(node);
    return ()=>{generation.current++;remove?.();observer.disconnect();zoom.current=null;pan.current=null;};
  },[item,points,view.values,theme]);
  useEffect(()=>()=>{if(host.current)Plotly.purge(host.current);},[]);
  const reset=()=>{callback.current(undefined);if(host.current)void Plotly.relayout(host.current,{'xaxis.autorange':true,'yaxis.autorange':true});};
  return <section aria-label="관찰 그래프"><div className="physics-plot-actions"><Button disabled={!ready} onClick={()=>zoom.current?.(0.8)} aria-label="그래프 확대">＋</Button><Button disabled={!ready} onClick={()=>zoom.current?.(1.25)} aria-label="그래프 축소">−</Button><Button onClick={reset}>보기 초기화</Button></div><p className="muted">끌어 이동 · 두 손가락으로 확대. 보기 초기화는 값·메모를 유지한다.</p>{error&&<ErrorState message={error}/>}<div ref={host} className="physics-plot" role="img" aria-label={`${item.name}의 계산 곡선과 현재 조건의 점`}/><div className="physics-axes"><span>가로축 <MathFormula tex={item.x} inline/></span><span>세로축 <MathFormula tex={item.y} inline/></span></div><p className="muted">유한한 계산값으로 그린 곡선이며 일반 증명이나 실제 관측이 아니다. 숫자값을 펼쳐 같은 조건을 비교할 수 있다.</p><details><summary>곡선의 숫자값</summary><table><thead><tr><th>가로축</th><th>세로축</th></tr></thead><tbody>{points.filter((_,i)=>i%Math.max(1,Math.floor((points.length-1)/20))===0).map((p,i)=><tr key={i}><td>{p.x.toPrecision(5)}</td><td>{p.y===null?'계산 보류':p.y.toPrecision(5)}</td></tr>)}</tbody></table></details></section>;
}
