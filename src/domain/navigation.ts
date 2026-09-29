import type { OutlineNode } from './model';

export interface OutlineRow {
  node: OutlineNode;
  depth: number;
  path: string[];
  duplicateName: boolean;
  duplicatePath: boolean;
}

/** Presentation only: stable IDs and the canonical parent relation remain untouched. */
export function outlineRows(
  nodes: readonly OutlineNode[],
  subjectId: string,
  parentId: string | null = null,
): OutlineRow[] {
  const active = nodes.filter(node => node.subjectId === subjectId && !node.deletedAt);
  const byId = new Map(active.map(node => [node.id, node]));
  const children = new Map<string | null, OutlineNode[]>();
  const nameCounts = new Map<string, number>();
  for (const node of active) {
    const siblings = children.get(node.parentId) ?? [];
    siblings.push(node);
    children.set(node.parentId, siblings);
    nameCounts.set(node.name, (nameCounts.get(node.name) ?? 0) + 1);
  }
  for (const siblings of children.values()) siblings.sort((a, b) => a.order - b.order);

  const ancestors: string[] = [];
  const ancestorIds = new Set<string>();
  let parent = parentId === null ? undefined : byId.get(parentId);
  while (parent && !ancestorIds.has(parent.id)) {
    ancestorIds.add(parent.id);
    ancestors.unshift(parent.name);
    parent = parent.parentId === null ? undefined : byId.get(parent.parentId);
  }

  // An explicit stack avoids both the old depth-eight cutoff and call-stack limits.
  const stack = [...(children.get(parentId) ?? [])].reverse()
    .map(node => ({ node, depth: 0, path: [...ancestors, node.name] }));
  const seen = new Set(ancestorIds);
  const rows: OutlineRow[] = [];
  const pathCounts = new Map<string, number>();
  while (stack.length) {
    const row = stack.pop()!;
    if (seen.has(row.node.id)) continue;
    seen.add(row.node.id);
    rows.push({ ...row, duplicateName: (nameCounts.get(row.node.name) ?? 0) > 1, duplicatePath: false });
    const pathKey = JSON.stringify(row.path);
    pathCounts.set(pathKey, (pathCounts.get(pathKey) ?? 0) + 1);
    const nested = children.get(row.node.id) ?? [];
    for (let index = nested.length - 1; index >= 0; index--) {
      const child = nested[index];
      stack.push({ node: child, depth: row.depth + 1, path: [...row.path, child.name] });
    }
  }
  for (const row of rows) row.duplicatePath = (pathCounts.get(JSON.stringify(row.path)) ?? 0) > 1;
  return rows;
}
