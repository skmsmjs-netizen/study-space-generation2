import { useState } from 'react';
import type { AppState } from '../domain/model';
import type { StudyRepository } from '../data/repository';
import type { RileyPosition } from '../data/riley-observations';
import { isRileySnapshot, keepRileySnapshot, rileySnapshot } from '../data/riley-notebook';
import { Button, Select, ErrorState } from './index';
export function RileyNotebook({
  data,
  repository,
  onSaved,
  section,
  position,
  onRestore,
}: {
  data: AppState;
  repository: StudyRepository;
  onSaved: (d: AppState) => void;
  section: string;
  position: RileyPosition;
  onRestore: (section: string, p: RileyPosition) => void;
}) {
  const [owner, setOwner] = useState(''),
    [selected, setSelected] = useState(''),
    [error, setError] = useState(''),
    [status, setStatus] = useState('');
  const copies = (data.memos ?? [])
    .filter((m) => !m.deletedAt && isRileySnapshot(m.body))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  async function keep() {
    try {
      const next = keepRileySnapshot(repository, data, section, position, owner || null);
      onSaved(next);
      setError('');
      setStatus(
        data.namespace === 'demo'
          ? '현재 시연 공간의 메모에 보관했다. 서버 동기화와 구별한다.'
          : '이 기기의 메모에 보관하고 기존 개인 저장 경로의 응답을 확인 중이다.',
      );
      if (repository.flush) await repository.flush();
      const s = repository.getStatus?.();
      if (data.namespace !== 'demo' && s?.phase === 'saved')
        setStatus(
          '기존 개인 저장 경로가 메모 보관을 확인했다. 다른 기기의 실제 수신은 별도 확인이다.',
        );
      else if (s && ['error', 'conflict'].includes(s.phase)) throw Error(s.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : '메모 보관에 실패했다. 현재 관찰·입력은 유지한다.');
    }
  }
  return (
    <section aria-label="관찰 상태를 메모로 보관">
      <h4>관찰 보관본 · 기존 메모에 연결</h4>
      <Select label="관찰 메모의 과목" value={owner} onChange={(e) => setOwner(e.target.value)}>
        <option value="">과목 미지정</option>
        {data.subjects
          .filter((n) => !n.deletedAt)
          .map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
      </Select>
      <Button onClick={keep}>현재 관찰을 새 보관본으로 남기기</Button>
      <p className="muted">
        값·미확정 입력·단계·시야·메모와 원문 위치를 한 보관본으로 남긴다. 원본 PDF는 전송하지
        않는다. 기존 보관본과 사용자가 편집한 메모를 덮어쓰지 않는다.
      </p>
      {status && <p role="status">{status}</p>}
      {error && <ErrorState message={error} />}
      <Select
        label="복원할 관찰 보관본"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">보관본 선택</option>
        {copies.map((m) => (
          <option key={m.id} value={m.id}>
            {new Date(m.updatedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} ·{' '}
            {m.id.slice(-8)}
          </option>
        ))}
      </Select>
      <Button
        disabled={!selected}
        onClick={() => {
          try {
            const memo = copies.find((x) => x.id === selected);
            const v = memo && rileySnapshot(memo.body);
            if (!v) throw Error('이 보관본을 읽지 못했다. 원래 메모와 현재 관찰은 유지한다.');
            onRestore(v.section, v.position);
            setError('');
            setStatus('선택한 보관본의 관찰 상태를 복원했다. 원래 보관본과 다른 관찰은 유지한다.');
          } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
          }
        }}
      >
        선택한 관찰 상태 복원
      </Button>
      <a href="#/memos">기존 메모 목록에서 읽기</a>
    </section>
  );
}
