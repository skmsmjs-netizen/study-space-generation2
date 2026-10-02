import { useState } from 'react';
import type { AppState } from '../domain/model';
import type { StudyRepository } from '../data/repository';
import type { StudyMaterial } from '../domain/study-material';
import { activeTopic } from '../domain/learning-evidence';
import { readLearningPlan } from '../data/learning-plan';
import { registerMaterialCard, saveCodeTopic } from '../data/learning-evidence';
import { Button, Checkbox, ErrorState, Select } from './index';

type Common = { data: AppState; repository: StudyRepository; onSaved: (data: AppState) => void };
export function UseMaterialCard({ data, repository, onSaved, material, resultId, cardId, unsaved }: Common & { material?: StudyMaterial; resultId: string; cardId: string; unsaved: boolean }) {
  const [reviewed, setReviewed] = useState(false), [topicId, setTopicId] = useState(material?.topicId ?? ''), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const topics = data.nodes.filter(n => activeTopic(data,n.id) && n.subjectId === material?.subjectId);
  const capable = data.namespace === 'demo' || repository.getCapabilities?.().includes('saveMemoryCard');
  const register = () => {
    if (!material || unsaved) return;
    try {
      const result = registerMaterialCard(repository,material,resultId,cardId,topicId,reviewed); onSaved(result.data);
      setNotice(result.deleted ? '이 카드에서 등록한 항목이 휴지통에 있습니다. 암기시험의 휴지통에서 복원할 수 있습니다.' : result.existing ? '이미 등록한 암기 항목을 유지했습니다. 이후 수정한 질문과 답도 그대로입니다.' : '암기 항목으로 등록했습니다. 이 주제에서 시험을 만들 수 있습니다.'); setError('');
    } catch(e) { setError(e instanceof Error ? e.message : '카드를 등록하지 못했습니다. 원자료는 유지했습니다.'); }
  };
  return <div>
    <Select label="암기 항목을 넣을 주제" value={topicId} onChange={e => {setTopicId(e.target.value);setNotice('');}}><option value="">주제 선택</option>{topics.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}</Select>
    <Checkbox label="질문과 답을 원자료와 대조했어요" checked={reviewed} onChange={e => setReviewed(e.target.checked)} />
    {unsaved && <p className="muted">자료와 카드 수정을 먼저 저장해 주세요. 저장한 원문과 연결합니다.</p>}
    <Button disabled={!material || unsaved || !reviewed || !topicId || !capable} onClick={register}>암기 항목으로 등록</Button>
    {notice && <p role="status">{notice} {!notice.includes('휴지통') && <a href={`#/memory-test/${encodeURIComponent(topicId)}`}>암기시험 열기</a>}</p>}{error && <ErrorState message={error} />}
  </div>;
}
export function CodeTopicLinkEditor({ data, repository, onSaved, exampleId }: Common & { exampleId: string }) {
  const [editing, setEditing] = useState(false), [topicId, setTopicId] = useState(''), [raw, setRaw] = useState<string | null>(null), [error, setError] = useState('');
  let linked = ''; try { linked = readLearningPlan(data).workspace.codeLinks?.find(l => l.exampleId === exampleId)?.topicId ?? ''; } catch { /* Opening the editor shows the read failure without overwriting. */ }
  const topic = data.nodes.find(n => n.id === linked), capable = data.namespace === 'demo' || repository.getCapabilities?.().includes('saveLearningPlan');
  const begin = () => { try { const plan = readLearningPlan(repository.getSnapshot()); setRaw(plan.raw);setTopicId(plan.workspace.codeLinks?.find(l => l.exampleId === exampleId)?.topicId ?? '');setEditing(true);setError(''); } catch(e) {setError(e instanceof Error ? e.message : '주제 연결을 읽지 못했습니다.');} };
  const save = () => { try {onSaved(saveCodeTopic(repository,exampleId,topicId,raw));setEditing(false);setError('');} catch(e) {setError(e instanceof Error ? e.message : '연결을 저장하지 못했습니다.');} };
  return <section aria-label="코드 예제의 공부 주제">
    <p>{topic ? <>공부 주제 · <a href={`#/node/${encodeURIComponent(topic.id)}`}>{topic.name}</a></> : '공부 주제는 필요할 때 연결해 주세요.'}</p>
    {editing ? <><Select label="코드 예제의 주제" value={topicId} onChange={e => setTopicId(e.target.value)}><option value="">연결 없이 보관</option>{data.nodes.filter(n => activeTopic(data,n.id)).map(n => <option key={n.id} value={n.id}>{data.subjects.find(s => s.id === n.subjectId)?.name} / {n.name}</option>)}</Select><Button disabled={!capable} onClick={save}>주제 연결 저장</Button><Button variant="quiet" onClick={() => setEditing(false)}>취소</Button></> : <Button variant="quiet" disabled={!capable} onClick={begin}>공부 주제 연결</Button>}
    {error && <ErrorState message={error} />}
  </section>;
}
export function RelatedCodeExamples({ data, topicId }: { data: AppState; topicId: string }) {
  let links: NonNullable<ReturnType<typeof readLearningPlan>["workspace"]["codeLinks"]>; try { links = readLearningPlan(data).workspace.codeLinks ?? []; } catch {return <ErrorState message="연결된 코드 예제를 읽지 못했습니다. 기존 예제는 코딩 연습에서 열 수 있습니다." />;}
  const examples = (data.codeExamples ?? []).filter(e => !e.deletedAt && links.some(l => l.topicId === topicId && l.exampleId === e.id));
  return !!examples.length && <section aria-label="이 주제의 코드 예제"><h3>코드 예제</h3><ul>{examples.map(e => <li key={e.id}><a href={`#/code/${encodeURIComponent(e.id)}`}>{e.title || '제목 없는 예제'}</a> · {e.language}</li>)}</ul></section>;
}
