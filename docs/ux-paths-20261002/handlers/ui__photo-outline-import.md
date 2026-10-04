# src/ui/photo-outline-import.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-d4d0847ccea0

**photoDraftKey** · [src/ui/photo-outline-import.tsx:44](../../../src/ui/photo-outline-import.tsx#L44)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 45행 | 별도 조건식 없음 | storagePrefix(data)<br>call |

## H-f101e8588948

**readDraft** · [src/ui/photo-outline-import.tsx:46](../../../src/ui/photo-outline-import.tsx#L46)

분기 조건과 가능한 갈림길:

- B-b17f1f373a15 · IfStatement · !raw → truthy / falsy; 바깥 조건: 별도 조건식 없음 (48행).
- B-c564d7ca37ab · IfStatement · !d || d.version !== 1 || !Array.isArray(d.photos) || d.photos.length > MAX_PHOTOS || !Array.isArray(d.rows) || !Array.isArray(d.excluded) || !d.choices || typeof d.choices !== 'object' || typeof d.subjectId !== 'string' || typeof d.title !== 'string' || d.title.length > 300 || (d.parentId !== null && typeof d.parentId !== 'string') || d.photos.some((p) => !p?.id || !p.file?.key || !/^[a-f0-9]{64}$/.test(p.file.sha256)) || new Set(d.photos.map((p) => p.id)).size !== d.photos.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (50행).
- B-dee94989755a · IfStatement · d.original → truthy / falsy; 바깥 조건: 별도 조건식 없음 (67행).
- B-a625069bd273 · IfStatement · typeof parent !== 'string' || seen.has(parent) || !byId.has(parent) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (82행).
- B-0558c8800f25 · IfStatement · d.pending && (d.pending.type !== 'importPhotoOutline' || d.pending.userId !== data.userId || d.pending.namespace !== data.namespace) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (89행).
- B-afbcc6abf114 · IfStatement · d.registered?.undo && (d.registered.undo.type !== 'undoRevision' || d.registered.undo.userId !== data.userId || d.registered.undo.namespace !== data.namespace) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (96행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 47행 | 별도 조건식 없음 | readRescuedDraft(photoDraftKey(data))<br>preservation-boundary |
| 47행 | 별도 조건식 없음 | photoDraftKey(data)<br>preservation-boundary → [H-d4d0847ccea0](ui__photo-outline-import.md#h-d4d0847ccea0) |
| 47행 | nullish: readRescuedDraft(photoDraftKey(data)) | localStorage.getItem(photoDraftKey(data))<br>preservation-boundary |
| 47행 | nullish: readRescuedDraft(photoDraftKey(data)) | photoDraftKey(data)<br>preservation-boundary → [H-d4d0847ccea0](ui__photo-outline-import.md#h-d4d0847ccea0) |
| 49행 | 별도 조건식 없음 | JSON.parse(raw)<br>call |
| 53행 | falsy: !d \|\|<br>    d.version !== 1 | Array.isArray(d.photos)<br>call |
| 55행 | falsy: !d \|\|<br>    d.version !== 1 \|\|<br>    !Array.isArray(d.photos) \|\|<br>    d.photos.length > MAX_PHOTOS | Array.isArray(d.rows)<br>call |
| 56행 | falsy: !d \|\|<br>    d.version !== 1 \|\|<br>    !Array.isArray(d.photos) \|\|<br>    d.photos.length > MAX_PHOTOS \|\|<br>    !Array.isArray(d.rows) | Array.isArray(d.excluded)<br>call |
| 63행 | falsy: !d \|\|<br>    d.version !== 1 \|\|<br>    !Array.isArray(d.photos) \|\|<br>    d.photos.length > MAX_PHOTOS \|\|<br>    !Array.isArray(d.rows) \|\|<br>    !Array.isArray(d.excluded) \|\|<br>    !d.choices \|\|<br>    typeof d.choices !== 'object' \|\|<br>    typeof d.subjectId !== 'string' \|\|<br>    typeof d.title !== 'string' \|\|<br>    d.title.length > 300 \|\|<br>    (d.parentId !== null && typeof d.parentId !== 'string') | d.photos.some((p) => !p?.id \|\| !p.file?.key \|\| !/^[a-f0-9]{64}$/.test(p.file.sha256))<br>call<br>전달 콜백: H-b9aab53b5c19 |
| 64행 | falsy: !d \|\|<br>    d.version !== 1 \|\|<br>    !Array.isArray(d.photos) \|\|<br>    d.photos.length > MAX_PHOTOS \|\|<br>    !Array.isArray(d.rows) \|\|<br>    !Array.isArray(d.excluded) \|\|<br>    !d.choices \|\|<br>    typeof d.choices !== 'object' \|\|<br>    typeof d.subjectId !== 'string' \|\|<br>    typeof d.title !== 'string' \|\|<br>    d.title.length > 300 \|\|<br>    (d.parentId !== null && typeof d.parentId !== 'string') \|\|<br>    d.photos.some((p) => !p?.id \|\| !p.file?.key \|\| !/^[a-f0-9]{64}$/.test(p.file.sha256)) | d.photos.map((p) => p.id)<br>call<br>전달 콜백: H-c157974a4dcc |
| 66행 | truthy: !d \|\|<br>    d.version !== 1 \|\|<br>    !Array.isArray(d.photos) \|\|<br>    d.photos.length > MAX_PHOTOS \|\|<br>    !Array.isArray(d.rows) \|\|<br>    !Array.isArray(d.excluded) \|\|<br>    !d.choices \|\|<br>    typeof d.choices !== 'object' \|\|<br>    typeof d.subjectId !== 'string' \|\|<br>    typeof d.title !== 'string' \|\|<br>    d.title.length > 300 \|\|<br>    (d.parentId !== null && typeof d.parentId !== 'string') \|\|<br>    d.photos.some((p) => !p?.id \|\| !p.file?.key \|\| !/^[a-f0-9]{64}$/.test(p.file.sha256)) \|\|<br>    new Set(d.photos.map((p) => p.id)).size !== d.photos.length | Error('사진 초안의 형식을 확인하지 못했습니다. 기존 내용을 덮어쓰지 않았습니다.')<br>call |
| 67행 | truthy: d.original | validatePhotoResult(d.original)<br>call |
| 69행 | 별도 조건식 없음 | validatePhotoRows(d.rows.map((r) => ({ ...r, name: typeof r.name === 'string' && !r.name.trim() ? '새 항목' : r.name, parentId: null, })), d.photos.map((p) => p.id))<br>call |
| 70행 | 별도 조건식 없음 | d.rows.map((r) => ({ ...r, name: typeof r.name === 'string' && !r.name.trim() ? '새 항목' : r.name, parentId: null, }))<br>call<br>전달 콜백: H-a3a03bac7edb |
| 75행 | 별도 조건식 없음 | d.photos.map((p) => p.id)<br>call<br>전달 콜백: H-459bd936eeab |
| 77행 | 별도 조건식 없음 | d.rows.map((r) => [r.id, r])<br>call<br>전달 콜백: H-a9cd3d4f84c2 |
| 82행 | falsy: typeof parent !== 'string' | seen.has(parent)<br>call |
| 82행 | falsy: typeof parent !== 'string' \|\| seen.has(parent) | byId.has(parent)<br>call |
| 83행 | truthy: typeof parent !== 'string' \|\| seen.has(parent) \|\| !byId.has(parent) | Error('사진 초안의 상위 항목을 확인하지 못했습니다. 기존 초안은 보관했습니다.')<br>call |
| 84행 | 별도 조건식 없음 | seen.add(parent)<br>call |
| 85행 | 별도 조건식 없음 | byId.get(parent)<br>call |
| 95행 | truthy: d.pending &&<br>    (d.pending.type !== 'importPhotoOutline' \|\|<br>      d.pending.userId !== data.userId \|\|<br>      d.pending.namespace !== data.namespace) | Error('다른 공간의 사진 등록 요청을 적용하지 않았습니다.')<br>call |
| 102행 | truthy: d.registered?.undo &&<br>    (d.registered.undo.type !== 'undoRevision' \|\|<br>      d.registered.undo.userId !== data.userId \|\|<br>      d.registered.undo.namespace !== data.namespace) | Error('다른 공간의 되돌리기 요청을 적용하지 않았습니다.')<br>call |

반환/조기 중단: 48행 null [truthy: !raw]; 103행 d [별도 조건식 없음]

throw: 66행 Error('사진 초안의 형식을 확인하지 못했습니다. 기존 내용을 덮어쓰지 않았습니다.'); 83행 Error('사진 초안의 상위 항목을 확인하지 못했습니다. 기존 초안은 보관했습니다.'); 95행 Error('다른 공간의 사진 등록 요청을 적용하지 않았습니다.'); 102행 Error('다른 공간의 되돌리기 요청을 적용하지 않았습니다.')

## H-b9aab53b5c19

**@callback:d.photos.some** · [src/ui/photo-outline-import.tsx:63](../../../src/ui/photo-outline-import.tsx#L63)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 63행 | falsy: !d \|\|<br>    d.version !== 1 \|\|<br>    !Array.isArray(d.photos) \|\|<br>    d.photos.length > MAX_PHOTOS \|\|<br>    !Array.isArray(d.rows) \|\|<br>    !Array.isArray(d.excluded) \|\|<br>    !d.choices \|\|<br>    typeof d.choices !== 'object' \|\|<br>    typeof d.subjectId !== 'string' \|\|<br>    typeof d.title !== 'string' \|\|<br>    d.title.length > 300 \|\|<br>    (d.parentId !== null && typeof d.parentId !== 'string') ∧ falsy: !p?.id \|\| !p.file?.key | /^[a-f0-9]{64}$/.test(p.file.sha256)<br>call |

## H-c157974a4dcc

**@callback:d.photos.map** · [src/ui/photo-outline-import.tsx:64](../../../src/ui/photo-outline-import.tsx#L64)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a3a03bac7edb

**@callback:d.rows.map** · [src/ui/photo-outline-import.tsx:70](../../../src/ui/photo-outline-import.tsx#L70)

분기 조건과 가능한 갈림길:

- B-61cf5fc38447 · ConditionalExpression · typeof r.name === 'string' && !r.name.trim() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (72행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 72행 | truthy: typeof r.name === 'string' | r.name.trim()<br>call |

## H-459bd936eeab

**@callback:d.photos.map** · [src/ui/photo-outline-import.tsx:75](../../../src/ui/photo-outline-import.tsx#L75)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a9cd3d4f84c2

**@callback:d.rows.map** · [src/ui/photo-outline-import.tsx:77](../../../src/ui/photo-outline-import.tsx#L77)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fa0ee4c08733

**PhotoOutlineImport** · [src/ui/photo-outline-import.tsx:105](../../../src/ui/photo-outline-import.tsx#L105)

분기 조건과 가능한 갈림길:

- B-5aa6ad01486c · IfStatement · included.length && draft.subjectId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (307행).
- B-606534581a88 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: included.length && draft.subjectId (308행).
- B-04560bfe273a · CatchClause · e → exception; 바깥 조건: truthy: included.length && draft.subjectId (310행).
- B-2a2ae95ed806 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: truthy: included.length && draft.subjectId ∧ exception: e (311행).
- B-851835e73c62 · IfStatement · !canUseOwnerAI(data) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (434행).
- B-5fd71963a31f · ConditionalExpression · draft.photos.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (439행).
- B-9e7d1399adc2 · ConditionalExpression · draft.requestStarted → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: open ∧ truthy: !draft.original (605행).
- B-937f66c112be · ConditionalExpression · draft.pending → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: !draft.registered (837행).
- B-e536036e8ce1 · ConditionalExpression · draft.registered.undone → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: draft.registered (855행).
- B-d6342644ee4e · ConditionalExpression · draft.registered.undone → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: draft.registered (860행).
- B-74aa50671d7f · ConditionalExpression · draft.registered.undone → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: draft.registered (866행).
- B-f61a60c571d9 · ConditionalExpression · draft.registered.undo → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: draft.registered ∧ falsy: draft.registered.undone (868행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 116행 | 별도 조건식 없음 | useState(() => { try { return { draft: readDraft(data), error: '' }; } catch (e) { return { draft: null, error: e instanceof Error ? e.message : '사진 초안을 읽지 못했습니다.', }; } })<br>call<br>전달 콜백: H-30c0a42a2f0d |
| 126행 | 별도 조건식 없음 | useState(boot.draft ?? { version: 1, photos: [], subjectId: initialSubjectId ?? data.subjects.find((s) => !s.deletedAt)?.id ?? '', parentId: null, title: '사진에서 가져온 목차·내용', original: null, rows: [], excluded: [], choices: {}, })<br>call |
| 130행 | nullish: boot.draft ∧ nullish: initialSubjectId | data.subjects.find((s) => !s.deletedAt)<br>call<br>전달 콜백: H-798efbb60bdd |
| 139행 | 별도 조건식 없음 | useState(false)<br>call |
| 140행 | 별도 조건식 없음 | useState(false)<br>call |
| 141행 | 별도 조건식 없음 | useState(boot.error)<br>call |
| 142행 | 별도 조건식 없음 | useState('')<br>call |
| 143행 | 별도 조건식 없음 | useState({})<br>call |
| 144행 | 별도 조건식 없음 | useState(!boot.error)<br>call |
| 145행 | 별도 조건식 없음 | useRef(draft)<br>call |
| 147행 | 별도 조건식 없음 | useRef(false)<br>call |
| 148행 | 별도 조건식 없음 | useRef(null)<br>call |
| 149행 | 별도 조건식 없음 | useRef(true)<br>call |
| 150행 | 별도 조건식 없음 | useRef(null)<br>call |
| 151행 | 별도 조건식 없음 | useRef(null)<br>call |
| 152행 | 별도 조건식 없음 | useEffect(() => { alive.current = true; return () => { alive.current = false; cancel.current?.abort(); }; }, [])<br>call<br>전달 콜백: H-e7798858be88 |
| 159행 | 별도 조건식 없음 | useEffect(() => { let stopped = false; const allocated: string[] = []; if (open) void Promise.all( draft.photos.map(async (p) => { try { const b = await readDocumentFile( { userId: data.userId, namespace: data.namespace }, p.file, ); if (!b \|\| stopped) return; const url = URL.createObjectURL(b); allocated.push(url); if (!stopped) setURLs((old) => ({ ...old, [p.id]: url })); } catch { /* Missing original is shown when generation is requested. */ } }), ); return () => { stopped = true; allocated.forEach(URL.revokeObjectURL); setURLs({}); }; }, [open, draft.photos, data.userId, data.namespace])<br>call<br>전달 콜백: H-f95ead38c659 |
| 304행 | 별도 조건식 없음 | draft.rows.filter((r) => !draft.excluded.includes(r.id))<br>preservation-boundary<br>전달 콜백: H-3d8bfdbd8d44 |
| 309행 | truthy: included.length && draft.subjectId | previewPhotoOutline(data, draft.subjectId, draft.parentId, included, draft.choices)<br>call |
| 434행 | 별도 조건식 없음 | canUseOwnerAI(data)<br>call |
| 506행 | truthy: open ∧ truthy: open | draft.photos.map((p, i) => ( <figure key={p.id}> {urls[p.id] && <img src={urls[p.id]} alt={`${i + 1}번째 원본 사진`} />} <figcaption> {i + 1}. {p.file.name} </figcaption> <div className="actions"> <Button disabled={locked \|\| !!draft.original \|\| i === 0} onClick={() => edit((d) => { [d.photos[i - 1], d.photos[i]] = [d.photos[i], d.photos[i - 1]]; }) } > 사진 앞으로 </Button> <Button disabled={locked \|\| !!draft.original \|\| i === draft.photos.length - 1} onClick={() => edit((d) => { [d.photos[i], d.photos[i + 1]] = [d.photos[i + 1], d.photos[i]]; }) } > 사진 뒤로 </Button> <Button disabled={locked \|\| !!draft.original} onClick={() => edit((d) => { d.photos = d.photos.filter((r) => r.id !== p.id); }) } > 사진 제외 </Button> </div>  … [전체 인수는 JSON·소스])<br>preservation-boundary<br>전달 콜백: H-db4a335c5a8d |
| 560행 | truthy: open ∧ truthy: open | data.subjects<br>                  .filter((s) => !s.deletedAt)<br>                  .map((s) => ( <option key={s.id} value={s.id}> {s.name} </option> ))<br>mutation-request<br>전달 콜백: H-e762336b0af7 |
| 560행 | truthy: open ∧ truthy: open | data.subjects<br>                  .filter((s) => !s.deletedAt)<br>call<br>전달 콜백: H-21882a08a68c |
| 579행 | truthy: open ∧ truthy: open | data.nodes<br>                  .filter((n) => n.subjectId === draft.subjectId && !n.deletedAt)<br>                  .map((n) => ( <option key={n.id} value={n.id}> {n.name} </option> ))<br>mutation-request<br>전달 콜백: H-f7fbdcfb47d3 |
| 579행 | truthy: open ∧ truthy: open | data.nodes<br>                  .filter((n) => n.subjectId === draft.subjectId && !n.deletedAt)<br>call<br>전달 콜백: H-fc10174bb89f |
| 613행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: draft.original.warnings.length > 0 | occurrenceRows(draft.original.warnings, (value) => value).map(({ value: w, key }) => ( <li key={key}>{w}</li> ))<br>preservation-boundary<br>전달 콜백: H-ce6839bcc829 |
| 613행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: draft.original.warnings.length > 0 | occurrenceRows(draft.original.warnings, (value) => value)<br>call<br>전달 콜백: H-21a0f88a2d3f |
| 632행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | data.subjects.some((s) => !s.deletedAt)<br>call<br>전달 콜백: H-d805afe3bf53 |
| 671행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ falsy: locked \|\|<br>                      draft.rows.length >= MAX_PHOTO_ROWS | draft.title.trim()<br>preservation-boundary |
| 672행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ falsy: locked \|\|<br>                      draft.rows.length >= MAX_PHOTO_ROWS \|\|<br>                      !draft.title.trim() | draft.rows.some((r) => r.name === draft.title.trim())<br>preservation-boundary<br>전달 콜백: H-47933da68035 |
| 693행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | draft.rows.map((r, i) => { const p = plan?.entries.find((p) => p.row.id === r.id); return ( <details key={r.id} className="photo-outline-row" open={i === 0}> <summary> {i + 1}. {r.name} {r.uncertain ? ' · 확인 필요' : ''} {!selected(r.id) ? ' · 제외' : ''} </summary> <Checkbox label={`${i + 1}번 항목 등록`} checked={selected(r.id)} disabled={locked} onChange={(e) => edit((d) => { const ids = descendants(r.id); if (!e.target.checked) d.excluded = [...new Set([...d.excluded, ...ids])]; else { const ancestors = new Set([r.id]); let parent = r.parentId; while (parent) { ancestors.add(parent); parent = d.rows.find((n) => n.id === parent)?.parentId ?? null; } d.excluded = d.excluded.filter((id) => !ancestors.has(id)); } }) … [전체 인수는 JSON·소스])<br>preservation-boundary<br>전달 콜백: H-8ebe57bbaa9a |
| 821행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | JSON.stringify(draft.original, null, 2)<br>call |
| 832행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: !draft.registered ∧ falsy: busy \|\|<br>                      !ready \|\|<br>                      !!boot.error | draft.title.trim()<br>preservation-boundary |

반환/조기 중단: 434행 null [truthy: !canUseOwnerAI(data)]; 436행 <render> [별도 조건식 없음]

## H-30c0a42a2f0d

**@callback:useState** · [src/ui/photo-outline-import.tsx:116](../../../src/ui/photo-outline-import.tsx#L116)

분기 조건과 가능한 갈림길:

- B-2363fe1afff3 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (117행).
- B-466d3dd7365f · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (119행).
- B-21d9b446322f · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (122행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 118행 | 별도 조건식 없음 | readDraft(data)<br>preservation-boundary → [H-f101e8588948](ui__photo-outline-import.md#h-f101e8588948) |

반환/조기 중단: 118행 { draft: readDraft(data), error: '' } [별도 조건식 없음]; 120행 { draft: null, error: e instanceof Error ? e.message : '사진 초안을 읽지 못했습니다.', } [exception: e]

## H-798efbb60bdd

**@callback:data.subjects.find** · [src/ui/photo-outline-import.tsx:130](../../../src/ui/photo-outline-import.tsx#L130)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e7798858be88

**@callback:useEffect** · [src/ui/photo-outline-import.tsx:152](../../../src/ui/photo-outline-import.tsx#L152)


반환/조기 중단: 154행 () => { alive.current = false; cancel.current?.abort(); } [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f95ead38c659

**@callback:useEffect** · [src/ui/photo-outline-import.tsx:159](../../../src/ui/photo-outline-import.tsx#L159)

분기 조건과 가능한 갈림길:

- B-4e44ede5bb51 · IfStatement · open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (162행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 163행 | truthy: open | Promise.all(draft.photos.map(async (p) => { try { const b = await readDocumentFile( { userId: data.userId, namespace: data.namespace }, p.file, ); if (!b \|\| stopped) return; const url = URL.createObjectURL(b); allocated.push(url); if (!stopped) setURLs((old) => ({ ...old, [p.id]: url })); } catch { /* Missing original is shown when generation is requested. */ } }))<br>call |
| 164행 | truthy: open | draft.photos.map(async (p) => { try { const b = await readDocumentFile( { userId: data.userId, namespace: data.namespace }, p.file, ); if (!b \|\| stopped) return; const url = URL.createObjectURL(b); allocated.push(url); if (!stopped) setURLs((old) => ({ ...old, [p.id]: url })); } catch { /* Missing original is shown when generation is requested. */ } })<br>preservation-boundary<br>전달 콜백: H-b442b7cee5fe |

반환/조기 중단: 179행 () => { stopped = true; allocated.forEach(URL.revokeObjectURL); setURLs({}); } [별도 조건식 없음]

## H-b442b7cee5fe

**@callback:draft.photos.map** · [src/ui/photo-outline-import.tsx:164](../../../src/ui/photo-outline-import.tsx#L164) · async

분기 조건과 가능한 갈림길:

- B-90c014462d3d · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: open (165행).
- B-aabd219c30a2 · IfStatement · !b || stopped → truthy / falsy; 바깥 조건: truthy: open (170행).
- B-cbaa7a9db7a9 · IfStatement · !stopped → truthy / falsy; 바깥 조건: truthy: open (173행).
- B-978cb276b68c · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: open (174행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 166행 | truthy: open | readDocumentFile({ userId: data.userId, namespace: data.namespace }, p.file)<br>call |
| 171행 | truthy: open | URL.createObjectURL(b)<br>call |
| 172행 | truthy: open | allocated.push(url)<br>call |
| 173행 | truthy: open ∧ truthy: !stopped | setURLs((old) => ({ ...old, [p.id]: url }))<br>state-update<br>전달 콜백: H-54274b4e8783 |

반환/조기 중단: 170행 <render> [truthy: open ∧ truthy: !b || stopped]

## H-54274b4e8783

**@callback:setURLs** · [src/ui/photo-outline-import.tsx:173](../../../src/ui/photo-outline-import.tsx#L173)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-651466be8d69

**persist** · [src/ui/photo-outline-import.tsx:185](../../../src/ui/photo-outline-import.tsx#L185)

분기 조건과 가능한 갈림길:

- B-c24628c6a7ec · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (188행).
- B-7f73d4838cf5 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (192행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 187행 | 별도 조건식 없음 | setDraft(next)<br>state-update |
| 189행 | 별도 조건식 없음 | storeDraftSafely(photoDraftKey(data), JSON.stringify(next))<br>preservation-boundary |
| 189행 | 별도 조건식 없음 | photoDraftKey(data)<br>preservation-boundary → [H-d4d0847ccea0](ui__photo-outline-import.md#h-d4d0847ccea0) |
| 189행 | 별도 조건식 없음 | JSON.stringify(next)<br>call |
| 190행 | 별도 조건식 없음 | setReady(true)<br>state-update |
| 193행 | exception: exception | setReady(false)<br>state-update |
| 194행 | exception: exception | setError('사진 초안을 이 기기에 저장하지 못했습니다. 입력은 이 창에 남아 있습니다. 초안 저장을 다시 시도해 주세요.')<br>state-update |

반환/조기 중단: 191행 true [별도 조건식 없음]; 197행 false [exception: exception]

## H-2da19ebdc90a

**edit** · [src/ui/photo-outline-import.tsx:200](../../../src/ui/photo-outline-import.tsx#L200)

분기 조건과 가능한 갈림길:

- B-545030e62dec · IfStatement · flight.current || draft.pending || draft.registered || boot.error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (201행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 202행 | 별도 조건식 없음 | structuredClone(current.current)<br>call |
| 203행 | 별도 조건식 없음 | action(next)<br>call |
| 205행 | 별도 조건식 없음 | setError('')<br>state-update |
| 206행 | 별도 조건식 없음 | setMessage('')<br>state-update |
| 207행 | 별도 조건식 없음 | persist(next)<br>call → [H-651466be8d69](ui__photo-outline-import.md#h-651466be8d69) |

반환/조기 중단: 201행 <render> [truthy: flight.current || draft.pending || draft.registered || boot.error]

## H-cdeb5111400c

**bring** · [src/ui/photo-outline-import.tsx:209](../../../src/ui/photo-outline-import.tsx#L209) · async

분기 조건과 가능한 갈림길:

- B-9ce449ecb91a · IfStatement · flight.current || draft.pending || draft.registered || boot.error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (210행).
- B-1f5638d18585 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (214행).
- B-ad71c106da06 · IfStatement · !/\.(png|jpe?g|webp|heic|heif)$/i.test(file.name) && !file.type.startsWith('image/') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (216행).
- B-25e7b0914eb4 · IfStatement · !alive.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (219행).
- B-908afcaf7c99 · IfStatement · next.photos.some((p) => p.file.sha256 === ref.sha256) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (221행).
- B-86679b5ae578 · IfStatement · next.photos.length >= MAX_PHOTOS → truthy / falsy; 바깥 조건: 별도 조건식 없음 (225행).
- B-3d0f4d77fae1 · IfStatement · next.original → truthy / falsy; 바깥 조건: 별도 조건식 없음 (229행).
- B-d08613058d13 · IfStatement · !persist(next) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (232행).
- B-88cad43df699 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (234행).
- B-ed3019b29510 · IfStatement · alive.current → truthy / falsy; 바깥 조건: exception: e (235행).
- B-22325b66e8cd · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e ∧ truthy: alive.current (235행).
- B-7718665ce4c9 · IfStatement · alive.current → truthy / falsy; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (238행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 212행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 213행 | 별도 조건식 없음 | setError('')<br>state-update |
| 216행 | 별도 조건식 없음 | /\.(png\|jpe?g\|webp\|heic\|heif)$/i.test(file.name)<br>call |
| 216행 | truthy: !/\.(png\|jpe?g\|webp\|heic\|heif)$/i.test(file.name) | file.type.startsWith('image/')<br>call |
| 217행 | truthy: !/\.(png\|jpe?g\|webp\|heic\|heif)$/i.test(file.name) && !file.type.startsWith('image/') | Error('사진 파일을 선택해 주세요.')<br>call |
| 218행 | 별도 조건식 없음 | keepDocumentFile(data, file)<br>call |
| 220행 | 별도 조건식 없음 | structuredClone(current.current)<br>call |
| 221행 | 별도 조건식 없음 | next.photos.some((p) => p.file.sha256 === ref.sha256)<br>call<br>전달 콜백: H-113c432e3ca3 |
| 222행 | truthy: next.photos.some((p) => p.file.sha256 === ref.sha256) | setMessage('같은 사진이 이미 있습니다. 기존 초안을 유지했습니다.')<br>state-update |
| 226행 | truthy: next.photos.length >= MAX_PHOTOS | Error('사진은 한 번에4장까지 보관합니다. 현재 사진을 등록한 뒤 다음 묶음을 이어 넣어 주세요.')<br>call |
| 230행 | truthy: next.original | Error('현재 초안의 사진은 보존했습니다. 새 사진은 새 사진 묶음으로 시작해 주세요.')<br>call |
| 231행 | 별도 조건식 없음 | next.photos.push({ id: crypto.randomUUID(), file: ref })<br>call |
| 231행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 232행 | 별도 조건식 없음 | persist(next)<br>call → [H-651466be8d69](ui__photo-outline-import.md#h-651466be8d69) |
| 235행 | exception: e ∧ truthy: alive.current | setError(e instanceof Error ? e.message : '사진을 가져오지 못했습니다.')<br>state-update |
| 238행 | always-after-try: try 완료 또는 예외 이후 ∧ truthy: alive.current | setBusy(false)<br>state-update |

반환/조기 중단: 210행 <render> [truthy: flight.current || draft.pending || draft.registered || boot.error]; 219행 <render> [truthy: !alive.current]

throw: 217행 Error('사진 파일을 선택해 주세요.'); 226행 Error( '사진은 한 번에4장까지 보관합니다. 현재 사진을 등록한 뒤 다음 묶음을 이어 넣어 주세요.', ); 230행 Error('현재 초안의 사진은 보존했습니다. 새 사진은 새 사진 묶음으로 시작해 주세요.')

## H-113c432e3ca3

**@callback:next.photos.some** · [src/ui/photo-outline-import.tsx:221](../../../src/ui/photo-outline-import.tsx#L221)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-746dd9a352de

**generate** · [src/ui/photo-outline-import.tsx:241](../../../src/ui/photo-outline-import.tsx#L241) · async

분기 조건과 가능한 갈림길:

- B-5baee46acaf1 · IfStatement · flight.current || !ready || boot.error || draft.pending || draft.registered || !draft.photos.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (242행).
- B-9a4e092e7a02 · IfStatement · draft.original → truthy / falsy; 바깥 조건: 별도 조건식 없음 (251행).
- B-d2a555fcb2b9 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (261행).
- B-f14218859b18 · IfStatement · !persist({ ...current.current, requestStarted: true }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (265행).
- B-2a9d68888721 · IfStatement · !alive.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (272행).
- B-c0477b7ecd31 · ConditionalExpression · result.rows.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (283행).
- B-e9625ab7955b · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (287행).
- B-641c6cbea01f · IfStatement · alive.current → truthy / falsy; 바깥 조건: exception: e (288행).
- B-850a3673dd0d · ConditionalExpression · controller.signal.aborted → truthy / falsy; 바깥 조건: exception: e ∧ truthy: alive.current (290행).
- B-b0f060dbc53d · ConditionalExpression · e instanceof Error && /[가-힣]/.test(e.message) → truthy / falsy; 바깥 조건: exception: e ∧ truthy: alive.current ∧ falsy: controller.signal.aborted (292행).
- B-d460b35c12bc · IfStatement · alive.current → truthy / falsy; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (301행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 252행 | truthy: draft.original | setMessage('보관한 결과를 사용합니다. 수정과 등록은 GPT를 다시 호출하지 않습니다.')<br>state-update |
| 256행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 257행 | 별도 조건식 없음 | setError('')<br>state-update |
| 258행 | 별도 조건식 없음 | setMessage('사진을 준비하고 있습니다.')<br>state-update |
| 264행 | 별도 조건식 없음 | photos.push(await preparePhoto(data, p, controller.signal))<br>call |
| 264행 | 별도 조건식 없음 | preparePhoto(data, p, controller.signal)<br>call |
| 265행 | 별도 조건식 없음 | persist({ ...current.current, requestStarted: true })<br>call → [H-651466be8d69](ui__photo-outline-import.md#h-651466be8d69) |
| 266행 | 별도 조건식 없음 | setMessage('선택한 사진을 GPT에 보내 목차와 내용을 읽고 있습니다.')<br>state-update |
| 267행 | 별도 조건식 없음 | generatePhotoOutline(data, photos, AbortSignal.any([controller.signal, AbortSignal.timeout(180_000)]))<br>call |
| 270행 | 별도 조건식 없음 | AbortSignal.any([controller.signal, AbortSignal.timeout(180_000)])<br>call |
| 270행 | 별도 조건식 없음 | AbortSignal.timeout(180_000)<br>call |
| 273행 | 별도 조건식 없음 | persist({ ...current.current, original: result, rows: structuredClone(result.rows), title: result.title, requestStarted: false, excluded: [], choices: {}, })<br>call → [H-651466be8d69](ui__photo-outline-import.md#h-651466be8d69) |
| 276행 | 별도 조건식 없음 | structuredClone(result.rows)<br>call |
| 282행 | 별도 조건식 없음 | setMessage(result.rows.length ? '목차 초안을 만들었습니다. 이름·위계·내용을 확인한 뒤 등록해 주세요.' : '사진에서 항목을 읽지 못했습니다. 안내를 확인한 뒤 새 사진 묶음으로 시작해 주세요.')<br>state-update |
| 289행 | exception: e ∧ truthy: alive.current | setError(controller.signal.aborted ? '분석을 중단했습니다. 이미 보낸 요청은 비용이 들 수 있습니다. 원본과 기존 초안은 보관했습니다.' : e instanceof Error && /[가-힣]/.test(e.message) ? e.message : '사진 분석 응답을 받지 못했습니다. 원본은 보관했습니다. 다시 생성은 직접 선택해 주세요.')<br>state-update |
| 292행 | exception: e ∧ truthy: alive.current ∧ falsy: controller.signal.aborted ∧ truthy: e instanceof Error | /[가-힣]/.test(e.message)<br>call |
| 296행 | exception: e ∧ truthy: alive.current | setMessage('')<br>state-update |
| 301행 | always-after-try: try 완료 또는 예외 이후 ∧ truthy: alive.current | setBusy(false)<br>state-update |

반환/조기 중단: 250행 <render> [truthy: flight.current ||
      !ready ||
      boot.error ||
      draft.pending ||
      draft.registered ||
      !draft.photos.length]; 253행 <render> [truthy: draft.original]; 265행 <render> [truthy: !persist({ ...current.current, requestStarted: true })]; 272행 <render> [truthy: !alive.current]

## H-3d8bfdbd8d44

**@callback:draft.rows.filter** · [src/ui/photo-outline-import.tsx:304](../../../src/ui/photo-outline-import.tsx#L304)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 304행 | 별도 조건식 없음 | draft.excluded.includes(r.id)<br>preservation-boundary |

## H-0beea2d264a8

**descendants** · [src/ui/photo-outline-import.tsx:313](../../../src/ui/photo-outline-import.tsx#L313)

분기 조건과 가능한 갈림길:

- B-d677a189fbce · IfStatement · r.parentId && found.has(r.parentId) && !found.has(r.id) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (319행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 319행 | truthy: r.parentId | found.has(r.parentId)<br>call |
| 319행 | truthy: r.parentId && found.has(r.parentId) | found.has(r.id)<br>call |
| 320행 | truthy: r.parentId && found.has(r.parentId) && !found.has(r.id) | found.add(r.id)<br>call |

반환/조기 중단: 324행 found [별도 조건식 없음]

## H-e3313ef5258f

**selected** · [src/ui/photo-outline-import.tsx:326](../../../src/ui/photo-outline-import.tsx#L326)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 326행 | 별도 조건식 없음 | draft.excluded.includes(id)<br>preservation-boundary |

## H-e8236493b92c

**register** · [src/ui/photo-outline-import.tsx:327](../../../src/ui/photo-outline-import.tsx#L327) · async

분기 조건과 가능한 갈림길:

- B-35306c74ae56 · IfStatement · flight.current || !ready || boot.error || draft.registered || !draft.original || (!draft.pending && !plan?.ready) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (328행).
- B-27d7489334bf · IfStatement · !persist({ ...current.current, pending: command }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (357행).
- B-7e857edc6fd3 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (362행).
- B-ded2efd110e2 · IfStatement · status && status.phase !== 'saved' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (367행).
- B-83f53f7a7c8f · IfStatement · !alive.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (369행).
- B-7f174d99ef04 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (385행).
- B-154af3147da5 · IfStatement · alive.current → truthy / falsy; 바깥 조건: exception: e (386행).
- B-c3627c6f80f4 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e ∧ truthy: alive.current (388행).
- B-1e44f8244e27 · IfStatement · alive.current → truthy / falsy; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (394행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 341행 | nullish: draft.pending | crypto.randomUUID()<br>call |
| 342행 | nullish: draft.pending | new Date().toISOString()<br>call |
| 345행 | nullish: draft.pending | structuredClone(included)<br>call |
| 346행 | nullish: draft.pending | structuredClone(draft.choices)<br>call |
| 347행 | nullish: draft.pending | Object.fromEntries(plan!.entries.filter((p) => p.status === 'new').map((p) => [p.row.id, crypto.randomUUID()]))<br>call |
| 348행 | nullish: draft.pending | plan!.entries.filter((p) => p.status === 'new').map((p) => [p.row.id, crypto.randomUUID()])<br>call<br>전달 콜백: H-1a1411a8bf0a |
| 348행 | nullish: draft.pending | plan!.entries.filter((p) => p.status === 'new')<br>call<br>전달 콜백: H-2f8007f23fe0 |
| 350행 | nullish: draft.pending | Object.fromEntries(included.filter((r) => r.content.trim()).map((r) => [r.id, crypto.randomUUID()]))<br>call |
| 351행 | nullish: draft.pending | included.filter((r) => r.content.trim()).map((r) => [r.id, crypto.randomUUID()])<br>call<br>전달 콜백: H-16bae9f1ae36 |
| 351행 | nullish: draft.pending | included.filter((r) => r.content.trim())<br>call<br>전달 콜백: H-7899ba8886c9 |
| 354행 | nullish: draft.pending | crypto.randomUUID()<br>call |
| 355행 | nullish: draft.pending | photoMaterial(draft.subjectId, draft.title, draft.photos, draft.original, included)<br>call |
| 357행 | 별도 조건식 없음 | persist({ ...current.current, pending: command })<br>call → [H-651466be8d69](ui__photo-outline-import.md#h-651466be8d69) |
| 359행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 360행 | 별도 조건식 없음 | setError('')<br>state-update |
| 361행 | 별도 조건식 없음 | setMessage('목차와 내용을 서버에 저장하고 있습니다.')<br>state-update |
| 363행 | 별도 조건식 없음 | repository.execute(command)<br>call |
| 364행 | 별도 조건식 없음 | onSaved(next)<br>call |
| 368행 | truthy: status && status.phase !== 'saved' | Error(status.message \|\| '서버 저장을 확인하지 못했습니다. 등록 요청은 보관했습니다.')<br>call |
| 370행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 371행 | 별도 조건식 없음 | onSaved(saved)<br>call |
| 372행 | 별도 조건식 없음 | saved.revisions.find((r) => r.operationId === command.opId)<br>call<br>전달 콜백: H-f3378a38300f |
| 373행 | 별도 조건식 없음 | persist({ ...current.current, pending: undefined, registered: { materialId: command.materialId, revisionId: revision!.id, expectedVersion: revision!.after.version, }, })<br>call → [H-651466be8d69](ui__photo-outline-import.md#h-651466be8d69) |
| 382행 | 별도 조건식 없음 | setMessage('목차와 하위 내용, 원본 사진 자료를 저장했습니다. 같은 묶음은 다시 등록하지 않습니다.')<br>state-update |
| 387행 | exception: e ∧ truthy: alive.current | setError(e instanceof Error ? e.message : '등록을 확인하지 못했습니다. 사진과 등록 요청은 보관했습니다. GPT 호출 없이 등록을 다시 시도해 주세요.')<br>state-update |
| 394행 | always-after-try: try 완료 또는 예외 이후 ∧ truthy: alive.current | setBusy(false)<br>state-update |

반환/조기 중단: 336행 <render> [truthy: flight.current ||
      !ready ||
      boot.error ||
      draft.registered ||
      !draft.original ||
      (!draft.pending && !plan?.ready)]; 357행 <render> [truthy: !persist({ ...current.current, pending: command })]; 369행 <render> [truthy: !alive.current]

throw: 368행 Error(status.message || '서버 저장을 확인하지 못했습니다. 등록 요청은 보관했습니다.')

## H-2f8007f23fe0

**@callback:plan!.entries.filter** · [src/ui/photo-outline-import.tsx:348](../../../src/ui/photo-outline-import.tsx#L348)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1a1411a8bf0a

**@callback:plan!.entries.filter((p) => p.status === 'new').map** · [src/ui/photo-outline-import.tsx:348](../../../src/ui/photo-outline-import.tsx#L348)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 348행 | nullish: draft.pending | crypto.randomUUID()<br>call |

## H-7899ba8886c9

**@callback:included.filter** · [src/ui/photo-outline-import.tsx:351](../../../src/ui/photo-outline-import.tsx#L351)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 351행 | nullish: draft.pending | r.content.trim()<br>call |

## H-16bae9f1ae36

**@callback:included.filter((r) => r.content.trim()).map** · [src/ui/photo-outline-import.tsx:351](../../../src/ui/photo-outline-import.tsx#L351)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 351행 | nullish: draft.pending | crypto.randomUUID()<br>call |

## H-f3378a38300f

**@callback:saved.revisions.find** · [src/ui/photo-outline-import.tsx:372](../../../src/ui/photo-outline-import.tsx#L372)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-67763a37f4db

**undo** · [src/ui/photo-outline-import.tsx:397](../../../src/ui/photo-outline-import.tsx#L397) · async

분기 조건과 가능한 갈림길:

- B-065fdf877da2 · IfStatement · flight.current || !registered || registered.undone → truthy / falsy; 바깥 조건: 별도 조건식 없음 (399행).
- B-b4befc0aa795 · IfStatement · !persist({ ...current.current, registered: { ...registered, undo: command } }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (409행).
- B-fcea5be74acc · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (413행).
- B-3e07aa370e22 · IfStatement · status && status.phase !== 'saved' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (417행).
- B-116bb0404ef2 · IfStatement · !alive.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (422행).
- B-c1d88a87eb17 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (426행).
- B-2f22213ab8e0 · IfStatement · alive.current → truthy / falsy; 바깥 조건: exception: e (427행).
- B-d739a42c51d9 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e ∧ truthy: alive.current (428행).
- B-23cf7f31b1c0 · IfStatement · alive.current → truthy / falsy; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (431행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 404행 | nullish: registered.undo | crypto.randomUUID()<br>call |
| 405행 | nullish: registered.undo | new Date().toISOString()<br>call |
| 409행 | 별도 조건식 없음 | persist({ ...current.current, registered: { ...registered, undo: command } })<br>call → [H-651466be8d69](ui__photo-outline-import.md#h-651466be8d69) |
| 411행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 412행 | 별도 조건식 없음 | setError('')<br>state-update |
| 414행 | 별도 조건식 없음 | onSaved(repository.execute(command))<br>call |
| 414행 | 별도 조건식 없음 | repository.execute(command)<br>call |
| 418행 | truthy: status && status.phase !== 'saved' | Error(status.message \|\| '되돌리기의 서버 저장을 확인하지 못했습니다. 요청과 원본은 보관했습니다.')<br>call |
| 423행 | 별도 조건식 없음 | onSaved(repository.getSnapshot())<br>call |
| 423행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 424행 | 별도 조건식 없음 | persist({ ...current.current, registered: { ...registered, undo: command, undone: true } })<br>call → [H-651466be8d69](ui__photo-outline-import.md#h-651466be8d69) |
| 425행 | 별도 조건식 없음 | setMessage('등록한 목차와 내용을 되돌렸습니다. 사진 자료와 원문은 이력에 보존합니다.')<br>state-update |
| 428행 | exception: e ∧ truthy: alive.current | setError(e instanceof Error ? e.message : '뒤에 수정한 내용이 있어 되돌리지 못했습니다.')<br>state-update |
| 431행 | always-after-try: try 완료 또는 예외 이후 ∧ truthy: alive.current | setBusy(false)<br>state-update |

반환/조기 중단: 399행 <render> [truthy: flight.current || !registered || registered.undone]; 409행 <render> [truthy: !persist({ ...current.current, registered: { ...registered, undo: command } })]; 422행 <render> [truthy: !alive.current]

throw: 418행 Error( status.message || '되돌리기의 서버 저장을 확인하지 못했습니다. 요청과 원본은 보관했습니다.', )

## H-e65df9bbda1d

**@onClick** · [src/ui/photo-outline-import.tsx:438](../../../src/ui/photo-outline-import.tsx#L438)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 438행 | 별도 조건식 없음 | setOpen(true)<br>state-update |

## H-b352215fcdb5

**@onClose** · [src/ui/photo-outline-import.tsx:445](../../../src/ui/photo-outline-import.tsx#L445)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 447행 | truthy: open ∧ truthy: open | setOpen(false)<br>state-update |

## H-3f11de7d000e

**@onClick** · [src/ui/photo-outline-import.tsx:457](../../../src/ui/photo-outline-import.tsx#L457)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d8697690c366

**@onClick** · [src/ui/photo-outline-import.tsx:462](../../../src/ui/photo-outline-import.tsx#L462)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d7c1aac0e2d4

**@onClick** · [src/ui/photo-outline-import.tsx:467](../../../src/ui/photo-outline-import.tsx#L467)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-83bbebc4d2f6

**@onClick** · [src/ui/photo-outline-import.tsx:471](../../../src/ui/photo-outline-import.tsx#L471)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 472행 | truthy: open ∧ truthy: open ∧ truthy: !ready | setError('')<br>state-update |
| 473행 | truthy: open ∧ truthy: open ∧ truthy: !ready | persist(current.current)<br>call → [H-651466be8d69](ui__photo-outline-import.md#h-651466be8d69) |

## H-609293c61e23

**@onChange** · [src/ui/photo-outline-import.tsx:486](../../../src/ui/photo-outline-import.tsx#L486)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 487행 | truthy: open ∧ truthy: open | Array.from(e.target.files ?? [])<br>call |
| 489행 | truthy: open ∧ truthy: open | bring(files)<br>call → [H-cdeb5111400c](ui__photo-outline-import.md#h-cdeb5111400c) |

## H-fc746a9e7049

**@onChange** · [src/ui/photo-outline-import.tsx:499](../../../src/ui/photo-outline-import.tsx#L499)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 500행 | truthy: open ∧ truthy: open | Array.from(e.target.files ?? [])<br>call |
| 502행 | truthy: open ∧ truthy: open | bring(files)<br>call → [H-cdeb5111400c](ui__photo-outline-import.md#h-cdeb5111400c) |

## H-db4a335c5a8d

**@callback:draft.photos.map** · [src/ui/photo-outline-import.tsx:506](../../../src/ui/photo-outline-import.tsx#L506)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e3493a67582c

**@onClick** · [src/ui/photo-outline-import.tsx:515](../../../src/ui/photo-outline-import.tsx#L515)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 516행 | truthy: open ∧ truthy: open | edit((d) => { [d.photos[i - 1], d.photos[i]] = [d.photos[i], d.photos[i - 1]]; })<br>call → [H-2da19ebdc90a](ui__photo-outline-import.md#h-2da19ebdc90a)<br>전달 콜백: H-5b885601bb6e |

## H-5b885601bb6e

**@callback:edit** · [src/ui/photo-outline-import.tsx:516](../../../src/ui/photo-outline-import.tsx#L516)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bfce04cef8ff

**@onClick** · [src/ui/photo-outline-import.tsx:525](../../../src/ui/photo-outline-import.tsx#L525)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 526행 | truthy: open ∧ truthy: open | edit((d) => { [d.photos[i], d.photos[i + 1]] = [d.photos[i + 1], d.photos[i]]; })<br>call → [H-2da19ebdc90a](ui__photo-outline-import.md#h-2da19ebdc90a)<br>전달 콜백: H-be8bf43564fb |

## H-be8bf43564fb

**@callback:edit** · [src/ui/photo-outline-import.tsx:526](../../../src/ui/photo-outline-import.tsx#L526)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f376be5f4633

**@onClick** · [src/ui/photo-outline-import.tsx:535](../../../src/ui/photo-outline-import.tsx#L535)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 536행 | truthy: open ∧ truthy: open | edit((d) => { d.photos = d.photos.filter((r) => r.id !== p.id); })<br>call → [H-2da19ebdc90a](ui__photo-outline-import.md#h-2da19ebdc90a)<br>전달 콜백: H-73e3901d9bf6 |

## H-73e3901d9bf6

**@callback:edit** · [src/ui/photo-outline-import.tsx:536](../../../src/ui/photo-outline-import.tsx#L536)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 537행 | truthy: open ∧ truthy: open | d.photos.filter((r) => r.id !== p.id)<br>call<br>전달 콜백: H-18051cfc28e8 |

## H-18051cfc28e8

**@callback:d.photos.filter** · [src/ui/photo-outline-import.tsx:537](../../../src/ui/photo-outline-import.tsx#L537)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3599991d246c

**@onChange** · [src/ui/photo-outline-import.tsx:552](../../../src/ui/photo-outline-import.tsx#L552)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 553행 | truthy: open ∧ truthy: open | edit((d) => { d.subjectId = e.target.value; d.parentId = null; })<br>call → [H-2da19ebdc90a](ui__photo-outline-import.md#h-2da19ebdc90a)<br>전달 콜백: H-15b65784e4e0 |

## H-15b65784e4e0

**@callback:edit** · [src/ui/photo-outline-import.tsx:553](../../../src/ui/photo-outline-import.tsx#L553)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-21882a08a68c

**@callback:data.subjects
                  .filter** · [src/ui/photo-outline-import.tsx:561](../../../src/ui/photo-outline-import.tsx#L561)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e762336b0af7

**@callback:data.subjects
                  .filter((s) => !s.deletedAt)
                  .map** · [src/ui/photo-outline-import.tsx:562](../../../src/ui/photo-outline-import.tsx#L562)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-eeb29d840705

**@onChange** · [src/ui/photo-outline-import.tsx:572](../../../src/ui/photo-outline-import.tsx#L572)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 573행 | truthy: open ∧ truthy: open | edit((d) => { d.parentId = e.target.value \|\| null; })<br>call → [H-2da19ebdc90a](ui__photo-outline-import.md#h-2da19ebdc90a)<br>전달 콜백: H-b57677bbabd2 |

## H-b57677bbabd2

**@callback:edit** · [src/ui/photo-outline-import.tsx:573](../../../src/ui/photo-outline-import.tsx#L573)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fc10174bb89f

**@callback:data.nodes
                  .filter** · [src/ui/photo-outline-import.tsx:580](../../../src/ui/photo-outline-import.tsx#L580)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f7fbdcfb47d3

**@callback:data.nodes
                  .filter((n) => n.subjectId === draft.subjectId && !n.deletedAt)
                  .map** · [src/ui/photo-outline-import.tsx:581](../../../src/ui/photo-outline-import.tsx#L581)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7e8a898c86de

**@onClick** · [src/ui/photo-outline-import.tsx:603](../../../src/ui/photo-outline-import.tsx#L603)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 603행 | truthy: open ∧ truthy: open ∧ truthy: !draft.original | generate()<br>call → [H-746dd9a352de](ui__photo-outline-import.md#h-746dd9a352de) |

## H-21a0f88a2d3f

**@callback:occurrenceRows** · [src/ui/photo-outline-import.tsx:613](../../../src/ui/photo-outline-import.tsx#L613)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ce6839bcc829

**@callback:occurrenceRows(draft.original.warnings, (value) => value).map** · [src/ui/photo-outline-import.tsx:614](../../../src/ui/photo-outline-import.tsx#L614)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f85f135da808

**@onChange** · [src/ui/photo-outline-import.tsx:625](../../../src/ui/photo-outline-import.tsx#L625)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 626행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | edit((d) => { d.title = e.target.value; })<br>call → [H-2da19ebdc90a](ui__photo-outline-import.md#h-2da19ebdc90a)<br>전달 콜백: H-34a159c67dcc |

## H-34a159c67dcc

**@callback:edit** · [src/ui/photo-outline-import.tsx:626](../../../src/ui/photo-outline-import.tsx#L626)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d805afe3bf53

**@callback:data.subjects.some** · [src/ui/photo-outline-import.tsx:632](../../../src/ui/photo-outline-import.tsx#L632)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d0b3df2244ed

**@onClick** · [src/ui/photo-outline-import.tsx:651](../../../src/ui/photo-outline-import.tsx#L651)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 652행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | edit((d) => { d.rows.push({ id: crypto.randomUUID(), parentId: null, name: '새 항목', content: '', page: '', photoIds: d.photos.map((p) => p.id), uncertain: true, }); })<br>call → [H-2da19ebdc90a](ui__photo-outline-import.md#h-2da19ebdc90a)<br>전달 콜백: H-f48010761e23 |

## H-f48010761e23

**@callback:edit** · [src/ui/photo-outline-import.tsx:652](../../../src/ui/photo-outline-import.tsx#L652)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 653행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | d.rows.push({ id: crypto.randomUUID(), parentId: null, name: '새 항목', content: '', page: '', photoIds: d.photos.map((p) => p.id), uncertain: true, })<br>call |
| 654행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | crypto.randomUUID()<br>call |
| 659행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | d.photos.map((p) => p.id)<br>call<br>전달 콜백: H-06f6bc94ca29 |

## H-06f6bc94ca29

**@callback:d.photos.map** · [src/ui/photo-outline-import.tsx:659](../../../src/ui/photo-outline-import.tsx#L659)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-47933da68035

**@callback:draft.rows.some** · [src/ui/photo-outline-import.tsx:672](../../../src/ui/photo-outline-import.tsx#L672)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 672행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ falsy: locked \|\|<br>                      draft.rows.length >= MAX_PHOTO_ROWS \|\|<br>                      !draft.title.trim() | draft.title.trim()<br>preservation-boundary |

## H-5b8bbc3433cb

**@onClick** · [src/ui/photo-outline-import.tsx:674](../../../src/ui/photo-outline-import.tsx#L674)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 675행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | edit((d) => { const id = crypto.randomUUID(); for (const r of d.rows) if (r.parentId === null) r.parentId = id; d.rows.unshift({ id, parentId: null, name: d.title.trim().slice(0, 180), content: '', page: '', photoIds: d.photos.map((p) => p.id), uncertain: true, }); })<br>call → [H-2da19ebdc90a](ui__photo-outline-import.md#h-2da19ebdc90a)<br>전달 콜백: H-4456f69b7c23 |

## H-4456f69b7c23

**@callback:edit** · [src/ui/photo-outline-import.tsx:675](../../../src/ui/photo-outline-import.tsx#L675)

분기 조건과 가능한 갈림길:

- B-55eca04ff8cb · IfStatement · r.parentId === null → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original (677행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 676행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | crypto.randomUUID()<br>call |
| 678행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | d.rows.unshift({ id, parentId: null, name: d.title.trim().slice(0, 180), content: '', page: '', photoIds: d.photos.map((p) => p.id), uncertain: true, })<br>call |
| 681행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | d.title.trim().slice(0, 180)<br>call |
| 681행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | d.title.trim()<br>call |
| 684행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | d.photos.map((p) => p.id)<br>call<br>전달 콜백: H-ad3d3b0b9ce1 |

## H-ad3d3b0b9ce1

**@callback:d.photos.map** · [src/ui/photo-outline-import.tsx:684](../../../src/ui/photo-outline-import.tsx#L684)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8ebe57bbaa9a

**@callback:draft.rows.map** · [src/ui/photo-outline-import.tsx:693](../../../src/ui/photo-outline-import.tsx#L693)

분기 조건과 가능한 갈림길:

- B-a399c662b097 · ConditionalExpression · r.uncertain → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original (699행).
- B-a69bff530388 · ConditionalExpression · !selected(r.id) → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original (700행).
- B-bbad5463dfef · ConditionalExpression · r.page → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original (769행).
- B-7cdf81da7aca · ConditionalExpression · !draft.registered && p?.candidates.length → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original (793행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 700행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | selected(r.id)<br>call → [H-e3313ef5258f](ui__photo-outline-import.md#h-e3313ef5258f) |
| 704행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | selected(r.id)<br>call → [H-e3313ef5258f](ui__photo-outline-import.md#h-e3313ef5258f) |
| 745행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | draft.rows<br>                          .filter((n) => !descendants(r.id).has(n.id))<br>                          .map((n) => ( <option key={n.id} value={n.id}> {n.name} </option> ))<br>preservation-boundary<br>전달 콜백: H-74937fd76f49 |
| 745행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | draft.rows<br>                          .filter((n) => !descendants(r.id).has(n.id))<br>preservation-boundary<br>전달 콜백: H-26da56c898d3 |
| 766행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | r.photoIds<br>                          .map((id) => draft.photos.findIndex((p) => p.id === id) + 1)<br>                          .join(', ')<br>preservation-boundary |
| 766행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | r.photoIds<br>                          .map((id) => draft.photos.findIndex((p) => p.id === id) + 1)<br>call<br>전달 콜백: H-04a902264eea |
| 808행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: !draft.registered && p?.candidates.length | p.candidates.map((c) => ( <option key={c.id} value={c.id}> 기존 {c.name}에 연결 </option> ))<br>call<br>전달 콜백: H-6c7aa0e72ec1 |

반환/조기 중단: 695행 <render> [truthy: open ∧ truthy: open ∧ truthy: draft.original]

## H-7ddda90c351b

**@onChange** · [src/ui/photo-outline-import.tsx:706](../../../src/ui/photo-outline-import.tsx#L706)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 707행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | edit((d) => { const ids = descendants(r.id); if (!e.target.checked) d.excluded = [...new Set([...d.excluded, ...ids])]; else { const ancestors = new Set([r.id]); let parent = r.parentId; while (parent) { ancestors.add(parent); parent = d.rows.find((n) => n.id === parent)?.parentId ?? null; } d.excluded = d.excluded.filter((id) => !ancestors.has(id)); } })<br>call → [H-2da19ebdc90a](ui__photo-outline-import.md#h-2da19ebdc90a)<br>전달 콜백: H-b20686054784 |

## H-b20686054784

**@callback:edit** · [src/ui/photo-outline-import.tsx:707](../../../src/ui/photo-outline-import.tsx#L707)

분기 조건과 가능한 갈림길:

- B-ea85d668780d · IfStatement · !e.target.checked → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original (709행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 708행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | descendants(r.id)<br>call → [H-0beea2d264a8](ui__photo-outline-import.md#h-0beea2d264a8) |
| 715행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ falsy: !e.target.checked | ancestors.add(parent)<br>call |
| 716행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ falsy: !e.target.checked | d.rows.find((n) => n.id === parent)<br>call<br>전달 콜백: H-79865ac0669b |
| 718행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ falsy: !e.target.checked | d.excluded.filter((id) => !ancestors.has(id))<br>call<br>전달 콜백: H-48c55ada77d9 |

## H-79865ac0669b

**@callback:d.rows.find** · [src/ui/photo-outline-import.tsx:716](../../../src/ui/photo-outline-import.tsx#L716)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-48c55ada77d9

**@callback:d.excluded.filter** · [src/ui/photo-outline-import.tsx:718](../../../src/ui/photo-outline-import.tsx#L718)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 718행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ falsy: !e.target.checked | ancestors.has(id)<br>call |

## H-1e01fb501b16

**@onChange** · [src/ui/photo-outline-import.tsx:728](../../../src/ui/photo-outline-import.tsx#L728)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 729행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | edit((d) => { d.rows[i].name = e.target.value; })<br>call → [H-2da19ebdc90a](ui__photo-outline-import.md#h-2da19ebdc90a)<br>전달 콜백: H-842d157e01cc |

## H-842d157e01cc

**@callback:edit** · [src/ui/photo-outline-import.tsx:729](../../../src/ui/photo-outline-import.tsx#L729)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7a603ce2c076

**@onChange** · [src/ui/photo-outline-import.tsx:738](../../../src/ui/photo-outline-import.tsx#L738)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 739행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | edit((d) => { d.rows[i].parentId = e.target.value \|\| null; })<br>call → [H-2da19ebdc90a](ui__photo-outline-import.md#h-2da19ebdc90a)<br>전달 콜백: H-72c0bca22f9a |

## H-72c0bca22f9a

**@callback:edit** · [src/ui/photo-outline-import.tsx:739](../../../src/ui/photo-outline-import.tsx#L739)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-26da56c898d3

**@callback:draft.rows
                          .filter** · [src/ui/photo-outline-import.tsx:746](../../../src/ui/photo-outline-import.tsx#L746)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 746행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | descendants(r.id).has(n.id)<br>call |
| 746행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | descendants(r.id)<br>call → [H-0beea2d264a8](ui__photo-outline-import.md#h-0beea2d264a8) |

## H-74937fd76f49

**@callback:draft.rows
                          .filter((n) => !descendants(r.id).has(n.id))
                          .map** · [src/ui/photo-outline-import.tsx:747](../../../src/ui/photo-outline-import.tsx#L747)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ac864d8961ca

**@onChange** · [src/ui/photo-outline-import.tsx:758](../../../src/ui/photo-outline-import.tsx#L758)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 759행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | edit((d) => { d.rows[i].content = e.target.value; })<br>call → [H-2da19ebdc90a](ui__photo-outline-import.md#h-2da19ebdc90a)<br>전달 콜백: H-4a5c27075931 |

## H-4a5c27075931

**@callback:edit** · [src/ui/photo-outline-import.tsx:759](../../../src/ui/photo-outline-import.tsx#L759)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-04a902264eea

**@callback:r.photoIds
                          .map** · [src/ui/photo-outline-import.tsx:767](../../../src/ui/photo-outline-import.tsx#L767)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 767행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | draft.photos.findIndex((p) => p.id === id)<br>preservation-boundary<br>전달 콜백: H-8c964deb0c31 |

## H-8c964deb0c31

**@callback:draft.photos.findIndex** · [src/ui/photo-outline-import.tsx:767](../../../src/ui/photo-outline-import.tsx#L767)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-23e54cbd4994

**@onClick** · [src/ui/photo-outline-import.tsx:774](../../../src/ui/photo-outline-import.tsx#L774)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 775행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | edit((d) => { [d.rows[i - 1], d.rows[i]] = [d.rows[i], d.rows[i - 1]]; })<br>call → [H-2da19ebdc90a](ui__photo-outline-import.md#h-2da19ebdc90a)<br>전달 콜백: H-1ca5711ae2f3 |

## H-1ca5711ae2f3

**@callback:edit** · [src/ui/photo-outline-import.tsx:775](../../../src/ui/photo-outline-import.tsx#L775)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-514aa5ebf0fd

**@onClick** · [src/ui/photo-outline-import.tsx:784](../../../src/ui/photo-outline-import.tsx#L784)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 785행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | edit((d) => { [d.rows[i], d.rows[i + 1]] = [d.rows[i + 1], d.rows[i]]; })<br>call → [H-2da19ebdc90a](ui__photo-outline-import.md#h-2da19ebdc90a)<br>전달 콜백: H-f087f658c383 |

## H-f087f658c383

**@callback:edit** · [src/ui/photo-outline-import.tsx:785](../../../src/ui/photo-outline-import.tsx#L785)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4153ddb757c8

**@onChange** · [src/ui/photo-outline-import.tsx:798](../../../src/ui/photo-outline-import.tsx#L798)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 799행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: !draft.registered && p?.candidates.length | structuredClone(current.current)<br>call |
| 800행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: !draft.registered && p?.candidates.length | descendants(r.id)<br>call → [H-0beea2d264a8](ui__photo-outline-import.md#h-0beea2d264a8) |
| 803행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: !draft.registered && p?.candidates.length | persist(next)<br>call → [H-651466be8d69](ui__photo-outline-import.md#h-651466be8d69) |

## H-6c7aa0e72ec1

**@callback:p.candidates.map** · [src/ui/photo-outline-import.tsx:808](../../../src/ui/photo-outline-import.tsx#L808)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-00fdec0878ca

**@onClick** · [src/ui/photo-outline-import.tsx:835](../../../src/ui/photo-outline-import.tsx#L835)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 835행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: !draft.registered | register()<br>call → [H-e8236493b92c](ui__photo-outline-import.md#h-e8236493b92c) |

## H-b0377a7bbae6

**@onClick** · [src/ui/photo-outline-import.tsx:843](../../../src/ui/photo-outline-import.tsx#L843)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 844행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: draft.pending && !data.appliedOps[draft.pending.opId] | persist({ ...current.current, pending: undefined })<br>call → [H-651466be8d69](ui__photo-outline-import.md#h-651466be8d69) |
| 845행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: draft.pending && !data.appliedOps[draft.pending.opId] | setMessage('등록 요청을 해제했습니다. 현재 목차와 다시 대조해 주세요.')<br>state-update |

## H-d72b31d14292

**@onClick** · [src/ui/photo-outline-import.tsx:864](../../../src/ui/photo-outline-import.tsx#L864)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 864행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: draft.registered | undo()<br>call → [H-67763a37f4db](ui__photo-outline-import.md#h-67763a37f4db) |

## H-57425f3fc2b4

**@onClick** · [src/ui/photo-outline-import.tsx:881](../../../src/ui/photo-outline-import.tsx#L881)

분기 조건과 가능한 갈림길:

- B-e4ed7761dafd · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original (882행).
- B-6c908e360435 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original (899행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 883행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | storeDraftSafely(`${photoDraftKey(data)}:history:${draft.original!.id}`, JSON.stringify(draft))<br>preservation-boundary |
| 884행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | photoDraftKey(data)<br>preservation-boundary → [H-d4d0847ccea0](ui__photo-outline-import.md#h-d4d0847ccea0) |
| 885행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | JSON.stringify(draft)<br>call |
| 887행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | persist({ version: 1, photos: [], subjectId: draft.subjectId, parentId: null, title: '사진에서 가져온 목차·내용', original: null, rows: [], excluded: [], choices: {}, })<br>call → [H-651466be8d69](ui__photo-outline-import.md#h-651466be8d69) |
| 898행 | truthy: open ∧ truthy: open ∧ truthy: draft.original | setMessage('기존 사진 묶음을 보관했습니다. 새 사진을 선택해 주세요.')<br>state-update |
| 900행 | truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ exception: exception | setError('이전 초안을 보관하지 못해 새 묶음을 시작하지 않았습니다.')<br>state-update |

## H-cf78b624308c

**PhotoHierarchy** · [src/ui/photo-outline-import.tsx:921](../../../src/ui/photo-outline-import.tsx#L921)

분기 조건과 가능한 갈림길:

- B-e8828d8428d6 · ConditionalExpression · children.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (929행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 928행 | 별도 조건식 없음 | rows.filter((r) => r.parentId === parentId)<br>call<br>전달 콜백: H-6d1b20e05886 |
| 931행 | truthy: children.length | children.map((r) => ( <li key={r.id}> {r.name} {r.uncertain ? ' · 확인 필요' : ''} <PhotoHierarchy rows={rows} parentId={r.id} /> </li> ))<br>call<br>전달 콜백: H-0b615405b584 |

반환/조기 중단: 929행 children.length ? ( <ul className="photo-outline-hierarchy"> {children.map((r) => ( <li key={r.id}> {r.name} {r.uncertain ? ' · 확인 필요' : ''} <PhotoHierarchy rows={rows} parentId={r.id} /> </li> ))} </ul> ) : null [별도 조건식 없음]

## H-6d1b20e05886

**@callback:rows.filter** · [src/ui/photo-outline-import.tsx:928](../../../src/ui/photo-outline-import.tsx#L928)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0b615405b584

**@callback:children.map** · [src/ui/photo-outline-import.tsx:931](../../../src/ui/photo-outline-import.tsx#L931)

분기 조건과 가능한 갈림길:

- B-ebb48dfea1ba · ConditionalExpression · r.uncertain → truthy / falsy; 바깥 조건: truthy: children.length (934행).

