# 모바일 코딩 연습과 저장 보수

2026-10-01 요청: iPhone·iPad에서 작성·저장·예제 목록 복귀·나중에 다시 열기와 실행 중 입력을 사용한다.

## 도구 선택과 동작

[Monaco 공식 FAQ](https://github.com/microsoft/monaco-editor)는 모바일 브라우저를 지원하지 않는다. 데스크톱 Monaco는 유지하고 터치 기기에는 기존 편집 표준 기능을 제공하는 [CodeMirror 6](https://codemirror.net/docs/ref/)을 연결했다. iPad의 데스크톱 UA도 터치 입력으로 판별한다. 한 화면에서 편집기를 바꾸지 않아 회전/키보드 연결로 커서·실행 취소 기록을 초기화하지 않는다. 지연 로딩 중에도 입력 가능한 기본 textarea를 제공한다.

줄 번호·구문 색·자동 들여쓰기·괄호 닫기·main 스니펫, 터치 도구의 들여쓰기/내어쓰기/주석/되돌리기/다시 적용, Tab의 편집기 탈출 선택을 제공한다. 실행 단축키는 CodeMirror 기본 빈 줄 삽입보다 우선한다. 기존 Tree-sitter Worker의 자동 문법 검사·오류 행 이동·실패 재시도를 같은 소스 원문에 연결한다. 의미/타입 분석과 중단점 디버거는 별도 미구현이다.

예제 목록은 제목·설명 검색과 언어 필터, 긴 설명의 화면 표시만 세 줄 제한을 제공한다. 저장 원문은 자르지 않는다. 모바일 터미널은 자동 키보드 초점을 강제하지 않으며 일반 입력 칸/입력 보내기 버튼/Enter·Shift+Enter를 추가했다. 조합 중 Enter를 실행 입력으로 보내지 않는다. 실제 iOS 화면 키보드·한글 IME는 모사 시험과 구별한다.

## 기록 보존과 실제 서버 문제

제목·코드·주석·설명·공백/줄바꿈·입력값·결과·예제 ID·수정 이력과 기존 주제 연결을 유지한다. 자동 저장과 기기 초안은 기존 공통 저장 계약을 재사용한다. 지금 저장은 개인 저장소의 outbox 전송도 시도하고 실제 서버 저장 확인을 받은 뒤 완료 표시를 한다. 전송 실패에는 입력을 기기에 보관하고 같은 버튼으로 재시도한다. 저장/재열기는 실제 공부·독립 수행·정답으로 집계하지 않는다.

실제 온라인 Mono 6.12에서 C# 한글 입출력이 물음표로 깨지는 문제를 확인했다. 공급자의 .NET 6 SDK 6.0.425에서 원문 변경 없이 한글 입출력이 정상임을 확인해 study-code-runner의 해당 compiler 상수만 변경했다. .NET 8 공급자 실행은 파일 크기 제한(status153)으로 실패해 채택하지 않았다. 온라인 .NET 6과 로컬 .NET 10의 지원 범위는 다르다. 공급자 공식 [실행 스크립트](https://github.com/melpon/wandbox-builder/blob/master/ga-build/dotnetcore/resources/build-dotnet.sh.in)의 dotnet new→restore 경로에서 패키지 서버 접근 지연을 확인했다. 외부 패키지를 쓰지 않는 단일 파일 실습에는 NuGet.Config의 packageSources clear를 함께 보내 SDK 내장 참조로 복원하며 저장 소스는 변경하지 않는다. 공급자 가동/응답시간을 보장하지 않는다. 인증·승인·한도·로그 정책과 제목/설명 미전송 계약은 유지한다.

## 검증 재사용

```sh
npm run build -- --outDir work/code-mobile-preview
npm run preview -- --outDir work/code-mobile-preview --port 5191 --strictPort
npx playwright test --config playwright.code-mobile.config.ts
# 명시적으로 준비한 합성 승인 계정만 사용; 개인 계정은 거부한다.
CODE_MOBILE_ACCOUNT_FILE=/path/to/private-synthetic-account.json npx playwright test --config playwright.code-online.config.ts
# 공개 앱 검증은 CODE_MOBILE_BASE_URL=https://skmsmjs-netizen.github.io/study-space-generation2/ 를 추가한다.
```

공통 다섯 WebKit 환경(iPhone 17 Pro 세로/가로, iPad Pro 13 세로/가로/좁은 창)을 재사용한다. C 두 수 합(3·4→7), C++ 반복(4→1 2 3 4), C# 한글 인사(연습자→안녕하세요, 연습자)를 직접 입력·실행·저장·목록 복귀·새로고침으로 확인한다. 별도 합성 계정의 실제 온라인 저장 후 쿠키·캐시 없는 새 iPad 브라우저 로그인에서 세 원문/입력/설명/결과를 비교한다. 503 전송 실패→기기 원문 보관→새로고침→지금 저장 재시도→새 브라우저 실제 수신도 확인한다. 시험 계정 자료/권한은 종료 후 해당 계정만 제거한다.

실시간 터미널의 프로토콜은 [터미널 서버 계약](code-terminal-server.md)을 따르며 현재 loopback 로컬 실행에만 연결돼 있다. 공개 앱의 iPhone/iPad에서 작성·온라인 저장·재열기·미리 적은 입력의 실행은 가능하다. 공개 실시간 stdin은 지속 실행과 격리를 제공하는 별도 WSS 서버 연결이 남아 있다. 2026-10-01 사용자 정정으로 Mac이 꺼져 있어도 iPhone/iPad에서 실시간 터미널을 사용해야 한다. Mac 상시 실행 여부는 선택사항이나 구현 선행 질문으로 남기지 않는다. Mac과 독립된 격리 실행 서버의 인증·컴파일·실시간 stdin/stdout 연결 및 공개 배포가 남았다. localhost를 iPhone/iPad 자신의 주소로 설명하거나 기존 서버의 loopback 제한을 해제하지 않는다. 물리 기기/OS 키보드/VoiceOver/장기간 관찰은 이번 WebKit·실제 서버 왕복 증거가 아니다.
