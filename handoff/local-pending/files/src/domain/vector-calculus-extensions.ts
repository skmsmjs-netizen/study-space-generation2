import { add, cross, frame, norm, scale, type Vec3 } from './math-explorer';
import type { ObservationSpec, ObservationResult, Parameter } from './vector-calculus';
import type { MathTemplate, TemplateResult } from './math-templates';

const p = (
  key: string,
  label: string,
  min: number,
  max: number,
  initial: number,
  options?: string[],
): Parameter => ({ key, label, min, max, initial, integer: !!options, options });
const xyz = (prefix: string, initial: Vec3) =>
  ['x', 'y', 'z'].map((c, i) => p(prefix + c, `${prefix} · ${c} 성분`, -3, 3, initial[i]));
const choice = (key: string, label: string, options: string[], initial = 0) =>
  p(key, label, 0, options.length - 1, initial, options);
const spec = (
  parameters: Parameter[],
  question: string,
  fixed: string,
  equations: string[],
  limitations: string,
): ObservationSpec => ({
  parameters,
  question,
  fixed,
  equations,
  limitations,
  initialReason:
    '정칙한 비퇴화 예시를 먼저 비교한다. 특이점·경계·반대 방향은 같은 조절부에서 확인한다.',
});
const id = (m: string) => `${m}:extension:1`;
export const VECTOR_EXTENSION_SPECS: Record<string, ObservationSpec> = {
  [id('A1')]: spec(
    [
      ...xyz('v', [2, 1, 1]),
      ...xyz('w', [1, -1, 2]),
      p('c', '스칼라 c', -3, 3, 1),
      p('alpha', '직교기저 회전 α (°)', -180, 180, 30),
    ],
    '같은 공간 벡터를 더하고 늘린 뒤, 기저를 돌리면 물리적 벡터와 성분 중 무엇이 바뀌는가?',
    '오른손 직교기저를 z축 주위로 회전. v,w는 공간의 같은 벡터. 성분의 단위는 공통 추상 길이.',
    [
      String.raw`\mathbf v+\mathbf w,\quad c\mathbf v,\quad [\mathbf v]_{\mathcal B}=R_z(\alpha)^T\mathbf v`,
    ],
    '직교기저 회전 가족을 구현한다. 임의 비직교기저에서는 성분의 제곱합을 길이로 사용할 수 없다.',
  ),
  [id('A2')]: spec(
    [...xyz('v', [2, 1, 1]), ...xyz('w', [1, -1, 2])],
    '임의 공간 성분의 내적과 평행·수직 분해는 같은 두 벡터에 어떻게 대응하는가?',
    '유클리드 직교좌표. 정사영 기준은 w. v,w의 길이 단위는 같다.',
    [
      String.raw`\operatorname{proj}_{\mathbf w}\mathbf v=\frac{\mathbf v\cdot\mathbf w}{\|\mathbf w\|^2}\mathbf w,\quad\mathbf v=\mathbf v_\parallel+\mathbf v_\perp`,
    ],
    'w=0이면 정사영 미정의. 영벡터가 포함되면 각도 미정의. 유한 정밀도에서 직교 잔차를 함께 읽는다.',
  ),
  [id('A3')]: spec(
    [
      ...xyz('u', [1, 0, 0]),
      ...xyz('v', [0, 1, 0]),
      ...xyz('w', [0, 0, 1]),
      ...xyz('q', [0, 1, 1]),
      p('d', '평면 높이 d', -3, 3, 1),
    ],
    '방향과 상대 위치를 바꾸면 두 직선·평면의 교차, 거리와 삼중곱 부피는 어떻게 구별되는가?',
    'L₁=tu, L₂=q+sv, 평면 z=d. u,v는 방향, q는 위치 차이, w는 삼중곱의 세 번째 벡터.',
    [
      String.raw`V=|\mathbf u\cdot(\mathbf v\times\mathbf w)|`,
      String.raw`d(L_1,L_2)=\frac{|\mathbf q\cdot(\mathbf u\times\mathbf v)|}{\|\mathbf u\times\mathbf v\|}`,
    ],
    '비평행 거리식과 평행 거리식을 구별한다. 방향이 영이면 직선이 아니다. 평면 비교는 z=d 가족; 임의 법선 평면의 일반식은 원식에서 읽는다.',
  ),
  [id('A4')]: spec(
    [
      choice('kind', '이차곡면 종류', [
        '타원체',
        '타원포물면',
        '쌍곡포물면',
        '일엽쌍곡면',
        '이엽쌍곡면',
        '타원뿔',
      ]),
      p('a', 'x축 길이 a', 0.1, 3, 1),
      p('b', 'y축 길이 b', 0.1, 3, 1),
      p('c', 'z축 길이 c', 0.1, 3, 1),
      p('z0', '단면 높이 z₀', -3, 3, 0.5),
    ],
    '곡면 전체와 같은 높이의 단면은 이차곡면의 종류·축척을 어떻게 함께 보여주는가?',
    'a,b,c>0. 직교 x,y,z는 같은 길이 단위·같은 축척. 중앙축 주위의 표준 이차곡면 가족.',
    [
      String.raw`\frac{x^2}{a^2}+\frac{y^2}{b^2}\pm\frac{z^2}{c^2}=\pm1`,
      String.raw`\frac zc=\frac{x^2}{a^2}\pm\frac{y^2}{b^2},\quad z=z_0`,
    ],
    '표시한 유한 패치 밖에도 곡면이 이어질 수 있다. 이엽은 두 패치를 유지한다. 단면이 없는 것과 곡면 전체가 없는 것을 구별한다.',
  ),
  [id('A5')]: spec(
    [
      choice('kind', '공간곡선', ['원형 나선', '삼차 베지에']),
      p('a', '나선 반지름 / 제어점 폭 a', 0, 3, 1),
      p('h', '상승 / 제어점 높이 h', -2, 2, 0.5),
      p('t', '정규화 매개변수 t', 0, 1, 0.25),
      choice('reparam', '매개화', ['원래 매개화', 't² 재매개화']),
    ],
    '같은 공간곡선의 위치·속력·T/N/B는 베지에 제어점과 재매개화에서 어떻게 바뀌는가?',
    '나선 u∈[0,2π], 베지에 u∈[0,1]. 재매개화 u=L t 또는 L t²; t∈[0,1]. 오른손 기저.',
    [
      String.raw`\mathbf T=\frac{\mathbf r'}{\|\mathbf r'\|},\quad\mathbf B=\frac{\mathbf r'\times\mathbf r''}{\|\mathbf r'\times\mathbf r''\|},\quad\mathbf N=\mathbf B\times\mathbf T`,
      String.raw`\mathbf r_B(u)=\sum_{j=0}^3\binom3j(1-u)^{3-j}u^j\mathbf P_j`,
    ],
    't²의 t=0에서는 속도가0이므로 재매개화한 T/N/B 미정의. 곡률0이면 N/B 미정의. 속력은 매개화에 의존하며 같은 곡선의 길이는 보존된다.',
  ),
  [id('B1')]: spec(
    [
      choice('kind', '원점에서 비교할 함수', [
        'xy/(x²+y²), 원점 값0',
        'xy/√(x²+y²), 원점 값0',
        'x²+y²',
      ]),
      p('m', '접근 기울기 m', -3, 3, 1),
      p('t', '접근 t', 0, 1, 0.2),
    ],
    '원점의 편미분 존재, 연속, 미분 가능은 같은 조건인가?',
    '각 함수의 원점 값을 명시적으로0으로 정의. 경로는 (t,mt). 첫 두 함수의 원점 편미분은0.',
    [
      String.raw`f_1=\frac{xy}{x^2+y^2},\quad f_2=\frac{xy}{\sqrt{x^2+y^2}},\quad f_3=x^2+y^2`,
      String.raw`\text{미분 가능}\Rightarrow\text{연속},\quad C^1\Rightarrow\text{미분 가능}`,
    ],
    '경로 표본은 증명이 아니다. f₁의 두 경로 극한, f₂의 연속 상계와 선형근사 잔차를 정확한 식으로 설명한다. 역함의는 반례로 구별한다.',
  ),
  [id('B2')]: spec(
    [
      choice('kind', '접평면 대상', ['그래프 z=x²+y²', '등위면 x²+y²+z²=상수']),
      p('x', '점 x', -2, 2, 1),
      p('y', '점 y', -2, 2, 1),
      p('z', '등위면 점 z', -2, 2, 1),
    ],
    '그래프와 등위면의 같은 점에서 접평면과 법선은 어떤 정칙 조건으로 연결되는가?',
    '그래프 점은 (x,y,x²+y²). 등위면은 선택점에서 정한 수준값. 모든 좌표는 추상 길이.',
    [
      String.raw`z-z_0=2x_0(x-x_0)+2y_0(y-y_0)`,
      String.raw`\nabla F(\mathbf p)\cdot(\mathbf x-\mathbf p)=0,\quad\nabla F(\mathbf p)\ne\mathbf0`,
    ],
    '등위면의 원점은 gradient0이고 수준0은 한 점이다. 정칙 접평면 정리를 적용하지 않는다. 법선이0이면 방향이 없다.',
  ),
  [id('B3')]: spec(
    [
      p('a', '이차형 계수 a', -2, 2, 1),
      p('b', '교차항 계수 b', -2, 2, 0.3),
      p('c', '이차형 계수 c', -2, 2, 1),
      p('x', 'Newton 시작 x', -2, 2, 1),
      p('y', 'Newton 시작 y', -2, 2, 0.5),
      choice('constraint', '탐색 영역', ['전체 평면', '단위원 제약']),
      p('theta', '제약점 θ (°)', -180, 180, 30),
    ],
    'Hessian·Newton 갱신과 단위원 Lagrange 조건은 어떤 극값 후보를 허용하는가?',
    'f=ax²+2bxy+cy². 단위원 g=x²+y²−1=0; ∇g≠0. Hessian은 상수이며 선형항은0.',
    [
      String.raw`H=2\begin{pmatrix}a&b\\b&c\end{pmatrix},\quad D=4(ac-b^2)`,
      String.raw`H\Delta=-\nabla f,\quad\nabla f=\lambda\nabla g`,
    ],
    'D=0의 일반 이차미분 판정은 불확정이며 이 예시는 이차형 자체로 추가 분석한다. Newton은 H 역가역을 요구하며 극소 보장은 하지 않는다. 단위원 최댓값·최솟값은 이차형 고유값으로 정확 비교한다.',
  ),
  [id('C1')]: spec(
    [
      choice('kind', '적분 영역', ['삼각형 x≥0,y≥0,x+y≤a', '반지름 a의 구']),
      p('a', '영역 크기 a', 0, 3, 2),
      p('s', '절단 위치 비율 s', -1, 1, 0.25),
      choice('order', '읽을 적분 순서', ['dy dx / dz dy dx', 'dx dy / dx dz dy']),
    ],
    '절단 방향과 적분 순서를 바꾸어도 같은 영역·적분은 어떻게 보존되는가?',
    '삼각형 f=x+y; 구는 f=1의 부피적분. a>0에서 비퇴화. 유계 영역의 연속 피적분 함수.',
    [
      String.raw`\int_0^a\int_0^{a-x}(x+y)\,dy\,dx=\int_0^a\int_0^{a-y}(x+y)\,dx\,dy=\frac{a^3}{3}`,
      String.raw`\iiint_{x^2+y^2+z^2\le a^2}1\,dV=\frac{4\pi a^3}{3}`,
    ],
    '양의 연속 함수·유계 영역의 예시다. 부적절 적분이나 조건부 수렴에서 순서 교환을 일반화하지 않는다. 구의 그림은 중앙/선택 높이의 단면과 3D 경계를 함께 표시한다.',
  ),
  [id('C2')]: spec(
    [],
    '유한 의사난수 표본의 그림은 독립·균등 가정을 증명하는가?',
    '기존 LCG 시드·표본 실험은 재현 가능한 계산이다. 확률 모형의 독립·균등 가정은 별도 전제.',
    [String.raw`\operatorname{SE}(\widehat I)=\frac{s}{\sqrt N}\quad\text{(독립 표본 모형 가정)}`],
    '반복 횟수가 늘어도 유한 표본만으로 독립성을 증명하지 않는다. 확률 수렴·보장 범위를 원문 설명과 구별한다. 이 항목은 정적 설명이 적합하다.',
  ),
  [id('C3')]: spec(
    [
      choice('kind', '좌표계', ['극좌표', '원통좌표', '구면좌표']),
      p('r', '반지름 r / ρ', 0, 3, 1),
      p('theta', '방위각 θ (°)', -180, 180, 30),
      p('phi', '+z축 각도 φ (°)', 0, 180, 60),
      p('z', '원통 높이 z', -2, 2, 1),
    ],
    '같은 점의 좌표 기저와 길이 배율은 야코비안·적분 요소에 어떻게 대응하는가?',
    '교재 구면 약속: θ는 방위각, φ는 +z축 각도. 각도 미분식은 rad. 화면 °는 계산 시 rad로 환산.',
    [
      String.raw`dA=r\,dr\,d\theta,\quad dV_{\rm cyl}=r\,dr\,d\theta\,dz,\quad dV_{\rm sph}=\rho^2\sin\phi\,d\rho\,d\theta\,d\phi`,
    ],
    '원점·축·극에서 좌표변환의 정칙성이 깨지지만 실제 공간점/장 자체가 반드시 특이한 것은 아니다. 기저 화살표는 단위벡터, 배율은 현재값에서 따로 표시한다.',
  ),
  [id('C4')]: spec(
    [
      choice('kind', '가중 영역', ['단위 정사각형', '단위 정육면체']),
      p('k', 'x 방향 밀도 기울기 k', -1, 3, 1),
      p('l', 'y 방향 밀도 기울기 ℓ', -1, 3, 0.5),
      p('a', '사건 x 상한 a', 0, 1, 0.5),
      p('b', '사건 y 상한 b', 0, 1, 0.5),
    ],
    '같은 평면·입체의 비음수 밀도를 정규화하면 질량중심·주변밀도·사건 확률은 어떻게 대응하는가?',
    'δ=(1+kx)(1+ℓy), k,ℓ≥−1. 3D에서도 z방향 균일. x,y,z∈[0,1]. 질량 밀도와 정규화 확률밀도의 단위 구별.',
    [
      String.raw`M=(1+k/2)(1+\ell/2),\quad p(x,y)=\delta/M`,
      String.raw`P(X\le a,Y\le b)=\frac{(a+ka^2/2)(b+\ell b^2/2)}{M}`,
    ],
    '유계 비음수 밀도에서 질량·기댓값 존재를 확인한다. 이 곱 형태에서는 정규화 후 독립성이 성립하지만 모든 결합밀도가 독립인 것은 아니다.',
  ),
  [id('D1')]: spec(
    [
      choice('field', '벡터장', ['보존장 ∇(x²+y²)', '회전장 (−y/2,x/2)']),
      choice('path', '같은 끝점 경로', ['직선', '포물선 y=x²/a', '꺾은선']),
      p('a', '끝점 x=y=a', 0, 2, 1),
    ],
    '같은 두 끝점의 경로를 바꾸면 벡터 선적분·퍼텐셜 차이와 스칼라 선적분은 어떻게 구별되는가?',
    '시작(0,0), 끝(a,a). 스칼라 선적분은 밀도1의 길이. 보존장은 전평면 C¹이고 퍼텐셜 f=x²+y².',
    [
      String.raw`\int_C\nabla f\cdot d\mathbf r=f(B)-f(A)=2a^2`,
      String.raw`\int_C1\,ds=\operatorname{length}(C)`,
    ],
    '꺾은선은 조각별 매끄럽다. 회전장은 퍼텐셜 차이 식을 사용하지 않는다. 포물선은 y=x²/a의 같은 끝점 가족(a>0), a=0에서는 퇴화 점.',
  ),
  [id('D2')]: spec(
    [
      p('inner', '안쪽 반지름 a', 0, 2, 0.5),
      p('outer', '바깥 반지름 b', 0, 3, 1.5),
      choice('field', '환형 영역의 장', ['특이장 (−y/r²,x/r²)', '매끈한 회전장 (−y/2,x/2)']),
      p('sign', '영역 법선 방향 ε', -1, 1, 1),
    ],
    '환형 영역에서 안팎 경계의 방향을 함께 세면 순환과 그린 내부적분은 어떻게 대응하는가?',
    '0<a<b에서 양의 경계: 바깥 반시계·안쪽 시계. 특이장은 원점을 제외한 근방에서 C¹.',
    [
      String.raw`\oint_{\partial R}\mathbf F\cdot d\mathbf r=\varepsilon\left(\oint_{C_b}^{\rm CCW}\mathbf F\cdot d\mathbf r+\oint_{C_a}^{\rm CW}\mathbf F\cdot d\mathbf r\right)`,
      String.raw`\varepsilon(2\pi-2\pi)=0,\quad\varepsilon(\pi b^2-\pi a^2)=\varepsilon\pi(b^2-a^2)`,
    ],
    'a≥b는 유효한 환형 영역이 아니다. 특이장의 a=0은 원점이 들어가므로 정리 적용 불가. 경계0과 정리 적용 가능을 별도로 판단한다.',
  ),
  [id('D3')]: spec(
    [
      p('h', '매개곡면 높이 h', -2, 2, 1),
      p('u', '현재 u', -1, 1, 0.5),
      p('v', '현재 v', -1, 1, 0.25),
      p('sign', '법선 방향 ε', -1, 1, 1),
    ],
    '매개곡면의 두 접벡터 외적은 넓이 요소·방향·플럭스를 어떻게 함께 정하는가?',
    'r(u,v)=(u,v,h(u²+v²)), (u,v)∈[−1,1]²; 장 F=(0,0,1). 길이·넓이·유량 단위 구별.',
    [
      String.raw`\mathbf r_u\times\mathbf r_v=(-2hu,-2hv,1),\quad d\sigma=\sqrt{1+4h^2(u^2+v^2)}\,du\,dv`,
      String.raw`\iint_\Sigma\mathbf F\cdot\mathbf n\,d\sigma=4\varepsilon`,
    ],
    '단위법선과 넓이 요소를 구별한다. 닫히지 않은 패치에 발산정리를 바로 적용하지 않는다. 곡면 면적은 중점합 근사와 두 분할의 차이를 표시한다.',
  ),
  [id('D4')]: spec(
    [
      p('r', '공통 경계 반지름 r', 0, 3, 1),
      p('h', '곡면 높이 h', -2, 2, 1),
      p('sign', '법선 방향 ε', -1, 1, 1),
    ],
    '같은 원 경계를 가진 평평한 원판과 굽은 곡면에서 curl 플럭스는 언제 같은가?',
    '곡면 z=h(1−(x²+y²)/r²), 원판 z=0, 같은 x²+y²=r² 경계. F=(−y/2,x/2,0), curl F=(0,0,1).',
    [
      String.raw`\oint_C\mathbf F\cdot d\mathbf r=\iint_{\Sigma_0}(\nabla\times\mathbf F)\cdot\mathbf n\,d\sigma=\iint_{\Sigma_h}(\nabla\times\mathbf F)\cdot\mathbf n\,d\sigma=\varepsilon\pi r^2`,
    ],
    'r>0에서 매끄럽고 가향이며 경계 방향이 호환된다. 장은 두 곡면의 근방에서 C¹. r=0은 정칙 곡면이 아니며 극한0과 정리 적용을 구별한다.',
  ),
  [id('D5')]: spec(
    [
      choice('kind', '연산자 좌표계', ['직교좌표', '원통좌표', '구면좌표']),
      p('r', '반지름 r / ρ', 0, 3, 1),
      p('theta', '방위각 θ (°)', -180, 180, 30),
      p('phi', '+z축 각도 φ (°)', 0, 180, 60),
      p('z', '원통 높이 z', -2, 2, 1),
    ],
    '동일한 f=x²+y²+z²와 F=(x,y,z)의 성분·기저를 바꾸어도 gradient·divergence·curl·Laplacian은 어떻게 일치하는가?',
    '교재 θ/φ 약속 유지. F의 성분은 좌표 단위기저에 대한 성분. 각도 연산은 rad.',
    [
      String.raw`\nabla f=2\mathbf F,\quad\nabla\cdot\mathbf F=3,\quad\nabla\times\mathbf F=\mathbf0,\quad\nabla^2f=6`,
    ],
    '세 좌표계에서 같은 장의 12개 연산 결과를 비교한다. 축·극의 좌표식 분모0에서는 직접 대입을 중단하고 직교좌표 결과를 따로 유지한다. 좌표 특이점과 장의 특이점을 혼동하지 않는다.',
  ),
};
export const EXTENSION_NAMES: Record<string, string> = {
  A1: '공간 성분과 기저',
  A2: '공간 정사영',
  A3: '직선·평면·부피',
  A4: '이차곡면과 단면',
  A5: '공간곡선과 매개화',
  B1: '조건의 함의와 반례',
  B2: '곡면과 접평면',
  B3: '다변수 극값과 제약',
  C1: '영역·절단·적분 순서',
  C2: '표본 모형의 가정',
  C3: '좌표 기저와 야코비안',
  C4: '평면·입체 밀도와 확률',
  D1: '같은 끝점의 경로',
  D2: '환형 영역과 안쪽 경계',
  D3: '매개곡면과 플럭스',
  D4: '같은 경계의 두 곡면',
  D5: '좌표별 12개 연산자',
};
const initialReasons: Record<string, string> = {
  A1: '서로 다른 z 성분과 30° 기저 회전으로 벡터 자체와 성분의 차이를 먼저 드러낸다.',
  A2: '비평행인 두 비영 벡터를 골라 평행·수직 성분이 모두 나타나게 한다.',
  A3: '삼중곱 부피1, 두 직선 거리1의 예시로 부피·거리·평면 교차의 서로 다른 조건을 비교한다.',
  A4: '양의 세 축 길이와 중간 단면 높이로 전체 곡면과 비퇴화 단면을 함께 읽는다.',
  A5: '반지름1·상승0.5의 나선과 t=0.25로 비영 속력·곡률의 T/N/B를 먼저 보여준다.',
  B1: '기울기1·접근값0.2에서 편미분 존재와 불연속이 함께 나타나는 반례를 먼저 읽는다.',
  B2: '원점 밖 그래프 점을 골라 비영 법선과 접평면의 수직 관계를 확인한다.',
  B3: '양의 계수와 비영 교차항으로 양의 정부호 Hessian을 먼저 비교하며 제약을 전환한다.',
  C1: '크기2·내부 절단으로 삼각형 적분 범위의 두 읽기 순서를 비교한다.',
  C2: '이 항목은 조절값 없이 확률 모형의 가정과 유한 표본의 증거 수준을 읽는다.',
  C3: '반지름1·방위각30°·+z축 각도60°로 축·극을 피한 좌표점을 먼저 비교한다.',
  C4: '양의 밀도 기울기와 절반 사건 영역으로 질량·가중 평균·확률의 차이를 드러낸다.',
  D1: '서로 다른 세 경로가 공유하는 끝점(1,1)에서 보존장 적분과 경로 길이를 비교한다.',
  D2: '안쪽0.5·바깥1.5로 원점이 제외된 환형 영역의 양쪽 경계 방향을 비교한다.',
  D3: '높이1의 굽은 패치와 내부 매개점을 골라 단위법선·넓이 배율·플럭스를 구별한다.',
  D4: '반지름1·높이1로 같은 경계의 원판과 굽은 곡면을 서로 다른 모습으로 비교한다.',
  D5: '축·극 밖의 같은 공간점을 골라 좌표 성분을 바꾸어도 같은 네 연산 결과를 비교한다.',
};
for (const [module, reason] of Object.entries(initialReasons))
  VECTOR_EXTENSION_SPECS[id(module)].initialReason = reason;
