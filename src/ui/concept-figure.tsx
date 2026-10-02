import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  type Node,
  type NodeProps,
  type ReactFlowInstance,
  type Viewport,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button, Modal } from './index';
import { FlowControls } from './flow-controls';
import { flowAriaLabels } from './flow-experience';
import { useViewContext } from './use-view-context';
import type { AppState } from '../domain/model';
import type { ConceptFigure } from '../domain/concept-figure';
import './concept-figure.css';
import { ConceptText, conceptTextParts } from './concept-text';
/** Labels share the vector's coordinate system through a scaled HTML layer.
 * KaTeX remains real HTML/MathML without WebKit's nested foreignObject bug. */
function FigureSvg({ figure }: { figure: ConceptFigure }) {
  const mathLabel = conceptTextParts(figure.label).some((part) => part.explicit);
  const title = useId(),
    description = useId();
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    const measure = () => {
      // clientWidth excludes ReactFlow's zoom transform; the parent scales both layers.
      if (element.clientWidth > 0) setScale(element.clientWidth / figure.viewBox[2]);
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(element);
    return () => observer?.disconnect();
  }, [figure.viewBox[2]]);
  return (
    <div
      ref={frame}
      className="concept-figure-frame"
      style={{ aspectRatio: `${figure.viewBox[2]} / ${figure.viewBox[3]}` }}
    >
      <svg
        className="concept-figure-svg"
        viewBox={figure.viewBox.join(' ')}
        role="img"
        aria-labelledby={`${title} ${description}`}
      >
        <title id={title}>{mathLabel ? '개념 도해' : figure.label}</title>
        <desc id={description}>{figure.description}</desc>
        {figure.marks.map((mark) => {
          const props = { 'data-tone': mark.tone };
          if (mark.kind === 'circle')
            return (
              <circle
                key={mark.id}
                {...props}
                cx={mark.center[0]}
                cy={mark.center[1]}
                r={mark.radius}
              />
            );
          if (mark.kind === 'text') return null;
          const points = mark.points.map((point) => point.join(',')).join(' ');
          return mark.kind === 'polygon' ? (
            <polygon key={mark.id} {...props} points={points} />
          ) : (
            <polyline key={mark.id} {...props} points={points} />
          );
        })}
      </svg>
      <div className="concept-figure-label-layer">
        {figure.marks.map(
          (mark) =>
            mark.kind === 'text' && (
              <span
                key={mark.id}
                className="concept-figure-label"
                data-anchor={mark.anchor}
                data-tone={mark.tone}
                data-concept-text={mark.text}
                style={{
                  left: `${(100 * (mark.at[0] - figure.viewBox[0])) / figure.viewBox[2]}%`,
                  top: `${(100 * (mark.at[1] - figure.viewBox[1])) / figure.viewBox[3]}%`,
                  fontSize: `calc(var(--type-body-size) * ${scale})`,
                }}
              >
                <ConceptText text={mark.text} />
              </span>
            ),
        )}
      </div>
    </div>
  );
}

