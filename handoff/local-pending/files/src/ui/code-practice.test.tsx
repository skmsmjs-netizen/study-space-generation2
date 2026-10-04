import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DemoRepository } from '../data/demo-repository';
import { codeDraftKey, readCodeDraft, writeCodeDraft } from '../data/code-example-draft';
import type { CodeRun } from '../domain/model';
import { CodeExampleEditor } from './code-practice';
const execution = vi.hoisted(() => ({
  resolve: null as null | ((run: CodeRun) => void),
}));
vi.mock('./code-terminal', () => ({
  CodeTerminal: () => <div>실행 터미널 테스트</div>,
}));
vi.mock('./source-editor', () => ({
  SourceEditor: ({ value, onChange }: { value: string; onChange: (code: string) => void }) => (
    <textarea
      aria-label="소스 코드 테스트"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}));
vi.mock('../data/code-runner', () => ({
  executeCode: () => ({
    result: new Promise<CodeRun>((resolve) => {
      execution.resolve = resolve;
    }),
    cancel: vi.fn(),
  }),
}));
let repo: DemoRepository;
const context = () => ({
  opId: crypto.randomUUID(),
  at: new Date().toISOString(),
  userId: repo.getSnapshot().userId,
  namespace: repo.getSnapshot().namespace,
});
beforeEach(() => {
  localStorage.clear();
  repo = new DemoRepository(localStorage);
  repo.execute({
    ...context(),
    type: 'saveCodeExample',
    id: 'test-example',
    expectedVersion: 0,
    content: {
      title: '내 예제',
      language: 'c',
      code: 'int main(void) {}',
      stdin: '',
      notes: '',
      inputMode: 'batch',
    },
  });
});
afterEach(() => vi.useRealTimers());
function open() {
  const data = repo.getSnapshot();
  return render(
    <CodeExampleEditor
      example={data.codeExamples![0]}
      data={data}
      repository={repo}
      onSaved={() => {}}
      onCopied={() => {}}
      onTrash={() => {}}
    />,
  );
}
it('keeps rapid typing off synchronous storage and checkpoints the exact latest draft', () => {
  vi.useFakeTimers();
  const view = open();
  const data = repo.getSnapshot();
  const key = codeDraftKey(data, 'test-example');
  const writes = vi.spyOn(Storage.prototype, 'setItem');
  for (let i = 0; i < 20; i++) {
    fireEvent.change(screen.getByLabelText('소스 코드 테스트'), {
      target: { value: `// 한글 원문 ${i}\nint main(void) { return ${i}; }` },
    });
  }
  expect(writes.mock.calls.filter(([name]) => name === key)).toHaveLength(0);
  expect(readCodeDraft(key, 'test-example')?.content.code).toContain('return 19');
  act(() => vi.advanceTimersByTime(250));
  expect(writes.mock.calls.filter(([name]) => name === key)).toHaveLength(1);
  fireEvent.change(screen.getByLabelText('소스 코드 테스트'), {
    target: { value: '// 중단 직전\nint main(void) { return 20; }' },
  });
  view.unmount();
  expect(repo.getSnapshot().codeExamples![0].code).toBe('// 중단 직전\nint main(void) { return 20; }');
  writes.mockRestore();
});
it('checkpoints during uninterrupted typing and preserves text when storage fails', () => {
  vi.useFakeTimers();
  const view = open();
  const key = codeDraftKey(repo.getSnapshot(), 'test-example');
  for (let i = 0; i < 11; i++) {
    fireEvent.change(screen.getByLabelText('소스 코드 테스트'), { target: { value: `// 원문 ${i}` } });
    act(() => vi.advanceTimersByTime(100));
  }
  expect(JSON.parse(localStorage.getItem(key)!).content.code).toBe('// 원문 9');
  const writes = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('full', 'QuotaExceededError');
  });
  fireEvent.change(screen.getByLabelText('소스 코드 테스트'), { target: { value: '// 최신 실패 원문' } });
  act(() => vi.advanceTimersByTime(250));
  expect(readCodeDraft(key, 'test-example')?.content.code).toBe('// 최신 실패 원문');
  expect(screen.getByLabelText('소스 코드 테스트')).toHaveValue('// 최신 실패 원문');
  writes.mockRestore();
  fireEvent(document, new Event('visibilitychange'));
  view.unmount();
});
it('leaves no delayed write after undo returns to saved source and the editor closes', () => {
  vi.useFakeTimers();
  const view = open();
  fireEvent.change(screen.getByLabelText('소스 코드 테스트'), { target: { value: '// temporary' } });
  fireEvent.change(screen.getByLabelText('소스 코드 테스트'), { target: { value: 'int main(void) {}' } });
  view.unmount();
  const writes = vi.spyOn(Storage.prototype, 'setItem');
  act(() => vi.advanceTimersByTime(1000));
  expect(writes.mock.calls.filter(([key]) => key.includes(':code-example-draft:'))).toHaveLength(0);
  writes.mockRestore();
});
it('flushes immediate reload before the shared unsaved-draft warning', () => {
  vi.useFakeTimers();
  const view = open();
  fireEvent.change(screen.getByLabelText('소스 코드 테스트'), { target: { value: '// 바로 재접속' } });
  const event = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(false);
  expect(repo.getSnapshot().codeExamples![0].code).toBe('// 바로 재접속');
  view.unmount();
});
it('saves the latest code and Korean explanation before leaving the editor', () => {
  vi.useFakeTimers();
  const view = open();
  fireEvent.change(screen.getByLabelText('소스 코드 테스트'), {
    target: { value: '// 주석\nint main(void) { return 7; }' },
  });
  fireEvent.change(screen.getByLabelText('내용·설명'), {
    target: { value: '  내가 적은 설명  ' },
  });
  view.unmount();
  expect(repo.getSnapshot().codeExamples![0]).toMatchObject({
    code: '// 주석\nint main(void) { return 7; }',
    notes: '  내가 적은 설명  ',
  });
});
it('keeps the source used for output even when typing continues while execution runs', async () => {
  open();
  fireEvent.click(screen.getByRole('button', { name: /^실행$/ }));
  fireEvent.change(screen.getByLabelText('소스 코드 테스트'), {
    target: { value: 'int main(void) { return 1; }' },
  });
  await act(async () =>
    execution.resolve!({
      language: 'c',
      code: 'int main(void) {}',
      stdin: '',
      at: new Date().toISOString(),
      outcome: 'success',
      output: '7\n',
      error: '',
    }),
  );
  expect(
    screen.getByText('코드·언어·입력값이 바뀌었습니다. 아래는 이전 실행 결과입니다.'),
  ).toBeVisible();
  expect(repo.getSnapshot().codeExamples![0].lastRun?.code).toBe('int main(void) {}');
  expect(repo.getSnapshot().codeExamples![0].code).toContain('return 1');
});
it('preserves a mismatched draft separately and does not overwrite the newer saved code', () => {
  const data = repo.getSnapshot();
  const key = codeDraftKey(data, 'test-example');
  writeCodeDraft(key, {
    id: 'test-example',
    baseVersion: 0,
    content: {
      title: '초안',
      language: 'cpp',
      code: '// 미전송',
      stdin: '',
      notes: '아직 쓰던 설명',
    },
  });
  const raw = localStorage.getItem(key);
  open();
  expect(screen.getByRole('button', { name: /^지금 저장$/ })).toBeDisabled();
  expect(screen.getByText('따로 보존한 초안')).toBeVisible();
  expect(repo.getSnapshot().codeExamples![0].code).toBe('int main(void) {}');
  expect(localStorage.getItem(key)).toBe(raw);
});
it('archives an unreadable draft verbatim before allowing editing again', async () => {
  const key = codeDraftKey(repo.getSnapshot(), 'test-example');
  localStorage.setItem(key, '{broken 원문');
  open();
  expect(screen.getByRole('button', { name: /^지금 저장$/ })).toBeDisabled();
  expect(localStorage.getItem(key)).toBe('{broken 원문');
  fireEvent.click(screen.getByRole('button', { name: '초안 원문 보관 후 편집' }));
  await waitFor(() => expect(screen.getByRole('button', { name: /^지금 저장$/ })).toBeEnabled());
  expect(
    Object.keys(localStorage)
      .filter((name) => name.startsWith(`${key}:recovery:`))
      .some((name) => localStorage.getItem(name) === '{broken 원문'),
  ).toBe(true);
});
it('shows the input field and asks for values before running a scanf example', async () => {
  open();
  fireEvent.change(screen.getByLabelText('소스 코드 테스트'), {
    target: { value: 'int main(){int x; scanf("%d", &x); printf("%d", x);}' },
  });
  const input = screen.getByLabelText('실행에 사용할 입력값');
  expect(input).toBeVisible();
  execution.resolve = null;
  fireEvent.click(screen.getByRole('button', { name: /^실행$/ }));
  expect(input).toHaveFocus();
  expect(screen.getByRole('button', { name: '입력 없이 실행' })).toBeVisible();
  expect(execution.resolve).toBeNull();
  fireEvent.change(input, { target: { value: '42\n' } });
  fireEvent.click(screen.getByRole('button', { name: /^실행$/ }));
  expect(execution.resolve).not.toBeNull();
  await act(async () =>
    execution.resolve!({
      language: 'c',
      code: 'int main(){int x; scanf("%d", &x); printf("%d", x);}',
      stdin: '42\n',
      outcome: 'success',
      output: '42',
      error: '',
      at: new Date().toISOString(),
    }),
  );
  expect(repo.getSnapshot().codeExamples![0].stdin).toBe('42\n');
  expect(repo.getSnapshot().codeExamples![0].lastRun?.output).toBe('42');
});
it('allows deliberately empty input for EOF tests without changing the source', () => {
  open();
  fireEvent.change(screen.getByLabelText('소스 코드 테스트'), {
    target: { value: 'int main(){getchar();}' },
  });
  execution.resolve = null;
  fireEvent.click(screen.getByRole('button', { name: /^실행$/ }));
  fireEvent.click(screen.getByRole('button', { name: '입력 없이 실행' }));
  expect(execution.resolve).not.toBeNull();
});

