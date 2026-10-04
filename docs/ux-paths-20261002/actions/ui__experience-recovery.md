# src/ui/experience-recovery.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-f8d08833b97b

**설정 원문·보관본 확인** · Button · user-control

- 실제 소스: [src/ui/experience-recovery.tsx:50](../../../src/ui/experience-recovery.tsx#L50)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O10](../paths/O10.md), [O12](../paths/O12.md), [U09](../paths/U09.md), [U10](../paths/U10.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-db9b14d2c42d](../handlers/ui__experience-recovery.md#h-db9b14d2c42d) → [inspect · H-fa04b7b9fc2e](../handlers/ui__experience-recovery.md#h-fa04b7b9fc2e) → [recoveryError · H-38e0c8b05ca4](../handlers/ui__experience-recovery.md#h-38e0c8b05ca4)

```tsx
() => { setNotice(''); inspect(); setOpen(true); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3360052357c5, B-e437668ca531, B-496e71efc518, B-688dd9d97daa, B-485ff19f0a34

## X-0283928c50af

**이어가기 설정 복구** · Modal · component-callback-contract

- 실제 소스: [src/ui/experience-recovery.tsx:54](../../../src/ui/experience-recovery.tsx#L54)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O12](../paths/O12.md), [U09](../paths/U09.md), [U10](../paths/U10.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-ab424224b121](../handlers/ui__experience-recovery.md#h-ab424224b121)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-76589c102dcb

**(ErrorState · 동적/도형 조작)** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/experience-recovery.tsx:59](../../../src/ui/experience-recovery.tsx#L59)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O12](../paths/O12.md), [U09](../paths/U09.md), [U10](../paths/U10.md)
- 직접 표시 조건: truthy: open ∧ truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → [inspect · H-fa04b7b9fc2e](../handlers/ui__experience-recovery.md#h-fa04b7b9fc2e) → [recoveryError · H-38e0c8b05ca4](../handlers/ui__experience-recovery.md#h-38e0c8b05ca4)

```tsx
inspect
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3360052357c5, B-e437668ca531, B-496e71efc518, B-688dd9d97daa, B-485ff19f0a34

## X-21b570d0e914

**보관본 목록 다시 읽기** · Button · user-control

- 실제 소스: [src/ui/experience-recovery.tsx:61](../../../src/ui/experience-recovery.tsx#L61)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O12](../paths/O12.md), [U09](../paths/U09.md), [U10](../paths/U10.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [inspect · H-fa04b7b9fc2e](../handlers/ui__experience-recovery.md#h-fa04b7b9fc2e) → [recoveryError · H-38e0c8b05ca4](../handlers/ui__experience-recovery.md#h-38e0c8b05ca4)

```tsx
inspect
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3360052357c5, B-e437668ca531, B-496e71efc518, B-688dd9d97daa, B-485ff19f0a34

## X-95d2b42c7e07

**설정 원문 내려받기** · Button · user-control

- 실제 소스: [src/ui/experience-recovery.tsx:62](../../../src/ui/experience-recovery.tsx#L62)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O12](../paths/O12.md), [U09](../paths/U09.md), [U10](../paths/U10.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: !current
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6c14515dceb0](../handlers/ui__experience-recovery.md#h-6c14515dceb0)

```tsx
() => current && downloadText(
            'manseeksong-experience-recovery.json', serializeExperienceRecovery(current), 'application/json',
          )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-bd5770dc12bf

**복구할 설정 보관본** · Select · user-control

- 실제 소스: [src/ui/experience-recovery.tsx:69](../../../src/ui/experience-recovery.tsx#L69)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O12](../paths/O12.md), [U09](../paths/U09.md), [U10](../paths/U10.md)
- 직접 표시 조건: truthy: open ∧ truthy: current ∧ truthy: current.archives.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-c40673c25810](../handlers/ui__experience-recovery.md#h-c40673c25810)

```tsx
event => setSelectedKey(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-8ac8f75cd326

**설정 보관본 더 보기** · Button · user-control

- 실제 소스: [src/ui/experience-recovery.tsx:75](../../../src/ui/experience-recovery.tsx#L75)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O12](../paths/O12.md), [U09](../paths/U09.md), [U10](../paths/U10.md)
- 직접 표시 조건: truthy: open ∧ truthy: current ∧ truthy: current.archives.length > 0 ∧ truthy: current.archives.length > limit
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-9fe79d553127](../handlers/ui__experience-recovery.md#h-9fe79d553127) → [@callback:setLimit · H-bcee9b571274](../handlers/ui__experience-recovery.md#h-bcee9b571274)

```tsx
() => setLimit(value => value + 20)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a065c75424f7

**보관본 원문** · Textarea · user-control

- 실제 소스: [src/ui/experience-recovery.tsx:78](../../../src/ui/experience-recovery.tsx#L78)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O12](../paths/O12.md), [U09](../paths/U09.md), [U10](../paths/U10.md)
- 직접 표시 조건: truthy: open ∧ truthy: current ∧ truthy: current.archives.length > 0 ∧ truthy: selected
- 실행 차단 disabled: 명시 없음
- readOnly: true; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-2255555dadf0

**이 보관본으로 설정 복구** · Button · user-control

- 실제 소스: [src/ui/experience-recovery.tsx:80](../../../src/ui/experience-recovery.tsx#L80)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O12](../paths/O12.md), [U09](../paths/U09.md), [U10](../paths/U10.md)
- 직접 표시 조건: truthy: open ∧ truthy: current ∧ truthy: current.archives.length > 0 ∧ truthy: selected
- 실행 차단 disabled: !selected.usable
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 오류·재시도 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-69e58b1eebd8](../handlers/ui__experience-recovery.md#h-69e58b1eebd8) → [restore · H-bc058d68a639](../handlers/ui__experience-recovery.md#h-bc058d68a639) → [recoveryError · H-38e0c8b05ca4](../handlers/ui__experience-recovery.md#h-38e0c8b05ca4)

```tsx
() => restore('archive')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7bd2149d85da, B-27d9fef31c1b, B-0f0876176228, B-5bc75afdae22, B-73bd92fa051c, B-42bbc42698bd, B-496e71efc518, B-688dd9d97daa, B-485ff19f0a34

## X-8108ae182e6d

**보관본으로 복구할 수 없을 때** · summary · user-control

- 실제 소스: [src/ui/experience-recovery.tsx:84](../../../src/ui/experience-recovery.tsx#L84)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O12](../paths/O12.md), [U09](../paths/U09.md), [U10](../paths/U10.md)
- 직접 표시 조건: truthy: open ∧ truthy: current
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d3d46bb6444e

**원문 보관 후 설정 새로 시작** · Button · user-control

- 실제 소스: [src/ui/experience-recovery.tsx:86](../../../src/ui/experience-recovery.tsx#L86)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O12](../paths/O12.md), [U09](../paths/U09.md), [U10](../paths/U10.md)
- 직접 표시 조건: truthy: open ∧ truthy: current
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 오류·재시도 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3a1dec3bfeb4](../handlers/ui__experience-recovery.md#h-3a1dec3bfeb4) → [restore · H-bc058d68a639](../handlers/ui__experience-recovery.md#h-bc058d68a639) → [recoveryError · H-38e0c8b05ca4](../handlers/ui__experience-recovery.md#h-38e0c8b05ca4)

```tsx
() => restore('restart')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7bd2149d85da, B-27d9fef31c1b, B-0f0876176228, B-5bc75afdae22, B-73bd92fa051c, B-42bbc42698bd, B-496e71efc518, B-688dd9d97daa, B-485ff19f0a34

## X-1164470e2f06

**닫기** · Button · user-control

- 실제 소스: [src/ui/experience-recovery.tsx:89](../../../src/ui/experience-recovery.tsx#L89)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O12](../paths/O12.md), [U09](../paths/U09.md), [U10](../paths/U10.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-1d96b2a3a70b](../handlers/ui__experience-recovery.md#h-1d96b2a3a70b)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

