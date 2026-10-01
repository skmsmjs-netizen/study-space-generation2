# 코딩 연습

2026-10-01 사용자 요청: 앱 안에서 예제별 제목·소스 코드·실행 결과·아래 설명을 작성하고, C·C++·C#을 VS Code처럼 편집합니다. 실제 앱의 `#/code`에 연결했습니다.

## 편집과 기록

데스크톱은 Monaco 0.57.0, 터치 기기는 CodeMirror 6을 지연 로딩합니다. 모바일 선택·저장·실행 확인은 [모바일 코딩 연습](code-mobile.md)을 따릅니다. 구문 색상, 줄 번호, 자동 들여쓰기, 괄호·따옴표 자동 닫기, 괄호 색상, 찾기·바꾸기, 접기, 주석 단축키, 기본 단어 제안, 실행 취소/다시 실행을 사용합니다. C/C++에서 `main`을 입력하고 제안을 선택하거나 Tab을 누르면 시작 함수를 넣습니다. C#의 빈 문서에는 using·Program·Main, 이미 class가 있는 문서에는 Main 함수 스니펫을 제공합니다. ‘시작 코드 넣기’는 비어 있는 코드에만 적용합니다.

이 구현은 VS Code의 편집 부품을 사용합니다. 프로젝트 전체의 타입 분석·C/C++/C# 언어 서버·확장 설치·중단점 디버거·멀티파일 프로젝트는 포함하지 않습니다. C/C++은 Monaco의 cpp 언어 정의를 공유하며 컴파일 단계의 표준은 각각 C17/C++20입니다. 컴파일 오류는 실행 결과에서 확인합니다.

예제마다 제목·언어·코드·표준 입력·자유 설명·마지막 실행과 그때의 코드를 보관합니다. 제목/설명은 선택 입력입니다. 실행 뒤 코드를 고치면 이전 결과라는 표시를 남깁니다. 실행·저장으로 공부 사건, 완료, 정답, 숙달을 만들지 않습니다.

800ms 자동 저장과 화면 이동 시 저장, user/namespace/example별 초안, version 충돌 보존, 손상된 초안의 원문 보관, 별도 사본 저장, JSON 다운로드, 휴지통/복원을 제공합니다. 원문 공백·줄바꿈·수정 이력·ID를 유지합니다. Tab으로 편집기를 나갈 수 있는 선택 항목을 제공합니다. 저장 실패 시 입력과 초안을 남기며 성공으로 표시하지 않습니다.

## 실행 경로

승인된 개인 계정에서는 C(GCC 13.2, C17)·C++(GCC 13.2, C++20)·C#(.NET 6, SDK 6.0.425)을 온라인에서 컴파일하고 실행합니다. C#의 .NET 6 이후 전용 문법·라이브러리는 지원 범위가 아닙니다. Python은 Pyodide v314.0.7, JavaScript는 별도 Worker에서 실행합니다. Python 첫 실행에는 공식 CDN 다운로드가 필요합니다.

브라우저 실행기는 앱과 동일 출처를 공유하지 않는 sandbox iframe에서 Worker를 만듭니다. 앱 저장소/인증 토큰을 전달하지 않습니다. 실행 중지·실행 제한·출력 제한을 제공합니다. Python의 임의 패키지 설치/외부 파일/네트워크는 지원 계약에 포함하지 않습니다.

로컬 컴파일 어댑터는 Vite dev/preview에만 연결합니다. loopback Host와 동일 Origin을 요구하고, 컴파일과 실행 모두 macOS sandbox-exec로 네트워크·사용자 파일을 제한합니다. 실행 중 fork를 거부하며, 한 번에 한 작업, 임시 작업 디렉터리 정리, 컴파일 30초/실행 10초 제한, 출력 100,000자 제한을 둡니다. Apple의 로컬 sandbox 인터페이스이며 공개 서버의 보안 격리 컨테이너를 대신하지 않습니다. 이 어댑터를 외부에 노출하지 않습니다.

.NET 설치 위치는 `~/.local/share/study-code-runner/dotnet/`이며 다른 위치의 실행 파일은 `STUDY_CODE_DOTNET`으로 지정합니다. C/C++은 기존 CommandLineTools를 재사용합니다. 빌드/restore나 별도 NuGet 다운로드 없이 SDK 내 참조 어셈블리로 단일 파일을 컴파일합니다.

## 저장·배포 경계

선택적 `codeExamples` 컬렉션과 saveCodeExample/trashCodeExample/restoreCodeExample을 공통 명령·repository·서버 codec/handler에 추가했습니다. schemaVersion/기존 키를 변경하거나 기존 자료를 이관하지 않습니다. 서버가 saveCodeExample capability를 알릴 때 개인 저장을 허용합니다. 오래된 서버에 미지원 명령을 보내 원장을 바꾸지 않습니다.

`20261001035323_code_examples.sql`은 기존 study_commit_internal에 codeExamples 소유권 검사를 추가하고 recallCards/recallPreferences·승인 wrapper를 보존합니다. 내부 함수의 public/anon/authenticated/service_role 직접 실행은 계속 거부합니다. 마이그레이션을 기존 운영 DB에 적용했습니다. 운영 study-command의 코드 명령과 기존 복습/평가 되돌리기 명령을 함께 보존합니다. 별도 합성 시험 계정에서 세 언어 실행·원문/설명/결과 저장·재열기·동일 요청 재시도를 확인하며 실제 사용자 계정의 자료는 시험에 사용하지 않습니다.

