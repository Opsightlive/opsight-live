
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  role: string | null;
  phone: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  completeRegistration: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  isLoading: boolean;
  isCompanyUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompanyUser = profile?.role === 'Company Admin';

  // Log activity to database
  const logActivity = async (actionType: string, actionDetails: any = {}, success: boolean = true, errorMessage?: string) => {
    if (!user) return;
    
    try {
      await supabase.from('user_activity_logs').insert({
        user_id: user.id,
        action_type: actionType,
        action_details: actionDetails,
        success,
        error_message: errorMessage
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

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Load user profile when authenticated
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
          
          // Log successful authentication
          if (event === 'SIGNED_IN') {
            setTimeout(() => {
              logActivity('sign_in', { email: session.user.email });
            }, 0);
          }
        } else {
          setProfile(null);
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
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
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
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
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
          phone: userData.phone
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
            payment_completed: true
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
            monthly_cost: parseFloat(prop.monthlyCost || '0')
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
      await loadUserProfile(user.id);
      
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
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        toast.error('Failed to update profile');
        await logActivity('profile_update_failed', updates, false, error.message);
        return false;
      }

      // Reload profile data
      await loadUserProfile(user.id);
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
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    }
  };

  const value = {
    user,
    profile,
    session,
    login,
    register,
    completeRegistration,
    logout,
    updateProfile,
    isLoading,
    isCompanyUser
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
