import type { Plugin } from 'vite';
import type { CodeRun } from '../src/domain/model';
export function localCodeRunnerPlugin(): Plugin;
export function compileProgram(
  input: Pick<CodeRun, 'language' | 'code' | 'stdin'>,
  options?: { signal?: AbortSignal },
): Promise<CodeRun>;
