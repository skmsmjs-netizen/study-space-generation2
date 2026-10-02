// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { validConceptFigure, type ConceptFigure } from './concept-figure';
import { emptyConceptEdition, validateConceptEdition } from './concept-production';
import { emptyState, type Command } from './model';
import { applyCommand } from './commands';
import { importConceptCatalog, saveConceptEdition } from '../data/concept-production';
import { packServerState, unpackServerState } from '../server/state-codec';

const figure: ConceptFigure = {
  label: '같은 길과 지름길',
  description: '실선은 굽은 길이고 점선은 끝점 사이 거리입니다.',
  viewBox: [0, 0, 420, 340],
  marks: [
    {
      id: 'route',
      kind: 'polyline',
      tone: 'primary',
      points: [
        [50, 210],
        [210, 90],
        [370, 210],
      ],
    },
  ],
};
describe('declarative concept figures at the import boundary', () => {
  it('preserves a figure in server compression and rejects invalid updates without losing the saved version', async () => {
    let state = emptyState('figure-owner', 'test');
    const repository = {
      getSnapshot: () => state,
      execute: (command: Command) => (state = applyCommand(state, command)),
    };
    const original = {
      id: 'route',
      name: '길',
      def: '원문\r\n조건',
      ex: '예시',
      insight: '한계',
      type: '개념',
      cat: 1,
      personal: ['그대로 보관'],
    };
    const raw = JSON.stringify({ items: [original], unknown: '보관' });
    await importConceptCatalog(repository, raw, 'figure-original.json');
    const catalog = state.conceptCatalogs![0];
    const content = {
      ...emptyConceptEdition(catalog.id, original),
      displayType: '정의형' as const,
      screen: {
        type: '정의형' as const,
        title: '길',
        intro: '같은 대상을 봅니다.',
        navigation: 'static' as const,
        mode: 'plain',
        scenes: [
          {
            action: '보기',
            title: '굽이를 따라갑니다.',
            body: '본문',
            caption: '',
            takeaway: '측정 방법',
            figure: { ...figure, caption: '실선과 점선을 비교합니다.' },
          },
        ],
      },
    };
    saveConceptEdition(repository, content, 0);
    const saved = structuredClone(state);
    const packed = packServerState(state, Object.keys(state.appliedOps).at(-1)!);
    expect(unpackServerState(packed)).toEqual(saved);
    expect(unpackServerState(packed).conceptEditions![0].screen!.scenes[0].figure).toEqual(
      content.screen.scenes[0].figure,
    );
    expect(() =>
      saveConceptEdition(
        repository,
        {
          ...content,
          screen: {
            ...content.screen,
            scenes: [
              {
                ...content.screen.scenes[0],
                figure: {
                  ...figure,
                  marks: [{ id: 'bad', kind: 'circle', tone: 'ink', center: [0, 0], radius: 5 }],
                },
              },
            ],
          },
        },
        1,
      ),
    ).toThrow();
    expect(state).toEqual(saved);
    expect(state.conceptCatalogs![0].raw).toBe(raw);
    expect(state.records).toHaveLength(0);
  });
  it('preserves coordinates and descriptions through an edition JSON round trip', () => {
    const source = {
      id: 'route',
      name: '같은 길',
      def: '원문',
      ex: '사례',
      insight: '조건',
      type: '개념',
      cat: 1,
    };
    const edition = {
      ...emptyConceptEdition('catalog', source),
      displayType: '정의형' as const,
      screen: {
        type: '정의형' as const,
        title: '길',
        intro: '같은 길을 봅니다.',
        navigation: 'choose' as const,
        mode: 'plain',
        scenes: [
          {
            action: '길',
            title: '굽이를 봅니다.',
            body: '원문과 별도 설명',
            caption: '',
            takeaway: '방법도 함께 말합니다.',
            figure,
          },
        ],
      },
    };
    const restored = JSON.parse(JSON.stringify(edition));
    expect(() => validateConceptEdition(restored)).not.toThrow();
    expect(restored.screen.scenes[0].figure).toEqual(figure);
    restored.screen.scenes[0].figure.marks[0].points[1][0] = Number.NaN;
    expect(() => validateConceptEdition(restored)).toThrow();
    expect(source.def).toBe('원문');
  });
  it('rejects executable markup, external references and ambiguous mark IDs', () => {
    expect(validConceptFigure({ ...figure, html: '<script>alert(1)</script>' })).toBe(false);
    expect(
      validConceptFigure({
        ...figure,
        marks: [{ id: 'image', tone: 'ink', kind: 'image', href: 'https://example.com/private' }],
      }),
    ).toBe(false);
    expect(validConceptFigure({ ...figure, marks: [figure.marks[0], figure.marks[0]] })).toBe(
      false,
    );
  });
  it('rejects cropped geometry and oversized imported drawings', () => {
    expect(
      validConceptFigure({
        ...figure,
        marks: [
          {
            ...figure.marks[0],
            points: [
              [-1, 20],
              [100, 20],
            ],
          },
        ],
      }),
    ).toBe(false);
    expect(
      validConceptFigure({
        ...figure,
        marks: [{ id: 'circle', kind: 'circle', tone: 'primary', center: [3, 3], radius: 5 }],
      }),
    ).toBe(false);
    expect(
      validConceptFigure({
        ...figure,
        marks: Array.from({ length: 513 }, (_, i) => ({ ...figure.marks[0], id: String(i) })),
      }),
    ).toBe(false);
  });
});
