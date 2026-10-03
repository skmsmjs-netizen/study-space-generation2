import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { emptyState } from '../../src/domain/model';
import { applyCommand } from '../../src/domain/commands';
import { AI_OWNER_USER_ID } from '../../src/domain/ai-access';
import { InputAIHelp } from '../../src/ui/input-ai-help';
import { Textarea, Checkbox } from '../../src/ui/index';
import '../../src/app.css';

const seed = applyCommand(emptyState(AI_OWNER_USER_ID, 'personal'), {
  userId: AI_OWNER_USER_ID,
  namespace: 'personal',
  opId: 'subject',
  at: '2026-10-03T00:00:00Z',
  type: 'addSubject',
  id: 's',
  name: '합성 회로이론',
  scope: { kind: 'independent' },
});
let state = JSON.parse(localStorage.getItem('synthetic-input-ai-state') ?? 'null') ?? seed;
function Fixture() {
  const [data, setData] = useState(state),
    [text, setText] = useState(
      localStorage.getItem('synthetic-input-ai-original') ?? '  I=VR\n저항이 일정할 때의 풀이 😀',
    ),
    [fail, setFail] = useState(false);
  return (
    <main>
      <p>격리 합성 입력·생성·저장 검증 · 실제 GPT/계정/운영 저장을 사용하지 않습니다.</p>
      <Textarea
        label="작성 중인 원문"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          localStorage.setItem('synthetic-input-ai-original', e.target.value);
        }}
      />
      <Checkbox label="합성 저장 실패" checked={fail} onChange={(e) => setFail(e.target.checked)} />
      <InputAIHelp
        data={data}
        input={{ key: 'record:r', title: '합성 답안', text, subjectId: 's' }}
        save={(command) => {
          if (fail) throw Error('합성 저장 실패');
          state = applyCommand(state, command);
          localStorage.setItem('synthetic-input-ai-state', JSON.stringify(state));
          setData(state);
          return state.studyMaterials.find((m: { id: string }) => m.id === command.id)?.version;
        }}
      />
      <output aria-label="보관한 자료 수">{data.studyMaterials?.length ?? 0}</output>
      <output aria-label="보관한 결과 수">{data.studyMaterials?.[0]?.results.length ?? 0}</output>
    </main>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
