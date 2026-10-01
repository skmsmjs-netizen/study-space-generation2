# Pages 배포 검사에서 확인한 보완 · 2026-10-01

기존 Pages 통합본의 실제 CI 실패를 보완한다. 시험 연습과 Canvas 개념 카드의 원문·ID·초안·저장 명령은 유지한다. 공유 작업 폴더의 미배포 변경을 일괄 복사하지 않고 공개 main의 별도 release 사본에서 작업했다.

- 개인 창 검사 모형에서 IndexedDB 모듈의 실제 export를 유지하고, Anki 재시도 뒤 파일 입력이 다시 활성화된 것을 기다린다. IndexedDB가 없는 환경에서도 localStorage 창 저장을 열 수 있게 한다. 이 보완은 병행 통합본 1f40fd1·6ab5be4에 반영됐으며 관련 13개 검사가 통과했다.
- 수식의 기존 1.08em 크기를 공통 글자 토큰으로 연결했다. d98a6c2의 CI는 단위905개/빌드가 통과했지만 기기282통과·3실패로 공개하지 않았다. 실패 원문과 21.1분 실행 이력을 보존한다.
- 글자200%에서 기록의 두 열, 수학 제어의 두 열과 암기 필터가 좁은 실제 본문 공간을 넘쳤다. [CSS size container query](https://www.w3.org/TR/css-contain-3/#size-container)에 따라 본문을 이름 있는 inline-size 컨테이너로 두고 40rem 이하에서 해당 조작을 한 열로 제공한다. 글자 크기·원문을 줄이거나 가려서 폭만 맞추지 않는다. 일반 넓은 본문은 기존 열 배치를 유지한다.
- 확대된 필기 종이에 이름 있는 키보드 초점 영역을 추가했다. SVG 원문·그림·확대/스크롤/저장 상태를 유지한다. Safari의 스크롤 가능한 영역에 키보드로 접근해 우측 이동하는 회귀를 연결했다.
- Canvas·Plotly의 크기 조정이 비동기이므로 검사에서 갱신 후 같은 1px 한계를 판정한다. 실제 지속되는 넘침과 접근성 위반의 실패 기준은 유지한다.
- Pages의 다섯 프로필은 [GitHub Actions matrix](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations)에서 같은 단일 빌드를 각각 검증한다. 다섯 프로필의 모든 검사가 성공해야 Pages 업로드/배포가 실행된다. 기기별 보고서·실패 trace·빌드 해시를 보관하며 제외나 실패 허용을 추가하지 않는다.

최종 배포 commit·Actions·검사 수·공개 HTML/JS/CSS 해시와 화면은 공통 프로젝트의 outputs/20261001-pages-deploy/verification.json에 기록한다. 물리 기기·한국어 IME·VoiceOver·학습 효과와 자동 검사의 범위를 구별한다.
