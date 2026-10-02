import { useEffect, useRef, useState } from 'react';
import { basicSetup } from 'codemirror';
import { Compartment, EditorState, Prec } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { cpp } from '@codemirror/lang-cpp';
import { StreamLanguage, indentUnit } from '@codemirror/language';
import { csharp } from '@codemirror/legacy-modes/mode/clike';
import { python } from '@codemirror/legacy-modes/mode/python';
import { javascript } from '@codemirror/legacy-modes/mode/javascript';
import { autocompletion, snippet, snippetCompletion } from '@codemirror/autocomplete';
import {
  indentWithTab,
  indentMore,
  indentLess,
  toggleComment,
  undo,
  redo,
} from '@codemirror/commands';
import { setDiagnostics } from '@codemirror/lint';
import type { CodeLanguage } from '../domain/model';
import type { SourceEditorProps } from './source-editor';
import { CodeSyntaxStatus, useCodeSyntax } from './code-syntax-status';
import { Button, Checkbox } from './index';

const syntaxLanguage = (language: CodeLanguage) =>
  language === 'c' || language === 'cpp'
    ? cpp()
    : StreamLanguage.define(
        language === 'csharp' ? csharp : language === 'python' ? python : javascript,
      );
const mainTemplate = (language: CodeLanguage, code: string) =>
  language === 'csharp'
    ? /\bclass\s/.test(code)
      ? 'static void Main()\n{\n    ${}\n}'
      : 'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        ${}\n    }\n}'
    : 'int main(void)\n{\n    ${}\n    return 0;\n}';

