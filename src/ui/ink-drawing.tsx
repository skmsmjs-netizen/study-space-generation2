import { memo, useMemo } from 'react';
import { inkShape } from '../domain/ink-appearance';
export { inkShape } from '../domain/ink-appearance';
import type { MemoStroke } from '../domain/model';
import { MEMO_HEIGHT, MEMO_WIDTH } from '../domain/memo';
import { inkPageCount, strokePage } from '../domain/ink-editing';
export const inkColors = {
  ink: 'var(--color-text)',
  blue: 'var(--color-hierarchy-outline)',
  green: 'var(--color-memo-green)',
};
export const InkStroke = memo(function InkStroke({ stroke }: { stroke: MemoStroke }) {
  const d = useMemo(() => inkShape(stroke), [stroke]);
  return (
    <path
      d={d}
      stroke={stroke.pressureSensitive ? 'none' : inkColors[stroke.ink]}
      fill={stroke.pressureSensitive ? inkColors[stroke.ink] : 'none'}
      strokeWidth={stroke.width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
});
export function InkDrawing({ strokes, page = 0 }: { strokes: MemoStroke[]; page?: number }) {
  return (
    <>
      {strokes
        .filter((s) => strokePage(s) === page)
        .map((s) => (
          <InkStroke key={s.id} stroke={s} />
        ))}
    </>
  );
}
/** Paged read-only rendering also keeps old, single-page answers unchanged. */
export function InkPreview({
  strokes,
  label,
  className = 'memory-ink',
}: {
  strokes: MemoStroke[];
  label: string;
  className?: string;
}) {
  const pages = useMemo(
    () => [...new Set(strokes.map(strokePage))].sort((a, b) => a - b),
    [strokes],
  );
  return (
    <>
      {pages.map((page) => (
        <svg
          key={page}
          className={className}
          viewBox={`0 0 ${MEMO_WIDTH} ${MEMO_HEIGHT}`}
          role="img"
          aria-label={inkPageCount(strokes) > 1 ? `${label} · ${page + 1}쪽` : label}
        >
          <InkDrawing strokes={strokes} page={page} />
        </svg>
      ))}
    </>
  );
}
