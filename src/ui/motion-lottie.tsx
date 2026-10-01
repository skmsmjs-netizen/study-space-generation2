import { useEffect, useState } from 'react';
import { DotLottieReact, setWasmUrl, type DotLottie } from '@lottiefiles/dotlottie-react';
import wasmUrl from '@lottiefiles/dotlottie-web/dotlottie-player.wasm?url';
import breathing from './motion-assets/breathing.json';
import { usePlayerMotion } from './motion';
import { Button } from './index';

// Self-host the runtime: visiting a widget never sends study content to an asset service.
setWasmUrl(wasmUrl);
export default function BreathingAnimation() {
  const { ref, enabled, playing, paused, setPaused } = usePlayerMotion(), [player, setPlayer] = useState<DotLottie | null>(null), [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!player) return;
    const fail = () => setFailed(true);
    player.addEventListener('loadError', fail);
    return () => player.removeEventListener('loadError', fail);
  }, [player]);
  useEffect(() => { if (playing) player?.play(); else player?.pause(); }, [playing, player]);
  return <><div ref={ref} className="motion-player" aria-hidden="true" data-motion-source="lottiefiles">
    {failed ? <span className="motion-player-fallback" /> : <DotLottieReact data={breathing} autoplay={playing} loop dotLottieRefCallback={setPlayer} />}
  </div><Button aria-pressed={paused} disabled={!enabled || failed} onClick={() => setPaused(value => !value)}>{paused ? '움직임 재생' : '움직임 일시정지'}</Button><p>잠깐 화면에서 눈을 떼고 편하게 쉬어 가세요. 닫으면 하던 화면으로 돌아갑니다.</p>{failed && <p>움직임을 불러오지 못해 정지된 표시로 보여드립니다.</p>}</>;
}
