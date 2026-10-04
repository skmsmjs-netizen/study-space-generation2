# src/ui/math-geogebra.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-f70f82a91804

**'change'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/math-geogebra.tsx:124](../../../src/ui/math-geogebra.tsx#L124)
- 연결 표면: [R09](../paths/R09.md), [U31](../paths/U31.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**change** → [changed · H-134a153b34ec](../handlers/ui__math-geogebra.md#h-134a153b34ec) → [@callback:setTheme · H-377d04f32e0a](../handlers/ui__math-geogebra.md#h-377d04f32e0a)

```tsx
changed
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-cf65828deda6

**'visibilitychange'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/math-geogebra.tsx:301](../../../src/ui/math-geogebra.tsx#L301)
- 연결 표면: [R09](../paths/R09.md), [U31](../paths/U31.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**visibilitychange** → [flush · H-9115b21ffe56](../handlers/ui__math-geogebra.md#h-9115b21ffe56) → [persist · H-4b1a05412928](../handlers/ui__math-geogebra.md#h-4b1a05412928) → [capture · H-4950c608b92b](../handlers/ui__math-geogebra.md#h-4950c608b92b)

```tsx
flush
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f3ee506283e3, B-89f0f09b687d, B-9b048209db54, B-cb2ba325d6d5

## X-db3449ac011d

**그래프 다시 열기** · Button · user-control

- 실제 소스: [src/ui/math-geogebra.tsx:597](../../../src/ui/math-geogebra.tsx#L597)
- 연결 표면: [R09](../paths/R09.md), [U31](../paths/U31.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-98ea100f25e3](../handlers/ui__math-geogebra.md#h-98ea100f25e3) → [@callback:setRetry · H-bee440db0d98](../handlers/ui__math-geogebra.md#h-bee440db0d98)

```tsx
() => setRetry((value) => value + 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e2f34eb46897

**다른 그래프로 보기** · Button · user-control

- 실제 소스: [src/ui/math-geogebra.tsx:598](../../../src/ui/math-geogebra.tsx#L598)
- 연결 표면: [R09](../paths/R09.md), [U31](../paths/U31.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
onFallback
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b28696a22759

**GeoGebra 그래프** · section · event-surface

- 실제 소스: [src/ui/math-geogebra.tsx:602](../../../src/ui/math-geogebra.tsx#L602)
- 연결 표면: [R09](../paths/R09.md), [U31](../paths/U31.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onFocusCapture** → [@onFocusCapture · H-1af37326b3e0](../handlers/ui__math-geogebra.md#h-1af37326b3e0)

```tsx
(event) => {
          const control = event.target;
          if (
            !(control instanceof HTMLInputElement) ||
            !control.matches('.slider.accessibilityControl')
          )
            return;
          const label =
            control.max === '360' ? '시점 회전' : control.min === '-90' ? '시점 기울기' : null;
          if (label) {
            control.setAttribute('aria-label', label);
            control.title = label;
          }
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-088a9ddc8efe, B-f05cbc197e71, B-ae0fc7599eb4, B-9169bcebf828

## X-56f6d071fa76

**Made with GeoGebra®** · a · user-control

- 실제 소스: [src/ui/math-geogebra.tsx:621](../../../src/ui/math-geogebra.tsx#L621)
- 연결 표면: [R09](../paths/R09.md), [U31](../paths/U31.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `https://www.geogebra.org/license`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

