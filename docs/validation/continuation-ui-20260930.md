# 2026-09-30 보관본 수신·서문 복귀·메뉴 초점 후속 실행

시작 코드 b783fb4. 수정 cfbd5d8/b50ab37, 다운로드 회귀 실행기06b2707. 개인 원본은 가져오지 않았습니다. 전용 localhost4187의 demo 자료이며 공개 origin과 분리했습니다. In-app Browser의 실제 렌더·포인터/키보드 조작과 별도 Chrome153 자동 브라우저를 구별합니다. Browser 도구의 fill은 native 한글 IME 증거가 아닙니다.

| ID | 진입점과 실제 조작·관찰 | 판정·경계 |
|---|---|---|
| B29 | 보관본3개 제품 ‘원문 내보내기’→Chrome download event→실제 수신 파일 saveAs→디스크 파일 read/JSON 재열기. 빈 원문0, 긴 원문228000 UTF-16단위, 특수 원문64단위. CRLF/탭/NUL/서로 떨어진 고립 high·low surrogate/앞뒤 공백·raw·sourceKey/archiveKey/metadata 일치. | 통과. fresh headless Chrome153.0.8010.53, 세 파일616/552611/718바이트와 hash는 continuation-download-20260930.json. 별도 만들어 둔 파일/clipboard를 제품 다운로드로 사용하지 않음. |
| B30 | createObjectURL 한번 실패 주입→다운로드 시작 실패 alert·성공 notice 없음→재시도 actual file 수신. 보관원문/현재초안/metadata/demo repository 등 보호값10개 전후 일치. | 통과. 합성 시작 실패이지 실제 OS 저장 실패 아님. UI는 ‘다운로드를 요청했습니다’로 수신보다 강한 성공을 주장하지 않음. |
| B31 | 단원 demo-unit-functions의 ‘단원 서문’ 펼침→앞 공백/두 줄/끝 개행 글→오늘→Back→reload. 펼친 상태와 원문 유지. 내용 저장→저장 안내·공부 기록0. 직접 접기→오늘/Back/reload 뒤 접힘 유지. | 수정 후 통과. 최초 생성의 ID를 복귀 때 다시 만들던 결함을 수정. 과목·주제 최초 초안과 다른 대상 격리·손상/쓰기거부 hint는 자동 회귀로 별도 확인. |
| B32 | 넓은1280 주 메뉴 오늘→Back, 좁은390 빠른 이동 오늘→Back. 전에는 같은 href의 브랜드에 초점. 수정후 실제 표시된 오늘 링크 초점으로 복귀. 좁은창 dark 서문 펼침/본문 확인. | 수정 후 통과. 화면폭과 문서scrollWidth가 각각1280/390으로 일치. 숨은 다른 메뉴 복사에 초점을 두지 않음. 물리 touch/VoiceOver 아님. |
| B33 | 최근 주제가 없는 홈: ‘기록을 시작할 주제’→첫 ‘공부함’1회 클릭→회차0→1, 본문 없이 저장 안내. 추가 질문/필드 입력·화면 이동 없음. | 통과. A의 최근 기록 없는 이번 시작점. 조작1, 입력focus0, 문자0, 스크롤0, 화면이동0, 주제·공부사실 판단 필요. 이전 실행 숫자를 재사용하지 않음. |
| B34 | 기록 있는 홈에서 범위를 독립 공부로 선택→다른 학기 최근 링크0·회차0. 다시 모든 공부→동일 주제·회차1 복원→최근 주제 링크로 재열기. | 통과. E의 다른 범위 상태. 범위 선택2, 링크1; 문자0·본문 입력focus0·scroll0·route이동1. 읽기만으로 회차가 추가되지 않음. 선택·소속 판단은 필요. |
| B35 | 빠른 공부함으로 만든 기록→주제→기록 수정→‘일부 풀다 막힌 이유’ 포함2줄 저장. 원문 앞뒤공백 유지. 이전 생성 Undo는 수정 저장 안내로 교체되어 과거 Undo 버튼을 제공하지 않음. | 해당 UI 관찰 통과. 주제 링크1/수정1/본문focus1/저장1(총4), 필드1·33문자, 화면이동1·scroll0. 오래된 Undo의 의존변경 거부는 기존 domain 자동시험; 실제 UI에서 그 거부를 실행했다고 하지 않음. |

In-app Browser에서는 다운로드 요청 안내 후 event8초 대기가 끝났고 수신 위치를 찾지 못했습니다. 이 한계는 보존합니다. 사용자 Browser 프로필/파일을 우회하지 않고 별도 격리된 자동회귀 Chrome을 실행하여 B29의 수신을 확인했습니다. 최초 runner는 앱이 demo repository를 초기화하기 전 snapshot을 잡아 보존비교가 달랐습니다. fixture 준비 전 앱 초기화 후 새 context로 재실행했으며 제품 손상으로 판단하지 않았습니다. 초기 실패·첫 파일은 저장소 밖 이번 outputs에 보존했습니다.

B31 이후 HMR 시 해당 시험 탭의 잠금 재취득 오류는 자신의 ‘다시 시도’로 재시작해 풀렸습니다. 기존 공개 B27 잠금을 현재 차단으로 사용하지 않았고 다른 작업의 창/서버를 종료하지 않았습니다.

