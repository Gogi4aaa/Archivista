import { toast } from 'react-toastify';
import { LoginCredentials, User } from '../types/Auth';

const API_URL = 'http://localhost:5075/api';

interface AuthResponse {
  token: string;
  userId: string;
  username: string;
  email: string;
  roles: string[];
  expiresIn: number;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      console.log('Attempting login with:', { email: credentials.email, password: credentials.password });
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'http://localhost:3000'
        },
        body: JSON.stringify(credentials),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'An error occurred during login';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('Login error response:', errorData);
        } catch (e) {
          console.error('Error parsing error response:', e);
        }

        if (response.status === 401) {
          throw { type: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
        }
        throw {
          type: 'API_ERROR',
          message: errorMessage
        };
      }

      const data: AuthResponse = await response.json();
      console.log('Login successful:', { username: data.username, roles: data.roles });
      toast.success("Successfully logged in!")
      // Store the token
      localStorage.setItem('auth_token', data.token);
      
      // Convert the response to User type
      const user: User = {
        id: data.userId,
        username: data.username,
        email: data.email,
        role: data.roles.includes('Admin') ? 'admin' : 'user'
      };

      return user;
    } catch (error: any) {
      console.error('Login error:', {
        error,
        message: error.message,
        type: error.type
      });
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'http://localhost:3000'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          return null;
        }
        throw new Error('Failed to get user');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      localStorage.removeItem('auth_token');
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      // Remove token first to prevent any unauthorized access
      localStorage.removeItem('auth_token');

      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'http://localhost:3000'
        }
      });

      if (!response.ok && response.status !== 401) {
        console.warn('Logout request failed, but token was removed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Ensure token is removed even if request fails
      localStorage.removeItem('auth_token');
    }
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}; 