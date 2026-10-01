import { FlowControls } from './flow-controls';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ReactFlow,
  MarkerType,
  SelectionMode,
  type Node,
  type Edge,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { MaterialMap as MapContent } from '../domain/material-learning';
import { Button, Input, Select } from './index';
import { flowPreferencesKey, useFlowPreferences } from '../data/flow-preferences';
import { FlowExperience, flowAriaLabels, flowSnapGrid, flowEdgeType } from './flow-experience';
import { layoutFlowBoxes } from '../domain/flow-layout';
import type { AppState } from '../domain/model';
export function MaterialMap({
  map,
  originalMap,
  disabled,
  onChange,
  evidence,
  onCanvas,
  owner,
}: {
  owner: Pick<AppState, 'namespace' | 'userId'>;
  map: MapContent;
  originalMap?: MapContent;
  disabled: boolean;
  onChange: (map: MapContent) => void;
  evidence: (ids: string[]) => ReactNode;
  onCanvas: () => Promise<void>;
}) {
  const tools = useFlowPreferences(flowPreferencesKey(owner, 'material-map'));
  const flow = useRef<ReactFlowInstance | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selected, setSelected] = useState(''),
    [canvasBusy, setCanvasBusy] = useState(false);
  const nodes = useMemo<Node[]>(
    () =>
      map.nodes.map((n, i) => ({
        id: n.id,
        data: { label: n.label },
        position: map.positions?.[n.id] ?? { x: (i % 4) * 260, y: Math.floor(i / 4) * 160 },
        ariaLabel: `개념 ${n.label}`,
        style: {
          width: 240,
          whiteSpace: 'pre-wrap' as const,
          overflowWrap: 'anywhere' as const,
          color: 'var(--color-text)',
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        },
      })),
    [map],
  );
  const edges: Edge[] = map.edges.map((e) => ({
    id: e.id,
    type: flowEdgeType(tools.value.edgeStyle),
    source: e.from,
    target: e.to,
    label: e.label,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'var(--color-muted)' },
    labelStyle: { fill: 'var(--color-text)' },
    labelBgStyle: { fill: 'var(--color-surface)' },
  }));
  const move = (id: string, axis: 'x' | 'y', value: string) => {
    const n = Number(value),
      i = map.nodes.findIndex((row) => row.id === id);
    if (!value || !Number.isFinite(n) || Math.abs(n) > 1e6) return;
    const current = map.positions?.[id] ?? { x: (i % 4) * 260, y: Math.floor(i / 4) * 160 };
    onChange({ ...map, positions: { ...map.positions, [id]: { ...current, [axis]: n } } });
  };
  const node = map.nodes.find((n) => `node:${n.id}` === selected),
    edge = map.edges.find((e) => `edge:${e.id}` === selected);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [measurements, setMeasurements] = useState<
    Record<string, { width: number; height: number }>
  >({});
  // biome-ignore lint/correctness/useExhaustiveDependencies(map.positions): Committed map positions clear only temporary drag coordinates.
  useEffect(() => {
    setPositions({});
  }, [map.positions]);
  const handleSelection = useCallback(({ nodes }: { nodes: Node[] }) => {
    const ids = nodes.map((node) => node.id);
    setSelectedIds((previous) =>
      JSON.stringify(previous) === JSON.stringify(ids) ? previous : ids,
    );
    if (ids.length === 1) setSelected(`node:${ids[0]}`);
  }, []);
  const visible = nodes.map((n) => ({
    ...n,
    measured: measurements[n.id],
    position: positions[n.id] ?? n.position,
    selected: selectedIds.includes(n.id),
  }));
  return (
    <section className="material-map" aria-label="자료 개념도">
      <div className="material-map-surface">
        <ReactFlow<Node, Edge>
          onInit={(instance) => {
            flow.current = instance;
          }}
          nodes={visible}
          edges={edges}
          fitView
          nodesDraggable={!disabled}
          nodesConnectable={false}
          onNodeClick={(_, n) => setSelected(`node:${n.id}`)}
          onEdgeClick={(_, e) => setSelected(`edge:${e.id}`)}
          onSelectionChange={handleSelection}
          onNodesChange={(changes) => {
            const moved: Record<string, { x: number; y: number }> = {};
            const committed: Record<string, { x: number; y: number }> = {};
            const measured: Record<string, { width: number; height: number }> = {};
            for (const c of changes)
              if (c.type === 'position' && c.position) {
                moved[c.id] = c.position;
                if (!c.dragging) committed[c.id] = c.position;
              } else if (c.type === 'dimensions' && c.dimensions) {
                measured[c.id] = c.dimensions;
              } else if (c.type === 'select')
                setSelectedIds((previous) =>
                  c.selected
                    ? [...new Set([...previous, c.id])]
                    : previous.filter((id) => id !== c.id),
                );
            if (Object.keys(moved).length) setPositions((p) => ({ ...p, ...moved }));
            if (Object.keys(measured).length)
              setMeasurements((previous) =>
                Object.entries(measured).some(
                  ([id, size]) =>
                    previous[id]?.width !== size.width || previous[id]?.height !== size.height,
                )
                  ? { ...previous, ...measured }
                  : previous,
              );
            if (
              !disabled &&
              Object.entries(committed).some(
                ([id, point]) => JSON.stringify(map.positions?.[id]) !== JSON.stringify(point),
              )
            )
              onChange({ ...map, positions: { ...map.positions, ...committed } });
          }}
          deleteKeyCode={null}
          zoomOnDoubleClick={false}
          ariaLabelConfig={flowAriaLabels}
          selectionMode={SelectionMode.Partial}
          selectionOnDrag={tools.value.mode === 'select'}
          panOnDrag={tools.value.mode === 'move' ? true : [1, 2]}
          snapToGrid={tools.value.snap}
          snapGrid={flowSnapGrid}
          minZoom={0.1}
          maxZoom={2}
        >
          <FlowExperience
            tools={tools}
            count={nodes.length}
            selectedIds={selectedIds}
            name="개념도"
          />
          <FlowControls aria-label="자료 개념도 보기 조절" showInteractive={false} />
        </ReactFlow>
      </div>
      {tools.error && (
        <div role="alert">
          <p>{tools.error}</p>
          <Button onClick={() => tools.store(tools.value)}>보기 도구 저장 다시 시도</Button>
          <Button onClick={tools.reset}>보기 도구 초기화</Button>
        </div>
      )}
      <Select
        label="개념·관계 선택"
        value={selected}
        onChange={(event) => {
          setSelected(event.target.value);
          const id = event.target.value.startsWith('node:') ? event.target.value.slice(5) : '';
          setSelectedIds(id ? [id] : []);
          if (id) void flow.current?.fitView({ nodes: [{ id }], padding: 0.3, maxZoom: 1.2 });
        }}
      >
        <option value="">선택 해제</option>
        {map.nodes.map((node) => (
          <option key={`node:${node.id}`} value={`node:${node.id}`}>
            개념 · {node.label}
          </option>
        ))}
        {map.edges.map((edge) => (
          <option key={`edge:${edge.id}`} value={`edge:${edge.id}`}>
            관계 · {edge.label}
          </option>
        ))}
      </Select>
      <div className="material-actions">
        <Button
          disabled={disabled || canvasBusy}
          onClick={() => {
            const measured = flow.current?.getNodes() ?? visible;
            const arranged = layoutFlowBoxes(
              measured.map((node) => ({
                id: node.id,
                position: node.position,
                width: node.measured?.width ?? 240,
                height: node.measured?.height ?? 90,
              })),
              map.edges.map((edge) => ({ source: edge.from, target: edge.to })),
            );
            onChange({ ...map, positions: { ...map.positions, ...arranged } });
          }}
        >
          연결을 따라 배치
        </Button>
        <Button
          disabled={disabled || canvasBusy}
          onClick={async () => {
            setCanvasBusy(true);
            try {
              await onCanvas();
            } finally {
              setCanvasBusy(false);
            }
          }}
        >
          {canvasBusy ? 'Canvas에 보관 중…' : '이 개념도를 Canvas에 추가'}
        </Button>
        {originalMap && (
          <Button
            disabled={disabled || canvasBusy}
            onClick={() => onChange(structuredClone(originalMap))}
          >
            처음 개념도로 되돌리기
          </Button>
        )}
      </div>
      {node && (
        <>
          <Input
            label="개념 이름"
            value={node.label}
            disabled={disabled}
            maxLength={1000}
            onChange={(e) =>
              onChange({
                ...map,
                nodes: map.nodes.map((n) =>
                  n.id === node.id ? { ...n, label: e.target.value } : n,
                ),
              })
            }
          />
          <div className="material-target">
            {(['x', 'y'] as const).map((axis) => (
              <Input
                key={axis}
                label={axis === 'x' ? '개념 가로 위치' : '개념 세로 위치'}
                type="number"
                min={-1000000}
                max={1000000}
                value={
                  map.positions?.[node.id]?.[axis] ??
                  (axis === 'x'
                    ? (map.nodes.indexOf(node) % 4) * 260
                    : Math.floor(map.nodes.indexOf(node) / 4) * 160)
                }
                disabled={disabled}
                onChange={(event) => move(node.id, axis, event.target.value)}
              />
            ))}
          </div>
          {evidence(node.sourceIds)}
        </>
      )}
      {edge && (
        <>
          <Input
            label="관계 설명"
            value={edge.label}
            disabled={disabled}
            maxLength={300}
            onChange={(e) =>
              onChange({
                ...map,
                edges: map.edges.map((row) =>
                  row.id === edge.id ? { ...row, label: e.target.value } : row,
                ),
              })
            }
          />
          {evidence(edge.sourceIds)}
        </>
      )}
      <details>
        <summary>개념과 관계를 글로 확인·수정</summary>
        {map.nodes.map((n) => (
          <div key={n.id}>
            <Input
              label={`개념 ${n.id}`}
              value={n.label}
              maxLength={1000}
              disabled={disabled}
              onChange={(e) =>
                onChange({
                  ...map,
                  nodes: map.nodes.map((row) =>
                    row.id === n.id ? { ...row, label: e.target.value } : row,
                  ),
                })
              }
            />
            {evidence(n.sourceIds)}
          </div>
        ))}
        {map.edges.map((e) => (
          <div key={e.id}>
            <p>
              {map.nodes.find((n) => n.id === e.from)?.label} →{' '}
              {map.nodes.find((n) => n.id === e.to)?.label}
            </p>
            <Input
              label={`관계 ${e.id}`}
              value={e.label}
              disabled={disabled}
              maxLength={300}
              onChange={(event) =>
                onChange({
                  ...map,
                  edges: map.edges.map((row) =>
                    row.id === e.id ? { ...row, label: event.target.value } : row,
                  ),
                })
              }
            />
            {evidence(e.sourceIds)}
          </div>
        ))}
      </details>
      <p className="material-hint">
        개념을 끌어 배치하거나 이름과 관계를 수정할 수 있습니다. 자료 저장을 누르면 수정과 배치를
        보관합니다. Canvas에 추가할 때 기존 카드와 배치를 유지합니다.
      </p>
    </section>
  );
}
