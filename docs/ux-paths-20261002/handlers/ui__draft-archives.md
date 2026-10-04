# src/ui/draft-archives.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-43abaea83fa8

**archiveTarget** · [src/ui/draft-archives.tsx:9](../../../src/ui/draft-archives.tsx#L9)

분기 조건과 가능한 갈림길:

- B-96f6b4127d0d · ConditionalExpression · data → truthy / falsy; 바깥 조건: 별도 조건식 없음 (10행).
- B-60024a7cbdb3 · ConditionalExpression · sourceKey.startsWith(prefix) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (11행).
- B-7a88ce5b70c8 · IfStatement · key === 'canvas-draft:main' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (14행).
- B-b424737ad55a · IfStatement · key.startsWith('draft:') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (15행).
- B-b8808dabd8d6 · ConditionalExpression · targetId === 'multiple' → truthy / falsy; 바깥 조건: truthy: key.startsWith('draft:') (17행).
- B-7cdc5cd40ea5 · IfStatement · targetId === 'multiple' → truthy / falsy; 바깥 조건: truthy: key.startsWith('draft:') (18행).
- B-f936974889ba · IfStatement · key.startsWith('narrative:') → truthy / falsy; 바깥 조건: falsy: key.startsWith('draft:') (19행).
- B-17c7836c24ca · IfStatement · kind === 'free-note' → truthy / falsy; 바깥 조건: falsy: key.startsWith('draft:') ∧ truthy: key.startsWith('narrative:') (23행).
- B-812cbb4c38fe · ConditionalExpression · id.startsWith('id:') → truthy / falsy; 바깥 조건: falsy: key.startsWith('draft:') ∧ truthy: key.startsWith('narrative:') ∧ truthy: kind === 'free-note' (24행).
- B-7e1f14ac9d6b · ConditionalExpression · !data → truthy / falsy; 바깥 조건: falsy: key.startsWith('draft:') ∧ truthy: key.startsWith('narrative:') ∧ truthy: kind === 'free-note' (25행).
- B-4708f097e03d · ConditionalExpression · note → truthy / falsy; 바깥 조건: falsy: key.startsWith('draft:') ∧ truthy: key.startsWith('narrative:') ∧ truthy: kind === 'free-note' ∧ falsy: !data (25행).
- B-366588340482 · ConditionalExpression · note.deletedAt → truthy / falsy; 바깥 조건: falsy: key.startsWith('draft:') ∧ truthy: key.startsWith('narrative:') ∧ truthy: kind === 'free-note' ∧ falsy: !data ∧ truthy: note (25행).
- B-6dc563232acf · ConditionalExpression · note && !note.deletedAt → truthy / falsy; 바깥 조건: falsy: key.startsWith('draft:') ∧ truthy: key.startsWith('narrative:') ∧ truthy: kind === 'free-note' (25행).
- B-a7ac32a23e10 · IfStatement · key.startsWith('modal:') → truthy / falsy; 바깥 조건: falsy: key.startsWith('draft:') ∧ falsy: key.startsWith('narrative:') (28행).
- B-9101115578b2 · IfStatement · key.includes(':criteria-draft:') → truthy / falsy; 바깥 조건: falsy: key.startsWith('draft:') ∧ falsy: key.startsWith('narrative:') ∧ falsy: key.startsWith('modal:') (33행).
- B-51596712d157 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: falsy: key.startsWith('draft:') ∧ falsy: key.startsWith('narrative:') ∧ falsy: key.startsWith('modal:') ∧ truthy: key.includes(':criteria-draft:') (35행).
- B-545e2e8bcf36 · CatchClause · 구조 분기 → exception; 바깥 조건: falsy: key.startsWith('draft:') ∧ falsy: key.startsWith('narrative:') ∧ falsy: key.startsWith('modal:') ∧ truthy: key.includes(':criteria-draft:') (35행).
- B-d3f74022288a · IfStatement · key.endsWith(':outline-table-draft:v1') → truthy / falsy; 바깥 조건: falsy: key.startsWith('draft:') ∧ falsy: key.startsWith('narrative:') ∧ falsy: key.startsWith('modal:') ∧ falsy: key.includes(':criteria-draft:') (36행).
- B-825b80d9c3a5 · IfStatement · subject → truthy / falsy; 바깥 조건: 별도 조건식 없음 (45행).
- B-965e3ca4023c · IfStatement · semester → truthy / falsy; 바깥 조건: 별도 조건식 없음 (46행).
- B-36830f51c93c · IfStatement · entity && !entity.deletedAt → truthy / falsy; 바깥 조건: 별도 조건식 없음 (48행).
- B-9431dd54cf7d · ConditionalExpression · node → truthy / falsy; 바깥 조건: truthy: entity && !entity.deletedAt (48행).
- B-b6f31c6b2c79 · ConditionalExpression · subject → truthy / falsy; 바깥 조건: truthy: entity && !entity.deletedAt ∧ falsy: node (48행).
- B-cb7327768191 · ConditionalExpression · names.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (49행).
- B-ab5c2e28b665 · ConditionalExpression · !data → truthy / falsy; 바깥 조건: 별도 조건식 없음 (50행).
- B-bca9d66a1b9a · ConditionalExpression · entity → truthy / falsy; 바깥 조건: falsy: !data (50행).
- B-fec1238a8703 · ConditionalExpression · entity.deletedAt → truthy / falsy; 바깥 조건: falsy: !data ∧ truthy: entity (50행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 10행 | truthy: data | storagePrefix(data)<br>call |
| 11행 | 별도 조건식 없음 | sourceKey.startsWith(prefix)<br>call |
| 11행 | truthy: sourceKey.startsWith(prefix) | sourceKey.slice(prefix.length)<br>call |
| 15행 | 별도 조건식 없음 | key.startsWith('draft:')<br>call |
| 16행 | truthy: key.startsWith('draft:') | key.slice('draft:'.length)<br>call |
| 19행 | falsy: key.startsWith('draft:') | key.startsWith('narrative:')<br>call |
| 20행 | falsy: key.startsWith('draft:') ∧ truthy: key.startsWith('narrative:') | key.slice('narrative:'.length)<br>call |
| 20행 | falsy: key.startsWith('draft:') ∧ truthy: key.startsWith('narrative:') | part.indexOf(':')<br>call |
| 21행 | falsy: key.startsWith('draft:') ∧ truthy: key.startsWith('narrative:') | part.slice(0, split)<br>call |
| 21행 | falsy: key.startsWith('draft:') ∧ truthy: key.startsWith('narrative:') | part.slice(split + 1)<br>call |
| 24행 | falsy: key.startsWith('draft:') ∧ truthy: key.startsWith('narrative:') ∧ truthy: kind === 'free-note' | id.startsWith('id:')<br>call |
| 25행 | falsy: key.startsWith('draft:') ∧ truthy: key.startsWith('narrative:') ∧ truthy: kind === 'free-note' ∧ truthy: note && !note.deletedAt | encodeURIComponent(note.id)<br>call |
| 28행 | falsy: key.startsWith('draft:') ∧ falsy: key.startsWith('narrative:') | key.startsWith('modal:')<br>call |
| 29행 | falsy: key.startsWith('draft:') ∧ falsy: key.startsWith('narrative:') ∧ truthy: key.startsWith('modal:') | key.slice('modal:'.length)<br>call |
| 29행 | falsy: key.startsWith('draft:') ∧ falsy: key.startsWith('narrative:') ∧ truthy: key.startsWith('modal:') | part.indexOf(':')<br>call |
| 30행 | falsy: key.startsWith('draft:') ∧ falsy: key.startsWith('narrative:') ∧ truthy: key.startsWith('modal:') | part.slice(0, split)<br>call |
| 31행 | falsy: key.startsWith('draft:') ∧ falsy: key.startsWith('narrative:') ∧ truthy: key.startsWith('modal:') | part.slice(split + 1)<br>call |
| 33행 | falsy: key.startsWith('draft:') ∧ falsy: key.startsWith('narrative:') ∧ falsy: key.startsWith('modal:') | key.includes(':criteria-draft:')<br>call |
| 35행 | falsy: key.startsWith('draft:') ∧ falsy: key.startsWith('narrative:') ∧ falsy: key.startsWith('modal:') ∧ truthy: key.includes(':criteria-draft:') | decodeURIComponent(key.split(':criteria-draft:')[1])<br>call |
| 35행 | falsy: key.startsWith('draft:') ∧ falsy: key.startsWith('narrative:') ∧ falsy: key.startsWith('modal:') ∧ truthy: key.includes(':criteria-draft:') | key.split(':criteria-draft:')<br>call |
| 36행 | falsy: key.startsWith('draft:') ∧ falsy: key.startsWith('narrative:') ∧ falsy: key.startsWith('modal:') ∧ falsy: key.includes(':criteria-draft:') | key.endsWith(':outline-table-draft:v1')<br>call |
| 44행 | truthy: parent | seen.has(parent.id)<br>call |
| 44행 | 별도 조건식 없음 | seen.add(parent.id)<br>call |
| 44행 | 별도 조건식 없음 | names.unshift(parent.name)<br>call |
| 45행 | truthy: subject | names.unshift(subject.name)<br>call |
| 46행 | truthy: semester | names.unshift(semester.name)<br>call |
| 48행 | truthy: entity && !entity.deletedAt ∧ truthy: node | encodeURIComponent(node.id)<br>call |
| 48행 | truthy: entity && !entity.deletedAt ∧ falsy: node ∧ truthy: subject | encodeURIComponent(subject.id)<br>call |
| 49행 | truthy: names.length | names.join(' → ')<br>call |

반환/조기 중단: 14행 { label: 'Canvas 배치', relation: '원래 카드 좌표·연결의 초안입니다. 저장된 배치와 합치기 전에 원문을 확인해 주세요.', href: '#/canvas' } [truthy: key === 'canvas-draft:main']; 25행 { label, relation: !data ? '현재 기록의 연결은 확인하지 못했습니다.' : note ? note.deletedAt ? '연결된 자유 기록이 휴지통에 있습니다.' : '같은 ID의 자유 기록이 있습니다. 본문 일치나 복구 완료를 뜻하지 않습니다.' : '현재 기록과의 연결은 확인되지 않았습니다.', ...(note && !note.deletedAt ? { href: `#/free/${encodeURIComponent(note.id)}` } : {}) } [falsy: key.startsWith('draft:') ∧ truthy: key.startsWith('narrative:') ∧ truthy: kind === 'free-note']; 37행 { label: '과목·단원·주제 표', relation: '표 입력 초안입니다. 생성된 항목과 같은 내용인지는 확인하지 않습니다.', href: '#/subjects' } [falsy: key.startsWith('draft:') ∧ falsy: key.startsWith('narrative:') ∧ falsy: key.startsWith('modal:') ∧ falsy: key.includes(':criteria-draft:') ∧ truthy: key.endsWith(':outline-table-draft:v1')]; 49행 { label: names.length ? `${label} · ${names.join(' → ')}` : label, relation: !data ? '현재 기록의 연결은 확인하지 못했습니다.' : entity ? entity.deletedAt ? '원래 대상이 휴지통에 있습니다. 보관본은 별도로 남습니다.' : '같은 ID의 대상이 있습니다. 현재 기록을 변경하거나 초안을 적용하지 않습니다.' : '개별 대상과의 연결은 확인되지 않았습니다.', href } [별도 조건식 없음]

## H-5022b86f054b

**DraftArchives** · [src/ui/draft-archives.tsx:60](../../../src/ui/draft-archives.tsx#L60)

분기 조건과 가능한 갈림길:

- B-7a69ed7abf0d · ConditionalExpression · data → truthy / falsy; 바깥 조건: 별도 조건식 없음 (61행).
- B-cdb014d08415 · ConditionalExpression · result.issues.some(issue => issue.stage === 'enumeration') → truthy / falsy; 바깥 조건: truthy: result.issues.length > 0 (96행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 61행 | truthy: data | storagePrefix(data)<br>call |
| 62행 | 별도 조건식 없음 | useState(() => listDraftArchives(undefined, prefix))<br>call<br>전달 콜백: H-ab04b9842e11 |
| 63행 | 별도 조건식 없음 | useState('')<br>call |
| 63행 | 별도 조건식 없음 | useState('')<br>call |
| 65행 | 별도 조건식 없음 | result.archives.filter(item => item.sourceKey.startsWith(prefix))<br>preservation-boundary<br>전달 콜백: H-a30070169afb |
| 96행 | truthy: result.issues.length > 0 | result.issues.some(issue => issue.stage === 'enumeration')<br>call<br>전달 콜백: H-b3123fe4e1f0 |
| 100행 | 별도 조건식 없음 | archives.map((archive, index) => { const target = archiveTarget(archive.sourceKey, data); return <Card key={archive.archiveKey}> <h2>{index + 1}. {target.label}</h2> <p>{target.relation}</p> <dl className="archive-meta"> <dt>보관 시각</dt><dd>{archive.metadata?.archivedAt ?? '알 수 없음 · 확인된 시각 정보가 없습니다.'}</dd> <dt>보관 이유</dt><dd>{archive.metadata?.reason ?? '별도 이유 정보가 없습니다. 손상 초안 보관 위치에서 찾았습니다.'}</dd> <dt>현재 초안</dt><dd>{currentRelation[archive.currentDraft]}</dd> </dl> {archive.issues.length > 0 && <p role="alert">일부 정보를 읽지 못했습니다. 확인 가능한 원문만 표시하며, 다시 읽기로 재시도할 수 있습니다.</p>} <details><summary>원문과 식별 정보 확인</summary> <dl className="archive-meta"><dt>원래 저장 위치</dt><dd>{archive.sourceKey}</dd><dt>보관본 식별자</dt><dd>{archi … [전체 인수는 JSON·소스])<br>preservation-boundary<br>전달 콜백: H-22dc18c6e2ce |

반환/조기 중단: 91행 <render> [별도 조건식 없음]

## H-ab04b9842e11

**@callback:useState** · [src/ui/draft-archives.tsx:62](../../../src/ui/draft-archives.tsx#L62)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 62행 | 별도 조건식 없음 | listDraftArchives(undefined, prefix)<br>preservation-boundary |

## H-5a8416acfd79

**refresh** · [src/ui/draft-archives.tsx:64](../../../src/ui/draft-archives.tsx#L64)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 64행 | 별도 조건식 없음 | setResult(listDraftArchives(undefined, prefix))<br>state-update |
| 64행 | 별도 조건식 없음 | listDraftArchives(undefined, prefix)<br>preservation-boundary |
| 64행 | 별도 조건식 없음 | setNotice('보관본 목록을 다시 읽었습니다.')<br>state-update |

## H-a30070169afb

**@callback:result.archives.filter** · [src/ui/draft-archives.tsx:65](../../../src/ui/draft-archives.tsx#L65)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 65행 | 별도 조건식 없음 | item.sourceKey.startsWith(prefix)<br>call |

## H-66b2ad3fe7a0

**download** · [src/ui/draft-archives.tsx:66](../../../src/ui/draft-archives.tsx#L66)

분기 조건과 가능한 갈림길:

- B-ff10bd60e8f6 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (68행).
- B-3dd382e16402 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (74행).
- B-564710d68031 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (78행).
- B-d2903eecdc7e · IfStatement · url → truthy / falsy; 바깥 조건: exception: exception (79행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 69행 | 별도 조건식 없음 | serializeDraftArchive(archive)<br>preservation-boundary |
| 70행 | 별도 조건식 없음 | URL.createObjectURL(new Blob([content], { type: 'application/json;charset=utf-8' }))<br>call |
| 71행 | 별도 조건식 없음 | document.createElement('a')<br>call |
| 72행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 73행 | 별도 조건식 없음 | document.body.append(link)<br>call |
| 74행 | 별도 조건식 없음 | link.click()<br>call |
| 74행 | always-after-try: try 완료 또는 예외 이후 | link.remove()<br>call |
| 76행 | 별도 조건식 없음 | window.setTimeout(() => URL.revokeObjectURL(savedUrl), 60_000)<br>call<br>전달 콜백: H-c4a28900a763 |
| 77행 | 별도 조건식 없음 | setExportError('')<br>state-update |
| 77행 | 별도 조건식 없음 | setNotice('파일 다운로드를 요청했습니다. 브라우저의 다운로드 목록에서 파일을 확인해 주세요. 보관본은 그대로 남아 있습니다.')<br>state-update |
| 79행 | exception: exception ∧ truthy: url | URL.revokeObjectURL(url)<br>call |
| 80행 | exception: exception | setNotice('')<br>state-update |
| 80행 | exception: exception | setExportError('파일 다운로드를 시작하지 못했습니다. 보관본과 현재 초안은 변경하지 않았습니다. 원문을 확인한 뒤 내보내기를 다시 시도해 주세요.')<br>state-update |

## H-c4a28900a763

**@callback:window.setTimeout** · [src/ui/draft-archives.tsx:76](../../../src/ui/draft-archives.tsx#L76)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 76행 | 별도 조건식 없음 | URL.revokeObjectURL(savedUrl)<br>call |

## H-7bd4221f4cfb

**copy** · [src/ui/draft-archives.tsx:83](../../../src/ui/draft-archives.tsx#L83) · async

분기 조건과 가능한 갈림길:

- B-9d42f7ccd4ac · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (84행).
- B-ecadcf91dc98 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (87행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 85행 | 별도 조건식 없음 | navigator.clipboard.writeText(serializeDraftArchive(archive))<br>call |
| 85행 | 별도 조건식 없음 | serializeDraftArchive(archive)<br>preservation-boundary |
| 86행 | 별도 조건식 없음 | setExportError('')<br>state-update |
| 86행 | 별도 조건식 없음 | setNotice('원문과 보관 정보를 복사했습니다. 텍스트 파일에 붙여 넣어 별도로 보관해 주세요. 현재 초안과 보관본은 그대로 남습니다.')<br>state-update |
| 88행 | exception: exception | setNotice('')<br>state-update |
| 88행 | exception: exception | setExportError('복사하지 못했습니다. 보관본과 현재 초안은 변경하지 않았습니다. 복사를 다시 시도하거나 원문 내보내기로 파일 다운로드를 요청해 주세요.')<br>state-update |

## H-b3123fe4e1f0

**@callback:result.issues.some** · [src/ui/draft-archives.tsx:96](../../../src/ui/draft-archives.tsx#L96)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-22dc18c6e2ce

**@callback:archives.map** · [src/ui/draft-archives.tsx:100](../../../src/ui/draft-archives.tsx#L100)

분기 조건과 가능한 갈림길:

- B-bfac0523f985 · ConditionalExpression · archive.raw === null → truthy / falsy; 바깥 조건: 별도 조건식 없음 (113행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 101행 | 별도 조건식 없음 | archiveTarget(archive.sourceKey, data)<br>preservation-boundary → [H-43abaea83fa8](ui__draft-archives.md#h-43abaea83fa8) |

반환/조기 중단: 102행 <render> [별도 조건식 없음]

## H-a57340d0bac4

**@onClick** · [src/ui/draft-archives.tsx:115](../../../src/ui/draft-archives.tsx#L115)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 115행 | 별도 조건식 없음 | download(archive)<br>call → [H-66b2ad3fe7a0](ui__draft-archives.md#h-66b2ad3fe7a0) |

## H-9f98ed369a78

**@onClick** · [src/ui/draft-archives.tsx:115](../../../src/ui/draft-archives.tsx#L115)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 115행 | 별도 조건식 없음 | copy(archive)<br>call → [H-7bd4221f4cfb](ui__draft-archives.md#h-7bd4221f4cfb) |

