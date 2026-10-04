# src/ui/ink-pdf-background.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-9c89daea08c8

**InkPDFBackground** · [src/ui/ink-pdf-background.tsx:4](../../../src/ui/ink-pdf-background.tsx#L4)

분기 조건과 가능한 갈림길:

- B-8154645927bd · ConditionalExpression · image → truthy / falsy; 바깥 조건: 별도 조건식 없음 (26행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 5행 | 별도 조건식 없음 | useState(null)<br>call |
| 7행 | 별도 조건식 없음 | useEffectEvent(()=>openInkPDF({userId,namespace},reference))<br>call<br>전달 콜백: H-69f7d4629b8e |
| 8행 | 별도 조건식 없음 | useEffectEvent((message:string)=>onError(message))<br>call<br>전달 콜백: H-cb4c77a66b45 |
| 9행 | 별도 조건식 없음 | useState(null)<br>call |
| 11행 | 별도 조건식 없음 | useEffect(()=>{let closed=false;let opened:typeof pdf=null;setPDF(null);setImage(null); void openSource().then(value=>{opened=value;if(closed)void value.destroy();else setPDF(value);}).catch(e=>{if(!closed)reportError(e instanceof Error?e.message:'PDF를 열지 못했습니다.');}); return()=>{closed=true;if(opened)void opened.destroy();}; }, [userId,namespace,file.key,file.cloudPath,pages])<br>call<br>전달 콜백: H-d9374cd82eb0 |
| 15행 | 별도 조건식 없음 | useEffect(()=>{setImage(null);if(!pdf\|\|page<startPage\|\|page>=startPage+pages)return; let closed=false;let task:ReturnType<Awaited<ReturnType<typeof pdf.getPage>>['render']>\|undefined; let canvas:HTMLCanvasElement\|undefined; void (async()=>{const p=await pdf.getPage(page-startPage+1);if(closed)return; const original=p.getViewport({scale:1}),fit=paperFit(original.width,original.height); const viewport=p.getViewport({scale:fit.scale*2});canvas=window.document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height); task=p.render({canvas,viewport});await task.promise; if(!closed)setImage({href:canvas.toDataURL('image/png'),x:fit.x,y:fit.y,width:fit.width,hei … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-d71babffb570 |

반환/조기 중단: 26행 image?<image {...image} pointerEvents="none"/>:null [별도 조건식 없음]

## H-69f7d4629b8e

**@callback:useEffectEvent** · [src/ui/ink-pdf-background.tsx:7](../../../src/ui/ink-pdf-background.tsx#L7)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 7행 | 별도 조건식 없음 | openInkPDF({userId,namespace}, reference)<br>call |

## H-cb4c77a66b45

**@callback:useEffectEvent** · [src/ui/ink-pdf-background.tsx:8](../../../src/ui/ink-pdf-background.tsx#L8)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 8행 | 별도 조건식 없음 | onError(message)<br>call |

## H-d9374cd82eb0

**@callback:useEffect** · [src/ui/ink-pdf-background.tsx:11](../../../src/ui/ink-pdf-background.tsx#L11)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | 별도 조건식 없음 | setPDF(null)<br>state-update |
| 11행 | 별도 조건식 없음 | setImage(null)<br>state-update |
| 12행 | 별도 조건식 없음 | openSource().then(value=>{opened=value;if(closed)void value.destroy();else setPDF(value);}).catch(e=>{if(!closed)reportError(e instanceof Error?e.message:'PDF를 열지 못했습니다.');})<br>call<br>전달 콜백: H-ffd8e478326a |
| 12행 | 별도 조건식 없음 | openSource().then(value=>{opened=value;if(closed)void value.destroy();else setPDF(value);})<br>call<br>전달 콜백: H-5ade0cbc9a6d |
| 12행 | 별도 조건식 없음 | openSource()<br>call |

반환/조기 중단: 13행 ()=>{closed=true;if(opened)void opened.destroy();} [별도 조건식 없음]

## H-5ade0cbc9a6d

**@callback:openSource().then** · [src/ui/ink-pdf-background.tsx:12](../../../src/ui/ink-pdf-background.tsx#L12)

분기 조건과 가능한 갈림길:

- B-a5542e828bbe · IfStatement · closed → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: openSource() (12행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | fulfilled-or-explicit-rejection-handler: openSource() ∧ truthy: closed | value.destroy()<br>call |
| 12행 | fulfilled-or-explicit-rejection-handler: openSource() ∧ falsy: closed | setPDF(value)<br>state-update |

## H-ffd8e478326a

**@callback:openSource().then(value=>{opened=value;if(closed)void value.destroy();else setPDF(value);}).catch** · [src/ui/ink-pdf-background.tsx:12](../../../src/ui/ink-pdf-background.tsx#L12)

분기 조건과 가능한 갈림길:

- B-f273782b7c8a · IfStatement · !closed → truthy / falsy; 바깥 조건: rejected: openSource().then(value=>{opened=value;if(closed)void value.destroy();else setPDF(value);}) (12행).
- B-13e428113b2b · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: rejected: openSource().then(value=>{opened=value;if(closed)void value.destroy();else setPDF(value);}) ∧ truthy: !closed (12행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | rejected: openSource().then(value=>{opened=value;if(closed)void value.destroy();else setPDF(value);}) ∧ truthy: !closed | reportError(e instanceof Error?e.message:'PDF를 열지 못했습니다.')<br>call |

## H-d71babffb570

**@callback:useEffect** · [src/ui/ink-pdf-background.tsx:15](../../../src/ui/ink-pdf-background.tsx#L15)

분기 조건과 가능한 갈림길:

- B-fe9888ba2697 · IfStatement · !pdf||page<startPage||page>=startPage+pages → truthy / falsy; 바깥 조건: 별도 조건식 없음 (15행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 15행 | 별도 조건식 없음 | setImage(null)<br>state-update |
| 18행 | 별도 조건식 없음 | (async()=>{const p=await pdf.getPage(page-startPage+1);if(closed)return;<br>    const original=p.getViewport({scale:1}),fit=paperFit(original.width,original.height);<br>    const viewport=p.getViewport({scale:fit.scale*2});canvas=window.document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);<br>    task=p.render({canvas,viewport});await task.promise;<br>    if(!closed)setImage({href:canvas.toDataURL('image/png'),x:fit.x,y:fit.y,width:fit.width,height:fit.height});p.cleanup();<br>  })().catch(e=>{if(!closed)reportError(e instanceof Error?e.message:'PDF 쪽을 표시하지 못했습니다.');}).finally(()=>{if(canvas)canvas.width=canvas.height=0;})<br>call<br>전달 콜백: H-425d0c29ea3a |
| 18행 | 별도 조건식 없음 | (async()=>{const p=await pdf.getPage(page-startPage+1);if(closed)return;<br>    const original=p.getViewport({scale:1}),fit=paperFit(original.width,original.height);<br>    const viewport=p.getViewport({scale:fit.scale*2});canvas=window.document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);<br>    task=p.render({canvas,viewport});await task.promise;<br>    if(!closed)setImage({href:canvas.toDataURL('image/png'),x:fit.x,y:fit.y,width:fit.width,height:fit.height});p.cleanup();<br>  })().catch(e=>{if(!closed)reportError(e instanceof Error?e.message:'PDF 쪽을 표시하지 못했습니다.');})<br>call<br>전달 콜백: H-46a82f538bac |
| 18행 | 별도 조건식 없음 | async()=>{const p=await pdf.getPage(page-startPage+1);if(closed)return;<br>    const original=p.getViewport({scale:1}),fit=paperFit(original.width,original.height);<br>    const viewport=p.getViewport({scale:fit.scale*2});canvas=window.document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);<br>    task=p.render({canvas,viewport});await task.promise;<br>    if(!closed)setImage({href:canvas.toDataURL('image/png'),x:fit.x,y:fit.y,width:fit.width,height:fit.height});p.cleanup();<br>  }()<br>call → [H-2820fcf9fc8a](ui__ink-pdf-background.md#h-2820fcf9fc8a) |

반환/조기 중단: 15행 <render> [truthy: !pdf||page<startPage||page>=startPage+pages]; 24행 ()=>{closed=true;task?.cancel();} [별도 조건식 없음]

## H-2820fcf9fc8a

**@callback:async()=>{const p=await pdf.getPage(page-startPage+1);if(closed)return;
    const original=p.getViewport({scale:1}),fit=paperFit(original.width,original.height);
    const viewport=p.getViewport({scale:fit.scale*2});canvas=window.document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
    task=p.render({canvas,viewport});await task.promise;
    if(!closed)setImage({href:canvas.toDataURL('image/png'),x:fit.x,y:fit.y,width:fit.width,height:fit.height});p.cleanup();
  }** · [src/ui/ink-pdf-background.tsx:18](../../../src/ui/ink-pdf-background.tsx#L18) · async

분기 조건과 가능한 갈림길:

- B-2379e5651783 · IfStatement · closed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (18행).
- B-07a4b1605f24 · IfStatement · !closed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (22행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 18행 | 별도 조건식 없음 | pdf.getPage(page-startPage+1)<br>call |
| 19행 | 별도 조건식 없음 | p.getViewport({scale:1})<br>call |
| 19행 | 별도 조건식 없음 | paperFit(original.width, original.height)<br>call |
| 20행 | 별도 조건식 없음 | p.getViewport({scale:fit.scale*2})<br>call |
| 20행 | 별도 조건식 없음 | window.document.createElement('canvas')<br>call |
| 20행 | 별도 조건식 없음 | Math.ceil(viewport.width)<br>call |
| 20행 | 별도 조건식 없음 | Math.ceil(viewport.height)<br>call |
| 21행 | 별도 조건식 없음 | p.render({canvas,viewport})<br>call |
| 22행 | truthy: !closed | setImage({href:canvas.toDataURL('image/png'),x:fit.x,y:fit.y,width:fit.width,height:fit.height})<br>state-update |
| 22행 | truthy: !closed | canvas.toDataURL('image/png')<br>call |
| 22행 | 별도 조건식 없음 | p.cleanup()<br>call |

반환/조기 중단: 18행 <render> [truthy: closed]

## H-46a82f538bac

**@callback:(async()=>{const p=await pdf.getPage(page-startPage+1);if(closed)return;
    const original=p.getViewport({scale:1}),fit=paperFit(original.width,original.height);
    const viewport=p.getViewport({scale:fit.scale*2});canvas=window.document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
    task=p.render({canvas,viewport});await task.promise;
    if(!closed)setImage({href:canvas.toDataURL('image/png'),x:fit.x,y:fit.y,width:fit.width,height:fit.height});p.cleanup();
  })().catch** · [src/ui/ink-pdf-background.tsx:23](../../../src/ui/ink-pdf-background.tsx#L23)

분기 조건과 가능한 갈림길:

- B-792612095c8f · IfStatement · !closed → truthy / falsy; 바깥 조건: rejected: (async()=>{const p=await pdf.getPage(page-startPage+1);if(closed)return;
    const original=p.getViewport({scale:1}),fit=paperFit(original.width,original.height);
    const viewport=p.getViewport({scale:fit.scale*2});canvas=window.document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
    task=p.render({canvas,viewport});await task.promise;
    if(!closed)setImage({href:canvas.toDataURL('image/png'),x:fit.x,y:fit.y,width:fit.width,height:fit.height});p.cleanup();
  })() (23행).
- B-092ffe10754d · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: rejected: (async()=>{const p=await pdf.getPage(page-startPage+1);if(closed)return;
    const original=p.getViewport({scale:1}),fit=paperFit(original.width,original.height);
    const viewport=p.getViewport({scale:fit.scale*2});canvas=window.document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
    task=p.render({canvas,viewport});await task.promise;
    if(!closed)setImage({href:canvas.toDataURL('image/png'),x:fit.x,y:fit.y,width:fit.width,height:fit.height});p.cleanup();
  })() ∧ truthy: !closed (23행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | rejected: (async()=>{const p=await pdf.getPage(page-startPage+1);if(closed)return;<br>    const original=p.getViewport({scale:1}),fit=paperFit(original.width,original.height);<br>    const viewport=p.getViewport({scale:fit.scale*2});canvas=window.document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);<br>    task=p.render({canvas,viewport});await task.promise;<br>    if(!closed)setImage({href:canvas.toDataURL('image/png'),x:fit.x,y:fit.y,width:fit.width,height:fit.height});p.cleanup();<br>  })() ∧ truthy: !closed | reportError(e instanceof Error?e.message:'PDF 쪽을 표시하지 못했습니다.')<br>call |

## H-425d0c29ea3a

**@callback:(async()=>{const p=await pdf.getPage(page-startPage+1);if(closed)return;
    const original=p.getViewport({scale:1}),fit=paperFit(original.width,original.height);
    const viewport=p.getViewport({scale:fit.scale*2});canvas=window.document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
    task=p.render({canvas,viewport});await task.promise;
    if(!closed)setImage({href:canvas.toDataURL('image/png'),x:fit.x,y:fit.y,width:fit.width,height:fit.height});p.cleanup();
  })().catch(e=>{if(!closed)reportError(e instanceof Error?e.message:'PDF 쪽을 표시하지 못했습니다.');}).finally** · [src/ui/ink-pdf-background.tsx:23](../../../src/ui/ink-pdf-background.tsx#L23)

분기 조건과 가능한 갈림길:

- B-93d816b0bca3 · IfStatement · canvas → truthy / falsy; 바깥 조건: settled: (async()=>{const p=await pdf.getPage(page-startPage+1);if(closed)return;
    const original=p.getViewport({scale:1}),fit=paperFit(original.width,original.height);
    const viewport=p.getViewport({scale:fit.scale*2});canvas=window.document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
    task=p.render({canvas,viewport});await task.promise;
    if(!closed)setImage({href:canvas.toDataURL('image/png'),x:fit.x,y:fit.y,width:fit.width,height:fit.height});p.cleanup();
  })().catch(e=>{if(!closed)reportError(e instanceof Error?e.message:'PDF 쪽을 표시하지 못했습니다.');}) (23행).

