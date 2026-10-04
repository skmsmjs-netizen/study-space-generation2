# src/ui/motion.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-112f03e1805b

**'visibilitychange'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/motion.tsx:19](../../../src/ui/motion.tsx#L19)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R30](../paths/R30.md), [R31](../paths/R31.md), [R32](../paths/R32.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O15](../paths/O15.md), [U01](../paths/U01.md), [U11](../paths/U11.md), [U38](../paths/U38.md), [U40](../paths/U40.md), [U41](../paths/U41.md), [A09](../paths/A09.md)
- 직접 표시 조건: truthy: !stopListening
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**visibilitychange** → [publish · H-1d32215910df](../handlers/ui__motion.md#h-1d32215910df)

```tsx
publish
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

