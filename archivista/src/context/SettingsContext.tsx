import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { userService } from '../services/userService';

interface SettingsContextType {
  updateProfile: (data: { username?: string; email?: string }) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const updateProfile = async (data: { username?: string; email?: string }) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      await userService.updateProfile({
        userId: user.id,
        ...data
      });

    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        updateProfile,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}; 