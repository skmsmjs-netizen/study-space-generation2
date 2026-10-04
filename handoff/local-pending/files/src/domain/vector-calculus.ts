import content from './vector-calculus-content.json';
import { VECTOR_EXTENSION_SPECS } from './vector-calculus-extensions';

export const VECTOR_MODULES = content;
export type VectorId = string;
export interface Parameter {
  key: string;
  label: string;
  min: number;
  max: number;
  initial: number;
  integer?: boolean;
  options?: string[];
}
export interface ObservationSpec {
  parameters: Parameter[];
  question: string;
  fixed: string;
  initialReason: string;
  limitations: string;
  equations: string[];
}
const parameter = (
  key: string,
  label: string,
  min: number,
  max: number,
  initial: number,
  integer = false,
): Parameter => ({ key, label, min, max, initial, integer });
const angle = parameter('theta', 'θ · 각도 (°)', 0, 180, 60);
const radius = parameter('r', '반지름 r', 0, 3, 1);
export const VECTOR_SPECS: Record<string, ObservationSpec> = {
  ...VECTOR_EXTENSION_SPECS,
  A1: {
    parameters: [parameter('a', 'v의 x 성분', -3, 3, 2), parameter('b', 'w의 y 성분', -3, 3, 1)],
    question: 'v=(a,1,0), w=(1,b,0)의 합과 크기는 어떻게 달라지는가?',
    fixed: '같은 직교좌표·추상 길이 단위; v의 y=1, w의 x=1, 두 z=0.',
    initialReason: '두 성분의 합과 평행사변형을 동시에 읽는 비영벡터.',
    limitations: '평면 부분공간의 예시이며 임의 3차원 연산 전체를 대신하지 않는다.',
    equations: ['\\mathbf v=(a,1,0),\\quad\\mathbf w=(1,b,0)'],
  },
  A2: {
    parameters: [angle, parameter('a', 'v의 크기', 0, 3, 2), parameter('b', 'w의 크기', 0, 3, 1.5)],
    question: '같은 두 벡터의 각도 θ와 내적·정사영은 어떻게 대응하는가?',
    fixed: 'v=(a,0,0), w=(b cosθ,b sinθ,0), 직교좌표.',
    initialReason: 'θ=60°는 양의 내적과 투영의 차이를 보여준다.',
    limitations:
      '영벡터의 내적은 0이지만 각도는 정의되지 않는다. 기준 w=0이면 정사영도 정의되지 않는다.',
    equations: ['\\mathbf v=(a,0,0),\\quad\\mathbf w=(b\\cos\\theta,b\\sin\\theta,0)'],
  },
  A3: {
    parameters: [angle, parameter('a', 'v의 크기', 0, 3, 2), parameter('b', 'w의 크기', 0, 3, 1.5)],
    question: '두 평면 벡터의 각도와 외적의 z 성분·넓이는 어떻게 대응하는가?',
    fixed: 'A2와 같은 벡터, 외적 순서는 v×w; 오른손 직교기저.',
    initialReason: '비평행 벡터에서 법선과 넓이가 모두 비영.',
    limitations:
      'xy 평면 도해에서 z 법선을 평면 화살표로 가장하지 않는다. 직선·평면·삼중곱은 아래 정적 설명으로 연결한다.',
    equations: ['\\mathbf v\\times\\mathbf w=(0,0,ab\\sin\\theta)'],
  },
  A4: {
    parameters: [
      { ...radius, label: '구면 반지름 ρ' },
      parameter('phi', 'φ · +z축에서의 각도 (°)', 0, 180, 60),
      parameter('theta', 'θ · 방위각 (°)', -180, 180, 30),
    ],
    question: '구면좌표 (ρ,θ,φ)와 직교좌표의 같은 점은 어떻게 대응하는가?',
    fixed: 'ρ는 구면 반지름이고 φ는 +z축에서 잰다. 도해는 자오선 (s,z).',
    initialReason: '극과 원점을 벗어난 점에서 세 좌표의 역할을 구별.',
    limitations:
      '자오선 그림은 3차원 전체 모습이 아니다. 원점·극의 좌표 비유일성과 장 자체의 특이점을 구별한다. 관찰의 −180°~180° 방위각은 교재의 [0,2π)로 환산하는 동등한 가지이다. 이차곡면 전체는 정적 설명.',
    equations: [
      'x=\\rho\\sin\\phi\\cos\\theta,\\ y=\\rho\\sin\\phi\\sin\\theta,\\ z=\\rho\\cos\\phi',
    ],
  },
  A5: {
    parameters: [
      { ...radius, label: '나선 반지름 a' },
      parameter('h', '나선의 상승 계수 h', -2, 2, 0.5),
      parameter('t', '현재 t (rad)', 0, 6.283185307179586, 1),
    ],
    question: '나선의 현재 점·속력·호의 길이는 같은 t에서 어떻게 이어지는가?',
    fixed: 'r(t)=(a cos t,a sin t,h t), a=반지름; t∈[0,2π]. 도해는 xy 투영.',
    initialReason: '반지름1·상승0.5에서 위치와 속력의 역할을 구별.',
    limitations:
      '투영에서 공간 호의 길이를 눈으로 재지 않는다. 3D·T/N/B는 기존 공간곡선 도구에서 조절하며 별도 초안을 유지한다.',
    equations: ['\\mathbf r(t)=(a\\cos t,a\\sin t,ht),\\quad s(t)=t\\sqrt{a^2+h^2}'],
  },
  B1: {
    parameters: [
      parameter('m', '접근 직선 기울기 m', -3, 3, 1),
      parameter('t', '원점 접근 거리 t', 0, 1, 0.2),
    ],
    question: 'f=xy/(x²+y²)를 원점으로 보낼 때 직선 경로마다 값이 같은가?',
    fixed: 'x=t, y=m t; t>0에서 평가, 원점 식은 정의되지 않음.',
    initialReason: 'm=1과 m=0을 비교하면 경로 의존성이 드러난다.',
    limitations:
      '유한 표본의 일치를 극한 존재의 증명으로 삼지 않는다. 여기서는 y=0과 y=x의 정확한 서로 다른 경로 극한으로 비존재를 설명한다.',
    equations: ['f(x,y)=\\frac{xy}{x^2+y^2},\\quad f(t,mt)=\\frac{m}{1+m^2}\\ (t\\ne0)'],
  },
  B2: {
    parameters: [
      parameter('x', '점의 x', -2, 2, 1),
      parameter('y', '점의 y', -2, 2, 1),
      parameter('theta', '방향 θ (°)', -180, 180, 45),
    ],
    question: '같은 점의 ∇f와 단위방향 v는 방향미분 D_v f를 어떻게 정하는가?',
    fixed: 'f=x²+y²; v=(cosθ,sinθ)이며 ||v||=1.',
    initialReason: '(1,1),45°에서 최급상승과 방향미분을 비교.',
    limitations:
      '2차원 정의역 그림이다. 높이 곡면과 음함수 접평면·연쇄법칙은 아래 식 및 기존 곡면 도구에 따로 연결한다.',
    equations: [
      'f=x^2+y^2,\\quad\\nabla f=(2x,2y),\\quad D_{\\mathbf v}f=2x\\cos\\theta+2y\\sin\\theta',
    ],
  },
  B3: {
    parameters: [
      parameter('x', 'Newton 시작값 x₀', -2, 3, 1),
      parameter('n', '반복 단계 n', 0, 8, 1, true),
    ],
    question: 'Newton 방법에서 시작점과 분모 조건은 반복 결과를 어떻게 바꾸는가?',
    fixed: 'g(x)=x²−2; x_{k+1}=(x_k+2/x_k)/2; 반복은 최대8단계.',
    initialReason: 'x₀=1에서 √2로 향하는 대표 경로.',
    limitations:
      'x_k=0이면 반복식 적용 불가이며 근 자체가 없다는 뜻이 아니다. 다변수 극값 판정·제약 극값은 ‘다변수 극값과 제약’에서 이차형 모형으로 비교한다. 이 스칼라 반복식과 구별한다.',
    equations: ['x_{k+1}=x_k-\\frac{x_k^2-2}{2x_k}'],
  },
  C1: {
    parameters: [
      parameter('a', '직사각형 가로 a', 0, 3, 2),
      parameter('b', '직사각형 세로 b', 0, 3, 1),
      parameter('n', '한 축 분할 수 n', 1, 20, 4, true),
    ],
    question: '같은 영역의 표본합과 이중적분의 정확값은 어떻게 대응하는가?',
    fixed: 'R=[0,a]×[0,b], f=x+y; 우측 끝점 Riemann 합.',
    initialReason: '4×4 분할에서 과대근사와 정확 적분을 비교.',
    limitations:
      '이 예시의 f는 비음수이고 연속이다. 유한합은 적분의 증명이 아니며 삼각형 영역·구의 삼중적분은 ‘영역·절단·적분 순서’에서 별도로 비교한다.',
    equations: ['I=\\int_0^a\\int_0^b(x+y)\\,dy\\,dx=\\frac{ab(a+b)}2'],
  },
  C2: {
    parameters: [
      parameter('n', '표본 수 N', 1, 500, 100, true),
      parameter('seed', '난수 시드', 1, 999, 17, true),
    ],
    question: '고정된 시드·표본 수에서 Monte Carlo 추정과 실제 오차는 얼마나 다른가?',
    fixed: '[0,1]², f=x+y, 설명용 의사난수 LCG. 정확값 I=1.',
    initialReason: '100개 표본과 재현 가능한 시드17로 누적 추정을 비교.',
    limitations:
      '의사난수 표본은 독립 확률 표본의 입증이 아니다. 표시 표준오차는 독립 균등 표본 모형을 가정한 참고값이며 신뢰구간/일반 증명을 보장하지 않는다.',
    equations: ['\\widehat I=\\frac1N\\sum_{k=1}^N(x_k+y_k)'],
  },
  C3: {
    parameters: [parameter('a', 'u축 확대 a', -3, 3, 2), parameter('b', 'v축 확대 b', -3, 3, 1)],
    question: '좌표변환의 행렬식 부호와 면적 배율은 어떻게 다른가?',
    fixed: 'x=a u, y=b v, (u,v)∈[0,1]²; 선형 예시.',
    initialReason: 'a=2,b=1에서 면적 두 배를 비교.',
    limitations:
      'a b=0이면 역변환 정칙 조건이 깨진다. 그림이 납작해지는 것을 모든 변수변환 적분의 불가능으로 확대하지 않는다. 극/원통/구면 변환은 정적 식.',
    equations: ['\\det J=ab,\\quad dA=|ab|\\,du\\,dv'],
  },
  C4: {
    parameters: [parameter('k', '밀도 기울기 k', -1, 3, 1)],
    question: '밀도 변화와 질량중심·기댓값은 같은 가중 적분에 어떻게 연결되는가?',
    fixed: '설명용 선분 x∈[0,1], 밀도δ=1+k x; 이를 정규화한 확률밀도.',
    initialReason: 'k=1에서 균일한 밀도보다 오른쪽으로 이동.',
    limitations:
      '이 선분 모형과 책의 2D/3D 질량 적분을 구별한다. 단위 있는 질량 밀도와 확률밀도는 정규화 전후에 단위가 다르다.',
    equations: ['M=1+k/2,\\quad\\overline x=\\frac{1/2+k/3}{1+k/2}'],
  },
  D1: {
    parameters: [radius, parameter('sign', '진행 방향 ε', -1, 1, 1, true)],
    question: '원형 경로의 진행 방향은 벡터장 선적분을 어떻게 바꾸는가?',
    fixed: 'f=(−y/2,x/2); 원점 중심 원, ε=+1 반시계/−1 시계.',
    initialReason: '양의 방향과 비보존장 순환을 비교.',
    limitations:
      '이 장의 회전은1이므로 전역 퍼텐셜을 가정하지 않는다. 경로 독립/퍼텐셜은 조건과 정적 식으로 구별한다.',
    equations: ['\\oint_C\\mathbf f\\cdot d\\mathbf r=\\varepsilon\\pi r^2'],
  },
  D2: {
    parameters: [
      radius,
      parameter('sign', '경계 방향 ε', -1, 1, 1, true),
      parameter('hole', '원점 특이점 모형 (0:매끈, 1:특이)', 0, 1, 0, true),
    ],
    question: '경계 방향과 장의 정칙성 조건이 그린 정리 적용에 어떤 차이를 만드는가?',
    fixed: '매끈한 장 (−y/2,x/2), 또는 원점에서 미정의인 장 (−y/(x²+y²),x/(x²+y²)); 원판 경계.',
    initialReason: '매끈한 장과 양의 방향에서 경계=내부를 비교.',
    limitations:
      '특이장 원판에서 조건 위반은 정리 적용 불가이다. 순환2π와 원점 밖 회전0을 오류 없이 따로 읽는다. 원점을 뺀 영역에는 안쪽 경계가 추가된다.',
    equations: ['\\oint_{\\partial R}(P\\,dx+Q\\,dy)=\\iint_R(Q_x-P_y)\\,dA'],
  },
  D3: {
    parameters: [radius],
    question: '구의 바깥 플럭스와 부피 안의 발산 적분은 어떻게 같은 값을 갖는가?',
    fixed: 'f=(x,y,z), div f=3, 반지름r의 구와 바깥 단위법선.',
    initialReason: 'r=1에서 플럭스4π와 발산×부피의 대응.',
    limitations:
      '도해는 구의 중앙 단면이다. r=0은 정칙 닫힌 곡면이 아니며 극한값0과 정리 적용을 구별한다. 일반 매개곡면·곡면면적분은 부분 대응.',
    equations: [
      '\\iint_\\Sigma\\mathbf f\\cdot\\mathbf n\\,d\\sigma=4\\pi r^3=3\\cdot\\frac{4\\pi r^3}3',
    ],
  },
  D4: {
    parameters: [radius, parameter('sign', '법선 방향 ε', -1, 1, 1, true)],
    question: '원판 법선과 오른손 경계 방향을 함께 뒤집으면 양쪽 적분은 어떻게 바뀌는가?',
    fixed: 'f=(−y/2,x/2,0), curl f=(0,0,1), xy 원판; ε=+1 위쪽/반시계.',
    initialReason: '위쪽 법선과 반시계 경계의 짝.',
    limitations:
      '‘같은 경계의 두 곡면’에서 공간 원 경계와 원판·굽은 패치를 비교한다. 임의 곡면의 일반 계산기는 아니다. 퇴화r=0에서는 정칙 곡면 조건을 주장하지 않는다.',
    equations: [
      '\\oint_{\\partial\\Sigma}\\mathbf f\\cdot d\\mathbf r=\\iint_\\Sigma(\\nabla\\times\\mathbf f)\\cdot\\mathbf n\\,d\\sigma=\\varepsilon\\pi r^2',
    ],
  },
  D5: {
    parameters: [parameter('x', '점의 x', -2, 2, 1), parameter('y', '점의 y', -2, 2, 1)],
    question: '스칼라장·벡터장의 입력과 grad·div·curl·Laplacian의 출력은 어떻게 구별되는가?',
    fixed: '스칼라 f=x²+y²+z²; 벡터장 g=(−y,x,z); 표시점 z=0.',
    initialReason: '같은 점에서 grad벡터와 div스칼라·curl벡터·Δ스칼라를 비교.',
    limitations:
      '직교좌표 예시. 교재의12좌표식·기저 순서·좌표 특이점은 원문 식과 아래 정적 설명으로 유지한다. 그림으로 연산자 항등식을 증명하지 않는다.',
    equations: [
      '\\nabla f=(2x,2y,2z),\\quad\\nabla\\cdot\\mathbf g=1,\\quad\\nabla\\times\\mathbf g=(0,0,2),\\quad\\Delta f=6',
    ],
  },
};
export type Point = [number, number];
export interface Trace {
  label: string;
  points: Point[];
  dashed?: boolean;
  arrow?: boolean;
  kind?: 'points';
}
export interface ObservationResult {
  traces: Trace[];
  values: Array<[string, number | string]>;
  judgment: string;
  axes: [string, string];
  extent: number;
  steps?: string[];
}
const line = (label: string, ...points: Point[]): Trace => ({
  label,
  points,
  arrow: /^(v$|w$|v\+w$|평행 이동한 w$|proj_w v$|∇f|단위 v$|g의 xy 성분$|바깥 법선|진행 ·)/.test(
    label,
  ),
});
const curve = (label: string, fn: (t: number) => Point, start = 0, end = Math.PI * 2): Trace => ({
  label,
  points: Array.from({ length: 81 }, (_, i) => fn(start + ((end - start) * i) / 80)),
});
const circle = (r: number) => curve('C · 원 경계', (t) => [r * Math.cos(t), r * Math.sin(t)]);
export function observeVector(id: string, p: Record<string, number>): ObservationResult {
  const {
    a = 1,
    b = 1,
    r = 1,
    x = 1,
    y = 1,
    t = 1,
    h = 0.5,
    n = 4,
    m = 1,
    k = 1,
    seed = 17,
    sign = 1,
    hole = 0,
  } = p;
  const trig = (degrees: number) => {
    const t = (degrees * Math.PI) / 180;
    return {
      c:
        degrees === 90 || degrees === -90
          ? 0
          : degrees === 0
            ? 1
            : Math.abs(degrees) === 180
              ? -1
              : Math.cos(t),
      s:
        degrees === 0 || Math.abs(degrees) === 180
          ? 0
          : degrees === 90
            ? 1
            : degrees === -90
              ? -1
              : Math.sin(t),
    };
  };
  const direction = trig(p.theta ?? 60),
    zenith = trig(p.phi ?? 60);
  const result: ObservationResult = {
    traces: [],
    values: [],
    judgment: '설명용 모형의 조건을 충족한다.',
    axes: ['x', 'y'],
    extent: 4,
  };
  switch (id) {
    case 'A1':
      result.traces = [
        line('v', [0, 0], [a, 1]),
        line('w', [0, 0], [1, b]),
        line('v+w', [0, 0], [a + 1, 1 + b]),
        { ...line('평행 이동한 w', [a, 1], [a + 1, 1 + b]), dashed: true },
      ];
      result.values = [
        ['v+w', `(${a + 1}, ${1 + b}, 0)`],
        ['||v||', Math.hypot(a, 1)],
        ['||v+w||', Math.hypot(a + 1, 1 + b)],
      ];
      break;
    case 'A2':
    case 'A3': {
      const wx = b * direction.c,
        wy = b * direction.s,
        dot = a * wx,
        area = a * wy;
      result.traces = [line('v', [0, 0], [a, 0]), line('w', [0, 0], [wx, wy])];
      result.values = [
        ['v·w', dot],
        ['(v×w)z', area],
        ['평행사변형 넓이', Math.abs(area)],
      ];
      if (id === 'A2' && b !== 0) {
        const proj: Point = [a * direction.c ** 2, a * direction.c * direction.s];
        result.traces.push({ ...line('proj_w v', [0, 0], proj), dashed: true });
        result.values.push(['proj_w v', `(${proj.map((v) => v.toPrecision(8)).join(', ')}, 0)`]);
      }
      if (a === 0 || b === 0)
        result.judgment =
          b === 0
            ? '내적=0. 각도와 w 위 정사영은 정의되지 않는다.'
            : '내적=0. 각도는 정의되지 않는다. w 위 정사영은 영벡터이다.';
      if (id === 'A3')
        result.judgment =
          a === 0 || b === 0 || p.theta === 0 || p.theta === 180
            ? '외적은 영벡터이다. 비영법선 방향은 정하지 못한다.'
            : area === 0
              ? '비영벡터·비평행 조건이지만 매우 작은 곱이 수치 범위 아래로 내려가 표시값은 0이다. 수학적 영법선으로 판정하지 않는다.'
              : '법선은 +z 방향이다. xy 도해와 z 성분은 별도로 표시한다.';
      break;
    }
    case 'A4': {
      const s = r * zenith.s,
        z = r * zenith.c;
      result.traces = [line('ρ', [0, 0], [s, z])];
      result.axes = ['s=√(x²+y²)', 'z'];
      result.values = [
        ['x', s * direction.c],
        ['y', s * direction.s],
        ['z', z],
        ['ρ', r],
      ];
      if (r === 0 || p.phi === 0 || p.phi === 180)
        result.judgment = '원점 또는 극에서 일부 각도는 유일하지 않다. 점 자체는 존재한다.';
      else if (s === 0)
        result.judgment =
          '극이 아니지만 매우 작은 곱의 수치 표시가 0이다. 좌표 비유일성을 결론 내리지 않는다.';
      break;
    }
    case 'A5':
      result.traces = [circle(r), line('xy 현재 위치', [0, 0], [r * Math.cos(t), r * Math.sin(t)])];
      result.values = [
        ['z=h t', h * t],
        ['속력', Math.hypot(r, h)],
        ['0부터 t까지 호의 길이', t * Math.hypot(r, h)],
      ];
      if (r === 0 && h === 0) result.judgment = '속력0에서 단위접선과 T/N/B를 정의하지 않는다.';
      break;
    case 'B1':
      result.traces = [line('접근 경로', [0, 0], [t, m * t])];
      result.values = [
        ['직선 경로의 값', t === 0 ? '원점에서 식 미정의' : m / (1 + m * m)],
        ['y=0 경로의 극한', 0],
        ['y=x 경로의 극한', 0.5],
      ];
      result.judgment = '두 정확한 경로 극한이 다르므로 원점에서 일반 극한은 존재하지 않는다.';
      break;
    case 'B2':
      result.extent = 6.5;
      result.traces = [
        line('∇f', [x, y], [3 * x, 3 * y]),
        line('단위 v', [x, y], [x + direction.c, y + direction.s]),
        { ...circle(Math.hypot(x, y)), label: 'f=x²+y²의 현재 등위선' },
      ];
      result.values = [
        ['f(x,y)', x * x + y * y],
        ['D_v f', 2 * x * direction.c + 2 * y * direction.s],
        ['||∇f||', 2 * Math.hypot(x, y)],
      ];
      if (x === 0 && y === 0)
        result.judgment = '∇f=0: 모든 방향미분0, 최급상승의 유일한 방향은 정하지 못한다.';
      break;
    case 'B3': {
      let current = x;
      const steps = [`x₀=${x}`];
      for (let i = 0; i < n; i++) {
        if (current === 0) {
          result.judgment =
            '반복 분모0: 이 시작점에서 Newton 식을 적용하지 못한다. 근 비존재를 뜻하지 않는다.';
          break;
        }
        const next = current / 2 + 1 / current;
        if (!Number.isFinite(next)) {
          result.judgment =
            '부동소수점 범위를 넘어서 반복을 멈췄다. 마지막 유한값을 유지하며 근의 부존재를 뜻하지 않는다.';
          break;
        }
        current = next;
        steps.push(`x${i + 1}=${current.toPrecision(10)}`);
      }
      result.steps = steps;
      result.traces = [curve('g=x²−2', (v) => [v, v * v - 2], -2, 3)];
      if (Number.isFinite(current * current))
        result.traces.push({
          label: '현재 반복점',
          points: [[current, current * current - 2]],
          kind: 'points',
        });
      result.values = [
        ['마지막 유효 x', current],
        [
          'g(x)',
          Number.isFinite(current * current)
            ? current * current - 2
            : '표시 계산의 부동소수점 범위 초과',
        ],
        ['√2', Math.sqrt(2)],
      ];
      result.extent = 5;
      break;
    }
    case 'C1': {
      const exact = (a * b * (a + b)) / 2;
      result.traces = [line('R 경계', [0, 0], [a, 0], [a, b], [0, b], [0, 0])];
      for (let i = 1; i < n; i++) {
        result.traces.push({
          ...line(`x 분할${i}`, [(a * i) / n, 0], [(a * i) / n, b]),
          label: '',
          dashed: true,
        });
        result.traces.push({
          ...line(`y 분할${i}`, [0, (b * i) / n], [a, (b * i) / n]),
          label: '',
          dashed: true,
        });
      }
      result.values = [
        ['정확 적분 I', exact],
        ['우측 표본합 S_n', (exact * (n + 1)) / n],
        ['S_n−I', exact / n],
      ];
      break;
    }
    case 'C2': {
      let state = seed >>> 0,
        sum = 0,
        squares = 0;
      const points: Point[] = [];
      const random = () => {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return state / 4294967296;
      };
      for (let i = 0; i < n; i++) {
        const px = random(),
          py = random(),
          v = px + py;
        points.push([px, py]);
        sum += v;
        squares += v * v;
      }
      const estimate = sum / n,
        variance = n > 1 ? Math.max(0, (squares - (sum * sum) / n) / (n - 1)) : null;
      result.traces = [{ label: '표본 (독립성 입증 아님)', points }];
      result.extent = 1.5;
      result.values = [
        ['추정 Î', estimate],
        ['정확 I', 1],
        ['실제 오차 Î−I', estimate - 1],
        [
          '가정에 따른 참고 표준오차',
          variance === null ? 'N=1에서 표본분산 미정의' : Math.sqrt(variance / n),
        ],
      ];
      result.judgment = '유한 의사난수 표본이다. 독립 균등 표본 가정을 증명하지 않는다.';
      break;
    }
    case 'C3':
      result.traces = [
        line('변환한 영역', [0, 0], [a, 0], [a, b], [0, b], [0, 0]),
        {
          ...line('원래 u,v 영역', [0, 0], [1, 0], [1, 1], [0, 1], [0, 0]),
          dashed: true,
        },
      ];
      result.values = [
        ['det J', a * b],
        ['면적 배율 |det J|', Math.abs(a * b)],
      ];
      if (a === 0 || b === 0)
        result.judgment = 'J가 특이하다. 이 예시에서 국소 역변환의 정칙 조건이 성립하지 않는다.';
      else if (a * b === 0)
        result.judgment =
          '두 계수는 비영이지만 매우 작은 곱의 수치 표시가 0이다. 역변환 불가로 판정하지 않는다.';
      break;
    case 'C4': {
      const mass = 1 + k / 2,
        centroid = (0.5 + k / 3) / mass;
      result.traces = [
        line('δ=1+k x', [0, 1], [1, 1 + k]),
        line('질량중심 x̄', [centroid, 0], [centroid, 1 + k * centroid]),
      ];
      result.extent = 4.5;
      result.axes = ['x', 'δ (질량/길이)'];
      result.values = [
        ['총질량 M', mass],
        ['질량중심 x̄', centroid],
        ['정규화한 E[X]', centroid],
      ];
      break;
    }
    case 'D1':
    case 'D2':
    case 'D4': {
      const singular = id === 'D2' && hole === 1;
      const integral = singular ? sign * 2 * Math.PI : sign * Math.PI * r * r;
      result.traces = [
        circle(r),
        line(sign === 1 ? '진행 · 반시계' : '진행 · 시계', [r, 0], [r, (sign * r) / 2]),
      ];
      result.values = [
        ['경계 선적분', r === 0 && singular ? '경계에 장 미정의' : integral],
        ['매끈한 장의 내부 적분', Math.PI * r * r],
        ['ε', sign],
      ];
      if (singular)
        result.values = [
          ['경계 선적분', r === 0 ? '경계에 장 미정의' : integral],
          ['원점 밖 회전', 0],
          ['원판 전체 그린 내부적분', '원점에서 미정의 · 적용 조건 위반'],
        ];
      if (singular)
        result.judgment =
          '원점에서 장 미정의: 이 원판에 그린 정리를 적용할 조건을 위반한다. 원점 밖 회전0과 비영순환을 따로 읽는다.';
      else if (r === 0)
        result.judgment = '퇴화 경계: 일반적인 정칙 곡면/단순 폐곡선 적용 조건을 주장하지 않는다.';
      else if (sign === -1)
        result.judgment =
          id === 'D4'
            ? '아래쪽 법선과 시계 방향 경계로 양쪽 부호를 함께 뒤집었다.'
            : '시계 방향이다. 양의 방향 내부 적분과 비교하려면 부호 ε를 붙인다.';
      else result.judgment = '매끈한 장·비퇴화 영역·호환되는 양의 방향을 충족한다.';
      if (id === 'D4')
        result.values = [
          ['경계 선적분', sign * Math.PI * r * r],
          ['법선 방향을 반영한 curl 적분', sign * Math.PI * r * r],
          ['법선', sign === 1 ? '+z' : '−z'],
        ];
      break;
    }
    case 'D3':
      result.extent = 4.5;
      result.traces = [circle(r), line('바깥 법선의 중앙 단면', [r, 0], [1.4 * r, 0])];
      result.values = [
        ['구의 부피', (4 * Math.PI * r ** 3) / 3],
        ['발산', 3],
        ['바깥 플럭스', 4 * Math.PI * r ** 3],
        ['부피 발산 적분', 4 * Math.PI * r ** 3],
      ];
      if (r === 0)
        result.judgment = '반지름0은 정칙 닫힌 곡면이 아니다. 표시0은 극한 모형의 값이다.';
      break;
    case 'D5':
      result.extent = 6.5;
      result.traces = [
        line('∇f (z=0)', [x, y], [3 * x, 3 * y]),
        line('g의 xy 성분', [x, y], [x - y, y + x]),
      ];
      result.values = [
        ['∇f', `(${2 * x}, ${2 * y}, 0)`],
        ['div g', 1],
        ['curl g', '(0, 0, 2)'],
        ['Δf', 6],
      ];
      break;
    default:
      throw Error('등록되지 않은 관찰이다.');
  }
  return result;
}
export function validParameter(p: Parameter, value: number) {
  return (
    Number.isFinite(value) &&
    value >= p.min &&
    value <= p.max &&
    (!p.integer || Number.isInteger(value)) &&
    (!(p.key === 'sign') || value === -1 || value === 1)
  );
}
