# 배포 계약

GitHub Pages workflow는 test → typecheck/build → artifact → deploy 순서다. 배포 대상은 main이며 개발 branch의 의미 단위 commit을 보존한다. 저장소 경로는 PAGES_BASE로 지정하며 hash route를 사용한다.

공개 repository는 [study-space-generation2](https://github.com/skmsmjs-netizen/study-space-generation2), 배포 URL은 [GitHub Pages](https://skmsmjs-netizen.github.io/study-space-generation2/)다. 사용자가 공개 코드 저장소·Pages 배포를 승인하고 GitHub CLI 인증을 완료했다. 구현 commit `7b911a4`의 [Actions36591993097](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/36591993097) test/build/deploy 성공과 실제 브라우저의 asset·상세 hash route reload를 확인했다. 문서 변경의 후속 CI는 Git 이력과 Actions에서 별도로 확인한다.

Supabase는 사용자가 프로젝트를 생성했고 dashboard Healthy만 확인했다. 앱 Auth/CRUD/RLS·callback 연결과 서버 수신 검증은 아직 없다. 사용자 DB 비밀번호나 service-role 키는 읽거나 복제하지 않았다. 로컬 demo 프로토타입과 online 개인자료는 분리한다.

.env, 실제 백업, 원본 데이터, 대화, 계정 키는 commit하지 않는다. 향후 VITE_SUPABASE_URL/VITE_SUPABASE_PUBLISHABLE_KEY만 클라이언트 설정으로 사용한다. secret/service-role 키는 어느 프런트 환경변수에도 넣지 않는다.
