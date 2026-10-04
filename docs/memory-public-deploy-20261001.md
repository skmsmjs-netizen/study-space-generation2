# 암기항목 API 생성 공개 배포 확인 · 2026-10-01

사용자 ‘배포해’에 따라 기존 허용 GitHub Pages를 확인했다. 실제 시험한 암기항목 생성은 이미 배포 완료된 `2fd73fa52a2ebdceb328815698402d303b8a7133`에 포함되어 있었다. `src/data/study-ai.ts`, `src/ui/topic-memory-generator.tsx`의 Git blob이 현재 시험한 소스와 일치하여 공유 checkout/index를 건드리거나 중복 push/서버 재배포하지 않았다. 병행 타이포그래피 배포 `4656c4b42fa47b6ce84f8b51e9d36373fffb3798`의 진행 상태를 이 기능의 배포 완료 근거로 대신하지 않았다.

확인한 Pages 실행은 https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/36849226266 이다. build/deploy 성공, 단위844통과/1선택 보류, 다섯 WebKit 모사200통과를 실제 로그에서 확인했다. 공개 HTML/진입 JS/CSS/암기시험 JS2개/CSS 총6파일의 SHA256이 성공 CI 산출물과 일치했다.

공개 개인 공간 https://skmsmjs-netizen.github.io/study-space-generation2/?space=personal#/memory-test 에서 기존 로그인으로 API 키 등록됨/생성 사용 켜짐/GPT-6 Luna/월 상한 US$10을 확인했다. 로컬 시험에서 등록한 확인용3항목을 서버에서 불러왔고 공개 주소 새로고침 후에도 보존되었다. 공개 쪽지시험 첫 문항을 열어 질문 먼저/글·스케치 입력/정답 미노출을 확인했다. 응답·채점·새 공부 사건·추가 유료 생성은 실행하지 않았다. 공개 탭을 사용자 결과로 남겼다.

키/토큰/실제 사용자 원문은 공개 저장소나 증거에 넣지 않았다. 물리 기기·장기 사용·학습 효과 검증은 이번 범위 밖이다.

증거: `work/memory-public-deploy-20261001/verification.json`, `public-assets.json`, `ci-success.log`, `public-cards.png`, `public-quiz.png`.
