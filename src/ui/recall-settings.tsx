import { useState } from 'react';
import type { AppState, RecallOptions } from '../domain/model';
import { recallOptions, validateRecallOptions } from '../domain/recall-scheduler';
import type { RecallRepository } from '../data/topic-recall';
import { RecallOptimization } from './recall-optimization';
import { Button, Input } from './index';

export function RecallSettings({ data, repository, onSaved, disabled }: { data: AppState; repository: RecallRepository; onSaved: (data: AppState) => void; disabled: boolean }) {
  const [options, setOptions] = useState<RecallOptions>(() => recallOptions(data));
  const [learning, setLearning] = useState(() => options.learningMinutes.join(', '));
  const [relearning, setRelearning] = useState(() => options.relearningMinutes.join(', '));
  const [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [base] = useState(() => data.recallPreferences?.find(row => !row.deletedAt));
  const [id] = useState(() => base?.id ?? crypto.randomUUID());
  const [version, setVersion] = useState(base?.version ?? 0);
  const save = () => {
    try {
      const parse = (text: string) => !text.trim() ? [] : text.split(',').map(v => v.trim() === '' ? NaN : Number(v.trim()));
      const next = { ...options, learningMinutes: parse(learning), relearningMinutes: parse(relearning) }; validateRecallOptions(next);
      const snapshot = repository.getSnapshot();
      const saved = repository.execute({ type: 'saveRecallPreferences', id, expectedVersion: version, options: next,
        opId: crypto.randomUUID(), at: new Date().toISOString(), userId: snapshot.userId, namespace: snapshot.namespace });
      setVersion(saved.recallPreferences!.find(row => row.id === id)!.version); onSaved(saved); setError(''); setNotice('설정을 저장했습니다. 다음 자기 평가부터 적용됩니다.');
    } catch (e) { setError(e instanceof Error ? e.message : '설정을 저장하지 못했습니다.'); }
  };
  const dirty = JSON.stringify(options) !== JSON.stringify(recallOptions(data)) || learning !== options.learningMinutes.join(', ') || relearning !== options.relearningMinutes.join(', ');
  return <details className="recall-settings"><summary>복습 설정</summary>
    <div className="recall-settings-fields">
      <Input label="하루 새 카드 수" type="number" min={0} max={9999} value={options.newPerDay} onChange={e => setOptions({ ...options, newPerDay: Number(e.target.value) })} />
      <Input label="목표 기억률 (%)" type="number" min={70} max={97} value={Math.round(options.retention * 100)} onChange={e => setOptions({ ...options, retention: Number(e.target.value) / 100 })} />
      <Input label="학습 단계 (분)" value={learning} placeholder="1, 10" onChange={e => setLearning(e.target.value)} />
      <Input label="재학습 단계 (분)" value={relearning} placeholder="10" onChange={e => setRelearning(e.target.value)} />
      <Input label="최대 복습 간격 (일)" type="number" min={1} max={36500} value={options.maximumDays} onChange={e => setOptions({ ...options, maximumDays: Number(e.target.value) })} />
    </div>
    <p className="muted">분 단위 단계는 작은 값부터 쉼표로 구분합니다. 빈칸이면 FSRS가 간격을 정합니다. 목표 기억률을 높이면 더 자주 복습하게 됩니다. 이미 정해진 날짜는 설정 저장만으로 바뀌지 않습니다.</p>
    <Button disabled={disabled} onClick={save}>복습 설정 저장</Button>
    {dirty && <p className="muted">최적화 전에 수정한 복습 설정을 먼저 저장해 주세요.</p>}
    <RecallOptimization data={data} repository={repository} preferenceId={id} disabled={disabled || dirty} onApplied={saved => {
      setOptions(recallOptions(saved)); setVersion(saved.recallPreferences!.find(row => !row.deletedAt)!.version); onSaved(saved);
    }} />
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
  </details>;
}
