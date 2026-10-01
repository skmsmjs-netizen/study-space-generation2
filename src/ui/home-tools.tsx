import { useEffect, useState } from 'react';
import { Button, Card } from './index';
import './home-tools.css';

const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Asia/Seoul',
});
const timeFormat = new Intl.DateTimeFormat('ko-KR', {
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Seoul',
});

// Keep the clock's updates inside this component so editors and home context stay mounted.
function NowClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
      if (document.visibilityState === 'hidden') return;
      setNow(new Date());
      timer = setTimeout(refresh, 60_000 - Date.now() % 60_000);
    };
    refresh();
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    return () => {
      if (timer !== undefined) clearTimeout(timer);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', refresh);
    };
  }, []);
  return <div className="home-now" aria-live="off">
    <div><h2>지금</h2><p>{dateFormat.format(now)}</p></div>
    <div><time className="home-now-time" dateTime={now.toISOString()}>{timeFormat.format(now)}</time><span className="home-now-zone">한국 시간</span></div>
  </div>;
}

export function HomeTools({ onNavigate }: { onNavigate: (path: string) => void }) {
  return <section className="home-tools" aria-label="지금 쓸 수 있는 공부 도구">
    <NowClock />
    <div className="home-tools-grid">
      <Card className="home-tool">
        <h2>공부한 뒤</h2>
        <p>해 본 주제만 체크하세요. 글은 필요할 때 남길 수 있습니다.</p>
        <Button variant="primary" onClick={() => onNavigate('/record')}>공부 기록하기</Button>
      </Card>
      <Card className="home-tool">
        <h2>생각이 떠오르면</h2>
        <p>과목이나 주제를 고르지 않고, 한 줄부터 남기세요.</p>
        <Button onClick={() => onNavigate('/free')}>자유롭게 쓰기</Button>
      </Card>
      <Card className="home-tool">
        <h2>하나를 설명해 보면</h2>
        <p>한 주제를 골라, 기억나는 핵심과 조건을 적어 보세요.</p>
        <Button onClick={() => onNavigate('/recall')}>주제 카드로 설명하기</Button>
      </Card>
    </div>
  </section>;
}
