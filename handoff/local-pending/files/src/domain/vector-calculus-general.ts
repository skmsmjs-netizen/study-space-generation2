import { derivative, parse, lusolve, type MathNode } from 'mathjs';
import {
  compileTemplateExpression,
  buildTemplate,
  type MathTemplate,
  type TemplateResult,
} from './math-templates';
import { add, cross, norm, scale, type Vec3 } from './math-explorer';
import { isTemplateView, type TemplateView } from './math-view';
import type { Parameter } from './vector-calculus';
export type GeneralKind =
  | 'plane'
  | 'quadric'
  | 'curve'
  | 'differential'
  | 'critical'
  | 'integral'
  | 'density'
  | 'flux'
  | 'stokes'
  | 'operators'
  | 'line';
export interface GeneralState {
  caseId: string;
  expressions: Record<string, string>;
  values: Record<string, number>;
  drafts: Record<string, string>;
  errors: Record<string, string>;
  conditions: boolean;
  view?: TemplateView;
}
export interface GeneralWorkspace {
  active: GeneralKind;
  states: Partial<Record<GeneralKind, GeneralState>>;
}
interface GeneralCase {
  id: string;
  label: string;
  expressions: Record<string, string>;
  values?: Record<string, number>;
  explanation: string;
}
export interface GeneralSpec {
  title: string;
  modules: string[];
  question: string;
  conditions: string;
  fields: Array<[string, string]>;
  parameters: Parameter[];
  cases: GeneralCase[];
  tex: string[];
}
const p = (
  key: string,
  label: string,
  min: number,
  max: number,
  initial: number,
  options?: string[],
): Parameter => ({ key, label, min, max, initial, ...(options ? { integer: true, options } : {}) });
const xyz = (prefix: string, initial: Vec3) =>
  ['x', 'y', 'z'].map((s, i) => p(prefix + s, `${prefix} · ${s} 성분`, -5, 5, initial[i]));
