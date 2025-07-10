import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  role: string | null;
  phone: string | null;
  avatar_url?: string;
}

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  company?: string;
  bio?: string;
  phone?: string;
  role?: string;
  subscription?: {
    status: string;
    trialEnd?: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: any | null;
  login: (email: string, password: string, isCompanyLogin?: boolean) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  completeRegistration: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  isLoading: boolean;
  isCompanyUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const isCompanyUser = user?.email === 'opsightlive@gmail.com';

  const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const response = await fetch(`/api/user-profile/${userId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to load profile');
      }

      const data = await response.json();
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  };

  const logActivity = async (
    actionType: string, 
    actionDetails: any = {}, 
    success: boolean = true, 
    errorMessage?: string
  ) => {
    if (!user) return;
    
    try {
      await fetch('/api/user-activity-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          actionType: actionType,
          actionDetails: actionDetails,
          success,
          errorMessage: errorMessage
        }),
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  const enhanceUser = (baseUser: any, profileData: UserProfile | null): AuthUser => {
    return {
      ...baseUser,
      name: profileData?.full_name || baseUser.email?.split('@')[0] || 'User',
      avatar: profileData?.avatar_url,
      company: profileData?.company_name,
      role: profileData?.role,
      phone: profileData?.phone,
      bio: '',
      subscription: {
        status: 'trial',
        trialEnd: '2025-01-29'
      }
    };
  };

  const login = async (email: string, password: string, isCompanyLogin?: boolean): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // For demo purposes, create a mock user
      if (email === 'opsightlive@gmail.com' && password === 'admin123') {
        const mockUser = {
          id: 'company-admin-id',
          email: email,
        };
        
        const profileData = await loadUserProfile(mockUser.id);
        const enhancedUser = enhanceUser(mockUser, profileData);
        setUser(enhancedUser);
        setSession({ user: mockUser });
        
        toast.success('Successfully signed in!');
        await logActivity('sign_in', { email });
        setIsLoading(false);
        return true;
      }
      
      // For other users, create a demo user
      if (email && password) {
        const mockUser = {
          id: 'demo-user-id',
          email: email,
        };
        
        const profileData = await loadUserProfile(mockUser.id);
        const enhancedUser = enhanceUser(mockUser, profileData);
        setUser(enhancedUser);
        setSession({ user: mockUser });
        
        toast.success('Successfully signed in!');
        await logActivity('sign_in', { email });
        setIsLoading(false);
        return true;
      }

      toast.error('Invalid credentials');
      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // For demo purposes, simulate user registration
      const mockUser = {
        id: crypto.randomUUID(),
        email: email,
      };
      
      // Create user profile
      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          fullName: email.split('@')[0],
        }),
      });

      if (response.ok) {
        const profileData = await response.json();
        const enhancedUser = enhanceUser(mockUser, profileData);
        setUser(enhancedUser);
        setSession({ user: mockUser });
        
        toast.success('Account created successfully!');
        await logActivity('sign_up', { email });
        setIsLoading(false);
        return true;
      }
      
      toast.error('Registration failed');
      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred');
      setIsLoading(false);
      return false;
    }
  };

  const completeRegistration = async (userData: any): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const response = await fetch(`/api/user-profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        const enhancedUser = enhanceUser(user, updatedProfile);
        setUser(enhancedUser);
        
        toast.success('Registration completed successfully!');
        await logActivity('registration_completed', userData);
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Complete registration error:', error);
      return false;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const response = await fetch(`/api/user-profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        const enhancedUser = enhanceUser(user, updatedProfile);
        setUser(enhancedUser);
        
        toast.success('Profile updated successfully');
        await logActivity('profile_updated', updates);
        return true;
      }
      
      toast.error('Failed to update profile');
      return false;
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logActivity('sign_out');
      setUser(null);
      setProfile(null);
      setSession(null);
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Initialize auth state - simulate checking for existing session
  useEffect(() => {
    const checkSession = async () => {
      // For demo purposes, we'll just set loading to false
      setIsLoading(false);
    };
    
    checkSession();
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    session,
    login,
    register,
    completeRegistration,
    logout,
    updateProfile,
    isLoading,
    isCompanyUser,
  };

  return (
    <AuthContext.Provider value={value}>
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