import { occurrenceRows } from './list-keys';
import { featureEntityForDialog, featureSurfaceAttributes } from './observatory-feature-identity';
import { Component, forwardRef, useEffect, useId, useRef, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import './tokens.css';
import './components.css';
import { useVisualPresence } from './interaction-motion';
import { BusyDots, FadeContent, NoticeEntrance, SelectionBackground, useSelectionMotionId } from './motion';

const classes = (...values: (string | undefined | false)[]) => values.filter(Boolean).join(' ');

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet' | 'danger'; busy?: boolean };
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = 'secondary', busy = false, disabled, className, type = 'button', children, ...props }, ref) {
  return <button {...props} ref={ref} type={type} disabled={disabled || busy} aria-busy={busy || undefined} className={classes('ui-button', `ui-button--${variant}`, className)}>{busy && <BusyDots />}{children}</button>;
});
export const IconButton = forwardRef<HTMLButtonElement, ButtonProps & { label: string }>(function IconButton({ label, className, children, ...props }, ref) {
  return <Button variant="quiet" {...props} ref={ref} className={classes('ui-icon-button', className)} aria-label={label} title={label}><span aria-hidden="true">{children}</span></Button>;
});

type FieldProps = { label: string; hint?: string; error?: string };
function Field({ id, label, hint, error, children }: FieldProps & { id: string; children: ReactNode }) {
  return <div className="ui-field"><label className="ui-label" htmlFor={id}>{label}</label>{children}{hint && <p id={`${id}-hint`} className="ui-hint">{hint}</p>}{error && <p id={`${id}-error`} className="ui-error" role="alert">{error}</p>}</div>;
}
function description(id: string, hint?: string, error?: string, given?: string) { return classes(given, hint && `${id}-hint`, error && `${id}-error`) || undefined; }
export type InputProps = InputHTMLAttributes<HTMLInputElement> & FieldProps;
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, hint, error, id: givenId, className, 'aria-describedby': describedBy, ...props }, ref) {
  const generatedId = useId(), id = givenId || generatedId;
  return <Field id={id} label={label} hint={hint} error={error}><input {...props} ref={ref} id={id} className={classes('ui-input', className)} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={description(id, hint, error, describedBy)} /></Field>;
});
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps>(function Textarea({ label, hint, error, id: givenId, className, 'aria-describedby': describedBy, ...props }, ref) {
  const generatedId = useId(), id = givenId || generatedId;
  return <Field id={id} label={label} hint={hint} error={error}><textarea {...props} ref={ref} id={id} className={classes('ui-input', className)} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={description(id, hint, error, describedBy)} /></Field>;
});
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & FieldProps>(function Select({ label, hint, error, id: givenId, className, 'aria-describedby': describedBy, children, ...props }, ref) {
  const generatedId = useId(), id = givenId || generatedId;
  return <Field id={id} label={label} hint={hint} error={error}><span className="ui-select"><select {...props} ref={ref} id={id} className={classes('ui-input', className)} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={description(id, hint, error, describedBy)}>{children}</select></span></Field>;
});
export type ChoiceProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: ReactNode };
export function Checkbox({ label, className, indeterminate = false, ...props }: ChoiceProps & { indeterminate?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
  return <label className={classes('ui-choice', className)}><input {...props} ref={ref} type="checkbox" /><span>{label}</span></label>;
}
export function Radio({ label, className, ...props }: ChoiceProps) { return <label className={classes('ui-choice', className)}><input {...props} type="radio" /><span>{label}</span></label>; }

export type TabItem = { id: string; label: string; disabled?: boolean; panelId?: string };
export type TabsProps = { items: TabItem[]; value: string; onChange: (id: string) => void; label?: string; className?: string };
export function Tabs({ items, value, onChange, label = '보기 선택', className }: TabsProps) {
  const motionId = useSelectionMotionId();
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const enabled = items.filter(item => !item.disabled);
  return <div className={classes('ui-tabs', className)} role="tablist" aria-label={label}>{items.map(item => <Button key={item.id} ref={node => { if (node) buttons.current.set(item.id, node); else buttons.current.delete(item.id); }} variant="quiet" role="tab" aria-selected={item.id === value} aria-controls={item.panelId} tabIndex={item.id === value || !enabled.some(entry => entry.id === value) && enabled[0]?.id === item.id ? 0 : -1} disabled={item.disabled} onClick={() => onChange(item.id)} onKeyDown={event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || !enabled.length) return;
    event.preventDefault();
    const index = enabled.findIndex(entry => entry.id === item.id);
    const next = event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled[enabled.length - 1] : enabled[(index + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length];
    onChange(next.id);
    const target = buttons.current.get(next.id);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView?.({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  }}>{item.id === value && <SelectionBackground id={motionId} />}{item.label}</Button>)}</div>;
}
export function SegmentedControl({ items, value, onChange, label = '표시 방식', className }: TabsProps) {
  const motionId = useSelectionMotionId();
  // biome-ignore lint/a11y/useSemanticElements: APG pressed-button group is navigation control grouping, not a form fieldset.
  return <div role="group" aria-label={label} className={classes('ui-segmented', className)}>{items.map(item => <Button key={item.id} variant="quiet" aria-pressed={item.id === value} disabled={item.disabled} onClick={() => onChange(item.id)}>{item.id === value && <SelectionBackground id={motionId} />}{item.label}</Button>)}</div>;
}
export function Card({ className, role, ...props }: HTMLAttributes<HTMLDivElement>) { return <div {...props} role={role ?? (props['aria-label'] || props['aria-labelledby'] ? 'group' : undefined)} className={classes('ui-card', className)} />; }
export function ListItem({ className, ...props }: HTMLAttributes<HTMLLIElement>) { return <li {...props} className={classes('ui-list-item', className)} />; }

export type ModalProps = { open: boolean; title: string; onClose: () => void; children: ReactNode; className?: string; featureDialogMode?: string };
const focusableSelector = 'button:not(:disabled), [href], input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), details > summary:first-of-type, [contenteditable]:not([contenteditable="false"]), [tabindex]:not([tabindex="-1"])';
export function Modal({ open, title, onClose, children, className, featureDialogMode }: ModalProps) {
  const titleId = useId(), dialog = useRef<HTMLDivElement>(null), close = useRef(onClose);
  const backdropPress = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
  const openingControl = useRef<HTMLElement | SVGElement | null>(null);
  const present = useVisualPresence(open, dialog);
  const exitingView = useRef<{ title: string; children: ReactNode; className?: string; featureDialogMode?: string } | null>(null);
  if (open) exitingView.current = { title, children, className, featureDialogMode };
  const view = !open && present ? exitingView.current : null;
  const shownTitle = view?.title ?? title;
  useEffect(() => { if (!present) exitingView.current = null; }, [present]);
  close.current = onClose;
  useEffect(() => {
    if (open) return;
    openingControl.current = null;
    const remember = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest(focusableSelector) : null;
      openingControl.current = target instanceof HTMLElement || target instanceof SVGElement ? target : null;
    };
    const clear = () => { openingControl.current = null; };
    // Safari touch activation need not focus the button that opens a dialog.
    document.addEventListener('pointerdown', remember, true);
    document.addEventListener('pointercancel', clear, true);
    document.addEventListener('keydown', clear, true);
    return () => {
      document.removeEventListener('pointerdown', remember, true);
      document.removeEventListener('pointercancel', clear, true);
      document.removeEventListener('keydown', clear, true);
    };
  }, [open]);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const original = openingControl.current?.isConnected ? openingControl.current
      : document.activeElement instanceof HTMLElement || document.activeElement instanceof SVGElement ? document.activeElement : null;
    openingControl.current = null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const background = [...document.body.children].filter(el => el !== dialog.current?.parentElement);
    const previousInert = background.map(el => el.getAttribute('inert'));
    background.forEach(el => { el.setAttribute('inert', ''); });
    const available = () => [...(dialog.current?.querySelectorAll<HTMLElement>('*') || [])].filter(el => {
      if (!el.matches(focusableSelector) || (el.tabIndex < 0 && !(el.matches('[contenteditable]:not([contenteditable="false"])') && !el.hasAttribute('tabindex'))) || el.matches(':disabled') || el.closest('[hidden], [inert], [aria-hidden="true"]')) return false;
      for (let ancestor: HTMLElement | null = el; ancestor && ancestor !== dialog.current; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        if (ancestor.matches('details:not([open])') && !ancestor.querySelector(':scope > summary')?.contains(el)) return false;
      }
      return true;
    });
    backdropPress.current = null;
    (available()[0] || dialog.current).focus({ preventScroll: true });
    const onFocus = (event: FocusEvent) => {
      if (dialog.current?.closest('[inert]')) return;
      if (event.target instanceof Node && !dialog.current?.contains(event.target)) (available()[0] || dialog.current)?.focus();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (dialog.current?.closest('[inert]')) return;
      if (event.key === 'Escape' && !event.isComposing) { event.preventDefault(); event.stopPropagation(); close.current(); }
      if (event.key !== 'Tab' || event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
      const targets = available(), first = targets[0], last = targets[targets.length - 1];
      if (!first) { event.preventDefault(); dialog.current?.focus(); return; }
      // Safari's default Tab preference can skip buttons. The modal owns its
      // sequence so each available control and the native summary stay reachable.
      event.preventDefault();
      const index = targets.indexOf(document.activeElement as HTMLElement);
      const next = index < 0 ? (event.shiftKey ? last : first)
        : targets[(index + (event.shiftKey ? -1 : 1) + targets.length) % targets.length];
      next.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocus);
    return () => {
      document.removeEventListener('keydown', onKeyDown); document.removeEventListener('focusin', onFocus);
      background.forEach((el, index) => { const before = previousInert[index]; if (before === null) el.removeAttribute('inert'); else el.setAttribute('inert', before); });
      document.body.style.overflow = overflow;
      const usable = (element: HTMLElement | SVGElement | null) => {
        if (!element?.isConnected || element === document.body || element.closest('[hidden], [inert], [aria-hidden="true"]') || element.matches(':disabled')) return false;
        for (let parent: Element | null = element; parent; parent = parent.parentElement) {
          const style = getComputedStyle(parent);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
        }
        return true;
      };
      if (usable(original)) original!.focus({ preventScroll: true });
      else {
        const heading = document.querySelector<HTMLElement>('main h1');
        if (usable(heading)) {
          if (!heading!.hasAttribute('tabindex')) heading!.tabIndex = -1;
          heading!.focus({ preventScroll: true });
        }
      }
    };
  }, [open]);
  if (!present) return null;
  // biome-ignore lint/a11y/noStaticElementInteractions: Backdrop dismissal is optional; the labelled close button and Escape provide keyboard access.
  // biome-ignore lint/a11y/useKeyWithClickEvents: The modal's document key handler owns Escape; the backdrop is not a second tab stop.
  return createPortal(<div className="ui-overlay" data-motion-state={open ? "open" : "closing"} aria-hidden={!open || undefined} inert={!open}
    onPointerDown={event => {
      backdropPress.current = event.target === event.currentTarget && event.button === 0
        ? { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false } : null;
    }}
    onPointerMove={event => {
      const press = backdropPress.current;
      // Eight CSS pixels is a local tap tolerance, not a universal gesture standard.
      if (press && (event.target !== event.currentTarget || Math.hypot(event.clientX - press.x, event.clientY - press.y) > 8)) press.moved = true;
    }}
    onPointerUp={event => {
      // Touch may implicitly capture the pointer; its event target can remain the
      // backdrop even after the finger has crossed into the dialog.
      const hit = document.elementFromPoint?.(event.clientX, event.clientY);
      if (event.target !== event.currentTarget || (hit && hit !== event.currentTarget) || event.pointerId !== backdropPress.current?.id) backdropPress.current = null;
    }}
    onPointerCancel={() => { backdropPress.current = null; }}
    onClick={event => {
      const press = backdropPress.current; backdropPress.current = null;
      if (event.target === event.currentTarget && press && !press.moved) onClose();
    }}><div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={classes('ui-modal', view?.className ?? className)} {...featureSurfaceAttributes(featureEntityForDialog(shownTitle, view?.featureDialogMode ?? featureDialogMode))}><header className="ui-modal-header"><h2 className="ui-modal-title" id={titleId}>{shownTitle}</h2><IconButton label={`${shownTitle} 닫기`} onClick={onClose}>×</IconButton></header>{view ? view.children : children}</div></div>, document.body);
}
export function Sheet(props: ModalProps) { return <Modal {...props} className={classes('ui-sheet', props.className)} />; }
export function Toast({ message, onUndo, onClose }: { message: string; onUndo?: () => void; onClose?: () => void }) {
  return <NoticeEntrance className="ui-toast"><div role="status" aria-live="polite" className="ui-toast-message">{message}</div>{onUndo && <Button variant="quiet" onClick={onUndo}>되돌리기</Button>}{onClose && <IconButton label="알림 닫기" onClick={onClose}>×</IconButton>}</NoticeEntrance>;
}
export type BreadcrumbItem = { label: string; href?: string; onClick?: () => void };
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return <nav aria-label="현재 위치" className="ui-breadcrumb"><ol>{occurrenceRows(items, item => JSON.stringify([item.href, item.label])).map(({value: item, index, key}) => <li key={key}>{index === items.length - 1 ? <span aria-current="page">{item.label}</span> : item.href ? <a href={item.href} onClick={item.onClick}>{item.label}</a> : <button type="button" onClick={item.onClick}>{item.label}</button>}</li>)}</ol></nav>;
}
export function Search({ onQueryChange, onChange, onCompositionStart, onCompositionEnd, ...props }: InputProps & { onQueryChange?: (value: string) => void }) {
  const composing = useRef(false), last = useRef<string | undefined>(undefined);
  useEffect(() => { if (!composing.current && typeof props.value === 'string') last.current = props.value; }, [props.value]);
  const publish = (value: string) => { if (last.current !== value) { last.current = value; onQueryChange?.(value); } };
  return <Input {...props} type="search" onChange={event => { onChange?.(event); if (!composing.current) publish(event.currentTarget.value); }} onCompositionStart={event => { composing.current = true; onCompositionStart?.(event); }} onCompositionEnd={event => { composing.current = false; onCompositionEnd?.(event); publish(event.currentTarget.value); }} />;
}
export function EmptyState({ title, message, children }: { title: string; message?: string; children?: ReactNode }) {
  return <FadeContent><section className="ui-state"><h3 className="ui-state-title">{title}</h3>{message && <p className="ui-state-message">{message}</p>}{children}</section></FadeContent>;
}
export function LoadingState({ message = '불러오고 있습니다.' }: { message?: string }) { return <div role="status" aria-live="polite" aria-busy="true" data-ui-loading="" className="ui-loading"><BusyDots />{message}</div>; }
export function ErrorState({ title = '다시 확인해 주세요', message, onRetry }: { title?: string; message: string; onRetry?: () => void }) {
  return <section className="ui-state ui-state--error"><div role="alert"><h3 className="ui-state-title">{title}</h3><p className="ui-state-message">{message}</p></div>{onRetry && <Button onClick={onRetry}>다시 시도</Button>}</section>;
}

/** Key by workspace and route so one failed screen cannot disable other navigation. */
export class ScreenBoundary extends Component<{ children: ReactNode; onRetry?: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <section data-route-heading="" tabIndex={-1} aria-label="화면을 열지 못했습니다">
      <ErrorState title="이 화면을 열지 못했습니다"
        message="연결을 확인한 뒤 다시 시도해 주세요. 다른 메뉴로 이동할 수도 있습니다. 이미 저장된 기록과 초안은 지우지 않습니다."
        onRetry={this.props.onRetry || (() => window.location.reload())} />
    </section>;
  }
}

export { NavigationBar, type NavigationBarProps, type NavigationItem } from './navigation-bar';
export { ContextMenu, type ContextMenuProps, type ContextMenuItem } from './context-menu';
