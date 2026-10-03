import katex from 'katex';

// Plotly accepts sub/sup markup but does not use the app's KaTeX renderer.
// Read the already-parsed MathML instead of stripping TeX command names.
export function physicsAxisLabel(tex: string): string {
  const document = new DOMParser().parseFromString(katex.renderToString(tex, { output: 'mathml', throwOnError: true }), 'text/html');
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const read = (node: Element): string => {
    const children = [...node.children];
    const at = (index: number) => children[index] ? read(children[index]) : '';
    switch (node.localName) {
      case 'annotation': return '';
      case 'semantics': return at(0);
      case 'msub': return `${at(0)}<sub>${at(1)}</sub>`;
      case 'msup': return `${at(0)}<sup>${at(1)}</sup>`;
      case 'msubsup': return `${at(0)}<sub>${at(1)}</sub><sup>${at(2)}</sup>`;
      case 'mfrac': return `(${at(0)})/(${at(1)})`;
      case 'msqrt': return `√(${children.map(read).join('')})`;
      case 'mspace': return ' ';
      case 'mover': return `${at(0)}${children[1]?.textContent === '→' ? '⃗' : escape(children[1]?.textContent ?? '')}`;
      case 'mi': {
        const value = node.textContent ?? '';
        return escape(node.getAttribute('mathvariant') === 'script' && value === 'E' ? 'ℰ' : value);
      }
      default: return children.length ? children.map(read).join('') : escape(node.textContent ?? '');
    }
  };
  const math = document.querySelector('math');
  return math ? read(math).replace(/\s+/g, ' ').trim() : '';
}
