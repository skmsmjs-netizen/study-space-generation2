# 개념 전집의 공개 배포

## 최종 공개 결과 — 2026-10-03 09:22 KST

공개 commit `6318aba05e2d6d0b8d43fbe9ce5cc607559d42f7`의 [Pages 실행](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/37079749135)은 build·다섯 화면 환경·deploy 모두 성공했다. [실제 개념 전집](https://skmsmjs-netizen.github.io/study-space-generation2/?v=6318aba-live-0923#/concepts)에서 1,168개 목록과 심슨의 역설 세 장면을 직접 열었다. 검색을 유지한 목록 복귀, 새로고침 후 두 번째 장면 복원을 확인했으며 읽기 확인 중 공부 원장에 쓰는 조작은 하지 않았다. 공개 전송과 운영 계정 대량 이관을 구별한다.

CI 단위 검사 1,297개 통과·선택 성능 검사 1개 생략. WebKit 다섯 환경은 총 1,050사례 중 첫 통과 1,036개, 재시도 통과 6개, 좁은 창 전용 검사의 다른 환경 생략 8개이며 최종 실패 0이다. 새 전집 검사는 다섯 환경 모두 첫 시도에 통과했고 일곱 유형의 대표 90장면을 확인했다. 기존 앱의 재시도 6개는 안정성 잔여로 기록하며 최초 실패·재시도 결과를 보존한다.

실제 공개 `index.html`·전집 자료·전집 화면 JS·CSS의 네 파일을 내려받아 불변 CI 빌드와 바이트 SHA256 일치를 확인했다. 공개 화면의 표시 본문은 `ManSeekSong Paper` 700·18px·justify/start, 서체 loaded, 수식 오류 0·가로 넘침 0이다. 심슨의 역설 첫 두 장면의 읽기 면 높이는 모두 1,045.140625px이다. 배포 직후 열려 있던 이전 파일은 새로운 URL로 다시 불러와 최신 진입 JS `index-Bhjrh3Rg.js`까지 확인했다. 다른 창의 예시 공간 잠금과 기존 개인 기록을 초기화하지 않았다.

최종 정본은 `work/concept-pages-20261003/release-verification.json`, `ci-final.json`, `ci-device-summary.json`, `public-file-verification.json`, `public-ui-verification.json`, `public-simpson.png`다. 최초 감시 도구의 네트워크 시간 초과는 CI 실패가 아니며 최종 API 판정을 별도로 기록했다. Figma 잔여 조판·물리 기기/보조 기술·실제 중학생 이해는 이 배포로 완료했다고 판단하지 않는다. MAN-13은 해당 잔여 때문에 진행 중을 유지한다. 아래는 배포를 준비할 때의 자료 경계와 검사 기록이다.

사용자 「배포」에 따라 최신 공개 maina60cf70(4683471의 후속 과목 연결 포함) 위에 개념 전집 연결을 합친다. 검토된 설명1,168개·1,851장면과 원문 sourceId, 조건/예외/근거/수식을 그대로 제공하며 읽기 전용 전집의 사용은 계정 원장에 쓰지 않는다. 기존 개인 등록 설명은 우선하고 선택한 하나만 검토 미선택 개인 초안으로 가져온다. 저장 보류/충돌 시 복구 초안을 보존한다.

## 공개 자료 경계

src/data/concept-reading-pack.published.json은 배포에 승인된 파생 자료다. 원문 목록은 parser의 필수7필드(id/name/def/ex/insight/type/cat)만 허용한다. 원본 전체 JSON, 원장, notePath/annotations/relations/편집 작업 ID·시각·개인 namespace/소유자는 배포하지 않는다. 원문 관계 원본은 로컬에 보존하고 설명의 도해/관계 표현과 근거는 유지한다.

private pack은 계속 Git에서 제외한다. CI/PAGES_BASE는 검토된 published 분포만 번들에 넣고, private 파일의 존재와 무관하게 private 파일을 읽지 않는다. 로컬 개발은 기존 private pack을 사용할 수 있다. 공개 raw가 달라져 SHA/catalog/edition 저장 ID와 design source hash는 일관되게 재계산하며 원래 sourceId/설명/판본은 유지한다. originalSourceSha256 연결과 투영 동일성/실제 SHA 검사로 기존 개인 원문 및 수정본을 재사용하고 읽던 장면의 원문 기반 키를 유지한다. 계정 자료를 새 형식으로 덮어쓰지 않는다.

파생 원문 SHA256: 2ded555a45b8bae021db7cbfedf4305bafa176f600dd4b616f5a504acdc07bda.
공개 묶음 SHA256: 64f19457f183cc9712793b111595784916e36706932f796c06408b59fe2f3c39.

## 방법과 확인

프로젝트의 종이700/native95%/justify/start와 기존 유형별 reader, Vite의 가상 모듈과 생산 빌드, 같은 불변 빌드의 기기 확인 후 Pages 배포 절차를 재사용한다. 추가한 것은 공개7필드 투영과 기존 개인 원문 연결이다. 이를 공인 표준/학습효과로 표현하지 않는다. 원본 전집을 새 API로 생성하지 않는다.

로컬 타입/생산 빌드·관련19단위·5WebKit환경의7유형90장면을 확인했다. 개인 원문 alias 추가5단위는 원장 무변경/하나의 초안/해시·투영 불일치 거부를 확인했다. 기존 가져오기·관계 표현·종이 본문의50기기 회귀는49개 첫 통과/1개 재시도 통과이며 이 안정성 잔여를 보존한다. 최종 CI/실제 공개 결과는 담당 work/concept-pages-20261003/와 현재 프로젝트 인계에 후속 기록한다. 공유 HEAD/index·다른 과목의 미공개 변경 및 운영 backend는 이번 배포에 포함하지 않는다. 공개 코드/페이지와 운영 계정 저장·물리 기기·중학생 실제 이해·Figma 잔여를 구별한다.
