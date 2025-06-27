
import React from 'react';
import PMIntegrationStatus from '@/components/integration/PMIntegrationStatus';

const IntegrationStatus = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Integration Status</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Monitor your property management system connections and data sync health for your multifamily portfolio.
          </p>
        </div>
        
        <div className="container mx-auto py-6">
          <PMIntegrationStatus />
        </div>
      </div>
    </div>
  );
};

export default IntegrationStatus;
