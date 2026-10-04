# 실제 앱의 수학·물리 개념 연결 — 2026-10-01

사용자 지정 원본 `../outputs/20261001-math-template-kit/`의 공통 그래프·계산·수식 표시를 `generation2`의 실제 `#/math` 화면에 연결했다. 진입은 기존 메뉴 **수식 탐색 → 탐색할 내용 → 개념 탐구실**이다. 테일러 전개, 선형변환, 적분판정법, 등가속도 운동, 역학적 에너지 보존의 다섯 구성을 제공한다. 공개 배포·서버 변경은 이번 작업에 포함하지 않는다.

## 연결 구조와 선택 이유

기존 Plotly·KaTeX 및 채택된 [수학 인터랙티브 기준](../../docs/수학%20인터랙티브%20설계·검증%20기준.md)을 재사용했다. 새 그래프 엔진이나 별도 서비스는 도입하지 않았다. 원본 kit의 `graphs.mjs`, `gestures.mjs`, `visibility.mjs`, `presentation.mjs`, `model.mjs`, `concepts.mjs`, `physics.mjs`를 앱 저장소의 `src/interactive/math-physics/`로 가져왔다. `origin.json`에는 가져온 시점의 원본 지문을 남겼다. 앱 빌드는 루트 outputs의 존재나 파일 서버에 의존하지 않는다.

- `src/ui/math-explorer.tsx`: 기존 함수·공간곡선/급수 판단 선택에 개념 보기를 추가했다. 기존 그래프를 떠날 때 카메라를 먼저 캡처하는 동작은 유지했다. 기존 메뉴·계정·기록·설정 경로는 변경하지 않았다.
- `src/ui/concept-interactives.tsx`: 같은 origin의 iframe을 실제 앱 안에 지연 로딩한다. 검증된 kit의 DOM·Plotly 이벤트를 재작성하지 않고 재사용하고, CSS 충돌과 이벤트 중복을 피한다. iframe 높이는 내용에 맞춰 조절해 별도 페이지 스크롤을 줄인다. 부모 앱의 토큰·글꼴·테마를 전달하고 중복 브랜드 헤더는 숨긴다.
- `src/interactive/math-physics/host.mjs`: 출처·부모/자식 창·채널을 확인하는 읽기/쓰기 요청과 응답을 연결한다. 계정 ID, 인증 정보, 공부 기록은 iframe에 보내지 않는다. 오류/초기 로딩 timeout과 다시 열기 경로를 둔다.
- `src/data/concept-interactive-view.ts`: 앱의 기존 사용자 namespace/저장 codec/초안 안전 저장을 재사용한다. 부모가 소유자를 정하고 손상 여부를 확인한다. 개인 키는 `study-space:personal:<encoded-userId>:concept-interactives:view:v1`, 예시 공간은 기존 관행대로 `study-space:demo:concept-interactives:view:v1`다. 디바이스 보기 설정이므로 같은 소유자의 새 창에서도 복원한다. 저장 실패 때 미저장 사본을 유지하고, 성공 응답 이후에만 저장 성공을 표시한다.
- `src/data/integral-reasoning-view.ts`: 기존 version/key를 유지하며 active 값 `concepts`만 추가했다. 기존 graph/series 값은 계속 읽는다.
- `src/ui/math-formula.tsx`: kit의 `equationLines()`를 공통 KaTeX 컴포넌트에 연결했다. 최상위 식 구분을 한 줄씩 표시하고 matrix/cases 안의 행·문법과 inline 수식은 유지한다. 원래 수식 문자열은 수정하지 않는다.
- `scripts/prepare-concept-interactives.mjs`, `scripts/prepare-math-tools.mjs`: dev/build 흐름에서 source·앱 정본 토큰·기존 패키지의 Plotly/KaTeX/글꼴/라이선스를 앱 자산으로 준비한다. CDN·원격 그래프 서비스 호출이 없다. `public/tools/concept-interactives/`는 파생 자산으로 ignore한다.