const point = [p('x', '현재 x', -3, 3, 1), p('y', '현재 y', -3, 3, 1), p('z', '현재 z', -3, 3, 1)];
const fieldFields: Array<[string, string]> = [
  ['Fx', '벡터장 Fₓ(x,y,z)'],
  ['Fy', '벡터장 Fᵧ(x,y,z)'],
  ['Fz', '벡터장 F의 z 성분(x,y,z)'],
];
const surfaceFields: Array<[string, string]> = [
  ['rx', '곡면 x(u,v)'],
  ['ry', '곡면 y(u,v)'],
  ['rz', '곡면 z(u,v)'],
];
const bounds = [
  p('u0', 'u 시작', -5, 5, 0),
  p('u1', 'u 끝', -5, 7, 1),
  p('v0', 'v 시작', -5, 5, 0),
  p('v1', 'v 끝', -5, 7, 1),
  p('u', '현재 u', -5, 7, 0.5),
  p('v', '현재 v', -5, 7, 0.5),
  p('sign', '방향 ε', -1, 1, 1),
];
const ex = (
  id: string,
  label: string,
  expressions: Record<string, string>,
  explanation: string,
  values?: Record<string, number>,
): GeneralCase => ({ id, label, expressions, explanation, values });
const surfaceDefault = { rx: 'u', ry: 'v', rz: 'u^2+v^2', Fx: '0', Fy: '0', Fz: '1', h: '1' };
export const VECTOR_GENERAL_SPECS: Record<GeneralKind, GeneralSpec> = {
  plane: {
    title: '임의 법선의 직선·평면',
    modules: ['A3'],
    question: '법선·위치·방향을 바꾸면 직선–평면과 두 평면의 교차·각도·거리는 어떻게 달라지는가?',
    conditions:
      '평면 n·x=d는 n≠0, 직선 P+tu는 u≠0. 교차/평행 판정은 정확식과 수치 잔차를 구별한다.',
    fields: [],
    parameters: [
      ...xyz('n', [1, 1, 1]),
      ...xyz('m', [1, -1, 0]),
      ...xyz('P', [1, 0, 0]),
      ...xyz('u', [0, 0, 1]),
      p('d', '첫 평면 d', -3, 3, 1),
      p('e', '둘째 평면 e', -3, 3, 0),
    ],
    cases: [
      ex('planes', '비평행 평면', {}, '법선이 평행하지 않은 두 평면의 교선을 먼저 비교한다.'),
      ex('parallel', '평행한 두 평면', {}, '같은 법선에 서로 다른 상수항을 둔다.', {
        mx: 1,
        my: 1,
        mz: 1,
        e: 2,
      }),
    ],
    tex: [
      String.raw`\Pi_1:\mathbf n\cdot\mathbf x=d,\quad\Pi_2:\mathbf m\cdot\mathbf x=e,\quad L:\mathbf P+t\mathbf u`,
      String.raw`t=\frac{d-\mathbf n\cdot\mathbf P}{\mathbf n\cdot\mathbf u}`,
    ],
  },
  quadric: {
    title: '곡면 식·좌표 단면',
    modules: ['A4'],
    question: '곡면의 식과 단면 방향을 바꾸면 원기둥·이차곡면·다른 등위면은 어떻게 구별되는가?',
    conditions:
      'F(x,y,z)=0의 유한 공간 표본이다. 단면은 선택한 축의 좌표를 고정한다. 0선의 렌더링 유무로 전체 해집합의 존재를 판정하지 않는다.',
    fields: [['f', '곡면 F(x,y,z)=0의 왼쪽']],
    parameters: [
      p('axis', '고정할 축', 0, 2, 2, ['x', 'y', 'z']),
      p('cut', '단면 좌표', -3, 3, 0.5),
      p('size', '표시 공간 반폭', 0.5, 4, 2),
    ],
    cases: [
      ex(
        'cylinder',
        '원기둥',
        { f: 'x^2+y^2-1' },
        'z에 독립인 식의 원기둥과 축별 단면을 비교한다.',
      ),
      ex(
        'ellipsoid',
        '타원체',
        { f: 'x^2/4+y^2+z^2-1' },
        '기존 표준곡면과 다른 축 길이를 식으로 지정한다.',
      ),
      ex(
        'hyperboloid',
        '이엽쌍곡면',
        { f: 'z^2-x^2-y^2-1' },
        '연결되지 않은 두 부분과 비어 있는 단면을 구별한다.',
      ),
      ex(
        'graph',
        '비이차 곡면',
        { f: 'z-sin(x)*cos(y)' },
        '지원하는 다른 함수의 수준0 곡면도 같은 틀로 탐색한다.',
      ),
    ],
    tex: [String.raw`F(x,y,z)=0,\quad x_i=c`],
  },
  curve: {
    title: '다른 공간곡선·재매개화',
    modules: ['A5'],
    question:
      '입력한 곡선과 재매개화에서 위치·속도·가속도·T/N/B·곡률·호의 길이는 어떻게 대응하는가?',
    conditions:
      'r(t)는 표시 구간에서 C²이어야 한다. T는 속력≠0, N/B는 곡률≠0에서 정의된다. 같은 곡선의 길이 비교에는 재매개화의 단조성·일대일성·끝점 대응을 확인해야 한다.',
    fields: [
      ['rx', '곡선 x(t)'],
      ['ry', '곡선 y(t)'],
      ['rz', '곡선 z(t)'],
      ['map', '재매개화 h(t)'],
    ],
    parameters: [
      p('lo', '매개변수 시작', -4, 4, 0),
      p('hi', '매개변수 끝', -4, 7, 1),
      p('t', '현재 t', -4, 7, 0.25),
    ],
    cases: [
      ex(
        'helix',
        '나선과 재매개화',
        { rx: 'cos(2*pi*t)', ry: 'sin(2*pi*t)', rz: 't', map: 't^2' },
        '원래 곡선과 속력은 달라지지만 같은 점의 곡률을 비교한다.',
      ),
      ex(
        'bezier',
        '삼차 베지에',
        {
          rx: '3*(1-t)^2*t+3*(1-t)*t^2+t^3',
          ry: '3*(1-t)*t^2+t^3',
          rz: '3*(1-t)^2*t-3*(1-t)*t^2',
          map: 't',
        },
        '제어점에서 전개한 각 성분을 직접 수정할 수 있다.',
      ),
      ex(
        'line',
        '직선·곡률0',
        { rx: 't', ry: '2*t', rz: '3*t', map: 't' },
        'T는 정의되지만 N/B는 정의되지 않는 경우를 분리한다.',
      ),
      ex(
        'stationary',
        '비정칙점',
        { rx: 't^2', ry: 't^3', rz: '0', map: 't' },
        't=0의 속력0을 실제로 확인한다.',
        { t: 0 },
      ),
      ex(
        'retrace',
        '되짚는 재매개화',
        { rx: 't', ry: '0', rz: '0', map: 'sin(2*pi*t)' },
        '단조·일대일이 아니므로 길이 보존을 단정하지 않는다.',
      ),
    ],
    tex: [
      String.raw`\mathbf r_h'=\mathbf r'(h)h',\quad\mathbf r_h''=\mathbf r''(h)(h')^2+\mathbf r'(h)h''`,
      String.raw`\kappa=\frac{\|\mathbf r'\times\mathbf r''\|}{\|\mathbf r'\|^3},\quad L=\int\|\mathbf r'\|\,dt`,
    ],
  },
  differential: {
    title: '다른 함수·음함수·연쇄법칙',
    modules: ['B1', 'B2'],
    question: '같은 점의 편도함수·방향미분·접평면과 합성 경로의 변화율은 어떻게 연결되는가?',
    conditions:
      '편도함수의 값만으로 미분가능성을 증명하지 않는다. 그래프는 z를 고정한 f(x,y,z)의 단면이다. 등위면 접평면 정리는 C¹과 ∇f≠0을 요구한다. abs·sqrt 등의 미분식은 원래 정의역·매끄러움 조건이 먼저다.',
    fields: [
      ['f', '함수 f(x,y,z)'],
      ['rx', '경로 x(t)'],
      ['ry', '경로 y(t)'],
      ['rz', '경로 z(t)'],
    ],
    parameters: [
      ...point,
      p('mode', '중심 표현', 0, 1, 0, ['그래프의 접평면', '등위면의 접평면']),
      p('t', '경로 현재 t', -2, 2, 0.5),
      p('extent', '표시 반폭', 0.5, 3, 2),
    ],
    cases: [
      ex(
        'paraboloid',
        '그래프와 합성 경로',
        { f: 'x^2+y^2', rx: 't', ry: 't^2', rz: '0' },
        '한 경로를 따라 움직이는 점의 gradient와 속도의 내적을 비교한다.',
      ),
      ex(
        'implicit',
        '비구면 등위면',
        { f: 'x^2+2*y^2+3*z^2', rx: 't', ry: 't^2', rz: 't' },
        '기존 구면에 제한하지 않고 다른 법선과 접평면을 계산한다.',
        { mode: 1 },
      ),
      ex(
        'flat',
        'gradient0',
        { f: 'x^4+y^4+z^4', rx: 't', ry: '0', rz: '0' },
        '원점에서 정칙 등위면 정리 적용이 중단된다.',
        { x: 0, y: 0, z: 0, mode: 1 },
      ),
    ],
    tex: [
      String.raw`\frac{d}{dt}f(\mathbf r(t))=\nabla f(\mathbf r(t))\cdot\mathbf r'(t)`,
      String.raw`\nabla f(\mathbf p)\cdot(\mathbf x-\mathbf p)=0`,
    ],
  },
  critical: {
    title: '비이차 극값·반복·제약',
    modules: ['B3'],
    question:
      '비이차 함수에서 정지점·Hessian·Newton 갱신과 Lagrange 필요조건은 각각 무엇을 판정하는가?',
    conditions:
      '평면의 C² 함수, 단일 제약 g=0. gradient0을 먼저 확인한다. D=0이면 이차미분 판정 보류. Newton의 역가역은 극소나 수렴을 보장하지 않는다. 제약의 ∇g=0에서도 Lagrange 정리를 적용하지 않는다. 경계점의 실제 값 비교와 일반 전역최적 보장은 다르다.',
    fields: [
      ['f', '목적함수 f(x,y)'],
      ['g', '제약 g(x,y)=0'],
    ],
    parameters: [
      p('x', '시작 x', -3, 3, 1),
      p('y', '시작 y', -3, 3, 0.5),
      p('iterations', 'Newton 단계', 0, 8, 0, ['0', '1', '2', '3', '4', '5', '6', '7', '8']),
      p('boundary', '경계 정사각형 반폭', 0.1, 3, 1),
      p('theta', '단위원 비교 θ (°)', -180, 180, 30),
      p('task', '반복할 조건', 0, 1, 0, ['무제약 Newton', 'Lagrange 조건 Newton']),
      p('lambda', '시작 λ', -10, 10, 1),
    ],
    cases: [
      ex(
        'quartic-min',
        '고차항 극소',
        { f: 'x^4+y^4', g: 'x^2+y^2-1' },
        'D=0이어도 이 사례는 원래 식의 비음수성과 영점으로 극소를 설명할 수 있다.',
        { x: 0, y: 0 },
      ),
      ex(
        'quartic-saddle',
        '고차항 안장',
        { f: 'x^4-y^4', g: 'x^2+y^2-1' },
        '같은 D=0이면서 축별 부호가 달라 안장인 사례이다.',
        { x: 0, y: 0 },
      ),
      ex(
        'newton',
        '비선형 Newton',
        { f: 'x^2+y^2+x^4+y^4', g: 'x^2+y^2-1' },
        '반복마다 함수·gradient·Hessian을 다시 계산한다.',
      ),
      ex(
        'lagrange',
        '비이차 제약',
        { f: 'x*y+x^3', g: 'x^2+y^2-1' },
        '제약 위에 있는지와 Lagrange 잔차를 각각 확인한다.',
        { task: 1 },
      ),
      ex(
        'singular-constraint',
        '제약 gradient0',
        { f: 'x+y', g: 'x^2+y^2' },
        '가능한 한 점이지만 Lagrange 정리의 정칙 조건은 깨진다.',
        { x: 0, y: 0, task: 1 },
      ),
    ],
    tex: [
      String.raw`D=f_{xx}f_{yy}-f_{xy}^2,\quad H\Delta=-\nabla f`,
      String.raw`g(\mathbf p)=0,\quad\nabla f=\lambda\nabla g,\quad\nabla g\ne0`,
    ],
  },
  integral: {
    title: '다른 적분 영역·순서·변수변환',
    modules: ['C1', 'C3'],
    question:
      '피적분 함수·영역·매개좌표를 바꾸면 적분 구간·야코비안과 실제 누적값은 어떻게 대응하는가?',
    conditions:
      '2D/3D 유계 반복적분. 바깥 변수 u, 다음 v, 마지막 w. v의 경계는 u만, w의 경계는 u,v만 사용한다. 순서 교환에는 같은 물리 영역·적분가능성, 변수변환에는 정칙성·일대일/중복추적 조건을 확인한다. 수치 두 분할의 차이는 엄밀 오차 상계가 아니다.',
    fields: [
      ['f', '피적분 함수 f(x,y,z)'],
      ['rx', '변환 x(u,v,w)'],
      ['ry', '변환 y(u,v,w)'],
      ['rz', '변환 z(u,v,w)'],
      ['v0', 'v 하한(u)'],
      ['v1', 'v 상한(u)'],
      ['w0', 'w 하한(u,v)'],
      ['w1', 'w 상한(u,v)'],
    ],
    parameters: [
      p('dim', '차원', 2, 3, 2, ['2차원', '3차원']),
      p('u0', 'u 시작', -3, 3, 0),
      p('u1', 'u 끝', -3, 7, 1),
      p('u', '현재 u', -3, 7, 0.5),
      p('v', '현재 v', -3, 7, 0.25),
      p('w', '현재 w', -3, 7, 0.25),
    ],
    cases: [
      ex(
        'triangle',
        '삼각형 dy dx',
        { f: 'x+y', rx: 'u', ry: 'v', rz: '0', v0: '0', v1: '1-u', w0: '0', w1: '1' },
        'x=u,y=v, 같은 삼각형의 한 순서.',
      ),
      ex(
        'reverse',
        '같은 삼각형 dx dy',
        { f: 'x+y', rx: 'v', ry: 'u', rz: '0', v0: '0', v1: '1-u', w0: '0', w1: '1' },
        'x=v,y=u로 같은 물리 영역의 순서를 바꾼다.',
      ),
      ex(
        'cylinder',
        '원통좌표의 원기둥',
        {
          f: 'x^2+y^2+z',
          rx: 'u*cos(v)',
          ry: 'u*sin(v)',
          rz: 'w',
          v0: '0',
          v1: '2*pi',
          w0: '0',
          w1: '1',
        },
        'u는 반지름, v는 방위각, w는 높이. |J|=u.',
        { dim: 3 },
      ),
      ex(
        'sphere',
        '구면좌표의 단위구',
        {
          f: '1',
          rx: 'u*sin(w)*cos(v)',
          ry: 'u*sin(w)*sin(v)',
          rz: 'u*cos(w)',
          v0: '0',
          v1: '2*pi',
          w0: '0',
          w1: 'pi',
        },
        'u=ρ,v=θ,w=φ: 교재의 구면 기호 순서를 유지한다.',
        { dim: 3 },
      ),
      ex(
        'nonlinear',
        '비선형 변환',
        { f: '1+x', rx: 'u', ry: 'u*v', rz: '0', v0: '0', v1: '1', w0: '0', w1: '1' },
        '야코비안과 실제 영역을 함께 바꾼다. u=0 경계의 좌표 퇴화는 별도 확인한다.',
      ),
    ],
    tex: [
      String.raw`I=\int_{u_0}^{u_1}\int_{v_0(u)}^{v_1(u)}\int_{w_0(u,v)}^{w_1(u,v)}f(\mathbf r)\,|J|\,dw\,dv\,du`,
    ],
  },
  density: {
    title: '비독립 밀도·분산·상관',
    modules: ['C4'],
    question: '일반 밀도에서 질량·질량중심·사건 확률·기댓값·분산·상관은 어떻게 달라지는가?',
    conditions:
      '유계 정사각형/정육면체의 질량밀도. 비음수성·적분가능성·양의 총질량을 먼저 확인한다. 표본에서 음수가 없다는 것은 전역 비음수성의 증명이 아니다. 확률밀도는 δ/M이며 정규·지수의 유계 관찰은 절단 후 정규화이지 전공간 분포가 아니다.',
    fields: [['f', '밀도 δ(x,y,z)']],
    parameters: [
      p('dim', '차원', 2, 3, 2, ['2차원', '3차원']),
      p('lo', '영역 시작', -3, 3, 0),
      p('hi', '영역 끝', -3, 3, 1),
      p('a', '사건 x 상한 a', -3, 3, 0.5),
      p('b', '사건 y 상한 b', -3, 3, 0.5),
      p('c', '사건 z 상한 c', -3, 3, 0.5),
    ],
    cases: [
      ex(
        'correlated',
        '독립이 아닌 밀도',
        { f: 'x+y' },
        '정사각형의 x+y는 비음수이며 정규화 후 일반적으로 곱 분해되지 않는다.',
      ),
      ex(
        'xyz',
        'z에도 의존하는 밀도',
        { f: '1+x+2*y+3*z' },
        '정육면체에서 z방향 균일 가정을 제거한다.',
        { dim: 3 },
      ),
      ex(
        'normal',
        '절단한 정규 모형',
        { f: 'exp(-(x^2+y^2)/2)/(2*pi)' },
        '유한영역 밖의 꼬리를 버린 후 정규화하므로 전공간 정규밀도와 다르다.',
        { lo: -3, hi: 3, a: 0, b: 0 },
      ),
      ex('uniform', '균등 밀도', { f: '1' }, '균등·독립의 기준 사례를 비독립 모형과 비교한다.'),
      ex('invalid', '음의 밀도 반례', { f: 'x-y' }, '음수 표본을 검출하면 확률 정규화를 중단한다.'),
    ],
    tex: [
      String.raw`M=\int_R\delta,\quad E[X_i]=\frac1M\int_R x_i\delta,\quad p=\frac\delta M`,
      String.raw`\operatorname{Cov}(X,Y)=E[XY]-E[X]E[Y],\quad\operatorname{Corr}(X,Y)=\frac{\operatorname{Cov}(X,Y)}{\sigma_X\sigma_Y}`,
    ],
  },
  flux: {
    title: '다른 매개곡면·벡터장·폐곡면',
    modules: ['D3'],
    question:
      '곡면과 장을 바꾸면 단위법선·면적 요소·스칼라 면적분·플럭스와 발산 적분은 어떻게 대응하는가?',
    conditions:
      'C¹ 매개곡면의 정칙점 ru×rv≠0. 닫힌 곡면의 발산정리는 외향 방향·내부 및 근방의 C¹ 장을 요구한다. 열린 패치에 바로 적용하지 않는다. 구면 좌표의 극은 차트 퇴화이며 구 자체의 비정칙성이 아니다.',
    fields: [...surfaceFields, ...fieldFields, ['h', '스칼라 면밀도 h(x,y,z)']],
    parameters: [
      ...bounds,
      p('closed', '비교할 대상', 0, 2, 0, ['열린 매개패치', '단위구 외향', '단위정육면체 외향']),
    ],
    cases: [
      ex(
        'patch',
        '열린 패치',
        surfaceDefault,
        '기존 수직 일정장뿐 아니라 곡면·장·면밀도를 입력한다.',
      ),
      ex(
        'sphere',
        '구의 발산정리',
        { ...surfaceDefault, Fx: 'x', Fy: 'y', Fz: 'z' },
        '닫힌 단위구의 외향 플럭스와 내부 발산 적분을 비교한다.',
        { closed: 1 },
      ),
      ex(
        'box',
        '정육면체와 비선형장',
        { ...surfaceDefault, Fx: 'x^3', Fy: 'y^2', Fz: 'z' },
        '여섯 면의 플럭스를 따로 더하고 내부 적분과 비교한다.',
        { closed: 2 },
      ),
    ],
    tex: [
      String.raw`d\sigma=\|\mathbf r_u\times\mathbf r_v\|\,du\,dv,\quad\Phi=\iint\mathbf F(\mathbf r)\cdot(\mathbf r_u\times\mathbf r_v)\,du\,dv`,
      String.raw`\oint_{\partial V}\mathbf F\cdot\mathbf n\,d\sigma=\iiint_V\nabla\cdot\mathbf F\,dV`,
    ],
  },
  stokes: {
    title: '다른 장·경계·두 매개곡면',
    modules: ['D1', 'D2', 'D4'],
    question:
      '장·매개곡면·경계를 바꾸면 경계 선적분과 회전의 면적분, 같은 경계의 두 곡면은 어떻게 대응하는가?',
    conditions:
      'C¹ 장과 가향인 조각별 매끄러운 곡면, 오른손 경계 방향을 확인한다. 두 곡면 비교에는 경계가 실제로 일치해야 한다. 유한 경계 표본의 일치는 일반적인 동일성 증명이 아니다. 평면 곡면의 경우는 그린 정리의 순환 형태와 대응한다.',
    fields: [
      ...surfaceFields,
      ['sx', '비교곡면 x(u,v)'],
      ['sy', '비교곡면 y(u,v)'],
      ['sz', '비교곡면 z(u,v)'],
      ...fieldFields,
    ],
    parameters: [
      ...bounds,
      p('boundary', '경계 차트', 0, 1, 1, ['사각형 네 변', '주기 이음선·붕괴 중심']),
    ],
    cases: [
      ex(
        'caps',
        '같은 원 경계의 두 곡면',
        {
          rx: 'u*cos(v)',
          ry: 'u*sin(v)',
          rz: '0',
          sx: 'u*cos(v)',
          sy: 'u*sin(v)',
          sz: '1-u^2',
          Fx: '-y/2',
          Fy: 'x/2',
          Fz: 'x*y',
        },
        'u=반지름,v=방위각. u=1의 경계가 정확히 같으며 u=0은 차트 퇴화이다.',
        { u0: 0, u1: 1, v0: 0, v1: 2 * Math.PI, u: 0.5, v: 1 },
      ),
      ex(
        'rectangle',
        '같은 사각 경계와 비선형장',
        {
          rx: 'u',
          ry: 'v',
          rz: '0',
          sx: 'u',
          sy: 'v',
          sz: 'u*(1-u)*v*(1-v)',
          Fx: '-y^3',
          Fy: 'x^3',
          Fz: 'x*y',
        },
        '사각형의 네 변에서 비교곡면 높이가 정확히0이다.',
        { boundary: 0 },
      ),
      ex(
        'different',
        '다른 경계 반례',
        { rx: 'u', ry: 'v', rz: '0', sx: '2*u', sy: 'v', sz: '0', Fx: '-y', Fy: 'x', Fz: '0' },
        '경계가 달라지므로 같은 경계 정리의 비교 조건이 실패한다.',
        { boundary: 0 },
      ),
    ],
    tex: [
      String.raw`\oint_{\partial\Sigma}\mathbf F\cdot d\mathbf r=\iint_\Sigma(\nabla\times\mathbf F)\cdot(\mathbf r_u\times\mathbf r_v)\,du\,dv`,
    ],
  },
  line: {
    title: '열린 경로·일반 선적분',
    modules: ['D1'],
    question:
      '같은 장과 스칼라 밀도에서 경로·방향을 바꾸면 벡터 선적분, 스칼라 선적분과 퍼텐셜 차이는 어떻게 구별되는가?',
    conditions:
      '유계 매개구간의 조각별 C¹ 경로·연속 피적분 함수. ds에는 속력, dr에는 방향이 들어간다. 끝점 퍼텐셜 차이 공식은 경로의 근방에서 F=∇ψ가 확인될 때만 적용한다.',
    fields: [
      ['rx', '경로 x(t)'],
      ['ry', '경로 y(t)'],
      ['rz', '경로 z(t)'],
      ...fieldFields,
      ['h', '스칼라 밀도 h(x,y,z)'],
      ['potential', '비교할 퍼텐셜 ψ(x,y,z)'],
    ],
    parameters: [
      p('lo', '경로 시작', -3, 3, 0),
      p('hi', '경로 끝', -3, 7, 1),
      p('t', '경로 현재 t', -3, 7, 0.5),
      p('sign', '방향 ε', -1, 1, 1),
    ],
    cases: [
      ex(
        'potential',
        '퍼텐셜 장의 열린 경로',
        {
          rx: 't',
          ry: 't^2',
          rz: 't^3',
          Fx: '2*x',
          Fy: '2*y',
          Fz: '2*z',
          h: '1',
          potential: 'x^2+y^2+z^2',
        },
        '같은 두 끝점에서 경로와 방향을 바꾸며 길이와 퍼텐셜 차이를 구별한다.',
      ),
      ex(
        'rotation',
        '비보존 장의 경로',
        { rx: 't', ry: 't^2', rz: '0', Fx: '-y', Fy: 'x', Fz: '0', h: '1', potential: '0' },
        '선적분은 계산하되 F=∇ψ 조건 불일치 시 퍼텐셜 공식을 적용하지 않는다.',
      ),
    ],
    tex: [
      String.raw`I_v=\int\mathbf F(\mathbf r(t))\cdot\mathbf r'(t)\,dt,\quad I_s=\int h(\mathbf r(t))\|\mathbf r'(t)\|\,dt`,
      String.raw`\int_C\nabla\psi\cdot d\mathbf r=\psi(B)-\psi(A)`,
    ],
  },
  operators: {
    title: '다른 장의 좌표별 연산',
    modules: ['D5'],
    question:
      '다른 스칼라장·벡터장의 gradient·divergence·curl·Laplacian은 좌표 성분을 바꿔도 어떻게 일치하는가?',
    conditions:
      '장과 필요한 도함수의 정의역·C¹/C²를 확인한다. 원통축·구면원점/극에서 분모0 좌표식의 직접 대입은 중단한다. θ는 방위각, φ는 +z축 각도이며 기저 순서 (ρ,θ,φ)를 보존한다.',
    fields: [['f', '스칼라장 f(x,y,z)'], ...fieldFields],
    parameters: point,
    cases: [
      ex(
        'nonlinear',
        '비선형 스칼라·벡터장',
        { f: 'x*y+z^3', Fx: '-y^2', Fy: 'x^2', Fz: 'z^2' },
        '교재의 같은 연산자를 기존 radial장 밖의 장에 적용한다.',
      ),
      ex(
        'potential',
        '퍼텐셜과 항등식',
        { f: 'x^2+y^2+z^2', Fx: '2*x', Fy: '2*y', Fz: '2*z' },
        'gradient의 curl0과 Δf/div grad의 관계를 직접 비교한다.',
      ),
      ex(
        'axis',
        '좌표축 조건',
        { f: 'x^2+y^2+z^2', Fx: 'x', Fy: 'y', Fz: 'z' },
        '직교 계산은 유지하며 극의 구면 직접 대입을 중단한다.',
        { x: 0, y: 0, z: 1 },
      ),
    ],
    tex: [
      String.raw`\nabla f,\quad\nabla\cdot\mathbf F,\quad\nabla\times\mathbf F,\quad\Delta f`,
      String.raw`h_\rho=1,\quad h_\theta=\rho\sin\phi,\quad h_\phi=\rho`,
    ],
  },
};
// Choice values are literal numbers; the two/three dimensional choice is offset by two.
for (const k of ['integral', 'density'] as const)
  VECTOR_GENERAL_SPECS[k].parameters.find((p) => p.key === 'dim')!.options = undefined;
