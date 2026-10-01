import { useEffect, useRef, useState } from 'react';
import { Player } from '@lordicon/react';
import lock from './motion-assets/lock.json';
import { Button } from './index';
import { usePlayerMotion } from './motion';

export default function AnimatedPrivacyIcon() {
  const player = useRef<Player>(null), { ref, enabled, playing } = usePlayerMotion(), [ready, setReady] = useState(false);
  useEffect(() => { if (!playing) player.current?.pause(); else if (ready) player.current?.play(); }, [playing, ready]);
  return <><div ref={ref} className="motion-player motion-player--icon" aria-hidden="true" data-motion-source="lordicon">
    <Player ref={player} icon={lock} size={100} colorize="currentColor" onReady={() => { setReady(true); if (playing) player.current?.playFromBeginning(); }} />
  </div><Button disabled={!ready || !enabled} onClick={() => player.current?.playFromBeginning()}>아이콘 움직임 다시 보기</Button><p className="motion-credit">아이콘: <a href="https://lordicon.com/" target="_blank" rel="noreferrer">Lordicon</a></p></>;
}
