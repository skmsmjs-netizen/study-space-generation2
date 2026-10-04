# ManSeekSong OS — 개발 인계

확인일: 2026-10-04, 한국 시간. 이 문서는 다른 개발자가 저장소를 받아 현재 웹앱 개발을 이어가기 위한 시작점이다.

## 1. 받는 위치와 버전

| 대상 | 위치 | 의미 |
|---|---|---|
| 원격 저장소 | https://github.com/skmsmjs-netizen/study-space-generation2 | 공개 Git 저장소 |
| 인계 브랜치 | `codex/developer-handoff-20261004` | 최신 main과 미통합 로컬 파일, 상위 공통 지침을 함께 보존한 전달본 |
| 인계 브랜치 링크 | https://github.com/skmsmjs-netizen/study-space-generation2/tree/codex/developer-handoff-20261004 | 친구에게 보낼 코드·문서 시작점 |
| 인계 기준 main | `7cf429da823a8dcd89d90b3d8ab665698abe5e1d` | 2026-10-04 조회한 원격 main. 뒤로가기·앞으로가기 구현 포함 |
| 공개 앱 | https://skmsmjs-netizen.github.io/study-space-generation2/ | 현재 사용 중인 웹앱 |
| CI·배포 이력 | https://github.com/skmsmjs-netizen/study-space-generation2/actions | 코드 검사·Pages 배포 기록 |
| 기준 버전 배포 기록 | https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/37139984788 | 최신 로컬 인계에 성공으로 기록된 실행. 이번 작업에서 검사를 다시 실행했다는 뜻은 아님 |

**실행·개발 기준은 저장소 루트의 최신 main 소스다.** `handoff/local-pending/files/`는 공유 로컬 폴더에서 발견한 미통합·상이한 파일이다. 파일별 보존 위치와 SHA-256은 [전체 파일 대조 목록](handoff/local-file-inventory.json)에 있다. 원격에 같은 내용이 이미 있는 파일은 원격의 해당 경로를 가리키며 중복 복사하지 않았다. 로컬 변경을 main에 통합할 때는 이 목록과 실제 차이를 보고 필요한 변경만 선택한다.

## 2. 원래 Mac의 파일 위치

| 대상 | 절대 경로 |
|---|---|
| 공통 프로젝트 폴더 | `/Users/manseeksong/Documents/ChatGPT/학습 시스템 설계 프로젝트` |
| 실제 웹앱 개발 폴더 | `/Users/manseeksong/Documents/ChatGPT/학습 시스템 설계 프로젝트/generation2` |
| 공통 지침 | `/Users/manseeksong/Documents/ChatGPT/학습 시스템 설계 프로젝트/AGENTS.md` |
| 공통 설계·학습·품질 문서 | `/Users/manseeksong/Documents/ChatGPT/학습 시스템 설계 프로젝트/docs` |
| 웹앱 최신 인계 | `/Users/manseeksong/Documents/ChatGPT/학습 시스템 설계 프로젝트/generation2/docs/resume-handoff.md` |
| 병행 작업·검사·임시 체크아웃 | `/Users/manseeksong/Documents/ChatGPT/학습 시스템 설계 프로젝트/generation2/work` |

공통 프로젝트 폴더와 `generation2`는 각각 Git 관리 경계가 있고, 웹앱의 origin은 `generation2`에 연결되어 있다. 상위 폴더 전체가 자동으로 웹앱 저장소에 올라가지 않는다. 공유 로컬 `generation2`의 HEAD는 `9ca470c6be8127bddd2008b8e156c63ad4f33342`, 브랜치는 `codex/gen2-foundation`이며 이후 병행 작업이 작업 파일에 누적되어 있다. 이것을 최신 원격 main과 동일한 상태로 취급하지 않는다.

## 3. 코드와 자료의 역할

| 경로 | 담당 내용 |
|---|---|
| `src/App.tsx`, `src/main.tsx` | 앱 진입, 화면 연결 |
| `src/ui/` | 화면, 공통 부품, 입력·읽기·탐색·관측소, CSS와 관련 검사 |
| `src/domain/` | 학습 기록 모델, 명령, 계산·규칙 |
| `src/data/` | 브라우저 저장·복구, 서버 연결, 자료 입출력 |
| `src/server/` | 서버 명령과 권한 등 백엔드 구현 |
| `src/content/` | 앱에서 소비하는 콘텐츠 |
| `public/` | 서체, 아이콘, 정적 엔진·런타임 자산 |
| `assets/` | 서체·브랜드 원본, 라이선스·생성 정보 |
| `scripts/`, `tools/` | 준비·빌드·검사·개발 보조 도구 |
| `supabase/functions/` | Edge Function의 편집 가능한 소스·빌드 결과 |
| `supabase/migrations/`, `supabase/tests/`, `supabase/operations/` | DB 변경 이력, SQL 검사, 운영 작업 정의 |
| `e2e/`, `.storybook/`, `playwright*.config.ts` | 브라우저·기기 모사 검사와 공통 부품 확인 |
| `.github/workflows/` | GitHub Actions와 Pages 배포 |
| `package.json`, `package-lock.json` | 실행 명령과 잠금된 의존성 |
| `docs/` | 데이터 계약, UI·UX 기준, 구현·검증·인계 문서 |
| `handoff/project-context/` | 원래 상위 프로젝트에만 있던 공통 지침·활성 문서의 전달본 |
| `handoff/local-pending/files/` | main과 다른 로컬 파일의 보존본. 자동 적용된 변경이 아님 |

