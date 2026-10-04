# src/ui/workspace-search.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-6d46987a0530

**isOrder** · [src/ui/workspace-search.tsx:17](../../../src/ui/workspace-search.tsx#L17)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1cf9134e0e56

**Excerpt** · [src/ui/workspace-search.tsx:19](../../../src/ui/workspace-search.tsx#L19)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | 별도 조건식 없음 | value.text.slice(0, value.start)<br>call |
| 24행 | truthy: value.end > value.start | value.text.slice(value.start, value.end)<br>call |
| 25행 | 별도 조건식 없음 | value.text.slice(value.end)<br>call |

반환/조기 중단: 20행 <render> [별도 조건식 없음]

## H-353ba67badc2

**WorkspaceSearch** · [src/ui/workspace-search.tsx:30](../../../src/ui/workspace-search.tsx#L30)

분기 조건과 가능한 갈림길:

- B-1bbc7040f99e · ConditionalExpression · current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (155행).
- B-6fb3a0273893 · ConditionalExpression · order === 'relevance' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (209행).
- B-bdf60270bd28 · ConditionalExpression · query.trim() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (233행).
- B-f022c3a30fe7 · ConditionalExpression · waiting → truthy / falsy; 바깥 조건: truthy: query.trim() (236행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 45행 | 별도 조건식 없음 | JSON.stringify([data.namespace, data.userId])<br>call |
| 46행 | 별도 조건식 없음 | useState(0)<br>call |
| 48행 | 별도 조건식 없음 | useMemo(() => { try { return { entries: buildWorkspaceSearch(data, readLearningPlan(data).workspace, false), error: '', }; } catch (error) { return { entries: buildWorkspaceSearch(data, undefined, false), error: error instanceof Error ? error.message : '일정의 검색 정보를 읽지 못했습니다. 원본은 유지했습니다.', }; } }, [data, attempt])<br>call<br>전달 콜백: H-a16991837a4e |
| 64행 | 별도 조건식 없음 | useState(query)<br>call |
| 65행 | 별도 조건식 없음 | useViewContext(data, 'search:limit', 40, isViewPage)<br>call |
| 66행 | 별도 조건식 없음 | useViewContext(data, 'search:kind', 'all', isViewText)<br>call |
| 67행 | 별도 조건식 없음 | useViewContext(data, 'search:order', 'relevance' as SearchOrder, isOrder)<br>call<br>전달 콜백: H-6d46987a0530 |
| 73행 | 별도 조건식 없음 | useState(null)<br>call |
| 74행 | 별도 조건식 없음 | useState(null)<br>call |
| 81행 | 별도 조건식 없음 | useState('')<br>call |
| 82행 | 별도 조건식 없음 | useRef(null)<br>call |
| 83행 | 별도 조건식 없음 | useRef(null)<br>call |
| 84행 | 별도 조건식 없음 | JSON.stringify([query, subjectIds, allScopes, kind, order, limit])<br>call |
| 86행 | 별도 조건식 없음 | useEffect(() => { const next = new WorkspaceSearchClient(); setClient(next); return () => next.dispose(); }, [owner])<br>call<br>전달 콜백: H-0de7cfb757bd |
| 92행 | 별도 조건식 없음 | useEffect(() => { setInput(query); }, [query, owner])<br>call<br>전달 콜백: H-87c38a6276ae |
| 96행 | 별도 조건식 없음 | useEffect(() => { if (!inputMeasure.current) return; const finish = inputMeasure.current; inputMeasure.current = null; return finishUiMeasureAfterPaint(finish); }, [input])<br>call<br>전달 콜백: H-3b7b675a27c8 |
| 102행 | 별도 조건식 없음 | useEffect(() => { if (!client) return; let active = true; const [term, scope, unassigned, selectedKind, selectedOrder, page] = JSON.parse(signature) as [ string, string[], boolean, string, SearchOrder, number, ]; const finish = searchMeasure.current ?? beginUiMeasure('search-results'); searchMeasure.current = null; setSearchError(''); client.update(owner, projection.entries); if (!term.trim()) return; client .query({ query: term, subjectIds: scope, includeUnassigned: unassigned, kind: selectedKind, order: selectedOrder, limit: Math.max(40, page), }) .then((value) => { if (!active \|\| !value) return; setResolved({ owner, entries: projection.entries, signature, result: value.result, finish, }); }) .catch … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-6c49431820c3 |
| 151행 | 별도 조건식 없음 | useEffect(() => { if (!current \|\| !resolved) return; return finishUiMeasureAfterPaint(resolved.finish); }, [current, resolved])<br>call<br>전달 콜백: H-bab50879c2ac |
| 156행 | 별도 조건식 없음 | query.trim()<br>call |
| 190행 | truthy: kind !== 'all' | kinds.some((row) => row.kind === kind)<br>call<br>전달 콜백: H-33f16e567400 |
| 193행 | 별도 조건식 없음 | kinds.map((row) => ( <option key={row.kind} value={row.kind}> {row.kind} · {row.count}개 </option> ))<br>call<br>전달 콜백: H-19ffbe7f0944 |
| 233행 | 별도 조건식 없음 | query.trim()<br>call |
| 238행 | truthy: query.trim() | result.hits.map((entry) => ( <Card key={entry.id} className="workspace-search-result"> <a href={entry.href}>{entry.title}</a> <p className="muted"> {entry.kind} {entry.subjectId ? ` · ${data.subjects.find((subject) => subject.id === entry.subjectId)?.name ?? ''}` : ' · 학기 소속 없음'}{' '} · {entry.reason} </p> <p className="workspace-search-excerpt"> <Excerpt value={entry.excerpt} /> </p> </Card> ))<br>call<br>전달 콜백: H-b9d4619c7b48 |
| 262행 | truthy: query.trim() | Math.max(40, limit)<br>call |

반환/조기 중단: 164행 <render> [별도 조건식 없음]

## H-a16991837a4e

**@callback:useMemo** · [src/ui/workspace-search.tsx:48](../../../src/ui/workspace-search.tsx#L48)

분기 조건과 가능한 갈림길:

- B-c6bed624119e · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (49행).
- B-a3f8752b9a9a · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (54행).
- B-116073974097 · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: exception: error (58행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 51행 | 별도 조건식 없음 | buildWorkspaceSearch(data, readLearningPlan(data).workspace, false)<br>call |
| 51행 | 별도 조건식 없음 | readLearningPlan(data)<br>call |
| 56행 | exception: error | buildWorkspaceSearch(data, undefined, false)<br>call |

반환/조기 중단: 50행 { entries: buildWorkspaceSearch(data, readLearningPlan(data).workspace, false), error: '', } [별도 조건식 없음]; 55행 { entries: buildWorkspaceSearch(data, undefined, false), error: error instanceof Error ? error.message : '일정의 검색 정보를 읽지 못했습니다. 원본은 유지했습니다.', } [exception: error]

## H-0de7cfb757bd

**@callback:useEffect** · [src/ui/workspace-search.tsx:86](../../../src/ui/workspace-search.tsx#L86)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 88행 | 별도 조건식 없음 | setClient(next)<br>state-update |

반환/조기 중단: 89행 () => next.dispose() [별도 조건식 없음]

## H-87c38a6276ae

**@callback:useEffect** · [src/ui/workspace-search.tsx:92](../../../src/ui/workspace-search.tsx#L92)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 93행 | 별도 조건식 없음 | setInput(query)<br>state-update |

## H-3b7b675a27c8

**@callback:useEffect** · [src/ui/workspace-search.tsx:96](../../../src/ui/workspace-search.tsx#L96)

분기 조건과 가능한 갈림길:

- B-ef63c2806b11 · IfStatement · !inputMeasure.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (97행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 100행 | 별도 조건식 없음 | finishUiMeasureAfterPaint(finish)<br>call |

반환/조기 중단: 97행 <render> [truthy: !inputMeasure.current]; 100행 finishUiMeasureAfterPaint(finish) [별도 조건식 없음]

## H-6c49431820c3

**@callback:useEffect** · [src/ui/workspace-search.tsx:102](../../../src/ui/workspace-search.tsx#L102)

분기 조건과 가능한 갈림길:

- B-7c20a55013f0 · IfStatement · !client → truthy / falsy; 바깥 조건: 별도 조건식 없음 (103행).
- B-54616ab028fa · IfStatement · !term.trim() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (117행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 105행 | 별도 조건식 없음 | JSON.parse(signature)<br>call |
| 113행 | nullish: searchMeasure.current | beginUiMeasure('search-results')<br>call |
| 115행 | 별도 조건식 없음 | setSearchError('')<br>state-update |
| 116행 | 별도 조건식 없음 | client.update(owner, projection.entries)<br>call |
| 117행 | 별도 조건식 없음 | term.trim()<br>call |
| 118행 | 별도 조건식 없음 | client<br>      .query({<br>        query: term,<br>        subjectIds: scope,<br>        includeUnassigned: unassigned,<br>        kind: selectedKind,<br>        order: selectedOrder,<br>        limit: Math.max(40, page),<br>      })<br>      .then((value) => {<br>        if (!active \|\| !value) return;<br>        setResolved({<br>          owner,<br>          entries: projection.entries,<br>          signature,<br>          result: value.result,<br>          finish,<br>        });<br>      })<br>      .catch(() => { if (active) { setSearchError('검색 결과를 표시하지 못했습니다. 원문은 유지됩니다. 다시 시도해 주세요.'); finish(false); } })<br>call<br>전달 콜백: H-9b76ab739be0 |
| 118행 | 별도 조건식 없음 | client<br>      .query({<br>        query: term,<br>        subjectIds: scope,<br>        includeUnassigned: unassigned,<br>        kind: selectedKind,<br>        order: selectedOrder,<br>        limit: Math.max(40, page),<br>      })<br>      .then((value) => { if (!active \|\| !value) return; setResolved({ owner, entries: projection.entries, signature, result: value.result, finish, }); })<br>call<br>전달 콜백: H-fceb3fe77001 |
| 118행 | 별도 조건식 없음 | client<br>      .query({ query: term, subjectIds: scope, includeUnassigned: unassigned, kind: selectedKind, order: selectedOrder, limit: Math.max(40, page), })<br>call |
| 125행 | 별도 조건식 없음 | Math.max(40, page)<br>call |

반환/조기 중단: 103행 <render> [truthy: !client]; 117행 <render> [truthy: !term.trim()]; 143행 () => { active = false; } [별도 조건식 없음]

## H-fceb3fe77001

**@callback:client
      .query({
        query: term,
        subjectIds: scope,
        includeUnassigned: unassigned,
        kind: selectedKind,
        order: selectedOrder,
        limit: Math.max(40, page),
      })
      .then** · [src/ui/workspace-search.tsx:127](../../../src/ui/workspace-search.tsx#L127)

분기 조건과 가능한 갈림길:

- B-022c9bf4846b · IfStatement · !active || !value → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: client
      .query({
        query: term,
        subjectIds: scope,
        includeUnassigned: unassigned,
        kind: selectedKind,
        order: selectedOrder,
        limit: Math.max(40, page),
      }) (128행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 129행 | fulfilled-or-explicit-rejection-handler: client<br>      .query({<br>        query: term,<br>        subjectIds: scope,<br>        includeUnassigned: unassigned,<br>        kind: selectedKind,<br>        order: selectedOrder,<br>        limit: Math.max(40, page),<br>      }) | setResolved({ owner, entries: projection.entries, signature, result: value.result, finish, })<br>state-update |

반환/조기 중단: 128행 <render> [fulfilled-or-explicit-rejection-handler: client
      .query({
        query: term,
        subjectIds: scope,
        includeUnassigned: unassigned,
        kind: selectedKind,
        order: selectedOrder,
        limit: Math.max(40, page),
      }) ∧ truthy: !active || !value]

## H-9b76ab739be0

**@callback:client
      .query({
        query: term,
        subjectIds: scope,
        includeUnassigned: unassigned,
        kind: selectedKind,
        order: selectedOrder,
        limit: Math.max(40, page),
      })
      .then((value) => {
        if (!active || !value) return;
        setResolved({
          owner,
          entries: projection.entries,
          signature,
          result: value.result,
          finish,
        });
      })
      .catch** · [src/ui/workspace-search.tsx:137](../../../src/ui/workspace-search.tsx#L137)

분기 조건과 가능한 갈림길:

- B-e783a40fa9f4 · IfStatement · active → truthy / falsy; 바깥 조건: rejected: client
      .query({
        query: term,
        subjectIds: scope,
        includeUnassigned: unassigned,
        kind: selectedKind,
        order: selectedOrder,
        limit: Math.max(40, page),
      })
      .then((value) => {
        if (!active || !value) return;
        setResolved({
          owner,
          entries: projection.entries,
          signature,
          result: value.result,
          finish,
        });
      }) (138행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 139행 | rejected: client<br>      .query({<br>        query: term,<br>        subjectIds: scope,<br>        includeUnassigned: unassigned,<br>        kind: selectedKind,<br>        order: selectedOrder,<br>        limit: Math.max(40, page),<br>      })<br>      .then((value) => {<br>        if (!active \|\| !value) return;<br>        setResolved({<br>          owner,<br>          entries: projection.entries,<br>          signature,<br>          result: value.result,<br>          finish,<br>        });<br>      }) ∧ truthy: active | setSearchError('검색 결과를 표시하지 못했습니다. 원문은 유지됩니다. 다시 시도해 주세요.')<br>state-update |
| 140행 | rejected: client<br>      .query({<br>        query: term,<br>        subjectIds: scope,<br>        includeUnassigned: unassigned,<br>        kind: selectedKind,<br>        order: selectedOrder,<br>        limit: Math.max(40, page),<br>      })<br>      .then((value) => {<br>        if (!active \|\| !value) return;<br>        setResolved({<br>          owner,<br>          entries: projection.entries,<br>          signature,<br>          result: value.result,<br>          finish,<br>        });<br>      }) ∧ truthy: active | finish(false)<br>call |

## H-bab50879c2ac

**@callback:useEffect** · [src/ui/workspace-search.tsx:151](../../../src/ui/workspace-search.tsx#L151)

분기 조건과 가능한 갈림길:

- B-816dd3372b5c · IfStatement · !current || !resolved → truthy / falsy; 바깥 조건: 별도 조건식 없음 (152행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 153행 | 별도 조건식 없음 | finishUiMeasureAfterPaint(resolved.finish)<br>call |

반환/조기 중단: 152행 <render> [truthy: !current || !resolved]; 153행 finishUiMeasureAfterPaint(resolved.finish) [별도 조건식 없음]

## H-d2330e3562e3

**change** · [src/ui/workspace-search.tsx:157](../../../src/ui/workspace-search.tsx#L157)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 158행 | 별도 조건식 없음 | beginUiMeasure('search-results')<br>call |
| 159행 | 별도 조건식 없음 | setInput(value)<br>state-update |
| 160행 | 별도 조건식 없음 | onQueryChange(value)<br>call |
| 161행 | 별도 조건식 없음 | setLimit(40)<br>state-update |

## H-7e88b8f09f97

**@onChange** · [src/ui/workspace-search.tsx:170](../../../src/ui/workspace-search.tsx#L170)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 171행 | 별도 조건식 없음 | beginUiMeasure('input-paint')<br>call |
| 172행 | 별도 조건식 없음 | setInput(event.target.value)<br>state-update |

## H-b5f9cbd30b1e

**@onChange** · [src/ui/workspace-search.tsx:184](../../../src/ui/workspace-search.tsx#L184)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 185행 | 별도 조건식 없음 | setKind(event.target.value)<br>state-update |
| 186행 | 별도 조건식 없음 | setLimit(40)<br>state-update |

## H-33f16e567400

**@callback:kinds.some** · [src/ui/workspace-search.tsx:190](../../../src/ui/workspace-search.tsx#L190)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-19ffbe7f0944

**@callback:kinds.map** · [src/ui/workspace-search.tsx:193](../../../src/ui/workspace-search.tsx#L193)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a323c97a2412

**@onChange** · [src/ui/workspace-search.tsx:202](../../../src/ui/workspace-search.tsx#L202)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 202행 | 별도 조건식 없음 | setOrder(event.target.value as SearchOrder)<br>state-update |

## H-89128268c604

**@onRetry** · [src/ui/workspace-search.tsx:218](../../../src/ui/workspace-search.tsx#L218)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 218행 | truthy: projection.error | setAttempt((value) => value + 1)<br>state-update<br>전달 콜백: H-5feec065160f |

## H-5feec065160f

**@callback:setAttempt** · [src/ui/workspace-search.tsx:218](../../../src/ui/workspace-search.tsx#L218)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3e57f3c439aa

**@onRetry** · [src/ui/workspace-search.tsx:225](../../../src/ui/workspace-search.tsx#L225)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 225행 | truthy: searchError | setAttempt((value) => value + 1)<br>state-update<br>전달 콜백: H-0a3eb8dedb58 |

## H-0a3eb8dedb58

**@callback:setAttempt** · [src/ui/workspace-search.tsx:225](../../../src/ui/workspace-search.tsx#L225)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-dd5d2d526855

**@onClick** · [src/ui/workspace-search.tsx:229](../../../src/ui/workspace-search.tsx#L229)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 229행 | truthy: query | change('')<br>call → [H-d2330e3562e3](ui__workspace-search.md#h-d2330e3562e3) |

## H-b9d4619c7b48

**@callback:result.hits.map** · [src/ui/workspace-search.tsx:238](../../../src/ui/workspace-search.tsx#L238)

분기 조건과 가능한 갈림길:

- B-fddf0d554e0b · ConditionalExpression · entry.subjectId → truthy / falsy; 바깥 조건: truthy: query.trim() (243행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 244행 | truthy: query.trim() ∧ truthy: entry.subjectId | data.subjects.find((subject) => subject.id === entry.subjectId)<br>call<br>전달 콜백: H-54145f07c12e |

## H-54145f07c12e

**@callback:data.subjects.find** · [src/ui/workspace-search.tsx:244](../../../src/ui/workspace-search.tsx#L244)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3fb8c05be961

**@onClick** · [src/ui/workspace-search.tsx:258](../../../src/ui/workspace-search.tsx#L258)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 258행 | truthy: query.trim() ∧ truthy: !waiting && !searchError && !result.total ∧ truthy: kind !== 'all' | setKind('all')<br>state-update |

## H-e3706c7243fa

**@onClick** · [src/ui/workspace-search.tsx:263](../../../src/ui/workspace-search.tsx#L263)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 263행 | truthy: query.trim() ∧ truthy: result.total > Math.max(40, limit) | setLimit((value) => Math.max(40, value) + 40)<br>state-update<br>전달 콜백: H-3dbacce4469c |

## H-3dbacce4469c

**@callback:setLimit** · [src/ui/workspace-search.tsx:263](../../../src/ui/workspace-search.tsx#L263)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 263행 | truthy: query.trim() ∧ truthy: result.total > Math.max(40, limit) | Math.max(40, value)<br>call |

