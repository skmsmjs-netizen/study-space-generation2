import {describe,it,expect} from 'vitest';
import katex from 'katex';
import {observeLinear,smallSvd,multiply,transpose,norm,identity,type Matrix} from './linear-algebra';
import {hessenberg,schurReal,nullBasis,solveSystem,residual} from './linear-algebra-advanced';
import {ADVANCED_SPECS} from './linear-algebra-advanced-specs';
import {LINEAR_READING} from './linear-algebra-reading';
import catalog from './linear-algebra-catalog.json';
import sourceIndex from './linear-algebra-source-index.json';
import {linearUnit} from './linear-algebra-units';
describe('개념별 선형대수 확장과 조건',()=>{
  it('원문 인덱스와 기존 안정 ID는 누락·중복 없이 실제 질문으로 연결된다',()=>{
    expect(sourceIndex.items.length).toBe(710);expect(new Set(sourceIndex.items.map(i=>i.id)).size).toBe(710);
    for(const i of sourceIndex.items){expect(i.pdf).toBeGreaterThan(0);expect(i.pdf).toBeLessThanOrEqual(611);for(const id of i.conceptIds){expect(catalog.concepts.some(c=>c.id===id),i.id+id).toBe(true);expect(linearUnit(id).remaining).toEqual([]);}}
  });
  it('극분해의 재구성과 로그 모형의 정의역은 특이·양수 조건을 보존한다',()=>{
    const polar=observeLinear('svd',{n:1},'1 0\n0 0');expect(Number(polar.readouts.find(x=>x.label.includes('극분해 재구성'))?.value)).toBeLessThan(1e-10);
    const logarithmic=observeLinear('data-fit',{},'1 1\n2 2\n4 3','','logarithmic');expect(Number(logarithmic.readouts[0].value)).toBeLessThan(1e-10);expect(()=>observeLinear('data-fit',{},'0 1\n1 2','','logarithmic')).toThrow(/양수/);
    expect(()=>katex.renderToString(observeLinear('objects',{},'2','','polynomial').tex.at(-1)!,{throwOnError:true})).not.toThrow();
  });

  it('모든 기존 개념 ID에 조건 설명을 연결하고 식을 엄격 렌더한다',()=>{
    for(const concept of catalog.concepts){const note=LINEAR_READING[concept.id];expect(note,concept.id).toBeDefined();expect(note.paragraphs.length).toBeGreaterThan(0);for(const tex of note.tex??[])expect(()=>katex.renderToString(tex,{throwOnError:true,trust:false}),concept.id+tex).not.toThrow();}
  });
  it('적분 직교화와 유한 다항식 근사는 계수의 해석적 적분을 사용한다',()=>{
    const basis=observeLinear('function-inner',{},'1 0 0\n0 1 0\n0 0 1','','basis');expect(basis.steps.length).toBe(3);
    const r=observeLinear('function-inner',{n:0},'0 0 1','','best');expect(r.lines[1].points.every(p=>p!==null&&Math.abs(p[1]-1/3)<1e-12)).toBe(true);expect(Number(r.readouts[1].value)).toBeLessThan(1e-10);
    expect(()=>observeLinear('function-inner',{},'1 0\n2 0','','basis')).toThrow(/독립/);
  });
  it('G 직교화·3차원 회전·유니터리 대각화는 같은 관계를 재구성한다',()=>{
    const r=observeLinear('weighted-qr',{},'1 1\n0 1','2 1\n1 2');expect(r.readouts.every(x=>Number(x.value)<1e-10)).toBe(true);
    const g=observeLinear('geometry',{t:Math.PI/2},'1 0 0\n0 1 0\n0 0 1','1\n0\n0','z');expect(g.lines.find(x=>x.name==='Ax')?.points[1]).toEqual([expect.closeTo(0,12),expect.closeTo(1,12),0]);
    const c=observeLinear('complex-matrix',{},'0 -1\n1 0');expect(Number(c.readouts.find(x=>x.label.includes('유니터리 대각화 잔차'))?.value)).toBeLessThan(1e-10);
  });
  it('양의 구간 푸리에 계수는 x의 상수항과 사인 계수를 보존한다',()=>{
    const r=observeLinear('fourier',{n:2},'0 1');expect(r.tex).toContain('a_0=6.28');expect(r.tex.some(t=>t.includes('-2&-1'))).toBe(true);
    const constant=observeLinear('fourier',{n:3},'2');expect(Number(constant.readouts[0].value)).toBeLessThan(1e-10);expect(constant.lines[1].points.every(x=>x!==null&&Math.abs(x[1]-2)<1e-12)).toBe(true);
  });
  it('최대 성분 정규화와 음의 거듭제곱은 정의 조건을 보존한다',()=>{
    const p=observeLinear('power',{n:1},'-3 0\n0 1','1\n1','maximum');expect(p.steps.at(-1)?.matrix.flat()).toEqual([-1,expect.closeTo(1/3,12)]);
    const m=observeLinear('matrix-operations',{n:-1,t:1},'2 0\n0 4','1 0\n0 1');expect(m.tex.some(t=>t.includes('0.5&0'))).toBe(true);
  });
  it('모든 새 관찰식은 실제 LaTeX로 렌더된다',()=>{
    for(const [kind,s]of Object.entries(ADVANCED_SPECS)){
      const result=observeLinear(kind as keyof typeof ADVANCED_SPECS,{t:s.t?.value??2,n:s.n?.value??4},s.matrix!,s.auxiliary?.value??'',s.modes?.[0].value??'');
      expect(result.tex.length,kind).toBeGreaterThan(0);
      for(const tex of result.tex)expect(()=>katex.renderToString(tex,{throwOnError:true,trust:false}),kind+tex).not.toThrow();
    }
  });
  it.each([[[1,2,3],[4,5,6],[7,8,10]],[[0,-1,0],[1,0,0],[2,3,1]],[[1,1],[0,1]]])('헤센베르크는 일반 실수 행렬의 직교 닮음을 유지한다 %j',(...rows)=>{
    const A=rows as Matrix,{P,H}=hessenberg(A);expect(residual(multiply(transpose(P),P),identity(A.length))).toBeLessThan(1e-10);expect(residual(A,multiply(multiply(P,H),transpose(P)))).toBeLessThan(1e-10);
    for(let i=0;i<H.length;i++)for(let j=0;j<i-1;j++)expect(Math.abs(H[i][j])).toBeLessThan(1e-10);
  });
  it('슈어는 반복 실수 고유값도 허용하며 복소 고유값 조건 실패를 구별한다',()=>{
    for(const A of [[[1,1],[0,1]],[[2,1,0],[0,1,3],[0,0,4]]]){const {P,S}=schurReal(A);expect(residual(A,multiply(multiply(P,S),transpose(P)))).toBeLessThan(1e-10);for(let i=0;i<S.length;i++)for(let j=0;j<i;j++)expect(Math.abs(S[i][j])).toBeLessThan(1e-10);}
    expect(()=>schurReal([[0,-1],[1,0]])).toThrow(/실수 고유값/);
  });
  it('네 공간의 기저는 비정사각·영행렬에서 올바른 공간에 속한다',()=>{
    for(const A of [[[1,2,3],[2,4,6]],[[0,0],[0,0],[0,0]],[[1,0],[0,1],[1,1]]]){
      const N=nullBasis(A),L=nullBasis(transpose(A));if(N.length)expect(norm(multiply(A,transpose(N)).flat())).toBeLessThan(1e-10);if(L.length)expect(norm(multiply(transpose(A),transpose(L)).flat())).toBeLessThan(1e-10);
    }
    const s=solveSystem([[1,2],[2,4]],[[3],[6]]);expect(s.basis.length).toBe(1);expect(residual(multiply([[1,2],[2,4]],s.particular!),[[3],[6]])).toBeLessThan(1e-10);
    expect(solveSystem([[1,2],[2,4]],[[3],[7]]).particular).toBeNull();
  });
  it('종속 열의 정사영은 유일하며 계수 자유도를 보존한다',()=>{
    const o=observeLinear('subspace-projection',{},'1 2\n1 2\n0 0','1\n2\n3');expect(o.readouts.find(x=>x.label==='최소제곱 계수의 유일성')?.value).toContain('자유');
  });
  it('양정치 아닌 G를 내적으로 처리하지 않는다',()=>{
    expect(()=>observeLinear('weighted-inner',{},'1 0\n0 -1','1 0\n0 1')).toThrow(/양정치/);
    expect(()=>observeLinear('weighted-inner',{},'1 0\n0 0','1 0\n0 1')).toThrow(/양정치/);
  });
  it('교재 복소 내적과 켤레전치는 에르미트·정규·유니터리를 구별한다',()=>{
    const H=observeLinear('complex-matrix',{},'1 i\n-i 2');expect(H.readouts.find(x=>x.label==='현재 조건 판단')?.value).toContain('에르미트 충족');expect(H.readouts.find(x=>x.label==='현재 조건 판단')?.value).toContain('유니터리 위반');
    const U=observeLinear('complex-matrix',{},'i 0\n0 -i');expect(U.readouts.find(x=>x.label==='현재 조건 판단')?.value).toContain('유니터리 충족');expect(U.readouts.find(x=>x.label==='현재 조건 판단')?.value).toContain('정규 충족');
  });
  it('종속 기저에서는 좌표·닮음을 강제하지 않는다',()=>{
    expect(()=>observeLinear('coordinates',{},'1 2\n2 4','1 0\n0 1\n---\n1\n2')).toThrow(/특이/);
    const r=observeLinear('representation',{},'1 2\n0 1','1 1\n0 1\n---\n1 1\n0 1');expect(Number(r.readouts[0].value)).toBeLessThan(1e-10);
  });
  it('수치 SVD는 Gram 제곱 없이 작은 특이값과 직사각 재구성을 보존한다',()=>{
    const tiny=smallSvd([[1,0],[0,1e-10]],2);expect(tiny.singular[1]).toBeCloseTo(1e-10,20);
    for(const A of [[[1,2,3],[2,4,6]],[[1,0],[0,0],[0,0]],[[0,0],[0,0]],Array.from({length:12},(_,i)=>Array.from({length:9},(_,j)=>Math.sin(i+2*j)))] as Matrix[]){
      const s=smallSvd(A,Math.min(A.length,A[0].length));expect(residual(A,multiply(multiply(s.U,s.Sigma),transpose(s.V)))).toBeLessThan(1e-9);expect(residual(multiply(transpose(s.U),s.U),identity(A.length))).toBeLessThan(1e-9);expect(residual(multiply(transpose(s.V),s.V),identity(A[0].length))).toBeLessThan(1e-9);
    }
  });
  it('복소 고유값의 연속·이산 과정은 별도 축에서 유한하게 계산된다',()=>{
    const r=observeLinear('matrix-dynamics',{n:4,t:Math.PI/2},'0 -1\n1 0','1\n0');expect(r.steps.at(-1)?.matrix[0][0]).toBeCloseTo(1,12);expect(r.secondaryPlot?.lines[1].points.at(-1)?.[1]).toBeCloseTo(1,10);
  });
});
