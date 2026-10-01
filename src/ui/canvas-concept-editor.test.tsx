import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, expect, it } from 'vitest';
import { DemoRepository } from '../data/demo-repository';
import { CanvasConceptEditor } from './canvas-concept-editor';
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
it('adds with only a name, preserves typed description across close/reopen and guards Korean composition', () => {
  const repo = new DemoRepository(localStorage);
  const open = () =>
    render(
      <CanvasConceptEditor
        data={repo.getSnapshot()}
        repository={repo}
        onSaved={() => {}}
        onClose={() => {}}
      />,
    );
  const view = open();
  fireEvent.change(screen.getByLabelText('개념 이름'), { target: { value: '에너지 보존' } });
  fireEvent.change(screen.getByLabelText('개념 설명'), { target: { value: '  고립계에서\r\n  ' } });
  view.unmount();
  open();
  expect(screen.getByLabelText('개념 이름')).toHaveValue('에너지 보존');
  expect(screen.getByLabelText('개념 설명')).toHaveValue('  고립계에서\n  ');
  fireEvent.compositionStart(screen.getByLabelText('개념 이름'));
  expect(screen.getByRole('button', { name: '카드 추가' })).toBeDisabled();
  fireEvent.compositionEnd(screen.getByLabelText('개념 이름'));
  fireEvent.click(screen.getByRole('button', { name: '카드 추가' }));
  expect(repo.getSnapshot().memos!.at(-1)!.body).toBe('에너지 보존\n  고립계에서\n  ');
});
