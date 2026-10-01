import { lazy, Suspense, useState } from 'react';
import type { CodeLanguage } from '../domain/model';

export interface SourceEditorProps {
  value: string;
  language: CodeLanguage;
  readOnly?: boolean;
  onChange: (value: string) => void;
  onRun: () => void;
}
const Monaco = lazy(() =>
  import('./monaco-source-editor').then((m) => ({
    default: m.MonacoSourceEditor,
  })),
);
const TouchEditor = lazy(() =>
  import('./touch-source-editor').then((m) => ({
    default: m.TouchSourceEditor,
  })),
);
export function prefersTouchCodeEditor() {
  return (
    /iPad|iPhone|iPod|Android/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && navigator.platform === 'MacIntel') ||
    (typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches)
  );
}
export function SourceEditor(props: SourceEditorProps) {
  // Choose once; keyboard attachment and rotation must not reset undo/cursor.
  const [touch] = useState(prefersTouchCodeEditor);
  return (
    <Suspense
      fallback={
        <textarea
          aria-label="소스 코드"
          className="code-loading-editor"
          value={props.value}
          readOnly={props.readOnly}
          spellCheck={false}
          autoCapitalize="off"
          onChange={(event) => props.onChange(event.target.value)}
        />
      }
    >
      {touch ? <TouchEditor {...props} /> : <Monaco {...props} />}
    </Suspense>
  );
}
