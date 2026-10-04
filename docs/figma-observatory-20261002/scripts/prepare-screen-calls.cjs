/* Read-only source inventory -> deterministic Figma builder inputs.
 * No Figma call, application modification, private record access, or package install.
 * Usage: node scripts/prepare-screen-calls.cjs --button-primary ID --button-quiet ID --world 10:68
 * --check validates without writing. --no-pack writes inputs but does not run pack-call.cjs.
 */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const repo = path.resolve(root, '../..');
const argv = process.argv.slice(2);
const arg = (name, fallback) => { const i = argv.indexOf(name); return i < 0 ? fallback : argv[i + 1]; };
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const inventory = read('screen-inventory.json');
const foundations = read('evidence/foundations.json');
const design = read('design-foundations.json');
const output = path.resolve(arg('--output', path.join(root, 'prepared-screens')));
const pageKeys = { desk: 'desk', shelf: 'library', workbench: 'workbench', wall: 'wall', common: 'global' };
const pages = { desk: '7:71', library: '7:72', workbench: '7:73', wall: '7:74', global: '7:75' };
const profiles = [
  { key: 'ipad-landscape', label: 'iPad Pro 13인치 가로', width: 1376, height: 1032, scale: 2 },
  { key: 'iphone-portrait', label: 'iPhone 17 Pro 세로', width: 402, height: 681, scale: 3 },
  { key: 'iphone-landscape', label: 'iPhone 17 Pro 가로', width: 756, height: 352, scale: 3 },
  { key: 'ipad-portrait', label: 'iPad Pro 13인치 세로', width: 1032, height: 1376, scale: 2 },
  { key: 'ipad-narrow', label: 'iPad Pro 13인치 좁은 창', width: 517, height: 1200, scale: 2 },
];
const reusable = {
  buttonPrimary: arg('--button-primary', process.env.BUTTON_PRIMARY_ID || '16:76'),
  buttonQuiet: arg('--button-quiet', process.env.BUTTON_QUIET_ID || '16:108'),
  world: arg('--world', process.env.WORLD_ASSET_ID || '10:68'),
};
const entities = [...inventory.routes, ...inventory.overlays, ...inventory.surfaces];
const byId = Object.fromEntries(entities.map(e => [e.id, e]));
const sourceString = e => {
  const refs = e.source ? [e.source] : (e.sources || []);
  return refs.map(s => typeof s === 'string' ? s : `${s.path}:${s.line || 1} · ${s.export || 'module'}`).join(' / ');
};
// These are traceable correspondences, not claims that Figma nodes already exist.
const linkedSurfaces = {
  U05: [{ modal: '내 계정' }], U06: [{ modal: '가입 계정 관리' }], U07: [{ modal: '내 기록의 저장 상태' }],
  U11: [{ target: 'R01-B01' }], U12: [{ target: 'U11', reason: '풍경 안의 렌더러 부품; 독립 과업 화면이 아님' }],
  U13: [{ target: 'R01-B02' }], U15: [{ modal: '이 주제부터 해볼까요?' }],
  U16: [{ target: 'R19-B01' }, { target: 'R20-B01' }],
  U17: [{ modal: '공부할 목차 만들기' }, { modal: '사진으로 목차·내용 가져오기' }],
  U18: [{ modal: '강의 주차 만들기' }], U19: [{ modal: '공부 기준 조정' }, { target: 'R05-B03' }],
  U20: [{ modal: '답안에서 수행 결과 남기기' }], U21: [{ modal: '시험·과제·강의 일정' }],
  U22: [{ modal: '다음에 확인할 내용' }, { modal: '학기 기간' }, { modal: '지금 확인한 결과' }],
  U23: [{ target: 'R07-B03' }], U25: [{ target: 'R12-B04' }, { target: 'R08-B06' }],
  U28: [{ target: 'R11-B03' }], U29: [{ target: 'R06-B03' }, { target: 'R11-B04' }, { target: 'R14-B04' }],
  U30: [{ target: 'R08-B02' }, { target: 'R08-B04' }], U31: [{ target: 'R09-B03' }],
  U32: [{ target: 'R09-B04' }, { modal: '수식 탐색 전체 화면' }],
  U33: [{ target: 'R09-B05' }, { target: 'R13-B04' }], U34: [{ target: 'R15-B03' }, { target: 'R15-B06' }],
  U35: [{ target: 'R15-B05' }, { target: 'R16-B05' }],
  U36: [{ target: 'R02-B02' }, { target: 'R02-B04' }, { target: 'R02-B05' }, { target: 'R02-B06' }],
  U38: [{ modal: '움직임 위젯' }],
  U40: [{ pageId: '7:70', reason: '공통 부품·상태 페이지와 foundations/componentRegistry를 재사용; 각 부품 실제 노드 검증은 별도' }],
  U41: [{ target: 'R20-B01' }, { target: 'R30-B01' }, { target: 'R31-B01' }, { target: 'R32-B01' }],
};
const allIds = new Set(entities.flatMap(e => [e.id, ...(e.blocks || []).map(b => b.id)]));
const linkMap = [];
for (const [id, links] of Object.entries(linkedSurfaces)) {
  if (!byId[id]) throw Error('Unknown surface ' + id);
  for (const link of links) {
    if (link.modal) { const modal = inventory.overlays.find(e => e.name === link.modal); if (!modal) throw Error('Unknown modal ' + link.modal); link.target = modal.id; }
    if (link.target && !allIds.has(link.target)) throw Error('Unknown block/entity ' + link.target);
  }
  linkMap.push({ inventoryId: id, name: byId[id].name, rendering: 'reuse-linked-surface', links, source: sourceString(byId[id]), figmaNodeIds: [] });
}
const destinations = {
  '과목으로 돌아가기': 'R04', '과목 열기': 'R19', '전체 범위': 'R04', '자료 목록': 'R07',
  '강의 자료 목록': 'R07', '강의 자료 열기': 'R07', '예제 목록으로': 'R08', '통계 보기': 'R02',
  '초안 보관본': 'R35', '자유 기록 목록': 'R30', '새 자유 기록': 'R31',
  '공부 기록 남기기': 'R05', '주제 카드 펼치기': 'R14', '자유롭게 쓰기': 'R30',
  '자료에서 카드 가져오기': 'R12', '예약 복습': 'R29',
};
// Product-facing representative data. Design rationale stays outside the viewport.
const U = (fields=[], rows=[], extra={}) => ({fields:fields.map(([label,value,kind])=>({label,value,kind:kind||'input'})),rows,...extra});
const uiCatalog = {
'R01-B01':U([],[],{world:true,actions:['풍경 멈추기','풍경 고르기']}),
'R01-B02':U([],['10월 2일 금요일','오후 7:40'],{actions:[{label:'공부 기록 남기기',to:'R05'},{label:'자유롭게 쓰기',to:'R30'},{label:'주제 카드 펼치기',to:'R14'}]}),
'R01-B03':U([],['미적분 · 급수 · 10월 2일','비교 판정에서는 두 급수의 항이 음수가 아닌지 먼저 확인했다.'],{actions:[{label:'기록 열기',to:'R20'},{label:'이 주제에 새 기록',to:'R21'}]}),
'R01-B04':U([['메모','다음에는 비교 판정의 조건을 먼저 적어 보기.','textarea']],[],{actions:['메모 저장']}),
'R01-B05':U([],['미적분 / 급수','선형대수 / 선형변환'],{checks:[['급수',true],['선형변환',false]],actions:[{label:'공부함',to:'R05'},{label:'전체 범위',to:'R04'}]}),
'R01-B06':U([],[],{chart:'line',chartTitle:'공부를 남긴 회차',actions:[{label:'통계 보기',to:'R02'}]}),
'R01-B07':U([],['급수 · 조건을 다시 비교하기','자료 없이 비교 판정이 성립하는 조건을 설명해 보세요.'],{actions:[{label:'주제 열고 시작하기',to:'R20'},'하루 보류',{label:'확인한 결과 남기기',to:'O18'}]}),
'R01-B08':U([],['체크는 해 보았다는 기록입니다. 이해나 독립 해결을 뜻하지 않습니다.'],{metrics:[['공부를 남긴 회차','8'],['아직 기록이 없는 주제','3개']],actions:[]}),
'R02-B01':U([['통계 시작일','2026-09-01','date'],['통계 종료일','2026-10-02','date'],['통계 과목','미적분','select'],['통계 단원·주제','모든 주제','select']],[],{checks:[['같은 길이의 이전 기간과 비교',false]],actions:[]}),
'R02-B02':U([],[],{charts:[['bar','과목별 기록 회차'],['line','날짜별 기록 변화'],['dots','주제별 기록 분포']],actions:[]}),
'R02-B03':U([['그래프로 볼 통계','공부를 남긴 회차','select'],['보고 싶은 것','과목별 비교','select'],['그래프 종류','막대','select'],['함께 볼 지표','표시하지 않음','select']],[],{chart:'bar',chartTitle:'과목별 기록 회차',actions:['확대','원기록 보기']}),
'R02-B04':U([],[],{chart:'line',chartTitle:'정확한 날짜가 있는 기록',actions:['원기록 보기']}),
'R02-B05':U([],['10월 1일 · 공부 회차 2','10월 2일 · 공부 회차 1','날짜 미정 · 별도 기록 1'],{actions:[{label:'통계의 원기록',to:'O26'}]}),
'R02-B06':U([],['2026년 10월','기록한 주제 4개 · 공부 회차 8','독립 수행 결과는 아직 남기지 않았습니다.'],{actions:['원기록 보기']}),
'R03-B01':U([],[],{metrics:[['일주일 안','2개'],['기한 지남','0개'],['기한 미정','1개']],actions:['과제 추가','온라인 강의 추가','주차별 강의 추가']}),
'R03-B02':U([['공지 확인한 과목','미적분','select']],['마지막 확인 · 10월 2일 오후 7:10'],{actions:['공지 확인했어요']}),
'R03-B03':U([['일정 찾기','','search'],['일정 종류 보기','모든 종류','select'],['일정 보관 상태','진행 중','select']],[],{actions:[]}),
'R03-B04':U([],[],{calendar:true,tabs:['목록','달력'],actions:['이전 달','이번 달','다음 달','캘린더 파일 저장']}),
'R03-B05':U([['과제 준비','직접 확인한 완료','select'],['과제 제출','미확인','select']],['미적분 · 급수 연습 과제','10월 5일 23:59 · 제출 기한','조건을 정리하고 예제 두 개의 풀이를 남기기.'],{actions:['일정 수정','일정 보관']}),
'R03-B06':U([],['10월 2일 · 제출 기한 수정','이전 기한: 미정 → 10월 5일'],{checks:[['이 기기에서 일정 알림 받기',false]],actions:['마지막 변경 되돌리기']}),
'R04-B01':U([['공부 범위','2026 가을','select']],[],{actions:['학기 추가']}),
'R04-B02':U([],[],{actions:[{label:'과목 추가',to:'O02'},{label:'공부할 목차 만들기',to:'O19'}]}),
'R04-B03':U([],['미적분 · 2026 가을 · 주제 12개','선형대수 · 2026 가을 · 주제 8개'],{actions:[{label:'과목 열기',to:'R19'}]}),
'R04-B04':U([],['과목             단원                 주제','미적분          급수                 비교 판정','미적분          급수                 적분 판정'],{actions:['행 추가','미리보기','목차 저장']}),
'R05-B01':U([['주제 찾기','급수','search']],[],{checks:[['미적분 / 비교 판정',true],['미적분 / 적분 판정',true],['미적분 / 교대급수',false]],actions:['선택한 주제 모두 공부함']}),
'R05-B02':U([['비교 판정 · 메모','두 급수의 항이 음수가 아닌지 먼저 확인했다.','textarea'],['적분 판정 · 메모','감소 조건을 다시 살펴보기.','textarea']],[],{checks:[['비교 판정 · 공부함',true],['적분 판정 · 공부함',true]],actions:[]}),
'R05-B03':U([],['미적분 / 비교 판정'],{checks:[['개념과 조건 살펴보기',true],['내 말로 설명하기',false]],actions:['반복 남기기','상세 펼치기']}),
'R05-B04':U([['날짜 정밀도','하루','select'],['공부한 날짜','2026-10-02','date']],[],{actions:[]}),
'R05-B05':U([],['이 기기에 초안을 보관합니다.'],{actions:[{label:'2개 주제 기록 저장',to:'R20'}]}),
'R06-B01':U([['메모 찾기','','search']],['비교 판정의 전제 · 미적분','다음에 다시 확인할 조건 · 주제 연결 없음'],{actions:['메모 추가',{label:'메모 열기',to:'R22'}]}),
'R06-B02':U([['연결할 주제','비교 판정','select'],['메모','같은 결론이어도 판정에 필요한 조건은 다를 수 있다.','textarea']],[],{actions:['저장','닫기']}),
'R06-B03':U([],[],{ink:true,actions:['펜','지우기','실행 취소','재실행']}),
'R06-B04':U([],['10월 2일 오후 7:30 · 메모 수정','이전 내용: 비교 판정의 조건을 다시 보기.'],{actions:['이력 보기','연결된 주제 열기']}),
'R06-B05':U([],['초안을 보관하지 못했습니다. 현재 입력은 이 창에 남아 있습니다.'],{actions:['저장 다시 시도',{label:'초안 보관본',to:'R35'}]}),
'R07-B01':U([['강의 자료 찾기','','search']],['급수 강의 3 · 미적분 · 10월 2일','선형변환 필기 · 선형대수 · 10월 1일'],{actions:['강의 자료 추가',{label:'자료 열기',to:'R23'}]}),
'R07-B02':U([['자료 제목','급수 강의 3'],['과목','미적분','select'],['연결할 주제 · 선택','비교 판정','select'],['강의 내용·필기','비교 판정을 적용하기 전에 항의 부호와 비교 방향을 확인한다.','textarea']],[],{actions:[]}),
'R07-B03':U([['강의 내용·필기','전사문이나 강의 필기를 붙여 넣어 주세요.','textarea']],['선택 파일: 급수 강의 3.pdf · 4쪽'],{checks:[['원본 파일도 비공개 서버에 보관',false]],actions:['클로바노트 열기','파일 가져오기']}),
'R07-B04':U([['GPT 작업','정리·카드·퀴즈','select'],['처리할 원문 범위','직접 선택한 구간','select'],['카드·퀴즈 개수','5개','select']],['선택한 원문과 필기만 전송합니다.'],{actions:['GPT 연결','정리하기']}),
'R07-B05':U([],['비교 판정','두 급수의 항이 음수가 아니며, 충분히 큰 n에서 항의 크기를 비교할 수 있어야 한다.'],{tabs:['정리','카드','퀴즈','관계','원문'],actions:['원문 확인','결과 수정']}),
'R07-B06':U([],['질문 1 / 5','비교 판정을 적용하기 전에 무엇을 확인해야 하나요?'],{actions:['답 확인','암기 항목에 등록']}),
'R07-B07':U([],['변경 내용을 보관할 수 있습니다.'],{actions:['저장','초안 내보내기','Markdown 내보내기']}),
'R08-B01':U([['예제 찾기','','search'],['예제 언어','Python','select']],['급수 항의 합 · Python','행렬과 벡터 · Python'],{actions:['예제 추가',{label:'예제 열기',to:'R25'}]}),
'R08-B02':U([['예제 제목','급수 항의 합'],['언어','Python','select']],[],{code:'values = range(1, 6)\nprint(sum(values))',actions:[]}),
'R08-B03':U([['실행 방식','입력값을 미리 적기','select'],['실행에 사용할 입력값','','textarea']],[],{actions:['실행','입력 없이 실행','중단']}),
'R08-B04':U([['터미널에 보낼 입력','','input']],[],{code:'$ python main.py\n15\n프로세스가 종료되었습니다.',actions:['입력 보내기']}),
'R08-B05':U([],['출력','15','종료 코드 · 0'],{actions:['다시 실행']}),
'R08-B06':U([['내용·설명','1부터 5까지의 합을 출력한다.','textarea'],['연결할 주제','급수','select']],[],{actions:['저장','파일로 보관','예제 복사']}),
'R09-B01':U([['탐색할 내용','함수와 공간곡선','select']],[],{actions:[]}),
'R09-B02':U([['그래프 종류','함수','select'],['수식 예시','직접 입력','select'],['y(x)','x^2'],['슬라이더 시작','-2'],['슬라이더 끝','2']],[],{actions:[]}),
'R09-B03':U([['그래프 도구','기본 그래프','select'],['그래프 위 위치 x','1.00']],['현재 좌표 · (1.00, 1.00)'],{chart:'math',chartTitle:'y = x²',actions:['확대','축소','시점 복귀']}),
'R09-B04':U([['탐색 유형','함수의 변화','select'],['조건','x ∈ [-2, 2]']],['수식 · y = x²','x가 0에서 멀어질수록 y가 커진다.'],{actions:['전체 화면','파일 가져오기','파일로 보관']}),
'R09-B05':U([],['1. 항이 0으로 가는지 확인','2. 항의 부호와 형태를 살펴보기','3. 비교·적분·비율 판정의 조건 확인'],{actions:['판정 단계 열기','조건 확인']}),
'R09-B06':U([],['급수의 수렴','부분합의 수열이 유한한 값에 가까워지는지 살펴본다.'],{actions:[{label:'개념 선택',to:'R13'},'이전','다음']}),
'R09-B07':U([['제목 (선택)','제곱 함수의 변화'],['관찰·메모 (선택)','x와 -x에서 같은 함수값을 갖는다.','textarea']],['저장한 탐색 · 제곱 함수의 변화'],{actions:['저장','파일로 보관','저장한 탐색 열기']}),
'R10-B01':U([['연습할 주제','비교 판정','select'],['연습 시간','25분','select']],['책이나 다른 앱의 문제를 보며 풀어 보세요.'],{actions:['연습 시작']}),
'R10-B02':U([],['막힌 곳 · 비교할 급수를 고르는 단계','다음에 해 볼 것 · 분자와 분모의 가장 큰 차수를 보기'],{actions:['이전 메모 열기']}),
'R10-B03':U([['풀이·답안','','textarea']],['남은 시간 · 18:42'],{actions:['일시 중지','연습 마치기']}),
'R10-B04':U([['풀이·답안','항의 부호를 확인하고 1/n²과 비교했다.','textarea'],['막힌 곳','비교 방향을 한 번 바꾸어 적었다.','textarea'],['다음에 해 볼 것','부등식을 먼저 써 보기.','textarea']],[],{actions:['메모로 저장']}),
'R10-B05':U([],['연습 메모를 저장했습니다.'],{actions:['이전 메모 열기','다시 연습']}),
'R11-B01':U([['시험 과목','미적분','select'],['시험 주제','급수','select'],['문항 수','3개','select']],[],{actions:['쪽지시험 시작']}),
'R11-B02':U([['질문·개념','비교 판정의 전제는 무엇인가?','textarea'],['기준 답안·조건','항의 비음수성과 충분히 큰 n에서의 부등식.','textarea']],[],{actions:['암기 항목 등록',{label:'자료에서 카드 가져오기',to:'R12'}]}),
'R11-B03':U([['생성할 주제','급수','select'],['문항 수','3개','select']],[],{actions:['GPT 연결','생성 미리보기','항목 저장']}),
'R11-B04':U([['내 답안','각 항의 부호와 두 항의 크기 관계를 확인한다.','textarea']],['1 / 3 · 비교 판정의 전제는 무엇인가?'],{ink:true,actions:['이전 문항','다음 문항','비교하기']}),
'R11-B05':U([['1번 비교 결과','부분적으로 맞음','select']],['내 답안 · 각 항의 부호와 크기를 확인한다.','기준 답안 · 항의 비음수성과 충분히 큰 n에서의 부등식.'],{actions:['결과 저장','항목 목록']}),
'R11-B06':U([],['10월 2일 · 급수 · 3문항','직접 비교: 확인 2 · 다시 볼 항목 1'],{actions:[{label:'지난 결과 열기',to:'R28'},'원자료 확인']}),
'R12-B01':U([['자료 카드 찾기','','search']],[],{actions:[{label:'강의 자료 열기',to:'R07'}]}),
'R12-B02':U([],['급수 강의 3 · 10월 2일','비교 판정의 전제는 무엇인가?'],{actions:['질문 펼치기','이전 페이지','다음 페이지']}),
'R12-B03':U([],['답 · 항의 비음수성과 충분히 큰 n에서의 부등식.','원문 · 항의 부호를 확인한 뒤 비교한다.'],{actions:['원문 확인','원자료 열기']}),
'R12-B04':U([['연결할 주제','비교 판정','select']],[],{actions:['암기 항목에 등록']}),
'R12-B05':U([],['등록 당시 원자료','급수 강의 3 · 구간 2 · 10월 2일'],{actions:['등록 당시 원자료 펼치기']}),
'R13-B01':U([['개념 찾기','수렴','search'],['유형 선택','모든 유형','select']],['급수의 수렴','부분합','비교 판정'],{actions:['개념 열기']}),
'R13-B02':U([],[],{tabs:['읽기','편집'],actions:['원본 JSON 가져오기','설명 JSON 가져오기']}),
'R13-B03':U([],['급수의 수렴','부분합 Sₙ = a₁ + ⋯ + aₙ','부분합의 극한이 유한하게 존재하면 급수가 수렴한다고 한다.'],{actions:['이전','다음','관련 개념 열기']}),
'R13-B04':U([],[],{chart:'sequence',chartTitle:'부분합 Sₙ의 변화',actions:['장면 선택','초기화']}),
'R13-B05':U([['개념 이름','급수의 수렴'],['설명','부분합의 극한으로 정의한다.','textarea']],[],{actions:['JSON 보기','저장','보류 이유 확인']}),
'R14-B01':U([],['복습 3 · 새 카드 2'],{tabs:['예약 복습','무작위 연습'],actions:['마지막 평가 되돌리기']}),
'R14-B02':U([['과목','미적분','select'],['단원','급수','select'],['덱','기본 덱','select']],[],{actions:['덱 만들기']}),
'R14-B03':U([],['미적분 / 급수','비교 판정의 조건을 설명해 보세요.','전체 12개 중 3번째'],{actions:[]}),
'R14-B04':U([['글','항이 음수가 아닌지 먼저 확인한다.','textarea']],[],{ink:true,actions:['저장하고 다음','건너뛰기']}),
'R14-B05':U([],['참고 설명','항의 비음수성과 충분히 큰 n에서의 부등식이 필요하다.'],{actions:['다시','어려움','알맞음','쉬움']}),
'R14-B06':U([['참고 설명 입력','판정의 전제와 결론을 나누어 설명하기.','textarea'],['다음 복습 날짜','2026-10-03','date']],[],{actions:['참고 설명 저장','날짜 지정','카드 만들기','Anki 가져오기','복습 설정']}),
'R15-B01':U([['Canvas 과목','미적분','select']],[],{actions:['개념 카드 추가','관계 연결','가져오기·내보내기']}),
'R15-B02':U([],[],{spatial:'canvas',actions:['확대','축소','시점 복귀']}),
'R15-B03':U([['개념 이름','비교 판정'],['설명','항의 크기 관계에서 수렴 여부를 비교한다.','textarea']],[],{actions:['선택한 카드 편집','편집 마치기']}),
'R15-B04':U([['시작 개념','급수의 수렴','select'],['이어지는 개념','비교 판정','select'],['관계 설명','판정 방법']],[],{actions:['연결 저장','접기']}),
'R15-B05':U([['조작할 카드','비교 판정','select'],['선택한 카드 너비','280']],[],{actions:['왼쪽','오른쪽','위로','아래로','관계 수정']}),
'R15-B06':U([],['선택한 과목 · 미적분','카드 4개 · 연결 3개'],{actions:['가져오기','내보내기']}),
'R16-B01':U([['관계에서 찾기','','search'],['그래프 과목','미적분','select'],['표시할 연결','모든 연결','select']],[],{checks:[['설명·메모 함께 보기',true]],actions:[]}),
'R16-B02':U([['관계 배치','계층','select'],['주변 연결 범위','2단계','select'],['배치 간격','보통','select']],[],{actions:['전체 관계 보기']}),
'R16-B03':U([],[],{spatial:'network',actions:['확대','축소','시점 복귀']}),
'R16-B04':U([],['비교 판정 · 개념','연결된 항목 2개','급수의 수렴 · 판정 방법','비음수 항 · 성립 조건'],{actions:['이 항목 주변 보기','원 항목 열기']}),
'R16-B05':U([['보기 도구','기본','select']],[],{actions:['보기 도구 초기화']}),
'R17-B01':U([['카드 찾기','','search']],[],{actions:['카드 추가','되돌리기','보관한 카드','열로 이동']}),
'R17-B02':U([],[],{board:true,actions:['보드 열 추가']}),
'R17-B03':U([],['비교 판정의 예제 다시 보기','조건을 먼저 쓰고 두 급수의 항을 비교하기.','연결 주제 · 미적분 / 비교 판정'],{actions:['글 전체 보기','연결 주제 열기','카드 편집']}),
'R17-B04':U([['옮길 열','이어 하는 것','select']],[],{actions:['위로','아래로','카드 더 보기']}),
'R17-B05':U([['할 일','비교 판정의 예제 다시 보기'],['메모 (선택)','부등식 방향을 먼저 확인하기.','textarea'],['연결할 주제 (선택)','비교 판정','select'],['놓을 열','살펴볼 것','select']],[],{actions:['저장','닫기']}),
'R17-B06':U([],['보관한 카드 2개'],{actions:['보관한 카드 보기','복원']}),
'R18-B01':U([['과목·목차·기록 검색','수렴 조건','search']],[],{actions:['검색어 지우기']}),
'R18-B02':U([],['찾은 항목 3개','비교 판정 · 주제 · 미적분','급수 강의 3 · 강의 자료 · 미적분','조건을 먼저 쓰기 · 메모 · 미적분'],{actions:[{label:'주제 열기',to:'R20'},{label:'자료 열기',to:'R23'},{label:'메모 열기',to:'R22'}]}),
'R18-B03':U([],['일치하는 내용을 찾지 못했습니다.','검색어를 줄이거나 공부 범위를 넓혀 보세요.'],{actions:['모든 공부에서 찾기']}),
'R18-B04':U([],['일정·코드 연결의 검색 정보를 읽지 못했습니다.'],{actions:['다시 시도']}),
};
const modalFields = {
'학기 추가':[['학기 이름','2026 가을']], '과목 추가':[['과목 이름','미적분']], '목차 추가':[['이름','비교 판정'],['항목 역할','주제','select']],
'여러 목차 추가':[['여러 항목','급수\n  비교 판정\n  적분 판정','textarea']], '이름 수정':[['이름','비교 판정']], '목차 위치 옮기기':[['옮길 곳','미적분 / 급수','select']],
'내 계정':[['표시 이름','공부하는 사람']], '다음에 펼칠 곳을 남겨둘까요?':[['다음에 할 일','비교 판정 예제의 조건부터 확인하기.','textarea']],
'공부 기준 조정':[['적용 범위','이 주제','select'],['변경 이유','조건 설명을 먼저 확인하고 싶다.','textarea']],
'시험·과제·강의 일정':[['일정 종류','과제','select'],['일정 이름','급수 연습 과제'],['과목','미적분','select'],['기한','2026-10-05','date'],['해야 할 일','예제 두 개의 풀이를 남기기.','textarea']],
'다음에 확인할 내용':[['확인할 주제','비교 판정','select'],['자료 없이 확인할 내용','성립 조건을 설명하기.','textarea'],['확인 기한 · 선택','','date']],
'학기 기간':[['기간을 남길 학기','2026 가을','select'],['학기 시작일','2026-09-01','date'],['학기 종료일','2026-12-21','date']],
'지금 확인한 결과':[['확인 결과','결과 모름','select'],['도움 사용','도움 여부 미확인','select'],['실제로 확인한 문항','문항 새로움 미확인','select'],['남길 답변과 메모 · 선택','','textarea']],
'답안에서 수행 결과 남기기':[['확인 결과','결과 모름','select'],['도움 사용','도움 여부 미확인','select'],['판단 근거','','textarea']],
'작은 메모':[['메모','조건을 먼저 쓰고 비교 방향을 확인하기.','textarea']], '강의 주차 만들기':[['과목','미적분','select'],['시작일','2026-09-01','date'],['주차 수','15']],
'카드 추가·편집':[['할 일','비교 판정 예제 다시 보기'],['메모 (선택)','','textarea'],['놓을 열','살펴볼 것','select']], '보드 열':[['열 이름','살펴볼 것']],
};
function uiFor(block,e){
  if (block.ui) return block.ui;
 if(uiCatalog[block.id])return uiCatalog[block.id];
 if(modalFields[e.name])return U(modalFields[e.name],[],{actions:e.actions});
 const special={
 R19:U([['과목 개요','함수와 변화, 급수의 수렴을 공부한다.','textarea']],['목차','급수 / 비교 판정','급수 / 적분 판정'],{actions:e.actions}),
 R20:U([['주제 메모','비교할 급수를 고르기 전에 항의 부호를 확인한다.','textarea']],['미적분 / 급수 / 비교 판정','최근 기록 · 조건을 먼저 써 보았다.'],{actions:e.actions}),
 R21:uiCatalog['R05-B02'],R22:uiCatalog['R06-B02'],R23:uiCatalog['R07-B02'],R24:U([],['휴지통의 자료','급수 강의 초안 · 10월 1일'],{actions:['복원','자료 목록']}),R25:uiCatalog['R08-B02'],R26:uiCatalog['R10-B01'],R27:uiCatalog['R11-B01'],R28:uiCatalog['R11-B05'],R29:uiCatalog['R14-B04'],
 R30:U([['자유 기록','오늘은 풀이를 서두르기보다 성립 조건을 먼저 적었다.','textarea']],['저장한 자유 기록 · 조건에서 시작하기'],{actions:e.actions}),R31:U([['자유 기록','','textarea']],[],{actions:['저장','자유 기록 목록']}),R32:U([['자유 기록','같은 결론에 도착해도 필요한 조건은 다를 수 있다.','textarea']],[],{actions:e.actions}),
 R33:U([],['백업 파일','원문·이력·첨부·개인 배치를 함께 보관합니다.'],{actions:['백업 만들기','파일 선택','복구 전 보관본 만들기']}),R34:U([],['휴지통','비교 판정 메모 · 10월 1일'],{actions:['복원']}),R35:U([],['보존한 초안','메모 · 10월 2일 오후 7:30','현재 입력과 기존 원문을 따로 보관했습니다.'],{actions:['열기','복사','내려받기']}),
 R36:U([['남길 생각','조건을 적고 나니 비교할 식을 고르기 쉬웠다.','textarea']],['10월 2일 · 비교 판정'],{actions:['저장','기록 더 보기']}),R37:U([['문제가 생긴 상황','','textarea']],['저장 상태에서 기기 보관과 서버 전송을 확인할 수 있습니다.'],{actions:e.actions}),R38:U([],['내 공부를 기록하고, 하던 생각으로 돌아오는 공간.','ManSeekSong OS','내 글과 내 선택을 남깁니다.'],{actions:[]}),R39:U([],['도움말'],{actions:[{label:'도움말 열기',to:'R37'}]}),R40:U([],['내 공부 공간'],{actions:[{label:'내 공간 열기',to:'R01'}]}),R41:U([],['이 항목을 찾을 수 없습니다.','휴지통으로 이동했거나 현재 자료에 없는 항목입니다.'],{actions:[{label:'과목으로 돌아가기',to:'R04'}]}),
 U01:U([['공부 범위','2026 가을','select']],['공부 책상 · 오늘'],{actions:['이 자리의 기능',{label:'어디서나 찾기',to:'R18'},'보관함·화면 설정']}),U02:U([],['내 기록을 여는 중입니다.'],{actions:['다시 시도']}),U03:U([['이메일','study@example.com'],['비밀번호','••••••••']],[],{checks:[['로그인 유지',false]],actions:['로그인','계정 만들기']}),U04:U([],['가입 승인을 기다리고 있습니다.'],{actions:['상태 다시 확인','로그아웃']}),U08:U([],['이전 복구 작업을 확인하고 있습니다.'],{actions:['복구 다시 시도','예정된 복구 취소']}),U09:U([],['하던 생각부터 이어가세요.','미적분 / 급수 / 비교 판정'],{actions:[{label:'이어가기',to:'R20'},'다음 위치 남기기']}),U10:U([['읽기 폭','기본','select']],[],{actions:['이어가기 설정 복구']}),U14:U([],['이번 주','10월 5일 · 급수 연습 과제','기한 미정 · 다음 강의 공지 확인'],{actions:[{label:'일정 열기',to:'R03'}]}),U24:U([['궁금한 점','','textarea']],['질문 · 비교 판정에서는 왜 항의 부호를 먼저 보나요?','원문 구간 2'],{tabs:['퀴즈','관계','질문과 답'],actions:['답 확인','질문하기']}),U26:U([['덱 이름','기본 덱'],['질문','비교 판정의 조건은?','textarea'],['참고 설명','항의 비음수성과 충분히 큰 n에서의 부등식.','textarea']],[],{actions:['카드 저장','Anki 가져오기']}),U27:U([['하루 새 카드','10'],['복습 설정','기본','select']],['최적화할 복습 이력이 아직 충분하지 않습니다.'],{actions:['설정 저장']}),U37:U([['API 키','••••••••'],['월 사용 한도','10']],['선택한 내용만 전송하며 별도 API 요금이 발생합니다.'],{checks:[['비용과 전송 범위를 확인했습니다',false]],actions:['연결 저장','사용량 확인','일시 중지','키 삭제']}),U39:U([],['ManSeekSong OS','manseeksong','이전에 남긴 생각 · 조건을 먼저 적어 보기'],{actions:['이전 생각 열기','더 보기']}),
 };
 if(special[e.id])return special[e.id];
 if(e.name==='통계의 원기록')return U([],['10월 2일 · 미적분 / 비교 판정','공부함 · 조건을 먼저 적어 보았다.'],{actions:['원기록 열기','닫기']});
 if(e.name==='수식 탐색 전체 화면')return U([['y(x)','x^2']],[],{chart:'math',chartTitle:'y = x²',actions:['닫기']});
 if(e.name==='움직임 위젯')return U([],['쉬어가기'],{tabs:['쉬어가기','선형 아이콘','인터랙티브 카드','화면 동작'],checks:[['동작 줄이기',true]],actions:['닫기']});
 if(e.name==='공부할 목차 만들기')return uiCatalog['R04-B04'];
 if(e.name==='사진으로 목차·내용 가져오기')return U([],['선택한 사진','급수 / 비교 판정 / 적분 판정'],{actions:['사진 선택','미리보기','적용']});
 if(/휴지통으로/.test(e.name))return U([],['선택한 항목을 휴지통으로 옮길까요?','휴지통에서 다시 복원할 수 있습니다.'],{actions:['휴지통으로 이동','취소']});
 if(e.name==='가입 계정 관리')return U([],['study@example.com · 메일 확인됨 · 승인 대기'],{actions:['승인','거절','닫기']});
 if(e.name==='내 기록의 저장 상태')return U([],['서버 전송 대기 · 1개','이 기기에 남아 있는 초안은 계속 보관합니다.'],{actions:['다시 전송','새로 확인','보존본 내려받기']});
 if(e.name==='이어가기 설정 복구')return U([],['이 기기에 남아 있는 이어가기 위치','미적분 / 비교 판정'],{actions:['복구','취소']});
 if(e.name==='이 주제부터 해볼까요?')return U([],['비교 판정','책의 예제 하나에서 성립 조건을 먼저 확인해 보세요.'],{actions:[{label:'주제 열기',to:'R20'},'닫기']});
 // No design rationale is ever injected as product text.
 return U((e.information||[]).slice(0,4).map(label=>[label,'','input']),[],{actions:e.actions||[]});
}

