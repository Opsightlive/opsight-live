
import { useState, useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';

interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useAsyncOperation = <T>() => {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const { handleError } = useErrorHandler();

  const execute = useCallback(async (
    operation: () => Promise<T>,
    errorContext?: string
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await operation();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      
      handleError(error as Error, errorContext, {
        showToast: true,
        logToConsole: true,
        logToService: true
      });
      
      return null;
    }
  }, [handleError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
};
