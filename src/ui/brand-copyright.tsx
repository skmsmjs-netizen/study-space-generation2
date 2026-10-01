import { BRAND } from '../domain/brand';
import './brand-copyright.css';

export function BrandCopyright() {
  return <footer className="brand-copyright">
    <span>© 2026 {BRAND.name}.</span>{' '}
    <span>All rights reserved.</span>
  </footer>;
}
