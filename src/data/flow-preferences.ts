import { useState } from 'react';
import type { AppState } from '../domain/model';
import { storagePrefix } from './repository';
import { readRescuedDraft, storeDraftSafely, archiveDamagedDraft } from './draft-safety';

export interface FlowPreferences {
  version: 1;
  minimap: 'auto' | 'show' | 'hide';
  snap: boolean;
  mode: 'move' | 'select';
  background: 'dots' | 'lines' | 'cross' | 'none';
  edgeStyle: 'smoothstep' | 'bezier' | 'straight' | 'step';
  layout: 'auto' | 'force' | 'hierarchy';
  nodeWidths: Record<string, number>;
}
export const defaultFlowPreferences: FlowPreferences = {
  version: 1,
  minimap: 'auto',
  snap: false,
  mode: 'move',
  background: 'dots',
  edgeStyle: 'smoothstep',
  layout: 'auto',
  nodeWidths: {},
};
export const flowPreferencesKey = (
  owner: Pick<AppState, 'namespace' | 'userId'>,
  surface: string,
) => `${storagePrefix(owner)}:flow-tools:${encodeURIComponent(surface)}:v1`;
export function readFlowPreferences(
  key: string,
  defaults: Partial<FlowPreferences> = {},
): FlowPreferences {
  const raw = readRescuedDraft(key, { scope: 'device' }) ?? localStorage.getItem(key);
  if (raw === null) return { ...defaultFlowPreferences, ...defaults };
  const value = JSON.parse(raw) as FlowPreferences;
  if (
    value?.version !== 1 ||
    !['auto', 'show', 'hide'].includes(value.minimap) ||
    typeof value.snap !== 'boolean' ||
    !['move', 'select'].includes(value.mode) ||
    !['dots', 'lines', 'cross', 'none'].includes(value.background) ||
    !['smoothstep', 'bezier', 'straight', 'step'].includes(value.edgeStyle)
  )
    throw Error('보기 도구 설정을 읽지 못했습니다. 기존 원문은 보존했습니다.');
  if (value.layout !== undefined && !['auto', 'force', 'hierarchy'].includes(value.layout))
    throw Error('관계 배치 설정을 읽지 못했습니다. 기존 원문은 보존했습니다.');
  if (
    value.nodeWidths !== undefined &&
    (!value.nodeWidths ||
      Array.isArray(value.nodeWidths) ||
      typeof value.nodeWidths !== 'object' ||
      Object.values(value.nodeWidths).some(
        (width) => !Number.isFinite(width) || width < 240 || width > 1000,
      ))
  )
    throw Error('카드 너비 설정을 읽지 못했습니다. 기존 원문은 보존했습니다.');
  return { ...value, layout: value.layout ?? 'auto', nodeWidths: value.nodeWidths ?? {} };
}
export function useFlowPreferences(key: string, defaults: Partial<FlowPreferences> = {}) {
  const load = () => {
    try {
      return { key, value: readFlowPreferences(key, defaults), error: '', blocked: false };
    } catch {
      return {
        key,
        value: { ...defaultFlowPreferences, ...defaults },
        error: '보기 도구 설정을 읽지 못했습니다. 기존 원문은 보존했습니다.',
        blocked: true,
      };
    }
  };
  const [state, setState] = useState(load);
  // Owner changes restart this small setting state before React commits a view.
  const current = state.key === key ? state : load();
  if (state.key !== key) setState(current);
  const store = (next: FlowPreferences) => {
    if (current.blocked) {
      setState({ ...current, value: next });
      return;
    }
    try {
      storeDraftSafely(key, JSON.stringify(next));
      setState({ ...current, value: next, error: '' });
    } catch {
      setState({
        ...current,
        value: next,
        error:
          '보기 도구 설정을 저장하지 못했습니다. 현재 화면은 유지했습니다. 저장을 다시 시도해 주세요.',
      });
    }
  };
  const reset = () => {
    try {
      if (current.blocked) archiveDamagedDraft(key, 'React Flow 보기 도구 설정');
      const next = { ...defaultFlowPreferences, ...defaults };
      storeDraftSafely(key, JSON.stringify(next));
      setState({ key, value: next, error: '', blocked: false });
    } catch {
      setState({
        ...current,
        error: '설정 초기화를 완료하지 못했습니다. 기존 원문은 유지했습니다.',
      });
    }
  };
  return { value: current.value, store, reset, error: current.error, blocked: current.blocked };
}
