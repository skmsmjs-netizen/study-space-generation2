import { render, screen } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { DemoRepository } from '../data/demo-repository';
import { startJourney, visitPlace } from '../domain/observatory-place';
import {
  ObservatoryNavigation,
  ObservatoryTaskReturn,
  routeAvailable,
  studySourceVisit,
  useObservatoryJourney,
} from './observatory-navigation';
import type { AppState } from '../domain/model';

let data: AppState;
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  data = new DemoRepository(localStorage).getSnapshot();
});

it('renders four directions and a ceiling entry with the current place and shared search', () => {
  render(
    <ObservatoryNavigation
      data={data}
      route="/math"
      journey={startJourney('/math', 'right')}
      global={false}
    />,
  );
  expect(
    screen.getByRole('navigation', { name: '천문대 자리' }).querySelectorAll('a'),
  ).toHaveLength(5);
  expect(screen.getByRole('link', { name: '오른쪽 탐구 작업대' })).toHaveAttribute(
    'aria-current',
    'location',
  );
  expect(screen.getByRole('link', { name: '어디서나 찾기' })).toHaveAttribute('href', '#/search');
});

it('retains the original source only within a continuous source and tool task', () => {
  const topicRoute = '/node/demo-topic-function';
  let journey = visitPlace(startJourney(topicRoute, 'front'), '/math', 'right');
  journey = visitPlace(journey, '/record/demo-topic-function', 'front');
  expect(studySourceVisit(data, journey)?.route).toBe(topicRoute);
  journey = visitPlace(journey, '/', 'front');
  journey = visitPlace(journey, '/record', 'front');
  expect(studySourceVisit(data, journey)).toBeUndefined();
});

it('skips deleted caller entities and never links an unsupported route', () => {
  expect(routeAvailable(data, '/node/demo-topic-function')).toBe(true);
  expect(routeAvailable(data, '/materials/deleted-original')).toBe(false);
  expect(routeAvailable(data, '/not-a-screen')).toBe(false);
  const changed = {
    ...data,
    nodes: data.nodes.map((node) => ({ ...node, deletedAt: '2026-10-02T00:00:00Z' })),
  };
  expect(routeAvailable(changed, '/node/demo-topic-function')).toBe(false);
});

function Harness({ route, current = data }: { route: string; current?: AppState }) {
  const context = useObservatoryJourney(current, route);
  return (
    <>
      <span data-testid="place">{context.journey.current.place}</span>
      <ObservatoryTaskReturn
        data={current}
        route={route}
        caller={context.caller}
        studySource={context.studySource}
      />
    </>
  );
}

it('keeps a real caller across reload but starts a different account with no caller', () => {
  const view = render(<Harness route="/subjects" />);
  view.rerender(<Harness route="/node/demo-topic-function" />);
  expect(screen.getByRole('link', { name: '돌아가기 · 과목' })).toHaveAttribute(
    'href',
    '#/subjects',
  );
  view.unmount();
  const restored = render(<Harness route="/node/demo-topic-function" />);
  expect(screen.getByRole('link', { name: '돌아가기 · 과목' })).toBeInTheDocument();
  restored.rerender(
    <Harness
      route="/node/demo-topic-function"
      current={{ ...data, namespace: 'personal', userId: 'different-user' }}
    />,
  );
  expect(screen.queryByRole('link', { name: /돌아가기/ })).not.toBeInTheDocument();
});

it('navigation stays available if hint storage fails, without touching original state', () => {
  const original = JSON.stringify(data);
  const mock = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw Error('quota');
  });
  const view = render(<Harness route="/subjects" />);
  view.rerender(<Harness route="/math" />);
  expect(screen.getByTestId('place')).toHaveTextContent('right');
  expect(screen.getByRole('link', { name: /돌아가기/ })).toHaveAttribute('href', '#/subjects');
  expect(JSON.stringify(data)).toBe(original);
  mock.mockRestore();
});

it('looks up for common tools and returns past intermediate common routes to the original place', () => {
  let journey = visitPlace(startJourney('/statistics', 'back'), '/search', 'global');
  journey = visitPlace(journey, '/help', 'global');
  render(<ObservatoryNavigation data={data} route="/help" journey={journey} global />);
  expect(screen.getByRole('link', { name: '위쪽 천장 조명' })).toHaveAttribute(
    'aria-current',
    'location',
  );
  expect(screen.getByRole('link', { name: '원래 자리로' })).toHaveAttribute('href', '#/statistics');
  expect(screen.getByRole('link', { name: '뒤쪽 기록·계획 벽' })).not.toHaveAttribute(
    'aria-current',
  );
});
