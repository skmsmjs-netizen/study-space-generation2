export const VERSION = 1;
export const KEY = 'manseeksong:math-template-kit:v1';
export function validateConcepts(records) {
  const engines = new Set(['exp-taylor', 'diagonal-map', 'p-series', 'constant-acceleration', 'spring-energy']);
  const components = new Set(['formula', 'curve-comparison', 'error-bound', 'derivation', 'matrix', 'plane-transformation', 'condition-flow', 'area-comparison', 'physical-scene', 'quantity-graph']);
  const seen = new Set();
  for (const [key, record] of Object.entries(records)) {
    if (!Object.hasOwn(defaults, key) || !record || !engines.has(record.engine)) throw new Error('지원하지 않는 개념 계산 종류입니다.');
    for (const field of ['id','name','english','question','domain']) if(typeof record[field] !== 'string' || !record[field].trim()) throw new Error('개념의 이름·목적·조건이 필요합니다.');
    if(record.subject === 'physics') {
      const p = record.physics;
      if(!p || !p.system || !p.coordinates || !p.assumptions?.length || !p.laws?.length || p.laws.some(law=>!law.name || !law.tex) || !p.quantities?.length || p.quantities.some(q=>!q.symbol || !q.name || !q.unit || !q.dimension)) throw new Error('물리의 계·좌표·가정·법칙·단위·차원이 필요합니다.');
    }
    if(seen.has(record.id)) throw new Error('개념 ID가 중복되었습니다.'); seen.add(record.id);
    if(!Array.isArray(record.frames) || !record.frames.length || record.frames.some(frame=> !['explore','derive','reason'].includes(frame))) throw new Error('보기 방식이 올바르지 않습니다.');
    if(!Array.isArray(record.components) || !record.components.length || record.components.some(component=> !components.has(component))) throw new Error('표현 구성 요소가 올바르지 않습니다.');
    if(!record.design || !record.design.roles || !record.design.correspondence || !record.design.sequence || !record.design.initialReason || record.components.some(component=> !record.design.roles[component])) throw new Error('표현의 역할·대응·순서·기본값 근거가 필요합니다.');
    if(!record.source || !record.source.title || new URL(record.source.url).protocol !== 'https:') throw new Error('확인할 수 있는 출처가 필요합니다.');
    if(!Array.isArray(record.steps) || record.steps.length<2 || record.steps.some(step=> typeof step !== 'string' || !step)) throw new Error('단계가 필요합니다.');
    if(!Array.isArray(record.controls) || record.controls.some(control=> !Object.hasOwn(defaults[key],control.key) || !control.label || !Number.isFinite(control.min) || !Number.isFinite(control.max) || !(control.min<control.max) || !(control.step>0) || defaults[key][control.key]<control.min || defaults[key][control.key]>control.max)) throw new Error('조절값과 기본 범위가 올바르지 않습니다.');
  }
  return records;
}
export const defaults = {
  motion: { x0: 0, v0: 2, a: 1, t: 2, quantity: 'position', step: 0, frame: 'explore' },
  energy: { m: 1, k: 4, amplitude: 1, r: 0.5, work: 'zero', step: 0, frame: 'reason' },
  taylor: { n: 3, x: 1, step: 0, frame: 'explore' },
  matrix: { a: 1.5, b: 0.7, step: 0, frame: 'explore' },
  series: { p: 2, sign: 'positive', pending: false, step: 0, frame: 'reason' },
};
export function factorial(n) {
  let result = 1;
  for (let k = 2; k <= n; k++) result *= k;
  return result;
}
export function taylor(x, n) {
  let term = 1, sum = 1;
  for (let k = 1; k <= n; k++) { term *= x / k; sum += term; }
  return sum;
}
export function remainderBound(x, n) {
  return Math.exp(Math.max(0, x)) * Math.abs(x) ** (n + 1) / factorial(n + 1);
}
export function transform(x, y, a, b) { return [a * x, b * y]; }
export function finiteIntegral(p, upper) {
  if (Math.abs(p - 1) < 1e-12) return Math.log(upper);
  return Math.expm1((1 - p) * Math.log(upper)) / (1 - p);
}
export function seriesOutcome(p, sign) {
  if (sign !== 'positive') return 'not-applicable';
  return p > 1 ? 'converges' : 'diverges';
}
export function maxStep(state) {
  if (state.sign !== 'positive') return 1;
  if (state.pending) return 2;
  return 5;
}
export function motionAt({x0,v0,a}, t) { return {x: x0+v0*t+a*t*t/2, v: v0+a*t, a}; }
export function springAt({m,k,amplitude,r,work}) {
  const x=amplitude*r, U=k*x*x/2;
  if(work!=='zero') return {x,U,E:null,K:null,speed:null};
  const E=k*amplitude*amplitude/2, K=Math.max(0,E-U);
  return {x,U,E,K,speed:Math.sqrt(2*K/m)};
}
export function energyMaxStep(view) {return view.work==='zero'?5:2;}
export function validRanges(ranges) {
  return ranges && ['x','y'].every(axis=>Array.isArray(ranges[axis]) && ranges[axis].length===2 && ranges[axis].every(n=>Number.isFinite(n) && Math.abs(n)<1e9) && ranges[axis][1]-ranges[axis][0]>=1e-8);
}
export function freshState() {
  return { version: VERSION, active: 'taylor', views: structuredClone(defaults) };
}
export function validateState(value) {
  if (!value || value.version !== VERSION || !Object.hasOwn(defaults, value.active) || !value.views) throw new Error('저장된 보기 형식을 읽을 수 없습니다.');
  const ranges = { motion: {x0:[-5,5],v0:[-5,5],a:[-3,3],t:[0,8]}, energy: {m:[0.1,5],k:[0.5,10],amplitude:[0.1,2],r:[-1,1]}, taylor: { n: [0, 8], x: [-3, 3] }, matrix: { a: [-2, 2], b: [-2, 2] }, series: { p: [0.5, 3] } };
  value = structuredClone(value);
  // Additive migration: keep the old three views unchanged and initialize only new models.
  for(const id of ['motion','energy']) if(!Object.hasOwn(value.views,id)) value.views[id]=structuredClone(defaults[id]);
  for (const id of Object.keys(defaults)) {
    const view = value.views[id];
    if (!view || !['explore', 'derive', 'reason'].includes(view.frame) || !Number.isInteger(view.step) || view.step < 0 || view.step > (['series','energy'].includes(id) ? 5 : 3)) throw new Error('저장된 단계가 올바르지 않습니다.');
    for (const [key, [low, high]] of Object.entries(ranges[id])) {
      if (!Number.isFinite(view[key]) || view[key] < low || view[key] > high || (key === 'n' && !Number.isInteger(view[key]))) throw new Error('저장된 조절값이 범위를 벗어났습니다.');
    }
    if (id === 'series' && (!['positive', 'alternating'].includes(view.sign) || typeof view.pending !== 'boolean' || view.step > maxStep(view))) throw new Error('급수의 조건과 단계가 일치하지 않습니다.');
    if (view.plotRanges!==undefined && (!view.plotRanges || typeof view.plotRanges!=='object' || Object.entries(view.plotRanges).some(([key,range])=>!['main','position','velocity','acceleration'].includes(key) || !validRanges(range)))) throw new Error('저장된 그래프 범위가 올바르지 않습니다.');
    if(id==='motion' && !['position','velocity','acceleration'].includes(view.quantity)) throw new Error('물리량 선택이 올바르지 않습니다.');
    if(id==='energy' && (!['zero','loss','unknown'].includes(view.work) || view.step>energyMaxStep(view) || !['explore','reason'].includes(view.frame))) throw new Error('에너지 조건과 단계가 일치하지 않습니다.');
    if (id === 'series' && view.frame !== 'reason') throw new Error('급수의 보기 방식이 올바르지 않습니다.');
    if (!['series','energy'].includes(id) && view.frame === 'reason') throw new Error('개념의 보기 방식이 올바르지 않습니다.');
  }
  return structuredClone(value);
}
