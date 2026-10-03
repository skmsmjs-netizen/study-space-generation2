import { beforeEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { InputAIHelp } from './input-ai-help';
import { emptyState } from '../domain/model';
import { applyCommand } from '../domain/commands';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
import { generateStudyMaterial } from '../data/study-ai';
import { readMaterialDraft } from '../data/material-files';
vi.mock('../data/study-ai', () => ({ generateStudyMaterial: vi.fn() }));
const owner = {
  userId: AI_OWNER_USER_ID,
  namespace: 'personal' as const,
  opId: 's',
  at: '2026-10-03T00:00:00Z',
};
const fixture = () =>
  applyCommand(emptyState(owner.userId, owner.namespace), {
    ...owner,
    type: 'addSubject',
    id: 's',
    name: '합성 과목',
    scope: { kind: 'independent' },
  });
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('indexedDB', new IDBFactory());
  vi.stubGlobal('IDBKeyRange', IDBKeyRange);
  vi.mocked(generateStudyMaterial).mockReset();
  Element.prototype.scrollIntoView = vi.fn();
});
const input = { key: 'record:r', title: '답안', text: '  I=VR\r\n조건은 유지 😀', subjectId: 's' };
it('makes no call on open/reopen/save and preserves results through a failed save, retry and remount', async () => {
  const data = fixture();
  let fail = true;
  const save = vi.fn((command) => {
    if (fail) throw Error('합성 저장 실패');
    return applyCommand(data, command).studyMaterials![0].version;
  });
  vi.mocked(generateStudyMaterial).mockImplementation(async (_owner, c) => ({
    id: 'g',
    at: owner.at,
    model: 'synthetic',
    request: c.aiRequest,
    source: { text: c.sourceText, audio: null },
    segments: [{ id: 's1', text: c.sourceText, start: null, end: null }],
    summary: [{ text: '합성 검토', sourceIds: ['s1'] }],
    cards: [],
  }));
  let view = render(<InputAIHelp data={data} input={input} save={save} />);
  fireEvent.click(screen.getByRole('button', { name: '입력으로 GPT 도움' }));
  await screen.findByRole('button', { name: '선택한 GPT 도움 실행' });
  expect(generateStudyMaterial).not.toHaveBeenCalled();
  fireEvent.change(screen.getByRole('textbox', { name: '확인할 질문·초점 · 선택' }), {
    target: { value: '조건을 확인' },
  });
  fireEvent.click(screen.getByRole('button', { name: '선택한 GPT 도움 실행' }));
  await screen.findByText('합성 검토');
  expect(vi.mocked(generateStudyMaterial).mock.calls[0][1].aiRequest?.task).toBe('reasoning');
  await waitFor(()=>expect(screen.getByRole('button',{name:'입력·결과를 자료에 저장'})).toBeEnabled());
  fireEvent.click(screen.getByRole('button', { name: '입력·결과를 자료에 저장' }));
  await screen.findByText('합성 저장 실패');
  fail = false;
  await waitFor(()=>expect(screen.getByRole('button',{name:'입력·결과를 자료에 저장'})).toBeEnabled());
  fireEvent.click(screen.getByRole('button', { name: '입력·결과를 자료에 저장' }));
  await screen.findByText(/자료에 보관했습니다/);
  expect(save.mock.calls[0][0].id).toBe(save.mock.calls[1][0].id);
  expect(generateStudyMaterial).toHaveBeenCalledTimes(1);
  const draft = await readMaterialDraft(data, 'input-ai:record:r');
  expect(draft?.content.sourceText.endsWith(input.text)).toBe(true);
  expect(draft?.content.results).toHaveLength(1);
  view.unmount();
  view = render(<InputAIHelp data={data} input={{ ...input, text: '후속 원문' }} save={save} />);
  fireEvent.click(screen.getByRole('button', { name: '입력으로 GPT 도움' }));
  await screen.findByText('합성 검토');
  expect(generateStudyMaterial).toHaveBeenCalledTimes(1);
  expect(
    (await readMaterialDraft(data, 'input-ai:record:r'))?.content.sourceText.endsWith(input.text),
  ).toBe(true);
});
it('keeps the original and restores an unassigned code draft after inference failure', async () => {
  const data = fixture();
  vi.mocked(generateStudyMaterial).mockRejectedValue(Error('합성 호출 실패'));
  const code = { ...input, key: 'code:c', subjectId: undefined };
  let view = render(<InputAIHelp data={data} input={code} defaultTask="code" save={() => 1} />);
  fireEvent.click(screen.getByRole('button', { name: '입력으로 GPT 도움' }));
  await screen.findByRole('button', { name: '선택한 GPT 도움 실행' });
  fireEvent.click(screen.getByRole('button', { name: '선택한 GPT 도움 실행' }));
  await screen.findByText('결과를 모아 둘 과목을 골라 주세요.');
  expect(generateStudyMaterial).not.toHaveBeenCalled();
  view.unmount();
  view = render(<InputAIHelp data={data} input={code} defaultTask="code" save={() => 1} />);
  fireEvent.click(screen.getByRole('button', { name: '입력으로 GPT 도움' }));
  await screen.findByRole('button', { name: '선택한 GPT 도움 실행' });
  fireEvent.change(screen.getByRole('combobox', { name: '결과를 모아 둘 과목' }), {
    target: { value: 's' },
  });
  fireEvent.click(screen.getByRole('button', { name: '선택한 GPT 도움 실행' }));
  await screen.findByText('합성 호출 실패');
  expect(
    (await readMaterialDraft(data, 'input-ai:code:c'))?.content.sourceText.endsWith(code.text),
  ).toBe(true);
  expect(generateStudyMaterial).toHaveBeenCalledTimes(1);
});
it('does not expose inference to demo or other owners', () => {
  const data = emptyState('other', 'personal');
  render(<InputAIHelp data={data} input={input} save={() => 1} />);
  expect(screen.queryByRole('button', { name: '입력으로 GPT 도움' })).toBeNull();
});
