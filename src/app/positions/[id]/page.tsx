'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Stack,
  Badge,
  Loader,
  Center,
  Alert,
  Divider,
} from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconArrowLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import { useGetPositionQuery } from '@/features/positions/positionsApiSlice';
import DeletePositionModal from '@/features/positions/components/DeletePositionModal';

export default function PositionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: position, isLoading, isError } = useGetPositionQuery(id);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);

  if (isLoading) {
    return (
      <Center className="py-16">
        <Loader size="lg" />
      </Center>
    );
  }

  if (isError || !position) {
    return (
      <Container size="md" py="xl">
        <Alert color="red" title="Error">
          Position not found or failed to load.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => router.push('/')}
        mb="md"
      >
        Back to Hierarchy
      </Button>

      <Paper p="xl" withBorder>
        <Stack gap="lg">
          {/* Header with actions */}
          <Group justify="space-between" wrap="wrap">
            <div>
              <Title order={3}>{position.name}</Title>
              {!position.parentId ? (
                <Badge variant="light" color="blue" mt="xs">
                  Root Position
                </Badge>
              ) : (
                <Badge variant="light" color="gray" mt="xs">
                  Child Position
                </Badge>
              )}
            </div>
            <Group>
              <Button
                variant="light"
                leftSection={<IconEdit size={16} />}
                onClick={() => router.push(`/positions/${id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="light"
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={() => setDeleteModalOpened(true)}
              >
                Delete
              </Button>
            </Group>
          </Group>

          <Divider />

          {/* Description */}
          <div>
            <Text size="sm" fw={600} c="dimmed" mb={4}>
              Description
            </Text>
            <Text>{position.description}</Text>
          </div>

          {/* Children list */}
          {position.children && position.children.length > 0 && (
            <div>
              <Text size="sm" fw={600} c="dimmed" mb="xs">
                Direct Reports ({position.children.length})
              </Text>
              <Stack gap="xs">
                {position.children.map((child) => (
                  <Paper
                    key={child.id}
                    p="sm"
                    withBorder
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => router.push(`/positions/${child.id}`)}
                  >
                    <Group gap="xs">
                      <IconChevronRight size={14} className="text-gray-400" />
                      <Text size="sm" fw={500}>
                        {child.name}
                      </Text>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </div>
          )}
        </Stack>
      </Paper>

      <DeletePositionModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        positionId={id}
        positionName={position.name}
        onSuccess={() => router.push('/')}
      />
    </Container>
  );
}