A–G 전체 시작조건/물리기기/1세대 안전복제 baseline은 완료되지 않았습니다. B/C/D/F는 이번 새 수치로 측정하지 않았으며 기존 B20–28을 과거 증거로 유지합니다. RecordForm은 header 독립 공부를 선택해도 모든 학기의 주제를 보여 주는 것을 관찰했습니다. 복수범위 한 사건을 보존하는 요구 때문에 임의 필터하지 않았으며 표시 경계는 추가 확인 대상입니다.

기존 P01 iPhone17 Pro 사용자 보고를 유지합니다. 새 긴 표 물리기기 질문은 답변 대기이며 창을 닫았다는 과거 응답은 답으로 간주하지 않습니다. Supabase 기존 프로젝트는 이번에 로그인/Healthy를 확인했지만 앱 Auth/CRUD/RLS·서버수신은 미구현/미검증입니다. 비밀번호/secret/service-role을 읽거나 공개하지 않았습니다.

## 후속 조건부 상태·실제 확대

- **B36 수정 후 통과:** 검색어 `없는검색결과_20260930`의 결과0일 때 빈화면이었던 것을 직접 재현했습니다.482d302에서 기존 EmptyState로 결과 없음과 검색어/상단 범위 변경 안내를 추가했습니다. 없는말→함수 결과→독립 공부 무결과→전체 결과→상세/Back에서 검색어와 결과링크 초점을 확인했습니다.390dark scrollWidth390, 실제 렌더 screenshot을 검수했습니다. native IME와 서버검색은 미검증입니다.
- **B37 통과:** Chrome153 새 프로필 실제 브라우저zoom200%에서 더보기→휴지통→오늘→학기추가 모달→공백 이름 오류→내부스크롤로 버튼 도달→수정 저장→과목/오늘→reload 학기 보존. 동일1280×900 창, CDP zoom1→2/pinch scale1, CSS폭1280→640, root16px/transform none. CSS 글자/viewport 확대 대체가 아닙니다. 모든 실행 단계 document scrollWidth640. 별도 headless Chrome의 실제 렌더·조작이며 물리기기 검증이 아닙니다.
- **B38 통과:** 같은 브라우저에서 reducedMotion media를 reduce로 모사하고 해당 media=true, Modal animation/transition duration0s, 닫은 뒤 열기버튼 focus, 메뉴 닫힘을 확인했습니다. 실물 OS설정이나 전컴포넌트 모션검증이 아닙니다.

[200% 요약](continuation-zoom-20260930.json), [오류/저장버튼 도달](continuation-zoom-error-save.png), [검색390dark](continuation-search-dark-390.png). 확대의100/200 원시비교와 재실행 스크립트는 저장소 밖 이번 outputs의 zoom-probe-results.json/zoom-flow.mjs/zoom-verification.md에 있습니다. 실제 확대 설정의 근거는 Chromium 공식 [ChromeZoomLevelPrefs](https://github.com/chromium/chromium/blob/main/chrome/browser/ui/zoom/chrome_zoom_level_prefs.cc) 및 [page zoom 변환](https://github.com/chromium/chromium/blob/main/third_party/blink/common/page/page_zoom.cc)입니다.

추가 자동검색검사의 첫 실행은 shell 기본 Node24.19.0에서 worker 시작 timeout으로0 tests였습니다. assertion 실패/제품결함으로 보고하지 않습니다. 기존 bundled Node24.19.0 실행파일로 실행해 검색2개 및 전체224개 통과를 확보했습니다. 기존설치 사용, 새설치/테스트 생략/전역설정 수정은 없으며 실패로그는 outputs에 보존했습니다. 환경 원인 자체를 확정하지 않았습니다.

## 공개 배포와 기록필터 추가 회귀

- **B39 공개 통과(482d302):** Actions36608519492 성공후 공개 단원 직접URL과 reload에서 index-V5tCOMeA.js/BAib381D.css 확인. 빈 서문을 펼침→오늘/Back/reload에서 open유지→원래 접힘 복원, 검색무결과 안내, 실제 오늘메뉴 초점, 보관본 직접경로/reload 확인. 공개 원문을 입력하거나 공부 사건을 생성하지 않았습니다. 시험 검색어는 실제 Meta+A/Backspace로 지우고 reload 뒤 빈query를 확인했습니다. Browser fill('') 호출만으로 비우기가 적용됐다고 간주하지 않았습니다.
- **B40 수정 후 통과(d2e3164):** localhost의 기록 화면 ‘함수’ 검색→함수주제 체크→앞공백/두줄/끝개행 메모→오늘/Back/reload 후 검색어·체크·원문 모두 유지. 실제 키 입력으로 검색어를 지운 뒤 오늘/Back에서 빈값과 메모 유지. 함수 명시대상에서 검색어를 설정한 뒤 그래프 명시대상의 기록 화면을 열면 검색어는 빈값, 그래프만 기본선택이며 본문빈값. 저장을 누르지 않았으므로 새 공부 사건을 만들지 않았습니다. 보기hint는 기존 form키별 sessionStorage이며 본문/선택초안/사건ID는 그대로입니다.

B40의 신규3검사는 수정전2fail/1pass에서 수정후 관련45pass이며, 마지막 전체 suite는 **227pass/선택성능1skip·21파일pass/1skip**, TypeScript 및 Pages base Vite build 통과입니다. 이전224개와 구별하며 마지막 로그는 `continuation-final-227-tests-20260930.txt`/`continuation-final-227-build-20260930.txt`입니다. 성능 측정과 물리IME/OS종료는 미검증입니다.
