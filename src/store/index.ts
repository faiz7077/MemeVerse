import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import memesReducer from './slices/memesSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    memes: memesReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;