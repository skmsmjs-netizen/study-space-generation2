import { useEffect, useRef, useState } from 'react';
import { Button, EmptyState, Input, Modal } from './index';
export type WorkspaceCommand = {
  id: string;
  title: string;
  keywords?: string;
  disabled?: string;
  run: () => void;
};
/** Uses the common modal's focus trap; the result list consists of native buttons. */
export function WorkspaceCommands({ commands }: { commands: WorkspaceCommand[] }) {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null),
    results = useRef<HTMLUListElement>(null);
  const show = () => {
    setQuery('');
    setOpen(true);
  };
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (
        event.isComposing ||
        event.keyCode === 229 ||
        event.defaultPrevented ||
        !(event.metaKey || event.ctrlKey) ||
        !event.shiftKey ||
        event.key.toLowerCase() !== 'k'
      )
        return;
      if (
        event.target instanceof Element &&
        event.target.closest(
          'input, textarea, select, [contenteditable], .cm-editor, .monaco-editor, [role="dialog"]',
        )
      )
        return;
      event.preventDefault();
      setQuery('');
      setOpen(true);
    }
    document.addEventListener('keydown', shortcut);
    return () => document.removeEventListener('keydown', shortcut);
  }, []);
  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);
  const term = query.trim().normalize('NFC').toLocaleLowerCase('ko-KR');
  const visible = commands.filter((command) =>
    `${command.title} ${command.keywords ?? ''}`
      .normalize('NFC')
      .toLocaleLowerCase('ko-KR')
      .includes(term),
  );
  return (
    <>
      <Button onClick={show} aria-keyshortcuts="Control+Shift+K Meta+Shift+K">
        빠른 명령
      </Button>
      <Modal open={open} title="지금 할 일 찾기" onClose={() => setOpen(false)}>
        <Input
          ref={input}
          label="명령 찾기"
          placeholder="기록, 수식, 메모, 자료…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              results.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
            }
            if (event.key === 'Enter' && visible.length === 1 && !visible[0].disabled) {
              event.preventDefault();
              setOpen(false);
              visible[0].run();
            }
          }}
        />
        <p>⌘/Ctrl + Shift + K로 열 수 있습니다. 입력 중에는 글쓰기 단축키를 우선합니다.</p>
        {!visible.length && (
          <EmptyState
            title="일치하는 명령이 없습니다"
            message="명령 이름을 줄이거나 검색어를 지워 주세요."
          />
        )}
        <ul
          ref={results}
          className="workspace-command-results"
          onKeyDown={(event) => {
            if (
              !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) ||
              event.nativeEvent.isComposing
            )
              return;
            const buttons = [
              ...(results.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ??
                []),
            ];
            const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
            if (index < 0 || !buttons.length) return;
            event.preventDefault();
            const next =
              event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? buttons.length - 1
                  : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) %
                    buttons.length;
            buttons[next]?.focus();
          }}
        >
          {visible.map((command) => (
            <li key={command.id}>
              <Button
                disabled={!!command.disabled}
                onClick={() => {
                  setOpen(false);
                  command.run();
                }}
              >
                {command.title}
              </Button>
              {command.disabled && <p>{command.disabled}</p>}
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}
