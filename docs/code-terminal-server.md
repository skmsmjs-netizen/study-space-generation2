# 실행 중 입력하는 터미널의 연결 범위

현재 실제 구현은 macOS의 loopback Vite 서버에 연결하는 xterm.js + node-pty 터미널입니다. C17/C++20 Clang 및 .NET10 C#을 컴파일하거나 Python·JavaScript를 실행한 뒤, 하나의 실행 프로세스에 키 입력을 계속 전달합니다. `/__code-terminal`은 같은 출처의 WebSocket이며 원격 주소·다른 Origin을 거부합니다. 공개 실행 서버로 사용할 수 없습니다.

## 현재 동작과 프로토콜

- 브라우저 → 서버: `start {language,code}`, 실행 단계 이후 `input {text}`, `resize {cols,rows}`, `cancel`.
- 서버 → 브라우저: `phase {phase:loading|running}`, `data {text}`, 최종 `result {result:CodeRun}` 또는 `failure {message}`.
- 실행 결과 `mode:terminal`에서 stdin은 Enter/삭제/EOF 등 실제 전송 키 원문입니다. output에는 프로그램 출력과 PTY 에코가 포함됩니다. 미리 작성한 예제 stdin을 덮어쓰거나 자동 전송하지 않습니다.
- 예제의 `inputMode`는 선택한 방식을 저장합니다. 기본은 로컬의 C/C++/C#/Python/JavaScript에서 terminal, 그 밖에서 batch입니다. 이전에 저장한 batch 선택은 유지합니다. 다른 접속 환경에서 terminal을 사용할 수 없어도 저장한 선택은 바꾸지 않습니다.
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

## 2026-10-01 Python·JavaScript와 Mac 재접속

Python은 설치된 CPython3.12.14를 재사용합니다. 기본 경로는 Codex의 지속 runtime 내 Python이며 없으면 `/usr/bin/python3`, 명시적 경로는 `STUDY_CODE_PYTHON`으로 지정합니다. `ast.parse`로 원문 문법을 먼저 확인하고 `-I -B -u -X utf8`로 실행합니다. `input()` 안내를 즉시 출력하고 다음 입력을 같은 프로세스에서 받습니다. `-I`는 실행 환경 선택이며 보안 경계는 기존 macOS sandbox입니다.

JavaScript는 설치된 Node.js24.19.0을 재사용합니다. 원문 `main.mjs`를 `--check`로 확인한 뒤 ESM으로 실행합니다. `console.log()`와 Node 표준 입출력을 지원합니다. 기존 브라우저 예제의 `prompt('안내')`/`readline()` 호환에는 Node `readSync`·`StringDecoder` 기반의 작은 표준입력 어댑터를 별도 모듈로 제공합니다. 소스 원문을 변형하지 않으며 EOF는 `null`입니다. `window`/`document` 같은 웹페이지 DOM, 임의 pip/npm 설치·외부 파일·네트워크는 실행 지원 범위에 포함하지 않습니다. 기존 Python Pyodide·JavaScript Worker의 미리 입력 방식은 유지합니다.

`코딩 연습 열기.command`를 열면 `scripts/open-code-practice.mjs`가 완성된 실행 사본 `work/mac-code-practice/20261001-python-js`의 preview를 시작하고 개인 공간의 `http://127.0.0.1:5188/#/code`를 엽니다. 이미 다섯 언어를 지원하는 서버가 열려 있으면 재사용합니다. 같은 포트의 다른 서버는 종료하지 않습니다. 실행 중에는 터미널 창을 유지하고, Ctrl+C로 종료한 뒤 같은 파일로 다시 열 수 있습니다. 예제 저장 키·ID를 이동하거나 임시 경로에 자료를 저장하지 않습니다. 서버를 다시 켜는 것은 저장된 기록 열람/새 실행이며 중단된 프로세스 재개가 아닙니다.

변경 확인은 `npm run test:code-terminal`, 관련 단위 회귀, 고정된 preview 빌드에서 `npm run test:devices -- --config playwright.code.config.ts`로 실행합니다. 마지막 명령은 Mac Chromium과 기존 다섯 WebKit 모사에서 Python/JavaScript의 실제 입력·문법 오류 후 복구·제목/원문/설명/실제 입력/출력 저장·목록 재열기·새로고침을 확인합니다. Mac loopback에 붙은 모사 확인이며 물리 iPhone/iPad의 독립 실행 증거가 아닙니다.

선택 근거: [CPython 실행 옵션 원문](https://github.com/python/cpython/blob/3.12/Doc/using/cmdline.rst), [Node 표준 입력 읽기](https://nodejs.org/docs/latest-v24.x/api/fs.html#fsreadsyncfd-buffer-offset-length-position), [Node readline](https://nodejs.org/api/readline.html). 별도 컴파일 서버·브라우저용 새 Python 패키지를 도입할 필요 없이 기존 Mac 런타임과 터미널을 재사용합니다.

[node-pty 공식 문서](https://github.com/microsoft/node-pty)는 PTY가 보안 경계가 아니며 인터넷 서버에서는 컨테이너 격리가 필요함을 설명합니다. 현재 구현은 기존 macOS deny-by-default sandbox를 유지하고 실제 파일 읽기·fork·네트워크 연결 거부를 확인했습니다. [xterm.js 흐름 제어](https://xtermjs.org/docs/guides/flowcontrol/)를 참고해 출력 크기와 미전송 버퍼를 제한합니다. 물리 iPad·OS 한글 IME·VoiceOver·장기 사용과 공개 터미널 서버는 이번 로컬 확인으로 통과 처리하지 않습니다.
