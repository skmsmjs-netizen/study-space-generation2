import { parse, derivative, type MathNode } from 'mathjs';

export type Vec3 = [number, number, number];
export interface MathScene {
  mode: 'function' | 'curve';
  title: string;
  expressions: [string, string, string];
  min: string;
  max: string;
  position: number;
  a: number;
  b: number;
  vectors: boolean;
  notes: string;
  renderer?: 'geogebra' | 'plotly';
  geogebra?: { sourceKey: string; xml: string };
}
export const MATH_MEMO_PREFIX = 'math-explorer:';
export const DEFAULT_SCENE: MathScene = {
  mode: 'curve',
  title: '',
  expressions: ['a*cos(t)', 'a*sin(t)', 'b*t'],
  min: '0',
  max: '4*pi',
  position: 0.25,
  a: 2,
  b: 0.5,
  vectors: true,
  notes: '',
};
export const FUNCTIONS = new Set([
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'sinh',
  'cosh',
  'tanh',
  'exp',
  'log',
  'sqrt',
  'abs',
]);
const symbols = new Set(['x', 't', 'a', 'b', 'pi', 'e']);
const operators = new Set(['+', '-', '*', '/', '^']);
function checkNode(node: MathNode, limit = 180) {
  let count = 0;
  node.traverse((entry) => {
    if (++count > limit) throw Error('수식이 너무 깁니다. 나누어 입력해 주세요.');
    if (entry.type === 'ConstantNode' || entry.type === 'ParenthesisNode') return;
    if (entry.type === 'SymbolNode' && symbols.has((entry as MathNode & { name: string }).name))
      return;
    if (entry.type === 'OperatorNode' && operators.has((entry as MathNode & { op: string }).op))
      return;
    if (entry.type === 'FunctionNode' && FUNCTIONS.has((entry as MathNode & { name: string }).name))
      return;
    // The function's symbol is visited too.
    if (entry.type === 'SymbolNode' && FUNCTIONS.has((entry as MathNode & { name: string }).name))
      return;
    throw Error(
      'x, t, a, b, pi, e와 사칙연산·거듭제곱·삼각함수·exp·log·sqrt·abs를 사용할 수 있습니다.',
    );
  });
}
export function expression(source: string, variable?: 'x' | 't') {
  if (!source.trim() || source.length > 500) throw Error('수식을 500자 이내로 입력해 주세요.');
  const node = parse(source);
  checkNode(node);
  node.traverse((entry) => {
    if (entry.type === 'SymbolNode') {
      const name = (entry as MathNode & { name: string }).name;
      if ((name === 'x' || name === 't') && name !== variable)
        throw Error(
          variable
            ? `이 수식의 변수는 ${variable}입니다.`
            : '구간에는 pi, e와 숫자를 사용해 주세요.',
        );
      if (!variable && (name === 'a' || name === 'b'))
        throw Error('구간에는 pi, e와 숫자를 사용해 주세요.');
    }
  });
  const compiled = node.compile();
  return {
    node,
    tex: node.toTex(),
    value: (scope: Record<string, number>) => {
      const result: unknown = compiled.evaluate(scope);
      return typeof result === 'number' && Number.isFinite(result) ? result : null;
    },
  };
}
export const norm = (v: Vec3) => Math.hypot(...v);
export const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const scale = (v: Vec3, s: number): Vec3 => v.map((value) => value * s) as Vec3;
export const add = (a: Vec3, b: Vec3): Vec3 => a.map((value, i) => value + b[i]) as Vec3;
export function frame(velocity: Vec3, acceleration: Vec3) {
  const speed = norm(velocity);
  if (!Number.isFinite(speed) || speed === 0)
    return { reason: '속도가 0인 지점에서는 T·N·B가 정의되지 않습니다.' };
  const T = scale(velocity, 1 / speed);
  const c = cross(T, acceleration),
    cLength = norm(c);
  const relative = norm(acceleration);
  if (!Number.isFinite(cLength) || cLength <= 1e-12 * relative || cLength === 0)
    return { T, reason: '곡률이 0인 지점에서는 N과 B가 정의되지 않습니다.' };
  const B = scale(c, 1 / cLength);
  const N = cross(B, T);
  return { T, N, B, curvature: cLength / (speed * speed), reason: '' };
}
export function buildScene(scene: MathScene) {
  const variable = scene.mode === 'curve' ? 't' : 'x';
  const sources = scene.mode === 'curve' ? scene.expressions : [scene.expressions[0]];
  const compiled = sources.map((source) => expression(source, variable));
  const min = expression(scene.min).value({}),
    max = expression(scene.max).value({});
  if (min === null || max === null || min >= max || Math.abs(min) > 1e6 || Math.abs(max) > 1e6)
    throw Error('구간의 시작은 끝보다 작아야 하며, 값은 -1000000부터 1000000 사이여야 합니다.');
  const at = min + (max - min) * scene.position;
  const scope = (value: number) => ({ [variable]: value, a: scene.a, b: scene.b });
  const sample = (value: number): Vec3 | null => {
    try {
      const values = compiled.map((entry) => entry.value(scope(value)));
      if (values.some((value) => value === null)) return null;
      return scene.mode === 'function' ? [value, values[0] as number, 0] : (values as Vec3);
    } catch {
      return null;
    }
  };
  const points = Array.from({ length: 401 }, (_, i) => sample(min + ((max - min) * i) / 400));
  // A sampled curve cannot prove continuity. Do not join large jumps across a likely pole.
  const magnitudes = points
    .filter((p): p is Vec3 => p !== null)
    .map((p) => Math.abs(p[1]))
    .sort((a, b) => a - b);
  const typical = magnitudes[Math.floor(magnitudes.length / 2)] ?? 1;
  const breakBefore = points.map((p, i) => {
    const previous = points[i - 1];
    if (scene.mode !== 'function' || !p || !previous) return false;
    const midpoint = sample((p[0] + previous[0]) / 2);
    if (!midpoint) return true;
    const jump = Math.abs(p[1] - previous[1]);
    return (
      jump > 20 * Math.max(typical, 1e-9) &&
      Math.abs(midpoint[1] - (p[1] + previous[1]) / 2) > jump / 4
    );
  });
  const point = sample(at);
  let vectors: ReturnType<typeof frame> | null = null;
  let frameError = '';
  if (scene.mode === 'curve' && scene.vectors && point) {
    try {
      compiled.forEach((entry) => {
        entry.node.traverse((node) => {
          if (node.type === 'FunctionNode' && (node as MathNode & { name: string }).name === 'abs')
            throw Error('abs가 포함된 곡선은 꺾이는 지점이 있어 T·N·B를 계산하지 않습니다.');
        });
      });
      const first = compiled.map((entry) => derivative(entry.node, 't'));
      first.forEach((entry) => {
        if (entry.toString().length > 8000)
          throw Error('미분식이 너무 길어 벡터 계산을 생략했습니다.');
      });
      const second = first.map((entry) => derivative(entry, 't'));
      const values = [...first, ...second].map(
        (entry) => entry.compile().evaluate(scope(at)) as unknown,
      );
      if (values.some((value) => typeof value !== 'number' || !Number.isFinite(value)))
        throw Error('이 위치에서 미분값을 정의할 수 없어 T·N·B를 계산하지 않습니다.');
      if (norm(values.slice(0, 3) as Vec3) === 0)
        throw Error('속도가 0인 지점에서는 T·N·B가 정의되지 않습니다.');
      vectors = frame(values.slice(0, 3) as Vec3, values.slice(3) as Vec3);
    } catch (e) {
      frameError = e instanceof Error ? e.message : '이 위치의 벡터를 계산하지 못했습니다.';
    }
  }
  const tex =
    scene.mode === 'curve'
      ? `\\mathbf r(t)=\\left(${compiled.map((entry) => entry.tex).join(',\\;')}\\right)`
      : `y=${compiled[0].tex}`;
  return {
    points,
    point,
    at,
    min,
    max,
    tex,
    vectors,
    frameError,
    missing: points.filter((value) => value === null).length,
    breakBefore,
  };
}
export function isMathScene(value: unknown): value is MathScene {
  if (!value || typeof value !== 'object') return false;
  const v = value as MathScene;
  return (
    (v.mode === 'curve' || v.mode === 'function') &&
    typeof v.title === 'string' &&
    typeof v.notes === 'string' &&
    Array.isArray(v.expressions) &&
    v.expressions.length === 3 &&
    v.expressions.every((s) => typeof s === 'string') &&
    typeof v.min === 'string' &&
    typeof v.max === 'string' &&
    typeof v.vectors === 'boolean' &&
    Number.isFinite(v.a) &&
    Number.isFinite(v.b) &&
    Number.isFinite(v.position) &&
    v.position >= 0 &&
    v.position <= 1 &&
    (v.renderer === undefined || v.renderer === 'geogebra' || v.renderer === 'plotly') &&
    (v.geogebra === undefined ||
      (typeof v.geogebra.sourceKey === 'string' && typeof v.geogebra.xml === 'string'))
  );
}
export function sceneBody(scene: MathScene) {
  return `${scene.title || '수식 탐색'}\n${scene.notes}\n\n\`\`\`study-math-v1\n${JSON.stringify(scene)}\n\`\`\``;
}
export function readScene(body: string): MathScene | null {
  const match = /\n```study-math-v1\n([^\n]*)\n```$/.exec(body);
  if (!match) return null;
  try {
    const value: unknown = JSON.parse(match[1]);
    return isMathScene(value) ? value : null;
  } catch {
    return null;
  }
}
