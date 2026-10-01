# 현재 웹앱의 개발 도구

2026-10-01 사용자 요청에 따라 도구 선정·설치·설정·첫 실행을 진행했습니다. 필요 도구를 사용자가 먼저 알아보고 지시하도록 기다리지 않습니다. 공통 AGENTS.md의 ‘개발 도구를 먼저 찾아 준비하는 책임’을 적용합니다.

## 지금 사용할 도구

2026-10-01 FSRS vendor 준비의 동시 복사 실패는 기존 `proper-lockfile`로 복사/worker 경로 수정 구간을 직렬화했습니다. build/dev는 같은 준비 함수를 사용하며 종료·실패 후 해제합니다. `node --test scripts/build-recall-optimizer.node-test.mjs`로 세 프로세스 동시 준비·원본/WASM 보존·실패 후 재실행을 확인합니다. 세부 원인/공용 빌드 결과는 [GPT 실제 저장 확인](gpt-real-flow-20261001.md)에 있습니다.

2026-10-01 공통 필기의 선택적 필압 표시는 MIT 라이선스 `perfect-freehand` 1.2.3을 사용한다. 저장 원문은 기존 벡터 점이며 라이브러리는 표시만 담당한다. 도구 선정 이유·입력/보존 범위·검사·미구현은 [필기 계약](handwriting.md)에 있다.

2026-10-01 모션은 Figma/ChatGPT 플러그인 설치 없이 React 패키지와 필요한 공개 소스를 실제 앱에 연결합니다. 설치한 런타임, 8개 출처의 역할, 지연 로딩/모션 감소/사용 조건은 [모션 시스템](motion-system-20261001.md)을 따릅니다. 관련 검사 명령은 `npx vitest run --config work/motion-20261001/vitest.config.ts`이며 중첩 작업 사본의 같은 이름 검사를 함께 수집하지 않습니다. 공유 의존 파일의 읽기 지연이 반복되면 package/lock과 현재 소스의 별도 로컬 사본에서 같은 버전의 jsdom 환경으로 검사하고 사본 시점/현재 소스 차이를 기록합니다. 다른 DOM 환경의 통과를 원래 환경의 통과로 바꾸어 보고하지 않습니다.

강의 녹음·필기 AI 정리는 기존 MediaRecorder/IndexedDB, 공식 OpenAI Sign in with ChatGPT DevKit의 고정 로컬 SDK, Mac 키체인 암호화와 무료 로컬 faster-whisper1.2.1/PyAV16.1.0을 사용합니다. DevKit은 npm 공개 패키지가 아닌 저장소 workspace라 출처/라이선스/수정 내역과 함께 scripts/vendor/siwc-local에 보관합니다. `npm run setup:gpt-local`이 별도 로컬 도구를 설치하며 현재 Mac에서는 설치·실제 한국어 합성 음성 받아쓰기·키체인 암호화 왕복을 확인했습니다. `npm run dev -- --port 5218 --strictPort`의 민석 개인 공간 `강의 자료 → GPT 연결`에서 공식 로그인/모델 선택/크레딧 꺼짐 확인을 진행합니다. 앱에 Gemini 또는 별도 과금 API 키를 설정하지 않습니다. 실제 OAuth/추론·원격 접근 승인·운영 저장/배포의 경계는 [강의 자료 계약](ai-materials.md)과 [Plus 설계](chatgpt-plus-design.md)에 있습니다.

