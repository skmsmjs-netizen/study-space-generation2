# 원격 웹앱의 ChatGPT 요금제 사용 신청 준비

2026-10-01 최신 결정: 사용자가 원격 구독 연결 방식을 중단했습니다. 이 문서는 준비 이력으로 보존하며 신청 전송·연락처 수집·승인 대기를 진행하지 않습니다. API 비용 문의는 결제·유료 호출 승인과 구별합니다.

## 최신 신청 설명: 기존 Supabase에서 실행

2026-10-01 사용자 ‘개인 서버는 supabase잖아’ 및 ‘해봐’를 반영한다. 대상은 새 VM이 아니라 기존 Supabase 프로젝트의 `study-ai` Edge Function이다. 서버 요청 라우터는 적용했지만 공식 원격 접근 자격·OAuth 등록·서버 자격증명 보관/갱신은 아직 확보되지 않았다. 아래 설명으로 기존 초안을 갱신하며 연락 이메일·영문 이름·실제 회사 유무는 사용자 입력을 기다린다. 브랜드명은 회사 법인 등록의 증거로 사용하지 않는다.

> manseeksong os (previously Study Space) is a personal, noncommercial study web app. Its React frontend is hosted on GitHub Pages; Supabase Auth, Postgres, and managed Deno Edge Functions provide the existing backend. Only the verified application owner may use AI. We want the owner's ChatGPT subscription to generate editable retrieval questions and answers from selected course outlines, topics, and notes. Original material and generated answers remain separate. We require included subscription usage, with no paid API fallback, automatic retries, credit purchases, or quota resets. The topic-generation flow has a ten-second deadline. Please confirm whether this personal application is eligible for ChatGPT plan usage on managed Supabase Edge Functions, whether open-source registration can apply to this hosting model or a partner client ID is required, and the supported OAuth, credential storage/refresh, and included-usage-only requirements. We do not claim eligibility or production AI access. We have prepared the server request/response flow; remote authorization remains outstanding.

[공식 신청 안내](https://developers.openai.com/siwc/request-client-id)·[실제 신청 양식](https://openai.com/form/sign-in-with-chatgpt-interest/)을 이용한다. 공식 self-hosted VM 예제를 관리형 Supabase의 자동 승인 근거로 읽지 않는다. 신청 준비·제출·접수·승인·실제 생성은 각각 구별한다.

2026-10-01 사용자 “전부 다해”에 따라 신청 내용을 준비했다. 신청 전송·승인·공개 배포는 수행하지 않았다. 현재 계정은 Pro이며 제품의 장기 기준은 Plus 포함 사용량과 추가 AI 과금 없음이다. 무료 사용량 초기화도 사용하지 않는다는 사용자 결정을 유지한다.

## 확인한 공식 경로와 적용 범위

[공식 접근 신청 안내](https://developers.openai.com/siwc/request-client-id)와 [실제 신청 양식](https://openai.com/form/sign-in-with-chatgpt-interest/)을 확인했다. 양식은 상업 파트너 대상으로 설명하고 있으므로 비상업 개인 웹앱의 신청 자격·승인 여부는 미확인이다. [공식 Cookbook](https://developers.openai.com/cookbook/articles/sign-in-with-chatgpt)의 원격 호스팅 접근 신청 조건을 로컬 개인 프로젝트의 등록 절차와 구별한다. 회사가 있다는 전제로 작성하거나 공개 저장소에 라이선스를 임의로 추가하지 않는다.

## 실제 양식에 넣을 내용

| 항목 | 준비한 값 또는 남은 조건 |
| --- | --- |
| Work email | 민석이 지정할 연락처가 필요하다. 로그인용 Apple relay 이메일을 임의로 전용하지 않는다. |
| First name / Last name | 민석이 지정한 표기를 사용한다. |
| Company name | 실제 소속·회사 유무를 민석에게 확인한다. 없으면 이를 사실대로 밝히고 개인 신청 가능 여부를 확인한다. |
| Website URL | `https://skmsmjs-netizen.github.io/study-space-generation2/` |
| Job title | 선택 항목. 실제 역할만 기재한다. |
| What capabilities… | `Sign in and ChatGPT plan use for AI requests` |
| Which of your products… | 아래 제품 설명 초안 |

> Study Space is a personal, noncommercial study-record web application with a React frontend hosted on GitHub Pages. The application owner uses a Mac and wants to access the same study workspace from an iPad. Only the verified application owner may connect a ChatGPT account or make AI requests; other approved accounts retain manual study-record features without AI access. Selected source notes and explicitly supplied problem/answer context may be used for summaries, editable LaTeX formula suggestions, retrieval questions, hints and answer feedback. Originals and generated results are stored separately; outputs do not establish mastery or independent performance. The minimum long-term plan is ChatGPT Plus. We require included plan usage only, with no paid API fallback, automatic retry, additional credit spending or credit purchases. The application does not request ChatGPT conversation or memory access. Please confirm whether a noncommercial remotely hosted personal application is eligible, the registration and deployment requirements, supported Mac/iPad use, and the supported mechanism to restrict requests to included plan usage when the quota is exhausted. We currently have a local implementation; remote hosting approval and production AI use have not been completed.

## 다음 단계의 직접 조건

제품 설명을 검토한 뒤 실제 연락처·이름 표기·회사 유무와 신청 전송 지시가 필요하다. 제출 뒤에도 접수와 승인을 구분한다. 승인 조건·보호된 실행 환경·토큰 보관과 갱신·소유자 및 최신 승인 확인·현재 모델 지원 범위·한도 오류에서 유료 전환 없는 종료를 확인해야 원격 AI를 제공할 수 있다. 신청 준비만으로 iPad의 실제 생성이나 무료 서버 운영이 보장되지 않는다.
