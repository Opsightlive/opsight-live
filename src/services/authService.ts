
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

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  required: boolean;
}

export interface AuthFailureLog {
  email?: string;
  ip_address?: string;
  user_agent?: string;
  failure_reason: string;
  attempts_count: number;
  blocked_until?: string;
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
      // Check if user is rate limited
      const isRateLimited = await this.checkRateLimit(email);
      if (isRateLimited) {
        return {
          success: false,
          error: 'Too many failed login attempts. Please try again later.'
        };
      }

      // Company login validation
      if (isCompanyLogin && email !== 'opsightlive@gmail.com') {
        await this.logAuthFailure(email, 'invalid_company_credentials');
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
        await this.logAuthFailure(email, error.message);
        return {
          success: false,
          error: error.message
        };
      }

      if (data.user) {
        // Update session tracking
        await this.updateSessionActivity(data.user.id);
        
        // Check if user needs onboarding
        const needsOnboarding = await this.checkOnboardingStatus(data.user.id);
        
        toast.success('Successfully signed in!');
        return {
          success: true,
          requiresOnboarding: needsOnboarding
        };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      await this.logAuthFailure(email, error.message);
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
        await this.logAuthFailure(email, error.message);
        return {
          success: false,
          error: error.message
        };
      }

      if (data.user) {
        // Create user role entry (handled by trigger, but we can verify)
        await this.assignUserRole(data.user.id, role);
        
        toast.success('Registration successful! Please check your email for verification.');
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      await this.logAuthFailure(email, error.message);
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

  // Role management
  async getUserRoles(userId: string): Promise<UserRoleData[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  }

  async assignUserRole(userId: string, role: UserRole, assignedBy?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: role,
          assigned_by: assignedBy,
          is_active: true
        });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error assigning user role:', error);
      return false;
    }
  }

  async hasRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      const { data } = await supabase.rpc('has_role', {
        user_id: userId,
        role_name: role
      });
      return data || false;
    } catch (error: any) {
      console.error('Error checking user role:', error);
      return false;
    }
  }

  // Session management
  async updateSessionActivity(userId: string): Promise<void> {
    try {
      const userAgent = navigator.userAgent;
      const { error } = await supabase
        .from('user_sessions')
        .upsert({
          user_id: userId,
          session_token: crypto.randomUUID(),
          expires_at: new Date(Date.now() + this.sessionTimeoutMinutes * 60 * 1000).toISOString(),
          last_activity: new Date().toISOString(),
          user_agent: userAgent,
          is_active: true
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating session activity:', error);
    }
  }

  async cleanupExpiredSessions(): Promise<void> {
    try {
      await supabase.rpc('cleanup_expired_auth_data');
    } catch (error: any) {
      console.error('Error cleaning up expired sessions:', error);
    }
  }

  // Rate limiting and security
  private async checkRateLimit(email: string): Promise<boolean> {
    try {
      const { data } = await supabase.rpc('is_rate_limited', {
        p_email: email,
        p_ip_address: await this.getClientIP()
      });
      return data || false;
    } catch (error: any) {
      console.error('Error checking rate limit:', error);
      return false;
    }
  }

  private async logAuthFailure(email: string, reason: string): Promise<void> {
    try {
      const ip = await this.getClientIP();
      const userAgent = navigator.userAgent;
      
      // Get current failure count
      const { data: existingLog } = await supabase
        .from('auth_failure_logs')
        .select('attempts_count')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const attemptCount = (existingLog?.attempts_count || 0) + 1;
      const blockedUntil = attemptCount >= this.maxLoginAttempts 
        ? new Date(Date.now() + this.lockoutDurationMinutes * 60 * 1000).toISOString()
        : null;

      await supabase
        .from('auth_failure_logs')
        .insert({
          email,
          ip_address: ip,
          user_agent: userAgent,
          failure_reason: reason,
          attempts_count: attemptCount,
          blocked_until: blockedUntil
        });
    } catch (error: any) {
      console.error('Error logging auth failure:', error);
    }
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return '0.0.0.0';
    }
  }

  // Onboarding management
  async checkOnboardingStatus(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('completed_at')
        .eq('user_id', userId)
        .single();

      if (error) return true; // Assume needs onboarding if no record
      return !data.completed_at;
    } catch (error: any) {
      console.error('Error checking onboarding status:', error);
      return true;
    }
  }

  async updateOnboardingProgress(
    userId: string, 
    currentStep: string, 
    completedSteps: string[],
    onboardingData: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_onboarding')
        .upsert({
          user_id: userId,
          current_step: currentStep,
          completed_steps: completedSteps,
          onboarding_data: onboardingData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error updating onboarding progress:', error);
      return false;
    }
  }

  async completeOnboarding(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_onboarding')
        .update({
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
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
