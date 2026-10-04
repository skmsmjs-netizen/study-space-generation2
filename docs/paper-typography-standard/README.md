# 종이 본문 글자 기준 — 한글·영문

**2026-10-03 기존 Figma 후속:** [39페이지 검토 기록](../figma-guideline-review-20261003/README.md)에 OS28페이지 직접 조판2,737개와 인스턴스 포함3,875참조의 실제95%·700/800강조·justify 대응을 연결했다. 기존16재사용 원본의 활성95% 미완도 보완했다. 앱의 OFL 파생 WOFF2를 대조해 만든 데스크톱용TTF로 원래 텍스트/ID/문구를 유지하며 편집할 수 있다. 수식 혼합 본문은 보존 원문과 표시 윤곽을 구별한다. 일곱 유형의 공백/기준선 복구를 마쳤으며 공통 본문 부품 Fill1건은 편집 연결 오류로 남았다. [로컬 글꼴 묶음](../figma-guideline-review-20261003/native-plugin/fonts/)과 마지막 재개 범위가 담당 원본이다. 아래2026-10-02의 윤곽 보드 기록을 지우지 않는다.

2026-10-02 사용자 최종 선택 **나눔명조 Bold 700·장평95%·양쪽 정렬·마지막 줄 시작 정렬**을 지침과 Figma에 반영했다. 이전500/장평100% 선택을 정정한다. 후속 「반영하라」 지시로 앱 적용 대기를 해제하고 실제 로컬 앱의 읽기·입력에도 연결했다.

