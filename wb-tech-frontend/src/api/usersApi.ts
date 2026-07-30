import axiosInstance from './axiosInstance';
import type { User, UserFormData } from '../types/user';

export interface FetchUsersParams {
  page: number;
  limit: number;
}

export interface FetchUsersResponse {
  users: User[];
  totalCount: number;
}

// mockapi.io в ответ на page/limit отдаёт массив пользователей,
// а общее количество — в заголовке x-total-count
export const fetchUsers = async ({
  page,
  limit,
}: FetchUsersParams): Promise<FetchUsersResponse> => {
  const response = await axiosInstance.get<User[]>('/users', {
    params: { page, limit },
  });

  const totalCountHeader = response.headers['x-total-count'];

  return {
    users: response.data,
    totalCount: totalCountHeader ? Number(totalCountHeader) : response.data.length,
  };
};

export const fetchUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: UserFormData): Promise<User> => {
  const response = await axiosInstance.post<User>('/users', data);
  return response.data;
};

export const updateUser = async (id: string, data: UserFormData): Promise<User> => {
  const response = await axiosInstance.put<User>(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};
