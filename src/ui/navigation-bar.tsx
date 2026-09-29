import './navigation-bar.css';

export type NavigationItem = { href: string; label: string; active?: boolean };
export type NavigationBarProps = {
  label: string;
  items: NavigationItem[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
};

/** Route links retain native Tab, modifier-click and browser history behavior. */
export function NavigationBar({ label, items, orientation = 'horizontal', className = '' }: NavigationBarProps) {
  return <nav aria-label={label} className={`ui-navigation-bar ui-navigation-bar--${orientation} ${className}`}>
    {items.map(item => <a key={item.href} href={item.href} aria-current={item.active ? 'page' : undefined}>{item.label}</a>)}
  </nav>;
}
