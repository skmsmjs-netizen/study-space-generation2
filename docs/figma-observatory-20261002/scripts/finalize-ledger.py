# -*- coding: utf-8 -*-
import json, datetime, pathlib
p=pathlib.Path(__file__).resolve().parent.parent
read=lambda f: json.loads((p/f).read_text(encoding='utf-8'))
s=read('figma-state.json'); r=read('evidence/final-remote-readback.json'); idx=read('evidence/index.json'); fl=read('evidence/flows.json')
nav=[read('evidence/navigation-'+n+'.json') for n in ['desk','global','library','wall','workbench']]
s.update(step='figma-design-mapping-complete',pendingValidations=[],blockedBy=None,updatedAt=datetime.datetime.now(datetime.timezone.utc).isoformat())
s.pop('remoteWrites',None)
steps=['155-responsive-screen-frames','169-blocks-including-material-memo','155-screen-structure-readback-zero-overflow','14-flows-74-steps-62-references','1086-design-navigation-links-read-back','354-index-bindings-read-back','31-adopted-sources-and-8-styles','81-variables-and-10-pages-read-back','representative-native-screenshots-reviewed']
s['completedSteps']=list(dict.fromkeys(s['completedSteps']+steps))
s['entities'].update(indexBoards=idx['boards'],flowBoards={k:v['id'] for k,v in fl['flowMap'].items()},variablesCount=r['variablesCount'],screenFrames=155,directBlocks=169,supplementalMemoState='33:9138',navigation={k:sum(x['counts'][k] for x in nav) for k in ['controls','linked','native','url','skipped','unresolved']})
s['currentTaskScope'].update(routes=41,modals=29,surfaces=41,sourceModules=104,reachableModules=103,directScreenEntities=83,reusedSurfaces=28,screens=155,components=48,componentVariants=120,states=42,stateTransitions=32,flows=14,researchSources=121,researchDomains=20,originalInstagram=31,designStyles=8,runtimeAppWrites=0,deployments=0)
s['separateRemaining']=[
'실제 웹앱에 새 Figma 설계를 구현하고 서버 연결, 기기 조작, 배포하는 일은 이번 설계 대응과 별도이다.',
'Figma 장면은 전체 원본 SVG의 정적 견본이다. 시간, GPU, 음성, 실제 저장 상태를 실행하지 않는다.',
'Instagram L16/L25/L27 영상과 음성 및 캡션, L14 작은 본문, L01 외 캡션의 기존 읽기 잔여를 유지한다.',
'Pro 환경에서 published Code Connect는 실행하지 않았다. 소스 경로와 실제 Figma 노드는 대응표로 연결했다.']
s['sourceDriftReview']={'at':'2026-10-02','App.tsx':'104개 TSX 범위, 18개 메뉴, 모달 유지. R23 자료 곁 메모 누락 보완.','quick-memos.tsx':'MouseEvent import 및 편집기를 열기 전 focus({preventScroll:true}) 두 곳만 기준과 다름. 기존 O24 복귀 계약 범위이며 새 엔터티 없음.'}
(p/'figma-state.json').write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'step':s['step'],'navigation':s['entities']['navigation']},ensure_ascii=False))

