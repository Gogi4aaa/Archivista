import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthState, LoginCredentials, User, ValidationError} from '../types/Auth';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

class ValidationException extends Error {
  constructor(public errors: ValidationError) {
    super('Validation Error');
    this.name = 'ValidationException';
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const validateCredentials = (credentials: LoginCredentials): ValidationError | null => {
  const errors: ValidationError = {};
  
  // Email validation
  if (!credentials.email) {
    errors.email = 'Email is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(credentials.email)) {
    errors.email = 'Invalid email address';
  }
  
  // Password validation
  if (!credentials.password) {
    errors.password = 'Password is required';
  } else if (credentials.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const updateUser = useCallback((updates: Partial<User>) => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null
    }));
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Validate credentials
      const validationErrors = validateCredentials(credentials);
      if (validationErrors) {
        throw new ValidationException(validationErrors);
      }

      // Make API call
      const user = await authService.login(credentials);
      
      // Login successful
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      if (error instanceof ValidationException) {
        throw error;
      }
      throw new Error(error.message || 'Login failed');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 