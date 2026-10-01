import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SourceEditor } from './source-editor';
import { CODE_STARTERS } from '../domain/code-example';
import type { CodeLanguage } from '../domain/model';
function Example({ language, readOnly = false }: { language: CodeLanguage; readOnly?: boolean }) {
  const [code, setCode] = useState(CODE_STARTERS[language]);
  const [status, setStatus] = useState('합성 코드로 편집 동작을 확인합니다.');
  return (
    <>
      <SourceEditor
        value={code}
        language={language}
        readOnly={readOnly}
        onChange={setCode}
        onRun={() =>
          setStatus('단축키 입력을 확인했습니다. 이 Story는 코드를 실행하거나 저장하지 않습니다.')
        }
      />
      <p role="status">{status}</p>
    </>
  );
}
const meta = {
  title: 'Study/Source editor',
  component: Example,
  args: { language: 'c', readOnly: false },
  argTypes: {
    language: { control: 'select', options: ['c', 'cpp', 'csharp', 'python', 'javascript'] },
  },
  render: (args) => <Example key={args.language} {...args} />,
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const C: Story = {};
export const CSharp: Story = { args: { language: 'csharp' } };
export const ReadOnly: Story = { args: { readOnly: true } };
