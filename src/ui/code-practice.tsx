import { useEffect, useRef, useState } from 'react';
import { Button, EmptyState, ErrorState, Input, Select, Textarea } from './index';
import type {
  AppState,
  CodeExample,
  CodeExampleContent,
  CodeLanguage,
  Command,
} from '../domain/model';
import {
  CODE_LANGUAGES,
  CODE_STARTERS,
  codeContent,
  currentCodeRun,
  sameCodeContent,
} from '../domain/code-example';
import type { StudyRepository } from '../data/repository';
import {
  clearCodeDraft,
  codeDraftKey,
  readCodeDraft,
  retainCodeDraft,
  writeCodeDraft,
  type CodeExampleDraft,
} from '../data/code-example-draft';
import { archiveDamagedDraft, draftHasUnstoredText } from '../data/draft-safety';
import { executeCode, type CodeExecution } from '../data/code-runner';
import { SourceEditor } from './source-editor';
import { navigate } from './navigation-context';
import './code-practice.css';

type Props = {
  data: AppState;
  repository: StudyRepository;
  onSaved: (data: AppState) => void;
  exampleId?: string;
  trash?: boolean;
};
const context = (data: AppState) => ({
  opId: crypto.randomUUID(),
  at: new Date().toISOString(),
  userId: data.userId,
  namespace: data.namespace,
});
const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : '저장하지 못했습니다. 입력은 유지했습니다.';
const canSave = (repo: StudyRepository, data: AppState) =>
  data.namespace === 'demo' || repo.getCapabilities?.().includes('saveCodeExample');

