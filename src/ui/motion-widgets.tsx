import { Component, Suspense, lazy, useId, useState, type ReactNode } from 'react';
import { Button, Checkbox, EmptyState, LoadingState, Modal, Tabs, Toast } from './index';
import { SavedMark, useMotionEnabled } from './motion';
const BreathingAnimation = lazy(() => import('./motion-lottie'));
const AnimatedPrivacyIcon = lazy(() => import('./motion-lordicon'));
const InteractiveMotionCard = lazy(() => import('./motion-rive'));
class PlayerBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <><p role="status">움직임을 열지 못했습니다. 연결을 확인한 뒤 화면을 다시 열어 주세요. 저장된 공부 기록과 초안은 지우지 않습니다.</p><Button onClick={() => window.location.reload()}>화면 다시 열기</Button></> : this.props.children; }
}
export function MotionWidgets({ reduced, onReducedChange }: { reduced: boolean; onReducedChange: (reduced: boolean) => void }) {
  const [open, setOpen] = useState(false), [view, setView] = useState('breathing'), [sample, setSample] = useState('record');
  const enabled = useMotionEnabled();
  const panelId = 'motion-panel-' + useId();
  return <><Button variant="quiet" onClick={event => { event.currentTarget.focus({ preventScroll: true }); setOpen(true); }}>움직임 위젯</Button>
    <Modal open={open} title="움직임 위젯" onClose={() => setOpen(false)}>
      <Checkbox label="움직임 줄이기" checked={reduced} onChange={event => onReducedChange(event.target.checked)} />
      {!enabled && <p>현재 설정에 따라 움직임을 멈춘 상태로 표시합니다.</p>}
      <Tabs value={view} onChange={setView} label="위젯 선택" items={[{ id: 'breathing', label: '쉬어가기', panelId }, { id: 'icon', label: '선형 아이콘', panelId }, { id: 'interactive', label: '인터랙티브 카드', panelId }, { id: 'ui', label: '화면 동작', panelId }]} />
      <div id={panelId} className="motion-widget-content" role="tabpanel" aria-label={{ breathing: '쉬어가기', icon: '선형 아이콘', interactive: '인터랙티브 카드', ui: '화면 동작' }[view]}>
        <PlayerBoundary key={view}><Suspense fallback={<LoadingState message="위젯을 여는 중입니다." />}>
          {view === 'breathing' ? <BreathingAnimation /> : view === 'icon' ? <AnimatedPrivacyIcon /> : view === 'interactive' ? <InteractiveMotionCard /> : <>
            <div className="motion-widget-samples"><Button busy>자료 불러오기</Button><span><SavedMark />저장 확인 표시</span></div>
            <Tabs value={sample} onChange={setSample} label="전환 살펴보기" items={[{ id: 'record', label: '기록' }, { id: 'source', label: '원문' }]} />
            <Toast message="알림은 원래의 되돌리기 동작을 유지합니다." onUndo={() => setSample('record')} />
            <EmptyState title="빈 화면도 차분하게 나타납니다" />
          </>}
        </Suspense></PlayerBoundary>
      </div>
    </Modal></>;
}
