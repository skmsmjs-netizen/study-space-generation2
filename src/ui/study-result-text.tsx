import { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';

function Formula({ text }: { text: string }) {
  const host = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let alive = true;
    void import('katex')
      .then(({ default: katex }) => {
        if (alive && host.current)
          katex.render(text.slice(2, -2), host.current, {
            throwOnError: false,
            trust: false,
            displayMode: text.startsWith('$$'),
            maxExpand: 1000,
          });
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [text]);
  return <span ref={host}>{text}</span>;
}
/** Only math delimiters are rendered; arbitrary generated HTML is never inserted. */
export function StudyResultText({ text, formula = false }: { text: string; formula?: boolean }) {
  if (!formula) return <p>{text}</p>;
  return (
    <p>
      {text
        .split(/(\$\$[\s\S]*?\$\$|\\\([\s\S]*?\\\))/g)
        .map((part, index) =>
          part.startsWith('$$') || part.startsWith('\\(') ? (
            <Formula key={`${index}:${part}`} text={part} />
          ) : (
            <span key={`${index}:${part}`}>{part}</span>
          ),
        )}
    </p>
  );
}
