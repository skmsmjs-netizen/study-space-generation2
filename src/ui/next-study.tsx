import { useEffect, useRef, useState } from 'react';
import type { StudyRepository } from '../data/repository';
import { readLearningPlan, saveLearningPlan, readLegacyPersonalPlan } from '../data/learning-plan';
import { LearningScheduleEditor } from './learning-schedule';
import type { AppState } from '../domain/model';
import { DAY, type RequirementState } from '../domain/recommendation-kernel.mjs';
import { dateDeadline, termPeriod, emptyRecommendations, emptyResponse, makeResultEvent, recommendationInput, nextStudy, readRecommendations, saveRecommendations, type CheckGoal, type RecommendationWorkspace, type ResponseDraft } from '../data/recommendations';
import { Button, Card, ErrorState, Input, Modal, Select, Textarea } from './index';
import { navigate } from './navigation-context';
import './next-study.css';

const explanations: Record<RequirementState['status'], string> = {
  unobserved: '이 내용의 수행 결과는 아직 남기지 않았습니다.',
  activity_only: '공부한 기록은 있습니다. 이 내용을 혼자 확인한 결과는 아직 모릅니다.',
  error_open: '혼자 확인했을 때 막힌 기록이 있습니다. 관련 설명이나 예제를 본 뒤 다시 확인해 보세요.',
  corrected_pending: '다시 정리한 기록이 있습니다. 자료를 덮고 한 번 더 확인해 보세요.',
  confirmed: '남긴 기준에서 혼자 확인한 결과가 있습니다. 전체 이해나 다른 문제의 해결을 뜻하지는 않습니다.',
  disputed: '결과에 이견이 있습니다. 답변과 확인 기준을 함께 살펴보세요.',
};
export function NextStudy({ data, subjectIds, semesterId, repository, onSaved }: { data: AppState; subjectIds: string[]; semesterId?: string; repository?: StudyRepository; onSaved?: (data:AppState)=>void }) {
  const serverReady = !repository || data.namespace === 'demo' || repository.getCapabilities?.().includes('saveLearningPlan');
  const [boot] = useState(() => { try { return { ...(repository ? readLearningPlan(data) : readRecommendations(data)), error: '' }; } catch { return { raw: null, workspace: emptyRecommendations(data), error: '추천 내용을 읽지 못했습니다. 저장된 내용은 덮어쓰지 않았습니다. 다시 읽어 주세요.' }; } });
  const [workspace, setWorkspace] = useState(boot.workspace), current = useRef(workspace), raw = useRef(boot.raw);
  const [error, setError] = useState(boot.error), [blocked, setBlocked] = useState(Boolean(boot.error));
  const [planOpen, setPlanOpen] = useState(false), [responseId, setResponseId] = useState<string | null>(null);
  const [termOpen, setTermOpen] = useState(false);
  const [now, setNow] = useState(() => new Date().toISOString());
  useEffect(() => {
    const refresh = () => setNow(new Date().toISOString());
    const timer = window.setInterval(refresh, 60000);
    window.addEventListener('focus', refresh); document.addEventListener('visibilitychange', refresh);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, []);
  useEffect(() => {
    if (!repository) return;
    try { const saved=readLearningPlan(data); if(saved.raw === raw.current) return;
      if(JSON.stringify(current.current) === raw.current || raw.current === null && current.current.revision === 0) { current.current=saved.workspace;raw.current=saved.raw;setWorkspace(saved.workspace); }
      else setError('서버의 변경과 작성 중인 내용을 모두 유지했습니다. 현재 입력을 보존한 뒤 다시 열어 주세요.');
    } catch { setError('저장된 학습 일정을 다시 읽지 못했습니다. 작성 중인 내용은 유지했습니다.'); }
  }, [data,repository]);
  let legacyPersonal: ReturnType<typeof readLegacyPersonalPlan> = null, legacyError='';
  try { legacyPersonal=readLegacyPersonalPlan(data); } catch { legacyError='이 기기의 이전 추천 원문을 읽지 못했습니다. 저장된 내용을 덮어쓰지 않았습니다.'; }
  const importLegacy=()=>{if(!legacyPersonal?.raw||!repository)return;try{const next=saveLearningPlan(repository,legacyPersonal.workspace,raw.current);onSaved?.(next);current.current=legacyPersonal.workspace;raw.current=JSON.stringify(legacyPersonal.workspace);setWorkspace(legacyPersonal.workspace);setError('');}catch(e){setError(e instanceof Error?e.message:'이전 내용을 가져오지 못했습니다. 원문은 보존했습니다.');}};
  const nodes = data.nodes.filter(n => !n.deletedAt && n.userId === data.userId && n.namespace === data.namespace && n.role === 'topic' && subjectIds.includes(n.subjectId));
  const goals = workspace.goals.filter(g => nodes.some(n => n.id === g.targetId));
  let result: ReturnType<typeof nextStudy> | null = null;
  let calculationError = '';
  if (!blocked) try { result = nextStudy(data, workspace, now, subjectIds, semesterId); } catch { calculationError = '추천 조건을 확인하지 못했습니다.'; }
  const save = (next:RecommendationWorkspace) => { if (repository) { const updated=saveLearningPlan(repository,next,raw.current); onSaved?.(updated); return JSON.stringify(next); } return saveRecommendations(data,next,raw.current); };
  const write = (change: (w: RecommendationWorkspace) => RecommendationWorkspace, retainInput = false) => {
    if (blocked || !serverReady) { setError('학습 일정을 저장하지 못했습니다. 작성한 내용은 이 기기에 보관됩니다. 다시 접속한 뒤 저장해 주세요.'); return false; }
    const changed = change(current.current);
    if (changed === current.current) return true;
    const next = { ...changed, revision: current.current.revision + 1 };
    if (!retainInput && changed.snapshots === current.current.snapshots) {
      try { const at=new Date().toISOString(), input=recommendationInput(data,next,subjectIds,semesterId), computed=nextStudy(data,next,at,subjectIds,semesterId);
        next.snapshots=[...(next.snapshots??[]),{id:crypto.randomUUID(),createdAt:at,dataVersion:JSON.stringify({model:input.model,events:input.events,recordVersions:data.records.map(r=>[r.id,r.version]),controls:next.controls}),policyVersion:computed.policyVersion,workspaceRevision:next.revision,result:computed}];
      } catch { setError('추천 근거를 계산하지 못했습니다. 작성 내용은 유지했습니다.'); return false; }
    }
    try { raw.current = save(next); current.current = next; setWorkspace(next); setError(''); return true; }
    catch (e) { if (retainInput) { current.current = next; setWorkspace(next); } setError(e instanceof Error && !(e instanceof DOMException) ? e.message : '추천 내용을 저장하지 못했습니다. 작성 중인 내용은 화면에 유지합니다. 다시 저장해 주세요.'); return false; }
  };
  const retry = () => {
    if (!blocked) {
      try {
        const saved = repository ? readLearningPlan(repository.getSnapshot()) : readRecommendations(data), intended = JSON.stringify(current.current);
        if (saved.raw === intended) { raw.current = saved.raw; setError(''); return; }
        if (saved.raw !== raw.current) { setError('다른 곳에서 저장된 내용과 다릅니다. 작성 중인 내용은 화면에 유지하며 덮어쓰지 않았습니다.'); return; }
        raw.current = save(current.current); setError('');
      } catch { setError('추천 내용을 다시 저장하지 못했습니다. 작성 중인 내용은 화면에 유지합니다.'); }
      return;
    }
    try { const saved = repository ? readLearningPlan(repository.getSnapshot()) : readRecommendations(data); current.current = saved.workspace; raw.current = saved.raw; setWorkspace(saved.workspace); setBlocked(false); setError(''); }
    catch { setError('추천 내용을 다시 읽지 못했습니다. 저장된 원문은 그대로 보존했습니다.'); }
  };
  const draft = workspace.draft;
  const termDraft = workspace.termDraft ?? { semesterId: '', start: '', end: '' };
  const termChange = (field: 'start' | 'end', value: string) => write(w => (w.termDraft ?? termDraft)[field] === value ? w : { ...w, termDraft: { ...(w.termDraft ?? termDraft), [field]: value } }, true);
  const semesters = data.semesters.filter(s => !s.deletedAt && s.userId === data.userId && s.namespace === data.namespace);
  const saveTerm = () => {
    const d = current.current.termDraft;
    if (!d || !semesters.some(s => s.id === d.semesterId)) { setError('기간을 남길 학기를 골라 주세요.'); return; }
    try { termPeriod(d); } catch (e) { setError(e instanceof Error ? e.message : '학기 기간을 다시 확인해 주세요.'); return; }
    if (write(w => ({ ...w, terms: { ...w.terms, [d.semesterId]: { start: d.start, end: d.end } } }))) setTermOpen(false);
  };
  const draftChange = (patch: Partial<typeof draft>) => write(w => ({ ...w, draft: { ...w.draft, ...patch } }), true);
  const addGoal = () => {
    const d = current.current.draft;
    if (!d.label.trim() || !nodes.some(n => n.id === d.targetId)) { setError('주제와 확인할 내용을 골라 주세요.'); return; }
    try { dateDeadline(d.dueDate); } catch { setError('기한을 다시 확인하거나 비워 두세요.'); return; }
    const goal: CheckGoal = { ...d, id: crypto.randomUUID(), createdAt: new Date().toISOString(), ended: false };
    if (write(w => ({ ...w, goals: [...w.goals, goal], draft: { ...w.draft, label: '', dueDate: '' } }))) setPlanOpen(false);
  };
  const beginResponse = (id: string) => { if (write(w => ({ ...w, responses: { ...w.responses, [id]: w.responses[id] ?? emptyResponse() } }))) setResponseId(id); };
  const response = responseId ? workspace.responses[responseId] : null;
  const responseChange = (patch: Partial<ResponseDraft>) => { if (responseId) write(w => ({ ...w, responses: { ...w.responses, [responseId]: { ...w.responses[responseId], ...patch } } }), true); };
  const saveResponse = () => {
    if (!responseId) return;
    const w = current.current, goal = w.goals.find(g => g.id === responseId), answer = w.responses[responseId];
    if (!goal || !answer) return;
    const at = new Date().toISOString(), event = makeResultEvent(goal, answer, w, at, crypto.randomUUID());
    if (write(w => { const responses = { ...w.responses }; delete responses[responseId]; return { ...w, events: [...w.events, event], responses, controls: { ...w.controls, [`target:${goal.targetId}`]: {} } }; })) { setNow(at); setResponseId(null); }
  };
  const correct = (goal: CheckGoal) => {
    const state = result?.states[goal.id]; if (!state || state.status !== 'error_open') return;
    const at = new Date().toISOString();
    const event = { ...makeResultEvent(goal, emptyResponse(), current.current, at, crypto.randomUUID()), kind: 'correction' as const, errorEventId: state.evidenceIds[0] };
    if (write(w => ({ ...w, events: [...w.events, event] }))) setNow(at);
  };
  const visible = result?.cards ?? [];
  const fallback = nodes.filter(n => {
    const control = workspace.controls[`target:${n.id}`];
    return !goals.some(g => g.targetId === n.id) && (!control?.snoozeUntil || Date.parse(control.snoozeUntil) <= Date.parse(now));
  }).slice(0, Math.max(0, 3 - visible.length));
  const snooze = (targetId: string) => write(w => ({ ...w, controls: { ...w.controls, [`target:${targetId}`]: { snoozeUntil: new Date(Date.now() + DAY).toISOString() } } }));
  const evidence = (id: string) => <details><summary>근거 보기</summary><p className="muted">공부 체크는 수행 성공으로 세지 않습니다. 아래 결과는 직접 남긴 자기 보고입니다.</p>
    {workspace.events.filter(e => e.facet === id && !e.deleted).map(e => <div key={`${e.id}:${e.revision}`} className="next-study-evidence"><p>{e.kind === 'correction' ? '교정 기록' : ({ pass: '확인됨', fail: '막힘', unknown: '결과 모름', disputed: '판정에 이견 있음' }[e.result!])} · {e.assistance === 'none' ? '도움 없음' : e.assistance === 'notes' ? '도움 사용' : '도움 여부 미확인'}</p><p className="muted">{new Date(e.occurredAt!).toLocaleString('ko-KR')} · {e.novelty === 'new' ? '새 문항' : e.novelty === 'same' ? '같은 문항' : '문항 새로움 미확인'}</p>{e.answer && <p className="next-study-answer">{e.answer}</p>}</div>)}</details>;
  return <section className="next-study" aria-label="다음 공부">
    {!serverReady && <p role="alert">학습 일정을 저장할 수 없습니다. 다시 접속해 주세요. 기존 공부 기록과 통계는 사용할 수 있습니다.</p>}
    {legacyError && <p role="alert">{legacyError}</p>}
    {legacyPersonal?.raw && <details><summary>이 기기에 남아 있는 이전 추천 기록</summary><p>이 원문은 서버에 자동으로 올리지 않습니다. 가져오기를 선택해도 원래 저장 위치의 내용은 보존합니다.</p><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(legacyPersonal.workspace,null,2)}</pre><Button disabled={!serverReady} onClick={importLegacy}>이전 추천 내용을 개인 공간에 가져오기</Button></details>}
    <div className="section-heading"><h2>다음 공부</h2><Button variant="quiet" disabled={blocked || !serverReady} onClick={() => setPlanOpen(true)}>확인할 내용 추가</Button></div>
    <p className="muted">원하는 주제부터 해도 됩니다. 확인할 내용과 기한은 필요할 때만 남겨 주세요.</p>
    {result?.phase === 'in_term' && <p className="muted">남긴 학기 기간 기준 {result.calendarWeek}주차 · 주차만으로 공부 성과를 판단하지 않습니다.</p>}
    {(error || calculationError) && <ErrorState message={error || '추천 조건을 확인하지 못했습니다. 기존 공부 기록은 유지했습니다.'} onRetry={retry} />}
    <div className="next-study-list">
      {!blocked && !calculationError && visible.map(card => {
        const node = nodes.find(n => n.id === card.targetId);
        if (!node) { const schedule=workspace.schedules?.find(s=>card.id.startsWith(`task:${s.id}:`)); return schedule && <Card key={card.groupId}><h3>{schedule.name}</h3><p>{({ prepare:"과제 준비", submit:"과제 제출", watch:"강의 재생", learn:"강의 학습", attendance:"출석 확인" } as Record<string,string>)[card.action] ?? card.action} 상태를 확인해 주세요.</p><p className="muted">{schedule.dueDate || "기한 미정"} · 완료는 일정에서 직접 남겨 주세요.</p><a href="#learning-schedules" onClick={e=>{e.preventDefault();document.getElementById("learning-schedules")?.scrollIntoView({block:"start"});}}>일정에서 확인하기</a></Card>; }
        return node && <Card key={card.groupId}>
          <p className="muted">{data.subjects.find(s => s.id === node.subjectId)?.name}</p>
          <h3>{node.name}</h3>
          {card.requirements.map(id => {
            const goal = goals.find(g => g.id === id), state = result!.states[id];
            return goal && <div key={id} className="next-study-goal"><strong>{goal.label}</strong>
              {result?.adaptations?.find(a=>a.goalId===goal.id) && <p>조건을 갖춘 비교 기록에서는 {result.adaptations.find(a=>a.goalId===goal.id)!.action} 방법을 우선 살펴볼 수 있습니다. 관찰된 비교이며 효과 확정은 아닙니다.</p>}
              <p>{state.status === 'confirmed' && !state.current ? '마지막 확인 뒤 시간이 지났습니다. 자료 없이 다시 확인해 보세요.' : explanations[state.status]}</p><p className="muted">{goal.dueDate ? `${goal.dueDate}까지 확인` : '기한 미정'}{goal.novelty === 'new' ? ' · 새 문항에서 확인' : ' · 같은 문항에서도 확인 가능'}</p>
              <div className="actions"><Button disabled={!serverReady} onClick={() => beginResponse(id)}>확인한 결과 남기기</Button>{state.status === 'error_open' && <Button variant="quiet" disabled={!serverReady} onClick={() => correct(goal)}>다시 정리했어요</Button>}</div>
              {evidence(id)}
            </div>;
          })}
          <div className="actions"><Button onClick={() => navigate(`/node/${node.id}`)}>주제 열고 시작하기</Button><Button variant="quiet" onClick={() => snooze(node.id)}>하루 보류</Button></div>
        </Card>;
      })}
      {!blocked && fallback.map(node => <Card key={node.id}><p className="muted">{data.subjects.find(s => s.id === node.subjectId)?.name}</p><h3>{node.name}</h3>
        <p>{data.records.some(r => !r.deletedAt && r.targetId === node.id) ? '남긴 기록을 보고, 다음에 확인할 내용을 골라 보세요.' : '핵심과 사용 조건부터 살펴보세요. 아직 남긴 기록이 없습니다.'}</p>
        <div className="actions"><Button onClick={() => navigate(`/node/${node.id}`)}>주제 열고 시작하기</Button><Button variant="quiet" onClick={() => snooze(node.id)}>하루 보류</Button></div></Card>)}
    </div>
    {!blocked && !visible.length && !fallback.length && <p className="muted">지금 표시할 후보가 없습니다. 보류한 내용이나 남긴 결과를 확인하거나 다른 주제를 직접 고를 수 있습니다.</p>}
    <div className="actions"><Button variant="quiet" onClick={() => navigate('/subjects')}>다른 주제 직접 고르기</Button><Button variant="quiet" disabled={blocked || !serverReady} onClick={() => setTermOpen(true)}>학기 기간 설정</Button>{Object.values(workspace.controls).some(c => c.snoozeUntil) && <Button variant="quiet" disabled={blocked || !serverReady} onClick={() => write(w => ({ ...w, controls: {} }))}>보류한 내용 다시 보기</Button>}</div>
    {goals.length > 0 && <details><summary>확인한 내용과 지난 기한 보기</summary>{goals.map(goal => <div className="next-study-goal" key={goal.id}><strong>{goal.label}</strong>
              {result?.adaptations?.find(a=>a.goalId===goal.id) && <p>조건을 갖춘 비교 기록에서는 {result.adaptations.find(a=>a.goalId===goal.id)!.action} 방법을 우선 살펴볼 수 있습니다. 관찰된 비교이며 효과 확정은 아닙니다.</p>}<p>{goal.ended ? '추천에서 제외한 내용입니다. 원문과 결과는 남아 있습니다.' : goal.dueDate && Date.parse(dateDeadline(goal.dueDate)!) < Date.parse(now) ? '기한이 지났습니다. 완료 여부는 별도로 확인해 주세요.' : explanations[result?.states[goal.id]?.status ?? 'unobserved']}</p>
      {evidence(goal.id)}<div className="actions"><Button disabled={blocked || !serverReady} onClick={() => beginResponse(goal.id)}>결과 추가</Button><Button variant="quiet" disabled={blocked || !serverReady} onClick={() => write(w => ({ ...w, goals: w.goals.map(g => g.id === goal.id ? { ...g, ended: !g.ended } : g) }))}>{goal.ended ? '다시 후보로' : '추천에서 빼기'}</Button></div></div>)}</details>}
    {result?.warnings.some(w=>w.code==='MATERIAL_REQUIRED'||w.code==='PREREQUISITE_CRITERION_REQUIRED') && <p className="muted">추천에 필요한 선행 주제의 확인 기준이나 공부 자료가 부족합니다. 아래 관계·자료 설정에서 확인해 주세요.</p>}
    <LearningScheduleEditor disabled={blocked || !serverReady} data={data} workspace={workspace} subjectIds={subjectIds} onChange={w=>write(()=>w)} />
    <Modal open={planOpen} title="다음에 확인할 내용" onClose={() => setPlanOpen(false)}>
      <p>평소 공부 기록에는 필요하지 않습니다. 실제로 확인하고 싶은 내용만 남겨 주세요.</p>
      <Select label="확인할 주제" value={draft.targetId} onChange={e => draftChange({ targetId: e.target.value })}><option value="">주제 선택</option>{nodes.map(n => <option key={n.id} value={n.id}>{data.subjects.find(s => s.id === n.subjectId)?.name} · {n.name}</option>)}</Select>
      <Textarea label="자료 없이 확인할 내용" value={draft.label} onChange={e => draftChange({ label: e.target.value })} placeholder="예: 어떤 조건에서 이 방법을 쓰는지 설명하기" />
      <Select label="확인할 문항" value={draft.novelty} onChange={e => draftChange({ novelty: e.target.value as 'same' | 'new' })}><option value="same">같은 문항에서도 확인</option><option value="new">새 문항에서 확인</option></Select>
      <Input label="지연 확인 간격 · 일 · 선택" type="number" min="0" value={draft.minDelayDays ?? ''} onChange={e=>draftChange({minDelayDays:e.target.value===''?undefined:Number(e.target.value)})} hint="시간을 두고 확인할 때만 남겨 주세요."/>
      <Input label="확인 기한 · 선택" type="date" value={draft.dueDate} onChange={e => draftChange({ dueDate: e.target.value })} hint="비워 두면 기한 미정으로 남습니다. 한국 날짜의 마지막 시각을 기준으로 합니다." />
      {error && <p role="alert">{error}</p>}<Button variant="primary" onClick={addGoal}>확인할 내용 저장</Button>
    </Modal>
    <Modal open={termOpen} title="학기 기간" onClose={() => setTermOpen(false)}>
      <p>기간은 선택 사항입니다. 해당 학기를 보고 있을 때만 추천의 시간 기준으로 사용합니다. 모르면 둘 다 비워 두세요.</p>
      <Select label="기간을 남길 학기" value={termDraft.semesterId} onChange={e => { const id = e.target.value, dates = workspace.terms?.[id] ?? { start: '', end: '' }; write(w => ({ ...w, termDraft: { semesterId: id, ...dates } }), true); }}><option value="">학기 선택</option>{semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>
      <Input label="학기 시작일 · 선택" type="date" value={termDraft.start} onInput={e => termChange('start', e.currentTarget.value)} onChange={e => termChange('start', e.target.value)} />
      <Input label="학기 종료일 · 선택" type="date" value={termDraft.end} onInput={e => termChange('end', e.currentTarget.value)} onChange={e => termChange('end', e.target.value)} />
      {error && <p role="alert">{error}</p>}<Button variant="primary" onClick={saveTerm}>학기 기간 저장</Button>
    </Modal>
    <Modal open={Boolean(responseId)} title="지금 확인한 결과" onClose={() => setResponseId(null)}>
      {response && <><p>{goals.find(g => g.id === responseId)?.label}</p><p className="muted">직접 확인한 범위만 남겨 주세요. 모르는 값은 그대로 둘 수 있습니다.</p>
        <Select label="확인 결과" value={response.result} onChange={e => responseChange({ result: e.target.value as ResponseDraft['result'] })}><option value="unknown">결과 모름</option><option value="pass">기준을 충족했어요</option><option value="fail">막혔어요</option><option value="disputed">판정에 이견이 있어요</option></Select>
        <Select label="도움 사용" value={response.assistance} onChange={e => responseChange({ assistance: e.target.value as ResponseDraft['assistance'] })}><option value="unknown">도움 여부 미확인</option><option value="none">도움 없이 확인</option><option value="notes">자료나 도움 사용</option></Select>
        <Select label="실제로 확인한 문항" value={response.novelty} onChange={e => responseChange({ novelty: e.target.value as ResponseDraft['novelty'] })}><option value="unknown">문항 새로움 미확인</option><option value="same">같은 문항</option><option value="new">새 문항</option></Select>
        <Input label="실제로 지난 간격 · 일 · 선택" type="number" min="0" value={response.delayDays ?? ''} onChange={e=>responseChange({delayDays:e.target.value===''?undefined:Number(e.target.value),delayVerified:false})}/>
        <Select label="간격 확인" value={response.delayVerified ? 'verified' : 'unknown'} onChange={e=>responseChange({delayVerified:e.target.value==='verified'})}><option value="unknown">간격 미확인</option><option value="verified">실제 수행 간격을 확인했어요</option></Select>
        <Textarea label="남길 답변과 메모 · 선택" value={response.answer} onChange={e => responseChange({ answer: e.target.value })} />
        {error && <p role="alert">{error}</p>}<Button variant="primary" onClick={saveResponse}>수행 결과 저장</Button>
      </>}
    </Modal>
  </section>;
}
