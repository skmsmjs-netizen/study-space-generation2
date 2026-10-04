# src/ui/exam-practice.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-0f4f2d4a834f

**시험 연습** · section · event-surface

- 실제 소스: [src/ui/exam-practice.tsx:166](../../../src/ui/exam-practice.tsx#L166)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCompositionStart** → [@onCompositionStart · H-5d02c81ee089](../handlers/ui__exam-practice.md#h-5d02c81ee089)

```tsx
() => setComposing(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onCompositionEnd** → [@onCompositionEnd · H-571094334bfa](../handlers/ui__exam-practice.md#h-571094334bfa)

```tsx
() => setComposing(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-0c261acf4754

**저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/exam-practice.tsx:175](../../../src/ui/exam-practice.tsx#L175)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: truthy: error ∧ truthy: !blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-83d632104d82](../handlers/ui__exam-practice.md#h-83d632104d82) → [persist · H-2c4f55dbb2e7](../handlers/ui__exam-practice.md#h-2c4f55dbb2e7) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11)

```tsx
() => persist(draft)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-05ab86981bf1, B-b23da1a176db, B-503cebcd4672, B-31feee793de5, B-0ff4540dd2d6

## X-d25c74157948

**사본 보관 후 새 연습 원문 사본 보관** · Button · user-control

- 실제 소스: [src/ui/exam-practice.tsx:177](../../../src/ui/exam-practice.tsx#L177)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: truthy: error ∧ truthy: blocked && boot.key
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c8ed30a604c0](../handlers/ui__exam-practice.md#h-c8ed30a604c0) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11)

```tsx
() => {
                try {
                  preservePracticeDraft(boot.key, Boolean(boot.error));
                  if (boot.error) {
                    raw.current = null;
                    setBlocked(false);
                    setError('');
                  } else
                    setError(
                      '원문 사본을 보관했습니다. 현재 입력도 유지했습니다. 초안 보관본에서 확인해 주세요.',
                    );
                } catch (e) {
                  setError(message(e));
                }
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-44355a7265c6, B-c41a639db61d, B-7dd139f20943, B-0ff4540dd2d6

## X-1f96fb2e6f8d

**초안 보관본** · a · user-control

- 실제 소스: [src/ui/exam-practice.tsx:197](../../../src/ui/exam-practice.tsx#L197)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/draft-archives`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-39056af70497

**이전 메모 열기** · a · user-control

- 실제 소스: [src/ui/exam-practice.tsx:222](../../../src/ui/exam-practice.tsx#L222)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: truthy: draft.previous && draft.phase !== 'saved'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/memos/${encodeURIComponent(draft.previous.memoId)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ec537cee3a1a

**과목과 목차 입력** · a · user-control

- 실제 소스: [src/ui/exam-practice.tsx:230](../../../src/ui/exam-practice.tsx#L230)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: truthy: draft.phase === 'setup' ∧ truthy: !topics.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/subjects`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-497af95cb24e

**form · 제출 경로** · form · form

- 실제 소스: [src/ui/exam-practice.tsx:233](../../../src/ui/exam-practice.tsx#L233)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: truthy: draft.phase === 'setup' ∧ falsy: !topics.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-497af95cb24e
- 소스 의미 후보: 제출 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSubmit** → [@onSubmit · H-f2b9932ab6c6](../handlers/ui__exam-practice.md#h-f2b9932ab6c6) → [start · H-0f8007097feb](../handlers/ui__exam-practice.md#h-0f8007097feb) → [persist · H-2c4f55dbb2e7](../handlers/ui__exam-practice.md#h-2c4f55dbb2e7) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11)

```tsx
(e) => {
                e.preventDefault();
                if (!blocked) start();
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-1329881ca781, B-c1b64585a7f3, B-05ab86981bf1, B-b23da1a176db, B-503cebcd4672, B-31feee793de5, B-0ff4540dd2d6

## X-5770d46a1ffb

**연습할 주제** · Select · user-control

- 실제 소스: [src/ui/exam-practice.tsx:240](../../../src/ui/exam-practice.tsx#L240)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: truthy: draft.phase === 'setup' ∧ falsy: !topics.length
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: X-497af95cb24e
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-fa125a9abe85](../handlers/ui__exam-practice.md#h-fa125a9abe85) → [persist · H-2c4f55dbb2e7](../handlers/ui__exam-practice.md#h-2c4f55dbb2e7) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11)

```tsx
(e) =>
                  persist({
                    ...draft,
                    topicId: e.target.value,
                    previous: e.target.value === draft.topicId ? draft.previous : undefined,
                  })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-a3214338be6a, B-05ab86981bf1, B-b23da1a176db, B-503cebcd4672, B-31feee793de5, B-0ff4540dd2d6

## X-b64c3f34da24

**연습 시간** · Select · user-control

- 실제 소스: [src/ui/exam-practice.tsx:265](../../../src/ui/exam-practice.tsx#L265)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: truthy: draft.phase === 'setup' ∧ falsy: !topics.length
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: X-497af95cb24e
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ab0211b03282](../handlers/ui__exam-practice.md#h-ab0211b03282) → [persist · H-2c4f55dbb2e7](../handlers/ui__exam-practice.md#h-2c4f55dbb2e7) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11)

```tsx
(e) => persist({ ...draft, minutes: Number(e.target.value) })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-05ab86981bf1, B-b23da1a176db, B-503cebcd4672, B-31feee793de5, B-0ff4540dd2d6

## X-863001c45aac

**연습 시작** · Button · user-control

- 실제 소스: [src/ui/exam-practice.tsx:276](../../../src/ui/exam-practice.tsx#L276)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: truthy: draft.phase === 'setup' ∧ falsy: !topics.length
- 실행 차단 disabled: !topic || blocked || composing
- readOnly: 명시 없음; required: 명시 없음; form: X-497af95cb24e
- 소스 의미 후보: 제출 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-form-submit** → 상위 form의 onSubmit에 연결

- 정상 경계: 상위 form의 onSubmit에 연결
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d41e09b8ae7a

**잠시 멈추기 이어서 풀기** · Button · user-control

- 실제 소스: [src/ui/exam-practice.tsx:307](../../../src/ui/exam-practice.tsx#L307)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: falsy: draft.phase === 'setup' ∧ truthy: draft.phase === 'running' || draft.phase === 'paused'
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [persist · H-2c4f55dbb2e7](../handlers/ui__exam-practice.md#h-2c4f55dbb2e7) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11) → [pause · H-e86c52a05e0d](../handlers/ui__exam-practice.md#h-e86c52a05e0d)

```tsx
draft.phase === 'running'
                      ? pause
                      : () => persist({ ...draft, phase: 'running', runningSince: Date.now() })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-05ab86981bf1, B-b23da1a176db, B-503cebcd4672, B-31feee793de5, B-0ff4540dd2d6

## X-f42e2962b835

**연습 마치기** · Button · user-control

- 실제 소스: [src/ui/exam-practice.tsx:317](../../../src/ui/exam-practice.tsx#L317)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: falsy: draft.phase === 'setup' ∧ truthy: draft.phase === 'running' || draft.phase === 'paused'
- 실행 차단 disabled: blocked || composing
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [finish · H-7837096ed0bc](../handlers/ui__exam-practice.md#h-7837096ed0bc) → [persist · H-2c4f55dbb2e7](../handlers/ui__exam-practice.md#h-2c4f55dbb2e7) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11)

```tsx
finish
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-05ab86981bf1, B-b23da1a176db, B-503cebcd4672, B-31feee793de5, B-0ff4540dd2d6

## X-4b6e6e968358

**앱에 풀이 쓰기 · 선택** · summary · user-control

- 실제 소스: [src/ui/exam-practice.tsx:322](../../../src/ui/exam-practice.tsx#L322)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: falsy: draft.phase === 'setup' ∧ truthy: draft.phase === 'running' || draft.phase === 'paused'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-de015ddc7f57

**풀이·답안** · Textarea · user-control

- 실제 소스: [src/ui/exam-practice.tsx:323](../../../src/ui/exam-practice.tsx#L323)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: falsy: draft.phase === 'setup' ∧ truthy: draft.phase === 'running' || draft.phase === 'paused'
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-513711db63e9](../handlers/ui__exam-practice.md#h-513711db63e9) → [persist · H-2c4f55dbb2e7](../handlers/ui__exam-practice.md#h-2c4f55dbb2e7) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11)

```tsx
(e) => persist({ ...draft, answer: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-05ab86981bf1, B-b23da1a176db, B-503cebcd4672, B-31feee793de5, B-0ff4540dd2d6

## X-39db3f466b73

**내 풀이 보기·고치기** · summary · user-control

- 실제 소스: [src/ui/exam-practice.tsx:338](../../../src/ui/exam-practice.tsx#L338)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' || draft.phase === 'paused' ∧ truthy: draft.phase === 'review' ∧ truthy: draft.answer
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-679f90b57f33

**풀이·답안** · Textarea · user-control

- 실제 소스: [src/ui/exam-practice.tsx:339](../../../src/ui/exam-practice.tsx#L339)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' || draft.phase === 'paused' ∧ truthy: draft.phase === 'review' ∧ truthy: draft.answer
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-758786eadae2](../handlers/ui__exam-practice.md#h-758786eadae2) → [persist · H-2c4f55dbb2e7](../handlers/ui__exam-practice.md#h-2c4f55dbb2e7) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11)

```tsx
(e) => persist({ ...draft, answer: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-05ab86981bf1, B-b23da1a176db, B-503cebcd4672, B-31feee793de5, B-0ff4540dd2d6

## X-5f0a54ad237e

**막힌 곳** · Textarea · user-control

- 실제 소스: [src/ui/exam-practice.tsx:348](../../../src/ui/exam-practice.tsx#L348)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' || draft.phase === 'paused' ∧ truthy: draft.phase === 'review'
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-02defa603394](../handlers/ui__exam-practice.md#h-02defa603394) → [persist · H-2c4f55dbb2e7](../handlers/ui__exam-practice.md#h-2c4f55dbb2e7) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11)

```tsx
(e) => persist({ ...draft, reflection: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-05ab86981bf1, B-b23da1a176db, B-503cebcd4672, B-31feee793de5, B-0ff4540dd2d6

## X-1009bbad9cac

**다음에 해 볼 것** · Textarea · user-control

- 실제 소스: [src/ui/exam-practice.tsx:357](../../../src/ui/exam-practice.tsx#L357)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' || draft.phase === 'paused' ∧ truthy: draft.phase === 'review'
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-9feb59f8d707](../handlers/ui__exam-practice.md#h-9feb59f8d707) → [persist · H-2c4f55dbb2e7](../handlers/ui__exam-practice.md#h-2c4f55dbb2e7) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11)

```tsx
(e) => persist({ ...draft, nextStep: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-05ab86981bf1, B-b23da1a176db, B-503cebcd4672, B-31feee793de5, B-0ff4540dd2d6

## X-3b85a5b3e30a

**연습 기록 남기기** · Button · user-control

- 실제 소스: [src/ui/exam-practice.tsx:373](../../../src/ui/exam-practice.tsx#L373)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' || draft.phase === 'paused' ∧ truthy: draft.phase === 'review'
- 실행 차단 disabled: !ready || blocked || composing
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-bd0c448624f6](../handlers/ui__exam-practice.md#h-bd0c448624f6) → [save · H-c102dcc23b8a](../handlers/ui__exam-practice.md#h-c102dcc23b8a) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11) → [persist · H-2c4f55dbb2e7](../handlers/ui__exam-practice.md#h-2c4f55dbb2e7)

```tsx
() => save()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2f1872450be8, B-c76cc07e7086, B-365338ed6d7c, B-20df07999a4b, B-dfb51f488fd4, B-0ff4540dd2d6, B-05ab86981bf1, B-b23da1a176db, B-503cebcd4672, B-31feee793de5

## X-de32e9f93ac7

**돌아가서 더 풀기** · Button · user-control

- 실제 소스: [src/ui/exam-practice.tsx:380](../../../src/ui/exam-practice.tsx#L380)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' || draft.phase === 'paused' ∧ truthy: draft.phase === 'review'
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-0594bde5f556](../handlers/ui__exam-practice.md#h-0594bde5f556) → [persist · H-2c4f55dbb2e7](../handlers/ui__exam-practice.md#h-2c4f55dbb2e7) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11)

```tsx
() => persist({ ...draft, phase: 'paused', endedAt: null })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-05ab86981bf1, B-b23da1a176db, B-503cebcd4672, B-31feee793de5, B-0ff4540dd2d6

## X-961b3610f1fc

**별도 메모로 남기기** · Button · user-control

- 실제 소스: [src/ui/exam-practice.tsx:387](../../../src/ui/exam-practice.tsx#L387)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' || draft.phase === 'paused' ∧ truthy: draft.phase === 'review' ∧ truthy: repository.getSnapshot().memos?.some((m) => m.id === draft.id)
- 실행 차단 disabled: !ready || blocked || composing
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-51d8433e7e8c](../handlers/ui__exam-practice.md#h-51d8433e7e8c) → [save · H-c102dcc23b8a](../handlers/ui__exam-practice.md#h-c102dcc23b8a) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11) → [persist · H-2c4f55dbb2e7](../handlers/ui__exam-practice.md#h-2c4f55dbb2e7)

```tsx
() => save(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2f1872450be8, B-c76cc07e7086, B-365338ed6d7c, B-20df07999a4b, B-dfb51f488fd4, B-0ff4540dd2d6, B-05ab86981bf1, B-b23da1a176db, B-503cebcd4672, B-31feee793de5

## X-593513439fee

**남긴 메모 보기** · a · user-control

- 실제 소스: [src/ui/exam-practice.tsx:397](../../../src/ui/exam-practice.tsx#L397)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' || draft.phase === 'paused' ∧ falsy: draft.phase === 'review'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/memos/${encodeURIComponent(draft.id)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-59f6440f77f5

**PerformanceFromSource · 조작/부품 영역** · PerformanceFromSource · component-callback-contract

- 실제 소스: [src/ui/exam-practice.tsx:398](../../../src/ui/exam-practice.tsx#L398)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md), [O20](../paths/O20.md), [U20](../paths/U20.md)
- 직접 표시 조건: falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' || draft.phase === 'paused' ∧ falsy: draft.phase === 'review' ∧ truthy: data.memos?.some(m => m.id === draft.id && !m.deletedAt && m.ownerId)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
onSaved
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b73cb2ddc0bb

**새 연습** · Button · user-control

- 실제 소스: [src/ui/exam-practice.tsx:399](../../../src/ui/exam-practice.tsx#L399)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' || draft.phase === 'paused' ∧ falsy: draft.phase === 'review'
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [restart · H-5f8e1305c612](../handlers/ui__exam-practice.md#h-5f8e1305c612) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11)

```tsx
restart
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d136b66ca3b4, B-7e1943238a92, B-0ff4540dd2d6

## X-a24249b90f15

**지난 연습 {history.length} 개** · summary · user-control

- 실제 소스: [src/ui/exam-practice.tsx:409](../../../src/ui/exam-practice.tsx#L409)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: truthy: history.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e076d1bdd699

**{memo.body.split('\n')[0] || '연습 메모'}** · a · user-control

- 실제 소스: [src/ui/exam-practice.tsx:413](../../../src/ui/exam-practice.tsx#L413)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: truthy: history.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/memos/${encodeURIComponent(memo.id)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(history) · 411행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-fbf66a3a4084

**같은 주제로 다시 연습** · Button · user-control

- 실제 소스: [src/ui/exam-practice.tsx:417](../../../src/ui/exam-practice.tsx#L417)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: truthy: history.length > 0
- 실행 차단 disabled: blocked ||
                    composing ||
                    !['setup', 'saved'].includes(draft.phase) ||
                    !topics.some((row) => row.id === memo.ownerId)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-09e2dfc5f530](../handlers/ui__exam-practice.md#h-09e2dfc5f530) → [repeat · H-ece1a7469925](../handlers/ui__exam-practice.md#h-ece1a7469925) → [message · H-3f4fde0d7a11](../handlers/ui__exam-practice.md#h-3f4fde0d7a11) → [persist · H-2c4f55dbb2e7](../handlers/ui__exam-practice.md#h-2c4f55dbb2e7)

```tsx
() => repeat(memo)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-07c1a2185a07, B-c1bbc410072a, B-dce8fcd7616d, B-b607163f20a0, B-0ff4540dd2d6, B-05ab86981bf1, B-b23da1a176db, B-503cebcd4672, B-31feee793de5

반복: map(history) · 411행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-f9d60f3ce8ff

**PerformanceFromSource · 조작/부품 영역** · PerformanceFromSource · component-callback-contract

- 실제 소스: [src/ui/exam-practice.tsx:429](../../../src/ui/exam-practice.tsx#L429)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md), [O20](../paths/O20.md), [U20](../paths/U20.md)
- 직접 표시 조건: truthy: history.length > 0 ∧ truthy: memo.ownerId
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
onSaved
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(history) · 411행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

