import {it,expect} from 'vitest';
import katex from 'katex';
import {physicsConceptReadings,physicsSourceItems,physicsSectionItems,physicsSectionRange,physicsSourceLinks,physicsPageLabel,physicsPageEvidence} from './physics-reading';
import {physicsObservations,initialValues,evaluatePhysics,secondaryPhysics,samplePhysics,observationReadout} from './physics-observations';
import {physicsSpatial} from './physics-spatial';
import {freshPhysicsBook,physicsReadingView,validatePhysicsBook} from '../data/physics-observation-view';
it('맥놀이의 합은 유지하면서 동일 주파수와 느린 포락선 조건을 구별한다',()=>{
 const o=physicsObservations.find(o=>o.engine==='beats')!,p=initialValues(o);
 expect(evaluatePhysics(o,{...p,f1:5,f2:5},.05)).toBeCloseTo(2);
 expect(observationReadout(o,{...p,f1:5,f2:5}).message).toContain('원래 진동은 계속된다');
 expect(observationReadout(o,{...p,f1:1,f2:10}).message).toContain('설계 기준');
 expect(observationReadout(o,{...p,f1:5,f2:5.1}).message).toContain('초기 파형의 위상은 다르다');
 const link=physicsSourceLinks.find(l=>l.label==='16.17')!;expect(link.sourceTex).toContain('1,3,5');expect(link.difference).toContain('끝 보정');
});
it('수동 상호유도는 에너지 비음수 범위이며 원문의 예제 숫자는 별도 검토한다',()=>{
 const o=physicsObservations.find(x=>x.engine==='mutual-induction')!,p=initialValues(o);
 expect(o.conditions).toContain('L_1=L_2=0.1');expect(o.conditions).toContain('결합계수');
 for(const M of [o.controls[0].min,p.M,o.controls[0].max]){
  for(const [i1,i2] of [[1,-1],[1,1],[2,-1],[-.5,3]])expect(.05*i1*i1+.05*i2*i2+M*i1*i2).toBeGreaterThanOrEqual(-1e-14);
  expect(evaluatePhysics(o,{...p,M},10)).toBe(-10*M);
 }
 expect(.2e-3*.1e-3-(2.5e-3)**2).toBeLessThan(0);
 expect(o.limits).toContain('원문 숫자');
 const phase=physicsSourceLinks.find(l=>l.label==='28.26')!;expect(phase.difference).toContain('교대 부호');
 expect(physicsSourceLinks.find(l=>l.label==='28.49')!.sourceTex).toContain('peak or rms');
});
it('167절의 한국어 관계 해설·조건·수식과 기존 선택ID를 보존한다',()=>{expect(physicsConceptReadings).toHaveLength(167);for(const r of physicsConceptReadings){expect(r.conditions).not.toBe('');expect(r.steps.length).toBeGreaterThanOrEqual(2);expect(new Set(r.steps.map(x=>x.id)).size).toBe(r.steps.length);for(const edge of r.relationships){expect(r.steps.some(s=>s.id===edge.fromId)).toBe(true);expect(r.steps.some(s=>s.id===edge.toId)).toBe(true);expect(edge.text.length).toBeGreaterThan(10);}for(const s of r.steps)expect(()=>katex.renderToString(s.tex,{throwOnError:true})).not.toThrow();}});
it('원문 번호 후보는 중복 제거하고 범위·추출 검증 상태를 구별한다',()=>{expect(physicsSourceItems).toHaveLength(1648);expect(new Set(physicsSourceItems.map(x=>x.id)).size).toBe(1648);for(const x of physicsSourceItems){if('reviewLinkId' in x){expect(physicsSourceLinks.some(link=>link.id===x.reviewLinkId&&link.sourceItemId===x.id)).toBe(true);}else{expect(x.classification).toBe('판단 보류');expect(x.verification).toBe('text-label-candidate');}for(const id of x.sections){const s=physicsSectionRange(id)!;expect(x.pdf).toBeGreaterThanOrEqual(s.startPdf);expect(x.pdf).toBeLessThanOrEqual(s.endPdf);}}expect(physicsSectionItems('17.6').some(x=>x.label==='17.34'&&x.pdf===598)).toBe(true);});
it('공간 도해의 합·위상·임계각·허상 연장이 실제 계산 관계를 보존한다',()=>{const o=(engine:string)=>physicsObservations.find(x=>x.engine===engine)!;const v=o('vector-sum'),s=physicsSpatial(v,{...initialValues(v),angle:Math.PI/2})!;expect(s.values.find(x=>x.name==='합의 x 성분')!.value).toBeCloseTo(2);expect(s.values.find(x=>x.name==='합의 y 성분')!.value).toBeCloseTo(3);expect(s.bounds[1]-s.bounds[0]).toBe(s.bounds[3]-s.bounds[2]);const lens=o('lens');expect(physicsSpatial(lens,{...initialValues(lens),p:.1,f:.2})!.arrows.some(x=>x.style==='dash')).toBe(true);expect(physicsSpatial(lens,{...initialValues(lens),p:.2,f:.2})).toBeNull();const snell=o('snell');expect(physicsSpatial(snell,{...initialValues(snell),angle:1})!.arrows.some(a=>a.name==='굴절광')).toBe(false);const r=o('rlc'),rs=physicsSpatial(r,{...initialValues(r),omega:1/Math.sqrt(.1*100e-6)})!;expect(rs.values.find(x=>x.name==='위상차')!.value).toBeCloseTo(0,10);});
it('추출본과 원본 보기 선택은 기존v1자료와 함께 복원하며 잘못된 모드는 거부한다',()=>{const b=freshPhysicsBook();b.readings={'17.6':{...physicsReadingView('17.6'),page:598,sourceMode:'image',focus:'17.6:reading:2',memo:'i의 부호'}};expect(validatePhysicsBook(JSON.parse(JSON.stringify(b)))).toEqual(b);b.readings['17.6'].sourceMode='unknown' as 'image';expect(()=>validatePhysicsBook(b)).toThrow();});

