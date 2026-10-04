# src/ui/workspace-commands.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-793b6d8b8393

**'keydown'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/workspace-commands.tsx:42](../../../src/ui/workspace-commands.tsx#L42)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [A02](../paths/A02.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**keydown** → [shortcut · H-f56f414d26b1](../handlers/ui__workspace-commands.md#h-f56f414d26b1)

```tsx
shortcut
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-967937652b96, B-ce600bb67e46

## X-d9ec2438c52b

**빠른 명령** · Button · user-control

- 실제 소스: [src/ui/workspace-commands.tsx:57](../../../src/ui/workspace-commands.tsx#L57)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [A02](../paths/A02.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [show · H-e99234724acd](../handlers/ui__workspace-commands.md#h-e99234724acd)

```tsx
show
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b38c9f2b8953

**지금 할 일 찾기** · Modal · component-callback-contract

- 실제 소스: [src/ui/workspace-commands.tsx:60](../../../src/ui/workspace-commands.tsx#L60)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [A02](../paths/A02.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-79323df63585](../handlers/ui__workspace-commands.md#h-79323df63585)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1621a6254e69

**명령 찾기** · Input · user-control

- 실제 소스: [src/ui/workspace-commands.tsx:61](../../../src/ui/workspace-commands.tsx#L61)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [A02](../paths/A02.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-33a1b2f662d5](../handlers/ui__workspace-commands.md#h-33a1b2f662d5)

```tsx
(event) => setQuery(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onKeyDown** → [@onKeyDown · H-c899aa467c4e](../handlers/ui__workspace-commands.md#h-c899aa467c4e)

```tsx
(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              results.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
            }
            if (event.key === 'Enter' && visible.length === 1 && !visible[0].disabled) {
              event.preventDefault();
              setOpen(false);
              visible[0].run();
            }
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3450837ba3ad, B-ac5bfeb5fc54, B-fab73c45a625

## X-480c384ff5a0

**ul · 조작/부품 영역** · ul · event-surface

- 실제 소스: [src/ui/workspace-commands.tsx:87](../../../src/ui/workspace-commands.tsx#L87)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [A02](../paths/A02.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onKeyDown** → [@onKeyDown · H-25e64d14b9ca](../handlers/ui__workspace-commands.md#h-25e64d14b9ca)

```tsx
(event) => {
            if (
              !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) ||
              event.nativeEvent.isComposing
            )
              return;
            const buttons = [
              ...(results.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ??
                []),
            ];
            const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
            if (index < 0 || !buttons.length) return;
            event.preventDefault();
            const next =
              event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? buttons.length - 1
                  : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) %
                    buttons.length;
            buttons[next]?.focus();
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7025464ccbd3, B-d4a8731827f9, B-e94a01b6e448, B-e219825e844f, B-c5714c470b6e

## X-c399ed05b96e

**{command.title}** · Button · user-control

- 실제 소스: [src/ui/workspace-commands.tsx:115](../../../src/ui/workspace-commands.tsx#L115)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [A02](../paths/A02.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: !!command.disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c786fc469337](../handlers/ui__workspace-commands.md#h-c786fc469337)

```tsx
() => {
                  setOpen(false);
                  command.run();
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(visible) · 113행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