iframe은 정적 데모 링크가 아니다. 실제 앱의 선택 상태·테마·소유자별 저장 연결을 통해 사용하며, 단독으로 파일을 열면 앱에서 진입하도록 제한한다. React의 이벤트 listener·observer·media subscription은 화면/소유자 전환 때 정리한다. 공유 저장소의 병행 변경을 되돌리거나 index/HEAD를 변경하지 않았다.

## 실제 사용과 보존

마우스 드래그는 이동, 터치 한 손가락은 이동, 두 손가락/트랙패드 pinch는 확대·축소다. 일반 스크롤은 페이지 스크롤로 유지한다. 확대·축소 버튼, 전체 보기, 키보드 방향키/+·−/0, 크게 보기와 Esc 복귀가 있다. 영역을 드래그해서 확대하는 동작과 2D 회전은 제공하지 않는다. 과도한 확대에서 두 자리 눈금이 중복되지 않도록 최소 범위와 눈금 간격을 재사용한다. 계산·저장 정밀도는 표시의 소수점 두 자리 제한으로 줄이지 않는다.

다섯 개념의 보기 방식·읽던 단계·조절값·그래프 범위는 독립적으로 저장한다. 등가속도 운동의 위치/속도/가속도 범위도 구분한다. 다른 개념/기존 급수 판단/다른 메뉴로 갔다가 돌아오거나 새로 접속해도 복원한다. `전체 보기`는 해당 그래프 범위를 복구하고 조절값을 유지한다. `이 개념 처음으로`는 해당 개념만 초기화한다. 현재 보기 JSON 내보내기와 저장 다시 확인을 제공한다.

기존 kit의 단독 저장 키는 읽거나 이관하지 않는다. 단독 파일의 소유자가 확인되지 않으므로 개인 계정에 자동 귀속시키지 않는다. 기존 원문·기록·수식 메모·설정·키·이력도 변경하지 않는다. 보기 조작은 공부 완료·숙달·정답 또는 공부 사건을 생성하지 않는다. 보기 상태는 현재 기기 저장이며 서버 동기화로 보고하지 않는다.

## MI01–MI12 적용

| 기준 | 이번 실제 연결 |
| --- | --- |
| MI01 | 원본 다섯 개념의 핵심 질문과 조작 후 관계를 유지 |
| MI02 | 그래프/수식/조건·단계의 역할을 유지; 운동 공간과 시간 그래프를 구분 |
| MI03 | 동일 변수의 LaTeX 표시, 대응점, 실선/파선/점선·라벨을 재사용 |
| MI04 | 단계·근거·결론 및 이전/다음, 중간 단계 복귀를 유지 |
| MI05 | 같은 그래프 toolbar와 native 조절부; 드래그·pinch·버튼·숫자 입력 |
| MI06 | 의미 있는 기본값, 최소 확대 범위, 빈 그래프의 전체 곡선 복귀 |
| MI07 | 적용 조건의 참/거짓/미확인 유지; 정리 적용 불가를 발산으로 바꾸지 않음 |
| MI08 | 검증된 계산 모듈 재사용; 도함수 조건·단위·모델 가정·수치와 정리 결론 구별 |
| MI09 | 키보드/명칭/상태/색 외 단서 재사용; 연결 영역 axe 및 키보드 확인 |
| MI10 | 앱 정본 토큰과 테마 전달; 다섯 WebKit 화면 모사에서 넘침·표시 확인 |
| MI11 | 개념별 상태·실패 재시도·손상 원문 보호·새 창 복귀; 공부 기록 불변 확인 |
| MI12 | 내용/계산/renderer/앱 저장 분리, 원본 지문과 유효성 검사 유지 |

이번 내용 범위는 원본 다섯 구성이다. PDF 전체 개념 생성·임의 문제 풀이·3D 개념 템플릿 확장은 구현하지 않았다. 기존 함수·공간곡선의 3D 도구는 계속 사용한다. 물리 기기의 실제 트랙패드/멀티터치·장기 사용·서버/다른 기기 동기화·학습 효과는 자동 모사 검사와 구별한다.

## 검증과 재현

