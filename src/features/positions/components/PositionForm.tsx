'use client';

import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  Stack,
} from '@mantine/core';
import { useGetTreeQuery } from '@/features/positions/positionsApiSlice';
import { Position, CreatePositionDto, flattenTree } from '@/features/positions/types';

const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(2, 'Description must be at least 2 characters'),
  parentId: yup.string().nullable().optional(),
});

interface PositionFormProps {
  initialData?: Position;
  onSubmit: (data: CreatePositionDto) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
  excludeIds?: string[];
}

export default function PositionForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel,
  excludeIds = [],
}: PositionFormProps) {
  const { data: tree } = useGetTreeQuery();

  // Build a flat, searchable list of positions for the parent dropdown
  const parentOptions = useMemo(() => {
    if (!tree) return [];
    const flat = flattenTree(tree);
    return flat
      .filter((p) => !excludeIds.includes(p.id))
      .map((p) => ({
        value: p.id,
        label: `${'— '.repeat(p.depth)}${p.name}`,
      }));
  }, [tree, excludeIds]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePositionDto>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      parentId: initialData?.parentId || null,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        parentId: initialData.parentId || null,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: CreatePositionDto) => {
    await onSubmit({
      ...data,
      parentId: data.parentId || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack gap="md">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Position Name"
              placeholder="e.g. Chief Technology Officer"
              error={errors.name?.message}
              withAsterisk
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Description"
              placeholder="Describe the responsibilities of this position"
              error={errors.description?.message}
              minRows={3}
              withAsterisk
            />
          )}
        />

        <Controller
          name="parentId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || null}
              onChange={(value) => field.onChange(value)}
              label="Parent Position"
              placeholder="Select parent position (optional for root)"
              data={parentOptions}
              searchable
              clearable
              nothingFoundMessage="No positions found"
            />
          )}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={isSubmitting} size="md">
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
