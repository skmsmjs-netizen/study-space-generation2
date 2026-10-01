/** Worked examples, not an arbitrary-expression solver or a mastery model. */
export const EXAMPLE_IDS = ['log-square', 'log', 'alternating', 'eventual', 'geometric'] as const;
export type SeriesExampleId = (typeof EXAMPLE_IDS)[number];
export const STEP_IDS = ['goal', 'term', 'method', 'function', 'positive', 'continuous', 'decreasing', 'integral', 'conclusion'] as const;
export type ReasoningStepId = (typeof STEP_IDS)[number];
export type ReasoningMethod = 'integral' | 'ratio' | 'alternating' | 'geometric';
export type ReadingPosition = {
  step: ReasoningStepId; method: ReasoningMethod; absolute: boolean;
  tail: boolean; pending: ReasoningStepId | null; brief: boolean;
};
export const DEFAULT_READING: ReadingPosition = {
  step: 'goal', method: 'integral', absolute: false, tail: false, pending: null, brief: false,
};
export type ReasoningStep = {
  id: ReasoningStepId; title: string; english: string; question: string;
  reason: string; evidence: string[]; outcome: string; state: 'ready' | 'stop' | 'unknown';
};
export const SERIES_EXAMPLES: Record<SeriesExampleId, { title: string; tex: string }> = {
  'log-square': { title: '로그가 제곱인 급수', tex: '\\sum_{n=2}^{\\infty}\\frac{1}{n(\\ln n)^2}' },
  log: { title: '로그가 한 번인 급수', tex: '\\sum_{n=2}^{\\infty}\\frac{1}{n\\ln n}' },
  alternating: { title: '부호가 번갈아 바뀌는 급수', tex: '\\sum_{n=2}^{\\infty}\\frac{(-1)^n}{n(\\ln n)^2}' },
  eventual: { title: '처음에는 증가하는 급수', tex: '\\sum_{n=2}^{\\infty}\\frac{\\ln n}{n}' },
  geometric: { title: '익숙한 등비급수', tex: '\\sum_{n=1}^{\\infty}\\left(\\frac12\\right)^n' },
};
export function canReachStep(id: SeriesExampleId, reading: ReadingPosition, target: ReasoningStepId) {
  const index = STEP_IDS.indexOf(target);
  if (reading.pending && index > STEP_IDS.indexOf(reading.pending)) return false;
  if (reading.method !== 'integral' && index > STEP_IDS.indexOf('method')) return false;
  if (id === 'alternating' && !reading.absolute && index > STEP_IDS.indexOf('positive')) return false;
  if (id === 'eventual' && !reading.tail && index > STEP_IDS.indexOf('decreasing')) return false;
  return true;
}
export function reasoningSteps(id: SeriesExampleId, reading: ReadingPosition): ReasoningStep[] {
  const squared = id === 'log-square' || id === 'alternating';
  const lower = id === 'eventual' && reading.tail ? 3 : id === 'geometric' ? 1 : 2;
  const f = id === 'geometric' ? '2^{-x}' : id === 'eventual' ? '\\frac{\\ln x}{x}' :
    squared ? '\\frac{1}{x(\\ln x)^2}' : '\\frac{1}{x\\ln x}';
  const signed = id === 'alternating' && !reading.absolute;
  const derivative = id === 'geometric' ? "f'(x)=-(\\ln 2)\\,2^{-x}<0" :
    id === 'eventual' ? "f'(x)=\\frac{1-\\ln x}{x^2}" :
    squared ? "f'(x)=-\\frac{\\ln x+2}{x^2(\\ln x)^3}<0" :
    "f'(x)=-\\frac{\\ln x+1}{x^2(\\ln x)^2}<0";
  let methodReason = '로그와 역수가 함께 나타난다. 실수의 함수로 옮기면 로그 치환으로 적분할 수 있다. 그래서 적분판정법을 후보로 잡는다.';
  let methodEvidence = ['u=\\ln x,\\qquad du=\\frac{dx}{x}'];
  let methodOutcome = '계산하기 쉬운 후보를 골랐다. 이제 이 정리를 써도 되는지 확인한다.';
  let methodState: ReasoningStep['state'] = 'ready';
  if (id === 'alternating') methodReason = '교대급수판정법도 후보이다. 절댓값 급수에 적분판정법을 적용하면 절대수렴까지 확인할 수 있다. 원래 급수에 직접 적용할 수 있는지는 부호를 먼저 살핀다.';
  if (id === 'eventual') methodReason += ' 처음부터 감소하는지는 별도로 확인해야 한다.';
  if (id === 'geometric') {
    methodReason = '일정한 비율로 바뀌는 항이다. 등비급수 공식으로 바로 판단할 수 있다. 적분판정법도 쓸 수 있지만 조건 확인과 적분이 더 필요하다.';
    methodEvidence = ['r=\\frac12,\\qquad |r|<1'];
  }
  if (reading.method === 'ratio') {
    methodReason = '비율판정법은 이웃한 항의 절댓값 비율을 본다. 극한이 1이면 이 판정법으로 결론을 내리지 못한다.';
    methodEvidence = ['\\lim_{n\\to\\infty}\\left|\\frac{a_{n+1}}{a_n}\\right|=' + (id === 'geometric' ? '\\frac12<1' : '1')];
    methodOutcome = id === 'geometric' ? '비율판정법으로 수렴한다. 추가로 적분할 필요가 없다.' : '판정 불가이다. 발산이라는 뜻이 아니다. 다른 후보로 돌아간다.';
    methodState = id === 'geometric' ? 'ready' : 'unknown';
  }
  if (reading.method === 'alternating') {
    methodReason = id === 'alternating' ? '절댓값인 항이 감소하고 0으로 가므로 교대급수판정법으로 수렴을 보인다. 이 방법만으로 절대수렴까지 결정하지는 않는다.' : '이 예제는 부호가 번갈아 바뀌지 않는다. 교대급수판정법의 대상이 아니다.';
    methodEvidence = id === 'alternating' ? ['b_n=\\frac1{n(\\ln n)^2}\\downarrow0'] : [];
    methodOutcome = id === 'alternating' ? '원래 급수는 수렴한다. 절대수렴을 더 알아보려면 절댓값 급수를 확인한다.' : '다른 판정법 후보로 돌아간다.';
    methodState = id === 'alternating' ? 'ready' : 'stop';
  }
  if (reading.method === 'geometric') {
    methodReason = id === 'geometric' ? '공비의 절댓값이 1보다 작으므로 등비급수는 수렴한다. 이 경우 합도 직접 구할 수 있다.' : '이 급수는 일정한 공비를 가진 등비급수가 아니다. 모양이 닮았다는 이유로 공식을 적용할 수 없다.';
    methodEvidence = id === 'geometric' ? ['\\sum_{n=1}^\\infty(\\tfrac12)^n=\\frac{1/2}{1-1/2}=1'] : [];
    methodOutcome = id === 'geometric' ? '수렴과 합을 확인했다. 필요하면 적분판정법의 결론과 비교한다.' : '다른 판정법 후보로 돌아간다.';
    methodState = id === 'geometric' ? 'ready' : 'stop';
  }
  const steps: ReasoningStep[] = [
    { id: 'goal', title: '무엇을 판단하려는가?', english: 'Convergence', question: '무한히 더해도 유한한 값에 가까워지는가?',
      reason: '구하려는 것은 먼저 수렴 여부이다. 합의 정확한 값은 별도의 질문이다.',
      evidence: ['S_m=\\sum_{n=' + (id === 'geometric' ? 1 : 2) + '}^m a_n', '\\lim_{m\\to\\infty}S_m\\in\\mathbb R\\;?'],
      outcome: '수렴을 보일 도구를 찾되, 수렴 여부와 합을 구별한다.', state: 'ready' },
    { id: 'term', title: '항이 0으로 가는가?', english: 'Divergence test', question: '수렴하려면 반드시 필요한 조건부터 확인할 수 있는가?',
      reason: '항이 0으로 가지 않으면 급수는 발산한다. 0으로 가는 경우에는 아직 수렴을 알 수 없으므로 다른 판정법이 필요하다.',
      evidence: ['\\lim_{n\\to\\infty}a_n=0', 'a_n\\to0\\;\\not\\Rightarrow\\;\\sum a_n\\text{ converges}'],
      outcome: '이 예제의 항은 0으로 간다. 필요한 조건은 통과했지만 충분한 근거는 아직 없다.', state: 'ready' },
    { id: 'method', title: '어떤 판정법이 맞을까?', english: 'Choosing a convergence test',
      question: '이 항의 구조를 어느 정리가 다루기 쉬운가?', reason: methodReason, evidence: methodEvidence, outcome: methodOutcome, state: methodState },
    { id: 'function', title: '항을 함수로 옮긴다', english: 'Continuous extension', question: '정수에서 원래 항과 일치하는 함수를 만들 수 있는가?',
      reason: signed ? '정수에서 일치하는 함수는 만들 수 있다. 하지만 그것만으로 적분판정법의 조건을 충족하지는 않는다.' : '정수인 자리를 실수로 넓힌다. 같은 항을 갖는다는 조건과 그 구간에서 양수·연속·감소한다는 조건을 함께 확인한다.',
      evidence: ['f(x)=' + (signed ? '\\frac{\\cos(\\pi x)}{x(\\ln x)^2}' : f), 'f(n)=' + (reading.absolute ? '|a_n|' : 'a_n')],
      outcome: reading.absolute ? '현재 대상은 절댓값 급수이다. 원래 급수와 구별해 둔다.' : '원래 급수의 항과 함수를 연결했다.', state: 'ready' },
    { id: 'positive', title: '양항급수인가?', english: 'Positive-term series', question: '이 구간에서 함수와 각 항이 양수인가?',
      reason: '양수인 항을 직사각형의 넓이에 대응시키기 위해 필요하다. 부호가 바뀌면 원래 급수에 이 정리를 바로 적용할 수 없다.',
      evidence: signed ? ['a_{2k}>0,\\qquad a_{2k+1}<0'] : ['f(x)>0\\qquad(x\\ge ' + lower + ')'],
      outcome: signed ? '직접 적용할 수 없다. 발산이라고 결론 내리지 말고 절댓값 급수나 교대급수판정법을 살핀다.' : '양수 조건을 확인했다. 연속성을 확인한다.', state: signed ? 'stop' : 'ready' },
    { id: 'continuous', title: '연속인가?', english: 'Continuity', question: '정수 사이에서도 끊기거나 정의되지 않는 곳이 없는가?',
      reason: '항 사이의 넓이와 급수를 비교하려면 선택한 뒷부분 전체에서 함수가 연속이어야 한다. 그래프의 몇 점만 보는 것으로 확인하지 않는다.',
      evidence: id === 'geometric' ? ['f(x)=2^{-x}\\text{ is continuous on }[1,\\infty)'] :
        ['\\ln x>0\\quad(x\\ge ' + lower + '),\\qquad x\\ne0', 'f\\text{ is continuous on }[' + lower + ',\\infty)'],
      outcome: id === 'geometric' ? '지수함수의 연속성을 확인했다.' : '로그가 정의되고 분모가 0이 되지 않는다. 연속함수의 곱·몫으로 연속성을 확인했다.', state: 'ready' },
    { id: 'decreasing', title: '감소하는가?', english: 'Monotonic decrease', question: '이 구간 전체에서 뒤로 갈수록 함수값이 작아지는가?',
      reason: '함수 아래 넓이를 좌우 직사각형 합 사이에 놓기 위해 필요하다. 처음의 몇 항은 달라도 어느 지점 이후에 조건이 성립하면 수렴 여부를 판단할 수 있다.',
      evidence: [derivative, ...(id === 'eventual' ? [reading.tail ? "x\\ge3>e\\;\\Rightarrow\\;f'(x)<0" : "f'(2)>0,\\qquad f'(x)<0\\;(x>e)"] : [])],
      outcome: id === 'eventual' && !reading.tail ? '처음부터 감소하지 않는다. 시작점을 3으로 옮겨 뒷부분을 확인한다.' : '양수·연속·감소를 모두 확인했다. 적분판정법을 적용할 수 있다.',
      state: id === 'eventual' && !reading.tail ? 'stop' : 'ready' },
    { id: 'integral', title: '이상적분은 수렴하는가?', english: 'Improper integral', question: '적분 구간의 끝을 무한히 늘릴 때 값이 유한한가?',
      reason: '무한대를 수로 대입하지 않는다. 유한한 상한까지 먼저 적분하고 그 상한을 무한히 보내는 극한을 구한다.',
      evidence: ['I=\\lim_{b\\to\\infty}\\int_{' + lower + '}^b' + f + '\\,dx',
        ...(id === 'geometric' ? ['\\int_1^b2^{-x}\\,dx=\\frac{1/2-2^{-b}}{\\ln2}'] :
          id === 'eventual' ? ['u=\\ln x,\\quad du=\\frac{dx}{x}', '\\int_{' + lower + '}^b\\frac{\\ln x}{x}\\,dx=\\frac{(\\ln b)^2-(\\ln ' + lower + ')^2}{2}'] :
          squared ? ['u=\\ln x,\\quad \\int_2^b\\frac{dx}{x(\\ln x)^2}=\\int_{\\ln2}^{\\ln b}u^{-2}\\,du', '=\\frac1{\\ln2}-\\frac1{\\ln b}'] :
          ['\\int_2^b\\frac{dx}{x\\ln x}=\\ln(\\ln b)-\\ln(\\ln2)']),
        'I=' + (id === 'geometric' ? '\\frac1{2\\ln2}' : squared ? '\\frac1{\\ln2}' : '+\\infty')],
      outcome: squared || id === 'geometric' ? '극한이 유한하다. 이 이상적분은 수렴한다.' : '상한이 커질수록 적분값이 한없이 커진다. 이 이상적분은 발산한다.', state: 'ready' },
    { id: 'conclusion', title: '원래 질문으로 돌아간다', english: 'Conclusion', question: '이 정리가 실제로 보장하는 결론은 어디까지인가?',
      reason: '조건을 모두 충족한 양항급수에서는 급수와 이상적분의 수렴 여부가 같다. 적분값과 급수의 합이 같다는 정리가 아니다.',
      evidence: ['\\sum_{n=' + lower + '}^\\infty f(n)\\text{ converges }\\Longleftrightarrow\\int_{' + lower + '}^\\infty f(x)\\,dx\\text{ converges}',
        ...(id === 'eventual' ? ['\\sum_{n=2}^\\infty\\frac{\\ln n}{n}=\\frac{\\ln2}{2}+\\sum_{n=3}^\\infty\\frac{\\ln n}{n}'] : []),
        ...(id === 'alternating' ? ['\\sum|a_n|<\\infty\\;\\Rightarrow\\;\\sum a_n\\text{ converges absolutely}'] : []),
        '\\sum_{n=' + lower + '}^\\infty f(n)\\ne\\int_{' + lower + '}^\\infty f(x)\\,dx'],
      outcome: id === 'alternating' ? '절댓값 급수가 수렴하므로 원래 교대급수는 절대수렴한다. 합의 정확한 값은 구하지 않았다.' :
        id === 'eventual' ? '뒷부분이 발산하므로 원래 급수도 발산한다. 처음의 유한한 항은 이 판정을 바꾸지 않는다.' :
        squared || id === 'geometric' ? '원래 급수는 수렴한다. 적분판정법으로 얻은 적분값을 급수의 합으로 쓰면 안 된다.' : '원래 급수는 발산한다.', state: 'ready' },
  ];
  return steps.map((step) => reading.pending === step.id ? {
    ...step, state: 'unknown', outcome: '아직 근거를 확인하지 않았다. 이 조건을 거짓으로 처리하거나 다음 결론으로 건너뛰지 않는다.',
  } : step);
}
