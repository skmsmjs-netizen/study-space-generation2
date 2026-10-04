"""Adopt the reviewed catalog as a traceable OS selection contract, without rewriting UI/data."""
from pathlib import Path
from hashlib import sha256
import json
import re

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT.parent
APP = DOCS.parent
CAT = DOCS / 'layout-catalog/catalog.json'
EXP = DOCS / 'layout-catalog/expansion.md'
GUIDE = DOCS / 'layout-catalog/uiux_layout_figma_guide.expanded.txt'
IDENTITY = DOCS / 'observatory-feature-identities.json'
INVENTORY = DOCS / 'figma-observatory-20261002/screen-inventory.json'
BASELINE = DOCS / 'observatory-experience-baseline.json'
data = json.loads(CAT.read_text())
identity = json.loads(IDENTITY.read_text())
inventory = json.loads(INVENTORY.read_text())
baseline = json.loads(BASELINE.read_text())
entries = {e['id']: e for e in data['entries']}
roles = {i['id']: i for i in identity['identities']}
role_by_entity = {e: i for i in identity['identities'] for e in i['entityIds']}
profiles = {p['composition']: p for p in data['profiles']}

ROUTE_PRIMARY = [25,195,197,37,53,45,45,82,194,193,193,37,45,193,62,196,49,55,
                 189,45,53,190,190,45,82,193,193,193,193,45,25,25,198,45,45,25,81,40,198,198,25]
SURFACE_PRIMARY = [64,53,53,25,198,45,198,198,25,53,48,48,48,25,25,189,53,197,53,
                   53,53,198,190,190,45,198,53,53,190,82,194,194,194,62,196,195,198,48,25,25,25]
OVERLAY_PRIMARY = {12:198,14:194,15:48,21:198,26:43}

def lid(n): return f'L{n:03}'

def validate_pattern(pattern, scope, surface=False):
    if pattern not in entries:
        raise ValueError(f'{scope}: unregistered pattern {pattern}')
    entry = entries[pattern]
    if not surface and not entry['primaryScreenCandidate']:
        raise ValueError(f'{scope}: {pattern} is {entry["kind"]}, not a primary screen pattern')
    if surface and entry['kind'] not in ('screen-content-pattern','specialized-screen-pattern',
            'added-workspace-pattern','navigation-utility-pattern','component-layout-recipe','viewport-mode'):
        raise ValueError(f'{scope}: {pattern} cannot select a visible surface layout')

bindings = []
for group, category in [('routes','screen'),('overlays','overlay'),('surfaces','surface')]:
    for entity in inventory[group]:
        eid = entity['id']
        n = int(eid[1:])
        role = role_by_entity[eid]
        profile = profiles[role['composition']]
        if category=='screen': primary=lid(ROUTE_PRIMARY[n-1])
        elif category=='overlay': primary=lid(OVERLAY_PRIMARY.get(n,53))
        else: primary=lid(SURFACE_PRIMARY[n-1])
        validate_pattern(primary,eid,surface=category!='screen')
        secondary = list(dict.fromkeys([profile['primaryPattern'], *profile['secondaryCandidates']]))
        secondary = [s for s in secondary if s != primary]
        wrapper = lid(61 if eid=='O14' else 170) if category=='overlay' else None
        if eid=='U01': secondary=list(dict.fromkeys([*secondary,lid(65),lid(69),lid(66)]))
        if eid in ('R39','R40'): alias='Existing redirect/alias; inherit the actual destination layout without creating a screen.'
        else: alias=None
        sources=entity.get('sources') or [entity.get('source')]
        source_status=[]
        for src in sources:
            if src and src.get('path'):
                path=APP/src['path']
                source_status.append({**src,'existsAtAdoption':path.is_file()})
        row={
            'entityId':eid,'name':entity['name'],'scope':category,'roleId':role['id'],
            'composition':role['composition'],'profileId':profile['id'],
            'placeId':role['place'],'placeLabel':next(m['placeLabel'] for m in data['osRoleMappings'] if m['roleId']==role['id']),
            'primaryPattern':primary,'primaryTitle':entries[primary]['title'],
            'secondaryPatterns':secondary,'wrapperPattern':wrapper,
            'narrowPattern':lid(25),'narrowPolicy':'Meaningful sequential reflow or primary surface + registered auxiliary surface; intrinsic 2D regions retain navigation.',
            'sequence':profile['sequence'],'returnPolicy':entity.get('return','Actual invoker/task, selection, draft and required view position.'),
            'preserve':role['preserve'],'repeatUse':role['repeatUse'],
            'sources':source_status,'route':entity.get('path'),'aliasPolicy':alias,
            'adoptionStatus':'required-selection','currentImplementationAssessment':'not-certified-by-this-contract',
        }
        # A board or spatial surface remains a 2D surface; adjacent prose/controls reflow.
        if role['composition'] in ('spatial','board'):
            row['narrowPattern']=primary
            row['narrowPolicy']='Preserve intrinsic 2D or named board columns; reflow prose/controls, provide selection/detail and explicit navigation.'
        elif role['composition']=='catalogue':
            row['narrowPolicy']='List -> detail; restore filter, selection, expansion and list scroll on return.'
        bindings.append(row)

