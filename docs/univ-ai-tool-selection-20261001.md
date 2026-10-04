# UniV AI 기능과 도구 연결 선택

2026-10-01 사용자 요청: Study Space처럼 GPT 할당량을 쓰는 도구와 기존 전사 도구를 연결해 UniV AI의 여러 기능을 구현하고 싶음. 추가 결제 없음·기존 자료/원문/ID/초안 보존 조건을 유지합니다. 이번 기록은 도구 조사와 GPT 동작을 가정한 시험입니다.

## 확인한 기능과 후보

- [UniV AI 공식 기능](https://univai.co.kr/): PDF/PPT/Word·YouTube·강의 녹음·메모·필기 사진을 입력해 요약/퀴즈/플래시카드/마인드맵/튜터로 연결합니다. 공식 공개 연동 API는 이번 조사에서 확정하지 못했습니다. 제품 기능 안내를 학습 효과 증거로 사용하지 않습니다.
- [GPT 구독 연결의 공식 제한](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations): 앱 측 함수/사용자 정의 도구는 연결할 수 있으나 음성/영상 입력·Files 업로드·전사 API는 지원하지 않습니다. 도구 등록이 외부 서비스의 비용과 사용 권한을 GPT 구독에 포함시키지는 않습니다. 로컬 도구와 hosted MCP/connector도 구별합니다.
- [ChatGPT Record](https://help.openai.com/en/articles/11487532-chatgpt-record): 기존 macOS 앱의 Plus 포함 계정 지원과 출시 기준 추가 비용 없음 안내가 있습니다. 새 [Meetings 플러그인](https://help.openai.com/en/articles/20001546-the-meetings-plugin-in-chatgpt)은 현재 Pro/Business와 Mac 조건입니다. 서로 다른 기능이며, 이 학습 웹앱에서 원음 전사를 자동 요청할 수 있는 공식 호출 인터페이스는 확인하지 못했습니다. 과거 계정 관측을 현재 권한으로 재사용하지 않습니다.
- Plugin Management 카탈로그에서 Otter.ai/Fireflies/Read AI/Fathom/Pocket AI/Plaud/Wispr Flow 등을 실제 검색했습니다. 설치·계정 연결은 수행하지 않았습니다. 전사문 검색/조회와 새 원음의 전사 실행은 별도 capability입니다. [Fireflies 업로드 API](https://docs.fireflies.ai/graphql-api/mutation/upload-audio)는 서비스 인증·음성 파일 다운로드·전사 처리 경로를 제공합니다. [Otter 파일 입력](https://help.otter.ai/hc/en-us/articles/360047733574-Import-an-audio-or-video-file)은 자체 플랜별 사용량/가져오기 제한을 적용합니다. Plus만으로 무제한 사용할 수 있다고 하지 않습니다.
- [whisper.cpp](https://github.com/ggml-org/whisper.cpp)는 기존 Whisper 엔진이며 Apple Silicon/iOS/WebAssembly/HTTP 서버와 파일·스트림 처리를 지원합니다. 현재 앱은 이미 faster-whisper Mac 전사와 병행 작업의 Transformers.js 브라우저 전사 어댑터를 사용합니다. 음성 인식 엔진을 직접 만든 것이 아닙니다. 한국어/긴 강의 품질과 물리 기기 검증은 별도입니다.

## 현재 조건에 맞는 선택

추가 요금 없이 자동 처리하려는 조건에는 기존 무료 전사 도구로 원음→시간 구간·전사문을 만들고, 기존 Study Space 구독 연결로 텍스트의 요약/카드/퀴즈/설명/관계도 작업을 수행하는 구성이 맞습니다. 이미 있는 녹음·강의 음성·자막은 다시 녹음하지 않고 가져옵니다. 새 현장 강의의 오디오는 녹음 등으로 확보해야 하며, 도구를 등록한다고 입력 없는 전사문이 생기지는 않습니다.

자료 입력 도구→원문/시간/출처 보관→구독 GPT 분석→요약/퀴즈/카드/관계도/튜터→수정/저장/재열기를 하나의 제품 흐름으로 묶는 방향입니다. 기능마다 별도 GPT 구독이나 새 provider가 필요한 것은 아닙니다. 중복 엔진·불필요한 계정 설치를 피하며, 큰 파일/여러 자료는 분할·처리 중단/복구·원문 대조·출처 추적을 연결합니다.

현재 녹음 가져오기/기록·전사·요약/카드·설명/힌트에는 구현 경로가 있습니다. PDF/PPT/Word/사진/YouTube 자막의 실제 가져오기, 객관식 퀴즈 운영, 자료 근거 다회차 튜터, 생성 관계도의 실제 지도 연결은 각각 별도 구현/확인이 필요합니다. 작업 선택 메뉴나 Mermaid 코드 출력만으로 UniV의 모든 기능을 구현했다고 하지 않습니다.

## 이번 시험의 경계

work/gpt-assumed-20261001/에서 실제 StudyMaterials·study-ai 클라이언트·HTTP localStudyAIPlugin·입력/근거 검증·Mac 전사·IndexedDB 원음/초안·applyCommand를 사용했습니다. 앱 인증/OAuth와 GPT 응답, 시험용 repository의 서버 acknowledgment는 합성입니다. 개인 인증 토큰·운영 API·추가 비용·계정 연결 없이 진행했습니다. 세부 결과는 같은 폴더의 report.md·verification.json에 남깁니다.

## 2026-10-01 조사 이후 구현 반영

위 후보를 실제로 연결하여 PDF.js/Mammoth/fflate/Tesseract와 YouTube 공개 자막 도구의 비녹음 입력, 근거 퀴즈·다회차 튜터·React Flow 개념도와 Canvas, Supabase 비공개 원본 보관을 구현했습니다. 현재 결과와 당시 미구현은 [이번 구현/검증](univ-materials-20261001.md)에서 구별합니다. 실제 GPT 생성은 사용량 소진으로 수행하지 않았습니다.
