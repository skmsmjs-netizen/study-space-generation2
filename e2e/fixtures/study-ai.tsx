import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { emptyState } from '../../src/domain/model';
import { applyCommand } from '../../src/domain/commands';
import { AI_OWNER_USER_ID } from '../../src/domain/ai-access';
import { StudyMaterials } from '../../src/ui/study-materials';
import type { StudyRepository } from '../../src/data/repository';

const base = {
  userId: AI_OWNER_USER_ID,
  namespace: 'personal' as const,
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T01:00:00Z',
  version: 1,
  deletedAt: null,
};
const seed = applyCommand(emptyState(base.userId, base.namespace), {
  ...base,
  type: 'addSubject',
  id: 's',
  name: '합성 회로이론',
  scope: { kind: 'independent' },
  opId: 'subject',
  at: base.createdAt,
});
seed.memos = Array.from({ length: 65 }, (_, i) => ({
  ...base,
  id: `m${i}`,
  ownerId: null,
  body: `검증 메모 ${i}: 전압은 전류와 저항의 곱이다.  \r\n저항이 일정한 조건을 확인한다.`,
  strokes: [],
}));
seed.codeExamples = [
  {
    ...base,
    id: 'c',
    title: '합성 실행 기록',
    language: 'javascript',
    code: 'console.log(2)',
    stdin: '',
    notes: '수정 후 실행하지 않음',
    lastRun: {
      language: 'javascript',
      code: 'console.log(1)',
      stdin: '',
      at: base.createdAt,
      outcome: 'success',
      output: '1',
      error: '',
    },
  },
];
let state = JSON.parse(localStorage.getItem('synthetic-gpt-completion') || 'null') ?? seed;
const repository: StudyRepository = {
  getSnapshot: () => state,
  getCapabilities: () => ['saveStudyMaterial'],
  execute(command) {
    state = applyCommand(state, command);
    localStorage.setItem('synthetic-gpt-completion', JSON.stringify(state));
    return state;
  },
  async flush() {},
  getStatus: () => ({ phase: 'saved', pending: 0, message: '' }),
};
function Fixture() {
  const [data, setData] = useState(state);
  const id = location.hash.replace(/^#\/materials\//, '') || 'new';
  return (
    <main>
      <p>합성 검증 공간 · 실제 계정·GPT·운영 저장을 사용하지 않습니다.</p>
      <output aria-label="합성 GPT 호출">
        {localStorage.getItem('synthetic-generation-calls') ?? '0'}
      </output>
      <output aria-label="저장된 프롬프트 버전">
        {data.studyMaterials?.at(-1)?.results.at(-1)?.promptVersion ?? '미저장'}
      </output>
      <StudyMaterials data={data} repository={repository} onSaved={setData} materialId={id} />
    </main>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