it('체적 전하 구와 도체 구는 내부에서 다른 장·전위를 주며 경계는 일치한다',()=>{const o=(engine:string)=>physicsObservations.find(x=>x.engine===engine)!;const v=o('solid-sphere-potential'),p=initialValues(v),E=o('solid-sphere-field'),d=o('sphere-potential'),h=1e-5,r=.25;const gradient=(evaluatePhysics(v,p,r+h)!-evaluatePhysics(v,p,r-h)!)/(2*h);expect(-gradient).toBeCloseTo(evaluatePhysics(E,p,r)!,5);expect(evaluatePhysics(v,p,0)).toBeCloseTo(1.5*evaluatePhysics(d,p,0)!);expect(evaluatePhysics(E,p,p.radius)).toBeCloseTo(evaluatePhysics(o('field'),p,p.radius)!);expect(samplePhysics(E,{...p,radius:.501}).some(x=>x.x===.501)).toBe(true);});
it('곡면 용량과 자기장·순환 장은 독립적인 극한·적분 관계를 만족한다',()=>{const o=(engine:string)=>physicsObservations.find(x=>x.engine===engine)!;const cylinder=o('capacitance-cylinder'),p=initialValues(cylinder),a=evaluatePhysics(cylinder,p,2)!;expect(evaluatePhysics(cylinder,{...p,length:2*p.length},2)).toBeCloseTo(2*a,12);const sphere=o('capacitance-sphere'),s=initialValues(sphere);expect(evaluatePhysics(sphere,s,1e8)).toBeCloseTo(4*Math.PI*8.8541878128e-12*s.inner,15);const loop=o('loop-axis-field'),l=initialValues(loop);expect(evaluatePhysics(loop,l,0)).toBeCloseTo(4*Math.PI*1e-7*l.I/(2*l.radius),12);const induction=o('induced-electric'),i=initialValues(induction),other=secondaryPhysics(induction)!;for(const r of [.2,1])expect(2*Math.PI*r*evaluatePhysics(induction,i,r)!).toBeCloseTo(-evaluatePhysics(other,i,r)!,12);});
it('항력의 초기 가속도와 긴 시간 속도, 접점의 전하 보존을 확인한다',()=>{const o=(engine:string)=>physicsObservations.find(x=>x.engine===engine)!;const drag=o('drag-linear'),p=initialValues(drag);expect(evaluatePhysics(drag,p,0)).toBe(0);expect(evaluatePhysics(secondaryPhysics(drag)!,p,0)).toBe(9.81);expect(evaluatePhysics(drag,p,100)).toBeCloseTo(p.m*9.81/p.b);const k=o('kirchhoff-branches'),a=initialValues(k);for(const e2 of [0,5,20]){const V=evaluatePhysics(k,a,e2)!;expect((a.E1-V)/a.R1+(e2-V)/a.R2).toBeCloseTo(V/a.R3,12);}});

