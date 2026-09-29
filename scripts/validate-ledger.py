#!/usr/bin/env python3
"""Validate traceability, not product completion. Read-only unless --output is explicit."""
from __future__ import annotations
import argparse
from collections import Counter
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import sys

REPO = Path(__file__).resolve().parents[1]
STATUSES = {'통과', '수정 후 통과', '미해결', '미검증', '해당 없음'}
PASS = {'통과', '수정 후 통과'}
LEVELS = {'automated', 'browser', 'physical_device', 'server_peer', 'performance', 'long_term'}
DECISIONS = {'adopt', 'archive_only', 'not_adopted', 'undecided', 'process', 'view', 'context'}
FIXED = {
    'CORE.C': (1, 45), 'PHASE.': (0, 37), 'WORK.R': (1, 26),
    'FEATURE.F': (1, 49), 'INV.INV': (1, 22), 'FAILURE.FM': (1, 40),
    'UI.UI': (1, 38), 'PUI': (1, 20), 'PDF.PAGE': (1, 33),
    'PDF.P': (1, 33), 'UX.UX': (1, 112), 'UX_SURFACE.UI': (1, 32),
}
MINIMUM_LEVELS = {
    'PHASE.09': {'automated', 'browser', 'physical_device'},
    'PHASE.10': {'automated', 'browser', 'server_peer'},
    'PHASE.11': {'automated', 'browser', 'server_peer'},
    'PHASE.20': {'automated', 'browser', 'server_peer'},
    'PHASE.21': {'automated', 'browser', 'server_peer'},
    'PHASE.23': {'automated', 'browser', 'physical_device'},
    'PHASE.24': {'browser', 'physical_device'},
    'PHASE.25': {'browser', 'physical_device'},
    'PHASE.37': {'automated', 'browser', 'physical_device', 'server_peer', 'long_term'},
}
REQUIRED_FIELDS = {
    'id', 'meaning', 'sources', 'correction_dates', 'classification',
    'classification_reason', 'phase', 'prerequisites', 'destination', 'ui',
    'implementation', 'evidence', 'required_evidence', 'status',
    'not_applicable_reason', 'remaining', 'next_action', 'related', 'commit_artifacts',
}
# Minimum gates cannot be removed by editing a row's prerequisites.
GATES = {
    'PHASE.10': ['PHASE.09'], 'PHASE.11': ['PHASE.09', 'PHASE.10'],
    'PHASE.18': ['PHASE.11'], 'PHASE.19': ['PHASE.18'],
    'PHASE.20': ['PHASE.19'], 'PHASE.21': ['PHASE.20'],
    'PHASE.22': ['PHASE.21'], 'PHASE.23': ['PHASE.21'],
    'PHASE.24': ['PHASE.22', 'PHASE.23'], 'PHASE.25': ['PHASE.22', 'PHASE.23'],
    'PHASE.26': ['PHASE.22', 'PHASE.23'], 'PHASE.27': ['PHASE.24', 'PHASE.25', 'PHASE.26'],
    'PHASE.28': ['PHASE.27'], 'PHASE.29': ['PHASE.28'],
    'PHASE.30': ['PHASE.29'], 'PHASE.31': ['PHASE.30'], 'PHASE.32': ['PHASE.30'],
    'PHASE.33': ['PHASE.31', 'PHASE.32'], 'PHASE.34': ['PHASE.33'],
    'PHASE.35': ['PHASE.34'], 'PHASE.36': ['PHASE.05', 'PHASE.35'], 'PHASE.37': ['PHASE.36'],
}

def load(path: Path):
    return json.loads(path.read_text())


def artifact_exists(path: str, repo: Path) -> bool:
    p = Path(path)
    return (p if p.is_absolute() else repo / p).is_file()


