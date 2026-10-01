import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { StudyResultText } from './study-result-text';

afterEach(cleanup);

it('renders math in ordinary explanations and old escaped results without changing their source', async () => {
  const source = String.raw`설명 \(V=IR\), 표시 \[I=V/R\], 과거 \\(W=\\mathbf{F}\\cdot\\Delta\\mathbf{r}\\).`;
  const original = source;
  const { container, rerender } = render(<StudyResultText text={source} />);
  await waitFor(() => expect(container.querySelectorAll('math')).toHaveLength(3));
  expect(container.querySelectorAll('.katex-error')).toHaveLength(0);
  expect(source).toBe(original);
  rerender(<StudyResultText text={source} formula={false} />);
  expect(container.textContent).toBe(original);
  expect(container.querySelectorAll('math')).toHaveLength(0);
});

it('keeps code and generated HTML literal, and disables trusted LaTeX links', async () => {
  const tick = String.fromCharCode(96);
  const source = '<img src=x onerror=alert(1)> ' + tick + String.raw`\(code\)` + tick + String.raw` \(\href{javascript:alert(1)}{x}\)`;
  const { container } = render(<h2><StudyResultText text={source} as="span" /></h2>);
  await waitFor(() => expect(container.querySelectorAll('.katex')).toHaveLength(1));
  expect(container.querySelector('img')).toBeNull();
  expect(container.querySelector('a')).toBeNull();
  expect(container.querySelector('p')).toBeNull();
  expect(container.textContent).toContain(String.raw`\(code\)`);
});
