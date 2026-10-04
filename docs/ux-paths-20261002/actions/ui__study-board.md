# src/ui/study-board.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-02940101a9cc

**카드 찾기** · Input · user-control

- 실제 소스: [src/ui/study-board.tsx:219](../../../src/ui/study-board.tsx#L219)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-83975c10416e](../handlers/ui__study-board.md#h-83975c10416e)

```tsx
(e) => { setQuery(e.target.value); setVisibleCounts({}); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-cff051570a02

**열 추가** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:225](../../../src/ui/study-board.tsx#L225)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || Boolean(editor)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-7f58d65cca45](../handlers/ui__study-board.md#h-7f58d65cca45)

```tsx
() => setColumnEdit({ id: crypto.randomUUID(), title: '' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d85a280a1af4

**되돌리기** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:231](../../../src/ui/study-board.tsx#L231)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || !revision || Boolean(editor)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [undo · H-c931bbea8d2c](../handlers/ui__study-board.md#h-c931bbea8d2c) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e)

```tsx
undo
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7b3bc15b7ef, B-9d9f5c270d2e, B-02c6d4f91b3d, B-ef1b3fa2d518, B-5326344b6c97

## X-25a55547edc6

**보드로 돌아가기 {`보관한 카드 ${content.cards.filter((c) => c.archived).length}개`}** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:234](../../../src/ui/study-board.tsx#L234)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a5bbeadf745a](../handlers/ui__study-board.md#h-a5bbeadf745a)

```tsx
() => { setArchived(!archived); setVisibleCounts({}); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-8ff7ff8f3b0f

**열로 이동** · Select · user-control

- 실제 소스: [src/ui/study-board.tsx:239](../../../src/ui/study-board.tsx#L239)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-62d72ba89c23](../handlers/ui__study-board.md#h-62d72ba89c23)

```tsx
(e) => columnElements.current.get(e.target.value)?.scrollIntoView({ block: 'nearest', inline: 'start', behavior: 'smooth' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-eccff324d4fb

**관계 살펴보기 ↗** · a · user-control

- 실제 소스: [src/ui/study-board.tsx:243](../../../src/ui/study-board.tsx#L243)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/graph`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-eb068453ee67

**서버 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:247](../../../src/ui/study-board.tsx#L247)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: saveStatus ∧ truthy: saveStatus.phase === 'error'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3d276908280e](../handlers/ui__study-board.md#h-3d276908280e)

```tsx
() => { void repository.flush?.(); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-8436b1819327

**저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:253](../../../src/ui/study-board.tsx#L253)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: error ∧ truthy: pending
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f2d3bd936c33](../handlers/ui__study-board.md#h-f2d3bd936c33) → [changeEditor · H-7003ad0dbba9](../handlers/ui__study-board.md#h-7003ad0dbba9) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb) → [@callback:current.current.cards.some · H-c807f9ab6493](../handlers/ui__study-board.md#h-c807f9ab6493) → [save · H-9cc01a6fba89](../handlers/ui__study-board.md#h-9cc01a6fba89)

```tsx
() => {
                if (
                  save(current.current) &&
                  editorRef.current &&
                  current.current.cards.some(
                    (c) => JSON.stringify(c) === JSON.stringify(editorRef.current),
                  )
                )
                  changeEditor(null);
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-363cc7daa5d3, B-980f51687382, B-422b145a9a9b, B-d6bde365cc1f, B-5326344b6c97, B-7ec45b175694, B-e9248c3615aa, B-1dc60e224a40, B-08e3a9cad614, B-99fff395f6ff, B-c29685de0e76, B-17d0b8d2ca48, B-ad487e18e914

## X-464df0c9fb28

**초안 사본 보관 후 보드 열기** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:269](../../../src/ui/study-board.tsx#L269)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: error ∧ truthy: blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ea911fedee62](../handlers/ui__study-board.md#h-ea911fedee62) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e)

```tsx
() => {
                try {
                  archiveDamagedDraft(boardDraftKey(data), '칸반보드 초안의 원문과 수정 충돌 보관');
                  clearBoardDraft(data);
                  setBlocked(false);
                  setError('');
                } catch (e) {
                  setError(errorText(e));
                }
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-cbccd1312468, B-7e5d01626690, B-5326344b6c97

## X-5a60fa882d00

**`${col.title} 열`** · section · event-surface

- 실제 소스: [src/ui/study-board.tsx:295](../../../src/ui/study-board.tsx#L295)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 포인터·공간 조작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onDragOver** → [@onDragOver · H-4f1f32a14ad5](../handlers/ui__study-board.md#h-4f1f32a14ad5)

```tsx
(e) => {
                if (dragId.current && !disabled) {
                  e.preventDefault();
                  setDropColumn(col.id);
                }
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7ce041d882b9

**onDrop** → [@onDrop · H-640e771ff8e4](../handlers/ui__study-board.md#h-640e771ff8e4) → [drop · H-06846117dc78](../handlers/ui__study-board.md#h-06846117dc78) → [move · H-3d7386c3a1dd](../handlers/ui__study-board.md#h-3d7386c3a1dd) → [save · H-9cc01a6fba89](../handlers/ui__study-board.md#h-9cc01a6fba89) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb) → [@callback:content.cards.some · H-1523e10d4289](../handlers/ui__study-board.md#h-1523e10d4289)

```tsx
(e) => drop(e, col.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bfd70a76f2a7, B-6a45c2cc1538, B-e9248c3615aa, B-1dc60e224a40, B-08e3a9cad614, B-99fff395f6ff, B-c29685de0e76, B-17d0b8d2ca48, B-ad487e18e914, B-5326344b6c97, B-7ec45b175694

반복: map(content.columns) · 292행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-693c5bf9d457

**`${col.title} 열 이름 바꾸기`** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:312](../../../src/ui/study-board.tsx#L312)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || Boolean(editor)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-03426b8a66ad](../handlers/ui__study-board.md#h-03426b8a66ad)

```tsx
() => setColumnEdit(col)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(content.columns) · 292행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-675c699f59fc

**`카드 ${card.title}`** · article · event-surface

- 실제 소스: [src/ui/study-board.tsx:330](../../../src/ui/study-board.tsx#L330)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 포인터·공간 조작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onDragOver** → [@onDragOver · H-bb97254ea013](../handlers/ui__study-board.md#h-bb97254ea013)

```tsx
(e) => {
                        if (dragId.current && !disabled) e.preventDefault();
                      }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-df5b90718a64

**onDrop** → [@onDrop · H-8de8f2161154](../handlers/ui__study-board.md#h-8de8f2161154) → [drop · H-06846117dc78](../handlers/ui__study-board.md#h-06846117dc78) → [move · H-3d7386c3a1dd](../handlers/ui__study-board.md#h-3d7386c3a1dd) → [save · H-9cc01a6fba89](../handlers/ui__study-board.md#h-9cc01a6fba89) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb) → [@callback:content.cards.some · H-1523e10d4289](../handlers/ui__study-board.md#h-1523e10d4289)

```tsx
(e) => drop(e, col.id, card.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bfd70a76f2a7, B-6a45c2cc1538, B-e9248c3615aa, B-1dc60e224a40, B-08e3a9cad614, B-99fff395f6ff, B-c29685de0e76, B-17d0b8d2ca48, B-ad487e18e914, B-5326344b6c97, B-7ec45b175694

반복: map(list.slice(0, visibleCounts[col.id] ?? 40)) · 323행; map(content.columns) · 292행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-00233c803d91

**`${card.title} 끌어 옮기기`** · button · user-control

- 실제 소스: [src/ui/study-board.tsx:340](../../../src/ui/study-board.tsx#L340)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || archived
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 포인터·공간 조작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onDragStart** → [@onDragStart · H-28d8c6b197ec](../handlers/ui__study-board.md#h-28d8c6b197ec)

```tsx
(e) => {
                            dragId.current = card.id;
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', card.id);
                          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onDragEnd** → [@onDragEnd · H-37325d483053](../handlers/ui__study-board.md#h-37325d483053)

```tsx
() => {
                            dragId.current = null;
                            setDropColumn(null);
                          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(list.slice(0, visibleCounts[col.id] ?? 40)) · 323행; map(content.columns) · 292행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-36e408ffe4ba

**{card.title}** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:358](../../../src/ui/study-board.tsx#L358)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-8c11ecdf4278](../handlers/ui__study-board.md#h-8c11ecdf4278) → [changeEditor · H-7003ad0dbba9](../handlers/ui__study-board.md#h-7003ad0dbba9) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb)

```tsx
() => changeEditor(card)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-980f51687382, B-422b145a9a9b, B-d6bde365cc1f, B-5326344b6c97, B-7ec45b175694

반복: map(list.slice(0, visibleCounts[col.id] ?? 40)) · 323행; map(content.columns) · 292행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-cd607bac3147

**글 전체 보기** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:367](../../../src/ui/study-board.tsx#L367)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: card.body
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f1f253fdd2b9](../handlers/ui__study-board.md#h-f1f253fdd2b9) → [changeEditor · H-7003ad0dbba9](../handlers/ui__study-board.md#h-7003ad0dbba9) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb)

```tsx
() => changeEditor(card)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-980f51687382, B-422b145a9a9b, B-d6bde365cc1f, B-5326344b6c97, B-7ec45b175694

반복: map(list.slice(0, visibleCounts[col.id] ?? 40)) · 323행; map(content.columns) · 292행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-e7de53d89d45

**{topic.name} ↗** · a · user-control

- 실제 소스: [src/ui/study-board.tsx:370](../../../src/ui/study-board.tsx#L370)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: topic ∧ truthy: topicActive
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/node/${encodeURIComponent(topic.id)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(list.slice(0, visibleCounts[col.id] ?? 40)) · 323행; map(content.columns) · 292행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-0e5ac16fb670

**카드 이동·보관** · summary · user-control

- 실제 소스: [src/ui/study-board.tsx:375](../../../src/ui/study-board.tsx#L375)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(list.slice(0, visibleCounts[col.id] ?? 40)) · 323행; map(content.columns) · 292행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-42a36315d741

**`${card.title} 옮길 열`** · Select · user-control

- 실제 소스: [src/ui/study-board.tsx:376](../../../src/ui/study-board.tsx#L376)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ecc420f99f21](../handlers/ui__study-board.md#h-ecc420f99f21) → [move · H-3d7386c3a1dd](../handlers/ui__study-board.md#h-3d7386c3a1dd) → [save · H-9cc01a6fba89](../handlers/ui__study-board.md#h-9cc01a6fba89) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb)

```tsx
(e) => move(card.id, e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6a45c2cc1538, B-e9248c3615aa, B-1dc60e224a40, B-08e3a9cad614, B-99fff395f6ff, B-c29685de0e76, B-17d0b8d2ca48, B-ad487e18e914, B-5326344b6c97, B-7ec45b175694

반복: map(list.slice(0, visibleCounts[col.id] ?? 40)) · 323행; map(content.columns) · 292행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-8163d8d025c9

**`${card.title} 위로`** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:389](../../../src/ui/study-board.tsx#L389)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || index === 0 || Boolean(query)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-822c55efb750](../handlers/ui__study-board.md#h-822c55efb750) → [move · H-3d7386c3a1dd](../handlers/ui__study-board.md#h-3d7386c3a1dd) → [save · H-9cc01a6fba89](../handlers/ui__study-board.md#h-9cc01a6fba89) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb)

```tsx
() => move(card.id, col.id, list[index - 1]?.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6a45c2cc1538, B-e9248c3615aa, B-1dc60e224a40, B-08e3a9cad614, B-99fff395f6ff, B-c29685de0e76, B-17d0b8d2ca48, B-ad487e18e914, B-5326344b6c97, B-7ec45b175694

반복: map(list.slice(0, visibleCounts[col.id] ?? 40)) · 323행; map(content.columns) · 292행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-1f990097a30f

**`${card.title} 아래로`** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:396](../../../src/ui/study-board.tsx#L396)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || index === list.length - 1 || Boolean(query)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-91044a711ff0](../handlers/ui__study-board.md#h-91044a711ff0) → [move · H-3d7386c3a1dd](../handlers/ui__study-board.md#h-3d7386c3a1dd) → [save · H-9cc01a6fba89](../handlers/ui__study-board.md#h-9cc01a6fba89) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb) → [@callback:all.findIndex · H-f2a6434b3bb8](../handlers/ui__study-board.md#h-f2a6434b3bb8) → [@callback:content.cards.filter · H-c1f472fb34d1](../handlers/ui__study-board.md#h-c1f472fb34d1)

```tsx
() => {
                              const all = content.cards.filter(
                                (c) => c.columnId === col.id && c.archived === archived,
                              );
                              const following = all[all.findIndex((c) => c.id === card.id) + 2];
                              move(card.id, col.id, following?.id);
                            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6a45c2cc1538, B-e9248c3615aa, B-1dc60e224a40, B-08e3a9cad614, B-99fff395f6ff, B-c29685de0e76, B-17d0b8d2ca48, B-ad487e18e914, B-5326344b6c97, B-7ec45b175694

반복: map(list.slice(0, visibleCounts[col.id] ?? 40)) · 323행; map(content.columns) · 292행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-1bab7b78874d

**보드로 복원 카드 보관** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:409](../../../src/ui/study-board.tsx#L409)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-fa59fbbc69d1](../handlers/ui__study-board.md#h-fa59fbbc69d1) → [@callback:content.cards.map · H-f2879c366aa5](../handlers/ui__study-board.md#h-f2879c366aa5) → [save · H-9cc01a6fba89](../handlers/ui__study-board.md#h-9cc01a6fba89) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb)

```tsx
() =>
                              save({
                                ...content,
                                cards: content.cards.map((c) =>
                                  c.id === card.id ? { ...c, archived: !c.archived } : c,
                                ),
                              })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d822fbbc74a8, B-e9248c3615aa, B-1dc60e224a40, B-08e3a9cad614, B-99fff395f6ff, B-c29685de0e76, B-17d0b8d2ca48, B-ad487e18e914, B-5326344b6c97, B-7ec45b175694

반복: map(list.slice(0, visibleCounts[col.id] ?? 40)) · 323행; map(content.columns) · 292행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-588f6408ae76

**다음 카드 보기 · {list.length - (visibleCounts[col.id] ?? 40)} 개 남음** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:427](../../../src/ui/study-board.tsx#L427)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: list.length > (visibleCounts[col.id] ?? 40)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d39c3b83f7fb](../handlers/ui__study-board.md#h-d39c3b83f7fb) → [@callback:setVisibleCounts · H-4e2f12a66728](../handlers/ui__study-board.md#h-4e2f12a66728)

```tsx
() => setVisibleCounts((old) => ({ ...old, [col.id]: (old[col.id] ?? 40) + 40 }))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(content.columns) · 292행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-bb76d96f1366

**+ {col.title} 에 카드 추가** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:441](../../../src/ui/study-board.tsx#L441)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: !archived
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-fe086598455b](../handlers/ui__study-board.md#h-fe086598455b) → [changeEditor · H-7003ad0dbba9](../handlers/ui__study-board.md#h-7003ad0dbba9) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb)

```tsx
() =>
                    changeEditor({
                      id: crypto.randomUUID(),
                      columnId: col.id,
                      title: '',
                      body: '',
                      topicId: null,
                      archived: false,
                    })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-980f51687382, B-422b145a9a9b, B-d6bde365cc1f, B-5326344b6c97, B-7ec45b175694

반복: map(content.columns) · 292행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-e7e269631a51

**editor && content.cards.some((c) => c.id === editor.id) ? '카드 편집' : '카드 추가'** · Modal · component-callback-contract

- 실제 소스: [src/ui/study-board.tsx:466](../../../src/ui/study-board.tsx#L466)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: Boolean(editor)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-0bd2091d674d](../handlers/ui__study-board.md#h-0bd2091d674d) → [changeEditor · H-7003ad0dbba9](../handlers/ui__study-board.md#h-7003ad0dbba9) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb)

```tsx
() => {
          if (!composing && !pending) changeEditor(null);
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0723e8438d06, B-980f51687382, B-422b145a9a9b, B-d6bde365cc1f, B-5326344b6c97, B-7ec45b175694

## X-4e2ed1c8495b

**div · 조작/부품 영역** · div · event-surface

- 실제 소스: [src/ui/study-board.tsx:474](../../../src/ui/study-board.tsx#L474)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: Boolean(editor) ∧ truthy: editor
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCompositionStart** → [@onCompositionStart · H-baf211a4b669](../handlers/ui__study-board.md#h-baf211a4b669)

```tsx
() => setComposing(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onCompositionEnd** → [@onCompositionEnd · H-9efa3623d961](../handlers/ui__study-board.md#h-9efa3623d961)

```tsx
() => setComposing(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-bfd56b46a180

**할 일** · Input · user-control

- 실제 소스: [src/ui/study-board.tsx:479](../../../src/ui/study-board.tsx#L479)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: Boolean(editor) ∧ truthy: editor
- 실행 차단 disabled: pending
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-41e4ae4bf7d6](../handlers/ui__study-board.md#h-41e4ae4bf7d6) → [changeEditor · H-7003ad0dbba9](../handlers/ui__study-board.md#h-7003ad0dbba9) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb)

```tsx
(e) => changeEditor({ ...editor, title: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-980f51687382, B-422b145a9a9b, B-d6bde365cc1f, B-5326344b6c97, B-7ec45b175694

## X-8799018d3830

**메모 (선택)** · Textarea · user-control

- 실제 소스: [src/ui/study-board.tsx:488](../../../src/ui/study-board.tsx#L488)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: Boolean(editor) ∧ truthy: editor
- 실행 차단 disabled: pending
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ad6fea28d351](../handlers/ui__study-board.md#h-ad6fea28d351) → [changeEditor · H-7003ad0dbba9](../handlers/ui__study-board.md#h-7003ad0dbba9) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb)

```tsx
(e) => changeEditor({ ...editor, body: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-980f51687382, B-422b145a9a9b, B-d6bde365cc1f, B-5326344b6c97, B-7ec45b175694

## X-646c1597a793

**연결할 주제 (선택)** · Select · user-control

- 실제 소스: [src/ui/study-board.tsx:497](../../../src/ui/study-board.tsx#L497)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: Boolean(editor) ∧ truthy: editor
- 실행 차단 disabled: pending
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-18239d387d79](../handlers/ui__study-board.md#h-18239d387d79) → [changeEditor · H-7003ad0dbba9](../handlers/ui__study-board.md#h-7003ad0dbba9) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb)

```tsx
(e) => changeEditor({ ...editor, topicId: e.target.value || null })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-980f51687382, B-422b145a9a9b, B-d6bde365cc1f, B-5326344b6c97, B-7ec45b175694

## X-cd7cf1cba5e5

**놓을 열** · Select · user-control

- 실제 소스: [src/ui/study-board.tsx:516](../../../src/ui/study-board.tsx#L516)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: Boolean(editor) ∧ truthy: editor
- 실행 차단 disabled: pending
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-bbf6858577ec](../handlers/ui__study-board.md#h-bbf6858577ec) → [changeEditor · H-7003ad0dbba9](../handlers/ui__study-board.md#h-7003ad0dbba9) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb)

```tsx
(e) => changeEditor({ ...editor, columnId: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-980f51687382, B-422b145a9a9b, B-d6bde365cc1f, B-5326344b6c97, B-7ec45b175694

## X-16e186b49ff8

**카드 저장** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:529](../../../src/ui/study-board.tsx#L529)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: Boolean(editor) ∧ truthy: editor
- 실행 차단 disabled: disabled || composing || !editor.title.trim()
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [completeEditor · H-f29ae73735ab](../handlers/ui__study-board.md#h-f29ae73735ab) → [changeEditor · H-7003ad0dbba9](../handlers/ui__study-board.md#h-7003ad0dbba9) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb) → [save · H-9cc01a6fba89](../handlers/ui__study-board.md#h-9cc01a6fba89) → [@callback:content.cards.map · H-643c4e109654](../handlers/ui__study-board.md#h-643c4e109654) → [@callback:content.cards.some · H-6dc19b27d6b6](../handlers/ui__study-board.md#h-6dc19b27d6b6)

```tsx
completeEditor
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ea11dd9fbdf5, B-862f5515bbc7, B-4ef4f9f35ad1, B-91f92fc2e0d3, B-980f51687382, B-422b145a9a9b, B-d6bde365cc1f, B-5326344b6c97, B-7ec45b175694, B-e9248c3615aa, B-1dc60e224a40, B-08e3a9cad614, B-99fff395f6ff, B-c29685de0e76, B-17d0b8d2ca48, B-ad487e18e914, B-e8d7b6ce064d

## X-175d0e3388f2

**취소** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:536](../../../src/ui/study-board.tsx#L536)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: Boolean(editor) ∧ truthy: editor
- 실행 차단 disabled: pending || composing
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c2fba184e784](../handlers/ui__study-board.md#h-c2fba184e784) → [changeEditor · H-7003ad0dbba9](../handlers/ui__study-board.md#h-7003ad0dbba9) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb)

```tsx
() => changeEditor(null)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-980f51687382, B-422b145a9a9b, B-d6bde365cc1f, B-5326344b6c97, B-7ec45b175694

## X-7aecdf65e87e

**카드 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:542](../../../src/ui/study-board.tsx#L542)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: Boolean(editor) ∧ truthy: editor ∧ truthy: pending
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e6efa2641baa](../handlers/ui__study-board.md#h-e6efa2641baa) → [changeEditor · H-7003ad0dbba9](../handlers/ui__study-board.md#h-7003ad0dbba9) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb) → [save · H-9cc01a6fba89](../handlers/ui__study-board.md#h-9cc01a6fba89)

```tsx
() => {
                  if (save(current.current)) changeEditor(null);
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3cb83bdb5263, B-980f51687382, B-422b145a9a9b, B-d6bde365cc1f, B-5326344b6c97, B-7ec45b175694, B-e9248c3615aa, B-1dc60e224a40, B-08e3a9cad614, B-99fff395f6ff, B-c29685de0e76, B-17d0b8d2ca48, B-ad487e18e914

## X-315ffb527fda

**보드 열** · Modal · component-callback-contract

- 실제 소스: [src/ui/study-board.tsx:553](../../../src/ui/study-board.tsx#L553)
- 연결 표면: [R17](../paths/R17.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: Boolean(columnEdit)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-3eb69b73a553](../handlers/ui__study-board.md#h-3eb69b73a553)

```tsx
() => {
          if (!composing) setColumnEdit(null);
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c0a989ec5fb0

## X-c6f73aced45d

**div · 조작/부품 영역** · div · event-surface

- 실제 소스: [src/ui/study-board.tsx:561](../../../src/ui/study-board.tsx#L561)
- 연결 표면: [R17](../paths/R17.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: Boolean(columnEdit) ∧ truthy: columnEdit
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCompositionStart** → [@onCompositionStart · H-103f462f6e34](../handlers/ui__study-board.md#h-103f462f6e34)

```tsx
() => setComposing(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onCompositionEnd** → [@onCompositionEnd · H-c710bbcccf4d](../handlers/ui__study-board.md#h-c710bbcccf4d)

```tsx
() => setComposing(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a444619315b7

**열 이름** · Input · user-control

- 실제 소스: [src/ui/study-board.tsx:566](../../../src/ui/study-board.tsx#L566)
- 연결 표면: [R17](../paths/R17.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: Boolean(columnEdit) ∧ truthy: columnEdit
- 실행 차단 disabled: pending
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-c06054171632](../handlers/ui__study-board.md#h-c06054171632)

```tsx
(e) => setColumnEdit({ ...columnEdit, title: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a6c349617799

**열 저장** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:573](../../../src/ui/study-board.tsx#L573)
- 연결 표면: [R17](../paths/R17.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: Boolean(columnEdit) ∧ truthy: columnEdit
- 실행 차단 disabled: disabled || composing || !columnEdit.title.trim()
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-745f2a9f0997](../handlers/ui__study-board.md#h-745f2a9f0997) → [save · H-9cc01a6fba89](../handlers/ui__study-board.md#h-9cc01a6fba89) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb) → [@callback:content.columns.map · H-f2aa9a507103](../handlers/ui__study-board.md#h-f2aa9a507103) → [@callback:content.columns.some · H-6c5fc3cf2694](../handlers/ui__study-board.md#h-6c5fc3cf2694)

```tsx
() => {
                const next = {
                  ...content,
                  columns: content.columns.some((c) => c.id === columnEdit.id)
                    ? content.columns.map((c) => (c.id === columnEdit.id ? columnEdit : c))
                    : [...content.columns, columnEdit],
                };
                if (save(next)) setColumnEdit(null);
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-93a2f65b8676, B-f2756a5d47a7, B-e9248c3615aa, B-1dc60e224a40, B-08e3a9cad614, B-99fff395f6ff, B-c29685de0e76, B-17d0b8d2ca48, B-ad487e18e914, B-5326344b6c97, B-7ec45b175694, B-e206427807cb

## X-8c1242caaa53

**빈 열 지우기** · Button · user-control

- 실제 소스: [src/ui/study-board.tsx:589](../../../src/ui/study-board.tsx#L589)
- 연결 표면: [R17](../paths/R17.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: Boolean(columnEdit) ∧ truthy: columnEdit ∧ truthy: content.columns.some((c) => c.id === columnEdit.id)
- 실행 차단 disabled: disabled ||
                  composing ||
                  content.columns.length <= 1 ||
                  content.cards.some((c) => c.columnId === columnEdit.id)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d6ce1d5ba13f](../handlers/ui__study-board.md#h-d6ce1d5ba13f) → [@callback:content.columns.filter · H-576c02749c44](../handlers/ui__study-board.md#h-576c02749c44) → [save · H-9cc01a6fba89](../handlers/ui__study-board.md#h-9cc01a6fba89) → [errorText · H-e7cfeb092d8e](../handlers/ui__study-board.md#h-e7cfeb092d8e) → [draft · H-fa0ae3ab96eb](../handlers/ui__study-board.md#h-fa0ae3ab96eb)

```tsx
() => {
                  if (
                    save({
                      ...content,
                      columns: content.columns.filter((c) => c.id !== columnEdit.id),
                    })
                  )
                    setColumnEdit(null);
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e9f87dd58241, B-e9248c3615aa, B-1dc60e224a40, B-08e3a9cad614, B-99fff395f6ff, B-c29685de0e76, B-17d0b8d2ca48, B-ad487e18e914, B-5326344b6c97, B-7ec45b175694

