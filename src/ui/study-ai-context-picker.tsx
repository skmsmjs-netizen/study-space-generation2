import { useDeferredValue, useMemo, useState } from 'react';
import type { AppState } from '../domain/model';
import {
  appendStudyAIContext,
  studyAIContextSources,
  type StudyAIContextSource,
} from '../domain/study-ai-context';
import { Button, Checkbox, ErrorState, Input } from './index';

export function StudyAIContextPicker({
  data,
  subjectId,
  text,
  disabled,
  onApply,
}: {
  data: AppState;
  subjectId: string;
  text: string;
  disabled: boolean;
  onApply: (next: string) => Promise<void>;
}) {
  const sources = useMemo(() => studyAIContextSources(data, subjectId), [data, subjectId]);
  const [query, setQuery] = useState(''),
    [selected, setSelected] = useState<string[]>([]);
  const [limit, setLimit] = useState(30),
    [error, setError] = useState('');
  const [notice, setNotice] = useState(''),
    [applying, setApplying] = useState(false);
  const [undo, setUndo] = useState<{ before: string; after: string } | null>(null);
  const deferredQuery = useDeferredValue(query);
  const filtered = useMemo(() => {
    const needle = deferredQuery.trim().toLocaleLowerCase();
    return sources.filter(
      (row) => !needle || `${row.label}\n${row.text}`.toLocaleLowerCase().includes(needle),
    );
  }, [sources, deferredQuery]);
  const active = selected.filter((key) => sources.some((row) => row.key === key));
  async function apply(restore = false) {
    setError('');
    setNotice('');
    setApplying(true);
    try {
      if (restore && (!undo || text !== undo.after))
        throw Error(
          '가져온 뒤 필기를 수정했습니다. 현재 편집을 보존했으니 필기에서 필요한 부분만 수정해 주세요.',
        );
      const next = restore ? undo!.before : appendStudyAIContext(text, sources, active);
      if (!restore) setUndo({ before: text, after: next });
      await onApply(next);
      if (restore) setUndo(null);
      if (!restore) setSelected([]);
      setNotice(
        restore
          ? '가져오기 전 필기로 돌아왔습니다.'
          : '선택한 기록을 필기에 추가했습니다. GPT 생성은 직접 시작해 주세요.',
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : '기록을 가져오지 못했습니다. 기존 내용은 유지했습니다.',
      );
    } finally {
      setApplying(false);
    }
  }
  return (
    <details className="material-context-picker">
      <summary>기존 기록 가져오기</summary>
      <fieldset disabled={disabled || applying} className="material-fields">
        <p className="material-hint">
          이 과목의 기록과 연결되지 않은 메모·코드를 선택할 수 있습니다. 원본은 유지하고 선택한
          내용만 필기에 추가합니다.
        </p>
        <Input
          label="가져올 기록 찾기"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setLimit(30);
          }}
        />
        {!sources.length && <p>가져올 글이 없습니다. 필기에 직접 적을 수 있습니다.</p>}
        {!!sources.length && !filtered.length && <p>검색한 내용이 없습니다.</p>}
        <div className="material-context-list">
          {filtered.slice(0, limit).map((row) => (
            <article key={row.key}>
              <Checkbox
                label={row.label}
                checked={active.includes(row.key)}
                disabled={!active.includes(row.key) && active.length >= 20}
                onChange={(event) =>
                  setSelected(
                    event.target.checked
                      ? [...active, row.key]
                      : active.filter((key) => key !== row.key),
                  )
                }
              />
              <ContextPreview row={row} />
            </article>
          ))}
        </div>
        {filtered.length > limit && (
          <Button variant="quiet" onClick={() => setLimit(limit + 30)}>
            다음 기록 더 보기
          </Button>
        )}
        <p className="material-hint">
          {filtered.length}개 중 {Math.min(limit, filtered.length)}개 표시 · {active.length}개 선택
        </p>
        <div className="material-actions">
          <Button disabled={!active.length} onClick={() => void apply()}>
            선택한 기록 가져오기
          </Button>
          <Button variant="quiet" disabled={!active.length} onClick={() => setSelected([])}>
            선택 해제
          </Button>
          {undo && (
            <Button variant="quiet" onClick={() => void apply(true)}>
              마지막 가져오기 되돌리기
            </Button>
          )}
        </div>
      </fieldset>
      {error && <ErrorState message={error} />}
      {notice && <p role="status">{notice}</p>}
    </details>
  );
}

function ContextPreview({ row }: { row: StudyAIContextSource }) {
  const [open, setOpen] = useState(false);
  return (
    <details onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary>가져올 원문 확인</summary>
      {open && (
        <>
          <pre>{row.text}</pre>
          <a href={row.href}>원본 열기</a>
        </>
      )}
    </details>
  );
}
