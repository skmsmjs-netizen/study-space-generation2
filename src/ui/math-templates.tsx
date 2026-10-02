import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import type { StudyRepository } from '../data/repository';
import {
  freshTemplateWorkspace,
  readTemplateWorkspace,
  templateDraftKey,
  writeTemplateWorkspace,
  type TemplateWorkspace,
} from '../data/math-template-draft';
import {
  buildTemplate,
  defaultTemplate,
  importTemplates,
  isMathTemplate,
  readTemplate,
  templateBody,
  TEMPLATE_KINDS,
  TEMPLATE_MEMO_PREFIX,
  TEMPLATE_SPECS,
  type MathTemplate,
  type TemplateKind,
} from '../domain/math-templates';
import { expression } from '../domain/math-explorer';
import { Button, ErrorState, Input, LoadingState, Modal, Select, Textarea } from './index';
import { MathFormula } from './math-formula';
import { mathPlotZoomStep } from './math-plot-touch';
import { occurrenceRows } from './list-keys';
import './math-templates.css';

const Plot = lazy(() =>
  import('./math-template-plot').then((m) => ({ default: m.MathTemplatePlot })),
);
const CurvePlot = lazy(() =>
  import('./math-explorer-plot').then((m) => ({ default: m.MathExplorerPlot })),
);
const format = (v: number) => (Math.abs(v) < 0.005 ? '0.00' : v.toFixed(2));
type NumberDraft = { value: number; text: string; dirty: boolean; error: string };
function NumberField({
  label,
  value,
  onCommit,
  drafts,
  draftKey,
}: {
  label: string;
  value: number;
  onCommit: (v: number) => void;
  drafts?: Map<string, NumberDraft>;
  draftKey?: string;
}) {
  const previous = draftKey ? drafts?.get(draftKey) : undefined;
  const restored = previous?.value === value ? previous : undefined;
  const [text, setText] = useState(restored?.text ?? format(value)),
    [dirty, setDirty] = useState(restored?.dirty ?? false),
    [error, setError] = useState(restored?.error ?? '');
  // Keep unfinished numeric expressions when this same control moves in/out of the modal.
  // A changed mathematical value invalidates the old draft instead of overriding the new value.
  useEffect(() => {
    if (draftKey) drafts?.set(draftKey, { value, text, dirty, error });
  }, [drafts, draftKey, value, text, dirty, error]);
  const commit = () => {
    if (!dirty) return;
    let value: number;
    try {
      const v = expression(text).value({});
      if (v === null || Math.abs(v) > 1e6) throw Error('range');
      value = v;
    } catch {
      setError('숫자 또는 pi를 포함한 수치식을 입력해 주세요.');
      return;
    }
    try {
      onCommit(value);
      setDirty(false);
      setError('');
    } catch (rejection) {
      // A valid number can still violate this control's domain. Keep it visibly
      // uncommitted until the user corrects it or restores the accepted value.
      setError(rejection instanceof Error ? rejection.message : '값을 적용하지 못했습니다.');
    }
  };
  return (
    <Input
      label={label}
      value={text}
      inputMode="decimal"
      error={error || undefined}
      onChange={(e) => {
        setText(e.target.value);
        setDirty(true);
        setError('');
      }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') {
          setText(format(value));
          setDirty(false);
          setError('');
        }
      }}
    />
  );
}
function download(name: string, value: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([value], { type })),
    link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function MathTemplates({
  data,
  repository,
  onSaved,
}: {
  data: AppState;
  repository: StudyRepository;
  onSaved: (data: AppState) => void;
}) {
  const key = templateDraftKey(data);
  const [initial] = useState(() => {
    try {
      return { workspace: readTemplateWorkspace(key), error: '', blocked: false };
    } catch {
      return {
        workspace: freshTemplateWorkspace(),
        error:
          '내용 초안을 읽지 못했습니다. 기존 원문은 유지했습니다. 현재 입력은 파일로 보관할 수 있습니다.',
        blocked: true,
      };
    }
  });
  const [workspace, setWorkspace] = useState(initial.workspace),
    [error, setError] = useState(initial.error),
    [status, setStatus] = useState(''),
    [busy, setBusy] = useState(false),
    [expanded, setExpanded] = useState(false),
    [alternate, setAlternate] = useState(
      initial.workspace.entries.find((e) => e.id === initial.workspace.active)?.view?.alternate ??
        false,
    ),
    [viewRevision, setViewRevision] = useState(0),
    [zoomReady, setZoomReady] = useState(false);
  const blocked = useRef(initial.blocked),
    numberDrafts = useRef(new Map<string, NumberDraft>()),
    current = useRef(workspace),
    pending = useRef<{ body: string; id: string; opId: string; at: string } | null>(null),
    zoom = useRef<((factor: number) => void) | null>(null),
    file = useRef<HTMLInputElement>(null);
  current.current = workspace;
  const item = workspace.entries.find((e) => e.id === workspace.active)!,
    spec = TEMPLATE_SPECS[item.kind];
  // Text/notes do not invalidate mathematical sampling on every keystroke.
  const geometry = useMemo(
    () => ({
      version: 1 as const,
      id: item.id,
      kind: item.kind,
      expressions: item.expressions,
      ranges: item.ranges,
      parameters: item.parameters,
      cursor: item.cursor,
      initial: item.initial,
      dataset: item.dataset,
      tex: item.tex,
      title: '',
      notes: '',
      sections: undefined,
      question: undefined,
      conditions: undefined,
      source: undefined,
    }),
    [
      item.id,
      item.kind,
      item.expressions,
      item.ranges,
      item.parameters,
      item.cursor,
      item.initial,
      item.dataset,
      item.tex,
    ],
  );
  const calculated = useMemo(() => {
    try {
      return { result: buildTemplate(geometry), error: '' };
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : '수식을 확인해 주세요.' };
    }
  }, [geometry]);
  const update = (next: TemplateWorkspace) => {
    current.current = next;
    setWorkspace(next);
    setStatus('');
    if (blocked.current) return;
    try {
      writeTemplateWorkspace(key, next);
      setError('');
    } catch {
      setError(
        '이 기기에 초안을 보관하지 못했습니다. 최신 입력은 현재 화면에 남아 있습니다. 다시 보관하거나 파일로 보관해 주세요.',
      );
    }
  };
  const change = (next: MathTemplate) =>
    update({
      ...current.current,
      entries: current.current.entries.map((e) => (e.id === item.id ? next : e)),
    });
  const activate = (id: string) => {
    setAlternate(current.current.entries.find((e) => e.id === id)?.view?.alternate ?? false);
    setViewRevision((v) => v + 1);
    update({ ...current.current, active: id });
  };
  const add = (kind: TemplateKind) => {
    if (workspace.entries.length >= 500) {
      setError('현재 내용 500개를 보관 중입니다. 파일로 내보낸 뒤 필요한 내용을 선택해 주세요.');
      return;
    }
    const fresh = { ...defaultTemplate(kind), id: `content-${crypto.randomUUID()}` };
    update({ ...workspace, active: fresh.id, entries: [...workspace.entries, fresh] });
    setAlternate(false);
  };
  const accept = (items: MathTemplate[]) => {
    const entries = [...current.current.entries];
    let copies = 0;
    let active = '';
    for (const original of items) {
      let entry = original;
      const previous = entries.find((e) => e.id === entry.id);
      if (previous) {
        if (JSON.stringify(previous) === JSON.stringify(entry)) {
          active = previous.id;
          continue;
        }
        entry = {
          ...entry,
          id: `copy-${crypto.randomUUID()}`,
          originId: entry.originId ?? entry.id,
        };
        copies++;
      }
      entries.push(entry);
      active = entry.id;
    }
    if (entries.length > 500)
      throw Error('한 공간에 내용 500개까지 보관할 수 있습니다. 파일을 나누어 주세요.');
    update({ ...current.current, entries, active });
    setAlternate(entries.find((e) => e.id === active)?.view?.alternate ?? false);
    setStatus(
      copies
        ? '기존 내용은 유지하고, 같은 ID의 변경 내용은 새 사본으로 가져왔습니다.'
        : '내용을 가져왔습니다.',
    );
  };
  const save = async () => {
    if (busy) return;
    setBusy(true);
    setStatus('');
    try {
      if (data.namespace !== 'demo' && !repository.getCapabilities?.().includes('saveMemo'))
        throw Error('기록을 저장할 수 없습니다. 다시 접속한 뒤 저장해 주세요.');
      const selected = current.current.entries.find((e) => e.id === current.current.active)!,
        body = templateBody(selected);
      if (!pending.current || pending.current.body !== body)
        pending.current = {
          body,
          id: `${TEMPLATE_MEMO_PREFIX}${crypto.randomUUID()}`,
          opId: crypto.randomUUID(),
          at: new Date().toISOString(),
        };
      const operation = pending.current,
        next = repository.execute({
          type: 'saveMemo',
          ...operation,
          ownerId: null,
          expectedVersion: 0,
          strokes: [],
          userId: data.userId,
          namespace: data.namespace,
        });
      onSaved(next);
      setStatus('이 기기에 저장했습니다.');
      if (repository.flush) {
        await repository.flush();
        setStatus('서버에 저장했습니다.');
      }
      const latest = current.current.entries.find((e) => e.id === current.current.active)!;
      if (templateBody(latest) !== body)
        setStatus('누른 시점의 내용과 메모를 저장했습니다. 이후 바뀐 내용은 다시 저장해 주세요.');
      pending.current = null;
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장하지 못했습니다. 입력은 유지했습니다.');
    } finally {
      setBusy(false);
    }
  };
  const rememberView = (view: import('../domain/math-templates').TemplateView) => {
    const latest = current.current.entries.find((e) => e.id === item.id);
    if (latest)
      update({
        ...current.current,
        entries: current.current.entries.map((e) =>
          e.id === item.id ? { ...latest, view: { ...view, alternate } } : e,
        ),
      });
  };
  const result = calculated.result,
    saved = (data.memos ?? [])
      .filter((m) => m.id.startsWith(TEMPLATE_MEMO_PREFIX) && !m.deletedAt)
      .slice()
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const hasGraph =
    result && item.kind !== 'formula' && !(item.kind === 'data' && !item.dataset?.points.length);
  const hasControls =
    item.parameters.some((p) =>
      item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source)),
    ) ||
    spec.axes.length > 0 ||
    item.initial.length > 0;
  const hasReadouts = Boolean(
    result &&
    (result.readouts.length > 0 || result.notices.length > 0 || result.legacy?.result.vectors),
  );
  const entryView = useRef({ id: '', graph: false });
  useEffect(() => {
    const previous = entryView.current;
    entryView.current = { id: item.id, graph: Boolean(hasGraph) };
    if (previous.id !== item.id) setExpanded(Boolean(hasGraph));
    else if (!previous.graph && hasGraph) setExpanded(true);
  }, [item.id, hasGraph]);
  const observationQuestion = (
    <section
      className="math-observation-question"
      data-observation-region="question"
      aria-label="살펴볼 질문과 수식"
    >
      <h3>{item.title || spec.label}</h3>
      {item.subject && <p className="muted">{item.subject}</p>}
      <p>{item.question || spec.purpose}</p>
      {item.conditions && item.conditions.length > 0 && (
        <div>
          <h4>적용 조건</h4>
          <ul>
            {occurrenceRows(item.conditions, (c) => c).map(({ value: c, key }) => (
              <li key={key}>{c}</li>
            ))}
          </ul>
        </div>
      )}
      {item.quantities && item.quantities.length > 0 && (
        <div className="math-template-table">
          <table>
            <caption>기호와 물리량·단위</caption>
            <thead>
              <tr>
                <th>기호</th>
                <th>뜻</th>
                <th>단위</th>
              </tr>
            </thead>
            <tbody>
              {occurrenceRows(item.quantities, (q) => JSON.stringify(q)).map(
                ({ value: q, key }) => (
                  <tr key={key}>
                    <td>
                      <MathFormula tex={q.symbol} inline />
                    </td>
                    <td>{q.name}</td>
                    <td>{q.unit}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
      {result &&
        occurrenceRows(result.tex, (tex) => tex).map(({ value: tex, index: i, key }) => (
          <MathFormula key={key} tex={tex} label={spec.fields[i] || '수식'} />
        ))}
    </section>
  );
  const observationReasoning = (
    <section
      className="math-observation-reasoning"
      data-observation-region="reasoning"
      aria-label="관찰의 근거와 적용 한계"
    >
      <p className="muted">{spec.limitation}</p>
      {item.sections?.map((section) => (
        <section className="math-template-section" key={section.id}>
          <h4>{section.title}</h4>
          <p>{section.body}</p>
          {section.tex && <MathFormula tex={section.tex} />}
        </section>
      ))}
      {item.source && (
        <p
          className="muted"
          data-observation-region="reference"
          role="note"
          aria-label="관찰 내용의 출처"
        >
          출처:{' '}
          {item.source.url ? (
            <a href={item.source.url} target="_blank" rel="noreferrer">
              {item.source.title}
            </a>
          ) : (
            item.source.title
          )}
          {item.source.reference && ` · ${item.source.reference}`}
          {item.source.pages && ` · ${item.source.pages}`}
        </p>
      )}
    </section>
  );
  const exploration = (
    <div className="math-template-exploration">
      {observationQuestion}
      {expanded && (error || calculated.error) && (
        <div className="math-observation-reasoning">
          <ErrorState message={error || calculated.error || ''} />
        </div>
      )}
      <section
        className="math-template-canvas"
        data-observation-region="visual"
        aria-label="수식의 그래프와 시야 조절"
        hidden={!hasGraph}
      >
        {item.kind === 'surface' && (
          <Button
            onClick={() => {
              const next = !alternate;
              setAlternate(next);
              change({ ...item, view: { ...item.view, alternate: next } });
            }}
          >
            {alternate ? '곡면 보기' : '등고선 보기'}
          </Button>
        )}
        {result &&
          item.kind !== 'formula' &&
          !(item.kind === 'data' && !item.dataset?.points.length) && (
            <Suspense fallback={<LoadingState message="내용의 그래프를 여는 중입니다." />}>
              {result.legacy ? (
                <>
                  <div className="actions">
                    <Button disabled={!zoomReady} onClick={() => zoom.current?.(mathPlotZoomStep)}>
                      ＋ 확대
                    </Button>
                    <Button
                      disabled={!zoomReady}
                      onClick={() => zoom.current?.(1 / mathPlotZoomStep)}
                    >
                      − 축소
                    </Button>
                    <Button
                      title="확대·이동·회전한 시야만 처음으로 돌아갑니다. 수식·조절값·메모는 유지합니다."
                      onClick={() => setViewRevision((v) => v + 1)}
                    >
                      보기 초기화
                    </Button>
                  </div>
                  <CurvePlot
                    key={item.id}
                    scene={result.legacy.scene}
                    result={result.legacy.result}
                    viewRevision={viewRevision}
                    zoomRef={zoom}
                    onZoomReady={setZoomReady}
                    initialView={item.view}
                    onView={rememberView}
                  />
                </>
              ) : (
                <Plot
                  key={item.id}
                  item={geometry}
                  result={result}
                  alternate={alternate}
                  initialView={item.view}
                  onView={rememberView}
                />
              )}
            </Suspense>
          )}
      </section>
      <section
        className="math-template-panel"
        data-observation-region="controls"
        aria-label="위치와 변수 조절"
        hidden={!hasControls && !hasReadouts}
      >
        <div className="math-template-controls">
          {item.parameters.map(
            (p, i) =>
              item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source)) && (
                <div className="math-template-control" key={p.symbol}>
                  <label htmlFor={`template-parameter-${p.symbol}`}>
                    {p.label} = {format(p.value)}
                  </label>
                  <input
                    id={`template-parameter-${p.symbol}`}
                    aria-label={`변수 ${p.symbol}`}
                    type="range"
                    min={p.min}
                    max={p.max}
                    step="any"
                    value={p.value}
                    onChange={(e) =>
                      change({
                        ...item,
                        parameters: item.parameters.map((q, j) =>
                          j === i ? { ...q, value: Number(e.target.value) } : q,
                        ),
                      })
                    }
                  />
                  <NumberField
                    key={`${item.id}-${p.symbol}-${p.value}`}
                    drafts={numberDrafts.current}
                    draftKey={`${item.id}:parameter:${p.symbol}`}
                    label={`${p.symbol} 값`}
                    value={p.value}
                    onCommit={(v) => {
                      if (v < p.min || v > p.max) {
                        throw Error(`${p.label}: ${p.min}부터 ${p.max} 사이로 입력해 주세요.`);
                      }
                      change({
                        ...item,
                        parameters: item.parameters.map((q, j) =>
                          j === i ? { ...q, value: v } : q,
                        ),
                      });
                    }}
                  />
                </div>
              ),
          )}
          {spec.axes.map((axis) => (
            <div className="math-template-control" key={axis}>
              <label htmlFor={`template-cursor-${axis}`}>
                {axis} 위치 = {format(item.cursor[axis])}
              </label>
              <input
                id={`template-cursor-${axis}`}
                aria-label={`${axis} 위치`}
                type="range"
                min={item.ranges[axis][0]}
                max={item.ranges[axis][1]}
                step={axis === 'n' ? 1 : 'any'}
                value={item.cursor[axis]}
                onChange={(e) =>
                  change({ ...item, cursor: { ...item.cursor, [axis]: Number(e.target.value) } })
                }
              />
              <NumberField
                key={`${item.id}-${axis}-${item.cursor[axis]}`}
                drafts={numberDrafts.current}
                draftKey={`${item.id}:cursor:${axis}`}
                label={`${axis} 위치 값`}
                value={item.cursor[axis]}
                onCommit={(v) => {
                  const [lo, hi] = item.ranges[axis];
                  if (v < lo || v > hi || (axis === 'n' && !Number.isInteger(v))) {
                    throw Error('위치는 구간 안의 값으로 입력해 주세요.');
                  }
                  change({ ...item, cursor: { ...item.cursor, [axis]: v } });
                }}
              />
            </div>
          ))}
        </div>
        {item.initial.length > 0 && (
          <div className="math-inputs">
            {item.initial.map((v, i) => (
              <NumberField
                // biome-ignore lint/suspicious/noArrayIndexKey: Fixed mathematical component slots retain editing state when their value changes.
                key={`${item.id}-initial-${i}`}
                drafts={numberDrafts.current}
                draftKey={`${item.id}:initial:${i}`}
                label={`${item.kind === 'ode' ? 'y' : ['x', 'y'][i]}(${format(item.ranges.t[0])}) 초기값`}
                value={v}
                onCommit={(value) =>
                  change({ ...item, initial: item.initial.map((n, j) => (i === j ? value : n)) })
                }
              />
            ))}
          </div>
        )}
        {result && hasReadouts && (
          <section
            className="math-template-readouts"
            data-observation-region="readout"
            aria-label="현재 관찰값"
            aria-live="polite"
          >
            <dl>
              {result.readouts.map((r) => (
                <div key={r.label}>
                  <dt>{r.label}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
            {result.notices.map((n) => (
              <p key={n}>{n}</p>
            ))}
            {result.legacy?.result.vectors && (
              <dl>
                {(['T', 'N', 'B'] as const).map((name) => {
                  const v = result.legacy!.result.vectors?.[name];
                  return v ? (
                    <div key={name}>
                      <dt>
                        <MathFormula tex={`\\mathbf{${name}}`} inline />
                      </dt>
                      <dd>({v.map(format).join(', ')})</dd>
                    </div>
                  ) : null;
                })}
              </dl>
            )}
          </section>
        )}
      </section>
      {observationReasoning}
    </div>
  );
  return (
    <section className="math-templates" aria-label="모든 과목의 수식과 내용">
      <div className="math-template-heading">
        <Select label="넣어 둔 내용" value={item.id} onChange={(e) => activate(e.target.value)}>
          {workspace.entries.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title || TEMPLATE_SPECS[e.kind].label}
            </option>
          ))}
        </Select>
        <Select label="새 내용 유형" value="" onChange={(e) => add(e.target.value as TemplateKind)}>
          <option value="" disabled>
            유형을 골라 새 내용 만들기
          </option>
          {TEMPLATE_KINDS.map((kind) => (
            <option key={kind} value={kind}>
              {TEMPLATE_SPECS[kind].label}
            </option>
          ))}
        </Select>
      </div>
      <div className="actions">
        <Button onClick={() => file.current?.click()}>내용 파일 가져오기</Button>
        <Button
          onClick={() =>
            download(
              '수식·내용 작성 형식.json',
              JSON.stringify(TEMPLATE_KINDS.map(defaultTemplate), null, 2),
            )
          }
        >
          내용 형식 파일
        </Button>
        <input
          ref={file}
          aria-label="수식 내용 JSON 파일"
          type="file"
          accept=".json,application/json"
          hidden
          onChange={async (e) => {
            const input = e.currentTarget,
              f = input.files?.[0];
            if (!f) return;
            try {
              if (f.size > 2_000_000) throw Error('내용 파일은 2MB 이내로 나누어 주세요.');
              accept(importTemplates(await f.text()));
            } catch (error) {
              setError(error instanceof Error ? error.message : '내용을 가져오지 못했습니다.');
            } finally {
              input.value = '';
            }
          }}
        />
      </div>
      {error && (
        <>
          <ErrorState message={error} />
          <div className="actions">
            <Button
              onClick={() => {
                if (blocked.current) {
                  try {
                    const restored = readTemplateWorkspace(key);
                    blocked.current = false;
                    update(restored);
                  } catch {
                    setError('기존 보관값을 아직 읽지 못했습니다. 파일로 보관해 주세요.');
                  }
                } else update(current.current);
              }}
            >
              {blocked.current ? '기존 초안 다시 읽기' : '초안 다시 보관'}
            </Button>
            <Button
              onClick={() =>
                download('수식·내용 초안.json', JSON.stringify(current.current, null, 2))
              }
            >
              현재 초안 파일로 보관
            </Button>
          </div>
        </>
      )}
      <article key={item.id}>
        {calculated.error && <ErrorState message={calculated.error} />}
        {hasGraph && <Button onClick={() => setExpanded(true)}>전체 화면으로 살펴보기</Button>}
        {!expanded && exploration}
        <Modal
          open={expanded}
          title={`${item.title || spec.label} · 전체 화면`}
          className="math-template-full math-explorer"
          onClose={() => setExpanded(false)}
        >
          <Select
            label="전체 화면의 내용"
            value={item.id}
            onChange={(e) => activate(e.target.value)}
          >
            {workspace.entries.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.title || TEMPLATE_SPECS[entry.kind].label}
              </option>
            ))}
          </Select>
          {exploration}
        </Modal>
        <details className="math-editor" open={item.kind === 'formula' || item.kind === 'data'}>
          <summary>수식·구간·내용 편집</summary>
          {spec.fields.length > 0 && <ParameterEditor item={item} onChange={change} />}
          <Input
            label="내용 제목"
            value={item.title}
            onChange={(e) => change({ ...item, title: e.target.value })}
          />
          <Input
            label="과목 (선택)"
            value={item.subject ?? ''}
            onChange={(e) => change({ ...item, subject: e.target.value })}
          />
          <Textarea
            label="살펴볼 질문 (선택)"
            className="paper-memo"
            value={item.question ?? ''}
            onChange={(e) => change({ ...item, question: e.target.value })}
          />
          {spec.fields.map((label, i) => (
            <Input
              key={label}
              label={label}
              spellCheck={false}
              value={item.expressions[i]}
              onChange={(e) =>
                change({
                  ...item,
                  expressions: item.expressions.map((s, j) => (i === j ? e.target.value : s)),
                })
              }
            />
          ))}
          {spec.axes.map((axis) => (
            <div className="math-interval" key={axis}>
              {[0, 1].map((index) => (
                <NumberField
                  key={`${axis}-${index}`}
                  label={`${axis} ${item.kind === 'function' || item.kind === 'curve' ? '슬라이더' : '구간'} ${index ? '끝' : '시작'}`}
                  value={item.ranges[axis][index]}
                  onCommit={(value) => {
                    const range = [...item.ranges[axis]] as [number, number];
                    range[index] = value;
                    change({
                      ...item,
                      ranges: { ...item.ranges, [axis]: range },
                      cursor: {
                        ...item.cursor,
                        [axis]: Math.max(range[0], Math.min(range[1], item.cursor[axis])),
                      },
                    });
                  }}
                />
              ))}
            </div>
          ))}
          {item.kind === 'formula' && (
            <Textarea
              label="LaTeX 수식 (줄마다 하나)"
              rows={4}
              value={(item.tex ?? []).join('\n')}
              onChange={(e) => change({ ...item, tex: e.target.value.split('\n').filter(Boolean) })}
            />
          )}
          {item.kind === 'data' && (
            <>
              <div className="math-inputs">
                <Input
                  label="가로축 이름·단위"
                  value={item.dataset!.xLabel}
                  onChange={(e) =>
                    change({ ...item, dataset: { ...item.dataset!, xLabel: e.target.value } })
                  }
                />
                <Input
                  label="세로축 이름·단위"
                  value={item.dataset!.yLabel}
                  onChange={(e) =>
                    change({ ...item, dataset: { ...item.dataset!, yLabel: e.target.value } })
                  }
                />
                <Select
                  label="자료 표현"
                  value={item.dataset!.style}
                  onChange={(e) =>
                    change({
                      ...item,
                      dataset: {
                        ...item.dataset!,
                        style: e.target.value as 'line' | 'scatter' | 'bar',
                      },
                    })
                  }
                >
                  <option value="scatter">점 · 관계</option>
                  <option value="line">선 · 변화</option>
                  <option value="bar">막대 · 비교</option>
                </Select>
              </div>
              <DataEditor item={item} onChange={change} />
            </>
          )}
          <p className="muted">
            계산용 식은 곱셈 *, 거듭제곱 ^, 삼각함수는 라디안을 사용합니다. 내용 파일에는
            조건·기호/단위·설명 단계·출처도 함께 넣을 수 있습니다.
          </p>
        </details>
        <Textarea
          label="관찰·메모 (선택)"
          className="paper-memo"
          rows={4}
          value={item.notes}
          onChange={(e) => change({ ...item, notes: e.target.value })}
        />
        <div className="actions">
          <Button variant="primary" busy={busy} onClick={() => void save()}>
            내용과 메모 저장
          </Button>
          <Button
            onClick={() =>
              download(`${item.title || '수식 내용'}.json`, JSON.stringify(item, null, 2))
            }
          >
            이 내용 파일로 보관
          </Button>
          <Button
            onClick={() =>
              download('모든 수식·내용 초안.json', JSON.stringify(workspace.entries, null, 2))
            }
          >
            모든 내용 파일로 보관
          </Button>
        </div>
      </article>
      <p role="status">{status}</p>
      {saved.length > 0 && (
        <div className="math-saved">
          <h3>저장한 내용</h3>
          <ul>
            {saved.map((m) => (
              <li key={m.id}>
                <Button
                  variant="quiet"
                  onClick={() => {
                    const entry = readTemplate(m.body);
                    try {
                      if (entry) accept([entry]);
                      else setError('내용 형식을 읽지 못했습니다. 메모의 원문은 유지했습니다.');
                    } catch (error) {
                      setError(
                        error instanceof Error ? error.message : '내용을 다시 열지 못했습니다.',
                      );
                    }
                  }}
                >
                  {m.body.split('\n')[0] || '수식 내용'}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
function ParameterEditor({
  item,
  onChange,
}: {
  item: MathTemplate;
  onChange: (next: MathTemplate) => void;
}) {
  const [symbol, setSymbol] = useState(''),
    [error, setError] = useState('');
  return (
    <details>
      <summary>변수와 슬라이더 범위</summary>
      {item.parameters.map((p, i) => (
        <div className="math-interval" key={p.symbol}>
          {(['min', 'max'] as const).map((edge) => (
            <NumberField
              key={`${p.symbol}-${edge}`}
              label={`${p.label} 슬라이더 ${edge === 'min' ? '시작' : '끝'}`}
              value={p[edge]}
              onCommit={(value) => {
                const next = {
                  ...item,
                  parameters: item.parameters.map((q, j) =>
                    i === j ? { ...q, [edge]: value } : q,
                  ),
                };
                if (!isMathTemplate(next)) {
                  setError('시작은 끝보다 작고, 현재 값은 범위 안에 있어야 합니다.');
                  return;
                }
                setError('');
                onChange(next);
              }}
            />
          ))}
        </div>
      ))}
      <Input
        label="추가할 변수 이름"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="예: c, k, m"
      />
      <Button
        onClick={() => {
          const next = {
            ...item,
            parameters: [
              ...item.parameters,
              { symbol: symbol.trim(), label: symbol.trim(), min: -10, max: 10, value: 1 },
            ],
          };
          if (!isMathTemplate(next)) {
            setError(
              '계산 변수와 겹치지 않는 영문 변수 이름을 넣어 주세요. 변수는 12개 이내입니다.',
            );
            return;
          }
          setError('');
          setSymbol('');
          onChange(next);
        }}
      >
        변수 추가
      </Button>
      {error && <ErrorState message={error} />}
    </details>
  );
}
function DataEditor({
  item,
  onChange,
}: {
  item: MathTemplate;
  onChange: (v: MathTemplate) => void;
}) {
  const text = item.datasetInput ?? item.dataset!.points.map((p) => p.join(', ')).join('\n');
  const [error, setError] = useState('');
  return (
    <>
      <Textarea
        label="제공한 값 (한 줄에 x, y)"
        rows={6}
        value={text}
        onChange={(e) => {
          onChange({ ...item, datasetInput: e.target.value });
          setError('');
        }}
      />
      {error && <ErrorState message={error} />}
      <Button
        onClick={() => {
          try {
            const points = text
              .split('\n')
              .filter((s) => s.trim())
              .map((s) => {
                const v = s.split(',').map((s) => Number(s.trim()));
                if (
                  v.length !== 2 ||
                  s.split(',').some((s) => !s.trim()) ||
                  v.some((n) => !Number.isFinite(n) || Math.abs(n) > 1e6)
                )
                  throw Error('각 줄에 두 숫자를 쉼표로 구분해 주세요.');
                return v as [number, number];
              });
            if (points.length > 10000) throw Error('한 번에 10000값 이내로 넣어 주세요.');
            onChange({ ...item, dataset: { ...item.dataset!, points } });
            setError('');
          } catch (e) {
            setError(e instanceof Error ? e.message : '값을 확인해 주세요.');
          }
        }}
      >
        값을 그래프에 반영
      </Button>
    </>
  );
}
