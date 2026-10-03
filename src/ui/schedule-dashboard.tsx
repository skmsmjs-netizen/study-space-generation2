import { occurrenceRows } from './list-keys';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import {
  scheduleDeadline,
  scheduleLabels,
  scheduleWorkSteps,
  workLabels,
  type LearningSchedule,
  type ScheduleKind,
} from '../domain/learning-schedule';
import {
  addDays,
  calendarFile,
  koreanDay,
  monthDays,
  orderSchedules,
  remainingTime,
  schedulePending,
  deadlinePending,
} from '../domain/schedule-management';
import {
  downloadCalendar,
  readScheduleView,
  saveScheduleView,
  type ScheduleView,
} from '../data/schedule-view';
import { Button, Card, EmptyState, Input, Select } from './index';
import type { ScheduleNotificationPort } from '../data/schedule-notifications';
import { ScheduleNotifications } from './schedule-notifications';
import { featureSurfaceAttributes } from './observatory-feature-identity';

export function ScheduleDashboard({
  data,
  schedules,
  edit,
  update,
  create,
  restore,
  notifications,
  checks,
  onCheck,
  goals,
  disabled = false,
}: {
  data: AppState;
  schedules: LearningSchedule[];
  edit: (s: LearningSchedule) => void;
  update: (s: LearningSchedule, p: Partial<LearningSchedule>, reason?: string) => void;
  create: (kind?: ScheduleKind) => void;
  restore: (s: LearningSchedule, index: number) => void;
  checks?: { id: string; subjectId: string; at: string }[];
  goals?: { targetId: string }[];
  onCheck: (subjectId: string) => void;
  notifications?: ScheduleNotificationPort;
  disabled?: boolean;
}) {
  const [now, setNow] = useState(() => new Date().toISOString()),
    [view, setView] = useState(() => readScheduleView(data, koreanDay().slice(0, 7))),
    [notice, setNotice] = useState(''),
    [checkSubject, setCheckSubject] = useState('');
  useEffect(() => {
    const tick = () => setNow(new Date().toISOString()),
      timer = window.setInterval(tick, 60000);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);
  const today = koreanDay(now),
    active = schedules.filter(schedulePending),
    overdue = active.filter(
      (s) => deadlinePending(s) && s.dueDate && Date.parse(scheduleDeadline(s)!) < Date.parse(now),
    ),
    unknown = active.filter((s) => !s.dueDate),
    soon = active.filter(
      (s) => deadlinePending(s) && s.dueDate >= today && s.dueDate <= addDays(today, 7),
    );
  const listRef = useRef<HTMLDivElement>(null),
    detailRef = useRef<HTMLElement>(null),
    returnId = useRef('');
  const selected = view.selectedDate ?? '',
    limit = view.limit ?? 20;
  const patchView = (p: Partial<ScheduleView>) => {
    const affectsResults = ['query', 'kind', 'status', 'period', 'month', 'selectedDate'].some(
      (key) => key in p,
    );
    const next = { ...view, ...(affectsResults ? { selectedId: '' } : {}), ...p };
    setView(next);
    try {
      saveScheduleView(data, next);
      setNotice('');
    } catch {
      setNotice('보기 설정을 이 기기에 저장하지 못했습니다. 일정 원문은 유지됩니다.');
    }
  };
  const selectSchedule = (id: string) => {
    returnId.current = id;
    patchView({ selectedId: id });
    requestAnimationFrame(() => {
      detailRef.current?.focus({ preventScroll: true });
      if (window.matchMedia?.('(max-width: 48rem)').matches)
        detailRef.current?.scrollIntoView?.({ block: 'start' });
    });
  };
  const returnToList = () => {
    const id = returnId.current || view.selectedId;
    patchView({ selectedId: '' });
    requestAnimationFrame(() => {
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[data-schedule-id]');
      const button = Array.from(buttons ?? []).find((b) => b.dataset.scheduleId === id);
      button?.focus({ preventScroll: true });
      (button ?? listRef.current)?.scrollIntoView?.({ block: 'nearest' });
    });
  };
  const savedSchedule = useEffectEvent((event: Event) => {
    const detail = (event as CustomEvent<{ id: string; isNew: boolean }>).detail;
    patchView({ selectedId: detail.id });
  });
  useEffect(() => {
    window.addEventListener('study-space:schedule-saved', savedSchedule);
    return () => window.removeEventListener('study-space:schedule-saved', savedSchedule);
  }, []);
  const filtered = orderSchedules(
    schedules.filter(
      (s) =>
        (view.status === 'trash' ? !!s.deletedAt : !s.deletedAt && s.status === view.status) &&
        (view.kind === 'all' || (view.kind === 'unknown' && !s.dueDate) || view.kind === s.kind) &&
        (!view.query ||
          [
            s.name,
            s.note,
            s.taskText,
            data.subjects.find((sub) => sub.id === s.subjectId)?.name,
          ].some((v) => v?.toLocaleLowerCase().includes(view.query.toLocaleLowerCase()))),
    ),
  );
  const ranged = filtered.filter((s) => {
    const date = s.dueDate || s.reviewDate;
    return (
      !date ||
      !view.period ||
      view.period === 'all' ||
      (view.period === 'month'
        ? date.startsWith(view.month)
        : date >= today && date <= addDays(today, 7))
    );
  });
  const shown = selected
    ? ranged.filter((s) => s.dueDate === selected || (!s.dueDate && s.reviewDate === selected))
    : ranged;
  const chosen =
    schedules.find(
      (s) =>
        s.id === view.selectedId &&
        (view.status === 'trash' ? !!s.deletedAt : !s.deletedAt && s.status === view.status),
    ) ?? (shown.length === 1 ? shown[0] : undefined);
  const subjectName = (s: LearningSchedule) =>
    data.subjects.find((sub) => sub.id === s.subjectId)?.name ?? '과목 미정';
  const statusText = (s: LearningSchedule) =>
    scheduleWorkSteps(s)
      .map(
        (step) =>
          `${workLabels[step]} ${s.states[step] === 'done' ? '확인' : s.states[step] === 'not-done' ? '아직 하지 않음' : '미확인'}`,
      )
      .join(' · ');
  const monthChange = (offset: number) => {
    const date = new Date(`${view.month}-01T00:00:00Z`);
    date.setUTCMonth(date.getUTCMonth() + offset);
    patchView({ month: date.toISOString().slice(0, 7), selectedDate: '' });
  };
  return (
    <section
      aria-label="일정 관리"
      className="schedule-dashboard"
      {...featureSurfaceAttributes('R03')}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: This names a non-form control/content group; fieldset would imply a form group. */}
      <div className="schedule-summary" role="group" aria-label="일정 요약">
        <span>일주일 안 {soon.length}개</span>
        <span>기한 지남 {overdue.length}개</span>
        <span>기한 미정 {unknown.length}개</span>
      </div>
      <p className="muted">
        강의 재생 확인 {schedules.filter((s) => !s.deletedAt && s.states.watch === 'done').length}개
        · 학습 확인 {schedules.filter((s) => !s.deletedAt && s.states.learn === 'done').length}개 ·
        필기 확인 {schedules.filter((s) => !s.deletedAt && s.states.notes === 'done').length}개 ·
        출석 확인 {schedules.filter((s) => !s.deletedAt && s.states.attendance === 'done').length}개
      </p>
      <div className="actions schedule-create">
        <Button variant="primary" onClick={() => create('assignment')}>
          과제 추가
        </Button>
        <Button onClick={() => create('lecture')}>온라인 강의 추가</Button>
        <Button onClick={() => create('class')}>주차별 강의 추가</Button>
        <Button onClick={() => create()}>시험·과제·강의 일정 추가</Button>
      </div>
      <div className="schedule-period">
        <Select
          label="일정 기간"
          value={view.period ?? 'all'}
          onChange={(e) =>
            patchView({
              period: e.target.value as ScheduleView['period'],
              selectedDate: '',
              limit: 20,
            })
          }
        >
          <option value="all">전체 기간</option>
          <option value="week">오늘부터 일주일</option>
          <option value="month">선택한 달</option>
        </Select>
        <Input
          label="달력 월"
          type="month"
          value={view.month}
          onInput={(e) => {
            if (e.currentTarget.value)
              patchView({ month: e.currentTarget.value, selectedDate: '' });
          }}
          onChange={(e) => {
            if (e.target.value) patchView({ month: e.target.value, selectedDate: '' });
          }}
        />
      </div>
      <div className="schedule-toolbar">
        <Input
          label="일정 찾기"
          type="search"
          value={view.query}
          onChange={(e) => patchView({ query: e.target.value, limit: 20 })}
        />
        <Select
          label="일정 종류 보기"
          value={view.kind}
          onChange={(e) => patchView({ kind: e.target.value, limit: 20 })}
        >
          <option value="all">모든 종류</option>
          <option value="unknown">기한 미정 모아 보기</option>
          {Object.entries(scheduleLabels).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </Select>
        <Select
          label="일정 보관 상태"
          value={view.status}
          onChange={(e) =>
            patchView({ status: e.target.value as ScheduleView['status'], limit: 20 })
          }
        >
          <option value="active">진행 중</option>
          <option value="ended">보관함</option>
          <option value="trash">휴지통</option>
        </Select>
      </div>
      <div className="actions schedule-view-switch">
        <Button aria-pressed={view.view === 'list'} onClick={() => patchView({ view: 'list' })}>
          목록
        </Button>
        <Button
          aria-pressed={view.view === 'calendar'}
          onClick={() => patchView({ view: 'calendar' })}
        >
          달력
        </Button>
        <Button
          onClick={() => {
            downloadCalendar(calendarFile(schedules, now, `${data.namespace}-${data.userId}`));
            setNotice(
              '캘린더 파일의 다운로드 위치를 확인해 주세요. 파일을 추가한 캘린더에서 알림을 설정할 수 있습니다. 일정이 바뀌면 다시 내려받아 주세요.',
            );
          }}
        >
          캘린더 파일 내려받기
        </Button>
      </div>
      {view.view === 'calendar' && (
        <div className="schedule-calendar">
          <div className="actions">
            <Button onClick={() => monthChange(-1)} aria-label="이전 달">
              이전 달
            </Button>
            <strong>{view.month}</strong>
            <Button onClick={() => monthChange(1)} aria-label="다음 달">
              다음 달
            </Button>
            <Button onClick={() => patchView({ month: today.slice(0, 7), selectedDate: '' })}>
              이번 달
            </Button>
          </div>
          {/* biome-ignore lint/a11y/useSemanticElements: The month group contains pressed date navigation controls, not form fields. */}
          <div className="schedule-month" role="group" aria-label={`${view.month} 일정 달력`}>
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <span key={day} className="schedule-weekday">
                {day}
              </span>
            ))}
            {monthDays(view.month).map((day) => {
              const rows = filtered.filter(
                (s) => s.dueDate === day || (!s.dueDate && s.reviewDate === day),
              );
              return (
                <button
                  type="button"
                  key={day}
                  className="schedule-day"
                  data-outside={!day.startsWith(view.month)}
                  aria-pressed={selected === day}
                  aria-current={day === today ? 'date' : undefined}
                  aria-label={`${day} · 일정 ${rows.length}개`}
                  onClick={() => {
                    patchView({ selectedDate: selected === day ? '' : day, limit: 20 });
                  }}
                >
                  <span>{Number(day.slice(-2))}</span>
                  <span className="schedule-day-count">
                    {rows.length ? `${rows.length}개` : ''}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="muted">
            날짜를 누르면 아래에서 해당 일정을 봅니다. 시각이 없는 일정은 날짜만 표시합니다.
          </p>
          {selected && (
            <div className="actions">
              <strong>{selected} 일정</strong>
              <Button onClick={() => patchView({ selectedDate: '' })}>모든 날짜 보기</Button>
            </div>
          )}
        </div>
      )}
      {notice && <p role="status">{notice}</p>}
      <p className="muted">
        {shown.length}개 · 가까운 기한 순서입니다. 보관은 완료를 뜻하지 않습니다.
      </p>
      {!shown.length && (
        <EmptyState
          title={
            selected
              ? '이 날짜에는 일정이 없습니다'
              : view.query || view.kind !== 'all'
                ? '조건에 맞는 일정이 없습니다'
                : view.status === 'trash'
                  ? '일정 휴지통이 비어 있습니다'
                  : view.status === 'ended'
                    ? '보관한 일정이 없습니다'
                    : '등록한 일정이 없습니다'
          }
          message={
            selected || view.query || view.kind !== 'all'
              ? '검색어와 종류·날짜 선택을 풀면 이 보관 상태의 일정을 모두 볼 수 있습니다.'
              : view.status === 'active'
                ? '과제·강의·시험 추가에서 필요한 일정을 남겨 보세요. 기한을 몰라도 등록할 수 있습니다.'
                : '진행 중인 일정으로 돌아가 확인할 수 있습니다.'
          }
        >
          {(selected || view.query || view.kind !== 'all') && (
            <Button
              onClick={() =>
                patchView({ query: '', kind: 'all', selectedDate: '', period: 'all', limit: 20 })
              }
            >
              검색·날짜 조건 해제
            </Button>
          )}
          {view.status !== 'active' && (
            <Button onClick={() => patchView({ status: 'active' })}>진행 중 일정 보기</Button>
          )}
        </EmptyState>
      )}
      <div className="schedule-workspace">
        <div className="schedule-agenda" ref={listRef} aria-label="일정 요약 목록">
          <div className="schedule-agenda-heading">
            <h2>일정 목록</h2>
            <span className="muted">{shown.length}개</span>
          </div>
          <div className="learning-schedule-list">
            {shown.slice(0, limit).map((s) => (
              <button
                key={s.id}
                type="button"
                className="schedule-agenda-row"
                data-schedule-id={s.id}
                aria-pressed={chosen?.id === s.id}
                aria-label={`일정 보기 · ${s.name}${s.week ? ` · ${s.week}주차` : ''}`}
                onClick={() => selectSchedule(s.id)}
              >
                <span className="schedule-row-context">
                  {subjectName(s)} · {scheduleLabels[s.kind]}
                  {s.week ? ` · ${s.week}주차` : ''}
                </span>
                <strong>{s.name}</strong>
                <span className="schedule-row-date">
                  {s.dueDate || '기한 미정'}
                  {s.dueTime ? ` ${s.dueTime}` : ''} · {remainingTime(s, now)}
                </span>
                <span className="schedule-row-status">{statusText(s)}</span>
              </button>
            ))}
          </div>
          {shown.length > limit && (
            <Button onClick={() => patchView({ limit: limit + 20 })}>
              일정 더 보기 · 남은 {shown.length - limit}개
            </Button>
          )}
        </div>
        <section
          className="schedule-selected"
          ref={detailRef}
          tabIndex={-1}
          aria-label="선택 일정 상세"
        >
          {chosen && !shown.some((s) => s.id === chosen.id) && (
            <div className="schedule-outside-filter">
              <p role="status">저장한 일정은 현재 목록 조건 밖에 있습니다. 보기 조건을 유지한 채 상세를 열었습니다.</p>
              <Button onClick={() => patchView({ query: '', kind: 'all', period: 'all', selectedDate: '', selectedId: chosen.id })}>이 일정이 있는 목록 보기</Button>
            </div>
          )}
          {chosen ? (
            [chosen].map((s) => (
              <Card key={s.id}>
                <div className="schedule-detail-heading">
                  <span className="muted">선택한 일정</span>
                  <Button variant="quiet" onClick={returnToList}>
                    일정 목록으로 돌아가기
                  </Button>
                </div>
                <p className="muted">
                  {scheduleLabels[s.kind]} ·{' '}
                  {data.subjects.find((sub) => sub.id === s.subjectId)?.name}
                  {s.week ? ` · ${s.week}주차` : ''}
                </p>
                <h3>{s.name}</h3>
                <p>
                  {s.dueDate || '기한 미정'}
                  {s.dueTime ? ` ${s.dueTime}` : ''} · {remainingTime(s, now)} ·{' '}
                  {
                    {
                      exam: '시험일',
                      submission: '제출 기한',
                      attendance: '출석 기한',
                      personal: '개인 목표',
                      unknown: '기한 의미 미정',
                    }[s.dueMeaning]
                  }
                  {s.weight !== null ? ` · 비중 ${Math.round(s.weight * 100)}%` : ''}
                </p>
                {s.opensDate && (
                  <p className="muted">
                    시작 가능: {s.opensDate}
                    {s.opensTime ? ` ${s.opensTime}` : ''}
                  </p>
                )}
                {!s.dueDate && (
                  <p className="muted">
                    공지 확인일: {s.reviewDate || '미정'}
                    {s.reviewDate && s.reviewDate <= today
                      ? ' · 공지에서 기한을 확인해 주세요.'
                      : ''}
                  </p>
                )}
                {s.taskText && <p className="next-study-answer">해야 할 일: {s.taskText}</p>}
                {s.note && <p className="next-study-answer">{s.note}</p>}
                {s.sourceUrl && (
                  <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer">
                    공지·강의 열기
                  </a>
                )}
                <div className="schedule-state-grid">
                  {!s.deletedAt &&
                    scheduleWorkSteps(s).map((step) => (
                      <Select
                        key={step}
                        label={workLabels[step]}
                        aria-label={`${s.name}${s.week ? ` · ${s.week}주차` : ''} · ${workLabels[step]}`}
                        value={s.states[step] ?? 'unknown'}
                        onChange={(e) =>
                          update(
                            s,
                            {
                              states: {
                                ...s.states,
                                [step]: e.target.value as 'unknown' | 'done' | 'not-done',
                              },
                            },
                            `${workLabels[step]} 상태 수정`,
                          )
                        }
                      >
                        <option value="unknown">미확인</option>
                        <option value="not-done">아직 하지 않음</option>
                        <option value="done">직접 확인한 완료</option>
                      </Select>
                    ))}
                </div>
                {s.targetIds.length > 0 && (
                  <p className="muted">
                    범위:{' '}
                    {s.targetIds
                      .map((id) => data.nodes.find((n) => n.id === id)?.name ?? id)
                      .join(', ')}
                  </p>
                )}
                {['exam', 'quiz'].includes(s.kind) &&
                  s.targetIds.some((id) => !goals?.some((g) => g.targetId === id)) && (
                    <p className="muted">
                      범위 중 수행 확인 기준이 없는 주제가 있습니다. ‘다음 공부’의 ‘확인할 내용
                      추가’에서 기준을 남기면 추천에 연결됩니다.
                    </p>
                  )}
                <div className="actions">
                  {s.deletedAt ? (
                    <Button onClick={() => update(s, { deletedAt: null }, '휴지통에서 복원')}>
                      일정 복원
                    </Button>
                  ) : (
                    <>
                      <Button variant="primary" onClick={() => edit(s)}>
                        일정 수정
                      </Button>
                      <Button
                        variant="quiet"
                        onClick={() =>
                          update(
                            s,
                            { status: s.status === 'active' ? 'ended' : 'active' },
                            '보관 상태 수정',
                          )
                        }
                      >
                        {s.status === 'active' ? '일정 보관' : '일정 다시 열기'}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => update(s, { deletedAt: now }, '휴지통으로 이동')}
                      >
                        휴지통으로 이동
                      </Button>
                    </>
                  )}
                  {!!s.history?.length && (
                    <Button onClick={() => restore(s, s.history!.length - 1)}>
                      마지막 변경 되돌리기
                    </Button>
                  )}
                </div>
                {!!s.history?.length && (
                  <details>
                    <summary>변경 이력 {s.history.length}개</summary>
                    {occurrenceRows(s.history.slice().reverse(), (h) => JSON.stringify(h)).map(
                      ({ value: h, index: i, key }) => (
                        <div key={key} className="learning-comparison">
                          <p>
                            {new Date(h.at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} ·{' '}
                            {h.reason}
                          </p>
                          <p>
                            {h.previous.name} · 이전 기한 {h.previous.dueDate || '미정'}{' '}
                            {h.previous.dueTime || ''}
                          </p>
                          <details>
                            <summary>이전 원문·상태 보기</summary>
                            <p className="next-study-answer">{h.previous.taskText}</p>
                            <p className="next-study-answer">{h.previous.note}</p>
                            <p>
                              {scheduleWorkSteps(h.previous)
                                .map(
                                  (step) =>
                                    `${workLabels[step]}: ${{ unknown: '미확인', 'not-done': '아직 하지 않음', done: '직접 확인한 완료' }[h.previous.states[step] || 'unknown']}`,
                                )
                                .join(' · ')}
                            </p>
                          </details>
                          <Button onClick={() => restore(s, s.history!.length - 1 - i)}>
                            이 기록으로 되돌리기
                          </Button>
                        </div>
                      ),
                    )}
                  </details>
                )}
              </Card>
            ))
          ) : (
            <EmptyState
              title="확인할 일정을 골라 주세요"
              message="목록에서 일정을 선택하면 원문과 상태를 확인하고 수정할 수 있습니다."
            />
          )}
        </section>
      </div>
      <div className="schedule-support">
        {' '}
        <details>
          <summary>과목 공지 확인 기록</summary>
          <p>
            새 과제·강의가 있는지 과목 공지를 확인한 뒤 남겨 주세요. 기한을 모르면 미정으로 등록할
            수 있습니다.
          </p>
          <Select
            label="공지 확인한 과목"
            value={checkSubject}
            onChange={(e) => setCheckSubject(e.target.value)}
          >
            <option value="">과목 선택</option>
            {data.subjects
              .filter((s) => !s.deletedAt)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </Select>
          <Button
            disabled={!checkSubject || disabled}
            onClick={() => {
              if (checkSubject) onCheck(checkSubject);
            }}
          >
            공지 확인했어요
          </Button>
          <p className="muted">
            공지 확인은 과제 제출·출석 인정·새 과제 없음의 확인을 뜻하지 않습니다.
          </p>
          {data.subjects
            .filter((s) => !s.deletedAt)
            .map((s) => {
              const latest = checks?.filter((c) => c.subjectId === s.id).at(-1);
              return (
                latest && (
                  <p key={s.id}>
                    {s.name} · 마지막 공지 확인{' '}
                    {new Date(latest.at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
                  </p>
                )
              );
            })}
        </details>
        <ScheduleNotifications
          data={data}
          schedules={schedules}
          port={notifications}
          disabled={disabled}
        />
      </div>
    </section>
  );
}
