# 기존 Supabase의 GPT 요청·응답 연결

## 최신 실사용 채택 판단

2026-10-01 사용자 ‘그거 판단해봐’에 따라 기존 동적 개인 등록의 관리형 Supabase 이전을 조사했다. 현재 구조에 바로 이전하는 경로는 실사용 대상으로 채택하지 않는다. 이는 OpenAI가 실제 해당 토큰을 거부했다는 판정이 아니다. 실제 자격증명 이전·서버 모델 조회·추론은 실행하지 않았다.

근거는 공식 Cookbook의 Usage policy and terms가 일반 로컬 개인 프로젝트와 원격 호스팅 앱을 구별하고 원격 제공에 접근 요청을 안내한다는 점이다. 기존 client_id의 다중 host 재사용이 가능한 것과 모든 호스팅 배포의 자격은 별개다. 자체 호스팅 VM 안내는 오픈소스 앱을 대상으로 한다. 현재 GitHub 저장소는 공개지만 API의 license 필드는 null이고 루트 LICENSE/COPYING도 없으므로, 이 사실만으로 오픈소스 경로의 자격을 확보했다고 판단하지 않는다. 임의 라이선스 부여·공개 범위 변경·접근 신청은 실행하지 않는다.

기술적으로 Supabase의 Deno/HTTP·영구 저장으로 원격 credential manager를 설계할 수 있다. 다만 기존 Mac 암호화 어댑터는 darwin 키체인에 의존하고 SDK 저장은 로컬 파일/rename/proper-lockfile을 사용한다. Supabase 임시 파일은 요청 사이 영구 보관 수단이 아니며 S3 기반 영구 저장은 존재한다. 보호된 영구 토큰 저장·서버 고유 host ID·토큰 갱신의 직렬화·연결 해제를 실제로 구현해야 한다. 이는 조정 가능한 기술 과제이고 Supabase의 절대적 기술 불가능을 뜻하지 않는다.

현재 확실한 선택은 개인 로컬 GPT 실행을 유지하거나, 별도 API 키/과금으로 기존 Supabase에서 GPT를 실행하는 것이다. Mac 없이 기존 관리형 서버에서 실행하는 목적에는 일반 API 경로를 권장한다. 비용 확인과 추천은 API 키 등록·구매·유료 호출 권한을 추가하지 않는다. 기존 크레딧을 반드시 쓰며 Mac 없이 운영하려면 해당 원격 등록 자격을 확인하거나 공식 VM 조건을 충족하는 별도 환경이 필요하고, 현재 어느 조건도 충족했다고 확인하지 않았다.

조사: [공식 Cookbook 및 사용 범위](https://developers.openai.com/cookbook/articles/sign-in-with-chatgpt#usage-policy-and-terms), [client와 host 재사용](https://developers.openai.com/siwc/token-sharing-open-source), [self-hosted VM](https://developers.openai.com/siwc/token-sharing-open-source/self-hosted-vms), [토큰 보관과 갱신](https://developers.openai.com/siwc/token-sharing-open-source/profiles-and-sessions), [Supabase 임시·영구 파일 저장](https://supabase.com/docs/guides/functions/ephemeral-storage). 앱 설정의 Study Space 목록은 등록/허용의 근거이며 관리형 원격 배포 승인·실제 추론 성공의 근거가 아니다.

사용자 ‘해봐’에 따라 기존 `lbuiwotjisbzgflixjvg`의 `study-ai`를 사용한다. 새 서버/유료 API/크레딧/할당량 재설정은 사용하지 않는다.

기준은 Supabase의 인증된 Edge Function·외부 API 처리, OpenAI의 SIWC 원격 접근 신청 및 기존 GPT 원문/출제 계약이다. 최신 Supabase changelog의 미들웨어 추가는 기존 인증 교체의 필요성을 만들지 않으며, PostgreSQL 확장 breaking change는 이번 스키마 변경 없는 작업에 해당하지 않는다. [Supabase Functions](https://supabase.com/docs/guides/functions), [OpenAI 신청 안내](https://developers.openai.com/siwc/request-client-id), [오픈소스 연결 범위](https://developers.openai.com/siwc/token-sharing-open-source)를 확인했다.

`src/server/remote-study-ai.ts`에서 status·topic-memory·자료 분석을 라우팅하고 기존 생성기/품질 프롬프트/응답 검증을 재사용한다. JWT 인증·현재 앱 승인·본인 권한을 원문 읽기 전에 확인한다. 승인된 서버 연결이 없으면 원문·크레딧·모델 호출에 접근하지 않는다. 연결이 있는 격리 시험에서는 해당 모델·크레딧 확인·추론 직전 권한 검사·취소·완료 응답 검증을 통과해야 결과를 반환한다. 추가 과금으로 전환하거나 자동 재생성하지 않는다. 원격 녹음은 받지 않고 확인한 전사문을 텍스트로 처리한다.

`src/data/study-ai.ts`는 연결된 원격 status를 엄격하게 확인하고 Supabase의 인증된 topic-memory/자료 경로로 요청한다. 상태 조회를 포함한 암기항목의 기존10초 제한을 유지한다. 연결 실패·잘못된 범위·응답 오류에서 기존 초안/선택/원문은 변경하지 않는다. 이 수신 코드 변경은 현재 소스에 있으며 이번에는 공개 프런트엔드를 추가 배포하지 않았다.

실제 `study-ai` v2를 읽어 기존 인증과 병행 변경을 확인한 후 이번 함수만 v3로 적용했다. 재다운로드한 배포 코드와 제출 번들의 내용 일치를 확인했다. 실제 HTTP status/topic-memory의 무인증 거부와 OPTIONS를 확인하며 실제 본인 계정 생성 성공으로 보고하지 않는다. 소유자·승인·구독이 있는 테스트는 합성 연결이다.

관련5파일16개 자동검사, 전체 `npm run typecheck`, `npm run build` 통과. 증거는 `work/supabase-gpt-20261001/`의 빌드 로그·배포 번들·실제 HTTP 응답이다. 운영 사용자 데이터·토큰·설정·DB 스키마는 변경하지 않았다.

현재 실제 연결 공급자는 `null`이다. 관리형 Supabase의 공식 원격 사용 자격과 등록 방식, 승인된 OAuth 연결, 암호화한 서버 자격증명의 영구 보관·갱신/회전·동시 요청 보호·연결 해제는 미구현이다. Mac 자격증명을 복제하지 않았다. 이를 갖춘 서버 credential manager를 연결하고 공개 수신 코드를 반영해야 실제 원격 생성이 된다. 실제 GPT 응답 품질/속도와 물리 기기·장기 사용은 미검증이다. 신청서의 필수 연락처/영문 이름/실제 소속을 받으면 해당 사실로 신청을 진행할 수 있다.
