
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authService, UserRole } from '@/services/authService';
import { toast } from 'sonner';

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  userRoles: UserRole[];
  hasRole: (role: UserRole) => boolean;
  isOwner: boolean;
  isPM: boolean;
  isLP: boolean;
  isAnalyst: boolean;
  login: (email: string, password: string, isCompanyLogin?: boolean) => Promise<boolean>;
  register: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  refreshSession: () => Promise<void>;
  serverStatus: 'healthy' | 'degraded' | 'unhealthy';
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [serverStatus, setServerStatus] = useState<'healthy' | 'degraded' | 'unhealthy'>('healthy');

  // Load user roles
  const loadUserRoles = async (userId: string) => {
    try {
      const roles = await authService.getUserRoles(userId);
      setUserRoles(roles.map(r => r.role));
    } catch (error) {
      console.error('Error loading user roles:', error);
      setUserRoles(['analyst']); // Default fallback
    }
  };

  // Health check
  const checkServerHealth = async () => {
    try {
      const health = await authService.performHealthCheck();
      setServerStatus(health.status);
      
      if (health.status === 'unhealthy') {
        toast.error('Authentication services are experiencing issues');
      }
    } catch (error) {
      setServerStatus('unhealthy');
    }
  };

  // Session refresh with timeout handling
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
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

  // Initialize auth state
  useEffect(() => {
    let sessionRefreshInterval: NodeJS.Timeout;
    let healthCheckInterval: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        // Check server health first
        await checkServerHealth();

        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          const fallback = await authService.handleAuthServerFailure();
          if (fallback.isServerDown) {
            toast.error(fallback.fallbackMessage);
          }
        }

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          await loadUserRoles(currentSession.user.id);
          await authService.updateSessionActivity(currentSession.user.id);
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth event:', event);
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              setTimeout(async () => {
                await loadUserRoles(session.user.id);
                await authService.updateSessionActivity(session.user.id);
              }, 0);
            } else {
              setUserRoles([]);
            }
          }
        );

        // Set up session refresh interval (every 25 minutes)
        sessionRefreshInterval = setInterval(refreshSession, 25 * 60 * 1000);
        
        // Set up health check interval (every 5 minutes)
        healthCheckInterval = setInterval(checkServerHealth, 5 * 60 * 1000);

        setIsLoading(false);

        return () => {
          subscription.unsubscribe();
          if (sessionRefreshInterval) clearInterval(sessionRefreshInterval);
          if (healthCheckInterval) clearInterval(healthCheckInterval);
        };
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        setIsLoading(false);
        toast.error('Failed to initialize authentication');
      }
    };

    initializeAuth();

    return () => {
      if (sessionRefreshInterval) clearInterval(sessionRefreshInterval);
      if (healthCheckInterval) clearInterval(healthCheckInterval);
    };
  }, []);

  // Enhanced login
  const login = async (email: string, password: string, isCompanyLogin = false): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const result = await authService.login(email, password, isCompanyLogin);
      
      if (result.success && result.requiresOnboarding) {
        // Redirect to onboarding if needed
        window.location.href = '/onboarding';
      }
      
      return result.success;
    } catch (error: any) {
      console.error('Login error:', error);
      const fallback = await authService.handleAuthServerFailure();
      if (fallback.isServerDown) {
        toast.error(fallback.fallbackMessage);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced registration
  const register = async (email: string, password: string, role: UserRole = 'analyst'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const result = await authService.register(email, password, role);
      return result.success;
    } catch (error: any) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced logout with cleanup
  const logout = async (): Promise<void> => {
    try {
      if (user) {
        // Clean up sessions
        await authService.cleanupExpiredSessions();
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error('Failed to sign out completely');
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      setUserRoles([]);
      
      // Clear any cached data
      localStorage.removeItem('onboardingData');
      
      toast.success('Successfully signed out');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Error during sign out');
    }
  };

  // Password reset
  const resetPassword = async (email: string): Promise<boolean> => {
    return await authService.resetPassword(email);
  };

  // Role checking utilities
  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  const isOwner = hasRole('owner');
  const isPM = hasRole('pm');
  const isLP = hasRole('lp');
  const isAnalyst = hasRole('analyst');

  return {
    user,
    session,
    isLoading,
    userRoles,
    hasRole,
    isOwner,
    isPM,
    isLP,
    isAnalyst,
    login,
    register,
    logout,
    resetPassword,
    refreshSession,
    serverStatus
  };
};
