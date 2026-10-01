import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CodeExampleEditor } from '../../src/ui/code-practice';
import { DemoRepository } from '../../src/data/demo-repository';
import { executeCodeTerminal } from '../../src/data/code-terminal';
import type { StudyRepository } from '../../src/data/repository';
import '../../src/app.css';
const local = new DemoRepository(localStorage);
if (!local.getSnapshot().codeExamples?.length) {
  const data = local.getSnapshot();
  local.execute({ type: 'saveCodeExample', id: 'synthetic-terminal-fixture', expectedVersion: 0, userId: data.userId, namespace: data.namespace, opId: crypto.randomUUID(), at: new Date().toISOString(), content: {
    title: '화면 검사 예제 · 실제 공부 아님', language: 'c', code: '#include <stdio.h>\nint main(){return 0;}', notes: '', stdin: '', inputMode: 'terminal',
  } });
}
const repository: StudyRepository = {
  getSnapshot: () => local.getSnapshot(), execute: command => local.execute(command),
  getCodeTerminal: () => (content, output, phase) => executeCodeTerminal(content, output, phase, {
    url: 'wss://terminal.fixture.invalid/terminal', authenticate: async () => 'synthetic-test-token',
  }),
};
function App() {
  const [data, setData] = useState(repository.getSnapshot());
  return <main style={{ maxWidth: 1000, padding: 16, margin: 'auto' }}><p>격리된 화면·전송 검사입니다. 실제 컴파일 서버 또는 실제 공부 기록이 아닙니다.</p><CodeExampleEditor example={data.codeExamples![0]} data={data} repository={repository} onSaved={setData} onCopied={() => {}} onTrash={() => {}} /></main>;
}
createRoot(document.getElementById('root')!).render(<App />);