export const generalKinds = (module: string) =>
  (Object.keys(VECTOR_GENERAL_SPECS) as GeneralKind[]).filter((k) =>
    VECTOR_GENERAL_SPECS[k].modules.includes(module),
  );
export function freshGeneral(kind: GeneralKind, caseId?: string): GeneralState {
  const s = VECTOR_GENERAL_SPECS[kind],
    c = s.cases.find((c) => c.id === caseId) ?? s.cases[0];
  return {
    caseId: c.id,
    expressions: { ...c.expressions },
    values: { ...Object.fromEntries(s.parameters.map((p) => [p.key, p.initial])), ...c.values },
    drafts: {},
    errors: {},
    conditions: false,
  };
}
export function validGeneral(value: unknown): value is GeneralWorkspace {
  if (!value || typeof value !== 'object') return false;
  const v = value as GeneralWorkspace;
  if (
    !Object.hasOwn(VECTOR_GENERAL_SPECS, v.active) ||
    !v.states ||
    typeof v.states !== 'object' ||
    Array.isArray(v.states)
  )
    return false;
  return Object.entries(v.states).every(([kind, a]) => {
    const s = VECTOR_GENERAL_SPECS[kind as GeneralKind];
    return (
      !!s &&
      !!a &&
      s.cases.some((c) => c.id === a.caseId) &&
      typeof a.conditions === 'boolean' &&
      (a.view === undefined || isTemplateView(a.view)) &&
      !!a.expressions &&
      Object.keys(a.expressions).length === s.fields.length &&
      s.fields.every(
        ([k]) => typeof a.expressions[k] === 'string' && a.expressions[k].length <= 500,
      ) &&
      !!a.values &&
      Object.keys(a.values).length === s.parameters.length &&
      s.parameters.every(
        (p) =>
          Number.isFinite(a.values[p.key]) &&
          a.values[p.key] >= p.min &&
          a.values[p.key] <= p.max &&
          (!p.integer || Number.isInteger(a.values[p.key])) &&
          (p.key !== 'sign' || Math.abs(a.values[p.key]) === 1),
      ) &&
      [a.drafts, a.errors].every(
        (map) =>
          !!map &&
          !Array.isArray(map) &&
          Object.entries(map).every(
            ([k, t]) =>
              [...s.fields.map((f) => f[0]), ...s.parameters.map((p) => p.key)].includes(k) &&
              typeof t === 'string' &&
              t.length <= (map === a.drafts ? 100000 : 1000),
          ),
      )
    );
  });
}
const dot = (a: Vec3, b: Vec3) => a.reduce((s, v, i) => s + v * b[i], 0),
  sub = (a: Vec3, b: Vec3) => add(a, scale(b, -1));
const unit = (v: Vec3) => v.map((x) => x / norm(v)) as Vec3;
const vec = (v: Record<string, number>, prefix: string): Vec3 => [
  v[prefix + 'x'],
  v[prefix + 'y'],
  v[prefix + 'z'],
];
const text = (v: Vec3) => '(' + v.map((x) => Number(x.toPrecision(10))).join(', ') + ')';
const blank = (): TemplateResult => ({
  tex: [],
  lines: [],
  point: null,
  is3d: true,
  readouts: [],
  notices: [],
});
function arrow(s: TemplateResult, name: string, at: Vec3, v: Vec3) {
  if (!v.every(Number.isFinite)) return;
  s.lines.push({ name, points: [at, add(at, v)] });
  (s.arrows ??= []).push({ at, vector: v });
}
function mesh(
  s: TemplateResult,
  f: (u: number, v: number) => Vec3,
  ur: [number, number],
  vr: [number, number],
  n = 24,
) {
  const x: number[][] = [],
    y: number[][] = [],
    z: Array<Array<number | null>> = [];
  for (let i = 0; i <= n; i++) {
    x[i] = [];
    y[i] = [];
    z[i] = [];
    for (let j = 0; j <= n; j++) {
      try {
        const q = f(ur[0] + ((ur[1] - ur[0]) * i) / n, vr[0] + ((vr[1] - vr[0]) * j) / n);
        x[i].push(q[0]);
        y[i].push(q[1]);
        z[i].push(q[2]);
      } catch {
        x[i].push(NaN);
        y[i].push(NaN);
        z[i].push(null);
      }
    }
  }
  s.surface = { x, y, z };
}
const executor =
  (compiled: { evaluate: (scope: Record<string, number>) => unknown }) =>
  (scope: Record<string, number>) => {
    const v = compiled.evaluate(scope);
    if (typeof v !== 'number' || !Number.isFinite(v) || Math.abs(v) > 1e12)
      throw Error('현재 영역에 정의되지 않거나 수치 범위를 벗어난 값이 있다. 계산을 중단했다.');
    return v;
  };
