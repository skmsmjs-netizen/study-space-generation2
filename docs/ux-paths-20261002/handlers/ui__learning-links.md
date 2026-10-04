# src/ui/learning-links.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-bdd871d5eb32

**UseMaterialCard** · [src/ui/learning-links.tsx:11](../../../src/ui/learning-links.tsx#L11)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | useState(false)<br>call |
| 12행 | 별도 조건식 없음 | useState(material?.topicId ?? '')<br>call |
| 12행 | 별도 조건식 없음 | useState('')<br>call |
| 12행 | 별도 조건식 없음 | useState('')<br>call |
| 13행 | 별도 조건식 없음 | data.nodes.filter(n => activeTopic(data,n.id) && n.subjectId === material?.subjectId)<br>call<br>전달 콜백: H-9c988e71f484 |
| 23행 | 별도 조건식 없음 | topics.map(n => <option key={n.id} value={n.id}>{n.name}</option>)<br>call<br>전달 콜백: H-031ede957be2 |
| 27행 | truthy: notice | notice.includes('휴지통')<br>call |
| 27행 | truthy: notice ∧ truthy: !notice.includes('휴지통') | encodeURIComponent(topicId)<br>call |

반환/조기 중단: 22행 <render> [별도 조건식 없음]

## H-9c988e71f484

**@callback:data.nodes.filter** · [src/ui/learning-links.tsx:13](../../../src/ui/learning-links.tsx#L13)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | 별도 조건식 없음 | activeTopic(data, n.id)<br>call |

## H-b272868ae6b4

**register** · [src/ui/learning-links.tsx:15](../../../src/ui/learning-links.tsx#L15)

분기 조건과 가능한 갈림길:

- B-e18984e4e900 · IfStatement · !material || unsaved → truthy / falsy; 바깥 조건: 별도 조건식 없음 (16행).
- B-ba9ec3023186 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (17행).
- B-4785b865bf14 · ConditionalExpression · result.deleted → truthy / falsy; 바깥 조건: 별도 조건식 없음 (19행).
- B-8fe550a130f5 · ConditionalExpression · result.existing → truthy / falsy; 바깥 조건: falsy: result.deleted (19행).
- B-a5238fc255fb · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (20행).
- B-92bad5acdb6a · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (20행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 18행 | 별도 조건식 없음 | registerMaterialCard(repository, material, resultId, cardId, topicId, reviewed)<br>call |
| 18행 | 별도 조건식 없음 | onSaved(result.data)<br>call |
| 19행 | 별도 조건식 없음 | setNotice(result.deleted ? '이 카드에서 등록한 항목이 휴지통에 있습니다. 암기시험의 휴지통에서 복원할 수 있습니다.' : result.existing ? '이미 등록한 암기 항목을 유지했습니다. 이후 수정한 질문과 답도 그대로입니다.' : '암기 항목으로 등록했습니다. 이 주제에서 시험을 만들 수 있습니다.')<br>state-update |
| 19행 | 별도 조건식 없음 | setError('')<br>state-update |
| 20행 | exception: e | setError(e instanceof Error ? e.message : '카드를 등록하지 못했습니다. 원자료는 유지했습니다.')<br>state-update |

반환/조기 중단: 16행 <render> [truthy: !material || unsaved]

## H-3e378504bf06

**@onChange** · [src/ui/learning-links.tsx:23](../../../src/ui/learning-links.tsx#L23)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | 별도 조건식 없음 | setTopicId(e.target.value)<br>state-update |
| 23행 | 별도 조건식 없음 | setNotice('')<br>state-update |

## H-031ede957be2

**@callback:topics.map** · [src/ui/learning-links.tsx:23](../../../src/ui/learning-links.tsx#L23)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0c1b6239e405

**@onChange** · [src/ui/learning-links.tsx:24](../../../src/ui/learning-links.tsx#L24)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | 별도 조건식 없음 | setReviewed(e.target.checked)<br>state-update |

## H-cb977b739647

**CodeTopicLinkEditor** · [src/ui/learning-links.tsx:30](../../../src/ui/learning-links.tsx#L30)

분기 조건과 가능한 갈림길:

- B-10e7f9aa78d8 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (32행).
- B-29e7ca6a466d · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (32행).
- B-60809ce34207 · ConditionalExpression · topic → truthy / falsy; 바깥 조건: 별도 조건식 없음 (37행).
- B-36553d272dad · ConditionalExpression · editing → truthy / falsy; 바깥 조건: 별도 조건식 없음 (38행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 31행 | 별도 조건식 없음 | useState(false)<br>call |
| 31행 | 별도 조건식 없음 | useState('')<br>call |
| 31행 | 별도 조건식 없음 | useState(null)<br>call |
| 31행 | 별도 조건식 없음 | useState('')<br>call |
| 32행 | 별도 조건식 없음 | readLearningPlan(data)<br>call |
| 33행 | 별도 조건식 없음 | data.nodes.find(n => n.id === linked)<br>call<br>전달 콜백: H-ac8f2d9e2f38 |
| 37행 | truthy: topic | encodeURIComponent(topic.id)<br>call |
| 38행 | truthy: editing | data.nodes.filter(n => activeTopic(data,n.id)).map(n => <option key={n.id} value={n.id}>{data.subjects.find(s => s.id === n.subjectId)?.name} / {n.name}</option>)<br>call<br>전달 콜백: H-53aaed6a5a81 |
| 38행 | truthy: editing | data.nodes.filter(n => activeTopic(data,n.id))<br>call<br>전달 콜백: H-5efd2d3b4ebb |

반환/조기 중단: 36행 <render> [별도 조건식 없음]

## H-ac8f2d9e2f38

**@callback:data.nodes.find** · [src/ui/learning-links.tsx:33](../../../src/ui/learning-links.tsx#L33)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-779f436ac211

**begin** · [src/ui/learning-links.tsx:34](../../../src/ui/learning-links.tsx#L34)

분기 조건과 가능한 갈림길:

- B-48cbdc7f6306 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (34행).
- B-e757e55f718f · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (34행).
- B-45aa750a3d6d · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (34행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 34행 | 별도 조건식 없음 | readLearningPlan(repository.getSnapshot())<br>call |
| 34행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 34행 | 별도 조건식 없음 | setRaw(plan.raw)<br>state-update |
| 34행 | 별도 조건식 없음 | setTopicId(plan.workspace.codeLinks?.find(l => l.exampleId === exampleId)?.topicId ?? '')<br>state-update |
| 34행 | 별도 조건식 없음 | setEditing(true)<br>state-update |
| 34행 | 별도 조건식 없음 | setError('')<br>state-update |
| 34행 | exception: e | setError(e instanceof Error ? e.message : '주제 연결을 읽지 못했습니다.')<br>state-update |

## H-60a4c96f38b2

**save** · [src/ui/learning-links.tsx:35](../../../src/ui/learning-links.tsx#L35)

분기 조건과 가능한 갈림길:

- B-613076520efd · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (35행).
- B-a9aae7d8dad9 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (35행).
- B-b39a0898ae95 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (35행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 35행 | 별도 조건식 없음 | onSaved(saveCodeTopic(repository,exampleId,topicId,raw))<br>call |
| 35행 | 별도 조건식 없음 | saveCodeTopic(repository, exampleId, topicId, raw)<br>call |
| 35행 | 별도 조건식 없음 | setEditing(false)<br>state-update |
| 35행 | 별도 조건식 없음 | setError('')<br>state-update |
| 35행 | exception: e | setError(e instanceof Error ? e.message : '연결을 저장하지 못했습니다.')<br>state-update |

## H-281f75b42b89

**@onChange** · [src/ui/learning-links.tsx:38](../../../src/ui/learning-links.tsx#L38)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 38행 | truthy: editing | setTopicId(e.target.value)<br>state-update |

## H-5efd2d3b4ebb

**@callback:data.nodes.filter** · [src/ui/learning-links.tsx:38](../../../src/ui/learning-links.tsx#L38)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 38행 | truthy: editing | activeTopic(data, n.id)<br>call |

## H-53aaed6a5a81

**@callback:data.nodes.filter(n => activeTopic(data,n.id)).map** · [src/ui/learning-links.tsx:38](../../../src/ui/learning-links.tsx#L38)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 38행 | truthy: editing | data.subjects.find(s => s.id === n.subjectId)<br>call<br>전달 콜백: H-bcd5bee2643f |

## H-bcd5bee2643f

**@callback:data.subjects.find** · [src/ui/learning-links.tsx:38](../../../src/ui/learning-links.tsx#L38)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e9f1537edb9d

**@onClick** · [src/ui/learning-links.tsx:38](../../../src/ui/learning-links.tsx#L38)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 38행 | truthy: editing | setEditing(false)<br>state-update |

## H-7e263257545d

**RelatedCodeExamples** · [src/ui/learning-links.tsx:42](../../../src/ui/learning-links.tsx#L42)

분기 조건과 가능한 갈림길:

- B-a82badcf1cc0 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (43행).
- B-d768ce1c8ba1 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (43행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 43행 | 별도 조건식 없음 | readLearningPlan(data)<br>call |
| 44행 | 별도 조건식 없음 | (data.codeExamples ?? []).filter(e => !e.deletedAt && links.some(l => l.topicId === topicId && l.exampleId === e.id))<br>call<br>전달 콜백: H-84dea8b41127 |
| 45행 | truthy: !!examples.length | examples.map(e => <li key={e.id}><a href={`#/code/${encodeURIComponent(e.id)}`}>{e.title \|\| '제목 없는 예제'}</a> · {e.language}</li>)<br>call<br>전달 콜백: H-fbad2bd60cc7 |

반환/조기 중단: 43행 <render> [exception: exception]; 45행 !!examples.length && <section aria-label="이 주제의 코드 예제"><h3>코드 예제</h3><ul>{examples.map(e => <li key={e.id}><a href={`#/code/${encodeURIComponent(e.id)}`}>{e.title || '제목 없는 예제'}</a> · {e.language}</li>)}</ul></section> [별도 조건식 없음]

## H-84dea8b41127

**@callback:(data.codeExamples ?? []).filter** · [src/ui/learning-links.tsx:44](../../../src/ui/learning-links.tsx#L44)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 44행 | truthy: !e.deletedAt | links.some(l => l.topicId === topicId && l.exampleId === e.id)<br>call<br>전달 콜백: H-4ca9a1523904 |

## H-4ca9a1523904

**@callback:links.some** · [src/ui/learning-links.tsx:44](../../../src/ui/learning-links.tsx#L44)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fbad2bd60cc7

**@callback:examples.map** · [src/ui/learning-links.tsx:45](../../../src/ui/learning-links.tsx#L45)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 45행 | truthy: !!examples.length | encodeURIComponent(e.id)<br>call |

