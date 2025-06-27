
import React from 'react';
import PMIntegrationStatus from '@/components/integration/PMIntegrationStatus';

const IntegrationStatus = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Integration Status</h1>
        <p className="text-gray-600">Monitor your PM system connections and data sync health</p>
      </div>
      
      <PMIntegrationStatus />
    </div>
  );
};

export default IntegrationStatus;
