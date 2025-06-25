import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface LoginFormProps {
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title Section - Outside the white box */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto relative">
              {/* Outer bright cyan ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 shadow-2xl"></div>
              
              {/* Inner darker blue ring */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"></div>
              
              {/* Dark center */}
              <div className="absolute inset-4 rounded-full bg-gray-900"></div>
              
              {/* Main dark shadow area in top-right - this is the key feature from reference */}
              <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 opacity-90"></div>
              
              {/* Secondary dark shading for depth */}
              <div className="absolute top-1 right-1 w-10 h-10 rounded-full bg-gradient-to-br from-black/80 via-gray-900/70 to-blue-900/60"></div>
              
              {/* Smaller concentrated dark spot */}
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gradient-to-br from-black/90 via-gray-900/80 to-transparent"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">OPSIGHT</h1>
          <p className="text-xl text-gray-300">Operational Insight</p>
        </div>

        {/* White Login Box */}
        <div className="bg-white rounded-lg p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

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
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
