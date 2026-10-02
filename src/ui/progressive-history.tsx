import { useEffect, useRef, type ReactNode } from 'react';
import type { AppState } from '../domain/model';
import { beginUiMeasure, finishUiMeasureAfterPaint } from '../data/ui-performance';
import { Button } from './index';
import { isViewPage, useViewContext } from './use-view-context';

type Props = {
  data: Pick<AppState, 'userId' | 'namespace'>;
  name: string;
  total: number;
  label: string;
  children: (limit: number) => ReactNode;
  collapsible?: boolean;
  className?: string;
};
/** Incremental DOM only; the original collection is untouched and Show all mounts every row. */
export function ProgressiveHistory({
  data,
  name,
  total,
  label,
  children,
  collapsible = false,
  className,
}: Props) {
  const [limit, setLimit] = useViewContext(data, `${name}:limit`, 40, isViewPage);
  const [open, setOpen] = useViewContext(
    data,
    `${name}:open`,
    false,
    (value): value is boolean => typeof value === 'boolean',
  );
  const measure = useRef<ReturnType<typeof beginUiMeasure> | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: The expanded limit/open state must commit before its paint is measured.
  useEffect(() => {
    if (!measure.current) return;
    const finish = measure.current;
    measure.current = null;
    return finishUiMeasureAfterPaint(finish);
  }, [limit, open]);
  const expand = (next: number) => {
    measure.current = beginUiMeasure('history-render');
    setLimit(next);
  };
  const shown = Math.min(total, Math.max(40, limit));
  const content = (
    <>
      <p className="muted">
        {total}개 중 {shown}개 표시
      </p>
      {children(shown)}
      {shown < total && (
        <div className="actions">
          <Button onClick={() => expand(Math.min(total, shown + 40))}>{label} 더 보기</Button>
          <Button variant="quiet" onClick={() => expand(total)}>
            {label} 모두 펼치기
          </Button>
        </div>
      )}
    </>
  );
  if (!collapsible)
    return (
      <section className={className} aria-label={`${label} 목록`}>
        {content}
      </section>
    );
  return (
    <details
      className={className}
      open={open}
      onToggle={(event) => {
        const next = event.currentTarget.open;
        if (next !== open) {
          if (next) measure.current = beginUiMeasure('history-render');
          setOpen(next);
        }
      }}
    >
      <summary>
        {label} {total}개
      </summary>
      {open && content}
    </details>
  );
}
