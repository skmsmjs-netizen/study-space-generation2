import { createViewStorage } from './host.mjs';
import { concepts } from './concepts.mjs';
import { freshState, validateState, validateConcepts, taylor, remainderBound, transform, finiteIntegral, maxStep, energyMaxStep, validRanges } from './model.mjs';
import { inline, formatNumber as num, units, dimensionTex, equationLines } from './presentation.mjs';
import { graphSpec, createGraph } from './graphs.mjs';

const viewStorage = await createViewStorage();
let saveSequence = 0;
const $ = (id) => document.getElementById(id);
let state = freshState(), blocked = false;
validateConcepts(concepts);
const titles = { explore: '관계 탐색 · Explore', derive: '단계 전개 · Derive', reason: '조건 판단 · Reason' };
try {
  const raw = await viewStorage.read();
  if (raw !== null) state = validateState(JSON.parse(raw));
} catch { blocked = true; showStorageError('저장된 보기를 읽지 못했습니다. 기존 저장값은 보존하고, 현재 보기를 내보낼 수 있습니다.'); }
function showStorageError(message) {
  $('storage-error').hidden = false;
  $('storage-error').replaceChildren(document.createTextNode(message + ' '));
  const retry = document.createElement('button');
  retry.type = 'button'; retry.textContent = '저장 다시 확인';
  retry.onclick = async () => {
    try {
      const raw = await viewStorage.read();
      if (raw !== null) validateState(JSON.parse(raw));
      blocked = false; save();
    } catch { showStorageError('기존 저장값을 안전하게 읽지 못했습니다. 자동으로 덮어쓰지 않습니다. 현재 보기 내보내기를 사용할 수 있습니다.'); }
  };
  $('storage-error').append(retry);
}
async function save() {
  if (blocked) return;
  const sequence = ++saveSequence;
  try {
    await viewStorage.write(JSON.stringify(state));
    if (sequence !== saveSequence) return;
    $('storage-error').hidden = true;
    $('save-status').textContent = '보기 위치 저장됨 · 이 기기';
  } catch { if (sequence !== saveSequence) return; showStorageError('이 기기에 저장하지 못했습니다. 현재 화면은 유지됩니다. 다시 확인하거나 현재 보기를 내보내세요.'); }
}
function math(id, tex) {
  const node = $(id);
  try {
    node.replaceChildren(...equationLines(tex).map(line=>{const row=document.createElement('div');row.className='formula-line';window.katex.render(line,row,{displayMode:true,throwOnError:true,trust:false,output:'htmlAndMathml'});return row;}));
  }
  catch { node.textContent = '수식을 표시하지 못했습니다. 화면을 다시 열어 확인해 주세요.'; node.setAttribute('role', 'alert'); }
}
function detailsFor(id, s) {
  if (id === 'taylor') return [
    ['지수함수를 중심점 0에서 다항식으로 근사합니다. 유한한 차수의 다항식과 원래 함수를 구별합니다.', String.raw`f(x)=e^x,\quad T_N(x)=\sum_{k=0}^{N}\frac{x^k}{k!}`],
    ['지수함수의 모든 차수 도함수는 지수함수입니다. 중심점에서 도함수의 값이 1이므로 각 계수가 정해집니다.', String.raw`f^{(k)}(0)=1,\quad c_k=\frac{f^{(k)}(0)}{k!}=\frac1{k!}`],
    ['앞의 근사에 다음 항을 더합니다. 차수를 바꾸면 파선과 관찰 위치의 값이 함께 바뀝니다.', String.raw`T_{N+1}(x)=T_N(x)+\frac{x^{N+1}}{(N+1)!}`],
    ['그래프의 간격은 선택 위치의 오차를 나타냅니다. 나머지항 정리에서 얻은 상계는 실제 오차와 다르며, 수치 표시는 근삿값입니다.', String.raw`|e^x-T_N(x)|\le\frac{e^{\max(0,x)}|x|^{N+1}}{(N+1)!}`],
  ];
  if (id === 'matrix') return [
    ['각 벡터에 같은 행렬을 적용합니다. 실선인 단위원과 파선인 그 상을 함께 표시합니다.', String.raw`A=\begin{pmatrix}a&0\\0&b\end{pmatrix},\quad v\mapsto Av`],
    ['행렬의 첫째 열과 둘째 열은 각각 기저벡터의 상입니다. 그림의 화살표가 이 두 방향을 나타냅니다.', String.raw`Ae_1=\binom{a}{0},\quad Ae_2=\binom{0}{b}`],
    ['일반 벡터를 두 기저벡터의 선형결합으로 쓰고 변환하면, 각 방향의 배율이 성분에 적용됩니다.', String.raw`A(xe_1+ye_2)=xAe_1+yAe_2=\binom{ax}{by}`],
    ['행렬식의 절댓값은 넓이 배율입니다. 행렬식이 음수이면 방향이 뒤집히며, 0이면 평면이 선 또는 점으로 붕괴합니다.', String.raw`\det A=ab,\quad\text{넓이 배율}=|ab|`],
  ];
  if (id === 'motion') return [
    ['물체를 질점으로 두고 고정된 관성계에서 오른쪽을 양의 방향으로 잡습니다. 공간 그림의 가로축은 위치이며, 아래 그래프의 가로축은 시간입니다.', String.raw`x(0)=x_0,\quad v(0)=v_0,\quad t\ge0`],
    ['가속도가 일정하다는 조건을 먼저 확인합니다. 시간이 지나며 가속도가 변하는 문제에는 이 식을 그대로 쓰지 않습니다.', String.raw`a=\frac{dv}{dt}=\mathrm{constant}`],
    ['가속도를 시간에 대해 적분하고 초기 속도를 넣습니다. 음의 가속도 자체는 감속을 뜻하지 않습니다. 속도와 가속도의 부호가 반대일 때 속력이 줄어듭니다.', String.raw`v(t)-v_0=\int_0^t a\,d\tau=at`],
    ['속도를 적분해 위치를 얻습니다. 초기값 $t=0$과 $a=0$인 등속 운동을 확인합니다. 모든 위치 항의 단위는 $\\mathrm{m}$입니다. 시각 하나에서의 위치·속도·가속도를 함께 읽습니다.', String.raw`x(t)-x_0=\int_0^t(v_0+a\tau)\,d\tau=v_0t+\frac12at^2`],
  ];
  if (id === 'energy') return [
    ['현재 변위에서 속력을 구하려고 합니다. 위치만으로 왕복 운동의 방향은 결정되지 않으므로 속도와 속력을 구별합니다.', String.raw`x=rA,\quad \text{구하는 것: }|v|`],
    ['물체와 용수철을 하나의 계로 잡습니다. 수평 운동에서 중력과 수직항력은 일을 하지 않고, 고정된 벽도 움직이지 않습니다. 용수철 힘은 위치에너지로 계산합니다.', String.raw`F_s=-kx,\quad U(0)=0,\quad U(x)=\frac12kx^2`],
    [s.work==='zero'?'마찰 등 비보존력의 일이 0인 모델입니다. 역학적 에너지의 합을 일정하게 둘 조건을 확인했습니다.':s.work==='loss'?'마찰이 일을 한다고 지정했습니다. 역학적 에너지는 보존되지 않습니다. 전체 에너지가 사라진다는 뜻은 아니며, 마찰의 일이나 열에너지 변화를 포함해야 합니다.':'비보존력의 일 여부를 아직 확인하지 못했습니다. 조건을 참으로 처리하지 않고 보존식에 따른 속력 결론을 보류합니다.', String.raw`\Delta(K+U)=W_{\mathrm{nc}},\quad W_{\mathrm{nc}}=0\ \Rightarrow\ K+U=\mathrm{constant}`],
    ['진폭 $A$에서 정지한 초기 상태의 에너지를 구하고, 현재 위치의 운동에너지와 위치에너지의 합에 연결합니다.', String.raw`\frac12 kA^2=\frac12 m v^2+\frac12 kx^2`],
    ['운동에너지를 분리해 속력을 구합니다. 허용된 변위는 $|x|\\le A$이며 질량과 용수철 상수는 양수입니다.', String.raw`K=\frac{k}{2}(A^2-x^2),\quad |v|=\sqrt{\frac{k}{m}(A^2-x^2)}`],
    ['$kx^2$의 단위는 $\\mathrm{J}$, $2K/m$의 단위는 $\\mathrm{m^2/s^2}$입니다. $x=\\pm A$에서는 속력이 0이고 $x=0$에서는 최대입니다. 같은 위치를 양방향으로 통과할 수 있어 속력만으로 방향을 정하지 않습니다.', String.raw`|v|(\pm A)=0,\quad |v|(0)=A\sqrt{\frac{k}{m}}`],
  ];
  const original = s.sign === 'positive' ? String.raw`\sum_{n=1}^{\infty}\frac1{n^p}` : String.raw`\sum_{n=1}^{\infty}\frac{(-1)^n}{n^p}`;
  return [
    ['원래 급수의 부호와 지수를 확인합니다. 이 틀은 특정 정리를 적용할 수 있는지와 원래 급수의 결론을 구별합니다.', original],
    [s.sign === 'positive' ? '모든 항이 양수입니다. 실수의 함수 $f(x)=x^{-p}$로 연결하고 다음 조건을 확인합니다.' : '부호가 번갈아 바뀌므로 원래 급수에 적분판정법을 직접 적용할 수 없습니다. 이것으로 발산을 결론내릴 수는 없습니다. 양항급수로 대상을 바꾸거나 다른 판정법을 선택해야 합니다.', s.sign === 'positive' ? String.raw`a_n=\frac1{n^p}>0` : String.raw`a_n=\frac{(-1)^n}{n^p}\quad\text{양항 조건 불충족}`],
    [s.pending ? '아직 확인하지 못한 상태입니다. 거짓이나 발산으로 처리하지 않고 이후 결론을 보류합니다.' : '$x\\ge1$에서 $x$는 양수이므로 실수 거듭제곱 함수가 연속입니다. 그래프의 표본만 보고 연속성을 증명한 것은 아닙니다.', String.raw`f(x)=x^{-p}\quad (x\ge1)`],
    ['현재 조절 범위에서 $p$는 양수입니다. 도함수의 부호로 감소함을 확인합니다.', String.raw`f'(x)=-p x^{-p-1}<0\quad(p>0,\ x\ge1)`],
    ['유한한 상한 $R$에서 먼저 적분하고 $R$을 무한대로 보냅니다. $p=1$은 따로 다룹니다. 그림은 $R=6$인 유한 비교입니다.', String.raw`\int_1^R x^{-p}\,dx=\begin{cases}\ln R&p=1\\\dfrac{R^{1-p}-1}{1-p}&p\ne1\end{cases}`],
    [s.p > 1 ? '적용 조건을 확인했고 이상적분이 유한하게 수렴하므로 원래 양항급수도 수렴합니다. 적분값을 급수의 합으로 취급하지 않습니다.' : '적용 조건을 확인했고 이상적분이 발산하므로 원래 양항급수도 발산합니다.', String.raw`\sum_{n=1}^{\infty}n^{-p}\quad\begin{cases}\text{수렴}&p>1\\\text{발산}&0<p\le1\end{cases}`],
  ];
}
const graph = createGraph($('plot'),$('graph-status'),(identity,ranges)=> {
  const [id,key]=identity.split(':');
  if(!state.views[id])return;
  if(!validRanges(ranges)) {void graph.adjust(1,0,0,true);return;}
  state.views[id].plotRanges ??= {};
  state.views[id].plotRanges[key]=ranges;save();
});
function draw() {
  const id=state.active,s=state.views[id],spec=graphSpec(id,s);
  graph.update(spec,s.plotRanges?.[spec.key],`${id}:${spec.key}`);
  inline($('plot-description'),spec.descriptionRich);inline($('result'),spec.resultRich);
  inline($('graph-x-label'),spec.xRich);inline($('graph-y-label'),spec.yRich);
  math('main-formula',spec.formula);
  $('graph-legend').replaceChildren(...spec.data.filter(t=>t.mode==='lines' && t.showlegend!==false).map(t=> {
    const label=document.createElement('span');inline(label,`${{solid:'실선',dash:'파선',dot:'점선',dashdot:'일점쇄선'}[t.line.dash] || '실선'} · ${t.legendRich}`);return label;
  }));
  $('physical-scene').hidden=!spec.scene;
  if(spec.scene) {
    const p=spec.scene,w=600,X=x=>36+(x-p.range[0])/(p.range[1]-p.range[0])*(w-72),pos=X(p.position),zero=X(0);
    const spring=p.spring?`<path class="changed" d="M36 62 ${Array.from({length:16},(_,i)=>`L${36+(pos-50)*i/15} ${i%2?70:54}`).join(' ')} L${pos} 62"/>`:'';
    $('physical-scene').innerHTML=`<p id="scene-label"></p><svg viewBox="0 0 600 110" role="img" aria-label="공간의 물체 위치"><line class="axis" x1="36" x2="564" y1="80" y2="80"/><line class="axis" x1="${zero}" x2="${zero}" y1="36" y2="85"/>${spring}<rect class="original" x="${pos-10}" y="42" width="20" height="32"/><text x="${zero}" y="103" text-anchor="middle">0</text></svg>`;
    inline($('scene-label'),p.rich+String.raw` · 양의 방향 $+x$ $(\mathrm{m})$`);
  }
}
function renderReasoning() {
  const id = state.active, s = state.views[id], c = concepts[id];
  const limit = id === 'series' ? maxStep(s) : id==='energy'?energyMaxStep(s):c.steps.length-1;
  s.step = Math.min(s.step,limit);
  $('steps').replaceChildren();
  c.steps.forEach((title,i)=> {
    const li = document.createElement('li'), b = document.createElement('button');
    const number=document.createElement('span'),label=document.createElement('span');
    number.className='step-number';number.textContent=String(i+1);number.setAttribute('aria-hidden','true');
    label.textContent=title;b.append(number,label);b.setAttribute('aria-label',`${i+1}. ${title}`);b.type='button';b.disabled=i>limit;
    if(i===s.step) b.setAttribute('aria-current','step');
    b.onclick=()=> {s.step=i; renderReasoning(); $('steps').querySelector('[aria-current="step"]').focus({preventScroll:true}); save();}; li.append(b); $('steps').append(li);
  });
  const activeStep = s.frame==='explore' ? Math.min(c.steps.length-1,limit) : s.step;
  $('reading-position').textContent=s.frame==='explore'?'관계 탐색':`현재 ${activeStep+1} / ${c.steps.length} 단계`;
  $('steps').hidden = s.frame==='explore';
  $('step-title').textContent = s.frame==='explore' ? '연결해서 볼 관계' : c.steps[activeStep];
  const [explanation,tex] = detailsFor(id,s)[activeStep];
  inline($('explanation'),explanation); math('evidence',tex);
  $('branch').replaceChildren();
  if(id==='series' && s.step===1 && s.sign==='alternating') {
    const button=document.createElement('button'); button.type='button'; button.textContent='양항급수를 살펴보기';
    button.onclick=()=> {s.sign='positive'; s.pending=false; s.step=0; renderControls(); render(); save();}; $('branch').append(button);
  }
  if(id==='series' && s.step===2) {
    const button=document.createElement('button'); button.type='button'; button.textContent=s.pending?'근거를 확인하고 재개':'아직 확인하지 못했다면';
    button.onclick=()=> {s.pending=!s.pending; renderReasoning(); save();}; $('branch').append(button);
  }
  if(id==='energy' && s.work!=='zero') {
    const button=document.createElement('button');button.type='button';button.textContent='마찰 없는 모델로 돌아가기';
    button.onclick=()=> {s.work='zero';s.step=2;renderControls();render();save();};$('branch').append(button);
  }
  $('previous').disabled=s.step===0; $('next').disabled=s.step>=limit;
  document.querySelector('.step-actions').hidden=s.frame==='explore';
}
function renderControls() {
  const id=state.active, c=concepts[id], s=state.views[id]; $('controls').replaceChildren();
  c.controls.forEach(control=> {
    const wrap=document.createElement('div'); wrap.className='control';
    const label=document.createElement('label'); inline(label,control.labelRich || control.label); label.htmlFor=`${id}-${control.key}-value`;
    const fields=document.createElement('div'); fields.className='control-fields';
    const range=document.createElement('input'), number=document.createElement('input');
    range.type='range'; number.type='number'; number.id=`${id}-${control.key}-value`;
    number.setAttribute('aria-label',control.label);
    range.setAttribute('aria-label',`${control.label} · 슬라이더`);
    for(const input of [range,number]) {input.min=control.min;input.max=control.max;input.step=control.step;input.value=num(s[control.key]);}
    range.oninput=()=> {s[control.key]=Number(range.value);number.value=num(s[control.key]); render(); save();};
    number.onchange=()=> {
      if(!number.checkValidity() || number.value==='') {number.reportValidity();return;}
      s[control.key]=Number(number.value);range.value=number.value;number.value=num(s[control.key]); render();save();
    };
    fields.append(range,number);wrap.append(label,fields);$('controls').append(wrap);
  });
  if(id==='motion' || id==='energy') {
    const label=document.createElement('label'),select=document.createElement('select');
    const key=id==='motion'?'quantity':'work';label.textContent=id==='motion'?'살펴볼 물리량':'비보존력의 일';select.setAttribute('aria-label',label.textContent);
    select.innerHTML=id==='motion'?'<option value="position">위치</option><option value="velocity">속도</option><option value="acceleration">가속도</option>':'<option value="zero">없음 · 마찰 없는 모델</option><option value="loss">있음 · 마찰이 일을 함</option><option value="unknown">아직 확인하지 못함</option>';
    select.value=s[key];select.onchange=()=> {s[key]=select.value;if(id==='energy')s.step=Math.min(s.step,energyMaxStep(s));render();save();};label.append(select);$('controls').append(label);
  }
  if(id==='series') {
    const label=document.createElement('label');label.textContent='원래 급수의 부호';
    const select=document.createElement('select');select.setAttribute('aria-label','원래 급수의 부호');
    select.innerHTML='<option value="positive">양항급수</option><option value="alternating">교대급수</option>';
    select.value=s.sign;select.onchange=()=> {s.sign=select.value;s.step=0;s.pending=false;render();save();};label.append(select);$('controls').append(label);
  }
}
function render() {draw();renderReasoning();}
function activate() {
  const id=state.active,c=concepts[id],s=state.views[id];$('concept').value=id;
  $('title').textContent=c.name;$('english').textContent=c.english;$('question').textContent=c.question;inline($('domain'),c.domain);
  $('physics-details').hidden=!c.physics;
  if(c.physics) {
    $('physics-details').replaceChildren();
    for(const [label,value] of [['계',c.physics.system],['좌표·기준',c.physics.coordinates],['모델의 가정',c.physics.assumptions.join(' · ')]]) {
      const p=document.createElement('p');inline(p,`${label}: ${value}`);$('physics-details').append(p);
    }
    for(const law of c.physics.laws) {
      const label=document.createElement('p');label.textContent=law.name;
      const formula=document.createElement('div');formula.className='formula';formula.tabIndex=0;formula.setAttribute('role','region');formula.setAttribute('aria-label',law.name+'의 수식');
      window.katex.render(law.tex,formula,{displayMode:true,throwOnError:true,trust:false,output:'htmlAndMathml'});$('physics-details').append(label,formula);
    }
    const dl=document.createElement('dl');
    c.physics.quantities.forEach(q=> {const dt=document.createElement('dt'),dd=document.createElement('dd');inline(dt,`${q.name} ($${q.symbol}$)`);inline(dd,`$${units[q.unit]}$ · 차원 $${dimensionTex(q.dimension)}$`);dl.append(dt,dd);});$('physics-details').append(dl);
  }
  $('source').textContent=c.source.title;$('source').href=c.source.url;
  $('frame').replaceChildren(...c.frames.map(frame=> {const option=document.createElement('option');option.value=frame;option.textContent=titles[frame];return option;}));
  $('frame').value=s.frame;renderControls();render();
}
$('concept').onchange=()=> {state.active=$('concept').value;activate();save();};
$('frame').onchange=()=> {state.views[state.active].frame=$('frame').value;renderReasoning();save();};
$('previous').onclick=()=> {state.views[state.active].step--;renderReasoning();save();};
$('next').onclick=()=> {state.views[state.active].step++;renderReasoning();save();};
$('reset').onclick=()=> {const reset=freshState();state.views[state.active]=reset.views[state.active];activate();save();};
$('export').onclick=()=> {const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='math-template-view.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('zoom-in').onclick=()=>graph.adjust(0.8);
$('zoom-out').onclick=()=>graph.adjust(1.25);
function restoreGraph() {void graph.adjust(1,0,0,true);}
$('graph-reset').onclick=restoreGraph;
$('graph-recover').onclick=()=>{restoreGraph();$('graph-reset').focus();};
function expandGraph(expanded) {
  document.body.classList.toggle('graph-expanded',expanded);
  $('graph-large').setAttribute('aria-expanded',String(expanded));$('graph-large').textContent=expanded?'기본 크기로':'크게 보기';draw();
}
$('graph-large').onclick=()=>expandGraph(!document.body.classList.contains('graph-expanded'));
document.addEventListener('keydown',event=> {if(event.key==='Escape' && document.body.classList.contains('graph-expanded')) {expandGraph(false);$('graph-large').focus();}});
$('plot').onkeydown=event=> {
  const actions={'+':()=>graph.adjust(0.8),'=':()=>graph.adjust(0.8),'-':()=>graph.adjust(1.25),'0':restoreGraph,ArrowLeft:()=>graph.adjust(1,-0.2,0),ArrowRight:()=>graph.adjust(1,0.2,0),ArrowUp:()=>graph.adjust(1,0,0.2),ArrowDown:()=>graph.adjust(1,0,-0.2)};
  if(actions[event.key]) {event.preventDefault();actions[event.key]();}
};
let lastWidth=0;
new ResizeObserver(()=> {const width=$('plot').clientWidth;if(Math.abs(width-lastWidth)>1){lastWidth=width;draw();}}).observe($('plot'));
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',draw);
activate();

window.addEventListener('host-appearance',()=>draw());
// Short jumps keep the graph and its reasoning reachable on stacked layouts.
// Focus follows the destination, so keyboard users can continue there too.
document.querySelectorAll('.panel-jump').forEach(link=>link.addEventListener('click',event=> {
  const target=$(link.getAttribute('href').slice(1));
  if(target){event.preventDefault();target.focus();target.scrollIntoView({block:'start',behavior:'instant'});}
}));
