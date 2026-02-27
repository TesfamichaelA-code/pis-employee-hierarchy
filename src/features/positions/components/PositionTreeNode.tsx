'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UnstyledButton, Text, Collapse } from '@mantine/core';
import {
  IconChevronRight,
  IconChevronDown,
  IconPoint,
} from '@tabler/icons-react';
import { Position } from '@/features/positions/types';

interface PositionTreeNodeProps {
  position: Position;
  level: number;
}

export default function PositionTreeNode({
  position,
  level,
}: PositionTreeNodeProps) {
  const [opened, setOpened] = useState(level < 2);
  const router = useRouter();
  const hasChildren = position.children && position.children.length > 0;

  return (
    <div>
      {/* Node row */}
      <div
        className="flex items-center py-1.5 px-2 rounded-md hover:bg-blue-50 transition-colors group cursor-pointer"
        style={{ paddingLeft: `${level * 24 + 8}px` }}
      >
        {/* Expand/Collapse toggle */}
        {hasChildren ? (
          <UnstyledButton
            onClick={(e) => {
              e.stopPropagation();
              setOpened(!opened);
            }}
            className="mr-1.5 p-0.5 rounded hover:bg-blue-100 transition-colors"
          >
            {opened ? (
              <IconChevronDown size={16} className="text-gray-500" />
            ) : (
              <IconChevronRight size={16} className="text-gray-500" />
            )}
          </UnstyledButton>
        ) : (
          <span className="mr-1.5 p-0.5">
            <IconPoint size={16} className="text-gray-300" />
          </span>
        )}

        {/* Position name — navigates to detail */}
        <UnstyledButton
          onClick={() => router.push(`/positions/${position.id}`)}
          className="flex-1 py-0.5"
        >
          <Text
            size="sm"
            fw={hasChildren ? 600 : 400}
            className="text-gray-800 group-hover:text-blue-600 transition-colors"
          >
            {position.name}
          </Text>
        </UnstyledButton>

        {/* Child count badge */}
        {hasChildren && (
          <Text size="xs" c="dimmed" className="mr-2">
            {position.children.length}
          </Text>
        )}
      </div>

      {/* Children (collapsible) */}
      {hasChildren && (
        <Collapse in={opened}>
          <div
            className="border-l-2 border-gray-200 ml-4"
            style={{ marginLeft: `${level * 24 + 20}px` }}
          >
            {position.children.map((child) => (
              <PositionTreeNode
                key={child.id}
                position={child}
                level={level + 1}
              />
            ))}
          </div>
        </Collapse>
      )}
    </div>
  );
}