최종 결과는 `work/concept-interactives-20261001/verification.json`에 기록한다. 실행 코드와 관련 자동 회귀는 `src/data/concept-interactive-view.test.ts`, `src/ui/concept-interactives.test.tsx`, `src/ui/math-formula.test.tsx`, `e2e/devices/concept-interactives.pw.ts`다.

```sh
npx vitest run src/data/concept-interactive-view.test.ts src/ui/concept-interactives.test.tsx src/ui/math-formula.test.tsx src/ui/math-explorer.test.tsx src/data/integral-reasoning-view.test.ts
npm run build -- --outDir work/concept-interactives-20261001/app
DEVICE_BUILD_DIR=work/concept-interactives-20261001/app npm run test:devices -- e2e/devices/concept-interactives.pw.ts e2e/devices/math.pw.ts --grep 'math/physics|failed view|integer grid'
```

공유 dist가 병행 빌드로 바뀌는 상황을 확인해 최종 검사는 전용 outDir의 고정 빌드를 복사해 실행한다. 기존 3D 검사에는 실제 그래프 점의 역할색 대신 일반 버튼색을 찾던 픽셀 기준 및 현재 네 trace를 과거 세 trace로 가정하던 검사가 있었다. 실제 점 색 토큰과 현재 곡선/보조선/축 위 좌표/현재 점에 맞게 검사만 고쳤다. 좁은 화면에서 밀도에 따라 눈금 글자가 숨겨지는 동작도 허용하면서 실제 격자가 그려졌는지와 표시된 눈금의 정수 표기는 계속 확인한다. 기존 그래프 구현을 바꾸지 않았다. 예비 실패 로그는 남기며 최종 통과로 덮어쓰지 않는다.

확인한 정상 흐름은 실제 마우스 드래그, 키보드 이동, 합성 두 손가락 pinch, 확대/전체 보기, 조절값과 읽던 단계 저장, 다른 개념/기존 급수/다른 메뉴 왕복, 새로고침 후 복귀다. 오류 흐름은 격리된 quota 실패 → 현재 입력 유지 → 재시도 → 새로고침 복원, 손상 원문 읽기/재시도/수정 거부와 현재 보기 내보내기다. 소유자 분리와 새 창 복귀는 개인 namespace의 단위 검사로 확인했으며 실제 개인 계정 로그인·서버 저장 왕복과 구별한다.

확인 결과: 관련 새 단위 10개와 기존 수식 단위 재실행 4개, 새 화면 정상/오류 흐름 10개 및 기존 격자 회귀 5개가 통과했다. 기존 네 단위 검사가 기본 5초 제한으로 종료돼 worker 1/30초 제한으로 분리 실행했고 네 개 모두 통과했다. 이전 전체 앱 빌드는 성공했고 고정 빌드의 실제 화면/브라우저 검사도 통과했다. 미저장 사본 뒤 손상 원문을 확인하는 마지막 저장 guard의 단위 검사까지 통과했다. 중간 전체 빌드는 병행 `src/domain/math-templates.ts`·`src/ui/math-template-plot.tsx`의 구문/타입 오류로 중단됐다. scene 객체의 닫는 중괄호와 Plotly의 점 표기 갱신 경로 타입만 국소 보완하고 다른 구현과 병행 보수를 유지했다. 최종 전체 앱 빌드(39 CSS/디자인 오류 0, TypeScript, Vite)는 통과했다. 중간 실패와 5초 단위 timeout은 별도로 보존했다.

최종 빌드의 다섯 화면 정상/오류 회귀는 run-iBILcn의 9통과와 run-BbhubS의 1통과로 확인했다. iPad 세로의 오류 복구 검사 한 건은 graph 초기화가 기본 5초 제한 안에 끝나지 않아 실패했다. 초기화 대기만 30초로 바꾸고 동일한 오류/보존/내보내기 assertion을 단독 재실행해 통과했다. 애플리케이션의 저장 timeout이나 올바름 조건을 완화하지 않았다. 현재 빌드에서 정상 경로 5개와 오류 경로 5개의 고유 검사가 모두 통과했으며 예비 timeout 로그는 남긴다.


## 2026-10-02 천문대 정체성을 개념 화면과 조작에 적용

