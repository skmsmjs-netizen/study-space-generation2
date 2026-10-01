# ManSeekSong OS 워드마크 원본

`manseeksong-os.svg`는 글자별 경로를 유지한 SVG 원본입니다. Illustrator에서 열고 그룹/개별 경로를 선택해 형태와 색을 수정할 수 있습니다. `wordmark-design.json`에는 굵기·광학 크기·가로 비율·자간·글자쌍 간격·OS 크기와 간격을 유지합니다.

재생성: FontTools4.60.2가 있는 Python으로 `python scripts/build-brand-wordmark.py`를 프로젝트 루트에서 실행합니다. 이번 작업 환경은 `/tmp/manseek-wordmark-tools/bin/python`입니다. 이후 환경에서는 `python -m pip install fonttools==4.60.2`로 준비합니다. SVG와 `src/ui/brand-wordmark.tsx`를 함께 생성합니다. SVG만 직접 편집한 경우 앱에도 같은 경로를 반영해야 합니다. 실행 중 브라우저 글꼴 다운로드는 없습니다.

기반 Inter 원본과 SIL Open Font License는 `InterVariable.ttf`와 `OFL.txt`, 출처와 해시는 `source.json`에 있습니다. 본문 서체나 사용자 설정을 이 워드마크에 맞춰 변경하지 않습니다. 앱의 SVG 색은 currentColor이며 밝고 어두운 테마의 기존 글자색을 따릅니다.
