import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { APIBudgetSummary } from './api-budget-summary';
const billing = { configured: true, enabled: true, limitMicro: 10_000_000, usedMicro: 2_000_000, pendingMicro: 1_000_000, month: '2026-10-01' };
it('subtracts both settled usage and unconfirmed reservations from the saved cap', () => {
  const view = render(<APIBudgetSummary billing={billing} />);
  expect(screen.getByRole('img')).toHaveAccessibleName(/남은 월 예산 US\$7.0, 상한의 70.0%/);
  expect(view.container.querySelector('.api-budget-used')).toHaveAttribute('stroke-dasharray', '20 80');
  expect(view.container.querySelector('.api-budget-pending')).toHaveAttribute('stroke-dashoffset', '-20');
  view.rerender(<APIBudgetSummary billing={{ ...billing, usedMicro: 3_000_000, pendingMicro: 0 }} />);
  expect(screen.getByRole('img')).toHaveAccessibleName(/US\$7.0, 상한의 70.0%/);
});
it('keeps overspending visible after a cap reduction and never draws a negative remainder', () => {
  const view = render(<APIBudgetSummary billing={{ ...billing, limitMicro: 1_000_000 }} />);
  expect(screen.getByRole('img')).toHaveAccessibleName(/남은 월 예산 US\$0.0, 상한의 0.0%/);
  expect(screen.getByRole('status')).toHaveTextContent('저장된 상한보다 US$2.0 많습니다.');
  expect(view.container.querySelector('.api-budget-used')).toHaveAttribute('stroke-dasharray', '100 0');
});
it('distinguishes no usage, tiny usage and the final micro-dollar from an empty balance', () => {
  const view = render(<APIBudgetSummary billing={{ ...billing, usedMicro: 0, pendingMicro: 0 }} />);
  expect(screen.getByRole('img')).toHaveAccessibleName(/100.0%/);
  view.rerender(<APIBudgetSummary billing={{ ...billing, usedMicro: 1, pendingMicro: 0 }} />);
  expect(screen.getByRole('img')).toHaveAccessibleName(/집계된 사용액 US\$0.1 미만/);
  view.rerender(<APIBudgetSummary billing={{ ...billing, usedMicro: 9_999_999, pendingMicro: 0 }} />);
  expect(screen.getByRole('img')).toHaveAccessibleName(/남은 월 예산 US\$0.1 미만, 상한의 0.1% 미만/);
});
