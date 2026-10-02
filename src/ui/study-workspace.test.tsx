import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createDemoState } from '../domain/fixtures';
import { DEFAULT_DESK, workStateKey, readWorkState, isWorkState } from '../data/study-workspace';
import {
  SavedWorkspaces,
  StudyWorkspace,
  useStudyWorkspace,
  WorkspaceStorageNotice,
} from './study-workspace';
import { WorkspaceCommands } from './workspace-commands';
const data = { ...createDemoState(), namespace: 'personal' as const, userId: 'workspace-owner' };
function Harness({ userId = data.userId }: { userId?: string }) {
  const owner = { ...data, userId },
    controller = useStudyWorkspace(owner, '/materials');
  return (
    <>
      <WorkspaceStorageNotice controller={controller} />
      <SavedWorkspaces key={userId} controller={controller} data={owner} route="/materials" />
      <StudyWorkspace
        controller={controller}
        sourceTitle="원문"
        source={<textarea aria-label="보존할 원문" defaultValue="  한글 원문  " />}
        renderTool={(tool) => <textarea aria-label={`보존할 ${tool}`} defaultValue="초안" />}
      />
    </>
  );
}
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  Object.defineProperty(navigator, 'locks', { configurable: true, value: { request: async (_key: string, callback: () => unknown) => callback() } });
});
afterEach(() => { vi.restoreAllMocks(); Reflect.deleteProperty(navigator, 'locks'); });
it('keeps source and visited tool editors mounted across resize, collapse and tool changes', async () => {
  render(<Harness />);
  const original = screen.getByLabelText('보존할 원문');
  fireEvent.click(screen.getByRole('button', { name: '곁 도구 펼치기' }));
  const memo = screen.getByLabelText('보존할 memo');
  fireEvent.change(memo, { target: { value: '  초안과 예외  ' } });
  fireEvent.change(screen.getByLabelText('자료 폭 조절'), { target: { value: '65' } });
  fireEvent.change(screen.getByLabelText('곁에 놓을 도구'), { target: { value: 'math' } });
  fireEvent.change(screen.getByLabelText('곁에 놓을 도구'), { target: { value: 'memo' } });
  fireEvent.click(screen.getByRole('button', { name: '곁 도구 접기' }));
  fireEvent.click(screen.getByRole('button', { name: '곁 도구 펼치기' }));
  expect(screen.getByLabelText('보존할 원문')).toBe(original);
  expect(screen.getByLabelText('보존할 memo')).toBe(memo);
  expect(memo).toHaveValue('  초안과 예외  ');
  await waitFor(() => expect(readWorkState(workStateKey(data)).value.layouts['/materials']?.width).toBe(65));
});
it('preserves failed writes in memory for retry, keeps owner settings separate and never replaces corrupt storage', async () => {
  const view = render(<Harness />);
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('full', 'QuotaExceededError');
  });
  fireEvent.click(screen.getByRole('button', { name: '곁 도구 펼치기' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('저장되지 않았습니다');
  expect(screen.getByLabelText('곁에 놓을 도구')).toHaveValue('memo');
  spy.mockRestore();
  fireEvent.click(screen.getByRole('button', { name: '저장 다시 시도' }));
  await waitFor(() => expect(readWorkState(workStateKey(data)).value.layouts['/materials']?.open).toBe(true));
  view.rerender(<Harness userId="another-owner" />);
  expect(screen.getByRole('button', { name: '곁 도구 펼치기' })).toBeVisible();
  view.unmount();
  localStorage.setItem(workStateKey(data), '{broken');
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: '곁 도구 펼치기' }));
  expect(localStorage.getItem(workStateKey(data))).toBe('{broken');
});
it('saves references, renames and undoes removal without copying study text', async () => {
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: '작업 구성' }));
  fireEvent.change(screen.getByLabelText('작업 이름'), { target: { value: '두 번째 읽기' } });
  fireEvent.click(screen.getByRole('button', { name: '현재 작업 보관' }));
  fireEvent.click(screen.getByRole('button', { name: '이름 바꾸기' }));
  fireEvent.change(screen.getByLabelText('새 작업 이름'), { target: { value: '다시 볼 자료' } });
  fireEvent.click(screen.getByRole('button', { name: '이름 저장' }));
  expect(screen.getByText('다시 볼 자료')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: '구성 삭제' }));
  fireEvent.click(screen.getByRole('button', { name: '구성 삭제 되돌리기' }));
  await waitFor(() => expect(readWorkState(workStateKey(data)).value.saved[0]?.name).toBe('다시 볼 자료'));
  const raw = localStorage.getItem(workStateKey(data))!;
  expect(raw).not.toContain('한글 원문');
  expect(readWorkState(workStateKey(data)).value.saved[0].name).toBe('다시 볼 자료');
  expect(
    isWorkState({ version: 1, layouts: { '/': { ...DEFAULT_DESK, width: 120 } }, saved: [] }),
  ).toBe(false);
});
it('does not seize Korean composition or editor shortcuts and supports empty/disabled commands', () => {
  const run = vi.fn();
  render(
    <>
      <input aria-label="글쓰기" />
      <WorkspaceCommands
        commands={[
          { id: 'go', title: '자료 열기', run },
          { id: 'blocked', title: '이 주제로 기록', disabled: '주제 선택 필요', run },
        ]}
      />
    </>,
  );
  const editor = screen.getByLabelText('글쓰기');
  fireEvent.keyDown(editor, { key: 'k', ctrlKey: true, shiftKey: true });
  fireEvent.keyDown(document, { key: 'k', ctrlKey: true, shiftKey: true, isComposing: true });
  expect(screen.queryByRole('dialog')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: '빠른 명령' }));
  expect(screen.getByRole('button', { name: '이 주제로 기록' })).toBeDisabled();
  fireEvent.change(screen.getByLabelText('명령 찾기'), { target: { value: '없는 명령' } });
  expect(screen.getByText('일치하는 명령이 없습니다')).toBeVisible();
  fireEvent.change(screen.getByLabelText('명령 찾기'), { target: { value: '자료' } });
  fireEvent.keyDown(screen.getByLabelText('명령 찾기'), { key: 'Enter', isComposing: true });
  expect(run).not.toHaveBeenCalled();
  fireEvent.keyDown(screen.getByLabelText('명령 찾기'), { key: 'Enter' });
  expect(run).toHaveBeenCalledOnce();
});

it('does not overwrite a newer workspace written by another tab', async () => {
  render(<Harness/>);
  const newer = {version:1, layouts:{}, saved:[{id:'other',name:'다른 창의 구성',route:'/materials',layout:DEFAULT_DESK,savedAt:'2026-10-02'}]};
  localStorage.setItem(workStateKey(data),JSON.stringify(newer));
  fireEvent.click(screen.getByRole('button',{name:'곁 도구 펼치기'}));
  expect(await screen.findByRole('alert')).toHaveTextContent('다른 창에서');
  expect(readWorkState(workStateKey(data)).value.saved[0].name).toBe('다른 창의 구성');
});
