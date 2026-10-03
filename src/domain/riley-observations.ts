import { RILEY_EXTENDED, extendedValues, type RileyExtended } from './riley-extended-observations.ts';
import { formatNumber } from '../interactive/math-physics/presentation.mjs';

/** Explicit, bounded observation models; source data never executes code. */
export type RileyScene = RileyExtended
  | 'geometric'
  | 'complex'
  | 'vectors'
  | 'matrix'
  | 'eigen'
  | 'fourier'
  | 'ode'
  | 'wave'
  | 'diffusion'
  | 'variation'
  | 'epsilon'
  | 'newton'
  | 'cyclic'
  | 'bayes'
  | 'binomial'
  | 'statistics'
  | 'least-squares';
export type RileyField = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
};
export type RileyObservation = {
  title: string;
  question: string;
  tex: string;
  conditions: string;
  initialReason: string;
  fields: RileyField[];
  steps: string[];
};
const field = (
  key: string,
  label: string,
  min: number,
  max: number,
  value: number,
  step = 0.01,
): RileyField => ({ key, label, min, max, value, step });
export const RILEY_SCENES: Record<RileyScene, RileyObservation> = {
  ...RILEY_EXTENDED,
  geometric: {
    title: '부분합과 무한합',
    question: '유한 부분합과 무한합의 성립 조건은 어떻게 다를까요?',
    tex: String.raw`S_N=\sum_{n=0}^{N-1}r^n,\qquad S_\infty=\frac1{1-r}\ (|r|<1)`,
    conditions:
      '첫 항 1인 실수 등비급수의 사례입니다. N은 양의 정수이며 무한합은 |r|<1일 때만 표시합니다.',
    initialReason: 'r=0.55에서는 부분합이 극한에 접근하는 모습을 볼 수 있습니다.',
    fields: [field('r', '공비 r', -1.5, 1.5, 0.55), field('n', '항 수 N', 1, 100, 12, 1)],
    steps: [
      '첫 항부터 N항을 실제로 더해 부분합을 구합니다.',
      '무한합은 |r|<1 조건을 별도로 확인합니다.',
      '유한 그림과 무한합의 해석적 조건을 구별합니다.',
    ],
  },
  complex: {
    title: '복소수의 직교·극 표현',
    question: '같은 복소수의 성분과 크기·편각은 어떻게 대응할까요?',
    tex: String.raw`z=x+iy=r(\cos\theta+i\sin\theta)`,
    conditions:
      'r≥0, θ는 라디안입니다. r=0에서는 편각이 정의되지 않습니다. θ와 θ+2π는 같은 점을 나타냅니다.',
    initialReason: '단위원 위의 π/4를 두 성분이 모두 보이는 초기 상태로 사용합니다.',
    fields: [
      field('r', '크기 r', 0, 3, 1),
      field('theta', '편각 θ · rad', -6.28, 6.28, Math.PI / 4),
    ],
    steps: [
      '극좌표의 r과 θ를 정합니다.',
      'x=r cosθ, y=r sinθ로 같은 점을 표시합니다.',
      '원점과 편각의 2π 다가성을 구별합니다.',
    ],
  },
  vectors: {
    title: '내적과 외적',
    question: '내적과 외적이 같은 두 벡터에서 어떤 다른 정보를 줄까요?',
    tex: String.raw`\mathbf a=(a,1,0),\quad\mathbf b=(1,b,0),\quad\mathbf a\cdot\mathbf b=a+b,\quad\mathbf a\times\mathbf b=(0,0,ab-1)`,
    conditions:
      '오른손 Cartesian 기저를 사용한 평면 벡터 사례입니다. 외적은 순서를 바꾸면 부호가 바뀝니다.',
    initialReason: 'a=1,b=2에서 두 벡터와 유향 면적을 구별할 수 있습니다.',
    fields: [
      field('a', '첫 벡터의 x 성분 a', -3, 3, 1),
      field('b', '둘째 벡터의 y 성분 b', -3, 3, 2),
    ],
    steps: [
      '같은 기저에서 두 벡터 성분을 읽습니다.',
      '내적은 성분곱의 합으로 구합니다.',
      '외적의 방향과 순서에 따른 부호를 확인합니다.',
    ],
  },
  matrix: {
    title: '선형변환과 곱의 순서',
    question: '같은 두 변환을 다른 순서로 적용하면 결과가 같을까요?',
    tex: String.raw`A=\begin{pmatrix}a&1\\0&b\end{pmatrix},\quad B=\begin{pmatrix}1&0\\1&1\end{pmatrix},\quad\det A=ab`,
    conditions:
      '실수 2×2 행렬의 제한된 사례입니다. AB는 B를 먼저 적용합니다. ab=0이면 A는 특이합니다.',
    initialReason: 'a=b=1에서 곱의 순서가 결과를 바꾸는 모습을 봅니다.',
    fields: [
      field('a', 'A의 첫 대각 성분 a', -3, 3, 1),
      field('b', 'A의 둘째 대각 성분 b', -3, 3, 1),
    ],
    steps: [
      '같은 입력에 B 다음 A를 적용해 AB를 구합니다.',
      'A 다음 B를 적용해 BA를 구합니다.',
      '좌표·행렬식·곱의 순서를 따로 비교합니다.',
    ],
  },
  eigen: {
    title: '고유방향과 축퇴',
    question: '대칭 행렬에서 고유값과 고유방향은 어떻게 연결될까요?',
    tex: String.raw`A=\begin{pmatrix}a&b\\b&a\end{pmatrix},\quad\lambda_\pm=a\pm b,\quad v_\pm=(1,\pm1)^T`,
    conditions:
      '실대칭 2×2 행렬 사례입니다. b=0에서 고유값이 같고 모든 방향이 고유방향입니다. 일반 행렬 전체의 대각화 판정이 아닙니다.',
    initialReason: 'a=2,b=1에서 두 서로 다른 고유값과 직교 방향이 보입니다.',
    fields: [field('a', '대각 성분 a', -3, 3, 2), field('b', '비대각 성분 b', -3, 3, 1)],
    steps: [
      'Av=λv인 방향을 찾습니다.',
      '두 고유값 a+b와 a−b를 비교합니다.',
      '축퇴와 대각화 불가능을 같은 상태로 취급하지 않습니다.',
    ],
  },
  fourier: {
    title: '푸리에 부분합과 불연속점',
    question: '항을 늘리면 점프 주변과 연속 구간의 근사는 어떻게 달라질까요?',
    tex: String.raw`S_N(x)=\frac4\pi\sum_{k=0}^{N-1}\frac{\sin((2k+1)x)}{2k+1}`,
    conditions:
      '주기 2π의 사각파 사례입니다. 점프에서는 좌우 극한의 평균 0으로 수렴합니다. 유한 항 그림은 일반 수렴 증명이 아닙니다.',
    initialReason: 'N=5에서 주기와 점프 주변의 과도한 진폭이 보입니다.',
    fields: [field('n', '홀수 조화항 수 N', 1, 30, 5, 1)],
    steps: [
      '같은 주기에서 홀수 사인 성분을 더합니다.',
      '부분합과 원래 사각파를 같은 축에서 비교합니다.',
      '점프의 평균값과 Gibbs 현상을 구별합니다.',
    ],
  },
  ode: {
    title: '감쇠 진동의 세 경우',
    question: '감쇠계수와 고유각진동수의 관계가 해의 형태를 어떻게 나눌까요?',
    tex: String.raw`y''+2\gamma y'+\omega_0^2y=0,\quad y(0)=1,\quad y'(0)=0`,
    conditions:
      '상수계수 선형 ODE 사례입니다. γ≥0, ω₀>0, t≥0. 초기값·시간 단위를 고정한 무차원 관찰입니다.',
    initialReason: 'γ=0.3, ω₀=1에서는 감쇠 진동을 볼 수 있습니다.',
    fields: [field('g', '감쇠계수 γ', 0, 2, 0.3), field('w', '고유각진동수 ω₀', 0.1, 2, 1)],
    steps: [
      '특성근의 판별량 γ²−ω₀²를 확인합니다.',
      '진동·중근·서로 다른 실근의 경우를 나눕니다.',
      '같은 초기값을 만족하는 해를 비교합니다.',
    ],
  },
  wave: {
    title: '파동 방정식의 한 모드',
    question: '경계가 고정된 한 공간 모드가 시간에 따라 어떻게 움직일까요?',
    tex: String.raw`u(x,t)=\sin(\pi x)\cos(\pi ct),\qquad u_{tt}=c^2u_{xx}`,
    conditions:
      '0≤x≤1, u(0,t)=u(1,t)=0인 한 모드입니다. 초기 속도는 0입니다. 임의 경계·초기자료 전체의 해법이 아닙니다.',
    initialReason: 't=0,c=1에서 초기 공간 형태와 경계가 보입니다.',
    fields: [field('t', '시간 t', 0, 4, 0), field('c', '파동 속도 c', 0.1, 2, 1)],
    steps: [
      '고정 경계에 맞는 공간 모드 sin(πx)를 선택합니다.',
      '시간 계수를 곱해 같은 공간 모드의 진폭을 바꿉니다.',
      '두 번 미분한 식이 PDE를 만족하는 사례인지 확인합니다.',
    ],
  },
  diffusion: {
    title: '확산 방정식의 한 모드',
    question: '같은 공간 모드에서 확산계수와 시간이 진폭을 어떻게 바꿀까요?',
    tex: String.raw`u(x,t)=\sin(\pi x)e^{-D\pi^2t},\qquad u_t=Du_{xx}`,
    conditions:
      'D>0, t≥0, 0≤x≤1, 양 끝값 0인 한 모드입니다. 부호가 다른 확산이나 임의 경계의 해를 다루지 않습니다.',
    initialReason: 'D=0.1,t=0에서 초기 진폭과 이후 감쇠를 비교합니다.',
    fields: [field('t', '시간 t', 0, 4, 0), field('d', '확산계수 D', 0.01, 1, 0.1)],
    steps: [
      '공간 모드의 이차 미분에서 −π²를 얻습니다.',
      '시간 계수의 미분을 −Dπ²배로 맞춥니다.',
      '양의 확산계수에서 진폭이 감소하는 관계를 봅니다.',
    ],
  },
  variation: {
    title: '경로와 함수값의 변분',
    question: '끝점을 고정한 경로 변화가 함수값 I를 어떻게 바꿀까요?',
    tex: String.raw`y(x)=x+a\sin(\pi x),\quad I[y]=\int_0^1(y')^2dx=1+\frac{a^2\pi^2}{2}`,
    conditions:
      '끝점 y(0)=0,y(1)=1을 고정한 한 매개변수 경로족입니다. 전 함수공간의 모든 변분을 탐색하는 도구는 아닙니다.',
    initialReason: 'a=0.3에서 직선과 굽은 경로의 함수값 차이가 보입니다.',
    fields: [field('a', '경로 변화 a', -1, 1, 0.3)],
    steps: [
      '끝점을 바꾸지 않는 경로족을 선택합니다.',
      '각 경로의 도함수를 함수값의 적분에 대입합니다.',
      '이 경로족 안에서 a=0일 때 최소임을 확인합니다.',
    ],
  },
  epsilon: {
    title: 'δ와 ϵ의 성분',
    question: '첨자의 같음과 순열의 방향이 성분값을 어떻게 결정할까요?',
    tex: String.raw`\delta_{ij}=\begin{cases}1&i=j\\0&i\ne j\end{cases},\qquad\epsilon_{ijk}\in\{-1,0,1\}`,
    conditions:
      '오른손 Cartesian 기저, 첨자 i,j,k∈{1,2,3}. ϵ는 짝순열 +1, 홀순열 −1, 중복 첨자 0입니다.',
    initialReason: '(1,2,3)은 기준 순열이므로 +1입니다.',
    fields: [
      field('i', '첨자 i', 1, 3, 1, 1),
      field('j', '첨자 j', 1, 3, 2, 1),
      field('k', '첨자 k', 1, 3, 3, 1),
    ],
    steps: [
      '같은 첨자가 있는지 확인합니다.',
      '중복이 없다면 기준 순열과의 교환 수를 셉니다.',
      'δ의 두 첨자와 ϵ의 세 첨자를 구별합니다.',
    ],
  },
  newton: {
    title: 'Newton 반복과 시작점',
    question: '같은 방정식에서 시작점과 반복 횟수가 근사값을 어떻게 바꿀까요?',
    tex: String.raw`f(x)=x^2-2,\qquad x_{n+1}=x_n-\frac{x_n^2-2}{2x_n}`,
    conditions:
      '도함수 2xₙ가 0이면 이 반복식을 사용할 수 없습니다. 시작점에 따라 다른 근에 접근합니다. 잔차와 일반 수렴 증명을 구별합니다.',
    initialReason: 'x₀=1에서 √2로 접근하는 반복을 봅니다.',
    fields: [field('x', '시작점 x₀', -3, 3, 1), field('n', '반복 횟수 N', 0, 15, 5, 1)],
    steps: [
      '현재점에서 f와 f′를 구합니다.',
      '도함수가 0인지 확인한 뒤 접선의 x절편으로 이동합니다.',
      '근사값과 잔차를 함께 확인합니다.',
    ],
  },
  cyclic: {
    title: '순환군의 합성',
    question: '회전을 합성했을 때 항등원과 역원을 어떻게 찾을까요?',
    tex: String.raw`C_m:\quad k\circ l=(k+l)\bmod m`,
    conditions: '순환군 Cₘ의 정수 모듈러 덧셈 사례입니다. m≥2. 모든 비가환군을 나타내지 않습니다.',
    initialReason: 'C₄에서 한 번의 90° 회전과 역원을 확인합니다.',
    fields: [
      field('m', '군의 크기 m', 2, 8, 4, 1),
      field('k', '첫 회전 횟수 k', 0, 7, 1, 1),
      field('l', '둘째 회전 횟수 l', 0, 7, 3, 1),
    ],
    steps: [
      '회전 횟수를 m으로 나눈 나머지로 표시합니다.',
      '두 회전을 합성합니다.',
      '항등원 0과 역원 −k mod m을 확인합니다.',
    ],
  },
  bayes: {
    title: '조건부 확률과 Bayes 관계',
    question: '사전확률과 조건부 확률이 관찰 후 확률을 어떻게 바꿀까요?',
    tex: String.raw`\operatorname{Pr}(A\mid B)=\frac{\operatorname{Pr}(A\cap B)}{\operatorname{Pr}(B)},\quad \operatorname{Pr}(B)>0\qquad \operatorname{Pr}(A),\operatorname{Pr}(\bar A)>0:\ \frac{\operatorname{Pr}(B\mid A)\operatorname{Pr}(A)}{\operatorname{Pr}(B\mid A)\operatorname{Pr}(A)+\operatorname{Pr}(B\mid \bar A)\operatorname{Pr}(\bar A)}`,
    conditions:
      'A와 Ā가 표본공간을 분할합니다. 분모 Pr(B)>0일 때만 사후 조건부 확률이 정의됩니다. Pr(A)=0 또는 1이면 확률 0인 분기의 조건부 확률 입력은 해석하지 않고 결합확률 0으로 처리합니다. 가상 확률 입력이며 실제 관측 자료가 아닙니다.',
    initialReason: '사전확률 0.2와 두 조건부 확률 0.8,0.1의 차이를 비교합니다.',
    fields: [
      field('p', 'Pr(A)', 0, 1, 0.2),
      field('a', 'Pr(B|A)', 0, 1, 0.8),
      field('b', 'Pr(B|Ā)', 0, 1, 0.1),
    ],
    steps: [
      '두 분할에서 B의 결합확률을 구합니다.',
      '합으로 Pr(B)를 구하고 0인지 확인합니다.',
      'A와 B의 결합확률을 Pr(B)로 나눕니다.',
    ],
  },
  binomial: {
    title: '이항분포의 모수와 모양',
    question: '시행 수와 성공확률이 분포·평균·분산을 어떻게 바꿀까요?',
    tex: String.raw`Pr(X=k)=\binom nk p^k(1-p)^{n-k},\quad E[X]=np,\quad\operatorname{Var}(X)=np(1-p)`,
    conditions:
      '독립이고 성공확률이 같은 Bernoulli 시행 n회입니다. n은 양의 정수, 0≤p≤1. p=0,1에서는 한 점에 확률이 모입니다.',
    initialReason: 'n=10,p=0.5에서 대칭 분포를 볼 수 있습니다.',
    fields: [field('n', '시행 수 n', 1, 40, 10, 1), field('p', '성공확률 p', 0, 1, 0.5)],
    steps: [
      '독립·동일 성공확률이라는 모형 조건을 확인합니다.',
      '가능한 k별 확률을 계산합니다.',
      '분포의 합·평균·분산을 함께 확인합니다.',
    ],
  },
  statistics: {
    title: '평균과 두 분산',
    question: '같은 자료의 기술 분산과 불편 추정량은 어떻게 다를까요?',
    tex: String.raw`\bar x=\frac1N\sum x_i,\quad v=\frac1N\sum(x_i-\bar x)^2,\quad s^2=\frac1{N-1}\sum(x_i-\bar x)^2`,
    conditions:
      '고정 자료 [1,2,3,4,a]의 사례입니다. N 분모의 기술 분산과 N−1 분모의 추정량을 구별합니다. 불편성의 해석에는 독립·동일 분포와 유한 분산 등 표본 추출 가정이 필요합니다.',
    initialReason: 'a=5에서 균등한 간격의 다섯 값을 봅니다.',
    fields: [field('a', '마지막 자료값 a', -5, 15, 5)],
    steps: [
      '자료의 평균을 구합니다.',
      '평균에서의 편차 제곱을 합합니다.',
      '목적에 따라 N과 N−1 분모를 구별합니다.',
    ],
  },
  'least-squares': {
    title: '최소제곱 직선과 잔차',
    question: '한 자료점의 변화가 적합 직선과 잔차를 어떻게 바꿀까요?',
    tex: String.raw`\hat y=\alpha+\beta x,\qquad\min_{\alpha,\beta}\sum_i(y_i-\alpha-\beta x_i)^2`,
    conditions:
      'x=[0,1,2,3], y=[1,2,2,a]의 비가중 직선 적합입니다. 기울기를 구하려면 x의 편차 제곱합이 양수여야 합니다. 추론·신뢰구간은 별도 가정이 필요합니다.',
    initialReason: '마지막 y=4에서 직선과 잔차를 함께 비교합니다.',
    fields: [field('a', '마지막 y값', -3, 8, 4)],
    steps: [
      'x와 y의 평균을 구합니다.',
      '정규방정식으로 기울기와 절편을 구합니다.',
      '원자료·적합값·잔차 제곱합을 구별합니다.',
    ],
  },
};
export type RileyResult = {
  values: string[];
  condition: '충족' | '위반' | '확인 전';
  note: string;
  traces: { name: string; points: [number, number][] }[];
};
const fmt = (v: number) =>
  Number.isFinite(v)
    ? v !== 0 && Math.abs(v) < 0.005
      ? v < 0
        ? '-0.01보다 크고 0보다 작음'
        : '0보다 크고 0.01보다 작음'
      : formatNumber(v)
    : '계산 불가';
