import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { clearUiPerformance, readUiPerformance, recordUiMeasure } from '../data/ui-performance';
import {
  clearRequestPerformance,
  readRequestPerformance,
  recordRequestPerformance,
} from '../data/request-performance';
import { UiPerformancePanel } from './ui-performance-panel';

beforeEach(() => {
  clearUiPerformance();
  clearRequestPerformance();
});
it('refreshes and clears only the bounded local diagnostics, retaining study storage', () => {
  localStorage.setItem('unrelated-original', '  원문\n ');
  recordUiMeasure('search-results', 24);
  recordRequestPerformance('local-command', performance.now(), true);
  render(<UiPerformancePanel />);
  expect(screen.getByText('검색 → 결과 표시').parentElement).toHaveTextContent(
    '1회 · 완료 1회 · 중앙 24ms',
  );
  fireEvent.click(screen.getByRole('button', { name: '측정값 새로고침' }));
  expect(screen.getByRole('status')).toHaveTextContent('최근 측정값을 불러왔습니다');
  fireEvent.click(screen.getByRole('button', { name: '측정값 비우기' }));
  expect(readUiPerformance()).toEqual([]);
  expect(readRequestPerformance()).toEqual([]);
  expect(localStorage.getItem('unrelated-original')).toBe('  원문\n ');
});
it('retains metrics and offers an accurate message if the requested local download fails', () => {
  recordUiMeasure('input-paint', 5);
  const create = vi.fn(() => {
    throw new Error('unavailable');
  });
  vi.stubGlobal('URL', { createObjectURL: create });
  try {
    render(<UiPerformancePanel />);
    fireEvent.click(screen.getByRole('button', { name: '측정값 JSON 내려받기' }));
    expect(create).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toHaveTextContent(
      '파일을 만들지 못했습니다. 측정값은 이 창에 남아 있습니다.',
    );
    expect(readUiPerformance()).toHaveLength(1);
  } finally {
    vi.unstubAllGlobals();
  }
});
