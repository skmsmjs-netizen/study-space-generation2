# src/ui/criteria-editor.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-b931f3f253f7

**공부 기준 조정 · 작성 이어가기** · Button · user-control

- 실제 소스: [src/ui/criteria-editor.tsx:89](../../../src/ui/criteria-editor.tsx#L89)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [launch · H-0860d76c6ad7](../handlers/ui__criteria-editor.md#h-0860d76c6ad7) → [freshDraft · H-610513268682](../handlers/ui__criteria-editor.md#h-610513268682) → [@callback:current.items.map · H-351136120d8e](../handlers/ui__criteria-editor.md#h-351136120d8e) → [update · H-3c4aec1ec4ff](../handlers/ui__criteria-editor.md#h-3c4aec1ec4ff)

```tsx
launch
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-46fc60c37262, B-d013d2154f6a, B-256cad809b56

## X-024b1006f0c3

**기준 변경 되돌리기** · Button · user-control

- 실제 소스: [src/ui/criteria-editor.tsx:90](../../../src/ui/criteria-editor.tsx#L90)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: undo && onUndo
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2fbf20ad6b7d](../handlers/ui__criteria-editor.md#h-2fbf20ad6b7d)

```tsx
() => {
        const result = onUndo(undo.revisionId, undo.expectedVersion);
        if (result) { setUndo(null); setError(''); }
        else setError('그 뒤의 변경이 있어 기준을 되돌리지 못했습니다. 현재 기준과 기록은 보존했습니다.');
      }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-9f38b23186a6

## X-9f766ba6c27d

**공부 기준 조정** · Modal · component-callback-contract

- 실제 소스: [src/ui/criteria-editor.tsx:96](../../../src/ui/criteria-editor.tsx#L96)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-f6881f7fbf6e](../handlers/ui__criteria-editor.md#h-f6881f7fbf6e)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-dd95d6752224

**초안 정리 다시 시도** · Button · user-control

- 실제 소스: [src/ui/criteria-editor.tsx:99](../../../src/ui/criteria-editor.tsx#L99)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: open ∧ truthy: cleanupPending
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2fa0a1173df7](../handlers/ui__criteria-editor.md#h-2fa0a1173df7)

```tsx
() => {
          try { clearStoredDraft(key); setCleanupPending(false); setError(''); }
          catch { setError('초안 정리를 완료하지 못했습니다. 적용한 기준은 유지하며 다시 적용하지 않습니다.'); }
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5b812ac1c04d, B-b2889b69892c

## X-9cf392878ee1

**초안 다시 읽기** · Button · user-control

- 실제 소스: [src/ui/criteria-editor.tsx:104](../../../src/ui/criteria-editor.tsx#L104)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: open ∧ truthy: blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b02d93e3d811](../handlers/ui__criteria-editor.md#h-b02d93e3d811) → [freshDraft · H-610513268682](../handlers/ui__criteria-editor.md#h-610513268682) → [@callback:current.items.map · H-351136120d8e](../handlers/ui__criteria-editor.md#h-351136120d8e) → [update · H-3c4aec1ec4ff](../handlers/ui__criteria-editor.md#h-3c4aec1ec4ff) → [readDraft · H-f8ded75241ce](../handlers/ui__criteria-editor.md#h-f8ded75241ce) → [@callback:value.base.forEach · H-5e63a2ce1a1b](../handlers/ui__criteria-editor.md#h-5e63a2ce1a1b) → [@callback:value.rows.map · H-cc32912e3a6c](../handlers/ui__criteria-editor.md#h-cc32912e3a6c)

```tsx
() => {
            try { const restored = readDraft(key, targetId); setBlocked(false); setDraft(restored); setError(''); if (!restored) update(freshDraft()); }
            catch { setError('초안을 다시 읽지 못했습니다. 기존 원문을 유지했습니다.'); }
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e996c2a072e4, B-5a1595cf4231, B-32723a67e161, B-d013d2154f6a, B-256cad809b56, B-89fd6a68cf56, B-7135e54e58ed, B-73072372503a

## X-a0c50e034eb7

**원문 보관 후 새 초안 시작** · Button · user-control

- 실제 소스: [src/ui/criteria-editor.tsx:109](../../../src/ui/criteria-editor.tsx#L109)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: open ∧ truthy: blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5c7e0f8c8404](../handlers/ui__criteria-editor.md#h-5c7e0f8c8404) → [freshDraft · H-610513268682](../handlers/ui__criteria-editor.md#h-610513268682) → [@callback:current.items.map · H-351136120d8e](../handlers/ui__criteria-editor.md#h-351136120d8e) → [update · H-3c4aec1ec4ff](../handlers/ui__criteria-editor.md#h-3c4aec1ec4ff)

```tsx
() => {
            try { archiveDamagedDraft(key); setBlocked(false); update(freshDraft()); }
            catch (reason) { setError(reason instanceof DraftArchiveError ? reason.message : '원본 초안 사본을 보관하지 못했습니다. 기존 원문을 유지했습니다. 저장 공간을 확보한 뒤 다시 시도해 주세요.'); }
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-aa0af4b0fd0e, B-ead3b4fa98d0, B-8da38912baf7, B-d013d2154f6a, B-256cad809b56

## X-9abb2a936790

**초안 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/criteria-editor.tsx:114](../../../src/ui/criteria-editor.tsx#L114)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: open ∧ truthy: !blocked && draft && error && !cleanupPending
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-93fbd63b2672](../handlers/ui__criteria-editor.md#h-93fbd63b2672) → [update · H-3c4aec1ec4ff](../handlers/ui__criteria-editor.md#h-3c4aec1ec4ff)

```tsx
() => update(draft)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d013d2154f6a, B-256cad809b56

## X-4632856a053d

**적용 범위** · Select · user-control

- 실제 소스: [src/ui/criteria-editor.tsx:116](../../../src/ui/criteria-editor.tsx#L116)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-c911459b2b8e](../handlers/ui__criteria-editor.md#h-c911459b2b8e) → [update · H-3c4aec1ec4ff](../handlers/ui__criteria-editor.md#h-3c4aec1ec4ff)

```tsx
event => update({ ...draft, scope: event.target.value as CriteriaChange['scope'] })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d013d2154f6a, B-256cad809b56

## X-cd9bf9bb748b

**항목 문구** · Input · user-control

- 실제 소스: [src/ui/criteria-editor.tsx:126](../../../src/ui/criteria-editor.tsx#L126)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-3531a9c57541](../handlers/ui__criteria-editor.md#h-3531a9c57541) → [changeRow · H-b2c2b9f134b1](../handlers/ui__criteria-editor.md#h-b2c2b9f134b1) → [@callback:draft.rows.map · H-908d3af29bbf](../handlers/ui__criteria-editor.md#h-908d3af29bbf) → [update · H-3c4aec1ec4ff](../handlers/ui__criteria-editor.md#h-3c4aec1ec4ff)

```tsx
event => changeRow(index, { label: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f5c3f59014a7, B-3242c93791f3, B-d013d2154f6a, B-256cad809b56

반복: map(draft.rows) · 123행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-2ab090b9ca02

**활동** · Select · user-control

- 실제 소스: [src/ui/criteria-editor.tsx:127](../../../src/ui/criteria-editor.tsx#L127)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-25aa165efab8](../handlers/ui__criteria-editor.md#h-25aa165efab8) → [changeRow · H-b2c2b9f134b1](../handlers/ui__criteria-editor.md#h-b2c2b9f134b1) → [@callback:draft.rows.map · H-908d3af29bbf](../handlers/ui__criteria-editor.md#h-908d3af29bbf) → [update · H-3c4aec1ec4ff](../handlers/ui__criteria-editor.md#h-3c4aec1ec4ff)

```tsx
event => changeRow(index, { group: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f5c3f59014a7, B-3242c93791f3, B-d013d2154f6a, B-256cad809b56

반복: map(draft.rows) · 123행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-9276111d1663

**적용 여부** · Select · user-control

- 실제 소스: [src/ui/criteria-editor.tsx:130](../../../src/ui/criteria-editor.tsx#L130)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f7431516d23e](../handlers/ui__criteria-editor.md#h-f7431516d23e) → [changeRow · H-b2c2b9f134b1](../handlers/ui__criteria-editor.md#h-b2c2b9f134b1) → [@callback:draft.rows.map · H-908d3af29bbf](../handlers/ui__criteria-editor.md#h-908d3af29bbf) → [update · H-3c4aec1ec4ff](../handlers/ui__criteria-editor.md#h-3c4aec1ec4ff)

```tsx
event => changeRow(index, { mode: event.target.value as CriteriaEditRow['mode'] })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f5c3f59014a7, B-3242c93791f3, B-d013d2154f6a, B-256cad809b56

반복: map(draft.rows) · 123행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-7aed5df3d87d

**항목 추가** · Button · user-control

- 실제 소스: [src/ui/criteria-editor.tsx:135](../../../src/ui/criteria-editor.tsx#L135)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft
- 실행 차단 disabled: draft.rows.length >= 100
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-eb6a781c0e81](../handlers/ui__criteria-editor.md#h-eb6a781c0e81) → [update · H-3c4aec1ec4ff](../handlers/ui__criteria-editor.md#h-3c4aec1ec4ff)

```tsx
() => update({ ...draft, rows: [...draft.rows, { id: null, key: crypto.randomUUID(), group: 'T', label: '', mode: 'optional' }] })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d013d2154f6a, B-256cad809b56

## X-9d08e5c58800

**현재 적용된 기준** · summary · user-control

- 실제 소스: [src/ui/criteria-editor.tsx:138](../../../src/ui/criteria-editor.tsx#L138)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft ∧ truthy: stale
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-0bc46f77ca05

**현재 기준과 범위를 확인했습니다** · Button · user-control

- 실제 소스: [src/ui/criteria-editor.tsx:139](../../../src/ui/criteria-editor.tsx#L139)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft ∧ truthy: stale
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-4c4ec4e2f627](../handlers/ui__criteria-editor.md#h-4c4ec4e2f627) → [update · H-3c4aec1ec4ff](../handlers/ui__criteria-editor.md#h-3c4aec1ec4ff)

```tsx
() => update({ ...draft, expectedToken: criteriaRevisionToken(data) })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d013d2154f6a, B-256cad809b56

## X-97b556df3c88

**기준 적용** · Button · user-control

- 실제 소스: [src/ui/criteria-editor.tsx:141](../../../src/ui/criteria-editor.tsx#L141)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft
- 실행 차단 disabled: stale || blocked || cleanupPending
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [apply · H-6b69574b43e6](../handlers/ui__criteria-editor.md#h-6b69574b43e6) → [@callback:result.revisions.find · H-da5d10e32f56](../handlers/ui__criteria-editor.md#h-da5d10e32f56) → [@callback:prepareCriteriaItems · H-540030fcbdc1](../handlers/ui__criteria-editor.md#h-540030fcbdc1)

```tsx
apply
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-028f407e3bc4, B-a53629740561, B-a7be8c772b2f, B-19fc362d9549, B-9f5c766f1503, B-54b02d51918e, B-1dc0f34fda37, B-38590a3f736c

## X-c94ed18d20ab

**닫고 초안 보관** · Button · user-control

- 실제 소스: [src/ui/criteria-editor.tsx:141](../../../src/ui/criteria-editor.tsx#L141)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6aae239216e7](../handlers/ui__criteria-editor.md#h-6aae239216e7)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

