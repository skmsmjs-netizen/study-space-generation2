# 개인 공부 공간의 실제 서버 저장 · 2026-09-30

## 2026-10-01 관리자 가입 승인 — 서버 적용

`src/server/account-access.ts`/`src/data/account-access.ts`/`src/ui/account-administration.tsx`와 migration `202610010004_account_approval.sql`에 승인 대기·이용 허용·가입 거절·이용 중지를 구현했습니다. PersonalSpace는 기록/작성 잠금을 열기 전에 승인 상태를 확인하고 관리자에게만 가입 계정 관리 버튼을 제공합니다. 첫 관리자 지정은 확인된 소유자 이메일과 일치하는 한 계정에 대한 비공개 SQL 초기 설정으로만 처리합니다.

서버 load/execute, owner RLS, DB read/commit의 승인 행 잠금에서 조건을 강제합니다. service_role 직접 원장 접근·내부 commit 실행권을 회수하므로 이전 API의 직접 테이블 읽기도 실패합니다. 관리자 변경에는 확인된 Auth actor·관리자 역할·대상 version·이메일 확인과 수정 이력 transaction을 적용합니다. 기존 기록·원장·초안은 삭제하지 않습니다.

관련 자동40개·타입/앱/backend build 및 격리 브라우저 예시 흐름을 확인했습니다. 병행 인계에서 로그인/운영 갱신 완료를 확인한 뒤 실제 접근과 소유자 확인 완료 계정 한 개를 대조했습니다. 운영 DB·함수·관리자 등록·공개 UI 배포를 완료했습니다. main d49ea0101ef2c2f0dae5b3d6a53fe8d9cfe61673과 Actions36807384846 성공 및 공개11개 자산 일치를 확인했습니다. 실제 HTTP13항목에서 권한 거부와 승인 후 저장·중지 후 차단·재허용 후 원문 보존·관리자 목록을 확인하고 시험 계정을 정리했습니다. 적용 순서와 비공개 관리자 초기 설정은 프로젝트 outputs/20261001-account-approval/completion.md 및 administrator-setup.private.sql에 있습니다. 개인 공간 진입에는 온라인 승인 확인이 필요합니다.

## 2026-10-01 계획·Canvas 실제 인증 왕복 확인

기존 허용 서버에 계획/Canvas migration2개와 `study-command` version3을 적용했습니다. 사용자별 권한·현재 함수 Auth 확인은 유지합니다. 격리된 가상 Auth 계정의 `test` 공간에서 현재 공개 SDK·저장 어댑터로 로그인→공부 기록/원문/계획/Canvas 저장→새 로그인 세션·빈 로컬 저장소에서 재열기를 확인했습니다. 중복 요청/버전·타인 접근·브라우저 직접 쓰기/RPC 거부도 실제 HTTP/SDK로 확인했습니다. 시험 계정과 원장은 정리 완료했으며 실제 개인 기록은 사용하지 않았습니다. 결과는 프로젝트 `outputs/20261001-server-authenticated/verification.json`입니다.

앞 절의 'CLI 인증 보류·운영 추가 migration/함수 미적용'은 이번 반영 이전 상태입니다. 실제 사용자 계정의 물리 기기 확인·자동 다기기 Sync·IndexedDB 단독 전환/PWA 등 독립적인 미완은 그대로입니다.

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

## 2026-10-01 기기 보관 추가 · 로그인 보류 중 개발

`IndexedPersonalJournal`은 기존 localStorage 원장을 유지하고 원문·상태·미전송 명령을 IndexedDB 하나의 record/transaction으로 함께 보관합니다. `openPersonalRepository`는 검증 후 보관을 마치고 개인 화면을 엽니다. `PersonalRepository.flush`는 DB commit 뒤만 서버에 전송하고 서버 응답 후의 갱신도 보관합니다. DB 실패는 서버 저장 완료로 표시하지 않으며 기존 동기식 저장/초안 보존은 유지합니다. 서버 전송 실패·응답 유실·복수 명령 재시도·DB abort·사용자/키 분리·기존 자료 복원·stale DB 거부의 관련 자동14개와 실제 브라우저의 격리 test 흐름을 확인했습니다.

두 저장의 원문이 다르면 기존 DB 원문을 같은 사용자 key의 recovery에 보관하고 다운로드의 `deviceRecovery`에 넣습니다. 기존 localStorage 원문이 손상되면 이를 덮어쓰거나 DB로 조용히 교체하지 않습니다. 기존 key가 아예 없을 때만 DB 보관본을 읽고 도메인·소유권·미전송 재생을 검증합니다. IndexedDB가 제공되지 않으면 기존 저장을 사용합니다.

이 추가 보관은 정식 백업·localStorage quota 해소·IndexedDB 단독 저장·모든 초안 이관·오프라인 인증/시작·PWA·자동 다기기 Sync 완료가 아닙니다. Supabase CLI 로그인과 운영 함수/추가 migration 갱신, 실제 계정 확인 및 공개 반영은 이번 작업에서 수행하지 않았습니다. 최신 인계와 `outputs/20261001-indexed-personal-journal/`을 따릅니다.


## 2026-10-01 저장·동기화 호출 개선

조건부 버전 조회·제한된 순차 묶음 전송·부분 확정 뒤 재접속 복구와 요청 시간 측정을 현재 어댑터/서버 처리 경로에 연결했습니다. 원문·ID·개별 이력·권한·충돌 보존 및 이전 서버의 단건 경로를 유지합니다. 구현·검증과 운영 미반영, 다음 저장 구조 조건은 [저장·동기화 성능](sync-performance.md)을 따릅니다.
