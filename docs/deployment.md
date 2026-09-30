# 배포 계약

GitHub Pages workflow는 test → backend bundle → typecheck/build → artifact → deploy 순서다. 배포 대상은 main이며 개발 branch의 의미 단위 commit을 보존한다. 저장소 경로는 PAGES_BASE로 지정하며 hash route를 사용한다.

공개 repository는 [study-space-generation2](https://github.com/skmsmjs-netizen/study-space-generation2), 배포 URL은 [GitHub Pages](https://skmsmjs-netizen.github.io/study-space-generation2/)다. 사용자가 공개 코드 저장소·Pages 배포를 승인하고 GitHub CLI 인증을 완료했다. 구현 commit `7b911a4`의 [Actions36591993097](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/36591993097) test/build/deploy 성공과 실제 브라우저의 asset·상세 hash route reload를 확인했다. 문서 변경의 후속 CI는 Git 이력과 Actions에서 별도로 확인한다.

2026-09-30 구현 전환으로 기존 Supabase 프로젝트에 인증 API·owner RLS·원자적 저장 RPC를 적용하고 개인 공부 공간을 연결했습니다. 이메일 확인의 Site URL과 허용 redirect도 공개 앱의 ?space=personal로 적용했습니다. [현재 연결 범위와 확인](online-storage.md)을 따르며, 아래 과거 배포의 미구현 상태는 당시 기록입니다. 실제 개인 계정 저장·재열기 확인은 아직 별도입니다. 사용자 DB 비밀번호나 service-role 키는 읽거나 복제하지 않았고 demo와 개인 자료를 분리합니다.

.env, 실제 백업, 원본 데이터, 대화, 계정 키는 commit하지 않는다. 향후 VITE_SUPABASE_URL/VITE_SUPABASE_PUBLISHABLE_KEY만 클라이언트 설정으로 사용한다. secret/service-role 키는 어느 프런트 환경변수에도 넣지 않는다.

## 2026-09-30 Prototype 후속 배포

현재 앱 구현 `ce6ee432bee65d184f65145414ee4a1e586c838d`를 승인된 main에 push했고 [Actions36597203248](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/36597203248)의 test/build/deploy 성공을 확인했습니다. 공개 Pages에서 `index-3OU7fg4T.js`, 전체표 입력 진입, 주제상세 reload/형제순서 조작을 확인했습니다. 최종 문서 commit의 후속 CI는 Git/Actions 이력 및 별도 인계 출력에 남깁니다. 자동170개와 opt-in 성능1개 미실행, 실제브라우저 B10–B19를 구별합니다.

이번 실행에서 gh인증과 기존 Supabase프로젝트 Healthy를 재확인했습니다. Auth/CRUD/RLS·서버/상대기기 수신은 미구현/미검증이며 로그인만의 차단이 아닙니다. 선행 Prototype UX gate 뒤 온라인을 진행합니다.

## 2026-09-30 보관본·표 복귀·공부 시작 배포

구현 `2d240fc81810a27d28db8313a6b5e4ab931a42bc`를 main에 push하고 [Actions36602848976](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/36602848976)의 test/build/deploy 성공을 확인했습니다. [실행 응답](validation/archive-code-pages-run-20260930.json), [실제 공개 관찰 B27](validation/archive-ui-20260930.md)을 남겼습니다. 공개 직접 경로/새로고침과 `index-CpuoAN_r.js`, 잠금 상태의 읽기 전용 초안 보관본 접근·다시 읽기를 확인했습니다. 다른 작성 창 잠금 때문에 정상 Workspace의 새 F08/표 조작은 로컬 실제 브라우저 검증과 구별하여 공개 미검증으로 남겼습니다. 다른 창이나 데이터를 종료/삭제하여 우회하지 않았습니다.

문서·원장 후속 commit도 main으로 배포하며 마지막 HEAD와 Actions headSha 일치는 저장소 밖 최종 release 응답에 보존합니다. 213검사/타입/빌드·1370행 원장·검증기26개 통과. 정식 Auth/온라인 저장·물리기기·새 성능 측정이 아닙니다.

후속 B28: 사용자가 다른 창 종료를 알려 준 뒤 공개 Workspace에 정상 진입했습니다. 시작 안내→홈→새로고침→같은 주제 기록 복귀와 표 초안의 글/역방향선택 복원을 직접 확인했습니다. 표 시험 문구를 원래 빈칸으로 복원했고 공부 회차는0으로 유지했습니다. 공개 직접 경로 새로고침도 통과했습니다. 앞의 잠금 제한은 과거 관찰로 보존하며 현재 차단 사유가 아닙니다.

## 2026-09-30 실제수신·복귀 후속 배포

cfbd5d8/b50ab37/06b2707/482d302의 main [Actions36608519492](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/36608519492) 성공과 공개자산/직접경로/펼침/검색/메뉴초점 B39를 확인했습니다. 이어 d2e3164 기록필터 복귀와 문서원장을 함께 main 배포합니다. 최종227개 통합·Pages base빌드통과. 최종문서까지 HEAD=remoteMain=ActionsheadSha·실제asset 확인은 프로젝트 저장소밖 `outputs/gen2-execution-20260930-023030/final-release.json` / `final-pages-run.json` 정본을 따릅니다. 앱의 최종JS는 index-EUgNU2i0.js, CSS index-BAib381D.css입니다. 과거 로그인/잠금상태를 현재차단으로 쓰지 않으며 Auth/CRUD/RLS/물리수신은 여전히 미검증입니다.