온라인 실행은 Supabase study-code-runner가 인증·승인 상태와 한도를 확인한 뒤 Wandbox의 고정 compiler로 코드와 표준 입력만 전달합니다. 제목·설명·사용자 ID·로그인 토큰을 컴파일 서비스에 전달하지 않으며 save:false로 공유 permalink 저장을 요청하지 않습니다. 서비스 자체의 보관 정책이나 가동 시간을 보장한다는 뜻은 아닙니다. 관련 자료: https://github.com/melpon/wandbox .

계정별 동시 실행 1개, 분당 6회/하루 200회, 서비스 전체 분당 20회/하루 1,200회를 서버에서 강제합니다. 응답 대기는 35초로 제한하고 응답/출력 크기를 제한합니다. 응답 대기 중지는 브라우저 대기를 중지하며 이미 전송된 작업의 즉각적인 종료를 보장하지 않습니다. 공급자 실패나 한도에는 원래 코드·입력·설명을 보존하고 이유를 표시합니다. 소스/출력을 서버 로그에 기록하지 않습니다.

개발/미리보기의 시연 공간은 로컬 Clang/.NET 어댑터를 유지합니다. 입력값을 미리 적어 실행하는 개인 공간은 localhost에서도 온라인 실행을 사용합니다. 실행 중 입력하는 로컬 터미널은 아래 별도 계약을 따릅니다. 중단점·변수 감시·한 줄씩 실행하는 GDB 디버깅과 멀티파일 프로젝트는 아직 구현하지 않았습니다. 물리 iPad·한글 IME·VoiceOver·다기기 Sync는 이번 확인과 구별합니다.

## 실행과 확인

```sh
npm run dev
# 병행 작업의 dist 변경에서 분리한 확인 화면
npm run build -- --outDir work/code-practice-preview
npm run preview -- --outDir work/code-practice-preview --port 5188 --strictPort
node scripts/code-runner-smoke.mjs
npm test -- src/domain/code-example.test.ts src/data/code-example-draft.test.ts src/ui/code-practice.test.tsx src/server/storage.test.ts src/server/code-example-migration.test.ts
npx playwright test --config playwright.code.config.ts
```

미리보기는 `http://127.0.0.1:5188/?space=demo#/code`에서 엽니다. 시험은 합성 자료와 분리된 브라우저 프로필을 사용합니다. 예시 자료는 실제 개인 공부로 처리하지 않습니다. Storybook의 SourceEditor 상태는 편집 부품 비교용이며 실제 저장·실행을 연결하지 않습니다.

검증 범위: C/C++/C#에 입력 3·4를 전달해 출력 7, 오류 코드의 컴파일 실패, 사용자 파일 읽기·사용자 파일 include·fork·네트워크 연결 거부와 중지, 실제 Monaco의 main/괄호/들여쓰기/Undo/320px 키보드 이동, 제목·코드·설명·결과의 reload 보존, Python/JavaScript 실제 출력. 상세 결과는 공통 프로젝트 `outputs/20261001-code-practice/verification.json`에 기록합니다.

공식 근거: [Monaco](https://github.com/microsoft/monaco-editor), [Pyodide Worker](https://pyodide.org/en/stable/usage/webworker.html), [Supabase 함수 권한](https://supabase.com/docs/guides/database/functions).

## 2026-10-01 입력 안내와 자동 문법 검사

입력 칸을 항상 표시합니다. scanf·cin·Console.ReadLine·input 등의 호출이 있고 입력값이 비어 있으면 입력 칸으로 초점을 옮겨 안내하며, 의도적인 EOF 검사는 입력 없이 실행으로 허용합니다. 이 안내는 입력값을 미리 적어 실행하는 방식에 적용됩니다. 실행 중 입력하는 로컬 터미널은 아래 확장으로 제공합니다. scanf로 받은 값이 저절로 출력되지는 않으므로 결과에는 출력 문장 안내를 제공합니다.

web-tree-sitter0.27.0과 @repomix/tree-sitter-wasms0.1.17의 실제 C/C++/C#/Python/JavaScript 문법을 별도 Worker에서 검사합니다. 편집350ms 후 자동 검사·오류 밑줄/행열 목록·해당 줄 이동·수정 후 제거·실패 재시도를 제공합니다. 현재 코드와 맞지 않는 늦은 결과는 표시하지 않고 화면 이동 시 Worker를 종료합니다. WASM과 해당 언어 정의만 앱의 같은 출처에서 가져오며 검사할 코드는 외부로 보내지 않습니다. 문법 검사이지 변수 선언/타입/링크/헤더 전처리/런타임 오류 전체 검사나 정답 판정이 아닙니다. 결과와 원문·저장 상태는 분리합니다.

공식 구현 근거: https://github.com/tree-sitter/tree-sitter/tree/master/lib/binding_web 및 https://github.com/repomix/tree-sitter-wasms . 실제 문법 WASM으로 다섯 언어의 정상/오류 코드와 한글/이모지 위치를 검증하고 실제 브라우저의 C 세미콜론 누락·수정·입력42/출력을 확인합니다.

## 2026-10-01 실행 중 입력하는 터미널

C·C++·C#의 로컬 실행에 xterm.js6.0.0 / addon-fit0.11.0 / node-pty1.1.0 / ws8.22.0을 연결했습니다. 실행 후 나타나는 prompt에 직접 입력하며 같은 프로세스가 다음 입력을 받습니다. 중지/EOF, 자동 너비 조정, 선택한 실행 방식·원래 batch 입력 보존, 당시 코드·실제 입력·출력 저장/이력을 유지합니다. 중단·화면 이동·새로고침의 중간 기록을 완료와 구별해 보관합니다. 공개 사이트는 현재 batch 실행이며 별도 격리 터미널 서버가 아직 연결되지 않았습니다. 프로토콜·제한·공개 연결 조건·재현 명령은 [터미널 서버 연결 계약](code-terminal-server.md)을 따릅니다.
