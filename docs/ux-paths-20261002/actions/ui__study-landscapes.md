# src/ui/study-landscapes.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-8c257a3940df

**'visibilitychange'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/study-landscapes.tsx:146](../../../src/ui/study-landscapes.tsx#L146)
- 연결 표면: [R01](../paths/R01.md), [U11](../paths/U11.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**visibilitychange** → [update · H-59701a0f1c5d](../handlers/ui__study-landscapes.md#h-59701a0f1c5d)

```tsx
update
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c6e9b8292826

## X-5148998279d3

**'pageshow'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/study-landscapes.tsx:147](../../../src/ui/study-landscapes.tsx#L147)
- 연결 표면: [R01](../paths/R01.md), [U11](../paths/U11.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**pageshow** → [update · H-59701a0f1c5d](../handlers/ui__study-landscapes.md#h-59701a0f1c5d)

```tsx
update
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c6e9b8292826

## X-8e1956cd27c6

**'storage'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/study-landscapes.tsx:167](../../../src/ui/study-landscapes.tsx#L167)
- 연결 표면: [R01](../paths/R01.md), [U11](../paths/U11.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**storage** → [update · H-4028674be55b](../handlers/ui__study-landscapes.md#h-4028674be55b) → [readPreferences · H-00f93d329e08](../handlers/ui__study-landscapes.md#h-00f93d329e08) → [defaults · H-3de7338a1857](../handlers/ui__study-landscapes.md#h-3de7338a1857) → [@callback:scenes.map · H-6a3d1611fda7](../handlers/ui__study-landscapes.md#h-6a3d1611fda7) → [@callback:scenes.map · H-2a526e1e42ad](../handlers/ui__study-landscapes.md#h-2a526e1e42ad) → [@callback:scenes.map((scene) => scene.id).filter · H-b956a83eb812](../handlers/ui__study-landscapes.md#h-b956a83eb812)

```tsx
update
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca6241006f5f, B-2374de0902c8, B-992bf44ae25d, B-4db80421113e, B-6275bc20b72e, B-d37b1db861bd

## X-872dd5a6cda2

**!motionEnabled ? '정지된 풍경' : preferences.paused ? '풍경 움직이기' : '풍경 멈추기'** · Button · user-control

- 실제 소스: [src/ui/study-landscapes.tsx:217](../../../src/ui/study-landscapes.tsx#L217)
- 연결 표면: [R01](../paths/R01.md), [U11](../paths/U11.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !motionEnabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-fb44afd40b1e](../handlers/ui__study-landscapes.md#h-fb44afd40b1e) → [change · H-e471c1feacf7](../handlers/ui__study-landscapes.md#h-e471c1feacf7)

```tsx
() => change({ ...preferences, paused: !preferences.paused })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-77ab2fb35609, B-7b6787179a6c

## X-1fb40732b8b8

**풍경 고르기** · summary · user-control

- 실제 소스: [src/ui/study-landscapes.tsx:236](../../../src/ui/study-landscapes.tsx#L236)
- 연결 표면: [R01](../paths/R01.md), [U11](../paths/U11.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7ac6bab6f374

**['별빛', '혜성', '궤도'][index]** · Checkbox · user-control

- 실제 소스: [src/ui/study-landscapes.tsx:248](../../../src/ui/study-landscapes.tsx#L248)
- 연결 표면: [R01](../paths/R01.md), [U11](../paths/U11.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-290dd0f39ba5](../handlers/ui__study-landscapes.md#h-290dd0f39ba5) → [@callback:preferences.visible.filter · H-8229113a7dd6](../handlers/ui__study-landscapes.md#h-8229113a7dd6) → [change · H-e471c1feacf7](../handlers/ui__study-landscapes.md#h-e471c1feacf7)

```tsx
(event) =>
                    change({
                      ...preferences,
                      visible: event.target.checked
                        ? [...preferences.visible, scene.id]
                        : preferences.visible.filter((id) => id !== scene.id),
                    })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ee3acef40bef, B-77ab2fb35609, B-7b6787179a6c

반복: map(scenes) · 247행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-2f389008f071

**기본 풍경으로** · Button · user-control

- 실제 소스: [src/ui/study-landscapes.tsx:262](../../../src/ui/study-landscapes.tsx#L262)
- 연결 표면: [R01](../paths/R01.md), [U11](../paths/U11.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-31b9e7a3214f](../handlers/ui__study-landscapes.md#h-31b9e7a3214f) → [defaults · H-3de7338a1857](../handlers/ui__study-landscapes.md#h-3de7338a1857) → [@callback:scenes.map · H-6a3d1611fda7](../handlers/ui__study-landscapes.md#h-6a3d1611fda7) → [change · H-e471c1feacf7](../handlers/ui__study-landscapes.md#h-e471c1feacf7)

```tsx
() => change(defaults())
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-77ab2fb35609, B-7b6787179a6c

## X-57971ccd8c5f

**설정 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/study-landscapes.tsx:272](../../../src/ui/study-landscapes.tsx#L272)
- 연결 표면: [R01](../paths/R01.md), [U11](../paths/U11.md)
- 직접 표시 조건: truthy: storageError
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a21a4a149216](../handlers/ui__study-landscapes.md#h-a21a4a149216) → [change · H-e471c1feacf7](../handlers/ui__study-landscapes.md#h-e471c1feacf7)

```tsx
() => change(preferences)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-77ab2fb35609, B-7b6787179a6c

