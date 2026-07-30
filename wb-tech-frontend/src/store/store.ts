import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // оставляем, но проверим, что установлен пакет
import usersReducer from './usersSlice';

const rootReducer = combineReducers({
  users: usersReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  // Персистим только страницу пагинации — списки и текущий юзер всегда грузим свежими
  whitelist: ['users'],
  blacklist: [], // при желании можно ужать persist только до нужных полей через transform
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
