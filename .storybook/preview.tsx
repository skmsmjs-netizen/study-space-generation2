import type { Preview } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '../src/ui/tokens.css';
import '../src/ui/components.css';
import './preview.css';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    controls: { expanded: true },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
    (Story) => (
      <main className="tool-preview">
        <header className="tool-preview-heading">
          <h1>학습 입력 · UI 작업실</h1>
          <p>
            현재 앱의 공통 부품과 토큰을 비교하는 개발용 화면입니다. 예시 입력은 실제 공부 기록으로
            저장되지 않습니다.
          </p>
        </header>
        <Story />
      </main>
    ),
  ],
};

export default preview;
