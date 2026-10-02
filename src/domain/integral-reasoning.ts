/** Worked examples, not an arbitrary-expression solver or a mastery model. */
export const EXAMPLE_IDS = [
  'log-square',
  'log',
  'alternating',
  'eventual',
  'geometric',
  'nonzero',
] as const;
export type SeriesExampleId = (typeof EXAMPLE_IDS)[number];
export const STEP_IDS = [
  'goal',
  'term',
  'method',
  'function',
  'positive',
  'continuous',
  'decreasing',
  'integral',
  'conclusion',
] as const;
export type ReasoningStepId = (typeof STEP_IDS)[number];
export type ReasoningMethod = 'integral' | 'ratio' | 'alternating' | 'geometric';
export type ReadingPosition = {
  step: ReasoningStepId;
  method: ReasoningMethod;
  absolute: boolean;
  tail: boolean;
  pending: ReasoningStepId | null;
  brief: boolean;
  badExtension?: boolean;
  areaCount?: number;
};
export const DEFAULT_READING: ReadingPosition = {
  step: 'goal',
  method: 'integral',
  absolute: false,
  tail: false,
  pending: null,
  brief: false,
};
export type ReasoningStep = {
  id: ReasoningStepId;
  title: string;
  english: string;
  question: string;
  reason: string;
  evidence: string[];
  outcome: string;
  state: 'ready' | 'stop' | 'unknown';
};
export const SERIES_EXAMPLES: Record<SeriesExampleId, { title: string; tex: string }> = {
  'log-square': { title: '로그가 제곱인 급수', tex: '\\sum_{n=2}^{\\infty}\\frac{1}{n(\\ln n)^2}' },
  log: { title: '로그가 한 번인 급수', tex: '\\sum_{n=2}^{\\infty}\\frac{1}{n\\ln n}' },
  alternating: {
    title: '부호가 번갈아 바뀌는 급수',
    tex: '\\sum_{n=2}^{\\infty}\\frac{(-1)^n}{n(\\ln n)^2}',
  },
  eventual: { title: '처음에는 증가하는 급수', tex: '\\sum_{n=2}^{\\infty}\\frac{\\ln n}{n}' },
  geometric: { title: '익숙한 등비급수', tex: '\\sum_{n=1}^{\\infty}\\left(\\frac12\\right)^n' },
  nonzero: { title: '항이 0으로 가지 않는 급수', tex: '\\sum_{n=2}^{\\infty}\\frac{n}{n+1}' },
};
export function canReachStep(
  id: SeriesExampleId,
  reading: ReadingPosition,
  target: ReasoningStepId,
) {
  const index = STEP_IDS.indexOf(target);
  if (reading.pending && index > STEP_IDS.indexOf(reading.pending)) return false;
  if (id === 'nonzero' && index > STEP_IDS.indexOf('term')) return false;
  if (reading.badExtension && index > STEP_IDS.indexOf('continuous')) return false;
  if (reading.method !== 'integral' && index > STEP_IDS.indexOf('method')) return false;
  if (id === 'alternating' && !reading.absolute && index > STEP_IDS.indexOf('positive'))
    return false;
  if (id === 'eventual' && !reading.tail && index > STEP_IDS.indexOf('decreasing')) return false;
  return true;
}
/** The same values drive rectangles, curve, finite integral and numeric bounds. */
export function integralComparison(id: SeriesExampleId, reading: ReadingPosition, count: number) {
  if (!canReachStep(id, reading, 'integral') || !Number.isInteger(count) || count < 3 || count > 12)
    throw Error('적분의 적용 조건과 구간을 먼저 확인해 주세요.');
  const lower = id === 'geometric' ? 1 : id === 'eventual' && reading.tail ? 3 : 2;
  const f = (x: number) =>
    id === 'geometric'
      ? 2 ** -x
      : id === 'eventual'
        ? Math.log(x) / x
        : 1 / (x * Math.log(x) ** (id === 'log' ? 1 : 2));
  const upper = lower + count;
  const left = Array.from({ length: count }, (_, i) => f(lower + i)).reduce((a, b) => a + b, 0);
  const right = Array.from({ length: count }, (_, i) => f(lower + i + 1)).reduce(
    (a, b) => a + b,
    0,
  );
  const area =
    id === 'geometric'
      ? (2 ** -lower - 2 ** -upper) / Math.log(2)
      : id === 'eventual'
        ? (Math.log(upper) ** 2 - Math.log(lower) ** 2) / 2
        : id === 'log'
          ? Math.log(Math.log(upper)) - Math.log(Math.log(lower))
          : 1 / Math.log(lower) - 1 / Math.log(upper);
  return { lower, upper, left, right, area, f };
}
export function reasoningSteps(id: SeriesExampleId, reading: ReadingPosition): ReasoningStep[] {
  const squared = id === 'log-square' || id === 'alternating';
  const lower = id === 'eventual' && reading.tail ? 3 : id === 'geometric' ? 1 : 2;
  const f =
    id === 'geometric'
      ? '2^{-x}'
      : id === 'eventual'
        ? '\\frac{\\ln x}{x}'
        : id === 'nonzero'
          ? '\\frac{x}{x+1}'
          : squared
            ? '\\frac{1}{x(\\ln x)^2}'
            : '\\frac{1}{x\\ln x}';
  const signed = id === 'alternating' && !reading.absolute;
  const derivative =
    id === 'geometric'
      ? "f'(x)=-(\\ln 2)\\,2^{-x}<0"
      : id === 'eventual'
        ? "f'(x)=\\frac{1-\\ln x}{x^2}"
        : squared
          ? "f'(x)=-\\frac{\\ln x+2}{x^2(\\ln x)^3}<0"
          : "f'(x)=-\\frac{\\ln x+1}{x^2(\\ln x)^2}<0";
  let methodReason =
    '로그와 역수가 함께 나타납니다. 실수의 함수로 옮기면 로그 치환으로 적분할 수 있습니다. 그래서 적분판정법을 후보로 잡습니다.';
  let methodEvidence = ['u=\\ln x,\\qquad du=\\frac{dx}{x}'];
  let methodOutcome = '계산하기 쉬운 후보를 골랐습니다. 이제 이 정리를 써도 되는지 확인합니다.';
  let methodState: ReasoningStep['state'] = 'ready';
  if (id === 'alternating')
    methodReason =
      '교대급수판정법도 후보입니다. 절댓값 급수에 적분판정법을 적용하면 절대수렴까지 확인할 수 있습니다. 원래 급수에 직접 적용할 수 있는지는 부호를 먼저 살핍니다.';
  if (id === 'eventual') methodReason += ' 처음부터 감소하는지는 별도로 확인해야 합니다.';
  if (id === 'geometric') {
    methodReason =
      '일정한 비율로 바뀌는 항입니다. 등비급수 공식으로 바로 판단할 수 있습니다. 적분판정법도 쓸 수 있지만 조건 확인과 적분이 더 필요합니다.';
    methodEvidence = ['r=\\frac12,\\qquad |r|<1'];
  }
  if (reading.method === 'ratio') {
    methodReason =
      '비율판정법은 이웃한 항의 절댓값 비율을 본다. 극한이 1이면 이 판정법으로 결론을 내리지 못합니다.';
    methodEvidence = [
      '\\lim_{n\\to\\infty}\\left|\\frac{a_{n+1}}{a_n}\\right|=' +
        (id === 'geometric' ? '\\frac12<1' : '1'),
    ];
    methodOutcome =
      id === 'geometric'
        ? '비율판정법으로 수렴합니다. 추가로 적분할 필요가 없습니다.'
        : '판정 불가입니다. 발산이라는 뜻이 아닙니다. 다른 후보로 돌아갑니다.';
    methodState = id === 'geometric' ? 'ready' : 'unknown';
  }
  if (reading.method === 'alternating') {
    methodReason =
      id === 'alternating'
        ? '절댓값인 항이 감소하고 0으로 가므로 교대급수판정법으로 수렴을 보입니다. 이 방법만으로 절대수렴까지 결정하지는 않습니다.'
        : '이 예제는 부호가 번갈아 바뀌지 않습니다. 교대급수판정법의 대상이 아닙니다.';
    methodEvidence = id === 'alternating' ? ['b_n=\\frac1{n(\\ln n)^2}\\downarrow0'] : [];
    methodOutcome =
      id === 'alternating'
        ? '원래 급수는 수렴합니다. 절대수렴을 더 알아보려면 절댓값 급수를 확인합니다.'
        : '다른 판정법 후보로 돌아갑니다.';
    methodState = id === 'alternating' ? 'ready' : 'stop';
  }
  if (reading.method === 'geometric') {
    methodReason =
      id === 'geometric'
        ? '공비의 절댓값이 1보다 작으므로 등비급수는 수렴합니다. 이 경우 합도 직접 구할 수 있습니다.'
        : '이 급수는 일정한 공비를 가진 등비급수가 아닙니다. 모양이 닮았다는 이유로 공식을 적용할 수 없습니다.';
    methodEvidence =
      id === 'geometric' ? ['\\sum_{n=1}^\\infty(\\tfrac12)^n=\\frac{1/2}{1-1/2}=1'] : [];
    methodOutcome =
      id === 'geometric'
        ? '수렴과 합을 확인했습니다. 필요하면 적분판정법의 결론과 비교합니다.'
        : '다른 판정법 후보로 돌아갑니다.';
    methodState = id === 'geometric' ? 'ready' : 'stop';
  }
  const steps: ReasoningStep[] = [
    {
      id: 'goal',
      title: '무엇을 판단하려는가?',
      english: 'Convergence',
      question: '무한히 더해도 유한한 값에 가까워지는가?',
      reason: '구하려는 것은 먼저 수렴 여부입니다. 합의 정확한 값은 별도의 질문입니다.',
      evidence: [
        `S_m=\\sum_{n=${id === 'geometric' ? 1 : 2}}^m a_n`,
        '\\lim_{m\\to\\infty}S_m\\in\\mathbb R\\;?',
      ],
      outcome: '수렴을 보일 도구를 찾되, 수렴 여부와 합을 구별합니다.',
      state: 'ready',
    },
    {
      id: 'term',
      title: '항이 0으로 가는가?',
      english: 'Divergence test',
      question: '수렴하려면 반드시 필요한 조건부터 확인할 수 있는가?',
      reason:
        '항이 0으로 가지 않으면 급수는 발산합니다. 0으로 가는 경우에는 아직 수렴을 알 수 없으므로 다른 판정법이 필요합니다.',
      evidence:
        id === 'nonzero'
          ? ['\\lim_{n\\to\\infty}\\frac{n}{n+1}=1\\ne0']
          : [
              '\\lim_{n\\to\\infty}a_n=0',
              'a_n\\to0\\;\\not\\Rightarrow\\;\\sum a_n\\text{ converges}',
            ],
      outcome:
        id === 'nonzero'
          ? '수렴의 필요조건을 충족하지 못하므로 원래 급수는 발산합니다. 다른 판정법을 적용할 필요가 없습니다.'
          : '이 예제의 항은 0으로 갑니다. 필요한 조건은 통과했지만 충분한 근거는 아직 없습니다.',
      state: id === 'nonzero' ? 'stop' : 'ready',
    },
    {
      id: 'method',
      title: '어떤 판정법이 맞을까?',
      english: 'Choosing a convergence test',
      question: '이 항의 구조를 어느 정리가 다루기 쉬운가?',
      reason: methodReason,
      evidence: methodEvidence,
      outcome: methodOutcome,
      state: methodState,
    },
    {
      id: 'function',
      title: '항을 함수로 옮긴다',
      english: 'Sequence and function',
      question: '정수에서 원래 항과 일치하는 함수를 만들 수 있는가?',
      reason: signed
        ? '정수에서 일치하는 함수는 만들 수 있습니다. 하지만 그것만으로 적분판정법의 조건을 충족하지는 않습니다.'
        : '정수인 자리를 실수로 넓힙니다. 같은 항을 갖는다는 조건과 그 구간에서 양수·연속·감소한다는 조건을 함께 확인합니다.',
      evidence: [
        `f(x)=${signed ? '\\frac{\\cos(\\pi x)}{x(\\ln x)^2}' : f}`,
        `f(n)=${reading.absolute ? '|a_n|' : 'a_n'}`,
      ],
      outcome: reading.absolute
        ? '현재 대상은 절댓값 급수입니다. 원래 급수와 구별해 둡니다.'
        : '원래 급수의 항과 함수를 연결했습니다.',
      state: 'ready',
    },
    {
      id: 'positive',
      title: '양항급수인가?',
      english: 'Positive-term series',
      question: '이 구간에서 함수와 각 항이 양수인가?',
      reason:
        '양수인 항을 직사각형의 넓이에 대응시키기 위해 필요합니다. 부호가 바뀌면 원래 급수에 이 정리를 바로 적용할 수 없습니다.',
      evidence: signed ? ['a_{2k}>0,\\qquad a_{2k+1}<0'] : [`f(x)>0\\qquad(x\\ge ${lower})`],
      outcome: signed
        ? '직접 적용할 수 없습니다. 발산이라고 결론 내리지 말고 절댓값 급수나 교대급수판정법을 살핍니다.'
        : '양수 조건을 확인했습니다. 연속성을 확인합니다.',
      state: signed ? 'stop' : 'ready',
    },
    {
      id: 'continuous',
      title: '연속인가?',
      english: 'Continuity',
      question: '정수 사이에서도 끊기거나 정의되지 않는 곳이 없는가?',
      reason:
        '항 사이의 넓이와 급수를 비교하려면 선택한 뒷부분 전체에서 함수가 연속이어야 합니다. 그래프의 몇 점만 보는 것으로 확인하지 않습니다.',
      evidence:
        id === 'geometric'
          ? ['f(x)=2^{-x}\\text{ is continuous on }[1,\\infty)']
          : [
              `\\ln x>0\\quad(x\\ge ${lower}),\\qquad x\\ne0`,
              `f\\text{ is continuous on }[${lower},\\infty)`,
            ],
      outcome:
        id === 'geometric'
          ? '지수함수의 연속성을 확인했습니다.'
          : '로그가 정의되고 분모가 0이 되지 않습니다. 연속함수의 곱·몫으로 연속성을 확인했습니다.',
      state: 'ready',
    },
    {
      id: 'decreasing',
      title: '감소하는가?',
      english: 'Monotonic decrease',
      question: '이 구간 전체에서 뒤로 갈수록 함수값이 작아지는가?',
      reason:
        '함수 아래 넓이를 좌우 직사각형 합 사이에 놓기 위해 필요합니다. 처음의 몇 항은 달라도 어느 지점 이후에 조건이 성립하면 수렴 여부를 판단할 수 있습니다.',
      evidence: [
        derivative,
        ...(id === 'eventual'
          ? [reading.tail ? "x\\ge3>e\\;\\Rightarrow\\;f'(x)<0" : "f'(2)>0,\\qquad f'(x)<0\\;(x>e)"]
          : []),
      ],
      outcome:
        id === 'eventual' && !reading.tail
          ? '처음부터 감소하지 않습니다. 시작점을 3으로 옮겨 뒷부분을 확인합니다.'
          : '양수·연속·감소를 모두 확인했습니다. 적분판정법을 적용할 수 있습니다.',
      state: id === 'eventual' && !reading.tail ? 'stop' : 'ready',
    },
    {
      id: 'integral',
      title: '이상적분은 수렴하는가?',
      english: 'Improper integral',
      question: '적분 구간의 끝을 무한히 늘릴 때 값이 유한한가?',
      reason:
        '무한대를 수로 대입하지 않습니다. 유한한 상한까지 먼저 적분하고 그 상한을 무한히 보내는 극한을 구합니다.',
      evidence: [
        `I=\\lim_{b\\to\\infty}\\int_{${lower}}^b${f}\\,dx`,
        ...(id === 'geometric'
          ? ['\\int_1^b2^{-x}\\,dx=\\frac{1/2-2^{-b}}{\\ln2}']
          : id === 'eventual'
            ? [
                'u=\\ln x,\\quad du=\\frac{dx}{x}',
                '\\int_{' +
                  lower +
                  '}^b\\frac{\\ln x}{x}\\,dx=\\frac{(\\ln b)^2-(\\ln ' +
                  lower +
                  ')^2}{2}',
              ]
            : squared
              ? [
                  'u=\\ln x,\\quad \\int_2^b\\frac{dx}{x(\\ln x)^2}=\\int_{\\ln2}^{\\ln b}u^{-2}\\,du',
                  '=\\frac1{\\ln2}-\\frac1{\\ln b}',
                ]
              : ['\\int_2^b\\frac{dx}{x\\ln x}=\\ln(\\ln b)-\\ln(\\ln2)']),
        `I=${id === 'geometric' ? '\\frac1{2\\ln2}' : squared ? '\\frac1{\\ln2}' : '+\\infty'}`,
      ],
      outcome:
        squared || id === 'geometric'
          ? '극한이 유한합니다. 이 이상적분은 수렴합니다.'
          : '상한이 커질수록 적분값이 한없이 커진다. 이 이상적분은 발산합니다.',
      state: 'ready',
    },
    {
      id: 'conclusion',
      title: '원래 질문으로 돌아간다',
      english: 'Conclusion',
      question: '이 정리가 실제로 보장하는 결론은 어디까지인가?',
      reason:
        '조건을 모두 충족한 양항급수에서는 급수와 이상적분의 수렴 여부가 같습니다. 적분값과 급수의 합이 같다는 정리가 아닙니다.',
      evidence: [
        '\\sum_{n=' +
          lower +
          '}^\\infty f(n)\\text{ converges }\\Longleftrightarrow\\int_{' +
          lower +
          '}^\\infty f(x)\\,dx\\text{ converges}',
        ...(id === 'eventual'
          ? [
              '\\sum_{n=2}^\\infty\\frac{\\ln n}{n}=\\frac{\\ln2}{2}+\\sum_{n=3}^\\infty\\frac{\\ln n}{n}',
            ]
          : []),
        ...(id === 'alternating'
          ? ['\\sum|a_n|<\\infty\\;\\Rightarrow\\;\\sum a_n\\text{ converges absolutely}']
          : []),
        ...(squared || id === 'geometric'
          ? [`\\sum_{n=${lower}}^\\infty f(n)\\ne\\int_{${lower}}^\\infty f(x)\\,dx`]
          : []),
      ],
      outcome:
        id === 'alternating'
          ? '절댓값 급수가 수렴하므로 원래 교대급수는 절대수렴합니다. 합의 정확한 값은 구하지 않았습니다.'
          : id === 'eventual'
            ? '뒷부분이 발산하므로 원래 급수도 발산합니다. 처음의 유한한 항은 이 판정을 바꾸지 않습니다.'
            : squared || id === 'geometric'
              ? '원래 급수는 수렴합니다. 적분판정법으로 얻은 적분값을 급수의 합으로 쓰면 안 됩니다.'
              : '원래 급수는 발산합니다.',
      state: 'ready',
    },
  ];
  const adjusted = steps.map((step): ReasoningStep => {
    if (reading.pending === step.id)
      return {
        ...step,
        state: 'unknown',
        outcome:
          '아직 근거를 확인하지 않았다. 이 조건을 거짓으로 처리하거나 다음 결론으로 건너뛰지 않습니다.',
      };
    if (!reading.badExtension) return step;
    if (step.id === 'function')
      return {
        ...step,
        reason:
          '정수에서는 같은 값을 갖지만 정수 사이에서는 1을 더한 함수를 비교합니다. 정수에서 일치한다는 사실만으로 함수 전체의 조건을 알 수 없습니다.',
        evidence: [
          'g(x)=\\begin{cases}' +
            f +
            '&x\\in\\mathbb Z\\\\' +
            f +
            '+1&x\\notin\\mathbb Z\\end{cases}',
          'g(n)=f(n)',
        ],
        outcome:
          '급수의 항은 그대로입니다. 바꾼 함수의 양수·연속·감소 조건은 다시 확인해야 합니다.',
      };
    if (step.id === 'positive') return { ...step, evidence: [`g(x)>0\\quad(x\\ge${lower})`] };
    if (step.id === 'continuous')
      return {
        ...step,
        state: 'stop',
        reason:
          '정수에 가까이 다가가면 함수값은 원래 함수값보다 1 큰 값에 접근합니다. 정수에서 실제 값과 다르므로 연속이 아닙니다.',
        evidence: ['g(n)=f(n),\\qquad\\lim_{x\\to n}g(x)=f(n)+1\\ne g(n)'],
        outcome:
          '이 함수로는 적분판정법을 적용할 수 없습니다. 같은 급수의 원래 연속함수로 돌아가 확인합니다. 급수의 발산을 뜻하지 않습니다.',
      };
    return step;
  });
  return id === 'nonzero'
    ? adjusted.filter((step) => step.id === 'goal' || step.id === 'term')
    : adjusted;
}
