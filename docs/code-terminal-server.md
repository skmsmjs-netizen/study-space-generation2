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

## 공개 사이트에 연결하기 전 필요한 것

현재 공개 Pages는 기존 Wandbox batch 실행을 유지합니다. 여기에 실행 중 입력을 제공하려면 **장시간 프로세스를 유지하는 격리 실행 서버 및 TLS WebSocket 주소**가 별도로 필요합니다. 이번 구현에 공개 서버용 인증·컨테이너 실행 어댑터가 완성됐다는 뜻은 아닙니다. 새 서버 계정/주소가 현재 연결되어 있지 않습니다. 연결된 Vercel 도구에서도 사용 가능한 팀이 반환되지 않았습니다.

선행 후보 [Piston](https://github.com/engineer-man/piston)은 Linux Docker·cgroup v2와 isolate를 사용하는 실행 도구이며 [WebSocket connect 구현](https://github.com/engineer-man/piston/blob/master/api/src/api/v2.js)이 있습니다. 현재 공식 공개 API는 별도 승인 토큰이 필요하므로 무료 공개 엔드포인트가 계속 열린다고 가정하지 않습니다. Piston의 스트리밍 입출력은 pipe 기반이므로 PTY/출력 버퍼링·EOF 동작을 추가 확인해야 합니다. 현재 Mac 터미널을 인터넷에 노출하거나 그대로 공개 서버로 배포하지 않습니다.

공개 연결의 완료 조건은 다음과 같습니다.

1. 실행 서버 계정과 Linux Docker/cgroup v2 또는 동등한 격리 런타임을 준비합니다. 기존 계정이 없으면 계정 생성은 사용자가 진행하며 유료 비용은 선택 전에 확인합니다.
2. C·C++·C# 런타임을 설치하고 프로그램마다 파일·네트워크·프로세스·메모리·시간을 격리합니다. 호스트 Docker 소켓/서비스 키/사용자 파일을 실행 환경에 제공하지 않습니다.
3. 기존 Supabase의 실제 인증·승인 상태 및 서버 quota를 실행 전에 확인합니다. 브라우저 Origin 검사를 사용자 인증으로 대신하지 않습니다. 로그인 토큰은 URL에 넣지 않습니다. 사용자별 동시 실행·회수·승인 취소·중단·연결 해제도 확인합니다.
4. UI→repository의 인증 연결→WSS 실행 서버 경계를 추가합니다. 제목·설명은 전송하지 않습니다. 공개 배포된 화면에서 두 번 이상의 입력, 개행 없는 prompt, 한글·EOF·중지·네트워크 끊김·재실행·저장/재열기를 합성 계정으로 확인합니다.

이 조건은 공개 연결에 필요한 작업이며 로컬 터미널 구현/검증과 구별합니다. 현재 GDB 중단점·변수 감시·단계별 디버깅 및 Python/JavaScript의 실행 중 입력은 구현하지 않았습니다.

## 재현

```sh
npm ci
npm run dev -- --port 5188 --strictPort
# macOS 실제 컴파일러·PTY 회귀 (Linux에서는 명시적으로 skip)
npm run test:code-terminal
```

[node-pty 공식 문서](https://github.com/microsoft/node-pty)는 PTY가 보안 경계가 아니며 인터넷 서버에서는 컨테이너 격리가 필요함을 설명합니다. 현재 구현은 기존 macOS deny-by-default sandbox를 유지하고 실제 파일 읽기·fork·네트워크 연결 거부를 확인했습니다. [xterm.js 흐름 제어](https://xtermjs.org/docs/guides/flowcontrol/)를 참고해 출력 크기와 미전송 버퍼를 제한합니다. 물리 iPad·OS 한글 IME·VoiceOver·장기 사용과 공개 터미널 서버는 이번 로컬 확인으로 통과 처리하지 않습니다.
