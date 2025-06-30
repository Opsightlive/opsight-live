
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import OnboardingSetup from '@/components/auth/OnboardingSetup';

const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative">
      {/* Back Button - Top Left */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          className="bg-white hover:bg-gray-50 border-2 border-gray-400 shadow-2xl h-12 w-12 rounded-full flex items-center justify-center p-0"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </Button>
      </div>
      
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
          </div>
        </div>
      </div>

      {/* Onboarding Setup */}
      <div className="flex-1">
        <OnboardingSetup onComplete={() => window.location.href = '/dashboard'} />
      </div>
    </div>
  );
};

export default SignupPage;
