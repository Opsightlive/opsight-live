
import { useState, useEffect, useCallback } from 'react';
import { moduleMemoryService, ModuleState, FeatureHistory, ConsistencyRule } from '@/services/moduleMemoryService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface UseModuleMemoryOptions {
  moduleName: string;
  autoSave?: boolean;
  validationEnabled?: boolean;
}

export const useModuleMemory = ({ 
  moduleName, 
  autoSave = true, 
  validationEnabled = true 
}: UseModuleMemoryOptions) => {
  const { user } = useAuth();
  const [moduleState, setModuleState] = useState<ModuleState | null>(null);
  const [featureHistory, setFeatureHistory] = useState<FeatureHistory[]>([]);
  const [consistencyRules, setConsistencyRules] = useState<ConsistencyRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load module state and related data
  const loadModuleData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      const [state, history, rules] = await Promise.all([
        moduleMemoryService.getModuleState(user.id, moduleName),
        moduleMemoryService.getFeatureHistory(user.id, moduleName, 20),
        moduleMemoryService.getConsistencyRules(user.id)
      ]);

      setModuleState(state);
      setFeatureHistory(history);
      setConsistencyRules(rules);

      // Validate consistency if enabled
      if (validationEnabled && state) {
        const validation = await moduleMemoryService.validateModuleConsistency(user.id, moduleName);
        setValidationErrors(validation.violations);
        
        if (!validation.isValid) {
          console.warn(`Module ${moduleName} has consistency violations:`, validation.violations);
        }
      }
    } catch (error) {
      console.error('Error loading module data:', error);
      toast.error('Failed to load module memory');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, moduleName, validationEnabled]);

  // Save module state
  const saveModuleState = useCallback(async (
    updates: Partial<Omit<ModuleState, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ) => {
    if (!user?.id) return false;

    try {
      const updatedState: Omit<ModuleState, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
        module_name: moduleName,
        module_version: '1.0.0',
        configuration: {},
        feature_flags: {},
        data_schema: {},
        ui_layout: {},
        business_logic: {},
        is_active: true,
        ...moduleState,
        ...updates
      };

      const success = await moduleMemoryService.saveModuleState(user.id, updatedState);
      
      if (success) {
        // Record the change in history
        await moduleMemoryService.recordFeatureChange(user.id, {
          module_name: moduleName,
          feature_name: 'module_state',
          change_type: moduleState ? 'updated' : 'created',
          previous_state: moduleState || undefined,
          new_state: updatedState,
          change_description: `Module state ${moduleState ? 'updated' : 'created'}`
        });

        // Reload data to get fresh state
        await loadModuleData();
        toast.success('Module state saved successfully');
      }

      return success;
    } catch (error) {
      console.error('Error saving module state:', error);
      toast.error('Failed to save module state');
      return false;
    }
  }, [user?.id, moduleName, moduleState, loadModuleData]);

  // Update specific configuration
  const updateConfiguration = useCallback(async (configKey: string, configValue: any) => {
    if (!moduleState) return false;

    const newConfiguration = {
      ...moduleState.configuration,
      [configKey]: configValue
    };

    return await saveModuleState({ configuration: newConfiguration });
  }, [moduleState, saveModuleState]);

  // Update feature flags
  const updateFeatureFlag = useCallback(async (flagName: string, enabled: boolean) => {
    if (!moduleState) return false;

    const newFeatureFlags = {
      ...moduleState.feature_flags,
      [flagName]: enabled
    };

    return await saveModuleState({ feature_flags: newFeatureFlags });
  }, [moduleState, saveModuleState]);

  // Update UI layout
  const updateUILayout = useCallback(async (layoutKey: string, layoutValue: any) => {
    if (!moduleState) return false;

    const newUILayout = {
      ...moduleState.ui_layout,
      [layoutKey]: layoutValue
    };

    return await saveModuleState({ ui_layout: newUILayout });
  }, [moduleState, saveModuleState]);

  // Record feature change manually
  const recordChange = useCallback(async (
    featureName: string,
    changeType: FeatureHistory['change_type'],
    newState: Record<string, any>,
    previousState?: Record<string, any>,
    description?: string
  ) => {
    if (!user?.id) return false;

    return await moduleMemoryService.recordFeatureChange(user.id, {
      module_name: moduleName,
      feature_name: featureName,
      change_type: changeType,
      new_state: newState,
      previous_state: previousState,
      change_description: description
    });
  }, [user?.id, moduleName]);

  // Initialize on mount
  useEffect(() => {
    loadModuleData();
  }, [loadModuleData]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !moduleState || !user?.id) return;

    const autoSaveTimer = setTimeout(() => {
      // Auto-save logic can be implemented here if needed
    }, 5000); // Auto-save every 5 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [autoSave, moduleState, user?.id]);

  return {
    // State
    moduleState,
    featureHistory,
    consistencyRules,
    isLoading,
    validationErrors,
    
    // Actions
    saveModuleState,
    updateConfiguration,
    updateFeatureFlag,
    updateUILayout,
    recordChange,
    reloadData: loadModuleData,
    
    // Computed properties
    hasValidationErrors: validationErrors.length > 0,
    isModuleActive: moduleState?.is_active ?? false,
    moduleVersion: moduleState?.module_version ?? '1.0.0'
  };
};
