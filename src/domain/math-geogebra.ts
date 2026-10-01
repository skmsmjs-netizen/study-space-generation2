import type { MathNode } from 'mathjs';
import { expression, type MathScene } from './math-explorer';

export const geoNumber = (value: number) => {
  const text = String(value);
  return /e/i.test(text) ? `(${text.replace(/e([+-]?\d+)$/i, '*10^($1)')})` : text;
};

// Translate the validated AST, not raw input. math.js log(x) is natural,
// while GeoGebra log(x) is decimal and log(base, x) reverses the arguments.
export function geoExpression(source: string, variable: 'x' | 't') {
  const encode = (node: MathNode): string => {
    const n = node as MathNode & {
      value: unknown;
      name: string;
      op: string;
      args: MathNode[];
      content: MathNode;
    };
    switch (node.type) {
      case 'ConstantNode':
        if (typeof n.value !== 'number' || !Number.isFinite(n.value))
          throw Error('실수로 계산되는 수식을 입력해 주세요.');
        return geoNumber(n.value);
      case 'SymbolNode':
        return n.name === variable ? 'u' : n.name === 'e' ? 'exp(1)' : n.name;
      case 'ParenthesisNode':
        return `(${encode(n.content)})`;
      case 'OperatorNode':
        return n.args.length === 1
          ? `(${n.op}${encode(n.args[0])})`
          : `(${n.args.map(encode).join(n.op)})`;
      case 'FunctionNode': {
        const args = n.args.map(encode);
        if (n.name === 'log') {
          if (args.length === 1) return `ln(${args[0]})`;
          if (args.length === 2) return `log(${args[1]},${args[0]})`;
        } else if (args.length === 1) return `${n.name}(${args[0]})`;
        throw Error('이 함수의 인수 개수를 확인해 주세요.');
      }
      default:
        throw Error('이 수식을 그래프로 옮기지 못했습니다.');
    }
  };
  return encode(expression(source, variable).node);
}
export const geoSourceKey = (scene: MathScene) =>
  JSON.stringify(['geogebra-v5', scene.mode, scene.expressions, scene.min, scene.max]);
