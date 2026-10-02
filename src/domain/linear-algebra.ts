import type { TemplateLine, TemplateResult } from './math-templates';
export type Matrix = number[][];
export type LinearKind =
  | 'determinant'
  | 'elimination'
  | 'projection'
  | 'qr'
  | 'least-squares'
  | 'basis'
  | 'eigen'
  | 'quadratic'
  | 'dynamics'
  | 'markov'
  | 'lu'
  | 'power'
  | 'svd'
  | 'fourier'
  | 'complex'
  | 'operations'
  | 'cross'
  | 'leontief'
  | 'transform'
  | 'static';
export const displayNumber = (n: number) =>
  Object.is(n, -0) ? '0' : Number.isInteger(n) ? String(n) : String(Number(n.toPrecision(7)));
export const transpose = (a: Matrix): Matrix => a[0].map((_, j) => a.map((row) => row[j]));
export const identity = (n: number): Matrix =>
  Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => Number(i === j)));
export const multiply = (a: Matrix, b: Matrix): Matrix => {
  if (a[0].length !== b.length) throw Error('곱의 안쪽 차원이 같아야 한다.');
  return a.map((row) => b[0].map((_, j) => row.reduce((s, v, k) => s + v * b[k][j], 0)));
};
export const norm = (v: number[]) => Math.hypot(...v);
export const dot = (u: number[], v: number[]) => u.reduce((s, x, i) => s + x * v[i], 0);
export const matrixTex = (a: Matrix) =>
  `\\begin{bmatrix}${a.map((row) => row.map(displayNumber).join('&')).join('\\\\')}\\end{bmatrix}`;
