# src/ui/progressive-history.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-1fa39c50fd8d

**{label} 더 보기** · Button · user-control

- 실제 소스: [src/ui/progressive-history.tsx:54](../../../src/ui/progressive-history.tsx#L54)
- 연결 표면: [R14](../paths/R14.md), [R20](../paths/R20.md), [R29](../paths/R29.md), [A06](../paths/A06.md)
- 직접 표시 조건: truthy: shown < total
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c51cb6d65c58](../handlers/ui__progressive-history.md#h-c51cb6d65c58) → [expand · H-4c0127979e0e](../handlers/ui__progressive-history.md#h-4c0127979e0e)

```tsx
() => expand(Math.min(total, shown + 40))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-129134755355

**{label} 모두 펼치기** · Button · user-control

- 실제 소스: [src/ui/progressive-history.tsx:55](../../../src/ui/progressive-history.tsx#L55)
- 연결 표면: [R14](../paths/R14.md), [R20](../paths/R20.md), [R29](../paths/R29.md), [A06](../paths/A06.md)
- 직접 표시 조건: truthy: shown < total
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f5aa5ccceb8b](../handlers/ui__progressive-history.md#h-f5aa5ccceb8b) → [expand · H-4c0127979e0e](../handlers/ui__progressive-history.md#h-4c0127979e0e)

```tsx
() => expand(total)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-56fa52f645db

**details · 조작/부품 영역** · details · event-surface

- 실제 소스: [src/ui/progressive-history.tsx:69](../../../src/ui/progressive-history.tsx#L69)
- 연결 표면: [R14](../paths/R14.md), [R20](../paths/R20.md), [R29](../paths/R29.md), [A06](../paths/A06.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onToggle** → [@onToggle · H-d7c1d0f471b8](../handlers/ui__progressive-history.md#h-d7c1d0f471b8)

```tsx
(event) => {
        const next = event.currentTarget.open;
        if (next !== open) {
          if (next) measure.current = beginUiMeasure('history-render');
          setOpen(next);
        }
      }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-432f43f807a1, B-dc3d1e2292f5

## X-b2a137ba1781

**{label} {total} 개** · summary · user-control

- 실제 소스: [src/ui/progressive-history.tsx:80](../../../src/ui/progressive-history.tsx#L80)
- 연결 표면: [R14](../paths/R14.md), [R20](../paths/R20.md), [R29](../paths/R29.md), [A06](../paths/A06.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