type FigureNode = Node<{ figure: ConceptFigure }, 'figure'>;
function FigureNodeView({ data }: NodeProps<FigureNode>) {
  return (
    <div
      className="concept-figure-vector"
      style={{ width: data.figure.viewBox[2], height: data.figure.viewBox[3] }}
    >
      <FigureSvg figure={data.figure} />
    </div>
  );
}
const figureNodeTypes = { figure: FigureNodeView };
const previewOwner: Pick<AppState, 'namespace' | 'userId'> = {
  namespace: 'demo',
  userId: 'concept-figure-preview',
};
const validViewport = (value: unknown): value is Viewport | null => {
  if (value === null) return true;
  if (!value || typeof value !== 'object') return false;
  const v = value as Viewport;
  return (
    [v.x, v.y, v.zoom].every(Number.isFinite) &&
    Math.abs(v.x) < 100000 &&
    Math.abs(v.y) < 100000 &&
    v.zoom >= 0.1 &&
    v.zoom <= 3
  );
};
/** Reuse the app's camera and modal; zoom changes only the view of existing marks. */
export function ConceptFigureView({
  figure,
  data = previewOwner,
  viewKey = figure.label,
}: {
  figure: ConceptFigure;
  data?: Pick<AppState, 'namespace' | 'userId'>;
  viewKey?: string;
}) {
  const [open, setOpen] = useState(false);
  const mathLabel = conceptTextParts(figure.label).some((part) => part.explicit);
  const [viewport, setViewport] = useViewContext<Viewport | null>(
    data,
    `concept-figure:${viewKey}`,
    null,
    validViewport,
  );
  const flow = useRef<ReactFlowInstance<FigureNode> | null>(null);
  const nodes = useMemo<FigureNode[]>(
    () => [
      {
        id: 'figure',
        type: 'figure',
        position: { x: 0, y: 0 },
        data: { figure },
        draggable: false,
        selectable: false,
        focusable: false,
      },
    ],
    [figure],
  );
  return (
    <figure className="concept-figure">
      <FigureSvg figure={figure} />
      <figcaption data-concept-text={figure.caption ?? figure.description}>
        <ConceptText text={figure.caption ?? figure.description} />
      </figcaption>
      <Button variant="quiet" onClick={() => setOpen(true)}>
        도해 크게 보기
      </Button>
      <Modal
        open={open}
        title={mathLabel ? '도해 크게 보기' : figure.label}
        onClose={() => setOpen(false)}
        className="concept-figure-modal"
      >
        {mathLabel && <h3><ConceptText text={figure.label} /></h3>}
        <div className="concept-figure-actions">
          <Button variant="quiet" onClick={() => void flow.current?.zoomTo(1)}>
            기본 글자 크기로 보기
          </Button>
          <span>드래그로 이동 · 두 손가락으로 확대</span>
        </div>
        <div
          className="concept-figure-viewport"
          role="region"
          aria-label="확대한 도해 · 방향키로 이동"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget || !flow.current) return;
            const offsets: Record<string, [number, number]> = {
              ArrowLeft: [40, 0],
              ArrowRight: [-40, 0],
              ArrowUp: [0, 40],
              ArrowDown: [0, -40],
            };
            const offset = offsets[event.key];
            if (!offset) return;
            event.preventDefault();
            const current = flow.current.getViewport();
            void flow.current.setViewport({
              ...current,
              x: current.x + offset[0],
              y: current.y + offset[1],
            });
          }}
        >
          <ReactFlow<FigureNode>
            nodes={nodes}
            edges={[]}
            nodeTypes={figureNodeTypes}
            onInit={(instance) => {
              flow.current = instance;
            }}
            onMoveEnd={(_, next) => setViewport(next)}
            defaultViewport={viewport ?? undefined}
            fitView={!viewport}
            fitViewOptions={{ padding: 0.1, maxZoom: 1 }}
            minZoom={0.1}
            maxZoom={3}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            nodesFocusable={false}
            edgesFocusable={false}
            deleteKeyCode={null}
            panOnDrag
            zoomOnPinch
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            ariaLabelConfig={flowAriaLabels}
          >
            <FlowControls aria-label="도해 보기 조절" showInteractive={false} />
          </ReactFlow>
        </div>
        <details className="concept-figure-details">
          <summary>도해 설명과 표시값</summary>
          <p data-concept-text={figure.description}>
            <ConceptText text={figure.description} />
          </p>
          <ul>
            {figure.marks
              .filter((mark) => mark.kind === 'text')
              .map(
                (mark) =>
                  mark.kind === 'text' && (
                    <li key={mark.id} data-concept-text={mark.text}>
                      <ConceptText text={mark.text} />
                    </li>
                  ),
              )}
          </ul>
        </details>
      </Modal>
    </figure>
  );
}
