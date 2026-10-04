"""Reuse the previously read Riley edition; no model calls or user-record writes."""
import json, re, hashlib, unicodedata
from pathlib import Path

APP = Path(__file__).resolve().parents[1]
ROOT = APP.parent
READ = ROOT / 'tmp/pdfs/mathematical-methods-read'
OUT = APP / 'src/content/riley'
OUT.mkdir(parents=True, exist_ok=True)
chapters = json.loads((READ / 'concept-map-data.json').read_text())['chapters']
coverage = json.loads((READ / 'chapter-coverage.json').read_text())
sections = []
for chapter in chapters:
    text = (READ / f"chapter-{chapter['n']:02d}-overview.txt").read_text()
    for match in re.finditer(r'\[(\d+\.\d+) (.*?); print (\d+); PDF (\d+)\]\n(.*?)(?=\n\[excerpt ends\])', text, re.S):
        number, title, printed, pdf, excerpt = match.groups()
        if re.search('Exercises|Hints and answers', title, re.I):
            continue
        sections.append(dict(id='riley-3e-section-' + number, number=number, chapter=chapter['n'], title=unicodedata.normalize('NFKC', title), printed=int(printed), pdf=int(pdf), excerpt=excerpt.strip(), excerptKind='previously-read-extracted-text'))
# The mathematical title was split in the original TOC/excerpt extraction.
body = (READ / 'page-0971.txt').read_text()
start = body.index('26.8 The tensors')
sections.append(dict(id='riley-3e-section-26.8', number='26.8', chapter=26, title='The tensors δij and ϵijk', printed=941, pdf=971, excerpt=body[start:start+1100], excerptKind='source-page-extracted-text'))
sections.sort(key=lambda s: tuple(map(int, s['number'].split('.'))))
live = {
 '4.2': 'geometric', '4.3': 'geometric', '3.2': 'complex', '3.3': 'complex',
 '7.6': 'vectors', '8.4': 'matrix', '8.9': 'matrix', '8.13': 'eigen',
 '8.14': 'eigen', '8.16': 'eigen', '12.2': 'fourier', '12.4': 'fourier',
 '15.1': 'ode', '20.4': 'wave', '20.5': 'diffusion', '21.2': 'wave',
 '22.1': 'variation', '26.8': 'epsilon', '27.1': 'newton', '28.2': 'cyclic',
 '30.2': 'bayes', '30.8': 'binomial', '31.2': 'statistics', '31.6': 'least-squares'
}
static_words = re.compile(r'notation|definition|need for|concluding remarks|scalars and vectors|vector spaces|types of|venn diagrams|experiments, samples and populations|sets of functions', re.I)
for i, section in enumerate(sections):
    chapter = chapters[section['chapter']-1]
    following = [s['printed'] for s in sections[i+1:] if s['chapter']==section['chapter']]
    section['printedEnd'] = max(section['printed'], (following[0]-1) if following else chapter['end'])
    section['pdfEnd'] = section['printedEnd']+30
    section['scene'] = live.get(section['number'])
    if section['scene']:
        section['classification'] = '부분 대응'
        section['reason'] = '해당 관계의 제한된 계산 사례를 실제 조절할 수 있습니다. 이 절의 모든 대상·방법을 자동 계산하는 도구는 아닙니다.'
    elif static_words.search(section['title']):
        section['classification'] = '정적 설명 적합'
        section['reason'] = '정의·범위·표현의 역할을 원문과 함께 읽습니다. 수치 조절을 요구하지 않습니다.'
    else:
        section['classification'] = '추가 구현 필요'
        section['reason'] = '절과 원문·장 맥락은 연결했습니다. 이 절의 구체적인 계산·관계 구성과 적용 조건은 별도 구현·검증이 필요합니다.'
    section['implementation'] = 'source-reader-and-chapter-context' + ('+bounded-live-example' if section['scene'] else '')

