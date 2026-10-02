# ManSeekSong OS 워드마크 원본

현재 확정값 — 2026-10-02 천문대 문구 및 전체 카피 정정

- `ManSeekSong`: Inter 600, 광학 크기32, 오른쪽8도, 자간-.012em.
- `OS`: Inter 400, 직립0도, 이름의 대문자와 같은100%크기, 자간.065em. 이름과 OS 사이.30em, 공통 기준선.
- `생각을 펼치는 나의 천문대`: Noto Serif KR500 명조, 직립,15px/행간1.8/자간.025em.
- 대표 카피: 「읽고, 쓰고, 연결하며 생각을 펼쳐요.」 설명: 「읽던 자료와 적던 생각을 펼쳐 두고, 새로운 연결을 찾아보세요.」

로그인·사이드바·좁은 상단·별도 개념 탐구실의 제품명에 같은 생성 원본을 사용한다. 좁은 상단에서는 기존 구성대로 로고만 표시한다. 일반 본문과 개인 서체 설정은 유지한다. 아래의 이전 값은 조정 이력이며 현재 기본값은 위와 `assets/brand/wordmark-design.json`이다. 굵기·기울기·자간은 사용자와 확정한 프로젝트 디자인 선택이다.


`manseeksong-os.svg`는 글자별 경로를 유지한 SVG 원본입니다. Illustrator에서 열고 그룹/개별 경로를 선택해 형태와 색을 수정할 수 있습니다. `wordmark-design.json`에는 굵기·광학 크기·가로 비율·자간·글자쌍 간격·OS 크기와 간격을 유지합니다.

재생성: FontTools4.60.2가 있는 Python으로 `python scripts/build-brand-wordmark.py`를 프로젝트 루트에서 실행합니다. 이번 작업 환경은 `/tmp/manseek-wordmark-tools/bin/python`입니다. 이후 환경에서는 `python -m pip install fonttools==4.60.2`로 준비합니다. SVG와 `src/ui/brand-wordmark.tsx`를 함께 생성합니다. SVG만 직접 편집한 경우 앱에도 같은 경로를 반영해야 합니다. 실행 중 브라우저 글꼴 다운로드는 없습니다.

기반 Inter 원본과 SIL Open Font License는 `InterVariable.ttf`와 `OFL.txt`, 출처와 해시는 `source.json`에 있습니다. 본문 서체나 사용자 설정을 이 워드마크에 맞춰 변경하지 않습니다. 앱의 SVG 색은 currentColor이며 밝고 어두운 테마의 기존 글자색을 따릅니다.

2026-10-02: 이름470/OS520·OS76%·자간-.012/.065em·단어간격.30em로 조정했다. 현재 글리프/파라미터는 동일 경로가 소유한다. 한글 고정 문구는 `public/fonts/brand/noto-serif-kr-promise.woff2`(29,136bytes), OFL은 같은 폴더, 다운로드/변환/해시는 `promise-font-source.json`이다. 텍스트를 추가/교체하면 그 문구의 글리프 범위를 다시 확인하며 누락 시 시스템 명조로 표시된다. 현재 생성 Python은 `/tmp/manseek-brand-20261002/bin/python`이다.

2026-10-02 사용자 굵기 후속 조정: 현재 영문 이름/OS는 모두600, 한글 중심 문구는500이다. 앞선470/520/400값은 이전 디자인 이력이다. 크기·자간·기준선·본문 설정을 유지하고 실제 벡터와 로컬 명조 asset/CSS를 함께 갱신했다.

2026-10-02 사용자 기울기 후속: 현재 영문 이름/OS는 오른쪽8도 기울기다. 전체 줄을 회전하지 않고 글리프 윤곽선에 수평 shear를 적용해 공통 기준선을 유지한다. 굵기600과 한글명조500·직립은 유지한다. slantDegrees를 wordmark-design.json과 기존 FontTools 생성기가 함께 소비하며 SVG/React 경계를 다시 계산해 자름을 방지한다.8도는 이번 디자인 선택이다.

2026-10-02 OS 직립 정정: 현재 이름만 오른쪽8도, OS는0도다. 둘 다600굵기·기존기준선/자간/크기유지. 앞선OS8도는이전이력이며 suffix.slantDegrees0이현재원본이다.

2026-10-02 OS 크기·획 후속: OS를 이름의대문자높이에맞춘100%크기·굵기400·직립으로변경했다.이름600/오른쪽8도와한글500직립은유지한다.앞선OS76%/600은이전이력이다.기존Inter광학크기32의실제M1490·S/O1514(곡선overshoot)와기준선을대조했다.

현재 한글 중심 문구 asset: public/fonts/brand/noto-serif-kr-observatory.woff2 (58856bytes). 새 문구 글리프 전체 포함·500/직립, 출처/해시/라이선스는 promise-font-source.json이다. 이전 promise 파일은 과거 이력이며 런타임 CSS는 새 파일을 사용한다.
