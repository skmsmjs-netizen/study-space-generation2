import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Card,
  Checkbox,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  Modal,
  Radio,
  Search,
  SegmentedControl,
  Select,
  Tabs,
  Textarea,
  Toast,
} from './index';

const meta = {
  id: 'study-common-ui',
  title: '학습 입력/공통 UI',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          '제품의 공통 부품을 그대로 사용합니다. 실제 자료·서버·브라우저 저장소에 연결하지 않는 합성 예시입니다.',
      },
    },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary', children: '기록 남기기' } };
export const Secondary: Story = { args: { children: '돌아가기' } };
export const Busy: Story = { args: { variant: 'primary', children: '저장 중', busy: true } };
export const Disabled: Story = { args: { children: '선택한 항목 열기', disabled: true } };
export const LongLabel: Story = {
  args: { children: '선택한 주제의 원래 기록으로 돌아가 이유와 예외를 함께 확인하기' },
};

export const ButtonVariants: Story = {
  render: () => (
    <div className="tool-row">
      <Button variant="primary">기록 남기기</Button>
      <Button>돌아가기</Button>
      <Button variant="quiet">선택 해제</Button>
      <Button variant="danger">시연 선택 취소</Button>
      <Button busy>저장 중</Button>
      <Button disabled>지금 사용할 수 없음</Button>
    </div>
  ),
};

export const FieldStates: Story = {
  render: () => (
    <div className="tool-stack">
      <Input
        label="주제 이름"
        placeholder="예: 벡터의 방향"
        hint="입력과 설명의 연결을 확인하는 예시입니다."
      />
      <Input
        label="오류가 있는 입력"
        defaultValue="예시"
        error="이 화면의 오류 문구는 시연용입니다. 실제 자료는 바뀌지 않습니다."
      />
      <Textarea
        label="선택 메모"
        defaultValue={'앞뒤 공백과 줄바꿈을 남기는 예시입니다.\n이유와 예외를 자유롭게 적습니다.'}
        hint="평소 입력의 필수 항목으로 바꾸지 않습니다."
      />
      <Select label="예시 과목" defaultValue="math">
        <option value="math">수학</option>
        <option value="physics">물리</option>
      </Select>
      <Checkbox label="공부를 시도함 · 완전 이해나 정답을 뜻하지 않음" />
      <Radio name="tool-radio" label="기본 표시" defaultChecked />
      <Radio name="tool-radio" label="다른 표시" />
    </div>
  ),
};

function LocalForm() {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState('');
  return (
    <form
      className="tool-stack"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(text);
      }}
    >
      <Input
        label="예시 주제"
        value={text}
        onChange={(event) => setText(event.currentTarget.value)}
      />
      <Button type="submit" variant="primary" disabled={!text.trim()}>
        예시 반영
      </Button>
      <p role="status">
        {submitted ? `화면에 반영됨: ${submitted}` : '아직 반영한 예시가 없습니다.'}
      </p>
    </form>
  );
}
export const LocalInputFlow: Story = { render: () => <LocalForm /> };

function ModalExample() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>대화상자 열기</Button>
      <Modal open={open} title="선택 메모" onClose={() => setOpen(false)}>
        <div className="tool-stack">
          <Textarea label="예시 메모" hint="개발용 화면이며 실제 기록에 저장하지 않습니다." />
          <Button onClick={() => setOpen(false)}>닫고 돌아가기</Button>
        </div>
      </Modal>
    </div>
  );
}
export const Dialog: Story = { render: () => <ModalExample /> };

function NavigationExample() {
  const [tab, setTab] = useState('record');
  const [view, setView] = useState('list');
  const items = [
    { id: 'record', label: '기록', panelId: 'tool-panel-record' },
    { id: 'memo', label: '메모', panelId: 'tool-panel-memo' },
  ];
  return (
    <div className="tool-stack">
      <Tabs items={items} value={tab} onChange={setTab} label="예시 보기" />
      {items.map((item) => (
        <section
          key={item.id}
          id={item.panelId}
          role="tabpanel"
          aria-label={item.label}
          hidden={tab !== item.id}
        >
          {item.label} 예시 화면
        </section>
      ))}
      <SegmentedControl
        items={[
          { id: 'list', label: '목록' },
          { id: 'detail', label: '자세히' },
        ]}
        value={view}
        onChange={setView}
      />
      <p role="status">표시: {view === 'list' ? '목록' : '자세히'}</p>
      <Search label="예시 검색" placeholder="한국어와 긴 검색어를 입력해 보기" />
    </div>
  );
}
export const Navigation: Story = { render: () => <NavigationExample /> };

function SearchRecoveryExample() {
  const [input, setInput] = useState('없는 예시');
  const [query, setQuery] = useState('없는 예시');
  const [failed, setFailed] = useState(false);
  const clear = () => {
    setInput('');
    setQuery('');
  };
  return (
    <div className="tool-stack">
      <Search
        label="예시 자료 찾기"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onQueryChange={setQuery}
      />
      {query && (
        <Button variant="quiet" onClick={clear}>
          검색어 지우기
        </Button>
      )}
      <Button onClick={() => setFailed(true)}>검색 연결 실패 비교</Button>
      {failed ? (
        <ErrorState
          title="검색 정보를 읽지 못했습니다"
          message="예시 원문은 유지했습니다. 다시 불러오거나 다른 자료로 이동할 수 있습니다."
          onRetry={() => setFailed(false)}
        />
      ) : !query.trim() ? (
        <EmptyState
          title="어떤 내용을 찾으시나요?"
          message="예시 자료의 이름인 ‘전압’으로 찾아보세요."
        />
      ) : query.includes('전압') ? (
        <Card>
          <h2>전압 예시 자료</h2>
          <p>질문과 원문이 연결된 검색 결과입니다.</p>
        </Card>
      ) : (
        <EmptyState
          title="일치하는 내용을 찾지 못했습니다"
          message="검색어를 줄이거나 지워 보세요."
        />
      )}
    </div>
  );
}
export const SearchRecovery: Story = { render: () => <SearchRecoveryExample /> };

export const Feedback: Story = {
  render: () => (
    <div className="tool-stack">
      <Card>
        <h2>기록과 상태</h2>
        <p>표현을 비교하는 합성 예시입니다.</p>
      </Card>
      <LoadingState />
      <EmptyState
        title="아직 남긴 예시가 없습니다"
        message="예시를 입력하면 이 화면에서 확인할 수 있습니다."
      />
      <ErrorState message="시연 오류입니다. 실제 저장 상태와 무관합니다." onRetry={() => {}} />
      <Toast message="예시가 화면에 반영됐습니다." />
    </div>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <div className="tool-stack">
      <h2>현재 의미색</h2>
      {[
        ['출제 가능성', '--color-exam-possible'],
        ['출제 확정', '--color-exam-confirmed'],
        ['오류', '--color-danger'],
        ['초록 메모 펜', '--color-memo-green'],
      ].map(([label, token]) => (
        <div className="tool-row" key={token}>
          <span
            className="tool-swatch"
            style={{ background: `var(${token})` }}
            aria-hidden="true"
          />
          <span>
            {label} · {token}
          </span>
        </div>
      ))}
      <p>실제 토큰을 참조하며 색의 의미를 바꾸지 않습니다.</p>
    </div>
  ),
};
