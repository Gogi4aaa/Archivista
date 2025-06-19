import api from './api';

const baseUrl = 'http://localhost:5075';

interface UpdateProfileData {
  userId: string;
  username?: string;
  email?: string;
}

export const userService = {
  async updateProfile(data: UpdateProfileData): Promise<void> {
    try {
      await api.put(`${baseUrl}/api/auth/profile`, data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      throw new Error(message);
    }
  }
}; 