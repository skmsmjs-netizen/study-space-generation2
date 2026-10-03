import catalog from './physics-catalog.json';
import sectionPlans from './physics-section-plans.json';
import additional from './physics-additional-models.json';
import { additionalPhysics } from './physics-additional-calculation';
import { physicsConceptReading, physicsSourceLinks } from './physics-reading';

export const physicsCatalog = catalog;
export type PhysicsControl = { key: string; name: string; tex: string; unit: string; min: number; max: number; initial: number; step?:number; choices?:{value:number;label:string}[] };
export type PhysicsObservation = { id: string; chapter: number; name: string; sections: string[]; question: string; relation: string; engine: string; controls: PhysicsControl[]; formula: string; conditions: string; initialReason: string; limits: string; x: string; y: string; extent: [number, number]; evidence?:{pdf:number;printed:number;kind:string}; abscissa?:string };
const c = (key: string, name: string, tex: string, unit: string, min: number, max: number, initial: number): PhysicsControl => ({ key, name, tex, unit, min, max, initial, ...(key==='N'?{step:1}:{}) });
const make = (chapter: number, engine: string, name: string, sections: string[], question: string, relation: string, controls: PhysicsControl[], formula: string, conditions: string, x: string, y: string, extent: [number, number], limits = '그림은 유한한 표본으로 그린 계산 모형이며 증명이나 실제 측정이 아니다.'): PhysicsObservation => ({ id: `c${chapter}-${engine}`, chapter, engine, name, sections, question, relation, controls, formula, conditions, x, y, extent, initialReason: '0과 양의 값, 부호 변화 또는 경계를 비교할 수 있는 간단한 SI 값으로 시작한다. 초기값은 교재의 예제값이 아니라 관찰을 위한 설계 선택이다.', limits });
const physicsObservationDefinitions: PhysicsObservation[] = [
  ...additional as PhysicsObservation[],
  make(2,'dot','벡터의 곱',['2.4'],'방향 사이 각도가 곱을 어떻게 바꾸는가?','같은 각도를 내적과 외적의 크기에 대응한다.',[c('A','첫 벡터 크기','A','1',0,5,2),c('B','둘째 벡터 크기','B','1',0,5,3),c('angle','사이각','\\theta','rad',0,Math.PI,Math.PI/3)],'\\vec A\\cdot\\vec B=AB\\cos\\theta','벡터는 동일한 유클리드 공간에서 비교한다. 외적의 방향은 오른손 규칙이며 크기의 곡선만으로 방향을 결정하지 않는다.','\\theta\\;(\\mathrm{rad})','\\vec A\\cdot\\vec B', [0,Math.PI]),
  make(3,'motion','등가속도 운동',['3.1','3.3','3.4','3.5'],'가속도를 바꾸면 위치와 속도는 어떻게 이어지는가?','같은 시각을 위치와 속도의 별도 그래프에 대응한다.',[c('x0','초기 위치','x_\\circ','m',-5,5,0),c('v0','초기 속도','v_\\circ','m/s',-5,5,2),c('a','가속도','a','m/s^2',-10,10,2),c('t','관찰 시각','t','s',0,8,1)],'x=x_\\circ+v_\\circ t+\\frac12at^2','관성계·일차원·질점·일정한 가속도. 자유낙하·저항·충돌은 별도 조건이다.','t\\;(\\mathrm{s})','x\\;(\\mathrm{m})',[0,8]),
  make(4,'projectile','포물선 운동',['4.2'],'발사 방향이 궤적과 비행 시간을 어떻게 바꾸는가?','동일한 시간을 수평·수직 위치에 대응한다.',[c('v','초기 속력','v_\\circ','m/s',1,30,10),c('angle','발사각','\\theta_\\circ','rad',0.05,1.5,Math.PI/4)],'x=v_\\circ\\cos\\theta_\\circ t,\\quad y=v_\\circ\\sin\\theta_\\circ t-\\frac12gt^2','공기 저항 없음, 일정한 중력, 출발·도착 높이 동일. g=9.81 m/s²를 고정한다.','x\\;(\\mathrm{m})','y\\;(\\mathrm{m})',[0,1],'동일 축척의 공간 궤적이다. 지면에 도착할 때까지 계산하며 높이가 다른 사거리식으로 확대하지 않는다.'),
  make(5,'force','합력과 가속도',['5.1','5.3'],'같은 합력에서 질량을 바꾸면 가속도가 어떻게 달라지는가?','힘과 질량을 가속도에 대응한다.',[c('m','질량','m','kg',0.1,10,2),c('F','합력','F','N',-20,20,4)],'\\sum F=ma','관성계·일정한 질량·비상대론적 운동. F는 한 물체에 작용하는 합력이다.','m\\;(\\mathrm{kg})','a\\;(\\mathrm{m/s^2})',[0.1,10]),
  make(6,'energy','용수철 에너지와 조건',['6.4','6.5','6.6'],'어떤 조건에서 위치에너지로부터 속력을 정할 수 있는가?','위치를 에너지와 속력에 대응하되 비보존력 조건을 먼저 확인한다.',[c('m','질량','m','kg',0.1,5,1),c('k','용수철 상수','k_H','N/m',0.5,20,4),c('A','진폭','A','m',0.1,2,1),c('r','위치 비율','x/A','1',-1,1,0.5)],'E=K+U,\\quad U=\\frac12k_Hx^2','물체와 이상 용수철을 계로 삼는다. 수평면·고정 벽·비보존력이 한 순일이 0일 때만 역학적 에너지 보존으로 속력을 계산한다.','x\\;(\\mathrm{m})','U\\;(\\mathrm{J})',[-1,1]),
  make(7,'collision','일차원 충돌',['7.2','7.3'],'운동량 보존과 운동에너지 보존은 어떻게 다른가?','두 물체의 전후 속도와 운동량·에너지를 비교한다.',[c('m1','첫 질량','m_1','kg',0.1,5,1),c('m2','둘째 질량','m_2','kg',0.1,5,2),c('u1','첫 초기 속도','v_{1i}','m/s',-5,5,3),c('u2','둘째 초기 속도','v_{2i}','m/s',-5,5,0),c('e','반발 계수','e','1',0,1,1)],'m_1v_{1i}+m_2v_{2i}=m_1v_{1f}+m_2v_{2f}','일차원·충돌 중 외부 충격량 무시. 반발 계수는 탄성/비탄성 비교를 위한 교재 밖 모형 매개변수이며 원문 일반식의 대체가 아니다.','e','K_f\\;(\\mathrm{J})',[0,1],'반발계수 0–1의 운동에너지 비증가 범위이다. 교재7.3.2의 내부 에너지 방출로 운동에너지가 증가하는 충돌, 평면 충돌·충돌 시간의 변형/힘 곡선은 포함하지 않는다.'),
  make(8,'torque','토크의 지렛팔',['8.6'],'힘이 같아도 회전 효과가 달라지는 이유는 무엇인가?','사이각과 수직 지렛팔을 같은 토크에 대응한다.',[c('r','반지름','r','m',0.1,3,1),c('F','힘 크기','F','N',0,10,4),c('angle','사이각','\\theta','rad',0,Math.PI,Math.PI/2)],'\\vec\\tau=\\vec r\\times\\vec F','같은 기준점·고정된 회전축에 대해 계산한다. 그림은 토크 크기이며 방향은 오른손 규칙으로 따로 판단한다.','\\theta\\;(\\mathrm{rad})','|\\tau|\\;(\\mathrm{N\\,m})',[0,Math.PI]),
  make(9,'angular','각운동량 보존',['9.2'],'질량 분포를 바꾸면 각속도가 어떻게 달라지는가?','일정한 각운동량에서 관성모멘트와 각속도를 대응한다.',[c('L','축 성분 각운동량','L_z','kg\\,m^2/s',-10,10,4),c('I','관성모멘트','I','kg\\,m^2',0.1,5,2)],'L_z=I\\omega','같은 고정축에 대한 강체 관계. 순외부 토크 0, 축 성분 비교. 일반 벡터 관계나 세차를 구현한 모형은 아니다.','I\\;(\\mathrm{kg\\,m^2})','\\omega\\;(\\mathrm{rad/s})',[0.1,5]),
  make(10,'pressure','정수압',['10.4'],'깊이와 밀도가 압력에 어떻게 기여하는가?','깊이를 압력 증가량에 대응한다.',[c('rho','밀도','\\rho','kg/m^3',100,2000,1000),c('h','깊이','h','m',0,10,2)],'P=P_\\circ+\\rho gh','정지·일정 밀도 유체, g=9.81 m/s². 그림은 기준면보다 증가한 압력이며 절대압력과 구별한다.','h\\;(\\mathrm{m})','P-P_\\circ\\;(\\mathrm{Pa})',[0,10]),
  make(11,'gas','이상기체 상태',['11.3'],'온도와 부피를 바꾸면 압력이 어떻게 바뀌는가?','같은 상태의 P·V·T를 상태식에 대응한다.',[c('n','물질량','n','mol',0.1,3,1),c('T','절대온도','T','K',100,700,300),c('V','부피','V','m^3',0.005,0.1,0.025)],'PV=nRT','이상기체·절대온도·고정된 물질량. R=8.314462618 J/(mol K). 실제 기체의 상변화를 예측하지 않는다.','V\\;(\\mathrm{m^3})','P\\;(\\mathrm{Pa})',[0.005,0.1]),
  make(12,'isothermal','열과 일의 부호',['12.2','12.3','12.4'],'준정적 등온 팽창에서 열과 일은 어떻게 연결되는가?','PV 곡선 아래 넓이와 계가 한 일·흡수 열을 대응한다.',[c('n','물질량','n','mol',0.1,3,1),c('T','절대온도','T','K',100,700,300),c('ratio','부피 비','V_f/V_i','1',0.3,3,2)],'\\Delta E_{\\mathrm{int}}=Q-W,\\quad W=nRT\\ln(V_f/V_i)','이상기체·준정적 등온 과정·계가 한 일을 양수로 둔다. V_i=0.025 m³. 이 사례에서 내부에너지 변화 0이다.','V\\;(\\mathrm{m^3})','P\\;(\\mathrm{Pa})',[0.0075,0.075]),
  make(13,'maxwell','분자 속력 분포',['13.1','13.3'],'온도를 바꾸면 분자 속력의 분포가 어떻게 이동하는가?','온도·분자 질량과 분포의 모양 및 rms 속력을 연결한다.',[c('T','절대온도','T','K',100,1000,300),c('M','몰질량','M','kg/mol',0.002,0.1,0.028)],'\\frac{f(v)}{N}=4\\pi\\left(\\frac{M}{2\\pi RT}\\right)^{3/2}v^2e^{-Mv^2/(2RT)},\\quad v_{\\mathrm{rms}}=\\sqrt{3RT/M}','열평형의 고전 이상기체. 교재 f(v)는 속력별 개수 밀도이며 현재 그래프는 f(v)/N인 정규화 확률밀도이다. 분자 질량 m과 몰질량 M을 구별하며 실제 궤적이 아니다.','v\\;(\\mathrm{m/s})','f(v)/N\\;(\\mathrm{s/m})',[0,3000]),
  make(14,'wave','파동의 공간과 시간',['14.3','14.4','14.6'],'매질의 변위와 파동의 이동은 어떻게 다른가?','같은 시각의 공간 단면과 같은 위치의 시간 변화를 연결한다.',[c('A','진폭','A','m',0.01,0.06,0.03),c('lambda','파장','\\lambda','m',1,5,3),c('f','진동수','f','Hz',0.1,2,1),c('t','관찰 시각','t','s',0,2,0)],'y=A\\sin(kx-\\omega t),\\quad k=2\\pi/\\lambda,\\quad\\omega=2\\pi f','선형 진행 사인파·고정 매질·작은 기울기. 현재 범위에서 최대 기울기 2πA/λ는 0.38 미만이며 교재의 모든 비선형 현상을 포함하지 않는다.','x\\;(\\mathrm{m})','y\\;(\\mathrm{m})',[0,6]),
  make(14,'shm','단순조화운동',['14.1'],'용수철 상수와 질량이 주기를 어떻게 정하는가?','변위·속도·주기를 같은 운동 상태에 대응한다.',[c('A','진폭','A','m',0.01,1,0.2),c('k','용수철 상수','k_H','N/m',0.5,20,4),c('m','질량','m','kg',0.1,5,1),c('t','관찰 시각','t','s',0,8,1)],'\\omega=\\sqrt{k_H/m},\\quad x=A\\cos(\\omega t)','선형 복원력·질점·마찰 없음. x(0)=A, v(0)=0. 감쇠 진동과 구별한다.','t\\;(\\mathrm{s})','x\\;(\\mathrm{m})',[0,8]),
  make(15,'sound','소리 세기와 데시벨',['15.3','15.4'],'세기 배율은 데시벨 차이에 어떻게 대응하는가?','세기의 로그와 세기 수준을 비교한다.',[c('ratio','기준 세기 대비','I/I_\\circ','1',1,1000000,1000)],'\\beta=10\\log_{10}(I/I_\\circ)','I>0, 기준 세기 $I_\\circ$=10⁻¹² W/m². 데시벨은 물리적 세기 수준이며 청감·건강 위험의 자동 판정이 아니다.','\\log_{10}(I/I_\\circ)','\\beta\\;(\\mathrm{dB})',[0,6]),
  make(16,'beats','중첩과 맥놀이',['16.1','16.5'],'가까운 두 진동수가 어떤 느린 변화를 만드는가?','같은 시각의 두 파와 합성파 및 맥놀이 진동수를 연결한다.',[c('f1','첫 진동수','f_1','Hz',1,10,5),c('f2','둘째 진동수','f_2','Hz',1,10,6)],'f_{\\mathrm{beat}}=|f_1-f_2|','선형 중첩·같은 진폭·같은 관찰점에서의 두 사인파. 그림은 무차원 변위 비교이다.','t\\;(\\mathrm{s})','y/A',[0,2]),
  make(17,'snell','굴절과 전반사',['17.2','17.3'],'각도와 굴절률은 굴절 가능 조건을 어떻게 정하는가?','입사각을 굴절각에 대응하고 전반사 조건을 분리한다.',[c('n1','첫 매질 굴절률','n_1','1',1,2.5,1.5),c('n2','둘째 매질 굴절률','n_2','1',1,2.5,1),c('angle','입사각','\\theta_1','rad',0,1.55,0.5)],'n_1\\sin\\theta_1=n_2\\sin\\theta_2','입사각은 법선 기준. n1>n2이고 θ1>θc일 때 전반사이다. 임계각과 전반사를 동일시하지 않는다.','\\theta_1\\;(\\mathrm{rad})','\\theta_2\\;(\\mathrm{rad})',[0,1.55]),
  make(17,'lens','얇은 렌즈의 상',['17.6'],'물체 위치가 상의 위치와 확대율을 어떻게 바꾸는가?','교재의 p·i·f 기호를 상의 거리와 확대율에 대응한다.',[c('p','물체 거리','p','m',0.05,2,0.6),c('f','초점거리','f','m',-0.5,0.5,0.2)],'\\frac1p+\\frac1i=\\frac1f,\\quad M=-i/p','얇은 렌즈·근축 광선·교재 부호 규약. f=0은 렌즈 모형 적용 불가, p=f는 유한한 상이 없어 계산을 보류한다.','p\\;(\\mathrm{m})','i\\;(\\mathrm{m})',[0.05,2]),
  make(18,'slits','이중 슬릿 간섭',['18.1','18.2'],'파장과 슬릿 간격이 밝은 무늬의 간격을 어떻게 정하는가?','광로 차이와 위상 차이를 화면의 세기에 대응한다.',[c('lambda','파장','\\lambda','nm',400,700,550),c('d','슬릿 간격','d','mm',0.05,1,0.2),c('L','화면 거리','D','m',0.5,3,1)],'\\Delta y\\simeq\\lambda D/d','결맞은 단색광·같은 슬릿 세기·원거리·작은 각 근사. D는 교재의 화면 거리이다. $I_\\circ$는 두 슬릿이 함께 만드는 최대 세기이며 원문의 한 슬릿 세기 $I_{\\max}$와 구별한다. 슬릿 폭의 회절 포락선은 이 관찰에 포함하지 않는다.','y\\;(\\mathrm{m})','I/I_\\circ',[-0.02,0.02]),
  make(19,'coulomb','쿨롱 힘',['19.3'],'거리와 전하가 힘의 부호·크기를 어떻게 정하는가?','거리의 역제곱과 두 전하의 곱을 힘에 대응한다.',[c('q1','첫 전하','q_1','μC',-5,5,1),c('q2','둘째 전하','q_2','μC',-5,5,2),c('r','거리','r','m',0.05,2,0.5)],'F=k q_1q_2/r^2','진공의 정지 점전하. 두 전하를 잇는 축에서 양수는 척력, 음수는 인력의 부호 표기이다. r=0 특이점은 범위에서 제외한다.','r\\;(\\mathrm{m})','F\\;(\\mathrm{N})',[0.05,2]),
  make(20,'field','점전하의 전기장',['20.1','20.2'],'시험 전하 없이 장의 방향과 크기를 어떻게 정하는가?','양의 반지름 축에서 전하 부호와 장 성분을 대응한다.',[c('q','원천 전하','q','μC',-5,5,1),c('r','거리','r','m',0.05,2,0.5)],'E_r=k q/r^2','진공의 정지 점전하·r>0. 양의 반지름 방향을 기준으로 부호를 표시한다. 연속 분포·쌍극자를 단일 점전하로 대체하지 않는다.','r\\;(\\mathrm{m})','E_r\\;(\\mathrm{N/C})',[0.05,2]),
  make(21,'gauss','가우스 구의 선속',['21.2','21.3'],'구의 반지름을 바꾸어도 선속이 같은 이유는 무엇인가?','장 크기와 면적의 곱을 포함 전하에 대응한다.',[c('q','포함 점전하','q','μC',-5,5,1),c('r','구 반지름','r','m',0.1,2,0.5)],'\\Phi_E=4\\pi r^2 E_r=q/\\varepsilon_\\circ','구 중심의 진공 점전하·구면 대칭. 가우스 법칙은 일반적이지만 이 곱으로 장을 구하려면 대칭이 필요하다.','r\\;(\\mathrm{m})','\\Phi_E\\;(\\mathrm{N\\,m^2/C})',[0.1,2]),
  make(22,'potential','점전하의 전위',['22.2','22.4','22.13'],'전위의 변화율은 전기장과 어떻게 연결되는가?','같은 반지름에서 전위와 반지름 방향 전기장을 별도 단위로 비교한다.',[c('q','전하','q','μC',-5,5,1),c('r','거리','r','m',0.05,2,0.5)],'V=kq/r,\\quad E_r=-dV/dr','진공·정지 점전하·무한대에서 V=0. 원점 특이점 제외. 일반 분포·유도 전기장과 구별한다.','r\\;(\\mathrm{m})','V\\;(\\mathrm{V})',[0.05,2]),
  make(23,'capacitor','축전기 저장 에너지',['23.1','23.5'],'전압과 정전용량이 전하·에너지를 어떻게 정하는가?','같은 축전기에서 전압과 전하 및 에너지를 연결한다.',[c('C','정전용량','C','μF',0.1,10,2),c('V','전압','V','V',0,20,5)],'Q=CV,\\quad U=\\frac12CV^2','정전용량 일정·선형 축전기. 유전체 파괴·프린지장·스위치에 따른 고정 Q/V 차이는 별도 관찰이 필요하다.','V\\;(\\mathrm{V})','U\\;(\\mathrm{J})',[0,20]),
  make(24,'rc','RC 충전',['24.7'],'저항과 정전용량은 충전 시간을 어떻게 정하는가?','시간상수와 축전기 전하·전류를 연결한다.',[c('R','저항','R','kΩ',0.1,10,1),c('C','정전용량','C','μF',1,1000,100),c('V','기전력','\\mathcal E','V',1,20,5),c('t','관찰 시각','t','s',0,5,0.1)],'q=C\\mathcal E(1-e^{-t/(RC)})','초기에 비충전·이상 직류 전원·일정한 R,C의 직렬 회로. 방전은 다른 초기 조건이다.','t\\;(\\mathrm{s})','q\\;(\\mathrm{C})',[0,5]),
  make(25,'magnetic','자기력의 방향 성분',['25.1','25.2'],'속도와 장 사이 각도가 힘을 어떻게 정하는가?','외적의 크기와 수직 성분을 자기력에 대응한다.',[c('q','전하','q','μC',-5,5,1),c('v','속력','v','m/s',0,100,20),c('B','자기장','B','T',0,2,0.5),c('angle','사이각','\\theta','rad',0,Math.PI,Math.PI/2)],'\\vec F=q\\vec v\\times\\vec B','비상대론적 점전하·균일한 자기장. 그래프의 부호는 외적 기준축 성분이며 크기 자체는 음수가 아니다. 자기력은 속도에 수직이다.','\\theta\\;(\\mathrm{rad})','F_\\perp\\;(\\mathrm{N})',[0,Math.PI]),
  make(26,'wire','긴 직선 전류의 자기장',['26.1','26.3'],'거리와 전류는 원주 방향 장을 어떻게 정하는가?','원주 대칭과 역거리 장을 연결한다.',[c('I','전류','I','A',-10,10,2),c('r','거리','r','m',0.01,1,0.1)],'B_\\varphi=\\mu_\\circ I/(2\\pi r)','진공의 충분히 긴 직선 도선·정상 전류·도선 밖. 원주 방향 부호는 전류 방향과 오른손 규칙으로 정한다.','r\\;(\\mathrm{m})','B_\\varphi\\;(\\mathrm{T})',[0.01,1]),
  make(27,'induction','변하는 선속과 기전력',['27.1','27.3'],'선속이 가장 클 때와 기전력이 가장 클 때는 왜 다른가?','정현파 선속의 시간 변화율과 유도 기전력을 별도 그래프에 연결한다.',[c('N','감은 수','N','1',1,100,10),c('flux','선속 진폭','\\Phi_\\circ','Wb',0.001,0.1,0.01),c('f','진동수','f','Hz',0.1,5,1),c('t','관찰 시각','t','s',0,2,0.25)],'\\mathcal E=-N\\frac{d\\Phi_B}{dt}','각 감김에 같은 선속, 고정된 N, ΦB=Φ◦cos(2πft). 렌츠 부호는 선택한 면 법선과 양의 순환 방향에 대응한다.','t\\;(\\mathrm{s})','\\mathcal E\\;(\\mathrm{V})',[0,2]),
  make(28,'rlc','직렬 교류 공명',['28.8','28.9'],'리액턴스의 차이는 전류와 공명을 어떻게 정하는가?','같은 각주파수에서 임피던스·위상·전류를 대응한다.',[c('R','저항','R','Ω',1,100,10),c('L','인덕턴스','L','H',0.01,1,0.1),c('C','정전용량','C','μF',1,1000,100),c('V','전압 진폭','V_\\circ','V',1,20,5),c('omega','각주파수','\\omega','rad/s',1,1500,316)],'Z=\\sqrt{R^2+(\\omega L-1/(\\omega C))^2}','직렬·이상 집중소자·정현파 정상상태·전압 진폭 고정. 전류 공명은 XL=XC이며 감쇠 자유진동수와 구별한다.','\\omega\\;(\\mathrm{rad/s})','I_\\circ\\;(\\mathrm{A})',[1,1500]),

  make(14,'damped-motion','감쇠 운동의 세 조건',['14.2'],'감쇠가 달라지면 진동과 평형 복귀는 어떻게 구별되는가?','같은 초기 변위·초기 속도에서 감쇠 조건과 변위 곡선을 대응한다.',[c('m','질량','m','kg',0.1,5,1),c('k','용수철 상수','k_H','N/m',0.5,20,4),c('b','감쇠 계수','b','kg/s',0,20,1),c('t','관찰 시각','t','s',0,8,1)],'m\\frac{d^2x}{dt^2}+b\\frac{dx}{dt}+k_Hx=0','선형 복원력·속도 비례 저항. x(0)=0.2 m, v(0)=0을 고정한다. 초기조건을 맞춘 해이며 위상 0인 감쇠 코사인과 같은 초기조건으로 처리하지 않는다.','t\\;(\\mathrm{s})','x\\;(\\mathrm{m})',[0,8],'감쇠 운동의 세 조건은 미분방정식의 해로 비교한다. 임계값의 수치 판단에는 상대 허용오차를 적용하며 그림의 유한 표본을 증명으로 처리하지 않는다.'),
  make(28,'damped-charge','RLC 자유 감쇠',['28.6'],'저항이 커지면 전하 진동은 어떤 조건에서 사라지는가?','기계적 감쇠와 같은 방정식 구조를 전하의 시간 변화에 대응한다.',[c('R','저항','R','Ω',0,200,10),c('L','인덕턴스','L','H',0.01,1,0.1),c('C','정전용량','C','μF',1,1000,100),c('t','관찰 시각','t','s',0,0.1,0.02)],'L\\frac{d^2q}{dt^2}+R\\frac{dq}{dt}+\\frac qC=0','외부 전원 없는 이상 직렬 RLC. q(0)=1 μC, I(0)=0, 교재의 $I=-dq/dt$를 사용한다. $R_c=2\\sqrt{L/C}$. 자유 감쇠와 교류 정상상태 공명을 구별한다.','t\\;(\\mathrm{s})','q\\;(\\mathrm{C})',[0,0.1],'교재 28.6의 기계·전기 대응을 사용한다. 과감쇠를 허수 진동수 때문에 불가능한 운동이라고 판정하지 않는다.'),
];
export const physicsObservations: PhysicsObservation[] = physicsObservationDefinitions.map(item => {
  const source = physicsSourceLinks.find(link => link.observations.includes(item.id) && link.printed !== null);
  return item.evidence || !source ? item : { ...item, evidence: { pdf: source.pdf, printed: source.printed!, kind: 'reviewed-selected-source-relation' } };
});
export const observationById = (id: string) => physicsObservations.find(item => item.id === id);
export const initialValues = (item: PhysicsObservation) => Object.fromEntries(item.controls.map(field => [field.key, field.initial]));
export type PhysicsValues = Record<string, number>;
const R = 8.314462618, ke = 8.9875517923e9, epsilon = 8.8541878128e-12;
export function dampingRegime(gamma:number,omegaSquared:number):'under'|'critical'|'over' {
  const delta=omegaSquared-gamma*gamma,tol=32*Number.EPSILON*Math.max(omegaSquared,gamma*gamma);
  return Math.abs(delta)<=tol?'critical':delta>0?'under':'over';
}
/** Stable homogeneous solution with q(0)=amplitude, q'(0)=0. */
export function dampedValue(gamma:number,omegaSquared:number,t:number,amplitude:number):number {
  const regime=dampingRegime(gamma,omegaSquared);
  if(regime==='critical')return amplitude*Math.exp(-gamma*t)*(1+gamma*t);
  if(regime==='under'){const w=Math.sqrt(omegaSquared-gamma*gamma);return amplitude*Math.exp(-gamma*t)*(Math.cos(w*t)+gamma/w*Math.sin(w*t));}
  const d=Math.sqrt(gamma*gamma-omegaSquared),r1=-omegaSquared/(gamma+d),r2=-gamma-d;
  return amplitude*((-r2)*Math.exp(r1*t)+r1*Math.exp(r2*t))/(r1-r2);
}
export function evaluatePhysics(item: PhysicsObservation, p: PhysicsValues, x: number): number | null {
  let value: number;
  switch (item.engine) {
    case 'dot': value=p.A*p.B*Math.cos(x); break;
    case 'motion': value=p.x0+p.v0*x+p.a*x*x/2; break;
    case 'velocity': value=p.v0+p.a*x;break;
    case 'cross': value=p.A*p.B*Math.sin(x);break;
    case 'shm-velocity': value=-p.A*Math.sqrt(p.k/p.m)*Math.sin(Math.sqrt(p.k/p.m)*x);break;
    case 'charge': value=p.C*1e-6*x;break;
    case 'rc-current': value=p.V/(p.R*1e3)*Math.exp(-x/(p.R*1e3*p.C*1e-6));break;
    case 'damped-motion': value=dampedValue(p.b/(2*p.m),p.k/p.m,x,0.2);break;
    case 'damped-charge': value=dampedValue(p.R/(2*p.L),1/(p.L*p.C*1e-6),x,1e-6);break;
    case 'projectile': { const t=x*2*p.v*Math.sin(p.angle)/9.81; value=p.v*Math.sin(p.angle)*t-9.81*t*t/2; break; }
    case 'force': value=p.F/x; break;
    case 'energy': value=p.k*x*x/2; break;
    case 'collision': { const v1=(p.m1*p.u1+p.m2*p.u2-p.m2*x*(p.u1-p.u2))/(p.m1+p.m2),v2=(p.m1*p.u1+p.m2*p.u2+p.m1*x*(p.u1-p.u2))/(p.m1+p.m2);value=(p.m1*v1*v1+p.m2*v2*v2)/2;break; }
    case 'torque': value=p.r*p.F*Math.sin(x);break;
    case 'angular': value=p.L/x;break;
    case 'pressure': value=p.rho*9.81*x;break;
    case 'gas': case 'isothermal': value=p.n*R*p.T/x;break;
    case 'maxwell': { const v2=R*p.T/p.M;value=4*Math.PI*(1/(2*Math.PI*v2))**1.5*x*x*Math.exp(-x*x/(2*v2));break; }
    case 'wave': value=p.A*Math.sin(2*Math.PI*x/p.lambda-2*Math.PI*p.f*p.t);break;
    case 'wave-time': value=-p.A*Math.sin(2*Math.PI*p.f*x);break;
    case 'shm': value=p.A*Math.cos(Math.sqrt(p.k/p.m)*x);break;
    case 'sound': value=10*x;break;
    case 'beats': value=Math.sin(2*Math.PI*p.f1*x)+Math.sin(2*Math.PI*p.f2*x);break;
    case 'snell': {const s=p.n1*Math.sin(x)/p.n2;return Math.abs(s)>1+8*Number.EPSILON?null:Math.asin(Math.max(-1,Math.min(1,s)));}
    case 'lens': return p.f===0 || x===p.f ? null : p.f*x/(x-p.f);
    case 'slits': value=Math.cos(Math.PI*(p.d*1e-3)*x/((p.lambda*1e-9)*p.L))**2;break;
    case 'coulomb': value=ke*p.q1*p.q2*1e-12/(x*x);break;
    case 'field': value=ke*p.q*1e-6/(x*x);break;
    case 'gauss': value=p.q*1e-6/epsilon;break;
    case 'potential': value=ke*p.q*1e-6/x;break;
    case 'capacitor': value=p.C*1e-6*x*x/2;break;
    case 'rc': value=p.C*1e-6*p.V*(-Math.expm1(-x/(p.R*1e3*p.C*1e-6)));break;
    case 'magnetic': value=p.q*1e-6*p.v*p.B*Math.sin(x);break;
    case 'wire': value=2e-7*p.I/x;break;
    case 'induction': if(!Number.isInteger(p.N))return null;value=p.N*p.flux*2*Math.PI*p.f*Math.sin(2*Math.PI*p.f*x);break;
    case 'flux': value=p.flux*Math.cos(2*Math.PI*p.f*x);break;
    case 'rlc': value=p.V/Math.hypot(p.R,x*p.L-1/(x*p.C*1e-6));break;
    default: return additionalPhysics(item,p,x);
  }
  return Number.isFinite(value)?value:null;
}
export function selectedAbscissa(item: PhysicsObservation,p:PhysicsValues) {
  if(item.engine==='standing')return 0;
  if(item.abscissa)return p[item.abscissa];
  return ({dot:p.angle,cross:p.angle,motion:p.t,velocity:p.t,'shm-velocity':p.t,'damped-motion':p.t,'damped-charge':p.t,charge:p.V,'rc-current':p.t,projectile:0.5,force:p.m,energy:p.r*p.A,collision:p.e,torque:p.angle,angular:p.I,pressure:p.h,gas:p.V,isothermal:0.025*p.ratio,maxwell:Math.sqrt(3*R*p.T/p.M),wave:0,'wave-time':p.t,shm:p.t,sound:Math.log10(p.ratio),beats:0.5,snell:p.angle,lens:p.p,slits:0,coulomb:p.r,field:p.r,gauss:p.r,potential:p.r,capacitor:p.V,rc:p.t,magnetic:p.angle,wire:p.r,induction:p.t,flux:p.t,rlc:p.omega} as Record<string,number>)[item.engine];
}
/** Second representations reuse the renderer while keeping different units and views separate. */
export function secondaryPhysics(item:PhysicsObservation):PhysicsObservation|undefined {
  const extra:Record<string,Partial<PhysicsObservation>>={
    'kinematic-velocity':{engine:'kinematic-acceleration',name:'같은 시각의 가속도',y:'a\\;(\\mathrm{m/s^2})'},
    'drag-quadratic':{engine:'drag-quadratic-acceleration',name:'같은 시각의 가속도',y:'a\\;(\\mathrm{m/s^2})'},
    'em-plane-electric':{engine:'em-plane-magnetic',name:'같은 위치·시각의 자기장',y:'B_z\\;(\\mathrm T)'},
    'solid-sphere-potential':{engine:'solid-sphere-field',name:'같은 반지름의 체적 전하 구 전기장',y:'E_r\\;(\\mathrm{N/C})'},
    'drag-linear':{engine:'drag-acceleration',name:'같은 시각의 가속도',y:'a\\;(\\mathrm{m/s^2})'},
    'induced-electric':{engine:'induced-flux-rate',name:'같은 경로의 자기 선속 변화율',y:'d\\Phi_B/dt\\;(\\mathrm{Wb/s})'},
    dot:{engine:'cross',name:'같은 각도의 외적 크기',y:'|\\vec A\\times\\vec B|'},
    shm:{engine:'shm-velocity',name:'같은 시각의 속도',y:'v\\;(\\mathrm{m/s})'},
    capacitor:{engine:'charge',name:'같은 전압의 전하',y:'Q\\;(\\mathrm{C})'},
    rc:{engine:'rc-current',name:'같은 시각의 전류',y:'I\\;(\\mathrm{A})'},
    motion:{engine:'velocity',name:'같은 시각의 속도',y:'v\\;(\\mathrm{m/s})'},
    wave:{engine:'wave-time',name:'같은 위치의 시간 변화',x:'t\\;(\\mathrm{s})',y:'y(0,t)\\;(\\mathrm{m})',extent:[0,2]},
    potential:{engine:'field',name:'같은 반지름의 전기장',y:'E_r\\;(\\mathrm{N/C})'},
    induction:{engine:'flux',name:'같은 시각의 자기 선속',y:'\\Phi_B\\;(\\mathrm{Wb})'},
  };
  return extra[item.engine]?{...item,...extra[item.engine],id:`${item.id}:secondary`}:undefined;
}
export function observationReadout(item:PhysicsObservation,p:PhysicsValues,condition='zero'): { tex:string; message:string } {
  const x=selectedAbscissa(item,p), y=evaluatePhysics(item,p,x), f=(n:number)=>Number.isFinite(n)?Math.abs(n)>0&&Math.abs(n)<0.01 ? `${Number((n/10**Math.floor(Math.log10(Math.abs(n)))).toFixed(2))}\\times10^{${Math.floor(Math.log10(Math.abs(n)))}}` : String(Number(n.toFixed(2))):'\\text{정의 불가}';
  if(item.engine==='kinematic-velocity') {
    const v=p.v0+p.a0*p.t+p.j*p.t*p.t/2,a=p.a0+p.j*p.t,position=p.x0+p.v0*p.t+p.a0*p.t*p.t/2+p.j*p.t**3/6;
    const message=v===0?'현재 순간 정지이다. 이 한 값만으로 방향 전환을 확정하지 않는다. 앞뒤 속도의 부호를 비교한다.':v*a>0?'속도와 가속도의 부호가 같아 현재 속력이 증가한다.':v*a<0?'속도와 가속도의 부호가 달라 현재 속력이 감소한다.':'현재 순간 속력의 변화율은 0이다. 이 한 순간을 전체 구간의 등속 운동으로 확대하지 않는다.';
    return {tex:`x=${f(position)}\\,\\mathrm m,\\quad v=${f(v)}\\,\\mathrm{m/s},\\quad a=${f(a)}\\,\\mathrm{m/s^2}`,message:message+' 그래프는 v와 a를 단위가 다른 두 세로축에 분리한다. 부호 판단에는 반올림 전의 계산값을 사용한다.'};
  }
  if(item.engine==='drag-quadratic') {
    const vt=Math.sqrt(2*p.m*9.81/(p.Cd*p.rho*p.area));
    return {tex:`v=${f(y!)}\\,\\mathrm{m/s},\\quad v_t=${f(vt)}\\,\\mathrm{m/s}`,message:'선형 항력의 종단 속도 mg/b와 구별한다. 아래를 양으로 잡았으며 부력과 다른 힘은 제외한다. C 일정의 제곱 항력 모형을 택한 계산이다. 실제 유동 범위·항력 계수의 측정을 입증하지 않는다.'};
  }
  if(item.engine==='em-plane-electric') {
    const speed=1/Math.sqrt(4*Math.PI*1e-7*epsilon),time=p.phase*p.wavelength/speed;
    return {tex:`E_y=${f(y!)}\\,\\mathrm{V/m},\\quad B_z=${f(y!/speed)}\\,\\mathrm T,\\quad t=${f(time*1e9)}\\,\\mathrm{ns}`,message:'진공의 한 평면파를 선택해 E는 y방향, B는 z방향, 전파는 +x방향으로 둔다. E와 B는 같은 위상이며 세로축 단위와 크기가 다르다. E=cB는 이 파에 적용한 교재 밖 유도 설명이고, 정전장과 임의 장에 그대로 적용하지 않는다. 시간비를 직접 조절하며 자동 재생하지 않는다.'};
  }
  if(item.engine==='damped-motion'||item.engine==='damped-charge') {
    const mechanical=item.engine==='damped-motion',gamma=mechanical?p.b/(2*p.m):p.R/(2*p.L),w2=mechanical?p.k/p.m:1/(p.L*p.C*1e-6),kind=dampingRegime(gamma,w2),names={under:'부족 감쇠',critical:'임계 감쇠',over:'과감쇠'};
    return {tex:`\\text{${names[kind]}},\\quad ${mechanical?'x':'q'}=${f(y!)}\\,\\mathrm{${mechanical?'m':'C'}}`,message:`${mechanical?'b_c=2√(mk_H)':'R_c=2√(L/C)'} = ${f(mechanical?2*Math.sqrt(p.m*p.k):2*Math.sqrt(p.L/(p.C*1e-6)))}. 이 임계 기준과 현재 감쇠 계수를 비교한다. 과감쇠에서는 비진동 지수 해를 사용한다.`};
  }
  if(item.engine==='collision') {
    const v1=(p.m1*p.u1+p.m2*p.u2-p.m2*p.e*(p.u1-p.u2))/(p.m1+p.m2),v2=(p.m1*p.u1+p.m2*p.u2+p.m1*p.e*(p.u1-p.u2))/(p.m1+p.m2);
    return {tex:`v_{1f}=${f(v1)}\\,\\mathrm{m/s},\\quad v_{2f}=${f(v2)}\\,\\mathrm{m/s},\\quad p_i=p_f=${f(p.m1*p.u1+p.m2*p.u2)}\\,\\mathrm{kg\\,m/s},\\quad K_i=${f((p.m1*p.u1**2+p.m2*p.u2**2)/2)}\\,\\mathrm J,\\quad K_f=${f(y!)}\\,\\mathrm J`,message:'질점 충돌에서 운동량은 보존한다. e=1일 때 운동에너지까지 보존하고, e<1일 때 감소한다. 접촉 직전의 충돌이 가능한 접근 상태인지 이 비교식만으로 판단하지 않는다.'};
  }
  if(item.engine==='kirchhoff-branches'&&y!==null)return {tex:`V=${f(y)}\\,\\mathrm V,\\quad I_1=${f((p.E1-y)/p.R1)}\\,\\mathrm A,\\quad I_2=${f((p.E2-y)/p.R2)}\\,\\mathrm A,\\quad I_3=${f(y/p.R3)}\\,\\mathrm A`,message:'I₁과 I₂는 접점으로 들어오는 방향, I₃는 나가는 방향으로 정했다. 음의 전류는 처음 방향의 반대이며 I₁+I₂=I₃를 만족한다.'};
  if(item.engine==='motion')return {tex:`x=${f(y!)}\\,\\mathrm m,\\quad v=${f(p.v0+p.a*p.t)}\\,\\mathrm{m/s}`,message:'위치와 속도는 서로 다른 단위이므로 별도 세로축에서 읽는다.'};
  if(item.engine==='energy')return condition!=='zero'?{tex:'\\text{속력 계산 보류}',message:condition==='unknown'?'비보존력이 한 일을 확인하지 않아 보존식 적용을 보류한다.':'비보존력이 한 순일이 0이 아니므로 보존식만으로 속력을 정하지 않는다. U 계산은 유지한다.'}:{tex:`U=${f(y!)}\\,\\mathrm J,\\quad K=${f(p.k*p.A*p.A/2-y!)}\\,\\mathrm J,\\quad |v|=${f(Math.sqrt(p.k*(p.A*p.A-x*x)/p.m))}\\,\\mathrm{m/s}`,message:'비보존력이 한 순일 0인 조건에서만 계산한 속력이다. 속도의 방향은 이 에너지 식만으로 결정하지 않는다.'};
  if(item.engine==='snell')return {tex:y===null?'\\text{전반사}':`\\theta_2=${f(y)}\\,\\mathrm{rad}`,message:y===null?'n₁>n₂, θ₁>θc에서 굴절광선 계산을 보류한다.':`임계각 ${p.n1>p.n2?f(Math.asin(p.n2/p.n1))+' rad':'없음 (n₁≤n₂)'}.`};
  if(item.engine==='lens'||item.engine==='mirror')return {tex:y===null?'\\text{유한한 상 계산 보류}':`i=${f(y)}\\,\\mathrm m,\\quad M=${f(-y/p.p)}`,message:p.f===0?'f=0은 얇은 렌즈 모형의 유효 초점거리로 사용하지 않는다.':y===null?'p=f에서는 평행 광선이 나가며 유한한 상거리를 정할 수 없다.':'상거리 부호와 확대율 부호를 각각 보존한다.'};
  if(item.engine==='wave')return {tex:`v=${f(p.lambda*p.f)}\\,\\mathrm{m/s},\\quad y(0,t)=${f(y!)}\\,\\mathrm m`,message:'파동의 진행 속력과 매질의 순간 변위는 다른 물리량이다.'};
  if(item.engine==='shm')return {tex:`\\omega=${f(Math.sqrt(p.k/p.m))}\\,\\mathrm{rad/s},\\quad T=${f(2*Math.PI*Math.sqrt(p.m/p.k))}\\,\\mathrm s`,message:'감쇠가 없는 용수철의 각진동수 ω를 사용한다.'};
  if(item.engine==='beats') {
    const delta=Math.abs(p.f1-p.f2),average=(p.f1+p.f2)/2,relative=delta/(p.f1+p.f2);
    return {tex:`f_{\\mathrm{beat}}=${f(delta)}\\,\\mathrm{Hz},\\quad f_{av}=${f(average)}\\,\\mathrm{Hz}`+(delta>0?`,\\quad T_{\\mathrm{beat}}=${f(1/delta)}\\,\\mathrm s`:''),message:(delta===0?'두 주파수가 같아 맥놀이의 유한 반복 주기는 없다. 원래 진동은 계속된다.':`주파수 차이/합은 ${relative.toPrecision(3)}이다. 교재의 느린 맥놀이에는 이 비가 1보다 충분히 작아야 한다. `+(relative>=.1?'현재는 느린 변화 해석에 주의가 필요한 비교이다. 0.1은 안내를 위한 설계 기준이며 물리적 경계나 합성파의 불가능을 뜻하지 않는다.':'두 사인파의 합과 느린 진폭 변화를 함께 비교한다.'))+' 원문은 초기 위상 0인 cosine 두 파를 쓰며 현재 그래프는 sine 두 파를 선택했다. 맥놀이 주파수는 공유하지만 초기 파형의 위상은 다르다. 맥놀이만으로 어느 주파수가 더 높은지 정할 수 없다.'};
  }
  if(item.engine==='isothermal')return {tex:`W=Q=${f(p.n*R*p.T*Math.log(p.ratio))}\\,\\mathrm J,\\quad\\Delta E_{\\mathrm{int}}=0`,message:'팽창에서 W>0, 압축에서 W<0이다. 곡선 전체가 아니라 선택한 두 부피 사이의 적분이다.'};
  if(item.engine==='rlc')return {tex:`I_\\circ=${f(y!)}\\,\\mathrm A,\\quad\\omega_\\circ=${f(1/Math.sqrt(p.L*p.C*1e-6))}\\,\\mathrm{rad/s}`,message:'전압 진폭을 고정한 전류 공명이다. 자유 감쇠 진동의 ωd와 구별한다.'};
  return {tex:y===null?'\\text{계산 보류}':`${item.y.split('\\;')[0]}=${f(y)}${item.y.includes('\\;(\\mathrm{')?'\\,\\mathrm{'+item.y.split('\\;(\\mathrm{')[1].slice(0,-2)+'}':''}`,message:item.limits};
}
export function samplePhysics(item:PhysicsObservation,p:PhysicsValues) {
  const extent: [number,number]=item.engine==='energy'?[-p.A,p.A]:item.extent;
  const width=extent[1]-extent[0];
  const omega=item.engine==='lc-charge'?1/Math.sqrt(p.L*p.C*1e-6):item.engine==='damped-charge'?Math.sqrt(1/(p.L*p.C*1e-6)):0;
  const count=Math.max(501,Math.min(12001,Math.ceil(width*omega/(2*Math.PI)*24)+1));
  let abscissae=Array.from({length:count},(_,i)=>extent[0]+width*i/(count-1));
  const tau=['rc','rc-current'].includes(item.engine)?p.R*1e3*p.C*1e-6:item.engine==='rc-discharge'?p.R*p.C*1e-6:['lr-growth','lr-decay'].includes(item.engine)?p.L/p.R:['drag-linear','drag-acceleration'].includes(item.engine)?p.m/p.b:0;
  if(tau>0&&12*tau<width)abscissae=[...new Set([...abscissae,...Array.from({length:241},(_,i)=>extent[0]+12*tau*i/240)])].sort((a,b)=>a-b);
  if(['solid-sphere-field','solid-sphere-potential','induced-electric','induced-flux-rate'].includes(item.engine))abscissae=[...new Set([...abscissae,p.radius])].sort((a,b)=>a-b);
  const points=abscissae.map(x=>({x:item.engine==='projectile'?x*2*p.v*p.v*Math.sin(p.angle)*Math.cos(p.angle)/9.81:x,y:evaluatePhysics(item,p,x)}));
  // A lens asymptote is a gap, never a drawn segment connecting opposite infinities.
  if(item.engine==='lens'||item.engine==='mirror')for(let i=1;i<points.length;i++)if((points[i-1].x-p.f)*(points[i].x-p.f)<=0)points[i].y=null;
  if(item.engine==='sphere-field')for(let i=1;i<points.length;i++)if((points[i-1].x-p.radius)*(points[i].x-p.radius)<=0)points[i].y=null;
  return points;
}
export type PhysicsMapping = { id:string; chapter:number; title:string; printed:number; pdf:number; classification:string; reason:string; observations:string[]; question:string; sourceScope:string; representation:string; conditions:string };
const staticSections = new Set(['1.1','1.2','1.3','2.1','19.1','19.2']);
const plans:Record<string,{question:string;representation:string;conditions:string;status:string}>=sectionPlans;
const exact = new Set(['2.4','3.5','4.2','6.5','8.6','9.2','11.3','13.3','14.1','14.2','14.3','15.4','16.5','19.3','20.2','22.4','24.7','28.6','28.9']);
export const physicsMapping:PhysicsMapping[] = physicsCatalog.chapters.flatMap(chapter=>chapter.sections.map(section=>{
  const observations=physicsObservations.filter(item=>item.sections.includes(section.section)),plan=plans[section.id];
  return {id:section.id,chapter:chapter.chapter,title:section.ko,printed:section.printed,pdf:section.pdf,observations:observations.map(item=>item.id),classification:staticSections.has(section.section)?'정적 설명 적합':physicsConceptReading(section.id)?.coverage==='previous-structured-reading'?'기존 틀로 대응':observations.length?(exact.has(section.section)?'기존 틀로 대응':'부분 대응'):'추가 구현 필요',reason:physicsConceptReading(section.id)?'절별 비교/과정 읽기 관찰을 구현했다. 원문 페이지·선택·조건 메모를 기기에 보관하며 해당 해설의 적용 한계는 화면에 유지한다. 정량 계산이 없는 항목을 계산 시뮬레이션 완료로 처리하지 않는다.':staticSections.has(section.section)?'단위·기준·정의·대전 구별은 기존 읽기 설명과 원문으로 연결한다. 불필요한 연속값 조절을 강제하지 않는다.':observations.length?(exact.has(section.section)?'기존 관계 탐색/조건 판단 틀을 재사용한다. 이 절의 연결된 핵심 관계만 구현했으며 모든 본문 사례·논증의 재현은 아니다.':'핵심 관계 읽기와 계산을 연결했다. 일반 조건·다른 계·본문 논증의 재현은 별도 범위로 보존한다.'):`절 고유의 질문과 ${plan?.representation??'필요한 표현'}은 대응 설계로 연결했다. 계산·조작 구현은 아직 없다.`,question:plan?.question??observations[0]?.question??chapter.question,representation:plan?.representation??observations.map(o=>o.relation).join(' / '),conditions:plan?.conditions??observations.map(o=>o.conditions).join(' / '),sourceScope:'관찰 질문·표현 계획은 설계 보충이며 교재의 원문 인용이 아니다. 절 시작 쪽 연결과 모형의 가정을 구별한다.'};
}));
