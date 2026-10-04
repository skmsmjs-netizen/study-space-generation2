const fs=require('fs'),path=require('path');
const source=(path,exp)=>({path,export:exp});
const list=[
{id:'A01',name:'자료와 곁 도구 작업 공간',code:'workspace',path:'/materials/:id',parents:['R07','R23','R24'],sources:[source('src/ui/study-workspace.tsx','StudyWorkspace'),source('src/ui/study-workspace.tsx','useStudyWorkspace')],sourceFiles:['src/ui/study-workspace.tsx','src/data/study-workspace.ts','src/ui/study-workspace.css','src/App.tsx'],cases:[
'자료 경로 진입 → 기존 StudyMaterials를 자료 작업면에 표시 → 곁 도구를 펼침/접음. 원문·저장 경로는 기존 부품에 위임한다.',
'도구 선택 memo/math/code/record → 방문한 편집기 인스턴스 유지. 자료·메모·기록·코드는 hidden으로 화면만 숨겨 기존 effect/결과 수집을 유지한다. 수식은 Plot/GeoGebra 영역만 Activity로 멈추며 입력·메모·A 비교는 바깥에 남긴다.',
'자료 폭 range 30–70% → controller.setLayout → 기기 구성 저장. 기본 폭 52% 복귀와 자료/도구/양쪽 보기 선택은 별도 조작이다.',
'관찰한 컨테이너가 760px 이하 → 자료/도구 전환 버튼으로 한 작업면 선택. 넓은 화면의 분할과 같은 원본 편집기를 사용한다.',
'곁 코드의 예제 목록/추가/복제/삭제 후 선택은 onOpenExample로 작업 공간 안에서 바꾼다. codeExampleId를 구성에 보관한다. active=false이면 실행을 취소하되 기존 결과 수집 경로는 유지한다.',
'저장 실패·손상된 저장값·다른 창 변경은 A08의 구성 저장 경계. 앱의 공부 기록 저장 성공과 구성 저장 성공을 구별한다.'
]},
{id:'A02',name:'빠른 명령 검색과 실행',code:'commands',parents:['U01'],sources:[source('src/ui/workspace-commands.tsx','WorkspaceCommands')],sourceFiles:['src/ui/workspace-commands.tsx','src/App.tsx'],cases:[
'빠른 명령 버튼 또는 Ctrl/⌘+Shift+K → 모달 열기 → 검색 필드에 초점. 한글 조합·이미 처리한 키·입력 필드/에디터/다른 대화상자에서는 전역 단축키 실행을 막는다.',
'검색어 NFC 정규화·한국어 소문자 비교 → 명령 제목/키워드 필터. 결과 없음이면 검색어 줄이기/지우기 안내.',
'입력에서 아래 화살표 → 첫 활성 명령. 활성 결과 하나에서 Enter → 닫기 후 run. 목록 위/아래/Home/End → 활성 버튼 순환; disabled는 건너뛴다.',
'명령별 disabled 이유 표시 → 실행 차단. 실행 가능한 버튼 → 먼저 모달 닫기 → 전달받은 실제 run 호출. 모달 닫기는 공통 포커스 복귀 계약이다.'
]},
{id:'A03',name:'원문 발췌·조건별 검색',code:'search',path:'/search',parents:['R18'],sources:[source('src/ui/workspace-search.tsx','WorkspaceSearch')],sourceFiles:['src/ui/workspace-search.tsx','src/domain/workspace-search.ts','src/ui/use-view-context.ts','src/data/view-context.ts'],cases:[
'검색어 비움 → 첫 검색 안내. 공백 아닌 검색어 → 대기 표시 → 현재 owner/entries/signature에 맞는 결과만 표시.',
'자료 종류/현재 공부 범위/모든 공부/정렬 선택 → 같은 검색 원장의 조건 변경. 관련도 순은 제목 전체→제목 부분→본문, 동률은 원래 순서; 최신/중요도라고 부르지 않는다.',
'실제 원문 발췌·일치 이유 → 해당 href로 이동. 검색결과를 새 원문으로 저장하지 않는다. 초안·휴지통은 해당 보관함에서 별도 탐색한다.',
'결과 없음 → 모든 종류/모든 공부로 넓히거나 검색어 수정. 40개 단위 더 보기는 표시 범위만 늘린다.',
'일정 투영/결과 조회 오류 → 오류 UI 재시도 핸들러. 새 요청·소유자·자료 변경·해제는 이전 응답 적용 차단; 실제 재시도 결과는 실행 검증 별도.'
]},
{id:'A04',name:'그래프와 원기록 함께 선택',code:'linkedstats',path:'/statistics',parents:['R02','O26','U36'],sources:[source('src/ui/statistics.tsx','StudyStatistics'),source('src/ui/statistics-gallery.tsx','StatisticsGallery'),source('src/ui/statistics-plot.tsx','StatisticsPlot')],sourceFiles:['src/ui/statistics.tsx','src/ui/statistics-gallery.tsx','src/ui/statistics-plot.tsx','src/ui/statistics-selection.ts'],cases:[
'유효한 시작/종료일 → 날짜 함께 선택. 과목 선택 → 과목 함께 선택. 둘 다 원본 레코드의 실제 ID·날짜·소유자를 기준으로 집합을 만든다.',
'그래프의 값/원기록 표에서 함께 선택 → sourceKeys를 공유 → 다른 그래프와 값 행에 같은 근거 표시. 선택 해제 → 전체 표시로 복귀.',
'소유자 불일치 → 공유 선택 무효. 날짜 범위/날짜 모름은 정확한 하루로 승격하지 않으며 날짜 선택에서 임의 포함하지 않는다.',
'그래프 선택 표시 갱신은 기존 장면의 확대를 유지하는 경로. 그리기 실패 → 동일 값/원기록 목록과 재시도 경로. 값을 바꾼 새 공부 기록을 생성하지 않는다.'
]},
{id:'A05',name:'이 창의 반응 속도 확인',code:'localperformance',parents:['U01','U07'],sources:[source('src/ui/ui-performance-access.tsx','UiPerformanceAccess'),source('src/ui/ui-performance-panel.tsx','UiPerformancePanel')],sourceFiles:['src/ui/ui-performance-access.tsx','src/ui/ui-performance-panel.tsx','src/ui/use-route-performance.ts','src/data/ui-performance.ts','src/data/request-performance.ts'],cases:[
'반응 속도 확인 → 모달 → 입력·검색·이력 펼침·이동의 표시 기회 측정과 저장 요청 측정을 별도 표시.',
'새로고침 → 현재 창 최근 값 재조회. JSON 내려받기 → 파일 생성/다운로드 요청; 실패하면 창의 값을 유지하고 안내.',
'측정값 비우기 → 측정 배열만 비움. 공부 원문은 유지한다. 최근 UI와 요청 측정 각각 최대 120개이며 창 새로고침 뒤 비워진다.',
'글·계정·자료 이름·주소를 담지 않고 자동 전송하지 않는 경로. 이 측정은 표준 INP/LCP/CLS나 서버 저장 성공/물리 기기의 전반적 속도 증명이 아니다.'
]},
{id:'A06',name:'누적 이력 단계적으로 펼치기',code:'history',parents:['R01','R14','R20','R29'],sources:[source('src/ui/progressive-history.tsx','ProgressiveHistory')],sourceFiles:['src/ui/progressive-history.tsx','src/ui/use-view-context.ts','src/data/view-context.ts','src/App.tsx','src/ui/topic-recall.tsx'],cases:[
'처음 또는 보존된 표시 한도 → 최소 40개 범위 안에서 목록 렌더. 더 보기 → 40개씩 증가; 모두 펼치기 → 현재 전체 수까지 표시.',
'접을 수 있는 이력은 details 토글로 열고 닫음. 펼침 상태/표시 수는 owner+name의 view-context에 연결된다.',
'목록 일부만 렌더해도 검색·백업 원장은 줄이지 않는다. 원기록 개수 감소 시 현재 total과 한도로 표시 수를 계산한다.',
'펼친 뒤 렌더 측정과 effect 정리 연결. owner 변경 시 이전 소유자의 표시 설정을 섞지 않는다. 재접속 보존은 실제 view-context 저장 경계와 함께 판정한다.'
]},
{id:'A07',name:'검색 워커·최신 요청 보호',code:'worker',parents:['R18','A03'],sources:[],sourceFiles:['src/data/workspace-search-client.ts','src/data/workspace-search.worker.ts','src/data/workspace-search-engine.ts','src/domain/workspace-search.ts'],cases:[
'검색 자료 갱신 → owner/revision에 따른 초기화 또는 upsert/remove/order 패치. 같은 자료·순서면 불필요한 갱신 생략.',
'검색 요청 → 앞 대기 요청 취소(null) → 요청 번호 증가 → worker 전송. worker 없음/생성 실패/메시지 오류/10초 시간 초과 → 같은 로컬 검색 엔진으로 전환.',
'응답의 owner/revision/request가 현재와 일치할 때만 결과 수락. 늦은 응답과 다른 소유자의 응답은 적용하지 않는다.',
'해제 → 대기 취소·worker 종료·색인 비움. 색인은 저장 원장·계정 권한 원본이 아니며 UI 조작은 A03에서 출발한다. 이 항목에는 별도 버튼을 만들지 않는다.'
]},
{id:'A08',name:'작업 구성 보관·복귀·실패 회복',code:'savedwork',parents:['U01','A01'],sources:[source('src/ui/study-workspace.tsx','SavedWorkspaces'),source('src/ui/study-workspace.tsx','WorkspaceStorageNotice'),source('src/ui/study-workspace.tsx','useStudyWorkspace')],sourceFiles:['src/ui/study-workspace.tsx','src/data/study-workspace.ts','src/ui/observatory-navigation.tsx'],cases:[
'작업 구성 → 이름 입력 → 현재 경로/레이아웃 보관. 원문을 복제하지 않고 owner별 localStorage에 구성만 저장한다.',
'보관 항목 → 이름 변경/이름 저장/취소, 구성 삭제/삭제 되돌리기. 입력 한계와 disabled는 실제 조건식을 따른다.',
'대상이 남아 있으면 이 작업 열기 → 해당 경로 이동. 삭제된 대상은 안내와 휴지통 경로이며 없는 원문을 재생성하지 않는다.',
'읽기 실패/손상 저장값 → 기존 원본 보호 후 오류. 같은 창 저장 큐와 navigator.locks로 비교/쓰기를 직렬화한다. 다른 창 저장값 변경 → 덮어쓰기 차단·다시 읽기; 쓰기 실패 → 현재 화면 유지·저장 다시 시도. locks가 없으면 메모리 화면을 유지하고 다른 브라우저 보관을 안내한다.',
'저장 다시 시도와 다시 읽기는 각각 현재 화면 구성 쓰기/저장된 구성 재조회이다. 공부 기록 저장과 다른 경계이며 실제 디스크·재접속 결과는 별도 확인이다.'
]},
{id:'A09',name:'네 고정 장소 이동 표시',code:'transition',parents:['U01'],sources:[source('src/ui/observatory-navigation.tsx','ObservatoryNavigation')],sourceFiles:['src/ui/observatory-navigation.tsx','src/ui/observatory-place-scene.tsx','src/ui/observatory-place-scene.css','src/ui/motion.tsx'],cases:[
'책상/서가/작업대/벽 이동 → 현재 장소 이름을 전환 표시한다. 책상(front)을 제외한 장소에는 ObservatoryPlaceScene 풍경과 해당 장소 바로가기가 추가된다. 기능 본문 전체를 모션 때문에 다시 마운트하지 않는다.',
'useMotionEnabled의 사용자 설정·시스템 reduced-motion·문서 visibility 조건에 따라 전환을 허용하거나 정지한다.',
'공통 도구 위치(global)는 천장 조명으로 표시하고 찾기 링크로 진입한다. 원래 자리로는 남아 있는 최근 일반 장소 경로로 복귀하며 없으면 현재 place.href를 사용한다. 천장 풍경은 찾기·도움말·백업/복원 바로가기를 제공한다.',
'풍경 접기/펼치기는 소유자 범위를 포함한 storageKey로 기기 설정을 보관한다. 저장 실패는 내비게이션을 막지 않으며 접힌 풍경의 바로가기는 hidden 안에 있다. 장소별 바로가기는 기존 href를 사용하고 공부 기록을 생성하지 않는다.',
'원래 네 장소 버튼·복귀 경로는 유지하며 효과가 공부 완료/저장 성공의 의미를 대신하지 않는다. 장소 풍경은 baseline transitionMs와 reduced-motion 조건을 사용한다.'
]},
{id:'A10',name:'수식 조건 A·B 같은 축 비교',code:'mathcompare',path:'/math',parents:['R09','U31'],sources:[source('src/ui/math-comparison.tsx','MathComparison')],sourceFiles:['src/ui/math-comparison.tsx','src/ui/math-comparison-model.ts','src/data/math-comparison.ts','src/ui/math-explorer.tsx'],cases:[
'현재 계산 가능·보관 손상 없음 → 현재 조건을 A로 고정. 기존 수식 편집 B를 바꾸며 비교; 기존 장면/메모 저장 경로는 유지한다.',
'같은 종류 → 동일 축 범위에 A 점선/B 실선·값 표 표시. 함수/공간 곡선 종류가 다르면 겹치지 않고 같은 종류 복귀 또는 A 재고정을 안내한다.',
'공간 곡선은 xy/xz/yz 정사영 선택. 확대·축소·방향 이동은 비교 축을 고정; 전체 맞춤은 두 조건 범위로 다시 계산. 크게 보기/크기 복귀 제공.',
'B 계산 불가 → 수식 수정 후 이어가기. 정의되지 않은 표본·절단은 그대로 표시하고 이어 그리지 않는다. 단위 미지정 수치이며 학습 성과를 계산하지 않는다.',
'A는 owner 키를 포함한 이 탭 sessionStorage에만 보관. 읽기 손상은 blocked·초기화 전 덮어쓰기 차단; 저장 실패는 현재 화면 A 유지와 복원 한계 안내. 비교 종료/초기화는 비교키만 지운다.'
]}
];
for(const item of list){item.status='source-bound-runtime-unverified';item.kind='extension';item.runtimeVerified=false;item.sourceFiles=item.sourceFiles.filter(p=>fs.existsSync(path.resolve(__dirname,'../..',p)));item.reason='현재 소스 근거로 확장 경로를 연결했다. 구현자의 실행 검증·배포 증거는 이 문서 원장과 별도다.';}
fs.writeFileSync(path.join(__dirname,'extensions.json'),JSON.stringify(list,null,2));