원문·ID·저장 키·이력·초안·개인 서체·테마·Canvas 좌표·개인 배치·권한을 보존한다. 학습 시도·체크를 숙달·독립 해결·학습 완료로 바꾸지 않는다. GPT/AI는 기존 민석 계정에 대한 서버 권한 계약을 유지한다.

## 4. 처음 읽을 문서

1. [공통 프로젝트 지침](handoff/project-context/AGENTS.md), [웹앱 지침](AGENTS.md).
2. [현재 main의 인계](docs/resume-handoff.md)와 파일 목록에서 찾을 수 있는 공유 로컬 인계의 보존본. 날짜별 성공·진행·실패 기록을 구분한다.
3. [공통 문서 안내](handoff/project-context/docs/프로젝트%20문서%20안내.md), [작업 진행과 검증 정책](handoff/project-context/docs/작업%20진행과%20검증%20정책.md).
4. 변경할 기능에 해당하는 [아키텍처](docs/architecture.md), [데이터 계약](docs/data-contract.md), [배포 계약](docs/deployment.md), [병행 개발 운영](docs/parallel-work.md).

화면 변경은 `docs/design-ui-ux-priority.md`, `docs/layout-standard.md`, `docs/observatory-design-standard.md`, `docs/knowledge-structure-standard.md`, `docs/paper-typography-standard/README.md`의 해당 부분을 따른다. `handoff/local-file-inventory.json`은 루트 또는 로컬 보존본 중 각 문서가 실제 저장된 경로를 알려준다. 전체 제품 상태는 한 개의 오래된 README·Phase·성공 배포만으로 판정하지 않는다.

현재 본문 기본값은 한글·영문 모두 나눔명조 Bold 700, 장평 95%, 양쪽 정렬·마지막 줄 시작 정렬이다. 원문과 개인 설정을 보존한다. VoiceOver 전용 구현·검사는 최신 사용자 결정으로 제외되어 있으며, 일반 키보드·초점·레이블·터치·저장·복귀는 유지한다. 결제 및 문의 접수·회신 기능도 제외 결정이 있다.

## 5. 다른 컴퓨터에서 실행

현재 `package.json`은 Node.js `>=22.12`를 요구하고 기존 Pages workflow는 Node 24를 사용한다.

```sh
git clone --branch codex/developer-handoff-20261004 https://github.com/skmsmjs-netizen/study-space-generation2.git
cd study-space-generation2
npm ci
npm run dev
```

터미널에 출력되는 Vite 주소를 연다. `npm run dev`는 필요한 OCR·수학 엔진·복습 최적화 자산을 준비하므로 최초 실행에는 인터넷이 필요하다. 이 자산은 저장소에 없더라도 기존 준비 스크립트로 재생성하는 범위다.

```sh
npm run typecheck
npm test
npm run build:backend
npm run build
```

관련 화면·저장 경로를 변경했으면 프로젝트 정책에 맞는 브라우저 검사를 선택한다. 전체 기기 모사 검사는 Playwright WebKit을 설치한 뒤 `npm run test:devices`로 실행한다. 테스트 계정·합성 자료를 사용하고 개인 기록을 검사 입력으로 쓰지 않는다.

환경변수 이름은 [.env.example](.env.example)을 따른다. 현재 공개 연결값과 대체 설정의 사용 방식은 `src/data/supabase-client.ts`에 있다. service-role 키·OpenAI API 비밀키·로그인 토큰은 GitHub 또는 프런트 환경변수에 넣지 않는다. 키와 실제 계정 권한은 소유자가 해당 서비스의 권한 관리에서 따로 제공해야 한다.

## 6. 외부 서비스와 디자인 링크