it('shows disconnected terminal input separately without changing the saved raw keys', () => {
  const data = repo.getSnapshot();
  const example = data.codeExamples![0];
  const rawInput = '3\r한글\r\u0004';
  repo.execute({
    ...context(), type: 'saveCodeExample', id: example.id, expectedVersion: example.version,
    content: { title: example.title, language: example.language, code: example.code,
      stdin: '미리 적은 값', notes: example.notes, inputMode: 'terminal',
      lastRun: { language: example.language, code: example.code, stdin: rawInput,
        output: '입력: ', mode: 'terminal', outcome: 'error', error: '연결이 끊겼습니다.',
        at: new Date().toISOString() } },
  });
  open();
  const details = screen.getByText('보낸 입력').closest('details');
  expect(details).toHaveAttribute('open');
  expect(details).toHaveTextContent('한글');
  expect(details).toHaveTextContent('〔입력 끝〕');
  expect(repo.getSnapshot().codeExamples![0].lastRun?.stdin).toBe(rawInput);
  expect(repo.getSnapshot().codeExamples![0].stdin).toBe('미리 적은 값');
});

it('accepts the cancelled result while a side editor is hidden and keeps editing usable on return', async () => {
  const data=repo.getSnapshot();
  const props={example:data.codeExamples![0],data,repository:repo,onSaved:()=>{},onCopied:()=>{},onTrash:()=>{}};
  const view=render(<CodeExampleEditor {...props} active/>);
  fireEvent.change(screen.getByLabelText('내용·설명'),{target:{value:'  숨기기 전 조건  '}});
  fireEvent.click(screen.getByRole('button',{name:/^실행$/}));
  view.rerender(<CodeExampleEditor {...props} active={false}/>);
  await act(async()=>execution.resolve!({language:'c',code:'int main(void) {}',stdin:'',at:new Date().toISOString(),outcome:'stopped',output:'',error:''}));
  view.rerender(<CodeExampleEditor {...props} active/>);
  expect(screen.getByLabelText('내용·설명')).toHaveValue('  숨기기 전 조건  ');
  expect(screen.getByRole('button',{name:/^실행$/})).toBeEnabled();
  expect(repo.getSnapshot().codeExamples![0].lastRun?.outcome).toBe('stopped');
});
