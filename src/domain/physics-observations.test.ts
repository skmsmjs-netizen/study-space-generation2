import { describe, expect, it } from 'vitest';
import katex from 'katex';
import { physicsCatalog, physicsObservations, physicsMapping, evaluatePhysics, initialValues, samplePhysics, observationReadout, secondaryPhysics, dampedValue, dampingRegime } from './physics-observations';
import { freshPhysicsBook, physicsView, validatePhysicsBook } from '../data/physics-observation-view';
const get=(engine:string)=>physicsObservations.find(o=>o.engine===engine)!;
describe('물리 교재의 원문과 관찰 대응',()=>{
  it('28장·167절·138수식의 기존 ID를 누락·중복 없이 재사용한다',()=>{
    expect(physicsCatalog.chapters.map(c=>c.chapter)).toEqual(Array.from({length:28},(_,i)=>i+1));
    expect(physicsMapping).toHaveLength(167);expect(new Set(physicsMapping.map(m=>m.id)).size).toBe(167);
    expect([...physicsCatalog.chapters.flatMap(c=>c.formulas),...physicsCatalog.supplementalFormulas]).toHaveLength(138);
    for(const m of physicsMapping){expect(m.pdf).toBeGreaterThan(0);expect(m.printed).toBeGreaterThan(0);expect(m.reason.length).toBeGreaterThan(20);for(const id of m.observations)expect(physicsObservations.some(o=>o.id===id)).toBe(true);}
  });
  it('원문 연결을 가진 모든 관찰 식과 기존 수식이 실제 KaTeX로 렌더된다',()=>{
    for(const c of physicsCatalog.chapters)for(const f of c.formulas)expect(()=>katex.renderToString(f.tex,{throwOnError:true,trust:false})).not.toThrow();
    for(const o of physicsObservations){expect(o.sections.every(id=>physicsMapping.some(m=>m.id===id))).toBe(true);for(const tex of [o.formula,o.x,o.y,observationReadout(o,initialValues(o)).tex])expect(()=>katex.renderToString(tex,{throwOnError:true,trust:false})).not.toThrow();}
  });
  it('등가속도 위치와 속도가 해석적 적분값에 일치한다',()=>{const o=get('motion');expect(evaluatePhysics(o,{x0:0,v0:2,a:2,t:1},1)).toBe(3);expect(evaluatePhysics(o,{x0:0,v0:2,a:4,t:1},1)).toBe(4);expect(observationReadout(o,{x0:0,v0:2,a:4,t:1}).tex).toContain('v=6');});
  it('에너지 조건 위반·미확인에서 속력 보존 결론을 보류한다',()=>{const o=get('energy'),p=initialValues(o);expect(observationReadout(o,p,'unknown').tex).toContain('보류');expect(observationReadout(o,p,'nonzero').tex).toContain('보류');expect(observationReadout(o,p,'zero').tex).toContain('|v|');});
  it('굴절의 임계각에서 굴절각은 π/2이고 그보다 크면 전반사다',()=>{const o=get('snell'),p={n1:1.5,n2:1,angle:0};expect(evaluatePhysics(o,p,Math.asin(2/3))).toBeCloseTo(Math.PI/2);expect(evaluatePhysics(o,p,Math.asin(2/3)+0.01)).toBeNull();});
  it('렌즈의 초점과 무효 초점거리를 구분하고 점근선을 연결하지 않는다',()=>{const o=get('lens');expect(evaluatePhysics(o,{p:0.6,f:0.2},0.6)).toBeCloseTo(0.3);expect(evaluatePhysics(o,{p:0.2,f:0.2},0.2)).toBeNull();expect(evaluatePhysics(o,{p:0.2,f:0},0.2)).toBeNull();expect(samplePhysics(o,{p:0.6,f:0.2}).some(p=>p.y===null)).toBe(true);});
  it('이상기체와 등온 압축의 단위·일 부호가 맞다',()=>{expect(evaluatePhysics(get('gas'),{n:1,T:300,V:0.025},0.025)).toBeCloseTo(99773.551416,3);expect(observationReadout(get('isothermal'),{n:1,T:300,ratio:0.5}).tex).toMatch(/W=Q=-/);});
  it('전하·거리·정전용량의 micro 단위가 계산에 반영된다',()=>{expect(evaluatePhysics(get('coulomb'),{q1:1,q2:2,r:0.5},0.5)).toBeCloseTo(0.0719004143384);expect(evaluatePhysics(get('capacitor'),{C:2,V:5},5)).toBeCloseTo(0.000025,9);});
  it('진공 점전하의 구면 선속은 구 반지름과 무관하다',()=>{const o=get('gauss'),p={q:1,r:1};expect(evaluatePhysics(o,p,0.1)).toBe(evaluatePhysics(o,p,2));});
  it('RC 한 시간상수의 전하와 교류 공명 전류가 맞다',()=>{expect(evaluatePhysics(get('rc'),{R:1,C:100,V:5,t:0.1},0.1)).toBeCloseTo(0.0005*(1-Math.exp(-1)),9);const p={R:10,L:0.1,C:100,V:5,omega:316};expect(evaluatePhysics(get('rlc'),p,1/Math.sqrt(0.1*100e-6))).toBeCloseTo(0.5,10);});
  it('패러데이 부호와 감은 수를 변화율에 유지한다',()=>{const o=get('induction'),p={N:10,flux:0.01,f:1,t:0.25};expect(evaluatePhysics(o,p,0.25)).toBeCloseTo(0.2*Math.PI);expect(evaluatePhysics(o,p,0)).toBe(0);});
  it('모든 기본값과 경계값의 결과는 유한하거나 명시적 보류다',()=>{for(const o of physicsObservations)for(const side of ['initial','min','max'] as const){const values=Object.fromEntries(o.controls.map(c=>[c.key,c[side]]));for(const p of samplePhysics(o,values))expect(p.y===null||Number.isFinite(p.y)).toBe(true);}});
  it('같은 대상의 대응 그래프는 단위를 나누고 같은 시각을 사용한다',()=>{for(const engine of ['motion','wave','potential','induction','dot','shm','rc','capacitor']){const item=get(engine),other=secondaryPhysics(item)!;expect(other).toBeDefined();const p=initialValues(item);expect(samplePhysics(other,p).every(v=>v.y===null||Number.isFinite(v.y))).toBe(true);expect(()=>katex.renderToString(other.y,{throwOnError:true})).not.toThrow();}const v=secondaryPhysics(get('motion'))!;expect(evaluatePhysics(v,{x0:0,v0:2,a:4,t:1},1)).toBe(6);});
  it('감쇠 해는 세 조건과 초기조건·장기 복귀를 보존한다',()=>{expect(dampingRegime(1,4)).toBe('under');expect(dampingRegime(2,4)).toBe('critical');expect(dampingRegime(3,4)).toBe('over');for(const gamma of [0,1,2,3,100000]){expect(dampedValue(gamma,4,0,0.2)).toBeCloseTo(0.2,12);expect((dampedValue(gamma,4,1e-8,0.2)-0.2)/1e-8).toBeCloseTo(0,6);expect(Number.isFinite(dampedValue(gamma,4,100,0.2))).toBe(true);}expect(dampedValue(2,4,1,0.2)).toBeCloseTo(0.6*Math.exp(-2),12);expect(dampedValue(3,4,100,0.2)).toBeLessThan(1e-30);});
  it('모든 절마다 설계 질문·표현·조건이 연결되고 절별 ID가 고유하다',()=>{for(const m of physicsMapping){expect(m.question.length).toBeGreaterThan(5);expect(m.representation.length).toBeGreaterThan(2);expect(m.conditions.length).toBeGreaterThan(2);}expect(physicsObservations).toHaveLength(125);});
  it('오류가 있는 입력 원문·정확값·메모·시야는 별도로 검증·보존한다',()=>{const b=freshPhysicsBook();b.views['c3-motion']=physicsView('c3-motion');b.views['c3-motion'].inputs.a='2 +';b.views['c3-motion'].values.a=2.123456789;b.views['c3-motion'].memo='한글 메모\n조건 미확인';b.views['c3-motion'].ranges={x:[1,2],y:[3,4]};expect(validatePhysicsBook(JSON.parse(JSON.stringify(b)))).toEqual(b);b.views['c3-motion'].values.a=Infinity;expect(()=>validatePhysicsBook(b)).toThrow();});
});
