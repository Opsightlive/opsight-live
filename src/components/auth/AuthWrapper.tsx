
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import FallbackUI from '@/components/common/FallbackUI';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
            alt="OPSIGHT" 
            className="h-12 w-12 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-white mb-6">OPSIGHT</h1>
          <LoadingSpinner size="lg" />
          <p className="text-gray-300 mt-4">Initializing your workspace...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <FallbackUI
          type="error"
          title="Authentication Error"
          description={authError}
          actionLabel="Try Again"
          onAction={() => setAuthError(null)}
          className="text-white"
        />
      </div>
    );
  }

  if (!user) {
    return isLogin ? (
      <LoginForm 
        onRegisterClick={() => setIsLogin(false)} 
      />
    ) : (
      <RegisterForm 
        onLoginClick={() => setIsLogin(true)} 
      />
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
