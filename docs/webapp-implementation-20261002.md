# 준비된 기준을 실제 ManSeekSong OS에 연결한 구현

2026-10-02 사용자 「준비된 모든 것들로 웹앱을 구현하라. 아직 하지 않은 과목별 관측소 등은 사후 작업」 요청을 적용했다. 대화 ID는 `01a0fcb4-6a02-77a2-8f37-a3387c42c064`이다. 기존 웹앱의 실제 기능·서버 연결·기록 저장 경로를 재사용하며 준비된 디자인과 실행 사이의 누락을 연결했다. 과목별로 아직 준비하지 않은 관측소·미정 기능은 이번 완료 범위에서 제외한다.

## 실제 연결

- 천문대의 공통 커버/실내·네 자리/천장, 기능별 과업 구성, 공통 토큰·부품·기존 입력/저장/복귀는 현재 실행 구현을 재사용한다. 준비된 복잡 위젯29개는 `figma-memory-20261002/mockup-contracts.json`의 실제 소스/진입 경로에 연결되어 있으며 최신 source symbol과 파일 SHA를 별도로 대조했다. 정지 이미지로 앱의 실제 위젯을 대체하지 않았다.
- 등록 대표 패턴을 가진111개 엔터티의 선택 계약을 `scripts/sync-os-layout.mjs`에서 작은 runtime JSON으로 생성한다. 기존 `featureSurfaceAttributes`를 통해 각 실제 화면/모달/보조면에 profile/primary/narrow/wrapper를 연결하고 종이 단일열·자료/통계 목록·작업대·좁은 화면·오류 문구·모달 폭에 적용한다. 원래 Canvas 위치·카메라·보관함 순서·작업 공간 비율은 재배치하지 않는다. 선택111개 연결이 전체111개의 모든 상태를 실행 확인했다는 뜻은 아니다.
- 본문 계약을 baseline2.1.0·생성기·CSS에 연결했다. 기본 본문700·넓은18px/좁은16px, 메모 입력16px/미리보기14px, 양쪽/마지막 줄 시작 정렬을 실제 개념·기록·메모에 적용한다. 병행 글자 작업의 `paper-typeface.css`와 전체400/700/800 native95% WOFF2를 재사용하며 파일과 생성기는 해당 작업이 소유한다. 입력 영역 자체를 transform하지 않는다. 개인 서체·크기·굵기·읽기 폭 변수를 유지한다.
- 실제 확인에서 남아 있던 수식 관찰/질문과 코드 설명의 자유 글에 `paper-memo` 역할을 연결했다. 코드 본문·실행 입력값·LaTeX·표·축·버튼/라벨은 각 기존 역할을 유지한다. 개념 탐구실 iframe의 설명 문단에도 같은 서체·생성 토큰을 복사해 연결하고 부모의 개인 표현값 전달을 재사용한다.
- 개발 목업 `observatory-workspace.stories.tsx`도 같은 레이아웃/서체와 본문 입력 역할을 소비한다. Storybook 전체 빌드를 완료했고 준비된 종이 작업면의 탭·입력·창 열기/닫기를 실제로 조작했다. 이 개발 예시는 사용자 기록 저장소와 연결되지 않는다.
- GeoGebra의 iCloud `dataless` 파일 때문에 전체 빌드가 복사 단계에서 기다리는 현상을 확인했다. 기존 공식5.4.930.2 ZIP의 승인된 SHA-256을 확인해435개 생성 파일을 동일 판본으로 복구했다. 준비 스크립트는 macOS placeholder를 읽기 전에 감지하고 같은 고정 묶음으로 복구하며 `--repair`도 지원한다. Vite는 public 파일을 독립 복사하는 공식 Node copy-on-write 옵션을 쓰고 빌드 출력 충돌은 거부한다. 검사용 빌드 복사도 같은 옵션을 사용하며 전/후 전체 해시 대조는 유지한다. 개인 수식·메모·저장 시야는 건드리지 않는다.

## 확인한 범위와 증거

정본은 `work/webapp-implementation-20261002/`이다. 완료 앱 빌드는 `app-release/`, 전체 목업 빌드는 `mockup/`이다.

