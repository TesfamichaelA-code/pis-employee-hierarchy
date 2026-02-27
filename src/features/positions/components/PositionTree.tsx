'use client';

import { useGetTreeQuery } from '@/features/positions/positionsApiSlice';
import PositionTreeNode from './PositionTreeNode';
import {
  Paper,
  Text,
  Loader,
  Center,
  Stack,
  Alert,
  Button,
} from '@mantine/core';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function PositionTree() {
  const { data: tree, isLoading, isError, error } = useGetTreeQuery();
  const router = useRouter();

  if (isLoading) {
    return (
      <Center className="py-16">
        <Stack align="center" gap="sm">
          <Loader size="lg" />
          <Text c="dimmed" size="sm">
            Loading position hierarchy…
          </Text>
        </Stack>
      </Center>
    );
  }

  if (isError) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error loading positions"
        color="red"
      >
        {(error as any)?.data?.message ||
          'Failed to load position hierarchy. Make sure the backend server is running at http://localhost:3000.'}
      </Alert>
    );
  }

  if (!tree || tree.length === 0) {
    return (
      <Paper p="xl" withBorder className="text-center">
        <Stack align="center" gap="md" className="py-8">
          <Text c="dimmed" size="lg" fw={500}>
            No positions found
          </Text>
          <Text c="dimmed" size="sm">
            Create your first position to build the organization hierarchy.
          </Text>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => router.push('/positions/new')}
          >
            Create First Position
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper p="md" withBorder>
      {tree.map((position) => (
        <PositionTreeNode key={position.id} position={position} level={0} />
      ))}
    </Paper>
  );
}