it('책의 쪽번호·원문 기호·확인한 관계 연결을 후보 검색과 구별한다',()=>{
 expect(physicsPageEvidence).toHaveLength(1069);expect(physicsPageLabel(128)).toBe('책 112쪽 · PDF 128쪽');expect(physicsPageLabel(842)).toBe('책 834쪽 · PDF 842쪽');expect(physicsPageLabel(598)).toBe('책 588쪽 · PDF 598쪽');
 expect(physicsSourceLinks.length).toBeGreaterThanOrEqual(34);expect(new Set(physicsSourceLinks.map(x=>x.id)).size).toBe(physicsSourceLinks.length);
 for(const link of physicsSourceLinks){expect(physicsPageEvidence[link.pdf-1].printed).toBe(link.printed);for(const id of link.observations)expect(physicsObservations.some(o=>o.id===id)).toBe(true);expect(()=>katex.renderToString(link.sourceTex,{throwOnError:true})).not.toThrow();expect(link.conditions.trim()).not.toBe('');expect(link.difference.trim()).not.toBe('');}
 expect(physicsSourceLinks.find(x=>x.label==='26.5')?.observations).toContain('c26-finite-wire-field');expect(physicsObservations.find(o=>o.id==='c21-line-field')?.evidence?.pdf).toBe(721);expect(physicsObservations.find(o=>o.engine==='shm')?.formula).toContain('k_H');
 for(const x of physicsSourceItems)expect(Object.keys(x)).not.toContain('text');
});

it('0벡터와0인 힘은 가짜 방향·단위벡터를 만들지 않는다',()=>{const dot=physicsObservations.find(o=>o.engine==='dot')!;const p:Record<string,number>={...initialValues(dot),A:0};expect(evaluatePhysics(dot,p,p.angle)).toBe(0);expect(physicsSpatial(dot,p)?.arrows.some(a=>a.name==='A')).toBe(false);expect(physicsSpatial(dot,p)?.explanation).toContain('0벡터');const torque=physicsObservations.find(o=>o.engine==='torque')!;expect(physicsSpatial(torque,{...initialValues(torque),F:0})?.arrows.some(a=>a.name==='F / |F|')).toBe(false);const invalid=physicsSourceLinks.find(x=>x.label==='1.10')!;expect(invalid.observations).toEqual([]);expect(invalid.sourcePurpose).toContain('틀린 식');});

