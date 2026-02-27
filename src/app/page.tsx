'use client';

import { useRouter } from 'next/navigation';
import { Title, Button, Group, Container } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import PositionTree from '@/features/positions/components/PositionTree';

export default function HomePage() {
  const router = useRouter();

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="lg" align="center">
        <Title order={2} className="text-gray-800 tracking-tight">Position Hierarchy</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => router.push('/positions/new')}
          radius="md"
          size="md"
          variant="gradient"
          gradient={{ from: 'blue', to: 'indigo', deg: 135 }}
          className="shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 transition-all duration-200 hover:-translate-y-0.5"
        >
          Add Position
        </Button>
      </Group>

      <PositionTree />
    </Container>
  );
}
