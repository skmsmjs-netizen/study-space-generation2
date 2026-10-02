// biome-ignore-all lint/a11y/noNoninteractiveTabindex: Wide equations are keyboard-scrollable regions.
import { useLayoutEffect, useRef } from 'react';
import katex from 'katex';
import { equationLines } from '../interactive/math-physics/presentation.mjs';
import 'katex/dist/katex.min.css';

/** Shared LaTeX rendering. KaTeX includes MathML; sources remain editable. */
export function MathFormula({
  tex,
  inline = false,
  label = '수식',
}: {
  tex: string;
  inline?: boolean;
  label?: string;
}) {
  const host = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (host.current) {
      if (inline)
        katex.render(tex, host.current, {
          displayMode: !inline,
          throwOnError: false,
          trust: false,
          maxExpand: 1000,
        });
      else
        host.current.replaceChildren(
          ...equationLines(tex).map((line) => {
            const row = document.createElement('div');
            row.className = 'math-equation-row';
            katex.render(line, row, {
              displayMode: true,
              throwOnError: false,
              trust: false,
              maxExpand: 1000,
            });
            return row;
          }),
        );
    }
  }, [tex, inline]);
  return inline ? (
    <span className="reasoning-inline-math" ref={host} />
  ) : (
    <section
      className="math-equation"
      ref={host}
      aria-label={label + ' · 가로로 이동해 전체 보기'}
      tabIndex={0}
    />
  );
}
