import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const html = readFileSync('index.html', 'utf8');
const guard = html.match(/<script id="app-boot-recovery">([\s\S]*?)<\/script>/)![1];
let errorListener: EventListener;
let replace: ReturnType<typeof vi.fn>;

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  localStorage.setItem('synthetic-record', 'original answer');
  sessionStorage.setItem('synthetic-draft', 'unfinished answer');
  replace = vi.fn();
  const host = {
    location: { href: 'https://example.com/study/?space=personal#/canvas', replace },
    addEventListener: (_type: string, listener: EventListener) => {
      errorListener = listener;
      window.addEventListener('error', listener, true);
    },
  };
  new Function('window', 'document', 'HTMLScriptElement', 'URL', guard)(host, document, HTMLScriptElement, URL);
});
afterEach(() => {
  window.removeEventListener('error', errorListener, true);
  document.body.replaceChildren();
  localStorage.removeItem('synthetic-record');
  sessionStorage.removeItem('synthetic-draft');
});

function failedScript(type = 'module') {
  const script = document.createElement('script');
  script.type = type;
  script.src = '/assets/removed-entry.js';
  document.body.append(script);
  script.dispatchEvent(new Event('error'));
}

it('shows recovery when the entry module is unavailable, without an automatic reload or storage changes', () => {
  failedScript();
  expect(document.querySelector('[role="alert"]')?.textContent).toContain('공부 공간을 불러오지 못했습니다');
  expect(replace).not.toHaveBeenCalled();
  expect(localStorage.getItem('synthetic-record')).toBe('original answer');
  expect(sessionStorage.getItem('synthetic-draft')).toBe('unfinished answer');
});

it('reopens the same space and route with a fresh page URL only when requested', () => {
  failedScript();
  document.querySelector<HTMLButtonElement>('button')!.click();
  const url = new URL(replace.mock.calls[0][0]);
  expect(url.searchParams.get('space')).toBe('personal');
  expect(url.hash).toBe('#/canvas');
  expect(url.searchParams.get('_reload')).toBeTruthy();
  expect(localStorage.getItem('synthetic-record')).toBe('original answer');
  expect(sessionStorage.getItem('synthetic-draft')).toBe('unfinished answer');
});

it('keeps a mounted app and ignores unrelated script failures', () => {
  failedScript('text/javascript');
  expect(document.querySelector('[role="alert"]')).toBeNull();
  document.getElementById('root')!.innerHTML = '<main>기록 작성 중</main>';
  failedScript();
  expect(document.getElementById('root')!.textContent).toBe('기록 작성 중');
  expect(replace).not.toHaveBeenCalled();
});
