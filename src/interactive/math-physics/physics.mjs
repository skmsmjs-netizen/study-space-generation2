// Declarative physical quantities and model assumptions; no executable content.
export const physicsConcepts = {
  motion: {
    id: 'constant-acceleration', subject: 'physics', name: '등가속도 운동', english: 'Motion with constant acceleration',
    question: '가속도를 바꾸면 위치와 속도는 어떻게 이어질까?', engine: 'constant-acceleration', frames: ['explore', 'derive'],
    components: ['formula', 'physical-scene', 'quantity-graph', 'derivation'],
    domain: '관성계의 일차원 질점 운동. 가속도는 시간에 따라 일정합니다. $t=0\\ldots8\\,\\mathrm{s}$이며 충돌·저항·상대론 효과는 이 모델에 포함하지 않습니다.',
    physics: {
      system: '질점으로 취급하는 물체 하나. 힘을 계산하는 모델이 아니라 일정한 가속도가 주어진 운동학 모델입니다.',
      coordinates: '고정된 관성 기준계, 오른쪽이 $+x$, $t=0$을 시작 시각으로 둡니다.',
      assumptions: ['질점', '일차원 운동', '일정한 가속도', '비상대론적 속도'],
      laws: [{ name: '가속도의 정의', tex: String.raw`a=\frac{dv}{dt}` }, { name: '속도의 정의', tex: String.raw`v=\frac{dx}{dt}` }],
      quantities: [
        { symbol: 'x', name: '위치', unit: 'm', dimension: 'L' },
        { symbol: 'v', name: '속도', unit: 'm/s', dimension: 'L T^-1' },
        { symbol: 'a', name: '가속도', unit: 'm/s²', dimension: 'L T^-2' },
        { symbol: 't', name: '시간', unit: 's', dimension: 'T' },
      ],
    },
    design: { roles: { formula: '정의와 운동식', 'physical-scene': '실제 공간에서의 위치와 방향', 'quantity-graph': '시간에 따른 양의 변화', derivation: '가정에서 적분과 단위 확인으로 연결' }, correspondence: '같은 t를 물체의 위치·선택 그래프의 점·x/v/a 결과에 연결. 서로 다른 단위의 양은 세로축을 공유하지 않음', sequence: '계와 축 → 일정한 가속도 → 속도 → 위치와 검산', initialReason: 'x0=0, v0=2, a=1, t=2에서 위치·속도 변화가 함께 드러남' },
    controls: [
      { key: 'x0', label: '초기 위치 x₀ (m)', labelRich: String.raw`초기 위치 $x_0$ $(\mathrm{m})$`, min: -5, max: 5, step: 0.1 },
      { key: 'v0', label: '초기 속도 v₀ (m/s)', labelRich: String.raw`초기 속도 $v_0$ $(\mathrm{m/s})$`, min: -5, max: 5, step: 0.1 },
      { key: 'a', label: '가속도 a (m/s²)', labelRich: String.raw`가속도 $a$ $(\mathrm{m/s^2})$`, min: -3, max: 3, step: 0.1 },
      { key: 't', label: '관찰 시각 t (s)', labelRich: String.raw`관찰 시각 $t$ $(\mathrm{s})$`, min: 0, max: 8, step: 0.1 },
    ],
    steps: ['무엇을 어느 축에서 보는가?', '어떤 가정으로 식을 고르는가?', '속도는 어떻게 얻는가?', '위치와 단위·부호를 확인한다'],
    source: { title: 'OpenStax · Motion with Constant Acceleration', url: 'https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration', kind: 'public-reference', textbookPage: null },
  },
  energy: {
    id: 'spring-mechanical-energy', subject: 'physics', name: '역학적 에너지 보존', english: 'Conservation of mechanical energy',
    question: '이 계에서 운동에너지와 위치에너지의 합을 일정하게 두어도 될까?', engine: 'spring-energy', frames: ['reason', 'explore'],
    components: ['formula', 'physical-scene', 'quantity-graph', 'condition-flow', 'derivation'],
    domain: '수평면의 질점과 이상적인 용수철. 진폭 $A$에서 정지해 출발합니다. $x=rA$, $-1\\le r\\le1$. 마찰이 일을 하거나 그 조건을 모르면 보존식으로 속력을 확정하지 않습니다.',
    physics: {
      system: '물체 + 용수철. 고정 벽은 움직이지 않습니다. 중력과 수직항력은 수평 운동에서 일을 하지 않습니다.',
      coordinates: '관성 기준계, 평형 위치 $x=0$, 오른쪽이 $+x$. 위치에너지의 기준은 $U(0)=0$입니다.',
      assumptions: ['질점', '이상적인 선형 용수철', '고정된 벽', '수평 운동', '보존 결론에는 비보존력의 일이 0'],
      laws: [{ name: '후크 법칙', tex: String.raw`F_s=-kx` }, { name: '용수철 위치에너지', tex: String.raw`U=\frac12kx^2` }, { name: '운동에너지', tex: String.raw`K=\frac12mv^2` }, { name: '비보존력의 일을 포함한 관계', tex: String.raw`\Delta(K+U)=W_{\mathrm{nc}}` }],
      quantities: [
        { symbol: 'm', name: '질량', unit: 'kg', dimension: 'M' },
        { symbol: 'k', name: '용수철 상수', unit: 'N/m', dimension: 'M T^-2' },
        { symbol: 'A, x', name: '진폭과 변위', unit: 'm', dimension: 'L' },
        { symbol: 'K, U, E', name: '에너지', unit: 'J', dimension: 'M L^2 T^-2' },
        { symbol: '|v|', name: '속력', unit: 'm/s', dimension: 'L T^-1' },
        { symbol: 'r', name: '변위 비율', unit: '1', dimension: '1' },
      ],
    },
    design: { roles: { formula: '에너지 관계와 조건', 'physical-scene': '계·평형 위치·물체의 변위', 'quantity-graph': '같은 x에서의 에너지 대응', 'condition-flow': '마찰의 일 없음/있음/미확인 분리', derivation: '계 선택에서 속력과 검산까지' }, correspondence: '같은 x=rA를 물체·U 그래프의 점·K/U 수치에 적용. 보존 가정 불충족 때 E와 K·속력 결론을 숨김', sequence: '목표 → 계와 힘 → 비보존력의 일 → 법칙 → 속력 → 검산', initialReason: 'm=1, k=4, A=1, r=0.5에서 K와 U가 모두 양수이며 경계 r=±1과 비교 가능' },
    controls: [
      { key: 'm', label: '질량 m (kg)', labelRich: String.raw`질량 $m$ $(\mathrm{kg})$`, min: 0.1, max: 5, step: 0.1 },
      { key: 'k', label: '용수철 상수 k (N/m)', labelRich: String.raw`용수철 상수 $k$ $(\mathrm{N/m})$`, min: 0.5, max: 10, step: 0.1 },
      { key: 'amplitude', label: '진폭 A (m)', labelRich: String.raw`진폭 $A$ $(\mathrm{m})$`, min: 0.1, max: 2, step: 0.1 },
      { key: 'r', label: '변위 비율 r=x/A', labelRich: String.raw`변위 비율 $r=x/A$`, min: -1, max: 1, step: 0.1 },
    ],
    steps: ['무엇을 구하려는가?', '계와 힘을 정한다', '비보존력이 일을 하는가?', '어떤 에너지 식을 쓰는가?', '현재 위치의 속력을 구한다', '단위·경계·원래 질문을 확인한다'],
    source: { title: 'OpenStax · Conservation of Energy', url: 'https://openstax.org/books/university-physics-volume-1/pages/8-3-conservation-of-energy', kind: 'public-reference', textbookPage: null },
  },
};
