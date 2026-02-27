export interface Position {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  children: Position[];
}

export interface CreatePositionDto {
  name: string;
  description: string;
  parentId?: string | null;
}

export interface UpdatePositionDto {
  name?: string;
  description?: string;
  parentId?: string | null;
}

export interface FlatPosition {
  id: string;
  name: string;
  depth: number;
}

/** Flatten a nested position tree into a flat array with depth info (for Select dropdowns) */
export function flattenTree(positions: Position[], depth = 0): FlatPosition[] {
  const result: FlatPosition[] = [];
  for (const pos of positions) {
    result.push({ id: pos.id, name: pos.name, depth });
    if (pos.children?.length) {
      result.push(...flattenTree(pos.children, depth + 1));
    }
  }
  return result;
}

/** Get all descendant IDs of a position (to exclude from parent select when editing) */
export function getDescendantIds(position: Position): string[] {
  const ids: string[] = [];
  for (const child of position.children || []) {
    ids.push(child.id);
    ids.push(...getDescendantIds(child));
  }
  return ids;
}
