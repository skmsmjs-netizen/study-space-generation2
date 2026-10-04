# 백엔드 개발 — 조건부 조회와 요청 입력 경계

2026-10-02 사용자 「너는 백엔드를 개발해」에 대한 구현 기록이다. [MAN-20](https://linear.app/manseeksong/issue/MAN-20/백엔드-조건부-조회와-요청-입력-경계-구현)에서 추적한다. 현재 인증·가입 승인·개인 원장·원자적 명령/묶음·중복 요청 처리를 재사용했다. 프론트엔드 병행 작업의 화면·공통 부품은 변경하지 않았다.

## 구현한 동작

기존 `knownSequence`는 Edge→브라우저 응답만 줄였고, DB→Edge의 packed state 전달·압축 해제·전체 검증은 반복했다. `CommandBackend.readConditional`과 `study_read_workspace_conditional(uuid,text,bigint)`를 연결해 이 반복을 제거했다.

- Auth가 확인한 사용자·현재 승인 상태를 먼저 확인한다. SQL의 `study_require_access`는 기존 승인 행 `FOR SHARE` 잠금을 유지한다.
- 사용자·공간의 기본키로 한 행을 찾고, 한 SELECT의 CASE에서 버전과 본문을 함께 판단한다. 같은 버전이면 `unchanged/sequence/userId/namespace`만 반환한다. 변경된 버전은 기존 packed state를 반환한다.
- handler는 marker의 사용자·공간·안전한 정수 버전을 확인한다. 변경본과 빈 공간은 기존 검증을 거친다. 기존 전체 조회, 단건/묶음 저장, 원문·ID·수정 이력·미전송 명령 계약을 유지한다.
- 새 RPC가 없는 `PGRST202`/`42883`와 정확한 함수 부재 메시지가 함께 있을 때만 기존 RPC로 돌아간다. 권한 거부·시간 초과·내부 함수 누락은 숨기지 않는다.
- 새 RPC는 service_role만 호출한다. 기존 테이블 권한·RLS·쓰기 함수·저장 형식은 바꾸지 않는다. 함수의 `search_path`는 비우고 테이블·함수를 스키마로 한정한다.

동일 버전의 전체 본문을 매 조회 재검증하지 않는 것은 의도한 변경이다. 정상 쓰기는 기존 서버 검증과 sequence 증가를 거치며 변경된 읽기는 전체 검증한다. 운영자가 sequence를 유지한 채 본문만 직접 수정하는 비정상 경로를 매 poll 탐지한다는 보장은 하지 않는다. 실제 운영 지연·메모리 절감률은 아직 측정하지 않았다.

`request.text()`로 본문 전체를 받은 뒤 길이를 검사하던 부분은 `readCommandRequestText`로 바꿨다. 기존4,000,000 UTF-16 단위 상한과 한글 허용량을 유지하면서 전송 상한을12,000,000바이트로 둔다. UTF-16 한 단위의 최대 UTF-8 크기에서 유도한 호환 한도이며 공인 성능 수치가 아니다.

- Content-Length는 조기 거부의 보조 정보이고 실제 청크 길이를 계속 확인한다. 초과하면 나머지 읽기를 취소한다. 한글·이모지의 바이트 분할, BOM, 불완전 UTF-8은 기존 Request.text 해독 동작과 맞춘다.
- abort 리스너 한 개를 사용하고 청크마다 같은 미완료 Promise에 반응을 누적하지 않는다. producer의 cancel 완료가 멈춰도 이미 대기 중인 읽기를 끝낸다.
- 해독한 문자열은32,768 UTF-16 단위/64KiB 버퍼로 합쳐 보관한다. 작은 청크 수에 비례한 문자열 보관을 피하며 현재 문자 한도에서 최대123개다.
- JSON null/배열/원시 값/action 누락/구문 오류는 `INVALID_REQUEST`400, 서버 읽기 실패는 `SERVER_ERROR`503이다. 내부 오류나 입력 원문을 오류 응답에 넣지 않는다.

## 변경 파일

- `src/server/command-handler.ts`, `src/server/request-body.ts`
- `supabase/functions/study-command/entry.ts`
- `supabase/migrations/20261001171008_conditional_workspace_read.sql` — 기존 Supabase CLI로 새 파일을 생성했다.
- `src/server/conditional-load.test.ts`, `src/server/request-body.test.ts`, `src/server/conditional-read-storage.test.ts`, `src/server/supabase-entry.test.ts`

## 확인 결과

- 최종 변경과 기존 어댑터의 선택 회귀101개 통과. PostgreSQL/PGlite에서 사용자·공간 분리, 직접 브라우저 RPC 거부, 승인 취소, 원문 UTF-16·이력, 같은/다른 버전, 빈 공간, 기존 RPC 호환을 확인했다.
- 입력 판독 회귀에는 실제4백만 한글,7만 개 이상1바이트 청크, 크기 초과 조기 취소,4만 청크 뒤 abort와 멈춘 producer를 포함했다.
- 서버 전체와 Supabase 어댑터 검사에서217개 통과 후 로컬 포트가 필요한3개가 sandbox listen EPERM으로 실패했다. 필요한 로컬 포트 권한으로 그3개만 재실행하여 통과했다. 실패 이력은 `tests.log`에 보존했다.
- 최종 타입 검사와 웹앱 빌드 성공. 빌드는 `work/backend-20261002/web-dist`에 분리했다. 기존 Lottie eval/혼합 import 경고는 이 변경에서 해결한 것으로 보고하지 않는다.
- 운영 반영용 실제 번들에 합성 Auth transport와 PGlite를 연결한12개 검사가 통과했다. 저장→조건부 재조회→원문 수정→응답 유실 재시도→중복 방지→권한 거부→구버전 호환을 확인했다. 운영 Auth나 실사용 계정의 증거는 아니다.
- 다섯 환경 전체 검사 실행은 수학 벡터와 수학 확대 경로의90초 초과2개를 관측한 뒤 턴 중단으로 끝났다. 최종 JSON 보고서가 없으며 전체 통과로 처리하지 않는다. 백엔드 변경 파일은 이 화면을 바꾸지 않았고 프론트 병행 작업을 덮어쓰지 않았다. 로그는 `devices-retry.log`, 실행 폴더는 `work/device-runs/run-E2lgm4`다.

## 운영 적용과 실제 확인 — 2026-10-02 승인 후 완료

운영 조회에서는 `study-command` v33 ACTIVE와 새 조건부 RPC 부재를 확인했다. 운영 번들과 로컬 도메인 사이에 병행 차이가 있어 전체 로컬 번들을 덮어쓰지 않았다. `work/backend-20261002/compose-release.mjs`는 운영 도메인 prefix와 기존 사진 목차 보조 코드를 그대로 보존하고 이번 판독기·handler·entry만 결합한다. 명령 목록 동일성, 최상위 이름 충돌, 파싱, SQL 연결12검사를 확인했다. 원본/후보/결합본 해시는 `release-composition.json`에 있다. 결합본은 해당 v33 기반의 적용물이며 이후 운영 버전이 바뀌면 새 운영본과 다시 대조해야 한다.

**사용자 「운영 DB·서버 반영 승인」 후 기존 운영 프로젝트에 적용했다.** 적용 직전 운영 v33 소스가 준비본과 동일함을 확인했다. 신규 RPC 마이그레이션의 운영 이력은 `20261001173455_conditional_workspace_read`이며 로컬 원본은 CLI가 생성한 `20261001171008_conditional_workspace_read.sql`이다. 두 식별자는 같은 SQL의 준비·운영 적용 이력이다. 이미 적용한 함수를 로컬 파일 시각만 보고 재적용하지 않는다.

`study-command`는 **v34 ACTIVE**로 반영했다. 운영에서 다시 받은 소스와 배포 묶음은 바이트 단위로 동일하며 SHA-256은 `1773e73b9102264a3104137f8a6e46e21fa775c3ff4b516bd3e09dc95850d82f`다. 기존 `/auth/v1/user` 인증, 도메인·사진 목차 기능을 보존했다. 현재 운영본은 `work/backend-20261002/deployed-v34-index.ts`에 보관한다. 다음 서버 배포는 이 운영본과 재대조하며 다른 미배포 도메인 변경을 섞지 않는다.

- 실제 운영 PostgreSQL에서 무작위 ID의 합성 사용자 두 명만 만든 단일 트랜잭션으로 **23개 조건을 통과**했다. 같은/다른 버전, 두 소유자·두 공간, 빈 공간, 기존 저장·조회, 원문·이력의 packed state 전체 동일성, 응답 유실 재시도, 중복 ID의 다른 내용·오래된 버전 거부, 승인 취소를 확인했다.
- anon·authenticated의 새 RPC 실행 거부와 service_role의 테이블 직접 읽기 거부를 실제 역할 전환으로 확인했다. 새 RPC의 service_role 실행권한·빈 search_path도 운영 메타데이터로 확인했다.
- 마지막 `ROLLBACK` 이후 합성 사용자의 Auth·프로필·승인·공간·요청 receipt·권한 이력 **6종 모두 잔존 행 0**이다. 기존 사용자의 계정·원문은 조회·수정하지 않았다. 검사 SQL과 생성한 합성 ID는 `production-probe.sql`·`production-probe-plan.json`에 있다.
- 실제 공개 HTTPS 엔드포인트에서 **4개 조건**(OPTIONS 204, 잘못된 메서드 405, 인증 없음/무효 토큰 401)과 CORS·no-store를 확인했다. sandbox DNS 제한으로 첫 요청은 실행되지 않았고 네트워크 허용 후 통과했다. `production-http.json`이 근거다.
- 유효한 계정으로 로그인한 브라우저의 저장 왕복은 이번 운영 반영에서 실행하지 않았다. 실제 DB 검사, 정확한 배포 번들의 합성 Auth/PGlite 검사12개, 공개 HTTP 인증 거부 검사를 구별한다. 원문 NUL·고립 surrogate의 UTF-16 복원은 번들 검증 근거이며 운영 DB에서는 encoded state 전체 동일성을 검사했다.

운영 보안 Advisor도 실행했다. 새 함수에 관한 지적은 없었다. 기존의 RLS 정책 없는 내부 테이블8개, public의 pg_net1개, authenticated가 호출하는 SECURITY DEFINER 함수2개, 유출 비밀번호 차단 미설정1개가 보고됐다. 두 기존 함수는 현재 신원/승인 및 원본 파일 경로·세션을 검사함을 정의에서 확인했으며 이번 RPC의 공개 실행권한을 뜻하지 않는다. 전체 보안 준수나 이 기존 지적들의 해소를 주장하지 않는다. 근거는 `production-advisors.json`, 안내는 [RLS 정책 검사](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy), [확장 스키마](https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public), [함수 호출권한](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable), [비밀번호 보호](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)다.

최초 운영 시도는 자동 승인 검토가 개발 요청만으로 운영 스키마/역할 권한 변경·배포 승인이 없다고 거절하여 중단했다. 우회하지 않았고 이번 사용자의 명시 승인 후 반영했다. 테이블 초기화, 기존 데이터 이관·삭제, 공개 프론트 배포, AI 유료 호출은 수행하지 않았다.

## 별도 발견 잔여

이번 완료는 조건부 조회와 입력 경계에 한정한다. 원본 파일을 소유한 계정의 탈퇴 경로에서 Storage 정리와 중단 후 재개가 연결되지 않은 별도 누락을 확인했다. 현재 `withdrawAccount`는 DB 탈퇴 함수만 호출한다. 마지막 관리자 보호·새 업로드 차단·본인 파일만 Storage API로 정리·실패 후 재개·최종 계정 삭제를 함께 설계해야 하므로 임의로 파일 삭제 순서를 추가하지 않았다. 실제 계정 삭제 시험은 하지 않았다. 큰 변경 시 전체 snapshot 직렬화/저장 비용, 실제 다기기/장기 성능도 이번 조건부 읽기로 완료되지 않는다.

## 적용한 기준

현재 [책임 분리](architecture.md#프론트엔드백엔드-책임-분리)·[데이터 계약](data-contract.md)·[저장 성능](sync-performance.md), Supabase 스킬과 PostgreSQL 최소 권한/기본키 조회 지침을 재사용했다. 새 라이브러리나 DB 이관은 도입하지 않았다.

- [Supabase Database Functions](https://supabase.com/docs/guides/database/functions): 함수 호출과 권한·search_path. 기존 검증된 서버 인수를 받는 service-role 전용 구조를 유지한다.
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security): 소유권·승인과 테이블/함수 실행권한을 구별한다.
- [PostgREST Errors](https://docs.postgrest.org/en/stable/references/errors.html): 함수 부재 오류와 권한/서버 오류를 구별한다.
- [Supabase Changelog](https://supabase.com/changelog): 현재 변경과 관련된 DB/API 권한 조건을 확인했다.
- [Supabase 사용자 관리](https://supabase.com/docs/guides/auth/managing-user-data), [Storage 삭제](https://supabase.com/docs/guides/storage/management/delete-objects): 파일 소유 계정 탈퇴의 별도 잔여 근거다.

실행 자료: `work/backend-20261002/verification.json`, `focused-tests.json`, `typecheck.log`, `build.log`, `release-integration.json`, `release-composition.json`, `production-verification.json`, `production-probe-plan.json`, `production-probe.sql`, `production-http.json`, `production-advisors.json`.
