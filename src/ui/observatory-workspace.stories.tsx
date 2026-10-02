import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card, Input, Modal, Tabs, Textarea } from './index';
import './observatory-workspace.css';
import './observatory-layout.css';
import './paper-typography.css';
import './paper-typeface.css';
import { layoutSurfaceAttributes } from './observatory-layout';

function PaperWorkspace() {
  const [tab, setTab] = useState('record');
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState(
    '  조건과 예외를 함께 남기는 예시 원문입니다.\n문장이 길어져도 종이 높이를 고정하지 않습니다.  ',
  );
  return (
    <div className="observatory-workspace tool-stack">
      <header className="observatory-interior tool-stack">
        <h2>공부 책상</h2>
        <p>실내 조작부와 현재 펼친 기록을 구별합니다.</p>
        <div className="tool-row">
          <Button variant="primary">이어서 공부하기</Button>
          <Button>자료 책장</Button>
          <Button disabled>선택한 자료 열기</Button>
        </div>
      </header>
      <section className="observatory-paper tool-stack" aria-label="종이 작업면" {...layoutSurfaceAttributes('R01')}>
        <Tabs
          label="작업면"
          value={tab}
          onChange={setTab}
          items={[
            { id: 'record', label: '공부 기록', panelId: 'paper-record' },
            { id: 'memo', label: '메모', panelId: 'paper-memo' },
            { id: 'disabled', label: '선택 자료 없음', disabled: true },
          ]}
        />
        <div
          role="tabpanel"
          id={`paper-${tab}`}
          aria-label={tab === 'record' ? '공부 기록' : '메모'}
        >
          <Card className="narrative-editor">
            <h3>{tab === 'record' ? '오늘 남기는 기록' : '지금 떠오른 생각'}</h3>
            <Textarea
              label="예시 원문"
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
          </Card>
          <Input label="읽기 전용 원문" readOnly value="원문을 선택해 복사할 수 있습니다." />
          <Input
            label="오류가 있는 예시 입력"
            defaultValue="수정할 원문"
            error="예시 오류입니다. 원문을 보존하고 수정할 수 있습니다."
          />
        </div>
        <div className="tool-row">
          <Button variant="primary" onClick={() => setOpen(true)}>
            예시 창 열기
          </Button>
          <Button busy>저장 중</Button>
          <Button variant="danger">예시 선택 취소</Button>
        </div>
        <p>이 작업실의 입력은 실제 공부 기록이나 저장소에 연결되지 않습니다.</p>
      </section>
      <Modal open={open} title="종이 작업면의 창" onClose={() => setOpen(false)}>
        <p>창을 닫으면 열었던 버튼으로 초점이 돌아갑니다.</p>
        <div className="memo-editor"><Textarea label="창 안의 예시 메모" defaultValue="긴 한글과 줄바꿈을 그대로 확인합니다." /></div>
      </Modal>
    </div>
  );
}

const meta = {
  title: '천문대/종이 작업면과 실내 부품',
  component: PaperWorkspace,
  parameters: { layout: 'padded', a11y: { test: 'error' } },
} satisfies Meta<typeof PaperWorkspace>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Workspace: Story = {};
export const NarrowWorkspace: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '22rem' }}>
        <Story />
      </div>
    ),
  ],
};
