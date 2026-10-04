# src/ui/concept-library.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-300701fc7845

**errorText** · [src/ui/concept-library.tsx:44](../../../src/ui/concept-library.tsx#L44)

분기 조건과 가능한 갈림길:

- B-ba8c495b130b · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (45행).

## H-c282d292a5fc

**isConceptListPosition** · [src/ui/concept-library.tsx:49](../../../src/ui/concept-library.tsx#L49)

분기 조건과 가능한 갈림길:

- B-4561f8a504f1 · IfStatement · value === null → truthy / falsy; 바깥 조건: 별도 조건식 없음 (50행).
- B-864e0bd7928f · IfStatement · !value || typeof value !== 'object' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (51행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 54행 | truthy: typeof position.sourceId === 'string' | Number.isFinite(position.x)<br>call |
| 55행 | truthy: typeof position.sourceId === 'string' &&<br>    Number.isFinite(position.x) && position.x >= 0 | Number.isFinite(position.y)<br>call |
| 55행 | truthy: typeof position.sourceId === 'string' &&<br>    Number.isFinite(position.x) && position.x >= 0 &&<br>    Number.isFinite(position.y) && position.y >= 0 | Number.isFinite(position.offset)<br>call |

반환/조기 중단: 50행 true [truthy: value === null]; 51행 false [truthy: !value || typeof value !== 'object']; 53행 typeof position.sourceId === 'string' && Number.isFinite(position.x) && position.x >= 0 && Number.isFinite(position.y) && position.y >= 0 && Number.isFinite(position.offset) [별도 조건식 없음]

## H-15319a8c0522

**ConceptLibrary** · [src/ui/concept-library.tsx:65](../../../src/ui/concept-library.tsx#L65)

분기 조건과 가능한 갈림길:

- B-22a3ad8772fe · ConditionalExpression · editing → truthy / falsy; 바깥 조건: 별도 조건식 없음 (105행).
- B-6961b9bb3c91 · ConditionalExpression · editing → truthy / falsy; 바깥 조건: 별도 조건식 없음 (107행).
- B-19ea766e7766 · ConditionalExpression · !editing → truthy / falsy; 바깥 조건: 별도 조건식 없음 (201행).
- B-202039b88758 · ConditionalExpression · editing → truthy / falsy; 바깥 조건: 별도 조건식 없음 (204행).
- B-e78b3707f6ce · ConditionalExpression · !catalog → truthy / falsy; 바깥 조건: 별도 조건식 없음 (392행).
- B-42be72d575c4 · ConditionalExpression · original → truthy / falsy; 바깥 조건: falsy: !catalog (394행).
- B-7222f9ee5578 · ConditionalExpression · editing → truthy / falsy; 바깥 조건: falsy: !catalog ∧ truthy: original (402행).
- B-62f731114b66 · ConditionalExpression · editions.get(original.id)?.status === 'published' && editions.get(original.id)?.screen → truthy / falsy; 바깥 조건: falsy: !catalog ∧ truthy: original ∧ falsy: editing (412행).
- B-c5ac77153bbf · ConditionalExpression · editing → truthy / falsy; 바깥 조건: falsy: !catalog ∧ falsy: original ∧ truthy: !visible.length (460행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 74행 | 별도 조건식 없음 | useViewContext(data, 'concept-catalog', '', isViewText)<br>call |
| 75행 | 별도 조건식 없음 | useViewContext(data, 'concept-query', '', isViewText)<br>call |
| 76행 | 별도 조건식 없음 | useViewContext(data, 'concept-page', 0, isViewPage)<br>call |
| 77행 | 별도 조건식 없음 | useViewContext(data, 'concept-selected', '', isViewText)<br>call |
| 78행 | 별도 조건식 없음 | useViewContext(data, 'concept-editing', false, (v): v is boolean => typeof v === 'boolean')<br>call<br>전달 콜백: H-ad7c499ca0aa |
| 84행 | 별도 조건식 없음 | useViewContext(data, 'concept-filter', '', isViewText)<br>call |
| 85행 | 별도 조건식 없음 | useState('')<br>call |
| 86행 | 별도 조건식 없음 | useState('')<br>call |
| 87행 | 별도 조건식 없음 | useState(false)<br>call |
| 90행 | 별도 조건식 없음 | useMemo(() => (catalog ? parseConceptSource(catalog.raw).items : []), [catalog])<br>call<br>전달 콜백: H-a02cd6f571da |
| 94행 | 별도 조건식 없음 | useMemo(() => new Map( (data.conceptEditions ?? []) .filter((e) => e.catalogId === catalog?.id) .map((e) => [e.sourceId, e]), ), [data.conceptEditions, catalog])<br>call<br>전달 콜백: H-91b7e55b7916 |
| 103행 | 별도 조건식 없음 | originals.find((i) => i.id === selected)<br>call<br>전달 콜백: H-3864cbf5aaa9 |
| 104행 | 별도 조건식 없음 | useRef(null)<br>call |
| 105행 | 별도 조건식 없음 | storagePrefix(data)<br>call |
| 106행 | 별도 조건식 없음 | useViewContext(data, `concept-list-position:${catalog?.id ?? ''}:${editing ? 'editing' : 'reading'}`, null, isConceptListPosition)<br>call<br>전달 콜백: H-c282d292a5fc |
| 110행 | 별도 조건식 없음 | useRef(null)<br>call |
| 111행 | 별도 조건식 없음 | useLayoutEffect(() => { const request = pendingFocus.current; if (!request) return; pendingFocus.current = null; if (request.scope !== viewScope \|\| !library.current) return; if (request.target === 'reader' && original) { const heading = library.current.querySelector<HTMLElement>('.concept-reader h2, .concept-editor h2'); if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); heading.scrollIntoView({ block: 'start', behavior: 'instant' }); } } else if (request.target === 'list' && !original) { const card = listPosition && Array.from( library.current.querySelectorAll<HTMLElement>('[data-concept-source]'), ).find((element) => element.dataset.conceptSource === listPosition.sourceId); cons … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-b4df4c5f8570 |
| 178행 | 별도 조건식 없음 | originals.filter((i) => { const edition = editions.get(i.id), type = edition?.displayType ?? conceptProposal(i).displayType; return ( (editing \|\| edition?.status === 'published') && (!filter \|\| (filter === '미분류' ? !type : filter === '보류' ? edition?.status === 'blocked' : type === filter)) && `${i.name} ${i.id}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ); })<br>call<br>전달 콜백: H-4c014a243cab |
| 192행 | 별도 조건식 없음 | Math.max(0, Math.ceil(visible.length / 30) - 1)<br>call |
| 192행 | 별도 조건식 없음 | Math.ceil(visible.length / 30)<br>call |
| 193행 | 별도 조건식 없음 | Math.min(page, maxPage)<br>call |
| 266행 | truthy: editing ∧ truthy: catalog | originals.length.toLocaleString()<br>call |
| 267행 | truthy: editing ∧ truthy: catalog | Array.from(editions.values()).filter((e) => e.screen)<br>call<br>전달 콜백: H-18edadbc42d9 |
| 267행 | truthy: editing ∧ truthy: catalog | Array.from(editions.values())<br>call |
| 267행 | truthy: editing ∧ truthy: catalog | editions.values()<br>call |
| 268행 | truthy: editing ∧ truthy: catalog | Array.from(editions.values()).filter((e) => e.status === 'published')<br>call<br>전달 콜백: H-b2391aeca03d |
| 268행 | truthy: editing ∧ truthy: catalog | Array.from(editions.values())<br>call |
| 268행 | truthy: editing ∧ truthy: catalog | editions.values()<br>call |
| 269행 | truthy: editing ∧ truthy: catalog | Array.from(editions.values()).filter((e) => e.status === 'blocked')<br>call<br>전달 콜백: H-715c04f36685 |
| 269행 | truthy: editing ∧ truthy: catalog | Array.from(editions.values())<br>call |
| 269행 | truthy: editing ∧ truthy: catalog | editions.values()<br>call |
| 301행 | truthy: editing ∧ truthy: catalog | (data.conceptBatches ?? [])<br>                  .filter((b) => b.catalogId === catalog.id && b.status !== 'closed')<br>                  .map((b) => ( <div className="concept-batch" key={b.id}> <span> {b.sourceIds.length}개 · {b.status === 'paused' ? '중단' : '작성'} ·{' '} {b.sourceIds[0]} </span> <Button onClick={() => downloadConceptFile(conceptJobFile(data, b), `${b.id}.json`)} > 묶음 내보내기 </Button> <Button disabled={busy \|\| !writable} variant="quiet" onClick={() => run( () => repository.execute({ type: 'saveConceptBatch', userId: data.userId, namespace: data.namespace, at: new Date().toISOString(), opId: crypto.randomUUID(), id: b.id, expectedVersion: b.version, content: { catalogId: b.catalogId, sourceIds: b.sourceIds, baseVersions: b.baseVersions, status: b.status === 'paused' ? 'open' : 'paused', }, }), '작업 상태를 저장했습니다.', ) } > {b … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-340300d2e844 |
| 301행 | truthy: editing ∧ truthy: catalog | (data.conceptBatches ?? [])<br>                  .filter((b) => b.catalogId === catalog.id && b.status !== 'closed')<br>call<br>전달 콜백: H-6dafd691a4b3 |
| 385행 | truthy: (data.conceptCatalogs?.length ?? 0) > 1 | data.conceptCatalogs!.map((c) => ( <option key={c.id} value={c.id}> {c.filename} </option> ))<br>call<br>전달 콜백: H-0e17a32c1278 |
| 412행 | falsy: !catalog ∧ truthy: original ∧ falsy: editing | editions.get(original.id)<br>call |
| 413행 | falsy: !catalog ∧ truthy: original ∧ falsy: editing ∧ truthy: editions.get(original.id)?.status === 'published' | editions.get(original.id)<br>call |
| 415행 | falsy: !catalog ∧ truthy: original ∧ falsy: editing ∧ truthy: editions.get(original.id)?.status === 'published' &&<br>            editions.get(original.id)?.screen | editions.get(original.id)<br>call |
| 444행 | falsy: !catalog ∧ falsy: original | CONCEPT_TYPES.map((t) => ( <option key={t}>{t}</option> ))<br>call<br>전달 콜백: H-9b41b57fa09c |
| 456행 | falsy: !catalog ∧ falsy: original | visible.length.toLocaleString()<br>call |
| 466행 | falsy: !catalog ∧ falsy: original | visible.slice(currentPage * 30, currentPage * 30 + 30).map((i) => { const e = editions.get(i.id), proposal = conceptProposal(i); return ( <Button variant="quiet" key={i.id} data-concept-source={i.id} data-navigation-focus={`concept:${catalog.id}:${i.id}:open`} onClick={(event) => { setListPosition({ sourceId: i.id, x: Math.max(0, window.scrollX), y: Math.max(0, window.scrollY), offset: event.currentTarget.getBoundingClientRect().top }); pendingFocus.current = { scope: viewScope, target: 'reader' }; setSelected(i.id); }}> <span>{i.name}</span> {editing && ( <small> {e?.displayType ?? proposal.displayType ?? '미분류'} ·{' '} {e?.status === 'published' ? '읽기용' : e?.status === 'blocked' ? '보류' : e?.screen ? '내용 검토' : '작성 전'} </small> )} </Button> ); })<br>call<br>전달 콜백: H-4e441b93e489 |
| 466행 | falsy: !catalog ∧ falsy: original | visible.slice(currentPage * 30, currentPage * 30 + 30)<br>call |

반환/조기 중단: 194행 <render> [별도 조건식 없음]

## H-ad7c499ca0aa

**@callback:useViewContext** · [src/ui/concept-library.tsx:82](../../../src/ui/concept-library.tsx#L82)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a02cd6f571da

**@callback:useMemo** · [src/ui/concept-library.tsx:91](../../../src/ui/concept-library.tsx#L91)

분기 조건과 가능한 갈림길:

- B-41b71a96a725 · ConditionalExpression · catalog → truthy / falsy; 바깥 조건: 별도 조건식 없음 (91행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 91행 | truthy: catalog | parseConceptSource(catalog.raw)<br>call |

## H-91b7e55b7916

**@callback:useMemo** · [src/ui/concept-library.tsx:95](../../../src/ui/concept-library.tsx#L95)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 97행 | 별도 조건식 없음 | (data.conceptEditions ?? [])<br>          .filter((e) => e.catalogId === catalog?.id)<br>          .map((e) => [e.sourceId, e])<br>call<br>전달 콜백: H-49cbe44e9ea5 |
| 97행 | 별도 조건식 없음 | (data.conceptEditions ?? [])<br>          .filter((e) => e.catalogId === catalog?.id)<br>call<br>전달 콜백: H-cf03a6c4718d |

## H-cf03a6c4718d

**@callback:(data.conceptEditions ?? [])
          .filter** · [src/ui/concept-library.tsx:98](../../../src/ui/concept-library.tsx#L98)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-49cbe44e9ea5

**@callback:(data.conceptEditions ?? [])
          .filter((e) => e.catalogId === catalog?.id)
          .map** · [src/ui/concept-library.tsx:99](../../../src/ui/concept-library.tsx#L99)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3864cbf5aaa9

**@callback:originals.find** · [src/ui/concept-library.tsx:103](../../../src/ui/concept-library.tsx#L103)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b4df4c5f8570

**@callback:useLayoutEffect** · [src/ui/concept-library.tsx:111](../../../src/ui/concept-library.tsx#L111)

분기 조건과 가능한 갈림길:

- B-50d70710f47b · IfStatement · !request → truthy / falsy; 바깥 조건: 별도 조건식 없음 (113행).
- B-1c0539bd5bcc · IfStatement · request.scope !== viewScope || !library.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (115행).
- B-1001a5333006 · IfStatement · request.target === 'reader' && original → truthy / falsy; 바깥 조건: 별도 조건식 없음 (116행).
- B-c39124a867dc · IfStatement · heading → truthy / falsy; 바깥 조건: truthy: request.target === 'reader' && original (118행).
- B-860fd70add8b · IfStatement · request.target === 'list' && !original → truthy / falsy; 바깥 조건: falsy: request.target === 'reader' && original (123행).
- B-879453e39020 · IfStatement · card && listPosition → truthy / falsy; 바깥 조건: falsy: request.target === 'reader' && original ∧ truthy: request.target === 'list' && !original (129행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 117행 | truthy: request.target === 'reader' && original | library.current.querySelector('.concept-reader h2, .concept-editor h2')<br>call |
| 120행 | truthy: request.target === 'reader' && original ∧ truthy: heading | heading.focus({ preventScroll: true })<br>input-control |
| 121행 | truthy: request.target === 'reader' && original ∧ truthy: heading | heading.scrollIntoView({ block: 'start', behavior: 'instant' })<br>call |
| 124행 | falsy: request.target === 'reader' && original ∧ truthy: request.target === 'list' && !original ∧ truthy: listPosition | Array.from(<br>        library.current.querySelectorAll<HTMLElement>('[data-concept-source]'),<br>      ).find((element) => element.dataset.conceptSource === listPosition.sourceId)<br>call<br>전달 콜백: H-56bd826fe456 |
| 124행 | falsy: request.target === 'reader' && original ∧ truthy: request.target === 'list' && !original ∧ truthy: listPosition | Array.from(library.current.querySelectorAll<HTMLElement>('[data-concept-source]'))<br>call |
| 125행 | falsy: request.target === 'reader' && original ∧ truthy: request.target === 'list' && !original ∧ truthy: listPosition | library.current.querySelectorAll('[data-concept-source]')<br>call |
| 127행 | falsy: request.target === 'reader' && original ∧ truthy: request.target === 'list' && !original ∧ falsy: card | library.current.querySelector('[data-concept-library-heading]')<br>call |
| 130행 | falsy: request.target === 'reader' && original ∧ truthy: request.target === 'list' && !original ∧ truthy: card && listPosition | window.scrollTo({ left: listPosition.x, top: Math.max(0, window.scrollY + card.getBoundingClientRect().top - listPosition.offset), behavior: 'instant' })<br>call |
| 131행 | falsy: request.target === 'reader' && original ∧ truthy: request.target === 'list' && !original ∧ truthy: card && listPosition | Math.max(0, window.scrollY + card.getBoundingClientRect().top - listPosition.offset)<br>call |
| 131행 | falsy: request.target === 'reader' && original ∧ truthy: request.target === 'list' && !original ∧ truthy: card && listPosition | card.getBoundingClientRect()<br>call |

반환/조기 중단: 113행 <render> [truthy: !request]; 115행 <render> [truthy: request.scope !== viewScope || !library.current]

## H-56bd826fe456

**@callback:Array.from(
        library.current.querySelectorAll<HTMLElement>('[data-concept-source]'),
      ).find** · [src/ui/concept-library.tsx:126](../../../src/ui/concept-library.tsx#L126)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-865fcc9be0a8

**run** · [src/ui/concept-library.tsx:139](../../../src/ui/concept-library.tsx#L139) · async

분기 조건과 가능한 갈림길:

- B-bd2ad3aaab27 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (143행).
- B-7fe419f8a461 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (148행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 140행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 141행 | 별도 조건식 없음 | setError('')<br>state-update |
| 142행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 144행 | 별도 조건식 없음 | action()<br>call |
| 145행 | 별도 조건식 없음 | onSaved(next)<br>call |
| 147행 | 별도 조건식 없음 | setNotice(message)<br>state-update |
| 149행 | exception: e | onSaved(repository.getSnapshot())<br>call |
| 149행 | exception: e | repository.getSnapshot()<br>call |
| 150행 | exception: e | setError(errorText(e))<br>state-update |
| 150행 | exception: e | errorText(e)<br>call → [H-300701fc7845](ui__concept-library.md#h-300701fc7845) |
| 152행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

## H-0610f5d3732c

**importFile** · [src/ui/concept-library.tsx:155](../../../src/ui/concept-library.tsx#L155) · async

분기 조건과 가능한 갈림길:

- B-e5a0a8488160 · IfStatement · !selected → truthy / falsy; 바깥 조건: 별도 조건식 없음 (156행).
- B-77c05b0f0dba · ConditionalExpression · selected instanceof File → truthy / falsy; 바깥 조건: 별도 조건식 없음 (157행).
- B-d717878b8684 · IfStatement · !files.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (158행).
- B-a65bf934db80 · ConditionalExpression · result → truthy / falsy; 바깥 조건: 별도 조건식 없음 (173행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 157행 | falsy: selected instanceof File | Array.from(selected)<br>call |
| 159행 | 별도 조건식 없음 | run(async () => { if (files.length > 32 \|\| files.some((file) => file.size > 12_000_000)) throw Error('제작 파일의 개수와 크기를 확인해 주세요. 기존 자료는 유지했습니다.'); const raws = await Promise.all(files.map((file) => file.text())); if (raws.every((raw) => JSON.parse(raw).format === 'concept-work-v1')) return importConceptWorkFiles(repository, raws); if (files.length !== 1) throw Error('같은 제작 묶음의 파일을 모두 선택해 주세요. 원문 파일은 하나씩 가져옵니다.'); const raw = raws[0], file = files[0]; return result ? importConceptResults(repository, raw).data : importConceptCatalog(repository, raw, file.name); }, result ? '설명 결과를 가져왔습니다. 내용과 화면을 검토해 주세요.' : '원문을 보관했습니다. 제작할 개념을 고를 수 있습니다.')<br>call → [H-865fcc9be0a8](ui__concept-library.md#h-865fcc9be0a8)<br>전달 콜백: H-80bdfbd9e080 |

반환/조기 중단: 156행 <render> [truthy: !selected]; 158행 <render> [truthy: !files.length]

## H-80bdfbd9e080

**@callback:run** · [src/ui/concept-library.tsx:160](../../../src/ui/concept-library.tsx#L160) · async

분기 조건과 가능한 갈림길:

- B-197f29903e2a · IfStatement · files.length > 32 || files.some((file) => file.size > 12_000_000) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (161행).
- B-e59250b0c502 · IfStatement · raws.every((raw) => JSON.parse(raw).format === 'concept-work-v1') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (164행).
- B-887c06038c36 · IfStatement · files.length !== 1 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (166행).
- B-868dd38dcbf9 · ConditionalExpression · result → truthy / falsy; 바깥 조건: 별도 조건식 없음 (169행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 161행 | falsy: files.length > 32 | files.some((file) => file.size > 12_000_000)<br>call<br>전달 콜백: H-9767ded1f749 |
| 162행 | truthy: files.length > 32 \|\| files.some((file) => file.size > 12_000_000) | Error('제작 파일의 개수와 크기를 확인해 주세요. 기존 자료는 유지했습니다.')<br>call |
| 163행 | 별도 조건식 없음 | Promise.all(files.map((file) => file.text()))<br>call |
| 163행 | 별도 조건식 없음 | files.map((file) => file.text())<br>call<br>전달 콜백: H-293e5df2c30c |
| 164행 | 별도 조건식 없음 | raws.every((raw) => JSON.parse(raw).format === 'concept-work-v1')<br>call<br>전달 콜백: H-74db3e89d2d7 |
| 165행 | truthy: raws.every((raw) => JSON.parse(raw).format === 'concept-work-v1') | importConceptWorkFiles(repository, raws)<br>call |
| 167행 | truthy: files.length !== 1 | Error('같은 제작 묶음의 파일을 모두 선택해 주세요. 원문 파일은 하나씩 가져옵니다.')<br>call |
| 170행 | truthy: result | importConceptResults(repository, raw)<br>call |
| 171행 | falsy: result | importConceptCatalog(repository, raw, file.name)<br>call |

반환/조기 중단: 165행 importConceptWorkFiles(repository, raws) [truthy: raws.every((raw) => JSON.parse(raw).format === 'concept-work-v1')]; 169행 result ? importConceptResults(repository, raw).data : importConceptCatalog(repository, raw, file.name) [별도 조건식 없음]

throw: 162행 Error('제작 파일의 개수와 크기를 확인해 주세요. 기존 자료는 유지했습니다.'); 167행 Error('같은 제작 묶음의 파일을 모두 선택해 주세요. 원문 파일은 하나씩 가져옵니다.')

## H-9767ded1f749

**@callback:files.some** · [src/ui/concept-library.tsx:161](../../../src/ui/concept-library.tsx#L161)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-293e5df2c30c

**@callback:files.map** · [src/ui/concept-library.tsx:163](../../../src/ui/concept-library.tsx#L163)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 163행 | 별도 조건식 없음 | file.text()<br>call |

## H-74db3e89d2d7

**@callback:raws.every** · [src/ui/concept-library.tsx:164](../../../src/ui/concept-library.tsx#L164)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 164행 | 별도 조건식 없음 | JSON.parse(raw)<br>call |

## H-4c014a243cab

**@callback:originals.filter** · [src/ui/concept-library.tsx:178](../../../src/ui/concept-library.tsx#L178)

분기 조건과 가능한 갈림길:

- B-7ec8d48f3b8d · ConditionalExpression · filter === '미분류' → truthy / falsy; 바깥 조건: truthy: editing || edition?.status === 'published' ∧ falsy: !filter (184행).
- B-6fa83ac8a43d · ConditionalExpression · filter === '보류' → truthy / falsy; 바깥 조건: truthy: editing || edition?.status === 'published' ∧ falsy: !filter ∧ falsy: filter === '미분류' (186행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 179행 | 별도 조건식 없음 | editions.get(i.id)<br>call |
| 180행 | nullish: edition?.displayType | conceptProposal(i)<br>call |
| 189행 | truthy: (editing \|\| edition?.status === 'published') &&<br>      (!filter \|\|<br>        (filter === '미분류'<br>          ? !type<br>          : filter === '보류'<br>            ? edition?.status === 'blocked'<br>            : type === filter)) | `${i.name} ${i.id}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())<br>call |
| 189행 | truthy: (editing \|\| edition?.status === 'published') &&<br>      (!filter \|\|<br>        (filter === '미분류'<br>          ? !type<br>          : filter === '보류'<br>            ? edition?.status === 'blocked'<br>            : type === filter)) | `${i.name} ${i.id}`.toLocaleLowerCase()<br>call |
| 189행 | truthy: (editing \|\| edition?.status === 'published') &&<br>      (!filter \|\|<br>        (filter === '미분류'<br>          ? !type<br>          : filter === '보류'<br>            ? edition?.status === 'blocked'<br>            : type === filter)) | query.toLocaleLowerCase()<br>call |

반환/조기 중단: 181행 (editing || edition?.status === 'published') && (!filter || (filter === '미분류' ? !type : filter === '보류' ? edition?.status === 'blocked' : type === filter)) && `${i.name} ${i.id}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()) [별도 조건식 없음]

## H-6c4d87432d8a

**@onClick** · [src/ui/concept-library.tsx:201](../../../src/ui/concept-library.tsx#L201)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 201행 | 별도 조건식 없음 | setEditing(false)<br>state-update |

## H-04328aa10ab0

**@onClick** · [src/ui/concept-library.tsx:204](../../../src/ui/concept-library.tsx#L204)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 204행 | 별도 조건식 없음 | setEditing(true)<br>state-update |

## H-ab2b779144c5

**@onClick** · [src/ui/concept-library.tsx:213](../../../src/ui/concept-library.tsx#L213)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 214행 | truthy: error | run(async () => { await repository.flush?.(); return repository.getSnapshot(); }, '저장 상태를 다시 확인했습니다.')<br>call → [H-865fcc9be0a8](ui__concept-library.md#h-865fcc9be0a8)<br>전달 콜백: H-1fde5cd08333 |

## H-1fde5cd08333

**@callback:run** · [src/ui/concept-library.tsx:214](../../../src/ui/concept-library.tsx#L214) · async


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 216행 | truthy: error | repository.getSnapshot()<br>call |

반환/조기 중단: 216행 repository.getSnapshot() [truthy: error]

## H-893e45847d73

**@onChange** · [src/ui/concept-library.tsx:244](../../../src/ui/concept-library.tsx#L244)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 245행 | truthy: editing | importFile(e.target.files, false)<br>call → [H-0610f5d3732c](ui__concept-library.md#h-0610f5d3732c) |

## H-04142170ed3f

**@onChange** · [src/ui/concept-library.tsx:257](../../../src/ui/concept-library.tsx#L257)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 258행 | truthy: editing | importFile(e.target.files?.[0], true)<br>call → [H-0610f5d3732c](ui__concept-library.md#h-0610f5d3732c) |

## H-18edadbc42d9

**@callback:Array.from(editions.values()).filter** · [src/ui/concept-library.tsx:267](../../../src/ui/concept-library.tsx#L267)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b2391aeca03d

**@callback:Array.from(editions.values()).filter** · [src/ui/concept-library.tsx:268](../../../src/ui/concept-library.tsx#L268)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-715c04f36685

**@callback:Array.from(editions.values()).filter** · [src/ui/concept-library.tsx:269](../../../src/ui/concept-library.tsx#L269)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c4c9b3e25bc2

**@onClick** · [src/ui/concept-library.tsx:274](../../../src/ui/concept-library.tsx#L274)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 275행 | truthy: editing ∧ truthy: catalog | run(() => { const result = openConceptBatch(repository, catalog); downloadConceptFile( conceptJobFile(result.data, result.batch), `${result.batch.id}.json`, ); return result.data; }, '다음 30개까지 작업 묶음으로 내보냈습니다.')<br>call → [H-865fcc9be0a8](ui__concept-library.md#h-865fcc9be0a8)<br>전달 콜백: H-9b22f9ebfa8b |

## H-9b22f9ebfa8b

**@callback:run** · [src/ui/concept-library.tsx:275](../../../src/ui/concept-library.tsx#L275)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 276행 | truthy: editing ∧ truthy: catalog | openConceptBatch(repository, catalog)<br>call |
| 277행 | truthy: editing ∧ truthy: catalog | downloadConceptFile(conceptJobFile(result.data, result.batch), `${result.batch.id}.json`)<br>call |
| 278행 | truthy: editing ∧ truthy: catalog | conceptJobFile(result.data, result.batch)<br>call |

반환/조기 중단: 281행 result.data [truthy: editing ∧ truthy: catalog]

## H-2c9901685174

**@onClick** · [src/ui/concept-library.tsx:289](../../../src/ui/concept-library.tsx#L289)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 290행 | truthy: editing ∧ truthy: catalog | downloadConceptFile(catalog.raw, catalog.filename.split('/').at(-1) ?? '개념 원문.json')<br>call |
| 292행 | truthy: editing ∧ truthy: catalog | catalog.filename.split('/').at(-1)<br>call |
| 292행 | truthy: editing ∧ truthy: catalog | catalog.filename.split('/')<br>call |

## H-6dafd691a4b3

**@callback:(data.conceptBatches ?? [])
                  .filter** · [src/ui/concept-library.tsx:302](../../../src/ui/concept-library.tsx#L302)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-340300d2e844

**@callback:(data.conceptBatches ?? [])
                  .filter((b) => b.catalogId === catalog.id && b.status !== 'closed')
                  .map** · [src/ui/concept-library.tsx:303](../../../src/ui/concept-library.tsx#L303)

분기 조건과 가능한 갈림길:

- B-fe11738cf2d8 · ConditionalExpression · b.status === 'paused' → truthy / falsy; 바깥 조건: truthy: editing ∧ truthy: catalog (306행).
- B-b03116c91d71 · ConditionalExpression · b.status === 'paused' → truthy / falsy; 바깥 조건: truthy: editing ∧ truthy: catalog (339행).

## H-6367b74042a8

**@onClick** · [src/ui/concept-library.tsx:310](../../../src/ui/concept-library.tsx#L310)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 310행 | truthy: editing ∧ truthy: catalog | downloadConceptFile(conceptJobFile(data, b), `${b.id}.json`)<br>call |
| 310행 | truthy: editing ∧ truthy: catalog | conceptJobFile(data, b)<br>call |

## H-b864f74c670d

**@onClick** · [src/ui/concept-library.tsx:317](../../../src/ui/concept-library.tsx#L317)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 318행 | truthy: editing ∧ truthy: catalog | run(() => repository.execute({ type: 'saveConceptBatch', userId: data.userId, namespace: data.namespace, at: new Date().toISOString(), opId: crypto.randomUUID(), id: b.id, expectedVersion: b.version, content: { catalogId: b.catalogId, sourceIds: b.sourceIds, baseVersions: b.baseVersions, status: b.status === 'paused' ? 'open' : 'paused', }, }), '작업 상태를 저장했습니다.')<br>call → [H-865fcc9be0a8](ui__concept-library.md#h-865fcc9be0a8)<br>전달 콜백: H-d618f4236301 |

## H-d618f4236301

**@callback:run** · [src/ui/concept-library.tsx:319](../../../src/ui/concept-library.tsx#L319)

분기 조건과 가능한 갈림길:

- B-79c7cb78d8a0 · ConditionalExpression · b.status === 'paused' → truthy / falsy; 바깥 조건: truthy: editing ∧ truthy: catalog (332행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 320행 | truthy: editing ∧ truthy: catalog | repository.execute({ type: 'saveConceptBatch', userId: data.userId, namespace: data.namespace, at: new Date().toISOString(), opId: crypto.randomUUID(), id: b.id, expectedVersion: b.version, content: { catalogId: b.catalogId, sourceIds: b.sourceIds, baseVersions: b.baseVersions, status: b.status === 'paused' ? 'open' : 'paused', }, })<br>call |
| 324행 | truthy: editing ∧ truthy: catalog | new Date().toISOString()<br>call |
| 325행 | truthy: editing ∧ truthy: catalog | crypto.randomUUID()<br>call |

## H-2c31c9cbca78

**@onClick** · [src/ui/concept-library.tsx:344](../../../src/ui/concept-library.tsx#L344)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 345행 | truthy: editing ∧ truthy: catalog | run(() => repository.execute({ type: 'saveConceptBatch', userId: data.userId, namespace: data.namespace, at: new Date().toISOString(), opId: crypto.randomUUID(), id: b.id, expectedVersion: b.version, content: { catalogId: b.catalogId, sourceIds: b.sourceIds, baseVersions: b.baseVersions, status: 'closed', }, }), '작업 묶음을 닫았습니다. 기존 결과와 이력은 유지했습니다.')<br>call → [H-865fcc9be0a8](ui__concept-library.md#h-865fcc9be0a8)<br>전달 콜백: H-d4b6b0232de8 |

## H-d4b6b0232de8

**@callback:run** · [src/ui/concept-library.tsx:346](../../../src/ui/concept-library.tsx#L346)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 347행 | truthy: editing ∧ truthy: catalog | repository.execute({ type: 'saveConceptBatch', userId: data.userId, namespace: data.namespace, at: new Date().toISOString(), opId: crypto.randomUUID(), id: b.id, expectedVersion: b.version, content: { catalogId: b.catalogId, sourceIds: b.sourceIds, baseVersions: b.baseVersions, status: 'closed', }, })<br>call |
| 351행 | truthy: editing ∧ truthy: catalog | new Date().toISOString()<br>call |
| 352행 | truthy: editing ∧ truthy: catalog | crypto.randomUUID()<br>call |

## H-e1fd5ca08e61

**@onChange** · [src/ui/concept-library.tsx:379](../../../src/ui/concept-library.tsx#L379)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 380행 | truthy: (data.conceptCatalogs?.length ?? 0) > 1 | setCatalogId(e.target.value)<br>state-update |
| 381행 | truthy: (data.conceptCatalogs?.length ?? 0) > 1 | setSelected('')<br>state-update |
| 382행 | truthy: (data.conceptCatalogs?.length ?? 0) > 1 | setPage(0)<br>state-update |

## H-0e17a32c1278

**@callback:data.conceptCatalogs!.map** · [src/ui/concept-library.tsx:385](../../../src/ui/concept-library.tsx#L385)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-027cae9c16ab

**@onClick** · [src/ui/concept-library.tsx:396](../../../src/ui/concept-library.tsx#L396)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 398행 | falsy: !catalog ∧ truthy: original | setSelected('')<br>state-update |

## H-c1283467d6d4

**@onChange** · [src/ui/concept-library.tsx:430](../../../src/ui/concept-library.tsx#L430)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 431행 | falsy: !catalog ∧ falsy: original | setQuery(e.target.value)<br>state-update |
| 432행 | falsy: !catalog ∧ falsy: original | setPage(0)<br>state-update |

## H-13842b8138a1

**@onChange** · [src/ui/concept-library.tsx:438](../../../src/ui/concept-library.tsx#L438)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 439행 | falsy: !catalog ∧ falsy: original | setFilter(e.target.value)<br>state-update |
| 440행 | falsy: !catalog ∧ falsy: original | setPage(0)<br>state-update |

## H-9b41b57fa09c

**@callback:CONCEPT_TYPES.map** · [src/ui/concept-library.tsx:444](../../../src/ui/concept-library.tsx#L444)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4e441b93e489

**@callback:visible.slice(currentPage * 30, currentPage * 30 + 30).map** · [src/ui/concept-library.tsx:466](../../../src/ui/concept-library.tsx#L466)

분기 조건과 가능한 갈림길:

- B-f8cbdb2a7933 · ConditionalExpression · e?.status === 'published' → truthy / falsy; 바깥 조건: falsy: !catalog ∧ falsy: original ∧ truthy: editing (483행).
- B-f810636cc738 · ConditionalExpression · e?.status === 'blocked' → truthy / falsy; 바깥 조건: falsy: !catalog ∧ falsy: original ∧ truthy: editing ∧ falsy: e?.status === 'published' (485행).
- B-1c77998ceaa1 · ConditionalExpression · e?.screen → truthy / falsy; 바깥 조건: falsy: !catalog ∧ falsy: original ∧ truthy: editing ∧ falsy: e?.status === 'published' ∧ falsy: e?.status === 'blocked' (487행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 467행 | falsy: !catalog ∧ falsy: original | editions.get(i.id)<br>call |
| 468행 | falsy: !catalog ∧ falsy: original | conceptProposal(i)<br>call |

반환/조기 중단: 469행 <render> [falsy: !catalog ∧ falsy: original]

## H-8aaae9816cdc

**@onClick** · [src/ui/concept-library.tsx:473](../../../src/ui/concept-library.tsx#L473)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 474행 | falsy: !catalog ∧ falsy: original | setListPosition({ sourceId: i.id, x: Math.max(0, window.scrollX), y: Math.max(0, window.scrollY), offset: event.currentTarget.getBoundingClientRect().top })<br>state-update |
| 474행 | falsy: !catalog ∧ falsy: original | Math.max(0, window.scrollX)<br>call |
| 475행 | falsy: !catalog ∧ falsy: original | Math.max(0, window.scrollY)<br>call |
| 475행 | falsy: !catalog ∧ falsy: original | event.currentTarget.getBoundingClientRect()<br>call |
| 477행 | falsy: !catalog ∧ falsy: original | setSelected(i.id)<br>state-update |

## H-4bad1f4a54d3

**@onClick** · [src/ui/concept-library.tsx:498](../../../src/ui/concept-library.tsx#L498)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 498행 | falsy: !catalog ∧ falsy: original ∧ truthy: maxPage > 0 | setPage(currentPage - 1)<br>state-update |

## H-2cda87eaf295

**@onClick** · [src/ui/concept-library.tsx:504](../../../src/ui/concept-library.tsx#L504)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 504행 | falsy: !catalog ∧ falsy: original ∧ truthy: maxPage > 0 | setPage(currentPage + 1)<br>state-update |

## H-dc376e50bac8

**ConceptEditor** · [src/ui/concept-library.tsx:514](../../../src/ui/concept-library.tsx#L514)

분기 조건과 가능한 갈림길:

- B-a05f2086671d · ConditionalExpression · boot.restored → truthy / falsy; 바깥 조건: 별도 조건식 없음 (565행).
- B-e2924e4a989d · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (568행).
- B-5705a2e7d4c8 · ConditionalExpression · parsed.status === 'blocked' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (574행).
- B-f183ba3fe99e · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (579행).
- B-72ec9775452d · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (583행).
- B-3fcdac68cefa · IfStatement · content → truthy / falsy; 바깥 조건: 별도 조건식 없음 (584행).
- B-531aaecba1c8 · ConditionalExpression · content.status === 'blocked' → truthy / falsy; 바깥 조건: truthy: content (588행).
- B-f96a8ea0ce07 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (592행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 532행 | 별도 조건식 없음 | useState(() => { const key = `${storagePrefix(data)}:concept-editor:${encodeURIComponent(catalog.id)}:${original.id}:v1`; const fallback = saved ? conceptContent(saved) : emptyConceptEdition(catalog.id, original); try { const raw = readConceptDraft(key); const draft = raw ? JSON.parse(raw) : null; return { key, version: draft?.version ?? saved?.version ?? 0, restored: Boolean(draft), checks: Object.fromEntries( Object.keys(EMPTY_CONCEPT_CHECKS).map((k) => [k, draft?.checks?.[k] === true]), ) as unknown as ConceptChecks, text: draft?.text ?? JSON.stringify(fallback, null, 2), error: '', }; } catch { return { key, version: saved?.version ?? 0, restored: false, checks: { ...EMPTY_CONCEPT_CHECKS }, text: … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-d2e2608b6783 |
| 559행 | 별도 조건식 없음 | useState(boot.text)<br>call |
| 560행 | 별도 조건식 없음 | useState(boot.version)<br>call |
| 561행 | 별도 조건식 없음 | useState(boot.error)<br>call |
| 562행 | 별도 조건식 없음 | useState('')<br>call |
| 563행 | 별도 조건식 없음 | useState(false)<br>call |
| 564행 | 별도 조건식 없음 | useState(boot.restored ? boot.checks : (saved?.checks ?? { ...EMPTY_CONCEPT_CHECKS }))<br>call |
| 569행 | 별도 조건식 없음 | JSON.parse(text)<br>call |
| 570행 | 별도 조건식 없음 | validateConceptEdition({ ...parsed, checks: { ...EMPTY_CONCEPT_CHECKS }, status: parsed.status === 'blocked' ? 'blocked' : 'draft', }, true)<br>call |
| 585행 | truthy: content | validateConceptEdition({ ...content, checks: { ...EMPTY_CONCEPT_CHECKS }, status: content.status === 'blocked' ? 'blocked' : 'draft', })<br>call |
| 714행 | 별도 조건식 없음 | data.revisions<br>            .filter((r) => r.entityId === saved?.id)<br>            .map((r) => ( <li key={r.id}> {r.createdAt} · {r.after.version}번째 수정 </li> ))<br>call<br>전달 콜백: H-035f0bf8c160 |
| 714행 | 별도 조건식 없음 | data.revisions<br>            .filter((r) => r.entityId === saved?.id)<br>call<br>전달 콜백: H-95c0de61b1ad |
| 774행 | truthy: content | Boolean(content.screen)<br>call |
| 777행 | truthy: content | CONCEPT_TYPES.map((t) => ( <option key={t}>{t}</option> ))<br>call<br>전달 콜백: H-5438371076f5 |
| 860행 | truthy: content ∧ truthy: content.screen ∧ truthy: content.screen.design | content.screen.design.roles.map((role) => ( <fieldset className="concept-content-role" key={role.key}> <legend> {( { meaning: '뜻', example: '사례', boundary: '성립 범위와 경계', sharedCase: '같은 사례', comparisonAxes: '비교 기준', difference: '차이', counterCase: '혼동하지 말아야 할 사례', whole: '전체', parts: '부분', relations: '관계', scope: '적용 범위', initialState: '시작 상태', transitions: '변화', mechanism: '변화가 일어나는 이유', result: '결과', conditions: '성립 조건', relationship: '핵심 관계', reason: '관계가 성립하는 이유', consequence: '따라오는 결과', goal: '목표', inputs: '입력', decisions: '판단 갈림길', actions: '실행', verification: '결과 확인', sharedSituation: '같은 상황', criteria: '판단 기준', premises: '전제', judgments: '각 관점의 판단', limits: '판단의 한계', } as Record<string, string> )[role.key] ?? role.ke … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-36ff1ede2e97 |
| 933행 | truthy: content ∧ truthy: content.screen | content.screen.scenes.map((scene, index) => ( <details key={SCENE_KEYS[index]}> <summary> {index + 1}. {scene.action} </summary> {(['action', 'title', 'body', 'caption', 'takeaway'] as const).map( (field, fieldIndex) => ( <Textarea key={field} label={ ['선택·단계 이름', '핵심 문장', '설명 본문', '그림 설명', '기억할 판단'][ fieldIndex ] } value={scene[field]} onChange={(e) => content?.screen && change( JSON.stringify( { ...content, screen: { ...content.screen, scenes: content.screen.scenes.map((s, i) => i === index ? { ...s, [field]: e.target.value } : s, ), }, }, null, 2, ), ) } /> ), )} </details> ))<br>call<br>전달 콜백: H-fa31c50cc3d5 |
| 1003행 | falsy: !writable \|\| busy | Boolean(boot.error)<br>call |
| 1023행 | 별도 조건식 없음 | Object.entries(labels).map(([key, label]) => ( <Checkbox key={key} label={label} checked={checks[key as keyof ConceptChecks]} onChange={(e) => { const next = { ...checks, [key]: e.target.checked }; setChecks(next); try { storeDraftSafely(boot.key, JSON.stringify({ version, text, checks: next })); setError(''); } catch (error) { setError(errorText(error)); } }} /> ))<br>call<br>전달 콜백: H-f110bf81dc51 |
| 1023행 | 별도 조건식 없음 | Object.entries(labels)<br>call |
| 1043행 | falsy: !writable \|\| busy | Boolean(boot.error)<br>call |
| 1049행 | falsy: !writable \|\| busy | Object.values(checks).every(Boolean)<br>call |
| 1049행 | falsy: !writable \|\| busy | Object.values(checks)<br>call |

반환/조기 중단: 643행 <render> [별도 조건식 없음]

## H-d2e2608b6783

**@callback:useState** · [src/ui/concept-library.tsx:532](../../../src/ui/concept-library.tsx#L532)

분기 조건과 가능한 갈림길:

- B-1de0d54c0bd3 · ConditionalExpression · saved → truthy / falsy; 바깥 조건: 별도 조건식 없음 (534행).
- B-97a855781ed6 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (535행).
- B-2d4323c8a97e · ConditionalExpression · raw → truthy / falsy; 바깥 조건: 별도 조건식 없음 (537행).
- B-eacf6a91b7d3 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (548행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 533행 | 별도 조건식 없음 | storagePrefix(data)<br>call |
| 533행 | 별도 조건식 없음 | encodeURIComponent(catalog.id)<br>call |
| 534행 | truthy: saved | conceptContent(saved)<br>call |
| 534행 | falsy: saved | emptyConceptEdition(catalog.id, original)<br>call |
| 536행 | 별도 조건식 없음 | readConceptDraft(key)<br>preservation-boundary |
| 537행 | truthy: raw | JSON.parse(raw)<br>call |
| 541행 | 별도 조건식 없음 | Boolean(draft)<br>call |
| 542행 | 별도 조건식 없음 | Object.fromEntries(Object.keys(EMPTY_CONCEPT_CHECKS).map((k) => [k, draft?.checks?.[k] === true]))<br>call |
| 543행 | 별도 조건식 없음 | Object.keys(EMPTY_CONCEPT_CHECKS).map((k) => [k, draft?.checks?.[k] === true])<br>call<br>전달 콜백: H-8eefc60e5d5c |
| 543행 | 별도 조건식 없음 | Object.keys(EMPTY_CONCEPT_CHECKS)<br>call |
| 545행 | nullish: draft?.text | JSON.stringify(fallback, null, 2)<br>call |
| 554행 | exception: exception | JSON.stringify(fallback, null, 2)<br>call |

반환/조기 중단: 538행 { key, version: draft?.version ?? saved?.version ?? 0, restored: Boolean(draft), checks: Object.fromEntries( Object.keys(EMPTY_CONCEPT_CHECKS).map((k) => [k, draft?.checks?.[k] === true]), ) as unknown as ConceptChecks, text: draft?.text ?? JSON.stringify(fallback, null, 2), error: '', } [별도 조건식 없음]; 549행 { key, version: saved?.version ?? 0, restored: false, checks: { ...EMPTY_CONCEPT_CHECKS }, text: JSON.stringify(fallback, null, 2), error: '이전 초안을 읽지 못했습니다. 원문은 보관했습니다. 초안 보관본을 확인해 주세요.', } [exception: exception]

## H-8eefc60e5d5c

**@callback:Object.keys(EMPTY_CONCEPT_CHECKS).map** · [src/ui/concept-library.tsx:543](../../../src/ui/concept-library.tsx#L543)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fe521a4f3e6e

**change** · [src/ui/concept-library.tsx:595](../../../src/ui/concept-library.tsx#L595)

분기 조건과 가능한 갈림길:

- B-6c7012a7c811 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (599행).
- B-e19431bd0c11 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (602행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 596행 | 별도 조건식 없음 | setText(value)<br>state-update |
| 597행 | 별도 조건식 없음 | setChecks({ ...EMPTY_CONCEPT_CHECKS })<br>state-update |
| 598행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 600행 | 별도 조건식 없음 | storeDraftSafely(boot.key, JSON.stringify({ version, text: value }))<br>preservation-boundary |
| 600행 | 별도 조건식 없음 | JSON.stringify({ version, text: value })<br>call |
| 601행 | 별도 조건식 없음 | setError('')<br>state-update |
| 603행 | exception: e | setError(errorText(e))<br>state-update |
| 603행 | exception: e | errorText(e)<br>call → [H-300701fc7845](ui__concept-library.md#h-300701fc7845) |

## H-8fffe658afec

**save** · [src/ui/concept-library.tsx:606](../../../src/ui/concept-library.tsx#L606) · async

분기 조건과 가능한 갈림길:

- B-163967dc1dca · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (609행).
- B-a9b60a857040 · IfStatement · !content || content.catalogId !== catalog.id || content.sourceId !== original.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (610행).
- B-cd72d3e17197 · ConditionalExpression · publish → truthy / falsy; 바깥 조건: 별도 조건식 없음 (615행).
- B-a3eb1ca67f1f · ConditionalExpression · content.status === 'blocked' → truthy / falsy; 바깥 조건: falsy: publish (617행).
- B-c3e68f27e187 · ConditionalExpression · publish → truthy / falsy; 바깥 조건: 별도 조건식 없음 (635행).
- B-2fc83ea18ee3 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (637행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 607행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 608행 | 별도 조건식 없음 | setError('')<br>state-update |
| 611행 | truthy: !content \|\| content.catalogId !== catalog.id \|\| content.sourceId !== original.id | Error('대상 원문과 설명 형식을 확인해 주세요.')<br>call |
| 621행 | 별도 조건식 없음 | saveConceptEdition(repository, nextContent, version)<br>call |
| 622행 | 별도 조건식 없음 | onSaved(next)<br>call |
| 623행 | 별도 조건식 없음 | next.conceptEditions!.find((e) => e.id === conceptEditionId(catalog.id, original.id))<br>call<br>전달 콜백: H-6c04c4a5819d |
| 626행 | 별도 조건식 없음 | setVersion(nextVersion)<br>state-update |
| 627행 | 별도 조건식 없음 | setText(JSON.stringify(nextContent, null, 2))<br>state-update |
| 627행 | 별도 조건식 없음 | JSON.stringify(nextContent, null, 2)<br>call |
| 628행 | 별도 조건식 없음 | storeDraftSafely(boot.key, JSON.stringify({ version: nextVersion, text: JSON.stringify(nextContent, null, 2) }))<br>preservation-boundary |
| 630행 | 별도 조건식 없음 | JSON.stringify({ version: nextVersion, text: JSON.stringify(nextContent, null, 2) })<br>call |
| 630행 | 별도 조건식 없음 | JSON.stringify(nextContent, null, 2)<br>call |
| 633행 | 별도 조건식 없음 | clearStoredDraft(boot.key)<br>preservation-boundary |
| 634행 | 별도 조건식 없음 | setNotice(publish ? '읽기용으로 등록했습니다.' : '설명을 저장했습니다. 내용과 화면을 확인해 주세요.')<br>state-update |
| 638행 | exception: e | setError(errorText(e))<br>state-update |
| 638행 | exception: e | errorText(e)<br>call → [H-300701fc7845](ui__concept-library.md#h-300701fc7845) |
| 640행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

throw: 611행 Error('대상 원문과 설명 형식을 확인해 주세요.')

## H-6c04c4a5819d

**@callback:next.conceptEditions!.find** · [src/ui/concept-library.tsx:624](../../../src/ui/concept-library.tsx#L624)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 624행 | 별도 조건식 없음 | conceptEditionId(catalog.id, original.id)<br>call |

## H-f684cfb65633

**@onClick** · [src/ui/concept-library.tsx:652](../../../src/ui/concept-library.tsx#L652) · async

분기 조건과 가능한 갈림길:

- B-dcc32299ebdf · IfStatement · !revision?.before → truthy / falsy; 바깥 조건: truthy: saved (656행).
- B-8f6382a2539b · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: truthy: saved (661행).
- B-8c46a766ce7e · CatchClause · e → exception; 바깥 조건: truthy: saved (686행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 653행 | truthy: saved | [...repository.getSnapshot().revisions]<br>              .reverse()<br>              .find((r) => r.entityId === saved.id)<br>call<br>전달 콜백: H-8e7b653daa41 |
| 653행 | truthy: saved | [...repository.getSnapshot().revisions]<br>              .reverse()<br>call |
| 653행 | truthy: saved | repository.getSnapshot()<br>call |
| 657행 | truthy: saved ∧ truthy: !revision?.before | setError('처음 작성한 설명은 이력에서 확인할 수 있습니다.')<br>state-update |
| 660행 | truthy: saved | setBusy(true)<br>state-update |
| 662행 | truthy: saved | repository.execute({ type: 'undoRevision', userId: data.userId, namespace: data.namespace, opId: crypto.randomUUID(), at: new Date().toISOString(), revisionId: revision.id, expectedVersion: saved.version, })<br>call |
| 666행 | truthy: saved | crypto.randomUUID()<br>call |
| 667행 | truthy: saved | new Date().toISOString()<br>call |
| 671행 | truthy: saved | onSaved(next)<br>call |
| 672행 | truthy: saved | next.conceptEditions!.find((e) => e.id === saved.id)<br>call<br>전달 콜백: H-611ca08b64b8 |
| 673행 | truthy: saved | setVersion(restored.version)<br>state-update |
| 674행 | truthy: saved | setText(JSON.stringify(conceptContent(restored), null, 2))<br>state-update |
| 674행 | truthy: saved | JSON.stringify(conceptContent(restored), null, 2)<br>call |
| 674행 | truthy: saved | conceptContent(restored)<br>call |
| 675행 | truthy: saved | setChecks(restored.checks)<br>state-update |
| 676행 | truthy: saved | storeDraftSafely(boot.key, JSON.stringify({ version: restored.version, text: JSON.stringify(conceptContent(restored), null, 2), }))<br>preservation-boundary |
| 678행 | truthy: saved | JSON.stringify({ version: restored.version, text: JSON.stringify(conceptContent(restored), null, 2), })<br>call |
| 680행 | truthy: saved | JSON.stringify(conceptContent(restored), null, 2)<br>call |
| 680행 | truthy: saved | conceptContent(restored)<br>call |
| 684행 | truthy: saved | clearStoredDraft(boot.key)<br>preservation-boundary |
| 685행 | truthy: saved | setNotice('직전 수정으로 되돌렸습니다. 이후의 이력도 보관했습니다.')<br>state-update |
| 687행 | truthy: saved ∧ exception: e | setError(errorText(e))<br>state-update |
| 687행 | truthy: saved ∧ exception: e | errorText(e)<br>call → [H-300701fc7845](ui__concept-library.md#h-300701fc7845) |
| 689행 | truthy: saved ∧ always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

반환/조기 중단: 658행 <render> [truthy: saved ∧ truthy: !revision?.before]

## H-8e7b653daa41

**@callback:[...repository.getSnapshot().revisions]
              .reverse()
              .find** · [src/ui/concept-library.tsx:655](../../../src/ui/concept-library.tsx#L655)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-611ca08b64b8

**@callback:next.conceptEditions!.find** · [src/ui/concept-library.tsx:672](../../../src/ui/concept-library.tsx#L672)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-95c0de61b1ad

**@callback:data.revisions
            .filter** · [src/ui/concept-library.tsx:715](../../../src/ui/concept-library.tsx#L715)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-035f0bf8c160

**@callback:data.revisions
            .filter((r) => r.entityId === saved?.id)
            .map** · [src/ui/concept-library.tsx:716](../../../src/ui/concept-library.tsx#L716)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-964ccad017af

**@onChange** · [src/ui/concept-library.tsx:732](../../../src/ui/concept-library.tsx#L732)

분기 조건과 가능한 갈림길:

- B-2ddb621186e2 · IfStatement · content → truthy / falsy; 바깥 조건: truthy: content (733행).
- B-476f5492b96c · ConditionalExpression · content.screen && displayType → truthy / falsy; 바깥 조건: truthy: content ∧ truthy: content (741행).
- B-fd0b68346535 · ConditionalExpression · content.screen.design → truthy / falsy; 바깥 조건: truthy: content ∧ truthy: content ∧ truthy: content.screen && displayType (745행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 735행 | truthy: content ∧ truthy: content | change(JSON.stringify( { ...content, displayType, screen: content.screen && displayType ? { ...content.screen, type: displayType, ...(content.screen.design ? { design: { ...content.screen.design, templateId: conceptTemplates.templates.find( (t) => t.type === displayType, )!.id, roles: conceptTemplates.templates .find((t) => t.type === displayType)! .requiredSlots.map((key) => ({ key, sceneIds: content.screen!.design!.roles.find( (role) => role.key === key, )?.sceneIds ?? [], })), }, } : {}), } : content.screen, }, null, 2, ))<br>call → [H-fe521a4f3e6e](ui__concept-library.md#h-fe521a4f3e6e) |
| 736행 | truthy: content ∧ truthy: content | JSON.stringify({ ...content, displayType, screen: content.screen && displayType ? { ...content.screen, type: displayType, ...(content.screen.design ? { design: { ...content.screen.design, templateId: conceptTemplates.templates.find( (t) => t.type === displayType, )!.id, roles: conceptTemplates.templates .find((t) => t.type === displayType)! .requiredSlots.map((key) => ({ key, sceneIds: content.screen!.design!.roles.find( (role) => role.key === key, )?.sceneIds ?? [], })), }, } : {}), } : content.screen, }, null, 2)<br>call |
| 749행 | truthy: content ∧ truthy: content ∧ truthy: content.screen && displayType ∧ truthy: content.screen.design | conceptTemplates.templates.find((t) => t.type === displayType)<br>call<br>전달 콜백: H-6448843f38e1 |
| 752행 | truthy: content ∧ truthy: content ∧ truthy: content.screen && displayType ∧ truthy: content.screen.design | conceptTemplates.templates<br>                                        .find((t) => t.type === displayType)!<br>                                        .requiredSlots.map((key) => ({ key, sceneIds: content.screen!.design!.roles.find( (role) => role.key === key, )?.sceneIds ?? [], }))<br>call<br>전달 콜백: H-7208f2370406 |
| 752행 | truthy: content ∧ truthy: content ∧ truthy: content.screen && displayType ∧ truthy: content.screen.design | conceptTemplates.templates<br>                                        .find((t) => t.type === displayType)<br>call<br>전달 콜백: H-24f3e9ac6351 |

## H-6448843f38e1

**@callback:conceptTemplates.templates.find** · [src/ui/concept-library.tsx:750](../../../src/ui/concept-library.tsx#L750)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-24f3e9ac6351

**@callback:conceptTemplates.templates
                                        .find** · [src/ui/concept-library.tsx:753](../../../src/ui/concept-library.tsx#L753)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7208f2370406

**@callback:conceptTemplates.templates
                                        .find((t) => t.type === displayType)!
                                        .requiredSlots.map** · [src/ui/concept-library.tsx:754](../../../src/ui/concept-library.tsx#L754)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 757행 | truthy: content ∧ truthy: content ∧ truthy: content.screen && displayType ∧ truthy: content.screen.design | content.screen!.design!.roles.find((role) => role.key === key)<br>call<br>전달 콜백: H-9d5912278049 |

## H-9d5912278049

**@callback:content.screen!.design!.roles.find** · [src/ui/concept-library.tsx:758](../../../src/ui/concept-library.tsx#L758)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5438371076f5

**@callback:CONCEPT_TYPES.map** · [src/ui/concept-library.tsx:777](../../../src/ui/concept-library.tsx#L777)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6e0f67aa1109

**@onChange** · [src/ui/concept-library.tsx:784](../../../src/ui/concept-library.tsx#L784)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 785행 | truthy: content ∧ truthy: content | change(JSON.stringify({ ...content, reason: e.target.value }, null, 2))<br>call → [H-fe521a4f3e6e](ui__concept-library.md#h-fe521a4f3e6e) |
| 785행 | truthy: content ∧ truthy: content | JSON.stringify({ ...content, reason: e.target.value }, null, 2)<br>call |

## H-a38b8e5b75dc

**@onClick** · [src/ui/concept-library.tsx:791](../../../src/ui/concept-library.tsx#L791)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 793행 | truthy: content ∧ truthy: !content.screen && content.displayType ∧ truthy: content | change(JSON.stringify( { ...content, screen: { type: content.displayType, mode: 'plain', navigation: 'static', title: original.name, intro: '', scenes: [ { action: '핵심 보기', title: '어떤 뜻인가요?', body: original.def, caption: '', takeaway: original.insight, }, ], }, }, null, 2, ))<br>call → [H-fe521a4f3e6e](ui__concept-library.md#h-fe521a4f3e6e) |
| 794행 | truthy: content ∧ truthy: !content.screen && content.displayType ∧ truthy: content | JSON.stringify({ ...content, screen: { type: content.displayType, mode: 'plain', navigation: 'static', title: original.name, intro: '', scenes: [ { action: '핵심 보기', title: '어떤 뜻인가요?', body: original.def, caption: '', takeaway: original.insight, }, ], }, }, null, 2)<br>call |

## H-969f72571ea3

**@onChange** · [src/ui/concept-library.tsx:828](../../../src/ui/concept-library.tsx#L828)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 830행 | truthy: content ∧ truthy: content.screen ∧ truthy: content?.screen | change(JSON.stringify( { ...content, screen: { ...content.screen, title: e.target.value } }, null, 2, ))<br>call → [H-fe521a4f3e6e](ui__concept-library.md#h-fe521a4f3e6e) |
| 831행 | truthy: content ∧ truthy: content.screen ∧ truthy: content?.screen | JSON.stringify({ ...content, screen: { ...content.screen, title: e.target.value } }, null, 2)<br>call |

## H-ee3f17001c14

**@onChange** · [src/ui/concept-library.tsx:842](../../../src/ui/concept-library.tsx#L842)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 844행 | truthy: content ∧ truthy: content.screen ∧ truthy: content?.screen | change(JSON.stringify( { ...content, screen: { ...content.screen, intro: e.target.value } }, null, 2, ))<br>call → [H-fe521a4f3e6e](ui__concept-library.md#h-fe521a4f3e6e) |
| 845행 | truthy: content ∧ truthy: content.screen ∧ truthy: content?.screen | JSON.stringify({ ...content, screen: { ...content.screen, intro: e.target.value } }, null, 2)<br>call |

## H-36ff1ede2e97

**@callback:content.screen.design.roles.map** · [src/ui/concept-library.tsx:860](../../../src/ui/concept-library.tsx#L860)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 897행 | truthy: content ∧ truthy: content.screen ∧ truthy: content.screen.design | content.screen!.scenes.map((scene) => ( <Checkbox key={scene.id} label={scene.action} checked={role.sceneIds.includes(scene.id!)} onChange={(event) => { const nextIds = event.target.checked ? [...role.sceneIds, scene.id!] : role.sceneIds.filter((id) => id !== scene.id); change( JSON.stringify( { ...content, screen: { ...content.screen, design: { ...content.screen!.design, roles: content.screen!.design!.roles.map((current) => current.key === role.key ? { ...current, sceneIds: nextIds } : current, ), }, }, }, null, 2, ), ); }} /> ))<br>call<br>전달 콜백: H-d5b2d807bbd3 |

## H-d5b2d807bbd3

**@callback:content.screen!.scenes.map** · [src/ui/concept-library.tsx:897](../../../src/ui/concept-library.tsx#L897)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 901행 | truthy: content ∧ truthy: content.screen ∧ truthy: content.screen.design | role.sceneIds.includes(scene.id!)<br>call |

## H-d2c91dfe0aaf

**@onChange** · [src/ui/concept-library.tsx:902](../../../src/ui/concept-library.tsx#L902)

분기 조건과 가능한 갈림길:

- B-23bae24c62ac · ConditionalExpression · event.target.checked → truthy / falsy; 바깥 조건: truthy: content ∧ truthy: content.screen ∧ truthy: content.screen.design (903행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 905행 | truthy: content ∧ truthy: content.screen ∧ truthy: content.screen.design ∧ falsy: event.target.checked | role.sceneIds.filter((id) => id !== scene.id)<br>call<br>전달 콜백: H-07584f7ec0fa |
| 906행 | truthy: content ∧ truthy: content.screen ∧ truthy: content.screen.design | change(JSON.stringify( { ...content, screen: { ...content.screen, design: { ...content.screen!.design, roles: content.screen!.design!.roles.map((current) => current.key === role.key ? { ...current, sceneIds: nextIds } : current, ), }, }, }, null, 2, ))<br>call → [H-fe521a4f3e6e](ui__concept-library.md#h-fe521a4f3e6e) |
| 907행 | truthy: content ∧ truthy: content.screen ∧ truthy: content.screen.design | JSON.stringify({ ...content, screen: { ...content.screen, design: { ...content.screen!.design, roles: content.screen!.design!.roles.map((current) => current.key === role.key ? { ...current, sceneIds: nextIds } : current, ), }, }, }, null, 2)<br>call |
| 914행 | truthy: content ∧ truthy: content.screen ∧ truthy: content.screen.design | content.screen!.design!.roles.map((current) => current.key === role.key ? { ...current, sceneIds: nextIds } : current)<br>call<br>전달 콜백: H-123ab5537581 |

## H-07584f7ec0fa

**@callback:role.sceneIds.filter** · [src/ui/concept-library.tsx:905](../../../src/ui/concept-library.tsx#L905)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-123ab5537581

**@callback:content.screen!.design!.roles.map** · [src/ui/concept-library.tsx:914](../../../src/ui/concept-library.tsx#L914)

분기 조건과 가능한 갈림길:

- B-ac959b6c79d2 · ConditionalExpression · current.key === role.key → truthy / falsy; 바깥 조건: truthy: content ∧ truthy: content.screen ∧ truthy: content.screen.design (915행).

## H-fa31c50cc3d5

**@callback:content.screen.scenes.map** · [src/ui/concept-library.tsx:933](../../../src/ui/concept-library.tsx#L933)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 938행 | truthy: content ∧ truthy: content.screen | (['action', 'title', 'body', 'caption', 'takeaway'] as const).map((field, fieldIndex) => ( <Textarea key={field} label={ ['선택·단계 이름', '핵심 문장', '설명 본문', '그림 설명', '기억할 판단'][ fieldIndex ] } value={scene[field]} onChange={(e) => content?.screen && change( JSON.stringify( { ...content, screen: { ...content.screen, scenes: content.screen.scenes.map((s, i) => i === index ? { ...s, [field]: e.target.value } : s, ), }, }, null, 2, ), ) } /> ))<br>call<br>전달 콜백: H-5af782f78dec |

## H-5af782f78dec

**@callback:(['action', 'title', 'body', 'caption', 'takeaway'] as const).map** · [src/ui/concept-library.tsx:939](../../../src/ui/concept-library.tsx#L939)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-30d9e7a8ee31

**@onChange** · [src/ui/concept-library.tsx:948](../../../src/ui/concept-library.tsx#L948)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 950행 | truthy: content ∧ truthy: content.screen ∧ truthy: content?.screen | change(JSON.stringify( { ...content, screen: { ...content.screen, scenes: content.screen.scenes.map((s, i) => i === index ? { ...s, [field]: e.target.value } : s, ), }, }, null, 2, ))<br>call → [H-fe521a4f3e6e](ui__concept-library.md#h-fe521a4f3e6e) |
| 951행 | truthy: content ∧ truthy: content.screen ∧ truthy: content?.screen | JSON.stringify({ ...content, screen: { ...content.screen, scenes: content.screen.scenes.map((s, i) => i === index ? { ...s, [field]: e.target.value } : s, ), }, }, null, 2)<br>call |
| 956행 | truthy: content ∧ truthy: content.screen ∧ truthy: content?.screen | content.screen.scenes.map((s, i) => i === index ? { ...s, [field]: e.target.value } : s)<br>call<br>전달 콜백: H-60391c7e2f40 |

## H-60391c7e2f40

**@callback:content.screen.scenes.map** · [src/ui/concept-library.tsx:956](../../../src/ui/concept-library.tsx#L956)

분기 조건과 가능한 갈림길:

- B-1984e084008c · ConditionalExpression · i === index → truthy / falsy; 바깥 조건: truthy: content ∧ truthy: content.screen ∧ truthy: content?.screen (957행).

## H-beb9e9aa4343

**@onChange** · [src/ui/concept-library.tsx:976](../../../src/ui/concept-library.tsx#L976)

분기 조건과 가능한 갈림길:

- B-16555abd2a89 · ConditionalExpression · e.target.value → truthy / falsy; 바깥 조건: truthy: content ∧ truthy: content (983행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 978행 | truthy: content ∧ truthy: content | change(JSON.stringify( { ...content, issue: e.target.value, status: e.target.value ? 'blocked' : 'draft', }, null, 2, ))<br>call → [H-fe521a4f3e6e](ui__concept-library.md#h-fe521a4f3e6e) |
| 979행 | truthy: content ∧ truthy: content | JSON.stringify({ ...content, issue: e.target.value, status: e.target.value ? 'blocked' : 'draft', }, null, 2)<br>call |

## H-4118bf7d9cbb

**@onChange** · [src/ui/concept-library.tsx:999](../../../src/ui/concept-library.tsx#L999)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 999행 | 별도 조건식 없음 | change(e.target.value)<br>call → [H-fe521a4f3e6e](ui__concept-library.md#h-fe521a4f3e6e) |

## H-5f823e0f1378

**@onClick** · [src/ui/concept-library.tsx:1003](../../../src/ui/concept-library.tsx#L1003)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1003행 | 별도 조건식 없음 | save(false)<br>call → [H-8fffe658afec](ui__concept-library.md#h-8fffe658afec) |

## H-c4eb9afa4e5a

**@onClick** · [src/ui/concept-library.tsx:1008](../../../src/ui/concept-library.tsx#L1008)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1008행 | 별도 조건식 없음 | downloadConceptFile(text, `${original.id}-draft.json`)<br>call |

## H-f110bf81dc51

**@callback:Object.entries(labels).map** · [src/ui/concept-library.tsx:1023](../../../src/ui/concept-library.tsx#L1023)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2efb3b73eaa0

**@onChange** · [src/ui/concept-library.tsx:1028](../../../src/ui/concept-library.tsx#L1028)

분기 조건과 가능한 갈림길:

- B-7e564fb348dc · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (1031행).
- B-04919492ff30 · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (1034행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1030행 | 별도 조건식 없음 | setChecks(next)<br>state-update |
| 1032행 | 별도 조건식 없음 | storeDraftSafely(boot.key, JSON.stringify({ version, text, checks: next }))<br>preservation-boundary |
| 1032행 | 별도 조건식 없음 | JSON.stringify({ version, text, checks: next })<br>call |
| 1033행 | 별도 조건식 없음 | setError('')<br>state-update |
| 1035행 | exception: error | setError(errorText(error))<br>state-update |
| 1035행 | exception: error | errorText(error)<br>call → [H-300701fc7845](ui__concept-library.md#h-300701fc7845) |

## H-d89c54f87e92

**@onClick** · [src/ui/concept-library.tsx:1044](../../../src/ui/concept-library.tsx#L1044)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1044행 | 별도 조건식 없음 | save(false)<br>call → [H-8fffe658afec](ui__concept-library.md#h-8fffe658afec) |

## H-08294719a5b2

**@onClick** · [src/ui/concept-library.tsx:1050](../../../src/ui/concept-library.tsx#L1050)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1050행 | 별도 조건식 없음 | save(true)<br>call → [H-8fffe658afec](ui__concept-library.md#h-8fffe658afec) |

## H-69b5b35fdcba

**ConceptReader** · [src/ui/concept-library.tsx:1057](../../../src/ui/concept-library.tsx#L1057)

분기 조건과 가능한 갈림길:

- B-409a343b996e · IfStatement · !Array.isArray(screen.scenes) || !screen.scenes.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1086행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1068행 | 별도 조건식 없음 | conceptReadingKey(data, sourceKey)<br>call |
| 1069행 | 별도 조건식 없음 | useState('')<br>call |
| 1070행 | 별도 조건식 없음 | useViewContext(data, `concept-scene:${sourceKey}:${screen.scenes.map((s, i) => conceptSceneKey(screen, i)).join('\|')}`, readConceptPosition(readingKey, screen), isViewPage)<br>call |
| 1072행 | 별도 조건식 없음 | screen.scenes.map((s, i) => conceptSceneKey(screen, i)).join('\|')<br>call |
| 1072행 | 별도 조건식 없음 | screen.scenes.map((s, i) => conceptSceneKey(screen, i))<br>call<br>전달 콜백: H-9129423ae08f |
| 1073행 | 별도 조건식 없음 | readConceptPosition(readingKey, screen)<br>call |
| 1076행 | 별도 조건식 없음 | Math.min(selection, screen.scenes.length - 1)<br>call |
| 1086행 | 별도 조건식 없음 | Array.isArray(screen.scenes)<br>call |
| 1101행 | truthy: screen.navigation === 'choose' && screen.scenes.length > 1 | screen.scenes.map((s, i) => ( <Button key={SCENE_KEYS[i]} variant="quiet" aria-pressed={i === index} onClick={() => select(i)} > {s.action} </Button> ))<br>call<br>전달 콜백: H-353f69de7ccd |
| 1114행 | 별도 조건식 없음 | screen.scenes.map((s, i) => ( <section key={SCENE_KEYS[i]} className={`concept-stage ${i === index ? 'is-current' : ''}`} aria-hidden={i !== index} inert={i !== index} > <h3>{s.title}</h3> {s.figure && <ConceptFigureView figure={s.figure} data={data} viewKey={`${sourceKey}:${conceptSceneKey(screen, i)}`} />} {s.visual ? ( <ConceptVisualView visual={s.visual} /> ) : ( s.figure ? null : <ConceptDiagram screen={screen} index={i} /> )} <p className="concept-body" data-concept-text={s.body}><ConceptText text={s.body} /></p> {s.formula ? ( <MathFormula tex={s.formula.tex} label={s.formula.spoken} /> ) : ( s.math && <p className="concept-math" data-concept-text={s.math}><ConceptText text={s.math} /></p> )} {s.captio … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-f6d71da570da |

반환/조기 중단: 1087행 <render> [truthy: !Array.isArray(screen.scenes) || !screen.scenes.length]; 1088행 <render> [별도 조건식 없음]

## H-9129423ae08f

**@callback:screen.scenes.map** · [src/ui/concept-library.tsx:1072](../../../src/ui/concept-library.tsx#L1072)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1072행 | 별도 조건식 없음 | conceptSceneKey(screen, i)<br>call |

## H-f2ad827d82e2

**select** · [src/ui/concept-library.tsx:1077](../../../src/ui/concept-library.tsx#L1077)

분기 조건과 가능한 갈림길:

- B-279fe30d9926 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (1079행).
- B-0c4111822032 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (1082행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1078행 | 별도 조건식 없음 | setSelection(next)<br>state-update |
| 1080행 | 별도 조건식 없음 | saveConceptPosition(readingKey, screen, next)<br>call |
| 1081행 | 별도 조건식 없음 | setPositionError('')<br>state-update |
| 1083행 | exception: exception | setPositionError('읽던 위치를 이 기기에 저장하지 못했습니다. 현재 화면은 유지했습니다.')<br>state-update |

## H-353f69de7ccd

**@callback:screen.scenes.map** · [src/ui/concept-library.tsx:1101](../../../src/ui/concept-library.tsx#L1101)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8923b340b6f8

**@onClick** · [src/ui/concept-library.tsx:1106](../../../src/ui/concept-library.tsx#L1106)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1106행 | truthy: screen.navigation === 'choose' && screen.scenes.length > 1 | select(i)<br>call → [H-f2ad827d82e2](ui__concept-library.md#h-f2ad827d82e2) |

## H-f6d71da570da

**@callback:screen.scenes.map** · [src/ui/concept-library.tsx:1114](../../../src/ui/concept-library.tsx#L1114)

분기 조건과 가능한 갈림길:

- B-bb3a59ac45e9 · ConditionalExpression · i === index → truthy / falsy; 바깥 조건: interactive-when-falsy: i !== index (1117행).
- B-0babbded8391 · ConditionalExpression · s.visual → truthy / falsy; 바깥 조건: interactive-when-falsy: i !== index (1123행).
- B-2191e6165f94 · ConditionalExpression · s.figure → truthy / falsy; 바깥 조건: interactive-when-falsy: i !== index ∧ falsy: s.visual (1126행).
- B-be065e5fa337 · ConditionalExpression · s.formula → truthy / falsy; 바깥 조건: interactive-when-falsy: i !== index (1129행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1122행 | interactive-when-falsy: i !== index ∧ truthy: s.figure | conceptSceneKey(screen, i)<br>call |

## H-08c489c1aeba

**@onClick** · [src/ui/concept-library.tsx:1141](../../../src/ui/concept-library.tsx#L1141)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1141행 | truthy: screen.navigation === 'steps' && screen.scenes.length > 1 | select(index - 1)<br>call → [H-f2ad827d82e2](ui__concept-library.md#h-f2ad827d82e2) |

## H-147fe1c6400b

**@onClick** · [src/ui/concept-library.tsx:1147](../../../src/ui/concept-library.tsx#L1147)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1147행 | truthy: screen.navigation === 'steps' && screen.scenes.length > 1 | select(index + 1)<br>call → [H-f2ad827d82e2](ui__concept-library.md#h-f2ad827d82e2) |

## H-2568c389a86d

**@onClick** · [src/ui/concept-library.tsx:1154](../../../src/ui/concept-library.tsx#L1154)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1154행 | truthy: screen.scenes.length > 1 | select(0)<br>call → [H-f2ad827d82e2](ui__concept-library.md#h-f2ad827d82e2) |

## H-734669cb6174

**ConceptVisualView** · [src/ui/concept-library.tsx:1163](../../../src/ui/concept-library.tsx#L1163)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1168행 | 별도 조건식 없음 | visual.nodes.map((n) => [n.id, n.label])<br>call<br>전달 콜백: H-02674af4540d |
| 1173행 | 별도 조건식 없음 | visual.nodes.map((node) => ( <div key={node.id} className={visual.highlighted.includes(node.id) ? 'is-emphasized' : ''} > <dt data-concept-text={node.label}><ConceptText text={node.label} /></dt> <dd data-concept-text={node.detail}><ConceptText text={node.detail} /></dd> </div> ))<br>call<br>전달 콜백: H-28f7190efc33 |
| 1185행 | truthy: visual.relations.length > 0 | occurrenceRows(visual.relations, relation => JSON.stringify(relation)).map(({value: r, key}) => ( <li key={key}> <span data-concept-text={names.get(r.from)}><ConceptText text={names.get(r.from) ?? ''} /></span> <span aria-hidden="true"> → </span> <span data-concept-text={names.get(r.to)}><ConceptText text={names.get(r.to) ?? ''} /></span> <p data-concept-text={r.label}><ConceptText text={r.label} /></p> </li> ))<br>call<br>전달 콜백: H-e7a2ec294ffc |
| 1185행 | truthy: visual.relations.length > 0 | occurrenceRows(visual.relations, relation => JSON.stringify(relation))<br>call<br>전달 콜백: H-04b76a1ecc17 |

반환/조기 중단: 1169행 <render> [별도 조건식 없음]

## H-02674af4540d

**@callback:visual.nodes.map** · [src/ui/concept-library.tsx:1168](../../../src/ui/concept-library.tsx#L1168)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-28f7190efc33

**@callback:visual.nodes.map** · [src/ui/concept-library.tsx:1173](../../../src/ui/concept-library.tsx#L1173)

분기 조건과 가능한 갈림길:

- B-8e17d74f5c5d · ConditionalExpression · visual.highlighted.includes(node.id) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1176행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1176행 | 별도 조건식 없음 | visual.highlighted.includes(node.id)<br>call |

## H-04b76a1ecc17

**@callback:occurrenceRows** · [src/ui/concept-library.tsx:1185](../../../src/ui/concept-library.tsx#L1185)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1185행 | truthy: visual.relations.length > 0 | JSON.stringify(relation)<br>call |

## H-e7a2ec294ffc

**@callback:occurrenceRows(visual.relations, relation => JSON.stringify(relation)).map** · [src/ui/concept-library.tsx:1185](../../../src/ui/concept-library.tsx#L1185)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1187행 | truthy: visual.relations.length > 0 | names.get(r.from)<br>call |
| 1187행 | truthy: visual.relations.length > 0 | names.get(r.from)<br>call |
| 1189행 | truthy: visual.relations.length > 0 | names.get(r.to)<br>call |
| 1189행 | truthy: visual.relations.length > 0 | names.get(r.to)<br>call |

## H-fd38f0459ea5

**ConceptDiagram** · [src/ui/concept-library.tsx:1199](../../../src/ui/concept-library.tsx#L1199)

분기 조건과 가능한 갈림길:

- B-f06d1295aaac · IfStatement · screen.mode === 'structure' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1200행).
- B-e99bfcb1b909 · IfStatement · screen.mode === 'comparison' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1244행).
- B-a2bd60860deb · ConditionalExpression · index === 1 → truthy / falsy; 바깥 조건: truthy: screen.mode === 'comparison' (1252행).
- B-0837ff09c1b8 · ConditionalExpression · index === 1 → truthy / falsy; 바깥 조건: truthy: screen.mode === 'comparison' (1270행).
- B-400411ba1aa9 · ConditionalExpression · index === 0 → truthy / falsy; 바깥 조건: truthy: screen.mode === 'comparison' ∧ falsy: index === 1 (1292행).
- B-6e79032d10f9 · ConditionalExpression · index === 1 → truthy / falsy; 바깥 조건: truthy: screen.mode === 'comparison' (1304행).
- B-938dfcf5461b · IfStatement · screen.mode === 'pigeon' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1310행).
- B-37282c563528 · ConditionalExpression · screen.mode === 'opportunity' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1327행).
- B-8f4a067eb735 · ConditionalExpression · screen.mode === 'feedback' → truthy / falsy; 바깥 조건: falsy: screen.mode === 'opportunity' (1329행).
- B-b49cdb9a3f68 · ConditionalExpression · screen.mode === 'proof' → truthy / falsy; 바깥 조건: falsy: screen.mode === 'opportunity' ∧ falsy: screen.mode === 'feedback' (1331행).
- B-86695d5bb266 · ConditionalExpression · screen.mode === 'structure' → truthy / falsy; 바깥 조건: falsy: screen.mode === 'opportunity' ∧ falsy: screen.mode === 'feedback' ∧ falsy: screen.mode === 'proof' (1333행).
- B-713f3cfd2f41 · ConditionalExpression · screen.mode === 'comparison' → truthy / falsy; 바깥 조건: falsy: screen.mode === 'opportunity' ∧ falsy: screen.mode === 'feedback' ∧ falsy: screen.mode === 'proof' ∧ falsy: screen.mode === 'structure' (1335행).
- B-975a4ba7cad8 · ConditionalExpression · index === 1 → truthy / falsy; 바깥 조건: falsy: screen.mode === 'opportunity' ∧ falsy: screen.mode === 'feedback' ∧ falsy: screen.mode === 'proof' ∧ falsy: screen.mode === 'structure' ∧ truthy: screen.mode === 'comparison' (1336행).
- B-34b6b7bf2756 · ConditionalExpression · screen.mode === 'perspective' → truthy / falsy; 바깥 조건: falsy: screen.mode === 'opportunity' ∧ falsy: screen.mode === 'feedback' ∧ falsy: screen.mode === 'proof' ∧ falsy: screen.mode === 'structure' ∧ falsy: screen.mode === 'comparison' (1339행).
- B-ea9418d6fb7a · ConditionalExpression · nodes.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1342행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1209행 | truthy: screen.mode === 'structure' | ['설계', '점검', '조작'].map((label, i) => ( <g key={label} opacity={i === index ? 1 : 0.45}> <rect x={30 + i * 155} y={30} width={100} height={90} rx={4} fill="none" stroke="currentColor" strokeWidth={i === index ? 2 : 1} /> <circle cx={55 + i * 155} cy={i === 1 ? 55 : 75} r={10} fill="none" stroke="currentColor" /> <circle cx={100 + i * 155} cy={i === 1 ? 95 : 65} r={12} fill="none" stroke="currentColor" /> <text x={80 + i * 155} y={145} textAnchor="middle" fill="currentColor"> {label} </text> </g> ))<br>call<br>전달 콜백: H-3956b574e717 |
| 1316행 | truthy: screen.mode === 'pigeon' | MONTHS.map((month) => ( <span key={month}> {month}월<strong>{Math.floor(count / 12) + (month <= count % 12 ? 1 : 0)}명</strong> </span> ))<br>call<br>전달 콜백: H-6d0e898f231f |
| 1344행 | truthy: nodes.length | nodes.map((n, i) => ( <div key={n} className={i === index ? 'concept-node is-selected' : 'concept-node'}> {n} {screen.mode === 'opportunity' && ( <small> {i === index ? '선택' : i === (index === 0 ? 1 : 0) ? '포기한 가장 가치 있는 대안' : '다른 대안'} </small> )} {screen.mode === 'feedback' && i < 3 && <span aria-hidden="true"> →</span>} </div> ))<br>call<br>전달 콜백: H-61c94c53f8cc |

반환/조기 중단: 1201행 <render> [truthy: screen.mode === 'structure']; 1245행 <render> [truthy: screen.mode === 'comparison']; 1312행 <render> [truthy: screen.mode === 'pigeon']; 1342행 nodes.length ? ( <figure className="concept-diagram concept-nodes" aria-label="관계 살펴보기"> {nodes.map((n, i) => ( <div key={n} className={i === index ? 'concept-node is-selected' : 'concept-node'}> {n} {screen.mode === 'opportunity' && ( <small> {i === index ? '선택' : i === (index === 0 ? 1 : 0) ? '포기한 가장 가치 있는 대안' : '다른 대안'} </small> )} {screen.mode === 'feedback' && i < 3 && <span aria-hidden="true"> →</span>} </div> ))} </figure> ) : null [별도 조건식 없음]

## H-3956b574e717

**@callback:['설계', '점검', '조작'].map** · [src/ui/concept-library.tsx:1209](../../../src/ui/concept-library.tsx#L1209)

분기 조건과 가능한 갈림길:

- B-62474982ec8d · ConditionalExpression · i === index → truthy / falsy; 바깥 조건: truthy: screen.mode === 'structure' (1210행).
- B-e8a036d07fb5 · ConditionalExpression · i === index → truthy / falsy; 바깥 조건: truthy: screen.mode === 'structure' (1219행).
- B-cb0e16f0942d · ConditionalExpression · i === 1 → truthy / falsy; 바깥 조건: truthy: screen.mode === 'structure' (1223행).
- B-895b20387a0f · ConditionalExpression · i === 1 → truthy / falsy; 바깥 조건: truthy: screen.mode === 'structure' (1230행).

## H-6d0e898f231f

**@callback:MONTHS.map** · [src/ui/concept-library.tsx:1316](../../../src/ui/concept-library.tsx#L1316)

분기 조건과 가능한 갈림길:

- B-583a127f62ed · ConditionalExpression · month <= count % 12 → truthy / falsy; 바깥 조건: truthy: screen.mode === 'pigeon' (1318행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1318행 | truthy: screen.mode === 'pigeon' | Math.floor(count / 12)<br>call |

## H-61c94c53f8cc

**@callback:nodes.map** · [src/ui/concept-library.tsx:1344](../../../src/ui/concept-library.tsx#L1344)

분기 조건과 가능한 갈림길:

- B-b78e171defbf · ConditionalExpression · i === index → truthy / falsy; 바깥 조건: truthy: nodes.length (1345행).
- B-5b8549e935f7 · ConditionalExpression · i === index → truthy / falsy; 바깥 조건: truthy: nodes.length ∧ truthy: screen.mode === 'opportunity' (1349행).
- B-36b9eaf549af · ConditionalExpression · i === (index === 0 ? 1 : 0) → truthy / falsy; 바깥 조건: truthy: nodes.length ∧ truthy: screen.mode === 'opportunity' ∧ falsy: i === index (1351행).
- B-fada9da519e6 · ConditionalExpression · index === 0 → truthy / falsy; 바깥 조건: truthy: nodes.length ∧ truthy: screen.mode === 'opportunity' ∧ falsy: i === index (1351행).

