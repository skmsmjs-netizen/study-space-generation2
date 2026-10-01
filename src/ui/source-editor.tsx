import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor/editor/editor.api';
import 'monaco-editor/editor/contrib/bracketMatching/browser/bracketMatching';
import 'monaco-editor/editor/contrib/format/browser/formatActions';
import 'monaco-editor/editor/contrib/suggest/browser/suggestController';
import 'monaco-editor/editor/contrib/snippet/browser/snippetController2';
import 'monaco-editor/editor/contrib/comment/browser/comment';
import 'monaco-editor/editor/contrib/find/browser/findController';
import 'monaco-editor/editor/contrib/folding/browser/folding';
import 'monaco-editor/editor/contrib/hover/browser/hoverContribution';
import 'monaco-editor/editor/contrib/clipboard/browser/clipboard';
import 'monaco-editor/languages/definitions/cpp/register';
import 'monaco-editor/languages/definitions/csharp/register';
import 'monaco-editor/languages/definitions/python/register';
import 'monaco-editor/languages/definitions/javascript/register';
import EditorWorker from 'monaco-editor/editor/editor.worker?worker';
import type { CodeLanguage } from '../domain/model';
import type { SyntaxDiagnostic } from '../data/code-syntax-parser';
import SyntaxWorker from '../data/code-syntax.worker?worker';

