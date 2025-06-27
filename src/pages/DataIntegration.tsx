
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataIntegrationWizard from '@/components/integration/DataIntegrationWizard';

const DataIntegration = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    // Redirect to dashboard after successful integration
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DataIntegrationWizard onComplete={handleComplete} />
    </div>
  );
};

export default DataIntegration;
