import { useEffect, useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import {
  conceptInteractiveViewKey,
  readConceptInteractiveView,
  writeConceptInteractiveView,
} from '../data/concept-interactive-view';
import { Button, ErrorState, LoadingState } from './index';
import './concept-interactives.css';

const channel = 'manseeksong:concept-interactives:v1';
export function ConceptInteractives({ data }: { data: Pick<AppState, 'namespace' | 'userId'> }) {
  const iframe = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(900);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const key = conceptInteractiveViewKey(data);
  // biome-ignore lint/correctness/useExhaustiveDependencies: attempt remounts the frame and must reset its timeout/listener lifecycle.
  useEffect(() => {
    setReady(false);
    setError('');
    const timeout = setTimeout(
      () => setError('개념 탐구실 화면을 열지 못했습니다. 저장된 보기는 유지했습니다.'),
      10_000,
    );
    const appearance = () => {
      const computed = getComputedStyle(document.body),
        tokens: Record<string, string> = {};
      // Forward only presentation properties. No records, credentials or account IDs enter the frame.
      for (const name of Array.from(computed))
        if (name.startsWith('--')) tokens[name] = computed.getPropertyValue(name).trim();
      // Reuse the surrounding workspace's generated observatory palette without
      // replacing mathematical colors or the user's global presentation tokens.
      const workspace = iframe.current?.closest('.math-explorer');
      if (workspace) {
        const appearance = getComputedStyle(workspace);
        for (const name of Array.from(appearance))
          if (name.startsWith('--math-observatory-'))
            tokens[name] = appearance.getPropertyValue(name).trim();
      }
      const scheme =
        document.documentElement.dataset.theme === 'dark' ||
        (!document.documentElement.dataset.theme &&
          matchMedia('(prefers-color-scheme: dark)').matches)
          ? 'dark'
          : 'light';
      iframe.current?.contentWindow?.postMessage(
        { channel, action: 'appearance', tokens, font: computed.fontFamily, scheme },
        location.origin,
      );
    };
    const receive = (event: MessageEvent) => {
      if (
        event.source !== iframe.current?.contentWindow ||
        event.origin !== location.origin ||
        event.data?.channel !== channel
      )
        return;
      const message = event.data;
      if (message.action === 'size') {
        if (Number.isFinite(message.height) && message.height > 0 && message.height < 50_000)
          setHeight(message.height);
        return;
      }
      if (!['read', 'write'].includes(message.action) || !Number.isSafeInteger(message.id)) return;
      const response: { channel: string; id: number; value?: string | null; error?: string } = {
        channel,
        id: message.id,
      };
      try {
        if (message.action === 'read') response.value = readConceptInteractiveView(key);
        else {
          writeConceptInteractiveView(key, message.value);
          response.value = null;
        }
      } catch (error) {
        response.error =
          error instanceof Error
            ? error.message
            : '보기를 이 기기에 저장하지 못했습니다. 현재 화면은 유지했습니다.';
      }
      iframe.current?.contentWindow?.postMessage(response, location.origin);
      if (message.action === 'read') {
        clearTimeout(timeout);
        setError('');
        setReady(true);
        appearance();
      }
    };
    window.addEventListener('message', receive);
    const observer = new MutationObserver(appearance);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'style', 'class'],
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
    const media = matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', appearance);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('message', receive);
      observer.disconnect();
      media.removeEventListener('change', appearance);
    };
  }, [key, attempt]);
  return (
    <section className="concept-interactives" aria-label="개념 탐구실">
      {error ? (
        <>
          <ErrorState message={error} />
          <Button onClick={() => setAttempt((value) => value + 1)}>다시 열기</Button>
        </>
      ) : (
        !ready && <LoadingState message="개념 탐구실을 여는 중입니다." />
      )}
      <iframe
        key={`${key}:${attempt}`}
        ref={iframe}
        title="개념 탐구실 인터랙티브"
        src={`${import.meta.env.BASE_URL}tools/concept-interactives/index.html#host=manseeksong-os`}
        style={{ height }}
      />
    </section>
  );
}
