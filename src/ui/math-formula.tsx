import { useLayoutEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/** Shared LaTeX rendering. KaTeX includes MathML; sources remain editable. */
export function MathFormula({ tex, inline = false }: { tex: string; inline?: boolean }) {
  const host = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (host.current) katex.render(tex, host.current, {
      displayMode: !inline, throwOnError: false, trust: false, maxExpand: 1000,
    });
  }, [tex, inline]);
  return <span className={inline ? 'reasoning-inline-math' : 'math-equation'} ref={host}
    role={inline ? undefined : 'region'} aria-label={inline ? undefined : '수식 · 가로로 이동해 전체 보기'}
    tabIndex={inline ? undefined : 0} />;
}
