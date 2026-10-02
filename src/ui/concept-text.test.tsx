import { describe, expect, it } from 'vitest';
import katex from 'katex';
import { conceptTextParts } from './concept-text';
describe('source-preserving concept notation', () => {
  it('keeps English articles in prose while retaining explicit and legacy variables', () => {
    for (const source of ['A function describes a relationship.', 'To understand a relationship, keep a condition visible.']) {
      const parts = conceptTextParts(source);
      expect(parts.map(part => part.text).join('')).toBe(source);
      expect(parts.filter(part => /^[aA]$/.test(part.text)).every(part => !part.tex)).toBe(true);
    }
    for (const source of ['$a$ is a variable.', 'a = 2', 'a and b', '상수 a는 2이다.'])
      expect(conceptTextParts(source).some(part => part.tex === 'a')).toBe(true);
  });
  it('keeps a complete expression and exact source while interpreting authored delimiters', () => {
    const source = '비율은 $\\frac{4}{10}=40\\%$이며 $p^2=2q^2$예요.';
    const parts = conceptTextParts(source);
    expect(parts.map((p) => p.text).join('')).toBe(source);
    expect(parts.filter((p) => p.tex).map((p) => p.tex)).toEqual([
      '\\frac{4}{10}=40\\%',
      'p^2=2q^2',
    ]);
    const html = katex.renderToString(parts.find((p) => p.tex)!.tex!, { throwOnError: true });
    expect(html).toContain('<mfrac>');
    expect(
      conceptTextParts('미완성 $x+1')
        .map((p) => p.text)
        .join(''),
    ).toBe('미완성 $x+1');
    expect(conceptTextParts('\\(\\sqrt{2}\\)').at(0)?.tex).toBe('\\sqrt{2}');
  });
  it('preserves variable italics and upright squared physical units separately', () => {
    expect(conceptTextParts('p²').at(0)?.tex).toBe('p^{2}');
    expect(conceptTextParts('5m²').find((p) => p.tex)?.tex).toBe('\\mathrm{m}^{2}');
  });
  it('keeps Korean, punctuation and exact units while rendering each supported notation', () => {
    const cases = [
      '질량100kg · 속도 Δv=ve ln(m0/mf)',
      '열원600K/300K와 Tc/Th',
      'Zn²⁺와 H2O · x1/h2',
      '1/3Hz · cos2πt와 σxσp',
      '<script>alert(1)</script>',
      '단순한 한글 설명은 그대로 읽어요.',
    ];
    for (const source of cases) {
      const parts = conceptTextParts(source);
      expect(parts.map((p) => p.text).join('')).toBe(source);
      for (const part of parts)
        if (part.tex) {
          const rendered = katex.renderToString(part.tex, {
            throwOnError: true,
            trust: false,
            maxExpand: 1000,
          });
          expect(rendered).toContain('katex');
          expect(rendered).toContain('MathML');
          expect(rendered).not.toContain('<script');
        }
    }
    expect(conceptTextParts('100kg').find((p) => p.text === 'kg')?.tex).toBe('\\mathrm{kg}');
    expect(conceptTextParts('x1').at(0)?.tex).toBe('x_{1}');
    expect(conceptTextParts('Δv').at(0)?.tex).toBe('\\Delta v');
  });
});