| 역할 | 현재 선택 | 준비 상태와 쓰는 방법 |
| --- | --- | --- |
| 실제 UI 부품과 상태 비교 | Storybook 10.6.1 + React/Vite, Docs, Themes | 설치·빌드·개발 서버 실행. `npm run storybook`, http://127.0.0.1:6007/ |
| 접근성 검사 | Storybook addon-a11y + axe-core/Playwright 4.13.0 | 설치·실행. 작업실의 Accessibility 패널 및 밝게/어둡게 입력 부품 자동 검사 |
| 반복 가능한 브라우저 검사 | Playwright 1.63.0 + Chromium/Firefox/WebKit | 세 실행기 설치. `npm run test:ui`는 현재 Mac에서 실행 가능한 Chromium·WebKit을 검사. Firefox의 OS 실행 문제는 아래에 구별 |
| 코드 검사 | Biome 2.5.15 | 설치·편집기 연결. `npm run lint` 또는 변경 파일에 `npx biome lint 경로`. 기존 TypeScript 7.0.2를 유지하며 구문·React·접근성 관련 진단 제공 |
| 변경 파일 정리 | Prettier 3.9.9 | 설치·프로젝트 설정·기존 공식 VS Code 확장 연결. `npm run format -- 파일경로`, `npm run format:check -- 파일경로` |
| 성능·접근성 참고 | Lighthouse 13.5.0 | 설치·첫 보고 생성. 작업실 실행 중 `npm run audit:ui`. 개발용 부품 화면의 결과이며 제품 전체 점수로 확대하지 않음 |
| 편집기 | 기존 VS Code + Biome/Playwright/Prettier 확장 | Biome 3.7.1·Playwright 1.1.19 신규 설치 확인. 기존 Prettier 확장 유지. 프로젝트 `.vscode` 설정·추천 목록 추가 |
| 타입·단위/통합 검사 | 기존 TypeScript·Vitest·Testing Library | 기존 구성 재사용. `npm run typecheck`, 변경 관련 `npm test -- 경로` |
| 개발·빌드 | 기존 Node 24·React 19·Vite 8 | 기존 버전과 제품 의존성 유지. `npm run dev`, `npm run build` |
| 관계 Canvas | 기존 React Flow | 기존 구현 재사용. 설치 수를 늘리려고 다른 Canvas 도구를 추가하지 않음 |
| 버전 관리·CI | 기존 Git·GitHub Actions | 기존 공개 배포 workflow 보존. 별도 `ui-tools.yml`에 PR/수동 실행 검사 구성. 이번 요청에서 원격 업로드·CI 실행·공개 배포는 수행하지 않음 |

위 표의 로컬 개발 도구는 모두 계정 없이 사용할 수 있습니다. 아래 외부 서비스 플러그인은 계정 연결이 필요합니다. Prettier는 명시적으로 선택한 파일만 정리하며 저장 시 전체 자동 정리는 켜지 않았습니다. Biome의 formatter·자동 assist는 끄고 코드 진단에 사용하여 두 도구가 같은 파일을 동시에 정리하지 않게 했습니다. 기존 편집기의 다른 확장과 사용자 전역 설정은 유지했습니다.

## GPT·Codex 플러그인 설치와 활용

2026-10-01 사용자 ‘다 깔아 다 설치해 다 활용해. 니가 플러그인 설치해’ 요청은 앞서 안내한 개발 관련 플러그인 전체에 적용합니다. 이미 있는 Figma·tldraw·GitHub·Supabase는 재사용합니다. 사용자 ‘다 설치했어’ 이후 재조회에서 Linear·Webflow·Vercel·GitBook 모두 설치됨으로 확인했습니다. Linear 작업 공간과 Vercel의 인증된 teams 조회가 성공했으며 Webflow의 계정 접근은 현재 도구 미제공으로 미검증입니다. 플러그인 설치 요청과 계정 인증, 프로젝트 접근, 실제 사용 결과를 구별합니다.

