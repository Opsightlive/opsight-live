
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { moduleMemoryService, ModuleState, ConsistencyRule, ModuleDependency } from '@/services/moduleMemoryService';
import { useAuth } from '@/hooks/useAuth';

interface ModuleMemoryContextType {
  allModuleStates: ModuleState[];
  globalConsistencyRules: ConsistencyRule[];
  moduleDependencies: ModuleDependency[];
  isLoading: boolean;
  refreshGlobalState: () => Promise<void>;
  validateGlobalConsistency: () => Promise<{ isValid: boolean; violations: string[] }>;
}

const ModuleMemoryContext = createContext<ModuleMemoryContextType | undefined>(undefined);

export const useModuleMemoryContext = () => {
  const context = useContext(ModuleMemoryContext);
  if (context === undefined) {
    throw new Error('useModuleMemoryContext must be used within a ModuleMemoryProvider');
  }
  return context;
};

interface ModuleMemoryProviderProps {
  children: ReactNode;
}

export const ModuleMemoryProvider: React.FC<ModuleMemoryProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [allModuleStates, setAllModuleStates] = useState<ModuleState[]>([]);
  const [globalConsistencyRules, setGlobalConsistencyRules] = useState<ConsistencyRule[]>([]);
  const [moduleDependencies, setModuleDependencies] = useState<ModuleDependency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshGlobalState = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      const [states, rules, dependencies] = await Promise.all([
        moduleMemoryService.getAllModuleStates(user.id),
        moduleMemoryService.getConsistencyRules(user.id),
        moduleMemoryService.getModuleDependencies(user.id)
      ]);

      setAllModuleStates(states);
      setGlobalConsistencyRules(rules);
      setModuleDependencies(dependencies);
    } catch (error) {
      console.error('Error refreshing global module state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateGlobalConsistency = async (): Promise<{ isValid: boolean; violations: string[] }> => {
    if (!user?.id) return { isValid: false, violations: ['User not authenticated'] };

    try {
      const violations: string[] = [];

      // Validate each module against global rules
      for (const moduleState of allModuleStates) {
        const validation = await moduleMemoryService.validateModuleConsistency(user.id, moduleState.module_name);
        if (!validation.isValid) {
          violations.push(...validation.violations.map(v => `${moduleState.module_name}: ${v}`));
        }
      }

      // Validate dependencies
      for (const dependency of moduleDependencies) {
        const sourceExists = allModuleStates.some(m => m.module_name === dependency.source_module);
        const targetExists = allModuleStates.some(m => m.module_name === dependency.target_module);

        if (!sourceExists) {
          violations.push(`Missing source module: ${dependency.source_module}`);
        }
        if (!targetExists) {
          violations.push(`Missing target module: ${dependency.target_module}`);
        }
      }

      return { isValid: violations.length === 0, violations };
    } catch (error) {
      console.error('Error validating global consistency:', error);
      return { isValid: false, violations: ['Error during global validation'] };
    }
  };

  useEffect(() => {
    if (user?.id) {
      refreshGlobalState();
    }
  }, [user?.id]);

  const contextValue: ModuleMemoryContextType = {
    allModuleStates,
    globalConsistencyRules,
    moduleDependencies,
    isLoading,
    refreshGlobalState,
    validateGlobalConsistency
  };

  return (
    <ModuleMemoryContext.Provider value={contextValue}>
      {children}
    </ModuleMemoryContext.Provider>
  );
};