[Figma 기준 보드 열기](https://www.figma.com/design/YHmD1PpWWfR9JGTEs77JsX?node-id=241-202) — 기존 `01 기초 · 색·글자·간격` 페이지의 `Paper Typography / 700 · 95% · 한글·영문` 보드이다. 한글·영문을 나란히 놓았다.

| 적용 자리 | 기본 크기 | 굵기 | 행간 | 자간 | 장평·정렬 |
| --- | --- | --- | --- | --- | --- |
| 펼친 개념·지식 설명 / paper | 18px | 700 | 2 | −0.05em | 95% · justify/start |
| 좁은 본문 / paper | 16px | 700 | 1.85 | −0.025em | 동일 |
| 작은 미리보기 / 접힌 메모 | 14px | 700 | 1.85 | −0.025em | 동일 |
| 직접 쓰는 메모 / 자유 글 | 16px | 700 | 1.85 | −0.025em | 동일 |

크기는 root16px 환산의 기본값이다. 개인 서체·크기·확대·읽기 폭을 유지하며 숫자를 표현의 상한으로 삼지 않는다. 실제 본문 영역40rem 이하에는 작은 면의 행간/자간을 사용한다. 미리보기의14px를 입력란에 그대로 적용하지 않으며 입력은 최소16px로 유지한다. 긴 내용은 펼침·스크롤로 이어 읽을 수 있어야 한다. 미리보기/입력 중 재조판이 원문·커서·선택·한글 조합을 흔들어서는 안 된다.

한글과 영문 **본문은 모두 나눔명조700**이다. 영문 제목은 Inter600을 사용하며 제목/버튼/탐색·조작 라벨/표/축/수식/코드는 각 역할을 유지한다. 예시 메모의1인칭 문장은 조판을 보여주기 위한 합성 예시이며 실제 사용자의 공부 기록이 아니다.

## 담당 원본과 Figma 표현

- [선택 계약](contract.json): 최신 승인값, 적용/제외 범위, 보존, Figma 및 실제 앱 적용 상태. 이 계약이 이번 후속 승인값의 원본이다.
- [Figma 명세](figma-manifest.json): 실제 보드·스타일·변수·예시 원본/윤곽의 ID와 장평 비율.
- [검증 결과](verification.json): 한글/영문8예시·텍스트 원본 보존·스타일 연결·겹침/넘침0·실제 렌더 확인.
- [실제 Figma 스크린샷](figma-overview.png): 최종 조판과 작은 미리보기/메모 크기 비교.
- [작성 스크립트](build-figma.js): 기존 Figma 라이브러리 스킬의 문서 보드 도우미를 이 작업의 기존 페이지/재료/한글 설명에 맞게 조정. 동일 이름 보드가 있으면 재조회 없이 중복 생성하지 않는다.

Figma의 재사용 Text Style은 `Observatory/Paper/body`, `compact`, `preview`, `memo`, `EnglishHeading`이다. 기초 보드 작성 당시 본문4개는 `NanumMyeongjo / Bold`와 변수에 연결했다.2026-10-03 기존 화면 확장에서는 본문4개 스타일과 일반 본문을 실제95% OFL 파생 `ManSeekSong Paper / Bold`에 연결했고 원래800 강조를 유지한다. 기존 paper 재료·간격 변수를 재사용하고 기존 페이지/기초 보드/스타일을 변경하지 않았다.

**Text Style 자체는 장평을 저장하지 못한다.** 다음 윤곽 방식은2026-10-02 기준 보드의 표현 기록이다.2026-10-03 일반 본문은 실제95% 글꼴을 사용하므로 이 고정 윤곽 방식과 구별한다. 공식 Plugin API의 `relativeTransform`도 글자 가로 축소를 지원하는 속성이 아니다. 따라서 실제 글리프의 윤곽 복사본만 가로95%로 축소하고, 원문과 스타일을 가진 편집 가능한 텍스트 원본을 각 조판 안에 숨김 레이어로 보존했다. `편집 원본 / … / 700`을 표시하면 원문을 수정할 수 있다. 눈에 보이는95% 윤곽은 고정 확인용 조판이므로 원문 수정 후 자동 갱신되는 입력 컴포넌트로 보고하지 않는다. 현재 예시의 마지막 줄 시작 정렬은 실제 렌더로 확인했다.

Figma 변수의 CSS syntax는 역할 연결을 기록한다. 장평 변수의 `--paper-body-glyph-scale-x`는 **계획된 역할명**이며 현 앱에서 실제 소비하는 CSS 변수라고 주장하지 않는다. 장평은 CSS transform 변수 대신 실제 글리프/커서 계산 폭을95%로 만든 서체 파일에서 소비한다. 나머지 글자 역할은 기존 baseline과 생성 CSS에 연결했다. 기준 보드 제작을 코드 연결/자동 동기화/전체 Figma 기존 화면700 적용으로 확대하지 않는다.

## 실제 앱 적용

사용자 「반영하라」로 기존 앱 적용 대기를 해제했다. 병행 웹앱 구현의 `metrics.paper.bodyTypography`·`bodyAlignment`, 생성기/역할 CSS를 재사용하며 [런타임 결과](runtime-verification.json)에 이번 변경의 근거를 구분한다. 한글·영문 본문은 동일한 Bold700을 사용한다. 실제 본문 폭40rem 이하에는16px/1.85/−0.025em을 적용하며 메모 입력16px와 미리보기14px를 별도로 유지한다. 기존 기록 수정란도 직접 쓰는 본문 역할에 연결했다.

`ManSeekSong Paper`는 나눔명조의 OFL 파생 서체명이다. 사용자 승인한 모양을 유지하면서 글리프 윤곽과 가로 advance/side bearing/GPOS 커닝을 함께95%로 만들었다. 요소에 CSS scaleX를 적용하지 않으므로 입력과 선택은 네이티브 글자 좌표를 사용한다. 원본의 모든 문자 대응/글리프, 세로 좌표/행 메트릭을 대조하고 유지했다. 실제700 기본 본문,400 개인 굵기 설정,800 강조를 위한 전체3개 WOFF2를 제공하며 필요한 굵기만 로드한다. [원본·생성물 해시와 전수 대조](../../assets/paper/font-width-manifest.json), [생성기](../../scripts/build-paper-typeface.py), [OFL](../../src/ui/fonts/paper/OFL.txt)가 담당 원본이다. 서체를 다시 만들 때 Python3.10+·fonttools4.66.1·brotli1.2.0을 사용하며 일반 앱 빌드는 저장된 WOFF2를 Vite 자산으로 소비한다.

개인 `--font-reading`, `--paper-body-size/weight/line/tracking`, 입력/미리보기 크기 오버라이드를 유지한다. 조작 구역의 조상은 interface 서체를 사용하고 실제 설명 문단에만 reading 서체를 적용한다. 코드·수식·표/축·제목의 역할을 유지하며 영문 개념 설명의 관사a를 기존 수식 자동 처리에서 분리했다. 명시적 `$a$`, 변수 `a = 2`, 한글 변수 설명은 수식 역할을 유지한다. 원문·저장 키·ID·초안·이력·개인 배치는 변경하지 않는다.

[한글 입력 실제 화면](../../work/paper-typography-20261002/runtime-ko.jpg) · [영문 입력 실제 화면](../../work/paper-typography-20261002/runtime-en.jpg) · [개념 설명 실제 화면](../../work/paper-typography-20261002/runtime-concept-ko.jpg). 모든 글은 격리된 조판 확인용 합성 예시이다. 로컬 입력/저장/재접속과 기기 모사를 실제 계정/서버·물리 기기의 한글 IME·학습 효과·배포로 확대하지 않는다. 관련 JS/CSS/서체 bundle 빌드는 확인하고 전체 public GeoGebra 자산 복사는 로컬 파일 읽기 대기로 완료되지 않아 중단했다. 이 작업의 새 공개 배포는 수행하지 않았다.

## 선택 근거

사용자가 앞서 본 한글/영문 조판 예시와 최종700/장평95% 선택이 미감 기준이다. 나눔명조의 실제 제공 굵기는 [Google Fonts 메타데이터](https://raw.githubusercontent.com/google/fonts/main/ofl/nanummyeongjo/METADATA.pb)400/700/800이며 이번 Figma 실제 서체 조회에서 `NanumMyeongjo/Bold`를 확인했다. 스타일과 장평의 표현 범위는 [Figma TextStyle](https://developers.figma.com/docs/plugins/api/TextStyle/), [relativeTransform](https://developers.figma.com/docs/plugins/api/properties/nodes-relativetransform/) 및 로컬 공식 API typings로 확인했다. CSS 굵기/정렬의 의미와 프로젝트 미감값은 구별한다.
