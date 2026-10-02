import { parse, type MathNode } from 'mathjs';
import { isTemplateView, type TemplateView } from './math-view';
export { isTemplateView, type TemplateView } from './math-view';
import { buildScene, DEFAULT_SCENE, FUNCTIONS, type Vec3 } from './math-explorer';

export type TemplateKind =
  | 'function'
  | 'curve'
  | 'surface'
  | 'parametric-surface'
  | 'implicit'
  | 'implicit3d'
  | 'field'
  | 'field3d'
  | 'ode'
  | 'ode-system'
  | 'matrix'
  | 'sequence'
  | 'formula'
  | 'data';
export interface MathTemplate {
  version: 1;
  id: string;
  kind: TemplateKind;
  title: string;
  expressions: string[];
  ranges: Record<string, [number, number]>;
  parameters: Array<{ symbol: string; label: string; min: number; max: number; value: number }>;
  cursor: Record<string, number>;
  initial: number[];
  notes: string;
  originId?: string;
  view?: TemplateView;
  datasetInput?: string;
  source?: { title: string; url?: string; reference?: string; pages?: string };
  subject?: string;
  question?: string;
  conditions?: string[];
  quantities?: Array<{ symbol: string; name: string; unit: string }>;
  sections?: Array<{ id: string; title: string; body: string; tex?: string }>;
  tex?: string[];
  dataset?: {
    xLabel: string;
    yLabel: string;
    style: 'line' | 'scatter' | 'bar';
    points: Array<[number, number]>;
  };
}
type Spec = {
  label: string;
  fields: string[];
  variables: string[];
  axes: string[];
  purpose: string;
  limitation: string;
};
export const TEMPLATE_SPECS: Record<TemplateKind, Spec> = {
  formula: {
    label: '정의·법칙·증명·유도',
    fields: [],
    variables: [],
    axes: [],
    purpose: '질문·조건·수식·유도 단계를 함께 읽기',
    limitation:
      '조건과 증명의 근거를 읽는 틀입니다. 글만으로 성립·정확성을 자동 판정하지 않습니다.',
  },
  data: {
    label: '자료·관측값',
    fields: [],
    variables: [],
    axes: [],
    purpose: '제공한 값과 축·단위를 그래프로 비교',
    limitation: '제공된 값만 표시하며 누락값·분모·관측 의미를 추정하지 않습니다.',
  },
  function: {
    label: '함수',
    fields: ['y(x)'],
    variables: ['x'],
    axes: ['x'],
    purpose: 'x에 따른 함수값과 현재 점',
    limitation: '유한 표본으로 연속성이나 모든 근을 증명하지 않습니다.',
  },
  curve: {
    label: '매개곡선 · T·N·B',
    fields: ['x(t)', 'y(t)', 'z(t)'],
    variables: ['t'],
    axes: ['t'],
    purpose: '매개변수에 따른 공간 위치와 세 방향',
    limitation: '속도·곡률이 0인 점의 정의되지 않는 벡터는 생략합니다.',
  },
  surface: {
    label: '곡면 · 등고선',
    fields: ['z(x,y)'],
    variables: ['x', 'y'],
    axes: ['x', 'y'],
    purpose: '두 변수에 따른 높이와 같은 높이의 선',
    limitation: '표본 사이의 아주 좁은 변화는 놓칠 수 있습니다.',
  },
  'parametric-surface': {
    label: '매개곡면',
    fields: ['x(u,v)', 'y(u,v)', 'z(u,v)'],
    variables: ['u', 'v'],
    axes: ['u', 'v'],
    purpose: '두 매개변수에 따른 공간 위치',
    limitation: '입력한 두 매개변수 구간 안의 표면을 표시합니다.',
  },
  implicit: {
    label: '음함수 · 평면',
    fields: ['F(x,y) = 0의 왼쪽'],
    variables: ['x', 'y'],
    axes: ['x', 'y'],
    purpose: 'F(x,y)=0을 만족하는 위치',
    limitation: '격자에서 부호가 바뀌지 않는 접촉근·작은 성분은 놓칠 수 있습니다.',
  },
  implicit3d: {
    label: '음함수 · 공간',
    fields: ['F(x,y,z) = 0의 왼쪽'],
    variables: ['x', 'y', 'z'],
    axes: ['x', 'y', 'z'],
    purpose: 'F(x,y,z)=0의 등위면',
    limitation: '격자 근사이며 작은 성분·접촉근을 모두 찾는 해법은 아닙니다.',
  },
  field: {
    label: '벡터장 · 평면',
    fields: ['Fₓ(x,y)', 'Fᵧ(x,y)'],
    variables: ['x', 'y'],
    axes: ['x', 'y'],
    purpose: '각 위치의 방향과 현재 점의 실제 벡터 크기',
    limitation: '화살표 길이는 읽기 위해 정규화합니다. 실제 크기는 수치로 확인하세요.',
  },
  field3d: {
    label: '벡터장 · 공간',
    fields: ['Fₓ(x,y,z)', 'Fᵧ(x,y,z)', 'F𝓏(x,y,z)'],
    variables: ['x', 'y', 'z'],
    axes: ['x', 'y', 'z'],
    purpose: '공간 위치별 방향과 실제 성분',
    limitation: '방향 표시를 정규화하며 발산·회전을 자동 판정하지 않습니다.',
  },
  ode: {
    label: '미분방정식 · 초기값',
    fields: ['dy/dt ='],
    variables: ['t', 'y'],
    axes: ['t'],
    purpose: '초기값을 바꿀 때 해 y(t)가 어떻게 달라지는가',
    limitation: 'RK4 수치 근사입니다. 강직한 문제·특이점에서는 정확성을 보장하지 않습니다.',
  },
  'ode-system': {
    label: '연립 미분방정식 · 위상',
    fields: ['dx/dt =', 'dy/dt ='],
    variables: ['t', 'x', 'y'],
    axes: ['t'],
    purpose: '초기 위치에서 출발하는 위상 궤적과 시간별 상태',
    limitation: 'RK4 수치 근사이며 궤적 모양으로 안정성을 증명하지 않습니다.',
  },
  matrix: {
    label: '행렬 · 평면 변환',
    fields: ['A₁₁', 'A₁₂', 'A₂₁', 'A₂₂'],
    variables: [],
    axes: ['x', 'y'],
    purpose: '같은 점·격자가 선형변환 전후에 어디로 이동하는가',
    limitation: '2×2 실수 행렬의 평면 변환을 다룹니다.',
  },
  sequence: {
    label: '수열 · 유한 부분합',
    fields: ['a(n)'],
    variables: ['n'],
    axes: ['n'],
    purpose: '선택한 항과 유한 부분합',
    limitation: '유한 항의 그래프를 무한급수의 수렴 증명으로 처리하지 않습니다.',
  },
};
export const TEMPLATE_KINDS = Object.keys(TEMPLATE_SPECS) as TemplateKind[];
export const TEMPLATE_MEMO_PREFIX = 'math-template:';
const defaults: Record<
  TemplateKind,
  { expressions: string[]; ranges: MathTemplate['ranges']; initial?: number[] }
