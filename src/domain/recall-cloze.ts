import { DomainError } from './model';
/** Anki cloze syntax, including hints, nested deletions and shared ordinals. */
type Part = string | { numbers: number[]; body: Part[]; hint: string };
function parse(source: string): Part[] {
  if (typeof source !== 'string' || source.length > 100000) throw new DomainError('INVALID_CLOZE', '빈칸 문장을 확인해 주세요.');
  let pos = 0;
  const read = (nested: boolean, depth: number): Part[] => {
    if (depth > 8) throw new DomainError('INVALID_CLOZE', '겹친 빈칸은 여덟 단계까지 사용할 수 있습니다.');
    const parts: Part[] = [];
    let text = '';
    while (pos < source.length) {
      if (nested && source.startsWith('}}', pos)) break;
      const match = source.startsWith('{{c', pos) && source.slice(pos).match(/^\{\{c(\d+(?:,\d+)*)::/);
      if (match) {
        if (text) { parts.push(text); text = ''; }
        const numbers = [...new Set(match[1].split(',').map(Number))];
        if (numbers.some(n => !Number.isSafeInteger(n) || n < 1 || n > 999)) throw new DomainError('INVALID_CLOZE', '빈칸 번호는 1부터 999까지 사용해 주세요.');
        pos += match[0].length;
        const body = read(true, depth + 1);
        if (!source.startsWith('}}', pos)) throw new DomainError('INVALID_CLOZE', '빈칸의 끝에 }}를 붙여 주세요.');
        pos += 2;
        let hint = '';
        const last = body.at(-1);
        if (typeof last === 'string' && last.includes('::')) {
          const split = last.indexOf('::'); hint = last.slice(split + 2); body[body.length - 1] = last.slice(0, split);
        }
        parts.push({ numbers, body, hint });
      } else { text += source[pos++]; }
    }
    if (text) parts.push(text);
    return parts;
  };
  return read(false, 0);
}
export function clozeNumbers(source: string) {
  const numbers = new Set<number>();
  const visit = (parts: Part[]) => { for (const p of parts) if (typeof p !== 'string') { p.numbers.forEach(n => numbers.add(n)); visit(p.body); } };
  visit(parse(source));
  return [...numbers].sort((a, b) => a - b);
}
export function renderCloze(source: string, number: number, revealed = false): string {
  const render = (parts: Part[]): string => parts.map(p => typeof p === 'string' ? p : !revealed && p.numbers.includes(number) ? `[${p.hint || '…'}]` : render(p.body)).join('');
  return render(parse(source));
}
