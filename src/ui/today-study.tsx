import type { AppState } from '../domain/model';
import type { RecommendationWorkspace } from '../domain/recommendation-workspace';
import { todayStudy } from '../domain/today-study';
import { openLearningSchedules } from './learning-schedule-navigation';
export function TodayStudy({ data, workspace, subjectIds, at }: { data: AppState; workspace: RecommendationWorkspace; subjectIds: string[]; at: string }) {
  const choice = todayStudy(data,workspace,subjectIds,at);
  return <section aria-label="복습과 일정에서 고르기">
    <div className="actions">{!!choice.due.length && <a href="#/recall/scheduled">예약된 복습 {choice.due.length}개 열기</a>}<a href="#/subjects">원하는 주제에서 공부하기</a></div>
    {!!choice.schedules.length && <details><summary>기한이 있는 일정 {choice.schedules.length}개</summary><ul>{choice.schedules.slice(0,3).map(s => <li key={s.id}>{s.name} · {s.dueDate} <a className="schedule-navigation" href="#learning-schedules" onClick={e => { e.preventDefault(); openLearningSchedules(); }}>일정과 준비 상태 보기</a></li>)}</ul><p className="muted">먼저 오는 기한 순서입니다. 완료 상태는 일정에서 직접 남깁니다.</p></details>}
  </section>;
}