const expressionCache = new Map<
  string,
  { node: MathNode; tex: string; value: (scope: Record<string, number>) => number }
>();
const derivativeCache = new WeakMap<
  MathNode,
  Map<string, { node: MathNode; tex: string; value: (scope: Record<string, number>) => number }>
>();
function expression(source: string, variables: string[]) {
  const cacheKey = variables.join(',') + ':' + source,
    cached = expressionCache.get(cacheKey);
  if (cached) return cached;
  const item: MathTemplate = {
    version: 1,
    id: 'vector-general',
    kind: 'field3d',
    title: '',
    expressions: [],
    ranges: {},
    cursor: {},
    parameters: variables
      .filter((v) => !['x', 'y', 'z'].includes(v))
      .map((symbol) => ({ symbol, label: symbol, min: -10, max: 10, value: 0 })),
    initial: [],
    notes: '',
  };
  compileTemplateExpression(source, item);
  const node = parse(source);
  node.traverse((n, path, parent) => {
    if (
      n.type === 'SymbolNode' &&
      !(parent?.type === 'FunctionNode' && path === 'fn') &&
      !variables.includes((n as unknown as { name: string }).name) &&
      !['pi', 'e'].includes((n as unknown as { name: string }).name)
    )
      throw Error('이 식에서 허용하지 않는 변수가 있다. 변수·경계 의존 순서를 확인해 주세요.');
  });
  const result = { node, tex: node.toTex(), value: executor(node.compile()) };
  if (expressionCache.size >= 64) expressionCache.delete(expressionCache.keys().next().value!);
  expressionCache.set(cacheKey, result);
  return result;
}
const diff = (node: MathNode, variable: string) => {
  let cache = derivativeCache.get(node);
  if (cache?.has(variable)) return cache.get(variable)!;
  if (!cache) {
    cache = new Map();
    derivativeCache.set(node, cache);
  }
  let count = 0;
  const d = derivative(node, variable);
  d.traverse(() => {
    if (++count > 2000) throw Error('도함수 식이 너무 길다. 식을 나누어 관찰해 주세요.');
  });
  const result = { node: d, tex: d.toTex(), value: executor(d.compile()) };
  cache.set(variable, result);
  return result;
};
const derivs = (e: ReturnType<typeof expression>, variables: string[]) =>
  variables.map((v) => diff(e.node, v));
const value3 = (
  f: Array<{ value: (s: Record<string, number>) => number }>,
  s: Record<string, number>,
) => f.map((e) => e.value(s)) as Vec3;
const scope3 = (q: Vec3) => ({ x: q[0], y: q[1], z: q[2] });
function gauss(n: number) {
  const a: Array<[number, number]> = [];
  for (let i = 1; i <= n; i++) {
    let x = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5)),
      d = 0;
    for (let it = 0; it < 20; it++) {
      let p0 = 1,
        p1 = x;
      for (let j = 2; j <= n; j++) {
        const p2 = ((2 * j - 1) * x * p1 - (j - 1) * p0) / j;
        p0 = p1;
        p1 = p2;
      }
      d = (n * (x * p1 - p0)) / (x * x - 1);
      const next = x - p1 / d;
      if (Math.abs(next - x) < 1e-15) {
        x = next;
        break;
      }
      x = next;
    }
    a.push([x, 2 / ((1 - x * x) * d * d)]);
  }
  return a;
}
const rules = new Map<number, Array<[number, number]>>();
function quad(f: (x: number) => number, lo: number, hi: number, n = 12) {
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo > hi)
    throw Error('영역의 하한·상한을 확인해 주세요. 뒤집힌 영역을 자동으로 바꾸지 않았다.');
  if (lo === hi) return 0;
  let nodes = rules.get(n);
  if (!nodes) {
    nodes = gauss(n);
    rules.set(n, nodes);
  }
  return (
    (nodes.reduce((s, [x, w]) => s + w * f((lo + hi) / 2 + ((hi - lo) * x) / 2), 0) * (hi - lo)) / 2
  );
}
const tensor = (f: (u: number, v: number) => number, p: Record<string, number>, n = 12) =>
  quad((u) => quad((v) => f(u, v), p.v0, p.v1, n), p.u0, p.u1, n);
