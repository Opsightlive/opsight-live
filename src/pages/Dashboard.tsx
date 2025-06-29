
import React from 'react';
import OwnerDashboard from '@/components/owner/OwnerDashboard';
import ModuleLoader from '@/components/navigation/ModuleLoader';

const Dashboard = () => {
  return (
    <ModuleLoader moduleName="Dashboard">
      <OwnerDashboard />
    </ModuleLoader>
  );
};

export default Dashboard;
