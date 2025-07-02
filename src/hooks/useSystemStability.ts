
import { useEffect, useState } from 'react';
import { ChangeValidator } from '@/utils/changeValidation';
import { useChangeIsolation } from './useChangeIsolation';

/**
 * Enhanced hook to monitor system stability with complete isolation
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

  // Initialize change isolation for the stability system
  const { verifyChangeIsolation } = useChangeIsolation('SystemStability', [
    'src/hooks/useSystemStability.ts',
    'src/utils/changeValidation.ts',
    'src/utils/changeIsolation.ts'
  ]);

  useEffect(() => {
    // Monitor critical functionality with isolation verification
    const validateStability = () => {
      console.log('🔍 ENHANCED SYSTEM STABILITY CHECK WITH ISOLATION');
      
      // Verify all critical features are isolated and working
      const stable = ChangeValidator.verifyNoRegression(criticalFeatures);
      const isolationIntact = verifyChangeIsolation('SystemStability', []);
      
      const systemStable = stable && isolationIntact;
      setIsStable(systemStable);
      
      if (!systemStable) {
        console.error('🚨 SYSTEM INSTABILITY OR ISOLATION BREACH DETECTED');
        console.error('One or more critical features may be broken or isolation compromised');
      } else {
        console.log('✅ SYSTEM STABLE AND COMPLETELY ISOLATED');
      }
    };

    // Check stability every 30 seconds
    const interval = setInterval(validateStability, 30000);
    
    // Initial check
    validateStability();

    return () => clearInterval(interval);
  }, [criticalFeatures, verifyChangeIsolation]);

  return {
    isStable,
    criticalFeatures,
    validateChange: (description: string, files: string[]) => {
      const analysis = ChangeValidator.analyzeImpact(description, files);
      return analysis.isolationStatus === 'ISOLATED';
    }
  };
};
