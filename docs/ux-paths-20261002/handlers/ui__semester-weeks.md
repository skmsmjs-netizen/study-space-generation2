# src/ui/semester-weeks.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-c809515e9af6

**SubjectWeeks** · [src/ui/semester-weeks.tsx:11](../../../src/ui/semester-weeks.tsx#L11)

분기 조건과 가능한 갈림길:

- B-37e7c9d57635 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (12행).
- B-84c0f2f3b32f · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (17행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | 별도 조건식 없음 | readLearningPlan(data)<br>call |

반환/조기 중단: 14행 <render> [별도 조건식 없음]; 17행 <render> [exception: exception]

## H-de240f601613

**@onChange** · [src/ui/semester-weeks.tsx:16](../../../src/ui/semester-weeks.tsx#L16)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | 별도 조건식 없음 | validateRecommendations(next, data)<br>call |
| 16행 | 별도 조건식 없음 | onSaved(saveLearningPlan(repository, { ...next, revision: next.revision + 1 }, raw))<br>call |
| 16행 | 별도 조건식 없음 | saveLearningPlan(repository, { ...next, revision: next.revision + 1 }, raw)<br>call |

반환/조기 중단: 16행 true [별도 조건식 없음]

## H-4406cad48f95

**SemesterWeeksEditor** · [src/ui/semester-weeks.tsx:20](../../../src/ui/semester-weeks.tsx#L20)

분기 조건과 가능한 갈림길:

- B-8c787421bda3 · ConditionalExpression · blocked → truthy / falsy; 바깥 조건: truthy: open (74행).
- B-b4d643ed6734 · ConditionalExpression · draft.batch.reversed → truthy / falsy; 바깥 조건: truthy: open ∧ falsy: blocked ∧ truthy: draft.batch (97행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | 별도 조건식 없음 | data.subjects.filter(s => !s.deletedAt && s.userId === data.userId && s.namespace === data.namespace && subjectIds.includes(s.id))<br>call<br>전달 콜백: H-2edcf792ceb1 |
| 31행 | 별도 조건식 없음 | useState(() => { try { return { ...readWeeksDraft(data, scope), error: '' }; } catch (e) { return { raw: null, draft: null, error: (e as Error).message }; } })<br>call<br>전달 콜백: H-d919e89931e0 |
| 32행 | 별도 조건식 없음 | useState(boot.draft ?? initial)<br>call |
| 32행 | 별도 조건식 없음 | useRef(draft)<br>call |
| 32행 | 별도 조건식 없음 | useRef(boot.raw)<br>call |
| 33행 | 별도 조건식 없음 | useState(false)<br>call |
| 33행 | 별도 조건식 없음 | useState(boot.error)<br>call |
| 33행 | 별도 조건식 없음 | useState(Boolean(boot.error))<br>call |
| 33행 | 별도 조건식 없음 | Boolean(boot.error)<br>call |
| 33행 | 별도 조건식 없음 | useState('')<br>call |
| 45행 | 별도 조건식 없음 | weekSeries(draft.subjectId, draft.generatedStart)<br>call |
| 46행 | 별도 조건식 없음 | draft.rows.filter(r => !r.excluded && !weekDuplicate(existing, draft.subjectId, series, r))<br>preservation-boundary<br>전달 콜백: H-0f278ba678e8 |
| 75행 | truthy: open ∧ falsy: blocked ∧ truthy: !fixedSubjectId | Boolean(draft.rows.length)<br>call |
| 75행 | truthy: open ∧ falsy: blocked ∧ truthy: !fixedSubjectId | subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)<br>call<br>전달 콜백: H-1b8f6860f1af |
| 77행 | truthy: open ∧ falsy: blocked | Boolean(draft.rows.length)<br>call |
| 78행 | truthy: open ∧ falsy: blocked | Boolean(draft.rows.length)<br>call |
| 79행 | truthy: open ∧ falsy: blocked | Boolean(draft.rows.length)<br>call |
| 81행 | truthy: open ∧ falsy: blocked | Boolean(draft.rows.length)<br>call |
| 82행 | truthy: open ∧ falsy: blocked | Boolean(draft.rows.length)<br>call |
| 82행 | truthy: open ∧ falsy: blocked | Boolean(draft.rows.length)<br>call |
| 84행 | truthy: open ∧ falsy: blocked | draft.rows.map((row, index) => { const duplicate = weekDuplicate(existing, draft.subjectId, series, row); const edit = (p: Partial<typeof row>) => patch({ rows: current.current.rows.map((r, i) => i === index ? { ...r, ...p } : r) }); return <details key={row.week}><summary>{row.week}주차 · {row.opensDate}{row.excluded ? ' · 제외' : duplicate ? ` · ${duplicate.deletedAt ? '휴지통에 보관됨' : '이미 등록됨'}` : ''}</summary> <Checkbox label={`${row.week}주차 휴강·제외`} checked={row.excluded} onChange={e => edit({ excluded: e.target.checked })} /> <Input label={`${row.week}주차 이름`} value={row.name} onChange={e => edit({ name: e.target.value })} /> <Input label={`${row.week}주차 강의 날짜`} type="date" value={row.opensDate} onChange={e => … [전체 인수는 JSON·소스])<br>preservation-boundary<br>전달 콜백: H-947e9ccec3de |
| 96행 | truthy: open ∧ falsy: blocked | Boolean(draft.rows.length)<br>call |

반환/조기 중단: 69행 <render> [별도 조건식 없음]

## H-2edcf792ceb1

**@callback:data.subjects.filter** · [src/ui/semester-weeks.tsx:24](../../../src/ui/semester-weeks.tsx#L24)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | truthy: !s.deletedAt && s.userId === data.userId && s.namespace === data.namespace | subjectIds.includes(s.id)<br>call |

## H-366c78c54153

**initial** · [src/ui/semester-weeks.tsx:26](../../../src/ui/semester-weeks.tsx#L26)

분기 조건과 가능한 갈림길:

- B-e49d0159cfae · ConditionalExpression · subject?.scope.kind === 'semester' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (28행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 27행 | 별도 조건식 없음 | subjects.find(s => s.id === fixedSubjectId)<br>call<br>전달 콜백: H-c4bd0a72e902 |

반환/조기 중단: 29행 { subjectId: subject?.id ?? '', start: '', end: term?.end ?? '', firstWeek: 1, name: subject?.name ?? '', rows: [], generatedStart: '', batch: null } [별도 조건식 없음]

## H-c4bd0a72e902

**@callback:subjects.find** · [src/ui/semester-weeks.tsx:27](../../../src/ui/semester-weeks.tsx#L27)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d919e89931e0

**@callback:useState** · [src/ui/semester-weeks.tsx:31](../../../src/ui/semester-weeks.tsx#L31)

분기 조건과 가능한 갈림길:

- B-31c4665c706e · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (31행).
- B-f7dd97e59024 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (31행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 31행 | 별도 조건식 없음 | readWeeksDraft(data, scope)<br>preservation-boundary |

반환/조기 중단: 31행 { ...readWeeksDraft(data, scope), error: '' } [별도 조건식 없음]; 31행 { raw: null, draft: null, error: (e as Error).message } [exception: e]

## H-f9e7f672b103

**patch** · [src/ui/semester-weeks.tsx:34](../../../src/ui/semester-weeks.tsx#L34)

분기 조건과 가능한 갈림길:

- B-875e777bd93c · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (36행).
- B-962a2d077563 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (37행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 35행 | 별도 조건식 없음 | setDraft(next)<br>state-update |
| 36행 | 별도 조건식 없음 | writeWeeksDraft(data, scope, next, raw.current)<br>preservation-boundary |
| 36행 | 별도 조건식 없음 | setError('')<br>state-update |
| 37행 | exception: e | setError(`${(e as Error).message} 화면의 입력은 유지했습니다.`)<br>state-update |

## H-4d9b3c1091af

**generate** · [src/ui/semester-weeks.tsx:39](../../../src/ui/semester-weeks.tsx#L39)

분기 조건과 가능한 갈림길:

- B-4a4c8bc233a2 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (40행).
- B-004c9cd2a48f · IfStatement · draft.rows.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (41행).
- B-85bf68aeb818 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (43행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 41행 | truthy: draft.rows.length | setError('기존 미리보기의 이름·날짜·메모를 유지했습니다. 새 기간으로 만들려면 미리보기 초기화를 눌러 주세요.')<br>state-update |
| 42행 | 별도 조건식 없음 | patch({ rows: semesterWeekRows(draft.start, draft.end, draft.firstWeek, draft.name), generatedStart: draft.start })<br>call → [H-f9e7f672b103](ui__semester-weeks.md#h-f9e7f672b103) |
| 42행 | 별도 조건식 없음 | semesterWeekRows(draft.start, draft.end, draft.firstWeek, draft.name)<br>call |
| 42행 | 별도 조건식 없음 | setNotice('실제 공지에 맞춰 날짜·기한·이름을 수정하고 휴강 주차는 제외해 주세요.')<br>state-update |
| 43행 | exception: e | setError((e as Error).message)<br>state-update |

반환/조기 중단: 41행 <render> [truthy: draft.rows.length]

## H-0f278ba678e8

**@callback:draft.rows.filter** · [src/ui/semester-weeks.tsx:46](../../../src/ui/semester-weeks.tsx#L46)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 46행 | truthy: !r.excluded | weekDuplicate(existing, draft.subjectId, series, r)<br>call |

## H-10adf2af67b5

**save** · [src/ui/semester-weeks.tsx:47](../../../src/ui/semester-weeks.tsx#L47)

분기 조건과 가능한 갈림길:

- B-7a67bbe779c1 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (48행).
- B-fd903839d311 · IfStatement · !subjects.some(s => s.id === draft.subjectId) || fixedSubjectId && fixedSubjectId !== draft.subjectId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (49행).
- B-7829a3b8b936 · IfStatement · !added.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (51행).
- B-1c563a68b7ec · IfStatement · onChange({ ...workspace, schedules: [...existing, ...added] }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (52행).
- B-d54df2a5d158 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (56행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 49행 | 별도 조건식 없음 | subjects.some(s => s.id === draft.subjectId)<br>call<br>전달 콜백: H-e3f9908e894d |
| 49행 | truthy: !subjects.some(s => s.id === draft.subjectId) \|\| fixedSubjectId && fixedSubjectId !== draft.subjectId | Error('현재 범위의 과목을 선택해 주세요.')<br>call |
| 50행 | 별도 조건식 없음 | createSemesterWeeks(draft.rows, existing, draft.subjectId, draft.generatedStart, () => crypto.randomUUID())<br>call<br>전달 콜백: H-6a94e1536824 |
| 51행 | truthy: !added.length | setNotice('새로 등록할 주차가 없습니다. 기존 일정과 휴지통의 주차는 중복 등록하지 않았습니다.')<br>state-update |
| 52행 | 별도 조건식 없음 | onChange({ ...workspace, schedules: [...existing, ...added] })<br>call |
| 53행 | truthy: onChange({ ...workspace, schedules: [...existing, ...added] }) | patch({ batch: { originals: added, reversed: false } })<br>call → [H-f9e7f672b103](ui__semester-weeks.md#h-f9e7f672b103) |
| 54행 | truthy: onChange({ ...workspace, schedules: [...existing, ...added] }) | setNotice(`${added.length}개 주차를 등록했습니다. 출석·학습 상태는 각각 직접 남겨 주세요.`)<br>state-update |
| 55행 | falsy: onChange({ ...workspace, schedules: [...existing, ...added] }) | setError('주차를 저장하지 못했습니다. 초안은 유지했습니다. 연결 상태를 확인한 뒤 다시 등록해 주세요.')<br>state-update |
| 56행 | exception: e | setError((e as Error).message)<br>state-update |

반환/조기 중단: 51행 <render> [truthy: !added.length]

throw: 49행 Error('현재 범위의 과목을 선택해 주세요.')

## H-e3f9908e894d

**@callback:subjects.some** · [src/ui/semester-weeks.tsx:49](../../../src/ui/semester-weeks.tsx#L49)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6a94e1536824

**@callback:createSemesterWeeks** · [src/ui/semester-weeks.tsx:50](../../../src/ui/semester-weeks.tsx#L50)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 50행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |

## H-98a8087492de

**reverse** · [src/ui/semester-weeks.tsx:58](../../../src/ui/semester-weeks.tsx#L58)

분기 조건과 가능한 갈림길:

- B-85da66bb5560 · IfStatement · !draft.batch → truthy / falsy; 바깥 조건: 별도 조건식 없음 (59행).
- B-afe1b18d177a · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (60행).
- B-cbbe5856fed2 · IfStatement · !result.changed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (62행).
- B-749983c994d4 · IfStatement · onChange({ ...workspace, schedules: result.schedules }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (63행).
- B-34d23c29a9bf · ConditionalExpression · draft.batch.reversed → truthy / falsy; 바깥 조건: truthy: onChange({ ...workspace, schedules: result.schedules }) (65행).
- B-79b6e6c0719f · ConditionalExpression · result.preserved → truthy / falsy; 바깥 조건: truthy: onChange({ ...workspace, schedules: result.schedules }) (65행).
- B-76744e0e3928 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (67행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 61행 | 별도 조건식 없음 | reverseWeekBatch(existing, draft.batch.originals, new Date().toISOString(), draft.batch.reversed)<br>call |
| 61행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 62행 | truthy: !result.changed | setNotice('등록 뒤 변경된 주차는 유지했습니다. 개별 일정에서 이력을 확인해 주세요.')<br>state-update |
| 63행 | 별도 조건식 없음 | onChange({ ...workspace, schedules: result.schedules })<br>call |
| 64행 | truthy: onChange({ ...workspace, schedules: result.schedules }) | patch({ batch: { originals: result.originals, reversed: !draft.batch.reversed } })<br>call → [H-f9e7f672b103](ui__semester-weeks.md#h-f9e7f672b103) |
| 65행 | truthy: onChange({ ...workspace, schedules: result.schedules }) | setNotice(`${result.changed}개 주차를 ${draft.batch.reversed ? '복원' : '휴지통으로 이동'}했습니다.${result.preserved ? ` 이후 변경된 ${result.preserved}개는 유지했습니다.` : ''}`)<br>state-update |
| 66행 | falsy: onChange({ ...workspace, schedules: result.schedules }) | setError('주차 변경을 저장하지 못했습니다. 기존 일정과 초안은 유지했습니다. 다시 시도해 주세요.')<br>state-update |
| 67행 | exception: e | setError((e as Error).message)<br>state-update |

반환/조기 중단: 59행 <render> [truthy: !draft.batch]; 62행 <render> [truthy: !result.changed]

## H-ab92d40fbd63

**@onClick** · [src/ui/semester-weeks.tsx:70](../../../src/ui/semester-weeks.tsx#L70)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 70행 | 별도 조건식 없음 | setOpen(true)<br>state-update |

## H-b6fcbbf0f55b

**@onClose** · [src/ui/semester-weeks.tsx:71](../../../src/ui/semester-weeks.tsx#L71)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 71행 | truthy: open | setOpen(false)<br>state-update |

## H-6e04cfd2dc9b

**@onClick** · [src/ui/semester-weeks.tsx:74](../../../src/ui/semester-weeks.tsx#L74)

분기 조건과 가능한 갈림길:

- B-7275f0fc5113 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: open ∧ truthy: blocked (74행).
- B-675f51a5db4b · CatchClause · e → exception; 바깥 조건: truthy: open ∧ truthy: blocked (74행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 74행 | truthy: open ∧ truthy: blocked | readWeeksDraft(data, scope)<br>preservation-boundary |
| 74행 | truthy: open ∧ truthy: blocked ∧ nullish: saved.draft | initial()<br>call → [H-366c78c54153](ui__semester-weeks.md#h-366c78c54153) |
| 74행 | truthy: open ∧ truthy: blocked | setDraft(current.current)<br>state-update |
| 74행 | truthy: open ∧ truthy: blocked | setBlocked(false)<br>state-update |
| 74행 | truthy: open ∧ truthy: blocked | setError('')<br>state-update |
| 74행 | truthy: open ∧ truthy: blocked ∧ exception: e | setError((e as Error).message)<br>state-update |

## H-f6922af7f2a8

**@onChange** · [src/ui/semester-weeks.tsx:75](../../../src/ui/semester-weeks.tsx#L75)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 75행 | truthy: open ∧ falsy: blocked ∧ truthy: !fixedSubjectId | patch({ subjectId: e.target.value, name: subjects.find(s => s.id === e.target.value)?.name ?? '', batch: null })<br>call → [H-f9e7f672b103](ui__semester-weeks.md#h-f9e7f672b103) |
| 75행 | truthy: open ∧ falsy: blocked ∧ truthy: !fixedSubjectId | subjects.find(s => s.id === e.target.value)<br>call<br>전달 콜백: H-b6d31fcdbbc6 |

## H-b6d31fcdbbc6

**@callback:subjects.find** · [src/ui/semester-weeks.tsx:75](../../../src/ui/semester-weeks.tsx#L75)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1b8f6860f1af

**@callback:subjects.map** · [src/ui/semester-weeks.tsx:75](../../../src/ui/semester-weeks.tsx#L75)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-68fa40f5deef

**@onChange** · [src/ui/semester-weeks.tsx:77](../../../src/ui/semester-weeks.tsx#L77)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 77행 | truthy: open ∧ falsy: blocked | patch({ start: e.target.value })<br>call → [H-f9e7f672b103](ui__semester-weeks.md#h-f9e7f672b103) |

## H-12db0512e002

**@onChange** · [src/ui/semester-weeks.tsx:78](../../../src/ui/semester-weeks.tsx#L78)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 78행 | truthy: open ∧ falsy: blocked | patch({ end: e.target.value })<br>call → [H-f9e7f672b103](ui__semester-weeks.md#h-f9e7f672b103) |

## H-0c70d4ea8725

**@onChange** · [src/ui/semester-weeks.tsx:79](../../../src/ui/semester-weeks.tsx#L79)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 79행 | truthy: open ∧ falsy: blocked | patch({ firstWeek: Number(e.target.value) })<br>call → [H-f9e7f672b103](ui__semester-weeks.md#h-f9e7f672b103) |
| 79행 | truthy: open ∧ falsy: blocked | Number(e.target.value)<br>call |

## H-4b17252ea8b7

**@onChange** · [src/ui/semester-weeks.tsx:81](../../../src/ui/semester-weeks.tsx#L81)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 81행 | truthy: open ∧ falsy: blocked | patch({ name: e.target.value })<br>call → [H-f9e7f672b103](ui__semester-weeks.md#h-f9e7f672b103) |

## H-bf5a7104d036

**@onClick** · [src/ui/semester-weeks.tsx:82](../../../src/ui/semester-weeks.tsx#L82)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 82행 | truthy: open ∧ falsy: blocked ∧ truthy: Boolean(draft.rows.length) | patch({ rows: [], generatedStart: '' })<br>call → [H-f9e7f672b103](ui__semester-weeks.md#h-f9e7f672b103) |
| 82행 | truthy: open ∧ falsy: blocked ∧ truthy: Boolean(draft.rows.length) | setNotice('미리보기만 비웠습니다. 저장된 주차와 되돌리기 정보는 유지했습니다.')<br>state-update |

## H-947e9ccec3de

**@callback:draft.rows.map** · [src/ui/semester-weeks.tsx:84](../../../src/ui/semester-weeks.tsx#L84)

분기 조건과 가능한 갈림길:

- B-e9a172e2aea1 · ConditionalExpression · row.excluded → truthy / falsy; 바깥 조건: truthy: open ∧ falsy: blocked (87행).
- B-a61a3d115e3f · ConditionalExpression · duplicate → truthy / falsy; 바깥 조건: truthy: open ∧ falsy: blocked ∧ falsy: row.excluded (87행).
- B-25166f2dedee · ConditionalExpression · duplicate.deletedAt → truthy / falsy; 바깥 조건: truthy: open ∧ falsy: blocked ∧ falsy: row.excluded ∧ truthy: duplicate (87행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 85행 | truthy: open ∧ falsy: blocked | weekDuplicate(existing, draft.subjectId, series, row)<br>call |

반환/조기 중단: 87행 <render> [truthy: open ∧ falsy: blocked]

## H-0dc12553cc01

**edit** · [src/ui/semester-weeks.tsx:86](../../../src/ui/semester-weeks.tsx#L86)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 86행 | truthy: open ∧ falsy: blocked | patch({ rows: current.current.rows.map((r, i) => i === index ? { ...r, ...p } : r) })<br>call → [H-f9e7f672b103](ui__semester-weeks.md#h-f9e7f672b103) |
| 86행 | truthy: open ∧ falsy: blocked | current.current.rows.map((r, i) => i === index ? { ...r, ...p } : r)<br>call<br>전달 콜백: H-3571fba613a9 |

## H-3571fba613a9

**@callback:current.current.rows.map** · [src/ui/semester-weeks.tsx:86](../../../src/ui/semester-weeks.tsx#L86)

분기 조건과 가능한 갈림길:

- B-5204e6c10f51 · ConditionalExpression · i === index → truthy / falsy; 바깥 조건: truthy: open ∧ falsy: blocked (86행).

## H-77911c3649ae

**@onChange** · [src/ui/semester-weeks.tsx:88](../../../src/ui/semester-weeks.tsx#L88)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 88행 | truthy: open ∧ falsy: blocked | edit({ excluded: e.target.checked })<br>call → [H-0dc12553cc01](ui__semester-weeks.md#h-0dc12553cc01) |

## H-80f83f99a2e0

**@onChange** · [src/ui/semester-weeks.tsx:89](../../../src/ui/semester-weeks.tsx#L89)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 89행 | truthy: open ∧ falsy: blocked | edit({ name: e.target.value })<br>call → [H-0dc12553cc01](ui__semester-weeks.md#h-0dc12553cc01) |

## H-e27609a6be62

**@onChange** · [src/ui/semester-weeks.tsx:90](../../../src/ui/semester-weeks.tsx#L90)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 90행 | truthy: open ∧ falsy: blocked | edit({ opensDate: e.target.value })<br>call → [H-0dc12553cc01](ui__semester-weeks.md#h-0dc12553cc01) |

## H-f4cc52325ecb

**@onChange** · [src/ui/semester-weeks.tsx:91](../../../src/ui/semester-weeks.tsx#L91)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 91행 | truthy: open ∧ falsy: blocked | edit({ dueDate: e.target.value })<br>call → [H-0dc12553cc01](ui__semester-weeks.md#h-0dc12553cc01) |

## H-1163938a59a9

**@onChange** · [src/ui/semester-weeks.tsx:92](../../../src/ui/semester-weeks.tsx#L92)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 92행 | truthy: open ∧ falsy: blocked | edit({ note: e.target.value })<br>call → [H-0dc12553cc01](ui__semester-weeks.md#h-0dc12553cc01) |

## H-d399dae3bb3e

**@onClick** · [src/ui/semester-weeks.tsx:100](../../../src/ui/semester-weeks.tsx#L100)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 100행 | truthy: open | setOpen(false)<br>state-update |

