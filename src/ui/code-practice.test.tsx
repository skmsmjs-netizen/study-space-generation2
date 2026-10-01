import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DemoRepository } from '../data/demo-repository';
import { codeDraftKey, writeCodeDraft } from '../data/code-example-draft';
import type { CodeRun } from '../domain/model';
import { CodeExampleEditor } from './code-practice';
const execution = vi.hoisted(() => ({ resolve: null as null | ((run: CodeRun) => void) }));
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
    content: { title: '내 예제', language: 'c', code: 'int main(void) {}', stdin: '', notes: '' },
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
it('saves the latest code and Korean explanation before leaving the editor', () => {
  vi.useFakeTimers();
  const view = open();
  fireEvent.change(screen.getByLabelText('소스 코드 테스트'), {
    target: { value: '// 주석\nint main(void) { return 7; }' },
  });
  fireEvent.change(screen.getByLabelText('내용·설명'), { target: { value: '  내가 적은 설명  ' } });
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
  fireEvent.change(screen.getByLabelText('소스 코드 테스트'), {target: {value: 'int main(){int x; scanf("%d", &x); printf("%d", x);}'}});
  const input = screen.getByLabelText('실행에 사용할 입력값');
  expect(input).toBeVisible();
  execution.resolve = null;
  fireEvent.click(screen.getByRole('button', {name: /^실행$/}));
  expect(input).toHaveFocus();
  expect(screen.getByRole('button', {name: '입력 없이 실행'})).toBeVisible();
  expect(execution.resolve).toBeNull();
  fireEvent.change(input, {target: {value: '42\n'}});
  fireEvent.click(screen.getByRole('button', {name: /^실행$/}));
  expect(execution.resolve).not.toBeNull();
  await act(async () => execution.resolve!({language: 'c',code: 'int main(){int x; scanf("%d", &x); printf("%d", x);}',stdin: '42\n',outcome: 'success',output: '42',error: '',at: new Date().toISOString()}));
  expect(repo.getSnapshot().codeExamples![0].stdin).toBe('42\n');
  expect(repo.getSnapshot().codeExamples![0].lastRun?.output).toBe('42');
});
it('allows deliberately empty input for EOF tests without changing the source', () => {
  open();
  fireEvent.change(screen.getByLabelText('소스 코드 테스트'), {target: {value: 'int main(){getchar();}'}});
  execution.resolve = null;
  fireEvent.click(screen.getByRole('button', {name: /^실행$/}));
  fireEvent.click(screen.getByRole('button', {name: '입력 없이 실행'}));
  expect(execution.resolve).not.toBeNull();
});
