import { DomainError } from './model.ts';

/** Existing records are optional inputs; these tasks never create performance evidence. */
const CURRENT_STUDY_AI_TASKS = {
  'study-pack': {
    label: '복습 자료 한 번에',
    instruction: '제공한 자료를 한 번 읽고 핵심 개념·암기 포인트를 summary에, 인출 질문과 답을 cards에, 객관식 문제와 해설을 quiz에, 개념 관계를 map에 함께 만든다. 각 출력의 원문 근거와 조건·예외를 유지한다. 튜터는 사용자가 질문할 때 같은 자료로 이어간다.',
  },
  quiz: {
    label: '객관식 퀴즈',
    instruction:
      '제공된 자료만으로 답할 수 있는 객관식 문항을 quiz에 만든다. 보기의 정답은 하나이고 오답도 같은 종류로 그럴듯해야 한다. 문제·보기와 정답·해설을 분리하고 summary와 cards는 비운다.',
  },
  tutor: {
    label: '자료에 질문',
    instruction:
      'request-focus의 질문에 자료를 근거로 답한다. history는 이전 대화이며 원문 근거가 아니다. 자료로 확인할 수 없는 내용은 확인 불가라고 밝힌다. cards는 비운다.',
  },
  mindmap: {
    label: '개념도 만들기',
    instruction:
      '자료의 실제 개념과 관계를 map에 만든다. 각 개념과 관계의 sourceIds를 연결한다. 포함·원인·조건·선행·비교 관계를 label에 명시한다. summary에는 해석 조건만 적고 cards는 비운다.',
  },
  summary: {
    label: '요약과 카드',
    instruction: '원문의 핵심과 남은 의문을 요약하고 자료로 답할 수 있는 인출 카드를 만든다.',
  },
  formula: {
    label: '수식 보완',
    instruction:
      '말로 쓴 식이나 부분 수식을 편집 가능한 LaTeX로 제안한다. \\( ... \\) 또는 $$ ... $$를 쓴다. 기호 뜻·단위·성립 조건·여러 가능한 해석을 함께 설명한다. 입력 불편으로 비운 식을 지식 부족으로 판정하지 않는다.',
  },
  questions: {
    label: '인출 질문',
    instruction:
      '선택 자료 안의 핵심 원리를 묻는 인출 질문을 만든다. 답과 근거는 카드의 answer에만 넣고 summary에 정답을 노출하지 않는다.',
  },
  organize: {
    label: '필기 정리',
    instruction:
      '원문 순서·조건·이유·예외·개인 의견을 보존하여 읽기 쉬운 정리안을 만든다. 실제 의문과 다음 행동은 원문 근거와 함께 구분하고 의무나 일정으로 확정하지 않는다.',
  },
  glossary: {
    label: '용어 풀이',
    instruction:
      '입력 문맥의 용어·원어·번역·의미를 풀어 쓴다. 교재의 특수 정의를 보존하고 일반적인 보충 설명과 원문의 설명을 구별한다.',
  },
  explain: {
    label: '다른 방식으로 설명',
    instruction:
      '조건을 보존하며 문장·수식·수치 예로 다시 설명한다. 사용자의 수준이나 고정 학습 스타일을 추정하지 않는다. 원문 밖의 보충은 보충 설명이라고 밝힌다.',
  },
  reasoning: {
    label: '설명·논리 검토',
    instruction:
      '실제 서술·증명·유도에서 조건과 문장 사이의 빠진 근거·다른 해석을 짚는다. 글에 생략한 설명을 개념 무지로 판정하지 않는다. 원문 위치와 확인할 질문을 남기고 수정안은 별도로 제시한다.',
  },
  code: {
    label: '코드·실행 검토',
    instruction:
      '제공된 실제 코드·입력·실행 결과·메모에 근거해 제어 흐름·오류 위치·수정 후보·확인할 다른 입력을 설명한다. 현재 코드와 과거 실행 당시 코드를 구별하고 GPT의 예측을 실제 실행 결과로 바꾸지 않는다. 새 코드를 실행하거나 독립 작성 능력·공부 완료를 판정하지 않는다.',
  },
  conditions: {
    label: '적용 조건과 반례',
    instruction:
      '주어진 개념·명제의 적용 조건, 예와 비예, 반례 후보와 확인할 이유를 설명한다. 계산·반례가 검증됐다고 주장하지 않는다.',
  },
  compare: {
    label: '개념 비교',
    instruction:
      '사용자가 지정한 실제 두 개념의 정의·차이·적용 상황을 비교한다. 이름이나 목차만으로 혼동을 추정하지 않는다. 대상이 불명확하면 확인할 질문을 남긴다.',
  },
  diagram: {
    label: '관계도 초안',
    instruction:
      '관계를 글로 명확히 설명하고 편집 가능한 Mermaid 코드 블록으로 작은 관계도 초안을 제안한다. 인과·포함·선행·유사를 구분한다. 기존 Canvas 좌표나 연결을 바꾸었다고 하지 않는다.',
  },
  hint: {
    label: '다음 단계 힌트',
    instruction:
      '실제 문제와 현재 시도에서 조건 확인·전략·다음 한 단계까지만 힌트를 준다. 전체 정답이나 풀이를 먼저 노출하지 않는다. 막힘의 원인은 가설로만 표현한다.',
  },
  feedback: {
    label: '답안 검토',
    instruction:
      '실제 문제·답안·참고 기준을 대조한다. 조건·계산·단위·설명 생략을 구분하며 다른 가능한 풀이를 허용한다. 원인은 가설이고 근거가 부족하면 확인 불가라고 쓴다. 공식 점수·숙달·독립 수행을 판정하지 않는다.',
  },
  practice: {
    label: '다른 맥락의 재연습',
    instruction:
      '실제 문제와 확인할 참고 풀이에 근거해 같은 원리를 다른 맥락에서 묻는 카드를 만든다. 질문과 해설을 분리하고 범위 밖 개념·해 없음·모호한 조건을 점검할 대상으로 표시한다. 자체 검토를 검증 완료라고 하지 않는다.',
  },
  reflect: {
    label: '기록 변화 돌아보기',
    instruction:
      '입력에 실제로 있는 날짜·이전 설명·자기 정정을 비교한다. 반복 질문을 보여 주되 미기록을 해결이나 실패로, 긴 글을 실력 상승으로 판단하지 않는다. 날짜가 없으면 변화 순서를 단정하지 않는다.',
  },
  'next-study': {
    label: '다음 공부 제안',
    instruction:
      '실제 의문·막힘과 제공된 목표에 근거한 작은 행동을 제안한다. 없는 문제·자료·시간·감정을 가정하지 않는다. 공부 횟수·복습 날짜·성과를 새로 계산하지 않고 제안을 완료·의무로 만들지 않는다.',
  },
} as const;
// Keep historical requests readable without adding a duplicate choice to the menu.
export const STUDY_AI_TASKS = Object.defineProperty(CURRENT_STUDY_AI_TASKS, 'source-qa', {value: CURRENT_STUDY_AI_TASKS.tutor, enumerable: false}) as typeof CURRENT_STUDY_AI_TASKS & {'source-qa': typeof CURRENT_STUDY_AI_TASKS.tutor};
export type StudyAITask = keyof typeof STUDY_AI_TASKS | 'source-qa';
export interface StudyAIRequest {
  task: StudyAITask;
  /** Generation preference; excluded from model input by activeStudyAIRequest. */
  requestedCardCount?: 5 | 10 | 20 | 30;
  support?: 'full' | 'key' | 'check';
  externalization?: 'auto' | 'full' | 'off';
  problem?: string;
  attempt?: string;
  reference?: string;
  focus?: string;
  history?: { question: string; answer: string }[];
}
export const isStudyAITask = (value: unknown): value is StudyAITask =>
  typeof value === 'string' && (value === 'source-qa' || Object.hasOwn(STUDY_AI_TASKS, value));
