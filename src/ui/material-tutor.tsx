import { materialSourceIdentity } from '../domain/material-source';
import type { MaterialResult } from '../domain/study-material';
import { Button, Textarea } from './index';
import { StudyResultText } from './study-result-text';
export function MaterialTutor({ turns, onHelp, currentSource, question, disabled, onChange, onAsk, onEvidence }: {
  onHelp: () => void; turns: MaterialResult[]; currentSource: import('../domain/study-material').MaterialContent; question: string; disabled: boolean; onChange: (text: string) => void;
  onAsk: () => Promise<void>; onEvidence: (resultId: string, segmentId: string) => void;
}) {
  return <details className="material-tutor" onToggle={event => { if (event.currentTarget.open) onHelp(); }}><summary>이 자료에 질문하기 · 대화 {turns.length}개</summary>
    <div className="material-tutor-turns">{turns.map(turn => <article key={turn.id}><h3>{turn.request?.focus}</h3>{turn.source && materialSourceIdentity(turn.source) !== materialSourceIdentity(currentSource) && <p>이전 원문에 대한 답변입니다. 근거는 생성 당시 자료를 엽니다.</p>}{turn.diagnostics?.map((d, at) => <p key={`d:${at}`}>{d.message}</p>)}{turn.summary.map((answer, index) => <div key={index}><StudyResultText text={answer.text}/><div className="material-evidence">{answer.sourceIds.map(id => <Button key={id} variant="quiet" onClick={() => onEvidence(turn.id, id)}>{turn.segments.find(s => s.id === id)?.label ?? id} 원문</Button>)}</div></div>)}</article>)}</div>
    <Textarea label="자료에 물어볼 질문" value={question} maxLength={10000} rows={3} disabled={disabled} onChange={e => onChange(e.target.value)} placeholder="예: 여기서 이 조건이 필요한 이유가 무엇인가요?"/>
    <Button variant="primary" disabled={disabled || !question.trim()} onClick={() => void onAsk()}>자료를 근거로 답하기</Button>
    <p className="material-hint">선택한 원문과 같은 원문을 사용한 최근 대화를 함께 보냅니다. 원문을 바꿔도 이전 질문·답·당시 근거는 유지합니다.</p>
  </details>;
}
