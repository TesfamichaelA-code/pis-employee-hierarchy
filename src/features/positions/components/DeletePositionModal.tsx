'use client';

import { Modal, Text, Group, Button, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useDeletePositionMutation } from '@/features/positions/positionsApiSlice';
import { IconAlertTriangle } from '@tabler/icons-react';

interface DeletePositionModalProps {
  opened: boolean;
  onClose: () => void;
  positionId: string;
  positionName: string;
  onSuccess: () => void;
}

export default function DeletePositionModal({
  opened,
  onClose,
  positionId,
  positionName,
  onSuccess,
}: DeletePositionModalProps) {
  const [deletePosition, { isLoading }] = useDeletePositionMutation();

  const handleDelete = async () => {
    try {
      await deletePosition(positionId).unwrap();
      notifications.show({
        title: 'Position Deleted',
        message: `"${positionName}" has been successfully deleted.`,
        color: 'green',
      });
      onClose();
      onSuccess();
    } catch (error: any) {
      if (error?.status === 409) {
        notifications.show({
          title: 'Cannot Delete Position',
          message:
            'This position has child positions. Please reassign or remove all children before deleting this position.',
          color: 'red',
          autoClose: 6000,
        });
      } else {
        notifications.show({
          title: 'Error',
          message: error?.data?.message || 'Failed to delete position.',
          color: 'red',
        });
      }
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Delete Position" centered>
      <Stack gap="md">
        <Group gap="sm" wrap="nowrap" align="flex-start">
          <IconAlertTriangle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
          <Text>
            Are you sure you want to delete{' '}
            <strong>&quot;{positionName}&quot;</strong>?
          </Text>
        </Group>
        <Text size="sm" c="dimmed">
          This action cannot be undone. If this position has children, you must
          reassign or remove them first.
        </Text>
        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete} loading={isLoading}>
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
