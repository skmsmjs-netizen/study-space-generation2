import { useEffect, useMemo, useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import { recallOptions, recallPreference, validateRecallOptions } from '../domain/recall-scheduler';
import { recallTraining } from '../domain/recall-training';
import type { RecallRepository } from '../data/topic-recall';
import { Button } from './index';

type Result = { parameters: number[]; fingerprint: string; count: number; baseVersion: number; relearningSteps: number };
export function RecallOptimization({ data, repository, onApplied, preferenceId, disabled, deckId }: {
  data: AppState; repository: RecallRepository; onApplied: (data: AppState) => void; preferenceId: string; disabled: boolean; deckId?: string;
}) {
  const training = useMemo(() => recallTraining(data, deckId), [data.nodes, data.subjects, data.recallCards, deckId]);
  const [running, setRunning] = useState(false), [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState(''), [notice, setNotice] = useState('');
  const job = useRef<{ channel: BroadcastChannel; timer: ReturnType<typeof setTimeout> } | null>(null);
  const stop = () => { job.current?.channel.postMessage({ type: 'cancel' }); job.current?.channel.close(); clearTimeout(job.current?.timer); job.current = null; };
  useEffect(() => () => stop(), []);
  const start = () => {
    if (disabled || running) return;
    if (!training.lengths.length) { setNotice('날짜를 달리한 복습 이력이 아직 없습니다. 기본 설정으로 복습을 이어가면 최적화할 수 있습니다.'); return; }
    try {
      const token = crypto.randomUUID(), channel = new BroadcastChannel(`recall-optimizer:${token}`);
      const snapshot = repository.getSnapshot(), history = recallTraining(snapshot, deckId), options = recallOptions(snapshot, deckId);
      const baseline = recallPreference(snapshot, deckId)?.version ?? 0;
      setResult(null); setError(''); setNotice(''); setRunning(true);
      const finish = () => { channel.close(); clearTimeout(job.current?.timer); job.current = null; setRunning(false); };
      channel.onmessage = ({ data: message }) => {
        if (message.type === 'ready') channel.postMessage({ type: 'input', payload: { ratings: history.ratings, deltaTs: history.deltaTs, lengths: history.lengths, relearningSteps: options.relearningMinutes.length } });
        else if (message.type === 'result') {
          try { validateRecallOptions({ ...options, parameters: message.parameters }); setResult({ parameters: message.parameters, fingerprint: history.fingerprint, count: history.lengths.length, baseVersion: baseline, relearningSteps: options.relearningMinutes.length }); setNotice('계산이 끝났습니다. 결과를 적용하면 다음 자기 평가부터 사용합니다.'); }
          catch { setError('계산 결과를 확인하지 못했습니다. 기존 설정은 보존했습니다.'); }
          finish();
        } else if (message.type === 'error' || message.type === 'cancelled') { setError(message.type === 'error' ? String(message.error) : '계산을 취소했습니다. 기존 설정은 보존했습니다.'); finish(); }
      };
      const timer = setTimeout(() => { stop(); setRunning(false); setError('계산 창에서 응답이 없습니다. 기존 설정은 보존했습니다. 다시 시도해 주세요.'); }, 600000);
      job.current = { channel, timer };
      const popup = window.open(`${import.meta.env.BASE_URL}optimizer/index.html#${token}`, '_blank');
      if (!popup) { stop(); setRunning(false); setError('계산 창을 열지 못했습니다. 이 사이트의 팝업을 허용하고 다시 시도해 주세요.'); }
    } catch (e) { stop(); setRunning(false); setError(e instanceof Error ? e.message : '계산을 시작하지 못했습니다.'); }
  };
  const apply = () => {
    if (!result || disabled) return;
    try {
      const snapshot = repository.getSnapshot(), preferences = recallPreference(snapshot, deckId), options = recallOptions(snapshot, deckId);
      if (recallTraining(snapshot, deckId).fingerprint !== result.fingerprint || (preferences?.version ?? 0) !== result.baseVersion || options.relearningMinutes.length !== result.relearningSteps)
        throw Error('계산 후 복습 이력이나 설정이 바뀌었습니다. 현재 이력으로 다시 계산해 주세요.');
      const at = new Date().toISOString();
      const saved = repository.execute({ type: 'saveRecallPreferences', id: preferences?.id ?? preferenceId, expectedVersion: preferences?.version ?? 0, ...(deckId ? { deckName: preferences!.deckName } : {}),
        options: { ...options, parameters: result.parameters, optimizedAt: at, optimizedReviews: result.count }, opId: crypto.randomUUID(), at, userId: snapshot.userId, namespace: snapshot.namespace });
      onApplied(saved); setResult(null); setError(''); setNotice('개인별 설정을 적용했습니다. 기존 카드의 날짜와 답변 메모는 보존했습니다.');
    } catch (e) { setError(e instanceof Error ? e.message : '계산 결과를 적용하지 못했습니다.'); }
  };
  const current = recallOptions(data, deckId);
  return <div className="recall-optimization">
    <h3>개인별 FSRS 최적화</h3>
    <p className="muted">자기 평가 {training.reviews}회 · 날짜를 달리한 복습 {training.lengths.length}건. 이력으로 기억 간격을 계산하며, 이력이 적으면 기본값과 비슷할 수 있습니다. 계산은 별도 창에서 이 브라우저 안에서 진행합니다.</p>
    {current.optimizedAt && <p className="muted">최근 적용: {new Date(current.optimizedAt).toLocaleString('ko-KR')} · 복습 {current.optimizedReviews}건</p>}
    <div className="actions"><Button disabled={disabled || running} onClick={start}>복습 이력으로 최적화</Button>
      {running && <Button onClick={() => { stop(); setRunning(false); setNotice('계산을 취소했습니다. 기존 설정은 보존했습니다.'); }}>최적화 계산 취소</Button>}
      {result && <Button disabled={disabled} onClick={apply}>최적화 결과 적용</Button>}</div>
    {running && <p role="status">계산 중입니다. 계산 창을 열어 두세요.</p>}
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
    <p className="muted">예정된 날짜는 그대로 두고 다음 자기 평가부터 계산에 반영합니다. <a href="https://github.com/open-spaced-repetition/fsrs-browser" target="_blank" rel="noreferrer">공식 FSRS 계산기</a>를 사용합니다.</p>
  </div>;
}
