import { occurrenceRows } from './list-keys';
import { useEffect, useRef, useState } from 'react';
import type { CodeLanguage } from '../domain/model';
import type { SyntaxDiagnostic } from '../data/code-syntax-parser';
import SyntaxWorker from '../data/code-syntax.worker?worker';
import { Button } from './index';

export function useCodeSyntax(value: string, language: CodeLanguage) {
  const worker = useRef<Worker | null>(null),
    id = useRef(0),
    unavailable = useRef(false);
  const [retry, setRetry] = useState(0);
  const [diagnostics, setDiagnostics] = useState<SyntaxDiagnostic[]>([]);
  const [status, setStatus] = useState<'empty' | 'checking' | 'ready' | 'unavailable'>('empty');
  // biome-ignore lint/correctness/useExhaustiveDependencies(retry): An explicit retry recreates the external resource without changing the retained draft.
  useEffect(() => {
    unavailable.current = false;
    try {
      worker.current = new SyntaxWorker();
    } catch {
      unavailable.current = true;
      setStatus('unavailable');
      return;
    }
    worker.current.onmessage = (
      event: MessageEvent<{
        id: number;
        diagnostics?: SyntaxDiagnostic[];
        unavailable?: boolean;
      }>,
    ) => {
      if (event.data.id !== id.current) return;
      unavailable.current = Boolean(event.data.unavailable);
      setDiagnostics(event.data.diagnostics ?? []);
      setStatus(event.data.unavailable ? 'unavailable' : 'ready');
    };
    worker.current.onerror = () => {
      unavailable.current = true;
      setDiagnostics([]);
      setStatus('unavailable');
    };
    return () => {
      id.current++;
      worker.current?.terminate();
      worker.current = null;
    };
  }, [retry]);
  // biome-ignore lint/correctness/useExhaustiveDependencies(retry): An explicit retry recreates the external resource without changing the retained draft.
  useEffect(() => {
    const request = ++id.current;
    setDiagnostics([]);
    setStatus(value.trim() ? (unavailable.current ? 'unavailable' : 'checking') : 'empty');
    if (!value.trim() || unavailable.current) return;
    const timer = setTimeout(() => {
      try {
        worker.current?.postMessage({ id: request, code: value, language });
      } catch {
        unavailable.current = true;
        setStatus('unavailable');
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [value, language, retry]);
  return { diagnostics, status, retry: () => setRetry((value) => value + 1) };
}
export function CodeSyntaxStatus({
  diagnostics,
  status,
  retry,
  goTo,
}: ReturnType<typeof useCodeSyntax> & {
  goTo: (issue: SyntaxDiagnostic) => void;
}) {
  return (
    <div className="code-syntax-status">
      <span role="status">
        {status === 'checking'
          ? '문법 검사 중…'
          : status === 'empty'
            ? '입력하면 자동으로 문법을 검사합니다.'
            : status === 'unavailable'
              ? '문법 검사를 불러오지 못했습니다.'
              : diagnostics.length
                ? `문법 오류 ${diagnostics.length}개`
                : '문법 오류를 찾지 못했습니다.'}
      </span>
      {status === 'unavailable' && (
        <Button variant="quiet" onClick={retry}>
          검사 다시 시도
        </Button>
      )}
      <p className="ui-hint">
        이 브라우저에서 검사합니다. 변수·타입·라이브러리 오류는 실행할 때 확인합니다.
      </p>
      {diagnostics.length > 0 && (
        <ul aria-label="문법 오류 목록">
          {occurrenceRows(diagnostics, issue => JSON.stringify(issue)).map(({value: issue, key}) => (
            <li key={key}>
              <Button variant="quiet" onClick={() => goTo(issue)}>
                {issue.startLineNumber}행 {issue.startColumn}열: {issue.message}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
