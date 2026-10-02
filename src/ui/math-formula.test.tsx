import { expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { MathFormula } from './math-formula';
it('renders one equation per row while preserving matrix and case structures', () => {
  const { container, rerender } = render(
    <MathFormula tex={String.raw`E=K+U,\quad U=\frac12kx^2,\quad |v|=v`} />,
  );
  expect(container.querySelectorAll('.math-equation-row')).toHaveLength(3);
  rerender(<MathFormula tex={String.raw`f(x)=\begin{cases}a\quad x>0\\b\quad x<0\end{cases}`} />);
  expect(container.querySelectorAll('.math-equation-row')).toHaveLength(1);
  expect(container.querySelector('.katex-error')).toBeNull();
});
