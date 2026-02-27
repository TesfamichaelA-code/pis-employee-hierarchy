'use client';

import { useRouter } from 'next/navigation';
import { Container, Paper, Title, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import { useCreatePositionMutation } from '@/features/positions/positionsApiSlice';
import PositionForm from '@/features/positions/components/PositionForm';
import { CreatePositionDto } from '@/features/positions/types';

export default function CreatePositionPage() {
  const router = useRouter();
  const [createPosition, { isLoading }] = useCreatePositionMutation();

  const handleSubmit = async (data: CreatePositionDto) => {
    await createPosition(data).unwrap();
    notifications.show({
      title: 'Position Created',
      message: `"${data.name}" has been successfully created.`,
      color: 'green',
    });
    router.push('/');
  };

  return (
    <Container size="sm" py="xl">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => router.push('/')}
        mb="md"
      >
        Back to Hierarchy
      </Button>

      <Paper p="xl" withBorder>
        <Title order={3} mb="lg">
          Create New Position
        </Title>
        <PositionForm
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          submitLabel="Create Position"
        />
      </Paper>
    </Container>
  );
}
