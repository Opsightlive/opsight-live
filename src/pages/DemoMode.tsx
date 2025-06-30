
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DemoDataGenerator from '@/components/demo/DemoDataGenerator';
import Navigation from '@/components/layout/Navigation';

const DemoMode = () => {
  const navigate = useNavigate();

  const handleDemoGenerated = () => {
    // Set demo mode flag and redirect to dashboard
    localStorage.setItem('demoMode', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <DemoDataGenerator onGenerate={handleDemoGenerated} />
    </div>
  );
};

export default DemoMode;