export function CodePractice({ data, repository, onSaved, exampleId, trash = false }: Props) {
  const [error, setError] = useState('');
  const examples = (data.codeExamples ?? [])
    .filter((row) => Boolean(row.deletedAt) === trash)
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const selected = examples.find((row) => row.id === exampleId);
  const commit = (
    action:
      | Omit<Extract<Command, { type: 'saveCodeExample' }>, 'opId' | 'at' | 'userId' | 'namespace'>
      | { type: 'trashCodeExample' | 'restoreCodeExample'; id: string; expectedVersion: number },
  ) => {
    try {
      if (!canSave(repository, data))
        throw Error(
          '코드 예제를 저장할 수 없습니다. 입력한 내용은 유지했습니다. 다시 접속한 뒤 저장해 주세요.',
        );
      const next = repository.execute({ ...action, ...context(data) });
      onSaved(next);
      setError('');
      return next;
    } catch (e) {
      setError(errorMessage(e));
      return null;
    }
  };
  const add = () => {
    const id = crypto.randomUUID();
    if (
      commit({
        type: 'saveCodeExample',
        id,
        expectedVersion: 0,
        content: { title: '', language: 'c', code: '', stdin: '', notes: '' },
      })
    )
      navigate(`/code/${id}`);
  };
  return (
    <section className="code-practice" aria-label={trash ? '휴지통의 코드 예제' : '코딩 연습'}>
      <div className="section-heading">
        <div>
          <h2>{trash ? '코드 예제' : '코드를 쓰고, 결과를 확인해 보세요'}</h2>
          {!trash && (
            <p className="muted">예제마다 제목과 설명을 남기고 다시 실행할 수 있습니다.</p>
          )}
        </div>
        {!trash && <Button onClick={add}>예제 추가</Button>}
      </div>
      {error && <ErrorState message={error} />}
      {!trash && !canSave(repository, data) && (
        <p role="alert">
          코드 예제를 저장할 수 없습니다. 다시 접속해 주세요. 저장한 예제는 계속 확인할 수 있습니다.
        </p>
      )}
      {selected && !trash ? (
        <CodeExampleEditor
          key={selected.id}
          example={selected}
          data={data}
          repository={repository}
          onSaved={onSaved}
          onCopied={(id) => navigate(`/code/${id}`)}
          onTrash={() => {
            const row = repository
              .getSnapshot()
              .codeExamples?.find((item) => item.id === selected.id);
            if (
              row &&
              commit({ type: 'trashCodeExample', id: row.id, expectedVersion: row.version })
            )
              navigate('/code');
          }}
        />
      ) : (
        <>
          {!examples.length && (
            <EmptyState
              title={trash ? '휴지통에 코드 예제가 없습니다' : '첫 예제부터 시작해 보세요'}
              message={
                trash
                  ? undefined
                  : 'C·C++·C#·Python·JavaScript를 선택할 수 있습니다. 설명은 나중에 적어도 됩니다.'
              }
            />
          )}
          {!trash && exampleId && !selected && (
            <ErrorState message="이 코드 예제를 찾을 수 없습니다. 휴지통에 있는지 확인해 주세요." />
          )}
          <ul className="code-example-list">
            {examples.map((row) => (
              <li key={row.id}>
                <div>
                  <a href={`#/code/${encodeURIComponent(row.id)}`}>
                    {row.title || '제목 없는 예제'}
                  </a>
                  <span className="muted">{CODE_LANGUAGES[row.language]}</span>
                </div>
                {row.notes && <p className="code-note-preview">{row.notes}</p>}
                {trash && (
                  <Button
                    onClick={() =>
                      commit({
                        type: 'restoreCodeExample',
                        id: row.id,
                        expectedVersion: row.version,
                      })
                    }
                  >
                    예제 복원
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export function CodeExampleEditor({
  example,
  data,
  repository,
  onSaved,
  onCopied,
  onTrash,
}: {
  example: CodeExample;
  data: AppState;
  repository: StudyRepository;
  onSaved: Props['onSaved'];
  onCopied: (id: string) => void;
  onTrash: () => void;
}) {
  const key = codeDraftKey(data, example.id);
  const [initial] = useState(() => {
    try {
      const draft = readCodeDraft(key, example.id);
      const conflict =
        draft && draft.baseVersion !== example.version && !sameCodeContent(draft.content, example)
          ? draft
          : null;
      return {
        content: codeContent(conflict ? example : (draft?.content ?? example)),
        conflict,
        error: '',
        blocked: Boolean(conflict),
      };
    } catch (e) {
      return {
        content: codeContent(example),
        conflict: null as CodeExampleDraft | null,
        error: errorMessage(e),
        blocked: true,
      };
    }
  });
  const [content, setContent] = useState(initial.content),
    current = useRef(content),
    saved = useRef(codeContent(example));
  const version = useRef(example.version),
    blocked = useRef(initial.blocked),
    [isBlocked, setBlocked] = useState(initial.blocked);
  const [error, setError] = useState(initial.error),
    [status, setStatus] = useState(
      sameCodeContent(initial.content, example) ? '이 기기에 저장됨' : '초안에서 이어 쓰는 중',
    );
  const [conflict, setConflict] = useState(initial.conflict);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'running'>('idle');
  const run = useRef<CodeExecution | null>(null),
    alive = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callback = useRef(onSaved);
  callback.current = onSaved;
  const draft = (): CodeExampleDraft => ({
    id: example.id,
    baseVersion: version.current,
    content: current.current,
  });
  const saveDraft = () => {
    try {
      writeCodeDraft(key, draft());
      return true;
    } catch {
      setError(
        '초안을 저장하지 못했습니다. 입력은 현재 창에 있습니다. 파일로 보관하거나 저장을 다시 시도해 주세요.',
      );
      return false;
    }
  };
  const flush = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (blocked.current) return false;
    if (sameCodeContent(current.current, saved.current)) return true;
    saveDraft();
    try {
      if (!canSave(repository, data))
        throw Error('개인 공간의 코드 저장 연결이 필요합니다. 초안은 이 기기에 보관했습니다.');
      const next = repository.execute({
        type: 'saveCodeExample',
        id: example.id,
        expectedVersion: version.current,
        content: current.current,
        ...context(data),
      });
      const row = next.codeExamples!.find((item) => item.id === example.id)!;
      saved.current = codeContent(row);
      version.current = row.version;
      callback.current(next);
      setStatus('이 기기에 저장됨');
      setError('');
      try {
        clearCodeDraft(key);
      } catch {
        setError('예제는 저장했습니다. 초안 정리가 남아 있습니다.');
      }
      return true;
    } catch (e) {
      setStatus('저장 다시 필요');
      setError(
        `${errorMessage(e)} ${draftHasUnstoredText(key) ? '최신 입력은 현재 창에만 있습니다.' : '초안은 이 기기에 보관했습니다.'}`,
      );
      return false;
    }
  };
  const update = (next: CodeExampleContent) => {
    current.current = next;
    setContent(next);
    setStatus('저장 중…');
    retainCodeDraft(key, draft());
    saveDraft();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 800);
  };
  const flushRef = useRef(flush);
  flushRef.current = flush;
  useEffect(() => {
    alive.current = true;
    const save = () => flushRef.current();
    const unload = (event: BeforeUnloadEvent) => {
      if (!save() && !sameCodeContent(current.current, saved.current)) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('pagehide', save);
    window.addEventListener('beforeunload', unload);
    if (!sameCodeContent(current.current, saved.current) && !blocked.current)
      timer.current = setTimeout(save, 800);
    return () => {
      alive.current = false;
      run.current?.cancel();
      save();
      window.removeEventListener('pagehide', save);
      window.removeEventListener('beforeunload', unload);
    };
  }, []);
  useEffect(() => {
    if (example.version === version.current) return;
    if (!sameCodeContent(current.current, saved.current)) {
      const local = { id: example.id, baseVersion: version.current, content: current.current };
      retainCodeDraft(key, local);
      try {
        writeCodeDraft(key, local);
      } catch {
        /* The exact draft is retained in memory for export. */
      }
      blocked.current = true;
      setBlocked(true);
      setConflict(local);
      setError(
        '다른 곳에서 예제가 바뀌었습니다. 작성 중인 초안과 저장된 예제를 모두 보존했습니다.',
      );
    }
    version.current = example.version;
    saved.current = codeContent(example);
    current.current = codeContent(example);
    setContent(current.current);
  }, [example, key]);
  const start = () => {
    if (run.current || blocked.current) return;
    const source = {
      language: current.current.language,
      code: current.current.code,
      stdin: current.current.stdin,
    };
    const execution = executeCode(source, setPhase, repository.getCodeRunner?.());
    run.current = execution;
    void execution.result.then((result) => {
      run.current = null;
      if (!alive.current) return;
      setPhase('idle');
      update({ ...current.current, lastRun: result });
      flushRef.current();
    });
  };
  const copy = (source = current.current) => {
    try {
      const id = crypto.randomUUID();
      const next = repository.execute({
        type: 'saveCodeExample',
        id,
        expectedVersion: 0,
        content: { ...source, title: source.title ? `${source.title} · 사본` : '예제 사본' },
        ...context(data),
      });
      callback.current(next);
      if (conflict) {
        archiveDamagedDraft(key, '코드 예제 충돌 초안을 별도 예제로 보관');
        clearCodeDraft(key);
      }
      onCopied(id);
    } catch (e) {
      setError(errorMessage(e));
    }
  };
  const exportFile = () => {
    const snapshot = repository.getSnapshot();
    const raw = JSON.stringify(
      {
        format: 'study-space-code-example',
        version: 1,
        example: snapshot.codeExamples?.find((row) => row.id === example.id),
        draft: draft(),
        conflict,
        revisions: snapshot.revisions.filter(
          (row) => row.collection === 'codeExamples' && row.entityId === example.id,
        ),
      },
      null,
      2,
    );
    const url = URL.createObjectURL(new Blob([raw], { type: 'application/json;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `code-${example.id}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };
  const lastRun = content.lastRun;
  return (
    <article className="code-example-editor">
      <a href="#/code">← 예제 목록</a>
      <div className="code-example-heading">
        <Input
          label="예제 제목"
          placeholder="예: 두 수의 합 구하기"
          value={content.title}
          disabled={isBlocked}
          onChange={(event) => update({ ...current.current, title: event.target.value })}
          data-editing-context={`code:${example.id}:title`}
        />
        <Select
          label="언어"
          value={content.language}
          disabled={isBlocked || phase !== 'idle'}
          onChange={(event) =>
            update({ ...current.current, language: event.target.value as CodeLanguage })
          }
        >
          {Object.entries(CODE_LANGUAGES).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>
      </div>
      <div className="code-toolbar">
        <span className="ui-label">소스 코드</span>
        <Button
          variant="quiet"
          disabled={isBlocked || Boolean(content.code.trim())}
          onClick={() => update({ ...current.current, code: CODE_STARTERS[content.language] })}
        >
          시작 코드 넣기
        </Button>
      </div>
      <SourceEditor
        value={content.code}
        language={content.language}
        readOnly={isBlocked}
        onChange={(code) => update({ ...current.current, code })}
        onRun={start}
      />
      <details className="code-input-details" open={content.stdin ? true : undefined}>
        <summary>실행에 사용할 입력값</summary>
        <Textarea
          label="입력값"
          rows={3}
          value={content.stdin}
          disabled={isBlocked}
          hint="scanf·cin·Console.ReadLine·input에 전달할 값을 줄마다 입력하세요. JavaScript는 readline()을 사용합니다."
          onChange={(event) => update({ ...current.current, stdin: event.target.value })}
          data-editing-context={`code:${example.id}:stdin`}
        />
      </details>
      <div className="code-run-actions">
        <Button variant="primary" onClick={start} disabled={isBlocked || phase !== 'idle'}>
          {phase === 'loading' ? '실행 준비 중…' : phase === 'running' ? '실행 중…' : '실행'}
        </Button>
        {phase !== 'idle' && (
          <Button onClick={() => run.current?.cancel()}>
            {repository.getCodeRunner?.() && ['c', 'cpp', 'csharp'].includes(content.language)
              ? '응답 대기 중지'
              : '중지'}
          </Button>
        )}
        <span role="status">
          {phase === 'loading'
            ? ['c', 'cpp', 'csharp'].includes(content.language)
              ? '컴파일하고 있습니다.'
              : '실행 환경을 여는 중입니다.'
            : phase === 'running'
              ? '결과를 기다리고 있습니다.'
              : lastRun
                ? { success: '실행 완료', error: '오류를 확인해 주세요', stopped: '실행 중지' }[
                    lastRun.outcome
                  ]
                : '값을 바꿔 실행해 보세요.'}
        </span>
      </div>
      {repository.getCodeRunner?.() && ['c', 'cpp', 'csharp'].includes(content.language) && (
        <p className="ui-hint">
          실행하면 코드와 입력값을 Wandbox 컴파일 서비스에 전달합니다. 제목·설명은 전달하지
          않습니다.
        </p>
      )}
      <section className="code-result" aria-label="실행 결과">
        <h3>실행 결과</h3>
        {lastRun && !currentCodeRun(content) && (
          <p className="code-stale-result">
            코드·언어·입력값이 바뀌었습니다. 아래는 이전 실행 결과입니다.
          </p>
        )}
        <pre>
          {lastRun
            ? lastRun.output || (lastRun.outcome === 'success' ? '출력한 내용이 없습니다.' : '')
            : '아직 실행하지 않았습니다.'}
        </pre>
        {lastRun?.error && (
          <pre className="code-error" role="alert">
            {lastRun.error}
          </pre>
        )}
      </section>
      <Textarea
        label="내용·설명"
        placeholder="어떤 코드인지, 왜 이렇게 동작하는지, 바꿔 본 값이나 남은 의문을 자유롭게 적어 보세요."
        rows={6}
        value={content.notes}
        disabled={isBlocked}
        onChange={(event) => update({ ...current.current, notes: event.target.value })}
        data-editing-context={`code:${example.id}:notes`}
      />
      {error && <p role="alert">{error}</p>}
      {conflict && (
        <div className="code-conflict">
          <h3>따로 보존한 초안</h3>
          <pre>{JSON.stringify(conflict.content, null, 2)}</pre>
          <Button onClick={() => copy(conflict.content)}>초안을 별도 예제로 보관</Button>
        </div>
      )}
      {isBlocked && !conflict && (
        <Button
          onClick={() => {
            try {
              archiveDamagedDraft(key, '코드 예제 초안 읽기 실패');
              clearCodeDraft(key);
              blocked.current = false;
              setBlocked(false);
              setError('초안 원문을 보관했습니다. 저장된 예제를 편집할 수 있습니다.');
            } catch (e) {
              setError(errorMessage(e));
            }
          }}
        >
          초안 원문 보관 후 편집
        </Button>
      )}
      <footer className="code-save-bar">
        <span role="status">{isBlocked ? '초안 확인 필요' : status}</span>
        <div className="actions">
          <Button variant="quiet" onClick={exportFile}>
            파일로 보관
          </Button>
          <Button onClick={flush} disabled={isBlocked}>
            지금 저장
          </Button>
          <Button onClick={() => copy()} disabled={isBlocked || phase !== 'idle'}>
            사본 만들기
          </Button>
          <Button
            variant="quiet"
            disabled={isBlocked || phase !== 'idle'}
            onClick={() => {
              if (flush()) onTrash();
            }}
          >
            휴지통으로 이동
          </Button>
        </div>
      </footer>
      <p className="ui-hint">실행은 공부 완료나 정답 판정으로 기록하지 않습니다.</p>
    </article>
  );
}
