import { expect, it } from 'vitest';
import { emptyState } from './model';
import { canvasLayoutFile, parseCanvasLayoutFile, canvasDiagramSvg } from './flow-transfer';
import { projectCanvas } from './canvas';
import { applyCommand } from './commands';
const base = {
  namespace: 'test' as const,
  userId: 'owner',
  opId: 'subject',
  at: '2026-10-01T00:00:00Z',
};
const data = applyCommand(emptyState(base.userId, base.namespace), {
  ...base,
  type: 'addSubject',
  id: 'one',
  name: '<script>원문 & "따옴표" </script>',
  scope: { kind: 'independent' },
});
const layout = {
  positions: { 'subject:one': { x: -31.25, y: 900 } },
  links: [],
  viewport: { x: 3, y: 4, zoom: 0.9 },
};
it('round trips exact layout, validates owner, missing IDs, duplicate IDs and coordinates before importing', () => {
  expect(parseCanvasLayoutFile(canvasLayoutFile(data, layout), data)).toEqual(layout);
  expect(() =>
    parseCanvasLayoutFile(canvasLayoutFile({ ...data, userId: 'other' }, layout), data),
  ).toThrow('공부 공간');
  expect(() =>
    parseCanvasLayoutFile(
      canvasLayoutFile(data, { ...layout, positions: { 'subject:missing': { x: 0, y: 0 } } }),
      data,
    ),
  ).toThrow('없는 카드 ID');
  expect(() =>
    parseCanvasLayoutFile(
      canvasLayoutFile(data, { ...layout, positions: { 'subject:one': { x: NaN, y: 0 } } }),
      data,
    ),
  ).toThrow('배치와 연결');
  expect(() => parseCanvasLayoutFile('x'.repeat(2_000_001), data)).toThrow('너무 큽니다');
  expect(data.subjects[0].name).toContain('<script>');
});
it('exports portable SVG without executing original text or truncating long Korean names', () => {
  const cards = projectCanvas(data).cards;
  cards[0].name += '아주 긴 조건과 예외'.repeat(30);
  const svg = canvasDiagramSvg(cards, layout);
  expect(svg).not.toContain('<script>');
  expect(svg).toContain('&lt;script&gt;');
  expect(svg).toContain('&amp;');
  const parsed = new DOMParser().parseFromString(svg, 'image/svg+xml');
  expect(parsed.querySelector('parsererror')).toBeNull();
  expect(parsed.querySelector('text')!.textContent).toBe(cards[0].name);
  expect(parsed.querySelector('rect')!.getAttribute('x')).toBe('-31.25');
});
