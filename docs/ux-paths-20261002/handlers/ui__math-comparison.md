# src/ui/math-comparison.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-0d96fd47301e

**MathComparison** · [src/ui/math-comparison.tsx:25](../../../src/ui/math-comparison.tsx#L25)

분기 조건과 가능한 갈림길:

- B-061c17e82c14 · ConditionalExpression · scene.mode === 'function' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (47행).
- B-ff720affb4ec · ConditionalExpression · scene.mode === 'function' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (86행).
- B-45b788084b5b · ConditionalExpression · pinned && a → truthy / falsy; 바깥 조건: 별도 조건식 없음 (90행).
- B-9d4b54141ddf · ConditionalExpression · pinned.mode === 'function' → truthy / falsy; 바깥 조건: truthy: pinned && a (96행).
- B-4c816c175753 · ConditionalExpression · result → truthy / falsy; 바깥 조건: truthy: pinned && a (98행).
- B-22ae041c3b89 · ConditionalExpression · pinned.mode === 'function' → truthy / falsy; 바깥 조건: truthy: pinned && a (101행).
- B-fd6bfa24d7c5 · ConditionalExpression · pinned → truthy / falsy; 바깥 조건: 별도 조건식 없음 (115행).
- B-ba0ebecbd022 · ConditionalExpression · blocked → truthy / falsy; 바깥 조건: truthy: pinned || blocked (126행).
- B-9bc212437233 · ConditionalExpression · result → truthy / falsy; 바깥 조건: truthy: pinned && a (138행).
- B-a57dadc17e2f · ConditionalExpression · large → truthy / falsy; 바깥 조건: truthy: pinned && a ∧ truthy: compatible && result (233행).
- B-44791db23cf4 · ConditionalExpression · lockedBounds → truthy / falsy; 바깥 조건: truthy: pinned && a ∧ truthy: compatible && result (238행).
- B-437965cb6a41 · ConditionalExpression · a.missing || result.missing → truthy / falsy; 바깥 조건: truthy: pinned && a ∧ truthy: compatible && result (293행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 34행 | 별도 조건식 없음 | mathComparisonKey(ownerKey)<br>call |
| 35행 | 별도 조건식 없음 | useState(() => readMathComparison(storageKey))<br>call<br>전달 콜백: H-b1fbfc852199 |
| 36행 | 별도 조건식 없음 | useState(initial.scene)<br>call |
| 37행 | 별도 조건식 없음 | useState(initial.blocked)<br>call |
| 38행 | 별도 조건식 없음 | useState(initial.error)<br>call |
| 39행 | 별도 조건식 없음 | useState('')<br>call |
| 40행 | 별도 조건식 없음 | useState('xy')<br>call |
| 41행 | 별도 조건식 없음 | useState(null)<br>call |
| 42행 | 별도 조건식 없음 | useState(1)<br>call |
| 43행 | 별도 조건식 없음 | useState(false)<br>call |
| 44행 | 별도 조건식 없음 | useId().replace(/:/g, '')<br>call |
| 44행 | 별도 조건식 없음 | useId()<br>call |
| 45행 | 별도 조건식 없음 | useMemo(() => (pinned ? buildScene(pinned) : null), [pinned])<br>call<br>전달 콜백: H-89a0640f87f4 |
| 46행 | 별도 조건식 없음 | Boolean(pinned && scene.mode === pinned.mode)<br>call |
| 48행 | 별도 조건식 없음 | useMemo(() => comparisonBounds([a?.points ?? [], compatible ? (result?.points ?? []) : []], plane), [a, result, compatible, plane])<br>call<br>전달 콜백: H-de8216d58544 |
| 92행 | truthy: pinned && a | comparisonNumber(pinned.a)<br>call |
| 92행 | truthy: pinned && a | comparisonNumber(scene.a)<br>call |
| 93행 | truthy: pinned && a | comparisonNumber(pinned.b)<br>call |
| 93행 | truthy: pinned && a | comparisonNumber(scene.b)<br>call |
| 97행 | truthy: pinned && a | comparisonNumber(a.at)<br>call |
| 98행 | truthy: pinned && a ∧ truthy: result | comparisonNumber(result.at)<br>call |
| 100행 | truthy: pinned && a | (['x', 'y', 'z'] as const)<br>            .slice(0, pinned.mode === 'function' ? 2 : 3)<br>            .map((axis, index) => ({ label: `좌표 ${axis}`, a: a.point ? comparisonNumber(a.point[index]) : '정의되지 않음', b: result?.point ? comparisonNumber(result.point[index]) : '정의되지 않음', }))<br>call<br>전달 콜백: H-a7abdeac4408 |
| 100행 | truthy: pinned && a | (['x', 'y', 'z'] as const)<br>            .slice(0, pinned.mode === 'function' ? 2 : 3)<br>call |
| 109행 | 별도 조건식 없음 | comparisonCoordinates([0, 0, 0], plane, bounds)<br>call |
| 262행 | truthy: pinned && a ∧ truthy: compatible && result | comparisonPath(a.points, a.breakBefore, plane, bounds)<br>call |
| 266행 | truthy: pinned && a ∧ truthy: compatible && result | comparisonPath(result.points, result.breakBefore, plane, bounds)<br>call |
| 271행 | truthy: pinned && a ∧ truthy: compatible && result ∧ truthy: a.point | comparisonCoordinates(a.point, plane, bounds)<br>call |
| 272행 | truthy: pinned && a ∧ truthy: compatible && result ∧ truthy: a.point | comparisonCoordinates(a.point, plane, bounds)<br>call |
| 279행 | truthy: pinned && a ∧ truthy: compatible && result ∧ truthy: result.point | comparisonCoordinates(result.point, plane, bounds)<br>call |
| 280행 | truthy: pinned && a ∧ truthy: compatible && result ∧ truthy: result.point | comparisonCoordinates(result.point, plane, bounds)<br>call |
| 287행 | truthy: pinned && a ∧ truthy: compatible && result | comparisonNumber(bounds.x - bounds.span / 2)<br>call |
| 288행 | truthy: pinned && a ∧ truthy: compatible && result | comparisonNumber(bounds.x + bounds.span / 2)<br>call |
| 289행 | truthy: pinned && a ∧ truthy: compatible && result | comparisonNumber(bounds.y - bounds.span / 2)<br>call |
| 290행 | truthy: pinned && a ∧ truthy: compatible && result | comparisonNumber(bounds.y + bounds.span / 2)<br>call |
| 311행 | truthy: pinned && a | rows.map((row) => ( <tr key={row.label}> <th scope="row">{row.label}</th> <td>{row.a}</td> <td>{compatible ? row.b : '종류가 다름'}</td> </tr> ))<br>call<br>전달 콜백: H-6191a255ea6c |

반환/조기 중단: 110행 <render> [별도 조건식 없음]

## H-b1fbfc852199

**@callback:useState** · [src/ui/math-comparison.tsx:35](../../../src/ui/math-comparison.tsx#L35)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 35행 | 별도 조건식 없음 | readMathComparison(storageKey)<br>call |

## H-89a0640f87f4

**@callback:useMemo** · [src/ui/math-comparison.tsx:45](../../../src/ui/math-comparison.tsx#L45)

분기 조건과 가능한 갈림길:

- B-c0fab1e479ed · ConditionalExpression · pinned → truthy / falsy; 바깥 조건: 별도 조건식 없음 (45행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 45행 | truthy: pinned | buildScene(pinned)<br>call |

## H-de8216d58544

**@callback:useMemo** · [src/ui/math-comparison.tsx:49](../../../src/ui/math-comparison.tsx#L49)

분기 조건과 가능한 갈림길:

- B-19fd33d00bc6 · ConditionalExpression · compatible → truthy / falsy; 바깥 조건: 별도 조건식 없음 (49행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 49행 | 별도 조건식 없음 | comparisonBounds([a?.points ?? [], compatible ? (result?.points ?? []) : []], plane)<br>call |

## H-c5be541451e2

**pin** · [src/ui/math-comparison.tsx:54](../../../src/ui/math-comparison.tsx#L54)

분기 조건과 가능한 갈림길:

- B-4e9c133b11cc · IfStatement · !result || blocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (55행).
- B-fb7f438f8a8f · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (61행).
- B-ed7ef7465bc1 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (66행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 56행 | 별도 조건식 없음 | comparisonSnapshot(scene)<br>call |
| 57행 | 별도 조건식 없음 | setPinned(snapshot)<br>state-update |
| 58행 | 별도 조건식 없음 | setLockedBounds(null)<br>state-update |
| 59행 | 별도 조건식 없음 | setZoom(1)<br>state-update |
| 60행 | 별도 조건식 없음 | setError('')<br>state-update |
| 62행 | 별도 조건식 없음 | writeMathComparison(storageKey, snapshot)<br>call |
| 63행 | 별도 조건식 없음 | setNotice('A를 고정했습니다. 현재 조건 B를 바꾸어 비교하세요. 이 탭에서 다시 열어도 A를 이어갑니다.')<br>state-update |
| 67행 | exception: exception | setNotice('A를 현재 화면에 고정했습니다. 탭 보관에 실패하여 이 화면을 떠나면 복원되지 않을 수 있습니다.')<br>state-update |

반환/조기 중단: 55행 <render> [truthy: !result || blocked]

## H-653a87ade0f8

**clear** · [src/ui/math-comparison.tsx:72](../../../src/ui/math-comparison.tsx#L72)

분기 조건과 가능한 갈림길:

- B-ad5477452d92 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (73행).
- B-2d2697f18923 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (81행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 74행 | 별도 조건식 없음 | clearMathComparison(storageKey)<br>call |
| 75행 | 별도 조건식 없음 | setPinned(null)<br>state-update |
| 76행 | 별도 조건식 없음 | setBlocked(false)<br>state-update |
| 77행 | 별도 조건식 없음 | setError('')<br>state-update |
| 78행 | 별도 조건식 없음 | setNotice('비교 조건을 지웠습니다. 현재 수식과 저장된 장면은 유지됩니다.')<br>state-update |
| 79행 | 별도 조건식 없음 | setLockedBounds(null)<br>state-update |
| 80행 | 별도 조건식 없음 | setZoom(1)<br>state-update |
| 82행 | exception: exception | setError('비교 조건을 지우지 못했습니다. 현재 A와 저장된 내용을 유지합니다.')<br>state-update |

## H-a7abdeac4408

**@callback:(['x', 'y', 'z'] as const)
            .slice(0, pinned.mode === 'function' ? 2 : 3)
            .map** · [src/ui/math-comparison.tsx:102](../../../src/ui/math-comparison.tsx#L102)

분기 조건과 가능한 갈림길:

- B-0e7618eb135a · ConditionalExpression · a.point → truthy / falsy; 바깥 조건: truthy: pinned && a (104행).
- B-3c7d9cde474a · ConditionalExpression · result?.point → truthy / falsy; 바깥 조건: truthy: pinned && a (105행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 104행 | truthy: pinned && a ∧ truthy: a.point | comparisonNumber(a.point[index])<br>call |
| 105행 | truthy: pinned && a ∧ truthy: result?.point | comparisonNumber(result.point[index])<br>call |

## H-377dd62ca9f5

**@onChange** · [src/ui/math-comparison.tsx:158](../../../src/ui/math-comparison.tsx#L158)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 159행 | truthy: pinned && a ∧ truthy: compatible && result ∧ truthy: scene.mode === 'curve' | setProjection(event.target.value as ComparisonProjection)<br>state-update |
| 160행 | truthy: pinned && a ∧ truthy: compatible && result ∧ truthy: scene.mode === 'curve' | setLockedBounds(null)<br>state-update |
| 161행 | truthy: pinned && a ∧ truthy: compatible && result ∧ truthy: scene.mode === 'curve' | setZoom(1)<br>state-update |

## H-c66bff7c157a

**@onClick** · [src/ui/math-comparison.tsx:172](../../../src/ui/math-comparison.tsx#L172)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 173행 | truthy: pinned && a ∧ truthy: compatible && result | setLockedBounds(base)<br>state-update |
| 174행 | truthy: pinned && a ∧ truthy: compatible && result | setZoom((value) => Math.min(value * 1.5, 20))<br>state-update<br>전달 콜백: H-672753dcc196 |

## H-672753dcc196

**@callback:setZoom** · [src/ui/math-comparison.tsx:174](../../../src/ui/math-comparison.tsx#L174)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 174행 | truthy: pinned && a ∧ truthy: compatible && result | Math.min(value * 1.5, 20)<br>call |

## H-a8fb97859aad

**@onClick** · [src/ui/math-comparison.tsx:183](../../../src/ui/math-comparison.tsx#L183)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 184행 | truthy: pinned && a ∧ truthy: compatible && result | setLockedBounds(base)<br>state-update |
| 185행 | truthy: pinned && a ∧ truthy: compatible && result | setZoom((value) => Math.max(value / 1.5, 0.2))<br>state-update<br>전달 콜백: H-dc1875222a86 |

## H-dc1875222a86

**@callback:setZoom** · [src/ui/math-comparison.tsx:185](../../../src/ui/math-comparison.tsx#L185)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 185행 | truthy: pinned && a ∧ truthy: compatible && result | Math.max(value / 1.5, 0.2)<br>call |

## H-f44750ecd2a8

**@onClick** · [src/ui/math-comparison.tsx:193](../../../src/ui/math-comparison.tsx#L193)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 194행 | truthy: pinned && a ∧ truthy: compatible && result | setLockedBounds(null)<br>state-update |
| 195행 | truthy: pinned && a ∧ truthy: compatible && result | setZoom(1)<br>state-update |

## H-914c90f43acc

**@onClick** · [src/ui/math-comparison.tsx:203](../../../src/ui/math-comparison.tsx#L203)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 203행 | truthy: pinned && a ∧ truthy: compatible && result | setLockedBounds({ ...base, x: base.x - bounds.span / 5 })<br>state-update |

## H-46b5fa7942f1

**@onClick** · [src/ui/math-comparison.tsx:210](../../../src/ui/math-comparison.tsx#L210)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 210행 | truthy: pinned && a ∧ truthy: compatible && result | setLockedBounds({ ...base, x: base.x + bounds.span / 5 })<br>state-update |

## H-9747d1a4aa89

**@onClick** · [src/ui/math-comparison.tsx:217](../../../src/ui/math-comparison.tsx#L217)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 217행 | truthy: pinned && a ∧ truthy: compatible && result | setLockedBounds({ ...base, y: base.y + bounds.span / 5 })<br>state-update |

## H-63ffed27c69e

**@onClick** · [src/ui/math-comparison.tsx:224](../../../src/ui/math-comparison.tsx#L224)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 224행 | truthy: pinned && a ∧ truthy: compatible && result | setLockedBounds({ ...base, y: base.y - bounds.span / 5 })<br>state-update |

## H-0e0015013545

**@onClick** · [src/ui/math-comparison.tsx:231](../../../src/ui/math-comparison.tsx#L231)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 231행 | truthy: pinned && a ∧ truthy: compatible && result | setLarge((value) => !value)<br>state-update<br>전달 콜백: H-6aa9647c4b70 |

## H-6aa9647c4b70

**@callback:setLarge** · [src/ui/math-comparison.tsx:231](../../../src/ui/math-comparison.tsx#L231)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6191a255ea6c

**@callback:rows.map** · [src/ui/math-comparison.tsx:311](../../../src/ui/math-comparison.tsx#L311)

분기 조건과 가능한 갈림길:

- B-729910f887ee · ConditionalExpression · compatible → truthy / falsy; 바깥 조건: truthy: pinned && a (315행).

