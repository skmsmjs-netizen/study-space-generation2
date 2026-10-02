import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, expect, it } from 'vitest';
import { IntegralReasoning } from './integral-reasoning';
import { readReasoningView, writeReasoningView } from '../data/integral-reasoning-view';
const key = 'study-space:demo:integral-reasoning:view:v1';
function Reader() {
  const [view, setView] = useState(() => readReasoningView(key));
  return (
    <IntegralReasoning
      view={view}
      onChange={(next) => {
        writeReasoningView(key, next);
        setView(next);
      }}
    />
  );
}
function step(title: string) {
  return screen.getByText(title, { selector: 'strong' }).closest('button')!;
}
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
it('opens the appropriate recovery branch, retains each reading location and restores it', () => {
  const rendered = render(<Reader />);
  fireEvent.click(step('이상적분은 수렴하는가?'));
  expect(screen.getByLabelText('비교 구간의 끝')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('살펴볼 급수'), { target: { value: 'alternating' } });
  expect(step('이상적분은 수렴하는가?')).toBeDisabled();
  fireEvent.click(step('양항급수인가?'));
  fireEvent.click(screen.getByText('절댓값 급수로 확인', { selector: 'button' }));
  fireEvent.click(step('원래 질문으로 돌아간다'));
  expect(screen.getByText(/원래 교대급수는 절대수렴/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('살펴볼 급수'), { target: { value: 'log-square' } });
  expect(screen.getByLabelText('비교 구간의 끝')).toBeInTheDocument();
  rendered.unmount();
  render(<Reader />);
  expect(screen.getByLabelText('비교 구간의 끝')).toBeInTheDocument();
}, 15000);
it('stops when a condition is unconfirmed and permits resuming without replacing it with false', () => {
  render(<Reader />);
  fireEvent.click(step('연속인가?'));
  fireEvent.click(screen.getByText('이 조건을 아직 확인하지 못했다면?', { selector: 'button' }));
  expect(step('감소하는가?')).toBeDisabled();
  expect(screen.getByText('판정을 보류한다')).toBeInTheDocument();
  fireEvent.click(screen.getByText('근거를 확인하고 이어 보기', { selector: 'button' }));
  expect(step('감소하는가?')).toBeEnabled();
  expect(document.querySelector('.katex-error')).toBeNull();
  expect(document.querySelector('math')).not.toBeNull();
});