export const column = (v: number[]) => v.map((x) => [x]);
export const tolerance = (a: Matrix) => Math.max(1, ...a.flat().map(Math.abs)) * 1e-12;
export function parseMatrix(text: string): Matrix {
  const tokens = text
    .trim()
    .split(/\n|;/)
    .map((line) => line.trim().split(/\s*,\s*|\s+/));
  if (tokens.some((row) => row.some((cell) => !cell.length)))
    throw Error('빈 성분이나 빈 행은 숫자 0으로 처리하지 않는다.');
  const rows = tokens.map((row) => row.map(Number));
  if (
    !rows.length ||
    rows.length > 6 ||
    !rows[0].length ||
    rows[0].length > 7 ||
    rows.some(
      (r) => r.length !== rows[0].length || r.some((x) => !Number.isFinite(x) || Math.abs(x) > 1e6),
    )
  )
    throw Error(
      '같은 길이의 행에 유한한 숫자를 넣어야 한다. 최대 6행·7열, 각 값의 절댓값 10⁶ 이하이다.',
    );
  return rows;
}
export interface RowStep {
  operation: string;
  matrix: Matrix;
}
export function rref(input: Matrix, coefficientColumns = input[0].length) {
  const a = input.map((row) => [...row]),
    steps: RowStep[] = [{ operation: '원래 행렬', matrix: structuredClone(input) }],
    pivots: number[] = [];
  const eps = tolerance(input);
  let r = 0;
  const remember = (operation: string) => steps.push({ operation, matrix: structuredClone(a) });
  for (let c = 0; c < coefficientColumns && r < a.length; c++) {
    let best = r;
    for (let k = r + 1; k < a.length; k++) if (Math.abs(a[k][c]) > Math.abs(a[best][c])) best = k;
    if (Math.abs(a[best][c]) <= eps) continue;
    if (best !== r) {
      [a[best], a[r]] = [a[r], a[best]];
      remember(`R${r + 1} ↔ R${best + 1} · 방정식의 순서만 바뀐다`);
    }
    const p = a[r][c];
    a[r] = a[r].map((x) => x / p);
    remember(`R${r + 1} ÷ ${displayNumber(p)} · 0이 아닌 수로 나누어 같은 해를 유지한다`);
    for (let k = 0; k < a.length; k++)
      if (k !== r && Math.abs(a[k][c]) > eps) {
        const f = a[k][c];
        a[k] = a[k].map((x, j) => x - f * a[r][j]);
        remember(`R${k + 1} − (${displayNumber(f)}) R${r + 1} · 다른 식의 배수를 빼도 같은 해이다`);
      }
    pivots.push(c);
    r++;
  }
  return { matrix: a, pivots, rank: pivots.length, steps, tolerance: eps };
}
export function determinant(a: Matrix): number {
  if (a.length !== a[0].length) throw Error('행렬식에는 정사각행렬이 필요하다.');
  if (a.length === 1) return a[0][0];
  return a[0].reduce(
    (sum, x, j) =>
      sum + (-1) ** j * x * determinant(a.slice(1).map((row) => row.filter((_, k) => k !== j))),
    0,
  );
}
export function qr(a: Matrix) {
  const cols = transpose(a),
    q: number[][] = [],
    r = Array.from({ length: cols.length }, () => Array(cols.length).fill(0));
  for (let j = 0; j < cols.length; j++) {
    let v = [...cols[j]];
    for (let k = 0; k < j; k++) {
      r[k][j] = dot(q[k], v);
      v = v.map((x, i) => x - r[k][j] * q[k][i]);
    }
    r[j][j] = norm(v);
    if (r[j][j] <= tolerance(a))
      throw Error('열들이 수치 허용오차에서 종속이다. 이 얇은 QR의 정규화 조건을 확인해야 한다.');
    q.push(v.map((x) => x / r[j][j]));
  }
  return { Q: transpose(q), R: r };
}
export function lu(a: Matrix) {
  if (a.length !== a[0].length) throw Error('이 LU 관찰에는 정사각행렬을 넣어야 한다.');
  const n = a.length,
    U = structuredClone(a),
    L = identity(n),
    P = identity(n),
    steps: RowStep[] = [];
  for (let j = 0; j < n; j++) {
    let b = j;
    for (let k = j + 1; k < n; k++) if (Math.abs(U[k][j]) > Math.abs(U[b][j])) b = k;
    if (Math.abs(U[b][j]) <= tolerance(a))
      throw Error('0에 가까운 피벗이다. 이 관찰의 유일한 삼각 해법을 적용할 수 없다.');
    if (b !== j) {
      [U[b], U[j]] = [U[j], U[b]];
      [P[b], P[j]] = [P[j], P[b]];
      for (let k = 0; k < j; k++) [L[b][k], L[j][k]] = [L[j][k], L[b][k]];
      steps.push({
        operation: `R${b + 1} ↔ R${j + 1} · P와 이전 L의 계수도 함께 교환`,
        matrix: structuredClone(U),
      });
    }
    for (let k = j + 1; k < n; k++) {
      L[k][j] = U[k][j] / U[j][j];
      U[k] = U[k].map((v, i) => v - L[k][j] * U[j][i]);
      steps.push({
        operation: `R${k + 1} − (${displayNumber(L[k][j])}) R${j + 1}`,
        matrix: structuredClone(U),
      });
    }
  }
  return { L, U, P, steps };
}
/** Jacobi rotations for small real symmetric matrices. A residual is always reported. */
export function symmetricEigen(a: Matrix) {
  const n = a.length;
  if (
    n !== a[0].length ||
    a.some((row, i) => row.some((v, j) => Math.abs(v - a[j][i]) > tolerance(a)))
  )
    throw Error('실수 대칭행렬에만 적용한다.');
  const d = structuredClone(a),
    V = identity(n);
  let iterations = 0;
  for (; iterations < 100 * n * n; iterations++) {
    let p = 0,
      q = 0,
      max = 0;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++)
        if (Math.abs(d[i][j]) > max) {
          p = i;
          q = j;
          max = Math.abs(d[i][j]);
        }
    if (max <= tolerance(a)) break;
    const theta = 0.5 * Math.atan2(2 * d[p][q], d[q][q] - d[p][p]),
      c = Math.cos(theta),
      s = Math.sin(theta);
    const J = identity(n);
    J[p][p] = c;
    J[q][q] = c;
    J[p][q] = s;
    J[q][p] = -s;
    const next = multiply(multiply(transpose(J), d), J),
      v = multiply(V, J);
    for (let i = 0; i < n; i++) {
      d[i] = next[i];
      V[i] = v[i];
    }
  }
  const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => d[j][j] - d[i][i]);
  return {
    values: order.map((i) => d[i][i]),
    vectors: V.map((row) => order.map((i) => row[i])),
    iterations,
  };
}
export function smallSvd(a: Matrix, k: number) {
  const gram = multiply(transpose(a), a),
    e = symmetricEigen(gram),
    singular = e.values.map((x) => (x <= tolerance(gram) ? 0 : Math.sqrt(x))),
    vs = transpose(e.vectors);
  const approx = a.map((row) => row.map(() => 0));
  for (let j = 0; j < Math.min(k, vs.length); j++) {
    const av = multiply(a, column(vs[j])).flat();
    for (let r = 0; r < a.length; r++)
      for (let c = 0; c < a[0].length; c++) approx[r][c] += av[r] * vs[j][c];
  }
  const u: number[][] = [];
  for (let j = 0; j < Math.min(a.length, singular.length); j++) {
    if (singular[j] === 0) continue;
    const v = multiply(a, column(vs[j]))
      .flat()
      .map((x) => x / singular[j]);
    u.push(v);
  }
  for (let i = 0; i < a.length && u.length < a.length; i++) {
    let v = Array.from({ length: a.length }, (_, j) => Number(j === i));
    for (const q of u) {
      const c = dot(q, v);
      v = v.map((x, j) => x - c * q[j]);
    }
    if (norm(v) > 1e-10) u.push(v.map((x) => x / norm(v)));
  }
  const U = transpose(u),
    Sigma = a.map((_, i) => a[0].map((_, j) => (i === j ? (singular[i] ?? 0) : 0)));
  return {
    singular,
    U,
    Sigma,
    V: e.vectors,
    approx,
    error: norm(a.flat().map((x, i) => x - approx.flat()[i])),
  };
}
export interface LinearOutput extends TemplateResult {
  steps: RowStep[];
  explanation: string[];
  matrix?: Matrix;
  secondaryPlot?: TemplateResult;
}
const line = (
  name: string,
  points: number[][],
  role: TemplateLine['role'] = 'curve',
): TemplateLine => ({ name, points: points.map((p) => [p[0], p[1], p[2] ?? 0]), role });
const vector = (name: string, v: number[], role: TemplateLine['role'] = 'curve') =>
  line(name, [[0, 0, 0], v], role);
