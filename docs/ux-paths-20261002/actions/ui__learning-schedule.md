# src/ui/learning-schedule.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-2efd8c9b6524

**'study-space:open-schedule'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/learning-schedule.tsx:29](../../../src/ui/learning-schedule.tsx#L29)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**study-space:open-schedule** → [openSchedule · H-03b32041babd](../handlers/ui__learning-schedule.md#h-03b32041babd)

```tsx
openSchedule
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-eb4e1641ec4b

## X-b638fcc23b05

**일정·선행 관계·추천 근거** · summary · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:55](../../../src/ui/learning-schedule.tsx#L55)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-91909207dfe0

**ScheduleDashboard · 조작/부품 영역** · ScheduleDashboard · component-callback-contract

- 실제 소스: [src/ui/learning-schedule.tsx:58](../../../src/ui/learning-schedule.tsx#L58)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCheck** → [@onCheck · H-cfc7917ab91a](../handlers/ui__learning-schedule.md#h-cfc7917ab91a) → [change · H-0123681ad960](../handlers/ui__learning-schedule.md#h-0123681ad960)

```tsx
subjectId=>change({...workspace,scheduleChecks:[...(workspace.scheduleChecks??[]),{id:crypto.randomUUID(),subjectId,at:new Date().toISOString()}]})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-76a39e658c34, B-43597a6f1860, B-eca69623788b, B-f065b345a881, B-df6544218c9c

## X-bef0f19ac67c

**SemesterWeeksEditor · 조작/부품 영역** · SemesterWeeksEditor · component-callback-contract

- 실제 소스: [src/ui/learning-schedule.tsx:59](../../../src/ui/learning-schedule.tsx#L59)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [O25](../paths/O25.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [change · H-0123681ad960](../handlers/ui__learning-schedule.md#h-0123681ad960)

```tsx
change
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-76a39e658c34, B-43597a6f1860, B-eca69623788b, B-f065b345a881, B-df6544218c9c

## X-a31977049cee

**먼저 공부할 관계와 자료 여부** · summary · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:60](../../../src/ui/learning-schedule.tsx#L60)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c4d94c5f87d2

**관계를 남길 주제** · Select · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:61](../../../src/ui/learning-schedule.tsx#L61)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-9b0b5e89803f](../handlers/ui__learning-schedule.md#h-9b0b5e89803f)

```tsx
e=>setCondition(workspace.conditions?.find(c=>c.targetId===e.target.value)??{targetId:e.target.value,prerequisiteIds:[],materialAvailable:null})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-507fba047cc9

**`먼저 확인할 주제: ${n.name}`** · Checkbox · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:62](../../../src/ui/learning-schedule.tsx#L62)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-854ef23c3174](../handlers/ui__learning-schedule.md#h-854ef23c3174) → [@callback:setCondition · H-1c2c08e6f412](../handlers/ui__learning-schedule.md#h-1c2c08e6f412) → [@callback:c.prerequisiteIds.filter · H-0cd2146c287c](../handlers/ui__learning-schedule.md#h-0cd2146c287c)

```tsx
e=>setCondition(c=>({...c,prerequisiteIds:e.target.checked?[...c.prerequisiteIds,n.id]:c.prerequisiteIds.filter(id=>id!==n.id)}))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5d3a2d10fc20

반복: map(nodes.filter(n=>n.id!==condition.targetId&&n.subjectId===nodes.find(n=>n.id===condition.targetId)?.subjectId)) · 62행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-83d416295d6a

**공부 자료 이용 가능 여부** · Select · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:63](../../../src/ui/learning-schedule.tsx#L63)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f4cb6c5678e0](../handlers/ui__learning-schedule.md#h-f4cb6c5678e0) → [@callback:setCondition · H-7d048a57c16f](../handlers/ui__learning-schedule.md#h-7d048a57c16f)

```tsx
e=>setCondition(c=>({...c,materialAvailable:e.target.value==='unknown'?null:e.target.value==='yes'}))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0cafab56a3ef

## X-f95ace43396f

**선행 관계 저장** · Button · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:64](../../../src/ui/learning-schedule.tsx#L64)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: !condition.targetId
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-7774e5c32d0f](../handlers/ui__learning-schedule.md#h-7774e5c32d0f) → [@callback:(workspace.conditions??[]).filter · H-e2ce10ed8217](../handlers/ui__learning-schedule.md#h-e2ce10ed8217) → [change · H-0123681ad960](../handlers/ui__learning-schedule.md#h-0123681ad960)

```tsx
()=>change({...workspace,conditions:[...(workspace.conditions??[]).filter(c=>c.targetId!==condition.targetId),condition]})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-76a39e658c34, B-43597a6f1860, B-eca69623788b, B-f065b345a881, B-df6544218c9c

## X-8f56d91688ec

**방법별 비교와 개인화 · 선택** · summary · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:66](../../../src/ui/learning-schedule.tsx#L66)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-6378f70d7321

**비교할 확인 기준** · Select · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:67](../../../src/ui/learning-schedule.tsx#L67)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-03e601a1de2d](../handlers/ui__learning-schedule.md#h-03e601a1de2d) → [@callback:setPair · H-90ce1371eea4](../handlers/ui__learning-schedule.md#h-90ce1371eea4)

```tsx
e=>setPair(p=>({...p,goalId:e.target.value}))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5658e79e84ef

**비교할 공부 방법** · Input · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:68](../../../src/ui/learning-schedule.tsx#L68)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f07bf89a794a](../handlers/ui__learning-schedule.md#h-f07bf89a794a) → [@callback:setPair · H-7f67037da117](../handlers/ui__learning-schedule.md#h-7f67037da117)

```tsx
e=>setPair(p=>({...p,action:e.target.value}))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-0abec3b7d0ab

**이전 점수 · 0–1** · Input · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:68](../../../src/ui/learning-schedule.tsx#L68)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-0c7387167f2e](../handlers/ui__learning-schedule.md#h-0c7387167f2e) → [@callback:setPair · H-eb619fb3a75a](../handlers/ui__learning-schedule.md#h-eb619fb3a75a)

```tsx
e=>setPair(p=>({...p,before:e.target.value}))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-165b92bf9b88

**결과 확인 날짜** · Input · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:68](../../../src/ui/learning-schedule.tsx#L68)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-b8bee684790e](../handlers/ui__learning-schedule.md#h-b8bee684790e) → [@callback:setPair · H-9d84fe83b154](../handlers/ui__learning-schedule.md#h-9d84fe83b154)

```tsx
e=>setPair(p=>({...p,date:e.target.value}))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-88e728aaa613

**비교 기준과 조건 · 선택** · Textarea · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:68](../../../src/ui/learning-schedule.tsx#L68)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-d7dab6198ca7](../handlers/ui__learning-schedule.md#h-d7dab6198ca7) → [@callback:setPair · H-348e94f7e13f](../handlers/ui__learning-schedule.md#h-348e94f7e13f)

```tsx
e=>setPair(p=>({...p,note:e.target.value}))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9c1c708b341c

**비교 계획 먼저 저장** · Button · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:68](../../../src/ui/learning-schedule.tsx#L68)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [registerPair · H-e3fb7091711c](../handlers/ui__learning-schedule.md#h-e3fb7091711c) → [change · H-0123681ad960](../handlers/ui__learning-schedule.md#h-0123681ad960) → [@callback:workspace.goals.find · H-5a6c4d01ae4b](../handlers/ui__learning-schedule.md#h-5a6c4d01ae4b)

```tsx
registerPair
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-9bac8ffff462, B-7c0699a06b58, B-76a39e658c34, B-43597a6f1860, B-eca69623788b, B-f065b345a881, B-df6544218c9c

## X-26ca8ff3e93d

**독립 채점 결과를 확인했어요** · Checkbox · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:73](../../../src/ui/learning-schedule.tsx#L73)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-534a5177d6ba](../handlers/ui__learning-schedule.md#h-534a5177d6ba) → [pairUpdate · H-be473ae2f6ec](../handlers/ui__learning-schedule.md#h-be473ae2f6ec) → [@callback:(workspace.comparisons??[]).map · H-e5ba83e3ac57](../handlers/ui__learning-schedule.md#h-e5ba83e3ac57) → [change · H-0123681ad960](../handlers/ui__learning-schedule.md#h-0123681ad960)

```tsx
e=>pairUpdate(p,'independent',e.target.checked)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3fe31c8aa3e0, B-76a39e658c34, B-43597a6f1860, B-eca69623788b, B-f065b345a881, B-df6544218c9c

반복: map((workspace.comparisons??[]).filter(p=>nodes.some(n=>n.id===p.targetId))) · 69행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-3f071530259f

**같은 확인 기준으로 채점했어요** · Checkbox · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:73](../../../src/ui/learning-schedule.tsx#L73)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-cdd5ecbf5984](../handlers/ui__learning-schedule.md#h-cdd5ecbf5984) → [pairUpdate · H-be473ae2f6ec](../handlers/ui__learning-schedule.md#h-be473ae2f6ec) → [@callback:(workspace.comparisons??[]).map · H-e5ba83e3ac57](../handlers/ui__learning-schedule.md#h-e5ba83e3ac57) → [change · H-0123681ad960](../handlers/ui__learning-schedule.md#h-0123681ad960)

```tsx
e=>pairUpdate(p,'rubricMatched',e.target.checked)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3fe31c8aa3e0, B-76a39e658c34, B-43597a6f1860, B-eca69623788b, B-f065b345a881, B-df6544218c9c

반복: map((workspace.comparisons??[]).filter(p=>nodes.some(n=>n.id===p.targetId))) · 69행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-db7f1e82e7cc

**이 비교에 대응하는 활동·조건을 확인했어요** · Checkbox · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:73](../../../src/ui/learning-schedule.tsx#L73)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-b19633eae260](../handlers/ui__learning-schedule.md#h-b19633eae260) → [pairUpdate · H-be473ae2f6ec](../handlers/ui__learning-schedule.md#h-be473ae2f6ec) → [@callback:(workspace.comparisons??[]).map · H-e5ba83e3ac57](../handlers/ui__learning-schedule.md#h-e5ba83e3ac57) → [change · H-0123681ad960](../handlers/ui__learning-schedule.md#h-0123681ad960)

```tsx
e=>pairUpdate(p,'attributionBundle',e.target.checked)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3fe31c8aa3e0, B-76a39e658c34, B-43597a6f1860, B-eca69623788b, B-f065b345a881, B-df6544218c9c

반복: map((workspace.comparisons??[]).filter(p=>nodes.some(n=>n.id===p.targetId))) · 69행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-a5f64da66b68

**`${p.action} · 이후 점수 · 선택`** · Input · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:74](../../../src/ui/learning-schedule.tsx#L74)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: !p.performed
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-e2eacfbf5a33](../handlers/ui__learning-schedule.md#h-e2eacfbf5a33) → [@callback:setScoreInputs · H-99c8a0a60074](../handlers/ui__learning-schedule.md#h-99c8a0a60074)

```tsx
e=>setScoreInputs(x=>({...x,[p.id]:e.target.value}))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map((workspace.comparisons??[]).filter(p=>nodes.some(n=>n.id===p.targetId))) · 69행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-fe175b5c0d7e

**활동 후 확인 결과 저장** · Button · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:74](../../../src/ui/learning-schedule.tsx#L74)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: !p.performed
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-97b663d3cf47](../handlers/ui__learning-schedule.md#h-97b663d3cf47) → [finishPair · H-14d2f0e5aeb3](../handlers/ui__learning-schedule.md#h-14d2f0e5aeb3) → [@callback:(workspace.comparisons??[]).map · H-b81b64f2015d](../handlers/ui__learning-schedule.md#h-b81b64f2015d) → [change · H-0123681ad960](../handlers/ui__learning-schedule.md#h-0123681ad960)

```tsx
()=>finishPair(p)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-775d6ed1dda9, B-722694adafbd, B-25dc58e527cf, B-3b803d29f0f8, B-76a39e658c34, B-43597a6f1860, B-eca69623788b, B-f065b345a881, B-df6544218c9c

반복: map((workspace.comparisons??[]).filter(p=>nodes.some(n=>n.id===p.targetId))) · 69행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-08bda01ea8c2

**추천 당시 근거 보관** · summary · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:78](../../../src/ui/learning-schedule.tsx#L78)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ac00be010a2a

**현재 추천과 계산 근거 보관** · Button · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:78](../../../src/ui/learning-schedule.tsx#L78)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [archiveSnapshot · H-3f55ec62ef8a](../handlers/ui__learning-schedule.md#h-3f55ec62ef8a) → [change · H-0123681ad960](../handlers/ui__learning-schedule.md#h-0123681ad960) → [@callback:data.records.map · H-a67a98f02f58](../handlers/ui__learning-schedule.md#h-a67a98f02f58)

```tsx
archiveSnapshot
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-76a39e658c34, B-43597a6f1860, B-eca69623788b, B-f065b345a881, B-df6544218c9c

## X-3eeb9b0f1607

**{new Date(s.createdAt).toLocaleString('ko-KR')} · {s.policyVersion}** · summary · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:78](../../../src/ui/learning-schedule.tsx#L78)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(workspace.snapshots??[]) · 78행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-98d243a5289b

**시험·과제·강의 일정** · Modal · component-callback-contract

- 실제 소스: [src/ui/learning-schedule.tsx:79](../../../src/ui/learning-schedule.tsx#L79)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-3405089be13a](../handlers/ui__learning-schedule.md#h-3405089be13a)

```tsx
()=>setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-064326ccbd56

**일정 이름** · Input · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:80](../../../src/ui/learning-schedule.tsx#L80)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-8a7679004f6c](../handlers/ui__learning-schedule.md#h-8a7679004f6c) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({name:e.target.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

## X-8b6e82a1fc49

**일정 과목** · Select · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:80](../../../src/ui/learning-schedule.tsx#L80)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-438cb20c4583](../handlers/ui__learning-schedule.md#h-438cb20c4583) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({subjectId:e.target.value,targetIds:[],goalIds:[]})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

## X-86473ead2e83

**일정 종류** · Select · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:81](../../../src/ui/learning-schedule.tsx#L81)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ac1b5343f970](../handlers/ui__learning-schedule.md#h-ac1b5343f970) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>{const kind=e.target.value as ScheduleKind;patch({kind,dueMeaning:kind==='assignment'?'submission':kind==='lecture'||kind==='class'?'attendance':'exam'});}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bd2db5c84dda, B-1538bb9bd26b, B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

## X-963d2b711a37

**시작 가능일 · 선택** · Input · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:82](../../../src/ui/learning-schedule.tsx#L82)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onInput** → [@onInput · H-7ce6fc7406f5](../handlers/ui__learning-schedule.md#h-7ce6fc7406f5) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({opensDate:e.currentTarget.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

**onChange** → [@onChange · H-cd1324168628](../handlers/ui__learning-schedule.md#h-cd1324168628) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({opensDate:e.target.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

## X-cf8b9cdd77e2

**일정 기한 · 선택** · Input · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:82](../../../src/ui/learning-schedule.tsx#L82)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onInput** → [@onInput · H-48dc80e60428](../handlers/ui__learning-schedule.md#h-48dc80e60428) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({dueDate:e.currentTarget.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

**onChange** → [@onChange · H-dd758445999f](../handlers/ui__learning-schedule.md#h-dd758445999f) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({dueDate:e.target.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

## X-9caffa66e64f

**성적 비중 · % · 선택** · Input · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:82](../../../src/ui/learning-schedule.tsx#L82)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-541652aa58bf](../handlers/ui__learning-schedule.md#h-541652aa58bf) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({weight:e.target.value===''?null:Number(e.target.value)/100})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6f7d23182fb7, B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

## X-1521f5e91e8c

**시작 가능 시각 · 선택** · Input · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:83](../../../src/ui/learning-schedule.tsx#L83)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onInput** → [@onInput · H-d20e5eec7fe4](../handlers/ui__learning-schedule.md#h-d20e5eec7fe4) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({opensTime:e.currentTarget.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

**onChange** → [@onChange · H-2388c4eb5a6d](../handlers/ui__learning-schedule.md#h-2388c4eb5a6d) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({opensTime:e.target.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

## X-4995c93946a6

**기한 시각 · 선택** · Input · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:83](../../../src/ui/learning-schedule.tsx#L83)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onInput** → [@onInput · H-93bd2e134746](../handlers/ui__learning-schedule.md#h-93bd2e134746) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({dueTime:e.currentTarget.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

**onChange** → [@onChange · H-15d87e3ac0a4](../handlers/ui__learning-schedule.md#h-15d87e3ac0a4) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({dueTime:e.target.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

## X-21a57f2bebff

**공지 확인일 · 선택** · Input · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:84](../../../src/ui/learning-schedule.tsx#L84)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: !draft.dueDate
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onInput** → [@onInput · H-d99ff1f78ca7](../handlers/ui__learning-schedule.md#h-d99ff1f78ca7) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({reviewDate:e.currentTarget.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

**onChange** → [@onChange · H-2542a07f5c6d](../handlers/ui__learning-schedule.md#h-2542a07f5c6d) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({reviewDate:e.target.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

## X-3ec3a1b19d4e

**해야 할 일 · 선택** · Textarea · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:85](../../../src/ui/learning-schedule.tsx#L85)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-79407694036f](../handlers/ui__learning-schedule.md#h-79407694036f) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({taskText:e.target.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

## X-c09f319a7927

**공지·강의 주소 · 선택** · Input · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:86](../../../src/ui/learning-schedule.tsx#L86)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4a0b0d96a81c](../handlers/ui__learning-schedule.md#h-4a0b0d96a81c) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({sourceUrl:e.target.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

## X-9f04eb893d06

**강의 주차 · 선택** · Input · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:87](../../../src/ui/learning-schedule.tsx#L87)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: ['lecture','class'].includes(draft.kind)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-2fa16e8958a9](../handlers/ui__learning-schedule.md#h-2fa16e8958a9) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({week:e.target.value?Number(e.target.value):undefined})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4bab53460d14, B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

## X-f73065aca380

**매주 반복해서 등록** · summary · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:88](../../../src/ui/learning-schedule.tsx#L88)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: draftKey.current==='new'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1fe7d0691488

**매주 반복 마지막 날 · 선택** · Input · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:88](../../../src/ui/learning-schedule.tsx#L88)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: draftKey.current==='new'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onInput** → [@onInput · H-8985f5aae14b](../handlers/ui__learning-schedule.md#h-8985f5aae14b)

```tsx
e=>{const value=e.currentTarget.value;setRepeatEnd(value);try{draftRaw.current=writeScheduleDraft(data,draftKey.current,draftCurrent.current,draftRaw.current,localStorage,{base:baseSchedule.current,repeatEnd:value});}catch(e){setError(e instanceof Error?e.message:'반복 설정 초안을 저장하지 못했습니다.');}}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b01432817eec, B-244288e391c6, B-9308a2e8911c

**onChange** → [@onChange · H-1b0bdc8c3ea0](../handlers/ui__learning-schedule.md#h-1b0bdc8c3ea0)

```tsx
e=>setRepeatEnd(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e20aa5d88a28

**기한의 의미** · Select · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:89](../../../src/ui/learning-schedule.tsx#L89)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-62b323ef59f5](../handlers/ui__learning-schedule.md#h-62b323ef59f5) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({dueMeaning:e.target.value as LearningSchedule['dueMeaning']})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

## X-62e6e4674904

**n.name** · Checkbox · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:90](../../../src/ui/learning-schedule.tsx#L90)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-2d0a6622658b](../handlers/ui__learning-schedule.md#h-2d0a6622658b) → [@callback:draft.targetIds.filter · H-76f430cf7c5f](../handlers/ui__learning-schedule.md#h-76f430cf7c5f) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({targetIds:e.target.checked?[...draft.targetIds,n.id]:draft.targetIds.filter(id=>id!==n.id)})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-59b93163b564, B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

반복: map(nodes.filter(n=>n.subjectId===draft.subjectId)) · 90행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-8720fae41b07

**필기·메모 상태도 따로 확인** · Checkbox · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:91](../../../src/ui/learning-schedule.tsx#L91)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: ['lecture','class'].includes(draft.kind)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-02ace81e9354](../handlers/ui__learning-schedule.md#h-02ace81e9354) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({notesRequired:e.target.checked})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

## X-8a5b59203792

**현재 저장 기록과 초안 비교** · summary · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:92](../../../src/ui/learning-schedule.tsx#L92)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: conflicting
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-482fc9ed153f

**현재 기록을 보존하고 초안 반영 준비** · Button · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:92](../../../src/ui/learning-schedule.tsx#L92)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open ∧ truthy: conflicting
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-cc5bc8e8c008](../handlers/ui__learning-schedule.md#h-cc5bc8e8c008)

```tsx
()=>{baseSchedule.current=structuredClone(conflicting);setConflicting(null);setError('현재 저장 기록을 기준으로 삼았습니다. 내용을 확인하고 일정 저장을 눌러 주세요.');}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-87bcda8efcae

**일정 메모 · 선택** · Textarea · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:93](../../../src/ui/learning-schedule.tsx#L93)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-cc9096d8eb3d](../handlers/ui__learning-schedule.md#h-cc9096d8eb3d) → [patch · H-de9269105558](../handlers/ui__learning-schedule.md#h-de9269105558)

```tsx
e=>patch({note:e.target.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ca514373670a, B-f5e7c5ca242a, B-0237be0aa4f3

## X-163c036a0a53

**일정 저장** · Button · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:93](../../../src/ui/learning-schedule.tsx#L93)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [save · H-3f9bd9c16543](../handlers/ui__learning-schedule.md#h-3f9bd9c16543) → [change · H-0123681ad960](../handlers/ui__learning-schedule.md#h-0123681ad960) → [@callback:weeklySchedules · H-6513b3000835](../handlers/ui__learning-schedule.md#h-6513b3000835) → [@callback:schedules.findIndex · H-8ec08ff4ccf0](../handlers/ui__learning-schedule.md#h-8ec08ff4ccf0)

```tsx
save
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2e1d5398296c, B-5a33263d4b1b, B-0ab9a6b26fa4, B-910d1f70dc3e, B-99e01432ba4c, B-2aa972a63100, B-a56986eea962, B-d71db9329aa2, B-23dbf3800d6b, B-76a39e658c34, B-43597a6f1860, B-eca69623788b, B-f065b345a881, B-df6544218c9c

## X-21457b843d21

**닫고 초안 보관** · Button · user-control

- 실제 소스: [src/ui/learning-schedule.tsx:93](../../../src/ui/learning-schedule.tsx#L93)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: interactive-when-falsy: disabled ∧ truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f8fe7b422c42](../handlers/ui__learning-schedule.md#h-f8fe7b422c42)

```tsx
()=>setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

