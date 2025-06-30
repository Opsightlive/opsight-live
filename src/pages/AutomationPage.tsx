
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import AutomationDashboard from '@/components/automation/AutomationDashboard';
import { useAutomationScheduler } from '@/hooks/useAutomationScheduler';
import { useAutomationNotifications } from '@/hooks/useAutomationNotifications';

const AutomationPage = () => {
  // Initialize the real automation scheduler
  const { isRunning, lastRun } = useAutomationScheduler();
  
  // Initialize real-time notifications
  useAutomationNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Show automation status */}
      {isRunning && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 m-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            <p className="text-sm">Automation tasks are running...</p>
          </div>
        </div>
      )}
      
      <AutomationDashboard />
    </div>
  );
};

export default AutomationPage;
