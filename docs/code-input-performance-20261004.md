# 소스 코드 입력 지연 수정 · 2026-10-04

사용자 첨부의 Monaco 소스 입력 지연을 기존 공개 Pages 범위에서 수정한다. 원격 기준은 7cf429da823a8dcd89d90b3d8ab665698abe5e1d이다. 담당 추적은 MAN-31이다.

키마다 전체 초안을 동기 저장하던 경로를 메모리 보존 + 짧은 지연 저장으로 바꿨다. 250ms 입력 중단, 연속 입력 중 최대1000ms마다 초안을 보관한다. 기존800ms 실제 예제 저장·실행/지금 저장/화면 이탈 flush를 유지하고 hidden 전환도 flush한다. beforeunload는 공통 미저장 경고보다 먼저 최신 내용을 저장한다. 되돌리기로 저장본과 같아진 경우에도 남은 보관 타이머를 정리한다. 원문/ID/저장 키/초안 충돌·손상 원문/실행 당시 기록/설정·서버 권한은 보존한다.

Monaco의 강제 접근성 처리는 공식 자동 감지 옵션을 사용한다. 문법 마커가 실제 있을 때만 지우고, 빈 진단 배열은 다시 생성하지 않는다. 터치 CodeMirror도 빈 진단의 반복 갱신을 줄였다. 자동 문법350ms/오류 위치 이동/들여쓰기·단축키/undo/cursor를 유지한다.

채택 근거: [React 입력 성능 공식 안내](https://react.dev/reference/react-dom/components/input#optimizing-re-rendering-on-every-keystroke), [Monaco 공식 옵션](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor_editor_api.editor.IStandaloneEditorConstructionOptions.html). 입력 내용은 즉시 유지하며 비필수 작업을 키 입력에서 줄이는 기존 방법을 적용했다. 250/1000ms는 프로젝트 보존 계약에 맞춘 선택값이며 외부 표준으로 주장하지 않는다.

로컬 관련 단위21/타입 포함 생산빌드/다섯 WebKit환경10/데스크톱 Chromium1 통과. 600줄/120글자 실제 입력에서 기존 공개본의 입력 중 초안 쓰기120회, 수정본0회. wall time/키→프레임 시간은 실행 변동을 포함하므로 실제 기기 속도 향상률로 표현하지 않는다. 연속 입력의 중간 checkpoint·저장 실패 메모리 보존·즉시 이탈/reload·원문 설명·실행 기록·손상 초안을 확인했다. 초기 공유 패키지 손상은 공유 환경을 변경하지 않고 격리 npm ci로 해결. 초기 로컬 PAGES_BASE 불일치 실행은 중단했으며 올바른 경로의 최종검사와 구별한다. 최종CI/공개 자산·공개 입력은 배포 후 확인한다.

직접 변경: src/ui/code-practice.tsx, src/ui/monaco-source-editor.tsx, src/ui/code-syntax-status.tsx, 관련 단위 및 e2e/devices/code-input.pw.ts. 근거 work/code-input-20261004 및 work/device-runs/run-mnfcwz. 실제 개인자료/운영DB 변경0. 물리기기·실제 IME·서버Sync·학습효과와 구별한다. 강제 종료처럼 이탈 이벤트가 없는 경우 마지막 checkpoint 이후 최대1초는 메모리에만 있을 수 있다.
