# src/ui/statistics.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-9bab9822114e

**format** · [src/ui/statistics.tsx:37](../../../src/ui/statistics.tsx#L37)

분기 조건과 가능한 갈림길:

- B-e56fd1e8deef · ConditionalExpression · hi === null → truthy / falsy; 바깥 조건: 별도 조건식 없음 (38행).
- B-8d399239a7c2 · ConditionalExpression · lo === hi → truthy / falsy; 바깥 조건: falsy: hi === null (38행).

## H-ebae495c4838

**StudyStatistics** · [src/ui/statistics.tsx:39](../../../src/ui/statistics.tsx#L39)

분기 조건과 가능한 갈림길:

- B-30d45d27a346 · ConditionalExpression · compact → truthy / falsy; 바깥 조건: 별도 조건식 없음 (52행).
- B-44d08b0d7c4a · ConditionalExpression · compact → truthy / falsy; 바깥 조건: 별도 조건식 없음 (53행).
- B-7fc4dabaf2e9 · ConditionalExpression · compact → truthy / falsy; 바깥 조건: 별도 조건식 없음 (68행).
- B-5d42d194b272 · ConditionalExpression · valid → truthy / falsy; 바깥 조건: 별도 조건식 없음 (148행).
- B-2f337b7aeaa4 · ConditionalExpression · valid → truthy / falsy; 바깥 조건: 별도 조건식 없음 (199행).
- B-1e58d00cebf5 · ConditionalExpression · valid → truthy / falsy; 바깥 조건: 별도 조건식 없음 (200행).
- B-cd595f08ef4d · ConditionalExpression · valid → truthy / falsy; 바깥 조건: 별도 조건식 없음 (202행).
- B-ce9a45777283 · IfStatement · compact → truthy / falsy; 바깥 조건: 별도 조건식 없음 (271행).
- B-444c5cd01b5e · ConditionalExpression · sharedMatch → truthy / falsy; 바깥 조건: 별도 조건식 없음 (455행).
- B-89b98252d316 · ConditionalExpression · !valid → truthy / falsy; 바깥 조건: 별도 조건식 없음 (503행).
- B-c057b3b75490 · ConditionalExpression · subjectId → truthy / falsy; 바깥 조건: falsy: !valid (527행).
- B-0bc905eff551 · ConditionalExpression · readError && ['attempts', 'successes', 'corrections'].includes(metricId) → truthy / falsy; 바깥 조건: falsy: !valid (577행).
- B-0da92f94f9ac · ConditionalExpression · view !== 'list' → truthy / falsy; 바깥 조건: falsy: !valid ∧ falsy: readError && ['attempts', 'successes', 'corrections'].includes(metricId) (582행).
- B-71ee0de75365 · ConditionalExpression · view === 'depth' || kind === 'column' → truthy / falsy; 바깥 조건: falsy: !valid ∧ falsy: readError && ['attempts', 'successes', 'corrections'].includes(metricId) ∧ truthy: view !== 'list' (583행).
- B-f49c04c8ebd5 · ConditionalExpression · family === 'trend' → truthy / falsy; 바깥 조건: falsy: !valid ∧ falsy: readError && ['attempts', 'successes', 'corrections'].includes(metricId) ∧ truthy: view !== 'list' ∧ falsy: view === 'depth' || kind === 'column' (595행).
- B-66e9b9613e3b · ConditionalExpression · zoom === 1 → truthy / falsy; 바깥 조건: falsy: !valid (640행).
- B-e72f47662498 · ConditionalExpression · playing → truthy / falsy; 바깥 조건: falsy: !valid (667행).
- B-809fe96947d2 · ConditionalExpression · step === 1 → truthy / falsy; 바깥 조건: falsy: !valid (703행).
- B-f38171845aae · ConditionalExpression · compare → truthy / falsy; 바깥 조건: falsy: !valid (706행).
- B-b55bb9bf19b8 · ConditionalExpression · frozen → truthy / falsy; 바깥 조건: truthy: Boolean(selection) ∧ truthy: selection (862행).
- B-3dd78f4249df · ConditionalExpression · selection.items.length → truthy / falsy; 바깥 조건: truthy: Boolean(selection) ∧ truthy: selection (870행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 48행 | 별도 조건식 없음 | koreanDay(new Date().toISOString())<br>call |
| 48행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 49행 | 별도 조건식 없음 | useState(() => calendarMonth(readStatisticsMonth(data, today.slice(0, 7)).month))<br>call<br>전달 콜백: H-cd242bb7c97d |
| 52행 | 별도 조건식 없음 | useState(compact ? shiftDay(today, -13) : initialMonth.from)<br>call |
| 52행 | truthy: compact | shiftDay(today, -13)<br>call |
| 53행 | 별도 조건식 없음 | useState(compact ? today : initialMonth.to)<br>call |
| 54행 | 별도 조건식 없음 | useState(null)<br>call |
| 55행 | 별도 조건식 없음 | useState('')<br>call |
| 56행 | 별도 조건식 없음 | useState('')<br>call |
| 57행 | 별도 조건식 없음 | useState('')<br>call |
| 59행 | 별도 조건식 없음 | useMemo(() => statisticsSelectionMatcher(sharedSelection, data), [sharedSelection, data])<br>call<br>전달 콜백: H-93f21e2c2c68 |
| 65행 | 별도 조건식 없음 | useState(() => readStatisticsView(data))<br>call<br>전달 콜백: H-5871888b7811 |
| 66행 | 별도 조건식 없음 | useState('')<br>call |
| 67행 | 별도 조건식 없음 | useState('')<br>call |
| 68행 | 별도 조건식 없음 | useState(compact ? 'sessions' : bootView.view.metricId)<br>call |
| 69행 | 별도 조건식 없음 | useState(bootView.view.family)<br>call |
| 70행 | 별도 조건식 없음 | useState(bootView.view.kind)<br>call |
| 71행 | 별도 조건식 없음 | useState(bootView.view.overview)<br>call |
| 72행 | 별도 조건식 없음 | useState(bootView.view.secondMetricId)<br>call |
| 73행 | 별도 조건식 없음 | useState(bootView.error)<br>call |
| 74행 | 별도 조건식 없음 | useRef(false)<br>call |
| 75행 | 별도 조건식 없음 | useRef(`${data.namespace}:${data.userId}`)<br>call |
| 76행 | 별도 조건식 없음 | useEffect(() => { const account = `${data.namespace}:${data.userId}`; if (viewAccount.current === account) return; viewAccount.current = account; viewTouched.current = false; const next = readStatisticsView({ userId: data.userId, namespace: data.namespace }); setFamily(next.view.family); setKind(next.view.kind); setOverview(next.view.overview); setMetric(compact ? 'sessions' : next.view.metricId); setSecondMetric(next.view.secondMetricId); setViewNotice(next.error); }, [data.userId, data.namespace, compact])<br>call<br>전달 콜백: H-d03030bd19bb |
| 89행 | 별도 조건식 없음 | useEffect(() => { if (compact \|\| !viewTouched.current) return; try { saveStatisticsView( { userId: data.userId, namespace: data.namespace }, { version: 1, family, kind, overview, metricId, secondMetricId }, ); setViewNotice(''); } catch { setViewNotice( '그래프 선택을 이 기기에 저장하지 못했습니다. 화면의 선택과 원기록은 유지했습니다.', ); } }, [data.userId, data.namespace, family, kind, overview, metricId, secondMetricId, compact])<br>call<br>전달 콜백: H-f7355bada021 |
| 104행 | 별도 조건식 없음 | useState('graph')<br>call |
| 105행 | 별도 조건식 없음 | useState(false)<br>call |
| 106행 | 별도 조건식 없음 | useState(1)<br>call |
| 107행 | 별도 조건식 없음 | useState(null)<br>call |
| 108행 | 별도 조건식 없음 | useState(false)<br>call |
| 109행 | 별도 조건식 없음 | useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)<br>call<br>전달 콜백: H-6069163b4436 |
| 112행 | 별도 조건식 없음 | useEffect(() => { const query = window.matchMedia?.('(prefers-reduced-motion: reduce)'); if (!query) return; const update = () => setReduceMotion(query.matches); query.addEventListener?.('change', update); return () => query.removeEventListener?.('change', update); }, [])<br>call<br>전달 콜백: H-00b7756707fc |
| 120행 | 별도 조건식 없음 | useEffect(() => { setCursor(null); setPlaying(false); }, [from, to, metricId, subjectId, nodeId])<br>call<br>전달 콜백: H-99b2e5e55409 |
| 124행 | 별도 조건식 없음 | useState(null)<br>call |
| 131행 | 별도 조건식 없음 | useState(null)<br>call |
| 136행 | 별도 조건식 없음 | useMemo(() => { try { return { workspace: readLearningPlan(data).workspace, readError: '' }; } catch { return { workspace: emptyRecommendations(data), readError: '추천 수행 자료를 읽지 못했습니다. 공부 기록은 표시하며 수행 지표는 확인할 수 없습니다.', }; } }, [data])<br>call<br>전달 콜백: H-561fdfc8a55e |
| 147행 | 별도 조건식 없음 | validPeriod(from, to)<br>call |
| 148행 | truthy: valid | Math.round((Date.parse(to) - Date.parse(from)) / 86400000)<br>call |
| 148행 | truthy: valid | Date.parse(to)<br>call |
| 148행 | truthy: valid | Date.parse(from)<br>call |
| 149행 | 별도 조건식 없음 | useMemo(() => statistics( data, workspace, { from, to, subjectIds, subjectId, nodeId }, new Date().toISOString(), ), [data, workspace, from, to, subjectIds, subjectId, nodeId])<br>call<br>전달 콜백: H-af2f04cb912e |
| 159행 | 별도 조건식 없음 | metrics.find((m) => m.id === metricId)<br>call<br>전달 콜백: H-96cd57cdc0ad |
| 160행 | 별도 조건식 없음 | useMemo(() => ({ data, metrics, metricId, secondMetricId, from, to, compare, subjectIds, subjectId }), [data, metrics, metricId, secondMetricId, from, to, compare, subjectIds, subjectId])<br>call<br>전달 콜백: H-1184a3a2b8ad |
| 164행 | 별도 조건식 없음 | useMemo(() => { const result = chartFigure(chartContext, kind); if ( readError && (['attempts', 'successes', 'corrections'].includes(metricId) \|\| (family === 'relationship' && ['attempts', 'successes', 'corrections'].includes(secondMetricId))) ) return { ...result, traces: [], rows: [], reason: '수행 자료를 읽지 못했습니다. 공부 기록의 다른 지표를 선택해 주세요.', }; return result; }, [chartContext, kind, readError, metricId, family, secondMetricId])<br>call<br>전달 콜백: H-945202024340 |
| 199행 | truthy: valid | shiftDay(from, -1)<br>call |
| 200행 | truthy: valid | shiftDay(from, -days)<br>call |
| 201행 | 별도 조건식 없음 | Math.max(1, Math.ceil(days / 14))<br>call |
| 201행 | 별도 조건식 없음 | Math.ceil(days / 14)<br>call |
| 203행 | truthy: valid | Array.from({ length: Math.ceil(days / step) }, (_, i) => { const lo = shiftDay(from, i * step), hi = shiftDay(from, Math.min(days - 1, (i + 1) * step - 1)); const current = statisticBounds( { ...metric, items: metric.items.filter((item) => item.date.kind === 'exact') }, lo, hi, ); const prev = statisticBounds( { ...metric, items: metric.items.filter((item) => item.date.kind === 'exact') }, shiftDay(previousFrom, i * step), shiftDay(previousFrom, Math.min(days - 1, (i + 1) * step - 1)), ); return { lo, hi, current, prev }; })<br>call<br>전달 콜백: H-fe7d57c17b3d |
| 203행 | truthy: valid | Math.ceil(days / step)<br>call |
| 219행 | 별도 조건식 없음 | Math.max(2, Math.ceil( Math.max(0, ...bins.flatMap((b) => [b.current.lower, compare ? b.prev.lower : 0])) / 2, ) * 2)<br>call |
| 221행 | 별도 조건식 없음 | Math.ceil(Math.max(0, ...bins.flatMap((b) => [b.current.lower, compare ? b.prev.lower : 0])) / 2)<br>call |
| 222행 | 별도 조건식 없음 | Math.max(0, ...bins.flatMap((b) => [b.current.lower, compare ? b.prev.lower : 0]))<br>call |
| 222행 | 별도 조건식 없음 | bins.flatMap((b) => [b.current.lower, compare ? b.prev.lower : 0])<br>call<br>전달 콜백: H-5a1d811026b4 |
| 225행 | 별도 조건식 없음 | useEffect(() => { if (!playing \|\| reduceMotion) { if (reduceMotion) setPlaying(false); return; } const timer = window.setInterval( () => setCursor((i) => { const next = (i ?? -1) + 1; if (next >= bins.length) { setPlaying(false); return bins.length - 1; } return next; }), 900, ); return () => window.clearInterval(timer); }, [playing, reduceMotion, bins.length])<br>call<br>전달 콜백: H-930d5a81e502 |
| 246행 | 별도 조건식 없음 | canonicalEvents(frozen?.events ?? workspace.events, new Date().toISOString(), new Date().toISOString())<br>call |
| 248행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 249행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 280행 | truthy: compact | chart()<br>call → [H-41ee8517ea8b](ui__statistics.md#h-41ee8517ea8b) |
| 288행 | truthy: compact | Boolean(readError)<br>call |
| 415행 | 별도 조건식 없음 | data.subjects<br>              .filter((s) => !s.deletedAt && subjectIds.includes(s.id))<br>              .map((s) => ( <option key={s.id} value={s.id}> {s.name} </option> ))<br>mutation-request<br>전달 콜백: H-63f1de63753e |
| 415행 | 별도 조건식 없음 | data.subjects<br>              .filter((s) => !s.deletedAt && subjectIds.includes(s.id))<br>call<br>전달 콜백: H-de35efbbce68 |
| 426행 | 별도 조건식 없음 | validPeriod(selectionFrom, selectionTo)<br>call |
| 456행 | truthy: sharedMatch | uniqueStatisticSources(metrics.flatMap((m) => statisticBounds(m, from, to).evidence.filter(sharedMatch)))<br>call |
| 456행 | truthy: sharedMatch | metrics.flatMap((m) => statisticBounds(m, from, to).evidence.filter(sharedMatch))<br>call<br>전달 콜백: H-4f0ed98013ca |
| 456행 | truthy: sharedMatch | uniqueStatisticSources(metrics.flatMap((m) => statisticBounds(m, from, to).evidence))<br>call |
| 456행 | truthy: sharedMatch | metrics.flatMap((m) => statisticBounds(m, from, to).evidence)<br>call<br>전달 콜백: H-7f611263be06 |
| 518행 | falsy: !valid | metrics.map((m) => ( <option key={m.id} value={m.id}> {m.label} </option> ))<br>call<br>전달 콜백: H-8397e4b5c4f9 |
| 528행 | falsy: !valid ∧ truthy: subjectId | data.subjects.find((subject) => subject.id === subjectId)<br>call<br>전달 콜백: H-ada57856330b |
| 537행 | falsy: !valid | chartFamilies.map((f) => ( <option key={f.id} value={f.id}> {f.label} </option> ))<br>call<br>전달 콜백: H-15d94cd4e2c3 |
| 552행 | falsy: !valid | chartFamilies<br>                  .find((f) => f.id === family)!<br>                  .kinds.map((k) => ( <option key={k} value={k}> {chartNames[k]} </option> ))<br>call<br>전달 콜백: H-fef91ff8e6c7 |
| 552행 | falsy: !valid | chartFamilies<br>                  .find((f) => f.id === family)<br>call<br>전달 콜백: H-f3d988ec66dd |
| 569행 | falsy: !valid ∧ truthy: family === 'relationship' && kind !== 'heatmap' | metrics.map((m) => ( <option key={m.id} value={m.id}> {m.label} </option> ))<br>call<br>전달 콜백: H-bd7b1332198d |
| 577행 | falsy: !valid ∧ truthy: readError | ['attempts', 'successes', 'corrections'].includes(metricId)<br>call |
| 584행 | falsy: !valid ∧ falsy: readError && ['attempts', 'successes', 'corrections'].includes(metricId) ∧ truthy: view !== 'list' ∧ truthy: view === 'depth' \|\| kind === 'column' | chart()<br>call → [H-41ee8517ea8b](ui__statistics.md#h-41ee8517ea8b) |
| 594행 | falsy: !valid ∧ falsy: readError && ['attempts', 'successes', 'corrections'].includes(metricId) ∧ truthy: view !== 'list' ∧ falsy: view === 'depth' \|\| kind === 'column' | selectedChartRows(figure, sharedMatch)<br>call |
| 622행 | falsy: !valid ∧ truthy: !readError | bins.some((b) => b.current.lower > 0)<br>call<br>전달 콜백: H-a27ca968ae49 |
| 716행 | falsy: !valid | metric.items<br>                .filter((i) => i.date.kind !== 'exact' \|\| i.maximum === null)<br>                .map((i) => ( <p key={`${i.id}:${i.recordIds.join()}`}> {i.label} · {dateLabel(i)} · {format(i.value, i.maximum)} {metric.unit} </p> ))<br>call<br>전달 콜백: H-8a750434f185 |
| 716행 | falsy: !valid | metric.items<br>                .filter((i) => i.date.kind !== 'exact' \|\| i.maximum === null)<br>call<br>전달 콜백: H-d2065199c982 |
| 727행 | falsy: !valid | metrics.map((m) => { const b = statisticBounds(m, from, to), prev = statisticBounds(m, previousFrom, previousTo); const unavailable = readError && ['attempts', 'successes', 'corrections'].includes(m.id); return ( <button type="button" key={m.id} className="statistics-metric" aria-pressed={metricId === m.id} onClick={() => { viewTouched.current = true; setMetric(m.id); }} > <span>{m.label}</span> <strong> {unavailable ? '확인 불가' : format(b.lower, b.upper)} {m.denominator !== undefined ? ` / ${m.denominator}` : ''} </strong> <small> {m.unit} {b.undated ? ` · 날짜 미정 ${b.undated}건 별도` : ''} </small> {compare && <small>이전 기간 {format(prev.lower, prev.upper)}</small>} </button> ); })<br>call<br>전달 콜백: H-45f9ff27ca8a |
| 776행 | 별도 조건식 없음 | data.subjects<br>            .filter((s) => !s.deletedAt && subjectIds.includes(s.id))<br>            .map((s) => ( <option key={s.id} value={s.id}> {s.name} </option> ))<br>mutation-request<br>전달 콜백: H-24d1d2938fa3 |
| 776행 | 별도 조건식 없음 | data.subjects<br>            .filter((s) => !s.deletedAt && subjectIds.includes(s.id))<br>call<br>전달 콜백: H-970fd785c561 |
| 786행 | 별도 조건식 없음 | data.nodes<br>            .filter(<br>              (n) =><br>                !n.deletedAt &&<br>                subjectIds.includes(n.subjectId) &&<br>                (!subjectId \|\| n.subjectId === subjectId),<br>            )<br>            .map((n) => ( <option key={n.id} value={n.id}> {data.subjects.find((s) => s.id === n.subjectId)?.name} · {n.name} </option> ))<br>mutation-request<br>전달 콜백: H-cda34b3ef002 |
| 786행 | 별도 조건식 없음 | data.nodes<br>            .filter((n) => !n.deletedAt && subjectIds.includes(n.subjectId) && (!subjectId \|\| n.subjectId === subjectId))<br>call<br>전달 콜백: H-73d7a1542340 |
| 801행 | 별도 조건식 없음 | [7, 14, 30].map((n) => ( <Button key={n} variant="quiet" onClick={() => { setFrom(shiftDay(today, 1 - n)); setTo(today); }} > 최근 {n}일 </Button> ))<br>call<br>전달 콜백: H-575f91d9c51c |
| 825행 | 별도 조건식 없음 | Boolean(readError)<br>call |
| 835행 | truthy: Boolean(selection) | Boolean(selection)<br>call |
| 853행 | truthy: Boolean(selection) ∧ truthy: selection | Boolean(frozen)<br>call |
| 871행 | truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length | selection.items.map((i) => ( <article key={`${i.id}:${i.recordIds.join(',')}:${i.eventIds.join(',')}`} data-shared-selected={sharedMatch ? sharedMatch(i) : undefined} > <Button variant="quiet" aria-pressed={Boolean(sharedMatch?.(i))} onClick={() => selectEvidence(i.label, [i])} > 이 원기록 함께 선택 </Button> <strong>{i.label}</strong> <p className="muted"> {dateLabel(i)} ·{' '} {datePlacement(i.date, from, to) === 'possible' ? '기간 포함 여부 미확정' : i.date.kind === 'unknown' ? '기간에 배정하지 않음' : selection.unit ? `${i.value}${selection.unit}` : '연결된 원기록'} </p> {i.recordIds.map((id) => { const r = sourceData.records.find((r) => r.id === id); return ( r && ( <div key={id}> <p>{r.body \|\| '남긴 글 없음'}</p> <a href={`#/node/${encodeURI … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-bcb2174106db |

반환/조기 중단: 272행 <render> [truthy: compact]; 385행 <render> [별도 조건식 없음]

## H-cd242bb7c97d

**@callback:useState** · [src/ui/statistics.tsx:49](../../../src/ui/statistics.tsx#L49)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 50행 | 별도 조건식 없음 | calendarMonth(readStatisticsMonth(data, today.slice(0, 7)).month)<br>call |
| 50행 | 별도 조건식 없음 | readStatisticsMonth(data, today.slice(0, 7))<br>call |
| 50행 | 별도 조건식 없음 | today.slice(0, 7)<br>call |

## H-93f21e2c2c68

**@callback:useMemo** · [src/ui/statistics.tsx:60](../../../src/ui/statistics.tsx#L60)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 60행 | 별도 조건식 없음 | statisticsSelectionMatcher(sharedSelection, data)<br>call |

## H-39599473704c

**selectEvidence** · [src/ui/statistics.tsx:63](../../../src/ui/statistics.tsx#L63)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 64행 | 별도 조건식 없음 | setSharedSelection({ owner: selectionOwner, label, sourceKeys: uniqueStatisticSources(items) })<br>state-update |
| 64행 | 별도 조건식 없음 | uniqueStatisticSources(items)<br>call |

## H-5871888b7811

**@callback:useState** · [src/ui/statistics.tsx:65](../../../src/ui/statistics.tsx#L65)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 65행 | 별도 조건식 없음 | readStatisticsView(data)<br>call |

## H-d03030bd19bb

**@callback:useEffect** · [src/ui/statistics.tsx:76](../../../src/ui/statistics.tsx#L76)

분기 조건과 가능한 갈림길:

- B-9d138465f29a · IfStatement · viewAccount.current === account → truthy / falsy; 바깥 조건: 별도 조건식 없음 (78행).
- B-39b993d57d4d · ConditionalExpression · compact → truthy / falsy; 바깥 조건: 별도 조건식 없음 (85행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 81행 | 별도 조건식 없음 | readStatisticsView({ userId: data.userId, namespace: data.namespace })<br>call |
| 82행 | 별도 조건식 없음 | setFamily(next.view.family)<br>state-update |
| 83행 | 별도 조건식 없음 | setKind(next.view.kind)<br>state-update |
| 84행 | 별도 조건식 없음 | setOverview(next.view.overview)<br>state-update |
| 85행 | 별도 조건식 없음 | setMetric(compact ? 'sessions' : next.view.metricId)<br>state-update |
| 86행 | 별도 조건식 없음 | setSecondMetric(next.view.secondMetricId)<br>state-update |
| 87행 | 별도 조건식 없음 | setViewNotice(next.error)<br>state-update |

반환/조기 중단: 78행 <render> [truthy: viewAccount.current === account]

## H-f7355bada021

**@callback:useEffect** · [src/ui/statistics.tsx:89](../../../src/ui/statistics.tsx#L89)

분기 조건과 가능한 갈림길:

- B-5db93a380604 · IfStatement · compact || !viewTouched.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (90행).
- B-6a94993c469b · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (91행).
- B-539f953d6d37 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (97행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 92행 | 별도 조건식 없음 | saveStatisticsView({ userId: data.userId, namespace: data.namespace }, { version: 1, family, kind, overview, metricId, secondMetricId })<br>call |
| 96행 | 별도 조건식 없음 | setViewNotice('')<br>state-update |
| 98행 | exception: exception | setViewNotice('그래프 선택을 이 기기에 저장하지 못했습니다. 화면의 선택과 원기록은 유지했습니다.')<br>state-update |

반환/조기 중단: 90행 <render> [truthy: compact || !viewTouched.current]

## H-6069163b4436

**@callback:useState** · [src/ui/statistics.tsx:110](../../../src/ui/statistics.tsx#L110)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-00b7756707fc

**@callback:useEffect** · [src/ui/statistics.tsx:112](../../../src/ui/statistics.tsx#L112)

분기 조건과 가능한 갈림길:

- B-4fe1da6e1052 · IfStatement · !query → truthy / falsy; 바깥 조건: 별도 조건식 없음 (114행).

반환/조기 중단: 114행 <render> [truthy: !query]; 117행 () => query.removeEventListener?.('change', update) [별도 조건식 없음]

## H-99b2e5e55409

**@callback:useEffect** · [src/ui/statistics.tsx:120](../../../src/ui/statistics.tsx#L120)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 121행 | 별도 조건식 없음 | setCursor(null)<br>state-update |
| 122행 | 별도 조건식 없음 | setPlaying(false)<br>state-update |

## H-561fdfc8a55e

**@callback:useMemo** · [src/ui/statistics.tsx:136](../../../src/ui/statistics.tsx#L136)

분기 조건과 가능한 갈림길:

- B-bd63afbaa590 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (137행).
- B-dc18060762a0 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (139행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 138행 | 별도 조건식 없음 | readLearningPlan(data)<br>call |
| 141행 | exception: exception | emptyRecommendations(data)<br>call |

반환/조기 중단: 138행 { workspace: readLearningPlan(data).workspace, readError: '' } [별도 조건식 없음]; 140행 { workspace: emptyRecommendations(data), readError: '추천 수행 자료를 읽지 못했습니다. 공부 기록은 표시하며 수행 지표는 확인할 수 없습니다.', } [exception: exception]

## H-af2f04cb912e

**@callback:useMemo** · [src/ui/statistics.tsx:150](../../../src/ui/statistics.tsx#L150)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 151행 | 별도 조건식 없음 | statistics(data, workspace, { from, to, subjectIds, subjectId, nodeId }, new Date().toISOString())<br>call |
| 155행 | 별도 조건식 없음 | new Date().toISOString()<br>call |

## H-96cd57cdc0ad

**@callback:metrics.find** · [src/ui/statistics.tsx:159](../../../src/ui/statistics.tsx#L159)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1184a3a2b8ad

**@callback:useMemo** · [src/ui/statistics.tsx:161](../../../src/ui/statistics.tsx#L161)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-945202024340

**@callback:useMemo** · [src/ui/statistics.tsx:164](../../../src/ui/statistics.tsx#L164)

분기 조건과 가능한 갈림길:

- B-b340c1cec0a5 · IfStatement · readError && (['attempts', 'successes', 'corrections'].includes(metricId) || (family === 'relationship' && ['attempts', 'successes', 'corrections'].includes(secondMetricId))) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (166행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 165행 | 별도 조건식 없음 | chartFigure(chartContext, kind)<br>call |
| 168행 | truthy: readError | ['attempts', 'successes', 'corrections'].includes(metricId)<br>call |
| 170행 | truthy: readError ∧ falsy: ['attempts', 'successes', 'corrections'].includes(metricId) ∧ truthy: family === 'relationship' | ['attempts', 'successes', 'corrections'].includes(secondMetricId)<br>call |

반환/조기 중단: 172행 { ...result, traces: [], rows: [], reason: '수행 자료를 읽지 못했습니다. 공부 기록의 다른 지표를 선택해 주세요.', } [truthy: readError &&
      (['attempts', 'successes', 'corrections'].includes(metricId) ||
        (family === 'relationship' &&
          ['attempts', 'successes', 'corrections'].includes(secondMetricId)))]; 178행 result [별도 조건식 없음]

## H-9029f5f500f3

**chooseFamily** · [src/ui/statistics.tsx:180](../../../src/ui/statistics.tsx#L180)

분기 조건과 가능한 갈림길:

- B-c12b6c9012bd · IfStatement · value === 'relationship' && metricId === secondMetricId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (185행).
- B-d725728f714b · ConditionalExpression · metricId === 'sessions' → truthy / falsy; 바깥 조건: truthy: value === 'relationship' && metricId === secondMetricId (186행).
- B-e11d5209fbb1 · IfStatement · (value === 'composition' || value === 'flow') && metricId === 'sessions' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (187행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 182행 | 별도 조건식 없음 | setFamily(value)<br>state-update |
| 183행 | 별도 조건식 없음 | setKind(chartFamilies.find((f) => f.id === value)!.kinds[0])<br>state-update |
| 183행 | 별도 조건식 없음 | chartFamilies.find((f) => f.id === value)<br>call<br>전달 콜백: H-6116904bb575 |
| 184행 | 별도 조건식 없음 | setView('graph')<br>state-update |
| 186행 | truthy: value === 'relationship' && metricId === secondMetricId | setSecondMetric(metricId === 'sessions' ? 'writing' : 'sessions')<br>state-update |
| 188행 | truthy: (value === 'composition' \|\| value === 'flow') && metricId === 'sessions' | setMetric('writing')<br>state-update |

## H-6116904bb575

**@callback:chartFamilies.find** · [src/ui/statistics.tsx:183](../../../src/ui/statistics.tsx#L183)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5a9d5d421253

**chooseChart** · [src/ui/statistics.tsx:190](../../../src/ui/statistics.tsx#L190)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 192행 | 별도 조건식 없음 | setFamily(chartFamilies.find((f) => (f.kinds as readonly string[]).includes(value))!.id)<br>state-update |
| 192행 | 별도 조건식 없음 | chartFamilies.find((f) => (f.kinds as readonly string[]).includes(value))<br>call<br>전달 콜백: H-12cb72d209b0 |
| 193행 | 별도 조건식 없음 | setKind(value)<br>state-update |
| 194행 | 별도 조건식 없음 | setMetric(id)<br>state-update |
| 195행 | 별도 조건식 없음 | setView('graph')<br>state-update |
| 196행 | 별도 조건식 없음 | setOverview(false)<br>state-update |

## H-12cb72d209b0

**@callback:chartFamilies.find** · [src/ui/statistics.tsx:192](../../../src/ui/statistics.tsx#L192)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 192행 | 별도 조건식 없음 | (f.kinds as readonly string[]).includes(value)<br>call |

## H-fe7d57c17b3d

**@callback:Array.from** · [src/ui/statistics.tsx:203](../../../src/ui/statistics.tsx#L203)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 204행 | truthy: valid | shiftDay(from, i * step)<br>call |
| 205행 | truthy: valid | shiftDay(from, Math.min(days - 1, (i + 1) * step - 1))<br>call |
| 205행 | truthy: valid | Math.min(days - 1, (i + 1) * step - 1)<br>call |
| 206행 | truthy: valid | statisticBounds({ ...metric, items: metric.items.filter((item) => item.date.kind === 'exact') }, lo, hi)<br>call |
| 207행 | truthy: valid | metric.items.filter((item) => item.date.kind === 'exact')<br>call<br>전달 콜백: H-be3b77643da0 |
| 211행 | truthy: valid | statisticBounds({ ...metric, items: metric.items.filter((item) => item.date.kind === 'exact') }, shiftDay(previousFrom, i * step), shiftDay(previousFrom, Math.min(days - 1, (i + 1) * step - 1)))<br>call |
| 212행 | truthy: valid | metric.items.filter((item) => item.date.kind === 'exact')<br>call<br>전달 콜백: H-e387ceb9b9f1 |
| 213행 | truthy: valid | shiftDay(previousFrom, i * step)<br>call |
| 214행 | truthy: valid | shiftDay(previousFrom, Math.min(days - 1, (i + 1) * step - 1))<br>call |
| 214행 | truthy: valid | Math.min(days - 1, (i + 1) * step - 1)<br>call |

반환/조기 중단: 216행 { lo, hi, current, prev } [truthy: valid]

## H-be3b77643da0

**@callback:metric.items.filter** · [src/ui/statistics.tsx:207](../../../src/ui/statistics.tsx#L207)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e387ceb9b9f1

**@callback:metric.items.filter** · [src/ui/statistics.tsx:212](../../../src/ui/statistics.tsx#L212)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5a1d811026b4

**@callback:bins.flatMap** · [src/ui/statistics.tsx:222](../../../src/ui/statistics.tsx#L222)

분기 조건과 가능한 갈림길:

- B-1f75b8c59c5a · ConditionalExpression · compare → truthy / falsy; 바깥 조건: 별도 조건식 없음 (222행).

## H-930d5a81e502

**@callback:useEffect** · [src/ui/statistics.tsx:225](../../../src/ui/statistics.tsx#L225)

분기 조건과 가능한 갈림길:

- B-479e5d78abb3 · IfStatement · !playing || reduceMotion → truthy / falsy; 바깥 조건: 별도 조건식 없음 (226행).
- B-51a411c9f62a · IfStatement · reduceMotion → truthy / falsy; 바깥 조건: truthy: !playing || reduceMotion (227행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 227행 | truthy: !playing \|\| reduceMotion ∧ truthy: reduceMotion | setPlaying(false)<br>state-update |
| 230행 | 별도 조건식 없음 | window.setInterval(() => setCursor((i) => { const next = (i ?? -1) + 1; if (next >= bins.length) { setPlaying(false); return bins.length - 1; } return next; }), 900)<br>call<br>전달 콜백: H-cce2b1c25a5a |

반환/조기 중단: 228행 <render> [truthy: !playing || reduceMotion]; 242행 () => window.clearInterval(timer) [별도 조건식 없음]

## H-cce2b1c25a5a

**@callback:window.setInterval** · [src/ui/statistics.tsx:231](../../../src/ui/statistics.tsx#L231)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 232행 | 별도 조건식 없음 | setCursor((i) => { const next = (i ?? -1) + 1; if (next >= bins.length) { setPlaying(false); return bins.length - 1; } return next; })<br>state-update<br>전달 콜백: H-39c2fcbccbee |

## H-39c2fcbccbee

**@callback:setCursor** · [src/ui/statistics.tsx:232](../../../src/ui/statistics.tsx#L232)

분기 조건과 가능한 갈림길:

- B-9e86421dfb10 · IfStatement · next >= bins.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (234행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 235행 | truthy: next >= bins.length | setPlaying(false)<br>state-update |

반환/조기 중단: 236행 bins.length - 1 [truthy: next >= bins.length]; 238행 next [별도 조건식 없음]

## H-9ddddb5d61ac

**openEvidence** · [src/ui/statistics.tsx:251](../../../src/ui/statistics.tsx#L251)

분기 조건과 가능한 갈림길:

- B-6555de8f87ec · IfStatement · compact → truthy / falsy; 바깥 조건: 별도 조건식 없음 (252행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 256행 | 별도 조건식 없음 | setFrozen(null)<br>state-update |
| 258행 | 별도 조건식 없음 | items.map((item) => [ `${item.id}:${item.recordIds.join(',')}:${item.eventIds.join(',')}`, item, ])<br>call<br>전달 콜백: H-00622cb5b754 |
| 263행 | 별도 조건식 없음 | setSelected({ label, items: [...unique.values()], unit })<br>state-update |
| 263행 | 별도 조건식 없음 | unique.values()<br>call |

반환/조기 중단: 254행 <render> [truthy: compact]

## H-00622cb5b754

**@callback:items.map** · [src/ui/statistics.tsx:258](../../../src/ui/statistics.tsx#L258)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 259행 | 별도 조건식 없음 | item.recordIds.join(',')<br>call |
| 259행 | 별도 조건식 없음 | item.eventIds.join(',')<br>call |

## H-ea9a0babf5f1

**dateLabel** · [src/ui/statistics.tsx:265](../../../src/ui/statistics.tsx#L265)

분기 조건과 가능한 갈림길:

- B-6ead29ba1f98 · ConditionalExpression · i.date.kind === 'unknown' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (266행).
- B-380f25a1f39a · ConditionalExpression · i.date.kind === 'exact' → truthy / falsy; 바깥 조건: falsy: i.date.kind === 'unknown' (268행).

## H-41ee8517ea8b

**chart** · [src/ui/statistics.tsx:292](../../../src/ui/statistics.tsx#L292)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 306행 | 별도 조건식 없음 | [0, 0.5, 1].map((r) => ( <g key={r}> <line className="grid" x1="40" y1={210 - r * 180} x2="790" y2={210 - r * 180} /> <text x="4" y={215 - r * 180}> {maximum * r} </text> </g> ))<br>call<br>전달 콜백: H-cb7c1012d8cf |
| 314행 | 별도 조건식 없음 | bins.map((b, i) => { const width = 740 / Math.max(1, bins.length), x = 45 + i * width; return ( // biome-ignore lint/a11y/useSemanticElements: this SVG group implements Enter/Space and a transparent touch target. <g key={b.lo} className="bar-control" data-shared-selected={ sharedMatch ? b.current.evidence.some(sharedMatch) : undefined } style={{ opacity: cursor !== null && i > cursor ? 0.35 : 1 }} role="button" tabIndex={0} aria-label={`${b.lo}${b.lo === b.hi ? '' : `부터 ${b.hi}`} ${b.current.lower}${metric.unit} · 근거 보기`} onClick={() => openEvidence(`${b.lo}–${b.hi}`, b.current.evidence)} onKeyDown={(e) => { if (e.key === 'Enter' \|\| e.key === ' ') { e.preventDefault(); openEvidence(`${b.lo}–${b.hi}`, … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-aa6b44e8157e |

반환/조기 중단: 293행 <render> [별도 조건식 없음]

## H-cb7c1012d8cf

**@callback:[0, 0.5, 1].map** · [src/ui/statistics.tsx:306](../../../src/ui/statistics.tsx#L306)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-aa6b44e8157e

**@callback:bins.map** · [src/ui/statistics.tsx:314](../../../src/ui/statistics.tsx#L314)

분기 조건과 가능한 갈림길:

- B-8ff7ed0f2572 · ConditionalExpression · sharedMatch → truthy / falsy; 바깥 조건: 별도 조건식 없음 (323행).
- B-6bf675ac0c2b · ConditionalExpression · cursor !== null && i > cursor → truthy / falsy; 바깥 조건: 별도 조건식 없음 (325행).
- B-b83c55bb40a7 · ConditionalExpression · b.lo === b.hi → truthy / falsy; 바깥 조건: 별도 조건식 없음 (328행).
- B-1ab6ba7497ad · ConditionalExpression · compare → truthy / falsy; 바깥 조건: 별도 조건식 없음 (340행).
- B-3f3bd80f7cb4 · ConditionalExpression · compare → truthy / falsy; 바깥 조건: 별도 조건식 없음 (354행).
- B-38fead5e8c5c · ConditionalExpression · compare → truthy / falsy; 바깥 조건: 별도 조건식 없음 (356행).
- B-ba2ecfc7f698 · ConditionalExpression · compare → truthy / falsy; 바깥 조건: truthy: view === 'depth' && b.current.lower > 0 (363행).
- B-09ec4f6b313a · ConditionalExpression · compare → truthy / falsy; 바깥 조건: truthy: view === 'depth' && b.current.lower > 0 (363행).
- B-9945eb9c6a87 · ConditionalExpression · compare → truthy / falsy; 바깥 조건: truthy: view === 'depth' && b.current.lower > 0 (363행).
- B-47359ec9168d · ConditionalExpression · compare → truthy / falsy; 바깥 조건: truthy: view === 'depth' && b.current.lower > 0 (363행).
- B-62aa1d7ddeed · ConditionalExpression · compare → truthy / falsy; 바깥 조건: truthy: view === 'depth' && b.current.lower > 0 (367행).
- B-617cd555fd22 · ConditionalExpression · compare → truthy / falsy; 바깥 조건: truthy: view === 'depth' && b.current.lower > 0 (367행).
- B-bbc513aac1ca · ConditionalExpression · compare → truthy / falsy; 바깥 조건: truthy: view === 'depth' && b.current.lower > 0 (367행).
- B-bf59b0bff34d · ConditionalExpression · compare → truthy / falsy; 바깥 조건: truthy: view === 'depth' && b.current.lower > 0 (367행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 315행 | 별도 조건식 없음 | Math.max(1, bins.length)<br>call |
| 323행 | truthy: sharedMatch | b.current.evidence.some(sharedMatch)<br>call |
| 373행 | 별도 조건식 없음 | b.lo.slice(5)<br>call |

반환/조기 중단: 317행 <render> [별도 조건식 없음]

## H-8e6d64131f42

**@onClick** · [src/ui/statistics.tsx:329](../../../src/ui/statistics.tsx#L329)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 329행 | 별도 조건식 없음 | openEvidence(`${b.lo}–${b.hi}`, b.current.evidence)<br>call → [H-9ddddb5d61ac](ui__statistics.md#h-9ddddb5d61ac) |

## H-5b7432b67bf6

**@onKeyDown** · [src/ui/statistics.tsx:330](../../../src/ui/statistics.tsx#L330)

분기 조건과 가능한 갈림길:

- B-a461a5b47e4d · IfStatement · e.key === 'Enter' || e.key === ' ' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (331행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 332행 | truthy: e.key === 'Enter' \|\| e.key === ' ' | e.preventDefault()<br>input-control |
| 333행 | truthy: e.key === 'Enter' \|\| e.key === ' ' | openEvidence(`${b.lo}–${b.hi}`, b.current.evidence)<br>call → [H-9ddddb5d61ac](ui__statistics.md#h-9ddddb5d61ac) |

## H-b14e4105412a

**@onChange** · [src/ui/statistics.tsx:401](../../../src/ui/statistics.tsx#L401)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 401행 | 별도 조건식 없음 | setSelectionFrom(e.target.value)<br>state-update |

## H-fde2c446c3b7

**@onChange** · [src/ui/statistics.tsx:407](../../../src/ui/statistics.tsx#L407)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 407행 | 별도 조건식 없음 | setSelectionTo(e.target.value)<br>state-update |

## H-7193529b4650

**@onChange** · [src/ui/statistics.tsx:412](../../../src/ui/statistics.tsx#L412)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 412행 | 별도 조건식 없음 | setSelectionSubject(e.target.value)<br>state-update |

## H-de35efbbce68

**@callback:data.subjects
              .filter** · [src/ui/statistics.tsx:416](../../../src/ui/statistics.tsx#L416)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 416행 | truthy: !s.deletedAt | subjectIds.includes(s.id)<br>call |

## H-63f1de63753e

**@callback:data.subjects
              .filter((s) => !s.deletedAt && subjectIds.includes(s.id))
              .map** · [src/ui/statistics.tsx:417](../../../src/ui/statistics.tsx#L417)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0d67438474ae

**@onClick** · [src/ui/statistics.tsx:427](../../../src/ui/statistics.tsx#L427)

분기 조건과 가능한 갈림길:

- B-8b1d10912d94 · ConditionalExpression · selectionSubject → truthy / falsy; 바깥 조건: 별도 조건식 없음 (430행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 428행 | 별도 조건식 없음 | setSharedSelection({ owner: selectionOwner, label: `${selectionFrom}–${selectionTo} · 정확한 날짜${selectionSubject ? ' · 선택한 과목' : ''}`, period: { from: selectionFrom, to: selectionTo }, subjectId: selectionSubject \|\| undefined, })<br>state-update |

## H-ced497f1f321

**@onClick** · [src/ui/statistics.tsx:440](../../../src/ui/statistics.tsx#L440)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 441행 | 별도 조건식 없음 | setSharedSelection({ owner: selectionOwner, label: data.subjects.find((s) => s.id === selectionSubject)?.name \|\| '선택한 과목', subjectId: selectionSubject, })<br>state-update |
| 443행 | 별도 조건식 없음 | data.subjects.find((s) => s.id === selectionSubject)<br>call<br>전달 콜백: H-6a85b7c20cb3 |

## H-6a85b7c20cb3

**@callback:data.subjects.find** · [src/ui/statistics.tsx:443](../../../src/ui/statistics.tsx#L443)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-20e3fbbdbe1f

**@onClick** · [src/ui/statistics.tsx:450](../../../src/ui/statistics.tsx#L450)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 450행 | 별도 조건식 없음 | setSharedSelection(null)<br>state-update |

## H-4f0ed98013ca

**@callback:metrics.flatMap** · [src/ui/statistics.tsx:456](../../../src/ui/statistics.tsx#L456)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 456행 | truthy: sharedMatch | statisticBounds(m, from, to).evidence.filter(sharedMatch)<br>call |
| 456행 | truthy: sharedMatch | statisticBounds(m, from, to)<br>call |

## H-7f611263be06

**@callback:metrics.flatMap** · [src/ui/statistics.tsx:456](../../../src/ui/statistics.tsx#L456)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 456행 | truthy: sharedMatch | statisticBounds(m, from, to)<br>call |

## H-fbc8d17cd956

**@onClick** · [src/ui/statistics.tsx:462](../../../src/ui/statistics.tsx#L462)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 463행 | truthy: sharedMatch | openEvidence('함께 선택한 원기록', metrics.flatMap((m) => statisticBounds(m, from, to).evidence.filter(sharedMatch)), '')<br>call → [H-9ddddb5d61ac](ui__statistics.md#h-9ddddb5d61ac) |
| 465행 | truthy: sharedMatch | metrics.flatMap((m) => statisticBounds(m, from, to).evidence.filter(sharedMatch))<br>call<br>전달 콜백: H-939bea6645bb |

## H-939bea6645bb

**@callback:metrics.flatMap** · [src/ui/statistics.tsx:465](../../../src/ui/statistics.tsx#L465)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 465행 | truthy: sharedMatch | statisticBounds(m, from, to).evidence.filter(sharedMatch)<br>call |
| 465행 | truthy: sharedMatch | statisticBounds(m, from, to)<br>call |

## H-9b2cb1830ecf

**@onChange** · [src/ui/statistics.tsx:482](../../../src/ui/statistics.tsx#L482)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 484행 | 별도 조건식 없음 | setOverview(e.target.checked)<br>state-update |

## H-f2d29549316b

**@onSelect** · [src/ui/statistics.tsx:494](../../../src/ui/statistics.tsx#L494)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 494행 | truthy: overview && valid | selectEvidence(row.label, row.items)<br>call → [H-39599473704c](ui__statistics.md#h-39599473704c) |

## H-01ef254dc1d2

**@onOpen** · [src/ui/statistics.tsx:495](../../../src/ui/statistics.tsx#L495)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 495행 | truthy: overview && valid | openEvidence(row.label, row.items, row.unit ?? metric.unit)<br>call → [H-9ddddb5d61ac](ui__statistics.md#h-9ddddb5d61ac) |

## H-5681c683f314

**@onChange** · [src/ui/statistics.tsx:513](../../../src/ui/statistics.tsx#L513)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 515행 | falsy: !valid | setMetric(e.target.value as MetricId)<br>state-update |

## H-8397e4b5c4f9

**@callback:metrics.map** · [src/ui/statistics.tsx:518](../../../src/ui/statistics.tsx#L518)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ada57856330b

**@callback:data.subjects.find** · [src/ui/statistics.tsx:528](../../../src/ui/statistics.tsx#L528)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-306142e949b5

**@onChange** · [src/ui/statistics.tsx:535](../../../src/ui/statistics.tsx#L535)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 535행 | falsy: !valid | chooseFamily(e.target.value as ChartFamily)<br>call → [H-9029f5f500f3](ui__statistics.md#h-9029f5f500f3) |

## H-15d94cd4e2c3

**@callback:chartFamilies.map** · [src/ui/statistics.tsx:537](../../../src/ui/statistics.tsx#L537)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-841fa5781f2c

**@onChange** · [src/ui/statistics.tsx:546](../../../src/ui/statistics.tsx#L546)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 548행 | falsy: !valid | setKind(e.target.value as ChartKind)<br>state-update |
| 549행 | falsy: !valid | setView('graph')<br>state-update |

## H-f3d988ec66dd

**@callback:chartFamilies
                  .find** · [src/ui/statistics.tsx:553](../../../src/ui/statistics.tsx#L553)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fef91ff8e6c7

**@callback:chartFamilies
                  .find((f) => f.id === family)!
                  .kinds.map** · [src/ui/statistics.tsx:554](../../../src/ui/statistics.tsx#L554)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c2011633ad55

**@onChange** · [src/ui/statistics.tsx:564](../../../src/ui/statistics.tsx#L564)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 566행 | falsy: !valid ∧ truthy: family === 'relationship' && kind !== 'heatmap' | setSecondMetric(e.target.value as MetricId)<br>state-update |

## H-bd7b1332198d

**@callback:metrics.map** · [src/ui/statistics.tsx:569](../../../src/ui/statistics.tsx#L569)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-50c834538ed6

**@onOpen** · [src/ui/statistics.tsx:596](../../../src/ui/statistics.tsx#L596)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 596행 | falsy: !valid ∧ falsy: readError && ['attempts', 'successes', 'corrections'].includes(metricId) ∧ truthy: view !== 'list' ∧ falsy: view === 'depth' \|\| kind === 'column' | openEvidence(row.label, row.items, row.unit ?? metric.unit)<br>call → [H-9ddddb5d61ac](ui__statistics.md#h-9ddddb5d61ac) |

## H-38ea07730273

**@onSelect** · [src/ui/statistics.tsx:606](../../../src/ui/statistics.tsx#L606)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 606행 | falsy: !valid ∧ falsy: readError && ['attempts', 'successes', 'corrections'].includes(metricId) ∧ falsy: view !== 'list' | selectEvidence(row.label, row.items)<br>call → [H-39599473704c](ui__statistics.md#h-39599473704c) |

## H-0d62619a5cd4

**@onOpen** · [src/ui/statistics.tsx:607](../../../src/ui/statistics.tsx#L607)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 607행 | falsy: !valid ∧ falsy: readError && ['attempts', 'successes', 'corrections'].includes(metricId) ∧ falsy: view !== 'list' | openEvidence(row.label, row.items, row.unit ?? metric.unit)<br>call → [H-9ddddb5d61ac](ui__statistics.md#h-9ddddb5d61ac) |

## H-761c32448e04

**@onSelect** · [src/ui/statistics.tsx:616](../../../src/ui/statistics.tsx#L616)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 616행 | falsy: !valid ∧ truthy: view !== 'list' && view !== 'depth' && kind !== 'column' | selectEvidence(row.label, row.items)<br>call → [H-39599473704c](ui__statistics.md#h-39599473704c) |

## H-aba33c97d7a1

**@onOpen** · [src/ui/statistics.tsx:617](../../../src/ui/statistics.tsx#L617)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 617행 | falsy: !valid ∧ truthy: view !== 'list' && view !== 'depth' && kind !== 'column' | openEvidence(row.label, row.items, row.unit ?? metric.unit)<br>call → [H-9ddddb5d61ac](ui__statistics.md#h-9ddddb5d61ac) |

## H-a27ca968ae49

**@callback:bins.some** · [src/ui/statistics.tsx:622](../../../src/ui/statistics.tsx#L622)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f5b17a5fe3ad

**@onClick** · [src/ui/statistics.tsx:639](../../../src/ui/statistics.tsx#L639)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 639행 | falsy: !valid | setZoom((z) => (z === 1 ? 2 : 1))<br>state-update<br>전달 콜백: H-98dc23729af3 |

## H-98dc23729af3

**@callback:setZoom** · [src/ui/statistics.tsx:639](../../../src/ui/statistics.tsx#L639)

분기 조건과 가능한 갈림길:

- B-74cab1d53b26 · ConditionalExpression · z === 1 → truthy / falsy; 바깥 조건: falsy: !valid (639행).

## H-82647ffae6c0

**@onClick** · [src/ui/statistics.tsx:644](../../../src/ui/statistics.tsx#L644)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 645행 | falsy: !valid | openEvidence(`${from}–${to} · 전체 근거`, statisticBounds(metric, from, to).evidence)<br>call → [H-9ddddb5d61ac](ui__statistics.md#h-9ddddb5d61ac) |
| 647행 | falsy: !valid | statisticBounds(metric, from, to)<br>call |

## H-3e840b9cc8eb

**@onClick** · [src/ui/statistics.tsx:657](../../../src/ui/statistics.tsx#L657)

분기 조건과 가능한 갈림길:

- B-1fdfa75e14c1 · IfStatement · playing → truthy / falsy; 바깥 조건: falsy: !valid (658행).
- B-bc0a066bcba8 · IfStatement · family !== 'trend' → truthy / falsy; 바깥 조건: falsy: !valid ∧ falsy: playing (660행).
- B-04a0136ccaa8 · IfStatement · view === 'list' → truthy / falsy; 바깥 조건: falsy: !valid ∧ falsy: playing (661행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 658행 | falsy: !valid ∧ truthy: playing | setPlaying(false)<br>state-update |
| 660행 | falsy: !valid ∧ falsy: playing ∧ truthy: family !== 'trend' | chooseFamily('trend')<br>call → [H-9029f5f500f3](ui__statistics.md#h-9029f5f500f3) |
| 661행 | falsy: !valid ∧ falsy: playing ∧ truthy: view === 'list' | setView('graph')<br>state-update |
| 662행 | falsy: !valid ∧ falsy: playing | setCursor(-1)<br>state-update |
| 663행 | falsy: !valid ∧ falsy: playing | setPlaying(true)<br>state-update |

## H-6060d1773872

**@onClick** · [src/ui/statistics.tsx:672](../../../src/ui/statistics.tsx#L672)

분기 조건과 가능한 갈림길:

- B-329b43a310dd · IfStatement · family !== 'trend' → truthy / falsy; 바깥 조건: falsy: !valid (674행).
- B-e6c1a46d49a5 · IfStatement · view === 'list' → truthy / falsy; 바깥 조건: falsy: !valid (675행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 673행 | falsy: !valid | setPlaying(false)<br>state-update |
| 674행 | falsy: !valid ∧ truthy: family !== 'trend' | chooseFamily('trend')<br>call → [H-9029f5f500f3](ui__statistics.md#h-9029f5f500f3) |
| 675행 | falsy: !valid ∧ truthy: view === 'list' | setView('graph')<br>state-update |
| 676행 | falsy: !valid | setCursor((i) => Math.min(bins.length - 1, (i ?? -1) + 1))<br>state-update<br>전달 콜백: H-74439a89687b |

## H-74439a89687b

**@callback:setCursor** · [src/ui/statistics.tsx:676](../../../src/ui/statistics.tsx#L676)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 676행 | falsy: !valid | Math.min(bins.length - 1, (i ?? -1) + 1)<br>call |

## H-a7cbbe2e9a10

**@onClick** · [src/ui/statistics.tsx:683](../../../src/ui/statistics.tsx#L683)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 684행 | falsy: !valid | setPlaying(false)<br>state-update |
| 685행 | falsy: !valid | setCursor(null)<br>state-update |

## H-d2065199c982

**@callback:metric.items
                .filter** · [src/ui/statistics.tsx:717](../../../src/ui/statistics.tsx#L717)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8a750434f185

**@callback:metric.items
                .filter((i) => i.date.kind !== 'exact' || i.maximum === null)
                .map** · [src/ui/statistics.tsx:718](../../../src/ui/statistics.tsx#L718)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 719행 | falsy: !valid | i.recordIds.join()<br>call |
| 720행 | falsy: !valid | dateLabel(i)<br>call → [H-ea9a0babf5f1](ui__statistics.md#h-ea9a0babf5f1) |
| 720행 | falsy: !valid | format(i.value, i.maximum)<br>call → [H-9bab9822114e](ui__statistics.md#h-9bab9822114e) |

## H-45f9ff27ca8a

**@callback:metrics.map** · [src/ui/statistics.tsx:727](../../../src/ui/statistics.tsx#L727)

분기 조건과 가능한 갈림길:

- B-4dab565b3007 · ConditionalExpression · unavailable → truthy / falsy; 바깥 조건: falsy: !valid (745행).
- B-c2de1557e815 · ConditionalExpression · m.denominator !== undefined → truthy / falsy; 바깥 조건: falsy: !valid (746행).
- B-ba4c1c38f90f · ConditionalExpression · b.undated → truthy / falsy; 바깥 조건: falsy: !valid (750행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 728행 | falsy: !valid | statisticBounds(m, from, to)<br>call |
| 729행 | falsy: !valid | statisticBounds(m, previousFrom, previousTo)<br>call |
| 731행 | falsy: !valid ∧ truthy: readError | ['attempts', 'successes', 'corrections'].includes(m.id)<br>call |
| 745행 | falsy: !valid ∧ falsy: unavailable | format(b.lower, b.upper)<br>call → [H-9bab9822114e](ui__statistics.md#h-9bab9822114e) |
| 752행 | falsy: !valid ∧ truthy: compare | format(prev.lower, prev.upper)<br>call → [H-9bab9822114e](ui__statistics.md#h-9bab9822114e) |

반환/조기 중단: 732행 <render> [falsy: !valid]

## H-c5f24229ed73

**@onClick** · [src/ui/statistics.tsx:738](../../../src/ui/statistics.tsx#L738)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 740행 | falsy: !valid | setMetric(m.id)<br>state-update |

## H-e17baf909402

**@onChange** · [src/ui/statistics.tsx:764](../../../src/ui/statistics.tsx#L764)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 764행 | 별도 조건식 없음 | setFrom(e.target.value)<br>state-update |

## H-8bbcaf313479

**@onChange** · [src/ui/statistics.tsx:766](../../../src/ui/statistics.tsx#L766)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 766행 | 별도 조건식 없음 | setTo(e.target.value)<br>state-update |

## H-f8327d4f032c

**@onChange** · [src/ui/statistics.tsx:770](../../../src/ui/statistics.tsx#L770)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 771행 | 별도 조건식 없음 | setSubject(e.target.value)<br>state-update |
| 772행 | 별도 조건식 없음 | setNode('')<br>state-update |

## H-970fd785c561

**@callback:data.subjects
            .filter** · [src/ui/statistics.tsx:777](../../../src/ui/statistics.tsx#L777)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 777행 | truthy: !s.deletedAt | subjectIds.includes(s.id)<br>call |

## H-24d1d2938fa3

**@callback:data.subjects
            .filter((s) => !s.deletedAt && subjectIds.includes(s.id))
            .map** · [src/ui/statistics.tsx:778](../../../src/ui/statistics.tsx#L778)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5195ed880e4f

**@onChange** · [src/ui/statistics.tsx:784](../../../src/ui/statistics.tsx#L784)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 784행 | 별도 조건식 없음 | setNode(e.target.value)<br>state-update |

## H-73d7a1542340

**@callback:data.nodes
            .filter** · [src/ui/statistics.tsx:788](../../../src/ui/statistics.tsx#L788)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 790행 | truthy: !n.deletedAt | subjectIds.includes(n.subjectId)<br>call |

## H-cda34b3ef002

**@callback:data.nodes
            .filter(
              (n) =>
                !n.deletedAt &&
                subjectIds.includes(n.subjectId) &&
                (!subjectId || n.subjectId === subjectId),
            )
            .map** · [src/ui/statistics.tsx:793](../../../src/ui/statistics.tsx#L793)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 795행 | 별도 조건식 없음 | data.subjects.find((s) => s.id === n.subjectId)<br>call<br>전달 콜백: H-3d6cadfe3751 |

## H-3d6cadfe3751

**@callback:data.subjects.find** · [src/ui/statistics.tsx:795](../../../src/ui/statistics.tsx#L795)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-575f91d9c51c

**@callback:[7, 14, 30].map** · [src/ui/statistics.tsx:801](../../../src/ui/statistics.tsx#L801)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-611d7f47e516

**@onClick** · [src/ui/statistics.tsx:805](../../../src/ui/statistics.tsx#L805)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 806행 | 별도 조건식 없음 | setFrom(shiftDay(today, 1 - n))<br>state-update |
| 806행 | 별도 조건식 없음 | shiftDay(today, 1 - n)<br>call |
| 807행 | 별도 조건식 없음 | setTo(today)<br>state-update |

## H-ad87e5999381

**@onChange** · [src/ui/statistics.tsx:816](../../../src/ui/statistics.tsx#L816)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 816행 | 별도 조건식 없음 | setCompare(e.target.checked)<br>state-update |

## H-bb0c921df2a6

**@onOpen** · [src/ui/statistics.tsx:826](../../../src/ui/statistics.tsx#L826)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 827행 | 별도 조건식 없음 | calendarMonth(month)<br>call |
| 828행 | 별도 조건식 없음 | setFrom(period.from)<br>state-update |
| 829행 | 별도 조건식 없음 | setTo(period.to)<br>state-update |
| 830행 | 별도 조건식 없음 | setMetric(id)<br>state-update |
| 831행 | 별도 조건식 없음 | openEvidence(`${month} · 월간 원기록`, items, unit)<br>call → [H-9ddddb5d61ac](ui__statistics.md#h-9ddddb5d61ac) |

## H-f43075e6ff92

**@onClose** · [src/ui/statistics.tsx:837](../../../src/ui/statistics.tsx#L837)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 838행 | truthy: Boolean(selection) | setFrozen(null)<br>state-update |
| 839행 | truthy: Boolean(selection) | setSelected(null)<br>state-update |

## H-4086a0512d01

**@onClick** · [src/ui/statistics.tsx:847](../../../src/ui/statistics.tsx#L847)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 847행 | truthy: Boolean(selection) ∧ truthy: selection | selectEvidence(selection.label, selection.items)<br>call → [H-39599473704c](ui__statistics.md#h-39599473704c) |

## H-995de8304692

**@onClick** · [src/ui/statistics.tsx:854](../../../src/ui/statistics.tsx#L854)

분기 조건과 가능한 갈림길:

- B-7013053525fd · ConditionalExpression · frozen → truthy / falsy; 바깥 조건: truthy: Boolean(selection) ∧ truthy: selection (856행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 855행 | truthy: Boolean(selection) ∧ truthy: selection | setFrozen(frozen ? null : structuredClone({ ...selection, source: data, events: workspace.events }))<br>state-update |
| 858행 | truthy: Boolean(selection) ∧ truthy: selection ∧ falsy: frozen | structuredClone({ ...selection, source: data, events: workspace.events })<br>call |

## H-bcb2174106db

**@callback:selection.items.map** · [src/ui/statistics.tsx:871](../../../src/ui/statistics.tsx#L871)

분기 조건과 가능한 갈림길:

- B-bd9d7e020a2e · ConditionalExpression · sharedMatch → truthy / falsy; 바깥 조건: truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length (874행).
- B-03755c4e5f79 · ConditionalExpression · datePlacement(i.date, from, to) === 'possible' → truthy / falsy; 바깥 조건: truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length (886행).
- B-d5d72416b2f6 · ConditionalExpression · i.date.kind === 'unknown' → truthy / falsy; 바깥 조건: truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length ∧ falsy: datePlacement(i.date, from, to) === 'possible' (888행).
- B-4f424d2c3820 · ConditionalExpression · selection.unit → truthy / falsy; 바깥 조건: truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length ∧ falsy: datePlacement(i.date, from, to) === 'possible' ∧ falsy: i.date.kind === 'unknown' (890행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 873행 | truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length | i.recordIds.join(',')<br>call |
| 873행 | truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length | i.eventIds.join(',')<br>call |
| 874행 | truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length ∧ truthy: sharedMatch | sharedMatch(i)<br>call |
| 878행 | truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length | Boolean(sharedMatch?.(i))<br>call |
| 885행 | truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length | dateLabel(i)<br>call → [H-ea9a0babf5f1](ui__statistics.md#h-ea9a0babf5f1) |
| 886행 | truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length | datePlacement(i.date, from, to)<br>call |
| 894행 | truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length | i.recordIds.map((id) => { const r = sourceData.records.find((r) => r.id === id); return ( r && ( <div key={id}> <p>{r.body \|\| '남긴 글 없음'}</p> <a href={`#/node/${encodeURIComponent(r.targetId)}`}> 주제에서 원기록 열기 </a> </div> ) ); })<br>call<br>전달 콜백: H-46c813c85034 |
| 907행 | truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length | i.eventIds.map((id) => { const e = sourceEvents.find((e) => e.id === id); return ( e && ( <div key={id}> <p>{e.answer \|\| '남긴 답변 없음'}</p> <p> {e.kind === 'correction' ? '교정 기록' : e.result === 'pass' ? '기준 충족' : e.result === 'fail' ? '막힘' : '결과 미확인'}{' '} · 자기 보고 </p> <a href="#/">다음 공부에서 결과 열기</a> </div> ) ); })<br>call<br>전달 콜백: H-6b37f15bf201 |

## H-5fbd83595538

**@onClick** · [src/ui/statistics.tsx:879](../../../src/ui/statistics.tsx#L879)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 879행 | truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length | selectEvidence(i.label, [i])<br>call → [H-39599473704c](ui__statistics.md#h-39599473704c) |

## H-46c813c85034

**@callback:i.recordIds.map** · [src/ui/statistics.tsx:894](../../../src/ui/statistics.tsx#L894)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 895행 | truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length | sourceData.records.find((r) => r.id === id)<br>call<br>전달 콜백: H-860f63e3507f |
| 900행 | truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length ∧ truthy: r | encodeURIComponent(r.targetId)<br>call |

반환/조기 중단: 896행 r && ( <div key={id}> <p>{r.body || '남긴 글 없음'}</p> <a href={`#/node/${encodeURIComponent(r.targetId)}`}> 주제에서 원기록 열기 </a> </div> ) [truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length]

## H-860f63e3507f

**@callback:sourceData.records.find** · [src/ui/statistics.tsx:895](../../../src/ui/statistics.tsx#L895)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6b37f15bf201

**@callback:i.eventIds.map** · [src/ui/statistics.tsx:907](../../../src/ui/statistics.tsx#L907)

분기 조건과 가능한 갈림길:

- B-0e8dc09bc221 · ConditionalExpression · e.kind === 'correction' → truthy / falsy; 바깥 조건: truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length ∧ truthy: e (914행).
- B-cd4c6e1b5179 · ConditionalExpression · e.result === 'pass' → truthy / falsy; 바깥 조건: truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length ∧ truthy: e ∧ falsy: e.kind === 'correction' (916행).
- B-0613ee408a4e · ConditionalExpression · e.result === 'fail' → truthy / falsy; 바깥 조건: truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length ∧ truthy: e ∧ falsy: e.kind === 'correction' ∧ falsy: e.result === 'pass' (918행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 908행 | truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length | sourceEvents.find((e) => e.id === id)<br>call<br>전달 콜백: H-fd8c9df4ef92 |

반환/조기 중단: 909행 e && ( <div key={id}> <p>{e.answer || '남긴 답변 없음'}</p> <p> {e.kind === 'correction' ? '교정 기록' : e.result === 'pass' ? '기준 충족' : e.result === 'fail' ? '막힘' : '결과 미확인'}{' '} · 자기 보고 </p> <a href="#/">다음 공부에서 결과 열기</a> </div> ) [truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length]

## H-fd8c9df4ef92

**@callback:sourceEvents.find** · [src/ui/statistics.tsx:908](../../../src/ui/statistics.tsx#L908)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

