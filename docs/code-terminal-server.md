# 실행 중 입력하는 터미널의 연결 범위

현재 실제 구현은 macOS의 loopback Vite 서버에 연결하는 xterm.js + node-pty 터미널입니다. C17/C++20 Clang 및 .NET10 C#을 컴파일한 뒤, 하나의 실행 프로세스에 키 입력을 계속 전달합니다. `/__code-terminal`은 같은 출처의 WebSocket이며 원격 주소·다른 Origin을 거부합니다. 공개 실행 서버로 사용할 수 없습니다.

## 현재 동작과 프로토콜

- 브라우저 → 서버: `start {language,code}`, 실행 단계 이후 `input {text}`, `resize {cols,rows}`, `cancel`.
- 서버 → 브라우저: `phase {phase:loading|running}`, `data {text}`, 최종 `result {result:CodeRun}` 또는 `failure {message}`.
- 실행 결과 `mode:terminal`에서 stdin은 Enter/삭제/EOF 등 실제 전송 키 원문입니다. output에는 프로그램 출력과 PTY 에코가 포함됩니다. 미리 작성한 예제 stdin을 덮어쓰거나 자동 전송하지 않습니다.
- 예제의 `inputMode`는 선택한 방식을 저장합니다. 기본은 지원되는 로컬 C계열에서 terminal, 그 밖에서 batch입니다. 다른 접속 환경에서 terminal을 사용할 수 없어도 저장한 선택은 바꾸지 않습니다.
- 컴파일30초/실행120초/CPU10초, 입력20만자/출력10만자, 로컬 어댑터 전체 동시1개. 중지·연결 종료·출력 한도는 실행을 종료하고 임시 디렉터리를 정리한 뒤 슬롯을 반환합니다. batch 실행과도 슬롯을 공유합니다.
- 1초마다 중간 터미널 기록을 기존 예제 초안에 보존합니다. 정상 종료 시 원문·출력·실제 입력을 기존 저장 명령으로 저장합니다. 화면 이동/새로고침의 중간 기록은 완료로 표시하지 않습니다. 재접속은 기록 열람이며 실행 재개가 아닙니다.
- xterm.js는 필요할 때 불러오며 좁은 화면에서 열/행을 자동 맞춥니다. 스크롤 기록은1,000줄, 원문 결과는10만자 한도까지 보존합니다. OSC52 클립보드 쓰기는 차단합니다.

## 2026-10-01 최종 범위: 코딩은 Mac에서 사용

사용자 “없어. 코딩은 그냥 mac에서만 되게 하자”에 따라 별도 상시 Linux 실행 서버는 제외한다. 서버 계정 생성·신규 결제·공개 WSS 주소 연결을 남은 필수 작업으로 요구하지 않는다. Mac의 로컬 코딩 화면과 기존 컴파일러·PTY를 사용한다. Mac이 꺼지거나 로컬 실행 서버를 종료하면 실행 중 입력하는 터미널도 사용할 수 없다.

온라인 터미널용 repository 포트·WSS 환경 설정은 활성 앱 경로에서 제거했다. 준비했던 Linux 구현은 미배포 개발 브랜치에만 보존하며 운영 서버를 만들지 않았다. 이미 적용한 Supabase 실행 제어 함수/lease의 이력은 보존한다. 해당 함수는 컴파일러나 터미널 서버가 아니며, 별도 실행 서버 없이 프로그램을 실행하지 않는다. 기존 공개 앱의 batch 실행·개인 자료 저장은 유지한다.

저장한 예제·당시 소스·보낸 입력·출력·설명·수정 이력을 유지한다. iPhone/iPad의 기존 예제 열람 화면을 제거하거나 자료를 Mac 전용 키로 옮기지 않는다. 이번 요구는 모바일 대화형 실행을 완료 조건에서 제외한다. GDB 중단점·변수 감시·단계별 디버깅은 현재 구현 범위에 포함하지 않는다.

## 재현

```sh
npm ci
npm run dev -- --port 5188 --strictPort
# macOS 실제 컴파일러·PTY 회귀 (Linux에서는 명시적으로 skip)
npm run test:code-terminal
```

[node-pty 공식 문서](https://github.com/microsoft/node-pty)는 PTY가 보안 경계가 아니며 인터넷 서버에서는 컨테이너 격리가 필요함을 설명합니다. 현재 구현은 기존 macOS deny-by-default sandbox를 유지하고 실제 파일 읽기·fork·네트워크 연결 거부를 확인했습니다. [xterm.js 흐름 제어](https://xtermjs.org/docs/guides/flowcontrol/)를 참고해 출력 크기와 미전송 버퍼를 제한합니다. 물리 iPad·OS 한글 IME·VoiceOver·장기 사용과 공개 터미널 서버는 이번 로컬 확인으로 통과 처리하지 않습니다.
