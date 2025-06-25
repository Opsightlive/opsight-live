
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  role?: string;
  userType?: 'client' | 'company'; // Add user type
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, isCompanyLogin?: boolean) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('opsight_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, isCompanyLogin = false): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would be an API call
    if (email && password) {
      let mockUser: User;
      
      if (isCompanyLogin) {
        // Company login - check for specific company credentials
        if (email === 'admin@opsight.com' || email.includes('@opsight.com')) {
          mockUser = {
            id: 'company_1',
            email,
            name: 'OPSIGHT Admin',
            company: 'OPSIGHT',
            role: 'Company Admin',
            userType: 'company'
          };
        } else {
          setIsLoading(false);
          return false;
        }
      } else {
        // Regular client login
        mockUser = {
          id: '1',
          email,
          name: email.split('@')[0],
          company: 'Demo Company',
          role: 'Asset Manager',
          userType: 'client'
        };
      }
      
      setUser(mockUser);
      localStorage.setItem('opsight_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      const mockUser = {
        id: '2',
        email,
        name: email.split('@')[0],
        userType: 'client' as const
      };
      setUser(mockUser);
      localStorage.setItem('opsight_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('opsight_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
