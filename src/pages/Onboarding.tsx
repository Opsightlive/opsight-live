
import React from 'react';
import PlaceholderModule from './PlaceholderModule';
import Navigation from '@/components/layout/Navigation';

const Onboarding = () => {
  return (
    <div>
      <Navigation />
      <PlaceholderModule
        moduleName="Onboarding"
        description="New user onboarding and initial setup process."
      />
    </div>
  );
};

export default Onboarding;
