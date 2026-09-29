#!/usr/bin/env python3
"""Negative fixtures: prove corrupted traceability cannot become a product pass."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('ledger_validator', HERE / 'validate-ledger.py')
validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validator)
ROOT = HERE.parent
LEDGER = json.loads((ROOT / 'docs/execution-ledger.json').read_text())
BASELINE = json.loads((ROOT / 'docs/execution-ledger-baseline.json').read_text())


def row(data, ident):
    return next(r for r in data['rows'] if r['id'] == ident)


class RejectedCorruption(unittest.TestCase):
    def check(self, mutate, expected, previous=None):
        data = copy.deepcopy(LEDGER)
        mutate(data)
        errors = validator.validate(data, BASELINE, previous)
        self.assertTrue(any(e.startswith(expected + ':') for e in errors), errors)

    def test_current_inventory_and_real_source_sets(self):
        self.assertEqual([], validator.validate(LEDGER, BASELINE, check_sources=True))

    def test_input_r01_cannot_disappear_even_with_work_r01_present(self):
        self.check(lambda d: d['rows'].remove(row(d, 'INPUT.R01')), 'missing-baseline')

    def test_fixed_total_cannot_hide_a_renumbered_input(self):
        self.check(lambda d: row(d, 'INPUT.R01').update(id='INPUT.RENAMED01'), 'missing-baseline')

    def test_duplicate_is_rejected(self):
        self.check(lambda d: d['rows'].append(copy.deepcopy(row(d, 'FEATURE.F01'))), 'duplicate')

    def test_out_of_range_fixed_id_is_rejected(self):
        self.check(lambda d: d['rows'].append({**copy.deepcopy(row(d, 'CORE.C01')), 'id': 'CORE.C46'}), 'out-of-range')

    def test_orphan_ui_reference(self):
        self.check(lambda d: row(d, 'FEATURE.F01')['ui']['targets'].append('UI.UI99'), 'orphan')

    def test_retired_input_cannot_lose_original_fields(self):
        self.check(lambda d: row(d, 'INPUT.T06').update(original_fields='goal'), 'input-field-loss')

    def test_destination_requires_reason(self):
        self.check(lambda d: row(d, 'INPUT.R01')['destination'].update(reason=''), 'destination')

    def test_adoption_without_named_entity_is_rejected(self):
        self.check(lambda d: row(d, 'INPUT.R01')['destination'].update(entities=[]), 'destination')

    def test_pdf_page_count_does_not_hide_missing_atomic_requirement(self):
        self.check(lambda d: row(d, 'PDF.PAGE31')['page_requirement_ids'].remove('PDF.Q05'), 'pdf-requirement-loss')

    def test_implementation_needs_test_connection(self):
        self.check(lambda d: row(d, 'FEATURE.F09')['implementation'].update(test_connections=[]), 'untested-implementation')

    def test_test_source_cannot_be_substituted_for_execution_artifact(self):
        def mutate(d):
            row(d, 'CORE.C01')['evidence']['automated'].update(status='통과', verified_at='2026-09-30', commit='test',
                artifacts=[{'level': 'automated', 'path': 'src/App.test.tsx'}])
        self.check(mutate, 'test-source-not-run')

    def test_browser_evidence_cannot_be_promoted_to_physical(self):
        def mutate(d):
            row(d, 'CORE.C01')['evidence']['physical_device'].update(status='통과', verified_at='2026-09-30', commit='test',
                artifacts=[{'level': 'browser', 'path': 'docs/prototype-validation.md'}])
        self.check(mutate, 'evidence-kind')

    def test_historical_pass_is_not_current_evidence(self):
        def mutate(d):
            row(d, 'CORE.C01')['evidence']['browser'].update(status='통과', historical=True, verified_at='2026-09-29', commit='old',
                artifacts=[{'level': 'browser', 'path': 'docs/prototype-validation.md'}])
        self.check(mutate, 'historical-promotion')

    def test_bare_pass_without_execution_is_rejected(self):
        self.check(lambda d: row(d, 'CORE.C01').update(status='통과'), 'unsupported-pass')

    def test_na_requires_reason(self):
        self.check(lambda d: row(d, 'CORE.C01').update(status='해당 없음'), 'na-reason')

    def test_phase_cannot_remove_online_dependency_to_skip_gate(self):
        self.check(lambda d: row(d, 'PHASE.18').update(status='통과', prerequisites=[]), 'dependency')

    def test_dependency_cycle(self):
        self.check(lambda d: row(d, 'PHASE.00').update(prerequisites=['PHASE.01']), 'dependency-cycle')

    def test_classification_change_needs_authority_and_reason(self):
        self.check(lambda d: row(d, 'FEATURE.F01').update(classification='D'), 'unauthorized-classification')

    def test_previous_extra_discovery_is_not_lost(self):
        old = copy.deepcopy(LEDGER)
        old['rows'].append({**copy.deepcopy(row(old, 'UNFINISHED.U01')), 'id': 'UNFINISHED.U99'})
        self.check(lambda d: None, 'disappeared', old)

    def test_previous_evidence_is_kept_or_explicitly_superseded(self):
        old = copy.deepcopy(LEDGER)
        row(old, 'CORE.C01')['evidence']['automated']['artifacts'] = [{'level': 'automated', 'path': 'old-execution.json'}]
        self.check(lambda d: None, 'evidence-loss', old)

    def test_public_ledger_rejects_private_machine_locator(self):
        self.check(lambda d: row(d, 'HISTORY.H000')['sources'][0].update(path='/Users/private/.codex/sessions/raw.jsonl'), 'private-locator')

    def test_public_ledger_rejects_conversation_text(self):
        self.check(lambda d: row(d, 'HISTORY.H000').update(text='private message'), 'private-history')

    def test_core_cannot_return_to_unmapped_template(self):
        self.check(lambda d: row(d, 'CORE.C01').update(verification_plan={}), 'core-contract')

    def test_core_without_direct_surface_needs_applicability_reason(self):
        self.check(lambda d: row(d, 'CORE.C03')['ui'].pop('no_direct_surface_reason'), 'core-surface')

    def test_stable_release_requires_physical_peer_and_long_term_evidence(self):
        self.check(lambda d: row(d, 'PHASE.37').update(status='통과'), 'release-gate')


if __name__ == '__main__':
    unittest.main(verbosity=2)
