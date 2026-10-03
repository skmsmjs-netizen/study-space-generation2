import type { RileyObservation, RileyResult } from './riley-observations';
import { formatNumber } from '../interactive/math-physics/presentation.mjs';
const f = (key: string, label: string, min: number, max: number, value: number, step = 0.01) => ({
  key,
  label,
  min,
  max,
  value,
  step,
});
const model = (
  title: string,
  question: string,
  tex: string,
  conditions: string,
  fields: ReturnType<typeof f>[],
  steps: string[],
): RileyObservation => ({
  title,
  question,
  tex,
  conditions,
  fields,
  steps,
  initialReason:
    '해석 가능한 비특이 초기값을 사용합니다. 이 함수·자료·조절 범위는 제한된 관찰용 설계 사례입니다.',
});
export const RILEY_EXTENDED = {
  quadratic: model(
    '이차식과 근',
    '판별량이 바뀌면 실근과 복소근은 어떻게 달라질까요?',
    String.raw`x^2+bx+c=0,\quad D=b^2-4c`,
    '계수가 실수인 monic 이차식입니다. 중근과 두 근, 실수 범위와 복소수 범위를 구별합니다.',
    [f('b', '일차 계수 b', -4, 4, -2), f('c', '상수 c', -4, 4, -1)],
    [
      '판별량을 계산합니다.',
      'D의 부호에 따라 실수 또는 복소수 근을 표시합니다.',
      '근의 합·곱과 원래 계수를 대조합니다.',
    ],
  ),
  calculus: model(
    '함수·도함수·적분',
    '같은 다항식의 기울기와 구간 누적량은 어떻게 다를까요?',
    String.raw`f(x)=ax^2+b,\quad f'(x)=2ax,\quad\int_0^t f(x)\,dx=\frac{at^3}{3}+bt`,
    '다항식은 모든 실수에서 미분·적분 가능합니다. t<0에서는 방향 있는 적분입니다.',
    [f('a', '이차 계수 a', -3, 3, 1), f('b', '상수 b', -3, 3, 1), f('t', '적분 끝 t', -3, 3, 1)],
    [
      '함수와 도함수를 같은 x에서 비교합니다.',
      '0부터 t까지 방향 있는 적분을 계산합니다.',
      '기울기와 면적·부호를 구별합니다.',
    ],
  ),
  hessian: model(
    '다변수 정지점',
    'Hessian의 부호가 원점의 형태를 어떻게 나눌까요?',
    String.raw`f(x,y)=ax^2+by^2,\quad H=\operatorname{diag}(2a,2b)`,
    '원점은 정지점입니다. 한 계수가 0일 때 이차형식이 퇴화하며, 고차 항이 있는 일반 함수의 판정으로 확대하지 않습니다.',
    [f('a', 'x 방향 계수 a', -3, 3, 1), f('b', 'y 방향 계수 b', -3, 3, 1)],
    [
      '원점에서 gradient가 0임을 확인합니다.',
      '두 이차 계수의 부호를 비교합니다.',
      '최소·최대·안장·퇴화를 구별합니다.',
    ],
  ),
  polar: model(
    '좌표와 면적 요소',
    '원판의 면적에서 Jacobian은 어떤 역할을 할까요?',
    String.raw`x=r\cos\theta,\ y=r\sin\theta,\quad dA=r\,dr\,d\theta,\quad A=\pi R^2`,
    '0≤r≤R, 0≤θ≤2π인 원판입니다. 원점의 극좌표 특이점과 면적 적분 가능성은 다릅니다.',
    [f('r', '원판 반지름 R', 0.1, 3, 1)],
    [
      '좌표 변환의 Jacobian r을 읽습니다.',
      '반지름과 각도 영역을 함께 적분합니다.',
      '원판의 기하 면적과 비교합니다.',
    ],
  ),
  modes: model(
    '두 결합 진동의 정상모드',
    '같은 두 진동자가 어떤 두 독립 모드로 움직일까요?',
    String.raw`M=mI,\quad K=k\begin{pmatrix}2&-1\\-1&2\end{pmatrix},\quad \omega_1^2=k/m,\ \omega_2^2=3k/m`,
    'm,k>0인 선형화된 두 자유도·고정 끝점 사례입니다. 고유값은 각진동수의 제곱입니다.',
    [f('m', '공통 질량 m', 0.1, 3, 1), f('k', '복원 계수 k', 0.1, 3, 1)],
    [
      '질량·복원 행렬을 정합니다.',
      '같은 방향·반대 방향 모드의 고유값을 구합니다.',
      '제곱근으로 각진동수를 구별합니다.',
    ],
  ),
  helix: model(
    '곡선·곡률·비틀림',
    '나선의 두 길이 매개변수는 곡률과 비틀림을 어떻게 바꿀까요?',
    String.raw`\mathbf r(t)=(a\cos t,a\sin t,bt),\quad\kappa=\frac a{a^2+b^2},\quad\tau=\frac b{a^2+b^2}`,
    'a>0인 정칙 나선, 오른손 Cartesian 좌표입니다. 곡률과 비틀림은 길이의 역수이며 실제 3D 위치를 평면 곡선으로 왜곡하지 않습니다.',
    [f('a', '나선 반지름 a', 0.1, 3, 1), f('b', '축방향 증가 b', -3, 3, 0.5)],
    [
      '곡선의 세 성분과 매개변수를 확인합니다.',
      '접벡터·외적에서 곡률과 비틀림을 계산합니다.',
      '비틀림의 부호와 b=0인 원을 비교합니다.',
    ],
  ),
  flux: model(
    '표면·체적 적분의 대응',
    '폐곡면의 flux와 내부 divergence 적분이 어떻게 같아질까요?',
    String.raw`\mathbf F=(x,y,z),\quad\nabla\cdot\mathbf F=3,\quad\int_V3\,dV=\oint_{\partial V}\mathbf F\cdot d\mathbf S=24a^3`,
    'V=[−a,a]³, a>0이고 외향 법선을 사용합니다. 매끄러운 장·닫힌 경계의 제한된 사례입니다.',
    [f('a', '정육면체 반길이 a', 0.1, 3, 1)],
    [
      'divergence와 체적을 계산합니다.',
      '여섯 면의 외향 flux를 더합니다.',
      '두 계산을 같은 영역·방향에서 비교합니다.',
    ],
  ),
  laplace: model(
    'Laplace 변환과 수렴',
    '지수 감쇠의 변환은 어느 실수 s에서 적분될까요?',
    String.raw`f(t)=e^{-at},\quad F(s)=\int_0^\infty e^{-st}f(t)dt=\frac1{s+a}`,
    't≥0, a>0의 단측 변환입니다. 여기서는 실수 s만 조절하며 s+a>0일 때 정의 적분이 수렴합니다.',
    [f('a', '감쇠계수 a', 0.1, 3, 1), f('s', '실수 변환 변수 s', -3, 3, 1)],
    [
      '두 지수의 계수를 합칩니다.',
      's+a>0을 정의 적분의 조건으로 확인합니다.',
      '수렴 구간에서만 변환값을 표시합니다.',
    ],
  ),
  logistic: model(
    '분리형 일계 ODE',
    '초기값과 성장계수는 logistic 해를 어떻게 선택할까요?',
    String.raw`y'=ky(1-y),\quad y(0)=p,\quad y(t)=\frac p{p+(1-p)e^{-kt}}`,
    'k>0, 0≤p≤1, t≥0의 무차원 사례입니다. p=0,1의 상수해를 분리 과정에서 잃지 않습니다.',
    [f('k', '성장계수 k', 0.1, 3, 1), f('p', '초기값 p', 0, 1, 0.2)],
    [
      '상수해 0과 1을 먼저 확인합니다.',
      '나머지 해에서 분리 적분과 초기값을 적용합니다.',
      '경계 초기값과 같은 해족을 비교합니다.',
    ],
  ),
  frobenius: model(
    '지표근과 두 해',
    'Euler 식의 지표근이 합쳐지면 둘째 해는 어떻게 달라질까요?',
    String.raw`x^2y''+xy'-\nu^2y=0,\quad x>0`,
    '정칙 특이점 x=0을 제외합니다. ν>0에서는 x^ν와 x^−ν, ν=0에서는 1과 log x가 독립 해입니다.',
    [f('nu', '비음수 지표 ν', 0, 3, 1)],
    [
      'y=x^r를 대입해 r²−ν²=0을 얻습니다.',
      '서로 다른 두 지표근의 해를 비교합니다.',
      '중근에서는 같은 상수해 두 개 대신 log x를 사용합니다.',
    ],
  ),
  sturm: model(
    '경계·고유함수·직교',
    '고정 끝점은 어떤 고유값과 함수의 지표를 허용할까요?',
    String.raw`-u''=\lambda u,\quad u(0)=u(1)=0,\quad u_n=\sin(n\pi x),\quad\lambda_n=(n\pi)^2`,
    '0≤x≤1, n은 양의 정수, 가중치 1입니다. ∫u_n²dx=1/2이며 √2 배하면 정규화됩니다.',
    [f('n', '모드 지표 n', 1, 8, 1, 1)],
    [
      '경계에서 0인 해를 선택합니다.',
      '양의 정수 n과 고유값을 대응시킵니다.',
      '직교와 정규화를 구별합니다.',
    ],
  ),
  legendre: model(
    'Legendre 다항식의 재귀',
    '차수에 따라 다항식과 직교 관계는 어떻게 달라질까요?',
    String.raw`P_0=1,\ P_1=x,\quad(n+1)P_{n+1}=(2n+1)xP_n-nP_{n-1}`,
    '−1≤x≤1, n은 비음수 정수, 가중치 1입니다. 곡선 표본이 직교성의 일반 증명은 아닙니다.',
    [f('n', '다항식 차수 n', 0, 12, 2, 1)],
    [
      '두 시작 다항식을 확인합니다.',
      '재귀식으로 선택한 차수를 계산합니다.',
      '차수·짝홀성·정규화를 비교합니다.',
    ],
  ),
  quantum: model(
    '두 상태의 확률과 기댓값',
    '같은 정규화된 상태는 어떤 두 확률과 기댓값을 줄까요?',
    String.raw`\psi=\begin{pmatrix}\cos\theta\\\sin\theta\end{pmatrix},\quad A=\operatorname{diag}(1,-1),\quad\langle A\rangle=\cos2\theta`,
    '실수 두 성분의 제한된 정규화 상태와 무차원 관측량입니다. 실제 측정이나 전체 파동함수 해가 아닙니다.',
    [f('theta', '상태 각 θ · rad', 0, Math.PI, Math.PI / 4)],
    [
      '두 성분의 제곱합 1을 확인합니다.',
      '각 고유상태의 확률을 계산합니다.',
      '확률 가중합과 기댓값을 비교합니다.',
    ],
  ),
  fredholm: model(
    '적분 연산과 특이 매개변수',
    '상수 kernel의 식은 언제 유일한 상수해를 가질까요?',
    String.raw`u(x)=1+\lambda\int_0^1u(t)dt,\quad u=\frac1{1-\lambda}`,
    '0≤x≤1의 둘째 종류 Fredholm 식입니다. λ=1에서는 이 특정 강제항 1과 양립하지 않습니다. 모든 적분식이 불가능하다는 판정이 아닙니다.',
    [f('lambda', 'kernel 계수 λ', -2, 2, 0.5)],
    [
      '우변이 x와 무관하므로 해가 상수임을 읽습니다.',
      '상수 적분을 대입해 (1−λ)u=1을 얻습니다.',
      'λ=1에서 이 식의 양립성을 확인합니다.',
    ],
  ),
  analytic: model(
    '복소 미분과 두 실수 성분',
    'Cauchy–Riemann 조건은 z²와 켤레 z를 어떻게 구별할까요?',
    String.raw`z^2=(x^2-y^2)+2ixy,\quad\bar z=x-iy`,
    '실수 x,y의 두 매끄러운 함수 사례입니다. 켤레 함수는 유효한 복소 함수이지만 복소 미분 가능하지 않습니다. z²의 원점에서는 도함수 0이라 국소 등각성이 성립하지 않습니다.',
    [
      f('x', '실수 성분 x', -2, 2, 1),
      f('y', '허수 성분 y', -2, 2, 0.5),
      f('which', '표현 · 0=z² / 1=켤레', 0, 1, 0, 1),
    ],
    [
      '두 실수 성분의 편미분을 계산합니다.',
      'Cauchy–Riemann 관계를 비교합니다.',
      '복소 함수의 존재·해석성·등각성을 구별합니다.',
    ],
  ),
  potential: model(
    '복소 퍼텐셜의 두 성분',
    '균일 유동의 퍼텐셜과 흐름 함수는 어떤 선들을 만들까요?',
    String.raw`W(z)=Uz,\quad\phi=Ux,\quad\psi=Uy,\quad W'(z)=U`,
    '비압축·비회전 2차원 이상 유동의 제한된 사례입니다. U는 실수이며 U=0에서는 모든 점이 같은 퍼텐셜입니다.',
    [
      f('u', '균일 유동 계수 U', -3, 3, 1),
      f('x', '위치 x', -2, 2, 1),
      f('y', '위치 y', -2, 2, 0.5),
    ],
    [
      '복소 퍼텐셜의 두 성분을 읽습니다.',
      '등퍼텐셜과 흐름 함수의 선을 구별합니다.',
      '미분에서 속도와 정지 경우를 확인합니다.',
    ],
  ),
  quadrature: model(
    '구적과 오차',
    '같은 적분에서 분할을 바꾸면 두 근사는 어떻게 달라질까요?',
    String.raw`I=\int_0^1x^4dx=\frac15`,
    'n은 양의 짝수입니다. 사다리꼴·Simpson 규칙의 제한된 매끄러운 사례이며 독립적인 정확값 1/5와 오차를 비교합니다.',
    [f('n', '짝수 분할의 절반 · n=2m', 1, 50, 5, 1)],
    [
      '같은 구간과 함수를 선택합니다.',
      '같은 분할에서 두 가중합을 계산합니다.',
      '정확값과 실제 오차를 비교합니다.',
    ],
  ),
  representation: model(
    '군·행렬·character',
    'C₃의 같은 원소는 회전행렬과 trace로 어떻게 대응할까요?',
    String.raw`D(k)=\begin{pmatrix}\cos\theta_k&-\sin\theta_k\\\sin\theta_k&\cos\theta_k\end{pmatrix},\quad\theta_k=2\pi k/3`,
    'k=0,1,2인 C₃의 실수 2차원 표현입니다. 복소수 체에서는 두 1차원 표현으로 분해됩니다. 체를 바꾸면 irreducibility의 판단도 달라집니다.',
    [f('k', '군 원소 k', 0, 2, 1, 1), f('l', '합성할 원소 l', 0, 2, 1, 1)],
    [
      '군의 합을 mod 3으로 구합니다.',
      '행렬곱과 같은 군 원소의 행렬을 비교합니다.',
      'trace와 표현 전체, 실수·복소 분해를 구별합니다.',
    ],
  ),
} as const;
export type RileyExtended = keyof typeof RILEY_EXTENDED;
const fmt = (x: number) =>
  Number.isFinite(x)
    ? x !== 0 && Math.abs(x) < 0.005
      ? x.toExponential(4)
      : formatNumber(x)
    : '계산 불가';
