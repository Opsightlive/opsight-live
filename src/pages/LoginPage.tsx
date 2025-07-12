
import React, { useState } from 'react';
import { BackToHomeButton } from "@/components/ui/BackToHomeButton";import { Link } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Header with back to home */}
      <div className="bg-transparent border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT" 
                className="h-8 w-8 mr-3"
              />
              <span className="text-2xl font-bold text-white">OPSIGHT</span>
            </Link>
            <Link to="/" className="text-blue-200 hover:text-white transition-colors">
              Back to Home →
            </Link>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center py-12">
        <LoginForm onRegisterClick={() => window.location.href = '/signup'} />
      </div>
    </div>
  );
};

export default LoginPage;