const generatedCache = new Map<string, MathNode>();
export interface GeneralResult {
  spatial: TemplateResult;
  values: Array<[string, number | string]>;
  tex: string[];
  judgment: string;
  notices: string[];
  item: MathTemplate;
  densityProjection?: string;
}
export function buildVectorGeneral(kind: GeneralKind, state: GeneralState): GeneralResult {
  const spec = VECTOR_GENERAL_SPECS[kind],
    p = state.values,
    e = state.expressions,
    s = blank(),
    values: Array<[string, number | string]> = [],
    tex = [...spec.tex],
    notices: string[] = [];
  const item: MathTemplate = {
    version: 1,
    id: 'vector-general-' + kind,
    kind: 'parametric-surface',
    title: spec.title,
    expressions: [],
    ranges: { x: [-3, 3], y: [-3, 3], z: [-3, 3] },
    parameters: [],
    cursor: {},
    initial: [],
    notes: '',
  };
  let judgment = state.conditions
    ? '적용 조건은 사용자가 확인한 전제이다. 계산 결과와 별개로 원문 조건을 보존한다.'
    : '수치 사례를 관찰 중이다. 정리의 전체 적용 조건은 아직 확인하지 않았다.';
  let densityProjection: string | undefined;
  if (kind === 'plane') {
    const n = vec(p, 'n'),
      m = vec(p, 'm'),
      P = vec(p, 'P'),
      u = vec(p, 'u'),
      nl = norm(n),
      ml = norm(m),
      ul = norm(u);
    if (!nl || !ml) {
      judgment = '법선0은 평면을 정의하지 않는다. 평면 관계를 계산하지 않았다.';
    } else {
      const N = unit(n),
        M = unit(m),
        a = p.d / nl,
        b = p.e / ml,
        c = cross(N, M),
        cl = norm(c);
      const draw = (N: Vec3, dist: number, name: string) => {
        const seed: Vec3 = Math.abs(N[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0],
          v = unit(cross(N, seed)),
          w = cross(N, v),
          center = scale(N, dist);
        const pts: Vec3[] = [
          [-2, -2],
          [2, -2],
          [2, 2],
          [-2, 2],
          [-2, -2],
        ].map(([x, y]) => add(center, add(scale(v, x), scale(w, y))));
        s.lines.push({ name, points: pts, role: 'secondary' });
        arrow(s, name + ' 법선', center, N);
      };
      draw(N, a, '첫 평면');
      draw(M, b, '둘째 평면');
      s.lines.push({ name: '직선', points: [add(P, scale(u, -2)), add(P, scale(u, 2))] });
      values.push(
        ['원점과 첫 평면 거리', Math.abs(a)],
        ['평면 사이 예각 (°)', (Math.acos(Math.min(1, Math.abs(dot(N, M)))) * 180) / Math.PI],
      );
      if (cl === 0) {
        const delta = b - (dot(N, M) < 0 ? -a : a);
        values.push(
          ['평면 관계', delta === 0 ? '같은 평면' : '평행한 두 평면'],
          ['평면 사이 거리', Math.abs(delta)],
        );
      } else {
        const center = scale(add(scale(cross(M, c), a), scale(cross(c, N), b)), 1 / (cl * cl));
        s.lines.push({
          name: '두 평면 교선',
          points: [add(center, scale(unit(c), -3)), add(center, scale(unit(c), 3))],
        });
        values.push(
          ['평면 관계', '교선 존재'],
          ['교선의 점', text(center)],
          [
            '교선 법선 잔차',
            Math.max(Math.abs(dot(n, center) - p.d), Math.abs(dot(m, center) - p.e)),
          ],
        );
      }
      if (!ul) values.push(['직선–평면 관계', '방향0 · 직선 미정의']);
      else {
        const denominator = dot(N, unit(u)),
          residual = a - dot(N, P);
        values.push([
          '직선과 평면의 각 (°)',
          (Math.asin(Math.min(1, Math.abs(denominator))) * 180) / Math.PI,
        ]);
        if (denominator === 0)
          values.push(
            ['직선–평면 관계', residual === 0 ? '평면에 포함' : '평행·교차 없음'],
            ['직선–평면 거리', Math.abs(residual)],
          );
        else {
          const t = residual / (denominator * ul),
            q = add(P, scale(u, t));
          values.push(['교차 매개변수 t', t], ['교점', text(q)]);
          s.point = q;
        }
      }
    }
  } else if (kind === 'quadric') {
    const f = expression(e.f, ['x', 'y', 'z']);
    tex.push(f.tex);
    const t = {
      ...item,
      kind: 'implicit3d' as const,
      cursor: { x: 0, y: 0, z: 0 },
      expressions: [e.f],
      ranges: {
        x: [-p.size, p.size] as [number, number],
        y: [-p.size, p.size] as [number, number],
        z: [-p.size, p.size] as [number, number],
      },
    };
    Object.assign(s, buildTemplate(t));
    s.notices = [];
    const axes = ['x', 'y', 'z'],
      axis = axes[p.axis],
      other = axes.filter((a) => a !== axis),
      xs = Array.from({ length: 41 }, (_, i) => -p.size + (2 * p.size * i) / 40),
      contour = xs.map((y) =>
        xs.map((x) => {
          try {
            return f.value({ [axis]: p.cut, [other[0]]: x, [other[1]]: y });
          } catch {
            return null;
          }
        }),
      );
    // The section is also a readable value table; 3D boundary samples are not a theorem.
    const points: Vec3[] = [];
    for (let i = 0; i < 40; i++)
      for (let j = 0; j < 40; j++) {
        const a = contour[i][j],
          b = contour[i][j + 1];
        if (a === null || b === null || a * b > 0 || a === b) continue;
        const t = -a / (b - a),
          q = { [axis]: p.cut, [other[0]]: xs[j] + (xs[j + 1] - xs[j]) * t, [other[1]]: xs[i] };
        points.push([q.x, q.y, q.z]);
      }
    s.lines.push({ name: '選택 단면 · 유한 표본'.replace('選', '선'), points, style: 'scatter' });
    values.push(['고정 축', axis], ['고정 좌표', p.cut], ['단면 표본 수', points.length]);
    notices.push(
      '이 표본 수0은 단면이 없다는 증명이 아니다. 가는 변화·접점은 격자에서 놓칠 수 있다.',
    );
  } else if (kind === 'curve') {
    if (p.lo >= p.hi) throw Error('매개변수 시작은 끝보다 작아야 한다.');
    const r = [e.rx, e.ry, e.rz].map((x) => expression(x, ['t'])),
      v = r.map((x) => diff(x.node, 't')),
      a = v.map((x) => diff(x.node, 't')),
      h = expression(e.map, ['t']),
      hp = diff(h.node, 't'),
      hpp = diff(hp.node, 't');
    tex.push(...r.map((x) => x.tex), h.tex);
    const at = (t: number) => value3(r, { t }),
      speed = (t: number) => norm(value3(v, { t })),
      mapped = (t: number) => at(h.value({ t }));
    s.lines.push(
      {
        name: '원래 곡선',
        points: Array.from({ length: 121 }, (_, i) => {
          try {
            return at(p.lo + ((p.hi - p.lo) * i) / 120);
          } catch {
            return null;
          }
        }),
      },
      {
        name: '재매개화한 곡선',
        role: 'secondary',
        points: Array.from({ length: 121 }, (_, i) => {
          try {
            return mapped(p.lo + ((p.hi - p.lo) * i) / 120);
          } catch {
            return null;
          }
        }),
      },
    );
    const t = h.value({ t: p.t }),
      q = at(t),
      V = value3(v, { t }),
      A = value3(a, { t }),
      hv = hp.value({ t: p.t }),
      ha = hpp.value({ t: p.t }),
      W = scale(V, hv),
      acc = add(scale(A, hv * hv), scale(V, ha)),
      speedW = norm(W);
    s.point = q;
    arrow(s, '속도', q, W);
    arrow(s, '가속도', q, acc);
    values.push(
      ['원래 매개변수 h(t)', t],
      ['현재 위치', text(q)],
      ['원래 속력', norm(V)],
      ['재매개화 속력', speedW],
    );
    if (speedW === 0) judgment = '현재점의 속력이0이므로 재매개화한 T/N/B를 정의하지 않는다.';
    else {
      const T = unit(W),
        C = cross(T, acc),
        cn = norm(C);
      arrow(s, 'T', q, T);
      if (cn === 0) {
        judgment = 'T는 정의되지만 곡률0이므로 N/B는 정의하지 않는다.';
        values.push(['곡률', 0]);
      } else {
        const B = unit(C),
          N = cross(B, T);
        arrow(s, 'N', q, N);
        arrow(s, 'B', q, B);
        values.push(
          ['곡률', cn / (speedW * speedW)],
          ['T·N', dot(T, N)],
          ['T×N−B 잔차', norm(sub(cross(T, N), B))],
        );
      }
    }
    const original = quad(speed, p.lo, p.hi),
      mappedLength = quad((t) => speed(h.value({ t })) * Math.abs(hp.value({ t })), p.lo, p.hi),
      coarse = quad((t) => speed(h.value({ t })) * Math.abs(hp.value({ t })), p.lo, p.hi, 6);
    values.push(
      ['원래 구간 호의 길이 · 근사', original],
      ['재매개화 구간 호의 길이 · 근사', mappedLength],
      ['6/12점 적분 차이', Math.abs(mappedLength - coarse)],
    );
    notices.push(
      'h의 끝점·일대일·단조 조건을 확인하지 않으면 두 길이의 일치나 불일치를 재매개화 정리의 판정으로 쓰지 않는다.',
    );
  } else if (kind === 'differential') {
    const f = expression(e.f, ['x', 'y', 'z']),
      grad = derivs(f, ['x', 'y', 'z']),
      at: Vec3 = [p.x, p.y, p.z],
      q = scope3(at),
      g = value3(grad, q),
      level = f.value(q),
      ext = p.extent;
    tex.push(f.tex, ...grad.map((x) => x.tex));
    if (p.mode === 0) {
      const z0 = f.value(q),
        fx = g[0],
        fy = g[1];
      mesh(s, (x, y) => [x, y, f.value({ x, y, z: p.z })], [-ext, ext], [-ext, ext]);
      s.point = [p.x, p.y, z0];
      const n = unit([-fx, -fy, 1]);
      arrow(s, '그래프 법선', s.point, n);
      for (const k of [-0.8, 0.8])
        s.lines.push({
          name: k < 0 ? '접평면 경계' : '',
          role: 'secondary',
          points: [
            [-ext, k, z0 + fx * (-ext - p.x) + fy * (k - p.y)],
            [ext, k, z0 + fx * (ext - p.x) + fy * (k - p.y)],
          ],
        });
    } else {
      const t = {
        ...item,
        kind: 'implicit3d' as const,
        cursor: { x: 0, y: 0, z: 0 },
        expressions: [`(${e.f})-(${level})`],
        ranges: {
          x: [-ext, ext] as [number, number],
          y: [-ext, ext] as [number, number],
          z: [-ext, ext] as [number, number],
        },
      };
      Object.assign(s, buildTemplate(t));
      s.point = at;
      if (norm(g)) {
        const N = unit(g),
          seed: Vec3 = Math.abs(N[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0],
          u = unit(cross(N, seed)),
          v = cross(N, u);
        arrow(s, '∇f', at, g);
        s.lines.push({
          name: '접평면',
          role: 'secondary',
          points: [
            add(at, add(u, v)),
            add(at, sub(u, v)),
            sub(at, add(u, v)),
            add(at, sub(v, u)),
            add(at, add(u, v)),
          ],
        });
      } else judgment = 'gradient0이므로 정칙 등위면 접평면 정리를 적용하지 않는다.';
    }
    const r = [e.rx, e.ry, e.rz].map((x) => expression(x, ['t'])),
      rv = r.map((x) => diff(x.node, 't')),
      rq = value3(r, { t: p.t }),
      velocity = value3(rv, { t: p.t }),
      G = value3(grad, scope3(rq));
    const graphPoint = (point: Vec3): Vec3 => [
      point[0],
      point[1],
      f.value({ x: point[0], y: point[1], z: p.z }),
    ];
    s.lines.push({
      name: p.mode === 0 ? '고정 z 단면에 올린 경로' : '합성 경로',
      points: Array.from({ length: 61 }, (_, i) => {
        try {
          const point = value3(r, { t: -1 + (2 * i) / 60 });
          return p.mode === 0 ? graphPoint(point) : point;
        } catch {
          return null;
        }
      }),
    });
    if (p.mode === 0) {
      const sectionGradient = value3(grad, { x: rq[0], y: rq[1], z: p.z });
      arrow(s, '고정 z 단면 경로의 접선', graphPoint(rq), [
        velocity[0],
        velocity[1],
        sectionGradient[0] * velocity[0] + sectionGradient[1] * velocity[1],
      ]);
      notices.push(
        '그래프의 세로축은 함수값이다. 도해의 경로·접선은 고정 z 단면에 올린 것이며, 아래 연쇄법칙 현재값은 입력한 원래 3차원 경로 r(t)에 대한 값이다.',
      );
    } else arrow(s, '경로 속도', rq, velocity);
    values.push(
      ['함수값', level],
      ['gradient', text(g)],
      ['경로 현재점', text(rq)],
      ['경로 합성값 f(r(t))', f.value(scope3(rq))],
      ['연쇄법칙 변화율', dot(G, velocity)],
      [
        '현재 경로의 단위방향 변화율',
        norm(velocity) ? dot(G, unit(velocity)) : '속도0 · 방향 미정의',
      ],
    );
  } else if (kind === 'critical') {
    const f = expression(e.f, ['x', 'y']),
      g = expression(e.g, ['x', 'y']),
      df = derivs(f, ['x', 'y']),
      dg = derivs(g, ['x', 'y']),
      H = [df.map((d) => diff(d.node, 'x')), df.map((d) => diff(d.node, 'y'))];
    let x = p.x,
      y = p.y,
      Lambda = p.lambda;
    const constraintH = [dg.map((d) => diff(d.node, 'x')), dg.map((d) => diff(d.node, 'y'))];
    const history: string[] = [];
    for (let i = 0; i < p.iterations; i++) {
      if (p.task === 1) {
        const q = { x, y },
          G = dg.map((d) => d.value(q));
        if (!Math.hypot(...G)) {
          history.push(`단계${i}: 제약 gradient0 · Lagrange 적용 중단`);
          break;
        }
        const A = [
            [
              H[0][0].value(q) - Lambda * constraintH[0][0].value(q),
              H[0][1].value(q) - Lambda * constraintH[0][1].value(q),
              -G[0],
            ],
            [
              H[1][0].value(q) - Lambda * constraintH[1][0].value(q),
              H[1][1].value(q) - Lambda * constraintH[1][1].value(q),
              -G[1],
            ],
            [G[0], G[1], 0],
          ],
          rhs = [-df[0].value(q) + Lambda * G[0], -df[1].value(q) + Lambda * G[1], -g.value(q)];
        try {
          const solution = lusolve(A, rhs),
            delta = solution as number[][],
            next = [x + delta[0][0], y + delta[1][0], Lambda + delta[2][0]];
          if (!next.every((v) => Number.isFinite(v) && Math.abs(v) < 1e6)) throw Error();
          [x, y, Lambda] = next;
          history.push(`단계${i + 1}: x=${x},y=${y},λ=${Lambda},g=${g.value({ x, y })}`);
        } catch {
          history.push(`단계${i}: Lagrange 조건 Jacobian 특이/수치 범위 · 갱신 중단`);
          break;
        }
        continue;
      }
      const q = { x, y },
        a = H[0][0].value(q),
        b = H[0][1].value(q),
        c = H[1][1].value(q),
        scaleH = Math.max(Math.abs(a), Math.abs(b), Math.abs(c));
      if (!scaleH) {
        history.push(`단계${i}: Hessian0·갱신 중단`);
        break;
      }
      const A = a / scaleH,
        B = b / scaleH,
        C = c / scaleH,
        D = A * C - B * B;
      if (D === 0) {
        history.push(`단계${i}: Hessian 특이·갱신 중단`);
        break;
      }
      const fx = df[0].value(q) / scaleH,
        fy = df[1].value(q) / scaleH,
        dx = (B * fy - C * fx) / D,
        dy = (B * fx - A * fy) / D;
      if (
        !Number.isFinite(dx) ||
        !Number.isFinite(dy) ||
        Math.abs(x + dx) > 1e6 ||
        Math.abs(y + dy) > 1e6
      ) {
        history.push(`단계${i}: 수치 범위·갱신 중단`);
        break;
      }
      x += dx;
      y += dy;
      history.push(`단계${i + 1}: (${x},${y})`);
    }
    const q = { x, y },
      grad = df.map((d) => d.value(q)),
      a = H[0][0].value(q),
      b = H[0][1].value(q),
      c = H[1][1].value(q),
      D = a * c - b * b,
      hs = Math.max(Math.abs(a), Math.abs(b), Math.abs(c)),
      normalized = hs ? (a / hs) * (c / hs) - (b / hs) ** 2 : 0,
      G = dg.map((d) => d.value(q)),
      gn = Math.hypot(...G),
      lambda =
        p.task === 1 ? Lambda : gn ? dot([grad[0], grad[1], 0], [G[0] / gn, G[1] / gn, 0]) / gn : 0;
    judgment = grad.some((v) => v !== 0)
      ? '현재점은 gradient0인 정지점으로 확인되지 않았다. Hessian만으로 극값을 판정하지 않는다.'
      : normalized > 0
        ? a > 0
          ? '이차미분 판정의 국소 극소'
          : '이차미분 판정의 국소 극대'
        : normalized < 0
          ? '이차미분 판정의 안장점'
          : 'D=0 · 이차미분 판정 보류';
    if (x === 0 && y === 0 && e.f === 'x^4+y^4')
      judgment += ' 이 식은 x⁴+y⁴≥0이고 원점에서만0이므로 엄격한 극소이다.';
    if (x === 0 && y === 0 && e.f === 'x^4-y^4')
      judgment += ' x축에서는 양수·y축에서는 음수이므로 이 식의 원점은 안장이다.';
    if (p.task === 1)
      judgment = gn
        ? '제약식 값과 ∇f−λ∇g 잔차를 함께 읽는다. 근사 후보이며 극값·전역해·수렴의 보장이 아니다.'
        : '제약 gradient0 · Lagrange 정리 적용 보류';
    mesh(
      s,
      (x, y) => [x, y, f.value({ x, y })],
      [-p.boundary, p.boundary],
      [-p.boundary, p.boundary],
    );
    s.point = [x, y, f.value(q)];
    values.push(
      ['현재 x', x],
      ['현재 y', y],
      ['f', f.value(q)],
      ['gradient', `(${grad.join(', ')})`],
      ['Hessian determinant D', D],
      ['제약 g', g.value(q)],
      ['제약 gradient 크기', gn],
      ['λ', gn ? lambda : '제약 gradient0 · 적용 보류'],
      [
        'Lagrange 잔차',
        gn ? Math.hypot(grad[0] - lambda * G[0], grad[1] - lambda * G[1]) : '미정의',
      ],
    );
    const t = (p.theta * Math.PI) / 180;
    values.push(['단위원 비교점의 f', f.value({ x: Math.cos(t), y: Math.sin(t) })]);
    const bnd: Vec3[] = [];
    for (let i = 0; i <= 80; i++) {
      const j = i % 20,
        t = (j / 20) * 2 - 1,
        side = Math.floor(i / 20) % 4,
        b = p.boundary,
        X = side === 0 ? t * b : side === 1 ? b : side === 2 ? -t * b : -b,
        Y = side === 0 ? -b : side === 1 ? t * b : side === 2 ? b : -t * b;
      bnd.push([X, Y, f.value({ x: X, y: Y })]);
    }
    s.lines.push({ name: '경계의 값 · 유한 표본', points: bnd, role: 'secondary' });
    values.push(
      ['경계 표본 최소', Math.min(...bnd.map((p) => p[2]))],
      ['경계 표본 최대', Math.max(...bnd.map((p) => p[2]))],
    );
    notices.push(
      ...history,
      '제약식 값0·비영 gradient·Lagrange 잔차0은 필요조건이며 최댓값·최솟값 전체 후보의 발견을 보장하지 않는다. 경계 표본 극값은 엄밀 전역값이 아니다.',
    );
    tex.push(f.tex, g.tex, ...df.map((d) => d.tex));
  } else if (kind === 'integral') {
    const f = expression(e.f, ['x', 'y', 'z']),
      r = [e.rx, e.ry, e.rz].map((x) => expression(x, ['u', 'v', 'w'])),
      dr = ['u', 'v', 'w'].map((v) => r.map((x) => diff(x.node, v))),
      vb = [e.v0, e.v1].map((x) => expression(x, ['u'])),
      wb = [e.w0, e.w1].map((x) => expression(x, ['u', 'v']));
    if (p.dim === 2 && e.rz.trim() !== '0')
      throw Error(
        '평면의 이중적분은 z(u,v,w)=0으로 설정해 주세요. 곡면적분은 면적분 관찰에서 다룬다.',
      );
    const at = (u: number, v: number, w: number) => value3(r, { u, v, w }),
      J = (u: number, v: number, w: number) => {
        const q = { u, v, w },
          a = value3(dr[0], q),
          b = value3(dr[1], q);
        return p.dim === 3 ? dot(a, cross(b, value3(dr[2], q))) : a[0] * b[1] - a[1] * b[0];
      };
    const integral = (n: number) =>
      quad(
        (u) =>
          quad(
            (v) =>
              p.dim === 3
                ? quad(
                    (w) => f.value(scope3(at(u, v, w))) * Math.abs(J(u, v, w)),
                    wb[0].value({ u, v }),
                    wb[1].value({ u, v }),
                    n,
                  )
                : f.value(scope3(at(u, v, 0))) * Math.abs(J(u, v, 0)),
            vb[0].value({ u }),
            vb[1].value({ u }),
            n,
          ),
        p.u0,
        p.u1,
        n,
      );
    const I = integral(12),
      coarse = integral(6),
      current = at(p.u, p.v, p.dim === 3 ? p.w : 0),
      jac = J(p.u, p.v, p.dim === 3 ? p.w : 0);
    s.point = current;
    if (p.dim === 2)
      mesh(
        s,
        (u, t) => {
          const lo = vb[0].value({ u }),
            hi = vb[1].value({ u });
          return at(u, lo + (hi - lo) * t, 0);
        },
        [p.u0, p.u1],
        [0, 1],
      );
    else
      for (const fraction of [0, 0.5, 1]) {
        const points: Vec3[] = [];
        for (let i = 0; i <= 40; i++) {
          const u = p.u0 + ((p.u1 - p.u0) * i) / 40,
            v0 = vb[0].value({ u }),
            v1 = vb[1].value({ u }),
            v = v0 + (v1 - v0) * fraction;
          for (const W of wb) {
            const w = W.value({ u, v });
            points.push(at(u, v, w));
          }
        }
        s.lines.push({ name: `변환 영역 경계 · v 비율 ${fraction}`, points, style: 'scatter' });
      }
    values.push(
      ['반복적분 값 · 근사', I],
      ['6/12점 적분 차이', Math.abs(I - coarse)],
      ['현재 물리 좌표', text(current)],
      ['현재 J', jac],
      ['현재 |J|', Math.abs(jac)],
      ['현재 f', f.value(scope3(current))],
      ['현재 v 구간', `${vb[0].value({ u: p.u })} ≤ v ≤ ${vb[1].value({ u: p.u })}`],
    );
    if (p.dim === 3)
      values.push([
        '현재 w 구간',
        `${wb[0].value({ u: p.u, v: p.v })} ≤ w ≤ ${wb[1].value({ u: p.u, v: p.v })}`,
      ]);
    if (jac === 0)
      notices.push(
        '현재 좌표의 J=0이다. 경계 차트 퇴화인지 내부 정칙성 위반인지 원문 조건과 영역에서 구별해야 한다.',
      );
    notices.push(
      '영역을 바꿔 적분값이 같아졌다는 사실만으로 순서 교환이나 일대일 변환을 증명하지 않는다. 3차원 경계는 유한 표본으로 표시한다.',
    );
    tex.push(f.tex, ...r.map((x) => x.tex), ...vb.map((x) => x.tex), ...wb.map((x) => x.tex));
  } else if (kind === 'density') {
    if (p.lo >= p.hi) throw Error('밀도 영역 시작은 끝보다 작아야 한다.');
    const f = expression(e.f, ['x', 'y', 'z']);
    tex.push(f.tex);
    const D = (x: number, y: number, z: number) => {
      const d = f.value({ x, y, z });
      if (d < 0)
        throw Error('음의 밀도 표본이 있다. 질량·확률 계산을 중단했다. 식 원문과 입력은 보존한다.');
      return d;
    };
    const integrate = (
      fn: (x: number, y: number, z: number) => number,
      n = 12,
      hiX = p.hi,
      hiY = p.hi,
      hiZ = p.hi,
    ) =>
      quad(
        (x) =>
          quad(
            (y) =>
              p.dim === 3
                ? quad((z) => fn(x, y, z) * D(x, y, z), p.lo, hiZ, n)
                : fn(x, y, 0) * D(x, y, 0),
            p.lo,
            hiY,
            n,
          ),
        p.lo,
        hiX,
        n,
      );
    const M = integrate(() => 1);
    if (!(M > 0)) throw Error('총질량이 양수가 아니므로 확률·질량중심을 정의하지 않는다.');
    const means = [
      integrate((x) => x) / M,
      integrate((x, y) => y) / M,
      p.dim === 3 ? integrate((x, y, z) => z) / M : 0,
    ];
    const variances = [
        integrate((x) => (x - means[0]) ** 2) / M,
        integrate((x, y) => (y - means[1]) ** 2) / M,
        p.dim === 3 ? integrate((x, y, z) => (z - means[2]) ** 2) / M : 0,
      ],
      cov = integrate((x, y) => (x - means[0]) * (y - means[1])) / M;
    const upper = (v: number) => Math.max(p.lo, Math.min(p.hi, v)),
      prob = integrate(() => 1, 12, upper(p.a), upper(p.b), upper(p.c)) / M;
    const marginal =
      p.a < p.lo || p.a > p.hi
        ? 0
        : quad(
            (y) => (p.dim === 3 ? quad((z) => D(p.a, y, z), p.lo, p.hi) : D(p.a, y, 0)),
            p.lo,
            p.hi,
          ) / M;
    const x = Array.from({ length: 25 }, (_, i) => p.lo + ((p.hi - p.lo) * i) / 24),
      y = [...x],
      z = y.map((Y) =>
        x.map((X) =>
          p.dim === 3 && (p.c < p.lo || p.c > p.hi) ? null : D(X, Y, p.dim === 3 ? p.c : 0),
        ),
      );
    s.surface = { x, y, z };
    s.is3d = false;
    s.point = [means[0], means[1], 0];
    item.ranges = { x: [p.lo, p.hi], y: [p.lo, p.hi] };
    densityProjection = p.dim === 3 ? `δ(x,y,z=${p.c}) · 질량/길이³` : 'δ(x,y) · 질량/길이²';
    values.push(
      ['총질량 M · 근사', M],
      ['6/12점 질량 차이', Math.abs(M - integrate(() => 1, 6))],
      ['질량중심 / 기댓값', text(means as Vec3)],
      ['Var(X)', variances[0]],
      ['Var(Y)', variances[1]],
      ['Cov(X,Y)', cov],
      [
        'Corr(X,Y)',
        variances[0] && variances[1]
          ? cov / Math.sqrt(variances[0] * variances[1])
          : '분산0 · 미정의',
      ],
      ['사건 확률 · 근사', prob],
      ['주변 확률밀도 pₓ(a) · 근사', marginal],
    );
    if (p.dim === 3) values.push(['Var(Z)', variances[2]], ['현재 밀도 단면 z', p.c]);
    notices.push(
      '음의 표본 발견은 반례지만 비음수 표본만으로 전역 비음수성을 증명하지 않는다. 사건 경계는 실제 영역과의 교집합을 적분하며 입력값은 유지한다. 밀도의 단위와 확률(무차원)을 구별한다.',
    );
  } else if (kind === 'flux') {
    const F = [e.Fx, e.Fy, e.Fz].map((x) => expression(x, ['x', 'y', 'z'])),
      h = expression(e.h, ['x', 'y', 'z']),
      dF = F.map((f, i) => diff(f.node, ['x', 'y', 'z'][i])),
      div = (q: Vec3) => dF.reduce((a, d) => a + d.value(scope3(q)), 0);
    tex.push(...F.map((f) => f.tex), h.tex, ...dF.map((f) => f.tex));
    if (p.closed === 2) {
      const faces: Array<[string, number]> = [];
      for (let axis = 0; axis < 3; axis++)
        for (const edge of [0, 1]) {
          const other = [0, 1, 2].filter((a) => a !== axis),
            val = quad(
              (u) =>
                quad(
                  (v) => {
                    const q: Vec3 = [0, 0, 0];
                    q[axis] = edge;
                    q[other[0]] = u;
                    q[other[1]] = v;
                    return F[axis].value(scope3(q)) * (edge === 1 ? 1 : -1) * p.sign;
                  },
                  0,
                  1,
                ),
              0,
              1,
            );
          faces.push([`${['x', 'y', 'z'][axis]}=${edge} 면의 플럭스`, val]);
        }
      const flux = faces.reduce((a, v) => a + v[1], 0),
        volume = quad((x) => quad((y) => quad((z) => div([x, y, z]), 0, 1), 0, 1), 0, 1) * p.sign;
      values.push(
        ...faces,
        ['폐곡면 플럭스 · 근사', flux],
        ['내부 발산 적분 · 방향 포함 근사', volume],
        ['두 값의 수치 잔차', Math.abs(flux - volume)],
      );
      mesh(s, (x, y) => [x, y, 1], [0, 1], [0, 1]);
      for (const z of [0, 1])
        s.lines.push({
          name: `단위정육면체 z=${z}`,
          points: [
            [0, 0, z],
            [1, 0, z],
            [1, 1, z],
            [0, 1, z],
            [0, 0, z],
          ],
        });
      notices.push(
        '현재 대상은 고정된 단위정육면체이다. 입력한 임의 패치식은 보존되며 열린 패치 선택에서 사용한다.',
      );
    } else {
      const sphere = p.closed === 1,
        r = sphere
          ? ['sin(u)*cos(v)', 'sin(u)*sin(v)', 'cos(u)'].map((x) => expression(x, ['u', 'v']))
          : [e.rx, e.ry, e.rz].map((x) => expression(x, ['u', 'v'])),
        ru = r.map((x) => diff(x.node, 'u')),
        rv = r.map((x) => diff(x.node, 'v')),
        b = sphere ? { ...p, u0: 0, u1: Math.PI, v0: 0, v1: 2 * Math.PI } : p;
      const at = (u: number, v: number) => value3(r, { u, v }),
        normal = (u: number, v: number) => cross(value3(ru, { u, v }), value3(rv, { u, v }));
      mesh(s, at, [b.u0, b.u1], [b.v0, b.v1]);
      const q = at(p.u, p.v),
        N = normal(p.u, p.v),
        J = norm(N);
      s.point = q;
      if (J) arrow(s, '현재 단위법선', q, scale(unit(N), p.sign));
      else
        notices.push(
          '현재 차트의 ru×rv=0: 단위법선 직접 계산을 중단했다. 차트 경계와 곡면 자체를 구별한다.',
        );
      const flux = (n: number) =>
          tensor((u, v) => dot(value3(F, scope3(at(u, v))), normal(u, v)) * p.sign, b, n),
        phi = flux(12);
      values.push(
        ['현재 면적 요소 |ru×rv|', J],
        ['면적 · 근사', tensor((u, v) => norm(normal(u, v)), b)],
        [
          '스칼라 면적분 · 근사',
          tensor((u, v) => h.value(scope3(at(u, v))) * norm(normal(u, v)), b),
        ],
        ['플럭스 · 근사', phi],
        ['6/12점 플럭스 차이', Math.abs(phi - flux(6))],
      );
      if (sphere) {
        const volume =
          quad(
            (rho) =>
              quad(
                (phi) =>
                  quad(
                    (theta) =>
                      div([
                        rho * Math.sin(phi) * Math.cos(theta),
                        rho * Math.sin(phi) * Math.sin(theta),
                        rho * Math.cos(phi),
                      ]) *
                      rho *
                      rho *
                      Math.sin(phi),
                    0,
                    2 * Math.PI,
                  ),
                0,
                Math.PI,
              ),
            0,
            1,
          ) * p.sign;
        values.push(
          ['내부 발산 적분 · 방향 포함 근사', volume],
          ['두 값의 수치 잔차', Math.abs(phi - volume)],
        );
        notices.push(
          '현재 대상은 고정된 단위구이다. 구면 차트의 u=φ,v=θ를 사용한다. 입력한 임의 패치식은 열린 패치에서 사용한다.',
        );
      }
      tex.push(...r.map((x) => x.tex));
    }
    notices.push(
      '방향 ε=−1이면 외향 플럭스의 음수와 비교한다. 발산정리의 C¹·폐곡면·외향 조건을 수치 잔차만으로 입증하지 않는다.',
    );
  } else if (kind === 'stokes') {
    const F = [e.Fx, e.Fy, e.Fz].map((x) => expression(x, ['x', 'y', 'z'])),
      d = F.map((f) => derivs(f, ['x', 'y', 'z'])),
      curl = (q: Vec3): Vec3 => {
        const s = scope3(q);
        return [
          d[2][1].value(s) - d[1][2].value(s),
          d[0][2].value(s) - d[2][0].value(s),
          d[1][0].value(s) - d[0][1].value(s),
        ];
      };
    tex.push(...F.map((x) => x.tex));
    const patches = [
      ['rx', 'ry', 'rz'],
      ['sx', 'sy', 'sz'],
    ].map((keys) => {
      const r = keys.map((k) => expression(e[k], ['u', 'v'])),
        ru = r.map((f) => diff(f.node, 'u')),
        rv = r.map((f) => diff(f.node, 'v')),
        at = (u: number, v: number) => value3(r, { u, v }),
        normal = (u: number, v: number) => cross(value3(ru, { u, v }), value3(rv, { u, v }));
      const edges = [
        {
          a: p.u0,
          b: p.u1,
          at: (t: number) => at(t, p.v0),
          velocity: (t: number) => value3(ru, { u: t, v: p.v0 }),
          sign: 1,
        },
        {
          a: p.v0,
          b: p.v1,
          at: (t: number) => at(p.u1, t),
          velocity: (t: number) => value3(rv, { u: p.u1, v: t }),
          sign: 1,
        },
        {
          a: p.u0,
          b: p.u1,
          at: (t: number) => at(t, p.v1),
          velocity: (t: number) => value3(ru, { u: t, v: p.v1 }),
          sign: -1,
        },
        {
          a: p.v0,
          b: p.v1,
          at: (t: number) => at(p.u0, t),
          velocity: (t: number) => value3(rv, { u: p.u0, v: t }),
          sign: -1,
        },
      ];
      const line = (n: number) =>
          edges.reduce(
            (sum, edge) =>
              sum +
              edge.sign *
                p.sign *
                quad(
                  (t) => dot(value3(F, scope3(edge.at(t))), edge.velocity(t)),
                  edge.a,
                  edge.b,
                  n,
                ),
            0,
          ),
        surface = (n: number) => tensor((u, v) => dot(curl(at(u, v)), normal(u, v)) * p.sign, p, n);
      return { at, normal, edges, line, surface, r };
    });
    mesh(s, patches[0].at, [p.u0, p.u1], [p.v0, p.v1]);
    const q = patches[0].at(p.u, p.v);
    s.point = q;
    const N = patches[0].normal(p.u, p.v);
    if (norm(N)) arrow(s, '현재 방향 법선', q, scale(unit(N), p.sign));
    const polar = p.boundary === 1;
    let difference = 0,
      seamError = 0,
      centerError = 0;
    for (let j = 0; j < 2; j++) {
      const a = patches[j];
      for (let i = 0; i < 4; i++) {
        const edge = a.edges[i],
          points = Array.from({ length: 33 }, (_, n) =>
            edge.at(edge.a + ((edge.b - edge.a) * n) / 32),
          );
        if (edge.sign * p.sign < 0) points.reverse();
        s.lines.push({
          name: `${j ? '비교' : '첫'} 곡면 경계 ${i + 1} · 방향 ε=${p.sign}`,
          points,
          role: j ? 'secondary' : undefined,
        });
      }
      if (j)
        for (const fraction of [0.25, 0.5, 0.75])
          s.lines.push({
            name: '비교곡면 내부',
            role: 'secondary',
            points: Array.from({ length: 25 }, (_, i) =>
              a.at(p.u0 + ((p.u1 - p.u0) * i) / 24, p.v0 + (p.v1 - p.v0) * fraction),
            ),
          });
      const S = a.surface(12),
        L = a.line(12);
      values.push(
        [`${j ? '비교' : '첫'} 곡면 회전 면적분 · 근사`, S],
        [`${j ? '비교' : '첫'} 경계 선적분 · 근사`, L],
        [`${j ? '비교' : '첫'} 선·면 수치 잔차`, Math.abs(S - L)],
        [`${j ? '비교' : '첫'} 6/12점 면적분 차이`, Math.abs(S - a.surface(6))],
      );
    }
    for (let i = 0; i <= 32; i++) {
      const t = i / 32;
      for (let edge = 0; edge < 4; edge++) {
        if (polar && edge !== 1) continue;
        const a = patches[0].edges[edge],
          b = patches[1].edges[edge];
        difference = Math.max(
          difference,
          norm(sub(a.at(a.a + (a.b - a.a) * t), b.at(b.a + (b.b - b.a) * t))),
        );
      }
      if (polar)
        for (const a of patches) {
          const u = p.u0 + (p.u1 - p.u0) * t,
            v = p.v0 + (p.v1 - p.v0) * t;
          seamError = Math.max(seamError, norm(sub(a.at(u, p.v0), a.at(u, p.v1))));
          centerError = Math.max(centerError, norm(sub(a.at(p.u0, v), a.at(p.u0, p.v0))));
        }
    }
    values.push(['대응 경계 표본의 최대 거리', difference]);
    if (polar)
      values.push(
        ['각 차트 이음선 표본 잔차', seamError],
        ['각 차트 중심 붕괴 표본 잔차', centerError],
      );
    if (difference > 1e-8 || (polar && (seamError > 1e-8 || centerError > 1e-8)))
      judgment =
        '현재 경계 표본에서 불일치가 확인됐다. 같은 경계의 두 곡면 정리를 적용하지 않는다.';
    else
      notices.push(
        '경계 표본 일치는 경계 동일성의 증명이 아니다. 원식과 영역에서 동일한 경계·방향을 따로 확인한다.',
      );
    if (polar)
      notices.push(
        '주기 차트는 v 양 끝 이음선이 각 곡면 안에서 취소되고 u 시작이 한 점으로 붕괴해야 한다. 실제 바깥 경계는 u 끝의 곡선이다. 차트 중심 두 점의 높이가 달라도 서로 다른 경계라는 뜻은 아니다.',
      );
    tex.push(...patches.flatMap((a) => a.r.map((f) => f.tex)));
  } else if (kind === 'line') {
    if (p.lo >= p.hi) throw Error('경로 시작은 끝보다 작아야 한다. 방향은 ε로 따로 조절한다.');
    const r = [e.rx, e.ry, e.rz].map((x) => expression(x, ['t'])),
      v = r.map((f) => diff(f.node, 't')),
      F = [e.Fx, e.Fy, e.Fz].map((x) => expression(x, ['x', 'y', 'z'])),
      h = expression(e.h, ['x', 'y', 'z']),
      potential = expression(e.potential, ['x', 'y', 'z']),
      gradient = derivs(potential, ['x', 'y', 'z']),
      at = (t: number) => value3(r, { t }),
      velocity = (t: number) => value3(v, { t }),
      Iv = (n: number) =>
        quad((t) => dot(value3(F, scope3(at(t))), velocity(t)) * p.sign, p.lo, p.hi, n),
      Is = (n: number) => quad((t) => h.value(scope3(at(t))) * norm(velocity(t)), p.lo, p.hi, n);
    const points = Array.from({ length: 81 }, (_, i) => at(p.lo + ((p.hi - p.lo) * i) / 80));
    if (p.sign < 0) points.reverse();
    s.lines.push({ name: '방향을 가진 열린 경로', points });
    s.point = at(p.t);
    arrow(s, '방향 속도', s.point, scale(velocity(p.t), p.sign));
    const current = scope3(s.point),
      residual = norm(sub(value3(F, current), value3(gradient, current)));
    const potentialDelta =
      (potential.value(scope3(at(p.hi))) - potential.value(scope3(at(p.lo)))) * p.sign;
    values.push(
      ['벡터 선적분 · 근사', Iv(12)],
      ['스칼라 선적분 · 근사', Is(12)],
      ['호의 길이 · 근사', quad((t) => norm(velocity(t)), p.lo, p.hi)],
      ['끝점 퍼텐셜 차이', potentialDelta],
      ['현재 F−∇ψ 잔차', residual],
      ['6/12점 벡터 적분 차이', Math.abs(Iv(12) - Iv(6))],
      ['6/12점 스칼라 적분 차이', Math.abs(Is(12) - Is(6))],
    );
    if (residual > 1e-10)
      judgment = '현재점에서 F=∇ψ 불일치가 확인됐다. 퍼텐셜 차이 공식을 적용하지 않는다.';
    else
      notices.push(
        '현재점의 F−∇ψ 잔차0은 경로 근방 전체의 동일성 증명이 아니다. 퍼텐셜 차이와 실제 선적분을 별도로 계산한다.',
      );
    tex.push(...r.map((f) => f.tex), ...F.map((f) => f.tex), h.tex, potential.tex);
    notices.push(
      '방향을 바꾸면 벡터 선적분과 퍼텐셜 끝점 순서는 반대가 되지만 ds로 누적한 값은 유지된다. 단위와 정의역은 원문 조건을 함께 읽는다.',
    );
  } else if (kind === 'operators') {
    const f = expression(e.f, ['x', 'y', 'z']),
      F = [e.Fx, e.Fy, e.Fz].map((x) => expression(x, ['x', 'y', 'z'])),
      df = derivs(f, ['x', 'y', 'z']),
      dF = F.map((x) => derivs(x, ['x', 'y', 'z'])),
      q: Vec3 = [p.x, p.y, p.z],
      S = scope3(q),
      G = value3(df, S),
      C: Vec3 = [
        dF[2][1].value(S) - dF[1][2].value(S),
        dF[0][2].value(S) - dF[2][0].value(S),
        dF[1][0].value(S) - dF[0][1].value(S),
      ],
      D = dF.reduce((s, a, i) => s + a[i].value(S), 0),
      L = df.reduce((s, a, i) => s + diff(a.node, ['x', 'y', 'z'][i]).value(S), 0);
    s.point = q;
    arrow(s, '직교 gradient', q, G);
    arrow(s, '직교 curl', q, C);
    values.push(
      ['직교 gradient', text(G)],
      ['직교 divergence', D],
      ['직교 curl', text(C)],
      ['직교 Laplacian', L],
    );
    tex.push(f.tex, ...F.map((x) => x.tex));
    const radial = Math.hypot(p.x, p.y),
      rho = norm(q),
      theta = Math.atan2(p.y, p.x),
      phi = rho ? Math.acos(Math.max(-1, Math.min(1, p.z / rho))) : 0;
    const converted = (node: MathNode, map: Record<string, string>) =>
      node.transform((n) =>
        n.type === 'SymbolNode' && Object.hasOwn(map, (n as unknown as { name: string }).name)
          ? parse(map[(n as unknown as { name: string }).name])
          : n,
      );
    const generated = (source: string) => {
      const cached = generatedCache.get(source);
      if (cached) return cached;
      const node = parse(source);
      let n = 0;
      node.traverse(() => {
        if (++n > 2000) throw Error('좌표변환식이 너무 길다. 식을 나누어 관찰해 주세요.');
      });
      if (generatedCache.size >= 256) generatedCache.delete(generatedCache.keys().next().value!);
      generatedCache.set(source, node);
      return node;
    };
    const component = (node: MathNode, scope: Record<string, number>) =>
        executor(node.compile())(scope),
      der = (node: MathNode, variable: string) => diff(node, variable).node,
      plus = (nodes: MathNode[]) => generated(nodes.map((n) => `(${n.toString()})`).join('+'));
    for (const system of ['원통', '구면']) {
      if (radial === 0 || rho === 0) {
        values.push([system + ' 좌표 직접 대입', '축/원점의 분모0 · 좌표식 적용 보류']);
        continue;
      }
      const sphere = system === '구면',
        variables = sphere ? ['rho', 'theta', 'phi'] : ['r', 'theta', 'z'],
        scope: Record<string, number> = sphere ? { rho, theta, phi } : { r: radial, theta, z: p.z },
        mapping = sphere
          ? { x: 'rho*sin(phi)*cos(theta)', y: 'rho*sin(phi)*sin(theta)', z: 'rho*cos(phi)' }
          : { x: 'r*cos(theta)', y: 'r*sin(theta)', z: 'z' },
        basis = sphere
          ? [
              ['sin(phi)*cos(theta)', 'sin(phi)*sin(theta)', 'cos(phi)'],
              ['-sin(theta)', 'cos(theta)', '0'],
              ['cos(phi)*cos(theta)', 'cos(phi)*sin(theta)', '-sin(phi)'],
            ]
          : [
              ['cos(theta)', 'sin(theta)', '0'],
              ['-sin(theta)', 'cos(theta)', '0'],
              ['0', '0', '1'],
            ],
        fn = generated(converted(f.node, mapping).toString()),
        field = F.map((v) => generated(converted(v.node, mapping).toString())),
        fc = basis.map((b) =>
          generated(field.map((v, i) => `(${v.toString()})*(${b[i]})`).join('+')),
        ),
        t = (n: MathNode) => `(${n.toString()})`,
        grad = variables.map((v, i) =>
          generated(
            `${t(der(fn, v))}/(${sphere ? ['1', 'rho*sin(phi)', 'rho'][i] : ['1', 'r', '1'][i]})`,
          ),
        );
      let divergence: MathNode, laplacian: MathNode, rotation: MathNode[];
      if (sphere) {
        divergence = generated(
          `${t(der(generated(`rho^2*${t(fc[0])}`), 'rho'))}/rho^2+${t(der(fc[1], 'theta'))}/(rho*sin(phi))+${t(der(generated(`sin(phi)*${t(fc[2])}`), 'phi'))}/(rho*sin(phi))`,
        );
        laplacian = generated(
          `${t(der(generated(`rho^2*${t(der(fn, 'rho'))}`), 'rho'))}/rho^2+${t(der(der(fn, 'theta'), 'theta'))}/(rho^2*sin(phi)^2)+${t(der(generated(`sin(phi)*${t(der(fn, 'phi'))}`), 'phi'))}/(rho^2*sin(phi))`,
        );
        rotation = [
          generated(
            `(${t(der(generated(`sin(phi)*${t(fc[1])}`), 'phi'))}-${t(der(fc[2], 'theta'))})/(rho*sin(phi))`,
          ),
          generated(`(${t(der(generated(`rho*${t(fc[2])}`), 'rho'))}-${t(der(fc[0], 'phi'))})/rho`),
          generated(
            `(${t(der(fc[0], 'theta'))}/sin(phi)-${t(der(generated(`rho*${t(fc[1])}`), 'rho'))})/rho`,
          ),
        ];
      } else {
        divergence = generated(
          `${t(der(generated(`r*${t(fc[0])}`), 'r'))}/r+${t(der(fc[1], 'theta'))}/r+${t(der(fc[2], 'z'))}`,
        );
        laplacian = generated(
          `${t(der(generated(`r*${t(der(fn, 'r'))}`), 'r'))}/r+${t(der(der(fn, 'theta'), 'theta'))}/r^2+${t(der(der(fn, 'z'), 'z'))}`,
        );
        rotation = [
          generated(`${t(der(fc[2], 'theta'))}/r-${t(der(fc[1], 'z'))}`),
          generated(`${t(der(fc[0], 'z'))}-${t(der(fc[2], 'r'))}`),
          generated(`(${t(der(generated(`r*${t(fc[1])}`), 'r'))}-${t(der(fc[0], 'theta'))})/r`),
        ];
      }
      const coeffG = grad.map((n) => component(n, scope)) as Vec3,
        coeffC = rotation.map((n) => component(n, scope)) as Vec3,
        b = basis.map((row) => row.map((x) => component(generated(x), scope)) as Vec3),
        toCartesian = (c: Vec3) =>
          b.reduce((sum, v, i) => add(sum, scale(v, c[i])), [0, 0, 0] as Vec3),
        div = component(divergence, scope),
        lap = component(laplacian, scope);
      values.push(
        [system + ' gradient 성분', text(coeffG)],
        [system + ' divergence', div],
        [system + ' curl 성분', text(coeffC)],
        [system + ' Laplacian', lap],
        [
          system + ' 직교 환산 최대 잔차',
          Math.max(
            norm(sub(toCartesian(coeffG), G)),
            norm(sub(toCartesian(coeffC), C)),
            Math.abs(div - D),
            Math.abs(lap - L),
          ),
        ],
      );
      tex.push(
        ...grad.map((n) => n.toTex()),
        divergence.toTex(),
        ...rotation.map((n) => n.toTex()),
        laplacian.toTex(),
      );
    }
    notices.push(
      '구면 성분 순서는 (ρ,θ,φ)이다. 이 순서의 기저 방향을 curl 부호에 반영했다. 축에서 좌표식을 보류해도 직교장 자체가 정의되지 않는다는 뜻은 아니다.',
    );
  }
  if (values.some(([, v]) => typeof v === 'number' && !Number.isFinite(v)))
    throw Error('현재 조건의 계산값이 수치 정밀도 범위를 벗어났다. 성공값으로 표시하지 않았다.');
  s.tex = tex;
  return { spatial: s, values, tex, judgment, notices, item, densityProjection };
}
export function checkGeneralExpressions(kind: GeneralKind, expressions: Record<string, string>) {
  const fields = VECTOR_GENERAL_SPECS[kind].fields;
  for (const [key] of fields) {
    const variables =
      kind === 'curve' || ((kind === 'differential' || kind === 'line') && key.startsWith('r'))
        ? ['t']
        : key.startsWith('r') || key.startsWith('s')
          ? ['u', 'v', 'w']
          : key === 'map'
            ? ['t']
            : key === 'v0' || key === 'v1'
              ? ['u']
              : key === 'w0' || key === 'w1'
                ? ['u', 'v']
                : ['x', 'y', 'z'];
    expression(expressions[key], variables);
  }
}
