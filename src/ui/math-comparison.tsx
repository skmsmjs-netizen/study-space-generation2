import { useId, useMemo, useState } from 'react';
import { buildScene, type MathScene } from '../domain/math-explorer';
import {
  clearMathComparison,
  mathComparisonKey,
  readMathComparison,
  writeMathComparison,
} from '../data/math-comparison';
import { Button, ErrorState, Select } from './index';
import { MathFormula } from './math-formula';
import {
  comparisonBounds,
  comparisonCoordinates,
  comparisonNumber,
  comparisonPath,
  comparisonSnapshot,
  type ComparisonBounds,
  type ComparisonProjection,
} from './math-comparison-model';
import './math-comparison.css';

type Result = ReturnType<typeof buildScene>;

/** A is a calculation snapshot; B remains the existing editor and its save path. No second GPU scene. */
export function MathComparison({
  ownerKey,
  scene,
  result,
}: {
  ownerKey: string;
  scene: MathScene;
  result: Result | null | undefined;
}) {
  const storageKey = mathComparisonKey(ownerKey);
  const [initial] = useState(() => readMathComparison(storageKey));
  const [pinned, setPinned] = useState(initial.scene);
  const [blocked, setBlocked] = useState(initial.blocked);
  const [error, setError] = useState(initial.error);
  const [notice, setNotice] = useState('');
  const [projection, setProjection] = useState<ComparisonProjection>('xy');
  const [lockedBounds, setLockedBounds] = useState<ComparisonBounds | null>(null);
  const [zoom, setZoom] = useState(1);
  const [large, setLarge] = useState(false);
  const clip = useId().replace(/:/g, '');
  const a = useMemo(() => (pinned ? buildScene(pinned) : null), [pinned]);
  const compatible = Boolean(pinned && scene.mode === pinned.mode);
  const plane = scene.mode === 'function' ? 'xy' : projection;
  const fitted = useMemo(
    () => comparisonBounds([a?.points ?? [], compatible ? (result?.points ?? []) : []], plane),
    [a, result, compatible, plane],
  );
  const base = lockedBounds ?? fitted;
  const bounds = { ...base, span: base.span / zoom };
  const pin = () => {
    if (!result || blocked) return;
    const snapshot = comparisonSnapshot(scene);
    setPinned(snapshot);
    setLockedBounds(null);
    setZoom(1);
    setError('');
    try {
      writeMathComparison(storageKey, snapshot);
      setNotice(
        'A를 고정했습니다. 현재 조건 B를 바꾸어 비교하세요. 이 탭에서 다시 열어도 A를 이어갑니다.',
      );
    } catch {
      setNotice(
        'A를 현재 화면에 고정했습니다. 탭 보관에 실패하여 이 화면을 떠나면 복원되지 않을 수 있습니다.',
      );
    }
  };
  const clear = () => {
    try {
      clearMathComparison(storageKey);
      setPinned(null);
      setBlocked(false);
      setError('');
      setNotice('비교 조건을 지웠습니다. 현재 수식과 저장된 장면은 유지됩니다.');
      setLockedBounds(null);
      setZoom(1);
    } catch {
      setError('비교 조건을 지우지 못했습니다. 현재 A와 저장된 내용을 유지합니다.');
    }
  };
  const axisLabel =
    scene.mode === 'function'
      ? '가로 x · 세로 y'
      : `가로 ${plane[0]} · 세로 ${plane[1]} · 3차원 곡선의 정사영`;
  const rows: { label: string; a: string; b: string }[] =
    pinned && a
      ? [
          { label: '매개값 a', a: comparisonNumber(pinned.a), b: comparisonNumber(scene.a) },
          { label: '매개값 b', a: comparisonNumber(pinned.b), b: comparisonNumber(scene.b) },
          { label: '구간', a: `${pinned.min} … ${pinned.max}`, b: `${scene.min} … ${scene.max}` },
          {
            label: `선택한 위치 (${pinned.mode === 'function' ? 'x' : 't'})`,
            a: comparisonNumber(a.at),
            b: result ? comparisonNumber(result.at) : '계산할 수 없음',
          },
          ...(['x', 'y', 'z'] as const)
            .slice(0, pinned.mode === 'function' ? 2 : 3)
            .map((axis, index) => ({
              label: `좌표 ${axis}`,
              a: a.point ? comparisonNumber(a.point[index]) : '정의되지 않음',
              b: result?.point ? comparisonNumber(result.point[index]) : '정의되지 않음',
            })),
        ]
      : [];
  const [originX, originY] = comparisonCoordinates([0, 0, 0], plane, bounds);
  return (
    <section className="math-comparison" aria-label="수식 조건 A와 B 비교">
      <div className="section-heading">
        <h3>조건을 고정해 비교하기</h3>
        <Button variant="quiet" onClick={pin} disabled={!result || blocked}>
          {pinned ? '현재 조건으로 A 다시 고정' : '현재 조건을 A로 고정'}
        </Button>
      </div>
      <p className="muted">
        A를 고정한 뒤 아래 수식·매개값·위치를 바꾸면 B에 반영됩니다. A는 이 탭에서만 보관하며,
        저장한 장면과 메모는 그대로 둡니다.
      </p>
      {error && <ErrorState message={error} />}
      {notice && <p role="status">{notice}</p>}
      {(pinned || blocked) && (
        <Button variant="quiet" onClick={clear}>
          {blocked ? '비교 초기화' : '비교 종료'}
        </Button>
      )}
      {pinned && a && (
        <>
          <div className="math-comparison-formulas">
            <div>
              <strong>A · 고정한 조건 · 점선</strong>
              <MathFormula label="조건 A 수식" tex={a.tex} />
            </div>
            <div>
              <strong>B · 현재 조건 · 실선</strong>
              {result ? (
                <MathFormula label="조건 B 수식" tex={result.tex} />
              ) : (
                <p>현재 수식을 고치면 비교를 이어갑니다.</p>
              )}
            </div>
          </div>
          {!compatible && (
            <p role="status">
              함수와 공간 곡선은 축의 뜻이 달라 겹치지 않습니다. 같은 종류로 돌아가거나 현재 조건을
              A로 다시 고정하세요.
            </p>
          )}
          {compatible && result && (
            <>
              <div className="button-row">
                {scene.mode === 'curve' && (
                  <Select
                    label="A와 B를 함께 볼 평면"
                    value={projection}
                    onChange={(event) => {
                      setProjection(event.target.value as ComparisonProjection);
                      setLockedBounds(null);
                      setZoom(1);
                    }}
                  >
                    <option value="xy">xy 평면</option>
                    <option value="xz">xz 평면</option>
                    <option value="yz">yz 평면</option>
                  </Select>
                )}
                <Button
                  variant="quiet"
                  aria-label="비교 그래프 확대"
                  onClick={() => {
                    setLockedBounds(base);
                    setZoom((value) => Math.min(value * 1.5, 20));
                  }}
                  disabled={zoom >= 20}
                >
                  확대
                </Button>
                <Button
                  variant="quiet"
                  aria-label="비교 그래프 축소"
                  onClick={() => {
                    setLockedBounds(base);
                    setZoom((value) => Math.max(value / 1.5, 0.2));
                  }}
                  disabled={zoom <= 0.2}
                >
                  축소
                </Button>
                <Button
                  variant="quiet"
                  onClick={() => {
                    setLockedBounds(null);
                    setZoom(1);
                  }}
                >
                  두 조건 전체 맞춤
                </Button>
                <Button
                  variant="quiet"
                  aria-label="비교 범위를 왼쪽으로 이동"
                  onClick={() => setLockedBounds({ ...base, x: base.x - bounds.span / 5 })}
                >
                  왼쪽
                </Button>
                <Button
                  variant="quiet"
                  aria-label="비교 범위를 오른쪽으로 이동"
                  onClick={() => setLockedBounds({ ...base, x: base.x + bounds.span / 5 })}
                >
                  오른쪽
                </Button>
                <Button
                  variant="quiet"
                  aria-label="비교 범위를 위로 이동"
                  onClick={() => setLockedBounds({ ...base, y: base.y + bounds.span / 5 })}
                >
                  위
                </Button>
                <Button
                  variant="quiet"
                  aria-label="비교 범위를 아래로 이동"
                  onClick={() => setLockedBounds({ ...base, y: base.y - bounds.span / 5 })}
                >
                  아래
                </Button>
                <Button
                  variant="quiet"
                  aria-pressed={large}
                  onClick={() => setLarge((value) => !value)}
                >
                  {large ? '비교 크기 되돌리기' : '비교 크게 보기'}
                </Button>
              </div>
              <p>
                {axisLabel} · 두 조건의 같은 좌표는 같은 위치에 표시됩니다.{' '}
                {lockedBounds
                  ? '축 범위를 고정했습니다.'
                  : '두 조건 전체에 맞춰 축을 함께 조정합니다.'}
              </p>
              <svg
                className="math-comparison-graph"
                data-large={large}
                viewBox="0 0 480 480"
                role="img"
                aria-label={`조건 A 점선과 B 실선의 같은 축 비교. ${axisLabel}`}
              >
                <defs>
                  <clipPath id={clip}>
                    <rect x="40" y="40" width="400" height="400" />
                  </clipPath>
                </defs>
                <rect className="math-comparison-border" x="40" y="40" width="400" height="400" />
                <g clipPath={`url(#${clip})`}>
                  <path
                    className="math-comparison-axis"
                    d={`M40,${originY}H440 M${originX},40V440`}
                  />
                  <path
                    className="math-comparison-a"
                    d={comparisonPath(a.points, a.breakBefore, plane, bounds)}
                  />
                  <path
                    className="math-comparison-b"
                    d={comparisonPath(result.points, result.breakBefore, plane, bounds)}
                  />
                  {a.point && (
                    <circle
                      className="math-comparison-point-a"
                      cx={comparisonCoordinates(a.point, plane, bounds)[0]}
                      cy={comparisonCoordinates(a.point, plane, bounds)[1]}
                      r="5"
                    />
                  )}
                  {result.point && (
                    <circle
                      className="math-comparison-point-b"
                      cx={comparisonCoordinates(result.point, plane, bounds)[0]}
                      cy={comparisonCoordinates(result.point, plane, bounds)[1]}
                      r="3"
                    />
                  )}
                </g>
              </svg>
              <p className="muted">
                가로 범위 {comparisonNumber(bounds.x - bounds.span / 2)} …{' '}
                {comparisonNumber(bounds.x + bounds.span / 2)} · 세로 범위{' '}
                {comparisonNumber(bounds.y - bounds.span / 2)} …{' '}
                {comparisonNumber(bounds.y + bounds.span / 2)} · 가로·세로 1의 길이가 같습니다.
              </p>
              <p className="muted">
                {a.missing || result.missing
                  ? `정의되지 않은 표본: A ${a.missing}개 · B ${result.missing}개. `
                  : ''}
                표본 사이의 선은 곡선의 근사이며, 끊어진 곳을 이어 그리지 않습니다.
              </p>
            </>
          )}
          <div className="math-comparison-table">
            <table>
              <caption>A와 B의 입력과 선택 위치 값 · 단위 미지정</caption>
              <thead>
                <tr>
                  <th scope="col">항목</th>
                  <th scope="col">A · 고정</th>
                  <th scope="col">B · 현재</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.a}</td>
                    <td>{compatible ? row.b : '종류가 다름'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted">
            자유 수식에는 물리 단위가 지정되어 있지 않습니다. 좌표와 매개변수의 수치를 비교하며,
            선택 위치가 다르면 서로 다른 지점의 값입니다.
          </p>
        </>
      )}
    </section>
  );
}
