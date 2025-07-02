
import { useEffect, useState } from 'react';
import { ChangeValidator } from '@/utils/changeValidation';
import { useChangeIsolation } from './useChangeIsolation';
import { supabase } from '@/integrations/supabase/client';

/**
 * Database-enforced hook to monitor system stability with complete isolation
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

  // Initialize database-enforced change isolation for the stability system
  const { verifyChangeIsolation } = useChangeIsolation('SystemStability', [
    'src/hooks/useSystemStability.ts',
    'src/utils/changeValidation.ts',
    'src/utils/changeIsolation.ts'
  ]);

  useEffect(() => {
    // Monitor critical functionality with database-enforced isolation verification
    const validateStability = async () => {
      console.log('🔍 DATABASE-ENFORCED SYSTEM STABILITY CHECK');
      
      try {
        // Check database for recent isolation violations
        const { data: violations, error } = await supabase
          .from('change_execution_log')
          .select('*')
          .eq('validation_status', 'BLOCKED')
          .gte('executed_at', new Date(Date.now() - 300000).toISOString()) // Last 5 minutes
          .limit(10);

        if (error) {
          console.error('❌ FAILED TO CHECK STABILITY:', error);
          setIsStable(false);
          return;
        }

        // Verify all critical features are isolated and working
        const stable = ChangeValidator.verifyNoRegression(criticalFeatures);
        const isolationIntact = await verifyChangeIsolation('SystemStability', []);
        const noRecentViolations = !violations || violations.length === 0;
        
        const systemStable = stable && isolationIntact && noRecentViolations;
        setIsStable(systemStable);
        
        if (!systemStable) {
          console.error('🚨 SYSTEM INSTABILITY OR DATABASE ISOLATION BREACH DETECTED');
          if (violations && violations.length > 0) {
            console.error('Recent isolation violations:', violations);
          }
        } else {
          console.log('✅ SYSTEM STABLE AND DATABASE-ENFORCED ISOLATION INTACT');
        }
      } catch (error) {
        console.error('🚨 STABILITY CHECK FAILED:', error);
        setIsStable(false);
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
    validateChange: async (description: string, files: string[]) => {
      try {
        const analysis = ChangeValidator.analyzeImpact(description, files);
        const databaseValid = await verifyChangeIsolation(description, files);
        return analysis.isolationStatus === 'ISOLATED' && databaseValid;
      } catch (error) {
        console.error('🚨 CHANGE VALIDATION FAILED:', error);
        return false;
      }
    }
  };
};