| 대상 | 링크 | 접근 조건 |
|---|---|---|
| 실제 Figma 설계 | https://www.figma.com/design/YHmD1PpWWfR9JGTEs77JsX | 해당 Figma 파일 접근 권한 |
| Figma 전체 구조 | https://www.figma.com/design/YHmD1PpWWfR9JGTEs77JsX?node-id=155-180 | 동일 파일 |
| 레이아웃 기준 | https://www.figma.com/design/YHmD1PpWWfR9JGTEs77JsX?node-id=227-181 | 동일 파일 |
| 본문 조판 기준 | https://www.figma.com/design/YHmD1PpWWfR9JGTEs77JsX?node-id=241-202 | 동일 파일 |
| Linear 프로젝트 | https://linear.app/manseeksong/project/학습-입력-웹앱-640485bb7d97 | 워크스페이스·프로젝트 권한 |
| 병행 작업 현황 문서 | https://linear.app/manseeksong/document/manseeksong-os-병행-작업-현황-2026-10-01-e3ae9bbbe109 | 해당 Linear 문서 접근 권한. 문서의 과거 상태는 재조회 필요 |
| Supabase 관리 화면 | https://supabase.com/dashboard/project/lbuiwotjisbzgflixjvg | 프로젝트 관리 권한 |
| Supabase API 주소 | https://lbuiwotjisbzgflixjvg.supabase.co | 관리 화면이 아닌 앱 API 주소 |

Figma·Linear·Supabase 링크는 현재 담당 문서와 소스에 기록된 연결이다. 이번 인계 작업에서 친구의 계정 접근 권한을 확인하거나 부여하지 않았다. 공개 코드의 열람·복제와 원격 push·배포·운영 서버 변경은 서로 다른 권한이다. 운영 DB·RPC·RLS·Edge 변경은 기존 명시 승인 범위를 확인한다.

## 7. GitHub에 넣지 않는 파일과 자료

- `.env`, 인증·API 비밀키, 로그인 토큰, `.local/`, 실제 개인 백업·비공개 전집 원문: 공개 저장소에서 제외한다. 사용자 승인과 접근 권한을 갖춘 별도 전달 경로가 필요하다.
- `node_modules/`, `dist/`, Storybook 빌드, 자동 생성 정적 엔진: 의존성 잠금 파일·준비 스크립트·빌드로 재생성한다.
- `work/`, `output/`, `outputs/`, Playwright 결과: 임시 체크아웃·브라우저 런타임·빌드·화면 검사 기록이다. `generation2/work/`의 기존 Git 미추적 파일만 약 52.9GB로 확인되었다. 해당 내용을 제품 소스와 함께 무조건 Git에 넣지 않는다. 직접 필요한 결과는 담당 `docs/`와 CI 링크로 찾는다.
- 브라우저 localStorage·IndexedDB와 Supabase의 실제 사용자 자료: 코드 파일이 아니므로 Git clone으로 이동하지 않는다. 기존 앱의 내보내기·백업·복구와 계정 접근으로 별도 처리한다.
- 종료한 Obsidian 구현·보관본: 현재 웹앱 개발을 위한 자동 열람·재개 대상에서 제외한다.

선택 근거는 기존 프로젝트 보존·배포 계약, [Git의 gitignore 문서](https://git-scm.com/docs/gitignore), [GitHub의 민감 정보 취급 지침](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)이다. 파일별 보존 확인은 파일 목록과 SHA-256 대조로 수행한다. 코드·문서 원격 보존을 앱 전체 동작·새 배포·운영 서버 검증으로 표현하지 않는다.

이번 인계에서는 파일별 SHA-256·Git 인덱스 포함 여부·주요 진입 문서 링크와 비밀키 패턴을 확인했다. 실행 소스는 기준 main과 동일하게 보존했다. 격리 복제본에서 기존 로컬 의존성으로 시작한 타입 검사는 실행이 완료되지 않아 중단했으며 통과로 판정하지 않았다. 전체 생산 빌드·기기 모사 검사·운영 서버 검사를 이번 파일 인계에서 다시 실행한 것은 아니다. 상세 결과는 [인계 확인 기록](handoff/verification.json)에 있다.

## 8. 친구에게 전달할 시작 요청

> ManSeekSong OS 개발을 이어받아 주세요. 저장소 https://github.com/skmsmjs-netizen/study-space-generation2 의 `codex/developer-handoff-20261004` 브랜치를 받아 `DEVELOPER-HANDOFF.md`, 공통·웹앱 AGENTS.md와 최신 인계를 읽어 주세요. 저장소 루트는 2026-10-04의 최신 main 실행 소스이며, `handoff/local-pending/files/`에는 미통합 로컬 변경이 있습니다. 파일별 대조 목록을 보고 기존 main 변경을 보존하며 필요한 것만 통합해 주세요. 원문·ID·초안·이력·개인 설정·배치·권한은 유지하고, 운영 서버 변경이나 공개 배포는 해당 승인 범위를 먼저 확인해 주세요. 첫 실행은 Node 24에서 `npm ci`, `npm run dev`로 확인하고, 맡을 구체적인 작업에 필요한 검사와 저장·복귀 확인을 진행해 주세요.
