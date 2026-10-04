# src/ui/criteria-editor.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-f8ded75241ce

**readDraft** · [src/ui/criteria-editor.tsx:15](../../../src/ui/criteria-editor.tsx#L15)

분기 조건과 가능한 갈림길:

- B-89fd6a68cf56 · IfStatement · !raw → truthy / falsy; 바깥 조건: 별도 조건식 없음 (17행).
- B-7135e54e58ed · IfStatement · !value || value.targetId !== targetId || !Array.isArray(value.base) || !Array.isArray(value.rows) || typeof value.expectedToken !== 'string' || !['topic', 'subject', 'all'].includes(value.scope) || value.rows.length > 100 || new Set(value.rows.map(row => row.key)).size !== value.rows.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (19행).
- B-73072372503a · IfStatement · !row || typeof row.key !== 'string' || !row.key || (row.id !== null && typeof row.id !== 'string') || !['T', 'R', 'A', 'C', 'E'].includes(row.group) || typeof row.label !== 'string' || !['required', 'optional', 'excluded'].includes(row.mode) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (24행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | 별도 조건식 없음 | readRescuedDraft(key)<br>preservation-boundary |
| 16행 | nullish: readRescuedDraft(key) | localStorage.getItem(key)<br>preservation-boundary |
| 18행 | 별도 조건식 없음 | JSON.parse(raw)<br>call |
| 19행 | falsy: !value \|\| value.targetId !== targetId | Array.isArray(value.base)<br>call |
| 19행 | falsy: !value \|\| value.targetId !== targetId \|\| !Array.isArray(value.base) | Array.isArray(value.rows)<br>call |
| 20행 | falsy: !value \|\| value.targetId !== targetId \|\| !Array.isArray(value.base) \|\| !Array.isArray(value.rows)<br>    \|\| typeof value.expectedToken !== 'string' | ['topic', 'subject', 'all'].includes(value.scope)<br>call |
| 21행 | falsy: !value \|\| value.targetId !== targetId \|\| !Array.isArray(value.base) \|\| !Array.isArray(value.rows)<br>    \|\| typeof value.expectedToken !== 'string' \|\| !['topic', 'subject', 'all'].includes(value.scope)<br>    \|\| value.rows.length > 100 | value.rows.map(row => row.key)<br>call<br>전달 콜백: H-cc32912e3a6c |
| 21행 | truthy: !value \|\| value.targetId !== targetId \|\| !Array.isArray(value.base) \|\| !Array.isArray(value.rows)<br>    \|\| typeof value.expectedToken !== 'string' \|\| !['topic', 'subject', 'all'].includes(value.scope)<br>    \|\| value.rows.length > 100 \|\| new Set(value.rows.map(row => row.key)).size !== value.rows.length | Error('기준 조정 초안의 형식을 확인하지 못했습니다. 원문을 덮어쓰지 않았습니다.')<br>call |
| 22행 | 별도 조건식 없음 | value.base.forEach(item => { validateTraceDefinition(item); })<br>call<br>전달 콜백: H-5e63a2ce1a1b |
| 25행 | falsy: !row \|\| typeof row.key !== 'string' \|\| !row.key \|\| (row.id !== null && typeof row.id !== 'string') | ['T', 'R', 'A', 'C', 'E'].includes(row.group)<br>call |
| 26행 | falsy: !row \|\| typeof row.key !== 'string' \|\| !row.key \|\| (row.id !== null && typeof row.id !== 'string')<br>      \|\| !['T', 'R', 'A', 'C', 'E'].includes(row.group) \|\| typeof row.label !== 'string' | ['required', 'optional', 'excluded'].includes(row.mode)<br>call |
| 26행 | truthy: !row \|\| typeof row.key !== 'string' \|\| !row.key \|\| (row.id !== null && typeof row.id !== 'string')<br>      \|\| !['T', 'R', 'A', 'C', 'E'].includes(row.group) \|\| typeof row.label !== 'string'<br>      \|\| !['required', 'optional', 'excluded'].includes(row.mode) | Error('기준 조정 초안의 입력을 확인하지 못했습니다. 원문을 덮어쓰지 않았습니다.')<br>call |

반환/조기 중단: 17행 null [truthy: !raw]; 28행 value [별도 조건식 없음]

throw: 21행 Error('기준 조정 초안의 형식을 확인하지 못했습니다. 원문을 덮어쓰지 않았습니다.'); 26행 Error('기준 조정 초안의 입력을 확인하지 못했습니다. 원문을 덮어쓰지 않았습니다.')

## H-cc32912e3a6c

**@callback:value.rows.map** · [src/ui/criteria-editor.tsx:21](../../../src/ui/criteria-editor.tsx#L21)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5e63a2ce1a1b

**@callback:value.base.forEach** · [src/ui/criteria-editor.tsx:22](../../../src/ui/criteria-editor.tsx#L22)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 22행 | 별도 조건식 없음 | validateTraceDefinition(item)<br>call |

## H-5da29122e7da

**CriteriaEditor** · [src/ui/criteria-editor.tsx:38](../../../src/ui/criteria-editor.tsx#L38)


반환/조기 중단: 39행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f2640151c36c

**CriteriaEditorForTarget** · [src/ui/criteria-editor.tsx:41](../../../src/ui/criteria-editor.tsx#L41)

분기 조건과 가능한 갈림길:

- B-e178e311790d · ConditionalExpression · draftHasUnstoredText(key) → truthy / falsy; 바깥 조건: falsy: boot.error (51행).
- B-5d1fc8d6ef42 · IfStatement · !target → truthy / falsy; 바깥 조건: 별도 조건식 없음 (54행).
- B-e8e79faa8bda · ConditionalExpression · draft → truthy / falsy; 바깥 조건: 별도 조건식 없음 (86행).
- B-44f50765d68c · ConditionalExpression · draft → truthy / falsy; 바깥 조건: 별도 조건식 없음 (89행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 42행 | 별도 조건식 없음 | encodeURIComponent(data.userId)<br>call |
| 42행 | 별도 조건식 없음 | encodeURIComponent(targetId)<br>call |
| 43행 | 별도 조건식 없음 | useState(() => { try { return { draft: readDraft(key, targetId), error: '' }; } catch { return { draft: null, error: '기준 조정 초안을 읽지 못했습니다. 원문을 덮어쓰지 않았습니다.' }; } })<br>call<br>전달 콜백: H-aeef9fecb1c1 |
| 47행 | 별도 조건식 없음 | useState(Boolean(boot.error))<br>call |
| 47행 | 별도 조건식 없음 | Boolean(boot.error)<br>call |
| 48행 | 별도 조건식 없음 | useState(false)<br>call |
| 49행 | 별도 조건식 없음 | useState(boot.draft)<br>call |
| 50행 | 별도 조건식 없음 | useState(false)<br>call |
| 51행 | 별도 조건식 없음 | useState(boot.error \|\| (draftHasUnstoredText(key) ? '저장에 실패한 기준 입력을 이 창에서 유지합니다. 다시 저장하거나 복사해 주세요.' : ''))<br>call |
| 51행 | falsy: boot.error | draftHasUnstoredText(key)<br>preservation-boundary |
| 52행 | 별도 조건식 없음 | useState(null)<br>call |
| 53행 | 별도 조건식 없음 | data.nodes.find(node => node.id === targetId)<br>call<br>전달 콜백: H-f99bdc9a0bab |
| 68행 | 별도 조건식 없음 | Boolean(draft && draft.expectedToken !== criteriaRevisionToken(data))<br>call |
| 68행 | truthy: draft | criteriaRevisionToken(data)<br>call |
| 86행 | truthy: draft | criteriaScopeTargets(data, targetId, draft.scope)<br>call |
| 121행 | truthy: open ∧ truthy: draft | targets.filter(row => row.scope === 'topic')<br>call<br>전달 콜백: H-479a92201e98 |
| 123행 | truthy: open ∧ truthy: draft | draft.rows.map((row, index) => <fieldset key={row.key}> <legend>항목 {index + 1}</legend> <div className="field-stack"> <Input label="항목 문구" data-editing-context={`criteria:${targetId}:${row.key}`} value={row.label} maxLength={180} onChange={event => changeRow(index, { label: event.target.value })} /> <Select label="활동" value={row.group} onChange={event => changeRow(index, { group: event.target.value })}> {Object.entries(TRACE_GROUP_LABELS).map(([group, label]) => <option key={group} value={group}>{label}</option>)} </Select> <Select label="적용 여부" value={row.mode} onChange={event => changeRow(index, { mode: event.target.value as CriteriaEditRow['mode'] })}> <option value="required">기본 기준</option><option valu … [전체 인수는 JSON·소스])<br>preservation-boundary<br>전달 콜백: H-2c7fa10aeaa7 |
| 138행 | truthy: open ∧ truthy: draft ∧ truthy: stale | resolveCriteria(data, targetId).items.map(item => <li key={item.id}>{item.label} · {item.mode === 'excluded' ? '제외' : item.mode === 'optional' ? '선택' : '기본'}</li>)<br>call<br>전달 콜백: H-e341d6394ccb |
| 138행 | truthy: open ∧ truthy: draft ∧ truthy: stale | resolveCriteria(data, targetId)<br>call |

반환/조기 중단: 54행 null [truthy: !target]; 87행 <render> [별도 조건식 없음]

## H-aeef9fecb1c1

**@callback:useState** · [src/ui/criteria-editor.tsx:43](../../../src/ui/criteria-editor.tsx#L43)

분기 조건과 가능한 갈림길:

- B-3b83aa04cb01 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (44행).
- B-767a8aa97613 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (45행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 44행 | 별도 조건식 없음 | readDraft(key, targetId)<br>preservation-boundary → [H-f8ded75241ce](ui__criteria-editor.md#h-f8ded75241ce) |

반환/조기 중단: 44행 { draft: readDraft(key, targetId), error: '' } [별도 조건식 없음]; 45행 { draft: null, error: '기준 조정 초안을 읽지 못했습니다. 원문을 덮어쓰지 않았습니다.' } [exception: exception]

## H-f99bdc9a0bab

**@callback:data.nodes.find** · [src/ui/criteria-editor.tsx:53](../../../src/ui/criteria-editor.tsx#L53)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3c4aec1ec4ff

**update** · [src/ui/criteria-editor.tsx:55](../../../src/ui/criteria-editor.tsx#L55)

분기 조건과 가능한 갈림길:

- B-d013d2154f6a · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (57행).
- B-256cad809b56 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (58행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 56행 | 별도 조건식 없음 | setDraft(next)<br>state-update |
| 57행 | 별도 조건식 없음 | storeDraftSafely(key, JSON.stringify(next))<br>preservation-boundary |
| 57행 | 별도 조건식 없음 | JSON.stringify(next)<br>call |
| 57행 | 별도 조건식 없음 | setError('')<br>state-update |
| 58행 | exception: exception | setError('기준 조정 초안을 보관하지 못했습니다. 입력은 화면에 남아 있습니다. 창을 닫기 전에 내용을 복사해 주세요.')<br>state-update |

## H-610513268682

**freshDraft** · [src/ui/criteria-editor.tsx:60](../../../src/ui/criteria-editor.tsx#L60)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 61행 | 별도 조건식 없음 | resolveCriteria(data, targetId)<br>call |
| 62행 | 별도 조건식 없음 | current.items.map(item => ({ ...item, key: item.id }))<br>call<br>전달 콜백: H-351136120d8e |
| 62행 | 별도 조건식 없음 | criteriaRevisionToken(data)<br>call |

반환/조기 중단: 62행 { targetId, base: current.items, rows: current.items.map(item => ({ ...item, key: item.id })), expectedToken: criteriaRevisionToken(data), scope: 'topic' } [별도 조건식 없음]

## H-351136120d8e

**@callback:current.items.map** · [src/ui/criteria-editor.tsx:62](../../../src/ui/criteria-editor.tsx#L62)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0860d76c6ad7

**launch** · [src/ui/criteria-editor.tsx:64](../../../src/ui/criteria-editor.tsx#L64)

분기 조건과 가능한 갈림길:

- B-46fc60c37262 · IfStatement · !draft && !blocked && !cleanupPending → truthy / falsy; 바깥 조건: 별도 조건식 없음 (65행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 65행 | truthy: !draft && !blocked && !cleanupPending | update(freshDraft())<br>call → [H-3c4aec1ec4ff](ui__criteria-editor.md#h-3c4aec1ec4ff) |
| 65행 | truthy: !draft && !blocked && !cleanupPending | freshDraft()<br>preservation-boundary → [H-610513268682](ui__criteria-editor.md#h-610513268682) |
| 66행 | 별도 조건식 없음 | setOpen(true)<br>state-update |

## H-b2c2b9f134b1

**changeRow** · [src/ui/criteria-editor.tsx:69](../../../src/ui/criteria-editor.tsx#L69)

분기 조건과 가능한 갈림길:

- B-f5c3f59014a7 · IfStatement · draft → truthy / falsy; 바깥 조건: 별도 조건식 없음 (70행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 70행 | truthy: draft | update({ ...draft, rows: draft.rows.map((row, rowIndex) => rowIndex === index ? { ...row, ...patch } : row) })<br>call → [H-3c4aec1ec4ff](ui__criteria-editor.md#h-3c4aec1ec4ff) |
| 70행 | truthy: draft | draft.rows.map((row, rowIndex) => rowIndex === index ? { ...row, ...patch } : row)<br>preservation-boundary<br>전달 콜백: H-908d3af29bbf |

## H-908d3af29bbf

**@callback:draft.rows.map** · [src/ui/criteria-editor.tsx:70](../../../src/ui/criteria-editor.tsx#L70)

분기 조건과 가능한 갈림길:

- B-3242c93791f3 · ConditionalExpression · rowIndex === index → truthy / falsy; 바깥 조건: truthy: draft (70행).

## H-6b69574b43e6

**apply** · [src/ui/criteria-editor.tsx:72](../../../src/ui/criteria-editor.tsx#L72)

분기 조건과 가능한 갈림길:

- B-028f407e3bc4 · IfStatement · !draft || stale || blocked || cleanupPending → truthy / falsy; 바깥 조건: 별도 조건식 없음 (73행).
- B-a53629740561 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (74행).
- B-a7be8c772b2f · IfStatement · !result → truthy / falsy; 바깥 조건: 별도 조건식 없음 (78행).
- B-19fc362d9549 · IfStatement · revision && onUndo → truthy / falsy; 바깥 조건: 별도 조건식 없음 (80행).
- B-9f5c766f1503 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (82행).
- B-54b02d51918e · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (83행).
- B-1dc0f34fda37 · CatchClause · reason → exception; 바깥 조건: 별도 조건식 없음 (84행).
- B-38590a3f736c · ConditionalExpression · reason instanceof Error → truthy / falsy; 바깥 조건: exception: reason (84행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 75행 | 별도 조건식 없음 | prepareCriteriaItems(draft.base, draft.rows, () => crypto.randomUUID())<br>call<br>전달 콜백: H-540030fcbdc1 |
| 76행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 77행 | 별도 조건식 없음 | onApply({ id, targetId, scope: draft.scope, expectedToken: draft.expectedToken, items })<br>call |
| 78행 | truthy: !result | setError('기준을 적용하지 못했습니다. 작성한 입력은 초안에 남아 있습니다.')<br>state-update |
| 79행 | 별도 조건식 없음 | result.revisions.find(row => row.collection === 'criteria' && row.entityId === id)<br>call<br>전달 콜백: H-da5d10e32f56 |
| 80행 | truthy: revision && onUndo | setUndo({ revisionId: revision.id, expectedVersion: revision.after.version })<br>state-update |
| 81행 | 별도 조건식 없음 | setDraft(null)<br>state-update |
| 81행 | 별도 조건식 없음 | setOpen(false)<br>state-update |
| 81행 | 별도 조건식 없음 | setError('')<br>state-update |
| 82행 | 별도 조건식 없음 | clearStoredDraft(key)<br>preservation-boundary |
| 83행 | exception: exception | setCleanupPending(true)<br>state-update |
| 83행 | exception: exception | setError('기준은 적용했습니다. 이전 초안 정리를 못해 이 창에서 재적용을 막고 있습니다. 창을 닫기 전에 초안 정리를 다시 시도해 주세요.')<br>state-update |
| 84행 | exception: reason | setError(reason instanceof Error ? reason.message : '기준을 적용하지 못했습니다. 입력을 보존했습니다.')<br>state-update |

반환/조기 중단: 73행 <render> [truthy: !draft || stale || blocked || cleanupPending]; 78행 <render> [truthy: !result]

## H-540030fcbdc1

**@callback:prepareCriteriaItems** · [src/ui/criteria-editor.tsx:75](../../../src/ui/criteria-editor.tsx#L75)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 75행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |

## H-da5d10e32f56

**@callback:result.revisions.find** · [src/ui/criteria-editor.tsx:79](../../../src/ui/criteria-editor.tsx#L79)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2fbf20ad6b7d

**@onClick** · [src/ui/criteria-editor.tsx:90](../../../src/ui/criteria-editor.tsx#L90)

분기 조건과 가능한 갈림길:

- B-9f38b23186a6 · IfStatement · result → truthy / falsy; 바깥 조건: truthy: undo && onUndo (92행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 91행 | truthy: undo && onUndo | onUndo(undo.revisionId, undo.expectedVersion)<br>call |
| 92행 | truthy: undo && onUndo ∧ truthy: result | setUndo(null)<br>state-update |
| 92행 | truthy: undo && onUndo ∧ truthy: result | setError('')<br>state-update |
| 93행 | truthy: undo && onUndo ∧ falsy: result | setError('그 뒤의 변경이 있어 기준을 되돌리지 못했습니다. 현재 기준과 기록은 보존했습니다.')<br>state-update |

## H-f6881f7fbf6e

**@onClose** · [src/ui/criteria-editor.tsx:96](../../../src/ui/criteria-editor.tsx#L96)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 96행 | truthy: open | setOpen(false)<br>state-update |

## H-2fa0a1173df7

**@onClick** · [src/ui/criteria-editor.tsx:99](../../../src/ui/criteria-editor.tsx#L99)

분기 조건과 가능한 갈림길:

- B-5b812ac1c04d · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: open ∧ truthy: cleanupPending (100행).
- B-b2889b69892c · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: open ∧ truthy: cleanupPending (101행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 100행 | truthy: open ∧ truthy: cleanupPending | clearStoredDraft(key)<br>preservation-boundary |
| 100행 | truthy: open ∧ truthy: cleanupPending | setCleanupPending(false)<br>state-update |
| 100행 | truthy: open ∧ truthy: cleanupPending | setError('')<br>state-update |
| 101행 | truthy: open ∧ truthy: cleanupPending ∧ exception: exception | setError('초안 정리를 완료하지 못했습니다. 적용한 기준은 유지하며 다시 적용하지 않습니다.')<br>state-update |

## H-b02d93e3d811

**@onClick** · [src/ui/criteria-editor.tsx:104](../../../src/ui/criteria-editor.tsx#L104)

분기 조건과 가능한 갈림길:

- B-e996c2a072e4 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: open ∧ truthy: blocked (105행).
- B-5a1595cf4231 · IfStatement · !restored → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: blocked (105행).
- B-32723a67e161 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: open ∧ truthy: blocked (106행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 105행 | truthy: open ∧ truthy: blocked | readDraft(key, targetId)<br>preservation-boundary → [H-f8ded75241ce](ui__criteria-editor.md#h-f8ded75241ce) |
| 105행 | truthy: open ∧ truthy: blocked | setBlocked(false)<br>state-update |
| 105행 | truthy: open ∧ truthy: blocked | setDraft(restored)<br>state-update |
| 105행 | truthy: open ∧ truthy: blocked | setError('')<br>state-update |
| 105행 | truthy: open ∧ truthy: blocked ∧ truthy: !restored | update(freshDraft())<br>call → [H-3c4aec1ec4ff](ui__criteria-editor.md#h-3c4aec1ec4ff) |
| 105행 | truthy: open ∧ truthy: blocked ∧ truthy: !restored | freshDraft()<br>preservation-boundary → [H-610513268682](ui__criteria-editor.md#h-610513268682) |
| 106행 | truthy: open ∧ truthy: blocked ∧ exception: exception | setError('초안을 다시 읽지 못했습니다. 기존 원문을 유지했습니다.')<br>state-update |

## H-5c7e0f8c8404

**@onClick** · [src/ui/criteria-editor.tsx:109](../../../src/ui/criteria-editor.tsx#L109)

분기 조건과 가능한 갈림길:

- B-aa0af4b0fd0e · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: open ∧ truthy: blocked (110행).
- B-ead3b4fa98d0 · CatchClause · reason → exception; 바깥 조건: truthy: open ∧ truthy: blocked (111행).
- B-8da38912baf7 · ConditionalExpression · reason instanceof DraftArchiveError → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: blocked ∧ exception: reason (111행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 110행 | truthy: open ∧ truthy: blocked | archiveDamagedDraft(key)<br>preservation-boundary |
| 110행 | truthy: open ∧ truthy: blocked | setBlocked(false)<br>state-update |
| 110행 | truthy: open ∧ truthy: blocked | update(freshDraft())<br>call → [H-3c4aec1ec4ff](ui__criteria-editor.md#h-3c4aec1ec4ff) |
| 110행 | truthy: open ∧ truthy: blocked | freshDraft()<br>preservation-boundary → [H-610513268682](ui__criteria-editor.md#h-610513268682) |
| 111행 | truthy: open ∧ truthy: blocked ∧ exception: reason | setError(reason instanceof DraftArchiveError ? reason.message : '원본 초안 사본을 보관하지 못했습니다. 기존 원문을 유지했습니다. 저장 공간을 확보한 뒤 다시 시도해 주세요.')<br>state-update |

## H-93fbd63b2672

**@onClick** · [src/ui/criteria-editor.tsx:114](../../../src/ui/criteria-editor.tsx#L114)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 114행 | truthy: open ∧ truthy: !blocked && draft && error && !cleanupPending | update(draft)<br>call → [H-3c4aec1ec4ff](ui__criteria-editor.md#h-3c4aec1ec4ff) |

## H-c911459b2b8e

**@onChange** · [src/ui/criteria-editor.tsx:116](../../../src/ui/criteria-editor.tsx#L116)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 116행 | truthy: open ∧ truthy: draft | update({ ...draft, scope: event.target.value as CriteriaChange['scope'] })<br>call → [H-3c4aec1ec4ff](ui__criteria-editor.md#h-3c4aec1ec4ff) |

## H-479a92201e98

**@callback:targets.filter** · [src/ui/criteria-editor.tsx:121](../../../src/ui/criteria-editor.tsx#L121)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2c7fa10aeaa7

**@callback:draft.rows.map** · [src/ui/criteria-editor.tsx:123](../../../src/ui/criteria-editor.tsx#L123)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 128행 | truthy: open ∧ truthy: draft | Object.entries(TRACE_GROUP_LABELS).map(([group, label]) => <option key={group} value={group}>{label}</option>)<br>call<br>전달 콜백: H-26511d14c9c4 |
| 128행 | truthy: open ∧ truthy: draft | Object.entries(TRACE_GROUP_LABELS)<br>call |

## H-3531a9c57541

**@onChange** · [src/ui/criteria-editor.tsx:126](../../../src/ui/criteria-editor.tsx#L126)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 126행 | truthy: open ∧ truthy: draft | changeRow(index, { label: event.target.value })<br>call → [H-b2c2b9f134b1](ui__criteria-editor.md#h-b2c2b9f134b1) |

## H-25aa165efab8

**@onChange** · [src/ui/criteria-editor.tsx:127](../../../src/ui/criteria-editor.tsx#L127)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 127행 | truthy: open ∧ truthy: draft | changeRow(index, { group: event.target.value })<br>call → [H-b2c2b9f134b1](ui__criteria-editor.md#h-b2c2b9f134b1) |

## H-26511d14c9c4

**@callback:Object.entries(TRACE_GROUP_LABELS).map** · [src/ui/criteria-editor.tsx:128](../../../src/ui/criteria-editor.tsx#L128)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f7431516d23e

**@onChange** · [src/ui/criteria-editor.tsx:130](../../../src/ui/criteria-editor.tsx#L130)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 130행 | truthy: open ∧ truthy: draft | changeRow(index, { mode: event.target.value as CriteriaEditRow['mode'] })<br>call → [H-b2c2b9f134b1](ui__criteria-editor.md#h-b2c2b9f134b1) |

## H-eb6a781c0e81

**@onClick** · [src/ui/criteria-editor.tsx:135](../../../src/ui/criteria-editor.tsx#L135)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 135행 | truthy: open ∧ truthy: draft | update({ ...draft, rows: [...draft.rows, { id: null, key: crypto.randomUUID(), group: 'T', label: '', mode: 'optional' }] })<br>call → [H-3c4aec1ec4ff](ui__criteria-editor.md#h-3c4aec1ec4ff) |
| 135행 | truthy: open ∧ truthy: draft | crypto.randomUUID()<br>call |

## H-e341d6394ccb

**@callback:resolveCriteria(data, targetId).items.map** · [src/ui/criteria-editor.tsx:138](../../../src/ui/criteria-editor.tsx#L138)

분기 조건과 가능한 갈림길:

- B-589760d6b142 · ConditionalExpression · item.mode === 'excluded' → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: draft ∧ truthy: stale (138행).
- B-57a40a6824c5 · ConditionalExpression · item.mode === 'optional' → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: draft ∧ truthy: stale ∧ falsy: item.mode === 'excluded' (138행).

## H-4c4ec4e2f627

**@onClick** · [src/ui/criteria-editor.tsx:139](../../../src/ui/criteria-editor.tsx#L139)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 139행 | truthy: open ∧ truthy: draft ∧ truthy: stale | update({ ...draft, expectedToken: criteriaRevisionToken(data) })<br>call → [H-3c4aec1ec4ff](ui__criteria-editor.md#h-3c4aec1ec4ff) |
| 139행 | truthy: open ∧ truthy: draft ∧ truthy: stale | criteriaRevisionToken(data)<br>call |

## H-6aae239216e7

**@onClick** · [src/ui/criteria-editor.tsx:141](../../../src/ui/criteria-editor.tsx#L141)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 141행 | truthy: open ∧ truthy: draft | setOpen(false)<br>state-update |

