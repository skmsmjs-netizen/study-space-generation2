# src/ui/draft-archives.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-e093f7d5aa01

**보관본 다시 읽기** · Button · user-control

- 실제 소스: [src/ui/draft-archives.tsx:94](../../../src/ui/draft-archives.tsx#L94)
- 연결 표면: [R35](../paths/R35.md), [R40](../paths/R40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [refresh · H-5a8416acfd79](../handlers/ui__draft-archives.md#h-5a8416acfd79)

```tsx
refresh
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-df8cb120709c

**result.issues.some(issue => issue.stage === 'enumeration') ? '보관본 목록을 끝까지 읽지 못했습니다' : '일부 보관 정보를 확인하지 못했습니다'** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/draft-archives.tsx:96](../../../src/ui/draft-archives.tsx#L96)
- 연결 표면: [R35](../paths/R35.md), [R40](../paths/R40.md)
- 직접 표시 조건: truthy: result.issues.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → [refresh · H-5a8416acfd79](../handlers/ui__draft-archives.md#h-5a8416acfd79)

```tsx
refresh
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d0caa9c89d34

**원문과 식별 정보 확인** · summary · user-control

- 실제 소스: [src/ui/draft-archives.tsx:111](../../../src/ui/draft-archives.tsx#L111)
- 연결 표면: [R35](../paths/R35.md), [R40](../paths/R40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(archives) · 100행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-d0564176ea24

**`보관본 ${index + 1} 원문`** · Textarea · user-control

- 실제 소스: [src/ui/draft-archives.tsx:113](../../../src/ui/draft-archives.tsx#L113)
- 연결 표면: [R35](../paths/R35.md), [R40](../paths/R40.md)
- 직접 표시 조건: falsy: archive.raw === null
- 실행 차단 disabled: 명시 없음
- readOnly: true; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(archives) · 100행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-b5c7432cd77d

**원문 내보내기** · Button · user-control

- 실제 소스: [src/ui/draft-archives.tsx:115](../../../src/ui/draft-archives.tsx#L115)
- 연결 표면: [R35](../paths/R35.md), [R40](../paths/R40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: archive.raw === null
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a57340d0bac4](../handlers/ui__draft-archives.md#h-a57340d0bac4) → [download · H-66b2ad3fe7a0](../handlers/ui__draft-archives.md#h-66b2ad3fe7a0) → [@callback:window.setTimeout · H-c4a28900a763](../handlers/ui__draft-archives.md#h-c4a28900a763)

```tsx
() => download(archive)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-ff10bd60e8f6, B-3dd382e16402, B-564710d68031, B-d2903eecdc7e

반복: map(archives) · 100행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-619b14095775

**내보내기 내용 복사** · Button · user-control

- 실제 소스: [src/ui/draft-archives.tsx:115](../../../src/ui/draft-archives.tsx#L115)
- 연결 표면: [R35](../paths/R35.md), [R40](../paths/R40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: archive.raw === null
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-9f98ed369a78](../handlers/ui__draft-archives.md#h-9f98ed369a78) → [copy · H-7bd4221f4cfb](../handlers/ui__draft-archives.md#h-7bd4221f4cfb)

```tsx
() => void copy(archive)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-9d42f7ccd4ac, B-ecadcf91dc98

반복: map(archives) · 100행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-6de321fbbd31

**현재 대상 확인** · a · user-control

- 실제 소스: [src/ui/draft-archives.tsx:115](../../../src/ui/draft-archives.tsx#L115)
- 연결 표면: [R35](../paths/R35.md), [R40](../paths/R40.md)
- 직접 표시 조건: truthy: target.href
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `target.href`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(archives) · 100행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

