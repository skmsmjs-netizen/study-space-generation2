import { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';

function Formula({ text }: { text: string }) {
  // Older generated results sometimes kept one JSON escape layer in the text.
  // Normalize only the delimited display fragment; stored/editable text stays intact.
  const source = /^\\\\[([]/.test(text) ? text.replace(/\\\\/g, '\\') : text;
  const host = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let alive = true;
    void import('katex')
      .then(({ default: katex }) => {
        if (alive && host.current)
          katex.render(source.slice(2, -2), host.current, {
            throwOnError: false,
            trust: false,
            displayMode: source.startsWith('$$') || source.startsWith('\\['),
            maxExpand: 1000,
          });
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [source]);
  return <span ref={host}>{text}</span>;
}
/** Only math delimiters are rendered; arbitrary generated HTML is never inserted. */
export function StudyResultText({ text, formula = true, as: Tag = 'p', className }: {
  text: string; formula?: boolean; as?: 'p' | 'span'; className?: string;
}) {
  if (!formula) return <Tag className={className}>{text}</Tag>;
  return (
    <Tag className={className}>
      {text
        .split(/(```[\s\S]*?```|`[^`\n]*`|\$\$[\s\S]*?\$\$|\\{1,2}\([\s\S]*?\\{1,2}\)|\\{1,2}\[[\s\S]*?\\{1,2}\])/g)
        .map((part, index) =>
          part.startsWith('$$') || /^\\{1,2}[([]/.test(part) ? (
            <Formula key={`${index}:${part}`} text={part} />
          ) : (
            <span key={`${index}:${part}`}>{part}</span>
          ),
        )}
    </Tag>
  );
}
