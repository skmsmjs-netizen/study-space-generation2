from pathlib import Path
import shutil,json
app=Path(__file__).resolve().parents[1];rel=app/'work/riley-completion-20261003/release'
files=['src/domain/riley-observations.ts','src/domain/riley-extended-observations.ts','src/data/riley-observations.ts','src/data/riley-observations.test.ts','src/data/riley-notebook.ts','src/ui/riley-observatory.tsx','src/ui/riley-observatory.css','src/ui/riley-plot-gestures.ts','src/ui/riley-discovery.tsx','src/ui/riley-notebook.tsx','src/ui/riley-section-reading.tsx','src/ui/verified-source-reader.tsx','src/content/riley/section-plans.json','src/content/riley/discovery.json','src/interactive/math-physics/gestures.d.mts','src/interactive/math-physics/visibility.d.mts']
for f in files:(rel/f).parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(app/f,rel/f)
c=json.loads((app/'src/content/riley/catalog.json').read_text())
for s in c['sections']:s['excerpt']='원문은 이 기기에 연결한 PDF에서 읽는다. 공개 산출물에 본문 발췌를 포함하지 않는다.'
c['manifest']['sourcePath']='Mathematical Methods for Physics and Engineering.pdf';c['manifest']['sourceAccess']=False;c['manifest']['publication']='source-not-uploaded; verified-device-pdf'
(rel/'src/content/riley/catalog.json').write_text(json.dumps(c,ensure_ascii=False,indent=2)+'\n')
p=rel/'src/interactive/math-physics/presentation.d.mts';s=p.read_text() if p.exists() else ''
if 'function formatNumber' not in s:s+='\nexport function formatNumber(value:number):string;\n'
p.write_text(s)
p=rel/'src/ui/math-explorer.tsx';s=p.read_text()
if 'const RileyObservatory' not in s:
 s=s.replace('const LinearAlgebraObservations = lazy(',"const RileyObservatory = lazy(()=>import('./riley-observatory').then(m=>({default:m.RileyObservatory})));\nconst LinearAlgebraObservations = lazy(",1)
 s=s.replace('  const key = mathDraftKey(data);',"  const key = mathDraftKey(data);\n  const [rileyOpen,setRileyOpen]=useState(()=>new URLSearchParams(location.search).get('math')==='riley');",1)
 s=s.replace("useState(readingInitial.view.active === 'graph')", "useState(!rileyOpen && readingInitial.view.active === 'graph')")
 s=s.replace('        value={readingView.active}',"        value={rileyOpen?'riley':readingView.active}",1)
 s=s.replace('        onChange={(event) => {\n          const active = event.target.value as ReasoningView',"        onChange={(event) => {\n          if(event.target.value==='riley'){setRileyOpen(true);return;} setRileyOpen(false);\n          const active = event.target.value as ReasoningView",1)
 s=s.replace('        <option value="graph">함수와 공간곡선</option>', '        <option value="riley">수학교재 · 전체 관계와 관찰</option>\n        <option value="graph">함수와 공간곡선</option>',1)
 s=s.replace('      {readingError && (','      {rileyOpen && <Suspense fallback={<LoadingState message="수학교재 관찰을 여는 중이다."/>}><RileyObservatory key={key} data={data} repository={repository} onSaved={onSaved}/></Suspense>}\n      <Activity mode={rileyOpen?\'hidden\':\'visible\'}>\n      {readingError && (',1)
 i=s.rfind('    </section>');s=s[:i]+'      </Activity>\n'+s[i:];p.write_text(s)
p=rel/'src/App.tsx';s=p.read_text();marker='          {route === "/subjects" && (\n            <>'
if 'riley-subject-entry' not in s:
 assert marker in s
 orig=(app/'src/App.tsx').read_text();a=orig.index('              <p><a id="riley-subject-entry"');b=orig.index('\n',a)
 s=s.replace(marker,marker+'\n'+orig[a:b],1);p.write_text(s)
if not (rel/'node_modules').exists():(rel/'node_modules').symlink_to(app/'node_modules',target_is_directory=True)
(app/'work/riley-completion-20261003/release-files.json').write_text(json.dumps(files+['src/ui/math-explorer.tsx','src/App.tsx','src/content/riley/catalog.json','src/interactive/math-physics/presentation.d.mts'],indent=2))
print('isolated Riley-only release prepared; textbook body excluded')
