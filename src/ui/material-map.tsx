import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ReactFlow, Background, Controls, MarkerType, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { MaterialMap as MapContent } from '../domain/material-learning';
import { Button, Input } from './index';
export function MaterialMap({ map, originalMap, disabled, onChange, evidence, onCanvas }: {
  map: MapContent; originalMap?: MapContent; disabled: boolean; onChange: (map: MapContent) => void;
  evidence: (ids: string[]) => ReactNode; onCanvas: () => Promise<void>;
}) {
  const [selected, setSelected] = useState(''), [canvasBusy, setCanvasBusy] = useState(false);
  const nodes = useMemo(() => map.nodes.map((n, i) => ({ id: n.id, data: { label: n.label }, position: map.positions?.[n.id] ?? { x: i % 4 * 260, y: Math.floor(i / 4) * 160 }, style: { color: 'var(--color-text)', background: 'var(--color-surface)', borderColor: 'var(--color-border)' } })), [map]);
  const edges = map.edges.map(e => ({ id: e.id, source: e.from, target: e.to, label: e.label, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: 'var(--color-muted)' }, labelStyle: { fill: 'var(--color-text)' }, labelBgStyle: { fill: 'var(--color-surface)' } }));
  const move = (id: string, axis: 'x' | 'y', value: string) => { const n = Number(value), i = map.nodes.findIndex(row => row.id === id); if (!value || !Number.isFinite(n) || Math.abs(n) > 1e6) return; const current = map.positions?.[id] ?? {x:i % 4 * 260,y:Math.floor(i / 4) * 160}; onChange({...map,positions:{...map.positions,[id]:{...current,[axis]:n}}}); };
  const node = map.nodes.find(n => n.id === selected), edge = map.edges.find(e => e.id === selected);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  useEffect(() => { setPositions({}); }, [map.positions]);
  const visible = nodes.map(n => ({ ...n, position: positions[n.id] ?? n.position }));
  return <section className="material-map" aria-label="자료 개념도">
    <div className="material-map-surface"><ReactFlow nodes={visible} edges={edges} fitView nodesDraggable={!disabled} nodesConnectable={false}
      onNodeClick={(_, n) => setSelected(n.id)} onEdgeClick={(_, e) => setSelected(e.id)}
      onNodesChange={changes => { const moved: Record<string, { x: number; y: number }> = {}; for (const c of changes) if (c.type === 'position' && c.position) moved[c.id] = c.position; if (Object.keys(moved).length) setPositions(p => ({ ...p, ...moved })); }}
      onNodeDragStop={(_, n: Node) => { onChange({ ...map, positions: { ...map.positions, [n.id]: n.position } }); }}
      minZoom={0.1} maxZoom={2}><Background/><Controls showInteractive={false}/></ReactFlow></div>
    <div className="material-actions"><Button disabled={disabled || canvasBusy} onClick={async () => { setCanvasBusy(true); try { await onCanvas(); } finally { setCanvasBusy(false); } }}>{canvasBusy ? 'Canvas에 보관 중…' : '이 개념도를 Canvas에 추가'}</Button>{originalMap && <Button disabled={disabled || canvasBusy} onClick={() => onChange(structuredClone(originalMap))}>처음 개념도로 되돌리기</Button>}</div>
    {node && <><Input label="개념 이름" value={node.label} disabled={disabled} maxLength={1000} onChange={e => onChange({ ...map, nodes: map.nodes.map(n => n.id === node.id ? { ...n, label: e.target.value } : n) })}/><div className="material-target">{(['x','y'] as const).map(axis => <Input key={axis} label={axis==='x'?'개념 가로 위치':'개념 세로 위치'} type="number" min={-1000000} max={1000000} value={map.positions?.[node.id]?.[axis] ?? (axis==='x' ? map.nodes.indexOf(node)%4*260 : Math.floor(map.nodes.indexOf(node)/4)*160)} disabled={disabled} onChange={event=>move(node.id,axis,event.target.value)}/>)}</div>{evidence(node.sourceIds)}</>}
    {edge && <><Input label="관계 설명" value={edge.label} disabled={disabled} maxLength={300} onChange={e => onChange({ ...map, edges: map.edges.map(row => row.id === edge.id ? { ...row, label: e.target.value } : row) })}/>{evidence(edge.sourceIds)}</>}
    <details><summary>개념과 관계를 글로 확인·수정</summary>{map.nodes.map(n => <div key={n.id}><Input label={`개념 ${n.id}`} value={n.label} maxLength={1000} disabled={disabled} onChange={e => onChange({ ...map, nodes: map.nodes.map(row => row.id === n.id ? { ...row, label: e.target.value } : row) })}/>{evidence(n.sourceIds)}</div>)}
      {map.edges.map(e => <div key={e.id}><p>{map.nodes.find(n => n.id === e.from)?.label} → {map.nodes.find(n => n.id === e.to)?.label}</p><Input label={`관계 ${e.id}`} value={e.label} disabled={disabled} maxLength={300} onChange={event => onChange({...map,edges:map.edges.map(row=>row.id===e.id?{...row,label:event.target.value}:row)})}/>{evidence(e.sourceIds)}</div>)}</details>
    <p className="material-hint">개념을 끌어 배치하거나 이름과 관계를 수정할 수 있습니다. 자료 저장을 누르면 수정과 배치를 보관합니다. Canvas에 추가할 때 기존 카드와 배치를 유지합니다.</p>
  </section>;
}
