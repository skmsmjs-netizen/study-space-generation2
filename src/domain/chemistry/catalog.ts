import source from './source.json' with { type: 'json' };
import { modelsForSection } from './model';
export const CHEMISTRY = source;
export type ChemistrySection = typeof source.sections[number];
export const sectionById = (id: string) => source.sections.find(s => s.id === id);
export const byNumber = (n: string) => source.sections.find(s => s.section === n);
export const MOLECULES = [
 {id:'water',name:'H₂O',domains:4,lone:2,electron:'사면체',shape:'굽은 모양',angle:'약 104.5°',dipole:'분자의 쌍극자는 상쇄되지 않는다.',formula:'\\mathrm{H_2O}',coords:[[100,190],[210,100],[320,190]],atoms:['H','O','H']},
 {id:'carbon-dioxide',name:'CO₂',domains:2,lone:0,electron:'선형',shape:'선형',angle:'180°',dipole:'두 C=O 결합의 쌍극자는 대칭 배치에서 상쇄된다.',formula:'\\mathrm{CO_2}',coords:[[70,140],[210,140],[350,140]],atoms:['O','C','O']},
 {id:'ammonia',name:'NH₃',domains:4,lone:1,electron:'사면체',shape:'삼각뿔',angle:'약 107°',dipole:'쌍극자가 상쇄되지 않는다.',formula:'\\mathrm{NH_3}',coords:[[110,200],[210,80],[310,200],[210,220]],atoms:['H','N','H','H']},
];
export const PROCEDURES: Record<string, string[]> = {
 '2.10':['화학식을 유지하고 반응 전후 각 원소의 원자 수를 센다.','원소의 원자 수가 같아지도록 반응식 계수를 정한다. 화학식의 아래첨자를 바꾸지 않는다.','각 원소와 전하가 보존되는지 확인하고 계수를 가장 작은 정수비로 표시한다.'],
 '6.7':['구하려는 반응식을 기준으로 알려진 열화학 반응식을 선택한다.','반응을 뒤집으면 ΔH의 부호를 바꾸고 계수를 배로 하면 ΔH도 배로 한다.','중간 물질을 소거해 목표 반응식을 만든 뒤 ΔH를 더한다. 계수·상태를 함께 보존한다.'],
 '13.8':['제안된 단일단계 반응들을 더해 전체 반응과 중간체 소거를 확인한다.','빠른 평형 또는 속도 결정 단계라는 가정에 따라 예측 속도식을 얻는다.','측정 속도식과 비교한다. 일치만으로 유일한 메커니즘이 증명되는 것은 아니다.'],
 '19.1':['산화와 환원 반쪽반응을 나눈다.','산성 용액이면 H₂O와 H⁺, 전자로 원자·전하를 맞춘다. 염기성이면 OH⁻ 처리와 소거를 추가한다.','전자 수를 같게 해 더하고 양쪽에서 같은 항을 지운다. 모든 원자·전하가 보존되는지 확인한다.'],
 '20.2':['핵종을 질량수 A와 원자번호 Z로 표시한다.','반응식 양쪽의 A와 Z 합을 각각 맞춘다.','보존식으로 남은 핵종을 찾는다. 이것만으로 반응의 에너지 가능성이나 실제 발생을 증명하지 않는다.'],
 '24.4':['DNA의 염기 배열과 방향을 먼저 확인한다.','상보적인 염기 대응과 역평행 방향을 구별한다. RNA를 읽을 때는 T와 U를 구별한다.','전사·번역에서는 염기 배열, mRNA 코돈, tRNA 안티코돈, 아미노산의 역할을 서로 대응시킨다.'],
};
export function mapping(s: ChemistrySection) {
 if(['5.6','11.7','11.8','19.2','20.7','22.5'].includes(s.section))return {status:'부분 대응',reason:'대표 관계·비교·조건·단계 관찰을 연결했다. 해당 절의 전체 그림·반응계·공간 및 시간 계산 엔진은 포괄하지 않는다.',kind:'specialist',models:[]};
 const models=modelsForSection(s.section);
 if(models.length) return {status:'부분 대응',reason:'허용된 수식의 조건·조절·계산을 연결했다. 해당 절의 모든 예시·반응계·수식은 포괄하지 않는다.',kind:'calculation',models:models.map(m=>m.id)};
 if(['10.1','10.2'].includes(s.section))return {status:'부분 대응',reason:'H₂O·CO₂·NH₃의 전자 영역·분자 모양·쌍극자 대응을 연결했다. 임의 분자의 3D·전자구조 계산은 지원하지 않는다.',kind:'molecule',models:[]};
 if(PROCEDURES[s.section])return {status:'부분 대응',reason:'교재의 방법 순서와 단계별 판단을 연결했다. 임의 반응식의 자동 해법은 지원하지 않는다.',kind:'steps',models:[]};
 if(s.observation_code==='S')return {status:'정적 설명 적합',reason:s.observation_reason,kind:'static',models:[]};
 return {status:s.observation_code==='X'?'추가 구현 필요':'부분 대응',reason:s.observation_code==='X'?'원문의 공간·동적 대상을 정확하게 표현할 전문 관찰 구성이 필요하다. 현재는 정의·조건과 대응 명세를 읽는다.':'원문 근거의 지도 관계를 선택해 구조·문장·조건·재사용 항목을 함께 읽는다. 해당 절의 모든 수식·그림에 대한 전문 계산·공간·분기 구성은 포괄하지 않는다.',kind:'reference',models:[]};
}