export interface ExtensionResult extends ObservationResult {
  spatial?: TemplateResult;
}
const origin: Vec3 = [0, 0, 0];
const dot = (a: Vec3, b: Vec3) => a.reduce((s, x, i) => s + x * b[i], 0);
const unit = (v: Vec3): Vec3 => {
  const length = norm(v);
  return v.map((x) => x / length) as Vec3;
};
const sub = (a: Vec3, b: Vec3) => add(a, scale(b, -1));
const vector = (p: Record<string, number>, key: string): Vec3 => [
  p[key + 'x'],
  p[key + 'y'],
  p[key + 'z'],
];
const tuple = (v: Vec3) => '(' + v.map((x) => String(x)).join(', ') + ')';
const samples = (f: (t: number) => Vec3, lo = 0, hi = 1, n = 80) =>
  Array.from({ length: n + 1 }, (_, i) => f(lo + ((hi - lo) * i) / n));
const spatial = (): TemplateResult => ({
  tex: [],
  lines: [],
  is3d: true,
  point: null,
  readouts: [],
  notices: [],
});
const segment = (
  r: TemplateResult,
  name: string,
  start: Vec3,
  end: Vec3,
  role: 'curve' | 'secondary' = 'curve',
) => r.lines.push({ name, points: [start, end], role });
const arrow = (r: TemplateResult, name: string, start: Vec3, v: Vec3) => {
  segment(r, name, start, add(start, v));
  (r.arrows ??= []).push({ at: start, vector: v });
};
const circle = (radius: number, z = 0) =>
  samples((t) => [radius * Math.cos(t), radius * Math.sin(t), z], 0, 2 * Math.PI);
