import { memo, useState } from 'react';
import {
  MiniMap,
  Panel,
  Background,
  BackgroundVariant,
  useReactFlow,
  useViewport,
  type AriaLabelConfig,
} from '@xyflow/react';
import { Button, Checkbox, Input, Select } from './index';
import type { useFlowPreferences } from '../data/flow-preferences';
import './flow-experience.css';

export const flowAriaLabels: Partial<AriaLabelConfig> = {
  'node.a11yDescription.default':
    'Enter 또는 Space로 선택하고 방향키로 이동할 수 있습니다. Escape로 선택을 해제합니다. 원문은 삭제되지 않습니다.',
  'node.a11yDescription.keyboardDisabled':
    'Enter 또는 Space로 선택하고 Escape로 선택을 해제합니다.',
  'node.a11yDescription.ariaLiveMessage': ({ direction, x, y }) =>
    `선택한 항목을 ${({ left: '왼쪽', right: '오른쪽', up: '위쪽', down: '아래쪽' } as Record<string, string>)[direction] ?? direction} 방향으로 옮겼습니다. 가로 ${Math.round(x)}, 세로 ${Math.round(y)}입니다.`,
  'edge.a11yDescription.default':
    'Enter 또는 Space로 관계를 선택하고 Escape로 선택을 해제합니다. 관계 수정은 선택 도구에서 할 수 있습니다.',
  'controls.ariaLabel': '보기 조절',
  'controls.zoomIn.ariaLabel': '확대',
  'controls.zoomOut.ariaLabel': '축소',
  'controls.fitView.ariaLabel': '전체 보기',
  'controls.interactive.ariaLabel': '항목 이동 잠금',
  'minimap.ariaLabel': '전체 위치 지도',
  'handle.ariaLabel': '연결점',
};
export const flowEdgeType = (style: string) => (style === 'bezier' ? 'default' : style);
export const flowSnapGrid: [number, number] = [24, 24];
export const FlowExperience = memo(function FlowExperience({
  tools,
  count,
  selectedIds = [],
  name,
  minZoom = 0.1,
  maxZoom = 2,
  onViewportCommit,
  minimapSize,
}: {
  tools: ReturnType<typeof useFlowPreferences>;
  count: number;
  selectedIds?: string[];
  name: string;
  minZoom?: number;
  maxZoom?: number;
  onViewportCommit?: () => void;
  minimapSize?: { width: number; height: number };
}) {
  const [open, setOpen] = useState(false);
  const [zoomDraft, setZoomDraft] = useState<string | null>(null);
  const flow = useReactFlow();
  const { zoom } = useViewport();
  const { value, store } = tools;
  const applyZoom = () => {
    const next = Number(zoomDraft);
    if (zoomDraft !== null && Number.isFinite(next) && next > 0) {
      void flow.zoomTo(Math.max(minZoom, Math.min(maxZoom, next / 100))).then(onViewportCommit);
      setZoomDraft(null);
    }
  };
  const minimap = value.minimap === 'show' || (value.minimap === 'auto' && count >= 24);
  return (
    <>
      {value.background !== 'none' && (
        <Background
          gap={24}
          color="var(--color-border)"
          variant={
            BackgroundVariant[
              value.background === 'dots'
                ? 'Dots'
                : value.background === 'lines'
                  ? 'Lines'
                  : 'Cross'
            ]
          }
        />
      )}
      <Panel position="top-right" className="flow-tools nodrag nopan nowheel">
        <Button variant="quiet" aria-expanded={open} onClick={() => setOpen(!open)}>
          {name} 보기 도구 · {Math.round(zoom * 100)}%
        </Button>
        {open && (
          <div className="flow-tools-body">
            <Input
              label="확대 비율 (%)"
              type="number"
              min={minZoom * 100}
              max={maxZoom * 100}
              value={zoomDraft ?? Math.round(zoom * 100)}
              onChange={(event) => setZoomDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  applyZoom();
                }
                if (event.key === 'Escape') setZoomDraft(null);
              }}
            />
            <Button
              disabled={
                zoomDraft === null ||
                !zoomDraft ||
                !Number.isFinite(Number(zoomDraft)) ||
                Number(zoomDraft) <= 0
              }
              onClick={applyZoom}
            >
              확대 비율 적용
            </Button>
            <Select
              label="전체 위치 지도"
              value={value.minimap}
              onChange={(event) =>
                store({ ...value, minimap: event.target.value as typeof value.minimap })
              }
            >
              <option value="auto">항목이 많을 때 자동</option>
              <option value="show">표시</option>
              <option value="hide">접기</option>
            </Select>
            <Select
              label="빈 공간 조작"
              value={value.mode}
              onChange={(event) =>
                store({ ...value, mode: event.target.value as typeof value.mode })
              }
            >
              <option value="move">화면 이동</option>
              <option value="select">여러 항목 선택</option>
            </Select>
            <Select
              label="배경 안내선"
              value={value.background}
              onChange={(event) =>
                store({ ...value, background: event.target.value as typeof value.background })
              }
            >
              <option value="dots">점</option>
              <option value="lines">격자</option>
              <option value="cross">십자</option>
              <option value="none">없음</option>
            </Select>
            <Select
              label="연결선 모양"
              value={value.edgeStyle}
              onChange={(event) =>
                store({ ...value, edgeStyle: event.target.value as typeof value.edgeStyle })
              }
            >
              <option value="smoothstep">모서리를 따라</option>
              <option value="step">직각 꺾임</option>
              <option value="bezier">부드러운 곡선</option>
              <option value="straight">직선</option>
            </Select>
            <Checkbox
              label="격자에 맞춰 옮기기"
              checked={value.snap}
              onChange={(event) => store({ ...value, snap: event.target.checked })}
            />
            <Button
              disabled={!selectedIds.length}
              onClick={() =>
                void flow
                  .fitView({
                    nodes: selectedIds.map((id) => ({ id })),
                    padding: 0.3,
                    maxZoom: 1.2,
                  })
                  .then(onViewportCommit)
              }
            >
              선택한 항목 보기
            </Button>
            <Button variant="quiet" onClick={tools.reset}>
              보기 도구 초기화
            </Button>
          </div>
        )}
      </Panel>
      {minimap && (
        <MiniMap
          style={minimapSize}
          position="bottom-right"
          pannable
          zoomable
          nodeColor="var(--color-muted)"
          nodeStrokeColor="var(--color-surface)"
          maskColor="var(--color-surface-inset)"
          ariaLabel="전체 위치 지도"
        />
      )}
    </>
  );
});
