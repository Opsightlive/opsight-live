import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
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
  const { register, isLoading } = useAuth();
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
        const success = await register(email, password);
        
        if (success) {
          localStorage.removeItem('pendingRegistration');
        } else {
          setError('Registration failed. Please try again.');
          setCurrentStep('register');
        }
      } catch (err) {
        setError('Registration failed. Please try again.');
        setCurrentStep('register');
      }
    } else {
      const success = await register(email, password);
      if (!success) {
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

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className={`w-full ${isMobile ? 'max-w-md' : 'max-w-lg'}`}>
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className={`${isMobile ? 'w-20 h-20' : 'w-28 h-28'} mx-auto`}>
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className={`${isMobile ? 'text-4xl' : 'text-6xl'} font-bold text-white mb-2`}>OPSIGHT</h1>
          <p className={`text-gray-400 ${isMobile ? 'text-base' : 'text-xl'}`}>Operational Insight</p>
        </div>

        <div className={`bg-white rounded-lg shadow-xl ${isMobile ? 'p-6' : 'p-10'}`}>
          <div className="text-center mb-6">
            <h2 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-gray-900`}>Create Account</h2>
            <p className={`text-gray-600 mt-2 ${isMobile ? 'text-sm' : 'text-base'}`}>Get started with Opsight</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className={`text-gray-700 ${isMobile ? 'text-sm' : 'text-base'}`}>Email Address</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 ${isMobile ? 'h-10' : 'h-12 text-lg'}`}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className={`text-gray-700 ${isMobile ? 'text-sm' : 'text-base'}`}>Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-12 pr-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 ${isMobile ? 'h-10' : 'h-12 text-lg'}`}
                  placeholder="Create a password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className={`text-gray-700 ${isMobile ? 'text-sm' : 'text-base'}`}>Confirm Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-12 pr-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 ${isMobile ? 'h-10' : 'h-12 text-lg'}`}
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className={`text-red-600 text-center ${isMobile ? 'text-sm' : 'text-base'}`}>{error}</div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium ${isMobile ? 'py-2.5 text-base' : 'py-4 text-lg'}`}
            >
              {isLoading ? 'Creating Account...' : 'Continue'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
              Already have an account?{' '}
              <button
                onClick={onLoginClick}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
