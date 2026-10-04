# src/ui/experience-recovery.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-38e0c8b05ca4

**recoveryError** · [src/ui/experience-recovery.tsx:8](../../../src/ui/experience-recovery.tsx#L8)

분기 조건과 가능한 갈림길:

- B-496e71efc518 · ConditionalExpression · cause instanceof DOMException → truthy / falsy; 바깥 조건: 별도 조건식 없음 (8행).
- B-688dd9d97daa · ConditionalExpression · cause.name === 'QuotaExceededError' → truthy / falsy; 바깥 조건: truthy: cause instanceof DOMException (9행).
- B-485ff19f0a34 · ConditionalExpression · cause instanceof Error → truthy / falsy; 바깥 조건: falsy: cause instanceof DOMException (12행).

## H-86441aa9b0b0

**ExperienceRecoveryControl** · [src/ui/experience-recovery.tsx:14](../../../src/ui/experience-recovery.tsx#L14)

분기 조건과 가능한 갈림길:

- B-73fb478c706e · ConditionalExpression · snapshot?.key === key → truthy / falsy; 바깥 조건: 별도 조건식 없음 (27행).
- B-b9f4d5b3decb · ConditionalExpression · current.archives.length > 0 → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: current (68행).
- B-6dcdf9636178 · ConditionalExpression · current.issues.length → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: current ∧ falsy: current.archives.length > 0 (82행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 17행 | 별도 조건식 없음 | experienceKey(data)<br>call |
| 18행 | 별도 조건식 없음 | useState(false)<br>call |
| 19행 | 별도 조건식 없음 | useState(null)<br>call |
| 20행 | 별도 조건식 없음 | useState('')<br>call |
| 21행 | 별도 조건식 없음 | useState(20)<br>call |
| 22행 | 별도 조건식 없음 | useState('')<br>call |
| 23행 | 별도 조건식 없음 | useState('')<br>call |
| 24행 | 별도 조건식 없음 | useEffect(() => { setOpen(false); setSnapshot(previous => previous?.key === key ? previous : null); setSelectedKey(''); setNotice(''); setError(''); }, [key])<br>call<br>전달 콜백: H-86b9a1fb6194 |
| 71행 | truthy: open ∧ truthy: current ∧ truthy: current.archives.length > 0 | current.archives.slice(0, limit).map((archive, index) => <option key={archive.archiveKey} value={archive.archiveKey}> 보관본 {index + 1} · {archive.metadata?.archivedAt ? new Date(archive.metadata.archivedAt).toLocaleString('ko-KR') : '보관 시각 미확인'}{archive.usable ? '' : ' · 원문만 확인 가능'} </option>)<br>preservation-boundary<br>전달 콜백: H-cd988b6077df |
| 71행 | truthy: open ∧ truthy: current ∧ truthy: current.archives.length > 0 | current.archives.slice(0, limit)<br>preservation-boundary |

반환/조기 중단: 49행 <render> [별도 조건식 없음]

## H-86b9a1fb6194

**@callback:useEffect** · [src/ui/experience-recovery.tsx:24](../../../src/ui/experience-recovery.tsx#L24)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 25행 | 별도 조건식 없음 | setOpen(false)<br>state-update |
| 25행 | 별도 조건식 없음 | setSnapshot(previous => previous?.key === key ? previous : null)<br>state-update<br>전달 콜백: H-288a705788b9 |
| 25행 | 별도 조건식 없음 | setSelectedKey('')<br>state-update |
| 25행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 25행 | 별도 조건식 없음 | setError('')<br>state-update |

## H-288a705788b9

**@callback:setSnapshot** · [src/ui/experience-recovery.tsx:25](../../../src/ui/experience-recovery.tsx#L25)

분기 조건과 가능한 갈림길:

- B-518bd5fc36de · ConditionalExpression · previous?.key === key → truthy / falsy; 바깥 조건: 별도 조건식 없음 (25행).

## H-fa04b7b9fc2e

**inspect** · [src/ui/experience-recovery.tsx:29](../../../src/ui/experience-recovery.tsx#L29)

분기 조건과 가능한 갈림길:

- B-3360052357c5 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (31행).
- B-e437668ca531 · CatchClause · cause → exception; 바깥 조건: 별도 조건식 없음 (32행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 30행 | 별도 조건식 없음 | setSelectedKey('')<br>state-update |
| 30행 | 별도 조건식 없음 | setLimit(20)<br>state-update |
| 30행 | 별도 조건식 없음 | setError('')<br>state-update |
| 31행 | 별도 조건식 없음 | setSnapshot(inspectExperienceRecovery(data))<br>state-update |
| 31행 | 별도 조건식 없음 | inspectExperienceRecovery(data)<br>preservation-boundary |
| 32행 | exception: cause | setSnapshot(null)<br>state-update |
| 32행 | exception: cause | setError(recoveryError(cause))<br>state-update |
| 32행 | exception: cause | recoveryError(cause)<br>preservation-boundary → [H-38e0c8b05ca4](ui__experience-recovery.md#h-38e0c8b05ca4) |

## H-bc058d68a639

**restore** · [src/ui/experience-recovery.tsx:34](../../../src/ui/experience-recovery.tsx#L34)

분기 조건과 가능한 갈림길:

- B-7bd2149d85da · IfStatement · !current || (kind === 'archive' && (!selected?.usable || selected.raw === null)) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (35행).
- B-27d9fef31c1b · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (36행).
- B-0f0876176228 · IfStatement · kind === 'archive' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (37행).
- B-5bc75afdae22 · IfStatement · !selected?.usable || selected.raw === null → truthy / falsy; 바깥 조건: truthy: kind === 'archive' (38행).
- B-73bd92fa051c · ConditionalExpression · kind === 'archive' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (42행).
- B-42bbc42698bd · CatchClause · cause → exception; 바깥 조건: 별도 조건식 없음 (45행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 39행 | truthy: kind === 'archive' | restoreExperience(data, current, { kind, archiveKey: selected.archiveKey, raw: selected.raw })<br>call |
| 40행 | falsy: kind === 'archive' | restoreExperience(data, current, { kind })<br>call |
| 41행 | 별도 조건식 없음 | onRecovered()<br>call |
| 41행 | 별도 조건식 없음 | setOpen(false)<br>state-update |
| 42행 | 별도 조건식 없음 | setNotice(kind === 'archive' ? '확인한 보관본으로 설정을 복구했습니다. 이전 원문 사본도 유지했습니다.' : '이전 원문을 보관하고 이어가기 설정을 새로 시작했습니다. 공부 기록은 유지했습니다.')<br>state-update |
| 46행 | exception: cause | setError(recoveryError(cause))<br>state-update |
| 46행 | exception: cause | recoveryError(cause)<br>preservation-boundary → [H-38e0c8b05ca4](ui__experience-recovery.md#h-38e0c8b05ca4) |

반환/조기 중단: 35행 <render> [truthy: !current || (kind === 'archive' && (!selected?.usable || selected.raw === null))]; 38행 <render> [truthy: kind === 'archive' ∧ truthy: !selected?.usable || selected.raw === null]

## H-db9b14d2c42d

**@onClick** · [src/ui/experience-recovery.tsx:50](../../../src/ui/experience-recovery.tsx#L50)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 50행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 50행 | 별도 조건식 없음 | inspect()<br>call → [H-fa04b7b9fc2e](ui__experience-recovery.md#h-fa04b7b9fc2e) |
| 50행 | 별도 조건식 없음 | setOpen(true)<br>state-update |

## H-ab424224b121

**@onClose** · [src/ui/experience-recovery.tsx:54](../../../src/ui/experience-recovery.tsx#L54)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 54행 | truthy: open | setOpen(false)<br>state-update |

## H-6c14515dceb0

**@onClick** · [src/ui/experience-recovery.tsx:62](../../../src/ui/experience-recovery.tsx#L62)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 62행 | truthy: open ∧ truthy: current | downloadText('manseeksong-experience-recovery.json', serializeExperienceRecovery(current), 'application/json')<br>call |
| 63행 | truthy: open ∧ truthy: current | serializeExperienceRecovery(current)<br>preservation-boundary |

## H-c40673c25810

**@onChange** · [src/ui/experience-recovery.tsx:69](../../../src/ui/experience-recovery.tsx#L69)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 69행 | truthy: open ∧ truthy: current ∧ truthy: current.archives.length > 0 | setSelectedKey(event.target.value)<br>state-update |

## H-cd988b6077df

**@callback:current.archives.slice(0, limit).map** · [src/ui/experience-recovery.tsx:71](../../../src/ui/experience-recovery.tsx#L71)

분기 조건과 가능한 갈림길:

- B-f6fb0c2fb768 · ConditionalExpression · archive.metadata?.archivedAt → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: current ∧ truthy: current.archives.length > 0 (72행).
- B-7ead2d8b69d5 · ConditionalExpression · archive.usable → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: current ∧ truthy: current.archives.length > 0 (72행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 72행 | truthy: open ∧ truthy: current ∧ truthy: current.archives.length > 0 ∧ truthy: archive.metadata?.archivedAt | new Date(archive.metadata.archivedAt).toLocaleString('ko-KR')<br>preservation-boundary |

## H-9fe79d553127

**@onClick** · [src/ui/experience-recovery.tsx:75](../../../src/ui/experience-recovery.tsx#L75)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 75행 | truthy: open ∧ truthy: current ∧ truthy: current.archives.length > 0 ∧ truthy: current.archives.length > limit | setLimit(value => value + 20)<br>state-update<br>전달 콜백: H-bcee9b571274 |

## H-bcee9b571274

**@callback:setLimit** · [src/ui/experience-recovery.tsx:75](../../../src/ui/experience-recovery.tsx#L75)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-69e58b1eebd8

**@onClick** · [src/ui/experience-recovery.tsx:80](../../../src/ui/experience-recovery.tsx#L80)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 80행 | truthy: open ∧ truthy: current ∧ truthy: current.archives.length > 0 ∧ truthy: selected | restore('archive')<br>call → [H-bc058d68a639](ui__experience-recovery.md#h-bc058d68a639) |

## H-3a1dec3bfeb4

**@onClick** · [src/ui/experience-recovery.tsx:86](../../../src/ui/experience-recovery.tsx#L86)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 86행 | truthy: open ∧ truthy: current | restore('restart')<br>call → [H-bc058d68a639](ui__experience-recovery.md#h-bc058d68a639) |

## H-1d96b2a3a70b

**@onClick** · [src/ui/experience-recovery.tsx:89](../../../src/ui/experience-recovery.tsx#L89)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 89행 | truthy: open | setOpen(false)<br>state-update |

