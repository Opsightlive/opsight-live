
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authService, UserRole } from '@/services/authService';
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

interface AuthUser extends User {
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
  roles: UserRole[];
}

interface EnhancedAuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string, isCompanyLogin?: boolean) => Promise<boolean>;
  register: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  hasRole: (role: UserRole) => boolean;
  isOwner: boolean;
  isPM: boolean;
  isLP: boolean;
  isAnalyst: boolean;
  isLoading: boolean;
  serverStatus: 'healthy' | 'degraded' | 'unhealthy';
  sessionTimeRemaining: number;
  refreshSession: () => Promise<void>;
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

export const EnhancedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState<'healthy' | 'degraded' | 'unhealthy'>('healthy');
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  // Load user profile and roles
  const loadUserData = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError);
      } else if (profileData) {
        setProfile(profileData);
      }

      // Load roles
      const roles = await authService.getUserRoles(userId);
      const roleNames = roles.map(r => r.role);
      setUserRoles(roleNames);

      return { profileData, roleNames };
    } catch (error) {
      console.error('Error loading user data:', error);
      return { profileData: null, roleNames: ['analyst'] as UserRole[] };
    }
  };

  // Enhance user object with profile data and roles
  const enhanceUser = (baseUser: User, profileData: UserProfile | null, roles: UserRole[]): AuthUser => {
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
      },
      roles
    };
  };

  // Session timeout management
  useEffect(() => {
    let timeoutInterval: NodeJS.Timeout;
    
    if (session) {
      const updateTimeRemaining = () => {
        const expiresAt = session.expires_at;
        if (expiresAt) {
          const remaining = expiresAt - Math.floor(Date.now() / 1000);
          setSessionTimeRemaining(Math.max(0, remaining));
          
          // Show warning when 5 minutes remain
          if (remaining === 300) {
            toast.warning('Your session will expire in 5 minutes');
          }
          
          // Auto-refresh when 2 minutes remain
          if (remaining === 120) {
            refreshSession();
          }
        }
      };

      timeoutInterval = setInterval(updateTimeRemaining, 1000);
      updateTimeRemaining();
    }

    return () => {
      if (timeoutInterval) clearInterval(timeoutInterval);
    };
  }, [session]);

  // Health monitoring
  useEffect(() => {
    const checkHealth = async () => {
      const health = await authService.performHealthCheck();
      setServerStatus(health.status);
    };

    checkHealth();
    const healthInterval = setInterval(checkHealth, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(healthInterval);
  }, []);

  // Initialize auth state
  useEffect(() => {
    let sessionRefreshInterval: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }

        if (currentSession) {
          setSession(currentSession);
          const { profileData, roleNames } = await loadUserData(currentSession.user.id);
          const enhancedUser = enhanceUser(currentSession.user, profileData, roleNames);
          setUser(enhancedUser);
          await authService.updateSessionActivity(currentSession.user.id);
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth event:', event);
            
            setSession(session);
            
            if (session?.user) {
              setTimeout(async () => {
                const { profileData, roleNames } = await loadUserData(session.user.id);
                const enhancedUser = enhanceUser(session.user, profileData, roleNames);
                setUser(enhancedUser);
                await authService.updateSessionActivity(session.user.id);
              }, 0);
            } else {
              setUser(null);
              setProfile(null);
              setUserRoles([]);
            }
          }
        );

        // Set up session refresh interval (every 25 minutes)
        sessionRefreshInterval = setInterval(async () => {
          try {
            const { data, error } = await supabase.auth.refreshSession();
            if (error) throw error;
            
            if (data.session) {
              setSession(data.session);
              if (data.session.user) {
                await authService.updateSessionActivity(data.session.user.id);
              }
            }
          } catch (error: any) {
            console.error('Session refresh failed:', error);
            toast.error('Session expired. Please log in again.');
            await logout();
          }
        }, 25 * 60 * 1000);

        setIsLoading(false);

        return () => {
          subscription.unsubscribe();
          if (sessionRefreshInterval) clearInterval(sessionRefreshInterval);
        };
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (sessionRefreshInterval) clearInterval(sessionRefreshInterval);
    };
  }, []);

  // Auth methods
  const login = async (email: string, password: string, isCompanyLogin = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password, isCompanyLogin);
      return result.success;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, role: UserRole = 'analyst'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await authService.register(email, password, role);
      return result.success;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (user) {
        await authService.cleanupExpiredSessions();
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error('Failed to sign out completely');
      }
      
      setUser(null);
      setSession(null);
      setProfile(null);
      setUserRoles([]);
      
      localStorage.removeItem('onboardingCompleted');
      toast.success('Successfully signed out');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Error during sign out');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        toast.error('Failed to update profile');
        return false;
      }

      const { profileData } = await loadUserData(user.id);
      if (profileData) {
        setProfile(profileData);
        const enhancedUser = enhanceUser(user, profileData, userRoles);
        setUser(enhancedUser);
      }
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    return await authService.resetPassword(email);
  };

  const refreshSession = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      if (data.session) {
        setSession(data.session);
        if (data.session.user) {
          await authService.updateSessionActivity(data.session.user.id);
        }
      }
    } catch (error: any) {
      console.error('Session refresh failed:', error);
      toast.error('Session expired. Please log in again.');
      await logout();
    }
  };

  // Role checking utilities
  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  const isOwner = hasRole('owner');
  const isPM = hasRole('pm');
  const isLP = hasRole('lp');
  const isAnalyst = hasRole('analyst');

  const value = {
    user,
    profile,
    session,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    hasRole,
    isOwner,
    isPM,
    isLP,
    isAnalyst,
    isLoading,
    serverStatus,
    sessionTimeRemaining,
    refreshSession
  };

  return <EnhancedAuthContext.Provider value={value}>{children}</EnhancedAuthContext.Provider>;
};

export const useEnhancedAuth = () => {
  const context = useContext(EnhancedAuthContext);
  if (context === undefined) {
    throw new Error('useEnhancedAuth must be used within an EnhancedAuthProvider');
  }
  return context;
};