# Nested headings and equation mentions are a separate discovery index. A mention
# is not asserted to be the equation's defining location or an implemented scene.
headings, equations = {}, {}
for c in coverage:
    for pdf in range(c['pdf_start'], c['pdf_end']+1):
        text = (READ / f'page-{pdf:04d}.txt').read_text()
        for match in re.finditer(r'(?m)^(\d+\.\d+\.\d+)\s+([^\n]{3,160})$', text):
            if int(match[1].split('.')[0]) != c['chapter']: continue
            parent = '.'.join(match[1].split('.')[:2])
            if not any(s['number']==parent for s in sections): continue
            headings.setdefault(match[1], dict(id='riley-3e-subsection-'+match[1], number=match[1], title=unicodedata.normalize('NFKC', match[2]), parent='riley-3e-section-'+parent, detectedPdf=pdf, detectedPrinted=pdf-30, classification='판단 보류', reason='추출 본문에서 발견한 세부 제목입니다. 절 내부의 의미·정확한 위치와 개별 관찰 적합성 대조가 필요합니다.'))
        for match in re.finditer(r'\((\d+\.\d+)\)', text):
            if int(match[1].split('.')[0]) != c['chapter']: continue
            equations.setdefault(match[1], dict(id='riley-3e-equation-mention-'+match[1], number=match[1], detectedPdf=pdf, detectedPrinted=pdf-30, classification='판단 보류', reason='식 번호의 본문 출현 위치입니다. 참조와 정의 위치를 구별하고 식·조건을 시각 대조하기 전에는 개별 관찰 완료로 세지 않습니다.'))
atlas_original = json.loads((ROOT/'work/20261002-math-observatory-figma/atlas-data.json').read_text())
node_chapters = {'Algebra':[1], 'Calculus':[2], 'Complex':[3,4], 'Series':[4], 'Partial':[5], 'Multiple':[6], 'Vector':[7], 'Matrix':[8], 'Eigen':[8], 'Modes':[9], 'Fields':[10], 'Integrals':[11], 'ODE':[14,15], 'SeriesSolve':[16], 'Fourier':[12], 'Transform':[13], 'Convolution':[13], 'Linear':[8], 'Eigenfunctions':[17], 'Special':[18], 'Quantum':[19], 'PDE':[20], 'Boundary':[20], 'Separation':[21], 'Green':[21], 'IntegralEq':[23], 'Variation':[22], 'Analytic':[24], 'Contour':[24], 'Potential':[25], 'Inversion':[25], 'Asymptotic':[25], 'Coordinates':[7,10], 'Tensor':[26], 'Group':[28], 'Representation':[29], 'States':[9,19,29], 'Approx':[4,8,15], 'Roots':[27], 'Quadrature':[27], 'Discrete':[27], 'Probability':[30], 'Distribution':[30], 'Generating':[30], 'Sampling':[31], 'Estimation':[31], 'Fitting':[31], 'Testing':[31]}
atlas = [{'id':f'riley-existing-map-{i}', 'title':m['title'], 'subtitle':m['subtitle'], 'nodes':[{'id':n['key'],'label':n['title'],'detail':n['body'],'chapters':node_chapters[n['key']]} for n in m['nodes']], 'relations':[{'id':e['id'],'from':e['source'],'to':e['target'],'label':e['label']} for e in m['edges']]} for i,m in enumerate(atlas_original)]
assert set(c for m in atlas for n in m['nodes'] for c in n['chapters'])==set(range(1,32))
assert len(chapters)==31 and len(sections)==248
assert len({s['id'] for s in sections})==len(sections)
source = Path(json.loads((READ/'reading-status.json').read_text())['source'])
manifest = dict(version='1.0.0', title='Mathematical Methods for Physics and Engineering', edition='Third edition, 2006', sourcePath=str(source), pdfPages=1363, bodyPageOffset=30, previouslyReadOn='2026-10-01', sourceAccess=source.exists(), scope=dict(chapters=31, mainSections=248, nestedHeadingCandidates=len(headings), equationMentionCandidates=len(equations)), sectionRangeMethod='시작 쪽은 기존 독해 목록과 원문 대조. 종료 쪽은 다음 주요 절의 시작을 이용한 추정이며 공유 페이지와 문항 구간을 별도 확인해야 합니다.', sourceInterpretation='원문 발췌는 추출 텍스트입니다. 분수·첨자·도형의 정확한 조판은 PDF 원문에서 확인해야 합니다.', separateWorkedSolutions='미첨부·미열람', classificationMeaning='자료의 대응 상태이며 사용자 이해도·숙달·공부 완료를 뜻하지 않습니다.')
data = dict(manifest=manifest, chapters=chapters, sections=sections, atlas=atlas)
(OUT/'catalog.json').write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
work=APP/'work/riley-observations-20261003'; work.mkdir(parents=True, exist_ok=True)
discovery = dict(subsections=list(headings.values()),equationMentions=list(equations.values()))
(work/'discovery-index.json').write_text(json.dumps(discovery, ensure_ascii=False, indent=2)+'\n')
(OUT/'discovery.json').write_text(json.dumps(discovery, ensure_ascii=False, indent=2)+'\n')
(work/'coverage.json').write_text(json.dumps(dict(**manifest, mainSections=sections), ensure_ascii=False, indent=2)+'\n')
print(json.dumps(manifest,ensure_ascii=False))
