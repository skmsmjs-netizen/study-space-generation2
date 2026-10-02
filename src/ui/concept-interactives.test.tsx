import { beforeEach, expect, it, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ConceptInteractives } from './concept-interactives';
import { conceptInteractiveViewKey } from '../data/concept-interactive-view';
import { freshState } from '../interactive/math-physics/model.mjs';
const data = { namespace: 'demo' as const, userId: 'iframe-reader' };
const channel = 'manseeksong:concept-interactives:v1';
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );
});
it('connects only its own same-origin frame to the account view adapter', () => {
  render(<ConceptInteractives data={data} />);
  const frame = screen.getByTitle('개념 탐구실 인터랙티브') as HTMLIFrameElement;
  expect(frame.src).not.toContain(data.userId);
  const message = { channel, action: 'write', id: 1, value: JSON.stringify(freshState()) };
  const send = (source: Window | null, origin = location.origin) =>
    act(() => window.dispatchEvent(new MessageEvent('message', { source, origin, data: message })));
  send(window);
  send(frame.contentWindow, 'https://another.example');
  expect(localStorage.getItem(conceptInteractiveViewKey(data))).toBeNull();
  send(frame.contentWindow);
  expect(localStorage.getItem(conceptInteractiveViewKey(data))).toBe(message.value);
});
it('reports a failed read without claiming successful storage or replacing original data', () => {
  localStorage.setItem(conceptInteractiveViewKey(data), 'raw damaged');
  render(<ConceptInteractives data={data} />);
  const frame = screen.getByTitle('개념 탐구실 인터랙티브') as HTMLIFrameElement;
  const response = vi.spyOn(frame.contentWindow!, 'postMessage');
  act(() =>
    window.dispatchEvent(
      new MessageEvent('message', {
        source: frame.contentWindow,
        origin: location.origin,
        data: { channel, action: 'read', id: 1 },
      }),
    ),
  );
  expect(response.mock.calls.some(([value]) => value.error)).toBe(true);
  expect(localStorage.getItem(conceptInteractiveViewKey(data))).toBe('raw damaged');
});