const points = (
  f: (x: number) => number,
  start: number,
  end: number,
  n = 160,
): [number, number][] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const x = start + ((end - start) * i) / n;
    return [x, f(x)];
  });
export function observeRiley(kind: RileyScene, v: Record<string, number>): RileyResult {
  const result: RileyResult = {
    values: [],
    condition: '충족',
    note: '수치는 부동소수점 근사로 계산하고 표시할 때만 반올림합니다. 저장된 조절값은 표시용 반올림으로 바꾸지 않습니다. 이 관찰은 제한된 사례이며 일반 증명이 아닙니다.',
    traces: [],
  };
  const add = (name: string, p: [number, number][]) => result.traces.push({ name, points: p });
  for (const f of RILEY_SCENES[kind].fields)
    if (
      !(kind === 'bayes' && ((v.p === 0 && f.key === 'a') || (v.p === 1 && f.key === 'b'))) &&
      (!Number.isFinite(v[f.key]) ||
        v[f.key] < f.min ||
        v[f.key] > f.max ||
        (f.step === 1 && !Number.isInteger(v[f.key])))
    )
      return {
        values: [],
        condition: '위반',
        note: '입력 범위를 확인해 주세요. 이 입력으로 계산하지 않았습니다.',
        traces: [],
      };
  if (kind in RILEY_EXTENDED) return extendedValues(kind as RileyExtended, v);
  switch (kind) {
    case 'geometric': {
      let sum = 0,
        term = 1;
      const p: [number, number][] = [];
      for (let n = 0; n < v.n; n++) {
        sum += term;
        term *= v.r;
        p.push([n + 1, sum]);
      }
      add('유한 부분합', p);
      const ok = Math.abs(v.r) < 1;
      result.condition = ok ? '충족' : '위반';
      result.values = [
        `S_N = ${fmt(sum)}`,
        ok ? `무한합 = ${fmt(1 / (1 - v.r))}` : '무한합 조건 |r|<1 위반 · 유한 부분합은 계산 가능',
      ];
      if (ok) {
        const tail = v.r ** v.n / (1 - v.r);
        result.values.push(
          `무한합−부분합: ${tail === 0 && v.r !== 0 ? '부동소수점 표현 아래의 크기 · 정확한 0으로 판정하지 않음' : fmt(tail)}`,
        );
      }
      break;
    }
    case 'complex': {
      const x = v.r * Math.cos(v.theta),
        y = v.r * Math.sin(v.theta);
      add('z의 위치', [
        [0, 0],
        [x, y],
      ]);
      add(
        '단위원',
        points((t) => Math.sin(t), -Math.PI, Math.PI).map(([t, y]) => [Math.cos(t), y]),
      );
      result.values = [
        `x = ${fmt(x)}, y = ${fmt(y)}`,
        v.r === 0 ? '원점 · 편각 정의 불가' : `크기 ${fmt(v.r)}, 선택한 편각 ${fmt(v.theta)} rad`,
      ];
      break;
    }
    case 'vectors':
      add('벡터 a', [
        [0, 0],
        [v.a, 1],
      ]);
      add('벡터 b', [
        [0, 0],
        [1, v.b],
      ]);
      result.values = [`내적 = ${fmt(v.a + v.b)}`, `외적 z 성분 = ${fmt(v.a * v.b - 1)}`];
      break;
    case 'matrix': {
      const circle = points((t) => t, 0, 2 * Math.PI).map(
        ([t]) => [Math.cos(t), Math.sin(t)] as [number, number],
      );
      add('입력 단위원', circle);
      add(
        'AB · B 먼저',
        circle.map(([x, y]) => [(v.a + 1) * x + y, v.b * x + v.b * y]),
      );
      add(
        'BA · A 먼저',
        circle.map(([x, y]) => [v.a * x + y, v.a * x + (v.b + 1) * y]),
      );
      result.values = [
        `det A = ${fmt(v.a * v.b)}`,
        v.a * v.b === 0 ? 'A는 특이행렬' : 'A는 비특이행렬',
      ];
      break;
    }
    case 'eigen':
      add('v+의 상', [
        [0, 0],
        [v.a + v.b, v.a + v.b],
      ]);
      add('v−의 상', [
        [0, 0],
        [v.a - v.b, -v.a + v.b],
      ]);
      result.values = [
        `λ+ = ${fmt(v.a + v.b)}, λ− = ${fmt(v.a - v.b)}`,
        v.b === 0 ? '고유값 축퇴 · 모든 방향이 고유방향' : '서로 다른 고유값 · 두 방향은 직교',
      ];
      break;
    case 'fourier': {
      add(
        '사각파',
        points(
          (x) => (x === 0 || Math.abs(x) === Math.PI ? 0 : Math.sign(Math.sin(x))),
          -Math.PI,
          Math.PI,
          320,
        ),
      );
      add(
        '유한 푸리에 부분합',
        points(
          (x) => {
            let s = 0;
            for (let k = 0; k < v.n; k++) s += Math.sin((2 * k + 1) * x) / (2 * k + 1);
            return (s * 4) / Math.PI;
          },
          -Math.PI,
          Math.PI,
          640,
        ),
      );
      result.values = [`홀수 조화항 ${v.n}개`, `점프 x=0의 부분합 = 0`];
      break;
    }
    case 'ode': {
      const disc = v.g * v.g - v.w * v.w;
      const f = (t: number) => {
        if (disc === 0) return Math.exp(-v.g * t) * (1 + v.g * t);
        if (disc < 0) {
          const w = Math.sqrt(-disc);
          return Math.exp(-v.g * t) * (Math.cos(w * t) + (v.g / w) * Math.sin(w * t));
        }
        const k = Math.sqrt(disc);
        return Math.exp(-v.g * t) * (Math.cosh(k * t) + (v.g / k) * Math.sinh(k * t));
      };
      add('y(t)', points(f, 0, 8));
      result.values = [
        `γ²−ω₀² = ${fmt(disc)}`,
        disc === 0 ? '임계 감쇠' : disc < 0 ? '부족 감쇠' : '과도 감쇠',
      ];
      break;
    }
    case 'wave':
      add(
        '초기 모드',
        points((x) => Math.sin(Math.PI * x), 0, 1),
      );
      add(
        '현재 모드',
        points((x) => Math.sin(Math.PI * x) * Math.cos(Math.PI * v.c * v.t), 0, 1),
      );
      result.values = [
        `시간 진폭 = ${fmt(Math.cos(Math.PI * v.c * v.t))}`,
        '고정 경계 u(0,t)=u(1,t)=0',
      ];
      break;
    case 'diffusion': {
      const amplitude = Math.exp(-v.d * Math.PI * Math.PI * v.t);
      add(
        '초기 모드',
        points((x) => Math.sin(Math.PI * x), 0, 1),
      );
      add(
        '현재 모드',
        points((x) => Math.sin(Math.PI * x) * amplitude, 0, 1),
      );
      result.values = [`시간 진폭 = ${fmt(amplitude)}`, '확산계수 D>0'];
      break;
    }
    case 'variation':
      add('고정 끝점의 직선', [
        [0, 0],
        [1, 1],
      ]);
      add(
        '현재 경로',
        points((x) => x + v.a * Math.sin(Math.PI * x), 0, 1),
      );
      result.values = [
        `I = ${fmt(1 + (v.a * v.a * Math.PI * Math.PI) / 2)}`,
        '끝점 y(0)=0, y(1)=1 유지',
      ];
      break;
    case 'epsilon': {
      const a = [v.i, v.j, v.k];
      let inv = 0;
      for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) if (a[i] > a[j]) inv++;
      result.values = [
        `δij = ${v.i === v.j ? 1 : 0}`,
        `ϵijk = ${new Set(a).size < 3 ? 0 : inv % 2 ? -1 : 1}`,
      ];
      break;
    }
    case 'newton': {
      let x = v.x;
      const p: [number, number][] = [[0, x]];
      if (x === 0) {
        result.condition = '위반';
        result.note =
          '도함수 0으로 첫 반복식을 사용할 수 없습니다. 방정식의 근이 없다는 뜻은 아닙니다.';
      }
      for (let i = 0; i < v.n; i++) {
        if (x === 0) {
          result.condition = '위반';
          result.note =
            '도함수 0으로 반복식을 사용할 수 없습니다. 방정식의 근이 없다는 뜻은 아닙니다.';
          break;
        }
        const next = (x + 2 / x) / 2;
        if (!Number.isFinite(next)) {
          result.condition = '확인 전';
          result.note =
            '다음 반복값이 부동소수점 계산 범위를 넘었습니다. 수학적 발산이나 근의 부재로 판정하지 않으며, 앞서 계산한 유한 반복값까지만 표시합니다.';
          break;
        }
        x = next;
        p.push([i + 1, x]);
      }
      add('반복값', p);
      result.values = [`현재 x = ${fmt(x)}`, `잔차 x²−2 = ${fmt(x * x - 2)}`];
      if (!Number.isFinite(x * x - 2)) {
        result.condition = '확인 전';
        result.note =
          '반복값은 계산했지만 잔차의 제곱 계산이 부동소수점 범위를 넘었습니다. 잔차를 수치로 확인하지 못했으며 수학적 발산을 판정하지 않습니다.';
      }
      break;
    }
    case 'cyclic': {
      const k = v.k % v.m,
        l = v.l % v.m;
      result.values = [
        `정규화한 k=${k}, l=${l}`,
        `합성 = ${(k + l) % v.m}`,
        `k의 역원 = ${(v.m - k) % v.m}`,
      ];
      break;
    }
    case 'bayes': {
      const joint = v.p === 0 ? 0 : v.p * v.a;
      const complement = v.p === 1 ? 0 : (1 - v.p) * v.b;
      const d = joint + complement;
      if (v.p === 0 || v.p === 1)
        result.note =
          '확률이 0인 분기의 조건부 확률 입력은 이 경우에 해석하지 않고 계산에서 제외합니다. 해당 분기의 결합확률은 0으로 정해 Pr(A∩B)/Pr(B)를 계산합니다.';
      result.values = [
        `Pr(B) = ${fmt(d)}`,
        d === 0 ? 'Pr(B)=0 · 조건부 확률 정의 불가' : `Pr(A|B) = ${fmt(joint / d)}`,
      ];
      if (d === 0) {
        result.condition = '위반';
        result.note =
          '분모가 0입니다. 입력 사건 자체의 불가능이나 사용자 실패를 판정하지 않습니다.';
      }
      break;
    }
    case 'binomial': {
      const p: [number, number][] = [];
      let choose = 1;
      for (let k = 0; k <= v.n; k++) {
        if (k) choose *= (v.n - k + 1) / k;
        const prob =
          v.p === 0
            ? k === 0
              ? 1
              : 0
            : v.p === 1
              ? k === v.n
                ? 1
                : 0
              : choose * Math.pow(v.p, k) * Math.pow(1 - v.p, v.n - k);
        p.push([k, prob]);
      }
      add('확률 질량 Pr(X=k)', p);
      result.values = [
        `평균 = ${fmt(v.n * v.p)}, 분산 = ${fmt(v.n * v.p * (1 - v.p))}`,
        `확률의 합 = ${fmt(p.reduce((s, [, p]) => s + p, 0))}`,
      ];
      break;
    }
    case 'statistics': {
      result.condition = '확인 전';
      result.note =
        '평균과 두 분산의 값은 계산했습니다. 불편 추정의 해석에는 독립·동일 분포와 유한 분산 등의 가정이 필요하며, 이 인공 자료의 표본 추출 조건은 확인 전입니다.';
      const xs = [1, 2, 3, 4, v.a],
        m = xs.reduce((a, b) => a + b, 0) / 5,
        ss = xs.reduce((s, x) => s + (x - m) ** 2, 0);
      add(
        '자료값',
        xs.map((x, i) => [i + 1, x]),
      );
      result.values = [
        `평균 = ${fmt(m)}`,
        `기술 분산 N 분모 = ${fmt(ss / 5)}`,
        `N−1 분모 = ${fmt(ss / 4)}`,
      ];
      break;
    }
    case 'least-squares': {
      const xs = [0, 1, 2, 3],
        ys = [1, 2, 2, v.a],
        xm = 1.5,
        ym = ys.reduce((a, b) => a + b, 0) / 4;
      const b = xs.reduce((s, x, i) => s + (x - xm) * (ys[i] - ym), 0) / 5,
        a = ym - b * xm;
      add(
        '원자료',
        xs.map((x, i) => [x, ys[i]]),
      );
      add(
        '적합 직선',
        points((x) => a + b * x, 0, 3),
      );
      result.values = [
        `절편 α = ${fmt(a)}, 기울기 β = ${fmt(b)}`,
        `잔차 제곱합 = ${fmt(xs.reduce((s, x, i) => s + (ys[i] - a - b * x) ** 2, 0))}`,
      ];
      break;
    }
  }
  return result;
}
