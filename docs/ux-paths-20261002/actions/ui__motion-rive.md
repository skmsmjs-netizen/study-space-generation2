# src/ui/motion-rive.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-5905a8c01803

**별 모양의 개수** · SegmentedControl · user-control

- 실제 소스: [src/ui/motion-rive.tsx:18](../../../src/ui/motion-rive.tsx#L18)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O15](../paths/O15.md), [U38](../paths/U38.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → 네이티브/호출자 동작

```tsx
setStars
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-f38afb58aff0

**Rive 공식 예제** · a · user-control

- 실제 소스: [src/ui/motion-rive.tsx:20](../../../src/ui/motion-rive.tsx#L20)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O15](../paths/O15.md), [U38](../paths/U38.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `https://github.com/rive-app/rive-react`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

