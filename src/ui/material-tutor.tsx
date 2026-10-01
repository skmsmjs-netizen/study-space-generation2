import { occurrenceRows } from './list-keys';
import { materialSourceIdentity } from '../domain/material-source';
import type { MaterialResult } from '../domain/study-material';
import { Button } from './index';
import { StudyResultText } from './study-result-text';
export function MaterialTutor({ turns, onHelp, currentSource, onEvidence }: {
  onHelp: () => void; turns: MaterialResult[]; currentSource: import('../domain/study-material').MaterialContent;
  onEvidence: (resultId: string, segmentId: string) => void;
}) {
  if (!turns.length) return null;
  return <details className="material-tutor" onToggle={event => { if (event.currentTarget.open) onHelp(); }}><summary>보관한 질문·답변 · {turns.length}개</summary>
    <div className="material-tutor-turns">{turns.map(turn => <article key={turn.id}><h3>{turn.request?.focus}</h3>{turn.source && materialSourceIdentity(turn.source) !== materialSourceIdentity(currentSource) && <p>이전 원문에 대한 답변입니다. 근거는 생성 당시 자료를 엽니다.</p>}{turn.diagnostics && occurrenceRows(turn.diagnostics, diagnostic => JSON.stringify(diagnostic)).map(({value: d, key}) => <p key={key}>{d.message}</p>)}{occurrenceRows(turn.summary, answer => JSON.stringify(answer)).map(({value: answer, key}) => <div key={key}><StudyResultText text={answer.text}/><div className="material-evidence">{answer.sourceIds.map(id => <Button key={id} variant="quiet" onClick={() => onEvidence(turn.id, id)}>{turn.segments.find(s => s.id === id)?.label ?? id} 원문</Button>)}</div></div>)}</article>)}</div>
  </details>;
}
