import { taylor, remainderBound, transform, finiteIntegral, motionAt, springAt } from './model.mjs';
import { decimalTicks } from './visibility.mjs';
import { hasVisibleTrace } from './visibility.mjs';
import { formatNumber as num, positiveMeasure } from './presentation.mjs';
import { bindGestures } from './gestures.mjs';
const samples = (f, lo, hi) => Array.from({length:401}, (_,i)=> {const x=lo+(hi-lo)*i/400;return [x,f(x)];});
const line = (points,name,dash='solid')=>({type:'scatter',mode:'lines',x:points.map(p=>p[0]),y:points.map(p=>p[1]),name,line:{dash,width:2}});
const dot = (x,y,name)=>({type:'scatter',mode:'markers',x:[x],y:[y],name,marker:{size:9},showlegend:false});
const pad = values => {const lo=Math.min(...values),hi=Math.max(...values),gap=Math.max(1,(hi-lo)*0.12);return [lo-gap,hi+gap];};
export function graphSpec(id,s) {
  let data=[],xRange=[-3,3],yRange=[-3,22],xLabel='x',yLabel='y',formula='',result='',description='',scene=null,xRich='$x$',yRich='$y$',resultRich='',descriptionRich='';
  if(id==='taylor') {
    data=[line(samples(Math.exp,-3,3),'원함수'),line(samples(x=>taylor(x,s.n),-3,3),'근사 다항식','dash'),dot(s.x,Math.exp(s.x),'원함숫값'),dot(s.x,taylor(s.x,s.n),'근사값')];
    data.push(line([[s.x,Math.exp(s.x)],[s.x,taylor(s.x,s.n)]],'관찰 오차','dot'));
    formula=String.raw`f(x)=e^x,\quad T_{${s.n}}(x)=\sum_{k=0}^{${s.n}}\frac{x^k}{k!}`;
    result=`x=${num(s.x)}: 함숫값 ≈ ${num(Math.exp(s.x))}; 근사값 ≈ ${num(taylor(s.x,s.n))}; 절대 오차 ≈ ${num(Math.abs(Math.exp(s.x)-taylor(s.x,s.n)))}; 오차 상계 ≈ ${num(remainderBound(s.x,s.n))}`;
    resultRich=String.raw`$x=${num(s.x)}$: 함숫값 $\approx ${num(Math.exp(s.x))}$; 근사값 $\approx ${num(taylor(s.x,s.n))}$; 절대 오차 $${positiveMeasure(Math.abs(Math.exp(s.x)-taylor(s.x,s.n)))}$; 오차 상계 $${positiveMeasure(remainderBound(s.x,s.n))}$`;
    description='실선은 지수함수, 파선은 근사 다항식입니다. 두 점과 점선은 선택한 x의 값과 오차입니다. 곡선 계산 구간은 −3≤x≤3입니다. 확대는 보기 범위를 바꾸며 계산 구간을 늘리지 않습니다.';
  } else if(id==='matrix') {
    const circle=Array.from({length:361},(_,i)=>[Math.cos(i*Math.PI/180),Math.sin(i*Math.PI/180)]);
    data=[line(circle,'단위원'),line(circle.map(p=>transform(...p,s.a,s.b)),'변환 결과','dash'),line([[0,0],[s.a,0]],'첫 기저벡터의 상','dot'),line([[0,0],[0,s.b]],'둘째 기저벡터의 상','dashdot'),dot(s.a,0,'Ae₁'),dot(0,s.b,'Ae₂')];
    yRange=[-3,3];
    formula=String.raw`A=\begin{pmatrix}${num(s.a)}&0\\0&${num(s.b)}\end{pmatrix},\quad Av=\binom{${num(s.a)}x}{${num(s.b)}y}`;
    result=`행렬식 = ${num(s.a*s.b)}; 넓이 배율 = ${num(Math.abs(s.a*s.b))}; ${s.a*s.b===0?'차원 붕괴':s.a*s.b<0?'방향 뒤집힘':'방향 유지'}`;
    resultRich=result;
    description='실선은 단위원, 파선은 변환 결과입니다. 두 선분의 끝점은 기저벡터의 상입니다. 확대·이동 후에도 가로·세로의 길이 축척을 같게 유지합니다.';
  } else if(id==='series') {
    xRange=[0,6.5];yRange=[0,1.15];
    if(s.sign==='positive') {
      for(let n=1;n<=5;n++)data.push({...line([[n,0],[n,n**(-s.p)],[n+1,n**(-s.p)],[n+1,0],[n,0]],'왼쪽 직사각형'),fill:'toself',showlegend:false,line:{width:1}});
      data.push(line(samples(x=>x**(-s.p),1,6),'양의 감소함수'));
      result=`유한 구간 [1,6]의 적분 ≈ ${num(finiteIntegral(s.p,6))}; 이는 무한 급수의 합이 아닙니다.`;
      description='유한 구간 [1,6]의 함수와 왼쪽 직사각형을 비교합니다. 확대하여도 무한 범위나 수렴의 증명을 나타내는 것은 아닙니다.';
    } else {result='원래 교대급수에 양항 비교를 적용하지 않습니다. 적용 불가는 발산의 결론이 아닙니다.';description='원래 대상이 양항급수가 아니므로 양항 비교 곡선을 표시하지 않습니다.';}
    formula=s.sign==='positive'?String.raw`\sum_{n=1}^{\infty}\frac1{n^{${num(s.p)}}}`:String.raw`\sum_{n=1}^{\infty}\frac{(-1)^n}{n^{${num(s.p)}}}`;
  } else if(id==='motion') {
    const q={position:['x','위치 x (m)'],velocity:['v','속도 v (m/s)'],acceleration:['a','가속도 a (m/s²)']}[s.quantity];
    const points=samples(t=>motionAt(s,t)[q[0]],0,8),v=motionAt(s,s.t);
    xRange=[0,8];yRange=pad(points.map(p=>p[1]));xLabel='시간 t (s)';yLabel=q[1];xRich=String.raw`시간 $t$ $(\mathrm{s})$`;yRich={position:String.raw`위치 $x$ $(\mathrm{m})$`,velocity:String.raw`속도 $v$ $(\mathrm{m/s})$`,acceleration:String.raw`가속도 $a$ $(\mathrm{m/s^2})$`}[s.quantity];
    data=[line(points,q[1]),dot(s.t,v[q[0]],'선택 시각')];
    formula=String.raw`a(t)=a,\quad v(t)=v_0+at,\quad x(t)=x_0+v_0t+\frac12at^2`;
    result=`t=${num(s.t)} s: x=${num(v.x)} m; v=${num(v.v)} m/s; a=${num(v.a)} m/s². ${v.v===0?'현재 정지 순간입니다.':v.v>0?'현재 오른쪽으로 움직입니다.':'현재 왼쪽으로 움직입니다.'}`;
    resultRich=String.raw`$t=${num(s.t)}\,\mathrm{s}$: $x=${num(v.x)}\,\mathrm{m}$; $v=${num(v.v)}\,\mathrm{m/s}$; $a=${num(v.a)}\,\mathrm{m/s^2}$. `+(v.v===0?'현재 정지 순간입니다.':v.v>0?'현재 오른쪽으로 움직입니다.':'현재 왼쪽으로 움직입니다.');
    description='아래 그래프의 가로축은 시간이며, 물체가 움직이는 길이 아닙니다. 선택한 물리량마다 세로축의 단위를 따로 표시합니다. 물체 그림과 그래프의 점은 같은 시각에 대응합니다.';
    const positions=samples(t=>motionAt(s,t).x,0,8).map(p=>p[1]);scene={position:v.x,range:pad([...positions,0]),label:`실제 공간 · x=${num(v.x)} m · 오른쪽이 +x`,spring:false};
  } else if(id==='energy') {
    const v=springAt(s),A=s.amplitude;
    xRange=[-A*1.2,A*1.2];yRange=[0,s.k*A*A*0.8+0.1];xLabel='변위 x (m)';yLabel='에너지 (J)';xRich=String.raw`변위 $x$ $(\mathrm{m})$`;yRich=String.raw`에너지 $(\mathrm{J})$`;
    data=[line(samples(x=>s.k*x*x/2,-A,A),'위치에너지 U'),dot(v.x,v.U,'현재 U')];
    if(s.work==='zero')data.push(line([[-A,v.E],[A,v.E]],'역학적 에너지 E','dash'),line(samples(x=>Math.max(0,v.E-s.k*x*x/2),-A,A),'운동에너지 K','dot'),dot(v.x,v.K,'현재 K'));
    formula=s.work==='zero'?String.raw`E=\frac12kA^2=K+U,\quad U=\frac12kx^2,\quad |v|=\sqrt{\frac{k}{m}(A^2-x^2)}`:String.raw`\Delta(K+U)=W_{\mathrm{nc}},\quad U=\frac12kx^2`;
    result=s.work==='zero'?`x=${num(v.x)} m: U=${num(v.U)} J; K=${num(v.K)} J; E=${num(v.E)} J; 속력 |v|≈${num(v.speed)} m/s. 위치만으로 속도의 방향은 정해지지 않습니다.`:s.work==='loss'?'마찰이 일을 하므로 역학적 에너지 보존 조건을 충족하지 않습니다. 마찰의 일을 구하기 전에는 K와 속력을 확정하지 않습니다.':'비보존력의 일 여부가 미확인입니다. U는 계산할 수 있지만, 보존식에 따른 K와 속력 결론은 보류합니다.';
    resultRich=s.work==='zero'?String.raw`$x=${num(v.x)}\,\mathrm{m}$: $U\approx ${num(v.U)}\,\mathrm{J}$; $K\approx ${num(v.K)}\,\mathrm{J}$; $E\approx ${num(v.E)}\,\mathrm{J}$; 속력 $|v|${positiveMeasure(v.speed)}\,\mathrm{m/s}$. 위치만으로 속도의 방향은 정해지지 않습니다.`:result.replace(/\b([UKE])\b/g,'$$$1$$');
    description=s.work==='zero'?'실선 U, 점선 K, 파선 E가 같은 변위 x에 대응합니다. U+K=E이며 E는 일정합니다. 위치 x는 시간이나 이동 경로 전체를 뜻하지 않습니다.':'U 곡선만 표시합니다. 조건이 없는데 보존된 E나 K 곡선을 그려 결론을 암시하지 않습니다.';
    scene={position:v.x,range:[-A*1.3,A*1.3],label:`물체 + 용수철 · 평형 x=0 · x=${num(v.x)} m`,spring:true};
  }
  const markupText=text=>text.replace(/U\+K=E/g,'$U+K=E$').replace(/−3≤x≤3/g,'$-3\\le x\\le3$').replace(/\b([xUKE])\b/g,(match,letter,offset,whole)=>whole.slice(0,offset).split('$').length%2===0?match:`$${letter}$`);
  descriptionRich=markupText(description);
  if(scene)scene.rich=(scene.spring?'물체 + 용수철 · 평형 $x=0$ · ':'실제 공간 · ')+String.raw`$x=${num(scene.position)}\,\mathrm{m}$`;
  if(id==='series')resultRich=result;
  data.forEach(trace=>{trace.legendRich=markupText(trace.name);trace.name=trace.name.replace(/ [xUvKE]\b/g,'').replace(/ \(m.*?\)/g,'');});
  return {xRich,yRich,resultRich,descriptionRich,data,xRange,yRange,xLabel,yLabel,formula,result,description,scene,equalScale:id==='matrix',key:id==='motion'?s.quantity:'main'};
}

