import { describe, expect, it } from 'vitest';
import katex from 'katex';
import {
  DEFAULT_READING,
  EXAMPLE_IDS,
  STEP_IDS,
  SERIES_EXAMPLES,
  canReachStep,
  integralComparison,
  reasoningSteps,
} from './integral-reasoning';

describe('integral test reasoning safeguards', () => {
  it('does not convert a failed positivity condition into divergence', () => {
    expect(canReachStep('alternating', DEFAULT_READING, 'positive')).toBe(true);
    expect(canReachStep('alternating', DEFAULT_READING, 'integral')).toBe(false);
    expect(canReachStep('alternating', DEFAULT_READING, 'conclusion')).toBe(false);
    const next = { ...DEFAULT_READING, absolute: true };
    expect(canReachStep('alternating', next, 'conclusion')).toBe(true);
    expect(reasoningSteps('alternating', next).at(-1)?.outcome).toContain('절대수렴');
  });
  it('recognizes proven divergence at the necessary condition, and a discontinuous extension as a change of method', () => {
    expect(canReachStep('nonzero', DEFAULT_READING, 'term')).toBe(true);
    expect(canReachStep('nonzero', DEFAULT_READING, 'method')).toBe(false);
    expect(
      reasoningSteps('nonzero', DEFAULT_READING).find((s) => s.id === 'term')?.outcome,
    ).toContain('원래 급수는 발산');
    const jump = { ...DEFAULT_READING, badExtension: true };
    expect(canReachStep('log-square', jump, 'continuous')).toBe(true);
    expect(canReachStep('log-square', jump, 'integral')).toBe(false);
    expect(
      reasoningSteps('log-square', jump).find((s) => s.id === 'continuous')?.outcome,
    ).toContain('발산을 뜻하지');
  });
  it('requires an explicit change of tail before integrating the initially increasing function', () => {
    expect(canReachStep('eventual', DEFAULT_READING, 'decreasing')).toBe(true);
    expect(canReachStep('eventual', DEFAULT_READING, 'integral')).toBe(false);
    const tail = { ...DEFAULT_READING, tail: true };
    expect(canReachStep('eventual', tail, 'integral')).toBe(true);
    const steps = reasoningSteps('eventual', tail);
    expect(steps.find((s) => s.id === 'integral')?.evidence[0]).toContain('\\int_{3}');
    expect(steps.at(-1)?.evidence.join(' ')).toContain('\\frac{\\ln2}{2}');
    expect(steps.at(-1)?.outcome).toContain('원래 급수도 발산');
  });
  it('keeps unknown evidence and an inconclusive ratio distinct from failed conditions', () => {
    const pending = { ...DEFAULT_READING, pending: 'continuous' as const };
    expect(reasoningSteps('log-square', pending).find((s) => s.id === 'continuous')?.state).toBe(
      'unknown',
    );
    expect(canReachStep('log-square', pending, 'decreasing')).toBe(false);
    expect(canReachStep('log-square', pending, 'positive')).toBe(true);
    const ratio = { ...DEFAULT_READING, method: 'ratio' as const };
    expect(reasoningSteps('log-square', ratio).find((s) => s.id === 'method')?.outcome).toContain(
      '판정 불가',
    );
    expect(canReachStep('log-square', ratio, 'conclusion')).toBe(false);
    expect(reasoningSteps('geometric', ratio).find((s) => s.id === 'method')?.outcome).toContain(
      '수렴',
    );
  });
  it('distinguishes the finite integral from the series sum and supports both outcomes', () => {
    const convergence = reasoningSteps('log-square', DEFAULT_READING);
    expect(convergence.find((s) => s.id === 'integral')?.evidence.at(-1)).toBe('I=\\frac1{\\ln2}');
    expect(convergence.at(-1)?.outcome).toContain('급수의 합으로 쓰면 안');
    expect(reasoningSteps('log', DEFAULT_READING).at(-1)?.outcome).toBe('원래 급수는 발산합니다.');
  });
  it('bounds the exact finite integral and agrees with independent Simpson quadrature for every displayed interval', () => {
    for (const id of EXAMPLE_IDS.filter((id) => id !== 'nonzero')) {
      const reading = {
        ...DEFAULT_READING,
        absolute: id === 'alternating',
        tail: id === 'eventual',
      };
      for (let count = 3; count <= 12; count++) {
        const { lower, upper, right, area, left, f } = integralComparison(id, reading, count);
        expect(right).toBeLessThanOrEqual(area);
        expect(area).toBeLessThanOrEqual(left);
        const segments = 2000,
          h = (upper - lower) / segments;
        let quadrature = f(lower) + f(upper);
        for (let i = 1; i < segments; i++) quadrature += (i % 2 ? 4 : 2) * f(lower + i * h);
        expect(Math.abs(area - (quadrature * h) / 3)).toBeLessThan(0.000001);
      }
    }
    expect(() => integralComparison('alternating', DEFAULT_READING, 7)).toThrow();
    expect(() => integralComparison('eventual', DEFAULT_READING, 7)).toThrow();
    for (const id of ['log', 'eventual'] as const)
      expect(
        reasoningSteps(id, { ...DEFAULT_READING, tail: id === 'eventual' })
          .at(-1)
          ?.evidence.some((tex) => tex.includes('\\ne\\int')),
      ).toBe(false);
  });
  it('renders every example and reachable branch formula as valid LaTeX with MathML', () => {
    const expressions = new Set<string>();
    for (const id of EXAMPLE_IDS) {
      expect(katex.renderToString(SERIES_EXAMPLES[id].tex, { throwOnError: true })).toContain(
        '<math',
      );
      for (const method of ['integral', 'ratio', 'alternating', 'geometric'] as const)
        for (const absolute of [false, true])
          for (const tail of [false, true]) {
            const reading = { ...DEFAULT_READING, method, absolute, tail };
            const steps = reasoningSteps(id, reading);
            expect(steps.map((s) => s.id)).toEqual(
              id === 'nonzero' ? ['goal', 'term'] : [...STEP_IDS],
            );
            for (const step of steps.filter((s) => canReachStep(id, reading, s.id)))
              for (const tex of step.evidence) expressions.add(tex);
          }
      for (const step of reasoningSteps(id, { ...DEFAULT_READING, badExtension: true }))
        for (const tex of step.evidence) expressions.add(tex);
    }
    for (const tex of expressions)
      expect(katex.renderToString(tex, { throwOnError: true, trust: false })).toContain('<math');
  });
});
