# 개인 공간 저장·인증·보관 복구 보수 (2026-10-01)

사진에 표시된 창별 `setItem` 용량 초과에 이어, 사용자가 관련 문제 전체 해결을 요청한 범위이다. 기존 IndexedDB 원장과 원문 보존 계약을 유지한다.

- HTTP401에만 같은 사용자로 세션을 한 번 갱신하고 같은 명령·opId로 재시도한다. 매 요청은 검사한 계정 토큰에 고정한다. 다른 계정으로 바뀐 응답은 적용하지 않는다.
- 네트워크·응답 시간 초과·서버 불능·로그인 만료를 구분한다. 결과를 모르는 쓰기는 즉시 반복하지 않고 기존 서버 영수증 확인을 거친다. 브라우저 저장 오류는 인증 오류로 바꾸지 않는다.
- 이 기기의 글을 보관하고 서버 자료를 여는 행동은 durable commit 완료 뒤 성공과 새로고침을 허용한다. 실패 시 두 원문·미전송 명령·충돌을 보존하며 재시도할 수 있다.
- 복구 다운로드는 같은 소유자의 legacy 원문·IndexedDB 다른 창 원장·보관 사본·손상 문자열을 모두 포함한다. 다른 값은 합치거나 버리지 않는다. 계정 전환이나 화면 종료 뒤 다운로드/reload는 취소한다.
- 초기 로그인 확인 예외가 발생해도 로딩에 머무르지 않고 오류와 다시 로그인할 수 있는 화면을 제공한다.
- 자료/AI의 단기 인증 클라이언트는 작업 후 timer·구독·BroadcastChannel을 정리한다.

선택 근거는 기존 full-backup 소유자 필터/readonly 수집, 설치된 Supabase SDK2.117.2 및 [refreshSession](https://supabase.com/docs/reference/javascript/auth-refreshsession), [Edge Functions 오류 처리](https://supabase.com/docs/guides/api/handling-errors-in-supabase-js)이다. 기존 서버 권한·키·ID·저장 namespace를 바꾸지 않는다.

관련 단위 회귀는401·동시 갱신·계정전환·응답 유실·quota+IDB abort·원문 보관·다운로드 누락을 확인한다. 같은 배포 빌드의 다섯 WebKit 환경에서 용량 초과+인증 거부→갱신1회→같은 opId 저장→긴 한국어/공백/줄바꿈과 이력→새로고침을 확인했다. 실제 개인 자료를 삭제·초기화하거나 합성 기록을 넣지 않았다.

당시 공개 화면의 일시 저장 오류는 보수 시작 시 이미 '서버에 저장됨'으로 회복됐다. 이전 오류의 원인이401이었다고 단정하지 않는다. CI·공개 배포·자산 일치·공개 재접속 결과는 `work/storage-sync-20261001/`과 MAN-8/MAN-7에 별도로 기록한다. 물리 기기·다기기 수신·장기 사용 효과는 이 합성 검사와 구별한다.

## 배포 검사 환경의 설치 실패 보수

Ubuntu 패키지 다운로드가 오래 걸리는 기존 실행과 공식 Playwright 컨테이너의 `node-pty` 컴파일 도구 누락을 구별했다. 기존 실행의 취소·재시도와 실패 로그는 삭제하지 않는다. 병행 작업에서 먼저 게시한 `876486f`와 `fdd3442`를 재사용하고 이 대화의 중복 CI 커밋은 공개하지 않았다.

`devices`는 이미 단위 검사와 빌드를 통과한 `verified-build`를 내려받아 Vite preview로 제공한다. 합성 fixture만 esbuild를 사용하고 이 실행 경로에서 native node-pty/ONNX를 호출하지 않으므로, 해당 작업에만 `npm ci --ignore-scripts`와 `npm rebuild esbuild`를 적용한다. build 작업의 정상 설치·단위 검사·앱/서버 빌드와 다섯 WebKit 프로필의 전체 검사는 유지한다. 선택 근거는 [Playwright 공식 CI 컨테이너](https://playwright.dev/docs/ci#via-containers), [npm 설치 스크립트 옵션](https://docs.npmjs.com/cli/v11/commands/npm-ci/#ignore-scripts), [esbuild 설치 옵션](https://esbuild.github.io/getting-started/#additional-npm-flags)과 실제 실행 파일의 import 경로다.

2026-10-02 공개 마감: `fdd3442` / [Pages36888201583](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/36888201583) 성공. 단위968통과·성능1생략, 다섯 WebKit 각75/총375통과, 공개 주요9파일 일치. 실제 개인 공간의 서버 기록 재조회와 재접속 모두 서버에 저장됨·alert0이며 기존 초안 복원도 확인했다. 원본 증거와 제한은 `work/storage-sync-20261001/result.md` 및 `verification.json`에 유지한다.
