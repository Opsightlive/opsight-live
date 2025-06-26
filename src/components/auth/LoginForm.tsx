
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, Building2, Sparkles } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Title Section */}
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
            <h1 className="text-4xl font-bold text-white mb-3 animate-fade-in">OPSIGHT</h1>
            <p className="text-lg text-blue-200 animate-fade-in">Operational Insight</p>
          </div>

          {/* White Login Box */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20 animate-scale-in">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mt-2 text-sm">Sign in to your account</p>
            </div>

            {/* Company Login Toggle */}
            <div className={`flex items-center justify-center space-x-3 mb-6 p-4 rounded-xl text-sm transition-all duration-300 ${
              isCompanyLogin 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <span className={`font-medium transition-colors duration-200 ${isCompanyLogin ? 'text-gray-500' : 'text-blue-600'}`}>
                Client Login
              </span>
              <Switch 
                checked={isCompanyLogin}
                onCheckedChange={setIsCompanyLogin}
                className="transition-all duration-200"
              />
              <span className={`font-medium transition-colors duration-200 ${isCompanyLogin ? 'text-blue-600' : 'text-gray-500'}`}>
                Company Login
              </span>
              <Building2 className={`h-4 w-4 transition-colors duration-200 ${isCompanyLogin ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>

            {isCompanyLogin && (
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl animate-fade-in">
                <p className="text-blue-800 text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <strong>Company Access:</strong> Use opsightlive@gmail.com
                </p>
              </div>
            )}

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
                    placeholder={isCompanyLogin ? "Company email address" : "Enter your email"}
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
                    placeholder="Enter your password"
                    required
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

              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="transition-all duration-200"
                />
                <Label htmlFor="remember" className="text-gray-700 cursor-pointer text-sm hover:text-gray-900 transition-colors duration-200">
                  Remember me
                </Label>
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
                    Signing In...
                  </div>
                ) : (
                  `Sign In${isCompanyLogin ? ' (Company)' : ''}`
                )}
              </Button>
            </form>

            {!isCompanyLogin && (
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={onRegisterClick}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
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
            Streamline your operations with powerful insights and real-time monitoring
          </p>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-3 h-3 bg-blue-400/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-2 h-2 bg-purple-400/40 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 right-12 w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-white/20 animate-scale-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600 text-lg">Sign in to your account</p>
            </div>

            {/* Company Login Toggle */}
            <div className={`flex items-center justify-center space-x-3 mb-6 p-4 rounded-xl transition-all duration-300 ${
              isCompanyLogin 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <span className={`font-medium transition-colors duration-200 ${isCompanyLogin ? 'text-gray-500' : 'text-blue-600'}`}>
                Client Login
              </span>
              <Switch 
                checked={isCompanyLogin}
                onCheckedChange={setIsCompanyLogin}
                className="transition-all duration-200"
              />
              <span className={`font-medium transition-colors duration-200 ${isCompanyLogin ? 'text-blue-600' : 'text-gray-500'}`}>
                Company Login
              </span>
              <Building2 className={`h-4 w-4 transition-colors duration-200 ${isCompanyLogin ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>

            {isCompanyLogin && (
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl animate-fade-in">
                <p className="text-blue-800 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <strong>Company Access:</strong> Use opsightlive@gmail.com
                </p>
              </div>
            )}

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
                    placeholder={isCompanyLogin ? "Company email address" : "Enter your email"}
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
                    placeholder="Enter your password"
                    required
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

              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="transition-all duration-200"
                />
                <Label htmlFor="remember" className="text-gray-700 cursor-pointer hover:text-gray-900 transition-colors duration-200">
                  Remember me
                </Label>
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
                    Signing In...
                  </div>
                ) : (
                  `Sign In${isCompanyLogin ? ' (Company)' : ''}`
                )}
              </Button>
            </form>

            {!isCompanyLogin && (
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={onRegisterClick}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
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
