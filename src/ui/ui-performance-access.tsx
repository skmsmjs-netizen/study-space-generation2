import { useState } from 'react';
import { Button, Modal } from './index';
import { UiPerformancePanel } from './ui-performance-panel';
export function UiPerformanceAccess() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="quiet" onClick={() => setOpen(true)}>
        반응 속도 확인
      </Button>
      <Modal open={open} title="반응 속도 확인" onClose={() => setOpen(false)}>
        {open && <UiPerformancePanel />}
      </Modal>
    </>
  );
}
