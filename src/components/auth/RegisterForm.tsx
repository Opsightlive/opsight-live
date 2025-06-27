import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import OnboardingSetup from './OnboardingSetup';
import PaymentSetup from './PaymentSetup';

interface RegisterFormProps {
  onLoginClick: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState('register');
  const { register, completeRegistration, isLoading } = useAuth();
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Store the credentials for later use after onboarding
    localStorage.setItem('pendingRegistration', JSON.stringify({
      email,
      password
    }));
    
    // Move to onboarding step
    setCurrentStep('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentStep('payment');
  };

  const handlePaymentComplete = async () => {
    const pendingRegistration = localStorage.getItem('pendingRegistration');
    
    if (pendingRegistration) {
      const { email, password } = JSON.parse(pendingRegistration);
      
      try {
        // Register the user with Supabase
        const success = await register(email, password);
        
        if (success) {
          // Clean up pending registration
          localStorage.removeItem('pendingRegistration');
          
          // Complete registration will be handled by the auth context
          // after the user is successfully created and authenticated
        } else {
          setError('Registration failed. Please try again.');
          setCurrentStep('register');
        }
      } catch (err) {
        console.error('Registration error:', err);
        setError('Registration failed. Please try again.');
        setCurrentStep('register');
      }
    }
  };

  if (currentStep === 'onboarding') {
    return <OnboardingSetup onComplete={handleOnboardingComplete} />;
  }

  if (currentStep === 'payment') {
    return <PaymentSetup onComplete={handlePaymentComplete} />;
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto animate-fade-in">
                <img 
                  src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                  alt="OPSIGHT Logo" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">OPSIGHT</h1>
            <p className="text-blue-200 text-base animate-fade-in">Operational Insight</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20 animate-scale-in">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Create Account
              </h2>
              <p className="text-gray-600 mt-2 text-sm">Get started with Opsight</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <Label htmlFor="email" className="text-gray-700 text-sm font-medium">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 h-10 transition-all duration-200 group-focus-within:shadow-md"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <Label htmlFor="password" className="text-gray-700 text-sm font-medium">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 h-10 transition-all duration-200 group-focus-within:shadow-md"
                    placeholder="Create a password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="group">
                <Label htmlFor="confirmPassword" className="text-gray-700 text-sm font-medium">Confirm Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 pr-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 h-10 transition-all duration-200 group-focus-within:shadow-md"
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-center text-sm bg-red-50 p-3 rounded-lg border border-red-200 animate-fade-in">{error}</div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 text-base transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Continue'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <button
                  onClick={onLoginClick}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex overflow-hidden">
      {/* Left Side - Branding */}
      <div className="flex-1 flex items-center justify-center p-12 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
        
        <div className="text-center relative z-10">
          <div className="mb-8 animate-fade-in">
            <div className="w-64 h-40 mx-auto">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT Logo" 
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          <h1 className="text-8xl font-bold text-white mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent animate-fade-in">
            OPSIGHT
          </h1>
          <p className="text-3xl text-blue-200 mb-6 animate-fade-in">Operational Insight</p>
          <p className="text-xl text-blue-300/80 max-w-md animate-fade-in">
            Join thousands of professionals who trust OPSIGHT for operational excellence
          </p>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-3 h-3 bg-blue-400/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-2 h-2 bg-purple-400/40 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 right-12 w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-white/20 animate-scale-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-600" />
                Create Account
              </h2>
              <p className="text-gray-600 text-lg">Get started with Opsight</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <Label htmlFor="email" className="text-gray-700 text-base font-medium">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 h-12 text-lg transition-all duration-200 group-focus-within:shadow-lg"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <Label htmlFor="password" className="text-gray-700 text-base font-medium">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 h-12 text-lg transition-all duration-200 group-focus-within:shadow-lg"
                    placeholder="Create a password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-blue-600 transition-colors duration-200 transform hover:scale-110"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="group">
                <Label htmlFor="confirmPassword" className="text-gray-700 text-base font-medium">Confirm Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 pr-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 h-12 text-lg transition-all duration-200 group-focus-within:shadow-lg"
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-blue-600 transition-colors duration-200 transform hover:scale-110"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-center bg-red-50 p-4 rounded-xl border border-red-200 animate-fade-in">{error}</div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-4 text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Continue'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={onLoginClick}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
