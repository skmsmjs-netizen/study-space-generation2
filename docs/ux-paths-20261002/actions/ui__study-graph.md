# src/ui/study-graph.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-18cb64205d0d

**원문과 연결 보기** · Button · user-control

- 실제 소스: [src/ui/study-graph.tsx:87](../../../src/ui/study-graph.tsx#L87)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
data.open
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-46b9d3d3f22b

**관계에서 찾기** · Input · user-control

- 실제 소스: [src/ui/study-graph.tsx:406](../../../src/ui/study-graph.tsx#L406)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-5f1cafaa8ee9](../handlers/ui__study-graph.md#h-5f1cafaa8ee9)

```tsx
(e) => setQuery(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-40038092d377

**그래프 과목** · Select · user-control

- 실제 소스: [src/ui/study-graph.tsx:413](../../../src/ui/study-graph.tsx#L413)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-a5ef14b2c88c](../handlers/ui__study-graph.md#h-a5ef14b2c88c)

```tsx
(e) => setSubject(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5dacec9423e2

**표시할 연결** · Select · user-control

- 실제 소스: [src/ui/study-graph.tsx:425](../../../src/ui/study-graph.tsx#L425)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-1ad7e9edd53b](../handlers/ui__study-graph.md#h-1ad7e9edd53b)

```tsx
(e) => setConnections(e.target.value as 'all' | 'personal')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-651484eb008a

**설명·메모 함께 보기** · Checkbox · user-control

- 실제 소스: [src/ui/study-graph.tsx:433](../../../src/ui/study-graph.tsx#L433)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-fc4d0d934527](../handlers/ui__study-graph.md#h-fc4d0d934527)

```tsx
(e) => setNotes(e.target.checked)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ae3d1afadf32

**관계 배치** · Select · user-control

- 실제 소스: [src/ui/study-graph.tsx:440](../../../src/ui/study-graph.tsx#L440)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-a5eb2c1323cb](../handlers/ui__study-graph.md#h-a5eb2c1323cb)

```tsx
(event) =>
            tools.store({ ...tools.value, layout: event.target.value as typeof layoutMode })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ce41650b7415

**주변 연결 범위** · Select · user-control

- 실제 소스: [src/ui/study-graph.tsx:456](../../../src/ui/study-graph.tsx#L456)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: truthy: centerId
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-cc7e8021772a](../handlers/ui__study-graph.md#h-cc7e8021772a)

```tsx
(e) => setDepth(Number(e.target.value))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-cb43e63e7997

**전체 관계 보기** · Button · user-control

- 실제 소스: [src/ui/study-graph.tsx:467](../../../src/ui/study-graph.tsx#L467)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: truthy: centerId
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3ceda1abb6fc](../handlers/ui__study-graph.md#h-3ceda1abb6fc)

```tsx
() => setCenterId(null)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-cb0eb714157b

**배치 간격** · Select · user-control

- 실제 소스: [src/ui/study-graph.tsx:470](../../../src/ui/study-graph.tsx#L470)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-890afb10ab2a](../handlers/ui__study-graph.md#h-890afb10ab2a)

```tsx
(e) => setSpacing(e.target.value as GraphSpacing)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ac8c2bf92e60

**배치 다시 맞추기** · Button · user-control

- 실제 소스: [src/ui/study-graph.tsx:479](../../../src/ui/study-graph.tsx#L479)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3e353186ad97](../handlers/ui__study-graph.md#h-3e353186ad97)

```tsx
() => {
            previous.current = {};
            setPinned({});
            fitSignature.current = '';
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-fa6b9301b59e

**Canvas에서 관계 잇기 ↗** · a · user-control

- 실제 소스: [src/ui/study-graph.tsx:488](../../../src/ui/study-graph.tsx#L488)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/canvas`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-466bc653ee7d

**설정 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/study-graph.tsx:493](../../../src/ui/study-graph.tsx#L493)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: truthy: preferenceError ∧ truthy: !preferencesBlocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [storePreferences · H-9576bec7afd0](../handlers/ui__study-graph.md#h-9576bec7afd0)

```tsx
storePreferences
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-9ea500416dd3, B-26ce0c64bc83, B-9954855d1b18

## X-9e953a17f584

**보기 설정 초기화** · Button · user-control

- 실제 소스: [src/ui/study-graph.tsx:497](../../../src/ui/study-graph.tsx#L497)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-39c4a68b079f](../handlers/ui__study-graph.md#h-39c4a68b079f)

```tsx
() => {
            try {
              if (preferencesBlocked)
                archiveDamagedDraft(preferenceKey, '그래프 보기 설정 원문 보관');
              writeGraphPreferences(data, { ...defaultGraphPreferences });
              lastPreferences.current = JSON.stringify(defaultGraphPreferences);
              setQuery('');
              setSubject('');
              setNotes(true);
              setConnections('all');
              setDepth(1);
              setSpacing('auto');
              setCenterId(null);
              setPreferencesBlocked(false);
              setPreferenceError('');
            } catch (e) {
              setPreferenceError(
                e instanceof Error
                  ? e.message
                  : '설정 초기화를 완료하지 못했습니다. 현재 설정은 유지했습니다.',
              );
            }
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c7d9bcf3a596, B-9586af0b46d3, B-77d264253554, B-2862a876b80f

## X-0efbec7ee7bf

**보기 도구 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/study-graph.tsx:530](../../../src/ui/study-graph.tsx#L530)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: truthy: tools.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e5a55d82cbdf](../handlers/ui__study-graph.md#h-e5a55d82cbdf)

```tsx
() => tools.store(tools.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5d04cda996ea

**보기 도구 초기화** · Button · user-control

- 실제 소스: [src/ui/study-graph.tsx:531](../../../src/ui/study-graph.tsx#L531)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: truthy: tools.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
tools.reset
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-006e4d28474a

**주제와 개념의 연결 그래프** · ReactFlow · component-callback-contract

- 실제 소스: [src/ui/study-graph.tsx:542](../../../src/ui/study-graph.tsx#L542)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: truthy: nodes.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 포인터·공간 조작 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onInit** → 네이티브/호출자 동작

```tsx
setFlow
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onNodesChange** → [@onNodesChange · H-3fd9c0df6b81](../handlers/ui__study-graph.md#h-3fd9c0df6b81) → [@callback:setNodes · H-25eff3ce6e41](../handlers/ui__study-graph.md#h-25eff3ce6e41)

```tsx
(changes) => setNodes((prev) => applyNodeChanges(changes, prev))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onNodeClick** → [@onNodeClick · H-10c4ea149119](../handlers/ui__study-graph.md#h-10c4ea149119)

```tsx
(_, n) => setSelected(n.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onMove** → [@onMove · H-399e6efd767d](../handlers/ui__study-graph.md#h-399e6efd767d)

```tsx
(_, viewport) => setZoom(viewport.zoom)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onNodeDragStop** → [@onNodeDragStop · H-47674aaddc73](../handlers/ui__study-graph.md#h-47674aaddc73) → [@callback:setPinned · H-560c16099c83](../handlers/ui__study-graph.md#h-560c16099c83)

```tsx
(_, n) => {
                previous.current = { ...previous.current, [n.id]: n.position };
                setPinned((old) => ({ ...old, [n.id]: n.position }));
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-89884927c1a9

**원문 열기 ↗** · a · user-control

- 실제 소스: [src/ui/study-graph.tsx:604](../../../src/ui/study-graph.tsx#L604)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: truthy: card
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `graphHref(card)`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-36a67580dfd0

**이 항목 주변 보기** · Button · user-control

- 실제 소스: [src/ui/study-graph.tsx:605](../../../src/ui/study-graph.tsx#L605)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: truthy: card
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-04b9ce161ae6](../handlers/ui__study-graph.md#h-04b9ce161ae6)

```tsx
() => setCenterId(card.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a9c5ed09c0df

**{other.name} {e.label} {`${e.source === card.id ? '→' : '←'} ${e.label || '내가 이은 관계'}`}** · Button · user-control

- 실제 소스: [src/ui/study-graph.tsx:614](../../../src/ui/study-graph.tsx#L614)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: truthy: card ∧ truthy: other
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c0874078a401](../handlers/ui__study-graph.md#h-c0874078a401)

```tsx
() => setSelected(other.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(related) · 608행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-09b585e24384

**항목 목록에서 선택하기** · summary · user-control

- 실제 소스: [src/ui/study-graph.tsx:632](../../../src/ui/study-graph.tsx#L632)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-adf3ecedda9b

**{names[c.kind]} · {c.name}** · Button · user-control

- 실제 소스: [src/ui/study-graph.tsx:635](../../../src/ui/study-graph.tsx#L635)
- 연결 표면: [R16](../paths/R16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b56f1256b629](../handlers/ui__study-graph.md#h-b56f1256b629)

```tsx
() => setSelected(c.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(graph.cards) · 634행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

