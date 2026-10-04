# src/ui/math-geogebra.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-7fcb37d46d81

**tokenColor** · [src/ui/math-geogebra.tsx:53](../../../src/ui/math-geogebra.tsx#L53)

분기 조건과 가능한 갈림길:

- B-0c4022dd9aba · ConditionalExpression · rgb?.length === 3 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (63행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 54행 | 별도 조건식 없음 | document.createElement('span')<br>call |
| 57행 | 별도 조건식 없음 | host.appendChild(probe)<br>call |
| 58행 | 별도 조건식 없음 | getComputedStyle(probe)<br>    .color.match(/[\d.]+/g)<br>call |
| 58행 | 별도 조건식 없음 | getComputedStyle(probe)<br>call |
| 62행 | 별도 조건식 없음 | probe.remove()<br>call |

반환/조기 중단: 63행 rgb?.length === 3 ? (rgb as [number, number, number]) : [80, 80, 80] [별도 조건식 없음]

## H-e32847a5dec4

**loadGeoGebra** · [src/ui/math-geogebra.tsx:65](../../../src/ui/math-geogebra.tsx#L65)

분기 조건과 가능한 갈림길:

- B-d836952f1e00 · IfStatement · window.GGBApplet → truthy / falsy; 바깥 조건: 별도 조건식 없음 (66행).
- B-68490bb561b5 · IfStatement · !loader → truthy / falsy; 바깥 조건: 별도 조건식 없음 (67행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 66행 | truthy: window.GGBApplet | Promise.resolve()<br>call |

반환/조기 중단: 66행 Promise.resolve() [truthy: window.GGBApplet]; 80행 loader [별도 조건식 없음]

## H-eb220e49b72c

**MathGeoGebra** · [src/ui/math-geogebra.tsx:83](../../../src/ui/math-geogebra.tsx#L83)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 104행 | 별도 조건식 없음 | useRef(null)<br>call |
| 105행 | 별도 조건식 없음 | useRef(null)<br>call |
| 106행 | 별도 조건식 없음 | useRef({ scene, result, onSnapshot, restoreRevision })<br>call |
| 108행 | 별도 조건식 없음 | useRef('')<br>call |
| 109행 | 별도 조건식 없음 | useRef(-1)<br>call |
| 110행 | 별도 조건식 없음 | useRef(false)<br>call |
| 111행 | 별도 조건식 없음 | useRef(null)<br>call |
| 112행 | 별도 조건식 없음 | useState(false)<br>call |
| 113행 | 별도 조건식 없음 | useState('')<br>call |
| 114행 | 별도 조건식 없음 | useState(0)<br>call |
| 115행 | 별도 조건식 없음 | useState(0)<br>call |
| 116행 | 별도 조건식 없음 | useEffect(() => { const changed = () => setTheme((v) => v + 1); const observer = new MutationObserver(changed); observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style', 'class'], }); const media = matchMedia('(prefers-color-scheme: dark)'); media.addEventListener('change', changed); return () => { observer.disconnect(); media.removeEventListener('change', changed); }; }, [])<br>call<br>전달 콜백: H-0fd3884a9cef |
| 132행 | 별도 조건식 없음 | useEffect(() => { const element = host.current; if (!element) return; let disposed = false; let timer: ReturnType<typeof setTimeout> \| undefined; let resize: ResizeObserver \| undefined; let resizeFrame = 0; let overlayFrame = 0; let presentationTimer: ReturnType<typeof setTimeout> \| undefined; let lastSize = ''; source.current = ''; revision.current = -1; setReady(false); setError(''); const capture = () => api.current && source.current ? { sourceKey: source.current, xml: api.current.getXML() } : undefined; captureRef.current = capture; const persist = () => { if ( latest.current.restoreRevision !== restoreRevision \|\| geoSourceKey(latest.current.scene) !== source.current ) return; const snapshot = cap … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-56a6f0340136 |
| 320행 | 별도 조건식 없음 | useEffect(() => { const native = api.current; const element = host.current; if (!native \|\| !ready \|\| !element) return; syncing.current = true; native.setRepaintingActive(false); try { const key = geoSourceKey(scene); const rebuild = source.current !== key; const preserveExpandedView = Boolean( source.current && scene.sliderRangeVersion === 2 && scene.min === '0' && scene.max === '8*pi' && source.current === geoSourceKey({ ...scene, max: '4*pi' }), ); if (rebuild) { for (const name of ['a', 'b', 'studyCurve', 'StudyPoint']) if (native.exists(name)) native.setFixed(name, false, false); const variable = scene.mode === 'curve' ? 't' : 'x'; const terms = scene.mode === 'curve' ? scene.expressions.map((form … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-62d764c5197c |
| 535행 | 별도 조건식 없음 | useEffect(() => { const native = api.current; if (!ready \|\| error \|\| !native) { onZoomReady(false); return; } const element = host.current; zoomRef.current = (factor) => { try { const xml = new DOMParser().parseFromString(native.getXML(), 'application/xml'); const coords = xml.querySelector( `${mode === 'curve' ? 'euclidianView3D' : 'euclidianView'} > coordSystem`, ); if (!coords \|\| !element \|\| !(factor > 0)) return; const oldScale = Number(coords.getAttribute('scale')); const point = latest.current.result.point ?? [0, 0, 0]; if (mode === 'curve') { for (const name of ['scale', 'yscale', 'zscale']) { const value = coords.getAttribute(name); if (value !== null) coords.setAttribute(name, String(Number(v … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-a4f7c9e9c08f |

반환/조기 중단: 590행 <render> [별도 조건식 없음]

## H-0fd3884a9cef

**@callback:useEffect** · [src/ui/math-geogebra.tsx:116](../../../src/ui/math-geogebra.tsx#L116)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 119행 | 별도 조건식 없음 | observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style', 'class'], })<br>call |
| 123행 | 별도 조건식 없음 | matchMedia('(prefers-color-scheme: dark)')<br>call |
| 124행 | 별도 조건식 없음 | media.addEventListener('change', changed)<br>call<br>전달 콜백: H-134a153b34ec |

반환/조기 중단: 125행 () => { observer.disconnect(); media.removeEventListener('change', changed); } [별도 조건식 없음]

## H-134a153b34ec

**changed** · [src/ui/math-geogebra.tsx:117](../../../src/ui/math-geogebra.tsx#L117)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 117행 | 별도 조건식 없음 | setTheme((v) => v + 1)<br>state-update<br>전달 콜백: H-377d04f32e0a |

## H-377d04f32e0a

**@callback:setTheme** · [src/ui/math-geogebra.tsx:117](../../../src/ui/math-geogebra.tsx#L117)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-56a6f0340136

**@callback:useEffect** · [src/ui/math-geogebra.tsx:132](../../../src/ui/math-geogebra.tsx#L132)

분기 조건과 가능한 갈림길:

- B-f59e24b345c9 · IfStatement · !element → truthy / falsy; 바깥 조건: 별도 조건식 없음 (134행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 144행 | 별도 조건식 없음 | setReady(false)<br>state-update |
| 145행 | 별도 조건식 없음 | setError('')<br>state-update |
| 160행 | 별도 조건식 없음 | setTimeout(() => { if (!api.current && !disposed) setError( '그래프를 여는 데 시간이 걸리고 있습니다. 다시 열거나 다른 그래프로 볼 수 있습니다.', ); }, 45000)<br>state-update<br>전달 콜백: H-6fd8768f6bb6 |
| 166행 | 별도 조건식 없음 | loadGeoGebra()<br>      .then(() => {<br>        if (disposed \|\| !window.GGBApplet) return;<br>        const id = `studyggb${crypto.randomUUID().replaceAll('-', '')}`;<br>        const applet = new window.GGBApplet(<br>          {<br>            id,<br>            appName: 'classic',<br>            perspective: mode === 'curve' ? 'T' : 'G',<br>            width: Math.max(240, element.clientWidth),<br>            height: element.clientHeight,<br>            // ResizeObserver owns dimensions; the injector must not also scale<br>            // the already resized canvas when switching to a narrow viewport.<br>            disableAutoScale: true,<br>            language: 'ko',<br>            fontSize: 14,<br>            rounding: '2',<br>            showToolBar: false,<br>            customToolBar: mode === 'curve' ? '540' : '40',<br>            showAlgebraInput: false,<br>            showMenuBar: false,<br>            showZoomButtons: false,<br>            showResetIcon: false,<br>            enableFileFeatures: false,<br>            enableShiftDragZoom: true,<br>            useBrowserForJS: true,<br>            disableJavaScript: true,<br>            preventFocus: true,<br>            showStartTooltip: false,<br>            errorDialogsActive: false,<br>            appletOnLoad: (native: Api) => {<br>              // GeoGebra labels its injected container; give that name a supported group role.<br>              element.querySelector('.appletParameters')?.setAttribute('role', 'group');<br>              if (disposed) {<br>                native.remove();<br>                return;<br>              }<br>              clearTimeout(timeout);<br>              api.current = native;<br>              const stored = latest.current.scene.geogebra;<br>              if (stored && stored.sourceKey === geoSourceKey(latest.current.scene)) {<br>                try {<br>                  const xml = new DOMParser().parseFromString(stored.xml, 'application/xml');<br>                  xml.querySelector('gui > font')?.setAttribute('size', '14');<br>                  native.setXML(new XMLSerializer().serializeToString(xml));<br>                  source.current = stored.sourceKey;<br>                } catch {<br>                  setError('저장한 보기 설정을 불러오지 못했습니다. 수식과 메모는 유지했습니다.');<br>                }<br>              }<br>              // Remove the opaque floor: it hides axis feet and the grid below<br>              // the curve. Apply to old saved views as well as new constructions.<br>              if (mode === 'curve') {<br>                const xml = new DOMParser().parseFromString(native.getXML(), 'application/xml');<br>                xml.querySelector('euclidianView3D > plate')?.setAttribute('show', 'false');<br>                xml.querySelector('euclidianView3D > clipping')?.setAttribute('use', 'false');<br>                const view = xml.querySelector('euclidianView3D');<br>                if (view) {<br>                  let colored = view.querySelector('axesColored');<br>                  if (!colored) {<br>                    colored = xml.createElement('axesColored');<br>                    view.appendChild(colored);<br>                  }<br>                  colored.setAttribute('val', 'false');<br>                }<br>                native.setXML(new XMLSerializer().serializeToString(xml));<br>              }<br>              if (mode === 'function') {<br>                const xml = new DOMParser().parseFromString(native.getXML(), 'application/xml');<br>                xml.querySelector('euclidianView > lineStyle')?.setAttribute('grid', '0');<br>                native.setXML(new XMLSerializer().serializeToString(xml));<br>              }<br>              presentation.current = geoPresentation(<br>                native,<br>                element,<br>                mode === 'curve',<br>                () => latest.current.result,<br>              );<br>              native.setPerspective(mode === 'curve' ? 'T' : 'G');<br>              native.setRounding('2');<br>              // Official Rotate View (540) / Move Graphics View (40) tools:<br>              // gestures change the view, never the point or construction.<br>              native.setMode(mode === 'curve' ? 540 : 40);<br>              native.registerClientListener((event) => {<br>                // Classic bundles can use the legacy [type, target, ...] event.<br>                const eventType = Array.isArray(event) ? event[0] : event.type;<br>                if (<br>                  !disposed &&<br>                  !syncing.current &&<br>                  ['viewChanged3D', 'viewChanged2D'].includes(String(eventType))<br>                ) {<br>                  cancelAnimationFrame(overlayFrame);<br>                  overlayFrame = requestAnimationFrame(() => presentation.current?.refresh());<br>                  clearTimeout(presentationTimer);<br>                  presentationTimer = setTimeout(() => presentation.current?.update(), 60);<br>                }<br>                if (<br>                  syncing.current \|\|<br>                  disposed \|\|<br>                  !['viewChanged3D', 'viewChanged2D'].includes(String(eventType))<br>                )<br>                  return;<br>                clearTimeout(timer);<br>                timer = setTimeout(persist, 300);<br>              });<br>              resize = new ResizeObserver(() => {<br>                cancelAnimationFrame(resizeFrame);<br>                resizeFrame = requestAnimationFrame(() => {<br>                  const width = element.clientWidth,<br>                    height = element.clientHeight;<br>                  const size = `${width}:${height}`;<br>                  if (disposed \|\| width <= 0 \|\| height <= 0 \|\| size === lastSize) return;<br>                  lastSize = size;<br>                  native.setSize(width, height);<br>                });<br>              });<br>              resize.observe(element);<br>              setReady(true);<br>            },<br>          },<br>          true,<br>        );<br>        applet.setHTML5Codebase(<br>          new URL(`${import.meta.env.BASE_URL}vendor/GeoGebra/HTML5/5.0/web3d/`, location.href)<br>            .href,<br>          true,<br>        );<br>        applet.inject(element);<br>      })<br>      .catch((e: unknown) => { if (!disposed) setError(e instanceof Error ? e.message : '그래프를 열지 못했습니다.'); })<br>call<br>전달 콜백: H-d18f844b508c |
| 166행 | 별도 조건식 없음 | loadGeoGebra()<br>      .then(() => { if (disposed \|\| !window.GGBApplet) return; const id = `studyggb${crypto.randomUUID().replaceAll('-', '')}`; const applet = new window.GGBApplet( { id, appName: 'classic', perspective: mode === 'curve' ? 'T' : 'G', width: Math.max(240, element.clientWidth), height: element.clientHeight, // ResizeObserver owns dimensions; the injector must not also scale // the already resized canvas when switching to a narrow viewport. disableAutoScale: true, language: 'ko', fontSize: 14, rounding: '2', showToolBar: false, customToolBar: mode === 'curve' ? '540' : '40', showAlgebraInput: false, showMenuBar: false, showZoomButtons: false, showResetIcon: false, enableFileFeatures: false, enableShiftDrag … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-2aade8518b3e |
| 166행 | 별도 조건식 없음 | loadGeoGebra()<br>call → [H-e32847a5dec4](ui__math-geogebra.md#h-e32847a5dec4) |
| 301행 | 별도 조건식 없음 | document.addEventListener('visibilitychange', flush)<br>call<br>전달 콜백: H-9115b21ffe56 |

반환/조기 중단: 134행 <render> [truthy: !element]; 302행 () => { persist(); disposed = true; clearTimeout(timer); clearTimeout(timeout); clearTimeout(presentationTimer); cancelAnimationFrame(overlayFrame); presentation.current?.dispose(); presentation.current = null; resize?.disconnect(); cancelAnimationFrame(resizeFrame); document.removeEventListener('visibilitychange', flush); captureRef.current = null; api.current?.remove(); api.current = null; } [별도 조건식 없음]

## H-4950c608b92b

**capture** · [src/ui/math-geogebra.tsx:146](../../../src/ui/math-geogebra.tsx#L146)

분기 조건과 가능한 갈림길:

- B-cb2ba325d6d5 · ConditionalExpression · api.current && source.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (147행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 148행 | truthy: api.current && source.current | api.current.getXML()<br>call |

## H-4b1a05412928

**persist** · [src/ui/math-geogebra.tsx:151](../../../src/ui/math-geogebra.tsx#L151)

분기 조건과 가능한 갈림길:

- B-89f0f09b687d · IfStatement · latest.current.restoreRevision !== restoreRevision || geoSourceKey(latest.current.scene) !== source.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (152행).
- B-9b048209db54 · IfStatement · snapshot → truthy / falsy; 바깥 조건: 별도 조건식 없음 (158행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 154행 | falsy: latest.current.restoreRevision !== restoreRevision | geoSourceKey(latest.current.scene)<br>call |
| 157행 | 별도 조건식 없음 | capture()<br>call → [H-4950c608b92b](ui__math-geogebra.md#h-4950c608b92b) |
| 158행 | truthy: snapshot | latest.current.onSnapshot(snapshot)<br>call |

반환/조기 중단: 156행 <render> [truthy: latest.current.restoreRevision !== restoreRevision ||
        geoSourceKey(latest.current.scene) !== source.current]

## H-6fd8768f6bb6

**@callback:setTimeout** · [src/ui/math-geogebra.tsx:160](../../../src/ui/math-geogebra.tsx#L160)

분기 조건과 가능한 갈림길:

- B-7d03b4237b9d · IfStatement · !api.current && !disposed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (161행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 162행 | truthy: !api.current && !disposed | setError('그래프를 여는 데 시간이 걸리고 있습니다. 다시 열거나 다른 그래프로 볼 수 있습니다.')<br>state-update |

## H-2aade8518b3e

**@callback:loadGeoGebra()
      .then** · [src/ui/math-geogebra.tsx:167](../../../src/ui/math-geogebra.tsx#L167)

분기 조건과 가능한 갈림길:

- B-f7f0f13fe5c8 · IfStatement · disposed || !window.GGBApplet → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: loadGeoGebra() (168행).
- B-b017e2efdaca · ConditionalExpression · mode === 'curve' → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: loadGeoGebra() (174행).
- B-ba48504e35be · ConditionalExpression · mode === 'curve' → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: loadGeoGebra() (184행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 169행 | fulfilled-or-explicit-rejection-handler: loadGeoGebra() | crypto.randomUUID().replaceAll('-', '')<br>call |
| 169행 | fulfilled-or-explicit-rejection-handler: loadGeoGebra() | crypto.randomUUID()<br>call |
| 175행 | fulfilled-or-explicit-rejection-handler: loadGeoGebra() | Math.max(240, element.clientWidth)<br>call |
| 288행 | fulfilled-or-explicit-rejection-handler: loadGeoGebra() | applet.setHTML5Codebase(new URL(`${import.meta.env.BASE_URL}vendor/GeoGebra/HTML5/5.0/web3d/`, location.href) .href, true)<br>call |
| 293행 | fulfilled-or-explicit-rejection-handler: loadGeoGebra() | applet.inject(element)<br>call |

반환/조기 중단: 168행 <render> [fulfilled-or-explicit-rejection-handler: loadGeoGebra() ∧ truthy: disposed || !window.GGBApplet]

## H-d18f844b508c

**@callback:loadGeoGebra()
      .then(() => {
        if (disposed || !window.GGBApplet) return;
        const id = `studyggb${crypto.randomUUID().replaceAll('-', '')}`;
        const applet = new window.GGBApplet(
          {
            id,
            appName: 'classic',
            perspective: mode === 'curve' ? 'T' : 'G',
            width: Math.max(240, element.clientWidth),
            height: element.clientHeight,
            // ResizeObserver owns dimensions; the injector must not also scale
            // the already resized canvas when switching to a narrow viewport.
            disableAutoScale: true,
            language: 'ko',
            fontSize: 14,
            rounding: '2',
            showToolBar: false,
            customToolBar: mode === 'curve' ? '540' : '40',
            showAlgebraInput: false,
            showMenuBar: false,
            showZoomButtons: false,
            showResetIcon: false,
            enableFileFeatures: false,
            enableShiftDragZoom: true,
            useBrowserForJS: true,
            disableJavaScript: true,
            preventFocus: true,
            showStartTooltip: false,
            errorDialogsActive: false,
            appletOnLoad: (native: Api) => {
              // GeoGebra labels its injected container; give that name a supported group role.
              element.querySelector('.appletParameters')?.setAttribute('role', 'group');
              if (disposed) {
                native.remove();
                return;
              }
              clearTimeout(timeout);
              api.current = native;
              const stored = latest.current.scene.geogebra;
              if (stored && stored.sourceKey === geoSourceKey(latest.current.scene)) {
                try {
                  const xml = new DOMParser().parseFromString(stored.xml, 'application/xml');
                  xml.querySelector('gui > font')?.setAttribute('size', '14');
                  native.setXML(new XMLSerializer().serializeToString(xml));
                  source.current = stored.sourceKey;
                } catch {
                  setError('저장한 보기 설정을 불러오지 못했습니다. 수식과 메모는 유지했습니다.');
                }
              }
              // Remove the opaque floor: it hides axis feet and the grid below
              // the curve. Apply to old saved views as well as new constructions.
              if (mode === 'curve') {
                const xml = new DOMParser().parseFromString(native.getXML(), 'application/xml');
                xml.querySelector('euclidianView3D > plate')?.setAttribute('show', 'false');
                xml.querySelector('euclidianView3D > clipping')?.setAttribute('use', 'false');
                const view = xml.querySelector('euclidianView3D');
                if (view) {
                  let colored = view.querySelector('axesColored');
                  if (!colored) {
                    colored = xml.createElement('axesColored');
                    view.appendChild(colored);
                  }
                  colored.setAttribute('val', 'false');
                }
                native.setXML(new XMLSerializer().serializeToString(xml));
              }
              if (mode === 'function') {
                const xml = new DOMParser().parseFromString(native.getXML(), 'application/xml');
                xml.querySelector('euclidianView > lineStyle')?.setAttribute('grid', '0');
                native.setXML(new XMLSerializer().serializeToString(xml));
              }
              presentation.current = geoPresentation(
                native,
                element,
                mode === 'curve',
                () => latest.current.result,
              );
              native.setPerspective(mode === 'curve' ? 'T' : 'G');
              native.setRounding('2');
              // Official Rotate View (540) / Move Graphics View (40) tools:
              // gestures change the view, never the point or construction.
              native.setMode(mode === 'curve' ? 540 : 40);
              native.registerClientListener((event) => {
                // Classic bundles can use the legacy [type, target, ...] event.
                const eventType = Array.isArray(event) ? event[0] : event.type;
                if (
                  !disposed &&
                  !syncing.current &&
                  ['viewChanged3D', 'viewChanged2D'].includes(String(eventType))
                ) {
                  cancelAnimationFrame(overlayFrame);
                  overlayFrame = requestAnimationFrame(() => presentation.current?.refresh());
                  clearTimeout(presentationTimer);
                  presentationTimer = setTimeout(() => presentation.current?.update(), 60);
                }
                if (
                  syncing.current ||
                  disposed ||
                  !['viewChanged3D', 'viewChanged2D'].includes(String(eventType))
                )
                  return;
                clearTimeout(timer);
                timer = setTimeout(persist, 300);
              });
              resize = new ResizeObserver(() => {
                cancelAnimationFrame(resizeFrame);
                resizeFrame = requestAnimationFrame(() => {
                  const width = element.clientWidth,
                    height = element.clientHeight;
                  const size = `${width}:${height}`;
                  if (disposed || width <= 0 || height <= 0 || size === lastSize) return;
                  lastSize = size;
                  native.setSize(width, height);
                });
              });
              resize.observe(element);
              setReady(true);
            },
          },
          true,
        );
        applet.setHTML5Codebase(
          new URL(`${import.meta.env.BASE_URL}vendor/GeoGebra/HTML5/5.0/web3d/`, location.href)
            .href,
          true,
        );
        applet.inject(element);
      })
      .catch** · [src/ui/math-geogebra.tsx:295](../../../src/ui/math-geogebra.tsx#L295)

분기 조건과 가능한 갈림길:

- B-1e68488e19e2 · IfStatement · !disposed → truthy / falsy; 바깥 조건: rejected: loadGeoGebra()
      .then(() => {
        if (disposed || !window.GGBApplet) return;
        const id = `studyggb${crypto.randomUUID().replaceAll('-', '')}`;
        const applet = new window.GGBApplet(
          {
            id,
            appName: 'classic',
            perspective: mode === 'curve' ? 'T' : 'G',
            width: Math.max(240, element.clientWidth),
            height: element.clientHeight,
            // ResizeObserver owns dimensions; the injector must not also scale
            // the already resized canvas when switching to a narrow viewport.
            disableAutoScale: true,
            language: 'ko',
            fontSize: 14,
            rounding: '2',
            showToolBar: false,
            customToolBar: mode === 'curve' ? '540' : '40',
            showAlgebraInput: false,
            showMenuBar: false,
            showZoomButtons: false,
            showResetIcon: false,
            enableFileFeatures: false,
            enableShiftDragZoom: true,
            useBrowserForJS: true,
            disableJavaScript: true,
            preventFocus: true,
            showStartTooltip: false,
            errorDialogsActive: false,
            appletOnLoad: (native: Api) => {
              // GeoGebra labels its injected container; give that name a supported group role.
              element.querySelector('.appletParameters')?.setAttribute('role', 'group');
              if (disposed) {
                native.remove();
                return;
              }
              clearTimeout(timeout);
              api.current = native;
              const stored = latest.current.scene.geogebra;
              if (stored && stored.sourceKey === geoSourceKey(latest.current.scene)) {
                try {
                  const xml = new DOMParser().parseFromString(stored.xml, 'application/xml');
                  xml.querySelector('gui > font')?.setAttribute('size', '14');
                  native.setXML(new XMLSerializer().serializeToString(xml));
                  source.current = stored.sourceKey;
                } catch {
                  setError('저장한 보기 설정을 불러오지 못했습니다. 수식과 메모는 유지했습니다.');
                }
              }
              // Remove the opaque floor: it hides axis feet and the grid below
              // the curve. Apply to old saved views as well as new constructions.
              if (mode === 'curve') {
                const xml = new DOMParser().parseFromString(native.getXML(), 'application/xml');
                xml.querySelector('euclidianView3D > plate')?.setAttribute('show', 'false');
                xml.querySelector('euclidianView3D > clipping')?.setAttribute('use', 'false');
                const view = xml.querySelector('euclidianView3D');
                if (view) {
                  let colored = view.querySelector('axesColored');
                  if (!colored) {
                    colored = xml.createElement('axesColored');
                    view.appendChild(colored);
                  }
                  colored.setAttribute('val', 'false');
                }
                native.setXML(new XMLSerializer().serializeToString(xml));
              }
              if (mode === 'function') {
                const xml = new DOMParser().parseFromString(native.getXML(), 'application/xml');
                xml.querySelector('euclidianView > lineStyle')?.setAttribute('grid', '0');
                native.setXML(new XMLSerializer().serializeToString(xml));
              }
              presentation.current = geoPresentation(
                native,
                element,
                mode === 'curve',
                () => latest.current.result,
              );
              native.setPerspective(mode === 'curve' ? 'T' : 'G');
              native.setRounding('2');
              // Official Rotate View (540) / Move Graphics View (40) tools:
              // gestures change the view, never the point or construction.
              native.setMode(mode === 'curve' ? 540 : 40);
              native.registerClientListener((event) => {
                // Classic bundles can use the legacy [type, target, ...] event.
                const eventType = Array.isArray(event) ? event[0] : event.type;
                if (
                  !disposed &&
                  !syncing.current &&
                  ['viewChanged3D', 'viewChanged2D'].includes(String(eventType))
                ) {
                  cancelAnimationFrame(overlayFrame);
                  overlayFrame = requestAnimationFrame(() => presentation.current?.refresh());
                  clearTimeout(presentationTimer);
                  presentationTimer = setTimeout(() => presentation.current?.update(), 60);
                }
                if (
                  syncing.current ||
                  disposed ||
                  !['viewChanged3D', 'viewChanged2D'].includes(String(eventType))
                )
                  return;
                clearTimeout(timer);
                timer = setTimeout(persist, 300);
              });
              resize = new ResizeObserver(() => {
                cancelAnimationFrame(resizeFrame);
                resizeFrame = requestAnimationFrame(() => {
                  const width = element.clientWidth,
                    height = element.clientHeight;
                  const size = `${width}:${height}`;
                  if (disposed || width <= 0 || height <= 0 || size === lastSize) return;
                  lastSize = size;
                  native.setSize(width, height);
                });
              });
              resize.observe(element);
              setReady(true);
            },
          },
          true,
        );
        applet.setHTML5Codebase(
          new URL(`${import.meta.env.BASE_URL}vendor/GeoGebra/HTML5/5.0/web3d/`, location.href)
            .href,
          true,
        );
        applet.inject(element);
      }) (296행).
- B-c67cb820c612 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: rejected: loadGeoGebra()
      .then(() => {
        if (disposed || !window.GGBApplet) return;
        const id = `studyggb${crypto.randomUUID().replaceAll('-', '')}`;
        const applet = new window.GGBApplet(
          {
            id,
            appName: 'classic',
            perspective: mode === 'curve' ? 'T' : 'G',
            width: Math.max(240, element.clientWidth),
            height: element.clientHeight,
            // ResizeObserver owns dimensions; the injector must not also scale
            // the already resized canvas when switching to a narrow viewport.
            disableAutoScale: true,
            language: 'ko',
            fontSize: 14,
            rounding: '2',
            showToolBar: false,
            customToolBar: mode === 'curve' ? '540' : '40',
            showAlgebraInput: false,
            showMenuBar: false,
            showZoomButtons: false,
            showResetIcon: false,
            enableFileFeatures: false,
            enableShiftDragZoom: true,
            useBrowserForJS: true,
            disableJavaScript: true,
            preventFocus: true,
            showStartTooltip: false,
            errorDialogsActive: false,
            appletOnLoad: (native: Api) => {
              // GeoGebra labels its injected container; give that name a supported group role.
              element.querySelector('.appletParameters')?.setAttribute('role', 'group');
              if (disposed) {
                native.remove();
                return;
              }
              clearTimeout(timeout);
              api.current = native;
              const stored = latest.current.scene.geogebra;
              if (stored && stored.sourceKey === geoSourceKey(latest.current.scene)) {
                try {
                  const xml = new DOMParser().parseFromString(stored.xml, 'application/xml');
                  xml.querySelector('gui > font')?.setAttribute('size', '14');
                  native.setXML(new XMLSerializer().serializeToString(xml));
                  source.current = stored.sourceKey;
                } catch {
                  setError('저장한 보기 설정을 불러오지 못했습니다. 수식과 메모는 유지했습니다.');
                }
              }
              // Remove the opaque floor: it hides axis feet and the grid below
              // the curve. Apply to old saved views as well as new constructions.
              if (mode === 'curve') {
                const xml = new DOMParser().parseFromString(native.getXML(), 'application/xml');
                xml.querySelector('euclidianView3D > plate')?.setAttribute('show', 'false');
                xml.querySelector('euclidianView3D > clipping')?.setAttribute('use', 'false');
                const view = xml.querySelector('euclidianView3D');
                if (view) {
                  let colored = view.querySelector('axesColored');
                  if (!colored) {
                    colored = xml.createElement('axesColored');
                    view.appendChild(colored);
                  }
                  colored.setAttribute('val', 'false');
                }
                native.setXML(new XMLSerializer().serializeToString(xml));
              }
              if (mode === 'function') {
                const xml = new DOMParser().parseFromString(native.getXML(), 'application/xml');
                xml.querySelector('euclidianView > lineStyle')?.setAttribute('grid', '0');
                native.setXML(new XMLSerializer().serializeToString(xml));
              }
              presentation.current = geoPresentation(
                native,
                element,
                mode === 'curve',
                () => latest.current.result,
              );
              native.setPerspective(mode === 'curve' ? 'T' : 'G');
              native.setRounding('2');
              // Official Rotate View (540) / Move Graphics View (40) tools:
              // gestures change the view, never the point or construction.
              native.setMode(mode === 'curve' ? 540 : 40);
              native.registerClientListener((event) => {
                // Classic bundles can use the legacy [type, target, ...] event.
                const eventType = Array.isArray(event) ? event[0] : event.type;
                if (
                  !disposed &&
                  !syncing.current &&
                  ['viewChanged3D', 'viewChanged2D'].includes(String(eventType))
                ) {
                  cancelAnimationFrame(overlayFrame);
                  overlayFrame = requestAnimationFrame(() => presentation.current?.refresh());
                  clearTimeout(presentationTimer);
                  presentationTimer = setTimeout(() => presentation.current?.update(), 60);
                }
                if (
                  syncing.current ||
                  disposed ||
                  !['viewChanged3D', 'viewChanged2D'].includes(String(eventType))
                )
                  return;
                clearTimeout(timer);
                timer = setTimeout(persist, 300);
              });
              resize = new ResizeObserver(() => {
                cancelAnimationFrame(resizeFrame);
                resizeFrame = requestAnimationFrame(() => {
                  const width = element.clientWidth,
                    height = element.clientHeight;
                  const size = `${width}:${height}`;
                  if (disposed || width <= 0 || height <= 0 || size === lastSize) return;
                  lastSize = size;
                  native.setSize(width, height);
                });
              });
              resize.observe(element);
              setReady(true);
            },
          },
          true,
        );
        applet.setHTML5Codebase(
          new URL(`${import.meta.env.BASE_URL}vendor/GeoGebra/HTML5/5.0/web3d/`, location.href)
            .href,
          true,
        );
        applet.inject(element);
      }) ∧ truthy: !disposed (296행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 296행 | rejected: loadGeoGebra()<br>      .then(() => {<br>        if (disposed \|\| !window.GGBApplet) return;<br>        const id = `studyggb${crypto.randomUUID().replaceAll('-', '')}`;<br>        const applet = new window.GGBApplet(<br>          {<br>            id,<br>            appName: 'classic',<br>            perspective: mode === 'curve' ? 'T' : 'G',<br>            width: Math.max(240, element.clientWidth),<br>            height: element.clientHeight,<br>            // ResizeObserver owns dimensions; the injector must not also scale<br>            // the already resized canvas when switching to a narrow viewport.<br>            disableAutoScale: true,<br>            language: 'ko',<br>            fontSize: 14,<br>            rounding: '2',<br>            showToolBar: false,<br>            customToolBar: mode === 'curve' ? '540' : '40',<br>            showAlgebraInput: false,<br>            showMenuBar: false,<br>            showZoomButtons: false,<br>            showResetIcon: false,<br>            enableFileFeatures: false,<br>            enableShiftDragZoom: true,<br>            useBrowserForJS: true,<br>            disableJavaScript: true,<br>            preventFocus: true,<br>            showStartTooltip: false,<br>            errorDialogsActive: false,<br>            appletOnLoad: (native: Api) => {<br>              // GeoGebra labels its injected container; give that name a supported group role.<br>              element.querySelector('.appletParameters')?.setAttribute('role', 'group');<br>              if (disposed) {<br>                native.remove();<br>                return;<br>              }<br>              clearTimeout(timeout);<br>              api.current = native;<br>              const stored = latest.current.scene.geogebra;<br>              if (stored && stored.sourceKey === geoSourceKey(latest.current.scene)) {<br>                try {<br>                  const xml = new DOMParser().parseFromString(stored.xml, 'application/xml');<br>                  xml.querySelector('gui > font')?.setAttribute('size', '14');<br>                  native.setXML(new XMLSerializer().serializeToString(xml));<br>                  source.current = stored.sourceKey;<br>                } catch {<br>                  setError('저장한 보기 설정을 불러오지 못했습니다. 수식과 메모는 유지했습니다.');<br>                }<br>              }<br>              // Remove the opaque floor: it hides axis feet and the grid below<br>              // the curve. Apply to old saved views as well as new constructions.<br>              if (mode === 'curve') {<br>                const xml = new DOMParser().parseFromString(native.getXML(), 'application/xml');<br>                xml.querySelector('euclidianView3D > plate')?.setAttribute('show', 'false');<br>                xml.querySelector('euclidianView3D > clipping')?.setAttribute('use', 'false');<br>                const view = xml.querySelector('euclidianView3D');<br>                if (view) {<br>                  let colored = view.querySelector('axesColored');<br>                  if (!colored) {<br>                    colored = xml.createElement('axesColored');<br>                    view.appendChild(colored);<br>                  }<br>                  colored.setAttribute('val', 'false');<br>                }<br>                native.setXML(new XMLSerializer().serializeToString(xml));<br>              }<br>              if (mode === 'function') {<br>                const xml = new DOMParser().parseFromString(native.getXML(), 'application/xml');<br>                xml.querySelector('euclidianView > lineStyle')?.setAttribute('grid', '0');<br>                native.setXML(new XMLSerializer().serializeToString(xml));<br>              }<br>              presentation.current = geoPresentation(<br>                native,<br>                element,<br>                mode === 'curve',<br>                () => latest.current.result,<br>              );<br>              native.setPerspective(mode === 'curve' ? 'T' : 'G');<br>              native.setRounding('2');<br>              // Official Rotate View (540) / Move Graphics View (40) tools:<br>              // gestures change the view, never the point or construction.<br>              native.setMode(mode === 'curve' ? 540 : 40);<br>              native.registerClientListener((event) => {<br>                // Classic bundles can use the legacy [type, target, ...] event.<br>                const eventType = Array.isArray(event) ? event[0] : event.type;<br>                if (<br>                  !disposed &&<br>                  !syncing.current &&<br>                  ['viewChanged3D', 'viewChanged2D'].includes(String(eventType))<br>                ) {<br>                  cancelAnimationFrame(overlayFrame);<br>                  overlayFrame = requestAnimationFrame(() => presentation.current?.refresh());<br>                  clearTimeout(presentationTimer);<br>                  presentationTimer = setTimeout(() => presentation.current?.update(), 60);<br>                }<br>                if (<br>                  syncing.current \|\|<br>                  disposed \|\|<br>                  !['viewChanged3D', 'viewChanged2D'].includes(String(eventType))<br>                )<br>                  return;<br>                clearTimeout(timer);<br>                timer = setTimeout(persist, 300);<br>              });<br>              resize = new ResizeObserver(() => {<br>                cancelAnimationFrame(resizeFrame);<br>                resizeFrame = requestAnimationFrame(() => {<br>                  const width = element.clientWidth,<br>                    height = element.clientHeight;<br>                  const size = `${width}:${height}`;<br>                  if (disposed \|\| width <= 0 \|\| height <= 0 \|\| size === lastSize) return;<br>                  lastSize = size;<br>                  native.setSize(width, height);<br>                });<br>              });<br>              resize.observe(element);<br>              setReady(true);<br>            },<br>          },<br>          true,<br>        );<br>        applet.setHTML5Codebase(<br>          new URL(`${import.meta.env.BASE_URL}vendor/GeoGebra/HTML5/5.0/web3d/`, location.href)<br>            .href,<br>          true,<br>        );<br>        applet.inject(element);<br>      }) ∧ truthy: !disposed | setError(e instanceof Error ? e.message : '그래프를 열지 못했습니다.')<br>state-update |

## H-9115b21ffe56

**flush** · [src/ui/math-geogebra.tsx:298](../../../src/ui/math-geogebra.tsx#L298)

분기 조건과 가능한 갈림길:

- B-f3ee506283e3 · IfStatement · document.visibilityState === 'hidden' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (299행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 299행 | truthy: document.visibilityState === 'hidden' | persist()<br>call → [H-4b1a05412928](ui__math-geogebra.md#h-4b1a05412928) |

## H-62d764c5197c

**@callback:useEffect** · [src/ui/math-geogebra.tsx:320](../../../src/ui/math-geogebra.tsx#L320)

분기 조건과 가능한 갈림길:

- B-f2250c91b4b7 · IfStatement · !native || !ready || !element → truthy / falsy; 바깥 조건: 별도 조건식 없음 (323행).
- B-1637a14f61b3 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (326행).
- B-410374cd2a4e · IfStatement · rebuild → truthy / falsy; 바깥 조건: 별도 조건식 없음 (336행).
- B-fcefaee7bc17 · IfStatement · native.exists(name) → truthy / falsy; 바깥 조건: truthy: rebuild (338행).
- B-3b556cad8485 · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: rebuild (339행).
- B-0abd480ae10f · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: rebuild (341행).
- B-8f4072bc2379 · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: rebuild (351행).
- B-60ca38ace7dc · IfStatement · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: rebuild (353행).
- B-a4d22e80e9b3 · IfStatement · !commands.every((command) => { const applied = native.evalCommand(command); if (!applied) console.warn('GeoGebra construction command failed', command); return applied; }) → truthy / falsy; 바깥 조건: truthy: rebuild (359행).
- B-356c35c4f734 · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (379행).
- B-7e7e0f453bbe · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (391행).
- B-52642a5dd22e · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (393행).
- B-6e08192e5888 · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (394행).
- B-6048fbe568c6 · IfStatement · !native.exists(name) && !native.evalCommand(`${name}=${feet[axis]}`) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (400행).
- B-d4cef405a63f · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (406행).
- B-49253a56aa3d · IfStatement · !native.exists(name) && !native.evalCommand(`${name}=Segment(${start},${end})`) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (419행).
- B-b41f5f3c59af · IfStatement · result.point → truthy / falsy; 바깥 조건: 별도 조건식 없음 (440행).
- B-30963e3a9941 · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: result.point (442행).
- B-91377ab2454f · IfStatement · scene.mode === 'curve' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (445행).
- B-cbf3cb6a955f · IfStatement · !native.exists(`study${name}`) → truthy / falsy; 바깥 조건: truthy: scene.mode === 'curve' (454행).
- B-499bc49c9af6 · IfStatement · visible && result.point && direction → truthy / falsy; 바깥 조건: truthy: scene.mode === 'curve' (461행).
- B-0e3c09ab9a32 · IfStatement · (rebuild && !preserveExpandedView) || (revision.current >= 0 && revision.current !== viewRevision) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (471행).
- B-f8645879782a · IfStatement · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: (rebuild && !preserveExpandedView) ||
        (revision.current >= 0 && revision.current !== viewRevision) (483행).
- B-9647e2f7f48c · IfStatement · coords → truthy / falsy; 바깥 조건: truthy: (rebuild && !preserveExpandedView) ||
        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' (486행).
- B-f0bc2e517453 · IfStatement · !rebuild → truthy / falsy; 바깥 조건: truthy: (rebuild && !preserveExpandedView) ||
        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' (510행).
- B-8fbf6d074480 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (516행).
- B-aca2a5f979ad · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (517행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 325행 | 별도 조건식 없음 | native.setRepaintingActive(false)<br>call |
| 327행 | 별도 조건식 없음 | geoSourceKey(scene)<br>call |
| 329행 | 별도 조건식 없음 | Boolean(source.current && scene.sliderRangeVersion === 2 && scene.min === '0' && scene.max === '8*pi' && source.current === geoSourceKey({ ...scene, max: '4*pi' }))<br>call |
| 334행 | truthy: source.current &&<br>        scene.sliderRangeVersion === 2 &&<br>        scene.min === '0' &&<br>        scene.max === '8*pi' | geoSourceKey({ ...scene, max: '4*pi' })<br>call |
| 338행 | truthy: rebuild | native.exists(name)<br>call |
| 338행 | truthy: rebuild ∧ truthy: native.exists(name) | native.setFixed(name, false, false)<br>call |
| 342행 | truthy: rebuild ∧ truthy: scene.mode === 'curve' | scene.expressions.map((formula) => geoExpression(formula, variable))<br>call<br>전달 콜백: H-2ea94842c9b4 |
| 343행 | truthy: rebuild ∧ falsy: scene.mode === 'curve' | geoExpression(scene.expressions[0], variable)<br>call |
| 345행 | truthy: rebuild | geoNumber(scene.a)<br>call |
| 346행 | truthy: rebuild | geoNumber(scene.b)<br>call |
| 347행 | truthy: rebuild | terms.join(',')<br>call |
| 347행 | truthy: rebuild | geoNumber(result.min)<br>call |
| 347행 | truthy: rebuild | geoNumber(result.max)<br>call |
| 355행 | truthy: rebuild ∧ truthy: scene.mode === 'curve' | commands.push(`StudyTip${name}=(0,0,0)`, `study${name}=Vector(StudyPoint,StudyTip${name})`)<br>call |
| 360행 | truthy: rebuild | commands.every((command) => { const applied = native.evalCommand(command); if (!applied) console.warn('GeoGebra construction command failed', command); return applied; })<br>call<br>전달 콜백: H-01d5ded4e486 |
| 366행 | truthy: rebuild ∧ truthy: !commands.every((command) => {<br>            const applied = native.evalCommand(command);<br>            if (!applied) console.warn('GeoGebra construction command failed', command);<br>            return applied;<br>          }) | Error('GeoGebra에서 이 수식을 그리지 못했습니다. 수식을 확인하거나 다른 그래프로 볼 수 있습니다.')<br>call |
| 369행 | truthy: rebuild | native.setColor('studyCurve', ...tokenColor(element, '--color-math-curve'))<br>call |
| 369행 | truthy: rebuild | tokenColor(element, '--color-math-curve')<br>call → [H-7fcb37d46d81](ui__math-geogebra.md#h-7fcb37d46d81) |
| 370행 | truthy: rebuild | native.setColor('StudyPoint', ...tokenColor(element, '--color-math-point'))<br>call |
| 370행 | truthy: rebuild | tokenColor(element, '--color-math-point')<br>call → [H-7fcb37d46d81](ui__math-geogebra.md#h-7fcb37d46d81) |
| 372행 | truthy: rebuild | native.setLabelVisible(name, false)<br>call |
| 373행 | truthy: rebuild | native.setFixed(name, true, false)<br>call |
| 375행 | truthy: rebuild | native.setVisible('a', false)<br>call |
| 376행 | truthy: rebuild | native.setVisible('b', false)<br>call |
| 380행 | 별도 조건식 없음 | native.setAxisSteps(view, 1, 1, 1)<br>call |
| 381행 | 별도 조건식 없음 | tokenColor(element, '--color-border')<br>call → [H-7fcb37d46d81](ui__math-geogebra.md#h-7fcb37d46d81) |
| 382행 | 별도 조건식 없음 | native.setGraphicsOptions(view, { grid: true, gridIsBold: false, gridType: 0, gridDistance: { x: 1, y: 1 }, gridColor: `#${gridColor.map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`, })<br>call |
| 387행 | 별도 조건식 없음 | gridColor.map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')<br>call |
| 387행 | 별도 조건식 없음 | gridColor.map((value) => Math.round(value).toString(16).padStart(2, '0'))<br>call<br>전달 콜백: H-2d9c495b1c23 |
| 400행 | 별도 조건식 없음 | native.exists(name)<br>call |
| 400행 | truthy: !native.exists(name) | native.evalCommand(`${name}=${feet[axis]}`)<br>call |
| 401행 | truthy: !native.exists(name) && !native.evalCommand(`${name}=${feet[axis]}`) | Error('좌표 보조선을 표시하지 못했습니다.')<br>call |
| 402행 | 별도 조건식 없음 | native.setVisible(name, false)<br>call |
| 403행 | 별도 조건식 없음 | native.setLabelVisible(name, false)<br>call |
| 419행 | 별도 조건식 없음 | native.exists(name)<br>call |
| 419행 | truthy: !native.exists(name) | native.evalCommand(`${name}=Segment(${start},${end})`)<br>call |
| 420행 | truthy: !native.exists(name) && !native.evalCommand(`${name}=Segment(${start},${end})`) | Error('좌표 보조선을 표시하지 못했습니다.')<br>call |
| 421행 | 별도 조건식 없음 | native.setColor(name, ...tokenColor(element, '--color-muted'))<br>call |
| 421행 | 별도 조건식 없음 | tokenColor(element, '--color-muted')<br>call → [H-7fcb37d46d81](ui__math-geogebra.md#h-7fcb37d46d81) |
| 422행 | 별도 조건식 없음 | native.setLineThickness(name, 1)<br>call |
| 423행 | 별도 조건식 없음 | native.setLineStyle(name, 2)<br>call |
| 424행 | 별도 조건식 없음 | native.setLabelVisible(name, false)<br>call |
| 425행 | 별도 조건식 없음 | native.setVisible(name, scene.mode === 'function' && result.point !== null)<br>call |
| 426행 | 별도 조건식 없음 | native.setFixed(name, true, false)<br>call |
| 428행 | 별도 조건식 없음 | native.setVisible('studyCurve', scene.mode === 'function')<br>call |
| 430행 | 별도 조건식 없음 | native.setColor('studyCurve', ...tokenColor(element, '--color-math-curve'))<br>call |
| 430행 | 별도 조건식 없음 | tokenColor(element, '--color-math-curve')<br>call → [H-7fcb37d46d81](ui__math-geogebra.md#h-7fcb37d46d81) |
| 431행 | 별도 조건식 없음 | native.setColor('StudyPoint', ...tokenColor(element, '--color-math-point'))<br>call |
| 431행 | 별도 조건식 없음 | tokenColor(element, '--color-math-point')<br>call → [H-7fcb37d46d81](ui__math-geogebra.md#h-7fcb37d46d81) |
| 432행 | 별도 조건식 없음 | native.setLineThickness('studyCurve', 2)<br>call |
| 433행 | 별도 조건식 없음 | native.setPointSize('StudyPoint', 4)<br>call |
| 435행 | 별도 조건식 없음 | native.setFixed(name, false, false)<br>call |
| 436행 | 별도 조건식 없음 | native.setValue(name, scene[name])<br>call |
| 437행 | 별도 조건식 없음 | native.setFixed(name, true, false)<br>call |
| 439행 | 별도 조건식 없음 | native.setVisible('StudyPoint', scene.mode === 'function' && result.point !== null)<br>call |
| 441행 | truthy: result.point | native.setFixed('StudyPoint', false, false)<br>call |
| 442행 | truthy: result.point | native.setCoords('StudyPoint', ...result.point.slice(0, scene.mode === 'curve' ? 3 : 2))<br>call |
| 442행 | truthy: result.point | result.point.slice(0, scene.mode === 'curve' ? 3 : 2)<br>call |
| 443행 | truthy: result.point | native.setFixed('StudyPoint', true, false)<br>call |
| 447행 | truthy: scene.mode === 'curve' | tokenColor(element, '--color-math-tangent')<br>call → [H-7fcb37d46d81](ui__math-geogebra.md#h-7fcb37d46d81) |
| 448행 | truthy: scene.mode === 'curve' | tokenColor(element, '--color-math-normal')<br>call → [H-7fcb37d46d81](ui__math-geogebra.md#h-7fcb37d46d81) |
| 449행 | truthy: scene.mode === 'curve' | tokenColor(element, '--color-math-binormal')<br>call → [H-7fcb37d46d81](ui__math-geogebra.md#h-7fcb37d46d81) |
| 453행 | truthy: scene.mode === 'curve' | Boolean(scene.vectors && direction && result.point)<br>call |
| 454행 | truthy: scene.mode === 'curve' | native.exists(`study${name}`)<br>call |
| 455행 | truthy: scene.mode === 'curve' ∧ truthy: !native.exists(`study${name}`) | Error(`${name} 벡터를 표시하지 못했습니다. 다른 그래프로 보거나 그래프를 다시 열어 주세요.`)<br>call |
| 458행 | truthy: scene.mode === 'curve' | String(visible)<br>call |
| 459행 | truthy: scene.mode === 'curve' | native.setVisible(`study${name}`, false)<br>call |
| 460행 | truthy: scene.mode === 'curve' | native.setVisible(`StudyTip${name}`, false)<br>call |
| 462행 | truthy: scene.mode === 'curve' ∧ truthy: visible && result.point && direction | native.setCoords(`StudyTip${name}`, ...add(result.point, scale(direction, 1.3)))<br>call |
| 462행 | truthy: scene.mode === 'curve' ∧ truthy: visible && result.point && direction | add(result.point, scale(direction, 1.3))<br>call |
| 462행 | truthy: scene.mode === 'curve' ∧ truthy: visible && result.point && direction | scale(direction, 1.3)<br>call |
| 463행 | truthy: scene.mode === 'curve' | native.setColor(`study${name}`, ...(colors[name] as [number, number, number]))<br>call |
| 464행 | truthy: scene.mode === 'curve' | native.setLineThickness(`study${name}`, 1)<br>call |
| 465행 | truthy: scene.mode === 'curve' | native.setCaption(`study${name}`, name)<br>call |
| 466행 | truthy: scene.mode === 'curve' | native.setLabelStyle(`study${name}`, 3)<br>call |
| 467행 | truthy: scene.mode === 'curve' | native.setLabelVisible(`study${name}`, false)<br>call |
| 468행 | truthy: scene.mode === 'curve' | native.setFixed(`study${name}`, true, false)<br>call |
| 475행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) | result.points.filter((p): p is Vec3 => p !== null)<br>call<br>전달 콜백: H-d116aa6c963a |
| 476행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) | [0, 1, 2].flatMap((i) => { const values = points.map((p) => p[i]); const low = Math.min(0, ...values), high = Math.max(0, ...values); const padding = Math.max(1, (high - low) * 0.2); return [low - padding, high + padding]; })<br>call<br>전달 콜백: H-bb69ccdef018 |
| 484행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' | new DOMParser().parseFromString(native.getXML(), 'application/xml')<br>call |
| 484행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' | native.getXML()<br>call |
| 485행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' | xml.querySelector('euclidianView3D > coordSystem')<br>call |
| 488행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | native.getXcoord('StudyViewLow')<br>call |
| 489행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | native.getYcoord('StudyViewLow')<br>call |
| 490행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | native.getZcoord('StudyViewLow')<br>call |
| 493행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | native.getXcoord('StudyViewHigh')<br>call |
| 494행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | native.getYcoord('StudyViewHigh')<br>call |
| 495행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | native.getZcoord('StudyViewHigh')<br>call |
| 500행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | Math.min(...low.map((v, i) => (high[i] - v) / (bounds[i * 2 + 1] - bounds[i * 2])))<br>call |
| 500행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | low.map((v, i) => (high[i] - v) / (bounds[i * 2 + 1] - bounds[i * 2]))<br>call<br>전달 콜백: H-989a8dfe4b79 |
| 502행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | Number(coords.getAttribute('scale'))<br>call |
| 502행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | coords.getAttribute('scale')<br>call |
| 503행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | coords.setAttribute('scale', String(oldScale * ratio))<br>call |
| 503행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | String(oldScale * ratio)<br>call |
| 504행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | ['xZero', 'yZero', 'zZero'].forEach((name, i) => { coords.setAttribute(name, String(-(bounds[i * 2] + bounds[i * 2 + 1]) / 2)); })<br>call<br>전달 콜백: H-7a5cb9491f53 |
| 507행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | native.setXML(new XMLSerializer().serializeToString(xml))<br>call |
| 507행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | new XMLSerializer().serializeToString(xml)<br>call |
| 508행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | native.setMode(540)<br>call |
| 510행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: !rebuild | native.evalCommand('SetViewDirection()')<br>call |
| 511행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ falsy: scene.mode === 'curve' | native.setCoordSystem(...bounds.slice(0, 4))<br>call |
| 511행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ falsy: scene.mode === 'curve' | bounds.slice(0, 4)<br>call |
| 515행 | 별도 조건식 없음 | setError('')<br>state-update |
| 517행 | exception: e | setError(e instanceof Error ? e.message : '그래프를 갱신하지 못했습니다.')<br>state-update |
| 519행 | always-after-try: try 완료 또는 예외 이후 | native.setRepaintingActive(true)<br>call |

반환/조기 중단: 323행 <render> [truthy: !native || !ready || !element]

throw: 366행 Error( 'GeoGebra에서 이 수식을 그리지 못했습니다. 수식을 확인하거나 다른 그래프로 볼 수 있습니다.', ); 401행 Error('좌표 보조선을 표시하지 못했습니다.'); 420행 Error('좌표 보조선을 표시하지 못했습니다.'); 455행 Error( `${name} 벡터를 표시하지 못했습니다. 다른 그래프로 보거나 그래프를 다시 열어 주세요.`, )

## H-2ea94842c9b4

**@callback:scene.expressions.map** · [src/ui/math-geogebra.tsx:342](../../../src/ui/math-geogebra.tsx#L342)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 342행 | truthy: rebuild ∧ truthy: scene.mode === 'curve' | geoExpression(formula, variable)<br>call |

## H-01d5ded4e486

**@callback:commands.every** · [src/ui/math-geogebra.tsx:360](../../../src/ui/math-geogebra.tsx#L360)

분기 조건과 가능한 갈림길:

- B-5f8dfa499c0e · IfStatement · !applied → truthy / falsy; 바깥 조건: truthy: rebuild (362행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 361행 | truthy: rebuild | native.evalCommand(command)<br>call |
| 362행 | truthy: rebuild ∧ truthy: !applied | console.warn('GeoGebra construction command failed', command)<br>call |

반환/조기 중단: 363행 applied [truthy: rebuild]

## H-2d9c495b1c23

**@callback:gridColor.map** · [src/ui/math-geogebra.tsx:387](../../../src/ui/math-geogebra.tsx#L387)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 387행 | 별도 조건식 없음 | Math.round(value).toString(16).padStart(2, '0')<br>call |
| 387행 | 별도 조건식 없음 | Math.round(value).toString(16)<br>call |
| 387행 | 별도 조건식 없음 | Math.round(value)<br>call |

## H-d116aa6c963a

**@callback:result.points.filter** · [src/ui/math-geogebra.tsx:475](../../../src/ui/math-geogebra.tsx#L475)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bb69ccdef018

**@callback:[0, 1, 2].flatMap** · [src/ui/math-geogebra.tsx:476](../../../src/ui/math-geogebra.tsx#L476)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 477행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) | points.map((p) => p[i])<br>call<br>전달 콜백: H-12769fff6900 |
| 478행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) | Math.min(0, ...values)<br>call |
| 479행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) | Math.max(0, ...values)<br>call |
| 480행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) | Math.max(1, (high - low) * 0.2)<br>call |

반환/조기 중단: 481행 [low - padding, high + padding] [truthy: (rebuild && !preserveExpandedView) ||
        (revision.current >= 0 && revision.current !== viewRevision)]

## H-12769fff6900

**@callback:points.map** · [src/ui/math-geogebra.tsx:477](../../../src/ui/math-geogebra.tsx#L477)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-989a8dfe4b79

**@callback:low.map** · [src/ui/math-geogebra.tsx:500](../../../src/ui/math-geogebra.tsx#L500)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7a5cb9491f53

**@callback:['xZero', 'yZero', 'zZero'].forEach** · [src/ui/math-geogebra.tsx:504](../../../src/ui/math-geogebra.tsx#L504)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 505행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | coords.setAttribute(name, String(-(bounds[i * 2] + bounds[i * 2 + 1]) / 2))<br>call |
| 505행 | truthy: (rebuild && !preserveExpandedView) \|\|<br>        (revision.current >= 0 && revision.current !== viewRevision) ∧ truthy: scene.mode === 'curve' ∧ truthy: coords | String(-(bounds[i * 2] + bounds[i * 2 + 1]) / 2)<br>call |

## H-a4f7c9e9c08f

**@callback:useEffect** · [src/ui/math-geogebra.tsx:535](../../../src/ui/math-geogebra.tsx#L535)

분기 조건과 가능한 갈림길:

- B-a1e535de5f19 · IfStatement · !ready || error || !native → truthy / falsy; 바깥 조건: 별도 조건식 없음 (537행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 538행 | truthy: !ready \|\| error \|\| !native | onZoomReady(false)<br>call |
| 584행 | 별도 조건식 없음 | onZoomReady(true)<br>call |

반환/조기 중단: 539행 <render> [truthy: !ready || error || !native]; 585행 () => { zoomRef.current = null; onZoomReady(false); } [별도 조건식 없음]

## H-98ea100f25e3

**@onClick** · [src/ui/math-geogebra.tsx:597](../../../src/ui/math-geogebra.tsx#L597)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 597행 | truthy: error | setRetry((value) => value + 1)<br>state-update<br>전달 콜백: H-bee440db0d98 |

## H-bee440db0d98

**@callback:setRetry** · [src/ui/math-geogebra.tsx:597](../../../src/ui/math-geogebra.tsx#L597)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1af37326b3e0

**@onFocusCapture** · [src/ui/math-geogebra.tsx:606](../../../src/ui/math-geogebra.tsx#L606)

분기 조건과 가능한 갈림길:

- B-088a9ddc8efe · IfStatement · !(control instanceof HTMLInputElement) || !control.matches('.slider.accessibilityControl') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (608행).
- B-f05cbc197e71 · ConditionalExpression · control.max === '360' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (614행).
- B-ae0fc7599eb4 · ConditionalExpression · control.min === '-90' → truthy / falsy; 바깥 조건: falsy: control.max === '360' (614행).
- B-9169bcebf828 · IfStatement · label → truthy / falsy; 바깥 조건: 별도 조건식 없음 (615행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 610행 | falsy: !(control instanceof HTMLInputElement) | control.matches('.slider.accessibilityControl')<br>call |
| 616행 | truthy: label | control.setAttribute('aria-label', label)<br>call |

반환/조기 중단: 612행 <render> [truthy: !(control instanceof HTMLInputElement) ||
            !control.matches('.slider.accessibilityControl')]

