/** Preserved from 1st-generation trace.js CURRENT_ITEMS (0.33.5).
 * Display numbers are not stable IDs. required describes the criterion, not mandatory input.
 */
export const TRACE_GROUP_LABELS = { T: '흐름 살펴보기', R: '핵심 정리하기', A: '풀어 본 문제 다시풀기', C: '안 풀어본 문제 풀기', E: '의미 이해하기' } as const;
export const TRACE_ITEMS = [
  {
    "id": "Td1",
    "group": "T",
    "label": "이 주제에서 답하려는 질문을 한 문장으로 적어보았다.",
    "question": "이 주제에서 답하려는 질문은 무엇인가요?",
    "mode": "required"
  },
  {
    "id": "Td2",
    "group": "T",
    "label": "설명의 흐름을 따라가고 필요한 선행 개념을 짚어보았다.",
    "question": "설명은 어떻게 이어지고, 어떤 개념이 먼저 필요한가요?",
    "mode": "required"
  },
  {
    "id": "Rd1",
    "group": "R",
    "label": "기억하고 사용할 정의·공식·핵심 결론을 정리해보았다.",
    "question": "지금 기억하고 사용할 핵심은 무엇인가요?",
    "mode": "required"
  },
  {
    "id": "Rd2",
    "group": "R",
    "label": "기호의 뜻과 적용 조건을 확인하고 원문과 대조해보았다.",
    "question": "기호와 조건을 어떻게 기억하며, 원문과 맞나요?",
    "mode": "required"
  },
  {
    "id": "Ad1",
    "group": "A",
    "label": "대표 문제를 직접 풀고 방법을 선택한 이유를 설명해보았다.",
    "question": "어떤 방법을 선택해 시도했고, 왜 그 방법을 골랐나요?",
    "mode": "required"
  },
  {
    "id": "Ad2",
    "group": "A",
    "label": "틀리거나 막힌 부분을 보완하고 다시 풀어보았다.",
    "question": "막힌 부분을 어떻게 보완했고, 다시 해보니 어디까지 되나요?",
    "mode": "required"
  },
  {
    "id": "Cd1",
    "group": "C",
    "label": "자료 없이 핵심을 떠올리고 정확성을 확인해보았다.",
    "question": "도움 없이 무엇을 떠올렸으며 원문과 얼마나 맞나요?",
    "mode": "required"
  },
  {
    "id": "Cself1",
    "group": "C",
    "label": "자기화 재구성: 공부한 내용을 나만의 언어와 방식으로 표현하고 연결해보았다.",
    "question": "공부한 내용을 나만의 언어와 방식으로 어떻게 표현하고 연결했나요?",
    "mode": "optional"
  },
  {
    "id": "Cd3",
    "group": "C",
    "label": "변형·혼합·새 문제에서 목표 수행을 확인해보았다.",
    "question": "새로운 문제에서도 목표로 한 수행을 할 수 있나요?",
    "mode": "required"
  },
  {
    "id": "Cd4",
    "group": "C",
    "label": "핵심 정의·공식·조건·결론을 백지에 서술하고 원문과 대조해보았다.",
    "question": "이 주제에서 실제로 쓸 핵심을 자료 없이 어떻게 서술했나요?",
    "mode": "optional"
  },
  {
    "id": "Cd5",
    "group": "C",
    "label": "검증 결과를 살피고 부족함과 다음 행동을 정해보았다.",
    "question": "확인한 결과와 남은 부족함은 무엇이며, 다음에 무엇을 할까요?",
    "mode": "required"
  },
  {
    "id": "Ed1",
    "group": "E",
    "label": "어떤 문제나 필요를 다루기 위해 도입되는지 설명해보았다.",
    "question": "이 개념·정리·공식은 어떤 필요를 다루나요?",
    "mode": "required"
  },
  {
    "id": "Ed2",
    "group": "E",
    "label": "도입 사례에서 주어진 것과 구하려는 것을 풀어 말해보았다.",
    "question": "예시에서 무엇이 주어지고 무엇을 구하거나 설명하나요?",
    "mode": "required"
  },
  {
    "id": "Ed3",
    "group": "E",
    "label": "뜻을 자기 말과 예시로 설명하고 원문과 대조해보았다.",
    "question": "자기 말과 예시로 설명하면 어떤 뜻이며, 원문과 맞나요?",
    "mode": "required"
  },
  {
    "id": "Ed4",
    "group": "E",
    "label": "다른 적용 상황·조건 변화·더 알 수 있는 결론을 생각해보았다.",
    "question": "무엇을 더 알 수 있고, 조건이나 상황이 달라지면 어떻게 되나요?",
    "mode": "required"
  }
] as const;
export const WRITTEN_REVIEW_ITEM_ID = 'Cself1';
