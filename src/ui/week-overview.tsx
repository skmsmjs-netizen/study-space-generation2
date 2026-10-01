import { useState } from 'react';
import type { AppState } from '../domain/model';
import type { LearningSchedule } from '../domain/learning-schedule';
import { scheduleLabels } from '../domain/learning-schedule';
import { weekSchedules } from '../domain/study-calendar';
import { Button, Card, Input } from './index';
import { openLearningSchedules } from './learning-schedule-navigation';

export function WeekOverview({ data, schedules, subjectIds, at }: { data: AppState; schedules: LearningSchedule[]; subjectIds: string[]; at: string }) {
  const [search, setSearch] = useState(''), [expanded, setExpanded] = useState(false);
  const scoped = schedules.filter(s => subjectIds.includes(s.subjectId) && data.subjects.some(p => p.id === s.subjectId && !p.deletedAt && p.userId === data.userId && p.namespace === data.namespace));
  const week = weekSchedules(scoped, at);
  const filter = (rows: LearningSchedule[]) => rows.filter(s => `${s.name} ${data.subjects.find(p => p.id === s.subjectId)?.name ?? ''}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  const render = (rows: LearningSchedule[]) => rows.map(s => <article key={s.id} className="ui-card">
    <p className="muted">{data.subjects.find(p => p.id === s.subjectId)?.name} · {scheduleLabels[s.kind]}</p>
    <h3>{s.name}</h3><p>{s.dueDate ? `기한 ${s.dueDate}${s.dueTime ? ` ${s.dueTime}` : ' · 시각 미정'}` : s.opensDate ? `시작 ${s.opensDate} · 기한 미정` : '기한 미정'}</p>
    <Button onClick={() => openLearningSchedules(s.id)}>일정 확인 · {s.name}</Button>
  </article>);
  const upcoming = filter(week.upcoming);
  return <Card aria-label="이번 주 일정" className="schedule-dashboard">
    <div className="section-heading"><h2>이번 주, 확인할 것부터.</h2><a href="#/schedules">전체 일정 보기</a></div>
    <p className="muted">{week.from}–{week.to} · 월요일부터 일요일까지입니다. 강의 학습·출석, 과제 준비·제출은 각각 확인합니다.</p>
    {scoped.length > 6 && <Input label="홈 일정 찾기" type="search" value={search} onChange={e => { setSearch(e.target.value); setExpanded(false); }} />}
    <div className="learning-schedule-list">{render(expanded ? upcoming : upcoming.slice(0, 6))}</div>
    {!upcoming.length && <p>{search ? '찾는 일정이 없습니다. 과목이나 일정 이름을 바꿔 찾아보세요.' : '이번 주에 확인할 일정이 없습니다. 일정이 있으면 필요한 날짜만 남겨 주세요.'}</p>}
    {upcoming.length > 6 && <Button onClick={() => setExpanded(v => !v)}>{expanded ? '접기' : `이번 주 일정 ${upcoming.length - 6}개 더 보기`}</Button>}
    <details><summary>기한이 지난 일정 {week.overdue.length}개</summary><p className="muted">남긴 상태를 확인해 주세요. 기한이 지났다는 이유로 실패나 미제출로 판단하지 않습니다.</p><div className="learning-schedule-list">{render(filter(week.overdue))}</div></details>
    <details><summary>날짜 미정 일정 {week.unknown.length}개</summary><p className="muted">공지에서 날짜를 확인한 뒤 일정에 남겨 주세요.</p><div className="learning-schedule-list">{render(filter(week.unknown))}</div></details>
  </Card>;
}
