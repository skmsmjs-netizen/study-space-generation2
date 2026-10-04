# src/ui/code-syntax-status.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-0487681e3931

**검사 다시 시도** · Button · user-control

- 실제 소스: [src/ui/code-syntax-status.tsx:88](../../../src/ui/code-syntax-status.tsx#L88)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: truthy: status === 'unavailable'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
retry
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b226ae316df9

**{issue.startLineNumber} 행 {issue.startColumn} 열: {issue.message}** · Button · user-control

- 실제 소스: [src/ui/code-syntax-status.tsx:99](../../../src/ui/code-syntax-status.tsx#L99)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: truthy: diagnostics.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3b632d00ae7f](../handlers/ui__code-syntax-status.md#h-3b632d00ae7f)

```tsx
() => goTo(issue)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(occurrenceRows(diagnostics, issue => JSON.stringify(issue))) · 97행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

