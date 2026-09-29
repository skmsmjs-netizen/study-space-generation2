# 배포 계약

GitHub Pages workflow는 test → typecheck/build → artifact → deploy 순서다. 배포 대상은 main이며 개발 branch의 의미 단위 commit을 보존한다. 저장소 경로는 PAGES_BASE로 지정하며 hash route를 사용한다.

원격 repository 및 Pages URL이 실제 만들어지기 전 '배포됨'이라고 표시하지 않는다. 현재 GitHub connector 계정은 연결됐으나 사용 가능한 repo가 없고 브라우저 생성 화면은 로그인 상태가 필요하다. Supabase도 로그인 후 프로젝트 연결이 필요하다. 로컬 demo 프로토타입과 online 개인자료는 분리한다.

.env, 실제 백업, 원본 데이터, 대화, 계정 키는 commit하지 않는다. 향후 VITE_SUPABASE_URL/VITE_SUPABASE_PUBLISHABLE_KEY만 클라이언트 설정으로 사용한다. secret/service-role 키는 어느 프런트 환경변수에도 넣지 않는다.
