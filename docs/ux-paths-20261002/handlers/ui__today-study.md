# src/ui/today-study.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-28deb4217d4c

**TodayStudy** · [src/ui/today-study.tsx:6](../../../src/ui/today-study.tsx#L6)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 7행 | 별도 조건식 없음 | todayStudy(data, workspace, subjectIds, at)<br>call |
| 10행 | truthy: !!choice.schedules.length | choice.schedules.slice(0,3).map(s => <li key={s.id}>{s.name} · {s.dueDate} <Button variant="quiet" className="schedule-navigation" onClick={() => openLearningSchedules()}>일정과 준비 상태 보기</Button></li>)<br>call<br>전달 콜백: H-89f8d092d05c |
| 10행 | truthy: !!choice.schedules.length | choice.schedules.slice(0, 3)<br>call |

반환/조기 중단: 8행 <render> [별도 조건식 없음]

## H-89f8d092d05c

**@callback:choice.schedules.slice(0,3).map** · [src/ui/today-study.tsx:10](../../../src/ui/today-study.tsx#L10)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-be1c79d80e2a

**@onClick** · [src/ui/today-study.tsx:10](../../../src/ui/today-study.tsx#L10)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 10행 | truthy: !!choice.schedules.length | openLearningSchedules()<br>call |

