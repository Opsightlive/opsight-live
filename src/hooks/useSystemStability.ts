
import { useEffect, useState } from 'react';
import { ChangeValidator } from '@/utils/changeValidation';

/**
 * Hook to monitor system stability and prevent destructive changes
 */
export const useSystemStability = () => {
  const [isStable, setIsStable] = useState(true);
  const [criticalFeatures] = useState([
    'Dashboard Loading',
    'KPI Data Display', 
    'Property Management Integration',
    'Data Source Connection',
    'User Authentication',
    'Real-time Updates'
  ]);

  useEffect(() => {
    // Monitor critical functionality
    const validateStability = () => {
      console.log('🔍 SYSTEM STABILITY CHECK');
      const stable = ChangeValidator.verifyNoRegression(criticalFeatures);
      setIsStable(stable);
      
      if (!stable) {
        console.error('🚨 SYSTEM INSTABILITY DETECTED');
        console.error('One or more critical features may be broken');
      }
    };

    // Check stability every 30 seconds
    const interval = setInterval(validateStability, 30000);
    
    // Initial check
    validateStability();

    return () => clearInterval(interval);
  }, [criticalFeatures]);

  return {
    isStable,
    criticalFeatures,
    validateChange: (description: string, files: string[]) => 
      ChangeValidator.analyzeImpact(description, files)
  };
};