export function observeLinear(
  kind: LinearKind,
  params: Record<string, number>,
  matrixText: string,
  auxiliary = '',
  mode = '',
): LinearOutput {
  const t = params.t ?? 2,
    n = Math.round(params.n ?? 4),
    out: LinearOutput = {
      tex: [],
      lines: [],
      is3d: false,
      point: null,
      readouts: [],
      notices: [],
      steps: [],
      explanation: [],
    };
  const value = (label: string, x: number | string) =>
    out.readouts.push({ label, value: typeof x === 'number' ? displayNumber(x) : x });
  if (kind === 'static') return out;
  if (kind === 'determinant' || kind === 'transform') {
    const A = [
        [1, 1],
        [0, t],
      ],
      x = [1, 1],
      y = multiply(A, column(x)).flat();
    out.matrix = A;
    out.tex = [
      `A=${matrixTex(A)},\\quad x=${matrixTex(column(x))},\\quad Ax=${matrixTex(column(y))}`,
      `\\det A=t=${displayNumber(t)},\\quad\\text{area}=|t|=${displayNumber(Math.abs(t))}`,
    ];
    out.lines = [
      line(
        '원래 단위 정사각형',
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
        'grid',
      ),
      line('단위 정사각형의 상', [
        [0, 0],
        [1, 0],
        [2, t],
        [1, t],
        [0, 0],
      ]),
      vector('x', x, 'secondary'),
      vector('Ax', y),
    ];
    value('행렬식', t);
    value('부호 없는 넓이', Math.abs(t));
    value('가역성', t === 0 ? '특이 · 이 예제의 rank=1' : '가역 · 이 예제의 rank=2');
    if (t !== 0)
      out.tex.push(
        `A^{-1}=${matrixTex([
          [1, -1 / t],
          [0, 1 / t],
        ])}`,
      );
    out.explanation = [
      '같은 t가 행렬의 성분, 상의 높이, 행렬식에 동시에 나타난다.',
      '음수 t는 방향 반전, t=0은 선으로의 붕괴이다. 유한 그림은 일반 정리의 증명이 아니다.',
    ];
  } else if (kind === 'elimination' || kind === 'basis') {
    const a = parseMatrix(matrixText),
      augmented = kind === 'elimination';
    if (augmented && a[0].length < 2) throw Error('계수와 오른쪽 상수를 함께 넣어야 한다.');
    const c = a[0].length - Number(augmented),
      rr = rref(a, c);
    out.steps = rr.steps;
    out.matrix = a;
    out.tex = [`${augmented ? '[A|b]' : 'A'}=${matrixTex(a)}`, `R=${matrixTex(rr.matrix)}`];
    value('계수 부분의 rank', rr.rank);
    value('열 수 − rank · 영공간 차원', c - rr.rank);
    value('피벗 열', rr.pivots.map((x) => x + 1).join(', ') || '없음');
    if (augmented) {
      const inconsistent = rr.matrix.some(
        (row) =>
          row.slice(0, c).every((x) => Math.abs(x) <= rr.tolerance) &&
          Math.abs(row[c]) > rr.tolerance,
      );
      value(
        '해의 상태',
        inconsistent ? '불일치 · 해 없음' : rr.rank === c ? '유일한 해' : '자유변수가 있는 해',
      );
    }
    out.notices.push(
      `피벗 판정 허용오차 ${rr.tolerance}. 근처의 rank는 수치 판단이며 정확한 기호 rank의 증명이 아니다.`,
    );
    out.explanation = [
      '행 연산은 방정식의 해집합을 보존한다. 열공간의 기저는 소거된 행렬이 아니라 원래 행렬의 피벗 열에서 고른다.',
      '임의 함수·다항식 공간은 선택한 기저의 유한 행렬 표현과 연결해 읽어야 한다.',
    ];
  } else if (kind === 'projection') {
    const u = [1, t],
      b = [2, 1],
      den = dot(u, u),
      p = u.map((x) => (dot(b, u) / den) * x),
      r = b.map((x, i) => x - p[i]);
    out.tex = [
      `u=${matrixTex(column(u))},\\ b=${matrixTex(column(b))}`,
      `p=\\frac{\\langle b,u\\rangle}{\\langle u,u\\rangle}u=${matrixTex(column(p))}`,
      `r=b-p=${matrixTex(column(r))},\\quad\\langle r,u\\rangle=${displayNumber(dot(r, u))}`,
    ];
    out.lines = [
      line('W=span(u)', [u.map((x) => -3 * x), u.map((x) => 3 * x)], 'grid'),
      vector('b', b, 'secondary'),
      vector('정사영 p', p),
      line('잔차 r · p에서 b', [p, b], 'secondary'),
    ];
    value('잔차의 노름', norm(r));
    value('직교 확인 r·u', dot(r, u));
    out.explanation = [
      'u=(1,t)는 0벡터가 아니므로 분모가 양수이다.',
      'b=p+r에서 p는 W에 있고 r은 W에 수직이다. 피타고라스 관계가 최선근사의 근거이다.',
    ];
  } else if (kind === 'qr' || kind === 'least-squares') {
    const a = parseMatrix(matrixText),
      { Q, R } = qr(a);
    out.matrix = a;
    out.tex = [
      `A=${matrixTex(a)}=QR`,
      `Q=${matrixTex(Q)},\\quad R=${matrixTex(R)}`,
      `Q^TQ=${matrixTex(multiply(transpose(Q), Q))}`,
    ];
    value('재구성 잔차 ‖A−QR‖F', norm(a.flat().map((x, i) => x - multiply(Q, R).flat()[i])));
    out.steps = transpose(Q).map((v, i) => ({
      operation: `정규직교 열 q${i + 1} · 이전 방향을 제거한 뒤 정규화`,
      matrix: column(v),
    }));
    if (kind === 'least-squares') {
      const b = Array.from({ length: a.length }, (_, i) => (i === a.length - 1 ? t : i + 1)),
        qTb = multiply(transpose(Q), column(b)),
        x = Array(a[0].length).fill(0);
      for (let i = x.length - 1; i >= 0; i--)
        x[i] = (qTb[i][0] - R[i].reduce((s, v, j) => s + (j > i ? v * x[j] : 0), 0)) / R[i][i];
      const p = multiply(a, column(x)).flat(),
        r = b.map((v, i) => v - p[i]);
      out.tex.push(
        `b=${matrixTex(column(b))},\\quad\\hat x=${matrixTex(column(x))}`,
        `A^T(b-A\\hat x)=${matrixTex(multiply(transpose(a), column(r)))}`,
      );
      value('잔차 ‖b−A x̂‖', norm(r));
      out.explanation = [
        '최소제곱은 정확한 해가 없어도 열공간에서 가장 가까운 상을 찾는다.',
        '이 계산은 열이 독립인 얇은 QR로 계수를 유일하게 구한다. 열이 종속이면 정사영은 유일해도 계수는 유일하지 않을 수 있다.',
      ];
    } else
      out.explanation = [
        '계산은 수정 그람–슈미트이다. 원문의 직교화 관계를 같은 Q·R로 보여준다.',
        '각 열의 잔차가 0이면 정규화할 수 없다. 실제 수치 안정성은 기호적 존재 정리와 구별한다.',
      ];
  } else if (kind === 'operations') {
    const A = parseMatrix(matrixText),
      AT = transpose(A),
      G = multiply(AT, A);
    out.matrix = A;
    out.tex = [
      `A=${matrixTex(A)},\\quad A^T=${matrixTex(AT)}`,
      `A^TA=${matrixTex(G)},\\quad AA^T=${matrixTex(multiply(A, AT))}`,
    ];
    value('A의 크기', `${A.length} × ${A[0].length}`);
    value('AᵀA의 크기', `${A[0].length} × ${A[0].length}`);
    out.explanation = [
      '곱의 순서에 따라 결과의 크기와 값이 달라진다. 안쪽 차원이 맞아야 곱이 정의된다.',
      '(AB)ᵀ=BᵀAᵀ는 합성의 순서가 뒤집히는 법칙이다.',
    ];
  } else if (kind === 'eigen') {
    const A = parseMatrix(matrixText);
    if (A.length !== 2 || A[0].length !== 2) throw Error('이 고유값 관찰은 실수 2×2에 한정한다.');
    const tr = A[0][0] + A[1][1],
      det = determinant(A),
      disc = tr * tr - 4 * det;
    out.matrix = A;
    out.tex = [
      `A=${matrixTex(A)}`,
      `\\det(\\lambda I-A)=\\lambda^2-(${displayNumber(tr)})\\lambda+(${displayNumber(det)})`,
    ];
    if (disc < 0) {
      const real = tr / 2,
        imag = Math.sqrt(-disc) / 2;
      out.tex.push(`\\lambda=${displayNumber(real)}\\pm ${displayNumber(imag)}i`);
      value('선택한 체에서의 조건', '실수 고유벡터 기저 없음 · 복소수에서 서로 다른 두 고유값');
      out.explanation = [
        '실수 고유값이 없다는 것과 복소수에서도 대각화할 수 없다는 것은 다르다.',
        '특성다항식의 중복도와 고유공간 차원을 함께 확인해야 한다.',
      ];
    } else {
      const values = [(tr + Math.sqrt(disc)) / 2, (tr - Math.sqrt(disc)) / 2];
      let total = 0;
      for (const lambda of [...new Set(values)]) {
        const M = A.map((row, i) => row.map((x, j) => x - (i === j ? lambda : 0))),
          rr = rref(M),
          dimension = 2 - rr.rank;
        total += dimension;
        out.tex.push(`\\lambda=${displayNumber(lambda)},\\quad A-\\lambda I=${matrixTex(M)}`);
        value(`고유공간 차원 · λ=${displayNumber(lambda)}`, dimension);
        if (dimension > 0) {
          const free = [0, 1].find((j) => !rr.pivots.includes(j))!,
            v = [0, 0];
          v[free] = 1;
          rr.pivots.forEach((p, i) => (v[p] = -rr.matrix[i][free]));
          out.lines.push(
            vector(`고유벡터 · λ=${displayNumber(lambda)}`, v, 'secondary'),
            vector('A v', multiply(A, column(v)).flat()),
          );
        }
      }
      value(
        '실수 대각화 조건',
        total === 2 ? '독립 고유벡터 2개를 얻을 수 있다' : '독립 고유벡터가 부족하다',
      );
      out.explanation = [
        '서로 다른 고유값은 대각화의 충분조건이다. 반복 고유값 자체가 대각화 불가능을 뜻하지 않는다.',
      ];
    }
  } else if (kind === 'quadratic') {
    const A = parseMatrix(matrixText);
    if (A.length !== 2 || A[0].length !== 2)
      throw Error('이 주축·이차형식 관찰은 실수 대칭 2×2이다.');
    const e = symmetricEigen(A),
      Q = e.vectors,
      D = [
        [e.values[0], 0],
        [0, e.values[1]],
      ];
    out.matrix = A;
    out.tex = [
      `A=${matrixTex(A)},\\quad Q=${matrixTex(Q)}`,
      `Q^TAQ=${matrixTex(multiply(multiply(transpose(Q), A), Q))}`,
      `q(x)=x^TAx,\\quad x=Qy,\\quad q=y^TDy,\\ D=${matrixTex(D)}`,
    ];
    value('고유값', e.values.map(displayNumber).join(', '));
    const eps = tolerance(A);
    value(
      '이차형식의 부호',
      e.values.every((x) => x > eps)
        ? '양정치'
        : e.values.every((x) => x < -eps)
          ? '음정치'
          : e.values.some((x) => x > eps) && e.values.some((x) => x < -eps)
            ? '부정치'
            : '반정치 또는 0 · 추가 판단 필요',
    );
    const axis = Array.from({ length: 31 }, (_, i) => -3 + i / 5);
    out.surface = {
      x: axis,
      y: axis,
      z: axis.map((y) => axis.map((x) => A[0][0] * x * x + 2 * A[0][1] * x * y + A[1][1] * y * y)),
    };
    out.is3d = true;
    out.explanation = [
      '실수 대칭행렬은 정규직교 고유기저로 교차항을 제거한다.',
      '일반 함수의 국소 극값은 임계점·미분 가능성·헤시안 조건을 따로 확인해야 한다. 반정치 헤시안만으로 극값을 확정하지 않는다.',
    ];
  } else if (kind === 'cross') {
    const u = [1, t, 0],
      v = [0, 1, 1],
      c = [t, -1, 1];
    out.is3d = true;
    out.tex = [
      `u=${matrixTex(column(u))},\\ v=${matrixTex(column(v))},\\ u\\times v=${matrixTex(column(c))}`,
    ];
    out.lines = [vector('u', u), vector('v', v, 'secondary'), vector('u×v', c)];
    value('평행사변형의 넓이', norm(c));
    value('(u×v)·u', dot(c, u));
    value('(u×v)·v', dot(c, v));
    out.explanation = [
      '외적은 이 교재에서 R³에 대한 연산이다. 부호와 오른손 방향을 보존한다.',
      '외적의 노름은 부호 없는 넓이이며, 삼중곱의 부호는 방향 있는 부피이다.',
    ];
  } else if (kind === 'lu') {
    const A = parseMatrix(matrixText),
      d = lu(A);
    out.matrix = A;
    out.steps = [{ operation: '원래 A', matrix: A }, ...d.steps];
    out.tex = [
      `PA=LU,\\quad P=${matrixTex(d.P)}`,
      `L=${matrixTex(d.L)},\\quad U=${matrixTex(d.U)}`,
    ];
    value(
      '재구성 오차 ‖PA−LU‖F',
      norm(
        multiply(d.P, A)
          .flat()
          .map((x, i) => x - multiply(d.L, d.U).flat()[i]),
      ),
    );
    out.explanation = [
      '행 교환이 있으면 PA=LU이다. 항상 A=LU라고 표시하지 않는다.',
      '같은 A와 여러 b에 대해 분해를 재사용할 수 있다. 특이 피벗이면 이 삼각 해법을 중단하고 소거 관찰에서 rank를 확인한다.',
    ];
  } else if (kind === 'power') {
    const A = parseMatrix(matrixText);
    const e = symmetricEigen(A);
    if (A.length !== 2) throw Error('시작 벡터를 보는 이 관찰은 대칭 2×2이다.');
    let x = [1, t],
      lambda = dot([1, t], multiply(A, column([1, t])).flat()) / dot([1, t], [1, t]);
    const largest = [...e.values].sort((a, b) => Math.abs(b) - Math.abs(a)),
      valid = largest[0] > 0 && Math.abs(largest[0]) > Math.abs(largest[1]) && norm(x) > 0;
    if (!norm(x)) throw Error('시작 벡터가 0이다.');
    x = x.map((v) => v / norm(x));
    out.steps = [{ operation: '단위 시작 벡터 x₀', matrix: column(x) }];
    for (let i = 1; i <= n; i++) {
      const y = multiply(A, column(x)).flat();
      if (norm(y) <= tolerance(A)) {
        out.notices.push(
          '현재 시작 방향이 영공간에 들어가 정규화할 수 없다. 대상 전체의 발산을 뜻하지 않는다.',
        );
        break;
      }
      x = y.map((v) => v / norm(y));
      lambda = dot(x, multiply(A, column(x)).flat());
      out.steps.push({
        operation: `x${i}=Ax${i - 1}/‖Ax${i - 1}‖ · 유클리드 정규화`,
        matrix: column(x),
      });
    }
    const dominantIndex = e.values.findIndex((v) => v === largest[0]),
      component = dot([1, t], transpose(e.vectors)[dominantIndex]);
    value('시작 벡터의 지배 방향 성분', component);
    if (Math.abs(component) <= tolerance(A))
      out.notices.push(
        '시작 벡터의 지배 고유방향 성분이 수치 허용오차에서 0이다. 책의 수렴 정리를 적용할 수 없다.',
      );
    const residual = norm(
      multiply(A, column(x))
        .flat()
        .map((v, i) => v - lambda * x[i]),
    );
    out.tex = [
      `A=${matrixTex(A)},\\quad x_0=${matrixTex(column([1, t]))}`,
      `\\rho(x)=\\frac{x^TAx}{x^Tx}=${displayNumber(lambda)}`,
    ];
    value(
      '책의 양의 지배 고유값 조건',
      valid
        ? '행렬 조건 충족 · 시작 성분은 별도 확인'
        : '이 행렬에 책의 해당 정리를 바로 적용할 수 없다',
    );
    value('고유쌍 잔차 ‖Ax−ρx‖', residual);
    out.lines = [
      vector('현재 단위 방향', x),
      vector('Ax', multiply(A, column(x)).flat(), 'secondary'),
    ];
    out.explanation = [
      '실수 대칭, 양의 지배 고유값의 절댓값이 엄격히 가장 큼, 시작 벡터의 해당 고유성분이 0이 아님이 책 정리의 조건이다.',
      '유한 반복과 작은 잔차는 수치 근거이다. 음의 지배 고유값에서는 방향 부호가 번갈아도 레일리 몫은 수렴할 수 있다.',
    ];
  } else if (kind === 'svd') {
    const A = parseMatrix(matrixText),
      k = Math.min(Math.round(params.n ?? 1), Math.min(A.length, A[0].length)),
      s = smallSvd(A, k);
    out.matrix = A;
    out.tex = [
      `A=${matrixTex(A)},\\quad A=U\\Sigma V^T`,
      `U=${matrixTex(s.U)},\\quad\\Sigma=${matrixTex(s.Sigma)},\\quad V=${matrixTex(s.V)}`,
      `A_k=${matrixTex(s.approx)}`,
    ];
    value(
      '재구성 잔차 ‖A−UΣVᵀ‖F',
      norm(A.flat().map((x, i) => x - multiply(multiply(s.U, s.Sigma), transpose(s.V)).flat()[i])),
    );
    value('유지한 특이값 수 k', k);
    value('특이값 · 내림차순', s.singular.map(displayNumber).join(', '));
    value('프로베니우스 오차 ‖A−Aₖ‖F', s.error);
    value('전개 저장 수', k * (A.length + A[0].length + 1));
    value('원래 저장 수', A.length * A[0].length);
    out.notices.push(
      '작은 실수 행렬의 AᵀA·Jacobi 계산이다. 조건수가 제곱되어 아주 작은 특이값의 상대오차가 커질 수 있다. 실무 대규모 SVD나 기호적 rank를 대체하지 않는다.',
    );
    out.explanation = [
      '큰 특이값부터 k개를 유지해 같은 행렬을 재구성한다. 복소 행렬에서는 전치가 아니라 켤레전치이다.',
      '자료·영상 압축은 자료 행렬의 근사이다. 여기의 작은 숫자 예제는 사용자의 실제 자료나 영상으로 기록하지 않는다.',
    ];
  } else if (kind === 'dynamics') {
    const A = [
        [1, 1],
        [0, t],
      ],
      start = [1, 1];
    let x = [...start];
    const states = [x];
    for (let i = 1; i <= n; i++) {
      x = multiply(A, column(x)).flat();
      states.push(x);
    }
    out.matrix = A;
    out.tex = [
      `A=${matrixTex(A)},\\quad x_0=${matrixTex(column(start))}`,
      `x_n=A^nx_0=${matrixTex(column(x))}`,
    ];
    out.lines = [line('이산 궤적 xₙ', states)];
    out.secondaryPlot = {
      tex: [],
      lines: [
        line(
          '연속 해 x₁(s)',
          Array.from({ length: 81 }, (_, i) => {
            const z = i / 10;
            return [
              z,
              Math.exp(z) *
                (1 + (Math.abs(t - 1) < 1e-12 ? z : (Math.exp((t - 1) * z) - 1) / (t - 1))),
            ];
          }),
          'secondary',
        ),
      ],
      is3d: false,
      point: null,
      readouts: [],
      notices: [],
    };
    out.steps = states.map((v, i) => ({
      operation: `이산 단계 ${i} · x${i}=A^${i}x₀`,
      matrix: column(v),
    }));
    out.explanation = [
      '이산 갱신 xₙ₊₁=Axₙ과 연속 방정식 x′=Ax는 서로 다른 과정이다. 연속 예제의 1번째 성분은 해석식을 유한 구간에서 표본화한다.',
      '같은 축에 단계별 성분과 상태공간 좌표를 섞지 않기 위해 연속 과정은 별도 표현으로 읽어야 한다.',
    ];
  } else if (kind === 'markov') {
    const p = t,
      q = 0.25;
    if (p < 0 || p > 1) throw Error('전이확률 p는 0부터 1까지이다.');
    const A = [
      [1 - p, q],
      [p, 1 - q],
    ];
    let x = [1, 0];
    const states = [x];
    for (let i = 1; i <= n; i++) {
      x = multiply(A, column(x)).flat();
      states.push(x);
    }
    out.matrix = A;
    out.tex = [
      `A=${matrixTex(A)},\\quad\\sum_i a_{ij}=1,\\quad a_{ij}\\geq0`,
      `x_n=${matrixTex(column(x))},\\quad\\pi=${matrixTex(column([q / (p + q), p / (p + q)]))}`,
    ];
    out.lines = [
      line(
        '상태 1의 확률',
        states.map((v, i) => [i, v[0]]),
      ),
      line(
        '상태 2의 확률',
        states.map((v, i) => [i, v[1]]),
        'secondary',
      ),
    ];
    value('총확률', x[0] + x[1]);
    value(
      '정규성',
      p > 0
        ? '이 가족은 양의 거듭제곱을 가진 정규 확률행렬'
        : 'p=0 · 정규성 정리의 조건 위반, 이 예제는 별도 계산 가능',
    );
    out.steps = states.map((v, i) => ({
      operation: `분포 x${i} · 열 확률행렬로 갱신`,
      matrix: column(v),
    }));
    out.explanation = [
      '책은 열 합이 1인 확률행렬을 사용한다. 행 확률행렬의 관례와 혼합하지 않는다.',
      '정규성은 책의 수렴 결론을 보장하는 충분조건이다. 조건을 위반했다고 이 예제 자체가 발산한다고 표시하지 않는다.',
    ];
  } else if (kind === 'leontief') {
    const C = [
        [0.2, 0.1],
        [0.1, t],
      ],
      d = [2, 1];
    if (t < 0 || t >= 1) throw Error('이 모형의 소비계수 t는 0 이상 1 미만이다.');
    const B = [
        [1 - C[0][0], -C[0][1]],
        [-C[1][0], 1 - C[1][1]],
      ],
      delta = determinant(B),
      r = rref(
        B.map((row, i) => [...row, d[i]]),
        2,
      );
    out.matrix = C;
    out.tex = [
      `C=${matrixTex(C)},\\quad d=${matrixTex(column(d))}`,
      `(I-C)x=d,\\quad [I-C|d]=${matrixTex(B.map((row, i) => [...row, d[i]]))}`,
    ];
    out.steps = r.steps;
    if (Math.abs(delta) > tolerance(B)) {
      const x = [((1 - t) * 2 + 0.1) / delta, (0.8 + 0.2) / delta];
      out.tex.push(`x=${matrixTex(column(x))}`);
      value(
        '비음수 생산량',
        x.every((v) => v >= 0)
          ? '이 예제는 비음수 생산량을 얻는다'
          : '이 수학적 해는 비음수 생산 모형으로 해석할 수 없다',
      );
    }
    value('행렬식 det(I−C)', delta);
    out.explanation = [
      '소비행렬의 열은 한 산업의 단위 생산에 필요한 투입을 뜻한다. 비음수·생산 가능성 조건을 해와 구별한다.',
      '원문의 경제 단위와 실제 산업 자료는 여기의 단위 없는 예제에 임의로 붙이지 않는다.',
    ];
  } else if (kind === 'fourier') {
    const k = Math.min(n, 15),
      f = (x: number) => x,
      approx = (x: number) =>
        Array.from({ length: k }, (_, i) => {
          const j = i + 1;
          return (2 * (-1) ** (j + 1) * Math.sin(j * x)) / j;
        }).reduce((a, b) => a + b, 0),
      xs = Array.from({ length: 241 }, (_, i) => -Math.PI + (i * 2 * Math.PI) / 240);
    out.tex = [
      `f(x)=x,\\quad -\\pi<x<\\pi`,
      `S_N(x)=\\sum_{j=1}^{N}\\frac{2(-1)^{j+1}}j\\sin(jx),\\quad N=${k}`,
    ];
    out.lines = [
      line(
        '원함수 f(x)=x',
        xs.map((x) => [x, f(x)]),
        'secondary',
      ),
      line(
        '유한 푸리에 근사 Sₙ',
        xs.map((x) => [x, approx(x)]),
      ),
    ];
    value('유지한 항 N', k);
    value(
      '표본 최대 오차 · 열린 구간 내부',
      Math.max(...xs.slice(1, -1).map((x) => Math.abs(f(x) - approx(x)))),
    );
    out.explanation = [
      '내적은 구간 적분이며 계수는 해석적으로 구한 이 함수의 예제이다. 표시 최대 오차는 유한 표본값이다.',
      '유한 직교 투영과 무한 급수의 점별 수렴은 다르다. 주기 연장의 끝점에서는 좌우 극한의 평균을 별도로 보아야 한다.',
    ];
  } else if (kind === 'complex') {
    const z = [1, t],
      w = [1, -1],
      product = [1 + t, t - 1],
      mod = norm(z),
      theta = Math.atan2(t, 1),
      re = mod ** n * Math.cos(n * theta),
      im = mod ** n * Math.sin(n * theta);
    out.tex = [
      `z=1+(${displayNumber(t)})i,\\quad\\bar z=1-(${displayNumber(t)})i,\\quad |z|=${displayNumber(mod)}`,
      `z(1-i)=${displayNumber(product[0])}+(${displayNumber(product[1])})i,\\quad z^n=${displayNumber(re)}+(${displayNumber(im)})i`,
      `\\langle u,v\\rangle=\\sum_j u_j\\overline{v_j},\\quad A^*=\\overline{A}^{T}`,
    ];
    out.lines = [
      vector('z · 실수축/허수축', z),
      vector('켤레 z̄', [1, -t], 'secondary'),
      vector('z(1−i)', product),
    ];
    value('편각 · 라디안', theta);
    out.explanation = [
      '복소평면의 가로는 실수부, 세로는 허수부이다. 극형식의 곱은 크기의 곱과 편각의 합이다.',
      '책의 내적은 첫 인자에 선형이고 둘째 인자에 켤레를 취한다. 에르미트·유니터리·정규행렬의 일반 분류는 이 스칼라 예제로 완결하지 않는다.',
    ];
  }
  return out;
}
