# src/ui/next-study.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-2e0924378198

**NextStudy** · [src/ui/next-study.tsx:24](../../../src/ui/next-study.tsx#L24)

분기 조건과 가능한 갈림길:

- B-fc92d472ad19 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (46행).
- B-f62daeee87bb · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (46행).
- B-b43fa9d5ea8b · IfStatement · !blocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (52행).
- B-f361b8df3c24 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: !blocked (52행).
- B-f4f916809f64 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: !blocked (52행).
- B-b565d7032cea · ConditionalExpression · responseId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (99행).
- B-eb3d67496af5 · IfStatement · onlySchedules → truthy / falsy; 바깥 조건: 별도 조건식 없음 (122행).
- B-4df1c1e3be48 · ConditionalExpression · response.delayVerified → truthy / falsy; 바깥 조건: truthy: Boolean(responseId) ∧ truthy: response (185행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 26행 | 별도 조건식 없음 | useState(() => { try { return { ...(repository ? readLearningPlan(data) : readRecommendations(data)), error: '' }; } catch { return { raw: null, workspace: emptyRecommendations(data), error: '추천 내용을 읽지 못했습니다. 저장된 내용은 덮어쓰지 않았습니다. 다시 읽어 주세요.' }; } })<br>call<br>전달 콜백: H-4516e283d35b |
| 27행 | 별도 조건식 없음 | useState(boot.workspace)<br>call |
| 27행 | 별도 조건식 없음 | useRef(workspace)<br>call |
| 27행 | 별도 조건식 없음 | useRef(boot.raw)<br>call |
| 28행 | 별도 조건식 없음 | useState(boot.error)<br>call |
| 28행 | 별도 조건식 없음 | useState(Boolean(boot.error))<br>call |
| 28행 | 별도 조건식 없음 | Boolean(boot.error)<br>call |
| 29행 | 별도 조건식 없음 | useState(false)<br>call |
| 29행 | 별도 조건식 없음 | useState(null)<br>call |
| 30행 | 별도 조건식 없음 | useState(false)<br>call |
| 31행 | 별도 조건식 없음 | useState(() => new Date().toISOString())<br>call<br>전달 콜백: H-e415fdc026c9 |
| 32행 | 별도 조건식 없음 | useEffect(() => { const refresh = () => setNow(new Date().toISOString()); const timer = window.setInterval(refresh, 60000); window.addEventListener('focus', refresh); document.addEventListener('visibilitychange', refresh); return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); }; }, [])<br>call<br>전달 콜백: H-e98fb9fad231 |
| 38행 | 별도 조건식 없음 | useEffect(() => { if (!repository) return; try { const saved=readLearningPlan(data); if(saved.raw === raw.current) return; if(JSON.stringify(current.current) === raw.current \|\| raw.current === null && current.current.revision === 0) { current.current=saved.workspace;raw.current=saved.raw;setWorkspace(saved.workspace); } else setError('서버의 변경과 작성 중인 내용을 모두 유지했습니다. 현재 입력을 보존한 뒤 다시 열어 주세요.'); } catch { setError('저장된 학습 일정을 다시 읽지 못했습니다. 작성 중인 내용은 유지했습니다.'); } }, [data,repository])<br>call<br>전달 콜백: H-3728f07b480f |
| 46행 | 별도 조건식 없음 | readLegacyPersonalPlan(data)<br>call |
| 48행 | 별도 조건식 없음 | data.nodes.filter(n => !n.deletedAt && n.userId === data.userId && n.namespace === data.namespace && n.role === 'topic' && subjectIds.includes(n.subjectId))<br>call<br>전달 콜백: H-1a474a675079 |
| 49행 | 별도 조건식 없음 | workspace.goals.filter(g => nodes.some(n => n.id === g.targetId))<br>call<br>전달 콜백: H-e1bdf1e2da2a |
| 52행 | truthy: !blocked | nextStudy(data, workspace, now, subjectIds, semesterId)<br>call |
| 83행 | 별도 조건식 없음 | data.semesters.filter(s => !s.deletedAt && s.userId === data.userId && s.namespace === data.namespace)<br>call<br>전달 콜백: H-420c3b08ff55 |
| 115행 | 별도 조건식 없음 | nodes.filter(n => {<br>    const control = workspace.controls[`target:${n.id}`];<br>    return !goals.some(g => g.targetId === n.id) && (!control?.snoozeUntil \|\| Date.parse(control.snoozeUntil) <= Date.parse(now));<br>  }).slice(0, Math.max(0, 3 - visible.length))<br>call |
| 115행 | 별도 조건식 없음 | nodes.filter(n => { const control = workspace.controls[`target:${n.id}`]; return !goals.some(g => g.targetId === n.id) && (!control?.snoozeUntil \|\| Date.parse(control.snoozeUntil) <= Date.parse(now)); })<br>call<br>전달 콜백: H-f0c0011412e8 |
| 118행 | 별도 조건식 없음 | Math.max(0, 3 - visible.length)<br>call |
| 127행 | truthy: legacyPersonal?.raw | JSON.stringify(legacyPersonal.workspace, null, 2)<br>call |
| 134행 | truthy: !blocked && !calculationError | visible.map(card => { const node = nodes.find(n => n.id === card.targetId); if (!node) { const schedule=workspace.schedules?.find(s=>card.id.startsWith(`task:${s.id}:`)); return schedule && <Card key={card.groupId}><h3>{schedule.name}</h3><p>{({ prepare:"과제 준비", submit:"과제 제출", watch:"강의 재생", learn:"강의 학습", attendance:"출석 확인" } as Record<string,string>)[card.action] ?? card.action} 상태를 확인해 주세요.</p><p className="muted">{schedule.dueDate \|\| "기한 미정"} · 완료는 일정에서 직접 남겨 주세요.</p><Button variant="quiet" className="schedule-navigation" onClick={() => openLearningSchedules()}>일정에서 확인하기</Button></Card>; } return node && <Card key={card.groupId}> <p className="muted">{data.subjects.find(s => s.id === node.subjectId … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-de344a4d88bf |
| 152행 | truthy: !blocked | fallback.map(node => <Card key={node.id}><p className="muted">{data.subjects.find(s => s.id === node.subjectId)?.name}</p><h3>{node.name}</h3> <p>{data.records.some(r => !r.deletedAt && r.targetId === node.id) ? '남긴 기록을 보고, 다음에 확인할 내용을 골라 보세요.' : '핵심과 사용 조건부터 살펴보세요. 아직 남긴 기록이 없습니다.'}</p> <div className="actions"><Button onClick={() => navigate(`/node/${node.id}`)}>주제 열고 시작하기</Button><Button variant="quiet" onClick={() => snooze(node.id)}>하루 보류</Button></div></Card>)<br>call<br>전달 콜백: H-e21ea3980a0d |
| 157행 | 별도 조건식 없음 | Object.values(workspace.controls).some(c => c.snoozeUntil)<br>call<br>전달 콜백: H-48365c6a5e83 |
| 157행 | 별도 조건식 없음 | Object.values(workspace.controls)<br>call |
| 158행 | truthy: goals.length > 0 | goals.map(goal => <div className="next-study-goal" key={goal.id}><strong>{goal.label}</strong> {result?.adaptations?.find(a=>a.goalId===goal.id) && <p>조건을 갖춘 비교 기록에서는 {result.adaptations.find(a=>a.goalId===goal.id)!.action} 방법을 우선 살펴볼 수 있습니다. 관찰된 비교이며 효과 확정은 아닙니다.</p>}<p>{goal.ended ? '추천에서 제외한 내용입니다. 원문과 결과는 남아 있습니다.' : goal.dueDate && Date.parse(dateDeadline(goal.dueDate)!) < Date.parse(now) ? '기한이 지났습니다. 완료 여부는 별도로 확인해 주세요.' : explanations[result?.states[goal.id]?.status ?? 'unobserved']}</p> {evidence(goal.id)}<div className="actions"><Button disabled={blocked \|\| !serverReady} onClick={() => beginResponse(goal.id)}>결과 추가</Button><Button variant="quiet" disabled={blocked \|\| !serverReady} onClick={( … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-69d330af9322 |
| 165행 | truthy: planOpen | nodes.map(n => <option key={n.id} value={n.id}>{data.subjects.find(s => s.id === n.subjectId)?.name} · {n.name}</option>)<br>call<br>전달 콜백: H-21459814131b |
| 174행 | truthy: termOpen | semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)<br>call<br>전달 콜백: H-cc62b23a147f |
| 179행 | truthy: Boolean(responseId) | Boolean(responseId)<br>call |
| 180행 | truthy: Boolean(responseId) ∧ truthy: response | goals.find(g => g.id === responseId)<br>call<br>전달 콜백: H-09ba9684bae1 |

반환/조기 중단: 122행 <render> [truthy: onlySchedules]; 123행 <render> [별도 조건식 없음]

## H-4516e283d35b

**@callback:useState** · [src/ui/next-study.tsx:26](../../../src/ui/next-study.tsx#L26)

분기 조건과 가능한 갈림길:

- B-c8bf86483cac · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (26행).
- B-f30df4bbde85 · ConditionalExpression · repository → truthy / falsy; 바깥 조건: 별도 조건식 없음 (26행).
- B-501b52e65980 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (26행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 26행 | truthy: repository | readLearningPlan(data)<br>call |
| 26행 | falsy: repository | readRecommendations(data)<br>call |
| 26행 | exception: exception | emptyRecommendations(data)<br>call |

반환/조기 중단: 26행 { ...(repository ? readLearningPlan(data) : readRecommendations(data)), error: '' } [별도 조건식 없음]; 26행 { raw: null, workspace: emptyRecommendations(data), error: '추천 내용을 읽지 못했습니다. 저장된 내용은 덮어쓰지 않았습니다. 다시 읽어 주세요.' } [exception: exception]

## H-e415fdc026c9

**@callback:useState** · [src/ui/next-study.tsx:31](../../../src/ui/next-study.tsx#L31)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 31행 | 별도 조건식 없음 | new Date().toISOString()<br>call |

## H-e98fb9fad231

**@callback:useEffect** · [src/ui/next-study.tsx:32](../../../src/ui/next-study.tsx#L32)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 34행 | 별도 조건식 없음 | window.setInterval(refresh, 60000)<br>call<br>전달 콜백: H-d5993e744385 |
| 35행 | 별도 조건식 없음 | window.addEventListener('focus', refresh)<br>call<br>전달 콜백: H-d5993e744385 |
| 35행 | 별도 조건식 없음 | document.addEventListener('visibilitychange', refresh)<br>call<br>전달 콜백: H-d5993e744385 |

반환/조기 중단: 36행 () => { window.clearInterval(timer); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); } [별도 조건식 없음]

## H-d5993e744385

**refresh** · [src/ui/next-study.tsx:33](../../../src/ui/next-study.tsx#L33)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 33행 | 별도 조건식 없음 | setNow(new Date().toISOString())<br>state-update |
| 33행 | 별도 조건식 없음 | new Date().toISOString()<br>call |

## H-3728f07b480f

**@callback:useEffect** · [src/ui/next-study.tsx:38](../../../src/ui/next-study.tsx#L38)

분기 조건과 가능한 갈림길:

- B-c73b09fb161f · IfStatement · !repository → truthy / falsy; 바깥 조건: 별도 조건식 없음 (39행).
- B-f5f006c1eabe · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (40행).
- B-d6374a6b0715 · IfStatement · saved.raw === raw.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (40행).
- B-385bd7d126e8 · IfStatement · JSON.stringify(current.current) === raw.current || raw.current === null && current.current.revision === 0 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (41행).
- B-7191ee6b9806 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (43행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 40행 | 별도 조건식 없음 | readLearningPlan(data)<br>call |
| 41행 | 별도 조건식 없음 | JSON.stringify(current.current)<br>call |
| 41행 | truthy: JSON.stringify(current.current) === raw.current \|\| raw.current === null && current.current.revision === 0 | setWorkspace(saved.workspace)<br>state-update |
| 42행 | falsy: JSON.stringify(current.current) === raw.current \|\| raw.current === null && current.current.revision === 0 | setError('서버의 변경과 작성 중인 내용을 모두 유지했습니다. 현재 입력을 보존한 뒤 다시 열어 주세요.')<br>state-update |
| 43행 | exception: exception | setError('저장된 학습 일정을 다시 읽지 못했습니다. 작성 중인 내용은 유지했습니다.')<br>state-update |

반환/조기 중단: 39행 <render> [truthy: !repository]; 40행 <render> [truthy: saved.raw === raw.current]

## H-71f5c77200a7

**importLegacy** · [src/ui/next-study.tsx:47](../../../src/ui/next-study.tsx#L47)

분기 조건과 가능한 갈림길:

- B-cf5df527279d · IfStatement · !legacyPersonal?.raw||!repository → truthy / falsy; 바깥 조건: 별도 조건식 없음 (47행).
- B-d8ba9fd479d8 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (47행).
- B-a3bd52fa1c47 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (47행).
- B-8d674dbd41e9 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (47행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 47행 | 별도 조건식 없음 | saveLearningPlan(repository, legacyPersonal.workspace, raw.current)<br>call |
| 47행 | 별도 조건식 없음 | JSON.stringify(legacyPersonal.workspace)<br>call |
| 47행 | 별도 조건식 없음 | setWorkspace(legacyPersonal.workspace)<br>state-update |
| 47행 | 별도 조건식 없음 | setError('')<br>state-update |
| 47행 | exception: e | setError(e instanceof Error?e.message:'이전 내용을 가져오지 못했습니다. 원문은 보존했습니다.')<br>state-update |

반환/조기 중단: 47행 <render> [truthy: !legacyPersonal?.raw||!repository]

## H-1a474a675079

**@callback:data.nodes.filter** · [src/ui/next-study.tsx:48](../../../src/ui/next-study.tsx#L48)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 48행 | truthy: !n.deletedAt && n.userId === data.userId && n.namespace === data.namespace && n.role === 'topic' | subjectIds.includes(n.subjectId)<br>call |

## H-e1bdf1e2da2a

**@callback:workspace.goals.filter** · [src/ui/next-study.tsx:49](../../../src/ui/next-study.tsx#L49)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 49행 | 별도 조건식 없음 | nodes.some(n => n.id === g.targetId)<br>call<br>전달 콜백: H-659aa40554f8 |

## H-659aa40554f8

**@callback:nodes.some** · [src/ui/next-study.tsx:49](../../../src/ui/next-study.tsx#L49)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b9fafe08a2d3

**save** · [src/ui/next-study.tsx:53](../../../src/ui/next-study.tsx#L53)

분기 조건과 가능한 갈림길:

- B-c0066e1ceb80 · IfStatement · repository → truthy / falsy; 바깥 조건: 별도 조건식 없음 (53행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 53행 | truthy: repository | saveLearningPlan(repository, next, raw.current)<br>call |
| 53행 | truthy: repository | JSON.stringify(next)<br>call |
| 53행 | 별도 조건식 없음 | saveRecommendations(data, next, raw.current)<br>call |

반환/조기 중단: 53행 JSON.stringify(next) [truthy: repository]; 53행 saveRecommendations(data,next,raw.current) [별도 조건식 없음]

## H-5e12f7cadcf8

**write** · [src/ui/next-study.tsx:54](../../../src/ui/next-study.tsx#L54)

분기 조건과 가능한 갈림길:

- B-992a9194d1ab · IfStatement · blocked || !serverReady → truthy / falsy; 바깥 조건: 별도 조건식 없음 (55행).
- B-33a273c8d4d0 · IfStatement · changed === current.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (57행).
- B-2a91779dc3a6 · IfStatement · !retainInput && changed.snapshots === current.current.snapshots → truthy / falsy; 바깥 조건: 별도 조건식 없음 (59행).
- B-8b7e84bfa364 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: !retainInput && changed.snapshots === current.current.snapshots (60행).
- B-c1dee75c5896 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: !retainInput && changed.snapshots === current.current.snapshots (62행).
- B-dbbfef553a2f · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (64행).
- B-3ed375c7e9ba · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (65행).
- B-e0264727f5de · IfStatement · retainInput → truthy / falsy; 바깥 조건: exception: e (65행).
- B-0635b2ec36f3 · ConditionalExpression · e instanceof Error && !(e instanceof DOMException) → truthy / falsy; 바깥 조건: exception: e (65행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 55행 | truthy: blocked \|\| !serverReady | setError('학습 일정을 저장하지 못했습니다. 작성한 내용은 이 기기에 보관됩니다. 다시 접속한 뒤 저장해 주세요.')<br>state-update |
| 56행 | 별도 조건식 없음 | change(current.current)<br>call |
| 60행 | truthy: !retainInput && changed.snapshots === current.current.snapshots | new Date().toISOString()<br>call |
| 60행 | truthy: !retainInput && changed.snapshots === current.current.snapshots | recommendationInput(data, next, subjectIds, semesterId)<br>call |
| 60행 | truthy: !retainInput && changed.snapshots === current.current.snapshots | nextStudy(data, next, at, subjectIds, semesterId)<br>call |
| 61행 | truthy: !retainInput && changed.snapshots === current.current.snapshots | crypto.randomUUID()<br>call |
| 61행 | truthy: !retainInput && changed.snapshots === current.current.snapshots | JSON.stringify({model:input.model,events:input.events,recordVersions:data.records.map(r=>[r.id,r.version]),controls:next.controls})<br>call |
| 61행 | truthy: !retainInput && changed.snapshots === current.current.snapshots | data.records.map(r=>[r.id,r.version])<br>call<br>전달 콜백: H-710b264ee5c9 |
| 62행 | truthy: !retainInput && changed.snapshots === current.current.snapshots ∧ exception: exception | setError('추천 근거를 계산하지 못했습니다. 작성 내용은 유지했습니다.')<br>state-update |
| 64행 | 별도 조건식 없음 | save(next)<br>call → [H-b9fafe08a2d3](ui__next-study.md#h-b9fafe08a2d3) |
| 64행 | 별도 조건식 없음 | setWorkspace(next)<br>state-update |
| 64행 | 별도 조건식 없음 | setError('')<br>state-update |
| 65행 | exception: e ∧ truthy: retainInput | setWorkspace(next)<br>state-update |
| 65행 | exception: e | setError(e instanceof Error && !(e instanceof DOMException) ? e.message : '추천 내용을 저장하지 못했습니다. 작성 중인 내용은 화면에 유지합니다. 다시 저장해 주세요.')<br>state-update |

반환/조기 중단: 55행 false [truthy: blocked || !serverReady]; 57행 true [truthy: changed === current.current]; 62행 false [truthy: !retainInput && changed.snapshots === current.current.snapshots ∧ exception: exception]; 64행 true [별도 조건식 없음]; 65행 false [exception: e]

## H-710b264ee5c9

**@callback:data.records.map** · [src/ui/next-study.tsx:61](../../../src/ui/next-study.tsx#L61)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ee91b7993f3d

**retry** · [src/ui/next-study.tsx:67](../../../src/ui/next-study.tsx#L67)

분기 조건과 가능한 갈림길:

- B-2b2c62ce7b60 · IfStatement · !blocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (68행).
- B-98059ed59bb2 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: !blocked (69행).
- B-32b095afbd61 · ConditionalExpression · repository → truthy / falsy; 바깥 조건: truthy: !blocked (70행).
- B-a7dd8deff3fe · IfStatement · saved.raw === intended → truthy / falsy; 바깥 조건: truthy: !blocked (71행).
- B-70512a88eb1a · IfStatement · saved.raw !== raw.current → truthy / falsy; 바깥 조건: truthy: !blocked (72행).
- B-b9f2a9ef9309 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: !blocked (74행).
- B-2a3d00809a1a · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (77행).
- B-eae8f055e3a8 · ConditionalExpression · repository → truthy / falsy; 바깥 조건: 별도 조건식 없음 (77행).
- B-86cdb491eae4 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (78행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 70행 | truthy: !blocked ∧ truthy: repository | readLearningPlan(repository.getSnapshot())<br>call |
| 70행 | truthy: !blocked ∧ truthy: repository | repository.getSnapshot()<br>call |
| 70행 | truthy: !blocked ∧ falsy: repository | readRecommendations(data)<br>call |
| 70행 | truthy: !blocked | JSON.stringify(current.current)<br>call |
| 71행 | truthy: !blocked ∧ truthy: saved.raw === intended | setError('')<br>state-update |
| 72행 | truthy: !blocked ∧ truthy: saved.raw !== raw.current | setError('다른 곳에서 저장된 내용과 다릅니다. 작성 중인 내용은 화면에 유지하며 덮어쓰지 않았습니다.')<br>state-update |
| 73행 | truthy: !blocked | save(current.current)<br>call → [H-b9fafe08a2d3](ui__next-study.md#h-b9fafe08a2d3) |
| 73행 | truthy: !blocked | setError('')<br>state-update |
| 74행 | truthy: !blocked ∧ exception: exception | setError('추천 내용을 다시 저장하지 못했습니다. 작성 중인 내용은 화면에 유지합니다.')<br>state-update |
| 77행 | truthy: repository | readLearningPlan(repository.getSnapshot())<br>call |
| 77행 | truthy: repository | repository.getSnapshot()<br>call |
| 77행 | falsy: repository | readRecommendations(data)<br>call |
| 77행 | 별도 조건식 없음 | setWorkspace(saved.workspace)<br>state-update |
| 77행 | 별도 조건식 없음 | setBlocked(false)<br>state-update |
| 77행 | 별도 조건식 없음 | setError('')<br>state-update |
| 78행 | exception: exception | setError('추천 내용을 다시 읽지 못했습니다. 저장된 원문은 그대로 보존했습니다.')<br>state-update |

반환/조기 중단: 71행 <render> [truthy: !blocked ∧ truthy: saved.raw === intended]; 72행 <render> [truthy: !blocked ∧ truthy: saved.raw !== raw.current]; 75행 <render> [truthy: !blocked]

## H-768bfdc4af86

**termChange** · [src/ui/next-study.tsx:82](../../../src/ui/next-study.tsx#L82)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 82행 | 별도 조건식 없음 | write(w => (w.termDraft ?? termDraft)[field] === value ? w : { ...w, termDraft: { ...(w.termDraft ?? termDraft), [field]: value } }, true)<br>call → [H-5e12f7cadcf8](ui__next-study.md#h-5e12f7cadcf8)<br>전달 콜백: H-8a0b3c5bcbbe |

## H-8a0b3c5bcbbe

**@callback:write** · [src/ui/next-study.tsx:82](../../../src/ui/next-study.tsx#L82)

분기 조건과 가능한 갈림길:

- B-46923f1f129a · ConditionalExpression · (w.termDraft ?? termDraft)[field] === value → truthy / falsy; 바깥 조건: 별도 조건식 없음 (82행).

## H-420c3b08ff55

**@callback:data.semesters.filter** · [src/ui/next-study.tsx:83](../../../src/ui/next-study.tsx#L83)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fb482c7fb1cd

**saveTerm** · [src/ui/next-study.tsx:84](../../../src/ui/next-study.tsx#L84)

분기 조건과 가능한 갈림길:

- B-7f6280648e00 · IfStatement · !d || !semesters.some(s => s.id === d.semesterId) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (86행).
- B-ed13b863a168 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (87행).
- B-ab0d5a1290b2 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (87행).
- B-6cb8851ec41d · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (87행).
- B-512624b4d2dd · IfStatement · write(w => ({ ...w, terms: { ...w.terms, [d.semesterId]: { start: d.start, end: d.end } } })) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (88행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 86행 | falsy: !d | semesters.some(s => s.id === d.semesterId)<br>call<br>전달 콜백: H-a90f12fec930 |
| 86행 | truthy: !d \|\| !semesters.some(s => s.id === d.semesterId) | setError('기간을 남길 학기를 골라 주세요.')<br>state-update |
| 87행 | 별도 조건식 없음 | termPeriod(d)<br>call |
| 87행 | exception: e | setError(e instanceof Error ? e.message : '학기 기간을 다시 확인해 주세요.')<br>state-update |
| 88행 | 별도 조건식 없음 | write(w => ({ ...w, terms: { ...w.terms, [d.semesterId]: { start: d.start, end: d.end } } }))<br>call → [H-5e12f7cadcf8](ui__next-study.md#h-5e12f7cadcf8)<br>전달 콜백: H-60a063b2c8fc |
| 88행 | truthy: write(w => ({ ...w, terms: { ...w.terms, [d.semesterId]: { start: d.start, end: d.end } } })) | setTermOpen(false)<br>state-update |

반환/조기 중단: 86행 <render> [truthy: !d || !semesters.some(s => s.id === d.semesterId)]; 87행 <render> [exception: e]

## H-a90f12fec930

**@callback:semesters.some** · [src/ui/next-study.tsx:86](../../../src/ui/next-study.tsx#L86)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-60a063b2c8fc

**@callback:write** · [src/ui/next-study.tsx:88](../../../src/ui/next-study.tsx#L88)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7bf1421c1b4e

**draftChange** · [src/ui/next-study.tsx:90](../../../src/ui/next-study.tsx#L90)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 90행 | 별도 조건식 없음 | write(w => ({ ...w, draft: { ...w.draft, ...patch } }), true)<br>call → [H-5e12f7cadcf8](ui__next-study.md#h-5e12f7cadcf8)<br>전달 콜백: H-056b891c97c3 |

## H-056b891c97c3

**@callback:write** · [src/ui/next-study.tsx:90](../../../src/ui/next-study.tsx#L90)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5b4eb5a3404b

**addGoal** · [src/ui/next-study.tsx:91](../../../src/ui/next-study.tsx#L91)

분기 조건과 가능한 갈림길:

- B-b41a6dd17a40 · IfStatement · !d.label.trim() || !nodes.some(n => n.id === d.targetId) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (93행).
- B-ffab297b5287 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (94행).
- B-c7340b0b4fae · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (94행).
- B-f21d602422eb · IfStatement · write(w => ({ ...w, goals: [...w.goals, goal], draft: { ...w.draft, label: '', dueDate: '' } })) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (96행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 93행 | 별도 조건식 없음 | d.label.trim()<br>call |
| 93행 | falsy: !d.label.trim() | nodes.some(n => n.id === d.targetId)<br>call<br>전달 콜백: H-7c42524e1c2b |
| 93행 | truthy: !d.label.trim() \|\| !nodes.some(n => n.id === d.targetId) | setError('주제와 확인할 내용을 골라 주세요.')<br>state-update |
| 94행 | 별도 조건식 없음 | dateDeadline(d.dueDate)<br>call |
| 94행 | exception: exception | setError('기한을 다시 확인하거나 비워 두세요.')<br>state-update |
| 95행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 95행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 96행 | 별도 조건식 없음 | write(w => ({ ...w, goals: [...w.goals, goal], draft: { ...w.draft, label: '', dueDate: '' } }))<br>call → [H-5e12f7cadcf8](ui__next-study.md#h-5e12f7cadcf8)<br>전달 콜백: H-77e7355b49be |
| 96행 | truthy: write(w => ({ ...w, goals: [...w.goals, goal], draft: { ...w.draft, label: '', dueDate: '' } })) | setPlanOpen(false)<br>state-update |

반환/조기 중단: 93행 <render> [truthy: !d.label.trim() || !nodes.some(n => n.id === d.targetId)]; 94행 <render> [exception: exception]

## H-7c42524e1c2b

**@callback:nodes.some** · [src/ui/next-study.tsx:93](../../../src/ui/next-study.tsx#L93)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-77e7355b49be

**@callback:write** · [src/ui/next-study.tsx:96](../../../src/ui/next-study.tsx#L96)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4745b0e8d769

**beginResponse** · [src/ui/next-study.tsx:98](../../../src/ui/next-study.tsx#L98)

분기 조건과 가능한 갈림길:

- B-eb2b56b11f9d · IfStatement · write(w => ({ ...w, responses: { ...w.responses, [id]: w.responses[id] ?? emptyResponse() } })) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (98행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 98행 | 별도 조건식 없음 | write(w => ({ ...w, responses: { ...w.responses, [id]: w.responses[id] ?? emptyResponse() } }))<br>call → [H-5e12f7cadcf8](ui__next-study.md#h-5e12f7cadcf8)<br>전달 콜백: H-7af57c3b9423 |
| 98행 | truthy: write(w => ({ ...w, responses: { ...w.responses, [id]: w.responses[id] ?? emptyResponse() } })) | setResponseId(id)<br>state-update |

## H-7af57c3b9423

**@callback:write** · [src/ui/next-study.tsx:98](../../../src/ui/next-study.tsx#L98)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 98행 | nullish: w.responses[id] | emptyResponse()<br>call |

## H-a274753209ca

**responseChange** · [src/ui/next-study.tsx:100](../../../src/ui/next-study.tsx#L100)

분기 조건과 가능한 갈림길:

- B-aafe931bed4b · IfStatement · responseId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (100행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 100행 | truthy: responseId | write(w => ({ ...w, responses: { ...w.responses, [responseId]: { ...w.responses[responseId], ...patch } } }), true)<br>call → [H-5e12f7cadcf8](ui__next-study.md#h-5e12f7cadcf8)<br>전달 콜백: H-c83ad8015d99 |

## H-c83ad8015d99

**@callback:write** · [src/ui/next-study.tsx:100](../../../src/ui/next-study.tsx#L100)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-accac0d16ec4

**saveResponse** · [src/ui/next-study.tsx:101](../../../src/ui/next-study.tsx#L101)

분기 조건과 가능한 갈림길:

- B-5f086409bcaa · IfStatement · !responseId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (102행).
- B-53d361b2be09 · IfStatement · !goal || !answer → truthy / falsy; 바깥 조건: 별도 조건식 없음 (104행).
- B-e9200ecda621 · IfStatement · write(w => { const responses = { ...w.responses }; delete responses[responseId]; return { ...w, events: [...w.events, event], responses, controls: { ...w.controls, [`target:${goal.targetId}`]: {} } }; }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (106행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 103행 | 별도 조건식 없음 | w.goals.find(g => g.id === responseId)<br>call<br>전달 콜백: H-911cd54f8906 |
| 105행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 105행 | 별도 조건식 없음 | makeResultEvent(goal, answer, w, at, crypto.randomUUID())<br>call |
| 105행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 106행 | 별도 조건식 없음 | write(w => { const responses = { ...w.responses }; delete responses[responseId]; return { ...w, events: [...w.events, event], responses, controls: { ...w.controls, [`target:${goal.targetId}`]: {} } }; })<br>call → [H-5e12f7cadcf8](ui__next-study.md#h-5e12f7cadcf8)<br>전달 콜백: H-697342bb1f7a |
| 106행 | truthy: write(w => { const responses = { ...w.responses }; delete responses[responseId]; return { ...w, events: [...w.events, event], responses, controls: { ...w.controls, [`target:${goal.targetId}`]: {} } }; }) | setNow(at)<br>state-update |
| 106행 | truthy: write(w => { const responses = { ...w.responses }; delete responses[responseId]; return { ...w, events: [...w.events, event], responses, controls: { ...w.controls, [`target:${goal.targetId}`]: {} } }; }) | setResponseId(null)<br>state-update |

반환/조기 중단: 102행 <render> [truthy: !responseId]; 104행 <render> [truthy: !goal || !answer]

## H-911cd54f8906

**@callback:w.goals.find** · [src/ui/next-study.tsx:103](../../../src/ui/next-study.tsx#L103)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-697342bb1f7a

**@callback:write** · [src/ui/next-study.tsx:106](../../../src/ui/next-study.tsx#L106)


반환/조기 중단: 106행 { ...w, events: [...w.events, event], responses, controls: { ...w.controls, [`target:${goal.targetId}`]: {} } } [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8cc1aaad906e

**correct** · [src/ui/next-study.tsx:108](../../../src/ui/next-study.tsx#L108)

분기 조건과 가능한 갈림길:

- B-1ed256f99a68 · IfStatement · !state || state.status !== 'error_open' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (109행).
- B-5d6b4697a180 · IfStatement · write(w => ({ ...w, events: [...w.events, event] })) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (112행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 110행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 111행 | 별도 조건식 없음 | makeResultEvent(goal, emptyResponse(), current.current, at, crypto.randomUUID())<br>call |
| 111행 | 별도 조건식 없음 | emptyResponse()<br>call |
| 111행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 112행 | 별도 조건식 없음 | write(w => ({ ...w, events: [...w.events, event] }))<br>call → [H-5e12f7cadcf8](ui__next-study.md#h-5e12f7cadcf8)<br>전달 콜백: H-1da5789b455d |
| 112행 | truthy: write(w => ({ ...w, events: [...w.events, event] })) | setNow(at)<br>state-update |

반환/조기 중단: 109행 <render> [truthy: !state || state.status !== 'error_open']

## H-1da5789b455d

**@callback:write** · [src/ui/next-study.tsx:112](../../../src/ui/next-study.tsx#L112)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f0c0011412e8

**@callback:nodes.filter** · [src/ui/next-study.tsx:115](../../../src/ui/next-study.tsx#L115)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 117행 | 별도 조건식 없음 | goals.some(g => g.targetId === n.id)<br>call<br>전달 콜백: H-dac11b127533 |
| 117행 | truthy: !goals.some(g => g.targetId === n.id) ∧ falsy: !control?.snoozeUntil | Date.parse(control.snoozeUntil)<br>call |
| 117행 | truthy: !goals.some(g => g.targetId === n.id) ∧ falsy: !control?.snoozeUntil | Date.parse(now)<br>call |

반환/조기 중단: 117행 !goals.some(g => g.targetId === n.id) && (!control?.snoozeUntil || Date.parse(control.snoozeUntil) <= Date.parse(now)) [별도 조건식 없음]

## H-dac11b127533

**@callback:goals.some** · [src/ui/next-study.tsx:117](../../../src/ui/next-study.tsx#L117)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1c5186779f7f

**snooze** · [src/ui/next-study.tsx:119](../../../src/ui/next-study.tsx#L119)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 119행 | 별도 조건식 없음 | write(w => ({ ...w, controls: { ...w.controls, [`target:${targetId}`]: { snoozeUntil: new Date(Date.now() + DAY).toISOString() } } }))<br>call → [H-5e12f7cadcf8](ui__next-study.md#h-5e12f7cadcf8)<br>전달 콜백: H-62ee5ee710b7 |

## H-62ee5ee710b7

**@callback:write** · [src/ui/next-study.tsx:119](../../../src/ui/next-study.tsx#L119)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 119행 | 별도 조건식 없음 | new Date(Date.now() + DAY).toISOString()<br>call |
| 119행 | 별도 조건식 없음 | Date.now()<br>call |

## H-ef00cf4a23fe

**evidence** · [src/ui/next-study.tsx:120](../../../src/ui/next-study.tsx#L120)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f15adc9c6173

**@onChange** · [src/ui/next-study.tsx:121](../../../src/ui/next-study.tsx#L121)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 121행 | 별도 조건식 없음 | write(()=>w)<br>call → [H-5e12f7cadcf8](ui__next-study.md#h-5e12f7cadcf8)<br>전달 콜백: H-6407680551aa |

## H-6407680551aa

**@callback:write** · [src/ui/next-study.tsx:121](../../../src/ui/next-study.tsx#L121)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-46e319b69504

**@onClick** · [src/ui/next-study.tsx:128](../../../src/ui/next-study.tsx#L128)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 128행 | 별도 조건식 없음 | setPlanOpen(true)<br>state-update |

## H-de344a4d88bf

**@callback:visible.map** · [src/ui/next-study.tsx:134](../../../src/ui/next-study.tsx#L134)

분기 조건과 가능한 갈림길:

- B-0be30518598b · IfStatement · !node → truthy / falsy; 바깥 조건: truthy: !blocked && !calculationError (136행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 135행 | truthy: !blocked && !calculationError | nodes.find(n => n.id === card.targetId)<br>call<br>전달 콜백: H-e6b95fefebf8 |
| 138행 | truthy: !blocked && !calculationError ∧ truthy: node | data.subjects.find(s => s.id === node.subjectId)<br>call<br>전달 콜백: H-56bb84b6ccf3 |
| 140행 | truthy: !blocked && !calculationError ∧ truthy: node | card.requirements.map(id => { const goal = goals.find(g => g.id === id), state = result!.states[id]; return goal && <div key={id} className="next-study-goal"><strong>{goal.label}</strong> {result?.adaptations?.find(a=>a.goalId===goal.id) && <p>조건을 갖춘 비교 기록에서는 {result.adaptations.find(a=>a.goalId===goal.id)!.action} 방법을 우선 살펴볼 수 있습니다. 관찰된 비교이며 효과 확정은 아닙니다.</p>} <p>{state.status === 'confirmed' && !state.current ? '마지막 확인 뒤 시간이 지났습니다. 자료 없이 다시 확인해 보세요.' : explanations[state.status]}</p><p className="muted">{goal.dueDate ? `${goal.dueDate}까지 확인` : '기한 미정'}{goal.novelty === 'new' ? ' · 새 문항에서 확인' : ' · 같은 문항에서도 확인 가능'}</p> <div className="actions"><Button disabled={!serverReady} onClick={() => beginResponse(id)}>확인한  … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-6377c2ad998c |

반환/조기 중단: 136행 schedule && <Card key={card.groupId}><h3>{schedule.name}</h3><p>{({ prepare:"과제 준비", submit:"과제 제출", watch:"강의 재생", learn:"강의 학습", attendance:"출석 확인" } as Record<string,string>)[card.action] ?? card.action} 상태를 확인해 주세요.</p><p className="muted">{schedule.dueDate || "기한 미정"} · 완료는 일정에서 직접 남겨 주세요.</p><Button variant="quiet" className="schedule-navigation" onClick={() => openLearningSchedules()}>일정에서 확인하기</Button></Card> [truthy: !blocked && !calculationError ∧ truthy: !node]; 137행 node && <Card key={card.groupId}> <p className="muted">{data.subjects.find(s => s.id === node.subjectId)?.name}</p> <h3>{node.name}</h3> {card.requirements.map(id => { const goal = goals.find(g => g.id === id), state = result!.states[id]; return goal && <div key={id} className="next-study-goal"><strong>{goal.label}</strong> {result?.adaptations?.find(a=>a.goalId===goal.id) && <p>조건을 갖춘 비교 기록에서는 {result.adaptations.find(a=>a.goalId===goal.id)!.action} 방법을 우선 살펴볼 수 있습니다. 관찰된 비교이며 효과 확정은 아닙니다.</p>} <p>{state.status === 'confirmed' && !state.current ? '마지막 확인 뒤 시간이 지났습니다. 자료 없이 다시 확인해 보세요.' : explanations[state.status]}</p><p className="muted">{goal.dueDate ? `${goal.dueDate}까지 확인` : '기한 미정'}{go [truthy: !blocked && !calculationError]

## H-e6b95fefebf8

**@callback:nodes.find** · [src/ui/next-study.tsx:135](../../../src/ui/next-study.tsx#L135)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-34220cb42fd2

**@onClick** · [src/ui/next-study.tsx:136](../../../src/ui/next-study.tsx#L136)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 136행 | truthy: !blocked && !calculationError ∧ truthy: !node ∧ truthy: schedule | openLearningSchedules()<br>call |

## H-56bb84b6ccf3

**@callback:data.subjects.find** · [src/ui/next-study.tsx:138](../../../src/ui/next-study.tsx#L138)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6377c2ad998c

**@callback:card.requirements.map** · [src/ui/next-study.tsx:140](../../../src/ui/next-study.tsx#L140)

분기 조건과 가능한 갈림길:

- B-91a407fcf272 · ConditionalExpression · state.status === 'confirmed' && !state.current → truthy / falsy; 바깥 조건: truthy: !blocked && !calculationError ∧ truthy: node ∧ truthy: goal (144행).
- B-f8ca95665758 · ConditionalExpression · goal.dueDate → truthy / falsy; 바깥 조건: truthy: !blocked && !calculationError ∧ truthy: node ∧ truthy: goal (144행).
- B-e9c36a41b29c · ConditionalExpression · goal.novelty === 'new' → truthy / falsy; 바깥 조건: truthy: !blocked && !calculationError ∧ truthy: node ∧ truthy: goal (144행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 141행 | truthy: !blocked && !calculationError ∧ truthy: node | goals.find(g => g.id === id)<br>call<br>전달 콜백: H-140fd5818d10 |
| 143행 | truthy: !blocked && !calculationError ∧ truthy: node ∧ truthy: goal ∧ truthy: result?.adaptations?.find(a=>a.goalId===goal.id) | result.adaptations.find(a=>a.goalId===goal.id)<br>call<br>전달 콜백: H-e2fb7243c97f |
| 146행 | truthy: !blocked && !calculationError ∧ truthy: node ∧ truthy: goal | evidence(id)<br>call → [H-ef00cf4a23fe](ui__next-study.md#h-ef00cf4a23fe) |

반환/조기 중단: 142행 goal && <div key={id} className="next-study-goal"><strong>{goal.label}</strong> {result?.adaptations?.find(a=>a.goalId===goal.id) && <p>조건을 갖춘 비교 기록에서는 {result.adaptations.find(a=>a.goalId===goal.id)!.action} 방법을 우선 살펴볼 수 있습니다. 관찰된 비교이며 효과 확정은 아닙니다.</p>} <p>{state.status === 'confirmed' && !state.current ? '마지막 확인 뒤 시간이 지났습니다. 자료 없이 다시 확인해 보세요.' : explanations[state.status]}</p><p className="muted">{goal.dueDate ? `${goal.dueDate}까지 확인` : '기한 미정'}{goal.novelty === 'new' ? ' · 새 문항에서 확인' : ' · 같은 문항에서도 확인 가능'}</p> <div className="actions"><Button disabled={!serverReady} onClick={() => beginResponse(id)}>확인한 결과 남기기</Button>{state.status === 'error_open' && <Button variant="quiet" disabled={!se [truthy: !blocked && !calculationError ∧ truthy: node]

## H-140fd5818d10

**@callback:goals.find** · [src/ui/next-study.tsx:141](../../../src/ui/next-study.tsx#L141)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e2fb7243c97f

**@callback:result.adaptations.find** · [src/ui/next-study.tsx:143](../../../src/ui/next-study.tsx#L143)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-30df838b67fc

**@onClick** · [src/ui/next-study.tsx:145](../../../src/ui/next-study.tsx#L145)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 145행 | truthy: !blocked && !calculationError ∧ truthy: node ∧ truthy: goal | beginResponse(id)<br>call → [H-4745b0e8d769](ui__next-study.md#h-4745b0e8d769) |

## H-ca568afa9ba8

**@onClick** · [src/ui/next-study.tsx:145](../../../src/ui/next-study.tsx#L145)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 145행 | truthy: !blocked && !calculationError ∧ truthy: node ∧ truthy: goal ∧ truthy: state.status === 'error_open' | correct(goal)<br>call → [H-8cc1aaad906e](ui__next-study.md#h-8cc1aaad906e) |

## H-ef3a00c1260e

**@onClick** · [src/ui/next-study.tsx:149](../../../src/ui/next-study.tsx#L149)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 149행 | truthy: !blocked && !calculationError ∧ truthy: node | navigate(`/node/${node.id}`)<br>navigation |

## H-142a205d51fc

**@onClick** · [src/ui/next-study.tsx:149](../../../src/ui/next-study.tsx#L149)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 149행 | truthy: !blocked && !calculationError ∧ truthy: node | snooze(node.id)<br>call → [H-1c5186779f7f](ui__next-study.md#h-1c5186779f7f) |

## H-e21ea3980a0d

**@callback:fallback.map** · [src/ui/next-study.tsx:152](../../../src/ui/next-study.tsx#L152)

분기 조건과 가능한 갈림길:

- B-62d0c3eebfe0 · ConditionalExpression · data.records.some(r => !r.deletedAt && r.targetId === node.id) → truthy / falsy; 바깥 조건: truthy: !blocked (153행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 152행 | truthy: !blocked | data.subjects.find(s => s.id === node.subjectId)<br>call<br>전달 콜백: H-f56834a37795 |
| 153행 | truthy: !blocked | data.records.some(r => !r.deletedAt && r.targetId === node.id)<br>call<br>전달 콜백: H-7fe0f15af4de |

## H-f56834a37795

**@callback:data.subjects.find** · [src/ui/next-study.tsx:152](../../../src/ui/next-study.tsx#L152)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7fe0f15af4de

**@callback:data.records.some** · [src/ui/next-study.tsx:153](../../../src/ui/next-study.tsx#L153)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2f6e8b3406a4

**@onClick** · [src/ui/next-study.tsx:154](../../../src/ui/next-study.tsx#L154)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 154행 | truthy: !blocked | navigate(`/node/${node.id}`)<br>navigation |

## H-fc0686d9c1cc

**@onClick** · [src/ui/next-study.tsx:154](../../../src/ui/next-study.tsx#L154)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 154행 | truthy: !blocked | snooze(node.id)<br>call → [H-1c5186779f7f](ui__next-study.md#h-1c5186779f7f) |

## H-4bb8242d7ce9

**@onClick** · [src/ui/next-study.tsx:157](../../../src/ui/next-study.tsx#L157)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 157행 | 별도 조건식 없음 | navigate('/subjects')<br>navigation |

## H-5b1bf99daa9a

**@onClick** · [src/ui/next-study.tsx:157](../../../src/ui/next-study.tsx#L157)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 157행 | 별도 조건식 없음 | setTermOpen(true)<br>state-update |

## H-48365c6a5e83

**@callback:Object.values(workspace.controls).some** · [src/ui/next-study.tsx:157](../../../src/ui/next-study.tsx#L157)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-22ec11471d6a

**@onClick** · [src/ui/next-study.tsx:157](../../../src/ui/next-study.tsx#L157)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 157행 | truthy: Object.values(workspace.controls).some(c => c.snoozeUntil) | write(w => ({ ...w, controls: {} }))<br>call → [H-5e12f7cadcf8](ui__next-study.md#h-5e12f7cadcf8)<br>전달 콜백: H-ffafe7dfa2d5 |

## H-ffafe7dfa2d5

**@callback:write** · [src/ui/next-study.tsx:157](../../../src/ui/next-study.tsx#L157)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-69d330af9322

**@callback:goals.map** · [src/ui/next-study.tsx:158](../../../src/ui/next-study.tsx#L158)

분기 조건과 가능한 갈림길:

- B-5d6b220e1622 · ConditionalExpression · goal.ended → truthy / falsy; 바깥 조건: truthy: goals.length > 0 (159행).
- B-dea218b3a8c3 · ConditionalExpression · goal.dueDate && Date.parse(dateDeadline(goal.dueDate)!) < Date.parse(now) → truthy / falsy; 바깥 조건: truthy: goals.length > 0 ∧ falsy: goal.ended (159행).
- B-2aa5d61a6d3e · ConditionalExpression · goal.ended → truthy / falsy; 바깥 조건: truthy: goals.length > 0 (160행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 159행 | truthy: goals.length > 0 ∧ truthy: result?.adaptations?.find(a=>a.goalId===goal.id) | result.adaptations.find(a=>a.goalId===goal.id)<br>call<br>전달 콜백: H-1201b311e28a |
| 159행 | truthy: goals.length > 0 ∧ falsy: goal.ended ∧ truthy: goal.dueDate | Date.parse(dateDeadline(goal.dueDate)!)<br>call |
| 159행 | truthy: goals.length > 0 ∧ falsy: goal.ended ∧ truthy: goal.dueDate | dateDeadline(goal.dueDate)<br>call |
| 159행 | truthy: goals.length > 0 ∧ falsy: goal.ended ∧ truthy: goal.dueDate | Date.parse(now)<br>call |
| 160행 | truthy: goals.length > 0 | evidence(goal.id)<br>call → [H-ef00cf4a23fe](ui__next-study.md#h-ef00cf4a23fe) |

## H-1201b311e28a

**@callback:result.adaptations.find** · [src/ui/next-study.tsx:159](../../../src/ui/next-study.tsx#L159)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f2375f469373

**@onClick** · [src/ui/next-study.tsx:160](../../../src/ui/next-study.tsx#L160)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 160행 | truthy: goals.length > 0 | beginResponse(goal.id)<br>call → [H-4745b0e8d769](ui__next-study.md#h-4745b0e8d769) |

## H-8f53ec64569b

**@onClick** · [src/ui/next-study.tsx:160](../../../src/ui/next-study.tsx#L160)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 160행 | truthy: goals.length > 0 | write(w => ({ ...w, goals: w.goals.map(g => g.id === goal.id ? { ...g, ended: !g.ended } : g) }))<br>call → [H-5e12f7cadcf8](ui__next-study.md#h-5e12f7cadcf8)<br>전달 콜백: H-0d8b8103fc03 |

## H-0d8b8103fc03

**@callback:write** · [src/ui/next-study.tsx:160](../../../src/ui/next-study.tsx#L160)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 160행 | truthy: goals.length > 0 | w.goals.map(g => g.id === goal.id ? { ...g, ended: !g.ended } : g)<br>call<br>전달 콜백: H-fdfeeb4f0285 |

## H-fdfeeb4f0285

**@callback:w.goals.map** · [src/ui/next-study.tsx:160](../../../src/ui/next-study.tsx#L160)

분기 조건과 가능한 갈림길:

- B-f7f67e93bed4 · ConditionalExpression · g.id === goal.id → truthy / falsy; 바깥 조건: truthy: goals.length > 0 (160행).

## H-4a359b5cff0d

**@onClose** · [src/ui/next-study.tsx:163](../../../src/ui/next-study.tsx#L163)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 163행 | truthy: planOpen | setPlanOpen(false)<br>state-update |

## H-790460713e03

**@onChange** · [src/ui/next-study.tsx:165](../../../src/ui/next-study.tsx#L165)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 165행 | truthy: planOpen | draftChange({ targetId: e.target.value })<br>preservation-boundary → [H-7bf1421c1b4e](ui__next-study.md#h-7bf1421c1b4e) |

## H-21459814131b

**@callback:nodes.map** · [src/ui/next-study.tsx:165](../../../src/ui/next-study.tsx#L165)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 165행 | truthy: planOpen | data.subjects.find(s => s.id === n.subjectId)<br>call<br>전달 콜백: H-48a87771c49c |

## H-48a87771c49c

**@callback:data.subjects.find** · [src/ui/next-study.tsx:165](../../../src/ui/next-study.tsx#L165)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-161dcaa5c8a5

**@onChange** · [src/ui/next-study.tsx:166](../../../src/ui/next-study.tsx#L166)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 166행 | truthy: planOpen | draftChange({ label: e.target.value })<br>preservation-boundary → [H-7bf1421c1b4e](ui__next-study.md#h-7bf1421c1b4e) |

## H-3fe27b18c101

**@onChange** · [src/ui/next-study.tsx:167](../../../src/ui/next-study.tsx#L167)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 167행 | truthy: planOpen | draftChange({ novelty: e.target.value as 'same' \| 'new' })<br>preservation-boundary → [H-7bf1421c1b4e](ui__next-study.md#h-7bf1421c1b4e) |

## H-97e94ed02fa0

**@onChange** · [src/ui/next-study.tsx:168](../../../src/ui/next-study.tsx#L168)

분기 조건과 가능한 갈림길:

- B-9d0d18e08959 · ConditionalExpression · e.target.value==='' → truthy / falsy; 바깥 조건: truthy: planOpen (168행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 168행 | truthy: planOpen | draftChange({minDelayDays:e.target.value===''?undefined:Number(e.target.value)})<br>preservation-boundary → [H-7bf1421c1b4e](ui__next-study.md#h-7bf1421c1b4e) |
| 168행 | truthy: planOpen ∧ falsy: e.target.value==='' | Number(e.target.value)<br>call |

## H-596a48a92cf6

**@onChange** · [src/ui/next-study.tsx:169](../../../src/ui/next-study.tsx#L169)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 169행 | truthy: planOpen | draftChange({ dueDate: e.target.value })<br>preservation-boundary → [H-7bf1421c1b4e](ui__next-study.md#h-7bf1421c1b4e) |

## H-4ef99756c902

**@onClose** · [src/ui/next-study.tsx:172](../../../src/ui/next-study.tsx#L172)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 172행 | truthy: termOpen | setTermOpen(false)<br>state-update |

## H-ec7a4d2674c7

**@onChange** · [src/ui/next-study.tsx:174](../../../src/ui/next-study.tsx#L174)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 174행 | truthy: termOpen | write(w => ({ ...w, termDraft: { semesterId: id, ...dates } }), true)<br>call → [H-5e12f7cadcf8](ui__next-study.md#h-5e12f7cadcf8)<br>전달 콜백: H-bf0e80bcd033 |

## H-bf0e80bcd033

**@callback:write** · [src/ui/next-study.tsx:174](../../../src/ui/next-study.tsx#L174)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-cc62b23a147f

**@callback:semesters.map** · [src/ui/next-study.tsx:174](../../../src/ui/next-study.tsx#L174)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-43b79eaae19f

**@onInput** · [src/ui/next-study.tsx:175](../../../src/ui/next-study.tsx#L175)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 175행 | truthy: termOpen | termChange('start', e.currentTarget.value)<br>call → [H-768bfdc4af86](ui__next-study.md#h-768bfdc4af86) |

## H-8c26b3abcde6

**@onChange** · [src/ui/next-study.tsx:175](../../../src/ui/next-study.tsx#L175)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 175행 | truthy: termOpen | termChange('start', e.target.value)<br>call → [H-768bfdc4af86](ui__next-study.md#h-768bfdc4af86) |

## H-e3df35c15571

**@onInput** · [src/ui/next-study.tsx:176](../../../src/ui/next-study.tsx#L176)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 176행 | truthy: termOpen | termChange('end', e.currentTarget.value)<br>call → [H-768bfdc4af86](ui__next-study.md#h-768bfdc4af86) |

## H-c880d64ff336

**@onChange** · [src/ui/next-study.tsx:176](../../../src/ui/next-study.tsx#L176)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 176행 | truthy: termOpen | termChange('end', e.target.value)<br>call → [H-768bfdc4af86](ui__next-study.md#h-768bfdc4af86) |

## H-c964972a3f91

**@onClose** · [src/ui/next-study.tsx:179](../../../src/ui/next-study.tsx#L179)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 179행 | truthy: Boolean(responseId) | setResponseId(null)<br>state-update |

## H-09ba9684bae1

**@callback:goals.find** · [src/ui/next-study.tsx:180](../../../src/ui/next-study.tsx#L180)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-80c8aa79165a

**@onChange** · [src/ui/next-study.tsx:181](../../../src/ui/next-study.tsx#L181)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 181행 | truthy: Boolean(responseId) ∧ truthy: response | responseChange({ result: e.target.value as ResponseDraft['result'] })<br>call → [H-a274753209ca](ui__next-study.md#h-a274753209ca) |

## H-2f054e46b67e

**@onChange** · [src/ui/next-study.tsx:182](../../../src/ui/next-study.tsx#L182)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 182행 | truthy: Boolean(responseId) ∧ truthy: response | responseChange({ assistance: e.target.value as ResponseDraft['assistance'] })<br>call → [H-a274753209ca](ui__next-study.md#h-a274753209ca) |

## H-234aad09dfd5

**@onChange** · [src/ui/next-study.tsx:183](../../../src/ui/next-study.tsx#L183)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 183행 | truthy: Boolean(responseId) ∧ truthy: response | responseChange({ novelty: e.target.value as ResponseDraft['novelty'] })<br>call → [H-a274753209ca](ui__next-study.md#h-a274753209ca) |

## H-73a7e41337af

**@onChange** · [src/ui/next-study.tsx:184](../../../src/ui/next-study.tsx#L184)

분기 조건과 가능한 갈림길:

- B-79f18a4ef03f · ConditionalExpression · e.target.value==='' → truthy / falsy; 바깥 조건: truthy: Boolean(responseId) ∧ truthy: response (184행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 184행 | truthy: Boolean(responseId) ∧ truthy: response | responseChange({delayDays:e.target.value===''?undefined:Number(e.target.value),delayVerified:false})<br>call → [H-a274753209ca](ui__next-study.md#h-a274753209ca) |
| 184행 | truthy: Boolean(responseId) ∧ truthy: response ∧ falsy: e.target.value==='' | Number(e.target.value)<br>call |

## H-5e4a3715b3ef

**@onChange** · [src/ui/next-study.tsx:185](../../../src/ui/next-study.tsx#L185)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 185행 | truthy: Boolean(responseId) ∧ truthy: response | responseChange({delayVerified:e.target.value==='verified'})<br>call → [H-a274753209ca](ui__next-study.md#h-a274753209ca) |

## H-888de0a0c5ef

**@onChange** · [src/ui/next-study.tsx:186](../../../src/ui/next-study.tsx#L186)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 186행 | truthy: Boolean(responseId) ∧ truthy: response | responseChange({ answer: e.target.value })<br>call → [H-a274753209ca](ui__next-study.md#h-a274753209ca) |