export function validateStudyAIRequest(
  value: unknown,
  complete = true,
): asserts value is StudyAIRequest {
  const row = value as StudyAIRequest;
  if (!row || !isStudyAITask(row.task))
    throw new DomainError('INVALID_AI_REQUEST', 'GPT 작업을 골라 주세요.');
  if (row.requestedCardCount !== undefined && ![5, 10, 20, 30].includes(row.requestedCardCount))
    throw new DomainError('INVALID_AI_REQUEST', '생성할 카드 개수를 확인해 주세요.');
  for (const key of ['problem', 'attempt', 'reference', 'focus'] as const)
    if (row[key] !== undefined && (typeof row[key] !== 'string' || row[key]!.length > 30_000))
      throw new DomainError('INVALID_AI_REQUEST', '추가 내용을 3만 자 이내로 나누어 주세요.');
  if (
    row.history !== undefined &&
    (!Array.isArray(row.history) ||
      row.history.length > 6 ||
      row.history.some(
        (turn) =>
          !turn ||
          typeof turn.question !== 'string' ||
          turn.question.length > 10000 ||
          typeof turn.answer !== 'string' ||
          turn.answer.length > 20000,
      ) ||
      JSON.stringify(row.history).length > 40000)
  )
    throw new DomainError('INVALID_AI_REQUEST', '이전 질문의 범위를 나누어 주세요.');
  if (row.support !== undefined && !['full','key','check'].includes(row.support)) throw new DomainError('INVALID_AI_REQUEST', '설명 도움 수준을 확인해 주세요.');
  if (row.externalization !== undefined && !['auto','full','off'].includes(row.externalization)) throw new DomainError('INVALID_AI_REQUEST', '사고 보조 장치 선택을 확인해 주세요.');
  if (!complete) return;
  if (['tutor', 'source-qa'].includes(row.task) && !row.focus?.trim())
    throw new DomainError('INVALID_AI_REQUEST', '자료에 물어볼 질문을 넣어 주세요.');
  if (['hint', 'feedback', 'practice'].includes(row.task) && !row.problem?.trim())
    throw new DomainError('INVALID_AI_REQUEST', '이 작업에 사용할 실제 문제와 조건을 넣어 주세요.');
  if (['hint', 'feedback'].includes(row.task) && !row.attempt?.trim())
    throw new DomainError('INVALID_AI_REQUEST', '현재 풀이 또는 막힌 단계를 넣어 주세요.');
  if (['feedback', 'practice'].includes(row.task) && !row.reference?.trim())
    throw new DomainError('INVALID_AI_REQUEST', '확인할 해설이나 판단 기준을 넣어 주세요.');
}
/** Do not send hidden fields left from an unrelated previous task. */
export function activeStudyAIRequest(request?: StudyAIRequest): StudyAIRequest {
  const row = request ?? { task: 'summary' as const };
  validateStudyAIRequest(row, false);
  const problemTask = ['hint', 'feedback', 'practice'].includes(row.task);
  return {
    task: row.task === 'source-qa' ? 'tutor' : row.task,
    ...(row.support ? { support: row.support } : {}),
    ...(row.externalization ? { externalization: row.externalization } : {}),
    ...(row.focus !== undefined && row.task !== 'summary' ? { focus: row.focus } : {}),
    ...(problemTask && row.problem !== undefined ? { problem: row.problem } : {}),
    ...(problemTask && row.attempt !== undefined ? { attempt: row.attempt } : {}),
    ...(problemTask && row.reference !== undefined ? { reference: row.reference } : {}),
    ...(['tutor', 'source-qa'].includes(row.task) && row.history ? { history: row.history } : {}),
  };
}
