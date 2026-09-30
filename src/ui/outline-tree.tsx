import { useMemo, useRef, type CSSProperties, type ReactNode } from 'react';
import type { OutlineNode, StudyRecord } from '../domain/model';
import { outlineRows } from '../domain/navigation';
import './outline-tree.css';

const roleLabels = { unit: '단원', outline: '목차', topic: '주제' };

export function OutlineTree({ nodes, records, subjectId, subjectName, parentId = null, empty = null }: {
  nodes: readonly OutlineNode[];
  records: readonly StudyRecord[];
  subjectId: string;
  subjectName: string;
  parentId?: string | null;
  empty?: ReactNode;
}) {
  const list = useRef<HTMLUListElement>(null);
  const rows = useMemo(() => outlineRows(nodes, subjectId, parentId), [nodes, subjectId, parentId]);
  const counts = useMemo(() => {
    const result = new Map<string, number>();
    for (const record of records) {
      if (!record.deletedAt && record.done && record.subjectId === subjectId)
        result.set(record.targetId, (result.get(record.targetId) ?? 0) + 1);
    }
    return result;
  }, [records, subjectId]);
  const recorded = useMemo(() => new Set(records
    .filter(record => !record.deletedAt && record.subjectId === subjectId)
    .map(record => record.targetId)), [records, subjectId]);
  if (!rows.length) return empty;
  return (
    <ul ref={list} className="outline-list outline-flat" aria-label={`${subjectName} 목차`}>
      {rows.map(({ node, depth, path, duplicateName, duplicatePath }, index) => {
        const fullPath = [subjectName, ...path].join(' / ');
        const count = counts.get(node.id) ?? 0;
        const hasRecord = node.role === 'topic' && recorded.has(node.id);
        return (
          <li key={node.id} style={{ '--outline-indent': Math.min(depth, 3) } as CSSProperties}>
            <a
              className={`node-link role-${node.role}`}
              href={`#/node/${encodeURIComponent(node.id)}`}
              title={fullPath}
              aria-label={`${roleLabels[node.role]} ${fullPath}${duplicatePath ? ` · 구분 ID: ${node.id}` : ''}${hasRecord ? ' · 기록 있음' : ''} · 공부함 기록 ${count}회`}
              onKeyDown={event => {
                if (event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
                let next: number | undefined;
                if (event.key === 'ArrowDown') next = Math.min(index + 1, rows.length - 1);
                if (event.key === 'ArrowUp') next = Math.max(index - 1, 0);
                if (event.key === 'Home') next = 0;
                if (event.key === 'End') next = rows.length - 1;
                if (event.key === 'ArrowLeft') next = rows.findIndex(row => row.node.id === node.parentId);
                if (event.key === 'ArrowRight') next = rows.findIndex(row => row.node.parentId === node.id);
                if (next === undefined || next < 0) return;
                event.preventDefault();
                list.current?.querySelectorAll<HTMLAnchorElement>('a.node-link')[next]?.focus();
              }}
            >
              <span className="role-label">{roleLabels[node.role]}</span>
              <span className="outline-label">
                <span>{node.name}</span>
                {(duplicateName || depth >= 3) && <span className="outline-path">{fullPath}</span>}
                {duplicatePath && <span className="outline-path">구분 ID: {node.id}</span>}
              </span>
              {hasRecord && <span className="outline-record-presence" aria-hidden="true">기록 있음</span>}
              <span className="row-tail" aria-hidden="true">{count || '—'}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
