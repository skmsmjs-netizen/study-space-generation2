import { useMemo, useState } from 'react';
import { canonicalEvents, type EvidenceEvent } from '../domain/recommendation-kernel.mjs';
import { Button } from './index';
import { SourceInk } from './performance-from-source';
const labels = { pass:'기준을 충족함', fail:'막힘', unknown:'결과 미확인', disputed:'판정에 이견 있음' };
function Result({ event: e }: { event: EvidenceEvent }) {
  return <div className="next-study-evidence"><p>{e.kind === 'correction' ? '교정 기록' : labels[e.result!]} · {e.assistance === 'none' ? '도움 없음' : e.assistance === 'notes' ? '도움 사용' : '도움 여부 미확인'}</p><p className="muted">{new Date(e.occurredAt!).toLocaleString('ko-KR')} · {e.novelty === 'new' ? '새 문항' : e.novelty === 'same' ? '같은 문항' : '문항 새로움 미확인'} · 결과 버전 {e.revision}</p>{e.answer && <details><summary>답안 원문</summary><p className="next-study-answer">{e.answer}</p></details>}{e.source && <><SourceInk strokes={e.source.strokes} /><p className="muted">원문 버전 {e.source.version} · {e.source.performedAt ? '시험 종료 시각' : '결과를 남긴 시각'}</p><a href={e.source.kind === 'exam-memo' ? `#/memos/${encodeURIComponent(e.source.id)}` : `#/memory-test/result/${encodeURIComponent(e.source.id)}`}>원문 답안 열기</a></>}</div>;
}
export function PerformanceEvidence({ events, goalId, at }: { events: EvidenceEvent[]; goalId: string; at: string }) {
  const [opened,setOpened]=useState(false), [count,setCount]=useState(20), [history,setHistory]=useState<string | null>(null);
  const current=useMemo(()=>canonicalEvents(events,at,at).filter(e=>e.facet === goalId).sort((a,b)=>b.knownAt.localeCompare(a.knownAt)||b.sequence-a.sequence),[events,goalId,at]);
  return <details onToggle={e=>setOpened(e.currentTarget.open)}><summary>근거 보기</summary>{opened && <><p className="muted">공부 체크는 수행 성공으로 세지 않습니다. 최신 판정을 표시하며, 답안과 이전 판정은 펼쳐 볼 수 있습니다.</p>{current.slice(0,count).map(e=><div key={e.id}><Result event={e} />{events.some(old=>old.id===e.id && old.revision<e.revision) && <><Button variant="quiet" aria-expanded={history===e.id} onClick={()=>setHistory(history===e.id?null:e.id)}>이전 판정 보기</Button>{history===e.id && events.filter(old=>old.id===e.id && old.revision<e.revision).sort((a,b)=>b.revision-a.revision).map(old=><Result key={old.revision} event={old} />)}</>}</div>)}{current.length>count && <Button onClick={()=>setCount(count+20)}>이전 결과 더 보기</Button>}</>}</details>;
}
