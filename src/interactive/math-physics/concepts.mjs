import { physicsConcepts } from './physics.mjs';
// One content record chooses a frame and components; no executable code in records.
export const concepts = {
  ...physicsConcepts,
  taylor: {
    id: 'taylor-exp', name: '테일러 전개', english: 'Taylor expansion',
    question: '항을 더하면, 어디에서 얼마나 정확해질까?',
    engine: 'exp-taylor', frames: ['explore', 'derive'],
    components: ['formula', 'curve-comparison', 'error-bound', 'derivation'],
    design: { roles: { formula: '유한 근사의 정의', 'curve-comparison': '두 함수의 차이', 'error-bound': '관찰 오차와 이론 상계 구별', derivation: '계수가 정해지는 이유' }, correspondence: '선택 x와 근사 차수 N을 수식·두 곡선·오차에 함께 적용', sequence: '대상 → 계수 → 항의 누적 → 정확도', initialReason: 'N=3과 x=1에서 원함수와 근사의 차이를 함께 볼 수 있음' },
    domain: '실수 $x$, 중심점 $a=0$, 차수 $N=0\\ldots8$. 이 예제는 지수함수에 한정합니다.',
    controls: [
      { key: 'n', label: '근사 차수 N', labelRich: String.raw`근사 차수 $N$`, min: 0, max: 8, step: 1 },
      { key: 'x', label: '관찰 위치 x', labelRich: String.raw`관찰 위치 $x$`, min: -3, max: 3, step: 0.1 },
    ],
    steps: ['무엇을 근사하는가?', '계수는 어디에서 오는가?', '항을 어떻게 더하는가?', '어느 정도 정확한가?'],
    source: { title: 'OpenStax · Taylor and Maclaurin Series', url: 'https://openstax.org/books/calculus-volume-2/pages/6-3-taylor-and-maclaurin-series', kind: 'public-reference', textbookPage: null },
  },
  matrix: {
    id: 'diagonal-transformation', name: '선형변환', english: 'Linear transformation',
    question: '행렬의 성분이 공간의 모양을 어떻게 바꿀까?',
    engine: 'diagonal-map', frames: ['explore', 'derive'],
    components: ['formula', 'matrix', 'plane-transformation', 'derivation'],
    design: { roles: { formula: '벡터의 대응', matrix: '대응의 성분', 'plane-transformation': '기저와 도형의 상', derivation: '선형결합에서 일반 벡터로 확장' }, correspondence: 'a,b를 행렬·기저벡터의 상·단위원의 상·행렬식에 함께 적용', sequence: '대응 → 기저 → 일반 벡터 → 넓이와 방향', initialReason: '서로 다른 양의 배율로 원과 타원의 관계를 관찰' },
    domain: '실수 평면의 대각행렬 $A=\\operatorname{diag}(a,b)$. 일반 행렬 전체의 사례는 아닙니다.',
    controls: [
      { key: 'a', label: '가로 방향 배율 a', labelRich: String.raw`가로 방향 배율 $a$`, min: -2, max: 2, step: 0.1 },
      { key: 'b', label: '세로 방향 배율 b', labelRich: String.raw`세로 방향 배율 $b$`, min: -2, max: 2, step: 0.1 },
    ],
    steps: ['어떤 대응인가?', '기저벡터는 어디로 가는가?', '일반 벡터는 어떻게 옮겨지는가?', '넓이와 방향은 어떻게 되는가?'],
    source: { title: 'MIT OpenCourseWare · Linear transformations', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-30-linear-transformations-and-their-matrices/', kind: 'public-reference', textbookPage: null },
  },
  series: {
    id: 'p-series', name: '적분판정법', english: 'Integral test',
    question: '이 급수에 정리를 적용해도 될까?',
    engine: 'p-series', frames: ['reason'],
    components: ['formula', 'condition-flow', 'area-comparison', 'derivation'],
    design: { roles: { formula: '원래 급수와 현재 대상', 'condition-flow': '정리 적용 조건과 보류', 'area-comparison': '유한 구간에서의 비교 관계', derivation: '유한 적분과 이상적분의 극한 구별' }, correspondence: 'p와 부호를 급수·조건·그림·해석적 결론에 함께 적용', sequence: '대상 → 양항 → 연속 → 감소 → 이상적분 → 원래 결론', initialReason: 'p=2에서 조건을 확인하고, p=1로 바꾸어 경계를 비교 가능' },
    domain: '$p=0.5\\ldots3$, $n\\ge1$. 수렴·발산은 원래 급수의 부호 조건과 구분합니다.',
    controls: [{ key: 'p', label: '지수 p', labelRich: String.raw`지수 $p$`, min: 0.5, max: 3, step: 0.1 }],
    steps: ['원래 대상을 확인한다', '양항급수인가?', '연속인가?', '감소하는가?', '이상적분은 수렴하는가?', '원래 급수로 돌아간다'],
    source: { title: 'OpenStax · The Divergence and Integral Tests', url: 'https://openstax.org/books/calculus-volume-2/pages/5-3-the-divergence-and-integral-tests', kind: 'public-reference', textbookPage: null },
  },
};
