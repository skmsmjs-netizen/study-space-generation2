"""Build the local review catalog; never changes OS tokens or app/Figma sources."""
from collections import Counter
from hashlib import sha256
from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT.parent
SOURCE = ROOT / 'source/uiux_layout_figma_guide.original.txt'

if len(sys.argv) == 2:
    attachment = Path(sys.argv[1]).read_bytes()
    if SOURCE.exists() and SOURCE.read_bytes() != attachment:
        raise SystemExit('Original already exists and differs; preserve it and review the new source separately.')
    if not SOURCE.exists():
        SOURCE.write_bytes(attachment)

raw = SOURCE.read_bytes()
source = raw.decode('utf-8')
expansion_path = ROOT / 'expansion.md'
expansion = expansion_path.read_text()
# Section headings are not catalog entries; preserve 187–198 as entry IDs.
expansion = re.sub(r'^## ([1-8])\. ', r'## 확장 \1. ', expansion, flags=re.M)

identity_path = DOCS / 'observatory-feature-identities.json'
identity_raw = identity_path.read_bytes()
identities = json.loads(identity_raw)['identities']
BASELINE = DOCS / 'observatory-experience-baseline.json'
baseline = json.loads(BASELINE.read_bytes())

PROFILES = {
    'journal': ('P01', 25, [42, 45, 53], '대상→기록/답→선택 입력/이력'),
    'catalogue': ('P02', 45, [189, 55, 56], '범위/찾기→목록/계층→상세'),
    'document': ('P03', 190, [187, 60, 81], '원자료→내 기록/주석→출처 복귀'),
    'practice': ('P04', 193, [54, 75], '범위/질문→내 답→공개 설명→수정'),
    'instrument': ('P05', 194, [187, 188, 82], '질문/조건→조절/관찰→값/근거'),
    'analysis': ('P06', 195, [47, 44, 45], '범위→여러 표현→선택 값→원기록'),
    'spatial': ('P07', 196, [62, 63, 70], '관계 지도→선택→상세/원문'),
    'board': ('P08', 49, [45, 70], '범위→이름 붙은 열→카드→이동/편집'),
    'timeline': ('P09', 197, [50, 51, 52], '기간→달력/목록→선택 과업'),
    'control': ('P10', 198, [53, 81, 191], '상태/권한→실행 범위→실행→결과/복구'),
}
PLACE_NAMES = {'desk': '북쪽 공부 책상', 'library': '서쪽 자료 책장',
               'workbench': '동쪽 탐구 작업대', 'wall': '남쪽 기록·계획 벽',
               'ceiling': '위쪽 천장 조명', 'global': '위쪽 천장 조명'}

def category(n):
    if n == 0: return 'classification-introduction'
    if n <= 12: return 'grid-system'
    if n <= 15: return 'spacing-sizing-system'
    if n <= 24: return 'composition-tool'
    if n in (31, 32): return 'visual-balance-modifier'
    if n in (33, 34, 35): return 'container-width-modifier'
    if n == 61: return 'viewport-mode'
    if n <= 63: return 'screen-content-pattern'
    if n <= 70: return 'navigation-utility-pattern'
    if n <= 74: return 'reading-attention-model'
    if n <= 84: return 'specialized-screen-pattern'
    if n <= 90: return 'css-mechanism'
    if n <= 92: return 'figma-structure-object'
    if n <= 99: return 'figma-guide'
    if n <= 106: return 'figma-flow'
    if n <= 117: return 'spacing-alignment-property'
    if n <= 128: return 'sizing-property'
    if n <= 137: return 'constraint-property'
    if n <= 143: return 'positioning-property-pattern'
    if n <= 148: return 'text-sizing-property'
    if n <= 154: return 'responsive-transformation-pattern'
    if n <= 159: return 'component-system-object'
    if n <= 170: return 'component-layout-recipe'
    if n <= 177: return 'failure-advice'
    if n <= 186: return 'decision-question'
    return 'added-workspace-pattern'