it('모든 계산의 원문 위치와 속력 분포의 개수·확률 의미 및 구름 기호를 보존한다',()=>{
 for(const o of physicsObservations){expect(o.evidence).toBeDefined();expect(physicsSourceLinks.some(l=>l.observations.includes(o.id)&&l.pdf===o.evidence!.pdf)).toBe(true);expect(o.evidence!.printed).toBe(physicsPageEvidence[o.evidence!.pdf-1].printed);}
 const maxwell=physicsObservations.find(o=>o.engine==='maxwell')!,p=initialValues(maxwell),sigma=Math.sqrt(8.314462618*p.T/p.M),n=4096,h=12*sigma/n;let integral=0,moment=0;
 for(let i=0;i<=n;i++){const x=i*h,f=evaluatePhysics(maxwell,p,x)!,weight=i===0||i===n?1:i%2?4:2;integral+=weight*f;moment+=weight*f*x*x;}
 expect(integral*h/3).toBeCloseTo(1,10);expect(moment*h/3/(3*sigma*sigma)).toBeCloseTo(1,10);expect(maxwell.y).toContain('f(v)/N');expect(maxwell.conditions).toContain('개수 밀도');
 const rolling=physicsObservations.find(o=>o.engine==='rolling')!;expect(rolling.formula).toContain('\\beta');expect(rolling.controls.some(c=>c.key==='eta'&&c.tex==='\\beta')).toBe(true);
 expect(physicsSourceLinks.find(l=>l.label==='27.1')?.observations).toContain('c27-induction');expect(physicsSourceLinks.find(l=>l.label==='20.58')?.observations).toContain('c20-electric-motion');
});

it('변하는 가속도의 미분·적분과 속력 부호는 반올림·정지·음의 속도를 구별한다',()=>{
 const o=physicsObservations.find(o=>o.engine==='kinematic-velocity')!,p={...initialValues(o),x0:2,v0:-3,a0:-2,j:.5,t:1.2},a=secondaryPhysics(o)!,h=1e-4;
 const position=(t:number)=>p.x0+p.v0*t+p.a0*t*t/2+p.j*t**3/6;
 expect((position(p.t+h)-position(p.t-h))/(2*h)).toBeCloseTo(evaluatePhysics(o,p,p.t)!,6);
 expect((evaluatePhysics(o,p,p.t+h)!-evaluatePhysics(o,p,p.t-h)!)/(2*h)).toBeCloseTo(evaluatePhysics(a,p,p.t)!,8);
 const end=3,steps=100,h2=end/steps;let area=0;for(let i=0;i<=steps;i++)area+=(i===0||i===steps?1:i%2?4:2)*evaluatePhysics(o,p,i*h2)!;
 expect(area*h2/3).toBeCloseTo(position(end)-position(0),10);
 expect(observationReadout(o,{...p,v0:-4,a0:-2,j:0,t:1}).message).toContain('속력이 증가');
 expect(observationReadout(o,{...p,v0:-4,a0:2,j:0,t:1}).message).toContain('속력이 감소');
 expect(observationReadout(o,{...p,v0:0,a0:0,j:1,t:0}).message).toContain('방향 전환을 확정하지');
 expect(evaluatePhysics(o,{...p,v0:0,a0:0,j:1},-.1)).toBeGreaterThan(0);expect(evaluatePhysics(o,{...p,v0:0,a0:0,j:1},.1)).toBeGreaterThan(0);
 expect(observationReadout(o,{...p,v0:-1e-12,a0:-1e-12,j:0,t:0}).message).toContain('속력이 증가');
 expect(physicsSourceLinks.filter(l=>l.section.startsWith('3.')&&/^3\./.test(l.label))).toHaveLength(16);
});

