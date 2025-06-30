
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import AutomationDashboard from '@/components/automation/AutomationDashboard';

const AutomationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <AutomationDashboard />
    </div>
  );
};

export default AutomationPage;
