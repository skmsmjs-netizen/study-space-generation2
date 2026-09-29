# 2026-09-30 Prototype 후속 실행 인계

최신 앱 구현은 **ce6ee432bee65d184f65145414ee4a1e586c838d**입니다. 시작점4907d8e를 reset하지 않고 아래 작은 commit을 추가했습니다. branch는 `codex/gen2-foundation`, 공개 main에 push했습니다. 원격은 [study-space-generation2](https://github.com/skmsmjs-netizen/study-space-generation2), [Pages](https://skmsmjs-netizen.github.io/study-space-generation2/)입니다. 최초7f813c2/tag는 역사적 출발점입니다.

| commit | 실행한 변경 |
|---|---|
| dd39f5b | 같은 부모 형제 order와 일괄추가 원자명령·Undo·500행·희소order 보존 |
| 5e1d223 | Modal 배경 inert/초점후보·손상기준초안 원문사본/복구·TRACE 입력맥락 |
| 752ab1e | 과목→단원→주제 전체 표, 개별칸/삭제20Undo/Preview/기존재사용/동일요청재시도 |
| ce6ee43 | App 연결·대상별Modal초안·장문선택/내부scroll·전역기준Undo·자유기록ID복구 |

앱 commit의 [Actions36597203248](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/36597203248) test/build/deploy 성공을 확인했습니다. 공개 브라우저에서 `index-3OU7fg4T.js`, 새 표 진입, `#/node/demo-topic-function` reload와 형제순서 조작 존재를 확인했습니다. 문서 후속 commit/배포는 Git 이력과 Actions에서 확인합니다. 실행 요약은 `docs/validation/followup-execution-20260930.json`, Phase별 필수양식과 CORE45는 `docs/phase-report-followup-20260930.md`입니다. 이전 보고/로그를 덮어쓰지 않았습니다.

## 이번 검증과 보존

- 최종 자동 **170개 통과**, opt-in 성능1개 일반 실행 미실행. TypeScript/Vite build 통과. `followup-final-tests-20260930.txt`/`followup-final-build-20260930.txt`.
- 실제 로컬 브라우저 **B10–B18**, 공개 **B19**. 형제정렬/일괄추가/표 생성·재사용·Undo, 과목·전체 기준/route간Undo, 80줄3190자 선택방향·내부scroll/Back/reload, 현존 생성/이름/이동Modal초안, 390밝게/어둡게/1280넓은창. 모든 UI/상태 통과 아님.
- 1세대 원본1,851개 최종해시 **변경0/누락0**. 원본·Vault·다른 진행중 변경을 수정하지 않았습니다.
- 21종 계약/export 유지. production 호출16종, Radio/Tabs/SegmentedControl/ListItem/Sheet5종은 App미사용. 전상태·물리 접근성 통과 아님.
- 원장 **기존1366행 전부 보존+신규 자유기록ID복구1행=1367행**. baseline 원목록 변경 없음. 이전 snapshot은 프로젝트 outputs/20260930-gen2-prototype-followup/ledger-before.json. `--previous`+`--check-sources` 비교 통과. 컴포넌트문서 diff 확인 뒤 previous hash와 이유를 기록했습니다. hash갱신 전 검증기가 변경을 올바르게 검출한 실패로그와 수정후26개통과 로그를 별도 보존했습니다.
- 새 자유기록의 최초 저장은 성공했지만 초안정리 양쪽이 실패한 뒤 재편집/이탈하면 ID연결이 끊기던 P1을 재현3검사로 수정했습니다. 저장ID route로 이동·Workspace정리경고 유지·초안entityId 보존·옛본문과 새본문이 다르면 양쪽보존. 실제 Storage실패/OS퇴거는 자동오류주입과 구별합니다.

## 원문·접근 확인 경계

HISTORY665 원문물리줄·재구성텍스트는665개 모두 일치했습니다. 의미전수 완료가 아닙니다. H472/H474/H475/H476 원문과 `docs/과목·목차 표 입력.md` 및 1세대 소스를 직접 대조하여 **표는3단계·개별칸·붙여넣기파싱 없음**을 반영했습니다. 일반가변깊이트리는 그대로 보존합니다. F05원문파싱과 F04표를 섞지 않습니다.

과거194첨부경로 현재조사: 기존13개1바이트읽기가능, 과거미접근181개는 현재도181개없음. 13개내용/초기141장면·460이력/665전체 의미대조는 미완입니다. 이번 PDF이미지 전수재독은 하지 않았습니다. 비공개 위치증분/감사 상세는 프로젝트 outputs/20260930-gen2-prototype-followup/에 보존했으며 원본·대화·사용자답·locator·비밀키는 Git에 추가하지 않았습니다.

## 승인·외부 연결

공개 repo/Pages·gh인증·Supabase생성을 사용자가 이미 승인/완료했습니다. 같은 승인을 재요청하지 않습니다. 현재 실행에서 gh인증 유효와 Supabase 기존 프로젝트 dashboard Healthy를 재확인했습니다. 앱 Auth/CRUD/RLS·서버수신은 미구현/미검증입니다. 비밀번호·secret/service-role키를 읽지 않았습니다. 다음 실행에서도 CLI경로/포트/탭/인증을 다시 확인해야 하며 /tmp gh실행파일을 영속이라고 가정하지 않습니다.

기존 iPhone17Pro P01(한글두줄→다른화면→복귀 글/줄바꿈 유지, 가리지 않는 것 같음)은 사용자보고로 보존했습니다. 같은절차를 다시요청하지 않습니다. 장문·모든필드·회전·실제IME/OS/브라우저버전으로 확대하지 않습니다.

## 남은 실제 작업과 순서

1. 현재 Git/worktree/최신로그를 확인하고 Prototype의 UI38/FM40/UX112/기존32영역 **미실행 조건**을 하나씩 실제화면에 연결합니다. 이번 B10–B19만으로 Phase09 전체를 통과시키지 않습니다. 특히 실제로 긴 표에서의 키보드/스크롤, 200%확대·대비·VoiceOver·실제IME, 오류상태/공통5종의 필요성, A–G 전체 시작조건/안전복제1세대 baseline 비교가 열려 있습니다.
2. 손상초안 원문사본은 보존하지만 현재 전용 조회·내보내기 화면은 없습니다. 정식 백업·강제종료·기기퇴거 복구로 표현하지 않습니다. 독립적으로 구현/검증할 수 있는 범위부터 계속합니다.
3. 과거의 접근불가181은 없는상태를 보존하고, 읽을수있는13내용 및665/141/460의 의미대조는 현재구현에 영향주는 정정/충돌부터 진행합니다. F05원문파싱·F22읽기용구조지도·F47선택사고도구는 기본기록 필수로 승격하지 않습니다. F49영구삭제 정책 전 UI노출 금지; 휴지통/복원은 별도입니다.
4. 필요한 UX gate를 충족한 뒤 **이미 생성한 Supabase**로 시험namespace Auth/온라인CRUD/RLS/소유권/version/revision을 구현·실제수신 검증합니다. 이어 IndexedDB→queue→Sync→Conflict→Canvas/PWA→기기별최적화/통계→Backup/Import→전체QA/E2E/성능→후보판→1.0 순서입니다.
5. 원장 변경 전 새 snapshot을 별도로 저장하고 `python3 scripts/validate-ledger.py --previous <snapshot> --check-sources --output <새파일>` 및 `python3 scripts/test-validate-ledger.py`를 실행합니다. 기존증거·원목록·분류·source hash 변경이력을 보존합니다.

현재는 **구현·검증·배포를 마친 중간 지점**입니다. 전체 마이그레이션이나 안정판1.0이 아니며, 아직 가능한 독립 Prototype 작업이 남아 있습니다. 남은 작업을 외부권한/로그인 차단으로 바꾸어 설명하지 않습니다.