const screens = entities.filter(e => !linkedSurfaces[e.id]).map(e => ({
  id: e.id, title: e.name, route: e.path || null, primary: e.kind === 'main',
  kind: e.kind, homePlace: e.homePlace, pageKey: pageKeys[e.homePlace], layoutFamily: e.layoutFamily,
  source: sourceString(e), sourceRefs: e.source ? [e.source] : e.sources,
  states: e.states, actions: (e.actions || []).map(label => destinations[label] ? { label, to: destinations[label] } : label),
  returnContract: e.return, placeVariants: e.placeVariants || [],
  blocks: (e.blocks || []).map(b => ({ ...b, ui:uiFor(b,e), source: sourceString({ source: b.source }),
    actions: (b.actions || []).map(label => destinations[label] ? { label, to: destinations[label] } : label) })),
  statePlan: inventory.statePlan.find(s => s.surfaceId === e.id)?.sourceStates.map(s => s.name) || e.states,
}));
for (const s of screens) {
  if (!s.blocks.length) throw Error('No content blocks: ' + s.id);
  if (!s.pageKey) throw Error('Missing place: ' + s.id);
}
const fileChecks = inventory.moduleCoverage.map(m => {
  const absolute = path.resolve(repo, m.path);
  if (!absolute.startsWith(repo + path.sep)) throw Error('Source escapes repository: ' + m.path);
  if (!fs.existsSync(absolute)) throw Error('Missing source: ' + m.path);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex');
  return { path: m.path, exists: true, snapshotMatches: hash === m.sha256, sha256: hash };
});
const mainProfiles = screens.filter(s => s.primary).length * profiles.length;
const wideOnly = screens.filter(s => !s.primary).length;
const F = { collections: foundations.collections, modes: foundations.modes, variables: foundations.variables, textStyles: foundations.textStyles, fonts: foundations.fonts };
const batches = [];
for (const [pageKey, pageId] of Object.entries(pages)) {
  const group = screens.filter(s => s.pageKey === pageKey);
  let position = 0;
  for (let start = 0; start < group.length;) {
    const primary = group[start].primary;
    const limit = primary ? 2 : 5;
    const batch = [];
    while (start < group.length && batch.length < limit && group[start].primary === primary) batch.push(group[start++]);
    const id = pageKey + '-' + String(batches.filter(b => b.pageKey === pageKey).length + 1).padStart(2, '0');
    const input = { pageId, pageKey, foundations: F, materials: design.materials, reusable, profiles, homeId: 'R01',
      screens: batch, startY: 100 + position * 2400, batchId: id,
      contentPolicy: '합성 설계 설명만. 실제 개인 원문 없음. 루트 빌더는 의미 없는 행·임의 학습 통계를 추가하지 않아야 함.' };
    position += batch.length;
    batches.push({ id, pageKey, input, frameCount: batch.reduce((n, s) => n + (s.primary ? profiles.length : 1), 0) });
  }
}
const manifest = { schemaVersion: 1, checked: '2026-10-02', inventory: 'screen-inventory.json',
  profileSource: 'docs/device-environments.md + e2e/devices/environments.ts', profiles, pages, reusable,
  counts: { routes: inventory.routes.length, overlays: inventory.overlays.length, surfaces: inventory.surfaces.length,
    distinctScreenEntities: screens.length, linkedSurfaceEntities: linkMap.length, primaryFrames: mainProfiles,
    wideOnlyFrames: wideOnly, expectedFrames: mainProfiles + wideOnly, semanticBatches: batches.length },
  coverageLinks: linkMap, moduleSourceChecks: fileChecks,
  pending: ['Figma 호출 실행', '노드 readback', '대표 화면 스크린샷', '실제 프로토타입 연결', '변경된 소스가 있으면 범위 재대조'],
  layoutContract: '여러 호출을 같은 페이지에 실행하면 build-screens.js는 INPUT.startY를 반영하거나 기존 형제 프레임 아래에 배치해야 함.',
  batches: batches.map(({id,pageKey,frameCount,input}) => ({ id,pageKey,frameCount,screenIds:input.screens.map(s=>s.id),startY:input.startY,
    inputFile:id+'.input.json',callFile:id+'.call.json' })) };
