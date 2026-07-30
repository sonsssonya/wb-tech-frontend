import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as usersApi from '../api/usersApi';
import type { User, UserFormData } from '../types/user';

interface UsersState {
  items: User[];
  totalCount: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;

  currentUser: User | null;
  currentUserLoading: boolean;
  currentUserError: string | null;

  formLoading: boolean;
  formError: string | null;
}

const initialState: UsersState = {
  items: [],
  totalCount: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,

  currentUser: null,
  currentUserLoading: false,
  currentUserError: null,

  formLoading: false,
  formError: null,
};

// --- Thunks ---

export const loadUsers = createAsyncThunk(
  'users/loadUsers',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      return await usersApi.fetchUsers(params);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Ошибка загрузки списка пользователей');
    }
  }
);

export const loadUserById = createAsyncThunk(
  'users/loadUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await usersApi.fetchUserById(id);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Ошибка загрузки пользователя');
    }
  }
);

export const addUser = createAsyncThunk(
  'users/addUser',
  async (data: UserFormData, { rejectWithValue }) => {
    try {
      return await usersApi.createUser(data);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Ошибка создания пользователя');
    }
  }
);

export const editUser = createAsyncThunk(
  'users/editUser',
  async ({ id, data }: { id: string; data: UserFormData }, { rejectWithValue }) => {
    try {
      return await usersApi.updateUser(id, data);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Ошибка обновления пользователя');
    }
  }
);

export const removeUser = createAsyncThunk(
  'users/removeUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await usersApi.deleteUser(id);
      return id;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Ошибка удаления пользователя');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    clearFormError: (state) => {
      state.formError = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.currentUserError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loadUsers
      .addCase(loadUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.users;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка загрузки';
      })

      // loadUserById
      .addCase(loadUserById.pending, (state) => {
        state.currentUserLoading = true;
        state.currentUserError = null;
      })
      .addCase(loadUserById.fulfilled, (state, action) => {
        state.currentUserLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(loadUserById.rejected, (state, action) => {
        state.currentUserLoading = false;
        state.currentUserError = (action.payload as string) || 'Ошибка загрузки пользователя';
      })

      // addUser
      .addCase(addUser.pending, (state) => {
        state.formLoading = true;
        state.formError = null;
      })
      .addCase(addUser.fulfilled, (state) => {
        state.formLoading = false;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.formLoading = false;
        state.formError = (action.payload as string) || 'Ошибка создания';
      })

      // editUser
      .addCase(editUser.pending, (state) => {
        state.formLoading = true;
        state.formError = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.formLoading = false;
        const idx = state.items.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(editUser.rejected, (state, action) => {
        state.formLoading = false;
        state.formError = (action.payload as string) || 'Ошибка обновления';
      })

      // removeUser
      .addCase(removeUser.fulfilled, (state, action) => {
        state.items = state.items.filter((u) => u.id !== action.payload);
      });
  },
});

export const { setPage, clearFormError, clearCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;
