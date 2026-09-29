import { forwardRef, useEffect, useId, useRef, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import './tokens.css';
import './components.css';

const classes = (...values: (string | undefined | false)[]) => values.filter(Boolean).join(' ');

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet' | 'danger'; busy?: boolean };
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = 'secondary', busy = false, disabled, className, type = 'button', ...props }, ref) {
  return <button {...props} ref={ref} type={type} disabled={disabled || busy} aria-busy={busy || undefined} className={classes('ui-button', `ui-button--${variant}`, className)} />;
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
  return <Field id={id} label={label} hint={hint} error={error}><select {...props} ref={ref} id={id} className={classes('ui-input', className)} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={description(id, hint, error, describedBy)}>{children}</select></Field>;
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
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const enabled = items.filter(item => !item.disabled);
  return <div className={classes('ui-tabs', className)} role="tablist" aria-label={label}>{items.map(item => <Button key={item.id} ref={node => { if (node) buttons.current.set(item.id, node); else buttons.current.delete(item.id); }} variant="quiet" role="tab" aria-selected={item.id === value} aria-controls={item.panelId} tabIndex={item.id === value || !enabled.some(entry => entry.id === value) && enabled[0]?.id === item.id ? 0 : -1} disabled={item.disabled} onClick={() => onChange(item.id)} onKeyDown={event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || !enabled.length) return;
    event.preventDefault();
    const index = enabled.findIndex(entry => entry.id === item.id);
    const next = event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled[enabled.length - 1] : enabled[(index + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length];
    onChange(next.id); buttons.current.get(next.id)?.focus();
  }}>{item.label}</Button>)}</div>;
}
export function SegmentedControl({ items, value, onChange, label = '표시 방식', className }: TabsProps) {
  return <div role="group" aria-label={label} className={classes('ui-segmented', className)}>{items.map(item => <Button key={item.id} variant="quiet" aria-pressed={item.id === value} disabled={item.disabled} onClick={() => onChange(item.id)}>{item.label}</Button>)}</div>;
}
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div {...props} className={classes('ui-card', className)} />; }
export function ListItem({ className, ...props }: HTMLAttributes<HTMLLIElement>) { return <li {...props} className={classes('ui-list-item', className)} />; }

export type ModalProps = { open: boolean; title: string; onClose: () => void; children: ReactNode; className?: string };
const focusableSelector = 'button:not(:disabled), [href], input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
export function Modal({ open, title, onClose, children, className }: ModalProps) {
  const titleId = useId(), dialog = useRef<HTMLDivElement>(null), close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open || !dialog.current) return;
    const original = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const available = () => [...(dialog.current?.querySelectorAll<HTMLElement>('*') || [])].filter(el => el.matches(focusableSelector) && !el.closest('[hidden], [inert]') && el.getAttribute('aria-hidden') !== 'true' && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden');
    (available()[0] || dialog.current).focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.isComposing) { event.preventDefault(); event.stopPropagation(); close.current(); }
      if (event.key !== 'Tab') return;
      const targets = available(), first = targets[0], last = targets[targets.length - 1];
      if (!first) { event.preventDefault(); dialog.current?.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !dialog.current?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.current?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = overflow; if (original?.isConnected) original.focus(); };
  }, [open]);
  if (!open) return null;
  return createPortal(<div className="ui-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={classes('ui-modal', className)}><header className="ui-modal-header"><h2 className="ui-modal-title" id={titleId}>{title}</h2><IconButton label={`${title} 닫기`} onClick={onClose}>×</IconButton></header>{children}</div></div>, document.body);
}
export function Sheet(props: ModalProps) { return <Modal {...props} className={classes('ui-sheet', props.className)} />; }
export function Toast({ message, onUndo, onClose }: { message: string; onUndo?: () => void; onClose?: () => void }) {
  return <div className="ui-toast"><div role="status" aria-live="polite" className="ui-toast-message">{message}</div>{onUndo && <Button variant="quiet" onClick={onUndo}>되돌리기</Button>}{onClose && <IconButton label="알림 닫기" onClick={onClose}>×</IconButton>}</div>;
}
export type BreadcrumbItem = { label: string; href?: string; onClick?: () => void };
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return <nav aria-label="현재 위치" className="ui-breadcrumb"><ol>{items.map((item, index) => <li key={`${index}:${item.label}`}>{index === items.length - 1 ? <span aria-current="page">{item.label}</span> : item.href ? <a href={item.href} onClick={item.onClick}>{item.label}</a> : <button type="button" onClick={item.onClick}>{item.label}</button>}</li>)}</ol></nav>;
}
export function Search({ onQueryChange, onChange, onCompositionStart, onCompositionEnd, ...props }: InputProps & { onQueryChange?: (value: string) => void }) {
  const composing = useRef(false), last = useRef<string | undefined>(undefined);
  const publish = (value: string) => { if (last.current !== value) { last.current = value; onQueryChange?.(value); } };
  return <Input {...props} type="search" onChange={event => { onChange?.(event); if (!composing.current) publish(event.currentTarget.value); }} onCompositionStart={event => { composing.current = true; onCompositionStart?.(event); }} onCompositionEnd={event => { composing.current = false; onCompositionEnd?.(event); publish(event.currentTarget.value); }} />;
}
export function EmptyState({ title, message, children }: { title: string; message?: string; children?: ReactNode }) {
  return <section className="ui-state"><h3 className="ui-state-title">{title}</h3>{message && <p className="ui-state-message">{message}</p>}{children}</section>;
}
export function LoadingState({ message = '불러오고 있습니다.' }: { message?: string }) { return <div role="status" aria-live="polite" className="ui-loading">{message}</div>; }
export function ErrorState({ title = '다시 확인해 주세요', message, onRetry }: { title?: string; message: string; onRetry?: () => void }) {
  return <section className="ui-state ui-state--error"><div role="alert"><h3 className="ui-state-title">{title}</h3><p className="ui-state-message">{message}</p></div>{onRetry && <Button onClick={onRetry}>다시 시도</Button>}</section>;
}

export { NavigationBar, type NavigationBarProps, type NavigationItem } from './navigation-bar';
export { ContextMenu, type ContextMenuProps, type ContextMenuItem } from './context-menu';