self.MonacoEnvironment = { getWorker: () => new EditorWorker() };
const languageId = (language: CodeLanguage) => (language === 'c' ? 'cpp' : language);
for (const language of ['cpp', 'csharp']) {
  monaco.languages.registerCompletionItemProvider(language, {
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: [
          {
            label: 'main',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText:
              language === 'cpp'
                ? 'int main(void)\n{\n    ${1}\n    return 0;\n}'
                : /\bclass\s/.test(model.getValue())
                  ? 'static void Main()\n{\n    ${1}\n}'
                  : 'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        ${1}\n    }\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: '시작 함수',
            range,
          },
        ],
      };
    },
  });
}
export function SourceEditor({
  value,
  language,
  readOnly = false,
  onChange,
  onRun,
}: {
  value: string;
  language: CodeLanguage;
  readOnly?: boolean;
  onChange: (value: string) => void;
  onRun: () => void;
}) {
  const host = useRef<HTMLDivElement>(null),
    editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const callbacks = useRef({ onChange, onRun });
  callbacks.current = { onChange, onRun };
  const [tabMovesFocus, setTabMovesFocus] = useState(false);
  const checker = useRef<Worker | null>(null), checkId = useRef(0);
  const [syntax, setSyntax] = useState<'empty' | 'checking' | 'ready' | 'unavailable'>('empty');
  const [diagnostics, setDiagnostics] = useState<SyntaxDiagnostic[]>([]);
  const [retry, setRetry] = useState(0);
  const initial = useRef({ value, language, readOnly });
  useEffect(() => {
    if (!host.current) return;
    const { value, language, readOnly } = initial.current;
    const instance = monaco.editor.create(host.current, {
      value,
      language: languageId(language),
      ariaLabel: '소스 코드',
      automaticLayout: true,
      fontSize: 16,
      fontFamily: 'ui-monospace, SFMono-Regular, monospace',
      tabSize: 4,
      insertSpaces: true,
      autoIndent: 'full',
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoSurround: 'languageDefined',
      bracketPairColorization: { enabled: true },
      minimap: { enabled: false },
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      wordWrap: 'off',
      readOnly,
      fixedOverflowWidgets: true,
      accessibilitySupport: 'on',
      editContext: false,
      quickSuggestions: true,
      snippetSuggestions: 'top',
      tabCompletion: 'on',
    });
    editor.current = instance;
    const change = instance.onDidChangeModelContent(() =>
      callbacks.current.onChange(instance.getValue()),
    );
    const action = instance.addAction({
      id: 'study-run-code',
      label: '코드 실행',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => callbacks.current.onRun(),
    });
    const applyTheme = () => {
      const dark =
        document.documentElement.dataset.theme === 'dark' ||
        (!document.documentElement.dataset.theme &&
          matchMedia('(prefers-color-scheme: dark)').matches);
      monaco.editor.setTheme(dark ? 'vs-dark' : 'vs');
    };
    applyTheme();
    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    const media = matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', applyTheme);
    return () => {
      change.dispose();
      action.dispose();
      observer.disconnect();
      media.removeEventListener('change', applyTheme);
      instance.getModel()?.dispose();
      instance.dispose();
      editor.current = null;
    };
    // The model owns native undo/redo and cursor while this example is open.
  }, []);
  useEffect(() => {
    const model = editor.current?.getModel();
    if (model && model.getLanguageId() !== languageId(language))
      monaco.editor.setModelLanguage(model, languageId(language));
  }, [language]);
  useEffect(() => {
    editor.current?.updateOptions({ readOnly });
  }, [readOnly]);
  useEffect(() => {
    const model = editor.current?.getModel();
    if (model && editor.current && editor.current.getValue() !== value)
      editor.current.executeEdits('restore', [{ range: model.getFullModelRange(), text: value }]);
  }, [value]);
  useEffect(() => {
    const worker = new SyntaxWorker();
    checker.current = worker;
    worker.onmessage = (event: MessageEvent<{ id: number; diagnostics?: SyntaxDiagnostic[]; unavailable?: boolean }>) => {
      if (event.data.id !== checkId.current) return;
      const model = editor.current?.getModel();
      if (!model) return;
      const issues = event.data.diagnostics ?? [];
      setDiagnostics(issues);
      setSyntax(event.data.unavailable ? 'unavailable' : 'ready');
      monaco.editor.setModelMarkers(model, 'study-syntax', issues.map(issue => ({
        ...issue, severity: monaco.MarkerSeverity.Error, source: '문법 검사',
      })));
    };
    worker.onerror = () => { setSyntax('unavailable'); };
    return () => { checker.current = null; worker.terminate(); };
  }, [retry]);
  useEffect(() => {
    const id = ++checkId.current;
    const model = editor.current?.getModel();
    if (model) monaco.editor.setModelMarkers(model, 'study-syntax', []);
    setDiagnostics([]);
    setSyntax(value.trim() ? 'checking' : 'empty');
    if (!value.trim()) return;
    const timer = setTimeout(() => checker.current?.postMessage({ id, code: value, language }), 350);
    return () => clearTimeout(timer);
  }, [value, language, retry]);
  return (
    <div className="code-editor-shell">
      <div className="code-editor-hint">
        <span>Tab 들여쓰기 · ⌘/Ctrl + / 주석 · ⌘/Ctrl + Enter 실행</span>
        <label>
          <input
            type="checkbox"
            checked={tabMovesFocus}
            onChange={(event) => {
              setTabMovesFocus(event.target.checked);
              editor.current?.updateOptions({ tabFocusMode: event.target.checked });
            }}
          />
          Tab으로 편집기 나가기
        </label>
      </div>
      <div ref={host} className="code-monaco" />
      <div className="code-syntax-status">
        <span role="status">
          {syntax === 'checking' ? '문법 검사 중…' : syntax === 'empty' ? '입력하면 자동으로 문법을 검사합니다.' : syntax === 'unavailable' ? '문법 검사를 불러오지 못했습니다.' : diagnostics.length ? `문법 오류 ${diagnostics.length}개` : '문법 오류를 찾지 못했습니다.'}
        </span>
        {syntax === 'unavailable' && <button type="button" onClick={() => setRetry(value => value + 1)}>검사 다시 시도</button>}
        <p className="ui-hint">이 브라우저에서 검사합니다. 변수·타입·라이브러리 오류는 실행할 때 확인합니다.</p>
        {diagnostics.length > 0 && <ul aria-label="문법 오류 목록">{diagnostics.map((issue, index) => (
          <li key={index}><button type="button" onClick={() => {
            const instance = editor.current;
            instance?.setPosition({ lineNumber: issue.startLineNumber, column: issue.startColumn });
            instance?.revealLineInCenter(issue.startLineNumber);
            instance?.focus();
          }}>{issue.startLineNumber}행 {issue.startColumn}열: {issue.message}</button></li>
        ))}</ul>}
      </div>
    </div>
  );
}
