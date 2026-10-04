# src/ui/index.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-9e6581d6629a

**{busy && <BusyDots />} {children}** · button · user-control

- 실제 소스: [src/ui/index.tsx:12](../../../src/ui/index.tsx#L12)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

전달 props 경계: props. 전달 내용은 호출 지점이 담당한다.

## X-219a9d4ebefa

**label** · Button · user-control

- 실제 소스: [src/ui/index.tsx:15](../../../src/ui/index.tsx#L15)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

전달 props 경계: props. 전달 내용은 호출 지점이 담당한다.

## X-b294611b692e

**input · 조작/부품 영역** · input · user-control

- 실제 소스: [src/ui/index.tsx:26](../../../src/ui/index.tsx#L26)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

전달 props 경계: props. 전달 내용은 호출 지점이 담당한다.

## X-78160a39d6be

**textarea · 조작/부품 영역** · textarea · user-control

- 실제 소스: [src/ui/index.tsx:30](../../../src/ui/index.tsx#L30)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

전달 props 경계: props. 전달 내용은 호출 지점이 담당한다.

## X-04837bea3da1

**select · 조작/부품 영역** · select · user-control

- 실제 소스: [src/ui/index.tsx:34](../../../src/ui/index.tsx#L34)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

전달 props 경계: props. 전달 내용은 호출 지점이 담당한다.

## X-ef73d90c197e

**input · 조작/부품 영역** · input · user-control

- 실제 소스: [src/ui/index.tsx:40](../../../src/ui/index.tsx#L40)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

전달 props 경계: props. 전달 내용은 호출 지점이 담당한다.

## X-50b86636c797

**input · 조작/부품 영역** · input · user-control

- 실제 소스: [src/ui/index.tsx:42](../../../src/ui/index.tsx#L42)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

전달 props 경계: props. 전달 내용은 호출 지점이 담당한다.

## X-a6134f14d8c5

**{item.id === value && <SelectionBackground id={motionId} />} {item.label}** · Button · user-control

- 실제 소스: [src/ui/index.tsx:50](../../../src/ui/index.tsx#L50)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: item.disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-36aec22da9ce](../handlers/ui__index.md#h-36aec22da9ce)

```tsx
() => onChange(item.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onKeyDown** → [@onKeyDown · H-b2efdbadce6a](../handlers/ui__index.md#h-b2efdbadce6a) → [@callback:enabled.findIndex · H-0cc25afa2e8a](../handlers/ui__index.md#h-0cc25afa2e8a)

```tsx
event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || !enabled.length) return;
    event.preventDefault();
    const index = enabled.findIndex(entry => entry.id === item.id);
    const next = event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled[enabled.length - 1] : enabled[(index + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length];
    onChange(next.id); buttons.current.get(next.id)?.focus();
  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6f0c3f810e04, B-11f217ba8c1f, B-0789130f8b41, B-974a66b1b6de

반복: map(items) · 50행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-f668800c4e9c

**{item.label}** · Button · user-control

- 실제 소스: [src/ui/index.tsx:60](../../../src/ui/index.tsx#L60)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: item.disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-140a5d82356d](../handlers/ui__index.md#h-140a5d82356d)

```tsx
() => onChange(item.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(items) · 60행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-a63ebe41621c

**'pointerdown'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/index.tsx:81](../../../src/ui/index.tsx#L81)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**pointerdown** → [remember · H-674075af4afb](../handlers/ui__index.md#h-674075af4afb)

```tsx
remember
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d6884e3c8cfc, B-ca3db261fa76

## X-afdfc92897ba

**'pointercancel'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/index.tsx:82](../../../src/ui/index.tsx#L82)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**pointercancel** → [clear · H-a8a6b466460c](../handlers/ui__index.md#h-a8a6b466460c)

```tsx
clear
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9167caca0100

**'keydown'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/index.tsx:83](../../../src/ui/index.tsx#L83)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**keydown** → [clear · H-a8a6b466460c](../handlers/ui__index.md#h-a8a6b466460c)

```tsx
clear
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3e1e6c5fa0a8

**'keydown'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/index.tsx:121](../../../src/ui/index.tsx#L121)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**keydown** → [onKeyDown · H-f0aa49d1d479](../handlers/ui__index.md#h-f0aa49d1d479) → [available · H-ac0ed316d5ec](../handlers/ui__index.md#h-ac0ed316d5ec) → [@callback:[...(dialog.current?.querySelectorAll<HTMLElement>('*') || [])].filter · H-36d33af00864](../handlers/ui__index.md#h-36d33af00864)

```tsx
onKeyDown
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-06bf10784dea, B-378f1d8d2c33, B-2f10c797a924, B-0013838b3090, B-1857130bbaba, B-384239c5a30f, B-161d046e2493

## X-8ee6944af536

**'focusin'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/index.tsx:122](../../../src/ui/index.tsx#L122)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**focusin** → [onFocus · H-e745ed698aa8](../handlers/ui__index.md#h-e745ed698aa8) → [available · H-ac0ed316d5ec](../handlers/ui__index.md#h-ac0ed316d5ec) → [@callback:[...(dialog.current?.querySelectorAll<HTMLElement>('*') || [])].filter · H-36d33af00864](../handlers/ui__index.md#h-36d33af00864)

```tsx
onFocus
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2d896aba1044, B-384239c5a30f, B-161d046e2493

## X-59e6886d2d58

**div · 조작/부품 영역** · div · event-surface

- 실제 소스: [src/ui/index.tsx:148](../../../src/ui/index.tsx#L148)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 · 포인터·공간 조작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onPointerDown** → [@onPointerDown · H-d2e650879e1c](../handlers/ui__index.md#h-d2e650879e1c)

```tsx
event => {
      backdropPress.current = event.target === event.currentTarget && event.button === 0
        ? { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false } : null;
    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-37b24e313a92

**onPointerMove** → [@onPointerMove · H-05540ff665fb](../handlers/ui__index.md#h-05540ff665fb)

```tsx
event => {
      const press = backdropPress.current;
      // Eight CSS pixels is a local tap tolerance, not a universal gesture standard.
      if (press && (event.target !== event.currentTarget || Math.hypot(event.clientX - press.x, event.clientY - press.y) > 8)) press.moved = true;
    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5d1f169f7239

**onPointerUp** → [@onPointerUp · H-474548cc6ce7](../handlers/ui__index.md#h-474548cc6ce7)

```tsx
event => {
      // Touch may implicitly capture the pointer; its event target can remain the
      // backdrop even after the finger has crossed into the dialog.
      const hit = document.elementFromPoint?.(event.clientX, event.clientY);
      if (event.target !== event.currentTarget || (hit && hit !== event.currentTarget) || event.pointerId !== backdropPress.current?.id) backdropPress.current = null;
    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f4a070d43f60

**onPointerCancel** → [@onPointerCancel · H-664a3913dbfc](../handlers/ui__index.md#h-664a3913dbfc)

```tsx
() => { backdropPress.current = null; }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onClick** → [@onClick · H-7d9985b958f7](../handlers/ui__index.md#h-7d9985b958f7)

```tsx
event => {
      const press = backdropPress.current; backdropPress.current = null;
      if (event.target === event.currentTarget && press && !press.moved) onClose();
    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-774f28c712c4

## X-8329fd1fe030

**`${title} 닫기`** · IconButton · user-control

- 실제 소스: [src/ui/index.tsx:168](../../../src/ui/index.tsx#L168)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
onClose
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-89538a9cbd3f

**되돌리기** · Button · user-control

- 실제 소스: [src/ui/index.tsx:172](../../../src/ui/index.tsx#L172)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: truthy: onUndo
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
onUndo
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b23175b6ae27

**알림 닫기** · IconButton · user-control

- 실제 소스: [src/ui/index.tsx:172](../../../src/ui/index.tsx#L172)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: truthy: onClose
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
onClose
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ae469aeed40e

**{item.label}** · a · user-control

- 실제 소스: [src/ui/index.tsx:176](../../../src/ui/index.tsx#L176)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: falsy: index === items.length - 1 ∧ truthy: item.href
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `item.href`. 동적 ID는 현재 항목 값을 사용한다.

**onClick** → 네이티브/호출자 동작

```tsx
item.onClick
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(occurrenceRows(items, item => JSON.stringify([item.href, item.label]))) · 176행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-c996ed632c14

**{item.label}** · button · user-control

- 실제 소스: [src/ui/index.tsx:176](../../../src/ui/index.tsx#L176)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: falsy: index === items.length - 1 ∧ falsy: item.href
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
item.onClick
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(occurrenceRows(items, item => JSON.stringify([item.href, item.label]))) · 176행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-74ecec9b3fac

**(Input · 동적/도형 조작)** · Input · user-control

- 실제 소스: [src/ui/index.tsx:182](../../../src/ui/index.tsx#L182)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-0c259014a6f9](../handlers/ui__index.md#h-0c259014a6f9) → [publish · H-178cc48d77da](../handlers/ui__index.md#h-178cc48d77da)

```tsx
event => { onChange?.(event); if (!composing.current) publish(event.currentTarget.value); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-29848753a3ec, B-8a54e6b673e6

**onCompositionStart** → [@onCompositionStart · H-2b4ac858d0d9](../handlers/ui__index.md#h-2b4ac858d0d9)

```tsx
event => { composing.current = true; onCompositionStart?.(event); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onCompositionEnd** → [@onCompositionEnd · H-716bf47b7c72](../handlers/ui__index.md#h-716bf47b7c72) → [publish · H-178cc48d77da](../handlers/ui__index.md#h-178cc48d77da)

```tsx
event => { composing.current = false; onCompositionEnd?.(event); publish(event.currentTarget.value); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8a54e6b673e6

전달 props 경계: props. 전달 내용은 호출 지점이 담당한다.

## X-931f7b826601

**다시 시도** · Button · user-control

- 실제 소스: [src/ui/index.tsx:189](../../../src/ui/index.tsx#L189)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: truthy: onRetry
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
onRetry
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-69a4978676d7

**이 화면을 열지 못했습니다** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/index.tsx:199](../../../src/ui/index.tsx#L199)
- 연결 표면: [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → 네이티브/호출자 동작

```tsx
this.props.onRetry || (() => window.location.reload())
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

