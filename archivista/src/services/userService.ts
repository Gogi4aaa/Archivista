import { UserResponse, CreateUserRequest, UpdateUserRequest } from '../types/user';
import api from './api';

export const userService = {
  getAllUsers: async (): Promise<UserResponse[]> => {
    const response = await api.get('/user');
    return response.data;
  },

  createUser: async (userData: CreateUserRequest): Promise<UserResponse> => {
    const response = await api.post('/user', userData);
    return response.data;
  },

  updateUser: async (userId: string, userData: UpdateUserRequest): Promise<UserResponse> => {
    const response = await api.put(`/user/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/user/${userId}`);
  },

  getUserById: async (userId: string): Promise<UserResponse> => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },

  updateUserStatus: async (userId: string, isActive: boolean): Promise<void> => {
    await api.patch(`/user/${userId}/status`, { isActive });
  },

  updateUserRoles: async (userId: string, roleIds: number[]): Promise<void> => {
    await api.patch(`/user/${userId}/roles`, { roleIds });
  }
}; 