expansion=EXP.read_text()
future_block=expansion.split('### 4.2')[1].split('## 확장 5.')[0]
future_rows=[line for line in future_block.splitlines() if line.startswith('|')][2:]
FUTURE_PRIMARY=[48,64,25,160,25,189,55,25,194,190,193,194,195,196,49,197,70,25,198,198,188,190,190,198]
future=[]
for i,(line,n) in enumerate(zip(future_rows,FUTURE_PRIMARY),1):
    role,structure,policy=[part.strip() for part in line.strip('|').split('|')]
    validate_pattern(lid(n),f'FE{i:02}',surface=True)
    conditional=i in (23,24)
    future.append({'id':f'FE{i:02}','role':role,'primaryPattern':lid(n),'registeredStructureGuidance':structure,
                   'growthAndPreservation':policy,
                   'sizePolicy':'Use existing role tokens; content height grows; declare axis min/max and intrinsic 2D exceptions.',
                   'reflowPolicy':'Declare registered narrow form and meaningful order; retain task context.',
                   'status':'conditional-existing-exclusions-preserved' if conditional else 'required-when-element-is-used',
                   'implementationClaim':False})

assert len(bindings)==111 and len({e['entityId'] for e in bindings})==111
assert set(role_by_entity)=={e['entityId'] for e in bindings}
assert len(future_rows)==len(future)==24 and len(roles)==25
assert set(entries)=={lid(n) for n in range(199)}
for b in bindings:
    for pattern in b['secondaryPatterns']+[b['narrowPattern']]+([b['wrapperPattern']] if b['wrapperPattern'] else []):
        assert pattern in entries,(b['entityId'],pattern)

snapshots={}
for key,path in [('guide',GUIDE),('catalog',CAT),('identity',IDENTITY),('inventory',INVENTORY),('baseline',BASELINE)]:
    snapshots[key]={'path':str(path.relative_to(DOCS)),'sha256':sha256(path.read_bytes()).hexdigest()}

