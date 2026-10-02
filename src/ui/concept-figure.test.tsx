import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ConceptFigureView } from './concept-figure';
import type { ConceptFigure } from '../domain/concept-figure';
const figure: ConceptFigure = {
  label: '角と辺をつなぐ図',
  description: '선을 따라 읽고 같은 꼭짓점을 본문과 연결합니다.',
  viewBox: [0, 0, 420, 340],
  marks: [
    {
      id: 'label',
      kind: 'text',
      tone: 'ink',
      at: [210, 170],
      text: '<script>원문 기호</script>',
      anchor: 'middle',
    },
  ],
};
describe('concept figure accessibility', () => {
  it('keeps raw TeX out of the diagram accessible name', () => {
    render(<ConceptFigureView figure={{ ...figure, label: '각이 $90^\\circ$인 삼각형' }} />);
    const drawing = screen.getByRole('img');
    expect(drawing).toHaveAccessibleName('개념 도해 선을 따라 읽고 같은 꼭짓점을 본문과 연결합니다.');
    expect(drawing.querySelector('title')?.textContent).not.toContain('$');
  });
  it('renders complete math labels without SVG foreignObject and preserves geometry', () => {
    const { container } = render(
      <ConceptFigureView
        figure={{
          ...figure,
          marks: [
            {
              id: 'math',
              kind: 'text',
              tone: 'ink',
              at: [210, 170],
              anchor: 'middle',
              text: '$n_1\\sin\\theta_1=n_2\\sin\\theta_2$',
            },
          ],
        }}
      />,
    );
    expect(container.querySelector('foreignObject')).toBeNull();
    const label = container.querySelector('.concept-figure-label')!;
    expect(label.querySelectorAll('math')).toHaveLength(1);
    expect(label.querySelectorAll('math msub')).toHaveLength(4);
    expect(label.getAttribute('style')).toContain('left: 50%');
    expect(label.getAttribute('style')).toContain('top: 50%');
    expect(container.querySelector('.katex-error')).toBeNull();
  });
  it('exposes the diagram meaning and keeps imported labels as literal text', () => {
    const { container } = render(
      <>
        <ConceptFigureView figure={figure} />
        <ConceptFigureView figure={figure} />
      </>,
    );
    expect(screen.getAllByRole('img', { name: /角と辺をつなぐ図/ })).toHaveLength(2);
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('.concept-figure-label')?.textContent).toBe(
      '<script>원문 기호</script>',
    );
    const labels = Array.from(container.querySelectorAll('svg')).map((svg) =>
      svg.getAttribute('aria-labelledby'),
    );
    expect(labels[0]).not.toBe(labels[1]);
  });
});
