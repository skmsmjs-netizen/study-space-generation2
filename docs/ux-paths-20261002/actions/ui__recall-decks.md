# src/ui/recall-decks.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-89d6952dd354

**복습할 덱** · Select · user-control

- 실제 소스: [src/ui/recall-decks.tsx:9](../../../src/ui/recall-decks.tsx#L9)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-63aaec4f05b4](../handlers/ui__recall-decks.md#h-63aaec4f05b4)

```tsx
e => onChange(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-37d254e9c898

**덱 만들기** · summary · user-control

- 실제 소스: [src/ui/recall-decks.tsx:10](../../../src/ui/recall-decks.tsx#L10)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7b28003cac8a

**새 덱 이름** · Input · user-control

- 실제 소스: [src/ui/recall-decks.tsx:11](../../../src/ui/recall-decks.tsx#L11)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-2431cad302e0](../handlers/ui__recall-decks.md#h-2431cad302e0)

```tsx
e => persist({ ...session, deckCreation: { id: session.deckCreation?.id ?? crypto.randomUUID(), name: e.target.value } })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-07de893dbc11

**덱 만들기** · Button · user-control

- 실제 소스: [src/ui/recall-decks.tsx:12](../../../src/ui/recall-decks.tsx#L12)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || !session.deckCreation?.name.trim()
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d1c0ac28dca6](../handlers/ui__recall-decks.md#h-d1c0ac28dca6)

```tsx
() => { try {
        const draft = session.deckCreation!, snapshot = repository.getSnapshot(), old = snapshot.recallPreferences?.find(row => row.id === draft.id);
        const saved = old?.deckName === draft.name ? snapshot : repository.execute({ type: 'saveRecallPreferences', id: draft.id, deckName: draft.name, options: recallOptions(snapshot), expectedVersion: old?.version ?? 0, opId: crypto.randomUUID(), at: new Date().toISOString(), userId: snapshot.userId, namespace: snapshot.namespace });
        onSaved(saved); persist({ ...session, deckCreation: undefined, deckId: draft.id, currentId: null, seen: [] }); setError('');
      } catch (e) { setError(e instanceof Error ? e.message : '덱을 저장하지 못했습니다. 이름은 초안에 남아 있습니다.'); } }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-864af49bae3f, B-d13a7c38346c, B-c2810adf1617, B-62a11ba0b2d4

