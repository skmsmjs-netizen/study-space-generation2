import type { CanvasContent } from './canvas';

const signature = (value: CanvasContent) => JSON.stringify([value.positions, value.links]);
/** Layout history excludes camera movement and never contains study text. */
export class FlowHistory {
  private past: CanvasContent[] = [];
  private future: CanvasContent[] = [];
  constructor(private readonly limit = 100) {}
  get canUndo() {
    return this.past.length > 0;
  }
  get canRedo() {
    return this.future.length > 0;
  }
  record(before: CanvasContent, after: CanvasContent) {
    if (signature(before) === signature(after)) return;
    this.past.push(structuredClone(before));
    this.past = this.past.slice(-this.limit);
    this.future = [];
  }
  undo(current: CanvasContent) {
    const previous = this.past.pop();
    if (!previous) return null;
    this.future.push(structuredClone(current));
    return { ...previous, viewport: current.viewport };
  }
  redo(current: CanvasContent) {
    const next = this.future.pop();
    if (!next) return null;
    this.past.push(structuredClone(current));
    return { ...next, viewport: current.viewport };
  }
}
