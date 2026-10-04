# src/ui/material-card-library.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-94191faf0d37

**MaterialCardLibrary** · [src/ui/material-card-library.tsx:12](../../../src/ui/material-card-library.tsx#L12)

분기 조건과 가능한 갈림길:

- B-dfb23035e154 · ConditionalExpression · entries.length → truthy / falsy; 바깥 조건: truthy: !filtered.length (85행).
- B-0b63ca331c7f · ConditionalExpression · entries.length → truthy / falsy; 바깥 조건: truthy: !filtered.length (87행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | 별도 조건식 없음 | useViewContext(data, 'material-cards:query', '', isViewText)<br>call |
| 24행 | 별도 조건식 없음 | useViewContext(data, 'material-cards:page', 0, isViewPage)<br>call |
| 25행 | 별도 조건식 없음 | useViewContext(data, 'material-cards:opened', null, (value): value is string \| null => value === null \|\| typeof value === 'string')<br>call<br>전달 콜백: H-3c4e0521d89d |
| 31행 | 별도 조건식 없음 | useMemo(() => (data.studyMaterials ?? []) .filter( (m) => !m.deletedAt && m.userId === data.userId && m.namespace === data.namespace && data.subjects.some( (s) => s.id === m.subjectId && !s.deletedAt && (subjectIds === undefined \|\| subjectIds.includes(s.id)), ), ) .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) \|\| a.id.localeCompare(b.id)) .flatMap((material) => material.results.flatMap((result) => result.cards .filter((c) => !c.excluded) .map((card) => ({ material, result, card, id: [material.id, result.id, card.id].join(':'), })), ), ), [data, subjectIds])<br>call<br>전달 콜백: H-b7e7839a44a2 |
| 61행 | 별도 조건식 없음 | entries.filter(({ material, card }) => `${material.title} ${card.question} ${card.answer}` .toLocaleLowerCase() .includes(query.trim().toLocaleLowerCase()))<br>call<br>전달 콜백: H-6243908d7dd8 |
| 66행 | 별도 조건식 없음 | Math.max(1, Math.ceil(filtered.length / 20))<br>call |
| 66행 | 별도 조건식 없음 | Math.ceil(filtered.length / 20)<br>call |
| 67행 | 별도 조건식 없음 | Math.min(page, pages - 1)<br>call |
| 105행 | 별도 조건식 없음 | filtered.slice(current * 20, current * 20 + 20).map(({ material, result, card, id }) => ( <article key={`${id}:${material.version}`}> <p className="muted"> {material.title \|\| '제목 없는 자료'} · {new Date(result.at).toLocaleString('ko-KR')} </p> <Button variant="quiet" aria-expanded={opened === id} onClick={() => setOpened(opened === id ? null : id)} > <StudyResultText text={card.question} as="span" /> </Button> {opened === id && ( <> <StudyResultText text={card.answer} /> <details> <summary>원문 확인</summary> {result.segments .filter((s) => card.sourceIds.includes(s.id)) .map((s) => ( <p className="prose" key={s.id}> {s.text} {s.originalText !== undefined && ( <> <br /> 수정 전 원문 · {s.originalText} </> )} </p> ))} </details> <UseMaterialCard data={data … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-493dd53d2f93 |
| 105행 | 별도 조건식 없음 | filtered.slice(current * 20, current * 20 + 20)<br>call |

반환/조기 중단: 68행 <render> [별도 조건식 없음]

## H-3c4e0521d89d

**@callback:useViewContext** · [src/ui/material-card-library.tsx:29](../../../src/ui/material-card-library.tsx#L29)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b7e7839a44a2

**@callback:useMemo** · [src/ui/material-card-library.tsx:32](../../../src/ui/material-card-library.tsx#L32)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 33행 | 별도 조건식 없음 | (data.studyMaterials ?? [])<br>        .filter(<br>          (m) =><br>            !m.deletedAt &&<br>            m.userId === data.userId &&<br>            m.namespace === data.namespace &&<br>            data.subjects.some(<br>              (s) =><br>                s.id === m.subjectId &&<br>                !s.deletedAt &&<br>                (subjectIds === undefined \|\| subjectIds.includes(s.id)),<br>            ),<br>        )<br>        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) \|\| a.id.localeCompare(b.id))<br>        .flatMap((material) => material.results.flatMap((result) => result.cards .filter((c) => !c.excluded) .map((card) => ({ material, result, card, id: [material.id, result.id, card.id].join(':'), })), ))<br>mutation-request<br>전달 콜백: H-bb815af5085a |
| 33행 | 별도 조건식 없음 | (data.studyMaterials ?? [])<br>        .filter(<br>          (m) =><br>            !m.deletedAt &&<br>            m.userId === data.userId &&<br>            m.namespace === data.namespace &&<br>            data.subjects.some(<br>              (s) =><br>                s.id === m.subjectId &&<br>                !s.deletedAt &&<br>                (subjectIds === undefined \|\| subjectIds.includes(s.id)),<br>            ),<br>        )<br>        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) \|\| a.id.localeCompare(b.id))<br>mutation-request<br>전달 콜백: H-248683b20276 |
| 33행 | 별도 조건식 없음 | (data.studyMaterials ?? [])<br>        .filter((m) => !m.deletedAt && m.userId === data.userId && m.namespace === data.namespace && data.subjects.some( (s) => s.id === m.subjectId && !s.deletedAt && (subjectIds === undefined \|\| subjectIds.includes(s.id)), ))<br>call<br>전달 콜백: H-7f0820f98abf |

## H-7f0820f98abf

**@callback:(data.studyMaterials ?? [])
        .filter** · [src/ui/material-card-library.tsx:35](../../../src/ui/material-card-library.tsx#L35)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 39행 | truthy: !m.deletedAt &&<br>            m.userId === data.userId &&<br>            m.namespace === data.namespace | data.subjects.some((s) => s.id === m.subjectId && !s.deletedAt && (subjectIds === undefined \|\| subjectIds.includes(s.id)))<br>call<br>전달 콜백: H-67fc6e450c2b |

## H-67fc6e450c2b

**@callback:data.subjects.some** · [src/ui/material-card-library.tsx:40](../../../src/ui/material-card-library.tsx#L40)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 43행 | truthy: !m.deletedAt &&<br>            m.userId === data.userId &&<br>            m.namespace === data.namespace ∧ truthy: s.id === m.subjectId &&<br>                !s.deletedAt ∧ falsy: subjectIds === undefined | subjectIds.includes(s.id)<br>call |

## H-248683b20276

**@callback:(data.studyMaterials ?? [])
        .filter(
          (m) =>
            !m.deletedAt &&
            m.userId === data.userId &&
            m.namespace === data.namespace &&
            data.subjects.some(
              (s) =>
                s.id === m.subjectId &&
                !s.deletedAt &&
                (subjectIds === undefined || subjectIds.includes(s.id)),
            ),
        )
        .sort** · [src/ui/material-card-library.tsx:46](../../../src/ui/material-card-library.tsx#L46)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 46행 | 별도 조건식 없음 | b.updatedAt.localeCompare(a.updatedAt)<br>call |
| 46행 | falsy: b.updatedAt.localeCompare(a.updatedAt) | a.id.localeCompare(b.id)<br>call |

## H-bb815af5085a

**@callback:(data.studyMaterials ?? [])
        .filter(
          (m) =>
            !m.deletedAt &&
            m.userId === data.userId &&
            m.namespace === data.namespace &&
            data.subjects.some(
              (s) =>
                s.id === m.subjectId &&
                !s.deletedAt &&
                (subjectIds === undefined || subjectIds.includes(s.id)),
            ),
        )
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id))
        .flatMap** · [src/ui/material-card-library.tsx:47](../../../src/ui/material-card-library.tsx#L47)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 48행 | 별도 조건식 없음 | material.results.flatMap((result) => result.cards .filter((c) => !c.excluded) .map((card) => ({ material, result, card, id: [material.id, result.id, card.id].join(':'), })))<br>call<br>전달 콜백: H-4abd31df84bb |

## H-4abd31df84bb

**@callback:material.results.flatMap** · [src/ui/material-card-library.tsx:48](../../../src/ui/material-card-library.tsx#L48)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 49행 | 별도 조건식 없음 | result.cards<br>              .filter((c) => !c.excluded)<br>              .map((card) => ({ material, result, card, id: [material.id, result.id, card.id].join(':'), }))<br>call<br>전달 콜백: H-e0cdc3239aee |
| 49행 | 별도 조건식 없음 | result.cards<br>              .filter((c) => !c.excluded)<br>call<br>전달 콜백: H-0091cd6b533d |

## H-0091cd6b533d

**@callback:result.cards
              .filter** · [src/ui/material-card-library.tsx:50](../../../src/ui/material-card-library.tsx#L50)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e0cdc3239aee

**@callback:result.cards
              .filter((c) => !c.excluded)
              .map** · [src/ui/material-card-library.tsx:51](../../../src/ui/material-card-library.tsx#L51)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 55행 | 별도 조건식 없음 | [material.id, result.id, card.id].join(':')<br>call |

## H-6243908d7dd8

**@callback:entries.filter** · [src/ui/material-card-library.tsx:61](../../../src/ui/material-card-library.tsx#L61)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 62행 | 별도 조건식 없음 | `${material.title} ${card.question} ${card.answer}`<br>        .toLocaleLowerCase()<br>        .includes(query.trim().toLocaleLowerCase())<br>call |
| 62행 | 별도 조건식 없음 | `${material.title} ${card.question} ${card.answer}`<br>        .toLocaleLowerCase()<br>call |
| 64행 | 별도 조건식 없음 | query.trim().toLocaleLowerCase()<br>call |
| 64행 | 별도 조건식 없음 | query.trim()<br>call |

## H-d4c3323a4c15

**@onChange** · [src/ui/material-card-library.tsx:78](../../../src/ui/material-card-library.tsx#L78)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 79행 | 별도 조건식 없음 | setQuery(e.target.value)<br>state-update |
| 80행 | 별도 조건식 없음 | setPage(0)<br>state-update |

## H-6d1396283c11

**@onClick** · [src/ui/material-card-library.tsx:94](../../../src/ui/material-card-library.tsx#L94)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 95행 | truthy: !filtered.length ∧ truthy: query | setQuery('')<br>state-update |
| 96행 | truthy: !filtered.length ∧ truthy: query | setPage(0)<br>state-update |

## H-493dd53d2f93

**@callback:filtered.slice(current * 20, current * 20 + 20).map** · [src/ui/material-card-library.tsx:105](../../../src/ui/material-card-library.tsx#L105)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 108행 | 별도 조건식 없음 | new Date(result.at).toLocaleString('ko-KR')<br>call |
| 122행 | truthy: opened === id | result.segments<br>                  .filter((s) => card.sourceIds.includes(s.id))<br>                  .map((s) => ( <p className="prose" key={s.id}> {s.text} {s.originalText !== undefined && ( <> <br /> 수정 전 원문 · {s.originalText} </> )} </p> ))<br>call<br>전달 콜백: H-e2f384a7ab66 |
| 122행 | truthy: opened === id | result.segments<br>                  .filter((s) => card.sourceIds.includes(s.id))<br>call<br>전달 콜백: H-5e1e5b149e52 |

## H-1d93f43346c2

**@onClick** · [src/ui/material-card-library.tsx:113](../../../src/ui/material-card-library.tsx#L113)

분기 조건과 가능한 갈림길:

- B-70bcce3d0f45 · ConditionalExpression · opened === id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (113행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 113행 | 별도 조건식 없음 | setOpened(opened === id ? null : id)<br>state-update |

## H-5e1e5b149e52

**@callback:result.segments
                  .filter** · [src/ui/material-card-library.tsx:123](../../../src/ui/material-card-library.tsx#L123)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 123행 | truthy: opened === id | card.sourceIds.includes(s.id)<br>call |

## H-e2f384a7ab66

**@callback:result.segments
                  .filter((s) => card.sourceIds.includes(s.id))
                  .map** · [src/ui/material-card-library.tsx:124](../../../src/ui/material-card-library.tsx#L124)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d8dbec72a362

**@onClick** · [src/ui/material-card-library.tsx:151](../../../src/ui/material-card-library.tsx#L151)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 151행 | truthy: pages > 1 | setPage(current - 1)<br>state-update |

## H-faf9d10ca2da

**@onClick** · [src/ui/material-card-library.tsx:157](../../../src/ui/material-card-library.tsx#L157)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 157행 | truthy: pages > 1 | setPage(current + 1)<br>state-update |

## H-6a536875a2dd

**MemoryCardOrigin** · [src/ui/material-card-library.tsx:165](../../../src/ui/material-card-library.tsx#L165)

분기 조건과 가능한 갈림길:

- B-4e7448bed813 · IfStatement · !source → truthy / falsy; 바깥 조건: 별도 조건식 없음 (167행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 168행 | 별도 조건식 없음 | sourceRevision(data, 'studyMaterials', source.materialId, source.materialVersion)<br>call |

반환/조기 중단: 167행 null [truthy: !source]; 176행 <render> [별도 조건식 없음]

