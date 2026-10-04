# Codex 지침 구조

2026-09-30. 첨부 `사진 1.jpg`의 Claude Code 폴더 구조를 현재 프로젝트의 Codex 형식으로 적용했습니다. 목적은 공통 약속을 유지하면서 필요한 경로·작업의 지침만 읽는 것입니다. 제품 구현·배포·DB 상태를 바꾸는 작업은 아닙니다.

## 구조와 담당

```text
학습 시스템 설계 프로젝트/
├── AGENTS.md                         공통 약속·보존 계약·읽기 경로
├── .agents/skills/<스킬>/             웹앱의 스킬 원본을 가리키는 심볼릭 링크
├── .codex/
│   ├── config.toml                   공통 프로젝트에서 시작하는 훅 설정
│   └── agents/<역할>.toml            웹앱의 역할 원본을 가리키는 심볼릭 링크
├── docs/                             이미 담당을 나눈 상세 지침
└── generation2/                      별도 Git 저장소
    ├── AGENTS.md                     웹앱 차이·상위 공통 지침 연결
    ├── .agents/skills/
    │   ├── study-review/SKILL.md      변경 리뷰
    │   ├── study-fix-issue/SKILL.md   구체적인 오류 수정
    │   └── study-deploy/SKILL.md      요청받은 배포
    ├── .codex/
    │   ├── config.toml               웹앱에서 시작하는 훅 설정
    │   ├── agents/
    │   │   ├── study-code-reviewer.toml
    │   │   └── study-data-auditor.toml
    │   └── hooks/session-start.py    지침 연결 검사·짧은 위치 안내
    ├── src/
    │   ├── AGENTS.md                 코드 관례·검사 선택
    │   ├── ui/AGENTS.md              화면·입력·펜 표시 피드백
    │   ├── domain/AGENTS.md          학습 규칙·상태 의미
    │   ├── data/AGENTS.md            저장·복구·어댑터
    │   └── server/AGENTS.md          API·인증·서버 책임
    └── supabase/AGENTS.md            DB·RLS·마이그레이션
```

`generation2`는 별도 Git 루트이므로 그 안에 스킬·설정·역할 원본을 둡니다. 공통 프로젝트의 스킬과 역할은 링크로 같은 원본을 사용합니다. 루트에서 시작한 세션은 웹앱 지침으로 이동하고, 웹앱에서 시작한 세션은 상위 공통 지침 링크를 직접 읽습니다. 둘 중 어느 Git 루트에서 시작하든 발견 가능한 구조를 유지하며, 링크 파일을 복사하여 두 원본으로 운영하지 않습니다.

## 제품 품질 지침의 상속

2026-10-01 채택한 [웹앱 제품 품질 기준](웹앱%20제품%20품질%20기준.md) Q01–Q15는 공통 AGENTS.md → 웹앱 AGENTS.md → 관련 하위 경로의 상속을 통해 지난 작업·현재 작업·앞으로의 모든 작업에 적용합니다. 상세 기준의 원본은 담당 문서 한 곳에 두며 공통 정책·화면 기준·디자인 시스템에서 연결합니다. 기존 기능의 완료/배포 기록도 적용 면제 사유가 아닙니다. 스킬·역할별 작업에서도 해당 영역을 적용하되 기존 발동 조건과 현재 위임 허용을 유지합니다. 훅은 연결 존재만 확인하며 제품 준수나 과거 기능의 재검증을 수행하지 않습니다.

## 사진 속 항목의 Codex 대응

| 사진의 Claude Code 항목 | 이 프로젝트의 Codex 대응 | 적용 방식 |
| --- | --- | --- |
| `CLAUDE.md` | `AGENTS.md` | 세션 시작 지침. 사용자 전역 Kernel은 기존 `~/.codex/AGENTS.md`를 유지합니다. |
| `CLAUDE.local.md` | 필요할 때의 `AGENTS.override.md` | 같은 폴더에서 AGENTS.md보다 먼저 선택됩니다. 함께 덧붙는 파일이 아니므로 이번에는 만들지 않습니다. |
| `.mcp.json` | 기존 플러그인/커넥터 또는 `config.toml`의 `[mcp_servers]` | 이번 작업에 새 외부 서비스가 없으므로 기존 연결을 상속합니다. 임의 서버·비밀값을 추가하지 않습니다. |
| `.claude/settings*.json` | `.codex/config.toml`과 기존 사용자 설정 | 프로젝트 훅만 설정하고 모델·권한·MCP·사용자 전역 설정은 유지합니다. |
| `.claude/rules/*.md` | 경로별 `AGENTS.md`와 기존 담당 문서 | 변경 경로의 규칙을 선택 적용합니다. Codex의 실행 명령용 `.rules`는 별개의 권한 규칙이므로 일반 Markdown 지침과 혼합하지 않습니다. |
| `.claude/commands/*.md` | `.agents/skills/*/SKILL.md` | 반복 작업은 `$study-review`, `$study-fix-issue`, `$study-deploy`로 호출할 수 있습니다. |
| `.claude/skills/` | `.agents/skills/` | 이름·설명으로 발견하고 해당 작업에서 본문을 읽습니다. 기존 담당 문서를 복제하지 않습니다. |
| `.claude/agents/*.md` | `.codex/agents/*.toml` | `study_code_reviewer`, `study_data_auditor`를 읽기 전용 역할로 정의했습니다. 모델은 부모 설정을 상속하며 실행·위임 권한은 현재 세션을 따릅니다. 정의만으로 자동 위임하지 않습니다. |
| `.claude/hooks/` | `.codex/config.toml`의 SessionStart와 Python 훅 | 시작·재개·압축 후 지침 연결만 확인하고 짧은 위치 안내를 제공합니다. 전체 QA·Bash 차단·앱 검사는 수행하지 않습니다. |