// Shared Plotly view adapter: native buttons are the keyboard/touch alternative to dragging.
export function createGraph(node, status, onRange) {
  let spec=null, stored=null, pending=null, rendering=false, ready=false, bound=false, identity='',refreshingTicks=false;
  const css = key=>getComputedStyle(document.body).getPropertyValue(key).trim();
  const clearGestures=bindGestures(node,()=>ready&&!rendering?{x:[...node._fullLayout.xaxis.range],y:[...node._fullLayout.yaxis.range]}:null,
    async range=>{if(ready&&!rendering)await window.Plotly.relayout(node,{'xaxis.range':range.x,'yaxis.range':range.y});});
  function announce() {
    if(!node._fullLayout)return;
    const x=node._fullLayout.xaxis.range,y=node._fullLayout.yaxis.range;
    for(const axis of ['xaxis','yaxis']) {
      const range=node._fullLayout[axis].range, ticks=decimalTicks(range);
      const previous=node.layout[axis].tickvals || [];
      if(!refreshingTicks && JSON.stringify(previous)!==JSON.stringify(ticks)) {refreshingTicks=true;window.Plotly.relayout(node,{[axis+'.tickvals']:ticks}).finally(()=>{refreshingTicks=false;announce();});}
    }
    status.textContent=`가로 ${num(x[0])}…${num(x[1])} · 세로 ${num(y[0])}…${num(y[1])}`;
    const empty=document.getElementById('graph-empty');
    const tooFine=Math.min(x[1]-x[0],y[1]-y[0])<0.05;
    document.getElementById('zoom-in').disabled=Math.min(x[1]-x[0],y[1]-y[0])*0.8<0.05;
    const unavailable=spec.data.length>0 && (tooFine || !hasVisibleTrace(spec.data,x,y));
    empty.querySelector('p').textContent=tooFine?'확대 범위가 너무 작습니다':'현재 범위에 곡선이 없습니다';
    if(empty.hidden!==!unavailable){empty.hidden=!unavailable;document.getElementById('view-message').textContent=unavailable?empty.querySelector('p').textContent+'. 전체 보기로 돌아갈 수 있습니다.':'';}
  }
  async function drain() {
    if(rendering)return;
    rendering=true;node.setAttribute('aria-busy','true');
    try {
      while(pending) {
        const request=pending;pending=null;clearGestures();spec=request.spec;stored=request.stored;identity=request.identity;
        const range=stored || {x:spec.xRange,y:spec.yRange};
        const width=Math.round(node.clientWidth),height=spec.equalScale?width:document.body.classList.contains('graph-expanded')?Math.max(400,Math.min(680,innerHeight*0.7)):Math.max(290,Math.min(400,width*0.65));
        const colors=[css('--color-text'),css('--color-primary'),css('--color-muted')];
        spec.data.forEach((trace,i)=> {trace.hovertemplate='%{x:.2~f}, %{y:.2~f}<extra>%{fullData.name}</extra>';trace.line={...trace.line,color:colors[i%3]};trace.marker={...trace.marker,color:colors[i%3]};if(trace.fill)trace.fillcolor=css('--color-selected');});
        await window.Plotly.react(node,spec.data,{
          width,height,margin:{l:52,r:20,t:12,b:36},showlegend:false,dragmode:'pan',
          uirevision:identity,paper_bgcolor:css('--color-background'),plot_bgcolor:css('--color-background'),
          font:{family:getComputedStyle(document.body).fontFamily,color:css('--color-text'),size:12},
          xaxis:{title:{text:''},tickmode:'array',tickvals:decimalTicks(range.x),tickformat:'.2~f',hoverformat:'.2~f',range:range.x,autorange:false,gridcolor:css('--color-border'),zerolinecolor:css('--color-border-strong')},
          yaxis:{title:{text:''},tickmode:'array',tickvals:decimalTicks(range.y),tickformat:'.2~f',hoverformat:'.2~f',range:range.y,autorange:false,gridcolor:css('--color-border'),zerolinecolor:css('--color-border-strong'),...(spec.equalScale?{scaleanchor:'x',scaleratio:1,constrain:'domain'}:{})},
        },{displayModeBar:false,scrollZoom:false,responsive:false,doubleClick:false,showTips:false});
        ready=true;
        if(!bound) {node.on('plotly_relayout',()=> {announce();if(!rendering && ready)onRange(identity,{x:[...node._fullLayout.xaxis.range],y:[...node._fullLayout.yaxis.range]});});bound=true;}
        announce();
      }
    } catch {status.textContent='그래프를 표시하지 못했습니다. 화면을 다시 열어 확인해 주세요.';}
    finally {rendering=false;node.setAttribute('aria-busy','false');}
  }
  async function adjust(factor=1,dx=0,dy=0,reset=false) {
    if(!ready || rendering)return;
    const base=reset?{x:spec.xRange,y:spec.yRange}:{x:node._fullLayout.xaxis.range,y:node._fullLayout.yaxis.range};
    const move=(r,d)=>{const span=(r[1]-r[0])*factor,center=(r[0]+r[1])/2+d*(r[1]-r[0]);return [center-span/2,center+span/2];};
    const next=reset?base:{x:move(base.x,dx),y:move(base.y,dy)};
    if(!['x','y'].every(k=>next[k].every(n=>Number.isFinite(n)&&Math.abs(n)<1e8)&&next[k][1]>next[k][0]))return;
    if(!reset && factor<1 && Math.min(next.x[1]-next.x[0],next.y[1]-next.y[0])<0.05)return;

    await window.Plotly.relayout(node,{'xaxis.range':next.x,'yaxis.range':next.y,...(reset?{dragmode:'pan'}:{})});
    announce();
  }
  return {update:(next,ranges,id)=> {pending={spec:next,stored:ranges,identity:id};void drain();},adjust,ready:()=>ready&&!rendering};
}
