import { applyCommand } from './commands';
import { emptyState, type AppState, type Command } from './model';

/** Invented, labelled data only. No user's subjects, records, or account identifiers. */
export function createDemoState(): AppState {
  let state = emptyState('demo-learner', 'demo');
  const at = '2026-09-29T00:00:00.000Z';
  const commands: Command[] = [
    { type: 'addSemester', id: 'demo-semester-current', name: '이번 학기 · 체험', opId: 'seed-1', at, userId: state.userId },
    { type: 'addSemester', id: 'demo-semester-past', name: '지난 학기 · 체험', opId: 'seed-2', at, userId: state.userId },
    { type: 'addSubject', id: 'demo-subject-math', name: '수학의 기초', scope: { kind: 'semester', semesterId: 'demo-semester-current' }, opId: 'seed-3', at, userId: state.userId },
    { type: 'addSubject', id: 'demo-subject-science', name: '과학 탐구', scope: { kind: 'semester', semesterId: 'demo-semester-current' }, opId: 'seed-4', at, userId: state.userId },
    { type: 'addSubject', id: 'demo-subject-past', name: '읽기와 표현', scope: { kind: 'semester', semesterId: 'demo-semester-past' }, opId: 'seed-5', at, userId: state.userId },
    { type: 'addSubject', id: 'demo-subject-independent', name: '스스로 고른 공부', scope: { kind: 'independent' }, opId: 'seed-6', at, userId: state.userId },
    { type: 'addNode', id: 'demo-unit-functions', subjectId: 'demo-subject-math', parentId: null, role: 'unit', name: '변화와 관계', opId: 'seed-7', at, userId: state.userId },
    { type: 'addNode', id: 'demo-outline-functions', subjectId: 'demo-subject-math', parentId: 'demo-unit-functions', role: 'outline', name: '함수의 표현', opId: 'seed-8', at, userId: state.userId },
    { type: 'addNode', id: 'demo-topic-function', subjectId: 'demo-subject-math', parentId: 'demo-outline-functions', role: 'topic', name: '함수는 어떤 관계일까?', opId: 'seed-9', at, userId: state.userId },
    { type: 'addNode', id: 'demo-topic-graph', subjectId: 'demo-subject-math', parentId: 'demo-outline-functions', role: 'topic', name: '그래프에서 변화 읽기', opId: 'seed-10', at, userId: state.userId },
    { type: 'addNode', id: 'demo-unit-force', subjectId: 'demo-subject-science', parentId: null, role: 'unit', name: '움직임 관찰하기', opId: 'seed-11', at, userId: state.userId },
    { type: 'addNode', id: 'demo-topic-force', subjectId: 'demo-subject-science', parentId: 'demo-unit-force', role: 'topic', name: '힘과 움직임', opId: 'seed-12', at, userId: state.userId },
    { type: 'updateNarrative', id: 'demo-overview-math', kind: 'subject-overview', ownerId: 'demo-subject-math', body: '식, 그림, 말로 같은 관계를 표현해 봅니다.\n\n이 내용은 기능을 살펴보기 위한 가짜 자료입니다.', expectedVersion: 0, opId: 'seed-13', at, userId: state.userId },
  ];
  for (const command of commands) state = applyCommand(state, command);
  return state;
}
