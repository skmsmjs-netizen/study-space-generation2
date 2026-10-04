# src/ui/statistics-plot.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-8d8645f6a9a2

**StatisticsPlot** · [src/ui/statistics-plot.tsx:6](../../../src/ui/statistics-plot.tsx#L6)

분기 조건과 가능한 갈림길:

- B-b95da6707775 · ConditionalExpression · selectedRows === null → truthy / falsy; 바깥 조건: 별도 조건식 없음 (23행).
- B-fef700472f4a · IfStatement · figure.reason → truthy / falsy; 바깥 조건: 별도 조건식 없음 (287행).
- B-05ab0ed06449 · ConditionalExpression · selectedRows → truthy / falsy; 바깥 조건: 별도 조건식 없음 (292행).
- B-15f8dddbf7c6 · ConditionalExpression · importFailure → truthy / falsy; 바깥 조건: truthy: error (314행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 19행 | 별도 조건식 없음 | useRef(Promise.resolve())<br>call |
| 19행 | 별도 조건식 없음 | Promise.resolve()<br>call |
| 20행 | 별도 조건식 없음 | useRef(selectedRows)<br>call |
| 22행 | 별도 조건식 없음 | useRef(null)<br>call |
| 23행 | falsy: selectedRows === null | selectedRows.map(Number).join('')<br>call |
| 23행 | falsy: selectedRows === null | selectedRows.map(Number)<br>call |
| 24행 | 별도 조건식 없음 | useRef(selectionKey)<br>call |
| 25행 | 별도 조건식 없음 | useRef(null)<br>call |
| 26행 | 별도 조건식 없음 | useRef(onOpen)<br>call |
| 27행 | 별도 조건식 없음 | useRef(figure)<br>call |
| 30행 | 별도 조건식 없음 | useState(false)<br>call |
| 31행 | 별도 조건식 없음 | useState('')<br>call |
| 32행 | 별도 조건식 없음 | useState(0)<br>call |
| 33행 | 별도 조건식 없음 | useState(false)<br>call |
| 35행 | 별도 조건식 없음 | useEffect(() => { const element = host.current; if (!element \|\| figure.reason) return; let active = true, plot: typeof import('plotly.js-dist-min') \| undefined, observed = false; let cleanupTheme: (() => void) \| undefined; const render = async () => { try { const imported = await import('plotly.js-dist-min'); plot = imported.default; if (!active) return; const style = getComputedStyle(element), color = (name: string) => style.getPropertyValue(name).trim(); const colors = [ color('--color-primary'), color('--color-border-strong'), color('--color-muted'), color('--color-text'), ]; const traces = structuredClone(figure.traces) as Data[]; for (const trace of traces) { const t = trace as unknown as Record< … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-4912f5b64d8a |
| 281행 | 별도 조건식 없음 | useEffect(() => { if (previousSelectionKey.current === selectionKey) return; previousSelectionKey.current = selectionKey; // React against the existing Plotly scene so selection does not purge the user's zoom. redrawSelection.current?.(); }, [selectionKey])<br>call<br>전달 콜백: H-fc448a3e0437 |
| 296행 | truthy: selectedRows | selectedRows.filter(Boolean)<br>call |

반환/조기 중단: 287행 <render> [truthy: figure.reason]; 288행 <render> [별도 조건식 없음]

## H-4912f5b64d8a

**@callback:useEffect** · [src/ui/statistics-plot.tsx:35](../../../src/ui/statistics-plot.tsx#L35)

분기 조건과 가능한 갈림길:

- B-6511ff718ac7 · IfStatement · !element || figure.reason → truthy / falsy; 바깥 조건: 별도 조건식 없음 (37행).
- B-8f99d248bc04 · ConditionalExpression · typeof IntersectionObserver === 'undefined' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (228행).
- B-d98bc5af6de3 · IfStatement · observer → truthy / falsy; 바깥 조건: 별도 조건식 없음 (239행).
- B-d3b0a30b7cbc · ConditionalExpression · typeof ResizeObserver === 'undefined' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (245행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 239행 | truthy: observer | observer.observe(element)<br>call |
| 242행 | falsy: observer | render()<br>call → [H-e639a4be4abc](ui__statistics-plot.md#h-e639a4be4abc) |
| 260행 | 별도 조건식 없음 | theme.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'], })<br>call |
| 270행 | 별도 조건식 없음 | setReady(false)<br>state-update |

반환/조기 중단: 37행 <render> [truthy: !element || figure.reason]; 271행 () => { active = false; redrawSelection.current = null; observer?.disconnect(); resize?.disconnect(); theme.disconnect(); cleanupTheme?.(); if (plot) plot.purge(element); } [별도 조건식 없음]

## H-e639a4be4abc

**render** · [src/ui/statistics-plot.tsx:42](../../../src/ui/statistics-plot.tsx#L42) · async

분기 조건과 가능한 갈림길:

- B-0940f62307dd · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (43행).
- B-356d003ef66b · IfStatement · !active → truthy / falsy; 바깥 조건: 별도 조건식 없음 (46행).
- B-4fab776e34b6 · IfStatement · t.type === 'heatmap' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (58행).
- B-17b5cfd1dc53 · IfStatement · t.type === 'sankey' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (66행).
- B-2fc628abb584 · IfStatement · t.type === 'waterfall' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (70행).
- B-234934b99158 · IfStatement · selectedRows → truthy / falsy; 바깥 조건: 별도 조건식 없음 (78행).
- B-4ba376d85d3a · IfStatement · t.type === 'scatter' || t.type === 'bar' → truthy / falsy; 바깥 조건: truthy: selectedRows (81행).
- B-fcee27cfd25e · IfStatement · figure.kind === 'stacked-bar' → truthy / falsy; 바깥 조건: truthy: selectedRows ∧ truthy: t.type === 'scatter' || t.type === 'bar' (82행).
- B-a19ca86c25ff · ConditionalExpression · selectedRows[index] → truthy / falsy; 바깥 조건: truthy: selectedRows ∧ truthy: t.type === 'scatter' || t.type === 'bar' ∧ truthy: figure.kind === 'stacked-bar' (82행).
- B-fab6c9694ea5 · IfStatement · t.type === 'pie' → truthy / falsy; 바깥 조건: truthy: selectedRows ∧ falsy: t.type === 'scatter' || t.type === 'bar' (88행).
- B-1decc4dd7c87 · IfStatement · figure.kind === 'heatmap' → truthy / falsy; 바깥 조건: truthy: selectedRows (91행).
- B-76167e8870fa · ConditionalExpression · small → truthy / falsy; 바깥 조건: 별도 조건식 없음 (116행).
- B-0ff4b9edc381 · ConditionalExpression · small → truthy / falsy; 바깥 조건: 별도 조건식 없음 (117행).
- B-18b9485da83c · ConditionalExpression · small → truthy / falsy; 바깥 조건: 별도 조건식 없음 (117행).
- B-8efc2eb06b0f · ConditionalExpression · small → truthy / falsy; 바깥 조건: 별도 조건식 없음 (117행).
- B-6fe27bfd7353 · IfStatement · cursor !== null && ['line', 'area', 'mixed', 'stacked-area'].includes(figure.kind) && cursor >= 0 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (139행).
- B-4a2d1b3f39bb · IfStatement · date → truthy / falsy; 바깥 조건: truthy: cursor !== null &&
          ['line', 'area', 'mixed', 'stacked-area'].includes(figure.kind) &&
          cursor >= 0 (145행).
- B-01bc30a0ae2e · IfStatement · ['line', 'area', 'mixed', 'stacked-area', 'heatmap'].includes(figure.kind) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (166행).
- B-58b99af7d2d0 · ConditionalExpression · axis === 'xaxis' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (169행).
- B-507d8cd4a453 · IfStatement · samples.length && samples.every((v) => Number.isInteger(v)) && Math.max(...samples) <= 5 && Math.min(...samples) >= 0 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (173행).
- B-ae4add9ea84f · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (214행).
- B-9553476d3c56 · IfStatement · active → truthy / falsy; 바깥 조건: exception: exception (215행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 47행 | 별도 조건식 없음 | getComputedStyle(element)<br>call |
| 50행 | 별도 조건식 없음 | color('--color-primary')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 51행 | 별도 조건식 없음 | color('--color-border-strong')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 52행 | 별도 조건식 없음 | color('--color-muted')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 53행 | 별도 조건식 없음 | color('--color-text')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 55행 | 별도 조건식 없음 | structuredClone(figure.traces)<br>call |
| 59행 | truthy: t.type === 'heatmap' | Object.assign(t, { colorscale: [ [0, color('--color-surface')], [1, color('--color-primary')], ], showscale: !small, })<br>call |
| 61행 | truthy: t.type === 'heatmap' | color('--color-surface')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 62행 | truthy: t.type === 'heatmap' | color('--color-primary')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 68행 | truthy: t.type === 'sankey' | (node.label as string[]).map((_, i) => colors[i % colors.length])<br>call<br>전달 콜백: H-70c1c35b2fc5 |
| 71행 | truthy: t.type === 'waterfall' | Object.assign(t, { increasing: { marker: { color: colors[0] } }, decreasing: { marker: { color: colors[2] } }, totals: { marker: { color: colors[3] } }, })<br>call |
| 79행 | truthy: selectedRows | traces.entries()<br>call |
| 86행 | truthy: selectedRows ∧ truthy: t.type === 'scatter' \|\| t.type === 'bar' ∧ falsy: figure.kind === 'stacked-bar' | selectedRows.map((selected) => (selected ? 1 : 0.25))<br>call<br>전달 콜백: H-86f93e8b6c23 |
| 89행 | truthy: selectedRows ∧ falsy: t.type === 'scatter' \|\| t.type === 'bar' ∧ truthy: t.type === 'pie' | selectedRows.map((selected) => (selected ? 0.06 : 0))<br>call<br>전달 콜백: H-89657c169ef2 |
| 95행 | truthy: selectedRows ∧ truthy: figure.kind === 'heatmap' | selectedRows.flatMap((on, index) => on ? [{ x: xs[index % xs.length], y: ys[Math.floor(index / xs.length)] }] : [])<br>call<br>전달 콜백: H-02070d8ca311 |
| 98행 | truthy: selectedRows ∧ truthy: figure.kind === 'heatmap' | traces.push({ type: 'scatter', mode: 'markers', name: '함께 선택된 근거', x: selected.map((p) => p.x), y: selected.map((p) => p.y), hoverinfo: 'skip', marker: { symbol: 'square-open', size: 18, color: color('--color-text'), line: { width: 2 }, }, })<br>call |
| 102행 | truthy: selectedRows ∧ truthy: figure.kind === 'heatmap' | selected.map((p) => p.x)<br>call<br>전달 콜백: H-827476c11cdd |
| 103행 | truthy: selectedRows ∧ truthy: figure.kind === 'heatmap' | selected.map((p) => p.y)<br>call<br>전달 콜백: H-ffcde8fb5b71 |
| 108행 | truthy: selectedRows ∧ truthy: figure.kind === 'heatmap' | color('--color-text')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 118행 | 별도 조건식 없음 | color('--color-surface')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 119행 | 별도 조건식 없음 | color('--color-surface')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 120행 | 별도 조건식 없음 | color('--color-text')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 126행 | 별도 조건식 없음 | color('--color-border')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 127행 | 별도 조건식 없음 | color('--color-border')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 131행 | 별도 조건식 없음 | color('--color-border')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 132행 | 별도 조건식 없음 | color('--color-border')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 136행 | 별도 조건식 없음 | figure.columns.join('\|')<br>call |
| 141행 | truthy: cursor !== null | ['line', 'area', 'mixed', 'stacked-area'].includes(figure.kind)<br>call |
| 161행 | 별도 조건식 없음 | color('--color-border')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 162행 | 별도 조건식 없음 | color('--color-border')<br>call → [H-952d04d7e8fa](ui__statistics-plot.md#h-952d04d7e8fa) |
| 166행 | 별도 조건식 없음 | ['line', 'area', 'mixed', 'stacked-area', 'heatmap'].includes(figure.kind)<br>call |
| 170행 | 별도 조건식 없음 | traces<br>            .flatMap((t) => ((t as unknown as Record<string, unknown>)[key] as unknown[]) ?? [])<br>            .filter((v) => typeof v === 'number')<br>call<br>전달 콜백: H-d983aca4f483 |
| 170행 | 별도 조건식 없음 | traces<br>            .flatMap((t) => ((t as unknown as Record<string, unknown>)[key] as unknown[]) ?? [])<br>call<br>전달 콜백: H-4f65f9aa4fe6 |
| 175행 | truthy: samples.length | samples.every((v) => Number.isInteger(v))<br>call<br>전달 콜백: H-c2500c9e1c62 |
| 176행 | truthy: samples.length &&<br>            samples.every((v) => Number.isInteger(v)) | Math.max(...samples)<br>call |
| 177행 | truthy: samples.length &&<br>            samples.every((v) => Number.isInteger(v)) &&<br>            Math.max(...samples) <= 5 | Math.min(...samples)<br>call |
| 182행 | 별도 조건식 없음 | queue.current<br>          .catch(() => {})<br>          .then(async () => { if (!active) return; await engine.react(element, traces, layout, { responsive: true, displaylogo: false, displayModeBar: false, scrollZoom: false, }); if (!active) return; const plotted = element as HTMLDivElement & PlotlyHTMLElement; plotted.removeAllListeners?.('plotly_click'); plotted.on('plotly_click', (event) => { const point = event.points[0]; if (!point) return; if ( ['sankey', 'treemap', 'radar', 'histogram', 'heatmap', 'box'].includes( model.current.kind, ) ) return; const index = model.current.kind === 'stacked-bar' ? point.curveNumber : point.pointNumber; if (typeof index === 'number' && model.current.rows[index]) callback.current?.(model.current.rows[index]); }); se … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-aa164d2db2dc |
| 182행 | 별도 조건식 없음 | queue.current<br>          .catch(() => {})<br>call<br>전달 콜백: H-43a978b8a781 |
| 216행 | exception: exception ∧ truthy: active | setImportFailure(!plot)<br>state-update |
| 217행 | exception: exception ∧ truthy: active | setError('그래프를 그리지 못했습니다. 목록에서 같은 값과 원기록을 확인하거나 다시 시도해 주세요.')<br>state-update |
| 220행 | exception: exception ∧ truthy: active | setReady(false)<br>state-update |

반환/조기 중단: 46행 <render> [truthy: !active]

## H-952d04d7e8fa

**color** · [src/ui/statistics-plot.tsx:48](../../../src/ui/statistics-plot.tsx#L48)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 48행 | 별도 조건식 없음 | style.getPropertyValue(name).trim()<br>call |
| 48행 | 별도 조건식 없음 | style.getPropertyValue(name)<br>call |

## H-70c1c35b2fc5

**@callback:(node.label as string[]).map** · [src/ui/statistics-plot.tsx:68](../../../src/ui/statistics-plot.tsx#L68)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-86f93e8b6c23

**@callback:selectedRows.map** · [src/ui/statistics-plot.tsx:86](../../../src/ui/statistics-plot.tsx#L86)

분기 조건과 가능한 갈림길:

- B-86a779348510 · ConditionalExpression · selected → truthy / falsy; 바깥 조건: truthy: selectedRows ∧ truthy: t.type === 'scatter' || t.type === 'bar' ∧ falsy: figure.kind === 'stacked-bar' (86행).

## H-89657c169ef2

**@callback:selectedRows.map** · [src/ui/statistics-plot.tsx:89](../../../src/ui/statistics-plot.tsx#L89)

분기 조건과 가능한 갈림길:

- B-65b5ead22127 · ConditionalExpression · selected → truthy / falsy; 바깥 조건: truthy: selectedRows ∧ falsy: t.type === 'scatter' || t.type === 'bar' ∧ truthy: t.type === 'pie' (89행).

## H-02070d8ca311

**@callback:selectedRows.flatMap** · [src/ui/statistics-plot.tsx:95](../../../src/ui/statistics-plot.tsx#L95)

분기 조건과 가능한 갈림길:

- B-06a13637a77b · ConditionalExpression · on → truthy / falsy; 바깥 조건: truthy: selectedRows ∧ truthy: figure.kind === 'heatmap' (96행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 96행 | truthy: selectedRows ∧ truthy: figure.kind === 'heatmap' ∧ truthy: on | Math.floor(index / xs.length)<br>call |

## H-827476c11cdd

**@callback:selected.map** · [src/ui/statistics-plot.tsx:102](../../../src/ui/statistics-plot.tsx#L102)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ffcde8fb5b71

**@callback:selected.map** · [src/ui/statistics-plot.tsx:103](../../../src/ui/statistics-plot.tsx#L103)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4f65f9aa4fe6

**@callback:traces
            .flatMap** · [src/ui/statistics-plot.tsx:171](../../../src/ui/statistics-plot.tsx#L171)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d983aca4f483

**@callback:traces
            .flatMap((t) => ((t as unknown as Record<string, unknown>)[key] as unknown[]) ?? [])
            .filter** · [src/ui/statistics-plot.tsx:172](../../../src/ui/statistics-plot.tsx#L172)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c2500c9e1c62

**@callback:samples.every** · [src/ui/statistics-plot.tsx:175](../../../src/ui/statistics-plot.tsx#L175)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 175행 | truthy: samples.length | Number.isInteger(v)<br>call |

## H-43a978b8a781

**@callback:queue.current
          .catch** · [src/ui/statistics-plot.tsx:183](../../../src/ui/statistics-plot.tsx#L183)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-aa164d2db2dc

**@callback:queue.current
          .catch(() => {})
          .then** · [src/ui/statistics-plot.tsx:184](../../../src/ui/statistics-plot.tsx#L184) · async

분기 조건과 가능한 갈림길:

- B-18e29caa1e19 · IfStatement · !active → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: queue.current
          .catch(() => {}) (185행).
- B-00e54b7204ae · IfStatement · !active → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: queue.current
          .catch(() => {}) (192행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 186행 | fulfilled-or-explicit-rejection-handler: queue.current<br>          .catch(() => {}) | engine.react(element, traces, layout, { responsive: true, displaylogo: false, displayModeBar: false, scrollZoom: false, })<br>call |
| 195행 | fulfilled-or-explicit-rejection-handler: queue.current<br>          .catch(() => {}) | plotted.on('plotly_click', (event) => { const point = event.points[0]; if (!point) return; if ( ['sankey', 'treemap', 'radar', 'histogram', 'heatmap', 'box'].includes( model.current.kind, ) ) return; const index = model.current.kind === 'stacked-bar' ? point.curveNumber : point.pointNumber; if (typeof index === 'number' && model.current.rows[index]) callback.current?.(model.current.rows[index]); })<br>call<br>전달 콜백: H-ecafbb459bde |
| 209행 | fulfilled-or-explicit-rejection-handler: queue.current<br>          .catch(() => {}) | setError('')<br>state-update |
| 210행 | fulfilled-or-explicit-rejection-handler: queue.current<br>          .catch(() => {}) | setImportFailure(false)<br>state-update |
| 211행 | fulfilled-or-explicit-rejection-handler: queue.current<br>          .catch(() => {}) | setReady(true)<br>state-update |

반환/조기 중단: 185행 <render> [fulfilled-or-explicit-rejection-handler: queue.current
          .catch(() => {}) ∧ truthy: !active]; 192행 <render> [fulfilled-or-explicit-rejection-handler: queue.current
          .catch(() => {}) ∧ truthy: !active]

## H-ecafbb459bde

**@callback:plotted.on** · [src/ui/statistics-plot.tsx:195](../../../src/ui/statistics-plot.tsx#L195)

분기 조건과 가능한 갈림길:

- B-036032777294 · IfStatement · !point → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: queue.current
          .catch(() => {}) (197행).
- B-0093a435c316 · IfStatement · ['sankey', 'treemap', 'radar', 'histogram', 'heatmap', 'box'].includes( model.current.kind, ) → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: queue.current
          .catch(() => {}) (198행).
- B-4a4daaa80a3c · ConditionalExpression · model.current.kind === 'stacked-bar' → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: queue.current
          .catch(() => {}) (205행).
- B-3867cd3aa314 · IfStatement · typeof index === 'number' && model.current.rows[index] → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: queue.current
          .catch(() => {}) (206행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 199행 | fulfilled-or-explicit-rejection-handler: queue.current<br>          .catch(() => {}) | ['sankey', 'treemap', 'radar', 'histogram', 'heatmap', 'box'].includes(model.current.kind)<br>call |

반환/조기 중단: 197행 <render> [fulfilled-or-explicit-rejection-handler: queue.current
          .catch(() => {}) ∧ truthy: !point]; 203행 <render> [fulfilled-or-explicit-rejection-handler: queue.current
          .catch(() => {}) ∧ truthy: ['sankey', 'treemap', 'radar', 'histogram', 'heatmap', 'box'].includes(
                  model.current.kind,
                )]

## H-fc448a3e0437

**@callback:useEffect** · [src/ui/statistics-plot.tsx:281](../../../src/ui/statistics-plot.tsx#L281)

분기 조건과 가능한 갈림길:

- B-9fadb8f955f6 · IfStatement · previousSelectionKey.current === selectionKey → truthy / falsy; 바깥 조건: 별도 조건식 없음 (282행).

반환/조기 중단: 282행 <render> [truthy: previousSelectionKey.current === selectionKey]

## H-1047828043f4

**@onClick** · [src/ui/statistics-plot.tsx:312](../../../src/ui/statistics-plot.tsx#L312)

분기 조건과 가능한 갈림길:

- B-947ae7f6bc89 · ConditionalExpression · importFailure → truthy / falsy; 바깥 조건: truthy: error (312행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 312행 | truthy: error ∧ truthy: importFailure | window.location.reload()<br>call |
| 312행 | truthy: error ∧ falsy: importFailure | setRetry((i) => i + 1)<br>state-update<br>전달 콜백: H-d85c4f31bb19 |

## H-d85c4f31bb19

**@callback:setRetry** · [src/ui/statistics-plot.tsx:312](../../../src/ui/statistics-plot.tsx#L312)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

