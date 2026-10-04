# src/ui/study-materials.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-c68720aff8f2

**자료 추가** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:138](../../../src/ui/study-materials.tsx#L138)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: !trash
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-eef125e0e3ba](../handlers/ui__study-materials.md#h-eef125e0e3ba)

```tsx
() => navigate('/materials/new')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-14075c6e5087

**자료 목록으로** · a · user-control

- 실제 소스: [src/ui/study-materials.tsx:148](../../../src/ui/study-materials.tsx#L148)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: !trash && materialId && materialId !== 'new' && !selected
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/materials`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a9b83f89d2af

**강의 자료 휴지통** · a · user-control

- 실제 소스: [src/ui/study-materials.tsx:149](../../../src/ui/study-materials.tsx#L149)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: !trash && materialId && materialId !== 'new' && !selected
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/materials/trash`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a758f261b7e1

**강의 자료 찾기** · Input · user-control

- 실제 소스: [src/ui/study-materials.tsx:152](../../../src/ui/study-materials.tsx#L152)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-8df0ea3ff00e](../handlers/ui__study-materials.md#h-8df0ea3ff00e)

```tsx
(event) => {
          setQuery(event.target.value);
          setLimit(40);
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5c04f6d18b59

**강의 자료 검색어 지우기** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:163](../../../src/ui/study-materials.tsx#L163)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: scoped.length > 0 && !visible.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-9289e9528e91](../handlers/ui__study-materials.md#h-9289e9528e91)

```tsx
() => {
              setQuery('');
              setLimit(40);
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-0ceb7d3a56d2

**{row.title}** · a · user-control

- 실제 소스: [src/ui/study-materials.tsx:200](../../../src/ui/study-materials.tsx#L200)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: falsy: trash
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/materials/${encodeURIComponent(row.id)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(visible.slice(0, Math.max(40, limit))) · 194행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-05a2f0ba51fc

**복원** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:208](../../../src/ui/study-materials.tsx#L208)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: trash
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ac2716e2d15e](../handlers/ui__study-materials.md#h-ac2716e2d15e) → [restore · H-f37fc13e18f8](../handlers/ui__study-materials.md#h-f37fc13e18f8) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [context · H-3a866d502ecc](../handlers/ui__study-materials.md#h-3a866d502ecc)

```tsx
() => restore(row)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca14e3a7baae, B-6a12388eb0d9, B-ea1eede766a0

반복: map(visible.slice(0, Math.max(40, limit))) · 194행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-c10042a1fa2b

**강의 자료 더 보기** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:213](../../../src/ui/study-materials.tsx#L213)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: visible.length > Math.max(40, limit)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-8c9ec1797f68](../handlers/ui__study-materials.md#h-8c9ec1797f68) → [@callback:setLimit · H-16fc208d34d7](../handlers/ui__study-materials.md#h-16fc208d34d7)

```tsx
() => setLimit((value) => Math.max(40, value) + 40)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1c1c030b03ac

**강의 자료 휴지통** · a · user-control

- 실제 소스: [src/ui/study-materials.tsx:217](../../../src/ui/study-materials.tsx#L217)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: !trash
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/materials/trash`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-570f08fb0017

**'click'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/study-materials.tsx:555](../../../src/ui/study-materials.tsx#L555)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**click** → [leave · H-85da2e52a121](../handlers/ui__study-materials.md#h-85da2e52a121) → [@callback:draftFlight.current
          .then · H-6275025848fe](../handlers/ui__study-materials.md#h-6275025848fe) → [@callback:draftFlight.current
          .then(() => {
            location.hash = href;
          })
          .catch · H-3e6de3139cfc](../handlers/ui__study-materials.md#h-3e6de3139cfc)

```tsx
leave
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-13dd84786dc6, B-a17199975938, B-2eee1bc9e8cc, B-16fe242b4e07

## X-f46b7fae9592

**'beforeunload'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/study-materials.tsx:556](../../../src/ui/study-materials.tsx#L556)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**beforeunload** → [before · H-8d459f298506](../handlers/ui__study-materials.md#h-8d459f298506)

```tsx
before
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-125ff9c31fea

## X-07123d01d872

**{SOURCE_ROLE_LABELS[sourceRole(segment!)]} {segment?.label ? `${segment.label} 원문` : segment?.start != null ? `${clock(segment.start)} 원문` : `${id} 원문`}** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:762](../../../src/ui/study-materials.tsx#L762)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-1e8c458ef02a](../handlers/ui__study-materials.md#h-1e8c458ef02a) → [@callback:setTimeout · H-15ddd4634f94](../handlers/ui__study-materials.md#h-15ddd4634f94) → [@callback:audioElement.current.play().catch · H-d4bcb8d76178](../handlers/ui__study-materials.md#h-d4bcb8d76178) → [chooseTab · H-a42db4836e82](../handlers/ui__study-materials.md#h-a42db4836e82) → [recordHelp · H-fe33c198fd10](../handlers/ui__study-materials.md#h-fe33c198fd10) → [@callback:attempts.map · H-61a8653126ba](../handlers/ui__study-materials.md#h-61a8653126ba) → [@callback:a.questions.map · H-96bea7d52246](../handlers/ui__study-materials.md#h-96bea7d52246) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
() => {
                chooseTab('transcript');
                if (
                  segment?.start !== null &&
                  segment?.start !== undefined &&
                  !segment.label &&
                  (!result?.source || result.source.audio?.sha256 === content.audio?.sha256) &&
                  audioElement.current
                ) {
                  audioElement.current.currentTime = segment.start;
                  void audioElement.current.play().catch(() => undefined);
                }
                setTimeout(
                  () =>
                    document
                      .getElementById(`material-segment-${id}`)
                      ?.scrollIntoView({ block: 'nearest' }),
                  0,
                );
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2c0e05108d0e, B-2dba2e7f752a, B-14445d895eb9, B-733ded9d7d69, B-f61821519769, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

반복: map(ids) · 759행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-d66702cecbba

**← 강의 자료** · a · user-control

- 실제 소스: [src/ui/study-materials.tsx:854](../../../src/ui/study-materials.tsx#L854)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/materials`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-f594ff469226

**내보내기** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:856](../../../src/ui/study-materials.tsx#L856)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [exportDraft · H-54c2d983ec50](../handlers/ui__study-materials.md#h-54c2d983ec50) → [@callback:setTimeout · H-c323fb69ce13](../handlers/ui__study-materials.md#h-c323fb69ce13) → [recordHelp · H-fe33c198fd10](../handlers/ui__study-materials.md#h-fe33c198fd10) → [@callback:attempts.map · H-61a8653126ba](../handlers/ui__study-materials.md#h-61a8653126ba) → [@callback:a.questions.map · H-96bea7d52246](../handlers/ui__study-materials.md#h-96bea7d52246) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
exportDraft
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-14445d895eb9, B-733ded9d7d69, B-f61821519769, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-d937a4b1a1dc

**원문 TXT** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:859](../../../src/ui/study-materials.tsx#L859)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !content.sourceText && !content.documents?.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-4cbb4b1b9a0d](../handlers/ui__study-materials.md#h-4cbb4b1b9a0d) → [exportText · H-3c526cba79c6](../handlers/ui__study-materials.md#h-3c526cba79c6) → [@callback:setTimeout · H-a6494480ef08](../handlers/ui__study-materials.md#h-a6494480ef08) → [recordHelp · H-fe33c198fd10](../handlers/ui__study-materials.md#h-fe33c198fd10) → [@callback:attempts.map · H-61a8653126ba](../handlers/ui__study-materials.md#h-61a8653126ba) → [@callback:a.questions.map · H-96bea7d52246](../handlers/ui__study-materials.md#h-96bea7d52246) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
() => exportText('txt')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-69722a51a27a, B-ab9b0a98d4a2, B-769164d0dba1, B-fb48a2942631, B-14445d895eb9, B-733ded9d7d69, B-f61821519769, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-ae143f8699bd

**복습 자료 MD · 답 포함** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:867](../../../src/ui/study-materials.tsx#L867)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-8208beabcd3c](../handlers/ui__study-materials.md#h-8208beabcd3c) → [exportText · H-3c526cba79c6](../handlers/ui__study-materials.md#h-3c526cba79c6) → [@callback:setTimeout · H-a6494480ef08](../handlers/ui__study-materials.md#h-a6494480ef08) → [recordHelp · H-fe33c198fd10](../handlers/ui__study-materials.md#h-fe33c198fd10) → [@callback:attempts.map · H-61a8653126ba](../handlers/ui__study-materials.md#h-61a8653126ba) → [@callback:a.questions.map · H-96bea7d52246](../handlers/ui__study-materials.md#h-96bea7d52246) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
() => exportText('md')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-69722a51a27a, B-ab9b0a98d4a2, B-769164d0dba1, B-fb48a2942631, B-14445d895eb9, B-733ded9d7d69, B-f61821519769, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-c607b0cf2f31

**GPT 연결** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:872](../../../src/ui/study-materials.tsx#L872)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: aiAllowed
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f9ef64b985b3](../handlers/ui__study-materials.md#h-f9ef64b985b3)

```tsx
() => setKeyPanel(!keyPanel)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ea606944e3ac

**초안 저장 재시도** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:890](../../../src/ui/study-materials.tsx#L890)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: draftState === 'failed'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-317b6489d2b1](../handlers/ui__study-materials.md#h-317b6489d2b1) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
() => {
            setError('');
            retain(current.current);
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-555beda84d2d

**정리 중단** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:899](../../../src/ui/study-materials.tsx#L899)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: busy
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d54e06984f15](../handlers/ui__study-materials.md#h-d54e06984f15)

```tsx
() => generationController.current?.abort()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1d7acf1d72e5

**details · 조작/부품 영역** · details · event-surface

- 실제 소스: [src/ui/study-materials.tsx:906](../../../src/ui/study-materials.tsx#L906)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onToggle** → [@onToggle · H-1211a7eac567](../handlers/ui__study-materials.md#h-1211a7eac567) → [recordHelp · H-fe33c198fd10](../handlers/ui__study-materials.md#h-fe33c198fd10) → [@callback:attempts.map · H-61a8653126ba](../handlers/ui__study-materials.md#h-61a8653126ba) → [@callback:a.questions.map · H-96bea7d52246](../handlers/ui__study-materials.md#h-96bea7d52246) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) => {
          if (tab === 'quiz' && result?.quiz) {
            const opened = event.currentTarget.open;
            setSourceOpen(opened);
            if (opened) recordHelp();
          }
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-aba5cf9fc877, B-c83ed94de34d, B-14445d895eb9, B-733ded9d7d69, B-f61821519769, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-63868b481c63

**원문·자료 열기 · 퀴즈 도움으로 보관 자료와 원문** · summary · user-control

- 실제 소스: [src/ui/study-materials.tsx:917](../../../src/ui/study-materials.tsx#L917)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1cf50d71bbae

**자료 제목** · Input · user-control

- 실제 소스: [src/ui/study-materials.tsx:921](../../../src/ui/study-materials.tsx#L921)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: interactive-when-falsy: !ready || busy || saving || importing
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-fdb8d2943fb2](../handlers/ui__study-materials.md#h-fdb8d2943fb2) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) => retain({ ...content, title: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-2385f3b1ecc3

**과목** · Select · user-control

- 실제 소스: [src/ui/study-materials.tsx:929](../../../src/ui/study-materials.tsx#L929)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: interactive-when-falsy: !ready || busy || saving || importing
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-5ab0e10c9223](../handlers/ui__study-materials.md#h-5ab0e10c9223) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) =>
                retain({ ...content, subjectId: event.target.value, topicId: null })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-099a851713e1

**연결할 주제 · 선택** · Select · user-control

- 실제 소스: [src/ui/study-materials.tsx:945](../../../src/ui/study-materials.tsx#L945)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: interactive-when-falsy: !ready || busy || saving || importing
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4dbd68efb197](../handlers/ui__study-materials.md#h-4dbd68efb197) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) => retain({ ...content, topicId: event.target.value || null })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-dd06eda8ae17

**클로바노트 열기** · a · user-control

- 실제 소스: [src/ui/study-materials.tsx:961](../../../src/ui/study-materials.tsx#L961)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: interactive-when-falsy: !ready || busy || saving || importing
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `https://clovanote.naver.com/`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-902045402038

**강의 내용·필기** · Textarea · user-control

- 실제 소스: [src/ui/study-materials.tsx:967](../../../src/ui/study-materials.tsx#L967)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: interactive-when-falsy: !ready || busy || saving || importing
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f36fdc0189de](../handlers/ui__study-materials.md#h-f36fdc0189de) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) => retain({ ...content, sourceText: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-de225586b19b

**StudyAIContextPicker · 조작/부품 영역** · StudyAIContextPicker · component-callback-contract

- 실제 소스: [src/ui/study-materials.tsx:976](../../../src/ui/study-materials.tsx#L976)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U37](../paths/U37.md)
- 직접 표시 조건: interactive-when-falsy: !ready || busy || saving || importing ∧ truthy: aiAllowed
- 실행 차단 disabled: !ready || busy || saving || importing
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onApply** → [@onApply · H-52838c4f9bab](../handlers/ui__study-materials.md#h-52838c4f9bab) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
async (sourceText) => {
                retain({ ...current.current, sourceText });
                await draftFlight.current;
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-46f2f538711a

**PhotoOutlineImport · 조작/부품 영역** · PhotoOutlineImport · component-callback-contract

- 실제 소스: [src/ui/study-materials.tsx:988](../../../src/ui/study-materials.tsx#L988)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: 별도 조건식 없음
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

## X-7fa8c19f897f

**MaterialSources · 조작/부품 영역** · MaterialSources · component-callback-contract

- 실제 소스: [src/ui/study-materials.tsx:994](../../../src/ui/study-materials.tsx#L994)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !ready || busy || saving
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onBusy** → 네이티브/호출자 동작

```tsx
setImporting
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onChange** → [@onChange · H-5bb60d42db4e](../handlers/ui__study-materials.md#h-5bb60d42db4e) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
async (documents) => {
            retain({
              ...current.current,
              documents,
              title: current.current.title || documents[0]?.name.replace(/\.[^.]+$/, '') || '',
            });
            await draftFlight.current;
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-a83a259c42a1

**자료 저장할 때 원본 파일도 비공개 서버에 보관** · Checkbox · user-control

- 실제 소스: [src/ui/study-materials.tsx:1009](../../../src/ui/study-materials.tsx#L1009)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: data.namespace === 'personal'
- 실행 차단 disabled: !ready || busy || saving || importing
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-c311a2e2d53b](../handlers/ui__study-materials.md#h-c311a2e2d53b) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(e) =>
              retain({
                ...current.current,
                originalStorage: e.target.checked ? 'private-server' : 'device',
              })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4daebea7a371, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-e2e6ea40c9b3

**이전에 중단한 녹음 내려받기** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:1028](../../../src/ui/study-materials.tsx#L1028)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: recovery
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f5836c04ca1f](../handlers/ui__study-materials.md#h-f5836c04ca1f) → [recover · H-4da9b761119b](../handlers/ui__study-materials.md#h-4da9b761119b) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:setTimeout · H-cde9c6dde90a](../handlers/ui__study-materials.md#h-cde9c6dde90a)

```tsx
() => void recover()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5e5eebe5ed57, B-d38fd518eae8, B-0c25c943c691, B-048af609f9c7, B-b248c7970b5a, B-dda478f70249, B-ea1eede766a0

## X-6cfdff0b633c

**원본 음성 내려받기** · a · user-control

- 실제 소스: [src/ui/study-materials.tsx:1045](../../../src/ui/study-materials.tsx#L1045)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: content.audio ∧ truthy: audioURL
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `audioURL`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-6e047b7b01b6

**GPT 작업** · Select · user-control

- 실제 소스: [src/ui/study-materials.tsx:1061](../../../src/ui/study-materials.tsx#L1061)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: aiAllowed
- 실행 차단 disabled: !ready || busy || saving || importing
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-09bdac2f6da4](../handlers/ui__study-materials.md#h-09bdac2f6da4) → [requestPatch · H-4aeb6183a103](../handlers/ui__study-materials.md#h-4aeb6183a103) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) => requestPatch({ task: event.target.value as StudyAITask })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-b3e4b865c1e2

**task === 'study-pack' ? '카드·퀴즈 개수' : '카드 개수'** · Select · user-control

- 실제 소스: [src/ui/study-materials.tsx:1080](../../../src/ui/study-materials.tsx#L1080)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: aiAllowed
- 실행 차단 disabled: busy || saving || importing
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-78dfb3ce65ad](../handlers/ui__study-materials.md#h-78dfb3ce65ad) → [requestPatch · H-4aeb6183a103](../handlers/ui__study-materials.md#h-4aeb6183a103) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) =>
                requestPatch({
                  requestedCardCount: Number(
                    event.target.value,
                  ) as StudyAIRequest['requestedCardCount'],
                })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-b74e43f9ae52

**정리하고 있습니다… {result ? '새 결과 만들기' : task === 'summary' ? '요약과 카드 만들기' : task === 'study-pack' ? '복습 자료 한 번에 만들기' : `${STUDY_AI_TASKS[task].label} 만들기`}** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:1098](../../../src/ui/study-materials.tsx#L1098)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: aiAllowed
- 실행 차단 disabled: !ready ||
                busy ||
                saving ||
                importing ||
                !content.subjectId ||
                task === 'tutor' ||
                (!content.sourceText.trim() &&
                  !content.documents?.some((doc) =>
                    doc.blocks.some((b) => b.included && b.text.trim()),
                  ))
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-4bc6b9fbb390](../handlers/ui__study-materials.md#h-4bc6b9fbb390) → [analyze · H-9ce20acb18fd](../handlers/ui__study-materials.md#h-9ce20acb18fd) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68) → [recordHelp · H-fe33c198fd10](../handlers/ui__study-materials.md#h-fe33c198fd10) → [@callback:attempts.map · H-61a8653126ba](../handlers/ui__study-materials.md#h-61a8653126ba) → [@callback:a.questions.map · H-96bea7d52246](../handlers/ui__study-materials.md#h-96bea7d52246)

```tsx
() => void analyze()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-3bf550d6373a, B-48b77a59ded9, B-3852be7f91d5, B-c4fb84cf0674, B-30931b8f757d, B-e5dadccfc931, B-5f92b4795d66, B-2f0ee4e65d6d, B-5caf07a7f2f0, B-15567119424c, B-4495dc94e181, B-0e607581e20a, B-281476a1601f, B-d44a90442511, B-cd6b6f03a7b4, B-0a1022565939, B-c9cd170c99ee, B-4e80084ec993, B-800f7c53c16d, B-ea1eede766a0, B-d7850d55338e, B-10c3d28319d5, B-a54bbf7011bb, B-14445d895eb9, B-733ded9d7d69, B-f61821519769

## X-d73c7cb67674

**저장 중… 자료 저장** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:1126](../../../src/ui/study-materials.tsx#L1126)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !ready || busy || saving || importing
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-562cb18b80e3](../handlers/ui__study-materials.md#h-562cb18b80e3) → [save · H-4eec818739ff](../handlers/ui__study-materials.md#h-4eec818739ff) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68) → [context · H-3a866d502ecc](../handlers/ui__study-materials.md#h-3a866d502ecc)

```tsx
() => void save()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-94c14610d55c, B-683766567d44, B-4f10e9a761bc, B-193d8c4192b7, B-5311f5e927a7, B-7dc64ea61a3e, B-a2375d422017, B-e7402a1f0659, B-5a9e19bfe8c2, B-0d39895ca076, B-8e08caff7b73, B-90fcabbed89a, B-87a4af5c02ed, B-10e03aa32a0e, B-4464944d9129, B-304a1a98d554, B-948aaf2c8bd1, B-ea1eede766a0, B-d7850d55338e, B-10c3d28319d5, B-a54bbf7011bb

## X-d18e22feb007

**처리할 원문 범위** · Select · user-control

- 실제 소스: [src/ui/study-materials.tsx:1142](../../../src/ui/study-materials.tsx#L1142)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: aiAllowed && ranges && ranges.batches.length > 1
- 실행 차단 disabled: busy || saving
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-2283d7145a92](../handlers/ui__study-materials.md#h-2283d7145a92) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) =>
              retain({
                ...current.current,
                generationProgress: {
                  sourceIdentity: ranges.sourceIdentity,
                  index: Number(event.target.value),
                  completed:
                    current.current.generationProgress?.sourceIdentity === ranges.sourceIdentity
                      ? current.current.generationProgress.completed
                      : [],
                },
              })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-adbb593d63a9, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-e3dc39aa7eca

**설명 도움 수준** · Select · user-control

- 실제 소스: [src/ui/study-materials.tsx:1176](../../../src/ui/study-materials.tsx#L1176)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready || busy || saving || importing
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-a1a35f1f1499](../handlers/ui__study-materials.md#h-a1a35f1f1499) → [requestPatch · H-4aeb6183a103](../handlers/ui__study-materials.md#h-4aeb6183a103) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) =>
              requestPatch({ support: event.target.value as StudyAIRequest['support'] })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-feb050780c85

**사고 보조 장치** · Select · user-control

- 실제 소스: [src/ui/study-materials.tsx:1187](../../../src/ui/study-materials.tsx#L1187)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready || busy || saving || importing
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-448dfc902ac9](../handlers/ui__study-materials.md#h-448dfc902ac9) → [requestPatch · H-4aeb6183a103](../handlers/ui__study-materials.md#h-4aeb6183a103) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) =>
              requestPatch({
                externalization: event.target.value as StudyAIRequest['externalization'],
              })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-0bde011966bb

**보조할 내용·범위 · 선택** · Textarea · user-control

- 실제 소스: [src/ui/study-materials.tsx:1200](../../../src/ui/study-materials.tsx#L1200)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready || busy || saving || importing
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-20f838b71ca6](../handlers/ui__study-materials.md#h-20f838b71ca6) → [requestPatch · H-4aeb6183a103](../handlers/ui__study-materials.md#h-4aeb6183a103) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) => requestPatch({ focus: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-6c22158f4bf5

**실제 문제와 조건** · Textarea · user-control

- 실제 소스: [src/ui/study-materials.tsx:1213](../../../src/ui/study-materials.tsx#L1213)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready || busy || saving || importing ∧ truthy: ['hint', 'feedback', 'practice'].includes(task)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4f205c4f341d](../handlers/ui__study-materials.md#h-4f205c4f341d) → [requestPatch · H-4aeb6183a103](../handlers/ui__study-materials.md#h-4aeb6183a103) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) => requestPatch({ problem: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-89cef2a94247

**task === 'practice' ? '현재 풀이 · 선택' : '현재 풀이·막힌 단계'** · Textarea · user-control

- 실제 소스: [src/ui/study-materials.tsx:1219](../../../src/ui/study-materials.tsx#L1219)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready || busy || saving || importing ∧ truthy: ['hint', 'feedback', 'practice'].includes(task)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-6a253f05435b](../handlers/ui__study-materials.md#h-6a253f05435b) → [requestPatch · H-4aeb6183a103](../handlers/ui__study-materials.md#h-4aeb6183a103) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) => requestPatch({ attempt: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-d6b71d498862

**task === 'hint' ? '참고 해설·판단 기준 · 선택' : '참고 해설·판단 기준'** · Textarea · user-control

- 실제 소스: [src/ui/study-materials.tsx:1225](../../../src/ui/study-materials.tsx#L1225)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: aiAllowed && task !== 'summary' && task !== 'tutor' ∧ interactive-when-falsy: !ready || busy || saving || importing ∧ truthy: ['hint', 'feedback', 'practice'].includes(task)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-0a62eb7f4ec9](../handlers/ui__study-materials.md#h-0a62eb7f4ec9) → [requestPatch · H-4aeb6183a103](../handlers/ui__study-materials.md#h-4aeb6183a103) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) => requestPatch({ reference: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-70d818643036

**생성 결과** · Select · user-control

- 실제 소스: [src/ui/study-materials.tsx:1287](../../../src/ui/study-materials.tsx#L1287)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: content.results.length > 1
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f5e4c5d5a248](../handlers/ui__study-materials.md#h-f5e4c5d5a248) → [recordHelp · H-fe33c198fd10](../handlers/ui__study-materials.md#h-fe33c198fd10) → [@callback:attempts.map · H-61a8653126ba](../handlers/ui__study-materials.md#h-61a8653126ba) → [@callback:a.questions.map · H-96bea7d52246](../handlers/ui__study-materials.md#h-96bea7d52246) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) => {
                if (tab === 'quiz') recordHelp();
                setResultIndex(Number(event.target.value));
                setCardIndex(0);
                setAnswer('');
                setEditingResult(false);
                setEditingCard('');
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0794634d01af, B-14445d895eb9, B-733ded9d7d69, B-f61821519769, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-53fb41f3c729

**{동적 내용 · src/ui/study-materials.tsx:1325}** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:1318](../../../src/ui/study-materials.tsx#L1318)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-80c899482172](../handlers/ui__study-materials.md#h-80c899482172) → [chooseTab · H-a42db4836e82](../handlers/ui__study-materials.md#h-a42db4836e82) → [recordHelp · H-fe33c198fd10](../handlers/ui__study-materials.md#h-fe33c198fd10) → [@callback:attempts.map · H-61a8653126ba](../handlers/ui__study-materials.md#h-61a8653126ba) → [@callback:a.questions.map · H-96bea7d52246](../handlers/ui__study-materials.md#h-96bea7d52246) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
() => chooseTab(value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2dba2e7f752a, B-14445d895eb9, B-733ded9d7d69, B-f61821519769, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

반복: map([ 'summary', 'transcript', 'cards', ...(result.quiz ? ['quiz' as const] : []), ...(result.map ? ['map' as const] : []), ] as const) · 1309행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-077c1859b0f7

**MaterialQuiz · 조작/부품 영역** · MaterialQuiz · component-callback-contract

- 실제 소스: [src/ui/study-materials.tsx:1340](../../../src/ui/study-materials.tsx#L1340)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'quiz' && result.quiz
- 실행 차단 disabled: busy || saving || importing
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSelected** → [@onSelected · H-0da574f497b3](../handlers/ui__study-materials.md#h-0da574f497b3) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(quizAttemptId) => {
                viewState.current = { ...viewState.current, quizAttemptId };
                retain(current.current);
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

**onChange** → [@onChange · H-23c0ecb30659](../handlers/ui__study-materials.md#h-23c0ecb30659) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(quizAttempts) => retain({ ...current.current, quizAttempts })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-f928fd4be031

**MaterialMap · 조작/부품 영역** · MaterialMap · component-callback-contract

- 실제 소스: [src/ui/study-materials.tsx:1357](../../../src/ui/study-materials.tsx#L1357)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'map' && result.map
- 실행 차단 disabled: busy || saving || importing
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-2370f90e7a6b](../handlers/ui__study-materials.md#h-2370f90e7a6b) → [@callback:current.current.results.map · H-143c97176779](../handlers/ui__study-materials.md#h-143c97176779) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(map) =>
                  retain({
                    ...current.current,
                    results: current.current.results.map((row) =>
                      row.id === result.id
                        ? { ...row, originalMap: row.originalMap ?? structuredClone(row.map), map }
                        : row,
                    ),
                  })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-fda4fd998072, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

**onCanvas** → [@onCanvas · H-ca796aa0da00](../handlers/ui__study-materials.md#h-ca796aa0da00) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [save · H-4eec818739ff](../handlers/ui__study-materials.md#h-4eec818739ff) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68) → [context · H-3a866d502ecc](../handlers/ui__study-materials.md#h-3a866d502ecc)

```tsx
async () => {
                  try {
                    if (!(await save())) return;
                    const next = await addMaterialMapToCanvas(repository, current.current, result);
                    onSaved(next);
                    setNotice('개념도를 Canvas에 추가했습니다. 기존 카드와 배치는 유지했습니다.');
                  } catch (error) {
                    setError(message(error));
                  }
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-1ac5d5782b72, B-60e8600805aa, B-f5d48f3b53d6, B-ea1eede766a0, B-94c14610d55c, B-683766567d44, B-4f10e9a761bc, B-193d8c4192b7, B-5311f5e927a7, B-7dc64ea61a3e, B-a2375d422017, B-e7402a1f0659, B-5a9e19bfe8c2, B-0d39895ca076, B-8e08caff7b73, B-90fcabbed89a, B-87a4af5c02ed, B-10e03aa32a0e, B-4464944d9129, B-304a1a98d554, B-948aaf2c8bd1, B-d7850d55338e, B-10c3d28319d5, B-a54bbf7011bb

## X-9b5194199363

**결과 편집 마치기 결과 수정** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:1389](../../../src/ui/study-materials.tsx#L1389)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-72edcda06cfd](../handlers/ui__study-materials.md#h-72edcda06cfd)

```tsx
() => setEditingResult(!editingResult)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c5e5048e4208

**`${index + 1}번째 보조 결과`** · Textarea · user-control

- 실제 소스: [src/ui/study-materials.tsx:1399](../../../src/ui/study-materials.tsx#L1399)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' ∧ truthy: editingResult
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-363dbba8c595](../handlers/ui__study-materials.md#h-363dbba8c595) → [@callback:current.current.results.map · H-c118a608ef6b](../handlers/ui__study-materials.md#h-c118a608ef6b) → [@callback:item.summary.map · H-b38d6812d75b](../handlers/ui__study-materials.md#h-b38d6812d75b) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) =>
                        retain({
                          ...current.current,
                          results: current.current.results.map((item) =>
                            item.id === result.id
                              ? {
                                  ...item,
                                  summary: item.summary.map((line, at) =>
                                    at === index
                                      ? {
                                          ...line,
                                          originalText: line.originalText ?? line.text,
                                          text: event.target.value,
                                        }
                                      : line,
                                  ),
                                }
                              : item,
                          ),
                        })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7b79d3ec8e3f, B-eb9ef8da3be8, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

반복: map(result.summary) · 1392행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-0a3b650f1c91

**생성 당시 결과** · summary · user-control

- 실제 소스: [src/ui/study-materials.tsx:1430](../../../src/ui/study-materials.tsx#L1430)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' ∧ truthy: row.originalText !== undefined
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(result.summary) · 1392행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-adff623fbb6a

**생성 결과로 되돌리기** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:1432](../../../src/ui/study-materials.tsx#L1432)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'summary' ∧ truthy: row.originalText !== undefined
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-292e8d723785](../handlers/ui__study-materials.md#h-292e8d723785) → [@callback:current.current.results.map · H-7382364a962a](../handlers/ui__study-materials.md#h-7382364a962a) → [@callback:item.summary.map · H-7bee08bbfef7](../handlers/ui__study-materials.md#h-7bee08bbfef7) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
() =>
                          retain({
                            ...current.current,
                            results: current.current.results.map((item) =>
                              item.id === result.id
                                ? {
                                    ...item,
                                    summary: item.summary.map((line, at) =>
                                      at === index
                                        ? { ...line, text: line.originalText ?? line.text }
                                        : line,
                                    ),
                                  }
                                : item,
                            ),
                          })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-95974c43e60d, B-7f2c88ca7347, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

반복: map(result.summary) · 1392행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-5cfc75372820

**`${segment.id} 원문`** · Textarea · user-control

- 실제 소스: [src/ui/study-materials.tsx:1473](../../../src/ui/study-materials.tsx#L1473)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'transcript'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-16fa8741c2b3](../handlers/ui__study-materials.md#h-16fa8741c2b3) → [@callback:content.results.map · H-22740504a6d6](../handlers/ui__study-materials.md#h-22740504a6d6) → [@callback:row.segments.map · H-51e31a6f88a7](../handlers/ui__study-materials.md#h-51e31a6f88a7) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) =>
                      retain({
                        ...content,
                        results: content.results.map((row) =>
                          row.id === result.id
                            ? {
                                ...row,
                                segments: row.segments.map((item) =>
                                  item.id === segment.id
                                    ? {
                                        ...item,
                                        originalText: item.originalText ?? item.text,
                                        text: event.target.value,
                                      }
                                    : item,
                                ),
                              }
                            : row,
                        ),
                      })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-a9834e055af4, B-795f00199309, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

반복: map(result.segments) · 1468행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-ffc6cb4672a2

**수정 전 원문** · summary · user-control

- 실제 소스: [src/ui/study-materials.tsx:1501](../../../src/ui/study-materials.tsx#L1501)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'transcript' ∧ truthy: segment.originalText !== undefined
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(result.segments) · 1468행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-7f71a34b21f0

**카드 질문** · Textarea · user-control

- 실제 소스: [src/ui/study-materials.tsx:1518](../../../src/ui/study-materials.tsx#L1518)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card ∧ truthy: editingCard === cardKey && cardKey
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-9e17003e50c9](../handlers/ui__study-materials.md#h-9e17003e50c9) → [updateCard · H-e9e5de6e4920](../handlers/ui__study-materials.md#h-e9e5de6e4920) → [@callback:content.results.map · H-07d55512df34](../handlers/ui__study-materials.md#h-07d55512df34) → [@callback:row.cards.map · H-c842d5497d46](../handlers/ui__study-materials.md#h-c842d5497d46) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) => updateCard({ question: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-1033a9245b69, B-03a4c77472e3, B-4d4fa7767d7e, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-ce5b7d5c2ba7

**카드 답** · Textarea · user-control

- 실제 소스: [src/ui/study-materials.tsx:1523](../../../src/ui/study-materials.tsx#L1523)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card ∧ truthy: editingCard === cardKey && cardKey
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-7623d09519a7](../handlers/ui__study-materials.md#h-7623d09519a7) → [updateCard · H-e9e5de6e4920](../handlers/ui__study-materials.md#h-e9e5de6e4920) → [@callback:content.results.map · H-07d55512df34](../handlers/ui__study-materials.md#h-07d55512df34) → [@callback:row.cards.map · H-c842d5497d46](../handlers/ui__study-materials.md#h-c842d5497d46) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
(event) => updateCard({ answer: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-1033a9245b69, B-03a4c77472e3, B-4d4fa7767d7e, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-5b26efa5140a

**편집 마치기** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:1529](../../../src/ui/study-materials.tsx#L1529)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card ∧ truthy: editingCard === cardKey && cardKey
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-0fff21f5b2b5](../handlers/ui__study-materials.md#h-0fff21f5b2b5)

```tsx
() => setEditingCard('')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-657d018e5e82

**답 보기** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:1539](../../../src/ui/study-materials.tsx#L1539)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card ∧ falsy: editingCard === cardKey && cardKey ∧ falsy: answer === cardKey && cardKey
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-fae69631de64](../handlers/ui__study-materials.md#h-fae69631de64) → [revealCard · H-1af41ce5185f](../handlers/ui__study-materials.md#h-1af41ce5185f) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
() => revealCard()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2e2dcc3b5bbc, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-eb82768c00ab

**UseMaterialCard · 조작/부품 영역** · UseMaterialCard · component-callback-contract

- 실제 소스: [src/ui/study-materials.tsx:1547](../../../src/ui/study-materials.tsx#L1547)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U25](../paths/U25.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card
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

## X-8dbff3100eac

**이전 카드** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:1562](../../../src/ui/study-materials.tsx#L1562)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card
- 실행 차단 disabled: cardIndex === 0
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-8ff292399fd7](../handlers/ui__study-materials.md#h-8ff292399fd7)

```tsx
() => {
                      setCardIndex(cardIndex - 1);
                      setAnswer('');
                      setEditingCard('');
                    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c7ecce8c1a78

**다음 카드** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:1572](../../../src/ui/study-materials.tsx#L1572)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card
- 실행 차단 disabled: cardIndex >= cards.length - 1
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-bbefe39e4d3e](../handlers/ui__study-materials.md#h-bbefe39e4d3e)

```tsx
() => {
                      setCardIndex(cardIndex + 1);
                      setAnswer('');
                      setEditingCard('');
                    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-33e86727deb2

**카드 수정** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:1582](../../../src/ui/study-materials.tsx#L1582)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-14069379d87d](../handlers/ui__study-materials.md#h-14069379d87d) → [revealCard · H-1af41ce5185f](../handlers/ui__study-materials.md#h-1af41ce5185f) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
() => {
                      setEditingCard(cardKey);
                      revealCard();
                    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2e2dcc3b5bbc, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-65e3b9ffa93f

**이 카드 제외** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:1591](../../../src/ui/study-materials.tsx#L1591)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: tab === 'cards' ∧ truthy: card
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d5434cc82d21](../handlers/ui__study-materials.md#h-d5434cc82d21) → [updateCard · H-e9e5de6e4920](../handlers/ui__study-materials.md#h-e9e5de6e4920) → [@callback:content.results.map · H-07d55512df34](../handlers/ui__study-materials.md#h-07d55512df34) → [@callback:row.cards.map · H-c842d5497d46](../handlers/ui__study-materials.md#h-c842d5497d46) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
() => {
                      setEditingCard('');
                      updateCard({ excluded: true });
                      setCardIndex(Math.max(0, Math.min(cardIndex, cards.length - 2)));
                      setAnswer('');
                    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-1033a9245b69, B-03a4c77472e3, B-4d4fa7767d7e, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-bb44ff0258fa

**제외한 카드** · summary · user-control

- 실제 소스: [src/ui/study-materials.tsx:1612](../../../src/ui/study-materials.tsx#L1612)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.cards.some((card) => card.excluded)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-550735463197

**복원** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:1618](../../../src/ui/study-materials.tsx#L1618)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: result ∧ interactive-when-falsy: saving ∧ truthy: result.cards.some((card) => card.excluded)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-00cc5ef51e6b](../handlers/ui__study-materials.md#h-00cc5ef51e6b) → [@callback:content.results.map · H-b5a3838f9aba](../handlers/ui__study-materials.md#h-b5a3838f9aba) → [@callback:row.cards.map · H-c695db49f1a5](../handlers/ui__study-materials.md#h-c695db49f1a5) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
() =>
                        retain({
                          ...content,
                          results: content.results.map((row) =>
                            row.id === result.id
                              ? {
                                  ...row,
                                  cards: row.cards.map((item) =>
                                    item.id === card.id ? { ...item, excluded: false } : item,
                                  ),
                                }
                              : row,
                          ),
                        })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-aec8e4d5ae79, B-813a79a60fc3, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

반복: map(result.cards .filter((card) => card.excluded)) · 1613행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-1c50f6778e05

**MaterialTutor · 조작/부품 영역** · MaterialTutor · component-callback-contract

- 실제 소스: [src/ui/study-materials.tsx:1645](../../../src/ui/study-materials.tsx#L1645)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: truthy: aiAllowed
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onHelp** → [recordHelp · H-fe33c198fd10](../handlers/ui__study-materials.md#h-fe33c198fd10) → [@callback:attempts.map · H-61a8653126ba](../handlers/ui__study-materials.md#h-61a8653126ba) → [@callback:a.questions.map · H-96bea7d52246](../handlers/ui__study-materials.md#h-96bea7d52246) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68)

```tsx
recordHelp
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-14445d895eb9, B-733ded9d7d69, B-f61821519769, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

**onEvidence** → [@onEvidence · H-ceafeb46a1ec](../handlers/ui__study-materials.md#h-ceafeb46a1ec) → [@callback:setTimeout · H-504d2322dbe4](../handlers/ui__study-materials.md#h-504d2322dbe4) → [recordHelp · H-fe33c198fd10](../handlers/ui__study-materials.md#h-fe33c198fd10) → [@callback:attempts.map · H-61a8653126ba](../handlers/ui__study-materials.md#h-61a8653126ba) → [@callback:a.questions.map · H-96bea7d52246](../handlers/ui__study-materials.md#h-96bea7d52246) → [retain · H-f59c4ad6c4c6](../handlers/ui__study-materials.md#h-f59c4ad6c4c6) → [@callback:draftFlight.current.catch · H-0cb38ff92f66](../handlers/ui__study-materials.md#h-0cb38ff92f66) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [@callback:draftFlight.current
      .catch · H-6145f34262e3](../handlers/ui__study-materials.md#h-6145f34262e3) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then · H-7e98746a7ba2](../handlers/ui__study-materials.md#h-7e98746a7ba2) → [@callback:draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then · H-8030f2045a68](../handlers/ui__study-materials.md#h-8030f2045a68) → [@callback:current.current.results.findIndex · H-12bf1ec460af](../handlers/ui__study-materials.md#h-12bf1ec460af)

```tsx
(resultId, id) => {
            const index = current.current.results.findIndex((r) => r.id === resultId);
            if (index >= 0) {
              recordHelp();
              setResultIndex(index);
              setAnswer('');
              setEditingCard('');
              setTab('transcript');
              setTimeout(
                () =>
                  document
                    .getElementById(`material-segment-${id}`)
                    ?.scrollIntoView({ block: 'nearest' }),
                0,
              );
            }
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-786ecc5ae32a, B-14445d895eb9, B-733ded9d7d69, B-f61821519769, B-d7850d55338e, B-10c3d28319d5, B-ea1eede766a0, B-a54bbf7011bb

## X-5461625e5a97

**저장 이력과 보관** · summary · user-control

- 실제 소스: [src/ui/study-materials.tsx:1673](../../../src/ui/study-materials.tsx#L1673)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: selected
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-93e785bbd85e

**자료를 휴지통으로** · Button · user-control

- 실제 소스: [src/ui/study-materials.tsx:1683](../../../src/ui/study-materials.tsx#L1683)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: selected
- 실행 차단 disabled: busy || saving
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-eac814070c90](../handlers/ui__study-materials.md#h-eac814070c90) → [message · H-41261534bb0c](../handlers/ui__study-materials.md#h-41261534bb0c) → [context · H-3a866d502ecc](../handlers/ui__study-materials.md#h-3a866d502ecc)

```tsx
() => {
              try {
                const next = repository.execute({
                  type: 'trashStudyMaterial',
                  id: selected.id,
                  expectedVersion: selected.version,
                  ...context(data),
                });
                onSaved(next);
                navigate('/materials');
              } catch (error) {
                setError(message(error));
              }
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0a4c5e4666b6, B-d803e03b784a, B-ea1eede766a0

