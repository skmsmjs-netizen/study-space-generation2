# src/ui/performance-evidence.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-b83d7f1a2615

**Result** · [src/ui/performance-evidence.tsx:6](../../../src/ui/performance-evidence.tsx#L6)

분기 조건과 가능한 갈림길:

- B-c57de7a94a3f · ConditionalExpression · e.kind === 'correction' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (7행).
- B-d8a261fe676c · ConditionalExpression · e.assistance === 'none' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (7행).
- B-0dfd52b83cf9 · ConditionalExpression · e.assistance === 'notes' → truthy / falsy; 바깥 조건: falsy: e.assistance === 'none' (7행).
- B-028df90f17e0 · ConditionalExpression · e.novelty === 'new' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (7행).
- B-5fad19aa745f · ConditionalExpression · e.novelty === 'same' → truthy / falsy; 바깥 조건: falsy: e.novelty === 'new' (7행).
- B-4e8a9b73c9ca · ConditionalExpression · e.source.performedAt → truthy / falsy; 바깥 조건: truthy: e.source (7행).
- B-7a8c54c4b5d7 · ConditionalExpression · e.source.kind === 'exam-memo' → truthy / falsy; 바깥 조건: truthy: e.source (7행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 7행 | 별도 조건식 없음 | new Date(e.occurredAt!).toLocaleString('ko-KR')<br>call |
| 7행 | truthy: e.source ∧ truthy: e.source.kind === 'exam-memo' | encodeURIComponent(e.source.id)<br>call |
| 7행 | truthy: e.source ∧ falsy: e.source.kind === 'exam-memo' | encodeURIComponent(e.source.id)<br>call |

반환/조기 중단: 7행 <render> [별도 조건식 없음]

## H-8637544d1012

**PerformanceEvidence** · [src/ui/performance-evidence.tsx:9](../../../src/ui/performance-evidence.tsx#L9)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 10행 | 별도 조건식 없음 | useState(false)<br>call |
| 10행 | 별도 조건식 없음 | useState(20)<br>call |
| 10행 | 별도 조건식 없음 | useState(null)<br>call |
| 11행 | 별도 조건식 없음 | useMemo(()=>canonicalEvents(events,at,at).filter(e=>e.facet === goalId).sort((a,b)=>b.knownAt.localeCompare(a.knownAt)\|\|b.sequence-a.sequence), [events,goalId,at])<br>call<br>전달 콜백: H-ac8a98f43ae3 |
| 12행 | truthy: opened | current.slice(0,count).map(e=><div key={e.id}><Result event={e} />{events.some(old=>old.id===e.id && old.revision<e.revision) && <><Button variant="quiet" aria-expanded={history===e.id} onClick={()=>setHistory(history===e.id?null:e.id)}>이전 판정 보기</Button>{history===e.id && events.filter(old=>old.id===e.id && old.revision<e.revision).sort((a,b)=>b.revision-a.revision).map(old=><Result key={old.revision} event={old} />)}</>}</div>)<br>call<br>전달 콜백: H-4fec0b579c7a |
| 12행 | truthy: opened | current.slice(0, count)<br>call |

반환/조기 중단: 12행 <render> [별도 조건식 없음]

## H-ac8a98f43ae3

**@callback:useMemo** · [src/ui/performance-evidence.tsx:11](../../../src/ui/performance-evidence.tsx#L11)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | 별도 조건식 없음 | canonicalEvents(events,at,at).filter(e=>e.facet === goalId).sort((a,b)=>b.knownAt.localeCompare(a.knownAt)\|\|b.sequence-a.sequence)<br>call<br>전달 콜백: H-d598c7742532 |
| 11행 | 별도 조건식 없음 | canonicalEvents(events,at,at).filter(e=>e.facet === goalId)<br>call<br>전달 콜백: H-f136e0a1d389 |
| 11행 | 별도 조건식 없음 | canonicalEvents(events, at, at)<br>call |

## H-f136e0a1d389

**@callback:canonicalEvents(events,at,at).filter** · [src/ui/performance-evidence.tsx:11](../../../src/ui/performance-evidence.tsx#L11)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d598c7742532

**@callback:canonicalEvents(events,at,at).filter(e=>e.facet === goalId).sort** · [src/ui/performance-evidence.tsx:11](../../../src/ui/performance-evidence.tsx#L11)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | 별도 조건식 없음 | b.knownAt.localeCompare(a.knownAt)<br>call |

## H-ad7665046bcf

**@onToggle** · [src/ui/performance-evidence.tsx:12](../../../src/ui/performance-evidence.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | setOpened(e.currentTarget.open)<br>state-update |

## H-4fec0b579c7a

**@callback:current.slice(0,count).map** · [src/ui/performance-evidence.tsx:12](../../../src/ui/performance-evidence.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | truthy: opened | events.some(old=>old.id===e.id && old.revision<e.revision)<br>call<br>전달 콜백: H-bcaef4a624d6 |
| 12행 | truthy: opened ∧ truthy: events.some(old=>old.id===e.id && old.revision<e.revision) ∧ truthy: history===e.id | events.filter(old=>old.id===e.id && old.revision<e.revision).sort((a,b)=>b.revision-a.revision).map(old=><Result key={old.revision} event={old} />)<br>call<br>전달 콜백: H-2882d8f1809a |
| 12행 | truthy: opened ∧ truthy: events.some(old=>old.id===e.id && old.revision<e.revision) ∧ truthy: history===e.id | events.filter(old=>old.id===e.id && old.revision<e.revision).sort((a,b)=>b.revision-a.revision)<br>call<br>전달 콜백: H-21af4871d7f8 |
| 12행 | truthy: opened ∧ truthy: events.some(old=>old.id===e.id && old.revision<e.revision) ∧ truthy: history===e.id | events.filter(old=>old.id===e.id && old.revision<e.revision)<br>call<br>전달 콜백: H-e33cbe6371af |

## H-bcaef4a624d6

**@callback:events.some** · [src/ui/performance-evidence.tsx:12](../../../src/ui/performance-evidence.tsx#L12)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5a02b0685867

**@onClick** · [src/ui/performance-evidence.tsx:12](../../../src/ui/performance-evidence.tsx#L12)

분기 조건과 가능한 갈림길:

- B-f755d470ed90 · ConditionalExpression · history===e.id → truthy / falsy; 바깥 조건: truthy: opened ∧ truthy: events.some(old=>old.id===e.id && old.revision<e.revision) (12행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | truthy: opened ∧ truthy: events.some(old=>old.id===e.id && old.revision<e.revision) | setHistory(history===e.id?null:e.id)<br>state-update |

## H-e33cbe6371af

**@callback:events.filter** · [src/ui/performance-evidence.tsx:12](../../../src/ui/performance-evidence.tsx#L12)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-21af4871d7f8

**@callback:events.filter(old=>old.id===e.id && old.revision<e.revision).sort** · [src/ui/performance-evidence.tsx:12](../../../src/ui/performance-evidence.tsx#L12)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2882d8f1809a

**@callback:events.filter(old=>old.id===e.id && old.revision<e.revision).sort((a,b)=>b.revision-a.revision).map** · [src/ui/performance-evidence.tsx:12](../../../src/ui/performance-evidence.tsx#L12)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a96fa469e924

**@onClick** · [src/ui/performance-evidence.tsx:12](../../../src/ui/performance-evidence.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | truthy: opened ∧ truthy: current.length>count | setCount(count+20)<br>state-update |

