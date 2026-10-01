import { sourceResultDraftKey, readSourceResultDraft, writeSourceResultDraft, clearSourceResultDraft } from '../data/source-performance-draft';
import { archiveDamagedDraft, clearStoredDraft } from '../data/draft-safety';
import { useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import type { StudyRepository } from '../data/repository';
import { readLearningPlan } from '../data/learning-plan';
import { saveSourcePerformance } from '../data/learning-evidence';
import { performanceSource, sourceEventId, type PerformanceSource } from '../domain/learning-evidence';
import { emptyResponse, type ResponseDraft } from '../domain/recommendation-workspace';
import { Button, ErrorState, Modal, Select } from './index';
import { MEMO_WIDTH, MEMO_HEIGHT, memoPath } from '../domain/memo';
export function SourceInk({ strokes }: { strokes: import('../domain/model').MemoStroke[] }) { return strokes.length ? <svg className="memory-ink" viewBox={`0 0 ${MEMO_WIDTH} ${MEMO_HEIGHT}`} role="img" aria-label="원문 답안 필기">{strokes.map(s => <path key={s.id} d={memoPath(s.points)} stroke={{ink:'var(--color-text)',blue:'var(--color-hierarchy-outline)',green:'var(--color-memo-green)'}[s.ink]} strokeWidth={s.width} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}</svg> : null; }

type Props = { data: AppState; repository: StudyRepository; onSaved: (data: AppState) => void; kind: PerformanceSource['kind']; id: string; itemId?: string };
export function PerformanceFromSource({ data, repository, onSaved, kind, id, itemId }: Props) {
  const [open, setOpen] = useState(false), [source, setSource] = useState<PerformanceSource | null>(null);
  const [plan, setPlan] = useState<ReturnType<typeof readLearningPlan> | null>(null), [goalId, setGoalId] = useState('');
  const [response, setResponse] = useState<ResponseDraft>(emptyResponse), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const draft = useRef<{key:string;raw:string|null} | null>(null), [draftBlocked,setDraftBlocked] = useState(false);
  const retain = (nextGoal:string,nextResponse:ResponseDraft) => {if (!draft.current || draftBlocked) return;try {draft.current.raw=writeSourceResultDraft(draft.current.key,{version:1,goalId:nextGoal,response:{...nextResponse,answer:''}},draft.current.raw);} catch(e) {setError(e instanceof Error ? e.message : '현재 선택을 저장하지 못했습니다. 화면은 유지했습니다.');}};
  const change = (next: ResponseDraft) => {setResponse(next);retain(goalId,next);};
  const capable = data.namespace === 'demo' || repository.getCapabilities?.().includes('saveLearningPlan');
  const choose = (value: string, nextPlan = plan, nextSource = source) => {
    setGoalId(value);
    const prior = nextSource && nextPlan?.workspace.events.filter(e => e.id === sourceEventId(nextSource,value)).sort((a,b) => b.revision-a.revision)[0];
    const nextResponse=prior ? { ...emptyResponse(), result: prior.result!, assistance: prior.assistance!, novelty: prior.novelty! } : emptyResponse();
    setResponse(nextResponse);retain(value,nextResponse);
  };
  const begin = () => {
    try {
      const current = repository.getSnapshot(), nextSource = performanceSource(current,kind,id,itemId), nextPlan = readLearningPlan(current);
      draft.current=null;setDraftBlocked(false);setSource(nextSource); setPlan(nextPlan); choose(nextPlan.workspace.goals.find(g => !g.ended && g.targetId === nextSource.topicId)?.id ?? '',nextPlan,nextSource);
      setError(''); setNotice(''); setOpen(true);
      const key=sourceResultDraftKey(current,nextSource);
      draft.current={key,raw:null};
      try {const saved=readSourceResultDraft(key);draft.current.raw=saved.raw;if(saved.draft){setGoalId(saved.draft.goalId);setResponse(saved.draft.response);}} catch(e) {setDraftBlocked(true);setError(e instanceof Error ? e.message : '초안을 읽지 못했습니다.');}
    } catch (e) { setError(e instanceof Error ? e.message : '원문을 다시 확인해 주세요.'); }
  };
  const save = () => {
    if (!source || !plan) return;
    try { onSaved(saveSourcePerformance(repository,source,goalId,response,plan.raw)); if(draft.current)clearSourceResultDraft(draft.current.key,draft.current.raw);setOpen(false); setNotice('수행 결과를 남겼습니다. 다음 공부와 통계에 반영됩니다.'); }
    catch (e) { setError(e instanceof Error ? e.message : '저장하지 못했습니다. 현재 선택은 유지했습니다.'); }
  };
  return <>
    <Button variant="quiet" disabled={!capable} onClick={begin}>이 답안으로 수행 결과 남기기</Button>
    {notice && <p role="status">{notice}</p>}{error && !open && <ErrorState message={error} />}
    <Modal open={open} title="답안에서 수행 결과 남기기" onClose={() => setOpen(false)}>
      {source && plan && <>
        <p>이미 남긴 답안과 연결합니다. 도움 여부와 새 문제인지는 직접 확인해 주세요.</p>
        <details><summary>연결할 원문 답안 보기</summary>{source.question && <p>{source.question}</p>}<pre className="next-study-answer">{source.body || '글 답안 없음'}</pre>
          {!!source.strokes.length && <SourceInk strokes={source.strokes} />}
          {source.reference && <p>당시 기준 답안 · {source.reference}</p>}
          <p className="muted">{source.performedAt ? '시험 종료 시각을 사용합니다.' : '최초로 결과를 남긴 시각을 유지합니다. 원문의 실제 수행 시각은 추정하지 않습니다.'}</p>
        </details>
        <Select label="확인할 내용" value={goalId} onChange={e => choose(e.target.value)}>
          <option value="">선택해 주세요</option>{plan.workspace.goals.filter(g => !g.ended && g.targetId === source.topicId).map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
        </Select>
        {!plan.workspace.goals.some(g => !g.ended && g.targetId === source.topicId) && <p>홈의 ‘확인할 내용 추가’에서 이 주제의 기준을 먼저 남겨 주세요. 답안은 그대로 보존됩니다. <a href="#/">홈으로 가기</a></p>}
        <Select label="수행 결과" value={response.result} onChange={e => change({...response,result:e.target.value as ResponseDraft['result']})}>
          <option value="unknown">미확인</option><option value="pass">기준을 충족함</option><option value="fail">기준을 충족하지 못함</option><option value="disputed">판정에 이견 있음</option>
        </Select>
        <Select label="도움 여부" value={response.assistance} onChange={e => change({...response,assistance:e.target.value as ResponseDraft['assistance']})}><option value="unknown">미확인</option><option value="none">도움 없이 수행함</option><option value="notes">자료나 도움을 사용함</option></Select>
        <Select label="문항의 새로움" value={response.novelty} onChange={e => change({...response,novelty:e.target.value as ResponseDraft['novelty']})}><option value="unknown">미확인</option><option value="same">같은 문항</option><option value="new">새 문항</option></Select>
        <p className="muted">결과를 수정하면 같은 답안의 수정 이력으로 남습니다. 수행 횟수를 중복해서 세지 않습니다.</p>
        {error && <ErrorState message={error} />}{draftBlocked && <Button onClick={() => {try{if(draft.current){archiveDamagedDraft(draft.current.key, "수행 결과 초안 원문");clearStoredDraft(draft.current.key);draft.current.raw=null;}setDraftBlocked(false);setResponse(emptyResponse());setError("");}catch(e){setError(e instanceof Error ? e.message : "원문을 보관하지 못했습니다.");}}}>초안 원문을 보관하고 다시 선택</Button>}<Button variant="primary" disabled={!goalId || !capable || draftBlocked} onClick={save}>결과 남기기</Button>
      </>}
    </Modal>
  </>;
}
