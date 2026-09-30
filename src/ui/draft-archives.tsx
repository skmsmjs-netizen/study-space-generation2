import { useState } from 'react';
import { storagePrefix } from '../data/repository';
import type { AppState } from '../domain/model';
import { listDraftArchives, serializeDraftArchive, type DraftArchive } from '../data/draft-archives';
import { Button, Card, EmptyState, ErrorState, Textarea } from './index';
import './draft-archives.css';

/** Resolve only the storage key. Never interpret damaged content as an entity. */
export function archiveTarget(sourceKey: string, data?: AppState): { label: string; relation: string; href?: string } {
  const prefix = data ? `${storagePrefix(data)}:` : 'study-space:demo:';
  const key = sourceKey.startsWith(prefix) ? sourceKey.slice(prefix.length) : sourceKey;
  let targetId: string | undefined, label = '대상을 확인할 수 없는 초안';
  let href: string | undefined;
  if (key === 'canvas-draft:main') return { label: 'Canvas 배치', relation: '원래 카드 좌표·연결의 초안입니다. 저장된 배치와 합치기 전에 원문을 확인해 주세요.', href: '#/canvas' };
  if (key.startsWith('draft:')) {
    targetId = key.slice('draft:'.length);
    label = targetId === 'multiple' ? '여러 주제 공부 기록' : '공부 기록';
    if (targetId === 'multiple') href = '#/record';
  } else if (key.startsWith('narrative:')) {
    const part = key.slice('narrative:'.length), split = part.indexOf(':');
    const kind = part.slice(0, split), id = part.slice(split + 1);
    label = ({ 'free-note': '자유 기록', 'subject-overview': '과목 개요', 'unit-introduction': '단원 서문', 'topic-note': '주제 메모' } as Record<string, string>)[kind] ?? '글 초안';
    if (kind === 'free-note') {
      const note = id.startsWith('id:') ? data?.narratives.find(item => item.id === id.slice(3)) : undefined;
      return { label, relation: !data ? '현재 기록의 연결은 확인하지 못했습니다.' : note ? note.deletedAt ? '연결된 자유 기록이 휴지통에 있습니다.' : '같은 ID의 자유 기록이 있습니다. 본문 일치나 복구 완료를 뜻하지 않습니다.' : '현재 기록과의 연결은 확인되지 않았습니다.', ...(note && !note.deletedAt ? { href: `#/free/${encodeURIComponent(note.id)}` } : {}) };
    }
    targetId = id;
  } else if (key.startsWith('modal:')) {
    const part = key.slice('modal:'.length), split = part.indexOf(':');
    const kind = part.slice(0, split);
    targetId = part.slice(split + 1);
    label = ({ semester: '학기 추가', subject: '과목 추가', node: '목차 추가', bulk: '여러 목차 추가', rename: '이름 수정', move: '목차 이동' } as Record<string, string>)[kind] ?? '입력 창';
  } else if (key.includes(':criteria-draft:')) {
    label = '공부 기준';
    try { targetId = decodeURIComponent(key.split(':criteria-draft:')[1]); } catch { /* Keep unknown key readable. */ }
  } else if (key.endsWith(':outline-table-draft:v1')) {
    return { label: '과목·단원·주제 표', relation: '표 입력 초안입니다. 생성된 항목과 같은 내용인지는 확인하지 않습니다.', href: '#/subjects' };
  }
  const node = data?.nodes.find(item => item.id === targetId);
  const subject = data?.subjects.find(item => item.id === (node?.subjectId ?? targetId));
  const semester = data?.semesters.find(item => item.id === targetId);
  const names: string[] = [], seen = new Set<string>();
  let parent = node;
  while (parent && !seen.has(parent.id)) { seen.add(parent.id); names.unshift(parent.name); parent = data?.nodes.find(item => item.id === parent?.parentId); }
  if (subject) names.unshift(subject.name);
  if (semester) names.unshift(semester.name);
  const entity = node ?? subject ?? semester;
  if (entity && !entity.deletedAt) href = node ? `#/node/${encodeURIComponent(node.id)}` : subject ? `#/subject/${encodeURIComponent(subject.id)}` : '#/subjects';
  return { label: names.length ? `${label} · ${names.join(' → ')}` : label,
    relation: !data ? '현재 기록의 연결은 확인하지 못했습니다.' : entity ? entity.deletedAt ? '원래 대상이 휴지통에 있습니다. 보관본은 별도로 남습니다.' : '같은 ID의 대상이 있습니다. 현재 기록을 변경하거나 초안을 적용하지 않습니다.' : '개별 대상과의 연결은 확인되지 않았습니다.', href };
}

const currentRelation = {
  same: '현재 저장된 초안과 원문이 같습니다. 정상 데이터라는 뜻은 아닙니다.',
  different: '현재 저장된 초안과 원문이 다릅니다. 양쪽을 그대로 유지합니다.',
  absent: '같은 위치에 현재 저장된 초안이 없습니다.',
  unreadable: '현재 초안을 읽지 못해 원문을 비교하지 못했습니다.',
};

