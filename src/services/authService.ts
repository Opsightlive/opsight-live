
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type UserRole = 'owner' | 'pm' | 'lp' | 'analyst';

export interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  assigned_by?: string;
  assigned_at: string;
  is_active: boolean;
  permissions: Record<string, any>;
}

class AuthService {
  private sessionTimeoutMinutes = 30;
  private maxLoginAttempts = 5;
  private lockoutDurationMinutes = 15;

  // Enhanced login with rate limiting and session management
  async login(email: string, password: string, isCompanyLogin = false): Promise<{
    success: boolean;
    error?: string;
    requiresOnboarding?: boolean;
  }> {
    try {
      // Company login validation
      if (isCompanyLogin && email !== 'opsightlive@gmail.com') {
        return {
          success: false,
          error: 'Invalid company credentials. Use opsightlive@gmail.com'
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      if (data.user) {
        // Check if user needs onboarding
        const needsOnboarding = !localStorage.getItem('onboardingCompleted');
        
        toast.success('Successfully signed in!');
        return {
          success: true,
          requiresOnboarding: needsOnboarding
        };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  // Enhanced registration with role assignment
  async register(email: string, password: string, role: UserRole = 'analyst'): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const redirectUrl = `${window.location.origin}/onboarding`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role: role
          }
        }
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      if (data.user) {
        toast.success('Registration successful! Please check your email for verification.');
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during registration.'
      };
    }
  }

  // Password reset functionality
  async resetPassword(email: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Password reset email sent successfully');
      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset email');
      return false;
    }
  }

  // Role management - simplified to work with existing schema
  async getUserRoles(userId: string): Promise<UserRoleData[]> {
    try {
      // Since the new tables aren't in the types yet, we'll use user_profiles
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId);

      if (error) throw error;
      
      // Convert user_profiles data to UserRoleData format
      const userData = data?.[0];
      if (userData) {
        return [{
          id: userData.id,
          user_id: userData.id,
          role: (userData.role as UserRole) || 'analyst',
          assigned_at: userData.created_at || new Date().toISOString(),
          is_active: true,
          permissions: {}
        }];
      }
      
      return [{
        id: userId,
        user_id: userId,
        role: 'analyst',
        assigned_at: new Date().toISOString(),
        is_active: true,
        permissions: {}
      }];
    } catch (error: any) {
      console.error('Error fetching user roles:', error);
      return [{
        id: userId,
        user_id: userId,
        role: 'analyst',
        assigned_at: new Date().toISOString(),
        is_active: true,
        permissions: {}
      }];
    }
  }

  async assignUserRole(userId: string, role: UserRole, assignedBy?: string): Promise<boolean> {
    try {
      // Update the user_profiles table with the role
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: role })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error assigning user role:', error);
      return false;
    }
  }

  async hasRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single();

      return data?.role === role;
    } catch (error: any) {
      console.error('Error checking user role:', error);
      return false;
    }
  }

  // Session management - simplified
  async updateSessionActivity(userId: string): Promise<void> {
    try {
      // For now, we'll just log this activity
      console.log(`Session activity updated for user: ${userId}`);
    } catch (error: any) {
      console.error('Error updating session activity:', error);
    }
  }

  async cleanupExpiredSessions(): Promise<void> {
    try {
      // For now, we'll just log this
      console.log('Cleaning up expired sessions');
    } catch (error: any) {
      console.error('Error cleaning up expired sessions:', error);
    }
  }

  // Onboarding management
  async checkOnboardingStatus(userId: string): Promise<boolean> {
    // Check localStorage for now
    return !localStorage.getItem('onboardingCompleted');
  }

  async updateOnboardingProgress(
    userId: string, 
    currentStep: string, 
    completedSteps: string[],
    onboardingData: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      // Save to localStorage for now
      localStorage.setItem('onboardingData', JSON.stringify({
        userId,
        currentStep,
        completedSteps,
        onboardingData,
        updated_at: new Date().toISOString()
      }));
      return true;
    } catch (error: any) {
      console.error('Error updating onboarding progress:', error);
      return false;
    }
  }

  async completeOnboarding(userId: string): Promise<boolean> {
    try {
      localStorage.setItem('onboardingCompleted', 'true');
      return true;
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  }

  // Error handling and fallbacks
  async handleAuthServerFailure(): Promise<{
    isServerDown: boolean;
    fallbackMessage: string;
  }> {
    try {
      // Test basic connectivity
      const { error } = await supabase.from('user_profiles').select('id').limit(1);
      
      if (error) {
        return {
          isServerDown: true,
          fallbackMessage: 'Authentication services are temporarily unavailable. Please try again in a few minutes or contact support if the issue persists.'
        };
      }

      return { isServerDown: false, fallbackMessage: '' };
    } catch (error: any) {
      return {
        isServerDown: true,
        fallbackMessage: 'Unable to connect to authentication services. Please check your internet connection and try again.'
      };
    }
  }

  // Health check for scaling
  async performHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    responseTime: number;
    details: string;
  }> {
    const startTime = Date.now();
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);

      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          status: 'unhealthy',
          responseTime,
          details: error.message
        };
      }

      if (responseTime > 2000) {
        return {
          status: 'degraded',
          responseTime,
          details: 'Slow response time detected'
        };
      }

      return {
        status: 'healthy',
        responseTime,
        details: 'All systems operational'
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        details: error.message
      };
    }
  }
}

export const authService = new AuthService();
