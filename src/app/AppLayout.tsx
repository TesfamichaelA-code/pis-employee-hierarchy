'use client';

import { AppShell, Group, Title, UnstyledButton, Text, Button, Tooltip } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconBuildingSkyscraper, IconHome, IconPlus } from '@tabler/icons-react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header className="flex items-center px-6 border-b border-gray-200 bg-white shadow-sm">
        <Group justify="space-between" className="w-full">
          <UnstyledButton onClick={() => router.push('/')}>
            <Group gap="xs">
              <div className="p-1.5 rounded-lg bg-blue-50">
                <IconBuildingSkyscraper size={24} className="text-blue-600" />
              </div>
              <Title order={4} className="text-gray-800 tracking-tight">
                Position Hierarchy
              </Title>
            </Group>
          </UnstyledButton>

          <Group gap="sm">
            <Tooltip label="Home" position="bottom" withArrow>
              <UnstyledButton
                onClick={() => router.push('/')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <IconHome size={18} className="text-gray-500" />
                <Text size="sm" fw={500} className="text-gray-600">
                  Home
                </Text>
              </UnstyledButton>
            </Tooltip>
            <Button
              onClick={() => router.push('/positions/new')}
              leftSection={<IconPlus size={16} />}
              radius="md"
              size="sm"
              variant="gradient"
              gradient={{ from: 'blue', to: 'indigo', deg: 135 }}
              className="shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 transition-all duration-200 hover:-translate-y-0.5"
            >
              New Position
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main className="bg-gray-50 min-h-screen">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
