'use client';

import { use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Button,
  Loader,
  Center,
  Alert,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import {
  useGetPositionQuery,
  useUpdatePositionMutation,
} from '@/features/positions/positionsApiSlice';
import PositionForm from '@/features/positions/components/PositionForm';
import {
  CreatePositionDto,
  getDescendantIds,
} from '@/features/positions/types';

export default function EditPositionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: position, isLoading, isError } = useGetPositionQuery(id);
  const [updatePosition, { isLoading: isUpdating }] =
    useUpdatePositionMutation();

  // Exclude self and all descendants from the parent select to prevent circular refs
  const excludeIds = useMemo(() => {
    if (!position) return [];
    return [position.id, ...getDescendantIds(position)];
  }, [position]);

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

  const handleSubmit = async (data: CreatePositionDto) => {
    await updatePosition({ id, data }).unwrap();
    notifications.show({
      title: 'Position Updated',
      message: `"${data.name}" has been successfully updated.`,
      color: 'green',
    });
    router.push(`/positions/${id}`);
  };

  return (
    <Container size="sm" py="xl">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => router.back()}
        mb="md"
      >
        Back
      </Button>

      <Paper p="xl" withBorder>
        <Title order={3} mb="lg">
          Edit Position
        </Title>
        <PositionForm
          initialData={position}
          onSubmit={handleSubmit}
          isSubmitting={isUpdating}
          submitLabel="Update Position"
          excludeIds={excludeIds}
        />
      </Paper>
    </Container>
  );
}
