
import React, { createContext, useContext } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface AuthContextType {
  user: any;
  profile: any;
  login: (email: string, password: string, isCompanyLogin?: boolean) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  completeRegistration: (userData: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isCompanyUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useSupabaseAuth();

  // Compatibility layer for existing components
  const login = async (email: string, password: string, isCompanyLogin = false): Promise<boolean> => {
    const { error } = await auth.signIn(email, password);
    return !error;
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    const { error } = await auth.signUp(email, password);
    return !error;
  };

  const completeRegistration = async (userData: any): Promise<boolean> => {
    const { error } = await auth.updateProfile(userData);
    return !error;
  };

  const logout = async () => {
    await auth.signOut();
  };

  const value = {
    user: auth.user ? {
      id: auth.user.id,
      email: auth.user.email,
      name: auth.profile?.full_name || auth.user.email?.split('@')[0],
      company: auth.profile?.company,
      phone: auth.profile?.phone,
      role: auth.profile?.role,
      userType: auth.profile?.role === 'admin' ? 'company' : 'client',
      avatar: auth.profile?.avatar_url
    } : null,
    profile: auth.profile,
    login,
    register,
    completeRegistration,
    logout,
    isLoading: auth.isLoading,
    isCompanyUser: auth.isCompanyUser
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
