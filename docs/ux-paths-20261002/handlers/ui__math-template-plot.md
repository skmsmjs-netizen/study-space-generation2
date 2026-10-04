# src/ui/math-template-plot.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-d0b47846eb13

**MathTemplatePlot** · [src/ui/math-template-plot.tsx:30](../../../src/ui/math-template-plot.tsx#L30)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 43행 | 별도 조건식 없음 | useRef(onView)<br>call |
| 45행 | 별도 조건식 없음 | useRef(initialView)<br>call |
| 46행 | 별도 조건식 없음 | useRef('')<br>call |
| 47행 | 별도 조건식 없음 | useRef({ ...defaultMathCamera(), ...initialView?.camera, projection: { type: 'orthographic' }, })<br>call |
| 48행 | 별도 조건식 없음 | defaultMathCamera()<br>call → [H-1b3a7af48194](ui__math-plot-camera.md#h-1b3a7af48194) |
| 52행 | 별도 조건식 없음 | useRef(null)<br>call |
| 53행 | 별도 조건식 없음 | useRef(null)<br>call |
| 54행 | 별도 조건식 없음 | useState('')<br>call |
| 55행 | 별도 조건식 없음 | useState(false)<br>call |
| 56행 | 별도 조건식 없음 | useState(0)<br>call |
| 57행 | 별도 조건식 없음 | useState(0)<br>call |
| 58행 | 별도 조건식 없음 | useRef(null)<br>call |
| 59행 | 별도 조건식 없음 | useMathPlotTouch(host, zoom, pan)<br>call |
| 60행 | 별도 조건식 없음 | useEffect(() => { const observer = new MutationObserver(() => setTheme((v) => v + 1)); observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'], }); const media = matchMedia('(prefers-color-scheme: dark)'), changed = () => setTheme((v) => v + 1); media.addEventListener('change', changed); return () => { observer.disconnect(); media.removeEventListener('change', changed); }; }, [])<br>call<br>전달 콜백: H-4b6cd38a291b |
| 75행 | 별도 조건식 없음 | useEffect(() => { const node = host.current; if (!node) return; let infinite: { update: () => void; dispose: () => void } \| undefined; let world: ReturnType<typeof prepareUnboundedScene> \| undefined; let scaffoldIndex = 0; let active = true, frame = 0; const css = getComputedStyle(node), color = (name: string) => css.getPropertyValue(name).trim(); const curve = color('--color-math-curve'), secondary = color('--color-math-tangent'), gray = color('--color-muted'), grid = color('--color-border'), surfaceLow = color('--primitive-common-info-500'), surfaceHigh = color('--primitive-common-info-100'), background = color('--color-surface'), ink = color('--color-text'); const key = `${item.id}:${alternate}:${r … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-dada41b6a141 |
| 472행 | 별도 조건식 없음 | useEffect(() => { const node = host.current; return () => { if (node) Plotly.purge(node); }; }, [])<br>call<br>전달 콜백: H-9483c82349a6 |

반환/조기 중단: 478행 <render> [별도 조건식 없음]

## H-4b6cd38a291b

**@callback:useEffect** · [src/ui/math-template-plot.tsx:60](../../../src/ui/math-template-plot.tsx#L60)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 62행 | 별도 조건식 없음 | observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'], })<br>call |
| 66행 | 별도 조건식 없음 | matchMedia('(prefers-color-scheme: dark)')<br>call |
| 68행 | 별도 조건식 없음 | media.addEventListener('change', changed)<br>call<br>전달 콜백: H-d8f8268c08d7 |

반환/조기 중단: 69행 () => { observer.disconnect(); media.removeEventListener('change', changed); } [별도 조건식 없음]

## H-d8f8268c08d7

**changed** · [src/ui/math-template-plot.tsx:67](../../../src/ui/math-template-plot.tsx#L67)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 67행 | 별도 조건식 없음 | setTheme((v) => v + 1)<br>state-update<br>전달 콜백: H-d61d855fda18 |

## H-d61d855fda18

**@callback:setTheme** · [src/ui/math-template-plot.tsx:67](../../../src/ui/math-template-plot.tsx#L67)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-dada41b6a141

**@callback:useEffect** · [src/ui/math-template-plot.tsx:75](../../../src/ui/math-template-plot.tsx#L75)

분기 조건과 가능한 갈림길:

- B-e0c5d09e7304 · IfStatement · !node → truthy / falsy; 바깥 조건: 별도 조건식 없음 (77행).
- B-39f99c23f64a · IfStatement · viewKey.current && viewKey.current !== key → truthy / falsy; 바깥 조건: 별도 조건식 없음 (94행).
- B-c716ff0ae6d2 · IfStatement · result.surface && !alternate → truthy / falsy; 바깥 조건: 별도 조건식 없음 (125행).
- B-c0d72d37e02d · IfStatement · result.contour && (!result.surface || alternate) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (157행).
- B-4d4312f472c5 · ConditionalExpression · zero → truthy / falsy; 바깥 조건: truthy: result.contour && (!result.surface || alternate) (165행).
- B-976ea8f8ea63 · IfStatement · result.volume → truthy / falsy; 바깥 조건: 별도 조건식 없음 (170행).
- B-d539e4621ef9 · IfStatement · result.arrows → truthy / falsy; 바깥 조건: 별도 조건식 없음 (186행).
- B-974030bbb338 · IfStatement · is3d → truthy / falsy; 바깥 조건: truthy: result.arrows (189행).
- B-b956002f3e1b · IfStatement · !length → truthy / falsy; 바깥 조건: truthy: result.arrows ∧ falsy: is3d (214행).
- B-52e3d87ade58 · IfStatement · result.point → truthy / falsy; 바깥 조건: 별도 조건식 없음 (233행).
- B-5c385e2ba28b · ConditionalExpression · is3d → truthy / falsy; 바깥 조건: truthy: result.point (235행).
- B-63f0fa362297 · ConditionalExpression · is3d → truthy / falsy; 바깥 조건: truthy: result.point (240행).
- B-a2be07952639 · ConditionalExpression · is3d → truthy / falsy; 바깥 조건: truthy: result.point (241행).
- B-a37d2c6e5eed · ConditionalExpression · is3d → truthy / falsy; 바깥 조건: truthy: result.point (244행).
- B-287fffd485ca · ConditionalExpression · item.kind === 'sequence' → truthy / falsy; 바깥 조건: nullish: item.dataset?.xLabel (270행).
- B-45f778b1b020 · ConditionalExpression · item.kind === 'ode' → truthy / falsy; 바깥 조건: nullish: item.dataset?.xLabel ∧ falsy: item.kind === 'sequence' (270행).
- B-7fbbb33e836a · ConditionalExpression · savedView.current?.ranges → truthy / falsy; 바깥 조건: 별도 조건식 없음 (272행).
- B-980a3710330f · ConditionalExpression · savedView.current?.ranges → truthy / falsy; 바깥 조건: 별도 조건식 없음 (276행).
- B-f176ad7520d5 · ConditionalExpression · !['implicit', 'field', 'matrix'].includes(item.kind) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (277행).
- B-5eae81db5adb · ConditionalExpression · is3d → truthy / falsy; 바깥 조건: 별도 조건식 없음 (290행).
- B-4d9657614cbe · IfStatement · is3d → truthy / falsy; 바깥 조건: 별도 조건식 없음 (292행).
- B-33b517fce7a1 · IfStatement · result.surface → truthy / falsy; 바깥 조건: truthy: is3d (299행).
- B-7f51d0e97255 · IfStatement · xs.length && ys.length && zs.length → truthy / falsy; 바깥 조건: truthy: is3d ∧ truthy: result.surface (304행).
- B-40db8954496e · IfStatement · result.volume && result.volume.x.length → truthy / falsy; 바깥 조건: truthy: is3d (310행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 83행 | 별도 조건식 없음 | getComputedStyle(node)<br>call |
| 85행 | 별도 조건식 없음 | color('--color-math-curve')<br>call → [H-5ed421c421f3](ui__math-template-plot.md#h-5ed421c421f3) |
| 86행 | 별도 조건식 없음 | color('--color-math-tangent')<br>call → [H-5ed421c421f3](ui__math-template-plot.md#h-5ed421c421f3) |
| 87행 | 별도 조건식 없음 | color('--color-muted')<br>call → [H-5ed421c421f3](ui__math-template-plot.md#h-5ed421c421f3) |
| 88행 | 별도 조건식 없음 | color('--color-border')<br>call → [H-5ed421c421f3](ui__math-template-plot.md#h-5ed421c421f3) |
| 89행 | 별도 조건식 없음 | color('--primitive-common-info-500')<br>call → [H-5ed421c421f3](ui__math-template-plot.md#h-5ed421c421f3) |
| 90행 | 별도 조건식 없음 | color('--primitive-common-info-100')<br>call → [H-5ed421c421f3](ui__math-template-plot.md#h-5ed421c421f3) |
| 91행 | 별도 조건식 없음 | color('--color-surface')<br>call → [H-5ed421c421f3](ui__math-template-plot.md#h-5ed421c421f3) |
| 92행 | 별도 조건식 없음 | color('--color-text')<br>call → [H-5ed421c421f3](ui__math-template-plot.md#h-5ed421c421f3) |
| 96행 | truthy: viewKey.current && viewKey.current !== key | defaultMathCamera()<br>call → [H-1b3a7af48194](ui__math-plot-camera.md#h-1b3a7af48194) |
| 119행 | 별도 조건식 없음 | traces.push(lineTrace(line))<br>call |
| 119행 | 별도 조건식 없음 | lineTrace(line)<br>call → [H-2cacc43e8d8d](ui__math-template-plot.md#h-2cacc43e8d8d) |
| 126행 | truthy: result.surface && !alternate | traces.push({ type: 'surface', ...result.surface, colorscale: [ [0, surfaceLow], [1, surfaceHigh], ], showscale: true, colorbar: { title: { text: 'z' }, thickness: 12, len: 0.55, tickformat: '.2~f', tickfont: { size: 11, color: gray }, outlinewidth: 0, }, connectgaps: false, opacity: 1, lighting: { ambient: 0.85, diffuse: 0.35, specular: 0, roughness: 1, fresnel: 0 }, hovertemplate: 'x=%{x:.2f}<br>y=%{y:.2f}<br>z=%{z:.2f}<extra></extra>', } as Data)<br>call |
| 148행 | truthy: result.surface && !alternate | surfaceMesh(result.surface)<br>call |
| 149행 | truthy: result.surface && !alternate | traces.push({ ...lineTrace(line), line: { color: gray, width: 1 }, hoverinfo: 'skip', hovertemplate: undefined, showlegend: false, } as Data)<br>call |
| 150행 | truthy: result.surface && !alternate | lineTrace(line)<br>call → [H-2cacc43e8d8d](ui__math-template-plot.md#h-2cacc43e8d8d) |
| 159행 | truthy: result.contour && (!result.surface \|\| alternate) | traces.push({ type: 'contour', ...coordinates, colorscale, showscale: false, connectgaps: false, contours: zero ? { start: 0, end: 0, size: 1, coloring: 'lines' } : { coloring: 'lines' }, line: { color: curve, width: 2 }, hovertemplate: 'x=%{x:.2f}<br>y=%{y:.2f}<br>F=%{z:.2f}<extra></extra>', } as Data)<br>call |
| 171행 | truthy: result.volume | traces.push({ type: 'isosurface', ...result.volume, isomin: 0, isomax: 0, surface: { count: 1 }, caps: { x: { show: false }, y: { show: false }, z: { show: false } }, colorscale: [ [0, curve], [1, curve], ], showscale: false, opacity: 0.75, } as unknown as Data)<br>call |
| 188행 | truthy: result.arrows | Math.min(...Object.values(item.ranges).map(([a, b]) => (b - a) / (is3d ? 5 : 11)))<br>call |
| 188행 | truthy: result.arrows | Object.values(item.ranges).map(([a, b]) => (b - a) / (is3d ? 5 : 11))<br>call<br>전달 콜백: H-e45b822ae9da |
| 188행 | truthy: result.arrows | Object.values(item.ranges)<br>call |
| 190행 | truthy: result.arrows ∧ truthy: is3d | result.arrows<br>          .map((a) => ({ ...a, length: Math.hypot(...a.vector) }))<br>          .filter((a) => a.length > 0)<br>call<br>전달 콜백: H-abd1b2532f9d |
| 190행 | truthy: result.arrows ∧ truthy: is3d | result.arrows<br>          .map((a) => ({ ...a, length: Math.hypot(...a.vector) }))<br>call<br>전달 콜백: H-6bcc911325f5 |
| 193행 | truthy: result.arrows ∧ truthy: is3d | traces.push({ type: 'cone', x: arrows.map((a) => a.at[0]), y: arrows.map((a) => a.at[1]), z: arrows.map((a) => a.at[2]), u: arrows.map((a) => a.vector[0] / a.length), v: arrows.map((a) => a.vector[1] / a.length), w: arrows.map((a) => a.vector[2] / a.length), sizemode: 'absolute', sizeref: step, anchor: 'tail', colorscale: [ [0, secondary], [1, secondary], ], showscale: false, hoverinfo: 'skip', } as Data)<br>call |
| 195행 | truthy: result.arrows ∧ truthy: is3d | arrows.map((a) => a.at[0])<br>call<br>전달 콜백: H-c591177b6e8e |
| 196행 | truthy: result.arrows ∧ truthy: is3d | arrows.map((a) => a.at[1])<br>call<br>전달 콜백: H-fa0f8b7d859a |
| 197행 | truthy: result.arrows ∧ truthy: is3d | arrows.map((a) => a.at[2])<br>call<br>전달 콜백: H-dab109ed9d2d |
| 198행 | truthy: result.arrows ∧ truthy: is3d | arrows.map((a) => a.vector[0] / a.length)<br>call<br>전달 콜백: H-cce14bc356bd |
| 199행 | truthy: result.arrows ∧ truthy: is3d | arrows.map((a) => a.vector[1] / a.length)<br>call<br>전달 콜백: H-b269361a7fce |
| 200행 | truthy: result.arrows ∧ truthy: is3d | arrows.map((a) => a.vector[2] / a.length)<br>call<br>전달 콜백: H-1436abc03aad |
| 213행 | truthy: result.arrows ∧ falsy: is3d | Math.hypot(...arrow.vector)<br>call |
| 215행 | truthy: result.arrows ∧ falsy: is3d | annotations.push({ x: arrow.at[0] + (step * arrow.vector[0]) / length, y: arrow.at[1] + (step * arrow.vector[1]) / length, ax: arrow.at[0], ay: arrow.at[1], xref: 'x', yref: 'y', axref: 'x', ayref: 'y', text: '', showarrow: true, arrowhead: 3, arrowsize: 0.7, arrowwidth: 1, arrowcolor: secondary, })<br>call |
| 234행 | truthy: result.point | traces.push({ type: is3d ? 'scatter3d' : 'scatter', mode: 'markers', name: '현재 점', x: [result.point[0]], y: [result.point[1]], ...(is3d ? { z: [result.point[2]] } : {}), marker: { color: curve, size: is3d ? 4 : 7 }, showlegend: false, hovertemplate: 'x=%{x:.2f}<br>y=%{y:.2f}' + (is3d ? '<br>z=%{z:.2f}' : '') + '<extra>현재 점</extra>', } as Data)<br>call |
| 268행 | 별도 조건식 없음 | axis(item.dataset?.xLabel ?? (item.kind === 'sequence' ? 'n' : item.kind === 'ode' ? 't' : 'x'))<br>call → [H-b05e5e283bc0](ui__math-template-plot.md#h-b05e5e283bc0) |
| 275행 | 별도 조건식 없음 | axis(item.dataset?.yLabel ?? 'y')<br>call → [H-b05e5e283bc0](ui__math-template-plot.md#h-b05e5e283bc0) |
| 277행 | 별도 조건식 없음 | ['implicit', 'field', 'matrix'].includes(item.kind)<br>call |
| 283행 | 별도 조건식 없음 | axis('x')<br>call → [H-b05e5e283bc0](ui__math-template-plot.md#h-b05e5e283bc0) |
| 284행 | 별도 조건식 없음 | axis('y')<br>call → [H-b05e5e283bc0](ui__math-template-plot.md#h-b05e5e283bc0) |
| 285행 | 별도 조건식 없음 | axis('z')<br>call → [H-b05e5e283bc0](ui__math-template-plot.md#h-b05e5e283bc0) |
| 288행 | 별도 조건식 없음 | renderMathCamera(camera.current)<br>call → [H-c6458d928995](ui__math-plot-camera.md#h-c6458d928995) |
| 294행 | truthy: is3d | result.lines.flatMap((l) => l.points.filter((p): p is [number, number, number] => p !== null))<br>call<br>전달 콜백: H-c8c1f35ff118 |
| 297행 | truthy: is3d | (result.arrows ?? []).map((a) => a.at)<br>call<br>전달 콜백: H-5b84482937f9 |
| 301행 | truthy: is3d ∧ truthy: result.surface | surface.x.flat().filter(Number.isFinite)<br>call |
| 301행 | truthy: is3d ∧ truthy: result.surface | surface.x.flat()<br>call |
| 302행 | truthy: is3d ∧ truthy: result.surface | surface.y.flat().filter(Number.isFinite)<br>call |
| 302행 | truthy: is3d ∧ truthy: result.surface | surface.y.flat()<br>call |
| 303행 | truthy: is3d ∧ truthy: result.surface | surface.z.flat().filter((v): v is number => v !== null)<br>call<br>전달 콜백: H-cf97b7f9e8c3 |
| 303행 | truthy: is3d ∧ truthy: result.surface | surface.z.flat()<br>call |
| 305행 | truthy: is3d ∧ truthy: result.surface ∧ truthy: xs.length && ys.length && zs.length | pts.push([Math.min(...xs), Math.min(...ys), Math.min(...zs)], [Math.max(...xs), Math.max(...ys), Math.max(...zs)])<br>call |
| 306행 | truthy: is3d ∧ truthy: result.surface ∧ truthy: xs.length && ys.length && zs.length | Math.min(...xs)<br>call |
| 306행 | truthy: is3d ∧ truthy: result.surface ∧ truthy: xs.length && ys.length && zs.length | Math.min(...ys)<br>call |
| 306행 | truthy: is3d ∧ truthy: result.surface ∧ truthy: xs.length && ys.length && zs.length | Math.min(...zs)<br>call |
| 307행 | truthy: is3d ∧ truthy: result.surface ∧ truthy: xs.length && ys.length && zs.length | Math.max(...xs)<br>call |
| 307행 | truthy: is3d ∧ truthy: result.surface ∧ truthy: xs.length && ys.length && zs.length | Math.max(...ys)<br>call |
| 307행 | truthy: is3d ∧ truthy: result.surface ∧ truthy: xs.length && ys.length && zs.length | Math.max(...zs)<br>call |
| 311행 | truthy: is3d ∧ truthy: result.volume && result.volume.x.length | pts.push([ Math.min(...result.volume.x), Math.min(...result.volume.y), Math.min(...result.volume.z), ], [ Math.max(...result.volume.x), Math.max(...result.volume.y), Math.max(...result.volume.z), ])<br>call |
| 313행 | truthy: is3d ∧ truthy: result.volume && result.volume.x.length | Math.min(...result.volume.x)<br>call |
| 314행 | truthy: is3d ∧ truthy: result.volume && result.volume.x.length | Math.min(...result.volume.y)<br>call |
| 315행 | truthy: is3d ∧ truthy: result.volume && result.volume.x.length | Math.min(...result.volume.z)<br>call |
| 318행 | truthy: is3d ∧ truthy: result.volume && result.volume.x.length | Math.max(...result.volume.x)<br>call |
| 319행 | truthy: is3d ∧ truthy: result.volume && result.volume.x.length | Math.max(...result.volume.y)<br>call |
| 320행 | truthy: is3d ∧ truthy: result.volume && result.volume.x.length | Math.max(...result.volume.z)<br>call |
| 323행 | truthy: is3d | [0, 1, 2].map((i) => pts.length ? [Math.min(...pts.map((p) => p[i])), Math.max(...pts.map((p) => p[i]))] : [-3, 3])<br>call<br>전달 콜백: H-0820c855faef |
| 333행 | truthy: is3d | prepareUnboundedScene(scene, bounds, node.clientWidth, node.clientHeight, { grid, axis: gray, background }, camera.current)<br>call |
| 342행 | truthy: is3d | traces.push(...world.scaffold.traces)<br>call |
| 351행 | 별도 조건식 없음 | setReady(false)<br>state-update |
| 352행 | 별도 조건식 없음 | plotlyMathLabels(node)<br>call |
| 353행 | 별도 조건식 없음 | Plotly.react(node, traces, layout, mathPlotConfig)<br>      .then(() => {<br>        if (!active) return;<br>        setError('');<br>        if (world)<br>          infinite = followUnboundedScene(<br>            node,<br>            world,<br>            scaffoldIndex,<br>            undefined,<br>            () => camera.current,<br>          );<br>        setReady(true);<br>        pan.current = is3d<br>          ? null<br>          : mathPlotPan(<br>              node,<br>              () => {<br>                const current = (node as unknown as PlotlyHTMLElement).layout;<br>                return [current.xaxis?.range ?? [-1, 1], current.yaxis?.range ?? [-1, 1]];<br>              },<br>              (next) => {<br>                void Plotly.relayout(node, {<br>                  'xaxis.range': next[0],<br>                  'yaxis.range': next[1],<br>                } as Partial<Layout> & Record<string, unknown>).catch(() =><br>                  setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'),<br>                );<br>              },<br>            );<br>        (node as unknown as PlotlyHTMLElement).on('plotly_relayout', (event) => {<br>          if (<br>            !active \|\|<br>            !Object.keys(event).some((k) => k.startsWith('scene.camera') \|\| k.includes('.range'))<br>          )<br>            return;<br>          const layout = (node as unknown as PlotlyHTMLElement).layout;<br>          if (<br>            is3d &&<br>            layout.scene?.camera &&<br>            Object.keys(event).some((key) => key.startsWith('scene.camera'))<br>          )<br>            camera.current = recoverMathCamera(layout.scene.camera, camera.current);<br>          const view: TemplateView = {<br>            ...(is3d<br>              ? { camera: camera.current as TemplateView['camera'] }<br>              : {<br>                  ranges: {<br>                    x: layout.xaxis!.range as [number, number],<br>                    y: layout.yaxis!.range as [number, number],<br>                  },<br>                }),<br>          };<br>          if (isTemplateView(view)) {<br>            savedView.current = view;<br>            viewCallback.current?.(view);<br>          }<br>        });<br>        zoom.current = (factor) => {<br>          if (!Number.isFinite(factor) \|\| factor <= 0) return;<br>          if (is3d) {<br>            camera.current = zoomCamera(camera.current, factor);<br>            void Plotly.relayout(node, {<br>              'scene.camera': renderMathCamera(camera.current),<br>            } as Partial<Layout> & Record<string, unknown>)<br>              .then(() => infinite?.update())<br>              .catch(() => setError('확대·축소하지 못했습니다. 다시 열어 주세요.'));<br>          } else {<br>            const current = (node as unknown as PlotlyHTMLElement).layout;<br>            const update: Record<string, unknown> = {};<br>            for (const name of ['xaxis', 'yaxis'] as const) {<br>              const range = current[name]?.range;<br>              if (!range) continue;<br>              const middle = (Number(range[0]) + Number(range[1])) / 2,<br>                half = (Number(range[1]) - Number(range[0])) / (2 * factor);<br>              if (half > 1e-8 && half < 1e9)<br>                update[`${name}.range`] = [middle - half, middle + half];<br>            }<br>            void Plotly.relayout(node, update);<br>          }<br>        };<br>      })<br>      .catch(() => { if (active) { setError('그래프를 그리지 못했습니다. 입력은 유지했습니다. 다시 그려 주세요.'); setReady(false); } })<br>call<br>전달 콜백: H-7decb546a249 |
| 353행 | 별도 조건식 없음 | Plotly.react(node, traces, layout, mathPlotConfig)<br>      .then(() => { if (!active) return; setError(''); if (world) infinite = followUnboundedScene( node, world, scaffoldIndex, undefined, () => camera.current, ); setReady(true); pan.current = is3d ? null : mathPlotPan( node, () => { const current = (node as unknown as PlotlyHTMLElement).layout; return [current.xaxis?.range ?? [-1, 1], current.yaxis?.range ?? [-1, 1]]; }, (next) => { void Plotly.relayout(node, { 'xaxis.range': next[0], 'yaxis.range': next[1], } as Partial<Layout> & Record<string, unknown>).catch(() => setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'), ); }, ); (node as unknown as PlotlyHTMLElement).on('plotly_relayout', (event) => { if ( !active \|\| !Object.keys(event).some((k) => k.startsWith('sc … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-ffd9b1e0de69 |
| 353행 | 별도 조건식 없음 | Plotly.react(node, traces, layout, mathPlotConfig)<br>call |
| 460행 | 별도 조건식 없음 | resize.observe(node)<br>call |

반환/조기 중단: 77행 <render> [truthy: !node]; 461행 () => { active = false; infinite?.dispose(); pan.current = null; zoom.current = null; resize.disconnect(); cancelAnimationFrame(frame); dispose(); (node as unknown as PlotlyHTMLElement).removeAllListeners?.('plotly_relayout'); } [별도 조건식 없음]

## H-5ed421c421f3

**color** · [src/ui/math-template-plot.tsx:84](../../../src/ui/math-template-plot.tsx#L84)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 84행 | 별도 조건식 없음 | css.getPropertyValue(name).trim()<br>call |
| 84행 | 별도 조건식 없음 | css.getPropertyValue(name)<br>call |

## H-2cacc43e8d8d

**lineTrace** · [src/ui/math-template-plot.tsx:101](../../../src/ui/math-template-plot.tsx#L101)

분기 조건과 가능한 갈림길:

- B-a221bbe7c38d · ConditionalExpression · line.style === 'bar' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (103행).
- B-2d31260bb521 · ConditionalExpression · is3d → truthy / falsy; 바깥 조건: falsy: line.style === 'bar' (103행).
- B-c82c871e0c3d · ConditionalExpression · line.style === 'scatter' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (104행).
- B-2c811e504c89 · ConditionalExpression · line.markers → truthy / falsy; 바깥 조건: falsy: line.style === 'scatter' (104행).
- B-51feda304fb7 · ConditionalExpression · is3d → truthy / falsy; 바깥 조건: 별도 조건식 없음 (108행).
- B-935d396a7f49 · ConditionalExpression · line.role === 'grid' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (110행).
- B-9f891b7f16fc · ConditionalExpression · line.role === 'secondary' → truthy / falsy; 바깥 조건: falsy: line.role === 'grid' (110행).
- B-bc63d096de67 · ConditionalExpression · line.role === 'grid' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (111행).
- B-d8688ed8e8c9 · ConditionalExpression · is3d → truthy / falsy; 바깥 조건: 별도 조건식 없음 (117행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 106행 | 별도 조건식 없음 | line.points.map((p) => p?.[0] ?? null)<br>call<br>전달 콜백: H-ade23f4dfb74 |
| 107행 | 별도 조건식 없음 | line.points.map((p) => p?.[1] ?? null)<br>call<br>전달 콜백: H-f34b9ce2e3ab |
| 108행 | truthy: is3d | line.points.map((p) => p?.[2] ?? null)<br>call<br>전달 콜백: H-0d4c5df30053 |

## H-ade23f4dfb74

**@callback:line.points.map** · [src/ui/math-template-plot.tsx:106](../../../src/ui/math-template-plot.tsx#L106)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f34b9ce2e3ab

**@callback:line.points.map** · [src/ui/math-template-plot.tsx:107](../../../src/ui/math-template-plot.tsx#L107)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0d4c5df30053

**@callback:line.points.map** · [src/ui/math-template-plot.tsx:108](../../../src/ui/math-template-plot.tsx#L108)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e45b822ae9da

**@callback:Object.values(item.ranges).map** · [src/ui/math-template-plot.tsx:188](../../../src/ui/math-template-plot.tsx#L188)

분기 조건과 가능한 갈림길:

- B-a56f4a47ac66 · ConditionalExpression · is3d → truthy / falsy; 바깥 조건: truthy: result.arrows (188행).

## H-6bcc911325f5

**@callback:result.arrows
          .map** · [src/ui/math-template-plot.tsx:191](../../../src/ui/math-template-plot.tsx#L191)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 191행 | truthy: result.arrows ∧ truthy: is3d | Math.hypot(...a.vector)<br>call |

## H-abd1b2532f9d

**@callback:result.arrows
          .map((a) => ({ ...a, length: Math.hypot(...a.vector) }))
          .filter** · [src/ui/math-template-plot.tsx:192](../../../src/ui/math-template-plot.tsx#L192)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c591177b6e8e

**@callback:arrows.map** · [src/ui/math-template-plot.tsx:195](../../../src/ui/math-template-plot.tsx#L195)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fa0f8b7d859a

**@callback:arrows.map** · [src/ui/math-template-plot.tsx:196](../../../src/ui/math-template-plot.tsx#L196)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-dab109ed9d2d

**@callback:arrows.map** · [src/ui/math-template-plot.tsx:197](../../../src/ui/math-template-plot.tsx#L197)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-cce14bc356bd

**@callback:arrows.map** · [src/ui/math-template-plot.tsx:198](../../../src/ui/math-template-plot.tsx#L198)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b269361a7fce

**@callback:arrows.map** · [src/ui/math-template-plot.tsx:199](../../../src/ui/math-template-plot.tsx#L199)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1436abc03aad

**@callback:arrows.map** · [src/ui/math-template-plot.tsx:200](../../../src/ui/math-template-plot.tsx#L200)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b05e5e283bc0

**axis** · [src/ui/math-template-plot.tsx:246](../../../src/ui/math-template-plot.tsx#L246)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c8c1f35ff118

**@callback:result.lines.flatMap** · [src/ui/math-template-plot.tsx:294](../../../src/ui/math-template-plot.tsx#L294)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 295행 | truthy: is3d | l.points.filter((p): p is [number, number, number] => p !== null)<br>call<br>전달 콜백: H-b6b1401ef383 |

## H-b6b1401ef383

**@callback:l.points.filter** · [src/ui/math-template-plot.tsx:295](../../../src/ui/math-template-plot.tsx#L295)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5b84482937f9

**@callback:(result.arrows ?? []).map** · [src/ui/math-template-plot.tsx:297](../../../src/ui/math-template-plot.tsx#L297)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-cf97b7f9e8c3

**@callback:surface.z.flat().filter** · [src/ui/math-template-plot.tsx:303](../../../src/ui/math-template-plot.tsx#L303)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0820c855faef

**@callback:[0, 1, 2].map** · [src/ui/math-template-plot.tsx:323](../../../src/ui/math-template-plot.tsx#L323)

분기 조건과 가능한 갈림길:

- B-f684b2f09a6d · ConditionalExpression · pts.length → truthy / falsy; 바깥 조건: truthy: is3d (324행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 325행 | truthy: is3d ∧ truthy: pts.length | Math.min(...pts.map((p) => p[i]))<br>call |
| 325행 | truthy: is3d ∧ truthy: pts.length | pts.map((p) => p[i])<br>call<br>전달 콜백: H-207d11210ff3 |
| 325행 | truthy: is3d ∧ truthy: pts.length | Math.max(...pts.map((p) => p[i]))<br>call |
| 325행 | truthy: is3d ∧ truthy: pts.length | pts.map((p) => p[i])<br>call<br>전달 콜백: H-8fdab6aaafa6 |

## H-207d11210ff3

**@callback:pts.map** · [src/ui/math-template-plot.tsx:325](../../../src/ui/math-template-plot.tsx#L325)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8fdab6aaafa6

**@callback:pts.map** · [src/ui/math-template-plot.tsx:325](../../../src/ui/math-template-plot.tsx#L325)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ffd9b1e0de69

**@callback:Plotly.react(node, traces, layout, mathPlotConfig)
      .then** · [src/ui/math-template-plot.tsx:354](../../../src/ui/math-template-plot.tsx#L354)

분기 조건과 가능한 갈림길:

- B-f2890335d5f3 · IfStatement · !active → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) (355행).
- B-eeffe857d993 · IfStatement · world → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) (357행).
- B-142ad6560714 · ConditionalExpression · is3d → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) (366행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 356행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) | setError('')<br>state-update |
| 358행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ truthy: world | followUnboundedScene(node, world, scaffoldIndex, undefined, () => camera.current)<br>call<br>전달 콜백: H-20ae005118e0 |
| 365행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) | setReady(true)<br>state-update |
| 368행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ falsy: is3d | mathPlotPan(node, () => { const current = (node as unknown as PlotlyHTMLElement).layout; return [current.xaxis?.range ?? [-1, 1], current.yaxis?.range ?? [-1, 1]]; }, (next) => { void Plotly.relayout(node, { 'xaxis.range': next[0], 'yaxis.range': next[1], } as Partial<Layout> & Record<string, unknown>).catch(() => setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'), ); })<br>call<br>전달 콜백: H-6572bfe08886, H-56ca6e0372f2 |
| 383행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) | (node as unknown as PlotlyHTMLElement).on('plotly_relayout', (event) => { if ( !active \|\| !Object.keys(event).some((k) => k.startsWith('scene.camera') \|\| k.includes('.range')) ) return; const layout = (node as unknown as PlotlyHTMLElement).layout; if ( is3d && layout.scene?.camera && Object.keys(event).some((key) => key.startsWith('scene.camera')) ) camera.current = recoverMathCamera(layout.scene.camera, camera.current); const view: TemplateView = { ...(is3d ? { camera: camera.current as TemplateView['camera'] } : { ranges: { x: layout.xaxis!.range as [number, number], y: layout.yaxis!.range as [number, number], }, }), }; if (isTemplateView(view)) { savedView.current = view; viewCallback.current?.(view); } })<br>call<br>전달 콜백: H-bb96966ea28b |

반환/조기 중단: 355행 <render> [fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ truthy: !active]

## H-20ae005118e0

**@callback:followUnboundedScene** · [src/ui/math-template-plot.tsx:363](../../../src/ui/math-template-plot.tsx#L363)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6572bfe08886

**@callback:mathPlotPan** · [src/ui/math-template-plot.tsx:370](../../../src/ui/math-template-plot.tsx#L370)


반환/조기 중단: 372행 [current.xaxis?.range ?? [-1, 1], current.yaxis?.range ?? [-1, 1]] [fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ falsy: is3d]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-56ca6e0372f2

**@callback:mathPlotPan** · [src/ui/math-template-plot.tsx:374](../../../src/ui/math-template-plot.tsx#L374)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 375행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ falsy: is3d | Plotly.relayout(node, {<br>                  'xaxis.range': next[0],<br>                  'yaxis.range': next[1],<br>                } as Partial<Layout> & Record<string, unknown>).catch(() => setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'))<br>call<br>전달 콜백: H-3613ffdd7bb4 |
| 375행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ falsy: is3d | Plotly.relayout(node, { 'xaxis.range': next[0], 'yaxis.range': next[1], } as Partial<Layout> & Record<string, unknown>)<br>call |

## H-3613ffdd7bb4

**@callback:Plotly.relayout(node, {
                  'xaxis.range': next[0],
                  'yaxis.range': next[1],
                } as Partial<Layout> & Record<string, unknown>).catch** · [src/ui/math-template-plot.tsx:378](../../../src/ui/math-template-plot.tsx#L378)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 379행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ falsy: is3d ∧ rejected: Plotly.relayout(node, {<br>                  'xaxis.range': next[0],<br>                  'yaxis.range': next[1],<br>                } as Partial<Layout> & Record<string, unknown>) | setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.')<br>state-update |

## H-bb96966ea28b

**@callback:(node as unknown as PlotlyHTMLElement).on** · [src/ui/math-template-plot.tsx:383](../../../src/ui/math-template-plot.tsx#L383)

분기 조건과 가능한 갈림길:

- B-8f3b4ae66f85 · IfStatement · !active || !Object.keys(event).some((k) => k.startsWith('scene.camera') || k.includes('.range')) → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) (384행).
- B-18582a1a8d94 · IfStatement · is3d && layout.scene?.camera && Object.keys(event).some((key) => key.startsWith('scene.camera')) → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) (390행).
- B-98eddf611640 · ConditionalExpression · is3d → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) (397행).
- B-cc00eeaafe32 · IfStatement · isTemplateView(view) → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) (406행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 386행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ falsy: !active | Object.keys(event).some((k) => k.startsWith('scene.camera') \|\| k.includes('.range'))<br>call<br>전달 콜백: H-1968129b6e8f |
| 386행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ falsy: !active | Object.keys(event)<br>call |
| 393행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ truthy: is3d &&<br>            layout.scene?.camera | Object.keys(event).some((key) => key.startsWith('scene.camera'))<br>call<br>전달 콜백: H-0a24786fa17b |
| 393행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ truthy: is3d &&<br>            layout.scene?.camera | Object.keys(event)<br>call |
| 395행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ truthy: is3d &&<br>            layout.scene?.camera &&<br>            Object.keys(event).some((key) => key.startsWith('scene.camera')) | recoverMathCamera(layout.scene.camera, camera.current)<br>call → [H-f31d101b18e6](ui__math-plot-camera.md#h-f31d101b18e6) |
| 406행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) | isTemplateView(view)<br>call |

반환/조기 중단: 388행 <render> [fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ truthy: !active ||
            !Object.keys(event).some((k) => k.startsWith('scene.camera') || k.includes('.range'))]

## H-1968129b6e8f

**@callback:Object.keys(event).some** · [src/ui/math-template-plot.tsx:386](../../../src/ui/math-template-plot.tsx#L386)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 386행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ falsy: !active | k.startsWith('scene.camera')<br>call |
| 386행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ falsy: !active ∧ falsy: k.startsWith('scene.camera') | k.includes('.range')<br>call |

## H-0a24786fa17b

**@callback:Object.keys(event).some** · [src/ui/math-template-plot.tsx:393](../../../src/ui/math-template-plot.tsx#L393)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 393행 | fulfilled-or-explicit-rejection-handler: Plotly.react(node, traces, layout, mathPlotConfig) ∧ truthy: is3d &&<br>            layout.scene?.camera | key.startsWith('scene.camera')<br>call |

## H-7decb546a249

**@callback:Plotly.react(node, traces, layout, mathPlotConfig)
      .then(() => {
        if (!active) return;
        setError('');
        if (world)
          infinite = followUnboundedScene(
            node,
            world,
            scaffoldIndex,
            undefined,
            () => camera.current,
          );
        setReady(true);
        pan.current = is3d
          ? null
          : mathPlotPan(
              node,
              () => {
                const current = (node as unknown as PlotlyHTMLElement).layout;
                return [current.xaxis?.range ?? [-1, 1], current.yaxis?.range ?? [-1, 1]];
              },
              (next) => {
                void Plotly.relayout(node, {
                  'xaxis.range': next[0],
                  'yaxis.range': next[1],
                } as Partial<Layout> & Record<string, unknown>).catch(() =>
                  setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'),
                );
              },
            );
        (node as unknown as PlotlyHTMLElement).on('plotly_relayout', (event) => {
          if (
            !active ||
            !Object.keys(event).some((k) => k.startsWith('scene.camera') || k.includes('.range'))
          )
            return;
          const layout = (node as unknown as PlotlyHTMLElement).layout;
          if (
            is3d &&
            layout.scene?.camera &&
            Object.keys(event).some((key) => key.startsWith('scene.camera'))
          )
            camera.current = recoverMathCamera(layout.scene.camera, camera.current);
          const view: TemplateView = {
            ...(is3d
              ? { camera: camera.current as TemplateView['camera'] }
              : {
                  ranges: {
                    x: layout.xaxis!.range as [number, number],
                    y: layout.yaxis!.range as [number, number],
                  },
                }),
          };
          if (isTemplateView(view)) {
            savedView.current = view;
            viewCallback.current?.(view);
          }
        });
        zoom.current = (factor) => {
          if (!Number.isFinite(factor) || factor <= 0) return;
          if (is3d) {
            camera.current = zoomCamera(camera.current, factor);
            void Plotly.relayout(node, {
              'scene.camera': renderMathCamera(camera.current),
            } as Partial<Layout> & Record<string, unknown>)
              .then(() => infinite?.update())
              .catch(() => setError('확대·축소하지 못했습니다. 다시 열어 주세요.'));
          } else {
            const current = (node as unknown as PlotlyHTMLElement).layout;
            const update: Record<string, unknown> = {};
            for (const name of ['xaxis', 'yaxis'] as const) {
              const range = current[name]?.range;
              if (!range) continue;
              const middle = (Number(range[0]) + Number(range[1])) / 2,
                half = (Number(range[1]) - Number(range[0])) / (2 * factor);
              if (half > 1e-8 && half < 1e9)
                update[`${name}.range`] = [middle - half, middle + half];
            }
            void Plotly.relayout(node, update);
          }
        };
      })
      .catch** · [src/ui/math-template-plot.tsx:435](../../../src/ui/math-template-plot.tsx#L435)

분기 조건과 가능한 갈림길:

- B-da6db6757dd4 · IfStatement · active → truthy / falsy; 바깥 조건: rejected: Plotly.react(node, traces, layout, mathPlotConfig)
      .then(() => {
        if (!active) return;
        setError('');
        if (world)
          infinite = followUnboundedScene(
            node,
            world,
            scaffoldIndex,
            undefined,
            () => camera.current,
          );
        setReady(true);
        pan.current = is3d
          ? null
          : mathPlotPan(
              node,
              () => {
                const current = (node as unknown as PlotlyHTMLElement).layout;
                return [current.xaxis?.range ?? [-1, 1], current.yaxis?.range ?? [-1, 1]];
              },
              (next) => {
                void Plotly.relayout(node, {
                  'xaxis.range': next[0],
                  'yaxis.range': next[1],
                } as Partial<Layout> & Record<string, unknown>).catch(() =>
                  setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'),
                );
              },
            );
        (node as unknown as PlotlyHTMLElement).on('plotly_relayout', (event) => {
          if (
            !active ||
            !Object.keys(event).some((k) => k.startsWith('scene.camera') || k.includes('.range'))
          )
            return;
          const layout = (node as unknown as PlotlyHTMLElement).layout;
          if (
            is3d &&
            layout.scene?.camera &&
            Object.keys(event).some((key) => key.startsWith('scene.camera'))
          )
            camera.current = recoverMathCamera(layout.scene.camera, camera.current);
          const view: TemplateView = {
            ...(is3d
              ? { camera: camera.current as TemplateView['camera'] }
              : {
                  ranges: {
                    x: layout.xaxis!.range as [number, number],
                    y: layout.yaxis!.range as [number, number],
                  },
                }),
          };
          if (isTemplateView(view)) {
            savedView.current = view;
            viewCallback.current?.(view);
          }
        });
        zoom.current = (factor) => {
          if (!Number.isFinite(factor) || factor <= 0) return;
          if (is3d) {
            camera.current = zoomCamera(camera.current, factor);
            void Plotly.relayout(node, {
              'scene.camera': renderMathCamera(camera.current),
            } as Partial<Layout> & Record<string, unknown>)
              .then(() => infinite?.update())
              .catch(() => setError('확대·축소하지 못했습니다. 다시 열어 주세요.'));
          } else {
            const current = (node as unknown as PlotlyHTMLElement).layout;
            const update: Record<string, unknown> = {};
            for (const name of ['xaxis', 'yaxis'] as const) {
              const range = current[name]?.range;
              if (!range) continue;
              const middle = (Number(range[0]) + Number(range[1])) / 2,
                half = (Number(range[1]) - Number(range[0])) / (2 * factor);
              if (half > 1e-8 && half < 1e9)
                update[`${name}.range`] = [middle - half, middle + half];
            }
            void Plotly.relayout(node, update);
          }
        };
      }) (436행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 437행 | rejected: Plotly.react(node, traces, layout, mathPlotConfig)<br>      .then(() => {<br>        if (!active) return;<br>        setError('');<br>        if (world)<br>          infinite = followUnboundedScene(<br>            node,<br>            world,<br>            scaffoldIndex,<br>            undefined,<br>            () => camera.current,<br>          );<br>        setReady(true);<br>        pan.current = is3d<br>          ? null<br>          : mathPlotPan(<br>              node,<br>              () => {<br>                const current = (node as unknown as PlotlyHTMLElement).layout;<br>                return [current.xaxis?.range ?? [-1, 1], current.yaxis?.range ?? [-1, 1]];<br>              },<br>              (next) => {<br>                void Plotly.relayout(node, {<br>                  'xaxis.range': next[0],<br>                  'yaxis.range': next[1],<br>                } as Partial<Layout> & Record<string, unknown>).catch(() =><br>                  setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'),<br>                );<br>              },<br>            );<br>        (node as unknown as PlotlyHTMLElement).on('plotly_relayout', (event) => {<br>          if (<br>            !active \|\|<br>            !Object.keys(event).some((k) => k.startsWith('scene.camera') \|\| k.includes('.range'))<br>          )<br>            return;<br>          const layout = (node as unknown as PlotlyHTMLElement).layout;<br>          if (<br>            is3d &&<br>            layout.scene?.camera &&<br>            Object.keys(event).some((key) => key.startsWith('scene.camera'))<br>          )<br>            camera.current = recoverMathCamera(layout.scene.camera, camera.current);<br>          const view: TemplateView = {<br>            ...(is3d<br>              ? { camera: camera.current as TemplateView['camera'] }<br>              : {<br>                  ranges: {<br>                    x: layout.xaxis!.range as [number, number],<br>                    y: layout.yaxis!.range as [number, number],<br>                  },<br>                }),<br>          };<br>          if (isTemplateView(view)) {<br>            savedView.current = view;<br>            viewCallback.current?.(view);<br>          }<br>        });<br>        zoom.current = (factor) => {<br>          if (!Number.isFinite(factor) \|\| factor <= 0) return;<br>          if (is3d) {<br>            camera.current = zoomCamera(camera.current, factor);<br>            void Plotly.relayout(node, {<br>              'scene.camera': renderMathCamera(camera.current),<br>            } as Partial<Layout> & Record<string, unknown>)<br>              .then(() => infinite?.update())<br>              .catch(() => setError('확대·축소하지 못했습니다. 다시 열어 주세요.'));<br>          } else {<br>            const current = (node as unknown as PlotlyHTMLElement).layout;<br>            const update: Record<string, unknown> = {};<br>            for (const name of ['xaxis', 'yaxis'] as const) {<br>              const range = current[name]?.range;<br>              if (!range) continue;<br>              const middle = (Number(range[0]) + Number(range[1])) / 2,<br>                half = (Number(range[1]) - Number(range[0])) / (2 * factor);<br>              if (half > 1e-8 && half < 1e9)<br>                update[`${name}.range`] = [middle - half, middle + half];<br>            }<br>            void Plotly.relayout(node, update);<br>          }<br>        };<br>      }) ∧ truthy: active | setError('그래프를 그리지 못했습니다. 입력은 유지했습니다. 다시 그려 주세요.')<br>state-update |
| 438행 | rejected: Plotly.react(node, traces, layout, mathPlotConfig)<br>      .then(() => {<br>        if (!active) return;<br>        setError('');<br>        if (world)<br>          infinite = followUnboundedScene(<br>            node,<br>            world,<br>            scaffoldIndex,<br>            undefined,<br>            () => camera.current,<br>          );<br>        setReady(true);<br>        pan.current = is3d<br>          ? null<br>          : mathPlotPan(<br>              node,<br>              () => {<br>                const current = (node as unknown as PlotlyHTMLElement).layout;<br>                return [current.xaxis?.range ?? [-1, 1], current.yaxis?.range ?? [-1, 1]];<br>              },<br>              (next) => {<br>                void Plotly.relayout(node, {<br>                  'xaxis.range': next[0],<br>                  'yaxis.range': next[1],<br>                } as Partial<Layout> & Record<string, unknown>).catch(() =><br>                  setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'),<br>                );<br>              },<br>            );<br>        (node as unknown as PlotlyHTMLElement).on('plotly_relayout', (event) => {<br>          if (<br>            !active \|\|<br>            !Object.keys(event).some((k) => k.startsWith('scene.camera') \|\| k.includes('.range'))<br>          )<br>            return;<br>          const layout = (node as unknown as PlotlyHTMLElement).layout;<br>          if (<br>            is3d &&<br>            layout.scene?.camera &&<br>            Object.keys(event).some((key) => key.startsWith('scene.camera'))<br>          )<br>            camera.current = recoverMathCamera(layout.scene.camera, camera.current);<br>          const view: TemplateView = {<br>            ...(is3d<br>              ? { camera: camera.current as TemplateView['camera'] }<br>              : {<br>                  ranges: {<br>                    x: layout.xaxis!.range as [number, number],<br>                    y: layout.yaxis!.range as [number, number],<br>                  },<br>                }),<br>          };<br>          if (isTemplateView(view)) {<br>            savedView.current = view;<br>            viewCallback.current?.(view);<br>          }<br>        });<br>        zoom.current = (factor) => {<br>          if (!Number.isFinite(factor) \|\| factor <= 0) return;<br>          if (is3d) {<br>            camera.current = zoomCamera(camera.current, factor);<br>            void Plotly.relayout(node, {<br>              'scene.camera': renderMathCamera(camera.current),<br>            } as Partial<Layout> & Record<string, unknown>)<br>              .then(() => infinite?.update())<br>              .catch(() => setError('확대·축소하지 못했습니다. 다시 열어 주세요.'));<br>          } else {<br>            const current = (node as unknown as PlotlyHTMLElement).layout;<br>            const update: Record<string, unknown> = {};<br>            for (const name of ['xaxis', 'yaxis'] as const) {<br>              const range = current[name]?.range;<br>              if (!range) continue;<br>              const middle = (Number(range[0]) + Number(range[1])) / 2,<br>                half = (Number(range[1]) - Number(range[0])) / (2 * factor);<br>              if (half > 1e-8 && half < 1e9)<br>                update[`${name}.range`] = [middle - half, middle + half];<br>            }<br>            void Plotly.relayout(node, update);<br>          }<br>        };<br>      }) ∧ truthy: active | setReady(false)<br>state-update |

## H-9483c82349a6

**@callback:useEffect** · [src/ui/math-template-plot.tsx:472](../../../src/ui/math-template-plot.tsx#L472)


반환/조기 중단: 474행 () => { if (node) Plotly.purge(node); } [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6b993b9ba110

**@onClick** · [src/ui/math-template-plot.tsx:503](../../../src/ui/math-template-plot.tsx#L503)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3b2eaacbeac4

**@onClick** · [src/ui/math-template-plot.tsx:506](../../../src/ui/math-template-plot.tsx#L506)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e424dba1546b

**@onClick** · [src/ui/math-template-plot.tsx:509](../../../src/ui/math-template-plot.tsx#L509)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 509행 | 별도 조건식 없음 | setRevision((v) => v + 1)<br>state-update<br>전달 콜백: H-e866cce6b3c8 |

## H-e866cce6b3c8

**@callback:setRevision** · [src/ui/math-template-plot.tsx:509](../../../src/ui/math-template-plot.tsx#L509)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-736a5b181582

**@onClick** · [src/ui/math-template-plot.tsx:510](../../../src/ui/math-template-plot.tsx#L510)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 510행 | truthy: error | setRevision((v) => v + 1)<br>state-update<br>전달 콜백: H-b7eecc9af01e |

## H-b7eecc9af01e

**@callback:setRevision** · [src/ui/math-template-plot.tsx:510](../../../src/ui/math-template-plot.tsx#L510)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

