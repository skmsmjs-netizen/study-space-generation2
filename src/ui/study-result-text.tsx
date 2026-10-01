import { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import './study-result-text.css';

function isDisplayFormula(text: string | undefined) {
  return !!text && (text.startsWith('$$') || /^\\{1,2}\[/.test(text));
}

function Formula({ text }: { text: string }) {
  // Older generated results sometimes kept one JSON escape layer in the text.
  // Normalize only the delimited display fragment; stored/editable text stays intact.
  const source = /^\\\\[([]/.test(text) ? text.replace(/\\\\/g, '\\') : text;
  const host = useRef<HTMLSpanElement>(null);
  const display = source.startsWith('$$') || source.startsWith('\\[');
  useEffect(() => {
    let alive = true;
    void import('katex')
      .then(({ default: katex }) => {
        if (alive && host.current)
          katex.render(source.slice(2, -2), host.current, {
            throwOnError: false,
            trust: false,
            displayMode: display,
            maxExpand: 1000,
            maxSize: 10,
          });
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [source, display]);
  return (
    // A focusable noninteractive math region provides horizontal keyboard scrolling.
    // biome-ignore lint/a11y/noStaticElementInteractions: display math scrolls with arrow keys
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: display equations use role=region; inline math has no label
    <span
      className={
        display ? 'study-result-formula study-result-formula--display' : 'study-result-formula'
      }
      ref={host}
      role={display ? 'region' : undefined}
      tabIndex={display ? 0 : undefined}
      aria-label={display ? '수식 · 가로로 이동해 전체 보기' : undefined}
      onKeyDown={
        display
          ? (event) => {
              const element = event.currentTarget;
              if (event.target !== element || element.scrollWidth <= element.clientWidth) return;
              if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                element.scrollLeft +=
                  ((event.key === 'ArrowLeft' ? -1 : 1) * element.clientWidth) / 4;
              }
            }
          : undefined
      }
    >
      {text}
    </span>
  );
}
/** Only math delimiters are rendered; arbitrary generated HTML is never inserted. */
export function StudyResultText({
  text,
  formula = true,
  as: Tag = 'div',
  className,
}: {
  text: string;
  formula?: boolean;
  as?: 'p' | 'span' | 'div';
  className?: string;
}) {
  if (!formula) return <Tag className={className}>{text}</Tag>;
  return (
    <Tag
      className={['study-result-text', Tag === 'span' ? 'study-result-text--inline' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {text
        .split(
          /(```[\s\S]*?```|`[^`\n]*`|\$\$[\s\S]*?\$\$|\\{1,2}\([\s\S]*?\\{1,2}\)|\\{1,2}\[[\s\S]*?\\{1,2}\])/g,
        )
        .map((part, index, pieces) =>
          part.startsWith('$$') || /^\\{1,2}[([]/.test(part) ? (
            <Formula key={`${index}:${part}`} text={part} />
          ) : (
            <span key={`${index}:${part}`}>
              {part.startsWith('`')
                ? part
                : (isDisplayFormula(pieces[index - 1])
                    ? part.replace(/^(?:[ \t]*\r?\n)+/, '')
                    : part
                  ).replace(isDisplayFormula(pieces[index + 1]) ? /(?:\r?\n[ \t]*)+$/ : /$^/, '')}
            </span>
          ),
        )}
    </Tag>
  );
}