const surface = (
  f: (u: number, v: number) => Vec3,
  ur: [number, number],
  vr: [number, number],
  n = 24,
): NonNullable<TemplateResult['surface']> => {
  const x: number[][] = [],
    y: number[][] = [],
    z: number[][] = [];
  for (let j = 0; j <= n; j++) {
    x[j] = [];
    y[j] = [];
    z[j] = [];
    for (let i = 0; i <= n; i++) {
      const v = f(ur[0] + ((ur[1] - ur[0]) * i) / n, vr[0] + ((vr[1] - vr[0]) * j) / n);
      x[j][i] = v[0];
      y[j][i] = v[1];
      z[j][i] = v[2];
    }
  }
  return { x, y, z };
};
export function extensionTemplate(id: string): MathTemplate {
  return {
    version: 1,
    id,
    kind: 'parametric-surface',
    title: EXTENSION_NAMES[id.split(':')[0]],
    expressions: [],
    ranges: { x: [-3, 3], y: [-3, 3], z: [-3, 3] },
    parameters: [],
    cursor: {},
    initial: [],
    notes: '',
    source: { title: 'Michael Corral · Vector Calculus', reference: id },
    subject: '벡터 미적분',
  };
}
export function observeVectorExtension(ident: string, p: Record<string, number>): ExtensionResult {
  const module = ident.split(':')[0],
    r: ExtensionResult = { traces: [], values: [], judgment: '', axes: ['x', 'y'], extent: 3 };
  const values = r.values,
    scene = spatial();
  const series = (label: string, points: Vec3[], dashed = false) =>
    r.traces.push({ label, points: points.map((v) => [v[0], v[1]]), dashed });
  const mesh = (f: (u: number, v: number) => Vec3, ur: [number, number], vr: [number, number]) => {
    scene.surface = surface(f, ur, vr);
  };
  if (module === 'A1' || module === 'A2') {
    const v = vector(p, 'v'),
      w = vector(p, 'w');
    arrow(scene, 'v', origin, v);
    arrow(scene, 'w', origin, w);
    if (module === 'A1') {
      const total = add(v, w),
        cv = scale(v, p.c),
        a = (p.alpha * Math.PI) / 180,
        c = Math.cos(a),
        s = Math.sin(a),
        e1: Vec3 = [c, s, 0],
        e2: Vec3 = [-s, c, 0];
      arrow(scene, 'v+w', origin, total);
      arrow(scene, 'cv', origin, cv);
      arrow(scene, 'e₁', origin, e1);
      arrow(scene, 'e₂', origin, e2);
      arrow(scene, 'e₃', origin, [0, 0, 1]);
      values.push(
        ['v+w', tuple(total)],
        ['cv', tuple(cv)],
        ['기저 성분 [v]', tuple([dot(v, e1), dot(v, e2), v[2]])],
        ['공간 길이', norm(v)],
      );
      r.judgment = '기저를 회전해도 같은 벡터의 길이와 공간 방향은 유지되고 성분이 바뀐다.';
    } else {
      const vn = norm(v),
        wn = norm(w);
      values.push(
        ['v·w', dot(v, w)],
        [
          '각도 (°)',
          vn === 0 || wn === 0
            ? '미정의'
            : (Math.acos(Math.max(-1, Math.min(1, dot(unit(v), unit(w))))) * 180) / Math.PI,
        ],
      );
      if (wn === 0) {
        values.push(['정사영', '기준 w=0 · 미정의']);
        r.judgment = '내적은0이지만 기준 영벡터의 정사영과 각도는 정의되지 않는다.';
      } else {
        const direction = unit(w),
          parallel = scale(direction, dot(v, direction)),
          perp = sub(v, parallel);
        arrow(scene, '평행 성분', origin, parallel);
        arrow(scene, '수직 성분', parallel, perp);
        values.push(
          ['평행 성분', tuple(parallel)],
          ['수직 성분', tuple(perp)],
          ['직교 잔차', dot(perp, direction)],
        );
        r.judgment = '평행+수직 성분은 원래 벡터와 같다. 표시 잔차는 부동소수점 오차를 포함한다.';
      }
    }
  } else if (module === 'A3') {
    const u = vector(p, 'u'),
      v = vector(p, 'v'),
      w = vector(p, 'w'),
      q = vector(p, 'q'),
      un = norm(u),
      vn = norm(v),
      uv = un && vn ? cross(unit(u), unit(v)) : origin,
      uvn = norm(uv);
    scene.lines.push(
      { name: 'L₁', points: samples((t) => scale(u, t), -2, 2) },
      { name: 'L₂', points: samples((t) => add(q, scale(v, t)), -2, 2) },
    );
    arrow(scene, 'w', origin, w);
    mesh((x, y) => [x, y, p.d], [-3, 3], [-3, 3]);
    values.push(
      ['삼중곱', dot(u, cross(v, w))],
      ['부피', Math.abs(dot(u, cross(v, w)))],
      ['원점과 평면 거리', Math.abs(p.d)],
    );
    if (un === 0 || vn === 0) {
      r.judgment = '방향 영벡터는 직선을 정의하지 않는다. 두 직선의 교차·거리 판정을 중단한다.';
      values.push(['두 직선 거리', '방향 영벡터 · 미정의']);
    } else if (uvn === 0) {
      const distance = norm(cross(q, unit(u)));
      values.push(['두 직선 거리', distance]);
      r.judgment =
        distance === 0 ? '두 직선은 같은 직선이다.' : '두 직선은 평행하며 겹치지 않는다.';
    } else {
      const signed = dot(q, unit(uv));
      values.push(['두 직선 거리', Math.abs(signed)]);
      r.judgment =
        Math.abs(signed) < 1e-12 * Math.max(1, norm(q))
          ? '교차 후보 · 수치 허용오차 안이다. 정확한 교차는 q·(u×v)=0 조건으로 판단한다.'
          : '두 직선은 꼬인 위치이다.';
    }
    values.push([
      'L₁과 z=d',
      un === 0
        ? '직선 미정의'
        : u[2] === 0
          ? p.d === 0
            ? '평면에 포함'
            : '평행 · 교차 없음'
          : `교차 t=${p.d / u[2]}`,
    ]);
  } else if (module === 'A4') {
    const { a, b, c, z0, kind } = p;
    let section: Vec3[] = [];
    if (kind === 0) {
      mesh(
        (theta, phi) => [
          a * Math.sin(phi) * Math.cos(theta),
          b * Math.sin(phi) * Math.sin(theta),
          c * Math.cos(phi),
        ],
        [0, 2 * Math.PI],
        [0, Math.PI],
      );
      const k = 1 - (z0 / c) ** 2;
      if (k >= 0)
        section = samples(
          (t) => [a * Math.sqrt(k) * Math.cos(t), b * Math.sqrt(k) * Math.sin(t), z0],
          0,
          2 * Math.PI,
        );
      r.judgment =
        k < 0
          ? '이 높이에서는 단면이 없다. 타원체 전체는 존재한다.'
          : '높이에 따른 타원 단면. 끝 높이의 단면은 한 점으로 퇴화한다.';
    }
    if (kind === 1 || kind === 2) {
      mesh((u, v) => [a * u, b * v, c * (u * u + (kind === 1 ? 1 : -1) * v * v)], [-2, 2], [-2, 2]);
      if (kind === 1 && z0 >= 0)
        section = samples(
          (t) => [a * Math.sqrt(z0 / c) * Math.cos(t), b * Math.sqrt(z0 / c) * Math.sin(t), z0],
          0,
          2 * Math.PI,
        );
      if (kind === 2) {
        if (z0 === 0) {
          section = [
            [-2 * a, -2 * b, 0],
            [0, 0, 0],
            [2 * a, 2 * b, 0],
          ];
          scene.lines.push({
            name: '단면의 두 번째 직선',
            points: [
              [-2 * a, 2 * b, 0],
              [2 * a, -2 * b, 0],
            ],
          });
        } else
          for (const sign of [-1, 1])
            scene.lines.push({
              name: `단면 ${sign > 0 ? '양' : '음'} 가지`,
              points: samples(
                (t) =>
                  z0 > 0
                    ? [sign * a * Math.sqrt(z0 / c + t * t), b * t, z0]
                    : [a * t, sign * b * Math.sqrt(-z0 / c + t * t), z0],
                -2,
                2,
              ),
            });
      }
      r.judgment =
        kind === 1
          ? z0 < 0
            ? '음의 높이의 단면은 없다.'
            : '단면은 타원이며 원점 높이에서는 한 점이다.'
          : '쌍곡포물면: 높이0의 단면은 두 직선, 비영 높이에서는 쌍곡선이다.';
    }
    if (kind === 3) {
      mesh(
        (theta, u) => [
          a * Math.cosh(u) * Math.cos(theta),
          b * Math.cosh(u) * Math.sin(theta),
          c * Math.sinh(u),
        ],
        [0, 2 * Math.PI],
        [-1.3, 1.3],
      );
      section = samples(
        (t) => [
          a * Math.sqrt(1 + (z0 / c) ** 2) * Math.cos(t),
          b * Math.sqrt(1 + (z0 / c) ** 2) * Math.sin(t),
          z0,
        ],
        0,
        2 * Math.PI,
      );
      r.judgment = '일엽쌍곡면의 모든 높이에 타원 단면이 존재한다.';
    }
    if (kind === 4) {
      mesh(
        (theta, u) => [
          a * Math.sinh(u) * Math.cos(theta),
          b * Math.sinh(u) * Math.sin(theta),
          c * Math.cosh(u),
        ],
        [0, 2 * Math.PI],
        [0, 1.3],
      );
      for (let j = 0; j <= 12; j++) {
        const u = (j / 12) * 1.3;
        scene.lines.push({
          name: j === 0 ? '아래쪽 엽' : '',
          role: 'grid',
          points: samples(
            (t) => [
              a * Math.sinh(u) * Math.cos(t),
              b * Math.sinh(u) * Math.sin(t),
              -c * Math.cosh(u),
            ],
            0,
            2 * Math.PI,
          ),
        });
      }
      const k = (z0 / c) ** 2 - 1;
      if (k >= 0)
        section = samples(
          (t) => [a * Math.sqrt(k) * Math.cos(t), b * Math.sqrt(k) * Math.sin(t), z0],
          0,
          2 * Math.PI,
        );
      r.judgment =
        k < 0
          ? '두 엽 사이 높이에는 단면이 없다. 두 엽 자체는 존재한다.'
          : '|z|≥c에서 타원 단면. |z|=c에서는 한 점.';
    }
    if (kind === 5) {
      mesh(
        (theta, u) => [a * u * Math.cos(theta), b * u * Math.sin(theta), c * u],
        [0, 2 * Math.PI],
        [-2, 2],
      );
      section = samples(
        (t) => [a * Math.abs(z0 / c) * Math.cos(t), b * Math.abs(z0 / c) * Math.sin(t), z0],
        0,
        2 * Math.PI,
      );
      r.judgment =
        z0 === 0
          ? '꼭짓점은 정칙 곡면점이 아니며 단면은 한 점이다.'
          : '타원뿔의 비영 높이 단면은 타원이다.';
    }
    if (section.length)
      scene.lines.push({ name: '현재 높이 단면', points: section, role: 'secondary' });
    values.push(['단면 높이', z0], ['축 길이 (a,b,c)', tuple([a, b, c])]);
  } else if (module === 'A5') {
    const L = p.kind === 0 ? 2 * Math.PI : 1,
      u = L * (p.reparam === 0 ? p.t : p.t * p.t),
      du = L * (p.reparam === 0 ? 1 : 2 * p.t),
      ddu = p.reparam === 0 ? 0 : 2 * L;
    const P: Vec3[] = [
      [0, 0, 0],
      [p.a, 0, p.h],
      [0, p.a, -p.h],
      [p.a, p.a, 0],
    ];
    const at = (v: number): Vec3 =>
      p.kind === 0
        ? [p.a * Math.cos(v), p.a * Math.sin(v), p.h * v]
        : add(
            add(scale(P[0], (1 - v) ** 3), scale(P[1], 3 * (1 - v) ** 2 * v)),
            add(scale(P[2], 3 * (1 - v) * v * v), scale(P[3], v ** 3)),
          );
    const velocity: Vec3 =
      p.kind === 0
        ? [-p.a * Math.sin(u), p.a * Math.cos(u), p.h]
        : add(
            add(scale(sub(P[1], P[0]), 3 * (1 - u) ** 2), scale(sub(P[2], P[1]), 6 * (1 - u) * u)),
            scale(sub(P[3], P[2]), 3 * u * u),
          );
    const acceleration: Vec3 =
      p.kind === 0
        ? [-p.a * Math.cos(u), -p.a * Math.sin(u), 0]
        : add(
            scale(add(sub(P[2], scale(P[1], 2)), P[0]), 6 * (1 - u)),
            scale(add(sub(P[3], scale(P[2], 2)), P[1]), 6 * u),
          );
    const position = at(u),
      v = scale(velocity, du),
      acc = add(scale(acceleration, du * du), scale(velocity, ddu)),
      basis =
        norm(v) > 0 && norm(v) < 1e-80
          ? {
              T: unit(v),
              N: undefined,
              B: undefined,
              curvature: undefined,
              reason:
                '속도가 비영이지만 곡률 나눗값이 수치 안정 범위를 벗어난다. N/B·곡률 판정을 중단하며 곡률0으로 결론 내리지 않는다.',
            }
          : frame(v, acc);
    scene.lines.push({ name: '공간곡선', points: samples(at, 0, L) });
    scene.point = position;
    if (p.kind === 1)
      scene.lines.push({ name: '베지에 제어 다각형', points: P, role: 'secondary' });
    if (basis.T) arrow(scene, 'T', position, basis.T);
    if (basis.N) arrow(scene, 'N', position, basis.N);
    if (basis.B) arrow(scene, 'B', position, basis.B);
    values.push(
      ['현재 위치', tuple(position)],
      ['속력', norm(v)],
      ['곡률', basis.curvature ?? '미정의'],
      ['원래 매개변수 u', u],
    );
    r.judgment =
      basis.reason ||
      '정칙한 현재점의 단위 T/N/B. 같은 곡선에서 매개화에 따른 속력과 불변 곡률을 구별한다.';
  } else if (module === 'B1') {
    const { m, t, kind } = p,
      den = Math.sqrt(1 + m * m),
      value =
        kind === 0
          ? t === 0
            ? 0
            : m / (1 + m * m)
          : kind === 1
            ? t === 0
              ? 0
              : (Math.abs(t) * m) / den
            : t * t * (1 + m * m),
      residual =
        t === 0
          ? 't>0의 극한 식을 읽는다'
          : kind === 0
            ? Math.abs(value) / (Math.abs(t) * den)
            : Math.abs(value) / (Math.abs(t) * den);
    series(
      '선택 경로',
      samples((s) => [s, m * s, 0], 0, 1),
    );
    series(
      '비교 경로 y=0',
      samples((s) => [s, 0, 0], 0, 1),
      true,
    );
    r.extent = 3;
    values.push(
      ['현재 경로의 함수값', value],
      ['원점 편미분', 'fₓ=fᵧ=0'],
      [
        '선형근사 상대 잔차',
        typeof residual === 'number' && !Number.isFinite(residual)
          ? '수치 표시 범위 초과 · 유한값 판정을 중단한다'
          : residual,
      ],
    );
    r.judgment =
      kind === 0
        ? '편미분은 존재하지만 연속이 아니다: y=0의 극한0, y=x의 극한1/2. 따라서 미분 가능하지 않다.'
        : kind === 1
          ? '연속이지만 미분 가능하지 않다: |xy|/√(x²+y²)≤√(x²+y²)/2. y=x에서 선형근사 잔차 비율은1/2.'
          : 'C¹인 다항식이다. 미분 가능하고 연속이며 원점 선형근사 잔차 비율은 원점으로 갈 때0이다.';
    r.steps =
      kind === 1
        ? [
            '편미분의 존재만으로 연속이나 미분 가능을 결론 내리지 않는다.',
            '연속 상계와 미분 가능 정의의 나눗값은 서로 다른 양이다.',
          ]
        : ['미분 가능 ⇒ 연속. 연속 ⇏ 미분 가능. 편미분 존재 ⇏ 연속.'];
    return r;
  } else if (module === 'B2') {
    const { x, y, z, kind } = p,
      point: Vec3 = kind === 0 ? [x, y, x * x + y * y] : [x, y, z],
      normal: Vec3 = kind === 0 ? [-2 * x, -2 * y, 1] : [2 * x, 2 * y, 2 * z];
    scene.point = point;
    if (kind === 0) mesh((u, v) => [u, v, u * u + v * v], [-2, 2], [-2, 2]);
    else {
      const radius = norm(point);
      mesh(
        (t, f) => [
          radius * Math.sin(f) * Math.cos(t),
          radius * Math.sin(f) * Math.sin(t),
          radius * Math.cos(f),
        ],
        [0, 2 * Math.PI],
        [0, Math.PI],
      );
    }
    if (norm(normal) !== 0) {
      const direction = unit(normal),
        axis: Vec3 = Math.abs(direction[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0],
        e1 = unit(cross(direction, axis)),
        e2 = cross(direction, e1);
      for (const k of [-1, 0, 1]) {
        segment(
          scene,
          k === 0 ? '접평면 기저선' : '',
          add(point, add(scale(e1, -1), scale(e2, k))),
          add(point, add(scale(e1, 1), scale(e2, k))),
          'secondary',
        );
        segment(
          scene,
          '',
          add(point, add(scale(e2, -1), scale(e1, k))),
          add(point, add(scale(e2, 1), scale(e1, k))),
          'secondary',
        );
      }
      arrow(scene, '법선', point, direction);
    }
    values.push(
      ['점', tuple(point)],
      ['법선', tuple(normal)],
      ['수준값', kind === 0 ? point[2] : dot(point, point)],
    );
    r.judgment =
      norm(normal) === 0
        ? 'gradient0인 특이점이다. 정칙 접평면 정리를 적용하지 않는다.'
        : '비영 법선과 그에 수직인 접평면. 같은 공간점에서 함께 표시한다.';
  } else if (module === 'B3') {
    const { a, b, c, x, y, theta, constraint } = p,
      coefficientScale = Math.max(Math.abs(a), Math.abs(b), Math.abs(c)),
      det = coefficientScale
        ? (a / coefficientScale) * (c / coefficientScale) - (b / coefficientScale) ** 2
        : 0,
      e0 = (a + c) / 2 - Math.hypot((a - c) / 2, b),
      e1 = (a + c) / 2 + Math.hypot((a - c) / 2, b),
      t = (theta * Math.PI) / 180,
      point: Vec3 =
        constraint === 0
          ? [x, y, a * x * x + 2 * b * x * y + c * y * y]
          : [
              Math.cos(t),
              Math.sin(t),
              a * Math.cos(t) ** 2 + 2 * b * Math.cos(t) * Math.sin(t) + c * Math.sin(t) ** 2,
            ];
    mesh((u, v) => [u, v, a * u * u + 2 * b * u * v + c * v * v], [-2, 2], [-2, 2]);
    scene.point = point;
    values.push(
      ['Hessian 행렬식 D', 4 * det * coefficientScale * coefficientScale],
      ['최소 고유값', 2 * e0],
      ['최대 고유값', 2 * e1],
    );
    if (constraint === 0) {
      values.push(['Newton 다음 점', det === 0 ? 'H 특이 · 역행렬 갱신 불가' : '(0, 0)']);
      r.judgment =
        det < 0
          ? '원점은 안장점이다. Newton의 정지점 도달은 극소 보장이 아니다.'
          : det > 0
            ? a > 0
              ? '원점은 엄격한 극소.'
              : '원점은 엄격한 극대.'
            : '일반 Hessian 판정은 불확정. 이 이차형은 반정부호일 수 있으며 영 방향을 원식으로 확인한다.';
    } else {
      scene.lines.push({
        name: '제약 곡선',
        points: samples(
          (s) => [
            Math.cos(s),
            Math.sin(s),
            a * Math.cos(s) ** 2 + 2 * b * Math.cos(s) * Math.sin(s) + c * Math.sin(s) ** 2,
          ],
          0,
          2 * Math.PI,
        ),
        role: 'secondary',
      });
      const deriv =
        2 * (c - a) * Math.sin(t) * Math.cos(t) + 2 * b * (Math.cos(t) ** 2 - Math.sin(t) ** 2);
      values.push(['제약 최솟값', e0], ['제약 최댓값', e1], ['현재점 접선 방향 미분', deriv]);
      r.judgment =
        'Lagrange 후보는 접선 방향 미분0을 요구한다. compact 단위원에서 최솟값·최댓값을 함께 비교한다. 전체 평면의 극값과 다르다.';
    }
  } else if (module === 'C1') {
    const { a, s, kind, order } = p;
    if (kind === 0) {
      series('삼각형 경계', [
        [0, 0, 0],
        [a, 0, 0],
        [0, a, 0],
        [0, 0, 0],
      ]);
      const at = a * Math.max(0, s);
      series(
        '현재 절단',
        order === 0
          ? [
              [at, 0, 0],
              [at, a - at, 0],
            ]
          : [
              [0, at, 0],
              [a - at, at, 0],
            ],
        true,
      );
      values.push(['정확 이중적분', (a * a * a) / 3], ['절단 좌표', at]);
      r.judgment =
        order === 0
          ? '고정 x에서 y는0부터 a−x. 바깥 x는0부터 a.'
          : '고정 y에서 x는0부터 a−y. 바깥 y는0부터 a.';
      r.extent = Math.max(1, a);
      return r;
    }
    mesh(
      (t, f) => [a * Math.sin(f) * Math.cos(t), a * Math.sin(f) * Math.sin(t), a * Math.cos(f)],
      [0, 2 * Math.PI],
      [0, Math.PI],
    );
    scene.lines.push({
      name: '현재 절단',
      points: circle(a * Math.sqrt(Math.max(0, 1 - s * s)), a * s),
      role: 'secondary',
    });
    values.push(
      ['구의 부피', (4 * Math.PI * a ** 3) / 3],
      ['절단 높이', a * s],
      ['단면 넓이', Math.PI * a * a * (1 - s * s)],
    );
    r.judgment =
      a === 0
        ? '퇴화 구의 부피0. 비퇴화 입체의 경계와 구별한다.'
        : '세 좌표의 적분 순서를 바꾸어도 같은 구 영역을 표현해야 한다. 곡선 경계를 상자 범위로 바꾸지 않는다.';
  } else if (module === 'C2') {
    r.judgment =
      '독립·균등은 확률 모형의 전제이다. 유한 LCG 표본의 오차 관찰은 그 전제를 입증하지 않는다.';
    r.steps = [
      'N=1이면 표본분산 기반 표준오차 미정의.',
      '표본 수가 커져도 오차가 매 단계 단조 감소한다는 보장은 없다.',
      '정확 적분과 계산 오차의 비교는 통계적 신뢰수준을 자동 부여하지 않는다.',
    ];
    return r;
  } else if (module === 'C3' || module === 'D5') {
    const { kind, r: radius, theta, phi, z } = p,
      t = (theta * Math.PI) / 180,
      f = (phi * Math.PI) / 180,
      ct = Math.cos(t),
      st = Math.sin(t),
      sf = phi === 0 || phi === 180 ? 0 : Math.sin(f),
      cf = phi === 90 ? 0 : Math.cos(f),
      point: Vec3 =
        kind === 2
          ? [radius * sf * ct, radius * sf * st, radius * cf]
          : [radius * ct, radius * st, kind === 0 ? 0 : z],
      er: Vec3 = kind === 2 ? [sf * ct, sf * st, cf] : [ct, st, 0],
      et: Vec3 = [-st, ct, 0],
      ef: Vec3 = [cf * ct, cf * st, -sf];
    scene.point = point;
    segment(scene, '같은 점', origin, point);
    const regular =
      (kind === 0 && module === 'D5') || (radius > 0 && (kind !== 2 || (phi > 0 && phi < 180)));
    if (module === 'C3') {
      arrow(scene, kind === 2 ? 'eρ' : 'er', point, er);
      arrow(scene, 'eθ', point, et);
      if (kind === 1) arrow(scene, 'ez', point, [0, 0, 1]);
      if (kind === 2) arrow(scene, 'eφ', point, ef);
      values.push(
        ['직교좌표', tuple(point)],
        ['야코비안 절댓값', kind === 2 ? radius * radius * sf : radius],
        [
          '길이 배율',
          kind === 2
            ? tuple([1, radius * sf, radius])
            : kind === 1
              ? tuple([1, radius, 1])
              : `(1, ${radius})`,
        ],
      );
      r.judgment = regular
        ? '현재 비영 배율의 정칙 좌표점이다. 화살표는 단위기저이며 미소 길이 배율은 별도의 양이다.'
        : '좌표 특이점이다. 현재 각도 선택의 형식적 기저를 공간점의 유일한 방향으로 간주하지 않는다.';
    } else {
      const F = point,
        grad = scale(point, 2);
      arrow(scene, '∇f', point, grad);
      values.push(
        ['f', dot(point, point)],
        ['직교 ∇f', tuple(grad)],
        ['div F', 3],
        ['curl F', '(0, 0, 0)'],
        ['Δf', 6],
      );
      if (regular) {
        const components: Vec3 = kind === 0 ? F : kind === 1 ? [radius, 0, z] : [radius, 0, 0];
        values.push(
          ['현재 기저의 F 성분', tuple(components)],
          ['현재 기저의 ∇f 성분', tuple(scale(components, 2))],
        );
        r.judgment =
          '같은 장의 성분과 기저를 함께 변환했다. 세 좌표계의4개 연산 결과는 같은 공간 대상이다.';
      } else {
        values.push(['좌표식 직접 대입', '축/극에서 중단']);
        r.judgment =
          '원통/구면 좌표식의 분모0이므로 직접 대입을 중단한다. 매끄러운 원래 장의 직교 연산 결과는 유지한다.';
      }
    }
  } else if (module === 'C4') {
    const { k, l, a, b, kind } = p,
      M = (1 + k / 2) * (1 + l / 2),
      cx = (0.5 + k / 3) / (1 + k / 2),
      cy = (0.5 + l / 3) / (1 + l / 2),
      prob = ((a + (k * a * a) / 2) * (b + (l * b * b) / 2)) / M;
    mesh((x, y) => [x, y, kind === 0 ? (1 + k * x) * (1 + l * y) : 1], [0, 1], [0, 1]);
    scene.lines.push({
      name: '사건 경계',
      points: [
        [0, 0, 0],
        [a, 0, 0],
        [a, b, 0],
        [0, b, 0],
        [0, 0, 0],
      ],
      role: 'secondary',
    });
    scene.point = [cx, cy, kind === 0 ? 0 : 0.5];
    if (kind === 1)
      for (const z of [0, 1])
        scene.lines.push({
          name: z === 0 ? '정육면체 경계' : '',
          points: [
            [0, 0, z],
            [1, 0, z],
            [1, 1, z],
            [0, 1, z],
            [0, 0, z],
          ],
          role: 'secondary',
        });
    values.push(
      ['질량 M', M],
      ['질량중심', tuple([cx, cy, kind === 0 ? 0 : 0.5])],
      ['사건 확률', prob],
      ['사건 질량', prob * M],
      ['현재 (a,b)의 밀도 δ', (1 + k * a) * (1 + l * b)],
      ['주변 pₓ(a)', (1 + k * a) / (1 + k / 2)],
      ['주변 pᵧ(b)', (1 + l * b) / (1 + l / 2)],
    );
    r.judgment =
      '밀도는 영역에서 비음수이고 M>0. 같은 가중 적분을 질량과 정규화한 확률로 구별한다. 평면 모형의 색·수치는 면밀도이며 공간의 높이가 아니다. 입체 모형의 밀도는 z에 의존하지 않는다.';
  } else if (module === 'D1') {
    const { a, path, field } = p;
    const points: Vec3[] =
      path === 0
        ? [
            [0, 0, 0],
            [a, a, 0],
          ]
        : path === 1
          ? samples((t) => [a * t, a * t * t, 0])
          : [
              [0, 0, 0],
              [a, 0, 0],
              [a, a, 0],
            ];
    series('현재 경로', points);
    const scalar =
        path === 0
          ? a * Math.SQRT2
          : path === 1
            ? a * (Math.sqrt(5) / 2 + Math.asinh(2) / 4)
            : 2 * a,
      integral = field === 0 ? 2 * a * a : path === 0 ? 0 : path === 1 ? (a * a) / 6 : (a * a) / 2;
    values.push(
      ['벡터 선적분', integral],
      ['퍼텐셜 차이', field === 0 ? 2 * a * a : '이 장은 비보존장'],
      ['밀도1 스칼라 선적분', scalar],
    );
    r.judgment =
      field === 0
        ? '벡터 선적분은 경로와 무관하게2a². 스칼라 선적분인 길이는 경로에 의존한다.'
        : '회전장: 같은 끝점이라도 선택한 경로의 선적분이 다르다. 퍼텐셜 차이로 치환하지 않는다.';
    r.extent = Math.max(a, 1);
    return r;
  } else if (module === 'D2') {
    const { inner: a, outer: b, field, sign } = p;
    series(
      '바깥 경계',
      samples((t) => [b * Math.cos(t), b * Math.sin(t), 0], 0, sign * 2 * Math.PI),
    );
    series(
      '안쪽 경계',
      samples((t) => [a * Math.cos(t), a * Math.sin(t), 0], 0, -sign * 2 * Math.PI),
      true,
    );
    r.traces.forEach((t) => (t.arrow = true));
    r.extent = Math.max(b, 1);
    const valid = a < b && b > 0 && (field === 1 || a > 0),
      outer = b > 0 ? sign * (field === 0 ? 2 * Math.PI : Math.PI * b * b) : '퇴화 경계',
      inner =
        a > 0
          ? -sign * (field === 0 ? 2 * Math.PI : Math.PI * a * a)
          : field === 1
            ? 0
            : '원점 특이점';
    values.push(
      ['바깥 순환', outer],
      ['안쪽 순환', inner],
      [
        '경계 합',
        typeof outer === 'number' && typeof inner === 'number' ? outer + inner : '조건 미충족',
      ],
      [
        '그린 내부적분',
        valid ? (field === 0 ? 0 : sign * Math.PI * (b * b - a * a)) : '정리 적용 불가',
      ],
    );
    r.judgment = valid
      ? field === 0
        ? '원점을 제외한 환형 영역에서 양쪽 순환이 상쇄된다. 외부/내부 경계를 함께 포함한 그린 정리가 적용된다.'
        : '회전1의 영역 적분은 방향을 포함한 환형 넓이와 같다.'
      : '안쪽<바깥의 영역 조건과 특이점 제외 조건을 확인해야 한다. 입력을 바꾸어 적용 불가를 정리의 거짓으로 처리하지 않는다.';
    r.steps = [
      `바깥 경계: ${sign === 1 ? '반시계' : '시계'}`,
      `안쪽 경계: ${sign === 1 ? '시계' : '반시계'}`,
    ];
    return r;
  } else if (module === 'D3') {
    const { h, u, v, sign } = p,
      point: Vec3 = [u, v, h * (u * u + v * v)],
      ru: Vec3 = [1, 0, 2 * h * u],
      rv: Vec3 = [0, 1, 2 * h * v],
      normal = scale(cross(ru, rv), sign);
    mesh((x, y) => [x, y, h * (x * x + y * y)], [-1, 1], [-1, 1]);
    scene.point = point;
    arrow(scene, 'rᵤ', point, ru);
    arrow(scene, 'rᵥ', point, rv);
    arrow(scene, '방향 법선', point, scale(normal, 1 / norm(normal)));
    const area = (n: number) => {
      let sum = 0;
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
          const x = -1 + ((i + 0.5) * 2) / n,
            y = -1 + ((j + 0.5) * 2) / n;
          sum += (Math.sqrt(1 + 4 * h * h * (x * x + y * y)) * 4) / (n * n);
        }
      return sum;
    };
    const a = area(24),
      b = area(48);
    values.push(
      ['면적 배율', norm(normal)],
      ['유향 넓이벡터', tuple(normal)],
      ['정확 플럭스', 4 * sign],
      ['면적 중점합 (48²)', b],
      ['분할24→48의 차이', Math.abs(b - a)],
    );
    r.judgment =
      '접벡터의 외적은 항상 비영이다. 단위법선과 넓이 배율을 함께 사용하면 F·(rᵤ×rᵥ)=±1. 분할 차이는 엄밀한 오차 상계가 아니다.';
  } else if (module === 'D4') {
    const { r: radius, h, sign } = p;
    if (radius > 0) {
      mesh(
        (t, s) => [radius * s * Math.cos(t), radius * s * Math.sin(t), h * (1 - s * s)],
        [0, 2 * Math.PI],
        [0, 1],
      );
      scene.lines.push({
        name: sign === 1 ? '공통 경계 · 반시계' : '공통 경계 · 시계',
        points: sign === 1 ? circle(radius) : circle(radius).reverse(),
        role: 'secondary',
      });
      arrow(scene, '선택한 곡면 법선', [0, 0, h], [0, 0, sign]);
      arrow(scene, '원판 법선', [0, 0, 0], [0, 0, sign]);
      for (const q of [0, 0.25, 0.5, 0.75, 1])
        scene.lines.push({
          name: q === 0 ? '평평한 원판' : '',
          points: circle(radius * q),
          role: 'grid',
        });
    }
    values.push(
      ['공통 경계 순환', sign * Math.PI * radius * radius],
      ['평평한 원판 curl 플럭스', sign * Math.PI * radius * radius],
      ['굽은 곡면 curl 플럭스', sign * Math.PI * radius * radius],
    );
    r.judgment =
      radius === 0
        ? '반지름0에서는 두 정칙 곡면을 만들지 않는다. 표시0은 극한값이며 정리의 적용 증거가 아니다.'
        : '양의 법선/경계 방향이 호환되고 장이 두 곡면 근방에서 C¹이므로 같은 경계 순환과 두 curl 플럭스가 같다.';
  }
  r.spatial = scene;
  return r;
}
