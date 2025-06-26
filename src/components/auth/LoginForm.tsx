import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, Building2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LoginFormProps {
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCompanyLogin, setIsCompanyLogin] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const isMobile = useIsMobile();

  // Load remembered credentials on component mount
  useEffect(() => {
    const rememberedClientEmail = localStorage.getItem('opsight_remember_client_email');
    const rememberedCompanyEmail = localStorage.getItem('opsight_remember_company_email');
    
    if (isCompanyLogin && rememberedCompanyEmail) {
      setEmail(rememberedCompanyEmail);
      setRememberMe(true);
    } else if (!isCompanyLogin && rememberedClientEmail) {
      setEmail(rememberedClientEmail);
      setRememberMe(true);
    }
  }, [isCompanyLogin]);

  // Clear email when switching between login types if not remembered
  useEffect(() => {
    const rememberedClientEmail = localStorage.getItem('opsight_remember_client_email');
    const rememberedCompanyEmail = localStorage.getItem('opsight_remember_company_email');
    
    if (isCompanyLogin) {
      setEmail(rememberedCompanyEmail || '');
      setRememberMe(!!rememberedCompanyEmail);
    } else {
      setEmail(rememberedClientEmail || '');
      setRememberMe(!!rememberedClientEmail);
    }
  }, [isCompanyLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password, isCompanyLogin);
    if (success) {
      // Handle remember me functionality
      if (rememberMe) {
        if (isCompanyLogin) {
          localStorage.setItem('opsight_remember_company_email', email);
        } else {
          localStorage.setItem('opsight_remember_client_email', email);
        }
      } else {
        // Clear remembered email if remember me is unchecked
        if (isCompanyLogin) {
          localStorage.removeItem('opsight_remember_company_email');
        } else {
          localStorage.removeItem('opsight_remember_client_email');
        }
      }
    } else {
      if (isCompanyLogin) {
        setError('Invalid company credentials. Use opsightlive@gmail.com');
      } else {
        setError('Invalid email or password');
      }
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Title Section */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto">
                <img 
                  src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                  alt="OPSIGHT Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">OPSIGHT</h1>
            <p className="text-lg text-gray-300">Operational Insight</p>
          </div>

          {/* White Login Box */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mt-2 text-sm">Sign in to your account</p>
            </div>

            {/* Company Login Toggle */}
            <div className="flex items-center justify-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg text-sm">
              <span className="font-medium text-gray-700">Client Login</span>
              <Switch 
                checked={isCompanyLogin}
                onCheckedChange={setIsCompanyLogin}
              />
              <span className="font-medium text-gray-700">Company Login</span>
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>

            {isCompanyLogin && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Company Access:</strong> Use opsightlive@gmail.com
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-gray-700 text-sm">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 h-10"
                    placeholder={isCompanyLogin ? "Company email address" : "Enter your email"}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 text-sm">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 h-10"
                    placeholder="Enter your password"
                    required
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

              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-gray-700 cursor-pointer text-sm">
                  Remember me
                </Label>
              </div>

              {error && (
                <div className="text-red-600 text-center text-sm">{error}</div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 text-base"
              >
                {isLoading ? 'Signing In...' : `Sign In${isCompanyLogin ? ' (Company)' : ''}`}
              </Button>
            </form>

            {!isCompanyLogin && (
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={onRegisterClick}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Register here
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Side - Branding */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-48 h-32 mx-auto">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-8xl font-bold text-white mb-4">OPSIGHT</h1>
          <p className="text-3xl text-gray-300">Operational Insight</p>
          <p className="text-xl text-gray-400 mt-4 max-w-md">
            Streamline your operations with powerful insights and real-time monitoring
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mt-2 text-lg">Sign in to your account</p>
            </div>

            {/* Company Login Toggle */}
            <div className="flex items-center justify-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Client Login</span>
              <Switch 
                checked={isCompanyLogin}
                onCheckedChange={setIsCompanyLogin}
              />
              <span className="font-medium text-gray-700">Company Login</span>
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>

            {isCompanyLogin && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  <strong>Company Access:</strong> Use opsightlive@gmail.com
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-700 text-base">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 h-12 text-lg"
                    placeholder={isCompanyLogin ? "Company email address" : "Enter your email"}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 text-base">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 h-12 text-lg"
                    placeholder="Enter your password"
                    required
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

              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-gray-700 cursor-pointer">
                  Remember me
                </Label>
              </div>

              {error && (
                <div className="text-red-600 text-center">{error}</div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 text-lg"
              >
                {isLoading ? 'Signing In...' : `Sign In${isCompanyLogin ? ' (Company)' : ''}`}
              </Button>
            </form>

            {!isCompanyLogin && (
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={onRegisterClick}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Register here
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
