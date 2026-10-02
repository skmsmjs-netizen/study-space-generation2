import './navigation-bar.css';

export type NavigationItem = { href: string; label: string; active?: boolean; group?: string };
export type NavigationBarProps = {
  label: string;
  items: NavigationItem[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
};

/** Route links retain native Tab, modifier-click and browser history behavior. */
export function NavigationBar({ label, items, orientation = 'horizontal', className = '' }: NavigationBarProps) {
  const link = (item: NavigationItem) => <a key={item.href} href={item.href}
    data-navigation-focus={`navigation-item:${JSON.stringify([item.href, item.label])}`}
    aria-current={item.active ? 'page' : undefined}>{item.label}</a>;
  const groups = [...new Set(items.map(item => item.group))];
  return <nav aria-label={label} className={`ui-navigation-bar ui-navigation-bar--${orientation} ${className}`}>
    {groups.some(Boolean) ? groups.map(group => <section key={group ?? 'ungrouped'} className="ui-navigation-group" aria-label={group}>
      {group && <p className="ui-navigation-group-label">{group}</p>}
      {items.filter(item => item.group === group).map(link)}
    </section>) : items.map(link)}
  </nav>;
}
