# src/ui/outline-tree.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-65a06281c319

**OutlineTree** · [src/ui/outline-tree.tsx:8](../../../src/ui/outline-tree.tsx#L8)

분기 조건과 가능한 갈림길:

- B-348f52eaa900 · IfStatement · !rows.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (29행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | 별도 조건식 없음 | useRef(null)<br>call |
| 17행 | 별도 조건식 없음 | useMemo(() => outlineRows(nodes, subjectId, parentId), [nodes, subjectId, parentId])<br>call<br>전달 콜백: H-a7c29b5103fd |
| 18행 | 별도 조건식 없음 | useMemo(() => { const result = new Map<string, number>(); for (const record of records) { if (!record.deletedAt && record.done && record.subjectId === subjectId) result.set(record.targetId, (result.get(record.targetId) ?? 0) + 1); } return result; }, [records, subjectId])<br>call<br>전달 콜백: H-07ca888e29b9 |
| 26행 | 별도 조건식 없음 | useMemo(() => new Set(records .filter(record => !record.deletedAt && record.subjectId === subjectId) .map(record => record.targetId)), [records, subjectId])<br>call<br>전달 콜백: H-11a926951875 |
| 32행 | 별도 조건식 없음 | rows.map(({ node, depth, path, duplicateName, duplicatePath }, index) => { const fullPath = [subjectName, ...path].join(' / '); const count = counts.get(node.id) ?? 0; const hasRecord = node.role === 'topic' && recorded.has(node.id); return ( <li key={node.id} style={{ '--outline-indent': Math.min(depth, 3) } as CSSProperties}> <a className={`node-link role-${node.role}`} href={`#/node/${encodeURIComponent(node.id)}`} title={fullPath} aria-label={`${roleLabels[node.role]} ${fullPath}${duplicatePath ? ` · 구분 ID: ${node.id}` : ''}${hasRecord ? ' · 기록 있음' : ''} · 공부함 기록 ${count}회`} onKeyDown={event => { if (event.nativeEvent.isComposing \|\| event.altKey \|\| event.ctrlKey \|\| event.metaKey \|\| event.shiftKey … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-00544a5893b4 |

반환/조기 중단: 29행 empty [truthy: !rows.length]; 30행 <render> [별도 조건식 없음]

## H-a7c29b5103fd

**@callback:useMemo** · [src/ui/outline-tree.tsx:17](../../../src/ui/outline-tree.tsx#L17)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 17행 | 별도 조건식 없음 | outlineRows(nodes, subjectId, parentId)<br>call |

## H-07ca888e29b9

**@callback:useMemo** · [src/ui/outline-tree.tsx:18](../../../src/ui/outline-tree.tsx#L18)

분기 조건과 가능한 갈림길:

- B-79dc8ad35204 · IfStatement · !record.deletedAt && record.done && record.subjectId === subjectId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (21행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 22행 | truthy: !record.deletedAt && record.done && record.subjectId === subjectId | result.set(record.targetId, (result.get(record.targetId) ?? 0) + 1)<br>call |
| 22행 | truthy: !record.deletedAt && record.done && record.subjectId === subjectId | result.get(record.targetId)<br>call |

반환/조기 중단: 24행 result [별도 조건식 없음]

## H-11a926951875

**@callback:useMemo** · [src/ui/outline-tree.tsx:26](../../../src/ui/outline-tree.tsx#L26)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 26행 | 별도 조건식 없음 | records<br>    .filter(record => !record.deletedAt && record.subjectId === subjectId)<br>    .map(record => record.targetId)<br>mutation-request<br>전달 콜백: H-a2c29820f0a5 |
| 26행 | 별도 조건식 없음 | records<br>    .filter(record => !record.deletedAt && record.subjectId === subjectId)<br>call<br>전달 콜백: H-0f09f8df44de |

## H-0f09f8df44de

**@callback:records
    .filter** · [src/ui/outline-tree.tsx:27](../../../src/ui/outline-tree.tsx#L27)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a2c29820f0a5

**@callback:records
    .filter(record => !record.deletedAt && record.subjectId === subjectId)
    .map** · [src/ui/outline-tree.tsx:28](../../../src/ui/outline-tree.tsx#L28)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-00544a5893b4

**@callback:rows.map** · [src/ui/outline-tree.tsx:32](../../../src/ui/outline-tree.tsx#L32)

분기 조건과 가능한 갈림길:

- B-6b8a28ec8668 · ConditionalExpression · duplicatePath → truthy / falsy; 바깥 조건: 별도 조건식 없음 (42행).
- B-f922a3e52242 · ConditionalExpression · hasRecord → truthy / falsy; 바깥 조건: 별도 조건식 없음 (42행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 33행 | 별도 조건식 없음 | [subjectName, ...path].join(' / ')<br>call |
| 34행 | 별도 조건식 없음 | counts.get(node.id)<br>call |
| 35행 | truthy: node.role === 'topic' | recorded.has(node.id)<br>call |
| 37행 | 별도 조건식 없음 | Math.min(depth, 3)<br>call |
| 40행 | 별도 조건식 없음 | encodeURIComponent(node.id)<br>call |

반환/조기 중단: 36행 <render> [별도 조건식 없음]

## H-e9e06a863d05

**@onKeyDown** · [src/ui/outline-tree.tsx:43](../../../src/ui/outline-tree.tsx#L43)

분기 조건과 가능한 갈림길:

- B-0fcaf10a50ea · IfStatement · event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey → truthy / falsy; 바깥 조건: 별도 조건식 없음 (44행).
- B-18d71331a83d · IfStatement · event.key === 'ArrowDown' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (46행).
- B-a7ceba90be8c · IfStatement · event.key === 'ArrowUp' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (47행).
- B-184997949329 · IfStatement · event.key === 'Home' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (48행).
- B-3e8d8b00d4ce · IfStatement · event.key === 'End' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (49행).
- B-d2b2a041da9b · IfStatement · event.key === 'ArrowLeft' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (50행).
- B-e5cff81fdc8f · IfStatement · event.key === 'ArrowRight' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (51행).
- B-e407397a58be · IfStatement · next === undefined || next < 0 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (52행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 46행 | truthy: event.key === 'ArrowDown' | Math.min(index + 1, rows.length - 1)<br>call |
| 47행 | truthy: event.key === 'ArrowUp' | Math.max(index - 1, 0)<br>call |
| 50행 | truthy: event.key === 'ArrowLeft' | rows.findIndex(row => row.node.id === node.parentId)<br>call<br>전달 콜백: H-5f4f06eae15b |
| 51행 | truthy: event.key === 'ArrowRight' | rows.findIndex(row => row.node.parentId === node.id)<br>call<br>전달 콜백: H-6edf1f3c5c6e |
| 53행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |

반환/조기 중단: 44행 <render> [truthy: event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey]; 52행 <render> [truthy: next === undefined || next < 0]

## H-5f4f06eae15b

**@callback:rows.findIndex** · [src/ui/outline-tree.tsx:50](../../../src/ui/outline-tree.tsx#L50)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6edf1f3c5c6e

**@callback:rows.findIndex** · [src/ui/outline-tree.tsx:51](../../../src/ui/outline-tree.tsx#L51)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

