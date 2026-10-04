# src/ui/schedule-dashboard.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-95dc00031a00

**ScheduleDashboard** · [src/ui/schedule-dashboard.tsx:11](../../../src/ui/schedule-dashboard.tsx#L11)

분기 조건과 가능한 갈림길:

- B-a451f5c6bf18 · ConditionalExpression · selected → truthy / falsy; 바깥 조건: 별도 조건식 없음 (17행).
- B-e7c8e3fcea82 · ConditionalExpression · view.kind==='unknown' → truthy / falsy; 바깥 조건: truthy: !shown.length (34행).
- B-d79ad68dd0c8 · ConditionalExpression · view.status==='trash' → truthy / falsy; 바깥 조건: truthy: !shown.length ∧ falsy: view.kind==='unknown' (34행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | useState(()=>new Date().toISOString())<br>call<br>전달 콜백: H-bcf19af965d2 |
| 12행 | 별도 조건식 없음 | useState(()=>readScheduleView(data,koreanDay().slice(0,7)))<br>call<br>전달 콜백: H-42aaccc3a07e |
| 12행 | 별도 조건식 없음 | useState('')<br>call |
| 12행 | 별도 조건식 없음 | useState(20)<br>call |
| 12행 | 별도 조건식 없음 | useState('')<br>call |
| 12행 | 별도 조건식 없음 | useState('')<br>call |
| 13행 | 별도 조건식 없음 | useEffect(()=>{const tick=()=>setNow(new Date().toISOString()),timer=window.setInterval(tick,60000);window.addEventListener('focus',tick);document.addEventListener('visibilitychange',tick);return()=>{window.clearInterval(timer);window.removeEventListener('focus',tick);document.removeEventListener('visibilitychange',tick);};}, [])<br>call<br>전달 콜백: H-d7325e15b072 |
| 14행 | 별도 조건식 없음 | koreanDay(now)<br>call |
| 14행 | 별도 조건식 없음 | schedules.filter(schedulePending)<br>call |
| 14행 | 별도 조건식 없음 | active.filter(s=>deadlinePending(s)&&s.dueDate&&Date.parse(scheduleDeadline(s)!)<Date.parse(now))<br>call<br>전달 콜백: H-5060026be350 |
| 14행 | 별도 조건식 없음 | active.filter(s=>!s.dueDate)<br>call<br>전달 콜백: H-67303c58db49 |
| 14행 | 별도 조건식 없음 | active.filter(s=>deadlinePending(s)&&s.dueDate>=today&&s.dueDate<=addDays(today,7))<br>call<br>전달 콜백: H-a802d5445e20 |
| 16행 | 별도 조건식 없음 | orderSchedules(schedules.filter(s=>(view.status==='trash'?!!s.deletedAt:!s.deletedAt&&s.status===view.status)&&(view.kind==='all'\|\|view.kind==='unknown'&&!s.dueDate\|\|view.kind===s.kind)&&(!view.query\|\|[s.name,s.note,s.taskText,data.subjects.find(sub=>sub.id===s.subjectId)?.name].some(v=>v?.toLocaleLowerCase().includes(view.query.toLocaleLowerCase())))))<br>call |
| 16행 | 별도 조건식 없음 | schedules.filter(s=>(view.status==='trash'?!!s.deletedAt:!s.deletedAt&&s.status===view.status)&&(view.kind==='all'\|\|view.kind==='unknown'&&!s.dueDate\|\|view.kind===s.kind)&&(!view.query\|\|[s.name,s.note,s.taskText,data.subjects.find(sub=>sub.id===s.subjectId)?.name].some(v=>v?.toLocaleLowerCase().includes(view.query.toLocaleLowerCase()))))<br>call<br>전달 콜백: H-c0f7dc60c938 |
| 17행 | truthy: selected | filtered.filter(s=>s.dueDate===selected\|\|!s.dueDate&&s.reviewDate===selected)<br>call<br>전달 콜백: H-2127e573cf25 |
| 22행 | 별도 조건식 없음 | schedules.filter(s=>!s.deletedAt&&s.states.watch==='done')<br>call<br>전달 콜백: H-c773c5d3ea98 |
| 22행 | 별도 조건식 없음 | schedules.filter(s=>!s.deletedAt&&s.states.learn==='done')<br>call<br>전달 콜백: H-c0ef92994fea |
| 22행 | 별도 조건식 없음 | schedules.filter(s=>!s.deletedAt&&s.states.notes==='done')<br>call<br>전달 콜백: H-dc8bcc4ef9bd |
| 22행 | 별도 조건식 없음 | schedules.filter(s=>!s.deletedAt&&s.states.attendance==='done')<br>call<br>전달 콜백: H-387b8b381265 |
| 24행 | 별도 조건식 없음 | data.subjects.filter(s=>!s.deletedAt).map(s=><option key={s.id} value={s.id}>{s.name}</option>)<br>mutation-request<br>전달 콜백: H-e5619b1dd26a |
| 24행 | 별도 조건식 없음 | data.subjects.filter(s=>!s.deletedAt)<br>call<br>전달 콜백: H-649609fa48f1 |
| 24행 | 별도 조건식 없음 | data.subjects.filter(s=>!s.deletedAt).map(s=>{const latest=checks?.filter(c=>c.subjectId===s.id).at(-1);return latest&&<p key={s.id}>{s.name} · 마지막 공지 확인 {new Date(latest.at).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})}</p>;})<br>mutation-request<br>전달 콜백: H-237194342cd3 |
| 24행 | 별도 조건식 없음 | data.subjects.filter(s=>!s.deletedAt)<br>call<br>전달 콜백: H-abf2ab0ca2c7 |
| 26행 | 별도 조건식 없음 | Object.entries(scheduleLabels).map(([id,label])=><option key={id} value={id}>{label}</option>)<br>call<br>전달 콜백: H-d25222af991a |
| 26행 | 별도 조건식 없음 | Object.entries(scheduleLabels)<br>call |
| 29행 | truthy: view.view==='calendar' | ['일','월','화','수','목','금','토'].map(day=><span key={day} className="schedule-weekday">{day}</span>)<br>call<br>전달 콜백: H-ed52e4c51485 |
| 30행 | truthy: view.view==='calendar' | monthDays(view.month).map(day=>{const rows=filtered.filter(s=>s.dueDate===day\|\|!s.dueDate&&s.reviewDate===day);return <button type="button" key={day} className="schedule-day" data-outside={!day.startsWith(view.month)} aria-pressed={selected===day} aria-current={day===today?'date':undefined} aria-label={`${day} · 일정 ${rows.length}개`} onClick={()=>{setSelected(selected===day?'':day);setLimit(20);}}><span>{Number(day.slice(-2))}</span><span className="schedule-day-count">{rows.length?`${rows.length}개`:''}</span></button>;})<br>call<br>전달 콜백: H-762bee8eace9 |
| 30행 | truthy: view.view==='calendar' | monthDays(view.month)<br>call |
| 35행 | 별도 조건식 없음 | shown.slice(0,limit).map(s=><Card key={s.id}> <p className="muted">{scheduleLabels[s.kind]} · {data.subjects.find(sub=>sub.id===s.subjectId)?.name}{s.week?` · ${s.week}주차`:''}</p><h3>{s.name}</h3> <p>{s.dueDate\|\|'기한 미정'}{s.dueTime?` ${s.dueTime}`:''} · {remainingTime(s,now)} · {({exam:'시험일',submission:'제출 기한',attendance:'출석 기한',personal:'개인 목표',unknown:'기한 의미 미정'})[s.dueMeaning]}{s.weight!==null?` · 비중 ${Math.round(s.weight*100)}%`:''}</p> {s.opensDate&&<p className="muted">시작 가능: {s.opensDate}{s.opensTime?` ${s.opensTime}`:''}</p>} {!s.dueDate&&<p className="muted">공지 확인일: {s.reviewDate\|\|'미정'}{s.reviewDate&&s.reviewDate<=today?' · 공지에서 기한을 확인해 주세요.':''}</p>} {s.taskText&&<p className="next-study-answer">해야 할 일: {s. … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-9e33f5a94557 |
| 35행 | 별도 조건식 없음 | shown.slice(0, limit)<br>call |

반환/조기 중단: 19행 <render> [별도 조건식 없음]

## H-bcf19af965d2

**@callback:useState** · [src/ui/schedule-dashboard.tsx:12](../../../src/ui/schedule-dashboard.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | new Date().toISOString()<br>call |

## H-42aaccc3a07e

**@callback:useState** · [src/ui/schedule-dashboard.tsx:12](../../../src/ui/schedule-dashboard.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | readScheduleView(data, koreanDay().slice(0,7))<br>call |
| 12행 | 별도 조건식 없음 | koreanDay().slice(0, 7)<br>call |
| 12행 | 별도 조건식 없음 | koreanDay()<br>call |

## H-d7325e15b072

**@callback:useEffect** · [src/ui/schedule-dashboard.tsx:13](../../../src/ui/schedule-dashboard.tsx#L13)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | 별도 조건식 없음 | window.setInterval(tick, 60000)<br>call<br>전달 콜백: H-d7f27c6460a0 |
| 13행 | 별도 조건식 없음 | window.addEventListener('focus', tick)<br>call<br>전달 콜백: H-d7f27c6460a0 |
| 13행 | 별도 조건식 없음 | document.addEventListener('visibilitychange', tick)<br>call<br>전달 콜백: H-d7f27c6460a0 |

반환/조기 중단: 13행 ()=>{window.clearInterval(timer);window.removeEventListener('focus',tick);document.removeEventListener('visibilitychange',tick);} [별도 조건식 없음]

## H-d7f27c6460a0

**tick** · [src/ui/schedule-dashboard.tsx:13](../../../src/ui/schedule-dashboard.tsx#L13)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | 별도 조건식 없음 | setNow(new Date().toISOString())<br>state-update |
| 13행 | 별도 조건식 없음 | new Date().toISOString()<br>call |

## H-5060026be350

**@callback:active.filter** · [src/ui/schedule-dashboard.tsx:14](../../../src/ui/schedule-dashboard.tsx#L14)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 14행 | 별도 조건식 없음 | deadlinePending(s)<br>call |
| 14행 | truthy: deadlinePending(s)&&s.dueDate | Date.parse(scheduleDeadline(s)!)<br>call |
| 14행 | truthy: deadlinePending(s)&&s.dueDate | scheduleDeadline(s)<br>call |
| 14행 | truthy: deadlinePending(s)&&s.dueDate | Date.parse(now)<br>call |

## H-67303c58db49

**@callback:active.filter** · [src/ui/schedule-dashboard.tsx:14](../../../src/ui/schedule-dashboard.tsx#L14)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a802d5445e20

**@callback:active.filter** · [src/ui/schedule-dashboard.tsx:14](../../../src/ui/schedule-dashboard.tsx#L14)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 14행 | 별도 조건식 없음 | deadlinePending(s)<br>call |
| 14행 | truthy: deadlinePending(s)&&s.dueDate>=today | addDays(today, 7)<br>call |

## H-30ea0027cd6f

**patchView** · [src/ui/schedule-dashboard.tsx:15](../../../src/ui/schedule-dashboard.tsx#L15)

분기 조건과 가능한 갈림길:

- B-b4564350df37 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (15행).
- B-484294823193 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (15행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 15행 | 별도 조건식 없음 | setView(next)<br>state-update |
| 15행 | 별도 조건식 없음 | setLimit(20)<br>state-update |
| 15행 | 별도 조건식 없음 | setSelected('')<br>state-update |
| 15행 | 별도 조건식 없음 | saveScheduleView(data, next)<br>call |
| 15행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 15행 | exception: exception | setNotice('보기 설정을 이 기기에 저장하지 못했습니다. 일정 원문은 유지됩니다.')<br>state-update |

## H-c0f7dc60c938

**@callback:schedules.filter** · [src/ui/schedule-dashboard.tsx:16](../../../src/ui/schedule-dashboard.tsx#L16)

분기 조건과 가능한 갈림길:

- B-e0ab40695bff · ConditionalExpression · view.status==='trash' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (16행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | truthy: (view.status==='trash'?!!s.deletedAt:!s.deletedAt&&s.status===view.status)&&(view.kind==='all'\|\|view.kind==='unknown'&&!s.dueDate\|\|view.kind===s.kind) ∧ falsy: !view.query | [s.name,s.note,s.taskText,data.subjects.find(sub=>sub.id===s.subjectId)?.name].some(v=>v?.toLocaleLowerCase().includes(view.query.toLocaleLowerCase()))<br>call<br>전달 콜백: H-74bb802cce5f |
| 16행 | truthy: (view.status==='trash'?!!s.deletedAt:!s.deletedAt&&s.status===view.status)&&(view.kind==='all'\|\|view.kind==='unknown'&&!s.dueDate\|\|view.kind===s.kind) ∧ falsy: !view.query | data.subjects.find(sub=>sub.id===s.subjectId)<br>call<br>전달 콜백: H-8906b821ccf9 |

## H-8906b821ccf9

**@callback:data.subjects.find** · [src/ui/schedule-dashboard.tsx:16](../../../src/ui/schedule-dashboard.tsx#L16)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-74bb802cce5f

**@callback:[s.name,s.note,s.taskText,data.subjects.find(sub=>sub.id===s.subjectId)?.name].some** · [src/ui/schedule-dashboard.tsx:16](../../../src/ui/schedule-dashboard.tsx#L16)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | truthy: (view.status==='trash'?!!s.deletedAt:!s.deletedAt&&s.status===view.status)&&(view.kind==='all'\|\|view.kind==='unknown'&&!s.dueDate\|\|view.kind===s.kind) ∧ falsy: !view.query | view.query.toLocaleLowerCase()<br>call |

## H-2127e573cf25

**@callback:filtered.filter** · [src/ui/schedule-dashboard.tsx:17](../../../src/ui/schedule-dashboard.tsx#L17)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0b08f5b8d23d

**monthChange** · [src/ui/schedule-dashboard.tsx:18](../../../src/ui/schedule-dashboard.tsx#L18)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 18행 | 별도 조건식 없음 | date.setUTCMonth(date.getUTCMonth()+offset)<br>call |
| 18행 | 별도 조건식 없음 | date.getUTCMonth()<br>call |
| 18행 | 별도 조건식 없음 | patchView({month:date.toISOString().slice(0,7)})<br>call → [H-30ea0027cd6f](ui__schedule-dashboard.md#h-30ea0027cd6f) |
| 18행 | 별도 조건식 없음 | date.toISOString().slice(0, 7)<br>call |
| 18행 | 별도 조건식 없음 | date.toISOString()<br>call |

## H-c773c5d3ea98

**@callback:schedules.filter** · [src/ui/schedule-dashboard.tsx:22](../../../src/ui/schedule-dashboard.tsx#L22)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c0ef92994fea

**@callback:schedules.filter** · [src/ui/schedule-dashboard.tsx:22](../../../src/ui/schedule-dashboard.tsx#L22)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-dc8bcc4ef9bd

**@callback:schedules.filter** · [src/ui/schedule-dashboard.tsx:22](../../../src/ui/schedule-dashboard.tsx#L22)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-387b8b381265

**@callback:schedules.filter** · [src/ui/schedule-dashboard.tsx:22](../../../src/ui/schedule-dashboard.tsx#L22)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d7a0b3659ef1

**@onClick** · [src/ui/schedule-dashboard.tsx:23](../../../src/ui/schedule-dashboard.tsx#L23)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | 별도 조건식 없음 | create('assignment')<br>call |

## H-59ac481dc5a1

**@onClick** · [src/ui/schedule-dashboard.tsx:23](../../../src/ui/schedule-dashboard.tsx#L23)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | 별도 조건식 없음 | create('lecture')<br>call |

## H-5faedc65ea6c

**@onClick** · [src/ui/schedule-dashboard.tsx:23](../../../src/ui/schedule-dashboard.tsx#L23)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | 별도 조건식 없음 | create('class')<br>call |

## H-a281fbef0748

**@onClick** · [src/ui/schedule-dashboard.tsx:23](../../../src/ui/schedule-dashboard.tsx#L23)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | 별도 조건식 없음 | create()<br>call |

## H-8134e2bf2d39

**@onChange** · [src/ui/schedule-dashboard.tsx:24](../../../src/ui/schedule-dashboard.tsx#L24)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | 별도 조건식 없음 | setCheckSubject(e.target.value)<br>state-update |

## H-649609fa48f1

**@callback:data.subjects.filter** · [src/ui/schedule-dashboard.tsx:24](../../../src/ui/schedule-dashboard.tsx#L24)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e5619b1dd26a

**@callback:data.subjects.filter(s=>!s.deletedAt).map** · [src/ui/schedule-dashboard.tsx:24](../../../src/ui/schedule-dashboard.tsx#L24)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-47e3a5c72bfe

**@onClick** · [src/ui/schedule-dashboard.tsx:24](../../../src/ui/schedule-dashboard.tsx#L24)

분기 조건과 가능한 갈림길:

- B-251ae55b56c3 · IfStatement · checkSubject → truthy / falsy; 바깥 조건: 별도 조건식 없음 (24행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | truthy: checkSubject | onCheck(checkSubject)<br>call |

## H-abf2ab0ca2c7

**@callback:data.subjects.filter** · [src/ui/schedule-dashboard.tsx:24](../../../src/ui/schedule-dashboard.tsx#L24)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-237194342cd3

**@callback:data.subjects.filter(s=>!s.deletedAt).map** · [src/ui/schedule-dashboard.tsx:24](../../../src/ui/schedule-dashboard.tsx#L24)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | truthy: latest | new Date(latest.at).toLocaleString('ko-KR', {timeZone:'Asia/Seoul'})<br>call |

반환/조기 중단: 24행 latest&&<p key={s.id}>{s.name} · 마지막 공지 확인 {new Date(latest.at).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})}</p> [별도 조건식 없음]

## H-71f48910d3ac

**@onChange** · [src/ui/schedule-dashboard.tsx:26](../../../src/ui/schedule-dashboard.tsx#L26)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 26행 | 별도 조건식 없음 | patchView({query:e.target.value})<br>call → [H-30ea0027cd6f](ui__schedule-dashboard.md#h-30ea0027cd6f) |

## H-bec98a91684e

**@onChange** · [src/ui/schedule-dashboard.tsx:26](../../../src/ui/schedule-dashboard.tsx#L26)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 26행 | 별도 조건식 없음 | patchView({kind:e.target.value})<br>call → [H-30ea0027cd6f](ui__schedule-dashboard.md#h-30ea0027cd6f) |

## H-d25222af991a

**@callback:Object.entries(scheduleLabels).map** · [src/ui/schedule-dashboard.tsx:26](../../../src/ui/schedule-dashboard.tsx#L26)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-91998b0159fd

**@onChange** · [src/ui/schedule-dashboard.tsx:26](../../../src/ui/schedule-dashboard.tsx#L26)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 26행 | 별도 조건식 없음 | patchView({status:e.target.value as ScheduleView['status']})<br>call → [H-30ea0027cd6f](ui__schedule-dashboard.md#h-30ea0027cd6f) |

## H-fd2306df8d8d

**@onClick** · [src/ui/schedule-dashboard.tsx:27](../../../src/ui/schedule-dashboard.tsx#L27)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 27행 | 별도 조건식 없음 | patchView({view:'list'})<br>call → [H-30ea0027cd6f](ui__schedule-dashboard.md#h-30ea0027cd6f) |

## H-a1a04fe9270b

**@onClick** · [src/ui/schedule-dashboard.tsx:27](../../../src/ui/schedule-dashboard.tsx#L27)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 27행 | 별도 조건식 없음 | patchView({view:'calendar'})<br>call → [H-30ea0027cd6f](ui__schedule-dashboard.md#h-30ea0027cd6f) |

## H-7dc902df634e

**@onClick** · [src/ui/schedule-dashboard.tsx:27](../../../src/ui/schedule-dashboard.tsx#L27)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 27행 | 별도 조건식 없음 | downloadCalendar(calendarFile(schedules,now,`${data.namespace}-${data.userId}`))<br>call |
| 27행 | 별도 조건식 없음 | calendarFile(schedules, now, `${data.namespace}-${data.userId}`)<br>call |
| 27행 | 별도 조건식 없음 | setNotice('현재 일정을 캘린더 파일로 저장했습니다. 파일을 추가한 캘린더에서 알림 설정을 확인해 주세요. 일정이 바뀌면 다시 내보내야 합니다.')<br>state-update |

## H-39b77d70210e

**@onClick** · [src/ui/schedule-dashboard.tsx:28](../../../src/ui/schedule-dashboard.tsx#L28)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 28행 | truthy: view.view==='calendar' | monthChange(-1)<br>call → [H-0b08f5b8d23d](ui__schedule-dashboard.md#h-0b08f5b8d23d) |

## H-9f5fbaf79fe1

**@onInput** · [src/ui/schedule-dashboard.tsx:28](../../../src/ui/schedule-dashboard.tsx#L28)

분기 조건과 가능한 갈림길:

- B-51b84089f134 · IfStatement · e.currentTarget.value → truthy / falsy; 바깥 조건: truthy: view.view==='calendar' (28행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 28행 | truthy: view.view==='calendar' ∧ truthy: e.currentTarget.value | patchView({month:e.currentTarget.value})<br>call → [H-30ea0027cd6f](ui__schedule-dashboard.md#h-30ea0027cd6f) |

## H-8b0eb0b899ff

**@onChange** · [src/ui/schedule-dashboard.tsx:28](../../../src/ui/schedule-dashboard.tsx#L28)

분기 조건과 가능한 갈림길:

- B-4f2af25084e2 · IfStatement · e.target.value → truthy / falsy; 바깥 조건: truthy: view.view==='calendar' (28행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 28행 | truthy: view.view==='calendar' ∧ truthy: e.target.value | patchView({month:e.target.value})<br>call → [H-30ea0027cd6f](ui__schedule-dashboard.md#h-30ea0027cd6f) |

## H-0b7756d35484

**@onClick** · [src/ui/schedule-dashboard.tsx:28](../../../src/ui/schedule-dashboard.tsx#L28)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 28행 | truthy: view.view==='calendar' | monthChange(1)<br>call → [H-0b08f5b8d23d](ui__schedule-dashboard.md#h-0b08f5b8d23d) |

## H-2c925fd4e12e

**@onClick** · [src/ui/schedule-dashboard.tsx:28](../../../src/ui/schedule-dashboard.tsx#L28)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 28행 | truthy: view.view==='calendar' | patchView({month:today.slice(0,7)})<br>call → [H-30ea0027cd6f](ui__schedule-dashboard.md#h-30ea0027cd6f) |
| 28행 | truthy: view.view==='calendar' | today.slice(0, 7)<br>call |

## H-ed52e4c51485

**@callback:['일','월','화','수','목','금','토'].map** · [src/ui/schedule-dashboard.tsx:29](../../../src/ui/schedule-dashboard.tsx#L29)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-762bee8eace9

**@callback:monthDays(view.month).map** · [src/ui/schedule-dashboard.tsx:30](../../../src/ui/schedule-dashboard.tsx#L30)

분기 조건과 가능한 갈림길:

- B-828444f04a73 · ConditionalExpression · day===today → truthy / falsy; 바깥 조건: truthy: view.view==='calendar' (30행).
- B-722083b7bdee · ConditionalExpression · rows.length → truthy / falsy; 바깥 조건: truthy: view.view==='calendar' (30행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 30행 | truthy: view.view==='calendar' | filtered.filter(s=>s.dueDate===day\|\|!s.dueDate&&s.reviewDate===day)<br>call<br>전달 콜백: H-e3d12d185918 |
| 30행 | truthy: view.view==='calendar' | day.startsWith(view.month)<br>call |
| 30행 | truthy: view.view==='calendar' | Number(day.slice(-2))<br>call |
| 30행 | truthy: view.view==='calendar' | day.slice(-2)<br>call |

반환/조기 중단: 30행 <render> [truthy: view.view==='calendar']

## H-e3d12d185918

**@callback:filtered.filter** · [src/ui/schedule-dashboard.tsx:30](../../../src/ui/schedule-dashboard.tsx#L30)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b491878467a7

**@onClick** · [src/ui/schedule-dashboard.tsx:30](../../../src/ui/schedule-dashboard.tsx#L30)

분기 조건과 가능한 갈림길:

- B-ed399684b7ab · ConditionalExpression · selected===day → truthy / falsy; 바깥 조건: truthy: view.view==='calendar' (30행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 30행 | truthy: view.view==='calendar' | setSelected(selected===day?'':day)<br>state-update |
| 30행 | truthy: view.view==='calendar' | setLimit(20)<br>state-update |

## H-2712dfe1c022

**@onClick** · [src/ui/schedule-dashboard.tsx:31](../../../src/ui/schedule-dashboard.tsx#L31)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 31행 | truthy: view.view==='calendar' ∧ truthy: selected | setSelected('')<br>state-update |

## H-9e33f5a94557

**@callback:shown.slice(0,limit).map** · [src/ui/schedule-dashboard.tsx:35](../../../src/ui/schedule-dashboard.tsx#L35)

분기 조건과 가능한 갈림길:

- B-b1eb3ea75202 · ConditionalExpression · s.week → truthy / falsy; 바깥 조건: 별도 조건식 없음 (36행).
- B-bd5851fc77d0 · ConditionalExpression · s.dueTime → truthy / falsy; 바깥 조건: 별도 조건식 없음 (37행).
- B-90fc2c62cef6 · ConditionalExpression · s.weight!==null → truthy / falsy; 바깥 조건: 별도 조건식 없음 (37행).
- B-4ed63a488de7 · ConditionalExpression · s.opensTime → truthy / falsy; 바깥 조건: truthy: s.opensDate (38행).
- B-6d36eb4594f0 · ConditionalExpression · s.reviewDate&&s.reviewDate<=today → truthy / falsy; 바깥 조건: truthy: !s.dueDate (39행).
- B-8f60af88aa1a · ConditionalExpression · s.deletedAt → truthy / falsy; 바깥 조건: 별도 조건식 없음 (45행).
- B-9ebe71c1b2cb · ConditionalExpression · s.status==='active' → truthy / falsy; 바깥 조건: falsy: s.deletedAt (45행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 36행 | 별도 조건식 없음 | data.subjects.find(sub=>sub.id===s.subjectId)<br>call<br>전달 콜백: H-1a1dff9b9414 |
| 37행 | 별도 조건식 없음 | remainingTime(s, now)<br>call |
| 37행 | truthy: s.weight!==null | Math.round(s.weight*100)<br>call |
| 42행 | truthy: !s.deletedAt | scheduleWorkSteps(s).map(step=><Select key={step} label={`${s.name}${s.week?` · ${s.week}주차`:''} · ${workLabels[step]}`} value={s.states[step]??'unknown'} onChange={e=>update(s,{states:{...s.states,[step]:e.target.value as 'unknown'\|'done'\|'not-done'}},`${workLabels[step]} 상태 수정`)}><option value="unknown">미확인</option><option value="not-done">아직 하지 않음</option><option value="done">직접 확인한 완료</option></Select>)<br>call<br>전달 콜백: H-b14e9c913e0d |
| 42행 | truthy: !s.deletedAt | scheduleWorkSteps(s)<br>call |
| 43행 | truthy: s.targetIds.length>0 | s.targetIds.map(id=>data.nodes.find(n=>n.id===id)?.name??id).join(', ')<br>call |
| 43행 | truthy: s.targetIds.length>0 | s.targetIds.map(id=>data.nodes.find(n=>n.id===id)?.name??id)<br>call<br>전달 콜백: H-2322f9502f27 |
| 44행 | 별도 조건식 없음 | ["exam","quiz"].includes(s.kind)<br>call |
| 44행 | truthy: ["exam","quiz"].includes(s.kind) | s.targetIds.some(id=>!goals?.some(g=>g.targetId===id))<br>call<br>전달 콜백: H-dc06e5627049 |
| 46행 | truthy: !!s.history?.length | occurrenceRows(s.history.slice().reverse(), h => JSON.stringify(h)).map(({value: h,index:i,key})=><div key={key} className="learning-comparison"><p>{new Date(h.at).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})} · {h.reason}</p><p>{h.previous.name} · 이전 기한 {h.previous.dueDate\|\|'미정'} {h.previous.dueTime\|\|''}</p><details><summary>이전 원문·상태 보기</summary><p className="next-study-answer">{h.previous.taskText}</p><p className="next-study-answer">{h.previous.note}</p><p>{scheduleWorkSteps(h.previous).map(step=>`${workLabels[step]}: ${{unknown:'미확인','not-done':'아직 하지 않음',done:'직접 확인한 완료'}[h.previous.states[step]\|\|'unknown']}`).join(' · ')}</p></details><Button onClick={()=>restore(s,s.history!.length-1-i)}>이 기록으로 되돌리기</Button></div>)<br>navigation<br>전달 콜백: H-16232e2571d5 |
| 46행 | truthy: !!s.history?.length | occurrenceRows(s.history.slice().reverse(), h => JSON.stringify(h))<br>call<br>전달 콜백: H-38a409c70916 |
| 46행 | truthy: !!s.history?.length | s.history.slice().reverse()<br>navigation |
| 46행 | truthy: !!s.history?.length | s.history.slice()<br>navigation |

## H-1a1dff9b9414

**@callback:data.subjects.find** · [src/ui/schedule-dashboard.tsx:36](../../../src/ui/schedule-dashboard.tsx#L36)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b14e9c913e0d

**@callback:scheduleWorkSteps(s).map** · [src/ui/schedule-dashboard.tsx:42](../../../src/ui/schedule-dashboard.tsx#L42)

분기 조건과 가능한 갈림길:

- B-4f120aa2d665 · ConditionalExpression · s.week → truthy / falsy; 바깥 조건: truthy: !s.deletedAt (42행).

## H-0dd09d29497b

**@onChange** · [src/ui/schedule-dashboard.tsx:42](../../../src/ui/schedule-dashboard.tsx#L42)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 42행 | truthy: !s.deletedAt | update(s, {states:{...s.states,[step]:e.target.value as 'unknown'\|'done'\|'not-done'}}, `${workLabels[step]} 상태 수정`)<br>call |

## H-2322f9502f27

**@callback:s.targetIds.map** · [src/ui/schedule-dashboard.tsx:43](../../../src/ui/schedule-dashboard.tsx#L43)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 43행 | truthy: s.targetIds.length>0 | data.nodes.find(n=>n.id===id)<br>call<br>전달 콜백: H-b1b5ad55b9f6 |

## H-b1b5ad55b9f6

**@callback:data.nodes.find** · [src/ui/schedule-dashboard.tsx:43](../../../src/ui/schedule-dashboard.tsx#L43)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-dc06e5627049

**@callback:s.targetIds.some** · [src/ui/schedule-dashboard.tsx:44](../../../src/ui/schedule-dashboard.tsx#L44)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5e9a84262339

**@onClick** · [src/ui/schedule-dashboard.tsx:45](../../../src/ui/schedule-dashboard.tsx#L45)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 45행 | truthy: s.deletedAt | update(s, {deletedAt:null}, '휴지통에서 복원')<br>call |

## H-1589876c3e90

**@onClick** · [src/ui/schedule-dashboard.tsx:45](../../../src/ui/schedule-dashboard.tsx#L45)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 45행 | falsy: s.deletedAt | edit(s)<br>call |

## H-be0d223e6bf7

**@onClick** · [src/ui/schedule-dashboard.tsx:45](../../../src/ui/schedule-dashboard.tsx#L45)

분기 조건과 가능한 갈림길:

- B-6b9bb2cd8c10 · ConditionalExpression · s.status==='active' → truthy / falsy; 바깥 조건: falsy: s.deletedAt (45행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 45행 | falsy: s.deletedAt | update(s, {status:s.status==='active'?'ended':'active'}, '보관 상태 수정')<br>call |

## H-10123636c844

**@onClick** · [src/ui/schedule-dashboard.tsx:45](../../../src/ui/schedule-dashboard.tsx#L45)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 45행 | falsy: s.deletedAt | update(s, {deletedAt:now}, '휴지통으로 이동')<br>call |

## H-c96595bace35

**@onClick** · [src/ui/schedule-dashboard.tsx:45](../../../src/ui/schedule-dashboard.tsx#L45)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 45행 | truthy: !!s.history?.length | restore(s, s.history!.length-1)<br>call |

## H-38a409c70916

**@callback:occurrenceRows** · [src/ui/schedule-dashboard.tsx:46](../../../src/ui/schedule-dashboard.tsx#L46)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 46행 | truthy: !!s.history?.length | JSON.stringify(h)<br>call |

## H-16232e2571d5

**@callback:occurrenceRows(s.history.slice().reverse(), h => JSON.stringify(h)).map** · [src/ui/schedule-dashboard.tsx:46](../../../src/ui/schedule-dashboard.tsx#L46)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 46행 | truthy: !!s.history?.length | new Date(h.at).toLocaleString('ko-KR', {timeZone:'Asia/Seoul'})<br>call |
| 46행 | truthy: !!s.history?.length | scheduleWorkSteps(h.previous).map(step=>`${workLabels[step]}: ${{unknown:'미확인','not-done':'아직 하지 않음',done:'직접 확인한 완료'}[h.previous.states[step]\|\|'unknown']}`).join(' · ')<br>call |
| 46행 | truthy: !!s.history?.length | scheduleWorkSteps(h.previous).map(step=>`${workLabels[step]}: ${{unknown:'미확인','not-done':'아직 하지 않음',done:'직접 확인한 완료'}[h.previous.states[step]\|\|'unknown']}`)<br>call<br>전달 콜백: H-26f9db36e60a |
| 46행 | truthy: !!s.history?.length | scheduleWorkSteps(h.previous)<br>call |

## H-26f9db36e60a

**@callback:scheduleWorkSteps(h.previous).map** · [src/ui/schedule-dashboard.tsx:46](../../../src/ui/schedule-dashboard.tsx#L46)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e46421c4d6be

**@onClick** · [src/ui/schedule-dashboard.tsx:46](../../../src/ui/schedule-dashboard.tsx#L46)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 46행 | truthy: !!s.history?.length | restore(s, s.history!.length-1-i)<br>call |

## H-dee475a253c9

**@onClick** · [src/ui/schedule-dashboard.tsx:48](../../../src/ui/schedule-dashboard.tsx#L48)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 48행 | truthy: shown.length>limit | setLimit(v=>v+20)<br>state-update<br>전달 콜백: H-2d9219ab86d4 |

## H-2d9219ab86d4

**@callback:setLimit** · [src/ui/schedule-dashboard.tsx:48](../../../src/ui/schedule-dashboard.tsx#L48)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

