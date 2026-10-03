import type { PhysicsObservation, PhysicsValues } from './physics-observations';
export type SpatialArrow={name:string;from:[number,number];to:[number,number];style:'solid'|'dash'};
export type SpatialScene={title:string;axes:[string,string];arrows:SpatialArrow[];points:{name:string;x:number;y:number}[];bounds:[number,number,number,number];explanation:string;values:{name:string;value:number;unit:string}[]};
const arrow=(name:string,to:[number,number],from:[number,number]=[0,0],style:'solid'|'dash'='solid'):SpatialArrow=>({name,to,from,style});
const bounds=(arrows:SpatialArrow[],points:SpatialScene['points']):SpatialScene['bounds']=>{const all=[...arrows.flatMap(a=>[a.from,a.to]),...points.map(p=>[p.x,p.y])];const xs=all.map(p=>p[0]),ys=all.map(p=>p[1]);const span=Math.max(1,...xs.map(Math.abs),...ys.map(Math.abs))*1.25;return [-span,span,-span,span];};
/** Spatial coordinates keep equal x/y scale. Diagram vectors never mix physical units. */
export function physicsSpatial(item:PhysicsObservation,p:PhysicsValues):SpatialScene|null{
 let title='',axes:[string,string]=['x','y'],arrows:SpatialArrow[]=[],points:SpatialScene['points']=[],explanation='',values:SpatialScene['values']=[];
 if(['vector-sum','dot','torque'].includes(item.engine)){
 const A=item.engine==='torque'?p.r:p.A,B=item.engine==='torque'?p.F:p.B,angle=p.angle;
 if(item.engine==='torque')return {title:'위치와 힘의 방향 대응',axes:['x','y'],arrows:[arrow('r / |r|',[1,0]),...(B>0?[arrow('F / |F|',[Math.cos(angle),Math.sin(angle)])]:[])],points:[],bounds:[-1.3,1.3,-1.3,1.3],explanation:'위치와 힘은 단위가 다르므로 단위벡터로 방향만 표시한다. 화살표 길이로 두 물리량의 크기를 비교하지 않는다. 힘이0이면 힘의 방향·단위벡터를 그리지 않는다.',values:[{name:'지레팔',value:A*Math.sin(angle),unit:'m'},{name:'토크 크기',value:A*B*Math.sin(angle),unit:'N m'}]};
 const bx=B*Math.cos(angle),by=B*Math.sin(angle);title='벡터 합과 성분';arrows=[arrow('A',[A,0]),arrow('B',[bx,by]),arrow('A + B',[A+bx,by]),arrow('이동한 B',[A+bx,by],[A,0],'dash')];explanation='같은 좌표계의 벡터를 성분별로 더한다. 점선은 B를 합을 위한 위치로 옮긴 모습이다. A×B는 이 평면의 법선 방향이며 화살표를 평면에 눕혀 표시하지 않는다.';values=[{name:'합의 x 성분',value:A+bx,unit:'벡터 단위'},{name:'합의 y 성분',value:by,unit:'벡터 단위'},{name:'내적',value:A*bx,unit:'벡터 단위의 제곱'},{name:'외적 z 성분',value:A*by,unit:'벡터 단위의 제곱'}];
 } else if(item.engine==='lens'){
 const distance=p.p,f=p.f;if(f===0||distance===f)return null;const image=f*distance/(distance-f),h=.05*Math.min(distance,Math.abs(f));
 if(!Number.isFinite(image)||Math.abs(image)>20)return null;
 title='얇은 렌즈의 두 광선';axes=['주축 · m','높이 · m'];const top:[number,number]=[-distance,h],tip:[number,number]=[image,-image*h/distance],extent=Math.max(distance,Math.abs(image),Math.abs(f),.2)*1.3;
 points=[{name:'물체 O',x:-distance,y:h},{name:image>0?'실상 I':'허상 I',x:image,y:tip[1]},{name:'초점',x:f,y:0}];
 const xend=Math.min(extent,Math.max(.2,image>0?image:distance)),ray1:[number,number]=[xend,h-xend*h/f],ray2:[number,number]=[xend,-xend*h/distance];
 arrows=[arrow('평행 입사광',[0,h],top),arrow('중심 입사광',[0,0],top),arrow('굴절광',ray1,[0,h]),arrow('중심 통과광',ray2)];
 if(image<0)arrows.push(arrow('굴절광 연장',tip,[0,h],'dash'),arrow('중심광 연장',tip,[0,0],'dash'));
 explanation='원본의 상 거리 i를 사용한다. 실선은 빛의 진행, 점선은 뒤로 연장한 가상 교점이다. 얇은 렌즈·근축 근사이며 물체 높이는 물체 거리와 초점거리 중 작은 값의 5%로 정한 도해용 값이다. 큰 각도 광선으로 근축 근사를 벗어나지 않도록 한다. 렌즈 자체는 주축의 원점에 놓인다.';values=[{name:'상 거리 i',value:image,unit:'m'},{name:'확대율 M',value:-image/distance,unit:'1'}];
 } else if(item.engine==='snell'){
 const a=p.angle,s=p.n1*Math.sin(a)/p.n2,b=Math.abs(s)>1+8*Number.EPSILON?NaN:Math.asin(Math.max(-1,Math.min(1,s)));title='경계·법선과 광선';axes=['경계 방향','법선 방향'];arrows=[arrow('입사광',[0,0],[-Math.sin(a),Math.cos(a)]),arrow('반사광',[Math.sin(a),Math.cos(a)])];if(Number.isFinite(b))arrows.push(arrow('굴절광',[Math.sin(b),-Math.cos(b)]));points=[{name:'경계점',x:0,y:0}];explanation=Number.isFinite(b)?'각도는 법선 기준이다. 위·아래 매질의 광선 방향을 같은 경계점에서 비교한다. 길이는 진행 방향 표시이며 실제 이동 거리나 세기가 아니다.':'임계각 초과에서는 전파되는 굴절광선을 그리지 않는다. 반사광은 남는다.';values=[{name:'입사각',value:a,unit:'rad'}];
 } else if(item.engine==='rlc'){
 const xc=1/(p.omega*p.C*1e-6),xl=p.omega*p.L,z=Math.hypot(p.R,xl-xc),i=p.V/z,vr=i*p.R,vl=i*xl,vc=i*xc;title='같은 전류의 전압 위상 벡터';axes=['전류와 같은 위상 · V','전류보다 90° 앞선 위상 · V'];arrows=[arrow('V_R',[vr,0]),arrow('V_L',[0,vl]),arrow('V_C',[0,-vc]),arrow('V',[vr,vl-vc])];explanation='전류를 위상 기준으로 놓는다. 세 전압은 모두 V 단위이며 크기 합이 아니라 위상 벡터 합이 전원 전압이다. 공간 속 광선·힘 화살표가 아니다.';values=[{name:'저항 전압 진폭',value:vr,unit:'V'},{name:'인덕터 전압 진폭',value:vl,unit:'V'},{name:'축전기 전압 진폭',value:vc,unit:'V'},{name:'위상차',value:Math.atan2(xl-xc,p.R),unit:'rad'}];
 } else if(['field','potential','coulomb'].includes(item.engine)){
 title='점전하의 평면 단면과 장 방향';axes=['x · m','y · m'];const q=item.engine==='coulomb'?p.q1:p.q,sgn=Math.sign(q);points=[{name:q>0?'양의 원천 전하':q<0?'음의 원천 전하':'전하 0',x:0,y:0}];for(let i=0;i<12;i++){const a=i*Math.PI/6,c=Math.cos(a),s=Math.sin(a),a1:[number,number]=[c*.45,s*.45],a2:[number,number]=[c*.9,s*.9];if(sgn)arrows.push(arrow('E 방향',sgn>0?a2:a1,sgn>0?a1:a2));}explanation='그림은 3차원 방사 장의 평면 단면이다. 화살표는 방향만 보여 주며 길이가 장 크기나 전하량을 나타내지 않는다. 원천 위치의 특이점은 제외한다.';values=[{name:'원천 전하',value:q,unit:'μC'}];
 } else return null;
 // A zero vector has a valid zero sum/product, but no arrow direction.
 arrows=arrows.filter(a=>a.from[0]!==a.to[0]||a.from[1]!==a.to[1]);
 if(['dot','vector-sum'].includes(item.engine)&&(p.A===0||p.B===0))explanation+=' 0벡터에는 방향·사이각을 부여하지 않는다. 입력 각도는 남아 있는 그림 조건이며 0벡터의 방향이 아니다.';
 return {title,axes,arrows,points,bounds:bounds(arrows,points),explanation,values};
}
