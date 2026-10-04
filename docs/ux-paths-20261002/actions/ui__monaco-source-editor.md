# src/ui/monaco-source-editor.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-99a887864ef1

**'코드 실행'** · command object · command-definition

- 실제 소스: [src/ui/monaco-source-editor.tsx:125](../../../src/ui/monaco-source-editor.tsx#L125)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**run** → [run · H-bef2ce510c91](../handlers/ui__monaco-source-editor.md#h-bef2ce510c91)

```tsx
() => callbacks.current.onRun()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-813b28519819

**'change'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/monaco-source-editor.tsx:145](../../../src/ui/monaco-source-editor.tsx#L145)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**change** → [applyTheme · H-559a9a38a009](../handlers/ui__monaco-source-editor.md#h-559a9a38a009)

```tsx
applyTheme
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-dc630d6262d8

## X-5f3ebf855de6

**Tab으로 편집기 나가기** · Checkbox · user-control

- 실제 소스: [src/ui/monaco-source-editor.tsx:238](../../../src/ui/monaco-source-editor.tsx#L238)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: truthy: !plainInput
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-e668ccf2bedb](../handlers/ui__monaco-source-editor.md#h-e668ccf2bedb)

```tsx
(event) => {
              setTabMovesFocus(event.target.checked);
              editor.current?.updateOptions({ tabFocusMode: event.target.checked });
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-58712deec52a

**소스 코드** · textarea · user-control

- 실제 소스: [src/ui/monaco-source-editor.tsx:249](../../../src/ui/monaco-source-editor.tsx#L249)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: truthy: plainInput
- 실행 차단 disabled: 명시 없음
- readOnly: readOnly; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-5d467f898c82](../handlers/ui__monaco-source-editor.md#h-5d467f898c82)

```tsx
(event) => onChange(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onKeyDown** → [@onKeyDown · H-a3d69d75aecd](../handlers/ui__monaco-source-editor.md#h-a3d69d75aecd)

```tsx
(event) => {
            if (
              (event.metaKey || event.ctrlKey) &&
              event.key === 'Enter' &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              onRun();
            }
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-af5b85dbcfe7

## X-41d84b34c906

**검사 다시 시도** · Button · user-control

- 실제 소스: [src/ui/monaco-source-editor.tsx:286](../../../src/ui/monaco-source-editor.tsx#L286)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: truthy: syntax === 'unavailable'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a0ecf7e78c9d](../handlers/ui__monaco-source-editor.md#h-a0ecf7e78c9d) → [@callback:setRetry · H-2eabc9fc57cf](../handlers/ui__monaco-source-editor.md#h-2eabc9fc57cf)

```tsx
() => setRetry((value) => value + 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-cc4100e5c948

**{issue.startLineNumber} 행 {issue.startColumn} 열: {issue.message}** · Button · user-control

- 실제 소스: [src/ui/monaco-source-editor.tsx:297](../../../src/ui/monaco-source-editor.tsx#L297)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: truthy: diagnostics.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b4d8f932fa76](../handlers/ui__monaco-source-editor.md#h-b4d8f932fa76) → [@callback:lines
                          .slice(0, issue.startLineNumber - 1)
                          .reduce · H-46e2e3f50b08](../handlers/ui__monaco-source-editor.md#h-46e2e3f50b08)

```tsx
() => {
                    if (plain.current) {
                      const lines = value.split('\n');
                      const start =
                        lines
                          .slice(0, issue.startLineNumber - 1)
                          .reduce((sum, line) => sum + line.length + 1, 0) +
                        issue.startColumn -
                        1;
                      plain.current.focus();
                      plain.current.setSelectionRange(start, start);
                    }
                    const instance = editor.current;
                    instance?.setPosition({
                      lineNumber: issue.startLineNumber,
                      column: issue.startColumn,
                    });
                    instance?.revealLineInCenter(issue.startLineNumber);
                    instance?.focus();
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ac795cfecac1

반복: map(occurrenceRows(diagnostics, issue => JSON.stringify(issue))) · 295행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

