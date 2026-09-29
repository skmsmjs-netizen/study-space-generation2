import { useState } from 'react';
import type { AppState } from '../domain/model';
import { clearStudyLaunch, readStudyLaunch, resolveStudyLaunchTarget, saveStudyLaunch, type StudyLaunchHint } from '../data/study-launch';
import { Button, Card, ErrorState, Modal } from './index';
import { navigate } from './navigation-context';
import './study-launch.css';

export interface StudyLaunchProps {
  data: AppState;
  nodeId?: string;
  onRecord?: (nodeId: string) => void;
  onChoose?: () => void;
}
export function StudyLaunch(props: StudyLaunchProps) {
  return <StudyLaunchContent key={`${props.data.namespace}:${props.data.userId}:${props.nodeId ?? 'home'}`} {...props} />;
}
function StudyLaunchContent({ data, nodeId, onRecord = id => navigate(`/record/${id}`), onChoose = () => navigate('/subjects') }: StudyLaunchProps) {
  const [initial] = useState(() => {
    try { return { hint: readStudyLaunch(data), error: '' }; }
    catch { return { hint: null, error: '공부한 뒤 돌아올 위치를 읽지 못했습니다. 저장된 위치와 공부 기록·초안을 변경하지 않았습니다. 다시 읽기를 시도해 주세요.' }; }
  });
  const [hint, setHint] = useState<StudyLaunchHint | null>(initial.hint);
  const [error, setError] = useState(initial.error), [readBlocked, setReadBlocked] = useState(Boolean(initial.error));
  const [open, setOpen] = useState(false);
  const [guideHint, setGuideHint] = useState<StudyLaunchHint | null>(null);
  const selected = nodeId ? resolveStudyLaunchTarget(data, nodeId) : null;
  const guide = guideHint ? resolveStudyLaunchTarget(data, guideHint.nodeId, guideHint) : null;
  const returning = hint ? resolveStudyLaunchTarget(data, hint.nodeId, hint) : null;
  const displayedHint = !nodeId || hint?.nodeId === nodeId;
  const retryRead = () => {
    try { setHint(readStudyLaunch(data)); setError(''); setReadBlocked(false); }
    catch { setReadBlocked(true); setError('복귀 위치를 다시 읽지 못했습니다. 저장된 내용은 덮어쓰지 않았습니다. 잠시 뒤 다시 읽기를 시도해 주세요.'); }
  };
  const start = () => {
    if (!nodeId || !guide || readBlocked) return;
    try { setHint(saveStudyLaunch(data, nodeId)); setError(''); setOpen(false); }
    catch { setError('복귀 위치의 저장을 확인하지 못했습니다. 공부 기록이나 활동 체크는 만들지 않았습니다. 이 창에서 저장을 다시 시도해 주세요.'); }
  };
  const choose = () => {
    try { clearStudyLaunch(data); setHint(null); setError(''); setOpen(false); onChoose(); }
    catch { setError('복귀 위치의 해제를 확인하지 못했습니다. 공부 기록·초안은 변경하지 않았습니다. 위치를 다시 읽거나 다른 내용 고르기를 다시 시도해 주세요.'); }
  };
  const record = (id: string, expected?: StudyLaunchHint) => {
    if (!resolveStudyLaunchTarget(data, id, expected)) {
      setError('이 주제의 현재 소속을 확인하지 못했습니다. 기록을 만들지 않았습니다. 과목에서 주제를 다시 골라 주세요.'); return;
    }
    setOpen(false); onRecord(id);
  };
  if (!selected && !hint && !error) return null;
  return <section className="study-launch" aria-label="공부 시작과 복귀">
    {selected && <Button onClick={() => {
      setGuideHint({ version: 1, userId: data.userId, namespace: data.namespace, nodeId: selected.node.id,
        subjectId: selected.subject.id, scope: { ...selected.subject.scope } });
      setOpen(true);
    }}>공부 시작 안내</Button>}
    {!open && error && <ErrorState message={error} onRetry={retryRead} />}
    {displayedHint && hint && <Card className="study-launch-return">
      {returning ? <>
        <h2>공부하고 오세요 ~</h2>
        <p className="muted">{returning.path.join(' → ')}</p>
        <p>돌아오면 해본 만큼만 남겨 주세요. 일부만 했거나 막힌 부분도 남길 수 있습니다.</p>
        <p className="muted">이 기기에 복귀 위치만 보관했습니다. 시작 안내로 공부 기록이나 활동 체크가 추가되지는 않습니다.</p>
        <div className="actions"><Button variant="primary" onClick={() => record(returning.node.id, hint)}>다 하셨으면 기록하세요</Button><Button variant="quiet" onClick={choose}>다른 내용 고르기</Button></div>
      </> : <>
        <h2>공부할 주제를 다시 골라 주세요</h2>
        <p>보관한 주제가 없어졌거나 과목·학기 소속이 달라졌습니다. 이전 공부 기록과 초안은 그대로 유지했습니다.</p>
        <Button onClick={choose}>다른 내용 고르기</Button>
      </>}
    </Card>}
    <Modal open={open} title="이 주제부터 해볼까요?" onClose={() => setOpen(false)}>
      {guide ? <div className="study-launch-guide">
        <p className="muted">{guide.path.join(' → ')}</p>
        <p>자료를 잠깐 덮고, ‘{guide.node.name}’의 핵심과 사용 조건을 설명해 보세요.</p>
        <p>처음 보는 내용이거나 막히면 관련 설명이나 예제를 본 뒤 다시 해보세요.</p>
        <p>돌아오면 이 주제에 해본 만큼 기록하면 됩니다. 이미 공부했다면 바로 기록할 수 있습니다.</p>
        {error && <ErrorState message={error} onRetry={retryRead} />}
        <div className="actions"><Button variant="primary" disabled={readBlocked} onClick={start}>공부 시작</Button><Button onClick={() => record(guide.node.id, guideHint!)}>이미 공부했어요 · 기록하기</Button></div>
      </div> : <ErrorState message="이 주제가 없어졌거나 과목·학기 소속이 달라졌습니다. 기록을 만들지 않았습니다. 창을 닫고 과목에서 다시 골라 주세요." />}
    </Modal>
  </section>;
}