def validate(ledger: dict, baseline: dict, previous: dict | None = None,
             repo: Path = REPO, check_sources: bool = False) -> list[str]:
    errors: list[str] = []
    def fail(code, detail):
        errors.append(f'{code}: {detail}')
    serialized = json.dumps(ledger, ensure_ascii=False)
    if '/Users/' in serialized or re.search(r'rollout-\d{4}|/\.codex/sessions/', serialized):
        fail('private-locator', 'Public ledger must use source logical IDs; keep machine/user/session paths in local outputs only')
    if ledger.get('schema_version') != 1:
        fail('schema', 'schema_version must be 1')
    rows = ledger.get('rows', [])
    if not isinstance(rows, list):
        return ['schema: rows must be a list']
    if any(not isinstance(r, dict) or not isinstance(r.get('id'), str) for r in rows):
        return ['schema: every row must be an object with a string id']
    counts = Counter(r['id'] for r in rows)
    ids = set(counts)
    index = {r['id']: r for r in rows}
    for rid, n in counts.items():
        if n != 1:
            fail('duplicate', rid)
    for rid in set(baseline.get('required_ids', [])) - ids:
        fail('missing-baseline', rid)
    for prefix, (low, high) in FIXED.items():
        width = 3 if prefix == 'UX.UX' else 2
        expected = {f'{prefix}{n:0{width}}' for n in range(low, high + 1)}
        found = {rid for rid in ids if re.fullmatch(re.escape(prefix) + r'\d+', rid)}
        for rid in expected - found:
            fail('missing-fixed', rid)
        # Additions use a child ID or an explicitly new namespace; no renumbering fixed inventories.
        for rid in found - expected:
            fail('out-of-range', rid)
    for n in range(1, 5):
        if f'UNFINISHED.U{n:02}' not in ids:
            fail('missing-fixed', f'UNFINISHED.U{n:02}')
    for row in rows:
        rid = row['id']
        missing = REQUIRED_FIELDS - row.keys()
        if missing:
            fail('fields', f'{rid}: {sorted(missing)}')
            continue
        if row['status'] not in STATUSES:
            fail('status', rid)
        if row['status'] == '해당 없음' and not row.get('not_applicable_reason'):
            fail('na-reason', rid)
        if row['classification'] not in set('ABCDE') or not row['classification_reason']:
            fail('classification', rid)
        old_class = baseline.get('classifications', {}).get(rid)
        if old_class and old_class != row['classification']:
            change = row.get('classification_change', {})
            if not change.get('reason') or not change.get('sources'):
                fail('unauthorized-classification', rid)
        if not row['meaning'] or not row['sources'] or not row['next_action']:
            fail('empty-contract', rid)
        for source in row['sources']:
            if not isinstance(source, dict) or not source.get('path') or not source.get('kind'):
                fail('source', rid)
        references = row['prerequisites'] + row['related'] + row['ui'].get('targets', []) + row.get('owner_phases', []) + [row['phase']]
        if rid.startswith('CORE.'):
            if not row.get('owner_phases') or not row.get('verification_plan') or not row.get('acceptance_contract'):
                fail('core-contract', rid)
            if not row['ui'].get('targets') and not row['ui'].get('no_direct_surface_reason'):
                fail('core-surface', rid)
        if rid.startswith('HISTORY.') and any(k in row for k in ['text', 'title', 'content', 'transcript']):
            fail('private-history', rid)
        for ref in references:
            if ref not in ids:
                fail('orphan', f'{rid} -> {ref}')
        if not row['phase'].startswith('PHASE.'):
            fail('phase', rid)
        d = row['destination']
        if not isinstance(d, dict) or d.get('decision') not in DECISIONS or not d.get('reason') or not isinstance(d.get('entities'), list):
            fail('destination', rid)
        elif d['decision'] in {'adopt', 'archive_only'} and not d['entities']:
            fail('destination', f'{rid}: adopted data must name destinations')
        if rid.startswith('INPUT.') and rid in baseline.get('input_fields', {}):
            if row.get('original_fields') != baseline['input_fields'][rid]:
                fail('input-field-loss', rid)
        if row['classification'] == 'D' and not row.get('replacement'):
            fail('replacement', rid)
        if row['classification'] == 'E' and not row.get('research'):
            fail('research', rid)
        impl = row['implementation']
        if impl.get('files') and not impl.get('test_connections'):
            fail('untested-implementation', rid)
        for f in impl.get('files', []) + impl.get('test_connections', []):
            if not artifact_exists(f, repo):
                fail('missing-code', f'{rid}: {f}')
        required = row['required_evidence']
        if not required or not set(required) <= LEVELS:
            fail('evidence-required', rid)
        if set(row['evidence']) != LEVELS:
            fail('evidence-levels', rid)
        for level, ev in row['evidence'].items():
            if ev.get('status') not in STATUSES:
                fail('evidence-status', f'{rid}/{level}')
            if ev.get('status') == '해당 없음' and not ev.get('reason'):
                fail('evidence-na', f'{rid}/{level}')
            if ev.get('status') in PASS:
                if not ev.get('artifacts') or not ev.get('verified_at') or not ev.get('commit') or not ev.get('scope'):
                    fail('unsupported-evidence', f'{rid}/{level}')
                if ev.get('historical'):
                    fail('historical-promotion', f'{rid}/{level}')
                for artifact in ev.get('artifacts', []):
                    if not isinstance(artifact, dict) or artifact.get('level') != level or not artifact.get('path'):
                        fail('evidence-kind', f'{rid}/{level}')
                        continue
                    if not artifact_exists(artifact['path'], repo):
                        fail('missing-artifact', f'{rid}/{level}: {artifact["path"]}')
                    # Test source presence is not an executed test artifact.
                    if re.search(r'(?:\.test\.|test-validate-ledger\.py$)', artifact['path']):
                        fail('test-source-not-run', f'{rid}/{level}')
        if row['status'] in PASS:
            for level in set(required) | MINIMUM_LEVELS.get(rid, set()):
                ev = row['evidence'].get(level, {})
                if ev.get('status') not in PASS and not (ev.get('status') == '해당 없음' and ev.get('reason')):
                    fail('unsupported-pass', f'{rid}/{level}')
            if row['remaining']:
                fail('open-pass', rid)
            for dep in set(row['prerequisites'] + GATES.get(rid, [])):
                if index.get(dep, {}).get('status') not in PASS:
                    fail('dependency', f'{rid} before {dep}')
            if rid == 'PHASE.37':
                for level in ['physical_device', 'server_peer', 'long_term']:
                    if row['evidence'].get(level, {}).get('status') not in PASS:
                        fail('release-gate', f'{rid}/{level}')
        if rid.startswith('PDF.PAGE'):
            links = row.get('page_requirement_ids', [])
            if not links and row['destination'].get('decision') != 'context':
                fail('pdf-empty', rid)
            for q in links:
                if q not in ids or rid not in index[q].get('pdf_pages', []):
                    fail('pdf-reciprocal', f'{rid} -> {q}')
            expected = baseline.get('pdf_page_links', {}).get(rid, [])
            for q in set(expected) - set(links):
                fail('pdf-requirement-loss', f'{rid}: {q}')
        elif rid.startswith('PDF.'):
            for p in row.get('pdf_pages', []):
                if p not in ids or rid not in index[p].get('page_requirement_ids', []):
                    fail('pdf-reciprocal', f'{rid} -> {p}')
    # Cycles in phase dependencies cannot have a meaningful completion order.
    visiting, visited = set(), set()
    def visit(rid):
        if rid in visiting:
            fail('dependency-cycle', rid)
            return
        if rid in visited:
            return
        visiting.add(rid)
        for dep in index.get(rid, {}).get('prerequisites', []):
            if dep.startswith('PHASE.'):
                visit(dep)
        visiting.remove(rid)
        visited.add(rid)
    for rid in ids:
        if rid.startswith('PHASE.'):
            visit(rid)
    if previous:
        old = {r['id']: r for r in previous['rows']}
        for rid in old.keys() - ids:
            fail('disappeared', rid)
        for rid in old.keys() & ids:
            before, after = old[rid], index[rid]
            if before.get('classification') != after.get('classification') and not after.get('classification_change'):
                fail('unauthorized-classification', rid)
            if before['status'] not in PASS and after['status'] in PASS:
                changed = any(after['evidence'].get(l) != before['evidence'].get(l) for l in LEVELS)
                if not changed:
                    fail('unsupported-promotion', rid)
            for l in LEVELS:
                old_artifacts = before.get('evidence', {}).get(l, {}).get('artifacts', [])
                new_artifacts = after.get('evidence', {}).get(l, {}).get('artifacts', [])
                for a in old_artifacts:
                    if a not in new_artifacts and a not in after.get('superseded_evidence', []):
                        fail('evidence-loss', f'{rid}/{l}')
    if check_sources:
        validate_sources(ledger, baseline, index, repo.parent, fail)
    actual = Counter(r['id'].split('.')[0] if '.' in r['id'] else 'PUI' for r in rows)
    if dict(actual) != ledger.get('counts'):
        fail('count-summary', 'recorded counts differ from rows; counts alone do not prove completeness')
    return sorted(set(errors))


