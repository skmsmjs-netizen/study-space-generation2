# 개념 전집 제작과 읽기

2026-10-01 사용자 요청에 따라 현재 앱 `#/concepts`에 제작 흐름을 연결했다. 1,168개의 원문 등록·작업 분할·검토·읽기용 등록이 대상이며, 지식관제탑이나 읽기를 공부 완료로 환산하는 기능은 포함하지 않는다.

원문은 `ConceptCatalog.raw`로 문자열 그대로 보관하며 SHA-256과 파일명으로 구별한다. 원문의 ID/type/annotations/relations/알 수 없는 필드는 바꾸지 않는다. `ConceptEdition`은 원문 ID에 연결된 별도 설명이다. 일곱 화면 유형은 편집 목적의 제안이며 확립된 학습 이론이나 개념의 배타적인 분류가 아니다. 주 유형/보조 유형/미분류/보류를 허용한다.

화면에서는 읽기와 설명 만들기를 나눈다. 정상 읽기에는 설명·선택·단계만 보이고, 원문·근거·이력은 제작 화면에서 펼친다. 단순 설명에 순서를 강제하지 않는다. 각 설명의 모든 상태를 같은 Grid 영역에 배치하여 가장 긴 장면만큼 공간을 확보하고, 한국어 의미 단위 줄바꿈과 좁은 폭 재배치를 유지한다. 전환은 기존180ms 토큰과 OS/사용자 움직임 감소 설정을 따른다.

한 작업 묶음은 최대30개이며 원문 해시·원래 ID·시작 설명 버전·프롬프트 버전을 보관한다. 30은 이번 편집 작업의 단위이며 모델 한도나 학습 효과의 근거가 아니다. 내보내기는 로컬 파일이며 외부 생성 호출·비용·개인 자료 업로드가 아니다. `concept-job-v1`에 원문과 제안을 내보내고 `concept-results-v1`로 검토 전 결과를 받는다. 원문/작업 묶음/시작 버전이 다르면 거부하며 반복 결과는 건너뛰고 이후의 편집을 보호한다. 열린 묶음은 재접속 후 내보내거나 중단/재개/닫을 수 있다. 묶음을 닫아도 결과와 이력을 유지한다.

설명은 먼저 draft로 저장한다. 유형·의미·조건·예시·문장·실제 화면의 여섯 검토를 마친 뒤만 published로 등록한다. 설명/유형/근거가 바뀌면 기존 체크를 승계할 수 없고 다시 저장한 뒤 검토해야 한다. 체크는 편집 검토이며 사용자의 이해/정답/숙달 기록이 아니다. 근거 URL의 checked는 작성자의 확인 기록이며 링크 존재나 형식 통과만으로 사실 확인을 주장하지 않는다.

저장은 기존 StudyRepository/개인 명령 큐/서버 버전 검사/operation 중복 방지/압축 원문 보관을 재사용한다. 새 컬렉션3개와 명령3개는 소스에 연결했다. 개인 화면은 서버의 supportedCommands를 확인하며 미지원 서버에 쓰기 요청을 강행하지 않는다. 서버는 현재 인증/승인/소유자를 확인하고 원문 해시를 직접 재계산한다. 운영 함수 갱신·실계정 저장·물리 기기 수신은 이번 로컬 구현의 완료로 보고하지 않는다.

제작 입력은 기존 draft-safety로 보관하고 수정 버전이 다르면 덮어쓰지 않는다. 저장 실패에서도 현재 입력을 파일로 내보낼 수 있다. 마지막 변경은 기존 revision 명령으로 되돌릴 수 있다. 전체 서버 백업/복원은 기존 `#/backup`을 사용한다. 제작 파일 `concept-work-v1`은 원문/묶음/검토 전 설명을 현재 계정의 명령으로 가져오며 인증 정보나 다른 계정의 소유권·등록 상태를 승계하지 않는다.

로컬 제작 도구:

```sh
node scripts/concept-production.mjs init --workspace ../outputs/20261001-concept-production --source '/원문/개념 전집.json'
node scripts/concept-production.mjs plan --workspace ../outputs/20261001-concept-production
node scripts/concept-production.mjs import --workspace ../outputs/20261001-concept-production --file '/작성한/결과.json'
node scripts/concept-production.mjs batch --workspace ../outputs/20261001-concept-production --batch 작업ID --status closed
node scripts/concept-production.mjs status --workspace ../outputs/20261001-concept-production
```

파일 도구는 상태를 pending 파일에 쓰고 fsync/rename으로 교체한다. 저장된 시작 버전과 작업 ID로 재개하고 잠금 중에는 다른 쓰기를 막는다. 종료된 프로세스의 `.production.lock`은 프로세스 종료를 확인한 뒤 제거한다. 런타임은 기존 esbuild로 현재 소스를 묶는다. `--runtime`은 명시적으로 지정한 기존 빌드의 재사용이며 현재 소스의 자동 재빌드가 아니다. outputs의 .production-runtime.mjs는 마지막 정상 실행의 소스 빌드이며 후속 정상 실행 때 갱신된다. 첫 분할/가져오기 당시 런타임을 불변 보존했다고 주장하지 않는다. 최종 검증 빌드와 소스 해시를 별도 증거로 남긴다.

이번 제작 자료는 공개 번들에 포함하지 않는다. 실제1168개 전수 원문 검토/분류/재작성의 완료와 제작 시스템 구현을 구별한다. 전체 작업 상태와 지침 대조는 `../outputs/20261001-concept-production/`의 보고를 따른다.

2026-10-01 첫 실행: 원문1168개/초기39묶음, 본문 유형 분류30개, 설명12초안(기존7+신규5), 검토 완료/읽기용 등록0개. 첫30개 분류 작업을 닫고 화면 미작성24개를 버전1의 다음 작업으로 열어 현재40묶음이다. 유형·의미 검토와 화면 작성은 단계가 다르다. 원문은 로컬 파일이고 이번 제작은 준이 로컬 자료를 읽고 작성한다. 별도 생성 API·키·비용·업로드를 요구하지 않는다.


2026-10-01 전체 작업 순서 정정: 개별 대량 작성 전에 [기존 기준을 적용한 유형별 구성 틀](concept-interaction-design.md)과 [틀 데이터](concept-interaction-templates.json)를 사용한다. 유형과 조작을 별도 선택하고 한 화면에서 끝나는 단순형을 허용한다. `node scripts/concept-design.mjs --workspace ../outputs/20261001-concept-all --out ../outputs/20261001-concept-all/design-plans.json`으로 원문 ID·해시·설명 버전에 연결한 전수 설계 목록을 만들고 재개한다. 이 목록의 형식 검사는 의미·화면 검토나 기존 여섯 체크·읽기용 등록을 대신하지 않는다. 실제 가져오기/저장은 기존 버전·소유권 계약을 유지한다.
