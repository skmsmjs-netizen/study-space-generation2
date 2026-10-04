# src/ui/concept-library.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-31c54d0906b4

**읽기** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:201](../../../src/ui/concept-library.tsx#L201)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6c4d87432d8a](../handlers/ui__concept-library.md#h-6c4d87432d8a)

```tsx
() => setEditing(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-549e4b7ae478

**설명 만들기** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:204](../../../src/ui/concept-library.tsx#L204)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-04328aa10ab0](../handlers/ui__concept-library.md#h-04328aa10ab0)

```tsx
() => setEditing(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a3d5e3ddb06c

**저장 다시 확인** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:211](../../../src/ui/concept-library.tsx#L211)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ab2b779144c5](../handlers/ui__concept-library.md#h-ab2b779144c5) → [@callback:run · H-1fde5cd08333](../handlers/ui__concept-library.md#h-1fde5cd08333) → [run · H-865fcc9be0a8](../handlers/ui__concept-library.md#h-865fcc9be0a8) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845)

```tsx
() =>
              run(async () => {
                await repository.flush?.();
                return repository.getSnapshot();
              }, '저장 상태를 다시 확인했습니다.')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-bd2ad3aaab27, B-7fe419f8a461, B-ba8c495b130b

## X-1792b2769815

**개념 원문 가져오기** · input · user-control

- 실제 소스: [src/ui/concept-library.tsx:238](../../../src/ui/concept-library.tsx#L238)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: editing
- 실행 차단 disabled: busy || !writable
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-893e45847d73](../handlers/ui__concept-library.md#h-893e45847d73) → [importFile · H-0610f5d3732c](../handlers/ui__concept-library.md#h-0610f5d3732c) → [@callback:run · H-80bdfbd9e080](../handlers/ui__concept-library.md#h-80bdfbd9e080) → [@callback:raws.every · H-74db3e89d2d7](../handlers/ui__concept-library.md#h-74db3e89d2d7) → [@callback:files.map · H-293e5df2c30c](../handlers/ui__concept-library.md#h-293e5df2c30c) → [@callback:files.some · H-9767ded1f749](../handlers/ui__concept-library.md#h-9767ded1f749) → [run · H-865fcc9be0a8](../handlers/ui__concept-library.md#h-865fcc9be0a8) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845)

```tsx
(e) => {
                void importFile(e.target.files, false);
                e.target.value = '';
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-e5a0a8488160, B-77c05b0f0dba, B-d717878b8684, B-a65bf934db80, B-197f29903e2a, B-e59250b0c502, B-887c06038c36, B-868dd38dcbf9, B-bd2ad3aaab27, B-7fe419f8a461, B-ba8c495b130b

## X-7ff43ff68672

**설명 결과 가져오기** · input · user-control

- 실제 소스: [src/ui/concept-library.tsx:252](../../../src/ui/concept-library.tsx#L252)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: editing
- 실행 차단 disabled: busy || !writable
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-04142170ed3f](../handlers/ui__concept-library.md#h-04142170ed3f) → [importFile · H-0610f5d3732c](../handlers/ui__concept-library.md#h-0610f5d3732c) → [@callback:run · H-80bdfbd9e080](../handlers/ui__concept-library.md#h-80bdfbd9e080) → [@callback:raws.every · H-74db3e89d2d7](../handlers/ui__concept-library.md#h-74db3e89d2d7) → [@callback:files.map · H-293e5df2c30c](../handlers/ui__concept-library.md#h-293e5df2c30c) → [@callback:files.some · H-9767ded1f749](../handlers/ui__concept-library.md#h-9767ded1f749) → [run · H-865fcc9be0a8](../handlers/ui__concept-library.md#h-865fcc9be0a8) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845)

```tsx
(e) => {
                void importFile(e.target.files?.[0], true);
                e.target.value = '';
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-e5a0a8488160, B-77c05b0f0dba, B-d717878b8684, B-a65bf934db80, B-197f29903e2a, B-e59250b0c502, B-887c06038c36, B-868dd38dcbf9, B-bd2ad3aaab27, B-7fe419f8a461, B-ba8c495b130b

## X-ecf924b296ad

**다음 작업 묶음** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:272](../../../src/ui/concept-library.tsx#L272)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: editing ∧ truthy: catalog
- 실행 차단 disabled: busy || !writable
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c4c9b3e25bc2](../handlers/ui__concept-library.md#h-c4c9b3e25bc2) → [@callback:run · H-9b22f9ebfa8b](../handlers/ui__concept-library.md#h-9b22f9ebfa8b) → [run · H-865fcc9be0a8](../handlers/ui__concept-library.md#h-865fcc9be0a8) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845)

```tsx
() =>
                    run(() => {
                      const result = openConceptBatch(repository, catalog);
                      downloadConceptFile(
                        conceptJobFile(result.data, result.batch),
                        `${result.batch.id}.json`,
                      );
                      return result.data;
                    }, '다음 30개까지 작업 묶음으로 내보냈습니다.')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-bd2ad3aaab27, B-7fe419f8a461, B-ba8c495b130b

## X-8d652d973632

**원문 내보내기** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:287](../../../src/ui/concept-library.tsx#L287)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: editing ∧ truthy: catalog
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2c9901685174](../handlers/ui__concept-library.md#h-2c9901685174)

```tsx
() =>
                    downloadConceptFile(
                      catalog.raw,
                      catalog.filename.split('/').at(-1) ?? '개념 원문.json',
                    )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b3d34d11a670

**열린 작업 묶음 · 중단한 작업 이어가기** · summary · user-control

- 실제 소스: [src/ui/concept-library.tsx:300](../../../src/ui/concept-library.tsx#L300)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: editing ∧ truthy: catalog
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-49bd21465324

**묶음 내보내기** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:309](../../../src/ui/concept-library.tsx#L309)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: editing ∧ truthy: catalog
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6367b74042a8](../handlers/ui__concept-library.md#h-6367b74042a8)

```tsx
() => downloadConceptFile(conceptJobFile(data, b), `${b.id}.json`)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map((data.conceptBatches ?? []) .filter((b) => b.catalogId === catalog.id && b.status !== 'closed')) · 301행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-16ffe4e7445c

**이어서 작성 잠시 중단** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:314](../../../src/ui/concept-library.tsx#L314)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: editing ∧ truthy: catalog
- 실행 차단 disabled: busy || !writable
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b864f74c670d](../handlers/ui__concept-library.md#h-b864f74c670d) → [@callback:run · H-d618f4236301](../handlers/ui__concept-library.md#h-d618f4236301) → [run · H-865fcc9be0a8](../handlers/ui__concept-library.md#h-865fcc9be0a8) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845)

```tsx
() =>
                          run(
                            () =>
                              repository.execute({
                                type: 'saveConceptBatch',
                                userId: data.userId,
                                namespace: data.namespace,
                                at: new Date().toISOString(),
                                opId: crypto.randomUUID(),
                                id: b.id,
                                expectedVersion: b.version,
                                content: {
                                  catalogId: b.catalogId,
                                  sourceIds: b.sourceIds,
                                  baseVersions: b.baseVersions,
                                  status: b.status === 'paused' ? 'open' : 'paused',
                                },
                              }),
                            '작업 상태를 저장했습니다.',
                          )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-79c7cb78d8a0, B-bd2ad3aaab27, B-7fe419f8a461, B-ba8c495b130b

반복: map((data.conceptBatches ?? []) .filter((b) => b.catalogId === catalog.id && b.status !== 'closed')) · 301행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-0aa37dc93773

**묶음 닫기** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:341](../../../src/ui/concept-library.tsx#L341)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: editing ∧ truthy: catalog
- 실행 차단 disabled: busy || !writable
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2c31c9cbca78](../handlers/ui__concept-library.md#h-2c31c9cbca78) → [@callback:run · H-d4b6b0232de8](../handlers/ui__concept-library.md#h-d4b6b0232de8) → [run · H-865fcc9be0a8](../handlers/ui__concept-library.md#h-865fcc9be0a8) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845)

```tsx
() =>
                          run(
                            () =>
                              repository.execute({
                                type: 'saveConceptBatch',
                                userId: data.userId,
                                namespace: data.namespace,
                                at: new Date().toISOString(),
                                opId: crypto.randomUUID(),
                                id: b.id,
                                expectedVersion: b.version,
                                content: {
                                  catalogId: b.catalogId,
                                  sourceIds: b.sourceIds,
                                  baseVersions: b.baseVersions,
                                  status: 'closed',
                                },
                              }),
                            '작업 묶음을 닫았습니다. 기존 결과와 이력은 유지했습니다.',
                          )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-bd2ad3aaab27, B-7fe419f8a461, B-ba8c495b130b

반복: map((data.conceptBatches ?? []) .filter((b) => b.catalogId === catalog.id && b.status !== 'closed')) · 301행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-fdc2d434fb72

**원문 선택** · Select · user-control

- 실제 소스: [src/ui/concept-library.tsx:376](../../../src/ui/concept-library.tsx#L376)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: (data.conceptCatalogs?.length ?? 0) > 1
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-e1fd5ca08e61](../handlers/ui__concept-library.md#h-e1fd5ca08e61)

```tsx
(e) => {
            setCatalogId(e.target.value);
            setSelected('');
            setPage(0);
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-43a01f85d6c0

**목록으로 돌아가기** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:396](../../../src/ui/concept-library.tsx#L396)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: falsy: !catalog ∧ truthy: original
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-027cae9c16ab](../handlers/ui__concept-library.md#h-027cae9c16ab)

```tsx
() => {
            pendingFocus.current = { scope: viewScope, target: 'list' };
            setSelected('');
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d8633257d481

**ConceptEditor · 조작/부품 영역** · ConceptEditor · component-callback-contract

- 실제 소스: [src/ui/concept-library.tsx:403](../../../src/ui/concept-library.tsx#L403)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: falsy: !catalog ∧ truthy: original ∧ truthy: editing
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

## X-5872ac847e77

**개념 찾기** · Input · user-control

- 실제 소스: [src/ui/concept-library.tsx:427](../../../src/ui/concept-library.tsx#L427)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: falsy: !catalog ∧ falsy: original
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-c1283467d6d4](../handlers/ui__concept-library.md#h-c1283467d6d4)

```tsx
(e) => {
                setQuery(e.target.value);
                setPage(0);
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-6bfedb174710

**화면 유형** · Select · user-control

- 실제 소스: [src/ui/concept-library.tsx:435](../../../src/ui/concept-library.tsx#L435)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: falsy: !catalog ∧ falsy: original
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-13842b8138a1](../handlers/ui__concept-library.md#h-13842b8138a1)

```tsx
(e) => {
                setFilter(e.target.value);
                setPage(0);
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-48570c001f71

**{i.name} {동적 내용 · src/ui/concept-library.tsx:480}** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:470](../../../src/ui/concept-library.tsx#L470)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: falsy: !catalog ∧ falsy: original
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-8aaae9816cdc](../handlers/ui__concept-library.md#h-8aaae9816cdc)

```tsx
(event) => {
                    setListPosition({ sourceId: i.id, x: Math.max(0, window.scrollX),
                      y: Math.max(0, window.scrollY), offset: event.currentTarget.getBoundingClientRect().top });
                    pendingFocus.current = { scope: viewScope, target: 'reader' };
                    setSelected(i.id);
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(visible.slice(currentPage * 30, currentPage * 30 + 30)) · 466행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-410e03ff4dd5

**이전 목록** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:498](../../../src/ui/concept-library.tsx#L498)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: falsy: !catalog ∧ falsy: original ∧ truthy: maxPage > 0
- 실행 차단 disabled: currentPage === 0
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-4bad1f4a54d3](../handlers/ui__concept-library.md#h-4bad1f4a54d3)

```tsx
() => setPage(currentPage - 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-01e151ce1ffc

**다음 목록** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:504](../../../src/ui/concept-library.tsx#L504)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: falsy: !catalog ∧ falsy: original ∧ truthy: maxPage > 0
- 실행 차단 disabled: currentPage >= maxPage
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2cda87eaf295](../handlers/ui__concept-library.md#h-2cda87eaf295)

```tsx
() => setPage(currentPage + 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-045105526932

**직전 수정 되돌리기** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:649](../../../src/ui/concept-library.tsx#L649)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: saved
- 실행 차단 disabled: busy || !writable
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f684cfb65633](../handlers/ui__concept-library.md#h-f684cfb65633) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845) → [@callback:next.conceptEditions!.find · H-611ca08b64b8](../handlers/ui__concept-library.md#h-611ca08b64b8) → [@callback:[...repository.getSnapshot().revisions]
              .reverse()
              .find · H-8e7b653daa41](../handlers/ui__concept-library.md#h-8e7b653daa41)

```tsx
async () => {
            const revision = [...repository.getSnapshot().revisions]
              .reverse()
              .find((r) => r.entityId === saved.id);
            if (!revision?.before) {
              setError('처음 작성한 설명은 이력에서 확인할 수 있습니다.');
              return;
            }
            setBusy(true);
            try {
              const next = repository.execute({
                type: 'undoRevision',
                userId: data.userId,
                namespace: data.namespace,
                opId: crypto.randomUUID(),
                at: new Date().toISOString(),
                revisionId: revision.id,
                expectedVersion: saved.version,
              });
              onSaved(next);
              const restored = next.conceptEditions!.find((e) => e.id === saved.id)!;
              setVersion(restored.version);
              setText(JSON.stringify(conceptContent(restored), null, 2));
              setChecks(restored.checks);
              storeDraftSafely(
                boot.key,
                JSON.stringify({
                  version: restored.version,
                  text: JSON.stringify(conceptContent(restored), null, 2),
                }),
              );
              await repository.flush?.();
              clearStoredDraft(boot.key);
              setNotice('직전 수정으로 되돌렸습니다. 이후의 이력도 보관했습니다.');
            } catch (e) {
              setError(errorText(e));
            } finally {
              setBusy(false);
            }
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-dcc32299ebdf, B-8f6382a2539b, B-8c46a766ce7e, B-ba8c495b130b

## X-af7835cc2389

**원문·분류 근거·수정 이력** · summary · user-control

- 실제 소스: [src/ui/concept-library.tsx:697](../../../src/ui/concept-library.tsx#L697)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ef3e6c83b048

**{e.title}** · a · user-control

- 실제 소스: [src/ui/concept-library.tsx:707](../../../src/ui/concept-library.tsx#L707)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `e.url`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-8ce3780901f6

**화면 유형** · Select · user-control

- 실제 소스: [src/ui/concept-library.tsx:729](../../../src/ui/concept-library.tsx#L729)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: content
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-964ccad017af](../handlers/ui__concept-library.md#h-964ccad017af) → [@callback:conceptTemplates.templates
                                        .find · H-24f3e9ac6351](../handlers/ui__concept-library.md#h-24f3e9ac6351) → [@callback:conceptTemplates.templates
                                        .find((t) => t.type === displayType)!
                                        .requiredSlots.map · H-7208f2370406](../handlers/ui__concept-library.md#h-7208f2370406) → [@callback:content.screen!.design!.roles.find · H-9d5912278049](../handlers/ui__concept-library.md#h-9d5912278049) → [@callback:conceptTemplates.templates.find · H-6448843f38e1](../handlers/ui__concept-library.md#h-6448843f38e1) → [change · H-fe521a4f3e6e](../handlers/ui__concept-library.md#h-fe521a4f3e6e) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845)

```tsx
(e) => {
              if (content) {
                const displayType = (e.target.value || null) as typeof content.displayType;
                change(
                  JSON.stringify(
                    {
                      ...content,
                      displayType,
                      screen:
                        content.screen && displayType
                          ? {
                              ...content.screen,
                              type: displayType,
                              ...(content.screen.design
                                ? {
                                    design: {
                                      ...content.screen.design,
                                      templateId: conceptTemplates.templates.find(
                                        (t) => t.type === displayType,
                                      )!.id,
                                      roles: conceptTemplates.templates
                                        .find((t) => t.type === displayType)!
                                        .requiredSlots.map((key) => ({
                                          key,
                                          sceneIds:
                                            content.screen!.design!.roles.find(
                                              (role) => role.key === key,
                                            )?.sceneIds ?? [],
                                        })),
                                    },
                                  }
                                : {}),
                            }
                          : content.screen,
                    },
                    null,
                    2,
                  ),
                );
              }
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2ddb621186e2, B-476f5492b96c, B-fd0b68346535, B-6c7012a7c811, B-e19431bd0c11, B-ba8c495b130b

## X-e14f94623241

**이 유형을 고른 이유** · Textarea · user-control

- 실제 소스: [src/ui/concept-library.tsx:781](../../../src/ui/concept-library.tsx#L781)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: content
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-6e0f67aa1109](../handlers/ui__concept-library.md#h-6e0f67aa1109) → [change · H-fe521a4f3e6e](../handlers/ui__concept-library.md#h-fe521a4f3e6e) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845)

```tsx
(e) =>
              content && change(JSON.stringify({ ...content, reason: e.target.value }, null, 2))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6c7012a7c811, B-e19431bd0c11, B-ba8c495b130b

## X-7d14b13d7abe

**설명 작성 시작** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:789](../../../src/ui/concept-library.tsx#L789)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: content ∧ truthy: !content.screen && content.displayType
- 실행 차단 disabled: !writable
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a38b8e5b75dc](../handlers/ui__concept-library.md#h-a38b8e5b75dc) → [change · H-fe521a4f3e6e](../handlers/ui__concept-library.md#h-fe521a4f3e6e) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845)

```tsx
() =>
                content &&
                change(
                  JSON.stringify(
                    {
                      ...content,
                      screen: {
                        type: content.displayType,
                        mode: 'plain',
                        navigation: 'static',
                        title: original.name,
                        intro: '',
                        scenes: [
                          {
                            action: '핵심 보기',
                            title: '어떤 뜻인가요?',
                            body: original.def,
                            caption: '',
                            takeaway: original.insight,
                          },
                        ],
                      },
                    },
                    null,
                    2,
                  ),
                )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6c7012a7c811, B-e19431bd0c11, B-ba8c495b130b

## X-f5233253fb50

**설명 제목** · Input · user-control

- 실제 소스: [src/ui/concept-library.tsx:825](../../../src/ui/concept-library.tsx#L825)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: content ∧ truthy: content.screen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-969f72571ea3](../handlers/ui__concept-library.md#h-969f72571ea3) → [change · H-fe521a4f3e6e](../handlers/ui__concept-library.md#h-fe521a4f3e6e) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845)

```tsx
(e) =>
                  content?.screen &&
                  change(
                    JSON.stringify(
                      { ...content, screen: { ...content.screen, title: e.target.value } },
                      null,
                      2,
                    ),
                  )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6c7012a7c811, B-e19431bd0c11, B-ba8c495b130b

## X-e21e5f911ddc

**설명을 시작하는 문장** · Textarea · user-control

- 실제 소스: [src/ui/concept-library.tsx:839](../../../src/ui/concept-library.tsx#L839)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: content ∧ truthy: content.screen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ee3f17001c14](../handlers/ui__concept-library.md#h-ee3f17001c14) → [change · H-fe521a4f3e6e](../handlers/ui__concept-library.md#h-fe521a4f3e6e) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845)

```tsx
(e) =>
                  content?.screen &&
                  change(
                    JSON.stringify(
                      { ...content, screen: { ...content.screen, intro: e.target.value } },
                      null,
                      2,
                    ),
                  )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6c7012a7c811, B-e19431bd0c11, B-ba8c495b130b

## X-8108f38fc23d

**유형에 필요한 내용 연결** · summary · user-control

- 실제 소스: [src/ui/concept-library.tsx:855](../../../src/ui/concept-library.tsx#L855)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: content ∧ truthy: content.screen ∧ truthy: content.screen.design
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b2859f39772f

**scene.action** · Checkbox · user-control

- 실제 소스: [src/ui/concept-library.tsx:898](../../../src/ui/concept-library.tsx#L898)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: content ∧ truthy: content.screen ∧ truthy: content.screen.design
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-d2c91dfe0aaf](../handlers/ui__concept-library.md#h-d2c91dfe0aaf) → [@callback:content.screen!.design!.roles.map · H-123ab5537581](../handlers/ui__concept-library.md#h-123ab5537581) → [change · H-fe521a4f3e6e](../handlers/ui__concept-library.md#h-fe521a4f3e6e) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845) → [@callback:role.sceneIds.filter · H-07584f7ec0fa](../handlers/ui__concept-library.md#h-07584f7ec0fa)

```tsx
(event) => {
                            const nextIds = event.target.checked
                              ? [...role.sceneIds, scene.id!]
                              : role.sceneIds.filter((id) => id !== scene.id);
                            change(
                              JSON.stringify(
                                {
                                  ...content,
                                  screen: {
                                    ...content.screen,
                                    design: {
                                      ...content.screen!.design,
                                      roles: content.screen!.design!.roles.map((current) =>
                                        current.key === role.key
                                          ? { ...current, sceneIds: nextIds }
                                          : current,
                                      ),
                                    },
                                  },
                                },
                                null,
                                2,
                              ),
                            );
                          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-23bae24c62ac, B-ac959b6c79d2, B-6c7012a7c811, B-e19431bd0c11, B-ba8c495b130b

반복: map(content.screen!.scenes) · 897행; map(content.screen.design.roles) · 860행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-91d6f9e3e90d

**{index + 1} . {scene.action}** · summary · user-control

- 실제 소스: [src/ui/concept-library.tsx:935](../../../src/ui/concept-library.tsx#L935)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: content ∧ truthy: content.screen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(content.screen.scenes) · 933행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-1aecba591ee3

**['선택·단계 이름', '핵심 문장', '설명 본문', '그림 설명', '기억할 판단'][
                            fieldIndex
                          ]** · Textarea · user-control

- 실제 소스: [src/ui/concept-library.tsx:940](../../../src/ui/concept-library.tsx#L940)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: content ∧ truthy: content.screen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-30d9e7a8ee31](../handlers/ui__concept-library.md#h-30d9e7a8ee31) → [@callback:content.screen.scenes.map · H-60391c7e2f40](../handlers/ui__concept-library.md#h-60391c7e2f40) → [change · H-fe521a4f3e6e](../handlers/ui__concept-library.md#h-fe521a4f3e6e) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845)

```tsx
(e) =>
                          content?.screen &&
                          change(
                            JSON.stringify(
                              {
                                ...content,
                                screen: {
                                  ...content.screen,
                                  scenes: content.screen.scenes.map((s, i) =>
                                    i === index ? { ...s, [field]: e.target.value } : s,
                                  ),
                                },
                              },
                              null,
                              2,
                            ),
                          )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-1984e084008c, B-6c7012a7c811, B-e19431bd0c11, B-ba8c495b130b

반복: map(['action', 'title', 'body', 'caption', 'takeaway'] as const) · 938행; map(content.screen.scenes) · 933행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-9a14e9994240

**보류 이유** · Textarea · user-control

- 실제 소스: [src/ui/concept-library.tsx:973](../../../src/ui/concept-library.tsx#L973)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: content
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-beb9e9aa4343](../handlers/ui__concept-library.md#h-beb9e9aa4343) → [change · H-fe521a4f3e6e](../handlers/ui__concept-library.md#h-fe521a4f3e6e) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845)

```tsx
(e) =>
              content &&
              change(
                JSON.stringify(
                  {
                    ...content,
                    issue: e.target.value,
                    status: e.target.value ? 'blocked' : 'draft',
                  },
                  null,
                  2,
                ),
              )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-16555abd2a89, B-6c7012a7c811, B-e19431bd0c11, B-ba8c495b130b

## X-79ae33d610df

**제작 데이터 직접 편집** · summary · user-control

- 실제 소스: [src/ui/concept-library.tsx:994](../../../src/ui/concept-library.tsx#L994)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3de45b7862b0

**설명 제작 데이터** · Textarea · user-control

- 실제 소스: [src/ui/concept-library.tsx:995](../../../src/ui/concept-library.tsx#L995)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4118bf7d9cbb](../handlers/ui__concept-library.md#h-4118bf7d9cbb) → [change · H-fe521a4f3e6e](../handlers/ui__concept-library.md#h-fe521a4f3e6e) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845)

```tsx
(e) => change(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6c7012a7c811, B-e19431bd0c11, B-ba8c495b130b

## X-41da3835cf9f

**설명 저장** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:1003](../../../src/ui/concept-library.tsx#L1003)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !writable || busy || Boolean(boot.error)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5f823e0f1378](../handlers/ui__concept-library.md#h-5f823e0f1378) → [save · H-8fffe658afec](../handlers/ui__concept-library.md#h-8fffe658afec) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845) → [@callback:next.conceptEditions!.find · H-6c04c4a5819d](../handlers/ui__concept-library.md#h-6c04c4a5819d)

```tsx
() => save(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-163967dc1dca, B-a9b60a857040, B-cd72d3e17197, B-a3eb1ca67f1f, B-c3e68f27e187, B-2fc83ea18ee3, B-ba8c495b130b

## X-e8a214f1ae97

**현재 입력을 파일로 보관** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:1006](../../../src/ui/concept-library.tsx#L1006)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c4eb9afa4e5a](../handlers/ui__concept-library.md#h-c4eb9afa4e5a)

```tsx
() => downloadConceptFile(text, `${original.id}-draft.json`)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a055f9ef1c14

**label** · Checkbox · user-control

- 실제 소스: [src/ui/concept-library.tsx:1024](../../../src/ui/concept-library.tsx#L1024)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-2efb3b73eaa0](../handlers/ui__concept-library.md#h-2efb3b73eaa0) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845)

```tsx
(e) => {
              const next = { ...checks, [key]: e.target.checked };
              setChecks(next);
              try {
                storeDraftSafely(boot.key, JSON.stringify({ version, text, checks: next }));
                setError('');
              } catch (error) {
                setError(errorText(error));
              }
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7e564fb348dc, B-04919492ff30, B-ba8c495b130b

반복: map(Object.entries(labels)) · 1023행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-ab9aaaa2568d

**검토 내용 저장** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:1041](../../../src/ui/concept-library.tsx#L1041)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !writable || busy || Boolean(boot.error) || version === 0
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d89c54f87e92](../handlers/ui__concept-library.md#h-d89c54f87e92) → [save · H-8fffe658afec](../handlers/ui__concept-library.md#h-8fffe658afec) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845) → [@callback:next.conceptEditions!.find · H-6c04c4a5819d](../handlers/ui__concept-library.md#h-6c04c4a5819d)

```tsx
() => save(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-163967dc1dca, B-a9b60a857040, B-cd72d3e17197, B-a3eb1ca67f1f, B-c3e68f27e187, B-2fc83ea18ee3, B-ba8c495b130b

## X-57b0afe3db6e

**읽기용으로 등록** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:1048](../../../src/ui/concept-library.tsx#L1048)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !writable || busy || !Object.values(checks).every(Boolean) || version === 0
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-08294719a5b2](../handlers/ui__concept-library.md#h-08294719a5b2) → [save · H-8fffe658afec](../handlers/ui__concept-library.md#h-8fffe658afec) → [errorText · H-300701fc7845](../handlers/ui__concept-library.md#h-300701fc7845) → [@callback:next.conceptEditions!.find · H-6c04c4a5819d](../handlers/ui__concept-library.md#h-6c04c4a5819d)

```tsx
() => save(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-163967dc1dca, B-a9b60a857040, B-cd72d3e17197, B-a3eb1ca67f1f, B-c3e68f27e187, B-2fc83ea18ee3, B-ba8c495b130b

## X-e4ae6846f30a

**{s.action}** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:1102](../../../src/ui/concept-library.tsx#L1102)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: screen.navigation === 'choose' && screen.scenes.length > 1
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-8923b340b6f8](../handlers/ui__concept-library.md#h-8923b340b6f8) → [select · H-f2ad827d82e2](../handlers/ui__concept-library.md#h-f2ad827d82e2)

```tsx
() => select(i)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-279fe30d9926, B-0c4111822032

반복: map(screen.scenes) · 1101행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-2b20f563f325

**이전** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:1141](../../../src/ui/concept-library.tsx#L1141)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: screen.navigation === 'steps' && screen.scenes.length > 1
- 실행 차단 disabled: index === 0
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-08c489c1aeba](../handlers/ui__concept-library.md#h-08c489c1aeba) → [select · H-f2ad827d82e2](../handlers/ui__concept-library.md#h-f2ad827d82e2)

```tsx
() => select(index - 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-279fe30d9926, B-0c4111822032

## X-5c8f88f6bd48

**다음** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:1147](../../../src/ui/concept-library.tsx#L1147)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: screen.navigation === 'steps' && screen.scenes.length > 1
- 실행 차단 disabled: index === screen.scenes.length - 1
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-147fe1c6400b](../handlers/ui__concept-library.md#h-147fe1c6400b) → [select · H-f2ad827d82e2](../handlers/ui__concept-library.md#h-f2ad827d82e2)

```tsx
() => select(index + 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-279fe30d9926, B-0c4111822032

## X-28374bbbce94

**처음부터 보기** · Button · user-control

- 실제 소스: [src/ui/concept-library.tsx:1154](../../../src/ui/concept-library.tsx#L1154)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: screen.scenes.length > 1
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2568c389a86d](../handlers/ui__concept-library.md#h-2568c389a86d) → [select · H-f2ad827d82e2](../handlers/ui__concept-library.md#h-f2ad827d82e2)

```tsx
() => select(0)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-279fe30d9926, B-0c4111822032

