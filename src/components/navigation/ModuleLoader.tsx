
import React, { Suspense, ComponentType, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingSpinner from '@/components/ui/loading-spinner';
import SafeModeScreen from './SafeModeScreen';

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
  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ModuleErrorFallback {...props} moduleName={moduleName} />
      )}
      onError={(error, errorInfo) => {
        console.error(`Error in ${moduleName} module:`, error, errorInfo);
        // In production, send to monitoring service
      }}
    >
      <Suspense fallback={fallback || <ModuleLoadingFallback moduleName={moduleName} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default ModuleLoader;
