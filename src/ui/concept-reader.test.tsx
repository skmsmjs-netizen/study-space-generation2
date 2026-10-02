import { beforeEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { ConceptReader } from './concept-library';
import type { ConceptScreen } from '../domain/concept-production';
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );
  Element.prototype.scrollIntoView = vi.fn();
});
const data = { userId: 'concept-reader-repair', namespace: 'personal' as const };
const content: ConceptScreen = {
  type: '과정형',
  title: '같은 값의 두 표현',
  intro: '분수가 같은지 비교해 보세요.',
  navigation: 'steps',
  mode: 'generic',
  scenes: [
    {
      id: 'first',
      action: '$1/2$부터',
      title: '같은 값의 두 표현',
      body: '첫 값은 $\\frac{1}{2}$예요.',
      caption: '두 값은 같아요.',
      takeaway: '',
      figure: {
        label: '같은 값',
        description: '두 값은 같아요.',
        viewBox: [0, 0, 100, 50],
        marks: [
          {
            id: 'fraction',
            kind: 'text',
            tone: 'ink',
            at: [50, 25],
            anchor: 'middle',
            text: '$\\frac{1}{2}$',
          },
        ],
      },
    },
    {
      id: 'second',
      action: '$2/4$와 비교',
      title: '$\\frac{2}{4}$를 비교해요.',
      body: '분모와 분자를 함께 봐요.',
      caption: '',
      takeaway: '',
    },
  ],
};
it('keeps one lead and one figure caption while preserving scene navigation and saved position', () => {
  const { unmount } = render(
    <ConceptReader screen={content} name="분수 비교" sourceKey="repair" data={data} />,
  );
  expect(screen.getAllByText('같은 값의 두 표현')).toHaveLength(1);
  expect(screen.getAllByText('두 값은 같아요.', { selector: 'span' })).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: /^다음$/ }));
  expect(document.querySelector('.concept-stage.is-current h3 math')).not.toBeNull();
  unmount();
  render(<ConceptReader screen={content} name="분수 비교" sourceKey="repair" data={data} />);
  expect(screen.getByRole('button', { name: /^다음$/ })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: '처음부터 보기' }));
  fireEvent.click(screen.getByRole('button', { name: '현재 관찰로 이동' }));
  expect(screen.getByRole('heading', { name: '분수 비교' })).toHaveFocus();
});
it('typesets authored notation in choice labels as well as the body', () => {
  render(
    <ConceptReader
      screen={{ ...content, navigation: 'choose' }}
      name="분수 비교"
      sourceKey="choices"
      data={data}
    />,
  );
  const choices = screen.getByRole('group', { name: '사례 선택' });
  const buttons = within(choices).getAllByRole('button');
  expect(buttons.every((button) => button.querySelector('math'))).toBe(true);
  expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(buttons[1]);
  expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
});
