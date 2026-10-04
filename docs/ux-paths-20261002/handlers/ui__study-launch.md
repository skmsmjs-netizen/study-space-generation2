# src/ui/study-launch.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-381e156e93d3

**StudyLaunch** · [src/ui/study-launch.tsx:14](../../../src/ui/study-launch.tsx#L14)


반환/조기 중단: 15행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f5b0051353a1

**StudyLaunchContent** · [src/ui/study-launch.tsx:17](../../../src/ui/study-launch.tsx#L17)

분기 조건과 가능한 갈림길:

- B-7672a67ceb07 · ConditionalExpression · nodeId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (26행).
- B-6e9cd3c9a1ca · ConditionalExpression · guideHint → truthy / falsy; 바깥 조건: 별도 조건식 없음 (27행).
- B-efca08262498 · ConditionalExpression · hint → truthy / falsy; 바깥 조건: 별도 조건식 없음 (28행).
- B-feda27735836 · IfStatement · !selected && !hint && !error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (49행).
- B-3e81ee640131 · ConditionalExpression · returning → truthy / falsy; 바깥 조건: truthy: displayedHint && hint (58행).
- B-39a49ef171ef · ConditionalExpression · guide → truthy / falsy; 바깥 조건: truthy: open (71행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 18행 | 별도 조건식 없음 | useState(() => { try { return { hint: readStudyLaunch(data), error: '' }; } catch { return { hint: null, error: '공부한 뒤 돌아올 위치를 읽지 못했습니다. 저장된 위치와 공부 기록·초안을 변경하지 않았습니다. 다시 읽기를 시도해 주세요.' }; } })<br>call<br>전달 콜백: H-8349a3243115 |
| 22행 | 별도 조건식 없음 | useState(initial.hint)<br>call |
| 23행 | 별도 조건식 없음 | useState(initial.error)<br>call |
| 23행 | 별도 조건식 없음 | useState(Boolean(initial.error))<br>call |
| 23행 | 별도 조건식 없음 | Boolean(initial.error)<br>call |
| 24행 | 별도 조건식 없음 | useState(false)<br>call |
| 25행 | 별도 조건식 없음 | useState(null)<br>call |
| 26행 | truthy: nodeId | resolveStudyLaunchTarget(data, nodeId)<br>call |
| 27행 | truthy: guideHint | resolveStudyLaunchTarget(data, guideHint.nodeId, guideHint)<br>call |
| 28행 | truthy: hint | resolveStudyLaunchTarget(data, hint.nodeId, hint)<br>call |
| 60행 | truthy: displayedHint && hint ∧ truthy: returning | returning.path.join(' → ')<br>call |
| 72행 | truthy: open ∧ truthy: guide | guide.path.join(' → ')<br>call |

반환/조기 중단: 49행 null [truthy: !selected && !hint && !error]; 50행 <render> [별도 조건식 없음]

## H-8349a3243115

**@callback:useState** · [src/ui/study-launch.tsx:18](../../../src/ui/study-launch.tsx#L18)

분기 조건과 가능한 갈림길:

- B-79cc8bebb2db · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (19행).
- B-c1fa7a662c1f · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (20행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 19행 | 별도 조건식 없음 | readStudyLaunch(data)<br>call |

반환/조기 중단: 19행 { hint: readStudyLaunch(data), error: '' } [별도 조건식 없음]; 20행 { hint: null, error: '공부한 뒤 돌아올 위치를 읽지 못했습니다. 저장된 위치와 공부 기록·초안을 변경하지 않았습니다. 다시 읽기를 시도해 주세요.' } [exception: exception]

## H-851488b4b3df

**retryRead** · [src/ui/study-launch.tsx:30](../../../src/ui/study-launch.tsx#L30)

분기 조건과 가능한 갈림길:

- B-cc6dab6bf3d7 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (31행).
- B-59a5fcf09ff2 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (32행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 31행 | 별도 조건식 없음 | setHint(readStudyLaunch(data))<br>state-update |
| 31행 | 별도 조건식 없음 | readStudyLaunch(data)<br>call |
| 31행 | 별도 조건식 없음 | setError('')<br>state-update |
| 31행 | 별도 조건식 없음 | setReadBlocked(false)<br>state-update |
| 32행 | exception: exception | setReadBlocked(true)<br>state-update |
| 32행 | exception: exception | setError('복귀 위치를 다시 읽지 못했습니다. 저장된 내용은 덮어쓰지 않았습니다. 잠시 뒤 다시 읽기를 시도해 주세요.')<br>state-update |

## H-5f119fd8103d

**start** · [src/ui/study-launch.tsx:34](../../../src/ui/study-launch.tsx#L34)

분기 조건과 가능한 갈림길:

- B-907efd978727 · IfStatement · !nodeId || !guide || readBlocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (35행).
- B-5434114e2d03 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (36행).
- B-a552f8926223 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (37행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 36행 | 별도 조건식 없음 | setHint(saveStudyLaunch(data, nodeId))<br>state-update |
| 36행 | 별도 조건식 없음 | saveStudyLaunch(data, nodeId)<br>call |
| 36행 | 별도 조건식 없음 | setError('')<br>state-update |
| 36행 | 별도 조건식 없음 | setOpen(false)<br>state-update |
| 37행 | exception: exception | setError('복귀 위치의 저장을 확인하지 못했습니다. 공부 기록이나 활동 체크는 만들지 않았습니다. 이 창에서 저장을 다시 시도해 주세요.')<br>state-update |

반환/조기 중단: 35행 <render> [truthy: !nodeId || !guide || readBlocked]

## H-0ffc09a38f6b

**choose** · [src/ui/study-launch.tsx:39](../../../src/ui/study-launch.tsx#L39)

분기 조건과 가능한 갈림길:

- B-3b57eb3be320 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (40행).
- B-a42795938e75 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (41행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 40행 | 별도 조건식 없음 | clearStudyLaunch(data)<br>call |
| 40행 | 별도 조건식 없음 | setHint(null)<br>state-update |
| 40행 | 별도 조건식 없음 | setError('')<br>state-update |
| 40행 | 별도 조건식 없음 | setOpen(false)<br>state-update |
| 40행 | 별도 조건식 없음 | onChoose()<br>call |
| 41행 | exception: exception | setError('복귀 위치의 해제를 확인하지 못했습니다. 공부 기록·초안은 변경하지 않았습니다. 위치를 다시 읽거나 다른 내용 고르기를 다시 시도해 주세요.')<br>state-update |

## H-7f5a5aec4375

**record** · [src/ui/study-launch.tsx:43](../../../src/ui/study-launch.tsx#L43)

분기 조건과 가능한 갈림길:

- B-19c881ddf28f · IfStatement · !resolveStudyLaunchTarget(data, id, expected) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (44행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 44행 | 별도 조건식 없음 | resolveStudyLaunchTarget(data, id, expected)<br>call |
| 45행 | truthy: !resolveStudyLaunchTarget(data, id, expected) | setError('이 주제의 현재 소속을 확인하지 못했습니다. 기록을 만들지 않았습니다. 과목에서 주제를 다시 골라 주세요.')<br>state-update |
| 47행 | 별도 조건식 없음 | setOpen(false)<br>state-update |
| 47행 | 별도 조건식 없음 | onRecord(id)<br>call |

반환/조기 중단: 45행 <render> [truthy: !resolveStudyLaunchTarget(data, id, expected)]

## H-4bb31b38471e

**@onClick** · [src/ui/study-launch.tsx:51](../../../src/ui/study-launch.tsx#L51)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 52행 | truthy: selected | setGuideHint({ version: 1, userId: data.userId, namespace: data.namespace, nodeId: selected.node.id, subjectId: selected.subject.id, scope: { ...selected.subject.scope } })<br>state-update |
| 54행 | truthy: selected | setOpen(true)<br>state-update |

## H-8ca323f91bfc

**@onClick** · [src/ui/study-launch.tsx:63](../../../src/ui/study-launch.tsx#L63)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 63행 | truthy: displayedHint && hint ∧ truthy: returning | record(returning.node.id, hint)<br>call → [H-7f5a5aec4375](ui__study-launch.md#h-7f5a5aec4375) |

## H-614907f21371

**@onClose** · [src/ui/study-launch.tsx:70](../../../src/ui/study-launch.tsx#L70)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 70행 | truthy: open | setOpen(false)<br>state-update |

## H-27d3a43e0632

**@onClick** · [src/ui/study-launch.tsx:77](../../../src/ui/study-launch.tsx#L77)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 77행 | truthy: open ∧ truthy: guide | record(guide.node.id, guideHint!)<br>call → [H-7f5a5aec4375](ui__study-launch.md#h-7f5a5aec4375) |

