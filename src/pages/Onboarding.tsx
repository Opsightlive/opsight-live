
import React from 'react';
import PlaceholderModule from './PlaceholderModule';
import Navigation from '@/components/layout/Navigation';

const Onboarding = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <PlaceholderModule
          moduleName="Onboarding"
          description="New user onboarding and initial setup process."
        />
      </div>
    </div>
  );
};

export default Onboarding;
