# src/ui/outline-table-editor.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-d609dac06c0a

**label** · Input · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:143](../../../src/ui/outline-table-editor.tsx#L143)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-9aa3887fc406](../handlers/ui__outline-table-editor.md#h-9aa3887fc406)

```tsx
event => onChange(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onKeyDown** → [@onKeyDown · H-22c1a51e5bdd](../handlers/ui__outline-table-editor.md#h-22c1a51e5bdd) → [enter · H-a31511e9d9ac](../handlers/ui__outline-table-editor.md#h-a31511e9d9ac) → [addTopic · H-a44209bafa7f](../handlers/ui__outline-table-editor.md#h-a44209bafa7f) → [@callback:edit · H-141ad7edec2d](../handlers/ui__outline-table-editor.md#h-141ad7edec2d) → [@callback:next.courses.find · H-dd55cf8d381b](../handlers/ui__outline-table-editor.md#h-dd55cf8d381b) → [@callback:next.courses.find(c => c.key === courseKey)!.units.find · H-cfc4290bea91](../handlers/ui__outline-table-editor.md#h-cfc4290bea91) → [edit · H-2bd8ff60519f](../handlers/ui__outline-table-editor.md#h-2bd8ff60519f) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4) → [topic · H-42da0112dcee](../handlers/ui__outline-table-editor.md#h-42da0112dcee) → [rowCount · H-e85e747b9a35](../handlers/ui__outline-table-editor.md#h-e85e747b9a35) → [@callback:draft.courses.reduce · H-3d2b9c286986](../handlers/ui__outline-table-editor.md#h-3d2b9c286986) → [@callback:row.units.reduce · H-24f3be9f268d](../handlers/ui__outline-table-editor.md#h-24f3be9f268d)

```tsx
event => enter(event, row.key, lastTopic)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8a95f681ca91, B-de03455532e2, B-4cf398a3c8b7, B-7f56e549c287, B-99b08e8a2d2e, B-867c33969566

## X-6f5c657e09ae

**PhotoOutlineImport · 조작/부품 영역** · PhotoOutlineImport · component-callback-contract

- 실제 소스: [src/ui/outline-table-editor.tsx:145](../../../src/ui/outline-table-editor.tsx#L145)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: repository && onSaved
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
onSaved
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-77f2edc831e2

**표로 한 번에 만들기 · 작성 이어가기** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:146](../../../src/ui/outline-table-editor.tsx#L146)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [launch · H-e264cc9ff279](../handlers/ui__outline-table-editor.md#h-e264cc9ff279) → [blank · H-5429a84bc93f](../handlers/ui__outline-table-editor.md#h-5429a84bc93f) → [course · H-4cb0ef04f66a](../handlers/ui__outline-table-editor.md#h-4cb0ef04f66a) → [unit · H-318465ac8646](../handlers/ui__outline-table-editor.md#h-318465ac8646) → [topic · H-42da0112dcee](../handlers/ui__outline-table-editor.md#h-42da0112dcee) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4)

```tsx
launch
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-032c9a4039fc, B-99b08e8a2d2e, B-867c33969566

## X-f99ba917de42

**표 생성 되돌리기** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:147](../../../src/ui/outline-table-editor.tsx#L147)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: undo && onUndo
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f25e30ba6931](../handlers/ui__outline-table-editor.md#h-f25e30ba6931)

```tsx
() => { try { const result = onUndo(undo.revisionId, undo.expectedVersion); if (result) { setUndo(null); setMessage('표에서 생성한 항목을 되돌렸습니다.'); } else setError('그 뒤 연결되거나 수정한 내용이 있어 되돌리지 못했습니다. 현재 자료를 유지했습니다.'); } catch (reason) { setError(reason instanceof Error ? reason.message : '되돌리지 못했습니다. 현재 자료를 유지했습니다.'); } }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4c85223e448f, B-c233a87c1cdd, B-9c0094cf0df6, B-1d2e5db287ff

## X-ea46e63fe542

**공부할 목차 만들기** · Modal · component-callback-contract

- 실제 소스: [src/ui/outline-table-editor.tsx:149](../../../src/ui/outline-table-editor.tsx#L149)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-9875b5d9d19a](../handlers/ui__outline-table-editor.md#h-9875b5d9d19a)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-f57052233f31

**표 초안 다시 읽기** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:152](../../../src/ui/outline-table-editor.tsx#L152)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-522fd899ee11](../handlers/ui__outline-table-editor.md#h-522fd899ee11) → [blank · H-5429a84bc93f](../handlers/ui__outline-table-editor.md#h-5429a84bc93f) → [course · H-4cb0ef04f66a](../handlers/ui__outline-table-editor.md#h-4cb0ef04f66a) → [unit · H-318465ac8646](../handlers/ui__outline-table-editor.md#h-318465ac8646) → [topic · H-42da0112dcee](../handlers/ui__outline-table-editor.md#h-42da0112dcee) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4) → [readDraft · H-2b90061f85cd](../handlers/ui__outline-table-editor.md#h-2b90061f85cd) → [bad · H-7797e091d036](../handlers/ui__outline-table-editor.md#h-7797e091d036) → [cell · H-19a954d0c555](../handlers/ui__outline-table-editor.md#h-19a954d0c555) → [checkUnit · H-0c4b9f0aafc6](../handlers/ui__outline-table-editor.md#h-0c4b9f0aafc6) → [checkCourse · H-cf6df1ba6540](../handlers/ui__outline-table-editor.md#h-cf6df1ba6540) → [@callback:value.courses.flatMap · H-dae5b46961f3](../handlers/ui__outline-table-editor.md#h-dae5b46961f3) → [@callback:c.units.flatMap · H-bb0c1de06fd6](../handlers/ui__outline-table-editor.md#h-bb0c1de06fd6) → [@callback:u.topics.map · H-69393d55afe3](../handlers/ui__outline-table-editor.md#h-69393d55afe3) → [rowCount · H-e85e747b9a35](../handlers/ui__outline-table-editor.md#h-e85e747b9a35) → [@callback:draft.courses.reduce · H-3d2b9c286986](../handlers/ui__outline-table-editor.md#h-3d2b9c286986) → [@callback:row.units.reduce · H-24f3be9f268d](../handlers/ui__outline-table-editor.md#h-24f3be9f268d) → [@callback:path.some · H-07c30ff03785](../handlers/ui__outline-table-editor.md#h-07c30ff03785) → [@callback:Object.values(value.choices).some · H-6c0539b0d3cd](../handlers/ui__outline-table-editor.md#h-6c0539b0d3cd)

```tsx
() => { try { const restored = readDraft(key, data); setBlocked(false); setError(''); setDraft(restored); if (!restored) persist(blank(initialScope)); } catch { setError('초안을 다시 읽지 못했습니다. 기존 원문을 유지했습니다.'); } }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-a6750e73eb4b, B-e344cd0b3166, B-5aee8ee1225d, B-99b08e8a2d2e, B-867c33969566, B-329fea12c45c, B-1ce78a13328b, B-7ce2427b6c38, B-b5f6b3fa8fcd, B-cfc5055b4494, B-7379fdd9eecb, B-eca8ad87dbb3, B-2993558fddd0, B-96e570932f81, B-cff566bd578b, B-cfac89773827, B-ae9422362f13, B-490f8881231b

## X-fcbb0a9f2636

**원문 보관 후 새 표 시작** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:152](../../../src/ui/outline-table-editor.tsx#L152)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-0e5110a0815d](../handlers/ui__outline-table-editor.md#h-0e5110a0815d) → [blank · H-5429a84bc93f](../handlers/ui__outline-table-editor.md#h-5429a84bc93f) → [course · H-4cb0ef04f66a](../handlers/ui__outline-table-editor.md#h-4cb0ef04f66a) → [unit · H-318465ac8646](../handlers/ui__outline-table-editor.md#h-318465ac8646) → [topic · H-42da0112dcee](../handlers/ui__outline-table-editor.md#h-42da0112dcee) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4)

```tsx
() => { try { archiveDamagedDraft(key); setBlocked(false); persist(blank(initialScope)); } catch (reason) { setError(reason instanceof DraftArchiveError ? reason.message : '원본 사본을 보관하지 못했습니다. 기존 원문을 유지했습니다.'); } }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c17f18659df8, B-019813ebb849, B-491852849c88, B-99b08e8a2d2e, B-867c33969566

## X-ea63dd5a331b

**학기** · Select · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:154](../../../src/ui/outline-table-editor.tsx#L154)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-c3773006fb1c](../handlers/ui__outline-table-editor.md#h-c3773006fb1c) → [@callback:edit · H-1d4c15a033f8](../handlers/ui__outline-table-editor.md#h-1d4c15a033f8) → [edit · H-2bd8ff60519f](../handlers/ui__outline-table-editor.md#h-2bd8ff60519f) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4)

```tsx
event => edit(next => { next.scope = ['independent', 'unassigned'].includes(event.target.value) ? { kind: event.target.value as 'independent' | 'unassigned' } : { kind: 'semester', semesterId: event.target.value }; })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-92dc06a683a9, B-7f56e549c287, B-99b08e8a2d2e, B-867c33969566

## X-e2d564fe945a

**`${ci + 1}번째 과목 메뉴`** · summary · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:159](../../../src/ui/outline-table-editor.tsx#L159)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(draft.courses) · 157행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-3cb2b035d81c

**`${ci + 1}번째 과목 삭제`** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:159](../../../src/ui/outline-table-editor.tsx#L159)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-1bb15a9ba281](../handlers/ui__outline-table-editor.md#h-1bb15a9ba281) → [@callback:remove · H-ce6c9bf60bcf](../handlers/ui__outline-table-editor.md#h-ce6c9bf60bcf) → [remove · H-78b23b980429](../handlers/ui__outline-table-editor.md#h-78b23b980429) → [@callback:edit · H-aa4d0853c266](../handlers/ui__outline-table-editor.md#h-aa4d0853c266) → [edit · H-2bd8ff60519f](../handlers/ui__outline-table-editor.md#h-2bd8ff60519f) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4)

```tsx
() => remove({ kind: 'course', index: ci, value: c }, next => { next.courses.splice(ci, 1); })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7f56e549c287, B-99b08e8a2d2e, B-867c33969566

반복: map(draft.courses) · 157행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-370819906f14

**`${ci + 1}번째 과목 ${ui + 1}번째 단원 메뉴`** · summary · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:162](../../../src/ui/outline-table-editor.tsx#L162)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: ti === 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map([...u.topics, null]) · 161행; map(c.units) · 161행; map(draft.courses) · 157행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-1ce0b2f50d65

**`${ci + 1}번째 과목 ${ui + 1}번째 단원 삭제`** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:162](../../../src/ui/outline-table-editor.tsx#L162)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: ti === 0
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-8666e0c0656a](../handlers/ui__outline-table-editor.md#h-8666e0c0656a) → [@callback:remove · H-f6f241a1155c](../handlers/ui__outline-table-editor.md#h-f6f241a1155c) → [remove · H-78b23b980429](../handlers/ui__outline-table-editor.md#h-78b23b980429) → [@callback:edit · H-aa4d0853c266](../handlers/ui__outline-table-editor.md#h-aa4d0853c266) → [edit · H-2bd8ff60519f](../handlers/ui__outline-table-editor.md#h-2bd8ff60519f) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4)

```tsx
() => remove({ kind: 'unit', parentKey: c.key, index: ui, value: u }, next => { next.courses[ci].units.splice(ui, 1); })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7f56e549c287, B-99b08e8a2d2e, B-867c33969566

반복: map([...u.topics, null]) · 161행; map(c.units) · 161행; map(draft.courses) · 157행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-f593b44be137

**`${ci + 1}번째 과목 ${ui + 1}번째 단원 ${ti + 1}번째 주제 메뉴`** · summary · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:163](../../../src/ui/outline-table-editor.tsx#L163)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: t
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map([...u.topics, null]) · 161행; map(c.units) · 161행; map(draft.courses) · 157행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-4873ccb366c2

**`${ci + 1}번째 과목 ${ui + 1}번째 단원 ${ti + 1}번째 주제 삭제`** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:163](../../../src/ui/outline-table-editor.tsx#L163)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: t
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-09b0a106e8e7](../handlers/ui__outline-table-editor.md#h-09b0a106e8e7) → [@callback:remove · H-879280714729](../handlers/ui__outline-table-editor.md#h-879280714729) → [remove · H-78b23b980429](../handlers/ui__outline-table-editor.md#h-78b23b980429) → [@callback:edit · H-aa4d0853c266](../handlers/ui__outline-table-editor.md#h-aa4d0853c266) → [edit · H-2bd8ff60519f](../handlers/ui__outline-table-editor.md#h-2bd8ff60519f) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4)

```tsx
() => remove({ kind: 'topic', parentKey: u.key, index: ti, value: t }, next => { next.courses[ci].units[ui].topics.splice(ti, 1); })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7f56e549c287, B-99b08e8a2d2e, B-867c33969566

반복: map([...u.topics, null]) · 161행; map(c.units) · 161행; map(draft.courses) · 157행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-d972bebca8ba

**주제 추가** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:163](../../../src/ui/outline-table-editor.tsx#L163)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked ∧ falsy: t
- 실행 차단 disabled: locked || rowCount(draft) >= 500
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-caac10004901](../handlers/ui__outline-table-editor.md#h-caac10004901) → [addTopic · H-a44209bafa7f](../handlers/ui__outline-table-editor.md#h-a44209bafa7f) → [@callback:edit · H-141ad7edec2d](../handlers/ui__outline-table-editor.md#h-141ad7edec2d) → [@callback:next.courses.find · H-dd55cf8d381b](../handlers/ui__outline-table-editor.md#h-dd55cf8d381b) → [@callback:next.courses.find(c => c.key === courseKey)!.units.find · H-cfc4290bea91](../handlers/ui__outline-table-editor.md#h-cfc4290bea91) → [edit · H-2bd8ff60519f](../handlers/ui__outline-table-editor.md#h-2bd8ff60519f) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4) → [topic · H-42da0112dcee](../handlers/ui__outline-table-editor.md#h-42da0112dcee) → [rowCount · H-e85e747b9a35](../handlers/ui__outline-table-editor.md#h-e85e747b9a35) → [@callback:draft.courses.reduce · H-3d2b9c286986](../handlers/ui__outline-table-editor.md#h-3d2b9c286986) → [@callback:row.units.reduce · H-24f3be9f268d](../handlers/ui__outline-table-editor.md#h-24f3be9f268d)

```tsx
() => addTopic(c.key, u.key)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4cf398a3c8b7, B-7f56e549c287, B-99b08e8a2d2e, B-867c33969566

반복: map([...u.topics, null]) · 161행; map(c.units) · 161행; map(draft.courses) · 157행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-947d898e7bd5

**단원 추가** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:166](../../../src/ui/outline-table-editor.tsx#L166)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked
- 실행 차단 disabled: locked || rowCount(draft) > 498
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a54123901b0a](../handlers/ui__outline-table-editor.md#h-a54123901b0a) → [@callback:edit · H-d010e9f9a6f4](../handlers/ui__outline-table-editor.md#h-d010e9f9a6f4) → [edit · H-2bd8ff60519f](../handlers/ui__outline-table-editor.md#h-2bd8ff60519f) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4) → [unit · H-318465ac8646](../handlers/ui__outline-table-editor.md#h-318465ac8646) → [topic · H-42da0112dcee](../handlers/ui__outline-table-editor.md#h-42da0112dcee)

```tsx
() => { const value = unit(); focusNext.current = value.key; edit(next => next.courses[ci].units.push(value)); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7f56e549c287, B-99b08e8a2d2e, B-867c33969566

반복: map(draft.courses) · 157행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-62843dba4c7f

**과목 추가** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:168](../../../src/ui/outline-table-editor.tsx#L168)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked
- 실행 차단 disabled: locked || draft.courses.length >= 500 || rowCount(draft) > 498
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f444de32fc3e](../handlers/ui__outline-table-editor.md#h-f444de32fc3e) → [@callback:edit · H-733b7460bbe0](../handlers/ui__outline-table-editor.md#h-733b7460bbe0) → [edit · H-2bd8ff60519f](../handlers/ui__outline-table-editor.md#h-2bd8ff60519f) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4) → [course · H-4cb0ef04f66a](../handlers/ui__outline-table-editor.md#h-4cb0ef04f66a) → [unit · H-318465ac8646](../handlers/ui__outline-table-editor.md#h-318465ac8646) → [topic · H-42da0112dcee](../handlers/ui__outline-table-editor.md#h-42da0112dcee)

```tsx
() => { const value = course(); focusNext.current = value.key; edit(next => next.courses.push(value)); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7f56e549c287, B-99b08e8a2d2e, B-867c33969566

## X-dbb8fc68bafe

**삭제 되돌리기** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:168](../../../src/ui/outline-table-editor.tsx#L168)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked
- 실행 차단 disabled: locked || !draft.undo.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [restore · H-c3d6fc3f7e5d](../handlers/ui__outline-table-editor.md#h-c3d6fc3f7e5d) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4) → [rowCount · H-e85e747b9a35](../handlers/ui__outline-table-editor.md#h-e85e747b9a35) → [@callback:draft.courses.reduce · H-3d2b9c286986](../handlers/ui__outline-table-editor.md#h-3d2b9c286986) → [@callback:row.units.reduce · H-24f3be9f268d](../handlers/ui__outline-table-editor.md#h-24f3be9f268d) → [@callback:list.some · H-3c141bac3272](../handlers/ui__outline-table-editor.md#h-3c141bac3272) → [@callback:next.courses.flatMap · H-0193a3f7b2b7](../handlers/ui__outline-table-editor.md#h-0193a3f7b2b7) → [@callback:next.courses.flatMap(c => c.units).find · H-ace503503dd7](../handlers/ui__outline-table-editor.md#h-ace503503dd7) → [@callback:next.courses.find · H-f4707ad8a51e](../handlers/ui__outline-table-editor.md#h-f4707ad8a51e)

```tsx
restore
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-698324cbf1ff, B-5fda73493a07, B-79262dfbebc8, B-7f18570a880b, B-721420413170, B-99b08e8a2d2e, B-867c33969566

## X-b2e987c22ff6

**`${row.path.join(' → ')} 처리`** · Select · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:172](../../../src/ui/outline-table-editor.tsx#L172)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-fd6a800af765](../handlers/ui__outline-table-editor.md#h-fd6a800af765) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4) → [@callback:row.path.every · H-485a2e301aa8](../handlers/ui__outline-table-editor.md#h-485a2e301aa8)

```tsx
event => {
            const choices = { ...draft.choices, [row.key]: event.target.value };
            for (const choiceKey of Object.keys(choices)) { const path = JSON.parse(choiceKey) as string[]; if (path.length > row.path.length && row.path.every((name, index) => path[index] === name)) delete choices[choiceKey]; }
            persist({ ...draft, choices, previewToken: undefined });
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-1956fe14c86f, B-99b08e8a2d2e, B-867c33969566

반복: map(plan.entries.filter(row => row.candidates.length > 0)) · 172행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-3c8ee195e745

**생성할 구조 보기** · summary · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:177](../../../src/ui/outline-table-editor.tsx#L177)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7fa89a15b5c3

**생성할 구조 확인** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:179](../../../src/ui/outline-table-editor.tsx#L179)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 ∧ truthy: !draft.pending
- 실행 차단 disabled: !plan.ready
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-481c81b63d16](../handlers/ui__outline-table-editor.md#h-481c81b63d16) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4)

```tsx
() => persist({ ...draft, previewToken: outlineTableToken(data) })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-99b08e8a2d2e, B-867c33969566

## X-5b270d96cbe4

**한 번에 생성** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:180](../../../src/ui/outline-table-editor.tsx#L180)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 ∧ truthy: !draft.pending
- 실행 차단 disabled: !plan.ready || !plan.newCount || !draft.previewToken || stale
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [apply · H-cc917cb619c0](../handlers/ui__outline-table-editor.md#h-cc917cb619c0) → [finish · H-949d369108f0](../handlers/ui__outline-table-editor.md#h-949d369108f0) → [captureUndo · H-a56b69a5c265](../handlers/ui__outline-table-editor.md#h-a56b69a5c265) → [@callback:result.revisions.find · H-ddbefa729bc3](../handlers/ui__outline-table-editor.md#h-ddbefa729bc3) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4) → [@callback:plan!.entries.filter · H-d8af3b825166](../handlers/ui__outline-table-editor.md#h-d8af3b825166) → [@callback:plan!.entries.filter(row => row.status === 'new').map · H-be2b57d40918](../handlers/ui__outline-table-editor.md#h-be2b57d40918)

```tsx
apply
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-f8f48184947b, B-8bdd7f9c7a74, B-aca9bb82b019, B-b871350f013b, B-44e888a5ee20, B-b723f0288538, B-d69ac211cfcb, B-6f49d64de568, B-b02672d8ab90, B-116ae0bf22a9, B-549e6a38a888, B-99b08e8a2d2e, B-867c33969566

## X-54279a8e9543

**완료한 표 초안 정리 표 생성 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:182](../../../src/ui/outline-table-editor.tsx#L182)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: draft.pending
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [apply · H-cc917cb619c0](../handlers/ui__outline-table-editor.md#h-cc917cb619c0) → [finish · H-949d369108f0](../handlers/ui__outline-table-editor.md#h-949d369108f0) → [captureUndo · H-a56b69a5c265](../handlers/ui__outline-table-editor.md#h-a56b69a5c265) → [@callback:result.revisions.find · H-ddbefa729bc3](../handlers/ui__outline-table-editor.md#h-ddbefa729bc3) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4) → [@callback:plan!.entries.filter · H-d8af3b825166](../handlers/ui__outline-table-editor.md#h-d8af3b825166) → [@callback:plan!.entries.filter(row => row.status === 'new').map · H-be2b57d40918](../handlers/ui__outline-table-editor.md#h-be2b57d40918)

```tsx
apply
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-f8f48184947b, B-8bdd7f9c7a74, B-aca9bb82b019, B-b871350f013b, B-44e888a5ee20, B-b723f0288538, B-d69ac211cfcb, B-6f49d64de568, B-b02672d8ab90, B-116ae0bf22a9, B-549e6a38a888, B-99b08e8a2d2e, B-867c33969566

## X-8aa5f84c4b92

**현재 구조 다시 확인** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:183](../../../src/ui/outline-table-editor.tsx#L183)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: draft.pending && !alreadyApplied && stale
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-dbe5755dea82](../handlers/ui__outline-table-editor.md#h-dbe5755dea82) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4)

```tsx
() => { const next = { ...draft }; delete next.pending; delete next.previewToken; persist(next); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-99b08e8a2d2e, B-867c33969566

## X-507e518bca6f

**표 초안 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:184](../../../src/ui/outline-table-editor.tsx#L184)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c4156baf6082](../handlers/ui__outline-table-editor.md#h-c4156baf6082) → [persist · H-cd3843ec99a4](../handlers/ui__outline-table-editor.md#h-cd3843ec99a4)

```tsx
() => persist(draft)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-99b08e8a2d2e, B-867c33969566

## X-3c53a7136391

**닫고 표 초안 보관** · Button · user-control

- 실제 소스: [src/ui/outline-table-editor.tsx:186](../../../src/ui/outline-table-editor.tsx#L186)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-4b5219cc2dc2](../handlers/ui__outline-table-editor.md#h-4b5219cc2dc2)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

