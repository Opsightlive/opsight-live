
import React from 'react';
import { useNavigate } from 'react-router-dom';
import OwnerOnboarding from '@/components/onboarding/OwnerOnboarding';

const OwnerOnboardingPage = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    // Set owner profile in localStorage and redirect to dashboard
    localStorage.setItem('ownerOnboarded', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <OwnerOnboarding onComplete={handleComplete} />
    </div>
  );
};

export default OwnerOnboardingPage;
