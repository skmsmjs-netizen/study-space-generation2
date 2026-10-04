import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { ObservatoryWorld } from '../../../src/ui/pixel-worlds';
import { buildStudyLandscape } from '../../../src/domain/study-landscape';
import { observatoryEvolution } from '../../../src/domain/observatory-evolution';
import { observatorySkyAt } from '../../../src/domain/observatory-time';
import { observatoryPresentation } from '../../../src/ui/observatory-presentation';
import { OBSERVATORY_VIEWBOX } from '../../../src/ui/observatory-geometry';

// Synthetic art-direction specimen only. No user record or browser storage is read.
const instant = Date.parse('2026-10-01T14:00:00Z');
const world = buildStudyLandscape({ userId: 'design-specimen', namespace: 'design-specimen', subjects: [], sessions: [], records: [] });
world.evolution = observatoryEvolution(127);
const sky = observatorySkyAt(instant);
const svg = renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" className="pixel-landscape pixel-world--observatory" viewBox={OBSERVATORY_VIEWBOX} width="960" height="400" preserveAspectRatio="xMidYMid meet" shapeRendering="crispEdges"><ObservatoryWorld world={world} visible={['garden', 'river', 'walk']} sky={sky} /></svg>);
const root = resolve('docs/figma-observatory-20261002');
mkdirSync(resolve(root, 'assets'), { recursive: true });
writeFileSync(resolve(root, 'assets/observatory-source.svg'), svg);
writeFileSync(resolve(root, 'assets/observatory-style.json'), JSON.stringify({ style: observatoryPresentation(world, undefined, sky), stage: world.evolution.stage, viewBox: OBSERVATORY_VIEWBOX, synthetic: true, thumbnail: false, note: '원본 SVG 표현의 합성·정지 참조. 원본 전체 SVG의 정지 참조이며 WebGL·CSS 애니메이션의 시간 동작은 별도 구현 검증 대상이다.' }, null, 2));
const css = ['tokens.css','observatory-palette.css','study-landscapes.css','observatory-event-variations.css','observatory-advanced.css','observatory-reactivity.css'].map(name => readFileSync(resolve('src/ui', name), 'utf8').replace(/@import\s+[^;]+;/g, '')).join('\n');
writeFileSync(resolve(root, 'assets/observatory-source.css'), css);
console.log(JSON.stringify({ bytes: svg.length, viewBox: OBSERVATORY_VIEWBOX, assets: 3 }));