contract={
    'version':'1.0.0','adoptedAt':'2026-10-02','status':'adopted',
    'basis':'User requested adoption of the final expanded layout guide and native Figma criteria for current/future OS.',
    'sourceSnapshots':snapshots,'ownsColorAndMetricValues':False,
    'registeredEntries':[{k:e[k] for k in ('id','number','title','kind','primaryScreenCandidate')} for e in entries.values()],
    'rules':{'registeredPrimaryRequired':True,'registeredInternalPatternsAllowed':True,
             'gridSpacingToolCannotReplacePrimary':True,'registerBeforeUsingNewPattern':True,
             'preserveOriginalWidgetEntirely':True,'externalFrameOnly':True,
             'commonPlace':'ceiling','bodyAlignmentRef':'metrics.paper.bodyAlignment',
             'valuesCanAdaptToImplementation':True,'runtimeConformanceRequiresSeparateEvidence':True},
    'commonShell':{'cover':[lid(34),lid(48)],'navigation':[lid(64),lid(65)],
                   'narrowNavigation':[lid(69),lid(66)],'utility':[lid(70),lid(191),lid(192)],
                   'coverPlacement':'First row spans sidebar and task surface; height follows entire original scene aspect ratio.',
                   'outsideFrame':'Reserve additional space outside original widget; do not crop, zoom or occlude.',
                   'return':'Actual task, direction, selection, draft and necessary view position.'},
    'profiles':list(profiles.values()),'entityLayouts':bindings,'futureElementClasses':future,
    'sizingReferences':{'source':'observatory-experience-baseline.json',
                        'metricsPaths':['metrics.type','metrics.space','metrics.control','metrics.layout','metrics.window','metrics.paper'],
                        'policy':'References, not duplicate token ownership; rem responds to user root font.'},
    'requiredNewElementFields':['entityId','parent','task','primaryPattern','secondaryPatterns','place','material',
                               'sequence','axisSizing','tokenRefs','growth','reflow','scroll','interaction',
                               'return','failureRecovery','preserve','source','evidence'],
    'figma':{'fileKey':'YHmD1PpWWfR9JGTEs77JsX','pageId':'227:180','overviewId':'227:181',
             'manifest':'layout-standard/figma-manifest.json'},
    'implementationBoundary':{'criteriaAdopted':True,'allExistingScreensCertified':False,
                              'appSourceModifiedByThisStandardTask':False,'deployedByThisTask':False},
}
(DOCS/'layout-standard-contract.json').write_text(json.dumps(contract,ensure_ascii=False,indent=2)+'\n')

table=['# 現在 엔터티 전체의 등록 레이아웃 지정'.replace('現在','현재'),'',
       '2026-10-02 정식 목표. 기능 정의/현재 소스 참조에 연결했다. 전체 실제 화면 준수/렌더/저장 검증과는 구별한다.',
       '', '| ID | 실제 기능명 | 범위/프로필 | 대표 패턴 | 보조면 외곽 |',
       '| --- | --- | --- | --- | --- |']
for b in bindings:
    table.append(f"| {b['entityId']} | {b['name']} | {b['scope']} / {b['profileId']} | {b['primaryPattern']} · {b['primaryTitle']} | {b['wrapperPattern'] or '상위 공통 외곽'} |")
(ROOT/'entity-layouts.md').write_text('\n'.join(table)+'\n')

# Negative checks cover the important category error and unknown-pattern failure.
rejected=[]
for pattern in ('L999','L014','L091','L118'):
    try:validate_pattern(pattern,'negative-check')
    except ValueError:rejected.append(pattern)
assert len(rejected)==4
verification={'checkedAt':'2026-10-02','registeredEntries':len(entries),'roles':len(roles),
              'profiles':len(profiles),'entities':len(bindings),'futureElementClasses':len(future),
              'duplicateOrMissingEntities':0,'invalidPatternReferences':0,
              'rejectedUnknownOrWrongPrimaryKinds':rejected,
              'sourceReferences':sum(len(b['sources']) for b in bindings),
              'missingSourceFiles':[{ 'id':b['entityId'],'path':s['path']} for b in bindings for s in b['sources'] if not s['existsAtAdoption']],
              'scope':'Contract/document coverage and source existence, not UI execution or deployment.'}
(ROOT/'verification.json').write_text(json.dumps(verification,ensure_ascii=False,indent=2)+'\n')

# Compact native Figma board data. Full prose remains in the adopted local standard.
payload={'pageId':'227:180','overviewId':'227:181','profiles':list(profiles.values()),
         'roles':[{'id':r['id'],'label':r['label'],'composition':r['composition'],'place':r['place'],
                   'entities':r['entityIds']} for r in roles.values()],
         'entities':[{k:b[k] for k in ('entityId','name','scope','profileId','primaryPattern','wrapperPattern')} for b in bindings],
         'future':future,'entries':list(entries.values()),
         'metrics':baseline['metrics'],'snapshots':snapshots}
(ROOT/'figma-payload.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(verification,ensure_ascii=False,indent=2))
