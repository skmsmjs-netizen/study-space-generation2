# src/ui/material-sources.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-5c670027ae6a

**전사문 파일 가져오기** · Button · user-control

- 실제 소스: [src/ui/material-sources.tsx:58](../../../src/ui/material-sources.tsx#L58)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ec18a933686c](../handlers/ui__material-sources.md#h-ec18a933686c)

```tsx
() => transcriptInput.current?.click()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-768d0e45b801

**문서·사진·자막 가져오기** · Button · user-control

- 실제 소스: [src/ui/material-sources.tsx:58](../../../src/ui/material-sources.tsx#L58)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b6f8464279ac](../handlers/ui__material-sources.md#h-b6f8464279ac)

```tsx
() => input.current?.click()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-dab2a2564d0e

**가져오기 중단** · Button · user-control

- 실제 소스: [src/ui/material-sources.tsx:58](../../../src/ui/material-sources.tsx#L58)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: truthy: busy
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-7fd713953772](../handlers/ui__material-sources.md#h-7fd713953772)

```tsx
() => controller.current?.abort()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-910c8e9280b9

**클로바노트 전사문 파일** · input · user-control

- 실제 소스: [src/ui/material-sources.tsx:59](../../../src/ui/material-sources.tsx#L59)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-2bdc67048d86](../handlers/ui__material-sources.md#h-2bdc67048d86) → [bring · H-b5b5143a0ac3](../handlers/ui__material-sources.md#h-b5b5143a0ac3) → [@callback:current.current.map · H-ceeda02d3f56](../handlers/ui__material-sources.md#h-ceeda02d3f56) → [@callback:imported.blocks.some · H-aaab2126f965](../handlers/ui__material-sources.md#h-aaab2126f965) → [@callback:imported.blocks.map · H-50f6fa313f5f](../handlers/ui__material-sources.md#h-50f6fa313f5f) → [@callback:current.current.filter · H-7b59a1b5c02f](../handlers/ui__material-sources.md#h-7b59a1b5c02f) → [@callback:documentSegments(current.current.filter(d => d.id !== replace)).reduce · H-8a46cc2b5695](../handlers/ui__material-sources.md#h-8a46cc2b5695) → [@callback:current.current.find · H-ea4197499d9a](../handlers/ui__material-sources.md#h-ea4197499d9a) → [range · H-548f7435af0d](../handlers/ui__material-sources.md#h-548f7435af0d)

```tsx
e => { const files = Array.from(e.target.files ?? []); e.target.value = ''; void bring(files); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-07d8b89c7560, B-84aa4e29e6cd, B-2db542815b30, B-d91ec907ee30, B-3a0e3e4a6bbb, B-693609e07219, B-5378da8068fc, B-be4e5b209cbb, B-4cf9d22dafda, B-5b955e35fbe2, B-834100fef37f, B-33217d514c02, B-3e3b23f1d66e, B-fb3cde129352, B-a731ea79250a, B-507ce5370ba1, B-62c910165469, B-d033a54dcb0e, B-35b1ee3d0c96, B-8551e515b082, B-598501000484, B-8345db43e2c7, B-d49bf8f4355e

## X-6feffd5e3163

**학습 자료 파일** · input · user-control

- 실제 소스: [src/ui/material-sources.tsx:61](../../../src/ui/material-sources.tsx#L61)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-e3012ec32b06](../handlers/ui__material-sources.md#h-e3012ec32b06) → [bring · H-b5b5143a0ac3](../handlers/ui__material-sources.md#h-b5b5143a0ac3) → [@callback:current.current.map · H-ceeda02d3f56](../handlers/ui__material-sources.md#h-ceeda02d3f56) → [@callback:imported.blocks.some · H-aaab2126f965](../handlers/ui__material-sources.md#h-aaab2126f965) → [@callback:imported.blocks.map · H-50f6fa313f5f](../handlers/ui__material-sources.md#h-50f6fa313f5f) → [@callback:current.current.filter · H-7b59a1b5c02f](../handlers/ui__material-sources.md#h-7b59a1b5c02f) → [@callback:documentSegments(current.current.filter(d => d.id !== replace)).reduce · H-8a46cc2b5695](../handlers/ui__material-sources.md#h-8a46cc2b5695) → [@callback:current.current.find · H-ea4197499d9a](../handlers/ui__material-sources.md#h-ea4197499d9a) → [range · H-548f7435af0d](../handlers/ui__material-sources.md#h-548f7435af0d)

```tsx
e => { const files = Array.from(e.target.files ?? []); e.target.value = ''; void bring(files); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-07d8b89c7560, B-84aa4e29e6cd, B-2db542815b30, B-d91ec907ee30, B-3a0e3e4a6bbb, B-693609e07219, B-5378da8068fc, B-be4e5b209cbb, B-4cf9d22dafda, B-5b955e35fbe2, B-834100fef37f, B-33217d514c02, B-3e3b23f1d66e, B-fb3cde129352, B-a731ea79250a, B-507ce5370ba1, B-62c910165469, B-d033a54dcb0e, B-35b1ee3d0c96, B-8551e515b082, B-598501000484, B-8345db43e2c7, B-d49bf8f4355e

## X-af9d0b2033a9

**PDF 쪽 범위 · 선택** · summary · user-control

- 실제 소스: [src/ui/material-sources.tsx:63](../../../src/ui/material-sources.tsx#L63)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-2057bc4f9720

**PDF 시작 쪽** · Input · user-control

- 실제 소스: [src/ui/material-sources.tsx:63](../../../src/ui/material-sources.tsx#L63)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-3165e7af047c](../handlers/ui__material-sources.md#h-3165e7af047c)

```tsx
e => setFirst(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c15887d4cc95

**PDF 마지막 쪽** · Input · user-control

- 실제 소스: [src/ui/material-sources.tsx:63](../../../src/ui/material-sources.tsx#L63)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-707e6f48f8b2](../handlers/ui__material-sources.md#h-707e6f48f8b2)

```tsx
e => setLast(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-23cce07f5763

**{doc.name} · {doc.blocks.length} 개 구간** · summary · user-control

- 실제 소스: [src/ui/material-sources.tsx:65](../../../src/ui/material-sources.tsx#L65)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(documents) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-136d75f48c8a

**원본 영상 열기** · a · user-control

- 실제 소스: [src/ui/material-sources.tsx:66](../../../src/ui/material-sources.tsx#L66)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: truthy: doc.url
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `doc.url`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(documents) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-107887e16a3e

**원본 내려받기** · Button · user-control

- 실제 소스: [src/ui/material-sources.tsx:67](../../../src/ui/material-sources.tsx#L67)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: truthy: doc.file
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3dfa96a82417](../handlers/ui__material-sources.md#h-3dfa96a82417) → [@callback:setTimeout · H-1a9a66c5344b](../handlers/ui__material-sources.md#h-1a9a66c5344b)

```tsx
async () => { try { const blob = await readDocumentFile(owner, doc.file!); if (!blob) throw Error('이 기기에 원본 파일이 없습니다. 같은 파일을 다시 가져와 주세요.'); const href = URL.createObjectURL(blob), link = document.createElement('a'); link.href = href; link.download = doc.file!.name; link.click(); setTimeout(() => URL.revokeObjectURL(href), 1000); } catch (cause) { setError(cause instanceof Error ? cause.message : '파일을 열지 못했습니다.'); } }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f9810f97cb6a, B-868eed297c8b, B-0e3627d68d14, B-ad57052df943

반복: map(documents) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-2579f029fc1f

**파일 다시 읽기** · Button · user-control

- 실제 소스: [src/ui/material-sources.tsx:68](../../../src/ui/material-sources.tsx#L68)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: truthy: doc.file ∧ truthy: !doc.blocks.length
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-81a95409550f](../handlers/ui__material-sources.md#h-81a95409550f) → [bring · H-b5b5143a0ac3](../handlers/ui__material-sources.md#h-b5b5143a0ac3) → [@callback:current.current.map · H-ceeda02d3f56](../handlers/ui__material-sources.md#h-ceeda02d3f56) → [@callback:imported.blocks.some · H-aaab2126f965](../handlers/ui__material-sources.md#h-aaab2126f965) → [@callback:imported.blocks.map · H-50f6fa313f5f](../handlers/ui__material-sources.md#h-50f6fa313f5f) → [@callback:current.current.filter · H-7b59a1b5c02f](../handlers/ui__material-sources.md#h-7b59a1b5c02f) → [@callback:documentSegments(current.current.filter(d => d.id !== replace)).reduce · H-8a46cc2b5695](../handlers/ui__material-sources.md#h-8a46cc2b5695) → [@callback:current.current.find · H-ea4197499d9a](../handlers/ui__material-sources.md#h-ea4197499d9a) → [range · H-548f7435af0d](../handlers/ui__material-sources.md#h-548f7435af0d)

```tsx
async () => { const blob = await readDocumentFile(owner, doc.file!); if (blob) await bring([new File([blob], doc.file!.name, { type: doc.file!.type })], doc.id); else setError('같은 원본 파일을 다시 가져와 주세요.'); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-cbbd113d4c7e, B-07d8b89c7560, B-84aa4e29e6cd, B-2db542815b30, B-d91ec907ee30, B-3a0e3e4a6bbb, B-693609e07219, B-5378da8068fc, B-be4e5b209cbb, B-4cf9d22dafda, B-5b955e35fbe2, B-834100fef37f, B-33217d514c02, B-3e3b23f1d66e, B-fb3cde129352, B-a731ea79250a, B-507ce5370ba1, B-62c910165469, B-d033a54dcb0e, B-35b1ee3d0c96, B-8551e515b082, B-598501000484, B-8345db43e2c7, B-d49bf8f4355e

반복: map(documents) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-8d134a216e4e

**원본 사진 보기** · Button · user-control

- 실제 소스: [src/ui/material-sources.tsx:69](../../../src/ui/material-sources.tsx#L69)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: truthy: doc.kind === 'image' && doc.file
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-cca0f302b978](../handlers/ui__material-sources.md#h-cca0f302b978) → [@callback:setPreviews · H-c0fdb3540093](../handlers/ui__material-sources.md#h-c0fdb3540093)

```tsx
async () => { try { if (previews[doc.id]) return; const blob = await readDocumentFile(owner, doc.file!); if (!blob) throw Error('원본 사진을 다시 가져와 주세요.'); const url = URL.createObjectURL(blob); previewURLs.current.push(url); setPreviews(p => ({...p,[doc.id]:url})); } catch (cause) { setError(cause instanceof Error ? cause.message : '사진을 열지 못했습니다.'); } }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-fd5a6eff82c8, B-9b7dcd253446, B-c7def2cddc6f, B-6c5276695489, B-c045df163874

반복: map(documents) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-fa5985b814cf

**전체 구간 선택** · Button · user-control

- 실제 소스: [src/ui/material-sources.tsx:71](../../../src/ui/material-sources.tsx#L71)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-44837c6d81ed](../handlers/ui__material-sources.md#h-44837c6d81ed) → [@callback:doc.blocks.map · H-ebd0690e9933](../handlers/ui__material-sources.md#h-ebd0690e9933) → [update · H-a97a574266bf](../handlers/ui__material-sources.md#h-a97a574266bf) → [@callback:current.current.map · H-e4238b2127a0](../handlers/ui__material-sources.md#h-e4238b2127a0)

```tsx
() => void update({ ...doc, blocks: doc.blocks.map(b => ({ ...b, included: true })) })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-52d2a07d6669, B-6328484e06ce, B-c63540a686bb, B-9b3c1fc1b3b6

반복: map(documents) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-5214418fafe6

**선택 해제** · Button · user-control

- 실제 소스: [src/ui/material-sources.tsx:71](../../../src/ui/material-sources.tsx#L71)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-9025c9e8eabe](../handlers/ui__material-sources.md#h-9025c9e8eabe) → [@callback:doc.blocks.map · H-4382c591b03d](../handlers/ui__material-sources.md#h-4382c591b03d) → [update · H-a97a574266bf](../handlers/ui__material-sources.md#h-a97a574266bf) → [@callback:current.current.map · H-e4238b2127a0](../handlers/ui__material-sources.md#h-e4238b2127a0)

```tsx
() => void update({ ...doc, blocks: doc.blocks.map(b => ({ ...b, included: false })) })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-52d2a07d6669, B-6328484e06ce, B-c63540a686bb, B-9b3c1fc1b3b6

반복: map(documents) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-eaca0ad0d814

**{b.label} · GPT에 포함 보관만** · summary · user-control

- 실제 소스: [src/ui/material-sources.tsx:72](../../../src/ui/material-sources.tsx#L72)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(doc.blocks) · 72행; map(documents) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-7c6a5f494cad

**`${b.label} GPT에 포함`** · Checkbox · user-control

- 실제 소스: [src/ui/material-sources.tsx:73](../../../src/ui/material-sources.tsx#L73)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ecb2b1c399ba](../handlers/ui__material-sources.md#h-ecb2b1c399ba) → [@callback:doc.blocks.map · H-47244bb4d24e](../handlers/ui__material-sources.md#h-47244bb4d24e) → [update · H-a97a574266bf](../handlers/ui__material-sources.md#h-a97a574266bf) → [@callback:current.current.map · H-e4238b2127a0](../handlers/ui__material-sources.md#h-e4238b2127a0)

```tsx
e => void update({ ...doc, blocks: doc.blocks.map(row => row.id === b.id ? { ...row, included: e.target.checked } : row) })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-264e44b387df, B-52d2a07d6669, B-6328484e06ce, B-c63540a686bb, B-9b3c1fc1b3b6

반복: map(doc.blocks) · 72행; map(documents) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-51ba20391a0a

**`${doc.name} ${b.label} 원문`** · Textarea · user-control

- 실제 소스: [src/ui/material-sources.tsx:74](../../../src/ui/material-sources.tsx#L74)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-3f919c93c92a](../handlers/ui__material-sources.md#h-3f919c93c92a) → [@callback:doc.blocks.map · H-cb33efe90fcb](../handlers/ui__material-sources.md#h-cb33efe90fcb) → [update · H-a97a574266bf](../handlers/ui__material-sources.md#h-a97a574266bf) → [@callback:current.current.map · H-e4238b2127a0](../handlers/ui__material-sources.md#h-e4238b2127a0)

```tsx
e => void update({ ...doc, blocks: doc.blocks.map(row => row.id === b.id ? { ...row, originalText: row.originalText ?? row.text, text: e.target.value } : row) })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6c044707ee3d, B-52d2a07d6669, B-6328484e06ce, B-c63540a686bb, B-9b3c1fc1b3b6

반복: map(doc.blocks) · 72행; map(documents) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-a2da3c5094d1

**처음 읽은 원문** · summary · user-control

- 실제 소스: [src/ui/material-sources.tsx:75](../../../src/ui/material-sources.tsx#L75)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: truthy: b.originalText !== undefined
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(doc.blocks) · 72행; map(documents) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-c660733a2ce2

**처음 원문으로 되돌리기** · Button · user-control

- 실제 소스: [src/ui/material-sources.tsx:75](../../../src/ui/material-sources.tsx#L75)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U23](../paths/U23.md)
- 직접 표시 조건: truthy: b.originalText !== undefined
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f4ac5f766e44](../handlers/ui__material-sources.md#h-f4ac5f766e44) → [@callback:doc.blocks.map · H-fb851f3a68af](../handlers/ui__material-sources.md#h-fb851f3a68af) → [update · H-a97a574266bf](../handlers/ui__material-sources.md#h-a97a574266bf) → [@callback:current.current.map · H-e4238b2127a0](../handlers/ui__material-sources.md#h-e4238b2127a0)

```tsx
() => void update({ ...doc, blocks: doc.blocks.map(row => row.id === b.id ? { ...row, text: row.originalText ?? row.text } : row) })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-68cd7eca6ce2, B-52d2a07d6669, B-6328484e06ce, B-c63540a686bb, B-9b3c1fc1b3b6

반복: map(doc.blocks) · 72행; map(documents) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

