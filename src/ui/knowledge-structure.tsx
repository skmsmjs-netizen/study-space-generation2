import type { AppState } from '../domain/model';
import type { ConceptVisual } from '../domain/concept-production';
import contract from '../../docs/knowledge-structure-contract.json' with { type: 'json' };
import { ConceptText } from './concept-text';
import { occurrenceRows } from './list-keys';
import { Button } from './index';
import { useViewContext } from './use-view-context';
import { KnowledgeDiagram } from './knowledge-diagram';
import './knowledge-structure.css';

type Presentation = 'diagram' | 'prose';
const isPresentation = (value: unknown): value is Presentation =>
  value === 'diagram' || value === 'prose';
const copy = contract.presentation;
export const KNOWLEDGE_CANVAS_DEFAULTS = {
  edgeStyle: contract.canvas.newWorkspaceEdgeStyle as 'step',
};

export function KnowledgeLegend({ canvas = false }: { canvas?: boolean }) {
  return (
    <details className="knowledge-legend">
      <summary>{copy.legendTitle}</summary>
      <p>{canvas ? copy.canvas : copy.legend}</p>
    </details>
  );
}

/** Closed modules and authored, labelled connections; never infer edges or mastery. */
export function KnowledgeStructure({
  visual,
  data,
  viewKey,
}: {
  visual: ConceptVisual;
  data: Pick<AppState, 'namespace' | 'userId'>;
  viewKey: string;
}) {
  const [presentation, setPresentation] = useViewContext<Presentation>(
    data,
    `knowledge-structure:${viewKey}`,
    isPresentation(copy.default) ? copy.default : 'diagram',
    isPresentation,
  );
  const names = new Map(visual.nodes.map((node) => [node.id, node.label]));
  const name = (id: string) => names.get(id) ?? `${copy.missingNode} (${id})`;
  const nodeContent = (node: ConceptVisual['nodes'][number]) => (
    <>
      <dt data-concept-text={node.label}>
        <ConceptText text={node.label} />
      </dt>
      <dd data-concept-text={node.detail}>
        <ConceptText text={node.detail} />
      </dd>
    </>
  );
  return (
    <figure
      className={`concept-diagram concept-composition concept-composition--${visual.kind} knowledge-structure`}
      data-knowledge-presentation={presentation}
    >
      <figcaption data-concept-text={visual.label}>
        <ConceptText text={visual.label} />
      </figcaption>
      <div className="knowledge-view-controls" role="group" aria-label={copy.controls}>
        {(['diagram', 'prose'] as const).map((value) => (
          <Button
            key={value}
            variant="quiet"
            aria-pressed={presentation === value}
            onClick={() => setPresentation(value)}
          >
            {copy[value]}
          </Button>
        ))}
      </div>
      {presentation === 'diagram' && visual.relations.length > 0 ? (
        <KnowledgeDiagram visual={visual} data={data} viewKey={viewKey} />
      ) : visual.kind === 'sequence' ? (
        <>
          <p className="knowledge-sequence-note">{copy.sequence}</p>
          <ol className="knowledge-sequence">
            {visual.nodes.map((node) => (
              <li
                key={node.id}
                className={`knowledge-module${visual.highlighted.includes(node.id) ? ' is-emphasized' : ''}`}
              >
                <dl>{nodeContent(node)}</dl>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <dl className="concept-representations">
          {visual.nodes.map((node) => (
            <div
              key={node.id}
              className={`knowledge-module${visual.highlighted.includes(node.id) ? ' is-emphasized' : ''}`}
            >
              {nodeContent(node)}
            </div>
          ))}
        </dl>
      )}
      {presentation === 'prose' && visual.relations.length > 0 && (
        <ul className="knowledge-relations" aria-label={copy.relations}>
          {occurrenceRows(visual.relations, (relation) => JSON.stringify(relation)).map(
            ({ value: relation, key }) => (
              <li key={key} className="knowledge-prose-relation">
                <p>
                  ‘<ConceptText text={name(relation.from)} />
                  ’에서 ‘<ConceptText text={name(relation.to)} />’ 방향의 연결 설명은 ‘
                  <ConceptText
                    text={relation.label.trim() ? relation.label : copy.missingRelation}
                  />
                  ’이다.
                </p>
              </li>
            ),
          )}
        </ul>
      )}
      <KnowledgeLegend />
    </figure>
  );
}
