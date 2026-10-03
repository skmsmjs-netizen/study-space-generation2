import { eigs, expm, complex, multiply as mathMultiply, inv as mathInverse, matrix as mathMatrix, type Complex, type MathType } from 'mathjs';
import { column, determinant, displayNumber, dot, identity, lu, matrixTex, multiply, norm, parseMatrix, qr, rref, symmetricEigen, tolerance, transpose, type LinearKind, type LinearOutput, type Matrix, type RowStep } from './linear-algebra';
export type AdvancedKind = 'elementary' | 'cofactor' | 'spaces' | 'coordinates' | 'composition' | 'affine' | 'weighted-inner' | 'subspace-projection' | 'complex-matrix' | 'triangular' | 'spectral' | 'eigen-general' | 'ldu' | 'data-fit' | 'function-inner' | 'matrix-dynamics' | 'matrix-operations' | 'representation' | 'weighted-qr' | 'geometry' | 'objects' | 'fourier' | 'power';
const kinds = new Set<string>(['elementary','cofactor','spaces','coordinates','composition','affine','weighted-inner','subspace-projection','complex-matrix','triangular','spectral','eigen-general','ldu','data-fit','function-inner','matrix-dynamics','matrix-operations','representation','weighted-qr','geometry','objects','fourier','power']);
const subtract = (a: Matrix,b: Matrix) => a.map((r,i)=>r.map((v,j)=>v-b[i][j]));
export const residual = (a: Matrix,b: Matrix) => norm(subtract(a,b).flat());
const diagonal = (v: number[]) => v.map((x,i)=>v.map((_,j)=>i===j?x:0));
export function nullBasis(a: Matrix): Matrix {
  const rr=rref(a), free=Array.from({length:a[0].length},(_,j)=>j).filter(j=>!rr.pivots.includes(j));
  return free.map(j=>{const v=Array(a[0].length).fill(0); v[j]=1; rr.pivots.forEach((p,i)=>v[p]=-rr.matrix[i][j]); return v;});
}
export function solveSystem(a: Matrix,b: Matrix) {
  if(a.length!==b.length) throw Error('행렬과 오른쪽 벡터의 행 수가 같아야 한다.');
  const n=a[0].length, rr=rref(a.map((r,i)=>[...r,...b[i]]),n);
  const inconsistent=rr.matrix.some(r=>r.slice(0,n).every(v=>Math.abs(v)<=rr.tolerance)&&r.slice(n).some(v=>Math.abs(v)>rr.tolerance));
  if(inconsistent) return {particular:null,basis:nullBasis(a),rr};
  const x=Array.from({length:n},()=>Array(b[0].length).fill(0));
  rr.pivots.forEach((p,i)=>x[p]=rr.matrix[i].slice(n));
  return {particular:x,basis:nullBasis(a),rr};
}
export function inverse(a: Matrix): Matrix {
  if(a.length!==a[0].length) throw Error('역행렬에는 정사각행렬이 필요하다.');
  const s=solveSystem(a,identity(a.length));
  if(!s.particular || s.rr.rank!==a.length) throw Error('수치 허용오차에서 특이한 행렬이다. 역행렬을 표시하지 않는다.');
  return s.particular;
}
export function orthogonalize(vectors: number[][], inner:(u:number[],v:number[])=>number) {
 const q:number[][]=[],steps:RowStep[]=[];
 for(const original of vectors){
  let v=[...original];
  // Reorthogonalization preserves the same projection and reduces numerical cancellation.
  for(let pass=0;pass<2;pass++) for(const basis of q){const c=inner(v,basis);v=v.map((x,i)=>x-c*basis[i]);}
  const size=Math.sqrt(Math.max(0,inner(v,v)));
  if(size<=1e-11*Math.max(1,Math.sqrt(Math.max(0,inner(original,original))))) throw Error('선택한 내적에서 독립 조건을 수치적으로 확인하지 못했다. 0방향을 정규화하지 않는다.');
  q.push(v.map(x=>x/size));steps.push({operation:`방향 ${q.length} · 앞선 정사영 제거 후 정규화`,matrix:transpose(q)});
 }
 return {q,steps};
}
export const polynomialInner=(u:number[],v:number[])=>u.reduce((s,a,i)=>s+v.reduce((r,b,j)=>r+((i+j)%2===0?2*a*b/(i+j+1):0),0),0);
function orthogonalFirst(v: number[]): Matrix {
  const size=norm(v); if(!size) throw Error('고유벡터는 0이 아니어야 한다.');
  const unit=v.map(x=>x/size), u=unit.map((x,i)=>x-Number(i===0));
  const d=dot(u,u); if(d<1e-26) return identity(v.length);
  return identity(v.length).map((row,i)=>row.map((x,j)=>x-2*u[i]*u[j]/d));
}
export function hessenberg(a: Matrix) {
  const n=a.length; if(a[0].length!==n) throw Error('헤센베르크 변환에는 실수 정사각행렬이 필요하다.');
  let H=structuredClone(a), P=identity(n);
  const steps: RowStep[]=[{operation:'원래 행렬 · 아래 첫 부대각선 밑을 제거한다',matrix:H}];
  for(let k=0;k<n-2;k++){
    const v=H.slice(k+1).map(r=>r[k]);
    const len=norm(v); if(len<=tolerance(a)) continue;
    v[0]+=v[0]>=0?len:-len;
    const vv=dot(v,v), Q=identity(n);
    for(let i=k+1;i<n;i++) for(let j=k+1;j<n;j++) Q[i][j]-=2*v[i-k-1]*v[j-k-1]/vv;
    H=multiply(multiply(Q,H),Q); P=multiply(P,Q);
    steps.push({operation:`열 ${k+1} · 같은 직교 변환을 왼쪽과 오른쪽에 적용`,matrix:H});
  }
  return {H,P,steps};
}
const arrayOf = (x: unknown): unknown[] => Array.isArray(x)?x:(x as {toArray:()=>unknown[]}).toArray();
const cParts = (x: unknown) => typeof x==='number'?{re:x,im:0}:x as Complex;
const scalarTex = (x: unknown) => {const z=cParts(x); return Math.abs(z.im)<1e-12?displayNumber(z.re):`${displayNumber(z.re)}${z.im<0?'-':'+'}${displayNumber(Math.abs(z.im))}i`;};
export const complexMatrixTex = (a: unknown[][]) => `\\begin{bmatrix}${a.map(r=>r.map(scalarTex).join('&')).join('\\\\')}\\end{bmatrix}`;
export function parseComplexMatrix(text:string): Complex[][] {
  const rows=text.trim().split(/\n|;/).map(r=>r.trim().split(/\s*,\s*|\s+/));
  if(!rows.length || !rows[0].length || rows.length>6 || rows[0].length>6 || rows.some(r=>r.length!==rows[0].length||r.some(x=>!x))) throw Error('같은 길이의 복소 성분을 넣는다. 예: 1+2i · 최대6행6열.');
  return rows.map(r=>r.map(x=>{const z=complex(x);if(!Number.isFinite(z.re)||!Number.isFinite(z.im)||Math.hypot(z.re,z.im)>1e6) throw Error('유한한 복소 성분의 크기는 10⁶ 이하이다.'); return z;}));
}
export function schurReal(a: Matrix): {P:Matrix;S:Matrix;steps:RowStep[]} {
  const n=a.length; if(a[0].length!==n) throw Error('실수 정사각행렬이 필요하다.');
  if(n===1) return {P:[[1]],S:structuredClone(a),steps:[]};
  const es=eigs(a,{precision:1e-12}), values=arrayOf(es.values).map(cParts);
  if(values.some(z=>Math.abs(z.im)>1e-10*Math.max(1,Math.abs(z.re)))) throw Error('실수 고유값 조건을 충족하지 않는다. 실수 상삼각 슈어 결과를 강제하지 않는다. 헤센베르크는 별도로 볼 수 있다.');
  const ev=es.eigenvectors.find(e=>arrayOf(e.vector).every(x=>Math.abs(cParts(x).im)<1e-10));
  if(!ev) throw Error('실수 고유벡터를 수치적으로 확인하지 못했다.');
  const v=arrayOf(ev.vector).map(x=>cParts(x).re), Q=orthogonalFirst(v), B=multiply(multiply(transpose(Q),a),Q);
  const tail=schurReal(B.slice(1).map(r=>r.slice(1))), R=identity(n);
  for(let i=1;i<n;i++)for(let j=1;j<n;j++)R[i][j]=tail.P[i-1][j-1];
  const P=multiply(Q,R), S=multiply(multiply(transpose(P),a),P);
  return {P,S,steps:[{operation:'실수 고유방향을 첫 정규직교 기저로 삼는다',matrix:B},...tail.steps.map(s=>({operation:s.operation,matrix:s.matrix})),{operation:'전체 직교 기저에서 상삼각 관계 확인',matrix:S}]};
}
export function observeLinearAdvanced(kind: LinearKind, params:Record<string,number>,text:string,aux:string,mode:string):LinearOutput|null {
  if(!kinds.has(kind)) return null;
  const out:LinearOutput={tex:[],lines:[],is3d:false,point:null,readouts:[],notices:[],steps:[],explanation:[]};
  const read=(label:string,value:number|string)=>out.readouts.push({label,value:typeof value==='number'?displayNumber(value):value});
  const form=(label:string,a:Matrix)=>out.tex.push(`${label}=${matrixTex(a)}`);
  const vector=(name:string,v:number[],secondary=false)=>out.lines.push({name,role:secondary?'secondary':'curve',points:[[0,0,0],[v[0]??0,v[1]??0,v[2]??0]]});
  const t=params.t??1;
  out.notices.push('유한 정밀도의 수치 관찰이다. 표시 반올림은 저장한 성분과 내부 계산을 바꾸지 않는다.');
  if(kind==='complex-matrix'){
    const A=parseComplexMatrix(text), m=A.length,n=A[0].length;
    const adj=A[0].map((_,j)=>A.map(r=>complex(r[j].re,-r[j].im)));
    const AH=mathMultiply(A as MathType,adj as MathType) as unknown as Complex[][];
    const HA=mathMultiply(adj as MathType,A as MathType) as unknown as Complex[][];
    out.tex=[`A=${complexMatrixTex(A)}`,`A^*=\\overline A^T=${complexMatrixTex(adj)}`,`AA^*=${complexMatrixTex(AH)}`,`A^*A=${complexMatrixTex(HA)}`];
    const diff=(B:unknown[][],C:unknown[][])=>norm(B.flat().flatMap((z,i)=>[cParts(z).re-cParts(C.flat()[i]).re,cParts(z).im-cParts(C.flat()[i]).im]));
    const eps=Math.max(1,...A.flat().map(z=>Math.hypot(z.re,z.im)))*1e-10;
    if(m===n){
      read('에르미트 조건 ‖A−A*‖F',diff(A,adj));
      read('유니터리 조건 ‖A*A−I‖F',diff(HA,identity(n)));
      read('정규 조건 ‖A*A−AA*‖F',diff(HA,AH));
      read('현재 조건 판단',`허용오차 ${eps} · 에르미트 ${diff(A,adj)<=eps?'충족':'위반'} / 유니터리 ${diff(HA,identity(n))<=eps?'충족':'위반'} / 정규 ${diff(HA,AH)<=eps?'충족':'위반'}`);
      if(diff(HA,AH)<=eps){
       try{
        const es=eigs(A,{precision:1e-12}), pairs=es.eigenvectors;
        if(pairs.length!==n)throw Error();
        const cols:Complex[][]=[];
        const cmul=(a:Complex,b:Complex)=>complex(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
        for(const pair of pairs){
         let v=arrayOf(pair.vector).map(z=>complex(cParts(z).re,cParts(z).im));
         for(let pass=0;pass<2;pass++)for(const u of cols){let c=complex(0,0);v.forEach((z,i)=>{const d=cmul(z,complex(u[i].re,-u[i].im));c=complex(c.re+d.re,c.im+d.im);});v=v.map((z,i)=>{const p=cmul(c,u[i]);return complex(z.re-p.re,z.im-p.im);});}
         const len=Math.hypot(...v.flatMap(z=>[z.re,z.im]));if(len<1e-11)throw Error();cols.push(v.map(z=>complex(z.re/len,z.im/len)));
        }
        const U=A.map((_,i)=>cols.map(v=>v[i])),UH=U[0].map((_,j)=>U.map(r=>complex(r[j].re,-r[j].im))),D=pairs.map((p,i)=>pairs.map((_,j)=>i===j?p.value:0));
        const diag=mathMultiply(mathMultiply(UH as MathType,A as MathType),U as MathType) as unknown as Complex[][];
        const err=diff(diag,D);read('유니터리 대각화 잔차 ‖U*AU−D‖F',err);
        if(err>eps*100)throw Error();
        out.tex.push(`U=${complexMatrixTex(U)}`,`U^*AU=${complexMatrixTex(diag)}`,`D=${complexMatrixTex(D)}`);
       }catch{out.notices.push('정규 조건의 일반 존재 정리와 달리, 현재 수치 계산에서 유니터리 고유기저를 확정하지 못했다. 부재로 판정하지 않는다.');}
      }
    }else read('정사각 조건','켤레전치는 정의된다. 에르미트·유니터리·정규의 정사각 조건은 충족하지 않는다.');
    out.tex.push('\\langle u,v\\rangle=\\sum_j u_j\\overline{v_j}');
    out.explanation=['교재의 복소 내적은 첫 인자에 선형이다. 켤레전치는 성분의 켤레와 전치를 함께 적용한다.','에르미트 A*=A, 유니터리 A*A=I, 정규 A*A=AA*는 서로 다른 조건이다. 수치 잔차는 정확한 대수적 등식의 증명이 아니다.'];
    return out;
  }
  const A=parseMatrix(text);out.matrix=A;
  if(kind==='elementary'){
    const c=A[0].length-1;if(c<1)throw Error('마지막 열이 오른쪽 벡터인 확대행렬을 넣는다.');
    const full=A.map((row,i)=>[...row,...identity(A.length)[i]]), rr=rref(full,c);
    out.steps=rr.steps.map(s=>({operation:s.operation,matrix:s.matrix.map(r=>r.slice(0,c+1))}));
    const E=rr.matrix.map(r=>r.slice(c+1));
    form('[A|b]',A);form('E',E);form('E[A|b]',multiply(E,A));
    read('누적 기본행렬 재구성 잔차',residual(multiply(E,A),rr.matrix.map(r=>r.slice(0,c+1))));
    out.tex.push('E=E_k\\cdots E_2E_1,\\quad E[A|b]=[R|Eb]');
    out.explanation=['각 행 연산은 해당 기본행렬의 왼쪽 곱이다. 가장 먼저 적용한 연산이 곱의 오른쪽에 놓인다.','E를 오른쪽 벡터에도 함께 적용해야 해집합을 유지한다.'];
  }else if(kind==='cofactor'){
    const b=column(A.map(r=>r.at(-1)!)),a=A.map(r=>r.slice(0,-1)),n=a.length;
    if(a[0].length!==n)throw Error('n행 n+1열 확대행렬을 넣는다. 마지막 열은 b이다.');
    const det=determinant(a), cof=a.map((r,i)=>r.map((_,j)=>n===1?1:(-1)**(i+j)*determinant(a.filter((_,k)=>k!==i).map(row=>row.filter((_,k)=>k!==j)))));
    form('A',a);form('C',cof);form('\\operatorname{adj}(A)',transpose(cof));
    out.tex.push(`\\det A=\\sum_j a_{1j}C_{1j}=${displayNumber(det)}`);
    out.steps=a[0].map((_,j)=>({operation:`첫 행의 전개 항 ${j+1} · 성분×여인수 = ${displayNumber(a[0][j]*cof[0][j])}`,matrix:cof}));
    const rank=rref(a).rank;
    read('행렬식',det);
    if(rank===n&&det!==0){const x=a[0].map((_,j)=>determinant(a.map((r,i)=>r.map((v,k)=>j===k?b[i][0]:v)))/det);const inv=inverse(a);form('A^{-1}',inv);form('x_{\\mathrm{Cramer}}',column(x));read('Ax−b 잔차',residual(multiply(a,column(x)),b));}
    else read('크래머·역행렬 조건','가역 조건을 수치적으로 확인하지 못했다. 분모로 나누지 않는다.');
    out.explanation=['여인수 Cᵢⱼ의 부호는 (−1)ⁱ⁺ʲ이며, 수반행렬은 여인수 행렬의 전치이다.','크래머 공식은 det A≠0에서만 유일해를 준다. 행렬식 0만으로 불일치와 무한해를 구별하지 않는다.'];
  }else if(kind==='spaces'){
    const rr=rref(A), rows=rr.matrix.slice(0,rr.rank), cols=rr.pivots.map(j=>A.map(r=>r[j])), N=nullBasis(A),L=nullBasis(transpose(A));
    form('A',A);form('R',rr.matrix);
    for(const [label,vecs]of [['\\operatorname{Row}(A)',rows],['\\operatorname{Col}(A)',cols],['\\operatorname{Null}(A)',N],['\\operatorname{Null}(A^T)',L]] as const){
      out.tex.push(`${label}:\\quad ${vecs.length?vecs.map(v=>matrixTex(column(v))).join(',\\ '):'\\{0\\}\\;\\text{(empty basis)}'}`);
    }
    read('rank(A)',rr.rank);read('dim Null(A)',A[0].length-rr.rank);read('dim Null(Aᵀ)',A.length-rr.rank);
    if(N.length)read('A·영공간 기저 잔차',norm(multiply(A,transpose(N)).flat()));
    if(L.length)read('Aᵀ·왼쪽 영공간 기저 잔차',norm(multiply(transpose(A),transpose(L)).flat()));
    read('단사·전사',`${rr.rank===A[0].length?'단사':'단사 아님'} / ${rr.rank===A.length?'공역 Rᵐ에 전사':'공역 Rᵐ에 전사 아님'}`);
    const vectors=cols.length?cols:rows;
    if(vectors.every(v=>v.length<=3)){vectors.forEach((v,i)=>vector(`독립 방향 ${i+1}`,v));out.is3d=vectors[0]?.length===3;}
    out.explanation=['열공간 기저는 원래 A의 피벗 열이다. 행공간 기저는 RREF의 비영 행이다. 두 선택을 혼동하지 않는다.','영공간은 자유변수 하나씩을 1로 둔 기저이며, 자유변수가 없으면 {0}공간의 기저는 빈 집합이다.','Row(A)⊥Null(A), Col(A)⊥Null(Aᵀ). 공역을 Rᵐ으로 명시한 뒤 전사를 판단한다.'];
  }else if(kind==='coordinates'){
    const blocks=aux.split(/\n\s*---\s*\n/);if(blocks.length!==2)throw Error('보조 입력에 출력 기저 C와 벡터 x를 ---로 나누어 넣는다.');
    const C=parseMatrix(blocks[0]),x=parseMatrix(blocks[1]);if(A.length!==A[0].length||C.length!==A.length||C[0].length!==A.length||x.length!==A.length||x[0].length!==1)throw Error('B,C는 같은 n×n 기저 행렬, x는 n×1 벡터이다.');
    const Bi=inverse(A),Ci=inverse(C), xb=multiply(Bi,x),xc=multiply(Ci,x),P=multiply(Ci,A);
    form('B',A);form('C',C);form('x',x);form('[x]_B',xb);form('[x]_C',xc);form('P_{C\\leftarrow B}=C^{-1}B',P);
    form('P_{C\\leftarrow B}[x]_B',multiply(P,xb));read('같은 벡터 재구성 잔차',residual(multiply(A,xb),multiply(C,xc)));
    out.tex.push('x=B[x]_B=C[x]_C,\\quad [x]_C=C^{-1}B[x]_B');
    if(x.length<=3){vector('고정 벡터 x',x.flat());transpose(A).forEach((v,i)=>vector(`기저 B${i+1}`,v,true));transpose(C).forEach((v,i)=>vector(`기저 C${i+1}`,v));out.is3d=x.length===3;}
    out.explanation=['좌표는 바뀌지만 벡터 x는 고정한다. 전이행렬의 화살표는 입력 좌표 기저 B에서 출력 좌표 기저 C로 향한다.','다항식·행렬 같은 일반 공간도 실제 선택한 기저가 있으면 유한 좌표로 연결한다. 숫자 열 자체를 원래 대상으로 바꾸지 않는다.'];
  }else if(kind==='representation'){
    const blocks=aux.split(/\n\s*---\s*\n/);if(blocks.length!==2)throw Error('입력 기저 B와 출력 기저 C를 ---로 나누어 넣는다.');
    const B=parseMatrix(blocks[0]),C=parseMatrix(blocks[1]);
    if(B.length!==A[0].length||B[0].length!==B.length||C.length!==A.length||C[0].length!==C.length)throw Error('B는 정의역의 정사각 기저, C는 공역의 정사각 기저여야 한다.');
    const Bi=inverse(B),Ci=inverse(C),M=multiply(multiply(Ci,A),B);
    form('A',A);form('B',B);form('C',C);form('[T]_{C\\leftarrow B}=C^{-1}AB',M);form('A=C[T]_{C\\leftarrow B}B^{-1}',multiply(multiply(C,M),Bi));
    read('같은 작용 재구성 잔차',residual(A,multiply(multiply(C,M),Bi)));
    out.tex.push('[T(x)]_C=[T]_{C\\leftarrow B}[x]_B');
    if(B.length===C.length&&residual(B,C)<=tolerance(B))out.tex.push('[T]_B=B^{-1}AB');
    out.explanation=['입력 기저와 출력 기저의 역할을 구별한다. 입력 기저벡터들의 상을 출력 기저 좌표로 쓴 열이 표현행렬이다.','같은 공간에서 입력과 출력에 같은 기저를 사용하면 닮음 B⁻¹AB가 된다. 서로 다른 두 기저의 표현을 자동으로 닮음이라 부르지 않는다.'];
  }else if(kind==='matrix-operations'||kind==='composition'){
    const B=parseMatrix(aux);form('A',A);form('B',B);form('A^T',transpose(A));form('tA',A.map(r=>r.map(v=>t*v)));
    if(A.length===B.length&&A[0].length===B[0].length){form('A+B',A.map((r,i)=>r.map((v,j)=>v+B[i][j])));form('A-B',subtract(A,B));}else out.notices.push('덧셈의 같은 크기 조건을 충족하지 않는다.');
    if(A.length===A[0].length)read('정사각 행렬의 대각합 tr(A)',A.reduce((sum,row,i)=>sum+row[i],0));else out.notices.push('대각합은 정사각행렬에서만 정의한다.');
    if(A.length===A[0].length){
      const isZero=(values:number[])=>norm(values)<=tolerance(A);
      read('행렬의 성분 구조',[
        isZero(A.flatMap((row,i)=>row.filter((_,j)=>i!==j)))?'대각':null,
        isZero(A.flatMap((row,i)=>row.filter((_,j)=>i>j)))?'상삼각':null,
        isZero(A.flatMap((row,i)=>row.filter((_,j)=>i<j)))?'하삼각':null,
        residual(A,transpose(A))<=tolerance(A)?'대칭':null,
      ].filter(Boolean).join(' · ')||'일반 정사각행렬');
      if(kind==='matrix-operations'){
        const exponent=Math.round(params.n??2);
        if(exponent<-5||exponent>5)throw Error('정수 지수의 관찰 범위는 −5부터5이다.');
        try{
          const factor=exponent<0?inverse(A):A;
          let power=identity(A.length);
          for(let i=0;i<Math.abs(exponent);i++)power=multiply(power,factor);
          form(`A^{${exponent}}`,power);
          const square=multiply(A,A);
          read('멱등 조건 ‖A²−A‖F',residual(square,A));
          read('반대칭 조건 ‖Aᵀ+A‖F',norm(transpose(A).flat().map((v,i)=>v+A.flat()[i])));
          let nilpower=identity(A.length),nilindex=0;
          for(let j=1;j<=A.length;j++){nilpower=multiply(nilpower,A);if(norm(nilpower.flat())<=tolerance(A)){nilindex=j;break;}}
          read('영거듭제곱의 수치 확인',nilindex?`A^${nilindex}의 잔차가 허용오차 이하`:'차원 이하에서 확인되지 않음 · 정확 기호 판정 아님');
          form('p(A)=I+2A+A^2',identity(A.length).map((row,i)=>row.map((v,j)=>v+2*A[i][j]+square[i][j])));
          out.tex.push('A^0=I,\\quad p(A)=a_0I+\\sum_{j=1}^{s}a_jA^j');
        }catch{out.notices.push('음의 정수 거듭제곱에는 가역성이 필요하다. 현재 수치 허용오차에서 역행렬을 확정하지 못했다.');}
      }
    }
    if(A[0].length===B.length){form('AB',multiply(A,B));out.steps=transpose(A).map((col,j)=>({operation:`열-행 전개 항 ${j+1} · A의 열과 B의 행의 바깥 곱`,matrix:multiply(column(col),[B[j]])}));out.tex.push('AB=\\sum_j a_j b_j^T');}else out.notices.push('AB의 안쪽 차원이 다르다.');
    if(B[0].length===A.length)form('BA',multiply(B,A));else out.notices.push('BA의 안쪽 차원이 다르다.');
    if(A.length===2&&A[0].length===2&&B.length===2&&B[0].length===2){const x=column([1,1]);vector('x',x.flat(),true);vector('먼저 B · Bx',multiply(B,x).flat(),true);vector('다음 A · ABx',multiply(multiply(A,B),x).flat());vector('반대 순서 · BAx',multiply(multiply(B,A),x).flat());}
    out.tex.push('T_A\\circ T_B(x)=A(Bx)=(AB)x');
    if(A.length===A[0].length&&B.length===B[0].length&&A.length===B.length){try{form('(AB)^{-1}',inverse(multiply(A,B)));form('B^{-1}A^{-1}',multiply(inverse(B),inverse(A)));}catch{out.notices.push('두 가역 행렬의 역곱 공식은 각 가역 조건을 확인한 경우에 적용한다.');}}
    out.explanation=['합성에서 먼저 적용한 B가 행렬곱 AB의 오른쪽에 놓인다. 일반적으로 AB와 BA는 다르며, 정의되는 크기도 다를 수 있다.','수치 반례는 교환법칙이 일반적으로 성립하지 않음을 보여줄 수 있다. 몇 예시로 모든 다른 대수 법칙을 증명하지 않는다.'];
  }else if(kind==='affine'){
    if(A.length!==3||A[0].length!==3||Math.abs(A[2][0])+Math.abs(A[2][1])+Math.abs(A[2][2]-1)>tolerance(A))throw Error('평면 아핀변환에는 마지막 행이 [0,0,1]인 3×3 동차좌표 행렬을 넣는다.');
    form('H',A);const x=[1,t,1],y=multiply(A,column(x)).flat();form('H[x;1]',column(y));
    const square=[[0,0],[1,0],[1,1],[0,1],[0,0]],image=square.map(v=>multiply(A,column([...v,1])).flat().slice(0,2));
    out.lines=[{name:'원래 도형',role:'secondary',points:square.map(v=>[v[0],v[1],0])},{name:'아핀변환의 상',role:'curve',points:image.map(v=>[v[0],v[1],0])}];
    vector('원벡터 x',x,true);vector('평행이동을 포함한 상',y);
    const translation=Math.hypot(A[0][2],A[1][2]);read('R²에서 원점 보존',translation<=tolerance(A)?'선형변환':'평행이동이 있어 R²에서 선형이 아님');
    out.explanation=['동차좌표에서는 3×3 행렬곱으로 계산하지만, 마지막 좌표가 1인 평면에서 평행이동은 R²의 원점을 보존하지 않는다.','회전·반사·전단·확대를 왼쪽 2×2 블록에서, 평행이동을 마지막 열에서 읽는다.'];
  }else if(kind==='geometry'){
    if(A.length!==A[0].length||![2,3].includes(A.length))throw Error('공간 관찰은 2×2 또는3×3 행렬이다.');
    let M=A;
    if(mode&&mode!=='matrix'){
     if(A.length!==3)throw Error('축 회전은 3차원 행렬에서 사용한다.');
     const c=Math.cos(t),s=Math.sin(t);
     M=mode==='x'?[[1,0,0],[0,c,-s],[0,s,c]]:mode==='y'?[[c,0,s],[0,1,0],[-s,0,c]]:[[c,-s,0],[s,c,0],[0,0,1]];
    }
    const x=parseMatrix(aux);if(x.length!==A.length||x[0].length!==1)throw Error('입력 벡터는 행렬과 같은 차원의 한 열이다.');
    const y=multiply(M,x);form('A',M);form('x',x);form('Ax',y);out.is3d=A.length===3;vector('x',x.flat(),true);vector('Ax',y.flat());
    const vertices=A.length===2?[[0,0],[1,0],[1,1],[0,1]]:[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]],edges=A.length===2?[[0,1],[1,2],[2,3],[3,0]]:[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    for(const [a,b]of edges){const points=[vertices[a],vertices[b]];out.lines.push({name:'원도형의 모서리',role:'secondary',points:points.map(v=>[v[0],v[1],v[2]??0])},{name:'대응하는 상의 모서리',role:'curve',points:points.map(v=>{const w=multiply(M,column(v)).flat();return [w[0],w[1],w[2]??0];})});}
    read('직교 조건 ‖AᵀA−I‖F',residual(multiply(transpose(M),M),identity(A.length)));read('det A',determinant(M));read('원벡터·상의 노름',`${displayNumber(norm(x.flat()))} → ${displayNumber(norm(y.flat()))}`);
    out.explanation=['같은 모서리의 양 끝점을 변환해 원도형과 상을 같은 축척으로 연결한다. 특이 행렬에서는 모서리·차원이 줄어들 수 있다.','축 회전은 오른손 좌표계의 능동 회전이다. 축을 돌리는 수동 좌표변환은 그 역이다.'];
  }else if(kind==='objects'){
    const flat=A.flat(),coeff=mode==='matrix'?flat:A[0];if(mode!=='matrix'&&A.length!==1)throw Error('다항식은 낮은 차수부터 한 행의 계수를 넣는다.');
    form('\\text{선택한 표준기저의 좌표}',column(coeff));
    if(mode==='matrix'){
     out.tex.push(`X=${matrixTex(A)}`,`\\dim M_{${A.length},${A[0].length}}=${flat.length}`);
     out.explanation=['행 우선 순서를 정한 위치별 기본행렬 기저에서 각 성분을 좌표로 읽는다. 같은 숫자 열이라도 원래 대상은 행렬이다.','유한차원 선형 동형은 연산 구조의 대응이며 별도의 내적 없이 길이 보존을 뜻하지 않는다.'];
    }else{
     out.tex.push(`p(x)=${coeff.map((c,j)=>`(${displayNumber(c)})x^{${j}}`).join('+')}`);
     const derivative=coeff.slice(1).map((c,j)=>c*(j+1));form('\\text{도함수 좌표}',column(derivative.length?derivative:[0]));
     out.tex.push(coeff.length===1?'D:P_0\\to P_0,\\quad D(p)=0':'D:P_n\\to P_{n-1},\\quad[a_0,a_1,\\ldots,a_n]\\mapsto[a_1,2a_2,\\ldots,na_n]');
     out.lines=[{name:'다항식 p',role:'curve',points:Array.from({length:81},(_,i)=>{const x=-1+i/40;return [x,coeff.reduce((s,c,j)=>s+c*x**j,0),0];})}];
     out.explanation=['표준기저 1,x,…의 순서를 고정하여 좌표와 원래 다항식을 함께 읽는다. 미분은 계수를 이동·배율 조정하는 직사각 선형 작용이다.','표본 곡선을 좌표 열 자체 또는 함수의 일반 증명으로 취급하지 않는다. 차수를 낮추면 원래 공간의 범위도 달라진다.'];
    }
  }else if(kind==='weighted-qr'){
    const G=parseMatrix(aux);if(G.length!==A.length||G[0].length!==A.length)throw Error('G의 크기는 벡터의 행 차원과 같은 정사각행렬이다.');
    if(symmetricEigen(G).values.some(v=>v<=tolerance(G)))throw Error('G는 대칭 양정치이어야 한다.');
    const inner=(u:number[],v:number[])=>dot(u,multiply(G,column(v)).flat()),d=orthogonalize(transpose(A),inner),Q=transpose(d.q),R=multiply(multiply(transpose(Q),G),A);
    form('A',A);form('G',G);form('Q',Q);form('R=Q^TGA',R);form('Q^TGQ',multiply(multiply(transpose(Q),G),Q));out.steps=d.steps;
    read('직교화 재구성 잔차 ‖A−QR‖F',residual(A,multiply(Q,R)));read('G 정규직교 잔차',residual(multiply(multiply(transpose(Q),G),Q),identity(Q[0].length)));
    out.explanation=['같은 순서의 독립 열을 G 내적에서 직교화한다. QᵀGQ=I와 유클리드 QᵀQ=I는 다른 조건이다.','다항식 적분 내적에서의 직교화는 함수 관찰의 별도 방식으로 연결된다.'];
  }else if(kind==='weighted-inner'){
    const vectors=parseMatrix(aux);if(A.length!==A[0].length||vectors.length!==2||vectors[0].length!==A.length)throw Error('G는 n×n, 보조 입력의 두 행은 u와 v이다.');
    const e=symmetricEigen(A);if(e.values.some(v=>v<=tolerance(A)))throw Error('내적에는 양정치 G가 필요하다. 반정치·부정치 규칙을 내적으로 처리하지 않는다.');
    const [u,v]=vectors,inner=(x:number[],y:number[])=>dot(x,multiply(A,column(y)).flat()), uu=inner(u,u),vv=inner(v,v),uv=inner(u,v);
    form('G',A);out.tex.push('\\langle u,v\\rangle_G=u^TGv',`\\langle u,v\\rangle_G=${displayNumber(uv)}`,`\\|u\\|_G=${displayNumber(Math.sqrt(uu))},\\quad\\|v\\|_G=${displayNumber(Math.sqrt(vv))}`);
    read('코시–슈바르츠 · |〈u,v〉|≤‖u‖‖v‖',`${displayNumber(Math.abs(uv))} ≤ ${displayNumber(Math.sqrt(uu*vv))}`);
    if(uu>tolerance(A)){const p=u.map(x=>x*uv/uu),r=v.map((x,i)=>x-p[i]);form('p',column(p));form('r',column(r));read('G 내적의 정사영 잔차',inner(u,r));if(A.length<=3){vector('u',u,true);vector('v',v,true);vector('G 정사영 p',p);out.is3d=A.length===3;}}
    if(uu>0&&vv>0)read('G 내적에서의 각도 · 라디안',Math.acos(Math.max(-1,Math.min(1,uv/Math.sqrt(uu*vv)))));else read('각도 조건','0벡터가 포함되어 각도를 정의하지 않는다.');
    if(A.length===2){const theta=Array.from({length:121},(_,i)=>2*Math.PI*i/120);out.lines.push({name:'G 노름이1인 타원',role:'curve',points:theta.map(a=>{const w=[Math.cos(a),Math.sin(a)],len=Math.sqrt(inner(w,w));return [w[0]/len,w[1]/len,0];})});}
    out.explanation=['대칭 양정치 G는 실수 유한차원 내적을 정한다. 눈에 보이는 유클리드 각도와 G 내적의 각도는 다를 수 있다.','직교는 선택한 내적에 관한 말이다. 그림에서 직각처럼 보이지 않더라도 uᵀGr=0이면 G 내적에서 직교한다.'];
  }else if(kind==='subspace-projection'){
    const b=parseMatrix(aux);if(b[0].length!==1||b.length!==A.length)throw Error('b는 A와 행 수가 같은 한 열 벡터이다.');
    const rr=rref(A),cols=rr.pivots.map(j=>A.map(r=>r[j]));let P=A.map(()=>Array(A.length).fill(0));
    if(cols.length){const {Q}=qr(transpose(cols));P=multiply(Q,transpose(Q));form('Q',Q);}
    const p=multiply(P,b),r=subtract(b,p),s=solveSystem(A,p);
    form('A',A);form('P_W',P);form('b',b);form('p=P_Wb',p);form('r=b-p',r);form('A^Tr',multiply(transpose(A),r));
    if(s.particular)form('x_0',s.particular);
    s.basis.forEach((v,i)=>form(`v_{${i+1}}\\in\\operatorname{Null}(A)`,column(v)));
    out.tex.push('\\hat x=x_0+\\operatorname{Null}(A),\\quad P_W^2=P_W=P_W^T');
    read('최소제곱 계수의 유일성',rr.rank===A[0].length?'계수가 유일하다':'정사영 p는 유일하지만 계수에 영공간 자유도가 있다');read('잔차 노름',norm(r.flat()));read('정사영 멱등 잔차',residual(multiply(P,P),P));
    if(b.length<=3){vector('b',b.flat(),true);vector('p',p.flat());out.is3d=b.length===3;}
    out.explanation=['종속 열을 허용하며, 원래 피벗 열의 정규직교 기저로 같은 부분공간에 정사영한다. QR 입력의 독립 조건 실패를 최소제곱 자체의 불가능으로 바꾸지 않는다.','직교 잔차가 모든 A의 열에 수직이면 최선근사이다. 계수의 비유일성과 투영 벡터의 유일성을 구별한다.'];
  }else if(kind==='triangular'){
    const h=hessenberg(A);form('P_H',h.P);form('H=P_H^TAP_H',h.H);out.steps=h.steps;
    read('헤센베르크 재구성 잔차',residual(A,multiply(multiply(h.P,h.H),transpose(h.P))));
    if(mode==='schur'){
      const s=schurReal(A);form('P_S',s.P);form('S=P_S^TAP_S',s.S);out.steps=s.steps;read('슈어 재구성 잔차',residual(A,multiply(multiply(s.P,s.S),transpose(s.P))));
      read('상삼각 아래 잔차',norm(s.S.flatMap((r,i)=>r.filter((_,j)=>j<i))));
    }
    out.explanation=['실수 정사각행렬의 헤센베르크 형태는 첫 부대각선 아래가 0이다. H의 대각 성분은 일반적으로 고유값이 아니다.','교재의 실수 상삼각 슈어 정리는 모든 고유값이 실수라는 조건을 가진다. 복소 고유값을 가진 실수 행렬을 실수 상삼각으로 강제하지 않는다.'];
  }else if(kind==='spectral'){
    const e=symmetricEigen(A),Q=e.vectors,D=diagonal(e.values),x=column(Array(A.length).fill(1));form('A',A);form('Q',Q);form('D',D);form('Q^TAQ',multiply(multiply(transpose(Q),A),Q));
    out.steps=transpose(Q).map((u,i)=>({operation:`정규직교 고유방향 ${i+1}의 정사영에 고유값을 곱한다`,matrix:multiply(column(u),[u]).map(r=>r.map(v=>v*e.values[i]))}));
    out.tex.push('A=\\sum_i\\lambda_i u_i u_i^T',`\\lambda_{\\min}\\le\\frac{x^TAx}{x^Tx}\\le\\lambda_{\\max}`);
    form('Ax',multiply(A,x));read('단위구면의 최솟값',Math.min(...e.values));read('단위구면의 최댓값',Math.max(...e.values));read('분해 재구성 잔차',residual(A,multiply(multiply(Q,D),transpose(Q))));
    out.explanation=['같은 A의 스펙트럼 투영항, 정규직교 기저, 주축, 단위구면의 극값은 동일한 고유쌍을 재사용한다.','단위구면의 전역 극값과 일반 함수의 국소 극값은 다르다. 헤시안이 반정치인 임계점에서는 이차 미분 판정만으로 결론 내리지 않는다.'];
  }else if(kind==='eigen-general'){
    if(A.length!==A[0].length)throw Error('고유값에는 정사각행렬이 필요하다.');
    const es=eigs(A,{precision:1e-12}), vals=arrayOf(es.values),pairs=es.eigenvectors;
    form('A',A);out.tex.push(`\\lambda:\\quad ${vals.map(scalarTex).join(',\\ ')}`);
    const P=A.map((_,i)=>pairs.map(p=>arrayOf(p.vector)[i])),D=pairs.map((p,i)=>pairs.map((_,j)=>i===j?p.value:0));
    pairs.forEach((p,i)=>out.tex.push(`\\lambda_{${i+1}}=${scalarTex(p.value)},\\quad v_{${i+1}}=${complexMatrixTex(arrayOf(p.vector).map(v=>[v]))}`));
    if(pairs.length===A.length){
      try{const Pi=arrayOf(mathInverse(mathMatrix(P as (number | Complex)[][]))) as unknown[][],diag=arrayOf(mathMultiply(mathMultiply(Pi as MathType,A as MathType),P as MathType)) as unknown[][];out.tex.push(`P=${complexMatrixTex(P)}`,`P^{-1}AP=${complexMatrixTex(diag)}`,`D=${complexMatrixTex(D)}`);read('수치 대각화 조건','독립 고유벡터를 확인했다. 선택 체와 수치 잔차를 함께 읽는다.');}
      catch{read('수치 대각화 조건','독립 고유벡터를 확인하지 못했다. 원문 조건은 별도로 판단한다.');}
    }else read('수치 대각화 조건','고유벡터 수가 부족하다. 반복 고유값과 고유공간 차원을 별도로 읽는다.');
    out.explanation=['P의 열 순서와 D의 대각 고유값 순서는 같은 고유쌍에 맞춘다. P⁻¹AP=D와 AP=PD는 같은 관계이다.','반복근 자체로 대각화 불가능을 선언하지 않는다. 가까운 근과 수치 종속은 정확한 기호 중복도 판정과 다르다.'];
  }else if(kind==='ldu'){
    const {L,U,P,steps}=lu(A),D=diagonal(U.map((r,i)=>r[i])),Un=U.map((r,i)=>r.map(v=>v/U[i][i]));form('P',P);form('L',L);form('D',D);form('U_1',Un);out.tex.push('PA=LDU_1');out.steps=steps;
    read('LDU 재구성 잔차',residual(multiply(P,A),multiply(multiply(L,D),Un)));
    const b=parseMatrix(aux);if(b.length!==A.length)throw Error('복수 오른쪽 벡터의 행 수는 A와 같아야 한다.');
    const pb=multiply(P,b),y=b.map(()=>Array(b[0].length).fill(0)),x=structuredClone(y);
    for(let k=0;k<b[0].length;k++){
      for(let i=0;i<A.length;i++)y[i][k]=pb[i][k]-L[i].reduce((s,v,j)=>s+(j<i?v*y[j][k]:0),0);
      for(let i=A.length-1;i>=0;i--)x[i][k]=(y[i][k]-U[i].reduce((s,v,j)=>s+(j>i?v*x[j][k]:0),0))/U[i][i];
    }
    form('B',b);form('Y',y);form('X',x);read('복수 AX−B 잔차',residual(multiply(A,x),b));
    out.explanation=['분해는 A에 한 번 적용하고, 여러 오른쪽 벡터에 전진·후진 대입을 재사용한다. 피벗 교환이 있으면 PA=LDU₁이다.','D는 피벗 대각 배율, U₁은 대각이 1인 상삼각행렬이다. 0피벗에서는 이 고유한 삼각 해법을 강제하지 않는다.'];
  }else if(kind==='data-fit'){
    if(A[0].length!==2)throw Error('자료의 각 행을 x y 두 열로 넣는다. 실제 단위는 사용자가 정한다.');
    const logarithmic=mode==='logarithmic';if(logarithmic&&A.some(r=>r[0]<=0))throw Error('로그 모형은 모든 x가 양수여야 한다.');
    const degree=logarithmic?1:Math.round(params.n??1);if(degree<0||degree>4)throw Error('다항식 차수는 0부터4이다.');
    const X=A.map(([x])=>Array.from({length:degree+1},(_,j)=>(logarithmic?Math.log(x):x)**j)),b=column(A.map(r=>r[1]));
    const rr=rref(X),cols=rr.pivots.map(j=>X.map(r=>r[j])),Q=cols.length?qr(transpose(cols)).Q:null,p=Q?multiply(multiply(Q,transpose(Q)),b):b.map(()=>[0]),solution=solveSystem(X,p);
    form('X',X);form('b',b);if(solution.particular)form('\\hat\\beta',solution.particular);form('X^T(b-X\\hat\\beta)',multiply(transpose(X),subtract(b,p)));
    read('관측 표본의 잔차 노름',norm(subtract(b,p).flat()));read('모형 계수 조건',rr.rank===degree+1?'유일한 계수':'종속 모형 열 · 계수는 비유일할 수 있다');
    const min=Math.min(...A.map(r=>r[0])),max=Math.max(...A.map(r=>r[0]));
    if(solution.particular){const beta=solution.particular.flat(),points=Array.from({length:61},(_,i)=>{const x=min+(max-min)*i/60;return [x,beta.reduce((s,v,j)=>s+v*(logarithmic?Math.log(x):x)**j,0),0] as [number,number,number];});out.lines=[{name:'유한 자료 표본',role:'secondary',points:A.map(r=>[r[0],r[1],0])},{name:logarithmic?'로그 모형 a+b ln(x)':'선택한 다항식 모형',role:'curve',points}];}
    if(logarithmic){out.tex.push('y=a+b\\ln x,\\quad x>0');out.notices.push('x만 로그로 변환하고 y의 제곱 잔차를 최소화한다. y의 로그 잔차를 최소화하는 지수 모형과 구별한다.');}
    out.explanation=['설명용 초기 표본은 실제 관측으로 기록하지 않는다. 자료 각 행은 관측쌍, 모형 열은 1,x,…,xⁿ, 계수는 해당 열의 배율이다.','유한 표본에 대한 최소제곱 적합은 모집단의 법칙·인과·범위 밖 예측 정확성을 보장하지 않는다.'];
  }else if(kind==='function-inner'){
    const inner=polynomialInner,fn=(v:number[],x:number)=>v.reduce((s,c,i)=>s+c*x**i,0),grid=Array.from({length:81},(_,i)=>-1+i/40);
    if(mode==='basis'){
     const d=orthogonalize(A,inner);out.steps=d.steps;form('\\text{정규직교 함수의 계수 행}',d.q);
     form('\\text{적분 Gram 행렬}',d.q.map(u=>d.q.map(v=>inner(u,v))));
     out.lines=d.q.map((v,i)=>({name:`정규직교 다항식 ${i+1}`,role:i?'secondary':'curve',points:grid.map(x=>[x,fn(v,x),0])}));
     out.explanation=['각 행은 낮은 차수부터의 다항식 계수이다. [−1,1]의 적분 내적을 해석적으로 계산하여 직교화한다.','독립 조건에서 앞선 생성공간을 유지한다. 종속 방향은 0으로 나누지 않는다.'];
     return out;
    }
    if(mode==='best'){
     const f=A[0],degree=Math.round(params.n??2);if(degree<0||degree>5)throw Error('근사 차수는0~5이다.');
     const size=Math.max(f.length,degree+1),basis=identity(size).slice(0,degree+1),d=orthogonalize(basis,inner),coef=d.q.map(v=>inner(f,v)),p=Array.from({length:size},(_,j)=>d.q.reduce((s,v,i)=>s+coef[i]*v[j],0)),r=Array.from({length:size},(_,j)=>(f[j]??0)-p[j]);
     form('\\text{근사 함수의 계수}',[p]);form('\\text{직교 성분별 계수}',column(coef));read('제곱 적분 오차 ∫(f−p)²',inner(r,r));read('잔차 직교 조건',Math.hypot(...d.q.map(v=>inner(r,v))));
     out.lines=[{name:'원함수 f',role:'secondary',points:grid.map(x=>[x,fn(f,x),0])},{name:'선택한 차수의 최선근사',role:'curve',points:grid.map(x=>[x,fn(p,x),0])}];
     out.tex.push('p=\\sum_i\\langle f,q_i\\rangle q_i,\\quad\\langle f-p,q_i\\rangle=0');out.steps=d.steps;
     out.explanation=['첫 행의 다항식을 차수 n 이하의 함수 공간에 적분 정사영한다. 행렬의 두 번째 이후 행은 이 방식의 계산에 사용하지 않는다.','오차는 해석적 적분값이며, 구간 길이로 나눈 평균값·호 길이·유한 표본 제곱합과 구별한다.'];
     return out;
    }
    if(A.length!==2)throw Error('내적 비교는 두 행을 f와 g의 다항식 계수로 넣는다.');
    const [f,g]=A,ff=inner(f,f),gg=inner(g,g),fg=inner(f,g);
    read('적분 내적 〈f,g〉',fg);read('함수 노름 ‖f‖',Math.sqrt(Math.max(0,ff)));read('함수 거리 ‖f−g‖',Math.sqrt(Math.max(0,ff+gg-2*fg)));
    out.tex.push('\\langle f,g\\rangle=\\int_{-1}^{1}f(x)g(x)\\,dx',`\\langle f,g\\rangle=${displayNumber(fg)}`);
    if(gg>0){const p=g.map(x=>fg/gg*x);out.tex.push(`\\operatorname{proj}_g f=(${displayNumber(fg/gg)})g`);read('근사 잔차와 g의 내적',inner(f.map((x,i)=>x-p[i]),g));}
    else read('정사영 조건','g는 0함수여서 단일 방향 정사영 분모로 사용할 수 없다.');
    out.lines=[{name:'f',role:'curve',points:grid.map(x=>[x,fn(f,x),0])},{name:'g',role:'secondary',points:grid.map(x=>[x,fn(g,x),0])}];
    out.explanation=['다항식 계수를 대상 함수와 연결하고 적분을 해석적으로 계산한다. 그려진 유한 점을 적분의 정확값으로 사용하지 않는다.','이 틀은 [−1,1]의 다항식 예제이다. 일반 함수의 연속성·적분 가능성·푸리에 수렴 조건은 각 원문 항목에서 별도로 읽는다.'];
  }else if(kind==='fourier'){
    if(A.length!==1)throw Error('[0,2π]의 다항식 계수를 낮은 차수부터 한 행에 넣는다.');
    const f=A[0],L=2*Math.PI,N=Math.round(params.n??4);if(N<0||N>15)throw Error('푸리에 차수는0~15이다.');
    const a0=f.reduce((s,c,j)=>s+c*L**(j+1)/(j+1),0)/Math.PI,an:number[]=[],bn:number[]=[];
    for(let k=1;k<=N;k++){
     const C=[0],S=[0];for(let j=1;j<f.length;j++){C[j]=-j*S[j-1]/k;S[j]=-(L**j)/k+j*C[j-1]/k;}
     an.push(dot(f,C)/Math.PI);bn.push(dot(f,S)/Math.PI);
    }
    const fn=(x:number)=>f.reduce((s,c,j)=>s+c*x**j,0),approx=(x:number)=>a0/2+an.reduce((s,c,i)=>s+c*Math.cos((i+1)*x)+bn[i]*Math.sin((i+1)*x),0),grid=Array.from({length:321},(_,i)=>L*i/320);
    form('\\text{다항식 계수}',A);out.tex.push(`a_0=${displayNumber(a0)}`,`a_n=${matrixTex([an.length?an:[0]])}`,`b_n=${matrixTex([bn.length?bn:[0]])}`,'S_N(x)=a_0/2+\\sum_{n=1}^{N}(a_n\\cos nx+b_n\\sin nx)');
    out.lines=[{name:'원함수 · [0,2π]',role:'secondary',points:grid.map(x=>[x,fn(x),0])},{name:'유한 푸리에 최선근사',role:'curve',points:grid.map(x=>[x,approx(x),0])}];
    const square=f.reduce((s,c,i)=>s+f.reduce((r,d,j)=>r+c*d*L**(i+j+1)/(i+j+1),0),0),error=square-Math.PI*(a0*a0/2+dot(an,an)+dot(bn,bn));
    read('제곱 적분 오차',Math.max(0,error));read('표본 최대 오차 · 내부',Math.max(...grid.slice(1,-1).map(x=>Math.abs(fn(x)-approx(x)))));
    out.explanation=['계수 적분은 다항식과 삼각함수의 부분적분 점화식으로 계산한다. 화면의 유한 점을 적분 계산으로 사용하지 않는다.','다항식의 주기 연장은 양 끝에서 다를 수 있다. L² 최선근사·유한 표본오차·무한급수의 점별 수렴을 구별한다.'];
  }else if(kind==='power'){
    const e=symmetricEigen(A),x0=aux.trim()?parseMatrix(aux):column(A.length===2?[1,params.t??0]:Array.from({length:A.length},(_,i)=>Number(i===0)));if(x0.length!==A.length||x0[0].length!==1)throw Error('초기 벡터는 A와 같은 차원의 한 열이다.');
    const count=Math.round(params.n??5);if(count<0||count>30)throw Error('반복 횟수는0~30이다.');
    const scaling=(v:number[])=>mode==='maximum'?Math.max(...v.map(Math.abs)):norm(v);
    let x=x0.flat();if(norm(x)===0)throw Error('초기 벡터는0이 아니어야 한다.');x=x.map(v=>v/scaling(x));
    out.steps=[{operation:'선택한 길이 규칙으로 정규화한 초기 벡터',matrix:column(x)}];
    let lambda=dot(x,multiply(A,column(x)).flat())/dot(x,x),last=lambda;
    for(let k=1;k<=count;k++){const y=multiply(A,column(x)).flat(),len=scaling(y);if(len<=tolerance(A)){out.notices.push('현재 방향이 영공간에 들어가 정규화할 수 없다. 대상 전체의 발산을 뜻하지 않는다.');break;}x=y.map(v=>v/len);last=lambda;lambda=dot(x,multiply(A,column(x)).flat())/dot(x,x);out.steps.push({operation:`반복 ${k} · Ax를 ${mode==='maximum'?'최대 절댓값 성분':'유클리드 노름'}으로 정규화`,matrix:column(x)});}
    const order=e.values.map((v,i)=>({v,i})).sort((a,b)=>Math.abs(b.v)-Math.abs(a.v)),dominant=order[0],component=dot(x0.flat(),transpose(e.vectors)[dominant.i]),strict=order.length===1||Math.abs(dominant.v)>Math.abs(order[1].v)+tolerance(A);
    form('A',A);form('x_0',x0);form('x_n',column(x));out.tex.push(`\\rho(x)=\\frac{x^TAx}{x^Tx}=${displayNumber(lambda)}`);
    read('책의 양의 지배값·엄격한 우위 조건',dominant.v>0&&strict?'행렬 조건 충족 · 초기 성분 별도 확인':'해당 정리의 행렬 조건을 바로 적용하지 않는다');read('초기 지배 방향 성분',component);read('고유쌍 잔차',norm(multiply(A,column(x)).flat().map((v,i)=>v-lambda*x[i])));read('마지막 추정값의 변화 · 실제 오차가 아님',Math.abs(lambda-last));
    if(Math.abs(component)<=tolerance(A))out.notices.push('초기 지배 성분이 수치 허용오차에서0이다. 수렴 정리를 적용하지 않는다.');
    if(A.length<=3){vector('현재 방향',x);vector('Ax',multiply(A,column(x)).flat(),true);out.is3d=A.length===3;}
    out.explanation=['선택한 두 정규화는 방향은 같고 길이 표현이 다르다. 최대 절댓값 정규화가 모든 성분을 양수로 만들지는 않는다.','정리의 조건·잔차·연속 추정값의 변화는 별개의 근거이다. 음의 지배값의 방향 왕복을 레일리 몫의 발산으로 자동 해석하지 않는다.'];
  }else if(kind==='matrix-dynamics'){
    if(A.length!==A[0].length)throw Error('같은 상태 공간의 정사각 A가 필요하다.');
    const x0=parseMatrix(aux);if(x0.length!==A.length||x0[0].length!==1)throw Error('초기 상태 x₀는 A와 행 수가 같은 한 열이다.');
    const steps=Math.round(params.n??4);let x=x0;out.steps=[{operation:'초기 상태 x₀',matrix:x0}];
    const trajectories=Array.from({length:A.length},()=>[] as [number,number,number][]);
    for(let k=0;k<=steps;k++){for(let i=0;i<A.length;i++)trajectories[i].push([k,x[i][0],0]);if(k<steps){x=multiply(A,x);if(x.flat().some(v=>!Number.isFinite(v)))throw Error('표시 가능한 유한 수치를 넘었다. 결과를 확정하지 않는다.');out.steps.push({operation:`이산 단계 ${k+1} · xₖ₊₁=Axₖ`,matrix:x});}}
    form('A',A);form('x_0',x0);form('x_n',x);out.tex.push('x_{k+1}=Ax_k,\\quad x(t)=e^{tA}x_0');
    out.lines=trajectories.map((points,i)=>({name:`이산 상태 성분 ${i+1}`,role:i?'secondary':'curve',points}));
    const continuous=Array.from({length:A.length},()=>[] as [number,number,number][]);
    for(let k=0;k<=40;k++){const time=t*k/40,E=arrayOf(expm(mathMatrix(A.map(r=>r.map(v=>v*time))))) as Matrix,y=multiply(E,x0);if(y.flat().some(v=>!Number.isFinite(v)))throw Error('연속 해의 계산이 유한 범위를 넘었다.');y.forEach((r,i)=>continuous[i].push([time,r[0],0]));}
    out.secondaryPlot={tex:[],lines:continuous.map((points,i)=>({name:`연속 상태 성분 ${i+1}`,role:i?'secondary':'curve',points})),is3d:false,point:null,readouts:[],notices:[]};
    out.explanation=['같은 A와 x₀에서도 이산 Aᵏ과 연속 eᵗᴬ는 다른 과정이다. 단계 축과 시간 축을 별도 관찰로 읽는다.','반복근·복소근을 포함할 수 있는 행렬지수의 수치 계산을 사용한다. 유한 시간의 그래프만으로 장기 안정성을 증명하지 않는다.'];
  }
  return out;
}
