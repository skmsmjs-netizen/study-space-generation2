# src/ui/week-overview.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-b69f04c6d5b6

**WeekOverview** · [src/ui/week-overview.tsx:9](../../../src/ui/week-overview.tsx#L9)

분기 조건과 가능한 갈림길:

- B-f84d502edb58 · ConditionalExpression · expanded → truthy / falsy; 바깥 조건: 별도 조건식 없음 (26행).
- B-3a429bba1c9c · ConditionalExpression · search → truthy / falsy; 바깥 조건: truthy: !upcoming.length (27행).
- B-e9d2c8376406 · ConditionalExpression · expanded → truthy / falsy; 바깥 조건: truthy: upcoming.length > 6 (28행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 10행 | 별도 조건식 없음 | useState('')<br>call |
| 10행 | 별도 조건식 없음 | useState(false)<br>call |
| 11행 | 별도 조건식 없음 | useState(6)<br>call |
| 11행 | 별도 조건식 없음 | useState(6)<br>call |
| 12행 | 별도 조건식 없음 | schedules.filter(s => subjectIds.includes(s.subjectId) && data.subjects.some(p => p.id === s.subjectId && !p.deletedAt && p.userId === data.userId && p.namespace === data.namespace))<br>call<br>전달 콜백: H-3050a707d224 |
| 13행 | 별도 조건식 없음 | weekSchedules(scoped, at)<br>call |
| 20행 | 별도 조건식 없음 | filter(week.upcoming)<br>call → [H-10932bb88d43](ui__week-overview.md#h-10932bb88d43) |
| 21행 | 별도 조건식 없음 | filter(week.overdue)<br>call → [H-10932bb88d43](ui__week-overview.md#h-10932bb88d43) |
| 21행 | 별도 조건식 없음 | filter(week.unknown)<br>call → [H-10932bb88d43](ui__week-overview.md#h-10932bb88d43) |
| 26행 | 별도 조건식 없음 | render(expanded ? upcoming : upcoming.slice(0, 6))<br>call → [H-31ada173fae9](ui__week-overview.md#h-31ada173fae9) |
| 26행 | falsy: expanded | upcoming.slice(0, 6)<br>call |
| 29행 | 별도 조건식 없음 | render(overdue.slice(0, overdueLimit))<br>call → [H-31ada173fae9](ui__week-overview.md#h-31ada173fae9) |
| 29행 | 별도 조건식 없음 | overdue.slice(0, overdueLimit)<br>call |
| 30행 | 별도 조건식 없음 | render(unknown.slice(0, unknownLimit))<br>call → [H-31ada173fae9](ui__week-overview.md#h-31ada173fae9) |
| 30행 | 별도 조건식 없음 | unknown.slice(0, unknownLimit)<br>call |

반환/조기 중단: 22행 <render> [별도 조건식 없음]

## H-3050a707d224

**@callback:schedules.filter** · [src/ui/week-overview.tsx:12](../../../src/ui/week-overview.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | subjectIds.includes(s.subjectId)<br>call |
| 12행 | truthy: subjectIds.includes(s.subjectId) | data.subjects.some(p => p.id === s.subjectId && !p.deletedAt && p.userId === data.userId && p.namespace === data.namespace)<br>call<br>전달 콜백: H-de569b474a00 |

## H-de569b474a00

**@callback:data.subjects.some** · [src/ui/week-overview.tsx:12](../../../src/ui/week-overview.tsx#L12)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-10932bb88d43

**filter** · [src/ui/week-overview.tsx:14](../../../src/ui/week-overview.tsx#L14)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 14행 | 별도 조건식 없음 | rows.filter(s => `${s.name} ${data.subjects.find(p => p.id === s.subjectId)?.name ?? ''}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()))<br>call<br>전달 콜백: H-bc0bcda0bc67 |

## H-bc0bcda0bc67

**@callback:rows.filter** · [src/ui/week-overview.tsx:14](../../../src/ui/week-overview.tsx#L14)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 14행 | 별도 조건식 없음 | `${s.name} ${data.subjects.find(p => p.id === s.subjectId)?.name ?? ''}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())<br>call |
| 14행 | 별도 조건식 없음 | `${s.name} ${data.subjects.find(p => p.id === s.subjectId)?.name ?? ''}`.toLocaleLowerCase()<br>call |
| 14행 | 별도 조건식 없음 | data.subjects.find(p => p.id === s.subjectId)<br>call<br>전달 콜백: H-711b86dad37d |
| 14행 | 별도 조건식 없음 | search.toLocaleLowerCase()<br>call |

## H-711b86dad37d

**@callback:data.subjects.find** · [src/ui/week-overview.tsx:14](../../../src/ui/week-overview.tsx#L14)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-31ada173fae9

**render** · [src/ui/week-overview.tsx:15](../../../src/ui/week-overview.tsx#L15)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 15행 | 별도 조건식 없음 | rows.map(s => <article key={s.id} className="ui-card"> <p className="muted">{data.subjects.find(p => p.id === s.subjectId)?.name} · {scheduleLabels[s.kind]}</p> <h3>{s.name}</h3><p>{s.dueDate ? `기한 ${s.dueDate}${s.dueTime ? ` ${s.dueTime}` : ' · 시각 미정'}` : s.opensDate ? `시작 ${s.opensDate} · 기한 미정` : '기한 미정'}</p> <Button onClick={() => openLearningSchedules(s.id)}>일정 확인 · {s.name}</Button> </article>)<br>call<br>전달 콜백: H-ee55e9b9e349 |

## H-ee55e9b9e349

**@callback:rows.map** · [src/ui/week-overview.tsx:15](../../../src/ui/week-overview.tsx#L15)

분기 조건과 가능한 갈림길:

- B-e85d5029af95 · ConditionalExpression · s.dueDate → truthy / falsy; 바깥 조건: 별도 조건식 없음 (17행).
- B-ad0bf3b11e83 · ConditionalExpression · s.dueTime → truthy / falsy; 바깥 조건: truthy: s.dueDate (17행).
- B-5911e2c2c6b6 · ConditionalExpression · s.opensDate → truthy / falsy; 바깥 조건: falsy: s.dueDate (17행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | 별도 조건식 없음 | data.subjects.find(p => p.id === s.subjectId)<br>call<br>전달 콜백: H-e44f61a63e27 |

## H-e44f61a63e27

**@callback:data.subjects.find** · [src/ui/week-overview.tsx:16](../../../src/ui/week-overview.tsx#L16)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-89fdbc148eae

**@onClick** · [src/ui/week-overview.tsx:18](../../../src/ui/week-overview.tsx#L18)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 18행 | 별도 조건식 없음 | openLearningSchedules(s.id)<br>call |

## H-ee62c41eb3bf

**@onChange** · [src/ui/week-overview.tsx:25](../../../src/ui/week-overview.tsx#L25)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 25행 | truthy: scoped.length > 6 | setSearch(e.target.value)<br>state-update |
| 25행 | truthy: scoped.length > 6 | setExpanded(false)<br>state-update |
| 25행 | truthy: scoped.length > 6 | setOverdueLimit(6)<br>state-update |
| 25행 | truthy: scoped.length > 6 | setUnknownLimit(6)<br>state-update |

## H-56bf0d7b8ae6

**@onClick** · [src/ui/week-overview.tsx:28](../../../src/ui/week-overview.tsx#L28)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 28행 | truthy: upcoming.length > 6 | setExpanded(v => !v)<br>state-update<br>전달 콜백: H-53830ce5e9af |

## H-53830ce5e9af

**@callback:setExpanded** · [src/ui/week-overview.tsx:28](../../../src/ui/week-overview.tsx#L28)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bb94db255321

**@onClick** · [src/ui/week-overview.tsx:29](../../../src/ui/week-overview.tsx#L29)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 29행 | truthy: overdue.length > overdueLimit | setOverdueLimit(n => n + 20)<br>state-update<br>전달 콜백: H-bac22352cc2f |

## H-bac22352cc2f

**@callback:setOverdueLimit** · [src/ui/week-overview.tsx:29](../../../src/ui/week-overview.tsx#L29)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4da3cdf02caa

**@onClick** · [src/ui/week-overview.tsx:30](../../../src/ui/week-overview.tsx#L30)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 30행 | truthy: unknown.length > unknownLimit | setUnknownLimit(n => n + 20)<br>state-update<br>전달 콜백: H-ef57bd1a60e3 |

## H-ef57bd1a60e3

**@callback:setUnknownLimit** · [src/ui/week-overview.tsx:30](../../../src/ui/week-overview.tsx#L30)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

