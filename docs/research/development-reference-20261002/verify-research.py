"""연구 문서의 범위/ID/로컬 링크/지문 확인. 제품 또는 외부 출처 진실성 검사가 아님."""
from pathlib import Path
from collections import Counter
from urllib.parse import unquote, urlparse
import hashlib
import json
import re

base = Path(__file__).resolve().parent
expected = {'design-ux': 28, 'frontend-graphics': 31, 'quality-storage': 28, 'specialized': 34}
required = {'id', 'name', 'category', 'status', 'url', 'checked', 'evidence', 'limits'}
statuses = {'기본 권고', '기존 유지', '조건부', '참고'}
errors = []
entries = []
groups = {}
for stem, count in expected.items():
    data = json.loads((base / (stem + '-sources.json')).read_text())
    body = (base / (stem + '.md')).read_text()
    groups[stem] = len(data)
    if len(data) != count:
        errors.append(f'{stem}: expected {count}, got {len(data)}')
    for row in data:
        if not required.issubset(row) or any(not row.get(k) for k in required):
            errors.append(f'{stem}: missing/empty field')
            continue
        if row['status'] not in statuses or row['checked'] != '2026-10-02':
            errors.append(f"{row['id']}: invalid status/date")
        if row['id'] not in body or row['url'] not in body:
            errors.append(f"{row['id']}: missing body correspondence")
        if urlparse(row['url']).scheme != 'https':
            errors.append(f"{row['id']}: unexpected source scheme")
    entries.extend(data)

ids = [r['id'] for r in entries]
if len(ids) != len(set(ids)):
    errors.append('duplicate source ID')
coverage = json.loads((base / 'coverage.json').read_text())
domain_ids = [d['id'] for d in coverage['domains']]
if domain_ids != [f'C{i:02}' for i in range(1, 21)]:
    errors.append('coverage domains do not match C01-C20')
if len(coverage['request_types']) != 6:
    errors.append('request type coverage is incomplete')
covered = set()
for d in coverage['domains']:
    if not d['source_ids'] or not d['reports']:
        errors.append(d['id'] + ': empty domain')
    covered.update(d['source_ids'])
    for source_id in d['source_ids']:
        if source_id not in ids:
            errors.append(d['id'] + ': unknown source ' + source_id)
    for report in d['reports']:
        if not (base / report).exists():
            errors.append(d['id'] + ': missing report ' + report)
if covered != set(ids):
    errors.append('coverage source mismatch: ' + repr(set(ids) - covered))

local_link_count = 0
skill_paths = set()
for p in base.glob('*.md'):
    for target in re.findall(r'\]\(([^)]+)\)', p.read_text()):
        path_text = target.split('#')[0].strip('<>')
        if not path_text or '://' in path_text or path_text.startswith('mailto:'):
            continue
        path_text = re.sub(r':\d+$', '', unquote(path_text))
        q = Path(path_text) if path_text.startswith('/') else p.parent / path_text
        local_link_count += 1
        if not q.exists():
            errors.append(p.name + ': missing local link ' + target)
        if q.name == 'SKILL.md':
            skill_paths.add(str(q.resolve()))

urls = Counter(r['url'] for r in entries)
files = sorted(p for p in base.iterdir() if p.is_file() and p.name != 'verification.json')
hashes = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
manifest_bytes = ''.join(name + '\t' + value + '\n' for name, value in sorted(hashes.items())).encode()
result = {
    'date': '2026-10-02',
    'passed': not errors,
    'source_entries': len(entries),
    'unique_source_ids': len(set(ids)),
    'unique_primary_urls': len(urls),
    'repeated_primary_urls': {url: n for url, n in urls.items() if n > 1},
    'source_groups': groups,
    'statuses': dict(Counter(r['status'] for r in entries)),
    'covered_domains': len(domain_ids),
    'covered_request_types': len(coverage['request_types']),
    'all_source_ids_covered': covered == set(ids),
    'local_links_checked': local_link_count,
    'linked_local_skills': len(skill_paths),
    'errors': errors,
    'file_sha256': hashes,
    'manifest_sha256': hashlib.sha256(manifest_bytes).hexdigest(),
    'hash_scope': '현재 폴더 파일 중 verification.json 자체를 제외한 파일. 정렬한 파일명 TAB SHA256 LF의 UTF-8 지문.',
    'limits': ['문서 연결과 완전성 검사이며 제품 검사/준수 인증이 아님', '외부 자료 확인 범위와 접근 제한은 각 출처 evidence/limits 및 본문에 기록', '공유 저장소의 다른 작업 파일은 검사/변경 범위에 포함하지 않음']
}
(base / 'verification.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: v for k, v in result.items() if k not in {'file_sha256', 'limits'}}, ensure_ascii=False, indent=2))
raise SystemExit(1 if errors else 0)
