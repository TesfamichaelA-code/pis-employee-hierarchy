import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import api from '@/lib/axios';
import { Position, CreatePositionDto, UpdatePositionDto } from './types';

// Custom baseQuery that uses our configured Axios instance
interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
}

interface AxiosBaseQueryError {
  status?: number;
  data?: unknown;
}

const axiosBaseQuery: BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  AxiosBaseQueryError
> = async ({ url, method = 'GET', data, params }) => {
  try {
    const result = await api({ url, method, data, params });
    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};

export const positionsApi = createApi({
  reducerPath: 'positionsApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Position', 'Tree'],
  endpoints: (builder) => ({
    getTree: builder.query<Position[], void>({
      query: () => ({ url: '/positions/tree' }),
      providesTags: ['Tree'],
    }),

    getPosition: builder.query<Position, string>({
      query: (id) => ({ url: `/positions/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'Position', id }],
    }),

    getChildren: builder.query<Position[], string>({
      query: (id) => ({ url: `/positions/${id}/children` }),
      providesTags: (_result, _error, id) => [
        { type: 'Position', id: `children-${id}` },
      ],
    }),

    createPosition: builder.mutation<Position, CreatePositionDto>({
      query: (data) => ({ url: '/positions', method: 'POST', data }),
      invalidatesTags: ['Tree'],
    }),

    updatePosition: builder.mutation<
      Position,
      { id: string; data: UpdatePositionDto }
    >({
      query: ({ id, data }) => ({
        url: `/positions/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Tree',
        { type: 'Position', id },
      ],
    }),

    deletePosition: builder.mutation<void, string>({
      query: (id) => ({ url: `/positions/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Tree'],
    }),
  }),
});

export const {
  useGetTreeQuery,
  useGetPositionQuery,
  useGetChildrenQuery,
  useCreatePositionMutation,
  useUpdatePositionMutation,
  useDeletePositionMutation,
} = positionsApi;
