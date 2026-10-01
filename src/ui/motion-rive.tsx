import { useEffect, useState } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { RuntimeLoader } from '@rive-app/canvas';
import wasmUrl from '@rive-app/canvas/rive.wasm?url';
import assetUrl from './motion-assets/rating.riv?url';
import { usePlayerMotion } from './motion';
import { SegmentedControl } from './index';
RuntimeLoader.setWasmUrl(wasmUrl);

export default function InteractiveMotionCard() {
  const { ref, enabled, playing } = usePlayerMotion(), [failed, setFailed] = useState(false), [stars, setStars] = useState('3');
  const { rive, RiveComponent } = useRive({ src: assetUrl, stateMachines: 'State Machine 1', autoplay: playing, onLoadError: () => setFailed(true) });
  const rating = useStateMachineInput(rive, 'State Machine 1', 'rating');
  useEffect(() => { if (rating) rating.value = Number(stars); }, [rating, stars]);
  useEffect(() => { if (playing) rive?.play(); else rive?.pause(); }, [playing, rive]);
  return <><div ref={ref} className="motion-player motion-player--icon" data-motion-source="rive">
    {failed ? <p>카드를 불러오지 못했습니다. 닫았다가 다시 열어 주세요.</p> : <><div className="motion-rive-canvas" hidden={!enabled}><RiveComponent aria-hidden="true" /></div><span hidden={enabled} aria-hidden="true">{'★'.repeat(Number(stars))}{'☆'.repeat(5 - Number(stars))}</span></>}
  </div><SegmentedControl label="별 모양의 개수" value={stars} onChange={setStars} items={[1, 2, 3, 4, 5].map(value => ({ id: String(value), label: `${value}개` }))} />
  <p>아래 숫자를 고르면 별 모양이 반응합니다. 공부 결과를 평가하거나 기록하는 위젯은 아닙니다.</p>
  <p className="motion-credit">카드: <a href="https://github.com/rive-app/rive-react" target="_blank" rel="noreferrer">Rive 공식 예제</a></p></>;
}