if (argv.includes('--check')) { console.log(JSON.stringify({ counts: manifest.counts, changedSources: fileChecks.filter(x => !x.snapshotMatches).map(x => x.path), unresolvedReusable: Object.values(reusable).filter(x => x.endsWith('_ID')), allInputsPresent: true }, null, 2)); process.exit(0); }
fs.mkdirSync(output, { recursive: true });
for (const batch of batches) {
  const inputFile = path.join(output, batch.id + '.input.json');
  const callFile = path.join(output, batch.id + '.call.json');
  fs.writeFileSync(inputFile, JSON.stringify(batch.input, null, 2) + '\n');
  if (!argv.includes('--no-pack')) {
    const result = cp.spawnSync(process.execPath, [path.join(__dirname, 'pack-call.cjs'), inputFile, path.join(__dirname, 'build-screens.js'), callFile], { encoding: 'utf8', cwd: repo });
    if (result.status !== 0) throw Error('Packing ' + batch.id + ' failed: ' + result.stderr + result.stdout + '\nReduce the semantic batch, do not truncate content.');
    const packed = JSON.parse(fs.readFileSync(callFile, 'utf8'));
    if (packed.codeLength > 50000) throw Error('Packing limit exceeded: ' + batch.id);
    manifest.batches.find(b => b.id === batch.id).codeLength = packed.codeLength;
  }
}
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(output, 'normalized-screens.json'), JSON.stringify({screens,coverageLinks:linkMap}, null, 2) + '\n');
console.log(JSON.stringify({ output, counts: manifest.counts, packed: !argv.includes('--no-pack'), changedSources: fileChecks.filter(x=>!x.snapshotMatches).map(x=>x.path), unresolvedReusable:Object.values(reusable).filter(x=>x.endsWith('_ID')) },null,2));
