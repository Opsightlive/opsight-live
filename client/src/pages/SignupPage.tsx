
import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Header with back to home */}
      <div className="bg-transparent border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 mr-3 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">O</span>
              </div>
              <span className="text-2xl font-bold text-white">OPSIGHT</span>
            </Link>
            <Link to="/" className="text-blue-200 hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="flex-1 flex items-center justify-center py-12">
        <RegisterForm onLoginClick={() => window.location.href = '/login'} />
      </div>
    </div>
  );
};

export default SignupPage;
