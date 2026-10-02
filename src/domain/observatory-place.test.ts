import { describe, expect, it } from 'vitest';
import {
  OBSERVATORY_MENU,
  OBSERVATORY_PLACES,
  restoreJourney,
  routePlace,
  startJourney,
  visitPlace,
} from './observatory-place';

describe('observatory locations and actual caller history', () => {
  it('keeps the 18 existing menus in the adopted 6/4/2/5/1 groups', () => {
    expect(new Set(OBSERVATORY_MENU.map((item) => item.href)).size).toBe(18);
    expect(
      ['front', 'left', 'right', 'back', 'global'].map(
        (place) => OBSERVATORY_MENU.filter((item) => item.place === place).length,
      ),
    ).toEqual([6, 4, 2, 5, 1]);
    expect(OBSERVATORY_PLACES.map((place) => [place.id, place.angle])).toEqual([
      ['front', 0],
      ['left', 270],
      ['right', 90],
      ['back', 180],
    ]);
  });
  it('separates the shelf from an opened source and a topic from its outline', () => {
    expect(routePlace('/materials')).toBe('left');
    expect(routePlace('/materials/new')).toBe('left');
    expect(routePlace('/materials/original-id')).toBe('front');
    expect(routePlace('/node/outline', 'unit')).toBe('left');
    expect(routePlace('/node/topic', 'topic')).toBe('front');
    expect(routePlace('/memory-test/result/original-id')).toBe('front');
    expect(routePlace('/materials/trash')).toBe('global');
  });
  it('returns through actual source/tool visits without manufacturing loops', () => {
    let journey = startJourney('/materials', 'left');
    journey = visitPlace(journey, '/materials/source', 'front');
    journey = visitPlace(journey, '/math', 'right');
    journey = visitPlace(journey, '/record/topic', 'front');
    expect(journey.trail.map((item) => item.route)).toEqual([
      '/materials',
      '/materials/source',
      '/math',
    ]);
    journey = visitPlace(journey, '/math', 'right');
    expect(journey.trail.map((item) => item.route)).toEqual(['/materials', '/materials/source']);
    journey = visitPlace(journey, '/materials/source', 'front');
    expect(journey.trail.map((item) => item.route)).toEqual(['/materials']);
  });
  it('keeps global tools at the caller place and restores it when revisited', () => {
    let journey = visitPlace(startJourney('/canvas', 'back'), '/search', 'global');
    expect(journey.current.place).toBe('back');
    journey = visitPlace(journey, '/materials/source', 'front');
    journey = visitPlace(journey, '/search', 'global');
    expect(journey.current.place).toBe('back');
    expect(journey.trail).toEqual([{ route: '/canvas', place: 'back' }]);
  });
  it('restores only the same current route and cannot invent a caller on a new deep link', () => {
    const saved = visitPlace(startJourney('/materials', 'left'), '/materials/source', 'front');
    expect(restoreJourney(saved, '/materials/source', 'front')).toEqual(saved);
    expect(restoreJourney(saved, '/code/example', 'right').trail).toEqual([]);
    expect(restoreJourney(null, '/search', 'global').trail).toEqual([]);
  });
  it('bounds accumulated history and rejects damaged or external caller hints', () => {
    let journey = startJourney('/', 'front');
    for (let i = 0; i < 100; i++) journey = visitPlace(journey, `/materials/${i}`, 'front');
    expect(journey.trail).toHaveLength(32);
    for (const route of ['//external.test', '/bad\u0000route', '/\ud800']) {
      expect(
        restoreJourney(
          { ...journey, trail: [{ route, place: 'front' }] },
          journey.current.route,
          'front',
        ).trail,
      ).toEqual([]);
    }
  });
});
