import { useEffect, useState } from 'react';
import type { AppState } from '../domain/model';
import {
  downloadText, experienceKey, inspectExperienceRecovery,
  restoreExperience, serializeExperienceRecovery, type ExperienceRecovery,
} from '../data/experience-state';
import { Button, ErrorState, Modal, Select, Textarea } from './index';
const recoveryError = (cause: unknown) => cause instanceof DOMException
  ? cause.name === 'QuotaExceededError'
    ? '이 기기의 저장 공간이 부족해 복구한 설정의 저장을 확인하지 못했습니다. 이전 원문과 보관본은 유지했습니다. 공간을 확보한 뒤 목록을 다시 읽고 저장해 주세요.'
    : '이 기기의 저장 공간에 접근하지 못했습니다. 원문과 보관본은 유지했습니다. 브라우저의 저장 허용을 확인한 뒤 다시 읽어 주세요.'
  : cause instanceof Error ? cause.message : '설정 원문과 저장 결과를 확인하지 못했습니다. 다시 읽어 주세요.';

export function ExperienceRecoveryControl({ data, onRecovered }: {
  data: AppState; onRecovered: () => void;
}) {
  const key = experienceKey(data);
  const [open, setOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<ExperienceRecovery | null>(null);
  const [selectedKey, setSelectedKey] = useState('');
  const [limit, setLimit] = useState(20);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    setOpen(false); setSnapshot(previous => previous?.key === key ? previous : null); setSelectedKey(''); setNotice(''); setError('');
  }, [key]);
  const current = snapshot?.key === key ? snapshot : null;
  const selected = current?.archives.find(archive => archive.archiveKey === selectedKey);
  const inspect = () => {
    setSelectedKey(''); setLimit(20); setError('');
    try { setSnapshot(inspectExperienceRecovery(data)); }
    catch (cause) { setSnapshot(null); setError(recoveryError(cause)); }
  };
  const restore = (kind: 'archive' | 'restart') => {
    if (!current || (kind === 'archive' && (!selected?.usable || selected.raw === null))) return;
    try {
      restoreExperience(data, current, kind === 'archive'
        ? { kind, archiveKey: selected!.archiveKey, raw: selected!.raw! } : { kind });
      onRecovered(); setOpen(false);
      setNotice(kind === 'archive'
        ? '확인한 보관본으로 설정을 복구했습니다. 이전 원문 사본도 유지했습니다.'
        : '이전 원문을 보관하고 이어가기 설정을 새로 시작했습니다. 공부 기록은 유지했습니다.');
    } catch (cause) {
      setError(recoveryError(cause));
    }
  };
  return <>
    <Button variant="quiet" onClick={() => { setNotice(''); inspect(); setOpen(true); }}>
      설정 원문·보관본 확인
    </Button>
    {notice && <p role="status">{notice}</p>}
    <Modal open={open} title="이어가기 설정 복구" onClose={() => setOpen(false)}>
      <div className="brand-service">
        <p>본문 읽기 폭, 이어갈 곳, 다음 행동과 문제 메모의 설정을 확인합니다. 공부 기록·주제·필기는 이 복구로 바뀌지 않습니다.</p>
        <p>보관본을 고른 뒤 내용을 확인해 주세요. 복구하기 전의 원문도 별도 사본으로 보관합니다.</p>
        <p>복구 후 사용 흐름 관찰은 꺼집니다. 필요할 때 직접 다시 켤 수 있습니다.</p>
        {error && <ErrorState message={error} onRetry={inspect} />}
        <div className="actions">
          <Button onClick={inspect}>보관본 목록 다시 읽기</Button>
          <Button disabled={!current} onClick={() => current && downloadText(
            'manseeksong-experience-recovery.json', serializeExperienceRecovery(current), 'application/json',
          )}>설정 원문 내려받기</Button>
        </div>
        {current && <>
          {current.issues.length > 0 && <ErrorState message="목록 일부를 읽지 못했습니다. 보관본이 없다는 뜻은 아닙니다. 읽힌 내용은 내려받을 수 있으며 목록을 다시 읽을 수 있습니다." />}
          {current.archives.length > 0 ? <>
            <Select label="복구할 설정 보관본" value={selectedKey} onChange={event => setSelectedKey(event.target.value)}>
              <option value="">내용을 확인할 보관본 선택</option>
              {current.archives.slice(0, limit).map((archive, index) => <option key={archive.archiveKey} value={archive.archiveKey}>
                보관본 {index + 1} · {archive.metadata?.archivedAt ? new Date(archive.metadata.archivedAt).toLocaleString('ko-KR') : '보관 시각 미확인'}{archive.usable ? '' : ' · 원문만 확인 가능'}
              </option>)}
            </Select>
            {current.archives.length > limit && <Button onClick={() => setLimit(value => value + 20)}>설정 보관본 더 보기</Button>}
            {selected && <>
              <p>{selected.metadata?.reason ?? '보관 이유는 확인되지 않았습니다.'}</p>
              <Textarea label="보관본 원문" readOnly rows={6} value={selected.raw ?? ''} />
              {!selected.usable && <p>이 원문은 설정 형식을 확인하지 못해 바로 복구할 수 없습니다. 원문 내려받기에 포함해 보관할 수 있습니다.</p>}
              <Button variant="primary" disabled={!selected.usable} onClick={() => restore('archive')}>이 보관본으로 설정 복구</Button>
            </>}
          </> : <p>{current.issues.length ? '현재 읽힌 설정 보관본은 없습니다. 전체 목록을 다시 확인해 주세요.' : '현재 이 기기에서 읽을 수 있는 설정 보관본이 없습니다. 설정 원문은 내려받을 수 있습니다.'}</p>}
          <details>
            <summary>보관본으로 복구할 수 없을 때</summary>
            <p>원문을 보관한 뒤 읽기 폭·이어갈 곳·다음 행동·문제 메모의 표시를 새로 시작할 수 있습니다. 이전 내용은 보관본에 남으며 공부 기록·주제·필기는 유지합니다. 입력 중인 다음 행동과 문제 메모의 글도 지우지 않습니다.</p>
            <Button onClick={() => restore('restart')}>원문 보관 후 설정 새로 시작</Button>
          </details>
        </>}
        <div className="actions"><Button onClick={() => setOpen(false)}>닫기</Button></div>
      </div>
    </Modal>
  </>;
}
