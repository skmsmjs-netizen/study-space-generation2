import { useRef, useState } from 'react';
import type { AppState, OutlineNode } from '../domain/model';
import type { RecallSession } from '../domain/topic-recall';
import type { RecallRepository } from '../data/topic-recall';
import { Button, Select, Textarea } from './index';

type Props = { data: AppState; topics: OutlineNode[]; repository: RecallRepository; session: RecallSession;
  persist: (session: RecallSession) => boolean; onSaved: (data: AppState) => void; disabled: boolean };
export function RecallCardEditor({ data, topics, repository, session, persist, onSaved, disabled }: Props) {
  const [error, setError] = useState(''), [notice, setNotice] = useState('');
  const composing = useRef(false), [composition, setComposition] = useState(false);
  const draft = session.registration;
  const change = (values: Partial<NonNullable<RecallSession['registration']>>) => {
    persist({ ...session, registration: { id: crypto.randomUUID(), topicId: topics[0]?.id ?? '', front: '', reference: '', ...draft, ...values } });
  };
  const save = () => {
    if (!draft || disabled || composing.current) return;
    try {
      const snapshot = repository.getSnapshot(), old = snapshot.recallCards?.find(card => card.id === draft.id);
      const saved = old && !old.deletedAt && old.front === draft.front && old.reference === draft.reference && old.topicId === draft.topicId ? snapshot : repository.execute({
        type: 'saveRecallCard', id: draft.id, topicId: draft.topicId, front: draft.front, reference: draft.reference, expectedVersion: draft.expectedVersion ?? 0,
        opId: crypto.randomUUID(), at: new Date().toISOString(), userId: snapshot.userId, namespace: snapshot.namespace });
      onSaved(saved);
      if (persist({ ...session, registration: { id: crypto.randomUUID(), topicId: draft.topicId, front: '', reference: '' } })) { setError(''); setNotice('질문 카드를 저장했습니다. 카드마다 복습 날짜와 답변을 따로 기록합니다.'); }
    } catch (e) { setError(e instanceof Error ? e.message : '카드를 저장하지 못했습니다. 초안은 남아 있습니다.'); }
  };
  const cards = (data.recallCards ?? []).filter(card => !card.deletedAt && card.front !== undefined && topics.some(topic => topic.id === card.topicId));
  const inputProps = { disabled, onCompositionStart: () => { composing.current = true; setComposition(true); }, onCompositionEnd: () => { composing.current = false; setComposition(false); } };
  return <details className="recall-card-settings"><summary>질문 카드 만들기·수정</summary>
    <p className="muted">공부 주제를 고르고 질문과 참고 답변을 입력합니다. 한 주제에 여러 질문을 만들 수 있습니다.</p>
    <Select label="카드의 공부 주제" disabled={disabled || composition} value={draft?.topicId ?? topics[0]?.id ?? ''} onChange={e => change({ topicId: e.target.value })}>
      {!topics.length && <option value="">먼저 공부 주제를 등록해 주세요</option>}
      {topics.map(topic => <option key={topic.id} value={topic.id}>{data.subjects.find(s => s.id === topic.subjectId)?.name} / {topic.name}</option>)}
      {draft?.topicId && !topics.some(topic => topic.id === draft.topicId) && <option value={draft.topicId}>현재 범위 밖 주제</option>}
    </Select>
    <Textarea label="질문 (앞면)" rows={3} value={draft?.front ?? ''} onChange={e => change({ front: e.target.value })} {...inputProps} />
    <Textarea label="참고 답변 (뒷면)" rows={4} value={draft?.reference ?? ''} onChange={e => change({ reference: e.target.value })} {...inputProps} />
    <div className="actions"><Button disabled={disabled || composition || !draft?.front.trim() || !draft.topicId} onClick={save}>{draft?.expectedVersion ? '질문 카드 수정 저장' : '질문 카드 등록'}</Button>
      {draft && <Button disabled={disabled || composition} onClick={() => { if (persist({ ...session, registration: undefined })) setNotice('카드 입력 초안을 비웠습니다. 저장된 카드는 그대로 있습니다.'); }}>입력 초안 비우기</Button>}</div>
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
    {cards.length > 0 && <details><summary>등록한 질문 {cards.length}개</summary>{cards.map(card => <article key={card.id}><p>{card.front}</p>
      <Button disabled={disabled || composition} onClick={() => { persist({ ...session, registration: { id: card.id, topicId: card.topicId, front: card.front!, reference: card.reference, expectedVersion: card.version } }); setNotice('질문을 수정하고 저장해 주세요. 복습 이력은 보존합니다.'); }}>이 질문 수정</Button>
      <span className="muted"> · 자기 평가 {card.reviews.length}회</span></article>)}</details>}
  </details>;
}
