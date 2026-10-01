import { useState } from 'react';
import { Button, Input } from './index';
import type { AppState } from '../domain/model';
import type { CanvasCard, CanvasContent } from '../domain/canvas';
import { projectCanvas } from '../domain/canvas';
import { canvasLayoutFile, parseCanvasLayoutFile, canvasDiagramSvg } from '../domain/flow-transfer';

function download(content: string, type: string, name: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function CanvasTransfer({
  data,
  content,
  cards,
  disabled,
  onImport,
}: {
  data: AppState;
  content: CanvasContent;
  cards: CanvasCard[];
  disabled: boolean;
  onImport: (next: CanvasContent) => boolean;
}) {
  const [candidate, setCandidate] = useState<CanvasContent | null>(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const automaticLinks = projectCanvas(data).links.filter((link) => link.id.startsWith('auto:'));
  return (
    <div className="flow-transfer">
      <p>
        배치 JSON은 카드 위치·직접 연결·확대 위치를 보관합니다. 원문과 전체 이력은 설정의 전체
        내보내기에서 보관할 수 있습니다.
      </p>
      <div className="actions">
        <Button
          onClick={() =>
            download(canvasLayoutFile(data, content), 'application/json', 'ManSeekSong-Canvas.json')
          }
        >
          배치 JSON 내려받기
        </Button>
        <Button
          onClick={() =>
            download(
              canvasDiagramSvg(cards, { ...content, links: [...automaticLinks, ...content.links] }),
              'image/svg+xml',
              'ManSeekSong-Canvas.svg',
            )
          }
        >
          관계도 SVG 내려받기
        </Button>
      </div>
      <Input
        label="가져올 배치 JSON"
        type="file"
        accept=".json,application/json"
        disabled={disabled || busy}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          setCandidate(null);
          setError('');
          if (!file) return;
          setBusy(true);
          try {
            if (file.size > 2_000_000) throw Error('2MB 이내의 배치 파일을 선택해 주세요.');
            setCandidate(parseCanvasLayoutFile(await file.text(), data));
          } catch (failure) {
            setError(failure instanceof Error ? failure.message : '배치 파일을 읽지 못했습니다.');
          } finally {
            setBusy(false);
          }
        }}
      />
      {busy && <p role="status">배치 파일을 확인하고 있습니다.</p>}
      {candidate && (
        <div>
          <p>
            카드 위치 {Object.keys(candidate.positions).length}개·직접 연결 {candidate.links.length}
            개를 확인했습니다. 적용하면 현재 배치와 직접 연결을 파일의 내용으로 바꿉니다. 카드
            원문은 유지하며 ‘배치 되돌리기’로 돌아갈 수 있습니다.
          </p>
          <Button
            disabled={disabled || busy}
            onClick={() => {
              if (onImport(candidate)) {
                setCandidate(null);
                setError('');
              }
            }}
          >
            확인한 배치 적용
          </Button>
          <Button onClick={() => setCandidate(null)}>가져오기 취소</Button>
        </div>
      )}
      {error && <p role="alert">{error} 현재 배치는 유지했습니다.</p>}
    </div>
  );
}
