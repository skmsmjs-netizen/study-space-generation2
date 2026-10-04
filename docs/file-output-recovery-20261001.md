# 출력 경로 실수 정리 · 2026-10-01

사용자 “실수 해결해”에 잘못된 출력 파일을 식별·보관·정리하고 같은 유형의 실수를 막는 실행 방식을 실제 확인했습니다. 웹앱의 운영 코드·배포·개인 저장소를 변경하지 않았습니다.

`/Users/manseeksong/Documents/ChatGPT/학습`은 기존 공부 문서가 아니라, 2026-10-01 16:06:57 KST의 검증 명령에서 따옴표 없는 출력 경로가 공백에서 잘리면서 처음 생긴 임시 시험 로그였습니다. 해당 셸 명령은 `./node_modules/.bin/vitest run --config motion.vitest.config.ts > /Users/manseeksong/Documents/ChatGPT/학습 시스템 설계 프로젝트/generation2/work/motion-20261001/isolated-tests.log 2>&1`이며, 셸 인자 분석의 실제 출력 대상과 파일의 생성 시각이 일치합니다. 생성 명령은 exit1이었고, 뒤에 담당 로그를 읽으려던 명령은 해당 파일이 없다고 보고했습니다. 정확한 근거는 work/file-recovery-20261001/creation-evidence.json에 보관했습니다.

앞선 이번 대화의 명령이 이 임시 파일을 성능 JSON으로 덮어쓴 잘못은 그대로 기록합니다. 현재 1,036바이트를 담당 폴더 overwritten-file.json으로 정확히 복사하고 SHA256이 일치하는 것을 확인한 뒤, 내용이나 파일 종류가 바뀌지 않았을 때만 잘못된 부모 경로의 파일을 제거했습니다. 현재 복사본 SHA256은 66c5e125a011b36afce8cbcd5a023cc292cf48d85ec8b42dab5941741172c959입니다.

이전 임시 로그의 정확한 바이트는 복원하지 못했습니다. Time Machine 대상과 데이터 볼륨 스냅샷, 해당 파일에 맞는 편집기 이력과 Git 기록이 없었습니다. 그 내용을 새로 만들어 원본이라고 하지 않았습니다. 해당 motion 작업의 별도 정상 결과 work/motion-20261001/tests-verified.json에는 76개 통과/0실패가 남아 있습니다. 이번 정리를 원래 오류 로그의 바이트 복구로 표현하지 않습니다.

재발 방지는 Python 표준 subprocess의 인자 배열과 shell=False, tempfile의 새 결과 폴더를 사용했습니다. 새 run-benchmark.py는 기존 결과 폴더와 심볼릭 링크를 거부하며, 보고서 경로를 하나의 인자로 전달합니다. 공백·한국어·명령 치환/백틱 모양이 든 경로에서 지정 결과만 생성/인접 파일 보존, 기존 결과에 대한 실행·덮어쓰기 거부, 심볼릭 링크 출력 거부의 3검사가 통과했습니다. 같은 실행기를 실제 기존 성능 검사에 연결해 exit0/1개 통과와 정확한 새 경로의 JSON을 확인했습니다.

현재 재실행 명령은 `python3 generation2/work/file-recovery-20261001/run-benchmark.py`이며 프로젝트 루트에서 실행합니다. `--self-test`로 출력 안전성만 검사할 수 있습니다. 이번 보완은 이 작업의 성능 결과 저장 경로에 적용되며 모든 셸 명령을 자동으로 보호한다고 주장하지 않습니다.

담당 근거: work/file-recovery-20261001/{initial-evidence.json,creation-evidence.json,overwritten-file.json,run-benchmark.py,verification.json}, work/reel-remaining-verification-20261001/domain-safe-gy_scltb/{command.json,results.json,run.log}. 기존 보고의 당시 미확인 상태는 이 후속 확인으로 갱신하며 병행 작업·기존 인계·원문을 유지합니다.
