# src/ui/material-tutor.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-b956e60d608e

**MaterialTutor** · [src/ui/material-tutor.tsx:6](../../../src/ui/material-tutor.tsx#L6)

분기 조건과 가능한 갈림길:

- B-7160abc7c602 · IfStatement · !turns.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (10행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | turns.map(turn => <article key={turn.id}><h3>{turn.request?.focus}</h3>{turn.source && materialSourceIdentity(turn.source) !== materialSourceIdentity(currentSource) && <p>이전 원문에 대한 답변입니다. 근거는 생성 당시 자료를 엽니다.</p>}{turn.diagnostics && occurrenceRows(turn.diagnostics, diagnostic => JSON.stringify(diagnostic)).map(({value: d, key}) => <p key={key}>{d.message}</p>)}{occurrenceRows(turn.summary, answer => JSON.stringify(answer)).map(({value: answer, key}) => <div key={key}><StudyResultText text={answer.text}/><div className="material-evidence">{answer.sourceIds.map(id => <Button key={id} variant="quiet" onClick={() => onEvidence(turn.id, id)}>{turn.segments.find(s => s.id === id)?.label ?? id} 원문</Button>)}< … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-c0d131b8393d |

반환/조기 중단: 10행 null [truthy: !turns.length]; 11행 <render> [별도 조건식 없음]

## H-ac44002c4651

**@onToggle** · [src/ui/material-tutor.tsx:11](../../../src/ui/material-tutor.tsx#L11)

분기 조건과 가능한 갈림길:

- B-2488e637d3b9 · IfStatement · event.currentTarget.open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (11행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | truthy: event.currentTarget.open | onHelp()<br>call |

## H-c0d131b8393d

**@callback:turns.map** · [src/ui/material-tutor.tsx:12](../../../src/ui/material-tutor.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | truthy: turn.source | materialSourceIdentity(turn.source)<br>call |
| 12행 | truthy: turn.source | materialSourceIdentity(currentSource)<br>call |
| 12행 | truthy: turn.diagnostics | occurrenceRows(turn.diagnostics, diagnostic => JSON.stringify(diagnostic)).map(({value: d, key}) => <p key={key}>{d.message}</p>)<br>call<br>전달 콜백: H-1b393e3b657a |
| 12행 | truthy: turn.diagnostics | occurrenceRows(turn.diagnostics, diagnostic => JSON.stringify(diagnostic))<br>call<br>전달 콜백: H-21fd0db5b952 |
| 12행 | 별도 조건식 없음 | occurrenceRows(turn.summary, answer => JSON.stringify(answer)).map(({value: answer, key}) => <div key={key}><StudyResultText text={answer.text}/><div className="material-evidence">{answer.sourceIds.map(id => <Button key={id} variant="quiet" onClick={() => onEvidence(turn.id, id)}>{turn.segments.find(s => s.id === id)?.label ?? id} 원문</Button>)}</div></div>)<br>call<br>전달 콜백: H-138a8b3666c6 |
| 12행 | 별도 조건식 없음 | occurrenceRows(turn.summary, answer => JSON.stringify(answer))<br>call<br>전달 콜백: H-e1b1d8916cb4 |

## H-21fd0db5b952

**@callback:occurrenceRows** · [src/ui/material-tutor.tsx:12](../../../src/ui/material-tutor.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | truthy: turn.diagnostics | JSON.stringify(diagnostic)<br>call |

## H-1b393e3b657a

**@callback:occurrenceRows(turn.diagnostics, diagnostic => JSON.stringify(diagnostic)).map** · [src/ui/material-tutor.tsx:12](../../../src/ui/material-tutor.tsx#L12)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e1b1d8916cb4

**@callback:occurrenceRows** · [src/ui/material-tutor.tsx:12](../../../src/ui/material-tutor.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | JSON.stringify(answer)<br>call |

## H-138a8b3666c6

**@callback:occurrenceRows(turn.summary, answer => JSON.stringify(answer)).map** · [src/ui/material-tutor.tsx:12](../../../src/ui/material-tutor.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | answer.sourceIds.map(id => <Button key={id} variant="quiet" onClick={() => onEvidence(turn.id, id)}>{turn.segments.find(s => s.id === id)?.label ?? id} 원문</Button>)<br>call<br>전달 콜백: H-73d4dfcaf8b1 |

## H-73d4dfcaf8b1

**@callback:answer.sourceIds.map** · [src/ui/material-tutor.tsx:12](../../../src/ui/material-tutor.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | turn.segments.find(s => s.id === id)<br>call<br>전달 콜백: H-74b59bd05588 |

## H-90597c6e4835

**@onClick** · [src/ui/material-tutor.tsx:12](../../../src/ui/material-tutor.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | onEvidence(turn.id, id)<br>call |

## H-74b59bd05588

**@callback:turn.segments.find** · [src/ui/material-tutor.tsx:12](../../../src/ui/material-tutor.tsx#L12)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

