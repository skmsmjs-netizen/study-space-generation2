# src/ui/canvas-transfer.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-52e0bb6e385f

**배치 JSON 내려받기** · Button · user-control

- 실제 소스: [src/ui/canvas-transfer.tsx:40](../../../src/ui/canvas-transfer.tsx#L40)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-58d5788da128](../handlers/ui__canvas-transfer.md#h-58d5788da128) → [download · H-b8ca2091da08](../handlers/ui__canvas-transfer.md#h-b8ca2091da08) → [@callback:setTimeout · H-f38b1d2c3921](../handlers/ui__canvas-transfer.md#h-f38b1d2c3921)

```tsx
() =>
            download(canvasLayoutFile(data, content), 'application/json', 'ManSeekSong-Canvas.json')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-0596c7069e3c

**관계도 SVG 내려받기** · Button · user-control

- 실제 소스: [src/ui/canvas-transfer.tsx:47](../../../src/ui/canvas-transfer.tsx#L47)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ce6697a79747](../handlers/ui__canvas-transfer.md#h-ce6697a79747) → [download · H-b8ca2091da08](../handlers/ui__canvas-transfer.md#h-b8ca2091da08) → [@callback:setTimeout · H-f38b1d2c3921](../handlers/ui__canvas-transfer.md#h-f38b1d2c3921)

```tsx
() =>
            download(
              canvasDiagramSvg(cards, { ...content, links: [...automaticLinks, ...content.links] }),
              'image/svg+xml',
              'ManSeekSong-Canvas.svg',
            )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d923ce01bcaf

**가져올 배치 JSON** · Input · user-control

- 실제 소스: [src/ui/canvas-transfer.tsx:59](../../../src/ui/canvas-transfer.tsx#L59)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-db3de410f385](../handlers/ui__canvas-transfer.md#h-db3de410f385)

```tsx
async (event) => {
          const file = event.target.files?.[0];
          setCandidate(null);
          setError('');
          if (!file) return;
          setBusy(true);
          try {
            if (file.size > 2_000_000) throw Error('2MB 이내의 배치 파일을 선택해 주세요.');
            setCandidate(parseCanvasLayoutFile(await file.text(), data));
          } catch (failure) {
            setError(failure instanceof Error ? failure.message : '배치 파일을 읽지 못했습니다.');
          } finally {
            setBusy(false);
          }
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-0baa3a4b0369, B-b14be287015e, B-c6e48a0ce11d, B-dc7a64cd6160, B-574ba98d7792

## X-71e08a9fe96b

**확인한 배치 적용** · Button · user-control

- 실제 소스: [src/ui/canvas-transfer.tsx:88](../../../src/ui/canvas-transfer.tsx#L88)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: truthy: candidate
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b47af4afefc2](../handlers/ui__canvas-transfer.md#h-b47af4afefc2)

```tsx
() => {
              if (onImport(candidate)) {
                setCandidate(null);
                setError('');
              }
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7773e2fc2786

## X-85fa7280438a

**가져오기 취소** · Button · user-control

- 실제 소스: [src/ui/canvas-transfer.tsx:99](../../../src/ui/canvas-transfer.tsx#L99)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: truthy: candidate
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-0b74e59ec62c](../handlers/ui__canvas-transfer.md#h-0b74e59ec62c)

```tsx
() => setCandidate(null)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