export function TouchSourceEditor({
  value,
  language,
  readOnly = false,
  onChange,
  onRun,
}: SourceEditorProps) {
  const host = useRef<HTMLDivElement>(null),
    view = useRef<EditorView | null>(null);
  const callbacks = useRef({ onChange, onRun, language });
  callbacks.current = { onChange, onRun, language };
  const [tabMovesFocus, setTabMovesFocus] = useState(false);
  const [compartments] = useState(() => ({
    language: new Compartment(),
    readonly: new Compartment(),
    tab: new Compartment(),
  }));
  const syntax = useCodeSyntax(value, language);
  const initial = useRef({value, language, readOnly, compartments});
  useEffect(() => {
    const editor = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: initial.current.value,
        extensions: [
          basicSetup,
          initial.current.compartments.language.of(syntaxLanguage(initial.current.language)),
          initial.current.compartments.readonly.of([
            EditorState.readOnly.of(initial.current.readOnly),
            EditorView.editable.of(!initial.current.readOnly),
          ]),
          initial.current.compartments.tab.of(keymap.of([indentWithTab])),
          indentUnit.of('    '),
          EditorState.tabSize.of(4),
          Prec.highest(
            keymap.of([
              {
                key: 'Mod-Enter',
                run: () => {
                  callbacks.current.onRun();
                  return true;
                },
              },
            ]),
          ),
          autocompletion({
            override: [
              (context) => {
                if (!['c', 'cpp', 'csharp'].includes(callbacks.current.language)) return null;
                const word = context.matchBefore(/\w*/);
                if (!word || (!context.explicit && word.from === word.to)) return null;
                return {
                  from: word.from,
                  options: [
                    snippetCompletion(
                      mainTemplate(callbacks.current.language, context.state.doc.toString()),
                      { label: 'main', type: 'function', detail: '시작 함수' },
                    ),
                  ],
                };
              },
            ],
          }),
          EditorView.contentAttributes.of({
            'aria-label': '소스 코드',
            'aria-multiline': 'true',
            autocapitalize: 'off',
            autocorrect: 'off',
            spellcheck: 'false',
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) callbacks.current.onChange(update.state.doc.toString());
          }),
          EditorView.theme({
            '&': {
              height: '100%',
              color: 'var(--color-text)',
              backgroundColor: 'var(--color-surface)',
            },
            '.cm-scroller': {
              overflow: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--input-font-size)',
            },
            '.cm-gutters': {
              backgroundColor: 'var(--color-surface-inset)',
              color: 'var(--color-muted)',
              borderColor: 'var(--color-border)',
            },
            '.cm-content': { padding: 'var(--space-3) 0' },
            '.cm-tooltip': {
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            },
          }),
        ],
      }),
    });
    view.current = editor;
    return () => {
      view.current = null;
      editor.destroy();
    };
  }, []);
  useEffect(() => {
    view.current?.dispatch({
      effects: compartments.language.reconfigure(syntaxLanguage(language)),
    });
  }, [language, compartments]);
  useEffect(() => {
    view.current?.dispatch({
      effects: compartments.readonly.reconfigure([
        EditorState.readOnly.of(readOnly),
        EditorView.editable.of(!readOnly),
      ]),
    });
  }, [readOnly, compartments]);
  useEffect(() => {
    view.current?.dispatch({
      effects: compartments.tab.reconfigure(keymap.of(tabMovesFocus ? [] : [indentWithTab])),
    });
  }, [tabMovesFocus, compartments]);
  useEffect(() => {
    const editor = view.current;
    if (editor && editor.state.doc.toString() !== value)
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: value },
      });
  }, [value]);
  useEffect(() => {
    const editor = view.current;
    if (!editor) return;
    const doc = editor.state.doc;
    const offset = (line: number, column: number) => {
      const row = doc.line(Math.max(1, Math.min(doc.lines, line)));
      return Math.min(row.to, row.from + Math.max(0, column - 1));
    };
    editor.dispatch(
      setDiagnostics(
        editor.state,
        syntax.diagnostics.map((issue) => ({
          from: offset(issue.startLineNumber, issue.startColumn),
          to: offset(issue.endLineNumber, issue.endColumn),
          severity: 'error',
          message: issue.message,
        })),
      ),
    );
  }, [syntax.diagnostics]);
  const command = (action: (view: EditorView) => boolean) => {
    if (view.current && !readOnly) {
      action(view.current);
      view.current.focus();
    }
  };
  const insertMain = () => {
    const editor = view.current;
    if (!editor || readOnly) return;
    const selection = editor.state.selection.main;
    snippet(mainTemplate(language, editor.state.doc.toString()))(
      editor,
      null,
      selection.from,
      selection.to,
    );
    editor.focus();
  };
  return (
    <div className="code-editor-shell">
      {/* biome-ignore lint/a11y/useSemanticElements: This names a non-form control/content group; fieldset would imply a form group. */}
<div className="code-editor-hint code-touch-toolbar" role="group" aria-label="코드 편집 도구">
        <Button
          type="button"
          disabled={readOnly}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => command(indentMore)}
        >
          들여쓰기
        </Button>
        <Button
          type="button"
          disabled={readOnly}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => command(indentLess)}
        >
          내어쓰기
        </Button>
        <Button
          type="button"
          disabled={readOnly}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => command(toggleComment)}
        >
          주석
        </Button>
        <Button
          type="button"
          disabled={readOnly || !['c', 'cpp', 'csharp'].includes(language)}
          onMouseDown={(event) => event.preventDefault()}
          onClick={insertMain}
        >
          main 함수
        </Button>
        <Button
          type="button"
          disabled={readOnly}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => command(undo)}
        >
          되돌리기
        </Button>
        <Button
          type="button"
          disabled={readOnly}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => command(redo)}
        >
          다시 적용
        </Button>
        <Checkbox
          label="Tab으로 편집기 나가기"
          checked={tabMovesFocus}
          onChange={(event) => setTabMovesFocus(event.target.checked)}
        />
      </div>
      <div ref={host} className="code-touch-editor" />
      <CodeSyntaxStatus
        {...syntax}
        goTo={(issue) => {
          const editor = view.current;
          if (!editor) return;
          const row = editor.state.doc.line(
            Math.min(editor.state.doc.lines, issue.startLineNumber),
          );
          const pos = Math.min(row.to, row.from + issue.startColumn - 1);
          editor.dispatch({
            selection: { anchor: pos },
            effects: EditorView.scrollIntoView(pos, { y: 'center' }),
          });
          editor.focus();
        }}
      />
    </div>
  );
}
