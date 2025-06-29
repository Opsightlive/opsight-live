
import React, { Suspense, ReactNode, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingSpinner from '@/components/ui/loading-spinner';
import SafeModeScreen from './SafeModeScreen';
import { useModuleMemory } from '@/hooks/useModuleMemory';
import { useAuth } from '@/contexts/AuthContext';

interface ModuleLoaderProps {
  children: ReactNode;
  moduleName: string;
  fallback?: ReactNode;
}

const ModuleLoadingFallback: React.FC<{ moduleName: string }> = ({ moduleName }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm text-gray-600">Loading {moduleName}...</p>
    </div>
  </div>
);

const ModuleErrorFallback: React.FC<{ 
  error: Error; 
  resetErrorBoundary: () => void; 
  moduleName: string;
}> = ({ error, resetErrorBoundary, moduleName }) => (
  <SafeModeScreen 
    moduleName={moduleName}
    error={error}
    onRetry={resetErrorBoundary}
  />
);

const ModuleLoader: React.FC<ModuleLoaderProps> = ({ 
  children, 
  moduleName, 
  fallback 
}) => {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    moduleState,
    saveModuleState,
    isLoading: memoryLoading,
    validationErrors,
    hasValidationErrors
  } = useModuleMemory({
    moduleName,
    autoSave: true,
    validationEnabled: true
  });

  // Initialize module state if it doesn't exist
  useEffect(() => {
    const initializeModule = async () => {
      if (user?.id && !moduleState && !memoryLoading) {
        console.log(`Initializing module memory for: ${moduleName}`);
        
        // Create default module state
        const defaultState = {
          module_name: moduleName,
          module_version: '1.0.0',
          configuration: {
            initialized: true,
            initializationDate: new Date().toISOString()
          },
          feature_flags: {
            enabled: true,
            safeMode: false
          },
          data_schema: {},
          ui_layout: {
            theme: 'default',
            layout: 'standard'
          },
          business_logic: {
            rules: [],
            workflows: []
          },
          is_active: true
        };

        await saveModuleState(defaultState);
      }
      setIsInitialized(true);
    };

    initializeModule();
  }, [user?.id, moduleState, memoryLoading, moduleName, saveModuleState]);

  // Log validation errors
  useEffect(() => {
    if (hasValidationErrors) {
      console.warn(`Module ${moduleName} has validation errors:`, validationErrors);
    }
  }, [moduleName, hasValidationErrors, validationErrors]);

  // Show loading while memory system initializes
  if (!isInitialized || memoryLoading) {
    return fallback || <ModuleLoadingFallback moduleName={moduleName} />;
  }

  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ModuleErrorFallback {...props} moduleName={moduleName} />
      )}
      onError={(error, errorInfo) => {
        console.error(`Error in ${moduleName} module:`, error, errorInfo);
        
        // Record error in module memory if possible
        if (user?.id && moduleState) {
          // This would be handled by the memory service if needed
          console.log(`Recording error for module ${moduleName}`);
        }
      }}
    >
      <Suspense fallback={fallback || <ModuleLoadingFallback moduleName={moduleName} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default ModuleLoader;
