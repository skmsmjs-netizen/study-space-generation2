import { useEffect, useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import { freshRecall, nextRecall, recallPath, recallTopics, type RecallSession } from '../domain/topic-recall';
import { readRecall, saveRecallMemo, writeRecall, type RecallRepository } from '../data/topic-recall';
import { Button, Card, EmptyState, ErrorState, Select, Textarea } from './index';
import './topic-recall.css';

type Props = { data: AppState; repository: RecallRepository; onSaved: (data: AppState) => void; subjectIds: string[] };
const message = (error: unknown) => error instanceof Error ? error.message : '저장하지 못했습니다. 입력한 글은 이 화면에 남아 있습니다.';
export function TopicRecall({ data, repository, onSaved, subjectIds }: Props) {
  const [loaded, setLoaded] = useState(() => {
    try { return { session: readRecall(data), error: '' }; }
    catch (error) { return { session: freshRecall(), error: message(error) }; }
  });
  const [session, setSession] = useState<RecallSession>(loaded.session);
  const [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [composing, setComposing] = useState(false);
  const composition = useRef(false), bodyRef = useRef<HTMLTextAreaElement>(null);
  const topics = recallTopics(data, subjectIds, session);
  const topic = topics.find(row => row.id === session.currentId);
  const subjects = data.subjects.filter(row => !row.deletedAt && subjectIds.includes(row.id));
  const units = data.nodes.filter(row => !row.deletedAt && row.role === 'unit' && subjects.some(subject => subject.id === row.subjectId)
    && (session.subjectId === 'all' || row.subjectId === session.subjectId));
  const draft = topic ? session.drafts[topic.id] : undefined;
  const persist = (next: RecallSession) => {
    try { writeRecall(data, next); setSession(next); setError(''); return true; }
    catch (error) { setError(`${message(error)} 전환을 멈췄습니다. 입력한 글은 이 화면에 남아 있습니다.`); return false; }
  };
  const candidatesKey = topics.map(row => row.id).join('|');
  useEffect(() => {
    if (loaded.error || topic || !topics.length) return;
    persist(nextRecall({ ...session, currentId: null }, topics));
  }, [candidatesKey, session.currentId, loaded.error]); // Normalize only missing/removed cards, never typing.
  const changeRange = (subjectId: string, unitId: string) => {
    if (composition.current) return;
    const next = { ...session, subjectId, unitId, currentId: null, seen: [], round: 1 };
    if (persist(nextRecall(next, recallTopics(data, subjectIds, next)))) setNotice('선택한 범위에서 새로 시작합니다.');
  };
  const advance = (save: boolean, separate = false) => {
    if (!topic || composition.current) return;
    try {
      let next = session;
      if (save && draft) {
        const savedDraft = separate ? { ...draft, memoId: crypto.randomUUID() } : draft;
        if (separate) { next = { ...session, drafts: { ...session.drafts, [topic.id]: savedDraft } }; if (!persist(next)) return; }
        const saved = saveRecallMemo(repository, topic.id, savedDraft); onSaved(saved);
        const drafts = { ...next.drafts }; delete drafts[topic.id]; next = { ...next, drafts };
      }
      if (persist(nextRecall(next, topics))) {
        setNotice(save ? '설명을 주제에 연결된 메모로 저장했습니다.' : draft?.body ? '작성하던 글은 초안으로 남겼습니다.' : '다음 주제를 보여드립니다.');
        bodyRef.current?.focus();
      }
    } catch (error) { setError(message(error)); }
  };
  if (loaded.error) return <ErrorState title="주제 카드 초안을 열지 못했습니다" message={loaded.error} onRetry={() => {
    try { const recovered = readRecall(data); setSession(recovered); setLoaded({ session: recovered, error: '' }); }
    catch (error) { setLoaded(value => ({ ...value, error: message(error) })); }
  }} />;
  const prior = topic ? (data.memos ?? []).filter(memo => !memo.deletedAt && memo.ownerId === topic.id && memo.id !== draft?.memoId)
    .slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : [];
  return <section className="topic-recall" aria-label="주제 카드로 설명하기">
    <p className="muted">주제를 보고, 기억나는 만큼 자신의 말로 설명해 보세요.</p>
    <div className="recall-filters">
      <Select label="카드 과목" value={session.subjectId} disabled={composing} onChange={event => changeRange(event.target.value, 'all')}>
        <option value="all">선택 범위의 모든 과목</option>{subjects.map(subject => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
        {!subjects.some(row => row.id === session.subjectId) && session.subjectId !== 'all' && <option value={session.subjectId}>범위 밖 과목 · 다른 과목을 골라 주세요</option>}
      </Select>
      <Select label="카드 단원" value={session.unitId} disabled={composing} onChange={event => changeRange(session.subjectId, event.target.value)}>
        <option value="all">모든 단원</option>{units.map(unit => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
        {!units.some(row => row.id === session.unitId) && session.unitId !== 'all' && <option value={session.unitId}>범위 밖 단원 · 다른 단원을 골라 주세요</option>}
      </Select>
    </div>
    {topic ? <>
      <Card className="recall-topic" aria-label="현재 주제 카드">
        <p className="eyebrow">{subjects.find(row => row.id === topic.subjectId)?.name}</p>
        <p className="muted recall-path">{recallPath(data.nodes, topic.id).slice(0, -1).map(row => row.name).join(' / ')}</p>
        <h2>{topic.name}</h2>
        <p>무엇을 뜻하나요? 어떤 조건에서 성립하는지 설명해 보세요.</p>
        <p className="muted recall-progress">{session.round}번째 바퀴 · {session.seen.filter(id => topics.some(row => row.id === id)).length + 1} / {topics.length} 주제</p>
      </Card>
      <div className="recall-editor">
        <Textarea ref={bodyRef} label="나의 설명" rows={7} value={draft?.body ?? ''} placeholder="기억나는 만큼 적어 주세요. 막히는 부분이나 의문을 함께 남겨도 됩니다."
          onCompositionStart={() => { composition.current = true; setComposing(true); }} onCompositionEnd={() => { composition.current = false; setComposing(false); }}
          onChange={event => {
            const next = { ...session, drafts: { ...session.drafts, [topic.id]: { memoId: draft?.memoId ?? crypto.randomUUID(), body: event.target.value } } };
            setSession(next); persist(next); setNotice('');
          }} />
        <p className="muted">입력한 글은 초안으로 보관됩니다. 저장하면 이 주제에 연결된 새 메모가 됩니다.</p>
        <div className="actions recall-actions">
          <Button variant="primary" disabled={composing || !draft?.body.trim()} onClick={() => advance(true)}>메모 저장 후 다음 주제</Button>
          <Button disabled={composing} onClick={() => advance(false)}>건너뛰기</Button>
        </div>
      </div>
      {prior.length > 0 && <details className="recall-history" key={topic.id}>
        <summary>이 주제의 이전 메모 {prior.length}개</summary>
        {prior.map(memo => <article key={memo.id}><a href={`#/memos/${memo.id}`}>메모 열기 · {new Date(memo.createdAt).toLocaleString('ko-KR')}</a><p>{memo.body || '그림 메모'}</p></article>)}
      </details>}
    </> : <EmptyState title="이 범위에 등록된 주제가 없습니다" message="다른 과목·단원을 고르거나 과목에서 공부 주제를 추가해 주세요."><a href="#/subjects">과목 보기</a></EmptyState>}
    {error && <div role="alert"><p>{error}</p><div className="actions"><Button onClick={() => persist(session)}>초안 저장 다시 시도</Button>{topic && draft?.body.trim() && <Button onClick={() => advance(true, true)}>별도 메모로 저장 후 다음</Button>}</div></div>}
    {notice && <p role="status">{notice}</p>}
    <p className="muted recall-note">한 바퀴 동안 주제를 중복 없이 무작위로 보여드립니다. 메모 저장과 건너뛰기는 공부 완료나 정답 판정으로 집계하지 않습니다.</p>
  </section>;
}