const sample = (fn: (x: number) => number, a: number, b: number): [number, number][] =>
  Array.from({ length: 161 }, (_, i) => {
    const x = a + ((b - a) * i) / 160;
    return [x, fn(x)];
  });
export const legendre = (n: number, x: number) => {
  if (n === 0) return 1;
  let a = 1,
    b = x;
  for (let k = 1; k < n; k++) {
    const c = ((2 * k + 1) * x * b - k * a) / (k + 1);
    a = b;
    b = c;
  }
  return b;
};
export function extendedValues(kind: RileyExtended, v: Record<string, number>): RileyResult {
  const r: RileyResult = {
    values: [],
    condition: '충족',
    traces: [],
    note: '限定된 해석·부동소수점 계산 사례입니다. 저장값은 표시 반올림으로 바꾸지 않습니다. 표본 그림은 일반 증명을 대신하지 않습니다.'.replace(
      '限定',
      '제한',
    ),
  };
  const trace = (name: string, fn: (x: number) => number, a = -2, b = 2) =>
    r.traces.push({ name, points: sample(fn, a, b) });
  switch (kind) {
    case 'quadratic': {
      const d = v.b * v.b - 4 * v.c,
        real = -v.b / 2,
        span = Math.sqrt(Math.abs(d)) / 2;
      r.values = [
        `D=${fmt(d)}`,
        d >= 0
          ? `근: ${fmt(real + span)}, ${fmt(real - span)}`
          : `근: ${fmt(real)} ± ${fmt(span)}i`,
      ];
      trace('이차식', (x) => x * x + v.b * x + v.c, -4, 4);
      break;
    }
    case 'calculus':
      r.values = [
        `f(t)=${fmt(v.a * v.t * v.t + v.b)}`,
        `f′(t)=${fmt(2 * v.a * v.t)}`,
        `방향 있는 적분=${fmt((v.a * v.t ** 3) / 3 + v.b * v.t)}`,
      ];
      trace('함수', (x) => v.a * x * x + v.b, -3, 3);
      trace('도함수', (x) => 2 * v.a * x, -3, 3);
      break;
    case 'hessian':
      r.values = [
        `H의 대각: ${fmt(2 * v.a)}, ${fmt(2 * v.b)}`,
        v.a * v.b < 0
          ? '원점: 안장점'
          : v.a === 0 || v.b === 0
            ? '퇴화 · 이 사례는 해당 방향에서 일정, 일반 함수의 고차 항 판정은 별도'
            : v.a > 0
              ? '원점: 엄격한 최소'
              : '원점: 엄격한 최대',
      ];
      trace('y=0 단면', (x) => v.a * x * x);
      trace('x=0 단면', (x) => v.b * x * x);
      break;
    case 'polar':
      r.values = [
        `면적=${fmt(Math.PI * v.r * v.r)}`,
        `반지름 적분=${fmt((v.r * v.r) / 2)}`,
        `각도 적분=2π`,
      ];
      r.traces.push({
        name: '원판 경계',
        points: Array.from({ length: 161 }, (_, i) => [
          v.r * Math.cos((2 * Math.PI * i) / 160),
          v.r * Math.sin((2 * Math.PI * i) / 160),
        ]),
      });
      break;
    case 'modes':
      r.values = [
        `ω₁=${fmt(Math.sqrt(v.k / v.m))}`,
        `ω₂=${fmt(Math.sqrt((3 * v.k) / v.m))}`,
        `모드: (1,1), (1,−1)`,
      ];
      trace('같은 방향 모드', (t) => Math.cos(Math.sqrt(v.k / v.m) * t), 0, 8);
      trace('반대 방향 모드', (t) => Math.cos(Math.sqrt((3 * v.k) / v.m) * t), 0, 8);
      break;
    case 'helix':
      r.values = [
        `κ=${fmt(v.a / (v.a * v.a + v.b * v.b))}`,
        `τ=${fmt(v.b / (v.a * v.a + v.b * v.b))}`,
        `속력=${fmt(Math.hypot(v.a, v.b))}`,
      ];
      break;
    case 'flux':
      r.values = [
        `div F=3`,
        `체적=${fmt(8 * v.a ** 3)}`,
        `내부 적분=${fmt(24 * v.a ** 3)}`,
        `여섯 면 flux 합=${fmt(6 * 4 * v.a ** 3)}`,
      ];
      break;
    case 'laplace': {
      const c = v.s + v.a;
      r.condition = c > 0 ? '충족' : '위반';
      r.values = [
        `s+a=${fmt(c)}`,
        c > 0
          ? `F(s)=${fmt(1 / c)}`
          : '정의 적분의 수렴 조건 위반 · 이 적분으로 값을 정의하지 않음',
      ];
      trace('원래 함수', (t) => Math.exp(-v.a * t), 0, 5);
      break;
    }
    case 'logistic': {
      const y = (t: number) => (v.p === 0 ? 0 : v.p / (v.p + (1 - v.p) * Math.exp(-v.k * t)));
      r.values = [
        `y(0)=${fmt(y(0))}`,
        `y(5)=${fmt(y(5))}`,
        v.p === 0 || v.p === 1 ? '상수해' : '비상수 해',
      ];
      trace('초기값을 적용한 해', y, 0, 6);
      break;
    }
    case 'frobenius':
      r.values = [
        `지표근: ${fmt(v.nu)}, ${fmt(-v.nu)}`,
        v.nu === 0 ? '독립 해: 1, log x' : '독립 해: x^ν, x^−ν',
      ];
      trace('첫째 해', (x) => x ** v.nu, 0.25, 2);
      trace('둘째 해', (x) => (v.nu === 0 ? Math.log(x) : x ** -v.nu), 0.25, 2);
      break;
    case 'sturm':
      r.values = [`λₙ=${fmt((v.n * Math.PI) ** 2)}`, '원래 함수의 제곱 적분=1/2', '정규화 인자=√2'];
      trace('고유함수', (x) => Math.sin(v.n * Math.PI * x), 0, 1);
      break;
    case 'legendre':
      r.values = [
        `Pₙ(1)=${fmt(legendre(v.n, 1))}`,
        `Pₙ(−1)=${fmt(legendre(v.n, -1))}`,
        `제곱 적분=2/(2n+1)=${fmt(2 / (2 * v.n + 1))}`,
      ];
      trace('Legendre 다항식', (x) => legendre(v.n, x), -1, 1);
      break;
    case 'quantum': {
      const a = Math.cos(v.theta) ** 2,
        b = Math.sin(v.theta) ** 2;
      r.values = [
        `Pr(+1)=${fmt(a)}`,
        `Pr(−1)=${fmt(b)}`,
        `정규화=${fmt(a + b)}`,
        `기댓값=${fmt(a - b)}`,
      ];
      break;
    }
    case 'fredholm':
      r.condition = v.lambda === 1 ? '위반' : '충족';
      r.values =
        v.lambda === 1
          ? ['(1−λ)u=1이 0=1이 됨 · 이 특정 강제항과 양립하지 않음']
          : [
              `상수해=${fmt(1 / (1 - v.lambda))}`,
              `원식 잔차=${fmt(1 / (1 - v.lambda) - 1 - v.lambda / (1 - v.lambda))}`,
            ];
      break;
    case 'analytic': {
      const conjugate = v.which === 1,
        cr1 = conjugate ? 2 : 0,
        cr2 = 0;
      r.condition = conjugate ? '위반' : '충족';
      r.values = [
        `u=${fmt(conjugate ? v.x : v.x * v.x - v.y * v.y)}, v=${fmt(conjugate ? -v.y : 2 * v.x * v.y)}`,
        `CR 잔차 uₓ−vᵧ=${fmt(cr1)}, uᵧ+vₓ=${fmt(cr2)}`,
        conjugate
          ? '복소 미분 불가 · 함수 자체는 정의됨'
          : v.x === 0 && v.y === 0
            ? '해석적 · 도함수 0 · 여기서는 등각 아님'
            : '해석적 · 도함수 비영 · 국소 등각',
      ];
      break;
    }
    case 'potential':
      r.values = [
        `φ=${fmt(v.u * v.x)}`,
        `ψ=${fmt(v.u * v.y)}`,
        `속도: (${fmt(v.u)},0)`,
        v.u === 0
          ? '정지 · 모든 점의 퍼텐셜·흐름 함수가 동일'
          : '등퍼텐셜은 수직, 흐름 함수의 선은 수평',
      ];
      break;
    case 'quadrature': {
      const n = 2 * v.n,
        h = 1 / n;
      let t = 0.5,
        s = 1;
      for (let i = 1; i < n; i++) {
        const y = (i * h) ** 4;
        t += y;
        s += (i % 2 ? 4 : 2) * y;
      }
      t *= h;
      s *= h / 3;
      r.values = [
        `분할 n=${n}`,
        `사다리꼴=${fmt(t)}, 오차=${fmt(t - 0.2)}`,
        `Simpson=${fmt(s)}, 오차=${fmt(s - 0.2)}`,
        `정확값=1/5`,
      ];
      break;
    }
    case 'representation': {
      const angle = (2 * Math.PI * v.k) / 3,
        prod = (v.k + v.l) % 3;
      r.values = [
        `D(k): [${fmt(Math.cos(angle))}, ${fmt(-Math.sin(angle))}; ${fmt(Math.sin(angle))}, ${fmt(Math.cos(angle))}]`,
        `합성 원소=${prod}`,
        `χ(k)=${fmt(2 * Math.cos(angle))}`,
        '복소 체: e^(iθ), e^(−iθ)의 두 1차원 성분',
      ];
      break;
    }
  }
  return r;
}
