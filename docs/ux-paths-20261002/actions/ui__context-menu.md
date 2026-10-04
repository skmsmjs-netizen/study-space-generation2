# src/ui/context-menu.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-299e85980c3a

**'resize'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/context-menu.tsx:34](../../../src/ui/context-menu.tsx#L34)
- 연결 표면: [U16](../paths/U16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**resize** → [position · H-40bf339e44cf](../handlers/ui__context-menu.md#h-40bf339e44cf)

```tsx
position
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e377f47c52db, B-d03bb56b3bf5

## X-8ab8d3240683

**'scroll'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/context-menu.tsx:35](../../../src/ui/context-menu.tsx#L35)
- 연결 표면: [U16](../paths/U16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**scroll** → [position · H-40bf339e44cf](../handlers/ui__context-menu.md#h-40bf339e44cf)

```tsx
position
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e377f47c52db, B-d03bb56b3bf5

## X-2d298e972481

**'pointerdown'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/context-menu.tsx:44](../../../src/ui/context-menu.tsx#L44)
- 연결 표면: [U16](../paths/U16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**pointerdown** → [pointer · H-ddb8923c420a](../handlers/ui__context-menu.md#h-ddb8923c420a) → [outside · H-ddb8492cf8da](../handlers/ui__context-menu.md#h-ddb8492cf8da)

```tsx
pointer
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-dd87da9301eb

## X-c22d982d1d22

**'focusin'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/context-menu.tsx:45](../../../src/ui/context-menu.tsx#L45)
- 연결 표면: [U16](../paths/U16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**focusin** → [focus · H-84d8efb1ebda](../handlers/ui__context-menu.md#h-84d8efb1ebda) → [outside · H-ddb8492cf8da](../handlers/ui__context-menu.md#h-ddb8492cf8da)

```tsx
focus
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-03a96b128ba2

## X-ef18d67c12b2

**`${targetLabel}: ${label}`** · button · user-control

- 실제 소스: [src/ui/context-menu.tsx:50](../../../src/ui/context-menu.tsx#L50)
- 연결 표면: [U16](../paths/U16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3dca434ca575](../handlers/ui__context-menu.md#h-3dca434ca575)

```tsx
() => { if (open) close(); else { initialFocus.current = 'first'; setOpen(true); } }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ed37b446760c

**onKeyDown** → [@onKeyDown · H-3d5ca00679e3](../handlers/ui__context-menu.md#h-3d5ca00679e3)

```tsx
event => {
        if (event.nativeEvent.isComposing || !['ArrowDown', 'ArrowUp'].includes(event.key)) return;
        event.preventDefault(); initialFocus.current = event.key === 'ArrowUp' ? 'last' : 'first'; setOpen(true);
      }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8391ccfeecff, B-ed83e1f17534

## X-908eb4dbeae0

**`${targetLabel}: ${label}`** · div · event-surface

- 실제 소스: [src/ui/context-menu.tsx:57](../../../src/ui/context-menu.tsx#L57)
- 연결 표면: [U16](../paths/U16.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onKeyDown** → [@onKeyDown · H-030b1a299016](../handlers/ui__context-menu.md#h-030b1a299016)

```tsx
event => {
        if (event.nativeEvent.isComposing) return;
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; }
        if (event.key === 'Tab') { close(); return; }
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const buttons = enabled();
        if (!buttons.length) return;
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
        buttons[next].focus();
      }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4defa7c6def2, B-eeafea77bb33, B-11cc6d743b3a, B-9e3eb937943d, B-ea70ea767b84, B-2e44a4519730, B-79a391a1548b, B-ce7a55fd84fb

## X-a409d3e70d8d

**{item.label}** · button · user-control

- 실제 소스: [src/ui/context-menu.tsx:71](../../../src/ui/context-menu.tsx#L71)
- 연결 표면: [U16](../paths/U16.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: item.disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ff114bd3be2e](../handlers/ui__context-menu.md#h-ff114bd3be2e)

```tsx
() => { close(); item.onSelect(); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(items) · 71행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

