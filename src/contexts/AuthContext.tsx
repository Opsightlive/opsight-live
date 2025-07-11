import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { EmailService } from '@/services/email/emailService';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  role: string | null;
  phone: string | null;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  subscription_status?: string;
  trial_end?: string;
  onboarding_completed?: boolean;
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
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string, isCompanyLogin?: boolean) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  completeRegistration: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
  updateProfile,
    isLoading,
    isCompanyUser,
    enableMFA,
    disableMFA,
    verifyMFA,
    isMFAEnabled: boolean;
  enableMFA: () => Promise<boolean>;
  disableMFA: () => Promise<boolean>;
  verifyMFA: (token: string) => Promise<boolean>;
  isMFAEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateProfile,
    isLoading,
    isCompanyUser,
    enableMFA,
    disableMFA,
    verifyMFA,
    isMFAEnabled = profile?.role === 'Company Admin';

  // Log activity to database
  const logActivity = async (actionType: string, actionDetails: any = {}, success: boolean = true, errorMessage?: string) => {
    if (!user) return;
    
    try {
      await supabase.from('user_activity_logs').insert({
        user_id: user.id,
        action_type: actionType,
        action_details: actionDetails,
        success,
        error_message: errorMessage,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  // Load user profile from database
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load user profile');
        return null;
      }

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load user profile');
      return null;
    }
  };

  // Enhance user object with profile data
  const enhanceUser = (baseUser: User, profileData: UserProfile | null): AuthUser => {
    return {
      ...baseUser,
      name: profileData?.full_name || baseUser.email?.split('@')[0] || 'User',
      avatar: profileData?.avatar_url,
      company: profileData?.company_name,
      role: profileData?.role,
      phone: profileData?.phone,
      bio: '', // Default empty bio
      subscription: {
        status: profileData?.subscription_status || 'trial',
        trialEnd: profileData?.trial_end || '2025-01-29'
      }
    };
  };

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        
        if (session?.user) {
          // Load user profile when authenticated
          setTimeout(async () => {
            const profileData = await loadUserProfile(session.user.id);
            const enhancedUser = enhanceUser(session.user, profileData);
            setUser(enhancedUser);
          }, 0);
          
          // Log successful authentication
          if (event === 'SIGNED_IN') {
            setTimeout(() => {
              logActivity('sign_in', { email: session.user.email });
            }, 0);
          }
        } else {
          setUser(null);
          setProfile(null);
      navigate("/", { replace: true });
          if (event === 'SIGNED_OUT') {
            toast.success('Successfully signed out');
          }
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        loadUserProfile(session.user.id).then((profileData) => {
          const enhancedUser = enhanceUser(session.user, profileData);
          setUser(enhancedUser);
        });
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, isCompanyLogin?: boolean): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // For company login, check if it's the specific company email
      if (isCompanyLogin && email !== 'opsightlive@gmail.com') {
        toast.error('Invalid company credentials.');
        setIsLoading(false);
        return false;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'Login failed');
        await logActivity('sign_in_failed', { email, error: error.message }, false, error.message);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        toast.success('Successfully signed in!');
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
      await logActivity('sign_in_failed', { email, error: error.message }, false, error.message);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: email.split('@')[0],
            company_name: null,
            role: 'User',
            phone: null
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        toast.error(error.message || 'Registration failed');
        await logActivity('sign_up_failed', { email, error: error.message }, false, error.message);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: email.split('@')[0],
            company_name: null,
            role: 'User',
            phone: null,
            subscription_status: 'trial',
            trial_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days trial
            onboarding_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        // Send welcome email
        const userName = email.split('@')[0];
        await EmailService.sendWelcomeEmail(email, userName);

        // Send onboarding reminder after 24 hours
        setTimeout(async () => {
          await EmailService.sendOnboardingReminder(email, userName);
        }, 24 * 60 * 60 * 1000);

        toast.success('Registration successful! Please check your email for verification.');
        await logActivity('sign_up_success', { email });
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred');
      await logActivity('sign_up_failed', { email, error: error.message }, false, error.message);
      setIsLoading(false);
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) {
        console.error('Password reset error:', error);
        toast.error(error.message || 'Password reset failed');
        return false;
      }

      // Send password reset email
      await EmailService.sendPasswordResetEmail(email, redirectUrl);

      toast.success('Password reset email sent! Please check your inbox.');
      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const completeRegistration = async (userData: any): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      // Update user profile with onboarding data
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: userData.name || user.email?.split('@')[0],
          company_name: userData.company,
          role: userData.role,
          phone: userData.phone,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        toast.error('Failed to update profile');
        await logActivity('profile_update_failed', userData, false, profileError.message);
        setIsLoading(false);
        return false;
      }

      // Save onboarding data if it exists
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        
        const { error: onboardingError } = await supabase
          .from('onboarding_data')
          .insert({
            user_id: user.id,
            company_name: data.companyName,
            role: data.role,
            data_source: data.dataSource,
            total_cost: data.totalCost,
            discount: data.discount,
            setup_completed: true,
            payment_completed: true,
            created_at: new Date().toISOString()
          });

        if (onboardingError) {
          console.error('Onboarding data error:', onboardingError);
        }

        // Save properties
        if (data.properties && data.properties.length > 0) {
          const propertiesData = data.properties.map((prop: any) => ({
            user_id: user.id,
            name: prop.name,
            address: prop.address,
            units: parseInt(prop.units || '0'),
            tier: prop.tier,
            pm_software: prop.pmSoftware,
            payment_method: prop.paymentMethod,
            monthly_cost: parseFloat(prop.monthlyCost || '0'),
            created_at: new Date().toISOString()
          }));

          const { error: propertiesError } = await supabase
            .from('user_properties')
            .insert(propertiesData);

          if (propertiesError) {
            console.error('Properties insert error:', propertiesError);
          }
        }

        localStorage.removeItem('onboardingData');
      }

      // Reload profile data
      const profileData = await loadUserProfile(user.id);
      const enhancedUser = enhanceUser(user, profileData);
      setUser(enhancedUser);
      
      toast.success('Registration completed successfully!');
      await logActivity('registration_completed', userData);
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Registration completion failed:', error);
      toast.error('Failed to complete registration');
      await logActivity('registration_completion_failed', userData, false, error.message);
      setIsLoading(false);
      return false;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        toast.error('Failed to update profile');
        await logActivity('profile_update_failed', updates, false, error.message);
        return false;
      }

      // Reload profile data
      const profileData = await loadUserProfile(user.id);
      const enhancedUser = enhanceUser(user, profileData);
      setUser(enhancedUser);
      toast.success('Profile updated successfully');
      await logActivity('profile_updated', updates);
      return true;
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      await logActivity('profile_update_failed', updates, false, error.message);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logActivity('sign_out');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Failed to sign out');
        return;
      }

      // Clear local storage
      localStorage.removeItem('onboardingData');
      localStorage.removeItem('pendingRegistration');
      
      setUser(null);
      setSession(null);
      setProfile(null);
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    }
  };

  // 2FA Functions
  const enableMFA = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp"
      });
      
      if (error) {
        console.error("MFA enrollment error:", error);
        toast.error(error.message || "Failed to enable 2FA");
        return false;
      }
      
      toast.success("2FA enabled successfully! Please save your recovery codes.");
      return true;
    } catch (error: any) {
      console.error("MFA enrollment error:", error);
      toast.error("Failed to enable 2FA");
      return false;
    }
  };
  
  const disableMFA = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId: "totp"
      });
      
      if (error) {
        console.error("MFA unenrollment error:", error);
        toast.error(error.message || "Failed to disable 2FA");
        return false;
      }
      
      setIsMFAEnabled(false);
      toast.success("2FA disabled successfully");
      return true;
    } catch (error: any) {
      console.error("MFA unenrollment error:", error);
      toast.error("Failed to disable 2FA");
      return false;
    }
  };
  
  const verifyMFA = async (token: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId: "totp",
        challengeId: token
      });
      
      if (error) {
        console.error("MFA verification error:", error);
        toast.error(error.message || "Invalid 2FA code");
        return false;
      }
      
      toast.success("2FA verification successful");
      return true;
    } catch (error: any) {
      console.error("MFA verification error:", error);
      toast.error("Invalid 2FA code");
      return false;
    }
  };
  const value = {
    user,
    profile,
    session,
    login,
    register,
    completeRegistration,
    resetPassword,
    logout,
    updateProfile,
    isLoading,
    updateProfile,
    isLoading,
    isCompanyUser,
    enableMFA,
    disableMFA,
    verifyMFA,
    isMFAEnabled
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
