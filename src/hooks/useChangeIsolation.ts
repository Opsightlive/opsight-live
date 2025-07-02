
import { useEffect, useCallback } from 'react';
import { ChangeIsolator, IsolationBoundary } from '@/utils/changeIsolation';

/**
 * Backend hook to register change isolation boundaries (not user-facing)
 */
export const useChangeIsolation = (moduleId: string, allowedFiles: string[] = []) => {
  
  useEffect(() => {
    // Register isolation boundary for this component in database (backend protection)
    const boundary: IsolationBoundary = {
      moduleId,
      allowedFiles: allowedFiles.length > 0 ? allowedFiles : [`src/components/${moduleId}/**/*`],
      protectedFunctions: [
        'Dashboard Loading',
        'KPI Data Display',
        'Property Management Integration',
        'Data Source Connection',
        'User Authentication',
        'Real-time Updates'
      ],
      isolatedScope: [moduleId]
    };

    const registerBoundary = async () => {
      try {
        await ChangeIsolator.registerBoundary(boundary);
        console.log('🔒 BACKEND ISOLATION BOUNDARY REGISTERED:', moduleId);
      } catch (error) {
        console.error('🚨 FAILED TO REGISTER BACKEND ISOLATION:', error);
      }
    };

    registerBoundary();

    return () => {
      console.log('🔓 ISOLATION BOUNDARY CLEANUP:', moduleId);
    };
  }, [moduleId, allowedFiles]);

  /**
   * Execute a change within database-enforced isolation (backend protection)
   */
  const executeIsolatedChange = useCallback(async <T>(changeFunction: () => T): Promise<T | null> => {
    console.log('🛡️ EXECUTING BACKEND-ISOLATED CHANGE FOR:', moduleId);
    
    const sandbox = ChangeIsolator.createSandbox(moduleId);
    return await sandbox.executeChange(changeFunction);
  }, [moduleId]);

  /**
   * Verify that a proposed change won't affect other modules using database
   */
  const verifyChangeIsolation = useCallback(async (target: string, affectedFiles: string[]): Promise<boolean> => {
    return await ChangeIsolator.enforceIsolation(target, affectedFiles);
  }, []);

  return {
    executeIsolatedChange,
    verifyChangeIsolation,
    isIsolated: true
  };
};
