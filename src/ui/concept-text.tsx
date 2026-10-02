import { MathFormula } from './math-formula';
type ConceptTextPart = { text: string; tex?: string; explicit?: boolean };
/** Explicit math belongs to an authored edition; legacy notation remains readable.
 * Keep the complete source slice, including delimiters, for preservation checks.
 * Unclosed delimiters remain ordinary text rather than consuming the paragraph. */
export function conceptTextParts(text: string): ConceptTextPart[] {
  const expressions =
    /(?<!\\)(\$\$)([\s\S]+?)\$\$|(?<![\\$])\$(?!\$)([^$\n]+?)\$(?!\$)|\\\(([\s\S]+?)\\\)/g;
  const result: ConceptTextPart[] = [];
  let start = 0;
  for (const match of text.matchAll(expressions)) {
    const index = match.index ?? 0;
    if (index > start) result.push(...legacyConceptTextParts(text.slice(start, index)));
    result.push({ text: match[0], tex: (match[2] ?? match[3] ?? match[4]).trim(), explicit: true });
    start = index + match[0].length;
  }
  if (start < text.length) result.push(...legacyConceptTextParts(text.slice(start)));
  return result;
}
/** Only typographical tokens: this does not infer a law or compute a result. */
function legacyConceptTextParts(text: string): ConceptTextPart[] {
  const pattern =
    /[A-Za-z]+[0-9]*(?:[A-Za-z]+[0-9]*)*(?:[²³⁺⁻]+)?|[α-ωΑ-Ω](?:[A-Za-z][0-9]*)?|[×÷≤≥≠≈∞π√]/g;
  const parts: ConceptTextPart[] = [];
  let start = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > start) parts.push({ text: text.slice(start, index) });
    const token = match[0];
    // English articles are prose. Only explicit math delimiters or mathematical
    // context should turn this common word into a differently styled variable.
    // Legacy "a = 2" and Korean variable explanations retain their math role.
    if (/^[aA]$/.test(token) && /^\s+(?!(?:and|or|is|equals|denotes)\b)[A-Za-z]{2,}\b/i.test(text.slice(index + token.length))) {
      const before = text.slice(0, index);
      if (/(?:^|[.!?:]\s+|[A-Za-z]{2,}\s+)$/.test(before)) {
        parts.push({ text: token });
        start = index + token.length;
        continue;
      }
    }
    if (
      /^[A-Za-z]/.test(token) &&
      !/^(?:[A-Z]{2,12}|[A-Za-z][0-9]+|[A-Za-z][²³⁺⁻]*|kg|ms|nm|km|Hz|Pa|MW|MWh|MJ|MB|mL|ml|Tc|Th|mf|m0|ve|hbar|sin[0-9]*|cos[0-9]*|tan[0-9]*|ln[0-9]*|log[0-9]*|exp[0-9]*|H2O|H2O2|CO2|O2|CH4|Cas9|Zn[²³⁺⁻]*|Cu[²³⁺⁻]*)$/.test(
        token,
      )
    ) {
      parts.push({ text: token });
      start = index + token.length;
      continue;
    }
    const symbols: Record<string, string> = {
      '×': '\\times',
      '÷': '\\div',
      '≤': '\\le',
      '≥': '\\ge',
      '≠': '\\ne',
      '≈': '\\approx',
      '∞': '\\infty',
      π: '\\pi',
      '√': '\\surd',
      Δ: '\\Delta',
      σ: '\\sigma',
      η: '\\eta',
      α: '\\alpha',
      β: '\\beta',
      γ: '\\gamma',
      λ: '\\lambda',
      θ: '\\theta',
      μ: '\\mu',
      ρ: '\\rho',
      ω: '\\omega',
      Ω: '\\Omega',
    };
    const specified: Record<string, string> = {
      Tc: 'T_{\\mathrm c}',
      Th: 'T_{\\mathrm h}',
      mf: 'm_{\\mathrm f}',
      m0: 'm_0',
      ve: 'v_{\\mathrm e}',
      H2O: '\\mathrm{H_2O}',
      H2O2: '\\mathrm{H_2O_2}',
      CO2: '\\mathrm{CO_2}',
      O2: '\\mathrm{O_2}',
      CH4: '\\mathrm{CH_4}',
    };
    let tex = symbols[token] ?? specified[token];
    if (!tex && symbols[token[0]]) {
      const suffix = token.slice(1);
      tex = `${symbols[token[0]]}${token[0] === 'σ' ? `_{${suffix}}` : ` ${suffix}`}`;
    }
    if (!tex) {
      const variable = token.match(/^([a-z])([0-9]+)$/);
      const physicalUnit = /^(?:N|J|K|V|W|A|T|Hz|kg|g|m|s|ms|nm|km|L|Pa|MW|MWh|MJ|MB)$/;
      const afterNumber = /[0-9]\s*$/.test(text.slice(0, index));
      if (variable) tex = `${variable[1]}_{${variable[2]}}`;
      else if (token === 'hbar') tex = '\\hbar';
      else if (/^(?:sin|cos|tan|ln|log|exp)[0-9]*$/.test(token)) {
        const op = token.match(/^([a-z]+)([0-9]*)$/)!;
        tex = `\\operatorname{${op[1]}}${op[2]}`;
      } else if (/^[a-z]$/.test(token) && !(physicalUnit.test(token) && afterNumber)) tex = token;
      else {
        // Chemical formulas, units, group names and abbreviations remain upright literal labels.
        const superscript = token.match(/^(.*?)([²³⁺⁻]+)$/);
        const base = superscript?.[1] ?? token;
        const power = superscript?.[2]
          .replaceAll('²', '2')
          .replaceAll('³', '3')
          .replaceAll('⁺', '+')
          .replaceAll('⁻', '-');
        tex = `${/^[a-z]$/.test(base) && !(physicalUnit.test(base) && afterNumber) ? base : `\\mathrm{${base}}`}${power ? `^{${power}}` : ''}`;
      }
    }
    parts.push({ text: token, tex });
    start = index + token.length;
  }
  if (start < text.length) parts.push({ text: text.slice(start) });
  return parts;
}
export function ConceptText({ text }: { text: string }) {
  return (
    <>
      {conceptTextParts(text).map((part, index) =>
        part.tex ? (
          <span
            className="concept-math-token"
            role="math"
            aria-label={part.explicit ? undefined : part.text}
            data-source-token={part.text}
            key={index}
          >
            <MathFormula inline tex={part.tex} />
          </span>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}
