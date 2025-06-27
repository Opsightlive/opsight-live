
import React from 'react';
import OwnerDashboard from '@/components/owner/OwnerDashboard';

const PortfolioOverview = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Portfolio Overview</h1>
        <p className="text-gray-600">Your complete portfolio performance at a glance</p>
      </div>
      
      <OwnerDashboard />
    </div>
  );
};

export default PortfolioOverview;
