"""Render Figma Plugin API scripts from current vocabulary contracts; does not send them remotely."""
from pathlib import Path
import json, argparse

here = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument('page_id', help='A live page ID verified from the current Figma file')
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args()
if not all(part.isdigit() for part in args.page_id.split(':')) or args.page_id.count(':') != 1:
    parser.error('Expected a verified page ID in integer:integer form')
contract = json.loads((here/'contract.json').read_text())
code_map = json.loads((here/'code-map.json').read_text())
mapped = {}
for row in code_map['rows']:
    target = row['figma'].get('ownerId')
    if target:
        mapped[target] = {'source': row['code']['source'], 'line': row['code']['line'], 'matches': row['code']['matchesCapturedSource'], 'label': row['roleLabel'], 'termId': row['termIds'][0]}
code = (here/'apply-page-template.js').read_text()
for key, value in {'PAGE_ID': args.page_id, 'NODE_TYPES': contract['nodeTypes'],
                   'PROPERTY_MAP': contract['componentPropertyNames'], 'STATES': contract['states'],
                   'FALLBACK': contract['fallback'], 'CODE_MAP': mapped}.items():
    code = code.replace('__'+key+'__', json.dumps(value, ensure_ascii=False))
args.output.write_text(code)
print(json.dumps({'output': str(args.output), 'pageId': args.page_id, 'remoteWrites': 0}))