| 확인 | 실제 결과 | 근거 |
| --- | --- | --- |
| 전체 앱 타입/생산 빌드 | 3,449모듈·전체 public 포함 빌드 성공 | `build-release.log` |
| 전체 public 원문 포함 | 549파일 모두 현재 source와 byte SHA 동일 | `runtime-binding.json` |
| 준비된 위젯 소스/진입 대응 | 29개 source symbol 존재·현재 SHA 기록 | `runtime-binding.json` |
| 디자인 토큰 | 60 CSS·오류0 | `design-final.log`, 최종 빌드 로그 |
| 관련 단위 회귀 | 8파일54건 통과 | `unit-threads.log`, `tools-unit.log` |
| 생성 토큰·검사 빌드 독립 보관 | 토큰4건/독립 복사3건 통과 | `tokens-node.log`, `device-run.log` |
| public 복사 보존/충돌 | 하위 파일·라이선스 byte/복사 독립/충돌 거부 통과 | `public-assets.log` |
| 다섯 WebKit 화면 조건 | 중복 제거105개 사례의 마지막 판정 모두 통과 | `verification.json`와 세 실행 원본 |
| 현재 화면 목록 | 30경로를 각5환경에서 진입·넘침·조작 폭·오류 확인 | `run-Y92YwT` screen inventory |
| 목업 | Storybook 전체 빌드 성공·준비된 종이 작업면 실제 입력/탭/모달 확인 | `mockup-build.log`, `storybook-paper.jpg` |
| 실제 인앱 브라우저 | 생산 빌드의 천문대/수식 도구/메모 원문 저장→새로 열기·700/16/14 확인 | `app-home.jpg`, `observatory.jpg` 및 실제 조작 |

기기 실행은 `work/device-runs/run-Y92YwT`(85건 중81즉시 통과), `run-3f7uHE`(20통과), `run-N9htN7`(15통과)이다. 첫 실행의4실패는 최신 개념 렌더가 내용 문단을 정렬하는데 옛 검사가 전체 wrapper를 대상으로 삼은 차이였다. 목표를 실제 `.concept-body > p`로 정정하고 원문·양쪽 정렬·지식 묶음/관계·20개 긴 문단의 재열기/표현 전환/넘침을 다섯 환경 모두 다시 확인했다. 실패 로그를 지우거나 최초 통과로 바꾸지 않았다. 마지막 판정105개는 각 경로의 최신 검사로 합친 결과이며105개를 최종 한 실행에서 동시에 통과시켰다는 뜻은 아니다.

최초 Vitest fork 실행은 worker 시작 시간 초과로 검사가 실행되지 않았다. 단일 thread 재실행으로 필요한54건을 확인했고 최초 로그를 보존했다. 검사 규모를 늘려 앱 전체의 모든 상태/장기 효과를 판정하지 않는다.

## 실행과 보존 경계

현재 Mac에서 완료 앱은 `http://127.0.0.1:5798/?space=demo`, 개인 로그인 진입은 같은 주소의 `?space=demo`를 제거한 경로다. 준비된 전체 개발 목업은 `http://127.0.0.1:5800/`이다. 켜 둔 로컬 서버에 의존하는 주소이며 다른 기기나 공개 주소가 아니다. 개발 재실행은 저장소의 기존 `npm run dev`, 앱 제작은 `npm run build`를 사용한다.

이번 직접 저장 확인은 격리된 합성 예시 공간이다. 기존 개인 로그인/Supabase transport와 서버 권한 구현은 그대로 재사용하며 이번 요청으로 새 운영 서버 쓰기·마이그레이션·계정 삭제·공개 배포를 실행하지 않았다. 실제 계정의 브라우저→서버 저장 왕복, 물리 기기의 한글 조합/터치·장기 누적 관찰과 학습 효과는 이번 결과에서 확인됐다고 하지 않는다. 병행 전체 변경을 임의로 커밋/되돌리거나 지침의 과거 증거를 바꾸지 않는다.

## 선택한 기존 방법

대표 구조는 프로젝트가 채택한 등록 레이아웃·Figma/Atomic Design 구성을 재사용했다. 본문95%는 병행 구현의 native outline/advance 폭을 사용한다. [CSS Fonts](https://www.w3.org/TR/css-fonts-4/)의 font-width 선택과 글리프 자체 가로 축소를 구별하며 단순 font-stretch를95% 구현의 증거로 사용하지 않는다. 서체는 공식 [Google Fonts Nanum Myeongjo](https://github.com/google/fonts/tree/main/ofl/nanummyeongjo)의 OFL 판본과 [fontTools](https://fonttools.readthedocs.io/en/stable/ttLib/woff2.html) 경로를 재사용했다. 파일 복사는 [Node fs.cp/copyFile](https://nodejs.org/api/fs.html#fspromisescpsrc-dest-options)의 FICLONE fallback과 [Vite copyPublicDir](https://vite.dev/config/build-options.html#build-copypublicdir)을 조합했다. 이는 반복 실행·파일 보존 방법이며 제품 전체 품질이나 학습 효과를 보장하는 표준 인증은 아니다.
