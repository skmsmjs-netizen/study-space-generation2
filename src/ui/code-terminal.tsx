import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import type { CodeTerminalExecution } from '../data/code-terminal';
import { prefersTouchCodeEditor } from './source-editor';

export interface CodeTerminalHandle {
  write(text: string): void;
  reset(): void;
  focus(): void;
}
export function CodeTerminal({
  handle,
  execution,
  pendingOutput,
  running,
}: {
  handle: React.RefObject<CodeTerminalHandle | null>;
  execution: React.RefObject<CodeTerminalExecution | null>;
  pendingOutput: React.RefObject<string>;
  running: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal | null>(null);
  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      screenReaderMode: true,
      fontSize: 14,
      fontFamily: 'Menlo, Consolas, monospace',
      scrollback: 1000,
      disableStdin: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#d4d4d4',
      },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(host.current!);
    terminal.current = term;
    host.current!.querySelector('textarea')?.setAttribute('aria-label', '실행 중 입력하는 터미널');
    // Programs cannot read clipboard or trigger links through terminal escape sequences.
    const clipboard = term.parser.registerOscHandler(52, () => true);
    const input = term.onData((text) => execution.current?.write(text));
    const resized = term.onResize(({ cols, rows }) => execution.current?.resize(cols, rows));
    const observer = new ResizeObserver(() => {
      if (host.current?.clientWidth) fit.fit();
    });
    observer.observe(host.current!);
    handle.current = {
      write: (text) => term.write(text),
      reset: () => term.reset(),
      focus: () => term.focus(),
    };
    if (pendingOutput.current) {
      term.write(pendingOutput.current);
      pendingOutput.current = '';
    }
    fit.fit();
    return () => {
      handle.current = null;
      terminal.current = null;
      observer.disconnect();
      input.dispose();
      resized.dispose();
      clipboard.dispose();
      term.dispose();
    };
  }, [handle, execution, pendingOutput]);
  useEffect(() => {
    if (!terminal.current) return;
    terminal.current.options.disableStdin = !running;
    if (running) {
      execution.current?.resize(terminal.current.cols, terminal.current.rows);
      if (!prefersTouchCodeEditor()) terminal.current.focus();
    }
  }, [running, execution]);
  return <div className="code-live-terminal" ref={host} />;
}