def validate_sources(ledger, baseline, index, root, fail):
    """Compare actual original sets/fields, not only SHA. Does not judge prose semantics."""
    for s in ledger.get('source_manifest', []):
        path = root / s['path']
        if not path.is_file():
            fail('source-unavailable', s['path'])
        elif hashlib.sha256(path.read_bytes()).hexdigest() != s['sha256']:
            fail('source-changed', s['path'])
    checks = [
        ('generation2/docs/migration-spec.md', r'^\| (F\d{2}) ', 'FEATURE.'),
        ('generation2/docs/data-contract.md', r'^- (INV\d{2}):', 'INV.'),
        ('generation2/docs/failure-matrix.md', r'^\| (FM\d{2}) ', 'FAILURE.'),
        ('generation2/docs/qa-inventory.md', r'^\| (UI\d{2}) ', 'UI.'),
        ('generation2/docs/prototype-validation.md', r'^\| (PUI\d{2}) ', ''),
        ('outputs/20260929-gen2-evidence-audit/03-요구사항-추적표.md', r'^\| (R\d{2}) ', 'REQUEST.'),
        ('outputs/20260929-gen2-evidence-audit/08-초기응답과-92개입력.md', r'^\| ([A-Z]+\d{2}) ', 'INPUT.'),
        ('outputs/20260929-gen2-evidence-audit/02-PDF-33쪽-요구사항.md', r'^\| (P\d{2}) ', 'PDF.'),
        ('outputs/20260929-gen2-build/audit/pdf.md', r'^\| PDF-([AQ]\d{2}) ', 'PDF.'),
    ]
    for relative, pattern, prefix in checks:
        path = root / relative
        if not path.is_file():
            fail('source-unavailable', relative)
            continue
        for original_id in re.findall(pattern, path.read_text(), re.M):
            if prefix + original_id not in index:
                fail('source-id-missing', prefix + original_id)
    for relative, prefix in [
        ('outputs/20260923-advanced-visual-research/ux/ux-catalog.json', 'UX.'),
        ('outputs/20260923-advanced-visual-research/ux/ui-ux-coverage.json', 'UX_SURFACE.'),
        ('outputs/20260927-all-ux/coverage.json', 'UX.'),
    ]:
        path = root / relative
        if not path.is_file():
            fail('source-unavailable', relative)
            continue
        for original in load(path):
            if prefix + original['id'] not in index:
                fail('source-id-missing', prefix + original['id'])
    inputs = root / 'outputs/20260929-gen2-evidence-audit/08-초기응답과-92개입력.md'
    if inputs.is_file():
        for line in inputs.read_text().splitlines():
            m = re.match(r'^\| ([A-Z]+\d{2}) [^|]+\| ([^|]+)\|', line)
            if m and index.get('INPUT.' + m[1], {}).get('original_fields') != m[2].strip():
                fail('input-source-field-loss', m[1])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--ledger', type=Path, default=REPO / 'docs/execution-ledger.json')
    parser.add_argument('--baseline', type=Path, default=REPO / 'docs/execution-ledger-baseline.json')
    parser.add_argument('--previous', type=Path)
    parser.add_argument('--check-sources', action='store_true')
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    ledger, baseline = load(args.ledger), load(args.baseline)
    errors = validate(ledger, baseline, load(args.previous) if args.previous else None,
                      check_sources=args.check_sources)
    result = {'purpose': 'ledger structure/integrity only; not semantic completeness or product completion',
              'executed_at': datetime.now(timezone.utc).isoformat(), 'passed': not errors,
              'rows': len(ledger['rows']), 'counts': ledger['counts'],
              'source_comparison_executed': args.check_sources,
              'previous_comparison_executed': bool(args.previous),
              'ledger_sha256': hashlib.sha256(args.ledger.read_bytes()).hexdigest(),
              'errors': errors, 'product_status': '미해결',
              'limitations': ledger.get('semantic_review', {}).get('blockers', [])}
    output = json.dumps(result, ensure_ascii=False, indent=2) + '\n'
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with args.output.open('x') as f:
            f.write(output)
    print(output, end='')
    return 0 if not errors else 1


if __name__ == '__main__':
    sys.exit(main())
