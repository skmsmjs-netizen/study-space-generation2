# src/ui/learning-schedule.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-2cc74181f466

**blankSchedule** · [src/ui/learning-schedule.tsx:13](../../../src/ui/learning-schedule.tsx#L13)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |

## H-73f70ba2e05d

**LearningScheduleEditor** · [src/ui/learning-schedule.tsx:14](../../../src/ui/learning-schedule.tsx#L14)

분기 조건과 가능한 갈림길:

- B-6ef94cab1fd2 · ConditionalExpression · condition.materialAvailable===null → truthy / falsy; 바깥 조건: interactive-when-falsy: disabled (63행).
- B-643e75bd0888 · ConditionalExpression · condition.materialAvailable → truthy / falsy; 바깥 조건: interactive-when-falsy: disabled ∧ falsy: condition.materialAvailable===null (63행).
- B-b87189b17392 · ConditionalExpression · draft.weight===null → truthy / falsy; 바깥 조건: interactive-when-falsy: disabled ∧ truthy: open (82행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 15행 | 별도 조건식 없음 | useState(false)<br>call |
| 15행 | 별도 조건식 없음 | useState(()=>blankSchedule())<br>call<br>전달 콜백: H-60614d1918ae |
| 15행 | 별도 조건식 없음 | useState('')<br>call |
| 16행 | 별도 조건식 없음 | useRef(draft)<br>call |
| 17행 | 별도 조건식 없음 | useRef('new')<br>call |
| 17행 | 별도 조건식 없음 | useRef(null)<br>call |
| 17행 | 별도 조건식 없음 | useRef(null)<br>call |
| 18행 | 별도 조건식 없음 | useState(null)<br>call |
| 19행 | 별도 조건식 없음 | useState('')<br>call |
| 21행 | 별도 조건식 없음 | useState({targetId:'',prerequisiteIds:[],materialAvailable:null})<br>call |
| 22행 | 별도 조건식 없음 | useEffectEvent((initial: LearningSchedule, key: string) => loadDraft(initial, key))<br>call<br>전달 콜백: H-5e20976d6190 |
| 23행 | 별도 조건식 없음 | useEffect(() => { const openSchedule = (event: Event) => { const id = (event as CustomEvent<unknown>).detail; const schedule = workspace.schedules?.find(s => s.id === id && !s.deletedAt && subjectIds.includes(s.subjectId)); if (schedule) loadRequestedDraft(structuredClone(schedule), schedule.id); }; window.addEventListener('study-space:open-schedule', openSchedule); return () => window.removeEventListener('study-space:open-schedule', openSchedule); }, [workspace.schedules, subjectIds])<br>call<br>전달 콜백: H-2f6afebf1a71 |
| 32행 | 별도 조건식 없음 | useState({targetId:'',goalId:'',action:'',before:'',date:'',note:''})<br>call |
| 33행 | 별도 조건식 없음 | useState({})<br>call |
| 34행 | 별도 조건식 없음 | data.subjects.filter(s=>!s.deletedAt&&subjectIds.includes(s.id))<br>call<br>전달 콜백: H-9e14503917ef |
| 35행 | 별도 조건식 없음 | data.nodes.filter(n=>!n.deletedAt&&n.role==='topic'&&subjectIds.includes(n.subjectId))<br>call<br>전달 콜백: H-108ac885386b |
| 58행 | interactive-when-falsy: disabled | (workspace.schedules??[]).filter(s=>subjectIds.includes(s.subjectId))<br>call<br>전달 콜백: H-be24d6b1025f |
| 61행 | interactive-when-falsy: disabled | nodes.map(n=><option key={n.id} value={n.id}>{n.name}</option>)<br>call<br>전달 콜백: H-18fa41e4b3c2 |
| 62행 | interactive-when-falsy: disabled | nodes.filter(n=>n.id!==condition.targetId&&n.subjectId===nodes.find(n=>n.id===condition.targetId)?.subjectId).map(n=><Checkbox key={n.id} label={`먼저 확인할 주제: ${n.name}`} checked={condition.prerequisiteIds.includes(n.id)} onChange={e=>setCondition(c=>({...c,prerequisiteIds:e.target.checked?[...c.prerequisiteIds,n.id]:c.prerequisiteIds.filter(id=>id!==n.id)}))}/>)<br>call<br>전달 콜백: H-3f264ea5efdc |
| 62행 | interactive-when-falsy: disabled | nodes.filter(n=>n.id!==condition.targetId&&n.subjectId===nodes.find(n=>n.id===condition.targetId)?.subjectId)<br>call<br>전달 콜백: H-2ff8556b7a7b |
| 67행 | interactive-when-falsy: disabled | workspace.goals.filter(g=>nodes.some(n=>n.id===g.targetId)).map(g=><option key={g.id} value={g.id}>{g.label}</option>)<br>call<br>전달 콜백: H-60e90525fe2e |
| 67행 | interactive-when-falsy: disabled | workspace.goals.filter(g=>nodes.some(n=>n.id===g.targetId))<br>call<br>전달 콜백: H-2f12f8f5b3a2 |
| 69행 | interactive-when-falsy: disabled | (workspace.comparisons??[]).filter(p=>nodes.some(n=>n.id===p.targetId)).map(p=>{ const usable=(workspace.comparisons??[]).filter(x=>x.goalId===p.goalId&&x.independent&&x.rubricMatched&&x.attributionBundle).map(x=>({...x,stratumKey:x.goalId})); const support=activitySupport(usable,p.goalId,p.action,new Date().toISOString()); return <div key={p.id} className="learning-comparison"><strong>{p.action} · {workspace.goals.find(g=>g.id===p.goalId)?.label}</strong><p>{p.note}</p><p className="muted">{new Date(p.outcomeDueAt).toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul'})} 확인 · 이전 {p.before} → 이후 {p.after??'결과 미정'}</p> <Checkbox label="독립 채점 결과를 확인했어요" checked={p.independent} onChange={e=>pairUpdate(p,'independent',e.target.checked)}/><Checkbox label="같은 확인 기준으로 채점했어요" c … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-6ff0a983b21a |
| 69행 | interactive-when-falsy: disabled | (workspace.comparisons??[]).filter(p=>nodes.some(n=>n.id===p.targetId))<br>call<br>전달 콜백: H-6aa4a1e602c1 |
| 78행 | interactive-when-falsy: disabled | (workspace.snapshots??[]).map(s=><details key={s.id}><summary>{new Date(s.createdAt).toLocaleString('ko-KR')} · {s.policyVersion}</summary><p>입력 버전과 결과를 함께 보존했습니다. 지금의 추천과 다를 수 있습니다.</p><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(s.result,null,2)}</pre></details>)<br>call<br>전달 콜백: H-c7f0b9a03b52 |
| 80행 | interactive-when-falsy: disabled ∧ truthy: open | subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)<br>call<br>전달 콜백: H-864c1f16801c |
| 81행 | interactive-when-falsy: disabled ∧ truthy: open | Object.entries(scheduleLabels).map(([id,label])=><option key={id} value={id}>{label}</option>)<br>call<br>전달 콜백: H-cfbae342a6c0 |
| 81행 | interactive-when-falsy: disabled ∧ truthy: open | Object.entries(scheduleLabels)<br>call |
| 87행 | interactive-when-falsy: disabled ∧ truthy: open | ['lecture','class'].includes(draft.kind)<br>call |
| 90행 | interactive-when-falsy: disabled ∧ truthy: open | nodes.filter(n=>n.subjectId===draft.subjectId).map(n=><Checkbox key={n.id} label={n.name} checked={draft.targetIds.includes(n.id)} onChange={e=>patch({targetIds:e.target.checked?[...draft.targetIds,n.id]:draft.targetIds.filter(id=>id!==n.id)})}/>)<br>preservation-boundary<br>전달 콜백: H-c0f0796b5d3e |
| 90행 | interactive-when-falsy: disabled ∧ truthy: open | nodes.filter(n=>n.subjectId===draft.subjectId)<br>call<br>전달 콜백: H-6dc73704145c |
| 91행 | interactive-when-falsy: disabled ∧ truthy: open | ['lecture','class'].includes(draft.kind)<br>call |

반환/조기 중단: 55행 <render> [별도 조건식 없음]

## H-60614d1918ae

**@callback:useState** · [src/ui/learning-schedule.tsx:15](../../../src/ui/learning-schedule.tsx#L15)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 15행 | 별도 조건식 없음 | blankSchedule()<br>call → [H-2cc74181f466](ui__learning-schedule.md#h-2cc74181f466) |

## H-1b47ab1a1e2e

**loadDraft** · [src/ui/learning-schedule.tsx:20](../../../src/ui/learning-schedule.tsx#L20)

분기 조건과 가능한 갈림길:

- B-c6f9bda83c4b · ConditionalExpression · key==='new' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (20행).
- B-d9d775cb227e · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (20행).
- B-59172b674e77 · ConditionalExpression · saved.draft&&!saved.base&&key!=='new' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (20행).
- B-73b4a962a30e · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (20행).
- B-b669e272b83e · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (20행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 20행 | 별도 조건식 없음 | setConflicting(null)<br>state-update |
| 20행 | falsy: key==='new' | structuredClone(initial)<br>call |
| 20행 | 별도 조건식 없음 | setRepeatEnd('')<br>state-update |
| 20행 | 별도 조건식 없음 | readScheduleDraft(data, key)<br>preservation-boundary |
| 20행 | 별도 조건식 없음 | setDraft(draftCurrent.current)<br>state-update |
| 20행 | 별도 조건식 없음 | setRepeatEnd(saved.repeatEnd)<br>state-update |
| 20행 | 별도 조건식 없음 | setError(saved.draft&&!saved.base&&key!=='new'?'이전 초안 원문을 열었습니다. 현재 저장 내용과 비교한 뒤 저장해 주세요.': '')<br>state-update |
| 20행 | 별도 조건식 없음 | setOpen(true)<br>state-update |
| 20행 | exception: e | setError(e instanceof Error?e.message:'일정 초안 확인이 필요합니다.')<br>state-update |

## H-5e20976d6190

**@callback:useEffectEvent** · [src/ui/learning-schedule.tsx:22](../../../src/ui/learning-schedule.tsx#L22)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 22행 | 별도 조건식 없음 | loadDraft(initial, key)<br>preservation-boundary → [H-1b47ab1a1e2e](ui__learning-schedule.md#h-1b47ab1a1e2e) |

## H-2f6afebf1a71

**@callback:useEffect** · [src/ui/learning-schedule.tsx:23](../../../src/ui/learning-schedule.tsx#L23)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 29행 | 별도 조건식 없음 | window.addEventListener('study-space:open-schedule', openSchedule)<br>call<br>전달 콜백: H-03b32041babd |

반환/조기 중단: 30행 () => window.removeEventListener('study-space:open-schedule', openSchedule) [별도 조건식 없음]

## H-03b32041babd

**openSchedule** · [src/ui/learning-schedule.tsx:24](../../../src/ui/learning-schedule.tsx#L24)

분기 조건과 가능한 갈림길:

- B-eb4e1641ec4b · IfStatement · schedule → truthy / falsy; 바깥 조건: 별도 조건식 없음 (27행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 27행 | truthy: schedule | loadRequestedDraft(structuredClone(schedule), schedule.id)<br>preservation-boundary |
| 27행 | truthy: schedule | structuredClone(schedule)<br>call |

## H-9e14503917ef

**@callback:data.subjects.filter** · [src/ui/learning-schedule.tsx:34](../../../src/ui/learning-schedule.tsx#L34)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 34행 | truthy: !s.deletedAt | subjectIds.includes(s.id)<br>call |

## H-108ac885386b

**@callback:data.nodes.filter** · [src/ui/learning-schedule.tsx:35](../../../src/ui/learning-schedule.tsx#L35)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 35행 | truthy: !n.deletedAt&&n.role==='topic' | subjectIds.includes(n.subjectId)<br>call |

## H-de9269105558

**patch** · [src/ui/learning-schedule.tsx:36](../../../src/ui/learning-schedule.tsx#L36)

분기 조건과 가능한 갈림길:

- B-ca514373670a · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (36행).
- B-f5e7c5ca242a · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (36행).
- B-0237be0aa4f3 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (36행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 36행 | 별도 조건식 없음 | setDraft(next)<br>state-update |
| 36행 | 별도 조건식 없음 | writeScheduleDraft(data, draftKey.current, next, draftRaw.current, localStorage, {base:baseSchedule.current,repeatEnd})<br>preservation-boundary |
| 36행 | exception: e | setError(e instanceof Error?e.message:'일정 초안은 화면에 유지했습니다.')<br>state-update |

## H-0123681ad960

**change** · [src/ui/learning-schedule.tsx:37](../../../src/ui/learning-schedule.tsx#L37)

분기 조건과 가능한 갈림길:

- B-76a39e658c34 · IfStatement · disabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (37행).
- B-43597a6f1860 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (37행).
- B-eca69623788b · IfStatement · onChange(w) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (37행).
- B-f065b345a881 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (37행).
- B-df6544218c9c · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (37행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 37행 | 별도 조건식 없음 | validateRecommendations(w, data)<br>call |
| 37행 | 별도 조건식 없음 | onChange(w)<br>call |
| 37행 | truthy: onChange(w) | setError('')<br>state-update |
| 37행 | exception: e | setError(e instanceof Error?e.message:'내용을 저장하지 못했습니다.')<br>state-update |

반환/조기 중단: 37행 false [truthy: disabled]; 37행 true [truthy: onChange(w)]; 37행 false [별도 조건식 없음]

## H-3f9bd9c16543

**save** · [src/ui/learning-schedule.tsx:38](../../../src/ui/learning-schedule.tsx#L38)

분기 조건과 가능한 갈림길:

- B-2e1d5398296c · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (38행).
- B-5a33263d4b1b · IfStatement · baseSchedule.current&&JSON.stringify(schedules[index])!==JSON.stringify(baseSchedule.current) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (39행).
- B-0ab9a6b26fa4 · IfStatement · index<0 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (40행).
- B-910d1f70dc3e · ConditionalExpression · repeatEnd → truthy / falsy; 바깥 조건: truthy: index<0 (40행).
- B-99e01432ba4c · IfStatement · change({...workspace,schedules}) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (41행).
- B-2aa972a63100 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: change({...workspace,schedules}) (41행).
- B-a56986eea962 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: change({...workspace,schedules}) (41행).
- B-d71db9329aa2 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (42행).
- B-23dbf3800d6b · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (42행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 38행 | 별도 조건식 없음 | schedules.findIndex(s=>s.id===draft.id)<br>call<br>전달 콜백: H-8ec08ff4ccf0 |
| 39행 | truthy: baseSchedule.current | JSON.stringify(schedules[index])<br>call |
| 39행 | truthy: baseSchedule.current | JSON.stringify(baseSchedule.current)<br>call |
| 39행 | truthy: baseSchedule.current&&JSON.stringify(schedules[index])!==JSON.stringify(baseSchedule.current) | setConflicting(schedules[index]??null)<br>state-update |
| 39행 | truthy: baseSchedule.current&&JSON.stringify(schedules[index])!==JSON.stringify(baseSchedule.current) | Error('편집하는 동안 일정이 바뀌었습니다. 초안을 유지했습니다. 현재 저장 기록과 비교해 주세요.')<br>call |
| 40행 | truthy: index<0 | schedules.push(...(repeatEnd?weeklySchedules(draft,repeatEnd,()=>crypto.randomUUID()):[draft]))<br>call |
| 40행 | truthy: index<0 ∧ truthy: repeatEnd | weeklySchedules(draft, repeatEnd, ()=>crypto.randomUUID())<br>call<br>전달 콜백: H-6513b3000835 |
| 40행 | falsy: index<0 | changeSchedule(schedules[index], {...draft,states:schedules[index].states}, new Date().toISOString(), '일정 내용·기한 수정')<br>call |
| 40행 | falsy: index<0 | new Date().toISOString()<br>call |
| 41행 | 별도 조건식 없음 | change({...workspace,schedules})<br>call → [H-0123681ad960](ui__learning-schedule.md#h-0123681ad960) |
| 41행 | truthy: change({...workspace,schedules}) | setOpen(false)<br>state-update |
| 41행 | truthy: change({...workspace,schedules}) | clearScheduleDraft(data, draftKey.current, draftRaw.current)<br>preservation-boundary |
| 41행 | truthy: change({...workspace,schedules}) ∧ exception: exception | setError('일정은 저장했습니다. 이 기기의 이전 초안을 정리하지 못했습니다.')<br>state-update |
| 42행 | exception: e | setError(e instanceof Error?e.message:'일정을 저장하지 못했습니다. 초안은 유지했습니다.')<br>state-update |

throw: 39행 Error('편집하는 동안 일정이 바뀌었습니다. 초안을 유지했습니다. 현재 저장 기록과 비교해 주세요.')

## H-8ec08ff4ccf0

**@callback:schedules.findIndex** · [src/ui/learning-schedule.tsx:38](../../../src/ui/learning-schedule.tsx#L38)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6513b3000835

**@callback:weeklySchedules** · [src/ui/learning-schedule.tsx:40](../../../src/ui/learning-schedule.tsx#L40)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 40행 | truthy: index<0 ∧ truthy: repeatEnd | crypto.randomUUID()<br>call |

## H-e3fb7091711c

**registerPair** · [src/ui/learning-schedule.tsx:46](../../../src/ui/learning-schedule.tsx#L46)

분기 조건과 가능한 갈림길:

- B-9bac8ffff462 · IfStatement · !pair.before.trim()||!goal||!pair.action.trim()||!date||Date.parse(date)<=Date.now()||before<0||before>1 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (48행).
- B-7c0699a06b58 · IfStatement · change({...workspace,comparisons:[...(workspace.comparisons??[]),entry]}) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (50행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 47행 | 별도 조건식 없음 | Number(pair.before)<br>call |
| 47행 | 별도 조건식 없음 | dateDeadline(pair.date)<br>call |
| 47행 | 별도 조건식 없음 | workspace.goals.find(g=>g.id===pair.goalId)<br>call<br>전달 콜백: H-5a6c4d01ae4b |
| 48행 | 별도 조건식 없음 | pair.before.trim()<br>call |
| 48행 | falsy: !pair.before.trim()\|\|!goal | pair.action.trim()<br>call |
| 48행 | falsy: !pair.before.trim()\|\|!goal\|\|!pair.action.trim()\|\|!date | Date.parse(date)<br>call |
| 48행 | falsy: !pair.before.trim()\|\|!goal\|\|!pair.action.trim()\|\|!date | Date.now()<br>call |
| 48행 | truthy: !pair.before.trim()\|\|!goal\|\|!pair.action.trim()\|\|!date\|\|Date.parse(date)<=Date.now()\|\|before<0\|\|before>1 | setError('확인 기준·방법·이전 점수와 앞으로 확인할 날짜를 남겨 주세요. 점수는 0부터 1 사이입니다.')<br>state-update |
| 49행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 49행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 50행 | 별도 조건식 없음 | change({...workspace,comparisons:[...(workspace.comparisons??[]),entry]})<br>call → [H-0123681ad960](ui__learning-schedule.md#h-0123681ad960) |
| 50행 | truthy: change({...workspace,comparisons:[...(workspace.comparisons??[]),entry]}) | setPair({...pair,before:'',note:''})<br>state-update |

반환/조기 중단: 48행 <render> [truthy: !pair.before.trim()||!goal||!pair.action.trim()||!date||Date.parse(date)<=Date.now()||before<0||before>1]

## H-5a6c4d01ae4b

**@callback:workspace.goals.find** · [src/ui/learning-schedule.tsx:47](../../../src/ui/learning-schedule.tsx#L47)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-14d2f0e5aeb3

**finishPair** · [src/ui/learning-schedule.tsx:52](../../../src/ui/learning-schedule.tsx#L52)

분기 조건과 가능한 갈림길:

- B-775d6ed1dda9 · ConditionalExpression · text.trim() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (52행).
- B-722694adafbd · IfStatement · Date.now()<Date.parse(p.outcomeDueAt) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (52행).
- B-25dc58e527cf · IfStatement · after!==null&&(!Number.isFinite(after)||after<0||after>1) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (52행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 52행 | 별도 조건식 없음 | text.trim()<br>call |
| 52행 | truthy: text.trim() | Number(text)<br>call |
| 52행 | 별도 조건식 없음 | Date.now()<br>call |
| 52행 | 별도 조건식 없음 | Date.parse(p.outcomeDueAt)<br>call |
| 52행 | truthy: Date.now()<Date.parse(p.outcomeDueAt) | setError('사전에 정한 확인 날짜가 지난 뒤 결과를 남겨 주세요.')<br>state-update |
| 52행 | truthy: after!==null | Number.isFinite(after)<br>call |
| 52행 | truthy: after!==null&&(!Number.isFinite(after)\|\|after<0\|\|after>1) | setError('점수는 0부터 1 사이입니다.')<br>state-update |
| 52행 | 별도 조건식 없음 | change({...workspace,comparisons:(workspace.comparisons??[]).map(x=>x.id===p.id?{...x,after,performed:true}:x)})<br>call → [H-0123681ad960](ui__learning-schedule.md#h-0123681ad960) |
| 52행 | 별도 조건식 없음 | (workspace.comparisons??[]).map(x=>x.id===p.id?{...x,after,performed:true}:x)<br>call<br>전달 콜백: H-b81b64f2015d |

반환/조기 중단: 52행 <render> [truthy: Date.now()<Date.parse(p.outcomeDueAt)]; 52행 <render> [truthy: after!==null&&(!Number.isFinite(after)||after<0||after>1)]

## H-b81b64f2015d

**@callback:(workspace.comparisons??[]).map** · [src/ui/learning-schedule.tsx:52](../../../src/ui/learning-schedule.tsx#L52)

분기 조건과 가능한 갈림길:

- B-3b803d29f0f8 · ConditionalExpression · x.id===p.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (52행).

## H-be473ae2f6ec

**pairUpdate** · [src/ui/learning-schedule.tsx:53](../../../src/ui/learning-schedule.tsx#L53)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 53행 | 별도 조건식 없음 | change({...workspace,comparisons:(workspace.comparisons??[]).map(x=>x.id===p.id?{...x,[field]:value}:x)})<br>call → [H-0123681ad960](ui__learning-schedule.md#h-0123681ad960) |
| 53행 | 별도 조건식 없음 | (workspace.comparisons??[]).map(x=>x.id===p.id?{...x,[field]:value}:x)<br>call<br>전달 콜백: H-e5ba83e3ac57 |

## H-e5ba83e3ac57

**@callback:(workspace.comparisons??[]).map** · [src/ui/learning-schedule.tsx:53](../../../src/ui/learning-schedule.tsx#L53)

분기 조건과 가능한 갈림길:

- B-3fe31c8aa3e0 · ConditionalExpression · x.id===p.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (53행).

## H-3f55ec62ef8a

**archiveSnapshot** · [src/ui/learning-schedule.tsx:54](../../../src/ui/learning-schedule.tsx#L54)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 54행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 54행 | 별도 조건식 없음 | recommendationInput(data, workspace, subjectIds)<br>call |
| 54행 | 별도 조건식 없음 | nextStudy(data, workspace, now, subjectIds)<br>call |
| 54행 | 별도 조건식 없음 | JSON.stringify({entityVersions:data.records.map(r=>[r.id,r.version]),model:input.model,events:input.events,controls:workspace.controls})<br>call |
| 54행 | 별도 조건식 없음 | data.records.map(r=>[r.id,r.version])<br>call<br>전달 콜백: H-a67a98f02f58 |
| 54행 | 별도 조건식 없음 | change({...workspace,snapshots:[...(workspace.snapshots??[]),{id:crypto.randomUUID(),createdAt:now,dataVersion,policyVersion:result.policyVersion,workspaceRevision:workspace.revision,result}]})<br>call → [H-0123681ad960](ui__learning-schedule.md#h-0123681ad960) |
| 54행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |

## H-a67a98f02f58

**@callback:data.records.map** · [src/ui/learning-schedule.tsx:54](../../../src/ui/learning-schedule.tsx#L54)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-be24d6b1025f

**@callback:(workspace.schedules??[]).filter** · [src/ui/learning-schedule.tsx:58](../../../src/ui/learning-schedule.tsx#L58)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 58행 | interactive-when-falsy: disabled | subjectIds.includes(s.subjectId)<br>call |

## H-cfc7917ab91a

**@onCheck** · [src/ui/learning-schedule.tsx:58](../../../src/ui/learning-schedule.tsx#L58)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 58행 | interactive-when-falsy: disabled | change({...workspace,scheduleChecks:[...(workspace.scheduleChecks??[]),{id:crypto.randomUUID(),subjectId,at:new Date().toISOString()}]})<br>call → [H-0123681ad960](ui__learning-schedule.md#h-0123681ad960) |
| 58행 | interactive-when-falsy: disabled | crypto.randomUUID()<br>call |
| 58행 | interactive-when-falsy: disabled | new Date().toISOString()<br>call |

## H-9b0b5e89803f

**@onChange** · [src/ui/learning-schedule.tsx:61](../../../src/ui/learning-schedule.tsx#L61)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 61행 | interactive-when-falsy: disabled | setCondition(workspace.conditions?.find(c=>c.targetId===e.target.value)??{targetId:e.target.value,prerequisiteIds:[],materialAvailable:null})<br>state-update |

## H-18fa41e4b3c2

**@callback:nodes.map** · [src/ui/learning-schedule.tsx:61](../../../src/ui/learning-schedule.tsx#L61)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2ff8556b7a7b

**@callback:nodes.filter** · [src/ui/learning-schedule.tsx:62](../../../src/ui/learning-schedule.tsx#L62)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 62행 | interactive-when-falsy: disabled ∧ truthy: n.id!==condition.targetId | nodes.find(n=>n.id===condition.targetId)<br>call<br>전달 콜백: H-71ce0b30fb65 |

## H-71ce0b30fb65

**@callback:nodes.find** · [src/ui/learning-schedule.tsx:62](../../../src/ui/learning-schedule.tsx#L62)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3f264ea5efdc

**@callback:nodes.filter(n=>n.id!==condition.targetId&&n.subjectId===nodes.find(n=>n.id===condition.targetId)?.subjectId).map** · [src/ui/learning-schedule.tsx:62](../../../src/ui/learning-schedule.tsx#L62)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 62행 | interactive-when-falsy: disabled | condition.prerequisiteIds.includes(n.id)<br>call |

## H-854ef23c3174

**@onChange** · [src/ui/learning-schedule.tsx:62](../../../src/ui/learning-schedule.tsx#L62)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 62행 | interactive-when-falsy: disabled | setCondition(c=>({...c,prerequisiteIds:e.target.checked?[...c.prerequisiteIds,n.id]:c.prerequisiteIds.filter(id=>id!==n.id)}))<br>state-update<br>전달 콜백: H-1c2c08e6f412 |

## H-1c2c08e6f412

**@callback:setCondition** · [src/ui/learning-schedule.tsx:62](../../../src/ui/learning-schedule.tsx#L62)

분기 조건과 가능한 갈림길:

- B-5d3a2d10fc20 · ConditionalExpression · e.target.checked → truthy / falsy; 바깥 조건: interactive-when-falsy: disabled (62행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 62행 | interactive-when-falsy: disabled ∧ falsy: e.target.checked | c.prerequisiteIds.filter(id=>id!==n.id)<br>call<br>전달 콜백: H-0cd2146c287c |

## H-0cd2146c287c

**@callback:c.prerequisiteIds.filter** · [src/ui/learning-schedule.tsx:62](../../../src/ui/learning-schedule.tsx#L62)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f4cb6c5678e0

**@onChange** · [src/ui/learning-schedule.tsx:63](../../../src/ui/learning-schedule.tsx#L63)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 63행 | interactive-when-falsy: disabled | setCondition(c=>({...c,materialAvailable:e.target.value==='unknown'?null:e.target.value==='yes'}))<br>state-update<br>전달 콜백: H-7d048a57c16f |

## H-7d048a57c16f

**@callback:setCondition** · [src/ui/learning-schedule.tsx:63](../../../src/ui/learning-schedule.tsx#L63)

분기 조건과 가능한 갈림길:

- B-0cafab56a3ef · ConditionalExpression · e.target.value==='unknown' → truthy / falsy; 바깥 조건: interactive-when-falsy: disabled (63행).

## H-7774e5c32d0f

**@onClick** · [src/ui/learning-schedule.tsx:64](../../../src/ui/learning-schedule.tsx#L64)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 64행 | interactive-when-falsy: disabled | change({...workspace,conditions:[...(workspace.conditions??[]).filter(c=>c.targetId!==condition.targetId),condition]})<br>call → [H-0123681ad960](ui__learning-schedule.md#h-0123681ad960) |
| 64행 | interactive-when-falsy: disabled | (workspace.conditions??[]).filter(c=>c.targetId!==condition.targetId)<br>call<br>전달 콜백: H-e2ce10ed8217 |

## H-e2ce10ed8217

**@callback:(workspace.conditions??[]).filter** · [src/ui/learning-schedule.tsx:64](../../../src/ui/learning-schedule.tsx#L64)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-03e601a1de2d

**@onChange** · [src/ui/learning-schedule.tsx:67](../../../src/ui/learning-schedule.tsx#L67)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 67행 | interactive-when-falsy: disabled | setPair(p=>({...p,goalId:e.target.value}))<br>state-update<br>전달 콜백: H-90ce1371eea4 |

## H-90ce1371eea4

**@callback:setPair** · [src/ui/learning-schedule.tsx:67](../../../src/ui/learning-schedule.tsx#L67)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2f12f8f5b3a2

**@callback:workspace.goals.filter** · [src/ui/learning-schedule.tsx:67](../../../src/ui/learning-schedule.tsx#L67)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 67행 | interactive-when-falsy: disabled | nodes.some(n=>n.id===g.targetId)<br>call<br>전달 콜백: H-6f90d33a5f5d |

## H-6f90d33a5f5d

**@callback:nodes.some** · [src/ui/learning-schedule.tsx:67](../../../src/ui/learning-schedule.tsx#L67)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-60e90525fe2e

**@callback:workspace.goals.filter(g=>nodes.some(n=>n.id===g.targetId)).map** · [src/ui/learning-schedule.tsx:67](../../../src/ui/learning-schedule.tsx#L67)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f07bf89a794a

**@onChange** · [src/ui/learning-schedule.tsx:68](../../../src/ui/learning-schedule.tsx#L68)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 68행 | interactive-when-falsy: disabled | setPair(p=>({...p,action:e.target.value}))<br>state-update<br>전달 콜백: H-7f67037da117 |

## H-7f67037da117

**@callback:setPair** · [src/ui/learning-schedule.tsx:68](../../../src/ui/learning-schedule.tsx#L68)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0c7387167f2e

**@onChange** · [src/ui/learning-schedule.tsx:68](../../../src/ui/learning-schedule.tsx#L68)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 68행 | interactive-when-falsy: disabled | setPair(p=>({...p,before:e.target.value}))<br>state-update<br>전달 콜백: H-eb619fb3a75a |

## H-eb619fb3a75a

**@callback:setPair** · [src/ui/learning-schedule.tsx:68](../../../src/ui/learning-schedule.tsx#L68)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b8bee684790e

**@onChange** · [src/ui/learning-schedule.tsx:68](../../../src/ui/learning-schedule.tsx#L68)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 68행 | interactive-when-falsy: disabled | setPair(p=>({...p,date:e.target.value}))<br>state-update<br>전달 콜백: H-9d84fe83b154 |

## H-9d84fe83b154

**@callback:setPair** · [src/ui/learning-schedule.tsx:68](../../../src/ui/learning-schedule.tsx#L68)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d7dab6198ca7

**@onChange** · [src/ui/learning-schedule.tsx:68](../../../src/ui/learning-schedule.tsx#L68)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 68행 | interactive-when-falsy: disabled | setPair(p=>({...p,note:e.target.value}))<br>state-update<br>전달 콜백: H-348e94f7e13f |

## H-348e94f7e13f

**@callback:setPair** · [src/ui/learning-schedule.tsx:68](../../../src/ui/learning-schedule.tsx#L68)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6aa4a1e602c1

**@callback:(workspace.comparisons??[]).filter** · [src/ui/learning-schedule.tsx:69](../../../src/ui/learning-schedule.tsx#L69)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 69행 | interactive-when-falsy: disabled | nodes.some(n=>n.id===p.targetId)<br>call<br>전달 콜백: H-0c26588e36e5 |

## H-0c26588e36e5

**@callback:nodes.some** · [src/ui/learning-schedule.tsx:69](../../../src/ui/learning-schedule.tsx#L69)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6ff0a983b21a

**@callback:(workspace.comparisons??[]).filter(p=>nodes.some(n=>n.id===p.targetId)).map** · [src/ui/learning-schedule.tsx:69](../../../src/ui/learning-schedule.tsx#L69)

분기 조건과 가능한 갈림길:

- B-1a5ace6036b7 · ConditionalExpression · support.eligible → truthy / falsy; 바깥 조건: interactive-when-falsy: disabled (75행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 70행 | interactive-when-falsy: disabled | (workspace.comparisons??[]).filter(x=>x.goalId===p.goalId&&x.independent&&x.rubricMatched&&x.attributionBundle).map(x=>({...x,stratumKey:x.goalId}))<br>call<br>전달 콜백: H-8966fb696ce9 |
| 70행 | interactive-when-falsy: disabled | (workspace.comparisons??[]).filter(x=>x.goalId===p.goalId&&x.independent&&x.rubricMatched&&x.attributionBundle)<br>call<br>전달 콜백: H-6c19022e3abd |
| 71행 | interactive-when-falsy: disabled | activitySupport(usable, p.goalId, p.action, new Date().toISOString())<br>call |
| 71행 | interactive-when-falsy: disabled | new Date().toISOString()<br>call |
| 72행 | interactive-when-falsy: disabled | workspace.goals.find(g=>g.id===p.goalId)<br>call<br>전달 콜백: H-a376cce74b1e |
| 72행 | interactive-when-falsy: disabled | new Date(p.outcomeDueAt).toLocaleDateString('ko-KR', {timeZone:'Asia/Seoul'})<br>call |
| 75행 | interactive-when-falsy: disabled | support.lower.toFixed(2)<br>call |
| 75행 | interactive-when-falsy: disabled | support.upper.toFixed(2)<br>call |

반환/조기 중단: 72행 <render> [interactive-when-falsy: disabled]

## H-6c19022e3abd

**@callback:(workspace.comparisons??[]).filter** · [src/ui/learning-schedule.tsx:70](../../../src/ui/learning-schedule.tsx#L70)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8966fb696ce9

**@callback:(workspace.comparisons??[]).filter(x=>x.goalId===p.goalId&&x.independent&&x.rubricMatched&&x.attributionBundle).map** · [src/ui/learning-schedule.tsx:70](../../../src/ui/learning-schedule.tsx#L70)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a376cce74b1e

**@callback:workspace.goals.find** · [src/ui/learning-schedule.tsx:72](../../../src/ui/learning-schedule.tsx#L72)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-534a5177d6ba

**@onChange** · [src/ui/learning-schedule.tsx:73](../../../src/ui/learning-schedule.tsx#L73)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 73행 | interactive-when-falsy: disabled | pairUpdate(p, 'independent', e.target.checked)<br>call → [H-be473ae2f6ec](ui__learning-schedule.md#h-be473ae2f6ec) |

## H-cdd5ecbf5984

**@onChange** · [src/ui/learning-schedule.tsx:73](../../../src/ui/learning-schedule.tsx#L73)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 73행 | interactive-when-falsy: disabled | pairUpdate(p, 'rubricMatched', e.target.checked)<br>call → [H-be473ae2f6ec](ui__learning-schedule.md#h-be473ae2f6ec) |

## H-b19633eae260

**@onChange** · [src/ui/learning-schedule.tsx:73](../../../src/ui/learning-schedule.tsx#L73)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 73행 | interactive-when-falsy: disabled | pairUpdate(p, 'attributionBundle', e.target.checked)<br>call → [H-be473ae2f6ec](ui__learning-schedule.md#h-be473ae2f6ec) |

## H-e2eacfbf5a33

**@onChange** · [src/ui/learning-schedule.tsx:74](../../../src/ui/learning-schedule.tsx#L74)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 74행 | interactive-when-falsy: disabled ∧ truthy: !p.performed | setScoreInputs(x=>({...x,[p.id]:e.target.value}))<br>state-update<br>전달 콜백: H-99c8a0a60074 |

## H-99c8a0a60074

**@callback:setScoreInputs** · [src/ui/learning-schedule.tsx:74](../../../src/ui/learning-schedule.tsx#L74)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-97b663d3cf47

**@onClick** · [src/ui/learning-schedule.tsx:74](../../../src/ui/learning-schedule.tsx#L74)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 74행 | interactive-when-falsy: disabled ∧ truthy: !p.performed | finishPair(p)<br>call → [H-14d2f0e5aeb3](ui__learning-schedule.md#h-14d2f0e5aeb3) |

## H-c7f0b9a03b52

**@callback:(workspace.snapshots??[]).map** · [src/ui/learning-schedule.tsx:78](../../../src/ui/learning-schedule.tsx#L78)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 78행 | interactive-when-falsy: disabled | new Date(s.createdAt).toLocaleString('ko-KR')<br>call |
| 78행 | interactive-when-falsy: disabled | JSON.stringify(s.result, null, 2)<br>call |

## H-3405089be13a

**@onClose** · [src/ui/learning-schedule.tsx:79](../../../src/ui/learning-schedule.tsx#L79)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 79행 | interactive-when-falsy: disabled ∧ truthy: open | setOpen(false)<br>state-update |

## H-8a7679004f6c

**@onChange** · [src/ui/learning-schedule.tsx:80](../../../src/ui/learning-schedule.tsx#L80)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 80행 | interactive-when-falsy: disabled ∧ truthy: open | patch({name:e.target.value})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-438cb20c4583

**@onChange** · [src/ui/learning-schedule.tsx:80](../../../src/ui/learning-schedule.tsx#L80)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 80행 | interactive-when-falsy: disabled ∧ truthy: open | patch({subjectId:e.target.value,targetIds:[],goalIds:[]})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-864c1f16801c

**@callback:subjects.map** · [src/ui/learning-schedule.tsx:80](../../../src/ui/learning-schedule.tsx#L80)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ac1b5343f970

**@onChange** · [src/ui/learning-schedule.tsx:81](../../../src/ui/learning-schedule.tsx#L81)

분기 조건과 가능한 갈림길:

- B-bd2db5c84dda · ConditionalExpression · kind==='assignment' → truthy / falsy; 바깥 조건: interactive-when-falsy: disabled ∧ truthy: open (81행).
- B-1538bb9bd26b · ConditionalExpression · kind==='lecture'||kind==='class' → truthy / falsy; 바깥 조건: interactive-when-falsy: disabled ∧ truthy: open ∧ falsy: kind==='assignment' (81행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 81행 | interactive-when-falsy: disabled ∧ truthy: open | patch({kind,dueMeaning:kind==='assignment'?'submission':kind==='lecture'\|\|kind==='class'?'attendance':'exam'})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-cfbae342a6c0

**@callback:Object.entries(scheduleLabels).map** · [src/ui/learning-schedule.tsx:81](../../../src/ui/learning-schedule.tsx#L81)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7ce6fc7406f5

**@onInput** · [src/ui/learning-schedule.tsx:82](../../../src/ui/learning-schedule.tsx#L82)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 82행 | interactive-when-falsy: disabled ∧ truthy: open | patch({opensDate:e.currentTarget.value})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-cd1324168628

**@onChange** · [src/ui/learning-schedule.tsx:82](../../../src/ui/learning-schedule.tsx#L82)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 82행 | interactive-when-falsy: disabled ∧ truthy: open | patch({opensDate:e.target.value})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-48dc80e60428

**@onInput** · [src/ui/learning-schedule.tsx:82](../../../src/ui/learning-schedule.tsx#L82)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 82행 | interactive-when-falsy: disabled ∧ truthy: open | patch({dueDate:e.currentTarget.value})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-dd758445999f

**@onChange** · [src/ui/learning-schedule.tsx:82](../../../src/ui/learning-schedule.tsx#L82)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 82행 | interactive-when-falsy: disabled ∧ truthy: open | patch({dueDate:e.target.value})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-541652aa58bf

**@onChange** · [src/ui/learning-schedule.tsx:82](../../../src/ui/learning-schedule.tsx#L82)

분기 조건과 가능한 갈림길:

- B-6f7d23182fb7 · ConditionalExpression · e.target.value==='' → truthy / falsy; 바깥 조건: interactive-when-falsy: disabled ∧ truthy: open (82행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 82행 | interactive-when-falsy: disabled ∧ truthy: open | patch({weight:e.target.value===''?null:Number(e.target.value)/100})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |
| 82행 | interactive-when-falsy: disabled ∧ truthy: open ∧ falsy: e.target.value==='' | Number(e.target.value)<br>call |

## H-d20e5eec7fe4

**@onInput** · [src/ui/learning-schedule.tsx:83](../../../src/ui/learning-schedule.tsx#L83)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 83행 | interactive-when-falsy: disabled ∧ truthy: open | patch({opensTime:e.currentTarget.value})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-2388c4eb5a6d

**@onChange** · [src/ui/learning-schedule.tsx:83](../../../src/ui/learning-schedule.tsx#L83)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 83행 | interactive-when-falsy: disabled ∧ truthy: open | patch({opensTime:e.target.value})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-93bd2e134746

**@onInput** · [src/ui/learning-schedule.tsx:83](../../../src/ui/learning-schedule.tsx#L83)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 83행 | interactive-when-falsy: disabled ∧ truthy: open | patch({dueTime:e.currentTarget.value})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-15d87e3ac0a4

**@onChange** · [src/ui/learning-schedule.tsx:83](../../../src/ui/learning-schedule.tsx#L83)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 83행 | interactive-when-falsy: disabled ∧ truthy: open | patch({dueTime:e.target.value})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-d99ff1f78ca7

**@onInput** · [src/ui/learning-schedule.tsx:84](../../../src/ui/learning-schedule.tsx#L84)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 84행 | interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: !draft.dueDate | patch({reviewDate:e.currentTarget.value})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-2542a07f5c6d

**@onChange** · [src/ui/learning-schedule.tsx:84](../../../src/ui/learning-schedule.tsx#L84)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 84행 | interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: !draft.dueDate | patch({reviewDate:e.target.value})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-79407694036f

**@onChange** · [src/ui/learning-schedule.tsx:85](../../../src/ui/learning-schedule.tsx#L85)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 85행 | interactive-when-falsy: disabled ∧ truthy: open | patch({taskText:e.target.value})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-4a0b0d96a81c

**@onChange** · [src/ui/learning-schedule.tsx:86](../../../src/ui/learning-schedule.tsx#L86)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 86행 | interactive-when-falsy: disabled ∧ truthy: open | patch({sourceUrl:e.target.value})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-2fa16e8958a9

**@onChange** · [src/ui/learning-schedule.tsx:87](../../../src/ui/learning-schedule.tsx#L87)

분기 조건과 가능한 갈림길:

- B-4bab53460d14 · ConditionalExpression · e.target.value → truthy / falsy; 바깥 조건: interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: ['lecture','class'].includes(draft.kind) (87행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 87행 | interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: ['lecture','class'].includes(draft.kind) | patch({week:e.target.value?Number(e.target.value):undefined})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |
| 87행 | interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: ['lecture','class'].includes(draft.kind) ∧ truthy: e.target.value | Number(e.target.value)<br>call |

## H-8985f5aae14b

**@onInput** · [src/ui/learning-schedule.tsx:88](../../../src/ui/learning-schedule.tsx#L88)

분기 조건과 가능한 갈림길:

- B-b01432817eec · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: draftKey.current==='new' (88행).
- B-244288e391c6 · CatchClause · e → exception; 바깥 조건: interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: draftKey.current==='new' (88행).
- B-9308a2e8911c · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: draftKey.current==='new' ∧ exception: e (88행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 88행 | interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: draftKey.current==='new' | setRepeatEnd(value)<br>state-update |
| 88행 | interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: draftKey.current==='new' | writeScheduleDraft(data, draftKey.current, draftCurrent.current, draftRaw.current, localStorage, {base:baseSchedule.current,repeatEnd:value})<br>preservation-boundary |
| 88행 | interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: draftKey.current==='new' ∧ exception: e | setError(e instanceof Error?e.message:'반복 설정 초안을 저장하지 못했습니다.')<br>state-update |

## H-1b0bdc8c3ea0

**@onChange** · [src/ui/learning-schedule.tsx:88](../../../src/ui/learning-schedule.tsx#L88)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 88행 | interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: draftKey.current==='new' | setRepeatEnd(e.target.value)<br>state-update |

## H-62b323ef59f5

**@onChange** · [src/ui/learning-schedule.tsx:89](../../../src/ui/learning-schedule.tsx#L89)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 89행 | interactive-when-falsy: disabled ∧ truthy: open | patch({dueMeaning:e.target.value as LearningSchedule['dueMeaning']})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-6dc73704145c

**@callback:nodes.filter** · [src/ui/learning-schedule.tsx:90](../../../src/ui/learning-schedule.tsx#L90)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c0f0796b5d3e

**@callback:nodes.filter(n=>n.subjectId===draft.subjectId).map** · [src/ui/learning-schedule.tsx:90](../../../src/ui/learning-schedule.tsx#L90)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 90행 | interactive-when-falsy: disabled ∧ truthy: open | draft.targetIds.includes(n.id)<br>preservation-boundary |

## H-2d0a6622658b

**@onChange** · [src/ui/learning-schedule.tsx:90](../../../src/ui/learning-schedule.tsx#L90)

분기 조건과 가능한 갈림길:

- B-59b93163b564 · ConditionalExpression · e.target.checked → truthy / falsy; 바깥 조건: interactive-when-falsy: disabled ∧ truthy: open (90행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 90행 | interactive-when-falsy: disabled ∧ truthy: open | patch({targetIds:e.target.checked?[...draft.targetIds,n.id]:draft.targetIds.filter(id=>id!==n.id)})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |
| 90행 | interactive-when-falsy: disabled ∧ truthy: open ∧ falsy: e.target.checked | draft.targetIds.filter(id=>id!==n.id)<br>preservation-boundary<br>전달 콜백: H-76f430cf7c5f |

## H-76f430cf7c5f

**@callback:draft.targetIds.filter** · [src/ui/learning-schedule.tsx:90](../../../src/ui/learning-schedule.tsx#L90)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-02ace81e9354

**@onChange** · [src/ui/learning-schedule.tsx:91](../../../src/ui/learning-schedule.tsx#L91)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 91행 | interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: ['lecture','class'].includes(draft.kind) | patch({notesRequired:e.target.checked})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-cc5bc8e8c008

**@onClick** · [src/ui/learning-schedule.tsx:92](../../../src/ui/learning-schedule.tsx#L92)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 92행 | interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: conflicting | structuredClone(conflicting)<br>call |
| 92행 | interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: conflicting | setConflicting(null)<br>state-update |
| 92행 | interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: conflicting | setError('현재 저장 기록을 기준으로 삼았습니다. 내용을 확인하고 일정 저장을 눌러 주세요.')<br>state-update |

## H-cc9096d8eb3d

**@onChange** · [src/ui/learning-schedule.tsx:93](../../../src/ui/learning-schedule.tsx#L93)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 93행 | interactive-when-falsy: disabled ∧ truthy: open | patch({note:e.target.value})<br>call → [H-de9269105558](ui__learning-schedule.md#h-de9269105558) |

## H-f8fe7b422c42

**@onClick** · [src/ui/learning-schedule.tsx:93](../../../src/ui/learning-schedule.tsx#L93)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 93행 | interactive-when-falsy: disabled ∧ truthy: open | setOpen(false)<br>state-update |

