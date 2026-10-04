# src/ui/math-explorer-plot.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-9e8093d927b6

**MathExplorerPlot** · [src/ui/math-explorer-plot.tsx:28](../../../src/ui/math-explorer-plot.tsx#L28)

분기 조건과 가능한 갈림길:

- B-bb4a222a58be · ConditionalExpression · scene.vectors → truthy / falsy; 바깥 조건: truthy: scene.mode === 'curve' (527행).
- B-52307b4977c7 · ConditionalExpression · result.point → truthy / falsy; 바깥 조건: truthy: scene.mode === 'curve' && pointFocused (559행).
- B-b841137c347e · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (565행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 45행 | 별도 조건식 없음 | useRef(onView)<br>call |
| 47행 | 별도 조건식 없음 | useRef(initialView)<br>call |
| 48행 | 별도 조건식 없음 | useRef(null)<br>call |
| 49행 | 별도 조건식 없음 | useState('')<br>call |
| 50행 | 별도 조건식 없음 | useState(0)<br>call |
| 51행 | 별도 조건식 없음 | useState(false)<br>call |
| 52행 | 별도 조건식 없음 | useRef(defaultMathCamera())<br>call |
| 52행 | 별도 조건식 없음 | defaultMathCamera()<br>call → [H-1b3a7af48194](ui__math-plot-camera.md#h-1b3a7af48194) |
| 53행 | 별도 조건식 없음 | useRef(initialView?.pointFocus)<br>call |
| 54행 | 별도 조건식 없음 | useState(Boolean(initialView?.pointFocus))<br>call |
| 54행 | 별도 조건식 없음 | Boolean(initialView?.pointFocus)<br>call |
| 55행 | 별도 조건식 없음 | useRef(undefined)<br>call |
| 56행 | 별도 조건식 없음 | useRef([ [-1, 1], [-1, 1], ])<br>call |
| 60행 | 별도 조건식 없음 | useRef('')<br>call |
| 61행 | 별도 조건식 없음 | useRef(false)<br>call |
| 62행 | 별도 조건식 없음 | useRef([0, 0, 0])<br>call |
| 63행 | 별도 조건식 없음 | useRef(null)<br>call |
| 64행 | 별도 조건식 없음 | useRef(null)<br>call |
| 65행 | 별도 조건식 없음 | useRef({})<br>call |
| 66행 | 별도 조건식 없음 | useMathPlotTouch(host, zoomRef, pan)<br>call |
| 67행 | 별도 조건식 없음 | useEffect(() => { const element = host.current; const update = () => numbers.current?.update(); element?.addEventListener('mathplotgestureend', update); return () => element?.removeEventListener('mathplotgestureend', update); }, [])<br>call<br>전달 콜백: H-cf3b5f137094 |
| 73행 | 별도 조건식 없음 | useEffect(() => { const observer = new MutationObserver(() => setTheme((v) => v + 1)); observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style', 'class'], }); const media = matchMedia('(prefers-color-scheme: dark)'); const changed = () => setTheme((v) => v + 1); media.addEventListener('change', changed); return () => { observer.disconnect(); media.removeEventListener('change', changed); }; }, [])<br>call<br>전달 콜백: H-4a5b0ad05dd0 |
| 88행 | 별도 조건식 없음 | useEffect(() => { const element = host.current; if (!element) return; let active = true; let infinite: {update:()=>void;dispose:()=>void} \| undefined; const disposeLabels = plotlyMathLabels(element); const styles = getComputedStyle(element); const color = (name: string) => styles.getPropertyValue(name).trim(); const ink = color('--color-text'), curveColor = color('--color-math-curve'), blue = color('--color-math-point'), tangent = color('--color-math-tangent'), green = color('--color-math-normal'), binormal = color('--color-math-binormal'); const type = scene.mode === 'curve' ? 'scatter3d' : 'scatter'; const finite = result.points.filter((point) => point !== null); const bounds = [0, 1, 2].map((i) =>  … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-441943ad8b45 |
| 490행 | 별도 조건식 없음 | useEffect(() => { const element = host.current; if (!element) return; let frame = 0; const observer = new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { if ( !element.classList.contains('js-plotly-plot') \|\| !element.clientWidth \|\| !element.clientHeight ) return; // Setting height first can leave Plotly's cached width unchanged across // a breakpoint. Resize both dimensions without resetting the camera. void Plotly.relayout(element, { width: element.clientWidth, height: element.clientHeight, }).catch(() => setError('그래프 크기를 맞추지 못했습니다. 화면을 다시 열어 주세요.')); }); }); observer.observe(element); return () => { observer.disconnect(); cancelAnimationFrame(frame); number … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-8d35d38c7f3c |
| 531행 | truthy: scene.mode === 'curve' | Boolean(result.point)<br>call |

반환/조기 중단: 523행 <render> [별도 조건식 없음]

## H-cf3b5f137094

**@callback:useEffect** · [src/ui/math-explorer-plot.tsx:67](../../../src/ui/math-explorer-plot.tsx#L67)


반환/조기 중단: 71행 () => element?.removeEventListener('mathplotgestureend', update) [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4a5b0ad05dd0

**@callback:useEffect** · [src/ui/math-explorer-plot.tsx:73](../../../src/ui/math-explorer-plot.tsx#L73)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 75행 | 별도 조건식 없음 | observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style', 'class'], })<br>call |
| 79행 | 별도 조건식 없음 | matchMedia('(prefers-color-scheme: dark)')<br>call |
| 81행 | 별도 조건식 없음 | media.addEventListener('change', changed)<br>call<br>전달 콜백: H-cd19eb5af434 |

반환/조기 중단: 82행 () => { observer.disconnect(); media.removeEventListener('change', changed); } [별도 조건식 없음]

## H-cd19eb5af434

**changed** · [src/ui/math-explorer-plot.tsx:80](../../../src/ui/math-explorer-plot.tsx#L80)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 80행 | 별도 조건식 없음 | setTheme((v) => v + 1)<br>state-update<br>전달 콜백: H-e0bb05bdbb9a |

## H-e0bb05bdbb9a

**@callback:setTheme** · [src/ui/math-explorer-plot.tsx:80](../../../src/ui/math-explorer-plot.tsx#L80)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-441943ad8b45

**@callback:useEffect** · [src/ui/math-explorer-plot.tsx:88](../../../src/ui/math-explorer-plot.tsx#L88)

분기 조건과 가능한 갈림길:

- B-6df067990e9c · IfStatement · !element → truthy / falsy; 바깥 조건: 별도 조건식 없음 (90행).
- B-3a6a6b1479e0 · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (102행).
- B-9dfd0d9f5de3 · IfStatement · viewKey.current !== key → truthy / falsy; 바깥 조건: 별도 조건식 없음 (114행).
- B-fa346ff2eccb · IfStatement · viewKey.current → truthy / falsy; 바깥 조건: truthy: viewKey.current !== key (115행).
- B-9d401d93a883 · IfStatement · !viewKey.current && startingView.current → truthy / falsy; 바깥 조건: truthy: viewKey.current !== key (124행).
- B-b6f94667daab · IfStatement · startingView.current.camera → truthy / falsy; 바깥 조건: truthy: viewKey.current !== key ∧ truthy: !viewKey.current && startingView.current (125행).
- B-689e843a1066 · IfStatement · startingView.current.ranges → truthy / falsy; 바깥 조건: truthy: viewKey.current !== key ∧ truthy: !viewKey.current && startingView.current (127행).
- B-36a7cc578bfd · IfStatement · scene.mode === 'curve' && pointFocus.current && result.point → truthy / falsy; 바깥 조건: 별도 조건식 없음 (134행).
- B-d46b2b232b36 · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (155행).
- B-93d77ea6128d · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (160행).
- B-48aef80d3856 · IfStatement · result.point → truthy / falsy; 바깥 조건: 별도 조건식 없음 (164행).
- B-80905872acc7 · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: result.point (168행).
- B-6e780a80c704 · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: result.point (187행).
- B-447bd6d98b0c · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: result.point (196행).
- B-6ce4fceefbf2 · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: result.point (197행).
- B-031573513e82 · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: result.point (198행).
- B-abac8682a19f · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: result.point (209행).
- B-109f5eaeb989 · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: result.point (210행).
- B-40b1e19f480a · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: result.point (213행).
- B-f4d5ae68ae3f · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (317행).
- B-4836b41d92cb · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (320행).
- B-8369870a037f · ConditionalExpression · scene.mode === 'curve' && layout.scene → truthy / falsy; 바깥 조건: 별도 조건식 없음 (367행).
- B-e9d86b4267ef · IfStatement · world → truthy / falsy; 바깥 조건: 별도 조건식 없음 (368행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 93행 | 별도 조건식 없음 | plotlyMathLabels(element)<br>call |
| 94행 | 별도 조건식 없음 | getComputedStyle(element)<br>call |
| 96행 | 별도 조건식 없음 | color('--color-text')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 97행 | 별도 조건식 없음 | color('--color-math-curve')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 98행 | 별도 조건식 없음 | color('--color-math-point')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 99행 | 별도 조건식 없음 | color('--color-math-tangent')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 100행 | 별도 조건식 없음 | color('--color-math-normal')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 101행 | 별도 조건식 없음 | color('--color-math-binormal')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 103행 | 별도 조건식 없음 | result.points.filter((point) => point !== null)<br>call<br>전달 콜백: H-bcb295beac50 |
| 104행 | 별도 조건식 없음 | [0, 1, 2].map((i) => finite.length ? [Math.min(...finite.map((v) => v[i])), Math.max(...finite.map((v) => v[i]))] : [-1, 1])<br>call<br>전달 콜백: H-51cc78d444d0 |
| 109행 | 별도 조건식 없음 | sceneMetric(bounds)<br>call |
| 111행 | 별도 조건식 없음 | Math.max(...bounds.map(([min, max]) => max - min))<br>call |
| 111행 | 별도 조건식 없음 | bounds.map(([min, max]) => max - min)<br>call<br>전달 콜백: H-2dfdb3eeba3d |
| 112행 | 별도 조건식 없음 | Math.max(extent * 0.18, 0.5)<br>call |
| 117행 | truthy: viewKey.current !== key ∧ truthy: viewKey.current | setPointFocused(false)<br>state-update |
| 119행 | truthy: viewKey.current !== key | defaultMathCamera()<br>call → [H-1b3a7af48194](ui__math-plot-camera.md#h-1b3a7af48194) |
| 135행 | truthy: scene.mode === 'curve' && pointFocus.current && result.point | focusPointCamera(camera.current, result.point, metric)<br>input-control → [H-73ca7c21e32e](ui__math-plot-camera.md#h-73ca7c21e32e) |
| 153행 | 별도 조건식 없음 | coordinates(0)<br>call → [H-1a4ab37837c5](ui__math-explorer-plot.md#h-1a4ab37837c5) |
| 154행 | 별도 조건식 없음 | coordinates(1)<br>call → [H-1a4ab37837c5](ui__math-explorer-plot.md#h-1a4ab37837c5) |
| 155행 | truthy: scene.mode === 'curve' | coordinates(2)<br>call → [H-1a4ab37837c5](ui__math-explorer-plot.md#h-1a4ab37837c5) |
| 181행 | truthy: result.point | traces.push({ type, mode: 'lines', name: '좌표 보조선', x: guideCoordinates(0), y: guideCoordinates(1), ...(scene.mode === 'curve' ? { z: guideCoordinates(2) } : {}), line: { color: color('--color-muted'), width: 1, dash: 'dash' }, hoverinfo: 'skip', showlegend: false, })<br>call |
| 185행 | truthy: result.point | guideCoordinates(0)<br>call → [H-fdc91dbd91a1](ui__math-explorer-plot.md#h-fdc91dbd91a1) |
| 186행 | truthy: result.point | guideCoordinates(1)<br>call → [H-fdc91dbd91a1](ui__math-explorer-plot.md#h-fdc91dbd91a1) |
| 187행 | truthy: result.point ∧ truthy: scene.mode === 'curve' | guideCoordinates(2)<br>call → [H-fdc91dbd91a1](ui__math-explorer-plot.md#h-fdc91dbd91a1) |
| 188행 | truthy: result.point | color('--color-muted')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 192행 | truthy: result.point | traces.push({ type, mode: 'markers', name: '축 위 좌표', x: [p[0], 0, ...(scene.mode === 'curve' ? [0] : [])], y: [0, p[1], ...(scene.mode === 'curve' ? [0] : [])], ...(scene.mode === 'curve' ? { z: [0, 0, p[2]] } : {}), marker: { color: blue, size: 3, symbol: 'circle-open', line: { color: blue, width: 1 } }, hoverinfo: 'skip', showlegend: false, })<br>call |
| 203행 | truthy: result.point | traces.push({ type, mode: 'markers', name: '현재 점', x: [p[0]], y: [p[1]], ...(scene.mode === 'curve' ? { z: [p[2]] } : {}), marker: { color: blue, size: scene.mode === 'curve' ? 4 : 7 }, hovertemplate: 'x=%{x:.2f}<br>y=%{y:.2f}' + (scene.mode === 'curve' ? '<br>z=%{z:.2f}' : '') + '<extra>현재 점</extra>', })<br>call |
| 299행 | 별도 조건식 없음 | color('--color-muted')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 300행 | 별도 조건식 없음 | numberStyle(0)<br>call → [H-703082a517bb](ui__math-explorer-plot.md#h-703082a517bb) |
| 301행 | 별도 조건식 없음 | color('--color-border')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 302행 | 별도 조건식 없음 | color('--color-muted')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 334행 | 별도 조건식 없음 | numberStyle(1)<br>call → [H-703082a517bb](ui__math-explorer-plot.md#h-703082a517bb) |
| 352행 | 별도 조건식 없음 | numberStyle(1)<br>call → [H-703082a517bb](ui__math-explorer-plot.md#h-703082a517bb) |
| 358행 | 별도 조건식 없음 | numberStyle(2)<br>call → [H-703082a517bb](ui__math-explorer-plot.md#h-703082a517bb) |
| 362행 | 별도 조건식 없음 | renderMathCamera(camera.current)<br>call → [H-c6458d928995](ui__math-plot-camera.md#h-c6458d928995) |
| 363행 | 별도 조건식 없음 | vectorAnnotations()<br>call → [H-d6c7f42df9a2](ui__math-explorer-plot.md#h-d6c7f42df9a2) |
| 367행 | truthy: scene.mode === 'curve' && layout.scene | prepareUnboundedScene(layout.scene, bounds, element.clientWidth, element.clientHeight, {grid:color('--color-border'),axis:color('--color-muted'),background:color('--color-surface')}, camera.current)<br>call |
| 367행 | truthy: scene.mode === 'curve' && layout.scene | color('--color-border')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 367행 | truthy: scene.mode === 'curve' && layout.scene | color('--color-muted')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 367행 | truthy: scene.mode === 'curve' && layout.scene | color('--color-surface')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 369행 | truthy: world | traces.push(...world.scaffold.traces)<br>call |
| 378행 | 별도 조건식 없음 | Plotly.react(element, traces, layout, mathPlotConfig)<br>      .then(() => {<br>        if (!active) return;<br>        setError('');<br>        infinite = world ? followUnboundedScene(element,world,scaffoldIndex,{sample:result.sample,range:[result.min,result.max],index:0,signature:result.sampleKey,cache:curveCache.current},()=>camera.current) : followUnboundedFunction(element,result.sample,result.sampleKey,curveCache.current);<br>        if (!listening.current) {<br>          (element as HTMLDivElement & PlotlyHTMLElement).on('plotly_relayout', (update) => {<br>            // Published event typing covers 2D only; the documented 3D event includes scene.camera.<br>            const event = update as unknown as Record<string, unknown>;<br>            if (event['scene.camera']) camera.current = recoverMathCamera(event['scene.camera'] as Partial<Camera>, camera.current);<br>            for (const [index, axisName] of ['xaxis', 'yaxis'].entries()) {<br>              const range = event[`${axisName}.range`] as number[] \| undefined;<br>              if (range) ranges.current[index] = range;<br>              for (const edge of [0, 1]) {<br>                const value = event[`${axisName}.range[${edge}]`];<br>                if (typeof value === 'number') ranges.current[index][edge] = value;<br>              }<br>            }<br>            if (Object.keys(event).some((key) => key === 'scene.camera' \|\| key.includes('.range')))<br>              rememberView();<br>            if (<br>              Object.keys(event).some(<br>                (key) =><br>                  key === 'scene.camera' \|\|<br>                  key.includes('.range') \|\|<br>                  key === 'width' \|\|<br>                  key === 'height',<br>              )<br>            )<br>              numbers.current?.update();<br>          });<br>          listening.current = true;<br>        }<br>        numbers.current?.dispose();<br>        const gray = readPlotColor(element, '--color-muted');<br>        const fade = scene.mode === 'function' ? fadeNumbers(element, (opacity) => {<br>          numberValues.current = opacity;<br>          // SVG opacity preserves the temporary ranges of an active 2D pan.<br>          ['.xtick text', '.ytick text'].forEach((selector, i) => {<br>            for (const text of element.querySelectorAll<SVGTextElement>(selector)) {<br>              text.style.fill = `rgb(${gray.join(',')})`;<br>              text.style.opacity = String(opacity[i]);<br>            }<br>          });<br>        }, numberValues.current) : undefined;<br>        numbers.current = {<br>          update() {<br>            updateVectors();<br>            infinite?.update();<br>            fade?.update([<br>              element.clientWidth / Math.max(ranges.current[0][1] - ranges.current[0][0], Number.EPSILON),<br>              element.clientHeight / Math.max(ranges.current[1][1] - ranges.current[1][0], Number.EPSILON),<br>            ]);<br>          },<br>          dispose: () => fade?.dispose(),<br>        };<br>        numbers.current.update();<br>        zoomRef.current = (factor) => {<br>          if (!Number.isFinite(factor) \|\| factor <= 0) return;<br>          let update: Record<string, unknown>;<br>          if (scene.mode === 'curve') {<br>            camera.current = zoomCamera(camera.current, factor);<br>            update = { 'scene.camera': renderMathCamera(camera.current) };<br>          } else {<br>            ranges.current = ranges.current.map(([low, high]) => {<br>              const center = (low + high) / 2,<br>                half = (high - low) / (2 * factor);<br>              return half > 1e-8 && half < 1e9 ? [center - half, center + half] : [low, high];<br>            }) as [number[], number[]];<br>            update = { 'xaxis.range': ranges.current[0], 'yaxis.range': ranges.current[1] };<br>          }<br>          void Plotly.relayout(element, update).then(() => numbers.current?.update()).catch(() => {<br>            setError('확대·축소하지 못했습니다. 화면을 다시 열어 주세요.');<br>            onZoomReady(false);<br>          });<br>        };<br>        pan.current =<br>          scene.mode === 'function'<br>            ? mathPlotPan(<br>                element,<br>                () => ranges.current,<br>                (next) => {<br>                  ranges.current = next as [number[], number[]];<br>                  void Plotly.relayout(element, {<br>                    'xaxis.range': next[0],<br>                    'yaxis.range': next[1],<br>                  } as Partial<Layout> & Record<string, unknown>).catch(() =><br>                    setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'),<br>                  );<br>                },<br>              )<br>            : null;<br>        setReady(true);<br>        onZoomReady(true);<br>        rememberView();<br>      })<br>      .catch(() => { if (active) { setReady(false); onZoomReady(false); setError('그래프를 표시하지 못했습니다. 브라우저의 그래픽 지원을 확인해 주세요.'); } })<br>preservation-boundary<br>전달 콜백: H-14e5866cb967 |
| 378행 | 별도 조건식 없음 | Plotly.react(element, traces, layout, mathPlotConfig)<br>      .then(() => { if (!active) return; setError(''); infinite = world ? followUnboundedScene(element,world,scaffoldIndex,{sample:result.sample,range:[result.min,result.max],index:0,signature:result.sampleKey,cache:curveCache.current},()=>camera.current) : followUnboundedFunction(element,result.sample,result.sampleKey,curveCache.current); if (!listening.current) { (element as HTMLDivElement & PlotlyHTMLElement).on('plotly_relayout', (update) => { // Published event typing covers 2D only; the documented 3D event includes scene.camera. const event = update as unknown as Record<string, unknown>; if (event['scene.camera']) camera.current = recoverMathCamera(event['scene.camera'] as Partial<Camera>, camera. … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-4592f9236973 |
| 378행 | 별도 조건식 없음 | Plotly.react(element, traces, layout, mathPlotConfig)<br>call |

반환/조기 중단: 90행 <render> [truthy: !element]; 481행 () => { active = false; infinite?.dispose(); pan.current = null; disposeLabels(); cancelAnimationFrame(vectorFrame); numbers.current?.dispose(); } [별도 조건식 없음]

## H-d8e696802c80

**color** · [src/ui/math-explorer-plot.tsx:95](../../../src/ui/math-explorer-plot.tsx#L95)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 95행 | 별도 조건식 없음 | styles.getPropertyValue(name).trim()<br>call |
| 95행 | 별도 조건식 없음 | styles.getPropertyValue(name)<br>call |

## H-bcb295beac50

**@callback:result.points.filter** · [src/ui/math-explorer-plot.tsx:103](../../../src/ui/math-explorer-plot.tsx#L103)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-51cc78d444d0

**@callback:[0, 1, 2].map** · [src/ui/math-explorer-plot.tsx:104](../../../src/ui/math-explorer-plot.tsx#L104)

분기 조건과 가능한 갈림길:

- B-f39645357757 · ConditionalExpression · finite.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (105행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 106행 | truthy: finite.length | Math.min(...finite.map((v) => v[i]))<br>call |
| 106행 | truthy: finite.length | finite.map((v) => v[i])<br>call<br>전달 콜백: H-f3ec5654b926 |
| 106행 | truthy: finite.length | Math.max(...finite.map((v) => v[i]))<br>call |
| 106행 | truthy: finite.length | finite.map((v) => v[i])<br>call<br>전달 콜백: H-469a4954e55e |

## H-f3ec5654b926

**@callback:finite.map** · [src/ui/math-explorer-plot.tsx:106](../../../src/ui/math-explorer-plot.tsx#L106)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-469a4954e55e

**@callback:finite.map** · [src/ui/math-explorer-plot.tsx:106](../../../src/ui/math-explorer-plot.tsx#L106)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2dfdb3eeba3d

**@callback:bounds.map** · [src/ui/math-explorer-plot.tsx:111](../../../src/ui/math-explorer-plot.tsx#L111)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4aea80bdde6d

**rememberView** · [src/ui/math-explorer-plot.tsx:136](../../../src/ui/math-explorer-plot.tsx#L136)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1a4ab37837c5

**coordinates** · [src/ui/math-explorer-plot.tsx:144](../../../src/ui/math-explorer-plot.tsx#L144)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 145행 | 별도 조건식 없음 | result.points.flatMap((point, i) => result.breakBefore[i] ? [null, point?.[index] ?? null] : [point?.[index] ?? null])<br>call<br>전달 콜백: H-b36016639178 |

## H-b36016639178

**@callback:result.points.flatMap** · [src/ui/math-explorer-plot.tsx:145](../../../src/ui/math-explorer-plot.tsx#L145)

분기 조건과 가능한 갈림길:

- B-442da2acae26 · ConditionalExpression · result.breakBefore[i] → truthy / falsy; 바깥 조건: 별도 조건식 없음 (146행).

## H-fdc91dbd91a1

**guideCoordinates** · [src/ui/math-explorer-plot.tsx:179](../../../src/ui/math-explorer-plot.tsx#L179)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 180행 | truthy: result.point | segments.flatMap(([start, end]) => [start[index], end[index], null])<br>call<br>전달 콜백: H-6afae896567d |

## H-6afae896567d

**@callback:segments.flatMap** · [src/ui/math-explorer-plot.tsx:180](../../../src/ui/math-explorer-plot.tsx#L180)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d6c7f42df9a2

**vectorAnnotations** · [src/ui/math-explorer-plot.tsx:221](../../../src/ui/math-explorer-plot.tsx#L221)

분기 조건과 가능한 갈림길:

- B-afd8a45f5661 · IfStatement · scene.mode !== 'curve' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (223행).
- B-6c4e9472c795 · IfStatement · norm(right) < 1e-8 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (229행).
- B-a99ad581b414 · IfStatement · !p || !scene.vectors → truthy / falsy; 바깥 조건: 별도 조건식 없음 (234행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 224행 | 별도 조건식 없음 | cameraOffset(camera.current)<br>call → [H-811d1e268acd](ui__math-plot-camera.md#h-811d1e268acd) |
| 227행 | 별도 조건식 없음 | unit(offset)<br>call → [H-b5f90c85b884](ui__math-explorer-plot.md#h-b5f90c85b884) |
| 228행 | 별도 조건식 없음 | cross([up.x ?? 0, up.y ?? 0, up.z ?? 1], direction)<br>call |
| 229행 | 별도 조건식 없음 | norm(right)<br>call |
| 229행 | truthy: norm(right) < 1e-8 | cross([0, 1, 0], direction)<br>call |
| 230행 | 별도 조건식 없음 | unit(right)<br>call → [H-b5f90c85b884](ui__math-explorer-plot.md#h-b5f90c85b884) |
| 231행 | 별도 조건식 없음 | unit(cross(direction, right))<br>call → [H-b5f90c85b884](ui__math-explorer-plot.md#h-b5f90c85b884) |
| 231행 | 별도 조건식 없음 | cross(direction, right)<br>call |
| 233행 | 별도 조건식 없음 | unboundedAxisAnnotations(metric, camera.current, element.clientWidth, element.clientHeight, {grid:color('--color-border'),axis:color('--color-muted'),background:color('--color-surface')})<br>call |
| 233행 | 별도 조건식 없음 | color('--color-border')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 233행 | 별도 조건식 없음 | color('--color-muted')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 233행 | 별도 조건식 없음 | color('--color-surface')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 235행 | 별도 조건식 없음 | Math.hypot(...offset)<br>call |
| 236행 | 별도 조건식 없음 | Math.max(...bounds.map(([a, b]) => b - a + 2 * length), 1)<br>call |
| 236행 | 별도 조건식 없음 | bounds.map(([a, b]) => b - a + 2 * length)<br>call<br>전달 콜백: H-1362dacf5276 |
| 238행 | 별도 조건식 없음 | Math.min(element.clientWidth, element.clientHeight)<br>call |
| 239행 | 별도 조건식 없음 | Math.max(distance, 0.1)<br>call |
| 242행 | 별도 조건식 없음 | Math.max(32, Math.min( vectorDisplayLimit(element.clientWidth, element.clientHeight), 1.3 * density, ))<br>call |
| 242행 | 별도 조건식 없음 | Math.min(vectorDisplayLimit(element.clientWidth, element.clientHeight), 1.3 * density)<br>call |
| 243행 | 별도 조건식 없음 | vectorDisplayLimit(element.clientWidth, element.clientHeight)<br>call |
| 246행 | 별도 조건식 없음 | (<br>        [<br>          ['T', result.vectors?.T, tangent],<br>          ['N', result.vectors?.N, green],<br>          ['B', result.vectors?.B, binormal],<br>        ] as const<br>      ).flatMap(([name, v, c]) => { if (!v) return []; const ax = dot(v, right) * pixels, ay = -dot(v, vertical) * pixels; return [ { x: p[0], y: p[1], z: p[2], text: name, ax, ay, showarrow: true, arrowside: 'start' as const, arrowhead: 0, startarrowhead: 3, startarrowsize: 1.2, arrowwidth: 1.5, arrowcolor: c, font: { color: c, size: 12 }, bgcolor: color('--color-surface'), visible: Math.hypot(ax, ay) >= 1, }, ]; })<br>call<br>전달 콜백: H-7cc721bdb439 |

반환/조기 중단: 223행 [] [truthy: scene.mode !== 'curve']; 234행 axes [truthy: !p || !scene.vectors]; 277행 [...axes, ...annotations] [별도 조건식 없음]

## H-b5f90c85b884

**unit** · [src/ui/math-explorer-plot.tsx:226](../../../src/ui/math-explorer-plot.tsx#L226)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 226행 | 별도 조건식 없음 | scale(v, 1 / Math.max(norm(v), 1e-12))<br>call |
| 226행 | 별도 조건식 없음 | Math.max(norm(v), 1e-12)<br>call |
| 226행 | 별도 조건식 없음 | norm(v)<br>call |

## H-bb9fe670e03b

**dot** · [src/ui/math-explorer-plot.tsx:232](../../../src/ui/math-explorer-plot.tsx#L232)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 232행 | 별도 조건식 없음 | a.reduce((sum, value, i) => sum + value * b[i], 0)<br>call<br>전달 콜백: H-8b4c269247d2 |

## H-8b4c269247d2

**@callback:a.reduce** · [src/ui/math-explorer-plot.tsx:232](../../../src/ui/math-explorer-plot.tsx#L232)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1362dacf5276

**@callback:bounds.map** · [src/ui/math-explorer-plot.tsx:236](../../../src/ui/math-explorer-plot.tsx#L236)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7cc721bdb439

**@callback:(
        [
          ['T', result.vectors?.T, tangent],
          ['N', result.vectors?.N, green],
          ['B', result.vectors?.B, binormal],
        ] as const
      ).flatMap** · [src/ui/math-explorer-plot.tsx:252](../../../src/ui/math-explorer-plot.tsx#L252)

분기 조건과 가능한 갈림길:

- B-3f946176d61c · IfStatement · !v → truthy / falsy; 바깥 조건: 별도 조건식 없음 (253행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 254행 | 별도 조건식 없음 | dot(v, right)<br>call → [H-bb9fe670e03b](ui__math-explorer-plot.md#h-bb9fe670e03b) |
| 255행 | 별도 조건식 없음 | dot(v, vertical)<br>call → [H-bb9fe670e03b](ui__math-explorer-plot.md#h-bb9fe670e03b) |
| 272행 | 별도 조건식 없음 | color('--color-surface')<br>call → [H-d8e696802c80](ui__math-explorer-plot.md#h-d8e696802c80) |
| 273행 | 별도 조건식 없음 | Math.hypot(ax, ay)<br>call |

반환/조기 중단: 253행 [] [truthy: !v]; 256행 [ { x: p[0], y: p[1], z: p[2], text: name, ax, ay, showarrow: true, arrowside: 'start' as const, arrowhead: 0, startarrowhead: 3, startarrowsize: 1.2, arrowwidth: 1.5, arrowcolor: c, font: { color: c, size: 12 }, bgcolor: color('--color-surface'), visible: Math.hypot(ax, ay) >= 1, }, ] [별도 조건식 없음]

## H-703082a517bb

**numberStyle** · [src/ui/math-explorer-plot.tsx:292](../../../src/ui/math-explorer-plot.tsx#L292)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 294행 | 별도 조건식 없음 | readPlotColor(element, '--color-muted').join(',')<br>call |
| 294행 | 별도 조건식 없음 | readPlotColor(element, '--color-muted')<br>call |

## H-4592f9236973

**@callback:Plotly.react(element, traces, layout, mathPlotConfig)
      .then** · [src/ui/math-explorer-plot.tsx:379](../../../src/ui/math-explorer-plot.tsx#L379)

분기 조건과 가능한 갈림길:

- B-08762c9bd89b · IfStatement · !active → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) (380행).
- B-81379a14c4df · ConditionalExpression · world → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) (382행).
- B-bd8abf758a73 · IfStatement · !listening.current → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) (383행).
- B-88982e465547 · ConditionalExpression · scene.mode === 'function' → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) (413행).
- B-b93b92d981fe · ConditionalExpression · scene.mode === 'function' → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) (455행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 381행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) | setError('')<br>state-update |
| 382행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: world | followUnboundedScene(element, world, scaffoldIndex, {sample:result.sample,range:[result.min,result.max],index:0,signature:result.sampleKey,cache:curveCache.current}, ()=>camera.current)<br>call<br>전달 콜백: H-6e032178db6d |
| 382행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ falsy: world | followUnboundedFunction(element, result.sample, result.sampleKey, curveCache.current)<br>call |
| 384행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !listening.current | (element as HTMLDivElement & PlotlyHTMLElement).on('plotly_relayout', (update) => { // Published event typing covers 2D only; the documented 3D event includes scene.camera. const event = update as unknown as Record<string, unknown>; if (event['scene.camera']) camera.current = recoverMathCamera(event['scene.camera'] as Partial<Camera>, camera.current); for (const [index, axisName] of ['xaxis', 'yaxis'].entries()) { const range = event[`${axisName}.range`] as number[] \| undefined; if (range) ranges.current[index] = range; for (const edge of [0, 1]) { const value = event[`${axisName}.range[${edge}]`]; if (typeof value === 'number') ranges.current[index][edge] = value; } } if (Object.keys(event).some((key) => key === 'scene.camera' \|\| key.includ … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-c2551e1b49d6 |
| 412행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) | readPlotColor(element, '--color-muted')<br>call |
| 413행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: scene.mode === 'function' | fadeNumbers(element, (opacity) => { numberValues.current = opacity; // SVG opacity preserves the temporary ranges of an active 2D pan. ['.xtick text', '.ytick text'].forEach((selector, i) => { for (const text of element.querySelectorAll<SVGTextElement>(selector)) { text.style.fill = `rgb(${gray.join(',')})`; text.style.opacity = String(opacity[i]); } }); }, numberValues.current)<br>call<br>전달 콜백: H-99bc72b76e6a |
| 434행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) | numbers.current.update()<br>call |
| 456행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: scene.mode === 'function' | mathPlotPan(element, () => ranges.current, (next) => { ranges.current = next as [number[], number[]]; void Plotly.relayout(element, { 'xaxis.range': next[0], 'yaxis.range': next[1], } as Partial<Layout> & Record<string, unknown>).catch(() => setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'), ); })<br>call<br>전달 콜백: H-005668faed2e, H-235807445885 |
| 470행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) | setReady(true)<br>state-update |
| 471행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) | onZoomReady(true)<br>call |
| 472행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) | rememberView()<br>call → [H-4aea80bdde6d](ui__math-explorer-plot.md#h-4aea80bdde6d) |

반환/조기 중단: 380행 <render> [fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !active]

## H-6e032178db6d

**@callback:followUnboundedScene** · [src/ui/math-explorer-plot.tsx:382](../../../src/ui/math-explorer-plot.tsx#L382)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c2551e1b49d6

**@callback:(element as HTMLDivElement & PlotlyHTMLElement).on** · [src/ui/math-explorer-plot.tsx:384](../../../src/ui/math-explorer-plot.tsx#L384)

분기 조건과 가능한 갈림길:

- B-dfe1137d5a4a · IfStatement · event['scene.camera'] → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !listening.current (387행).
- B-1b56415d345a · IfStatement · range → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !listening.current (390행).
- B-fe899b80d9d6 · IfStatement · typeof value === 'number' → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !listening.current (393행).
- B-e5276f490225 · IfStatement · Object.keys(event).some((key) => key === 'scene.camera' || key.includes('.range')) → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !listening.current (396행).
- B-d2f4f3832fb8 · IfStatement · Object.keys(event).some( (key) => key === 'scene.camera' || key.includes('.range') || key === 'width' || key === 'height', ) → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !listening.current (398행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 387행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !listening.current ∧ truthy: event['scene.camera'] | recoverMathCamera(event['scene.camera'] as Partial<Camera>, camera.current)<br>call → [H-f31d101b18e6](ui__math-plot-camera.md#h-f31d101b18e6) |
| 388행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !listening.current | ['xaxis', 'yaxis'].entries()<br>call |
| 396행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !listening.current | Object.keys(event).some((key) => key === 'scene.camera' \|\| key.includes('.range'))<br>call<br>전달 콜백: H-f6df371f4a08 |
| 396행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !listening.current | Object.keys(event)<br>call |
| 397행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !listening.current ∧ truthy: Object.keys(event).some((key) => key === 'scene.camera' \|\| key.includes('.range')) | rememberView()<br>call → [H-4aea80bdde6d](ui__math-explorer-plot.md#h-4aea80bdde6d) |
| 399행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !listening.current | Object.keys(event).some((key) => key === 'scene.camera' \|\| key.includes('.range') \|\| key === 'width' \|\| key === 'height')<br>call<br>전달 콜백: H-cab058add219 |
| 399행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !listening.current | Object.keys(event)<br>call |

## H-f6df371f4a08

**@callback:Object.keys(event).some** · [src/ui/math-explorer-plot.tsx:396](../../../src/ui/math-explorer-plot.tsx#L396)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 396행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !listening.current ∧ falsy: key === 'scene.camera' | key.includes('.range')<br>call |

## H-cab058add219

**@callback:Object.keys(event).some** · [src/ui/math-explorer-plot.tsx:400](../../../src/ui/math-explorer-plot.tsx#L400)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 402행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: !listening.current ∧ falsy: key === 'scene.camera' | key.includes('.range')<br>call |

## H-99bc72b76e6a

**@callback:fadeNumbers** · [src/ui/math-explorer-plot.tsx:413](../../../src/ui/math-explorer-plot.tsx#L413)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 416행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: scene.mode === 'function' | ['.xtick text', '.ytick text'].forEach((selector, i) => { for (const text of element.querySelectorAll<SVGTextElement>(selector)) { text.style.fill = `rgb(${gray.join(',')})`; text.style.opacity = String(opacity[i]); } })<br>call<br>전달 콜백: H-6c8b2c73eb88 |

## H-6c8b2c73eb88

**@callback:['.xtick text', '.ytick text'].forEach** · [src/ui/math-explorer-plot.tsx:416](../../../src/ui/math-explorer-plot.tsx#L416)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 417행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: scene.mode === 'function' | element.querySelectorAll(selector)<br>call |
| 418행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: scene.mode === 'function' | gray.join(',')<br>call |
| 419행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: scene.mode === 'function' | String(opacity[i])<br>call |

## H-005668faed2e

**@callback:mathPlotPan** · [src/ui/math-explorer-plot.tsx:458](../../../src/ui/math-explorer-plot.tsx#L458)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-235807445885

**@callback:mathPlotPan** · [src/ui/math-explorer-plot.tsx:459](../../../src/ui/math-explorer-plot.tsx#L459)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 461행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: scene.mode === 'function' | Plotly.relayout(element, {<br>                    'xaxis.range': next[0],<br>                    'yaxis.range': next[1],<br>                  } as Partial<Layout> & Record<string, unknown>).catch(() => setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'))<br>call<br>전달 콜백: H-aa3c8c578270 |
| 461행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: scene.mode === 'function' | Plotly.relayout(element, { 'xaxis.range': next[0], 'yaxis.range': next[1], } as Partial<Layout> & Record<string, unknown>)<br>call |

## H-aa3c8c578270

**@callback:Plotly.relayout(element, {
                    'xaxis.range': next[0],
                    'yaxis.range': next[1],
                  } as Partial<Layout> & Record<string, unknown>).catch** · [src/ui/math-explorer-plot.tsx:464](../../../src/ui/math-explorer-plot.tsx#L464)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 465행 | fulfilled-or-explicit-rejection-handler: Plotly.react(element, traces, layout, mathPlotConfig) ∧ truthy: scene.mode === 'function' ∧ rejected: Plotly.relayout(element, {<br>                    'xaxis.range': next[0],<br>                    'yaxis.range': next[1],<br>                  } as Partial<Layout> & Record<string, unknown>) | setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.')<br>state-update |

## H-14e5866cb967

**@callback:Plotly.react(element, traces, layout, mathPlotConfig)
      .then(() => {
        if (!active) return;
        setError('');
        infinite = world ? followUnboundedScene(element,world,scaffoldIndex,{sample:result.sample,range:[result.min,result.max],index:0,signature:result.sampleKey,cache:curveCache.current},()=>camera.current) : followUnboundedFunction(element,result.sample,result.sampleKey,curveCache.current);
        if (!listening.current) {
          (element as HTMLDivElement & PlotlyHTMLElement).on('plotly_relayout', (update) => {
            // Published event typing covers 2D only; the documented 3D event includes scene.camera.
            const event = update as unknown as Record<string, unknown>;
            if (event['scene.camera']) camera.current = recoverMathCamera(event['scene.camera'] as Partial<Camera>, camera.current);
            for (const [index, axisName] of ['xaxis', 'yaxis'].entries()) {
              const range = event[`${axisName}.range`] as number[] | undefined;
              if (range) ranges.current[index] = range;
              for (const edge of [0, 1]) {
                const value = event[`${axisName}.range[${edge}]`];
                if (typeof value === 'number') ranges.current[index][edge] = value;
              }
            }
            if (Object.keys(event).some((key) => key === 'scene.camera' || key.includes('.range')))
              rememberView();
            if (
              Object.keys(event).some(
                (key) =>
                  key === 'scene.camera' ||
                  key.includes('.range') ||
                  key === 'width' ||
                  key === 'height',
              )
            )
              numbers.current?.update();
          });
          listening.current = true;
        }
        numbers.current?.dispose();
        const gray = readPlotColor(element, '--color-muted');
        const fade = scene.mode === 'function' ? fadeNumbers(element, (opacity) => {
          numberValues.current = opacity;
          // SVG opacity preserves the temporary ranges of an active 2D pan.
          ['.xtick text', '.ytick text'].forEach((selector, i) => {
            for (const text of element.querySelectorAll<SVGTextElement>(selector)) {
              text.style.fill = `rgb(${gray.join(',')})`;
              text.style.opacity = String(opacity[i]);
            }
          });
        }, numberValues.current) : undefined;
        numbers.current = {
          update() {
            updateVectors();
            infinite?.update();
            fade?.update([
              element.clientWidth / Math.max(ranges.current[0][1] - ranges.current[0][0], Number.EPSILON),
              element.clientHeight / Math.max(ranges.current[1][1] - ranges.current[1][0], Number.EPSILON),
            ]);
          },
          dispose: () => fade?.dispose(),
        };
        numbers.current.update();
        zoomRef.current = (factor) => {
          if (!Number.isFinite(factor) || factor <= 0) return;
          let update: Record<string, unknown>;
          if (scene.mode === 'curve') {
            camera.current = zoomCamera(camera.current, factor);
            update = { 'scene.camera': renderMathCamera(camera.current) };
          } else {
            ranges.current = ranges.current.map(([low, high]) => {
              const center = (low + high) / 2,
                half = (high - low) / (2 * factor);
              return half > 1e-8 && half < 1e9 ? [center - half, center + half] : [low, high];
            }) as [number[], number[]];
            update = { 'xaxis.range': ranges.current[0], 'yaxis.range': ranges.current[1] };
          }
          void Plotly.relayout(element, update).then(() => numbers.current?.update()).catch(() => {
            setError('확대·축소하지 못했습니다. 화면을 다시 열어 주세요.');
            onZoomReady(false);
          });
        };
        pan.current =
          scene.mode === 'function'
            ? mathPlotPan(
                element,
                () => ranges.current,
                (next) => {
                  ranges.current = next as [number[], number[]];
                  void Plotly.relayout(element, {
                    'xaxis.range': next[0],
                    'yaxis.range': next[1],
                  } as Partial<Layout> & Record<string, unknown>).catch(() =>
                    setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'),
                  );
                },
              )
            : null;
        setReady(true);
        onZoomReady(true);
        rememberView();
      })
      .catch** · [src/ui/math-explorer-plot.tsx:474](../../../src/ui/math-explorer-plot.tsx#L474)

분기 조건과 가능한 갈림길:

- B-d170bfae85ae · IfStatement · active → truthy / falsy; 바깥 조건: rejected: Plotly.react(element, traces, layout, mathPlotConfig)
      .then(() => {
        if (!active) return;
        setError('');
        infinite = world ? followUnboundedScene(element,world,scaffoldIndex,{sample:result.sample,range:[result.min,result.max],index:0,signature:result.sampleKey,cache:curveCache.current},()=>camera.current) : followUnboundedFunction(element,result.sample,result.sampleKey,curveCache.current);
        if (!listening.current) {
          (element as HTMLDivElement & PlotlyHTMLElement).on('plotly_relayout', (update) => {
            // Published event typing covers 2D only; the documented 3D event includes scene.camera.
            const event = update as unknown as Record<string, unknown>;
            if (event['scene.camera']) camera.current = recoverMathCamera(event['scene.camera'] as Partial<Camera>, camera.current);
            for (const [index, axisName] of ['xaxis', 'yaxis'].entries()) {
              const range = event[`${axisName}.range`] as number[] | undefined;
              if (range) ranges.current[index] = range;
              for (const edge of [0, 1]) {
                const value = event[`${axisName}.range[${edge}]`];
                if (typeof value === 'number') ranges.current[index][edge] = value;
              }
            }
            if (Object.keys(event).some((key) => key === 'scene.camera' || key.includes('.range')))
              rememberView();
            if (
              Object.keys(event).some(
                (key) =>
                  key === 'scene.camera' ||
                  key.includes('.range') ||
                  key === 'width' ||
                  key === 'height',
              )
            )
              numbers.current?.update();
          });
          listening.current = true;
        }
        numbers.current?.dispose();
        const gray = readPlotColor(element, '--color-muted');
        const fade = scene.mode === 'function' ? fadeNumbers(element, (opacity) => {
          numberValues.current = opacity;
          // SVG opacity preserves the temporary ranges of an active 2D pan.
          ['.xtick text', '.ytick text'].forEach((selector, i) => {
            for (const text of element.querySelectorAll<SVGTextElement>(selector)) {
              text.style.fill = `rgb(${gray.join(',')})`;
              text.style.opacity = String(opacity[i]);
            }
          });
        }, numberValues.current) : undefined;
        numbers.current = {
          update() {
            updateVectors();
            infinite?.update();
            fade?.update([
              element.clientWidth / Math.max(ranges.current[0][1] - ranges.current[0][0], Number.EPSILON),
              element.clientHeight / Math.max(ranges.current[1][1] - ranges.current[1][0], Number.EPSILON),
            ]);
          },
          dispose: () => fade?.dispose(),
        };
        numbers.current.update();
        zoomRef.current = (factor) => {
          if (!Number.isFinite(factor) || factor <= 0) return;
          let update: Record<string, unknown>;
          if (scene.mode === 'curve') {
            camera.current = zoomCamera(camera.current, factor);
            update = { 'scene.camera': renderMathCamera(camera.current) };
          } else {
            ranges.current = ranges.current.map(([low, high]) => {
              const center = (low + high) / 2,
                half = (high - low) / (2 * factor);
              return half > 1e-8 && half < 1e9 ? [center - half, center + half] : [low, high];
            }) as [number[], number[]];
            update = { 'xaxis.range': ranges.current[0], 'yaxis.range': ranges.current[1] };
          }
          void Plotly.relayout(element, update).then(() => numbers.current?.update()).catch(() => {
            setError('확대·축소하지 못했습니다. 화면을 다시 열어 주세요.');
            onZoomReady(false);
          });
        };
        pan.current =
          scene.mode === 'function'
            ? mathPlotPan(
                element,
                () => ranges.current,
                (next) => {
                  ranges.current = next as [number[], number[]];
                  void Plotly.relayout(element, {
                    'xaxis.range': next[0],
                    'yaxis.range': next[1],
                  } as Partial<Layout> & Record<string, unknown>).catch(() =>
                    setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'),
                  );
                },
              )
            : null;
        setReady(true);
        onZoomReady(true);
        rememberView();
      }) (475행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 476행 | rejected: Plotly.react(element, traces, layout, mathPlotConfig)<br>      .then(() => {<br>        if (!active) return;<br>        setError('');<br>        infinite = world ? followUnboundedScene(element,world,scaffoldIndex,{sample:result.sample,range:[result.min,result.max],index:0,signature:result.sampleKey,cache:curveCache.current},()=>camera.current) : followUnboundedFunction(element,result.sample,result.sampleKey,curveCache.current);<br>        if (!listening.current) {<br>          (element as HTMLDivElement & PlotlyHTMLElement).on('plotly_relayout', (update) => {<br>            // Published event typing covers 2D only; the documented 3D event includes scene.camera.<br>            const event = update as unknown as Record<string, unknown>;<br>            if (event['scene.camera']) camera.current = recoverMathCamera(event['scene.camera'] as Partial<Camera>, camera.current);<br>            for (const [index, axisName] of ['xaxis', 'yaxis'].entries()) {<br>              const range = event[`${axisName}.range`] as number[] \| undefined;<br>              if (range) ranges.current[index] = range;<br>              for (const edge of [0, 1]) {<br>                const value = event[`${axisName}.range[${edge}]`];<br>                if (typeof value === 'number') ranges.current[index][edge] = value;<br>              }<br>            }<br>            if (Object.keys(event).some((key) => key === 'scene.camera' \|\| key.includes('.range')))<br>              rememberView();<br>            if (<br>              Object.keys(event).some(<br>                (key) =><br>                  key === 'scene.camera' \|\|<br>                  key.includes('.range') \|\|<br>                  key === 'width' \|\|<br>                  key === 'height',<br>              )<br>            )<br>              numbers.current?.update();<br>          });<br>          listening.current = true;<br>        }<br>        numbers.current?.dispose();<br>        const gray = readPlotColor(element, '--color-muted');<br>        const fade = scene.mode === 'function' ? fadeNumbers(element, (opacity) => {<br>          numberValues.current = opacity;<br>          // SVG opacity preserves the temporary ranges of an active 2D pan.<br>          ['.xtick text', '.ytick text'].forEach((selector, i) => {<br>            for (const text of element.querySelectorAll<SVGTextElement>(selector)) {<br>              text.style.fill = `rgb(${gray.join(',')})`;<br>              text.style.opacity = String(opacity[i]);<br>            }<br>          });<br>        }, numberValues.current) : undefined;<br>        numbers.current = {<br>          update() {<br>            updateVectors();<br>            infinite?.update();<br>            fade?.update([<br>              element.clientWidth / Math.max(ranges.current[0][1] - ranges.current[0][0], Number.EPSILON),<br>              element.clientHeight / Math.max(ranges.current[1][1] - ranges.current[1][0], Number.EPSILON),<br>            ]);<br>          },<br>          dispose: () => fade?.dispose(),<br>        };<br>        numbers.current.update();<br>        zoomRef.current = (factor) => {<br>          if (!Number.isFinite(factor) \|\| factor <= 0) return;<br>          let update: Record<string, unknown>;<br>          if (scene.mode === 'curve') {<br>            camera.current = zoomCamera(camera.current, factor);<br>            update = { 'scene.camera': renderMathCamera(camera.current) };<br>          } else {<br>            ranges.current = ranges.current.map(([low, high]) => {<br>              const center = (low + high) / 2,<br>                half = (high - low) / (2 * factor);<br>              return half > 1e-8 && half < 1e9 ? [center - half, center + half] : [low, high];<br>            }) as [number[], number[]];<br>            update = { 'xaxis.range': ranges.current[0], 'yaxis.range': ranges.current[1] };<br>          }<br>          void Plotly.relayout(element, update).then(() => numbers.current?.update()).catch(() => {<br>            setError('확대·축소하지 못했습니다. 화면을 다시 열어 주세요.');<br>            onZoomReady(false);<br>          });<br>        };<br>        pan.current =<br>          scene.mode === 'function'<br>            ? mathPlotPan(<br>                element,<br>                () => ranges.current,<br>                (next) => {<br>                  ranges.current = next as [number[], number[]];<br>                  void Plotly.relayout(element, {<br>                    'xaxis.range': next[0],<br>                    'yaxis.range': next[1],<br>                  } as Partial<Layout> & Record<string, unknown>).catch(() =><br>                    setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'),<br>                  );<br>                },<br>              )<br>            : null;<br>        setReady(true);<br>        onZoomReady(true);<br>        rememberView();<br>      }) ∧ truthy: active | setReady(false)<br>state-update |
| 477행 | rejected: Plotly.react(element, traces, layout, mathPlotConfig)<br>      .then(() => {<br>        if (!active) return;<br>        setError('');<br>        infinite = world ? followUnboundedScene(element,world,scaffoldIndex,{sample:result.sample,range:[result.min,result.max],index:0,signature:result.sampleKey,cache:curveCache.current},()=>camera.current) : followUnboundedFunction(element,result.sample,result.sampleKey,curveCache.current);<br>        if (!listening.current) {<br>          (element as HTMLDivElement & PlotlyHTMLElement).on('plotly_relayout', (update) => {<br>            // Published event typing covers 2D only; the documented 3D event includes scene.camera.<br>            const event = update as unknown as Record<string, unknown>;<br>            if (event['scene.camera']) camera.current = recoverMathCamera(event['scene.camera'] as Partial<Camera>, camera.current);<br>            for (const [index, axisName] of ['xaxis', 'yaxis'].entries()) {<br>              const range = event[`${axisName}.range`] as number[] \| undefined;<br>              if (range) ranges.current[index] = range;<br>              for (const edge of [0, 1]) {<br>                const value = event[`${axisName}.range[${edge}]`];<br>                if (typeof value === 'number') ranges.current[index][edge] = value;<br>              }<br>            }<br>            if (Object.keys(event).some((key) => key === 'scene.camera' \|\| key.includes('.range')))<br>              rememberView();<br>            if (<br>              Object.keys(event).some(<br>                (key) =><br>                  key === 'scene.camera' \|\|<br>                  key.includes('.range') \|\|<br>                  key === 'width' \|\|<br>                  key === 'height',<br>              )<br>            )<br>              numbers.current?.update();<br>          });<br>          listening.current = true;<br>        }<br>        numbers.current?.dispose();<br>        const gray = readPlotColor(element, '--color-muted');<br>        const fade = scene.mode === 'function' ? fadeNumbers(element, (opacity) => {<br>          numberValues.current = opacity;<br>          // SVG opacity preserves the temporary ranges of an active 2D pan.<br>          ['.xtick text', '.ytick text'].forEach((selector, i) => {<br>            for (const text of element.querySelectorAll<SVGTextElement>(selector)) {<br>              text.style.fill = `rgb(${gray.join(',')})`;<br>              text.style.opacity = String(opacity[i]);<br>            }<br>          });<br>        }, numberValues.current) : undefined;<br>        numbers.current = {<br>          update() {<br>            updateVectors();<br>            infinite?.update();<br>            fade?.update([<br>              element.clientWidth / Math.max(ranges.current[0][1] - ranges.current[0][0], Number.EPSILON),<br>              element.clientHeight / Math.max(ranges.current[1][1] - ranges.current[1][0], Number.EPSILON),<br>            ]);<br>          },<br>          dispose: () => fade?.dispose(),<br>        };<br>        numbers.current.update();<br>        zoomRef.current = (factor) => {<br>          if (!Number.isFinite(factor) \|\| factor <= 0) return;<br>          let update: Record<string, unknown>;<br>          if (scene.mode === 'curve') {<br>            camera.current = zoomCamera(camera.current, factor);<br>            update = { 'scene.camera': renderMathCamera(camera.current) };<br>          } else {<br>            ranges.current = ranges.current.map(([low, high]) => {<br>              const center = (low + high) / 2,<br>                half = (high - low) / (2 * factor);<br>              return half > 1e-8 && half < 1e9 ? [center - half, center + half] : [low, high];<br>            }) as [number[], number[]];<br>            update = { 'xaxis.range': ranges.current[0], 'yaxis.range': ranges.current[1] };<br>          }<br>          void Plotly.relayout(element, update).then(() => numbers.current?.update()).catch(() => {<br>            setError('확대·축소하지 못했습니다. 화면을 다시 열어 주세요.');<br>            onZoomReady(false);<br>          });<br>        };<br>        pan.current =<br>          scene.mode === 'function'<br>            ? mathPlotPan(<br>                element,<br>                () => ranges.current,<br>                (next) => {<br>                  ranges.current = next as [number[], number[]];<br>                  void Plotly.relayout(element, {<br>                    'xaxis.range': next[0],<br>                    'yaxis.range': next[1],<br>                  } as Partial<Layout> & Record<string, unknown>).catch(() =><br>                    setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'),<br>                  );<br>                },<br>              )<br>            : null;<br>        setReady(true);<br>        onZoomReady(true);<br>        rememberView();<br>      }) ∧ truthy: active | onZoomReady(false)<br>call |
| 478행 | rejected: Plotly.react(element, traces, layout, mathPlotConfig)<br>      .then(() => {<br>        if (!active) return;<br>        setError('');<br>        infinite = world ? followUnboundedScene(element,world,scaffoldIndex,{sample:result.sample,range:[result.min,result.max],index:0,signature:result.sampleKey,cache:curveCache.current},()=>camera.current) : followUnboundedFunction(element,result.sample,result.sampleKey,curveCache.current);<br>        if (!listening.current) {<br>          (element as HTMLDivElement & PlotlyHTMLElement).on('plotly_relayout', (update) => {<br>            // Published event typing covers 2D only; the documented 3D event includes scene.camera.<br>            const event = update as unknown as Record<string, unknown>;<br>            if (event['scene.camera']) camera.current = recoverMathCamera(event['scene.camera'] as Partial<Camera>, camera.current);<br>            for (const [index, axisName] of ['xaxis', 'yaxis'].entries()) {<br>              const range = event[`${axisName}.range`] as number[] \| undefined;<br>              if (range) ranges.current[index] = range;<br>              for (const edge of [0, 1]) {<br>                const value = event[`${axisName}.range[${edge}]`];<br>                if (typeof value === 'number') ranges.current[index][edge] = value;<br>              }<br>            }<br>            if (Object.keys(event).some((key) => key === 'scene.camera' \|\| key.includes('.range')))<br>              rememberView();<br>            if (<br>              Object.keys(event).some(<br>                (key) =><br>                  key === 'scene.camera' \|\|<br>                  key.includes('.range') \|\|<br>                  key === 'width' \|\|<br>                  key === 'height',<br>              )<br>            )<br>              numbers.current?.update();<br>          });<br>          listening.current = true;<br>        }<br>        numbers.current?.dispose();<br>        const gray = readPlotColor(element, '--color-muted');<br>        const fade = scene.mode === 'function' ? fadeNumbers(element, (opacity) => {<br>          numberValues.current = opacity;<br>          // SVG opacity preserves the temporary ranges of an active 2D pan.<br>          ['.xtick text', '.ytick text'].forEach((selector, i) => {<br>            for (const text of element.querySelectorAll<SVGTextElement>(selector)) {<br>              text.style.fill = `rgb(${gray.join(',')})`;<br>              text.style.opacity = String(opacity[i]);<br>            }<br>          });<br>        }, numberValues.current) : undefined;<br>        numbers.current = {<br>          update() {<br>            updateVectors();<br>            infinite?.update();<br>            fade?.update([<br>              element.clientWidth / Math.max(ranges.current[0][1] - ranges.current[0][0], Number.EPSILON),<br>              element.clientHeight / Math.max(ranges.current[1][1] - ranges.current[1][0], Number.EPSILON),<br>            ]);<br>          },<br>          dispose: () => fade?.dispose(),<br>        };<br>        numbers.current.update();<br>        zoomRef.current = (factor) => {<br>          if (!Number.isFinite(factor) \|\| factor <= 0) return;<br>          let update: Record<string, unknown>;<br>          if (scene.mode === 'curve') {<br>            camera.current = zoomCamera(camera.current, factor);<br>            update = { 'scene.camera': renderMathCamera(camera.current) };<br>          } else {<br>            ranges.current = ranges.current.map(([low, high]) => {<br>              const center = (low + high) / 2,<br>                half = (high - low) / (2 * factor);<br>              return half > 1e-8 && half < 1e9 ? [center - half, center + half] : [low, high];<br>            }) as [number[], number[]];<br>            update = { 'xaxis.range': ranges.current[0], 'yaxis.range': ranges.current[1] };<br>          }<br>          void Plotly.relayout(element, update).then(() => numbers.current?.update()).catch(() => {<br>            setError('확대·축소하지 못했습니다. 화면을 다시 열어 주세요.');<br>            onZoomReady(false);<br>          });<br>        };<br>        pan.current =<br>          scene.mode === 'function'<br>            ? mathPlotPan(<br>                element,<br>                () => ranges.current,<br>                (next) => {<br>                  ranges.current = next as [number[], number[]];<br>                  void Plotly.relayout(element, {<br>                    'xaxis.range': next[0],<br>                    'yaxis.range': next[1],<br>                  } as Partial<Layout> & Record<string, unknown>).catch(() =><br>                    setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'),<br>                  );<br>                },<br>              )<br>            : null;<br>        setReady(true);<br>        onZoomReady(true);<br>        rememberView();<br>      }) ∧ truthy: active | setError('그래프를 표시하지 못했습니다. 브라우저의 그래픽 지원을 확인해 주세요.')<br>state-update |

## H-8d35d38c7f3c

**@callback:useEffect** · [src/ui/math-explorer-plot.tsx:490](../../../src/ui/math-explorer-plot.tsx#L490)

분기 조건과 가능한 갈림길:

- B-935e533eb3ad · IfStatement · !element → truthy / falsy; 바깥 조건: 별도 조건식 없음 (492행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 511행 | 별도 조건식 없음 | observer.observe(element)<br>call |

반환/조기 중단: 492행 <render> [truthy: !element]; 512행 () => { observer.disconnect(); cancelAnimationFrame(frame); numbers.current?.dispose(); numbers.current = null; Plotly.purge(element); listening.current = false; zoomRef.current = null; onZoomReady(false); } [별도 조건식 없음]

