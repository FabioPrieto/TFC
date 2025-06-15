import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { apiService } from '../../services/api';

interface User {
  id: string;
  name: string;
  storeId: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (storeName: string, adminPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        // Verify the stored user data is still valid
        if (parsedUser.id && parsedUser.name && parsedUser.storeId) {
          setUser(parsedUser);
        } else {
          // Clear invalid user data
          await AsyncStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      await AsyncStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (storeName: string, adminPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Call API to authenticate with ST_Name and ST_AdminPassword
      const response = await apiService.authenticateStore(storeName, adminPassword);
      
      if (response.success && response.store) {
        const userData: User = {
          id: response.store.ST_ID.toString(),
          name: response.store.ST_Name,
          storeId: response.store.ST_IdStore,
        };
        
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};