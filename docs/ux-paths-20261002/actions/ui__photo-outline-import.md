# src/ui/photo-outline-import.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-c50aec56d812

**사진으로 목차·내용 가져오기 · 이어가기** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:438](../../../src/ui/photo-outline-import.tsx#L438)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O19](../paths/O19.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e65df9bbda1d](../handlers/ui__photo-outline-import.md#h-e65df9bbda1d)

```tsx
() => setOpen(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1d3767636c84

**사진으로 목차·내용 가져오기** · Modal · component-callback-contract

- 실제 소스: [src/ui/photo-outline-import.tsx:442](../../../src/ui/photo-outline-import.tsx#L442)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-b352215fcdb5](../handlers/ui__photo-outline-import.md#h-b352215fcdb5)

```tsx
() => {
            cancel.current?.abort();
            setOpen(false);
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-580a3ae15e7e

**사진 찍기** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:457](../../../src/ui/photo-outline-import.tsx#L457)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open
- 실행 차단 disabled: locked || !!draft.original
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3f11de7d000e](../handlers/ui__photo-outline-import.md#h-3f11de7d000e)

```tsx
() => camera.current?.click()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-f4834def5c3a

**사진 선택** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:460](../../../src/ui/photo-outline-import.tsx#L460)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open
- 실행 차단 disabled: locked || !!draft.original
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d8697690c366](../handlers/ui__photo-outline-import.md#h-d8697690c366)

```tsx
() => gallery.current?.click()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-35cb61761092

**분석 중단** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:467](../../../src/ui/photo-outline-import.tsx#L467)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: busy && cancel.current
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d7c1aac0e2d4](../handlers/ui__photo-outline-import.md#h-d7c1aac0e2d4)

```tsx
() => cancel.current?.abort()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-10b7489933ef

**초안 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:469](../../../src/ui/photo-outline-import.tsx#L469)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: !ready
- 실행 차단 disabled: busy || !!boot.error
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-83bbebc4d2f6](../handlers/ui__photo-outline-import.md#h-83bbebc4d2f6) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
() => {
                  setError('');
                  persist(current.current);
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c24628c6a7ec, B-7f73d4838cf5

## X-48590c27a830

**목차 촬영 사진** · input · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:479](../../../src/ui/photo-outline-import.tsx#L479)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-609293c61e23](../handlers/ui__photo-outline-import.md#h-609293c61e23) → [bring · H-cdeb5111400c](../handlers/ui__photo-outline-import.md#h-cdeb5111400c) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0) → [@callback:next.photos.some · H-113c432e3ca3](../handlers/ui__photo-outline-import.md#h-113c432e3ca3)

```tsx
(e) => {
                const files = Array.from(e.target.files ?? []);
                e.target.value = '';
                void bring(files);
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-9ce449ecb91a, B-1f5638d18585, B-ad71c106da06, B-25e7b0914eb4, B-908afcaf7c99, B-86679b5ae578, B-3d0f4d77fae1, B-d08613058d13, B-88cad43df699, B-ed3019b29510, B-22325b66e8cd, B-7718665ce4c9, B-c24628c6a7ec, B-7f73d4838cf5

## X-195f01d2b71f

**목차 사진 파일** · input · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:492](../../../src/ui/photo-outline-import.tsx#L492)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-fc746a9e7049](../handlers/ui__photo-outline-import.md#h-fc746a9e7049) → [bring · H-cdeb5111400c](../handlers/ui__photo-outline-import.md#h-cdeb5111400c) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0) → [@callback:next.photos.some · H-113c432e3ca3](../handlers/ui__photo-outline-import.md#h-113c432e3ca3)

```tsx
(e) => {
                const files = Array.from(e.target.files ?? []);
                e.target.value = '';
                void bring(files);
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-9ce449ecb91a, B-1f5638d18585, B-ad71c106da06, B-25e7b0914eb4, B-908afcaf7c99, B-86679b5ae578, B-3d0f4d77fae1, B-d08613058d13, B-88cad43df699, B-ed3019b29510, B-22325b66e8cd, B-7718665ce4c9, B-c24628c6a7ec, B-7f73d4838cf5

## X-d747a5565e2b

**사진 앞으로** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:513](../../../src/ui/photo-outline-import.tsx#L513)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open
- 실행 차단 disabled: locked || !!draft.original || i === 0
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e3493a67582c](../handlers/ui__photo-outline-import.md#h-e3493a67582c) → [@callback:edit · H-5b885601bb6e](../handlers/ui__photo-outline-import.md#h-5b885601bb6e) → [edit · H-2da19ebdc90a](../handlers/ui__photo-outline-import.md#h-2da19ebdc90a) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
() =>
                        edit((d) => {
                          [d.photos[i - 1], d.photos[i]] = [d.photos[i], d.photos[i - 1]];
                        })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-545030e62dec, B-c24628c6a7ec, B-7f73d4838cf5

반복: map(draft.photos) · 506행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-ea0e275303d8

**사진 뒤로** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:523](../../../src/ui/photo-outline-import.tsx#L523)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open
- 실행 차단 disabled: locked || !!draft.original || i === draft.photos.length - 1
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-bfce04cef8ff](../handlers/ui__photo-outline-import.md#h-bfce04cef8ff) → [@callback:edit · H-be8bf43564fb](../handlers/ui__photo-outline-import.md#h-be8bf43564fb) → [edit · H-2da19ebdc90a](../handlers/ui__photo-outline-import.md#h-2da19ebdc90a) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
() =>
                        edit((d) => {
                          [d.photos[i], d.photos[i + 1]] = [d.photos[i + 1], d.photos[i]];
                        })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-545030e62dec, B-c24628c6a7ec, B-7f73d4838cf5

반복: map(draft.photos) · 506행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-1eec072fb470

**사진 제외** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:533](../../../src/ui/photo-outline-import.tsx#L533)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open
- 실행 차단 disabled: locked || !!draft.original
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f376be5f4633](../handlers/ui__photo-outline-import.md#h-f376be5f4633) → [@callback:edit · H-73e3901d9bf6](../handlers/ui__photo-outline-import.md#h-73e3901d9bf6) → [@callback:d.photos.filter · H-18051cfc28e8](../handlers/ui__photo-outline-import.md#h-18051cfc28e8) → [edit · H-2da19ebdc90a](../handlers/ui__photo-outline-import.md#h-2da19ebdc90a) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
() =>
                        edit((d) => {
                          d.photos = d.photos.filter((r) => r.id !== p.id);
                        })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-545030e62dec, B-c24628c6a7ec, B-7f73d4838cf5

반복: map(draft.photos) · 506행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-be3bab7eb3be

**등록할 과목** · Select · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:548](../../../src/ui/photo-outline-import.tsx#L548)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-3599991d246c](../handlers/ui__photo-outline-import.md#h-3599991d246c) → [@callback:edit · H-15b65784e4e0](../handlers/ui__photo-outline-import.md#h-15b65784e4e0) → [edit · H-2da19ebdc90a](../handlers/ui__photo-outline-import.md#h-2da19ebdc90a) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
(e) =>
                  edit((d) => {
                    d.subjectId = e.target.value;
                    d.parentId = null;
                  })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-545030e62dec, B-c24628c6a7ec, B-7f73d4838cf5

## X-0dc13924a9cc

**등록할 위치** · Select · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:568](../../../src/ui/photo-outline-import.tsx#L568)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-eeb29d840705](../handlers/ui__photo-outline-import.md#h-eeb29d840705) → [@callback:edit · H-b57677bbabd2](../handlers/ui__photo-outline-import.md#h-b57677bbabd2) → [edit · H-2da19ebdc90a](../handlers/ui__photo-outline-import.md#h-2da19ebdc90a) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
(e) =>
                  edit((d) => {
                    d.parentId = e.target.value || null;
                  })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-545030e62dec, B-c24628c6a7ec, B-7f73d4838cf5

## X-9931e0b09eed

**사진 분석 다시 요청 GPT로 사진 목차·내용 만들기** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:600](../../../src/ui/photo-outline-import.tsx#L600)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: !draft.original
- 실행 차단 disabled: locked || !ready || !draft.photos.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-7e8a898c86de](../handlers/ui__photo-outline-import.md#h-7e8a898c86de) → [generate · H-746dd9a352de](../handlers/ui__photo-outline-import.md#h-746dd9a352de) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
() => void generate()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-5baee46acaf1, B-9a4e092e7a02, B-d2a555fcb2b9, B-f14218859b18, B-2a9d68888721, B-c0477b7ecd31, B-e9625ab7955b, B-641c6cbea01f, B-850a3673dd0d, B-b0f060dbc53d, B-d460b35c12bc, B-c24628c6a7ec, B-7f73d4838cf5

## X-f03f0b199358

**사진 자료 제목** · Input · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:620](../../../src/ui/photo-outline-import.tsx#L620)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f85f135da808](../handlers/ui__photo-outline-import.md#h-f85f135da808) → [@callback:edit · H-34a159c67dcc](../handlers/ui__photo-outline-import.md#h-34a159c67dcc) → [edit · H-2da19ebdc90a](../handlers/ui__photo-outline-import.md#h-2da19ebdc90a) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
(e) =>
                    edit((d) => {
                      d.title = e.target.value;
                    })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-545030e62dec, B-c24628c6a7ec, B-7f73d4838cf5

## X-4cd2614353bd

**항목 추가** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:649](../../../src/ui/photo-outline-import.tsx#L649)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original
- 실행 차단 disabled: locked || draft.rows.length >= MAX_PHOTO_ROWS
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d0b3df2244ed](../handlers/ui__photo-outline-import.md#h-d0b3df2244ed) → [@callback:edit · H-f48010761e23](../handlers/ui__photo-outline-import.md#h-f48010761e23) → [@callback:d.photos.map · H-06f6bc94ca29](../handlers/ui__photo-outline-import.md#h-06f6bc94ca29) → [edit · H-2da19ebdc90a](../handlers/ui__photo-outline-import.md#h-2da19ebdc90a) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
() =>
                      edit((d) => {
                        d.rows.push({
                          id: crypto.randomUUID(),
                          parentId: null,
                          name: '새 항목',
                          content: '',
                          page: '',
                          photoIds: d.photos.map((p) => p.id),
                          uncertain: true,
                        });
                      })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-545030e62dec, B-c24628c6a7ec, B-7f73d4838cf5

## X-e000284f60e2

**자료 제목을 상위 목차로 추가** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:667](../../../src/ui/photo-outline-import.tsx#L667)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original
- 실행 차단 disabled: locked ||
                      draft.rows.length >= MAX_PHOTO_ROWS ||
                      !draft.title.trim() ||
                      draft.rows.some((r) => r.name === draft.title.trim())
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5b8bbc3433cb](../handlers/ui__photo-outline-import.md#h-5b8bbc3433cb) → [@callback:edit · H-4456f69b7c23](../handlers/ui__photo-outline-import.md#h-4456f69b7c23) → [@callback:d.photos.map · H-ad3d3b0b9ce1](../handlers/ui__photo-outline-import.md#h-ad3d3b0b9ce1) → [edit · H-2da19ebdc90a](../handlers/ui__photo-outline-import.md#h-2da19ebdc90a) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
() =>
                      edit((d) => {
                        const id = crypto.randomUUID();
                        for (const r of d.rows) if (r.parentId === null) r.parentId = id;
                        d.rows.unshift({
                          id,
                          parentId: null,
                          name: d.title.trim().slice(0, 180),
                          content: '',
                          page: '',
                          photoIds: d.photos.map((p) => p.id),
                          uncertain: true,
                        });
                      })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-55eca04ff8cb, B-545030e62dec, B-c24628c6a7ec, B-7f73d4838cf5

## X-27ee07fbe1db

**{i + 1} . {r.name} · 확인 필요 · 제외** · summary · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:697](../../../src/ui/photo-outline-import.tsx#L697)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(draft.rows) · 693행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-7d0917d25a2e

**`${i + 1}번 항목 등록`** · Checkbox · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:702](../../../src/ui/photo-outline-import.tsx#L702)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-7ddda90c351b](../handlers/ui__photo-outline-import.md#h-7ddda90c351b) → [@callback:edit · H-b20686054784](../handlers/ui__photo-outline-import.md#h-b20686054784) → [@callback:d.excluded.filter · H-48c55ada77d9](../handlers/ui__photo-outline-import.md#h-48c55ada77d9) → [@callback:d.rows.find · H-79865ac0669b](../handlers/ui__photo-outline-import.md#h-79865ac0669b) → [descendants · H-0beea2d264a8](../handlers/ui__photo-outline-import.md#h-0beea2d264a8) → [edit · H-2da19ebdc90a](../handlers/ui__photo-outline-import.md#h-2da19ebdc90a) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
(e) =>
                          edit((d) => {
                            const ids = descendants(r.id);
                            if (!e.target.checked)
                              d.excluded = [...new Set([...d.excluded, ...ids])];
                            else {
                              const ancestors = new Set([r.id]);
                              let parent = r.parentId;
                              while (parent) {
                                ancestors.add(parent);
                                parent = d.rows.find((n) => n.id === parent)?.parentId ?? null;
                              }
                              d.excluded = d.excluded.filter((id) => !ancestors.has(id));
                            }
                          })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ea85d668780d, B-d677a189fbce, B-545030e62dec, B-c24628c6a7ec, B-7f73d4838cf5

반복: map(draft.rows) · 693행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-151500d1fe7c

**`${i + 1}번 항목 이름`** · Input · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:723](../../../src/ui/photo-outline-import.tsx#L723)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-1e01fb501b16](../handlers/ui__photo-outline-import.md#h-1e01fb501b16) → [@callback:edit · H-842d157e01cc](../handlers/ui__photo-outline-import.md#h-842d157e01cc) → [edit · H-2da19ebdc90a](../handlers/ui__photo-outline-import.md#h-2da19ebdc90a) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
(e) =>
                          edit((d) => {
                            d.rows[i].name = e.target.value;
                          })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-545030e62dec, B-c24628c6a7ec, B-7f73d4838cf5

반복: map(draft.rows) · 693행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-1362d4be7359

**`${i + 1}번 상위 항목`** · Select · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:734](../../../src/ui/photo-outline-import.tsx#L734)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-7a603ce2c076](../handlers/ui__photo-outline-import.md#h-7a603ce2c076) → [@callback:edit · H-72c0bca22f9a](../handlers/ui__photo-outline-import.md#h-72c0bca22f9a) → [edit · H-2da19ebdc90a](../handlers/ui__photo-outline-import.md#h-2da19ebdc90a) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
(e) =>
                          edit((d) => {
                            d.rows[i].parentId = e.target.value || null;
                          })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-545030e62dec, B-c24628c6a7ec, B-7f73d4838cf5

반복: map(draft.rows) · 693행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-08ec946b34a1

**`${i + 1}번 하위 내용`** · Textarea · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:753](../../../src/ui/photo-outline-import.tsx#L753)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ac864d8961ca](../handlers/ui__photo-outline-import.md#h-ac864d8961ca) → [@callback:edit · H-4a5c27075931](../handlers/ui__photo-outline-import.md#h-4a5c27075931) → [edit · H-2da19ebdc90a](../handlers/ui__photo-outline-import.md#h-2da19ebdc90a) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
(e) =>
                          edit((d) => {
                            d.rows[i].content = e.target.value;
                          })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-545030e62dec, B-c24628c6a7ec, B-7f73d4838cf5

반복: map(draft.rows) · 693행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-5ef1b2c5f07f

**항목 앞으로** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:772](../../../src/ui/photo-outline-import.tsx#L772)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original
- 실행 차단 disabled: locked || i === 0
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-23e54cbd4994](../handlers/ui__photo-outline-import.md#h-23e54cbd4994) → [@callback:edit · H-1ca5711ae2f3](../handlers/ui__photo-outline-import.md#h-1ca5711ae2f3) → [edit · H-2da19ebdc90a](../handlers/ui__photo-outline-import.md#h-2da19ebdc90a) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
() =>
                            edit((d) => {
                              [d.rows[i - 1], d.rows[i]] = [d.rows[i], d.rows[i - 1]];
                            })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-545030e62dec, B-c24628c6a7ec, B-7f73d4838cf5

반복: map(draft.rows) · 693행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-23127b7ed56e

**항목 뒤로** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:782](../../../src/ui/photo-outline-import.tsx#L782)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original
- 실행 차단 disabled: locked || i === draft.rows.length - 1
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-514aa5ebf0fd](../handlers/ui__photo-outline-import.md#h-514aa5ebf0fd) → [@callback:edit · H-f087f658c383](../handlers/ui__photo-outline-import.md#h-f087f658c383) → [edit · H-2da19ebdc90a](../handlers/ui__photo-outline-import.md#h-2da19ebdc90a) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
() =>
                            edit((d) => {
                              [d.rows[i], d.rows[i + 1]] = [d.rows[i + 1], d.rows[i]];
                            })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-545030e62dec, B-c24628c6a7ec, B-7f73d4838cf5

반복: map(draft.rows) · 693행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-6122f2e2683b

**`${i + 1}번 같은 이름 처리`** · Select · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:794](../../../src/ui/photo-outline-import.tsx#L794)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: !draft.registered && p?.candidates.length
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4153ddb757c8](../handlers/ui__photo-outline-import.md#h-4153ddb757c8) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0) → [descendants · H-0beea2d264a8](../handlers/ui__photo-outline-import.md#h-0beea2d264a8)

```tsx
(e) => {
                            const next = structuredClone(current.current);
                            const related = descendants(r.id);
                            for (const id of related) delete next.choices[id];
                            next.choices[r.id] = e.target.value;
                            persist(next);
                          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c24628c6a7ec, B-7f73d4838cf5, B-d677a189fbce

반복: map(draft.rows) · 693행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-efc52a8a8a57

**GPT가 처음 만든 초안 보기** · summary · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:819](../../../src/ui/photo-outline-import.tsx#L819)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-bb9269c439b1

**등록 저장 다시 시도 확인한 목차·내용 등록** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:826](../../../src/ui/photo-outline-import.tsx#L826)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: !draft.registered
- 실행 차단 disabled: busy ||
                      !ready ||
                      !!boot.error ||
                      !draft.title.trim() ||
                      (!draft.pending && !plan?.ready)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-00fdec0878ca](../handlers/ui__photo-outline-import.md#h-00fdec0878ca) → [register · H-e8236493b92c](../handlers/ui__photo-outline-import.md#h-e8236493b92c) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0) → [@callback:saved.revisions.find · H-f3378a38300f](../handlers/ui__photo-outline-import.md#h-f3378a38300f) → [@callback:included.filter · H-7899ba8886c9](../handlers/ui__photo-outline-import.md#h-7899ba8886c9) → [@callback:included.filter((r) => r.content.trim()).map · H-16bae9f1ae36](../handlers/ui__photo-outline-import.md#h-16bae9f1ae36) → [@callback:plan!.entries.filter · H-2f8007f23fe0](../handlers/ui__photo-outline-import.md#h-2f8007f23fe0) → [@callback:plan!.entries.filter((p) => p.status === 'new').map · H-1a1411a8bf0a](../handlers/ui__photo-outline-import.md#h-1a1411a8bf0a)

```tsx
() => void register()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-35306c74ae56, B-27d7489334bf, B-7e857edc6fd3, B-ded2efd110e2, B-83f53f7a7c8f, B-7f174d99ef04, B-154af3147da5, B-c3627c6f80f4, B-1e44f8244e27, B-c24628c6a7ec, B-7f73d4838cf5

## X-5fb5eae73073

**등록 요청 해제·다시 확인** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:841](../../../src/ui/photo-outline-import.tsx#L841)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: draft.pending && !data.appliedOps[draft.pending.opId]
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b0377a7bbae6](../handlers/ui__photo-outline-import.md#h-b0377a7bbae6) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
() => {
                      persist({ ...current.current, pending: undefined });
                      setMessage('등록 요청을 해제했습니다. 현재 목차와 다시 대조해 주세요.');
                    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c24628c6a7ec, B-7f73d4838cf5

## X-69fc067e2b71

**보관한 사진 자료 열기 저장한 사진 자료 열기** · a · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:853](../../../src/ui/photo-outline-import.tsx#L853)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: draft.registered
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `draft.registered.undone
                          ? '#/materials/trash'
                          : `#/materials/${draft.registered.materialId}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c1de1a701669

**이번 등록을 되돌렸습니다 {draft.registered.undo ? '되돌리기 저장 다시 시도' : '이번 등록 되돌리기'}** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:862](../../../src/ui/photo-outline-import.tsx#L862)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original ∧ truthy: draft.registered
- 실행 차단 disabled: busy || !!draft.registered.undone
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d72b31d14292](../handlers/ui__photo-outline-import.md#h-d72b31d14292) → [undo · H-67763a37f4db](../handlers/ui__photo-outline-import.md#h-67763a37f4db) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
() => void undo()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-065fdf877da2, B-b4befc0aa795, B-fcea5be74acc, B-3e07aa370e22, B-116bb0404ef2, B-c1d88a87eb17, B-2f22213ab8e0, B-d739a42c51d9, B-23cf7f31b1c0, B-c24628c6a7ec, B-7f73d4838cf5

## X-724d52f022a0

**새 사진 묶음** · Button · user-control

- 실제 소스: [src/ui/photo-outline-import.tsx:874](../../../src/ui/photo-outline-import.tsx#L874)
- 연결 표면: [R04](../paths/R04.md), [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [O22](../paths/O22.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: open ∧ truthy: open ∧ truthy: draft.original
- 실행 차단 disabled: busy ||
                    !!draft.pending ||
                    (!!draft.registered?.undo && !draft.registered.undone) ||
                    !ready
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-57425f3fc2b4](../handlers/ui__photo-outline-import.md#h-57425f3fc2b4) → [persist · H-651466be8d69](../handlers/ui__photo-outline-import.md#h-651466be8d69) → [photoDraftKey · H-d4d0847ccea0](../handlers/ui__photo-outline-import.md#h-d4d0847ccea0)

```tsx
() => {
                    try {
                      storeDraftSafely(
                        `${photoDraftKey(data)}:history:${draft.original!.id}`,
                        JSON.stringify(draft),
                      );
                      persist({
                        version: 1,
                        photos: [],
                        subjectId: draft.subjectId,
                        parentId: null,
                        title: '사진에서 가져온 목차·내용',
                        original: null,
                        rows: [],
                        excluded: [],
                        choices: {},
                      });
                      setMessage('기존 사진 묶음을 보관했습니다. 새 사진을 선택해 주세요.');
                    } catch {
                      setError('이전 초안을 보관하지 못해 새 묶음을 시작하지 않았습니다.');
                    }
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e4ed7761dafd, B-6c908e360435, B-c24628c6a7ec, B-7f73d4838cf5

