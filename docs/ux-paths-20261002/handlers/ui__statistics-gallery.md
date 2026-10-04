# src/ui/statistics-gallery.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-f8d0d3b33bd5

**ChartValues** · [src/ui/statistics-gallery.tsx:16](../../../src/ui/statistics-gallery.tsx#L16)

분기 조건과 가능한 갈림길:

- B-fbf661a2f695 · IfStatement · !figure.rows.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (31행).
- B-fb497a86b9ff · ConditionalExpression · all → truthy / falsy; 바깥 조건: truthy: opened || expanded (52행).
- B-8c125b75d1ca · ConditionalExpression · all → truthy / falsy; 바깥 조건: truthy: (opened || expanded) && figure.rows.length > 20 (88행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 29행 | 별도 조건식 없음 | useState(false)<br>call |
| 30행 | 별도 조건식 없음 | useState(expanded)<br>call |
| 45행 | truthy: opened \|\| expanded | figure.columns.map((column) => ( <th key={column}>{column}</th> ))<br>call<br>전달 콜백: H-35c1baa46727 |
| 52행 | truthy: opened \|\| expanded | figure.rows.slice(0, all ? undefined : 20).map((row) => ( <tr key={row.label} data-shared-selected={sharedMatch ? row.items.some(sharedMatch) : undefined} > <th scope="row"> {row.label} {sharedMatch && row.items.some(sharedMatch) && ( <span className="statistics-selection-mark"> · 함께 선택됨</span> )} </th> {row.values.map((value, j) => ( <td key={figure.columns[j + 1]}>{value}</td> ))} <td> <Button variant="quiet" onClick={() => onOpen(row)}> 기록 보기 </Button> {onSelect && ( <Button variant="quiet" aria-pressed={Boolean(sharedMatch && row.items.some(sharedMatch))} onClick={() => onSelect(row)} > 함께 선택 </Button> )} </td> </tr> ))<br>call<br>전달 콜백: H-99c948d40c99 |
| 52행 | truthy: opened \|\| expanded | figure.rows.slice(0, all ? undefined : 20)<br>call |

반환/조기 중단: 31행 null [truthy: !figure.rows.length]; 32행 <render> [별도 조건식 없음]

## H-1748d166fb13

**@onToggle** · [src/ui/statistics-gallery.tsx:36](../../../src/ui/statistics-gallery.tsx#L36)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 36행 | 별도 조건식 없음 | setOpened(event.currentTarget.open)<br>state-update |

## H-35c1baa46727

**@callback:figure.columns.map** · [src/ui/statistics-gallery.tsx:45](../../../src/ui/statistics-gallery.tsx#L45)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-99c948d40c99

**@callback:figure.rows.slice(0, all ? undefined : 20).map** · [src/ui/statistics-gallery.tsx:52](../../../src/ui/statistics-gallery.tsx#L52)

분기 조건과 가능한 갈림길:

- B-4b08bea040b7 · ConditionalExpression · sharedMatch → truthy / falsy; 바깥 조건: truthy: opened || expanded (55행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 55행 | truthy: opened \|\| expanded ∧ truthy: sharedMatch | row.items.some(sharedMatch)<br>call |
| 59행 | truthy: opened \|\| expanded ∧ truthy: sharedMatch | row.items.some(sharedMatch)<br>call |
| 63행 | truthy: opened \|\| expanded | row.values.map((value, j) => ( <td key={figure.columns[j + 1]}>{value}</td> ))<br>call<br>전달 콜백: H-059d1b511936 |
| 73행 | truthy: opened \|\| expanded ∧ truthy: onSelect | Boolean(sharedMatch && row.items.some(sharedMatch))<br>call |
| 73행 | truthy: opened \|\| expanded ∧ truthy: onSelect ∧ truthy: sharedMatch | row.items.some(sharedMatch)<br>call |

## H-059d1b511936

**@callback:row.values.map** · [src/ui/statistics-gallery.tsx:63](../../../src/ui/statistics-gallery.tsx#L63)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-39978de30b4c

**@onClick** · [src/ui/statistics-gallery.tsx:67](../../../src/ui/statistics-gallery.tsx#L67)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 67행 | truthy: opened \|\| expanded | onOpen(row)<br>call |

## H-06f353d6a79c

**@onClick** · [src/ui/statistics-gallery.tsx:74](../../../src/ui/statistics-gallery.tsx#L74)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 74행 | truthy: opened \|\| expanded ∧ truthy: onSelect | onSelect(row)<br>call |

## H-198d38fb8611

**@onClick** · [src/ui/statistics-gallery.tsx:87](../../../src/ui/statistics-gallery.tsx#L87)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 87행 | truthy: (opened \|\| expanded) && figure.rows.length > 20 | setAll((value) => !value)<br>state-update<br>전달 콜백: H-bce4424318db |

## H-bce4424318db

**@callback:setAll** · [src/ui/statistics-gallery.tsx:87](../../../src/ui/statistics-gallery.tsx#L87)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-dfbc858afe0a

**StatisticsGallery** · [src/ui/statistics-gallery.tsx:127](../../../src/ui/statistics-gallery.tsx#L127)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 140행 | 별도 조건식 없음 | useMemo(() => overview.map((o) => chartFigure({ ...context, metricId: o.metric }, o.kind)), [context])<br>call<br>전달 콜백: H-bc54378a48b2 |
| 157행 | 별도 조건식 없음 | overview.map((item, i) => ( <Card key={item.kind} className="statistics-gallery-card" role="region" aria-label={item.title} > <div className="section-heading"> <h3>{item.title}</h3> <span className="muted">{chartNames[item.kind]}</span> </div> <p className="muted">{item.detail}</p> {context.metrics.length && context.data && ( <StatisticsPlot figure={figures[i]} small onOpen={onOpen} selectedRows={selectedChartRows(figures[i], sharedMatch)} /> )} <Button variant="quiet" onClick={() => onChoose(item.kind, item.metric)}> 이 그래프 자세히 보기 </Button> {sharedMatch && ( <p className="statistics-selection-count"> 선택된 근거{' '} { uniqueStatisticSources( figures[i].rows.flatMap((row) => row.items.filter(sharedMatch)), ). … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-9cbc462892e2 |

반환/조기 중단: 144행 <render> [별도 조건식 없음]

## H-bc54378a48b2

**@callback:useMemo** · [src/ui/statistics-gallery.tsx:141](../../../src/ui/statistics-gallery.tsx#L141)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 141행 | 별도 조건식 없음 | overview.map((o) => chartFigure({ ...context, metricId: o.metric }, o.kind))<br>call<br>전달 콜백: H-62e6c7ace28f |

## H-62e6c7ace28f

**@callback:overview.map** · [src/ui/statistics-gallery.tsx:141](../../../src/ui/statistics-gallery.tsx#L141)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 141행 | 별도 조건식 없음 | chartFigure({ ...context, metricId: o.metric }, o.kind)<br>call |

## H-9cbc462892e2

**@callback:overview.map** · [src/ui/statistics-gallery.tsx:157](../../../src/ui/statistics-gallery.tsx#L157)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 174행 | truthy: context.metrics.length && context.data | selectedChartRows(figures[i], sharedMatch)<br>call |
| 184행 | truthy: sharedMatch | uniqueStatisticSources(figures[i].rows.flatMap((row) => row.items.filter(sharedMatch)))<br>call |
| 185행 | truthy: sharedMatch | figures[i].rows.flatMap((row) => row.items.filter(sharedMatch))<br>call<br>전달 콜백: H-6f99647d40c4 |
| 189행 | truthy: sharedMatch | uniqueStatisticSources(figures[i].rows.flatMap((row) => row.items))<br>call |
| 189행 | truthy: sharedMatch | figures[i].rows.flatMap((row) => row.items)<br>call<br>전달 콜백: H-498b381d171e |

## H-0e1d7cfdcaef

**@onClick** · [src/ui/statistics-gallery.tsx:177](../../../src/ui/statistics-gallery.tsx#L177)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 177행 | 별도 조건식 없음 | onChoose(item.kind, item.metric)<br>call |

## H-6f99647d40c4

**@callback:figures[i].rows.flatMap** · [src/ui/statistics-gallery.tsx:185](../../../src/ui/statistics-gallery.tsx#L185)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 185행 | truthy: sharedMatch | row.items.filter(sharedMatch)<br>call |

## H-498b381d171e

**@callback:figures[i].rows.flatMap** · [src/ui/statistics-gallery.tsx:189](../../../src/ui/statistics-gallery.tsx#L189)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

