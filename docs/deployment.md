# 배포 계약

GitHub Pages workflow는 test → typecheck/build → artifact → deploy 순서다. 배포 대상은 main이며 개발 branch의 의미 단위 commit을 보존한다. 저장소 경로는 PAGES_BASE로 지정하며 hash route를 사용한다.

공개 repository는 [study-space-generation2](https://github.com/skmsmjs-netizen/study-space-generation2), 배포 URL은 [GitHub Pages](https://skmsmjs-netizen.github.io/study-space-generation2/)다. 사용자가 공개 코드 저장소·Pages 배포를 승인하고 GitHub CLI 인증을 완료했다. 구현 commit `7b911a4`의 [Actions36591993097](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/36591993097) test/build/deploy 성공과 실제 브라우저의 asset·상세 hash route reload를 확인했다. 문서 변경의 후속 CI는 Git 이력과 Actions에서 별도로 확인한다.

Supabase는 사용자가 프로젝트를 생성했고 dashboard Healthy만 확인했다. 앱 Auth/CRUD/RLS·callback 연결과 서버 수신 검증은 아직 없다. 사용자 DB 비밀번호나 service-role 키는 읽거나 복제하지 않았다. 로컬 demo 프로토타입과 online 개인자료는 분리한다.

.env, 실제 백업, 원본 데이터, 대화, 계정 키는 commit하지 않는다. 향후 VITE_SUPABASE_URL/VITE_SUPABASE_PUBLISHABLE_KEY만 클라이언트 설정으로 사용한다. secret/service-role 키는 어느 프런트 환경변수에도 넣지 않는다.

## 2026-09-30 Prototype 후속 배포

현재 앱 구현 `ce6ee432bee65d184f65145414ee4a1e586c838d`를 승인된 main에 push했고 [Actions36597203248](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/36597203248)의 test/build/deploy 성공을 확인했습니다. 공개 Pages에서 `index-3OU7fg4T.js`, 전체표 입력 진입, 주제상세 reload/형제순서 조작을 확인했습니다. 최종 문서 commit의 후속 CI는 Git/Actions 이력 및 별도 인계 출력에 남깁니다. 자동170개와 opt-in 성능1개 미실행, 실제브라우저 B10–B19를 구별합니다.

이번 실행에서 gh인증과 기존 Supabase프로젝트 Healthy를 재확인했습니다. Auth/CRUD/RLS·서버/상대기기 수신은 미구현/미검증이며 로그인만의 차단이 아닙니다. 선행 Prototype UX gate 뒤 온라인을 진행합니다.