export function DraftArchives({ data }: { data?: AppState }) {
  const prefix = data ? `${storagePrefix(data)}:` : 'study-space:demo:';
  const [result, setResult] = useState(() => listDraftArchives(undefined, prefix));
  const [notice, setNotice] = useState(''), [exportError, setExportError] = useState('');
  const refresh = () => { setResult(listDraftArchives(undefined, prefix)); setNotice('보관본 목록을 다시 읽었습니다.'); };
  const archives = result.archives.filter(item => item.sourceKey.startsWith(prefix));
  const download = (archive: DraftArchive) => {
    let url: string | undefined;
    try {
      const content = serializeDraftArchive(archive);
      url = URL.createObjectURL(new Blob([content], { type: 'application/json;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url; link.download = `study-draft-archive-${crypto.randomUUID()}.json`;
      document.body.append(link);
      try { link.click(); } finally { link.remove(); }
      const savedUrl = url;
      window.setTimeout(() => URL.revokeObjectURL(savedUrl), 60_000);
      setExportError(''); setNotice('파일 다운로드를 요청했습니다. 브라우저의 다운로드 목록에서 파일을 확인해 주세요. 보관본은 그대로 남아 있습니다.');
    } catch {
      if (url) URL.revokeObjectURL(url);
      setNotice(''); setExportError('파일 다운로드를 시작하지 못했습니다. 보관본과 현재 초안은 변경하지 않았습니다. 원문을 확인한 뒤 내보내기를 다시 시도해 주세요.');
    }
  };
  const copy = async (archive: DraftArchive) => {
    try {
      await navigator.clipboard.writeText(serializeDraftArchive(archive));
      setExportError(''); setNotice('원문과 보관 정보를 복사했습니다. 텍스트 파일에 붙여 넣어 별도로 보관해 주세요. 현재 초안과 보관본은 그대로 남습니다.');
    } catch {
      setNotice(''); setExportError('복사하지 못했습니다. 보관본과 현재 초안은 변경하지 않았습니다. 복사를 다시 시도하거나 원문 내보내기로 파일 다운로드를 요청해 주세요.');
    }
  };
  return <section className="draft-archives" aria-label="초안 보관본">
    <Card><p>읽지 못했던 초안의 원문을 확인하고, 필요한 보관본을 파일로 내보내 주세요.</p>
      <p className="muted">이 브라우저에 남아 있는 사본입니다. 브라우저 데이터를 지우면 함께 없어질 수 있습니다. 전체 백업이나 삭제된 데이터의 복구 기능은 아닙니다.</p>
      <Button onClick={refresh}>보관본 다시 읽기</Button>
    </Card>
    {result.issues.length > 0 && <ErrorState title={result.issues.some(issue => issue.stage === 'enumeration') ? '보관본 목록을 끝까지 읽지 못했습니다' : '일부 보관 정보를 확인하지 못했습니다'} message="읽은 보관본만 표시합니다. 읽지 못한 원문이나 저장 상태는 확인할 수 없습니다. 이 화면에서는 저장소를 변경하지 않았습니다. 다시 읽기를 시도해 주세요." onRetry={refresh} />}
    {exportError && <ErrorState title="내보내기를 시작하지 못했습니다" message={exportError} />}
    {notice && <p role="status">{notice}</p>}
    {!archives.length && result.complete && !result.issues.length && <EmptyState title="현재 확인된 초안 보관본이 없습니다" message="읽을 수 없는 초안을 별도로 보관한 경우 이곳에서 확인할 수 있습니다." />}
    {archives.map((archive, index) => {
      const target = archiveTarget(archive.sourceKey, data);
      return <Card key={archive.archiveKey}>
        <h2>{index + 1}. {target.label}</h2>
        <p>{target.relation}</p>
        <dl className="archive-meta">
          <dt>보관 시각</dt><dd>{archive.metadata?.archivedAt ?? '알 수 없음 · 확인된 시각 정보가 없습니다.'}</dd>
          <dt>보관 이유</dt><dd>{archive.metadata?.reason ?? '별도 이유 정보가 없습니다. 손상 초안 보관 위치에서 찾았습니다.'}</dd>
          <dt>현재 초안</dt><dd>{currentRelation[archive.currentDraft]}</dd>
        </dl>
        {archive.issues.length > 0 && <p role="alert">일부 정보를 읽지 못했습니다. 확인 가능한 원문만 표시하며, 다시 읽기로 재시도할 수 있습니다.</p>}
        <details><summary>원문과 식별 정보 확인</summary>
          <dl className="archive-meta"><dt>원래 저장 위치</dt><dd>{archive.sourceKey}</dd><dt>보관본 식별자</dt><dd>{archive.archiveKey}</dd></dl>
          {archive.raw === null ? <p>원문을 읽지 못했습니다. 보관본 다시 읽기를 시도해 주세요.</p> : <Textarea label={`보관본 ${index + 1} 원문`} value={archive.raw} readOnly rows={10} hint="수정하거나 자동 적용하지 않습니다. 화면의 줄끝 표시는 브라우저에 따라 달라질 수 있으며, 내보낸 JSON의 raw 값에는 원래 문자열이 그대로 보존됩니다." />}
        </details>
        <div className="actions"><Button disabled={archive.raw === null} onClick={() => download(archive)}>원문 내보내기</Button><Button disabled={archive.raw === null} onClick={() => void copy(archive)}>내보내기 내용 복사</Button>{target.href && <a href={target.href}>현재 대상 확인</a>}</div>
        <p className="muted">내보내기는 이 목록을 읽을 때 확인한 원문을 담습니다. 파일을 저장해도 현재 기록·초안·보관본을 변경하지 않습니다.</p>
      </Card>;
    })}
  </section>;
}
