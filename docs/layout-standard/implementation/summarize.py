import json,pathlib,hashlib,collections
p=pathlib.Path('generation2/docs/layout-standard/implementation');ev=p/'evidence'
ds={f.name:json.loads(f.read_text()) for f in sorted(ev.glob('*.json'))}
base={};special={};embedded={}
for name,d in ds.items():
 if name.startswith(('north-','west-','east-','south-','ceiling-')):
  for r in d.get('results',[]):base[r['id']]={**r,'pageId':d['pageId']}
 if name.startswith('special-'):
  for r in d.get('results',[]):special[r['id']]={**r,'pageId':d['pageId']}
 if name.startswith('embedded-'):
  for r in d.get('results',[]):embedded[r['entityId']]=r
payload=json.loads((p/'payload.json').read_text());patterns=json.loads((p/'pattern-map.json').read_text());scope=json.loads((p/'specialized-scope.json').read_text())
coverage={}
for key,entity in payload['entities'].items():
 existing=[r for r in base.values() if r['name'].startswith(key+'@') or r['name'].startswith(key+' ')]
 coverage[key]={**entity,'mode':'existing-frames' if existing else 'new-layout-projection','frames':existing or [embedded[key]],'runtimeCertified':False}
pending=[{'pageId':page['pageId'],'targets':[dict(f,pattern='L194' if f['pattern']=='L075' else f['pattern']) for f in page['frames'] if f['id'] not in special]} for page in scope]
pending=[x for x in pending if x['targets']]
future=ds['future.json']['examples'];states=ds['states.json']['examples']
assert len(patterns)==28 and len(coverage)==111 and len(embedded)==28 and len(future)==24 and len(states)==6
assert len(base)==166 and len(special)==113 and all(r['preserved'] for r in [*base.values(),*special.values()])
assert all(e['primaryPattern'] in patterns for e in coverage.values())
summary={'status':'partial-remote-limit','fileKey':payload['fileKey'],'templatePageId':'250:180','regionId':'250:181','patternSets':patterns,'futureExamples':future,'stateExamples':states,'existingFrames':len(base),'existingEntities':sum(x['mode']=='existing-frames' for x in coverage.values()),'newEntityProjections':len(embedded),'specializedFrames':len(special),'changedExistingFrames':len(base)+len(special),'currentEntityCoverage':len(coverage),'pendingSpecializedFrames':sum(len(x['targets']) for x in pending),'pendingValidations':['All template variant bindings/bounds and long Korean content growth','Top-level board overlap and descendant overflow readback','Task-specific input labels/examples in templates; input reuses original study-record component','Remaining specialized screens and advanced state frames','Desktop sync warning clearance; full post-change remote visual check'],'runtimeOrDeployment':False,'glyphScale95NativeAppliedToAllTemplates':False,'preservationEvidence':'Before/after exact text, original instance main component IDs and reactions for 279 existing frames; intrinsic vector/line/ellipse/rectangle local geometry for 113 specialized frames','visualEvidence':['evidence/template-pilot.png','evidence/current-math-surface.png','evidence/current-record-screen.png'],'visualLimits':['Pilot L037 and U31 wide/narrow inspected; not all 28 sets certified','Existing record screenshot includes preserved educational annotations and intentional prototype viewport clipping','Desktop showed pending sync warning; no new desktop design edits intentionally made']}
for name,data in [('figma-manifest.json',summary),('current-coverage.json',coverage),('pending.json',pending)]: (p/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
verification={'counts':{k:summary[k] for k in ['existingFrames','existingEntities','newEntityProjections','specializedFrames','changedExistingFrames','currentEntityCoverage','pendingSpecializedFrames']},'allPreservationChecksPassed':True,'localCoverageChecksPassed':True,'fullRemoteAuditPassed':False,'sourceFiles':{str(f.relative_to(p)):hashlib.sha256(f.read_bytes()).hexdigest() for f in [p/'payload.json',p/'pattern-map.json',p/'reconcile.js',p/'specialized.js',p/'embedded.js',p/'templates.js']},'remoteBlocker':'Figma MCP tool call limit for Full seat on Professional plan','runtimeChanged':False}
(p/'verification.json').write_text(json.dumps(verification,ensure_ascii=False,indent=2)+'\n')
s=json.loads((p/'state.json').read_text());s['step']='partial-remote-limit';s['status']='partial';s['createdNodeIds']=list(dict.fromkeys(n for d in ds.values() for n in d.get('createdNodeIds',[])));s['mutatedNodeIds']=list(dict.fromkeys(n for d in ds.values() for n in d.get('mutatedNodeIds',[])));s['completedScreens']={**base,**special};s['mutationEvidence']=['evidence/'+name for name in ds];s['newEntityProjections']=embedded;s['pendingFile']='pending.json';s['pendingValidations']=summary['pendingValidations'];s['summary']=verification['counts'];s['remoteBlocker']=verification['remoteBlocker']
for path in [p/'state.json',pathlib.Path('/tmp/design-system-state-os-layout-implementation-20261002.json')]:path.write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(verification['counts'],ensure_ascii=False));print('Pending pages',[(x['pageId'],len(x['targets'])) for x in pending])

