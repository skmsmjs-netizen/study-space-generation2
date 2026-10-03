import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useEffect } from 'react';
import { beforeEach, expect, it, vi } from 'vitest';
import { DemoRepository } from '../data/demo-repository';
import { MathExplorer } from './math-explorer';
import { DEFAULT_SCENE, readScene, type MathScene, type buildScene } from '../domain/math-explorer';
import type { StudyRepository } from '../data/repository';
import type { TemplateView } from '../domain/math-view';
import { mathDraftKey, readMathDraft, writeMathDraft } from '../data/math-explorer-draft';
import {
  templateDraftKey,
  readTemplateWorkspace,
  writeTemplateWorkspace,
} from '../data/math-template-draft';
import { defaultTemplate } from '../domain/math-templates';
import { MathTemplates } from './math-templates';
const plotInputs = vi.hoisted(
  () =>
    [] as Array<{
      scene: MathScene;
      result: ReturnType<typeof buildScene>;
      initialView?: TemplateView;
      onView?: (view: TemplateView) => void;
      viewRevision?: number;
    }>,
);
const rendererEffects = vi.hoisted(() => [] as string[]);
vi.mock('./math-explorer-plot', () => ({
  MathExplorerPlot: (props: (typeof plotInputs)[number]) => {
    plotInputs.push(props);
    useEffect(() => {
      rendererEffects.push('setup');
      return () => {
        rendererEffects.push('cleanup');
      };
    }, []);
    return <div>격리된 그래프</div>;
  },
}));
vi.mock('./math-geogebra', () => ({ MathGeoGebra: () => <div>격리된 GeoGebra 그래프</div> }));
vi.mock('./math-template-plot', () => ({ MathTemplatePlot: () => <div>격리된 내용 그래프</div> }));
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  plotInputs.length = 0;
  rendererEffects.length = 0;
});
function open(repo: StudyRepository) {
  return render(<MathExplorer data={repo.getSnapshot()} repository={repo} onSaved={() => {}} />);
}
it('resets only the view while retaining exact controls, source formula and notes', async () => {
  const repo = new DemoRepository(localStorage);
  const key = mathDraftKey(repo.getSnapshot());
  const stored = {
    ...DEFAULT_SCENE,
    renderer: 'plotly' as const,
    a: Math.PI,
    position: 0.37,
    notes: '  원문과 조건\n그대로  ',
  };
  writeMathDraft(key, stored);
  open(repo);
  await screen.findByText('격리된 그래프');
  const revision = plotInputs.at(-1)?.viewRevision ?? 0;
  const reset = screen.getByRole('button', { name: '보기 초기화' });
  expect(reset).toHaveAccessibleDescription(/시야만/);
  fireEvent.click(reset);
  expect(plotInputs.at(-1)?.viewRevision).toBe(revision + 1);
  expect(readMathDraft(key)).toEqual(stored);
  expect(screen.getByLabelText('관찰·메모 (선택)')).toHaveValue(stored.notes);
});
it('keeps question, formula, conditions and source available in both views and preserves unfinished numeric input on return', async () => {
  const repo = new DemoRepository(localStorage),
    data = repo.getSnapshot();
  const key = templateDraftKey(data);
  const entry = {
    ...defaultTemplate('surface'),
    question: '기준점에서 x와 y의 변화가 곡면에 어떻게 대응하는가?',
    conditions: ['두 좌표는 같은 길이 단위입니다.'],
    sections: [{ id: 'observe', title: '관찰 근거', body: 'x를 고정하고 y의 변화를 비교합니다.' }],
    source: { title: '합성 검증 원문', reference: '조건 1' },
    notes: '  개인 메모\n조건·예외  ',
  };
  const other = defaultTemplate('function');
  writeTemplateWorkspace(key, { version: 1, active: entry.id, entries: [entry, other] });
  render(<MathTemplates data={data} repository={repo} onSaved={() => {}} />);
  const dialog = await screen.findByRole('dialog');
  expect(within(dialog).getByRole('region', { name: '살펴볼 질문과 수식' })).toHaveTextContent(
    entry.question,
  );
  expect(within(dialog).getByText(entry.conditions[0])).toBeVisible();
  expect(within(dialog).getByText(entry.sections[0].body)).toBeVisible();
  expect(within(dialog).getByRole('note', { name: '관찰 내용의 출처' })).toHaveTextContent(
    entry.source.title,
  );
  expect(dialog.querySelector('[data-observation-region="question"] .katex')).not.toBeNull();
  const input = within(dialog).getByLabelText('a 값');
  fireEvent.change(input, { target: { value: '1+' } });
  fireEvent.blur(input);
  expect(within(dialog).getByRole('alert')).toHaveTextContent('수치식');
  fireEvent.click(within(dialog).getByRole('button', { name: /전체 화면 닫기$/ }));
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(screen.getByRole('textbox', { name: 'a 값', exact: true })).toHaveValue('1+');
  expect(screen.getByRole('region', { name: '살펴볼 질문과 수식' })).toHaveTextContent(
    entry.conditions[0],
  );
  fireEvent.click(screen.getByRole('button', { name: '전체 화면으로 살펴보기' }));
  const reopened = screen.getByRole('dialog');
  expect(within(reopened).getByLabelText('a 값')).toHaveValue('1+');
  fireEvent.change(within(reopened).getByLabelText('전체 화면의 내용'), {
    target: { value: other.id },
  });
  expect(within(screen.getByRole('dialog')).getByLabelText('a 값')).toHaveValue('1.00');
  fireEvent.change(within(screen.getByRole('dialog')).getByLabelText('전체 화면의 내용'), {
    target: { value: entry.id },
  });
  expect(within(screen.getByRole('dialog')).getByLabelText('a 값')).toHaveValue('1+');
  expect(readTemplateWorkspace(key).entries).toEqual([entry, other]);
});
it('keeps out-of-range numbers visibly uncommitted across view changes and saves only corrected values', async () => {
  const repo = new DemoRepository(localStorage),
    data = repo.getSnapshot();
  const key = templateDraftKey(data);
  const entry = defaultTemplate('surface');
  entry.parameters[0].value = 3;
  entry.cursor.x = 0.5;
  entry.notes = '  오류 뒤에도 원문 보존\n조건·예외  ';
  writeTemplateWorkspace(key, { version: 1, active: entry.id, entries: [entry] });
  render(<MathTemplates data={data} repository={repo} onSaved={() => {}} />);
  await screen.findByRole('dialog');
  for (const label of ['a 값', 'x 위치 값']) {
    const before = readTemplateWorkspace(key);
    const input = within(screen.getByRole('dialog')).getByLabelText(label);
    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.blur(input);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(/입력해 주세요/);
    expect(readTemplateWorkspace(key)).toEqual(before);
    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: /전체 화면 닫기$/ }),
    );
    expect(screen.getByRole('textbox', { name: label, exact: true })).toHaveValue('99');
    expect(screen.getByRole('textbox', { name: label, exact: true })).toHaveAttribute('aria-invalid', 'true');
    fireEvent.click(screen.getByRole('button', { name: '전체 화면으로 살펴보기' }));
    const reopened = within(screen.getByRole('dialog')).getByLabelText(label);
    expect(reopened).toHaveValue('99');
    expect(reopened).toHaveAttribute('aria-invalid', 'true');
    fireEvent.blur(reopened);
    expect(reopened).toHaveAttribute('aria-invalid', 'true');
    expect(readTemplateWorkspace(key)).toEqual(before);
    fireEvent.change(reopened, { target: { value: 'sqrt(2)' } });
    fireEvent.keyDown(reopened, { key: 'Enter' });
    expect(within(screen.getByRole('dialog')).getByLabelText(label)).not.toHaveAttribute(
      'aria-invalid',
      'true',
    );
    const accepted = readTemplateWorkspace(key).entries[0];
    expect(label === 'a 값' ? accepted.parameters[0].value : accepted.cursor.x).toBe(Math.SQRT2);
    expect(accepted.notes).toBe(entry.notes);
  }
});
it('pauses only the renderer while keeping unfinished numeric input, notes, A comparison and view state on tool return', async () => {
  const repo = new DemoRepository(localStorage),
    data = repo.getSnapshot(),
    key = mathDraftKey(data);
  const view: TemplateView = {
    camera: { eye: { x: 3, y: 2, z: 1 } },
    ranges: { x: [-4, 4], y: [-6, 6] },
  };
  writeMathDraft(key, {
    ...DEFAULT_SCENE,
    renderer: 'plotly',
    notes: '  보존할 관찰\n조건·예외',
    view,
  });
  const rendered = render(<MathExplorer data={data} repository={repo} onSaved={() => {}} />);
  await screen.findByText('격리된 그래프');
  fireEvent.click(screen.getByRole('button', { name: '현재 조건을 A로 고정' }));
  const input = screen.getByRole('textbox', { name: 'a 값' });
  fireEvent.change(input, { target: { value: '1+' } });
  fireEvent.blur(input);
  const setups = rendererEffects.filter((value) => value === 'setup').length;
  rendered.rerender(
    <MathExplorer data={data} repository={repo} onSaved={() => {}} active={false} />,
  );
  await waitFor(() => expect(screen.getByText('격리된 그래프')).not.toBeVisible());
  expect(rendererEffects.at(-1)).toBe('cleanup');
  expect(input).toHaveValue('1+');
  rendered.rerender(<MathExplorer data={data} repository={repo} onSaved={() => {}} active />);
  await waitFor(() => expect(screen.getByText('격리된 그래프')).toBeVisible());
  expect(rendererEffects.filter((value) => value === 'setup')).toHaveLength(setups + 1);
  expect(input).toHaveValue('1+');
  expect(screen.getByLabelText('관찰·메모 (선택)')).toHaveValue('  보존할 관찰\n조건·예외');
  expect(screen.getByRole('row', { name: '매개값 a 2 2' })).toBeInTheDocument();
  expect(readMathDraft(key)?.view).toEqual(view);
  expect(plotInputs.at(-1)?.initialView).toEqual(view);
});
it('persists Plotly focus and its return camera without recalculating geometry or losing the other renderer state', async () => {
  const repo = new DemoRepository(localStorage);
  const key = mathDraftKey(repo.getSnapshot());
  const focus: TemplateView = {
    camera: { eye: { x: 0.2, y: -0.1, z: 0.3 }, center: { x: 0.4, y: 0.5, z: 0.6 } },
    pointFocus: { returnCamera: { eye: { x: 1.5, y: -1.2, z: 1.1 } } },
  };
  const stored: MathScene = {
    ...DEFAULT_SCENE,
    renderer: 'plotly',
    title: '시점 복귀 확인',
    notes: '  원문\n조건·예외  ',
    geogebra: { sourceKey: 'previous-native-scene', xml: '<geogebra>원본</geogebra>' },
  };
  writeMathDraft(key, stored);
  const opened = open(repo);
  await screen.findByText('격리된 그래프');
  const before = plotInputs.at(-1);
  if (!before) throw Error('그래프의 저장 연결이 준비되지 않았습니다.');
  act(() => before.onView?.(focus));
  expect(readMathDraft(key)).toEqual({ ...stored, view: focus });
  expect(plotInputs.at(-1)?.scene).toBe(before.scene);
  expect(plotInputs.at(-1)?.result).toBe(before.result);
  fireEvent.click(screen.getByRole('button', { name: '수식과 메모 저장' }));
  await screen.findByText('이 기기에 저장했습니다.');
  opened.unmount();
  open(repo);
  await screen.findByText('격리된 그래프');
  expect(plotInputs.at(-1)?.initialView).toEqual(focus);
  act(() => plotInputs.at(-1)?.onView?.({ camera: { eye: { x: 3, y: 2, z: 1 } } }));
  fireEvent.click(screen.getByRole('button', { name: /^시점 복귀 확인$/ }));
  expect(plotInputs.at(-1)?.initialView).toEqual(focus);
  expect(readMathDraft(key)).toEqual({ ...stored, view: focus });
});
it('restores exact formula and notes after reopening; saves a new memo without changing study records', async () => {
  const repo = new DemoRepository(localStorage),
    before = structuredClone(repo.getSnapshot().records);
  const view = open(repo);
  fireEvent.change(screen.getByLabelText('x(t)'), { target: { value: 'a*cos(2*t)' } });
  fireEvent.change(screen.getByLabelText('관찰·메모 (선택)'), {
    target: { value: '  내 글\n조건·예외  ' },
  });
  fireEvent.change(screen.getByRole('slider', { name: '변수 a' }), { target: { value: '3' } });
  view.unmount();
  open(repo);
  expect(screen.getByLabelText('x(t)')).toHaveValue('a*cos(2*t)');
  expect(screen.getByLabelText('관찰·메모 (선택)')).toHaveValue('  내 글\n조건·예외  ');
  fireEvent.click(screen.getByRole('button', { name: '수식과 메모 저장' }));
  await waitFor(() => expect(screen.getByText('이 기기에 저장했습니다.')).toBeInTheDocument());
  const saved = new DemoRepository(localStorage).getSnapshot();
  const scene = readScene(saved.memos!.find((memo) => memo.id.startsWith('math-explorer:'))!.body)!;
  expect(scene.notes).toBe('  내 글\n조건·예외  ');
  expect(scene.a).toBe(3);
  expect(saved.records).toEqual(before);
});
it('keeps invalid formula input and displays the error', () => {
  open(new DemoRepository(localStorage));
  fireEvent.change(screen.getByLabelText('x(t)'), { target: { value: 'bad(t)' } });
  expect(screen.getByRole('alert')).toHaveTextContent('사칙연산');
  expect(screen.getByLabelText('x(t)')).toHaveValue('bad(t)');
});
it('uses actual t values and exact input, preserves the position on reopen, and rejects out-of-range values', () => {
  const repo = new DemoRepository(localStorage);
  const view = open(repo);
  const slider = screen.getByRole('slider', { name: '곡선 위 위치 t' });
  expect(Number(slider.getAttribute('max'))).toBeCloseTo(8 * Math.PI);
  fireEvent.change(slider, { target: { value: '3' } });
  expect(Number((slider as HTMLInputElement).value)).toBeCloseTo(3);
  expect(screen.getByLabelText('t 값')).toHaveValue('3.00');
  const input = screen.getByLabelText('t 값');
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: 'pi' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(Number((slider as HTMLInputElement).value)).toBeCloseTo(Math.PI);
  expect(input).toHaveValue('3.14');
  // Merely focusing/leaving a rounded readout must not replace the exact pi value.
  fireEvent.focus(input);
  fireEvent.blur(input);
  expect(Number((slider as HTMLInputElement).value)).toBe(Math.PI);
  fireEvent.change(input, { target: { value: '-1' } });
  fireEvent.blur(input);
  expect(input).toHaveValue('-1');
  expect(screen.getByRole('alert')).toHaveTextContent('사이의 값');
  expect(Number((slider as HTMLInputElement).value)).toBeCloseTo(Math.PI);
  view.unmount();
  open(repo);
  expect(
    Number((screen.getByRole('slider', { name: '곡선 위 위치 t' }) as HTMLInputElement).value),
  ).toBeCloseTo(Math.PI);
  fireEvent.click(screen.getByRole('button', { name: '구간 시작으로' }));
  expect(screen.getByLabelText('t 값')).toHaveValue('0.00');
});
it('retries an unacknowledged save with the same memo and operation', async () => {
  const repo = new DemoRepository(localStorage);
  let failed = true;
  const online: StudyRepository = {
    getSnapshot: () => repo.getSnapshot(),
    execute: (command) => repo.execute(command),
    flush: async () => {
      if (failed) throw Error('서버 연결 실패');
    },
  };
  open(online);
  fireEvent.click(screen.getByRole('button', { name: '수식과 메모 저장' }));
  await screen.findByText('서버 연결 실패');
  failed = false;
  fireEvent.click(screen.getByRole('button', { name: '수식과 메모 저장' }));
  await screen.findByText('서버에 저장했습니다.');
  expect(
    repo.getSnapshot().memos?.filter((memo) => memo.id.startsWith('math-explorer:')),
  ).toHaveLength(1);
});
