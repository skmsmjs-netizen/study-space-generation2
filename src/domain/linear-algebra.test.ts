import { describe, expect, it } from 'vitest';
import katex from 'katex';
import {
  determinant,
  displayNumber,
  parseMatrix,
  rref,
  qr,
  lu,
  smallSvd,
  symmetricEigen,
  multiply,
  transpose,
  norm,
  observeLinear,
  type Matrix,
  type LinearKind,
} from './linear-algebra';
import { LINEAR_SPECS, LINEAR_FORMULAS } from './linear-algebra-specs';
import { LINEAR_READING } from './linear-algebra-reading';
import { linearUnit } from './linear-algebra-units';
import catalog from './linear-algebra-catalog.json';
const distance = (a: Matrix, b: Matrix) => norm(a.flat().map((v, i) => v - b.flat()[i]));
describe('선형대수 수치와 적용 조건', () => {
  it('정적 읽기 수식의 실제 LaTeX와 전체 개념의 연결 계약을 확인한다', () => {
    for (const tex of Object.values(LINEAR_FORMULAS))
      expect(() => katex.renderToString(tex, { throwOnError: true, trust: false })).not.toThrow();
    for (const note of Object.values(LINEAR_READING))
      for (const tex of note.tex ?? [])
        expect(() => katex.renderToString(tex, { throwOnError: true, trust: false })).not.toThrow();
    for (const c of catalog.concepts) {
      const unit = linearUnit(c.id);
      expect(unit.question).toBeTruthy();
      expect(unit.sourceLocations.every(Boolean)).toBe(true);
      expect(unit.originalQuestion).toBeNull();
      if (unit.classification === '부분 대응') expect(unit.remaining.length).toBeGreaterThan(0);
    }
  });

  it('교환 피벗을 포함한 소거는 같은 유일해를 얻는다', () => {
    const r = rref(
      [
        [0, 2, 4],
        [1, 3, 7],
      ],
      2,
    );
    expect(r.matrix).toEqual([
      [1, 0, 1],
      [0, 1, 2],
    ]);
    expect(r.pivots).toEqual([0, 1]);
    expect(r.steps.some((s) => s.operation.includes('↔'))).toBe(true);
  });
  it('모순·자유변수를 구별한다', () => {
    expect(
      observeLinear('elimination', {}, '1 1 1\n2 2 3').readouts.find((x) => x.label === '해의 상태')
        ?.value,
    ).toContain('해 없음');
    expect(
      observeLinear('elimination', {}, '1 1 1\n2 2 2').readouts.find((x) => x.label === '해의 상태')
        ?.value,
    ).toContain('자유변수');
  });
  it('행렬식의 부호와 특이 경계를 보존한다', () => {
    expect(
      determinant([
        [0, 1],
        [1, 0],
      ]),
    ).toBe(-1);
    expect(observeLinear('determinant', { t: 0 }, '').tex.join('')).not.toContain('A^{-1}');
    expect(
      observeLinear('determinant', { t: -2 }, '').readouts.find((x) => x.label === '부호 없는 넓이')
        ?.value,
    ).toBe('2');
  });
  it('입력 빈 칸·잘못된 차원·비유한 값을 거부한다', () => {
    for (const raw of ['', '1,,2', '1\n\n2', '1 2\n3', 'NaN', 'Infinity'])
      expect(() => parseMatrix(raw)).toThrow();
    expect(parseMatrix('1, 2\n3, 4')).toEqual([
      [1, 2],
      [3, 4],
    ]);
    expect(() => multiply([[1, 2]], [[1]])).toThrow();
  });
  it('과학 표기와 반올림은 값의 자릿수를 훼손하지 않는다', () => {
    expect(displayNumber(1.23456789e-10)).toBe('1.23e-10');
    expect(displayNumber(1.23456789)).toBe('1.23');
    expect(1.23456789).toBeGreaterThan(Number(displayNumber(1.23456789)));
    expect(displayNumber(-0)).toBe('0');
  });
  it('얇은 QR은 재구성과 QᵀQ=I를 보존하며 종속 열을 거부한다', () => {
    const A = [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      { Q, R } = qr(A);
    expect(distance(A, multiply(Q, R))).toBeLessThan(1e-12);
    expect(
      distance(multiply(transpose(Q), Q), [
        [1, 0],
        [0, 1],
      ]),
    ).toBeLessThan(1e-12);
    expect(() =>
      qr([
        [1, 2],
        [2, 4],
      ]),
    ).toThrow();
    expect(Q.length).toBe(3);
  });
  it('LU는 교환이 필요한 경우 PA=LU를 확인한다', () => {
    for (const A of [
      [
        [0, 2],
        [1, 3],
      ],
      [
        [0, 2, 1],
        [1, 1, 0],
        [3, 2, 1],
      ],
    ]) {
      const d = lu(A);
      expect(distance(multiply(d.P, A), multiply(d.L, d.U))).toBeLessThan(1e-12);
    }
    expect(() =>
      lu([
        [1, 2],
        [2, 4],
      ]),
    ).toThrow();
  });
  it('대칭 고유분해는 고유쌍과 직교성을 확인한다', () => {
    const A = [
        [2, 1],
        [1, 2],
      ],
      e = symmetricEigen(A),
      D = e.values.map((v, i) => e.values.map((_, j) => (i === j ? v : 0)));
    expect(distance(multiply(A, e.vectors), multiply(e.vectors, D))).toBeLessThan(1e-12);
    expect(() =>
      symmetricEigen([
        [1, 1],
        [0, 1],
      ]),
    ).toThrow();
  });
  it.each([
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [1, 2, 3],
      [2, 4, 6],
    ],
    [
      [0, 0],
      [0, 0],
    ],
    [
      [1, 0, 0],
      [0, 2, 0],
    ],
  ])('직사각·종속·영행렬 SVD 재구성 %j', (row1, ...rest) => {
    const A = [row1, ...rest] as Matrix;
    const s = smallSvd(A, Math.min(A.length, A[0].length));
    expect(distance(A, multiply(multiply(s.U, s.Sigma), transpose(s.V)))).toBeLessThan(1e-7);
    expect(s.error).toBeLessThan(1e-7);
  });
  it('정사영 잔차는 부분공간에 수직이다', () => {
    for (const t of [-5, 0, 1, 5])
      expect(
        Math.abs(
          Number(
            observeLinear('projection', { t }, '').readouts.find((x) => x.label === '직교 확인 r·u')
              ?.value,
          ),
        ),
      ).toBeLessThan(1e-12);
  });
  it('복소 고유값·반복 고유값의 조건을 구별한다', () => {
    expect(observeLinear('eigen', {}, '0 -1\n1 0').readouts[0].value).toContain('복소수');
    expect(observeLinear('eigen', {}, '1 0\n0 1').readouts.at(-1)?.value).toContain('2개');
    expect(observeLinear('eigen', {}, '1 1\n0 1').readouts.at(-1)?.value).toContain('부족');
  });
  it('마르코프는 확률을 보존하고 정규성 실패를 발산으로 바꾸지 않는다', () => {
    for (const t of [0, 0.2, 1]) {
      const r = observeLinear('markov', { t, n: 30 }, '');
      expect(Number(r.readouts[0].value)).toBeCloseTo(1, 12);
      expect(
        r.lines
          .flatMap((l) => l.points)
          .filter((p) => p !== null)
          .every((p) => p[1] >= 0 && p[1] <= 1),
      ).toBe(true);
    }
    expect(observeLinear('markov', { t: 0, n: 2 }, '').readouts[1].value).not.toContain('발산');
  });
  it('0회 거듭제곱법도 현재 레일리 몫을 계산한다', () => {
    expect(
      Number(observeLinear('power', { t: 0, n: 0 }, '2 1\n1 2').tex.at(-1)?.split('=').at(-1)),
    ).toBe(2);
  });
  it('이산 상태 좌표와 연속 시간 좌표를 분리한다', () => {
    const r = observeLinear('dynamics', { t: 1, n: 3 }, '');
    expect(r.lines).toHaveLength(1);
    expect(r.secondaryPlot?.lines).toHaveLength(1);
    expect(r.steps.at(-1)?.matrix).toEqual([[4], [1]]);
  });
  it('모든 관찰의 실제 LaTeX를 엄격 렌더링하고 유한 결과를 확인한다', () => {
    for (const [kind, spec] of Object.entries(LINEAR_SPECS)) {
      if (kind === 'static') continue;
      const result = observeLinear(
        kind as LinearKind,
        { t: spec.t?.value ?? 2, n: spec.n?.value ?? 4 },
        spec.matrix ?? '',
        spec.auxiliary?.value ?? '',
        spec.modes?.[0]?.value ?? '',
      );
      for (const tex of result.tex) {
        expect(
          () =>
            katex.renderToString(tex, {
              throwOnError: true,
              trust: false,
              output: 'htmlAndMathml',
            }),
          `${kind}: ${tex}`,
        ).not.toThrow();
      }
      expect(
        result.lines
          .flatMap((l) => l.points)
          .filter((p) => p !== null)
          .flat()
          .every(Number.isFinite),
        kind,
      ).toBe(true);
    }
  });
});
