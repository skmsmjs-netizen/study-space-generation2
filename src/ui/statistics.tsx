import { useEffect, useMemo, useState } from 'react';
import { canonicalEvents } from '../domain/recommendation-kernel.mjs';
import type { AppState } from '../domain/model';
import { datePlacement, koreanDay, shiftDay, statisticBounds, statistics, validPeriod, type MetricId, type StatisticItem } from '../domain/statistics';
import { readLearningPlan } from '../data/learning-plan';
import { emptyRecommendations } from '../domain/recommendation-workspace';
import { Button, Card, Checkbox, Input, Modal, Select, SegmentedControl } from './index';
import './statistics.css';
const format = (lo: number, hi: number | null) => hi === null ? `${lo} 이상 · 상한 미정` : lo === hi ? `${lo}` : `${lo}–${hi}`;
export function StudyStatistics({ data, subjectIds, compact = false }: { data: AppState; subjectIds: string[]; compact?: boolean }) {
  const today = koreanDay(new Date().toISOString());
  const [from,setFrom] = useState(shiftDay(today,-13)), [to,setTo] = useState(today);
  const [subjectId,setSubject] = useState(''), [nodeId,setNode] = useState(''), [metricId,setMetric] = useState<MetricId>('sessions');
  const [view,setView] = useState('graph'), [compare,setCompare] = useState(false), [zoom,setZoom] = useState(1);
  const [cursor,setCursor] = useState<number | null>(null), [playing,setPlaying] = useState(false);
  const [reduceMotion,setReduceMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  useEffect(() => { const query=window.matchMedia?.('(prefers-reduced-motion: reduce)'); if(!query)return;const update=()=>setReduceMotion(query.matches);query.addEventListener?.('change',update);return()=>query.removeEventListener?.('change',update); }, []);
  useEffect(() => {setCursor(null);setPlaying(false);}, [from,to,metricId,subjectId,nodeId]);
  const [frozen,setFrozen] = useState<{ label:string; items:StatisticItem[]; source:AppState; events:typeof workspace.events } | null>(null);
  const [selected,setSelected] = useState<{ label:string; items:StatisticItem[] } | null>(null);
  let workspace = emptyRecommendations(data), readError = '';
  try { workspace = readLearningPlan(data).workspace; } catch { readError = '추천 수행 자료를 읽지 못했습니다. 공부 기록은 표시하며 수행 지표는 확인할 수 없습니다.'; }
  const valid = validPeriod(from,to), days = valid ? Math.round((Date.parse(to)-Date.parse(from))/86400000)+1 : 0;
  const metrics = useMemo(() => statistics(data,workspace,{ from,to,subjectIds,subjectId,nodeId },new Date().toISOString()), [data,workspace,from,to,subjectIds,subjectId,nodeId]);
  const metric = metrics.find(m => m.id === metricId)!;
  const previousTo = valid ? shiftDay(from,-1) : today, previousFrom = valid ? shiftDay(from,-days) : today;
  const step = Math.max(1,Math.ceil(days/14));
  const bins = valid ? Array.from({length:Math.ceil(days/step)},(_,i) => {
    const lo = shiftDay(from,i*step), hi = shiftDay(from,Math.min(days-1,(i+1)*step-1));
    const current = statisticBounds({ ...metric, items:metric.items.filter(item => item.date.kind === 'exact') },lo,hi);
    const prev = statisticBounds({ ...metric, items:metric.items.filter(item => item.date.kind === 'exact') },shiftDay(previousFrom,i*step),shiftDay(previousFrom,Math.min(days-1,(i+1)*step-1)));
    return {lo,hi,current,prev};
  }) : [];
  const maximum = Math.max(2,...bins.flatMap(b => [b.current.lower,compare?b.prev.lower:0]));
  useEffect(() => { if(!playing||reduceMotion) {if(reduceMotion)setPlaying(false);return;}const timer=window.setInterval(()=>setCursor(i=>{const next=(i??-1)+1;if(next>=bins.length){setPlaying(false);return bins.length-1;}return next;}),900);return()=>window.clearInterval(timer);}, [playing,reduceMotion,bins.length]);
  const selection = frozen ?? selected;
  const sourceData = frozen?.source ?? data, sourceEvents = canonicalEvents(frozen?.events ?? workspace.events, new Date().toISOString(), new Date().toISOString());
  const openEvidence = (label:string, items:StatisticItem[]) => { if(compact){location.hash='#/statistics';return;} setFrozen(null); setSelected({label,items}); };
  const dateLabel = (i:StatisticItem) => i.date.kind === 'unknown' ? '공부 날짜 미정' : i.date.kind === 'exact' ? i.date.date : `${i.date.from}–${i.date.to} 사이`;
  if (compact) return <Card className="study-statistics"><div className="section-heading"><h2>공부 기록의 변화</h2><a href="#/statistics">통계와 그래프 보기</a></div><p className="muted">최근 14일 · 공부 회차입니다. 체크는 이해나 정답 판정이 아닙니다.</p>{chart()}{!metric.items.length && <p className="muted">공부를 남기면 이곳에 변화가 보입니다.</p>}</Card>;
  function chart() { return <div className="statistics-scroll"><svg className="statistics-chart" style={{width:`${zoom*100}%`}} viewBox="0 0 800 260" role="img" aria-label={`${metric.label} · 정확한 날짜가 있는 기록의 변화`}>
    {[0,.5,1].map(r => <g key={r}><line className="grid" x1="40" y1={210-r*180} x2="790" y2={210-r*180}/><text x="4" y={215-r*180}>{Math.round(maximum*r)}</text></g>)}
    {bins.map((b,i) => {const width=740/Math.max(1,bins.length),x=45+i*width; return <g key={b.lo} className="bar-control" style={{opacity:cursor!==null&&i>cursor?0.35:1}} role="button" tabIndex={0} aria-label={`${b.lo}${b.lo===b.hi?'':`부터 ${b.hi}`} ${b.current.lower}${metric.unit} · 근거 보기`} onClick={() => openEvidence(`${b.lo}–${b.hi}`,b.current.evidence)} onKeyDown={e => {if(e.key==='Enter'||e.key===' '){e.preventDefault();openEvidence(`${b.lo}–${b.hi}`,b.current.evidence);}}}>
      <title>{b.lo}–{b.hi}: {b.current.lower}{metric.unit}{compare?` · 이전 기간 ${b.prev.lower}${metric.unit}`:''}</title>
      {compare && <rect className="previous-bar" x={x+width*.05} y={210-b.prev.lower/maximum*180} width={width*.3} height={b.prev.lower/maximum*180}/>}
      <rect className="current-bar" x={x+width*(compare?.4:.15)} y={210-b.current.lower/maximum*180} width={width*(compare?.4:.7)} height={Math.max(2,b.current.lower/maximum*180)}/>
      {view==='depth'&&b.current.lower>0&&<g aria-hidden="true"><polygon points={`${x+width*(compare?.4:.15)},${210-b.current.lower/maximum*180} ${x+width*(compare?.4:.15)+8},${202-b.current.lower/maximum*180} ${x+width*(compare?.8:.85)+8},${202-b.current.lower/maximum*180} ${x+width*(compare?.8:.85)},${210-b.current.lower/maximum*180}`} style={{fill:'var(--color-primary)',opacity:.7}}/><polygon points={`${x+width*(compare?.8:.85)},${210-b.current.lower/maximum*180} ${x+width*(compare?.8:.85)+8},${202-b.current.lower/maximum*180} ${x+width*(compare?.8:.85)+8},202 ${x+width*(compare?.8:.85)},210`} style={{fill:'var(--color-primary)',opacity:.5}}/></g>}
      <text x={x+width*.3} y="235">{b.lo.slice(5)}</text><text x={x+width*.3} y={200-b.current.lower/maximum*180}>{b.current.lower}</text>
    </g>;})}
  </svg></div>; }
  return <section className="study-statistics" aria-label="공부 통계">
    <p className="muted">남긴 기록을 기준으로 계산합니다. 수행 결과는 자기 보고이며, 빈 기간은 기록이 없다는 뜻입니다.</p>
    {readError && <p role="alert">{readError}</p>}
    <div className="statistics-filters">
      <Input label="통계 시작일" type="date" value={from} onChange={e=>setFrom(e.target.value)}/><Input label="통계 종료일" type="date" value={to} onChange={e=>setTo(e.target.value)}/>
      <Select label="통계 과목" value={subjectId} onChange={e=>{setSubject(e.target.value);setNode('');}}><option value="">현재 범위 전체</option>{data.subjects.filter(s=>!s.deletedAt&&subjectIds.includes(s.id)).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Select>
      <Select label="통계 단원·주제" value={nodeId} onChange={e=>setNode(e.target.value)}><option value="">전체 목차</option>{data.nodes.filter(n=>!n.deletedAt&&subjectIds.includes(n.subjectId)&&(!subjectId||n.subjectId===subjectId)).map(n=><option key={n.id} value={n.id}>{data.subjects.find(s=>s.id===n.subjectId)?.name} · {n.name}</option>)}</Select>
    </div>
    <div className="actions">{[7,14,30].map(n=><Button key={n} variant="quiet" onClick={()=>{setFrom(shiftDay(today,1-n));setTo(today);}}>최근 {n}일</Button>)}<Checkbox label="같은 길이의 이전 기간과 비교" checked={compare} onChange={e=>setCompare(e.target.checked)}/></div>
    {!valid ? <p role="alert">시작일과 종료일을 확인해 주세요.</p> : <>
      <div className="statistics-metrics">{metrics.map(m=>{const b=statisticBounds(m,from,to),prev=statisticBounds(m,previousFrom,previousTo);const unavailable=readError&&['attempts','successes','corrections'].includes(m.id); return <button key={m.id} className="statistics-metric" aria-pressed={metricId===m.id} onClick={()=>setMetric(m.id)}><span>{m.label}</span><strong>{unavailable?'확인 불가':format(b.lower,b.upper)}{m.denominator!==undefined?` / ${m.denominator}`:''}</strong><small>{m.unit}{b.undated?` · 날짜 미정 ${b.undated}건 별도`:''}</small>{compare&&<small>이전 기간 {format(prev.lower,prev.upper)}</small>}</button>;})}</div>
      <Card><h2>{metric.label}</h2><p>{metric.description}</p><div className="actions"><SegmentedControl value={view} onChange={setView} items={[{id:'graph',label:'그래프'},{id:'depth',label:'입체'},{id:'list',label:'목록'}]}/><Button variant="quiet" onClick={()=>setZoom(z=>z===1?2:1)}>{zoom===1?'그래프 확대':'원래 크기'}</Button><Button variant="quiet" onClick={()=>openEvidence(`${from}–${to} · 전체 근거`,statisticBounds(metric,from,to).evidence)}>전체 근거 보기</Button></div>
      <div className="actions"><Button disabled={reduceMotion||!bins.length} onClick={()=>{if(playing)setPlaying(false);else{setCursor(-1);setPlaying(true);}}}>{playing?'재생 멈추기':'시간순 재생'}</Button><Button variant="quiet" disabled={!bins.length} onClick={()=>{setPlaying(false);setCursor(i=>Math.min(bins.length-1,(i??-1)+1));}}>다음 구간</Button><Button variant="quiet" onClick={()=>{setPlaying(false);setCursor(null);}}>전체 구간</Button></div>
      {reduceMotion&&<p className="muted">기기의 동작 줄이기 설정에 따라 자동 재생을 멈췄습니다. 다음 구간으로 직접 볼 수 있습니다.</p>}
      {cursor!==null&&cursor>=0&&bins[cursor]&&<p className="muted">{bins[cursor].lo}–{bins[cursor].hi} 구간까지 강조 · 계산값은 그대로 유지합니다.</p>}
      <p className="muted">그래프는 날짜가 정확한 기록만 표시합니다. 반복 막대는 확인된 최소 횟수입니다. 날짜 범위·날짜 미정·반복 횟수 미정은 아래 근거에서 확인할 수 있습니다.{compare?` 이전 기간: ${previousFrom}–${previousTo} (회색)`:''}</p>
      {view!=='list'?chart():<div className="statistics-scroll"><table className="statistics-table"><thead><tr><th>기간</th><th>현재</th>{compare&&<th>이전 기간</th>}<th>근거</th></tr></thead><tbody>{bins.map(b=><tr key={b.lo}><td>{b.lo}–{b.hi}</td><td>{b.current.lower}{metric.unit}</td>{compare&&<td>{b.prev.lower}{metric.unit}</td>}<td><Button variant="quiet" onClick={()=>openEvidence(`${b.lo}–${b.hi}`,b.current.evidence)}>기록 보기</Button></td></tr>)}</tbody></table></div>}
      <details><summary>계산 기준과 미확정 기록</summary><p>모집단은 현재 선택한 학기·과목·목차의 살아 있는 기록입니다. 같은 ID는 중복 계산하지 않습니다. 주제 분모는 현재 목차의 주제 수입니다. 날짜 범위가 기간 안에 모두 들어오면 포함하고, 일부만 겹치면 가능한 상한에만 포함합니다. 날짜 미정은 기간 밖의 별도 건수로 남습니다.</p>{metric.items.filter(i=>i.date.kind!=='exact'||i.maximum===null).map(i=><p key={`${i.id}:${i.recordIds.join()}`}>{i.label} · {dateLabel(i)} · {format(i.value,i.maximum)}{metric.unit}</p>)}</details>
      </Card>
    </>}
    <Modal open={Boolean(selection)} title="통계의 원기록" onClose={()=>{setFrozen(null);setSelected(null);}}>{selection&&<><p>{selection.label}</p><Button variant="quiet" aria-pressed={Boolean(frozen)} onClick={()=>setFrozen(frozen?null:structuredClone({...selection,source:data,events:workspace.events}))}>{frozen?'고정 풀기':'이 근거 고정하기'}</Button>{frozen&&<p className="muted">선택 당시 근거를 고정했습니다. 이후 변경은 전체 근거를 다시 열어 확인하세요.</p>}<div className="statistics-evidence">{selection.items.length?selection.items.map((i,index)=><article key={`${i.id}:${index}`}><strong>{i.label}</strong><p className="muted">{dateLabel(i)} · {datePlacement(i.date,from,to)==='possible'?'기간 포함 여부 미확정':i.date.kind==='unknown'?'기간에 배정하지 않음':`${i.value}${metric.unit}`}</p>{i.recordIds.map(id=>{const r=sourceData.records.find(r=>r.id===id);return r&&<div key={id}><p>{r.body||'남긴 글 없음'}</p><a href={`#/node/${encodeURIComponent(r.targetId)}`}>주제에서 원기록 열기</a></div>;})}{i.eventIds.map(id=>{const e=sourceEvents.find(e=>e.id===id);return e&&<div key={id}><p>{e.answer||'남긴 답변 없음'}</p><p>{e.kind==='correction'?'교정 기록':e.result==='pass'?'기준 충족':e.result==='fail'?'막힘':'결과 미확인'} · 자기 보고</p><a href="#/">다음 공부에서 결과 열기</a></div>;})}</article>):<p>이 구간에 해당하는 정확한 날짜의 기록이 없습니다.</p>}</div></>}</Modal>
  </section>;
}