corrections = []
for line in expansion.splitlines():
    m = re.match(r'^\| (C\d+) \| ([^|]+) \|', line)
    if m:
        refs = [int(x) for x in re.findall(r'\d+', m[2])]
        if '16–24' in m[2]: refs += list(range(16, 25))
        if '71–74' in m[2]: refs += list(range(71, 75))
        if '138–143' in m[2]: refs += list(range(138, 144))
        if '184–185' in m[2]: refs += list(range(184, 186))
        if '138–139' in m[2]: refs += [138, 139]
        if '147–148' in m[2]: refs += [147, 148]
        if '160–162' in m[2]: refs += [160, 161, 162]
        if '149–154' in m[2]: refs += list(range(149, 155))
        if 'XXIX' in m[2]: refs += list(range(91, 160))
        if '155 이후' in m[2]: refs += list(range(155, 171))
        corrections.append({'id': m[1], 'originalNumbers': sorted(set(refs)),
                            'reference': 'expansion.md: 원본 설명의 보정과 주의'})

entries = []
for n, title in re.findall(r'^## (\d+)\. (.+)$', source, re.M):
    n = int(n)
    original_line = next(i for i, line in enumerate(source.splitlines(), 1)
                         if line == f'## {n}. {title}')
    kind = category(n)
    entries.append({'id': f'L{n:03}', 'number': n, 'title': title,
                    'origin': 'attachment', 'kind': kind,
                    'primaryScreenCandidate': kind in ('screen-content-pattern', 'specialized-screen-pattern'),
                    'sourceFile': 'source/uiux_layout_figma_guide.original.txt', 'sourceLine': original_line,
                    'correctionIds': [c['id'] for c in corrections if n in c['originalNumbers']]})

for n, title in re.findall(r'^## (\d+)\. (.+)$', expansion, re.M):
    n = int(n)
    if n >= 187:
        entries.append({'id': f'L{n:03}', 'number': n, 'title': title,
                        'origin': 'project-review-addition', 'kind': 'added-workspace-pattern',
                        'primaryScreenCandidate': n not in (191, 192),
                        'sourceFile': 'expansion.md', 'correctionIds': []})

all_numbers = {e['number'] for e in entries}
all_entities = [e for i in identities for e in i['entityIds']]
assert len(entries) == 199 and len(all_numbers) == 199 and all_numbers == set(range(199))
assert len(identities) == 25 and len(all_entities) == 111 and len(set(all_entities)) == 111

role_mappings, table = [], [
    '| 실제 기능명 | 기본 자리 | 프로필/대표 패턴 | 추가 후보 | 보존할 과업 맥락 |',
    '| --- | --- | --- | --- | --- |',
]
for identity in identities:
    profile, primary, secondary, sequence = PROFILES[identity['composition']]
    assert primary in all_numbers and all(n in all_numbers for n in secondary)
    place = PLACE_NAMES.get(identity['place'], identity['place'])
    mapping = {'roleId': identity['id'], 'label': identity['label'],
               'place': identity['place'], 'placeLabel': place,
               'composition': identity['composition'], 'profileId': profile,
               'primaryPattern': f'L{primary:03}',
               'secondaryCandidates': [f'L{n:03}' for n in secondary],
               'entityIds': identity['entityIds'], 'meaningfulSequence': sequence,
               'preserve': identity['preserve'], 'repeatUse': identity['repeatUse'],
               'status': 'design-candidate-not-implementation-evidence'}
    role_mappings.append(mapping)
    secondary_text = '·'.join(map(str, secondary))
    table.append(f"| {identity['label']} | {place} | {profile} / {primary} | {secondary_text} | {sequence} |")

table_text = '\n'.join(table)
marker = '<!-- ROLE_MAPPING_TABLE -->'
if marker in expansion:
    expansion = expansion.replace(marker, marker + '\n' + table_text + '\n<!-- /ROLE_MAPPING_TABLE -->') if '<!-- /ROLE_MAPPING_TABLE -->' not in expansion else re.sub(
        r'<!-- ROLE_MAPPING_TABLE -->.*?<!-- /ROLE_MAPPING_TABLE -->',
        lambda _: marker + '\n' + table_text + '\n<!-- /ROLE_MAPPING_TABLE -->', expansion, flags=re.S)
else:
    raise SystemExit('Role table marker missing')
expansion_path.write_text(expansion)

for entry in entries:
    if entry['origin'] == 'project-review-addition':
        entry['sourceLine'] = next(i for i, line in enumerate(expansion.splitlines(), 1)
                                  if line == f"## {entry['number']}. {entry['title']}")

