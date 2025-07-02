
import { useEffect, useCallback } from 'react';
import { ChangeIsolator, IsolationBoundary } from '@/utils/changeIsolation';

/**
 * Hook to manage change isolation for components
 */
export const useChangeIsolation = (moduleId: string, allowedFiles: string[] = []) => {
  
  useEffect(() => {
    // Register isolation boundary for this component
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

    ChangeIsolator.registerBoundary(boundary);
    console.log('🔒 ISOLATION BOUNDARY REGISTERED:', moduleId);

    return () => {
      console.log('🔓 ISOLATION BOUNDARY REMOVED:', moduleId);
    };
  }, [moduleId, allowedFiles]);

  /**
   * Execute a change within isolation
   */
  const executeIsolatedChange = useCallback(<T>(changeFunction: () => T): T | null => {
    console.log('🛡️ EXECUTING ISOLATED CHANGE FOR:', moduleId);
    
    const sandbox = ChangeIsolator.createSandbox(moduleId);
    return sandbox.executeChange(changeFunction);
  }, [moduleId]);

  /**
   * Verify that a proposed change won't affect other modules
   */
  const verifyChangeIsolation = useCallback((target: string, affectedFiles: string[]): boolean => {
    return ChangeIsolator.enforceIsolation(target, affectedFiles);
  }, []);

  return {
    executeIsolatedChange,
    verifyChangeIsolation,
    isIsolated: true
  };
};