it('제곱 항력의 독립적인 운동방정식·질량 스케일·종단 극한을 유지한다',()=>{
 const o=physicsObservations.find(o=>o.engine==='drag-quadratic')!,p=initialValues(o),a=secondaryPhysics(o)!,h=1e-5;
 expect(evaluatePhysics(o,p,0)).toBe(0);expect(evaluatePhysics(a,p,0)).toBe(9.81);
 for(const t of [.1,.7,3]){const v=evaluatePhysics(o,p,t)!,gradient=(evaluatePhysics(o,p,t+h)!-evaluatePhysics(o,p,t-h)!)/(2*h);expect(p.m*gradient).toBeCloseTo(p.m*9.81-p.Cd*p.rho*p.area*v*v/2,8);expect(gradient).toBeCloseTo(evaluatePhysics(a,p,t)!,7);}
 const terminal=evaluatePhysics(o,p,1e5)!;expect(p.Cd*p.rho*p.area*terminal*terminal/2).toBeCloseTo(p.m*9.81,10);
 expect(evaluatePhysics(o,{...p,m:4*p.m},1e5)).toBeCloseTo(2*terminal,10);expect(evaluatePhysics(a,p,1e5)).toBe(0);
});
it('일정한 힘의 일은 내적·반대 방향·직각·일률 관계를 공유한다',()=>{
 const o=physicsObservations.find(o=>o.engine==='constant-work')!,p=initialValues(o),speed=3;
 expect(evaluatePhysics(o,p,0)).toBeCloseTo(p.F*p.distance);expect(evaluatePhysics(o,p,Math.PI)).toBeCloseTo(-p.F*p.distance);expect(evaluatePhysics(o,p,Math.PI/2)).toBeCloseTo(0,12);
 const dt=.01,work=evaluatePhysics(o,{...p,distance:speed*dt},0)!;const power=physicsObservations.find(o=>o.engine==='power')!;expect(work/dt).toBeCloseTo(evaluatePhysics(power,{...initialValues(power),F:p.F},speed)!,10);
 expect(physicsSourceLinks.filter(l=>l.section.startsWith('6.')&&/^6\./.test(l.label))).toHaveLength(66);
});
it('진공 평면파의 두 장은 순환 법칙·파장 이동·같은 위상을 독립적으로 만족한다',()=>{
 const E=physicsObservations.find(o=>o.engine==='em-plane-electric')!,B=secondaryPhysics(E)!,p:Record<string,number>={...initialValues(E),phase:.13},mu=4*Math.PI*1e-7,epsilon=8.8541878128e-12,c=1/Math.sqrt(mu*epsilon),x=.37,h=1e-5,dh=1e-6,T=p.wavelength/c;
 const dxE=(evaluatePhysics(E,p,x+h)!-evaluatePhysics(E,p,x-h)!)/(2*h),dxB=(evaluatePhysics(B,p,x+h)!-evaluatePhysics(B,p,x-h)!)/(2*h);
 const dtE=(evaluatePhysics(E,{...p,phase:p.phase+dh},x)!-evaluatePhysics(E,{...p,phase:p.phase-dh},x)!)/(2*dh*T),dtB=(evaluatePhysics(B,{...p,phase:p.phase+dh},x)!-evaluatePhysics(B,{...p,phase:p.phase-dh},x)!)/(2*dh*T);
 expect(-dtB/dxE).toBeCloseTo(1,7);expect(-mu*epsilon*dtE/dxB).toBeCloseTo(1,7);
 expect(evaluatePhysics(E,p,x+p.wavelength)).toBeCloseTo(evaluatePhysics(E,p,x)!,10);
 expect(evaluatePhysics(E,{...p,phase:p.phase+.1},x+.1*p.wavelength)).toBeCloseTo(evaluatePhysics(E,p,x)!,10);
 for(const point of [0,.25,1])expect(evaluatePhysics(E,p,point)!).toBeCloseTo(c*evaluatePhysics(B,p,point)!,10);
 expect(physicsSourceLinks.filter(l=>l.section.startsWith('27.')&&/^27\./.test(l.label))).toHaveLength(29);
 const printed=physicsSourceLinks.find(l=>l.label==='27.22')!;expect(printed.sourceTex).toContain('\\cdot\\vec A');expect(printed.sourcePurpose).toContain('면적 미분 d가 빠져');expect(printed.difference).toContain('교재 밖 검토 설명');
});
