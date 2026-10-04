# 여러 창의 개인 공간과 입력 위치 복원

2026-10-01 사용자 “그냥 항상 열리게 하면 안되? 왜 이러는거야”, “어디서부터 입력해야하는지를 불러와줘도 되는거잖아” 요청을 반영합니다.

원인은 PersonalSpace가 같은 origin/계정의 exclusive writer Web Lock을 공간의 전체 수명 동안 유지하던 구현입니다. 실제 작성 여부와 무관하게 다른 창의 진입을 막았으며 가입 확인 뒤 열린 창에서도 반복될 수 있었습니다. 창 전체 차단과 최초 가입 탭으로 돌아가라는 안내를 제거했습니다. 서버 로그인·승인·소유자 확인은 유지합니다.

현재 방식은 기존 PersonalRepository, IndexedPersonalJournal, 서버 CAS/operation receipt, 탐색·편집 위치 복원을 재사용합니다. [Web Locks의 W3C 작업 초안](https://w3c.github.io/web-locks/)과 [MDN sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)를 확인했습니다. Web Locks는 브라우저의 협력적 자원 잠금이며 서버 권한 보장이 아닙니다. sessionStorage는 탭 복제로 복사될 수 있으므로 탭 식별자만 믿지 않고 창별 원장 키에 ifAvailable lease를 사용합니다. 새 라이브러리는 도입하지 않았습니다.

- 공간의 독점 잠금을 창별 outbox lease로 좁힙니다. 사용 중인 키는 새 창에서 다른 키를 사용하고, 닫힌 창의 키는 재사용합니다. Web Locks가 없어도 새 독립 키로 엽니다. 일반적인 반복 방문에서 불필요하게 키를 계속 늘리지 않습니다.
- 기존 online:v1 원장은 읽어 사본으로 이어가며 원래 키와 원문은 변경하지 않습니다. localStorage/IndexedDB의 창별 자료·명령·보관본은 함께 보존합니다. 다른 창의 미확정 입력을 최신 서버 저장으로 표시하지 않습니다.
- 새로운 서버 기록에 대한 재적용은 명령이 실제 바꿀 엔터티의 원본이 그대로일 때만 합니다. 같은 엔터티의 변경이나 관계/버전 오류는 기존 base/local/server 충돌 보존으로 연결합니다. operation ID와 payload 검증·이력을 유지합니다.
- 저장 전 초안은 기존 공통 draft-safety에 창별 recovery 사본을 연결합니다. 다른 창의 초안 자동 적용·다른 창의 최신 초안 삭제를 막습니다. 기기 기록 내려받기에 같은 계정의 창별 원장과 남은 초안 사본을 포함하며 타 계정 자료는 포함하지 않습니다.
- 위치·커서 힌트는 기존 계정별 탐색/편집 키를 사용합니다. 자기 탭의 sessionStorage가 우선이고 새 탭은 계정별 기기의 마지막 위치를 참고합니다. 명시한 URL 경로는 우선합니다. 활성 창의 화면을 다른 창의 위치 갱신으로 이동시키지 않습니다. 메모 입력에 stable data-editing-context를 부여했습니다. 이 힌트에는 공부 원문·자격정보를 넣지 않습니다.
- 탈퇴 정리는 새 창들의 shared sessions lease와 이전 버전 writer를 모두 확인합니다. 다른 창이 자료를 쓰는 중에는 기기 자료 정리 완료로 표시하지 않습니다.

관련 품질 범위는 Q01/Q03/Q04/Q07/Q08/Q09/Q11/Q12/Q14/Q15이며 Q13의 다섯 모사 환경을 확인했습니다. 인증/승인 서버 접근 실패 자체를 없애거나 완전한 오프라인 시작을 구현한 것은 아닙니다.

7개 관련 파일의 62검사, 마지막 entry11검사, 새 저장 모듈4파일 lint 통과. 격리된 동일 package-lock npm ci에서 Vite bundle을 만들고 공통 다섯 WebKit 모사 환경의 실제 개인 공간 경로에서 두 창 열기→주소 미지정 시 메모 복원→독립 저장→503 저장 실패→reload→재시도→재수신을 5건 통과했습니다. 시험 Auth/응답은 해당 브라우저 context에서만 모의했으며 운영 서버 요청·실계정 생성·기록 쓰기는 수행하지 않았습니다.

IAB에서도 실제 두 창을 직접 열고 같은 입력 경로/원문/커서34 일치를 확인했습니다. 격리 자료이며 물리 iPhone/iPad·실제 한글 IME·다른 기기 서버 수신의 증거는 아닙니다. source는 현재 개발 앱에 반영했고 공개 사이트 배포는 수행하지 않았습니다.

공용 npm run build는 병행 PDF 관련 타입/의존 오류(ink-documents, ink-pdf-background, pdf-lib)로 중단했습니다. 격리 전체 타입에는 병행 수식 TouchEvent 타입 오류와 당시 snapshot의 MemoInkPad props 차이도 남았습니다. 이 관련 없는 코드를 되돌리지 않았고 전체 build/CI 통과로 보고하지 않습니다. 초기 단위 검사 의존 로딩 실패, 닫기 버튼 선택자 실패, 병행 Playwright trace 출력 경로 충돌과 사용 중인 포트 로그를 보존했습니다. 최종 모사 확인은 별도 output 경로로 실행했습니다.

증거는 work/personal-window-20261001/{verification.json,tests-final-v2.log,entry-final.log,devices-final-v4.log,new-code-lint.log,shared-build.log,two-window-resume.png}입니다. 수동 확인용 격리 흐름은 http://127.0.0.1:58896/work/window-fixture/index.html 입니다. 사용자 원문/초안/설정과 병행 변경을 보존합니다.


## 2026-10-01 여러 창의 개인 공간·입력 위치 복원 공개 배포 완료

사용자 “배포해”로 Pages 실행 [36848571288](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/36848571288), SHA db5ee7857ec8971f3ea31457ae888e87782db9e0의 build/deploy success를 확인했습니다. 개인 여러 창 수정51bebcf와 재시도 시험 정정623bfda 포함. 전체 CI 단위842통과·1보류, frontend/backend bundle 및 다섯 WebKit 환경200검사 통과. 공개 HTML/진입JS/두CSS는 성공 Pages artifact와 바이트·SHA256 일치입니다.

실제 공개 개인 공간의 첫 창을 기록에 둔 채 화면 경로 없는 주소로 새 창을 열어 두 창 열림·새 창 #/record 복원을 확인했습니다. 운영 공부 쓰기0, 독립 쓰기/503/재접속/재시도/원문 보존은 격리5환경5검사·관련55검사 근거입니다. 중단으로 배포 전 구버전 탭은 닫혀 그 탭과 동시 사용을 직접 확인했다고 표현하지 않습니다. 서버 함수 재배포/실물기기/IME/다기기Sync/학습효과는 이번 미검증입니다. 이전 실패·취소·병행 변경/기존 인계를 유지합니다. 담당 docs/personal-window.md, 근거 work/personal-window-deploy-20261001/{result.md,deployment-verification.json,ci-success.log,public-assets.json,public-record-resumed.png}.