사용자 “어느 정도 천문대 정체성을 반영해” → “명칭만 말고” 정정에 따라 현재 개념 도구에 실제 화면·이동 흐름을 연결했다. 기존 확정 명칭 ‘개념 탐구실’과 진입/저장 식별자는 유지한다. 이 변경은 교재 전체 개념 제작이나 명칭 재확정, 공개 배포가 아니다.

선정 기준은 기존 MI03–MI05/MI08–MI11의 표현 대응·순서·일관된 조작·정밀 수식·접근성·복귀, 최우선 디자인 지침과 [천문대 정체성 §11](observatory-identity-20261001.md#11-색채uiux-기준값)의 작업면·픽셀 윤곽·현재 선택이다. PhET/DeFT/WCAG의 이미 채택한 근거를 재사용했다. 관측기 배치 자체는 프로젝트의 디자인 선택이며 학습효과가 검증된 표준으로 주장하지 않는다.

- `index.html/style.css`: 기존 천문대의 작은 망원경 path, 밝은 종이색/어두운 남색 작업면, 각진 조절부와 코너 표식. 그래프·조건 조절·현재값 읽기·조건과 근거를 묶고 한글/영문명과 실제 LaTeX를 유지한다. 소품에 aria-hidden/pointer-events:none, 수학 그래프와 본문에는 픽셀화·반복 모션을 적용하지 않는다.
- `app.mjs`: 단계 번호와 연결선, 실제 선택에 따른 현재 단계 표시. 목록 재생성 후 선택 단계에 키보드 초점을 유지한다. 좁은 화면에서도 그래프↔근거로 직접 이동하며 iframe host hash와 개념별 상태를 보존한다. 이 순서선은 읽는 순서이지 조건 충족/숙달률이 아니다.
- `concept-interactives.tsx/host.mjs`: 병행 작업의 `sync-math-observatory.mjs`가 기준값 JSON에서 생성한 부모 수식 탐색의 `--math-observatory-*`만 기존 표시 메시지에 추가 전달한다. 부모 body의 사용자 토큰/서체, 그래프의 의미색과 저장 채널은 유지한다. 명시/OS 테마에 따른 실제 부모 색을 받으며 별도 팔레트·설정 저장소는 만들지 않는다. 처음 복사했던 전체 CSS가 일반 색까지 덮는 문제를 읽기 검토에서 발견해 역할값 전달로 교체했다.

확인: 최종 build(디자인/TypeScript/Vite) 통과, 연결/저장/수식 기존 단위 8개 통과, 고정 빌드 `run-kwkVtv`의 iPhone 세로/가로·iPad 세로/가로/좁은 창 정상/실패 흐름 10개 모두 통과. 단계 이동 링크/초점·야간 역할색·넘침·axe·마우스/키보드/합성 pinch·개념/메뉴 전환/재접속·quota 재시도/손상 원문 보호를 포함한다. 팔레트 수정 전 예비 실행 `run-QL97WC`는 3통과 후 작업자가 중단했고 최종 완료 근거에 합산하지 않았다. 기존 빌드 경고는 로그에 보존한다.

실제 인앱 로컬59471에서 개념 진입, 적분판정법 3단계 선택, 근거로 이동, 키보드로 그래프 복귀, 확대/전체 보기, 에너지의 3개 식, 개념 왕복을 확인했다. 화면 밖 iframe 복귀 링크의 직접 클릭은 인앱 자동화 위치 오류가 나서 Enter 조작으로 확인했고, 다섯 WebKit 모사에서는 클릭과 초점이 모두 통과했다. 개인 계정/서버 쓰기·물리기기·장기 사용/학습효과·배포는 이번 증거에 포함하지 않는다.

결과/로그/화면은 `work/concept-observatory-20261002/`, 실행 추적은 [MAN-12](https://linear.app/manseeksong/issue/MAN-12)에 남긴다. MAN-14/18의 천문대 구현·기준 및 다른 수식 탐색 변경을 보존했다. 계산/개념/물리/그래프/제스처/조판/가시성 모듈과 보기 저장 어댑터는 변경 전후 지문이 같다.