catalog = {
    'version': 'review-expansion-1.0.0', 'reviewedAt': '2026-10-02',
    'status': 'reference-review-not-adopted-os-layout-standard',
    'format': 'project-document-index-not-DTCG-or-official-layout-taxonomy',
    'source': {'filename': 'uiux_layout_figma_guide.txt', 'sha256': sha256(raw).hexdigest(),
               'bytes': len(raw), 'lines': len(source.splitlines()), 'parts': 36,
               'introductionNumber': 0, 'mainNumberedEntries': 186, 'allNumberedEntries': 187},
    'additions': {'from': 187, 'to': 198, 'count': 12},
    'entries': entries, 'corrections': corrections,
    'classificationNote': 'Project editorial classification; candidate flags do not adopt patterns or prove implementation.',
    'profiles': [{'id': val[0], 'composition': key, 'primaryPattern': f'L{val[1]:03}',
                  'secondaryCandidates': [f'L{n:03}' for n in val[2]], 'sequence': val[3]}
                 for key, val in PROFILES.items()],
    'identitySnapshot': {'source': '../observatory-feature-identities.json',
                         'sha256': sha256(identity_raw).hexdigest(),
                         'roles': len(identities), 'uniqueEntities': len(set(all_entities))},
    'osRoleMappings': role_mappings,
    'baselineReference': {'source': '../observatory-experience-baseline.json',
                          'sha256': sha256(BASELINE.read_bytes()).hexdigest(),
                          'version': baseline.get('version'), 'ownsValues': False},
    'implementation': {'appConsumed': False, 'figmaApplied': False, 'deployed': False,
                       'note': 'This catalog and the source file are document artifacts only.'},
}
(ROOT / 'catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')

front = ('# UI·UX 레이아웃 종류 사전 — 원문 보존 검토·확장판\n\n'
         '2026-10-02 · 원본36장/도입0번+1–186번을 그대로 보존하고 작업 패턴187–198번과 검토를 덧붙였다.\n'
         '원본의 도구 기능·예시·조언은 허용 화면 패턴과 구별한다. 설계 시 뒤의 확장/보정을 함께 읽는다.\n'
         '상태: 파일 검토·확장 완료 / OS 최종 기준 채택·제품 적용은 별도 단계.\n'
         '관련 파일/상대 링크는 이 파일이 있는 layout-catalog 폴더 기준이다.\n\n'
         '# 원본 시작 — 아래 원문은 바이트 단위로 보존\n\n').encode()
tail = '\n\n# 원본 끝 / 검토·확장 시작\n\n'.encode()
combined = front + raw + tail + expansion.encode()
(ROOT / 'uiux_layout_figma_guide.expanded.txt').write_bytes(combined)

verification = {
    'checkedAt': '2026-10-02', 'sourceBytesPreserved': SOURCE.read_bytes() == raw,
    'sourceEmbeddedExactly': combined[len(front):len(front)+len(raw)] == raw,
    'sourceSha256': sha256(raw).hexdigest(),
    'originalNumbersCompleteAndUnique': [e['number'] for e in entries[:187]] == list(range(187)),
    'addedNumbersCompleteAndUnique': [e['number'] for e in entries[187:]] == list(range(187,199)),
    'corrections': len(corrections), 'profiles': len(PROFILES),
    'roles': len(role_mappings), 'entities': len(set(all_entities)),
    'rolesExactlyMatchCurrentIdentitySnapshot': {m['roleId'] for m in role_mappings} == {i['id'] for i in identities},
    'allPatternReferencesExist': all(int(p[1:]) in all_numbers for m in role_mappings
                                   for p in [m['primaryPattern'], *m['secondaryCandidates']]),
    'allEntriesHaveSourceLocations': all(Path(ROOT/e['sourceFile']).is_file() and e['sourceLine'] > 0 for e in entries),
    'kindCounts': dict(Counter(e['kind'] for e in entries)),
    'expandedTextBytes': len(combined), 'expandedTextLines': len(combined.decode().splitlines()),
    'scope': 'document integrity and mapping; no app/device/deployment verification',
}
(ROOT / 'verification.json').write_text(json.dumps(verification, ensure_ascii=False, indent=2)+'\n')
print(json.dumps({k:v for k,v in verification.items() if k not in ('kindCounts','scope')}, ensure_ascii=False, indent=2))
