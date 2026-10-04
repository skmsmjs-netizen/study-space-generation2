"""Extract the adopted glossary and build the educational correspondence without editing runtime data."""
from pathlib import Path
import hashlib, json, re

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
APP = ROOT / 'generation2'
SOURCE = ROOT / 'docs/웹앱_설계_용어사전.md'

def write(name, data):
    (OUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

text = SOURCE.read_text()
terms, categories = [], []
for block in re.split(r'(?m)^## ', text)[1:]:
    heading = block.splitlines()[0]
    if not re.match(r'^\d{2}\. ', heading):
        continue
    category = {'id': 'category-' + heading[:2], 'label': heading, 'member': []}
    for match in re.finditer(r'(?m)^\*\*(.+?)\*\*\s*\n\n([^\n]+)', block):
        original, definition = match.groups()
        parts = re.match(r'^(.*?)\s*\((.*?)\)$', original)
        ko, en = parts.groups() if parts else (original, '')
        id = 'term-' + hashlib.sha256(original.encode()).hexdigest()[:12]
        item = {'id': id, 'prefLabel': {'ko': ko.strip(), 'en': en},
                'originalLabel': original, 'definition': definition,
                'categoryId': category['id'], 'sourceLine': text[:text.find('**' + original + '**')].count('\n') + 1,
                'altLabel': [], 'broader': [], 'related': []}
        terms.append(item)
        category['member'].append(id)
    categories.append(category)
assert terms, 'No glossary terms found'
assert len({t['id'] for t in terms}) == len(terms)
assert len({t['originalLabel'] for t in terms}) == len(terms)
assert categories, 'No glossary categories found'
by_name = {t['originalLabel']: t for t in terms}
def term(name):
    hits = [t for t in terms if t['prefLabel']['ko'] == name]
    assert len(hits) == 1, (name, [t['originalLabel'] for t in hits])
    return hits[0]['id']
def exact(name):
    return by_name[name]['id']

# Type hierarchy is containment, not a SKOS broader relationship.
native = {
    'DOCUMENT': ['파일', '파일 (Figma File)'], 'PAGE': ['페이지', '페이지 (Page)'],
    'SECTION': ['섹션', '섹션 (Section)'], 'FRAME': ['프레임', '프레임 (Frame)'],
    'GROUP': ['그룹', '그룹 (Group)'], 'COMPONENT': ['메인 컴포넌트', '메인 컴포넌트 (Main Component)'],
    'COMPONENT_SET': ['컴포넌트 세트', '컴포넌트 세트 (Component Set)'],
    'INSTANCE': ['인스턴스', '인스턴스 (Instance)'],
    'TEXT': ['텍스트 레이어', '레이어 (Layer)'], 'TEXT_PATH': ['경로 텍스트', '레이어 (Layer)'],
    'VECTOR': ['벡터 경로', '레이어 (Layer)'], 'LINE': ['선 레이어', '레이어 (Layer)'],
    'RECTANGLE': ['사각형 레이어', '레이어 (Layer)'], 'ELLIPSE': ['타원 레이어', '레이어 (Layer)'],
    'POLYGON': ['다각형 레이어', '레이어 (Layer)'], 'STAR': ['별 레이어', '레이어 (Layer)'],
    'BOOLEAN_OPERATION': ['도형 불리언 연산', '레이어 (Layer)'], 'SLICE': ['내보내기 영역', '에셋 (Asset)']
}
native['DOCUMENT'][0] = '파일'
node_types = {k: {'label': label, 'termId': exact(original), 'officialType': k,
                    'supplement': k in ['TEXT','TEXT_PATH','VECTOR','LINE','RECTANGLE','ELLIPSE','POLYGON','STAR','BOOLEAN_OPERATION','SLICE'],
                    'source': 'https://developers.figma.com/docs/plugins/api/nodes/'}
              for k, (label, original) in native.items()}
prop_defs = [
    ('width height minWidth maxWidth minHeight maxHeight', '크기·최소/최대 폭과 높이', '고정 크기'),
    ('x y relativeTransform absoluteTransform', '위치·좌표·좌표 변환', '캔버스 좌표'),
    ('rotation', '회전 각도', '직접 조작'),
    ('fills fillStyleId', '채우기·채우기 스타일', '스타일'),
    ('strokes strokeStyleId strokeWeight strokeAlign strokeCap strokeJoin dashPattern', '선·선 굵기·정렬·끝·이음·점선', '스타일'),
    ('effects effectStyleId', '효과·효과 스타일', '스타일'),
    ('opacity', '투명도', '투명도'), ('cornerRadius topLeftRadius topRightRadius bottomLeftRadius bottomRightRadius cornerSmoothing', '모서리 반경·모서리 다듬기', '모서리 반경'),
    ('fontName fontFamily', '글꼴·서체', '폰트'), ('fontStyle fontWeight', '글자 굵기·글꼴 스타일', '글자 굵기'),
    ('fontSize', '글자 크기', '글자 크기'), ('lineHeight', '행간', '행간'), ('letterSpacing', '자간', '자간'),
    ('textAlignHorizontal textAlignVertical', '텍스트 정렬', '정렬 (Alignment)'),
    ('characters', '텍스트 내용', '레이어'), ('textStyleId', '텍스트 스타일', '타이포그래피'),
    ('textAutoResize', '텍스트 크기 조정', '유동형 크기'), ('textTruncation maxLines', '말줄임·최대 줄 수', '말줄임'),
    ('paragraphSpacing paragraphIndent', '문단 간격·들여쓰기', '여백'),
    ('layoutMode', '오토 레이아웃 배치 방향', '배치 방향'), ('layoutWrap', '오토 레이아웃 줄바꿈', '자동 줄바꿈'),
    ('primaryAxisAlignItems counterAxisAlignItems counterAxisAlignContent', '주축·교차축 정렬', '정렬 (Alignment)'),
    ('itemSpacing counterAxisSpacing gridRowGap gridColumnGap', '항목 간격·행/열 간격', '갭'),
    ('paddingTop paddingRight paddingBottom paddingLeft', '위·오른쪽·아래·왼쪽 안쪽 여백', '패딩'),
    ('layoutSizingHorizontal layoutSizingVertical primaryAxisSizingMode counterAxisSizingMode', '고정·내용에 맞춤·컨테이너 채우기', '오토 레이아웃'),
    ('layoutGrow layoutAlign', '자식의 확장·정렬', '오토 레이아웃'),
    ('layoutPositioning', '자동 흐름/절대 배치', '절대 배치'),
    ('layoutGrids gridRowCount gridColumnCount gridRowSpan gridColumnSpan', '격자·행·열·영역 차지', '그리드'),
    ('constraints', '부모 변화에 대한 제약', '제약 조건 (Constraints)'),
    ('clipsContent', '프레임 밖 내용 자르기', '오버플로'), ('visible', '레이어 표시 여부', '레이어'),
    ('locked', '편집 잠금', '사용자 통제'), ('blendMode', '색 혼합 방식', '스타일'),
    ('mainComponent componentId', '인스턴스의 재사용 원본', '메인 컴포넌트'),
    ('componentProperties componentPropertyDefinitions componentPropertyReferences', '실제 컴포넌트 속성·속성 연결', '컴포넌트 속성'),
    ('variantProperties variantGroupProperties', '변형 속성과 값', '변형'),
    ('boundVariables explicitVariableModes resolvedVariableModes', '변수 연결·명시/해석된 모드', '변수'),
    ('reactions prototypeStartNodeId flowStartingPoints', '프로토타입 진입·상호작용 연결', '프로토타입'),
    ('overflowDirection', '스크롤 가능 방향', '오버플로'), ('isMask maskType', '마스크·마스크 종류', '자르기'),
    ('vectorPaths vectorNetwork', '벡터 경로·제어점/연결', '레이어'),
    ('arcData', '타원/원의 호 범위', '레이어'), ('exportSettings', '내보내기 설정', '개발 전달'),
    ('annotations description descriptionMarkdown documentationLinks', '주석·설명·문서 연결', '개발 전달'),
    ('name id type parent children', '역할명·안정 ID·타입·부모·자식', '부모·자식 관계'),
]
properties = {}
for keys, label, name in prop_defs:
    term_id = exact(name) if name in by_name else term(name)
    for key in keys.split():
        properties[key] = {'label': label, 'termId': term_id,
            'mappingKind': 'exact-term' if key in ['fontSize','fontWeight','lineHeight','letterSpacing','opacity','cornerRadius'] else 'facet-of-term',
            'note': '사전의 상위 어휘와 연결한 공식 Figma 속성입니다. 같은 줄의 속성들이 서로 같은 값이라는 뜻은 아닙니다.'}
states = {'default':'기본 상태','hover':'호버','pressed':'누름 상태','focus':'포커스','selected':'선택됨','disabled':'비활성','readOnly':'읽기 전용','loading':'로딩','busy':'로딩','invalid':'오류 상태','empty':'빈 상태','offline':'오프라인','error':'오류 상태','checked':'선택됨','unchecked':'기본 상태','mixed':'선택됨'}
component_props = {'label':'레이블','title':'레이블','body':'컴포넌트 속성','message':'상태 메시지','hint':'도움말','placeholder':'플레이스홀더','error':'오류 상태','state':'상태표','kind':'변형','size':'변형','width':'반응형 설계','selection':'선택됨','value':'컴포넌트 속성','icon':'인스턴스 교체','orientation':'배치 방향','scenario':'사용 시나리오','action':'핵심 과업','context':'사용 맥락','place':'전역 탐색','shortcuts':'점진적 공개','question':'컴포넌트 속성','condition':'제약 조건 (Constraint)','readonlynotice':'읽기 전용','busylabel':'로딩','dangerlabel':'파괴적 동작','closelabel':'행동 중심 레이블','undolabel':'실행 취소'}
component_property_map = {k: {'label': v, 'termId': exact(v) if v in by_name else term(v)} for k,v in component_props.items()}
supplement = OUT / 'property-label-supplement.json'
if supplement.exists():
    component_property_map.update(json.loads(supplement.read_text())['names'])
contract = {'version':'1.0.0','adoptedAt':'2026-10-02','vocabularySource':'../../../docs/웹앱_설계_용어사전.md',
            'nodeTypes':node_types,'nativeProperties':properties,'componentPropertyNames':component_property_map,
            'states':{k:{'label':v,'termId':term(v)} for k,v in states.items()},
            'fallback':{'label':'컴포넌트 속성','termId':term('컴포넌트 속성'),'status':'specific-semantic-label-unverified'},
            'axes':['file-containment','product-context','atomic-composition','vocabulary-concept','property','state','value','code-responsibility'],
            'source':{'figma':'https://help.figma.com/hc/en-us/articles/39747637290263-Components-collection-Tips-for-component-management',
                      'atomic':'https://atomicdesign.bradfrost.com/chapter-2/','skos':'https://www.w3.org/TR/skos-reference/',
                      'dtcg':'https://www.designtokens.org/tr/2025.10/format/'}}
write('contract.json',contract)
write('vocabulary.json',{'version':'1.0.0','source':str(SOURCE.relative_to(ROOT)),
                       'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'count':len(terms),
                       'categories':categories,'terms':terms,'relationScope':'SKOS-inspired vocabulary index; containment is kept separately, not RDF conformance certification.'})

rows=[]
role_labels=json.loads((OUT/'component-role-labels.json').read_text())
for filename in ['component-api-map.json','component-api-delta.json']:
    data=json.loads((APP/'docs/figma-observatory-20261002/reconciliation-20261002'/filename).read_text())
    for original in data['rows']:
        code=original['code'];source=APP/code['source']
        current_hash=hashlib.sha256(source.read_bytes()).hexdigest() if source.exists() else None
        name=original['name']
        role=role_labels.get(name, {'label': '컴포넌트 / ' + name, 'termId': term('컴포넌트'), 'status': 'specific-role-unverified'})
        assert role['termId'] in {t['id'] for t in terms}, role
        rows.append({'id':original['id'],'name':name,'roleLabel':role['label'],'roleStatus':role.get('status', 'verified-project-role'),'termIds':[role['termId']],
                     'figma':original['figma'],'code':{'source':code['source'],'line':code.get('line'),
                     'props':code.get('customProperties',[]),'capturedSha256':code.get('sha256'),
                     'currentSha256':current_hash,'matchesCapturedSource':current_hash==code.get('sha256')},
                     'scope':'actual existing source identifiers preserved; Figma representation and runtime behavior are separate'})
write('code-map.json',{'count':len(rows),'rows':rows,
    'responsibilities':[{'path':'src/ui','terms':['사용자 인터페이스','상호작용 설계','컴포넌트','접근성']},
                        {'path':'src/domain','terms':['도메인 데이터','제약 조건','유효성 검사']},
                        {'path':'src/data','terms':['영속성','브라우저 저장소','초안','동기화','충돌','복구']},
                        {'path':'src/server','terms':['서버 상태','인증','인가','서버 검증','객체 수준 권한']},
                        {'path':'tools/tests','terms':['인수 기준','회귀 테스트','검증 증거']},
                        {'path':'docs','terms':['정보 구조','명명 체계','개발 전달','인계 문서']}],
    'note':'Directory responsibilities are educational scope labels. No claim of exhaustive semantic annotation of every source symbol.'})
print(json.dumps({'terms':len(terms),'categories':len(categories),'nativeProperties':len(properties),'nodeTypes':len(node_types),'sourceComponents':len(rows)},ensure_ascii=False))