> = {
  formula: { expressions: [], ranges: {} },
  data: { expressions: [], ranges: {} },
  function: { expressions: ['a*sin(b*x)'], ranges: { x: [-6, 6] } },
  curve: { expressions: ['a*cos(t)', 'a*sin(t)', 'b*t'], ranges: { t: [0, 8 * Math.PI] } },
  surface: { expressions: ['a*(x^2-y^2)'], ranges: { x: [-3, 3], y: [-3, 3] } },
  'parametric-surface': {
    expressions: ['(a+b*cos(v))*cos(u)', '(a+b*cos(v))*sin(u)', 'b*sin(v)'],
    ranges: { u: [0, 2 * Math.PI], v: [0, 2 * Math.PI] },
  },
  implicit: { expressions: ['x^2+y^2-a^2'], ranges: { x: [-3, 3], y: [-3, 3] } },
  implicit3d: { expressions: ['x^2+y^2+z^2-a^2'], ranges: { x: [-3, 3], y: [-3, 3], z: [-3, 3] } },
  field: { expressions: ['-a*y', 'a*x'], ranges: { x: [-3, 3], y: [-3, 3] } },
  field3d: { expressions: ['-y', 'x', 'b'], ranges: { x: [-3, 3], y: [-3, 3], z: [-3, 3] } },
  ode: { expressions: ['a*y*(1-y/b)'], ranges: { t: [0, 8] }, initial: [0.2] },
  'ode-system': { expressions: ['y', '-a*x-b*y'], ranges: { t: [0, 16] }, initial: [1, 0] },
  matrix: { expressions: ['a', '-b', 'b', 'a'], ranges: { x: [-3, 3], y: [-3, 3] } },
  sequence: { expressions: ['1/n^a'], ranges: { n: [1, 100] } },
};
export function defaultTemplate(kind: TemplateKind): MathTemplate {
  const settings = structuredClone(defaults[kind]);
  return {
    version: 1,
    id: `builtin-${kind}`,
    kind,
    title: TEMPLATE_SPECS[kind].label,
    ...settings,
    initial: settings.initial ?? [],
    notes: '',
    ...(kind === 'formula'
      ? {
          question: '조건을 확인하며 식의 각 항과 연결을 읽어보세요.',
          tex: [],
          conditions: [],
          sections: [],
        }
      : {}),
    ...(kind === 'data'
      ? { dataset: { xLabel: 'x', yLabel: 'y', style: 'scatter' as const, points: [] } }
      : {}),
    cursor: Object.fromEntries(
      Object.entries(settings.ranges).map(([key, [lo, hi]]) => [
        key,
        key === 'n' ? lo : (lo + hi) / 2,
      ]),
    ),
    parameters:
      kind === 'formula' || kind === 'data'
        ? []
        : [
            {
              symbol: 'a',
              label: 'a',
              min: -10,
              max: 10,
              value: kind === 'curve' || kind === 'implicit' || kind === 'implicit3d' ? 2 : 1,
            },
            {
              symbol: 'b',
              label: 'b',
              min: -10,
              max: 10,
              value: kind === 'curve' || kind === 'parametric-surface' ? 0.5 : 1,
            },
          ],
  };
}
const finite = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v) && Math.abs(v) <= 1e6;
export function isMathTemplate(value: unknown): value is MathTemplate {
  if (!value || typeof value !== 'object') return false;
  const v = value as MathTemplate;
  if (!Object.hasOwn(TEMPLATE_SPECS, v.kind)) return false;
  const spec = TEMPLATE_SPECS[v.kind];
  if (
    !spec ||
    v.version !== 1 ||
    typeof v.id !== 'string' ||
    !/^[A-Za-z0-9_-]{1,100}$/.test(v.id) ||
    typeof v.title !== 'string' ||
    v.title.length > 1000 ||
    typeof v.notes !== 'string' ||
    v.notes.length > 100000 ||
    !Array.isArray(v.expressions) ||
    v.expressions.length !== spec.fields.length ||
    v.expressions.some((s) => typeof s !== 'string' || s.length > 500) ||
    !v.ranges ||
    !v.cursor ||
    !Array.isArray(v.initial) ||
    !v.initial.every(finite) ||
    v.initial.length !== (v.kind === 'ode' ? 1 : v.kind === 'ode-system' ? 2 : 0) ||
    !Array.isArray(v.parameters) ||
    v.parameters.length > 12
  )
    return false;
  if (
    !spec.axes.every(
      (key) =>
        Array.isArray(v.ranges[key]) &&
        v.ranges[key].length === 2 &&
        v.ranges[key].every(finite) &&
        finite(v.cursor[key]),
    )
  )
    return false;
  const names = new Set<string>();
  for (const p of v.parameters) {
    if (
      !p ||
      typeof p.symbol !== 'string' ||
      !/^[a-zA-Z][a-zA-Z0-9_]{0,15}$/.test(p.symbol) ||
      [
        'x',
        'y',
        'z',
        'u',
        'v',
        't',
        'n',
        'pi',
        'e',
        '__proto__',
        'constructor',
        'prototype',
        'toString',
        'valueOf',
        'Infinity',
        'NaN',
        'i',
      ].includes(p.symbol) ||
      FUNCTIONS.has(p.symbol) ||
      names.has(p.symbol) ||
      typeof p.label !== 'string' ||
      p.label.length > 100 ||
      ![p.min, p.max, p.value].every(finite) ||
      !(p.min < p.max) ||
      p.value < p.min ||
      p.value > p.max
    )
      return false;
    names.add(p.symbol);
  }
  if (v.view !== undefined && !isTemplateView(v.view)) return false;
  if (
    v.datasetInput !== undefined &&
    (typeof v.datasetInput !== 'string' || v.datasetInput.length > 500000)
  )
    return false;
  if (v.originId !== undefined && typeof v.originId !== 'string') return false;
  if (
    v.source &&
    (typeof v.source.title !== 'string' ||
      (v.source.url !== undefined &&
        (typeof v.source.url !== 'string' || !/^https:\/\//.test(v.source.url))) ||
      (v.source.reference !== undefined && typeof v.source.reference !== 'string') ||
      (v.source.pages !== undefined && typeof v.source.pages !== 'string'))
  )
    return false;
  for (const field of ['subject', 'question'] as const)
    if (v[field] !== undefined && (typeof v[field] !== 'string' || v[field]!.length > 20000))
      return false;
  if (
    v.tex !== undefined &&
    (!Array.isArray(v.tex) ||
      v.tex.length > 100 ||
      v.tex.some((s) => typeof s !== 'string' || s.length > 5000))
  )
    return false;
  if (
    v.conditions !== undefined &&
    (!Array.isArray(v.conditions) ||
      v.conditions.length > 100 ||
      v.conditions.some((s) => typeof s !== 'string' || s.length > 5000))
  )
    return false;
  if (
    v.quantities !== undefined &&
    (!Array.isArray(v.quantities) ||
      v.quantities.length > 100 ||
      v.quantities.some(
        (q) =>
          !q ||
          ['symbol', 'name', 'unit'].some(
            (k) =>
              typeof q[k as keyof typeof q] !== 'string' || q[k as keyof typeof q].length > 1000,
          ),
      ))
  )
    return false;
  if (
    v.sections !== undefined &&
    (!Array.isArray(v.sections) ||
      v.sections.length > 100 ||
      new Set(v.sections.map((s) => s?.id)).size !== v.sections.length ||
      v.sections.some(
        (s) =>
          !s ||
          ['id', 'title', 'body'].some(
            (k) =>
              typeof s[k as 'id' | 'title' | 'body'] !== 'string' ||
              s[k as 'id' | 'title' | 'body'].length > 20000,
          ) ||
          (s.tex !== undefined && (typeof s.tex !== 'string' || s.tex.length > 5000)),
      ))
  )
    return false;
  if (
    v.kind === 'data' &&
    (!v.dataset ||
      !['line', 'scatter', 'bar'].includes(v.dataset.style) ||
      typeof v.dataset.xLabel !== 'string' ||
      typeof v.dataset.yLabel !== 'string' ||
      !Array.isArray(v.dataset.points) ||
      v.dataset.points.length > 10000 ||
      v.dataset.points.some((p) => !Array.isArray(p) || p.length !== 2 || !p.every(finite)))
  )
    return false;
  return true;
}
export function templateBody(v: MathTemplate) {
  return `${v.title}\n${v.notes}\n\n\`\`\`study-math-template-v1\n${JSON.stringify(v)}\n\`\`\``;
}
export function readTemplate(body: string): MathTemplate | null {
  const match = /\n```study-math-template-v1\n([^\n]*)\n```$/.exec(body);
  if (!match) return null;
  try {
    const value: unknown = JSON.parse(match[1]);
    return isMathTemplate(value) ? value : null;
  } catch {
    return null;
  }
}
export function importTemplates(raw: string): MathTemplate[] {
  if (raw.length > 2_000_000) throw Error('내용 파일은 2MB 이내로 나누어 주세요.');
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw Error('내용 파일의 JSON을 읽지 못했습니다. 기존 입력은 유지했습니다.');
  }
  const items = Array.isArray(value) ? value : [value];
  if (
    !items.length ||
    items.length > 100 ||
    !items.every(isMathTemplate) ||
    new Set(items.map((v) => v.id)).size !== items.length
  )
    throw Error(
      '유형·수식·구간·변수·초기조건 또는 중복 ID를 확인해 주세요. 지원하는 내용 형식과 맞지 않습니다.',
    );
  // Invalid expression source stays editable, but executable AST is never admitted.
  for (const item of items)
    item.expressions.forEach((source) => {
      compileTemplateExpression(source, item);
    });
  return items;
}
export function compileTemplateExpression(source: string, item: MathTemplate) {
  if (!source.trim() || source.length > 500) throw Error('수식을 500자 이내로 입력해 주세요.');
  const node = parse(source),
    allowed = new Set([
      ...TEMPLATE_SPECS[item.kind].variables,
      ...item.parameters.map((p) => p.symbol),
      'pi',
      'e',
    ]);
  let count = 0;
  node.traverse((entry: MathNode) => {
    if (++count > 180) throw Error('수식이 너무 깁니다. 나누어 입력해 주세요.');
    if (entry.type === 'ConstantNode' || entry.type === 'ParenthesisNode') return;
    const n = entry as MathNode & { name: string; op: string };
    if (entry.type === 'SymbolNode' && (allowed.has(n.name) || FUNCTIONS.has(n.name))) return;
    if (entry.type === 'FunctionNode' && FUNCTIONS.has(n.name)) return;
    if (entry.type === 'OperatorNode' && ['+', '-', '*', '/', '^'].includes(n.op)) return;
    throw Error(
      `허용된 변수(${[...allowed].join(', ')})와 수치 연산·삼각함수·exp·log·sqrt·abs를 사용해 주세요.`,
    );
  });
  const compiled = node.compile();
  return {
    tex: node.toTex(),
    value: (scope: Record<string, number>): number | null => {
      try {
        const value: unknown = compiled.evaluate(scope);
        return typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 1e12
          ? value
          : null;
      } catch {
        return null;
      }
    },
  };
}
export interface TemplateLine {
  name: string;
  points: Array<Vec3 | null>;
  role?: 'curve' | 'secondary' | 'grid';
  markers?: boolean;
  style?: 'line' | 'scatter' | 'bar';
}
export interface TemplateResult {
  tex: string[];
  lines: TemplateLine[];
  is3d: boolean;
  point: Vec3 | null;
  readouts: Array<{ label: string; value: string }>;
  notices: string[];
  surface?: { x: number[] | number[][]; y: number[] | number[][]; z: Array<Array<number | null>> };
  contour?: { x: number[]; y: number[]; z: Array<Array<number | null>>; zero: boolean };
  volume?: { x: number[]; y: number[]; z: number[]; value: number[] };
  arrows?: Array<{ at: Vec3; vector: Vec3 }>;
  legacy?: { scene: typeof DEFAULT_SCENE; result: ReturnType<typeof buildScene> };
}
// Lines share the surface's exact samples, including holes in its domain.
// Both Cartesian x/y grids and parametric u/v grids use this same adapter.
export function surfaceMesh(surface: NonNullable<TemplateResult['surface']>): TemplateLine[] {
  const rows = surface.z.length;
  const columns = surface.z[0]?.length ?? 0;
  if (!rows || !columns) return [];
  const at = (row: number, column: number): Vec3 | null => {
    const x = Array.isArray(surface.x[0])
      ? (surface.x as number[][])[row][column]
      : (surface.x as number[])[column];
    const y = Array.isArray(surface.y[0])
      ? (surface.y as number[][])[row][column]
      : (surface.y as number[])[row];
    const z = surface.z[row][column];
    return z !== null && Number.isFinite(x) && Number.isFinite(y) ? [x, y, z] : null;
  };
  const indices = (count: number) => [
    ...new Set(Array.from({ length: 21 }, (_, i) => Math.round(((count - 1) * i) / 20))),
  ];
  return [
    ...indices(rows).map((row) => ({
      name: '곡면 모눈',
      points: Array.from({ length: columns }, (_, column) => at(row, column)),
    })),
    ...indices(columns).map((column) => ({
      name: '곡면 모눈',
      points: Array.from({ length: rows }, (_, row) => at(row, column)),
    })),
  ];
}
const fmt = (v: number) => (Math.abs(v) < 0.005 ? '0.00' : v.toFixed(2));
const coordinates = (p: Vec3, dimension = 3) => `(${p.slice(0, dimension).map(fmt).join(', ')})`;
const grid = (range: [number, number], count: number) =>
  Array.from({ length: count }, (_, i) => range[0] + ((range[1] - range[0]) * i) / (count - 1));
export function buildTemplate(item: MathTemplate): TemplateResult {
  if (!isMathTemplate(item)) throw Error('내용 형식을 확인해 주세요.');
  const spec = TEMPLATE_SPECS[item.kind];
  for (const key of spec.axes) {
    const [lo, hi] = item.ranges[key];
    if (!(lo < hi) || hi - lo < 1e-8) throw Error(`${key} 구간의 시작은 끝보다 작아야 합니다.`);
    if (item.cursor[key] < lo || item.cursor[key] > hi) throw Error(`${key} 위치가 구간 밖입니다.`);
  }
  const expressions = item.expressions.map((source) => compileTemplateExpression(source, item));
  const params = Object.fromEntries(item.parameters.map((p) => [p.symbol, p.value]));
  const values = (scope: Record<string, number>) =>
    expressions.map((e) => e.value({ ...params, ...scope }));
  const result: TemplateResult = {
    tex: expressions.map((e) => e.tex),
    lines: [],
    point: null,
    is3d: ['curve', 'surface', 'parametric-surface', 'implicit3d', 'field3d'].includes(item.kind),
    readouts: [],
    notices: [],
  };
  const read = (label: string, v: number) => {
    result.readouts.push({ label, value: fmt(v) });
  };
  if (item.kind === 'formula') {
    result.tex = item.tex ?? [];
    return result;
  } else if (item.kind === 'data') {
    result.lines = [
      {
        name: item.title,
        points: item.dataset!.points.map((p) => [p[0], p[1], 0]),
        style: item.dataset!.style,
      },
    ];
    if (!item.dataset!.points.length)
      result.notices.push('자료를 넣으면 축 이름과 함께 표시합니다.');
    result.readouts.push({ label: '제공한 값', value: String(item.dataset!.points.length) });
    return result;
  } else if (item.kind === 'function' || item.kind === 'curve') {
    if (item.parameters.some((p) => !['a', 'b'].includes(p.symbol))) {
      // Materialize extra scalar parameters as constants for the existing Frenet adapter.
      const extra = item.parameters.filter((p) => !['a', 'b'].includes(p.symbol));
      item = {
        ...item,
        expressions: item.expressions.map((s) =>
          parse(s)
            .transform((n) =>
              n.type === 'SymbolNode' &&
              extra.some((p) => p.symbol === (n as MathNode & { name: string }).name)
                ? parse(`(${params[(n as MathNode & { name: string }).name]})`)
                : n,
            )
            .toString(),
        ),
      };
    }
    const axis = spec.axes[0],
      [lo, hi] = item.ranges[axis];
    const scene = {
      ...DEFAULT_SCENE,
      mode: item.kind === 'curve' ? ('curve' as const) : ('function' as const),
      expressions: (item.kind === 'function'
        ? [item.expressions[0], '0', '0']
        : item.expressions) as [string, string, string],
      a: params.a ?? 0,
      b: params.b ?? 0,
      min: String(lo),
      max: String(hi),
      position: (item.cursor[axis] - lo) / (hi - lo),
    };
    const built = buildScene(scene);
    result.tex = [built.tex];
    result.legacy = { scene, result: built };
    result.point = built.point;
    result.lines = [{ name: spec.label, points: built.points }];
    if (built.vectors?.reason) result.notices.push(built.vectors.reason);
    if (built.frameError) result.notices.push(built.frameError);
  } else if (
    item.kind === 'surface' ||
    item.kind === 'parametric-surface' ||
    item.kind === 'implicit'
  ) {
    const [first, second] = spec.axes,
      xs = grid(item.ranges[first], 81),
      ys = grid(item.ranges[second], 81);
    if (item.kind === 'parametric-surface') {
      const x: number[][] = [],
        y: number[][] = [],
        z: Array<Array<number | null>> = [];
      for (const v of ys) {
        const row = xs.map((u) => values({ u, v }));
        x.push(row.map((p) => p[0] ?? NaN));
        y.push(row.map((p) => p[1] ?? NaN));
        z.push(row.map((p) => (p.some((n) => n === null) ? null : p[2])));
      }
      result.surface = { x, y, z };
      const p = values(item.cursor);
      result.point = p.some((n) => n === null) ? null : (p as Vec3);
    } else {
      const z = ys.map((y) => xs.map((x) => values({ x, y })[0]));
      result.contour = { x: xs, y: ys, z, zero: item.kind === 'implicit' };
      if (item.kind === 'surface') result.surface = { x: xs, y: ys, z };
      const value = values(item.cursor)[0];
      if (value !== null) {
        result.point = [item.cursor.x, item.cursor.y, item.kind === 'surface' ? value : 0];
        read(item.kind === 'surface' ? '높이 z' : '현재 위치의 잔차 F', value);
      }
    }
  } else if (item.kind === 'implicit3d') {
    const x: number[] = [],
      y: number[] = [],
      z: number[] = [],
      value: number[] = [];
    for (const zz of grid(item.ranges.z, 25))
      for (const yy of grid(item.ranges.y, 25))
        for (const xx of grid(item.ranges.x, 25)) {
          const f = values({ x: xx, y: yy, z: zz })[0];
          if (f !== null) {
            x.push(xx);
            y.push(yy);
            z.push(zz);
            value.push(f);
          }
        }
    result.volume = { x, y, z, value };
    const residual = values(item.cursor)[0];
    if (residual !== null) {
      result.point = [item.cursor.x, item.cursor.y, item.cursor.z];
      read('현재 위치의 잔차 F', residual);
    }
  } else if (item.kind === 'field' || item.kind === 'field3d') {
    const arrows: Array<{ at: Vec3; vector: Vec3 }> = [];
    for (const z of item.kind === 'field3d' ? grid(item.ranges.z, 5) : [0])
      for (const y of grid(item.ranges.y, item.kind === 'field3d' ? 5 : 11))
        for (const x of grid(item.ranges.x, item.kind === 'field3d' ? 5 : 11)) {
          const p = values({ x, y, z });
          if (p.every((n) => n !== null))
            arrows.push({ at: [x, y, z], vector: [p[0] as number, p[1] as number, p[2] ?? 0] });
        }
    result.arrows = arrows;
    const p = values(item.cursor);
    result.point = [item.cursor.x, item.cursor.y, item.cursor.z ?? 0];
    if (p.every((n) => n !== null)) {
      result.readouts.push({
        label: '실제 벡터 성분',
        value: coordinates([p[0] as number, p[1] as number, p[2] ?? 0]),
      });
      read('실제 크기', Math.hypot(...(p as number[])));
    } else result.notices.push('현재 위치의 벡터가 정의되지 않습니다.');
  } else if (item.kind === 'ode' || item.kind === 'ode-system') {
    const { fine, coarse, stopped } = integrateTemplate(item, values);
    result.lines = [
      {
        name: item.kind === 'ode' ? 'y(t)' : '위상 궤적',
        points: fine.map((p) => (item.kind === 'ode' ? [p.t, p.y[0], 0] : [p.y[0], p.y[1], 0])),
      },
    ];
    const closest = fine.reduce((a, b) =>
      Math.abs(a.t - item.cursor.t) < Math.abs(b.t - item.cursor.t) ? a : b,
    );
    result.point =
      item.kind === 'ode' ? [closest.t, closest.y[0], 0] : [closest.y[0], closest.y[1], 0];
    read('실제 표본 시각 t', closest.t);
    closest.y.forEach((v, i) => {
      read(item.kind === 'ode' ? 'y(t)' : `${['x', 'y'][i]}(t)`, v);
    });
    if (stopped)
      result.notices.push(
        '수치해가 정의되지 않거나 계산 한계를 넘어서 그 지점에서 멈췄습니다. 구간·초기조건을 확인해 주세요.',
      );
    const a = fine.at(-1),
      b = coarse.at(-1);
    if (a && b && Math.abs(a.t - b.t) < 1e-9) {
      const delta = Math.hypot(...a.y.map((v, i) => v - b.y[i]));
      result.readouts.push({
        label: '간격 절반 비교 차이 (보장 오차 아님)',
        value: delta.toExponential(2),
      });
    }
  } else if (item.kind === 'matrix') {
    const m = values({});
    if (m.some((n) => n === null)) throw Error('행렬의 네 성분은 유한한 실수여야 합니다.');
    const [a, b, c, d] = m as number[],
      transform = (x: number, y: number): Vec3 => [a * x + b * y, c * x + d * y, 0];
    for (const x of grid(item.ranges.x, 9)) {
      const pts: Vec3[] = [
        [x, item.ranges.y[0], 0],
        [x, item.ranges.y[1], 0],
      ];
      result.lines.push(
        { name: '변환 전', role: 'grid', points: pts },
        { name: '변환 후', role: 'curve', points: pts.map((p) => transform(p[0], p[1])) },
      );
    }
    for (const y of grid(item.ranges.y, 9)) {
      const pts: Vec3[] = [
        [item.ranges.x[0], y, 0],
        [item.ranges.x[1], y, 0],
      ];
      result.lines.push(
        { name: '변환 전', role: 'grid', points: pts },
        { name: '변환 후', role: 'curve', points: pts.map((p) => transform(p[0], p[1])) },
      );
    }
    result.point = transform(item.cursor.x, item.cursor.y);
    read('행렬식 det A', a * d - b * c);
    result.readouts.push({
      label: '변환 전 점',
      value: coordinates([item.cursor.x, item.cursor.y, 0]),
    });
    result.lines.push(
      { name: 'e₁의 상', role: 'secondary', points: [[0, 0, 0], transform(1, 0)] },
      { name: 'e₂의 상', role: 'secondary', points: [[0, 0, 0], transform(0, 1)] },
    );
  } else if (item.kind === 'sequence') {
    const [lo, hi] = item.ranges.n;
    if (
      !Number.isInteger(lo) ||
      !Number.isInteger(hi) ||
      hi - lo > 999 ||
      !Number.isInteger(item.cursor.n)
    )
      throw Error('n 구간과 위치는 정수이며 한 번에 1000항 이내로 표시합니다.');
    let sum = 0,
      defined = true;
    const terms: Array<Vec3 | null> = [],
      sums: Array<Vec3 | null> = [];
    for (let n = lo; n <= hi; n++) {
      const value = values({ n })[0];
      terms.push(value === null ? null : [n, value, 0]);
      if (value === null) defined = false;
      if (defined) {
        sum += value as number;
        if (!Number.isFinite(sum) || Math.abs(sum) > 1e12) defined = false;
      }
      sums.push(defined ? [n, sum, 0] : null);
    }
    result.lines = [
      { name: '항 aₙ', markers: true, points: terms },
      { name: '유한 부분합', role: 'secondary', points: sums },
    ];
    result.point = terms[item.cursor.n - lo];
    const partial = sums[item.cursor.n - lo];
    if (partial) read('구간 시작부터 선택한 항까지의 부분합', partial[1]);
    else result.notices.push('정의되지 않는 항 이후의 부분합은 계산하지 않습니다.');
  }
  const tex = expressions.map((e) => e.tex);
  if (item.kind === 'surface') result.tex = [`z(x,y)=${tex[0]}`];
  if (item.kind === 'parametric-surface')
    result.tex = [`\\mathbf r(u,v)=\\left(${tex.join(',')}\\right)`];
  if (item.kind === 'implicit' || item.kind === 'implicit3d')
    result.tex = [`F(${spec.variables.join(',')})=${tex[0]}=0`];
  if (item.kind === 'field' || item.kind === 'field3d')
    result.tex = [`\\mathbf F(${spec.variables.join(',')})=\\left(${tex.join(',')}\\right)`];
  if (item.kind === 'ode')
    result.tex = [`\\frac{dy}{dt}=${tex[0]},\\quad y(${item.ranges.t[0]})=${item.initial[0]}`];
  if (item.kind === 'ode-system')
    result.tex = [
      `\\frac{dx}{dt}=${tex[0]},\\quad\\frac{dy}{dt}=${tex[1]}`,
      `(x,y)(${item.ranges.t[0]})=(${item.initial.join(',')})`,
    ];
  if (item.kind === 'matrix')
    result.tex = [
      `\\mathbf A=\\begin{pmatrix}${tex[0]}&${tex[1]}\\\\${tex[2]}&${tex[3]}\\end{pmatrix}`,
    ];
  if (item.kind === 'sequence') result.tex = [`a_n=${tex[0]}`];
  if (result.point)
    result.readouts.unshift({
      label: '현재 점',
      value: coordinates(result.point, result.is3d ? 3 : 2),
    });
  else result.notices.push('현재 점이 정의되지 않습니다. 위치나 구간을 바꾸어 주세요.');
  if (result.surface?.z.some((row) => row.some((v) => v === null)))
    result.notices.push('정의되지 않는 표면 영역은 연결하지 않습니다.');
  return result;
}
function integrateTemplate(
  item: MathTemplate,
  values: (scope: Record<string, number>) => Array<number | null>,
) {
  const [lo, hi] = item.ranges.t;
  const run = (steps: number) => {
    const out = [{ t: lo, y: [...item.initial] }],
      h = (hi - lo) / steps;
    const f = (t: number, y: number[]) =>
      values(item.kind === 'ode' ? { t, y: y[0] } : { t, x: y[0], y: y[1] });
    for (let i = 0; i < steps; i++) {
      const prev = out.at(-1)!;
      const k1 = f(prev.t, prev.y);
      if (k1.some((v) => v === null)) break;
      const next = (k: Array<number | null>, scale: number) =>
        prev.y.map((v, j) => v + scale * (k[j] as number));
      const k2 = f(prev.t + h / 2, next(k1, h / 2));
      if (k2.some((v) => v === null)) break;
      const k3 = f(prev.t + h / 2, next(k2, h / 2));
      if (k3.some((v) => v === null)) break;
      const k4 = f(prev.t + h, next(k3, h));
      if (k4.some((v) => v === null)) break;
      const y = prev.y.map(
        (v, j) =>
          v +
          (h *
            ((k1[j] as number) +
              2 * (k2[j] as number) +
              2 * (k3[j] as number) +
              (k4[j] as number))) /
            6,
      );
      if (y.some((v) => !Number.isFinite(v) || Math.abs(v) > 1e12)) break;
      out.push({ t: lo + (i + 1) * h, y });
    }
    return out;
  };
  const fine = run(800),
    coarse = run(400);
  return { fine, coarse, stopped: fine.length !== 801 };
}