| 플러그인 | 이번에 확인한 상태 | 실제 작업에 활용할 경로 |
| --- | --- | --- |
| tldraw | 설치됨. 계정 조회 성공 | 사용자 흐름·화면 구조를 편집 가능한 보드로 검토. 실제 앱의 학습 Canvas와 구별 |
| Figma | 설치됨. 계정 조회 성공 | 기존 디자인 파일을 재사용해 화면·공통 UI와 코드 대응 검토. 파일별 편집 권한은 작업 시 확인 |
| GitHub | 설치됨. 등록된 두 연결의 인증 사용자 조회 성공 | 해당 저장소의 계정을 선택해 코드·PR·CI·변경 이력 확인 |
| Supabase | 설치됨. 현재 웹앱 프로젝트 조회 성공 | 현재 서버의 저장·인증·함수·로그를 필요한 작업에서 확인. 이번에는 DB·설정·자료를 변경하지 않음 |
| [Linear](https://chatgpt.com/plugins/plugin_asdk_app_69a089a326dc8191b32a3f2553f5be2c) | 설치·연결 확인. manseeksong 작업 공간·팀 조회와 프로젝트/이슈 생성 성공 | [학습 입력 웹앱 프로젝트](https://linear.app/manseeksong/project/학습-입력-웹앱-640485bb7d97)에서 구체적인 작업을 추적. 첫 항목 MAN-5는 기존 Firefox 실행 문제의 남은 조건이며 이번 신규 재현/수정 결과가 아님 |
| [Vercel](https://chatgpt.com/plugins/plugin_connector_690a90ec05c881918afb6a55dc9bbaa1) | 설치됨·연결됨. 인증된 teams 조회 성공, 팀 목록은 빈 배열. 프로젝트/배포 연결은 별도 확인 | 허용된 프로젝트에서 배포 상태 확인과 미리보기 검토 |
| [Webflow](https://chatgpt.com/plugins/plugin_asdk_app_6a0783a98c4c8191841404d786d4a4b9) | 사용자 설치 완료 후 최신 조회 installed=true. 현재 대화에 조작 도구 미제공, 계정·사이트 접근 미검증 | 별도 웹페이지의 시각 편집·CMS·사이트 구조 검토. 확인을 위해 재설치를 요청하지 않음 |
| [GitBook](https://chatgpt.com/plugins/plugin_asdk_app_6a576f075ec4819196c203b7049542be) | 설치됨·연결 조회 성공. 비공개 한국어 문서 공간·변경 요청 초안 생성과 저장 후 재조회 확인 | [개발 도구 활용 안내 초안](https://app.gitbook.com/o/KZb2xwBEfMoIM3VUkyN4/s/qXjrQT8Qm5aopCNbEIcG/~/changes/79hdYyU1qptXUUNcDH25/)을 재사용하며 필요한 문서·변경 검토를 연결 |

설치 진입을 준비하는 연결 기능은 설치·인증 자체를 완료하지 않습니다. 과거의 설치됨 조회와 사용자 미설치 정정은 당시 기록으로 유지하되, 현재 상태는 사용자 설치 완료 이후의 재조회와 직접 실행으로 판단합니다. Linear·Webflow 모두 설치됨으로 바뀌었고 Linear 연결과 최초 쓰기까지 확인했습니다. Webflow는 계정 미연결로 단정하지 않으며, 도구가 제공되면 실제 접근을 확인합니다. 설치 확인이 끝난 항목에 재설치/재연결을 반복 요구하지 않습니다. 도구 준비를 실제 웹앱 개발의 일괄 차단 조건으로 쓰지 않습니다.

GitBook 조직 조회가 빈 목록이어서 작업용 조직 `학습 입력 개발`(KZb2xwBEfMoIM3VUkyN4)과 비공개 한국어 공간 `학습 입력 개발 안내`(qXjrQT8Qm5aopCNbEIcG)을 만들었습니다. 변경 요청79hdYyU1qptXUUNcDH25의 도구 역할 안내 페이지t15GsuirdvHAxKEwvjJf를 저장하고 markdown 재조회에서 본문·표를 확인했습니다. 공개 사이트 생성·게시·초안 병합은 수행하지 않았습니다. 사용자 실제 기록이나 비공개 코드를 전송하지 않았습니다. GitBook이 조직 생성 시 자동으로 Pro 체험을 시작했으며 종료일은2026-10-15T03:19:14Z(한국시간12:19)입니다. 결제·유료 업그레이드는 수행하지 않았습니다. 이후 문서 작업은 이 조직·공간·초안을 재사용합니다.

사용자에게 도구 선택을 다시 맡기지 않습니다. 계정 연결이 끝나면 준이 필요한 워크스페이스·프로젝트와 최초 실행을 확인합니다. 도구를 사용했다는 표시만 만들기 위한 자료 복제·공개·운영 변경은 하지 않으며, 실제 개발의 해당 역할에서 활용합니다. 현재 앱의 저장소·자료·호스팅을 유지하면서 필요한 작업을 연결합니다.

## 개발 중 실제로 사용하는 순서

1. 기존 화면·토큰·공통 UI에서 바꿀 행동을 좁힙니다. 기본 입력을 늘리거나 실제 사용자 원문·ID·초안·의미색을 바꾸지 않습니다.
2. 관련 Storybook 상태에서 기본·오류·비활성·긴 한국어를 비교합니다. 새로운 부품 상태가 필요하면 현재 story 파일에 추가합니다. 작업실은 합성 자료와 메모리 상태만 쓰며 앱 저장소·서버에 연결하지 않습니다.
3. 실제 앱에 구현하고 타입 및 변경 관련 기존 검사로 확인합니다. Storybook만 바꾼 결과를 실제 제품 반영으로 보고하지 않습니다.
4. Browser로 실제 화면·동작을 확인합니다. 반복 가치가 있는 입력·키보드·복귀·좁은 화면은 Playwright에 연결합니다. OS 한글 조합·물리 iPad/Pencil·Sync는 해당 환경의 별도 증거가 필요합니다.
5. 변경 파일의 lint 진단·형식을 확인하고 필요한 만큼 수정합니다. 새로운 진단과 기존 코드의 진단을 구별하며 기존 앱 전체를 자동 재작성하지 않습니다.

이 순서는 모든 UI 수정에서 모든 명령·모든 기기 검사를 실행하라는 뜻이 아닙니다. 검사 범위와 끝내는 시점은 공통 작업 진행 정책을 따릅니다.

## 실행 명령

디자인 토큰 확인은 `npm run check:design`, 허용/거부 경계 검사는 `npm run test:design`입니다. 전자는 dev/build/lint에, 후자는 `npm test`에 연결했습니다. `ui-tools.yml`에도 두 명령을 연결했습니다. 검사 범위·예외·기존 표현 보존·PostCSS와 Stylelint 후보의 선정 근거는 [디자인 시스템의 토큰 검사](design-system.md#2026-10-01-토큰-준수-검사와-기존-표현-보존)에 있습니다. 읽기 전용 검사이며 자동으로 토큰을 추가하거나 CSS를 고치지 않습니다.

```sh
npm run storybook                 # 개발 중 부품 비교·컨트롤·테마·접근성 패널
npm run storybook:build           # 반복 가능한 작업실 정적 산출물
npm run storybook:serve           # 정적 작업실을 6007에서 열기; 개발 서버와 함께 실행하지 않음
npm run typecheck:tools           # 작업실·브라우저 검사 설정의 타입 검사
npm run lint:tools                # 이번에 추가한 도구 코드 검사
npm run format:tools:check        # 이번 도구 파일의 형식 검사
npm run test:ui                   # 현재 Mac의 Chromium + WebKit, 합성 자료 검사
npm run test:ui:all               # 세 실행기 모두; Linux CI에도 사용
npm run test:ui:firefox           # Firefox 실행 문제가 해결된 환경에서 사용
npm run test:ui:open              # Playwright 검사 UI
npm run test:ui:report            # 최근 HTML 검사 결과
npm run audit:ui                  # 작업실이 실행 중일 때 Lighthouse 보고
```

브라우저 검사에 앞서 작업실 정적 빌드를 한 번 만듭니다. `test:ui`는 실행 중인 6007 서버가 없으면 정적 작업실 서버를 자동으로 열고 검사 뒤 닫습니다. 개발 서버가 있으면 그 서버를 사용합니다. 브라우저 실행기는 새 환경에서 `npx playwright install chromium firefox webkit`로 준비합니다. 테스트용 프로필은 실제 사용자 브라우저 프로필과 분리됩니다.

Storybook 12개 상태: Primary, Secondary, Busy, Disabled, LongLabel, ButtonVariants, FieldStates, LocalInputFlow, Dialog, Navigation, Feedback, SemanticColors. 실제 공통 UI 모듈과 토큰을 그대로 참조합니다. 합성 시연의 입력·완료 알림을 실제 학습 수행·기록 저장으로 처리하지 않습니다.

## 첫 실행에서 확인한 결과와 남은 조건

- 앱 build/typecheck, 도구 typecheck/lint/format, Storybook build를 확인했습니다. 추가한 도구 코드의 lint는 오류 없이 통과했습니다. 기존 공통 부품 Vitest 9개와 Chromium·WebKit 합성 동작 검사 12개가 통과했습니다. 이 검사 범위에 Firefox·물리 기기·실제 서버 저장은 포함되지 않습니다.
- 실제 Browser에서 작업실과 Accessibility 패널이 열렸고 FieldStates는 위반 0개로 표시됐습니다. 이 부품 상태의 자동 결과를 제품 전체 접근성 준수로 확대하지 않습니다.
- Firefox 실행기는 설치됐으나 이 Mac의 macOS 27.0에서 `Could not find profile folder`로 시작하지 못했습니다. 임시 폴더를 바꿔도 동일했습니다. [Playwright 공식 저장소의 같은 macOS 27 증상 보고](https://github.com/microsoft/playwright/issues/42768)가 있으나 이 기기의 정확한 권한 원인은 확정하지 않았습니다. 기본 로컬 검사는 Chromium·WebKit으로 구성하고 Firefox를 실패 없는 것으로 숨기거나 OS 보안을 완화하지 않았습니다. Linux CI에는 세 실행기를 포함했으며 원격 CI는 아직 실행하지 않았습니다.
- 전체 기존 소스 108개 파일의 Biome 최초 진단은 오류 78개·경고 211개·정보 11개였습니다. 이는 새 검사 기준에 따른 진단 수이며 실제 결함 300개가 확인됐다는 뜻이 아닙니다. non-null assertion·Hook 의존성 등의 결과는 `work/ui-tooling-20261001/lint-baseline.json`에 남겼습니다. 기존 코드 전체를 자동 수정하지 않으며 다음 관련 변경에서 실행 근거와 함께 다룹니다. 기존 전체 코드가 lint를 통과했다고 보고하지 않습니다.
- Lighthouse 첫 보고는 `work/ui-tooling-20261001/lighthouse.report.html`·`.json`에 있습니다. Storybook 개발 화면 기준 performance 33·accessibility 100·best-practices 96이었습니다. 작업실 번들과 개발 모드가 포함된 화면이므로 제품 성능 점수로 쓰지 않습니다. 개발 화면 로딩/자동 접근성 검토용이며 모든 사용자 환경의 보증이 아닙니다.

## 계정이 필요한 서비스와 다른 후보

| 도구 | 현재 판단 | 정확한 상태·사용 조건 |
| --- | --- | --- |
| [Penpot](https://penpot.app/) | 브라우저에서 별도 화면 설계·팀 검토가 필요할 때 우선 후보 | 공식 진입점 준비. 계정 생성·로그인·프로젝트 연결 미실행. 현행 UI 작업실 개발에는 계정이 필수 아님 |
| [v0](https://v0.app/) | AI로 다른 UI 방향의 작동하는 초안을 비교할 때 후보 | 공식 진입점 준비. 계정·프로젝트 연결 미실행. 실제 원문·비공개 코드·토큰을 승인 없이 전송하지 않음 |
| [Sketch](https://www.sketch.com/) | Mac 전용 별도 디자인 도구의 대안 | 현재 Storybook/브라우저 설계 경로와 별도 필요가 확인되지 않아 미설치. Penpot과 동시 필수로 지정하지 않음 |
| [ProtoPie](https://www.protopie.io/) | 센서·정밀 움직임·여러 기기 상호작용의 별도 검토 | 현재 실제 React 화면으로 검토 가능한 흐름에 추가 도구를 요구하지 않음. 미설치 |
| [Axure](https://www.axure.com/) | 복잡한 조건·업무 흐름의 별도 프로토타입 | 현재 실행 가능한 앱·Storybook과 역할이 겹쳐 미설치 |
| [Framer](https://www.framer.com/), [Webflow](https://webflow.com/) | 시각적으로 편집하는 별도 웹사이트 제작 경로 | Webflow 플러그인은 사용자 설치 후 설치됨 확인, 계정/사이트 접근은 도구 미제공으로 미검증. Framer는 이번 디렉터리 검색에서 전용 플러그인을 찾지 못함. 기존 React/Vite/GitHub Pages 앱의 이관 완료를 뜻하지 않음 |
| [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Material UI](https://mui.com/material-ui/) | CSS와 UI 부품을 만드는 대안 | 현재 공통 UI·토큰·제품 미감을 보존. 설치 자체를 이유로 앱의 스타일 체계·부품을 바꾸지 않음. 부족한 조작을 구현할 때 경량 접근성 기반 등을 공식 문서에서 선제 검토 |
| Chrome DevTools | 기존 브라우저의 구조·스타일 확인 | 기존 Chrome에 포함되어 있음. 동일 역할의 별도 앱 신규 설치 불필요 |

계정이 있어야 개발이 시작되는 구성으로 만들지 않습니다. 다른 도구가 실제 작업을 더 잘 해결하면 준이 먼저 공식 문서·현재 호환성·필요 부담을 확인하고 준비합니다. 결제·인증·외부 전송·공개 배포는 해당 행동의 권한과 완료 상태를 구별합니다.

## 공식 사용 근거

코딩 연습은 Monaco 0.57.0과 기존 Mac Clang/Clang++, 공식 .NET SDK 10.0.401을 사용합니다. SDK는 `~/.local/share/study-code-runner/dotnet/`에 설치했습니다. 실행·저장·공개 서비스의 경계와 명령은 [코딩 연습 계약](code-practice.md)에 있습니다. `node scripts/code-runner-smoke.mjs`는 격리된 로컬 컴파일/실행을, 별도 preview 빌드 뒤 `npx playwright test --config playwright.code.config.ts`는 실제 앱의 두 브라우저 회귀를 확인합니다. SourceEditor Storybook 상태는 C/C#/읽기 전용 편집 비교용이며 실제 실행·저장 증거와 구별합니다.

- [Storybook React/Vite](https://storybook.js.org/docs/get-started/frameworks/react-vite), [접근성 검사](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- [Playwright 설치와 실행기](https://playwright.dev/docs/intro)
- [Biome 프로젝트 설치](https://biomejs.dev/guides/getting-started/), [공식 편집기 확장](https://biomejs.dev/editors/first-party-extensions/)
- [Prettier 설치·파일 선택 검사](https://prettier.io/docs/install)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)

버전은 최초 설치 확인의 기록입니다. 현재 설치의 기준은 package.json과 lockfile이며 이후 작업에서 변경될 수 있습니다.


## 2026-10-01 관계 그래프

`d3-force@3`와 해당 타입 패키지를 기존 React Flow와 함께 사용합니다. React Flow가 탐색/확대/점 이동을, D3가 연결 구조 자동 배치를 맡습니다. 전체 D3나 별도 그래프 런타임은 추가하지 않았습니다. `npm test -- src/domain/study-graph.test.ts`는 투영/주변 범위/자유 글/원문 보존을 확인합니다. `#/graph`와 `#/board`의 실제 확인 결과/운영 적용 경계는 [기능 계약](graph-and-board.md)을 따릅니다.

### 코딩 연습 자동 문법 검사 (2026-10-01)

기존 Monaco 편집기를 유지하고 web-tree-sitter0.27.0 + @repomix/tree-sitter-wasms0.1.17의 C/C++/C#/Python/JavaScript 문법을 Worker에 연결했습니다. 알려진 실제 문법 정의를 재사용하여 단순 괄호 개수 비교를 피하고 코드의 외부 전송·컴파일 요청 차감 없이 검사합니다. 공식 https://github.com/tree-sitter/tree-sitter/tree/master/lib/binding_web 및 https://github.com/repomix/tree-sitter-wasms 와 설치된 README/API·실제 WASM 호환을 확인했습니다. 현재 npm test -- src/data/code-syntax-parser.test.ts src/domain/code-input.test.ts src/ui/code-practice.test.tsx 로 확인합니다. UI 메시지·Monaco 오류 위치 연결만 맞춤 구현했고 변수/타입/링크/전처리 전체 진단을 주장하지 않습니다. 코드 변경350ms 후 검사·언어별 WASM 지연 로드·실패 재시도·이탈 시 Worker 정리를 사용합니다.

## 질문 카드의 FSRS 계산기 (2026-10-01)

복습 예약은 기존 `ts-fsrs@5.4.2`를 유지합니다. 개인별 가중치 학습에는 공식 `fsrs-browser@6.6.0`을 고정하여 쓰며 `npm run dev` / `npm run build`가 WASM과 Worker 정적 자산을 준비합니다. 라이브러리가 생성한 Worker의 디렉터리 import만 정적 호스팅용 파일 경로로 수정합니다. 최적화 화면에만 Service Worker로 격리 헤더를 적용하고 이력은 외부로 전송하지 않습니다. 후보 비교와 보존·오류 조건은 [질문 카드 문서](recall-cards.md)에 기록했습니다.


## 2026-10-01 수식 탐색에 연결한 도구

KaTeX0.18.10(HTML/MathML 표시), math.js15.2.0(AST/수치계산/기호미분), Plotly.js4.1.1(2D·3D·회전·확대)을 실제 `#/math` 경로에서 지연 로딩합니다. 선정 근거·공식 문서·입력/출력 제한·번들 크기와 직접 확인은 [수식 탐색](math-explorer.md)에 있습니다. `npm run dev`로 메뉴를 열고, 관련 자동검사는 `npx vitest run src/domain/math-explorer.test.ts src/ui/math-explorer.test.tsx`, 타입/빌드는 기존 명령을 사용합니다. 임의 LaTeX/TikZ 컴파일러나 회로 시뮬레이터로 보고하지 않습니다.

그래프 자동 배치 보완은 기존 d3-force/React Flow와 브라우저 Worker를 재사용합니다. 새 라이브러리는 추가하지 않습니다. 관련 검사: `npx vitest run src/domain/graph-layout.test.ts src/domain/study-graph.test.ts`; 실제 자동값/작동 범위/가독성 한계는 [그래프 자동 배치 보완](graph-and-board.md#2026-10-01-자동-배치-보완)을 따릅니다. 검증용 합성 입력은 `work/graph-auto-20261001/fixture.tsx`이며 사용자 원장을 변경하지 않습니다.


## 2026-10-01 실행 중 입력하는 터미널

VS Code에서도 사용하는 node-pty1.1.0과 xterm.js6.0.0/addon-fit0.11.0, ws8.22.0을 기존 Mac Clang/.NET 단일파일 실행기에 연결했습니다. 기존 batch 입력과 저장 명령을 유지하며 WebSocket과 실제 PTY의 연속 입력만 추가했습니다. 터미널 UI는 지연 로딩하며 실행 방식 선택, 실행마다 초기화, EOF/중지, 중간 초안 보관과 입력/출력 한도를 적용했습니다. `npm run test:code-terminal`은 실제 C/C++/C# 및 sandbox/연결 중단/한도를 확인합니다. 로컬5188의 실제 IAB에서 두 번 입력→합계7→저장/재열기를 확인했습니다. 공개 실행 서버는 미연결이며 [연결 계약](code-terminal-server.md)과 공통 outputs/20261001-code-terminal/verification.json을 따릅니다.


### 수식 탐색의 GeoGebra 로컬 파일

`npm run prepare:math-tools`로 공식 GeoGebra math apps bundle 5.4.930.2를 고정 해시와 함께 준비한다. dev/build도 이 준비를 실행한다. 계산과 슬라이더는 브라우저에서 동작한다. Curve·좌표축·회전·확대를 재사용하고 Plotly를 비교/복구 선택으로 유지한다. 설치 파일은 `public/vendor/GeoGebra/`에 생성되며 Git에서는 제외한다. 실제 준비와 앱 조작, 라이선스 조건, 최초 로딩 비용 및 확인 한계는 [수식 탐색](math-explorer.md#2026-10-01-geogebra-로컬-연결과-비교)에 기록했다.

## 합의한 다섯 기기 환경

2026-10-01 사용자 요청에 따라 앱 변경은 `npm run build && npm run test:devices`로 iPhone 17 Pro 세로/가로와 iPad Pro 13인치 세로/가로/좁은 창을 확인합니다. 현재 버전의 화면 목록과 핵심 입력·저장·미지원 대안, CI 적용·모사 범위는 [기기 환경 검증](device-environments.md)에 유지합니다. 위의 일반적인 선택 검사 안내보다 이 명시적 환경 결정이 우선하며, 작은 수정에 관련 없는 제품 전체 QA를 추가하는 뜻은 아닙니다.


### 2026-10-01 컬러의 세 브라우저·대표 기기 회귀

`tools/color-tests/`의 Playwright1.63.0/axe-core4.13.0 별도 의존과 `.github/workflows/color-environments.yml`을 실제 공개 컬러 변경에 연결했습니다. 최종Linux CI36830754544에서9환경18검사가 모두 통과했고 Firefox도 실제 실행했습니다. 위 로컬macOS27 Firefox 실행 제한은 계속 남습니다. 기존 UI회귀 전체를 실행한 결과로 확대하지 않습니다. root 빌드 뒤 도구 폴더의 `npm ci`, `npx playwright install --with-deps chromium firefox webkit`, `npm run build:fixture`, `npm test`를 사용합니다. 대표 터치/화면 재현·합성 기록 저장/재접속·Light/Dark/자동·대비/가로넘침과 물리기기/IME/실계정/Sync를 구별합니다. [실행 결과와 한계](../work/color-release-20261001/배포%20결과.md).

## 2026-10-01 문서 추출·OCR·공개 자막 도구

PDF.js6.3.289, Mammoth, fflate, Tesseract.js7을 기존 React/Vite에 연결했습니다. `node scripts/prepare-material-tools.mjs`(dev/build 선행)는 OCR worker/core와 한국어/영어 traineddata를 public/material-ocr에 준비합니다. 모델은 고정 SHA256으로 재사용/다운로드를 확인하며 생성 assets는 Git에서 제외합니다. OCR은 같은 origin의 모델로 브라우저에서 실행하며 문서를 외부 추출 서버로 보내지 않습니다. Python 전용 venv에 youtube-transcript-api1.2.4를 준비해 `scripts/youtube-subtitles.py`를 기존 로컬 AI 미들웨어에서 고정 인자로 호출합니다. 공개 영상 ID만 허용하고45초/출력 크기 상한·취소를 둡니다.

공유 의존성의 CJS/PostCSS 문제 때문에 이번 확인과 실제5491 앱은 `work/univ-materials-20261001/check-path.txt`에 기록한 정상 lockfile 설치 사본을 사용했습니다. 기존5218/다른 작업 서버·HEAD·index·패키지를 되돌리지 않았습니다. 원본 입력/퀴즈/지도/저장 관련 검사는 그 사본의 vitest.univ.mjs 및 담당 보고/검사 로그를 사용합니다. 실제 GPT quota/원격 승인과 별개이며 [기능·검증 기록](univ-materials-20261001.md)에 한계를 남겼습니다.
