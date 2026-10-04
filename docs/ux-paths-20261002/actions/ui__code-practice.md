# src/ui/code-practice.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-60f402d9660a

**trash ? '휴지통의 코드 예제' : '코딩 연습'** · section · event-surface

- 실제 소스: [src/ui/code-practice.tsx:129](../../../src/ui/code-practice.tsx#L129)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [R34](../paths/R34.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClickCapture** → [@onClickCapture · H-c2bb7468a781](../handlers/ui__code-practice.md#h-c2bb7468a781) → [openExample · H-301565868a19](../handlers/ui__code-practice.md#h-301565868a19)

```tsx
event => {
      if (!onOpenExample || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = event.target instanceof Element ? event.target.closest('a')?.getAttribute('href') : null;
      if (href === '#/code' || href?.startsWith('#/code/')) { event.preventDefault(); openExample(href === '#/code' ? undefined : decodeURIComponent(href.slice('#/code/'.length))); }
    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-78cee2706416, B-7fea75c8e25c, B-fff3998c3f54, B-522422710dd0, B-faf7c3ac8eb0, B-d8fbd4be5a00

## X-0a6e9d4bafe6

**예제 추가** · Button · user-control

- 실제 소스: [src/ui/code-practice.tsx:141](../../../src/ui/code-practice.tsx#L141)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: !trash
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [add · H-452185069b84](../handlers/ui__code-practice.md#h-452185069b84) → [openExample · H-301565868a19](../handlers/ui__code-practice.md#h-301565868a19) → [commit · H-0b893d5e5764](../handlers/ui__code-practice.md#h-0b893d5e5764) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657) → [canSave · H-0935c8baf1c2](../handlers/ui__code-practice.md#h-0935c8baf1c2)

```tsx
add
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-37e03f75034e, B-faf7c3ac8eb0, B-d8fbd4be5a00, B-f76a5f50923c, B-bd928cfd0d3d, B-bdd859badf50, B-50a4e4ddc089

## X-205f7c03d1ee

**CodeTopicLinkEditor · 조작/부품 영역** · CodeTopicLinkEditor · component-callback-contract

- 실제 소스: [src/ui/code-practice.tsx:151](../../../src/ui/code-practice.tsx#L151)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: selected && !trash
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

## X-05b12f7b26bb

**CodeExampleEditor · 조작/부품 영역** · CodeExampleEditor · component-callback-contract

- 실제 소스: [src/ui/code-practice.tsx:158](../../../src/ui/code-practice.tsx#L158)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: selected && !trash
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 저장·변경 요청 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
onSaved
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onCopied** → [openExample · H-301565868a19](../handlers/ui__code-practice.md#h-301565868a19)

```tsx
openExample
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-faf7c3ac8eb0, B-d8fbd4be5a00

**onTrash** → [@onTrash · H-c3a04329a73f](../handlers/ui__code-practice.md#h-c3a04329a73f) → [openExample · H-301565868a19](../handlers/ui__code-practice.md#h-301565868a19) → [commit · H-0b893d5e5764](../handlers/ui__code-practice.md#h-0b893d5e5764) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657) → [canSave · H-0935c8baf1c2](../handlers/ui__code-practice.md#h-0935c8baf1c2)

```tsx
() => {
              const row = repository
                .getSnapshot()
                .codeExamples?.find((item) => item.id === selected.id);
              if (
                row &&
                commit({
                  type: 'trashCodeExample',
                  id: row.id,
                  expectedVersion: row.version,
                })
              )
                openExample(undefined);
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-401856963f12, B-faf7c3ac8eb0, B-d8fbd4be5a00, B-f76a5f50923c, B-bd928cfd0d3d, B-bdd859badf50, B-50a4e4ddc089

## X-251e9a8c07b4

**예제 목록으로** · a · user-control

- 실제 소스: [src/ui/code-practice.tsx:195](../../../src/ui/code-practice.tsx#L195)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: falsy: selected && !trash ∧ truthy: !trash && exampleId && !selected
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/code`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-cd7337362688

**휴지통 확인** · a · user-control

- 실제 소스: [src/ui/code-practice.tsx:195](../../../src/ui/code-practice.tsx#L195)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: falsy: selected && !trash ∧ truthy: !trash && exampleId && !selected
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/trash`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-54c7e4a6c3ba

**예제 찾기** · Input · user-control

- 실제 소스: [src/ui/code-practice.tsx:200](../../../src/ui/code-practice.tsx#L200)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [R34](../paths/R34.md)
- 직접 표시 조건: falsy: selected && !trash ∧ truthy: examples.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-abc9bbd5262b](../handlers/ui__code-practice.md#h-abc9bbd5262b)

```tsx
(event) => setQuery(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-848ee0791ec8

**예제 언어** · Select · user-control

- 실제 소스: [src/ui/code-practice.tsx:206](../../../src/ui/code-practice.tsx#L206)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [R34](../paths/R34.md)
- 직접 표시 조건: falsy: selected && !trash ∧ truthy: examples.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-b57e16b24710](../handlers/ui__code-practice.md#h-b57e16b24710)

```tsx
(event) => setLanguageFilter(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-28d13b2af312

**예제 검색·언어 초기화** · Button · user-control

- 실제 소스: [src/ui/code-practice.tsx:224](../../../src/ui/code-practice.tsx#L224)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [R34](../paths/R34.md)
- 직접 표시 조건: falsy: selected && !trash ∧ truthy: examples.length > 0 ∧ truthy: visibleExamples.length === 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-0e986568987d](../handlers/ui__code-practice.md#h-0e986568987d)

```tsx
() => {setQuery('');setLanguageFilter('all');}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9a7d2e7b88c1

**{row.title || '제목 없는 예제'}** · a · user-control

- 실제 소스: [src/ui/code-practice.tsx:232](../../../src/ui/code-practice.tsx#L232)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [R34](../paths/R34.md)
- 직접 표시 조건: falsy: selected && !trash
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/code/${encodeURIComponent(row.id)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(visibleExamples) · 229행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-cc54d7d5740b

**예제 복원** · Button · user-control

- 실제 소스: [src/ui/code-practice.tsx:239](../../../src/ui/code-practice.tsx#L239)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [R34](../paths/R34.md)
- 직접 표시 조건: falsy: selected && !trash ∧ truthy: trash
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-92b0b3dafd4e](../handlers/ui__code-practice.md#h-92b0b3dafd4e) → [commit · H-0b893d5e5764](../handlers/ui__code-practice.md#h-0b893d5e5764) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657) → [canSave · H-0935c8baf1c2](../handlers/ui__code-practice.md#h-0935c8baf1c2)

```tsx
() =>
                      commit({
                        type: 'restoreCodeExample',
                        id: row.id,
                        expectedVersion: row.version,
                      })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f76a5f50923c, B-bd928cfd0d3d, B-bdd859badf50, B-50a4e4ddc089

반복: map(visibleExamples) · 229행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-70b10fc0b1eb

**'pagehide'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/code-practice.tsx:430](../../../src/ui/code-practice.tsx#L430)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**pagehide** → [save · H-20faecd725ac](../handlers/ui__code-practice.md#h-20faecd725ac)

```tsx
save
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-9652dd33ae74

## X-537055549fe2

**'beforeunload'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/code-practice.tsx:431](../../../src/ui/code-practice.tsx#L431)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**beforeunload** → [unload · H-053ed50af4d0](../handlers/ui__code-practice.md#h-053ed50af4d0) → [save · H-20faecd725ac](../handlers/ui__code-practice.md#h-20faecd725ac)

```tsx
unload
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-376f028674d9, B-9652dd33ae74

## X-14b1aabb3a8d

**← 예제 목록** · a · user-control

- 실제 소스: [src/ui/code-practice.tsx:568](../../../src/ui/code-practice.tsx#L568)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/code`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c15ccb96df5a

**예제 제목** · Input · user-control

- 실제 소스: [src/ui/code-practice.tsx:570](../../../src/ui/code-practice.tsx#L570)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: isBlocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4344f0224d33](../handlers/ui__code-practice.md#h-4344f0224d33) → [update · H-02a26358bfb6](../handlers/ui__code-practice.md#h-02a26358bfb6) → [flush · H-162b9348acb5](../handlers/ui__code-practice.md#h-162b9348acb5) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [@callback:next.codeExamples!.find · H-923134a1064b](../handlers/ui__code-practice.md#h-923134a1064b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657) → [canSave · H-0935c8baf1c2](../handlers/ui__code-practice.md#h-0935c8baf1c2) → [saveDraft · H-a697efae3645](../handlers/ui__code-practice.md#h-a697efae3645) → [draft · H-69f3037b2556](../handlers/ui__code-practice.md#h-69f3037b2556)

```tsx
(event) => update({ ...current.current, title: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e4e5a3288377, B-5efb5119ae4c, B-5c16aa7af95c, B-031e14478050, B-c9bf4da5ad07, B-a9ad325c1f85, B-487b59f4cef8, B-d3426f0623a3, B-d1ae9bdc7097, B-49fb4041f080, B-50a4e4ddc089, B-fed1ece731c4, B-0fc391f3c2cf, B-5a3a63002ea7

## X-612a84986d89

**언어** · Select · user-control

- 실제 소스: [src/ui/code-practice.tsx:578](../../../src/ui/code-practice.tsx#L578)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: isBlocked || phase !== 'idle'
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-14e99799cff4](../handlers/ui__code-practice.md#h-14e99799cff4) → [update · H-02a26358bfb6](../handlers/ui__code-practice.md#h-02a26358bfb6) → [flush · H-162b9348acb5](../handlers/ui__code-practice.md#h-162b9348acb5) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [@callback:next.codeExamples!.find · H-923134a1064b](../handlers/ui__code-practice.md#h-923134a1064b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657) → [canSave · H-0935c8baf1c2](../handlers/ui__code-practice.md#h-0935c8baf1c2) → [saveDraft · H-a697efae3645](../handlers/ui__code-practice.md#h-a697efae3645) → [draft · H-69f3037b2556](../handlers/ui__code-practice.md#h-69f3037b2556)

```tsx
(event) =>
            update({
              ...current.current,
              language: event.target.value as CodeLanguage,
            })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e4e5a3288377, B-5efb5119ae4c, B-5c16aa7af95c, B-031e14478050, B-c9bf4da5ad07, B-a9ad325c1f85, B-487b59f4cef8, B-d3426f0623a3, B-d1ae9bdc7097, B-49fb4041f080, B-50a4e4ddc089, B-fed1ece731c4, B-0fc391f3c2cf, B-5a3a63002ea7

## X-a89a37b40fa6

**시작 코드 넣기** · Button · user-control

- 실제 소스: [src/ui/code-practice.tsx:598](../../../src/ui/code-practice.tsx#L598)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: isBlocked || Boolean(content.code.trim())
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-172439e91c0d](../handlers/ui__code-practice.md#h-172439e91c0d) → [update · H-02a26358bfb6](../handlers/ui__code-practice.md#h-02a26358bfb6) → [flush · H-162b9348acb5](../handlers/ui__code-practice.md#h-162b9348acb5) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [@callback:next.codeExamples!.find · H-923134a1064b](../handlers/ui__code-practice.md#h-923134a1064b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657) → [canSave · H-0935c8baf1c2](../handlers/ui__code-practice.md#h-0935c8baf1c2) → [saveDraft · H-a697efae3645](../handlers/ui__code-practice.md#h-a697efae3645) → [draft · H-69f3037b2556](../handlers/ui__code-practice.md#h-69f3037b2556)

```tsx
() =>
            update({
              ...current.current,
              code: CODE_STARTERS[content.language],
            })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e4e5a3288377, B-5efb5119ae4c, B-5c16aa7af95c, B-031e14478050, B-c9bf4da5ad07, B-a9ad325c1f85, B-487b59f4cef8, B-d3426f0623a3, B-d1ae9bdc7097, B-49fb4041f080, B-50a4e4ddc089, B-fed1ece731c4, B-0fc391f3c2cf, B-5a3a63002ea7

## X-3c677b764398

**SourceEditor · 조작/부품 영역** · SourceEditor · component-callback-contract

- 실제 소스: [src/ui/code-practice.tsx:611](../../../src/ui/code-practice.tsx#L611)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: isBlocked; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-64409d55789a](../handlers/ui__code-practice.md#h-64409d55789a) → [update · H-02a26358bfb6](../handlers/ui__code-practice.md#h-02a26358bfb6) → [flush · H-162b9348acb5](../handlers/ui__code-practice.md#h-162b9348acb5) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [@callback:next.codeExamples!.find · H-923134a1064b](../handlers/ui__code-practice.md#h-923134a1064b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657) → [canSave · H-0935c8baf1c2](../handlers/ui__code-practice.md#h-0935c8baf1c2) → [saveDraft · H-a697efae3645](../handlers/ui__code-practice.md#h-a697efae3645) → [draft · H-69f3037b2556](../handlers/ui__code-practice.md#h-69f3037b2556)

```tsx
(code) => update({ ...current.current, code })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e4e5a3288377, B-5efb5119ae4c, B-5c16aa7af95c, B-031e14478050, B-c9bf4da5ad07, B-a9ad325c1f85, B-487b59f4cef8, B-d3426f0623a3, B-d1ae9bdc7097, B-49fb4041f080, B-50a4e4ddc089, B-fed1ece731c4, B-0fc391f3c2cf, B-5a3a63002ea7

**onRun** → [@onRun · H-0166eea20dfa](../handlers/ui__code-practice.md#h-0166eea20dfa) → [start · H-3672b0666f90](../handlers/ui__code-practice.md#h-3672b0666f90) → [@callback:execution.result.then · H-0427f12e21b5](../handlers/ui__code-practice.md#h-0427f12e21b5) → [update · H-02a26358bfb6](../handlers/ui__code-practice.md#h-02a26358bfb6) → [flush · H-162b9348acb5](../handlers/ui__code-practice.md#h-162b9348acb5) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [@callback:next.codeExamples!.find · H-923134a1064b](../handlers/ui__code-practice.md#h-923134a1064b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657) → [canSave · H-0935c8baf1c2](../handlers/ui__code-practice.md#h-0935c8baf1c2) → [saveDraft · H-a697efae3645](../handlers/ui__code-practice.md#h-a697efae3645) → [draft · H-69f3037b2556](../handlers/ui__code-practice.md#h-69f3037b2556) → [@callback:executeCodeTerminal · H-1174834cdfe6](../handlers/ui__code-practice.md#h-1174834cdfe6)

```tsx
() => start()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c13812b5ac57, B-8c6e343148c6, B-f8521d4165f7, B-58f7f95c4908, B-e4e5a3288377, B-5efb5119ae4c, B-5c16aa7af95c, B-031e14478050, B-c9bf4da5ad07, B-a9ad325c1f85, B-487b59f4cef8, B-d3426f0623a3, B-d1ae9bdc7097, B-49fb4041f080, B-50a4e4ddc089, B-fed1ece731c4, B-0fc391f3c2cf, B-5a3a63002ea7, B-02c1004d8f6f

## X-06d379115ab4

**실행 방식** · Select · user-control

- 실제 소스: [src/ui/code-practice.tsx:618](../../../src/ui/code-practice.tsx#L618)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: phase !== 'idle' || isBlocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ab469d37ab65](../handlers/ui__code-practice.md#h-ab469d37ab65) → [update · H-02a26358bfb6](../handlers/ui__code-practice.md#h-02a26358bfb6) → [flush · H-162b9348acb5](../handlers/ui__code-practice.md#h-162b9348acb5) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [@callback:next.codeExamples!.find · H-923134a1064b](../handlers/ui__code-practice.md#h-923134a1064b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657) → [canSave · H-0935c8baf1c2](../handlers/ui__code-practice.md#h-0935c8baf1c2) → [saveDraft · H-a697efae3645](../handlers/ui__code-practice.md#h-a697efae3645) → [draft · H-69f3037b2556](../handlers/ui__code-practice.md#h-69f3037b2556)

```tsx
(event) =>
          update({
            ...current.current,
            inputMode: event.target.value as 'batch' | 'terminal',
          })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e4e5a3288377, B-5efb5119ae4c, B-5c16aa7af95c, B-031e14478050, B-c9bf4da5ad07, B-a9ad325c1f85, B-487b59f4cef8, B-d3426f0623a3, B-d1ae9bdc7097, B-49fb4041f080, B-50a4e4ddc089, B-fed1ece731c4, B-0fc391f3c2cf, B-5a3a63002ea7

## X-042de0b63cf8

**실행에 사용할 입력값** · Textarea · user-control

- 실제 소스: [src/ui/code-practice.tsx:647](../../../src/ui/code-practice.tsx#L647)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: isBlocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-c11493ef577d](../handlers/ui__code-practice.md#h-c11493ef577d) → [update · H-02a26358bfb6](../handlers/ui__code-practice.md#h-02a26358bfb6) → [flush · H-162b9348acb5](../handlers/ui__code-practice.md#h-162b9348acb5) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [@callback:next.codeExamples!.find · H-923134a1064b](../handlers/ui__code-practice.md#h-923134a1064b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657) → [canSave · H-0935c8baf1c2](../handlers/ui__code-practice.md#h-0935c8baf1c2) → [saveDraft · H-a697efae3645](../handlers/ui__code-practice.md#h-a697efae3645) → [draft · H-69f3037b2556](../handlers/ui__code-practice.md#h-69f3037b2556)

```tsx
(event) => update({ ...current.current, stdin: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e4e5a3288377, B-5efb5119ae4c, B-5c16aa7af95c, B-031e14478050, B-c9bf4da5ad07, B-a9ad325c1f85, B-487b59f4cef8, B-d3426f0623a3, B-d1ae9bdc7097, B-49fb4041f080, B-50a4e4ddc089, B-fed1ece731c4, B-0fc391f3c2cf, B-5a3a63002ea7

## X-8cf11bf9f315

**입력 없이 실행** · Button · user-control

- 실제 소스: [src/ui/code-practice.tsx:667](../../../src/ui/code-practice.tsx#L667)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: inputRequested && !content.stdin.trim()
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-484e40343760](../handlers/ui__code-practice.md#h-484e40343760) → [start · H-3672b0666f90](../handlers/ui__code-practice.md#h-3672b0666f90) → [@callback:execution.result.then · H-0427f12e21b5](../handlers/ui__code-practice.md#h-0427f12e21b5) → [update · H-02a26358bfb6](../handlers/ui__code-practice.md#h-02a26358bfb6) → [flush · H-162b9348acb5](../handlers/ui__code-practice.md#h-162b9348acb5) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [@callback:next.codeExamples!.find · H-923134a1064b](../handlers/ui__code-practice.md#h-923134a1064b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657) → [canSave · H-0935c8baf1c2](../handlers/ui__code-practice.md#h-0935c8baf1c2) → [saveDraft · H-a697efae3645](../handlers/ui__code-practice.md#h-a697efae3645) → [draft · H-69f3037b2556](../handlers/ui__code-practice.md#h-69f3037b2556) → [@callback:executeCodeTerminal · H-1174834cdfe6](../handlers/ui__code-practice.md#h-1174834cdfe6)

```tsx
() => start(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c13812b5ac57, B-8c6e343148c6, B-f8521d4165f7, B-58f7f95c4908, B-e4e5a3288377, B-5efb5119ae4c, B-5c16aa7af95c, B-031e14478050, B-c9bf4da5ad07, B-a9ad325c1f85, B-487b59f4cef8, B-d3426f0623a3, B-d1ae9bdc7097, B-49fb4041f080, B-50a4e4ddc089, B-fed1ece731c4, B-0fc391f3c2cf, B-5a3a63002ea7, B-02c1004d8f6f

## X-d673a4810f30

**실행 준비 중… {phase === 'running' ? '실행 중…' : '실행'}** · Button · user-control

- 실제 소스: [src/ui/code-practice.tsx:672](../../../src/ui/code-practice.tsx#L672)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: isBlocked || phase !== 'idle'
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-619fd49d9cc8](../handlers/ui__code-practice.md#h-619fd49d9cc8) → [start · H-3672b0666f90](../handlers/ui__code-practice.md#h-3672b0666f90) → [@callback:execution.result.then · H-0427f12e21b5](../handlers/ui__code-practice.md#h-0427f12e21b5) → [update · H-02a26358bfb6](../handlers/ui__code-practice.md#h-02a26358bfb6) → [flush · H-162b9348acb5](../handlers/ui__code-practice.md#h-162b9348acb5) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [@callback:next.codeExamples!.find · H-923134a1064b](../handlers/ui__code-practice.md#h-923134a1064b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657) → [canSave · H-0935c8baf1c2](../handlers/ui__code-practice.md#h-0935c8baf1c2) → [saveDraft · H-a697efae3645](../handlers/ui__code-practice.md#h-a697efae3645) → [draft · H-69f3037b2556](../handlers/ui__code-practice.md#h-69f3037b2556) → [@callback:executeCodeTerminal · H-1174834cdfe6](../handlers/ui__code-practice.md#h-1174834cdfe6)

```tsx
() => start()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c13812b5ac57, B-8c6e343148c6, B-f8521d4165f7, B-58f7f95c4908, B-e4e5a3288377, B-5efb5119ae4c, B-5c16aa7af95c, B-031e14478050, B-c9bf4da5ad07, B-a9ad325c1f85, B-487b59f4cef8, B-d3426f0623a3, B-d1ae9bdc7097, B-49fb4041f080, B-50a4e4ddc089, B-fed1ece731c4, B-0fc391f3c2cf, B-5a3a63002ea7, B-02c1004d8f6f

## X-9027c1ef1bdc

**응답 대기 중지 중지** · Button · user-control

- 실제 소스: [src/ui/code-practice.tsx:676](../../../src/ui/code-practice.tsx#L676)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: phase !== 'idle'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-4108c73ffc7b](../handlers/ui__code-practice.md#h-4108c73ffc7b)

```tsx
() => run.current?.cancel()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e7954decac3a

**입력 끝내기 (EOF)** · Button · user-control

- 실제 소스: [src/ui/code-practice.tsx:706](../../../src/ui/code-practice.tsx#L706)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: interactive
- 실행 차단 disabled: phase !== 'running'
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e2a200c7e1c1](../handlers/ui__code-practice.md#h-e2a200c7e1c1)

```tsx
() => {
                terminalExecution.current?.write('\u0004');
                terminalHandle.current?.focus();
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7346d1952ecd

**터미널에 보낼 입력** · Textarea · user-control

- 실제 소스: [src/ui/code-practice.tsx:729](../../../src/ui/code-practice.tsx#L729)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: interactive
- 실행 차단 disabled: phase !== 'running'
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCompositionStart** → [@onCompositionStart · H-f43d4c1f41b9](../handlers/ui__code-practice.md#h-f43d4c1f41b9)

```tsx
() => {
                composingInput.current = true;
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onCompositionEnd** → [@onCompositionEnd · H-fad90393948c](../handlers/ui__code-practice.md#h-fad90393948c)

```tsx
() => {
                composingInput.current = false;
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onChange** → [@onChange · H-b3f6fb39a5f4](../handlers/ui__code-practice.md#h-b3f6fb39a5f4)

```tsx
(event) => setTerminalInput(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onKeyDown** → [@onKeyDown · H-0f09622c4e0a](../handlers/ui__code-practice.md#h-0f09622c4e0a)

```tsx
(event) => {
                if (
                  event.key !== 'Enter' ||
                  event.shiftKey ||
                  event.nativeEvent.isComposing ||
                  composingInput.current ||
                  event.keyCode === 229
                )
                  return;
                event.preventDefault();
                terminalExecution.current?.write(
                  terminalInput.replace(/\r\n?/g, '\n').replaceAll('\n', '\r') + '\r',
                );
                setTerminalInput('');
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-1ba9e8a778e4

## X-b66e89a4720b

**입력 보내기** · Button · user-control

- 실제 소스: [src/ui/code-practice.tsx:761](../../../src/ui/code-practice.tsx#L761)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: interactive
- 실행 차단 disabled: phase !== 'running'
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e01ccb707452](../handlers/ui__code-practice.md#h-e01ccb707452)

```tsx
() => {
                terminalExecution.current?.write(
                  terminalInput.replace(/\r\n?/g, '\n').replaceAll('\n', '\r') + '\r',
                );
                setTerminalInput('');
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-caa7b907ec50

**보낸 입력** · summary · user-control

- 실제 소스: [src/ui/code-practice.tsx:792](../../../src/ui/code-practice.tsx#L792)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: lastRun?.mode === 'terminal' && lastRun.stdin
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1ddd7e52906e

**내용·설명** · Textarea · user-control

- 실제 소스: [src/ui/code-practice.tsx:822](../../../src/ui/code-practice.tsx#L822)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: isBlocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-355407168e62](../handlers/ui__code-practice.md#h-355407168e62) → [update · H-02a26358bfb6](../handlers/ui__code-practice.md#h-02a26358bfb6) → [flush · H-162b9348acb5](../handlers/ui__code-practice.md#h-162b9348acb5) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [@callback:next.codeExamples!.find · H-923134a1064b](../handlers/ui__code-practice.md#h-923134a1064b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657) → [canSave · H-0935c8baf1c2](../handlers/ui__code-practice.md#h-0935c8baf1c2) → [saveDraft · H-a697efae3645](../handlers/ui__code-practice.md#h-a697efae3645) → [draft · H-69f3037b2556](../handlers/ui__code-practice.md#h-69f3037b2556)

```tsx
(event) => update({ ...current.current, notes: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e4e5a3288377, B-5efb5119ae4c, B-5c16aa7af95c, B-031e14478050, B-c9bf4da5ad07, B-a9ad325c1f85, B-487b59f4cef8, B-d3426f0623a3, B-d1ae9bdc7097, B-49fb4041f080, B-50a4e4ddc089, B-fed1ece731c4, B-0fc391f3c2cf, B-5a3a63002ea7

## X-787fc6dca1dd

**초안을 별도 예제로 보관** · Button · user-control

- 실제 소스: [src/ui/code-practice.tsx:836](../../../src/ui/code-practice.tsx#L836)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: conflict
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c868215e2ff7](../handlers/ui__code-practice.md#h-c868215e2ff7) → [copy · H-f2755b852bc1](../handlers/ui__code-practice.md#h-f2755b852bc1) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657)

```tsx
() => copy(conflict.content)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c256b75cdb1c, B-619fc5063edd, B-0303a2ab8744, B-6a8d905c1c65, B-50a4e4ddc089

## X-b2cee771994e

**초안 원문 보관 후 편집** · Button · user-control

- 실제 소스: [src/ui/code-practice.tsx:840](../../../src/ui/code-practice.tsx#L840)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: isBlocked && !conflict
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f9933f62bf43](../handlers/ui__code-practice.md#h-f9933f62bf43) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b)

```tsx
() => {
            try {
              archiveDamagedDraft(key, '코드 예제 초안 읽기 실패');
              clearCodeDraft(key);
              blocked.current = false;
              setBlocked(false);
              setError('초안 원문을 보관했습니다. 저장된 예제를 편집할 수 있습니다.');
            } catch (e) {
              setError(errorMessage(e));
            }
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-905d8bdcbb75, B-29366d444ff2, B-50a4e4ddc089

## X-83b4ec543146

**파일로 보관** · Button · user-control

- 실제 소스: [src/ui/code-practice.tsx:859](../../../src/ui/code-practice.tsx#L859)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [exportFile · H-1cf5b4ae45b9](../handlers/ui__code-practice.md#h-1cf5b4ae45b9) → [@callback:setTimeout · H-a628cde0a085](../handlers/ui__code-practice.md#h-a628cde0a085) → [@callback:snapshot.revisions.filter · H-1362326f0d6f](../handlers/ui__code-practice.md#h-1362326f0d6f) → [draft · H-69f3037b2556](../handlers/ui__code-practice.md#h-69f3037b2556)

```tsx
exportFile
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5a3a63002ea7

## X-8e50a636c804

**지금 저장** · Button · user-control

- 실제 소스: [src/ui/code-practice.tsx:862](../../../src/ui/code-practice.tsx#L862)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: isBlocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-44d80a7afb24](../handlers/ui__code-practice.md#h-44d80a7afb24) → [saveNow · H-972d8bf95a59](../handlers/ui__code-practice.md#h-972d8bf95a59) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [flush · H-162b9348acb5](../handlers/ui__code-practice.md#h-162b9348acb5) → [@callback:next.codeExamples!.find · H-923134a1064b](../handlers/ui__code-practice.md#h-923134a1064b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657) → [canSave · H-0935c8baf1c2](../handlers/ui__code-practice.md#h-0935c8baf1c2) → [saveDraft · H-a697efae3645](../handlers/ui__code-practice.md#h-a697efae3645) → [draft · H-69f3037b2556](../handlers/ui__code-practice.md#h-69f3037b2556)

```tsx
() => {
              void saveNow();
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-31358b6f2f1a, B-f07246ee05b7, B-e72c3ece5bcd, B-2c0725688eb7, B-87de47988774, B-533bcb659c76, B-50a4e4ddc089, B-5efb5119ae4c, B-5c16aa7af95c, B-031e14478050, B-c9bf4da5ad07, B-a9ad325c1f85, B-487b59f4cef8, B-d3426f0623a3, B-d1ae9bdc7097, B-49fb4041f080, B-fed1ece731c4, B-0fc391f3c2cf, B-5a3a63002ea7

## X-589b90fd0e45

**사본 만들기** · Button · user-control

- 실제 소스: [src/ui/code-practice.tsx:870](../../../src/ui/code-practice.tsx#L870)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: isBlocked || phase !== 'idle'
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-599ec65d8ebb](../handlers/ui__code-practice.md#h-599ec65d8ebb) → [copy · H-f2755b852bc1](../handlers/ui__code-practice.md#h-f2755b852bc1) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657)

```tsx
() => copy()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c256b75cdb1c, B-619fc5063edd, B-0303a2ab8744, B-6a8d905c1c65, B-50a4e4ddc089

## X-794d166f0fc9

**휴지통으로 이동** · Button · user-control

- 실제 소스: [src/ui/code-practice.tsx:873](../../../src/ui/code-practice.tsx#L873)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: isBlocked || phase !== 'idle'
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-33002a25c0b2](../handlers/ui__code-practice.md#h-33002a25c0b2) → [flush · H-162b9348acb5](../handlers/ui__code-practice.md#h-162b9348acb5) → [errorMessage · H-8dae215a929b](../handlers/ui__code-practice.md#h-8dae215a929b) → [@callback:next.codeExamples!.find · H-923134a1064b](../handlers/ui__code-practice.md#h-923134a1064b) → [context · H-708b49420657](../handlers/ui__code-practice.md#h-708b49420657) → [canSave · H-0935c8baf1c2](../handlers/ui__code-practice.md#h-0935c8baf1c2) → [saveDraft · H-a697efae3645](../handlers/ui__code-practice.md#h-a697efae3645) → [draft · H-69f3037b2556](../handlers/ui__code-practice.md#h-69f3037b2556)

```tsx
() => {
              if (flush()) onTrash();
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-119488883656, B-5efb5119ae4c, B-5c16aa7af95c, B-031e14478050, B-c9bf4da5ad07, B-a9ad325c1f85, B-487b59f4cef8, B-d3426f0623a3, B-d1ae9bdc7097, B-49fb4041f080, B-50a4e4ddc089, B-fed1ece731c4, B-0fc391f3c2cf, B-5a3a63002ea7