경로별 AGENTS.md는 Codex의 시작 디렉터리까지 자동 수집됩니다. 루트에서 시작한 뒤 더 깊은 파일을 수정할 때는 해당 경로의 지침을 직접 확인합니다. `AGENTS.override.md`는 일시적인 대체가 꼭 필요할 때만 사용하며 공통 보존 계약을 임의 폐기하는 용도가 아닙니다.

## 훅과 확인 범위

훅은 프로젝트 설정과 **정확한 훅 정의를 신뢰한 실행**에서만 자동 작동합니다. Codex CLI의 `/hooks`에서 정의를 검토하고 신뢰할 수 있습니다. 파일 작성·수동 실행·형식 확인은 현재 세션의 자동 호출 또는 영구 신뢰를 증명하지 않습니다. 이번 구현에서 신뢰 우회 옵션이나 사용자 전역 신뢰 설정을 바꾸지 않습니다. 자동 훅이 아직 실행되지 않아도 AGENTS.md와 스킬의 읽기 경로는 사용 가능합니다.

2026-09-30 확인에서는 공통 프로젝트 훅이 `hooks/list`에 `trusted`·`enabled=true`로 등록되어 있었고, `generation2` 직접 시작은 프로젝트 설정 레이어 미신뢰로 자동 훅이 제외됐습니다. 당시 자동 SessionStart 호출이나 검토 에이전트 실행은 확인하지 않았습니다. 아래 2026-10-01 적용 확인이 현재 상태입니다.

## 2026-10-01 적용 확인

사용자가 남은 확인의 실행을 요청했습니다. 기존 Codex 설정 API로 `generation2`의 프로젝트 신뢰 항목과 검토한 훅 정의의 정확한 해시만 등록했습니다. 신뢰 우회 옵션을 사용하지 않았으며 나머지 실행 설정은 유지했습니다. 양쪽 시작 위치의 훅이 `trusted`·`enabled=true`로 확인됐고, 현재 공통 프로젝트 대화와 `generation2`의 실제 CLI 시작에서 자동 안내 수신을 확인했습니다. `debug prompt-input`은 자동 훅 수신의 증거로 사용하지 않습니다.

읽기 전용 합성 자료로 문구 수정·초안 저장 오류·서버 소유권 리뷰·이미 허용된 배포의 작업 선택을 평가했습니다. 실제 앱·개인 기록·DB·공개 배포에는 적용하지 않았습니다. 검토 역할을 호출한 처음의 `--ephemeral` 실행은 부모 대화 기록 부재로 실패했고, 기록을 사용할 수 있는 검증용 CLI 실행에서는 두 사용자 정의 역할이 로드되어 호출됐습니다. 결과는 프로젝트 `outputs/20261001-codex-instructions-runtime/`에 보존합니다.

평가에서 인계 읽기 범위가 지정 자료보다 넓어진 편차를 확인하여, 공통 지침과 검토 역할에 격리 평가의 읽기 범위를 명시했습니다. 역할 정의 보완 후 연결·TOML을 확인하며 같은 전체 역할 시험을 반복하지 않습니다. 이 범위 보완의 실제 준수는 이후 사용에서 판단합니다. 설정 상태는 바뀔 수 있으므로 재개 시 필요한 대상만 다시 확인합니다.

연결 검사 명령은 공통 프로젝트에서 다음과 같습니다.

```bash
python3 generation2/.codex/hooks/session-start.py --check
```

이 검사는 명시된 활성 지침·링크·스킬 이름·공통 프로젝트 별칭만 확인합니다. 제품·원장·비밀값·과거 보관본을 읽지 않습니다. 코드 변경이면 src/AGENTS.md의 관련 검사, 배포면 기존 배포 기준을 별도로 적용합니다.

공식 기준: [AGENTS.md 탐색](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [스킬 위치와 호출](https://learn.chatgpt.com/docs/build-skills), [설정 키](https://learn.chatgpt.com/docs/config-file/config-reference), [하위 에이전트](https://learn.chatgpt.com/docs/agent-configuration/subagents), [훅과 신뢰](https://learn.chatgpt.com/docs/hooks), [Claude 항목의 이식](https://developers.openai.com/plugins/guides/submit-claude-plugin).
