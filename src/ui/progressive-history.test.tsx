import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it } from 'vitest';
import { ProgressiveHistory } from './progressive-history';

beforeEach(() => sessionStorage.clear());
const owner = { namespace: 'personal' as const, userId: 'history-owner' };
const rows = Array.from({ length: 91 }, (_, i) => `원문 ${i}`);
function History({
  userId = owner.userId,
  collapsible = false,
}: {
  userId?: string;
  collapsible?: boolean;
}) {
  return (
    <ProgressiveHistory
      data={{ ...owner, userId }}
      name="originals"
      total={rows.length}
      label="자기 평가 기록"
      collapsible={collapsible}
    >
      {(limit) =>
        rows.slice(0, limit).map((row) => (
          <p data-testid="original" key={row}>
            {row}
          </p>
        ))
      }
    </ProgressiveHistory>
  );
}
it('adds history incrementally, retains its view on return, and separates owners without editing originals', () => {
  const original = [...rows],
    view = render(<History />);
  expect(screen.getAllByTestId('original')).toHaveLength(40);
  fireEvent.click(screen.getByRole('button', { name: '자기 평가 기록 더 보기' }));
  expect(screen.getAllByTestId('original')).toHaveLength(80);
  view.unmount();
  const returned = render(<History />);
  expect(screen.getAllByTestId('original')).toHaveLength(80);
  returned.rerender(<History userId="another-owner" />);
  expect(screen.getAllByTestId('original')).toHaveLength(40);
  returned.rerender(<History />);
  fireEvent.click(screen.getByRole('button', { name: '자기 평가 기록 모두 펼치기' }));
  expect(screen.getAllByTestId('original')).toHaveLength(91);
  expect(screen.queryByRole('button')).toBeNull();
  expect(rows).toEqual(original);
});
it('mounts the first page only when a collapsed history is opened and restores open state', async () => {
  const view = render(<History collapsible />);
  expect(screen.queryByTestId('original')).toBeNull();
  fireEvent.click(screen.getByText('자기 평가 기록 91개'));
  await waitFor(() => expect(screen.getAllByTestId('original')).toHaveLength(40));
  view.unmount();
  render(<History collapsible />);
  expect(screen.getAllByTestId('original')).toHaveLength(40);
});
