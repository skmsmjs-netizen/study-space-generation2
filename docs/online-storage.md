# 개인 공부 공간의 실제 서버 저장 · 2026-09-30

사용자의 구현 전환 요청에 따라 기존 입력 화면을 인증된 개인 공간에 연결했습니다. 공개 앱 `#/account` 또는 시연 공간의 ‘내 공부 공간’에서 시작합니다. Supabase 프로젝트 lbuiwotjisbzgflixjvg의 study-command 함수와 PostgreSQL 원장을 사용합니다. 시연 자료를 개인 자료에 자동으로 가져오지 않습니다. 이메일 확인의 Site URL/허용 redirect를 공개 앱의 ?space=personal로 적용했으며 새 탭에서도 개인 공간으로 돌아옵니다.

## 실제 연결

- 프론트엔드: 이메일 로그인/가입(‘처음 사용하기’ 즉시 진입·계정 만들기 제출에서 검증), 사용자별 공간·초안·최근 위치 분리, 기존 과목/목차/공부 기록/서술/메모 입력, 서버 저장 상태·재시도·다시 불러오기·보관본 다운로드·로그아웃.
- 명령: UI는 StudyRepository.execute로 먼저 변경과 미전송 명령을 같은 로컬 저장에 보관합니다. 서버 응답을 받은 뒤만 ‘서버에 저장했습니다’로 표시합니다. 임의 snapshot을 서버에 보내 덮어쓰지 않습니다.
- 서버: Auth /user가 확인한 userId만 사용하고 personal/test namespace만 허용합니다. 동일 도메인 명령·버전 검사를 거쳐 study_commit 트랜잭션에서 사용자/namespace 잠금, sequence 조건, opId별 동일 payload, 원장과 operation receipt를 함께 저장합니다.
- DB: auth.users FK, 두 테이블의 owner RLS, authenticated 직접 쓰기/RPC 권한 거부, service_role만 commit 허용. service_role은 서버 환경 변수에서만 사용하고 프론트에는 공개 URL·publishable key만 있습니다.
- 보존: UTF16 원문·NUL·고립 surrogate·CRLF·ID·수정 이력은 압축된 JSON envelope 안에 그대로 보존합니다. JSONB 바깥 metadata에는 소유권과 현재 operation 정보만 둡니다. 이전 raw snapshot도 읽습니다.
- 실패/충돌: 미전송 원문을 유지하고 재시도합니다. 다른 저장 sequence가 확인되면 자동 덮어쓰기 대신 local/base/pending/server를 보관하고 비교·내려받기·명시적 서버 자료 열기를 제공합니다.

## 적용과 확인

migration 202609300001_study_storage.sql을 기존 프로젝트에 추가 적용했습니다. 실제 운영 DB에서 가짜 test UUID를 BEGIN/ROLLBACK으로 격리해 중복 저장 1회, stale sequence 거부, 다른 사용자 읽기 거부, 브라우저 쓰기/RPC 거부를 확인했습니다. 실제 사용자 자료를 업로드하지 않았습니다.

Edge Function 코드는 npm run build:backend로 만들며 index.ts 생성물을 함께 보관합니다. Dashboard 배포 당시 편집기 중복 코드로 BOOT_ERROR가 발생했고, 전체 교체 후 OPTIONS 204와 미인증/잘못된 토큰 401을 실제 URL에서 확인했습니다. 레거시 JWT gateway 검증은 비활성화되어 있으나 함수 자체에서 모든 실제 요청을 Auth /user로 확인합니다.

격리 배포본의 기존 자동324개 통과/선택 성능1개 미실행에 개인 진입 회귀3개를 추가했습니다. 진입·입력 통합5개와 타입·Pages base·backend build를 확인했고 최종 전체 수치는 배포 CI와 verification.json을 따릅니다. 그중 저장소/실제 PostgreSQL WASM/입력 화면 및 진입 통합21개는 원문 보존, 원자성, 재시도, 충돌, 세션 실패, 사용자 분리를 다룹니다. 운영 DB test와 자동검사를 실제 개인 계정의 전체 로그인→저장→새로고침 확인으로 확대하지 않습니다.

## 직접 남은 구현과 확인

실제 사용자의 이메일 로그인과 저장·재열기는 아직 확인하지 않았습니다. 대시보드 로그인은 앱 로그인과 다릅니다. 현재 초안·추천 설정은 기기 저장이며 IndexedDB, 완전한 오프라인 시작, 자동 다기기 동기화, 충돌 병합, 정식 복구/가져오기는 다음 구현입니다. 큰 원장 전체를 매번 전송하는 현재 snapshot 방식은 대규모 개인 데이터에 맞춘 정규화/증분 API로 발전시켜야 합니다. Canvas/PWA, 일정·시험·과제·출석 원장, 자료 가져오기 등 기존 전체 잔여를 이번 완료로 바꾸지 않습니다.

비밀 키·DB 비밀번호·사용자 세션 토큰을 작업 자료에 넣지 않습니다. 실제 배포 head/CI/API·화면 증거는 저장소 밖 outputs/20260930-implementation-transition/verification.json에 기록합니다.
