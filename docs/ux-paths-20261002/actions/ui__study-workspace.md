# src/ui/study-workspace.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-d8802480bbf8

**곁 도구 접기 곁 도구 펼치기** · Button · user-control

- 실제 소스: [src/ui/study-workspace.tsx:134](../../../src/ui/study-workspace.tsx#L134)
- 연결 표면: [A01](../paths/A01.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-827acf16bbc7](../handlers/ui__study-workspace.md#h-827acf16bbc7)

```tsx
() => setLayout({ ...layout, open: !layout.open })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-18c634716dad

**곁에 놓을 도구** · Select · user-control

- 실제 소스: [src/ui/study-workspace.tsx:142](../../../src/ui/study-workspace.tsx#L142)
- 연결 표면: [A01](../paths/A01.md)
- 직접 표시 조건: truthy: layout.open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-8124745f8a1c](../handlers/ui__study-workspace.md#h-8124745f8a1c)

```tsx
(event) =>
                setLayout({
                  ...layout,
                  tool: event.target.value as WorkspaceTool,
                  pane: 'tool',
                  focus: 'both',
                })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-0d9b6d50140d

**자료 폭 조절** · input · user-control

- 실제 소스: [src/ui/study-workspace.tsx:162](../../../src/ui/study-workspace.tsx#L162)
- 연결 표면: [A01](../paths/A01.md)
- 직접 표시 조건: truthy: layout.open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-b2ad5e5f9c23](../handlers/ui__study-workspace.md#h-b2ad5e5f9c23)

```tsx
(event) => setLayout({ ...layout, width: Number(event.target.value) })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-17bef57171c8

**작업면 표시** · Select · user-control

- 실제 소스: [src/ui/study-workspace.tsx:171](../../../src/ui/study-workspace.tsx#L171)
- 연결 표면: [A01](../paths/A01.md)
- 직접 표시 조건: truthy: layout.open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-613435aa7d06](../handlers/ui__study-workspace.md#h-613435aa7d06)

```tsx
(event) =>
                setLayout({ ...layout, focus: event.target.value as 'both' | 'source' | 'tool' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-35da9b5bee6b

**기본 폭** · Button · user-control

- 실제 소스: [src/ui/study-workspace.tsx:182](../../../src/ui/study-workspace.tsx#L182)
- 연결 표면: [A01](../paths/A01.md)
- 직접 표시 조건: truthy: layout.open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-52c367fbd390](../handlers/ui__study-workspace.md#h-52c367fbd390)

```tsx
() => setLayout({ ...layout, width: DEFAULT_DESK.width, focus: 'both' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-52b9ba13f1ae

**자료 보기** · Button · user-control

- 실제 소스: [src/ui/study-workspace.tsx:188](../../../src/ui/study-workspace.tsx#L188)
- 연결 표면: [A01](../paths/A01.md)
- 직접 표시 조건: truthy: layout.open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b37d7a8df20e](../handlers/ui__study-workspace.md#h-b37d7a8df20e)

```tsx
() => setLayout({ ...layout, pane: 'source', focus: 'both' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3c2d34f0e855

**도구 보기** · Button · user-control

- 실제 소스: [src/ui/study-workspace.tsx:194](../../../src/ui/study-workspace.tsx#L194)
- 연결 표면: [A01](../paths/A01.md)
- 직접 표시 조건: truthy: layout.open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-7a83122a9c04](../handlers/ui__study-workspace.md#h-7a83122a9c04)

```tsx
() => setLayout({ ...layout, pane: 'tool', focus: 'both' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7c629a65c865

**작업 구성** · Button · user-control

- 실제 소스: [src/ui/study-workspace.tsx:244](../../../src/ui/study-workspace.tsx#L244)
- 연결 표면: [A08](../paths/A08.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-4c053d266aca](../handlers/ui__study-workspace.md#h-4c053d266aca) → [observatoryRouteTitle · H-b95917fcb671](../handlers/ui__observatory-navigation.md#h-b95917fcb671) → [@callback:OBSERVATORY_MENU.find · H-a4f56c794c65](../handlers/ui__observatory-navigation.md#h-a4f56c794c65) → [@callback:data.nodes.find · H-0f7da2d9792e](../handlers/ui__observatory-navigation.md#h-0f7da2d9792e) → [@callback:data.subjects.find · H-31fc4976ce09](../handlers/ui__observatory-navigation.md#h-31fc4976ce09)

```tsx
() => {
          setName(observatoryRouteTitle(data, route));
          setStatus('');
          setOpen(true);
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e3b12b7d8a51, B-fea69f03c7fc, B-80ae561e555d, B-d85b41055874, B-96caeb27d676, B-b41d9af71833

## X-aaa2b44cf56d

**작업 구성 보관함** · Modal · component-callback-contract

- 실제 소스: [src/ui/study-workspace.tsx:253](../../../src/ui/study-workspace.tsx#L253)
- 연결 표면: [A08](../paths/A08.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-3bedf292ab19](../handlers/ui__study-workspace.md#h-3bedf292ab19)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-8371cb0c464c

**작업 이름** · Input · user-control

- 실제 소스: [src/ui/study-workspace.tsx:259](../../../src/ui/study-workspace.tsx#L259)
- 연결 표면: [A08](../paths/A08.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-627099eda9de](../handlers/ui__study-workspace.md#h-627099eda9de)

```tsx
(event) => setName(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-97bd1253a92e

**현재 작업 보관** · Button · user-control

- 실제 소스: [src/ui/study-workspace.tsx:265](../../../src/ui/study-workspace.tsx#L265)
- 연결 표면: [A08](../paths/A08.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: !name.trim()
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-bf5aa69bed8b](../handlers/ui__study-workspace.md#h-bf5aa69bed8b)

```tsx
async () => {
            const saved = {
              id: crypto.randomUUID(),
              name: name.trim(),
              route,
              layout: { ...layout },
              savedAt: new Date().toISOString(),
            };
            const ok = await change({ ...state, saved: [...state.saved, saved] });
            setStatus(
              ok
                ? '작업 구성을 보관했습니다.'
                : '작업 구성을 저장하지 못했습니다. 안내에 따라 다시 시도해 주세요.',
            );
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ed5f611bdbfc

## X-215936a11ff8

**구성 삭제 되돌리기** · Button · user-control

- 실제 소스: [src/ui/study-workspace.tsx:287](../../../src/ui/study-workspace.tsx#L287)
- 연결 표면: [A08](../paths/A08.md)
- 직접 표시 조건: truthy: open ∧ truthy: deleted
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f1e1c619f353](../handlers/ui__study-workspace.md#h-f1e1c619f353)

```tsx
() => {
              change({ ...state, saved: [...state.saved, deleted] });
              setDeleted(null);
              setStatus('작업 구성을 되돌렸습니다.');
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9a2b508faaf8

**새 작업 이름** · Input · user-control

- 실제 소스: [src/ui/study-workspace.tsx:308](../../../src/ui/study-workspace.tsx#L308)
- 연결 표면: [A08](../paths/A08.md)
- 직접 표시 조건: truthy: open ∧ truthy: renaming === item.id
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-bdbe116a4b4f](../handlers/ui__study-workspace.md#h-bdbe116a4b4f)

```tsx
(event) => setNewName(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(state.saved) · 304행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-1470dd030587

**이름 저장** · Button · user-control

- 실제 소스: [src/ui/study-workspace.tsx:314](../../../src/ui/study-workspace.tsx#L314)
- 연결 표면: [A08](../paths/A08.md)
- 직접 표시 조건: truthy: open ∧ truthy: renaming === item.id
- 실행 차단 disabled: !newName.trim()
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-dadd7556ca0c](../handlers/ui__study-workspace.md#h-dadd7556ca0c) → [@callback:state.saved.map · H-a7adbb64bb64](../handlers/ui__study-workspace.md#h-a7adbb64bb64)

```tsx
() => {
                      change({
                        ...state,
                        saved: state.saved.map((s) =>
                          s.id === item.id ? { ...s, name: newName.trim() } : s,
                        ),
                      });
                      setRenaming(null);
                    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e797b7323b4b

반복: map(state.saved) · 304행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-6120dacabe09

**취소** · Button · user-control

- 실제 소스: [src/ui/study-workspace.tsx:328](../../../src/ui/study-workspace.tsx#L328)
- 연결 표면: [A08](../paths/A08.md)
- 직접 표시 조건: truthy: open ∧ truthy: renaming === item.id
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3b37eadddfbe](../handlers/ui__study-workspace.md#h-3b37eadddfbe)

```tsx
() => setRenaming(null)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(state.saved) · 304행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-234a3a98f734

**이 작업 열기** · Button · user-control

- 실제 소스: [src/ui/study-workspace.tsx:337](../../../src/ui/study-workspace.tsx#L337)
- 연결 표면: [A08](../paths/A08.md)
- 직접 표시 조건: truthy: open ∧ truthy: routeAvailable(data, item.route)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2ac5f0a318e3](../handlers/ui__study-workspace.md#h-2ac5f0a318e3)

```tsx
() => {
                    change({
                      ...state,
                      layouts: { ...state.layouts, [item.route]: { ...item.layout } },
                    });
                    setOpen(false);
                    navigate(item.route);
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(state.saved) · 304행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-5a4d75a54789

**휴지통** · a · user-control

- 실제 소스: [src/ui/study-workspace.tsx:352](../../../src/ui/study-workspace.tsx#L352)
- 연결 표면: [A08](../paths/A08.md)
- 직접 표시 조건: truthy: open ∧ falsy: routeAvailable(data, item.route)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/trash`. 동적 ID는 현재 항목 값을 사용한다.

**onClick** → [@onClick · H-5e834607406c](../handlers/ui__study-workspace.md#h-5e834607406c)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(state.saved) · 304행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-6497fe009d89

**이름 바꾸기** · Button · user-control

- 실제 소스: [src/ui/study-workspace.tsx:357](../../../src/ui/study-workspace.tsx#L357)
- 연결 표면: [A08](../paths/A08.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-849fc2572a07](../handlers/ui__study-workspace.md#h-849fc2572a07)

```tsx
() => {
                  setRenaming(item.id);
                  setNewName(item.name);
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(state.saved) · 304행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-48e0f79cc453

**구성 삭제** · Button · user-control

- 실제 소스: [src/ui/study-workspace.tsx:365](../../../src/ui/study-workspace.tsx#L365)
- 연결 표면: [A08](../paths/A08.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e58e4082f433](../handlers/ui__study-workspace.md#h-e58e4082f433) → [@callback:state.saved.filter · H-b8ac44487813](../handlers/ui__study-workspace.md#h-b8ac44487813)

```tsx
() => {
                  setDeleted(item);
                  change({ ...state, saved: state.saved.filter((s) => s.id !== item.id) });
                  setStatus(
                    `“${item.name}” 작업 구성만 삭제했습니다. 원문과 공부 기록은 유지됩니다.`,
                  );
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(state.saved) · 304행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-a272253977d3

**저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/study-workspace.tsx:387](../../../src/ui/study-workspace.tsx#L387)
- 연결 표면: [A08](../paths/A08.md)
- 직접 표시 조건: truthy: controller.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
controller.retry
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9df21f27dc92

**다시 읽기** · Button · user-control

- 실제 소스: [src/ui/study-workspace.tsx:388](../../../src/ui/study-workspace.tsx#L388)
- 연결 표면: [A08](../paths/A08.md)
- 직접 표시 조건: truthy: controller.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
controller.reload
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

