# src/ui/study-materials.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-41261534bb0c

**message** · [src/ui/study-materials.tsx:65](../../../src/ui/study-materials.tsx#L65)

분기 조건과 가능한 갈림길:

- B-ea1eede766a0 · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (66행).

## H-3a866d502ecc

**context** · [src/ui/study-materials.tsx:67](../../../src/ui/study-materials.tsx#L67)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 70행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 71행 | 별도 조건식 없음 | new Date().toISOString()<br>call |

## H-d84d5668468a

**clock** · [src/ui/study-materials.tsx:73](../../../src/ui/study-materials.tsx#L73)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 74행 | 별도 조건식 없음 | Math.floor(seconds / 60)<br>call |
| 74행 | 별도 조건식 없음 | String(Math.floor(seconds % 60)).padStart(2, '0')<br>call |
| 74행 | 별도 조건식 없음 | String(Math.floor(seconds % 60))<br>call |
| 74행 | 별도 조건식 없음 | Math.floor(seconds % 60)<br>call |

## H-35f877a77e44

**StudyMaterials** · [src/ui/study-materials.tsx:76](../../../src/ui/study-materials.tsx#L76)

분기 조건과 가능한 갈림길:

- B-124e36757b2d · ConditionalExpression · trash → truthy / falsy; 바깥 조건: 별도 조건식 없음 (82행).
- B-e8550dbf41c2 · ConditionalExpression · trash → truthy / falsy; 바깥 조건: 별도 조건식 없음 (88행).
- B-fdf1fb200fb3 · IfStatement · !trash && (materialId === 'new' || selected) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (119행).
- B-577dfb71b491 · ConditionalExpression · aiAllowed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (133행).
- B-0fd9ff04ece0 · ConditionalExpression · items.length → truthy / falsy; 바깥 조건: truthy: !scoped.length (176행).
- B-5172b4452b45 · ConditionalExpression · trash → truthy / falsy; 바깥 조건: truthy: !scoped.length ∧ falsy: items.length (178행).
- B-f1be8d30876d · ConditionalExpression · items.length → truthy / falsy; 바깥 조건: truthy: !scoped.length (183행).
- B-afdb50339610 · ConditionalExpression · trash → truthy / falsy; 바깥 조건: truthy: !scoped.length ∧ falsy: items.length (185행).
- B-b7da1b186ae5 · ConditionalExpression · aiAllowed → truthy / falsy; 바깥 조건: truthy: !scoped.length ∧ falsy: items.length ∧ falsy: trash (187행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 78행 | 별도 조건식 없음 | canUseOwnerAI(data)<br>call |
| 79행 | 별도 조건식 없음 | useState('')<br>call |
| 80행 | 별도 조건식 없음 | useViewContext(data, `materials:${trash ? 'trash' : 'active'}:query`, '', isViewText)<br>call |
| 86행 | 별도 조건식 없음 | useViewContext(data, `materials:${trash ? 'trash' : 'active'}:limit`, 40, isViewPage)<br>call |
| 92행 | 별도 조건식 없음 | (data.studyMaterials ?? [])<br>    .filter((row) => Boolean(row.deletedAt) === trash)<br>    .slice()<br>    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))<br>mutation-request<br>전달 콜백: H-4e0d5c815508 |
| 92행 | 별도 조건식 없음 | (data.studyMaterials ?? [])<br>    .filter((row) => Boolean(row.deletedAt) === trash)<br>    .slice()<br>mutation-request |
| 92행 | 별도 조건식 없음 | (data.studyMaterials ?? [])<br>    .filter((row) => Boolean(row.deletedAt) === trash)<br>call<br>전달 콜백: H-fae384a314fc |
| 96행 | 별도 조건식 없음 | items.find((row) => row.id === materialId)<br>call<br>전달 콜백: H-011871f67c62 |
| 97행 | 별도 조건식 없음 | items.filter((row) => props.subjectIds === undefined \|\| props.subjectIds.includes(row.subjectId))<br>call<br>전달 콜백: H-5e205ab8bc3e |
| 100행 | 별도 조건식 없음 | scoped.filter((row) => `${row.title}\n${row.sourceText}\n${data.subjects.find((subject) => subject.id === row.subjectId)?.name ?? ''}` .normalize('NFC') .toLocaleLowerCase('ko-KR') .includes(query.trim().normalize('NFC').toLocaleLowerCase('ko-KR')))<br>call<br>전달 콜백: H-8dbe45d95440 |
| 194행 | 별도 조건식 없음 | visible.slice(0, Math.max(40, limit)).map((row) => ( <article key={row.id}> <h2> {trash ? ( row.title ) : ( <a href={`#/materials/${encodeURIComponent(row.id)}`}>{row.title}</a> )} </h2> <p> {data.subjects.find((subject) => subject.id === row.subjectId)?.name} ·{' '} {row.audio ? row.audio.name : (row.documents?.[0]?.name ?? '강의 필기')} ·{' '} {row.results.at(-1)?.cards.filter((card) => !card.excluded).length ?? 0}개 카드 </p> {trash && <Button onClick={() => restore(row)}>복원</Button>} </article> ))<br>call<br>전달 콜백: H-6d5462f011bc |
| 194행 | 별도 조건식 없음 | visible.slice(0, Math.max(40, limit))<br>call |
| 194행 | 별도 조건식 없음 | Math.max(40, limit)<br>call |
| 212행 | 별도 조건식 없음 | Math.max(40, limit)<br>call |

반환/조기 중단: 120행 <render> [truthy: !trash && (materialId === 'new' || selected)]; 128행 <render> [별도 조건식 없음]

## H-fae384a314fc

**@callback:(data.studyMaterials ?? [])
    .filter** · [src/ui/study-materials.tsx:93](../../../src/ui/study-materials.tsx#L93)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 93행 | 별도 조건식 없음 | Boolean(row.deletedAt)<br>call |

## H-4e0d5c815508

**@callback:(data.studyMaterials ?? [])
    .filter((row) => Boolean(row.deletedAt) === trash)
    .slice()
    .sort** · [src/ui/study-materials.tsx:95](../../../src/ui/study-materials.tsx#L95)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 95행 | 별도 조건식 없음 | b.updatedAt.localeCompare(a.updatedAt)<br>call |

## H-011871f67c62

**@callback:items.find** · [src/ui/study-materials.tsx:96](../../../src/ui/study-materials.tsx#L96)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5e205ab8bc3e

**@callback:items.filter** · [src/ui/study-materials.tsx:98](../../../src/ui/study-materials.tsx#L98)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 98행 | falsy: props.subjectIds === undefined | props.subjectIds.includes(row.subjectId)<br>call |

## H-8dbe45d95440

**@callback:scoped.filter** · [src/ui/study-materials.tsx:100](../../../src/ui/study-materials.tsx#L100)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 101행 | 별도 조건식 없음 | `${row.title}\n${row.sourceText}\n${data.subjects.find((subject) => subject.id === row.subjectId)?.name ?? ''}`<br>      .normalize('NFC')<br>      .toLocaleLowerCase('ko-KR')<br>      .includes(query.trim().normalize('NFC').toLocaleLowerCase('ko-KR'))<br>call |
| 101행 | 별도 조건식 없음 | `${row.title}\n${row.sourceText}\n${data.subjects.find((subject) => subject.id === row.subjectId)?.name ?? ''}`<br>      .normalize('NFC')<br>      .toLocaleLowerCase('ko-KR')<br>call |
| 101행 | 별도 조건식 없음 | `${row.title}\n${row.sourceText}\n${data.subjects.find((subject) => subject.id === row.subjectId)?.name ?? ''}`<br>      .normalize('NFC')<br>call |
| 101행 | 별도 조건식 없음 | data.subjects.find((subject) => subject.id === row.subjectId)<br>call<br>전달 콜백: H-4026b7db33ca |
| 104행 | 별도 조건식 없음 | query.trim().normalize('NFC').toLocaleLowerCase('ko-KR')<br>call |
| 104행 | 별도 조건식 없음 | query.trim().normalize('NFC')<br>call |
| 104행 | 별도 조건식 없음 | query.trim()<br>call |

## H-4026b7db33ca

**@callback:data.subjects.find** · [src/ui/study-materials.tsx:101](../../../src/ui/study-materials.tsx#L101)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f37fc13e18f8

**restore** · [src/ui/study-materials.tsx:106](../../../src/ui/study-materials.tsx#L106)

분기 조건과 가능한 갈림길:

- B-ca14e3a7baae · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (107행).
- B-6a12388eb0d9 · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (115행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 108행 | 별도 조건식 없음 | repository.execute({ type: 'restoreStudyMaterial', id: row.id, expectedVersion: row.version, ...context(data), })<br>call |
| 112행 | 별도 조건식 없음 | context(data)<br>call → [H-3a866d502ecc](ui__study-materials.md#h-3a866d502ecc) |
| 114행 | 별도 조건식 없음 | onSaved(next)<br>call |
| 116행 | exception: error | setError(message(error))<br>state-update |
| 116행 | exception: error | message(error)<br>call → [H-41261534bb0c](ui__study-materials.md#h-41261534bb0c) |

## H-eef125e0e3ba

**@onClick** · [src/ui/study-materials.tsx:138](../../../src/ui/study-materials.tsx#L138)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 138행 | truthy: !trash | navigate('/materials/new')<br>navigation |

## H-8df0ea3ff00e

**@onChange** · [src/ui/study-materials.tsx:156](../../../src/ui/study-materials.tsx#L156)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 157행 | 별도 조건식 없음 | setQuery(event.target.value)<br>state-update |
| 158행 | 별도 조건식 없음 | setLimit(40)<br>state-update |

## H-9289e9528e91

**@onClick** · [src/ui/study-materials.tsx:164](../../../src/ui/study-materials.tsx#L164)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 165행 | truthy: scoped.length > 0 && !visible.length | setQuery('')<br>state-update |
| 166행 | truthy: scoped.length > 0 && !visible.length | setLimit(40)<br>state-update |

## H-6d5462f011bc

**@callback:visible.slice(0, Math.max(40, limit)).map** · [src/ui/study-materials.tsx:194](../../../src/ui/study-materials.tsx#L194)

분기 조건과 가능한 갈림길:

- B-de327507fd13 · ConditionalExpression · trash → truthy / falsy; 바깥 조건: 별도 조건식 없음 (197행).
- B-81211bcff4dc · ConditionalExpression · row.audio → truthy / falsy; 바깥 조건: 별도 조건식 없음 (205행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 200행 | falsy: trash | encodeURIComponent(row.id)<br>call |
| 204행 | 별도 조건식 없음 | data.subjects.find((subject) => subject.id === row.subjectId)<br>call<br>전달 콜백: H-1aec0c65cf59 |
| 206행 | 별도 조건식 없음 | row.results.at(-1)<br>call |

## H-1aec0c65cf59

**@callback:data.subjects.find** · [src/ui/study-materials.tsx:204](../../../src/ui/study-materials.tsx#L204)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ac2716e2d15e

**@onClick** · [src/ui/study-materials.tsx:208](../../../src/ui/study-materials.tsx#L208)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 208행 | truthy: trash | restore(row)<br>call → [H-f37fc13e18f8](ui__study-materials.md#h-f37fc13e18f8) |

## H-8c9ec1797f68

**@onClick** · [src/ui/study-materials.tsx:213](../../../src/ui/study-materials.tsx#L213)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 213행 | truthy: visible.length > Math.max(40, limit) | setLimit((value) => Math.max(40, value) + 40)<br>state-update<br>전달 콜백: H-16fc208d34d7 |

## H-16fc208d34d7

**@callback:setLimit** · [src/ui/study-materials.tsx:213](../../../src/ui/study-materials.tsx#L213)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 213행 | truthy: visible.length > Math.max(40, limit) | Math.max(40, value)<br>call |

## H-6e8a32a78372

**MaterialEditor** · [src/ui/study-materials.tsx:222](../../../src/ui/study-materials.tsx#L222)

분기 조건과 가능한 갈림길:

- B-0fd2e20d8d8b · ConditionalExpression · content.learningView?.activeDisclosure === 'revealed' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (285행).
- B-765a83d8cb88 · ConditionalExpression · result && card → truthy / falsy; 바깥 조건: 별도 조건식 없음 (305행).
- B-b527806e1a33 · ConditionalExpression · ranges && content.generationProgress?.sourceIdentity === ranges.sourceIdentity → truthy / falsy; 바깥 조건: 별도 조건식 없음 (322행).
- B-3ad355540ae0 · ConditionalExpression · draftState === 'pending' → truthy / falsy; 바깥 조건: truthy: draftState !== 'saved' (884행).
- B-5f41e364c14a · ConditionalExpression · tab === 'quiz' && result?.quiz → truthy / falsy; 바깥 조건: 별도 조건식 없음 (918행).
- B-3fe9137880b9 · ConditionalExpression · content.audio.cloudPath → truthy / falsy; 바깥 조건: truthy: content.audio (1033행).
- B-269a591992a2 · ConditionalExpression · task === 'study-pack' → truthy / falsy; 바깥 조건: truthy: aiAllowed (1081행).
- B-a04a4ebb8a27 · ConditionalExpression · busy → truthy / falsy; 바깥 조건: truthy: aiAllowed (1114행).
- B-eb932d64394e · ConditionalExpression · result → truthy / falsy; 바깥 조건: truthy: aiAllowed ∧ falsy: busy (1116행).
- B-745d704b91a7 · ConditionalExpression · task === 'summary' → truthy / falsy; 바깥 조건: truthy: aiAllowed ∧ falsy: busy ∧ falsy: result (1118행).
- B-b8aadb934f73 · ConditionalExpression · task === 'study-pack' → truthy / falsy; 바깥 조건: truthy: aiAllowed ∧ falsy: busy ∧ falsy: result ∧ falsy: task === 'summary' (1120행).
- B-384e752869cf · ConditionalExpression · saving → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1127행).
- B-91a1543d75e0 · ConditionalExpression · task === 'formula' → truthy / falsy; 바깥 조건: truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready || busy || saving || importing (1203행).
- B-95dd06fb4363 · ConditionalExpression · task === 'practice' → truthy / falsy; 바깥 조건: truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready || busy || saving || importing ∧ truthy: ['hint', 'feedback', 'practice'].includes(task) (1220행).
- B-cf86318c40e9 · ConditionalExpression · task === 'hint' → truthy / falsy; 바깥 조건: truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready || busy || saving || importing ∧ truthy: ['hint', 'feedback', 'practice'].includes(task) (1226행).
- B-e383bd50108e · ConditionalExpression · result.quiz → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving (1314행).
- B-e4f595a44865 · ConditionalExpression · result.map → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving (1315행).
- B-45904dcbcd75 · ConditionalExpression · editingResult → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' (1390행).
- B-2ad53622f64b · ConditionalExpression · result.source?.audio || (!result.source && content.audio) → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'transcript' (1464행).
- B-0a7ff68a7709 · ConditionalExpression · card → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' (1510행).
- B-42cc99b7f76a · ConditionalExpression · editingCard === cardKey && cardKey → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card (1516행).
- B-54d53fd3be65 · ConditionalExpression · answer === cardKey && cardKey → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card ∧ falsy: editingCard === cardKey && cardKey (1536행).
- B-da94e4ff22e5 · ConditionalExpression · tab === 'quiz' → truthy / falsy; 바깥 조건: truthy: aiAllowed (1646행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 229행 | 별도 조건식 없음 | canUseOwnerAI(data)<br>call |
| 230행 | 별도 조건식 없음 | useMemo(() => ({ userId: data.userId, namespace: data.namespace }), [data.userId, data.namespace])<br>call<br>전달 콜백: H-9952911bc8fa |
| 234행 | 별도 조건식 없음 | useRef(selected?.version ?? 0)<br>call |
| 236행 | 별도 조건식 없음 | useState(() => selected ? materialContent(selected) : { title: '', subjectId: initialSubjectId ?? data.subjects.find((row) => !row.deletedAt)?.id ?? '', topicId: null, sourceText: '', audio: null, results: [], aiRequest: { task: 'study-pack' }, })<br>call<br>전달 콜백: H-f0fd49348be7 |
| 249행 | 별도 조건식 없음 | useRef(content)<br>call |
| 250행 | 별도 조건식 없음 | useRef(selected?.version ?? 0)<br>call |
| 251행 | 별도 조건식 없음 | useRef(true)<br>call |
| 252행 | 별도 조건식 없음 | useRef(false)<br>call |
| 253행 | 별도 조건식 없음 | useRef(undefined)<br>call |
| 254행 | 별도 조건식 없음 | useRef(Promise.resolve())<br>call |
| 254행 | 별도 조건식 없음 | Promise.resolve()<br>call |
| 255행 | 별도 조건식 없음 | useRef(undefined)<br>call |
| 256행 | 별도 조건식 없음 | useRef(undefined)<br>call |
| 257행 | 별도 조건식 없음 | useRef(null)<br>call |
| 258행 | 별도 조건식 없음 | useState(false)<br>call |
| 259행 | 별도 조건식 없음 | useState('')<br>call |
| 260행 | 별도 조건식 없음 | useState('')<br>call |
| 261행 | 별도 조건식 없음 | useState(false)<br>call |
| 262행 | 별도 조건식 없음 | useState(false)<br>call |
| 264행 | 별도 조건식 없음 | useState('')<br>call |
| 265행 | 별도 조건식 없음 | useState(false)<br>call |
| 266행 | 별도 조건식 없음 | useRef(null)<br>call |
| 267행 | 별도 조건식 없음 | useState('')<br>call |
| 268행 | 별도 조건식 없음 | useState(content.learningView?.tab ?? 'summary')<br>call |
| 271행 | 별도 조건식 없음 | useState(() => { const index = content.results.findIndex((r) => r.id === content.learningView?.resultId); return index >= 0 ? index : Math.max(0, content.results.length - 1); })<br>call<br>전달 콜백: H-3b09e57d8e4d |
| 275행 | 별도 조건식 없음 | useState(() => Math.max( 0, content.results .find((r) => r.id === content.learningView?.resultId) ?.cards.filter((c) => !c.excluded) .findIndex((c) => c.id === content.learningView?.cardId) ?? 0, ))<br>call<br>전달 콜백: H-edffa1d3611d |
| 284행 | 별도 조건식 없음 | useState(content.learningView?.activeDisclosure === 'revealed' ? `${content.learningView.resultId}:${content.learningView.cardId}` : '')<br>call |
| 289행 | 별도 조건식 없음 | useState('')<br>call |
| 290행 | 별도 조건식 없음 | useState(false)<br>call |
| 291행 | 별도 조건식 없음 | useState(false)<br>call |
| 292행 | 별도 조건식 없음 | useRef(false)<br>call |
| 293행 | 별도 조건식 없음 | useRef(false)<br>call |
| 294행 | 별도 조건식 없음 | useRef(selected?.id ?? crypto.randomUUID())<br>call |
| 294행 | nullish: selected?.id | crypto.randomUUID()<br>call |
| 295행 | 별도 조건식 없음 | useState(false)<br>call |
| 296행 | 별도 조건식 없음 | canonicalStudyTask(content.aiRequest?.task ?? 'summary')<br>call |
| 300행 | 별도 조건식 없음 | useState(false)<br>call |
| 301행 | 별도 조건식 없음 | useState(false)<br>call |
| 306행 | 별도 조건식 없음 | useRef(content.learningView ?? { tab: 'summary', revealed: [], helped: [] })<br>call |
| 309행 | 별도 조건식 없음 | useRef(0)<br>call |
| 310행 | 별도 조건식 없음 | useState('saved')<br>call |
| 311행 | 별도 조건식 없음 | useMemo(() => { try { return planMaterialRanges( { ...content, audio: null }, activeStudyAIRequest(content.aiRequest), ); } catch { return null; } }, [content])<br>call<br>전달 콜백: H-2f8389ee72f1 |
| 359행 | 별도 조건식 없음 | Boolean(result?.quiz)<br>call |
| 360행 | 별도 조건식 없음 | Boolean(result?.map)<br>call |
| 361행 | 별도 조건식 없음 | useEffectEvent(() => { if (!ready) return; if ((tab === 'quiz' && !result?.quiz) \|\| (tab === 'map' && !result?.map)) { setTab('summary'); return; } viewState.current = { ...viewState.current, resultId: result?.id, cardId: card?.id, tab, activeDisclosure: answer === cardKey && cardKey ? 'revealed' : 'hidden', }; retain(current.current); })<br>call<br>전달 콜백: H-f21792906210 |
| 377행 | 별도 조건식 없음 | useEffect(() => { updateLearningView(); }, [ready, result?.id, hasQuiz, hasMap, card?.id, tab, answer, cardKey])<br>call<br>전달 콜백: H-a6c8301d5bdc |
| 382행 | 별도 조건식 없음 | useEffect(() => { setEditingCard(''); setSourceOpen(false); }, [ready, result?.id, card?.id, tab, cardKey])<br>call<br>전달 콜백: H-e0b3d48aa809 |
| 418행 | 별도 조건식 없음 | useEffectEvent(() => Boolean(selected))<br>call<br>전달 콜백: H-1b6b448ce9f3 |
| 419행 | 별도 조건식 없음 | useEffectEvent(() => selected ? initialVersion.current : (repository.getSnapshot().studyMaterials?.find((row) => row.id === stableMaterialId.current) ?.version ?? 0))<br>call<br>전달 콜백: H-9be2dc387e0e |
| 425행 | 별도 조건식 없음 | useEffect(() => { mounted.current = true; void readMaterialDraft(owner, draftId) .then((draft) => { if (!mounted.current) return; if (draft) { if ( !draft.content \|\| !Array.isArray(draft.content.results) \|\| !Number.isSafeInteger(draft.baseVersion) ) throw Error('보관된 자료 초안을 읽지 못했습니다. 원본은 덮어쓰지 않았습니다.'); baseVersion.current = draft.baseVersion; if (!hasSelectedMaterial() && typeof draft.materialId === 'string' && draft.materialId) stableMaterialId.current = draft.materialId; recordingId.current = draft.recordingId ?? draft.audioCleanup?.recordingId; audioRecordingId.current = draft.audioRecordingId; audioCleanup.current = draft.audioCleanup; // Old cleanup drafts may hold the only reference to an existin … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-a588dccdabb7 |
| 488행 | 별도 조건식 없음 | useEffect(() => { let disposed = false, url = ''; setAudioURL(''); setMissingAudio(false); if (audioFile) void readAudio(owner, audioFile) .then((blob) => { if (disposed) return; if (!blob) { setMissingAudio(true); return; } url = URL.createObjectURL(blob); setAudioURL(url); }) .catch((error) => { if (!disposed) setError(message(error)); }); return () => { disposed = true; if (url) URL.revokeObjectURL(url); }; }, [audioFile, owner])<br>call<br>전달 콜백: H-c854fc1f7944 |
| 512행 | 별도 조건식 없음 | useEffect(() => { const timed = result?.segments.filter((segment) => segment.start !== null && segment.end !== null) ?? []; if (!timed.length \|\| (result?.source && result.source.audio?.sha256 !== audioFile?.sha256)) { setCaptionURL(''); return; } const timestamp = (seconds: number) => new Date(seconds * 1000).toISOString().slice(11, 23); const vtt = `WEBVTT\n\n${timed.map((segment) => `${timestamp(segment.start ?? 0)} --> ${timestamp(segment.end ?? 0)}\n${segment.text}`).join('\n\n')}\n`; const url = URL.createObjectURL(new Blob([vtt], { type: 'text/vtt' })); setCaptionURL(url); return () => URL.revokeObjectURL(url); }, [result, audioFile?.sha256])<br>call<br>전달 콜백: H-5772bf2dff35 |
| 525행 | 별도 조건식 없음 | useEffect(() => { const before = (event: BeforeUnloadEvent) => { if (busy \|\| importing \|\| draftState !== 'saved') { event.preventDefault(); event.returnValue = ''; } }; const leave = (event: MouseEvent) => { const link = event.target instanceof Element ? event.target.closest('a[href]') : null; const href = link?.getAttribute('href'); if (!href?.startsWith('#/') \|\| draftState === 'saved') return; if (draftState === 'failed') { if ( !window.confirm( '이 기기에 저장되지 않은 변경이 있습니다. 내보내기나 초안 저장 재시도 후 나갈 수 있습니다. 지금 나가시겠습니까?', ) ) { event.preventDefault(); event.stopPropagation(); } } else { event.preventDefault(); event.stopPropagation(); void draftFlight.current .then(() => { location.hash = href; }) .catch(() = … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-f3cd82d410e9 |
| 937행 | interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing | data.subjects<br>                .filter((row) => !row.deletedAt)<br>                .map((row) => ( <option key={row.id} value={row.id}> {row.name} </option> ))<br>mutation-request<br>전달 콜백: H-889894a1a33e |
| 937행 | interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing | data.subjects<br>                .filter((row) => !row.deletedAt)<br>call<br>전달 콜백: H-cc0f64227381 |
| 951행 | interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing | data.nodes<br>                .filter((row) => row.subjectId === content.subjectId && !row.deletedAt)<br>                .map((row) => ( <option key={row.id} value={row.id}> {row.name} </option> ))<br>mutation-request<br>전달 콜백: H-fe699c038caa |
| 951행 | interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing | data.nodes<br>                .filter((row) => row.subjectId === content.subjectId && !row.deletedAt)<br>call<br>전달 콜백: H-eaddbd349e6a |
| 1032행 | truthy: content.audio | (content.audio.size / 1024 / 1024).toFixed(1)<br>call |
| 1072행 | truthy: aiAllowed | Object.entries(STUDY_AI_TASKS)<br>                .filter(([value]) => value !== 'tutor' && value !== 'source-qa')<br>                .map(([value, option]) => ( <option key={value} value={value}> {option.label} </option> ))<br>call<br>전달 콜백: H-456832f7fc51 |
| 1072행 | truthy: aiAllowed | Object.entries(STUDY_AI_TASKS)<br>                .filter(([value]) => value !== 'tutor' && value !== 'source-qa')<br>call<br>전달 콜백: H-1908f8aa9b6c |
| 1072행 | truthy: aiAllowed | Object.entries(STUDY_AI_TASKS)<br>call |
| 1092행 | truthy: aiAllowed | [5, 10, 20, 30].map((value) => ( <option key={value} value={value}> {value}개 이내 </option> ))<br>call<br>전달 콜백: H-94609ad5819e |
| 1107행 | truthy: aiAllowed ∧ falsy: !ready \|\|<br>                busy \|\|<br>                saving \|\|<br>                importing \|\|<br>                !content.subjectId \|\|<br>                task === 'tutor' | content.sourceText.trim()<br>call |
| 1144행 | truthy: aiAllowed && ranges && ranges.batches.length > 1 | Math.min(rangeIndex, ranges.batches.length - 1)<br>call |
| 1160행 | truthy: aiAllowed && ranges && ranges.batches.length > 1 | ranges.batches.map((batch, index) => ( <option key={JSON.stringify(batch.map((segment) => segment.id))} value={index}> {index + 1} / {ranges.batches.length} · {batch[0]?.label ?? batch[0]?.id}– {batch.at(-1)?.label ?? batch.at(-1)?.id} ·{' '} {batch.reduce((n, s) => n + s.text.length, 0).toLocaleString('ko-KR')}자 {content.generationProgress?.sourceIdentity === ranges.sourceIdentity && content.generationProgress.completed.some((c) => c.index === index) ? ' · 결과 보관됨' : ''} </option> ))<br>call<br>전달 콜백: H-52ba9057f7c0 |
| 1211행 | truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing | ['hint', 'feedback', 'practice'].includes(task)<br>call |
| 1251행 | truthy: result ∧ interactive-when-falsy: saving | canonicalStudyTask(result.request?.task ?? 'summary')<br>call |
| 1261행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.diagnostics | occurrenceRows(result.diagnostics, (diagnostic) => JSON.stringify(diagnostic)).map(({ value: d, key }) => ( <article key={key}> <p>{d.message}</p> {d.questions?.map((q) => ( <p key={q}>{q}</p> ))} {d.sourceIds?.length ? evidence(d.sourceIds) : null} </article> ))<br>call<br>전달 콜백: H-b772b40679ac |
| 1261행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.diagnostics | occurrenceRows(result.diagnostics, (diagnostic) => JSON.stringify(diagnostic))<br>call<br>전달 콜백: H-777d360dc073 |
| 1273행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.source | materialSourceIdentity(result.source)<br>call |
| 1273행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.source | materialSourceIdentity(content)<br>call |
| 1275행 | truthy: result ∧ interactive-when-falsy: saving ∧ falsy: result.source &&<br>            materialSourceIdentity(result.source) !== materialSourceIdentity(content) ∧ truthy: result.request?.task !== 'tutor' | JSON.stringify(activeStudyAIRequest(result.request))<br>call |
| 1275행 | truthy: result ∧ interactive-when-falsy: saving ∧ falsy: result.source &&<br>            materialSourceIdentity(result.source) !== materialSourceIdentity(content) ∧ truthy: result.request?.task !== 'tutor' | activeStudyAIRequest(result.request)<br>call |
| 1276행 | truthy: result ∧ interactive-when-falsy: saving ∧ falsy: result.source &&<br>            materialSourceIdentity(result.source) !== materialSourceIdentity(content) ∧ truthy: result.request?.task !== 'tutor' | JSON.stringify(activeStudyAIRequest(content.aiRequest))<br>call |
| 1276행 | truthy: result ∧ interactive-when-falsy: saving ∧ falsy: result.source &&<br>            materialSourceIdentity(result.source) !== materialSourceIdentity(content) ∧ truthy: result.request?.task !== 'tutor' | activeStudyAIRequest(content.aiRequest)<br>call |
| 1277행 | truthy: result ∧ interactive-when-falsy: saving ∧ falsy: (result.source &&<br>            materialSourceIdentity(result.source) !== materialSourceIdentity(content)) \|\|<br>            (result.request?.task !== 'tutor' &&<br>              JSON.stringify(activeStudyAIRequest(result.request)) !==<br>                JSON.stringify(activeStudyAIRequest(content.aiRequest))) | result.segments.some((segment) => segment.originalText !== undefined && segment.originalText !== segment.text)<br>call<br>전달 콜백: H-7123dc15cbef |
| 1299행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: content.results.length > 1 | content.results.map((row, index) => ( <option key={row.id} value={index}> {index + 1}번째 ·{' '} {STUDY_AI_TASKS[canonicalStudyTask(row.request?.task ?? 'summary')].label} ·{' '} {new Date(row.at).toLocaleString('ko-KR')} </option> ))<br>call<br>전달 콜백: H-cda19853b886 |
| 1309행 | truthy: result ∧ interactive-when-falsy: saving | (<br>              [<br>                'summary',<br>                'transcript',<br>                'cards',<br>                ...(result.quiz ? ['quiz' as const] : []),<br>                ...(result.map ? ['map' as const] : []),<br>              ] as const<br>            ).map((value) => ( <Button key={value} variant="quiet" aria-pressed={tab === value} onClick={() => chooseTab(value)} > { { summary: result.request && !['summary', 'study-pack'].includes(result.request.task) ? '보조 결과' : '요약', transcript: '받아쓴 원문', cards: `플래시카드 ${cards.length}`, quiz: `퀴즈 ${result.quiz?.length ?? 0}`, map: '개념도', }[value] } </Button> ))<br>call<br>전달 콜백: H-8d8a0e6d6f79 |
| 1392행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' | result.summary.map((row, index) => ( // biome-ignore lint/suspicious/noArrayIndexKey: Editable summary rows keep their result order; a content-derived key would remount the editor while typing. <article key={`${result.id}:${index}`}> {row.evidenceType === 'general-supplement' && ( <p>보충 설명 · 자료에서 직접 확인한 사실과 구별합니다.</p> )} {editingResult ? ( <Textarea label={`${index + 1}번째 보조 결과`} value={row.text} maxLength={10_000} onChange={(event) => retain({ ...current.current, results: current.current.results.map((item) => item.id === result.id ? { ...item, summary: item.summary.map((line, at) => at === index ? { ...line, originalText: line.originalText ?? line.text, text: event.target.value, } : line, ), } : item, ), }) } … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-9b94d1e89ef0 |
| 1468행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'transcript' | result.segments.map((segment) => ( <article key={segment.id} id={`material-segment-${segment.id}`}> <span> {segment.label ?? (segment.start != null ? clock(segment.start) : segment.id)} </span> <Textarea label={`${segment.id} 원문`} rows={3} value={segment.text} onChange={(event) => retain({ ...content, results: content.results.map((row) => row.id === result.id ? { ...row, segments: row.segments.map((item) => item.id === segment.id ? { ...item, originalText: item.originalText ?? item.text, text: event.target.value, } : item, ), } : row, ), }) } /> {segment.originalText !== undefined && ( <details> <summary>수정 전 원문</summary> <p>{segment.originalText}</p> </details> )} </article> ))<br>call<br>전달 콜백: H-411c8667889f |
| 1545행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card | evidence(card.sourceIds)<br>call → [H-b2efbd9066d5](ui__study-materials.md#h-b2efbd9066d5) |
| 1557행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card ∧ falsy: !selected | JSON.stringify({ ...materialContent(selected), learningView: undefined })<br>call |
| 1557행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card ∧ falsy: !selected | materialContent(selected)<br>call |
| 1558행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card ∧ falsy: !selected | JSON.stringify({ ...content, learningView: undefined })<br>call |
| 1610행 | truthy: result ∧ interactive-when-falsy: saving | result.cards.some((card) => card.excluded)<br>call<br>전달 콜백: H-6ab1c8baf3c1 |
| 1613행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.cards.some((card) => card.excluded) | result.cards<br>                .filter((card) => card.excluded)<br>                .map((card) => ( <div key={card.id}> {card.question} <Button variant="quiet" onClick={() => retain({ ...content, results: content.results.map((row) => row.id === result.id ? { ...row, cards: row.cards.map((item) => item.id === card.id ? { ...item, excluded: false } : item, ), } : row, ), }) } > 복원 </Button> </div> ))<br>call<br>전달 콜백: H-f64048239a32 |
| 1613행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.cards.some((card) => card.excluded) | result.cards<br>                .filter((card) => card.excluded)<br>call<br>전달 콜백: H-ac377d54cc97 |
| 1648행 | truthy: aiAllowed | content.results.filter((row) => row.request?.task === 'tutor' \|\| row.request?.task === 'source-qa')<br>call<br>전달 콜백: H-5ea4ee79241c |
| 1677행 | truthy: selected | data.revisions.filter((row) => row.collection === 'studyMaterials' && row.entityId === selected.id)<br>call<br>전달 콜백: H-f032df871e7b |

반환/조기 중단: 851행 <render> [별도 조건식 없음]

## H-9952911bc8fa

**@callback:useMemo** · [src/ui/study-materials.tsx:231](../../../src/ui/study-materials.tsx#L231)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f0fd49348be7

**@callback:useState** · [src/ui/study-materials.tsx:236](../../../src/ui/study-materials.tsx#L236)

분기 조건과 가능한 갈림길:

- B-d0403dd16b69 · ConditionalExpression · selected → truthy / falsy; 바깥 조건: 별도 조건식 없음 (237행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 238행 | truthy: selected | materialContent(selected)<br>call |
| 241행 | falsy: selected ∧ nullish: initialSubjectId | data.subjects.find((row) => !row.deletedAt)<br>call<br>전달 콜백: H-92e07d0e2c7d |

## H-92e07d0e2c7d

**@callback:data.subjects.find** · [src/ui/study-materials.tsx:241](../../../src/ui/study-materials.tsx#L241)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3b09e57d8e4d

**@callback:useState** · [src/ui/study-materials.tsx:271](../../../src/ui/study-materials.tsx#L271)

분기 조건과 가능한 갈림길:

- B-d96e79608d37 · ConditionalExpression · index >= 0 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (273행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 272행 | 별도 조건식 없음 | content.results.findIndex((r) => r.id === content.learningView?.resultId)<br>call<br>전달 콜백: H-ebc82c052d76 |
| 273행 | falsy: index >= 0 | Math.max(0, content.results.length - 1)<br>call |

반환/조기 중단: 273행 index >= 0 ? index : Math.max(0, content.results.length - 1) [별도 조건식 없음]

## H-ebc82c052d76

**@callback:content.results.findIndex** · [src/ui/study-materials.tsx:272](../../../src/ui/study-materials.tsx#L272)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-edffa1d3611d

**@callback:useState** · [src/ui/study-materials.tsx:275](../../../src/ui/study-materials.tsx#L275)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 276행 | 별도 조건식 없음 | Math.max(0, content.results .find((r) => r.id === content.learningView?.resultId) ?.cards.filter((c) => !c.excluded) .findIndex((c) => c.id === content.learningView?.cardId) ?? 0)<br>call |
| 278행 | 별도 조건식 없음 | content.results<br>          .find((r) => r.id === content.learningView?.resultId)<br>call<br>전달 콜백: H-5d5472101c8c |

## H-5d5472101c8c

**@callback:content.results
          .find** · [src/ui/study-materials.tsx:279](../../../src/ui/study-materials.tsx#L279)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4aeb6183a103

**requestPatch** · [src/ui/study-materials.tsx:297](../../../src/ui/study-materials.tsx#L297)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 298행 | 별도 조건식 없음 | retain({ ...current.current, aiRequest: { task, ...current.current.aiRequest, ...patch } })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |

## H-2f8389ee72f1

**@callback:useMemo** · [src/ui/study-materials.tsx:311](../../../src/ui/study-materials.tsx#L311)

분기 조건과 가능한 갈림길:

- B-a4143e5dfa9f · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (312행).
- B-aaeb25ec2308 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (317행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 313행 | 별도 조건식 없음 | planMaterialRanges({ ...content, audio: null }, activeStudyAIRequest(content.aiRequest))<br>call |
| 315행 | 별도 조건식 없음 | activeStudyAIRequest(content.aiRequest)<br>call |

반환/조기 중단: 313행 planMaterialRanges( { ...content, audio: null }, activeStudyAIRequest(content.aiRequest), ) [별도 조건식 없음]; 318행 null [exception: exception]

## H-1af41ce5185f

**revealCard** · [src/ui/study-materials.tsx:325](../../../src/ui/study-materials.tsx#L325)

분기 조건과 가능한 갈림길:

- B-2e2dcc3b5bbc · IfStatement · !cardKey → truthy / falsy; 바깥 조건: 별도 조건식 없음 (326행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 327행 | 별도 조건식 없음 | setAnswer(cardKey)<br>state-update |
| 333행 | 별도 조건식 없음 | retain(current.current)<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |

반환/조기 중단: 326행 <render> [truthy: !cardKey]

## H-fe33c198fd10

**recordHelp** · [src/ui/study-materials.tsx:335](../../../src/ui/study-materials.tsx#L335)

분기 조건과 가능한 갈림길:

- B-14445d895eb9 · IfStatement · !result → truthy / falsy; 바깥 조건: 별도 조건식 없음 (336행).
- B-733ded9d7d69 · ConditionalExpression · attempts → truthy / falsy; 바깥 조건: 별도 조건식 없음 (344행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 342행 | 별도 조건식 없음 | retain({ ...current.current, ...(attempts ? { quizAttempts: attempts.map((a) => a.resultId === result.id && !a.submittedAt ? { ...a, helpedQuestionIds: a.questions.map((q) => q.id) } : a, ), } : {}), })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |
| 346행 | truthy: attempts | attempts.map((a) => a.resultId === result.id && !a.submittedAt ? { ...a, helpedQuestionIds: a.questions.map((q) => q.id) } : a)<br>call<br>전달 콜백: H-61a8653126ba |

반환/조기 중단: 336행 <render> [truthy: !result]

## H-61a8653126ba

**@callback:attempts.map** · [src/ui/study-materials.tsx:346](../../../src/ui/study-materials.tsx#L346)

분기 조건과 가능한 갈림길:

- B-f61821519769 · ConditionalExpression · a.resultId === result.id && !a.submittedAt → truthy / falsy; 바깥 조건: truthy: attempts (347행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 348행 | truthy: attempts ∧ truthy: a.resultId === result.id && !a.submittedAt | a.questions.map((q) => q.id)<br>call<br>전달 콜백: H-96bea7d52246 |

## H-96bea7d52246

**@callback:a.questions.map** · [src/ui/study-materials.tsx:348](../../../src/ui/study-materials.tsx#L348)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a42db4836e82

**chooseTab** · [src/ui/study-materials.tsx:355](../../../src/ui/study-materials.tsx#L355)

분기 조건과 가능한 갈림길:

- B-2dba2e7f752a · IfStatement · next !== 'quiz' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (356행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 356행 | truthy: next !== 'quiz' | recordHelp()<br>call → [H-fe33c198fd10](ui__study-materials.md#h-fe33c198fd10) |
| 357행 | 별도 조건식 없음 | setTab(next)<br>state-update |

## H-f21792906210

**@callback:useEffectEvent** · [src/ui/study-materials.tsx:361](../../../src/ui/study-materials.tsx#L361)

분기 조건과 가능한 갈림길:

- B-16caea407d8e · IfStatement · !ready → truthy / falsy; 바깥 조건: 별도 조건식 없음 (362행).
- B-55c904760e4e · IfStatement · (tab === 'quiz' && !result?.quiz) || (tab === 'map' && !result?.map) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (363행).
- B-92650d9ba8fa · ConditionalExpression · answer === cardKey && cardKey → truthy / falsy; 바깥 조건: 별도 조건식 없음 (372행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 364행 | truthy: (tab === 'quiz' && !result?.quiz) \|\| (tab === 'map' && !result?.map) | setTab('summary')<br>state-update |
| 374행 | 별도 조건식 없음 | retain(current.current)<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |

반환/조기 중단: 362행 <render> [truthy: !ready]; 365행 <render> [truthy: (tab === 'quiz' && !result?.quiz) || (tab === 'map' && !result?.map)]

## H-a6c8301d5bdc

**@callback:useEffect** · [src/ui/study-materials.tsx:377](../../../src/ui/study-materials.tsx#L377)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 378행 | 별도 조건식 없음 | updateLearningView()<br>call |

## H-e0b3d48aa809

**@callback:useEffect** · [src/ui/study-materials.tsx:382](../../../src/ui/study-materials.tsx#L382)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 383행 | 별도 조건식 없음 | setEditingCard('')<br>state-update |
| 384행 | 별도 조건식 없음 | setSourceOpen(false)<br>state-update |

## H-f59c4ad6c4c6

**retain** · [src/ui/study-materials.tsx:388](../../../src/ui/study-materials.tsx#L388)

분기 조건과 가능한 갈림길:

- B-d7850d55338e · IfStatement · !loaded.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (392행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 389행 | 별도 조건식 없음 | structuredClone(viewState.current)<br>call |
| 391행 | 별도 조건식 없음 | setContent(next)<br>state-update |
| 396행 | 별도 조건식 없음 | structuredClone(viewState.current)<br>call |
| 401행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 404행 | 별도 조건식 없음 | setDraftState('pending')<br>state-update |
| 405행 | 별도 조건식 없음 | draftFlight.current<br>      .catch(() => undefined)<br>      .then(() => writeMaterialDraft(data, draftId, envelope))<br>      .then(() => { if (mounted.current && revision === draftRevision.current) setDraftState('saved'); })<br>preservation-boundary<br>전달 콜백: H-8030f2045a68 |
| 405행 | 별도 조건식 없음 | draftFlight.current<br>      .catch(() => undefined)<br>      .then(() => writeMaterialDraft(data, draftId, envelope))<br>preservation-boundary<br>전달 콜백: H-7e98746a7ba2 |
| 405행 | 별도 조건식 없음 | draftFlight.current<br>      .catch(() => undefined)<br>preservation-boundary<br>전달 콜백: H-6145f34262e3 |
| 411행 | 별도 조건식 없음 | draftFlight.current.catch((error) => { if (mounted.current && revision === draftRevision.current) { setDraftState('failed'); setError(message(error)); } })<br>preservation-boundary<br>전달 콜백: H-0cb38ff92f66 |

반환/조기 중단: 392행 <render> [truthy: !loaded.current]

## H-6145f34262e3

**@callback:draftFlight.current
      .catch** · [src/ui/study-materials.tsx:406](../../../src/ui/study-materials.tsx#L406)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7e98746a7ba2

**@callback:draftFlight.current
      .catch(() => undefined)
      .then** · [src/ui/study-materials.tsx:407](../../../src/ui/study-materials.tsx#L407)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 407행 | fulfilled-or-explicit-rejection-handler: draftFlight.current<br>      .catch(() => undefined) | writeMaterialDraft(data, draftId, envelope)<br>preservation-boundary |

## H-8030f2045a68

**@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then** · [src/ui/study-materials.tsx:408](../../../src/ui/study-materials.tsx#L408)

분기 조건과 가능한 갈림길:

- B-a54bbf7011bb · IfStatement · mounted.current && revision === draftRevision.current → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope)) (409행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 409행 | fulfilled-or-explicit-rejection-handler: draftFlight.current<br>      .catch(() => undefined)<br>      .then(() => writeMaterialDraft(data, draftId, envelope)) ∧ truthy: mounted.current && revision === draftRevision.current | setDraftState('saved')<br>state-update |

## H-0cb38ff92f66

**@callback:draftFlight.current.catch** · [src/ui/study-materials.tsx:411](../../../src/ui/study-materials.tsx#L411)

분기 조건과 가능한 갈림길:

- B-10c3d28319d5 · IfStatement · mounted.current && revision === draftRevision.current → truthy / falsy; 바깥 조건: rejected: draftFlight.current (412행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 413행 | rejected: draftFlight.current ∧ truthy: mounted.current && revision === draftRevision.current | setDraftState('failed')<br>state-update |
| 414행 | rejected: draftFlight.current ∧ truthy: mounted.current && revision === draftRevision.current | setError(message(error))<br>state-update |
| 414행 | rejected: draftFlight.current ∧ truthy: mounted.current && revision === draftRevision.current | message(error)<br>call → [H-41261534bb0c](ui__study-materials.md#h-41261534bb0c) |

## H-1b6b448ce9f3

**@callback:useEffectEvent** · [src/ui/study-materials.tsx:418](../../../src/ui/study-materials.tsx#L418)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 418행 | 별도 조건식 없음 | Boolean(selected)<br>call |

## H-9be2dc387e0e

**@callback:useEffectEvent** · [src/ui/study-materials.tsx:419](../../../src/ui/study-materials.tsx#L419)

분기 조건과 가능한 갈림길:

- B-0da80e47d92d · ConditionalExpression · selected → truthy / falsy; 바깥 조건: 별도 조건식 없음 (420행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 422행 | falsy: selected | repository.getSnapshot()<br>call |

## H-a588dccdabb7

**@callback:useEffect** · [src/ui/study-materials.tsx:425](../../../src/ui/study-materials.tsx#L425)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 427행 | 별도 조건식 없음 | readMaterialDraft(owner, draftId)<br>      .then((draft) => {<br>        if (!mounted.current) return;<br>        if (draft) {<br>          if (<br>            !draft.content \|\|<br>            !Array.isArray(draft.content.results) \|\|<br>            !Number.isSafeInteger(draft.baseVersion)<br>          )<br>            throw Error('보관된 자료 초안을 읽지 못했습니다. 원본은 덮어쓰지 않았습니다.');<br>          baseVersion.current = draft.baseVersion;<br>          if (!hasSelectedMaterial() && typeof draft.materialId === 'string' && draft.materialId)<br>            stableMaterialId.current = draft.materialId;<br>          recordingId.current = draft.recordingId ?? draft.audioCleanup?.recordingId;<br>          audioRecordingId.current = draft.audioRecordingId;<br>          audioCleanup.current = draft.audioCleanup;<br>          // Old cleanup drafts may hold the only reference to an existing recording.<br>          // Transcript entry keeps that original; it does not repeat or delete prior work.<br>          const restoredContent =<br>            draft.audioCleanup && !draft.content.audio<br>              ? { ...draft.content, audio: draft.audioCleanup.audio }<br>              : draft.content;<br>          current.current = restoredContent;<br>          setContent(restoredContent);<br>          const savedView = draft.view ?? draft.content.learningView;<br>          const at = savedView?.resultId<br>            ? draft.content.results.findIndex((r) => r.id === savedView.resultId)<br>            : -1;<br>          const selectedResult =<br>            draft.content.results[at >= 0 ? at : draft.content.results.length - 1];<br>          const selectedCards = selectedResult?.cards.filter((c) => !c.excluded) ?? [];<br>          const cardAt = selectedCards.findIndex((c) => c.id === savedView?.cardId);<br>          setResultIndex(at >= 0 ? at : Math.max(0, draft.content.results.length - 1));<br>          setCardIndex(Math.max(0, cardAt));<br>          if (savedView && Array.isArray(savedView.revealed) && Array.isArray(savedView.helped)) {<br>            viewState.current = savedView;<br>            if (['summary', 'transcript', 'cards', 'quiz', 'map'].includes(savedView.tab))<br>              setTab(savedView.tab);<br>            if (at >= 0 && cardAt >= 0 && savedView.activeDisclosure === 'revealed')<br>              setAnswer(`${selectedResult.id}:${selectedCards[cardAt].id}`);<br>          }<br>          const savedDraftVersion = currentDraftVersion();<br>          if (draft.baseVersion !== savedDraftVersion)<br>            setError(<br>              '다른 곳에서 저장한 자료와 이 초안을 모두 보존했습니다. 초안을 내보낸 뒤 최신 자료를 다시 열어 주세요.',<br>            );<br>          else setNotice('이 기기에 남겨 둔 초안을 불러왔습니다.');<br>          setRecovery(Boolean(draft.recordingId));<br>        }<br>        loaded.current = true;<br>        setReady(true);<br>      })<br>      .catch((error) => { if (mounted.current) setError(message(error)); })<br>preservation-boundary<br>전달 콜백: H-a73d5798cf2e |
| 427행 | 별도 조건식 없음 | readMaterialDraft(owner, draftId)<br>      .then((draft) => { if (!mounted.current) return; if (draft) { if ( !draft.content \|\| !Array.isArray(draft.content.results) \|\| !Number.isSafeInteger(draft.baseVersion) ) throw Error('보관된 자료 초안을 읽지 못했습니다. 원본은 덮어쓰지 않았습니다.'); baseVersion.current = draft.baseVersion; if (!hasSelectedMaterial() && typeof draft.materialId === 'string' && draft.materialId) stableMaterialId.current = draft.materialId; recordingId.current = draft.recordingId ?? draft.audioCleanup?.recordingId; audioRecordingId.current = draft.audioRecordingId; audioCleanup.current = draft.audioCleanup; // Old cleanup drafts may hold the only reference to an existing recording. // Transcript entry keeps that original; it does not repeat or d … [전체 인수는 JSON·소스])<br>preservation-boundary<br>전달 콜백: H-99f00ceb5bc1 |
| 427행 | 별도 조건식 없음 | readMaterialDraft(owner, draftId)<br>preservation-boundary |

반환/조기 중단: 482행 () => { mounted.current = false; generationController.current?.abort(); } [별도 조건식 없음]

## H-99f00ceb5bc1

**@callback:readMaterialDraft(owner, draftId)
      .then** · [src/ui/study-materials.tsx:428](../../../src/ui/study-materials.tsx#L428)

분기 조건과 가능한 갈림길:

- B-8e42d5d73248 · IfStatement · !mounted.current → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) (429행).
- B-6fd65274b204 · IfStatement · draft → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) (430행).
- B-a9524275c01a · IfStatement · !draft.content || !Array.isArray(draft.content.results) || !Number.isSafeInteger(draft.baseVersion) → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft (431행).
- B-bcdf04634e79 · IfStatement · !hasSelectedMaterial() && typeof draft.materialId === 'string' && draft.materialId → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft (438행).
- B-fa71d962c9ce · ConditionalExpression · draft.audioCleanup && !draft.content.audio → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft (446행).
- B-5f3c10e74140 · ConditionalExpression · savedView?.resultId → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft (452행).
- B-4ba6c0799a94 · ConditionalExpression · at >= 0 → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft (456행).
- B-7b1766196759 · ConditionalExpression · at >= 0 → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft (459행).
- B-e5d968036bd9 · IfStatement · savedView && Array.isArray(savedView.revealed) && Array.isArray(savedView.helped) → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft (461행).
- B-553b321713de · IfStatement · ['summary', 'transcript', 'cards', 'quiz', 'map'].includes(savedView.tab) → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft ∧ truthy: savedView && Array.isArray(savedView.revealed) && Array.isArray(savedView.helped) (463행).
- B-10959ee6af90 · IfStatement · at >= 0 && cardAt >= 0 && savedView.activeDisclosure === 'revealed' → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft ∧ truthy: savedView && Array.isArray(savedView.revealed) && Array.isArray(savedView.helped) (465행).
- B-86408be3ade1 · IfStatement · draft.baseVersion !== savedDraftVersion → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft (469행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 433행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft ∧ falsy: !draft.content | Array.isArray(draft.content.results)<br>call |
| 434행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft ∧ falsy: !draft.content \|\|<br>            !Array.isArray(draft.content.results) | Number.isSafeInteger(draft.baseVersion)<br>call |
| 436행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft ∧ truthy: !draft.content \|\|<br>            !Array.isArray(draft.content.results) \|\|<br>            !Number.isSafeInteger(draft.baseVersion) | Error('보관된 자료 초안을 읽지 못했습니다. 원본은 덮어쓰지 않았습니다.')<br>call |
| 438행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft | hasSelectedMaterial()<br>call |
| 450행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft | setContent(restoredContent)<br>state-update |
| 453행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft ∧ truthy: savedView?.resultId | draft.content.results.findIndex((r) => r.id === savedView.resultId)<br>preservation-boundary<br>전달 콜백: H-141407ebd99d |
| 458행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft | selectedCards.findIndex((c) => c.id === savedView?.cardId)<br>call<br>전달 콜백: H-f7ee8586ecda |
| 459행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft | setResultIndex(at >= 0 ? at : Math.max(0, draft.content.results.length - 1))<br>state-update |
| 459행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft ∧ falsy: at >= 0 | Math.max(0, draft.content.results.length - 1)<br>call |
| 460행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft | setCardIndex(Math.max(0, cardAt))<br>state-update |
| 460행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft | Math.max(0, cardAt)<br>call |
| 461행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft ∧ truthy: savedView | Array.isArray(savedView.revealed)<br>call |
| 461행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft ∧ truthy: savedView && Array.isArray(savedView.revealed) | Array.isArray(savedView.helped)<br>call |
| 463행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft ∧ truthy: savedView && Array.isArray(savedView.revealed) && Array.isArray(savedView.helped) | ['summary', 'transcript', 'cards', 'quiz', 'map'].includes(savedView.tab)<br>call |
| 464행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft ∧ truthy: savedView && Array.isArray(savedView.revealed) && Array.isArray(savedView.helped) ∧ truthy: ['summary', 'transcript', 'cards', 'quiz', 'map'].includes(savedView.tab) | setTab(savedView.tab)<br>state-update |
| 466행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft ∧ truthy: savedView && Array.isArray(savedView.revealed) && Array.isArray(savedView.helped) ∧ truthy: at >= 0 && cardAt >= 0 && savedView.activeDisclosure === 'revealed' | setAnswer(`${selectedResult.id}:${selectedCards[cardAt].id}`)<br>state-update |
| 468행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft | currentDraftVersion()<br>preservation-boundary |
| 470행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft ∧ truthy: draft.baseVersion !== savedDraftVersion | setError('다른 곳에서 저장한 자료와 이 초안을 모두 보존했습니다. 초안을 내보낸 뒤 최신 자료를 다시 열어 주세요.')<br>state-update |
| 473행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft ∧ falsy: draft.baseVersion !== savedDraftVersion | setNotice('이 기기에 남겨 둔 초안을 불러왔습니다.')<br>state-update |
| 474행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft | setRecovery(Boolean(draft.recordingId))<br>state-update |
| 474행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: draft | Boolean(draft.recordingId)<br>call |
| 477행 | fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) | setReady(true)<br>state-update |

반환/조기 중단: 429행 <render> [fulfilled-or-explicit-rejection-handler: readMaterialDraft(owner, draftId) ∧ truthy: !mounted.current]

throw: 436행 Error('보관된 자료 초안을 읽지 못했습니다. 원본은 덮어쓰지 않았습니다.')

## H-141407ebd99d

**@callback:draft.content.results.findIndex** · [src/ui/study-materials.tsx:453](../../../src/ui/study-materials.tsx#L453)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f7ee8586ecda

**@callback:selectedCards.findIndex** · [src/ui/study-materials.tsx:458](../../../src/ui/study-materials.tsx#L458)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a73d5798cf2e

**@callback:readMaterialDraft(owner, draftId)
      .then((draft) => {
        if (!mounted.current) return;
        if (draft) {
          if (
            !draft.content ||
            !Array.isArray(draft.content.results) ||
            !Number.isSafeInteger(draft.baseVersion)
          )
            throw Error('보관된 자료 초안을 읽지 못했습니다. 원본은 덮어쓰지 않았습니다.');
          baseVersion.current = draft.baseVersion;
          if (!hasSelectedMaterial() && typeof draft.materialId === 'string' && draft.materialId)
            stableMaterialId.current = draft.materialId;
          recordingId.current = draft.recordingId ?? draft.audioCleanup?.recordingId;
          audioRecordingId.current = draft.audioRecordingId;
          audioCleanup.current = draft.audioCleanup;
          // Old cleanup drafts may hold the only reference to an existing recording.
          // Transcript entry keeps that original; it does not repeat or delete prior work.
          const restoredContent =
            draft.audioCleanup && !draft.content.audio
              ? { ...draft.content, audio: draft.audioCleanup.audio }
              : draft.content;
          current.current = restoredContent;
          setContent(restoredContent);
          const savedView = draft.view ?? draft.content.learningView;
          const at = savedView?.resultId
            ? draft.content.results.findIndex((r) => r.id === savedView.resultId)
            : -1;
          const selectedResult =
            draft.content.results[at >= 0 ? at : draft.content.results.length - 1];
          const selectedCards = selectedResult?.cards.filter((c) => !c.excluded) ?? [];
          const cardAt = selectedCards.findIndex((c) => c.id === savedView?.cardId);
          setResultIndex(at >= 0 ? at : Math.max(0, draft.content.results.length - 1));
          setCardIndex(Math.max(0, cardAt));
          if (savedView && Array.isArray(savedView.revealed) && Array.isArray(savedView.helped)) {
            viewState.current = savedView;
            if (['summary', 'transcript', 'cards', 'quiz', 'map'].includes(savedView.tab))
              setTab(savedView.tab);
            if (at >= 0 && cardAt >= 0 && savedView.activeDisclosure === 'revealed')
              setAnswer(`${selectedResult.id}:${selectedCards[cardAt].id}`);
          }
          const savedDraftVersion = currentDraftVersion();
          if (draft.baseVersion !== savedDraftVersion)
            setError(
              '다른 곳에서 저장한 자료와 이 초안을 모두 보존했습니다. 초안을 내보낸 뒤 최신 자료를 다시 열어 주세요.',
            );
          else setNotice('이 기기에 남겨 둔 초안을 불러왔습니다.');
          setRecovery(Boolean(draft.recordingId));
        }
        loaded.current = true;
        setReady(true);
      })
      .catch** · [src/ui/study-materials.tsx:479](../../../src/ui/study-materials.tsx#L479)

분기 조건과 가능한 갈림길:

- B-c3f42cba4f11 · IfStatement · mounted.current → truthy / falsy; 바깥 조건: rejected: readMaterialDraft(owner, draftId)
      .then((draft) => {
        if (!mounted.current) return;
        if (draft) {
          if (
            !draft.content ||
            !Array.isArray(draft.content.results) ||
            !Number.isSafeInteger(draft.baseVersion)
          )
            throw Error('보관된 자료 초안을 읽지 못했습니다. 원본은 덮어쓰지 않았습니다.');
          baseVersion.current = draft.baseVersion;
          if (!hasSelectedMaterial() && typeof draft.materialId === 'string' && draft.materialId)
            stableMaterialId.current = draft.materialId;
          recordingId.current = draft.recordingId ?? draft.audioCleanup?.recordingId;
          audioRecordingId.current = draft.audioRecordingId;
          audioCleanup.current = draft.audioCleanup;
          // Old cleanup drafts may hold the only reference to an existing recording.
          // Transcript entry keeps that original; it does not repeat or delete prior work.
          const restoredContent =
            draft.audioCleanup && !draft.content.audio
              ? { ...draft.content, audio: draft.audioCleanup.audio }
              : draft.content;
          current.current = restoredContent;
          setContent(restoredContent);
          const savedView = draft.view ?? draft.content.learningView;
          const at = savedView?.resultId
            ? draft.content.results.findIndex((r) => r.id === savedView.resultId)
            : -1;
          const selectedResult =
            draft.content.results[at >= 0 ? at : draft.content.results.length - 1];
          const selectedCards = selectedResult?.cards.filter((c) => !c.excluded) ?? [];
          const cardAt = selectedCards.findIndex((c) => c.id === savedView?.cardId);
          setResultIndex(at >= 0 ? at : Math.max(0, draft.content.results.length - 1));
          setCardIndex(Math.max(0, cardAt));
          if (savedView && Array.isArray(savedView.revealed) && Array.isArray(savedView.helped)) {
            viewState.current = savedView;
            if (['summary', 'transcript', 'cards', 'quiz', 'map'].includes(savedView.tab))
              setTab(savedView.tab);
            if (at >= 0 && cardAt >= 0 && savedView.activeDisclosure === 'revealed')
              setAnswer(`${selectedResult.id}:${selectedCards[cardAt].id}`);
          }
          const savedDraftVersion = currentDraftVersion();
          if (draft.baseVersion !== savedDraftVersion)
            setError(
              '다른 곳에서 저장한 자료와 이 초안을 모두 보존했습니다. 초안을 내보낸 뒤 최신 자료를 다시 열어 주세요.',
            );
          else setNotice('이 기기에 남겨 둔 초안을 불러왔습니다.');
          setRecovery(Boolean(draft.recordingId));
        }
        loaded.current = true;
        setReady(true);
      }) (480행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 480행 | rejected: readMaterialDraft(owner, draftId)<br>      .then((draft) => {<br>        if (!mounted.current) return;<br>        if (draft) {<br>          if (<br>            !draft.content \|\|<br>            !Array.isArray(draft.content.results) \|\|<br>            !Number.isSafeInteger(draft.baseVersion)<br>          )<br>            throw Error('보관된 자료 초안을 읽지 못했습니다. 원본은 덮어쓰지 않았습니다.');<br>          baseVersion.current = draft.baseVersion;<br>          if (!hasSelectedMaterial() && typeof draft.materialId === 'string' && draft.materialId)<br>            stableMaterialId.current = draft.materialId;<br>          recordingId.current = draft.recordingId ?? draft.audioCleanup?.recordingId;<br>          audioRecordingId.current = draft.audioRecordingId;<br>          audioCleanup.current = draft.audioCleanup;<br>          // Old cleanup drafts may hold the only reference to an existing recording.<br>          // Transcript entry keeps that original; it does not repeat or delete prior work.<br>          const restoredContent =<br>            draft.audioCleanup && !draft.content.audio<br>              ? { ...draft.content, audio: draft.audioCleanup.audio }<br>              : draft.content;<br>          current.current = restoredContent;<br>          setContent(restoredContent);<br>          const savedView = draft.view ?? draft.content.learningView;<br>          const at = savedView?.resultId<br>            ? draft.content.results.findIndex((r) => r.id === savedView.resultId)<br>            : -1;<br>          const selectedResult =<br>            draft.content.results[at >= 0 ? at : draft.content.results.length - 1];<br>          const selectedCards = selectedResult?.cards.filter((c) => !c.excluded) ?? [];<br>          const cardAt = selectedCards.findIndex((c) => c.id === savedView?.cardId);<br>          setResultIndex(at >= 0 ? at : Math.max(0, draft.content.results.length - 1));<br>          setCardIndex(Math.max(0, cardAt));<br>          if (savedView && Array.isArray(savedView.revealed) && Array.isArray(savedView.helped)) {<br>            viewState.current = savedView;<br>            if (['summary', 'transcript', 'cards', 'quiz', 'map'].includes(savedView.tab))<br>              setTab(savedView.tab);<br>            if (at >= 0 && cardAt >= 0 && savedView.activeDisclosure === 'revealed')<br>              setAnswer(`${selectedResult.id}:${selectedCards[cardAt].id}`);<br>          }<br>          const savedDraftVersion = currentDraftVersion();<br>          if (draft.baseVersion !== savedDraftVersion)<br>            setError(<br>              '다른 곳에서 저장한 자료와 이 초안을 모두 보존했습니다. 초안을 내보낸 뒤 최신 자료를 다시 열어 주세요.',<br>            );<br>          else setNotice('이 기기에 남겨 둔 초안을 불러왔습니다.');<br>          setRecovery(Boolean(draft.recordingId));<br>        }<br>        loaded.current = true;<br>        setReady(true);<br>      }) ∧ truthy: mounted.current | setError(message(error))<br>state-update |
| 480행 | rejected: readMaterialDraft(owner, draftId)<br>      .then((draft) => {<br>        if (!mounted.current) return;<br>        if (draft) {<br>          if (<br>            !draft.content \|\|<br>            !Array.isArray(draft.content.results) \|\|<br>            !Number.isSafeInteger(draft.baseVersion)<br>          )<br>            throw Error('보관된 자료 초안을 읽지 못했습니다. 원본은 덮어쓰지 않았습니다.');<br>          baseVersion.current = draft.baseVersion;<br>          if (!hasSelectedMaterial() && typeof draft.materialId === 'string' && draft.materialId)<br>            stableMaterialId.current = draft.materialId;<br>          recordingId.current = draft.recordingId ?? draft.audioCleanup?.recordingId;<br>          audioRecordingId.current = draft.audioRecordingId;<br>          audioCleanup.current = draft.audioCleanup;<br>          // Old cleanup drafts may hold the only reference to an existing recording.<br>          // Transcript entry keeps that original; it does not repeat or delete prior work.<br>          const restoredContent =<br>            draft.audioCleanup && !draft.content.audio<br>              ? { ...draft.content, audio: draft.audioCleanup.audio }<br>              : draft.content;<br>          current.current = restoredContent;<br>          setContent(restoredContent);<br>          const savedView = draft.view ?? draft.content.learningView;<br>          const at = savedView?.resultId<br>            ? draft.content.results.findIndex((r) => r.id === savedView.resultId)<br>            : -1;<br>          const selectedResult =<br>            draft.content.results[at >= 0 ? at : draft.content.results.length - 1];<br>          const selectedCards = selectedResult?.cards.filter((c) => !c.excluded) ?? [];<br>          const cardAt = selectedCards.findIndex((c) => c.id === savedView?.cardId);<br>          setResultIndex(at >= 0 ? at : Math.max(0, draft.content.results.length - 1));<br>          setCardIndex(Math.max(0, cardAt));<br>          if (savedView && Array.isArray(savedView.revealed) && Array.isArray(savedView.helped)) {<br>            viewState.current = savedView;<br>            if (['summary', 'transcript', 'cards', 'quiz', 'map'].includes(savedView.tab))<br>              setTab(savedView.tab);<br>            if (at >= 0 && cardAt >= 0 && savedView.activeDisclosure === 'revealed')<br>              setAnswer(`${selectedResult.id}:${selectedCards[cardAt].id}`);<br>          }<br>          const savedDraftVersion = currentDraftVersion();<br>          if (draft.baseVersion !== savedDraftVersion)<br>            setError(<br>              '다른 곳에서 저장한 자료와 이 초안을 모두 보존했습니다. 초안을 내보낸 뒤 최신 자료를 다시 열어 주세요.',<br>            );<br>          else setNotice('이 기기에 남겨 둔 초안을 불러왔습니다.');<br>          setRecovery(Boolean(draft.recordingId));<br>        }<br>        loaded.current = true;<br>        setReady(true);<br>      }) ∧ truthy: mounted.current | message(error)<br>call → [H-41261534bb0c](ui__study-materials.md#h-41261534bb0c) |

## H-c854fc1f7944

**@callback:useEffect** · [src/ui/study-materials.tsx:488](../../../src/ui/study-materials.tsx#L488)

분기 조건과 가능한 갈림길:

- B-17b15d46e6ec · IfStatement · audioFile → truthy / falsy; 바깥 조건: 별도 조건식 없음 (493행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 491행 | 별도 조건식 없음 | setAudioURL('')<br>state-update |
| 492행 | 별도 조건식 없음 | setMissingAudio(false)<br>state-update |
| 494행 | truthy: audioFile | readAudio(owner, audioFile)<br>        .then((blob) => {<br>          if (disposed) return;<br>          if (!blob) {<br>            setMissingAudio(true);<br>            return;<br>          }<br>          url = URL.createObjectURL(blob);<br>          setAudioURL(url);<br>        })<br>        .catch((error) => { if (!disposed) setError(message(error)); })<br>call<br>전달 콜백: H-7195d506950d |
| 494행 | truthy: audioFile | readAudio(owner, audioFile)<br>        .then((blob) => { if (disposed) return; if (!blob) { setMissingAudio(true); return; } url = URL.createObjectURL(blob); setAudioURL(url); })<br>call<br>전달 콜백: H-9255d8634856 |
| 494행 | truthy: audioFile | readAudio(owner, audioFile)<br>call |

반환/조기 중단: 507행 () => { disposed = true; if (url) URL.revokeObjectURL(url); } [별도 조건식 없음]

## H-9255d8634856

**@callback:readAudio(owner, audioFile)
        .then** · [src/ui/study-materials.tsx:495](../../../src/ui/study-materials.tsx#L495)

분기 조건과 가능한 갈림길:

- B-d3a415dae4dc · IfStatement · disposed → truthy / falsy; 바깥 조건: truthy: audioFile ∧ fulfilled-or-explicit-rejection-handler: readAudio(owner, audioFile) (496행).
- B-5e0d99bbdd6e · IfStatement · !blob → truthy / falsy; 바깥 조건: truthy: audioFile ∧ fulfilled-or-explicit-rejection-handler: readAudio(owner, audioFile) (497행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 498행 | truthy: audioFile ∧ fulfilled-or-explicit-rejection-handler: readAudio(owner, audioFile) ∧ truthy: !blob | setMissingAudio(true)<br>state-update |
| 501행 | truthy: audioFile ∧ fulfilled-or-explicit-rejection-handler: readAudio(owner, audioFile) | URL.createObjectURL(blob)<br>call |
| 502행 | truthy: audioFile ∧ fulfilled-or-explicit-rejection-handler: readAudio(owner, audioFile) | setAudioURL(url)<br>state-update |

반환/조기 중단: 496행 <render> [truthy: audioFile ∧ fulfilled-or-explicit-rejection-handler: readAudio(owner, audioFile) ∧ truthy: disposed]; 499행 <render> [truthy: audioFile ∧ fulfilled-or-explicit-rejection-handler: readAudio(owner, audioFile) ∧ truthy: !blob]

## H-7195d506950d

**@callback:readAudio(owner, audioFile)
        .then((blob) => {
          if (disposed) return;
          if (!blob) {
            setMissingAudio(true);
            return;
          }
          url = URL.createObjectURL(blob);
          setAudioURL(url);
        })
        .catch** · [src/ui/study-materials.tsx:504](../../../src/ui/study-materials.tsx#L504)

분기 조건과 가능한 갈림길:

- B-9954af8b2721 · IfStatement · !disposed → truthy / falsy; 바깥 조건: truthy: audioFile ∧ rejected: readAudio(owner, audioFile)
        .then((blob) => {
          if (disposed) return;
          if (!blob) {
            setMissingAudio(true);
            return;
          }
          url = URL.createObjectURL(blob);
          setAudioURL(url);
        }) (505행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 505행 | truthy: audioFile ∧ rejected: readAudio(owner, audioFile)<br>        .then((blob) => {<br>          if (disposed) return;<br>          if (!blob) {<br>            setMissingAudio(true);<br>            return;<br>          }<br>          url = URL.createObjectURL(blob);<br>          setAudioURL(url);<br>        }) ∧ truthy: !disposed | setError(message(error))<br>state-update |
| 505행 | truthy: audioFile ∧ rejected: readAudio(owner, audioFile)<br>        .then((blob) => {<br>          if (disposed) return;<br>          if (!blob) {<br>            setMissingAudio(true);<br>            return;<br>          }<br>          url = URL.createObjectURL(blob);<br>          setAudioURL(url);<br>        }) ∧ truthy: !disposed | message(error)<br>call → [H-41261534bb0c](ui__study-materials.md#h-41261534bb0c) |

## H-5772bf2dff35

**@callback:useEffect** · [src/ui/study-materials.tsx:512](../../../src/ui/study-materials.tsx#L512)

분기 조건과 가능한 갈림길:

- B-029e9bb4985f · IfStatement · !timed.length || (result?.source && result.source.audio?.sha256 !== audioFile?.sha256) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (515행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 516행 | truthy: !timed.length \|\| (result?.source && result.source.audio?.sha256 !== audioFile?.sha256) | setCaptionURL('')<br>state-update |
| 520행 | 별도 조건식 없음 | timed.map((segment) => `${timestamp(segment.start ?? 0)} --> ${timestamp(segment.end ?? 0)}\n${segment.text}`).join('\n\n')<br>call |
| 520행 | 별도 조건식 없음 | timed.map((segment) => `${timestamp(segment.start ?? 0)} --> ${timestamp(segment.end ?? 0)}\n${segment.text}`)<br>call<br>전달 콜백: H-7925f1b7616c |
| 521행 | 별도 조건식 없음 | URL.createObjectURL(new Blob([vtt], { type: 'text/vtt' }))<br>call |
| 522행 | 별도 조건식 없음 | setCaptionURL(url)<br>state-update |

반환/조기 중단: 517행 <render> [truthy: !timed.length || (result?.source && result.source.audio?.sha256 !== audioFile?.sha256)]; 523행 () => URL.revokeObjectURL(url) [별도 조건식 없음]

## H-e3790521e2db

**timestamp** · [src/ui/study-materials.tsx:519](../../../src/ui/study-materials.tsx#L519)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 519행 | 별도 조건식 없음 | new Date(seconds * 1000).toISOString().slice(11, 23)<br>call |
| 519행 | 별도 조건식 없음 | new Date(seconds * 1000).toISOString()<br>call |

## H-7925f1b7616c

**@callback:timed.map** · [src/ui/study-materials.tsx:520](../../../src/ui/study-materials.tsx#L520)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 520행 | 별도 조건식 없음 | timestamp(segment.start ?? 0)<br>call → [H-e3790521e2db](ui__study-materials.md#h-e3790521e2db) |
| 520행 | 별도 조건식 없음 | timestamp(segment.end ?? 0)<br>call → [H-e3790521e2db](ui__study-materials.md#h-e3790521e2db) |

## H-f3cd82d410e9

**@callback:useEffect** · [src/ui/study-materials.tsx:525](../../../src/ui/study-materials.tsx#L525)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 555행 | 별도 조건식 없음 | window.addEventListener('click', leave, true)<br>call<br>전달 콜백: H-85da2e52a121 |
| 556행 | 별도 조건식 없음 | window.addEventListener('beforeunload', before)<br>call<br>전달 콜백: H-8d459f298506 |

반환/조기 중단: 557행 () => { window.removeEventListener('click', leave, true); window.removeEventListener('beforeunload', before); } [별도 조건식 없음]

## H-8d459f298506

**before** · [src/ui/study-materials.tsx:526](../../../src/ui/study-materials.tsx#L526)

분기 조건과 가능한 갈림길:

- B-125ff9c31fea · IfStatement · busy || importing || draftState !== 'saved' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (527행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 528행 | truthy: busy \|\| importing \|\| draftState !== 'saved' | event.preventDefault()<br>input-control |

## H-85da2e52a121

**leave** · [src/ui/study-materials.tsx:532](../../../src/ui/study-materials.tsx#L532)

분기 조건과 가능한 갈림길:

- B-13dd84786dc6 · ConditionalExpression · event.target instanceof Element → truthy / falsy; 바깥 조건: 별도 조건식 없음 (533행).
- B-a17199975938 · IfStatement · !href?.startsWith('#/') || draftState === 'saved' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (535행).
- B-2eee1bc9e8cc · IfStatement · draftState === 'failed' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (536행).
- B-16fe242b4e07 · IfStatement · !window.confirm( '이 기기에 저장되지 않은 변경이 있습니다. 내보내기나 초안 저장 재시도 후 나갈 수 있습니다. 지금 나가시겠습니까?', ) → truthy / falsy; 바깥 조건: truthy: draftState === 'failed' (537행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 533행 | truthy: event.target instanceof Element | event.target.closest('a[href]')<br>call |
| 538행 | truthy: draftState === 'failed' | window.confirm('이 기기에 저장되지 않은 변경이 있습니다. 내보내기나 초안 저장 재시도 후 나갈 수 있습니다. 지금 나가시겠습니까?')<br>call |
| 542행 | truthy: draftState === 'failed' ∧ truthy: !window.confirm(<br>            '이 기기에 저장되지 않은 변경이 있습니다. 내보내기나 초안 저장 재시도 후 나갈 수 있습니다. 지금 나가시겠습니까?',<br>          ) | event.preventDefault()<br>input-control |
| 543행 | truthy: draftState === 'failed' ∧ truthy: !window.confirm(<br>            '이 기기에 저장되지 않은 변경이 있습니다. 내보내기나 초안 저장 재시도 후 나갈 수 있습니다. 지금 나가시겠습니까?',<br>          ) | event.stopPropagation()<br>input-control |
| 546행 | falsy: draftState === 'failed' | event.preventDefault()<br>input-control |
| 547행 | falsy: draftState === 'failed' | event.stopPropagation()<br>input-control |
| 548행 | falsy: draftState === 'failed' | draftFlight.current<br>          .then(() => {<br>            location.hash = href;<br>          })<br>          .catch(() => undefined)<br>preservation-boundary<br>전달 콜백: H-3e6de3139cfc |
| 548행 | falsy: draftState === 'failed' | draftFlight.current<br>          .then(() => { location.hash = href; })<br>preservation-boundary<br>전달 콜백: H-6275025848fe |

반환/조기 중단: 535행 <render> [truthy: !href?.startsWith('#/') || draftState === 'saved']

## H-6275025848fe

**@callback:draftFlight.current
          .then** · [src/ui/study-materials.tsx:549](../../../src/ui/study-materials.tsx#L549)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3e6de3139cfc

**@callback:draftFlight.current
          .then(() => {
            location.hash = href;
          })
          .catch** · [src/ui/study-materials.tsx:552](../../../src/ui/study-materials.tsx#L552)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9ce20acb18fd

**analyze** · [src/ui/study-materials.tsx:562](../../../src/ui/study-materials.tsx#L562) · async

분기 조건과 가능한 갈림길:

- B-3bf550d6373a · IfStatement · !aiAllowed || generationFlight.current || busy || importing → truthy / falsy; 바깥 조건: 별도 조건식 없음 (563행).
- B-48b77a59ded9 · IfStatement · canonicalStudyTask(source.aiRequest?.task ?? 'summary') === 'tutor' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (564행).
- B-3852be7f91d5 · IfStatement · source.results.length >= 30 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (568행).
- B-c4fb84cf0674 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (580행).
- B-30931b8f757d · IfStatement · !source.subjectId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (581행).
- B-e5dadccfc931 · IfStatement · source.aiRequest → truthy / falsy; 바깥 조건: 별도 조건식 없음 (582행).
- B-5f92b4795d66 · IfStatement · !mounted.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (587행).
- B-2f0ee4e65d6d · IfStatement · result?.quiz && current.current.quizAttempts?.some((a) => a.resultId === result.id && !a.submittedAt) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (601행).
- B-5caf07a7f2f0 · ConditionalExpression · generated.range → truthy / falsy; 바깥 조건: 별도 조건식 없음 (609행).
- B-15567119424c · ConditionalExpression · current.current.generationProgress?.sourceIdentity === generated.range.sourceIdentity → truthy / falsy; 바깥 조건: truthy: generated.range (615행).
- B-4495dc94e181 · ConditionalExpression · !generated.diagnostics?.length → truthy / falsy; 바깥 조건: truthy: generated.range (619행).
- B-0e607581e20a · ConditionalExpression · generated.request?.task === 'study-pack' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (634행).
- B-281476a1601f · ConditionalExpression · generated.quiz → truthy / falsy; 바깥 조건: falsy: generated.request?.task === 'study-pack' (636행).
- B-d44a90442511 · ConditionalExpression · generated.map → truthy / falsy; 바깥 조건: falsy: generated.request?.task === 'study-pack' ∧ falsy: generated.quiz (638행).
- B-cd6b6f03a7b4 · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (644행).
- B-0a1022565939 · IfStatement · mounted.current → truthy / falsy; 바깥 조건: exception: error (645행).
- B-c9cd170c99ee · IfStatement · controller.signal.aborted → truthy / falsy; 바깥 조건: exception: error ∧ truthy: mounted.current (646행).
- B-4e80084ec993 · IfStatement · generationController.current === controller → truthy / falsy; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (658행).
- B-800f7c53c16d · IfStatement · mounted.current → truthy / falsy; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (659행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 564행 | 별도 조건식 없음 | canonicalStudyTask(source.aiRequest?.task ?? 'summary')<br>call |
| 565행 | truthy: canonicalStudyTask(source.aiRequest?.task ?? 'summary') === 'tutor' | setError('새 결과를 만들려면 다른 GPT 작업을 골라 주세요. 이전 질문과 답변은 보관했습니다.')<br>state-update |
| 569행 | truthy: source.results.length >= 30 | setError('이 자료의 생성 결과 30개를 모두 보관했습니다. 내보내거나 새 자료에 필요한 원문을 넣어 이어가 주세요.')<br>state-update |
| 577행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 578행 | 별도 조건식 없음 | setError('')<br>state-update |
| 579행 | 별도 조건식 없음 | setNotice('원본을 보관하고 요청한 결과를 만들고 있습니다.')<br>state-update |
| 581행 | truthy: !source.subjectId | Error('자료를 모아 둘 과목을 먼저 골라 주세요.')<br>call |
| 582행 | truthy: source.aiRequest | validateStudyAIRequest(activeStudyAIRequest(source.aiRequest))<br>call |
| 582행 | truthy: source.aiRequest | activeStudyAIRequest(source.aiRequest)<br>call |
| 584행 | 별도 조건식 없음 | controller.signal.throwIfAborted()<br>call |
| 585행 | 별도 조건식 없음 | generateStudyMaterial(data, source, count, controller.signal)<br>call |
| 586행 | 별도 조건식 없음 | controller.signal.throwIfAborted()<br>call |
| 588행 | truthy: !mounted.current | readMaterialDraft(data, draftId)<br>preservation-boundary |
| 589행 | truthy: !mounted.current | writeMaterialDraft(data, draftId, { materialId: stableMaterialId.current, content: { ...(latest?.content ?? source), results: [...(latest?.content.results ?? source.results), generated], }, baseVersion: latest?.baseVersion ?? baseVersion.current, updatedAt: new Date().toISOString(), })<br>preservation-boundary |
| 596행 | truthy: !mounted.current | new Date().toISOString()<br>call |
| 605행 | truthy: result?.quiz &&<br>        current.current.quizAttempts?.some((a) => a.resultId === result.id && !a.submittedAt) | recordHelp()<br>call → [H-fe33c198fd10](ui__study-materials.md#h-fe33c198fd10) |
| 627행 | 별도 조건식 없음 | setEditingCard('')<br>state-update |
| 628행 | 별도 조건식 없음 | retain(next)<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |
| 629행 | 별도 조건식 없음 | setResultIndex(next.results.length - 1)<br>state-update |
| 630행 | 별도 조건식 없음 | setCardIndex(0)<br>state-update |
| 631행 | 별도 조건식 없음 | setAnswer('')<br>state-update |
| 632행 | 별도 조건식 없음 | setEditingResult(false)<br>state-update |
| 633행 | 별도 조건식 없음 | setTab(generated.request?.task === 'study-pack' ? 'summary' : generated.quiz ? 'quiz' : generated.map ? 'map' : 'summary')<br>state-update |
| 643행 | 별도 조건식 없음 | setNotice('결과를 만들었습니다. 근거를 확인하고 자료 저장을 눌러 주세요.')<br>state-update |
| 647행 | exception: error ∧ truthy: mounted.current ∧ truthy: controller.signal.aborted | setError('')<br>state-update |
| 648행 | exception: error ∧ truthy: mounted.current ∧ truthy: controller.signal.aborted | setNotice('정리를 중단했습니다. 원본과 기존 결과는 보관했습니다. 이미 처리된 사용량은 반환되지 않을 수 있습니다.')<br>state-update |
| 652행 | exception: error ∧ truthy: mounted.current ∧ falsy: controller.signal.aborted | setError(message(error))<br>state-update |
| 652행 | exception: error ∧ truthy: mounted.current ∧ falsy: controller.signal.aborted | message(error)<br>call → [H-41261534bb0c](ui__study-materials.md#h-41261534bb0c) |
| 653행 | exception: error ∧ truthy: mounted.current ∧ falsy: controller.signal.aborted | setNotice('')<br>state-update |
| 659행 | always-after-try: try 완료 또는 예외 이후 ∧ truthy: mounted.current | setBusy(false)<br>state-update |

반환/조기 중단: 563행 <render> [truthy: !aiAllowed || generationFlight.current || busy || importing]; 566행 <render> [truthy: canonicalStudyTask(source.aiRequest?.task ?? 'summary') === 'tutor']; 572행 <render> [truthy: source.results.length >= 30]; 598행 <render> [truthy: !mounted.current]

throw: 581행 Error('자료를 모아 둘 과목을 먼저 골라 주세요.')

## H-4da9b761119b

**recover** · [src/ui/study-materials.tsx:662](../../../src/ui/study-materials.tsx#L662) · async

분기 조건과 가능한 갈림길:

- B-5e5eebe5ed57 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (663행).
- B-d38fd518eae8 · IfStatement · !recordingId.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (664행).
- B-0c25c943c691 · IfStatement · !blob → truthy / falsy; 바깥 조건: 별도 조건식 없음 (666행).
- B-048af609f9c7 · ConditionalExpression · blob.type.includes('mp4') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (671행).
- B-b248c7970b5a · ConditionalExpression · blob.type.includes('ogg') → truthy / falsy; 바깥 조건: falsy: blob.type.includes('mp4') (671행).
- B-dda478f70249 · CatchClause · cause → exception; 바깥 조건: 별도 조건식 없음 (674행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 665행 | 별도 조건식 없음 | recoverRecording(data, recordingId.current)<br>call |
| 667행 | truthy: !blob | Error('이 기기에 이전 녹음 구간이 없습니다. 원본을 보관한 기기에서 확인해 주세요.')<br>call |
| 668행 | 별도 조건식 없음 | URL.createObjectURL(blob)<br>call |
| 669행 | 별도 조건식 없음 | document.createElement('a')<br>call |
| 671행 | 별도 조건식 없음 | blob.type.includes('mp4')<br>call |
| 671행 | falsy: blob.type.includes('mp4') | blob.type.includes('ogg')<br>call |
| 672행 | 별도 조건식 없음 | link.click()<br>call |
| 673행 | 별도 조건식 없음 | setTimeout(() => URL.revokeObjectURL(url), 60_000)<br>state-update<br>전달 콜백: H-cde9c6dde90a |
| 675행 | exception: cause | setError(message(cause))<br>state-update |
| 675행 | exception: cause | message(cause)<br>call → [H-41261534bb0c](ui__study-materials.md#h-41261534bb0c) |

반환/조기 중단: 664행 <render> [truthy: !recordingId.current]

throw: 667행 Error('이 기기에 이전 녹음 구간이 없습니다. 원본을 보관한 기기에서 확인해 주세요.')

## H-cde9c6dde90a

**@callback:setTimeout** · [src/ui/study-materials.tsx:673](../../../src/ui/study-materials.tsx#L673)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 673행 | 별도 조건식 없음 | URL.revokeObjectURL(url)<br>call |

## H-4eec818739ff

**save** · [src/ui/study-materials.tsx:678](../../../src/ui/study-materials.tsx#L678) · async

분기 조건과 가능한 갈림길:

- B-94c14610d55c · IfStatement · savingFlight.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (679행).
- B-683766567d44 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (682행).
- B-4f10e9a761bc · IfStatement · !capable → truthy / falsy; 바깥 조건: 별도 조건식 없음 (684행).
- B-193d8c4192b7 · IfStatement · data.namespace === 'personal' && current.current.originalStorage === 'private-server' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (689행).
- B-5311f5e927a7 · IfStatement · !doc.file || doc.file.cloudPath → truthy / falsy; 바깥 조건: truthy: data.namespace === 'personal' && current.current.originalStorage === 'private-server' (691행).
- B-7dc64ea61a3e · IfStatement · !blob → truthy / falsy; 바깥 조건: truthy: data.namespace === 'personal' && current.current.originalStorage === 'private-server' (694행).
- B-a2375d422017 · ConditionalExpression · unchanged → truthy / falsy; 바깥 조건: 별도 조건식 없음 (713행).
- B-e7402a1f0659 · IfStatement · !saved → truthy / falsy; 바깥 조건: 별도 조건식 없음 (723행).
- B-5a9e19bfe8c2 · IfStatement · data.namespace !== 'demo' && status && (status.phase !== 'saved' || status.pending) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (731행).
- B-0d39895ca076 · IfStatement · recordingId.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (734행).
- B-8e08caff7b73 · IfStatement · legacyDraft → truthy / falsy; 바깥 조건: truthy: recordingId.current (736행).
- B-90fcabbed89a · IfStatement · draftId !== id → truthy / falsy; 바깥 조건: truthy: recordingId.current (737행).
- B-87a4af5c02ed · ConditionalExpression · data.namespace === 'demo' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (740행).
- B-10e03aa32a0e · ConditionalExpression · status → truthy / falsy; 바깥 조건: falsy: data.namespace === 'demo' (742행).
- B-4464944d9129 · IfStatement · !selected → truthy / falsy; 바깥 조건: 별도 조건식 없음 (746행).
- B-304a1a98d554 · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (748행).
- B-948aaf2c8bd1 · IfStatement · mounted.current → truthy / falsy; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (753행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 681행 | 별도 조건식 없음 | setSaving(true)<br>state-update |
| 683행 | 별도 조건식 없음 | setError('')<br>state-update |
| 685행 | truthy: !capable | Error('자료를 서버에 저장할 연결이 아직 없습니다. 초안과 원본은 이 기기에 보관했습니다.')<br>call |
| 692행 | truthy: data.namespace === 'personal' && current.current.originalStorage === 'private-server' | setNotice(`${doc.name} 원본을 비공개로 서버에 보관하고 있습니다.`)<br>state-update |
| 693행 | truthy: data.namespace === 'personal' && current.current.originalStorage === 'private-server' | readDocumentFile(owner, doc.file)<br>call |
| 695행 | truthy: data.namespace === 'personal' && current.current.originalStorage === 'private-server' ∧ truthy: !blob | Error(`${doc.name} 원본이 이 기기에 없습니다. 같은 파일을 다시 가져와 주세요.`)<br>call |
| 696행 | truthy: data.namespace === 'personal' && current.current.originalStorage === 'private-server' | uploadMaterialFile(owner, 'document', doc.file, blob)<br>call |
| 697행 | truthy: data.namespace === 'personal' && current.current.originalStorage === 'private-server' | retain({ ...current.current, documents: current.current.documents?.map((row) => row.id === doc.id ? { ...row, file } : row, ), })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |
| 707행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 712행 | truthy: existing?.version === baseVersion.current | JSON.stringify(materialContent(existing))<br>call |
| 712행 | truthy: existing?.version === baseVersion.current | materialContent(existing)<br>call |
| 712행 | truthy: existing?.version === baseVersion.current | JSON.stringify(saveContent)<br>call |
| 715행 | falsy: unchanged | repository.execute({ type: 'saveStudyMaterial', id, expectedVersion: baseVersion.current, content: saveContent, ...context(data), })<br>call |
| 720행 | falsy: unchanged | context(data)<br>call → [H-3a866d502ecc](ui__study-materials.md#h-3a866d502ecc) |
| 723행 | truthy: !saved | Error('저장한 자료를 확인하지 못했습니다. 초안은 유지했습니다.')<br>call |
| 724행 | 별도 조건식 없음 | onSaved(next)<br>call |
| 726행 | 별도 조건식 없음 | retain(current.current)<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |
| 732행 | truthy: data.namespace !== 'demo' && status && (status.phase !== 'saved' \|\| status.pending) | Error(status.message \|\| '서버 저장을 확인하지 못했습니다. 초안은 유지했습니다.')<br>call |
| 735행 | truthy: recordingId.current | readMaterialDraft(owner, draftId)<br>preservation-boundary |
| 736행 | truthy: recordingId.current ∧ truthy: legacyDraft | writeMaterialDraft(owner, id, legacyDraft)<br>preservation-boundary |
| 737행 | truthy: recordingId.current ∧ truthy: draftId !== id | clearMaterialDraft(data, draftId)<br>preservation-boundary |
| 738행 | falsy: recordingId.current | clearMaterialDraft(data, draftId)<br>preservation-boundary |
| 739행 | 별도 조건식 없음 | setNotice(data.namespace === 'demo' ? '자료를 이 기기에 저장했습니다.' : status ? '자료를 서버에 저장했습니다.' : '자료를 기기에 저장했습니다. 서버 저장은 별도로 확인해 주세요.')<br>state-update |
| 746행 | truthy: !selected | navigate(`/materials/${id}`)<br>navigation |
| 749행 | exception: error | setError(message(error))<br>state-update |
| 749행 | exception: error | message(error)<br>call → [H-41261534bb0c](ui__study-materials.md#h-41261534bb0c) |
| 753행 | always-after-try: try 완료 또는 예외 이후 ∧ truthy: mounted.current | setSaving(false)<br>state-update |

반환/조기 중단: 679행 false [truthy: savingFlight.current]; 747행 true [별도 조건식 없음]; 750행 false [exception: error]

throw: 685행 Error( '자료를 서버에 저장할 연결이 아직 없습니다. 초안과 원본은 이 기기에 보관했습니다.', ); 695행 Error(`${doc.name} 원본이 이 기기에 없습니다. 같은 파일을 다시 가져와 주세요.`); 723행 Error('저장한 자료를 확인하지 못했습니다. 초안은 유지했습니다.'); 732행 Error(status.message || '서버 저장을 확인하지 못했습니다. 초안은 유지했습니다.')

## H-b2efbd9066d5

**evidence** · [src/ui/study-materials.tsx:756](../../../src/ui/study-materials.tsx#L756)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 759행 | 별도 조건식 없음 | ids.map((id) => { const segment = result?.segments.find((row) => row.id === id); return ( <Button key={id} variant="quiet" onClick={() => { chooseTab('transcript'); if ( segment?.start !== null && segment?.start !== undefined && !segment.label && (!result?.source \|\| result.source.audio?.sha256 === content.audio?.sha256) && audioElement.current ) { audioElement.current.currentTime = segment.start; void audioElement.current.play().catch(() => undefined); } setTimeout( () => document .getElementById(`material-segment-${id}`) ?.scrollIntoView({ block: 'nearest' }), 0, ); }} > {sourceRole(segment ?? { id, text: '', start: null, end: null }) !== 'material' ? SOURCE_ROLE_LABELS[sourceRole(segment!)] : segm … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-9ae0dfcd267c |

반환/조기 중단: 757행 <render> [별도 조건식 없음]

## H-9ae0dfcd267c

**@callback:ids.map** · [src/ui/study-materials.tsx:759](../../../src/ui/study-materials.tsx#L759)

분기 조건과 가능한 갈림길:

- B-c7af8cf65ce2 · ConditionalExpression · sourceRole(segment ?? { id, text: '', start: null, end: null }) !== 'material' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (786행).
- B-ec1a04b76443 · ConditionalExpression · segment?.label → truthy / falsy; 바깥 조건: falsy: sourceRole(segment ?? { id, text: '', start: null, end: null }) !== 'material' (788행).
- B-5ce28d64b119 · ConditionalExpression · segment?.start != null → truthy / falsy; 바깥 조건: falsy: sourceRole(segment ?? { id, text: '', start: null, end: null }) !== 'material' ∧ falsy: segment?.label (790행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 786행 | 별도 조건식 없음 | sourceRole(segment ?? { id, text: '', start: null, end: null })<br>call |
| 787행 | truthy: sourceRole(segment ?? { id, text: '', start: null, end: null }) !== 'material' | sourceRole(segment!)<br>call |
| 791행 | falsy: sourceRole(segment ?? { id, text: '', start: null, end: null }) !== 'material' ∧ falsy: segment?.label ∧ truthy: segment?.start != null | clock(segment.start)<br>call → [H-d84d5668468a](ui__study-materials.md#h-d84d5668468a) |

반환/조기 중단: 761행 <render> [별도 조건식 없음]

## H-1e8c458ef02a

**@onClick** · [src/ui/study-materials.tsx:765](../../../src/ui/study-materials.tsx#L765)

분기 조건과 가능한 갈림길:

- B-2c0e05108d0e · IfStatement · segment?.start !== null && segment?.start !== undefined && !segment.label && (!result?.source || result.source.audio?.sha256 === content.audio?.sha256) && audioElement.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (767행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 766행 | 별도 조건식 없음 | chooseTab('transcript')<br>call → [H-a42db4836e82](ui__study-materials.md#h-a42db4836e82) |
| 775행 | truthy: segment?.start !== null &&<br>                  segment?.start !== undefined &&<br>                  !segment.label &&<br>                  (!result?.source \|\| result.source.audio?.sha256 === content.audio?.sha256) &&<br>                  audioElement.current | audioElement.current.play().catch(() => undefined)<br>call<br>전달 콜백: H-d4bcb8d76178 |
| 775행 | truthy: segment?.start !== null &&<br>                  segment?.start !== undefined &&<br>                  !segment.label &&<br>                  (!result?.source \|\| result.source.audio?.sha256 === content.audio?.sha256) &&<br>                  audioElement.current | audioElement.current.play()<br>call |
| 777행 | 별도 조건식 없음 | setTimeout(() => document .getElementById(`material-segment-${id}`) ?.scrollIntoView({ block: 'nearest' }), 0)<br>state-update<br>전달 콜백: H-15ddd4634f94 |

## H-d4bcb8d76178

**@callback:audioElement.current.play().catch** · [src/ui/study-materials.tsx:775](../../../src/ui/study-materials.tsx#L775)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-15ddd4634f94

**@callback:setTimeout** · [src/ui/study-materials.tsx:778](../../../src/ui/study-materials.tsx#L778)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 779행 | 별도 조건식 없음 | document<br>                      .getElementById(`material-segment-${id}`)<br>call |

## H-e9e5de6e4920

**updateCard** · [src/ui/study-materials.tsx:799](../../../src/ui/study-materials.tsx#L799)

분기 조건과 가능한 갈림길:

- B-1033a9245b69 · IfStatement · !result || !card → truthy / falsy; 바깥 조건: 별도 조건식 없음 (800행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 801행 | 별도 조건식 없음 | retain({ ...content, results: content.results.map((row) => row.id === result.id ? { ...row, cards: row.cards.map((item) => item.id === card.id ? { ...item, ...patch, originalQuestion: item.originalQuestion ?? item.question, originalAnswer: item.originalAnswer ?? item.answer, } : item, ), } : row, ), })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |
| 803행 | 별도 조건식 없음 | content.results.map((row) => row.id === result.id ? { ...row, cards: row.cards.map((item) => item.id === card.id ? { ...item, ...patch, originalQuestion: item.originalQuestion ?? item.question, originalAnswer: item.originalAnswer ?? item.answer, } : item, ), } : row)<br>call<br>전달 콜백: H-07d55512df34 |

반환/조기 중단: 800행 <render> [truthy: !result || !card]

## H-07d55512df34

**@callback:content.results.map** · [src/ui/study-materials.tsx:803](../../../src/ui/study-materials.tsx#L803)

분기 조건과 가능한 갈림길:

- B-03a4c77472e3 · ConditionalExpression · row.id === result.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (804행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 807행 | truthy: row.id === result.id | row.cards.map((item) => item.id === card.id ? { ...item, ...patch, originalQuestion: item.originalQuestion ?? item.question, originalAnswer: item.originalAnswer ?? item.answer, } : item)<br>call<br>전달 콜백: H-c842d5497d46 |

## H-c842d5497d46

**@callback:row.cards.map** · [src/ui/study-materials.tsx:807](../../../src/ui/study-materials.tsx#L807)

분기 조건과 가능한 갈림길:

- B-4d4fa7767d7e · ConditionalExpression · item.id === card.id → truthy / falsy; 바깥 조건: truthy: row.id === result.id (808행).

## H-3c526cba79c6

**exportText** · [src/ui/study-materials.tsx:822](../../../src/ui/study-materials.tsx#L822)

분기 조건과 가능한 갈림길:

- B-69722a51a27a · IfStatement · format === 'md' && !result → truthy / falsy; 바깥 조건: 별도 조건식 없음 (823행).
- B-ab9b0a98d4a2 · ConditionalExpression · format === 'txt' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (826행).
- B-769164d0dba1 · ConditionalExpression · format === 'txt' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (831행).
- B-fb48a2942631 · ConditionalExpression · format === 'txt' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (836행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 824행 | 별도 조건식 없음 | recordHelp()<br>call → [H-fe33c198fd10](ui__study-materials.md#h-fe33c198fd10) |
| 827행 | truthy: format === 'txt' | materialTranscriptText(current.current)<br>call |
| 828행 | falsy: format === 'txt' | materialReviewMarkdown(current.current, result!)<br>call |
| 829행 | 별도 조건식 없음 | URL.createObjectURL(new Blob([text], { type: format === 'txt' ? 'text/plain;charset=utf-8' : 'text/markdown;charset=utf-8', }))<br>call |
| 834행 | 별도 조건식 없음 | document.createElement('a')<br>call |
| 837행 | 별도 조건식 없음 | link.click()<br>call |
| 838행 | 별도 조건식 없음 | setTimeout(() => URL.revokeObjectURL(url), 1000)<br>state-update<br>전달 콜백: H-a6494480ef08 |

반환/조기 중단: 823행 <render> [truthy: format === 'md' && !result]

## H-a6494480ef08

**@callback:setTimeout** · [src/ui/study-materials.tsx:838](../../../src/ui/study-materials.tsx#L838)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 838행 | 별도 조건식 없음 | URL.revokeObjectURL(url)<br>call |

## H-54c2d983ec50

**exportDraft** · [src/ui/study-materials.tsx:840](../../../src/ui/study-materials.tsx#L840)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 841행 | 별도 조건식 없음 | recordHelp()<br>call → [H-fe33c198fd10](ui__study-materials.md#h-fe33c198fd10) |
| 842행 | 별도 조건식 없음 | URL.createObjectURL(new Blob([JSON.stringify(current.current, null, 2)], { type: 'application/json' }))<br>call |
| 843행 | 별도 조건식 없음 | JSON.stringify(current.current, null, 2)<br>call |
| 845행 | 별도 조건식 없음 | document.createElement('a')<br>call |
| 848행 | 별도 조건식 없음 | link.click()<br>call |
| 849행 | 별도 조건식 없음 | setTimeout(() => URL.revokeObjectURL(url), 1000)<br>state-update<br>전달 콜백: H-c323fb69ce13 |

## H-c323fb69ce13

**@callback:setTimeout** · [src/ui/study-materials.tsx:849](../../../src/ui/study-materials.tsx#L849)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 849행 | 별도 조건식 없음 | URL.revokeObjectURL(url)<br>call |

## H-4cbb4b1b9a0d

**@onClick** · [src/ui/study-materials.tsx:861](../../../src/ui/study-materials.tsx#L861)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 861행 | 별도 조건식 없음 | exportText('txt')<br>call → [H-3c526cba79c6](ui__study-materials.md#h-3c526cba79c6) |

## H-8208beabcd3c

**@onClick** · [src/ui/study-materials.tsx:867](../../../src/ui/study-materials.tsx#L867)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 867행 | truthy: result | exportText('md')<br>call → [H-3c526cba79c6](ui__study-materials.md#h-3c526cba79c6) |

## H-f9ef64b985b3

**@onClick** · [src/ui/study-materials.tsx:872](../../../src/ui/study-materials.tsx#L872)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 872행 | truthy: aiAllowed | setKeyPanel(!keyPanel)<br>state-update |

## H-317b6489d2b1

**@onClick** · [src/ui/study-materials.tsx:891](../../../src/ui/study-materials.tsx#L891)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 892행 | truthy: draftState === 'failed' | setError('')<br>state-update |
| 893행 | truthy: draftState === 'failed' | retain(current.current)<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |

## H-d54e06984f15

**@onClick** · [src/ui/study-materials.tsx:899](../../../src/ui/study-materials.tsx#L899)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1211a7eac567

**@onToggle** · [src/ui/study-materials.tsx:909](../../../src/ui/study-materials.tsx#L909)

분기 조건과 가능한 갈림길:

- B-aba5cf9fc877 · IfStatement · tab === 'quiz' && result?.quiz → truthy / falsy; 바깥 조건: 별도 조건식 없음 (910행).
- B-c83ed94de34d · IfStatement · opened → truthy / falsy; 바깥 조건: truthy: tab === 'quiz' && result?.quiz (913행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 912행 | truthy: tab === 'quiz' && result?.quiz | setSourceOpen(opened)<br>state-update |
| 913행 | truthy: tab === 'quiz' && result?.quiz ∧ truthy: opened | recordHelp()<br>call → [H-fe33c198fd10](ui__study-materials.md#h-fe33c198fd10) |

## H-fdb8d2943fb2

**@onChange** · [src/ui/study-materials.tsx:924](../../../src/ui/study-materials.tsx#L924)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 924행 | interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing | retain({ ...content, title: event.target.value })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |

## H-5ab0e10c9223

**@onChange** · [src/ui/study-materials.tsx:932](../../../src/ui/study-materials.tsx#L932)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 933행 | interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing | retain({ ...content, subjectId: event.target.value, topicId: null })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |

## H-cc0f64227381

**@callback:data.subjects
                .filter** · [src/ui/study-materials.tsx:938](../../../src/ui/study-materials.tsx#L938)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-889894a1a33e

**@callback:data.subjects
                .filter((row) => !row.deletedAt)
                .map** · [src/ui/study-materials.tsx:939](../../../src/ui/study-materials.tsx#L939)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4dbd68efb197

**@onChange** · [src/ui/study-materials.tsx:948](../../../src/ui/study-materials.tsx#L948)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 948행 | interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing | retain({ ...content, topicId: event.target.value \|\| null })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |

## H-eaddbd349e6a

**@callback:data.nodes
                .filter** · [src/ui/study-materials.tsx:952](../../../src/ui/study-materials.tsx#L952)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fe699c038caa

**@callback:data.nodes
                .filter((row) => row.subjectId === content.subjectId && !row.deletedAt)
                .map** · [src/ui/study-materials.tsx:953](../../../src/ui/study-materials.tsx#L953)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f36fdc0189de

**@onChange** · [src/ui/study-materials.tsx:973](../../../src/ui/study-materials.tsx#L973)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 973행 | interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing | retain({ ...content, sourceText: event.target.value })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |

## H-52838c4f9bab

**@onApply** · [src/ui/study-materials.tsx:981](../../../src/ui/study-materials.tsx#L981) · async


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 982행 | interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing ∧ truthy: aiAllowed | retain({ ...current.current, sourceText })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |

## H-5bb60d42db4e

**@onChange** · [src/ui/study-materials.tsx:999](../../../src/ui/study-materials.tsx#L999) · async


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1000행 | 별도 조건식 없음 | retain({ ...current.current, documents, title: current.current.title \|\| documents[0]?.name.replace(/\.[^.]+$/, '') \|\| '', })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |

## H-c311a2e2d53b

**@onChange** · [src/ui/study-materials.tsx:1013](../../../src/ui/study-materials.tsx#L1013)

분기 조건과 가능한 갈림길:

- B-4daebea7a371 · ConditionalExpression · e.target.checked → truthy / falsy; 바깥 조건: truthy: data.namespace === 'personal' (1016행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1014행 | truthy: data.namespace === 'personal' | retain({ ...current.current, originalStorage: e.target.checked ? 'private-server' : 'device', })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |

## H-f5836c04ca1f

**@onClick** · [src/ui/study-materials.tsx:1028](../../../src/ui/study-materials.tsx#L1028)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1028행 | truthy: recovery | recover()<br>call → [H-4da9b761119b](ui__study-materials.md#h-4da9b761119b) |

## H-09bdac2f6da4

**@onChange** · [src/ui/study-materials.tsx:1065](../../../src/ui/study-materials.tsx#L1065)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1065행 | truthy: aiAllowed | requestPatch({ task: event.target.value as StudyAITask })<br>call → [H-4aeb6183a103](ui__study-materials.md#h-4aeb6183a103) |

## H-1908f8aa9b6c

**@callback:Object.entries(STUDY_AI_TASKS)
                .filter** · [src/ui/study-materials.tsx:1073](../../../src/ui/study-materials.tsx#L1073)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-456832f7fc51

**@callback:Object.entries(STUDY_AI_TASKS)
                .filter(([value]) => value !== 'tutor' && value !== 'source-qa')
                .map** · [src/ui/study-materials.tsx:1074](../../../src/ui/study-materials.tsx#L1074)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-78dfb3ce65ad

**@onChange** · [src/ui/study-materials.tsx:1084](../../../src/ui/study-materials.tsx#L1084)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1085행 | truthy: aiAllowed | requestPatch({ requestedCardCount: Number( event.target.value, ) as StudyAIRequest['requestedCardCount'], })<br>call → [H-4aeb6183a103](ui__study-materials.md#h-4aeb6183a103) |
| 1086행 | truthy: aiAllowed | Number(event.target.value)<br>call |

## H-94609ad5819e

**@callback:[5, 10, 20, 30].map** · [src/ui/study-materials.tsx:1092](../../../src/ui/study-materials.tsx#L1092)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4bc6b9fbb390

**@onClick** · [src/ui/study-materials.tsx:1112](../../../src/ui/study-materials.tsx#L1112)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1112행 | truthy: aiAllowed | analyze()<br>call → [H-9ce20acb18fd](ui__study-materials.md#h-9ce20acb18fd) |

## H-562cb18b80e3

**@onClick** · [src/ui/study-materials.tsx:1126](../../../src/ui/study-materials.tsx#L1126)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1126행 | 별도 조건식 없음 | save()<br>call → [H-4eec818739ff](ui__study-materials.md#h-4eec818739ff) |

## H-2283d7145a92

**@onChange** · [src/ui/study-materials.tsx:1146](../../../src/ui/study-materials.tsx#L1146)

분기 조건과 가능한 갈림길:

- B-adbb593d63a9 · ConditionalExpression · current.current.generationProgress?.sourceIdentity === ranges.sourceIdentity → truthy / falsy; 바깥 조건: truthy: aiAllowed && ranges && ranges.batches.length > 1 (1153행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1147행 | truthy: aiAllowed && ranges && ranges.batches.length > 1 | retain({ ...current.current, generationProgress: { sourceIdentity: ranges.sourceIdentity, index: Number(event.target.value), completed: current.current.generationProgress?.sourceIdentity === ranges.sourceIdentity ? current.current.generationProgress.completed : [], }, })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |
| 1151행 | truthy: aiAllowed && ranges && ranges.batches.length > 1 | Number(event.target.value)<br>call |

## H-52ba9057f7c0

**@callback:ranges.batches.map** · [src/ui/study-materials.tsx:1160](../../../src/ui/study-materials.tsx#L1160)

분기 조건과 가능한 갈림길:

- B-bf6e3c73fa63 · ConditionalExpression · content.generationProgress?.sourceIdentity === ranges.sourceIdentity && content.generationProgress.completed.some((c) => c.index === index) → truthy / falsy; 바깥 조건: truthy: aiAllowed && ranges && ranges.batches.length > 1 (1165행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1161행 | truthy: aiAllowed && ranges && ranges.batches.length > 1 | JSON.stringify(batch.map((segment) => segment.id))<br>call |
| 1161행 | truthy: aiAllowed && ranges && ranges.batches.length > 1 | batch.map((segment) => segment.id)<br>call<br>전달 콜백: H-57f7a692859d |
| 1163행 | truthy: aiAllowed && ranges && ranges.batches.length > 1 | batch.at(-1)<br>call |
| 1163행 | truthy: aiAllowed && ranges && ranges.batches.length > 1 ∧ nullish: batch.at(-1)?.label | batch.at(-1)<br>call |
| 1164행 | truthy: aiAllowed && ranges && ranges.batches.length > 1 | batch.reduce((n, s) => n + s.text.length, 0).toLocaleString('ko-KR')<br>call |
| 1164행 | truthy: aiAllowed && ranges && ranges.batches.length > 1 | batch.reduce((n, s) => n + s.text.length, 0)<br>call<br>전달 콜백: H-eddbc4a51661 |
| 1166행 | truthy: aiAllowed && ranges && ranges.batches.length > 1 ∧ truthy: content.generationProgress?.sourceIdentity === ranges.sourceIdentity | content.generationProgress.completed.some((c) => c.index === index)<br>call<br>전달 콜백: H-30dcfaf1335d |

## H-57f7a692859d

**@callback:batch.map** · [src/ui/study-materials.tsx:1161](../../../src/ui/study-materials.tsx#L1161)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-eddbc4a51661

**@callback:batch.reduce** · [src/ui/study-materials.tsx:1164](../../../src/ui/study-materials.tsx#L1164)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-30dcfaf1335d

**@callback:content.generationProgress.completed.some** · [src/ui/study-materials.tsx:1166](../../../src/ui/study-materials.tsx#L1166)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a1a35f1f1499

**@onChange** · [src/ui/study-materials.tsx:1179](../../../src/ui/study-materials.tsx#L1179)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1180행 | truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing | requestPatch({ support: event.target.value as StudyAIRequest['support'] })<br>call → [H-4aeb6183a103](ui__study-materials.md#h-4aeb6183a103) |

## H-448dfc902ac9

**@onChange** · [src/ui/study-materials.tsx:1190](../../../src/ui/study-materials.tsx#L1190)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1191행 | truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing | requestPatch({ externalization: event.target.value as StudyAIRequest['externalization'], })<br>call → [H-4aeb6183a103](ui__study-materials.md#h-4aeb6183a103) |

## H-20f838b71ca6

**@onChange** · [src/ui/study-materials.tsx:1209](../../../src/ui/study-materials.tsx#L1209)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1209행 | truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing | requestPatch({ focus: event.target.value })<br>call → [H-4aeb6183a103](ui__study-materials.md#h-4aeb6183a103) |

## H-4f205c4f341d

**@onChange** · [src/ui/study-materials.tsx:1217](../../../src/ui/study-materials.tsx#L1217)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1217행 | truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing ∧ truthy: ['hint', 'feedback', 'practice'].includes(task) | requestPatch({ problem: event.target.value })<br>call → [H-4aeb6183a103](ui__study-materials.md#h-4aeb6183a103) |

## H-6a253f05435b

**@onChange** · [src/ui/study-materials.tsx:1223](../../../src/ui/study-materials.tsx#L1223)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1223행 | truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing ∧ truthy: ['hint', 'feedback', 'practice'].includes(task) | requestPatch({ attempt: event.target.value })<br>call → [H-4aeb6183a103](ui__study-materials.md#h-4aeb6183a103) |

## H-0a62eb7f4ec9

**@onChange** · [src/ui/study-materials.tsx:1229](../../../src/ui/study-materials.tsx#L1229)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1229행 | truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready \|\| busy \|\| saving \|\| importing ∧ truthy: ['hint', 'feedback', 'practice'].includes(task) | requestPatch({ reference: event.target.value })<br>call → [H-4aeb6183a103](ui__study-materials.md#h-4aeb6183a103) |

## H-777d360dc073

**@callback:occurrenceRows** · [src/ui/study-materials.tsx:1261](../../../src/ui/study-materials.tsx#L1261)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1261행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.diagnostics | JSON.stringify(diagnostic)<br>call |

## H-b772b40679ac

**@callback:occurrenceRows(result.diagnostics, (diagnostic) => JSON.stringify(diagnostic)).map** · [src/ui/study-materials.tsx:1262](../../../src/ui/study-materials.tsx#L1262)

분기 조건과 가능한 갈림길:

- B-2962512fe5ef · ConditionalExpression · d.sourceIds?.length → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.diagnostics (1268행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1268행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.diagnostics ∧ truthy: d.sourceIds?.length | evidence(d.sourceIds)<br>call → [H-b2efbd9066d5](ui__study-materials.md#h-b2efbd9066d5) |

## H-7123dc15cbef

**@callback:result.segments.some** · [src/ui/study-materials.tsx:1278](../../../src/ui/study-materials.tsx#L1278)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f5e4c5d5a248

**@onChange** · [src/ui/study-materials.tsx:1290](../../../src/ui/study-materials.tsx#L1290)

분기 조건과 가능한 갈림길:

- B-0794634d01af · IfStatement · tab === 'quiz' → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: content.results.length > 1 (1291행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1291행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: content.results.length > 1 ∧ truthy: tab === 'quiz' | recordHelp()<br>call → [H-fe33c198fd10](ui__study-materials.md#h-fe33c198fd10) |
| 1292행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: content.results.length > 1 | setResultIndex(Number(event.target.value))<br>state-update |
| 1292행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: content.results.length > 1 | Number(event.target.value)<br>call |
| 1293행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: content.results.length > 1 | setCardIndex(0)<br>state-update |
| 1294행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: content.results.length > 1 | setAnswer('')<br>state-update |
| 1295행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: content.results.length > 1 | setEditingResult(false)<br>state-update |
| 1296행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: content.results.length > 1 | setEditingCard('')<br>state-update |

## H-cda19853b886

**@callback:content.results.map** · [src/ui/study-materials.tsx:1299](../../../src/ui/study-materials.tsx#L1299)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1302행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: content.results.length > 1 | canonicalStudyTask(row.request?.task ?? 'summary')<br>call |
| 1303행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: content.results.length > 1 | new Date(row.at).toLocaleString('ko-KR')<br>call |

## H-8d8a0e6d6f79

**@callback:(
              [
                'summary',
                'transcript',
                'cards',
                ...(result.quiz ? ['quiz' as const] : []),
                ...(result.map ? ['map' as const] : []),
              ] as const
            ).map** · [src/ui/study-materials.tsx:1317](../../../src/ui/study-materials.tsx#L1317)

분기 조건과 가능한 갈림길:

- B-5c8e5b0aedbb · ConditionalExpression · result.request && !['summary', 'study-pack'].includes(result.request.task) → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving (1327행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1327행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.request | ['summary', 'study-pack'].includes(result.request.task)<br>call |

## H-80c899482172

**@onClick** · [src/ui/study-materials.tsx:1322](../../../src/ui/study-materials.tsx#L1322)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1322행 | truthy: result ∧ interactive-when-falsy: saving | chooseTab(value)<br>call → [H-a42db4836e82](ui__study-materials.md#h-a42db4836e82) |

## H-0da574f497b3

**@onSelected** · [src/ui/study-materials.tsx:1347](../../../src/ui/study-materials.tsx#L1347)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1349행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'quiz' && result.quiz | retain(current.current)<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |

## H-23c0ecb30659

**@onChange** · [src/ui/study-materials.tsx:1352](../../../src/ui/study-materials.tsx#L1352)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1352행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'quiz' && result.quiz | retain({ ...current.current, quizAttempts })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |

## H-2370f90e7a6b

**@onChange** · [src/ui/study-materials.tsx:1364](../../../src/ui/study-materials.tsx#L1364)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1365행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'map' && result.map | retain({ ...current.current, results: current.current.results.map((row) => row.id === result.id ? { ...row, originalMap: row.originalMap ?? structuredClone(row.map), map } : row, ), })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |
| 1367행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'map' && result.map | current.current.results.map((row) => row.id === result.id ? { ...row, originalMap: row.originalMap ?? structuredClone(row.map), map } : row)<br>call<br>전달 콜백: H-143c97176779 |

## H-143c97176779

**@callback:current.current.results.map** · [src/ui/study-materials.tsx:1367](../../../src/ui/study-materials.tsx#L1367)

분기 조건과 가능한 갈림길:

- B-fda4fd998072 · ConditionalExpression · row.id === result.id → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'map' && result.map (1368행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1369행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'map' && result.map ∧ truthy: row.id === result.id ∧ nullish: row.originalMap | structuredClone(row.map)<br>call |

## H-ca796aa0da00

**@onCanvas** · [src/ui/study-materials.tsx:1374](../../../src/ui/study-materials.tsx#L1374) · async

분기 조건과 가능한 갈림길:

- B-1ac5d5782b72 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'map' && result.map (1375행).
- B-60e8600805aa · IfStatement · !(await save()) → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'map' && result.map (1376행).
- B-f5d48f3b53d6 · CatchClause · error → exception; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'map' && result.map (1380행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1376행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'map' && result.map | save()<br>call → [H-4eec818739ff](ui__study-materials.md#h-4eec818739ff) |
| 1377행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'map' && result.map | addMaterialMapToCanvas(repository, current.current, result)<br>call |
| 1378행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'map' && result.map | onSaved(next)<br>call |
| 1379행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'map' && result.map | setNotice('개념도를 Canvas에 추가했습니다. 기존 카드와 배치는 유지했습니다.')<br>state-update |
| 1381행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'map' && result.map ∧ exception: error | setError(message(error))<br>state-update |
| 1381행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'map' && result.map ∧ exception: error | message(error)<br>call → [H-41261534bb0c](ui__study-materials.md#h-41261534bb0c) |

반환/조기 중단: 1376행 <render> [truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'map' && result.map ∧ truthy: !(await save())]

## H-72edcda06cfd

**@onClick** · [src/ui/study-materials.tsx:1389](../../../src/ui/study-materials.tsx#L1389)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1389행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' | setEditingResult(!editingResult)<br>state-update |

## H-9b94d1e89ef0

**@callback:result.summary.map** · [src/ui/study-materials.tsx:1392](../../../src/ui/study-materials.tsx#L1392)

분기 조건과 가능한 갈림길:

- B-34dda5228e72 · ConditionalExpression · editingResult → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' (1398행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1456행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' | evidence(row.sourceIds)<br>call → [H-b2efbd9066d5](ui__study-materials.md#h-b2efbd9066d5) |

## H-363dbba8c595

**@onChange** · [src/ui/study-materials.tsx:1403](../../../src/ui/study-materials.tsx#L1403)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1404행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' ∧ truthy: editingResult | retain({ ...current.current, results: current.current.results.map((item) => item.id === result.id ? { ...item, summary: item.summary.map((line, at) => at === index ? { ...line, originalText: line.originalText ?? line.text, text: event.target.value, } : line, ), } : item, ), })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |
| 1406행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' ∧ truthy: editingResult | current.current.results.map((item) => item.id === result.id ? { ...item, summary: item.summary.map((line, at) => at === index ? { ...line, originalText: line.originalText ?? line.text, text: event.target.value, } : line, ), } : item)<br>call<br>전달 콜백: H-c118a608ef6b |

## H-c118a608ef6b

**@callback:current.current.results.map** · [src/ui/study-materials.tsx:1406](../../../src/ui/study-materials.tsx#L1406)

분기 조건과 가능한 갈림길:

- B-7b79d3ec8e3f · ConditionalExpression · item.id === result.id → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' ∧ truthy: editingResult (1407행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1410행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' ∧ truthy: editingResult ∧ truthy: item.id === result.id | item.summary.map((line, at) => at === index ? { ...line, originalText: line.originalText ?? line.text, text: event.target.value, } : line)<br>call<br>전달 콜백: H-b38d6812d75b |

## H-b38d6812d75b

**@callback:item.summary.map** · [src/ui/study-materials.tsx:1410](../../../src/ui/study-materials.tsx#L1410)

분기 조건과 가능한 갈림길:

- B-eb9ef8da3be8 · ConditionalExpression · at === index → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' ∧ truthy: editingResult ∧ truthy: item.id === result.id (1411행).

## H-292e8d723785

**@onClick** · [src/ui/study-materials.tsx:1434](../../../src/ui/study-materials.tsx#L1434)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1435행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' ∧ truthy: row.originalText !== undefined | retain({ ...current.current, results: current.current.results.map((item) => item.id === result.id ? { ...item, summary: item.summary.map((line, at) => at === index ? { ...line, text: line.originalText ?? line.text } : line, ), } : item, ), })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |
| 1437행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' ∧ truthy: row.originalText !== undefined | current.current.results.map((item) => item.id === result.id ? { ...item, summary: item.summary.map((line, at) => at === index ? { ...line, text: line.originalText ?? line.text } : line, ), } : item)<br>call<br>전달 콜백: H-7382364a962a |

## H-7382364a962a

**@callback:current.current.results.map** · [src/ui/study-materials.tsx:1437](../../../src/ui/study-materials.tsx#L1437)

분기 조건과 가능한 갈림길:

- B-95974c43e60d · ConditionalExpression · item.id === result.id → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' ∧ truthy: row.originalText !== undefined (1438행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1441행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' ∧ truthy: row.originalText !== undefined ∧ truthy: item.id === result.id | item.summary.map((line, at) => at === index ? { ...line, text: line.originalText ?? line.text } : line)<br>call<br>전달 콜백: H-7bee08bbfef7 |

## H-7bee08bbfef7

**@callback:item.summary.map** · [src/ui/study-materials.tsx:1441](../../../src/ui/study-materials.tsx#L1441)

분기 조건과 가능한 갈림길:

- B-7f2c88ca7347 · ConditionalExpression · at === index → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' ∧ truthy: row.originalText !== undefined ∧ truthy: item.id === result.id (1442행).

## H-411c8667889f

**@callback:result.segments.map** · [src/ui/study-materials.tsx:1468](../../../src/ui/study-materials.tsx#L1468)

분기 조건과 가능한 갈림길:

- B-6d2b6dbf61cc · ConditionalExpression · segment.start != null → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'transcript' ∧ nullish: segment.label (1471행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1471행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'transcript' ∧ nullish: segment.label ∧ truthy: segment.start != null | clock(segment.start)<br>call → [H-d84d5668468a](ui__study-materials.md#h-d84d5668468a) |

## H-16fa8741c2b3

**@onChange** · [src/ui/study-materials.tsx:1477](../../../src/ui/study-materials.tsx#L1477)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1478행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'transcript' | retain({ ...content, results: content.results.map((row) => row.id === result.id ? { ...row, segments: row.segments.map((item) => item.id === segment.id ? { ...item, originalText: item.originalText ?? item.text, text: event.target.value, } : item, ), } : row, ), })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |
| 1480행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'transcript' | content.results.map((row) => row.id === result.id ? { ...row, segments: row.segments.map((item) => item.id === segment.id ? { ...item, originalText: item.originalText ?? item.text, text: event.target.value, } : item, ), } : row)<br>call<br>전달 콜백: H-22740504a6d6 |

## H-22740504a6d6

**@callback:content.results.map** · [src/ui/study-materials.tsx:1480](../../../src/ui/study-materials.tsx#L1480)

분기 조건과 가능한 갈림길:

- B-a9834e055af4 · ConditionalExpression · row.id === result.id → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'transcript' (1481행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1484행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'transcript' ∧ truthy: row.id === result.id | row.segments.map((item) => item.id === segment.id ? { ...item, originalText: item.originalText ?? item.text, text: event.target.value, } : item)<br>call<br>전달 콜백: H-51e31a6f88a7 |

## H-51e31a6f88a7

**@callback:row.segments.map** · [src/ui/study-materials.tsx:1484](../../../src/ui/study-materials.tsx#L1484)

분기 조건과 가능한 갈림길:

- B-795f00199309 · ConditionalExpression · item.id === segment.id → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'transcript' ∧ truthy: row.id === result.id (1485행).

## H-9e17003e50c9

**@onChange** · [src/ui/study-materials.tsx:1521](../../../src/ui/study-materials.tsx#L1521)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1521행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card ∧ truthy: editingCard === cardKey && cardKey | updateCard({ question: event.target.value })<br>call → [H-e9e5de6e4920](ui__study-materials.md#h-e9e5de6e4920) |

## H-7623d09519a7

**@onChange** · [src/ui/study-materials.tsx:1526](../../../src/ui/study-materials.tsx#L1526)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1526행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card ∧ truthy: editingCard === cardKey && cardKey | updateCard({ answer: event.target.value })<br>call → [H-e9e5de6e4920](ui__study-materials.md#h-e9e5de6e4920) |

## H-0fff21f5b2b5

**@onClick** · [src/ui/study-materials.tsx:1529](../../../src/ui/study-materials.tsx#L1529)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1529행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card ∧ truthy: editingCard === cardKey && cardKey | setEditingCard('')<br>state-update |

## H-fae69631de64

**@onClick** · [src/ui/study-materials.tsx:1539](../../../src/ui/study-materials.tsx#L1539)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1539행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card ∧ falsy: editingCard === cardKey && cardKey ∧ falsy: answer === cardKey && cardKey | revealCard()<br>call → [H-1af41ce5185f](ui__study-materials.md#h-1af41ce5185f) |

## H-8ff292399fd7

**@onClick** · [src/ui/study-materials.tsx:1564](../../../src/ui/study-materials.tsx#L1564)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1565행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card | setCardIndex(cardIndex - 1)<br>state-update |
| 1566행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card | setAnswer('')<br>state-update |
| 1567행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card | setEditingCard('')<br>state-update |

## H-bbefe39e4d3e

**@onClick** · [src/ui/study-materials.tsx:1574](../../../src/ui/study-materials.tsx#L1574)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1575행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card | setCardIndex(cardIndex + 1)<br>state-update |
| 1576행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card | setAnswer('')<br>state-update |
| 1577행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card | setEditingCard('')<br>state-update |

## H-14069379d87d

**@onClick** · [src/ui/study-materials.tsx:1584](../../../src/ui/study-materials.tsx#L1584)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1585행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card | setEditingCard(cardKey)<br>state-update |
| 1586행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card | revealCard()<br>call → [H-1af41ce5185f](ui__study-materials.md#h-1af41ce5185f) |

## H-d5434cc82d21

**@onClick** · [src/ui/study-materials.tsx:1593](../../../src/ui/study-materials.tsx#L1593)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1594행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card | setEditingCard('')<br>state-update |
| 1595행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card | updateCard({ excluded: true })<br>call → [H-e9e5de6e4920](ui__study-materials.md#h-e9e5de6e4920) |
| 1596행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card | setCardIndex(Math.max(0, Math.min(cardIndex, cards.length - 2)))<br>state-update |
| 1596행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card | Math.max(0, Math.min(cardIndex, cards.length - 2))<br>call |
| 1596행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card | Math.min(cardIndex, cards.length - 2)<br>call |
| 1597행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card | setAnswer('')<br>state-update |

## H-6ab1c8baf3c1

**@callback:result.cards.some** · [src/ui/study-materials.tsx:1610](../../../src/ui/study-materials.tsx#L1610)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ac377d54cc97

**@callback:result.cards
                .filter** · [src/ui/study-materials.tsx:1614](../../../src/ui/study-materials.tsx#L1614)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f64048239a32

**@callback:result.cards
                .filter((card) => card.excluded)
                .map** · [src/ui/study-materials.tsx:1615](../../../src/ui/study-materials.tsx#L1615)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-00cc5ef51e6b

**@onClick** · [src/ui/study-materials.tsx:1620](../../../src/ui/study-materials.tsx#L1620)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1621행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.cards.some((card) => card.excluded) | retain({ ...content, results: content.results.map((row) => row.id === result.id ? { ...row, cards: row.cards.map((item) => item.id === card.id ? { ...item, excluded: false } : item, ), } : row, ), })<br>call → [H-f59c4ad6c4c6](ui__study-materials.md#h-f59c4ad6c4c6) |
| 1623행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.cards.some((card) => card.excluded) | content.results.map((row) => row.id === result.id ? { ...row, cards: row.cards.map((item) => item.id === card.id ? { ...item, excluded: false } : item, ), } : row)<br>call<br>전달 콜백: H-b5a3838f9aba |

## H-b5a3838f9aba

**@callback:content.results.map** · [src/ui/study-materials.tsx:1623](../../../src/ui/study-materials.tsx#L1623)

분기 조건과 가능한 갈림길:

- B-aec8e4d5ae79 · ConditionalExpression · row.id === result.id → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.cards.some((card) => card.excluded) (1624행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1627행 | truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.cards.some((card) => card.excluded) ∧ truthy: row.id === result.id | row.cards.map((item) => item.id === card.id ? { ...item, excluded: false } : item)<br>call<br>전달 콜백: H-c695db49f1a5 |

## H-c695db49f1a5

**@callback:row.cards.map** · [src/ui/study-materials.tsx:1627](../../../src/ui/study-materials.tsx#L1627)

분기 조건과 가능한 갈림길:

- B-813a79a60fc3 · ConditionalExpression · item.id === card.id → truthy / falsy; 바깥 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.cards.some((card) => card.excluded) ∧ truthy: row.id === result.id (1628행).

## H-5ea4ee79241c

**@callback:content.results.filter** · [src/ui/study-materials.tsx:1649](../../../src/ui/study-materials.tsx#L1649)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ceafeb46a1ec

**@onEvidence** · [src/ui/study-materials.tsx:1652](../../../src/ui/study-materials.tsx#L1652)

분기 조건과 가능한 갈림길:

- B-786ecc5ae32a · IfStatement · index >= 0 → truthy / falsy; 바깥 조건: truthy: aiAllowed (1654행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1653행 | truthy: aiAllowed | current.current.results.findIndex((r) => r.id === resultId)<br>call<br>전달 콜백: H-12bf1ec460af |
| 1655행 | truthy: aiAllowed ∧ truthy: index >= 0 | recordHelp()<br>call → [H-fe33c198fd10](ui__study-materials.md#h-fe33c198fd10) |
| 1656행 | truthy: aiAllowed ∧ truthy: index >= 0 | setResultIndex(index)<br>state-update |
| 1657행 | truthy: aiAllowed ∧ truthy: index >= 0 | setAnswer('')<br>state-update |
| 1658행 | truthy: aiAllowed ∧ truthy: index >= 0 | setEditingCard('')<br>state-update |
| 1659행 | truthy: aiAllowed ∧ truthy: index >= 0 | setTab('transcript')<br>state-update |
| 1660행 | truthy: aiAllowed ∧ truthy: index >= 0 | setTimeout(() => document .getElementById(`material-segment-${id}`) ?.scrollIntoView({ block: 'nearest' }), 0)<br>state-update<br>전달 콜백: H-504d2322dbe4 |

## H-12bf1ec460af

**@callback:current.current.results.findIndex** · [src/ui/study-materials.tsx:1653](../../../src/ui/study-materials.tsx#L1653)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-504d2322dbe4

**@callback:setTimeout** · [src/ui/study-materials.tsx:1661](../../../src/ui/study-materials.tsx#L1661)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1662행 | truthy: aiAllowed ∧ truthy: index >= 0 | document<br>                    .getElementById(`material-segment-${id}`)<br>call |

## H-f032df871e7b

**@callback:data.revisions.filter** · [src/ui/study-materials.tsx:1678](../../../src/ui/study-materials.tsx#L1678)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-eac814070c90

**@onClick** · [src/ui/study-materials.tsx:1686](../../../src/ui/study-materials.tsx#L1686)

분기 조건과 가능한 갈림길:

- B-0a4c5e4666b6 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: selected (1687행).
- B-d803e03b784a · CatchClause · error → exception; 바깥 조건: truthy: selected (1696행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1688행 | truthy: selected | repository.execute({ type: 'trashStudyMaterial', id: selected.id, expectedVersion: selected.version, ...context(data), })<br>call |
| 1692행 | truthy: selected | context(data)<br>call → [H-3a866d502ecc](ui__study-materials.md#h-3a866d502ecc) |
| 1694행 | truthy: selected | onSaved(next)<br>call |
| 1695행 | truthy: selected | navigate('/materials')<br>navigation |
| 1697행 | truthy: selected ∧ exception: error | setError(message(error))<br>state-update |
| 1697행 | truthy: selected ∧ exception: error | message(error)<br>call → [H-41261534bb0c](ui__study-materials.md#h-41261534bb0c) |

