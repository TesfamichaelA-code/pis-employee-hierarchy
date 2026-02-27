import { configureStore } from '@reduxjs/toolkit';
import { positionsApi } from '@/features/positions/positionsApiSlice';

export const store = configureStore({
  reducer: {
    [positionsApi.reducerPath]: positionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(positionsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
