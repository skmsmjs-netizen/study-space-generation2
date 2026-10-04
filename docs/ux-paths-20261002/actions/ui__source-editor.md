# src/ui/source-editor.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-eb1d250f5be4

**소스 코드** · textarea · user-control

- 실제 소스: [src/ui/source-editor.tsx:34](../../../src/ui/source-editor.tsx#L34)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: slot-active: fallback
- 실행 차단 disabled: 명시 없음
- readOnly: props.readOnly; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-2c70314450be](../handlers/ui__source-editor.md#h-2c70314450be)

```tsx
(event) => props.onChange(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

