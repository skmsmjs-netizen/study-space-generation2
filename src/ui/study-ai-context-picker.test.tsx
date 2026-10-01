import { expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { emptyState } from '../domain/model';
import { StudyAIContextPicker } from './study-ai-context-picker';

it('finds accumulated sources, appends chosen originals, preserves later edits on undo and can safely undo an unchanged import', async () => {
  const data = emptyState('synthetic', 'test');
  const base = {
    userId: data.userId,
    namespace: data.namespace,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T01:00:00Z',
    version: 1,
    deletedAt: null,
  };
  data.subjects = [
    { ...base, id: 's', name: '합성 과목', scope: { kind: 'independent' }, order: 0 },
  ];
  data.memos = Array.from({ length: 65 }, (_, i) => ({
    ...base,
    id: `m${i}`,
    ownerId: null,
    body: `원문 ${i}의  조건\r\n예외`,
    strokes: [],
  }));
  const applied = vi.fn();
  function Fixture() {
    const [text, setText] = useState('원래 필기');
    return (
      <>
        <textarea
          aria-label="현재 필기"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <StudyAIContextPicker
          data={data}
          subjectId="s"
          text={text}
          disabled={false}
          onApply={async (next) => {
            applied(next);
            setText(next);
          }}
        />
      </>
    );
  }
  render(<Fixture />);
  fireEvent.click(screen.getByText('기존 기록 가져오기'));
  expect(screen.getAllByRole('checkbox')).toHaveLength(30);
  fireEvent.click(screen.getByRole('button', { name: '다음 기록 더 보기' }));
  expect(screen.getAllByRole('checkbox')).toHaveLength(60);
  fireEvent.change(screen.getByRole('textbox', { name: '가져올 기록 찾기' }), {
    target: { value: '원문 64의' },
  });
  await waitFor(() => expect(screen.getAllByRole('checkbox')).toHaveLength(1));
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: '선택한 기록 가져오기' }));
  await screen.findByText(/선택한 기록을 필기에 추가했습니다/);
  const imported = applied.mock.calls[0][0];
  expect(imported).toContain(data.memos[64].body);
  fireEvent.click(screen.getByRole('button', { name: '마지막 가져오기 되돌리기' }));
  await screen.findByText('가져오기 전 필기로 돌아왔습니다.');
  expect(screen.getByRole('textbox', { name: '현재 필기' })).toHaveValue('원래 필기');
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: '선택한 기록 가져오기' }));
  await screen.findByText(/선택한 기록을 필기에 추가했습니다/);
  fireEvent.change(screen.getByRole('textbox', { name: '현재 필기' }), {
    target: { value: imported + '\n추가 편집' },
  });
  fireEvent.click(screen.getByRole('button', { name: '마지막 가져오기 되돌리기' }));
  await screen.findByText(/가져온 뒤 필기를 수정했습니다/);
  expect(applied).toHaveBeenCalledTimes(3);
  expect(screen.getByRole('textbox', { name: '현재 필기' })).toHaveValue(
    imported.replace(/\r\n/g, '\n') + '\n추가 편집',
  );
});
